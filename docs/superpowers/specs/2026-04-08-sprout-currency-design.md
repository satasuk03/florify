# Sprout Currency System Design

## Context

Florify currently has one resource (water drops) and one reward loop (harvest -> collection + pity). Players lack a persistent currency to spend on meaningful choices. The Sprout (🌱) currency adds an accumulation-and-spend economy: earn from harvesting and daily quests, spend on Booster Packs (gacha) and quest refreshes. This deepens engagement without adding real-money purchases.

---

## 1. Sprout Currency (🌱)

**New field:** `sprouts: number` on `PlayerState` (no cap, starts at 0).

### Sources

| Source | Amount |
|--------|--------|
| Harvest common | +1 🌱 |
| Harvest rare | +3 🌱 |
| Harvest legendary | +10 🌱 |
| All 5 daily missions complete | +100 🌱 (one-time per day) |

### Sinks

| Sink | Cost |
|------|------|
| Common Booster Pack | 100 🌱 |
| Rare Booster Pack | 300 🌱 |
| Legendary Booster Pack | 1000 🌱 |
| Quest refresh (single quest) | 10 🌱 |

---

## 2. Schema Migration (v7 -> v8)

**File:** `apps/web/src/store/migrations.ts`

```typescript
function migrateV7toV8(s: UnknownState): UnknownState {
  const dailyMissions = (s.dailyMissions ?? {}) as Record<string, unknown>;
  return {
    ...s,
    schemaVersion: 8,
    sprouts: 0,
    dailyMissions: { ...dailyMissions, allCompletedClaimed: false },
  };
}
```

**Type changes** (`packages/shared/src/types/game.ts`):
- `PlayerState.schemaVersion` -> `8`
- Add `sprouts: number`
- Add `allCompletedClaimed: boolean` to `DailyMissionState`
- Add `BoosterTier = 'common' | 'rare' | 'legendary'` type
- Add `booster_open` to `GameEvent` union

**Constants** (`packages/shared/src/config/constants.ts`):
```
SPROUT_HARVEST_COMMON = 1
SPROUT_HARVEST_RARE = 3
SPROUT_HARVEST_LEGENDARY = 10
SPROUT_ALL_MISSIONS_BONUS = 100
SPROUT_QUEST_REFRESH_COST = 10
BOOSTER_COST_COMMON = 100
BOOSTER_COST_RARE = 300
BOOSTER_COST_LEGENDARY = 1000
```

---

## 3. Store Actions

**File:** `apps/web/src/store/gameStore.ts`

### Modified: `waterTree()`
After harvest, award sprouts based on rarity. Reuses existing harvest branch — just add `sprouts: s.sprouts + sproutGain` to the state spread.

### New: `openBooster(tier: BoosterTier) -> BoosterResult | null`
1. Check `sprouts >= cost`. Return null if insufficient.
2. Deduct sprouts.
3. Roll rarity using `BOOSTER_ROLL_WEIGHTS[tier]` (new file `apps/web/src/data/boosterWeights.ts`).
4. Pick random species from that rarity pool.
5. Update collection + pity (reuse shared helper extracted from `waterTree`).
6. Award sprouts for the rolled rarity (same as harvest).
7. Emit `booster_open` event.
8. Return `{ speciesId, rarity, isNew, pityPointsGained, pityReward?, sproutsGained }`.

### New: `refreshMission(index: number) -> boolean`
1. Check `sprouts >= 10` and `missions[index]` is not completed.
2. Deduct 10 sprouts.
3. Pick a random mission from `MISSION_POOL` not already in current set (non-deterministic `Math.random`).
4. Replace mission at index with progress=0, completed=false.

### New: `claimAllCompletedBonus() -> { sproutsAwarded: number }`
1. Check all 5 missions completed AND `allCompletedClaimed === false`.
2. Award 100 sprouts, set `allCompletedClaimed = true`.

### Refactor: Extract pity logic
Factor the pity accumulation + collection upsert from `waterTree()` into a shared helper `applyHarvestToCollection(...)` that both `waterTree` and `openBooster` call.

---

## 4. Booster Pack Weights

**New file:** `apps/web/src/data/boosterWeights.ts`

