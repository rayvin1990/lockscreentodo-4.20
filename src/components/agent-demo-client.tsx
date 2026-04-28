"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clipboard,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { RealisticPhoneMockup } from "~/components/realistic-phone-mockup";
import { useToast } from "~/components/ui/use-toast";

const reminders = [
  {
    id: "demo-medication",
    source: "agent-demo",
    title: "8:00 PM - take blood pressure medicine",
    kind: "medication",
    priority: "high",
    dueAt: "2026-04-28T20:00:00+08:00",
    requiresHuman: true,
    note: "After dinner",
  },
  {
    id: "demo-passport",
    source: "agent-demo",
    title: "Before leaving - bring passport",
    kind: "document",
    priority: "high",
    dueAt: "2026-04-29T08:30:00+08:00",
    requiresHuman: true,
  },
  {
    id: "demo-package",
    source: "agent-demo",
    title: "After work - pick up package",
    kind: "errand",
    priority: "normal",
    dueAt: "2026-04-28T18:30:00+08:00",
    requiresHuman: true,
  },
];

const agentMessages = [
  {
    role: "User",
    text: "Tomorrow is busy. Help me put the things I personally cannot miss onto my lock screen.",
  },
  {
    role: "Agent",
    text: "I found three human-only tasks worth persistent lockscreen visibility: medication, passport, and package pickup.",
  },
];

const PAYLOAD = {
  jsonrpc: "2.0",
  id: "demo-lockscreen-push",
  method: "tools/call",
  params: {
    name: "push_lockscreen_reminders",
    arguments: {
      reminders,
    },
  },
};

export function AgentDemoClient() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const phoneScreenRef = useRef<HTMLDivElement>(null);

  const copyPayload = async () => {
    await navigator.clipboard.writeText(JSON.stringify(PAYLOAD, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadPreview = async () => {
    if (!phoneScreenRef.current) return;

    setIsDownloading(true);
    try {
      const domtoimage = (await import("dom-to-image")) as unknown as {
        toPng: (
          node: HTMLElement,
          options: {
            width: number;
            height: number;
            quality: number;
            bgcolor: string;
            style: Record<string, string>;
          },
        ) => Promise<string>;
      };
      const node = phoneScreenRef.current;
      const rect = node.getBoundingClientRect();
      const scale = 3;
      const dataUrl = await domtoimage.toPng(node, {
        width: rect.width * scale,
        height: rect.height * scale,
        quality: 0.95,
        bgcolor: "#101214",
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "agent-lockscreen-demo.png";
      link.click();

      toast({
        title: "Downloaded",
        description: "Wallpaper saved to your downloads.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid min-h-0 gap-4 xl:grid-cols-[1fr_330px]">
      <div className="flex min-h-0 flex-col gap-4">
        <section className="rounded-md border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold text-white">
              Agent conversation
            </h2>
          </div>
          <div className="space-y-3 p-4">
            {agentMessages.map((message) => (
              <div key={message.role}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {message.role}
                </div>
                <p className="rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-200">
                  {message.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-md border border-white/10 bg-[#0b0d10]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold text-white">MCP payload</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={copyPayload}
              className="border-white/15 bg-white/[0.04] text-slate-100 hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="min-h-[260px] overflow-auto p-4 text-xs leading-5 text-slate-300">
            <code>{JSON.stringify(PAYLOAD, null, 2)}</code>
          </pre>
        </section>
      </div>

      <aside className="flex flex-col items-center justify-center rounded-md border border-white/10 bg-[#dfe7df] px-4 py-6 text-slate-950">
        <div className="mb-4 w-full max-w-[288px]">
          <div className="text-sm font-semibold text-slate-950">
            Rendered lockscreen
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Current demo renders an image for manual setup. Android companion
            app automation comes later.
          </p>
        </div>

        <RealisticPhoneMockup ref={phoneScreenRef}>
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #20251f 0%, #4b5549 46%, #111318 100%)",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(to_bottom,rgba(3,7,18,0.38),rgba(3,7,18,0.06)_34%,rgba(3,7,18,0.22)_64%,rgba(3,7,18,0.72))]" />
            <div className="absolute left-1/2 top-[300px] z-10 w-[250px] -translate-x-1/2 rounded-[22px] border border-white/15 bg-[#080a0f]/35 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">
                  Today
                </span>
                <span className="h-px flex-1 bg-white/16" />
              </div>
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start">
                    <span className="mt-[0.45em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/72 shadow-[0_0_18px_rgba(255,255,255,0.24)]" />
                    <span className="pl-3 text-[13px] font-semibold leading-[1.38] text-slate-50 [text-shadow:0_1px_18px_rgba(0,0,0,0.42)]">
                      {reminder.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RealisticPhoneMockup>

        <div className="mt-5 grid w-full max-w-[288px] grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={downloadPreview}
            disabled={isDownloading}
            className="bg-slate-950 text-white hover:bg-slate-800"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            className="border-slate-950/15 bg-white/70 text-slate-950 hover:bg-white"
          >
            <Link href="/en/generator">
              <ExternalLink className="h-4 w-4" />
              Generator
            </Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
