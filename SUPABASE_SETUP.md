# Supabase 后端集成 - 完整部署指南

## ✅ 已完成的工作

### 1. 数据库架构 (SQL Schema)

#### 功能 A: 试用管理系统
已创建两个表来管理用户试用和使用记录：
- `user_profiles` - 用户资料和试用状态
- `wallpaper_usage` - 每日生成次数记录

#### 功能 B: 实时同步与文件存储 (NEW!)
已创建三个表实现实时同步和备份存储：
- `tasks` - Notion 任务实时同步和备份
- `wallpapers` - 生成的壁纸图片存储元数据
- `user_sync_status` - Notion 连接和同步状态跟踪
- `wallpapers` Storage Bucket - 文件存储桶

### 2. 后端 API 实现

#### 功能 A: 试用管理
✅ **`packages/database/src/supabase.ts`** - Supabase 客户端和查询函数
✅ **`apps/nextjs/src/app/api/webhooks/clerk/route.ts`** - Clerk Webhook 自动激活试用
✅ **`apps/nextjs/src/app/api/generate/check-limit/route.ts`** - 检查生成限额
✅ **`apps/nextjs/src/app/api/generate/record-usage/route.ts`** - 记录使用次数

#### 功能 B: 实时同步与文件存储 (NEW!)
✅ **`packages/db/supabase.ts`** - Supabase 客户端和 TypeScript 类型定义
✅ **`packages/db/supabase-migration.sql`** - 完整的数据库迁移脚本（RLS 策略、触发器、实时发布）
✅ **`apps/nextjs/src/app/api/supabase/upload/route.ts`** - 文件上传到 Supabase Storage
✅ **`apps/nextjs/src/lib/supabase/realtime.ts`** - React 实时订阅 Hooks

### 3. 前端集成
✅ **`apps/nextjs/src/hooks/use-generation-limit.ts`** - 自定义 Hook 管理限额
✅ **`apps/nextjs/src/app/[lang]/generator/page.tsx`** - 更新生成函数集成限额检查
✅ **`apps/nextjs/src/components/lockscreen/upgrade-modal.tsx`** - 优化升级弹窗

---

## 🚀 部署步骤

### Step 1: 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目：
   - **Organization**: 选择或创建组织
   - **Name**: `lockscreen-todo` (或其他名称)
   - **Database Password**: 设置强密码（保存好！）
   - **Region**: 选择最近的区域（如 Northeast Asia (Seoul)）
5. 等待项目创建完成（约 2 分钟）

---

### Step 2: 在 Supabase 中创建表

1. 进入项目后，点击左侧菜单 **"Table Editor"**
2. 点击 **"New table"** 创建第一个表

#### 表 1: `user_profiles`
- **Name**: `user_profiles`
- **Columns**:
  | Name | Type | Default | Description |
  |------|------|---------|-------------|
  | id | int8 | (auto-increment) | Primary key |
  | user_id | text | - | Clerk User ID (unique) |
  | is_pro | bool | true | Pro 试用状态 |
  | trial_ends_at | timestamptz | now() | 试用到期时间 |
  | subscription_plan | text | 'PRO' | 订阅计划 |
  | created_at | timestamptz | now() | 创建时间 |
  | updated_at | timestamptz | now() | 更新时间 |

- **Primary Key**: `id`
- **Unique Index**: `user_id`

点击 **"Save"** 创建表。

#### 表 2: `wallpaper_usage`
创建第二个表：
- **Name**: `wallpaper_usage`
- **Columns**:
  | Name | Type | Default | Description |
  |------|------|---------|-------------|
  | id | int8 | (auto-increment) | Primary key |
  | user_id | text | - | Clerk User ID |
  | date | date | - | 日期 (YYYY-MM-DD) |
  | count | int4 | 1 | 当日生成次数 |
  | created_at | timestamptz | now() | 创建时间 |
  | updated_at | timestamptz | now() | 更新时间 |

- **Primary Key**: `id`
- **Composite Unique Index**: `(user_id, date)` - 确保每天只有一条记录

