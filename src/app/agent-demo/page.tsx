import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bot, Smartphone, TerminalSquare } from "lucide-react";

import { AgentDemoClient } from "~/components/agent-demo-client";

export const metadata: Metadata = {
  title: "Describe your task, get a lockscreen wallpaper - LockscreenTodo",
  description:
    "Turn real-world tasks into a calm phone lockscreen reminder, with an AI agent preparing the structured payload behind the scenes.",
};

export default function AgentDemoPage() {
  return (
    <main className="min-h-screen bg-[#101214] text-white">
      <header className="border-b border-white/10 bg-[#101214]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/en/generator"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Generator
          </Link>
          <div className="text-sm font-semibold text-white">
            LockscreenTodo
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100svh-65px)] max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3 py-1 text-sm font-medium text-slate-200">
            <Bot className="h-4 w-4 text-emerald-200" />
            Agent-to-lockscreen primitive
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
            Describe your task. Get a lockscreen wallpaper.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            LockscreenTodo turns the things you cannot miss into a calm phone
            wallpaper. In this demo, an AI agent prepares the structured
            payload behind the scenes.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Step icon={Bot} label="Agent filters tasks" />
            <Step icon={TerminalSquare} label="MCP payload is sent" />
            <Step icon={Smartphone} label="Lockscreen is rendered" />
          </div>
        </div>

        <AgentDemoClient />
      </section>
    </main>
  );
}

function Step({
  icon: Icon,
  label,
}: {
  icon: typeof Bot;
  label: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
      <Icon className="h-5 w-5 text-emerald-200" />
      <div className="mt-3 text-sm font-medium text-slate-200">{label}</div>
    </div>
  );
}
