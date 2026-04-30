# LockscreenTodo Visual and Demo Handoff

Date: 2026-04-29
Status: handoff

## Today Summary

We refined the product/design direction:

- Main value: reminders that help users avoid missing real-world tasks.
- Supporting value: beautiful minimal Unsplash images that add calm mood and perceived quality.
- Product tone: simple but not crude; minimal but not empty; calm, readable, and worth putting on a phone lock screen.
- User-facing framing should be clearer than "Agent":
  - primary: "Describe your task. Get a lockscreen wallpaper."
  - secondary: AI agent / MCP prepares the structured payload behind the scenes.

## Changes Made

- Updated generator lockscreen preview toward a calm system-lockscreen style.
- Added `/agent-demo` and `/en/agent-demo` demo page for the agent-to-lockscreen loop.
- Updated `/agent-demo` title/metadata to be user-result-first.
- Reworked Unsplash scene categories into curated minimal lockscreen sets:
  - Calm Minimal
  - Soft Nature
  - Quiet Home
  - Morning Light
  - City Errands
  - Documents & Travel
  - Health Calm
  - Evening Warm
  - Botanical Quiet
  - Family Warmth
- Defaulted the scene selector to `Calm Minimal`.
- Changed Unsplash queries to use combined minimal/calm/negative-space keywords.

## Verification

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- Local `/en/generator` returned 200.
- Local `/en/agent-demo` returned 200.

## Important Positioning

Do not present this as a wallpaper app first.

Present it as:

> Describe your task. Get a calm lockscreen reminder.

Internal product hierarchy:

1. Reminder function is the core.
2. Minimal Unsplash imagery is the emotional/visual support.
3. Agent/MCP is the developer-facing mechanism.

## Tomorrow Suggested Work

1. Reduce noise in the generator right-side controls.
   - Make the default flow: tasks, minimal background, generate.
   - Move advanced styling, Notion, emergency contact, and detailed controls behind quieter sections.
2. Polish `/agent-demo` for sharing.
   - Add a stronger screenshot-ready first viewport.
   - Consider a short "how it works" strip below the fold.
   - Keep automatic Android wallpaper setting framed as future work.
3. Draft community post copy.
   - Avoid "todo app".
   - Use "agent-to-lockscreen" only after the user benefit is clear.
   - Emphasize the primitive: AI prepares tasks, lock screen keeps human actions visible.
