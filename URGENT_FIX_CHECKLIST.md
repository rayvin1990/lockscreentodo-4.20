# 🚨 紧急修复清单 - Lockscreen Todo

## 问题汇总

### 1. 网站 loading 卡住（最高优先级）
**症状**：
- 右上角一直在 loading
- 用户板块没响应
- 直接访问域名打不开
- Vercel Dashboard 可以访问

**最可能原因**：
1. ✅ **Cloudflare 安全拦截**（90% 概率）
2. ⚠️ Clerk API Keys 配置错误（10% 概率）

---

## ✅ 立即修复步骤（按顺序执行）

### 步骤 1：修复 Cloudflare（5分钟）

#### 1.1 登录 Cloudflare Dashboard
https://dash.cloudflare.com

#### 1.2 修改 Security Level
1. 选择你的域名
2. 进入 **Security** → **Settings**
3. 找到 **Security Level**
4. **改为**：`Low` 或 `Essentially Off`
5. 点击 **Save**

#### 1.3 关闭 Bot Fight Mode
1. 进入 **Security** → **Bots**
2. 找到 **Bot Fight Mode**
3. **关闭**（Disable）
4. 点击 **Save**

#### 1.4 检查 SSL/TLS
1. 进入你的域名 → **SSL/TLS** → **Overview**
2. **确保设置为**：`Flexible`
3. 如果不是，改为 `Flexible` 并保存

#### 1.5 等待并测试
1. 等待 **1-2 分钟**
2. 清除浏览器缓存（Ctrl + Shift + Delete）
3. 使用**无痕模式**访问
4. 打开：https://www.lockscreentodo.com

**预期结果**：页面正常加载，不再卡住

---

### 步骤 2：检查 Vercel 环境变量（5分钟）

#### 2.1 登录 Vercel Dashboard
https://vercel.com/dashboard

#### 2.2 选择你的项目

#### 2.3 检查环境变量
进入 **Settings** → **Environment Variables**

**确认以下变量已配置**：

| 变量名 | 示例值 | 说明 |
|---------|---------|------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_xxx` | ✅ 必须 |
| `CLERK_SECRET_KEY` | `sk_test_xxx` | ✅ 必须 |
| `DATABASE_URL` | `postgresql://...` | ✅ 必须 |
| `NEXTAUTH_SECRET` | `随机字符串` | ✅ 必须 |

#### 2.4 更新 Clerk Keys（如果需要）

如果你最近在 Clerk Dashboard 重新生成过 Keys：

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com)
2. 找到你的应用
3. 复制 **Publishable Key**（以 `pk_` 开头）
4. 复制 **Secret Key**（以 `sk_` 开头）
5. 在 Vercel 更新这两个环境变量
6. **重要**：删除旧的值，粘贴新的
7. 点击 **Save**
8. 触发重新部署（Vercel 会自动部署）

#### 2.5 检查 Allowed Origins

在 Clerk Dashboard：

1. 进入你的应用 → **Sessions** → **Allowlist**
2. 确保以下域名在列表中：
   - `localhost:3000`（开发）
   - `www.lockscreentodo.com`（生产）
3. 如果没有，添加它们

---

### 步骤 3：验证修复（5分钟）

#### 3.1 测试网站访问

1. 打开**无痕模式**浏览器
2. 访问：https://www.lockscreentodo.com
3. 检查：
   - ✅ 页面是否正常加载
   - ✅ 右上角 loading 是否消失
   - ✅ 用户板块是否显示

**如果还是卡住** → 继续步骤 4

#### 3.2 检查浏览器控制台

1. 按 F12 打开开发者工具
2. 点击 **Console** 标签
3. 截图所有**红色错误**
4. 提供错误信息给我

---

### 步骤 4：备选方案（如果 Cloudflare 修复无效）

#### 方案 A：暂时禁用 Cloudflare

1. 登录 Cloudflare Dashboard
2. 选择你的域名 → **Overview**
3. 找到右下角 **"Turn Off Cloudflare"**（灰色文字）
4. 点击确认禁用
5. 测试访问网站

