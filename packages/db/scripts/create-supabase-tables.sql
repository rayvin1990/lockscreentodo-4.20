-- ============================================
-- Supabase 数据库建表脚本
-- 锁屏待办 & EchoCV 完整数据库结构
-- ============================================

-- 启用 UUID 扩展（如果还没启用）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. 枚举类型
-- ============================================

-- 订阅计划枚举
DO $$ BEGIN
    CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'BUSINESS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 状态枚举
DO $$ BEGIN
    CREATE TYPE "Status" AS ENUM ('PENDING', 'CREATING', 'INITING', 'RUNNING', 'STOPPED', 'DELETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. 核心用户表
-- ============================================

-- Customer 表（LemonSqueezy 集成）
CREATE TABLE IF NOT EXISTS "Customer" (
    id SERIAL PRIMARY KEY,
    "authUserId" TEXT NOT NULL,
    name TEXT,
    plan "SubscriptionPlan",
    "stripeCustomerId" TEXT UNIQUE,
    "stripeSubscriptionId" TEXT UNIQUE,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Account 表（OAuth 账户关联）
CREATE TABLE IF NOT EXISTS "Account" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    scope TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    UNIQUE("provider", "providerAccountId")
);

-- Session 表（用户会话）
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL
);

-- User 表（核心用户表 - 锁屏待办 + 订阅）
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,

    -- 隐私模式
    "privacyMode" BOOLEAN DEFAULT FALSE,

    -- Lockscreen Todo: 订阅字段
    "subscriptionPlan" "SubscriptionPlan" DEFAULT 'FREE',
    "subscriptionEndsAt" TIMESTAMPTZ,
    "lemonSqueezyCustomerId" TEXT UNIQUE,
    "lemonSqueezySubscriptionId" TEXT UNIQUE,
    "lemonSqueezyVariantId" TEXT,

    -- Lockscreen Todo: 试用 & Pro 字段
    "trialEndsAt" TIMESTAMPTZ,
    "isPro" BOOLEAN DEFAULT FALSE,

    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- VerificationToken 表（邮箱验证）
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    UNIQUE("identifier", "token")
);

-- K8sClusterConfig 表（K8s 集群配置）
CREATE TABLE IF NOT EXISTS "K8sClusterConfig" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    plan "SubscriptionPlan" DEFAULT 'FREE',
    network TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    status "Status" DEFAULT 'PENDING',
    delete BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 3. EchoCV: 简历相关表
-- ============================================

-- MasterResume 表（母简历）
CREATE TABLE IF NOT EXISTS "MasterResume" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    name TEXT DEFAULT '我的母简历',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- WorkExperience 表（工作经历）
CREATE TABLE IF NOT EXISTS "WorkExperience" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "masterResumeId" TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements JSONB,
    "aiAnnotations" JSONB,
    "interviewData" JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Project 表（项目经历）
CREATE TABLE IF NOT EXISTS "Project" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "masterResumeId" TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    description TEXT,
    achievements JSONB,
    "aiAnnotations" JSONB,
    "interviewData" JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Education 表（教育背景）
CREATE TABLE IF NOT EXISTS "Education" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "masterResumeId" TEXT NOT NULL,
    school TEXT NOT NULL,
    degree TEXT NOT NULL,
    major TEXT NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    gpa TEXT,
    description TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Skill 表（技能）
CREATE TABLE IF NOT EXISTS "Skill" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "masterResumeId" TEXT NOT NULL,
    name TEXT NOT NULL,
    level TEXT,
    category TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- JobApplication 表（求职申请）
CREATE TABLE IF NOT EXISTS "JobApplication" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    position TEXT,
    "jdText" TEXT,
    "jdKeywords" JSONB,
    "matchScore" DOUBLE PRECISION,
    "resumeSnapshot" JSONB,
    "optimizedResume" JSONB,
    "aiSuggestions" JSONB,
    status TEXT DEFAULT 'draft',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Lockscreen Todo: 壁纸相关表
-- ============================================

-- Wallpaper 表（保存生成的壁纸历史）
CREATE TABLE IF NOT EXISTS "Wallpaper" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "imageData" TEXT NOT NULL, -- Base64 或 URL
    device TEXT NOT NULL,       -- 手机型号/尺寸
    style TEXT NOT NULL,        -- 壁纸风格
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- WallpaperUsage 表（每日生成计数和限制）
CREATE TABLE IF NOT EXISTS "WallpaperUsage" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    count INTEGER DEFAULT 1,
    "downloadCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("userId", date)
);

-- ============================================
-- 5. 外键约束
-- ============================================

