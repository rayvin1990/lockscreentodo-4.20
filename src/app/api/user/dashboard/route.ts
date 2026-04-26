import { NextRequest, NextResponse } from "next/server";
import { getUser, getWallpaperUsage, getTodayWallpaperUsage, upsertUser } from "~/lib/supabase/admin";
import { startOfWeek, startOfMonth } from "date-fns";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    let user = await getUser(userId);
    if (!user) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      user = await upsertUser(userId, {
        subscriptionPlan: 'PRO',
        trialEndsAt: trialEndsAt.toISOString(),
        isPro: true,
      });

      if (!user) {
        user = {
          id: userId,
          email: null,
          name: null,
          image: null,
          subscriptionPlan: 'PRO',
          isPro: true,
          trialEndsAt: trialEndsAt.toISOString(),
          subscriptionEndsAt: null,
          lemonSqueezyCustomerId: null,
          lemonSqueezySubscriptionId: null,
          notionAccessToken: null,
        };
      }
    }

    const now = new Date();

    // Get weekly usage
    const weekStart = startOfWeek(now);
    const weekStartString = weekStart.toISOString().split('T')[0];
    const weekUsages = await getWallpaperUsage(userId, weekStartString);

    // Get monthly usage
    const monthStart = startOfMonth(now);
    const monthStartString = monthStart.toISOString().split('T')[0];
    const monthUsages = await getWallpaperUsage(userId, monthStartString);

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    const todayUsage = await getTodayWallpaperUsage(userId, todayString);

    // Calculate stats
    const weekGenerateCount = weekUsages?.reduce((sum: number, u: any) => sum + (u.count || 0), 0) || 0;
    const weekDownloadCount = weekUsages?.reduce((sum: number, u: any) => sum + (u.downloadCount || 0), 0) || 0;
    const monthGenerateCount = monthUsages?.reduce((sum: number, u: any) => sum + (u.count || 0), 0) || 0;
    const monthDownloadCount = monthUsages?.reduce((sum: number, u: any) => sum + (u.downloadCount || 0), 0) || 0;
    const todayGenerateCount = todayUsage[0]?.count || 0;
    const todayDownloadCount = todayUsage[0]?.downloadCount || 0;

    // Subscription info
    const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const subscriptionEndsAt = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null;
    const daysRemaining = trialEndsAt
      ? Math.max(0, Math.floor((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        image: user.image,
        subscriptionPlan: user.subscriptionPlan || 'FREE',
        isPro: user.isPro || false,
        trialEndsAt: user.trialEndsAt,
        subscriptionEndsAt: user.subscriptionEndsAt,
        lemonSqueezyCustomerId: user.lemonSqueezyCustomerId,
        lemonSqueezySubscriptionId: user.lemonSqueezySubscriptionId,
        notionConnected: !!user.notionAccessToken,
      },
      stats: {
        today: {
          generateCount: todayGenerateCount,
          downloadCount: todayDownloadCount,
        },
        thisWeek: {
          generateCount: weekGenerateCount,
          downloadCount: weekDownloadCount,
        },
        thisMonth: {
          generateCount: monthGenerateCount,
          downloadCount: monthDownloadCount,
        },
      },
      usageHistory: weekUsages || [],
      daysRemaining,
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
