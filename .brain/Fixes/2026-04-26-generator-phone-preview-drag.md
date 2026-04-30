# Generator Phone Preview Drag

## Symptom

The generator phone preview looked non-interactive. Dragging the locked task container or custom background inside the phone mockup could fail to move anything.

## Root Cause

The drag handlers registered document-level listeners immediately after calling `setIsDragging(true)`. Those listener closures still captured the previous `isDragging === false` state, so the first drag movement was ignored. The custom background drag also stored its start coordinates in React state, which could be stale inside the document listener.

## Files Changed

- `src/components/locked-task-container.tsx`
- `src/app/[lang]/generator/page.tsx`

## Fix

- Store active drag state in refs for immediate document/touch listener reads.
- Store background drag start coordinates and pinch start values in refs.
- Allow the locked task container to drag both horizontally and vertically.
- Add touch drag support for the locked task container.

## Verification

- `npx tsc --noEmit`
- `npm run secrets:all`

## Guidance

When adding drag interactions that bind document-level events during the same event tick, do not depend on freshly set React state in the listener. Use refs for transient gesture state and keep React state for rendering only.
