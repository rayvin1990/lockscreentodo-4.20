import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/download-wallpaper/[id]
 * Download wallpaper with Content-Disposition: attachment header
 * This forces browser to download the image instead of displaying it
 */

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

    console.log('📥 下载壁纸请求:', shareId);

    // Retrieve from store
    const stored = wallpaperStore.get(shareId);

    if (!stored) {
      console.error('❌ Share not found:', shareId);
      return NextResponse.json(
        { error: 'Share not found or expired' },
        { status: 404 }
      );
    }

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

    // Handle data URL format
    let base64Data = imageData;
    if (imageData.startsWith('data:')) {
      base64Data = imageData.split(',')[1];
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    console.log('✅ 返回可下载图片，大小:', buffer.length, 'bytes');

    // Return as downloadable PNG
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': `attachment; filename="wallpaper-${shareId}.png"`,
      },
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download wallpaper' },
      { status: 500 }
    );
  }
}
