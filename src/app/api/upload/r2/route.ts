import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

// R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_API_TOKEN = process.env.R2_API_TOKEN || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image, filename } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate R2 configuration
    if (!R2_ACCOUNT_ID || !R2_API_TOKEN || !R2_BUCKET_NAME) {
      console.error("R2 configuration missing:", {
        hasAccountId: !!R2_ACCOUNT_ID,
        hasApiToken: !!R2_API_TOKEN,
        hasBucket: !!R2_BUCKET_NAME
      });
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    // Generate unique filename
    const uniqueFilename = `wallpapers/${userId}/${filename || `${Date.now()}.png`}`;

    console.log(`Uploading to R2: ${uniqueFilename}`);

    // Use Cloudflare REST API for R2
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/${uniqueFilename}`;

    // Decode base64 to binary
    const imageBuffer = Buffer.from(image, 'base64');

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${R2_API_TOKEN}`,
        'Content-Type': 'image/png',
      },
      body: imageBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("R2 upload failed:", response.status, errorText);
      throw new Error(`R2 upload failed: ${response.status}`);
    }

    const result = await response.json();

    // Construct public URL
    // R2.dev format for public access: https://{account_id}.r2.dev/{bucket}/{key}
    // Or use custom domain if configured
    let publicUrl: string;
    if (R2_PUBLIC_URL) {
      publicUrl = `${R2_PUBLIC_URL}/${uniqueFilename}`;
    } else {
      publicUrl = `https://${R2_ACCOUNT_ID}.r2.dev/${R2_BUCKET_NAME}/${uniqueFilename}`;
    }

    console.log(`Upload successful: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key: uniqueFilename,
      etag: result.result?.etag,
    });

  } catch (error: any) {
    console.error("R2 upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
