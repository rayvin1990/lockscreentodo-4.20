import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";
import {
  discoverBestSource,
  diagnoseSearch,
  fetchTasksFromSource,
  NotionTask,
  NotionTaskSource,
} from "~/lib/notion/sources";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("Supabase environment variable not configured");
      return NextResponse.json(
        { error: "Server configuration error: Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server configuration error: Supabase not configured" },
        { status: 500 }
      );
    }

    const { data: user, error: userError } = await supabase
      .from("User")
      .select("notionAccessToken")
      .eq("id", userId)
      .maybeSingle();

    if (userError) {
      console.error("User lookup error:", userError);
      return NextResponse.json(
        { error: "Failed to load user" },
        { status: 500 }
      );
    }

    if (!user || !user.notionAccessToken) {
      return NextResponse.json(
        {
          error: "Notion not connected. Please connect your Notion account first.",
        },
        { status: 400 }
      );
    }

    const token = user.notionAccessToken;
    const url = new URL(req.url);
    const explicitDbId = url.searchParams.get("databaseId");
    const explicitPageId = url.searchParams.get("pageId");

    let source: NotionTaskSource | null = null;
    let tasks: NotionTask[] = [];

    if (explicitDbId) {
      source = {
        id: explicitDbId,
        type: "database",
        title: "Manual selection",
        taskCount: 0,
      };
      tasks = await fetchTasksFromSource(token, source);
    } else if (explicitPageId) {
      source = {
        id: explicitPageId,
        type: "page",
        title: "Manual selection",
        taskCount: 0,
      };
      tasks = await fetchTasksFromSource(token, source);
      } else {
        const result = await discoverBestSource(token);
        if (!result || !result.source || !result.source.id || result.tasks.length === 0) {
          const diag = await diagnoseSearch(token).catch(() => null);
          const rawResults = (result?.rawSearchResults?.length ? result.rawSearchResults : (diag?.rawResults ?? [])) as any[];
          const searchFilter = result?.searchFilterUsed ?? "?";
          const hasDatabases = rawResults.some((r: any) => r.object === "database");
          const hasPages = rawResults.some((r: any) => r.object === "page");

          let hint = "1. Open your Notion database → 2. Click ... menu → 3. Connections → 4. Add Lockscreen todo → 5. Wait 1 min, then retry.";
          if (!hasDatabases && hasPages) {
            hint = "No databases found in your Notion workspace. " + hint;
          } else if (!hasDatabases && !hasPages) {
            hint = "No pages or databases found. Make sure you have added the Lockscreen todo integration to your Notion database. " + hint;
          } else if (hasDatabases) {
            hint = "Databases were found but none contained tasks. Check that your database has rows with text content.";
          }

          return NextResponse.json(
            {
              success: false,
              error: "No Notion sources found",
              message:
                "Could not find a task-like database or page in your Notion workspace.",
              debug: {
                hint,
                rawSearchCount: rawResults.length,
                rawResults: rawResults.slice(0, 10),
                searchFilterUsed: searchFilter,
                evaluations: diag?.evaluations ?? [],
              },
            },
            { status: 404 }
          );
        }
        source = result.source;
        tasks = result.tasks;
      }

    console.log(
      `[Notion] /tasks returned ${tasks.length} tasks from "${source.title}" (${source.type})`
    );

    return NextResponse.json({
      success: true,
      tasks,
      databaseName: source.title,
      sourceType: source.type,
      sourceId: source.id,
      count: tasks.length,
    });
  } catch (error) {
    console.error("Notion tasks fetch error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    // Dead/revoked Notion token: Notion returns 401. Match only the real
    // shapes thrown by notionFetch ("failed: 401" or code:"unauthorized") —
    // a bare /401/ would also match page IDs / titles containing "401" and
    // wrongly wipe a perfectly valid token.
    if (/\bfailed:\s*401\b|"code"\s*:\s*"unauthorized"/i.test(msg)) {
      try {
        const supabase = getSupabase();
        const userId = await getAuthenticatedUserId(req);
        if (supabase && userId) {
          await supabase
            .from("User")
            .update({ notionAccessToken: null })
            .eq("id", userId);
          console.log(
            "[Notion] token revoked (401) — cleared stale token for user",
            userId.slice(0, 12) + "…"
          );
        }
      } catch (cleanupError) {
        console.error("Failed to clear stale Notion token:", cleanupError);
      }
      return NextResponse.json(
        {
          error: "notion_disconnected",
          message:
            "Your Notion connection has expired or was revoked. Please reconnect your Notion account and try again.",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}