# MCP Generator Bridge

Date: 2026-04-29
Status: implemented

## Context

The MCP prototype could accept reminders, show the active queue in `/lockscreen-mcp`, and render compact text previews. The next useful product step was to connect the agent-created queue to the existing wallpaper generator.

## Changes

- Added a generator bridge at `/en/generator?source=agent`.
- The generator now fetches `GET /api/agent/reminders` when opened with `source=agent` or `agentQueue=true`.
- Active `lockscreenQueue` reminders are mapped into the lock screen task list using the calm lockscreen style.
- Added an `Open generator` action to the MCP debug UI when the queue has visible reminders.
- Updated `docs/Lockscreen-MCP.md` with the bridge workflow.

## Verification

- `npx tsc --noEmit` passed.
- `/lockscreen-mcp` returned HTTP 200.
- `/en/generator?source=agent` returned HTTP 200.
- `POST /api/agent/reminders` accepted a test reminder.
- `GET /api/agent/reminders` returned the test reminder in `lockscreenQueue`.

## Future Guidance

This is still an in-memory prototype. The next durable step is persistence keyed by user, device, or agent workspace. Do not build more demo-only rendering paths before deciding that storage boundary.
