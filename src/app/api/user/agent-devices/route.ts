import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId || !supabaseAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: devices, error } = await supabaseAdmin
      .from("agent_devices")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ devices: devices || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId || !supabaseAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const action = req.nextUrl.searchParams.get("action");

    if (action === "create") {
      const apiKey = `sk_${randomBytes(24).toString("hex")}`;
      const { data, error } = await supabaseAdmin
        .from("agent_devices")
        .insert({
          agent_api_key: apiKey,
          user_id: userId,
          device_name: "My Phone",
          is_active: true,
        })
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json({ device: data });
    }

    if (action === "update") {
      const body = await req.json();
      const deviceId = body.id;
      
      const { data, error } = await supabaseAdmin
        .from("agent_devices")
        .update({
          notification_provider: body.notification_provider,
          device_id: body.device_id, // Target Key for Bark/Pushcut
          tts_enabled: body.tts_enabled,
          tts_quiet_hours_start: body.tts_quiet_hours_start,
          tts_quiet_hours_end: body.tts_quiet_hours_end,
        })
        .eq("id", deviceId)
        .eq("user_id", userId)
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json({ device: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
