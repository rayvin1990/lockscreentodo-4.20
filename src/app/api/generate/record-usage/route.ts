import { NextRequest, NextResponse } from "next/server";
import { getTodayWallpaperUsage, upsertWallpaperUsage } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      console.error('record-usage: No userId found');
      return NextResponse.json(
        {
          error: "Please sign in first",
          success: false,
        },
        { status: 401 }
      );
    }

    console.log(`API: Recording wallpaper generation for user ${userId}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    const existingRecords = await getTodayWallpaperUsage(userId, todayString);

    const existingUsage = existingRecords[0];

    console.log(`Today's usage record:`, existingUsage ? `exists, count=${existingUsage.count}` : 'not found');

    if (existingUsage) {
      const newCount = (existingUsage.count || 0) + 1;
      console.log(`Updating usage record: ${existingUsage.count} -> ${newCount}`);

      await upsertWallpaperUsage(userId, todayString, {
        count: newCount,
      });

      console.log(`Update successful, today's generation count: ${newCount}`);
    } else {
      console.log(`Creating new usage record: userId=${userId}, date=${todayString}, count=1`);

      await upsertWallpaperUsage(userId, todayString, {
        count: 1,
        downloadCount: 0,
      });

      console.log(`Creation successful, first generation today`);
    }

    return NextResponse.json({
      success: true,
      message: "Recorded successfully",
    });

  } catch (error: any) {
    console.error("Error recording usage count:", error);
    return NextResponse.json(
      {
        error: "Failed to record usage count",
        success: false,
        details: error.message,
      },
      { status: 500 }
    );
  }
}
