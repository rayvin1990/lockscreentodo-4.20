"use client";

import React from "react";
import { X, Gift, Sparkles } from "lucide-react";

interface WelcomeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  trialEndsAt: string | null;
  daysRemaining: number;
}

export function WelcomeTrialModal({
  isOpen,
  onClose,
  trialEndsAt,
  daysRemaining,
}: WelcomeTrialModalProps) {
  if (!isOpen) return null;

  const trialEndDate = trialEndsAt
    ? new Date(trialEndsAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-card rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-green/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-brand-green to-emerald-600 p-6 rounded-2xl">
              <Gift className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Welcome! 🎉
        </h2>

        {/* Description */}
        <div className="space-y-4 mb-6">
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            You've received a <span className="text-brand-green font-bold">7-day free trial</span>
          </p>
          <p className="text-gray-400 text-center text-sm leading-relaxed">
            <Sparkles className="w-4 h-4 inline mr-1 text-brand-green" />
            Enjoy unlimited wallpaper generation
          </p>
        </div>

        {/* Trial Info Card */}
        <div className="bg-gradient-to-br from-brand-green/10 to-emerald-600/10 rounded-2xl p-6 mb-6 border border-brand-green/30">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Trial Status</span>
              <span className="text-brand-green font-bold text-lg">
                Active ✓
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Days Remaining</span>
              <span className="text-white font-bold text-lg">
                {daysRemaining} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Trial Ends</span>
              <span className="text-white font-semibold text-sm">
                {trialEndDate}
              </span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-brand-bg/50 rounded-2xl p-4 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3 text-center">What you get:</p>
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
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-brand-green mt-0.5">✓</span>
              <span>No watermarks or limitations</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-500 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-green/30 text-lg"
        >
          Start Creating Now →
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          After trial ends, upgrade to Pro to continue using all features
        </p>
      </div>
    </div>
  );
}
