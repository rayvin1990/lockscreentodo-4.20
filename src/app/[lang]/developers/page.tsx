import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Braces, KeyRound, Smartphone, TerminalSquare } from "lucide-react";

import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Developers - Lockscreen MCP",
  description:
    "Use Lockscreen MCP to let agents send human-only real-world reminders to a phone lockscreen workflow.",
};

const pushPayload = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "push_lockscreen_reminders",
    "arguments": {
      "reminders": [
        {
          "source": "openclaw",
          "title": "Bring passport before leaving",
          "kind": "document",
          "priority": "high",
          "dueAt": "2026-04-29T18:00:00+08:00",
          "location": "Front door",
          "requiresHuman": true
        }
      ]
    }
  }
}`;

const restPayload = `curl -X POST https://lockscreentodo.com/api/agent/reminders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $LOCKSCREEN_AGENT_API_KEY" \\
  -d '{
    "reminders": [
      {
        "source": "agent",
        "title": "Take medication after dinner",
        "kind": "medication",
        "priority": "critical",
        "requiresHuman": true
      }
    ]
  }'`;

export default function DevelopersPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en";

  return (
    <main className="min-h-screen bg-[#0f1115] text-white">
      <nav className="border-b border-white/10 bg-[#0f1115]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href={`/${lang}`} className="text-sm font-semibold text-white">
            LockscreenTodo
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/generator`} className="text-sm text-slate-400 hover:text-white">
              Generator
            </Link>
            <Link href={`/${lang}/lockscreen-mcp`} className="text-sm text-slate-400 hover:text-white">
              Debug console
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">
            <TerminalSquare className="h-4 w-4" />
            Lockscreen MCP
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Agent-created reminders, rendered into a lockscreen workflow.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Send only the tasks a person still has to do in the real world:
            medication, documents, errands, appointments, family, travel, or
            payments. Everything else should stay in normal agent logs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-white text-black hover:bg-slate-200">
              <Link href={`/${lang}/lockscreen-mcp`}>
                Open debug console
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/10">
              <Link href={`/${lang}/generator?source=agent`}>
                Open generator bridge
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-sm text-slate-300">
            <Braces className="h-4 w-4 text-emerald-200" />
            MCP tools/call example
          </div>
          <pre className="mt-4 overflow-auto text-xs leading-5 text-slate-300">
            <code>{pushPayload}</code>
          </pre>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-3">
          <FlowStep icon={TerminalSquare} title="1. Agent pushes" text="Use MCP JSON-RPC or the REST endpoint to submit structured reminder events." />
          <FlowStep icon={KeyRound} title="2. Queue filters" text="The active queue keeps only human-required reminders that deserve lockscreen space." />
          <FlowStep icon={Smartphone} title="3. Generator renders" text="Open the generator bridge to turn the active queue into a QR/download wallpaper." />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">REST endpoint</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Production requests should include `Authorization: Bearer` or
            `x-agent-api-key`. Local development stays open when no agent key is
            configured and `NODE_ENV` is not production.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 p-5">
          <pre className="overflow-auto text-xs leading-5 text-slate-300">
            <code>{restPayload}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}

function FlowStep({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof TerminalSquare;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111419] p-5">
      <Icon className="h-5 w-5 text-emerald-200" />
      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}
