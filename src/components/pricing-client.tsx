"use client";

import { useState } from "react";
import { Check, Crown, Mail, Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";
import { UpgradeModalPricing } from "~/components/lockscreen/upgrade-modal-pricing";

export default function PricingPage({ params }: { params: { lang: string } }) {
  const lang = params.lang === "zh" ? "zh" : "en";
  const isZh = lang === "zh";
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const currency = isZh ? "￥" : "$";
  const monthlyPrice = `${currency}9.9`;
  const yearlyPrice = `${currency}59.9`;

  const copy = isZh
    ? {
        upgrade: "升级 Pro",
        title: "中文价格保留，国内在线支付暂未开放",
        subtitle: "月卡 30 天，年卡 365 天。不自动续费。国内支付上线前，可联系开通或试用。",
        monthly: "月卡",
        yearly: "年卡",
        month: " / 30 天",
        year: " / 365 天",
        popular: "更划算 - 节省 45%",
        equivalent: "折合 ￥4.99/月",
        allStyles: "全部背景样式",
        uploads: "无限图片上传",
        customization: "无限字体与颜色自定义",
        oneYear: "365 天访问权限",
        updates: "有效期内免费获得后续更新",
        trial: "国内在线支付暂未开放",
        cancel: "不会自动扣款。需要开通请联系邮箱。",
        button: "联系开通",
      }
    : {
        upgrade: "Upgrade to Pro",
        title: "Pro passes with no auto-renewal",
        subtitle: "Choose a 30-day or 365-day pass. No automatic billing.",
        monthly: "30-Day Pass",
        yearly: "365-Day Pass",
        month: " / 30 days",
        year: " / 365 days",
        popular: "BEST VALUE - Save 45%",
        equivalent: "Equivalent to $4.99/month",
        allStyles: "All background styles",
        uploads: "Unlimited image uploads",
        customization: "Unlimited font/color customization",
        oneYear: "365 days of access",
        updates: "Free updates during access period",
        trial: "No auto-renewal",
        cancel: "Buy again manually when your pass expires",
        button: "Buy pass",
      };

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Crown className="w-4 h-4" />
            <span>{copy.upgrade}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{copy.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{copy.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PlanPanel
            title={copy.monthly}
            price={monthlyPrice}
            cadence={copy.month}
            features={[copy.allStyles, copy.uploads, copy.customization]}
            buttonText={isZh ? copy.button : `${copy.button} - ${monthlyPrice}`}
            onClick={() => setShowUpgradeModal(true)}
            manual={isZh}
          />

          <PlanPanel
            title={copy.yearly}
            price={yearlyPrice}
            cadence={copy.year}
            badge={copy.popular}
            note={copy.equivalent}
            highlighted
            features={[copy.allStyles, copy.uploads, copy.customization, copy.oneYear, copy.updates]}
            buttonText={isZh ? copy.button : `${copy.button} - ${yearlyPrice}`}
            onClick={() => setShowUpgradeModal(true)}
            manual={isZh}
          />
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>{copy.trial}</p>
          <p className="mt-2">{copy.cancel}</p>
        </div>
      </div>

      <UpgradeModalPricing
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        lang={lang}
      />
    </div>
  );
}

function PlanPanel({
  title,
  price,
  cadence,
  badge,
  note,
  highlighted = false,
  features,
  buttonText,
  onClick,
  manual = false,
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
  manual?: boolean;
}) {
  return (
    <div
      className={
        highlighted
          ? "bg-gradient-to-br from-brand-green/10 to-emerald-500/10 border-2 border-brand-green hover:border-brand-green rounded-3xl p-8 transition-all relative shadow-lg shadow-brand-green/20"
          : "bg-brand-card border-2 border-gray-700 hover:border-gray-600 rounded-3xl p-8 transition-all"
      }
    >
      {badge ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-brand-green to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            {badge}
          </div>
        </div>
      ) : null}

      <div className={`mb-6 ${badge ? "mt-2" : ""}`}>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${highlighted ? "text-brand-green" : "text-white"}`}>
            {price}
          </span>
          <span className="text-gray-400">{cadence}</span>
        </div>
        {note ? <p className="text-xs text-brand-green font-semibold mt-1">{note}</p> : null}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-gray-300">
            <Check className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
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
        {manual ? (
          <Mail className="w-4 h-4 mr-2" />
        ) : highlighted ? (
          <Sparkles className="w-4 h-4 mr-2" />
        ) : (
          <Crown className="w-4 h-4 mr-2" />
        )}
        {buttonText}
      </Button>
    </div>
  );
}
