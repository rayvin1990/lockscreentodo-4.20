"use client";

// ✅ VERSION MARKER: 2025-02-27-v2 - Wallpaper save feature added
console.log('🚀 Generator page loaded - VERSION 2025-02-27-v2');

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Smartphone, Plus, Trash2, X, Download, Share2, Twitter, Facebook, Linkedin, Send, ShoppingCart, Settings, GripVertical } from "lucide-react";
import { Button } from "@saasfly/ui/button";
import { useToast } from "@saasfly/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@saasfly/ui/dialog";
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
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDownloadLimit } from "../../../hooks/use-download-limit";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Task {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number; // 背景层透明度
  opacity: number; // 文字透明度
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
  const { isSignedIn, isLoaded, userId } = useAuth();

  // 下载限额检查 Hook
  const { downloadLimitStatus, checkDownloadLimit, recordDownload } = useDownloadLimit();

  // Get current language from URL for navigation
  useEffect(() => {
    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    setCurrentLang(lang);
  }, []);

  // Listen for custom event to open pricing modal
  useEffect(() => {
    const handleOpenPricingModal = () => {
      setShowUpgradeModalPricing(true);
    };

    window.addEventListener('openPricingModal', handleOpenPricingModal);

    return () => {
      window.removeEventListener('openPricingModal', handleOpenPricingModal);
    };
  }, []);

  // Show welcome modal for new trial users - DISABLED to let users explore freely
  // Users can see their trial status in the countdown badge at the top right
  // useEffect(() => {
  //   console.log('🔍 Auth state changed:', { isLoaded, isSignedIn });
  //
  //   if (!isLoaded || !isSignedIn) {
  //     console.log('❌ Welcome modal: User not loaded or not signed in');
  //     return;
  //   }
  //
  //   const checkAndShowWelcome = async () => {
  //     // Check if already shown
  //     const hasShownWelcome = localStorage.getItem('trial_welcome_shown');
  //     console.log('🎁 Welcome modal check:', { hasShownWelcome, isLoaded, isSignedIn });
  //
  //     if (hasShownWelcome) {
  //       console.log('⏭️ Welcome modal already shown, skipping');
  //       return;
  //     }
  //
  //     console.log('📡 Fetching trial status...');
  //
  //     try {
  //       const response = await fetch("/api/generate/check-limit");
  //       const data = await response.json();
  //
  //       console.log('📊 Trial status for welcome modal:', {
  //         status: response.status,
  //         data: data
  //       });
  //
  //       // Show welcome modal if user is in trial period
  //       if (data.isPro && data.trialEndsAt && data.daysRemaining > 0) {
  //         console.log('✅ Showing welcome modal!');
  //         setTrialEndsAt(data.trialEndsAt);
  //         setWelcomeDaysRemaining(data.daysRemaining);
  //
  //         // Small delay to ensure smooth animation
  //         setTimeout(() => {
  //           setShowWelcomeModal(true);
  //         }, 500);
  //
  //         // Mark as shown
  //         localStorage.setItem('trial_welcome_shown', 'true');
  //       } else {
  //         console.log('⛔ Welcome modal conditions not met:', {
  //           isPro: data.isPro,
  //           hasTrialEndsAt: !!data.trialEndsAt,
  //           daysRemaining: data.daysRemaining
  //         });
  //       }
  //     } catch (error) {
  //       console.error("❌ Failed to check trial status:", error);
  //     }
  //   };
  //
  //   checkAndShowWelcome();
  // }, [isLoaded, isSignedIn]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phoneScreenRef = useRef<HTMLDivElement>(null);

  const [backgroundMode, setBackgroundMode] = useState<"scene" | "gradient" | "upload">("scene");

  const [wallpaperStyle, setWallpaperStyle] = useState<WallpaperStyle>({
    backgroundType: "preset",
    backgroundImage: "",
    backgroundPosition: { x: 0, y: 0 },
    backgroundScale: 1,
    tasks: [
      { id: "1", text: "Complete project report", x: 132, y: 200, fontSize: 14, color: "#000000", backgroundColor: "transparent", backgroundOpacity: 0.5, opacity: 1, isBold: true, isItalic: false, isCompleted: false, textAlign: "center", fontFamily: "Comic Sans Ms.Fun" },
      { id: "2", text: "Exercise 30 minutes", x: 132, y: 230, fontSize: 14, color: "#000000", backgroundColor: "transparent", backgroundOpacity: 0.5, opacity: 1, isBold: true, isItalic: false, isCompleted: false, textAlign: "center", fontFamily: "Comic Sans Ms.Fun" },
    ],
    stickers: [],
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isMouseInPhone, setIsMouseInPhone] = useState(false);
  const [showUpgradeModalPricing, setShowUpgradeModalPricing] = useState(false);

  // Notion integration state
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isImportingFromNotion, setIsImportingFromNotion] = useState(false);

  // 任务锁定状态 - 默认锁定
  const [tasksLocked, setTasksLocked] = useState(true);
  // 整体容器位置 - 默认在中下部，保留顶部时间显示区
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 200 });
  // 整体字体大小控制
  const [globalFontSize, setGlobalFontSize] = useState(14);
  // 背景透明度控制
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.65);
  // 电话号码备注（为阿尔兹海默症老人准备）
  const [phoneNumber, setPhoneNumber] = useState("");

  // Background interaction state
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const [dragStartBg, setDragStartBg] = useState({ x: 0, y: 0 });
  const [bgStartPos, setBgStartPos] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  const selectedTask = wallpaperStyle.tasks.find(t => t.id === selectedTaskId);

  // 调试：监听鼠标位置变化
  useEffect(() => {
    console.log('🖱️ isMouseInPhone changed:', isMouseInPhone);
  }, [isMouseInPhone]);

  // 使用原生事件监听器来阻止页面滚动
  useEffect(() => {
    const phoneScreen = phoneScreenRef.current;
    if (!phoneScreen) return;

    const handleWheelNative = (e: WheelEvent) => {
      console.log('🎡 Native wheel event:', { isMouseInPhone, deltaY: e.deltaY });

      // 只有当鼠标在手机模型内时才阻止页面滚动
      if (isMouseInPhone) {
        console.log('✅ Preventing default scroll behavior');
        e.preventDefault();
        e.stopPropagation();

        // 如果有自定义背景图片，则缩放背景图片
        if (wallpaperStyle.backgroundType === "custom" && wallpaperStyle.backgroundImage) {
          const zoomSensitivity = 0.001;
          const delta = e.deltaY * zoomSensitivity;
          const newScale = Math.max(0.5, Math.min(3, wallpaperStyle.backgroundScale - delta));

          console.log('🔍 Zooming background:', { oldScale: wallpaperStyle.backgroundScale, newScale });

          setWallpaperStyle(prev => ({
            ...prev,
            backgroundScale: newScale,
          }));
        } else {
          console.log('📏 No custom background, just preventing scroll');
        }
      } else {
        console.log('❌ Mouse not in phone, allowing page scroll');
      }
    };

    // 使用 passive: false 来允许 preventDefault()
    phoneScreen.addEventListener('wheel', handleWheelNative, { passive: false });

    return () => {
      phoneScreen.removeEventListener('wheel', handleWheelNative);
    };
  }, [isMouseInPhone, wallpaperStyle.backgroundType, wallpaperStyle.backgroundImage, wallpaperStyle.backgroundScale]);

  // Handle background drag start
  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ Background mouse down', { type: wallpaperStyle.backgroundType, hasImage: !!wallpaperStyle.backgroundImage });
    if (wallpaperStyle.backgroundType !== "custom" || !wallpaperStyle.backgroundImage) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDraggingBg(true);
    setDragStartBg({ x: e.clientX, y: e.clientY });
    setBgStartPos({ ...wallpaperStyle.backgroundPosition });

    console.log('📍 Drag started at', { x: e.clientX, y: e.clientY, startPos: wallpaperStyle.backgroundPosition });

    document.addEventListener("mousemove", handleBackgroundMouseMove as any);
    document.addEventListener("mouseup", handleBackgroundMouseUp as any);
  };

  // Handle background drag move
  const handleBackgroundMouseMove = (e: MouseEvent) => {
    if (!isDraggingBg) return;

    const deltaX = e.clientX - dragStartBg.x;
    const deltaY = e.clientY - dragStartBg.y;

    const newPosition = {
      x: bgStartPos.x + deltaX,
      y: bgStartPos.y + deltaY,
    };

    console.log('🎯 Dragging to', { deltaX, deltaY, newPosition });

    setWallpaperStyle(prev => ({
      ...prev,
      backgroundPosition: newPosition,
    }));
  };

  // Handle background drag end
  const handleBackgroundMouseUp = () => {
    setIsDraggingBg(false);
    document.removeEventListener("mousemove", handleBackgroundMouseMove as any);
    document.removeEventListener("mouseup", handleBackgroundMouseUp as any);
  };

  // Handle touch start for pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (wallpaperStyle.backgroundType !== "custom" || !wallpaperStyle.backgroundImage) return;
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
      setInitialScale(wallpaperStyle.backgroundScale);
    } else if (e.touches.length === 1) {
      // Drag
      setIsDraggingBg(true);
      setDragStartBg({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setBgStartPos({ ...wallpaperStyle.backgroundPosition });
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (wallpaperStyle.backgroundType !== "custom" || !wallpaperStyle.backgroundImage) return;

    e.preventDefault();

    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / initialPinchDistance;
      const newScale = Math.max(0.5, Math.min(3, initialScale * scale));

      setWallpaperStyle(prev => ({
        ...prev,
        backgroundScale: newScale,
      }));
    } else if (e.touches.length === 1 && isDraggingBg) {
      // Drag
      const deltaX = e.touches[0].clientX - dragStartBg.x;
      const deltaY = e.touches[0].clientY - dragStartBg.y;

      setWallpaperStyle(prev => ({
        ...prev,
        backgroundPosition: {
          x: bgStartPos.x + deltaX,
          y: bgStartPos.y + deltaY,
        },
      }));
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDraggingBg(false);
    setInitialPinchDistance(0);
  };

  // Sortable Task Item Component
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

    // Use local state to avoid losing focus during editing
    const [editingText, setEditingText] = useState(task.text);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with external changes
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
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        setEditingText(task.text);
        e.currentTarget.blur();
      }
    };

    const handleContainerClick = (e: React.MouseEvent) => {
      // Select task and focus input when clicking anywhere on the task item
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        onSelect();
        // Focus the input on next tick
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
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 flex-shrink-0 mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Task Content - Editable Input */}
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

          {/* Delete Button */}
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

      // Auto-save to Supabase after reordering
      const { userId } = await auth();
      if (userId) {
        // Save the reordered tasks to Supabase
        await saveTasksToSupabase(userId, newTasks);
      }
    }
  };

  const addTask = () => {
    // Generate unique ID using timestamp + random to prevent collisions
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: "New task",
      x: 132,
      y: wallpaperStyle.tasks.length * 30,
      fontSize: 14,
      color: "#000000",
      backgroundColor: "transparent", // 使用整体背景
      backgroundOpacity: 0.5,
      opacity: 1,
      isBold: true,
      isItalic: false,
      isCompleted: false,
      textAlign: "center",
      fontFamily: "Comic Sans Ms.Fun",
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
          backgroundScale: 1, // 默认100%
        }));
        setHasUploadedImage(true); // 标记已上传图片
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    setWallpaperStyle(prev => ({
      ...prev,
      backgroundType: "preset",
      backgroundImage: "",
      backgroundPosition: { x: 0, y: 0 },
      backgroundScale: 1,
    }));
    setHasUploadedImage(false); // 清除标记
  };

  const applyInspiration = (template: Task[]) => {
    setWallpaperStyle(prev => ({ ...prev, tasks: template }));
    setShowInspiration(false);
  };

  // Import tasks from Notion - Define BEFORE useEffect to avoid reference errors
  const importFromNotion = async () => {
    if (!isSignedIn) {
      toast({
        variant: "destructive",
        title: "Please sign in",
        description: "You need to sign in to import tasks from Notion.",
      });
      return;
    }

    setIsImportingFromNotion(true);

    try {
      const response = await fetch("/api/notion/tasks");

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || "Failed to import tasks";
        console.error("Import from Notion error:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success || !data.tasks || data.tasks.length === 0) {
        toast({
          variant: "destructive",
          title: "No tasks found",
          description: data.message || "Could not find any tasks in your Notion databases.",
        });
        return;
      }

      // Convert Notion tasks to wallpaper tasks
      const importedTasks: Task[] = data.tasks.map((notionTask: any, index: number) => ({
        id: notionTask.id,
        text: notionTask.text,
        x: 132,
        y: 200 + (index * 30),
        fontSize: 14,
        color: "#000000",
        backgroundColor: "transparent",
        backgroundOpacity: 0.5,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isCompleted: false,
        textAlign: "center" as const,
        fontFamily: "Comic Sans Ms.Fun",
      }));

      // Replace current tasks with imported tasks
      setWallpaperStyle(prev => ({ ...prev, tasks: importedTasks }));

      toast({
        title: "✅ Tasks Imported!",
        description: `Imported ${data.tasks.length} tasks from "${data.databaseName}". Data is only used for your personal wallpaper.`,
      });

    } catch (error) {
      console.error("Import from Notion error:", error);
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not import tasks from Notion.",
      });
    } finally {
      setIsImportingFromNotion(false);
    }
  };

  // Track if we've loaded from Supabase (to prevent multiple loads)
  const hasLoadedFromSupabase = useRef(false);

  // Load tasks from Supabase (only once on mount)
  const loadTasksFromSupabase = async (userId: string) => {
    // Prevent loading if already loaded
    if (hasLoadedFromSupabase.current) {
      console.log('ℹ️ Already loaded from Supabase, skipping');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Convert Supabase tasks to frontend format
        const tasks: Task[] = data.map((task: any) => ({
          id: task.notion_task_id || task.id,
          text: task.text,
          x: 132,
          y: 200 + (data.indexOf(task) * 30),
          fontSize: 14,
          color: "#000000",
          backgroundColor: "transparent",
          backgroundOpacity: 0.5,
          opacity: task.completed ? 0.6 : 1,
          isBold: true,
          isItalic: false,
          isCompleted: task.completed,
          textAlign: "center" as const,
          fontFamily: "Comic Sans Ms.Fun",
        }));

        setWallpaperStyle(prev => ({ ...prev, tasks }));
        hasLoadedFromSupabase.current = true;
        console.log('✅ Loaded tasks from Supabase:', tasks.length);
      } else {
        console.log('ℹ️ No tasks in Supabase, using local state');
        hasLoadedFromSupabase.current = true;
      }
    } catch (error) {
      console.error('❌ Failed to load tasks from Supabase:', error);
      hasLoadedFromSupabase.current = true;
    }
  };

  // Save tasks to Supabase using upsert to avoid conflicts
  const saveTasksToSupabase = async (userId: string, tasks: Task[]) => {
    try {
      // Filter out empty tasks and deduplicate by task.id
      const validTasks = tasks.filter(task => task.text && task.text.trim() !== '');
      const uniqueTasks = Array.from(
        new Map(validTasks.map(task => [task.id, task])).values()
      );

      // Get current task IDs from this user
      const currentTaskIds = uniqueTasks.map(task => task.id);

      // Delete tasks that are no longer in the list
      if (currentTaskIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('user_id', userId)
          .not('notion_task_id', `in.(${currentTaskIds.join(',')})`);

        if (deleteError) {
          console.error('❌ Failed to delete removed tasks:', deleteError);
          // Don't throw here, continue with upsert
        }
      } else {
        // If no tasks, delete all tasks for this user
        const { error: deleteAllError } = await supabase
          .from('tasks')
          .delete()
          .eq('user_id', userId);

        if (deleteAllError) {
          console.error('❌ Failed to delete all tasks:', deleteAllError);
        }
        console.log('ℹ️ No tasks to save');
        return;
      }

      // Use upsert to avoid conflicts
      // upsert will update if the task exists (by notion_task_id) or insert if it doesn't
      const tasksToUpsert = uniqueTasks.map(task => ({
        user_id: userId,
        text: task.text,
        completed: task.isCompleted || false,
        notion_task_id: task.id,
      }));

      const { error } = await supabase
        .from('tasks')
        .upsert(tasksToUpsert, {
          onConflict: 'notion_task_id',
          ignoreDuplicates: false,
        });

      if (error) throw error;

      console.log('✅ Saved tasks to Supabase:', tasksToUpsert.length);
    } catch (error) {
      console.error('❌ Failed to save tasks to Supabase:', error);
    }
  };

  // Check Notion connection status on mount and after OAuth callback
  useEffect(() => {
    // Check URL for OAuth callback success
    const urlParams = new URLSearchParams(window.location.search);
    const isOAuthCallback = urlParams.get("notion") === "connected";

    const checkNotionConnection = async () => {
      if (!isSignedIn) return;

      try {
        const response = await fetch("/api/user/notion-status");
        if (response.ok) {
          const data = await response.json();
          const wasConnected = isNotionConnected;
          setIsNotionConnected(data.connected);

          // Auto-import tasks if:
          // 1. This is an OAuth callback (just connected), OR
          // 2. Was not connected before but is now connected (fresh session)
          if (data.connected && !wasConnected) {
            // Auto-import tasks after a short delay
            setTimeout(() => {
              importFromNotion();
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Failed to check Notion status:", error);
      }
    };

    checkNotionConnection();

    if (isOAuthCallback) {
      setIsNotionConnected(true);
      toast({
        title: "✅ Notion Connected!",
        description: "Importing your tasks now...",
      });
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [isSignedIn]);

  // Load tasks from Supabase on mount
  useEffect(() => {
    if (!isSignedIn || !userId) return;

    loadTasksFromSupabase(userId);
  }, [isSignedIn, userId]);

  // Save tasks to Supabase when tasks change (with debounce)
  useEffect(() => {
    if (!isSignedIn || !userId) return;

    const timeoutId = setTimeout(() => {
      saveTasksToSupabase(userId, wallpaperStyle.tasks);
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [wallpaperStyle.tasks, isSignedIn, userId]);

  // Real-time subscription for tasks (DISABLED to prevent conflicts)
  // Comment: Real-time sync is causing conflicts with local state updates
  // We'll enable this later with proper conflict resolution
  /*
  useEffect(() => {
    if (!isSignedIn || !userId) return;

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔄 Real-time update received:', payload);
          // Reload tasks when changes detected
          loadTasksFromSupabase(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSignedIn, userId]);
  */

  const generateWallpaper = async () => {
    console.log('🎨 Starting wallpaper generation...');

    // 1. Check authentication
    if (!isSignedIn) {
      console.log('❌ User not authenticated');
      toast({
        variant: "destructive",
        title: "Please sign in first",
        description: "Sign in to generate wallpapers",
      });
      router.push(`/${currentLang}/sign-in`);
      return;
    }

    // 2. Check if user has tasks
    if (wallpaperStyle.tasks.length === 0) {
      console.log('❌ No tasks found');
      toast({
        variant: "destructive",
        title: "No tasks",
        description: "Please add at least one task",
      });
      return;
    }

    // 3. ⭐ 检查生成限额
    const limitResponse = await fetch("/api/generate/check-limit");
    const limitData = await limitResponse.json();

    if (!limitResponse.ok || !limitData.canGenerate) {
      // 限额已满，显示升级弹窗
      if (limitData.reason === 'TRIAL_EXPIRED') {
        setShowUpgradeModalPricing(true);
        toast({
          variant: "destructive",
          title: "⚠️ Trial period has ended",
          description: "Please upgrade to Pro to continue generating wallpapers",
        });
      } else if (limitData.reason === 'NOT_AUTHENTICATED') {
        toast({
          variant: "destructive",
          title: "Please sign in first",
          description: "Sign in to generate wallpapers",
        });
        router.push(`/${currentLang}/sign-in`);
      } else {
        // 其他错误
        toast({
          variant: "destructive",
          title: "Failed to check limit",
          description: limitData.message || "Please try again later",
        });
      }
      return;
    }

    console.log("✅ 限额检查通过:", limitData);

    setIsGenerating(true);
    setShareUrl(null);

    try {
      console.log('📦 Importing dom-to-image...');
      const { toPng } = await import("dom-to-image");

      console.log('🖼️ Getting canvas reference...');
      console.log('canvasRef.current:', canvasRef.current);

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas ref is null');
        console.error('All refs:', {
          canvasRef,
          phoneScreenRef,
          fileInputRef
        });
        throw new Error("Canvas not found - please try refreshing the page");
      }

      console.log('✅ Canvas ref found:', canvas);
      console.log('Canvas HTML:', canvas.outerHTML?.substring(0, 200));

      console.log('📐 Getting canvas dimensions...');
      // Get actual canvas dimensions to avoid cropping
      const rect = canvas.getBoundingClientRect();
      const scale = 2; // For higher resolution

      console.log(`Canvas dimensions: ${rect.width}x${rect.height}`);
      console.log(`Canvas position: x=${rect.x}, y=${rect.y}`);

      if (rect.width === 0 || rect.height === 0) {
        throw new Error("Canvas has no dimensions - the element may be hidden");
      }

      console.log('🎯 Generating image from canvas...');
      const dataUrl = await toPng(canvas, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 0.85, // Reduce quality to prevent timeout
        bgcolor: "#0F1117",
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          // Keep rounded corners, remove blur that causes gray artifacts
          backdropFilter: 'none !important',
          webkitBackdropFilter: 'none !important',
        },
      });

      console.log('✅ Image generated successfully');

      // Upload to imgbb with timeout and retry
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';

      console.log(`🔑 IMGBB API Key: ${IMGBB_API_KEY ? 'configured' : 'NOT CONFIGURED'}`);

      if (!IMGBB_API_KEY) {
        throw new Error("IMGBB API key not configured");
      }

      // Convert data URL to base64 (remove data:image/png;base64, prefix)
      console.log('✂️ Converting to base64...');
      const base64Data = dataUrl.split(',')[1];

      console.log(`📊 Image size: ${Math.round(base64Data.length * 0.75 / 1024)}KB`);

      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64Data);

      // Upload with timeout and retry
      let imageUrl = '';
      let uploadSuccess = false;
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries && !uploadSuccess; attempt++) {
        try {
          console.log(`☁️ Uploading to imgbb... Attempt ${attempt}/${maxRetries}`);

          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

          const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          console.log(`📡 ImgBB response status: ${imgbbResponse.status}`);

          if (!imgbbResponse.ok) {
            const errorText = await imgbbResponse.text();
            console.error(`❌ ImgBB upload failed (attempt ${attempt}):`, errorText);

            if (attempt < maxRetries) {
              console.log(`⏳ Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error(`Failed to upload to imgbb (Status: ${imgbbResponse.status})`);
          }

          const imgbbData = await imgbbResponse.json();
          console.log('📊 ImgBB response data:', imgbbData);

          if (!imgbbData.success) {
            console.error(`❌ ImgBB returned unsuccessful response (attempt ${attempt})`);

            if (attempt < maxRetries) {
              console.log(`⏳ Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error('imgbb upload failed');
          }

          imageUrl = imgbbData.data.url;
          uploadSuccess = true;
          console.log('✅ Upload successful:', imageUrl);

        } catch (uploadError: any) {
          console.error(`❌ Upload attempt ${attempt} failed:`, uploadError);

          if (uploadError.name === 'AbortError') {
            console.error('⏱️ Upload timeout (30s)');
            if (attempt < maxRetries) {
              console.log(`⏳ Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error('Upload timeout. Please try again or use a simpler background.');
          }

          if (attempt === maxRetries) {
            throw uploadError;
          }
        }
      }

      if (!uploadSuccess || !imageUrl) {
        throw new Error('Failed to upload image after multiple attempts. Please try again.');
      }

      setShareUrl(imageUrl);

      // Record wallpaper generation
      console.log('📝 Starting to record wallpaper generation...');
      try {
        console.log('📡 Calling /api/generate/record-usage...');
        const recordResponse = await fetch('/api/generate/record-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('📡 Response status:', recordResponse.status, recordResponse.statusText);

        const responseText = await recordResponse.text();
        console.log('📡 Response body:', responseText);

        if (recordResponse.ok) {
          console.log('✅ Wallpaper generation recorded successfully');
        } else {
          console.error('⚠️ Failed to record generation. Status:', recordResponse.status, 'Response:', responseText);
        }
      } catch (error) {
        console.error('⚠️ Error recording generation:', error);
      }

      // Save wallpaper to history
      console.log('📸 Saving wallpaper to history...');
      try {
        const saveWallpaperResponse = await fetch('/api/wallpaper/save', {
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
          console.log('✅ Wallpaper saved to history successfully');
        } else {
          const errorText = await saveWallpaperResponse.text();
          console.error('⚠️ Failed to save wallpaper to history. Status:', saveWallpaperResponse.status, 'Response:', errorText);
        }
      } catch (error) {
        console.error('⚠️ Error saving wallpaper to history:', error);
      }

      // Record download count - generation consumes quota
      await recordDownload();

      // Generation successful - show QR code modal
      setShowSuccessModal(true);

      toast({
        title: "✅ Wallpaper generated successfully!",
        description: "Scan QR code to download",
      });
    } catch (error) {
      console.error("❌ Generation error:", error);
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

    import("dom-to-image").then(({ toPng }) => {
      // Get actual canvas dimensions to avoid cropping
      const rect = canvas.getBoundingClientRect();
      const scale = 2; // For higher resolution

      toPng(canvas, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 1,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          // Keep rounded corners, remove blur that causes gray artifacts
          backdropFilter: 'none !important',
          webkitBackdropFilter: 'none !important',
        },
      }).then(async (dataUrl) => {
        const link = document.createElement("a");
        link.download = `lockscreen-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        // Record download - QR code and direct download both count as separate downloads
        await recordDownload();
      });
    });
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate blob for sharing
      const { toPng } = await import("dom-to-image");
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

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'wallpaper.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        // Share image file using Web Share API
        await navigator.share({
          title: "My Lockscreen Todo Wallpaper",
          text: currentLang === 'zh' ? "查看我的自定义待办壁纸！" : "Check my custom todo wallpaper!",
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback: Share URL
        await navigator.share({
          title: "My Lockscreen Todo Wallpaper",
          text: currentLang === 'zh' ? "查看我的自定义待办壁纸！" : "Check my custom todo wallpaper!",
          url: shareUrl,
        });
      } else {
        // Fallback: Copy to clipboard
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

  // Social media share handlers
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-brand-bg/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link href={`/${currentLang}`} className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              {/* User Status Badge - Shows username */}
              <UserStatusBadge />

              {/* Settings Button */}
              <Button
                onClick={() => window.location.href = `/${currentLang}/dashboard/settings`}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Upgrade Button */}
              <Button
                onClick={() => setShowUpgradeModalPricing(true)}
                className="bg-brand-green hover:bg-emerald-500 text-white font-semibold"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {currentLang === "zh" ? "升级 Pro 版" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 px-4 sm:px-6 lg:px-8" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid lg:grid-cols-2 gap-4 h-full">
            {/* Left Panel - Preview */}
            <div className="h-full flex flex-col">
              <div className="bg-brand-card rounded-2xl p-4 border border-gray-800 h-full flex flex-col">
                <h3 className="text-lg font-bold text-white mb-1">
                  Preview
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Drag text on preview to reposition
                </p>

                {/* Canvas */}
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
                      {/* Background Image - Custom uploads only */}
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
                          {/* Invisible overlay for drag/zoom interactions - placed above tasks */}
                          <div
                            className="absolute inset-0"
                            style={{ zIndex: 5 }}
                            onMouseDown={(e) => {
                              const target = e.target as HTMLElement;
                              // Only handle drag if not clicking on a task card
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

                      {/* Tasks */}
                      {tasksLocked ? (
                        <LockedTaskContainer
                          tasks={wallpaperStyle.tasks}
                          selectedTaskId={selectedTaskId}
                          position={containerPosition}
                          globalFontSize={globalFontSize}
                          backgroundOpacity={backgroundOpacity}
                          onSelect={(id) => setSelectedTaskId(id)}
                          onUpdate={(id, updates) => updateTask(id, updates)}
                          onPositionChange={setContainerPosition}
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

                      {/* Stickers */}
                      {wallpaperStyle.stickers.map((sticker) => (
                        <div
                          key={sticker.id}
                          className="absolute text-4xl cursor-move"
                          style={{ left: sticker.x, top: sticker.y }}
                        >
                          {sticker.emoji}
                        </div>
                      ))}

                      {/* Phone Number - For Alzheimer's patients */}
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
            </div>

            {/* Right Panel - Controls */}
            <div className="flex flex-col h-full overflow-hidden">
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4">
              {/* Background Mode Selector */}
              <div className="bg-brand-card rounded-2xl p-4 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-3">Background Source</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBackgroundMode("scene")}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      backgroundMode === "scene"
                        ? "bg-brand-green text-white"
                        : "bg-brand-bg text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Scene Library
                  </button>
                  <button
                    onClick={() => setBackgroundMode("gradient")}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      backgroundMode === "gradient"
                        ? "bg-brand-green text-white"
                        : "bg-brand-bg text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Gradients
                  </button>
                  <button
                    onClick={() => setBackgroundMode("upload")}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      backgroundMode === "upload"
                        ? "bg-brand-green text-white"
                        : "bg-brand-bg text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Background Selector - based on mode */}
              {backgroundMode === "scene" ? (
                <SceneBackgroundSelector
                  selectedImage={wallpaperStyle.backgroundImage}
                  onSelect={(imageUrl) => {
                    setWallpaperStyle(prev => ({
                      ...prev,
                      backgroundType: "custom",
                      backgroundImage: imageUrl,
                      backgroundPosition: { x: 0, y: 0 },
                      backgroundScale: 1
                    }))
                  }}
                />
              ) : (
                <BackgroundSelector
                selectedBackground={wallpaperStyle.backgroundImage}
                backgroundType={wallpaperStyle.backgroundType}
                onSelect={(bg) => {
                  // Convert Tailwind class to actual gradient
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
                    'from-blue-400 to-teal-600': 'linear-gradient(to bottom, #60a5fa, #0d9488)'
                  };
                  const gradient = gradientMap[bg] || bg;
                  setWallpaperStyle(prev => ({ ...prev, backgroundType: "preset", backgroundImage: gradient, backgroundPosition: { x: 0, y: 0 }, backgroundScale: 1 }))
                }}
                onUpload={handleBackgroundUpload}
                onReset={resetBackground}
                fileInputRef={fileInputRef}
                hasUploadedImage={hasUploadedImage}
              />
              )}

              {/* Task Management */}
              <div className="bg-brand-card rounded-2xl p-4 border border-gray-800">
                {/* Notion Integration Section */}
                <div className="mb-4 p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
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
                          lang="en"
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
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>We will never access your private data</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>Only requesting read access to Tasks/Todo databases</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>You can revoke access anytime in Notion settings</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>Data is only used for personal lockscreen wallpapers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span className="text-brand-green font-semibold">Tasks will be auto-imported after connection</span>
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={importFromNotion}
                          disabled={isImportingFromNotion}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-green hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded-xl font-semibold transition-all text-sm"
                        >
                          {isImportingFromNotion ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Refresh Tasks from Notion
                            </>
                          )}
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                          Re-sync tasks from your Notion databases
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">
                      Tasks
                    </h3>
                    {/* Lock/Unlock Toggle Button */}
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

                    {/* Background Opacity Control */}
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
                    className="flex items-center gap-2 bg-brand-green hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-semibold transition-all hover:scale-105 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Global Font Size Control - Only show when locked */}
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

              {/* Style Controls */}
              {selectedTask && (
                <StyleControls
                  task={selectedTask}
                  onUpdate={(updates) => updateTask(selectedTask.id, updates)}
                  isEnglish={true}
                  isPro={true}
                  daysRemaining={0}
                />
              )}

              {/* Phone Number Input - For Alzheimer's patients */}
              <div className="bg-brand-card rounded-2xl p-4 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-3">
                  Emergency Contact
                  <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Add emergency contact number for Alzheimer's patients
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
              </div>{/* End of Scrollable Content Area */}

              {/* Fixed Generate Button at Bottom */}
              <div className="flex-shrink-0 pt-2 px-4 pb-4">
                <button
                  onClick={generateWallpaper}
                  disabled={isGenerating}
                  className="w-full py-3 bg-brand-green hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-green/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
        </div>
      </div>

      {/* Inspiration Panel */}
      {showInspiration && (
        <InspirationPanel
          onClose={() => setShowInspiration(false)}
          onApply={applyInspiration}
          isEnglish={true}
        />
      )}

      {/* Feedback Widget */}
      <FeedbackWidget isEnglish={true} />

      {/* Welcome Trial Modal - DISABLED to let users explore freely */}
      {/* <WelcomeTrialModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        trialEndsAt={trialEndsAt}
        daysRemaining={welcomeDaysRemaining}
      /> */}

      {/* Success Modal */}
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
            {/* QR Code */}
            {shareUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG
                    value={shareUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Scan QR code to download wallpaper
                </p>
              </div>
            )}

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              className="w-full bg-brand-green hover:bg-emerald-500 text-white font-semibold"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Wallpaper
            </Button>

            {/* Social Media Share Section */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-300 text-center">
                Share on Social Media
              </p>
              <div className="grid grid-cols-3 gap-2">
                {/* Twitter / X */}
                <Button
                  onClick={openTwitterShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-black hover:bg-gray-800 text-white border border-gray-700"
                  variant="outline"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-xs">Twitter</span>
                </Button>

                {/* Facebook */}
                <Button
                  onClick={openFacebookShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white"
                  variant="outline"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-xs">Facebook</span>
                </Button>

                {/* LinkedIn */}
                <Button
                  onClick={openLinkedInShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#0A66C2] hover:bg-[#0958a8] text-white"
                  variant="outline"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs">LinkedIn</span>
                </Button>

                {/* WhatsApp */}
                <Button
                  onClick={openWhatsAppShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white"
                  variant="outline"
                >
                  <Send className="w-5 h-4" />
                  <span className="text-xs">WhatsApp</span>
                </Button>

                {/* Telegram */}
                <Button
                  onClick={openTelegramShare}
                  className="flex flex-col gap-1 h-auto py-3 bg-[#0088cc] hover:bg-[#0077b3] text-white"
                  variant="outline"
                >
                  <Send className="w-5 h-4" />
                  <span className="text-xs">Telegram</span>
                </Button>

                {/* Copy Link */}
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

            {/* Continue Editing */}
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

      {/* Upgrade Modal with Pricing */}
      <UpgradeModalPricing
        isOpen={showUpgradeModalPricing}
        onClose={() => setShowUpgradeModalPricing(false)}
        lang="en"
      />
    </div>
  );
}
