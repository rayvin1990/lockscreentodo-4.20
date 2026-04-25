import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "~/lib/supabase/admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();

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
