"use client";

import { Type, AlignLeft, AlignCenter, AlignRight, Palette, Lock } from "lucide-react";
import { useState } from "react";

interface StyleControlsProps {
  task: {
    text: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    backgroundOpacity: number;
    opacity: number;
    isBold: boolean;
    isItalic: boolean;
    isCompleted: boolean;
    textAlign: "left" | "center" | "right";
    fontFamily: string;
  };
  onUpdate: (updates: Partial<StyleControlsProps["task"]>) => void;
  isEnglish: boolean;
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

  const handleStyleChange = (updates: Partial<StyleControlsProps["task"]>) => {
    onUpdate(updates);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1] ?? '0', 16),
      g: parseInt(result[2] ?? '0', 16),
      b: parseInt(result[3] ?? '0', 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const currentRgb = hexToRgb(task.color);

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
    { name: "Inter", value: "var(--font-inter)", category: "Modern UI" },
    { name: "Roboto", value: "var(--font-roboto)", category: "Modern UI" },
    { name: "San Francisco", value: "-apple-system, BlinkMacSystemFont, 'SF Pro Display'", category: "System" },
    { name: "Segoe UI", value: "'Segoe UI', system-ui, sans-serif", category: "System" },
    { name: "Poppins", value: "var(--font-poppins)", category: "Tech" },
    { name: "Georgia", value: "Georgia, 'Times New Roman', serif", category: "Classic" },
    { name: "Arial", value: "Arial, 'Helvetica Neue', sans-serif", category: "Classic" },
    { name: "Comic Sans MS", value: "'Comic Sans MS', 'Chalkboard SE', sans-serif", category: "Fun" },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium text-white/50 mb-4 flex items-center gap-2">
        <Type className="w-4 h-4" />
        {isEnglish ? "Text Style" : "文字样式"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/40 mb-2">
            {isEnglish ? "Font" : "字体"}
          </label>
          <select
            value={task.fontFamily}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/80 text-sm focus:outline-none cursor-pointer focus:border-white/20"
          >
            {fonts.map((font) => (
              <option
                key={font.name}
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2">
            {isEnglish ? "Size" : "大小"}: {task.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="48"
            value={task.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            className="w-full accent-white/50"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2">
            {isEnglish ? "Color" : "颜色"}
          </label>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border border-white/10 transition-all cursor-pointer`}
              style={{ backgroundColor: task.color }}
            />
            <input
              type="text"
              value={task.color}
              onChange={(e) => handleStyleChange({ color: e.target.value })}
              className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/80 text-sm focus:outline-none cursor-text focus:border-white/20 uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2">
            {isEnglish ? "Align" : "对齐"}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ textAlign: "left" as const })}
              className={`flex-1 py-2 rounded-xl transition-all ${
                task.textAlign === "left" ? "bg-white text-black" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1]"
              }`}
            >
              <AlignLeft className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => onUpdate({ textAlign: "center" as const })}
              className={`flex-1 py-2 rounded-xl transition-all ${
                task.textAlign === "center" ? "bg-white text-black" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1]"
              }`}
            >
              <AlignCenter className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => onUpdate({ textAlign: "right" as const })}
              className={`flex-1 py-2 rounded-xl transition-all ${
                task.textAlign === "right" ? "bg-white text-black" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1]"
              }`}
            >
              <AlignRight className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ isBold: !task.isBold })}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              task.isBold ? "bg-white text-black" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1]"
            }`}
          >
            B
          </button>
          <button
            onClick={() => onUpdate({ isItalic: !task.isItalic })}
            className={`flex-1 py-2 rounded-xl italic transition-all ${
              task.isItalic ? "bg-white text-black" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1]"
            }`}
          >
            I
          </button>
          <button
            onClick={() => onUpdate({ isCompleted: !task.isCompleted })}
            className={`flex-1 py-2 rounded-xl transition-all ${
              task.isCompleted ? "bg-white text-black line-through opacity-60" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1]"
            }`}
          >
            {isEnglish ? "Done" : "完成"}
          </button>
        </div>
      </div>
    </div>
  );
}