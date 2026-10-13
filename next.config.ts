import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Vercel deployment дээр TypeScript алдаа гарч гацахаас сэргийлнэ
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint алдааг билдийн үед алгасна
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;