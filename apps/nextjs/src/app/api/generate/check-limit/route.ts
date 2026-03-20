import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "@/lib/neon/server";
import { isAfter, startOfDay } from "date-fns";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Initialize Neon client
const sql = createNeonClient();

/**
 * 生成壁纸前检查限额
 *
 * Returns:
 * - 401: Not authenticated (未登录)
 * - 200: Can generate (可以生成)
 *   - isPro: boolean
 *   - canGenerate: boolean
 *   - reason: string (原因说明)
 *   - daysRemaining: number (剩余试用天数)
 */
export async function GET() {
  try {
    // 1. 检查登录状态
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "请先登录",
          canGenerate: false,
          reason: "NOT_AUTHENTICATED",
        },
        { status: 401 }
      );
    }

    console.log(`API: 检查用户 ${userId} 的生成限额`);

    // 2. 使用 Neon 获取用户资料
    const users = await sql`
      SELECT * FROM "User" WHERE id = ${userId}
    `;
    let user = users[0] || null;

    // 3. 如果用户不存在，自动创建（7天试用）
    if (!user) {
      console.log(`⚠️  用户 ${userId} 不存在，自动激活7天试用`);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      const newUsers = await sql`
        INSERT INTO "User" (id, "isPro", "trialEndsAt", "subscriptionPlan")
        VALUES (${userId}, true, ${trialEndsAt.toISOString()}, 'PRO')
        RETURNING *
      `;
      
      user = newUsers[0];
      console.log(`✅ 用户 ${userId} 已创建，7天试用激活，到期时间: ${trialEndsAt.toLocaleDateString()}`);
    }

    // 4. 检查试用状态
    const now = new Date();
    const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const isTrialActive = trialEndsAt && isAfter(trialEndsAt, now);
    const daysRemaining = trialEndsAt
      ? Math.floor((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    console.log('用户资料:', {
      isPro: user?.isPro,
      trialEndsAt: trialEndsAt?.toDateString(),
      isTrialActive,
      daysRemaining,
    });

    // 5. 如果是 Pro 且试用期未结束 → 无限生成
    if (user?.isPro && isTrialActive) {
      console.log(`✅ 用户 ${userId} Pro 试用期内，无限生成 (剩余 ${daysRemaining} 天)`);
      return NextResponse.json({
        canGenerate: true,
        isPro: true,
        trialEndsAt: trialEndsAt?.toISOString(),
        daysRemaining,
        message: `✓ 无限生成 - 剩余 ${daysRemaining} 天`,
      });
    }

    // 6. 试用期已结束 → 检查今日生成次数
    console.log(`⚠️  试用期已结束，检查今日生成次数`);

    const today = startOfDay(now);
    const todayString = today.toISOString().split('T')[0];

    const todayUsages = await sql`
      SELECT * FROM "WallpaperUsage"
      WHERE "userId" = ${userId}
      AND "date" = ${todayString}
    `;

    const todayUsage = todayUsages[0];
    const todayCount = todayUsage?.count || 0;
    console.log(`今日已生成: ${todayCount} 次`);

    if (todayCount >= 1) {
      console.log(`❌ 用户 ${userId} 今日生成次数已达上限 (${todayCount}/1)`);
      return NextResponse.json(
        {
          error: "您的 7 天免费试用已结束，请升级 Pro 继续使用",
          canGenerate: false,
          reason: "TRIAL_EXPIRED",
          todayCount,
          daysSinceExpired: Math.abs(daysRemaining),
        },
        { status: 403 }
      );
    }

    // 7. 通过检查
    console.log(`✅ 用户 ${userId} 可以生成壁纸`);
    return NextResponse.json({
      canGenerate: true,
      isPro: user?.isPro,
      trialEndsAt: trialEndsAt?.toISOString(),
      daysRemaining,
      todayCount,
      message: user?.isPro
        ? `✓ Pro 用户 - 无限生成`
        : `✓ 试用期内 - 剩余 ${daysRemaining} 天`,
    });

  } catch (error: any) {
    console.error("检查限额错误:", error);
    return NextResponse.json(
      {
        error: "检查生成限额失败，请稍后再试",
        canGenerate: false,
        reason: "INTERNAL_ERROR",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
