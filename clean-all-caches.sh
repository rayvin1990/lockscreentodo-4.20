#!/bin/bash
# Clerk 403 错误 - 完全清理和重建脚本

echo "====================================="
echo "🧹 开始完全清理和重建"
echo "====================================="
echo ""

# 进入项目目录
cd C:\Users\57684\saasfly

echo "📂 步骤 1/5: 停止所有运行的服务..."
echo "请按 Ctrl + C 停止任何运行的服务（npm run dev 等）"
echo ""
read -p "按 Enter 继续..."

echo ""
echo "🗑️  步骤 2/5: 删除 .next 缓存..."
if (Test-Path .next) {
    echo "  ✅ 删除 .next"
    Remove-Item -Recurse -Force .next
} else {
    echo "  ⏭️  .next 不存在，跳过"
}

echo ""
echo "🗑️  步骤 3/5: 删除 node_modules/.cache..."
if (Test-Path node_modules\.cache) {
    echo "  ✅ 删除 node_modules/.cache"
    Remove-Item -Recurse -Force node_modules\.cache
} else {
    echo "  ⏭️  node_modules/.cache 不存在，跳过"
}

echo ""
echo "🗑️  步骤 4/5: 删除 node_modules\.turbo..."
if (Test-Path node_modules\.turbo) {
    echo "  ✅ 删除 node_modules\.turbo"
    Remove-Item -Recurse -Force node_modules\.turbo
} else {
    echo "  ⏭️  node_modules\.turbo 不存在，跳过"
}

echo ""
echo "🗑️  步骤 5/5: 删除 .vercel 缓存..."
if (Test-Path .vercel) {
    echo "  ✅ 删除 .vercel"
    Remove-Item -Recurse -Force .vercel
} else {
    echo "  ⏭️  .vercel 不存在，跳过"
}

echo ""
echo "====================================="
echo "✅ 缓存清理完成！"
echo "====================================="
echo ""
echo "📋 下一步："
echo ""
echo "1. 重新安装依赖："
echo "   bun install"
echo "   或"
echo "   npm install"
echo ""
echo "2. 提交代码并推送："
echo "   git add ."
echo "   git commit -m 'chore: Clean all caches'"
echo "   git push"
echo ""
echo "3. 在 Vercel Dashboard 添加环境变量："
echo "   NEXT_PUBLIC_CLERK_DISABLE_AUTO_DETECT=true"
echo ""
echo "====================================="
