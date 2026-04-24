"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface SyncedNotionTask {
  id: string;
  text: string;
  dueDate?: string;
  notionLastEditedTime?: string;
  isDeleted?: boolean;
}

export interface UseNotionSyncReturn {
  tasks: SyncedNotionTask[];
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncError: string | null;
  syncNow: () => Promise<void>;
  isNotionConnected: boolean;
}

const LAST_SYNC_KEY = "notion_last_sync_time";

export function useNotionSync(isConnected: boolean): UseNotionSyncReturn {
  const [tasks, setTasks] = useState<SyncedNotionTask[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const [isNotionConnected, setIsNotionConnected] = useState(isConnected);

  const syncInProgressRef = useRef(false);
  const hasInitialSyncRef = useRef(false);

  // Load last sync time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LAST_SYNC_KEY);
    if (stored) {
      setLastSyncTime(stored);
    }
  }, []);

  // Update isNotionConnected when prop changes
  useEffect(() => {
    setIsNotionConnected(isConnected);
  }, [isConnected]);

  const syncNow = useCallback(async () => {
    if (syncInProgressRef.current) {
      console.log("[useNotionSync] Sync already in progress, skipping");
      return;
    }

    if (!isNotionConnected) {
      console.log("[useNotionSync] Notion not connected, skipping sync");
      return;
    }

    syncInProgressRef.current = true;
    setIsSyncing(true);
    setLastSyncError(null);

    try {
      const response = await fetch("/api/notion/sync");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Sync failed");
      }

      const data = await response.json();

      if (data.success) {
        // Update last sync time
        const syncTime = data.lastSyncTime || new Date().toISOString();
        setLastSyncTime(syncTime);
        localStorage.setItem(LAST_SYNC_KEY, syncTime);

        // Fetch updated tasks from Supabase
        const tasksResponse = await fetch("/api/notion/tasks");
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (tasksData.tasks) {
            setTasks(tasksData.tasks.map((t: any) => ({
              id: t.id,
              text: t.text,
              dueDate: t.dueDate,
              notionLastEditedTime: t.lastEditedTime,
            })));
          }
        }

        console.log(`[useNotionSync] Sync complete: ${data.added} added, ${data.updated} updated, ${data.deleted} deleted`);
      }
    } catch (error) {
      console.error("[useNotionSync] Sync error:", error);
      setLastSyncError(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setIsSyncing(false);
      syncInProgressRef.current = false;
    }
  }, [isNotionConnected]);

  // Auto-sync on page load if connected
  useEffect(() => {
    if (isNotionConnected && !hasInitialSyncRef.current) {
      hasInitialSyncRef.current = true;
      // Small delay to not block page rendering
      setTimeout(() => {
        syncNow();
      }, 500);
    }
  }, [isNotionConnected, syncNow]);

  // Periodic sync every 5 minutes
  useEffect(() => {
    if (!isNotionConnected) return;

    const interval = setInterval(() => {
      console.log("[useNotionSync] Periodic sync triggered");
      syncNow();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isNotionConnected, syncNow]);

  return {
    tasks,
    isSyncing,
    lastSyncTime,
    lastSyncError,
    syncNow,
    isNotionConnected,
  };
}

// Helper to format last sync time
export function formatLastSyncTime(lastSyncTime: string | null): string {
  if (!lastSyncTime) return "Never synced";

  const now = new Date();
  const last = new Date(lastSyncTime);
  const diffMs = now.getTime() - last.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}