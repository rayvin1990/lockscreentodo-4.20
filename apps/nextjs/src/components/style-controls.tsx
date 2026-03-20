"use client";

import { Type, AlignLeft, AlignCenter, AlignRight, Palette, Lock } from "lucide-react";
import { useState } from "react";

interface StyleControlsProps {
  task: {
    text: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    backgroundOpacity: number; // 背景层透明度
    opacity: number; // 文字透明度
    isBold: boolean;
    isItalic: boolean;
    isCompleted: boolean;
    textAlign: "left" | "center" | "right";
    fontFamily: string;
  };
  onUpdate: (updates: Partial<StyleControlsProps["task"]>) => void;
  isEnglish: boolean;
  // User permissions
  isPro?: boolean;
  daysRemaining?: number;
}

export function StyleControls({
  task,
  onUpdate,
  isEnglish,
  isPro = false,
  daysRemaining = 0
}: StyleControlsProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Handle style changes - no more counting here
  const handleStyleChange = (updates: Partial<StyleControlsProps["task"]>) => {
    // Allow all changes freely
    onUpdate(updates);
  };

  // 将hex转换为RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // 将RGB转换为hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const currentRgb = hexToRgb(task.color);

  // 潘通色号预设
  const pantoneColors = [
    { name: "Pantone 17-5104", hex: "#F5F5F5", category: "Ultimate Gray" },
    { name: "Pantone 13-0647", hex: "#F4DFB5", category: "Illuminating" },
    { name: "Pantone 19-4052", hex: "#0060A9", category: "Classic Blue" },
    { name: "Pantone 18-3838", hex: "#F65757", category: "Living Coral" },
    { name: "Pantone 18-3838", hex: "#5B5E6F", category: "Ultra Violet" },
    { name: "Pantone 15-0343", hex: "#8FBF57", category: "Greenery" },
    { name: "Pantone 19-1557", hex: "#CE463D", category: "Chili Pepper" },
    { name: "Pantone 14-0852", hex: "#FFD95E", category: "Mimosa" },
    { name: "Pantone 16-1546", hex: "#E35C76", category: "Honeysuckle" },
    { name: "Pantone 17-1463", hex: "#D4877C", category: "Tangerine Tango" },
    { name: "Pantone 19-3628", hex: "#4A3B52", category: "Marsala" },
    { name: "Pantone 18-1438", hex: "#B34E68", category: "Radiant Orchid" },
    { name: "Pantone 15-3919", hex: "#9BB7D4", category: "Serenity" },
    { name: "Pantone 13-4411", hex: "#92A8D1", category: "Rose Quartz" },
    { name: "Pantone 15-5519", hex: "#E3C5CA", category: "Pink Yarrow" },
  ];

  // 基础颜色预设
  const basicColors = [
    { hex: "#FFFFFF", name: "White" },
    { hex: "#000000", name: "Black" },
    { hex: "#FF0000", name: "Red" },
    { hex: "#00FF00", name: "Green" },
    { hex: "#0000FF", name: "Blue" },
    { hex: "#FFFF00", name: "Yellow" },
    { hex: "#FF00FF", name: "Magenta" },
    { hex: "#00FFFF", name: "Cyan" },
    { hex: "#FFA500", name: "Orange" },
    { hex: "#800080", name: "Purple" },
  ];

  const fonts = [
    // System & Modern UI Fonts
    { name: "Inter", value: "var(--font-inter)", category: "Modern UI" },
    { name: "Roboto", value: "var(--font-roboto)", category: "Modern UI" },
    { name: "San Francisco", value: "-apple-system, BlinkMacSystemFont, 'SF Pro Display'", category: "System" },
    { name: "Segoe UI", value: "'Segoe UI', system-ui, sans-serif", category: "System" },
    { name: "Helvetica Neue", value: "'Helvetica Neue', Helvetica, Arial, sans-serif", category: "Classic" },

    // Popular Tech Fonts
    { name: "Poppins", value: "var(--font-poppins)", category: "Tech" },
    { name: "Montserrat", value: "var(--font-montserrat)", category: "Tech" },
    { name: "Open Sans", value: "var(--font-open-sans)", category: "Tech" },
    { name: "Lato", value: "var(--font-lato)", category: "Tech" },
    { name: "Source Sans Pro", value: "var(--font-source-code-pro)", category: "Tech" },

    // Monospace Fonts
    { name: "Fira Code", value: "var(--font-fira-code)", category: "Code" },
    { name: "JetBrains Mono", value: "var(--font-jetbrains-mono)", category: "Code" },
    { name: "Source Code Pro", value: "var(--font-source-code-pro)", category: "Code" },
    { name: "Monaco", value: "Monaco, 'Cascadia Code', monospace", category: "Code" },
    { name: "Courier New", value: "'Courier New', Courier, monospace", category: "Code" },

    // Chinese Fonts
    { name: "Noto Sans SC", value: "var(--font-noto-sans-sc)", category: "Chinese" },
    { name: "PingFang SC", value: "'PingFang SC', 'Microsoft YaHei', sans-serif", category: "Chinese" },
    { name: "Microsoft YaHei", value: "'Microsoft YaHei', 'SimHei', sans-serif", category: "Chinese" },

    // Classic & Display
    { name: "Georgia", value: "Georgia, 'Times New Roman', serif", category: "Classic" },
    { name: "Times New Roman", value: "'Times New Roman', Times, serif", category: "Classic" },
    { name: "Arial", value: "Arial, 'Helvetica Neue', sans-serif", category: "Classic" },
    { name: "Verdana", value: "Verdana, Geneva, sans-serif", category: "Classic" },
    { name: "Trebuchet MS", value: "'Trebuchet MS', 'Lucida Grande', sans-serif", category: "Classic" },
    { name: "Impact", value: "Impact, 'Arial Black', sans-serif", category: "Display" },
    { name: "Comic Sans MS", value: "'Comic Sans MS', 'Chalkboard SE', sans-serif", category: "Fun" },
  ];

  return (
    <div className="bg-brand-card rounded-2xl p-6 border border-gray-800 relative">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Type className="w-5 h-5 text-brand-green" />
        {isEnglish ? "Style Controls" : "样式控制"}
      </h3>

      <div className="space-y-4">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {isEnglish ? "Font Family" : "字体"}
            {false && <Lock className="w-3 h-3 inline ml-1 text-gray-500" />}
          </label>
          <select
            value={task.fontFamily}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            disabled={false}
            className={`w-full px-4 py-2 bg-brand-bg border rounded-lg text-white focus:outline-none ${
              false
                ? "border-gray-700 text-gray-500 cursor-not-allowed opacity-60"
                : "border-gray-700 focus:border-brand-green cursor-pointer"
            }`}
          >
            {fonts.map((font) => (
              <option
                key={font.name}
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.name} • {font.category}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {isEnglish ? "Font Size" : "字体大小"}: {task.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="48"
            value={task.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            className="w-full accent-brand-green"
          />
        </div>

        {/* Color - Professional Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {isEnglish ? "Text Color" : "文字颜色"}
            {false && <Lock className="w-3 h-3 inline ml-1 text-gray-500" />}
          </label>
          <div className={`bg-brand-bg rounded-lg border p-3 ${false ? "border-gray-700 opacity-60" : "border-gray-700"}`}>
            {/* Color Preview & Toggle */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  false
                    ? "border-gray-600 cursor-not-allowed"
                    : "border-gray-600 cursor-pointer hover:border-brand-green"
                }`}
                style={{ backgroundColor: task.color }}
                onClick={() => !false && setShowColorPicker(!showColorPicker)}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={task.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                  disabled={false}
                  className={`w-full px-3 py-2 bg-brand-bg border rounded text-white text-sm focus:outline-none uppercase ${
                    false
                      ? "border-gray-600 text-gray-500 cursor-not-allowed"
                      : "border-gray-600 focus:border-brand-green"
                  }`}
                  placeholder="#FFFFFF"
                />
                <button
                  onClick={() => !false && setShowColorPicker(!showColorPicker)}
                  disabled={false}
                  className={`mt-2 text-xs flex items-center gap-1 ${
                    false
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-brand-green hover:text-brand-green/80 cursor-pointer"
                  }`}
                >
                  <Palette className="w-3 h-3" />
                  {showColorPicker ? "Hide Color Picker" : "Show Color Picker"}
                </button>
              </div>
            </div>

            {/* Advanced Color Picker */}
            {showColorPicker && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-700">
                {/* RGB Sliders */}
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Red: {currentRgb.r}</label>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={currentRgb.r}
                      onChange={(e) => handleStyleChange({ color: rgbToHex(parseInt(e.target.value), currentRgb.g, currentRgb.b) })}
                      disabled={false}
                      className={`w-full accent-red-500 ${false ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Green: {currentRgb.g}</label>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={currentRgb.g}
                      onChange={(e) => handleStyleChange({ color: rgbToHex(currentRgb.r, parseInt(e.target.value), currentRgb.b) })}
                      disabled={false}
                      className={`w-full accent-green-500 ${false ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Blue: {currentRgb.b}</label>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={currentRgb.b}
                      onChange={(e) => handleStyleChange({ color: rgbToHex(currentRgb.r, currentRgb.g, parseInt(e.target.value)) })}
                      disabled={false}
                      className={`w-full accent-blue-500 ${false ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                </div>

                {/* Basic Colors */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Basic Colors</label>
                  <div className="grid grid-cols-10 gap-1">
                    {basicColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleStyleChange({ color: color.hex })}
                        disabled={false}
                        className={`w-6 h-6 rounded border-2 transition-all ${
                          false
                            ? "border-gray-600 cursor-not-allowed opacity-50"
                            : task.color === color.hex
                            ? "border-brand-green scale-110"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Pantone Colors */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Pantone Colors</label>
                  <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto">
                    {pantoneColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleStyleChange({ color: color.hex })}
                        disabled={false}
                        className={`w-full h-8 rounded border-2 transition-all ${
                          false
                            ? "border-gray-600 cursor-not-allowed opacity-50"
                            : task.color === color.hex
                            ? "border-brand-green scale-105"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} - ${color.category}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Align */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {isEnglish ? "Alignment" : "对齐方式"}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ textAlign: "left" as const })}
              className={`flex-1 p-2 rounded-lg transition-all ${
                task.textAlign === "left" ? "bg-brand-green text-white" : "bg-brand-bg text-gray-400 hover:bg-gray-800"
              }`}
            >
              <AlignLeft className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={() => onUpdate({ textAlign: "center" as const })}
              className={`flex-1 p-2 rounded-lg transition-all ${
                task.textAlign === "center" ? "bg-brand-green text-white" : "bg-brand-bg text-gray-400 hover:bg-gray-800"
              }`}
            >
              <AlignCenter className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={() => onUpdate({ textAlign: "right" as const })}
              className={`flex-1 p-2 rounded-lg transition-all ${
                task.textAlign === "right" ? "bg-brand-green text-white" : "bg-brand-bg text-gray-400 hover:bg-gray-800"
              }`}
            >
              <AlignRight className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>

        {/* Font Style */}
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ isBold: !task.isBold })}
            className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
              task.isBold ? "bg-brand-green text-white" : "bg-brand-bg text-gray-400 hover:bg-gray-800"
            }`}
          >
            B
          </button>
          <button
            onClick={() => onUpdate({ isItalic: !task.isItalic })}
            className={`flex-1 py-2 px-4 rounded-lg italic transition-all ${
              task.isItalic ? "bg-brand-green text-white" : "bg-brand-bg text-gray-400 hover:bg-gray-800"
            }`}
          >
            I
          </button>
          <button
            onClick={() => onUpdate({ isCompleted: !task.isCompleted })}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              task.isCompleted ? "bg-brand-green text-white line-through" : "bg-brand-bg text-gray-400 hover:bg-gray-800"
            }`}
          >
            {isEnglish ? "Done" : "完成"}
          </button>
        </div>
      </div>
    </div>
  );
}
