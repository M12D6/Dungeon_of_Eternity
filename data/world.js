// ═══════════════════════════════════════════════════════════════
//  WORLD — BIOMES, WEATHER, TIME-OF-DAY
// ═══════════════════════════════════════════════════════════════
export const BIOMES = {
  DUNGEON: {
    id:"DUNGEON", name:"Stone Dungeon", icon:"🏰",
    wall:"#0a0a14", floor:"#1a1a28", accent:"#2d2d3d",
    desc:"Cold stone corridors. The classic dungeon crawl.",
    effects: { }, // neutral
    enemies:["goblin","rat","spider","imp","skeleton","orc","zombie","bat","slime"],
    minFloor:1,
  },
  CAVERN: {
    id:"CAVERN", name:"Crystal Caverns", icon:"💎",
    wall:"#1e1b4b", floor:"#221a3d", accent:"#4c1d95",
    desc:"Glowing crystals line the damp cavern walls.",
    effects: { manaRegen: 1.5 },
    enemies:["spider","bat","slime","mushroom","kobold","basilisk","cave_troll"],
    minFloor:2,
  },
  FOREST: {
    id:"FOREST", name:"Sunken Forest", icon:"🌲",
    wall:"#14532d", floor:"#1a3a24", accent:"#16a34a",
    desc:"Twisted roots grip crumbled ruins. Nature reclaims all.",
    effects: { hpRegen: 1.2 },
    enemies:["gnoll","spider","witch","poison_elf","treant","bee_swarm","wolfkin"],
    minFloor:3,
  },
  SWAMP: {
    id:"SWAMP", name:"Blightmoor", icon:"🌫️",
    wall:"#064e3b", floor:"#134e4a", accent:"#0f766e",
    desc:"Toxic fumes rise from stagnant waters. Everything rots.",
    effects: { poisonChance: 0.15, hpRegen: 0.5 },
    enemies:["zombie","mushroom","banshee","plague_rat","bog_hag","snake_mire"],
    minFloor:4,
  },
  VOLCANO: {
    id:"VOLCANO", name:"Ember Depths", icon:"🌋",
    wall:"#7f1d1d", floor:"#431a1a", accent:"#dc2626",
    desc:"Lava flows beneath cracked stone. The heat is oppressive.",
    effects: { burnChance: 0.15, fireResist: 0.5 },
    enemies:["elemental","salamander","magma_hound","fire_imp","lava_golem"],
    minFloor:5,
  },
  FROZEN: {
    id:"FROZEN", name:"Icebound Halls", icon:"❄️",
    wall:"#0c4a6e", floor:"#164e63", accent:"#60a5fa",
    desc:"Ancient ice preserves forgotten horrors.",
    effects: { freezeChance: 0.12, spdMult: 0.9 },
    enemies:["ice_troll","frost_wraith","yeti","ice_mage","winter_wolf"],
    minFloor:5,
  },
  NECROPOLIS: {
    id:"NECROPOLIS", name:"City of the Dead", icon:"🪦",
    wall:"#1e1b2e", floor:"#1a1a2e", accent:"#64748b",
    desc:"Rows of silent tombs. The dead do not stay buried.",
    effects: { undeadBonus: 1.3 },
    enemies:["skeleton","zombie","wraith","lich","banshee","necromancer","bone_lord"],
    minFloor:6,
  },
  CATHEDRAL: {
    id:"CATHEDRAL", name:"Fallen Cathedral", icon:"⛪",
    wall:"#fbbf2422", floor:"#fef3c7", accent:"#fbbf24",
    desc:"Sacred grounds corrupted. Angels and demons clash.",
    effects: { holyDmg: 1.3, shrinePower: 2.0 },
    enemies:["corrupt_angel","fallen_priest","hellhound","demon","seraph"],
    minFloor:8,
  },
  ABYSS: {
    id:"ABYSS", name:"The Abyss", icon:"🌑",
    wall:"#020617", floor:"#0f172a", accent:"#581c87",
    desc:"Where reality breaks down. Colors lose meaning.",
    effects: { voidDmg: 1.3, critChance: 0.05 },
    enemies:["shadow","abomination","void_wraith","eldritch","eye_tyrant"],
    minFloor:10,
  },
  SKYHOLD: {
    id:"SKYHOLD", name:"Skyhold Ruins", icon:"🏛️",
    wall:"#1e3a5f", floor:"#1e40af33", accent:"#60a5fa",
    desc:"Floating ruins in the high clouds.",
    effects: { spdMult: 1.15 },
    enemies:["gryphon","storm_eagle","cloud_giant","sky_ranger","wyvern"],
    minFloor:7,
  },
  MECHANICAL: {
    id:"MECHANICAL", name:"Clockwork Halls", icon:"⚙️",
    wall:"#44403c", floor:"#292524", accent:"#f59e0b",
    desc:"Gears grind eternally. Built by forgotten artisans.",
    effects: { trapChance: 0.2 },
    enemies:["clockwork","iron_sentry","steamgolem","construct","cogspider"],
    minFloor:9,
  },
  UNDERWATER: {
    id:"UNDERWATER", name:"Drowned Depths", icon:"🌊",
    wall:"#0c4a6e", floor:"#164e63", accent:"#06b6d4",
    desc:"Flooded ruins. Breathe shallow — they hunt.",
    effects: { spdMult: 0.85, lightningDmg: 1.4 },
    enemies:["merrow","deep_one","kraken_spawn","drowned","hydra"],
    minFloor:8,
  },
  HELL: {
    id:"HELL", name:"Inferno Pits", icon:"😈",
    wall:"#7f1d1d", floor:"#450a0a", accent:"#ef4444",
    desc:"The deepest punishment. Nothing is saved here.",
    effects: { burnChance: 0.25, darkDmg: 1.3 },
    enemies:["demon","hellhound","imp","tormentor","archdemon","pit_fiend"],
    minFloor:12,
  },
  CELESTIAL: {
    id:"CELESTIAL", name:"Celestial Court", icon:"🌟",
    wall:"#fef9c3", floor:"#fef08a33", accent:"#fde047",
    desc:"Gold-paved roads of heaven, now contested.",
    effects: { holyDmg: 1.5, hpRegen: 1.5 },
    enemies:["seraph","archangel","radiant_knight","cherub","throne_angel"],
    minFloor:15,
  },
  VOID: {
    id:"VOID", name:"Void Between", icon:"🌀",
    wall:"#030712", floor:"#0f0a1e", accent:"#8b5cf6",
    desc:"Beyond space and time. The impossible lurks.",
    effects: { voidDmg: 1.5, allResist: 0.7 },
    enemies:["void_wraith","eldritch","cosmic_horror","null_being","elder_god"],
    minFloor:18,
  },
  CRYSTAL_GARDEN: {
    id:"CRYSTAL_GARDEN", name:"Crystal Garden", icon:"🌸",
    wall:"#fae8ff", floor:"#f5d0fe33", accent:"#e879f9",
    desc:"A surreal dreamscape of living crystal flora.",
    effects: { manaRegen: 2.0, charmChance: 0.1 },
    enemies:["crystal_sprite","faerie","bloom_beast","mirror_wisp","dream_weaver"],
    minFloor:11,
  },
};

