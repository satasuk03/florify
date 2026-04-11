# Florify

**A chill tree-planting game you can play right in your browser — or install as an app on your phone.**

Play free at https://florify.zeze.app/

---

## How to Play

A simple 3-step loop:

1. **Plant** — Get a random tree (405 species to collect)
2. **Water** — Spend water drops to grow it through 3 stages (seedling → young → mature)
3. **Harvest** — Add it to your collection and plant the next one

Every tree is rendered in **3D** — spin it around, zoom in, and no two trees are ever the same.

---

## Game Systems

### Water Drops
- Max capacity: 50 drops
- Auto-regenerates 1 drop every 2 minutes
- Each tap costs 1 drop
- Each tree needs 12–25 drops to fully grow

### Rarity Tiers
| Tier | Drop Rate | Species Count |
|------|-----------|---------------|
| **Common** | 90% | 265 |
| **Rare** | 7% | 107 |
| **Legendary** | 3% | 33 |

### Collections
- **Original** — The main species pool
- **Chinese Garden** — Special collection
- **Abyssal Garden** — Special collection
- More collections coming in the future

---

## Features

### Floripedia — Species Encyclopedia
Browse and search all species. Each one has its own **poetic lore** written in both Thai and English. Filter by rarity, collection, or unlock status.

### Daily Missions
5 missions per day — water X times, harvest a Rare tree, reach Combo 15, and more. Complete them to earn **Sprouts** as rewards.

### Achievements
Unlock milestones like collecting 150 species, harvesting 1,000 times, or maintaining a 30-day Streak — each one rewards Sprouts.

### Streak — Daily Check-in
Log in every day to keep your Streak alive and earn bonus water drops.

### Combo — Consecutive Harvests
Harvest trees back-to-back to build your Combo counter and earn bonus rewards.

### Shop — Booster Packs
Spend Sprouts on 3 tiers of Booster Packs for better odds at Rare and Legendary species.

### Pity System
Duplicate harvests earn **Dried Leaves** — hit the threshold and you're guaranteed a new species. No more bad luck streaks.

### Flora Level — Merge Duplicates
Every duplicate harvest also stacks as a **Pending Merge** on that species. Tap **Merge** in the detail view to level it up through **Lv 1 → Lv 5**. The curve is `1 · 1 · 2 · 2` — a total of **6 duplicates** to max.

Rewards at Lv 5:
- **Shiny shimmer** across the species art (silver for Common, gold for Rare, purple for Legendary) — clipped to the plant silhouette
- **Metallic frame** around the Gallery tile in matching rarity tones
- **Legendary only:** unlocks a unique **epithet** you can display as your passport title (rainbow gradient font)

Max Reveal moment: a juicy pop-in modal with staggered text reveals, plus a pulsing glow ring behind the species art.

### Idle Factory — Auto Rewards
An idle reward machine that fills up over **24 hours** even while the game is closed. Tap **Claim** once to grab both **Sprouts** 🌱 and **Water Drops** 💧 in a single press. Two independent upgrade tracks (Sprout & Water) — level each one up to **Lv 11** to boost yield per cycle.

### Florist Card — Your Gardener Passport
A personal card showing your rank, species count, Streak, and harvest total — **export it as an image and share on social media.** Customize your title pill with either an achievement name or a Legendary epithet (animated rainbow font), and pin any collected species as your profile avatar.

---

## Ranks

| Rank | Species Collected |
|------|-------------------|
| Seedling | 0 – 19 |
| Apprentice | 20 – 74 |
| Gardener | 75 – 149 |
| Master | 150 – 249 |
| Legend | 250+ |

---

## Bilingual

Switch between Thai and English anytime — both the UI and all species lore are fully translated.

---

## Play Anywhere

- Play in your **browser** instantly — no sign-up required
- **Install as an app (PWA)** on mobile — fullscreen, feels like a native app
- Designed **mobile-first**, but works on desktop too
- **100% free** — no ads, no in-app purchases

---

## For Developers

```
florify/
├── apps/
│   ├── web/          # The main game (Next.js)
│   └── scripts/      # Flora image generation tools
├── packages/
│   └── shared/       # Shared types & constants
└── designs/          # Design docs
```

```bash
pnpm install
pnpm dev              # Start the game at http://localhost:3000
pnpm build            # Build all workspaces
pnpm typecheck        # Type-check all workspaces
pnpm lint             # Lint all workspaces
pnpm test             # Run tests
```

Requires Node.js 20+ and pnpm 9+.
