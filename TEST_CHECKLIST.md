# ✅ 用户系统测试清单

## 🔧 Step 1: 环境检查（5 分钟）

### 1.1 检查环境变量
```bash
# 查看是否有 .env.local 文件
ls -la .env.local

# 如果没有，复制示例文件
cp .env.example .env.local
```

确保 `.env.local` 包含以下变量：

```bash
# 数据库（必须！）
POSTGRES_URL="postgresql://user:password@host:port/database"

# Clerk（应该已配置）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# 可选：用于调试
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 1.2 验证数据库连接
```bash
# 测试数据库连接（使用 Prisma）
cd packages/db
bunx prisma db pull --schema=./prisma/schema.prisma

# 如果成功，应该看到：
# ✔ Connected to database
# ✔ Fetched schema
```

---

## 🚀 Step 2: 运行数据库迁移（5 分钟）

### 方式 A：使用 Prisma DB Push（推荐，快速）
```bash
# 推送 schema 到数据库（自动创建表）
bunx prisma db push --schema=./packages/db/prisma/schema.prisma

# 成功标志：
# ✔ Database schema has been pushed
```

### 方式 B：使用 Migrate（如果需要版本控制）
```bash
# 创建迁移文件
bunx prisma migrate dev --name add_wallpaper_system --schema=./packages/db/prisma/schema.prisma

# 成功标志：
# ✔ The following migration has been created and applied
```

### 验证表已创建
```bash
# 进入 PostgreSQL 检查
psql $POSTGRES_URL

# 查看表
\dt

# 应该看到：
# - User (已存在，新增字段)
# - Wallpaper (新表)
# - WallpaperUsage (新表)
# - Account, Session, VerificationToken (已存在)

# 退出
\q
```

---

## 🎯 Step 3: 启动开发服务器（2 分钟）

```bash
# 回到项目根目录
cd ../..

# 启动开发服务器
bun dev
```

等待启动完成，应该看到：
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

---

## ✅ Step 4: 测试功能（15 分钟）

### Test 1: 未登录用户生成壁纸
1. **打开浏览器** → `http://localhost:3000/en/lockscreen-generator`

2. **检查右上角**：
   - ✅ 应该看到蓝色 "Sign In" 按钮
   - ✅ 点击应该打开 Clerk 登录弹窗

3. **生成壁纸测试**：
   - 输入任务：`• Test task 1`
   - 选择风格：`Minimal`
   - 点击 "生成壁纸"

4. **预期结果**：
   - ✅ 应该成功生成（Canvas 渲染）
   - ✅ 可以下载壁纸
   - ❌ **不会**保存到历史（未登录）

5. **检查浏览器控制台**（F12）：
   ```
   Network 标签：
   - ✅ GET /api/generate/check-limit → 401 Unauthorized (正常，未登录)
   - ✅ POST /api/share → 200 OK
   ```

---

### Test 2: 登录后免费用户限额测试

1. **登录操作**：
   - 点击右上角 "Sign In"
   - 选择登录方式（Google/邮箱密码）
   - 完成登录流程

2. **验证登录状态**：
   - ✅ 右上角显示用户头像/菜单（UserButton）
   - ✅ "Sign In" 按钮消失

3. **生成壁纸 5 次**（测试限额）：
   - 第 1 次：✅ 成功生成
   - 第 2 次：✅ 成功生成
   - 第 3 次：✅ 成功生成
   - 第 4 次：✅ 成功生成
   - 第 5 次：✅ 成功生成

4. **第 6 次尝试**：
   - 点击 "生成壁纸"
   - ❌ **应该弹出升级窗口**（UpgradeModal）

5. **检查升级弹窗内容**：
   - ✅ 标题："Upgrade to Pro" / "升级到 Pro 版"
   - ✅ 显示限额提示："You've reached your daily limit (5 times/day)"
   - ✅ 显示 3 个价格选项：
     - Monthly: $1.99/月
     - Yearly: $19.99/年 (Save 17%)
     - Lifetime: $29.99 买断

6. **检查浏览器控制台**：
   ```
   Network 标签：
   - ✅ GET /api/generate/check-limit → 200 OK
     Response: { canGenerate: false, limit: 5, used: 5, remaining: 0, plan: "FREE" }
   ```

---

### Test 3: Pro 用户无限生成测试

1. **手动设置 Pro 状态**（数据库）：
   ```sql
   -- 获取你的 User ID（从 Clerk 用户信息或浏览器控制台）
   -- 方式 1：查看 Clerk Dashboard → Users → 找到你的用户 → User ID

   -- 方式 2：登录后，在浏览器控制台运行：
   -- window.Clerk.user.id

   -- 更新数据库（假设你的 User ID 是 user_xxx）
   psql $POSTGRES_URL

   UPDATE "User"
   SET "subscriptionPlan" = 'PRO'
   WHERE id = 'user_xxx';

   -- 验证更新
   SELECT id, "subscriptionPlan", "subscriptionEndsAt"
   FROM "User"
   WHERE id = 'user_xxx';

   -- 退出
   \q
   ```

2. **刷新页面**（刷新登录状态）：
   - 按 F5 或 Ctrl+R 刷新浏览器
   - 或重新打开 `/en/lockscreen-generator`

3. **生成壁纸测试**（无限次）：
   - 第 6 次：✅ 应该成功生成（不再弹窗）
   - 第 7 次：✅ 成功生成
   - 第 8 次：✅ 成功生成

