"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Task {
  reminder_id: string;
  title: string;
  note: string | null;
  priority: "low" | "medium" | "high" | "critical";
  kind: string;
  due_at: string | null;
  score: number;
  estimated_minutes: number;
  reason: string | null;
  status: "pending" | "done" | "skipped";
  sort_order: number;
}

interface PlanData {
  ordered_tasks: Task[];
  meta: {
    generated_at: string;
    total_reminders: number;
    scheduled_count: number;
    total_estimated_minutes: number;
    rules_applied: string[];
  };
}

interface Plan {
  id: string;
  user_id: string;
  plan_date: string;
  status: string;
  plan_data: PlanData;
  context_snapshot: Record<string, unknown> | null;
}

// ─── Config ─────────────────────────────────────────────────────────────────────

const DAEMON_BASE = process.env.NEXT_PUBLIC_DAEMON_URL || "http://localhost:8767";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "紧急", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  high: { label: "高", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  medium: { label: "中", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  low: { label: "低", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/30" },
};

const KIND_LABELS: Record<string, string> = {
  medication: "💊 用药",
  grocery: "🛒 采购",
  errand: "🏃 跑腿",
  document: "📄 文件",
  appointment: "📅 预约",
  family: "👨‍👩‍👧 家庭",
  payment: "💰 付款",
  travel: "✈️ 出行",
  coding: "💻 编程",
  other: "📌 其他",
};

function kindLabel(k: string) {
  return KIND_LABELS[k] || k || "📌 其他";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hour}:${min}`;
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function DesktopTodoPage() {
  const { user, isLoaded } = useUser();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [daemonConnected, setDaemonConnected] = useState<boolean | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      // Try daemon first
      const res = await fetch(`${DAEMON_BASE}/api/plan/today`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error("Daemon not reachable");
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setDaemonConnected(true);
        setError(null);
      } else {
        setPlan(null);
      }
    } catch {
      // Daemon not available – try Supabase via Next.js API
      setDaemonConnected(false);
      try {
        const res = await fetch("/api/schedule/today");
        if (res.ok) {
          const data = await res.json();
          if (data.plan) setPlan(data.plan);
        }
      } catch {
        setError("无法连接到任务调度器");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) fetchPlan();
  }, [isLoaded, fetchPlan]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlan().then(() => setLastRefresh(new Date()));
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPlan]);

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";

    // Optimistic update
    setPlan((prev) => {
      if (!prev) return prev;
      const tasks = prev.plan_data.ordered_tasks.map((t) =>
        t.reminder_id === task.reminder_id ? { ...t, status: newStatus as Task["status"] } : t
      );
      return { ...prev, plan_data: { ...prev.plan_data, ordered_tasks: tasks } };
    });

    try {
      await fetch(`${DAEMON_BASE}/api/plan/tasks/${task.reminder_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Revert on failure
      setPlan((prev) => {
        if (!prev) return prev;
        const tasks = prev.plan_data.ordered_tasks.map((t) =>
          t.reminder_id === task.reminder_id ? { ...t, status: task.status } : t
        );
        return { ...prev, plan_data: { ...prev.plan_data, ordered_tasks: tasks } };
      });
    }
  };

  const skipTask = async (task: Task) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const tasks = prev.plan_data.ordered_tasks.map((t) =>
        t.reminder_id === task.reminder_id ? { ...t, status: "skipped" as Task["status"] } : t
      );
      return { ...prev, plan_data: { ...prev.plan_data, ordered_tasks: tasks } };
    });

    try {
      await fetch(`${DAEMON_BASE}/api/plan/tasks/${task.reminder_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "skipped" }),
      });
    } catch {
      fetchPlan();
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchPlan().then(() => {
      setLastRefresh(new Date());
      setLoading(false);
    });
  };

  const tasks = plan?.plan_data?.ordered_tasks || [];
  const meta = plan?.plan_data?.meta;
  const context = plan?.context_snapshot as
    | { git?: { branch?: string }; files_changed?: Array<unknown>; recent_commits?: string[] }
    | null
    | undefined;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-6 flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">📋 今日待办</h1>
            <p className="mt-1 text-sm text-zinc-500">{dateStr}</p>
          </div>
          <div className="flex items-center gap-3">
            {daemonConnected === true && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Daemon 在线
              </span>
            )}
            {daemonConnected === false && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                离线模式
              </span>
            )}
            <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs text-purple-400">
              {doneTasks}/{totalTasks}
            </span>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {loading ? "刷新中..." : "刷新"}
            </button>
          </div>
        </div>

        {/* ─── Stats Bar ──────────────────────────────────────────── */}
        {totalTasks > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-zinc-500">
            <span>
              总计 <strong className="text-zinc-300">{totalTasks}</strong> 项
            </span>
            <span>
              已完成 <strong className="text-zinc-300">{doneTasks}</strong>
            </span>
            {meta?.total_estimated_minutes && (
              <span>
                预估 <strong className="text-zinc-300">{meta.total_estimated_minutes}</strong> 分钟
              </span>
            )}
            <div className="h-1 flex-1 min-w-[80px] overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* ─── Error State ────────────────────────────────────────── */}
        {error && !loading && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-8 text-center">
            <div className="mb-3 text-4xl">⚠️</div>
            <p className="text-red-400">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">
              确保 daemon 正在运行：<code className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400">npm run scheduler:daemon</code>
            </p>
          </div>
        )}

        {/* ─── Loading State ──────────────────────────────────────── */}
        {loading && !plan && !error && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <div className="mb-2 h-4 w-3/4 rounded bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        )}

        {/* ─── Empty State ────────────────────────────────────────── */}
        {!loading && !error && totalTasks === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <h2 className="mb-2 text-lg font-medium text-zinc-300">还没有待办任务</h2>
            <p className="mb-6 text-sm text-zinc-500">
              添加任务后 daemon 会自动排期。你也可以手动触发排期。
            </p>
            <button
              onClick={handleRefresh}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
            >
              检查新任务
            </button>
          </div>
        )}

        {/* ─── Task List ──────────────────────────────────────────── */}
        {totalTasks > 0 && (
          <div className="space-y-2">
            {tasks
              .filter((t) => t.status !== "skipped")
              .map((task) => {
                const pcfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                const isDone = task.status === "done";

                return (
                  <div
                    key={task.reminder_id}
                    className={`group rounded-xl border px-4 py-3.5 transition-all ${
                      isDone
                        ? "border-zinc-800/50 bg-zinc-900/20 opacity-50"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          isDone
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-zinc-600 hover:border-purple-500"
                        }`}
                      >
                        {isDone && <span className="text-[10px] font-bold">✓</span>}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-medium leading-snug ${
                            isDone ? "text-zinc-500 line-through" : "text-zinc-200"
                          }`}
                        >
                          {task.title}
                        </div>

                        {task.note && !isDone && (
                          <div className="mt-1 text-xs text-zinc-500">{task.note}</div>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${pcfg.bg} ${pcfg.color}`}
                          >
                            {pcfg.label}优先级
                          </span>
                          <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            {kindLabel(task.kind)}
                          </span>
                          {task.due_at && !isDone && (
                            <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                              ⏰ {formatDate(task.due_at)}
                            </span>
                          )}
                          {task.estimated_minutes && !isDone && (
                            <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                              {task.estimated_minutes}分钟
                            </span>
                          )}
                        </div>

                        {task.reason && !isDone && (
                          <div className="mt-1.5 text-[11px] text-zinc-600">💡 {task.reason}</div>
                        )}
                      </div>

                      {/* Actions */}
                      {!isDone && (
                        <button
                          onClick={() => skipTask(task)}
                          className="shrink-0 rounded-md border border-zinc-800 px-2 py-1 text-[11px] text-zinc-600 opacity-0 transition-all hover:border-zinc-700 hover:text-zinc-400 group-hover:opacity-100"
                        >
                          跳过
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Skipped tasks collapsed */}
            {tasks.filter((t) => t.status === "skipped").length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-zinc-600 hover:text-zinc-400">
                  已跳过 {tasks.filter((t) => t.status === "skipped").length} 项
                </summary>
                <div className="mt-2 space-y-1">
                  {tasks
                    .filter((t) => t.status === "skipped")
                    .map((task) => (
                      <div
                        key={task.reminder_id}
                        className="flex items-center gap-2 rounded-lg bg-zinc-900/20 px-3 py-2 opacity-40"
                      >
                        <button
                          onClick={() => toggleTask(task)}
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-[8px] hover:border-purple-500"
                        >
                          ↻
                        </button>
                        <span className="text-xs text-zinc-500 line-through">{task.title}</span>
                      </div>
                    ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* ─── Context Bar ────────────────────────────────────────── */}
        {context && (context.git || context.files_changed?.length) && (
          <div className="mt-6 flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-xs text-zinc-500">
            {context.git?.branch && <span>🌿 {context.git.branch}</span>}
            {context.files_changed && context.files_changed.length > 0 && (
              <span>📄 {context.files_changed.length} 个文件已修改</span>
            )}
            {context.recent_commits && context.recent_commits.length > 0 && (
              <span className="truncate max-w-[300px]">🔨 {context.recent_commits[0]}</span>
            )}
          </div>
        )}

        {/* ─── Footer ─────────────────────────────────────────────── */}
        <div className="mt-8 text-center text-xs text-zinc-700">
          <p>
            {daemonConnected
              ? `Daemon 直连 · 最后刷新 ${lastRefresh.toLocaleTimeString("zh-CN")} · 每 60 秒自动刷新`
              : `离线模式 · 最后刷新 ${lastRefresh.toLocaleTimeString("zh-CN")}`}
          </p>
          <p className="mt-1">
            <button
              onClick={() => {
                const el = document.querySelector("html");
                if (el) el.classList.toggle("dark");
              }}
              className="hover:text-zinc-500"
            >
              切换主题
            </button>
            {" · "}
            <span
              className="cursor-pointer hover:text-zinc-500"
              onClick={() => {
                if (window.matchMedia("(display-mode: standalone)").matches) {
                  alert("已安装到桌面 ✓");
                } else {
                  alert("在浏览器菜单选择「安装 Desktop Todo」即可固定到任务栏");
                }
              }}
            >
              安装到桌面
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
