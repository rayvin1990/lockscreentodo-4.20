import { neon } from "@neondatabase/serverless";

export { neon };

// 创建 Neon 客户端的辅助函数
export function createNeonClient(databaseUrl?: string) {
  const url = databaseUrl || process.env.NEXT_PUBLIC_NEON_DATABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_NEON_DATABASE_URL is required");
  }
  return neon(url);
}

// 兼容旧代码的 Supabase 客户端创建函数
// 如果配置了 Neon 则使用 Neon，否则抛出错误
export function createServerSupabaseClient() {
  throw new Error("Please use createNeonClient() instead. Supabase is no longer supported.");
}

// 旧导出，保持代码兼容性
export const sql = createNeonClient();
