# 🔍 Vercel 环境变量诊断指南

## 问题诊断

**症状**：
- ✅ 本地网站可以打开 Lemon Squeezy 支付页面
- ❌ Vercel 远程网站打不开支付页面

**最可能的原因**：
1. Lemon Squeezy 环境变量没有部署到 Vercel
2. `NEXT_PUBLIC_APP_URL` 仍然指向 `localhost:3000`

---

## 📋 需要检查的环境变量清单

### 必须在 Vercel 中配置的环境变量

#### 1. Lemon Squeezy 配置（支付系统）
```bash
NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL=https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc
NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL=https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4
LEMON_WEBHOOK_SECRET=whsec_f12f43b42499c047615f9e4526fb21e7
```

#### 2. Clerk 认证配置（用户系统）
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmVsYXRpdmUtZ29ibGluLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_4CuRLNdLYdCFGQTbgrzkEoLioKs79eRDpmUHCojd5h
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

#### 3. 数据库配置（Prisma）
```bash
POSTGRES_URL=postgresql://user:password@host:port/database
```

#### 4. 应用 URL（重要！）
```bash
# 生产环境应该用你的域名
NEXT_PUBLIC_APP_URL=https://www.lockscreentodo.com
```

---

## 🔧 如何在 Vercel 中配置环境变量

### 方法 1：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目 `saasfly`（或 `lockscreentodo`）
3. 点击项目进入 **Settings** → **Environment Variables**
4. 检查以下变量是否存在：

#### 检查清单：

| 环境变量 | 是否需要 | 本地示例值 |
|---------|---------|-----------|
| `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL` | ✅ 必需 | `https://rayvin1990.lemonsqueezy.com/checkout/buy/...` |
| `NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL` | ✅ 必需 | `https://rayvin1990.lemonsqueezy.com/checkout/buy/...` |
| `LEMON_WEBHOOK_SECRET` | ✅ 必需 | `whsec_f12f43b42499c047615f9e4526fb21e7` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ 必需 | `pk_test_...` |
| `CLERK_SECRET_KEY` | ✅ 必需 | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | ✅ 必需 | `your_clerk_webhook_secret` |
| `POSTGRES_URL` | ✅ 必需 | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | ✅ 必需 | `https://www.lockscreentodo.com` |

5. 如果某个变量不存在，点击 **Add New** 添加
6. 添加后，点击每个变量右侧的 **Environment** 下拉框，选择：
   - `Production` - 生产环境
   - `Preview` - 预览环境
   - `Development` - 开发环境
   
7. 配置完成后，滚动到页面底部，点击 **Save** 保存

---

### 方法 2：通过 Vercel CLI

如果你想用命令行操作：

```bash
# 安装 Vercel CLI（如果未安装）
npm install -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL production
# 粘贴: https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc

vercel env add NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL production
# 粘贴: https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4

vercel env add LEMON_WEBHOOK_SECRET production
# 粘贴: whsec_f12f43b42499c047615f9e4526fb21e7

vercel env add NEXT_PUBLIC_APP_URL production
# 粘贴: https://www.lockscreentodo.com
```

---

## 🚀 配置完成后重新部署

### 方法 1：通过 Dashboard
1. 在 Vercel Dashboard 进入项目
2. 点击 **Deployments** 标签
3. 找到最新的部署
4. 点击右侧的 **...** → **Redeploy**
5. 或者直接推送新代码触发自动部署

### 方法 2：通过 CLI
```bash
# 强制重新部署
vercel --prod
```

---

## 🧪 验证配置

### 1. 检查浏览器控制台

1. 打开你的生产网站：`https://www.lockscreentodo.com`
2. 按 `F12` 打开开发者工具
3. 切换到 **Console** 标签
4. 点击"升级 Pro"按钮
5. 查看是否有以下错误：

**错误的日志**：
```
❌ Payment URL not configured
❌ Lemon Squeezy checkout URL not configured
```

**正确的日志**：
```
✓ URL exists: true
✓ URL length: 100+
✅ Opening checkout page...
```

### 2. 检查 Network 标签

