# Generator Calm Lockscreen Visual Direction

Date: 2026-04-28
Status: active

## Context

The generator preview looked like a decorative todo wallpaper: loud background treatment, white task card, centered playful text, and default tasks that did not communicate the new agent-to-lockscreen reminder direction.

## Decision

Move the generator toward a calm, system-lockscreen-like style:

- reminders first, background second
- real-world reminder examples by default
- restrained dark image treatment so Unsplash backgrounds do not compete with text
- left-aligned task list with small markers instead of centered todo-card text
- preview-only lock screen time/date in the phone mockup for realism

## Files Changed

- `src/app/[lang]/generator/page.tsx`
- `src/components/locked-task-container.tsx`
- `src/components/realistic-phone-mockup.tsx`

## Verification

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- Local dev server compiled `/en/generator` and returned HTTP 200.

## Future Guidance

Do not make the lockscreen surface more decorative unless it improves readability or user willingness to keep it on the lock screen. Unsplash should provide mood and context, while the reminder list remains the visual priority.

## 2026-04-29 Update

Unsplash remains part of the product direction, but the scene library should behave like a curated minimal lockscreen image set, not a broad vibe picker.

Changes:

- Replaced noisy categories such as cyberpunk, gaming, cartoon, and luxury with quiet minimal sets.
- Defaulted the scene selector to `Calm Minimal`.
- Changed Unsplash search to use combined scene keywords, such as negative space, soft light, quiet, and minimal.

Future Unsplash additions should optimize for:

- vertical composition
- low visual clutter
- enough negative space for text
- calm mood over decorative impact

## 2026-04-29 Preview Task Block Update

The generator phone mockup task block should stay horizontally centered and only allow vertical dragging. Keep the block narrow enough to feel like a lock screen reminder stack instead of a wide todo card.
