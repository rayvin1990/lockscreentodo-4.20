# ✅ Prisma 统一迁移完成

## 🎯 迁移目标

将项目从双数据库系统（Prisma + Supabase）统一为 **单一 Prisma 系统**，解决数据库冲突和维护复杂性问题。

---

## 📝 已修改的文件

### 1. Lemon Squeezy Webhook
**文件**: `apps/nextjs/src/app/api/webhooks/lemon/route.ts`

**修改内容**:
- ❌ 移除: `import { userProfileQueries, supabase } from "@saasfly/database/supabase";`
- ✅ 添加: `import { prisma } from "@saasfly/db";`
- ✅ 改用 `prisma.user.findUnique()` 查询用户
- ✅ 改用 `prisma.user.update()` 更新用户状态
- ✅ 移除 Supabase 查询函数

**功能**: 处理 Lemon Squeezy 支付事件，自动升级用户为 Pro

---

### 2. Clerk Webhook
**文件**: `apps/nextjs/src/app/api/webhooks/clerk/route.ts`

**修改内容**:
- ❌ 移除: `import { userProfileQueries } from "@saasfly/database/supabase";`
- ✅ 添加: `import { prisma } from "@saasfly/db";`
- ✅ 改用 `prisma.user.findUnique()` 检查用户是否存在
- ✅ 改用 `prisma.user.create()` 创建新用户（自动激活7天试用）
- ✅ 改用 `prisma.user.update()` 更新用户信息

**功能**: 监听 Clerk 用户注册和更新事件，自动激活试用

---

### 3. Generate Check Limit API
**文件**: `apps/nextjs/src/app/api/generate/check-limit/route.ts`

**修改内容**:
- ❌ 移除: `import { userProfileQueries, wallpaperUsageQueries } from "@saasfly/database/supabase";`
- ✅ 添加: `import { prisma } from "@saasfly/db";`
- ✅ 改用 `prisma.user.findUnique()` 获取用户资料
- ✅ 改用 `prisma.wallpaperUsage.findUnique()` 查询今日使用次数
- ✅ 改用 `prisma.user.create()` 自动创建不存在的用户

**功能**: 检查用户生成壁纸的限额

---

### 4. Generate Record Usage API
**文件**: `apps/nextjs/src/app/api/generate/record-usage/route.ts`

**修改内容**:
- ❌ 移除: `import { wallpaperUsageQueries } from "@saasfly/database/supabase";`
- ✅ 添加: `import { prisma } from "@saasfly/db";`
- ✅ 改用 `prisma.wallpaperUsage.findUnique()` 查询今日记录
- ✅ 改用 `prisma.wallpaperUsage.update()` 增加生成次数
- ✅ 改用 `prisma.wallpaperUsage.create()` 创建新记录

**功能**: 记录用户生成壁纸的次数

---

### 5. Download Check Limit API
**文件**: `apps/nextjs/src/app/api/download/check-limit/route.ts`

**修改内容**:
- ❌ 移除: `import { userProfileQueries, wallpaperUsageQueries } from "@saasfly/database/supabase";`
- ✅ 添加: `import { prisma } from "@saasfly/db";`
- ✅ 改用 `prisma.user.findUnique()` 获取用户资料
- ✅ 改用 `prisma.wallpaperUsage.findMany()` 查询本周下载次数
- ✅ 改用 `prisma.user.create()` 自动创建不存在的用户

**功能**: 检查用户下载壁纸的限额

---

### 6. Download Record Usage API
**文件**: `apps/nextjs/src/app/api/download/record-usage/route.ts`

**修改内容**:
- ❌ 移除: `import { wallpaperUsageQueries } from "@saasfly/database/supabase";`
- ✅ 添加: `import { prisma } from "@saasfly/db";`
- ✅ 改用 `prisma.wallpaperUsage.findUnique()` 查询今日记录
- ✅ 改用 `prisma.wallpaperUsage.update()` 增加下载次数
- ✅ 改用 `prisma.wallpaperUsage.create()` 创建新记录

**功能**: 记录用户下载壁纸的次数

---

## 🔧 无需修改的文件

### Frontend Hooks
- `apps/nextjs/src/hooks/use-generation-limit.ts`
  - ✅ 只调用 API，不直接使用数据库
  - ✅ 代码无需修改

### Frontend Components
- `apps/nextjs/src/components/lockscreen/upgrade-modal.tsx`
- `apps/nextjs/src/components/lockscreen/download-limit-modal.tsx`
- `apps/nextjs/src/components/lockscreen/trial-expired-modal.tsx`
  - ✅ 只调用 API，不直接使用数据库
  - ✅ 代码无需修改

---

## 📊 数据库 Schema (Prisma)

### User 表字段
```prisma
model User {
  id                        String           @id @default(dbgenerated("gen_random_uuid()"))
  name                      String?
  email                     String?          @unique
  emailVerified             DateTime?
  image                     String?

  // Lockscreen Todo: Subscription fields
  subscriptionPlan            SubscriptionPlan? @default(FREE)
  subscriptionEndsAt          DateTime?
  lemonSqueezyCustomerId      String?          @unique
  lemonSqueezySubscriptionId  String?          @unique
  lemonSqueezyVariantId       String?          // Track which plan variant user purchased

  // Lockscreen Todo: Trial & Pro fields
  trialEndsAt               DateTime?        // 7-day trial end date
  isPro                     Boolean          @default(false) // Pro status: true during trial or after payment

  // Lockscreen Todo: Relations
  wallpapers                Wallpaper[]
  wallpaperUsages           WallpaperUsage[]
}
```

