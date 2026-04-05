# Florify

Mobile-first 3D web game: plant, water, and collect procedurally-generated trees.

## Structure

This is a pnpm monorepo.

```
florify/
├── apps/
│   └── web/          # Next.js 16 game (the Florify client)
├── packages/
│   └── shared/       # Shared TS types + constants (reused by future backend)
└── designs/          # Design docs (steps 00–10)
```

A future `apps/api` (Cloudflare Workers + D1) will be added for cloud sync — see `designs/10-cloud-sync.md`.

## Getting started

Requires Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm dev          # starts apps/web on http://localhost:3000
```

Other scripts:

```bash
pnpm build        # build every workspace
pnpm typecheck    # type-check every workspace
pnpm test         # run tests in every workspace
```

## Docs

Implementation is staged across `designs/01-project-setup.md` → `designs/10-cloud-sync.md`. Start with `designs/00-overview.md`.
