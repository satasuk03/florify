# Achievement System Design

## Overview

A persistent achievement system for Florify that rewards players for collection milestones and gameplay activity. Achievements are single-tier, client-side only, and grant Sprouts (🌱) as rewards via manual claim.

## Data Model

### Achievement Definition (static, in code)

```ts
interface AchievementDef {
  id: string;
  name: string;                          // includes emoji, e.g. "🌾 First Harvest"
  description: { en: string; th: string };
  rewards: { type: "sprouts"; amount: number }[];  // array for future extensibility (drops, etc.)
  condition: AchievementCondition;
}
```

### Condition Types

```ts
type AchievementCondition =
  | { type: "species_unlocked"; target: number }
  | { type: "species_by_rarity"; rarity: Rarity; target: number }
  | { type: "species_by_collection"; collection: SpeciesCollection; target: number }
  | { type: "harvest_total"; target: number }
  | { type: "harvest_by_rarity"; rarity: Rarity; target: number }
  | { type: "total_watered"; target: number }
  | { type: "sprouts_gained"; target: number }
  | { type: "sprouts_spent"; target: number }
  | { type: "streak"; target: number }
  | { type: "combo"; level: 10 | 15 | 20; target: number }
  | { type: "seed_packets"; tier: "total" | "common" | "rare" | "legendary"; target: number };
```

### Player State (added to PlayerState)

```ts
achievements: {
  [achievementId: string]: {
    unlockedAt: string;     // ISO date
    claimedAt?: string;     // ISO date — undefined = unclaimed
  }
}
```

### New PlayerStats Fields

```ts
harvestByRarity: { common: number; rare: number; legendary: number }
comboCount: { combo10: number; combo15: number; combo20: number }
seedPacketsOpened: { total: number; common: number; rare: number; legendary: number }
```

## Achievement List (94 total)

### Collection — Rank Milestones (4)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| collect_rank_1 | 🌱 Seedling Steps | Unlock 20 species | 50 |
| collect_rank_2 | 📗 Apprentice Botanist | Unlock 75 species | 200 |
| collect_rank_3 | 🌳 Gardener's Pride | Unlock 150 species | 500 |
| collect_rank_4 | 👑 Master Cultivator | Unlock 250 species | 1000 |

### Collection — Common (4)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| collect_common_10 | 🌼 Common Starter | Collect 10 common species | 20 |
| collect_common_50 | 🌼 Common Collector | Collect 50 common species | 100 |
| collect_common_100 | 🌼 Common Enthusiast | Collect 100 common species | 300 |
| collect_common_200 | 🌼 Common Completionist | Collect 200 common species | 1000 |

### Collection — Rare (2)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| collect_rare_10 | 💎 Rare Finder | Collect 10 rare species | 50 |
| collect_rare_50 | 💎 Rare Connoisseur | Collect 50 rare species | 300 |

### Collection — Legendary (3)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| collect_legend_5 | ⭐ Lucky Star | Collect 5 legendary species | 100 |
| collect_legend_10 | ⭐ Stargazer | Collect 10 legendary species | 300 |
| collect_legend_20 | ⭐ Celestial Garden | Collect 20 legendary species | 1000 |

### Collection — Sets (8)

Original and Chinese Garden are closed collections (collect-all available). Abyssal Garden is open (milestones only).

| ID | Name | Target | 🌱 |
|---|---|---|---|
| set_original_10 | 🌸 Original Explorer | Collect 10 Original flora | 20 |
| set_original_50 | 🌸 Original Collector | Collect 50 Original flora | 100 |
| set_original_100 | 🌸 Original Enthusiast | Collect 100 Original flora | 300 |
| set_original_200 | 🌸 Original Devotee | Collect 200 Original flora | 1000 |
| set_original_300 | 🌸 Original Completionist | Collect all 300 Original flora | 5000 |
| set_chinese_5 | 🏮 Chinese Garden Master | Collect all 5 Chinese Garden flora | 500 |
| set_abyssal_10 | 🌑 Abyssal Explorer | Collect 10 Abyssal Garden flora | 100 |
| set_abyssal_20 | 🌑 Abyssal Diver | Collect 20 Abyssal Garden flora | 300 |

### Harvest — Total (6)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| harvest_total_10 | 🌾 First Harvest | Harvest 10 flora | 10 |
| harvest_total_50 | 🌾 Budding Farmer | Harvest 50 flora | 50 |
| harvest_total_100 | 🌾 Harvest Moon | Harvest 100 flora | 100 |
| harvest_total_200 | 🌾 Golden Harvest | Harvest 200 flora | 200 |
| harvest_total_500 | 🌾 Harvest Festival | Harvest 500 flora | 500 |
| harvest_total_1000 | 🌾 Eternal Harvest | Harvest 1,000 flora | 1000 |

