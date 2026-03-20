import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "@/lib/neon/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Initialize Neon client
const sql = createNeonClient();

/**
 * Record download/QR code generation usage
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Get Clerk user info
    const { userId } = await auth();

    if (!userId) {
      console.error('❌ record-download: No userId found');
      return NextResponse.json(
        {
          error: "Please log in first",
          success: false,
        },
        { status: 401 }
      );
    }

    console.log(`📝 API: Recording download for user ${userId}`);

    // 2. Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    // 3. Check if record exists
    const existingRecords = await sql`
      SELECT * FROM "WallpaperUsage" 
      WHERE "userId" = ${userId} 
      AND "date" = ${todayString}
    `;

    if (existingRecords.length > 0) {
      // Update existing record, increment download_count
      const existingUsage = existingRecords[0];
      const newDownloadCount = (existingUsage.downloadCount || 0) + 1;
      console.log(`📝 更新下载记录: ${existingUsage.downloadCount} → ${newDownloadCount}`);
      
      await sql`
        UPDATE "WallpaperUsage" 
        SET "downloadCount" = ${newDownloadCount}
        WHERE id = ${existingUsage.id}
      `;
      
      console.log(`✅ 更新成功，今日下载 ${newDownloadCount} 次`);
    } else {
      // Create new record
      console.log(`📝 创建新使用记录（下载）: userId=${userId}, date=${todayString}`);
      
      await sql`
        INSERT INTO "WallpaperUsage" ("userId", "date", "count", "downloadCount")
        VALUES (${userId}, ${todayString}, 0, 1)
      `;
      
      console.log(`✅ 创建成功，今日首次下载`);
    }

    console.log(`✅ Download recorded for user ${userId}`);

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