export const BIOME_ORDER = Object.keys(BIOMES);

export function biomeForFloor(floor) {
  // Rotate through biomes as we descend
  const avail = BIOME_ORDER.filter(id => BIOMES[id].minFloor <= floor);
  if (avail.length === 0) return "DUNGEON";
  // Every 3 floors swap biome, with some variance
  const idx = Math.floor((floor - 1) / 2 + Math.random() * 2) % avail.length;
  return avail[idx];
}

// ═══════════════════════════════════════════════════════════════
//  WEATHER
// ═══════════════════════════════════════════════════════════════
export const WEATHER = {
  CLEAR:     { id:"CLEAR",     name:"Clear",     icon:"☀️", desc:"Normal conditions.", effects:{} },
  RAIN:      { id:"RAIN",      name:"Rainfall",  icon:"🌧️", desc:"Fire −30%, Lightning +30%.", effects:{fireDmg:0.7,lightningDmg:1.3} },
  STORM:     { id:"STORM",     name:"Storm",     icon:"⛈️", desc:"Lightning +60%, chance to stun.", effects:{lightningDmg:1.6,stunChance:0.1} },
  FOG:       { id:"FOG",       name:"Heavy Fog", icon:"🌫️", desc:"+15% dodge both sides, range hits 70%.", effects:{dodgeAll:0.15} },
  BLIZZARD:  { id:"BLIZZARD",  name:"Blizzard",  icon:"🌨️", desc:"Ice +40%, SPD −20%.", effects:{iceDmg:1.4,spdMult:0.8} },
  HEATWAVE:  { id:"HEATWAVE",  name:"Heatwave",  icon:"🔥", desc:"Fire +40%, MP regen −50%.", effects:{fireDmg:1.4,manaRegen:0.5} },
  ECLIPSE:   { id:"ECLIPSE",   name:"Eclipse",   icon:"🌑", desc:"Dark +50%, Holy −30%.", effects:{darkDmg:1.5,holyDmg:0.7} },
  AURORA:    { id:"AURORA",    name:"Aurora",    icon:"🌌", desc:"Arcane +50%, crits doubled.", effects:{arcaneDmg:1.5,critMult:1.25} },
  BLOOD_MOON:{ id:"BLOOD_MOON",name:"Blood Moon",icon:"🌕", desc:"All enemies +25% ATK, +drops.", effects:{enemyAtk:1.25,lootBonus:1.5} },
};

export const WEATHER_LIST = Object.keys(WEATHER);

export function rollWeather(floor) {
  if (floor < 3) return "CLEAR";
  const pool = floor > 10
    ? ["CLEAR","RAIN","STORM","FOG","BLIZZARD","HEATWAVE","ECLIPSE","AURORA","BLOOD_MOON"]
    : ["CLEAR","CLEAR","RAIN","FOG","STORM","HEATWAVE","BLIZZARD"];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════════════════
//  TIME OF DAY
// ═══════════════════════════════════════════════════════════════
export const TIME_OF_DAY = {
  DAWN:  { id:"DAWN",  name:"Dawn",  icon:"🌅", tint:"#fde68a33", desc:"Holy dmg +20%." , effects:{holyDmg:1.2} },
  DAY:   { id:"DAY",   name:"Day",   icon:"☀️", tint:"#fef3c733", desc:"Normal conditions.", effects:{} },
  DUSK:  { id:"DUSK",  name:"Dusk",  icon:"🌆", tint:"#f97316aa", desc:"Stealth +20%.", effects:{dodgeAll:0.1} },
  NIGHT: { id:"NIGHT", name:"Night", icon:"🌙", tint:"#1e1b4baa", desc:"Undead +30% HP, Dark dmg +25%.", effects:{darkDmg:1.25,undeadBonus:1.3} },
  WITCHING:{id:"WITCHING",name:"Witching Hour",icon:"🌑", tint:"#581c87aa", desc:"All spells cost 50% MP. Enemies aggressive.", effects:{manaCost:0.5,enemyAtk:1.2} },
};

export const TIME_ORDER = ["DAWN","DAY","DUSK","NIGHT","WITCHING"];

export function nextTime(t) {
  const i = TIME_ORDER.indexOf(t);
  return TIME_ORDER[(i + 1) % TIME_ORDER.length];
}
