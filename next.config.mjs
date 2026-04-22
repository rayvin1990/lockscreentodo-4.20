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
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/generator',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/en/generator',
      },
    ];
  },
};

export default nextConfig;
