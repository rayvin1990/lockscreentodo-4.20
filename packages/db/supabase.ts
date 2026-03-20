import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Real-time features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our tables
export interface Task {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  notion_task_id?: string;
}

export interface Wallpaper {
  id: string;
  user_id: string;
  image_url: string;
  device: string;
  style_config: any; // JSON data
  created_at: string;
}

export interface UserSync {
  id: string;
  user_id: string;
  notion_connected: boolean;
  last_sync_at: string;
}
