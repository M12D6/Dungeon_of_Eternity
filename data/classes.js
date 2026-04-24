// ═══════════════════════════════════════════════════════════════
//  CLASSES & SUBCLASSES (8 × 3 = 24 specs)
//  Sub-classes unlock at level 20
// ═══════════════════════════════════════════════════════════════
export const CLASSES = {
  WARRIOR: {
    name: "Warrior", icon: "⚔️", color: "#ef4444",
    desc: "Unstoppable frontline fighter. Master of melee combat.",
    stats: { hp: 150, mana: 60, atk: 22, def: 18, spd: 8, crit: 10 },
    passives: ["Iron Skin: +20% DEF", "Berserker: +5% ATK per kill (stacks 5x)"],
    spells: ["Whirlwind","Shield Bash","War Cry","Blade Storm","Deathblow"],
    startWeapon: "w_sword1",
    subclasses: {
      JUGGERNAUT: { name:"Juggernaut", icon:"🛡️", desc:"Immovable tank. Halves damage below 50% HP.",
        stats:{ hp:50, def:15, atk:-3 }, spells:["Unbreakable","Taunt","Stonewall"] },
      GLADIATOR:  { name:"Gladiator",  icon:"🗡️", desc:"Dual-wield crit maniac. +15% crit, +20% ATK.",
        stats:{ atk:12, crit:15, spd:3 }, spells:["Dual Strike","Arena Roar","Coliseum"] },
      WARLORD:    { name:"Warlord",    icon:"👑", desc:"Commander of war. Passive buffs allies/self.",
        stats:{ atk:6, def:6, mana:30 }, spells:["Rallying Cry","Banner of War","Conquest"] },
    },
  },
  MAGE: {
    name: "Mage", icon: "🔮", color: "#3b82f6",
    desc: "Master of arcane destruction. Devastating spell power.",
    stats: { hp: 90, mana: 200, atk: 14, def: 7, spd: 9, crit: 15 },
    passives: ["Arcane Mastery: Spells +25% DMG", "Mana Shield: 30% dmg absorbed"],
    spells: ["Fireball","Ice Lance","Chain Lightning","Arcane Missile","Meteor"],
    startWeapon: "w_staff1",
    subclasses: {
      ARCHMAGE:    { name:"Archmage",    icon:"🌟", desc:"Pure arcane. +40% spell damage, +100 max mana.",
        stats:{ mana:100, crit:8 }, spells:["Arcane Explosion","Time Warp","Mana Storm"] },
      PYROMANCER:  { name:"Pyromancer",  icon:"🔥", desc:"Fire specialist. All fire spells burn + 30% stronger.",
        stats:{ mana:60, atk:4 }, spells:["Phoenix Dive","Volcano","Immolate"] },
      CRYOMANCER:  { name:"Cryomancer",  icon:"❄️", desc:"Ice lord. Freeze chance doubled, +DEF from cold armor.",
        stats:{ def:8, mana:40 }, spells:["Glacial Spike","Absolute Zero","Frost Nova"] },
    },
  },
  ROGUE: {
    name: "Rogue", icon: "🗡️", color: "#22c55e",
    desc: "Deadly assassin. Strikes from shadows with lethal precision.",
    stats: { hp: 110, mana: 90, atk: 28, def: 9, spd: 14, crit: 35 },
    passives: ["Shadowstrike: First hit always crits", "Evasion: 20% dodge chance"],
    spells: ["Backstab","Poison Blade","Smoke Bomb","Fan of Knives","Death Mark"],
    startWeapon: "w_dagger1",
    subclasses: {
      ASSASSIN:   { name:"Assassin",   icon:"🎯", desc:"Guaranteed crit from stealth. +50% crit damage.",
        stats:{ crit:20, atk:8 }, spells:["Shadow Kill","Vanish","Execute"] },
      DUELIST:    { name:"Duelist",    icon:"⚔️", desc:"Parry master. 35% to reflect melee attacks.",
        stats:{ spd:6, def:8 }, spells:["Riposte","Blade Dance","Flurry"] },
      TRICKSTER:  { name:"Trickster",  icon:"🎭", desc:"Chaos agent. Randomly curses, poisons, or charms.",
        stats:{ spd:3, mana:50 }, spells:["Bamboozle","Mirror Image","Jester's Gift"] },
    },
  },
  PALADIN: {
    name: "Paladin", icon: "🛡️", color: "#f59e0b",
    desc: "Holy warrior. Balance of offense, defense, and divine healing.",
    stats: { hp: 130, mana: 110, atk: 18, def: 20, spd: 7, crit: 12 },
    passives: ["Holy Aura: +15 HP regen/turn", "Divine Shield: Block 1 fatal hit"],
    spells: ["Holy Strike","Smite","Consecrate","Divine Heal","Judgment"],
    startWeapon: "w_sword1",
    subclasses: {
      CRUSADER:    { name:"Crusader",    icon:"⚔️", desc:"Holy warrior. +40% vs. undead/demons, smites crit.",
        stats:{ atk:10, hp:30 }, spells:["Crusader's Charge","Sacred Strike","Holy Avenger"] },
      TEMPLAR:     { name:"Templar",     icon:"🛡️", desc:"Divine tank. +Healing effectiveness, +DEF.",
        stats:{ def:12, hp:60 }, spells:["Lay on Hands","Aegis","Guardian Angel"] },
      INQUISITOR:  { name:"Inquisitor",  icon:"🔥", desc:"Zealot. Hunts heretics, ignores resistances.",
        stats:{ atk:7, crit:8, mana:30 }, spells:["Sanctified Flame","Banish","Excommunicate"] },
    },
  },
  NECROMANCER: {
    name: "Necromancer", icon: "💀", color: "#8b5cf6",
    desc: "Master of death and undead. Drains life and summons minions.",
    stats: { hp: 95, mana: 180, atk: 16, def: 8, spd: 8, crit: 20 },
    passives: ["Death Pact: 20% chance to revive on death", "Soul Harvest: Gain mana on kill"],
    spells: ["Death Bolt","Soul Drain","Raise Dead","Bone Nova","Lich Form"],
    startWeapon: "w_staff1",
    subclasses: {
      SUMMONER:    { name:"Summoner",    icon:"👥", desc:"Commands minions. Can have 3 active.",
        stats:{ mana:80 }, spells:["Summon Skeleton","Summon Ghoul","Army of Bones"] },
      BLOODMAGE:   { name:"Blood Mage",  icon:"🩸", desc:"Spends HP as mana. +50% damage per HP missing %.",
        stats:{ hp:40, mana:-40 }, spells:["Blood Sacrifice","Hemorrhage","Crimson Bath"] },
      DEATHKNIGHT: { name:"Death Knight",icon:"🗡️", desc:"Melee necro. Heals from kills, wields two-handers.",
        stats:{ atk:12, def:6 }, spells:["Death Grip","Unholy Strike","Apocalypse"] },
    },
  },
  BERSERKER: {
    name: "Berserker", icon: "🪓", color: "#dc2626",
    desc: "Rage-fueled destroyer. Gets stronger as HP drops.",
    stats: { hp: 160, mana: 40, atk: 30, def: 10, spd: 11, crit: 20 },
    passives: ["Blood Rage: ATK doubles below 25% HP", "Rampage: No mana cost at low HP"],
    spells: ["Savage Strike","Frenzy","Blood Thirst","Earthquake","Ragnarok"],
    startWeapon: "w_axe1",
    subclasses: {
      WARLOCK:    { name:"Warlock",    icon:"🔥", desc:"Rage-casting hybrid. Attacks buff spell dmg.",
        stats:{ mana:100, crit:5 }, spells:["Demon Fire","Pact","Chaos Bolt"] },
      REAVER:     { name:"Reaver",     icon:"⚡", desc:"Speed berserker. Extra turn after kill.",
        stats:{ spd:8, atk:4 }, spells:["Blitz","Bloodrush","Slaughter"] },
      TITAN:      { name:"Titan",      icon:"🗿", desc:"Colossal. HP doubled, all damage +20%.",
        stats:{ hp:100, atk:5, def:8 }, spells:["Colossal Smash","Titanic Rage","World Breaker"] },
    },
  },
  RANGER: {
    name: "Ranger", icon: "🏹", color: "#10b981",
    desc: "Swift hunter. Attacks from range with deadly accuracy.",
    stats: { hp: 105, mana: 100, atk: 24, def: 11, spd: 13, crit: 28 },
    passives: ["Eagle Eye: +15% crit damage", "Kiting: Never takes damage first"],
    spells: ["Arrow Rain","Piercing Shot","Trap","Barrage","Sniper Shot"],
    startWeapon: "w_bow1",
    subclasses: {
      MARKSMAN:   { name:"Marksman",   icon:"🎯", desc:"Sniper specialist. +50% crit dmg, +range.",
        stats:{ crit:15, atk:8 }, spells:["Headshot","Ballista","Kill Shot"] },
      BEASTMASTER:{ name:"Beastmaster",icon:"🐺", desc:"Tames pets. Companion fights alongside you.",
        stats:{ hp:30, mana:30 }, spells:["Call Beast","Pack Tactics","Wild Charge"] },
      TRAPPER:    { name:"Trapper",    icon:"🪤", desc:"Master of traps. Stack 3 traps per fight.",
        stats:{ spd:4, mana:40 }, spells:["Bear Trap","Explosive Snare","Tripwire"] },
    },
  },
  SORCERER: {
    name: "Sorcerer", icon: "✨", color: "#06b6d4",
    desc: "Pure elemental power. Inflicts status effects on every spell.",
    stats: { hp: 85, mana: 220, atk: 12, def: 6, spd: 10, crit: 22 },
    passives: ["Elemental Overload: 50% status chance", "Mana Surge: Cast 2 spells/turn"],
    spells: ["Blizzard","Inferno","Void Bolt","Thunderstorm","Reality Tear"],
    startWeapon: "w_staff1",
    subclasses: {
      ELEMENTALIST:{ name:"Elementalist",icon:"🌪️", desc:"All elements. Elemental combos trigger bonus dmg.",
        stats:{ mana:50 }, spells:["Elemental Fury","Prismatic Blast","Maelstrom"] },
      STORMCALLER:{ name:"Stormcaller", icon:"⛈️", desc:"Lightning mastery. Chains on crit.",
        stats:{ spd:4, crit:10 }, spells:["Lightning Surge","Storm Lord","Tempest"] },
      VOIDCALLER: { name:"Voidcaller",  icon:"🌀", desc:"Void specialist. Ignores all resist.",
        stats:{ mana:80, crit:5 }, spells:["Void Rift","Null Field","Oblivion"] },
    },
  },
};

// ── CLASS PROGRESSION HELPERS ──
export const SUBCLASS_UNLOCK_LEVEL = 20;

export function getClassSpells(cls, subclass) {
  const base = CLASSES[cls]?.spells || [];
  const sub = subclass ? CLASSES[cls]?.subclasses?.[subclass]?.spells || [] : [];
  return [...base, ...sub];
}

export function getSubclassBonus(cls, subclass) {
  if (!cls || !subclass) return { hp:0, mana:0, atk:0, def:0, spd:0, crit:0 };
  return CLASSES[cls]?.subclasses?.[subclass]?.stats || { hp:0, mana:0, atk:0, def:0, spd:0, crit:0 };
}

export const ALL_SUBCLASSES = Object.entries(CLASSES).flatMap(([cls, cd]) =>
  Object.entries(cd.subclasses || {}).map(([sub, sd]) => ({ cls, sub, ...sd }))
);
