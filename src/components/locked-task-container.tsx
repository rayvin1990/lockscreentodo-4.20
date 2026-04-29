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
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function LockedTaskContainer({
  tasks,
  selectedTaskId,
  position,
  globalFontSize,
  backgroundOpacity,
  onSelect,
  onUpdate,
  onPositionChange,
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

  const calculateBackgroundSize = () => {
    if (tasks.length === 0) return { width: 220, height: 80 };

    const padding = 14;
    const minWidth = 196;
    const maxWidth = 224;
    const taskSpacing = 10;

    let calculatedWidth = minWidth;
    let totalHeight = padding * 2;

    tasks.forEach((task, index) => {
      const measuredWidth = taskMetrics[task.id]?.width;
      const estimatedWidth = task.text.length * globalFontSize * 0.54 + 52;
      const taskWidth = Math.min(Math.max(measuredWidth || estimatedWidth, minWidth), maxWidth);
      if (taskWidth > calculatedWidth) calculatedWidth = taskWidth;

      const taskHeight = taskMetrics[task.id]?.height || globalFontSize * 1.55;
      totalHeight += taskHeight;

      if (index < tasks.length - 1) {
        totalHeight += taskSpacing;
      }
    });

    return { width: calculatedWidth, height: totalHeight };
  };

  const bgSize = calculateBackgroundSize();

  const updateDragPosition = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const deltaY = clientY - dragStart.current.y;

    onPositionChange({
      x: 0,
      y: startPosition.current.y + deltaY,
    });
  }, [onPositionChange]);

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
    startPosition.current = { x: 0, y: position.y };

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
    startPosition.current = { x: 0, y: position.y };
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
    if (position.x !== 0) {
      onPositionChange({ x: 0, y: position.y });
    }
  }, [onPositionChange, position.x, position.y]);

  return (
    <div
      ref={containerRef}
      className="absolute select-none touch-none"
      style={{
        left: position.x,
        top: position.y,
        width: "100%",
        height: "100%",
        zIndex: 15,
      }}
    >
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          width: `${bgSize.width + 28}px`,
          height: `${bgSize.height + 52}px`,
          top: -20,
          cursor: "ns-resize",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        title="Drag up or down to adjust position"
      >
        <div
          className="absolute left-1/2 transform -translate-x-1/2 rounded-[22px] border border-white/15"
          style={{
            width: `${bgSize.width}px`,
            height: `${bgSize.height + 18}px`,
            top: 18,
            backgroundColor: hexToRgba("#080a0f", Math.max(0.18, Math.min(backgroundOpacity, 0.52))),
            boxShadow: "0 18px 60px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
            pointerEvents: "none",
            backdropFilter: "none",
          }}
        />

        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            width: `${bgSize.width - 26}px`,
            height: `${bgSize.height}px`,
            top: 28,
            pointerEvents: "none",
          }}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">
              Today
            </span>
            <span className="h-px flex-1 bg-white/16 ml-3" />
          </div>
          {tasks.map((task, index) => {
            let currentY = 28;
            const taskSpacing = 10;

            for (let i = 0; i < index; i++) {
              const prevTaskHeight = taskMetrics[tasks[i]!.id]?.height || globalFontSize * 1.8;
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
                <span className="mt-[0.45em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/72 shadow-[0_0_18px_rgba(255,255,255,0.24)]" />
                <span
                  ref={(el) => { taskRefs.current[task.id] = el; }}
                  className="pl-3"
                  style={{
                    color: task.color,
                    fontSize: `${globalFontSize / 16}rem`,
                    fontWeight: task.isBold ? 600 : 450,
                    fontStyle: task.isItalic ? "italic" : "normal",
                    fontFamily: task.fontFamily,
                    textDecoration: task.isCompleted ? "line-through" : "none",
                    opacity: task.isCompleted ? 0.55 : 1,
                    lineHeight: "1.38",
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
      </div>
    </div>
  );
}
