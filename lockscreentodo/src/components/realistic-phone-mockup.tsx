"use client";

import React, { useRef, forwardRef } from "react";

interface RealisticPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  onScreenMouseEnter?: () => void;
  onScreenMouseLeave?: () => void;
}

export const RealisticPhoneMockup = forwardRef<HTMLDivElement, RealisticPhoneMockupProps>(
  ({ children, className = "", onScreenMouseEnter, onScreenMouseLeave }, ref) => {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-50" />

          <div className="relative h-full w-full bg-black rounded-[2.5rem] overflow-hidden">
            <div
              ref={ref}
              className="relative h-full w-full overflow-hidden rounded-[2.3rem]"
              onMouseEnter={onScreenMouseEnter}
              onMouseLeave={onScreenMouseLeave}
            >
              {children}

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none rounded-[2.3rem]" />
            </div>

            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-12 h-4 bg-gray-900/80 rounded-full flex items-center justify-end pr-2">
                <div className="w-2 h-2 bg-blue-900/60 rounded-full border border-blue-800/40" />
              </div>
            </div>

            <div className="absolute inset-[3px] rounded-[2.2rem] border border-white/10 pointer-events-none" />

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-20" />
          </div>

          <div className="absolute right-[-2px] top-32 w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-r-sm" />
          <div className="absolute right-[-2px] top-52 w-1 h-24 bg-gradient-to-b from-gray-600 to-gray-700 rounded-r-sm" />
          <div className="absolute right-[-2px] top-80 w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-r-sm" />

          <div className="absolute right-[-3px] top-52 w-1 h-24 bg-black/40 rounded-r-sm blur-[1px]" />

          <div className="absolute inset-0 rounded-[3rem] border border-white/10 pointer-events-none" />
          <div className="absolute inset-0 rounded-[3rem] border border-black/20 pointer-events-none" />

          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent rounded-t-[3rem] pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent rounded-b-[3rem] pointer-events-none" />
        </div>
      </div>
    );
  }
);

RealisticPhoneMockup.displayName = "RealisticPhoneMockup";