import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { aiService } from "@saasfly/ai";

export const jobMatchingRouter = createTRPCRouter({
  // 分析 JD 并创建投递记录
  analyzeJD: protectedProcedure
    .input(
      z.object({
        companyId: z.string().optional(),
        position: z.string().optional(),
        jdText: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Fetch master resume
        const resume = await ctx.db
          .selectFrom("MasterResume")
          .selectAll()
          .where("userId", "=", ctx.userId)
          .executeTakeFirst();

        if (!resume) {
          throw new Error("请先创建简历");
        }

        // Fetch related data manually
        const [workExps, projects, skills] = await Promise.all([
          ctx.db
            .selectFrom("WorkExperience")
            .selectAll()
            .where("masterResumeId", "=", resume.id)
            .execute(),
          ctx.db
            .selectFrom("Project")
            .selectAll()
            .where("masterResumeId", "=", resume.id)
            .execute(),
          ctx.db
            .selectFrom("Skill")
            .selectAll()
            .where("masterResumeId", "=", resume.id)
            .execute(),
        ]);

        const resumeWithRelations = {
          ...resume,
          workExps,
          projects,
          skills,
        };

        const analysis = await aiService.analyzeJDMatch(resumeWithRelations, input.jdText);

        const application = await ctx.db
          .insertInto("JobApplication")
          .values({
            userId: ctx.userId,
            companyId: input.companyId ?? null,
            position: input.position ?? null,
            jdText: input.jdText,
            jdKeywords: analysis.keywords,
            matchScore: analysis.matchScore,
            aiSuggestions: analysis.suggestions,
            resumeSnapshot: resumeWithRelations,
          })
          .returningAll()
          .executeTakeFirst();

        return application;
      } catch (error) {
        console.error("JD analysis error:", error);
        throw new Error("JD 分析失败");
      }
    }),

  // 生成定制简历
  generateOptimizedResume: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Fetch job application
        const application = await ctx.db
          .selectFrom("JobApplication")
          .selectAll()
          .where("id", "=", input.applicationId)
          .executeTakeFirst();

        if (!application) {
          throw new Error("投递记录不存在");
        }

        // Fetch user's master resumes
        const masterResumes = await ctx.db
          .selectFrom("MasterResume")
          .selectAll()
          .where("userId", "=", application.userId)
          .execute();

        if (!masterResumes || masterResumes.length === 0) {
          throw new Error("简历不存在");
        }

        const masterResume = masterResumes[0];

        if (!masterResume) {
          throw new Error("未找到母简历，请先创建");
        }

        // Fetch related data
        const [workExps, projects, education, skills] = await Promise.all([
          ctx.db
            .selectFrom("WorkExperience")
            .selectAll()
            .where("masterResumeId", "=", masterResume.id)
            .execute(),
          ctx.db
            .selectFrom("Project")
            .selectAll()
            .where("masterResumeId", "=", masterResume.id)
            .execute(),
          ctx.db
            .selectFrom("Education")
            .selectAll()
            .where("masterResumeId", "=", masterResume.id)
            .execute(),
          ctx.db
            .selectFrom("Skill")
            .selectAll()
            .where("masterResumeId", "=", masterResume.id)
            .execute(),
        ]);

        const masterResumeWithRelations = {
          ...masterResume,
          workExps,
          projects,
          education,
          skills,
        };

        const optimized = await aiService.optimizeContent(
          JSON.stringify(masterResumeWithRelations, null, 2),
          application.jdText ?? undefined,
        );

        const updated = await ctx.db
          .updateTable("JobApplication")
          .set({
            optimizedResume: optimized,
          })
          .where("id", "=", input.applicationId)
          .returningAll()
          .executeTakeFirst();

        return updated;
      } catch (error) {
        console.error("Resume generation error:", error);
        throw new Error("简历生成失败");
      }
    }),

  // 获取投递记录列表
  getJobApplications: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .selectFrom("JobApplication")
      .selectAll()
      .where("userId", "=", ctx.userId)
      .orderBy("createdAt", "desc")
      .execute();
  }),

  // 获取单个投递记录
  getJobApplication: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .selectFrom("JobApplication")
        .selectAll()
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  // 更新投递记录状态
  updateJobApplication: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string().optional(),
        position: z.string().optional(),
        companyId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, unknown> = {};
      if (input.status) updateData.status = input.status;
      if (input.position) updateData.position = input.position;
      if (input.companyId) updateData.companyId = input.companyId;

      return await ctx.db
        .updateTable("JobApplication")
        .set(updateData)
        .where("id", "=", input.id)
        .returningAll()
        .executeTakeFirst();
    }),

  // 删除投递记录
  deleteJobApplication: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .deleteFrom("JobApplication")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),
});
