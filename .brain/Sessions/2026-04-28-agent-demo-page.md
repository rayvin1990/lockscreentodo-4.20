# Agent Demo Page

Date: 2026-04-28
Status: implemented

## Context

The product direction needs a developer-community demo that shows the smallest useful loop without overpromising automatic phone wallpaper updates.

## Changes

- Added `/agent-demo` as a standalone demo page.
- Added `/en/agent-demo` as the localized public route that middleware redirects to.
- Added `src/components/agent-demo-client.tsx` with:
  - fixed agent conversation
  - copyable MCP `tools/call` payload
  - calm lockscreen preview
  - downloadable preview image
  - link back to `/en/generator`
- Added `/agent-demo` to `src/app/sitemap.ts`.
- Added `/en/agent-demo` and `/zh/agent-demo` to the Clerk public route matcher.

## Verification

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- Local dev server returned HTTP 200 for `/agent-demo`.
- Local dev server returned HTTP 200 for `/en/agent-demo`; `/agent-demo` redirects to `/en/agent-demo`.

## Guidance

Keep the demo honest: it shows agent-to-rendered-lockscreen-image today. Automatic Android lockscreen setting requires a companion app and should be presented as future work.
