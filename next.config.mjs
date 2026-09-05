/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
    ],
  },
  // 实战关键：在 Monorepo 中强制转译包，解决 React 冲突
  transpilePackages: ["@clerk/nextjs", "lucide-react", "framer-motion"],
  // SEO：承接旧版站点（www 子域名旧项目）上已获曝光、但本仓库不存在的场景页 slug，
  // 永久重定向到现行对应页面，避免 www→apex 域名合并后这批 URL 变 404 丢失权重。
  // 数据来源：GSC 2026-09-04 导出（过去 3 个月有展示的 www 独有 slug）。
  async redirects() {
    const legacyScenarioMap = [
      // study 簇合并：wallpaper 变体 → plan 页（GSC: study-lock-screen-wallpaper 196 展示）
      ["study-lock-screen-wallpaper", "study-plan-lock-screen"],
      // exam 簇收敛：wallpaper 变体 → 主 slug（GSC: exam-countdown-wallpaper 35 展示 4 点击）
      ["exam-countdown-wallpaper", "exam-countdown-lock-screen"],
      // 其余旧站独有 slug → 最接近的现行场景页
      ["metformin-after-dinner-reminder", "medication-reminder-lock-screen"],
      ["ai-one-thing-lock-screen", "daily-priority-lock-screen"],
      ["daily-todo-wallpaper", "daily-priority-lock-screen"],
      ["passport-before-flight-lock-screen", "daily-priority-lock-screen"],
      ["n8n-urgent-alerts-lockscreen", "daily-priority-lock-screen"],
    ];
    return legacyScenarioMap.flatMap(([from, to]) => [
      {
        source: `/use-cases/${from}`,
        destination: `/use-cases/${to}`,
        permanent: true,
      },
      {
        source: `/en/${from}`,
        destination: `/en/${to}`,
        permanent: true,
      },
      {
        source: `/zh/${from}`,
        destination: `/zh/${to}`,
        permanent: true,
      },
    ]);
  },
  webpack: (config) => {
    // 解决多 React 版本冲突的终极配置
    config.resolve.alias = {
      ...config.resolve.alias,
      react: 'react',
      'react-dom': 'react-dom',
    };
    return config;
  },
};

export default nextConfig;
