-- Supabase SQL Migration Script
-- Run this in Supabase SQL Editor: https://app.supabase.com/sql

-- Enable Realtime
ALTER PUBLICATION publication;

-- 1. Tasks table for real-time sync
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notion_task_id TEXT UNIQUE
);

-- Enable Realtime for tasks
ALTER PUBLICATION publication ADD TABLE tasks;

-- Create index for performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);

-- 2. Wallpapers table for file storage metadata
CREATE TABLE IF NOT EXISTS wallpapers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  device TEXT,
  style_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for wallpapers
ALTER PUBLICATION publication ADD TABLE wallpapers;

-- Create index
CREATE INDEX IF NOT EXISTS wallpapers_user_id_idx ON wallpapers(user_id);

-- 3. User sync status table
CREATE TABLE IF NOT EXISTS user_sync_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  notion_connected BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for sync status
ALTER PUBLICATION publication ADD TABLE user_sync_status;

-- 4. Row Level Security (RLS) Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sync_status ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid()::text = user_id);

-- Same for wallpapers
CREATE POLICY "Users can view own wallpapers" ON wallpapers
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own wallpapers" ON wallpapers
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own wallpapers" ON wallpapers
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own wallpapers" ON wallpapers
  FOR DELETE USING (auth.uid()::text = user_id);

-- For user_sync_status, we need a service role to update it
CREATE POLICY "Users can view own sync status" ON user_sync_status
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage sync status" ON user_sync_status
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Storage Bucket for wallpapers
INSERT INTO storage.buckets (id, name, public)
VALUES ('wallpapers', 'wallpapers', false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Storage policies
CREATE POLICY "Users can upload to their own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'wallpapers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'wallpapers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 6. Functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sync_status_updated_at BEFORE UPDATE ON user_sync_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
