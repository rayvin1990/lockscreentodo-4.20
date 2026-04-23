import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNeonClient } from "~/lib/neon/server";
import { isAfter } from "date-fns";

// Allow unauthenticated access for limit check
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

let sql: ReturnType<typeof createNeonClient> | null = null;
function getSql() {
  if (!sql) {
    console.log('[check-limit] Creating Neon client...');
    sql = createNeonClient();
  }
  return sql;
}

export async function GET() {
  try {
    // Get auth - allow unauthenticated for this endpoint
    const { userId } = await auth();

    console.log('[check-limit] Request received, userId:', userId);

    if (!userId) {
      console.log('[check-limit] No userId - returning guest response');
      // Return guest/unauthenticated response instead of 401
      // This allows the UI to show "Please sign in" without a redirect
      return NextResponse.json({
        canGenerate: false,
        isGuest: true,
        reason: "NOT_AUTHENTICATED",
        message: "请先登录",
        subscriptionPlan: null,
        trialEndsAt: null,
        daysRemaining: 0,
      }, { status: 200 });  // Use 200 so frontend can handle it
    }

    console.log(`[check-limit] Checking limit for user ${userId}`);

    const users = await getSql()`
      SELECT * FROM "User" WHERE id = ${userId}
    `;
    let user = users[0] || null;

    if (!user) {
      console.log(`用户 ${userId} 不存在，自动激活7天试用`);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      try {
        const newUsers = await getSql()`
          INSERT INTO "User" (id, "subscriptionPlan", "trialEndsAt")
          VALUES (${userId}, 'PRO', ${trialEndsAt.toISOString()})
          RETURNING *
        `;

        user = newUsers[0] ?? null;
        console.log(`用户 ${userId} 已创建，7天试用激活，到期时间: ${trialEndsAt.toLocaleDateString()}`);
      } catch (dbError) {
        console.log(`插入用户失败，重新查询...`, dbError);
        const retryUsers = await getSql()`
          SELECT * FROM "User" WHERE id = ${userId}
        `;
        user = retryUsers[0] ?? null;

        if (!user) {
          console.error(`无法创建或查询用户 ${userId}`);
          return NextResponse.json(
            { error: "User not found", canGenerate: false, reason: "USER_NOT_FOUND" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json({
        canGenerate: true,
        subscriptionPlan: 'PRO',
        trialEndsAt: trialEndsAt.toISOString(),
        daysRemaining: 7,
        message: `7天全功能试用 - 剩余 7 天`,
      });
    }

    const now = new Date();
    const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const subscriptionPlan = user?.subscriptionPlan || 'FREE';

    const daysRemaining = trialEndsAt
      ? Math.max(0, Math.floor((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const isTrialActive = trialEndsAt ? isAfter(trialEndsAt, now) : false;

    console.log('用户订阅状态:', {
      subscriptionPlan,
      trialEndsAt: trialEndsAt?.toDateString(),
      isTrialActive,
      daysRemaining,
    });

    // 试用已过期，统一触发充值界面
    if (trialEndsAt && !isTrialActive) {
      const daysSinceExpired = Math.floor((now.getTime() - trialEndsAt.getTime()) / (1000 * 60 * 60 * 24));
      console.log(`用户 ${userId} 试用已过期 ${daysSinceExpired} 天，显示充值界面`);
      return NextResponse.json(
        {
          canGenerate: false,
          reason: "TRIAL_EXPIRED",
          subscriptionPlan,
          trialEndsAt: trialEndsAt.toISOString(),
          daysRemaining: 0,
          daysSinceExpired,
          message: "您的 7 天免费试用已结束，请升级 Pro 继续使用",
        },
        { status: 403 }
      );
    }

    // 试用有效期内
    if (subscriptionPlan === 'PRO') {
      console.log(`用户 ${userId} 试用期 Pro，剩余 ${daysRemaining} 天`);
      return NextResponse.json({
        canGenerate: true,
        subscriptionPlan: 'PRO',
        trialEndsAt: trialEndsAt.toISOString(),
        daysRemaining,
        isTrialActive: true,
        message: `7天全功能试用 - 剩余 ${daysRemaining} 天`,
      });
    }

    console.log(`用户 ${userId} 是 ${subscriptionPlan} 用户，禁止生成`);

    const daysSinceExpired = trialEndsAt && !isTrialActive
      ? Math.floor((now.getTime() - trialEndsAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return NextResponse.json(
      {
        error: daysSinceExpired && daysSinceExpired <= 7
          ? "您的 7 天免费试用已结束，请升级 Pro 继续使用"
          : "请升级 Pro 继续使用",
        canGenerate: false,
        reason: daysSinceExpired && daysSinceExpired <= 7 ? "TRIAL_EXPIRED" : "FREE_USER",
        subscriptionPlan,
        trialEndsAt: trialEndsAt?.toISOString() || null,
        daysRemaining: 0,
        daysSinceExpired,
      },
      { status: 403 }
    );

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