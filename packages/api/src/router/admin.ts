import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import { db } from "@saasfly/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  // 获取所有用户列表（带分页和搜索）
  getUsers: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      noStore();
      const { page, limit, search } = input;
      const offset = (page - 1) * limit;

      // 构建查询
      let query = db
        .selectFrom("User")
        .select([
          "id",
          "name",
          "email",
          "image",
          "emailVerified",
          "createdAt",
          "updatedAt",
        ])
        .orderBy("createdAt", "desc");

      // 如果有搜索条件
      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("name", "like", searchTerm),
            eb("email", "like", searchTerm),
          ]),
        );
      }

      // 获取总数
      const countQuery = db
        .selectFrom("User")
        .select((eb) => [eb.fn.count("id").as("count")]);

      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        countQuery.where((eb) =>
          eb.or([
            eb("name", "like", searchTerm),
            eb("email", "like", searchTerm),
          ]),
        );
      }

      const [users, countResult] = await Promise.all([
        query.limit(limit).offset(offset).execute(),
        countQuery.executeTakeFirst(),
      ]);

      const total = Number(countResult?.count) || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }),

  // 获取用户详情
  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      noStore();
      const user = await db
        .selectFrom("User")
        .selectAll()
        .where("id", "=", input.userId)
        .executeTakeFirst();

      return user;
    }),

  // 获取统计信息
  getStats: protectedProcedure.query(async () => {
    noStore();
      const [totalUsers, verifiedUsers, todayUsers] = await Promise.all([
        db
          .selectFrom("User")
          .select((eb) => [eb.fn.count("id").as("count")])
          .executeTakeFirst(),
        db
          .selectFrom("User")
          .select((eb) => [eb.fn.count("id").as("count")])
          .where("emailVerified", "is not", null)
          .executeTakeFirst(),
        db
          .selectFrom("User")
          .select((eb) => [eb.fn.count("id").as("count")])
          .where("createdAt", ">=", new Date(new Date().setHours(0, 0, 0, 0)))
          .executeTakeFirst(),
      ]);

      return {
        totalUsers: Number(totalUsers?.count) || 0,
        verifiedUsers: Number(verifiedUsers?.count) || 0,
        todayUsers: Number(todayUsers?.count) || 0,
      };
  }),
});
