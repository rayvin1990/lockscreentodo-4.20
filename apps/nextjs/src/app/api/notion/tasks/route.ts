import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "@/lib/neon/server";

export const dynamic = 'force-dynamic';

// Initialize Neon client
const sql = createNeonClient();

interface NotionTask {
  id: string;
  text: string;
  dueDate?: string;
}

// Notion API types
interface NotionPage {
  id: string;
  properties: Record<string, any>;
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
}

export async function GET(req: NextRequest) {
  try {
    // Get current authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 检查 Neon 环境变量
    if (!process.env.NEXT_PUBLIC_NEON_DATABASE_URL) {
      console.error('❌ Neon 环境变量未配置');
      return NextResponse.json(
        { error: "Server configuration error: Neon not configured" },
        { status: 500 }
      );
    }

    // 使用 Neon 获取用户的 Notion token
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

    // Search for To-do databases in user's Notion workspace
    const searchResponse = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.notionAccessToken}`,
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

      let errorMessage = "Failed to search Notion databases";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText.substring(0, 200);
      }

      return NextResponse.json(
        { error: "Notion API error", message: errorMessage },
        { status: searchResponse.status }
      );
    }

    const searchData: NotionSearchResponse = await searchResponse.json();

    // Filter databases that look like task databases
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
        {
          error: "No task databases found",
          message: "Please create a database in Notion with 'task' or 'todo' in the name",
        },
        { status: 404 }
      );
    }

    // Use the first matching database
    const databaseId = taskDatabases[0].id.replace(/-/g, "");
    console.log("✅ Using database:", taskDatabases[0].title?.[0]?.plain_text || "Untitled");

    // Query the database for tasks
    const queryResponse = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.notionAccessToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({}),
      }
    );

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text();
      console.error("Notion query failed:", errorText);
      return NextResponse.json(
        { error: "Failed to query tasks from database" },
        { status: 500 }
      );
    }

    const queryData: NotionQueryResponse = await queryResponse.json();

    // Extract tasks from Notion pages
    const tasks: NotionTask[] = [];

    for (const page of queryData.results) {
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

      tasks.push({
        id: page.id,
        text: title,
        dueDate,
      });
    }

    console.log(`✅ Fetched ${tasks.length} tasks from Notion`);

    return NextResponse.json({
      success: true,
      tasks,
      databaseName: taskDatabases[0].title?.[0]?.plain_text || "Untitled",
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
