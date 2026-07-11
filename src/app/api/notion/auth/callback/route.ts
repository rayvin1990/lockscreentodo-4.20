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

    const sql = createServerSupabaseClient();

    const existingUsers = await sql`SELECT "id" FROM "User" WHERE "id" = ${userId} LIMIT 1`;
    const existingUser = existingUsers[0];

    if (!existingUser) {
      // User doesn't exist in Neon yet (likely created in Supabase via check-limit).
      // Create the record here so the token can be saved.
      console.log("User not found in Neon, creating record:", userId);
      try {
        await sql`INSERT INTO "User" ("id", "notionAccessToken", "notionWorkspaceId") VALUES (${userId}, ${tokenData.access_token}, ${tokenData.workspace_id})`;
        console.log("User created with Notion token:", userId);
      } catch (insertError) {
        console.error("Failed to create user in Neon:", insertError);
        const origin = new URL(req.url).origin;
        return NextResponse.redirect(
          new URL(`${origin}/en/generator?error=user_create_failed`)
        );
      }
    } else {
      try {
        await sql`UPDATE "User" SET "notionAccessToken" = ${tokenData.access_token}, "notionWorkspaceId" = ${tokenData.workspace_id} WHERE "id" = ${userId}`;
      } catch (updateError) {
        console.error("Failed to update user:", updateError);
        const origin = new URL(req.url).origin;
        return NextResponse.redirect(
          new URL(`${origin}/en/generator?error=update_failed`)
        );
      }
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