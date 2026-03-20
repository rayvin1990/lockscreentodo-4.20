"use client";

import React from "react";
import { X, Crown, Check } from "lucide-react";
import { Dialog, DialogContent } from "@saasfly/ui/dialog";
import { PricingComparisonTable } from "~/components/pricing-comparison-table";
import { Button } from "@saasfly/ui/button";

interface UpgradeModalPricingProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "zh" | "en";
}

const MONTHLY_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL || "";
const LIFETIME_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL || "";

// Debug: Log URLs on module load (safe logging, no sensitive data)
console.log("🔗 UpgradeModalPricing URLs loaded:");
console.log(`  Monthly URL exists: ${!!MONTHLY_URL} (length: ${MONTHLY_URL.length})`);
console.log(`  Yearly URL exists: ${!!LIFETIME_URL} (length: ${LIFETIME_URL.length})`);

export function UpgradeModalPricing({ isOpen, onClose, lang = "en" }: UpgradeModalPricingProps) {
  // Force English for international users
  const forceLang = "en";

  const handleUpgrade = (variant: "monthly" | "lifetime") => {
    const checkoutUrl = variant === "monthly" ? MONTHLY_URL : LIFETIME_URL;

    // Debug: Check if URL is loaded (safe logging, no sensitive data)
    console.log(`🛒 Clicked ${variant} button`);
    console.log(`✓ URL exists: ${!!checkoutUrl}`);
    console.log(`✓ URL length: ${checkoutUrl?.length || 0}`);

    if (!checkoutUrl || checkoutUrl === "" || checkoutUrl.includes("your-product-id")) {
      alert("💳 Payment is being configured. Please try again later!");
      console.error("❌ Payment URL not configured");
      return;
    }

    console.log(`✅ Opening checkout page...`);
    window.open(checkoutUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-brand-card border-gray-700 text-white w-full mx-auto my-auto bottom-auto md:max-w-5xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="space-y-4 pt-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 text-amber-400 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
                <Crown className="w-5 h-5" />
                <span>Upgrade to Pro</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Unlock All Features
            </h2>
            <p className="text-gray-400">
              Choose the plan that works best for you
            </p>
          </div>

          {/* Main Content Grid: Left Info, Right Pricing */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Left Side: Content */}
            <div className="space-y-4">
              <PricingComparisonTable />

              <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">What You'll Get:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>All background styles (12+ premium designs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited image uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited font & color customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side: Pricing Cards */}
            <div className="flex flex-col gap-4">
            {/* Monthly Plan */}
            <div className="bg-brand-bg border-2 border-gray-700 hover:border-gray-600 rounded-2xl p-4 transition-all hover:scale-[1.02]">
              <div className="text-center space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Monthly Plan
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">$9.9</span>
                    <span className="text-gray-400">
                      /month
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 text-left text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>All background styles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited image uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited font/color customization</span>
                  </li>
                </ul>

                <Button
                  onClick={() => handleUpgrade("monthly")}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 font-semibold"
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  $9.9/month
                </Button>
              </div>
            </div>

            {/* Yearly Plan - Recommended */}
            <div className="bg-gradient-to-br from-brand-green/10 to-emerald-500/10 border-2 border-brand-green hover:border-brand-green rounded-2xl p-4 transition-all hover:scale-[1.02] relative shadow-lg shadow-brand-green/20">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-brand-green to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              </div>

              <div className="text-center space-y-3 mt-2">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Yearly Plan
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-brand-green">$59.9</span>
                    <span className="text-gray-400">
                      /year
                    </span>
                  </div>
                  <p className="text-xs text-brand-green font-semibold mt-1">
                    Save 45%
                  </p>
                </div>

                <ul className="space-y-2 text-left text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>All background styles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited image uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited font/color customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>1 year access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Free future updates</span>
                  </li>
                </ul>

                <Button
                  onClick={() => handleUpgrade("lifetime")}
                  className="w-full bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold shadow-lg shadow-brand-green/30"
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  $59.9/Year
                </Button>
              </div>
            </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center text-xs text-gray-500 pt-2">
            <p>
              🔒 Secure payment powered by Lemon Squeezy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
