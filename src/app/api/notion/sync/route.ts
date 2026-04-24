import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "~/lib/supabase/server";

export const dynamic = 'force-dynamic';

interface NotionTask {
  id: string;
  text: string;
  dueDate?: string;
  lastEditedTime?: string;
}

interface NotionPage {
  id: string;
  properties: Record<string, any>;
  last_edited_time: string;
}

interface NotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
}

interface NotionSearchResponse {
  results: Array<NotionDatabase | NotionPage>;
}

interface NotionQueryResponse {
  results: NotionPage[];
  next_cursor?: string;
  has_more: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sql = createServerSupabaseClient();

    // Get user's Notion access token
    const users = await sql`
      SELECT "notionAccessToken" FROM "User" WHERE id = ${userId}
    `;

    const user = users[0];

    if (!user || !user.notionAccessToken) {
      return NextResponse.json(
        { error: "Notion not connected. Please connect your Notion account first." },
        { status: 400 }
      );
    }

    const notionToken = user.notionAccessToken;

    // Search for task databases in Notion
    const searchResponse = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          value: "database",
          property: "object",
        },
        sort: {
          direction: "descending",
          timestamp: "last_edited_time",
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Notion search failed:", errorText);
      return NextResponse.json(
        { error: "Failed to search Notion databases" },
        { status: searchResponse.status }
      );
    }

    const searchData: NotionSearchResponse = await searchResponse.json();

    // Find task databases
    const taskDatabases = searchData.results.filter((item): item is NotionDatabase => {
      if (!("title" in item)) return false;
      const title = item.title?.[0]?.plain_text?.toLowerCase() || "";
      return title.includes("task") ||
             title.includes("todo") ||
             title.includes("待办") ||
             title.includes("任务") ||
             title.includes("to-do");
    });

    if (taskDatabases.length === 0) {
      return NextResponse.json(
        { error: "No task databases found", message: "Please create a database in Notion with 'task' or 'todo' in the name" },
        { status: 404 }
      );
    }

    const databaseId = taskDatabases[0].id;
    const databaseName = taskDatabases[0].title?.[0]?.plain_text || "Untitled";

    // Fetch all tasks from Notion with pagination
    const allNotionTasks: NotionTask[] = [];
    let cursor: string | undefined;

    do {
      const queryBody: Record<string, any> = {};
      if (cursor) {
        queryBody.start_cursor = cursor;
      }

      const queryResponse = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${notionToken}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify(queryBody),
        }
      );

      if (!queryResponse.ok) {
        const errorText = await queryResponse.text();
        console.error("Notion query failed:", errorText);
        return NextResponse.json(
          { error: "Failed to query tasks from Notion" },
          { status: 500 }
        );
      }

      const queryData: NotionQueryResponse = await queryResponse.json();

      for (const page of queryData.results) {
        // Extract title
        let title = "Untitled";
        const titleProp = Object.entries(page.properties).find(
          ([key, value]) =>
            value.type === "title" ||
            key.toLowerCase().includes("name") ||
            key.toLowerCase().includes("title")
        );

        if (titleProp) {
          const titleValue = titleProp[1];
          if (titleValue.type === "title" && titleValue.title?.[0]?.plain_text) {
            title = titleValue.title[0].plain_text;
          }
        }

        // Extract due date
        let dueDate: string | undefined;
        const dateProp = Object.entries(page.properties).find(
          ([_, value]) => value.type === "date"
        );

        if (dateProp) {
          const dateValue = dateProp[1];
          if (dateValue.type === "date" && dateValue.date?.start) {
            dueDate = dateValue.date.start;
          }
        }

        allNotionTasks.push({
          id: page.id,
          text: title,
          dueDate,
          lastEditedTime: page.last_edited_time,
        });
      }

      cursor = queryData.next_cursor;
    } while (cursor);

    console.log(`Fetched ${allNotionTasks.length} tasks from Notion`);

    // Get existing tasks from Supabase for this user
    const existingTasks = await sql`
      SELECT id, notion_task_id, notion_last_edited_time, deleted_at
      FROM tasks
      WHERE user_id = ${userId}
    `;

    interface TaskRow {
  notion_task_id: string;
  notion_last_edited_time: string | null;
  deleted_at: string | null;
}

    const existingByNotionId = new Map<string, TaskRow>(
      existingTasks.map((t: TaskRow) => [t.notion_task_id, t])
    );

    const currentNotionIds = new Set<string>(allNotionTasks.map(t => t.id));

    // Calculate sync changes
    const added: NotionTask[] = [];
    const updated: NotionTask[] = [];
    const deleted: string[] = [];

    // Find added and updated tasks
    for (const notionTask of allNotionTasks) {
      const existing = existingByNotionId.get(notionTask.id);

      if (!existing) {
        // New task
        added.push(notionTask);
      } else if (
        existing.notion_last_edited_time &&
        new Date(notionTask.lastEditedTime!) > new Date(existing.notion_last_edited_time)
      ) {
        // Task has been updated
        updated.push(notionTask);
      }
    }

    // Find deleted tasks (exist in DB but not in Notion anymore)
    for (const existing of existingTasks) {
      if (existing.notion_task_id && !currentNotionIds.has(existing.notion_task_id)) {
        deleted.push(existing.notion_task_id);
      }
    }

    // Save new and updated tasks to Supabase
    if (added.length > 0 || updated.length > 0) {
      const tasksToUpsert = [...added, ...updated].map(task => ({
        user_id: userId,
        text: task.text,
        completed: false,
        notion_task_id: task.id,
        notion_database_id: databaseId,
        notion_last_edited_time: task.lastEditedTime ? new Date(task.lastEditedTime) : null,
        deleted_at: null, // Clear deleted_at if task is back
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

    // Soft delete tasks that no longer exist in Notion
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
      databaseName,
      databaseId,
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