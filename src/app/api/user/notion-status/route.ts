import { NextResponse } from "next/server";
import { getSupabase } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ connected: false }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("User")
      .select("notionAccessToken, notionWorkspaceId")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Notion status check error:", error);
      return NextResponse.json({ connected: false }, { status: 500 });
    }

    return NextResponse.json({
      connected: Boolean(data?.notionAccessToken),
      workspaceId: data?.notionWorkspaceId || null,
    });
  } catch (error) {
    console.error("Notion status check error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}