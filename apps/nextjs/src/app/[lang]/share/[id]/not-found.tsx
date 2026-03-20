import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

interface NotFoundProps {
  params: {
    lang: string;
  };
}

export default function NotFound({ params }: NotFoundProps) {
  const { lang } = params;
  const isEnglish = lang === 'en';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 错误图标 */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-white mb-4">
          {isEnglish ? 'Link Not Found' : '链接不存在'}
        </h1>

        {/* 说明 */}
        <p className="text-gray-300 mb-6">
          {isEnglish
            ? 'This wallpaper link has expired or does not exist. Wallpaper links are valid for 1 hour.'
            : '壁纸链接已过期或不存在。壁纸链接有效期为 1 小时。'}
        </p>

        {/* 返回按钮 */}
        <Link
          href={`/${lang}/lockscreen-generator`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Home className="w-4 h-4" />
          {isEnglish ? 'Create New Wallpaper' : '创建新壁纸'}
        </Link>
      </div>
    </div>
  );
}
