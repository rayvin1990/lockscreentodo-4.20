# Decision: Refined TTS Strategy for Lockscreen Push

## Context
In a previous implementation, we added an `X-Spoken-Text` HTTP header to the iOS Shortcut endpoint to trigger Siri TTS for any `critical` or `high` priority reminders. Xiao Ma provided feedback that this default "forced broadcast" is too intrusive, potentially causing disruption in office or night environments, and could read sensitive payloads aloud.

## Decision
We are pivoting the TTS implementation from "always read high priority" to a configurable, low-interruption "Critical Alerts Channel" model. 

1. **Explicit Opt-in**: Added `tts_enabled` to `agent_devices` (default `false`).
2. **Quiet Hours**: Added `tts_quiet_hours_start` (default `22:00`) and `tts_quiet_hours_end` (default `08:00`). During these hours, only `critical` priorities bypass the filter.
3. **Payload Desensitization**: Added `ttsText` (mapped to `tts_text` in the DB) to the MCP payload. The API prioritizes `tts_text` over `note` (summary) over `title`. This prevents raw or sensitive JSON from being read aloud.

## Implementation Details
- `src/lib/agent-db.ts`: Exposed new fields.
- `src/lib/agent-reminders.ts`: Schema expanded to accept `ttsText`.
- `src/app/api/lockscreen/shortcut/route.ts`: Extracts device timezone (defaults to `Asia/Shanghai`), calculates quiet hours using `Intl.DateTimeFormat`, and selects the appropriate string for `X-Spoken-Text`.

## Future Proofing
While the MVP leverages iOS Shortcuts' HTTP header for TTS generation, the payload design (`ttsText`, `quiet_hours`) is engine-agnostic and prepares us for future direct TTS generations (e.g. OpenAI TTS to audio stream or Windows SAPI).