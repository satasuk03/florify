'use client';

import type { FloristCardData } from '@/store/gameStore';
import {
  buildLayout,
  PASSPORT_COLORS,
  PASSPORT_H,
  PASSPORT_W,
  type DrawOp,
} from './passportLayout';
import { fitTextOps } from './fitTextOps';

/**
 * Canvas 2D renderer — walks the shared draw-instruction list and
 * produces a 1080×1920 PNG blob sized for Instagram/Facebook stories.
 *
 * Must be called on the client (uses `document`, `HTMLCanvasElement`).
 * Waits for `document.fonts.ready` first so custom fonts don't fall
 * back to browser defaults mid-draw.
 *
 * See designs/11 §11.6 for rationale on why we hand-roll Canvas 2D
 * instead of using html2canvas / dom-to-image.
 */

export async function renderPassportImage(data: FloristCardData): Promise<Blob> {
  if (typeof document === 'undefined') {
    throw new Error('renderPassportImage is client-only');
  }

  // Wait for custom fonts (Fraunces, Sarabun) to be ready, otherwise
  // canvas falls back to generic serif/sans mid-render.
  try {
    await document.fonts.ready;
  } catch {
    // Ignore — some environments lack FontFaceSet; we'll fall back to defaults.
  }

  const canvas = document.createElement('canvas');
  canvas.width = PASSPORT_W;
  canvas.height = PASSPORT_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');

  // ── Background gradient ─────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, PASSPORT_H);
  bg.addColorStop(0, PASSPORT_COLORS.bgTop);
  bg.addColorStop(1, PASSPORT_COLORS.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, PASSPORT_W, PASSPORT_H);

  // ── Build ops, shrink titles, preload any image sources ────────
  const ops = buildLayout(data);
  fitTextOps(ops);

  const imageCache = new Map<string, HTMLImageElement>();
  const imageSources = new Set<string>();
  for (const op of ops) {
    if (op.type === 'image' && op.src !== null) imageSources.add(op.src);
  }
  await Promise.allSettled(
    [...imageSources].map(async (src) => {
      try {
        const img = await loadImage(src);
        imageCache.set(src, img);
      } catch {
        // Swallow — drawImageOp falls back to the placeholder when the
        // src is missing from the cache.
      }
    }),
  );

  // ── Walk draw ops ───────────────────────────────────────────────
  for (const op of ops) {
    drawOp(ctx, op, imageCache);
  }

  // ── Serialize ───────────────────────────────────────────────────
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) throw new Error('canvas.toBlob returned null');
  return blob;
}

