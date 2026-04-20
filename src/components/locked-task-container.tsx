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
  const dragStart = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const taskRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  const [taskHeights, setTaskHeights] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const heights: { [key: string]: number } = {};
    let hasChanged = false;

    tasks.forEach(task => {
      const element = taskRefs.current[task.id];
      if (element) {
        const height = element.offsetHeight;
        if (height !== taskHeights[task.id]) {
          heights[task.id] = height;
          hasChanged = true;
        } else {
          heights[task.id] = taskHeights[task.id] ?? 0;
        }
      }
    });

    if (hasChanged || Object.keys(taskHeights).length !== tasks.length) {
      setTaskHeights(heights);
    }
  }, [tasks, globalFontSize, taskHeights]);

  const calculateBackgroundSize = () => {
    if (tasks.length === 0) return { width: 200, height: 60 };

    const padding = 10;
    const minWidth = 180;
    const taskSpacing = 12;

    let maxWidth = minWidth;
    let totalHeight = padding * 2;

    tasks.forEach((task, index) => {
      const estimatedWidth = Math.min(
        task.text.length * globalFontSize * 0.6 + 40,
        240
      );
      if (estimatedWidth > maxWidth) maxWidth = estimatedWidth;

      const taskHeight = taskHeights[task.id] || globalFontSize * 1.8;
      totalHeight += taskHeight;

      if (index < tasks.length - 1) {
        totalHeight += taskSpacing;
      }
    });

    return { width: maxWidth, height: totalHeight };
  };

  const bgSize = calculateBackgroundSize();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();

    const deltaY = e.clientY - dragStart.current.y;

    const newPosition = {
      x: startPosition.current.x,
      y: startPosition.current.y + deltaY,
    };

    onPositionChange(newPosition);
  }, [isDragging, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging, handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPosition.current = position;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="absolute select-none touch-none"
      style={{
        left: position.x,
        top: position.y,
        width: '100%',
        height: '100%',
        zIndex: 15,
      }}
    >
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          width: `${bgSize.width + 40}px`,
          height: `${bgSize.height + 40}px`,
          top: -20,
          cursor: 'move',
        }}
        onMouseDown={handleMouseDown}
        title="Drag to adjust position"
      >
        <div
          className="absolute rounded-2xl left-1/2 transform -translate-x-1/2"
          style={{
            width: `${bgSize.width - 30}px`,
            height: `${bgSize.height}px`,
            top: 20,
            backgroundColor: hexToRgba("#ffffff", Math.min(backgroundOpacity, 0.95)),
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
            pointerEvents: 'none',
            backdropFilter: 'none',
          }}
        />

        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            width: `${bgSize.width - 30}px`,
            height: `${bgSize.height - 20}px`,
            top: 30,
            pointerEvents: 'none',
          }}
        >
          {tasks.map((task, index) => {
            let currentY = 0;
            const taskSpacing = 12;

            for (let i = 0; i < index; i++) {
              const prevTaskHeight = taskHeights[tasks[i]!.id] || globalFontSize * 1.8;
              currentY += prevTaskHeight + taskSpacing;
            }

            return (
              <div
                key={task.id}
                className={`flex items-center justify-center transition-all ${
                  selectedTaskId === task.id ? "opacity-100" : "opacity-90 hover:opacity-100"
                }`}
                style={{
                  position: "absolute",
                  top: currentY,
                  left: 0,
                  right: 0,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(task.id);
                }}
              >
              <span
                ref={(el) => { taskRefs.current[task.id] = el; }}
                className="text-center"
                style={{
                  color: task.color,
                  fontSize: `${globalFontSize / 16}rem`,
                  fontWeight: task.isBold ? "bold" : "normal",
                  fontStyle: task.isItalic ? "italic" : "normal",
                  fontFamily: task.fontFamily,
                  textDecoration: task.isCompleted ? "line-through" : "none",
                  opacity: task.isCompleted ? 0.6 : 1,
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  textAlign: "center",
                  display: "block",
                  maxWidth: `${bgSize.width - 20}px`,
                  padding: "4px 8px",
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