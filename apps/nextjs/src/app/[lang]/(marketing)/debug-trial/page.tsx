"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function DebugTrialPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [trialStatus, setTrialStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/generate/check-limit");
        const data = await response.json();
        setTrialStatus(data);
      } catch (error) {
        console.error("Error:", error);
        setTrialStatus({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  const resetLocalStorage = () => {
    localStorage.removeItem('trial_welcome_shown');
    alert('localStorage 已清除！请刷新 generator 页面');
  };

  const showWelcomeModal = () => {
    window.dispatchEvent(new CustomEvent('show-welcome-modal'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">试用期调试工具</h1>

        {/* Auth Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">认证状态</h2>
          <div className="space-y-2">
            <p><strong>isLoaded:</strong> {isLoaded ? '✅ 是' : '❌ 否'}</p>
            <p><strong>isSignedIn:</strong> {isSignedIn ? '✅ 是' : '❌ 否'}</p>
          </div>
        </div>

        {/* Trial Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">试用状态</h2>
          {loading ? (
            <p>加载中...</p>
          ) : (
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
              {JSON.stringify(trialStatus, null, 2)}
            </pre>
          )}
        </div>

        {/* localStorage Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">localStorage 状态</h2>
          <p className="mb-4">
            <strong>trial_welcome_shown:</strong>{' '}
            {localStorage.getItem('trial_welcome_shown') || '(未设置)'}
          </p>
          <button
            onClick={resetLocalStorage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            清除 localStorage 标记
          </button>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="space-y-4">
            <a
              href="/generator"
              className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center"
            >
              跳转到 Generator 页面（查看是否弹窗）
            </a>
            <button
              onClick={showWelcomeModal}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              手动触发欢迎弹窗（测试）
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mt-6 border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-semibold mb-4">调试步骤</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>检查上面的"认证状态"是否为 ✅</li>
            <li>检查"试用状态"中的 isPro 和 daysRemaining</li>
            <li>点击"清除 localStorage 标记"按钮</li>
            <li>点击"跳转到 Generator 页面"</li>
            <li>应该会自动弹出欢迎弹窗</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
