"use client";

import React from "react";

interface PricingComparisonTableProps {
  lang?: "zh" | "en";
}

export function PricingComparisonTable({ lang = "en" }: PricingComparisonTableProps) {
  const copy = lang === "zh"
    ? {
        userType: "用户类型",
        backgroundStyles: "背景样式",
        imageUpload: "图片上传",
        customization: "自定义",
        notes: "说明",
        freeUser: "免费用户",
        styles12: "12 种样式",
        notAvailable: "不可用",
        limited: "有限",
        freeNote: "每周 3 次生成",
        trial: "7 天试用",
        allStyles: "全部样式",
        unlimitedUploads: "无限上传",
        unlimited: "无限",
        trialNote: "7 天完整体验",
        proUser: "Pro 用户",
        proNote: "全部功能不限量",
      }
    : {
        userType: "User Type",
        backgroundStyles: "Background Styles",
        imageUpload: "Image Upload",
        customization: "Customization",
        notes: "Notes",
        freeUser: "Free User",
        styles12: "12 styles",
        notAvailable: "Not available",
        limited: "Limited",
        freeNote: "3 generations per week",
        trial: "7-Day Trial",
        allStyles: "All styles",
        unlimitedUploads: "Unlimited uploads",
        unlimited: "Unlimited",
        trialNote: "Full access for 7 days",
        proUser: "Pro User",
        proNote: "Everything unlimited",
      };

  return (
    <div className="w-full max-w-full px-4">
      <div className="bg-brand-card rounded-xl p-4 shadow-xl border border-gray-800">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">{copy.userType}</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">{copy.backgroundStyles}</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">{copy.imageUpload}</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">{copy.customization}</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">{copy.notes}</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <td className="py-4 text-white">{copy.freeUser}</td>
              <td className="py-4 text-gray-300">{copy.styles12}</td>
              <td className="py-4 text-gray-300">{copy.notAvailable}</td>
              <td className="py-4 text-gray-300">{copy.limited}</td>
              <td className="py-4 text-gray-300">{copy.freeNote}</td>
            </tr>

            <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <td className="py-4 text-white">{copy.trial}</td>
              <td className="py-4 text-white font-bold">{copy.allStyles}</td>
              <td className="py-4 text-gray-300">{copy.unlimitedUploads}</td>
              <td className="py-4 text-white font-bold">{copy.unlimited}</td>
              <td className="py-4 text-gray-300">{copy.trialNote}</td>
            </tr>

            <tr className="hover:bg-gray-800 transition-colors">
              <td className="py-4 text-white font-bold text-brand-green">{copy.proUser}</td>
              <td className="py-4 text-white font-bold">{copy.allStyles}</td>
              <td className="py-4 text-white font-bold">{copy.unlimited}</td>
              <td className="py-4 text-white font-bold">{copy.unlimited}</td>
              <td className="py-4 text-gray-300">{copy.proNote}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
