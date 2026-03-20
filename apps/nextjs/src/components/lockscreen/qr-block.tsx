"use client";

import React from 'react';

interface QrBlockProps {
  label: string;
  url: string;
  disabled?: boolean;
  size?: number;
}

export function QrBlock({ label, url, disabled = false, size = 128 }: QrBlockProps) {
  // 使用免费二维码生成 API
  const qrApiUrl = disabled
    ? ''
    : `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        bg-white p-2 rounded-lg shadow-inner
        ${disabled ? 'opacity-40 grayscale' : 'opacity-100'}
      `}>
        {disabled ? (
          <div style={{ width: size, height: size }} className="flex items-center justify-center bg-gray-200 rounded">
            <span className="text-gray-400 text-xs text-center">Generate<br/>wallpaper<br/>first</span>
          </div>
        ) : (
          <img
            src={qrApiUrl}
            alt="QR Code"
            width={size}
            height={size}
            className="rounded"
            style={{ display: 'block' }}
          />
        )}
      </div>
      <span className="text-xs text-slate-400 text-center">{label}</span>
    </div>
  );
}
