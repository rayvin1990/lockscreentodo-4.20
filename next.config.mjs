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
