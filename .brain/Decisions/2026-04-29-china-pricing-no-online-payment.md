# China Pricing Without Online Payment

Date: 2026-04-29
Status: active

## Decision

Keep Chinese pricing and Chinese UI, but do not route Chinese users through domestic online payment or Lemon Squeezy for now.

## Rationale

Official Alipay/WeChat Pay setup requires more business-entity and platform work than the current validation stage justifies. Lemon Squeezy's fixed transaction fee is too heavy for a `￥9.9` domestic monthly pass.

## Implementation

- Chinese pricing displays `￥9.9 / 30 天` and `￥59.9 / 365 天`.
- Chinese pricing CTA says `联系开通`.
- Chinese upgrade modal states domestic online payment is not available yet and provides contact instructions.
- English pricing continues to use Lemon Squeezy with `$9.9 / 30 days` and `$59.9 / 365 days`.

## Future Guidance

Do not add domestic payment integrations until there is enough Chinese demand to justify a business entity or official merchant setup. Avoid grey-market no-signature payment integrations.
