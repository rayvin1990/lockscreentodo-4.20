// Mock @saasfly/ui components for development preview
import { useState } from "react";

export const useToast = () => {
  return {
    toast: (options: any) => {
      console.log("Mock toast:", options);
    },
  };
};

export const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }: any) => (
  <div className={`p-6 ${className || ""}`}>{children}</div>
);

export const DialogHeader = ({ children }: any) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children, className }: any) => (
  <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>
);

// Mock lucide-react icons
export const Upload = () => <span>📤</span>;
export const FileText = () => <span>📄</span>;
export const Bolt = () => <span>⚡</span>;
export const Trash2 = () => <span>🗑️</span>;
export const Plus = () => <span>➕</span>;
export const Download = () => <span>⬇️</span>;
export const Eye = () => <span>👁️</span>;
export const Send = () => <span>📤</span>;
export const Loader2 = () => <span>⏳</span>;
export const CheckCircle2 = () => <span>✅</span>;
export const XCircle = () => <span>❌</span>;