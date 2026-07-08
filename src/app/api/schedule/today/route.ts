import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

/**
 * GET /api/schedule/today
 *
 * Fallback endpoint for when the local daemon is not running.
 * Returns today's active plan from Supabase.
 */
export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("daily_plans")
      .select("*")
      .eq("plan_date", today)
      .eq("status", "active")
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found – not an error
        return NextResponse.json({ plan: null });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plan: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/schedule/today
 *
 * Triggers the daemon to regenerate today's plan.
 * Call this from a cron job or webhook.
 */
export async function POST() {
  // Forward to local daemon if available
  const daemonUrl = process.env.DAEMON_URL || "http://localhost:8767";

  try {
    const res = await fetch(`${daemonUrl}/api/plan/generate`, {
      method: "POST",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Daemon returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Daemon not reachable – can't generate without it
    return NextResponse.json(
      {
        error: "Daemon not reachable",
        message: "Start the daemon with: npm run scheduler:daemon",
      },
      { status: 503 }
    );
  }
}
