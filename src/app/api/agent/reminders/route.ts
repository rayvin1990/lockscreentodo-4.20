import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createAgentReminder,
  getAgentRemindersForUser,
  getLockscreenQueueForUser,
  clearAgentReminder,
  clearAllAgentReminders,
  getUserByAgentApiKey,
  updateAgentDeviceLastSeen,
  supabaseAgent,
} from "~/lib/agent-db";
import { parseReminderPayload, reminderPrioritySchema } from "~/lib/agent-reminders";

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

  const reminders = await getAgentRemindersForUser(device.user_id);
  const lockscreenQueue = await getLockscreenQueueForUser(device.user_id);

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

    const inserted = [];
    for (const reminder of parsedReminders) {
      const created = await createAgentReminder({
        userId: device.user_id,
        agentDeviceId: device.id,
        title: reminder.title,
        note: reminder.note,
        kind: reminder.kind,
        priority: reminder.priority,
        dueAt: reminder.dueAt,
        location: reminder.location,
        requiresHuman: reminder.requiresHuman,
        expiresAt: reminder.expiresAt,
        source: reminder.source,
        externalId: reminder.id,
      });
      if (created) inserted.push(created);
    }

    // Update last seen
    await updateAgentDeviceLastSeen(device.id);

    const lockscreenQueue = await getLockscreenQueueForUser(device.user_id);

    console.log(
      JSON.stringify({
        type: "agent_reminders_created",
        userId: device.user_id,
        deviceId: device.id,
        accepted: inserted.length,
        lockscreenQueueSize: lockscreenQueue.length,
        sources: [...new Set(parsedReminders.map(r => r.source))],
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({
      ok: true,
      authMode: "api_key",
      accepted: inserted.length,
      lockscreenQueue,
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

  if (all) {
    const cleared = await clearAllAgentReminders(device.user_id);
    return NextResponse.json({ ok: cleared, cleared: all ? "all" : 0 });
  }

  if (!id) {
    return NextResponse.json({ ok: false, error: "id or all=true required" }, { status: 400 });
  }

  const cleared = await clearAgentReminder(id, device.user_id);
  const lockscreenQueue = await getLockscreenQueueForUser(device.user_id);

  return NextResponse.json({ ok: cleared, lockscreenQueue });
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