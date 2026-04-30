import type { Metadata } from "next";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Code2,
  Gauge,
  ShieldCheck,
} from "lucide-react";

import { VibeRunnerCta } from "~/components/vibe-runner-cta";

export const metadata: Metadata = {
  title: "VibeRunner - Run AI-generated code locally",
  description:
    "Paste code from v0, Claude, or ChatGPT. VibeRunner starts the local preview and explains setup errors without forcing beginners into the terminal.",
};

const proofPoints = [
  {
    value: "1",
    label: "Paste the AI response",
  },
  {
    value: "2",
    label: "Install and launch locally",
  },
  {
    value: "3",
    label: "Open the browser preview",
  },
];

const features = [
  {
    icon: Clipboard,
    title: "Prompt-to-preview flow",
    copy: "Drop in the response from v0, Claude, or ChatGPT and get a clean execution plan instead of guessing which commands matter.",
  },
  {
    icon: ShieldCheck,
    title: "Human-approved commands",
    copy: "The beta keeps fixes explicit: risky shell commands are blocked, and repair steps ask for confirmation before touching files.",
  },
  {
    icon: AlertTriangle,
    title: "Plain-English failure reports",
    copy: "When npm or Node fails, the app turns the error into a short diagnosis that can be handed to Cursor, Claude, or a developer.",
  },
];

const examples = [
  "Run v0.dev exports on Windows without opening PowerShell.",
  "Preview Claude-generated React apps in a real local folder.",
  "Understand npm ERESOLVE, missing env vars, and port conflicts.",
];

export default function VibeRunnerPage() {
  return (
    <main className="min-h-screen bg-[#111315] text-white">
      <section className="bg-black">
        <div className="mx-auto grid min-h-[86svh] w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-md border border-white/20 bg-white/5 px-3 py-1 text-sm font-medium text-zinc-200">
              Windows beta demand test
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl lg:text-6xl">
              Run AI-generated code locally. No terminal required.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Paste code from v0, Claude, or ChatGPT. VibeRunner installs the
              dependencies, starts the preview, and explains setup errors in
              plain English.
            </p>
            <div className="mt-8">
              <VibeRunnerCta />
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div
                  key={point.value}
                  className="rounded-md border border-white/15 bg-white/[0.03] p-3"
                >
                  <div className="text-lg font-semibold text-white">
                    {point.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-200">
                    {point.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative -mr-5 hidden min-h-[560px] sm:-mr-8 lg:-mr-10 lg:block">
            <Image
              src="/vibe-runner/hero-product-mockup.png"
              alt="VibeRunner desktop app product mockup"
              fill
              priority
              sizes="50vw"
              className="object-contain object-center"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#f5f1e8] text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Validation thesis
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              The question is not whether cloud tools exist.
            </h2>
          </div>
          <div className="text-base leading-7 text-slate-700">
            <p>
              The bet is that a meaningful slice of AI builders wants the files
              on their own computer, wants a real local preview, and wants
              setup errors translated before they give up.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Download clicks" value="5%+" />
              <Metric label="Email capture" value="10%+" />
              <Metric label="Price anchor" value="$19" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111315] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              MVP boundary
            </p>
            <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              Start narrow: local previews for AI-generated frontend apps.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-md border border-white/10 bg-white/[0.04] p-5"
              >
                <feature.icon className="h-5 w-5 text-emerald-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#dae6df] px-5 py-16 text-slate-950 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              Search-driven validation
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Built for people already stuck.
            </h2>
          </div>
          <div className="grid gap-3">
            {examples.map((example) => (
              <div
                key={example}
                className="flex items-start gap-3 rounded-md border border-slate-950/10 bg-white/70 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm leading-6 text-slate-700">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111315] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 rounded-md border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Gauge className="h-4 w-4" />
              Demand test before desktop build
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal sm:text-3xl">
              If this gets clicks, build the Windows MVP next.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The current page measures interest without cold outreach. The
              desktop product should only start after download clicks and beta
              signups show enough pull.
            </p>
          </div>
          <div className="shrink-0">
            <Code2 className="h-12 w-12 text-amber-200" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-950/10 bg-white p-4">
      <div className="text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}
