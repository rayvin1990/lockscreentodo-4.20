"use client";

import { useEffect, useRef } from "react";

interface OscilloscopeMonitorProps {
  title: string;
  color?: "emerald" | "blue" | "purple" | "red";
  speed?: number;
  amplitude?: number;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export function OscilloscopeMonitor({
  title,
  color = "emerald",
  speed = 1,
  amplitude = 20,
  stats = [],
}: OscilloscopeMonitorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorMap = {
    emerald: "#10b981",
    blue: "#3b82f6",
    purple: "#a855f7",
    red: "#ef4444",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(100, 116, 139, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw multiple waves
      const waves = [
        { frequency: 0.02, phase: 0, opacity: 1 },
        { frequency: 0.03, phase: Math.PI / 4, opacity: 0.6 },
        { frequency: 0.01, phase: Math.PI / 2, opacity: 0.3 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = colorMap[color] + Math.floor(wave.opacity * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x++) {
          const y =
            canvas.height / 2 +
            Math.sin((x + offset) * wave.frequency + wave.phase) * amplitude * wave.opacity +
            Math.sin((x + offset * 1.5) * wave.frequency * 2) * (amplitude / 2) * wave.opacity;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      // Draw current value indicator
      const currentY =
        canvas.height / 2 +
        Math.sin(offset * 0.02) * amplitude +
        Math.sin(offset * 0.03) * (amplitude / 2);

      ctx.beginPath();
      ctx.fillStyle = colorMap[color];
      ctx.arc(canvas.width - 20, currentY, 4, 0, Math.PI * 2);
      ctx.fill();

      offset += speed;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, amplitude]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">{title}</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">LIVE</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={100}
          className="w-full h-24 bg-slate-900/50 rounded border border-slate-800"
        />
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="px-3 py-2 border-t border-slate-800 grid grid-cols-3 gap-2">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-xs text-slate-500 truncate">{stat.label}</div>
              <div className="text-sm font-mono text-slate-300">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
