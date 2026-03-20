import { neon } from "@neondatabase/serverless";

export { neon };

// 创建 Neon 客户端的辅助函数
export function createNeonClient(databaseUrl?: string) {
  const url = databaseUrl || process.env.NEXT_PUBLIC_NEON_DATABASE_URL;
  if (!url) {
    throw new Error("Neon database URL is not configured. Set NEXT_PUBLIC_NEON_DATABASE_URL environment variable.");
  }
  return neon(url);
}

// 默认导出 - 用于兼容旧代码
export default createNeonClient;