4. **检查浏览器控制台**：
   ```
   Network 标签：
   - ✅ GET /api/generate/check-limit → 200 OK
     Response: { canGenerate: true, limit: -1, used: 0, remaining: -1, plan: "PRO" }

   注意：limit: -1 表示无限
   ```

---

## 🔍 Step 5: 检查 API 响应（5 分钟）

### 5.1 测试 `/api/generate/check-limit`
```bash
# 未登录状态（替换 YOUR_COOKIE）
curl http://localhost:3000/api/generate/check-limit

# 预期响应：
# { "error": "UNAUTHORIZED", "message": "Please sign in to generate wallpapers", ... }

# 登录后（从浏览器 Network 标签复制 Cookie）
curl http://localhost:3000/api/generate/check-limit \
  -H "Cookie: __session=..." \
  -H "Content-Type: application/json"

# 预期响应（免费用户）：
# { "canGenerate": true, "limit": 5, "used": 2, "remaining": 3, "plan": "FREE" }

# 预期响应（Pro 用户）：
# { "canGenerate": true, "limit": -1, "used": 0, "remaining": -1, "plan": "PRO" }
```

### 5.2 测试 `/api/generate/record-usage`
```bash
# 登录后记录使用次数
curl -X POST http://localhost:3000/api/generate/record-usage \
  -H "Cookie: __session=..." \
  -H "Content-Type: application/json"

# 预期响应（免费用户）：
# { "success": true, "count": 3, "remaining": 2 }

# 预期响应（Pro 用户）：
# { "success": true, "message": "Pro user - no limit" }
```

### 5.3 检查数据库记录
```sql
-- 查看 WallpaperUsage 表
psql $POSTGRES_URL

SELECT * FROM "WallpaperUsage" ORDER BY "createdAt" DESC LIMIT 5;

-- 应该看到每日使用记录
-- userId | date       | count | createdAt
-- user_x | 2026-02-15 |   3   | 2026-02-15 12:30:00

-- 退出
\q
```

---

## 📊 Step 6: 性能和错误检查（5 分钟）

### 6.1 检查页面加载速度
- **Lighthouse 评分**（Chrome DevTools → Lighthouse）：
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90

### 6.2 检查错误日志
```bash
# 查看终端输出
# 应该没有错误，只有普通日志

# 浏览器控制台（F12 → Console）
# 应该没有红色错误
```

### 6.3 移动端测试
- 打开 Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- 选择设备：iPhone 12 Pro
- 测试登录和生成流程

---

## ✅ 测试完成清单

### 基础功能
- [ ] 环境变量配置正确
- [ ] 数据库迁移成功
- [ ] 开发服务器启动成功
- [ ] 可以访问 `/en/lockscreen-generator`

### 登录功能
- [ ] 未登录显示 "Sign In" 按钮
- [ ] 点击打开 Clerk 登录弹窗
- [ ] 登录成功后显示用户头像
- [ ] 可以退出登录

### 免费用户限额
- [ ] 未登录可以生成壁纸（但不记录）
- [ ] 登录后前 5 次成功生成
- [ ] 第 6 次弹窗提示升级
- [ ] 弹窗显示 3 个价格选项

### Pro 用户无限
- [ ] 手动设置 Pro 后可以无限生成
- [ ] 不再弹出升级窗口
- [ ] API 返回 `limit: -1`

### API 响应
- [ ] `/api/generate/check-limit` 正确返回限额
- [ ] `/api/generate/record-usage` 正确记录次数
- [ ] 数据库 `WallpaperUsage` 表有记录

---

## 🐛 常见问题排查

### Q1: "未登录时生成壁纸失败"
**A:** 检查 `/api/generate/check-limit` 返回 401 是正常的，代码会允许未登录用户生成（不记录）。

### Q2: "登录后没有头像显示"
**A:** 清除浏览器缓存：
```bash
# Chrome DevTools → Application → Clear storage → Clear site data
```

### Q3: "限额检查不生效"
**A:** 检查以下几点：
1. 数据库表是否创建成功
2. User ID 是否匹配（Clerk User ID = 数据库 User.id）
3. 浏览器 Network 标签查看 API 请求

### Q4: "升级弹窗不显示"
**A:** 检查：
1. 是否真的生成了 5 次
2. 浏览器控制台是否有错误
3. API 返回 `canGenerate: false` 才会弹窗

### Q5: "数据库迁移失败"
**A:** 使用 Prisma DB Push 代替 Migrate：
```bash
bunx prisma db push --schema=./packages/db/prisma/schema.prisma --accept-data-loss
```

---

## 📝 测试报告模板

```markdown
## 测试日期：2026-02-15

### 环境配置
- [x] .env.local 配置完成
- [x] 数据库连接成功
- [x] Prisma 迁移成功
- [x] 开发服务器启动成功

### 功能测试
- [x] 未登录生成壁纸：成功
- [x] 登录功能：成功
- [x] 免费用户限额（5次）：成功
- [x] 升级弹窗：成功显示
- [x] Pro 用户无限生成：成功

### 发现的问题
1. [描述问题]
2. ...

### 下一步
- [ ] 修复问题
- [ ] 继续 Lemon Squeezy 集成
```

---

**开始测试吧！遇到问题随时告诉我 🚀**
