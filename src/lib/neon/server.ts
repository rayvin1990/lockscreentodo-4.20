import { neon, NeonQueryFunction } from "@neondatabase/serverless";

export { neon };

// 创建 Neon 客户端的辅助函数 - 带重试
export function createNeonClient(databaseUrl?: string) {
  // 优先使用传入的 URL，否则尝试环境变量
  const url = databaseUrl
    || process.env.NEXT_PUBLIC_NEON_DATABASE_URL
    || process.env.DATABASE_URL
    || process.env.POSTGRES_URL;

  console.log("[Neon] DATABASE_URL:", url ? url.substring(0, 30) + "..." : "NOT FOUND");

  if (!url) {
    throw new Error("Database URL is not configured. Set DATABASE_URL environment variable.");
  }

  const baseNeon = neon(url);

  // 包装成带重试的 sql 函数
  const sqlWithRetry: NeonQueryFunction = async (strings: TemplateStringsArray, ...params: any[]) => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await baseNeon(strings, ...params);
      } catch (error) {
        lastError = error as Error;
        console.error(`[Neon] Query attempt ${attempt}/${maxRetries} failed:`, (error as Error).message);

        if (attempt < maxRetries) {
          // 指数退避: 500ms, 1000ms
          const delay = 500 * Math.pow(2, attempt - 1);
          console.log(`[Neon] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  };

  return sqlWithRetry;
}

// 默认导出 - 用于兼容旧代码
export default createNeonClient;