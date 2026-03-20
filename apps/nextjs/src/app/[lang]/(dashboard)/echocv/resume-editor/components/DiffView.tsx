"use client";

import { Check, X } from "lucide-react";

interface Annotation {
  before: string;
  after: string;
  reason: string;
  type: "improvement" | "correction" | "suggestion";
}

interface DiffViewProps {
  original: string;
  optimized: string;
  annotations: Annotation[];
  onAccept: () => void;
  onReject: () => void;
}

export function DiffView({ original, optimized, annotations, onAccept, onReject }: DiffViewProps) {
  const getDiffColor = (type: string) => {
    switch (type) {
      case "improvement":
        return "text-green-600 bg-green-50 border-green-200";
      case "correction":
        return "text-red-600 bg-red-50 border-red-200";
      case "suggestion":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "improvement":
        return "✨ 改进";
      case "correction":
        return "🔧 修正";
      case "suggestion":
        return "💡 建议";
      default:
        return "📝 修改";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ✨ AI 优化建议
          </h2>
          <p className="text-white/90 mt-1">
            发现 {annotations.length} 处可以优化的地方
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Original */}
          <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50/50">
            <div className="flex items-center gap-2 mb-2">
              <X className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">原始内容</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">{original}</p>
          </div>

          {/* Optimized */}
          <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50/50">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">AI 优化后</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">{optimized}</p>
          </div>

          {/* Annotations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              详细批注
            </h4>

            {annotations.map((annotation, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 ${getDiffColor(annotation.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold px-2 py-1 bg-white/50 rounded">
                    {getTypeLabel(annotation.type)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold line-through opacity-60">
                      {annotation.before}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      → {annotation.after}
                    </span>
                  </div>
                  <div className="text-xs opacity-75 italic">
                    💭 {annotation.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3 justify-end">
          <button
            onClick={onReject}
            className="px-6 py-3 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            拒绝修改
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-3 bg-gradient-to-r from-[#00ff41] to-[#00cc33] hover:from-[#00cc33] hover:to-[#00aa33] text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4" />
            接受优化
          </button>
        </div>
      </div>
    </div>
  );
}
