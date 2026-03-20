"use client";

import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

interface WallpaperDownloadClientProps {
  imageData: string;
  isEnglish: boolean;
}

export function WallpaperDownloadClient({ imageData, isEnglish }: WallpaperDownloadClientProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lockscreen-wallpaper-${Date.now()}.png`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      // Show success state
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      alert(isEnglish ? 'Download failed. Please try again.' : '下载失败，请重试。');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 下载按钮 */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 ${
          downloaded
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        } ${downloading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {downloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isEnglish ? 'Downloading...' : '下载中...'}
          </>
        ) : downloaded ? (
          <>
            <Check className="w-5 h-5" />
            {isEnglish ? 'Downloaded!' : '已下载！'}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {isEnglish ? 'Download Wallpaper' : '下载壁纸'}
          </>
        )}
      </button>

      {/* 长按提示（移动端） */}
      <p className="text-xs text-gray-400 text-center">
        {isEnglish
          ? '💡 Or long press the image above to save'
          : '💡 或长按上方图片保存'}
      </p>
    </div>
  );
}
