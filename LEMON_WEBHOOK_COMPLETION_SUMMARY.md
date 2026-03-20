# Lemon Squeezy Webhook Implementation Summary

## ✅ What's Been Done

### 1. Created Webhook Route
**File:** `apps/nextjs/src/app/api/webhooks/lemon/route.ts`

The webhook handler now supports:
- ✅ HMAC SHA256 signature verification
- ✅ `order_created` event (lifetime purchases)
- ✅ `subscription_created` event (new subscriptions)
- ✅ `subscription_updated` event (renewals and changes)
- ✅ `subscription_cancelled` event (cancellations)
- ✅ Automatic Pro status updates
- ✅ Proper error handling and logging

### 2. Updated Prisma Schema
**File:** `packages/db/prisma/schema.prisma`

Added field:
- ✅ `lemonSqueezyVariantId` - Track which plan variant the user purchased

### 3. Created Documentation
**Files:**
- ✅ `LEMON_SQUEEZY_SETUP.md` - Complete setup guide
- ✅ `LEMON_WEBHOOK_COMPLETION_SUMMARY.md` - This summary

## 📋 What You Need to Do Next

### Step 1: Apply Database Schema Changes

**Important:** You need to add the `lemonSqueezyVariantId` column to your database.

**Option A: Using Prisma (if you have database access)**
```bash
# Make sure POSTGRES_URL is set in .env.local
bunx prisma db push --schema=./packages/db/prisma/schema.prisma
```

**Option B: Manual SQL (for Supabase)**
Go to your Supabase dashboard → SQL Editor and run:
```sql
ALTER TABLE users ADD COLUMN "lemonSqueezyVariantId" TEXT;
```

### Step 2: Configure Webhook in Lemon Squeezy

1. Go to [Lemon Squeezy Dashboard → Settings → Webhooks](https://www.lemonsqueezy.com/settings/webhooks)

2. Create new webhook with:
   - **URL:** `https://www.lockscreentodo.com/api/webhooks/lemon`
   - **Events:**
     - ✅ order_created
     - ✅ subscription_created
     - ✅ subscription_updated
     - ✅ subscription_cancelled

3. Copy the webhook secret (starts with `whsec_`)

### Step 3: Add Webhook Secret to Environment Variables

**Local development (`.env.local`):**
```bash
LEMON_WEBHOOK_SECRET="whsec_your_actual_secret_here"
```

**Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `LEMON_WEBHOOK_SECRET` = `whsec_your_actual_secret_here`
3. Redeploy your application

### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Start again
bun run dev
```

### Step 5: Test the Webhook

**Test from Lemon Squeezy Dashboard:**
1. In webhook settings, click "Send test webhook"
2. Check server logs for: `📩 Lemon Squeezy Webhook received`
3. Verify you get a `200 OK` response

**Or test with curl:**
```bash
curl http://localhost:3000/api/webhooks/lemon
```

Expected response:
```json
{
  "status": "Lemon Squeezy webhook endpoint is ready",
  "configured": true
}
```

## 🔧 Important Implementation Notes

### Customer ID Mapping

The webhook finds users by `lemonSqueezyCustomerId`. You need to ensure this field is populated when users make their first purchase.

**Your checkout flow should:**
1. Store the user's email in Lemon Squeezy checkout
2. After payment, the webhook will receive the customer ID
3. You'll need to map this customer ID to your internal user ID

**Recommended approach:**
- Add a field to store `lemonSqueezyCustomerId` in your users table (already exists in schema)
- When a user clicks the upgrade button, pass their email to the checkout URL
- After payment, map the customer using email address

### Payment Flow Overview

```
1. User clicks "Upgrade Pro"
   ↓
2. Redirect to Lemon Squeezy checkout (with email parameter)
   ↓
3. User completes payment
   ↓
4. Lemon Squeezy sends webhook to /api/webhooks/lemon
   ↓
5. Webhook verifies signature
   ↓
6. Updates user record:
   - isPro = true
   - subscriptionPlan = 'PRO'
   - subscriptionEndsAt = [calculated from plan]
   - lemonSqueezyCustomerId = [from webhook]
   - lemonSqueezySubscriptionId = [from webhook, if subscription]
   ↓
7. User gets Pro access immediately
```

## 🧪 Testing Checklist

Before going live, test these scenarios:

- [ ] Webhook endpoint is accessible (returns 200 OK)
- [ ] `LEMON_WEBHOOK_SECRET` is configured in environment
- [ ] Signature verification works (use test webhook from Lemon Squeezy)
- [ ] One-time purchase correctly sets lifetime Pro
- [ ] Subscription purchase correctly sets Pro with end date
- [ ] Subscription renewal updates end date
- [ ] Cancellation properly handles end date
- [ ] Download limits are removed for Pro users

## 🚨 Troubleshooting

### Webhook returns 403 Forbidden
- Check `LEMON_WEBHOOK_SECRET` matches exactly (no extra spaces)
- Restart server after updating environment variables

### User not upgraded after payment
- Check webhook logs for errors
- Verify user's `lemonSqueezyCustomerId` is set
- Check if webhook is receiving events (Lemon Squeezy webhook log)

### "Customer not mapped" warning
- Ensure customer ID is stored in database
- You may need to manually map first-time customers

## 📁 Files Modified

1. `apps/nextjs/src/app/api/webhooks/lemon/route.ts` - **NEW**
2. `packages/db/prisma/schema.prisma` - Added `lemonSqueezyVariantId`
3. `LEMON_SQUEEZY_SETUP.md` - **NEW** (setup guide)
4. `LEMON_WEBHOOK_COMPLETION_SUMMARY.md` - **NEW** (this file)

## 🎯 Next Steps

1. ✅ Apply database schema changes
2. ✅ Configure webhook in Lemon Squeezy dashboard
3. ✅ Add webhook secret to environment variables
4. ✅ Test webhook endpoint
5. ✅ Make a test payment
6. ✅ Verify user Pro status updates automatically

## 📞 Need Help?

Refer to:
- `LEMON_SQUEEZY_SETUP.md` - Detailed setup instructions
- [Lemon Squeezy Webhook Docs](https://docs.lemonsqueezy.com/help/webhooks)
- Server logs (look for `📩`, `✅`, `❌` emoji indicators)

---

**Status:** ✅ Webhook route created and ready for configuration
**Production URL:** https://www.lockscreentodo.com/api/webhooks/lemon
**Local Test URL:** http://localhost:3000/api/webhooks/lemon
