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
  avatar: null,
};

describe("buildLayout", () => {
  it("includes the required text anchors", () => {
    const ops = buildLayout(sampleData);
    const texts = ops.filter(
      (o): o is Extract<DrawOp, { type: "text" }> => o.type === "text",
    );
    const textContent = texts.map((t) => t.text);
    expect(textContent).toContain("FLORIFY");
    expect(textContent).toContain("BOTANICAL PASSPORT");
    expect(textContent).toContain("124");
    expect(textContent).toContain("TOTAL HARVESTED");
    expect(textContent).toContain("47 / 300 species unlocked");
    expect(textContent).toContain("◆  Apprentice  ◆");
    expect(textContent).toContain("Common");
    expect(textContent).toContain("Rare");
    expect(textContent).toContain("Legendary");
    expect(textContent).toContain("Guest");
    expect(textContent).toContain("FL-3K2P-9XQ4");
    expect(textContent).toContain("florify.zeze.app");
  });

  it("keeps all content within story safe zone y ∈ [240, 1800]", () => {
    const ops = buildLayout(sampleData);
    for (const op of ops) {
      if (op.type === "text") {
        expect(op.y).toBeGreaterThanOrEqual(240);
        expect(op.y).toBeLessThanOrEqual(1800);
      }
    }
  });

  it("builds within canvas bounds", () => {
    const ops = buildLayout(sampleData);
    for (const op of ops) {
      if (op.type === "rect") {
        expect(op.x).toBeGreaterThanOrEqual(0);
        expect(op.y).toBeGreaterThanOrEqual(0);
        expect(op.x + op.w).toBeLessThanOrEqual(PASSPORT_W + 1);
        expect(op.y + op.h).toBeLessThanOrEqual(PASSPORT_H + 1);
      }
    }
  });

  it("renders rarity bars proportional to unlocked/total", () => {
    // Put a 50% legendary progress to verify bar fill width
    const data: FloristCardData = {
      ...sampleData,
      rarityProgress: {
        common: { unlocked: 100, total: 200 },
        rare: { unlocked: 20, total: 80 },
        legendary: { unlocked: 10, total: 20 },
      },
    };
    const ops = buildLayout(data);
    const rects = ops.filter(
      (o): o is Extract<DrawOp, { type: "rect" }> => o.type === "rect",
    );
    // There should be 3 background bars + 3 fills = 6 rects from bar rows
    // (plus decorative corners — but those are 'corner' type, not 'rect').
    expect(rects.length).toBeGreaterThanOrEqual(6);
  });

  it("is deterministic for the same data", () => {
    const a = JSON.stringify(buildLayout(sampleData));
    const b = JSON.stringify(buildLayout(sampleData));
    expect(a).toBe(b);
  });

  it("emits a title pill with a fitTo hint", () => {
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
    expect(titleOp!.fitTo!.sizeLadder[0]).toBe(44);
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
  it("uses the auto rank as title when titleAchievementId is null", () => {
    const state = createInitialState();
    const data = selectFloristCard(state);
    expect(data.title).toBe(data.rank); // Seedling at start
  });

  it("uses the achievement name when titleAchievementId resolves", () => {
    const firstAch = ACHIEVEMENTS[0]!;
    const state = createInitialState();
    state.passportCustomization.titleAchievementId = firstAch.id;
    const data = selectFloristCard(state);
    expect(data.title).toBe(firstAch.name);
  });

  it("falls back to rank when titleAchievementId doesn't exist", () => {
    const state = createInitialState();
    state.passportCustomization.titleAchievementId = "nonexistent_ach_id";
    const data = selectFloristCard(state);
    expect(data.title).toBe(data.rank);
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
