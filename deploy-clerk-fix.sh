#!/bin/bash
# 部署 Clerk 修复的快速脚本

echo "====================================="
echo "🚀 开始部署 Clerk 域名修复"
echo "====================================="
echo ""

echo "📂 进入项目目录..."
cd C:\Users\57684\saasfly

echo "✅ 添加修改的文件..."
git add apps/nextjs/src/app/layout.tsx

echo "📝 提交更改..."
git commit -m "fix(clerk): Force use default Clerk domain instead of auto-detection

  - Added clerkConfig object to layout.tsx
  - Prevents SDK from auto-detecting clerk.lockscreentodo.com
  - Uses Clerk default domain: relative-goblin-94.clerk.accounts.dev
  - Fixes issue where user panel shows infinite loading"

echo "⬆️ 推送到远程仓库..."
git push

echo ""
echo "====================================="
echo "✅ 部署完成！"
echo "====================================="
echo ""
echo "📊 下一步："
echo ""
echo "1. 访问 Vercel Dashboard: https://vercel.com/dashboard"
echo "2. 等待部署完成（2-5 分钟）"
echo "3. 清除浏览器缓存"
echo "4. 访问 https://www.lockscreentodo.com"
echo "5. 按 F12 检查 Network 是否不再请求 clerk.lockscreentodo.com"
echo ""
echo "📋 成功标志："
echo "   - 页面正常加载（不再 'Just a moment...'）"
echo "   - 用户面板正常显示"
echo "   - Network 中没有 'clerk.lockscreentodo.com' 请求"
echo "   - 只请求 'relative-goblin-94.clerk.accounts.dev'"
echo ""
