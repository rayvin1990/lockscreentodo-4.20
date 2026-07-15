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
        if (!result) {
          const diag = await diagnoseSearch(token).catch(() => null);
          return NextResponse.json(
            {
              success: false,
              error: "No Notion sources found",
              message:
                "Could not find a task-like database or page in your Notion workspace. Share a page or database with the integration first.",
              debug: {
                hint: "Open the Notion page/database → ... → Connections → add Lockscreen todo with Can view. Changes can take a minute to propagate.",
                rawSearchCount: diag?.rawResults.length ?? null,
                rawResults: (diag?.rawResults ?? []).slice(0, 10),
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}