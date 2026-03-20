#!/bin/bash
# 系统诊断脚本 - Lockscreen Todo
# 用于排查 loading、登录、Cloudflare 等所有问题

echo "====================================="
echo "🔍 开始系统诊断"
echo "====================================="
echo ""

# 1. 检查环境变量
echo "📋 检查环境变量..."
if [ ! -f ".env.local" ]; then
  echo "❌ .env.local 不存在"
else
  echo "✅ .env.local 存在"

  # 检查关键变量
  if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local; then
    echo "✅ CLERK_PUBLISHABLE_KEY 已配置"
  else
    echo "❌ 缺少: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  fi

  if grep -q "CLERK_SECRET_KEY" .env.local; then
    echo "✅ CLERK_SECRET_KEY 已配置"
  else
    echo "❌ 缺少: CLERK_SECRET_KEY"
  fi

  if grep -q "DATABASE_URL" .env.local; then
    echo "✅ DATABASE_URL 已配置"
  else
    echo "❌ 缺少: DATABASE_URL"
  fi
fi
echo ""

# 2. 检查关键文件
echo "📂 检查关键文件..."

files_to_check=(
  "apps/nextjs/src/app/layout.tsx"
  "apps/nextjs/src/app/generator/page.tsx"
  "apps/nextjs/src/components/notion-auth-button.tsx"
  "apps/nextjs/src/app/api/notion/auth/callback/route.ts"
)

for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ 缺少: $file"
  fi
done
echo ""

# 3. 检查 Cloudflare DNS（需要手动）
echo "🌐 Cloudflare DNS 检查清单"
echo "请确认以下配置："
echo ""
echo "1. DNS 记录："
echo "   - Type: CNAME"
echo "   - Name: @"
echo "   - Target: cname.vercel-dns.com"
echo "   - Proxy: ☁️ Proxied (橙色云)"
echo ""
echo "   - Type: CNAME"
echo "   - Name: www"
echo "   - Target: cname.vercel-dns.com"
echo "   - Proxy: ☁️ Proxied (橙色云)"
echo ""
echo "2. SSL/TLS 设置："
echo "   - 模式: Flexible"
echo ""
echo "3. Security 设置："
echo "   - Security Level: Low 或 Essentially Off"
echo "   - Bot Fight Mode: 关闭"
echo "   - Under Attack Mode: 关闭"
echo ""

# 4. 检查 Notion 配置
echo "📝 Notion OAuth 配置检查"

if grep -q "NEXT_PUBLIC_NOTION_CLIENT_ID" .env.local 2>/dev/null; then
  echo "✅ NOTION_CLIENT_ID 已配置"
else
  echo "⚠️  警告: NOTION_CLIENT_ID 未配置（如果不用 Notion 可忽略）"
fi

if grep -q "NOTION_CLIENT_SECRET" .env.local 2>/dev/null; then
  echo "✅ NOTION_CLIENT_SECRET 已配置"
else
  echo "⚠️  警告: NOTION_CLIENT_SECRET 未配置（如果不用 Notion 可忽略）"
fi

if grep -q "NOTION_REDIRECT_URI" .env.local 2>/dev/null; then
  REDIRECT_URI=$(grep "NOTION_REDIRECT_URI" .env.local | cut -d'=' -f2)
  echo "✅ NOTION_REDIRECT_URI: $REDIRECT_URI"
  echo ""
  echo "⚠️  请确保在 Notion 中添加此 Redirect URI"
else
  echo "⚠️  警告: NOTION_REDIRECT_URI 未配置"
fi
echo ""

# 5. 常见问题诊断
echo "🐛 常见问题诊断"

echo "问题 1: 页面卡在 loading"
echo "可能原因:"
echo "  - Clerk 初始化失败（API keys 错误）"
echo "  - useEffect 无限循环"
echo "  - 数据库连接失败"
echo "解决:"
echo "  - 检查浏览器控制台（F12）错误"
echo "  - 检查 Vercel 环境变量是否正确"
echo "  - 重启开发服务器"
echo ""

echo "问题 2: Cloudflare 拦截"
echo "可能原因:"
echo "  - Security Level 太高"
echo "  - Bot Fight Mode 开启"
echo "  - SSL/TLS 模式冲突"
echo "解决:"
echo "  - Security Level 改为 Low"
echo "  - 关闭 Bot Fight Mode"
echo "  - SSL/TLS 改为 Flexible"
echo ""

echo "问题 3: Notion OAuth 失败"
echo "可能原因:"
echo "  - redirect_uri_mismatch"
echo "  - Client ID 错误"
echo "  - Secret 错误"
echo "解决:"
echo "  - 在 Notion 添加正确的 Redirect URI"
echo "  - 检查环境变量是否匹配"
echo "  - 本地测试后再部署"
echo ""

# 6. 下一步行动
echo "====================================="
echo "🎯 修复优先级"
echo "====================================="
echo ""
echo "P0 - 最高优先级（立即修复）："
echo "  1. 检查并修复 Cloudflare DNS 配置"
echo "  2. 降低 Cloudflare Security Level"
echo "  3. 关闭 Bot Fight Mode"
echo "  4. 检查 Vercel 环境变量（Clerk API）"
echo ""
echo "P1 - 高优先级（今天完成）："
echo "  5. 在 Notion 添加正确的 Redirect URI"
echo "  6. 本地测试完整流程"
echo "  7. 检查浏览器控制台错误"
echo ""
echo "P2 - 中优先级（本周完成）："
echo "  8. 添加法律文档（Privacy Policy, Terms）"
echo "  9. 优化 UI/UX"
echo "  10. 添加使用分析"
echo ""

echo "====================================="
echo "📞 需要帮助？"
echo "====================================="
echo ""
echo "如果以上步骤无法解决问题，提供："
echo "1. 浏览器控制台错误截图（F12）"
echo "2. Cloudflare DNS 配置截图"
echo "3. Vercel 环境变量截图（隐藏密钥）"
echo "4. Vercel 部署日志"
echo ""
