# SEO Scenario Stalls

Date: 2026-04-29
Status: Implemented

## Context

The product should test multiple concrete use cases instead of relying on one broad "task wallpaper" pitch. These pages act like small market stalls: each has a narrow search intent, its own examples, and sends users into the same generator.

## Decision

Add data-driven SEO scenario pages under `/:lang/:scenario`.

Current scenarios:

- `exam-countdown-wallpaper`
- `keys-wallet-door-card-reminder`
- `metformin-after-dinner-reminder`
- `passport-before-flight-lock-screen`
- `stop-doomscrolling-lock-screen`
- `p0-incident-lock-screen-alert`
- `ai-one-thing-lock-screen`
- `study-lock-screen-wallpaper`
- `habit-tracker-lock-screen`
- `daily-todo-wallpaper`

Each page includes localized copy, example tasks, FAQ schema, and a generator CTA with `tasks=`, `scenario=`, `template=`, and `bg=` query parameters. The generator reads those params and preloads the lock screen with a scenario-specific layout direction:

- `countdown`: large countdown number for exams.
- `large-reminder`: oversized physical-world reminder for keys and medication.
- `urgent`: warning-forward travel checklist.
- `interruption`: direct prompt for doomscrolling interruption.
- `ops-alert`: red alert style for P0 incidents.
- `fitness`: punchier habit checklist.
- `calm-list`: default quiet task list.

SEO exposure is English-first because the main market is overseas. Chinese scenario pages remain available for local testing and product review, but `/zh/:scenario` pages are marked `noindex,nofollow` and are not included in the sitemap. Canonical URLs point to the English scenario pages.

Update: overseas SEO canonical URLs now use `/use-cases/:scenario`. The first Reddit-informed priority stalls are:

- `adhd-lockscreen-reminder`
- `n8n-urgent-alerts-lockscreen`
- `doomscrolling-blocker-wallpaper`

The localized `/:lang/:scenario` pages remain available, but sitemap entries and English homepage use-case links should prefer `/use-cases/:scenario`.

Generator parity update: `template=` is now used by the generator's locked task layer, not only by the SEO preview. The generator can render countdown, large reminder, interruption, urgent, ops-alert, fitness, and calm-list variants when users enter from a scenario page.

## Affected Files

- `src/lib/seo-scenarios.ts`
- `src/components/seo-scenario-page.tsx`
- `src/app/[lang]/[scenario]/page.tsx`
- `src/app/[lang]/generator/page.tsx`
- `src/app/[lang]/page.tsx`
- `src/app/sitemap.ts`

## Future Guidance

To add another stall, append one object to `seoScenarios`. Avoid creating one-off page files unless the scenario needs unique UI or conversion logic.
