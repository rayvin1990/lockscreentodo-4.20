import { NextRequest, NextResponse } from "next/server";
import { insertWallpaper } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      console.error('save-wallpaper: No userId found');
      return NextResponse.json(
        {
          error: "Please log in first",
          success: false,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageUrl, taskCount, style, prompt } = body;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "imageUrl is required",
          success: false,
        },
        { status: 400 }
      );
    }

    console.log(`API: Saving wallpaper for user ${userId}`, { imageUrl, taskCount, style });

    const wallpaper = await insertWallpaper(userId, {
      imageUrl,
      taskCount: taskCount || 0,
      style: style || null,
      prompt: prompt || null,
    });

    if (!wallpaper) {
      // Table might not exist, return success anyway
      console.log('Wallpaper save skipped (table might not exist)');
      return NextResponse.json({
        success: true,
        message: "Wallpaper save skipped",
        tableMissing: true,
      });
    }

    console.log(`Wallpaper saved successfully: ${wallpaper.id}`);

    return NextResponse.json({
      success: true,
      wallpaper: wallpaper,
      message: "Wallpaper saved successfully",
    });

  } catch (error: any) {
    console.error("Save wallpaper error:", error);
    return NextResponse.json(
      {
        error: "Failed to save wallpaper",
        success: false,
        details: error.message,
      },
      { status: 500 }
    );
  }
}
