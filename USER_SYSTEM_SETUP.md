# 🎉 Lockscreen Todo - 用户系统实现完成

## ✅ 已完成的功能

### 1️⃣ Prisma 数据库设计
- ✅ User 模型添加订阅字段：
  - `subscriptionPlan`: FREE/PRO/BUSINESS
  - `subscriptionEndsAt`: 订阅结束时间
  - `lemonSqueezyCustomerId`: Lemon Squeezy 客户 ID
  - `lemonSqueezySubscriptionId`: Lemon Squeezy 订阅 ID

- ✅ Wallpaper 模型：保存生成的壁纸历史
- ✅ WallpaperUsage 模型：追踪每日生成次数（限额检查）

### 2️⃣ 后端 API（已创建）
- ✅ `/api/generate/check-limit` (GET): 检查用户限额
  - 免费：每天 5 次
  - PRO：无限
  - 返回：`{ canGenerate, limit, used, remaining, plan }`

- ✅ `/api/generate/record-usage` (POST): 记录生成次数
  - 免费：每次生成 +1
  - PRO：不记录（无限）

- ✅ `/api/wallpaper/save` (POST): 保存壁纸历史
- ✅ `/api/wallpaper/save` (GET): 获取壁纸历史
- ✅ `/api/wallpaper/delete` (DELETE): 删除壁纸

### 3️⃣ 前端组件（已创建）
- ✅ `AuthButton`: 登录/注册按钮（使用 Clerk）
- ✅ `UpgradeModal`: 升级到 Pro 弹窗
  - 月付：$1.99/月 或 ¥9.9/月
  - 年付：$19.99/年 或 ¥99/年
  - 买断：$29.99 或 ¥199

### 4️⃣ 生成器页面集成
- ✅ 右上角添加登录按钮
- ✅ 生成壁纸前检查限额
- ✅ 超限时弹窗提示升级
- ✅ 生成成功后记录使用次数

---

## 📝 部署步骤

### Step 1: 配置环境变量

确保 `.env.local` 文件包含以下变量：

```bash
# 数据库（必须）
POSTGRES_URL="postgresql://user:password@host:port/database"

# Clerk（已有，无需修改）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"

# Lemon Squeezy（下一步集成）
LEMONSQUEEZY_API_KEY="your-api-key"
LEMONSQUEEZY_STORE_ID="your-store-id"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"
```

### Step 2: 运行数据库迁移

```bash
# 方式 1：使用 bun（推荐）
bunx prisma migrate dev --name add_wallpaper_system --schema=./packages/db/prisma/schema.prisma

# 方式 2：使用 npm
npx prisma migrate dev --name add_wallpaper_system --schema=./packages/db/prisma/schema.prisma
```

**⚠️ 如果遇到问题：**
```bash
# 方案 A：先生成客户端（不迁移数据库）
bunx prisma generate --schema=./packages/db/prisma/schema.prisma

# 方案 B：使用 prisma db push（开发环境）
bunx prisma db push --schema=./packages/db/prisma/schema.prisma
```

### Step 3: 启动开发服务器

```bash
bun dev
```

访问：`http://localhost:3000/en/lockscreen-generator`

---

## 🧪 测试流程

### 测试 1：免费用户限额
1. **未登录状态**：
   - 点击"生成壁纸"→ 应该允许生成（或者跳过限额检查）
   - 生成 5 次后，第 6 次应该弹窗提示升级

2. **登录后（免费用户）**：
   - 点击右上角"Sign In"登录
   - 生成壁纸，每次 +1 计数
   - 第 6 次应该弹窗：显示"Upgrade to Pro"

### 测试 2：Pro 用户（手动设置）
1. 在数据库手动设置：
   ```sql
   UPDATE "User" SET "subscriptionPlan" = 'PRO' WHERE id = 'user-id';
   ```

2. 刷新页面，生成壁纸应该无限（不计数）

### 测试 3：壁纸历史（可选）
- 登录后生成壁纸
- 调用 `/api/wallpaper/save?limit=10` 获取历史
- 验证可以删除壁纸

---

## 🎯 下一步：集成 Lemon Squeezy 付费

### 待实现功能：
1. **创建 Lemon Squeezy 产品**
   - 登录 https://www.lemonsqueezy.com/
   - 创建 3 个产品：月付、年付、买断
   - 复制 Variant IDs

2. **创建 Webhook API**
   - `/api/webhooks/lemonsqueezy`
   - 处理 `subscription_created` 和 `subscription_updated` 事件
   - 更新 User 表的订阅状态

3. **前端集成付费按钮**
   - 在 `UpgradeModal` 组件集成 Lemon Squeezy Checkout
   - 使用 Lemon.js 打开支付窗口

4. **测试支付流程**
   - 沙盒测试（不扣款）
   - 验证 Webhook 同步订阅状态

---

## 🐛 常见问题

### Q1: Prisma 迁移失败 "Environment variable not found: POSTGRES_URL"
**A:** 检查 `.env.local` 是否有 `POSTGRES_URL`，且格式正确。

### Q2: 登录按钮不显示
**A:** 确保 Clerk 环境变量正确配置，且运行了 `bun dev`。

### Q3: 生成壁纸时不检查限额
**A:** 检查浏览器控制台是否有 API 请求错误（Network 标签页）。

### Q4: 升级弹窗不显示
**A:**
- 检查是否登录
- 检查 `/api/generate/check-limit` 返回 `canGenerate: false`
- 打开浏览器控制台查看错误

---

## 📊 数据库表结构

### User 表新增字段：
```sql
ALTER TABLE "User" ADD COLUMN "subscriptionPlan" TEXT DEFAULT 'FREE';
ALTER TABLE "User" ADD COLUMN "subscriptionEndsAt" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "lemonSqueezyCustomerId" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "lemonSqueezySubscriptionId" TEXT UNIQUE;
```

### Wallpaper 表：
```sql
CREATE TABLE "Wallpaper" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "imageData" TEXT NOT NULL,
  "device" TEXT NOT NULL,
  "style" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
```

### WallpaperUsage 表：
```sql
CREATE TABLE "WallpaperUsage" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP DEFAULT NOW(),
  "count" INTEGER DEFAULT 1,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE ("userId", "date"),
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
```

---

## ✨ 完成后效果

- ✅ 未登录用户可以生成壁纸，但不会保存历史
- ✅ 登录后免费用户每天限 5 次
- ✅ Pro 用户无限生成
- ✅ 超限时弹窗升级，引导付费
- ✅ 支付后自动解锁 Pro 功能

**下一步：集成 Lemon Squeezy 实现真实付款流程！**
