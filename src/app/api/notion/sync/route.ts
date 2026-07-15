import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";
import {
  discoverBestSource,
  fetchTasksFromSource,
  NotionTask,
  NotionTaskSource,
} from "~/lib/notion/sources";

export const dynamic = "force-dynamic";

interface TaskRow {
  notion_task_id: string;
  notion_database_id: string | null;
  notion_last_edited_time: string | null;
  deleted_at: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const notionToken = user.notionAccessToken;

    const url = new URL(req.url);
    const explicitDbId = url.searchParams.get("databaseId");
    const explicitPageId = url.searchParams.get("pageId");

    let source: NotionTaskSource | null = null;
    let allNotionTasks: NotionTask[] = [];

    if (explicitDbId) {
      source = {
        id: explicitDbId,
        type: "database",
        title: "Manual selection",
        taskCount: 0,
      };
      allNotionTasks = await fetchTasksFromSource(notionToken, source);
    } else if (explicitPageId) {
      source = {
        id: explicitPageId,
        type: "page",
        title: "Manual selection",
        taskCount: 0,
      };
      allNotionTasks = await fetchTasksFromSource(notionToken, source);
    } else {
      const result = await discoverBestSource(notionToken);
      if (!result || !result.source || !result.source.id || result.tasks.length === 0) {
        return NextResponse.json(
          {
            error: "No Notion sources found",
            message: "Could not find a task-like database or page in Notion. Make sure your Notion database is shared with the Lockscreen todo integration.",
            debug: {
              rawSearchCount: result?.rawSearchCount ?? 0,
              rawResults: (result?.rawSearchResults ?? []).slice(0, 10),
              searchFilterUsed: result?.searchFilterUsed ?? "?",
            },
          },
          { status: 404 }
        );
      }
      source = result.source;
      allNotionTasks = result.tasks;
    }

    console.log(
      `[Notion] /sync source "${source.title}" (${source.type}) → ${allNotionTasks.length} tasks`
    );

    const { data: existingRows, error: existingError } = await supabase
      .from("tasks")
      .select("notion_task_id, notion_database_id, notion_last_edited_time, deleted_at")
      .eq("user_id", userId);

    if (existingError) {
      console.error("Failed to load existing tasks:", existingError);
      return NextResponse.json(
        { error: "Failed to load existing tasks" },
        { status: 500 }
      );
    }

    const existingTasks: TaskRow[] = (existingRows || []) as TaskRow[];
    const existingByNotionId = new Map<string, TaskRow>(
      existingTasks.map((t) => [t.notion_task_id, t])
    );

    const currentNotionIds = new Set<string>(allNotionTasks.map((t) => t.id));

    const added: NotionTask[] = [];
    const updated: NotionTask[] = [];
    const deletedIds: string[] = [];

    for (const notionTask of allNotionTasks) {
      const existing = existingByNotionId.get(notionTask.id);

      if (!existing) {
        added.push(notionTask);
      } else if (
        existing.notion_last_edited_time &&
        notionTask.lastEditedTime &&
        new Date(notionTask.lastEditedTime) >
          new Date(existing.notion_last_edited_time)
      ) {
        updated.push(notionTask);
      }
    }

    for (const existing of existingTasks) {
      if (!existing.notion_task_id) continue;
      if (currentNotionIds.has(existing.notion_task_id)) continue;
      if (existing.notion_database_id !== source.id) continue;
      deletedIds.push(existing.notion_task_id);
    }

    if (added.length > 0 || updated.length > 0) {
      const tasksToUpsert = [...added, ...updated].map((task) => ({
        user_id: userId,
        text: task.text,
        completed: false,
        notion_task_id: task.id,
        notion_database_id: source!.id,
        notion_last_edited_time: task.lastEditedTime
          ? new Date(task.lastEditedTime).toISOString()
          : null,
        deleted_at: null,
      }));

      const { error: upsertError } = await supabase
        .from("tasks")
        .upsert(tasksToUpsert, { onConflict: "notion_task_id" });

      if (upsertError) {
        console.error("Failed to upsert tasks:", upsertError);
        return NextResponse.json(
          { error: "Failed to upsert tasks" },
          { status: 500 }
        );
      }
    }

    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("tasks")
        .update({ deleted_at: new Date().toISOString() })
        .in("notion_task_id", deletedIds)
        .eq("user_id", userId)
        .is("deleted_at", null);

      if (deleteError) {
        console.error("Failed to soft delete tasks:", deleteError);
        return NextResponse.json(
          { error: "Failed to soft delete tasks" },
          { status: 500 }
        );
      }
    }

    const lastSyncTime = new Date().toISOString();

    return NextResponse.json({
      success: true,
      added: added.length,
      updated: updated.length,
      deleted: deletedIds.length,
      totalInNotion: allNotionTasks.length,
      databaseName: source.title,
      sourceType: source.type,
      sourceId: source.id,
      lastSyncTime,
    });
  } catch (error) {
    console.error("Notion sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}