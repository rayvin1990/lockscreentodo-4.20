"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";

export default function DebugClerkPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const [debugInfo, setDebugInfo] = useState({
    envVars: {},
    clerkStatus: {},
    error: null,
  });

  useEffect(() => {
    // 收集环境变量信息
    const envVars = {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };

    // 收集 Clerk 状态
    const clerkStatus = {
      isLoaded,
      userId,
      userExists: !!user,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
    };

    setDebugInfo({
      envVars,
      clerkStatus,
      error: null,
    });

    // 检查是否有 Clerk 加载错误
    if (typeof window !== "undefined" && window.clerkDebug) {
      setDebugInfo((prev) => ({
        ...prev,
        error: window.clerkDebug.error || null,
      }));
    }
  }, [isLoaded, userId, user]);

  const getKeyStatus = (key: string | undefined) => {
    if (!key) return { text: "❌ 未配置", color: "text-red-500" };
    if (key.startsWith("pk_test_")) return { text: "⚠️ 测试密钥 (pk_test)", color: "text-yellow-500" };
    if (key.startsWith("pk_live_")) return { text: "✅ 生产密钥 (pk_live)", color: "text-green-500" };
    return { text: "❓ 未知格式", color: "text-orange-500" };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🔍 Clerk 诊断工具
        </h1>

        {/* 环境变量检查 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            1. 环境变量检查
          </h2>

          <div className="space-y-4">
            {/* Clerk Publishable Key */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-yellow-300">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                </span>
                <span className={`text-sm font-semibold ${getKeyStatus(debugInfo.envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).color}`}>
                  {getKeyStatus(debugInfo.envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).text}
                </span>
              </div>
              <div className="bg-gray-900 rounded p-3 font-mono text-sm break-all">
                {debugInfo.envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) || "(未设置)"}...
              </div>
            </div>

            {/* 其他环境变量 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-yellow-300">
                  NODE_ENV
                </span>
                <span className="text-sm text-gray-400">
                  {debugInfo.envVars.NODE_ENV || "(未设置)"}
                </span>
              </div>
            </div>

            <div className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-yellow-300">
                  NEXT_PUBLIC_APP_URL
                </span>
                <span className="text-sm text-gray-400">
                  {debugInfo.envVars.NEXT_PUBLIC_APP_URL || "(未设置)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clerk 状态检查 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            2. Clerk 加载状态
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">isLoaded</span>
              <span className={`font-semibold ${debugInfo.clerkStatus.isLoaded ? "text-green-500" : "text-red-500"}`}>
                {debugInfo.clerkStatus.isLoaded ? "✅ true" : "❌ false (Clerk 未加载)"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">userId</span>
              <span className="font-mono text-sm text-gray-400">
                {debugInfo.clerkStatus.userId || "未登录"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">user</span>
              <span className={`font-semibold ${debugInfo.clerkStatus.userExists ? "text-green-500" : "text-gray-500"}`}>
                {debugInfo.clerkStatus.userExists ? "✅ 已加载" : "未登录"}
              </span>
            </div>

            {debugInfo.clerkStatus.userEmail && (
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-300">userEmail</span>
                <span className="font-mono text-sm text-gray-400">
                  {debugInfo.clerkStatus.userEmail}
                </span>
              </div>
            )}

            {debugInfo.clerkStatus.userName && (
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-300">userName</span>
                <span className="font-mono text-sm text-gray-400">
                  {debugInfo.clerkStatus.userName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 诊断结果 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            3. 诊断结果
          </h2>

          <div className="space-y-4">
            {!debugInfo.envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <p className="text-red-300 font-semibold mb-2">❌ 关键问题：未配置 Clerk 密钥</p>
                <p className="text-gray-300 text-sm">
                  请在 Vercel 中配置 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 环境变量
                </p>
              </div>
            )}

            {debugInfo.envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_") && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-300 font-semibold mb-2">⚠️ 警告：使用了测试密钥</p>
                <p className="text-gray-300 text-sm">
                  生产环境应该使用 pk_live_ 开头的密钥，而不是 pk_test_
                </p>
              </div>
            )}

            {!debugInfo.clerkStatus.isLoaded && debugInfo.envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_") && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <p className="text-red-300 font-semibold mb-2">❌ 关键问题：Clerk 无法加载</p>
                <p className="text-gray-300 text-sm mb-3">
                  环境变量已配置为生产密钥，但 Clerk 仍然无法加载。可能的原因：
                </p>
                <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
                  <li>Vercel 环境变量配置后未重新部署</li>
                  <li>Clerk Dashboard 中的应用配置有误</li>
                  <li>域名未在 Clerk Dashboard 中配置</li>
                  <li>浏览器控制台有错误信息（请检查 F12）</li>
                </ul>
              </div>
            )}

            {debugInfo.clerkStatus.isLoaded && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <p className="text-green-300 font-semibold mb-2">✅ Clerk 加载成功</p>
                <p className="text-gray-300 text-sm">
                  Clerk 已成功初始化。如果你看到这个页面，说明首页的 loading 问题可能是其他原因。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 控制台错误 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            4. 浏览器控制台检查
          </h2>

          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-300 mb-2">👉 请按 F12 打开浏览器控制台，查看是否有以下错误：</p>
            <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
              <li>Clerk 相关的错误（红色文字）</li>
              <li>网络请求失败（Network 标签页）</li>
              <li>任何关于 clerk.accounts.dev 的错误</li>
            </ul>
          </div>
        </div>

        {/* 解决方案 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">
            5. 快速解决方案
          </h2>

          <div className="space-y-3 text-sm">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">方案 1：重新部署 Vercel</p>
              <p className="text-gray-400">
                Vercel Dashboard → Deployments → 最新部署 → 点击 "Redeploy"
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">方案 2：检查 Clerk Dashboard 域名设置</p>
              <p className="text-gray-400">
                Clerk Dashboard → 你的应用 → Domains → 确保添加了你的生产域名
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">方案 3：清除浏览器缓存</p>
              <p className="text-gray-400">
                按 Ctrl+Shift+Delete 清除缓存，或使用无痕模式访问
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
