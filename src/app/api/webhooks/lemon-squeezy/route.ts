import crypto from "node:crypto";
import { addDays } from "date-fns";
import { NextResponse } from "next/server";
import { getUserByLemonCustomer, updateUserSubscription } from "~/lib/supabase/admin";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lemon Squeezy webhook events we handle
type LemonEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
      pass?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      status?: string;
      ends_at?: string;
      renews_at?: string;
      variant_id?: number;
      customer_id?: number;
      user_name?: string;
      user_email?: string;
      order_number?: number;
      total?: number;
      subtotal?: number;
      first_order_item?: {
        variant_id?: number;
      };
    };
  };
  links: {
    self?: string;
  };
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("X-Signature");

    if (!verifyLemonSignature(rawBody, signature)) {
      console.warn('[LemonSqueezy Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as LemonEvent;
    const eventName = payload.meta?.event_name;

    console.log(`[LemonSqueezy Webhook] Received event: ${eventName}`);

    // Get user_id from custom_data or from the subscription customer
    const userId = payload.meta?.custom_data?.user_id ||
      (await getUserIdFromLemonCustomer(payload.data.attributes.customer_id));

    console.log(`[LemonSqueezy Webhook] User ID: ${userId}, Event: ${eventName}`);

    if (!userId) {
      console.warn('[LemonSqueezy Webhook] No user_id found in payload');
      return NextResponse.json({ error: 'No user_id found' }, { status: 400 });
    }

    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(userId, payload);
        break;

      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_renewed':
        await handleSubscriptionCreated(userId, payload);
        break;

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(userId, payload);
        break;

      case 'subscription_expired':
        await handleSubscriptionExpired(userId, payload);
        break;

      case 'subscription_resumed':
        await handleSubscriptionResumed(userId, payload);
        break;

      default:
        console.log(`[LemonSqueezy Webhook] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[LemonSqueezy Webhook] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function verifyLemonSignature(rawBody: string, signature: string | null) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[LemonSqueezy Webhook] LEMON_SQUEEZY_WEBHOOK_SECRET is not configured');
    return false;
  }

  if (!rawBody || !signature) {
    return false;
  }

  const digest = Buffer.from(
    crypto.createHmac('sha256', secret).update(rawBody).digest('hex'),
    'utf8',
  );
  const incomingSignature = Buffer.from(signature, 'utf8');

  if (digest.length !== incomingSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(digest, incomingSignature);
}

async function getUserIdFromLemonCustomer(customerId: number | undefined): Promise<string | null> {
  if (!customerId) return null;

  const user = await getUserByLemonCustomer(customerId.toString());
  return user?.id || null;
}

async function handleOrderCreated(userId: string, payload: LemonEvent) {
  const variantId = getPayloadVariantId(payload);
  const customerId = payload.data.attributes.customer_id;
  const accessDays = getAccessDays(payload);
  const endsAt = addDays(new Date(), accessDays);

  console.log(`[LemonSqueezy Webhook] Activating one-time pass for user ${userId}`);
  console.log(`  - accessDays: ${accessDays}`);
  console.log(`  - endsAt: ${endsAt.toISOString()}`);
  console.log(`  - variantId: ${variantId}`);
  console.log(`  - customerId: ${customerId}`);

  await updateUserSubscription(userId, {
    subscriptionPlan: 'PRO',
    subscriptionEndsAt: endsAt,
    lemonSqueezyVariantId: variantId?.toString() || null,
    lemonSqueezyCustomerId: customerId?.toString() || null,
    lemonSqueezySubscriptionId: null,
    isPro: true,
    updated_at: new Date().toISOString(),
  });

  console.log(`[LemonSqueezy Webhook] One-time pass activated for user ${userId}`);
}

async function handleSubscriptionCreated(userId: string, payload: LemonEvent) {
  const endsAt = payload.data.attributes.ends_at || payload.data.attributes.renews_at;
  const variantId = payload.data.attributes.variant_id;
  const customerId = payload.data.attributes.customer_id;

  console.log(`[LemonSqueezy Webhook] Creating/updating subscription for user ${userId}`);
  console.log(`  - endsAt: ${endsAt}`);
  console.log(`  - variantId: ${variantId}`);
  console.log(`  - customerId: ${customerId}`);

  await updateUserSubscription(userId, {
    subscriptionPlan: 'PRO',
    subscriptionEndsAt: endsAt ? new Date(endsAt) : null,
    lemonSqueezyVariantId: variantId?.toString() || null,
    lemonSqueezyCustomerId: customerId?.toString() || null,
    lemonSqueezySubscriptionId: payload.data.id,
    isPro: true,
    updated_at: new Date().toISOString(),
  });

  console.log(`[LemonSqueezy Webhook] Subscription created/updated for user ${userId}`);
}

async function handleSubscriptionUpdated(userId: string, payload: LemonEvent) {
  await handleSubscriptionCreated(userId, payload);
}

async function handleSubscriptionRenewed(userId: string, payload: LemonEvent) {
  const endsAt = payload.data.attributes.ends_at || payload.data.attributes.renews_at;

  console.log(`[LemonSqueezy Webhook] Renewing subscription for user ${userId}, new endsAt: ${endsAt}`);

  await updateUserSubscription(userId, {
    subscriptionEndsAt: endsAt ? new Date(endsAt) : null,
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionCancelled(userId: string, payload: LemonEvent) {
  console.log(`[LemonSqueezy Webhook] Subscription cancelled for user ${userId}`);

  await updateUserSubscription(userId, {
    subscriptionPlan: 'FREE',
    isPro: false,
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionExpired(userId: string, payload: LemonEvent) {
  console.log(`[LemonSqueezy Webhook] Subscription expired for user ${userId}`);

  await updateUserSubscription(userId, {
    subscriptionPlan: 'FREE',
    subscriptionEndsAt: null,
    isPro: false,
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionResumed(userId: string, payload: LemonEvent) {
  await handleSubscriptionCreated(userId, payload);
}

function getPayloadVariantId(payload: LemonEvent) {
  return payload.data.attributes.variant_id || payload.data.attributes.first_order_item?.variant_id;
}

function getAccessDays(payload: LemonEvent) {
  const variantId = getPayloadVariantId(payload)?.toString();
  const monthlyVariantIds = getConfiguredVariantIds([
    process.env.LEMON_SQUEEZY_MONTHLY_VARIANT_ID,
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_VARIANT_ID,
    extractVariantIdFromUrl(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL),
  ]);
  const yearlyVariantIds = getConfiguredVariantIds([
    process.env.LEMON_SQUEEZY_YEARLY_VARIANT_ID,
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_VARIANT_ID,
    extractVariantIdFromUrl(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_URL),
    extractVariantIdFromUrl(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL),
  ]);

  if (variantId && yearlyVariantIds.has(variantId)) {
    return 365;
  }

  if (variantId && monthlyVariantIds.has(variantId)) {
    return 30;
  }

  const pass = payload.meta?.custom_data?.pass;
  if (pass === 'yearly') {
    return 365;
  }

  return 30;
}

function getConfiguredVariantIds(values: Array<string | undefined>) {
  return new Set(values.filter((value): value is string => Boolean(value)));
}

function extractVariantIdFromUrl(value: string | undefined) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const parts = url.pathname.split('/').filter(Boolean);
    const buyIndex = parts.indexOf('buy');
    return buyIndex >= 0 ? parts[buyIndex + 1] : undefined;
  } catch {
    return undefined;
  }
}
