import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "~/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const result = await supabase`
      SELECT "notionAccessToken", "notionWorkspaceId"
      FROM "User"
      WHERE id = ${userId}
    `;
    const user = result[0] ?? null;

    return NextResponse.json({
      connected: Boolean(user?.notionAccessToken),
      workspaceId: user?.notionWorkspaceId || null,
    });
  } catch (error) {
    console.error("Notion status check error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}