import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "@/lib/neon/server";
import { startOfWeek } from "date-fns";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Neon client
const sql = createNeonClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`📊 Fetching usage stats for user ${userId}`);

    // Get all usage records for this user using Neon
    const allUsages = await sql`
      SELECT * FROM "WallpaperUsage" WHERE "userId" = ${userId}
    `;

    // Calculate total stats
    const totalGenerated = allUsages?.reduce((sum: number, usage: any) => sum + (usage.count || 0), 0) || 0;
    const totalDownloaded = allUsages?.reduce((sum: number, usage: any) => sum + (usage.downloadCount || 0), 0) || 0;

    console.log(`📊 Total stats: generated=${totalGenerated}, downloaded=${totalDownloaded}`);

    // Get this week's usage
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekStartString = weekStart.toISOString().split('T')[0];

    const weekUsages = await sql`
      SELECT * FROM "WallpaperUsage" 
      WHERE "userId" = ${userId} 
      AND "date" >= ${weekStartString}
    `;

    const weekGenerated = weekUsages?.reduce((sum: number, usage: any) => sum + (usage.count || 0), 0) || 0;
    const weekDownloaded = weekUsages?.reduce((sum: number, usage: any) => sum + (usage.downloadCount || 0), 0) || 0;

    console.log(`📊 Weekly stats: generated=${weekGenerated}, downloaded=${weekDownloaded}`);

    const stats = {
      totalGenerated,
      totalDownloaded,
      weekGenerated,
      weekDownloaded,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