### Harvest — By Rarity (18)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| harvest_common_10 | 🌼 Common Reaper 10 | Harvest 10 common | 10 |
| harvest_common_50 | 🌼 Common Reaper 50 | Harvest 50 common | 50 |
| harvest_common_100 | 🌼 Common Reaper 100 | Harvest 100 common | 100 |
| harvest_common_200 | 🌼 Common Reaper 200 | Harvest 200 common | 200 |
| harvest_common_500 | 🌼 Common Reaper 500 | Harvest 500 common | 500 |
| harvest_common_1000 | 🌼 Common Reaper 1000 | Harvest 1,000 common | 1000 |
| harvest_rare_10 | 💎 Rare Reaper 10 | Harvest 10 rare | 30 |
| harvest_rare_50 | 💎 Rare Reaper 50 | Harvest 50 rare | 150 |
| harvest_rare_100 | 💎 Rare Reaper 100 | Harvest 100 rare | 300 |
| harvest_rare_200 | 💎 Rare Reaper 200 | Harvest 200 rare | 600 |
| harvest_rare_500 | 💎 Rare Reaper 500 | Harvest 500 rare | 1500 |
| harvest_rare_1000 | 💎 Rare Reaper 1000 | Harvest 1,000 rare | 3000 |
| harvest_legend_10 | ⭐ Legend Reaper 10 | Harvest 10 legendary | 100 |
| harvest_legend_50 | ⭐ Legend Reaper 50 | Harvest 50 legendary | 500 |
| harvest_legend_100 | ⭐ Legend Reaper 100 | Harvest 100 legendary | 1000 |
| harvest_legend_200 | ⭐ Legend Reaper 200 | Harvest 200 legendary | 2000 |
| harvest_legend_500 | ⭐ Legend Reaper 500 | Harvest 500 legendary | 5000 |
| harvest_legend_1000 | ⭐ Legend Reaper 1000 | Harvest 1,000 legendary | 10000 |

### Watering (5)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| water_1000 | 💧 Drizzle | Water 1,000 times | 50 |
| water_5000 | 💧 Steady Stream | Water 5,000 times | 200 |
| water_10000 | 💧 Rainfall | Water 10,000 times | 500 |
| water_100000 | 💧 Monsoon | Water 100,000 times | 2000 |
| water_1000000 | 💧 Ocean | Water 1,000,000 times | 10000 |

### Sprout Economy (12)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| sprout_gain_500 | 🌱 Penny Sprout | Earn 500 sprouts total | 50 |
| sprout_gain_1000 | 🌱 Growing Fund | Earn 1,000 sprouts total | 100 |
| sprout_gain_5000 | 🌱 Sprouting Rich | Earn 5,000 sprouts total | 300 |
| sprout_gain_10000 | 🌱 Sprout Baron | Earn 10,000 sprouts total | 500 |
| sprout_gain_100000 | 🌱 Sprout Tycoon | Earn 100,000 sprouts total | 2000 |
| sprout_gain_1000000 | 🌱 Sprout Mogul | Earn 1,000,000 sprouts total | 5000 |
| sprout_spend_500 | 💸 Window Shopper | Spend 500 sprouts total | 50 |
| sprout_spend_1000 | 💸 Casual Buyer | Spend 1,000 sprouts total | 100 |
| sprout_spend_5000 | 💸 Big Spender | Spend 5,000 sprouts total | 300 |
| sprout_spend_10000 | 💸 Shopaholic | Spend 10,000 sprouts total | 500 |
| sprout_spend_100000 | 💸 Sprout Whale | Spend 100,000 sprouts total | 2000 |
| sprout_spend_1000000 | 💸 Sprout Overlord | Spend 1,000,000 sprouts total | 5000 |

### Streaks (5)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| streak_7 | 🔥 Week Warrior | 7-day streak | 50 |
| streak_14 | 🔥 Fortnight Flora | 14-day streak | 100 |
| streak_30 | 🔥 Monthly Devotion | 30-day streak | 300 |
| streak_90 | 🔥 Seasonal Spirit | 90-day streak | 1000 |
| streak_365 | 🔥 Eternal Flame | 365-day streak | 5000 |

### Combos (12)

Cumulative combo triggers (lifetime total). Requires new `comboCount` stat.

| ID | Name | Target | 🌱 |
|---|---|---|---|
| combo10_100 | ⚡ Combo Starter | Hit 10x combo 100 times | 50 |
| combo10_200 | ⚡ Combo Regular | Hit 10x combo 200 times | 100 |
| combo10_500 | ⚡ Combo Veteran | Hit 10x combo 500 times | 200 |
| combo10_1000 | ⚡ Combo Master | Hit 10x combo 1,000 times | 500 |
| combo15_100 | ⚡ Surge Starter | Hit 15x combo 100 times | 100 |
| combo15_200 | ⚡ Surge Regular | Hit 15x combo 200 times | 200 |
| combo15_500 | ⚡ Surge Veteran | Hit 15x combo 500 times | 500 |
| combo15_1000 | ⚡ Surge Master | Hit 15x combo 1,000 times | 1000 |
| combo20_100 | ⚡ Thunder Starter | Hit 20x combo 100 times | 200 |
| combo20_200 | ⚡ Thunder Regular | Hit 20x combo 200 times | 500 |
| combo20_500 | ⚡ Thunder Veteran | Hit 20x combo 500 times | 1000 |
| combo20_1000 | ⚡ Thunder Master | Hit 20x combo 1,000 times | 2000 |

