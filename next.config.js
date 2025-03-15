/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 警告があってもビルドを続行する
    ignoreDuringBuilds: true
  },
  typescript: {
    // 型チェックエラーがあってもビルドを続行する
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;