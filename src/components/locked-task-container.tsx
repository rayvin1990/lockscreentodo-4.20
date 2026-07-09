"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface Task {
  id: string;
  text: string;
  x: number;
  y: number;
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
}

interface LockedTaskContainerProps {
  tasks: Task[];
  selectedTaskId: string | null;
  position: { x: number; y: number };
  globalFontSize: number;
  backgroundOpacity: number;
  variant?: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  // Mobile: cap the pill height at PHONE_INNER_HEIGHT and enable internal
  // scroll. Desktop: leave the pill at its full natural height and let the
  // phone mockup's overflow-hidden clip anything that doesn't fit. No scroll
  // on desktop, the preview shows whatever fits in the phone.
  isMobile?: boolean;
}

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// RealisticPhoneMockup is 580px tall. Leave room for the phone's top bar /
// camera / dynamic-island and a small bottom margin, so the pill can scroll
// inside the phone without ever being clipped by the phone's overflow-hidden.
const PHONE_INNER_HEIGHT = 440;

export function LockedTaskContainer({
  tasks,
  selectedTaskId,
  position,
  globalFontSize,
  backgroundOpacity,
  variant,
  onSelect,
  onUpdate,
  onPositionChange,
  isMobile = false,
}: LockedTaskContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const taskRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  const [taskMetrics, setTaskMetrics] = useState<{ [key: string]: { width: number; height: number } }>({});

  useEffect(() => {
    const metrics: { [key: string]: { width: number; height: number } } = {};
    let hasChanged = false;

    tasks.forEach(task => {
      const element = taskRefs.current[task.id];
      if (element) {
        const height = element.offsetHeight;
        const width = element.scrollWidth;
        const previous = taskMetrics[task.id];
        if (!previous || height !== previous.height || width !== previous.width) {
          metrics[task.id] = { width, height };
          hasChanged = true;
        } else {
          metrics[task.id] = previous;
        }
      }
    });

    if (hasChanged || Object.keys(taskMetrics).length !== tasks.length) {
      setTaskMetrics(metrics);
    }
  }, [tasks, globalFontSize, taskMetrics]);

  const isCountdown = variant === "countdown";
  const isLargeReminder = variant === "large-reminder";
  const isUrgent = variant === "urgent";
  const isInterruption = variant === "interruption";
  const isOpsAlert = variant === "ops-alert";
  const isFitness = variant === "fitness";
  const isTemplateLayout = isCountdown || isLargeReminder || isUrgent || isInterruption || isOpsAlert;

  const calculateBackgroundSize = () => {
    if (isTemplateLayout) {
      return {
        width: isCountdown ? 238 : 246,
        height: isCountdown ? 292 : isInterruption ? 300 : 270,
      };
    }

    if (tasks.length === 0) return { width: 220, height: 80 };

    const padding = 14;
    const minWidth = isFitness ? 208 : 196;
    const maxWidth = isFitness ? 238 : 224;
    const taskSpacing = isFitness ? 12 : 10;

    let calculatedWidth = minWidth;
    let totalHeight = padding * 2;

    tasks.forEach((task, index) => {
      const measuredWidth = taskMetrics[task.id]?.width;
      const taskFontSize = task.fontSize || globalFontSize;
      const estimatedWidth = task.text.length * taskFontSize * 0.54 + 52;
      const taskWidth = Math.min(Math.max(measuredWidth || estimatedWidth, minWidth), maxWidth);
      if (taskWidth > calculatedWidth) calculatedWidth = taskWidth;

      const taskHeight = taskMetrics[task.id]?.height || taskFontSize * 1.55;
      totalHeight += taskHeight;

      if (index < tasks.length - 1) {
        totalHeight += taskSpacing;
      }
    });

    return { width: calculatedWidth, height: totalHeight };
  };

  const bgSize = calculateBackgroundSize();
  const primaryTask = tasks[0];
  const supportingTasks = tasks.slice(1, 4);

  // Mobile: cap the visible height of the pill so it always fits inside
  // the phone. Anything beyond scrolls inside the content area. Desktop:
  // use the full natural height; the phone mockup's overflow-hidden clips
  // anything that doesn't fit, no internal scroll.
  const visibleHeight = isMobile
    ? Math.min(bgSize.height, PHONE_INNER_HEIGHT)
    : bgSize.height;

  // The phone screen is 556px tall (288px wide minus 2*p-3 padding on the
  // phone, 580px tall minus the same). The pill's top is at position.y - 20
  // and its height is visibleHeight + 52, so the pill must stay within
  // [20, 576 - (visibleHeight + 52)] to fit. Clamp the rendered position
  // so the pill is always fully inside the canvas - otherwise dom-to-image
  // captures only the part of the pill inside the canvas, producing a
  // wallpaper with a clipped bottom (the "partial download" bug).
  const PILL_CANVAS_HEIGHT = 556;
  const pillHeight = visibleHeight + 52;
  const minPillY = 20;
  const maxPillY = PILL_CANVAS_HEIGHT - pillHeight + 20;
  const renderPosition = {
    x: position.x,
    y: Math.max(minPillY, Math.min(maxPillY, position.y)),
  };

  const updateDragPosition = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const deltaY = clientY - dragStart.current.y;
    const newY = startPosition.current.y + deltaY;
    const clampedY = Math.max(minPillY, Math.min(maxPillY, newY));

    onPositionChange({
      x: 0,
      y: clampedY,
    });
  }, [onPositionChange, minPillY, maxPillY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    updateDragPosition(e.clientX, e.clientY);
  }, [updateDragPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPosition.current = { x: 0, y: renderPosition.y };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    startPosition.current = { x: 0, y: renderPosition.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !isDraggingRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    updateDragPosition(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (position.x !== 0 || position.y !== renderPosition.y) {
      onPositionChange({ x: 0, y: renderPosition.y });
    }
  }, [onPositionChange, position.x, position.y, renderPosition.y]);

  return (
    <div
      ref={containerRef}
      className="absolute select-none touch-none"
      style={{
        left: renderPosition.x,
        top: renderPosition.y,
        width: "100%",
        height: "100%",
        zIndex: 15,
      }}
    >
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          width: `${bgSize.width + 28}px`,
          height: `${visibleHeight + 52}px`,
          top: -20,
          cursor: "ns-resize",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        title="Drag up or down to adjust position"
      >
        {isCountdown ? (
          <div
            className="absolute left-1/2 top-7 flex -translate-x-1/2 flex-col items-center text-center"
            style={{ width: `${bgSize.width}px`, pointerEvents: "none" }}
          >
            <div className="text-[86px] font-black leading-none text-white drop-shadow-2xl">
              {extractCountdownNumber(primaryTask?.text || "30")}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-white/62">
              days left
            </div>
            <div className="mt-9 w-full space-y-2.5">
              {supportingTasks.map((task) => (
                <TemplatePill key={task.id} task={task} onSelect={onSelect} />
              ))}
            </div>
          </div>
        ) : isTemplateLayout ? (
          <div
            className="absolute left-1/2 top-6 -translate-x-1/2 text-center"
            style={{ width: `${bgSize.width}px` }}
          >
            <div
              className={`rounded-[28px] border px-4 py-5 shadow-2xl ${
                isOpsAlert || isUrgent
                  ? "border-red-200/35 bg-red-950/55"
                  : "border-white/18 bg-black/32"
              }`}
              style={{
                boxShadow: "0 22px 70px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (primaryTask) onSelect(primaryTask.id);
              }}
            >
              {isOpsAlert || isUrgent ? (
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-red-200/30 bg-red-500/20 text-[24px] font-black text-red-100">
                  !
                </div>
              ) : null}
              <div
                className={`${isInterruption ? "text-[24px]" : "text-[28px]"} font-black leading-[1.08] text-white`}
                style={{
                  textShadow: "0 3px 28px rgba(0, 0, 0, 0.55)",
                  wordBreak: "break-word",
                }}
              >
                {primaryTask?.text}
              </div>
            </div>
            <div className="mt-5 space-y-2.5">
              {supportingTasks.map((task) => (
                <TemplatePill key={task.id} task={task} onSelect={onSelect} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div
              className="absolute left-1/2 transform -translate-x-1/2 rounded-[22px] border border-white/15"
              style={{
                width: `${bgSize.width}px`,
                height: `${visibleHeight + 18}px`,
                top: 18,
                backgroundColor: hexToRgba("#080a0f", Math.max(0.18, Math.min(backgroundOpacity, 0.52))),
                boxShadow: "0 18px 60px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                pointerEvents: "none",
                backdropFilter: "none",
              }}
            />

            <div
              className={`absolute left-1/2 transform -translate-x-1/2 ${
                isMobile ? "overflow-y-auto scrollbar-hide" : ""
              }`}
              style={{
                width: `${bgSize.width - 26}px`,
                height: `${visibleHeight}px`,
                top: 28,
                pointerEvents: "auto",
                ...(isMobile
                  ? { touchAction: "pan-y", WebkitOverflowScrolling: "touch" }
                  : {}),
              }}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">
                  {isFitness ? "Today's reps" : "Today"}
                </span>
                <span className="h-px flex-1 bg-white/16 ml-3" />
              </div>
              {tasks.map((task, index) => {
                let currentY = 28;
                const taskSpacing = isFitness ? 12 : 10;

                for (let i = 0; i < index; i++) {
                  const previousFontSize = tasks[i]!.fontSize || globalFontSize;
                  const prevTaskHeight = taskMetrics[tasks[i]!.id]?.height || previousFontSize * 1.8;
                  currentY += prevTaskHeight + taskSpacing;
                }

                return (
                  <div
                    key={task.id}
                    className={`flex items-start transition-all ${
                      selectedTaskId === task.id ? "opacity-100" : "opacity-90 hover:opacity-100"
                    }`}
                    style={{
                      position: "absolute",
                      top: currentY,
                      left: 0,
                      right: 0,
                      pointerEvents: "auto",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(task.id);
                    }}
                  >
                    <span className={`mt-[0.45em] h-1.5 w-1.5 flex-shrink-0 rounded-full ${isFitness ? "bg-emerald-200" : "bg-white/72"} shadow-[0_0_18px_rgba(255,255,255,0.24)]`} />
                    <span
                      ref={(el) => { taskRefs.current[task.id] = el; }}
                      className="pl-3"
                      style={{
                        color: task.color,
                        fontSize: `${task.fontSize || globalFontSize}px`,
                        fontWeight: task.isBold ? 700 : 450,
                        fontStyle: task.isItalic ? "italic" : "normal",
                        fontFamily: task.fontFamily,
                        textDecoration: task.isCompleted ? "line-through" : "none",
                        opacity: task.isCompleted ? 0.55 : 1,
                        lineHeight: "1.34",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        textAlign: "left",
                        display: "inline-block",
                        maxWidth: `${bgSize.width - 52}px`,
                        overflow: "visible",
                        textOverflow: "clip",
                        textShadow: "0 1px 18px rgba(0, 0, 0, 0.42)",
                      }}
                    >
                      {task.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TemplatePill({ task, onSelect }: { task: Task; onSelect: (id: string) => void }) {
  return (
    <div
      className="rounded-2xl border border-white/15 bg-white/14 px-4 py-3 text-left text-[13px] font-bold leading-tight text-white shadow-xl"
      style={{ pointerEvents: "auto", textShadow: "0 1px 16px rgba(0, 0, 0, 0.45)" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(task.id);
      }}
    >
      {task.text}
    </div>
  );
}

function extractCountdownNumber(text: string) {
  const match = text.match(/\d+/);
  return match?.[0] || "30";
}
