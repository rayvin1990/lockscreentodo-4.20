# Lockscreen MCP Contract and Debug UI

Date: 2026-04-26
Status: implemented

## Context

Continued the Lockscreen MCP pivot from the prior handoff. The goal was to move the prototype from a basic push/read endpoint toward a clearer agent-facing contract.

## Changes

- Added shared clear and preview operations in `src/lib/agent-reminders.ts`.
- Extended `src/app/api/mcp/route.ts` with:
  - `clear_lockscreen_reminder`
  - `render_lockscreen_preview`
  - clearer tool schemas and invalid-param errors.
- Extended `src/app/api/agent/reminders/route.ts` with `DELETE` support:
  - `DELETE /api/agent/reminders?id=<id>`
  - `DELETE /api/agent/reminders?all=true`
- Added `/lockscreen-mcp` debug UI for viewing the active queue, pushing test reminders, clearing reminders, and inspecting raw responses.
- Added `docs/Lockscreen-MCP.md` with REST and MCP JSON-RPC examples.

## Verification

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- Existing dev server on `http://localhost:3000` returned 200 for `/lockscreen-mcp`.
- `GET /api/agent/reminders` returned 200 in local `dev_open` auth mode.
- MCP `tools/list`, `render_lockscreen_preview`, `push_lockscreen_reminders`, and `clear_lockscreen_reminder` returned 200 through `/api/mcp`.
- `npm run lint` still fails before linting source because `eslint.config.mjs` imports `eslint/config`, which is not exported by the installed ESLint 8 package. This is the same known lint blocker from the prior handoff.

## Future Guidance

The preview renderer currently returns compact text only. The next meaningful product step is to turn `render_lockscreen_preview` into a real lock screen image renderer or a mobile-app payload, then add persistence keyed by user/device/agent workspace.
