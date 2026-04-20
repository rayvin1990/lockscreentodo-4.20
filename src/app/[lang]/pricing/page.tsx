"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Crown, Check, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UpgradeModalPricing } from "~/components/lockscreen/upgrade-modal-pricing";

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Crown className="w-4 h-4" />
            <span>Upgrade to Pro</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Unlock All Features
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that works best for you. Start with a 7-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-brand-card border-2 border-gray-700 hover:border-gray-600 rounded-3xl p-8 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Monthly Plan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$9.9</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>All background styles</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>Unlimited image uploads</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>Unlimited font/color customization</span>
              </li>
            </ul>

            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 font-semibold"
              size="lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              $9.9/month
            </Button>
          </div>

          {/* Yearly Plan */}
          <div className="bg-gradient-to-br from-brand-green/10 to-emerald-500/10 border-2 border-brand-green hover:border-brand-green rounded-3xl p-8 transition-all relative shadow-lg shadow-brand-green/20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-brand-green to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                MOST POPULAR - Save 45%
              </div>
            </div>

            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold text-white mb-2">Yearly Plan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-brand-green">$59.9</span>
                <span className="text-gray-400">/year</span>
              </div>
              <p className="text-xs text-brand-green font-semibold mt-1">
                Equivalent to $4.99/month
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>All background styles</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>Unlimited image uploads</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>Unlimited font/color customization</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>1 year access</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                <span>Free future updates</span>
              </li>
            </ul>

            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold shadow-lg shadow-brand-green/30"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              $59.9/Year
            </Button>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>7-day free trial included with both plans</p>
          <p className="mt-2">Cancel anytime, no questions asked</p>
        </div>
      </div>

      <UpgradeModalPricing
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        lang="en"
      />
    </div>
  );
}
