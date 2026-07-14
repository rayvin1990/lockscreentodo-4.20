"use client";

// VERSION MARKER: 2025-02-27-v2 - Wallpaper save feature added
console.log('Generator page loaded - VERSION 2025-02-27-v2');

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Smartphone, Plus, Trash2, X, Download, Share2, Twitter, Facebook, Linkedin, Send, ShoppingCart, Settings, GripVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { QRCodeSection } from "~/components/qr-code-section";
import { BackgroundSelector } from "~/components/background-selector";
import { SceneBackgroundSelector } from "~/components/scene-background-selector";
import { TaskCard } from "~/components/task-card";
import { LockedTaskContainer } from "~/components/locked-task-container";
import { InspirationPanel } from "~/components/inspiration-panel";
import { StyleControls } from "~/components/style-controls";
import { RealisticPhoneMockup } from "~/components/realistic-phone-mockup";
import { FeedbackWidget } from "~/components/feedback-widget";
import { UpgradeModalPricing } from "~/components/lockscreen/upgrade-modal-pricing";
import { UserStatusBadge } from "~/components/lockscreen/user-status-badge";
import { NotionAuthButton } from "~/components/notion-auth-button";
import { NotionTaskSelector } from "~/components/notion-task-selector";
import { useNotionSync, formatLastSyncTime } from "~/hooks/use-notion-sync";
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDownloadLimit } from "~/hooks/use-download-limit";
import { trackEvent } from "~/lib/analytics";
import { createClient } from "@supabase/supabase-js";
import type { AgentReminder } from "~/lib/agent-reminders";

// Initialize Supabase client safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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

interface WallpaperStyle {
  backgroundType: "preset" | "custom";
  backgroundImage: string;
  backgroundPosition: { x: number; y: number };
  backgroundScale: number;
  tasks: Task[];
  stickers: { id: string; emoji: string; x: number; y: number }[];
}

