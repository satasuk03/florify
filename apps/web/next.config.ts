import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Static export → Cloudflare Pages friendly (no SSR; 3D canvas renders client-side only)
  output: 'export',

  // pnpm monorepo: tell Turbopack where the workspace root is so it can resolve `next`
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  },

  // Required when output: 'export' — no server-side image optimizer
  images: { unoptimized: true },

  // Cloudflare Pages serves /foo/ → /foo/index.html cleanly with trailing slash
  trailingSlash: true,

  reactStrictMode: true,

  // Transpile our workspace package and three.js (some examples live in ESM subpaths)
  transpilePackages: ['three', '@florify/shared'],
};

export default nextConfig;