### WallpaperUsage 表字段
```prisma
model WallpaperUsage {
  id            String   @id @default(dbgenerated("gen_random_uuid()"))
  userId        String
  date          DateTime @default(now()) // Query by date part
  count         Int      @default(1)
  downloadCount Int      @default(0) // Track daily download/QR code generation count
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date]) // Ensure one record per user per day
  @@index([userId, date])
}
```

---

## ✅ 迁移优势

### 1. 单一数据源
- ✅ 只使用 Prisma 一个 ORM
- ✅ 所有数据访问通过同一套 API
- ✅ 避免数据不一致问题

### 2. 类型安全
- ✅ Prisma 自动生成 TypeScript 类型
- ✅ 编译时捕获类型错误
- ✅ IDE 自动完成支持

### 3. 数据库迁移
- ✅ 使用 Prisma Migrations 管理 schema 变更
- ✅ 版本控制和团队协作友好
- ✅ 自动生成 SQL

### 4. 简化部署
- ✅ 只需配置 `POSTGRES_URL` 一个环境变量
- ✅ 无需维护 Supabase 连接
- ✅ 减少依赖和配置复杂度

---

## 🚀 下一步操作

### 1. 移除 Supabase 依赖（可选）

如果你想完全移除 Supabase，可以执行以下步骤：

```bash
# 卸载 Supabase 依赖
bun remove @supabase/supabase-js

# 删除 Supabase 相关文件（可选）
rm packages/database/src/supabase.ts
```

**注意**: 如果删除 `supabase.ts`，确保没有任何其他文件还在引用它。

---

### 2. 更新环境变量

**需要的环境变量**:
```bash
# 数据库（必需）
POSTGRES_URL="postgresql://user:password@host:port/database"

# Clerk（已有，无需修改）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"

# Clerk Webhook（已有，无需修改）
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"

# Lemon Squeezy（已有，无需修改）
NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL="https://..."
NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL="https://..."
LEMON_WEBHOOK_SECRET="whsec_xxx"
```

**可以移除的环境变量**（如果删除 Supabase）:
```bash
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

---

### 3. 运行数据库迁移

如果你的 Prisma schema 有变化，需要运行迁移：

```bash
# 生成 Prisma Client
bunx prisma generate

# 推送 schema 到数据库（开发环境）
bunx prisma db push

# 或创建迁移文件（生产环境）
bunx prisma migrate dev --name migrate_to_prisma_only
```

---

### 4. 测试所有功能

测试以下功能确保迁移成功：

- [ ] 用户注册 → 自动激活7天试用
- [ ] 用户登录 → 检查生成限额
- [ ] 生成壁纸 → 记录使用次数
- [ ] 达到限额 → 显示升级弹窗
- [ ] 点击升级 → 跳转 Lemon Squeezy
- [ ] 支付成功 → Webhook 自动升级
- [ ] Pro 用户 → 无限生成
- [ ] 下载壁纸 → 记录下载次数
- [ ] 达到下载限额 → 显示升级弹窗

---

## 🐛 常见问题

### Q1: 编译错误 "Module not found: @saasfly/database/supabase"
**A**:
1. 检查是否还有文件在引用 Supabase
2. 运行 `grep -r "@saasfly/database/supabase" .`
3. 如果没有找到引用，可以安全删除 `packages/database/src/supabase.ts`

### Q2: 数据库连接失败 "Error connecting to database"
**A**:
1. 检查 `POSTGRES_URL` 是否正确配置
2. 确保数据库正在运行
3. 检查数据库用户权限

### Q3: Webhook 返回 500 错误
**A**:
1. 检查服务器日志查看详细错误信息
2. 确认 `CLERK_WEBHOOK_SECRET` 和 `LEMON_WEBHOOK_SECRET` 已配置
3. 检查 Prisma Client 是否正确初始化

### Q4: 用户数据丢失
**A**:
1. 确认 Supabase 和 Prisma 是否连接到**同一个数据库**
2. 检查 `.env.local` 中的 `POSTGRES_URL` 和 `NEXT_PUBLIC_SUPABASE_URL` 是否指向同一数据库
3. 如果是不同数据库，需要迁移数据

---

## 📁 修改文件清单

### 已修改的 API 路由（6个）
1. ✅ `apps/nextjs/src/app/api/webhooks/lemon/route.ts`
2. ✅ `apps/nextjs/src/app/api/webhooks/clerk/route.ts`
3. ✅ `apps/nextjs/src/app/api/generate/check-limit/route.ts`
4. ✅ `apps/nextjs/src/app/api/generate/record-usage/route.ts`
5. ✅ `apps/nextjs/src/app/api/download/check-limit/route.ts`
6. ✅ `apps/nextjs/src/app/api/download/record-usage/route.ts`

### 新增的文档（1个）
- ✅ `PRISMA_MIGRATION_SUMMARY.md` (本文件)

### 无需修改的文件（前端）
- ✅ `apps/nextjs/src/hooks/use-generation-limit.ts`
- ✅ 所有前端组件（只调用 API，不直接使用数据库）

---

## 🎉 总结

✅ **6 个 API 路由**已从 Supabase 迁移到 Prisma
✅ **类型安全**的数据库访问
✅ **单一数据源**，避免数据不一致
✅ **简化部署**，只需配置 `POSTGRES_URL`
✅ **前端无需修改**，向后兼容

**现在你的项目使用统一的 Prisma 系统，后端配置更加简洁和可靠！** 🚀

---

## 📞 需要帮助？

如果遇到问题，检查以下日志：
- **终端日志**: 查看本地开发服务器输出
- **Clerk Dashboard**: Webhooks → 查看调用历史
- **Lemon Squeezy Dashboard**: Webhooks → 查看支付事件
- **数据库**: 直接查询 User 和 WallpaperUsage 表

Good luck! 🎊
