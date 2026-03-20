import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * POST /api/share
 * Create a share ID for a wallpaper image
 *
 * DEMO: Uses in-memory storage (NOT production-ready)
 * Production: Use S3, R2, or database storage
 */

// Global in-memory storage shared across all API routes
// WARNING: This clears on server restart. Replace with persistent storage in production.
declare global {
  var wallpaperStore: Map<string, { data: string; createdAt: number }> | undefined;
}

if (!global.wallpaperStore) {
  global.wallpaperStore = new Map<string, { data: string; createdAt: number }>();
}

const wallpaperStore = global.wallpaperStore;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData } = body;

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    // Generate unique share ID
    const shareId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Store in memory (expires after 1 hour)
    wallpaperStore.set(shareId, {
      data: imageData,
      createdAt: Date.now()
    });

    console.log('💾 存储壁纸数据:', shareId);

    // Clean up old entries (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, value] of wallpaperStore.entries()) {
      if (value.createdAt < oneHourAgo) {
        wallpaperStore.delete(id);
      }
    }

    // Construct share URL - point to the download page instead of the image
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const shareUrl = `${baseUrl}/share/${shareId}`;

    console.log('✅ 分享 URL 已生成:', shareUrl);

    return NextResponse.json({
      shareId,
      shareUrl,
    });

  } catch (error) {
    console.error('❌ Share creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/share
 * List active shares (for debugging/admin)
 */
export async function GET() {
  return NextResponse.json({
    count: wallpaperStore.size,
    shares: Array.from(wallpaperStore.keys()),
    message: 'In-memory storage active. Replace with persistent storage in production.'
  });
}
