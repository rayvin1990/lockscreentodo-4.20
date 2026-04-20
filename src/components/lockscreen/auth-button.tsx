"use client";

import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function AuthButton() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <SignedOut>
          <div className="flex gap-3">
            <button
              onClick={() => {
                window.location.href = `/${currentLang}/sign-in`;
              }}
              className="bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm shadow-lg"
            >
              Sign In
            </button>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl={`/${currentLang}`}
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </SignedIn>
      </div>
    </>
  );
}