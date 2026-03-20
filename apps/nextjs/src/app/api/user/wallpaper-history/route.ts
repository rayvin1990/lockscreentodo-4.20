import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "@/lib/neon/server";

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

    console.log(`📸 Fetching wallpaper history for user ${userId}`);

    // Fetch wallpapers from Neon, ordered by most recent first
    const wallpapers = await sql`
      SELECT * FROM "Wallpaper" 
      WHERE "userId" = ${userId}
      ORDER BY "created_at" DESC
      LIMIT 20
    `;

    console.log(`✅ Found ${wallpapers?.length || 0} wallpapers`);

    // Transform data to match expected format
    const transformedWallpapers = wallpapers?.map((wp: any) => ({
      id: wp.id,
      imageUrl: wp.imageUrl,
      createdAt: wp.created_at,
      taskCount: wp.taskCount || 0,
    })) || [];

    return NextResponse.json({ wallpapers: transformedWallpapers });
  } catch (error: any) {
    console.error("Error fetching wallpaper history:", error);

    // If table doesn't exist yet, return empty array
    if (error.code === '42P01') {
      console.log('⚠️ Wallpaper table does not exist yet, returning empty array');
      return NextResponse.json({ wallpapers: [] });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
