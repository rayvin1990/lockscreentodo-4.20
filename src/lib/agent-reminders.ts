import { z } from "zod";
import {
  createAgentReminder,
  getAgentRemindersForUser,
  getLockscreenQueueForUser,
  clearAgentReminder as dbClearAgentReminder,
  clearAllAgentReminders as dbClearAllAgentReminders,
} from "./agent-db";
import { sendPushNotification, type NotificationProvider } from "./notifications";

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
  ttsText: z.string().trim().max(200).nullable().optional(),
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

export async function addAgentReminders(
  reminders: AgentReminder[], 
  userId: string, 
  agentDeviceId?: string,
  notification?: {
    provider: any;
    target: string;
    apiKey: string;
  }
) {
  const inserted = [];
  
  for (const reminder of reminders) {
    const created = await createAgentReminder({
      userId,
      agentDeviceId,
      title: reminder.title,
      note: reminder.note,
      ttsText: reminder.ttsText,
      kind: reminder.kind,
      priority: reminder.priority,
      dueAt: reminder.dueAt,
      location: reminder.location,
      requiresHuman: reminder.requiresHuman,
      expiresAt: reminder.expiresAt,
      source: reminder.source,
      externalId: reminder.id,
    });
    if (created) inserted.push(mapDbReminder(created));
  }

  const lockscreenQueue = await getLockscreenQueue(userId);

  // Trigger push notification if configured
  if (notification?.target && inserted.length > 0) {
    const topReminder = inserted[0];
    const isCritical = topReminder.priority === "critical" || topReminder.priority === "high";
    
    await sendPushNotification(notification.provider as NotificationProvider, notification.target, {
      title: isCritical ? `🚨 ${topReminder.title}` : `📌 ${topReminder.title}`,
      body: inserted.length > 1 
        ? `And ${inserted.length - 1} other tasks added to your lock screen.`
        : (topReminder.note || "New agent task pushed to your lock screen."),
      url: `shortcut://run-shortcut?name=Update%20Lockscreen&input=${encodeURIComponent(notification.apiKey)}`,
      level: isCritical ? "timeSensitive" : "active",
      group: "agent-reminders",
      priority: topReminder.priority,
      kind: topReminder.kind,
    });
  }

  return {
    accepted: inserted.length,
    reminders: inserted,
    lockscreenQueue,
  };
}

export async function getStoredAgentReminders(userId: string) {
  const data = await getAgentRemindersForUser(userId);
  return data.map(mapDbReminder);
}

export async function clearAgentReminders(payload: unknown, userId: string) {
  const parsed = clearReminderSchema.parse(payload || {});
  
  if (parsed.all) {
    const cleared = await dbClearAllAgentReminders(userId);
    return {
      cleared: cleared ? "all" : 0,
      reminders: [],
      lockscreenQueue: [],
    };
  }

  if (!parsed.id) {
    throw new Error("clear_lockscreen_reminder requires id or all=true");
  }

  const cleared = await dbClearAgentReminder(parsed.id, userId);
  const lockscreenQueue = await getLockscreenQueue(userId);

  return {
    cleared: cleared ? 1 : 0,
    lockscreenQueue,
  };
}

export async function getLockscreenQueue(userId: string): Promise<AgentReminder[]> {
  const data = await getLockscreenQueueForUser(userId);
  return data.map(mapDbReminder);
}

export async function renderLockscreenPreview(payload: unknown = {}, userId?: string): Promise<LockscreenPreview> {
  const parsed = renderLockscreenPreviewSchema.parse(payload || {});
  
  let previewReminders: AgentReminder[];
  
  if (parsed.reminders) {
    // If reminders are provided in the payload, use them (transient preview)
    const now = Date.now();
    previewReminders = parseReminderPayload({ reminders: parsed.reminders })
      .filter((reminder) => !reminder.expiresAt || Date.parse(reminder.expiresAt) > now)
      .filter(shouldShowOnLockscreen)
      .sort(compareReminderPriority)
      .slice(0, 5);
  } else if (userId) {
    // Otherwise, fetch from DB
    previewReminders = await getLockscreenQueue(userId);
  } else {
    previewReminders = [];
  }

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

function mapDbReminder(db: any): AgentReminder {
  return {
    id: db.id,
    source: db.source,
    title: db.title,
    note: db.note,
    ttsText: db.tts_text,
    kind: db.kind,
    priority: db.priority,
    dueAt: db.due_at,
    location: db.location,
    requiresHuman: db.requires_human,
    expiresAt: db.expires_at,
    createdAt: db.created_at,
  };
}
