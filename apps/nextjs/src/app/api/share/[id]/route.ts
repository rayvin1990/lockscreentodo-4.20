import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/share/[id]
 * Retrieve and serve a shared wallpaper
 *
 * DEMO: Uses in-memory storage (NOT production-ready)
 * Production: Serve from S3, R2, or database
 */

// Use the same global storage
declare global {
  var wallpaperStore: Map<string, { data: string; createdAt: number }> | undefined;
}

const wallpaperStore = global.wallpaperStore || new Map<string, { data: string; createdAt: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shareId = params.id;

    console.log('🔍 查找分享:', shareId);
    console.log('📦 当前存储的 shares:', Array.from(wallpaperStore.keys()));

    // Retrieve from store
    const stored = wallpaperStore.get(shareId);

    if (!stored) {
      console.error('❌ Share not found:', shareId);
      return NextResponse.json(
        { error: 'Share not found or expired' },
        { status: 404 }
      );
    }

    console.log('✅ 找到分享数据:', shareId);

    // Check if expired (1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (stored.createdAt < oneHourAgo) {
      wallpaperStore.delete(shareId);
      console.error('❌ Share expired:', shareId);
      return NextResponse.json(
        { error: 'Share expired' },
        { status: 410 }
      );
    }

    // Parse base64 data
    const imageData = stored.data;

    // Handle data URL format (data:image/png;base64,...)
    let base64Data = imageData;
    if (imageData.startsWith('data:')) {
      base64Data = imageData.split(',')[1];
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    console.log('📤 返回图片数据，大小:', buffer.length, 'bytes');

    // Return as PNG image (inline for preview)
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': `inline; filename="wallpaper-${shareId}.png"`,
      },
    });

  } catch (error) {
    console.error('❌ Share retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve share' },
      { status: 500 }
    );
  }
}
