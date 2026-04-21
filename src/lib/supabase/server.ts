// Mock implementation when no database is configured
const createMockSql = () => {
  const mockSql = async () => {
    console.warn("Database not configured - returning mock data");
    return [];
  };
  return mockSql as unknown as ReturnType<typeof import("@neondatabase/serverless").neon>;
};

let _sql: ReturnType<typeof createMockSql> | null = null;

export function getSql() {
  const url = process.env.NEXT_PUBLIC_NEON_DATABASE_URL
    || process.env.DATABASE_URL
    || process.env.POSTGRES_URL;

  if (!url) {
    if (!_sql) {
      console.warn("[Supabase] No database URL configured - using mock");
      _sql = createMockSql();
    }
    return _sql;
  }

  // Dynamically import neon only when needed
  const { neon } = require("@neondatabase/serverless");
  return neon(url);
}

export { neon } from "@neondatabase/serverless";
export const sql = new Proxy({} as ReturnType<typeof getSql>, {
  apply: (_: unknown, thisArg: unknown, args: [string, unknown[]]) => getSql()(args[0], args[1]),
  get: (_, prop) => getSql()[prop as keyof ReturnType<typeof getSql>],
});

export function createServerSupabaseClient() {
  return getSql();
}
