"use client";

import React from "react";
import { Check, Copy, Crown, Mail, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { PricingComparisonTable } from "~/components/pricing-comparison-table";

interface UpgradeModalPricingProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "zh" | "en";
}

const MONTHLY_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL || "";
const YEARLY_URL =
  process.env.NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_URL ||
  process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL ||
  "";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lockscreentodo.com";
const WECHAT_ID = process.env.NEXT_PUBLIC_WECHAT_ID || "";

export function UpgradeModalPricing({ isOpen, onClose, lang = "en" }: UpgradeModalPricingProps) {
  const isZh = lang === "zh";
  const currency = isZh ? "￥" : "$";
  const monthlyPrice = `${currency}9.9`;
  const yearlyPrice = `${currency}59.9`;

  const copy = isZh
    ? {
        upgrade: "升级 Pro",
        title: "国内支付暂未开放",
        subtitle: "中文界面保留价格与功能说明。在线支付暂不开放，如需试用可联系开通。",
        whatYouGet: "你将获得：",
        allBackgrounds: "全部背景样式（12+ 高级设计）",
        uploads: "无限图片上传",
        customization: "无限字体与颜色自定义",
        support: "优先支持",
        monthly: "月卡",
        yearly: "年卡",
        month: " / 30 天",
        year: " / 365 天",
        mostPopular: "更划算",
        save45: "节省 45%",
        allStyles: "全部背景样式",
        oneYear: "365 天访问权限",
        futureUpdates: "有效期内免费获得后续更新",
        action: "联系开通",
        manualTitle: "联系开通",
        manualBody: "国内在线支付暂未开放。你可以先发邮件联系我们，说明登录邮箱和想开通的方案。我们会人工处理试用或开通请求。",
        emailLabel: "邮箱",
        wechatLabel: "微信",
        noAutoRenewal: "不自动续费。国内在线支付上线前，不会自动扣款。",
        copied: "已复制",
      }
    : {
        upgrade: "Upgrade to Pro",
        title: "Unlock All Features",
        subtitle: "One-time pass. No auto-renewal.",
        whatYouGet: "What You'll Get:",
        allBackgrounds: "All background styles (12+ premium designs)",
        uploads: "Unlimited image uploads",
        customization: "Unlimited font & color customization",
        support: "Priority support",
        monthly: "30-Day Pass",
        yearly: "365-Day Pass",
        month: " / 30 days",
        year: " / 365 days",
        mostPopular: "BEST VALUE",
        save45: "Save 45%",
        allStyles: "All background styles",
        oneYear: "365 days of access",
        futureUpdates: "Free updates during access period",
        action: "Buy pass",
        manualTitle: "Manual activation",
        manualBody: "Chinese payment is not available yet. Contact us if you want to test the Chinese flow.",
        emailLabel: "Email",
        wechatLabel: "WeChat",
        noAutoRenewal: "No auto-renewal. Buy again manually when it expires.",
        copied: "Copied",
      };

  const handleUpgrade = (variant: "monthly" | "yearly") => {
    if (isZh) {
      const subject = encodeURIComponent(`LockscreenTodo Pro ${variant === "monthly" ? "月卡" : "年卡"}开通咨询`);
      const body = encodeURIComponent(
        `你好，我想了解 LockscreenTodo Pro ${variant === "monthly" ? "月卡 ￥9.9 / 30 天" : "年卡 ￥59.9 / 365 天"}。\n\n登录邮箱：\n备注：\n`,
      );
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    const checkoutUrl = variant === "monthly" ? MONTHLY_URL : YEARLY_URL;

    if (!checkoutUrl || checkoutUrl.includes("your-product-id")) {
      alert("Payment is being configured. Please try again later!");
      console.error("Payment URL not configured", { variant, lang });
      return;
    }

    window.open(checkoutUrl, "_blank");
  };

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
    alert(copy.copied);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-brand-card border-gray-700 text-white w-full mx-auto my-auto bottom-auto md:max-w-5xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="space-y-4 pt-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 text-amber-400 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
                <Crown className="w-5 h-5" />
                <span>{copy.upgrade}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">{copy.title}</h2>
            <p className="text-gray-400">{copy.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <PricingComparisonTable lang={lang} />

              <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">{copy.whatYouGet}</h3>
                <ul className="space-y-3 text-gray-300">
                  {[copy.allBackgrounds, copy.uploads, copy.customization, copy.support].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isZh ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                  <h3 className="text-lg font-bold text-white">{copy.manualTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{copy.manualBody}</p>
                  <ContactRow label={copy.emailLabel} value={SUPPORT_EMAIL} onCopy={copyText} />
                  {WECHAT_ID ? <ContactRow label={copy.wechatLabel} value={WECHAT_ID} onCopy={copyText} /> : null}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              <PlanCard
                title={copy.monthly}
                price={monthlyPrice}
                cadence={copy.month}
                features={[copy.allStyles, copy.uploads, copy.customization]}
                buttonText={isZh ? `${copy.action}` : `${copy.action} - ${monthlyPrice}`}
                onClick={() => handleUpgrade("monthly")}
              />

              <PlanCard
                title={copy.yearly}
                price={yearlyPrice}
                cadence={copy.year}
                badge={copy.mostPopular}
                note={copy.save45}
                highlighted
                features={[copy.allStyles, copy.uploads, copy.customization, copy.oneYear, copy.futureUpdates]}
                buttonText={isZh ? `${copy.action}` : `${copy.action} - ${yearlyPrice}`}
                onClick={() => handleUpgrade("yearly")}
              />
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 pt-2">
            <p>{copy.noAutoRenewal}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContactRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="truncate text-gray-200">{value}</div>
      </div>
      <Button size="sm" variant="outline" onClick={() => onCopy(value)}>
        <Copy className="mr-2 h-3.5 w-3.5" />
        Copy
      </Button>
    </div>
  );
}

function PlanCard({
  title,
  price,
  cadence,
  badge,
  note,
  highlighted = false,
  features,
  buttonText,
  onClick,
}: {
  title: string;
  price: string;
  cadence: string;
  badge?: string;
  note?: string;
  highlighted?: boolean;
  features: string[];
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div
      className={
        highlighted
          ? "bg-gradient-to-br from-brand-green/10 to-emerald-500/10 border-2 border-brand-green hover:border-brand-green rounded-2xl p-4 transition-all hover:scale-[1.02] relative shadow-lg shadow-brand-green/20"
          : "bg-brand-bg border-2 border-gray-700 hover:border-gray-600 rounded-2xl p-4 transition-all hover:scale-[1.02]"
      }
    >
      {badge ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-brand-green to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {badge}
          </div>
        </div>
      ) : null}

      <div className={`text-center space-y-3 ${badge ? "mt-2" : ""}`}>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-4xl font-bold ${highlighted ? "text-brand-green" : "text-white"}`}>
              {price}
            </span>
            <span className="text-gray-400">{cadence}</span>
          </div>
          {note ? <p className="text-xs text-brand-green font-semibold mt-1">{note}</p> : null}
        </div>

        <ul className="space-y-2 text-left text-sm text-gray-300">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onClick}
          className={
            highlighted
              ? "w-full bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold shadow-lg shadow-brand-green/30"
              : "w-full bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 font-semibold"
          }
          size="lg"
        >
          <Mail className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
