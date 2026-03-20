# Notion OAuth 集成配置完成 ✅

## ✅ 已完成的配置

### 1. 环境变量已添加

在 `.env.local` 中已添加以下配置：

```bash
# Notion OAuth Configuration
NEXT_PUBLIC_NOTION_CLIENT_ID="your-notion-client-id"
NOTION_CLIENT_SECRET="your-notion-client-secret"
NOTION_REDIRECT_URI="https://www.lockscreentodo.com/api/notion/auth/callback"
```

---

## ⚠️ 重要：需要在 Notion 中更新 Redirect URI

### 问题
你提供的 Authorization URL 中的 redirect_uri 是：
```
https://www.lockscreentodo.com/generator
```

但根据你的代码，正确的回调地址应该是：
```
https://www.lockscreentodo.com/api/notion/auth/callback
```

### 解决步骤

1. **访问 Notion Developer Dashboard**
   - 打开：https://www.notion.so/my-integrations
   - 找到你刚创建的 OAuth 应用

2. **更新 Redirect URI**
   - 在 OAuth 应用详情中
   - 找到 **Allowed redirect URIs** 或 **Redirect URIs**
   - **删除** `https://www.lockscreentodo.com/generator`
   - **添加** `https://www.lockscreentodo.com/api/notion/auth/callback`

3. **保存设置**

---

## 🔍 为什么需要更改？

你的应用 OAuth 流程：

```
1. 用户点击"Connect Notion"
   ↓
2. 跳转到 Notion 授权页面
   ↓
3. 用户点击"Allow"
   ↓
4. Notion 回调到：/api/notion/auth/callback
   ↓
5. 后端处理授权码，获取 access_token
   ↓
6. 存储到数据库，重定向到 /generator
```

所以 Redirect URI 必须是 `/api/notion/auth/callback`，不是 `/generator`。

---

## 🧪 测试步骤

### 1. 本地测试

```bash
# 1. 确保你在项目根目录
cd C:\Users\57684\saasfly

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
http://localhost:3000/generator

# 4. 点击"Connect Notion"按钮
# 5. 应该会跳转到 Notion 授权页面
# 6. 点击"Allow"
# 7. 应该会回调到 localhost 并显示"Connected to Notion ✅"
```

### 2. 生产环境测试

1. **部署到 Vercel**
   ```bash
   # 提交代码
   git add .
   git commit -m "Add Notion OAuth configuration"
   git push

   # Vercel 会自动部署
   ```

2. **访问生产环境**
   - 打开：https://www.lockscreentodo.com/generator
   - 点击"Connect Notion"
   - 应该会跳转到 Notion 授权页面

3. **测试授权流程**
   - 在 Notion 页面点击"Allow"
   - 应该回调到你的应用
   - 显示"Connected to Notion ✅"
   - 可以看到"Import Tasks from Notion"按钮

---

## ❓ 常见问题

### Q1：点击"Connect Notion"没反应？

**可能原因**：
- 环境变量未生效
- 浏览器缓存

**解决**：
```bash
# 重启开发服务器
# 按 Ctrl+C 停止
# 然后重新运行
npm run dev
```

### Q2：Notion 授权页面显示错误？

**错误信息**：`redirect_uri_mismatch`

**原因**：Notion 配置的 Redirect URI 与实际请求的不匹配

**解决**：
1. 检查 Notion 中的 Redirect URI 是否是：
   `https://www.lockscreentodo.com/api/notion/auth/callback`
2. 确保 `http` 和 `https` 正确
3. 注意末尾的 `/`

### Q3：授权后显示"invalid_state"？

**原因**：之前修复过 state 验证问题，应该不会出现了

**解决**：如果还是出现，检查浏览器控制台的错误信息

### Q4：连接成功后导入任务失败？

**可能原因**：
- Notion 工作区中没有包含 task/todo 的数据库
- OAuth 权限不足

**解决**：
1. 在 Notion 中创建一个数据库，命名为 "Tasks" 或 "Todo"
2. 添加一些测试任务
3. 重新授权

---

## 📋 配置检查清单

- ✅ OAuth Client ID 已配置
- ✅ OAuth Client Secret 已配置
- ✅ Redirect URI 已设置为 `/api/notion/auth/callback`
- ⏳ Notion 中的 Redirect URI 已更新（**需要你手动操作**）
- ⏳ 本地测试通过
- ⏳ 生产环境测试通过

---

## 🚀 下一步

### 立即操作
1. 去 Notion 更新 Redirect URI
2. 重启开发服务器
3. 测试本地授权流程

### 测试通过后
1. 部署到 Vercel
2. 测试生产环境授权
3. 准备上线！

---

## 📞 遇到问题？

如果测试时遇到任何错误，请提供：
1. 浏览器控制台的错误截图（F12 → Console）
2. Network 标签页的请求信息（特别是 `/api/notion/auth/callback`）
3. Notion 授权页面的错误信息（如果有）

---

## 🎯 成功标志

当一切配置正确后，你应该能看到：

```
┌─────────────────────────────────────────┐
│ Notion Integration                    │
├─────────────────────────────────────────┤
│                                       │
│ [Connect Notion]                      │
│ Read-only access to tasks only.         │
│ Your privacy is protected.              │
│                                       │
│ 🛡️ Privacy Protection                 │
│ ✓ We will never access your private data│
│ ✓ Only requesting read access...       │
│ ✓ You can revoke access anytime...     │
│ ✓ Data is only used for personal...   │
│                                       │
└─────────────────────────────────────────┘
```

点击"Connect Notion"后，跳转到 Notion，授权成功后回来，显示：

```
[Connected to Notion ✅]

[Import Tasks from Notion]
Sync tasks from your Notion databases
```

---

祝你配置顺利！🎉
