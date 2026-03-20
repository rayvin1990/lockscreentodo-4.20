"use client";

import { useState } from "react";
import { STAREngine } from "./STAREngine";
import { CodeDiffView } from "./CodeDiffView";
import { OscilloscopeMonitor } from "./OscilloscopeMonitor";
import { Zap, Target, TrendingUp, Activity, Plus } from "lucide-react";

export function FuturisticResumeEditor() {
  const [showSTAR, setShowSTAR] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);

  const workExps = [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Backend Engineer",
      description: "负责后端系统开发，实现了系统性能优化。",
    },
    {
      id: "2",
      company: "DataFlow Inc",
      position: "Software Engineer",
      description: "参与大数据平台建设，提升了数据处理效率。",
    },
  ];

  const projects = [
    {
      id: "3",
      name: "分布式存储系统",
      role: "Tech Lead",
      description: "设计和实现了高可用分布式存储方案。",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Top Bar - Metrics Dashboard */}
      <div className="border-b border-slate-800 bg-slate-900/30 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <h1 className="text-lg font-bold text-white">EchoCV <span className="text-emerald-500">PRO</span></h1>
            </div>
            <span className="text-xs text-slate-600 font-mono">// AI-POWERED RESUME OPTIMIZER</span>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs text-slate-600 font-mono">OPTIMIZATION</div>
                <div className="text-sm font-bold text-white font-mono">87%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-xs text-slate-600 font-mono">IMPACT</div>
                <div className="text-sm font-bold text-white font-mono">+124%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-xs text-slate-600 font-mono">ACTIVE</div>
                <div className="text-sm font-bold text-white font-mono">3</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Resume Sections (7 cols) */}
          <div className="col-span-7 space-y-6">
            {/* Work Experience Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-semibold text-white font-mono">WORK_EXPERIENCE</h3>
                </div>
                <button className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-all">
                  <Plus className="w-3 h-3 text-emerald-500" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {workExps.map((exp) => (
                  <div
                    key={exp.id}
                    className="border border-slate-800 bg-slate-950/50 rounded-lg p-4 hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white">{exp.position}</h4>
                          <span className="text-xs text-slate-600 font-mono">@ {exp.company}</span>
                        </div>
                        <div className="text-xs text-slate-600 font-mono mb-2">
                          2022-01 — PRESENT · 2y 3mo
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSection(exp);
                            setShowSTAR(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 rounded text-xs font-mono transition-all"
                        >
                          START STAR
                        </button>
                      </div>
                    </div>

                    {/* Code Diff View */}
                    <CodeDiffView originalText={exp.description} />

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
                      <div className="text-center">
                        <div className="text-xs text-slate-600 font-mono">IMPACT</div>
                        <div className="text-sm font-bold text-emerald-500 font-mono">72%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 font-mono">CLARITY</div>
                        <div className="text-sm font-bold text-blue-500 font-mono">68%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 font-mono">QUANTIFIED</div>
                        <div className="text-sm font-bold text-purple-500 font-mono">45%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 font-mono">STAR</div>
                        <div className="text-sm font-bold text-amber-500 font-mono">2/4</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-semibold text-white font-mono">PROJECTS</h3>
                </div>
                <button className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded transition-all">
                  <Plus className="w-3 h-3 text-blue-500" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-slate-800 bg-slate-950/50 rounded-lg p-4 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                          <span className="text-xs text-slate-600 font-mono">{proj.role}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSection(proj);
                          setShowSTAR(true);
                        }}
                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/50 rounded text-xs font-mono transition-all"
                      >
                        START STAR
                      </button>
                    </div>

                    <CodeDiffView originalText={proj.description} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity Monitors & Insights (5 cols) */}
          <div className="col-span-5 space-y-6">
            {/* Main Activity Monitor */}
            <OscilloscopeMonitor
              title="NEURAL_ENGINE_ACTIVITY"
              color="emerald"
              speed={1.5}
              amplitude={25}
              stats={[
                { label: "TOKENS/SEC", value: "2,847" },
                { label: "LATENCY", value: "124ms" },
                { label: "ACCURACY", value: "94.2%" },
              ]}
            />

            {/* Optimization Monitor */}
            <OscilloscopeMonitor
              title="OPTIMIZATION_PIPELINE"
              color="blue"
              speed={1}
              amplitude={20}
              stats={[
                { label: "QUEUED", value: "3" },
                { label: "PROCESSING", value: "1" },
                { label: "COMPLETED", value: "12" },
              ]}
            />

            {/* STAR Method Monitor */}
            <OscilloscopeMonitor
              title="STAR_ANALYSIS_DEPTH"
              color="purple"
              speed={0.8}
              amplitude={15}
              stats={[
                { label: "SITUATION", value: "100%" },
                { label: "TASK", value: "85%" },
                { label: "ACTION", value: "67%" },
              ]}
            />

            {/* AI Insights Panel */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white font-mono">AI_INSIGHTS</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <div className="text-xs text-emerald-500 font-mono mb-1">QUANTIFICATION</div>
                    <div className="text-sm text-slate-300">
                      建议添加具体数字来量化成果（如："提升300%"）
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <div className="text-xs text-blue-500 font-mono mb-1">ACTION VERBS</div>
                    <div className="text-sm text-slate-300">
                      使用更强有力的动词："负责" → "主导"
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded">
                  <div className="w-1 h-1 rounded-full bg-purple-500 mt-2" />
                  <div>
                    <div className="text-xs text-purple-500 font-mono mb-1">STAR COMPLETENESS</div>
                    <div className="text-sm text-slate-300">
                      缺少 Result 阶段，请补充具体结果数据
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white font-mono mb-3">QUICK_ACTIONS</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded text-xs font-mono transition-all">
                  批量优化
                </button>
                <button className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded text-xs font-mono transition-all">
                  JD 匹配
                </button>
                <button className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/30 rounded text-xs font-mono transition-all">
                  导出报告
                </button>
                <button className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-xs font-mono transition-all">
                  AI 审查
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAR Engine Modal */}
      {showSTAR && selectedSection && (
        <STAREngine section={selectedSection} onClose={() => setShowSTAR(false)} />
      )}
    </div>
  );
}
