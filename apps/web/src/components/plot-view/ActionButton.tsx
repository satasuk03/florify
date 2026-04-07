"use client";

import { useState, useCallback, useRef, type CSSProperties } from "react";
import { Button } from "@/components/Button";
import { ComboBurst } from "@/components/ComboBurst";

/**
 * Bottom-center action button (Plant / Water).
 *
 * Combo system: rapid taps within 1.5s escalate through five tiers
 * that increase squish depth, bounce height, halo flash, icon wobble,
 * and add a shake at the higher tiers. The tier is mapped to CSS
 * custom properties consumed by the `water-btn-*` keyframes.
 *
 * Tier 1 (1-3 taps)   — gentle squish
 * Tier 2 (4-7 taps)   — stronger bounce + bigger halo
 * Tier 3 (8-11 taps)  — heavy + shake
 * Tier 4 (12-15 taps) — heavier + faster
 * Tier 5 (16+ taps)   — max intensity
 */

const COMBO_TIERS = [
  // tier 1: taps 1-3
  {
    "--sq-down": "0.91",
    "--sq-y": "0.96",
    "--sq-dy": "2px",
    "--bn-up": "1.06",
    "--bn-dy": "-3px",
    "--halo-s": "1.35",
    "--icon-rot": "14deg",
    "--icon-s": "1.2",
    "--shine-o": "0.5",
    duration: 420,
    shake: false,
  },
  // tier 2: taps 4-7
  {
    "--sq-down": "0.86",
    "--sq-y": "0.93",
    "--sq-dy": "3px",
    "--bn-up": "1.12",
    "--bn-dy": "-6px",
    "--halo-s": "1.6",
    "--icon-rot": "22deg",
    "--icon-s": "1.35",
    "--shine-o": "0.7",
    duration: 380,
    shake: false,
  },
  // tier 3: taps 8-11
  {
    "--sq-down": "0.82",
    "--sq-y": "0.90",
    "--sq-dy": "4px",
    "--bn-up": "1.16",
    "--bn-dy": "-8px",
    "--halo-s": "1.9",
    "--icon-rot": "30deg",
    "--icon-s": "1.5",
    "--shine-o": "0.9",
    duration: 340,
    shake: true,
  },
  // tier 4: taps 12-15
  {
    "--sq-down": "0.78",
    "--sq-y": "0.87",
    "--sq-dy": "5px",
    "--bn-up": "1.20",
    "--bn-dy": "-10px",
    "--halo-s": "2.2",
    "--icon-rot": "38deg",
    "--icon-s": "1.65",
    "--shine-o": "1",
    duration: 300,
    shake: true,
  },
  // tier 5: taps 16+
  {
    "--sq-down": "0.74",
    "--sq-y": "0.84",
    "--sq-dy": "6px",
    "--bn-up": "1.24",
    "--bn-dy": "-12px",
    "--halo-s": "2.5",
    "--icon-rot": "45deg",
    "--icon-s": "1.8",
    "--shine-o": "1",
    duration: 260,
    shake: true,
  },
] as const;

function comboTier(combo: number) {
  if (combo >= 16) return 4;
  if (combo >= 12) return 3;
  if (combo >= 8) return 2;
  if (combo >= 4) return 1;
  return 0;
}

const COMBO_RESET_MS = 1500;

export function ActionButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  const [tapping, setTapping] = useState(0);
  const [combo, setCombo] = useState(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = useCallback(() => {
    if (disabled) return;

    // Advance combo
    clearTimeout(comboTimerRef.current);
    setCombo((c) => c + 1);
    comboTimerRef.current = setTimeout(() => setCombo(0), COMBO_RESET_MS);

    setTapping((n) => n + 1);
    onClick();
  }, [disabled, onClick]);

  const tier = COMBO_TIERS[comboTier(combo)]!;
  const vars = tapping
    ? ({
        "--sq-down": tier["--sq-down"],
        "--sq-y": tier["--sq-y"],
        "--sq-dy": tier["--sq-dy"],
        "--bn-up": tier["--bn-up"],
        "--bn-dy": tier["--bn-dy"],
        "--halo-s": tier["--halo-s"],
        "--icon-rot": tier["--icon-rot"],
        "--icon-s": tier["--icon-s"],
        "--shine-o": tier["--shine-o"],
      } as CSSProperties)
    : {};

  return (
    <div
      className="relative"
      style={
        tapping
          ? {
              ...vars,
              animation: `water-btn-squish ${tier.duration}ms cubic-bezier(.22,.68,.36,1.2) both${tier.shake ? `, water-btn-shake 280ms ease-out ${tier.duration}ms both` : ""}`,
            }
          : undefined
      }
      key={tapping}
    >
      {/* Combo burst — number + particles above the button */}
      {tapping > 0 && (
        <ComboBurst key={`combo-${tapping}`} combo={combo} tapKey={tapping} />
      )}

      {/* Warm clay halo */}
      <div
        aria-hidden
        className={`absolute -inset-5 rounded-full blur-2xl transition-opacity duration-500
          bg-[radial-gradient(ellipse_at_center,rgba(222,145,95,0.55),rgba(199,130,90,0.32)_55%,transparent_82%)]
          ${disabled ? "opacity-0" : "opacity-100 animate-pulse-slow"}`}
        style={
          tapping
            ? { ...vars, animation: "water-btn-halo-flash 500ms ease-out both" }
            : undefined
        }
        key={`halo-${tapping}`}
      />
      <Button
        size="lg"
        onClick={handleClick}
        disabled={disabled}
        className={`relative !rounded-full !h-14 px-10 min-w-[220px]
          !bg-[rgba(216,148,110,0.55)] backdrop-blur-xl backdrop-saturate-150
          text-cream-50
          ring-1 ring-inset ring-white/40
          border border-clay-300/50
          shadow-[0_10px_28px_-10px_rgba(185,100,60,0.5),inset_0_1px_0_0_rgba(255,235,215,0.6),inset_0_-8px_18px_-8px_rgba(170,85,45,0.4)]
          hover:!bg-[rgba(220,152,114,0.65)] hover:shadow-[0_14px_36px_-10px_rgba(185,100,60,0.6),inset_0_1px_0_0_rgba(255,240,220,0.65),inset_0_-8px_18px_-8px_rgba(170,85,45,0.45)]
          before:content-[''] before:absolute before:inset-x-3 before:top-1 before:h-1/2 before:rounded-full
          before:bg-gradient-to-b before:from-white/50 before:to-transparent before:pointer-events-none
          overflow-hidden active:!scale-100
          ${disabled ? "saturate-50 opacity-60" : ""}`}
      >
        <span className="relative flex items-center justify-center gap-2.5 drop-shadow-[0_1px_1px_rgba(90,45,20,0.45)]">
          <span
            className="text-cream-50"
            style={
              tapping
                ? {
                    ...vars,
                    animation: `water-btn-icon-splash ${tier.duration + 30}ms cubic-bezier(.22,.68,.36,1.15) both`,
                    display: "inline-block",
                  }
                : { display: "inline-block" }
            }
            key={`icon-${tapping}`}
          >
            {icon}
          </span>
          <span className="font-serif tracking-wide">{label}</span>
        </span>
        {/* Shine sweep */}
        {tapping > 0 && (
          <span
            key={`shine-${tapping}`}
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              ...vars,
              animation: `water-btn-shine ${tier.duration - 40}ms ease-out 80ms both`,
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
            }}
          />
        )}
      </Button>
    </div>
  );
}