### Seed Packets (15)

| ID | Name | Target | 🌱 |
|---|---|---|---|
| seedpacket_total_1 | 🎁 First Unboxing | Open 1 seed packet | 10 |
| seedpacket_total_10 | 🎁 Pack Opener | Open 10 seed packets | 50 |
| seedpacket_total_50 | 🎁 Pack Enthusiast | Open 50 seed packets | 200 |
| seedpacket_total_100 | 🎁 Pack Collector | Open 100 seed packets | 500 |
| seedpacket_total_500 | 🎁 Pack Addict | Open 500 seed packets | 2000 |
| seedpacket_common_1 | 🌼 Common Unboxing | Open 1 common packet | 10 |
| seedpacket_common_10 | 🌼 Common Pack Fan | Open 10 common packets | 50 |
| seedpacket_common_50 | 🌼 Common Pack Pro | Open 50 common packets | 200 |
| seedpacket_common_100 | 🌼 Common Pack Master | Open 100 common packets | 500 |
| seedpacket_rare_1 | 💎 Rare Unboxing | Open 1 rare packet | 20 |
| seedpacket_rare_10 | 💎 Rare Pack Fan | Open 10 rare packets | 100 |
| seedpacket_rare_50 | 💎 Rare Pack Pro | Open 50 rare packets | 500 |
| seedpacket_legendary_1 | ⭐ Legendary Unboxing | Open 1 legendary packet | 50 |
| seedpacket_legendary_10 | ⭐ Legendary Pack Fan | Open 10 legendary packets | 300 |
| seedpacket_legendary_50 | ⭐ Legendary Pack Pro | Open 50 legendary packets | 1500 |

## UI Flow

### Toast Notification
- Triggered when achievement is unlocked
- Shows achievement name + "Tap to claim"
- Slides down from top, stays 3-4 seconds
- Tapping toast → navigates to Achievement tab in Florist Card, scrolls to that achievement

### Multiple Unlocks (retroactive)
- Single toast: "🏆 X achievements unlocked!"
- Tapping → goes to Achievement tab
- "Claim All" button appears when unclaimed > 1

### Badge Indicator
- 🔴 badge dot on trophy icon (🏆) in Florist Card when there are unclaimed achievements

### Florist Card — Achievement Tab
- Tab bar: **Passport | Achievements**
- Achievements grouped by category with section headers
- Each achievement shows: name, description (localized), progress bar (current/target), reward amount
- Three states:
  - 🔒 **Locked** — greyed out, shows progress toward target
  - ✅ **Unlocked (unclaimed)** — highlighted, shows "Claim" button
  - ✅ **Claimed** — checkmark, shows claimed date

### Claim Flow
- Tap "Claim" → rewards added to player state → `claimedAt` set → sprout animation
- "Claim All" → batch claim all unclaimed → total sprouts animation

## Achievement Checker

### When to check
- After every state-changing action (harvest, water, check-in, buy booster, combo trigger, open seed packet)
- Subscribe to `gameEventBus` (same pattern as mission subscriber)

### Check logic
1. Loop all achievement definitions
2. Skip if id already in `achievements` map
3. Evaluate condition against current PlayerState/Collection
4. If condition met → add `{ unlockedAt }` to achievements map + emit toast event

### Adding new achievements
- Just add a new `AchievementDef` to the definitions array
- Next check loop will evaluate and unlock if condition is already met
- No migration needed, no schema version bump

## Existing Users / Migration

### Schema migration (v9 → v10)
- Add `achievements: {}` to PlayerState
- Add `harvestByRarity`, `comboCount`, `seedPacketsOpened` to PlayerStats
- **Backfill `harvestByRarity`**: sum `CollectedSpecies[].count` grouped by species rarity (lookup from SPECIES data)
- **`comboCount`**: start at `{ combo10: 0, combo15: 0, combo20: 0 }` (never tracked)
- **Backfill `seedPacketsOpened`**: derive from existing `shopPurchases` — `common: shopPurchases.common`, `rare: shopPurchases.rare`, `legendary: shopPurchases.legendary`, `total: sum of all three`

### Retroactive unlock
- On first load after migration, achievement checker runs against existing state
- All achievements whose conditions are already met get unlocked with current timestamp
- Player must claim rewards manually (retroactive sprouts included)
- Toast: "🏆 X achievements unlocked!" if multiple
