"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Send, Smartphone, Trash2 } from "lucide-react";

import type { AgentReminder } from "~/lib/agent-reminders";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type ReminderResponse = {
  ok: boolean;
  authMode?: string;
  reminders?: AgentReminder[];
  lockscreenQueue?: AgentReminder[];
  error?: string;
};

const sampleReminder = {
  source: "debug-ui",
  title: "Bring passport before leaving",
  note: "Agent found a flight check-in task that needs a physical document.",
  kind: "document",
  priority: "high",
  dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  location: "Front door",
  requiresHuman: true,
};

export function LockscreenMcpDebug() {
  const [apiKey, setApiKey] = useState("");
  const [state, setState] = useState<ReminderResponse | null>(null);
  const [title, setTitle] = useState(sampleReminder.title);
  const [note, setNote] = useState(sampleReminder.note);
  const [kind, setKind] = useState(sampleReminder.kind);
  const [priority, setPriority] = useState(sampleReminder.priority);
  const [location, setLocation] = useState(sampleReminder.location);
  const [status, setStatus] = useState("Loading queue...");

  const headers = useMemo(() => {
    const next: HeadersInit = { "Content-Type": "application/json" };
    if (apiKey.trim()) next["x-agent-api-key"] = apiKey.trim();
    return next;
  }, [apiKey]);

  async function loadQueue() {
    setStatus("Loading queue...");
    const response = await fetch("/api/agent/reminders", { headers, cache: "no-store" });
    const data = (await response.json()) as ReminderResponse;
    setState(data);
    setStatus(data.ok ? "Queue loaded" : data.error || "Request failed");
  }

  async function pushReminder() {
    setStatus("Sending reminder...");
    const response = await fetch("/api/agent/reminders", {
      method: "POST",
      headers,
      body: JSON.stringify({
        reminders: [
          {
            source: "debug-ui",
            title,
            note,
            kind,
            priority,
            dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            location: location || null,
            requiresHuman: true,
          },
        ],
      }),
    });
    const data = (await response.json()) as ReminderResponse;
    setState(data);
    setStatus(data.ok ? "Reminder pushed" : data.error || "Request failed");
  }

  async function clearReminder(id: string) {
    setStatus("Clearing reminder...");
    const response = await fetch(`/api/agent/reminders?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers,
    });
    const data = (await response.json()) as ReminderResponse;
    setState(data);
    setStatus(data.ok ? "Reminder cleared" : data.error || "Request failed");
  }

  async function clearAll() {
    setStatus("Clearing queue...");
    const response = await fetch("/api/agent/reminders?all=true", {
      method: "DELETE",
      headers,
    });
    const data = (await response.json()) as ReminderResponse;
    setState(data);
    setStatus(data.ok ? "Queue cleared" : data.error || "Request failed");
  }

  function openGenerator() {
    window.location.href = "/en/generator?source=agent";
  }

  useEffect(() => {
    void loadQueue();
  }, []);

  const queue = state?.lockscreenQueue || [];
  const stored = state?.reminders || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                Lockscreen MCP
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
                Agent reminder debug console
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadQueue}>
                <RefreshCcw />
                Refresh
              </Button>
              <Button onClick={openGenerator} disabled={queue.length === 0}>
                <Smartphone />
                Open generator
              </Button>
              <Button variant="destructive" onClick={clearAll} disabled={stored.length === 0}>
                <Trash2 />
                Clear all
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_150px_150px]">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value)}
                className="h-10 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm"
              >
                {["medication", "grocery", "errand", "document", "appointment", "family", "payment", "travel", "other"].map(
                  (value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ),
                )}
              </select>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="h-10 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm"
              >
                {["low", "medium", "high", "critical"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_220px]">
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-24 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
              />
              <div className="space-y-3">
                <Input value={location} onChange={(event) => setLocation(event.target.value)} />
                <Button className="w-full" onClick={pushReminder}>
                  <Send />
                  Push reminder
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active lockscreen queue</h2>
              <span className="text-sm text-zinc-400">{queue.length}/5 visible</span>
            </div>
            {queue.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 px-4 py-10 text-center text-sm text-zinc-400">
                No active reminders qualify for the lock screen.
              </div>
            ) : (
              <div className="grid gap-3">
                {queue.map((reminder) => (
                  <ReminderRow key={reminder.id} reminder={reminder} onClear={clearReminder} />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <label className="text-sm font-medium text-zinc-300" htmlFor="agent-key">
              Agent API key
            </label>
            <Input
              id="agent-key"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Optional in local dev"
              className="mt-2"
              type="password"
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-300">
                Status
              </h2>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">
                {state?.authMode || "unknown"}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-400">{status}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-300">
              Raw response
            </h2>
            <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap text-xs leading-5 text-zinc-300">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        </aside>
      </main>
    </div>
  );
}

function ReminderRow({
  reminder,
  onClear,
}: {
  reminder: AgentReminder;
  onClear: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/80 p-4">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-white">{reminder.title}</h3>
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-300">
              {reminder.priority}
            </span>
            <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">
              {reminder.kind}
            </span>
          </div>
          {reminder.note ? <p className="mt-2 text-sm text-zinc-400">{reminder.note}</p> : null}
          <p className="mt-2 text-xs text-zinc-500">{reminder.id}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onClear(reminder.id)} aria-label="Clear reminder">
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
