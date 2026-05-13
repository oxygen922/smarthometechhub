/**
 * Next.js Configuration - Standard Configuration
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化配置
  images: {
    remotePatterns: [
      // Cloudflare R2
      {
        protocol: 'https',
        hostname: 'pub-a6a4ae7f5151464cb2be257af37faafe.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'ceec996a81ee29acc1eb188b0a2017e4.r2.cloudflarestorage.com',
      },
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // AWS S3
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 压缩和优化
  compress: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,

  // 构建时忽略检查（开发时方便，生产环境建议修复）
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
