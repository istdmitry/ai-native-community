/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Enable for Docker builds (requires symlink perms on Windows)
  transpilePackages: [
    '@community/engine',
    '@community/content',
    '@community/ui',
    '@community/database',
    '@community/theme',
  ],
  env: {
    NEXT_PUBLIC_COMMIT_SHA: process.env.COMMIT_SHA || 'dev',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
