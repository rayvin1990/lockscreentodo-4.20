# Lemon Squeezy Webhook Setup Guide

This guide will help you configure the Lemon Squeezy webhook to handle payment events and automatically upgrade users to Pro status.

## Prerequisites

✅ Webhook route created: `/api/webhooks/lemon`
✅ Prisma schema updated with `lemonSqueezyVariantId` field
✅ Database migration needed (see below)

## Step 1: Run Database Migration

After updating the Prisma schema, you need to apply the changes to your database:

```bash
# Generate Prisma client
bunx prisma generate

# Push schema changes to database
bunx prisma db push
```

This will add the `lemonSqueezyVariantId` column to your `users` table.

## Step 2: Get Your Webhook URL

Your webhook callback URL is:

```
Production: https://www.lockscreentodo.com/api/webhooks/lemon
Local Test: http://localhost:3000/api/webhooks/lemon
```

## Step 3: Configure Webhook in Lemon Squeezy Dashboard

### 3.1 Navigate to Webhooks Settings

1. Go to [Lemon Squeezy Dashboard](https://www.lemonsqueezy.com/settings/webhooks)
2. Click "Add new webhook"

### 3.2 Enter Webhook Details

**Webhook URL:** `https://www.lockscreentodo.com/api/webhooks/lemon`

**Description:** `Lockscreen Todo Payment Events`

**Events to subscribe to:**
- ✅ `order_created` - When user completes one-time purchase
- ✅ `subscription_created` - When user starts a subscription
- ✅ `subscription_updated` - When subscription renews or changes
- ✅ `subscription_cancelled` - When user cancels subscription

### 3.3 Copy Webhook Secret

After creating the webhook, Lemon Squeezy will generate a secret. Copy it!

The secret looks like: `whsec_xxxxxxxxxxxxxx`

## Step 4: Add Webhook Secret to Environment Variables

Add the webhook secret to your `.env.local` file:

```bash
LEMON_WEBHOOK_SECRET="whsec_your_actual_webhook_secret_here"
```

Then restart your development server:

```bash
bun run dev
```

## Step 5: Deploy Environment Variables to Production

Add the same `LEMON_WEBHOOK_SECRET` to your Vercel deployment:

1. Go to Vercel Dashboard → your project
2. Settings → Environment Variables
3. Add: `LEMON_WEBHOOK_SECRET` = `whsec_your_actual_webhook_secret_here`
4. Redeploy your application

## Step 6: Test Your Webhook

### Option A: Test from Lemon Squeezy Dashboard

1. In Lemon Squeezy webhook settings, click "Send test webhook"
2. Check your server logs for: `📩 Lemon Squeezy Webhook received`
3. Verify response is `200 OK`

### Option B: Manual cURL Test

```bash
curl -X POST https://www.lockscreentodo.com/api/webhooks/lemon \
  -H "Content-Type: application/json" \
  -H "X-Signature: test_signature" \
  -d '{"meta":{"event_name":"test"},"data":{"id":"test"}}'
```

Expected response:
```json
{
  "success": true
}
```

## How It Works

### Payment Flow

1. **User clicks upgrade button** → Redirects to Lemon Squeezy checkout
2. **User completes payment** → Lemon Squeezy sends `order_created` webhook
3. **Webhook handler:**
   - Verifies signature using `LEMON_WEBHOOK_SECRET`
   - Extracts customer ID from payload
   - Maps Lemon Squeezy customer ID to your internal user ID
   - Updates user's `isPro`, `subscriptionPlan`, and `subscriptionEndsAt` fields
4. **User gets Pro access** immediately after payment

### Supported Events

| Event | Description | Action |
|-------|-------------|--------|
| `order_created` | One-time purchase (lifetime) | Set `isPro=true`, `subscriptionEndsAt=+100 years` |
| `subscription_created` | New subscription | Set `isPro=true`, track subscription ID |
| `subscription_updated` | Subscription renewal | Update `subscriptionEndsAt` |
| `subscription_cancelled` | User cancelled | Keep Pro active until period ends |

## Important Notes

### Customer ID Mapping

The webhook assumes you store the Lemon Squeezy `customer_id` in your users table. You need to:

1. **Store customer ID during checkout** - Pass customer info when redirecting to checkout
2. **Or map customers manually** - Use Lemon Squeezy customer email to match with your users

### Signature Verification

The webhook uses HMAC SHA256 signature verification to ensure requests are genuinely from Lemon Squeezy. The secret must match exactly.

### Error Handling

- Webhook returns `200 OK` even for unknown customers (to avoid retry spam)
- All errors are logged to console with `❌` prefix
- Successful operations logged with `✅` prefix

## Troubleshooting

### Webhook returns 403 Forbidden

**Problem:** Signature verification failed

**Solution:**
1. Verify `LEMON_WEBHOOK_SECRET` matches exactly in Lemon Squeezy dashboard
2. Check environment variable is loaded: `console.log(process.env.LEMON_WEBHOOK_SECRET)`
3. Restart server after updating environment variables

### Webhook returns "Customer not mapped"

**Problem:** Cannot find user in database for this customer ID

**Solution:**
- Ensure you're storing `lemonSqueezyCustomerId` when users make their first purchase
- Check the customer ID in Lemon Squeezy dashboard matches your database
- You may need to manually map existing customers

### User not upgraded after payment

**Problem:** Payment succeeded but user still has free tier

**Solution:**
1. Check webhook logs for errors
2. Verify database update succeeded
3. Check user's `isPro`, `subscriptionPlan`, and `subscriptionEndsAt` fields
4. Ensure webhook is receiving events (check Lemon Squeezy webhook delivery log)

## Environment Variables Checklist

Make sure these are set in both `.env.local` and Vercel:

```bash
# Lemon Squeezy Configuration
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL="https://rayvin1990.lemonsqueezy.com/checkout/buy/..."
LEMON_WEBHOOK_SECRET="whsec_your_actual_secret_here"
LEMON_LIFETIME_VARIANT_ID="" # Optional: for variant-specific logic
```

## Next Steps

After setup:

1. ✅ Test webhook with a small payment
2. ✅ Verify user Pro status updates automatically
3. ✅ Check download limits are removed for Pro users
4. ✅ Monitor webhook logs for any issues

## Need Help?

- Lemon Squeezy Webhook Docs: https://docs.lemonsqueezy.com/help/webhooks
- Check server logs: `bun run dev` and look for webhook messages
- Verify database: Check `users` table for updated fields
