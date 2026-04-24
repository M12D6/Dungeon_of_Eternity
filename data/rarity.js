// ═══════════════════════════════════════════════════════════════
//  RARITY TIERS
// ═══════════════════════════════════════════════════════════════
export const RARITY = {
  COMMON:    { name: "Common",    color: "#9ca3af", glow: "#9ca3af33", weight: 100, mult: 1.0 },
  UNCOMMON:  { name: "Uncommon",  color: "#22c55e", glow: "#22c55e44", weight: 50,  mult: 1.4 },
  RARE:      { name: "Rare",      color: "#3b82f6", glow: "#3b82f655", weight: 22,  mult: 2.0 },
  EPIC:      { name: "Epic",      color: "#a855f7", glow: "#a855f766", weight: 9,   mult: 3.0 },
  LEGENDARY: { name: "Legendary", color: "#f97316", glow: "#f9731677", weight: 3,   mult: 4.5 },
  MYTHIC:    { name: "Mythic",    color: "#ef4444", glow: "#ef444488", weight: 1,   mult: 7.0 },
  UNIQUE:    { name: "Unique",    color: "#eab308", glow: "#eab30888", weight: 0.5, mult: 6.0 },
  SET:       { name: "Set",       color: "#14b8a6", glow: "#14b8a688", weight: 0.8, mult: 5.5 },
  CURSED:    { name: "Cursed",    color: "#7c2d12", glow: "#7c2d1288", weight: 2,   mult: 5.0 },
};

export const RARITY_ORDER = ["COMMON","UNCOMMON","RARE","EPIC","LEGENDARY","MYTHIC","UNIQUE","SET","CURSED"];

export function rollRarity(floor = 1, luck = 0) {
  const roll = Math.random() * 100 + floor * 1.6 + luck;
  if (roll > 130) return "MYTHIC";
  if (roll > 108) return "LEGENDARY";
  if (roll > 90)  return "EPIC";
  if (roll > 70)  return "RARE";
  if (roll > 45)  return "UNCOMMON";
  return "COMMON";
}
