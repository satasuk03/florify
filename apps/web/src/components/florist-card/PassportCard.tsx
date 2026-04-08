'use client';

import type { CSSProperties } from 'react';
import type { FloristCardData } from '@/store/gameStore';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import {
  buildLayout,
  PASSPORT_COLORS,
  PASSPORT_H,
  PASSPORT_W,
  type DrawOp,
} from './passportLayout';

/**
 * In-app DOM renderer of the passport.
 *
 * Walks the same draw-instruction list as the Canvas 2D share-image
 * renderer, but translates each op into an absolutely-positioned
 * `<div>` / `<span>` / `<svg>` inside a 1080×1920 stage. The whole
 * stage is then scaled by `transform: scale(...)` to fit the modal
 * viewport. That keeps the preview and the shared image pixel-identical
 * (designs/11 §11.6).
 */
export function PassportCard({
  data,
  /** CSS width constraint — the stage is scaled to match. */
  maxWidth,
}: {
  data: FloristCardData;
  maxWidth: number;
}) {
  const ops = buildLayout(data);
  const scale = maxWidth / PASSPORT_W;

  return (
    <div
      aria-label="Florist Card preview"
      role="img"
      style={{
        width: maxWidth,
        height: PASSPORT_H * scale,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24 * scale,
        background: `linear-gradient(180deg, ${PASSPORT_COLORS.bgTop} 0%, ${PASSPORT_COLORS.bgBottom} 100%)`,
        boxShadow: '0 12px 32px rgba(75, 55, 30, 0.18)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: PASSPORT_W,
          height: PASSPORT_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {ops.map((op, i) => renderOp(op, i))}
      </div>
    </div>
  );
}

function renderOp(op: DrawOp, key: number) {
  switch (op.type) {
    case 'text': {
      const style: CSSProperties = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: PASSPORT_W,
        // y in DrawOp is the text baseline (matches canvas textBaseline='alphabetic').
        // Translate so the element's baseline sits at `y` regardless of font.
        transform: `translate(0px, ${op.y - op.size}px)`,
        fontFamily: fontFamilyCss(op.family),
        fontSize: op.size,
        fontWeight: op.weight,
        color: op.color,
        textAlign: op.align,
        letterSpacing: op.letterSpacing ? `${op.letterSpacing}px` : undefined,
        lineHeight: 1,
        paddingLeft: op.align !== 'left' ? 0 : op.x,
        paddingRight: op.align === 'right' ? PASSPORT_W - op.x : 0,
        // For center we just let textAlign do it; the full-width div is fine
        whiteSpace: 'nowrap',
      };

      // If this op has animate metadata, replace the numeric portion
      // with <AnimatedNumber> for a count-up effect.
      if (op.animate) {
        const valStr = String(op.animate.value);
        const idx = op.text.indexOf(valStr);
        if (idx >= 0) {
          const prefix = op.text.slice(0, idx);
          const suffix = op.text.slice(idx + valStr.length);
          return (
            <div key={key} style={style}>
              {prefix}
              <AnimatedNumber
                value={op.animate.value}
                delay={op.animate.delay}
              />
              {suffix}
            </div>
          );
        }
      }

      return (
        <div key={key} style={style}>
          {op.text}
        </div>
      );
    }
    case 'rect': {
      if (op.animate) {
        // Animated bar fill: start at width 0, transition to final width.
        const delay = op.animate.delay ?? 0;
        return (
          <div
            key={key}
            ref={(el) => {
              if (el) requestAnimationFrame(() => { el.style.width = `${op.w}px`; });
            }}
            style={{
              position: 'absolute',
              left: op.x,
              top: op.y,
              width: 0,
              height: op.h,
              background: op.color,
              borderRadius: op.radius ?? 0,
              transition: `width 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
            }}
          />
        );
      }
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: op.x,
            top: op.y,
            width: op.w,
            height: op.h,
            background: op.color,
            borderRadius: op.radius ?? 0,
          }}
        />
      );
    }
    case 'line':
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: Math.min(op.x1, op.x2),
            top: Math.min(op.y1, op.y2) - op.width / 2,
            width: Math.abs(op.x2 - op.x1),
            height: op.width,
            background: op.color,
          }}
        />
      );
    case 'corner': {
      // Render as two rectangles (horizontal + vertical arm)
      const { x, y, len, corner, color, width } = op;
      const h = { left: 0, top: -width / 2, w: len, h: width };
      const v = { left: -width / 2, top: 0, w: width, h: len };
      if (corner === 'tr' || corner === 'br') {
        h.left = -len;
        v.left = -width / 2;
      }
      if (corner === 'bl' || corner === 'br') {
        v.top = -len;
      }
      return (
        <div key={key} style={{ position: 'absolute', left: x, top: y }}>
          <div style={{ position: 'absolute', left: h.left, top: h.top, width: h.w, height: h.h, background: color }} />
          <div style={{ position: 'absolute', left: v.left, top: v.top, width: v.w, height: v.h, background: color }} />
        </div>
      );
    }
  }
}

function fontFamilyCss(family: 'serif' | 'sans' | 'mono'): string {
  switch (family) {
    case 'serif':
      return "var(--font-fraunces), ui-serif, Georgia, serif";
    case 'sans':
      return "var(--font-sarabun), system-ui, sans-serif";
    case 'mono':
      return "ui-monospace, 'SF Mono', Menlo, monospace";
  }
}
