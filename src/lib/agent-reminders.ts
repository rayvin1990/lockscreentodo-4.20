import { z } from "zod";

export const reminderKindSchema = z.enum([
  "medication",
  "grocery",
  "errand",
  "document",
  "appointment",
  "family",
  "payment",
  "travel",
  "other",
]);

export const reminderPrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const agentReminderSchema = z.object({
  id: z.string().trim().min(1).max(120).optional(),
  source: z.string().trim().min(1).max(80).default("agent"),
  title: z.string().trim().min(1).max(160),
  note: z.string().trim().max(500).nullable().optional(),
  kind: reminderKindSchema.default("other"),
  priority: reminderPrioritySchema.default("medium"),
  dueAt: z.string().datetime({ offset: true }).nullable().optional(),
  location: z.string().trim().max(160).nullable().optional(),
  requiresHuman: z.boolean().default(true),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const agentReminderBatchSchema = z.object({
  reminders: z.array(agentReminderSchema).min(1).max(20),
});

export const clearReminderSchema = z.object({
  id: z.string().trim().min(1).max(120).optional(),
  all: z.boolean().default(false),
});

export const renderLockscreenPreviewSchema = z.object({
  title: z.string().trim().min(1).max(80).default("Lockscreen MCP"),
  reminders: z.array(agentReminderSchema).min(1).max(20).optional(),
});

export type AgentReminder = z.infer<typeof agentReminderSchema> & {
  id: string;
  createdAt: string;
};

export type LockscreenPreview = {
  title: string;
  generatedAt: string;
  reminders: AgentReminder[];
  text: string;
};

const highValueKinds = new Set([
  "medication",
  "errand",
  "document",
  "appointment",
  "family",
  "payment",
  "travel",
]);

const globalStore = globalThis as typeof globalThis & {
  __lockscreenAgentReminders?: AgentReminder[];
};

export function parseReminderPayload(payload: unknown): AgentReminder[] {
  const wrapped = normalizePayloadShape(payload);
  const parsed = agentReminderBatchSchema.parse(wrapped);
  const createdAt = new Date().toISOString();

  return parsed.reminders.map((reminder) => ({
    ...reminder,
    id: reminder.id || createReminderId(),
    createdAt,
  }));
}

export function addAgentReminders(reminders: AgentReminder[]) {
  const existing = globalStore.__lockscreenAgentReminders || [];
  const next = [...reminders, ...existing]
    .filter((reminder, index, list) => list.findIndex((item) => item.id === reminder.id) === index)
    .slice(0, 100);

  globalStore.__lockscreenAgentReminders = next;

  return {
    accepted: reminders.length,
    reminders: next,
    lockscreenQueue: getLockscreenQueue(next),
  };
}

export function getStoredAgentReminders() {
  return globalStore.__lockscreenAgentReminders || [];
}

export function clearAgentReminders(payload: unknown) {
  const parsed = clearReminderSchema.parse(payload || {});
  const existing = getStoredAgentReminders();

  if (parsed.all) {
    globalStore.__lockscreenAgentReminders = [];

    return {
      cleared: existing.length,
      reminders: [],
      lockscreenQueue: [],
    };
  }

  if (!parsed.id) {
    throw new Error("clear_lockscreen_reminder requires id or all=true");
  }

  const next = existing.filter((reminder) => reminder.id !== parsed.id);
  globalStore.__lockscreenAgentReminders = next;

  return {
    cleared: existing.length - next.length,
    reminders: next,
    lockscreenQueue: getLockscreenQueue(next),
  };
}

export function getLockscreenQueue(reminders = getStoredAgentReminders()) {
  const now = Date.now();

  return reminders
    .filter((reminder) => !reminder.expiresAt || Date.parse(reminder.expiresAt) > now)
    .filter(shouldShowOnLockscreen)
    .sort(compareReminderPriority)
    .slice(0, 5);
}

export function renderLockscreenPreview(payload: unknown = {}): LockscreenPreview {
  const parsed = renderLockscreenPreviewSchema.parse(payload || {});
  const previewReminders = parsed.reminders
    ? getLockscreenQueue(parseReminderPayload({ reminders: parsed.reminders }))
    : getLockscreenQueue();
  const generatedAt = new Date().toISOString();
  const lines = [
    parsed.title,
    new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(generatedAt)),
    "",
    ...previewReminders.map((reminder, index) => {
      const due = reminder.dueAt ? ` due ${formatShortTime(reminder.dueAt)}` : "";
      const location = reminder.location ? ` @ ${reminder.location}` : "";
      return `${index + 1}. [${reminder.priority}] ${reminder.title}${due}${location}`;
    }),
  ];

  return {
    title: parsed.title,
    generatedAt,
    reminders: previewReminders,
    text: lines.join("\n").trim(),
  };
}

export function shouldShowOnLockscreen(reminder: AgentReminder) {
  if (!reminder.requiresHuman) return false;
  if (reminder.priority === "critical" || reminder.priority === "high") return true;
  if (highValueKinds.has(reminder.kind)) return true;
  if (reminder.location) return true;
  if (reminder.dueAt && isToday(reminder.dueAt)) return true;
  return false;
}

export function verifyAgentRequest(req: Request) {
  const configuredKey = process.env.AGENT_API_KEY || process.env.LOCKSCREEN_AGENT_API_KEY;
  const providedKey = readBearerToken(req) || req.headers.get("x-agent-api-key");

  if (configuredKey) {
    return providedKey === configuredKey;
  }

  return process.env.NODE_ENV !== "production";
}

export function getAgentAuthMode() {
  if (process.env.AGENT_API_KEY || process.env.LOCKSCREEN_AGENT_API_KEY) {
    return "api_key";
  }

  return process.env.NODE_ENV === "production" ? "missing" : "dev_open";
}

function normalizePayloadShape(payload: unknown) {
  if (payload && typeof payload === "object" && "reminders" in payload) {
    return payload;
  }

  return { reminders: [payload] };
}

function createReminderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `rem_${crypto.randomUUID()}`;
  }

  return `rem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readBearerToken(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function isToday(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function compareReminderPriority(a: AgentReminder, b: AgentReminder) {
  const rank = { critical: 4, high: 3, medium: 2, low: 1 };
  const priorityDelta = rank[b.priority] - rank[a.priority];
  if (priorityDelta !== 0) return priorityDelta;

  const aDue = a.dueAt ? Date.parse(a.dueAt) : Number.POSITIVE_INFINITY;
  const bDue = b.dueAt ? Date.parse(b.dueAt) : Number.POSITIVE_INFINITY;
  return aDue - bDue;
}

function formatShortTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
