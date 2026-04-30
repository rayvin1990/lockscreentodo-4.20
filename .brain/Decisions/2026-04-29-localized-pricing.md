# Localized Pricing Display

Date: 2026-04-29
Status: active

## Decision

Use localized pricing display:

- English UI: `$9.9/month`, `$59.9/year`
- Chinese UI: `￥9.9/月`, `￥59.9/年`

## Implementation

- Pricing page switches copy and currency by `[lang]`.
- Upgrade modal switches copy and currency by `lang`.
- Pricing comparison table accepts `lang`.
- `/en/pricing` and `/zh/pricing` are public routes.

## Payment Links

Chinese checkout can use dedicated RMB Lemon Squeezy links:

- `NEXT_PUBLIC_LEMON_SQUEEZY_CNY_MONTHLY_URL`
- `NEXT_PUBLIC_LEMON_SQUEEZY_CNY_YEARLY_URL`

If those are not configured, the modal falls back to the existing English checkout URLs.

## Future Guidance

Keep display currency aligned with the route language. Do not show RMB on English pages or USD on Chinese pages unless intentionally testing a regional checkout change.
