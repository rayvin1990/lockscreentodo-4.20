"use client";

import { useState } from "react";
import { ArrowRight, Download, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { trackEvent } from "~/lib/analytics";

type SubmitState = "idle" | "submitting" | "done" | "error";

export function VibeRunnerCta() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [showForm, setShowForm] = useState(false);

  function openSignup(intent: "download" | "early_access") {
    trackEvent("viberunner_fake_door_click", { intent });
    setShowForm(true);
  }

  async function submitWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    try {
      const response = await fetch("/api/vibe-runner/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "landing_page",
          intent: "windows_beta",
          priceAnchor: 19,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      trackEvent("viberunner_waitlist_submit", {
        intent: "windows_beta",
        priceAnchor: 19,
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="max-w-xl rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
        You are on the beta list. I will use this page to measure whether the
        demand is real before building the desktop app.
      </div>
    );
  }

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          className="h-12 bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200"
          onClick={() => openSignup("download")}
        >
          <Download aria-hidden="true" />
          Download Windows Beta - $19
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 border-white/40 bg-transparent px-5 text-sm text-white hover:bg-white/10 hover:text-white"
          onClick={() => openSignup("early_access")}
        >
          Join early access
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>

      {showForm ? (
        <form
          className="flex flex-col gap-2 rounded-md border border-white/20 bg-black/35 p-2 sm:flex-row"
          onSubmit={submitWaitlist}
        >
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="min-h-11 flex-1 rounded-md border border-white/15 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-500 focus:border-zinc-400"
          />
          <Button
            type="submit"
            disabled={state === "submitting"}
            className="min-h-11 bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            {state === "submitting" ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight aria-hidden="true" />
            )}
            Get beta invite
          </Button>
        </form>
      ) : null}

      {state === "error" ? (
        <p className="text-sm text-zinc-200">
          The signup did not go through. Please try again.
        </p>
      ) : null}
    </div>
  );
}