function drawOp(
  ctx: CanvasRenderingContext2D,
  op: DrawOp,
  imageCache: Map<string, HTMLImageElement>,
): void {
  switch (op.type) {
    case 'text':
      drawText(ctx, op);
      return;
    case 'rect':
      drawRect(ctx, op);
      return;
    case 'line':
      ctx.strokeStyle = op.color;
      ctx.lineWidth = op.width;
      ctx.beginPath();
      ctx.moveTo(op.x1, op.y1);
      ctx.lineTo(op.x2, op.y2);
      ctx.stroke();
      return;
    case 'corner':
      drawCorner(ctx, op);
      return;
    case 'image':
      drawImageOp(ctx, op, imageCache);
      return;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Same-origin static assets — the flag is defensive in case we ever
    // host floras on a CDN.
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

function drawImageOp(
  ctx: CanvasRenderingContext2D,
  op: Extract<DrawOp, { type: 'image' }>,
  cache: Map<string, HTMLImageElement>,
): void {
  const r = Math.min(op.radius, op.h / 2, op.w / 2);

  // 1) Background fill (rounded rect) — always drawn, even for placeholder.
  ctx.save();
  ctx.beginPath();
  pathRoundedRect(ctx, op.x, op.y, op.w, op.h, r);
  ctx.closePath();
  ctx.fillStyle = op.bgColor;
  ctx.fill();

  // 2) Clip and draw (object-fit: cover — overflow cropped by the clip)
  ctx.clip();
  const img = op.src ? cache.get(op.src) : undefined;
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    const { dx, dy, dw, dh } = coverRect(
      img.naturalWidth,
      img.naturalHeight,
      op.x,
      op.y,
      op.w,
      op.h,
    );
    ctx.drawImage(img, dx, dy, dw, dh);
  } else if (op.placeholder) {
    ctx.fillStyle = op.placeholder.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${op.placeholder.size}px ${canvasFontFamily('sans')}`;
    ctx.fillText(op.placeholder.text, op.x + op.w / 2, op.y + op.h / 2);
  }
  ctx.restore();

  // 3) Border stroke on top (non-clipped so it's crisp).
  if (op.border) {
    ctx.beginPath();
    pathRoundedRect(ctx, op.x, op.y, op.w, op.h, r);
    ctx.closePath();
    ctx.strokeStyle = op.border.color;
    ctx.lineWidth = op.border.width;
    ctx.stroke();
  }
}

function coverRect(
  srcW: number,
  srcH: number,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
): { dx: number; dy: number; dw: number; dh: number } {
  // Mirror object-fit: cover — scale so the shorter side fills the box
  // (overflow on the longer side is cropped by the caller's clip path).
  const ratio = Math.max(boxW / srcW, boxH / srcH);
  const dw = srcW * ratio;
  const dh = srcH * ratio;
  const dx = boxX + (boxW - dw) / 2;
  const dy = boxY + (boxH - dh) / 2;
  return { dx, dy, dw, dh };
}

function drawText(ctx: CanvasRenderingContext2D, op: Extract<DrawOp, { type: 'text' }>): void {
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = op.align;
  ctx.font = `${op.weight} ${op.size}px ${canvasFontFamily(op.family)}`;

  if (op.shiny) {
    // Static rainbow gradient — frozen snapshot for PNG export (no animation).
    // Font must be set first so measureText uses the correct metrics.
    const width = ctx.measureText(op.text).width;
    const startX =
      op.align === 'center' ? op.x - width / 2
      : op.align === 'right' ? op.x - width
      : op.x;
    const grad = ctx.createLinearGradient(startX, op.y, startX + width, op.y);
    grad.addColorStop(0.00, '#FFB0C3');
    grad.addColorStop(0.20, '#FFE18A');
    grad.addColorStop(0.40, '#A6F0AD');
    grad.addColorStop(0.60, '#9EC6FF');
    grad.addColorStop(0.80, '#C9A3FF');
    grad.addColorStop(1.00, '#FFB0C3');
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = op.color;
  }

  if (!op.letterSpacing) {
    ctx.fillText(op.text, op.x, op.y);
    return;
  }

  // Letter-spacing: use the native CSS `letterSpacing` property if
  // supported (Chrome 99+, Safari 16.4+, Firefox 94+), otherwise fall
  // back to manual character-by-character drawing.
  const ctxAny = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  if (typeof ctxAny.letterSpacing !== 'undefined') {
    ctxAny.letterSpacing = `${op.letterSpacing}px`;
    ctx.fillText(op.text, op.x, op.y);
    ctxAny.letterSpacing = '0px';
    return;
  }

  // Fallback: measure + draw per-char. textAlign is respected by
  // computing the full width with spacing and offsetting accordingly.
  const chars = [...op.text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = widths.reduce((a, b) => a + b, 0) + op.letterSpacing * (chars.length - 1);
  let startX = op.x;
  if (op.align === 'center') startX = op.x - totalWidth / 2;
  else if (op.align === 'right') startX = op.x - totalWidth;
  ctx.textAlign = 'left';
  let cursor = startX;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i]!, cursor, op.y);
    cursor += widths[i]! + op.letterSpacing;
  }
}

function drawRect(ctx: CanvasRenderingContext2D, op: Extract<DrawOp, { type: 'rect' }>): void {
  ctx.fillStyle = op.color;
  const r = op.radius ?? 0;
  if (r <= 0) {
    ctx.fillRect(op.x, op.y, op.w, op.h);
    return;
  }
  // Rounded rect — use roundRect if available, else path fallback
  const ctxAny = ctx as CanvasRenderingContext2D & {
    roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
  };
  ctx.beginPath();
  if (typeof ctxAny.roundRect === 'function') {
    ctxAny.roundRect(op.x, op.y, op.w, op.h, Math.min(r, op.h / 2, op.w / 2));
  } else {
    pathRoundedRect(ctx, op.x, op.y, op.w, op.h, Math.min(r, op.h / 2, op.w / 2));
  }
  ctx.fill();
}

function pathRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCorner(ctx: CanvasRenderingContext2D, op: Extract<DrawOp, { type: 'corner' }>): void {
  ctx.fillStyle = op.color;
  const half = op.width / 2;
  // Horizontal arm
  let hx = op.x;
  const hy = op.y - half;
  const hw = op.len;
  // Vertical arm
  let vx = op.x - half;
  let vy = op.y;
  const vh = op.len;
  if (op.corner === 'tr' || op.corner === 'br') {
    hx = op.x - op.len;
    vx = op.x - half;
  }
  if (op.corner === 'bl' || op.corner === 'br') {
    vy = op.y - op.len;
  }
  ctx.fillRect(hx, hy, hw, op.width);
  ctx.fillRect(vx, vy, op.width, vh);
}

function canvasFontFamily(family: 'serif' | 'sans' | 'mono'): string {
  // Next/font exposes the computed font via CSS variables. Canvas 2D
  // can't read CSS variables directly — we fall back to explicit names
  // that match what the Google Fonts load under.
  switch (family) {
    case 'serif':
      return "'Fraunces', 'Noto Serif Thai', ui-serif, Georgia, serif";
    case 'sans':
      return "'IBM Plex Sans Thai Looped', system-ui, sans-serif";
    case 'mono':
      return "ui-monospace, 'SF Mono', Menlo, monospace";
  }
}
