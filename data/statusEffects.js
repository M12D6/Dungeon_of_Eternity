// ═══════════════════════════════════════════════════════════════
//  STATUS EFFECTS — 30+ effects with mechanics
// ═══════════════════════════════════════════════════════════════
export const STATUS_EFFECTS = {
  // ── Damage over time ──
  BURN:       { name:"Burn",       icon:"🔥", color:"#f97316", kind:"dot",  dmgPct:0.08, desc:"Takes fire dmg each turn" },
  POISON:     { name:"Poison",     icon:"☠️", color:"#4ade80", kind:"dot",  dmgPct:0.06, desc:"Slow poison drain" },
  BLEED:      { name:"Bleed",      icon:"🩸", color:"#dc2626", kind:"dot",  dmgPct:0.10, desc:"Bleeds HP each turn" },
  CURSE:      { name:"Curse",      icon:"🕯️", color:"#8b5cf6", kind:"dot",  dmgPct:0.07, desc:"Dark curse eats soul" },
  ACID:       { name:"Acid",       icon:"🧪", color:"#84cc16", kind:"dot",  dmgPct:0.09, desc:"Acid melts defenses, reduces DEF" },
  PLAGUE:     { name:"Plague",     icon:"🦠", color:"#a3e635", kind:"dot",  dmgPct:0.12, desc:"Contagious, spreads to allies" },
  DECAY:      { name:"Decay",      icon:"🍂", color:"#78716c", kind:"dot",  dmgPct:0.08, desc:"Flesh rots — heal reduced 50%" },
  HOLY_FIRE:  { name:"Holy Fire",  icon:"✨", color:"#fcd34d", kind:"dot",  dmgPct:0.11, desc:"Divine flame, bypasses DEF" },
  VOID:       { name:"Void",       icon:"🌀", color:"#581c87", kind:"dot",  dmgPct:0.10, desc:"Unravels reality" },
  // ── Control ──
  STUN:       { name:"Stun",       icon:"⚡", color:"#facc15", kind:"control", desc:"Cannot act" },
  FREEZE:     { name:"Freeze",     icon:"❄️", color:"#60a5fa", kind:"control", desc:"Frozen solid, cannot act" },
  SLEEP:      { name:"Sleep",      icon:"💤", color:"#7dd3fc", kind:"control", desc:"Asleep until damaged" },
  PARALYZE:   { name:"Paralyze",   icon:"⚡", color:"#eab308", kind:"control", desc:"50% chance to skip turn" },
  SILENCE:    { name:"Silence",    icon:"🤐", color:"#a78bfa", kind:"control", desc:"Cannot cast spells" },
  BLIND:      { name:"Blind",      icon:"👁️", color:"#1f2937", kind:"control", desc:"50% miss chance" },
  CHARM:      { name:"Charm",      icon:"💗", color:"#f472b6", kind:"control", desc:"Attacks its allies" },
  FEAR:       { name:"Fear",       icon:"😱", color:"#6b7280", kind:"control", desc:"Flees instead of attacks" },
  CONFUSE:    { name:"Confusion",  icon:"😵", color:"#c084fc", kind:"control", desc:"Random target" },
  ROOT:       { name:"Root",       icon:"🌿", color:"#16a34a", kind:"control", desc:"Cannot dodge/flee" },
  // ── Debuff ──
  WEAKEN:     { name:"Weaken",     icon:"⬇️", color:"#64748b", kind:"debuff", desc:"-30% ATK" },
  VULNERABLE: { name:"Vulnerable", icon:"💢", color:"#f43f5e", kind:"debuff", desc:"+25% dmg taken" },
  SLOW:       { name:"Slow",       icon:"🐌", color:"#06b6d4", kind:"debuff", desc:"-50% SPD" },
  MARK:       { name:"Death Mark", icon:"💀", color:"#8b5cf6", kind:"debuff", desc:"Next hit is instant-kill" },
  EXPOSE:     { name:"Expose",     icon:"🎯", color:"#e11d48", kind:"debuff", desc:"-50% DEF" },
  DOOM:       { name:"Doom",       icon:"⏳", color:"#000000", kind:"debuff", desc:"Dies in 3 turns" },
  // ── Buff ──
  ATKBUFF:    { name:"Empower",    icon:"💪", color:"#f59e0b", kind:"buff", desc:"+40% ATK" },
  DEFBUFF:    { name:"Bulwark",    icon:"🛡️", color:"#3b82f6", kind:"buff", desc:"+50% DEF" },
  HASTE:      { name:"Haste",      icon:"💨", color:"#06b6d4", kind:"buff", desc:"Extra turn 25% chance" },
  REGEN:      { name:"Regen",      icon:"💚", color:"#22c55e", kind:"buff", desc:"+10% HP per turn" },
  BARRIER:    { name:"Barrier",    icon:"🔰", color:"#38bdf8", kind:"buff", desc:"Absorbs next hit" },
  REFLECT:    { name:"Reflect",    icon:"🪞", color:"#c4b5fd", kind:"buff", desc:"50% dmg reflected" },
  DODGE:      { name:"Evasion",    icon:"👤", color:"#a78bfa", kind:"buff", desc:"+50% dodge" },
  STEALTH:    { name:"Stealth",    icon:"🌫️", color:"#64748b", kind:"buff", desc:"Untargetable 1 turn" },
  LIFESTEAL:  { name:"Lifesteal",  icon:"🧛", color:"#dc2626", kind:"buff", desc:"Heal 30% of dmg" },
  LUCK:       { name:"Lucky",      icon:"🍀", color:"#22c55e", kind:"buff", desc:"+15% crit, +loot" },
  BERSERK:    { name:"Berserk",    icon:"😤", color:"#dc2626", kind:"buff", desc:"+80% ATK, -40% DEF" },
  HOLY:       { name:"Blessed",    icon:"😇", color:"#fef3c7", kind:"buff", desc:"Immune to debuffs" },
  LICH:       { name:"Lich Form",  icon:"👑", color:"#8b5cf6", kind:"buff", desc:"+100% all stats" },
  ASTRAL:     { name:"Astral",     icon:"🌌", color:"#6366f1", kind:"buff", desc:"Phased — immune to physical" },
  FRENZY:     { name:"Frenzy",     icon:"🌋", color:"#b91c1c", kind:"buff", desc:"+60% ATK, -30% DEF" },
  OVERLOAD:   { name:"Overload",   icon:"⚡", color:"#fbbf24", kind:"buff", desc:"Spells cost 0 MP" },
  SHROUD:     { name:"Shroud",     icon:"🌑", color:"#1e1b4b", kind:"buff", desc:"Next attack crits" },
};

export const DOT_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="dot").map(([k])=>k);
export const CONTROL_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="control").map(([k])=>k);
export const BUFF_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="buff").map(([k])=>k);
export const DEBUFF_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="debuff").map(([k])=>k);

export function isControl(s)  { return s && STATUS_EFFECTS[s]?.kind === "control"; }
export function isDot(s)      { return s && STATUS_EFFECTS[s]?.kind === "dot"; }
export function isBuff(s)     { return s && STATUS_EFFECTS[s]?.kind === "buff"; }
export function isDebuff(s)   { return s && STATUS_EFFECTS[s]?.kind === "debuff"; }
