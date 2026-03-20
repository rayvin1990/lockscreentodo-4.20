import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@saasfly/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * Clerk Webhook - Auto-activate 7-day Pro trial for new users
 *
 * Events:
 * - user.created: Auto-activate trial when new user registers
 * - user.updated: Check trial status on user updates
 */
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // 1. Verify Clerk Webhook signature
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error: Missing svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret || "");
    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error: Invalid signature", { status: 403 });
    }

    // 2. Get eventType and data
    const eventType = evt?.data?.type;
    const eventData = evt?.data?.data;

    console.log(`📩 Clerk Webhook received: ${eventType}`);

    // 3. Handle user.created event
    if (eventType === "user.created" && eventData?.id) {
      const userId = eventData.id;
      const emailAddress = eventData.email_addresses?.[0]?.email_address;

      console.log(`🎉 New user registered: ${userId} (${emailAddress})`);

      try {
        // Check if user already exists in our database
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (existingUser) {
          console.log(`⚠️  User ${userId} already exists, skipping creation`);
        } else {
          // Create user record with 7-day trial
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 days from now

          await prisma.user.create({
            data: {
              id: userId,
              email: emailAddress,
              name: `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim() || null,
              image: eventData.image_url || null,
              isPro: true,
              trialEndsAt: trialEndsAt,
              subscriptionPlan: 'PRO',
              emailVerified: new Date(), // Clerk already verified
            },
          });

          console.log(`✅ User ${userId} created with 7-day trial, expires on ${trialEndsAt.toLocaleDateString()}`);
        }
      } catch (error) {
        console.error('❌ Failed to create user record:', error);
      }
    }

    // 4. Handle user.updated event
    if (eventType === "user.updated" && eventData?.id) {
      const userId = eventData.id;

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!existingUser) {
          console.log(`⚠️  User ${userId} not found in database, creating...`);
          // Create user if doesn't exist
          const emailAddress = eventData.email_addresses?.[0]?.email_address;
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 7);

          await prisma.user.create({
            data: {
              id: userId,
              email: emailAddress,
              name: `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim() || null,
              image: eventData.image_url || null,
              isPro: true,
              trialEndsAt: trialEndsAt,
              subscriptionPlan: 'PRO',
              emailVerified: new Date(),
            },
          });

          console.log(`✅ User ${userId} created with 7-day trial`);
        } else {
          // Update user info if changed
          const emailAddress = eventData.email_addresses?.[0]?.email_address;
          const updateData: any = {};

          if (emailAddress && existingUser.email !== emailAddress) {
            updateData.email = emailAddress;
          }
          if (eventData.image_url && existingUser.image !== eventData.image_url) {
            updateData.image = eventData.image_url;
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
              where: { id: userId },
              data: updateData,
            });
            console.log(`✅ User ${userId} info updated`);
          } else {
            console.log(`✅ User ${userId} record exists, no updates needed`);
          }
        }
      } catch (error) {
        console.error('❌ Failed to check/update user record:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: error.message },
      { status: 500 }
    );
  }
}
