"use client";

import React from "react";
import { X, Sparkles, Heart } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysSinceExpired?: number;
  lang?: string;
}

const LIFETIME_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL || "";

export function UpgradeModal({ isOpen, onClose, daysSinceExpired = 0, lang = 'en' }: UpgradeModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (!LIFETIME_URL || LIFETIME_URL.includes("your-product-id")) {
      alert("Payment is being configured. Please try again later!");
      return;
    }

    window.open(LIFETIME_URL, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-card rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-green/20 blur-2xl rounded-full" />
            <div className="relative bg-gradient-to-br from-brand-green to-emerald-600 p-4 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Trial Ended 💫
        </h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-300 text-center leading-relaxed">
            Your <span className="text-brand-green font-semibold">7-day Pro trial</span> has ended
            {daysSinceExpired > 0 && ` ${daysSinceExpired} days ago`}
          </p>
          <p className="text-gray-400 text-center text-sm leading-relaxed">
            <Heart className="w-4 h-4 inline mr-1 text-red-400" />
            Upgrade to keep your family safe and organized
          </p>
        </div>

        <div className="bg-brand-bg/50 rounded-2xl p-4 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3 text-center">Pro Features:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-brand-green mt-0.5">✓</span>
              <span>Unlimited wallpaper generation</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-brand-green mt-0.5">✓</span>
              <span>All premium fonts and styles</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-brand-green mt-0.5">✓</span>
              <span>Priority access to new features</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-500 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-green/30"
          >
            Upgrade to Pro →
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl transition-all"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          $9.9/month or $59.9/year
        </p>
      </div>
    </div>
  );
}