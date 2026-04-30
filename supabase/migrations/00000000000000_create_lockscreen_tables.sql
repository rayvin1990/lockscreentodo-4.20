-- Create Enum for Reminder Kinds
CREATE TYPE reminder_kind AS ENUM (
  'medication',
  'grocery',
  'errand',
  'document',
  'appointment',
  'family',
  'payment',
  'travel',
  'other'
);

-- Create Enum for Reminder Priorities
CREATE TYPE reminder_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Table: agent_devices
-- Maps an Agent API Key to a User Device.
CREATE TABLE IF NOT EXISTS agent_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_api_key TEXT UNIQUE NOT NULL,
    agent_api_key_prefix TEXT,
    user_id TEXT NOT NULL, -- Clerk user ID
    device_name TEXT,
    device_id TEXT, -- e.g., push token, internal identifier
    notification_provider TEXT DEFAULT 'bark', -- bark, pushcut, etc.
    tts_enabled BOOLEAN NOT NULL DEFAULT false, -- Opt-in TTS
    tts_quiet_hours_start VARCHAR(5) DEFAULT '22:00', -- "HH:MM"
    tts_quiet_hours_end VARCHAR(5) DEFAULT '08:00', -- "HH:MM"
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: reminders
-- Stores the actual agent tasks
CREATE TABLE IF NOT EXISTS reminders (
    id VARCHAR(120) PRIMARY KEY,
    agent_device_id UUID REFERENCES agent_devices(id) ON DELETE CASCADE,
    source VARCHAR(80) NOT NULL DEFAULT 'agent',
    title VARCHAR(160) NOT NULL,
    note VARCHAR(500),
    tts_text VARCHAR(500), -- Desensitized or spoken version of the task
    kind reminder_kind NOT NULL DEFAULT 'other',
    priority reminder_priority NOT NULL DEFAULT 'medium',
    due_at TIMESTAMPTZ,
    location VARCHAR(160),
    requires_human BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying reminders for a specific device quickly
CREATE INDEX IF NOT EXISTS idx_reminders_agent_device_id ON reminders(agent_device_id);

-- Optional: enable RLS
ALTER TABLE agent_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust as needed based on auth schema)
CREATE POLICY "Allow anonymous or authenticated read/write for agent_devices" ON agent_devices
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous or authenticated read/write for reminders" ON reminders
    FOR ALL
    USING (true)
    WITH CHECK (true);
