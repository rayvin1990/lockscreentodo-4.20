# Fix: Vercel Build Error - getAuth() Expected 1-2 Arguments

## Symptom
Vercel deployment fails with TypeScript error:
```
./src/app/api/agent/devices/route.ts:10:28
Type error: Expected 1-2 arguments, but got 0.
```

But `npm run build` locally succeeds.

## Root Cause
Git仓库中的代码版本和本地代码不一致：
- git版本: `getAuth()` (无参数) - 错误版本
- 本地版本: `getAuth(req)` (有参数) - 正确版本

本地有未提交的修改，推送到git后Vercel才用正确版本构建成功。

## Files Changed
- `src/app/api/agent/devices/route.ts`

修复内容：
```typescript
// 错误
export async function POST(req: Request) {
  const { userId } = await getAuth();

// 正确
export async function POST(req: NextRequest) {
  const { userId } = await getAuth(req);
```

## Verification
1. 本地 `npm run build` 确保类型检查通过
2. `git diff <file>` 检查本地改动
3. `git show HEAD:<file>` 检查git仓库版本
4. 确保改动已 `git add` + `git commit` + `git push`

## Key Lesson
- 本地构建成功不等于git仓库代码正确
- 遇到 "Expected X arguments, but got 0" 但代码看起来有参数时，优先检查git版本
- Vercel用git仓库代码构建，不是本地代码

## Related
- [[2026-04-26-clerk-provider-missing-keyless-mode]]
