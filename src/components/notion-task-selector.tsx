"use client";

import React, { useState, useMemo } from "react";
import { Search, Check, Plus, X } from "lucide-react";
import { Button } from "~/components/ui/button";

export interface NotionTaskSelectorProps {
  tasks: Array<{
    id: string;
    text: string;
    dueDate?: string;
  }>;
  selectedTaskIds: Set<string>;
  onToggleTask: (taskId: string) => void;
  onAddSelectedToWallpaper: () => void;
  isLoading?: boolean;
}

export function NotionTaskSelector({
  tasks,
  selectedTaskIds,
  onToggleTask,
  onAddSelectedToWallpaper,
  isLoading = false,
}: NotionTaskSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.text.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const selectedCount = selectedTaskIds.size;

  const handleSelectAll = () => {
    filteredTasks.forEach(task => {
      if (!selectedTaskIds.has(task.id)) {
        onToggleTask(task.id);
      }
    });
  };

  const handleDeselectAll = () => {
    selectedTaskIds.forEach(id => {
      onToggleTask(id);
    });
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">Notion Tasks</span>
          <span className="text-xs text-gray-400">{tasks.length} total</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Select All / Deselect All */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSelectAll}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Select All
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={handleDeselectAll}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            {searchQuery ? "No tasks match your search" : "No tasks synced yet"}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredTasks.map((task) => {
              const isSelected = selectedTaskIds.has(task.id);
              const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                    isSelected ? "bg-brand-green/10" : ""
                  }`}
                  onClick={() => onToggleTask(task.id)}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? "bg-brand-green border-brand-green"
                        : "border-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-black" />}
                  </div>

                  {/* Task Text */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm truncate block ${
                        isSelected ? "text-brand-green" : "text-white"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  {/* Due Date Badge */}
                  {dueInfo && (
                    <span className="text-xs text-gray-400 bg-white/[0.05] px-2 py-0.5 rounded flex-shrink-0">
                      {dueInfo}
                    </span>
                  )}

                  {/* Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      isSelected
                        ? "bg-brand-green/20 text-brand-green hover:bg-brand-green/30"
                        : "bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.1]"
                    }`}
                    title={isSelected ? "Remove from selection" : "Add to selection"}
                  >
                    {isSelected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Selected: <span className="text-brand-green font-semibold">{selectedCount}</span>
          </span>
          <Button
            onClick={onAddSelectedToWallpaper}
            disabled={selectedCount === 0}
            size="sm"
            className="bg-brand-green hover:bg-brand-green/90 text-black font-semibold disabled:opacity-50"
          >
            Add to Wallpaper
          </Button>
        </div>
      </div>
    </div>
  );
}