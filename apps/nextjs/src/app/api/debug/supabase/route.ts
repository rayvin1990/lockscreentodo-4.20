import { NextResponse } from "next/server";
import { createNeonClient } from "@/lib/neon/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

/**
 * 调试 API - 检查 Neon 配置和连接状态
 * 访问: /api/debug/supabase (保持路径兼容)
 */
export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    database: 'neon',
    checks: {
      envVars: {
        NEXT_PUBLIC_NEON_DATABASE_URL: !!process.env.NEXT_PUBLIC_NEON_DATABASE_URL,
        urlPreview: process.env.NEXT_PUBLIC_NEON_DATABASE_URL 
          ? process.env.NEXT_PUBLIC_NEON_DATABASE_URL.substring(0, 40) + '...' 
          : 'NOT_SET',
      },
      auth: {
        isConfigured: false,
        userId: null,
      },
      neon: {
        connectionStatus: 'UNKNOWN',
        tables: {
          User: 'UNKNOWN',
          WallpaperUsage: 'UNKNOWN',
        },
        error: null,
      },
    },
  };

  // 1. 检查 Clerk 认证
  try {
    const { userId } = await auth();
    debugInfo.checks.auth.isConfigured = true;
    debugInfo.checks.auth.userId = userId;
  } catch (error) {
    debugInfo.checks.auth.error = error instanceof Error ? error.message : String(error);
  }

  // 2. 检查环境变量
  if (!process.env.NEXT_PUBLIC_NEON_DATABASE_URL) {
    debugInfo.checks.neon.connectionStatus = 'FAILED';
    debugInfo.checks.neon.error = '环境变量 NEXT_PUBLIC_NEON_DATABASE_URL 未配置';

    return NextResponse.json(debugInfo, { status: 500 });
  }

  // 3. 测试 Neon 连接
  try {
    const sql = createNeonClient();

    // 测试连接 - 查询 User 表
    try {
      const userResult = await sql`SELECT 1 as test FROM "User" LIMIT 1`;
      debugInfo.checks.neon.tables.User = 'EXISTS';
    } catch (userError: any) {
      debugInfo.checks.neon.tables.User = userError.code === '42P01' ? 'NOT_FOUND' : 'ERROR';
      debugInfo.checks.neon.error = {
        table: 'User',
        message: userError.message,
      };
    }

    // 测试连接 - 查询 WallpaperUsage 表
    try {
      const usageResult = await sql`SELECT 1 as test FROM "WallpaperUsage" LIMIT 1`;
      debugInfo.checks.neon.tables.WallpaperUsage = 'EXISTS';
    } catch (usageError: any) {
      debugInfo.checks.neon.tables.WallpaperUsage = usageError.code === '42P01' ? 'NOT_FOUND' : 'ERROR';
      if (!debugInfo.checks.neon.error) {
        debugInfo.checks.neon.error = {};
      }
      debugInfo.checks.neon.error.usageTable = {
        table: 'WallpaperUsage',
        message: usageError.message,
      };
    }

    // 总体状态
    if (debugInfo.checks.neon.tables.User === 'EXISTS' && debugInfo.checks.neon.tables.WallpaperUsage === 'EXISTS') {
      debugInfo.checks.neon.connectionStatus = 'OK';
    } else if (debugInfo.checks.neon.tables.User === 'NOT_FOUND' || debugInfo.checks.neon.tables.WallpaperUsage === 'NOT_FOUND') {
      debugInfo.checks.neon.connectionStatus = 'TABLES_MISSING';
    } else {
      debugInfo.checks.neon.connectionStatus = 'PARTIAL';
    }

  } catch (error: any) {
    debugInfo.checks.neon.connectionStatus = 'CONNECTION_FAILED';
    debugInfo.checks.neon.error = {
      message: error.message || String(error),
      name: error.name || 'Unknown',
    };
  }

  // 返回状态码
  const statusCode = debugInfo.checks.neon.connectionStatus === 'OK' ? 200 : 500;

  return NextResponse.json(debugInfo, { status: statusCode });
}
