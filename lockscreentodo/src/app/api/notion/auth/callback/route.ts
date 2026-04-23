import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "~/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Notion OAuth error:", error);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=${encodeURIComponent(error)}`)
      );
    }

    if (!code) {
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=no_code`)
      );
    }

    console.log("OAuth state received:", state);

    const { userId } = await auth();
    if (!userId) {
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/sign-in?redirect=/en/generator`)
      );
    }

    const notionClientId = process.env.NOTION_CLIENT_ID;
    const notionClientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI ||
      `${new URL(req.url).origin}/api/notion/auth/callback`;

    if (!notionClientId || !notionClientSecret) {
      console.error("Notion OAuth credentials not configured");
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=oauth_config`)
      );
    }

    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${notionClientId}:${notionClientSecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=token_exchange_failed`)
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token data received:", {
      access_token: tokenData.access_token ? "present" : "missing",
      workspace_id: tokenData.workspace_id,
    });

    const existingUsers = await supabase.select('User', {
      select: 'id',
      eq: { id: userId },
      limit: 1,
    });
    const existingUser = existingUsers[0];

    if (!existingUser) {
      console.error("User not found in database:", userId);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=user_not_found`)
      );
    }

    try {
      await supabase.update('User', {
        notionAccessToken: tokenData.access_token,
        notionWorkspaceId: tokenData.workspace_id,
      }, { id: userId });
    } catch (updateError) {
      console.error("Failed to update user:", updateError);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=update_failed`)
      );
    }

    console.log("Notion token saved for user:", userId);

    const origin = new URL(req.url).origin;
    const redirectUrl = `${origin}/en/generator?notion=connected`;
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("Notion OAuth callback error:", error);
    const origin = new URL(req.url).origin;
    const redirectUrl = `${origin}/en/generator?error=internal_error`;
    return NextResponse.redirect(redirectUrl);
  }
}
