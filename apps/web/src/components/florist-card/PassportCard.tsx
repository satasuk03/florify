'use client';

import { useMemo, type CSSProperties } from 'react';
import type { FloristCardData } from '@/store/gameStore';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import {
  buildLayout,
  DEFAULT_THEME,
  PASSPORT_COLORS,
  PASSPORT_H,
  PASSPORT_W,
  type DrawOp,
  type PassportTheme,
} from './passportLayout';
import { fitTextOps } from './fitTextOps';
import { PencilIcon } from '@/components/icons';

/**
 * In-app DOM renderer of the B1 "Full Bleed" passport.
 *
 * Walks the same draw-instruction list as the Canvas 2D share-image
 * renderer, so the preview and the shared image stay pixel-identical
 * by construction.
 */
interface PassportCardProps {
  data: FloristCardData;
  /** CSS width constraint — the stage is scaled to match. */
  maxWidth: number;
  /** Show pencil affordances on the title and favorite-specimen image. */
  editable?: boolean;
  onEditTitle?: () => void;
  onEditAvatar?: () => void;
  theme?: PassportTheme;
}

export function PassportCard({
  data,
  maxWidth,
  editable = false,
  onEditTitle,
  onEditAvatar,
  theme = DEFAULT_THEME,
}: PassportCardProps) {
  const ops = useMemo(() => {
    const list = buildLayout(data, theme);
    fitTextOps(list);
    return list;
  }, [data, theme]);
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
        borderRadius: 28 * scale,
        background: PASSPORT_COLORS.bgFallback,
        boxShadow: '0 12px 32px rgba(10, 8, 6, 0.35)',
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
            hasAvatar={data.avatar !== null}
            onEditTitle={onEditTitle}
            onEditAvatar={onEditAvatar}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Tap zones for owner edits. Title sits over the hero block; the
 * favorite-specimen zone covers the clear upper portion of the image
 * (above the hero block) so tapping anywhere on the photo prompts
 * the gallery flow.
 */
function EditOverlays({
  hasAvatar,
  onEditTitle,
  onEditAvatar,
}: {
  hasAvatar: boolean;
  onEditTitle?: () => void;
  onEditAvatar?: () => void;
}) {
  // Hero block baseline is at bottom:340 → top of its bounding ≈ 1420
  // once you account for the kicker + 156px title. Keep the zone tight
  // around the title area.
  const titleZone = { left: 60, top: 1400, width: 960, height: 220 };
  // Favorite specimen zone: center of the image, above the hero block.
  // Steers clear of the species caption at top:170.
  const avatarZone = { left: 80, top: 300, width: 920, height: 1000 };

  return (
    <>
      {onEditAvatar && (
        <EditButton
          label={hasAvatar ? 'เปลี่ยนรูปสายพันธุ์โปรด' : 'เลือกสายพันธุ์โปรด'}
          left={avatarZone.left}
          top={avatarZone.top}
          width={avatarZone.width}
          height={avatarZone.height}
          radius={0}
          onClick={onEditAvatar}
        />
      )}
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
  const pencilInset = 24;
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
      <span
        style={{
          position: 'absolute',
          top: pencilInset,
          right: pencilInset,
          width: pencilSize,
          height: pencilSize,
          borderRadius: pencilSize / 2,
          background: 'rgba(247, 243, 234, 0.92)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
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
      const style: CSSProperties = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: PASSPORT_W,
        transform: `translate(0px, ${op.y - op.size}px)`,
        fontFamily: fontFamilyCss(op.family),
        fontSize: op.size,
        fontWeight: op.weight,
        fontStyle: op.italic ? 'italic' : 'normal',
        color: op.color,
        textAlign: op.align,
        letterSpacing: op.letterSpacing ? `${op.letterSpacing}px` : undefined,
        lineHeight: 1,
        paddingLeft: op.align !== 'left' ? 0 : op.x,
        paddingRight: op.align === 'right' ? PASSPORT_W - op.x : 0,
        whiteSpace: 'nowrap',
        textShadow: textShadowCss(op.shadow),
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
    case 'gradientText': {
      const gradientCss = `linear-gradient(90deg, ${op.gradient.colors
        .map((c, i) => `${c} ${(op.gradient.stops[i] ?? 0) * 100}%`)
        .join(', ')})`;
      // When a text-shadow is present on a gradient-clipped element, the
      // shadow would normally vanish along with the solid fill. Mirror
      // the handoff spec: drop the shadow and apply a drop-shadow filter
      // on the wrapping element instead.
      const hasShadow = !!op.shadow;
      const wrapperFilter = hasShadow
        ? `drop-shadow(0 ${op.shadow!.offsetY}px ${op.shadow!.blur}px ${op.shadow!.color})`
        : undefined;

      const style: CSSProperties = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: PASSPORT_W,
        transform: `translate(0px, ${op.y - op.size}px)`,
        fontFamily: fontFamilyCss(op.family),
        fontSize: op.size,
        fontWeight: op.weight,
        fontStyle: op.italic ? 'italic' : 'normal',
        textAlign: op.align,
        letterSpacing: op.letterSpacing ? `${op.letterSpacing}px` : undefined,
        lineHeight: 1,
        paddingLeft: op.align !== 'left' ? 0 : op.x,
        paddingRight: op.align === 'right' ? PASSPORT_W - op.x : 0,
        whiteSpace: 'nowrap',
        backgroundImage: gradientCss,
        backgroundSize: op.animateGradient ? '200% 100%' : '100% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        animation: op.animateGradient
          ? 'fl-rainbow-sweep 4s linear infinite'
          : undefined,
        filter: wrapperFilter,
      };

      return (
        <div key={key} style={style}>
          {op.text}
        </div>
      );
    }
    case 'gradientRect': {
      const stopsCss = op.stops
        .map((s) => `${s.color} ${(s.offset * 100).toFixed(2)}%`)
        .join(', ');
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: op.x,
            top: op.y,
            width: op.w,
            height: op.h,
            background: `linear-gradient(${op.angle}deg, ${stopsCss})`,
            pointerEvents: 'none',
          }}
        />
      );
    }
  }
}

function textShadowCss(
  shadow?: { offsetY: number; blur: number; color: string },
): string | undefined {
  if (!shadow) return undefined;
  return `0 ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}`;
}

function fontFamilyCss(family: 'serif' | 'sans' | 'mono'): string {
  switch (family) {
    case 'serif':
      return "var(--font-fraunces), var(--font-noto-serif-thai), ui-serif, Georgia, serif";
    case 'sans':
      return "var(--font-plex-thai), system-ui, sans-serif";
    case 'mono':
      return "ui-monospace, 'SF Mono', Menlo, monospace";
  }
}
