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
      if (!result) {
        return NextResponse.json(
          {
            error: "No Notion sources found",
            message: "Could not find a task-like database or page in Notion.",
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

    const existingTasks = await sql`
      SELECT id, notion_task_id, notion_database_id, notion_last_edited_time, deleted_at
      FROM tasks
      WHERE user_id = ${userId}
    `;

    const existingByNotionId = new Map<string, TaskRow>(
      existingTasks.map((t: TaskRow) => [t.notion_task_id, t])
    );

    const currentNotionIds = new Set<string>(allNotionTasks.map((t) => t.id));

    const added: NotionTask[] = [];
    const updated: NotionTask[] = [];
    const deleted: string[] = [];

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
      deleted.push(existing.notion_task_id);
    }

    if (added.length > 0 || updated.length > 0) {
      const tasksToUpsert = [...added, ...updated].map((task) => ({
        user_id: userId,
        text: task.text,
        completed: false,
        notion_task_id: task.id,
        notion_database_id: source!.id,
        notion_last_edited_time: task.lastEditedTime
          ? new Date(task.lastEditedTime)
          : null,
        deleted_at: null,
      }));

      for (const task of tasksToUpsert) {
        await sql`
          INSERT INTO tasks (user_id, text, completed, notion_task_id, notion_database_id, notion_last_edited_time, deleted_at)
          VALUES (
            ${task.user_id},
            ${task.text},
            ${task.completed},
            ${task.notion_task_id},
            ${task.notion_database_id},
            ${task.notion_last_edited_time},
            ${task.deleted_at}
          )
          ON CONFLICT (notion_task_id)
          DO UPDATE SET
            text = EXCLUDED.text,
            notion_last_edited_time = EXCLUDED.notion_last_edited_time,
            notion_database_id = EXCLUDED.notion_database_id,
            deleted_at = NULL
        `;
      }
    }

    for (const notionTaskId of deleted) {
      await sql`
        UPDATE tasks
        SET deleted_at = NOW()
        WHERE notion_task_id = ${notionTaskId}
        AND user_id = ${userId}
        AND deleted_at IS NULL
      `;
    }

    const lastSyncTime = new Date().toISOString();

    return NextResponse.json({
      success: true,
      added: added.length,
      updated: updated.length,
      deleted: deleted.length,
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