import { NextResponse } from "next/server";
import { createNeonClient } from "~/lib/neon/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

let sql: ReturnType<typeof createNeonClient> | null = null;
function getSql() {
  if (!sql) sql = createNeonClient();
  return sql;
}

// Lemon Squeezy webhook events we handle
type LemonEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
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
    };
  };
  links: {
    self?: string;
  };
};

export async function POST(request: Request) {
  try {
    const payload = await request.json() as LemonEvent;
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

async function getUserIdFromLemonCustomer(customerId: number | undefined): Promise<string | null> {
  if (!customerId) return null;

  try {
    const users = await getSql()`
      SELECT id FROM "User" WHERE "lemonSqueezyCustomerId" = ${customerId.toString()}
    `;
    return users[0]?.id || null;
  } catch (e) {
    console.error('[LemonSqueezy Webhook] Error finding user by customer ID:', e);
    return null;
  }
}

async function handleSubscriptionCreated(userId: string, payload: LemonEvent) {
  const endsAt = payload.data.attributes.ends_at || payload.data.attributes.renews_at;
  const variantId = payload.data.attributes.variant_id;
  const customerId = payload.data.attributes.customer_id;

  console.log(`[LemonSqueezy Webhook] Creating/updating subscription for user ${userId}`);
  console.log(`  - endsAt: ${endsAt}`);
  console.log(`  - variantId: ${variantId}`);
  console.log(`  - customerId: ${customerId}`);

  await getSql()`
    UPDATE "User"
    SET
      "subscriptionPlan" = 'PRO',
      "subscriptionEndsAt" = ${endsAt ? new Date(endsAt) : null},
      "lemonSqueezyVariantId" = ${variantId?.toString() || null},
      "lemonSqueezyCustomerId" = ${customerId?.toString() || null},
      "lemonSqueezySubscriptionId" = ${payload.data.id},
      "isPro" = true,
      "updated_at" = NOW()
    WHERE id = ${userId}
  `;

  console.log(`[LemonSqueezy Webhook] Subscription created/updated for user ${userId}`);
}

async function handleSubscriptionUpdated(userId: string, payload: LemonEvent) {
  await handleSubscriptionCreated(userId, payload);
}

async function handleSubscriptionRenewed(userId: string, payload: LemonEvent) {
  const endsAt = payload.data.attributes.ends_at || payload.data.attributes.renews_at;

  console.log(`[LemonSqueezy Webhook] Renewing subscription for user ${userId}, new endsAt: ${endsAt}`);

  await getSql()`
    UPDATE "User"
    SET
      "subscriptionEndsAt" = ${endsAt ? new Date(endsAt) : null},
      "updated_at" = NOW()
    WHERE id = ${userId}
  `;
}

async function handleSubscriptionCancelled(userId: string, payload: LemonEvent) {
  console.log(`[LemonSqueezy Webhook] Subscription cancelled for user ${userId}`);

  await getSql()`
    UPDATE "User"
    SET
      "subscriptionPlan" = 'FREE',
      "isPro" = false,
      "updated_at" = NOW()
    WHERE id = ${userId}
  `;
}

async function handleSubscriptionExpired(userId: string, payload: LemonEvent) {
  console.log(`[LemonSqueezy Webhook] Subscription expired for user ${userId}`);

  await getSql()`
    UPDATE "User"
    SET
      "subscriptionPlan" = 'FREE',
      "subscriptionEndsAt" = null,
      "isPro" = false,
      "updated_at" = NOW()
    WHERE id = ${userId}
  `;
}

async function handleSubscriptionResumed(userId: string, payload: LemonEvent) {
  await handleSubscriptionCreated(userId, payload);
}