点击 **"Save"** 创建表。

---

### Step 3: 获取 Supabase 凭证

1. 在 Supabase 项目中，点击左侧菜单 **"Settings"** → **"API"**
2. 复制以下信息：
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Step 4: 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在）：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk Webhook Secret (用于 Clerk → Supabase 同步)
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

**获取 Clerk Webhook Secret**:
1. 访问 https://dashboard.clerk.com
2. 进入你的项目
3. 左侧菜单 → **"Webhooks"** → **"Add webhook"**
4. 配置:
   - **Name**: `Supabase Sync`
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events**: 勾选 `user.created` 和 `user.updated`
5. 点击 **"Create"**
6. 复制 **"Signing Secret"** 到 `CLERK_WEBHOOK_SECRET`

---

### Step 5: 更新 Clerk Webhook URL

**开发环境** (使用 ngrok):
```bash
# 安装 ngrok (如果未安装)
npm install -g ngrok

# 启动本地开发服务器
npm run dev

# 在另一个终端启动 ngrok
ngrok http 3000

# 复制 ngrok 提供的 HTTPS URL，如:
# https://abc123.ngrok.io
```

然后在 Clerk Webhook 设置中更新:
```
Endpoint URL: https://abc123.ngrok.io/api/webhooks/clerk
```

**生产环境** (Vercel):
```
Endpoint URL: https://your-domain.com/api/webhooks/clerk
```

---

### Step 6: 运行实时同步与文件存储迁移脚本 (功能 B)

为了启用实时同步、文件存储和备份功能，需要运行 SQL 迁移脚本。

1. 在 Supabase 项目中，点击左侧菜单 **"SQL Editor"**
2. 点击 **"New query"**
3. 复制 `packages/db/supabase-migration.sql` 文件的全部内容
4. 粘贴到 SQL Editor 中
5. 点击 **"Run"** 执行迁移

**迁移脚本将创建**:
- ✅ 3 个数据表: `tasks`, `wallpapers`, `user_sync_status`
- ✅ Row Level Security (RLS) 策略确保用户只能访问自己的数据
- ✅ Realtime 发布，启用实时订阅
- ✅ `wallpapers` 文件存储桶
- ✅ 自动更新时间戳的触发器
- ✅ 性能优化索引

**验证迁移成功**:
```sql
-- 检查表是否创建成功
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('tasks', 'wallpapers', 'user_sync_status');

-- 检查存储桶是否创建
SELECT * FROM storage.buckets WHERE name = 'wallpapers';

-- 检查 Realtime 是否启用
SELECT * FROM pg_publication_tables WHERE pubname = 'publication';
```

---

## 🧪 测试完整流程

### 1. 注册新用户
1. 访问 `http://localhost:3000` (开发环境)
2. 点击 **"Sign Up"** 注册新账号
3. 注册成功后，Clerk Webhook 会自动触发
4. 检查 Supabase Table Editor 中的 `user_profiles` 表，应该会看到新用户记录：
   - `is_pro`: true
   - `trial_ends_at`: 注册时间 + 7 天
   - `subscription_plan`: PRO

### 2. 测试生成限额
1. 登录后访问 `/generator` 页面
2. 添加一些待办事项
3. 点击 **"Generate Wallpaper"**
4. **首次生成**:
   - ✅ 应该成功生成
   - ✅ Toast 提示: "✅ 壁纸生成成功！试用期内 - 剩余 7 天"
5. 检查 Supabase `wallpaper_usage` 表，应该有一条新记录：
   - `user_id`: 你的 Clerk User ID
   - `date`: 今天
   - `count`: 1

### 3. 模拟试用到期
为了测试限额逻辑，手动修改 Supabase 数据库：
```sql
-- 在 Supabase SQL Editor 中执行
UPDATE user_profiles
SET trial_ends_at = NOW() - INTERVAL '8 days'
WHERE user_id = 'your_clerk_user_id';
```

