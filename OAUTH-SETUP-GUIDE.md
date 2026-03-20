# 快速启用 Google、Apple、Microsoft 登录

## 🚀 立即开始（2分钟配置）

### 步骤 1：登录 Clerk Dashboard

1. 访问 https://dashboard.clerk.com/
2. 选择 "Lockscreen Todo" 应用
3. 确保右上角显示 **Production** 环境

### 步骤 2：启用 Google 登录（最简单，30秒）

1. 左侧菜单 → **Configure** → **SSO Connections**
2. 找到 **Google**，点击 **Add** 或 **Enable**
3. **重要**：如果看到两个选项，选择：
   - ✅ **"Use Clerk's managed OAuth app"** （推荐，最简单）
   - ❌ 不要选择 "Bring your own OAuth app"（除非你要自定义）

4. 点击 **Save** 或 **Enable**

### 步骤 3：启用 Apple 登录（可选，1分钟）

1. 在同一页面（SSO Connections）
2. 找到 **Apple**，点击 **Add** 或 **Enable**
3. 如果需要配置：
   - 你需要一个 Apple Developer 账号（$99/年）
   - 如果没有，可以跳过 Apple 登录
   - 只启用 Google 和 Microsoft 也可以

### 步骤 4：启用 Microsoft 登录（可选，1分钟）

1. 在同一页面（SSO Connections）
2. 找到 **Microsoft**，点击 **Add** 或 **Enable**
3. 同样选择 **"Use Clerk's managed OAuth app"**

### 步骤 5：保存并部署

1. 点击 **Save Changes**
2. 等待 Clerk 保存配置（通常几秒钟）
3. **无需重新部署代码**，配置立即生效

---

## ✅ 验证配置

保存后，立即测试：

1. 访问 `https://lockscreentodo.com`
2. 点击登录按钮
3. 点击 **"Continue with Google"**
4. 应该会跳转到 Google 登录页面
5. 登录后应该能成功返回你的网站

---

## 🎯 最简单配置（推荐）

**只启用 Google 登录就足够了！**

大多数用户都用 Google，所以：
- ✅ 启用 Google（必须）
- ⏸️ Apple 和 Microsoft（可选，可以稍后添加）

---

## ⚠️ 常见问题

### Q: 我看到 "Bring your own OAuth app" 和 "Use Clerk's managed" 两个选项，选哪个？

**A**: 选择 **"Use Clerk's managed OAuth app"**。这是最简单的，Clerk 已经配置好了所有东西。

### Q: 启用后还是报错怎么办？

**A**: 按照"验证配置"步骤测试，并截图浏览器控制台给我。

### Q: 我没有 Apple Developer 账号怎么办？

**A**: 不用担心，可以不启用 Apple 登录。Google 和 Microsoft 就足够了。

---

## 📸 配置截图参考

在 Clerk Dashboard 的 **SSO Connections** 页面，你会看到：

```
┌─────────────────────────────────────┐
│  SSO Connections                    │
│                                     │
│  ┌──────────┐   ┌──────────┐       │
│  │ Google   │   │  Apple   │       │
│  │  [Add]   │   │  [Add]   │       │
│  └──────────┘   └──────────┘       │
│                                     │
│  ┌──────────┐   ┌──────────┐       │
│  │Microsoft │   │  Other   │       │
│  │  [Add]   │   │          │       │
│  └──────────┘   └──────────┘       │
└─────────────────────────────────────┘
```

点击每个按钮后，选择 "Use Clerk's managed app"，然后保存。

---

## 🔥 立即行动

**现在就去配置**：

1. 打开 https://dashboard.clerk.com/
2. 进入 **SSO Connections**
3. 启用 Google（选择 "Use Clerk's managed"）
4. 保存
5. 测试登录

**配置完成后，立即就能登录了！** 🎉
