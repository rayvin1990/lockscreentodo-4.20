"use client";

import React from 'react';

interface ManualStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'ios' | 'android';
}

export function ManualStepsModal({ isOpen, onClose, platform }: ManualStepsModalProps) {
  if (!isOpen) return null;

  const iosSteps = [
    { step: 1, text: 'Save the wallpaper image to your Photos' },
    { step: 2, text: 'Open Photos and tap the wallpaper' },
    { step: 3, text: 'Tap Share button (square with arrow)' },
    { step: 4, text: 'Scroll down and tap "Use as Wallpaper"' },
    { step: 5, text: 'Tap "Set" then choose "Set Lock Screen"' },
  ];

  const androidSteps = [
    { step: 1, text: 'Download the wallpaper to your device' },
    { step: 2, text: 'Open Gallery or Photos app' },
    { step: 3, text: 'Find and tap the downloaded wallpaper' },
    { step: 4, text: 'Tap the three-dot menu or "More"' },
    { step: 5, text: 'Select "Set as wallpaper" then "Lock screen"' },
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;
  const title = platform === 'ios' ? 'iPhone Manual Setup' : 'Android Manual Setup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{item.step}</span>
              </div>
              <p className="text-slate-300 text-sm flex-1">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-xs text-slate-400">
            ⚠️ <strong>Note:</strong> Time/Date shown in preview is not included in the downloaded wallpaper.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