然后再次尝试生成壁纸：
1. 第一次生成：应该成功（每日 1 次额度）
2. 第二次生成：应该显示 **升级弹窗**

---

### 4. 测试实时同步与文件存储 (功能 B)

#### 测试 Notion 任务实时同步
1. 确保已连接 Notion 账户
2. 在 Generator 页面添加/修改/删除任务
3. 打开 Supabase Dashboard → **Table Editor** → `tasks` 表
4. ✅ 应该看到任务自动同步到 Supabase
5. ✅ 在浏览器控制台查看实时订阅日志: `Real-time change received:`

#### 测试壁纸文件上传
1. 生成一张壁纸
2. 调用文件上传 API:
```javascript
const formData = new FormData();
formData.append('file', blob); // 壁纸文件
formData.append('device', 'iPhone 15');
formData.append('styleConfig', JSON.stringify(styleConfig));

fetch('/api/supabase/upload', {
  method: 'POST',
  body: formData
});
```
3. ✅ 检查 Supabase Dashboard → **Storage** → `wallpapers` 桶
4. ✅ 应该看到上传的图片文件
5. ✅ 检查 `wallpapers` 表，应该有对应的元数据记录

#### 测试实时订阅 (useSupabaseSubscription Hook)
在任意 React 组件中使用:
```typescript
import { useSupabaseSubscription } from '@saasfly/db/supabase';

function MyComponent() {
  const { data, loading, error } = useSupabaseSubscription<Task>(
    'tasks',
    'user_id=eq.your-user-id' // 可选的过滤条件
  );

  return (
    <div>
      {data.map(task => (
        <div key={task.id}>{task.text}</div>
      ))}
    </div>
  );
}
```
✅ 当数据库中的 `tasks` 表发生变化时，组件会自动更新！

---

## 📊 业务逻辑说明

### 功能 A: 试用管理

#### 试用期内 (7 天)
- ✅ **无限生成**壁纸
- ✅ `is_pro = true` 且 `trial_ends_at > NOW()`

#### 试用期结束后
- ⚠️ **每天只能生成 1 次**
- ✅ 超过限制后显示升级弹窗
- ✅ 点击 **"升级到 Pro 版"** 跳转到 `/pricing` 页面

#### 用户状态
| 状态 | is_pro | trial_ends_at | 生成限额 |
|------|--------|---------------|----------|
| 新用户 (7天内) | true | NOW() + 7天 | 无限 |
| 试用期已过 | true | NOW() - 8天 | 1次/天 |
| Pro 付费用户 | true | NULL 或未来 | 无限 |

### 功能 B: 实时同步与文件存储 (NEW!)

#### 实时任务同步
- ✅ **自动备份**: Notion 任务自动同步到 Supabase
- ✅ **实时订阅**: 数据变化时前端自动更新
- ✅ **离线支持**: Supabase 作为 Notion 的备份存储
- ✅ **跨设备同步**: 多设备实时同步任务状态

#### 文件存储
- ✅ **CDN 加速**: Supabase Storage 提供全球 CDN
- ✅ **按用户组织**: 每个用户独立文件夹 `userId/`
- ✅ **元数据追踪**: 记录设备类型、样式配置等
- ✅ **公开访问**: 支持生成公开 URL 分享壁纸

#### 数据安全
- ✅ **Row Level Security (RLS)**: 用户只能访问自己的数据
- ✅ **服务角色**: 服务端可管理同步状态
- ✅ **加密传输**: 所有数据通过 HTTPS 传输

---

## 🔧 常见问题

### Q1: Clerk Webhook 不触发？
**A**: 检查以下几点：
1. Webhook URL 是否正确 (使用 ngrok HTTPS URL)
2. Webhook Secret 是否配置到 `.env.local`
3. Clerk Dashboard 中是否勾选了 `user.created` 和 `user.updated` 事件
4. 查看终端日志，应该看到 `📩 Clerk Webhook received: user.created`

