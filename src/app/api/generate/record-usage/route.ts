import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "~/lib/neon/server";

export const dynamic = 'force-dynamic';

let sql: ReturnType<typeof createNeonClient> | null = null;
function getSql() {
  if (!sql) sql = createNeonClient();
  return sql;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error('record-usage: No userId found');
      return NextResponse.json(
        {
          error: "请先登录",
          success: false,
        },
        { status: 401 }
      );
    }

    console.log(`API: 记录用户 ${userId} 的壁纸生成`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    const existingRecords = await getSql()`
      SELECT * FROM "WallpaperUsage"
      WHERE "userId" = ${userId}
      AND "date" = ${todayString}
    `;

    const existingUsage = existingRecords[0];

    console.log(`今日使用记录:`, existingUsage ? `已存在，count=${existingUsage.count}` : '不存在');

    if (existingUsage) {
      const newCount = existingUsage.count + 1;
      console.log(`更新使用记录: ${existingUsage.count} → ${newCount}`);

      await getSql()`
        UPDATE "WallpaperUsage"
        SET "count" = ${newCount}
        WHERE id = ${existingUsage.id}
      `;

      console.log(`更新成功，今日已生成 ${newCount} 次`);
    } else {
      console.log(`创建新使用记录: userId=${userId}, date=${todayString}, count=1`);

      await getSql()`
        INSERT INTO "WallpaperUsage" ("userId", "date", "count")
        VALUES (${userId}, ${todayString}, 1)
      `;

      console.log(`创建成功，今日首次生成`);
    }

    return NextResponse.json({
      success: true,
      message: "记录成功",
    });

  } catch (error: any) {
    console.error("记录使用次数错误:", error);
    return NextResponse.json(
      {
        error: "记录使用次数失败",
        success: false,
        details: error.message,
      },
      { status: 500 }
    );
  }
}