**如果禁用后能访问** → 问题确认是 Cloudflare
**如果禁用后还是卡住** → 可能是代码问题

#### 方案 B：直接访问 Vercel URL

Vercel 提供的部署 URL（格式类似）：
```
https://your-project-name.vercel.app
```

测试：
1. 在 Vercel Dashboard 找到 **Domains**
2. 复制 `*.vercel.app` 链接
3. 直接访问这个链接

**如果这个能访问** → Cloudflare DNS 问题
**如果这个也卡住** → 代码问题

---

## 📋 代码问题排查（如果 Cloudflare 不是原因）

### 检查点 1：useEffect 无限循环

打开 `apps/nextjs/src/app/[lang]/generator/page.tsx`

查找这样的代码：
```tsx
// ❌ 错误：缺少依赖
useEffect(() => {
  fetchData();
});

// ✅ 正确：有依赖
useEffect(() => {
  fetchData();
}, [userId]);
```

### 检查点 2：Clerk 初始化

确保 `apps/nextjs/src/app/layout.tsx` 中：
```tsx
<ClerkProvider>
  {/* 应用内容 */}
</ClerkProvider>
```

### 检查点 3：数据库连接

确保 `DATABASE_URL` 正确：
```bash
# 本地测试
npm run dev

# 查看控制台是否有数据库连接错误
```

---

## 🎯 优先级修复顺序

| 优先级 | 任务 | 预计时间 |
|--------|------|---------|
| 🔥 P0 | Cloudflare Security Level → Low | 2 分钟 |
| 🔥 P0 | 关闭 Bot Fight Mode | 1 分钟 |
| 🔥 P0 | 检查 SSL/TLS 模式 | 2 分钟 |
| 🔥 P0 | 验证 Vercel 环境变量 | 5 分钟 |
| 🔴 P1 | 如果还是卡住，禁用 Cloudflare | 2 分钟 |
| 🔴 P1 | 检查浏览器控制台错误 | 3 分钟 |
| 🟠 P2 | 本地测试（如果远程无法访问） | 10 分钟 |
| 🟡 P3 | 修复代码问题（如果确认是代码） | 30+ 分钟 |

---

## 📞 需要提供的信息

如果按照上述步骤操作后问题依旧，请提供：

### 1. Cloudflare 设置截图
- Security Level 设置
- Bot Fight Mode 设置
- SSL/TLS 模式
- DNS 记录（@ 和 www）

### 2. 浏览器控制台截图
- 按 F12 → Console
- 截图所有红色错误
- 截图所有警告（黄色）

### 3. Vercel 部署日志
- 在 Vercel Dashboard
- 查看最新部署的日志
- 截图任何错误

### 4. Vercel 环境变量截图
- 显示已配置的变量名（隐藏值）
- 特别是 `CLERK_*` 相关的

---

## ✅ 成功标志

修复后，你应该能看到：

1. **网站正常加载**
   - 访问 https://www.lockscreentodo.com
   - 立即看到页面，不再 "Just a moment..."

2. **右上角正常显示**
   - 显示用户状态（登录/未登录）
   - 没有 loading 旋转图标

3. **用户板块可以操作**
   - 登录/注册按钮可点击
   - 点击后正常跳转

---

## 🚀 开始修复

**现在就做**：
1. ⏰ 2 分钟：修改 Cloudflare Security Level
2. ⏰ 1 分钟：关闭 Bot Fight Mode
3. ⏰ 2 分钟：检查 SSL/TLS
4. ⏰ 5 分钟：验证 Vercel 环境变量
5. ⏰ 1 分钟：测试访问

**总耗时**：约 10 分钟

---

## 💡 预防未来问题

### Cloudflare 配置
- **Security Level**：保持为 `Low`
- **Bot Fight Mode**：保持关闭
- **SSL/TLS**：保持为 `Flexible`

### Vercel 部署
- 每次修改环境变量后，等待部署完成
- 检查部署日志确认成功

### 监控
- 定期检查网站是否能访问
- 查看 Vercel Analytics 有无异常

---

**立即开始修复，每完成一步就测试一下！** 🎯
