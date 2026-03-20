import { NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Stripe webhook disabled for wallpaper project
// This endpoint is not needed for the lockscreen generator functionality
export async function GET() {
  return NextResponse.json(
    { error: "Stripe webhook not configured" },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Stripe webhook not configured" },
    { status: 503 }
  );
}
