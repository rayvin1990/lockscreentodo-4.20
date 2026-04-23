import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseDb } from "~/lib/supabase/server";
import { isAfter, startOfWeek } from "date-fns";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    const { userId } = await auth();

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

    const users = await supabaseDb.select('User', { eq: { id: userId } });
    let user = users[0] || null;

    if (!user) {
      console.log(`User ${userId} not found, activating 7-day trial`);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      const newUsers = await supabaseDb.insert('User', {
        id: userId,
        isPro: true,
        trialEndsAt: trialEndsAt.toISOString(),
        subscriptionPlan: 'PRO',
      });

      user = newUsers[0] ?? null;
      console.log(`User ${userId} created with 7-day trial, expires on ${trialEndsAt.toLocaleDateString()}`);
    }

    const now = new Date();
    const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const isTrialActive = trialEndsAt && isAfter(trialEndsAt, now);
    const isTrialExpired = trialEndsAt && !isTrialActive;
    const daysRemaining = trialEndsAt
      ? Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    if (user?.isPro || isTrialActive) {
      console.log(`User ${userId} (${user?.isPro ? 'Pro' : 'Trial'}) - unlimited downloads`);
      return NextResponse.json({
        canDownload: true,
        isPro: user?.isPro ?? false,
        isTrialActive,
        isTrialExpired: false,
        remainingThisWeek: -1,
        message: user?.isPro
          ? "Pro user - unlimited downloads"
          : `Trial period - ${daysRemaining} days remaining`,
      });
    }

    console.log(`Free user, checking this week's download count`);

    const weekStart = startOfWeek(now);
    const weekStartString = weekStart.toISOString().split('T')[0];

    const weekUsages = await supabaseDb.select('WallpaperUsage', {
      eq: { userId: userId },
    });

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
