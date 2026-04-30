import { NextResponse } from "next/server";

const EVENT_NAME_RE = /^[a-z0-9][a-z0-9_:-]{1,80}$/i;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = typeof body.event === "string" ? body.event.trim() : "";

    if (!EVENT_NAME_RE.test(event)) {
      return NextResponse.json({ ok: false, error: "Invalid event" }, { status: 400 });
    }

    console.log(
      JSON.stringify({
        type: "analytics_event",
        event,
        path: typeof body.path === "string" ? body.path : null,
        referrer: typeof body.referrer === "string" ? body.referrer : null,
        properties: sanitizeProperties(body.properties),
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}

function sanitizeProperties(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).slice(0, 20).map(([key, item]) => {
      if (typeof item === "string") return [key, item.slice(0, 200)];
      if (typeof item === "number" || typeof item === "boolean" || item === null) return [key, item];
      return [key, String(item).slice(0, 200)];
    }),
  );
}
