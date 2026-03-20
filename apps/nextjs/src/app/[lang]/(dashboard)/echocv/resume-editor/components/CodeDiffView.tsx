"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check, Sparkles, GitCompareArrows } from "lucide-react";

interface DiffChange {
  type: "addition" | "removal" | "unchanged";
  content: string;
}

interface RefactoringResult {
  before: string;
  after: string;
  changes: DiffChange[];
  metrics: {
    impactScore: number;
    clarityScore: number;
    quantificationScore: number;
  };
}

export function CodeDiffView({
  originalText,
  onOptimize,
}: {
  originalText: string;
  onOptimize?: (result: RefactoringResult) => void;
}) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<RefactoringResult | null>(null);
  const [progress, setProgress] = useState(0);

  const simulateOptimization = () => {
    setIsOptimizing(true);
    setProgress(0);

    // Simulate progressive optimization
    const intervals = [
      { progress: 20, delay: 300 },
      { progress: 40, delay: 600 },
      { progress: 60, delay: 900 },
      { progress: 80, delay: 1200 },
      { progress: 100, delay: 1500 },
    ];

    intervals.forEach(({ progress, delay }) => {
      setTimeout(() => setProgress(progress), delay);
    });

    setTimeout(() => {
      const optimized: RefactoringResult = {
        before: originalText,
        after: "主导核心产品架构重构，通过引入微服务治理体系实现系统吞吐量提升300%，从1,000 QPS提升至4,000+ QPS，P99延迟降低65%。",
        changes: [
          { type: "removal", content: "负责" },
          { type: "addition", content: "主导核心产品架构重构" },
          { type: "addition", content: "，通过引入微服务治理体系" },
          { type: "unchanged", content: "实现" },
          { type: "removal", content: "了" },
          { type: "addition", content: "系统吞吐量提升300%" },
          { type: "addition", content: "，从1,000 QPS提升至4,000+ QPS" },
          { type: "addition", content: "，P99延迟降低65%" },
        ],
        metrics: {
          impactScore: 92,
          clarityScore: 88,
          quantificationScore: 95,
        },
      };

      setResult(optimized);
      setIsOptimizing(false);
      onOptimize?.(optimized);
    }, 1600);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-300">智能重构引擎</h3>
          </div>
          <button
            onClick={simulateOptimization}
            disabled={isOptimizing}
            className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-slate-800 text-emerald-500 disabled:text-slate-600 border border-emerald-500/50 rounded transition-all flex items-center gap-2 text-sm font-mono"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                OPTIMIZING {progress}%
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                启动 AI 重构
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Original Text */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-500 font-mono">ORIGINAL</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="bg-slate-900/30 border border-slate-800 rounded p-3 text-sm text-slate-400 font-mono">
            {originalText}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center py-2">
          <ArrowRight className="w-5 h-5 text-emerald-500" />
        </div>

        {/* Diff View */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-emerald-500 font-mono">OPTIMIZED</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="bg-slate-900/50 border border-emerald-500/30 rounded p-3">
            {result ? (
              <div className="space-y-1">
                {result.changes.map((change, idx) => (
                  <span
                    key={idx}
                    className={`text-sm font-mono ${
                      change.type === "addition"
                        ? "bg-emerald-500/20 text-emerald-400 px-1 rounded"
                        : change.type === "removal"
                        ? "bg-red-500/20 text-red-400 line-through px-1 rounded"
                        : "text-slate-300"
                    }`}
                  >
                    {change.content}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-600 font-mono">
                // 等待 AI 优化...
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        {result && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500 font-mono">
                {result.metrics.impactScore}
              </div>
              <div className="text-xs text-slate-500">影响力分数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 font-mono">
                {result.metrics.clarityScore}
              </div>
              <div className="text-xs text-slate-500">清晰度分数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 font-mono">
                {result.metrics.quantificationScore}
              </div>
              <div className="text-xs text-slate-500">量化度分数</div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isOptimizing && (
          <div className="pt-3 border-t border-slate-800">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-600 font-mono">
              <span>ANALYZING...</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
