import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUser, upsertUser, getWallpaperUsage } from "~/lib/supabase/admin";
import { isAfter, startOfWeek } from "date-fns";

// Allow unauthenticated access for limit check
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    console.log('[check-limit] Request received, userId:', userId);

    if (!userId) {
      return NextResponse.json({
        canGenerate: false,
        isGuest: true,
        reason: "NOT_AUTHENTICATED",
        message: "Please sign in first",
        subscriptionPlan: null,
        trialEndsAt: null,
        daysRemaining: 0,
      }, { status: 200 });
    }

    console.log(`[check-limit] Checking limit for user ${userId}`);

    let user = await getUser(userId);

    if (!user) {
      console.log(`User ${userId} not found, activating 7-day trial`);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      user = await upsertUser(userId, {
        subscriptionPlan: 'PRO',
        trialEndsAt: trialEndsAt.toISOString(),
        isPro: true,
      });

      if (!user) {
        // Retry fetch
        user = await getUser(userId);
      }

      if (!user) {
        console.error(`Unable to create or query user ${userId}`);
        return NextResponse.json(
          { error: "User not found", canGenerate: false, reason: "USER_NOT_FOUND" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        canGenerate: true,
        subscriptionPlan: 'PRO',
        trialEndsAt: trialEndsAt.toISOString(),
        daysRemaining: 7,
        message: `7-day trial - 7 days remaining`,
      });
    }

    const now = new Date();
    const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const subscriptionEndsAt = user?.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null;
    const subscriptionPlan = user?.subscriptionPlan || 'FREE';
    const lemonSqueezyVariantId = user?.lemonSqueezyVariantId || null;
    const isPro = user?.isPro || false;

    const daysRemaining = trialEndsAt
      ? Math.max(0, Math.floor((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const isTrialActive = trialEndsAt ? isAfter(trialEndsAt, now) : false;
    const isSubscriptionActive = subscriptionEndsAt ? isAfter(subscriptionEndsAt, now) : false;

    console.log('User subscription status:', {
      subscriptionPlan,
      trialEndsAt: trialEndsAt?.toDateString(),
      subscriptionEndsAt: subscriptionEndsAt?.toDateString(),
      lemonSqueezyVariantId,
      isTrialActive,
      isSubscriptionActive,
      isPro,
      daysRemaining,
    });

    // Pro subscribers: unlimited generation
    if ((lemonSqueezyVariantId && isSubscriptionActive) || (isPro && isSubscriptionActive)) {
      console.log(`User ${userId} is a Pro subscriber until ${subscriptionEndsAt?.toLocaleDateString()}, unlimited generation`);
      return NextResponse.json({
        canGenerate: true,
        subscriptionPlan: 'PRO',
        subscriptionEndsAt: subscriptionEndsAt?.toISOString() || null,
        trialEndsAt: trialEndsAt?.toISOString() || null,
        daysRemaining: 0,
        isSubscriptionActive: true,
        lemonSqueezyVariantId,
        message: `Pro subscriber - Unlimited generation`,
      });
    }

    // Active trial
    if ((subscriptionPlan === 'PRO' || isPro) && isTrialActive) {
      console.log(`User ${userId} in trial Pro, ${daysRemaining} days remaining`);
      return NextResponse.json({
        canGenerate: true,
        subscriptionPlan: 'PRO',
        trialEndsAt: trialEndsAt?.toISOString() || null,
        daysRemaining,
        isTrialActive: true,
        message: `7-day trial - ${daysRemaining} days remaining`,
      });
    }

    // Trial expired or free user: check weekly quota
    const isTrialExpired = trialEndsAt && !isTrialActive;

    console.log(`Checking weekly quota for user ${userId} (TrialExpired: ${isTrialExpired})`);

    const weekStart = startOfWeek(now);
    const weekStartString = weekStart.toISOString().split('T')[0];

    const weekUsages = await getWallpaperUsage(userId, weekStartString);

    const weekDownloadCount = weekUsages?.reduce((sum: number, usage: any) => sum + (usage.downloadCount || 0), 0) || 0;
    const weeklyLimit = isTrialExpired ? 1 : 3;
    const remainingThisWeek = Math.max(0, weeklyLimit - weekDownloadCount);

    if (remainingThisWeek > 0) {
      console.log(`User ${userId} trial expired but has ${remainingThisWeek} weekly quota remaining`);
      return NextResponse.json({
        canGenerate: true,
        subscriptionPlan: 'FREE',
        trialEndsAt: trialEndsAt?.toISOString() || null,
        daysRemaining: 0,
        isTrialExpired,
        weekDownloadCount,
        remainingThisWeek,
        message: isTrialExpired
          ? `Trial ended - 1 free generation per week (Remaining: ${remainingThisWeek})`
          : `Free user - 3 free generations per week (Remaining: ${remainingThisWeek})`,
      });
    }

    // Quota exhausted
    if (isTrialExpired) {
      console.log(`User ${userId} trial expired and quota exhausted`);
      return NextResponse.json(
        {
          canGenerate: false,
          reason: "TRIAL_EXPIRED",
          subscriptionPlan,
          trialEndsAt: trialEndsAt?.toISOString() || null,
          daysRemaining: 0,
          weekDownloadCount,
          remainingThisWeek: 0,
          message: "Your 7-day trial has ended and weekly free quota is exhausted. Please upgrade to Pro to continue.",
        },
        { status: 403 }
      );
    }

    console.log(`User ${userId} is ${subscriptionPlan} user and quota exhausted`);

    return NextResponse.json(
      {
        error: "Weekly free quota exhausted. Please upgrade to Pro to continue.",
        canGenerate: false,
        reason: "FREE_USER",
        subscriptionPlan,
        trialEndsAt: trialEndsAt?.toISOString() || null,
        daysRemaining: 0,
        weekDownloadCount,
        remainingThisWeek: 0,
      },
      { status: 403 }
    );

  } catch (error: any) {
    console.error("Check limit error:", error);
    return NextResponse.json(
      {
        error: "Failed to check generation limit, please try again later",
        canGenerate: false,
        reason: "INTERNAL_ERROR",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
