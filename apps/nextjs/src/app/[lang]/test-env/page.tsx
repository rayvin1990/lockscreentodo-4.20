"use client";

import { useEffect, useState } from "react";

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, any>>({});

  useEffect(() => {
    // 检查客户端环境变量（NEXT_PUBLIC_ 开头的）
    const clientEnv = {
      // 应用 URL
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

      // Lemon Squeezy
      LEMON_MONTHLY_URL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL,
      LEMON_LIFETIME_URL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL,

      // Clerk
      CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

      // 其他
      NODE_ENV: process.env.NODE_ENV,
    };

    setEnvVars(clientEnv);
  }, []);

  const getStatus = (value: any) => {
    if (!value) return { text: "❌ 未配置", color: "text-red-500" };
    if (value.includes("localhost")) return { text: "⚠️ 使用本地 URL", color: "text-yellow-500" };
    if (value.includes("your-product-id")) return { text: "⚠️ 占位符", color: "text-yellow-500" };
    return { text: "✅ 已配置", color: "text-green-500" };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🔍 环境变量检查工具
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            当前环境
          </h2>
          <div className="space-y-2">
            <p>📦 Node 环境: <span className="text-yellow-400">{process.env.NODE_ENV}</span></p>
            <p>🌐 当前 URL: <span className="text-blue-400">{typeof window !== 'undefined' ? window.location.href : 'SSR'}</span></p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            环境变量状态
          </h2>

          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => {
              const status = getStatus(value);
              const isSecret = key.includes("SECRET") || key.includes("KEY");
              const displayValue = isSecret ? "*** (已隐藏)" : value;

              return (
                <div key={key} className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-yellow-300">{key}</span>
                    <span className={`text-sm font-semibold ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <div className="bg-gray-900 rounded p-3 font-mono text-sm break-all">
                    {displayValue || "(未设置)"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            快速测试
          </h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2">测试 Lemon Squeezy 月付链接：</p>
              <button
                onClick={() => {
                  const url = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL;
                  if (url && !url.includes("your-product-id")) {
                    window.open(url, "_blank");
                  } else {
                    alert("❌ 月付 URL 未配置或为占位符");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                🚀 打开月付支付页面
              </button>
            </div>

            <div>
              <p className="mb-2">测试 Lemon Squeezy 年付链接：</p>
              <button
                onClick={() => {
                  const url = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL;
                  if (url && !url.includes("your-product-id")) {
                    window.open(url, "_blank");
                  } else {
                    alert("❌ 年付 URL 未配置或为占位符");
                  }
                }}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                🚀 打开年付支付页面
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            常见问题
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-yellow-300">Q: 为什么显示"未配置"？</p>
              <p className="text-gray-300">A: 环境变量没有在 Vercel Dashboard 中设置，或者没有添加到 Production 环境</p>
            </div>

            <div>
              <p className="font-semibold text-yellow-300">Q: 为什么显示"使用本地 URL"？</p>
              <p className="text-gray-300">A: 环境变量在本地使用 localhost，需要改为生产域名</p>
            </div>

            <div>
              <p className="font-semibold text-yellow-300">Q: 如何修复？</p>
              <p className="text-gray-300">A: 访问 Vercel Dashboard → Settings → Environment Variables，添加缺失的环境变量并选择 Production 环境，然后重新部署</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
