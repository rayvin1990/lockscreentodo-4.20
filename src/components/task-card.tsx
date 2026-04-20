"use client";

import React, { useState, useRef, useEffect } from "react";

interface TaskCardProps {
  task: {
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
  };
  taskIndex?: number;
  isSelected: boolean;
  isPreview?: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TaskCardProps["task"]>) => void;
}

export function TaskCard({ task, taskIndex, isSelected, isPreview = false, onSelect, onUpdate }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentY, setCurrentY] = useState(task.y);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const startPositionY = useRef(0);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    if (!isDragging) {
      setCurrentY(task.y);
    }
  }, [task.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isSelected) {
      onSelect();
    }

    setIsDragging(true);
    dragStartY.current = e.clientY;
    startPositionY.current = currentY;

    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp as any);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();

    const deltaY = e.clientY - dragStartY.current;
    const newY = Math.max(20, Math.min(450, startPositionY.current + deltaY));

    setCurrentY(newY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    onUpdate({ y: currentY });
    setIsDragging(false);

    document.removeEventListener("mousemove", handleMouseMove as any);
    document.removeEventListener("mouseup", handleMouseUp as any);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="absolute cursor-move select-none touch-none task-card"
      style={{
        left: `${task.x}px`,
        transform: "translateX(-50%)",
        top: `${currentY}px`,
        opacity: task.opacity,
        zIndex: isSelected ? 20 : 10,
        userSelect: "none",
        pointerEvents: 'auto',
      }}
    >
      <div
        className={`px-4 py-2 rounded-2xl border-2 transition-all ${
          isPreview
            ? "border-transparent"
            : isSelected
            ? "border-brand-green shadow-lg"
            : "border-transparent hover:border-gray-500"
        } ${isDragging ? "cursor-grabbing" : ""}`}
        style={{
          backgroundColor: task.backgroundColor !== "transparent"
            ? hexToRgba(task.backgroundColor, Math.min(task.backgroundOpacity, 0.95))
            : undefined,
          boxShadow: task.backgroundColor !== "transparent"
            ? "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)"
            : undefined,
          color: task.color,
          fontSize: `${task.fontSize / 16}rem`,
          fontWeight: task.isBold ? "bold" : "normal",
          fontStyle: task.isItalic ? "italic" : "normal",
          textAlign: task.textAlign,
          fontFamily: task.fontFamily,
          whiteSpace: "pre",
          backdropFilter: 'none',
          maxWidth: isPreview ? "calc(100% - 4px)" : "none",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <span className={task.isCompleted ? "line-through" : ""} style={{ display: 'block' }}>
          {task.text}
        </span>
      </div>

      {isSelected && !isPreview && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="flex gap-1 mb-1">
            <div className="w-1 h-1 bg-brand-green rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          </div>
          <span className="text-xs text-brand-green font-medium">
            {isDragging ? "Moving" : "Drag"}
          </span>
        </div>
      )}
    </div>
  );
}