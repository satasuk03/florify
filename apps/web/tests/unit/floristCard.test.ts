import { describe, expect, it } from "vitest";
import { deriveSerial, selectFloristCard } from "@/store/gameStore";
import {
  buildLayout,
  PASSPORT_H,
  PASSPORT_W,
  type DrawOp,
} from "@/components/florist-card/passportLayout";
import type { FloristCardData } from "@/store/gameStore";
import { createInitialState } from "@/store/initialState";
import { ACHIEVEMENTS } from "@/data/achievements";
import { SPECIES } from "@/data/species";

// ── deriveSerial ──────────────────────────────────────────────────

describe("deriveSerial", () => {
  it("produces FL-XXXX-XXXX format from a normal userId", () => {
    const s = deriveSerial("abc123DEF456");
    expect(s).toMatch(/^FL-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("uppercases the underlying characters", () => {
    expect(deriveSerial("abcdefgh")).toBe("FL-ABCD-EFGH");
  });

  it("pads with X when the userId has fewer than 8 alphanumeric chars", () => {
    expect(deriveSerial("ab")).toBe("FL-ABXX-XXXX");
    expect(deriveSerial("")).toBe("FL-XXXX-XXXX");
  });

  it("strips non-alphanumeric characters", () => {
    expect(deriveSerial("abc_def-GHI!jk")).toBe("FL-ABCD-EFGH");
  });

  it("is stable for the same input", () => {
    expect(deriveSerial("same-user-id")).toBe(deriveSerial("same-user-id"));
  });
});

// ── buildLayout ────────────────────────────────────────────────────

const sampleData: FloristCardData = {
  rank: "Apprentice",
  speciesUnlocked: 47,
  totalHarvested: 124,
  currentStreak: 12,
  longestStreak: 23,
  rarityProgress: {
    common: { unlocked: 38, total: 200 },
    rare: { unlocked: 8, total: 80 },
    legendary: { unlocked: 1, total: 20 },
  },
  startedAt: new Date(2026, 0, 12).getTime(),
  serial: "FL-3K2P-9XQ4",
  displayName: "Guest",
  title: "Apprentice",
  titleShiny: false,
  avatar: null,
};

describe("buildLayout", () => {
  it("includes the required B1 text anchors", () => {
    const ops = buildLayout(sampleData);
    const texts = ops.filter(
      (o): o is Extract<DrawOp, { type: "text" }> => o.type === "text",
    );
    const textContent = texts.map((t) => t.text);
    // B1 wordmark is lowercase.
    expect(textContent).toContain("florify");
    // Masthead serial.
    expect(textContent).toContain("FL-3K2P-9XQ4");
    // Species caption eyebrow + placeholder name when avatar is null.
    expect(textContent).toContain("FIG. 01 · FAVOURITE SPECIMEN");
    // Hero kicker + title.
    expect(textContent).toContain("— BEARER OF THE TITLE");
    expect(textContent).toContain("Apprentice");
    // Stats strip.
    expect(textContent).toContain("HARVESTED");
    expect(textContent).toContain("124");
    expect(textContent).toContain("COMMON");
    expect(textContent).toContain("RARE");
    expect(textContent).toContain("LEGENDARY");
    // Footer.
    expect(textContent).toContain("Guest");
    expect(textContent).toContain("FLORIFY.ZEZE.APP");
    // Meta line — 47 / 300 species · streak 12.
    expect(
      textContent.some((t) => t.includes("47 / 300 SPECIES") && t.includes("STREAK 12")),
    ).toBe(true);
  });

  it("drops the streak suffix when currentStreak is 0", () => {
    const data: FloristCardData = { ...sampleData, currentStreak: 0 };
    const ops = buildLayout(data);
    const texts = ops.filter(
      (o): o is Extract<DrawOp, { type: "text" }> => o.type === "text",
    );
    const metaLine = texts.find((t) => t.text.includes("SPECIES"));
    expect(metaLine).toBeDefined();
    expect(metaLine!.text).not.toMatch(/STREAK/);
  });

  it("builds within canvas bounds", () => {
    const ops = buildLayout(sampleData);
    for (const op of ops) {
      if (op.type === "rect" || op.type === "gradientRect") {
        expect(op.x).toBeGreaterThanOrEqual(0);
        expect(op.y).toBeGreaterThanOrEqual(0);
        expect(op.x + op.w).toBeLessThanOrEqual(PASSPORT_W + 1);
        expect(op.y + op.h).toBeLessThanOrEqual(PASSPORT_H + 1);
      }
    }
  });

  it("emits top and bottom scrim gradient rects", () => {
    const ops = buildLayout(sampleData);
    const scrims = ops.filter(
      (o): o is Extract<DrawOp, { type: "gradientRect" }> =>
        o.type === "gradientRect",
    );
    // B1: one top scrim (y=0, h=420) + one bottom scrim (bottom-anchored, h=960).
    expect(scrims.length).toBe(2);
    const top = scrims.find((s) => s.y === 0);
    const bottom = scrims.find((s) => s.y + s.h === PASSPORT_H);
    expect(top?.h).toBe(420);
    expect(bottom?.h).toBe(960);
  });

  it("is deterministic for the same data", () => {
    const a = JSON.stringify(buildLayout(sampleData));
    const b = JSON.stringify(buildLayout(sampleData));
    expect(a).toBe(b);
  });

  it("emits a title with a fitTo hint starting at 156px", () => {
    const data: FloristCardData = {
      ...sampleData,
      title: "📗 Apprentice Botanist",
    };
    const ops = buildLayout(data);
    const titleOp = ops.find(
      (o): o is Extract<DrawOp, { type: "text" }> =>
        o.type === "text" && o.text.includes("Apprentice Botanist"),
    );
    expect(titleOp).toBeDefined();
    expect(titleOp!.fitTo).toBeDefined();
    expect(titleOp!.fitTo!.sizeLadder[0]).toBe(156);
  });

  it("emits an image op with placeholder when avatar is null", () => {
    const data: FloristCardData = { ...sampleData, avatar: null };
    const ops = buildLayout(data);
    const imgOp = ops.find(
      (o): o is Extract<DrawOp, { type: "image" }> => o.type === "image",
    );
    expect(imgOp).toBeDefined();
    expect(imgOp!.src).toBeNull();
    expect(imgOp!.placeholder?.text).toBe("🌱");
  });

  it("emits an image op with species src when avatar is set", () => {
    const data: FloristCardData = {
      ...sampleData,
      avatar: { speciesId: 1, stage: 3 },
    };
    const ops = buildLayout(data);
    const imgOp = ops.find(
      (o): o is Extract<DrawOp, { type: "image" }> => o.type === "image",
    );
    expect(imgOp).toBeDefined();
    expect(imgOp!.src).toMatch(/\/floras\/.+\/stage-3\.webp$/);
  });
});

// ── selectFloristCard — title + avatar resolution ─────────────────

describe("selectFloristCard", () => {
  it("uses the auto rank as title when titleSource is auto", () => {
    const state = createInitialState();
    const data = selectFloristCard(state);
    expect(data.title).toBe(data.rank); // Seedling at start
    expect(data.titleShiny).toBe(false);
  });

  it("uses the achievement name when titleSource is achievement and id resolves", () => {
    const firstAch = ACHIEVEMENTS[0]!;
    const state = createInitialState();
    state.passportCustomization.titleSource = { type: "achievement", id: firstAch.id };
    const data = selectFloristCard(state);
    expect(data.title).toBe(firstAch.name);
    expect(data.titleShiny).toBe(false);
  });

  it("falls back to rank when achievement id doesn't exist", () => {
    const state = createInitialState();
    state.passportCustomization.titleSource = { type: "achievement", id: "nonexistent_ach_id" };
    const data = selectFloristCard(state);
    expect(data.title).toBe(data.rank);
    expect(data.titleShiny).toBe(false);
  });

  it("passes avatar through when set", () => {
    const state = createInitialState();
    state.passportCustomization.avatar = { speciesId: 1, stage: 2 };
    const data = selectFloristCard(state);
    expect(data.avatar).toEqual({ speciesId: 1, stage: 2 });
  });

  it("returns null avatar by default", () => {
    const state = createInitialState();
    const data = selectFloristCard(state);
    expect(data.avatar).toBeNull();
  });
});

// ── selectFloristCard — title resolution (PassportTitleSource) ────

describe("selectFloristCard — title resolution", () => {
  it("auto → rank, not shiny", () => {
    const s = createInitialState();
    const c = selectFloristCard(s, "en");
    expect(c.title).toBe(c.rank);
    expect(c.titleShiny).toBe(false);
  });

  it("unknown achievement id → rank, not shiny", () => {
    const s = createInitialState();
    s.passportCustomization.titleSource = {
      type: "achievement",
      id: "__unknown_achievement__",
    };
    const c = selectFloristCard(s, "en");
    expect(c.titleShiny).toBe(false);
    expect(c.title).toBe(c.rank);
  });

  it("epithet source for a species with epithet → epithet text + shiny", () => {
    const legendaryWithEpithet = SPECIES.find(
      (sp) => sp.rarity === "legendary" && sp.epithet,
    );
    if (!legendaryWithEpithet) {
      // Task 7 writes epithets; this case becomes testable after Task 7 runs.
      return;
    }
    const s = createInitialState();
    s.passportCustomization.titleSource = {
      type: "epithet",
      speciesId: legendaryWithEpithet.id,
    };
    const en = selectFloristCard(s, "en");
    const th = selectFloristCard(s, "th");
    expect(en.title).toBe(legendaryWithEpithet.epithet!.en);
    expect(en.titleShiny).toBe(true);
    expect(th.title).toBe(legendaryWithEpithet.epithet!.th);
    expect(th.titleShiny).toBe(true);
  });

  it("epithet source for a species without epithet → rank, not shiny", () => {
    const s = createInitialState();
    s.passportCustomization.titleSource = { type: "epithet", speciesId: 0 };
    const c = selectFloristCard(s, "en");
    expect(c.title).toBe(c.rank);
    expect(c.titleShiny).toBe(false);
  });

  it("epithet source for a completely unknown speciesId → rank, not shiny", () => {
    const s = createInitialState();
    s.passportCustomization.titleSource = { type: "epithet", speciesId: 999999 };
    const c = selectFloristCard(s, "en");
    expect(c.title).toBe(c.rank);
    expect(c.titleShiny).toBe(false);
  });
});
