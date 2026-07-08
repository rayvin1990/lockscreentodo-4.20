"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Mail } from "lucide-react";

import { trackEvent } from "~/lib/analytics";

type Locale = "en" | "zh";

type Copy = {
  title: string;
  subtitle: string;
  productName: string;
  productUrl: string;
  category: string;
  email: string;
  notes: string;
  submit: string;
  gmail: string;
  copy: string;
  copied: string;
  helper: string;
  placeholders: {
    productName: string;
    productUrl: string;
    category: string;
    email: string;
    notes: string;
  };
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Send me your product URL",
    subtitle: "I will check where your product is visible, missing, or accidentally replaced by someone else.",
    productName: "Product name",
    productUrl: "Product URL",
    category: "Category or buyer",
    email: "Your email",
    notes: "Anything I should know?",
    submit: "Open email draft",
    gmail: "Open Gmail draft",
    copy: "Copy request",
    copied: "Copied",
    helper: "Pure frontend MVP: this opens an email or Gmail draft. The sender still needs to press Send. No account, no database, no tracking dashboard yet.",
    placeholders: {
      productName: "Example: Lockscreen Todo",
      productUrl: "https://yourproduct.com",
      category: "Micro-SaaS for founders, AI tool for marketers...",
      email: "you@example.com",
      notes: "Just launched, Product Hunt page missing, AI tools do not mention us...",
    },
  },
  zh: {
    title: "把你的产品链接发给我",
    subtitle: "我会帮你看它在哪里被看见、哪里缺席、哪里可能被别人占位。",
    productName: "产品名称",
    productUrl: "产品链接",
    category: "品类或目标用户",
    email: "你的邮箱",
    notes: "还有什么要补充？",
    submit: "打开邮件草稿",
    gmail: "打开 Gmail 草稿",
    copy: "复制请求内容",
    copied: "已复制",
    helper: "纯前端 MVP：点击后会打开邮箱或 Gmail 草稿，发送人仍然需要自己点发送。暂时没有账号、数据库和后台面板。",
    placeholders: {
      productName: "例如：Lockscreen Todo",
      productUrl: "https://yourproduct.com",
      category: "给 founder 的 micro-SaaS、给营销人的 AI 工具...",
      email: "you@example.com",
      notes: "刚发布、Product Hunt 页面缺失、AI 推荐不提到我们...",
    },
  },
};

export function LaunchVisibilityRequestForm({
  lang,
  supportEmail,
}: {
  lang: Locale;
  supportEmail: string;
}) {
  const t = copy[lang];
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const requestText = useMemo(() => {
    return [
      "Launch visibility check request",
      "",
      `Product name: ${productName || "(not provided)"}`,
      `Product URL: ${productUrl || "(not provided)"}`,
      `Category / buyer: ${category || "(not provided)"}`,
      `Contact email: ${email || "(not provided)"}`,
      "",
      "Notes:",
      notes || "(not provided)",
      "",
      "Please check:",
      "- Google brand search",
      "- intent keywords",
      "- launch pages and directories",
      "- Reddit / community demand",
      "- AI recommendation visibility",
      "- obvious missing visibility surfaces",
    ].join("\n");
  }, [category, email, notes, productName, productUrl]);

  const mailtoHref = useMemo(() => {
    const subject = `Launch visibility check: ${productName || productUrl || "new product"}`;
    return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestText)}`;
  }, [productName, productUrl, requestText, supportEmail]);

  const gmailHref = useMemo(() => {
    const subject = `Launch visibility check: ${productName || productUrl || "new product"}`;
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: supportEmail,
      su: subject,
      body: requestText,
    });

    return `https://mail.google.com/mail/?${params.toString()}`;
  }, [productName, productUrl, requestText, supportEmail]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("launch_visibility_mailto_submit", {
      lang,
      hasProductName: Boolean(productName),
      hasCategory: Boolean(category),
    });
    window.location.href = mailtoHref;
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopied(true);
      trackEvent("launch_visibility_copy_request", { lang });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{t.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.subtitle}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t.productName}</span>
          <input
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder={t.placeholders.productName}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t.productUrl}</span>
          <input
            required
            type="url"
            value={productUrl}
            onChange={(event) => setProductUrl(event.target.value)}
            placeholder={t.placeholders.productUrl}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.category}</span>
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder={t.placeholders.category}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.email}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.placeholders.email}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t.notes}</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t.placeholders.notes}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {t.submit}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <a
          href={gmailHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("launch_visibility_gmail_click", { lang })}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {t.gmail}
        </a>
        <button
          type="button"
          onClick={copyRequest}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? t.copied : t.copy}
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">{t.helper}</p>
    </form>
  );
}
