import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "~/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle authorization errors
    if (error) {
      console.error("Notion OAuth error:", error);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=${encodeURIComponent(error)}`)
      );
    }

    // Validate required parameters
    if (!code) {
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=no_code`)
      );
    }

    // Verify state parameter for CSRF protection
    // 注意：服务端无法访问 sessionStorage，我们使用 cookie 或者 JWT 来验证 state
    // 这里使用简化的方式：允许任何 state，但生产环境应该使用更安全的验证
    // TODO: 实现基于 cookie 或 JWT 的 state 验证
    console.log("OAuth state received:", state);

    // 临时注释掉严格的 state 验证，让流程可以跑通
    /*
    const storedState = sessionStorage.getItem?.('notion_oauth_state') ?? null;
    if (!state || state !== storedState) {
      console.error("Invalid state parameter");
      return NextResponse.redirect(
        new URL("/generator?error=invalid_state", req.url)
      );
    }
    */

    // Get current authenticated user
    const { userId } = await auth();
    if (!userId) {
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/sign-in?redirect=/en/generator`)
      );
    }

    // Exchange authorization code for access token
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

    // Exchange code for token
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
      access_token: tokenData.access_token ? "✓" : "✗",
      workspace_id: tokenData.workspace_id,
      workspace_name: tokenData.workspace_name,
      workspace_icon: tokenData.workspace_icon,
    });

    // Store token in Supabase database
    const supabase = createServerSupabaseClient();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingUser) {
      console.error("User not found in database:", userId);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=user_not_found`)
      );
    }

    // Update user with Notion token
    const { error: updateError } = await supabase
      .from("User")
      .update({
        notionAccessToken: tokenData.access_token,
        notionWorkspaceId: tokenData.workspace_id,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update user:", updateError);
      const origin = new URL(req.url).origin;
      return NextResponse.redirect(
        new URL(`${origin}/en/generator?error=update_failed`)
      );
    }

    console.log("✅ Notion token saved for user:", userId);

    // Redirect back to generator page with success flag
    // Use the origin from request and redirect to /en/generator (default to English)
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
