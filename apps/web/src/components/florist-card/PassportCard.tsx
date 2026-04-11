'use client';

import { useMemo, type CSSProperties } from 'react';
import type { FloristCardData } from '@/store/gameStore';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import {
  buildLayout,
  PASSPORT_COLORS,
  PASSPORT_H,
  PASSPORT_W,
  type DrawOp,
} from './passportLayout';
import { fitTextOps } from './fitTextOps';
import { PencilIcon } from '@/components/icons';

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
interface PassportCardProps {
  data: FloristCardData;
  /** CSS width constraint — the stage is scaled to match. */
  maxWidth: number;
  /** When true, pencil overlays appear on the title and avatar and call
   *  the corresponding onEdit callbacks. Owner-only — defaults to false
   *  so shared `/p/` renders stay read-only. */
  editable?: boolean;
  onEditTitle?: () => void;
  onEditAvatar?: () => void;
}

export function PassportCard({
  data,
  maxWidth,
  editable = false,
  onEditTitle,
  onEditAvatar,
}: PassportCardProps) {
  const ops = useMemo(() => {
    const list = buildLayout(data);
    fitTextOps(list);
    return list;
  }, [data]);
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
        {editable && (
          <EditOverlays
            onEditTitle={onEditTitle}
            onEditAvatar={onEditAvatar}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Absolute-positioned pencil overlays that let the owner edit their
 * title and avatar by tapping the passport directly. Rendered inside
 * the scaled stage so the coordinates match `buildLayout` canvas units.
 *
 * Only mounted when `editable` — shared `/p/` links never see these.
 */
function EditOverlays({
  onEditTitle,
  onEditAvatar,
}: {
  onEditTitle?: () => void;
  onEditAvatar?: () => void;
}) {
  // Title pill sits at cx=540, baseline y=780, size up to 44 + letterSpacing.
  // The click zone is a generous horizontal strip across the content column
  // so tapping anywhere near the pill works on mobile. The top edge is
  // deliberately raised above the text baseline so the pencil badge (pinned
  // to the zone's top-right) floats above the title instead of beside it.
  const titleZone = { left: 240, top: 690, width: 600, height: 140 };
  // Avatar frame matches passportLayout.ts exactly.
  const avatarZone = { left: 180, top: 1420, width: 180, height: 220 };

  return (
    <>
      {onEditTitle && (
        <EditButton
          label="แก้ไขฉายา"
          left={titleZone.left}
          top={titleZone.top}
          width={titleZone.width}
          height={titleZone.height}
          onClick={onEditTitle}
        />
      )}
      {onEditAvatar && (
        <EditButton
          label="เปลี่ยนรูปโปรไฟล์"
          left={avatarZone.left}
          top={avatarZone.top}
          width={avatarZone.width}
          height={avatarZone.height}
          radius={16}
          onClick={onEditAvatar}
        />
      )}
    </>
  );
}

function EditButton({
  label,
  left,
  top,
  width,
  height,
  radius = 12,
  onClick,
}: {
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
  radius?: number;
  onClick?: () => void;
}) {
  const pencilSize = 56;
  const pencilInset = 8;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        background: 'transparent',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        borderRadius: radius,
      }}
      className="group"
    >
      {/* Pencil badge — circular cream chip holds a full-color pencil
          illustration. Positioned at the top-right of the click zone. */}
      <span
        style={{
          position: 'absolute',
          top: pencilInset,
          right: pencilInset,
          width: pencilSize,
          height: pencilSize,
          borderRadius: pencilSize / 2,
          background: 'rgba(251, 248, 243, 0.92)',
          boxShadow: '0 4px 10px rgba(75, 55, 30, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <PencilIcon
          size={Math.round(pencilSize * 0.68)}
          className="animate-pencil-wiggle"
        />
      </span>
    </button>
  );
}

function renderOp(op: DrawOp, key: number) {
  switch (op.type) {
    case 'text': {
      const shinyStyle: CSSProperties | undefined = op.shiny
        ? {
            backgroundImage:
              'linear-gradient(90deg, #FFB0C3 0%, #FFE18A 20%, #A6F0AD 40%, #9EC6FF 60%, #C9A3FF 80%, #FFB0C3 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            animation: 'fl-rainbow-sweep 4s linear infinite',
          }
        : undefined;

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
        // Shiny overrides come last so color: 'transparent' wins over op.color
        ...shinyStyle,
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
    case 'image': {
      const wrapperStyle: CSSProperties = {
        position: 'absolute',
        left: op.x,
        top: op.y,
        width: op.w,
        height: op.h,
        borderRadius: op.radius,
        overflow: 'hidden',
        background: op.bgColor,
        border: op.border
          ? `${op.border.width}px solid ${op.border.color}`
          : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
      if (op.src) {
        return (
          <div key={key} style={wrapperStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={op.src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      }
      return (
        <div key={key} style={wrapperStyle}>
          {op.placeholder && (
            <span
              style={{
                fontSize: op.placeholder.size,
                color: op.placeholder.color,
                lineHeight: 1,
              }}
            >
              {op.placeholder.text}
            </span>
          )}
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
