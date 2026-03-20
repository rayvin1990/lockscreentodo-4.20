"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@saasfly/ui/dialog";

interface Annotation {
  before: string;
  after: string;
  reason: string;
  type: "improvement" | "correction" | "suggestion";
}

export function AnnotationPanel({
  annotations,
  onClose,
}: {
  annotations: Annotation[];
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✨ AI 优化批注
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {annotations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>暂无 AI 批注</p>
            </div>
          ) : (
            annotations.map((annotation, idx) => (
              <div
                key={idx}
                className="border border-slate-700 bg-slate-900/50 rounded-xl p-6 space-y-4"
              >
                <div className="flex gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-500 mb-2">
                      原文
                    </p>
                    <p className="text-sm bg-red-950/30 p-3 rounded-lg text-slate-200">
                      {annotation.before}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-green mb-2">
                      优化后
                    </p>
                    <p className="text-sm bg-brand-green/10 p-3 rounded-lg text-slate-200">
                      {annotation.after}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-2xl shrink-0">💡</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-2">优化原因</p>
                    <p className="text-sm text-slate-400">
                      {annotation.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
