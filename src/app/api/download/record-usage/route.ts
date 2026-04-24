import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getTodayWallpaperUsage, upsertWallpaperUsage } from "~/lib/supabase/admin";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error('record-download: No userId found');
      return NextResponse.json(
        {
          error: "Please log in first",
          success: false,
        },
        { status: 401 }
      );
    }

    console.log(`API: Recording download for user ${userId}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    const existingRecords = await getTodayWallpaperUsage(userId, todayString);

    if (existingRecords.length > 0) {
      const existingUsage = existingRecords[0];
      if (!existingUsage) {
        return NextResponse.json(
          { error: "Failed to access usage record", success: false },
          { status: 500 }
        );
      }
      const newDownloadCount = (existingUsage.downloadCount || 0) + 1;
      console.log(`更新下载记录: ${existingUsage.downloadCount} → ${newDownloadCount}`);

      await upsertWallpaperUsage(userId, todayString, {
        downloadCount: newDownloadCount,
      });

      console.log(`更新成功，今日下载 ${newDownloadCount} 次`);
    } else {
      console.log(`创建新使用记录（下载）: userId=${userId}, date=${todayString}`);

      await upsertWallpaperUsage(userId, todayString, {
        count: 0,
        downloadCount: 1,
      });

      console.log(`创建成功，今日首次下载`);
    }

    console.log(`Download recorded for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Recorded successfully",
    });

  } catch (error: any) {
    console.error("Record download error:", error);
    return NextResponse.json(
      {
        error: "Failed to record download",
        success: false,
        details: error.message,
      },
      { status: 500 }
    );
  }
}