1. 打开 **Network** 标签
2. 点击"升级 Pro"按钮
3. 查看是否打开了新的标签页跳转到 Lemon Squeezy
4. 如果没有，说明环境变量没有正确加载

---

## ⚠️ 常见错误和解决方案

### 错误 1: 💳 Payment is being configured. Please try again later!

**原因**：环境变量未配置或 URL 为空

**解决**：
1. 检查 `NEXT_PUBLIC_LEMON_SQUEEZY_*` 变量是否在 Vercel 中设置
2. 确保 URL 不是 `your-product-id` 这样的占位符
3. 重新部署应用

---

### 错误 2: 点击按钮没有反应

**原因**：
- 环境变量只在 `Development` 环境设置，但部署的是 `Production`
- 或者 `NEXT_PUBLIC_` 前缀缺失

**解决**：
1. 检查环境变量是否添加到了 **Production** 环境
2. 确保客户端可访问的变量以 `NEXT_PUBLIC_` 开头

---

### 错误 3: 环境变量在本地可用，但在 Vercel 不可用

**原因**：`.env.local` 只用于本地开发，不会部署到 Vercel

**解决**：
- 必须在 Vercel Dashboard 中手动添加环境变量
- `.env.local` 不会自动同步到 Vercel

---

### 错误 4: NEXT_PUBLIC_APP_URL 还是 localhost

**原因**：在 Vercel 中设置了错误的 URL

**解决**：
```bash
# 错误 ❌
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 正确 ✅
NEXT_PUBLIC_APP_URL=https://www.lockscreentodo.com
```

---

## 📝 完整的环境变量配置示例

创建一个 `.env.production` 文件（用于本地测试）：

```bash
# 数据库
POSTGRES_URL=your_production_database_url

# 应用 URL
NEXT_PUBLIC_APP_URL=https://www.lockscreentodo.com

# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmVsYXRpdmUtZ29ibGluLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_4CuRLNdLYdCFGQTbgrzkEoLioKs79eRDpmUHCojd5h
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Lemon Squeezy 支付
NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL=https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc
NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL=https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4
LEMON_WEBHOOK_SECRET=whsec_f12f43b42499c047615f9e4526fb21e7
```

**注意**：`.env.production` 不会部署到 Vercel，只是用于本地测试生产环境配置。

---

## 🎯 快速检查清单

在继续之前，确认以下所有项：

- [ ] Vercel Dashboard 中已添加 `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL`
- [ ] Vercel Dashboard 中已添加 `NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL`
- [ ] Vercel Dashboard 中已添加 `LEMON_WEBHOOK_SECRET`
- [ ] Vercel Dashboard 中已添加 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Vercel Dashboard 中已添加 `CLERK_SECRET_KEY`
- [ ] Vercel Dashboard 中已添加 `CLERK_WEBHOOK_SECRET`
- [ ] Vercel Dashboard 中已添加 `POSTGRES_URL`
- [ ] Vercel Dashboard 中已添加 `NEXT_PUBLIC_APP_URL`（设置为生产域名）
- [ ] 所有环境变量都已添加到 **Production** 环境
- [ ] 已重新部署应用到 Vercel
- [ ] 在浏览器控制台看到正确的日志（不是错误）

---

## 📞 需要帮助？

如果按照上述步骤操作后仍有问题：

1. **查看 Vercel 部署日志**：
   - 进入 Vercel Dashboard → 项目 → Deployments
   - 点击最新的部署 → 查看构建日志
   - 检查是否有环境变量相关的错误

2. **查看浏览器控制台**：
   - F12 → Console 标签
   - 查找红色错误信息
   - 复制错误信息给我

3. **临时解决方案**：
   - 确认你的生产网站 URL 是什么（如 `https://www.lockscreentodo.com`）
   - 我可以帮你写一个测试页面来检查环境变量是否正确加载

---

**下一步**：
1. 访问 Vercel Dashboard 检查环境变量
2. 确保所有必需的变量都已添加到 Production 环境
3. 重新部署应用
4. 在浏览器中测试支付按钮

如果有任何不清楚的地方，随时告诉我！
