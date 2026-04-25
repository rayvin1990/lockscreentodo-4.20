import { NextResponse } from "next/server";
import { getUser, upsertUser, getWallpaperUsage } from "~/lib/supabase/admin";
import { isAfter, startOfWeek } from "date-fns";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Please log in first",
          canDownload: false,
          reason: "NOT_AUTHENTICATED",
        },
        { status: 401 }
      );
    }

    console.log(`API: Checking download limit for user ${userId}`);

    let user = await getUser(userId);

    if (!user) {
      console.log(`User ${userId} not found, activating 7-day trial`);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      user = await upsertUser(userId, {
        isPro: true,
        trialEndsAt: trialEndsAt.toISOString(),
        subscriptionPlan: 'PRO',
      });

      if (!user) {
        user = await getUser(userId);
      }

      if (!user) {
        console.error(`Unable to create or query user ${userId}`);
        return NextResponse.json(
          { error: "User not found", canDownload: false, reason: "USER_NOT_FOUND" },
          { status: 404 }
        );
      }

      console.log(`User ${userId} created with 7-day trial, expires on ${trialEndsAt.toLocaleDateString()}`);
    }

    const now = new Date();
    const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const subscriptionEndsAt = user?.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null;
    const isTrialActive = trialEndsAt && isAfter(trialEndsAt, now);
    const isTrialExpired = trialEndsAt && !isTrialActive;
    const isSubscriptionActive = subscriptionEndsAt && isAfter(subscriptionEndsAt, now);
    const isPro = user?.isPro || user?.subscriptionPlan === 'PRO' || isSubscriptionActive;

    const daysRemaining = trialEndsAt
      ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    if (isPro || isTrialActive) {
      console.log(`User ${userId} (${isPro ? 'Pro' : 'Trial'}) - unlimited downloads`);
      return NextResponse.json({
        canDownload: true,
        isPro: !!isPro,
        isTrialActive: !!isTrialActive,
        isTrialExpired: false,
        remainingThisWeek: -1,
        message: isPro
          ? "Pro user - unlimited downloads"
          : `Trial period - ${daysRemaining} days remaining`,
      });
    }

    console.log(`Free user, checking this week's download count`);

    const weekStart = startOfWeek(now);
    const weekStartString = weekStart.toISOString().split('T')[0];

    const weekUsages = await getWallpaperUsage(userId, weekStartString);

    const weekDownloadCount = weekUsages?.reduce((sum: number, usage: { downloadCount?: number }) => sum + (usage.downloadCount || 0), 0) || 0;

    const weeklyLimit = isTrialExpired ? 1 : 3;
    const remainingThisWeek = Math.max(0, weeklyLimit - weekDownloadCount);

    console.log(`This week's downloads: ${weekDownloadCount}, limit: ${weeklyLimit}/week, remaining: ${remainingThisWeek}`);

    if (weekDownloadCount >= weeklyLimit) {
      console.log(`User ${userId} weekly download limit reached (${weekDownloadCount}/${weeklyLimit})`);
      return NextResponse.json(
        {
          error: isTrialExpired
            ? "Weekly download limit reached (1/1). Your trial has ended. Upgrade to Pro for unlimited downloads"
            : "Weekly download limit reached (3/3). Upgrade to Pro for unlimited downloads",
          canDownload: false,
          reason: "WEEKLY_LIMIT_REACHED",
          isPro: false,
          isTrialActive: false,
          isTrialExpired,
          weekDownloadCount,
          remainingThisWeek: 0,
        },
        { status: 403 }
      );
    }

    console.log(`User ${userId} can download (${remainingThisWeek} remaining)`);
    return NextResponse.json({
      canDownload: true,
      isPro: false,
      isTrialActive: false,
      isTrialExpired,
      weekDownloadCount,
      remainingThisWeek,
      message: isTrialExpired
        ? `Trial ended - ${remainingThisWeek} download remaining this week`
        : `${remainingThisWeek} downloads remaining this week`,
    });

  } catch (error: any) {
    console.error("Download limit check error:", error);
    return NextResponse.json(
      {
        error: "Failed to check download limit, please try again later",
        canGenerate: false,
        reason: "INTERNAL_ERROR",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
