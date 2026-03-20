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

// Helper function to convert hex to rgba
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

  // 测量每个任务的实际高度
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
          heights[task.id] = taskHeights[task.id];
        }
      }
    });

    if (hasChanged || Object.keys(taskHeights).length !== tasks.length) {
      setTaskHeights(heights);
    }
  }, [tasks, globalFontSize, taskHeights]);

  // 计算整体背景层的尺寸（基于实际测量的任务高度）
  const calculateBackgroundSize = () => {
    if (tasks.length === 0) return { width: 200, height: 60 };

    const padding = 10;
    const minWidth = 180;
    const taskSpacing = 12; // 任务之间的间距

    let maxWidth = minWidth;
    let totalHeight = padding * 2;

    tasks.forEach((task, index) => {
      // 计算每个任务的宽度
      const estimatedWidth = Math.min(
        task.text.length * globalFontSize * 0.6 + 40,
        240 // 最大宽度限制
      );
      if (estimatedWidth > maxWidth) maxWidth = estimatedWidth;

      // 使用实际测量的高度或默认高度
      const taskHeight = taskHeights[task.id] || globalFontSize * 1.8;
      totalHeight += taskHeight;

      // 添加任务间距（最后一个任务不需要）
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

    // 只允许Y轴移动（上下），不允许X轴移动（左右）
    const deltaY = e.clientY - dragStart.current.y;

    const newPosition = {
      x: startPosition.current.x, // 保持X轴不变
      y: startPosition.current.y + deltaY, // 只更新Y轴
    };

    // 实时更新父组件的位置
    onPositionChange(newPosition);
  }, [isDragging, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // 移除事件监听器
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging, handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPosition.current = position; // 使用 prop 中的位置作为起始位置

    // 添加全局事件监听器
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
      {/* 可拖拽的容器层 - 整个区域都可以拖动 */}
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
        {/* 整体背景层 */}
        <div
          className="absolute rounded-2xl left-1/2 transform -translate-x-1/2"
          style={{
            width: `${bgSize.width - 30}px`,
            height: `${bgSize.height}px`,
            top: 20,
            backgroundColor: hexToRgba("#ffffff", Math.min(backgroundOpacity, 0.95)), // Max 95% opacity to avoid transparency issues
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
            pointerEvents: 'none',
            backdropFilter: 'none', // Remove blur to prevent gray artifacts
          }}
        />

        {/* 任务列表 */}
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
            // 计算当前任务的Y位置（基于前一个任务的实际高度）
            let currentY = 0;
            const taskSpacing = 12; // 任务间距

            for (let i = 0; i < index; i++) {
              const prevTaskHeight = taskHeights[tasks[i].id] || globalFontSize * 1.8;
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
              {/* 任务文字 */}
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
