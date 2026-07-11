import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "~/lib/supabase/server";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const sql = createServerSupabaseClient();

    const users = await sql`SELECT "notionAccessToken", "notionWorkspaceId" FROM "User" WHERE id = ${userId}`;

    const user = users[0];

    return NextResponse.json({
      connected: Boolean(user?.notionAccessToken),
      workspaceId: user?.notionWorkspaceId || null,
    });
  } catch (error) {
    console.error("Notion status check error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
