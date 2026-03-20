"use client";

import { useState, useEffect } from "react";
import { trpc } from "~/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@saasfly/ui/dialog";
import { Send, Loader2, Bolt } from "lucide-react";
import { useToast } from "@saasfly/ui/use-toast";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function InterviewModal({
  section,
  onClose,
}: {
  section: any;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: startInterview } = trpc.resume.startInterview.useMutation({
    onSuccess: (data) => {
      const interviewData = data.interviewData as any;
      if (interviewData?.currentQuestion) {
        setMessages([{ role: "ai", content: interviewData.currentQuestion }]);
      } else {
        setMessages([{ role: "ai", content: "感谢你分享这段经历！" }]);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "启动访谈失败",
        description: error.message,
      });
    },
  });

  const { mutate: answerInterview } = trpc.resume.answerInterview.useMutation({
    onSuccess: (data) => {
      const interviewData = data.interviewData as any;
      setMessages((prev) => [...prev, { role: "user", content: input }]);

      if (interviewData?.currentQuestion) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: interviewData.currentQuestion },
        ]);
      } else if (interviewData?.completed) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "访谈完成！你的回答已保存。" },
        ]);
      }

      setInput("");
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "回答失败",
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (section) {
      startInterview({
        type: section.company ? "workExp" : "project",
        id: section.id,
        description: section.description || "",
      });
    }
  }, [section]);

  const handleSend = () => {
    if (!input.trim()) return;
    setIsLoading(true);

    answerInterview({
      type: section.company ? "workExp" : "project",
      id: section.id,
      answer: input,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bolt className="w-5 h-5 text-brand-green" />
            AI 深度访谈
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[500px] space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4 bg-slate-900/50 rounded-xl p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-brand-green text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl p-4">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-green" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleSend())
              }
              placeholder="回答 AI 的问题... (Shift+Enter 换行)"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-brand-green hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              发送
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            💡 AI 会根据 STAR 法则追问具体数据、手段、结果等信息
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
