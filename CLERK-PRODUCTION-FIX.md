# Clerk 生产环境配置修复指南

## 问题诊断

你的生产环境出现以下错误：
- `Failed to load Clerk (code="failed_to_load_clerk_js_timeout")`
- `Failed to load resource: net::ERR_CONNECTION_CLOSED`

### 根本原因

1. **使用测试密钥**：当前配置使用 `pk_test_` 开头的测试密钥，而非生产环境的 `pk_live_` 密钥
2. **硬编码的开发环境 URL**（已修复）：之前代码中有硬编码的开发环境 fallback URL
3. **环境变量未正确配置到 Vercel**：生产环境可能缺少必要的环境变量

---

## 解决方案

### 步骤 1：获取生产环境的 Clerk 密钥

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com/)
2. 选择你的应用（如果需要，创建生产应用）
3. 进入 **API Keys** 页面
4. 确保你看到的是 **Production** 或 **Live** 环境的密钥
5. 复制以下密钥：

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
   CLERK_SECRET_KEY=sk_live_xxxxx
   ```

   **重要**：
   - 生产密钥以 `pk_live_` 和 `sk_live_` 开头
   - 测试密钥以 `pk_test_` 和 `sk_test_` 开头（不要用于生产环境）
   - Frontend API URL 通常不需要手动设置，Clerk 会自动从 Publishable Key 推断

### 步骤 2：配置 Vercel 环境变量

#### 方法 A：通过 Vercel Dashboard（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加/更新以下变量：

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_your_production_key` | Production, Preview |
   | `CLERK_SECRET_KEY` | `sk_live_your_production_secret` | Production, Preview |

5. **重要**：确保同时选择了 **Production** 和 **Preview** 环境
6. 点击 **Save**
7. **重新部署**：进入 **Deployments**，点击最新部署右侧的菜单，选择 **Redeploy**

#### 方法 B：通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 登录
vercel login

# 添加生产环境变量
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# 粘贴你的 pk_live_ 密钥

vercel env add CLERK_SECRET_KEY production
# 粘贴你的 sk_live_ 密钥

# 重新部署
vercel --prod
```

### 步骤 3：验证配置

1. 部署完成后，访问你的生产环境 URL
2. 打开浏览器控制台（F12）
3. 检查是否还有 Clerk 加载错误
4. 测试登录/注册功能

---

## 常见问题

### Q1: 我应该使用 Clerk 的开发应用还是生产应用？

**A**：如果你刚开始，可以：
- **选项 1**：使用同一个应用，在 Clerk Dashboard 中切换到 Production 模式获取 `pk_live_` 密钥
- **选项 2**（推荐）：创建一个专门的生产应用，完全隔离开发和生产环境

### Q2: Frontend API URL 需要手动设置吗？

**A**：通常**不需要**。Clerk 会自动从 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 推断正确的 Frontend API URL。

如果你有自定义域名（如 `clerk.lockscreentodo.com`），需要：
1. 在 Clerk Dashboard → **Domains** 中添加自定义域名
2. 按照 Clerk 的指南配置 DNS
3. 配置完成后，Clerk 会自动使用该域名

### Q3: 为什么我之前设置了 `NEXT_PUBLIC_CLERK_FRONTEND_API`？

**A**：这是不必要的。我们已经在代码中移除了对它的依赖。Clerk 官方推荐只设置：
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

其他配置（如 Frontend API URL）会自动推断。

### Q4: 如何检查我的生产环境是否使用了正确的密钥？

**A**：在浏览器控制台运行：
```javascript
console.log(window.clerk?.__internal?.frontendApi);
```

如果你看到 `.clerk.accounts.dev` 或 `.clerk.accounts.com`，说明连接到了 Clerk 服务器。

---

## 检查清单

部署前确认：

- [ ] 使用 `pk_live_` 开头的生产密钥（不是 `pk_test_`）
- [ ] 使用 `sk_live_` 开头的生产密钥（不是 `sk_test_`）
- [ ] 在 Vercel Dashboard 中添加了环境变量
- [ ] 环境变量同时添加到 Production 和 Preview 环境
- [ ] 重新部署了应用
- [ ] 测试了登录/注册功能

---

## 其他优化建议

### 1. 移除 `NEXT_PUBLIC_CLERK_FRONTEND_API`

从 `.env.local` 中删除这一行：
```bash
# NEXT_PUBLIC_CLERK_FRONTEND_API=https://clerk.lockscreentodo.com  # 删除这行
```

这个变量不再需要，Clerk 会自动推断。

### 2. 更新 `.env.example`

确保示例文件清晰说明需要使用生产密钥。

### 3. 检查自定义域名配置

如果你确实想使用 `clerk.lockscreentodo.com`：

1. 在 [Clerk Dashboard](https://dashboard.clerk.com/) → **Domains**
2. 添加自定义域名
3. 配置 DNS 记录（通常是 CNAME）
4. 等待 SSL 证书生成
5. 验证域名指向正确的 Clerk 服务器

---

## 需要帮助？

如果问题仍然存在：

1. **检查 Vercel 部署日志**：
   - Vercel Dashboard → 你的项目 → Deployments → 点击最新部署 → Build Log
   - 确认环境变量正确加载

2. **检查浏览器控制台**：
   - 打开开发者工具 → Console 标签
   - 查找红色的错误信息
   - 特别注意 "Clerk" 相关的错误

3. **检查网络请求**：
   - 开发者工具 → Network 标签
   - 筛选 "clerk" 相关的请求
   - 检查是否有失败的请求（红色）

4. **联系 Clerk 支持**：
   - https://clerk.com/support
   - 提供错误详情和你的 Clerk 应用 ID

---

## 总结

**核心修复**：
1. ✅ 已移除硬编码的开发环境 fallback URL
2. ⚠️ **你需要做的**：在 Vercel 中配置正确的生产环境 Clerk 密钥（`pk_live_`）
3. ⚠️ **重新部署**：环境变量更新后必须重新部署

完成以上步骤后，你的生产环境应该可以正常加载 Clerk 了。
