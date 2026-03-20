"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function TestAuthPage() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        Clerk Auth Test Page
      </h1>

      <div className="space-y-4">
        {/* 测试 1：SignedOut 组件内的按钮 */}
        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl text-white mb-4">Test 1: SignInButton</h2>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">
                Sign In (Clerk Modal)
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* 测试 2：UserButton */}
        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl text-white mb-4">Test 2: UserButton</h2>
          <SignedIn>
            <UserButton afterSignOutUrl={`/${currentLang}/test-auth`} />
          </SignedIn>
          <SignedOut>
            <p className="text-gray-400">Not signed in</p>
          </SignedOut>
        </div>

        {/* 测试 3：简单的条件渲染 */}
        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl text-white mb-4">Test 3: Conditional Rendering</h2>
          <SignedOut>
            <p className="text-green-400">✓ You are signed OUT</p>
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg">
              Click to Sign In
            </button>
          </SignedOut>
          <SignedIn>
            <p className="text-blue-400">✓ You are signed IN</p>
          </SignedIn>
        </div>

        {/* 返回链接 */}
        <div className="mt-8">
          <a
            href={`/${currentLang}/lockscreen-generator`}
            className="text-blue-400 underline"
          >
            ← Back to Lockscreen Generator
          </a>
        </div>
      </div>
    </div>
  );
}
