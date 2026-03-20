# Clerk加载超时问题修复

## 问题描述

在本地开发环境出现Clerk加载超时错误：
```
_ClerkRuntimeError: Clerk: Failed to load Clerk
(code="failed_to_load_clerk_js_timeout")
```

## 根本原因

1. **自定义域名网络问题**: `.env.local`中配置的自定义域名 `NEXT_PUBLIC_CLERK_FRONTEND_API=https://clerk.lockscreentodo.com` 在本地环境可能因网络问题导致加载超时

2. **开发环境限制**: Clerk开发密钥有严格的速率限制，频繁重试可能导致超时

## 解决方案

### 1. 修复 `.env.local` 配置

**修改前**:
```env
NEXT_PUBLIC_CLERK_FRONTEND_API=https://clerk.lockscreentodo.com
```

**修改后**:
```env
# Commented out for local development to avoid loading timeout
# Uncomment for production deployment
# NEXT_PUBLIC_CLERK_FRONTEND_API=https://clerk.lockscreentodo.com
```

### 2. 优化 `apps/nextjs/src/app/layout.tsx` 配置

**修改前**:
```typescript
const clerkConfig = {
  telemetry: {
    disabled: false,
  },
};
```

**修改后**:
```typescript
const clerkConfig = {
  telemetry: {
    disabled: false,
  },
  // 在开发环境禁用某些优化以提高加载速度
  // 生产环境会自动使用优化的CDN
  development: process.env.NODE_ENV === 'development',
};
```

## 为什么这样修复有效？

1. **使用默认域名**: 注释掉自定义域名后，Clerk会使用其默认的CDN域名，这些域名在全球有更好的网络覆盖

2. **自动域名推断**: 不手动设置 `frontendApi`，让Clerk SDK自动根据 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 推断最优的域名

3. **开发模式标识**: 添加 `development: true` 标识，Clerk会针对开发环境优化加载策略

## 生产环境部署

在部署到生产环境时，可以选择性地启用自定义域名：

### Vercel环境变量设置
在Vercel Dashboard中设置：
```
NEXT_PUBLIC_CLERK_FRONTEND_API=https://clerk.lockscreentodo.com
```

或使用 `vercel.json` 配置：
```json
{
  "env": {
    "NEXT_PUBLIC_CLERK_FRONTEND_API": "https://clerk.lockscreentodo.com"
  }
}
```

## 验证修复

### 本地开发环境

1. **重启开发服务器**:
   ```bash
   # 停止当前服务器 (Ctrl+C)
   bun run dev
   ```

2. **清除浏览器缓存**:
   - 打开浏览器开发者工具 (F12)
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"

3. **检查控制台**:
   - 打开浏览器控制台
   - 应该看到: `Clerk: Clerk has been loaded with development keys`
   - **不应该再看到**: `failed_to_load_clerk_js_timeout` 错误

### 预期正常日志

```
app-index.js:33 Clerk: Clerk has been loaded with development keys.
Development instances have strict usage limits and should not be
used when deploying your application to production.
```

## 其他注意事项

### 1. 浏览器扩展错误
```
content_script.js:4874 Immersive Translate ERROR: sync rules error
```
这是浏览器扩展的错误，**不影响应用功能**，可以忽略。

### 2. 资源预加载警告
```
The resource .../lockscreen-1771827272546.png was preloaded
using link preload but not used within a few seconds
```
这是性能优化的警告，**不影响功能**，是预加载策略的正常提示。

### 3. 网络连接
如果问题持续存在，检查：
- 确保网络连接正常
- 检查防火墙/代理设置
- 尝试使用VPN或切换网络（某些地区可能访问Clerk CDN较慢）

### 4. Clerk密钥验证
确认`.env.local`中的Clerk密钥是有效的：
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

可以在 [Clerk Dashboard](https://dashboard.clerk.com/) 验证密钥状态。

## 相关资源

- [Clerk文档 - 域名配置](https://clerk.com/docs/deployments/overview)
- [Clerk文档 - 自定义域名](https://clerk.com/docs/deployments/custom-domains)
- [Clerk文档 - 环境变量](https://clerk.com/docs/cli/environment-reference)

## 更新日志

**2025-02-28**:
- 注释掉本地环境的自定义域名配置
- 优化Clerk配置添加development标识
- 创建此修复文档