| Tier | Common | Rare | Legendary |
|------|--------|------|-----------|
| Common Booster | 80% | 15% | 5% |
| Rare Booster | 30% | 60% | 10% |
| Legendary Booster | 5% | 45% | 45% |

Separate from `RARITY_ROLL_WEIGHTS` (used for planting). New `rollBoosterRarity(tier)` function.

---

## 5. UI Components

### 5.1 SproutIndicator

**New file:** `apps/web/src/components/SproutIndicator.tsx`

Simple `🌱 N` pill, similar style to DropsIndicator but without timer. Pop animation on count change.

**Placement:**
- PlotView: below the "Florify" wordmark (`top-center`, after the title div)
- Shop screen: in the header

### 5.2 Shop Screen

**New files:**
- `apps/web/src/app/shop/page.tsx` (route)
- `apps/web/src/screens/ShopView.tsx` (screen component)

**Layout:**
- Header: back button + "Shop" title + SproutIndicator
- 3 Booster Pack cards (vertical list):
  - Pack visual preview (tier-specific design)
  - Tier name + rarity odds breakdown
  - Cost in 🌱 + "Buy" button (disabled if insufficient)
- Quest refresh section is NOT here (lives in DailyMissionSheet)

**Navigation:** New CornerButton in PlotView (left column, below mission button).

### 5.3 BoosterPacket

**New file:** `apps/web/src/components/BoosterPacket.tsx`

Reuses the SeedPacket visual structure (same seed-packet shape) but with tier-specific color palettes:
- **Common**: green tones (leaf-500/600)
- **Rare**: purple/blue tones (violet-500, sky-500)
- **Legendary**: gold tones (amber-500/600)

Each tier has distinct patterns/decorations to differentiate. Label says tier name instead of "SEED No??".

Props: `tier: BoosterTier`, `state: 'idle' | 'opening'`, `onComplete: () => void`

### 5.4 BoosterOpeningOverlay

**New file:** `apps/web/src/components/BoosterOpeningOverlay.tsx`

Full-screen overlay with phase state machine:

```
idle -> packet -> burst -> harvest
```

1. **packet**: BoosterPacket plays opening animation (shake, tear, seal pop — same as SeedPacket)
2. **burst**: White light fills screen (~400ms) — suspense moment
3. **burst -> reveal**: Light gradually shifts to rarity color (green/purple/gold, ~600ms)
4. **harvest**: Mounts `HarvestOverlay` with synthetic TreeInstance from the booster result

**Synthetic TreeInstance for HarvestOverlay:**
```typescript
{
  id: nanoid(),
  seed: 0,
  speciesId: result.speciesId,
  rarity: result.rarity,
  requiredWaterings: 0,  // signals "from booster"
  currentWaterings: 0,
  plantedAt: Date.now(),
  harvestedAt: Date.now(),
}
```

HarvestOverlay shows "From Booster Pack" instead of "N drops used" when `requiredWaterings === 0`.

### 5.5 Mission Refresh Button

**New file:** `apps/web/src/components/MissionRefreshButton.tsx`

Small refresh icon + "10🌱" next to each incomplete mission in DailyMissionSheet.
- Disabled if mission is completed or sprouts < 10.
- On click: calls `refreshMission(index)`.

### 5.6 All Missions Bonus

**New file:** `apps/web/src/components/AllMissionsBonus.tsx`

Banner at bottom of DailyMissionSheet:
- Visible when all 5 missions complete.
- "All missions complete! Claim 100🌱" button.
- Hidden/disabled after `allCompletedClaimed === true`.

---

## 6. Modified Existing Components

### HarvestOverlay (`apps/web/src/components/HarvestOverlay.tsx`)
- Add `sproutsGained?: number` prop -> show "🌱 +N" line
- Add `source?: 'harvest' | 'booster'` prop -> conditionally hide "N drops used" line, show "From Booster Pack" instead

### PlotView (`apps/web/src/screens/PlotView.tsx`)
- Add SproutIndicator below Florify wordmark
- Add Shop CornerButton in left column
- Pass `sproutsGained` to HarvestOverlay after harvest

### DailyMissionSheet (`apps/web/src/components/daily-missions/DailyMissionSheet.tsx`)
- Add MissionRefreshButton to each mission card
- Add AllMissionsBonus at bottom

