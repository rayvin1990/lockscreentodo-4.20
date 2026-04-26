import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getServerEnvValue } from "~/lib/server-env";

const supabaseUrl = getServerEnvValue("NEXT_PUBLIC_SUPABASE_URL") || '';
const supabaseServiceKey =
  getServerEnvValue("SUPABASE_SERVICE_ROLE_KEY") ||
  getServerEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
  '';

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Supabase] Missing URL or Service Key');
    return null;
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabase;
}

export function createServerSupabaseClient() {
  return getSupabase();
}

// Helper function to query User table
export async function getUser(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[Supabase] getUser error:', error);
    return null;
  }
  return data;
}

// Helper function to upsert User
export async function upsertUser(userId: string, data: Record<string, any>) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: result, error } = await supabase
    .from('User')
    .upsert({ id: userId, ...data }, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] upsertUser error:', error);
    return null;
  }
  return result;
}

// Helper function to query WallpaperUsage
export async function getWallpaperUsage(userId: string, fromDate: string) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('WallpaperUsage')
    .select('*')
    .eq('userId', userId)
    .gte('date', fromDate);

  if (error) {
    console.error('[Supabase] getWallpaperUsage error:', error);
    return [];
  }
  return data || [];
}

// Helper function to get today's WallpaperUsage
export async function getTodayWallpaperUsage(userId: string, date: string) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('WallpaperUsage')
    .select('*')
    .eq('userId', userId)
    .eq('date', date);

  if (error) {
    console.error('[Supabase] getTodayWallpaperUsage error:', error);
    return [];
  }
  return data || [];
}

// Helper function to upsert WallpaperUsage
export async function upsertWallpaperUsage(userId: string, date: string, data: Record<string, any>) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: result, error } = await supabase
    .from('WallpaperUsage')
    .upsert({ userId, date, ...data }, { onConflict: 'userId,date' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] upsertWallpaperUsage error:', error);
    return null;
  }
  return result;
}

// Helper function to insert Wallpaper
export async function insertWallpaper(userId: string, data: Record<string, any>) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: result, error } = await supabase
    .from('Wallpaper')
    .insert({ userId, ...data })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] insertWallpaper error:', error);
    return null;
  }
  return result;
}

// Helper function to find user by lemonSqueezyCustomerId
export async function getUserByLemonCustomer(customerId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('User')
    .select('id')
    .eq('lemonSqueezyCustomerId', customerId)
    .single();

  if (error) {
    console.error('[Supabase] getUserByLemonCustomer error:', error);
    return null;
  }
  return data;
}

// Helper function to update User subscription
export async function updateUserSubscription(userId: string, data: Record<string, any>) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: result, error } = await supabase
    .from('User')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] updateUserSubscription error:', error);
    return null;
  }
  return result;
}
