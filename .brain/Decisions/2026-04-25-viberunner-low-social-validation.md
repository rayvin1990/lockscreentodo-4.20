# 2026-04-25 VibeRunner Low-Social Validation Page

Status: active

## Context

VibeRunner is being validated as a low-social product experiment for people who want to run v0, Claude, or ChatGPT generated frontend code locally without dealing with terminals.

The founder prefers not to validate through direct interviews or private outreach, so the first validation surface should collect asynchronous signals.

## Decision

Create a standalone `/vibe-runner` landing page instead of starting the desktop app immediately.

The page uses a fake-door CTA:
- `Download Windows Beta - $19`
- `Join early access`
- email capture after CTA click

This validates whether visitors click a price-anchored download path before investing in a Windows desktop MVP.

## Files Changed

- `src/app/vibe-runner/page.tsx`
- `src/components/vibe-runner-cta.tsx`
- `src/app/api/vibe-runner/waitlist/route.ts`
- `public/vibe-runner/hero-product-mockup.png`

## Verification

Attempted:
- `npm run lint`
- `npx tsc --noEmit --pretty false`
- `npm run build`

Results:
- `npm run lint` is blocked by the existing ESLint 8/package exports issue in `eslint.config.mjs`.
- `npx tsc` is blocked by existing unrelated type errors in:
  - `src/app/[lang]/dashboard/settings/page.tsx`
  - `src/app/[lang]/page.tsx`
  - `src/app/[lang]/sign-in/[[...sign-in]]/page.tsx`
- `npm run build` was interrupted after running for a long time.

## Future Guidance

Next step is to run the page locally and inspect `/vibe-runner`. If the page looks good, publish it and measure:
- download CTA click rate
- waitlist conversion rate
- source/referrer in `/api/analytics` logs
- email submissions logged by `/api/vibe-runner/waitlist`

Do not build automatic command repair before the fake-door page shows demand.
