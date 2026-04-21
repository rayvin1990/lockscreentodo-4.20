"use client";

// VERSION MARKER: 2025-02-27-v2 - Wallpaper save feature added
console.log('Generator page loaded - VERSION 2025-02-27-v2');

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Smartphone, Plus, Trash2, X, Download, Share2, Twitter, Facebook, Linkedin, Send, ShoppingCart, Settings, GripVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
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
import { useDownloadLimit } from "~/hooks/use-download-limit";
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
  const { isSignedIn, isLoaded, userId } = useAuth();

  const { downloadLimitStatus, checkDownloadLimit, recordDownload } = useDownloadLimit();

  useEffect(() => {
    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    setCurrentLang(lang);
  }, []);

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

  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isImportingFromNotion, setIsImportingFromNotion] = useState(false);

  const [tasksLocked, setTasksLocked] = useState(true);
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 200 });
  const [globalFontSize, setGlobalFontSize] = useState(14);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.65);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const [dragStartBg, setDragStartBg] = useState({ x: 0, y: 0 });
  const [bgStartPos, setBgStartPos] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  const selectedTask = wallpaperStyle.tasks.find(t => t.id === selectedTaskId);

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

    setIsDraggingBg(true);
    setDragStartBg({ x: e.clientX, y: e.clientY });
    setBgStartPos({ ...wallpaperStyle.backgroundPosition });

    console.log('Drag started at', { x: e.clientX, y: e.clientY, startPos: wallpaperStyle.backgroundPosition });

    document.addEventListener("mousemove", handleBackgroundMouseMove as any);
    document.addEventListener("mouseup", handleBackgroundMouseUp as any);
  };

  const handleBackgroundMouseMove = (e: MouseEvent) => {
    if (!isDraggingBg) return;

    const deltaX = e.clientX - dragStartBg.x;
    const deltaY = e.clientY - dragStartBg.y;

    const newPosition = {
      x: bgStartPos.x + deltaX,
      y: bgStartPos.y + deltaY,
    };

    console.log('Dragging to', { deltaX, deltaY, newPosition });

    setWallpaperStyle(prev => ({
      ...prev,
      backgroundPosition: newPosition,
    }));
  };

  const handleBackgroundMouseUp = () => {
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
      setInitialPinchDistance(distance);
      setInitialScale(wallpaperStyle.backgroundScale);
    } else if (e.touches.length === 1) {
      setIsDraggingBg(true);
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
      const scale = distance / initialPinchDistance;
      const newScale = Math.max(0.5, Math.min(3, initialScale * scale));

      setWallpaperStyle(prev => ({
        ...prev,
        backgroundScale: newScale,
      }));
    } else if (e.touches.length === 1 && isDraggingBg) {
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

  const handleTouchEnd = () => {
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

      const { userId } = useAuth();
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
      fontSize: 14,
      color: "#000000",
      backgroundColor: "transparent",
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
      backgroundImage: "",
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

      setWallpaperStyle(prev => ({ ...prev, tasks: importedTasks }));

      toast({
        title: "Tasks Imported!",
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

  const hasLoadedFromSupabase = useRef(false);

  const loadTasksFromSupabase = async (userId: string) => {
    if (hasLoadedFromSupabase.current) {
      console.log('Already loaded from Supabase, skipping');
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
        console.log('Loaded tasks from Supabase:', tasks.length);
      } else {
        console.log('No tasks in Supabase, using local state');
        hasLoadedFromSupabase.current = true;
      }
    } catch (error) {
      console.error('Failed to load tasks from Supabase:', error);
      hasLoadedFromSupabase.current = true;
    }
  };

  const saveTasksToSupabase = async (userId: string, tasks: Task[]) => {
    try {
      const validTasks = tasks.filter(task => task.text && task.text.trim() !== '');
      const uniqueTasks = Array.from(
        new Map(validTasks.map(task => [task.id, task])).values()
      );

      const currentTaskIds = uniqueTasks.map(task => task.id);

      if (currentTaskIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('user_id', userId)
          .not('notion_task_id', 'in', `(${currentTaskIds.join(',')})`);

        if (deleteError) {
          console.error('Failed to delete removed tasks:', deleteError);
        }
      } else {
        const { error: deleteAllError } = await supabase
          .from('tasks')
          .delete()
          .eq('user_id', userId);

        if (deleteAllError) {
          console.error('Failed to delete all tasks:', deleteAllError);
        }
        console.log('No tasks to save');
        return;
      }

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

      console.log('Saved tasks to Supabase:', tasksToUpsert.length);
    } catch (error) {
      console.error('Failed to save tasks to Supabase:', error);
    }
  };

  useEffect(() => {
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

          if (data.connected && !wasConnected) {
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
        title: "Notion Connected!",
        description: "Importing your tasks now...",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    loadTasksFromSupabase(userId);
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

    if (!isSignedIn) {
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

      limitResponse = await fetch("/api/generate/check-limit", {
        signal: controller.signal,
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
      if (limitData.reason === 'TRIAL_EXPIRED') {
        setShowUpgradeModalPricing(true);
        toast({
          variant: "destructive",
          title: "Trial period has ended",
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

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
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

      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';

      console.log(`IMGBB API Key: ${IMGBB_API_KEY ? 'configured' : 'NOT CONFIGURED'}`);

      if (!IMGBB_API_KEY) {
        throw new Error("IMGBB API key not configured");
      }

      const base64Data = dataUrl.split(',')[1];

      console.log(`Image size: ${Math.round(base64Data.length * 0.75 / 1024)}KB`);

      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64Data);

      let imageUrl = '';
      let uploadSuccess = false;
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries && !uploadSuccess; attempt++) {
        try {
          console.log(`Uploading to imgbb... Attempt ${attempt}/${maxRetries}`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          console.log(`ImgBB response status: ${imgbbResponse.status}`);

          if (!imgbbResponse.ok) {
            const errorText = await imgbbResponse.text();
            console.error(`ImgBB upload failed (attempt ${attempt}):`, errorText);

            if (attempt < maxRetries) {
              console.log(`Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error(`Failed to upload to imgbb (Status: ${imgbbResponse.status})`);
          }

          const imgbbData = await imgbbResponse.json();
          console.log('ImgBB response data:', imgbbData);

          if (!imgbbData.success) {
            console.error(`ImgBB returned unsuccessful response (attempt ${attempt})`);

            if (attempt < maxRetries) {
              console.log(`Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error('imgbb upload failed');
          }

          imageUrl = imgbbData.data.url;
          uploadSuccess = true;
          console.log('Upload successful:', imageUrl);

        } catch (uploadError: any) {
          console.error(`Upload attempt ${attempt} failed:`, uploadError);

          if (uploadError.name === 'AbortError') {
            console.error('Upload timeout (30s)');
            if (attempt < maxRetries) {
              console.log(`Retrying in 2 seconds...`);
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

      console.log('Recording wallpaper generation...');
      try {
        const recordResponse = await fetch('/api/generate/record-usage', {
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

      console.log('Saving wallpaper to history...');
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
          console.log('Wallpaper saved to history successfully');
        } else {
          const errorText = await saveWallpaperResponse.text();
          console.error('Failed to save wallpaper to history. Status:', saveWallpaperResponse.status, 'Response:', errorText);
        }
      } catch (error) {
        console.error('Error saving wallpaper to history:', error);
      }

      await recordDownload();

      setShowSuccessModal(true);

      toast({
        title: "Wallpaper generated successfully!",
        description: "Scan QR code to download",
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
    import("dom-to-image").then(({ toPng }) => {
      const rect = canvas.getBoundingClientRect();
      const scale = 2;

      toPng(canvas, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 1,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backdropFilter: 'none !important',
          webkitBackdropFilter: 'none !important',
        },
      }).then(async (dataUrl: string) => {
        const link = document.createElement("a");
        link.download = `lockscreen-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        await recordDownload();
      });
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
                {currentLang === "zh" ? "升级 Pro 版" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 px-4 sm:px-6 lg:px-8" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid lg:grid-cols-2 gap-4 h-full">
            <div className="h-full flex flex-col">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold text-white mb-1">
                  Preview
                </h3>
                <p className="text-xs text-gray-400 mb-3">
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
            </div>

            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4">
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
                        backgroundScale: 1
                      }))
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
                        <div className="space-y-2">
                          <button
                            onClick={importFromNotion}
                            disabled={isImportingFromNotion}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-white/90 disabled:bg-white/50 disabled:text-black/50 text-black rounded-xl font-semibold transition-all text-sm"
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
              </div>

              <div className="flex-shrink-0 pt-2 px-4 pb-4">
                <button
                  onClick={generateWallpaper}
                  disabled={isGenerating}
                  className="w-full py-3 bg-white hover:bg-white/90 text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
        lang="en"
      />
    </div>
  );
}