-- Account 外键
ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Session 外键
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MasterResume 外键
ALTER TABLE "MasterResume" DROP CONSTRAINT IF EXISTS "MasterResume_userId_fkey";
ALTER TABLE "MasterResume" ADD CONSTRAINT "MasterResume_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- WorkExperience 外键
ALTER TABLE "WorkExperience" DROP CONSTRAINT IF EXISTS "WorkExperience_masterResumeId_fkey";
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_masterResumeId_fkey"
    FOREIGN KEY ("masterResumeId") REFERENCES "MasterResume"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Project 外键
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_masterResumeId_fkey";
ALTER TABLE "Project" ADD CONSTRAINT "Project_masterResumeId_fkey"
    FOREIGN KEY ("masterResumeId") REFERENCES "MasterResume"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Education 外键
ALTER TABLE "Education" DROP CONSTRAINT IF EXISTS "Education_masterResumeId_fkey";
ALTER TABLE "Education" ADD CONSTRAINT "Education_masterResumeId_fkey"
    FOREIGN KEY ("masterResumeId") REFERENCES "MasterResume"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Skill 外键
ALTER TABLE "Skill" DROP CONSTRAINT IF EXISTS "Skill_masterResumeId_fkey";
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_masterResumeId_fkey"
    FOREIGN KEY ("masterResumeId") REFERENCES "MasterResume"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- JobApplication 外键
ALTER TABLE "JobApplication" DROP CONSTRAINT IF EXISTS "JobApplication_userId_fkey";
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Wallpaper 外键
ALTER TABLE "Wallpaper" DROP CONSTRAINT IF EXISTS "Wallpaper_userId_fkey";
ALTER TABLE "Wallpaper" ADD CONSTRAINT "Wallpaper_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- WallpaperUsage 外键
ALTER TABLE "WallpaperUsage" DROP CONSTRAINT IF EXISTS "WallpaperUsage_userId_fkey";
ALTER TABLE "WallpaperUsage" ADD CONSTRAINT "WallpaperUsage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- 6. 索引
-- ============================================

-- Customer 索引
CREATE INDEX IF NOT EXISTS "Customer_authUserId_idx" ON "Customer"("authUserId");

-- User 索引
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- K8sClusterConfig 索引
CREATE INDEX IF NOT EXISTS "K8sClusterConfig_authUserId_idx" ON "K8sClusterConfig"("authUserId");

-- MasterResume 索引
CREATE INDEX IF NOT EXISTS "MasterResume_userId_idx" ON "MasterResume"("userId");

-- WorkExperience 索引
CREATE INDEX IF NOT EXISTS "WorkExperience_masterResumeId_idx" ON "WorkExperience"("masterResumeId");

-- Project 索引
CREATE INDEX IF NOT EXISTS "Project_masterResumeId_idx" ON "Project"("masterResumeId");

-- Education 索引
CREATE INDEX IF NOT EXISTS "Education_masterResumeId_idx" ON "Education"("masterResumeId");

-- Skill 索引
CREATE INDEX IF NOT EXISTS "Skill_masterResumeId_idx" ON "Skill"("masterResumeId");

-- JobApplication 索引
CREATE INDEX IF NOT EXISTS "JobApplication_userId_idx" ON "JobApplication"("userId");

-- Wallpaper 索引
CREATE INDEX IF NOT EXISTS "Wallpaper_userId_idx" ON "Wallpaper"("userId");
CREATE INDEX IF NOT EXISTS "Wallpaper_createdAt_idx" ON "Wallpaper"("createdAt");

-- WallpaperUsage 索引
CREATE INDEX IF NOT EXISTS "WallpaperUsage_userId_date_idx" ON "WallpaperUsage"("userId", "date");

-- ============================================
-- 7. 触发器（自动更新 updatedAt）
-- ============================================

-- 创建通用的更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加触发器
CREATE TRIGGER update_Customer_updated_at BEFORE UPDATE ON "Customer"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_User_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_K8sClusterConfig_updated_at BEFORE UPDATE ON "K8sClusterConfig"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_MasterResume_updated_at BEFORE UPDATE ON "MasterResume"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_WorkExperience_updated_at BEFORE UPDATE ON "WorkExperience"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_Project_updated_at BEFORE UPDATE ON "Project"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_Education_updated_at BEFORE UPDATE ON "Education"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_Skill_updated_at BEFORE UPDATE ON "Skill"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_JobApplication_updated_at BEFORE UPDATE ON "JobApplication"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. Row Level Security (RLS) - 可选
-- ============================================

-- 启用 RLS（根据需要启用）
-- ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Wallpaper" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "WallpaperUsage" ENABLE ROW LEVEL SECURITY;

-- 创建策略（根据需要配置）
-- 示例：用户只能查看和修改自己的数据
-- CREATE POLICY "Users can view own data" ON "User"
--     FOR SELECT USING (auth.uid()::text = id);

-- ============================================
-- 完成！
-- ============================================

-- 验证表创建
SELECT
    'Tables created successfully!' as status,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- 显示所有已创建的表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
