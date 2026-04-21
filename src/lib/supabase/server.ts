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

// 兼容旧代码 - 延迟初始化，避免构建时执行
let _sql: ReturnType<typeof createNeonClient> | null = null;
export function getSql() {
  if (!_sql) _sql = createNeonClient();
  return _sql;
}

// 旧代码兼容：直接使用 getSql 函数（既可调用 getSql() 也可直接作为模板标签 sql`...`）
export const sql = new Proxy({} as ReturnType<typeof createNeonClient>, {
  apply: (_: unknown, thisArg: unknown, args: [string, unknown[]]) => getSql()(args[0], args[1]),
  get: (_, prop) => getSql()[prop as keyof ReturnType<typeof createNeonClient>],
});

export function createServerSupabaseClient() {
  return createNeonClient();
}