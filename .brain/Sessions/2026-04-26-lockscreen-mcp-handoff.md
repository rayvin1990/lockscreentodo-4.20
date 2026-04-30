# Lockscreen MCP Handoff

Date: 2026-04-26
Status: handoff

## Summary

Today we decided to pivot LockscreenTodo from a human-facing todo wallpaper generator into an agent-callable product direction called Lockscreen MCP.

The key product idea:

Agent discovers real-world tasks that still require the human user's body, presence, location, or judgment. Lockscreen MCP delivers those tasks to the user's phone lock screen.

We agreed that the lock screen should not show agent status or logs. It should show human-only tasks such as medication, groceries, errands, documents, appointments, family calls, pickups, and offline administrative tasks.

## Decisions

- Keep the current LockscreenTodo web generator alive for now.
- Move the main product direction toward Agent/MCP usage.
- Treat QR code/manual wallpaper setup as a transitional validation path, not the final product.
- Long-term direction is a mobile companion app that receives agent reminders and updates the lock screen with minimal user action.
- Android is the likely first platform for automatic lock screen wallpaper updates.
- iOS should be handled later through widgets, Live Activities, Shortcuts, or confirmation-based flows.
- OpenClaw is a natural upstream reminder brain.
- Lockscreen MCP is the downstream lock screen delivery layer.

## Product Name

Working name:

Lockscreen MCP

Working one-liner:

Agent pushes human-only real-world tasks to your phone lock screen.

## Work Completed

Documentation and shared brain:

- Added `.brain/Decisions/2026-04-25-agent-curated-lockscreen-reminders.md`
- Added `.brain/Specs/2026-04-25-agent-to-lockscreen-reminder-layer.md`
- Added `.brain/Sessions/2026-04-25-lockscreentodo-agent-pivot.md`
- Added `docs/PRD-Agent-Lockscreen-Reminder-Layer.md`

Code:

- Added `src/lib/agent-reminders.ts`
- Added `src/app/api/agent/reminders/route.ts`
- Added `src/app/api/mcp/route.ts`

Current prototype capabilities:

- `POST /api/agent/reminders` accepts structured reminder events.
- `GET /api/agent/reminders` returns stored reminders and `lockscreenQueue`.
- `POST /api/mcp` supports MCP-style JSON-RPC calls.
- MCP-style tools currently include:
  - `push_lockscreen_reminders`
  - `get_lockscreen_queue`

## Verification

Verified:

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- Next dev server started at `http://localhost:3000` after running outside sandbox.
- REST API accepted OpenClaw-style reminders.
- MCP `tools/list` worked.
- MCP `tools/call push_lockscreen_reminders` worked.
- `GET /api/agent/reminders` returned the active lockscreen queue.

Known issues:

- `npm run lint` fails due to existing ESLint config/package export issue.
- `npm run build` hung and was interrupted.
- Current reminder storage is in-memory only.
- Production auth expects `AGENT_API_KEY` or `LOCKSCREEN_AGENT_API_KEY`.
- No real mobile lock screen update exists yet.

## Tomorrow's Suggested Plan

Start by treating this as a real product named Lockscreen MCP.

Recommended first tasks:

1. Formalize the MCP tool contract.
2. Improve tool names, schemas, and error responses.
3. Add tools likely needed soon:
   - `clear_lockscreen_reminder`
   - `render_lockscreen_preview`
   - later: `register_device`
4. Add a README or docs page specifically for Lockscreen MCP.
5. Build a debug UI to view current `lockscreenQueue` and send test reminders.
6. Create an OpenClaw integration example.
7. Decide persistence model for reminders: user, device, or agent workspace.

## Important Product Principle

Lockscreen MCP should not become a general notification dump.

Only push reminders that deserve persistent lock screen visibility:

- human-only
- physical-world
- time-sensitive
- location-sensitive
- costly if missed

Everything else should stay in normal agent logs or notifications.