export default function GeneratorPage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('en');
  const { toast } = useToast();
  const { isSignedIn, isLoaded, userId, getToken } = useAuth();

  const { downloadLimitStatus, checkDownloadLimit, recordDownload } = useDownloadLimit();

  const fetchWithClerkAuth = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      const token = await getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return fetch(input, {
        ...init,
        credentials: "include",
        headers,
      });
    },
    [getToken],
  );

  const hasTrackedGeneratorView = useRef(false);

  useEffect(() => {
    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    setCurrentLang(lang);
  }, []);

  useEffect(() => {
    if (!isLoaded || hasTrackedGeneratorView.current) return;

    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    trackEvent("generator_view", {
      lang,
      signedIn: Boolean(isSignedIn),
    });
    hasTrackedGeneratorView.current = true;
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const handleOpenPricingModal = () => {
      setShowUpgradeModalPricing(true);
    };

    window.addEventListener('openPricingModal', handleOpenPricingModal);

    return () => {
      window.removeEventListener('openPricingModal', handleOpenPricingModal);
    };
  }, []);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phoneScreenRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showTasksSheet, setShowTasksSheet] = useState(false);
  const [showBackgroundSheet, setShowBackgroundSheet] = useState(false);
  const [showNotionSheet, setShowNotionSheet] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const handleTaskTapForEdit = useCallback((taskId: string) => {
    if (isMobile) {
      setEditingTaskId(taskId);
    } else {
      setSelectedTaskId(taskId);
    }
  }, [isMobile]);

  const [backgroundMode, setBackgroundMode] = useState<"scene" | "gradient" | "upload">("scene");

  const [wallpaperStyle, setWallpaperStyle] = useState<WallpaperStyle>({
    backgroundType: "preset",
    backgroundImage: "linear-gradient(160deg, #20251f 0%, #4b5549 46%, #111318 100%)",
    backgroundPosition: { x: 0, y: 0 },
    backgroundScale: 1,
    tasks: [],
    stickers: [],
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrUnavailableReason, setQrUnavailableReason] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isMouseInPhone, setIsMouseInPhone] = useState(false);
  const [showUpgradeModalPricing, setShowUpgradeModalPricing] = useState(false);

  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isImportingFromNotion, setIsImportingFromNotion] = useState(false);
  const [selectedNotionTaskIds, setSelectedNotionTaskIds] = useState<Set<string>>(new Set());
  const [showNotionTaskSelector, setShowNotionTaskSelector] = useState(false);

  const { tasks: syncedNotionTasks, isSyncing, lastSyncTime, syncNow } = useNotionSync(isNotionConnected);

  const handleToggleNotionTask = useCallback((taskId: string) => {
    setSelectedNotionTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const handleAddSelectedNotionTasksToWallpaper = useCallback(() => {
    const tasksToAdd = syncedNotionTasks
      .filter(t => selectedNotionTaskIds.has(t.id))
      .map((notionTask, index) => ({
        id: notionTask.id,
        text: notionTask.text,
        x: 132,
        y: wallpaperStyle.tasks.length * 30 + (index * 30),
        fontSize: 13,
        color: "#F8FAFC",
        backgroundColor: "transparent",
        backgroundOpacity: 0.5,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isCompleted: false,
        textAlign: "left" as const,
        fontFamily: "Inter, system-ui, sans-serif",
      }));

    setWallpaperStyle(prev => ({
      ...prev,
      tasks: [...prev.tasks, ...tasksToAdd],
    }));

    setSelectedNotionTaskIds(new Set());
    setShowNotionTaskSelector(false);

    trackEvent("notion_tasks_added_to_wallpaper", {
      selectedCount: tasksToAdd.length,
      syncedTaskCount: syncedNotionTasks.length,
    });

    toast({
      title: "Tasks Added!",
      description: `Added ${tasksToAdd.length} task(s) from Notion to your wallpaper.`,
    });
  }, [syncedNotionTasks, selectedNotionTaskIds, wallpaperStyle.tasks.length, toast]);

  const [tasksLocked, setTasksLocked] = useState(true);
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 200 });
  const [globalFontSize, setGlobalFontSize] = useState(13);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.34);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const isDraggingBgRef = useRef(false);
  const [dragStartBg, setDragStartBg] = useState({ x: 0, y: 0 });
  const dragStartBgRef = useRef({ x: 0, y: 0 });
  const [bgStartPos, setBgStartPos] = useState({ x: 0, y: 0 });
  const bgStartPosRef = useRef({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const initialPinchDistanceRef = useRef(0);
  const [initialScale, setInitialScale] = useState(1);
  const initialScaleRef = useRef(1);

  const selectedTask = wallpaperStyle.tasks.find(t => t.id === selectedTaskId);

  const applyAgentRemindersToWallpaper = useCallback((reminders: AgentReminder[]) => {
    const tasks = reminders.slice(0, 5).map((reminder, index) => ({
      id: reminder.id || `agent-${index}`,
      text: formatAgentReminderText(reminder),
      x: 132,
      y: 200 + (index * 30),
      fontSize: 13,
      color: "#F8FAFC",
      backgroundColor: "transparent",
      backgroundOpacity: 0.5,
      opacity: 1,
      isBold: true,
      isItalic: false,
      isCompleted: false,
      textAlign: "left" as const,
      fontFamily: "Inter, system-ui, sans-serif",
    }));

    if (tasks.length === 0) return;

    setWallpaperStyle(prev => ({
      ...prev,
      backgroundType: "preset",
      backgroundImage: prev.backgroundImage || "linear-gradient(160deg, #20251f 0%, #4b5549 46%, #111318 100%)",
      tasks,
    }));
    setTasksLocked(true);
    setContainerPosition({ x: 0, y: 300 });
    setGlobalFontSize(13);
    setBackgroundOpacity(0.34);
    setActiveTemplate(null);
    setSelectedTaskId(tasks[0]?.id || null);
  }, []);

  const applyTaskTextPresetToWallpaper = useCallback((
    taskText: string,
    scenario?: string | null,
    template?: string | null,
    background?: string | null,
  ) => {
    const lines = taskText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (lines.length === 0) return;

    const largeTemplates = new Set(["large-reminder", "urgent", "interruption", "ops-alert"]);
    const isLargeTemplate = largeTemplates.has(template || "");
    const isCountdown = template === "countdown";
    const isFitness = template === "fitness";
    const fontSize = isCountdown ? 22 : isLargeTemplate ? 20 : isFitness ? 16 : 13;
    const yStart = isCountdown ? 228 : isLargeTemplate ? 236 : 200;
    const rowGap = isLargeTemplate ? 42 : isFitness ? 36 : 30;
    const shouldMarkFirstDone = template === "calm-list" || !template;
    const backgroundImage = background || "linear-gradient(160deg, #20251f 0%, #4b5549 46%, #111318 100%)";

    const tasks = lines.map((text, index) => ({
      id: `preset-${index + 1}`,
      text,
      x: 132,
      y: yStart + (index * rowGap),
      fontSize: index === 0 && (isLargeTemplate || isCountdown || isFitness)
        ? fontSize
        : Math.max(13, fontSize - 4),
      color: "#F8FAFC",
      backgroundColor: "transparent",
      backgroundOpacity: 0.5,
      opacity: 1,
      isBold: true,
      isItalic: false,
      isCompleted: shouldMarkFirstDone && index === 0,
      textAlign: "left" as const,
      fontFamily: "Inter, system-ui, sans-serif",
    }));

    setWallpaperStyle(prev => ({
      ...prev,
      backgroundType: "preset",
      backgroundImage,
      tasks,
    }));
    setTasksLocked(true);
    setContainerPosition({ x: 0, y: isCountdown ? 248 : isLargeTemplate ? 270 : 300 });
    setGlobalFontSize(fontSize);
    setBackgroundOpacity(template === "ops-alert" ? 0.5 : isLargeTemplate ? 0.44 : 0.34);
    setActiveTemplate(template || null);
    setSelectedTaskId(tasks[0]?.id || null);

    toast({
      title: "Scenario loaded",
      description: scenario ? `Loaded ${scenario.replace(/-/g, " ")} tasks.` : "Loaded preset tasks.",
    });
  }, [toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldLoadAgentQueue = params.get("source") === "agent" || params.get("agentQueue") === "true";
    const taskPreset = params.get("tasks");

    if (taskPreset) {
      applyTaskTextPresetToWallpaper(
        taskPreset,
        params.get("scenario"),
        params.get("template"),
        params.get("bg"),
      );
      return;
    }

    if (!shouldLoadAgentQueue) return;

    let cancelled = false;

    async function loadAgentQueue() {
      try {
        const response = await fetch("/api/agent/reminders", { cache: "no-store" });
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !data.ok) {
          toast({
            variant: "destructive",
            title: "Could not load agent reminders",
            description: data.error || "Please check the MCP debug queue.",
          });
          return;
        }

        applyAgentRemindersToWallpaper(data.lockscreenQueue || []);
        toast({
          title: "Agent reminders loaded",
          description: "The active MCP queue is now in the lockscreen preview.",
        });
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load agent queue:", error);
        toast({
          variant: "destructive",
          title: "Could not load agent reminders",
          description: "Please try again from the MCP debug page.",
        });
      }
    }

    void loadAgentQueue();

    return () => {
      cancelled = true;
    };
  }, [applyAgentRemindersToWallpaper, applyTaskTextPresetToWallpaper, toast]);

  useEffect(() => {
    console.log('isMouseInPhone changed:', isMouseInPhone);
  }, [isMouseInPhone]);

  useEffect(() => {
    const phoneScreen = phoneScreenRef.current;
    if (!phoneScreen) return;

    const handleWheelNative = (e: WheelEvent) => {
      console.log('Native wheel event:', { isMouseInPhone, deltaY: e.deltaY });

      if (isMouseInPhone) {
        console.log('Preventing default scroll behavior');
        e.preventDefault();
        e.stopPropagation();

        if (wallpaperStyle.backgroundType === "custom" && wallpaperStyle.backgroundImage) {
          const zoomSensitivity = 0.001;
          const delta = e.deltaY * zoomSensitivity;
          const newScale = Math.max(0.5, Math.min(3, wallpaperStyle.backgroundScale - delta));

          console.log('Zooming background:', { oldScale: wallpaperStyle.backgroundScale, newScale });

          setWallpaperStyle(prev => ({
            ...prev,
            backgroundScale: newScale,
          }));
        } else {
          console.log('No custom background, just preventing scroll');
        }
      } else {
        console.log('Mouse not in phone, allowing page scroll');
      }
    };

    phoneScreen.addEventListener('wheel', handleWheelNative, { passive: false });

    return () => {
      phoneScreen.removeEventListener('wheel', handleWheelNative);
    };
  }, [isMouseInPhone, wallpaperStyle.backgroundType, wallpaperStyle.backgroundImage, wallpaperStyle.backgroundScale]);

  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    console.log('Background mouse down', { type: wallpaperStyle.backgroundType, hasImage: !!wallpaperStyle.backgroundImage });
    if (wallpaperStyle.backgroundType !== "custom" || !wallpaperStyle.backgroundImage) return;

    e.preventDefault();
    e.stopPropagation();

    isDraggingBgRef.current = true;
    setIsDraggingBg(true);
    dragStartBgRef.current = { x: e.clientX, y: e.clientY };
    bgStartPosRef.current = { ...wallpaperStyle.backgroundPosition };
    setDragStartBg({ x: e.clientX, y: e.clientY });
    setBgStartPos({ ...wallpaperStyle.backgroundPosition });

    console.log('Drag started at', { x: e.clientX, y: e.clientY, startPos: wallpaperStyle.backgroundPosition });

    document.addEventListener("mousemove", handleBackgroundMouseMove as any);
    document.addEventListener("mouseup", handleBackgroundMouseUp as any);
  };

  const handleBackgroundMouseMove = (e: MouseEvent) => {
    if (!isDraggingBgRef.current) return;

    const deltaX = e.clientX - dragStartBgRef.current.x;
    const deltaY = e.clientY - dragStartBgRef.current.y;

    const newPosition = {
      x: bgStartPosRef.current.x + deltaX,
      y: bgStartPosRef.current.y + deltaY,
    };

    console.log('Dragging to', { deltaX, deltaY, newPosition });

    setWallpaperStyle(prev => ({
      ...prev,
      backgroundPosition: newPosition,
    }));
  };

  const handleBackgroundMouseUp = () => {
    isDraggingBgRef.current = false;
    setIsDraggingBg(false);
    document.removeEventListener("mousemove", handleBackgroundMouseMove as any);
    document.removeEventListener("mouseup", handleBackgroundMouseUp as any);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (wallpaperStyle.backgroundType !== "custom" || !wallpaperStyle.backgroundImage) return;
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistanceRef.current = distance;
      initialScaleRef.current = wallpaperStyle.backgroundScale;
      setInitialPinchDistance(distance);
      setInitialScale(wallpaperStyle.backgroundScale);
    } else if (e.touches.length === 1) {
      isDraggingBgRef.current = true;
      setIsDraggingBg(true);
      dragStartBgRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      bgStartPosRef.current = { ...wallpaperStyle.backgroundPosition };
      setDragStartBg({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setBgStartPos({ ...wallpaperStyle.backgroundPosition });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (wallpaperStyle.backgroundType !== "custom" || !wallpaperStyle.backgroundImage) return;

    e.preventDefault();

    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / initialPinchDistanceRef.current;
      const newScale = Math.max(0.5, Math.min(3, initialScaleRef.current * scale));

      setWallpaperStyle(prev => ({
        ...prev,
        backgroundScale: newScale,
      }));
    } else if (e.touches.length === 1 && isDraggingBgRef.current) {
      const deltaX = e.touches[0].clientX - dragStartBgRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartBgRef.current.y;

      setWallpaperStyle(prev => ({
        ...prev,
        backgroundPosition: {
          x: bgStartPosRef.current.x + deltaX,
          y: bgStartPosRef.current.y + deltaY,
        },
      }));
    }
  };

  const handleTouchEnd = () => {
    isDraggingBgRef.current = false;
    setIsDraggingBg(false);
    setInitialPinchDistance(0);
  };

  interface SortableTaskItemProps {
    task: Task;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onUpdate: (id: string, updates: Partial<Task>) => void;
  }

  const SortableTaskItem = ({ task, index, isSelected, onSelect, onDelete, onUpdate }: SortableTaskItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const [editingText, setEditingText] = useState(task.text);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setEditingText(task.text);
    }, [task.text]);

    const handleBlur = () => {
      if (editingText !== task.text) {
        onUpdate(task.id, { text: editingText });
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        (e.currentTarget as HTMLElement).blur();
      } else if (e.key === 'Escape') {
        setEditingText(task.text);
        (e.currentTarget as HTMLElement).blur();
      }
    };

    const handleContainerClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        onSelect();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        onClick={handleContainerClick}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          isSelected
            ? "bg-brand-green/20 border-2 border-brand-green"
            : "bg-brand-bg border-2 border-gray-700 hover:border-gray-600"
        }`}
      >
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            suppressHydrationWarning
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 flex-shrink-0 mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`w-full bg-transparent text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-green rounded px-1 py-0.5 ${
                task.isCompleted ? "line-through opacity-50" : ""
              }`}
              placeholder="Enter task..."
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-400 hover:text-red-300 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = wallpaperStyle.tasks.findIndex(t => t.id === active.id);
      const newIndex = wallpaperStyle.tasks.findIndex(t => t.id === over.id);

      const newTasks = arrayMove(wallpaperStyle.tasks, oldIndex, newIndex);

      setWallpaperStyle(prev => ({
        ...prev,
        tasks: newTasks
      }));

      if (userId) {
        await saveTasksToSupabase(userId, newTasks);
      }
    }
  };

  const addTask = () => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: "New task",
      x: 132,
      y: wallpaperStyle.tasks.length * 30,
      fontSize: 13,
      color: "#F8FAFC",
      backgroundColor: "transparent",
      backgroundOpacity: 0.5,
      opacity: 1,
      isBold: true,
      isItalic: false,
      isCompleted: false,
      textAlign: "left",
      fontFamily: "Inter, system-ui, sans-serif",
    };
    setWallpaperStyle(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    setSelectedTaskId(newTask.id);
  };

  const deleteTask = (id: string) => {
    setWallpaperStyle(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setWallpaperStyle(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWallpaperStyle(prev => ({
          ...prev,
          backgroundType: "custom",
          backgroundImage: event.target?.result as string,
          backgroundPosition: { x: 0, y: 0 },
          backgroundScale: 1,
        }));
        setHasUploadedImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    setWallpaperStyle(prev => ({
      ...prev,
      backgroundType: "preset",
      backgroundImage: "linear-gradient(160deg, #20251f 0%, #4b5549 46%, #111318 100%)",
      backgroundPosition: { x: 0, y: 0 },
      backgroundScale: 1,
    }));
    setHasUploadedImage(false);
  };

  const applyInspiration = (template: Task[]) => {
    setWallpaperStyle(prev => ({ ...prev, tasks: template }));
    setShowInspiration(false);
  };

  const importFromNotion = async () => {
    if (!isSignedIn) {
      trackEvent("notion_import_blocked", {
        reason: "signed_out",
      });
      toast({
        variant: "destructive",
        title: "Please sign in",
        description: "You need to sign in to import tasks from Notion.",
      });
      return;
    }

    setIsImportingFromNotion(true);

    try {
      const NOTION_DATABASE_ID =
        process.env.NEXT_PUBLIC_NOTION_DEFAULT_DATABASE_ID ||
        "3115c404-ce33-803c-a01e-000b175c8c90";
      const response = await fetchWithClerkAuth(
        `/api/notion/tasks?databaseId=${NOTION_DATABASE_ID}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || "Failed to import tasks";
        const rawCount = errorData?.debug?.rawSearchCount ?? null;
        const sampleTitles = (errorData?.debug?.rawResults ?? [])
          .slice(0, 5)
          .map((r: { title: string }) => r.title)
          .join(", ");
        const detail =
          rawCount === 0
            ? "Notion returned 0 sources."
            : rawCount === null
            ? "Notion search failed."
            : `Notion returned ${rawCount} sources: ${sampleTitles || "(no titles)"}`;
        console.error(
          "Import from Notion error:",
          errorMessage,
          "debug:",
          JSON.stringify(errorData, null, 2)
        );
        throw new Error(
          `${errorMessage} — ${detail} — ${errorData?.debug?.hint ?? ""}`
        );
      }

      const data = await response.json();

      if (!data.success || !data.tasks || data.tasks.length === 0) {
        trackEvent("notion_import_empty", {
          signedIn: Boolean(isSignedIn),
        });
        const dbName = (data as { databaseName?: string }).databaseName ?? "(unknown)";
        const sourceType = (data as { sourceType?: string }).sourceType ?? "?";
        console.log(
          "[Notion] selected source but no tasks:",
          { databaseName: dbName, sourceType, taskCount: data.tasks?.length ?? 0 }
        );
        toast({
          variant: "destructive",
          title: "No tasks found",
          description:
            (data.message || "Could not find any tasks in your Notion databases.") +
            ` (source: "${dbName}" [${sourceType}])`,
        });
        return;
      }

      const importedTasks: Task[] = data.tasks.map((notionTask: any, index: number) => ({
        id: notionTask.id,
        text: notionTask.text,
        x: 132,
        y: 200 + (index * 30),
        fontSize: 13,
        color: "#F8FAFC",
        backgroundColor: "transparent",
        backgroundOpacity: 0.5,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isCompleted: false,
        textAlign: "left" as const,
        fontFamily: "Inter, system-ui, sans-serif",
      }));

      setWallpaperStyle(prev => ({ ...prev, tasks: importedTasks }));

      toast({
        title: "Tasks Imported!",
        description: `Imported ${data.tasks.length} tasks from "${data.databaseName}". Data is only used for your personal wallpaper.`,
      });

      trackEvent("notion_import_success", {
        taskCount: data.tasks.length,
        databaseNamePresent: Boolean(data.databaseName),
      });

    } catch (error) {
      console.error("Import from Notion error:", error);
      trackEvent("notion_import_failure", {
        signedIn: Boolean(isSignedIn),
        reason: error instanceof Error ? error.message : "unknown",
      });
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not import tasks from Notion.",
      });
    } finally {
      setIsImportingFromNotion(false);
    }
  };

  const hasLoadedTasksRef = useRef(false);
  const isNotionConnectedRef = useRef(false);
  const notionImportDoneRef = useRef(false);

  const loadTasksFromServer = async (userId: string) => {
    if (hasLoadedTasksRef.current || notionImportDoneRef.current) {
      console.log('Tasks already loaded or Notion import done, skipping');
      return;
    }

    try {
      const NOTION_DATABASE_ID =
        process.env.NEXT_PUBLIC_NOTION_DEFAULT_DATABASE_ID ||
        "3115c404-ce33-803c-a01e-000b175c8c90";
      const response = await fetchWithClerkAuth(
        `/api/notion/tasks?databaseId=${NOTION_DATABASE_ID}`
      );
      if (!response.ok) {
        const status = response.status;
        if (status === 400) {
          console.log('Notion not connected, skipping task load');
        } else if (status === 404) {
          console.log('No databases found in Notion, skipping task load');
        } else {
          console.error('Failed to load tasks from server:', status);
        }
        hasLoadedTasksRef.current = true;
        return;
      }

      const data = await response.json();
      if (data?.success && Array.isArray(data.tasks) && data.tasks.length > 0) {
        const tasks: Task[] = data.tasks.map((task: any, index: number) => ({
          id: task.id,
          text: task.text,
          x: 132,
          y: 200 + (index * 30),
          fontSize: 13,
          color: "#F8FAFC",
          backgroundColor: "transparent",
          backgroundOpacity: 0.5,
          opacity: 1,
          isBold: true,
          isItalic: false,
          isCompleted: false,
          textAlign: "left" as const,
          fontFamily: "Inter, system-ui, sans-serif",
        }));

        setWallpaperStyle(prev => ({ ...prev, tasks }));
        console.log('Loaded tasks from Notion:', tasks.length);
      } else {
        console.log('No tasks returned from Notion, using local state');
      }
      hasLoadedTasksRef.current = true;
    } catch (error) {
      console.error('Failed to load tasks from server:', error);
      hasLoadedTasksRef.current = true;
    }
  };

  const saveTasksToSupabase = async (userId: string, tasks: Task[]) => {
    if (!supabase) return;
    try {
      const validTasks = tasks.filter(task => task.text && task.text.trim() !== '');
      const uniqueTasks = Array.from(
        new Map(validTasks.map(task => [task.id, task])).values()
      );

      const currentTaskIds = uniqueTasks.map(task => task.id);

      // Soft delete tasks that are no longer in wallpaper (set deleted_at instead of hard delete)
      if (currentTaskIds.length > 0) {
        const { error: softDeleteError } = await supabase
          .from('tasks')
          .update({ deleted_at: new Date().toISOString() })
          .eq('user_id', userId)
          .not('notion_task_id', 'in', `(${currentTaskIds.map(id => `'${id}'`).join(',')})`)
          .is('deleted_at', null);

        if (softDeleteError) {
          console.error('Failed to soft delete removed tasks:', softDeleteError);
        }
      } else {
        // Soft delete all tasks if no tasks in wallpaper
        const { error: softDeleteAllError } = await supabase
          .from('tasks')
          .update({ deleted_at: new Date().toISOString() })
          .eq('user_id', userId)
          .is('deleted_at', null);

        if (softDeleteAllError) {
          console.error('Failed to soft delete all tasks:', softDeleteAllError);
        }
        console.log('No tasks to save');
        return;
      }

      const tasksToUpsert = uniqueTasks.map(task => ({
        user_id: userId,
        text: task.text,
        completed: task.isCompleted || false,
        notion_task_id: task.id,
        // Preserve existing notion_database_id and notion_last_edited_time
        // by using a raw update that doesn't overwrite them if already set
      }));

      // Upsert tasks, preserving notion sync metadata
      for (const task of tasksToUpsert) {
        const { error: upsertError } = await supabase
          .from('tasks')
          .upsert(task, {
            onConflict: 'notion_task_id',
            ignoreDuplicates: false,
          });

        if (upsertError) {
          console.error('Failed to upsert task:', upsertError);
        }
      }

      console.log('Saved tasks to Supabase:', tasksToUpsert.length);
    } catch (error) {
      console.error('Failed to save tasks to Supabase:', error);
    }
  };

  useEffect(() => {
    // Wait for Clerk to finish loading before running any logic.
    // Using isLoaded instead of isSignedIn prevents the effect from
    // re-running (and cancelling polling) when isSignedIn transitions
    // from undefined to true after Clerk initializes.
    if (!isLoaded || !isSignedIn) return;

    const urlParams = new URLSearchParams(window.location.search);
    const isOAuthCallback = urlParams.get("notion") === "connected";

    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const checkNotionConnection = async () => {
      try {
        const response = await fetchWithClerkAuth("/api/user/notion-status");
        if (response.ok) {
          const data = await response.json();
          // Use ref to avoid stale closure: the OAuth path may have already
          // set isNotionConnected to true before this async call returns.
          const wasConnected = isNotionConnectedRef.current;

          // Only update state if the value actually changed. This prevents
          // the OAuth path's setIsNotionConnected(true) from being overridden
          // when notion-status returns false (token in Neon vs Supabase).
          if (data.connected !== wasConnected) {
            setIsNotionConnected(data.connected);
            isNotionConnectedRef.current = data.connected;
          }

          if (data.connected && !wasConnected) {
            // Already connected (not via OAuth callback) — import immediately
            void importFromNotion();
          }
        }
      } catch (error) {
        console.error("Failed to check Notion status:", error);
      }
    };

    // Fire-and-forget: check connection status in the background.
    // For the OAuth callback path, this won't interfere because
    // isNotionConnectedRef is already true by the time this returns.
    checkNotionConnection();

    if (isOAuthCallback) {
      setIsNotionConnected(true);
      isNotionConnectedRef.current = true;
      trackEvent("notion_oauth_return", { status: "connected" });
      toast({
        title: "Notion Connected!",
        description: "Importing your tasks now...",
      });
      window.history.replaceState({}, "", window.location.pathname);

      // Poll /api/notion/tasks with retries instead of a single fragile setTimeout.
      // The OAuth token may take a moment to propagate through the DB.
      let attempt = 0;
      const maxAttempts = 10;
      const pollInterval = 1000;

      const tryImport = async () => {
        if (cancelled) return;
        attempt++;
        console.log("[Notion OAuth] Import attempt " + attempt + "/" + maxAttempts);

        try {
          const NOTION_DATABASE_ID =
            process.env.NEXT_PUBLIC_NOTION_DEFAULT_DATABASE_ID ||
            "3115c404-ce33-803c-a01e-000b175c8c90";
          const response = await fetchWithClerkAuth(
            `/api/notion/tasks?databaseId=${NOTION_DATABASE_ID}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.tasks && data.tasks.length > 0) {
              console.log("[Notion OAuth] Success: " + data.tasks.length + " tasks from \"" + data.databaseName + "\"");
              const importedTasks = data.tasks.map((notionTask: any, index: number) => ({
                id: notionTask.id,
                text: notionTask.text,
                x: 132,
                y: 200 + (index * 30),
                fontSize: 13,
                color: "#F8FAFC",
                backgroundColor: "transparent",
                backgroundOpacity: 0.5,
                opacity: 1,
                isBold: true,
                isItalic: false,
                isCompleted: false,
                textAlign: "left" as const,
                fontFamily: "Inter, system-ui, sans-serif",
              }));
              setWallpaperStyle(prev => ({ ...prev, tasks: importedTasks }));
              notionImportDoneRef.current = true;
              toast({
                title: "Tasks Imported!",
                description: "Imported " + data.tasks.length + " tasks from \"" + data.databaseName + "\".",
              });
              trackEvent("notion_import_success", {
                taskCount: data.tasks.length,
                databaseNamePresent: Boolean(data.databaseName),
              });
              return;
            }

            if (data.tasks && data.tasks.length === 0) {
              console.log("[Notion OAuth] Database \"" + data.databaseName + "\" has no tasks");
              toast({
                title: "No tasks found",
                description: "Database \"" + data.databaseName + "\" is empty. Add tasks in Notion first.",
              });
              return;
            }

            console.log("[Notion OAuth] Response not ready:", data);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.log(
              "[Notion OAuth] API returned " + response.status + ":",
              JSON.stringify(errorData, null, 2)
            );

            if (response.status === 404) {
              const rawCount =
                errorData?.debug?.rawSearchCount ?? null;
              const sampleTitles = (errorData?.debug?.rawResults ?? [])
                .slice(0, 5)
                .map((r: { title: string }) => r.title)
                .join(", ");
              const detail =
                rawCount === 0
                  ? "Notion returned 0 sources (no page/database shared with the integration)."
                  : rawCount === null
                  ? "Notion search failed."
                  : `Notion returned ${rawCount} sources: ${sampleTitles || "(no titles)"}`;
              toast({
                variant: "destructive",
                title: "No databases found",
                description:
                  (errorData.message || "Create a database in Notion first.") +
                  " — " +
                  detail +
                  " — debug: " +
                  (errorData?.debug?.hint ?? ""),
              });
              return;
            }
          }
        } catch (err) {
          console.error("[Notion OAuth] Attempt " + attempt + " failed:", err);
        }

        if (attempt < maxAttempts && !cancelled) {
          pollTimer = setTimeout(tryImport, pollInterval);
        } else if (!cancelled) {
          console.error("[Notion OAuth] All " + maxAttempts + " attempts failed");
          toast({
            variant: "destructive",
            title: "Import timed out",
            description: "Could not fetch your Notion tasks. Try clicking 'Select Tasks from Notion' manually.",
          });
        }
      };

      pollTimer = setTimeout(tryImport, 500);
    }

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [isLoaded, fetchWithClerkAuth]);

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    loadTasksFromServer(userId);
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    const timeoutId = setTimeout(() => {
      saveTasksToSupabase(userId, wallpaperStyle.tasks);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [wallpaperStyle.tasks, isSignedIn, userId]);

  const generateWallpaper = async () => {
    console.log('Starting wallpaper generation...');

    if (!isLoaded) {
      toast({
        variant: "destructive",
        title: "Authentication is still loading",
        description: "Please try again in a moment",
      });
      return;
    }

    const authToken = await getToken();

    if (!authToken) {
      console.log('User not authenticated');
      toast({
        variant: "destructive",
        title: "Please sign in first",
        description: "Sign in to generate wallpapers",
      });
      router.push(`/${currentLang}/sign-in`);
      return;
    }

    if (wallpaperStyle.tasks.length === 0) {
      console.log('No tasks found');
      toast({
        variant: "destructive",
        title: "No tasks",
        description: "Please add at least one task",
      });
      return;
    }

    let limitResponse: Response;
    let limitData: any = {};

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      limitResponse = await fetchWithClerkAuth("/api/generate/check-limit", {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      clearTimeout(timeout);

      limitData = await limitResponse.json();
    } catch (fetchError) {
      console.error("check-limit fetch failed:", fetchError);
      toast({
        variant: "destructive",
        title: "Request timeout",
        description: "Please try again",
      });
      return;
    }

    if (!limitResponse.ok || !limitData.canGenerate) {
      if (limitData.reason === 'TRIAL_EXPIRED' || limitData.reason === 'FREE_USER') {
        setShowUpgradeModalPricing(true);
        toast({
          variant: "destructive",
          title: "Trial period has ended",
          description: "Please upgrade to Pro to continue generating wallpapers",
        });
      } else if (limitData.reason === 'NOT_AUTHENTICATED' || limitData.isGuest) {
        // User not logged in - show toast but don't redirect
        // Let them decide when to sign in
        toast({
          variant: "destructive",
          title: "Please sign in first",
          description: "Sign in to generate wallpapers",
        });
        // Don't redirect - just show the error
        // User can click Sign In button on the page
      } else {
        console.error("Limit check failed:", JSON.stringify(limitData));
        toast({
          variant: "destructive",
          title: limitData.reason || "Failed to check limit",
          description: limitData.error || limitData.message || "Please try again later",
        });
      }
      return;
    }

    console.log("Limit check passed:", limitData);

    setIsGenerating(true);
    setShareUrl(null);
    setQrUnavailableReason(null);

    try {
      const domtoimage = require("dom-to-image") as typeof import("dom-to-image");
      const toPng = (domtoimage as unknown as { toPng: Function }).toPng;

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas ref is null');
        throw new Error("Canvas not found - please try refreshing the page");
      }

      const rect = canvas.getBoundingClientRect();
      const scale = 2;

      console.log(`Canvas dimensions: ${rect.width}x${rect.height}`);
      console.log(`Canvas position: x=${rect.x}, y=${rect.y}`);

      if (rect.width === 0 || rect.height === 0) {
        throw new Error("Canvas has no dimensions - the element may be hidden");
      }

      const dataUrl = await toPng(canvas, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 0.85,
        bgcolor: "#0F1117",
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backdropFilter: 'none !important',
          webkitBackdropFilter: 'none !important',
        },
      });

      console.log('Image generated successfully');

      const base64Data = dataUrl.split(',')[1];

      console.log(`Image size: ${Math.round(base64Data.length * 0.75 / 1024)}KB`);

      // Upload to Cloudflare R2
      console.log('Uploading to Cloudflare R2...');
      let imageUrl = '';
      let uploadSuccess = false;
      let uploadErrorMessage = '';
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries && !uploadSuccess; attempt++) {
        try {
          console.log(`R2 upload attempt ${attempt}/${maxRetries}`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          const r2Response = await fetchWithClerkAuth('/api/upload/r2', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Data,
              filename: `wallpaper-${Date.now()}.png`,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          console.log(`R2 response status: ${r2Response.status}`);

          if (!r2Response.ok) {
            const errorText = await r2Response.text();
            console.error(`R2 upload failed (attempt ${attempt}):`, errorText);
            uploadErrorMessage = errorText;

            if (errorText.includes("Storage not configured")) {
              break;
            }

            if (attempt < maxRetries) {
              console.log(`Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error(`Failed to upload to R2 (Status: ${r2Response.status})`);
          }

          const r2Data = await r2Response.json();
          console.log('R2 response data:', r2Data);

          if (!r2Data.success || !r2Data.url) {
            console.error(`R2 returned unsuccessful response (attempt ${attempt})`);

            if (attempt < maxRetries) {
              console.log(`Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error('R2 upload failed');
          }

          imageUrl = r2Data.url;
          uploadSuccess = true;
          console.log('Upload successful:', imageUrl);

        } catch (uploadError: any) {
          console.error(`Upload attempt ${attempt} failed:`, uploadError);

          if (uploadError.name === 'AbortError') {
            console.error('Upload timeout (30s)');
            uploadErrorMessage = 'Upload timeout';
            if (attempt < maxRetries) {
              console.log(`Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            break;
          }

          uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Upload failed';

          if (attempt === maxRetries) {
            break;
          }
        }
      }

      if (!uploadSuccess || !imageUrl) {
        console.warn('R2 upload unavailable, continuing with local download fallback:', uploadErrorMessage);
        imageUrl = '';
      }

      setShareUrl(uploadSuccess ? imageUrl : null);
      setQrUnavailableReason(uploadSuccess ? null : "QR code needs a public storage URL. Configure R2 to enable phone scanning.");

      console.log('Recording wallpaper generation...');
      try {
        const recordResponse = await fetchWithClerkAuth('/api/generate/record-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response status:', recordResponse.status, recordResponse.statusText);

        const responseText = await recordResponse.text();
        console.log('Response body:', responseText);

        if (recordResponse.ok) {
          console.log('Wallpaper generation recorded successfully');
        } else {
          console.error('Failed to record generation. Status:', recordResponse.status, 'Response:', responseText);
        }
      } catch (error) {
        console.error('Error recording generation:', error);
      }

      if (uploadSuccess && imageUrl) {
        console.log('Saving wallpaper to history...');
        try {
          const saveWallpaperResponse = await fetchWithClerkAuth('/api/wallpaper/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: imageUrl,
              taskCount: wallpaperStyle.tasks.length,
            }),
          });

          if (saveWallpaperResponse.ok) {
            console.log('Wallpaper saved to history successfully');
          } else {
            const errorText = await saveWallpaperResponse.text();
            console.error('Failed to save wallpaper to history. Status:', saveWallpaperResponse.status, 'Response:', errorText);
          }
        } catch (error) {
          console.error('Error saving wallpaper to history:', error);
        }
      } else {
        console.log('Skipping wallpaper history save because no remote image URL is available');
      }

      await recordDownload();

      setShowSuccessModal(true);
      trackEvent("wallpaper_generate_success", {
        taskCount: wallpaperStyle.tasks.length,
        signedIn: isSignedIn,
      });

      toast({
        title: "Wallpaper generated successfully!",
        description: uploadSuccess ? "Scan QR code to download" : "Download is ready. QR scanning needs R2 storage.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // @ts-expect-error dom-to-image types mismatch
    const { toPng } = await import("dom-to-image");
    const rect = canvas.getBoundingClientRect();
    const scale = 2;

    let dataUrl: string;
    try {
      dataUrl = await toPng(canvas, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 1,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backdropFilter: 'none !important',
          webkitBackdropFilter: 'none !important',
        },
      });
    } catch (err) {
      console.error("Failed to render wallpaper to PNG:", err);
      toast({
        title: "Download failed",
        description: "Could not generate the wallpaper image. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `lockscreen-${Date.now()}.png`, { type: "image/png" });

    // Try Web Share API first. On iOS 12.1+ and modern Android Chrome, this opens
    // the native share sheet which includes "Save Image" / "Save to Photos",
    // giving the user a real one-tap "save to phone" experience.
    if (
      typeof navigator !== "undefined" &&
      "canShare" in navigator &&
      typeof navigator.share === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: "Lock Screen Wallpaper",
          text: "My Notion tasks as a lock screen",
        });
        await recordDownload();
        trackEvent("wallpaper_download_success", {
          taskCount: wallpaperStyle.tasks.length,
          signedIn: isSignedIn,
          method: "web_share_api",
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.warn("Web Share API failed, falling back to download link:", err);
      }
    }

    // Fallback: <a download> for desktop and older browsers. On mobile this still
    // opens the image in a new tab where the user can long-press to save.
    const link = document.createElement("a");
    link.download = file.name;
    link.href = dataUrl;
    link.click();

    await recordDownload();
    trackEvent("wallpaper_download_success", {
      taskCount: wallpaperStyle.tasks.length,
      signedIn: isSignedIn,
      method: "download_link",
    });
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const domtoimage = await import("dom-to-image") as unknown as { toPng: Function };
      const toPng = domtoimage.toPng;
      const rect = canvas.getBoundingClientRect();
      const scale = 2;

      const dataUrl = await toPng(canvas, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 1,
        bgcolor: "#0F1117",
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        },
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'wallpaper.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Lockscreen Todo Wallpaper",
          text: currentLang === 'zh' ? "查看我的自定义待办壁纸！" : "Check my custom todo wallpaper!",
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "My Lockscreen Todo Wallpaper",
          text: currentLang === 'zh' ? "查看我的自定义待办壁纸！" : "Check my custom todo wallpaper!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: currentLang === 'zh' ? "链接已复制！" : "Link copied!",
          description: currentLang === 'zh' ? "分享给朋友" : "Share it with your friends",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      if ((error as Error).name !== "AbortError") {
        toast({
          variant: "destructive",
          title: currentLang === 'zh' ? "分享失败" : "Share failed",
          description: currentLang === 'zh' ? "请重试" : "Please try again",
        });
      }
    }
  };

  const shareText = "Check out my custom lockscreen todo wallpaper!";
  const shareUrlEncoded = shareUrl ? encodeURIComponent(shareUrl) : '';
  const shareTextEncoded = encodeURIComponent(shareText);

  const openTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${shareUrlEncoded}`, '_blank');
  };

  const openFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`, '_blank');
  };

  const openLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`, '_blank');
  };

  const openWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${shareTextEncoded}%20${shareUrlEncoded}`, '_blank');
  };

  const openTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTextEncoded}`, '_blank');
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <nav className="fixed top-0 w-full bg-brand-bg/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link href={`/${currentLang}`} className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <UserStatusBadge />

              <Button
                onClick={() => window.location.href = `/${currentLang}/dashboard/settings`}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setShowUpgradeModalPricing(true)}
                className="bg-white hover:bg-white/90 text-black font-semibold"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {currentLang === "zh" ? "?? Pro ?" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] lg:h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto h-full relative">
          {/* Mobile: full-screen preview + bottom toolbar. Desktop: 2-column grid below. */}
          <div className="lg:hidden flex flex-col h-full">
            <div className="flex-1 min-h-0 flex flex-col px-1">
              <h3 className="text-base font-bold text-white mb-0.5">Preview</h3>
              <p className="text-[11px] text-gray-400 mb-2">Tap any text to edit</p>
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <RealisticPhoneMockup
                  ref={phoneScreenRef}
                  onScreenMouseEnter={() => setIsMouseInPhone(true)}
                  onScreenMouseLeave={() => setIsMouseInPhone(false)}
                >
                  <div
                    ref={canvasRef}
                    className="w-full h-full relative"
                    style={{
                      background: wallpaperStyle.backgroundType === "preset" && wallpaperStyle.backgroundImage
                        ? wallpaperStyle.backgroundImage
                        : wallpaperStyle.backgroundType === "custom"
                        ? "transparent"
                        : "#1f2937",
                    }}
                  >
                    {wallpaperStyle.backgroundType === "custom" && wallpaperStyle.backgroundImage && (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${wallpaperStyle.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transform: `translate(${wallpaperStyle.backgroundPosition.x}px, ${wallpaperStyle.backgroundPosition.y}px) scale(${wallpaperStyle.backgroundScale})`,
                            transformOrigin: 'center center',
                            zIndex: 0,
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{ zIndex: 5 }}
                          onMouseDown={(e) => {
                            const target = e.target as HTMLElement;
                            if (!target.closest('.task-card')) {
                              handleBackgroundMouseDown(e);
                            }
                          }}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        />
                      </>
                    )}

                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        zIndex: 6,
                        background:
                          "linear-gradient(to bottom, rgba(3, 7, 18, 0.38) 0%, rgba(3, 7, 18, 0.06) 34%, rgba(3, 7, 18, 0.22) 64%, rgba(3, 7, 18, 0.72) 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        zIndex: 7,
                        background:
                          "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.16), transparent 28%), linear-gradient(to right, rgba(0,0,0,0.18), transparent 24%, transparent 76%, rgba(0,0,0,0.18))",
                      }}
                    />

                    <LockedTaskContainer
                      tasks={wallpaperStyle.tasks}
                      selectedTaskId={editingTaskId}
                      position={containerPosition}
                      globalFontSize={globalFontSize}
                      backgroundOpacity={backgroundOpacity}
                      variant={activeTemplate}
                      onSelect={(id) => handleTaskTapForEdit(id)}
                      onUpdate={(id, updates) => updateTask(id, updates)}
                      onPositionChange={setContainerPosition}
                      isMobile
                    />

                    {wallpaperStyle.stickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        className="absolute text-4xl cursor-move"
                        style={{ left: sticker.x, top: sticker.y }}
                      >
                        {sticker.emoji}
                      </div>
                    ))}

                    {phoneNumber && (
                      <div
                        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20"
                        style={{ zIndex: 20 }}
                      >
                        <div className="text-center whitespace-nowrap">
                          <div className="text-[9px] text-gray-600/80 font-medium mb-0.5">Emergency Contact</div>
                          <div className="text-xs font-medium text-gray-800">{phoneNumber}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </RealisticPhoneMockup>
              </div>
            </div>

            {/* Mobile: bottom toolbar (Tasks / Background / Notion) + Generate CTA */}
            <div className="border-t border-gray-800 bg-brand-bg">
              <div className="grid grid-cols-3 gap-2 px-3 pt-3 pb-2">
                <button
                  type="button"
                  onClick={() => setShowTasksSheet(true)}
                  className="flex flex-col items-center gap-1 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] rounded-xl text-white text-xs font-medium transition-colors"
                >
                  <span aria-hidden className="text-base leading-none">?</span>
                  <span>Tasks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBackgroundSheet(true)}
                  className="flex flex-col items-center gap-1 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] rounded-xl text-white text-xs font-medium transition-colors"
                >
                  <span aria-hidden className="text-base leading-none">?</span>
                  <span>Background</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotionSheet(true)}
                  className="flex flex-col items-center gap-1 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] rounded-xl text-white text-xs font-medium transition-colors"
                >
                  <span aria-hidden className="text-base leading-none">?</span>
                  <span>Notion</span>
                </button>
              </div>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={generateWallpaper}
                  disabled={isGenerating}
                  className="w-full py-3 bg-white hover:bg-white/90 text-black font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Wallpaper"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: 2-column grid (preview | rich edit panel) */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:h-full">
            {/* Left column: Background Source (lg only) */}
            <div className="hidden lg:flex lg:flex-col lg:h-full lg:overflow-y-auto lg:pr-2 lg:custom-scrollbar lg:gap-3 lg:pb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Background Source</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBackgroundMode("scene")}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      backgroundMode === "scene"
                        ? "bg-white text-black"
                        : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] border border-white/[0.08]"
                    }`}
                  >
                    Scene Library
                  </button>
                  <button
                    onClick={() => setBackgroundMode("gradient")}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      backgroundMode === "gradient"
                        ? "bg-white text-black"
                        : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] border border-white/[0.08]"
                    }`}
                  >
                    Gradients
                  </button>
                  <button
                    onClick={() => setBackgroundMode("upload")}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      backgroundMode === "upload"
                        ? "bg-white text-black"
                        : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] border border-white/[0.08]"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {backgroundMode === "scene" ? (
                <SceneBackgroundSelector
                  selectedImage={wallpaperStyle.backgroundImage}
                  onSelect={(imageUrl) => {
                    setWallpaperStyle(prev => ({
                      ...prev,
                      backgroundType: "custom",
                      backgroundImage: imageUrl,
                      backgroundPosition: { x: 0, y: 0 },
                      backgroundScale: 1,
                    }));
                  }}
                />
              ) : (
                <BackgroundSelector
                  selectedBackground={wallpaperStyle.backgroundImage}
                  backgroundType={wallpaperStyle.backgroundType}
                  onSelect={(bg) => {
                    const gradientMap: Record<string, string> = {
                      "from-pink-200 to-pink-300": "linear-gradient(to bottom, #fce7f3, #fbcfe8)",
                      "from-indigo-900 to-purple-900": "linear-gradient(to bottom, #312e81, #581c87)",
                      "from-green-400 to-blue-500": "linear-gradient(to bottom, #4ade80, #3b82f6)",
                      "from-gray-700 to-gray-900": "linear-gradient(to bottom, #374151, #111827)",
                      "from-orange-400 to-pink-600": "linear-gradient(to bottom, #fb923c, #db2777)",
                      "from-gray-100 to-gray-200": "linear-gradient(to bottom, #f3f4f6, #e5e7eb)",
                      "from-purple-500 to-pink-500": "linear-gradient(to bottom, #a855f7, #ec4899)",
                      "from-blue-300 to-blue-500": "linear-gradient(to bottom, #93c5fd, #3b82f6)",
                      "from-red-300 to-pink-400": "linear-gradient(to bottom, #fca5a5, #f472b6)",
                      "from-gray-900 to-black": "linear-gradient(to bottom, #111827, #000000)",
                      "from-green-600 to-green-800": "linear-gradient(to bottom, #16a34a, #166534)",
                      "from-blue-400 to-teal-600": "linear-gradient(to bottom, #60a5fa, #0d9488)",
                    };
                    const gradient = gradientMap[bg] || bg;
                    setWallpaperStyle((prev) => ({
                      ...prev,
                      backgroundType: "preset",
                      backgroundImage: gradient,
                      backgroundPosition: { x: 0, y: 0 },
                      backgroundScale: 1,
                    }));
                  }}
                  onUpload={handleBackgroundUpload}
                  onReset={resetBackground}
                  fileInputRef={fileInputRef}
                  hasUploadedImage={hasUploadedImage}
                />
              )}
            </div>

            {/* Page 1 - Preview (always visible, middle column on lg) */}
            <div className="flex flex-col">
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-bold text-white mb-1 lg:hidden">
                  Preview
                </h3>
                <p className="text-xs text-gray-400 mb-3 lg:hidden">
                  Drag text on preview to reposition
                </p>

                <div className="flex justify-center flex-1 min-h-0 items-center">
                  <RealisticPhoneMockup
                    ref={phoneScreenRef}
                    onScreenMouseEnter={() => setIsMouseInPhone(true)}
                    onScreenMouseLeave={() => setIsMouseInPhone(false)}
                  >
                    <div
                      ref={canvasRef}
                      className="w-full h-full relative"
                      style={{
                        background: wallpaperStyle.backgroundType === "preset" && wallpaperStyle.backgroundImage
                          ? wallpaperStyle.backgroundImage
                          : wallpaperStyle.backgroundType === "custom"
                          ? "transparent"
                          : "#1f2937",
                      }}
                    >
                      {wallpaperStyle.backgroundType === "custom" && wallpaperStyle.backgroundImage && (
                        <>
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `url(${wallpaperStyle.backgroundImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              transform: `translate(${wallpaperStyle.backgroundPosition.x}px, ${wallpaperStyle.backgroundPosition.y}px) scale(${wallpaperStyle.backgroundScale})`,
                              transformOrigin: 'center center',
                              zIndex: 0,
                            }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{ zIndex: 5 }}
                            onMouseDown={(e) => {
                              const target = e.target as HTMLElement;
                              if (!target.closest('.task-card')) {
                                handleBackgroundMouseDown(e);
                              }
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                          />
                        </>
                      )}

                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          zIndex: 6,
                          background:
                            "linear-gradient(to bottom, rgba(3, 7, 18, 0.38) 0%, rgba(3, 7, 18, 0.06) 34%, rgba(3, 7, 18, 0.22) 64%, rgba(3, 7, 18, 0.72) 100%)",
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          zIndex: 7,
                          background:
                            "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.16), transparent 28%), linear-gradient(to right, rgba(0,0,0,0.18), transparent 24%, transparent 76%, rgba(0,0,0,0.18))",
                        }}
                      />

                      {tasksLocked ? (
                        <LockedTaskContainer
                          tasks={wallpaperStyle.tasks}
                          selectedTaskId={selectedTaskId}
                          position={containerPosition}
                          globalFontSize={globalFontSize}
                          backgroundOpacity={backgroundOpacity}
                          variant={activeTemplate}
                          onSelect={(id) => setSelectedTaskId(id)}
                          onUpdate={(id, updates) => updateTask(id, updates)}
                          onPositionChange={setContainerPosition}
                          isMobile={false}
                        />
                      ) : (
                        wallpaperStyle.tasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            taskIndex={index}
                            isSelected={selectedTaskId === task.id}
                            isPreview={true}
                            onSelect={() => setSelectedTaskId(task.id)}
                            onUpdate={(updates) => updateTask(task.id, updates)}
                          />
                        ))
                      )}

                      {wallpaperStyle.stickers.map((sticker) => (
                        <div
                          key={sticker.id}
                          className="absolute text-4xl cursor-move"
                          style={{ left: sticker.x, top: sticker.y }}
                        >
                          {sticker.emoji}
                        </div>
                      ))}

                      {phoneNumber && (
                        <div
                          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20"
                          style={{ zIndex: 20 }}
                        >
                          <div className="text-center whitespace-nowrap">
                            <div className="text-[9px] text-gray-600/80 font-medium mb-0.5">Emergency Contact</div>
                            <div className="text-xs font-medium text-gray-800">{phoneNumber}</div>
                          </div>
                        </div>
                      )}
                    </div>

                  </RealisticPhoneMockup>
                </div>

              </div>
              {/* Generate button — modest size, centered, always visible below the preview on lg */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={generateWallpaper}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-white hover:bg-white/90 text-black font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Wallpaper"
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col mt-4 lg:mt-0 lg:h-full lg:overflow-hidden">
              <div className="space-y-3 pb-4 px-4 lg:px-0 lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:custom-scrollbar">
                <div>
                  <div className="mb-4 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.933.653.933 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.448-1.632z"/>
                        </svg>
                        <span className="text-sm font-semibold text-white">Notion Integration</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {!isNotionConnected ? (
                        <>
                          <NotionAuthButton
                            isConnected={isNotionConnected}
                          />
                          <div className="mt-3 p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Privacy Protection
                            </h4>
                            <ul className="text-xs text-gray-400 space-y-1.5">
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">&#10003;</span>
                                <span>We will never access your private data</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">&#10003;</span>
                                <span>Only requesting read access to Tasks/Todo databases</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">&#10003;</span>
                                <span>You can revoke access anytime in Notion settings</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">&#10003;</span>
                                <span>Data is only used for personal lockscreen wallpapers</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">&#10003;</span>
                                <span className="text-brand-green font-semibold">Tasks will be auto-imported after connection</span>
                              </li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          {/* Sync Status Indicator */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isSyncing ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
                              <span className="text-xs text-gray-400">
                                {isSyncing ? "Syncing..." : `Last sync: ${formatLastSyncTime(lastSyncTime)}`}
                              </span>
                            </div>
                            <button
                              onClick={() => syncNow()}
                              disabled={isSyncing}
                              className="text-xs text-brand-green hover:text-brand-green/80 transition-colors disabled:opacity-50"
                            >
                              {isSyncing ? "Syncing..." : "Sync Now"}
                            </button>
                          </div>

                          {/* Notion Task Selector Button */}
                          <button
                            onClick={() => {
                              trackEvent("notion_task_selector_toggle", {
                                open: !showNotionTaskSelector,
                                syncedTaskCount: syncedNotionTasks.length,
                              });
                              setShowNotionTaskSelector(!showNotionTaskSelector);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-white/90 disabled:bg-white/50 disabled:text-black/50 text-black rounded-xl font-semibold transition-all text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Select Tasks from Notion
                          </button>

                          {/* Task Selector Panel */}
                          {showNotionTaskSelector && (
                            <NotionTaskSelector
                              tasks={syncedNotionTasks}
                              selectedTaskIds={selectedNotionTaskIds}
                              onToggleTask={handleToggleNotionTask}
                              onAddSelectedToWallpaper={handleAddSelectedNotionTasksToWallpaper}
                              isLoading={isSyncing && syncedNotionTasks.length === 0}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">
                        Tasks
                      </h3>
                      <button
                        onClick={() => setTasksLocked(!tasksLocked)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          tasksLocked
                            ? "bg-brand-green/20 text-brand-green border border-brand-green"
                            : "bg-gray-700 text-gray-300 border border-gray-600"
                        }`}
                        title={tasksLocked ? "Click to unlock individual editing" : "Click to lock all tasks together"}
                      >
                        {tasksLocked ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Locked</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <span>Unlocked</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                        <span className="text-xs text-white font-medium">Bg Opacity</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={backgroundOpacity * 100}
                          onChange={(e) => setBackgroundOpacity(Number(e.target.value) / 100)}
                          className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-white font-medium w-8">{Math.round(backgroundOpacity * 100)}%</span>
                      </div>
                    </div>
                    <button
                      onClick={addTask}
                      className="flex items-center gap-2 bg-white hover:bg-white/90 text-black px-3 py-1.5 rounded-xl font-semibold transition-all hover:scale-105 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {tasksLocked && (
                    <div className="mb-3 p-3 bg-brand-bg rounded-xl border border-gray-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-gray-300 font-medium">Font Size</span>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs text-gray-400">A</span>
                          <input
                            type="range"
                            min="10"
                            max="24"
                            step="1"
                            value={globalFontSize}
                            onChange={(e) => setGlobalFontSize(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-green"
                          />
                          <span className="text-sm text-gray-400 font-bold">A</span>
                        </div>
                        <span className="text-xs text-brand-green font-bold w-8 text-center">{globalFontSize}</span>
                      </div>
                    </div>
                  )}

                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={wallpaperStyle.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {wallpaperStyle.tasks.map((task, index) => (
                          <SortableTaskItem
                            key={task.id}
                            task={task}
                            index={index}
                            isSelected={selectedTaskId === task.id}
                            onSelect={() => setSelectedTaskId(task.id)}
                            onDelete={() => deleteTask(task.id)}
                            onUpdate={updateTask}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <button
                    onClick={() => setShowInspiration(!showInspiration)}
                    className="w-full mt-3 py-2 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border-2 border-brand-blue/50 rounded-xl font-semibold transition-all text-sm"
                  >
                    Get Inspiration
                  </button>
                </div>

                {selectedTask && (
                  <StyleControls
                    task={selectedTask}
                    onUpdate={(updates) => updateTask(selectedTask.id, updates)}
                    isEnglish={true}
                    isPro={true}
                    daysRemaining={0}
                  />
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    Emergency Contact
                    <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Add emergency contact number for Alzheimer&rsquo;s patients
                  </p>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., +1 234 567 8900"
                    className="w-full px-4 py-2 bg-brand-bg border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                  />
                  {phoneNumber && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Will show at bottom of wallpaper
                      </span>
                      <button
                        onClick={() => setPhoneNumber("")}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Task edit overlay (lift-to-edit) */}
      {editingTaskId && (() => {
        const editingTask = wallpaperStyle.tasks.find(t => t.id === editingTaskId);
        if (!editingTask) return null;
        return (
          <div
            className="lg:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setEditingTaskId(null)}
          >
            <div
              className="w-full max-w-md bg-brand-card border border-gray-700 rounded-2xl p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-gray-400">Edit Task</span>
                <button
                  type="button"
                  onClick={() => setEditingTaskId(null)}
                  className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={editingTask.text}
                onChange={(e) => updateTask(editingTaskId, { text: e.target.value })}
                placeholder="What needs to happen today?"
                rows={4}
                className="w-full bg-brand-bg border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    setEditingTaskId(null);
                  }
                }}
              />
              <p className="text-[11px] text-gray-500 mt-2">
                Tip: tap anywhere outside or press <kbd className="px-1 py-0.5 rounded bg-gray-800">?/Ctrl+?</kbd> to save.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteTask(editingTaskId);
                    setEditingTaskId(null);
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl border border-red-400/20 hover:bg-red-400/5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTaskId(null)}
                  className="flex-1 py-2.5 bg-white text-black font-bold rounded-xl active:scale-[0.98] transition-transform"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile: Tasks bottom sheet */}
      <Sheet open={showTasksSheet} onOpenChange={setShowTasksSheet}>
        <SheetContent
          position="bottom"
          size="xl"
          className="bg-brand-card border-gray-700 text-white overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-white">Tasks ({wallpaperStyle.tasks.length})</SheetTitle>
            <SheetDescription className="text-gray-400">
              Tap a task to edit it. Drag-reorder is desktop only.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="flex justify-start mb-3">
              <button
                type="button"
                onClick={() => {
                  const newTask: Task = {
                    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    text: "New task",
                    x: 132,
                    y: wallpaperStyle.tasks.length * 30,
                    fontSize: 13,
                    color: "#F8FAFC",
                    backgroundColor: "transparent",
                    backgroundOpacity: 0.5,
                    opacity: 1,
                    isBold: true,
                    isItalic: false,
                    isCompleted: false,
                    textAlign: "left",
                    fontFamily: "Inter, system-ui, sans-serif",
                  };
                  setWallpaperStyle(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
                  setShowTasksSheet(false);
                  setEditingTaskId(newTask.id);
                }}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-full transition-colors"
                aria-label="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 pr-1">
              {wallpaperStyle.tasks.map((task, index) => (
                <div key={task.id} className="flex items-center gap-2 p-3 bg-white/[0.05] rounded-xl border border-gray-700">
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0">{index + 1}.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTasksSheet(false);
                      setEditingTaskId(task.id);
                    }}
                    className="flex-1 text-left text-sm text-white line-clamp-2 active:bg-white/[0.05] py-1 px-2 -mx-2 rounded"
                  >
                    {task.text}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 flex-shrink-0"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {wallpaperStyle.tasks.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-6">No tasks yet. Tap + above.</p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile: Background bottom sheet */}
      <Sheet open={showBackgroundSheet} onOpenChange={setShowBackgroundSheet}>
        <SheetContent position="bottom" size="xl" className="bg-brand-card border-gray-700 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Background</SheetTitle>
            <SheetDescription className="text-gray-400">Pick a scene, gradient, or upload your own.</SheetDescription>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setBackgroundMode("scene")}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                backgroundMode === "scene" ? "bg-white text-black" : "bg-white/[0.05] text-white/70 border border-white/[0.08]"
              }`}
            >
              Scene Library
            </button>
            <button
              type="button"
              onClick={() => setBackgroundMode("gradient")}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                backgroundMode === "gradient" ? "bg-white text-black" : "bg-white/[0.05] text-white/70 border border-white/[0.08]"
              }`}
            >
              Gradients
            </button>
            <button
              type="button"
              onClick={() => setBackgroundMode("upload")}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                backgroundMode === "upload" ? "bg-white text-black" : "bg-white/[0.05] text-white/70 border border-white/[0.08]"
              }`}
            >
              Upload
            </button>
          </div>
          <div className="mt-3 max-h-[55vh] overflow-y-auto pr-1">
            {backgroundMode === "scene" ? (
              <SceneBackgroundSelector
                selectedImage={wallpaperStyle.backgroundImage}
                onSelect={(imageUrl) => {
                  setWallpaperStyle(prev => ({
                    ...prev,
                    backgroundType: "custom",
                    backgroundImage: imageUrl,
                    backgroundPosition: { x: 0, y: 0 },
                    backgroundScale: 1,
                  }));
                  setShowBackgroundSheet(false);
                }}
              />
            ) : (
              <BackgroundSelector
                selectedBackground={wallpaperStyle.backgroundImage}
                backgroundType={wallpaperStyle.backgroundType}
                onSelect={(bg) => {
                  const gradientMap: Record<string, string> = {
                    'from-pink-200 to-pink-300': 'linear-gradient(to bottom, #fce7f3, #fbcfe8)',
                    'from-indigo-900 to-purple-900': 'linear-gradient(to bottom, #312e81, #581c87)',
                    'from-green-400 to-blue-500': 'linear-gradient(to bottom, #4ade80, #3b82f6)',
                    'from-gray-700 to-gray-900': 'linear-gradient(to bottom, #374151, #111827)',
                    'from-orange-400 to-pink-600': 'linear-gradient(to bottom, #fb923c, #db2777)',
                    'from-gray-100 to-gray-200': 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
                    'from-purple-500 to-pink-500': 'linear-gradient(to bottom, #a855f7, #ec4899)',
                    'from-blue-300 to-blue-500': 'linear-gradient(to bottom, #93c5fd, #3b82f6)',
                    'from-red-300 to-pink-400': 'linear-gradient(to bottom, #fca5a5, #f472b6)',
                    'from-gray-900 to-black': 'linear-gradient(to bottom, #111827, #000000)',
                    'from-green-600 to-green-800': 'linear-gradient(to bottom, #16a34a, #166534)',
                    'from-blue-400 to-teal-600': 'linear-gradient(to bottom, #60a5fa, #0d9488)',
                  };
                  const gradient = gradientMap[bg] || bg;
                  setWallpaperStyle(prev => ({ ...prev, backgroundType: "preset", backgroundImage: gradient, backgroundPosition: { x: 0, y: 0 }, backgroundScale: 1 }));
                  setShowBackgroundSheet(false);
                }}
                onUpload={handleBackgroundUpload}
                onReset={resetBackground}
                fileInputRef={fileInputRef}
                hasUploadedImage={hasUploadedImage}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile: Notion bottom sheet */}
      <Sheet open={showNotionSheet} onOpenChange={setShowNotionSheet}>
        <SheetContent position="bottom" size="xl" className="bg-brand-card border-gray-700 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Notion Integration</SheetTitle>
            <SheetDescription className="text-gray-400">
              Import your real tasks from Notion.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <NotionAuthButton isConnected={isNotionConnected} />
            {isNotionConnected && (
              <>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${isSyncing ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
                  {isSyncing ? "Syncing..." : `Last sync: ${formatLastSyncTime(lastSyncTime)}`}
                  <button
                    type="button"
                    onClick={() => syncNow()}
                    disabled={isSyncing}
                    className="ml-auto text-brand-green hover:text-brand-green/80 disabled:opacity-50"
                  >
                    Sync now
                  </button>
                </div>
                <NotionTaskSelector
                  tasks={syncedNotionTasks}
                  selectedTaskIds={selectedNotionTaskIds}
                  onToggleTask={handleToggleNotionTask}
                  onAddSelectedToWallpaper={() => {
                    handleAddSelectedNotionTasksToWallpaper();
                    setShowNotionSheet(false);
                  }}
                  isLoading={isSyncing && syncedNotionTasks.length === 0}
                />
              </>
            )}
            <div className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-700">
              <p>We never access private data. Read-only on Tasks/Todo databases.</p>
              <p>Revoke anytime in Notion settings.</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {showInspiration && (
        <InspirationPanel
          onClose={() => setShowInspiration(false)}
          onApply={applyInspiration}
          isEnglish={true}
        />
      )}

      <FeedbackWidget isEnglish={true} />

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-brand-card border-gray-700 text-white">
          <DialogHeader>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Wallpaper Generated Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="flex flex-col items-center space-y-4">
              {shareUrl ? (
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG
                    value={shareUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              ) : (
                <div className="flex h-[212px] w-[212px] items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 p-4 text-center">
                  <p className="text-sm leading-5 text-gray-400">
                    {qrUnavailableReason || "QR code is unavailable because no share URL was created."}
                  </p>
                </div>
              )}
                <p className="text-sm text-gray-400 text-center">
                  {shareUrl ? "Scan QR code to download wallpaper" : "Use Download Wallpaper on this device"}
                </p>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full bg-white hover:bg-white/90 text-black font-semibold"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Wallpaper
            </Button>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-300 text-center">
                Share on Social Media
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={openTwitterShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-black hover:bg-gray-800 text-white border border-gray-700"
                  variant="outline"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-xs">Twitter</span>
                </Button>

                <Button
                  onClick={openFacebookShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white"
                  variant="outline"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-xs">Facebook</span>
                </Button>

                <Button
                  onClick={openLinkedInShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#0A66C2] hover:bg-[#0958a8] text-white"
                  variant="outline"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs">LinkedIn</span>
                </Button>

                <Button
                  onClick={openWhatsAppShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white"
                  variant="outline"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-xs">WhatsApp</span>
                </Button>

                <Button
                  onClick={openTelegramShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#0088cc] hover:bg-[#0077b3] text-white"
                  variant="outline"
                >
                  <Send className="w-5 h-4" />
                  <span className="text-xs">Telegram</span>
                </Button>

                <Button
                  onClick={copyToClipboard}
                  className="flex flex-col gap-1 h-auto py-3 bg-gray-700 hover:bg-gray-600 text-white"
                  variant="outline"
                >
                  <Share2 className="w-5 h-4" />
                  <span className="text-xs">Copy Link</span>
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-semibold border border-gray-700"
              size="lg"
              variant="outline"
            >
              Continue Editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModalPricing
        isOpen={showUpgradeModalPricing}
        onClose={() => setShowUpgradeModalPricing(false)}
        lang={currentLang === "zh" ? "zh" : "en"}
      />
    </div>
  );
}

function formatAgentReminderText(reminder: AgentReminder) {
  const prefix = reminder.dueAt ? `${formatReminderTime(reminder.dueAt)} - ` : "";
  const location = reminder.location ? ` @ ${reminder.location}` : "";
  return `${prefix}${reminder.title}${location}`;
}

function formatReminderTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
