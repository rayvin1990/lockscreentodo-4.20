"use client";

import React from "react";
import { ShoppingCart, Crown } from "lucide-react";
import { Button } from "@saasfly/ui/button";

interface LemonSqueezyButtonProps {
  variant?: "monthly" | "lifetime" | "default";
  className?: string;
  lang?: "zh" | "en";
  size?: "default" | "sm" | "lg";
}

const MONTHLY_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL || "";
const LIFETIME_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL || "";

export function LemonSqueezyButton({
  variant = "default",
  className = "",
  lang = "en",
  size = "default"
}: LemonSqueezyButtonProps) {

  const handleClick = () => {
    // Determine which URL to use based on variant
    let checkoutUrl = "";

    if (variant === "monthly") {
      checkoutUrl = MONTHLY_URL;
    } else if (variant === "lifetime") {
      checkoutUrl = LIFETIME_URL;
    } else {
      // Default: use lifetime as default option
      checkoutUrl = LIFETIME_URL;
    }

    if (!checkoutUrl || checkoutUrl.includes("your-product-id")) {
      alert("💳 Payment is being configured. Please try again later!");
      console.error("❌ Lemon Squeezy checkout URL not configured");
      return;
    }

    console.log("🚀 Opening checkout URL:", checkoutUrl);
    window.open(checkoutUrl, "_blank");
  };

  // 默认按钮样式
  if (variant === "default") {
    return (
      <Button
        onClick={handleClick}
        className={`bg-brand-green hover:bg-emerald-500 text-white font-semibold ${className}`}
        size={size}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {lang === "zh" ? "升级 Pro 版" : "Upgrade to Pro"}
      </Button>
    );
  }

  // 月费版本 - 更新为 $9.9
  if (variant === "monthly") {
    return (
      <Button
        onClick={handleClick}
        className={`bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 ${className}`}
        size={size}
      >
        <Crown className="w-4 h-4 mr-2" />
        ${lang === "zh" ? "9.9/月" : "9.9/month"}
      </Button>
    );
  }

  // 年付版本（推荐）- 更新为 $59.9/年
  if (variant === "lifetime") {
    return (
      <Button
        onClick={handleClick}
        className={`bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold shadow-lg shadow-brand-green/30 ${className}`}
        size={size}
      >
        <Crown className="w-4 h-4 mr-2" />
        ${lang === "zh" ? "59.9/年" : "59.9/Year"}
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {lang === "zh" ? "省45%" : "Save 45%"}
        </span>
      </Button>
    );
  }

  return null;
}
