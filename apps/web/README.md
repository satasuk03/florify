This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Troubleshooting: PWA frozen / unresponsive on mobile

The PWA may freeze after a new deploy because the Service Worker serves stale JS from cache that doesn't match the new build.

### Fix: Bump SW cache version

1. Open `public/sw.js`
2. Increment the version number on all 3 cache names, e.g. `v2` → `v3`:
   ```js
   const CACHE_NAME = "florify-v3";
   const STATIC_CACHE = "florify-static-v3";
   const FLORA_CACHE = "florify-flora-v3";
   ```
3. Commit & deploy — the new SW's activate handler will delete all old caches
4. Force quit and reopen the PWA — it will fetch everything fresh

**Player save data is safe.** localStorage is separate from the cache and is not affected.

### Why this happens

- iOS PWA runs in a standalone WKWebView that is slower to update the Service Worker than a regular browser
- Static assets (`/_next/static/`) use a cache-first strategy — if old hashed files are still in cache, they get served instead of the new ones
- Bumping the cache name forces the activate handler to purge all old caches, so every request goes to the network
