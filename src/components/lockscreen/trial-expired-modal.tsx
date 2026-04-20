"use client";

import React from "react";
import { X, Sparkles, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";

interface TrialExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysUsed: number;
  lang?: string;
}

const LIFETIME_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL || "";

export function TrialExpiredModal({
  isOpen,
  onClose,
  daysUsed,
  lang = "en"
}: TrialExpiredModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (!LIFETIME_URL || LIFETIME_URL.includes("your-product-id")) {
      alert("Payment is being configured. Please try again later!");
      return;
    }

    window.open(LIFETIME_URL, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gradient-to-br from-brand-card to-gray-900 border border-gray-700 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-brand-green" fill="currentColor" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Thank You for Trying
            </h2>
            <p className="text-gray-400 text-sm">
              You've used your {daysUsed}-day free trial
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-4 space-y-3 text-left">
            <p className="text-gray-300 text-sm leading-relaxed">
              🌸 Your 7-day free trial has ended. Upgrade to Pro to continue enjoying:
            </p>

            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <span>
                  Unlimited wallpaper generation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <span>
                  Access to premium backgrounds & styles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <span>
                  Share with your loved ones
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-3 border-2 border-brand-green/30">
              <div className="text-brand-green font-bold text-lg">$9.9</div>
              <div className="text-gray-400 text-xs">month</div>
            </div>

            <div className="bg-gradient-to-br from-brand-green/20 to-emerald-500/20 rounded-xl p-3 border-2 border-brand-green">
              <div className="relative">
                <div className="text-brand-green font-bold text-lg">$59.9</div>
                <div className="text-gray-300 text-xs">Yearly</div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 45%
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-brand-green hover:bg-emerald-500 text-white font-bold py-4 text-base rounded-xl shadow-lg shadow-brand-green/30 transition-all hover:scale-105"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Upgrade to Pro Now
          </Button>

          <p className="text-xs text-gray-500">
            💚 One purchase, unlimited joy. Thank you for your support!
          </p>
        </div>
      </div>
    </div>
  );
}