---

## 7. i18n Keys

Add to both `th` and `en` in `src/i18n/dict.ts`:

```
sprout.count
shop.title / shop.back / shop.buy / shop.insufficient
shop.commonPack / shop.rarePack / shop.legendaryPack
shop.cost / shop.odds.common / shop.odds.rare / shop.odds.legendary
booster.opening / booster.result
harvest.sproutsGained
missions.refresh / missions.refreshCost
missions.allComplete / missions.allCompleteBonus / missions.allCompleteClaimed
plot.openShop
```

---

## 8. Event Bus

Add to `GameEvent` union:
```typescript
| { type: 'booster_open'; tier: BoosterTier; rarity: Rarity; isNew: boolean }
```

Booster-obtained species do NOT count toward harvest missions (distinct event type).

---

## 9. Implementation Phases

### Phase 1: Data layer
- Bump schema to v8, add migration
- Add types, constants, boosterWeights
- Add store actions (openBooster, refreshMission, claimAllCompletedBonus)
- Modify waterTree to award sprouts
- Extract pity helper
- Unit tests

### Phase 2: Sprout indicator + harvest display
- Build SproutIndicator
- Place in PlotView below wordmark
- Add sproutsGained to HarvestOverlay

### Phase 3: Shop screen
- Create shop route + ShopView
- Add Shop CornerButton to PlotView
- Build Booster Pack product cards

### Phase 4: Booster Pack opening animation
- Build BoosterPacket (3 tier designs)
- Build BoosterOpeningOverlay (phase state machine)
- Wire: buy -> overlay -> HarvestOverlay
- Modify HarvestOverlay for booster source

### Phase 5: Quest refresh + daily completion bonus
- Build MissionRefreshButton
- Build AllMissionsBonus
- Add to DailyMissionSheet

### Phase 6: Polish
- All i18n keys
- E2E test coverage
- Guide Book section about sprouts/shop

---

## 10. Verification

1. **Unit tests**: migration v7->v8, sprout awarding on harvest, openBooster roll mechanics, refreshMission, claimAllCompletedBonus
2. **Manual flow**: harvest a tree -> verify sprout gain shown in overlay + indicator updates
3. **Shop flow**: buy Common Booster -> packet animation -> light burst -> rarity reveal -> HarvestOverlay -> collect -> gallery
4. **Quest refresh**: open missions -> tap refresh on incomplete quest -> verify 10🌱 deducted, new quest appears
5. **All missions bonus**: complete all 5 -> claim 100🌱 -> verify cannot claim again same day
6. **Edge cases**: insufficient sprouts (buy disabled), refresh completed quest (disabled), day rollover resets allCompletedClaimed

---

## Critical Files

| File | Action |
|------|--------|
| `packages/shared/src/types/game.ts` | Modify — add sprouts, BoosterTier, allCompletedClaimed, booster_open event |
| `packages/shared/src/config/constants.ts` | Modify — bump schema, add sprout/booster constants |
| `apps/web/src/store/gameStore.ts` | Modify — add actions, modify waterTree, extract pity helper |
| `apps/web/src/store/migrations.ts` | Modify — add v7->v8 migration |
| `apps/web/src/data/boosterWeights.ts` | Create — booster rarity weights per tier |
| `apps/web/src/components/SproutIndicator.tsx` | Create |
| `apps/web/src/screens/ShopView.tsx` | Create |
| `apps/web/src/app/shop/page.tsx` | Create |
| `apps/web/src/components/BoosterPacket.tsx` | Create |
| `apps/web/src/components/BoosterOpeningOverlay.tsx` | Create |
| `apps/web/src/components/MissionRefreshButton.tsx` | Create |
| `apps/web/src/components/AllMissionsBonus.tsx` | Create |
| `apps/web/src/components/HarvestOverlay.tsx` | Modify — add sproutsGained + source props |
| `apps/web/src/screens/PlotView.tsx` | Modify — add SproutIndicator, Shop button |
| `apps/web/src/components/daily-missions/DailyMissionSheet.tsx` | Modify — add refresh + bonus |
| `apps/web/src/i18n/dict.ts` | Modify — add i18n keys |
