# Growth Baseline

Date: 2026-04-24
Status: active

## Context

Lockscreen Todo is indexed by Google and Bing, but the project has very few known users. The immediate risk is not copying; it is lack of visibility into whether search visitors try the product, click pricing, generate wallpapers, or download.

## Decision

Add a lightweight first-party analytics path before adding a third-party analytics vendor. Track only funnel actions and page metadata, not task text or wallpaper content.

## Added Events

- `home_cta_click`
- `home_pricing_click`
- `wallpaper_generate_success`
- `wallpaper_download_success`

## Affected Areas

- `src/lib/analytics.ts`
- `src/app/api/analytics/route.ts`
- `src/app/[lang]/page.tsx`
- `src/app/[lang]/generator/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

## Verification

- `npm run secrets:all` passed.
- `npm run secrets:staged` passed.
- Lint/build could not be verified because local `node_modules/.bin` is missing `eslint`, `tsc`, and `next`.
