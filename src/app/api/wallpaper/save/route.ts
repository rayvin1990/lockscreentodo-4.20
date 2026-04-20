import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "@/lib/neon/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const sql = createNeonClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

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

    try {
      const result = await sql`
        INSERT INTO "Wallpaper" ("userId", "imageUrl", "taskCount", "style", "prompt")
        VALUES (${userId}, ${imageUrl}, ${taskCount || 0}, ${style || null}, ${prompt || null})
        RETURNING *
      `;

      const wallpaper = result[0];
      console.log(`Wallpaper saved successfully: ${wallpaper?.id}`);

      return NextResponse.json({
        success: true,
        wallpaper: wallpaper,
        message: "Wallpaper saved successfully",
      });
    } catch (insertError: any) {
      if (insertError.code === '42P01') {
        console.log('Wallpaper table does not exist yet. Please create it in Neon');
        return NextResponse.json({
          success: true,
          message: "Wallpaper table not created yet, skipping save",
          tableMissing: true,
        });
      }
      throw insertError;
    }

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