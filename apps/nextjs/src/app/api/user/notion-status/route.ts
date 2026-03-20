import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "~/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from("User")
      .select("notionAccessToken, notionWorkspaceId")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ connected: false }, { status: 500 });
    }

    return NextResponse.json({
      connected: Boolean(user?.notionAccessToken),
      workspaceId: user?.notionWorkspaceId || null,
    });
  } catch (error) {
    console.error("Notion status check error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
