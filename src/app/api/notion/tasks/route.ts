import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "~/lib/supabase/server";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";
import {
  discoverBestSource,
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

    if (!process.env.NEXT_PUBLIC_NEON_DATABASE_URL) {
      console.error("Neon environment variable not configured");
      return NextResponse.json(
        { error: "Server configuration error: Neon not configured" },
        { status: 500 }
      );
    }

    const sql = createServerSupabaseClient();

    const users = await sql`
      SELECT "notionAccessToken" FROM "User" WHERE id = ${userId}
    `;
    const user = users[0];

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
        return NextResponse.json(
          {
            error: "No Notion sources found",
            message:
              "Could not find a task-like database or page in your Notion workspace. Share a page or database with the integration first.",
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