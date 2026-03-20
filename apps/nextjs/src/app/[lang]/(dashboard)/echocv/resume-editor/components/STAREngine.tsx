"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Terminal, Activity, Zap } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ActivityData {
  value: number;
  timestamp: number;
}

export function STAREngine({
  section,
  onClose,
}: {
  section: any;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize interview
  useEffect(() => {
    if (section) {
      setMessages([
        {
          role: "ai",
          content: `STAR_ENGINE_V2.0 initialized.\n\nAnalyzing ${section.company ? "work experience" : "project"}...\n\nQuestion: 请用具体数据描述你在该${section.company ? "职位" : "项目"}中的量化成果？`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [section]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  // Oscilloscope animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Generate wave data based on activity
      const amplitude = isLoading ? 30 : 5;
      const frequency = isLoading ? 0.05 : 0.02;

      ctx.beginPath();
      ctx.strokeStyle = isLoading ? "#10b981" : "#64748b";
      ctx.lineWidth = 2;

      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 2 + Math.sin((i + x) * frequency) * amplitude;
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }

      ctx.stroke();
      x += 2;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "ai",
        content: `STAR analysis complete.\n\nIdentified metrics: 用户增长、转化率提升.\n\nFollow-up: 能否提供具体的 baseline 数据和最终达成的数字？`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col font-mono">
      {/* Header */}
      <div className="border-b border-emerald-500/30 bg-slate-900/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-emerald-500" />
            <h1 className="text-lg font-bold text-emerald-500">STAR_ENGINE_V2.0</h1>
            <span className="text-xs text-slate-500">AI-STAR INTERVIEW PROTOCOL</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-400">
                STATUS: {isLoading ? "PROCESSING" : "READY"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs border border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
            >
              CLOSE [ESC]
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`font-mono text-sm ${
                msg.role === "ai" ? "text-emerald-400" : "text-blue-400"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="shrink-0">
                  {msg.role === "ai" ? "▸ AI" : "▹ USER"}
                </span>
                <div className="flex-1 space-y-1">
                  <span className="text-slate-600 text-xs">
                    [{msg.timestamp.toLocaleTimeString()}]
                  </span>
                  <pre className="whitespace-pre-wrap">{msg.content}</pre>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-emerald-400 font-mono text-sm">
              <span className="animate-pulse">▸ AI Processing</span>
            </div>
          )}
        </div>

        {/* Oscilloscope Monitor */}
        <div className="h-24 border-t border-emerald-500/30 bg-slate-900/50">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">NEURAL_ACTIVITY_MONITOR</span>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">
                  {isLoading ? "ACTIVE" : "IDLE"}
                </span>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={60}
              className="w-full h-16 bg-slate-950 rounded border border-slate-800"
            />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-emerald-500/30 bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="flex gap-3">
            <span className="text-emerald-500">▸</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleSend())
              }
              placeholder="Enter your response... [Enter to send, Shift+Enter for newline]"
              disabled={isLoading}
              className="flex-1 bg-transparent text-emerald-400 placeholder:text-slate-600 outline-none font-mono text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-slate-800 text-emerald-500 disabled:text-slate-600 border border-emerald-500/50 rounded transition-all flex items-center gap-2 font-mono text-sm"
            >
              <Send className="w-4 h-4" />
              SEND
            </button>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-slate-800 bg-slate-900 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
          <div className="flex gap-6">
            <span>MESSAGES: {messages.length}</span>
            <span>SESSION_TIME: {Math.floor(messages.length / 2)}m</span>
          </div>
          <div className="flex gap-6">
            <span>STAR_PHASE: SITUATION</span>
            <span>COMPLETION: {Math.min(100, messages.length * 15)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
