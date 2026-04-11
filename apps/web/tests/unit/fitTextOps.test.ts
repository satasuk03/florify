import { describe, expect, it, beforeAll } from "vitest";
import type { DrawOp } from "@/components/florist-card/passportLayout";
import { fitTextOps } from "@/components/florist-card/fitTextOps";

// jsdom ships a stub getContext that returns null. Replace with a
// predictable stub: measureText reports width = text.length * size * 0.6.
beforeAll(() => {
  const stub = function (this: HTMLCanvasElement, contextId: string) {
    if (contextId !== "2d") return null;
    let currentSize = 16;
    return {
      set font(v: string) {
        const match = /(\d+)px/.exec(v);
        currentSize = match ? Number(match[1]) : 16;
      },
      get font() {
        return `${currentSize}px serif`;
      },
      measureText(text: string) {
        return { width: text.length * currentSize * 0.6 };
      },
    } as unknown as CanvasRenderingContext2D;
  };
  // @ts-expect-error — replacing jsdom's stub
  HTMLCanvasElement.prototype.getContext = stub;
});

function makeTextOp(
  overrides: Partial<Extract<DrawOp, { type: "text" }>> = {},
): Extract<DrawOp, { type: "text" }> {
  return {
    type: "text",
    text: "SHORT",
    x: 0,
    y: 0,
    size: 44,
    weight: 600,
    family: "serif",
    color: "#000",
    align: "center",
    ...overrides,
  };
}

describe("fitTextOps", () => {
  it("leaves text alone when it already fits", () => {
    const op = makeTextOp({
      text: "SHORT",
      fitTo: { maxWidth: 1000, sizeLadder: [44, 40, 36, 32] },
    });
    const ops: DrawOp[] = [op];
    fitTextOps(ops);
    expect(op.size).toBe(44);
  });

  it("steps down the ladder until the text fits", () => {
    // text length ~40, size 44 → ~40*44*0.6 = 1056 — too wide for 600.
    // At size 32 → 40*32*0.6 = 768 — still too wide.
    // None fit, so it lands on the smallest (32).
    const op = makeTextOp({
      text: "A VERY LONG TITLE NAME THAT WILL OVERFLOW",
      fitTo: { maxWidth: 600, sizeLadder: [44, 40, 36, 32] },
    });
    fitTextOps([op]);
    expect(op.size).toBeLessThan(44);
  });

  it("picks the largest size that fits", () => {
    // text length 10, maxWidth 300
    // 44 → 10*44*0.6 = 264 — fits!
    const op = makeTextOp({
      text: "TEN CHARS!",
      fitTo: { maxWidth: 300, sizeLadder: [44, 40, 36, 32] },
    });
    fitTextOps([op]);
    expect(op.size).toBe(44);
  });

  it("falls back to the smallest ladder entry when nothing fits", () => {
    const op = makeTextOp({
      text: "WAYYYYYYY TOO LONG FOR ANYTHING IN THIS LADDER EVER",
      fitTo: { maxWidth: 100, sizeLadder: [44, 40, 36, 32] },
    });
    fitTextOps([op]);
    expect(op.size).toBe(32);
  });

  it("ignores ops without a fitTo hint", () => {
    const op = makeTextOp({ text: "X", size: 44 });
    fitTextOps([op]);
    expect(op.size).toBe(44);
  });

  it("ignores non-text ops without throwing", () => {
    const ops: DrawOp[] = [
      { type: "rect", x: 0, y: 0, w: 10, h: 10, color: "#000" },
    ];
    expect(() => fitTextOps(ops)).not.toThrow();
  });
});
