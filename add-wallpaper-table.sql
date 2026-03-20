-- Create Wallpaper table to store generated wallpapers
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "Wallpaper" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "taskCount" INTEGER DEFAULT 0,
  "style" TEXT,
  "prompt" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Wallpaper_userId_idx" ON "Wallpaper"("userId");
CREATE INDEX IF NOT EXISTS "Wallpaper_created_at_idx" ON "Wallpaper"(created_at DESC);

-- Enable Row Level Security
ALTER TABLE "Wallpaper" ENABLE ROW LEVEL SECURITY;

-- RLS Policy (allow all for now)
CREATE POLICY "Enable all access for Wallpaper" ON "Wallpaper"
  FOR ALL USING (true) WITH CHECK (true);
