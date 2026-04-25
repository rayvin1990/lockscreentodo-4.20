import { NextRequest, NextResponse } from "next/server";
import { getUser } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const user = await getUser(userId);

    return NextResponse.json({
      connected: Boolean(user?.notionAccessToken),
      workspaceId: user?.notionWorkspaceId || null,
    });
  } catch (error) {
    console.error("Notion status check error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
