import { neon } from "@neondatabase/serverless";

export { neon };

// 创建 Neon 客户端 - 使用 Supabase 的数据库 URL
export function createNeonClient(databaseUrl?: string) {
  // 优先使用传入的 databaseUrl，否则尝试环境变量
  const url = databaseUrl
    || process.env.NEXT_PUBLIC_NEON_DATABASE_URL
    || process.env.DATABASE_URL
    || process.env.POSTGRES_URL;

  if (!url) {
    throw new Error("Database URL is not configured. Set DATABASE_URL or NEXT_PUBLIC_NEON_DATABASE_URL environment variable.");
  }
  return neon(url);
}

// 兼容旧代码
export const sql = createNeonClient();

export function createServerSupabaseClient() {
  return createNeonClient();
}