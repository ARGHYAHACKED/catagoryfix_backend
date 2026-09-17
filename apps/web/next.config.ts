import { loadEnvConfig } from '@next/env';
import path from 'node:path';
import type { NextConfig } from 'next';

loadEnvConfig(path.resolve(__dirname, '../..'));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
