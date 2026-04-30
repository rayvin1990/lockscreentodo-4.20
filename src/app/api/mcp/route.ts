import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getUserByAgentApiKey,
  updateAgentDeviceLastSeen,
  supabaseAgent,
} from "~/lib/agent-db";
import {
  addAgentReminders,
  clearAgentReminders,
  getLockscreenQueue,
  parseReminderPayload,
  renderLockscreenPreview,
} from "~/lib/agent-reminders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const serverInfo = {
  name: "lockscreentodo-agent",
  version: "0.1.0",
};

const reminderInputSchema = {
  type: "object",
  properties: {
    reminders: {
      type: "array",
      minItems: 1,
      maxItems: 20,
      items: {
        type: "object",
        required: ["title"],
        properties: {
          id: { type: "string" },
          source: { type: "string", default: "agent" },
          title: { type: "string", minLength: 1, maxLength: 160 },
          note: { type: ["string", "null"] },
          ttsText: { type: ["string", "null"], maxLength: 200 },
          kind: {
            type: "string",
            enum: ["medication", "grocery", "errand", "document", "appointment", "family", "payment", "travel", "other"],
            default: "other",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
          },
          dueAt: { type: ["string", "null"], format: "date-time" },
          location: { type: ["string", "null"] },
          requiresHuman: { type: "boolean", default: true },
          expiresAt: { type: ["string", "null"], format: "date-time" },
        },
      },
    },
  },
  required: ["reminders"],
};

const clearReminderInputSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Reminder id to clear. Required unless all=true.",
    },
    all: {
      type: "boolean",
      default: false,
      description: "Clear every stored reminder for this device.",
    },
  },
  anyOf: [{ required: ["id"] }, { required: ["all"] }],
};

const renderPreviewInputSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      default: "Lockscreen MCP",
      description: "Short heading for the rendered preview.",
    },
    reminders: reminderInputSchema.properties.reminders,
  },
};

async function verifyAgentRequest(req: Request) {
  const providedKey = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
                     req.headers.get("x-agent-api-key");

  if (!providedKey || !supabaseAgent) return null;
  return await getUserByAgentApiKey(providedKey);
}

export async function POST(req: Request) {
  if (!await verifyAgentRequest(req)) {
    return jsonRpcError(null, -32001, "Unauthorized", 401);
  }

  let message: JsonRpcRequest;

  try {
    message = await req.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error", 400);
  }

  const id: JsonRpcId =
    typeof message.id === "string" || typeof message.id === "number" || message.id === null
      ? message.id
      : null;

  try {
    if (message.method === "initialize") {
      return jsonRpcResult(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo,
      });
    }

    if (message.method === "tools/list") {
      return jsonRpcResult(id, {
        tools: [
          {
            name: "push_lockscreen_reminders",
            description:
              "Push real-world human tasks discovered by an agent into the LockscreenTodo reminder queue.",
            inputSchema: reminderInputSchema,
          },
          {
            name: "get_lockscreen_queue",
            description: "Return the active reminders that should appear on the user's lock screen.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "clear_lockscreen_reminder",
            description: "Clear one reminder by id, or clear the whole lockscreen queue with all=true.",
            inputSchema: clearReminderInputSchema,
          },
          {
            name: "render_lockscreen_preview",
            description:
              "Render the current lockscreen queue, or a supplied reminder list, into a compact text preview.",
            inputSchema: renderPreviewInputSchema,
          },
        ],
      });
    }

    if (message.method === "tools/call") {
      return handleToolCall(id, message.params, req);
    }

    return jsonRpcError(id, -32601, "Method not found", 404);
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonRpcError(id, -32602, "Invalid params", 400, error.issues);
    }

    if (error instanceof Error) {
      return jsonRpcError(id, -32602, error.message, 400);
    }

    return jsonRpcError(id, -32603, "Internal error", 500);
  }
}

async function handleToolCall(id: JsonRpcId, params: unknown, req: Request) {
  const device = await verifyAgentRequest(req);
  if (!device) {
    return jsonRpcError(id, -32001, "Unauthorized", 401);
  }

  const toolParams = params && typeof params === "object" ? (params as Record<string, unknown>) : {};
  const name = typeof toolParams.name === "string" ? toolParams.name : "";
  const args = toolParams.arguments || {};

  if (name === "push_lockscreen_reminders") {
    const reminders = parseReminderPayload(args);
    const result = await addAgentReminders(reminders, device.user_id, device.id, {
      provider: (device.notification_provider || "bark") as any,
      target: device.device_id || "",
      apiKey: device.agent_api_key,
    });

    await updateAgentDeviceLastSeen(device.id);

    return jsonRpcResult(id, {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              accepted: result.accepted,
              lockscreenQueue: result.lockscreenQueue,
            },
            null,
            2,
          ),
        },
      ],
    });
  }

  if (name === "get_lockscreen_queue") {
    const lockscreenQueue = await getLockscreenQueue(device.user_id);
    return jsonRpcResult(id, {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: true, lockscreenQueue }, null, 2),
        },
      ],
    });
  }

  if (name === "clear_lockscreen_reminder") {
    const result = await clearAgentReminders(args, device.user_id);

    return jsonRpcResult(id, {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: true, cleared: result.cleared, lockscreenQueue: result.lockscreenQueue }, null, 2),
        },
      ],
    });
  }

  if (name === "render_lockscreen_preview") {
    const preview = await renderLockscreenPreview(args, device.user_id);

    return jsonRpcResult(id, {
      content: [
        {
          type: "text",
          text: preview.text,
        },
        {
          type: "text",
          text: JSON.stringify({ ok: true, preview }, null, 2),
        },
      ],
    });
  }

  return jsonRpcError(id, -32602, "Unknown tool", 400);
}

function jsonRpcResult(id: JsonRpcId, result: unknown, status = 200) {
  return NextResponse.json({ jsonrpc: "2.0", id, result }, { status });
}

function jsonRpcError(id: JsonRpcId, code: number, message: string, status: number, data?: unknown) {
  return NextResponse.json(
    {
      jsonrpc: "2.0",
      id,
      error: { code, message, ...(data ? { data } : {}) },
    },
    { status },
  );
}

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc?: "2.0";
  id?: JsonRpcId;
  method?: string;
  params?: unknown;
};