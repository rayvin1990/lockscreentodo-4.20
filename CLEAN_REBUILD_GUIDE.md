# Clerk 403 错误 - 完全清理和重建脚本（PowerShell 版本）

## 步骤 1：停止所有运行的服务

```
在终端中按 Ctrl + C 停止任何运行的服务（npm run dev 等）
```

---

## 步骤 2：删除所有缓存

在 PowerShell（管理员）中执行以下命令：

```powershell
# 进入项目目录
cd C:\Users\57684\saasfly

# 删除 .next 缓存
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 删除 node_modules\.cache
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# 删除 node_modules\.turbo
Remove-Item -Recurse -Force node_modules\.turbo -ErrorAction SilentlyContinue

# 删除 .vercel 缓存
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# 可选：删除 node_modules（如果需要完全重建）
# Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
```

---

## 步骤 3：重新安装依赖

```powershell
bun install
# 或
npm install
```

---

## 步骤 4：提交并推送

```powershell
git add apps/nextjs/src/app/layout.tsx
git commit -m "chore: Clean all caches and rebuild"
git push
```

---

## 步骤 5：在 Vercel 添加环境变量

1. 登录 https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加：
   ```
   Name: NEXT_PUBLIC_CLERK_DISABLE_AUTO_DETECT
   Value: true
   ```
5. 保存

---

## 步骤 6：验证

1. 等待 Vercel 部署完成（5-10 分钟）
2. 清除浏览器缓存（Ctrl + Shift + Delete）
3. 无痕模式访问 https://www.lockscreentodo.com
4. 按 F12 → Network 检查是否还有 `clerk.lockscreentodo.com` 请求

---

## ✅ 预期结果

### 修复前
```
Network: GET https://clerk.lockscreentodo.com/npm/... 403
Console: Failed to load Clerk
UI: Loading 卡住
```

### 修复后
```
Network: GET https://relative-goblin-94.clerk.accounts.dev/npm/... 200
Console: Clerk initialized successfully
UI: 用户面板正常显示
```

---

## 🚨 如果清理后还是不行

尝试降级 Clerk SDK：

```powershell
# 编辑 package.json
# 将 "@clerk/nextjs": "^6.20.0" 改为 "@clerk/nextjs": "^5.17.0"

# 重新安装
bun install

# 重新部署
git push
```

---

## 📞 需要帮助？

提供：
1. Network 面板截图（F12，过滤 `clerk`）
2. Console 错误截图
3. Vercel 部署日志
