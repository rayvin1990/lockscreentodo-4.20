import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { PrismaClient } from "@prisma/client";

import type { DB } from "./prisma/types";

export { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
export type { Kysely } from "kysely";

export * from "./prisma/types";
export * from "./prisma/enums";

// Lazy-load Prisma Client to avoid issues during Next.js build
// This ensures the client is only created when actually needed at runtime.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client");
    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
    }

    return prisma;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Prisma Client is unavailable. Run \`bun --cwd packages/db run db:generate\` before using database features. Original error: ${message}`,
    );
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient() as unknown as Record<PropertyKey, unknown>;
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Lazy-load Kysely instance to avoid build-time database connection issues
const globalForDb = globalThis as unknown as {
  db: Kysely<DB> | undefined;
};

export const db =
  globalForDb.db ??
  new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        max: 10,
      }),
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