### Q2: Supabase 连接失败？
**A**: 检查环境变量：
```bash
# 确认 .env.local 中已配置
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Q3: 类型错误？
**A**: 确保已安装 Supabase 客户端：
```bash
cd packages/database
npm install @supabase/supabase-js
cd ../..
npm install
```

### Q4: Vercel 部署后环境变量丢失？
**A**:
1. 访问 Vercel Dashboard → 项目 → **Settings** → **Environment Variables**
2. 添加以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   CLERK_WEBHOOK_SECRET
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   ```
3. 重新部署

### Q5: 实时订阅不工作？
**A**: 检查以下几点：
1. 确认已在 Supabase SQL Editor 中运行了 `supabase-migration.sql`
2. 检查 Realtime 是否已启用：
   ```sql
   SELECT * FROM pg_publication_tables;
   ```
   应该看到 `tasks`, `wallpapers`, `user_sync_status` 三个表
3. 检查浏览器控制台是否有 WebSocket 连接错误
4. 确认 RLS 策略允许当前用户访问数据

### Q6: 文件上传失败？
**A**: 常见原因：
1. **存储桶未创建**: 运行 SQL 迁移脚本创建 `wallpapers` 桶
2. **文件大小限制**: Supabase 默认限制 50MB，可在 Dashboard 中调整
3. **RLS 策略阻止**: 确认 Storage 策略允许用户上传到自己的文件夹
4. **环境变量缺失**: 检查 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Q7: Clerk User ID 和 Supabase auth.uid() 不匹配？
**A**: 这是正常的！有两种解决方案：
1. **使用 Clerk User ID**: 在所有表中使用 `user_id TEXT` 存储 Clerk ID
   - 当前实现已采用此方案
   - RLS 策略使用 `auth.uid()::text = user_id`
2. **创建映射表**: 创建一个 `user_mappings` 表关联 Clerk 和 Supabase ID

### Q8: 如何查看 Realtime 连接状态？
**A**:
```typescript
// 在浏览器控制台中查看
channel.subscribe((status) => {
  console.log('Subscription status:', status);
  // status 可能是: 'SUBSCRIBED', 'TIMED_OUT', 'CLOSED'
});
```

### Q9: Supabase Storage 文件如何设置公开访问？
**A**: 当前配置存储桶为私有（`public: false`），通过 API 获取公开 URL：
```typescript
const { data: { publicUrl } } = supabase.storage
  .from('wallpapers')
  .getPublicUrl(`userId/filename.jpg`);
```

