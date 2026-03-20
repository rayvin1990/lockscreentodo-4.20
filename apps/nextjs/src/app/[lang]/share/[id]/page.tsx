import { notFound } from 'next/navigation';
import { Download, Smartphone, Image as ImageIcon } from 'lucide-react';
import { WallpaperDownloadClient } from './client';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    lang: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  const isEnglish = lang === 'en';

  return {
    title: isEnglish ? 'Your Wallpaper is Ready!' : '你的壁纸已生成！',
    description: isEnglish
      ? 'Download your personalized lockscreen wallpaper'
      : '下载你的个性化锁屏壁纸',
    openGraph: {
      title: isEnglish ? 'Your Wallpaper is Ready!' : '你的壁纸已生成！',
      description: isEnglish
        ? 'Download your personalized lockscreen wallpaper'
        : '下载你的个性化锁屏壁纸',
    },
  };
}

// 获取壁纸数据
async function getWallpaperData(shareId: string) {
  if (!shareId) {
    return null;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3001';

    const response = await fetch(`${baseUrl}/api/share/${shareId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch wallpaper:', response.status);
      return null;
    }

    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    return {
      imageData: `data:image/png;base64,${base64}`,
      contentType: response.headers.get('Content-Type'),
    };
  } catch (error) {
    console.error('Error fetching wallpaper:', error);
    return null;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default async function SharePage({ params }: PageProps) {
  const { lang, id: shareId } = params;
  const isEnglish = lang === 'en';

  const wallpaperData = await getWallpaperData(shareId);

  if (!wallpaperData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isEnglish ? '🎨 Your Wallpaper is Ready!' : '🎨 你的壁纸已生成！'}
          </h1>
          <p className="text-gray-300">
            {isEnglish
              ? 'Save it to your photo album and set as lockscreen'
              : '保存到相册并设置为锁屏壁纸'}
          </p>
        </div>

        {/* 壁纸预览卡片 */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex justify-center mb-6">
            <div className="relative max-w-sm w-full">
              {/* 手机框架 */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-slate-900 rounded-[2rem] overflow-hidden">
                  <img
                    src={wallpaperData.imageData}
                    alt="Generated Wallpaper"
                    className="w-full h-auto"
                    style={{ aspectRatio: '9/19.5' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 下载按钮 */}
          <WallpaperDownloadClient imageData={wallpaperData.imageData} isEnglish={isEnglish} />
        </div>

        {/* 设置教程 */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            {isEnglish ? '📱 How to Set as Lockscreen' : '📱 如何设置为锁屏'}
          </h2>

          {/* iOS 教程 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">iOS (iPhone/iPad)</h3>
            <ol className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                <span>
                  {isEnglish
                    ? 'Tap the download button above to save the wallpaper'
                    : '点击上方下载按钮保存壁纸'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                <span>
                  {isEnglish
                    ? 'Open Photos app and find the saved wallpaper'
                    : '打开照片应用，找到保存的壁纸'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                <span>
                  {isEnglish
                    ? 'Tap the Share button and select "Use as Wallpaper"'
                    : '点击分享按钮，选择"用作壁纸"'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                <span>
                  {isEnglish
                    ? 'Adjust position and set as Lock Screen'
                    : '调整位置后，设置为锁屏'}
                </span>
              </li>
            </ol>
          </div>

          {/* Android 教程 */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">Android</h3>
            <ol className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                <span>
                  {isEnglish
                    ? 'Long press the wallpaper image above'
                    : '长按上方的壁纸图片'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                <span>
                  {isEnglish
                    ? 'Select "Download image" or "Save image"'
                    : '选择"下载图片"或"保存图片"'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                <span>
                  {isEnglish
                    ? 'Open Gallery and find the downloaded wallpaper'
                    : '打开相册，找到下载的壁纸'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                <span>
                  {isEnglish
                    ? 'Tap the menu button and select "Set as wallpaper" → "Lock screen"'
                    : '点击菜单按钮，选择"设为壁纸" → "锁屏"'}
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-yellow-400 text-sm text-center">
            💡 {isEnglish
              ? 'Tip: The wallpaper link will expire after 1 hour'
              : '提示：壁纸链接将在 1 小时后过期'}
          </p>
        </div>

        {/* 返回首页按钮 */}
        <div className="mt-6 text-center">
          <a
            href={`/${lang}/lockscreen-generator`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {isEnglish ? '← Create Another Wallpaper' : '← 再创建一个壁纸'}
          </a>
        </div>
      </div>
    </div>
  );
}
