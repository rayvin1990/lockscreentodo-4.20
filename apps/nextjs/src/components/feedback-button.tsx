"use client";

import { MessageCircle } from "lucide-react";

export function FeedbackButton() {
  const email = "Rayvin19901110@gmail.com";
  const subject = "Feedback for Lockscreen Todo";
  const body = "Hi,\n\nI would like to share my feedback:\n\n";

  // 使用 Gmail 的 web URL 直接打开撰写邮件页面
  const feedbackUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={feedbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Feedback"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-green to-brand-blue rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
        <div className="relative flex items-center gap-2 bg-brand-green hover:bg-emerald-500 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-brand-green/50">
          <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
          <span className="font-semibold text-base hidden sm:inline">Feedback</span>
        </div>
      </div>
    </a>
  );
}