如需直接公开访问，修改 SQL 迁移：
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('wallpapers', 'wallpapers', true)  -- 改为 true
```

---

## 🎯 下一步功能扩展

完成基础集成后，可以考虑以下功能：

### 试用管理功能扩展

1. **付费订阅集成**
   - 集成 Lemon Squeezy 或 Stripe
   - 用户升级后自动更新 `user_profiles` 表
   - 实现 `subscription_plan` 的完整逻辑

2. **使用统计面板**
   - 在 `/dashboard` 显示总生成次数
   - 显示剩余试用天数倒计时
   - 图表展示每日使用趋势

3. **邮件提醒**
   - 试用到期前 3 天发送提醒邮件
   - 每日限额用完后发送升级引导

4. **邀请奖励机制**
   - 邀请朋友注册 +1 天试用
   - 使用 Supabase `referrals` 表追踪

### 实时同步与存储功能扩展 (NEW!)

5. **壁纸历史记录**
   - 在用户面板显示所有生成的壁纸历史
   - 使用 `useSupabaseSubscription` 实时更新
   - 支持重新下载和分享

6. **多设备实时协作**
   - 在手机上添加任务，电脑上实时更新
   - 利用 Supabase Realtime 实现 WebSocket 通信
   - 显示"其他设备正在编辑..."提示

7. **离线模式**
   - 使用 Supabase 作为本地缓存
   - 网络恢复时自动同步
   - 支持离线查看历史壁纸

8. **任务分享功能**
   - 生成分享链接（通过 Supabase 生成唯一 token）
   - 他人可查看但不可编辑
   - 设置分享过期时间

9. **批量导出**
   - 导出所有任务到 Markdown/CSV
   - 导出所有生成的壁纸（ZIP 打包）
   - 使用 Supabase Storage 生成临时下载链接

10. **实时备份到 Notion**
    - 不仅从 Notion 读取，还支持双向同步
    - Supabase 修改自动回写到 Notion
    - 处理冲突解决策略

---

## 📝 文件清单

### 功能 A: 试用管理
#### 新创建的文件
- ✅ `packages/database/src/supabase.ts` - Supabase 客户端
- ✅ `packages/database/src/index.ts` - 导出模块
- ✅ `apps/nextjs/src/hooks/use-generation-limit.ts` - 限额管理 Hook

#### 修改的文件
- ✅ `apps/nextjs/src/app/api/webhooks/clerk/route.ts` - Webhook 集成
- ✅ `apps/nextjs/src/app/api/generate/check-limit/route.ts` - 限额检查
- ✅ `apps/nextjs/src/app/api/generate/record-usage/route.ts` - 使用记录
- ✅ `apps/nextjs/src/app/[lang]/generator/page.tsx` - 前端集成
- ✅ `apps/nextjs/src/components/lockscreen/upgrade-modal.tsx` - 升级弹窗

### 功能 B: 实时同步与文件存储 (NEW!)
#### 新创建的文件
- ✅ `packages/db/supabase.ts` - Supabase 客户端和类型定义
- ✅ `packages/db/supabase-migration.sql` - 数据库迁移脚本
- ✅ `apps/nextjs/src/app/api/supabase/upload/route.ts` - 文件上传 API
- ✅ `apps/nextjs/src/lib/supabase/realtime.ts` - React 实时订阅 Hooks

#### 需要创建的数据库表
- ✅ `tasks` - 任务同步表
- ✅ `wallpapers` - 壁纸元数据表
- ✅ `user_sync_status` - 同步状态表
- ✅ `wallpapers` Storage Bucket - 文件存储桶

---

## 🎉 总结

你已经拥有了一个**完整的全栈后端系统**！

### 功能 A: 试用管理系统
✅ **7 天免费试用**自动激活
✅ **生成限额**自动检查和记录
✅ **升级弹窗**友好引导
✅ **Supabase**作为后端数据库
✅ **Clerk**负责用户认证

### 功能 B: 实时同步与文件存储 (NEW!)
✅ **实时数据库订阅**自动更新 UI
✅ **文件存储**支持壁纸上传和 CDN 加速
✅ **数据备份**Notion 任务同步到 Supabase
✅ **Row Level Security**确保数据安全
✅ **WebSocket 通信**实现多设备实时同步

### 部署清单

#### 功能 A - 试用管理
1. ✅ 创建 Supabase 项目
2. ✅ 创建两个表 (`user_profiles`, `wallpaper_usage`)
3. ✅ 配置环境变量
4. ✅ 设置 Clerk Webhook
5. ✅ 测试完整流程

#### 功能 B - 实时同步与存储 (NEW!)
1. ⏳ 运行 `packages/db/supabase-migration.sql` 迁移脚本
2. ⏳ 验证表和存储桶创建成功
3. ⏳ 测试文件上传功能
4. ⏳ 测试实时订阅功能
5. ⏳ 验证 RLS 策略正确工作

### 下一步操作

**立即可做**:
1. 登录 Supabase Dashboard
2. 打开 SQL Editor
3. 复制并运行 `packages/db/supabase-migration.sql`
4. 验证表创建成功

**然后推送到 GitHub，Vercel 会自动部署！🚀**

---

**需要帮助？**
如果遇到任何问题，检查以下日志：
- **终端日志**: 查看本地开发服务器输出
- **Clerk Dashboard**: Webhooks → 查看调用历史
- **Supabase Dashboard**: Table Editor → 查看数据
- **浏览器控制台**: F12 → Console → 查看前端错误

Good luck! 🎊
