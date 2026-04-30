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
  getStoredAgentReminders,
  parseReminderPayload,
} from "~/lib/agent-reminders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function verifyAgentRequest(req: Request) {
  const providedKey = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
                     req.headers.get("x-agent-api-key");

  if (!providedKey || !supabaseAgent) return null;

  const device = await getUserByAgentApiKey(providedKey);
  return device;
}

export async function GET(req: Request) {
  const device = await verifyAgentRequest(req);
  if (!device) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const reminders = await getStoredAgentReminders(device.user_id);
  const lockscreenQueue = await getLockscreenQueue(device.user_id);

  return NextResponse.json({
    ok: true,
    authMode: "api_key",
    deviceId: device.id,
    reminders,
    lockscreenQueue,
  });
}

export async function POST(req: Request) {
  const device = await verifyAgentRequest(req);
  if (!device) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const parsedReminders = parseReminderPayload(payload);
    const result = await addAgentReminders(parsedReminders, device.user_id, device.id, {
      provider: (device.notification_provider || "bark") as any,
      target: device.device_id || "",
      apiKey: device.agent_api_key,
    });

    // Update last seen
    await updateAgentDeviceLastSeen(device.id);

    console.log(
      JSON.stringify({
        type: "agent_reminders_created",
        userId: device.user_id,
        deviceId: device.id,
        accepted: result.accepted,
        lockscreenQueueSize: result.lockscreenQueue.length,
        sources: [...new Set(parsedReminders.map(r => r.source))],
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({
      ok: true,
      authMode: "api_key",
      accepted: result.accepted,
      lockscreenQueue: result.lockscreenQueue,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid reminder payload", issues: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const device = await verifyAgentRequest(req);
  if (!device) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const all = url.searchParams.get("all") === "true";

  const result = await clearAgentReminders({ id, all }, device.user_id);

  return NextResponse.json({
    ok: true,
    cleared: result.cleared,
    lockscreenQueue: result.lockscreenQueue,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-agent-api-key",
    },
  });
}