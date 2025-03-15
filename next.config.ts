import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 警告があってもビルドを続行する
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
