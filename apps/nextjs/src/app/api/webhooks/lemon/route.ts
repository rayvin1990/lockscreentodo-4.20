import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@saasfly/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * Lemon Squeezy Webhook - Handle payment events and update user Pro status
 *
 * Events handled:
 * - order_created: One-time purchase (yearly plan)
 * - subscription_created: New subscription
 * - subscription_updated: Subscription changes (upgrade/downgrade/cancel)
 * - subscription_cancelled: Subscription cancelled
 */
const webhookSecret = process.env.LEMON_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // 1. Get Lemon Squeezy signature headers
    const headerPayload = await headers();
    const signature = headerPayload.get("X-Signature");

    if (!signature) {
      console.error("❌ Missing X-Signature header");
      return new NextResponse("Error: Missing signature", { status: 400 });
    }

    // 2. Get raw body for signature verification
    const rawBody = await req.text();

    // 3. Verify webhook signature
    if (!webhookSecret) {
      console.error("❌ LEMON_WEBHOOK_SECRET not configured");
      return new NextResponse("Error: Webhook secret not configured", { status: 500 });
    }

    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    // Compare signatures safely
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      console.error("❌ Invalid webhook signature");
      return new NextResponse("Error: Invalid signature", { status: 403 });
    }

    // 4. Parse payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      console.error("❌ Failed to parse webhook payload:", error);
      return new NextResponse("Error: Invalid JSON", { status: 400 });
    }

    const eventName = payload?.meta?.event_name;
    const data = payload?.data;

    console.log(`📩 Lemon Squeezy Webhook received: ${eventName}`);

    /**
     * Helper function to extract customer ID from Lemon Squeezy payload
     * Lemon Squeezy passes customer identifier in various ways
     */
    const getCustomerId = (data: any): string | null => {
      // Try to get customer ID from different possible fields
      return data?.attributes?.first_order_item?.customer_id ||
             data?.attributes?.customer_id ||
             data?.relationships?.customer?.data?.id ||
             null;
    };

    /**
     * Helper function to get user ID from customer ID
     * We need to map Lemon Squeezy customer_id to our internal user_id
     */
    const getUserIdByCustomerId = async (customerId: string): Promise<string | null> => {
      try {
        // Query users table to find user by lemonSqueezyCustomerId
        const user = await prisma.user.findUnique({
          where: { lemonSqueezyCustomerId: customerId },
          select: { id: true },
        });

        if (!user) {
          console.warn(`⚠️  No user found for Lemon Squeezy customer ID: ${customerId}`);
          return null;
        }

        return user.id;
      } catch (error) {
        console.error("❌ Error querying user by customer ID:", error);
        return null;
      }
    };

    // 5. Handle order_created event (one-time purchase)
    if (eventName === "order_created" && data) {
      const customerId = getCustomerId(data);
      const variantId = data?.attributes?.first_order_item?.variant_id;

      console.log(`💰 New order received: Customer=${customerId}, Variant=${variantId}`);

      if (!customerId) {
        console.error("❌ No customer ID in order");
        return NextResponse.json({ success: false, error: "Missing customer ID" }, { status: 400 });
      }

      // Get user ID from customer ID
      const userId = await getUserIdByCustomerId(customerId);

      if (!userId) {
        console.warn(`⚠️  Order for unknown customer: ${customerId}`);
        // Still return success to avoid webhook retries
        return NextResponse.json({ success: true, warning: "Customer not mapped" });
      }

      try {
        // Update user to Pro with yearly access
        const yearlyEndsAt = new Date();
        yearlyEndsAt.setFullYear(yearlyEndsAt.getFullYear() + 1); // 1 year

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionPlan: 'PRO',
            subscriptionEndsAt: yearlyEndsAt,
            lemonSqueezyCustomerId: customerId,
            lemonSqueezyVariantId: variantId,
            isPro: true,
          },
        });

        console.log(`✅ User ${userId} upgraded to YEARLY Pro`);
      } catch (error) {
        console.error('❌ Error processing order_created:', error);
        return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
      }
    }

    // 6. Handle subscription_created event
    if (eventName === "subscription_created" && data) {
      const customerId = data?.attributes?.customer_id;
      const subscriptionId = data?.id;
      const variantId = data?.attributes?.variant_id;
      const status = data?.attributes?.status; // active, cancelled, expired, etc.

      console.log(`🔄 New subscription: Customer=${customerId}, Subscription=${subscriptionId}, Status=${status}`);

      if (!customerId) {
        console.error("❌ No customer ID in subscription");
        return NextResponse.json({ success: false, error: "Missing customer ID" }, { status: 400 });
      }

      // Get user ID from customer ID
      const userId = await getUserIdByCustomerId(customerId);

      if (!userId) {
        console.warn(`⚠️  Subscription for unknown customer: ${customerId}`);
        return NextResponse.json({ success: true, warning: "Customer not mapped" });
      }

      // Only activate Pro if subscription is active
      if (status !== "active") {
        console.log(`⚠️  Subscription ${subscriptionId} is not active (status: ${status})`);
        return NextResponse.json({ success: true, message: "Subscription not active" });
      }

      try {
        // Calculate subscription end date based on billing interval
        const renewalDate = data?.attributes?.renews_at;
        const endsAt = renewalDate ? new Date(renewalDate) : null;

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            subscriptionPlan: 'PRO',
            subscriptionEndsAt: endsAt,
            lemonSqueezyCustomerId: customerId,
            lemonSqueezySubscriptionId: subscriptionId,
            lemonSqueezyVariantId: variantId,
          },
        });

        console.log(`✅ User ${userId} activated Pro subscription (ends: ${endsAt?.toLocaleDateString()})`);
      } catch (error) {
        console.error('❌ Error processing subscription_created:', error);
        return NextResponse.json({ success: false, error: "Failed to update subscription" }, { status: 500 });
      }
    }

    // 7. Handle subscription_updated event (renewal, plan change, etc.)
    if (eventName === "subscription_updated" && data) {
      const customerId = data?.attributes?.customer_id;
      const subscriptionId = data?.id;
      const status = data?.attributes?.status;
      const renewalDate = data?.attributes?.renews_at;

      console.log(`🔄 Subscription updated: ${subscriptionId}, Status=${status}`);

      const userId = await getUserIdByCustomerId(customerId);

      if (!userId) {
        return NextResponse.json({ success: true, warning: "Customer not mapped" });
      }

      try {
        // Update subscription status
        const endsAt = renewalDate ? new Date(renewalDate) : null;

        // If subscription is cancelled or expired, remove Pro status
        const isPro = status === "active" || status === "on_trial";

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: isPro,
            subscriptionEndsAt: endsAt,
          },
        });

        console.log(`✅ User ${userId} subscription updated (Pro: ${isPro})`);
      } catch (error) {
        console.error('❌ Error processing subscription_updated:', error);
        return NextResponse.json({ success: false, error: "Failed to update subscription" }, { status: 500 });
      }
    }

    // 8. Handle subscription_cancelled event
    if (eventName === "subscription_cancelled" && data) {
      const customerId = data?.attributes?.customer_id;
      const subscriptionId = data?.id;
      const endsAt = data?.attributes?.ends_at; // When access actually ends

      console.log(`⚠️  Subscription cancelled: ${subscriptionId}`);

      const userId = await getUserIdByCustomerId(customerId);

      if (!userId) {
        return NextResponse.json({ success: true, warning: "Customer not mapped" });
      }

      try {
        // Keep Pro active until the end date, then downgrade
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionEndsAt: endsAt ? new Date(endsAt) : null,
          },
        });

        console.log(`✅ User ${userId} subscription will end on ${endsAt}`);
      } catch (error) {
        console.error('❌ Error processing subscription_cancelled:', error);
        return NextResponse.json({ success: false, error: "Failed to process cancellation" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - for testing webhook availability
 */
export async function GET() {
  return NextResponse.json({
    status: "Lemon Squeezy webhook endpoint is ready",
    configured: !!webhookSecret,
  });
}
