import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") || "/zh/generator";

  // Redirect to the generator page or the original destination
  return NextResponse.redirect(new URL(from, request.url));
}
