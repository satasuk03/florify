import type { DrawOp } from "./passportLayout";

/**
 * In-place pass that shrinks any text op with a `fitTo` hint so the
 * rendered text fits within `maxWidth`. Uses one shared offscreen
 * canvas for measurement.
 *
 * Called by both renderers (DOM preview + Canvas 2D export) before the
 * main draw loop. `buildLayout` stays pure — each call returns a fresh
 * ops array so mutations are scoped to this render only.
 */
export function fitTextOps(ops: DrawOp[]): void {
  if (typeof document === "undefined") return; // SSR safety

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  for (const op of ops) {
    if ((op.type !== "text" && op.type !== "gradientText") || !op.fitTo) continue;

    const { maxWidth, sizeLadder } = op.fitTo;
    let fittedSize = sizeLadder[sizeLadder.length - 1] ?? op.size;
    for (const size of sizeLadder) {
      ctx.font = `${op.weight} ${size}px ${canvasFontFamily(op.family)}`;
      const measured = ctx.measureText(op.text).width;
      // measureText ignores letterSpacing, so add it back manually.
      const letterSpacingTotal =
        (op.letterSpacing ?? 0) * Math.max(0, op.text.length - 1);
      if (measured + letterSpacingTotal <= maxWidth) {
        fittedSize = size;
        break;
      }
    }
    op.size = fittedSize;
  }
}

function canvasFontFamily(family: "serif" | "sans" | "mono"): string {
  switch (family) {
    case "serif":
      return "'Fraunces', 'Noto Serif Thai', ui-serif, Georgia, serif";
    case "sans":
      return "'IBM Plex Sans Thai Looped', system-ui, sans-serif";
    case "mono":
      return "ui-monospace, 'SF Mono', Menlo, monospace";
  }
}
