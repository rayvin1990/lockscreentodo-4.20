# Lemon Squeezy One-Time Pass Activation

Date: 2026-04-29
Status: Implemented

## Context

Pricing now sells fixed access windows instead of auto-renewing subscriptions:
- English users buy through Lemon Squeezy.
- Chinese UI keeps RMB pricing but does not route to online payment.
- Monthly pass grants 30 days. Yearly pass grants 365 days.

## Root Cause

The existing Lemon Squeezy webhook only handled `subscription_*` events. For one-time products, Lemon sends `order_created`, so paid users would not be activated automatically. The checkout links also did not attach Clerk `user_id`, which meant the webhook could not reliably map an order to an app user.

## Changes

- `src/components/lockscreen/upgrade-modal-pricing.tsx`
  - Adds `checkout[custom][user_id]` and `checkout[custom][pass]` to English Lemon Squeezy checkout URLs.
  - Prefills checkout email when Clerk has one.
  - Keeps Chinese payment as contact-only.
- `src/app/api/webhooks/lemon-squeezy/route.ts`
  - Verifies `X-Signature` with `LEMON_SQUEEZY_WEBHOOK_SECRET` before parsing or processing the payload.
  - Handles `order_created`.
  - Activates Pro by writing `subscriptionEndsAt` to now + 30 or now + 365 days.
  - Uses configured variant IDs or variant IDs extracted from checkout URLs; falls back to the custom pass marker.
- `src/app/api/download/check-limit/route.ts`
  - Treats paid Pro as active only when `subscriptionEndsAt` is still in the future.
- `src/app/api/user/dashboard/route.ts`
  - Reports Pro status from active paid expiry instead of stale `isPro` alone.
- `src/env.mjs`
  - Adds yearly URL and optional public variant ID envs.

## Verification

- `npx tsc --noEmit`
- `npm run secrets:all`
- `http://localhost:3000/zh/pricing` contains Chinese contact-only pricing and no Lemon Squeezy wording.
- `http://localhost:3000/en/pricing` contains USD pricing and no RMB pricing.

## Future Guidance

Configure at least:
- `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL`
- `NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_URL`

Recommended for safer plan mapping:
- `LEMON_SQUEEZY_MONTHLY_VARIANT_ID` or `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_VARIANT_ID`
- `LEMON_SQUEEZY_YEARLY_VARIANT_ID` or `NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_VARIANT_ID`

Webhook requests are rejected with `401` when the Lemon Squeezy signature is missing, invalid, or the webhook secret is not configured.
