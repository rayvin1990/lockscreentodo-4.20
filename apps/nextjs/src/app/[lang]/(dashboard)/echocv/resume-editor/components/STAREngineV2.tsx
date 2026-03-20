"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Activity, Zap, Cpu, HardDrive, Eye, X } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface DiffChange {
  type: "addition" | "removal" | "unchanged";
  content: string;
}

export function STAREngineV2({
  section,
  onClose,
}: {
  section: any;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentDiff, setCurrentDiff] = useState<DiffChange[]>([]);
  const [originalText, setOriginalText] = useState(
    section?.description || "负责产品开发和维护"
  );
  const [optimizedText, setOptimizedText] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [conversationStage, setConversationStage] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // AI interview questions sequence
  const aiQuestions = [
    `STAR_ENGINE_V2.0 [INITIALIZED]\n\nTarget: ${section.company || section.name}\n\n请描述：在这段经历中，用户增长或业务指标的基线是多少？请提供具体数字。`,
    "很好！接下来，你采取了哪些具体行动或策略来实现这个增长？请描述具体的技术手段或方法。",
    "非常有价值！最后，能否量化这个行动带来的具体结果和影响？比如增长率、效率提升百分比等。",
  ];

  // Initialize interview with specific question about baseline
  useEffect(() => {
    if (section && !interviewStarted) {
      setMessages([
        {
          role: "ai",
          content: aiQuestions[0],
          timestamp: new Date(),
        },
      ]);
      setInterviewStarted(true);
    }
  }, [section]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const nextStage = conversationStage + 1;

      if (nextStage < aiQuestions.length) {
        // Show next question
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: aiQuestions[nextStage],
            timestamp: new Date(),
          },
        ]);
        setConversationStage(nextStage);
        setIsLoading(false);
      } else {
        // Interview completed, generate optimized text
        const optimizedContent = generateOptimizedContent();
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: `[INTERVIEW COMPLETE]\n\n✓ All answers collected\n✓ Generating optimized content...\n\n${optimizedContent}`,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }
    }, 1000);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  // Multiple oscilloscopes animation
  useEffect(() => {
    const canvases = canvasRefs.current.filter(Boolean) as HTMLCanvasElement[];

    const contexts = canvases.map(canvas => {
      const ctx = canvas.getContext("2d");
      return { canvas, ctx };
    }).filter(item => item.ctx);

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      contexts.forEach(({ canvas, ctx }, index) => {
        if (!ctx) return;

        // Different patterns for each monitor
        const amplitude = isLoading ? 20 + index * 10 : 5;
        const frequency = 0.02 + index * 0.01;
        const phase = index * Math.PI / 4;
        const color = index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#a855f7";

        // Semi-transparent fade for trail effect
        ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 +
            Math.sin((x + time) * frequency + phase) * amplitude +
            Math.sin((x + time) * frequency * 2) * (amplitude / 2);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      time += 2;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]);

  const generateOptimizedContent = () => {
    // Simulate diff generation based on answers
    const newDiff: DiffChange[] = [
      { type: "removal", content: "负责" },
      { type: "addition", content: "主导" },
      { type: "unchanged", content: "产品开发" },
      { type: "addition", content: "和架构重构" },
      { type: "addition", content: "，从月活 10,000" },
      { type: "addition", content: " 增长至" },
      { type: "addition", content: " 50,000+" },
      { type: "addition", content: "（400%+ 增长）" },
    ];

    setCurrentDiff(newDiff);
    setOptimizedText("主导产品开发和架构重构，从月活 10,000 增长至 50,000+（400%+ 增长）");

    return "基于您的回答，AI 已生成优化后的简历内容。";
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col font-mono text-sm">
      {/* Header - Minimalist */}
      <div className="h-10 border-b border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-500 font-bold">STAR_ENGINE_V2.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">AI-INTERVIEW-PROTOCOL</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Cpu className="w-3 h-3" />
            <span>{isLoading ? "PROCESSING" : "READY"}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-emerald-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" ref={containerRef}>
        {/* Top Section - Real-time Diff View */}
        <div className="flex-1 border-b border-emerald-500/10 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/30 border border-slate-800 rounded px-4 py-3">
                <div className="text-slate-500 text-xs mb-1">ITERATION</div>
                <div className="text-emerald-500 font-bold text-base">{messages.length}</div>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 rounded px-4 py-3">
                <div className="text-slate-500 text-xs mb-1">PHASE</div>
                <div className="text-blue-500 font-bold text-base">SITUATION</div>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 rounded px-4 py-3">
                <div className="text-slate-500 text-xs mb-1">CHANGES</div>
                <div className="text-purple-500 font-bold text-base">{currentDiff.length}</div>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 rounded px-4 py-3">
                <div className="text-slate-500 text-xs mb-1">IMPACT</div>
                <div className="text-amber-500 font-bold text-base">{currentDiff.length > 0 ? "92/100" : "--"}</div>
              </div>
            </div>

            {/* Diff Editor */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3 text-slate-500" />
                <span className="text-slate-500">LIVE_REFACTORING_VIEW</span>
              </div>

              {/* Original */}
              <div className="bg-slate-900/50 border border-slate-800 rounded p-4">
                <div className="text-slate-600 mb-2 text-xs">// ORIGINAL</div>
                <div className="text-slate-300 text-base">{originalText}</div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-emerald-500 text-xl">↓</div>
              </div>

              {/* Optimized with Diff */}
              <div className="bg-slate-900/50 border border-emerald-500/30 rounded p-4 min-h-[80px]">
                <div className="text-emerald-600 mb-2 text-xs">// OPTIMIZED [REAL-TIME]</div>
                {currentDiff.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {currentDiff.map((change, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-base ${
                          change.type === "addition"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : change.type === "removal"
                            ? "bg-red-500/20 text-red-400 line-through"
                            : "text-slate-300"
                        }`}
                      >
                        {change.content}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-600 italic text-base">// Waiting for input...</div>
                )}
              </div>
            </div>

            {/* Metrics Visualization */}
            {currentDiff.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>IMPACT</span>
                    <span className="text-emerald-500">92%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>CLARITY</span>
                    <span className="text-blue-500">88%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[88%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>QUANTIFIED</span>
                    <span className="text-purple-500">95%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[95%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Terminal + Oscilloscopes */}
        <div className="h-64 border-t border-emerald-500/20 flex">
          {/* Terminal - Left */}
          <div className="flex-1 border-r border-emerald-500/10 flex flex-col">
            <div className="h-8 border-b border-slate-800 px-3 flex items-center gap-2 bg-slate-900/30">
              <Terminal className="w-3 h-3 text-emerald-500" />
              <span className="text-slate-500">TERMINAL</span>
            </div>
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm leading-relaxed ${
                    msg.role === "ai" ? "text-emerald-400" : "text-blue-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 text-slate-500 text-xs">
                      {msg.role === "ai" ? "▸ AI" : "▹ USER"}
                    </span>
                    <pre className="whitespace-pre-wrap flex-1">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-emerald-400 text-sm animate-pulse">
                  ▸ AI Processing...
                </div>
              )}
            </div>
            <div className="h-12 border-t border-slate-800 px-4 flex items-center gap-2 bg-slate-900/30">
              <span className="text-emerald-500 text-base">▸</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
                }
                placeholder="Enter data... [Enter]"
                disabled={isLoading}
                className="flex-1 bg-transparent text-emerald-400 placeholder:text-slate-600 outline-none text-sm"
              />
            </div>
          </div>

          {/* Oscilloscopes - Right */}
          <div className="w-64 flex flex-col">
            <div className="h-8 border-b border-slate-800 px-3 flex items-center gap-2 bg-slate-900/30">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span className="text-slate-500">MONITORS</span>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {/* Monitor 1 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-slate-600">NEURAL</span>
                  <Zap className="w-2 h-2 text-emerald-500" />
                </div>
                <canvas
                  ref={(el) => (canvasRefs.current[0] = el)}
                  width={220}
                  height={50}
                  className="w-full h-12 bg-slate-950 rounded border border-slate-800"
                />
              </div>

              {/* Monitor 2 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-slate-600">TOKEN_FLOW</span>
                  <Activity className="w-2 h-2 text-blue-500" />
                </div>
                <canvas
                  ref={(el) => (canvasRefs.current[1] = el)}
                  width={220}
                  height={50}
                  className="w-full h-12 bg-slate-950 rounded border border-slate-800"
                />
              </div>

              {/* Monitor 3 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-slate-600">CONFIDENCE</span>
                  <HardDrive className="w-2 h-2 text-purple-500" />
                </div>
                <canvas
                  ref={(el) => (canvasRefs.current[2] = el)}
                  width={220}
                  height={50}
                  className="w-full h-12 bg-slate-950 rounded border border-slate-800"
                />
              </div>

              {/* System Stats */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[9px]">
                <div className="text-slate-600">CPU: {isLoading ? "87%" : "12%"}</div>
                <div className="text-slate-600">MEM: 243MB</div>
                <div className="text-slate-600">LAT: 42ms</div>
                <div className="text-slate-600">REQ: {messages.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-6 border-t border-slate-800 bg-slate-900 px-4 flex items-center justify-between text-[9px] text-slate-600">
        <div className="flex gap-4">
          <span>SESSION: {Math.floor(Date.now() / 1000)}</span>
          <span>MODE: INTERVIEW</span>
          <span>PROTOCOL: STAR_2.0</span>
        </div>
        <div className="flex gap-4">
          <span className="text-emerald-500">● LIVE</span>
          <span>ENHANCED: ON</span>
          <span>v2.0.4</span>
        </div>
      </div>
    </div>
  );
}
