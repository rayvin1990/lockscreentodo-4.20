"use client";

import React, { useState, useEffect } from 'react';

interface QuickSetupGuideProps {
  showAfterDownload: boolean;
  imageUrl?: string;
}

export function QuickSetupGuide({ showAfterDownload, imageUrl }: QuickSetupGuideProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // 检测设备类型
    const userAgent = navigator.userAgent || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    if (/iPhone|iPad|iPod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/Android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  // 调试日志
  console.log('🎨 QuickSetupGuide 渲染:', { showAfterDownload, imageUrl, platform });

  if (!showAfterDownload) return null;

  // 构建 iOS Shortcuts URL
  const iosShortcutUrl = imageUrl
    ? `${process.env.NEXT_PUBLIC_IOS_SHORTCUT_URL || 'https://www.icloud.com/shortcuts'}?wallpaper=${encodeURIComponent(imageUrl)}`
    : '';

  // 检查是否为 localhost（开发环境）
  const isLocalhost = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');

  // 构建直接图片 URL（用于 Android）- 始终生成二维码
  const qrApiUrl = imageUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(imageUrl)}`
    : '';

  console.log('📱 生成的 URLs:', { iosShortcutUrl, qrApiUrl, isLocalhost });

  const iosSteps = [
    { step: 1, icon: '📱', text: 'Scan QR Code', detail: 'Use iPhone camera to scan' },
    { step: 2, icon: '⚡', text: 'Open Shortcut', detail: 'Tap "Open Shortcut"' },
    { step: 3, icon: '✅', text: 'Confirm Setup', detail: 'Shortcut will auto-complete setup' },
  ];

  const androidSteps = [
    { step: 1, icon: '📱', text: 'Scan QR Code', detail: 'Use camera or WeChat to scan' },
    { step: 2, icon: '⬇️', text: 'Long Press Image', detail: 'Select "Save Image"' },
    { step: 3, icon: '⚙️', text: 'Set as Wallpaper', detail: 'Gallery → Menu → Set as Wallpaper → Lock Screen' },
  ];

  const desktopSteps = [
    { step: 1, icon: '📱', text: 'Scan QR Code with Phone', detail: 'Use phone camera to scan the QR code' },
    { step: 2, icon: '⬇️', text: 'Download Wallpaper', detail: 'Long press to save to gallery' },
    { step: 3, icon: '⚙️', text: 'Set Lock Screen', detail: 'Gallery → Set as Wallpaper → Lock Screen' },
  ];

  let steps: typeof iosSteps;
  let platformName: string;

  if (platform === 'ios') {
    steps = iosSteps;
    platformName = 'iPhone';
  } else if (platform === 'android') {
    steps = androidSteps;
    platformName = 'Android';
  } else {
    steps = desktopSteps;
    platformName = 'Phone';
  }

  return (
    <div className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-4">
      {/* Title bar */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          ⚡ {platformName} Quick Setup
        </h3>
      </div>

      {/* 二维码区域（所有设备都显示） */}
      {imageUrl && qrApiUrl && (
        <div className="mb-3 p-3 bg-white rounded-lg">
          <div className="flex flex-col items-center gap-2">
            {/* 二维码 */}
            <img src={qrApiUrl} alt="QR Code" width={150} height={150} className="rounded" />

            {/* Description */}
            {isLocalhost ? (
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">
                  {platform === 'ios' ? 'Scan with camera or tap button below' : 'Scan with phone, long press to save'}
                </p>
                <p className="text-[10px] text-amber-600 leading-tight">
                  ⚠️ Dev Environment: Ensure phone and computer are on same network
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 text-center">
                {platform === 'ios' ? 'Scan with camera or tap button below' : 'Scan with phone, long press to save'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* iOS Shortcut Button */}
      {platform === 'ios' && imageUrl && iosShortcutUrl && (
        <a
          href={iosShortcutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all text-center mb-3"
        >
          ⚡ Open Shortcut for Quick Setup
        </a>
      )}

      {/* 详细步骤 - 默认全部显示 */}
      <div className="space-y-3">
        {steps.map((item) => (
          <div key={item.step} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {item.step}
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
              <div className="text-slate-400 text-xs mt-0.5">{item.detail}</div>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-slate-600/50 space-y-1">
          <p className="text-[10px] text-yellow-400/90">
            ⚠️ Preview time/date won't be included in downloaded wallpaper
          </p>
          {platform === 'ios' && (
            <p className="text-[10px] text-blue-400/90">
              💡 First-time setup required for shortcut, configure once only
            </p>
          )}
          {isLocalhost && (
            <p className="text-[10px] text-amber-400/90">
              💻 Dev Environment: Ensure phone and computer are on same Wi-Fi network
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
