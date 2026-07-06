# SEO Meta Coverage Gap Fix

Date: 2026-07-06
Status: verified
Area: LockscreenTodo, SEO, root layout metadata

## Symptom

GSC reported 19 clicks and 245 impressions over 3 months (2026-04-05 to 2026-07-05),
but every single one of the 14 unique queries had 0% CTR. The homepage CTR was 8.12%
only because brand and direct searches inflated the average.

The root layout title was:

> Lockscreen Todo - AI Lock Screen Task Wallpaper Generator

None of the top 4 real GSC queries contained the words in the title:

- "lock screen to do list" (9 impressions, rank 42.3)
- "lock screen prompt" (8 impressions, rank 8.1)
- "to do list on lock screen" (6 impressions, rank 45.7)
- "reminders for lockscreen" (5 impressions, rank 22)

The siteConfig description also did not mention "to do list", "iPhone", or "Android",
which are common intent phrases for lock screen wallpaper users.

## Root Cause

1. The siteConfig name in src/config/site.ts was positioned as an AI tool
   (\"AI Lock Screen Task Wallpaper Generator\") and missed the dominant search
   intent pattern \"lock screen to do list\" and variants.
2. The keywords array in src/app/layout.tsx listed 24 generic terms, none of
   which matched the actual GSC query distribution.
3. Because the homepage src/app/[lang]/page.tsx is a client component, it could
   not export its own metadata and relied entirely on the root layout, which
   amplified the coverage gap.

## Files Changed

- src/config/site.ts
  - name: \"Lockscreen Todo: To-Do List on Lock Screen Wallpaper\"
  - description: added \"iPhone\", \"Android\", \"to do list\", and a benefit-led
    opening line
- src/app/layout.tsx
  - keywords array expanded from 24 to 44 terms
  - Added the 14 actual GSC queries as the leading English keywords
  - Added the 4 most common Chinese intent phrases for the i18n homepage
- (Related, from same session) src/app/api/analytics/route.ts
  - Persists every event to a new public.analytics_events Supabase table so
    future GSC-vs-behavior analysis is possible

## Verification


pm run build completed successfully. After build, the rendered homepage HTML
contained:

- <title>Lockscreen Todo: To-Do List on Lock Screen Wallpaper</title>
- description meta with \"iPhone\", \"Android\", and \"to do list\"
- keywords meta starting with the four top GSC queries verbatim

Existing build output paths for /use-cases/notion-task-lock-screen,
/en/generator, and the other 14 SEO scenarios remained intact.

The pre-existing 
pm run lint blocker (ESLint package export error) is
unchanged and unrelated to this fix.

## Future Guidance

- Re-check GSC query CTR 7-14 days after deploy. Expect CTR to rise from 0%
  on the top 4 queries as the new title and description match the search
  intent. If CTR remains 0, the title may still be too product-branded and
  needs an even more generic variant.
- Track search queries containing \"Notion\" once the Notion scenario page is
  indexed. Notion is not in the top 14 historical queries, so it is currently
  a bet, not a signal.
- Do not keep expanding the keywords array past ~50 items; beyond that Google
  treats the meta as spammy. If new intent terms appear, replace, do not
  append.
- The homepage is still a client component, so any future page-level
  metadata must be added in a server component wrapper, not in page.tsx.