"use client";

import React, { useState, useEffect } from 'react';
import { QrBlock } from './qr-block';
import { ManualStepsModal } from './manual-steps-modal';

interface QuickSetPanelProps {
  enabled: boolean;
  wallpaperUrl: string | null;
  width: number;
  height: number;
}

export function QuickSetPanel({ enabled, wallpaperUrl, width, height }: QuickSetPanelProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [showManualSteps, setShowManualSteps] = useState(false);
  const [manualStepsPlatform, setManualStepsPlatform] = useState<'ios' | 'android'>('ios');

  // Detect platform from user agent
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/Android/.test(userAgent)) {
      setPlatform('android');
    }
  }, []);

  // Build URLs
  const iosShortcurUrl = wallpaperUrl
    ? `${process.env.NEXT_PUBLIC_IOS_SHORTCUT_URL || 'https://www.icloud.com/shortcuts'}?wallpaper=${encodeURIComponent(wallpaperUrl)}`
    : '';

  const androidDeepLinkUrl = wallpaperUrl
    ? `${process.env.NEXT_PUBLIC_ANDROID_HELPER_DEEPLINK_URL || 'lockscreen://set'}?wallpaper=${encodeURIComponent(wallpaperUrl)}`
    : '';

  const handleOpenShortcut = () => {
    if (!enabled || !wallpaperUrl) return;
    window.open(iosShortcurUrl, '_blank');
  };

  const handleOpenAndroidHelper = () => {
    if (!enabled || !wallpaperUrl) return;
    window.open(androidDeepLinkUrl, '_blank');
  };

  const handleShowManualSteps = (plt: 'ios' | 'android') => {
    setManualStepsPlatform(plt);
    setShowManualSteps(true);
  };

  return (
    <>
      <div className={`
        rounded-xl border p-4 transition-all duration-300
        ${enabled ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-800/30 border-slate-700 opacity-50'}
      `}>
        {/* Header */}
        <div className="mb-3 pb-2 border-b border-slate-600/50">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            ⚡ Quick Set <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Beta</span>
          </h3>
          {!enabled && (
            <p className="text-xs text-slate-400 mt-1">Generate wallpaper first to enable</p>
          )}
        </div>

        {/* Export Size */}
        {enabled && (
          <div className="mb-3 pb-3 border-b border-slate-600/30">
            <p className="text-xs text-slate-400">
              Export size: <span className="text-white font-semibold">{width}×{height}</span>
            </p>
          </div>
        )}

        {/* iOS Card */}
        <div className="mb-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h4 className="text-xs font-semibold text-blue-400 mb-2">iPhone</h4>

          <div className="flex gap-3 mb-2">
            <QrBlock
              label="Scan to set"
              url={iosShortcurUrl}
              disabled={!enabled}
              size={96}
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-300 mb-1">Scan to set Lock Screen (via Shortcut)</p>
                {platform === 'ios' && enabled && (
                  <p className="text-[10px] text-green-400">✓ Detected: iOS device</p>
                )}
              </div>
              <button
                onClick={handleOpenShortcut}
                disabled={!enabled}
                className={`
                  w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all
                  ${enabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                Open Shortcut
              </button>
            </div>
          </div>

          <button
            onClick={() => handleShowManualSteps('ios')}
            className="text-[10px] text-slate-400 hover:text-slate-300 underline mt-1"
          >
            View manual steps
          </button>
        </div>

        {/* Android Card */}
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h4 className="text-xs font-semibold text-green-400 mb-2">Android (Coming Soon)</h4>

          <div className="flex gap-3 mb-2">
            <QrBlock
              label="Scan to open"
              url={androidDeepLinkUrl}
              disabled={!enabled}
              size={96}
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-300 mb-1">One-tap via Helper (Beta)</p>
                {platform === 'android' && enabled && (
                  <p className="text-[10px] text-green-400">✓ Detected: Android device</p>
                )}
              </div>
              <button
                onClick={handleOpenAndroidHelper}
                disabled={!enabled}
                className={`
                  w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all
                  ${enabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                Open Helper
              </button>
            </div>
          </div>

          <button
            onClick={() => handleShowManualSteps('android')}
            className="text-[10px] text-slate-400 hover:text-slate-300 underline mt-1"
          >
            View manual steps
          </button>
        </div>

        {/* Important Notice */}
        {enabled && (
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <p className="text-[10px] text-yellow-400/90 leading-tight">
              ⚠️ <strong>Time/Date shown in preview only; downloaded wallpaper does NOT include time/date.</strong>
            </p>
          </div>
        )}
      </div>

      {/* Manual Steps Modal */}
      <ManualStepsModal
        isOpen={showManualSteps}
        onClose={() => setShowManualSteps(false)}
        platform={manualStepsPlatform}
      />
    </>
  );
}
