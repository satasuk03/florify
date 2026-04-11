import type { AchievementDef } from "@florify/shared";

export interface BadgeAssets {
  shield: string;
  emoji: string;
}

/**
 * Category-default badge for an achievement. Per-achievement `def.badge`
 * override is merged over this in `badgeForAchievement`.
 */
function defaultBadge(def: AchievementDef): BadgeAssets {
  if (def.secret) return { shield: "black", emoji: "✨" };
  const id = def.id;
  if (id.startsWith("collect_") || id.startsWith("set_"))
    return { shield: "green", emoji: "🌸" };
  if (id.startsWith("harvest_")) return { shield: "gold", emoji: "🌾" };
  if (id.startsWith("water_")) return { shield: "blue", emoji: "💧" };
  if (id.startsWith("sprout_")) return { shield: "light-green", emoji: "🌱" };
  if (id.startsWith("streak_")) return { shield: "red", emoji: "🔥" };
  if (id.startsWith("combo")) return { shield: "purple", emoji: "⚡" };
  if (id.startsWith("seedpacket_")) return { shield: "brown", emoji: "🎁" };
  if (id.startsWith("mission_") || id.startsWith("daily_all_"))
    return { shield: "bronze", emoji: "📋" };
  return { shield: "silver", emoji: "⭐" };
}

export function badgeForAchievement(def: AchievementDef): BadgeAssets {
  const base = defaultBadge(def);
  if (!def.badge) return base;
  return {
    shield: def.badge.shield ?? base.shield,
    emoji: def.badge.emoji ?? base.emoji,
  };
}
