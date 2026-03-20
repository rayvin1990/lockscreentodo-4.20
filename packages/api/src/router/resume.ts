import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { aiService } from "@saasfly/ai";
import type { Kysely, DB } from "@saasfly/db";

// Helper function to save parsed resume data
async function saveParsedResume(
  db: Kysely<DB>,
  userId: string,
  parsed: any
) {
  const resume = await db
    .insertInto("MasterResume")
    .values({
      userId: userId,
      name: `${parsed.name || "我的"}的简历`,
    })
    .returningAll()
    .executeTakeFirst();

  if (!resume) {
    throw new Error("Failed to create resume");
  }

  // Create work experiences
  if (parsed.workExps && parsed.workExps.length > 0) {
    await db
      .insertInto("WorkExperience")
      .values(
        parsed.workExps.map((exp: any) => ({
          masterResumeId: resume.id,
          company: exp.company,
          position: exp.position,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          current: exp.current || false,
          description: exp.description,
        }))
      )
      .execute();
  }

  // Create projects
  if (parsed.projects && parsed.projects.length > 0) {
    await db
      .insertInto("Project")
      .values(
        parsed.projects.map((proj: any) => ({
          masterResumeId: resume.id,
          name: proj.name,
          role: proj.role,
          startDate: new Date(proj.startDate),
          endDate: proj.endDate ? new Date(proj.endDate) : null,
          description: proj.description,
        }))
      )
      .execute();
  }

  // Create education
  if (parsed.education && parsed.education.length > 0) {
    await db
      .insertInto("Education")
      .values(
        parsed.education.map((edu: any) => ({
          masterResumeId: resume.id,
          school: edu.school,
          degree: edu.degree,
          major: edu.major,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          gpa: edu.gpa,
          description: edu.description,
        }))
      )
      .execute();
  }

  // Create skills
  if (parsed.skills && parsed.skills.length > 0) {
    await db
      .insertInto("Skill")
      .values(
        parsed.skills.map((skill: any) => ({
          masterResumeId: resume.id,
          name: skill.name,
          level: skill.level,
          category: skill.category,
        }))
      )
      .execute();
  }

  return resume;
}

