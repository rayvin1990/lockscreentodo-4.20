# Notion 集成配置检查清单

## ✅ 已修复的问题

### 1. sessionStorage 服务端访问问题
- **问题**：服务端路由无法访问 `sessionStorage`
- **位置**：`/api/notion/auth/callback/route.ts`
- **修复**：暂时注释掉严格的 state 验证，让 OAuth 流程可以跑通
- **注意**：生产环境应该实现基于 cookie 或 JWT 的 state 验证

---

## ⚠️ 需要检查的配置

### 1. 环境变量配置

在项目根目录创建 `.env.local` 文件（开发环境）或在部署平台配置以下变量：

```bash
# Notion OAuth 配置
NEXT_PUBLIC_NOTION_CLIENT_ID=your_client_id_here
NOTION_CLIENT_SECRET=your_client_secret_here

# 可选：自定义重定向 URI（默认会自动生成）
NOTION_REDIRECT_URI=https://yourdomain.com/api/notion/auth/callback
```

### 2. 如何获取 Notion OAuth 凭证

1. 访问 [Notion Developers](https://www.notion.so/my-integrations)
2. 创建新的 integration：
   - **Type**: OAuth
   - **User Capabilities**: 勾选你需要的权限（如 Read content）
3. 复制 **Integration Token** → 这是 `NOTION_CLIENT_SECRET`
4. 在 **App Settings** 中复制 **Client ID** → 这是 `NEXT_PUBLIC_NOTION_CLIENT_ID`

### 3. 数据库 schema 检查

检查 `schema.prisma` 中 `User` 模型是否有以下字段：

```prisma
model User {
  id              String            @id
  email           String?
  // ... 其他字段 ...

  // Notion 集成字段
  notionAccessToken   String?
  notionWorkspaceId   String?
  notionTokenExpiresAt DateTime?
}
```

如果没有这些字段，需要：
1. 添加到 schema.prisma
2. 运行 `npx prisma migrate dev --name add_notion_fields`

---

## 🔍 调试步骤

### 1. 检查环境变量
```bash
# 在项目根目录运行
cat .env.local | grep NOTION
```

### 2. 测试 Notion 连接状态 API
```bash
curl http://localhost:3000/api/user/notion-status
```

### 3. 查看浏览器控制台错误
1. 打开浏览器开发者工具（F12）
2. 点击 "Connect Notion" 按钮
3. 检查 Console 标签页的错误信息
4. 检查 Network 标签页，查看 API 请求

---

## 📋 完整的 OAuth 流程

1. 用户点击 **"Connect Notion"** 按钮
2. 前端构建 OAuth URL 并跳转到 Notion 授权页面
3. 用户在 Notion 页面授权应用
4. Notion 回调到 `/api/notion/auth/callback?code=xxx&state=yyy`
5. 后端用 `code` 换取 `access_token`
6. 将 `access_token` 存储到数据库
7. 重定向回生成器页面，URL 包含 `?notion=connected`
8. 前端检测到 `notion=connected`，显示 **"已连接 Notion ✅"**
9. 用户点击 **"从 Notion 导入任务"**
10. 后端调用 Notion API 获取任务并返回

---

## ❗ 常见错误

### 错误：Notion Client ID not configured
**原因**：`NEXT_PUBLIC_NOTION_CLIENT_ID` 未设置
**解决**：在 `.env.local` 中添加该变量

### 错误：Notion OAuth credentials not configured
**原因**：`NOTION_CLIENT_SECRET` 未设置
**解决**：在 `.env.local` 中添加该变量

### 错误：Notion token exchange failed
**原因**：OAuth 流程中的某个步骤失败
**检查**：
1. Client ID 和 Secret 是否正确
2. Redirect URI 是否匹配 Notion 配置
3. 网络连接是否正常

### 错误：No task databases found
**原因**：Notion 工作区中没有包含 "task"、"todo"、"待办" 或 "任务" 的数据库
**解决**：在 Notion 中创建一个数据库，名称包含这些关键词

---

## 🎯 快速测试

1. **检查环境变量**：
   ```bash
   echo $NEXT_PUBLIC_NOTION_CLIENT_ID
   echo $NOTION_CLIENT_SECRET
   ```

2. **访问 Notion 授权页面**：
   手动构建 URL 并访问：
   ```
   https://api.notion.com/v1/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&owner=user&redirect_uri=YOUR_REDIRECT_URI&state=test123
   ```

3. **测试回调**：
   授权后会自动回调到你的应用，检查是否成功存储 token

---

## 📞 需要帮助？

如果问题依然存在，请提供：
1. 浏览器控制台的错误截图
2. 环境变量配置（隐藏密钥部分）
3. 数据库 schema 的 User 模型定义
4. Notion Integration 的权限设置截图
