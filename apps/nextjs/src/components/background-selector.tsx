"use client";

import { Upload, X, ChevronDown, Lock, Crown } from "lucide-react";
import { useRef, useState } from "react";

interface BackgroundSelectorProps {
  selectedBackground: string;
  backgroundType: "preset" | "custom";
  onSelect: (background: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  hasUploadedImage?: boolean;
  // 新增：用户权限信息
  isPro?: boolean;
  daysRemaining?: number;
  uploadCount?: number;
  canUploadToday?: boolean;
}

export function BackgroundSelector({
  selectedBackground,
  backgroundType,
  onSelect,
  onUpload,
  onReset,
  fileInputRef,
  hasUploadedImage = false,
  isPro = false,
  daysRemaining = 0,
  uploadCount = 0,
  canUploadToday = false,
}: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUploadTooltip, setShowUploadTooltip] = useState(false);

  const backgrounds = [
    { id: 1, name: "Cute Bear", emoji: "", gradient: "from-pink-200 to-pink-300" },
    { id: 2, name: "Starry Night", emoji: "", gradient: "from-indigo-900 to-purple-900" },
    { id: 3, name: "Aurora", emoji: "", gradient: "from-green-400 to-blue-500" },
    { id: 4, name: "Mountains", emoji: "", gradient: "from-gray-700 to-gray-900" },
    { id: 5, name: "Sunset", emoji: "", gradient: "from-orange-400 to-pink-600" },
    { id: 6, name: "Ocean", emoji: "", gradient: "from-blue-400 to-teal-600" },
    { id: 7, name: "Forest", emoji: "", gradient: "from-green-600 to-green-800" },
    { id: 8, name: "Minimal", emoji: "", gradient: "from-gray-100 to-gray-200" },
    { id: 9, name: "Gradient", emoji: "", gradient: "from-purple-500 to-pink-500" },
    { id: 10, name: "Sky", emoji: "", gradient: "from-blue-300 to-blue-500" },
    { id: 11, name: "Rose", emoji: "", gradient: "from-red-300 to-pink-400" },
    { id: 12, name: "Night", emoji: "", gradient: "from-gray-900 to-black" },
    // Pro 专属背景（13-20）- 未来可以添加
    // { id: 13, name: "Pro Galaxy", emoji: "", gradient: "from-indigo-600 via-purple-600 to-pink-600", proOnly: true },
    // { id: 14, name: "Pro Sunset", emoji: "", gradient: "from-rose-600 via-orange-600 to-yellow-600", proOnly: true },
  ];

  // 检查上传权限 - 所有用户都可以上传图片
  // 免费用户可以体验完整功能，在下载和二维码时限制
  const canUpload = true;

  // 处理上传点击
  const handleUploadClick = () => {
    if (canUpload) {
      fileInputRef.current?.click();
    } else {
      setShowUploadTooltip(true);
      setTimeout(() => setShowUploadTooltip(false), 3000);
    }
  };

  // Get selected background info
  const selectedBg = backgrounds.find(bg => bg.gradient === selectedBackground);

  return (
    <div className="bg-brand-card rounded-2xl p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Background</h3>
        {(backgroundType === "custom" || hasUploadedImage) && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg text-sm font-medium transition-all hover:scale-105"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Dropdown Selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-brand-green rounded-xl transition-all"
        >
          <div className="flex items-center gap-3">
            {selectedBg ? (
              <>
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedBg.gradient} rounded-lg`} />
                <div className="text-left">
                  <span className="text-white font-medium block">{selectedBg.name}</span>
                  <span className="text-gray-400 text-sm">{selectedBg.emoji}</span>
                </div>
              </>
            ) : (
              <span className="text-gray-400">Select a background...</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-brand-card border-2 border-gray-700 rounded-xl shadow-xl max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    onSelect(bg.gradient);
                    setIsOpen(false);
                  }}
                  className={`relative p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                    selectedBackground === bg.gradient && backgroundType === "preset"
                      ? "ring-2 ring-brand-green bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <div className={`w-full h-16 bg-gradient-to-br ${bg.gradient} rounded-lg mb-2`} />
                  <div className="text-center">
                    <span className="text-white text-sm font-medium block">{bg.name}</span>
                    <span className="text-gray-400 text-xs">{bg.emoji}</span>
                  </div>
                  {selectedBackground === bg.gradient && backgroundType === "preset" && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-brand-green rounded-full border-2 border-brand-card" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="relative">
        <button
          onClick={handleUploadClick}
          disabled={!canUpload}
          className={`w-full py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
            canUpload
              ? "bg-brand-bg hover:bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-brand-green rounded-xl"
              : "bg-gray-800/50 text-gray-500 border-2 border-gray-700 rounded-xl cursor-not-allowed"
          }`}
        >
          {canUpload ? (
            <>
              <Upload className="w-4 h-4" />
              Upload Image
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Upload Locked
            </>
          )}
        </button>

        {/* Tooltip: 上传限制提示 */}
        {showUploadTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
            {isPro ? (
              <div className="text-center">
                <div className="font-bold mb-1">👑 Pro Feature</div>
                <div className="text-gray-300">Unlimited uploads</div>
              </div>
            ) : daysRemaining > 0 ? (
              <div className="text-center">
                <div className="font-bold mb-1">Trial Limit</div>
                <div className="text-amber-400">{uploadCount}/3 uploads in trial</div>
                {!canUploadToday && (
                  <div className="text-red-400 text-xs mt-1">
                    Trial limit reached!
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="font-bold mb-1">🔒 Free Plan Limit</div>
                <div className="text-gray-300">Upgrade to upload</div>
                <div className="text-brand-green text-xs mt-1 font-semibold">
                  Get Pro →
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>

      {/* 上传次数提示（试用用户） */}
      {!isPro && daysRemaining > 0 && (
        <div className="mt-2 text-center text-xs text-gray-500 bg-brand-bg/50 rounded-lg py-1 px-2">
          💡 Trial: {uploadCount}/3 uploads {canUploadToday ? "remaining" : "used"}
        </div>
      )}
    </div>
  );
}