export const resumeRouter = createTRPCRouter({
  // 获取用户的母简历
  getMasterResume: protectedProcedure.query(async ({ ctx }) => {
    const resume = await ctx.db
      .selectFrom("MasterResume")
      .selectAll()
      .where("userId", "=", ctx.userId)
      .executeTakeFirst();

    if (!resume) {
      return null;
    }

    // Fetch related data manually
    const workExps = await ctx.db
      .selectFrom("WorkExperience")
      .selectAll()
      .where("masterResumeId", "=", resume.id)
      .orderBy("startDate", "desc")
      .execute();

    const projects = await ctx.db
      .selectFrom("Project")
      .selectAll()
      .where("masterResumeId", "=", resume.id)
      .orderBy("startDate", "desc")
      .execute();

    const education = await ctx.db
      .selectFrom("Education")
      .selectAll()
      .where("masterResumeId", "=", resume.id)
      .orderBy("startDate", "desc")
      .execute();

    const skills = await ctx.db
      .selectFrom("Skill")
      .selectAll()
      .where("masterResumeId", "=", resume.id)
      .orderBy("name", "asc")
      .execute();

    return {
      ...resume,
      workExps,
      projects,
      education,
      skills,
    };
  }),

  // 创建或获取默认母简历
  getOrCreateMasterResume: protectedProcedure.mutation(async ({ ctx }) => {
    let resume = await ctx.db
      .selectFrom("MasterResume")
      .selectAll()
      .where("userId", "=", ctx.userId)
      .executeTakeFirst();

    if (!resume) {
      resume = await ctx.db
        .insertInto("MasterResume")
        .values({
          userId: ctx.userId,
          name: "我的母简历",
        })
        .returningAll()
        .executeTakeFirst();
    }

    return resume;
  }),

  // 更新母简历信息
  updateMasterResume: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      if (input.name) {
        updateData.name = input.name;
      }

      return await ctx.db
        .updateTable("MasterResume")
        .set(updateData)
        .where("id", "=", input.id)
        .returningAll()
        .executeTakeFirst();
    }),

  // AI 解析上传的简历
  parseResume: protectedProcedure
    .input(
      z.object({
        file: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("🔍 [parseResume] Mutation called!");
      console.log("📥 [parseResume] Received input:", input);
      console.log("📥 [parseResume] Input type:", typeof input);
      console.log("📥 [parseResume] Input keys:", input ? Object.keys(input) : "input is undefined/null");

      try {
        // Convert base64 back to File
        const base64Data = input.file;
        const byteString = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: input.fileType });
        const file = new File([blob], input.fileName, { type: input.fileType });

        console.log(`Received file: name="${input.fileName}", type="${input.fileType}", size=${file.size}`);

        // Check if FastAPI resume parser should be used (for images or if explicitly enabled)
        const fastApiUrl = process.env.RESUME_PARSER_URL;
        const isImage = input.fileType.startsWith("image/");

        if (fastApiUrl && isImage) {
          console.log(`[FastAPI Resume Parser] Image detected, using FastAPI service at ${fastApiUrl}`);

          try {
            // Upload to FastAPI service
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', ctx.userId);

            const uploadResponse = await fetch(`${fastApiUrl}/api/upload`, {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              const errorText = await uploadResponse.text();
              throw new Error(`FastAPI upload failed: ${errorText}`);
            }

            const { task_id } = await uploadResponse.json();
            console.log(`[FastAPI Resume Parser] Task created: ${task_id}`);

            // Poll for task completion
            let attempts = 0;
            const maxAttempts = 60; // 5 minutes max

            while (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

              const taskResponse = await fetch(`${fastApiUrl}/api/tasks/${task_id}`);
              if (!taskResponse.ok) {
                throw new Error('Failed to check task status');
              }

              const task = await taskResponse.json();
              console.log(`[FastAPI Resume Parser] Task status: ${task.status}, progress: ${task.progress * 100}%`);

              if (task.status === 'completed') {
                // Convert FastAPI format to our format
                const parsed = {
                  name: task.result?.personal_info?.fullName || '',
                  email: task.result?.personal_info?.email || '',
                  phone: task.result?.personal_info?.phone || '',
                  workExps: (task.result?.work_experience || []).map((exp: any) => ({
                    company: exp.company || '',
                    position: exp.position || '',
                    startDate: exp.startDate || '',
                    endDate: exp.endDate || null,
                    current: !exp.endDate,
                    description: exp.description || '',
                  })),
                  projects: (task.result?.projects || []).map((proj: any) => ({
                    name: proj.name || '',
                    role: '',
                    startDate: proj.startDate || '',
                    endDate: proj.endDate || null,
                    description: proj.description || '',
                  })),
                  education: (task.result?.education || []).map((edu: any) => ({
                    school: edu.school || '',
                    degree: edu.degree || '',
                    major: edu.major || '',
                    startDate: edu.startDate || '',
                    endDate: edu.endDate || '',
                    gpa: edu.gpa?.toString() || '',
                  })),
                  skills: (task.result?.skills || []).map((skill: any) => ({
                    name: skill.name || '',
                    level: skill.proficiency?.toLowerCase() || 'intermediate',
                    category: skill.category || '',
                  })),
                };

                return await saveParsedResume(ctx.db, ctx.userId, parsed);
              } else if (task.status === 'failed') {
                throw new Error(task.message || 'Resume parsing failed');
              }

              attempts++;
            }

            throw new Error('Resume parsing timeout');
          } catch (error: any) {
            console.error('[FastAPI Resume Parser] Failed, falling back to GLM API:', error.message);
            // Fallback to GLM API
            const parsed = await aiService.parseResume(file);
            return await saveParsedResume(ctx.db, ctx.userId, parsed);
          }
        }

        // For non-images or if FastAPI is not configured, use GLM API
        console.log('[GLM API] Using GLM AI service');
        const parsed = await aiService.parseResume(file);
        return await saveParsedResume(ctx.db, ctx.userId, parsed);
      } catch (error: any) {
        console.error("====================================");
        console.error("[Resume Parser] ❌ FULL ERROR DETAILS:");
        console.error("Message:", error?.message);
        console.error("Name:", error?.name);
        console.error("Stack:", error?.stack);
        console.error("Cause:", error?.cause);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        console.error("====================================");

        // Return a more helpful error message
        if (error?.message?.includes('timeout') || error?.message?.includes('超时')) {
          throw new Error("简历解析超时,请稍后重试或尝试上传较小的文件");
        } else if (error?.message?.includes('password') || error?.message?.includes('密码')) {
          throw new Error("文件受密码保护,请移除密码后重试");
        } else if (error?.message?.includes('Unsupported file') || error?.message?.includes('不支持的文件格式')) {
          throw new Error(error.message);
        } else if (error?.message?.includes('PDF parsing error')) {
          throw new Error("PDF 解析失败: " + error.message);
        } else if (error?.message?.includes('1113') || error?.message?.includes('余额不足')) {
          throw new Error("GLM API 余额不足，请访问 https://open.bigmodel.cn/ 充值");
        } else if (error?.message?.includes('GLM API') || error?.message?.includes('API')) {
          throw new Error(`AI 服务暂时不可用: ${error?.message || '未知错误'}`);
        } else {
          // Generic error with more details for debugging
          console.error("[Resume Parser] Unexpected error:", error);
          throw new Error(`简历解析失败: ${error?.message || '未知错误'}。请重试或联系技术支持`);
        }
      }
    }),

  // 创建工作经历
  createWorkExp: protectedProcedure
    .input(
      z.object({
        masterResumeId: z.string(),
        company: z.string(),
        position: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        current: z.boolean().default(false),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insertInto("WorkExperience")
        .values({
          masterResumeId: input.masterResumeId,
          company: input.company,
          position: input.position,
          startDate: input.startDate,
          endDate: input.endDate,
          current: input.current,
          description: input.description,
        })
        .returningAll()
        .executeTakeFirst();
    }),

  // 更新工作经历
  updateWorkExp: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          company: z.string().optional(),
          position: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().nullable().optional(),
          current: z.boolean().optional(),
          description: z.string().optional(),
          achievements: z.any().optional(),
          aiAnnotations: z.any().optional(),
          interviewData: z.any().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      const allowedFields = [
        "company",
        "position",
        "startDate",
        "endDate",
        "current",
        "description",
        "achievements",
        "aiAnnotations",
        "interviewData",
      ];

      for (const field of allowedFields) {
        if (field in input.updates) {
          updateData[field] = (input.updates as any)[field];
        }
      }

      return await ctx.db
        .updateTable("WorkExperience")
        .set(updateData)
        .where("id", "=", input.id)
        .returningAll()
        .executeTakeFirst();
    }),

  // 删除工作经历
  deleteWorkExp: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .deleteFrom("WorkExperience")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  // 创建项目经历
  createProject: protectedProcedure
    .input(
      z.object({
        masterResumeId: z.string(),
        name: z.string(),
        role: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insertInto("Project")
        .values({
          masterResumeId: input.masterResumeId,
          name: input.name,
          role: input.role,
          startDate: input.startDate,
          endDate: input.endDate,
          description: input.description,
        })
        .returningAll()
        .executeTakeFirst();
    }),

  // 更新项目经历
  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          name: z.string().optional(),
          role: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().nullable().optional(),
          description: z.string().optional(),
          achievements: z.any().optional(),
          aiAnnotations: z.any().optional(),
          interviewData: z.any().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      const allowedFields = [
        "name",
        "role",
        "startDate",
        "endDate",
        "description",
        "achievements",
        "aiAnnotations",
        "interviewData",
      ];

      for (const field of allowedFields) {
        if (field in input.updates) {
          updateData[field] = (input.updates as any)[field];
        }
      }

      return await ctx.db
        .updateTable("Project")
        .set(updateData)
        .where("id", "=", input.id)
        .returningAll()
        .executeTakeFirst();
    }),

  // 删除项目经历
  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .deleteFrom("Project")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  // 创建教育背景
  createEducation: protectedProcedure
    .input(
      z.object({
        masterResumeId: z.string(),
        school: z.string(),
        degree: z.string(),
        major: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        gpa: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insertInto("Education")
        .values({
          masterResumeId: input.masterResumeId,
          school: input.school,
          degree: input.degree,
          major: input.major,
          startDate: input.startDate,
          endDate: input.endDate,
          gpa: input.gpa,
          description: input.description,
        })
        .returningAll()
        .executeTakeFirst();
    }),

  // 更新教育背景
  updateEducation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          school: z.string().optional(),
          degree: z.string().optional(),
          major: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().nullable().optional(),
          gpa: z.string().optional(),
          description: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      const allowedFields = [
        "school",
        "degree",
        "major",
        "startDate",
        "endDate",
        "gpa",
        "description",
      ];

      for (const field of allowedFields) {
        if (field in input.updates) {
          updateData[field] = (input.updates as any)[field];
        }
      }

      return await ctx.db
        .updateTable("Education")
        .set(updateData)
        .where("id", "=", input.id)
        .returningAll()
        .executeTakeFirst();
    }),

  // 删除教育背景
  deleteEducation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .deleteFrom("Education")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  // 创建技能
  createSkill: protectedProcedure
    .input(
      z.object({
        masterResumeId: z.string(),
        name: z.string(),
        level: z.string().optional(),
        category: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insertInto("Skill")
        .values({
          masterResumeId: input.masterResumeId,
          name: input.name,
          level: input.level,
          category: input.category,
        })
        .returningAll()
        .executeTakeFirst();
    }),

  // 更新技能
  updateSkill: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          name: z.string().optional(),
          level: z.string().optional(),
          category: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      const allowedFields = ["name", "level", "category"];

      for (const field of allowedFields) {
        if (field in input.updates) {
          updateData[field] = (input.updates as any)[field];
        }
      }

      return await ctx.db
        .updateTable("Skill")
        .set(updateData)
        .where("id", "=", input.id)
        .returningAll()
        .executeTakeFirst();
    }),

  // 删除技能
  deleteSkill: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .deleteFrom("Skill")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  // STAR 2.0 - 开始访谈
  startInterview: protectedProcedure
    .input(
      z.object({
        type: z.enum(["workExp", "project"]),
        id: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const questions = await aiService.generateQuestions(input.description);

        const interviewData = {
          currentQuestion: questions[0] || null,
          allQuestions: questions,
          answers: [],
          completed: questions.length === 0,
        };

        const tableName = input.type === "workExp" ? "WorkExperience" : "Project";

        const record = await ctx.db
          .updateTable(tableName)
          .set({ interviewData })
          .where("id", "=", input.id)
          .returningAll()
          .executeTakeFirst();

        return record;
      } catch (error) {
        console.error("Interview start error:", error);
        throw new Error("启动访谈失败");
      }
    }),

  // STAR 2.0 - 回答问题
  answerInterview: protectedProcedure
    .input(
      z.object({
        type: z.enum(["workExp", "project"]),
        id: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const tableName = input.type === "workExp" ? "WorkExperience" : "Project";

        const record = await ctx.db
          .selectFrom(tableName)
          .select(["interviewData", "description"])
          .where("id", "=", input.id)
          .executeTakeFirst();

        if (!record) {
          throw new Error("记录不存在");
        }

        const interviewData = record.interviewData as any;
        const answers = [...(interviewData.answers || []), input.answer];

        let nextQuestion = null;
        let completed = false;

        if (interviewData.allQuestions.length > interviewData.answers.length) {
          nextQuestion =
            interviewData.allQuestions[interviewData.answers.length];
        } else {
          completed = true;
        }

        const updated = await ctx.db
          .updateTable(tableName)
          .set({
            interviewData: {
              ...interviewData,
              answers,
              currentQuestion: nextQuestion,
              completed,
            },
          })
          .where("id", "=", input.id)
          .returningAll()
          .executeTakeFirst();

        return updated;
      } catch (error) {
        console.error("Interview answer error:", error);
        throw new Error("回答失败");
      }
    }),

  // AI 优化内容（带批注）
  optimizeContent: protectedProcedure
    .input(
      z.object({
        type: z.enum(["workExp", "project"]),
        id: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const application = await ctx.db
          .selectFrom("JobApplication")
          .select("jdText")
          .where("userId", "=", ctx.userId)
          .orderBy("createdAt", "desc")
          .executeTakeFirst();

        const result = await aiService.optimizeContent(
          input.content,
          application?.jdText ?? undefined,
        );

        const tableName = input.type === "workExp" ? "WorkExperience" : "Project";

        const updated = await ctx.db
          .updateTable(tableName)
          .set({
            description: result.optimized,
            aiAnnotations: result.annotations,
          })
          .where("id", "=", input.id)
          .returningAll()
          .executeTakeFirst();

        return updated;
      } catch (error) {
        console.error("Optimize error:", error);
        throw new Error("优化失败");
      }
    }),
});
