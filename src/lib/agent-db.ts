import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

// Agent-facing Supabase client (bypasses RLS for API key auth)
export const supabaseAgent = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export async function getUserByAgentApiKey(apiKey: string) {
  if (!supabaseAgent) return null;

  const { data, error } = await supabaseAgent
    .from("agent_devices")
    .select("*, User(id, email)")
    .eq("agent_api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data as {
    id: string;
    user_id: string;
    agent_api_key: string;
    device_name: string;
    device_id: string | null;
    notification_provider: string | null;
    tts_enabled: boolean;
    tts_quiet_hours_start: string | null;
    tts_quiet_hours_end: string | null;
    User: { id: string; email: string };
  };
}

export async function createAgentReminder(params: {
  userId: string;
  agentDeviceId?: string;
  title: string;
  note?: string | null;
  ttsText?: string | null;
  kind: string;
  priority: string;
  dueAt?: string | null;
  location?: string | null;
  requiresHuman?: boolean;
  expiresAt?: string | null;
  source?: string;
  externalId?: string;
}) {
  if (!supabaseAgent) return null;

  const { data, error } = await supabaseAgent
    .from("reminders")
    .insert({
      user_id: params.userId,
      agent_device_id: params.agentDeviceId,
      title: params.title,
      note: params.note,
      tts_text: params.ttsText,
      kind: params.kind,
      priority: params.priority,
      due_at: params.dueAt,
      location: params.location,
      requires_human: params.requiresHuman ?? true,
      expires_at: params.expiresAt,
      source: params.source ?? "agent",
      external_id: params.externalId,
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function getAgentRemindersForUser(userId: string, limit = 100) {
  if (!supabaseAgent) return [];

  const { data, error } = await supabaseAgent
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function getLockscreenQueueForUser(userId: string) {
  if (!supabaseAgent) return [];

  const now = new Date().toISOString();

  const { data, error } = await supabaseAgent
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .in("priority", ["high", "critical"])
    .in("kind", ["medication", "errand", "document", "appointment", "family", "payment", "travel"])
    .order("priority", { ascending: false })
    .limit(5);

  if (error) return [];
  return data || [];
}

export async function clearAgentReminder(reminderId: string, userId: string) {
  if (!supabaseAgent) return false;

  const { error } = await supabaseAgent
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("user_id", userId);

  return !error;
}

export async function clearAllAgentReminders(userId: string) {
  if (!supabaseAgent) return false;

  const { error } = await supabaseAgent
    .from("reminders")
    .delete()
    .eq("user_id", userId);

  return !error;
}

export async function updateAgentDeviceLastSeen(deviceId: string) {
  if (!supabaseAgent) return;

  await supabaseAgent
    .from("agent_devices")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", deviceId);
}