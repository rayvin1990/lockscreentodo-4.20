import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  const { userId } = await getAuth(req);

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ ok: false, error: "Storage not configured" }, { status: 503 });
  }

  const { deviceName } = await req.json().catch(() => ({ deviceName: "Default Device" }));

  // Generate a secure API key
  const apiKey = `lst_${randomBytes(24).toString("base64url")}`;
  const apiKeyPrefix = apiKey.substring(0, 12);

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check how many devices this user already has
  const { count } = await supabase
    .from("agent_devices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Free plan: max 2 devices. Pro: unlimited
  // For now, just check user subscription in User table
  const { data: user } = await supabase
    .from("User")
    .select("isPro")
    .eq("id", userId)
    .single();

  const maxDevices = user?.isPro ? 10 : 2;

  if ((count || 0) >= maxDevices) {
    return NextResponse.json({
      ok: false,
      error: `Device limit reached (${maxDevices}). Upgrade to Pro for more.`,
    }, { status: 403 });
  }

  // Create new agent device
  const { data: device, error } = await supabase
    .from("agent_devices")
    .insert({
      user_id: userId,
      device_name: deviceName,
      agent_api_key: apiKey,
      agent_api_key_prefix: apiKeyPrefix,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    deviceId: device.id,
    apiKey,  // Only returned once on creation!
    apiKeyPrefix,
    deviceName,
    maxDevices,
    currentDevices: (count || 0) + 1,
  });
}

export async function GET(req: NextRequest) {
  const { userId } = await getAuth(req);

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ ok: false, error: "Storage not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: devices, error } = await supabase
    .from("agent_devices")
    .select("id, device_name, agent_api_key_prefix, is_active, last_seen_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    devices: devices || [],
    total: devices?.length || 0,
  });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await getAuth(req);

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const deviceId = url.searchParams.get("id");

  if (!deviceId) {
    return NextResponse.json({ ok: false, error: "Device ID required" }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ ok: false, error: "Storage not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Only delete if belongs to this user
  const { error } = await supabase
    .from("agent_devices")
    .delete()
    .eq("id", deviceId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}