import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * 删除壁纸历史
 */
export async function DELETE(req: NextRequest) {
  try {
    // Import prisma only at runtime (not during build)
    const { prisma } = await import("@saasfly/db");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Please sign in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const wallpaperId = searchParams.get("id");

    if (!wallpaperId) {
      return NextResponse.json(
        { error: "MISSING_ID", message: "Wallpaper ID is required" },
        { status: 400 }
      );
    }

    // 验证壁纸属于当前用户
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id: wallpaperId },
    });

    if (!wallpaper) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Wallpaper not found" },
        { status: 404 }
      );
    }

    if (wallpaper.userId !== userId) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "You can only delete your own wallpapers" },
        { status: 403 }
      );
    }

    // 删除壁纸
    await prisma.wallpaper.delete({
      where: { id: wallpaperId },
    });

    return NextResponse.json({
      success: true,
      message: "Wallpaper deleted",
    });
  } catch (error) {
    console.error("Delete wallpaper API error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to delete wallpaper" },
      { status: 500 }
    );
  }
}
