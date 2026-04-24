
    console.log("Dungeon of Eternity: Babel script starting...");





const { useState, useEffect, useRef, useCallback, useMemo } = React;









const RARITY = {
  COMMON:    { name: "Common",    color: "#9ca3af", glow: "#9ca3af33", weight: 100, mult: 1.0 },
  UNCOMMON:  { name: "Uncommon",  color: "#22c55e", glow: "#22c55e44", weight: 50,  mult: 1.4 },
  RARE:      { name: "Rare",      color: "#3b82f6", glow: "#3b82f655", weight: 22,  mult: 2.0 },
  EPIC:      { name: "Epic",      color: "#a855f7", glow: "#a855f766", weight: 9,   mult: 3.0 },
  LEGENDARY: { name: "Legendary", color: "#f97316", glow: "#f9731677", weight: 3,   mult: 4.5 },
  MYTHIC:    { name: "Mythic",    color: "#ef4444", glow: "#ef444488", weight: 1,   mult: 12.0 }, // Buffed mythic for endgame
  UNIQUE:    { name: "Unique",    color: "#eab308", glow: "#eab30888", weight: 0.5, mult: 10.0 },
  SET:       { name: "Set",       color: "#14b8a6", glow: "#14b8a688", weight: 0.8, mult: 8.5 },
  CURSED:    { name: "Cursed",    color: "#7c2d12", glow: "#7c2d1288", weight: 2,   mult: 7.0 },
};


const K_CONSTANT = 120;  // Stat scaling softness
const C_CONSTANT = 100;  // Defense mitigation curve
const EXP_CURVE = 1.5;   // 50% increase per level
const DAMPENER = 0.95;   // Global power speed governor
const DAMAGE_CAP_PCT = 0.35; // Max 35% HP per turn

const RARITY_ORDER = ["COMMON","UNCOMMON","RARE","EPIC","LEGENDARY","MYTHIC","UNIQUE","SET","CURSED"];


function rollRarityForDungeon(dungeonTier = 1, luck = 0) {

  const tier = Math.max(1, Math.min(8, dungeonTier));

  const TIER_WEIGHTS = [
    [700, 250, 45, 4,   1,   0  ], // Tier 1: 70/25/4.5/0.4/0.1%
    [650, 275, 60, 12,  3,   0  ], // Tier 2
    [580, 275, 105,32,  7,   1  ], // Tier 3
    [510, 275, 145,55,  13,  2  ], // Tier 4
    [440, 270, 195,73,  19,  3  ], // Tier 5
    [370, 270, 240,91,  25,  4  ], // Tier 6
    [310, 260, 270,120, 33,  7  ], // Tier 7
    [250, 250, 290,155, 43,  12 ], // Tier 8
  ];
  const weights = [...TIER_WEIGHTS[tier - 1]];

  const luckBonus = Math.min(luck, 80);
  weights[0] = Math.max(50, weights[0] - luckBonus * 2);
  weights[2] += Math.floor(luckBonus * 0.8);
  weights[3] += Math.floor(luckBonus * 0.4);

  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  const keys = ["COMMON","UNCOMMON","RARE","EPIC","LEGENDARY","MYTHIC"];
  for (let i = 0; i < keys.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return keys[i];
  }
  return "COMMON";
}

const DIFFICULTIES = {
  EASY:      { name: "Easy",      icon: "xx", levelOffset: 0,  statMult: 0.7, lootMult: 0.5, expMult: 0.8, color: "#22c55e" },
  NORMAL:    { name: "Normal",    icon: "xx", levelOffset: 7,  statMult: 1.0, lootMult: 1.0, expMult: 1.0, color: "#eab308" },
  HARD:      { name: "Hard",      icon: "xx", levelOffset: 14, statMult: 1.5, lootMult: 1.5, expMult: 1.5, color: "#f97316" },
  INSANE:    { name: "Insane",    icon: "x ", levelOffset: 21, statMult: 2.5, lootMult: 2.5, expMult: 2.5, color: "#ef4444" },
  NIGHTMARE: { name: "Nightmare", icon: "x", levelOffset: 29, statMult: 5.0, lootMult: 5.0, expMult: 5.0, color: "#a855f7" },
};
function getDungeonDifficultyBrackets(dungeon) {


  return Object.entries(DIFFICULTIES).map(([key, d]) => ({
    key,
    ...d,
    requiredLevel: dungeon.requiredLevel + d.levelOffset
  }));
}


function rollRarity(floor = 1, luck = 0) {
  const tier = Math.min(8, Math.max(1, Math.floor(floor / 5) + 1));
  return rollRarityForDungeon(tier, luck);
}




const DUNGEONS = [
  {
    id: "sewer_depths",
    name: "Sewer Depths",
    subtitle: "The Starting Grounds",
    icon: "xa",
    requiredLevel: 1,
    tier: 1,
    maxFloors: 15,
    biome: "DUNGEON",
    colors: { bg: "linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 100%)", accent: "#22c55e", glow: "#22c55e33" },
    desc: "Fetid sewers beneath the city. Goblins, rats, and worse lurk in the dark.",
    enemies: ["goblin","rat","spider","imp","zombie","bat","slime","giantfrog","rat_swarm","shade","worm","skeleton_r"],
    boss: "boss_goblin_king",
    lootTags: ["common_weapon","basic_armor","starter"],
    lootItemIds: ["w_stick","w_knife","w_club","w_sword1","w_axe1","w_bow1","w_staff1","w_dagger1","w_mace1","a_rags","a_leather","a_padded","h_cap","h_cowl","b_sandals","r_copper","r_silver","p_hp","p_mana","mat_iron","mat_leather","mat_wood"],
    musicTheme: "dungeon_dark",
  },
  {
    id: "haunted_catacombs",
    name: "Haunted Catacombs",
    subtitle: "Where the Dead Walk",
    icon: "x",
    requiredLevel: 35,
    tier: 2,
    maxFloors: 20,
    biome: "NECROPOLIS",
    colors: { bg: "linear-gradient(135deg, #0a0a14 0%, #1a0a2e 100%)", accent: "#8b5cf6", glow: "#8b5cf633" },
    desc: "Ancient burial halls overrun by undead. Dark magic seeps from every stone.",
    enemies: ["skeleton","orc","witch","ghoul","banshee","specter","necromancer","wraith","mummy","lich"],
    boss: "boss_spider_q",
    lootItemIds: ["w_sword2","w_axe2","w_staff2","w_wand1","w_rapier","w_scimitar","a_chain","a_ringmail","a_mage_robe","h_iron","h_wizard","b_leather","r_vitality","r_clarity","n_thread","p_big_hp","p_big_mana","mat_silver","mat_spider_s","mat_soul"],
    musicTheme: "dungeon_eerie",
  },
  {
    id: "sunken_forest",
    name: "Sunken Forest",
    subtitle: "Nature's Dark Reclaim",
    icon: "xR",
    requiredLevel: 70,
    tier: 3,
    maxFloors: 20,
    biome: "FOREST",
    colors: { bg: "linear-gradient(135deg, #0a1a0a 0%, #14290a 100%)", accent: "#10b981", glow: "#10b98133" },
    desc: "Ancient woodland corrupted by foul magic. Beasts and druids lurk between gnarled roots.",
    enemies: ["gnoll","mushroom","kobold","dryad","harpy","werewolf","dire_wolf","troll","mantis","hydra"],
    boss: "boss_werewolf",
    lootItemIds: ["w_flamebrand","w_frostfang","w_shadowstk","w_twin","w_elvenbow","w_venomstk","a_iron","a_bone","a_elven","a_plate","h_horned","h_circlet","b_iron","r_power","r_mana","r_guardian","n_ruby","n_emerald","mat_troll_h","mat_ebony","gem_ruby_s","gem_em_s"],
    musicTheme: "dungeon_nature",
  },
  {
    id: "ember_caverns",
    name: "Ember Caverns",
    subtitle: "Forge of the Fire Lords",
    icon: "xR9",
    requiredLevel: 105,
    tier: 4,
    maxFloors: 25,
    biome: "VOLCANO",
    colors: { bg: "linear-gradient(135deg, #1a0505 0%, #2a0a00 100%)", accent: "#ef4444", glow: "#ef444433" },
    desc: "Molten tunnels beneath a dormant volcano. Fire elementals and salamanders guard ancient treasures.",
    enemies: ["fire_imp","elemental","salamander","wyvern","golem","chimera","phoenix","golem_obs","ancient_dragon"],
    boss: "boss_fire_lord",
    lootItemIds: ["w_obsidian","w_chaos","w_thunderaxe","w_soulreap","w_runestaff","a_flame_mail","a_shadow","a_mithril","h_crown","b_shadow","g_iron","r_arcane","r_warrior","n_sapphire","n_amber","mat_dragon_s","mat_fire_es","gem_ruby_m","gem_dia_s","rune_fire","cat_upgrade"],
    musicTheme: "dungeon_fire",
  },
  {
    id: "glacial_fortress",
    name: "Glacial Fortress",
    subtitle: "Tomb of the Frost Giants",
    icon: " ",
    requiredLevel: 140,
    tier: 5,
    maxFloors: 25,
    biome: "FROZEN",
    colors: { bg: "linear-gradient(135deg, #050f1a 0%, #0a1a2e 100%)", accent: "#60a5fa", glow: "#60a5fa33" },
    desc: "A glacier fortress where ancient frost giants were entombed. Ice elementals patrol the frozen halls.",
    enemies: ["ice_imp","ice_elem","wendigo","yeti","dragon_wh","earth_elem","behemoth","kraken"],
    boss: "boss_ice_queen",
    lootItemIds: ["w_moonblade","w_sunspear","w_quicksilver","w_iceblade","w_dragonbow","w_voidstaff","a_frost_mail","a_light_robe","h_archmage","b_winged","g_shadow","s_aegis","r_sorcerer","n_dragon","mat_ice_es","gem_saph_m","gem_em_m","rune_ice","rune_litn","cat_enchant"],
    musicTheme: "dungeon_ice",
  },
  {
    id: "necropolis",
    name: "The Necropolis",
    subtitle: "City of the Eternal Dead",
    icon: "x",
    requiredLevel: 180,
    tier: 6,
    maxFloors: 30,
    biome: "ABYSS",
    colors: { bg: "linear-gradient(135deg, #080010 0%, #12001e 100%)", accent: "#a855f7", glow: "#a855f733" },
    desc: "A vast necropolis where demon lords reign. Legendary artifacts are buried with ancient kings.",
    enemies: ["vampire","abomination","shadow","revenant","elder_demon","void_wraith","lich","demon","djinn"],
    boss: "boss_lich_king",
    lootItemIds: ["w_dragonslyr","w_excalibur","w_deathscyth","w_godslayer","w_mjolnir","w_vampiric","w_lucky","a_dragon","a_divine","a_necro","h_dragon","b_eternal","g_dragon","s_dragonsh","r_ouroboros","n_divine","n_skull_neck","gem_ruby_l","gem_dia_m","rune_dark","rune_holy","cat_reforge"],
    musicTheme: "dungeon_dark2",
  },
  {
    id: "abyss_of_shadows",
    name: "Abyss of Shadows",
    subtitle: "Beyond the Veil of Reality",
    icon: "xR",
    requiredLevel: 220,
    tier: 7,
    maxFloors: 30,
    biome: "VOID",
    colors: { bg: "linear-gradient(135deg, #020008 0%, #08001a 100%)", accent: "#d946ef", glow: "#d946ef33" },
    desc: "A realm where void horrors dwell. Cosmic-tier weapons and armor can be found by the brave.",
    enemies: ["cosmic_horror","void_lord","star_spawn","ender","void_wraith","titan","primordial","seraph"],
    boss: "boss_void_lord",
    lootItemIds: ["w_cosmicbow","w_gungnir","w_artoria","w_starfall","w_mythril","w_backstabber","w_berserker","a_royal","a_titan","h_skullhelm","b_stealth","b_gravityless","g_void","s_voidshield","c_hero","r_sage","n_phoenix_neck","gem_em_p","gem_saph_l","rune_life","rune_power","cat_socket"],
    musicTheme: "dungeon_void",
  },
  {
    id: "divine_citadel",
    name: "The Divine Citadel",
    subtitle: "Heaven's Last Bastion",
    icon: "S",
    requiredLevel: 260,
    tier: 8,
    maxFloors: 35,
    biome: "CELESTIAL",
    colors: { bg: "linear-gradient(135deg, #0a0808 0%, #1a0a00 100%)", accent: "#fbbf24", glow: "#fbbf2433" },
    desc: "The shattered throne of fallen gods. Only the mightiest heroes dare enter. Mythic power awaits.",
    enemies: ["elder_demon","seraph","cosmic_horror","void_lord","primordial","ender","star_spawn"],
    boss: "boss_god",
    lootItemIds: ["w_worldend","w_creation","w_timeblade","w_voidslayer","w_infinity","w_cursed1","w_cursed2","w_cursed3","a_void","a_god_armor","a_phoenix_mail","h_godcrown","b_cosmic","c_hero","r_cosmos","n_godeye","gem_ruby_p","gem_saph_p","gem_em_p","gem_star","rune_chaos","cat_uncurse","mat_god_essence"],
    musicTheme: "dungeon_divine",
  },
];
const DUNGEON_BY_ID = {};
DUNGEONS.forEach(d => { DUNGEON_BY_ID[d.id] = d; });






const STATUS_EFFECTS = {

  BURN:       { name:"Burn",       icon:"x ", color:"#f97316", kind:"dot",  dmgPct:0.08, desc:"Takes fire dmg each turn" },
  POISON:     { name:"Poison",     icon:", color:"#4ade80", kind:"dot",  dmgPct:0.06, desc:"Slow poison drain" },
  BLEED:      { name:"Bleed",      icon:"x", color:"#dc2626", kind:"dot",  dmgPct:0.10, desc:"Bleeds HP each turn" },
  CURSE:      { name:"Curse",      icon:"C", color:"#8b5cf6", kind:"dot",  dmgPct:0.07, desc:"Dark curse eats soul" },
  ACID:       { name:"Acid",       icon:"x", color:"#84cc16", kind:"dot",  dmgPct:0.09, desc:"Acid melts defenses, reduces DEF" },
  PLAGUE:     { name:"Plague",     icon:"x", color:"#a3e635", kind:"dot",  dmgPct:0.12, desc:"Contagious, spreads to allies" },
  DECAY:      { name:"Decay",      icon:"x", color:"#78716c", kind:"dot",  dmgPct:0.08, desc:"Flesh rots   heal reduced 50%" },
  HOLY_FIRE:  { name:"Holy Fire",  icon:"S", color:"#fcd34d", kind:"dot",  dmgPct:0.11, desc:"Divine flame, bypasses DEF" },
  VOID:       { name:"Void",       icon:"xR", color:"#581c87", kind:"dot",  dmgPct:0.10, desc:"Unravels reality" },

  STUN:       { name:"Stun",       icon:"a", color:"#facc15", kind:"control", desc:"Cannot act" },
  FREEZE:     { name:"Freeze",     icon:" ", color:"#60a5fa", kind:"control", desc:"Frozen solid, cannot act" },
  SLEEP:      { name:"Sleep",      icon:"x", color:"#7dd3fc", kind:"control", desc:"Asleep until damaged" },
  PARALYZE:   { name:"Paralyze",   icon:"a", color:"#eab308", kind:"control", desc:"50% chance to skip turn" },
  SILENCE:    { name:"Silence",    icon:"x", color:"#a78bfa", kind:"control", desc:"Cannot cast spells" },
  BLIND:      { name:"Blind",      icon:"x", color:"#1f2937", kind:"control", desc:"50% miss chance" },
  CHARM:      { name:"Charm",      icon:"x", color:"#f472b6", kind:"control", desc:"Attacks its allies" },
  FEAR:       { name:"Fear",       icon:"x", color:"#6b7280", kind:"control", desc:"Flees instead of attacks" },
  CONFUSE:    { name:"Confusion",  icon:"x", color:"#c084fc", kind:"control", desc:"Random target" },
  ROOT:       { name:"Root",       icon:"xR", color:"#16a34a", kind:"control", desc:"Cannot dodge/flee" },

  WEAKEN:     { name:"Weaken",     icon:"!", color:"#64748b", kind:"debuff", desc:"-30% ATK" },
  VULNERABLE: { name:"Vulnerable", icon:"x", color:"#f43f5e", kind:"debuff", desc:"+25% dmg taken" },
  SLOW:       { name:"Slow",       icon:"xR", color:"#06b6d4", kind:"debuff", desc:"-50% SPD" },
  MARK:       { name:"Death Mark", icon:"x", color:"#8b5cf6", kind:"debuff", desc:"Next hit is instant-kill" },
  EXPOSE:     { name:"Expose",     icon:"x}", color:"#e11d48", kind:"debuff", desc:"-50% DEF" },
  DOOM:       { name:"Doom",       icon:", color:"#000000", kind:"debuff", desc:"Dies in 3 turns" },

  ATKBUFF:    { name:"Empower",    icon:"x", color:"#f59e0b", kind:"buff", desc:"+40% ATK" },
  DEFBUFF:    { name:"Bulwark",    icon:"x", color:"#3b82f6", kind:"buff", desc:"+50% DEF" },
  HASTE:      { name:"Haste",      icon:"x", color:"#06b6d4", kind:"buff", desc:"Extra turn 25% chance" },
  REGEN:      { name:"Regen",      icon:"xa", color:"#22c55e", kind:"buff", desc:"+10% HP per turn" },
  BARRIER:    { name:"Barrier",    icon:"x ", color:"#38bdf8", kind:"buff", desc:"Absorbs next hit" },
  REFLECT:    { name:"Reflect",    icon:"x~", color:"#c4b5fd", kind:"buff", desc:"50% dmg reflected" },
  DODGE:      { name:"Evasion",    icon:"x", color:"#a78bfa", kind:"buff", desc:"+50% dodge" },
  STEALTH:    { name:"Stealth",    icon:"xR", color:"#64748b", kind:"buff", desc:"Untargetable 1 turn" },
  LIFESTEAL:  { name:"Lifesteal",  icon:"x", color:"#dc2626", kind:"buff", desc:"Heal 30% of dmg" },
  LUCK:       { name:"Lucky",      icon:"x", color:"#22c55e", kind:"buff", desc:"+15% crit, +loot" },
  BERSERK:    { name:"Berserk",    icon:"x", color:"#dc2626", kind:"buff", desc:"+80% ATK, -40% DEF" },
  HOLY:       { name:"Blessed",    icon:"x!", color:"#fef3c7", kind:"buff", desc:"Immune to debuffs" },
  LICH:       { name:"Lich Form",  icon:"x", color:"#8b5cf6", kind:"buff", desc:"+100% all stats" },
  ASTRAL:     { name:"Astral",     icon:"xRR", color:"#6366f1", kind:"buff", desc:"Phased   immune to physical" },
  FRENZY:     { name:"Frenzy",     icon:"xR9", color:"#b91c1c", kind:"buff", desc:"+60% ATK, -30% DEF" },
  OVERLOAD:   { name:"Overload",   icon:"a", color:"#fbbf24", kind:"buff", desc:"Spells cost 0 MP" },
  SHROUD:     { name:"Shroud",     icon:"xR", color:"#1e1b4b", kind:"buff", desc:"Next attack crits" },
};
const DOT_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="dot").map(([k])=>k);
const CONTROL_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="control").map(([k])=>k);
const BUFF_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="buff").map(([k])=>k);
const DEBUFF_STATUSES = Object.entries(STATUS_EFFECTS).filter(([,v])=>v.kind==="debuff").map(([k])=>k);
function isControl(s)  { return s && STATUS_EFFECTS[s]?.kind === "control"; }
function isDot(s)      { return s && STATUS_EFFECTS[s]?.kind === "dot"; }
function isBuff(s)     { return s && STATUS_EFFECTS[s]?.kind === "buff"; }
function isDebuff(s)   { return s && STATUS_EFFECTS[s]?.kind === "debuff"; }






const SPELLS = {

  Whirlwind:    { icon:"xR", dmg:[40,70],  mana:30, type:"phys",  desc:"Spin dealing dmg to all",  status:null },
  "Shield Bash":{ icon:"x", dmg:[25,45],  mana:20, type:"phys",  desc:"Stuns enemy 1 turn",       status:"STUN" },
  "War Cry":    { icon:"x ", dmg:[0,0],    mana:25, type:"buff",  desc:"+40% ATK for 3 turns",     status:"ATKBUFF" },
  "Blade Storm":{ icon:"a ", dmg:[60,100], mana:45, type:"phys",  desc:"Multi-hit melee flurry",   status:null },
  Deathblow:    { icon:"x", dmg:[100,160],mana:70, type:"phys",  desc:"Massive single strike",    status:null },

  Unbreakable:  { icon:"x", dmg:[0,0],    mana:30, type:"buff",  desc:"Immune to dmg 2 turns",    status:"BARRIER" },
  Taunt:        { icon:"x", dmg:[15,25],  mana:20, type:"phys",  desc:"Forces enemy focus you",   status:"WEAKEN" },
  Stonewall:    { icon:"x", dmg:[0,0],    mana:35, type:"buff",  desc:"+100% DEF for 3 turns",    status:"DEFBUFF" },
  "Dual Strike":{ icon:"x", dmg:[50,90],  mana:30, type:"phys",  desc:"Two rapid strikes",        status:null },
  "Arena Roar": { icon:"x", dmg:[0,0],    mana:25, type:"buff",  desc:"+crit, +ATK",              status:"BERSERK" },
  Coliseum:     { icon:"x", dmg:[120,180],mana:80, type:"phys",  desc:"Gladiator ultimate",       status:null },
  "Rallying Cry":{icon:"x ", dmg:[0,0],    mana:30, type:"buff",  desc:"Heal+buff self",           status:"REGEN" },
  "Banner of War":{icon:"x",dmg:[0,0],    mana:50, type:"buff",  desc:"Flat +stats for fight",    status:"ATKBUFF" },
  Conquest:     { icon:"x", dmg:[90,140], mana:65, type:"phys",  desc:"Royal decree of war",      status:"STUN" },

  Fireball:     { icon:"x ", dmg:[50,80],  mana:30, type:"fire",  desc:"Burning projectile",       status:"BURN" },
  "Ice Lance":  { icon:" ", dmg:[40,70],  mana:25, type:"ice",   desc:"Freezes enemy 1 turn",     status:"FREEZE" },
  "Chain Lightning":{icon:"a",dmg:[55,90],mana:40,type:"lightning",desc:"Chains to hit twice",    status:"STUN" },
  "Arcane Missile":{icon:"x ",dmg:[35,55], mana:20, type:"arcane",desc:"Rapid arcane bolt",        status:null },
  Meteor:       { icon:" ", dmg:[120,200],mana:80, type:"fire",  desc:"Devastating meteor drop",  status:"BURN" },

  "Arcane Explosion":{icon:"x",dmg:[70,120],mana:50,type:"arcane",desc:"Blast of pure arcane",    status:null },
  "Time Warp":  { icon:", dmg:[0,0],    mana:60, type:"buff",  desc:"Extra turn",               status:"HASTE" },
  "Mana Storm": { icon:"xR", dmg:[100,150],mana:90, type:"arcane",desc:"Storm hits all",           status:"SILENCE" },
  "Phoenix Dive":{icon:"x&", dmg:[85,130], mana:55, type:"fire",  desc:"Plunge from sky, burn all",status:"BURN" },
  Volcano:      { icon:"xR9", dmg:[140,220],mana:100,type:"fire",  desc:"Eruption",                 status:"BURN" },
  Immolate:     { icon:"x ", dmg:[30,50],  mana:25, type:"fire",  desc:"Intense burn over time",   status:"BURN" },
  "Glacial Spike":{icon:"x`",dmg:[70,110], mana:40, type:"ice",   desc:"Freeze + pierce",          status:"FREEZE" },
  "Absolute Zero":{icon:" ",dmg:[130,200],mana:95, type:"ice",   desc:"Mass freeze",              status:"FREEZE" },
  "Frost Nova": { icon:"x", dmg:[55,90],  mana:50, type:"ice",   desc:"Radial ice blast",         status:"FREEZE" },

  Backstab:     { icon:"x", dmg:[70,120], mana:30, type:"phys",  desc:"Triple crit from shadow",  status:null },
  "Poison Blade":{icon:",dmg:[30,50],   mana:20, type:"poison",desc:"Poisons for 5 turns",      status:"POISON" },
  "Smoke Bomb": { icon:"x", dmg:[0,0],    mana:25, type:"buff",  desc:"+50% dodge for 2 turns",   status:"DODGE" },
  "Fan of Knives":{icon:"x ",dmg:[45,75],  mana:35, type:"phys",  desc:"Throws 5 blades",          status:"BLEED" },
  "Death Mark": { icon:"x", dmg:[0,0],    mana:50, type:"debuff",desc:"Next hit = instant kill",  status:"MARK" },

  "Shadow Kill":{ icon:"xR", dmg:[130,200],mana:60, type:"phys",  desc:"Silent executioner",       status:null },
  Vanish:       { icon:"x", dmg:[0,0],    mana:35, type:"buff",  desc:"Stealth 2 turns",          status:"STEALTH" },
  Execute:      { icon:"a", dmg:[80,999], mana:55, type:"phys",  desc:"Kills low-HP enemies",     status:null },
  Riposte:      { icon:"x~", dmg:[0,0],    mana:30, type:"buff",  desc:"Reflects melee dmg",       status:"REFLECT" },
  "Blade Dance":{ icon:"x", dmg:[60,100], mana:40, type:"phys",  desc:"Graceful 4-hit combo",     status:null },
  Flurry:       { icon:"x", dmg:[40,70],  mana:25, type:"phys",  desc:"6 rapid jabs",             status:"BLEED" },
  Bamboozle:    { icon:"x}", dmg:[40,70],  mana:30, type:"debuff",desc:"Random status effect",     status:"CONFUSE" },
  "Mirror Image":{icon:"x",dmg:[0,0],     mana:40, type:"buff",  desc:"Decoy absorbs 1 hit",      status:"BARRIER" },
  "Jester's Gift":{icon:"x}",dmg:[50,200], mana:45, type:"phys",  desc:"Wildly variable dmg",      status:null },

  "Holy Strike":{ icon:"S", dmg:[40,65],  mana:25, type:"holy",  desc:"Holy-charged melee",       status:null },
  Smite:        { icon:", dmg:[55,85],  mana:35, type:"holy",  desc:"Divine smite from above",  status:"HOLY_FIRE" },
  Consecrate:   { icon:"xRx", dmg:[30,50],  mana:30, type:"holy",  desc:"Damages+heals each turn",  status:null },
  "Divine Heal":{ icon:"xa", dmg:[-120,-70],mana:40,type:"heal",  desc:"Restore 70-120 HP",        status:null },
  Judgment:     { icon:"a", dmg:[90,150], mana:65, type:"holy",  desc:"Final divine reckoning",   status:null },

  "Crusader's Charge":{icon:"x!",dmg:[70,110],mana:40,type:"holy",desc:"Charging strike",          status:"STUN" },
  "Sacred Strike":{icon:"S",dmg:[85,140], mana:50, type:"holy",  desc:"Guaranteed crit",          status:null },
  "Holy Avenger":{icon:"a ", dmg:[150,220],mana:80, type:"holy",  desc:"Judgment incarnate",       status:null },
  "Lay on Hands":{icon:"x", dmg:[-200,-150],mana:60,type:"heal", desc:"Full heal",                status:"REGEN" },
  Aegis:        { icon:"x ", dmg:[0,0],    mana:35, type:"buff",  desc:"Impenetrable shield",      status:"BARRIER" },
  "Guardian Angel":{icon:"x",dmg:[0,0],   mana:70, type:"buff",  desc:"Revives on next death",    status:"HOLY" },
  "Sanctified Flame":{icon:",dmg:[75,120],mana:45,type:"holy",desc:"Burns evil twice as hard", status:"HOLY_FIRE" },
  Banish:       { icon:"S", dmg:[0,0],    mana:50, type:"holy",  desc:"Removes enemy 1 turn",     status:"SLEEP" },
  Excommunicate:{ icon:"x ", dmg:[100,170],mana:75, type:"holy",  desc:"Destroys the unholy",      status:"CURSE" },

  "Death Bolt": { icon:"x", dmg:[55,90],  mana:30, type:"dark",  desc:"Bolt of necrotic energy",  status:"CURSE" },
  "Soul Drain": { icon:"x", dmg:[40,70],  mana:35, type:"dark",  desc:"Drain HP   mana",          status:null },
  "Raise Dead": { icon:"x", dmg:[0,0],    mana:50, type:"summon",desc:"Summon skeleton minion",   status:null },
  "Bone Nova":  { icon:"x", dmg:[70,110], mana:55, type:"dark",  desc:"Bone shards explode out",  status:"BLEED" },
  "Lich Form":  { icon:"x", dmg:[0,0],    mana:90, type:"buff",  desc:"+100% all stats, 3 turns", status:"LICH" },

  "Summon Skeleton":{icon:"x",dmg:[0,0], mana:45, type:"summon",desc:"Summon pet skeleton",      status:null },
  "Summon Ghoul":{icon:"xx", dmg:[0,0],    mana:55, type:"summon",desc:"Summon pet ghoul",         status:null },
  "Army of Bones":{icon:"a",dmg:[60,100], mana:80, type:"dark",  desc:"Summons and attacks",      status:"FEAR" },
  "Blood Sacrifice":{icon:"x",dmg:[0,0], mana:0,  type:"buff",  desc:"HP   MP exchange",         status:null },
  Hemorrhage:   { icon:"x", dmg:[80,130], mana:45, type:"dark",  desc:"Deep bleeding wound",      status:"BLEED" },
  "Crimson Bath":{icon:"x", dmg:[100,180],mana:70, type:"dark",  desc:"Bathe in blood, heal+dmg", status:"LIFESTEAL" },
  "Death Grip": { icon:"S9", dmg:[60,100], mana:35, type:"dark",  desc:"Pulls and strikes",        status:"ROOT" },
  "Unholy Strike":{icon:"x",dmg:[85,140],mana:45, type:"dark",  desc:"Dark-infused blade",       status:"CURSE" },
  Apocalypse:   { icon:"x", dmg:[180,280],mana:110,type:"dark",  desc:"The end of days",          status:"DOOM" },

  "Savage Strike":{icon:"x ",dmg:[55,95],  mana:20, type:"phys",  desc:"Wild savage attack",       status:null },
  Frenzy:       { icon:"x", dmg:[0,0],    mana:30, type:"buff",  desc:"+60% ATK, -30% DEF",       status:"FRENZY" },
  "Blood Thirst":{icon:"x", dmg:[50,80],  mana:35, type:"phys",  desc:"Heal 50% of dmg dealt",    status:"LIFESTEAL" },
  Earthquake:   { icon:"xR", dmg:[80,130], mana:60, type:"phys",  desc:"Shockwave hits all",       status:"STUN" },
  Ragnarok:     { icon:"xR9", dmg:[150,250],mana:100,type:"phys",  desc:"Apocalyptic destruction",  status:null },

  "Demon Fire": { icon:"x", dmg:[90,140], mana:50, type:"fire",  desc:"Hellish flame",            status:"BURN" },
  Pact:         { icon:"x", dmg:[0,0],    mana:0,  type:"buff",  desc:"HP   massive ATK buff",    status:"BERSERK" },
  "Chaos Bolt": { icon:"xR", dmg:[60,160], mana:45, type:"dark",  desc:"Wildly variable dmg",      status:null },
  Blitz:        { icon:"x", dmg:[70,100], mana:30, type:"phys",  desc:"Strike + extra turn",      status:"HASTE" },
  Bloodrush:    { icon:"x", dmg:[50,80],  mana:25, type:"phys",  desc:"Heal on each hit",         status:"LIFESTEAL" },
  Slaughter:    { icon:"a ", dmg:[130,200],mana:70, type:"phys",  desc:"Butcher everything",       status:"BLEED" },
  "Colossal Smash":{icon:"x",dmg:[100,170],mana:55,type:"phys",  desc:"Titanic blow",             status:"STUN" },
  "Titanic Rage":{icon:"xR9", dmg:[0,0],    mana:60, type:"buff",  desc:"+200% ATK, -50% DEF",      status:"FRENZY" },
  "World Breaker":{icon:"xR",dmg:[200,300],mana:120,type:"phys",  desc:"Shatters reality",         status:null },

  "Arrow Rain": { icon:"x", dmg:[45,75],  mana:35, type:"phys",  desc:"Volley of arrows",         status:null },
  "Piercing Shot":{icon:"~",dmg:[60,100],mana:30, type:"phys",  desc:"Ignores armor",            status:null },
  Trap:         { icon:"x", dmg:[0,0],    mana:25, type:"debuff",desc:"Stuns enemy 2 turns",     status:"STUN" },
  Barrage:      { icon:"x", dmg:[35,55],  mana:40, type:"phys",  desc:"Rapid fire 3 shots",       status:null },
  "Sniper Shot":{ icon:"x}", dmg:[100,180],mana:70, type:"phys",  desc:"High-crit precision shot", status:null },

  Headshot:     { icon:"x}", dmg:[120,200],mana:55, type:"phys",  desc:"Always crits",             status:null },
  Ballista:     { icon:"x", dmg:[150,230],mana:80, type:"phys",  desc:"Siege-level arrow",        status:"STUN" },
  "Kill Shot":  { icon:"x", dmg:[200,300],mana:100,type:"phys",  desc:"Executes low-HP enemies",  status:null },
  "Call Beast": { icon:"x", dmg:[0,0],    mana:40, type:"summon",desc:"Summon wolf companion",    status:null },
  "Pack Tactics":{icon:"x", dmg:[0,0],    mana:35, type:"buff",  desc:"+ATK w/ pet",              status:"ATKBUFF" },
  "Wild Charge":{ icon:"x", dmg:[90,140], mana:45, type:"phys",  desc:"Beast charges target",     status:"STUN" },
  "Bear Trap":  { icon:"x", dmg:[40,70],  mana:30, type:"phys",  desc:"Root + bleed",             status:"ROOT" },
  "Explosive Snare":{icon:"x",dmg:[100,150],mana:55,type:"fire",desc:"Fiery trap blast",         status:"BURN" },
  Tripwire:     { icon:"x", dmg:[30,50],  mana:25, type:"phys",  desc:"Stuns + tumble",           status:"STUN" },

  Blizzard:     { icon:"xR", dmg:[65,105], mana:50, type:"ice",   desc:"Freezes + mass ice dmg",   status:"FREEZE" },
  Inferno:      { icon:"x ", dmg:[80,130], mana:60, type:"fire",  desc:"Engulf in flames",         status:"BURN" },
  "Void Bolt":  { icon:"xR", dmg:[70,115], mana:45, type:"dark",  desc:"Piercing void energy",     status:"VOID" },
  Thunderstorm: { icon:":", dmg:[90,140], mana:65, type:"lightning",desc:"Storm of lightning",    status:"STUN" },
  "Reality Tear":{icon:"xRR", dmg:[160,260],mana:110,type:"arcane",desc:"Tear reality apart",       status:null },

  "Elemental Fury":{icon:"x ",dmg:[95,140],mana:60,type:"fire",   desc:"All elements swirl",       status:"BURN" },
  "Prismatic Blast":{icon:"xR",dmg:[100,160],mana:70,type:"arcane",desc:"Random element",          status:null },
  Maelstrom:    { icon:"xR", dmg:[120,200],mana:90, type:"lightning",desc:"Storm + ice + fire",    status:"STUN" },
  "Lightning Surge":{icon:"a",dmg:[80,140],mana:50,type:"lightning",desc:"Chains 3 times",         status:"STUN" },
  "Storm Lord": { icon:":", dmg:[0,0],    mana:80, type:"buff",  desc:"Storm aura all turn",      status:"OVERLOAD" },
  Tempest:      { icon:"xR", dmg:[130,200],mana:95, type:"lightning",desc:"Violent storm",         status:"STUN" },
  "Void Rift":  { icon:"xR", dmg:[100,160],mana:65, type:"dark",  desc:"Tear in space",            status:"VOID" },
  "Null Field": { icon:", dmg:[0,0],    mana:55, type:"debuff",desc:"Silence+disarm",          status:"SILENCE" },
  Oblivion:     { icon:"xRR", dmg:[220,330],mana:130,type:"dark",  desc:"Erase from existence",     status:"DOOM" },

  "Power Strike":{icon:"x", dmg:[50,80],  mana:15, type:"phys",  desc:"Heavy melee",              status:null },
  "Quick Shot":{ icon:"x", dmg:[35,60],   mana:10, type:"phys",  desc:"Fast attack",              status:null },
  "Ember Shot": { icon:"x ", dmg:[40,70],  mana:20, type:"fire",  desc:"Small fire attack",        status:"BURN" },
  "Ice Shard":  { icon:" ", dmg:[30,55],  mana:18, type:"ice",   desc:"Small ice attack",         status:null },
  "Spark":      { icon:"a", dmg:[35,60],  mana:15, type:"lightning",desc:"Small shock",            status:null },
  "Mend":       { icon:"x", dmg:[-50,-30],mana:20, type:"heal",  desc:"Light heal",               status:null },
  "Major Heal": { icon:"xa", dmg:[-180,-120],mana:55,type:"heal", desc:"Strong heal",              status:"REGEN" },
  "Cleanse":    { icon:"S", dmg:[0,0],    mana:30, type:"buff",  desc:"Removes debuffs",          status:"HOLY" },
  "Battle Trance":{icon:"x}!",dmg:[0,0],    mana:40, type:"buff",  desc:"+crit, +spd",              status:"HASTE" },
  "Last Stand": { icon:"x ", dmg:[0,0],    mana:50, type:"buff",  desc:"Survive fatal blow 1x",    status:"BARRIER" },
  "Shadow Step":{ icon:"xR", dmg:[0,0],    mana:25, type:"buff",  desc:"Teleport-dodge",           status:"STEALTH" },
};


const TYPE_COLOR = {
  phys:"#e2e8f0", fire:"#f97316", ice:"#60a5fa", lightning:"#fbbf24",
  arcane:"#a78bfa", holy:"#fde68a", dark:"#8b5cf6", poison:"#4ade80",
  heal:"#22c55e", buff:"#f59e0b", debuff:"#a855f7", summon:"#94a3b8",
};







const CLASSES = {
  WARRIOR: {
    name: "Warrior", icon: "a ", color: "#ef4444",
    desc: "Unstoppable frontline fighter. Master of melee combat.",
    stats: { hp: 150, mana: 60, atk: 22, def: 18, spd: 8, crit: 10 },
    passives: ["Iron Skin: +20% DEF", "Berserker: +5% ATK per kill (stacks 5x)"],
    spells: ["Whirlwind","Shield Bash","War Cry","Blade Storm","Deathblow"],
    allowedArmor: ["LIGHT", "MEDIUM", "HEAVY"],
    startWeapon: "w_sword1",
    subclasses: {
      JUGGERNAUT: { name:"Juggernaut", icon:"x", desc:"Immovable tank. Halves damage below 50% HP.",
        stats:{ hp:50, def:15, atk:-3 }, spells:["Unbreakable","Taunt","Stonewall"] },
      GLADIATOR:  { name:"Gladiator",  icon:"x", desc:"Dual-wield crit maniac. +15% crit, +20% ATK.",
        stats:{ atk:12, crit:15, spd:3 }, spells:["Dual Strike","Arena Roar","Coliseum"] },
      WARLORD:    { name:"Warlord",    icon:"x", desc:"Commander of war. Passive buffs allies/self.",
        stats:{ atk:6, def:6, mana:30 }, spells:["Rallying Cry","Banner of War","Conquest"] },
    },
  },
  MAGE: {
    name: "Mage", icon: "x ", color: "#3b82f6",
    desc: "Master of arcane destruction. Devastating spell power.",
    stats: { hp: 90, mana: 200, atk: 14, def: 7, spd: 9, crit: 15 },
    physMult: 0.25, // Nerfed physical
    passives: ["Arcane Mastery: Spells +25% DMG", "Mana Shield: 30% dmg absorbed"],
    spells: ["Fireball","Ice Lance","Chain Lightning","Arcane Missile","Meteor"],
    allowedArmor: ["LIGHT", "MEDIUM"],
    startWeapon: "w_staff1",
    subclasses: {
      ARCHMAGE:    { name:"Archmage",    icon:"xRx", desc:"Pure arcane. +40% spell damage, +100 max mana.",
        stats:{ mana:100, crit:8 }, spells:["Arcane Explosion","Time Warp","Mana Storm"] },
      PYROMANCER:  { name:"Pyromancer",  icon:"x ", desc:"Fire specialist. All fire spells burn + 30% stronger.",
        stats:{ mana:60, atk:4 }, spells:["Phoenix Dive","Volcano","Immolate"] },
      CRYOMANCER:  { name:"Cryomancer",  icon:" ", desc:"Ice lord. Freeze chance doubled, +DEF from cold armor.",
        stats:{ def:8, mana:40 }, spells:["Glacial Spike","Absolute Zero","Frost Nova"] },
    },
  },
  ROGUE: {
    name: "Rogue", icon: "x", color: "#22c55e",
    desc: "Deadly assassin. Strikes from shadows with lethal precision.",
    stats: { hp: 110, mana: 90, atk: 28, def: 9, spd: 14, crit: 35 },
    passives: ["Shadowstrike: First hit always crits", "Evasion: 20% dodge chance"],
    spells: ["Backstab","Poison Blade","Smoke Bomb","Fan of Knives","Death Mark"],
    allowedArmor: ["LIGHT"],
    startWeapon: "w_dagger1",
    subclasses: {
      ASSASSIN:   { name:"Assassin",   icon:"x}", desc:"Guaranteed crit from stealth. +50% crit damage.",
        stats:{ crit:20, atk:8 }, spells:["Shadow Kill","Vanish","Execute"] },
      DUELIST:    { name:"Duelist",    icon:"a ", desc:"Parry master. 35% to reflect melee attacks.",
        stats:{ spd:6, def:8 }, spells:["Riposte","Blade Dance","Flurry"] },
      TRICKSTER:  { name:"Trickster",  icon:"x}", desc:"Chaos agent. Randomly curses, poisons, or charms.",
        stats:{ spd:3, mana:50 }, spells:["Bamboozle","Mirror Image","Jester's Gift"] },
    },
  },
  PALADIN: {
    name: "Paladin", icon: "x", color: "#f59e0b",
    desc: "Holy warrior. Balance of offense, defense, and divine healing.",
    stats: { hp: 130, mana: 110, atk: 18, def: 20, spd: 7, crit: 12 },
    passives: ["Holy Aura: +15 HP regen/turn", "Divine Shield: Block 1 fatal hit"],
    spells: ["Holy Strike","Smite","Consecrate","Divine Heal","Judgment"],
    allowedArmor: ["LIGHT", "MEDIUM", "HEAVY"],
    startWeapon: "w_sword1",
    subclasses: {
      CRUSADER:    { name:"Crusader",    icon:"a ", desc:"Holy warrior. +40% vs. undead/demons, smites crit.",
        stats:{ atk:10, hp:30 }, spells:["Crusader's Charge","Sacred Strike","Holy Avenger"] },
      TEMPLAR:     { name:"Templar",     icon:"x", desc:"Divine tank. +Healing effectiveness, +DEF.",
        stats:{ def:12, hp:60 }, spells:["Lay on Hands","Aegis","Guardian Angel"] },
      INQUISITOR:  { name:"Inquisitor",  icon:"x ", desc:"Zealot. Hunts heretics, ignores resistances.",
        stats:{ atk:7, crit:8, mana:30 }, spells:["Sanctified Flame","Banish","Excommunicate"] },
    },
  },
  NECROMANCER: {
    name: "Necromancer", icon: "x", color: "#8b5cf6",
    desc: "Master of death and undead. Drains life and summons minions.",
    stats: { hp: 95, mana: 180, atk: 16, def: 8, spd: 8, crit: 20 },
    physMult: 0.35, // Nerfed physical
    passives: ["Death Pact: 20% chance to revive on death", "Soul Harvest: Gain mana on kill"],
    spells: ["Death Bolt","Soul Drain","Raise Dead","Bone Nova","Lich Form"],
    allowedArmor: ["LIGHT", "MEDIUM"],
    startWeapon: "w_staff1",
    subclasses: {
      SUMMONER:    { name:"Summoner",    icon:"x", desc:"Commands minions. Can have 3 active.",
        stats:{ mana:80 }, spells:["Summon Skeleton","Summon Ghoul","Army of Bones"] },
      BLOODMAGE:   { name:"Blood Mage",  icon:"x", desc:"Spends HP as mana. +50% damage per HP missing %.",
        stats:{ hp:40, mana:-40 }, spells:["Blood Sacrifice","Hemorrhage","Crimson Bath"] },
      DEATHKNIGHT: { name:"Death Knight",icon:"x", desc:"Melee necro. Heals from kills, wields two-handers.",
        stats:{ atk:12, def:6 }, spells:["Death Grip","Unholy Strike","Apocalypse"] },
    },
  },
  BERSERKER: {
    name: "Berserker", icon: "x ", color: "#dc2626",
    desc: "Rage-fueled destroyer. Gets stronger as HP drops.",
    stats: { hp: 160, mana: 40, atk: 30, def: 10, spd: 11, crit: 20 },
    passives: ["Blood Rage: ATK doubles below 25% HP", "Rampage: No mana cost at low HP"],
    spells: ["Savage Strike","Frenzy","Blood Thirst","Earthquake","Ragnarok"],
    allowedArmor: ["LIGHT", "MEDIUM", "HEAVY"],
    startWeapon: "w_axe1",
    subclasses: {
      WARLOCK:    { name:"Warlock",    icon:"x ", desc:"Rage-casting hybrid. Attacks buff spell dmg.",
        stats:{ mana:100, crit:5 }, spells:["Demon Fire","Pact","Chaos Bolt"] },
      REAVER:     { name:"Reaver",     icon:"a", desc:"Speed berserker. Extra turn after kill.",
        stats:{ spd:8, atk:4 }, spells:["Blitz","Bloodrush","Slaughter"] },
      TITAN:      { name:"Titan",      icon:"x", desc:"Colossal. HP doubled, all damage +20%.",
        stats:{ hp:100, atk:5, def:8 }, spells:["Colossal Smash","Titanic Rage","World Breaker"] },
    },
  },
  RANGER: {
    name: "Ranger", icon: "x", color: "#10b981",
    desc: "Swift hunter. Attacks from range with deadly accuracy.",
    stats: { hp: 105, mana: 100, atk: 24, def: 11, spd: 13, crit: 28 },
    passives: ["Eagle Eye: +15% crit damage", "Kiting: Never takes damage first"],
    spells: ["Arrow Rain","Piercing Shot","Trap","Barrage","Sniper Shot"],
    allowedArmor: ["LIGHT", "MEDIUM"],
    startWeapon: "w_bow1",
    subclasses: {
      MARKSMAN:   { name:"Marksman",   icon:"x}", desc:"Sniper specialist. +50% crit dmg, +range.",
        stats:{ crit:15, atk:8 }, spells:["Headshot","Ballista","Kill Shot"] },
      BEASTMASTER:{ name:"Beastmaster",icon:"x", desc:"Tames pets. Companion fights alongside you.",
        stats:{ hp:30, mana:30 }, spells:["Call Beast","Pack Tactics","Wild Charge"] },
      TRAPPER:    { name:"Trapper",    icon:"x", desc:"Master of traps. Stack 3 traps per fight.",
        stats:{ spd:4, mana:40 }, spells:["Bear Trap","Explosive Snare","Tripwire"] },
    },
  },
  SORCERER: {
    name: "Sorcerer", icon: "S", color: "#06b6d4",
    desc: "Pure elemental power. Inflicts status effects on every spell.",
    stats: { hp: 85, mana: 220, atk: 12, def: 6, spd: 10, crit: 22 },
    physMult: 0.25, // Nerfed physical
    passives: ["Elemental Overload: 50% status chance", "Mana Surge: Cast 2 spells/turn"],
    spells: ["Blizzard","Inferno","Void Bolt","Thunderstorm","Reality Tear"],
    allowedArmor: ["LIGHT", "MEDIUM"],
    startWeapon: "w_staff1",
    subclasses: {
      ELEMENTALIST:{ name:"Elementalist",icon:"xR", desc:"All elements. Elemental combos trigger bonus dmg.",
        stats:{ mana:50 }, spells:["Elemental Fury","Prismatic Blast","Maelstrom"] },
      STORMCALLER:{ name:"Stormcaller", icon:":", desc:"Lightning mastery. Chains on crit.",
        stats:{ spd:4, crit:10 }, spells:["Lightning Surge","Storm Lord","Tempest"] },
      VOIDCALLER: { name:"Voidcaller",  icon:"xR", desc:"Void specialist. Ignores all resist.",
        stats:{ mana:80, crit:5 }, spells:["Void Rift","Null Field","Oblivion"] },
    },
  },
};


const SUBCLASS_UNLOCK_LEVEL = 20;
function getClassSpells(cls, subclass) {
  const base = CLASSES[cls]?.spells || [];
  const sub = subclass ? CLASSES[cls]?.subclasses?.[subclass]?.spells || [] : [];
  return [...base, ...sub];
}
function getSubclassBonus(cls, subclass) {
  if (!cls || !subclass) return { hp:0, mana:0, atk:0, def:0, spd:0, crit:0 };
  return CLASSES[cls]?.subclasses?.[subclass]?.stats || { hp:0, mana:0, atk:0, def:0, spd:0, crit:0 };
}
const ALL_SUBCLASSES = Object.entries(CLASSES).flatMap(([cls, cd]) =>
  Object.entries(cd.subclasses || {}).map(([sub, sd]) => ({ cls, sub, ...sd }))
);










const node = (id, name, desc, tier, branch, grants, cost=1) => ({ id, name, desc, tier, branch, grants, cost });
const SKILL_TREES = {

  WARRIOR: [

    node("w_might1",  "Might I",          "+5 ATK", 1, "offense", { stat:{atk:5} }),
    node("w_might2",  "Might II",         "+10 ATK", 2, "offense", { stat:{atk:10} }),
    node("w_might3",  "Might III",        "+20 ATK", 3, "offense", { stat:{atk:20} }),
    node("w_fort1",   "Fortitude I",      "+25 HP", 1, "defense", { stat:{hp:25} }),
    node("w_fort2",   "Fortitude II",     "+50 HP", 2, "defense", { stat:{hp:50} }),
    node("w_fort3",   "Fortitude III",    "+100 HP", 3, "defense", { stat:{hp:100} }),
    node("w_guard1",  "Guard I",          "+5 DEF", 1, "defense", { stat:{def:5} }),
    node("w_guard2",  "Guard II",         "+10 DEF", 2, "defense", { stat:{def:10} }),
    node("w_guard3",  "Guard III",        "+20 DEF", 3, "defense", { stat:{def:20} }),
    node("w_crit1",   "Edge I",           "+5% crit", 1, "offense", { stat:{crit:5} }),
    node("w_crit2",   "Edge II",          "+10% crit", 2, "offense", { stat:{crit:10} }),
    node("w_rage1",   "Rage I",           "+3 ATK per berserker stack", 2, "utility", { passive:"rage_stack" }),
    node("w_rage2",   "Endless Rage",     "Berserker stacks uncap", 4, "utility", { passive:"endless_rage" }),
    node("w_heavy",   "Heavy Armor",      "+25% armor bonus", 3, "defense", { mult:{armorBonus:1.25} }),
    node("w_cleave",  "Cleave",           "Attacks hit 2x", 3, "offense", { passive:"cleave" }),
    node("w_retal",   "Retaliate",        "25% reflect dmg", 3, "defense", { passive:"retaliate" }),
    node("w_second",  "Second Wind",      "Heal 50% when below 25% HP 1x/floor", 4, "utility", { passive:"second_wind" }),
    node("w_ps",      "Power Strike",     "Learns Power Strike", 1, "offense", { spell:"Power Strike" }),
    node("w_cries",   "Battle Trance",    "Learns Battle Trance", 3, "utility", { spell:"Battle Trance" }),
    node("w_last",    "Last Stand",       "Learns Last Stand", 5, "defense", { spell:"Last Stand" }),

    node("w_cap_off", "Blade Mastery",    "+30% ATK when above 50% HP", 5, "offense", { passive:"blade_mastery" }),
    node("w_cap_def", "Aegis Lord",       "Halves all damage below 30% HP", 5, "defense", { passive:"aegis_lord" }),
    node("w_cap_bal", "Warlord's Will",   "+15 to all stats", 5, "utility", { stat:{atk:15,def:15,hp:60,mana:30,crit:10} }),
  ],

  MAGE: [
    node("m_mind1",   "Mind I",           "+25 max MP", 1, "arcane", { stat:{mana:25} }),
    node("m_mind2",   "Mind II",          "+50 max MP", 2, "arcane", { stat:{mana:50} }),
    node("m_mind3",   "Mind III",         "+100 max MP", 3, "arcane", { stat:{mana:100} }),
    node("m_power1",  "Arcane I",         "+10% spell dmg", 1, "arcane", { mult:{spellDmg:1.1} }),
    node("m_power2",  "Arcane II",        "+20% spell dmg", 2, "arcane", { mult:{spellDmg:1.2} }),
    node("m_power3",  "Arcane III",       "+35% spell dmg", 3, "arcane", { mult:{spellDmg:1.35} }),
    node("m_fire1",   "Flame Adept",      "+30% fire dmg", 2, "fire",   { mult:{fireDmg:1.3} }),
    node("m_fire2",   "Flame Master",     "Burns last +2 turns", 3, "fire", { passive:"burn_extend" }),
    node("m_fire3",   "Pyromaniac",       "+75% fire dmg", 4, "fire",   { mult:{fireDmg:1.75} }),
    node("m_ice1",    "Frost Adept",      "+30% ice dmg", 2, "ice",     { mult:{iceDmg:1.3} }),
    node("m_ice2",    "Frost Master",     "Freeze lasts +1 turn", 3, "ice", { passive:"freeze_extend" }),
    node("m_ice3",    "Cryomancer",       "+75% ice dmg", 4, "ice",     { mult:{iceDmg:1.75} }),
    node("m_lit1",    "Storm Adept",      "+30% lightning dmg", 2, "lightning", { mult:{lightningDmg:1.3} }),
    node("m_lit2",    "Chain Master",     "Lightning chains 2x", 3, "lightning", { passive:"chain" }),
    node("m_lit3",    "Stormcaller",      "+75% lightning dmg", 4, "lightning", { mult:{lightningDmg:1.75} }),
    node("m_regen",   "Mana Well",        "+5 MP per turn", 2, "arcane", { passive:"mana_regen" }),
    node("m_shield",  "Mana Shield",      "30% dmg drains MP", 3, "arcane", { passive:"mana_shield" }),
    node("m_focus",   "Focused Mind",     "-25% spell costs", 4, "arcane", { mult:{spellCost:0.75} }),
    node("m_ember",   "Ember Shot",       "Learns Ember Shot", 1, "fire", { spell:"Ember Shot" }),
    node("m_shard",   "Ice Shard",        "Learns Ice Shard", 1, "ice",  { spell:"Ice Shard" }),
    node("m_spark",   "Spark",            "Learns Spark", 1, "lightning", { spell:"Spark" }),
    node("m_cap_arc", "Arcane Singularity","Every 3rd spell is free", 5, "arcane", { passive:"singularity" }),
    node("m_cap_elem","Elemental Master", "+50% all elemental dmg", 5, "fire", { mult:{fireDmg:1.5,iceDmg:1.5,lightningDmg:1.5} }),
    node("m_cap_wiz", "True Wizard",      "+50 ATK, +150 MP", 5, "arcane", { stat:{atk:50,mana:150} }),
  ],

  ROGUE: [
    node("r_speed1",  "Agility I",        "+3 SPD", 1, "speed", { stat:{spd:3} }),
    node("r_speed2",  "Agility II",       "+6 SPD", 2, "speed", { stat:{spd:6} }),
    node("r_crit1",   "Precision I",      "+10% crit", 1, "crit", { stat:{crit:10} }),
    node("r_crit2",   "Precision II",     "+20% crit", 2, "crit", { stat:{crit:20} }),
    node("r_crit3",   "Precision III",    "+35% crit", 3, "crit", { stat:{crit:35} }),
    node("r_critDmg1","Bloodletter I",    "+25% crit dmg", 3, "crit", { mult:{critMult:1.25} }),
    node("r_critDmg2","Bloodletter II",   "+50% crit dmg", 4, "crit", { mult:{critMult:1.5} }),
    node("r_dodge1",  "Evasion I",        "+10% dodge", 2, "speed", { mult:{dodge:1.1} }),
    node("r_dodge2",  "Evasion II",       "+25% dodge", 3, "speed", { mult:{dodge:1.25} }),
    node("r_poison1", "Venomous",         "+50% poison dmg", 2, "poison", { mult:{poisonDmg:1.5} }),
    node("r_poison2", "Plague Doctor",    "Poison spreads on kill", 3, "poison", { passive:"plague_spread" }),
    node("r_poison3", "Toxicologist",     "All hits apply poison", 4, "poison", { passive:"poison_on_hit" }),
    node("r_steal",   "Pickpocket",       "Gold on hit", 2, "utility", { passive:"pickpocket" }),
    node("r_shadow",  "Shadow Step",      "Learns Shadow Step", 3, "speed", { spell:"Shadow Step" }),
    node("r_cripple", "Cripple",          "15% slow on hit", 3, "poison", { passive:"slow_on_hit" }),
    node("r_ambush",  "Ambusher",         "First hit: 3x dmg", 3, "crit", { passive:"ambush" }),
    node("r_chain",   "Chain Kills",      "Refund MP on kill", 4, "utility", { passive:"chain_kill" }),
    node("r_qs",      "Quick Shot",       "Learns Quick Shot", 1, "crit", { spell:"Quick Shot" }),
    node("r_cap_ass", "Perfect Assassin", "All attacks can crit, +crit cap", 5, "crit", { passive:"perfect_assassin" }),
    node("r_cap_shd", "Phantom",          "1st hit each turn is stealth-crit", 5, "speed", { passive:"phantom" }),
    node("r_cap_tox", "Overdose",         "Poison hits 3x as hard", 5, "poison", { mult:{poisonDmg:3.0} }),
  ],

  PALADIN: [
    node("p_faith1",  "Faith I",          "+5 ATK, +5 DEF", 1, "holy", { stat:{atk:5,def:5} }),
    node("p_faith2",  "Faith II",         "+10 ATK, +10 DEF", 2, "holy", { stat:{atk:10,def:10} }),
    node("p_faith3",  "Faith III",        "+20 ATK, +20 DEF", 3, "holy", { stat:{atk:20,def:20} }),
    node("p_heal1",   "Divine Touch I",   "+25% heal effectiveness", 2, "holy", { mult:{healMult:1.25} }),
    node("p_heal2",   "Divine Touch II",  "+50% heal effectiveness", 3, "holy", { mult:{healMult:1.5} }),
    node("p_heal3",   "Divine Touch III", "Heals also grant REGEN", 4, "holy", { passive:"heal_regen" }),
    node("p_aura",    "Aura of Light",    "+30 HP regen/turn", 3, "holy", { passive:"aura_light" }),
    node("p_shield",  "Divine Shield+",   "Blocks 2 fatal hits", 4, "defense", { passive:"divine_shield_plus" }),
    node("p_vs_und",  "Undead Bane",      "+50% vs undead", 2, "holy", { passive:"undead_bane" }),
    node("p_vs_dem",  "Demon Bane",       "+50% vs demons", 2, "holy", { passive:"demon_bane" }),
    node("p_cleanse", "Purify",           "Immune to debuffs", 3, "defense", { passive:"immune_debuff" }),
    node("p_judge",   "Swift Judgment",   "Judgment cost -50%", 4, "offense", { passive:"cheap_judge" }),
    node("p_reflect", "Holy Reflect",     "20% reflect dmg", 3, "defense", { passive:"holy_reflect" }),
    node("p_mend",    "Mend",             "Learns Mend", 1, "holy", { spell:"Mend" }),
    node("p_major",   "Major Heal",       "Learns Major Heal", 3, "holy", { spell:"Major Heal" }),
    node("p_cleanse2","Cleanse",          "Learns Cleanse", 2, "holy", { spell:"Cleanse" }),
    node("p_cap_lt",  "Avatar of Light",  "All spells gain +100% dmg vs evil", 5, "holy", { passive:"avatar_light" }),
    node("p_cap_gd",  "Immortal Guardian","Auto-revive 1x per fight", 5, "defense", { passive:"immortal_guard" }),
    node("p_cap_zel", "True Zealot",      "+100% holy damage", 5, "holy", { mult:{holyDmg:2.0} }),
  ],

  NECROMANCER: [
    node("n_drain1",  "Soul Siphon I",    "Attacks heal 10%", 1, "dark", { mult:{lifesteal:1.1} }),
    node("n_drain2",  "Soul Siphon II",   "Attacks heal 20%", 3, "dark", { mult:{lifesteal:1.2} }),
    node("n_death1",  "Necrotic I",       "+25% dark dmg", 2, "dark", { mult:{darkDmg:1.25} }),
    node("n_death2",  "Necrotic II",      "+50% dark dmg", 3, "dark", { mult:{darkDmg:1.5} }),
    node("n_death3",  "Necrotic III",     "+100% dark dmg", 5, "dark", { mult:{darkDmg:2.0} }),
    node("n_bone",    "Bone Armor",       "+25% DEF from corpses", 3, "defense", { passive:"bone_armor" }),
    node("n_undead1", "Undead Host I",    "Can summon 2 minions", 3, "summon", { passive:"minion_2" }),
    node("n_undead2", "Undead Host II",   "Can summon 3 minions", 4, "summon", { passive:"minion_3" }),
    node("n_minion_p","Empower Minions",  "Minion dmg +50%", 3, "summon", { mult:{minionDmg:1.5} }),
    node("n_curse1",  "Curse Master",     "Curses hit 50% harder", 3, "dark", { mult:{curseDmg:1.5} }),
    node("n_reap",    "Reaper",           "Refills MP on kill", 2, "dark", { passive:"soul_refill" }),
    node("n_pact",    "Death Pact+",      "30% revive chance", 3, "utility", { passive:"death_pact_plus" }),
    node("n_plague",  "Plague Bringer",   "Poisons stack to 5", 4, "dark", { passive:"plague_stack" }),
    node("n_doom",    "Herald of Doom",   "Doom applies faster", 4, "dark", { passive:"doom_fast" }),
    node("n_fear",    "Aura of Dread",    "Enemies take +10% dmg", 3, "dark", { passive:"dread_aura" }),
    node("n_lich",    "Lich King",        "Lich Form costs -30%", 4, "dark", { passive:"lich_cheap" }),
    node("n_cap_plg", "Apocalypse Rider", "Deal DOT 3x", 5, "dark", { mult:{dotDmg:3.0} }),
    node("n_cap_army","Death's Legion",   "Minions auto-summon on kill", 5, "summon", { passive:"auto_summon" }),
    node("n_cap_lord","Lord of Death",    "+100 HP, +200 MP, +20 ATK", 5, "utility", { stat:{hp:100,mana:200,atk:20} }),
  ],

  BERSERKER: [
    node("b_wrath1",  "Wrath I",          "+5 ATK", 1, "rage", { stat:{atk:5} }),
    node("b_wrath2",  "Wrath II",         "+10 ATK", 2, "rage", { stat:{atk:10} }),
    node("b_wrath3",  "Wrath III",        "+25 ATK", 4, "rage", { stat:{atk:25} }),
    node("b_blood1",  "Bloodthirst I",    "Heal 15% of dmg dealt", 2, "rage", { mult:{lifesteal:1.15} }),
    node("b_blood2",  "Bloodthirst II",   "Heal 30% of dmg dealt", 4, "rage", { mult:{lifesteal:1.3} }),
    node("b_lowhp",   "Cornered Beast",   "+50% dmg below 40% HP", 3, "rage", { passive:"cornered" }),
    node("b_body",    "Iron Body",        "+100 HP", 3, "body", { stat:{hp:100} }),
    node("b_regen",   "Rapid Recovery",   "+20 HP regen/turn", 3, "body", { passive:"rage_regen" }),
    node("b_cleave",  "Reaver",           "Hits adjacent foes too", 3, "rage", { passive:"reaver_cleave" }),
    node("b_execute", "Executioner",      "Below 25% HP = insta-kill on hit", 5, "rage", { passive:"executioner" }),
    node("b_crit",    "Brutal Crits",     "+50% crit dmg", 4, "rage", { mult:{critMult:1.5} }),
    node("b_quake",   "Tremor",           "Quake stuns longer", 3, "rage", { passive:"quake_stun" }),
    node("b_bersrk",  "Permanent Frenzy", "Frenzy lasts entire fight", 5, "rage", { passive:"perma_frenzy" }),
    node("b_taunt",   "Taunt",            "Enemy always targets you", 2, "body", { passive:"taunt" }),
    node("b_thick",   "Thick Hide",       "Reduce dmg by 20%", 3, "body", { mult:{dmgTaken:0.8} }),
    node("b_ragnar",  "Ragnarok-touched", "Ragnarok cost -40%", 4, "rage", { passive:"ragnarok_cheap" }),
    node("b_cap_god", "World Ender",      "Attacks ignore all DEF", 5, "rage", { passive:"world_ender" }),
    node("b_cap_imm", "Unkillable",       "1% HP threshold survives lethal dmg", 5, "body", { passive:"unkillable" }),
    node("b_cap_bst", "Primal Avatar",    "+50 ATK, +200 HP, +10 SPD", 5, "rage", { stat:{atk:50,hp:200,spd:10} }),
  ],

  RANGER: [
    node("rg_aim1",   "Aim I",            "+5% crit", 1, "aim", { stat:{crit:5} }),
    node("rg_aim2",   "Aim II",           "+15% crit", 2, "aim", { stat:{crit:15} }),
    node("rg_aim3",   "Aim III",          "+30% crit", 3, "aim", { stat:{crit:30} }),
    node("rg_swift1", "Swiftness I",      "+3 SPD", 1, "speed", { stat:{spd:3} }),
    node("rg_swift2", "Swiftness II",     "+6 SPD", 3, "speed", { stat:{spd:6} }),
    node("rg_range1", "Bowmaster I",      "+25% bow dmg", 2, "aim", { mult:{bowDmg:1.25} }),
    node("rg_range2", "Bowmaster II",     "+50% bow dmg", 3, "aim", { mult:{bowDmg:1.5} }),
    node("rg_range3", "Bowmaster III",    "+100% bow dmg", 5, "aim", { mult:{bowDmg:2.0} }),
    node("rg_kite",   "Kiter",            "Auto-dodge 1st hit", 2, "speed", { passive:"auto_dodge" }),
    node("rg_pierce", "Piercing Arrows",  "Ignore 50% DEF", 3, "aim", { mult:{pierceDef:0.5} }),
    node("rg_pet1",   "Animal Companion", "Start with pet", 3, "beast", { passive:"start_pet" }),
    node("rg_pet2",   "Stronger Bond",    "Pet +50% stats", 4, "beast", { mult:{petStats:1.5} }),
    node("rg_trap1",  "Trap Mastery",     "Traps +100% dmg", 3, "trap", { mult:{trapDmg:2.0} }),
    node("rg_trap2",  "Trap Chain",       "Place 3 traps per fight", 4, "trap", { passive:"trap_chain" }),
    node("rg_bleed",  "Bleeder",          "Shots apply BLEED", 3, "aim", { passive:"bleed_shot" }),
    node("rg_volley", "Volley Master",    "Arrow Rain -50% cost", 3, "aim", { passive:"volley_cheap" }),
    node("rg_snipe",  "Sniper",           "Sniper Shot always crits", 4, "aim", { passive:"snipe_crit" }),
    node("rg_cap_eye","Eagle Vision",     "Always see enemy weak spots", 5, "aim", { passive:"eagle_vision" }),
    node("rg_cap_pkm","Wild Lord",        "Pet is immortal", 5, "beast", { passive:"immortal_pet" }),
    node("rg_cap_ult","Ultimate Marksman","All ranged = guaranteed crit", 5, "aim", { passive:"ranged_crit" }),
  ],

  SORCERER: [
    node("s_mind1",   "Attuned I",        "+30 MP", 1, "magic", { stat:{mana:30} }),
    node("s_mind2",   "Attuned II",       "+60 MP", 2, "magic", { stat:{mana:60} }),
    node("s_mind3",   "Attuned III",      "+150 MP", 4, "magic", { stat:{mana:150} }),
    node("s_power1",  "Spellpower I",     "+15% spell dmg", 1, "magic", { mult:{spellDmg:1.15} }),
    node("s_power2",  "Spellpower II",    "+30% spell dmg", 2, "magic", { mult:{spellDmg:1.3} }),
    node("s_power3",  "Spellpower III",   "+60% spell dmg", 4, "magic", { mult:{spellDmg:1.6} }),
    node("s_status1", "Elemental Sway",   "Status chance +25%", 2, "status", { mult:{statusChance:1.25} }),
    node("s_status2", "Elemental Sway II","Status chance +50%", 3, "status", { mult:{statusChance:1.5} }),
    node("s_status3", "Always Afflict",   "All spells inflict status", 5, "status", { passive:"always_status" }),
    node("s_ele",     "Elemental Balance","Combo different elements +dmg", 3, "status", { passive:"ele_combo" }),
    node("s_overload","Surge",            "Cast 2 spells/turn", 4, "magic", { passive:"mana_surge" }),
    node("s_echo",    "Echo",             "30% chance to cast twice", 4, "magic", { passive:"echo_spell" }),
    node("s_void1",   "Voidtouch",        "+50% dark dmg", 3, "void", { mult:{darkDmg:1.5} }),
    node("s_void2",   "Void Walker",      "Immune to status", 4, "void", { passive:"status_immune" }),
    node("s_sanity",  "Stable Mind",      "No MP burn/silence", 3, "void", { passive:"no_silence" }),
    node("s_crit",    "Chaos Crits",      "Spells crit 2x", 4, "magic", { mult:{critMult:2.0} }),
    node("s_cap_arc", "Primordial Mage",  "+100% all elemental dmg", 5, "magic", { mult:{fireDmg:2,iceDmg:2,lightningDmg:2,darkDmg:2} }),
    node("s_cap_vs",  "Void Sovereign",   "Spells bypass all resistance", 5, "void", { passive:"bypass_resist" }),
    node("s_cap_ult", "Limitless",        "MP never drops below 50%", 5, "magic", { passive:"infinite_mana" }),
  ],
};


function getAvailableNodes(cls, unlocked = []) {
  const tree = SKILL_TREES[cls] || [];
  return tree.filter(n => !unlocked.includes(n.id));
}
function getUnlockedNodes(cls, unlocked = []) {
  const tree = SKILL_TREES[cls] || [];
  return tree.filter(n => unlocked.includes(n.id));
}


function aggregateGrants(cls, unlocked = []) {
  const nodes = getUnlockedNodes(cls, unlocked);
  const grants = {
    stat: { hp:0, mana:0, atk:0, def:0, spd:0, crit:0 },
    spells: [],
    passives: {},
    mult: {},
  };
  nodes.forEach(n => {
    if (n.grants.stat) {
      Object.entries(n.grants.stat).forEach(([k,v]) => { grants.stat[k] = (grants.stat[k]||0) + v; });
    }
    if (n.grants.spell) grants.spells.push(n.grants.spell);
    if (n.grants.passive) grants.passives[n.grants.passive] = true;
    if (n.grants.mult) {
      Object.entries(n.grants.mult).forEach(([k,v]) => {
        grants.mult[k] = (grants.mult[k]||1) * v;
      });
    }
  });
  return grants;
}









const W = (id, name, rarity, atk, icon, val, extra={}) =>
  ({ id, name, slot:"weapon", rarity, atk, def:0, hp:0, mana:0, icon, val, ...extra });
const A = (id, name, rarity, def, armorType, icon, val, extra={}) =>
  ({ id, name, slot:"armor", rarity, atk:0, def, armorType, hp:0, mana:0, icon, val, ...extra });
const H = (id, name, rarity, def, armorType, icon, val, extra={}) =>
  ({ id, name, slot:"helmet", rarity, atk:0, def, armorType, hp:0, mana:0, icon, val, ...extra });
const B_ = (id, name, rarity, def, armorType, icon, val, extra={}) =>
  ({ id, name, slot:"boots", rarity, atk:0, def, armorType, hp:0, mana:0, icon, val, ...extra });
const R = (id, name, rarity, atk, def, hp, mana, icon, val, extra={}) =>
  ({ id, name, slot:"ring", rarity, atk, def, hp, mana, icon, val, ...extra });
const N = (id, name, rarity, atk, def, hp, mana, icon, val, extra={}) =>
  ({ id, name, slot:"neck", rarity, atk, def, hp, mana, icon, val, ...extra });
const G_ = (id, name, rarity, def, armorType, icon, val, extra={}) =>  // gloves
  ({ id, name, slot:"gloves", rarity, atk:0, def, armorType, hp:0, mana:0, icon, val, ...extra });
const S_ = (id, name, rarity, def, armorType, icon, val, extra={}) =>  // shield (off-hand)
  ({ id, name, slot:"offhand", rarity, atk:0, def, armorType, hp:0, mana:0, icon, val, ...extra });
const C_ = (id, name, rarity, def, armorType, icon, val, extra={}) =>  // cape
  ({ id, name, slot:"cape", rarity, atk:0, def, armorType, hp:0, mana:0, icon, val, ...extra });
const ALL_ITEMS = [


  W("w_stick",       "Cracked Branch",    "COMMON",    4,  "xR", 5),
  W("w_knife",       "Rusty Knife",       "COMMON",    7,  "x ", 10),
  W("w_club",        "Wooden Club",       "COMMON",    6,  "x", 8),
  W("w_sling",       "Sling",             "COMMON",    5,  "x", 9),
  W("w_sword1",      "Iron Sword",        "COMMON",    12, "a ", 25),
  W("w_axe1",        "Woodcutter Axe",    "COMMON",    14, "x ", 30),
  W("w_bow1",        "Crude Bow",         "COMMON",    10, "x", 20),
  W("w_staff1",      "Apprentice Staff",  "COMMON",    8,  "x ", 22, {mana:20}),
  W("w_dagger1",     "Short Dagger",      "COMMON",    11, "x", 18),
  W("w_mace1",       "Wooden Mace",       "COMMON",    13, "x ", 26),
  W("w_whip",        "Leather Whip",      "COMMON",    9,  "x", 22),
  W("w_pitchfork",   "Pitchfork",         "COMMON",    10, "x", 24),

  W("w_sword2",      "Steel Longsword",   "UNCOMMON",  22, "a ", 80),
  W("w_axe2",        "Battle Axe",        "UNCOMMON",  26, "x ", 90),
  W("w_bow2",        "Silver Bow",        "UNCOMMON",  20, "x", 75),
  W("w_staff2",      "Wizard Staff",      "UNCOMMON",  16, "x ", 85, {mana:40}),
  W("w_hammer1",     "War Hammer",        "UNCOMMON",  28, "x ", 95),
  W("w_spear1",      "Iron Spear",        "UNCOMMON",  24, "x ", 85, {def:2}),
  W("w_wand1",       "Magic Wand",        "UNCOMMON",  18, "S", 90, {mana:50}),
  W("w_rapier",      "Rapier",            "UNCOMMON",  21, "x", 82, {spd:3}),
  W("w_scimitar",    "Scimitar",          "UNCOMMON",  23, "a ", 86),
  W("w_morningstar", "Morningstar",       "UNCOMMON",  27, "xRx", 92),
  W("w_halberd",     "Halberd",           "UNCOMMON",  29, "x ", 98, {def:3}),
  W("w_crossbow",    "Crossbow",          "UNCOMMON",  25, "x", 90),
  W("w_shortbow",    "Composite Shortbow","UNCOMMON",  22, "x", 78),
  W("w_hatchet",     "Hand Hatchet",      "UNCOMMON",  18, "x ", 68),

  W("w_flamebrand",  "Flamebrand",        "RARE",      40, "x ", 250, {mana:10, elem:"fire" }),
  W("w_frostfang",   "Frostfang",         "RARE",      36, " ", 240, {mana:20, elem:"ice" }),
  W("w_stormcall",   "Stormcaller",       "RARE",      38, "a", 260, {mana:25, elem:"lightning" }),
  W("w_shadowstk",   "Shadowstrike",      "RARE",      44, "xR", 280, {elem:"dark" }),
  W("w_twin",        "Twin Blades",       "RARE",      48, "a ", 300, {spd:2}),
  W("w_scythe1",     "Reaper Scythe",     "RARE",      50, "a", 310, {hp:10}),
  W("w_trident",     "Cursed Trident",    "RARE",      42, "x ", 255, {mana:15}),
  W("w_bladeedge",   "Bladed Edge",       "RARE",      45, "a ", 290, {crit:5}),
  W("w_soulbow",     "Soul Bow",          "RARE",      40, "x", 270, {mana:20}),
  W("w_venomstk",    "Venom Stick",       "RARE",      36, "x", 250, {elem:"poison" }),
  W("w_runehammer",  "Runed Hammer",      "RARE",      46, "x ", 305),
  W("w_elvenbow",    "Elven Longbow",     "RARE",      42, "x", 280, {spd:3}),
  W("w_crystalstaff","Crystal Staff",     "RARE",      34, "x}", 270, {mana:70}),
  W("w_glaive",      "Glaive",            "RARE",      44, "x ", 280, {def:5}),
  W("w_flail",       "Flail of Pain",     "RARE",      48, ": ", 295, {elem:"phys" }),

  W("w_obsidian",    "Obsidian Blade",    "EPIC",      65, "a ", 700),
  W("w_dragonbow",   "Dragonbone Bow",    "EPIC",      60, "x", 680, {spd:4}),
  W("w_voidstaff",   "Void Staff",        "EPIC",      50, "xR", 720, {mana:80, elem:"dark" }),
  W("w_soulreap",    "Soulreaper",        "EPIC",      72, "x", 750, {hp:20, elem:"dark" }),
  W("w_moonblade",   "Moonblade",         "EPIC",      68, "xR", 730, {def:5, mana:20, elem:"holy" }),
  W("w_sunspear",    "Sunforged Spear",   "EPIC",      62, ",  710, {def:5, mana:10, elem:"holy" }),
  W("w_chaos",       "Chaos Axe",         "EPIC",      78, "x ", 780),
  W("w_quicksilver", "Quicksilver Blade", "EPIC",      60, "x", 690, {spd:6, crit:10}),
  W("w_doomsaber",   "Doom Saber",        "EPIC",      74, "a ", 740),
  W("w_venomstaff",  "Venom Staff",       "EPIC",      55, ",  700, {mana:60, elem:"poison" }),
  W("w_iceblade",    "Glacier Blade",     "EPIC",      66, "x`", 720, {elem:"ice" }),
  W("w_thunderaxe",  "Thunder Axe",       "EPIC",      76, "a", 750, {elem:"lightning" }),
  W("w_bloodcaller", "Blood Caller",      "EPIC",      68, "x", 730, {hp:30, elem:"dark" }),
  W("w_ghostedge",   "Ghost Edge",        "EPIC",      72, "x", 745, {spd:3, elem:"dark" }),
  W("w_runestaff",   "Runed Staff",       "EPIC",      58, "x ", 725, {mana:90}),

  W("w_dragonslyr",  "Dragonslayer",      "LEGENDARY", 95, "a ", 2000, {hp:50, unique:"slay_dragons" }),
  W("w_excalibur",   "Excalibur",         "LEGENDARY", 105,"S", 2500, {def:10, hp:30, mana:20, unique:"holy_judge" }),
  W("w_deathscyth",  "Death's Scythe",    "LEGENDARY", 110,"x", 2800, {mana:30, unique:"reap_souls" }),
  W("w_godslayer",   "Godslayer",         "LEGENDARY", 130,"a ", 3500, {def:5, hp:20, mana:10}),
  W("w_cosmicbow",   "Cosmic Bow",        "LEGENDARY", 115,"xRR", 2900, {mana:40, unique:"star_arrow" }),
  W("w_mjolnir",     "Mjlnir",           "LEGENDARY", 120,"x ", 3200, {mana:40, elem:"lightning" }),
  W("w_gungnir",     "Gungnir",           "LEGENDARY", 118,"x ", 3100, {crit:15, unique:"never_miss" }),
  W("w_mythril",     "Mythril Edge",      "LEGENDARY", 108,"a ", 2700),
  W("w_phoenix",     "Phoenix Staff",     "LEGENDARY", 98, "x ", 2900, {mana:100, elem:"fire" }),
  W("w_starfall",    "Starfall",          "LEGENDARY", 112, ",  3000, {spd:5, mana:50}),
  W("w_artoria",     "Artoria's Edge",    "LEGENDARY", 116,"S", 3150, {hp:40, unique:"holy_judge" }),

  W("w_worldend",    "Worldender",        "MYTHIC",    180,"xR9", 9999, {def:10, hp:50, mana:50, unique:"world_ender" }),
  W("w_creation",    "Staff of Creation", "MYTHIC",    150,"xRx", 9999, {hp:30, mana:150, unique:"genesis" }),
  W("w_timeblade",   "Time Blade",        "MYTHIC",    160,"R", 9999, {spd:10, unique:"time_stop" }),
  W("w_voidslayer",  "Void Slayer",       "MYTHIC",    170,"xRR", 9999, {mana:80, unique:"void_pierce" }),
  W("w_infinity",    "Blade of Infinity", "MYTHIC",    195, ",  9999, {hp:100, mana:100, unique:"endless_combo" }),

  W("w_vampiric",    "Vampiric Blade",    "UNIQUE",    85, "x", 2500, {unique:"lifesteal_50" }),
  W("w_lucky",       "Lucky Sword",       "UNIQUE",    60, "x", 1200, {unique:"lucky_crit", crit:30}),
  W("w_backstabber", "The Backstabber",   "UNIQUE",    72, "x", 1800, {unique:"first_crit", spd:6}),
  W("w_berserker",   "Berserker's Axe",   "UNIQUE",    95, "x ", 2400, {unique:"rage_scale" }),
  W("w_thorn",       "Thornlash",         "UNIQUE",    68, "xR", 1600, {unique:"reflect_50" }),
  W("w_chrono",      "Chrono Dagger",     "UNIQUE",    55, "R", 1500, {spd:15, unique:"double_turn" }),

  W("w_cursed1",     "Blood Pact Blade",  "CURSED",    120,"x", 2000, {hp:-40, unique:"curse_blood" }),
  W("w_cursed2",     "Soulbinder",        "CURSED",    140,"x", 2200, {mana:-50, unique:"curse_soul" }),
  W("w_cursed3",     "Devil's Bargain",   "CURSED",    180,"x", 3000, {hp:-80, crit:40, unique:"curse_devil" }),
  W("w_cursed4",     "Plague Staff",      "CURSED",    90, "x", 1800, {mana:60, unique:"curse_plague" }),


  A("a_rags",        "Tattered Rags",     "COMMON",    5,  "LIGHT", "x", 5,  {hp:10}),
  A("a_leather",     "Leather Vest",      "COMMON",    10, "LIGHT", "x", 30, {hp:20}),
  A("a_padded",      "Padded Gambeson",   "COMMON",    12, "LIGHT", "x", 40, {hp:25}),
  A("a_travel",      "Traveler's Cloak",  "COMMON",    8,  "LIGHT", "x", 28, {hp:15, mana:10}),
  A("a_chain",       "Chain Mail",        "UNCOMMON",  20, "MEDIUM", "x", 90, {hp:30}),
  A("a_ringmail",    "Ring Mail",         "UNCOMMON",  18, "MEDIUM", "x", 85, {hp:25}),
  A("a_studded",     "Studded Leather",   "UNCOMMON",  16, "LIGHT", "x", 80, {hp:20, spd:2}),
  A("a_mage_robe",   "Mage Robe",         "UNCOMMON",  12, "LIGHT", "x", 90, {mana:50}),
  A("a_iron",        "Iron Plate",        "RARE",      35, "HEAVY", "x", 250, {hp:40}),
  A("a_bone",        "Bone Armor",        "RARE",      30, "MEDIUM", "x", 260, {hp:50, mana:10}),
  A("a_elven",       "Elven Silk",        "RARE",      22, "LIGHT", "x", 270, {hp:30, mana:40, spd:3}),
  A("a_plate",       "Knight's Plate",    "RARE",      40, "HEAVY", "x", 280, {hp:45}),
  A("a_spikedarmor", "Spiked Armor",      "RARE",      38, "HEAVY", "a ", 285, {hp:40, unique:"thorns_5" }),
  A("a_shadow",      "Shadow Plate",      "EPIC",      50, "HEAVY", "xR", 700, {hp:60, atk:5}),
  A("a_mithril",     "Mithril Armor",     "EPIC",      60, "MEDIUM", "x", 750, {hp:80}),
  A("a_flame_mail",  "Flame Mail",        "EPIC",      52, "MEDIUM", "x ", 720, {hp:70, elem:"fire" }),
  A("a_frost_mail",  "Frost Mail",        "EPIC",      54, "MEDIUM", " ", 720, {hp:70, elem:"ice" }),
  A("a_light_robe",  "Light Robe",        "EPIC",      38, "LIGHT", "S", 700, {hp:50, mana:90, elem:"holy" }),
  A("a_dragon",      "Dragonscale Mail",  "LEGENDARY", 85, "HEAVY", "x0", 2200, {hp:120, unique:"fire_resist" }),
  A("a_divine",      "Divine Plate",      "LEGENDARY", 95, "HEAVY", "S", 2800, {hp:150, mana:30, atk:5, unique:"holy_ward" }),
  A("a_necro",       "Necroplate",        "LEGENDARY", 80, "HEAVY", "x", 2300, {hp:130, mana:60}),
  A("a_royal",       "Royal Guard Plate", "LEGENDARY", 100, "HEAVY", "x", 2700, {hp:160, unique:"kings_ward" }),
  A("a_titan",       "Titan's Shell",     "LEGENDARY", 110, "HEAVY", "x", 3000, {hp:200}),
  A("a_void",        "Void Aegis",        "MYTHIC",    130, "HEAVY", "xR", 9999, {hp:200, mana:50, atk:10, unique:"void_ward" }),
  A("a_god_armor",   "Raiment of Gods",   "MYTHIC",    150,"LIGHT", "xRx", 9999, {hp:300, mana:100, atk:15, unique:"divine" }),
  A("a_phoenix_mail","Phoenix Mail",      "UNIQUE",    70, "MEDIUM", "x ", 2200, {hp:100, unique:"rebirth" }),
  A("a_thorn_armor", "Thornmail",         "UNIQUE",    65, "HEAVY", "xR", 1800, {hp:80, unique:"thorns_20" }),


  H("h_cap",         "Cloth Cap",         "COMMON",    4,  "LIGHT", "x}", 10, {hp:10, mana:5}),
  H("h_cowl",        "Dark Cowl",         "COMMON",    5,  "LIGHT", "x", 15, {hp:8}),
  H("h_hood",        "Leather Hood",      "COMMON",    6,  "LIGHT", "x", 18, {hp:12}),
  H("h_iron",        "Iron Helm",         "UNCOMMON",  12, "HEAVY", ":", 70, {hp:15}),
  H("h_wizard",      "Wizard Hat",        "UNCOMMON",  6,  "LIGHT", "x}", 75, {hp:10, mana:30}),
  H("h_helm_knight", "Knight Helm",       "UNCOMMON",  15, "HEAVY", ":", 80, {hp:20}),
  H("h_horned",      "Horned Helm",       "RARE",      20, "HEAVY", ":", 220, {hp:20, atk:3}),
  H("h_circlet",     "Silver Circlet",    "RARE",      12, "LIGHT", "x", 200, {mana:60, hp:25}),
  H("h_visored",     "Visored Helm",      "RARE",      22, "HEAVY", ":", 230, {hp:25}),
  H("h_crown",       "Crown of Thorns",   "EPIC",      30, "LIGHT", "x", 680, {hp:40, mana:20, atk:5}),
  H("h_dragon",      "Dragon Crown",      "LEGENDARY", 45, "LIGHT", "x0", 2100, {hp:70, mana:40, atk:8}),
  H("h_godcrown",    "Crown of Gods",     "MYTHIC",    70, "LIGHT", "x", 9999, {hp:120, mana:80, atk:15}),
  H("h_archmage",    "Archmage Hood",     "EPIC",      25, "LIGHT", "x}", 650, {hp:30, mana:100}),
  H("h_skullhelm",   "Skull Helmet",      "UNIQUE",    35, "MEDIUM", "x", 1500, {hp:50, unique:"fear_aura" }),


  B_("b_sandals",    "Worn Sandals",      "COMMON",    3,  "LIGHT", "xx", 8,  {hp:5}),
  B_("b_leather",    "Leather Boots",     "UNCOMMON",  8,  "LIGHT", "x", 60, {hp:10}),
  B_("b_travel",     "Traveler's Boots",  "UNCOMMON",  9,  "LIGHT", "x", 65, {hp:12, spd:2}),
  B_("b_iron",       "Iron Greaves",      "RARE",      16, "HEAVY", "x", 210, {hp:15}),
  B_("b_shadow",     "Shadowstep Boots",  "EPIC",      22, "LIGHT", "xx", 660, {hp:20, atk:4, spd:4}),
  B_("b_winged",     "Winged Boots",      "EPIC",      25, "LIGHT", "x", 700, {hp:30, mana:20, spd:6}),
  B_("b_eternal",    "Boots of Eternity", "LEGENDARY", 40, "LIGHT", "S", 2000, {hp:60, mana:30, atk:5}),
  B_("b_cosmic",     "Cosmic Treads",     "MYTHIC",    65, "LIGHT", "xRR", 9999, {hp:100, mana:50, atk:10}),
  B_("b_stealth",    "Silent Boots",      "UNIQUE",    30, "LIGHT", "xx", 1500, {spd:10, unique:"stealth_gain" }),
  B_("b_gravityless","Gravityless",       "UNIQUE",    28, "LIGHT", "x", 1400, {spd:15, unique:"no_trap" }),


  G_("g_leather",    "Leather Gloves",    "COMMON",    4,  "LIGHT", "x", 20, {atk:2}),
  G_("g_mail",       "Mailed Gloves",     "UNCOMMON",  9,  "MEDIUM", "x", 70, {atk:4}),
  G_("g_iron",       "Iron Gauntlets",    "RARE",      16, "HEAVY", "x", 220, {atk:6, hp:15}),
  G_("g_shadow",     "Shadow Gloves",     "EPIC",      22, "LIGHT", "x", 680, {atk:10, crit:8}),
  G_("g_dragon",     "Dragon Gloves",     "LEGENDARY", 40, "LIGHT", "x", 2100, {atk:15, crit:12}),
  G_("g_void",       "Void Touch",        "MYTHIC",    60, "LIGHT", "x", 9999, {atk:20, crit:20}),
  G_("g_thief",      "Thief's Gloves",    "UNIQUE",    20, "LIGHT", "x", 1200, {spd:8, unique:"gold_find" }),


  S_("s_buckler",    "Wooden Buckler",    "COMMON",    8,  "LIGHT", "x", 30, {hp:10}),
  S_("s_kite",       "Kite Shield",       "UNCOMMON",  18, "MEDIUM", "x", 110, {hp:20}),
  S_("s_tower",      "Tower Shield",      "RARE",      32, "HEAVY", "x", 290, {hp:35}),
  S_("s_aegis",      "Aegis",             "EPIC",      50, "MEDIUM", "x", 750, {hp:60, unique:"block_chance" }),
  S_("s_dragonsh",   "Dragon Shield",     "LEGENDARY", 70, "HEAVY", "x0", 2400, {hp:100, unique:"fire_resist" }),
  S_("s_voidshield", "Void Shield",       "MYTHIC",    100,"HEAVY", "xR", 9999, {hp:150, unique:"void_ward" }),


  C_("c_cloak",      "Cloth Cloak",       "COMMON",    3,  "LIGHT", "x", 15, {hp:8}),
  C_("c_mantle",     "Wolf Mantle",       "UNCOMMON",  7,  "LIGHT", "x", 65, {hp:15, atk:2}),
  C_("c_ranger",     "Ranger's Cloak",    "RARE",      15, "LIGHT", "x", 230, {hp:25, spd:4}),
  C_("c_void",       "Void Mantle",       "EPIC",      25, "LIGHT", "x", 690, {hp:40, mana:50}),
  C_("c_hero",       "Hero's Cape",       "LEGENDARY", 40, "LIGHT", "x", 2200, {hp:70, atk:8, mana:30}),


  R("r_copper",      "Copper Ring",       "COMMON",    2, 2, 8,  5,   "x", 15),
  R("r_silver",      "Silver Ring",       "COMMON",    3, 3, 10, 10,  "x", 25),
  R("r_vitality",    "Ring of Vitality",  "UNCOMMON",  0, 0, 30, 0,   "x", 80),
  R("r_clarity",     "Ring of Clarity",   "UNCOMMON",  0, 0, 0,  50,  "x", 85),
  R("r_might",       "Ring of Might",     "UNCOMMON",  8, 0, 0,  0,   "x", 90),
  R("r_power",       "Ring of Power",     "RARE",      12,0, 0,  0,   "x", 220),
  R("r_mana",        "Ring of Mana",      "RARE",      0, 0, 0,  40,  "x", 210),
  R("r_guardian",    "Guardian Ring",     "RARE",      0, 14,20, 0,   "x", 225),
  R("r_crit",        "Critter",           "RARE",      0, 0, 0,  0,   "x", 240, {crit:15}),
  R("r_speed",       "Swiftness",         "RARE",      4, 0, 0,  0,   "x", 235, {spd:6}),
  R("r_arcane",      "Arcane Band",       "EPIC",      15,8, 25, 25,  "x", 680),
  R("r_warrior",     "Warrior's Bond",    "EPIC",      20,15,40, 0,   "x", 720),
  R("r_sorcerer",    "Sorcerer's Band",   "EPIC",      10,5, 20, 100, "x", 720),
  R("r_phoenix",     "Phoenix Ring",      "EPIC",      12,10,50, 20,  "x ", 700, {unique:"revive_fire" }),
  R("r_ouroboros",   "Ouroboros Ring",    "LEGENDARY", 20,15,60, 50,  "x", 2200),
  R("r_sage",        "Sage's Ring",       "LEGENDARY", 15,15,50, 100, "x", 2300),
  R("r_cosmos",      "Cosmic Ring",       "MYTHIC",    35,30,120,100, "xRR", 9999),
  R("r_lucky",       "Lucky Ring",        "UNIQUE",    10,10,30, 30,  "x", 1500, {unique:"lucky_loot", crit:15}),
  R("r_vampire",     "Vampire Ring",      "UNIQUE",    15,0, 0,  0,   "x", 1300, {unique:"lifesteal_20" }),
  R("r_cursed",      "Cursed Loop",       "CURSED",    40,20,-30,30,  "x", 2000, {unique:"curse_ring" }),


  N("n_thread",      "Lucky Thread",      "COMMON",    1, 1, 5, 5,   "x ", 12),
  N("n_iron_chain",  "Iron Chain",        "COMMON",    2, 2, 10,5,   "x ", 18),
  N("n_ruby",        "Ruby Pendant",      "UNCOMMON",  5, 0, 15,0,   "x ", 85),
  N("n_emerald",     "Emerald Pendant",   "UNCOMMON",  0, 5, 15,15,  "x ", 88),
  N("n_sapphire",    "Sapphire Amulet",   "RARE",      0, 5, 20,35,  "x ", 230),
  N("n_amber",       "Amber Amulet",      "RARE",      8, 0, 20,10,  "x ", 225),
  N("n_dragon",      "Dragon Heart",      "EPIC",      10,10,40,20,  "x0", 690, {unique:"dragon_breath" }),
  N("n_skull_neck",  "Skull Pendant",     "EPIC",      12,6, 30,30,  "x", 700),
  N("n_divine",      "Divine Pendant",    "LEGENDARY", 15,15,80,60,  "S", 2300),
  N("n_godeye",      "God Eye",           "MYTHIC",    30,20,100,120,"x", 9999, {unique:"see_all" }),
  N("n_phoenix_neck","Phoenix Feather",   "UNIQUE",    10,5, 40,20,  "x", 1400, {unique:"rebirth_on_death" }),


  { id:"p_tiny_hp",  name:"Tiny HP Vial",      slot:"consumable",rarity:"COMMON",  heal:30,  icon:"x", val:8 },
  { id:"p_hp",       name:"HP Potion",         slot:"consumable",rarity:"COMMON",  heal:70,  icon:"x", val:18 },
  { id:"p_big_hp",   name:"Great HP Potion",   slot:"consumable",rarity:"UNCOMMON",heal:150, icon:"x", val:50 },
  { id:"p_mega_hp",  name:"Mega HP Potion",    slot:"consumable",rarity:"RARE",    heal:300, icon:"x", val:120 },
  { id:"p_super_hp", name:"Super HP Potion",   slot:"consumable",rarity:"EPIC",    heal:600, icon:"x", val:350 },
  { id:"p_tiny_mana",name:"Tiny Mana",         slot:"consumable",rarity:"COMMON",  mana:25,  icon:"x", val:10 },
  { id:"p_mana",     name:"Mana Potion",       slot:"consumable",rarity:"COMMON",  mana:50,  icon:"x", val:15 },
  { id:"p_big_mana", name:"Great Mana Potion", slot:"consumable",rarity:"UNCOMMON",mana:100, icon:"x", val:45 },
  { id:"p_mega_mana",name:"Mega Mana Potion",  slot:"consumable",rarity:"RARE",    mana:250, icon:"x", val:110 },
  { id:"p_elixir",   name:"Elixir of Power",   slot:"consumable",rarity:"EPIC",    heal:200, mana:150, icon:"a", val:500 },
  { id:"p_divine",   name:"Divine Nectar",     slot:"consumable",rarity:"LEGENDARY",heal:999,mana:999, icon:"S", val:2000 },
  { id:"p_antidote", name:"Antidote",          slot:"consumable",rarity:"UNCOMMON",cure:"POISON", icon:"x", val:40 },
  { id:"p_wakeup",   name:"Smelling Salts",    slot:"consumable",rarity:"UNCOMMON",cure:"SLEEP",  icon:"x", val:40 },
  { id:"p_defrost",  name:"Warm Oil",          slot:"consumable",rarity:"UNCOMMON",cure:"FREEZE", icon:"x", val:45 },
  { id:"p_purify",   name:"Purifying Potion",  slot:"consumable",rarity:"RARE",    cure:"ALL",    icon:"x", val:180 },
  { id:"p_fire_bomb",name:"Fire Bomb",         slot:"consumable",rarity:"UNCOMMON",dmg:80,elem:"fire",  icon:"x", val:60 },
  { id:"p_frost_bomb",name:"Frost Bomb",       slot:"consumable",rarity:"UNCOMMON",dmg:70,elem:"ice",   icon:"x", val:60 },
  { id:"p_holy_bomb",name:"Holy Water",        slot:"consumable",rarity:"RARE",    dmg:120,elem:"holy", icon:"x", val:150 },
  { id:"p_str_elx",  name:"Strength Elixir",   slot:"consumable",rarity:"UNCOMMON",buff:"ATKBUFF", icon:"a", val:80 },
  { id:"p_def_elx",  name:"Iron Skin Elixir",  slot:"consumable",rarity:"UNCOMMON",buff:"DEFBUFF", icon:"a", val:80 },
  { id:"p_hastepot", name:"Speed Potion",      slot:"consumable",rarity:"RARE",    buff:"HASTE",   icon:"a", val:180 },
  { id:"p_luckpot",  name:"Potion of Luck",    slot:"consumable",rarity:"RARE",    buff:"LUCK",    icon:"x", val:200 },
  { id:"p_regenpot", name:"Regen Tincture",    slot:"consumable",rarity:"RARE",    buff:"REGEN",   icon:"a", val:150 },


  { id:"sc_fireball",  name:"Scroll of Fireball",    slot:"scroll", rarity:"UNCOMMON", spell:"Fireball",     icon:"x S", val:60 },
  { id:"sc_freeze",    name:"Scroll of Ice",         slot:"scroll", rarity:"UNCOMMON", spell:"Ice Lance",    icon:"x S", val:55 },
  { id:"sc_lightning", name:"Scroll of Thunder",     slot:"scroll", rarity:"RARE",     spell:"Chain Lightning",icon:"x S", val:150 },
  { id:"sc_meteor",    name:"Scroll of Meteor",      slot:"scroll", rarity:"EPIC",     spell:"Meteor",       icon:"x S", val:600 },
  { id:"sc_blizzard",  name:"Scroll of Blizzard",    slot:"scroll", rarity:"RARE",     spell:"Blizzard",     icon:"x S", val:160 },
  { id:"sc_ragnarok",  name:"Scroll of Ragnarok",    slot:"scroll", rarity:"LEGENDARY",spell:"Ragnarok",     icon:"x S", val:2500 },
  { id:"sc_cleanse",   name:"Scroll of Cleanse",     slot:"scroll", rarity:"RARE",     spell:"Cleanse",      icon:"x S", val:180 },
  { id:"sc_heal",      name:"Scroll of Healing",     slot:"scroll", rarity:"UNCOMMON", spell:"Mend",         icon:"x S", val:50 },
  { id:"sc_haste",     name:"Scroll of Haste",       slot:"scroll", rarity:"EPIC",     spell:"Battle Trance",icon:"x S", val:550 },
  { id:"sc_voidbolt",  name:"Scroll of Void",        slot:"scroll", rarity:"EPIC",     spell:"Void Bolt",    icon:"x S", val:580 },
  { id:"sc_summon",    name:"Scroll of Summoning",   slot:"scroll", rarity:"RARE",     spell:"Raise Dead",   icon:"x S", val:200 },


  { id:"gem_ruby_s",   name:"Small Ruby",      slot:"gem",   rarity:"UNCOMMON", gemType:"atk",  gemVal:5,  icon:"x ", val:80 },
  { id:"gem_ruby_m",   name:"Ruby",            slot:"gem",   rarity:"RARE",     gemType:"atk",  gemVal:12, icon:"x ", val:220 },
  { id:"gem_ruby_l",   name:"Great Ruby",      slot:"gem",   rarity:"EPIC",     gemType:"atk",  gemVal:25, icon:"x ", val:650 },
  { id:"gem_ruby_p",   name:"Perfect Ruby",    slot:"gem",   rarity:"LEGENDARY",gemType:"atk",  gemVal:50, icon:"x ", val:2000 },
  { id:"gem_em_s",     name:"Small Emerald",   slot:"gem",   rarity:"UNCOMMON", gemType:"hp",   gemVal:20, icon:"xx", val:80 },
  { id:"gem_em_m",     name:"Emerald",         slot:"gem",   rarity:"RARE",     gemType:"hp",   gemVal:50, icon:"xx", val:230 },
  { id:"gem_em_l",     name:"Great Emerald",   slot:"gem",   rarity:"EPIC",     gemType:"hp",   gemVal:120,icon:"xx", val:680 },
  { id:"gem_em_p",     name:"Perfect Emerald", slot:"gem",   rarity:"LEGENDARY",gemType:"hp",   gemVal:250,icon:"xx", val:2100 },
  { id:"gem_saph_s",   name:"Small Sapphire",  slot:"gem",   rarity:"UNCOMMON", gemType:"mana", gemVal:25, icon:"x ", val:80 },
  { id:"gem_saph_m",   name:"Sapphire",        slot:"gem",   rarity:"RARE",     gemType:"mana", gemVal:60, icon:"x ", val:240 },
  { id:"gem_saph_l",   name:"Great Sapphire",  slot:"gem",   rarity:"EPIC",     gemType:"mana", gemVal:130,icon:"x ", val:690 },
  { id:"gem_saph_p",   name:"Perfect Sapphire",slot:"gem",   rarity:"LEGENDARY",gemType:"mana", gemVal:280,icon:"x ", val:2100 },
  { id:"gem_dia_s",    name:"Small Diamond",   slot:"gem",   rarity:"RARE",     gemType:"def",  gemVal:10, icon:"x}", val:250 },
  { id:"gem_dia_m",    name:"Diamond",         slot:"gem",   rarity:"EPIC",     gemType:"def",  gemVal:22, icon:"x}", val:700 },
  { id:"gem_dia_l",    name:"Great Diamond",   slot:"gem",   rarity:"LEGENDARY",gemType:"def",  gemVal:45, icon:"x}", val:2200 },
  { id:"gem_topaz",    name:"Topaz",           slot:"gem",   rarity:"RARE",     gemType:"crit", gemVal:8,  icon:"xx", val:260 },
  { id:"gem_onyx",     name:"Onyx",            slot:"gem",   rarity:"EPIC",     gemType:"all",  gemVal:10, icon:"a", val:720 },
  { id:"gem_star",     name:"Starstone",       slot:"gem",   rarity:"MYTHIC",   gemType:"all",  gemVal:35, icon:"xRx", val:9999 },


  { id:"rune_fire",    name:"Rune of Fire",    slot:"rune",  rarity:"RARE",     runeType:"fire",    runeVal:15, icon:"x ", val:250 },
  { id:"rune_ice",     name:"Rune of Ice",     slot:"rune",  rarity:"RARE",     runeType:"ice",     runeVal:15, icon:" ", val:250 },
  { id:"rune_litn",    name:"Rune of Thunder", slot:"rune",  rarity:"RARE",     runeType:"lightning",runeVal:15,icon:"a", val:260 },
  { id:"rune_dark",    name:"Rune of Shadow",  slot:"rune",  rarity:"EPIC",     runeType:"dark",    runeVal:25, icon:"xR", val:680 },
  { id:"rune_holy",    name:"Rune of Light",   slot:"rune",  rarity:"EPIC",     runeType:"holy",    runeVal:25, icon:"S", val:680 },
  { id:"rune_life",    name:"Rune of Life",    slot:"rune",  rarity:"EPIC",     runeType:"lifesteal",runeVal:15,icon:"x", val:720 },
  { id:"rune_power",   name:"Rune of Power",   slot:"rune",  rarity:"EPIC",     runeType:"atk",     runeVal:25, icon:"x", val:700 },
  { id:"rune_vitality",name:"Rune of Vitality",slot:"rune",  rarity:"EPIC",     runeType:"hp",      runeVal:80, icon:"xa", val:720 },
  { id:"rune_focus",   name:"Rune of Focus",   slot:"rune",  rarity:"EPIC",     runeType:"mana",    runeVal:100,icon:"x}", val:720 },
  { id:"rune_haste",   name:"Rune of Haste",   slot:"rune",  rarity:"LEGENDARY",runeType:"spd",     runeVal:10, icon:"x", val:2200 },
  { id:"rune_chaos",   name:"Rune of Chaos",   slot:"rune",  rarity:"MYTHIC",   runeType:"chaos",   runeVal:50, icon:"xR", val:9999 },


  { id:"mat_iron",     name:"Iron Ore",         slot:"material", rarity:"COMMON",    matType:"metal", icon:"x", val:5 },
  { id:"mat_silver",   name:"Silver Ore",       slot:"material", rarity:"UNCOMMON",  matType:"metal", icon:"x", val:20 },
  { id:"mat_gold",     name:"Gold Ore",         slot:"material", rarity:"RARE",      matType:"metal", icon:", val:80 },
  { id:"mat_mithril",  name:"Mithril Ore",      slot:"material", rarity:"EPIC",      matType:"metal", icon:"x}", val:300 },
  { id:"mat_orichalc", name:"Orichalcum",       slot:"material", rarity:"LEGENDARY", matType:"metal", icon:"S", val:1200 },
  { id:"mat_leather",  name:"Leather Hide",     slot:"material", rarity:"COMMON",    matType:"hide",  icon:"xx", val:5 },
  { id:"mat_troll_h",  name:"Troll Hide",       slot:"material", rarity:"UNCOMMON",  matType:"hide",  icon:"xx", val:25 },
  { id:"mat_dragon_s", name:"Dragon Scale",     slot:"material", rarity:"EPIC",      matType:"hide",  icon:"x0", val:350 },
  { id:"mat_wood",     name:"Oak Wood",         slot:"material", rarity:"COMMON",    matType:"wood",  icon:"x", val:3 },
  { id:"mat_ebony",    name:"Ebony Wood",       slot:"material", rarity:"RARE",      matType:"wood",  icon:"x", val:80 },
  { id:"mat_spider_s", name:"Spider Silk",      slot:"material", rarity:"UNCOMMON",  matType:"cloth", icon:", val:25 },
  { id:"mat_shadow_s", name:"Shadow Silk",      slot:"material", rarity:"EPIC",      matType:"cloth", icon:", val:300 },
  { id:"mat_fire_es",  name:"Fire Essence",     slot:"material", rarity:"RARE",      matType:"essence",icon:"x ", val:100 },
  { id:"mat_ice_es",   name:"Ice Essence",      slot:"material", rarity:"RARE",      matType:"essence",icon:" ", val:100 },
  { id:"mat_light_es", name:"Light Essence",    slot:"material", rarity:"EPIC",      matType:"essence",icon:"S", val:320 },
  { id:"mat_dark_es",  name:"Shadow Essence",   slot:"material", rarity:"EPIC",      matType:"essence",icon:"xR", val:320 },
  { id:"mat_soul",     name:"Soul Fragment",    slot:"material", rarity:"RARE",      matType:"soul",  icon:"x", val:120 },
  { id:"mat_great_soul",name:"Great Soul",      slot:"material", rarity:"LEGENDARY", matType:"soul",  icon:"x", val:900 },
  { id:"mat_god_essence",name:"Divine Essence", slot:"material", rarity:"MYTHIC",    matType:"essence",icon:"xRx", val:5000 },


  { id:"cat_repair",  name:"Repair Kit",        slot:"catalyst", rarity:"COMMON",    icon:"x ", val:30 },
  { id:"cat_upgrade", name:"Upgrade Stone",     slot:"catalyst", rarity:"RARE",      icon:" ", val:200 },
  { id:"cat_enchant", name:"Enchant Orb",       slot:"catalyst", rarity:"EPIC",      icon:"x ", val:500 },
  { id:"cat_reforge", name:"Reforge Hammer",    slot:"catalyst", rarity:"EPIC",      icon:"x ", val:600 },
  { id:"cat_socket",  name:"Socket Punch",      slot:"catalyst", rarity:"LEGENDARY", icon:"x}", val:1500 },
  { id:"cat_transmog",name:"Transmog Stone",    slot:"catalyst", rarity:"RARE",      icon:"x}", val:400 },
  { id:"cat_uncurse", name:"Purity Water",      slot:"catalyst", rarity:"EPIC",      icon:"x", val:800 },


  { id:"m_coin",        name:"Ancient Coin",   slot:"misc",  rarity:"UNCOMMON", icon:", val:50 },
  { id:"m_fang",        name:"Dragon Fang",    slot:"misc",  rarity:"RARE",     icon:"x", val:120 },
  { id:"m_crystal",     name:"Soul Crystal",   slot:"misc",  rarity:"EPIC",     icon:"x}", val:350 },
  { id:"m_godstone",    name:"Godstone",       slot:"misc",  rarity:"MYTHIC",   icon:"xRx", val:9999 },
  { id:"m_key_iron",    name:"Iron Key",       slot:"key",   rarity:"UNCOMMON", icon:"x ", val:30 },
  { id:"m_key_gold",    name:"Gold Key",       slot:"key",   rarity:"RARE",     icon:"x ", val:120 },
  { id:"m_key_skull",   name:"Skull Key",      slot:"key",   rarity:"EPIC",     icon:"x", val:500 },
  { id:"m_key_divine",  name:"Divine Key",     slot:"key",   rarity:"LEGENDARY",icon:"x", val:2000 },
  { id:"m_map_frag",    name:"Map Fragment",   slot:"misc",  rarity:"RARE",     icon:"x", val:200 },
  { id:"m_lore_page",   name:"Tome Page",      slot:"misc",  rarity:"UNCOMMON", icon:"x S", val:40 },
  { id:"m_lore_book",   name:"Ancient Tome",   slot:"misc",  rarity:"EPIC",     icon:", val:500 },
  { id:"m_pet_whistle", name:"Taming Whistle", slot:"misc",  rarity:"RARE",     icon:"x ", val:300 },
  { id:"m_faction_seal",name:"Faction Seal",   slot:"misc",  rarity:"UNCOMMON", icon:"x", val:100 },
];




const ITEM_SETS = {
  DRAGONSLAYER: {
    name:"Dragonslayer",
    pieces:["w_dragonslyr","a_dragon","h_dragon","n_dragon","g_dragon"],
    bonuses:{
      2:{ atk:10, desc:"+10 ATK" },
      3:{ atk:25, hp:50, desc:"+25 ATK, +50 HP" },
      4:{ atk:40, hp:100, def:20, desc:"+40 ATK, +100 HP, +20 DEF" },
      5:{ atk:80, hp:200, def:40, crit:20, desc:"Full Set: +80 ATK, +200 HP, +20% crit" },
    },
  },
  VOIDLORD: {
    name:"Void Lord",
    pieces:["w_voidslayer","a_void","c_void","s_voidshield"],
    bonuses:{
      2:{ mana:80, desc:"+80 MP" },
      3:{ mana:150, atk:20, desc:"+150 MP, +20 ATK, spells pierce resist" },
      4:{ mana:250, atk:40, hp:150, desc:"Full Set: Overlord of Void" },
    },
  },
  DIVINE: {
    name:"Divine Guardian",
    pieces:["w_excalibur","a_divine","h_godcrown","n_divine","b_eternal"],
    bonuses:{
      2:{ hp:50, def:15, desc:"+50 HP, +15 DEF" },
      3:{ hp:100, def:30, desc:"+100 HP, +30 DEF, +50% heal received" },
      5:{ hp:300, def:80, atk:30, mana:100, desc:"Full Set: Avatar of the Divine" },
    },
  },
  SHADOWCLOAK: {
    name:"Shadowcloak",
    pieces:["w_shadowstk","a_shadow","b_shadow","g_shadow"],
    bonuses:{
      2:{ spd:3, desc:"+3 SPD" },
      3:{ spd:6, crit:15, desc:"+6 SPD, +15 crit" },
      4:{ spd:10, crit:30, atk:20, desc:"Full Set: Phantom of the Shadows" },
    },
  },
  PHOENIXFLAME: {
    name:"Phoenix Flame",
    pieces:["w_phoenix","a_phoenix_mail","r_phoenix","n_phoenix_neck"],
    bonuses:{
      2:{ mana:50, desc:"Fire spells +20%" },
      3:{ mana:100, atk:20, desc:"Fire spells +40%, +20 ATK" },
      4:{ mana:150, atk:40, hp:200, desc:"Full Set: Reborn in Flame (auto-revive)" },
    },
  },
  WORLDSENDER: {
    name:"Worldsender",
    pieces:["w_worldend","a_god_armor","h_godcrown","r_cosmos","c_hero"],
    bonuses:{
      2:{ atk:30, desc:"+30 ATK" },
      3:{ atk:60, hp:150, desc:"+60 ATK, +150 HP" },
      5:{ atk:150, hp:500, mana:200, def:60, crit:30, desc:"Full Set: Sovereign of Worlds" },
    },
  },
};


const ITEM_TO_SET = {};
Object.entries(ITEM_SETS).forEach(([setId, data]) => {
  data.pieces.forEach(p => { ITEM_TO_SET[p] = setId; });
});




const RECIPES = [

  { id:"r_iron_sword",  name:"Iron Sword",       produces:"w_sword1",    mats:{mat_iron:3, mat_wood:1}, gold:20, level:1 },
  { id:"r_steel_sword", name:"Steel Longsword",  produces:"w_sword2",    mats:{mat_iron:5, mat_silver:1, mat_wood:1}, gold:60, level:5 },
  { id:"r_mith_sword",  name:"Mithril Edge",     produces:"w_mythril",   mats:{mat_mithril:3, mat_silver:2, mat_soul:1}, gold:1500, level:15 },
  { id:"r_god_sword",   name:"Godslayer",        produces:"w_godslayer", mats:{mat_orichalc:2, mat_great_soul:2, mat_light_es:2}, gold:3000, level:25 },

  { id:"r_leather_vest",name:"Leather Vest",     produces:"a_leather",   mats:{mat_leather:3}, gold:20, level:1 },
  { id:"r_chain_mail",  name:"Chain Mail",       produces:"a_chain",     mats:{mat_iron:5, mat_leather:2}, gold:70, level:5 },
  { id:"r_mith_armor",  name:"Mithril Armor",    produces:"a_mithril",   mats:{mat_mithril:5, mat_troll_h:2}, gold:700, level:15 },
  { id:"r_dragon_mail", name:"Dragonscale Mail", produces:"a_dragon",    mats:{mat_dragon_s:5, mat_mithril:2, mat_fire_es:1}, gold:2000, level:22 },

  { id:"r_hp_pot",      name:"HP Potion",        produces:"p_hp",        mats:{mat_wood:1, mat_leather:1}, gold:15, level:1 },
  { id:"r_mana_pot",    name:"Mana Potion",      produces:"p_mana",      mats:{mat_spider_s:1}, gold:12, level:1 },
  { id:"r_elixir",      name:"Elixir of Power",  produces:"p_elixir",    mats:{mat_fire_es:1, mat_ice_es:1, mat_soul:1}, gold:400, level:10 },

  { id:"r_cut_ruby",    name:"Cut Ruby",         produces:"gem_ruby_m",  mats:{gem_ruby_s:3}, gold:100, level:5 },
  { id:"r_cut_saph",    name:"Cut Sapphire",     produces:"gem_saph_m",  mats:{gem_saph_s:3}, gold:100, level:5 },
  { id:"r_cut_em",      name:"Cut Emerald",      produces:"gem_em_m",    mats:{gem_em_s:3}, gold:100, level:5 },

  { id:"r_enchant",     name:"Enchant Orb",      produces:"cat_enchant", mats:{mat_fire_es:1, mat_light_es:1}, gold:250, level:10 },
  { id:"r_socket",      name:"Socket Punch",     produces:"cat_socket",  mats:{mat_mithril:3, mat_soul:2}, gold:800, level:15 },

  { id:"r_excalibur",   name:"Excalibur",        produces:"w_excalibur", mats:{mat_orichalc:3, mat_great_soul:3, mat_light_es:3, mat_mithril:5}, gold:5000, level:30 },
];


const ITEM_BY_ID = {};
ALL_ITEMS.forEach(it => { ITEM_BY_ID[it.id] = it; });
function itemById(id) { return ITEM_BY_ID[id]; }








const E = (id, name, icon, hp, atk, def, exp, gold, floor, extra = {}) =>
  ({ id, name, icon, hp, atk, def, exp, gold, floor, art: extra.art || `  ${icon}`, ...extra });
const ENEMY_DATA = [

  E("goblin",      "Goblin",          "x", 40, 8, 2, 20, 5,  1, { art:"  (>_<)\n   )=(\n  /   \\", biome:"crypt" }),
  E("rat",         "Giant Rat",       "x", 30, 6, 1, 15, 3,  1, { art:"  (_)\n  /www\\", biome:"sewer" }),
  E("spider",      "Cave Spider",     "x", 45, 10,3, 25, 6,  1, { art:"  /\\  /\\\n  |oo  oo|\n  \\----/", biome:"crypt", status:"POISON" }),
  E("imp",         "Imp",             "x", 35, 11,2, 22, 7,  1, { art:"  ^  ^\n (o  o)\n  \\--/", biome:"crypt", elem:"fire" }),
  E("zombie",      "Zombie",          "xx", 55, 7, 5, 28, 5,  1, { art:"  (x.x)\n  |   |\n  | | |", biome:"crypt" }),
  E("bat",         "Vampire Bat",     "x!", 28, 9, 1, 18, 4,  1, { art:"  /\\  /\\\n (oo  oo)\n  \\--/", biome:"crypt" }),
  E("slime",       "Slime",           "xx", 50, 5, 8, 20, 6,  1, { art:"  ._____.\n  |SLIME|\n  '-----'", biome:"sewer", status:"ACID" }),
  E("giantfrog",   "Giant Frog",      "x", 40, 8, 4, 22, 5,  1, { biome:"sewer", status:"POISON" }),
  E("rat_swarm",   "Rat Swarm",       "x", 35, 12,1, 24, 6,  1, { biome:"sewer" }),
  E("shade",       "Shade",           "x", 32, 10,2, 24, 8,  1, { biome:"crypt", elem:"dark", passive:"phase" }),
  E("worm",        "Cave Worm",       "x", 38, 7, 6, 19, 5,  1, { biome:"crypt" }),
  E("skeleton_r",  "Restless Skeleton","x",45, 9, 5, 26, 7,  1, { biome:"crypt" }),


  E("skeleton",    "Skeleton",        "x", 65, 16,7, 55, 14, 2, { art:"   .--.\n  (o o)\n  |   |\n  /|   |\\", biome:"catacomb" }),
  E("orc",         "Orc Warrior",     "x", 85, 20,9, 70, 18, 2, { art:"   ___\n  |o o|\n  | ^ |\n  /   \\", biome:"catacomb" }),
  E("witch",       "Witch",           "x", 60, 22,4, 75, 22, 2, { art:"  .  *  .\n  (o~o)\n  |HEX|", biome:"catacomb", status:"CURSE", elem:"dark" }),
  E("gnoll",       "Gnoll",           "x", 72, 18,6, 60, 16, 2, { art:"  /\\_/\\\n  (o.o)\n  / V \\", biome:"forest" }),
  E("mushroom",    "Poison Mushroom", "x ", 48, 14,10,45, 10, 2, { art:"   ___\n  (o o)\n  | M |", biome:"forest", status:"POISON" }),
  E("banshee",     "Banshee",         "x", 55, 24,3, 80, 24, 2, { art:"  ~~~*~~~\n  ~(o o)~", biome:"catacomb", status:"FEAR", elem:"dark" }),
  E("kobold",      "Kobold Mage",     "x}", 50, 20,4, 65, 20, 2, { art:"  (>.<)\n  |   |\n  // \\\\", biome:"forest", elem:"fire" }),
  E("ghoul",       "Ghoul",           "xx", 70, 18,8, 62, 16, 2, { biome:"catacomb", status:"DECAY" }),
  E("harpy",       "Harpy",           "x", 58, 22,5, 68, 18, 2, { biome:"mountain" }),
  E("dryad",       "Wild Dryad",      "xR", 62, 20,7, 66, 18, 2, { biome:"forest", status:"ROOT" }),
  E("fire_imp",    "Fire Imp",        "x ", 55, 24,4, 72, 22, 3, { biome:"volcano", elem:"fire", status:"BURN" }),
  E("ice_imp",     "Frost Imp",       " ", 55, 22,5, 70, 22, 3, { biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("specter",     "Specter",         "x", 68, 26,3, 82, 26, 3, { biome:"catacomb", elem:"dark", passive:"phase" }),
  E("plague_rat",  "Plague Rat",      "x", 52, 15,4, 55, 15, 3, { biome:"sewer", status:"PLAGUE" }),


  E("werewolf",    "Werewolf",        "x", 120,28,11,115,38, 4, { art:"  /\\_/\\\n  (o.o)\n  )ROAR(",  biome:"forest" }),
  E("darkknight",  "Dark Knight",     "x", 140,32,17,140,48, 4, { art:"  [|||]\n  |o o|", biome:"fortress" }),
  E("necromancer", "Necromancer",     "x", 105,30,7, 130,55, 4, { biome:"catacomb", elem:"dark", status:"CURSE" }),
  E("vampire",     "Vampire",         "x", 110,28,9, 125,52, 4, { biome:"catacomb", unique:"lifesteal", elem:"dark" }),
  E("golem",       "Stone Golem",     "x", 160,24,22,135,44, 4, { biome:"mountain" }),
  E("troll",       "Troll",           "x", 135,30,13,118,40, 4, { biome:"forest", passive:"regen" }),
  E("wyvern",      "Wyvern",          "x", 150,34,14,155,58, 5, { biome:"mountain", elem:"fire" }),
  E("wraith",      "Wraith",          "x", 90, 35,5, 120,50, 5, { biome:"catacomb", elem:"dark", passive:"phase" }),
  E("basilisk",    "Basilisk",        "x", 155,33,16,168,65, 5, { biome:"swamp", status:"PARALYZE" }),
  E("mummy",       "Mummy",           "xx", 145,28,12,142,52, 5, { biome:"desert", status:"CURSE" }),
  E("sand_worm",   "Sand Worm",       "x", 165,30,15,160,55, 5, { biome:"desert" }),
  E("wendigo",     "Wendigo",         " ", 135,36,8, 148,54, 5, { biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("giant_scorp", "Giant Scorpion",  "x", 125,32,14,140,50, 5, { biome:"desert", status:"POISON" }),
  E("shambler",    "Shambler",        "xx", 155,26,16,144,50, 5, { biome:"swamp" }),
  E("ogre",        "Ogre",            "x", 170,35,12,160,60, 5, { biome:"mountain" }),
  E("dire_wolf",   "Dire Wolf",       "x", 125,38,10,150,52, 6, { biome:"forest", passive:"pack" }),
  E("yeti",        "Yeti",            "x", 180,32,18,175,65, 6, { biome:"glacier", elem:"ice" }),
  E("salamander",  "Salamander",      "x}", 140,38,12,158,58, 6, { biome:"volcano", elem:"fire" }),
  E("lizardman",   "Lizardman",       "x}", 125,36,14,148,56, 6, { biome:"swamp" }),
  E("mantis",      "Giant Mantis",    "x", 130,40,11,152,55, 6, { biome:"forest", passive:"swift" }),


  E("elemental",   "Fire Elemental",  "x ", 150,38,12,170,62, 7, { biome:"volcano", elem:"fire", status:"BURN" }),
  E("ice_elem",    "Ice Elemental",   " ", 150,36,12,170,62, 7, { biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("thunder_elem","Thunder Elemental","a",150,40,10,172,64, 7, { biome:"mountain", elem:"lightning", status:"STUN" }),
  E("earth_elem",  "Earth Elemental", "x", 180,32,22,174,60, 7, { biome:"mountain" }),
  E("minotaur",    "Minotaur",        "x", 190,42,20,198,74, 7, { biome:"fortress" }),
  E("hydra",       "Hydra",           "x0", 200,36,15,210,80, 7, { biome:"swamp", passive:"regen" }),
  E("phoenix",     "Phoenix",         "x&", 175,44,13,185,78, 8, { biome:"volcano", elem:"fire", passive:"rebirth" }),
  E("abomination", "Abomination",     "x", 260,43,25,248,96, 9, { biome:"catacomb" }),
  E("shadow",      "Shadow Fiend",    "xR", 130,40,8, 163,60, 9, { biome:"void", elem:"dark", passive:"phase" }),
  E("lich",        "Lich",            "x", 220,47,22,238,92, 10,{ biome:"catacomb", elem:"dark", status:"CURSE" }),
  E("demon",       "Demon Lord",      "x", 240,51,24,258,98, 10,{ biome:"hell", elem:"fire", status:"BURN" }),
  E("dragon_wh",   "White Dragon",    "x0", 260,52,28,275,110,10,{ biome:"glacier", elem:"ice" }),
  E("dragon_bl",   "Black Dragon",    "x0", 255,55,26,280,115,10,{ biome:"swamp", elem:"dark", status:"POISON" }),
  E("chimera",     "Chimera",         "x0", 240,48,24,260,105,11,{ biome:"volcano", elem:"fire" }),
  E("manticore",   "Manticore",       "x", 220,50,22,250,100,11,{ biome:"desert" }),
  E("djinn",       "Djinn",           "S", 200,52,18,265,105,11,{ biome:"desert", elem:"arcane", status:"CHARM" }),
  E("behemoth",    "Behemoth",        "x", 290,48,30,285,115,12,{ biome:"mountain" }),
  E("kraken",      "Kraken",          "x", 270,52,25,290,120,12,{ biome:"swamp", status:"ROOT" }),
  E("golem_obs",   "Obsidian Golem",  "x", 310,42,36,300,120,12,{ biome:"volcano", elem:"fire" }),
  E("revenant",    "Revenant",        "x", 225,58,18,290,115,12,{ biome:"catacomb", elem:"dark", passive:"revive" }),


  E("ancient_dragon","Ancient Dragon","x0", 350,64,30,400,150,13,{ biome:"volcano", elem:"fire" }),
  E("void_wraith", "Void Wraith",     "xR", 200,57,18,378,142,13,{ biome:"void", elem:"dark", passive:"phase" }),
  E("titan",       "Shadow Titan",    "x", 400,60,35,450,170,14,{ biome:"void" }),
  E("elder_demon", "Elder Demon",     "x", 300,70,28,420,160,14,{ biome:"hell", elem:"dark", status:"CURSE" }),
  E("seraph",      "Fallen Seraph",   "x", 280,72,22,430,165,14,{ biome:"heavenly", elem:"holy", status:"HOLY_FIRE" }),
  E("cosmic_horror","Cosmic Horror",  "xRR", 450,80,40,600,220,16,{ biome:"void", elem:"arcane", status:"VOID" }),
  E("void_lord",   "Void Lord",       "xRR", 480,85,35,650,240,17,{ biome:"void", elem:"dark", status:"VOID" }),
  E("primordial",  "Primordial Beast","x0", 550,75,42,720,260,18,{ biome:"volcano" }),
  E("star_spawn",  "Star Spawn", ",  420,92,28,750,275,19,{ biome:"void", elem:"arcane" }),
  E("ender",       "Ender",           "xRR", 600,100,38,900,330,20,{ biome:"void", elem:"dark", status:"DOOM" }),


  E("boss_goblin_king","Goblin King", "x", 300, 30, 14, 400, 120, 1,
    { isBoss:true, mechanic:"summon_minions", biome:"crypt",
      art:"  ~~CROWN~~\n  |O    O|\n  |  GG  |\n  |KING  |" }),
  E("boss_spider_q","Spider Queen",   "x", 420, 36, 16, 500, 160, 3,
    { isBoss:true, mechanic:"poison_web", biome:"crypt", status:"POISON",
      art:"  /\\  /\\\n  QUEEN\n  OF WEB" }),
  E("boss_bone_dragon","Bone Dragon", "x", 500, 48, 22, 700, 220, 5,
    { isBoss:true, mechanic:"bone_nova", biome:"catacomb",
      art:"  BONE\n  /----\\\n  |X  X|\n  DRAGON" }),
  E("boss_werewolf","Alpha Werewolf", "x", 600, 55, 20, 850, 280, 7,
    { isBoss:true, mechanic:"enrage", biome:"forest",
      art:"  /\\_/\\\n  ALPHA\n  ROARS!" }),
  E("boss_minotaur","Minotaur Lord",  "x", 680, 58, 28, 920, 310, 8,
    { isBoss:true, mechanic:"charge", biome:"fortress" }),
  E("boss_shadow_titan","Shadow Titan","xR", 700, 62, 30, 1100, 440, 10,
    { isBoss:true, mechanic:"shadow_clone", biome:"void", elem:"dark",
      art:"  #########\n  #O     O#\n  # TITAN #\n  #########" }),
  E("boss_fire_lord","Fire Lord",     "x ", 820, 68, 28, 1250, 500, 11,
    { isBoss:true, mechanic:"inferno", biome:"volcano", elem:"fire", status:"BURN" }),
  E("boss_ice_queen","Ice Queen",     " ", 760, 66, 30, 1220, 490, 11,
    { isBoss:true, mechanic:"blizzard", biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("boss_lich_king","Lich King",     "x", 850, 72, 28, 1350, 540, 12,
    { isBoss:true, mechanic:"raise_dead", biome:"catacomb", elem:"dark", status:"CURSE" }),
  E("boss_demon","Pit Lord",          "x", 900, 75, 30, 1400, 560, 13,
    { isBoss:true, mechanic:"pit_flames", biome:"hell", elem:"fire" }),
  E("boss_hydra_queen","Hydra Queen", "x0", 900, 72, 25, 1400, 550, 15,
    { isBoss:true, mechanic:"multi_head", biome:"swamp",
      art:"  o  o  o\n  HYDRA\n  QUEEN!!!" }),
  E("boss_kraken","Kraken",           "x", 1050,78, 28, 1650, 650, 15,
    { isBoss:true, mechanic:"tentacles", biome:"swamp", status:"ROOT" }),
  E("boss_ancient","Ancient Dragon",  "x", 1200,85, 38, 2000, 800, 20,
    { isBoss:true, mechanic:"dragon_fury", biome:"volcano", elem:"fire",
      art:"  .--.\n  ANCIENT\n  DRAGON\n  AWAKENED" }),
  E("boss_void_lord","Void Lord",     "xR", 1300,92, 32, 2200, 850, 22,
    { isBoss:true, mechanic:"void_rift", biome:"void", elem:"dark", status:"VOID" }),
  E("boss_titan","Titan Colossus",    "x", 1500,88, 45, 2500, 900, 23,
    { isBoss:true, mechanic:"earth_shake", biome:"mountain" }),
  E("boss_god","God of Ruin",         "xR9", 2000,120,60, 5000, 2000,25,
    { isBoss:true, mechanic:"apocalypse", biome:"void",
      art:"  *GOD*\n  OF RUIN\n  AWAKENED\n  !!!!!!" }),
  E("boss_angel","Fallen Archangel",  "x", 1400,100,40, 3000, 1200,24,
    { isBoss:true, mechanic:"holy_judgment", biome:"heavenly", elem:"holy" }),
  E("boss_chrono","Chrono Guardian",  "R", 1200,95, 35, 2800, 1100,22,
    { isBoss:true, mechanic:"time_loop", biome:"void", elem:"arcane" }),
  E("boss_world","World Serpent",     "x", 2500,105,50, 6000, 2500,30,
    { isBoss:true, mechanic:"world_coil", biome:"void", elem:"dark" }),
  E("boss_creator","The Creator",     "xRx", 3500,140,70, 9999, 5000,40,
    { isBoss:true, mechanic:"creation", biome:"void", elem:"arcane" }),
  E("boss_destroyer","The Destroyer", "xRR", 5000,180,90, 12000,8000,50,
    { isBoss:true, mechanic:"destruction", biome:"void", elem:"dark" }),

  E("boss_infinity","Infinity Warden", ",  4000,160,80, 15000,6000,60,
    { isBoss:true, mechanic:"infinite", biome:"void", elem:"arcane" }),
  E("boss_aspect","Aspect of All",    "S", 6000,200,100,25000,15000,75,
    { isBoss:true, mechanic:"aspects", biome:"void", elem:"arcane" }),


  E("mimic",         "Mimic",             "x", 180, 40, 20, 300, 200, 5,
    { isMimic:true, biome:"any" }),
  E("treasure_goblin","Treasure Goblin",  "x", 60, 15, 5, 100, 500, 3,
    { rare:true, mechanic:"flee", biome:"any" }),
  E("ghost_king",    "Ghost King",        "x", 500, 65, 25, 1200, 400, 10,
    { rare:true, biome:"catacomb", elem:"dark" }),
];




const PETS = {
  WOLF:      { id:"wolf",    name:"Wolf",      icon:"x", hp:80, atk:15, def:5, desc:"Loyal melee companion",    tameable:true, spell:"Bite" },
  BEAR:      { id:"bear",    name:"Bear",      icon:"x", hp:150,atk:22, def:10,desc:"Heavy defensive tank",     tameable:true, spell:"Maul" },
  HAWK:      { id:"hawk",    name:"Hawk",      icon:"x&", hp:50, atk:20, def:3, desc:"Fast aerial striker",      tameable:true, spell:"Dive" },
  PANTHER:   { id:"panther", name:"Panther",   icon:"x ", hp:90, atk:25, def:6, desc:"Stealthy assassin",        tameable:true, spell:"Pounce" },
  FOX:       { id:"fox",     name:"Shadow Fox",icon:"x`", hp:60, atk:18, def:4, desc:"Clever trickster, evades", tameable:true, spell:"Illusion" },
  SPIDER:    { id:"spider",  name:"Spider",    icon:", hp:55, atk:14, def:4, desc:"Poisonous little friend",  tameable:true, spell:"Web" },
  BAT:       { id:"bat",     name:"Bat",       icon:"x!", hp:40, atk:16, def:2, desc:"Vampiric leech",           tameable:true, spell:"Drain" },

  SKELETON:  { id:"skelepet",name:"Skeleton Minion",icon:"x",hp:70,atk:18,def:5,desc:"Bone minion",              summonable:true, spell:"Bone Slash" },
  GHOUL:     { id:"ghoulpet",name:"Ghoul Minion",   icon:"xx",hp:100,atk:20,def:8,desc:"Flesh-eating ally",       summonable:true, spell:"Rend" },
  IMP:       { id:"imppet",  name:"Imp Familiar",   icon:"x",hp:55, atk:20,def:3,desc:"Fire-casting imp",        summonable:true, spell:"Flame Jab" },

  PHOENIX:   { id:"phoenix", name:"Phoenix Chick",icon:"xS",hp:120,atk:28,def:6,desc:"Reborn from ashes",         rare:true,     spell:"Rebirth Flame" },
  DRAGONLING:{ id:"dragonling",name:"Dragonling", icon:"x0",hp:150,atk:32,def:12,desc:"Young dragon",             rare:true,     spell:"Fire Breath" },
  UNICORN:   { id:"unicorn", name:"Unicorn",    icon:"x ", hp:130,atk:25, def:8,desc:"Mythical, heals you",       rare:true,     spell:"Healing Horn" },
  VOIDPET:   { id:"voidpup", name:"Void Pup",   icon:"xR", hp:100,atk:30, def:5,desc:"Strange otherworldly pup",   rare:true,     spell:"Void Shock" },
};


function enemiesForBiome(biome, floor) {
  return ENEMY_DATA.filter(e =>
    !e.isBoss &&
    !e.rare &&
    !e.isMimic &&
    (e.biome === biome || e.biome === "any" || !e.biome) &&
    e.floor <= Math.max(floor, 1) &&
    e.floor >= Math.max(1, floor - 8)
  );
}

function bossForFloor(floor) {
  const bosses = ENEMY_DATA.filter(e => e.isBoss && e.floor <= floor);
  if (!bosses.length) return ENEMY_DATA.find(e => e.id === "boss_goblin_king");
  return bosses.reduce((best, cur) => (cur.floor > best.floor ? cur : best), bosses[0]);
}

function generateEnemy(level, biome, dungeonTier = 1, isBoss = false, diff = "EASY") {
  const dData = DIFFICULTIES[diff] || DIFFICULTIES.EASY;
  const types = ENEMIES_BY_BIOME[biome] || ["goblin"];
  const id = isBoss ? DUNGEON_BY_ID[Object.keys(DUNGEON_BY_ID).find(k=>DUNGEON_BY_ID[k].biome===biome)]?.boss || "boss_goblin_king" : types[Math.floor(Math.random() * types.length)];
  const ed = ENEMIES[id] || ENEMIES.goblin;
  

  const hpBase = (ed.stats?.hp || 30) + (level * 12);
  const atkBase = (ed.stats?.atk || 5) + (level * 2);
  const defBase = (ed.stats?.def || 2) + (level * 1.5);
  
  const diffMult = dData.statMult;
  
  return {
    uid: Math.random().toString(36).substr(2, 9),
    id,
    name: ed.name,
    icon: ed.icon,
    level,
    maxHp: Math.floor(hpBase * diffMult),
    hp: Math.floor(hpBase * diffMult),
    atk: Math.floor(atkBase * diffMult),
    def: Math.floor(defBase * diffMult),
    exp: Math.floor(((level * 15) + (isBoss ? 200 : 20)) * dData.expMult),
    gold: Math.floor(((level * 5) + (isBoss ? 100 : 5)) * dData.lootMult),
    isBoss,
    spells: ed.spells || [],
    adaptiveRes: {}, // To track pattern adaptation
    lastAction: null
  };
}





const BIOMES = {
  DUNGEON: {
    id:"DUNGEON", name:"Stone Dungeon", icon:"x",
    wall:"#0a0a14", floor:"#1a1a28", accent:"#2d2d3d",
    desc:"Cold stone corridors. The classic dungeon crawl.",
    effects: { }, // neutral
    enemies:["goblin","rat","spider","imp","skeleton","orc","zombie","bat","slime"],
    minFloor:1,
  },
  CAVERN: {
    id:"CAVERN", name:"Crystal Caverns", icon:"x}",
    wall:"#1e1b4b", floor:"#221a3d", accent:"#4c1d95",
    desc:"Glowing crystals line the damp cavern walls.",
    effects: { manaRegen: 1.5 },
    enemies:["spider","bat","slime","mushroom","kobold","basilisk","cave_troll"],
    minFloor:2,
  },
  FOREST: {
    id:"FOREST", name:"Sunken Forest", icon:"xR",
    wall:"#14532d", floor:"#1a3a24", accent:"#16a34a",
    desc:"Twisted roots grip crumbled ruins. Nature reclaims all.",
    effects: { hpRegen: 1.2 },
    enemies:["gnoll","spider","witch","poison_elf","treant","bee_swarm","wolfkin"],
    minFloor:3,
  },
  SWAMP: {
    id:"SWAMP", name:"Blightmoor", icon:"xR",
    wall:"#064e3b", floor:"#134e4a", accent:"#0f766e",
    desc:"Toxic fumes rise from stagnant waters. Everything rots.",
    effects: { poisonChance: 0.15, hpRegen: 0.5 },
    enemies:["zombie","mushroom","banshee","plague_rat","bog_hag","snake_mire"],
    minFloor:4,
  },
  VOLCANO: {
    id:"VOLCANO", name:"Ember Depths", icon:"xR9",
    wall:"#7f1d1d", floor:"#431a1a", accent:"#dc2626",
    desc:"Lava flows beneath cracked stone. The heat is oppressive.",
    effects: { burnChance: 0.15, fireResist: 0.5 },
    enemies:["elemental","salamander","magma_hound","fire_imp","lava_golem"],
    minFloor:5,
  },
  FROZEN: {
    id:"FROZEN", name:"Icebound Halls", icon:" ",
    wall:"#0c4a6e", floor:"#164e63", accent:"#60a5fa",
    desc:"Ancient ice preserves forgotten horrors.",
    effects: { freezeChance: 0.12, spdMult: 0.9 },
    enemies:["ice_troll","frost_wraith","yeti","ice_mage","winter_wolf"],
    minFloor:5,
  },
  NECROPOLIS: {
    id:"NECROPOLIS", name:"City of the Dead", icon:"x",
    wall:"#1e1b2e", floor:"#1a1a2e", accent:"#64748b",
    desc:"Rows of silent tombs. The dead do not stay buried.",
    effects: { undeadBonus: 1.3 },
    enemies:["skeleton","zombie","wraith","lich","banshee","necromancer","bone_lord"],
    minFloor:6,
  },
  CATHEDRAL: {
    id:"CATHEDRAL", name:"Fallen Cathedral", icon:":",
    wall:"#fbbf2422", floor:"#fef3c7", accent:"#fbbf24",
    desc:"Sacred grounds corrupted. Angels and demons clash.",
    effects: { holyDmg: 1.3, shrinePower: 2.0 },
    enemies:["corrupt_angel","fallen_priest","hellhound","demon","seraph"],
    minFloor:8,
  },
  ABYSS: {
    id:"ABYSS", name:"The Abyss", icon:"xR",
    wall:"#020617", floor:"#0f172a", accent:"#581c87",
    desc:"Where reality breaks down. Colors lose meaning.",
    effects: { voidDmg: 1.3, critChance: 0.05 },
    enemies:["shadow","abomination","void_wraith","eldritch","eye_tyrant"],
    minFloor:10,
  },
  SKYHOLD: {
    id:"SKYHOLD", name:"Skyhold Ruins", icon:"x:",
    wall:"#1e3a5f", floor:"#1e40af33", accent:"#60a5fa",
    desc:"Floating ruins in the high clouds.",
    effects: { spdMult: 1.15 },
    enemies:["gryphon","storm_eagle","cloud_giant","sky_ranger","wyvern"],
    minFloor:7,
  },
  MECHANICAL: {
    id:"MECHANICAL", name:"Clockwork Halls", icon:",
    wall:"#44403c", floor:"#292524", accent:"#f59e0b",
    desc:"Gears grind eternally. Built by forgotten artisans.",
    effects: { trapChance: 0.2 },
    enemies:["clockwork","iron_sentry","steamgolem","construct","cogspider"],
    minFloor:9,
  },
  UNDERWATER: {
    id:"UNDERWATER", name:"Drowned Depths", icon:"xR`",
    wall:"#0c4a6e", floor:"#164e63", accent:"#06b6d4",
    desc:"Flooded ruins. Breathe shallow   they hunt.",
    effects: { spdMult: 0.85, lightningDmg: 1.4 },
    enemies:["merrow","deep_one","kraken_spawn","drowned","hydra"],
    minFloor:8,
  },
  HELL: {
    id:"HELL", name:"Inferno Pits", icon:"x",
    wall:"#7f1d1d", floor:"#450a0a", accent:"#ef4444",
    desc:"The deepest punishment. Nothing is saved here.",
    effects: { burnChance: 0.25, darkDmg: 1.3 },
    enemies:["demon","hellhound","imp","tormentor","archdemon","pit_fiend"],
    minFloor:12,
  },
  CELESTIAL: {
    id:"CELESTIAL", name:"Celestial Court", icon:"xRx",
    wall:"#fef9c3", floor:"#fef08a33", accent:"#fde047",
    desc:"Gold-paved roads of heaven, now contested.",
    effects: { holyDmg: 1.5, hpRegen: 1.5 },
    enemies:["seraph","archangel","radiant_knight","cherub","throne_angel"],
    minFloor:15,
  },
  VOID: {
    id:"VOID", name:"Void Between", icon:"xR",
    wall:"#030712", floor:"#0f0a1e", accent:"#8b5cf6",
    desc:"Beyond space and time. The impossible lurks.",
    effects: { voidDmg: 1.5, allResist: 0.7 },
    enemies:["void_wraith","eldritch","cosmic_horror","null_being","elder_god"],
    minFloor:18,
  },
  CRYSTAL_GARDEN: {
    id:"CRYSTAL_GARDEN", name:"Crystal Garden", icon:"xR",
    wall:"#fae8ff", floor:"#f5d0fe33", accent:"#e879f9",
    desc:"A surreal dreamscape of living crystal flora.",
    effects: { manaRegen: 2.0, charmChance: 0.1 },
    enemies:["crystal_sprite","faerie","bloom_beast","mirror_wisp","dream_weaver"],
    minFloor:11,
  },
};
const BIOME_ORDER = Object.keys(BIOMES);
function biomeForFloor(floor) {

  const avail = BIOME_ORDER.filter(id => BIOMES[id].minFloor <= floor);
  if (avail.length === 0) return "DUNGEON";

  const idx = Math.floor((floor - 1) / 2 + Math.random() * 2) % avail.length;
  return avail[idx];
}




const WEATHER = {
  CLEAR:     { id:"CLEAR",     name:"Clear",     icon:", desc:"Normal conditions.", effects:{} },
  RAIN:      { id:"RAIN",      name:"Rainfall",  icon:"xR", desc:"Fire 30%, Lightning +30%.", effects:{fireDmg:0.7,lightningDmg:1.3} },
  STORM:     { id:"STORM",     name:"Storm",     icon:":", desc:"Lightning +60%, chance to stun.", effects:{lightningDmg:1.6,stunChance:0.1} },
  FOG:       { id:"FOG",       name:"Heavy Fog", icon:"xR", desc:"+15% dodge both sides, range hits 70%.", effects:{dodgeAll:0.15} },
  BLIZZARD:  { id:"BLIZZARD",  name:"Blizzard",  icon:"xR", desc:"Ice +40%, SPD 20%.", effects:{iceDmg:1.4,spdMult:0.8} },
  HEATWAVE:  { id:"HEATWAVE",  name:"Heatwave",  icon:"x ", desc:"Fire +40%, MP regen 50%.", effects:{fireDmg:1.4,manaRegen:0.5} },
  ECLIPSE:   { id:"ECLIPSE",   name:"Eclipse",   icon:"xR", desc:"Dark +50%, Holy 30%.", effects:{darkDmg:1.5,holyDmg:0.7} },
  AURORA:    { id:"AURORA",    name:"Aurora",    icon:"xRR", desc:"Arcane +50%, crits doubled.", effects:{arcaneDmg:1.5,critMult:1.25} },
  BLOOD_MOON:{ id:"BLOOD_MOON",name:"Blood Moon",icon:", desc:"All enemies +25% ATK, +drops.", effects:{enemyAtk:1.25,lootBonus:1.5} },
};
const WEATHER_LIST = Object.keys(WEATHER);
function rollWeather(floor) {
  if (floor < 3) return "CLEAR";
  const pool = floor > 10
    ? ["CLEAR","RAIN","STORM","FOG","BLIZZARD","HEATWAVE","ECLIPSE","AURORA","BLOOD_MOON"]
    : ["CLEAR","CLEAR","RAIN","FOG","STORM","HEATWAVE","BLIZZARD"];
  return pool[Math.floor(Math.random() * pool.length)];
}




const TIME_OF_DAY = {
  DAWN:  { id:"DAWN",  name:"Dawn",  icon:"xR&", tint:"#fde68a33", desc:"Holy dmg +20%." , effects:{holyDmg:1.2} },
  DAY:   { id:"DAY",   name:"Day",   icon:", tint:"#fef3c733", desc:"Normal conditions.", effects:{} },
  DUSK:  { id:"DUSK",  name:"Dusk",  icon:"xR ", tint:"#f97316aa", desc:"Stealth +20%.", effects:{dodgeAll:0.1} },
  NIGHT: { id:"NIGHT", name:"Night", icon:", tint:"#1e1b4baa", desc:"Undead +30% HP, Dark dmg +25%.", effects:{darkDmg:1.25,undeadBonus:1.3} },
  WITCHING:{id:"WITCHING",name:"Witching Hour",icon:"xR", tint:"#581c87aa", desc:"All spells cost 50% MP. Enemies aggressive.", effects:{manaCost:0.5,enemyAtk:1.2} },
};
const TIME_ORDER = ["DAWN","DAY","DUSK","NIGHT","WITCHING"];
function nextTime(t) {
  const i = TIME_ORDER.indexOf(t);
  return TIME_ORDER[(i + 1) % TIME_ORDER.length];
}






const FACTIONS = {
  IRONHOLD: {
    id:"IRONHOLD", name:"The Ironhold Order", icon:"a", color:"#f59e0b",
    desc:"A warrior brotherhood of dwarven smiths. Values steel and strength.",
    hq:"Ironhold Keep",
    tiers:[
      { tier:0, name:"Stranger",    min:0 },
      { tier:1, name:"Initiate",    min:100, unlock:"5% discount at shops" },
      { tier:2, name:"Soldier",     min:300, unlock:"Crafting recipes for iron weapons" },
      { tier:3, name:"Captain",     min:700, unlock:"Access to Ironhold Quartermaster" },
      { tier:4, name:"Warlord",     min:1500, unlock:"Legendary weapon: Ironhold Edge" },
      { tier:5, name:"Grandmaster", min:3500, unlock:"Mythic hammer + Forgelord title" },
    ],
    rivals:["SHADOWVEIL"],
    allies:["EMBER_CONCLAVE"],
  },
  ARCANE_COUNCIL: {
    id:"ARCANE_COUNCIL", name:"The Arcane Council", icon:"x ", color:"#3b82f6",
    desc:"Scholar-mages who catalog all magic. Values knowledge.",
    hq:"The Spire of Lumos",
    tiers:[
      { tier:0, name:"Outsider",    min:0 },
      { tier:1, name:"Apprentice",  min:100, unlock:"Scrolls at reduced price" },
      { tier:2, name:"Adept",       min:300, unlock:"Access to rare scrolls" },
      { tier:3, name:"Magister",    min:700, unlock:"+50 max mana passive" },
      { tier:4, name:"Archmage",    min:1500, unlock:"Mythic staff craftable" },
      { tier:5, name:"Oracle",      min:3500, unlock:"All spells cost 15% less MP" },
    ],
    rivals:["BONEMARROW"],
    allies:["CELESTIAL_HOST"],
  },
  SHADOWVEIL: {
    id:"SHADOWVEIL", name:"The Shadowveil", icon:"x", color:"#8b5cf6",
    desc:"A thieves guild. Deals in secrets and blades.",
    hq:"The Hidden Tavern",
    tiers:[
      { tier:0, name:"Unknown",     min:0 },
      { tier:1, name:"Mark",        min:100, unlock:"Black market access" },
      { tier:2, name:"Blade",       min:300, unlock:"Stealth potions +quality" },
      { tier:3, name:"Shadow",      min:700, unlock:"Lockpick   always succeeds" },
      { tier:4, name:"Assassin",    min:1500, unlock:"Shadowstrike dagger + Poison master" },
      { tier:5, name:"Shadowlord",  min:3500, unlock:"Phase-step: once per floor, teleport" },
    ],
    rivals:["IRONHOLD","CELESTIAL_HOST"],
    allies:["BONEMARROW"],
  },
  CELESTIAL_HOST: {
    id:"CELESTIAL_HOST", name:"The Celestial Host", icon:"x!", color:"#fde047",
    desc:"Paladins and clerics. Values light and mercy.",
    hq:"The Cathedral of Dawn",
    tiers:[
      { tier:0, name:"Lay",         min:0 },
      { tier:1, name:"Acolyte",     min:100, unlock:"Free heal once per floor" },
      { tier:2, name:"Priest",      min:300, unlock:"Resurrection service in towns" },
      { tier:3, name:"Paladin",     min:700, unlock:"+15 HP regen passive" },
      { tier:4, name:"Templar",     min:1500, unlock:"Divine Plate crafting" },
      { tier:5, name:"Hierophant",  min:3500, unlock:"Auto-revive once per run" },
    ],
    rivals:["BONEMARROW","ABYSSAL_CULT"],
    allies:["ARCANE_COUNCIL","IRONHOLD"],
  },
  BONEMARROW: {
    id:"BONEMARROW", name:"The Bonemarrow Cult", icon:"x", color:"#64748b",
    desc:"Necromancers who defy death. Values domination.",
    hq:"The Ossuary",
    tiers:[
      { tier:0, name:"Living",      min:0 },
      { tier:1, name:"Acolyte",     min:100, unlock:"Raise Dead scroll" },
      { tier:2, name:"Deathcaller", min:300, unlock:"Undead pets remain between floors" },
      { tier:3, name:"Necromancer", min:700, unlock:"+20% dark damage" },
      { tier:4, name:"Liche",       min:1500, unlock:"Lich Crown equipment" },
      { tier:5, name:"Eternal",     min:3500, unlock:"Undeath: revive as lich once per run" },
    ],
    rivals:["CELESTIAL_HOST"],
    allies:["SHADOWVEIL","ABYSSAL_CULT"],
  },
  EMBER_CONCLAVE: {
    id:"EMBER_CONCLAVE", name:"The Ember Conclave", icon:"x ", color:"#ef4444",
    desc:"Fire-worshipers of the volcano. Masters of forge magic.",
    hq:"Emberkeep",
    tiers:[
      { tier:0, name:"Ashen",       min:0 },
      { tier:1, name:"Emberborn",   min:100, unlock:"Fire-infusion recipes" },
      { tier:2, name:"Flamewalker", min:300, unlock:"Fire resistance +30%" },
      { tier:3, name:"Pyromancer",  min:700, unlock:"Flamebrand +upgrade" },
      { tier:4, name:"Inferno",     min:1500, unlock:"Phoenix companion" },
      { tier:5, name:"Ashen King",  min:3500, unlock:"Meteor passive on kill" },
    ],
    rivals:["FROSTWARD"],
    allies:["IRONHOLD"],
  },
  FROSTWARD: {
    id:"FROSTWARD", name:"The Frostward Kin", icon:"x`", color:"#60a5fa",
    desc:"Northern clans who bind ice. Cold-hearted but honorable.",
    hq:"Frostward Hall",
    tiers:[
      { tier:0, name:"Stranger",    min:0 },
      { tier:1, name:"Kin",         min:100, unlock:"Ice resistance +30%" },
      { tier:2, name:"Winterborn",  min:300, unlock:"Frostfang craftable" },
      { tier:3, name:"Winter Hunter",min:700,unlock:"Ice spells chance to freeze 2x" },
      { tier:4, name:"Frostlord",   min:1500, unlock:"Summon ice wolf pack" },
      { tier:5, name:"Jotun",       min:3500, unlock:"Absolute Zero   freeze all" },
    ],
    rivals:["EMBER_CONCLAVE"],
    allies:[],
  },
  ABYSSAL_CULT: {
    id:"ABYSSAL_CULT", name:"The Abyssal Eye", icon:"x", color:"#a855f7",
    desc:"Worshipers of the void. Forbidden, dangerous, powerful.",
    hq:"The Eyeless Temple",
    tiers:[
      { tier:0, name:"Sane",        min:0 },
      { tier:1, name:"Whispered",   min:100, unlock:"Void scrolls" },
      { tier:2, name:"Tainted",     min:300, unlock:"+1 spell slot" },
      { tier:3, name:"Touched",     min:700, unlock:"Eldritch Sight   see all traps" },
      { tier:4, name:"Unmade",      min:1500, unlock:"Reality Tear scroll" },
      { tier:5, name:"Eye of the Abyss",min:3500, unlock:"Void form transformation" },
    ],
    rivals:["CELESTIAL_HOST"],
    allies:["BONEMARROW"],
  },
};
const FACTION_LIST = Object.keys(FACTIONS);
function initialReputation() {
  const rep = {};
  FACTION_LIST.forEach(f => { rep[f] = 0; });
  return rep;
}
function tierFor(factionId, reputation) {
  const f = FACTIONS[factionId];
  if (!f) return null;
  let best = f.tiers[0];
  for (const t of f.tiers) if (reputation >= t.min) best = t;
  return best;
}
function gainRep(repObj, factionId, amount) {
  const next = { ...repObj };
  const f = FACTIONS[factionId];
  if (!f) return next;
  next[factionId] = Math.max(0, (next[factionId] || 0) + amount);

  if (amount > 0) {
    (f.rivals || []).forEach(r => { next[r] = Math.max(0, (next[r] || 0) - Math.floor(amount * 0.3)); });
    (f.allies || []).forEach(a => { next[a] = (next[a] || 0) + Math.floor(amount * 0.1); });
  }
  return next;
}







const ACHIEVEMENTS = [

  { id:"a_slayer_1",  cat:"Slayer",    name:"First Blood",      desc:"Kill 1 enemy",          metric:"kills", goal:1,     reward:{gold:20} },
  { id:"a_slayer_2",  cat:"Slayer",    name:"Getting Warm",     desc:"Kill 25 enemies",       metric:"kills", goal:25,    reward:{gold:100} },
  { id:"a_slayer_3",  cat:"Slayer",    name:"Veteran",          desc:"Kill 100 enemies",      metric:"kills", goal:100,   reward:{title:"Veteran",gold:300} },
  { id:"a_slayer_4",  cat:"Slayer",    name:"Butcher",          desc:"Kill 500 enemies",      metric:"kills", goal:500,   reward:{title:"Butcher",atk:5} },
  { id:"a_slayer_5",  cat:"Slayer",    name:"Annihilator",      desc:"Kill 2000 enemies",     metric:"kills", goal:2000,  reward:{title:"Annihilator",atk:15} },
  { id:"a_slayer_6",  cat:"Slayer",    name:"Extinction",       desc:"Kill 10000 enemies",    metric:"kills", goal:10000, reward:{title:"Extinction",mythic:true} },

  { id:"a_boss_1",    cat:"Boss",      name:"Kingslayer",       desc:"Defeat the Goblin King",metric:"bossKills",goal:1,  reward:{gold:200} },
  { id:"a_boss_3",    cat:"Boss",      name:"Boss Hunter",      desc:"Defeat 3 bosses",       metric:"bossKills",goal:3,  reward:{title:"Boss Hunter",gold:500} },
  { id:"a_boss_10",   cat:"Boss",      name:"Worldslayer",      desc:"Defeat 10 bosses",      metric:"bossKills",goal:10, reward:{title:"Worldslayer",hp:50} },

  { id:"a_floor_5",   cat:"Depth",     name:"Descent",          desc:"Reach floor 5",         metric:"floor", goal:5,     reward:{gold:150} },
  { id:"a_floor_10",  cat:"Depth",     name:"Deep Diver",       desc:"Reach floor 10",        metric:"floor", goal:10,    reward:{title:"Deep Diver",gold:500} },
  { id:"a_floor_20",  cat:"Depth",     name:"Abyssal",          desc:"Reach floor 20",        metric:"floor", goal:20,    reward:{title:"Abyssal",mythic:true} },
  { id:"a_floor_50",  cat:"Depth",     name:"Endless",          desc:"Reach floor 50",        metric:"floor", goal:50,    reward:{title:"Endless",cosmetic:"crown" } },
  { id:"a_floor_100", cat:"Depth",     name:"Worldborn",        desc:"Reach floor 100",       metric:"floor", goal:100,   reward:{title:"Worldborn",cosmetic:"void_aura" } },

  { id:"a_lvl_5",     cat:"Growth",    name:"Burgeoning",       desc:"Reach level 5",         metric:"level", goal:5,     reward:{gold:100} },
  { id:"a_lvl_10",    cat:"Growth",    name:"Seasoned",         desc:"Reach level 10",        metric:"level", goal:10,    reward:{gold:300} },
  { id:"a_lvl_20",    cat:"Growth",    name:"Master",           desc:"Reach level 20 (unlock subclass)", metric:"level", goal:20, reward:{title:"Master",subclass:true} },
  { id:"a_lvl_50",    cat:"Growth",    name:"Legendary",        desc:"Reach level 50",        metric:"level", goal:50,    reward:{title:"Legendary",atk:10,def:10} },
  { id:"a_lvl_100",   cat:"Growth",    name:"Transcendent",     desc:"Reach level 100",       metric:"level", goal:100,   reward:{title:"Transcendent",cosmetic:"halo" } },

  { id:"a_gold_1k",   cat:"Wealth",    name:"Coin Collector",   desc:"Hoard 1,000 gold",      metric:"gold",  goal:1000,  reward:{gold:100} },
  { id:"a_gold_10k",  cat:"Wealth",    name:"Merchant",         desc:"Hoard 10,000 gold",     metric:"gold",  goal:10000, reward:{title:"Merchant" } },
  { id:"a_gold_100k", cat:"Wealth",    name:"Dragonhoarder",    desc:"Hoard 100,000 gold",    metric:"gold",  goal:100000,reward:{title:"Dragonhoarder",cosmetic:"gold_aura" } },

  { id:"a_item_10",   cat:"Collector", name:"Gathering",        desc:"Find 10 items",         metric:"items", goal:10,    reward:{gold:50} },
  { id:"a_item_50",   cat:"Collector", name:"Packrat",          desc:"Find 50 items",         metric:"items", goal:50,    reward:{gold:200} },
  { id:"a_item_200",  cat:"Collector", name:"Hoarder",          desc:"Find 200 items",        metric:"items", goal:200,   reward:{title:"Hoarder" } },
  { id:"a_item_1000", cat:"Collector", name:"Archivist",        desc:"Find 1000 items",       metric:"items", goal:1000,  reward:{title:"Archivist",mythic:true} },

  { id:"a_myth_1",    cat:"Rarity",    name:"Beyond Legend",    desc:"Find a Mythic item",    metric:"mythicFound",goal:1,reward:{title:"Mythwalker" } },
  { id:"a_myth_5",    cat:"Rarity",    name:"Myth Collector",   desc:"Find 5 Mythic items",   metric:"mythicFound",goal:5,reward:{title:"Myth Collector",mythic:true} },

  { id:"a_set_1",     cat:"Rarity",    name:"Completionist",    desc:"Complete 1 item set",   metric:"setsComplete",goal:1,reward:{gold:500} },
  { id:"a_set_3",     cat:"Rarity",    name:"Set Master",       desc:"Complete 3 item sets",  metric:"setsComplete",goal:3,reward:{title:"Set Master" } },
  { id:"a_set_all",   cat:"Rarity",    name:"Legendary Attire", desc:"Complete all item sets",metric:"setsComplete",goal:6,reward:{title:"Legendary Attire",cosmetic:"rainbow_aura" } },

  { id:"a_spells_10", cat:"Arcana",    name:"Student",          desc:"Know 10 spells",        metric:"spellsKnown",goal:10,reward:{gold:100} },
  { id:"a_spells_25", cat:"Arcana",    name:"Scholar",          desc:"Know 25 spells",        metric:"spellsKnown",goal:25,reward:{title:"Scholar",mana:30} },
  { id:"a_spells_50", cat:"Arcana",    name:"Grimoire",         desc:"Know 50 spells",        metric:"spellsKnown",goal:50,reward:{title:"Grimoire",mana:80} },
  { id:"a_spells_all",cat:"Arcana",    name:"Omniscient",       desc:"Know every spell",      metric:"spellsKnown",goal:80,reward:{title:"Omniscient",cosmetic:"rune_halo" } },

  { id:"a_pet_1",     cat:"Beastmaster",name:"Companion",       desc:"Tame a pet",            metric:"petsTamed",goal:1,   reward:{gold:100} },
  { id:"a_pet_5",     cat:"Beastmaster",name:"Pack Leader",     desc:"Tame 5 pets",           metric:"petsTamed",goal:5,   reward:{title:"Pack Leader" } },
  { id:"a_pet_all",   cat:"Beastmaster",name:"Zoo Master",      desc:"Tame 12 pets",          metric:"petsTamed",goal:12,  reward:{title:"Zoo Master",cosmetic:"pet_crown" } },

  { id:"a_recipe_5",  cat:"Crafter",   name:"Apprentice Smith", desc:"Learn 5 recipes",       metric:"recipesLearned",goal:5, reward:{gold:200} },
  { id:"a_recipe_15", cat:"Crafter",   name:"Master Crafter",   desc:"Learn 15 recipes",      metric:"recipesLearned",goal:15,reward:{title:"Master Crafter" } },
  { id:"a_recipe_all",cat:"Crafter",   name:"Grandmaster Smith",desc:"Learn all recipes",     metric:"recipesLearned",goal:30,reward:{title:"Grandmaster Smith",mythic:true} },

  { id:"a_quest_1",   cat:"Adventurer",name:"Hero Begins",      desc:"Complete 1 quest",      metric:"questsDone",goal:1,  reward:{gold:100} },
  { id:"a_quest_10",  cat:"Adventurer",name:"Journey",          desc:"Complete 10 quests",    metric:"questsDone",goal:10, reward:{title:"Journey" } },
  { id:"a_quest_50",  cat:"Adventurer",name:"Chosen One",       desc:"Complete 50 quests",    metric:"questsDone",goal:50, reward:{title:"Chosen One",cosmetic:"quest_seal" } },

  { id:"a_biome_5",   cat:"Explorer",  name:"Traveler",         desc:"See 5 biomes",          metric:"biomesSeen",goal:5,  reward:{gold:200} },
  { id:"a_biome_10",  cat:"Explorer",  name:"Worldwalker",      desc:"See 10 biomes",         metric:"biomesSeen",goal:10, reward:{title:"Worldwalker" } },
  { id:"a_biome_all", cat:"Explorer",  name:"Cartographer",     desc:"See all biomes",        metric:"biomesSeen",goal:16, reward:{title:"Cartographer",mythic:true} },

  { id:"a_runs_1",    cat:"Survivor",  name:"First Run",        desc:"Complete a run",        metric:"runs",  goal:1,  reward:{gold:200} },
  { id:"a_runs_10",   cat:"Survivor",  name:"Persistent",       desc:"Complete 10 runs",      metric:"runs",  goal:10, reward:{title:"Persistent" } },
  { id:"a_runs_100",  cat:"Survivor",  name:"Eternal Hero",     desc:"Complete 100 runs",     metric:"runs",  goal:100,reward:{title:"Eternal Hero" } },
  { id:"a_death_10",  cat:"Survivor",  name:"Death Acquainted", desc:"Die 10 times",          metric:"deaths",goal:10, reward:{title:"Death Acquainted" } },
  { id:"a_crit_100",  cat:"Survivor",  name:"Crit Master",      desc:"Land 100 crits",        metric:"crits", goal:100,reward:{title:"Crit Master",crit:5} },
  { id:"a_crit_1k",   cat:"Survivor",  name:"Crit Lord",        desc:"Land 1000 crits",       metric:"crits", goal:1000,reward:{title:"Crit Lord",crit:10} },
];
function initialAchievementProgress() {
  const p = {};
  ACHIEVEMENTS.forEach(a => { p[a.id] = { done:false, progress:0 }; });
  return p;
}
function checkAchievements(stats, progress) {
  const newly = [];
  const next = { ...progress };
  ACHIEVEMENTS.forEach(a => {
    const cur = next[a.id] || { done:false, progress:0 };
    if (cur.done) return;
    const val = stats[a.metric] || 0;
    cur.progress = val;
    if (val >= a.goal) { cur.done = true; newly.push(a); }
    next[a.id] = cur;
  });
  return { newly, next };
}






const QUEST_TEMPLATES = [

  { id:"q_kill_goblins", type:"kill", enemyId:"goblin", count:8,
    name:"Greenskin Menace", desc:"Slay {count} goblins in the dungeon",
    reward:{gold:200,exp:150,rep:{IRONHOLD:30}} },
  { id:"q_kill_undead",  type:"kill", tag:"undead", count:12,
    name:"Restless Dead", desc:"Slay {count} undead",
    reward:{gold:400,exp:300,rep:{CELESTIAL_HOST:40}} },
  { id:"q_kill_boss",    type:"boss", count:1,
    name:"Hero's Trial", desc:"Defeat any boss",
    reward:{gold:600,exp:500,item:"m_crystal" } },
  { id:"q_kill_big",     type:"kill", count:30,
    name:"Monster Cull", desc:"Slay any {count} enemies",
    reward:{gold:300,exp:200} },

  { id:"q_descend_5",    type:"floor", count:5,
    name:"The Descent", desc:"Reach floor {count}",
    reward:{gold:500,exp:400} },
  { id:"q_descend_10",   type:"floor", count:10,
    name:"Deeper Still", desc:"Reach floor {count}",
    reward:{gold:1000,exp:800,item:"m_fang" } },

  { id:"q_gather_iron",  type:"gather", itemId:"mat_iron", count:10,
    name:"Ironmonger", desc:"Gather {count} Iron Ore",
    reward:{gold:150,rep:{IRONHOLD:20}} },
  { id:"q_gather_soul",  type:"gather", itemId:"mat_soul", count:3,
    name:"Soul Harvest", desc:"Gather {count} Soul Shards",
    reward:{gold:500,rep:{BONEMARROW:40}} },
  { id:"q_gather_gem",   type:"gather", itemId:"gem_ruby_s", count:5,
    name:"Gemhunter", desc:"Gather {count} rubies",
    reward:{gold:400,item:"gem_ruby_m" } },

  { id:"q_clear_chests", type:"chest", count:5,
    name:"Treasure Hunter", desc:"Open {count} chests",
    reward:{gold:200,exp:100} },
  { id:"q_crit_streak",  type:"crit", count:20,
    name:"Deadly Precision", desc:"Land {count} critical strikes",
    reward:{gold:300,exp:200,rep:{SHADOWVEIL:30}} },

  { id:"q_goblin_king",  type:"boss", enemyId:"boss_goblin_king", count:1,
    name:"Crown of the Greenskin", desc:"Slay the Goblin King",
    reward:{gold:800,exp:600,item:"m_ring" } },
  { id:"q_dragon",       type:"boss", enemyId:"boss_ancient", count:1,
    name:"Dragonslayer", desc:"Slay the Ancient Dragon",
    reward:{gold:3000,exp:2000,item:"m_fang",title:"Dragonslayer" } },
];


const DAILY_CHALLENGES = [
  { id:"d_speed",    name:"Speed Runner", desc:"Clear 5 floors in one run", metric:"floorsCleared", goal:5,  reward:{gold:500,exp:300} },
  { id:"d_pacifist", name:"Pacifist",     desc:"Clear a floor without killing",metric:"peacefulFloors", goal:1, reward:{gold:600,rep:{CELESTIAL_HOST:50}} },
  { id:"d_glass",    name:"Glass Cannon", desc:"Deal 1000+ dmg in one hit",    metric:"biggestHit", goal:1000, reward:{gold:700,exp:400} },
  { id:"d_mythic",   name:"Lucky Soul",   desc:"Find a mythic in a single run",metric:"mythicThisRun", goal:1, reward:{gold:1500,item:"m_godstone" } },
  { id:"d_combo",    name:"Comboer",      desc:"Chain 10 spells without miss", metric:"spellChain", goal:10, reward:{gold:800} },
];
const WEEKLY_CHALLENGES = [
  { id:"w_kills",    name:"Weekly Slayer",    desc:"Kill 300 enemies this week",   metric:"weeklyKills", goal:300, reward:{gold:5000,exp:3000,item:"m_coin" } },
  { id:"w_floor",    name:"Weekly Explorer",  desc:"Reach floor 25 in one run",    metric:"weeklyFloor", goal:25,  reward:{gold:8000,title:"Weekly Explorer" } },
  { id:"w_bosses",   name:"Weekly Boss Run",  desc:"Defeat 10 bosses this week",   metric:"weeklyBosses",goal:10,  reward:{gold:10000,item:"m_fang" } },
  { id:"w_craft",    name:"Weekly Artisan",   desc:"Craft 20 items this week",     metric:"weeklyCrafts",goal:20,  reward:{gold:6000,title:"Artisan" } },
];


const EVENTS = [
  { id:"e_harvest",    name:"Harvest Festival", icon:"x}",
    desc:"Pumpkin enemies drop extra gold; special boss: Great Pumpkin King!",
    bonuses:{goldBonus:1.5,expBonus:1.2}, uniqueBoss:"boss_pumpkin", durationHours:72 },
  { id:"e_winter",     name:"Winterveil",       icon:" ",
    desc:"All enemies wear red hats; Frost damage +50%; Santa chest drops.",
    bonuses:{iceDmg:1.5,xmasDrops:true}, durationHours:96 },
  { id:"e_bloodmoon",  name:"Blood Moon Rises", icon:",
    desc:"Enemies are aggressive and strong, but drops are doubled.",
    bonuses:{enemyHp:1.3,enemyAtk:1.3,lootBonus:2.0}, durationHours:24 },
  { id:"e_arcane",     name:"Arcane Convergence",icon:"x ",
    desc:"All spells cost half mana; rare scrolls everywhere.",
    bonuses:{manaCost:0.5,scrollBonus:3.0}, durationHours:48 },
  { id:"e_chaos",      name:"Chaos Incursion",  icon:"xR",
    desc:"Random status effects apply constantly; rare demon loot.",
    bonuses:{chaosMode:true,demonLoot:true}, durationHours:48 },
  { id:"e_unity",      name:"Unity Festival",   icon:"x}`",
    desc:"All factions give 2x reputation. Special vendor unlocked.",
    bonuses:{repMult:2.0}, durationHours:96 },
];
function rollQuests(floor, count = 3) {
  const eligible = QUEST_TEMPLATES.filter(q => {
    if (q.type === "floor" && q.count > floor + 6) return false;
    if (q.type === "boss" && q.enemyId && !["boss_goblin_king","boss_bone_dragon"].includes(q.enemyId)) return false;
    return true;
  });
  const picked = [];
  const pool = [...eligible];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool.splice(idx, 1)[0];
    picked.push({ ...q, uid:`quest_${Date.now()}_${i}`, progress:0, complete:false });
  }
  return picked;
}
function formatQuest(q) {
  return {
    ...q,
    desc: (q.desc || ").replace("{count}", q.count),
  };
}






const TITLES = {
  NOVICE:        { name:"Novice",         color:"#9ca3af", desc:"A new hero." },
  VETERAN:       { name:"Veteran",        color:"#22c55e", desc:"Has seen battle." },
  BUTCHER:       { name:"the Butcher",    color:"#dc2626", desc:"A slayer of many." },
  ANNIHILATOR:   { name:"the Annihilator",color:"#ef4444", desc:"Extinction walks." },
  EXTINCTION:    { name:"Extinction",     color:"#7f1d1d", desc:"The last sound they heard." },
  BOSS_HUNTER:   { name:"Boss Hunter",    color:"#fbbf24", desc:"Felled champions." },
  WORLDSLAYER:   { name:"Worldslayer",    color:"#f59e0b", desc:"Broke the world's heroes." },
  DEEP_DIVER:    { name:"Deep Diver",     color:"#a855f7", desc:"Went too far down." },
  ABYSSAL:       { name:"the Abyssal",    color:"#7c2d12", desc:"Kissed the abyss and lived." },
  ENDLESS:       { name:"the Endless",    color:"#6366f1", desc:"Never stops descending." },
  WORLDBORN:     { name:"Worldborn",      color:"#fcd34d", desc:"Born in the deep." },
  MASTER:        { name:"Master",         color:"#60a5fa", desc:"Mastered their class." },
  LEGENDARY:     { name:"the Legendary",  color:"#f97316", desc:"Songs are sung about them." },
  TRANSCENDENT:  { name:"Transcendent",   color:"#e879f9", desc:"Beyond mortal limits." },
  MERCHANT:      { name:"the Merchant",   color:"#facc15", desc:"Rich beyond measure." },
  DRAGONHOARDER: { name:"Dragonhoarder",  color:"#eab308", desc:"Rivals dragons in greed." },
  HOARDER:       { name:"the Hoarder",    color:"#fcd34d", desc:"Cannot let go." },
  ARCHIVIST:     { name:"Archivist",      color:"#38bdf8", desc:"Knows every artifact." },
  MYTHWALKER:    { name:"Mythwalker",     color:"#a855f7", desc:"Found something mythic." },
  MYTH_COLLECTOR:{ name:"Myth Collector", color:"#d946ef", desc:"Treasure-hunter supreme." },
  SET_MASTER:    { name:"Set Master",     color:"#14b8a6", desc:"Collected matched sets." },
  LEGENDARY_ATTIRE:{name:"in Legendary Attire",color:"#14b8a6", desc:"All sets complete." },
  SCHOLAR:       { name:"Scholar",        color:"#60a5fa", desc:"Keeper of magic lore." },
  GRIMOIRE:      { name:"Grimoire",       color:"#3b82f6", desc:"A walking spellbook." },
  OMNISCIENT:    { name:"the Omniscient", color:"#06b6d4", desc:"Knows all spells." },
  PACK_LEADER:   { name:"Pack Leader",    color:"#10b981", desc:"Commands loyal beasts." },
  ZOO_MASTER:    { name:"Zoo Master",     color:"#22c55e", desc:"Tamed every beast." },
  MASTER_CRAFTER:{ name:"Master Crafter", color:"#f59e0b", desc:"Skilled at the forge." },
  GRANDMASTER_SMITH:{name:"Grandmaster Smith",color:"#f97316", desc:"Legendary craftsman." },
  JOURNEY:       { name:"on a Journey",   color:"#84cc16", desc:"Many quests completed." },
  CHOSEN_ONE:    { name:"the Chosen One", color:"#fde047", desc:"Destiny incarnate." },
  WORLDWALKER:   { name:"Worldwalker",    color:"#8b5cf6", desc:"Roamed many realms." },
  CARTOGRAPHER:  { name:"Cartographer",   color:"#a78bfa", desc:"Mapped the world." },
  PERSISTENT:    { name:"Persistent",     color:"#a3e635", desc:"Never gives up." },
  ETERNAL_HERO:  { name:"Eternal Hero",   color:"#fbbf24", desc:"Immortal in spirit." },
  DEATH_ACQUAINTED:{name:"Death-Touched", color:"#64748b", desc:"Met death and returned." },
  CRIT_MASTER:   { name:"Crit Master",    color:"#fbbf24", desc:"Deadly accurate." },
  CRIT_LORD:     { name:"Crit Lord",      color:"#f59e0b", desc:"Lives for crits." },
  ARTISAN:       { name:"Artisan",        color:"#f59e0b", desc:"Skilled crafter." },
  WEEKLY_EXPLORER:{name:"Weekly Explorer",color:"#06b6d4", desc:"Weekly champion." },
  DRAGONSLAYER:  { name:"Dragonslayer",   color:"#ef4444", desc:"Slew an ancient dragon." },

  HARDCORE:      { name:"Hardcore",       color:"#dc2626", desc:"Permadeath survivor." },
  NG_PLUS:       { name:"Reborn",         color:"#a855f7", desc:"Returned for more." },
  SPEEDRUNNER:   { name:"Speedrunner",    color:"#06b6d4", desc:"Quick descent champion." },

  FORGELORD:     { name:"Forgelord",      color:"#f59e0b", desc:"Forge mastery." },
  ORACLE:        { name:"Oracle",         color:"#3b82f6", desc:"Council revered." },
  SHADOWLORD:    { name:"Shadowlord",     color:"#8b5cf6", desc:"Veil master." },
  HIEROPHANT:    { name:"Hierophant",     color:"#fde047", desc:"Holy incarnate." },
  ETERNAL:       { name:"Eternal",        color:"#64748b", desc:"Defeated death itself." },
  ASHEN_KING:    { name:"Ashen King",     color:"#ef4444", desc:"Flame sovereign." },
  JOTUN:         { name:"Jotun",          color:"#60a5fa", desc:"Ice-bound colossus." },
  EYE_OF_ABYSS:  { name:"Eye of the Abyss",color:"#a855f7", desc:"Unmade and remade." },
};
function titleLabel(key) {
  const t = TITLES[key];
  return t ? t.name : "";
}






const NPC_TEMPLATES = [
  { id:"npc_smith",      name:"Durgan Ironforge", icon:"x ", role:"Blacksmith",
    faction:"IRONHOLD", dialogue:["Another sword? I'll forge it.","Steel bends to my will.","Bring me iron and I'll make it sing."],
    services:["craft"] },
  { id:"npc_alchemist",  name:"Zeladra the Wise", icon:", role:"Alchemist",
    faction:"ARCANE_COUNCIL", dialogue:["The right brew changes everything.","I have potions   all colors.","Trade me soul shards for elixirs."],
    services:["potions","scrolls"] },
  { id:"npc_rogue",      name:"Vex the Silent",   icon:"x", role:"Fence",
    faction:"SHADOWVEIL", dialogue:["You see nothing.","The black market has... everything.","Discretion is gold."],
    services:["blackmarket"] },
  { id:"npc_priest",     name:"Father Halen",     icon:":", role:"Priest",
    faction:"CELESTIAL_HOST", dialogue:["Light guide your path.","I can heal your wounds, for a price.","Blessings to the faithful."],
    services:["heal","bless","resurrect"] },
  { id:"npc_necro",      name:"Mother Ossur",     icon:"x", role:"Bone-Wife",
    faction:"BONEMARROW", dialogue:["The dead speak if you listen.","I trade in souls. Got any?","Death is just a door."],
    services:["souls","raise"] },
  { id:"npc_stable",     name:"Barta Stablemaster",icon:"x", role:"Beast Keeper",
    faction:"EMBER_CONCLAVE", dialogue:["Every creature can be tamed.","Feed them. Love them. Then they'll die for you.","Pick a pet   any pet."],
    services:["pets","stable"] },
  { id:"npc_jeweler",    name:"Faela Goldsmith",  icon:"x}", role:"Jeweler",
    faction:"SHADOWVEIL", dialogue:["Gems tell stories in their cuts.","Socketing is an art.","I deal only in the finest."],
    services:["socket","gems"] },
  { id:"npc_scribe",     name:"Archivist Wen",    icon:"x S", role:"Scribe",
    faction:"ARCANE_COUNCIL", dialogue:["Knowledge is the deepest treasure.","I collect all scrolls.","Let me read your future."],
    services:["scrolls","lore"] },
  { id:"npc_innkeeper",  name:"Brilla Ale-Mother",icon:"x", role:"Innkeeper",
    faction:null, dialogue:["Sit, warrior, sit!","The soup is free for the injured.","Rest here   you look half-dead."],
    services:["rest","food"] },
  { id:"npc_gambler",    name:"Dice Randal",      icon:"x}", role:"Gambler",
    faction:null, dialogue:["Feeling lucky?","One roll, one life.","Double or nothing, eh?"],
    services:["gamble"] },
  { id:"npc_ranger",     name:"Tael Greenhand",   icon:"x", role:"Ranger Captain",
    faction:null, dialogue:["The wilds are my home.","Quests for the brave only.","Have you seen the old oak?"],
    services:["quest"] },
  { id:"npc_mystic",     name:"Oracle Umbra",     icon:"x ", role:"Mystic",
    faction:"ABYSSAL_CULT", dialogue:["I see... blood. Always blood.","The void whispers to me.","Would you take the black gift?"],
    services:["curse","unmake"] },
];


const TOWN_TEMPLATES = [
  { id:"t_crossroads", name:"Crossroads Hamlet", size:4, flavor:"A dusty waypoint between dungeons." },
  { id:"t_ironhold",   name:"Ironhold Keep",     size:6, flavor:"A stout fortress of grim warriors." },
  { id:"t_spire",      name:"The Spire",         size:5, flavor:"A mage-built tower piercing the clouds." },
  { id:"t_hollow",     name:"The Hollow",        size:5, flavor:"A hidden thieves' den in the rocks." },
  { id:"t_sanctuary",  name:"Dawn Sanctuary",    size:5, flavor:"White walls, golden spires, watchful angels." },
  { id:"t_ossuary",    name:"The Ossuary",       size:4, flavor:"Bone-walled necropolis of the cult." },
  { id:"t_emberkeep",  name:"Emberkeep",         size:5, flavor:"A city built in an active volcano." },
  { id:"t_frostward",  name:"Frostward Hall",    size:5, flavor:"Ice-carved halls of the northern clans." },
  { id:"t_eyeless",    name:"The Eyeless Temple",size:4, flavor:"A shrine to a god without eyes." },
  { id:"t_harborow",   name:"Harborow",          size:6, flavor:"A sunken port town, half underwater." },
];
function generateTown(floor) {
  const tpl = TOWN_TEMPLATES[Math.floor(Math.random() * TOWN_TEMPLATES.length)];
  const pool = [...NPC_TEMPLATES];
  const npcs = [];
  for (let i = 0; i < tpl.size && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    npcs.push({ ...pool.splice(idx, 1)[0], uid:`npc_${Date.now()}_${i}` });
  }
  return { ...tpl, floor, npcs, uid:`town_${Date.now()}` };
}






const HOUSING_UPGRADES = [

  { id:"h_bedroom",       name:"Bedroom",          cost:500,    level:1,  desc:"Restful sleep: +5% max HP",
    effect:{ hpPct: 0.05 } },
  { id:"h_armory",        name:"Armory",           cost:1500,   level:2,  desc:"+1 equipment slot preview",
    effect:{ armoryBonus:true } },
  { id:"h_vault",         name:"Vault",            cost:2500,   level:3,  desc:"Persistent item storage (60 slots)",
    effect:{ vaultSlots:60 } },
  { id:"h_garden",        name:"Herb Garden",      cost:3500,   level:4,  desc:"Grows potions between runs",
    effect:{ dailyHerbs:3 } },
  { id:"h_library",       name:"Library",          cost:5000,   level:5,  desc:"+1 spell learned per run",
    effect:{ spellBonus:1 } },
  { id:"h_training",      name:"Training Room",    cost:7500,   level:6,  desc:"+1 level-up bonus stat",
    effect:{ trainBonus:1 } },
  { id:"h_forge",         name:"Forge",            cost:10000,  level:7,  desc:"Craft items without NPCs",
    effect:{ craft:true } },
  { id:"h_altar",         name:"Shrine Altar",     cost:15000,  level:8,  desc:"Sacrifice items for permanent stats",
    effect:{ altar:true } },
  { id:"h_portal",        name:"Portal Room",      cost:20000,  level:10, desc:"Teleport to any visited biome",
    effect:{ fastTravel:true } },
  { id:"h_throne",        name:"Throne Room",      cost:30000,  level:12, desc:"NPC followers gather here",
    effect:{ throne:true } },
  { id:"h_menagerie",     name:"Menagerie",        cost:12000,  level:6,  desc:"Pet stable   swap active pet",
    effect:{ menagerie:true } },
  { id:"h_observatory",   name:"Observatory",      cost:18000,  level:9,  desc:"+50% XP from first floor each run",
    effect:{ expBonus:0.5 } },
  { id:"h_enchanter",     name:"Enchanter's Room", cost:8000,   level:6,  desc:"Enchant equipment at home",
    effect:{ enchant:true } },
  { id:"h_hall_heroes",   name:"Hall of Heroes",   cost:25000,  level:10, desc:"Displays past heroes (cosmetic)",
    effect:{ heroHall:true } },
  { id:"h_treasury",      name:"Royal Treasury",   cost:40000,  level:12, desc:"+20% gold found permanently",
    effect:{ goldBonus:0.2 } },
  { id:"h_vault_mythic",  name:"Mythic Vault",     cost:100000, level:15, desc:"Mythic item display   grants passive bonuses",
    effect:{ mythicDisplay:true, atk:20, def:20 } },
];
function initialHouse() {
  return {
    level: 1,
    upgrades: [],
    vault: [],
    herbsReady: 0,
    lastVisit: 0,
  };
}
function canBuy(house, upgradeId, gold) {
  const u = HOUSING_UPGRADES.find(h => h.id === upgradeId);
  if (!u) return false;
  if (house.upgrades.includes(upgradeId)) return false;
  if (house.level < u.level) return false;
  if (gold < u.cost) return false;
  return true;
}
function applyHouseBonuses(player, house) {
  const bonus = { hp:0, mana:0, atk:0, def:0, spellBonus:0, expBonus:0, goldBonus:0 };
  (house.upgrades || []).forEach(id => {
    const u = HOUSING_UPGRADES.find(h => h.id === id);
    if (!u || !u.effect) return;
    if (u.effect.hpPct) bonus.hp += Math.floor(player.maxHp * u.effect.hpPct);
    if (u.effect.atk) bonus.atk += u.effect.atk;
    if (u.effect.def) bonus.def += u.effect.def;
    if (u.effect.expBonus) bonus.expBonus += u.effect.expBonus;
    if (u.effect.goldBonus) bonus.goldBonus += u.effect.goldBonus;
    if (u.effect.spellBonus) bonus.spellBonus += u.effect.spellBonus;
  });
  return bonus;
}









function getBandedMultiplier(stat) {
  if (stat <= 50) return 1.0;
  if (stat <= 150) return 1.4;
  if (stat <= 300) return 1.8;
  return 2.1;
}


function calcBasicAttack(attacker, defender, mods = {}) {

  const weaponDmg = attacker.weaponDmg || 10;
  const skillBase = 5;
  const baseDmg = weaponDmg + skillBase;


  const primaryStat = attacker.totalAtk || 10;
  const statMult = getBandedMultiplier(primaryStat);
  const scaling = 1 + (primaryStat / (primaryStat + K_CONSTANT));
  let dmg = baseDmg * statMult * scaling;


  const gearBonus = Math.min(1.5, (attacker.gearAtkMult || 0));
  dmg *= (1 + gearBonus);


  const physMult = CLASSES[attacker.cls]?.physMult || 1.0;
  dmg *= physMult;


  const comboStacks = Math.min(4, attacker.comboStacks || 0);
  const comboMult = 1 + (comboStacks * 0.25);
  dmg *= comboMult;


  const def = defender.totalDef || defender.def || 0;
  const mitigation = 1 - (def / (def + C_CONSTANT));
  dmg *= mitigation;


  dmg = Math.pow(Math.max(1, dmg), DAMPENER);


  const critChance = Math.min(50, (attacker.crit || 10) + (mods.critBonus || 0));
  const isCrit = Math.random() * 100 < critChance;
  if (isCrit) dmg *= (1.5 + (attacker.critDmgBonus || 0));


  const type = mods.type || "phys";
  const adaptiveRes = defender.adaptiveRes?.[type] || 0;
  dmg *= (1 - adaptiveRes);
  if (adaptiveRes > 0) mods.isAdapted = true;


  const finalDmg = Math.max(1, Math.floor(Math.min(dmg, (defender.maxHp || 100) * DAMAGE_CAP_PCT)));

  return { dmg: finalDmg, isCrit, blocked: 0, isAdapted: mods.isAdapted };
}



function calcSpellDamage(attacker, defender, spellName, mods = {}) {
  const sp = SPELLS[spellName];
  if (!sp) return { dmg: 0, isCrit: false, blocked: 0 };
  
  if (sp.dmg[0] < 0) {

    const heal = Math.abs(Math.floor(Math.random() * (Math.abs(sp.dmg[1]) - Math.abs(sp.dmg[0]) + 1)) + Math.abs(sp.dmg[0]));
    return { heal, isCrit: false, blocked: 0 };
  }


  const spMin = sp.dmg[0], spMax = sp.dmg[1];
  const skillBase = Math.floor(Math.random() * (spMax - spMin + 1)) + spMin;
  const weaponDmg = attacker.weaponMag || 10;
  const baseDmg = skillBase + weaponDmg;


  const primaryStat = attacker.totalMana || 100; // Spells scale with Mana capacity
  const statMult = getBandedMultiplier(primaryStat / 10);
  const scaling = 1 + (primaryStat / (primaryStat + (K_CONSTANT * 5)));
  let dmg = baseDmg * statMult * scaling;


  const gearBonus = Math.min(1.5, (attacker.gearMagMult || 0));
  dmg *= (1 + gearBonus);


  const comboStacks = Math.min(4, attacker.comboStacks || 0);
  const comboMult = 1 + (comboStacks * 0.25);
  dmg *= comboMult;


  const def = defender.totalDef || defender.def || 0;
  const mitigation = 1 - (def / (def + C_CONSTANT));
  dmg *= mitigation;


  dmg = Math.pow(Math.max(1, dmg), DAMPENER);


  const critChance = Math.min(50, (attacker.crit || 10) + (mods.critBonus || 0));
  const isCrit = Math.random() * 100 < critChance;
  if (isCrit) dmg *= (1.5 + (attacker.critDmgBonus || 0));


  const adaptiveRes = defender.adaptiveRes?.[sp.type] || 0;
  dmg *= (1 - adaptiveRes);
  if (adaptiveRes > 0) mods.isAdapted = true;


  const finalDmg = Math.max(1, Math.floor(Math.min(dmg, (defender.maxHp || 100) * DAMAGE_CAP_PCT)));

  return { dmg: finalDmg, isCrit, blocked: 0, isAdapted: mods.isAdapted };
}



function tickStatus(entity) {
  if (!entity.status || !entity.statusTurns) return { entity, dot: 0 };
  const s = STATUS_EFFECTS[entity.status];
  let dot = 0;
  if (s && s.kind === "dot") {
    dot = Math.max(3, Math.floor((entity.maxHp || 100) * s.dmgPct));
  }
  const newHp = Math.max(0, (entity.hp || 0) - dot);
  const turns = Math.max(0, (entity.statusTurns || 0) - 1);
  return {
    entity: {
      ...entity,
      hp: newHp,
      statusTurns: turns,
      status: turns > 0 ? entity.status : null,
    },
    dot,
  };
}


function canAct(entity) {
  if (!entity.status) return true;
  return !isControl(entity.status);
}


function applyStatus(target, status, turns = 3) {
  if (!status || !STATUS_EFFECTS[status]) return target;
  if (target.passives && target.passives.no_silence && status === "SILENCE") return target;
  return { ...target, status, statusTurns: turns };
}






const COLS = 19;
const ROWS = 14;
const T = {
  FLOOR: 0, WALL: 1, DOOR: 2, CHEST: 3, STAIRS: 4,
  SHRINE: 5, TRAP: 6, SHOP: 7, TOWN: 8, RAID: 9,
  PUZZLE: 10, PORTAL: 11, FOUNTAIN: 12, SECRET: 13, FORGE: 14,
};




function generateMap(floor, biomeId = null, opts = {}) {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(T.WALL));
  const rooms = [];
  const biome = biomeId || biomeForFloor(floor);


  const numRooms = 7 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numRooms; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4) % 3;
    const ax = col * 4 + 1;
    const ay = row * 4 + 1;
    const aw = 6, ah = 4;
    const w = Math.floor(Math.random() * (aw - 2)) + 4;
    const h = Math.floor(Math.random() * (ah - 1)) + 3;
    const x = ax + Math.floor(Math.random() * Math.max(1, aw - w));
    const y = ay + Math.floor(Math.random() * Math.max(1, ah - h));
    if (x + w >= COLS - 1 || y + h >= ROWS - 1) continue;
    rooms.push({ x, y, w, h });
    for (let ry = y; ry < y + h; ry++)
      for (let rx = x; rx < x + w; rx++) grid[ry][rx] = T.FLOOR;
  }


  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1], b = rooms[i];
    const ax = Math.floor(a.x + a.w / 2), ay = Math.floor(a.y + a.h / 2);
    const bx = Math.floor(b.x + b.w / 2), by = Math.floor(b.y + b.h / 2);
    let cx = ax, cy = ay;
    while (cx !== bx) { if (grid[cy] && cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) grid[cy][cx] = T.FLOOR; cx += cx < bx ? 1 : -1; }
    while (cy !== by) { if (grid[cy] && cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) grid[cy][cx] = T.FLOOR; cy += cy < by ? 1 : -1; }
  }


  const floorTiles = [];
  for (let ry = 0; ry < ROWS; ry++)
    for (let rx = 0; rx < COLS; rx++)
      if (grid[ry][rx] === T.FLOOR) floorTiles.push({ x: rx, y: ry });

  const pick = () => {
    if (!floorTiles.length) return null;
    const idx = Math.floor(Math.random() * floorTiles.length);
    return floorTiles.splice(idx, 1)[0];
  };


  const chests  = Math.min(4, Math.floor(Math.random() * 3) + 2);
  const traps   = Math.min(5, Math.floor(Math.random() * 3) + 1 + Math.floor(floor / 5));
  const shrines = Math.floor(Math.random() * 2) + 1;
  const shops   = floor > 1 ? Math.floor(Math.random() * 2) : 1;
  const fountains = Math.random() < 0.4 ? 1 : 0;
  const secrets = Math.random() < 0.25 ? 1 : 0;
  const town    = (floor > 1 && floor % 4 === 0) ? 1 : 0;
  const puzzle  = (floor > 5 && Math.random() < 0.15) ? 1 : 0;
  const portal  = (floor > 8 && Math.random() < 0.1) ? 1 : 0;
  const forge   = (floor > 3 && Math.random() < 0.3) ? 1 : 0;

  for (let i = 0; i < chests; i++)   { const t = pick(); if (t) grid[t.y][t.x] = T.CHEST; }
  for (let i = 0; i < traps; i++)    { const t = pick(); if (t) grid[t.y][t.x] = T.TRAP; }
  for (let i = 0; i < shrines; i++)  { const t = pick(); if (t) grid[t.y][t.x] = T.SHRINE; }
  for (let i = 0; i < shops; i++)    { const t = pick(); if (t) grid[t.y][t.x] = T.SHOP; }
  for (let i = 0; i < fountains; i++){ const t = pick(); if (t) grid[t.y][t.x] = T.FOUNTAIN; }
  for (let i = 0; i < secrets; i++)  { const t = pick(); if (t) grid[t.y][t.x] = T.SECRET; }
  for (let i = 0; i < town; i++)     { const t = pick(); if (t) grid[t.y][t.x] = T.TOWN; }
  for (let i = 0; i < puzzle; i++)   { const t = pick(); if (t) grid[t.y][t.x] = T.PUZZLE; }
  for (let i = 0; i < portal; i++)   { const t = pick(); if (t) grid[t.y][t.x] = T.PORTAL; }
  for (let i = 0; i < forge; i++)    { const t = pick(); if (t) grid[t.y][t.x] = T.FORGE; }


  const stairsTile = pick();
  if (stairsTile) grid[stairsTile.y][stairsTile.x] = T.STAIRS;

  const playerStart = pick() || { x: 1, y: 1 };
  grid[playerStart.y][playerStart.x] = T.FLOOR;


  const enemies = [];
  const biomeEnemies = (BIOMES[biome]?.enemies || []);
  const pool = ENEMY_DATA.filter(e =>
    !e.isBoss && !e.rare && !e.isMimic &&
    e.floor <= Math.min(floor, 20) &&
    (biomeEnemies.length === 0 || biomeEnemies.includes(e.id) || !biomeEnemies.length)
  );
  const fallback = ENEMY_DATA.filter(e => !e.isBoss && !e.rare && e.floor <= 3);
  const enemySrc = pool.length > 0 ? pool : fallback;
  const numEnemies = 4 + Math.floor(floor * 0.9) + Math.floor(Math.random() * 3);

  for (let i = 0; i < numEnemies; i++) {
    const t = pick();
    if (!t) break;
    const base = enemySrc[Math.floor(Math.random() * enemySrc.length)];
    const scale = 1 + (floor - 1) * 0.12;
    enemies.push({
      ...base,
      uid: `e_${i}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      hp: Math.round(base.hp * scale),
      maxHp: Math.round(base.hp * scale),
      atk: Math.round(base.atk * scale),
      def: Math.round(base.def * scale),
      exp: Math.round(base.exp * scale),
      gold: Math.round(base.gold * scale),
      x: t.x, y: t.y,
      status: null, statusTurns: 0,
    });
  }


  if (floor % 5 === 0) {
    const base = bossForFloor(floor);
    if (base) {
      const scale = 1 + (floor - base.floor) * 0.1;
      const t = pick() || { x: 8, y: 6 };
      enemies.push({
        ...base,
        uid: `boss_${Date.now()}`,
        hp: Math.round(base.hp * scale),
        maxHp: Math.round(base.hp * scale),
        atk: Math.round(base.atk * scale),
        def: Math.round(base.def * scale),
        exp: Math.round(base.exp * scale),
        gold: Math.round(base.gold * scale),
        x: t.x, y: t.y,
        status: null, statusTurns: 0,
      });
    }
  }

  const weather = rollWeather(floor);
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const visionRadius = 4;
  return { grid, enemies, playerStart, biome, weather, visited, visionRadius };
}




function updateVisibility(mapData, px, py, radius = 4) {
  const visited = mapData.visited.map(r => [...r]);
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      if (dx * dx + dy * dy <= radius * radius) visited[ny][nx] = true;
    }
  }
  return visited;
}


function applyStatVariance(item, variance = 0.2) {
  if (!item) return item;
  const fields = ["atk","def","hp","mana","crit","spd","heal"];
  const result = { ...item };
  let anyModified = false;
  fields.forEach(f => {
    if (result[f] && result[f] > 0) {
      const v = 1 + (Math.random() * 2 - 1) * variance;
      result[f] = Math.max(1, Math.round(result[f] * v));
      anyModified = true;
    }
  });
  if (anyModified) result.isVariant = true;
  return result;
}


function generateDungeonLoot(dungeonTier = 1, floor = 1, count = 1, opts = {}) {
  const items = [];
  const dungeon = DUNGEONS[dungeonTier - 1];

  const dungeonPool = dungeon ? dungeon.lootItemIds : null;
  for (let i = 0; i < count; i++) {
    let rarity = rollRarityForDungeon(dungeonTier, opts.luck || 0);
    

    if (opts.difficulty === "NIGHTMARE" && opts.hardcore && Math.random() < 0.005) {
      rarity = "MYTHIC";
      const spells = Object.keys(SPELLS);
      const sId = spells[Math.floor(Math.random() * spells.length)];
      items.push({
        id: `scroll_${sId}_perm`,
        uid: `mythic_scroll_${Date.now()}_${i}`,
        name: `${sId} Master Scroll`,
        icon: "x S",
        rarity: "MYTHIC",
        slot: "consumable",
        desc: `PERMANENTLY learn the ${sId} spell. A relic of the Nightmare Void.`,
        isPermanent: true,
        spell: sId,
        val: 50000,
      });
      continue;
    }

    let pool;
    if (dungeonPool) {
      pool = ALL_ITEMS.filter(it => dungeonPool.includes(it.id) && it.rarity === rarity);
      if (pool.length === 0) pool = ALL_ITEMS.filter(it => dungeonPool.includes(it.id));
    }
    if (!pool || pool.length === 0) pool = ALL_ITEMS.filter(it => it.rarity === rarity);
    if (!pool || pool.length === 0) pool = ALL_ITEMS.filter(it => it.rarity === "COMMON");
    const base = pool[Math.floor(Math.random() * pool.length)];
    if (!base) continue;

    const tierScale = 1 + (dungeonTier - 1) * 0.35;
    const scaled = { ...base, uid: `loot_${Date.now()}_${i}_${Math.random()}`, rarity };
    if (scaled.atk) scaled.atk = Math.round(scaled.atk * tierScale);
    if (scaled.def) scaled.def = Math.round(scaled.def * tierScale);
    if (scaled.hp) scaled.hp = Math.round(scaled.hp * tierScale);
    if (scaled.mana) scaled.mana = Math.round(scaled.mana * tierScale);
    items.push(applyStatVariance(scaled));
  }
  return items;
}


function generateLoot(floor, count = 1, opts = {}) {
  return generateDungeonLoot(Math.min(8, Math.max(1, Math.floor(floor / 5) + 1)), floor, count, opts);
}


function maxUpgradeLevel(rarity) {
  const map = { COMMON: 3, UNCOMMON: 5, RARE: 7, EPIC: 10, LEGENDARY: 10, MYTHIC: 10, UNIQUE: 10 };
  return map[rarity] || 3;
}


function upgradeWeaponCost(item) {
  const base = { COMMON: 100, UNCOMMON: 250, RARE: 600, EPIC: 1500, LEGENDARY: 4000, MYTHIC: 10000 };
  const rarityBase = base[item.rarity] || 100;
  return Math.round(rarityBase * Math.pow(1.6, item.upgradeLevel || 0));
}


function applyWeaponUpgrade(item) {
  const lvl = (item.upgradeLevel || 0) + 1;
  const mult = 1.15; // 15% per upgrade
  return {
    ...item,
    upgradeLevel: lvl,
    atk:  item.atk  ? Math.round(item.atk  * mult) : item.atk,
    def:  item.def  ? Math.round(item.def  * mult) : item.def,
    hp:   item.hp   ? Math.round(item.hp   * mult) : item.hp,
    mana: item.mana ? Math.round(item.mana * mult) : item.mana,
  };
}


function generateMaterials(floor, count = 1) {
  const mats = ALL_ITEMS.filter(it => it.slot === "material" || it.slot === "gem");
  const items = [];
  for (let i = 0; i < count; i++) {
    const base = mats[Math.floor(Math.random() * mats.length)];
    if (base) items.push({ ...base, uid: `mat_${Date.now()}_${Math.random().toString(36).slice(2,8)}` });
  }
  return items;
}






const SAVE_KEY_PREFIX = "doe_save_";
const META_KEY = "doe_meta";


const memStore = {};

function safeSet(key, val) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(val));
    else memStore[key] = JSON.parse(JSON.stringify(val));
  } catch (e) { memStore[key] = val; }
}

function safeGet(key) {
  try {
    if (typeof localStorage !== "undefined") {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    }
    return memStore[key] || null;
  } catch (e) { return memStore[key] || null; }
}

function safeRemove(key) {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    delete memStore[key];
  } catch (e) { delete memStore[key]; }
}




function saveCharacter(slot, state) {
  safeSet(SAVE_KEY_PREFIX + slot, {
    savedAt: Date.now(),
    ...state,
  });
}
function loadCharacter(slot) {
  return safeGet(SAVE_KEY_PREFIX + slot);
}
function deleteCharacter(slot) {
  safeRemove(SAVE_KEY_PREFIX + slot);
}
function listCharacters() {
  const out = [];
  for (let i = 1; i <= 5; i++) {
    const s = safeGet(SAVE_KEY_PREFIX + i);
    out.push({ slot: i, save: s });
  }
  return out;
}




function loadMeta() {
  const m = safeGet(META_KEY);
  if (m) return m;
  return initialMeta();
}
function saveMeta(meta) {
  safeSet(META_KEY, meta);
}
function initialMeta() {
  return {
    masteryPoints: 0,
    classMastery: {},  // class -> runs
    highestFloor: 0,
    totalRuns: 0,
    totalDeaths: 0,
    ngPlus: 0,
    hardcoreClears: 0,
    speedrunBest: null,
    unlockedClasses: ["WARRIOR","MAGE","ROGUE","PALADIN","NECROMANCER","BERSERKER","RANGER","SORCERER"],
    unlockedTitles: [],
    cosmetics: [],
    bestiary: {},    // enemy id -> { kills, firstSeen }
    itemsSeen: {},   // item id -> count
    collectionLog: {}, // item id -> { count, firstFound }
    leaderboard: [], // { name, floor, class, date }
    ghosts: [],      // { name, floor, class, cause, date }
    dailySeed: ",
    lastDailyDate: ",
    house: null,
    reputation: null,
    achievements: null,
  };
}


function recordRun(meta, runData) {
  const next = { ...meta };
  next.totalRuns = (meta.totalRuns || 0) + 1;
  next.highestFloor = Math.max(meta.highestFloor || 0, runData.floor || 0);
  next.classMastery = { ...(meta.classMastery || {}) };
  next.classMastery[runData.cls] = (next.classMastery[runData.cls] || 0) + 1;
  next.masteryPoints = (meta.masteryPoints || 0) + Math.floor((runData.floor || 0) / 2);
  if (runData.died) next.totalDeaths = (meta.totalDeaths || 0) + 1;
  if (runData.hardcore && !runData.died) next.hardcoreClears = (meta.hardcoreClears || 0) + 1;

  next.leaderboard = [...(meta.leaderboard || []), {
    name: runData.name, cls: runData.cls, floor: runData.floor,
    kills: runData.kills || 0, died: !!runData.died, date: Date.now(),
  }].sort((a, b) => b.floor - a.floor).slice(0, 25);

  if (runData.died) {
    next.ghosts = [{
      name: runData.name, cls: runData.cls, floor: runData.floor,
      cause: runData.cause || "unknown", date: Date.now(),
    }, ...(meta.ghosts || [])].slice(0, 10);
  }
  return next;
}


function recordBestiary(meta, enemyId) {
  const next = { ...meta, bestiary: { ...(meta.bestiary || {}) } };
  const cur = next.bestiary[enemyId] || { kills: 0, firstSeen: Date.now() };
  cur.kills += 1;
  next.bestiary[enemyId] = cur;
  return next;
}
function recordItemSeen(meta, itemId) {
  const next = { ...meta, itemsSeen: { ...(meta.itemsSeen || {}) } };
  next.itemsSeen[itemId] = (next.itemsSeen[itemId] || 0) + 1;
  if (!next.collectionLog) next.collectionLog = {};
  if (!next.collectionLog[itemId]) next.collectionLog[itemId] = { count: 0, firstFound: Date.now() };
  next.collectionLog[itemId].count += 1;
  return next;
}


function masteryBonuses(meta, cls) {
  const runs = (meta.classMastery || {})[cls] || 0;
  return {
    hp:   Math.floor(runs * 3),
    mana: Math.floor(runs * 2),
    atk:  Math.floor(runs * 0.7),
    def:  Math.floor(runs * 0.5),
  };
}


function ngPlusMods(ngLevel) {
  return {
    enemyHp:   1 + ngLevel * 0.35,
    enemyAtk:  1 + ngLevel * 0.25,
    goldMult:  1 + ngLevel * 0.50,
    expMult:   1 + ngLevel * 0.40,
    lootLuck:  ngLevel * 10,
  };
}


function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s & 0xffff) / 0xffff;
  };
}






function expNeededForLevel(level) {
  return Math.floor(100 * Math.pow(EXP_CURVE, level - 1));
}
function levelUp(player) {
  const p = { ...player };
  while (p.exp >= p.expNext) {
    p.exp -= p.expNext;
    p.level++;
    p.expNext = expNeededForLevel(p.level);
    p.baseAtk += 3; p.baseDef += 2;
    p.maxHp += 15; p.hp = p.maxHp;
    p.maxMana += 10; p.mana = p.maxMana;
    p.unspentSkill = (p.unspentSkill || 0) + 1;
  }
  return p;
}


function setBonuses(equipment) {
  const counts = {};
  Object.values(equipment || {}).forEach(eq => {
    if (!eq) return;
    const setId = ITEM_TO_SET[eq.id];
    if (setId) counts[setId] = (counts[setId] || 0) + 1;
  });
  const bonus = { hp:0, mana:0, atk:0, def:0, spd:0, crit:0, labels:[] };
  Object.entries(counts).forEach(([setId, count]) => {
    const set = ITEM_SETS[setId];
    if (!set) return;

    let best = null;
    Object.keys(set.bonuses || {}).forEach(k => {
      const n = parseInt(k, 10);
      if (n <= count) {
        if (!best || n > best.n) best = { n, data: set.bonuses[n] };
      }
    });
    if (best) {
      Object.entries(best.data).forEach(([k,v]) => {
        if (typeof v === "number") bonus[k] = (bonus[k] || 0) + v;
      });
      bonus.labels.push(`${set.name} (${best.n}): ${best.data.desc || "" }`);
    }
  });
  return bonus;
}


function calcPlayerStats(p, house = null) {
  if (!p) return { totalAtk: 0, totalDef: 0, maxHp: 1, maxMana: 1, crit: 0 };
  let atk = p.baseAtk, def = p.baseDef, hp = CLASSES[p.cls]?.stats?.hp || 100, mana = CLASSES[p.cls]?.stats?.mana || 50, crit = p.crit;


  atk  += (p.level - 1) * 3;
  def  += (p.level - 1) * 2;
  hp   += (p.level - 1) * 15;
  mana += (p.level - 1) * 10;


  Object.values(p.equipment || {}).forEach(eq => {
    if (!eq) return;
    atk  += eq.atk  || 0;
    def  += eq.def  || 0;
    hp   += eq.hp   || 0;
    mana += eq.mana || 0;
    crit += eq.crit || 0;
  });


  const sets = setBonuses(p.equipment);
  atk += sets.atk; def += sets.def; hp += sets.hp; mana += sets.mana; crit += sets.crit;


  if (p.subclass) {
    const sub = getSubclassBonus(p.cls, p.subclass);
    atk += sub.atk || 0; def += sub.def || 0;
    hp += sub.hp || 0; mana += sub.mana || 0; crit += sub.crit || 0;
  }


  const grants = aggregateGrants(p.cls, p.unlockedSkills || []);
  atk += grants.stat.atk || 0; def += grants.stat.def || 0;
  hp += grants.stat.hp || 0; mana += grants.stat.mana || 0; crit += grants.stat.crit || 0;


  if (house) {
    const hb = applyHouseBonuses(p, house);
    atk += hb.atk; def += hb.def; hp += hb.hp; mana += hb.mana;
  }


  if (p.masteryBonus) {
    atk += p.masteryBonus.atk || 0; def += p.masteryBonus.def || 0;
    hp += p.masteryBonus.hp || 0; mana += p.masteryBonus.mana || 0;
  }


  let totalAtk = atk;
  let totalDef = def;
  if (p.buffTurns > 0) totalAtk = Math.floor(totalAtk * 1.4);
  if (p.lichTurns > 0) { totalAtk = Math.floor(totalAtk * 2); totalDef = Math.floor(totalDef * 2); }
  if (p.defBuffTurns > 0) totalDef = Math.floor(totalDef * 1.5);
  if (p.cls === "BERSERKER" && p.hp < (hp * 0.25)) totalAtk = Math.floor(totalAtk * 2);
  if (p.cls === "BERSERKER" && p.berserkerStacks > 0) totalAtk += p.berserkerStacks * 5;


  if (grants.mult.atkDmg) totalAtk = Math.floor(totalAtk * grants.mult.atkDmg);

  return { totalAtk, totalDef, maxHp: hp, maxMana: mana, crit, setLabels: sets.labels, passives: grants.passives, mult: grants.mult };
}


function createPlayer(cls, subclass, name, masteryBonus = null) {
  const cd = CLASSES[cls];
  return {
    name: name || "Hero",
    cls, subclass: subclass || null,
    level: 1, exp: 0, expNext: 100,
    hp: cd.stats.hp, maxHp: cd.stats.hp,
    mana: cd.stats.mana, maxMana: cd.stats.mana,
    baseAtk: cd.stats.atk, baseDef: cd.stats.def,
    crit: cd.stats.crit, spd: cd.stats.spd,
    gold: 100, kills: 0, bossKills: 0, floorsCleared: 0, crits: 0,
    equipment: { weapon:null, armor:null, helmet:null, boots:null, ring:null, neck:null, cloak:null, glove:null, shield:null },
    inventory: [],
    spells: [...cd.spells],
    passives: [...cd.passives],
    status: null, statusTurns: 0,
    buffTurns: 0, defBuffTurns: 0, lichTurns: 0,
    berserkerStacks: 0,
    divineShield: cls === "PALADIN",
    shadowFirst: cls === "ROGUE",
    kiting: cls === "RANGER",
    unlockedSkills: [],
    unspentSkill: 0,
    pet: null,
    quests: [],
    masteryBonus,
  };
}

const TILE = 42;




const S = {

  root: { width:"100vw", height:"100vh", overflow:"hidden", fontFamily:"'Inter', 'Courier New', monospace", background:"#020205", color: "#e2e8f0" },
  screen: { width:"100%", height:"100%", overflow:"hidden", position:"relative", background: "rgba(10,10,20,0.4)" },

  titleBg: { position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%, #2d0a5e55 0%, transparent 60%), radial-gradient(circle at 80% 50%, #0a1a4e55 0%, transparent 60%), radial-gradient(circle at 50% 80%, #5e0a0a33 0%, transparent 50%)", pointerEvents:"none", filter: "blur(40px)" },
  titleContent: { position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px", zIndex: 10 },
  titleH1: { fontFamily:"'Cinzel', serif", fontSize:"clamp(40px,8vw,80px)", fontWeight:900, background:"linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 60%, #a855f7 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8, letterSpacing:12, textAlign:"center", filter:"drop-shadow(0 0 40px #f9731666)" },
  titleSub: { color:"#a78bfa", letterSpacing:12, fontSize:14, marginBottom:32, textTransform:"uppercase", opacity: 0.8, fontWeight: 300 },

  bigBtn: { background:"linear-gradient(135deg, #7c3aed 0%, #dc2626 100%)", color:"white", border:"none", borderRadius:12, padding:"16px 40px", fontSize:16, fontWeight:700, cursor:"pointer", letterSpacing:3, boxShadow:"0 0 30px #7c3aed66, 0 8px 24px #000a", fontFamily:"'Cinzel', serif", margin:10, transition:"all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", textTransform:"uppercase", position: "relative", overflow: "hidden" },
  smallBtn: { background:"rgba(30,30,50,0.6)", backdropFilter:"blur(12px)", color:"#f8fafc", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 18px", fontSize:13, cursor:"pointer", fontFamily:"'Inter', sans-serif", transition:"all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
  hudBtn: { background:"rgba(15,15,30,0.7)", backdropFilter:"blur(10px)", color:"#c084fc", border:"1px solid rgba(167,139,250,0.2)", borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer", transition:"all 0.2s" },
  closeBtn: { background:"rgba(40,40,60,0.7)", color:"#cbd5e1", border:"1px solid rgba(255,255,255,0.05)", borderRadius:8, padding:"6px 16px", fontSize:13, cursor:"pointer", transition:"all 0.2s" },
  nameInput: { background:"rgba(10,10,25,0.8)", border:"1px solid rgba(167,139,250,0.3)", color:"#f8fafc", borderRadius:8, padding:"10px 16px", fontSize:15, fontFamily:"'Inter', monospace", width:200, outline:"none", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)" },
  classCard: { background:"rgba(20,20,40,0.5)", backdropFilter:"blur(16px)", borderRadius:16, padding:"24px 20px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", transition:"all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", border:"1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" },
  classGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:20, maxWidth:1200, margin:"0 auto", padding:"20px" },
  combatBtn: (c) => ({ background:`linear-gradient(135deg, ${c}33, ${c}11)`, color:c, border:`1px solid ${c}66`, borderRadius:10, padding:"12px 20px", fontSize:14, cursor:"pointer", fontWeight:700, transition:"all 0.2s", boxShadow:`0 4px 15px ${c}22`, textTransform: "uppercase", letterSpacing: 1 }),
  spellBtn: { background:"rgba(30,30,60,0.5)", backdropFilter:"blur(8px)", borderRadius:10, padding:"8px 10px", cursor:"pointer", textAlign:"center", minWidth:64, border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.2s" },
  eqSlot: { display:"flex", alignItems:"center", gap:10, background:"rgba(15,15,30,0.6)", backdropFilter:"blur(10px)", borderRadius:12, padding:"10px 14px", marginBottom:8, border:"1px solid rgba(255,255,255,0.05)" },
  invItem: { background:"rgba(25,25,45,0.5)", backdropFilter:"blur(12px)", borderRadius:12, padding:"14px 10px", display:"flex", flexDirection:"column", alignItems:"center", border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.2s", position:"relative", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" },
  statBadge: (c) => ({ background:`${c}22`, color:c, fontSize:10, borderRadius:6, padding:"3px 8px", border:`1px solid ${c}33`, fontWeight: 600 }),
  smBtn: (c) => ({ background:`${c}18`, color:c, border:`1px solid ${c}44`, borderRadius:6, padding:"5px 10px", fontSize:10, cursor:"pointer", transition:"all 0.2s", fontWeight: 600 }),
  dpadBtn: { background:"rgba(40,40,70,0.6)", backdropFilter:"blur(8px)", color:"#f8fafc", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"10px", fontSize:16, cursor:"pointer", width:"100%", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" },
  panelBtn: { background:"rgba(20,20,40,0.7)", backdropFilter:"blur(12px)", color:"#f1f5f9", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"12px", fontSize:12, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, minWidth:70, transition:"all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
  modalBg: { position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 },
  modal: { background:"rgba(15,15,30,0.8)", backdropFilter:"blur(32px)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:24, padding:30, maxWidth:900, width:"95%", maxHeight:"90%", overflowY:"auto", boxShadow:"0 20px 80px rgba(0,0,0,0.6)" },
  tabBtn: (active) => ({ background: active ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.03)", color: active ? "#c084fc" : "#94a3b8", border: active ? "1.5px solid #a855f7" : "1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"8px 18px", fontSize:13, cursor:"pointer", transition:"all 0.2s", fontWeight: active ? 700 : 400 }),
  sectionH: { color:"#c084fc", fontFamily:"'Cinzel', serif", fontSize:18, marginBottom:15, borderBottom:"1px solid rgba(167,139,250,0.2)", paddingBottom:10, letterSpacing:3, textTransform: "uppercase" },

  dungeonCard: (accent) => ({ background:"rgba(15,15,35,0.6)", backdropFilter:"blur(20px)", borderRadius:20, padding:"25px 22px", cursor:"pointer", display:"flex", flexDirection:"column", border:`1.5px solid ${accent}44`, transition:"all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", boxShadow:`0 10px 40px ${accent}15`, position:"relative", overflow:"hidden" }),
  rarityGlow: (color) => ({ boxShadow:`0 0 30px ${color}44, inset 0 0 15px ${color}11`, borderColor:`${color}99`, borderWidth: "2px" }),
  upgradeBtn: { background:"linear-gradient(135deg, #fbbf24, #d97706)", color:"#000", border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, cursor:"pointer", fontWeight:800, transition:"all 0.2s", boxShadow: "0 4px 10px rgba(217,119,6,0.3)" },
};




const AUDIO = {
  ctx: null, master: null, muted: false, vol: 0.35,
  init() {
    if (this.ctx || typeof window === "undefined") return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.vol;
    this.master.connect(this.ctx.destination);
  },
  resume() { if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); },
  setMuted(m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : this.vol; },
  _tone(freq, dur, type = "sine", vol = 0.5, attack = 0.005, release = 0.08) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + release);
  },
  _sweep(f1, f2, dur, type = "sawtooth", vol = 0.4) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  },
  _noise(dur, vol = 0.4, filter = 1200) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = filter; bp.Q.value = 1;
    const g = this.ctx.createGain(); g.gain.value = vol;
    src.connect(bp); bp.connect(g); g.connect(this.master);
    src.start(t0);
  },
  play(kind) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    this.resume();
    switch (kind) {
      case "attack":   this._sweep(220, 90, 0.12, "sawtooth", 0.35); this._noise(0.06, 0.25, 1800); break;
      case "hit":      this._noise(0.1, 0.4, 900); this._tone(120, 0.12, "square", 0.25); break;
      case "crit":     this._sweep(440, 180, 0.18, "square", 0.35); this._tone(880, 0.1, "sine", 0.3); this._noise(0.08, 0.3, 2200); break;
      case "miss":     this._sweep(300, 260, 0.08, "triangle", 0.18); break;
      case "block":    this._tone(520, 0.06, "square", 0.25); this._tone(380, 0.1, "square", 0.18); break;
      case "spell":    this._sweep(200, 900, 0.22, "triangle", 0.28); this._tone(660, 0.14, "sine", 0.2); break;
      case "fire":     this._noise(0.3, 0.35, 700); this._sweep(180, 90, 0.3, "sawtooth", 0.22); break;
      case "ice":      this._tone(1200, 0.12, "sine", 0.25); this._tone(1600, 0.18, "sine", 0.2); this._noise(0.08, 0.15, 3000); break;
      case "lightning":this._noise(0.06, 0.5, 3500); this._sweep(1800, 400, 0.1, "square", 0.3); break;
      case "holy":     this._tone(880, 0.25, "sine", 0.25); this._tone(1320, 0.35, "sine", 0.2); this._tone(1760, 0.35, "sine", 0.15); break;
      case "dark":     this._sweep(180, 60, 0.45, "sawtooth", 0.3); this._tone(90, 0.4, "square", 0.15); break;
      case "heal":     this._tone(523, 0.15, "sine", 0.3); setTimeout(() => this._tone(784, 0.2, "sine", 0.28), 60); break;
      case "pickup":   this._tone(880, 0.06, "sine", 0.3); setTimeout(() => this._tone(1320, 0.08, "sine", 0.28), 40); break;
      case "chest":    this._tone(392, 0.08, "triangle", 0.25); setTimeout(() => this._tone(523, 0.08, "triangle", 0.25), 60); setTimeout(() => this._tone(784, 0.16, "triangle", 0.3), 130); break;
      case "levelup":  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this._tone(f, 0.18, "triangle", 0.3), i * 80)); break;
      case "victory":  [392, 523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this._tone(f, 0.12, "triangle", 0.28), i * 60)); break;
      case "bossdown": [130, 98, 65, 196, 262, 392, 523, 784, 1046, 1568].forEach((f, i) => setTimeout(() => this._tone(f, 0.18, i < 3 ? "sawtooth" : "triangle", 0.3), i * 90)); this._noise(0.4, 0.3, 600); break;
      case "death":    this._sweep(300, 40, 0.8, "sawtooth", 0.35); this._tone(80, 0.7, "square", 0.2); break;
      case "hurt":     this._noise(0.14, 0.45, 500); this._tone(90, 0.18, "square", 0.3); break;
      case "step":     this._tone(80, 0.04, "square", 0.12); this._noise(0.03, 0.08, 400); break;
      case "stairs":   this._sweep(400, 200, 0.25, "triangle", 0.25); this._sweep(300, 150, 0.3, "sine", 0.2); break;
      case "shrine":   this._tone(659, 0.3, "sine", 0.25); this._tone(988, 0.4, "sine", 0.2); break;
      case "trap":     this._noise(0.2, 0.5, 400); this._sweep(200, 80, 0.25, "sawtooth", 0.3); break;
      case "portal":   this._sweep(100, 1200, 0.5, "sine", 0.25); this._sweep(200, 800, 0.5, "triangle", 0.2); break;
      case "click":    this._tone(1200, 0.03, "square", 0.15); break;
      case "flee":     this._sweep(600, 200, 0.15, "triangle", 0.2); this._noise(0.1, 0.2, 1200); break;
      case "monster_hurt": this._noise(0.12, 0.45, 400); this._sweep(150, 60, 0.2, "sawtooth", 0.35); break;
      case "monster_roar": this._sweep(120, 40, 0.4, "sawtooth", 0.5); this._noise(0.3, 0.6, 200); break;
      default: break;
    }
  },

  playSpell(type) {
    if (type === "fire") this.play("fire");
    else if (type === "ice") this.play("ice");
    else if (type === "lightning") this.play("lightning");
    else if (type === "holy") this.play("holy");
    else if (type === "dark" || type === "poison") this.play("dark");
    else if (type === "heal") this.play("heal");
    else this.play("spell");
  },


  _musicNodes: [],
  _musicTheme: null,
  _musicGain: null,
  _loopTimer: null,

  _musicNote(freq, startTime, dur, type, vol) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const g   = this.ctx.createGain();
    osc.type = type || "sine"; osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(vol, startTime + 0.05);
    g.gain.linearRampToValueAtTime(vol * 0.7, startTime + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, startTime + dur);
    osc.connect(g); g.connect(this._musicGain || this.master);
    osc.start(startTime); osc.stop(startTime + dur + 0.1);
    this._musicNodes.push(osc, g);
  },

  _scheduleLoop(theme) {
    if (!this.ctx || this._musicTheme !== theme) return;
    const t0 = this.ctx.currentTime;
    const THEMES = {
      title:         { notes:[196,220,246,261,293,261,220,196], interval:0.55, chord:[65,98,130], vol:0.07, type:"triangle" },
      shop:          { notes:[392,440,494,523,494,440,392,370], interval:0.28, chord:[98,130,165], vol:0.05, type:"sine" },
      dungeon_dark:  { notes:[130,123,116,110,116,123,130,138], interval:0.6,  chord:[65,82],      vol:0.05, type:"sawtooth" },
      dungeon_eerie: { notes:[116,104,110,98, 104,116,110,104], interval:0.65, chord:[58,87],      vol:0.04, type:"triangle" },
      dungeon_nature:{ notes:[261,293,329,349,329,293,261,246], interval:0.4,  chord:[65,98,130],  vol:0.05, type:"sine" },
      dungeon_fire:  { notes:[138,146,155,146,138,130,146,155], interval:0.35, chord:[55,82,110],  vol:0.06, type:"sawtooth" },
      dungeon_ice:   { notes:[392,415,440,466,440,415,392,370], interval:0.5,  chord:[98,147,196], vol:0.04, type:"sine" },
      dungeon_dark2: { notes:[87, 82, 77, 73, 77, 82, 87, 92],  interval:0.55, chord:[43,65,87],   vol:0.05, type:"sawtooth" },
      dungeon_void:  { notes:[55, 52, 49, 46, 49, 52, 55, 58],  interval:0.7,  chord:[27,41,55],   vol:0.04, type:"sawtooth" },
      dungeon_divine:{ notes:[523,587,659,698,659,587,523,494], interval:0.4,  chord:[130,196,261], vol:0.06, type:"triangle" },
      boss:          { notes:[110,104,98, 87, 98, 104,110,116], interval:0.3,  chord:[55,82,110],  vol:0.07, type:"square" },
    };
    const cfg = THEMES[theme] || THEMES.dungeon_dark;
    cfg.notes.forEach((freq, i) => {
      this._musicNote(freq, t0 + i * cfg.interval, cfg.interval * 0.9, cfg.type, cfg.vol);
    });
    cfg.chord.forEach(f => {
      this._musicNote(f, t0, cfg.notes.length * cfg.interval * 0.95, "sine", cfg.vol * 0.3);
    });
    const totalDur = cfg.notes.length * cfg.interval;
    this._loopTimer = setTimeout(() => this._scheduleLoop(theme), (totalDur - 0.1) * 1000);
  },

  startMusic(theme) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    this.resume();
    if (this._musicTheme === theme) return;
    this.stopMusic(false);
    this._musicTheme = theme;
    if (!this._musicGain) {
      this._musicGain = this.ctx.createGain();
      this._musicGain.gain.value = this.muted ? 0 : 0.45;
      this._musicGain.connect(this.master);
    }
    this._scheduleLoop(theme);
  },

  stopMusic(clearTheme) {
    clearTimeout(this._loopTimer);
    if (clearTheme !== false) this._musicTheme = null;
    this._musicNodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch(e){} });
    this._musicNodes = [];
  },

  setMuted(m) {
    this.muted = m;
    if (this.master)     this.master.gain.value     = m ? 0 : this.vol;
    if (this._musicGain) this._musicGain.gain.value = m ? 0 : 0.45;
  },
};




function useFX() {
  const [floats, setFloats] = useState([]);
  const [particles, setParticles] = useState([]);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState(null);

  const popText = useCallback((text, color = "#fbbf24", opts = {}) => {
    const id = Date.now() + Math.random();
    const x = opts.x !== undefined ? opts.x : 50 + (Math.random() - 0.5) * 10;
    const y = opts.y !== undefined ? opts.y : 35 + (Math.random() - 0.5) * 5;
    const size = opts.size || 22;
    setFloats(prev => [...prev.slice(-12), { id, text, color, x, y, size, born: Date.now() }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  const burst = useCallback((color = "#fbbf24", count = 14, opts = {}) => {
    const cx = opts.x !== undefined ? opts.x : 50;
    const baseId = Date.now();
    const newParts = [];
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const spd = 30 + Math.random() * 40;
      newParts.push({
        id: baseId + i + Math.random(),
        x: cx, y: cy,
        dx: Math.cos(ang) * spd,
        dy: Math.sin(ang) * spd,
        color, size: 4 + Math.random() * 4,
        born: Date.now(),
      });
    }
    setParticles(prev => [...prev.slice(-40), ...newParts]);
    setTimeout(() => {
      const ids = new Set(newParts.map(p => p.id));
      setParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 900);
  }, []);

  const shakeScreen = useCallback((intensity = 8) => {
    setShake(intensity);
    setTimeout(() => setShake(0), 350);
  }, []);

  const [monsterHitAnim, setMonsterHitAnim] = useState(false);
  const monsterHit = useCallback(() => {
    setMonsterHitAnim(true);
    setTimeout(() => setMonsterHitAnim(false), 300);
  }, []);

  const flashScreen = useCallback((color = "#ffffff", dur = 150) => {
    setFlash(color);
    setTimeout(() => setFlash(null), dur);
  }, []);

  return { floats, particles, shake, flash, monsterHitAnim, popText, burst, shakeScreen, flashScreen, monsterHit };
}


function FXOverlay({ floats, particles, flash }) {
  return (
    <>
      {flash && (
        <div style={{ position: "absolute", inset: 0, background: flash, opacity: 0.45, pointerEvents: "none", zIndex: 1000, mixBlendMode: "screen" }} />
      )}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
        {floats.map(f => {
          const age = (Date.now() - f.born) / 1200;
          return (
            <div key={f.id} style={{
              position: "absolute",
              left: `${f.x}%`, top: `${f.y - age * 25}%`,
              color: f.color,
              fontSize: f.size,
              fontWeight: "bold",
              fontFamily: "'Courier New', monospace",
              textShadow: `0 0 6px ${f.color}, 0 2px 3px #000`,
              opacity: Math.max(0, 1 - age),
              transform: `translate(-50%,-50%) scale(${1 + age * 0.3})`,
              transition: "top 0.15s linear, opacity 0.1s linear",
              whiteSpace: "nowrap",
            }}>{f.text}</div>
          );
        })}
        {particles.map(p => {
          const age = (Date.now() - p.born) / 900;
          return (
            <div key={p.id} style={{
              position: "absolute",
              left: `calc(${p.x}% + ${p.dx * age}px)`,
              top: `calc(${p.y}% + ${p.dy * age + age * age * 40}px)`,
              width: p.size, height: p.size, borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              opacity: Math.max(0, 1 - age),
              transform: "translate(-50%,-50%)",
            }} />
          );
        })}
      </div>
    </>
  );
}


if (typeof document !== "undefined" && !document.getElementById("doe-fx-css")) {

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.id = "doe-fx-css";
  s.textContent = `
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0d0d1a; } ::-webkit-scrollbar-thumb { background: #3d2d5d; border-radius: 3px; }
    @keyframes doe-shake { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-4px,-2px)} 20%{transform:translate(4px,2px)} 30%{transform:translate(-3px,3px)} 40%{transform:translate(3px,-3px)} 50%{transform:translate(-2px,-1px)} 60%{transform:translate(2px,1px)} 70%{transform:translate(-2px,2px)} 80%{transform:translate(2px,-2px)} 90%{transform:translate(-1px,1px)} }
    .doe-shake { animation: doe-shake 0.35s linear; }
    @keyframes doe-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.08)} }
    .doe-pulse { animation: doe-pulse 1.5s ease-in-out infinite; }
    @keyframes doe-hit { 0%{filter:brightness(1) hue-rotate(0deg)} 50%{filter:brightness(2.5) hue-rotate(-20deg)} 100%{filter:brightness(1) hue-rotate(0deg)} }
    .doe-hit { animation: doe-hit 0.25s ease-out; }
    @keyframes doe-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .doe-fadein { animation: doe-fadein 0.25s ease-out; }
    @keyframes doe-glow-pulse { 0%,100%{box-shadow:0 0 10px currentColor} 50%{box-shadow:0 0 28px currentColor, 0 0 8px currentColor} }
    @keyframes doe-card-in { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    .doe-card-in { animation: doe-card-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
    @keyframes doe-rarity-flash { 0%{opacity:0.3} 50%{opacity:1} 100%{opacity:0.3} }
    .doe-legendary { animation: doe-rarity-flash 2s ease-in-out infinite; }
    @keyframes doe-monster-hit { 0%{transform:translateX(0) scale(1); filter:brightness(1)} 20%{transform:translateX(-8px) scale(0.95); filter:brightness(2.5) drop-shadow(0 0 10px #ef4444)} 40%{transform:translateX(8px) scale(0.95)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} 100%{transform:translateX(0) scale(1); filter:brightness(1)} }
    .doe-monster-hit { animation: doe-monster-hit 0.3s cubic-bezier(.36,.07,.19,.97) both; }
    button:hover { filter: brightness(1.12); }
    button:active { filter: brightness(0.9); transform: scale(0.97); }
  `;
  document.head.appendChild(s);
}




function DungeonQuest() {

  const [meta, setMeta] = useState(() => loadMeta());
  const [screen, setScreen] = useState("title");
  const [modal, setModal] = useState(null);
  const [playerClass, setPlayerClass] = useState(null);
  const [playerName, setPlayerName] = useState("Hero");
  const [hardcore, setHardcore] = useState(false);
  const [ngPlus, setNgPlus] = useState(0);
  const [player, setPlayer] = useState(null);
  const [floor, setFloor] = useState(1);
  const [mapData, setMapData] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [biomesSeen, setBiomesSeen] = useState(new Set());
  const [town, setTown] = useState(null);

  const [currentDungeon, setCurrentDungeon] = useState(DUNGEONS[0]); // selected dungeon
  const [dungeonFloor, setDungeonFloor] = useState(1); // floor within the dungeon


  const [combatEnemy, setCombatEnemy] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [animating, setAnimating] = useState(false);

  const [selectedDifficulty, setSelectedDifficulty] = useState("EASY");
  const [currentDifficulty, setCurrentDifficulty] = useState("EASY");
  const [sessionStats, setSessionStats] = useState({}); 


  const [reputation, setReputation] = useState(() => meta.reputation || initialReputation());
  const [achievements, setAchievements] = useState(() => meta.achievements || initialAchievementProgress());
  const [house, setHouse] = useState(() => meta.house || initialHouse());
  const [quests, setQuests] = useState([]);
  const [activeTitle, setActiveTitle] = useState("NOVICE");
  const [dailyDone, setDailyDone] = useState(false);
  const [inventoryTab, setInventoryTab] = useState("WEAPON");


  const [messages, setMessages] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [event, setEvent] = useState(null);
  const logRef = useRef(null);
  const combatLogRef = useRef(null);


  const fx = useFX();
  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  useEffect(() => { AUDIO.setMuted(muted); }, [muted]);


  useEffect(() => {
    const loader = document.getElementById('loading');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  }, []);




  useEffect(() => {
    if (screen === "title" || screen === "charselect" || screen === "dungeon_select") {
      AUDIO.startMusic("title");
    } else if (screen === "shop") {
      AUDIO.startMusic("shop");
    } else if (screen === "game" && currentDungeon) {
      AUDIO.startMusic(currentDungeon.musicTheme || "dungeon_dark");
    } else if (screen === "combat" && currentDungeon) {

      if (combatEnemy?.isBoss) AUDIO.startMusic("boss");
    } else if (screen === "gameover") {
      AUDIO.stopMusic();
    }
  }, [screen, currentDungeon, combatEnemy?.isBoss]);

  const addMsg = useCallback((msg, color = "#e2e8f0") => {
    setMessages(prev => [...prev.slice(-80), { text: msg, color, id: Date.now() + Math.random() }]);
  }, []);
  const addCombatMsg = useCallback((msg, color = "#e2e8f0") => {
    setCombatLog(prev => [...prev.slice(-40), { text: msg, color, id: Date.now() + Math.random() }]);
  }, []);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages]);
  useEffect(() => { if (combatLogRef.current) combatLogRef.current.scrollTop = combatLogRef.current.scrollHeight; }, [combatLog]);


  useEffect(() => {
    const t = setInterval(() => {
      setMeta(prev => {
        const next = { ...prev, reputation, achievements, house };
        saveMeta(next);
        return next;
      });
    }, 20000);
    return () => clearInterval(t);
  }, [reputation, achievements, house]);




  const stats = useMemo(() => player ? calcPlayerStats(player, house) : null, [player, house]);
  const hpPct = player && stats ? Math.max(0, player.hp / stats.maxHp * 100) : 0;
  const manaPct = player && stats ? Math.max(0, player.mana / stats.maxMana * 100) : 0;
  const expPct = player ? (player.exp / player.expNext) * 100 : 0;




  const startFloor = useCallback((fl, pl, dungeon) =>
  {
    const dng = dungeon || currentDungeon;
    const biome = dng ? dng.biome : biomeForFloor(fl);
    const { grid, enemies: newEnemies, playerStart, weather, visited, visionRadius } = generateMap(fl, biome);
    const vis = updateVisibility({ visited }, playerStart.x, playerStart.y, visionRadius);
    setMapData({ grid, playerPos: playerStart, biome, weather, visited: vis, visionRadius });
    setEnemies(newEnemies);
    setFloor(fl);
    setDungeonFloor(fl);
    setBiomesSeen(prev => new Set([...prev, biome]));
    const bName = dng?.name || BIOMES[biome]?.name || "Unknown";
    const wName = WEATHER[weather]?.name || "";
    addMsg(`! Floor ${fl}   ${bName} (${wName})`, "#a78bfa");
    setScreen("game");
  }, [addMsg, currentDungeon]);


  const startGame = useCallback(() => {
    if (!playerClass) return;
    const mastery = masteryBonuses(meta, playerClass);
    const p = createPlayer(playerClass, null, playerName, mastery);

    if (ngPlus > 0) {
      const mods = ngPlusMods(ngPlus);
      p.baseAtk = Math.floor(p.baseAtk * 1.1);
      p.maxHp = Math.floor(p.maxHp * 1.2);
      p.hp = p.maxHp;
    }

    const starterWeaponId = CLASSES[playerClass]?.startWeapon || "w_sword1";
    const sw = ALL_ITEMS.find(i => i.id === starterWeaponId);
    const sa = ALL_ITEMS.find(i => i.id === "a_leather");
    if (sw) p.equipment.weapon = { ...sw, uid: "sw_start" };
    if (sa) p.equipment.armor = { ...sa, uid: "sa_start" };
    p.inventory = [
      { ...ALL_ITEMS.find(i => i.id === "p_hp"), uid: "sp1" },
      { ...ALL_ITEMS.find(i => i.id === "p_hp"), uid: "sp2" },
      { ...ALL_ITEMS.find(i => i.id === "p_mana"), uid: "sp3" },
    ];
    p.quests = rollQuests(1, 3);
    setPlayer(p);
    setQuests(p.quests);

    setScreen("dungeon_select");
  }, [playerClass, playerName, meta, ngPlus]);


  const startDungeon = useCallback((dungeon, pl) => {
    const p = pl || player;
    if (!p) return;
    if (p.level < dungeon.requiredLevel) {
      addMsg(`x  Requires Level ${dungeon.requiredLevel}!`, "#ef4444");
      return;
    }
    setCurrentDungeon(dungeon);
    setDungeonFloor(1);
    addMsg(`a  Entering ${dungeon.name}...`, dungeon.colors.accent);
    fx.flashScreen(dungeon.colors.accent, 400);
    startFloor(1, p, dungeon);
  }, [player, addMsg, startFloor, fx]);





  const movePlayer = useCallback((dx, dy) => {
    if (!mapData || screen !== "game" || animating) return;
    const nx = mapData.playerPos.x + dx, ny = mapData.playerPos.y + dy;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;
    const tile = mapData.grid[ny][nx];
    if (tile === T.WALL) return;


    const enemy = enemies.find(e => e.x === nx && e.y === ny);
    if (enemy) {
      setCombatEnemy(enemy);
      setCombatLog([]);
      setPlayerTurn(true);
      setScreen("combat");
      return;
    }


    const newVisited = updateVisibility(mapData, nx, ny, mapData.visionRadius);
    setMapData(prev => ({ ...prev, playerPos: { x: nx, y: ny }, visited: newVisited }));


    AUDIO.play("step");


    if (tile === T.CHEST) {
      const count = 1 + Math.floor(Math.random() * 3);
      const loot = generateDungeonLoot(currentDungeon?.tier || 1, floor, count, { hardcore, difficulty: currentDifficulty });

      if (Math.random() < 0.4) loot.push(...generateMaterials(floor, 1 + Math.floor(Math.random() * 2)));
      AUDIO.play("chest");
      fx.burst("#fbbf24", 18, { x: 50, y: 50 });

      const bestRarity = loot.reduce((best, it) => {
        const ord = RARITY_ORDER.indexOf(it.rarity);
        return ord > RARITY_ORDER.indexOf(best) ? it.rarity : best;
      }, "COMMON");
      if (["EPIC","LEGENDARY","MYTHIC"].includes(bestRarity)) {
        fx.burst(RARITY[bestRarity]?.color || "#a855f7", 40);
        fx.popText(`${bestRarity} DROP!`, RARITY[bestRarity]?.color, { size: 30 });
      } else {
        fx.popText("LOOT!", "#fbbf24", { size: 26 });
      }
      loot.forEach(it => addMsg(`x  Found: ${it.icon} ${it.name} [${RARITY[it.rarity]?.name}]${it.upgradeLevel > 0 ? ` +${it.upgradeLevel}` : ""}${it.isVariant  ? " ~" : ""}`, RARITY[it.rarity]?.color || "#e2e8f0"));
      setPlayer(prev => {
        let inv = [...(prev.inventory || []), ...loot];
        loot.forEach(it => setMeta(m => recordItemSeen(m, it.id)));
        return { ...prev, inventory: inv };
      });
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
      progressQuests({ type: "chest" });

    } else if (tile === T.STAIRS) {

      if (enemies.length > 0) {
        AUDIO.play("miss");
        fx.shakeScreen(6);
        fx.popText(`${enemies.length} enemies remain!`, "#ef4444", { size: 20 });
        addMsg(`:  Defeat all enemies first! (${enemies.length} remaining)`, "#ef4444");
        return;
      }

      const maxFloor = currentDungeon?.maxFloors || 99;
      if (dungeonFloor >= maxFloor) {
        AUDIO.play("victory");
        fx.flashScreen(currentDungeon?.colors?.accent || "#fbbf24", 600);
        fx.burst(currentDungeon?.colors?.accent || "#fbbf24", 60);
        fx.popText("DUNGEON CLEARED!", "#fbbf24", { size: 34 });
        addMsg(`xRx ${currentDungeon?.name || "Dungeon" } CLEARED! Returning to hub...`, "#fbbf24");
        setPlayer(prev => ({ ...prev, floorsCleared: prev.floorsCleared + 1 }));
        setTimeout(() => setScreen("dungeon_select"), 2000);
        return;
      }
      AUDIO.play("stairs");
      fx.flashScreen("#a855f7", 200);
      setPlayer(prev => {
        const newFloor = floor + 1;
        const healed = { ...prev, floorsCleared: prev.floorsCleared + 1,
          hp: Math.min(stats?.maxHp || prev.hp, prev.hp + Math.floor((stats?.maxHp || prev.hp) * 0.2)),
          mana: Math.min(stats?.maxMana || prev.mana, prev.mana + Math.floor((stats?.maxMana || prev.mana) * 0.2)) };
        addMsg(`! Descending to floor ${newFloor}... (+20% HP/MP)`, "#a78bfa");
        progressQuests({ type: "floor", floor: newFloor });
        startFloor(newFloor, healed);
        return healed;
      });
    } else if (tile === T.SHRINE) {
      AUDIO.play("shrine");
      fx.burst("#22c55e", 16); fx.popText("BLESSED", "#22c55e");
      setPlayer(prev => ({ ...prev,
        hp: Math.min(stats?.maxHp || prev.hp, prev.hp + Math.floor((stats?.maxHp || prev.hp) * 0.4)),
        mana: Math.min(stats?.maxMana || prev.mana, prev.mana + Math.floor((stats?.maxMana || prev.mana) * 0.4)),
      }));
      addMsg(": Shrine restores your strength! (+40% HP/MP)", "#22c55e");
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
    } else if (tile === T.FOUNTAIN) {
      const r = Math.random();
      setPlayer(prev => {
        if (r < 0.25) { addMsg(": Fountain   full HP/MP!", "#22c55e"); return { ...prev, hp: stats?.maxHp || prev.hp, mana: stats?.maxMana || prev.mana }; }
        if (r < 0.5)  { addMsg(": Fountain grants +5 max HP perma.", "#22c55e"); return { ...prev, maxHp: prev.maxHp + 5, hp: prev.hp + 5 }; }
        if (r < 0.8)  { addMsg(": Bitter water   -10 HP.", "#ef4444"); return { ...prev, hp: Math.max(1, prev.hp - 10) }; }
        addMsg(": Glowing water   level up!", "#fbbf24");
        return levelUp({ ...prev, exp: prev.expNext });
      });
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
    } else if (tile === T.TRAP) {
      AUDIO.play("trap");
      fx.shakeScreen(10); fx.flashScreen("#ef4444", 120);
      setPlayer(prev => {
        const dmg = Math.floor(Math.random() * 20) + 10 + floor * 2;
        fx.popText(`-${dmg}`, "#ef4444", { size: 28 });
        addMsg(`a TRAP! -${dmg} HP`, "#ef4444");
        return { ...prev, hp: Math.max(1, prev.hp - dmg) };
      });
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
    } else if (tile === T.SHOP) {
      const items = generateLoot(floor, 8);
      setShopItems(items);
      setScreen("shop");
    } else if (tile === T.TOWN) {
      setTown(generateTown(floor));
      setScreen("town");
    } else if (tile === T.SECRET) {
      AUDIO.play("chest"); fx.burst("#e879f9", 22);
      fx.popText("SECRET!", "#e879f9", { size: 28 });
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
      const loot = generateLoot(floor + 3, 2);
      loot.forEach(it => addMsg(`S Secret! ${it.icon} ${it.name} [${RARITY[it.rarity]?.name}]`, RARITY[it.rarity]?.color));
      setPlayer(prev => ({ ...prev, inventory: [...prev.inventory, ...loot] }));
    } else if (tile === T.PORTAL) {
      AUDIO.play("portal");
      fx.burst("#a855f7", 30); fx.flashScreen("#a855f7", 300);
      addMsg("xR The portal hums... descend rapidly!", "#a855f7");
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
      setPlayer(prev => {
        const newFloor = floor + 2;
        const healed = { ...prev, floorsCleared: prev.floorsCleared + 2 };
        startFloor(newFloor, healed);
        return healed;
      });
    } else if (tile === T.FORGE) {
      setScreen("crafting");
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
    } else if (tile === T.PUZZLE) {

      if (player.level >= floor) {
        const reward = generateLoot(floor + 2, 2);
        setPlayer(prev => ({ ...prev, inventory: [...prev.inventory, ...reward] }));
        addMsg("x Solved puzzle   treasure!", "#a78bfa");
      } else {
        setPlayer(prev => ({ ...prev, hp: Math.max(1, prev.hp - 20) }));
        addMsg("x Puzzle backfires. -20 HP", "#ef4444");
      }
      const g = mapData.grid.map(r => [...r]); g[ny][nx] = T.FLOOR;
      setMapData(prev => ({ ...prev, grid: g }));
    }
  }, [mapData, screen, animating, enemies, floor, addMsg, startFloor, stats, player]);




  const progressQuests = useCallback((ev) => {
    setQuests(prev => prev.map(q => {
      if (q.complete) return q;
      let done = false;
      const p = { ...q };
      if (ev.type === "kill" && q.type === "kill") {
        if (!q.enemyId || q.enemyId === ev.enemyId) p.progress = (p.progress || 0) + 1;
      } else if (ev.type === "boss" && q.type === "boss") {
        if (!q.enemyId || q.enemyId === ev.enemyId) p.progress = (p.progress || 0) + 1;
      } else if (ev.type === "chest" && q.type === "chest") {
        p.progress = (p.progress || 0) + 1;
      } else if (ev.type === "floor" && q.type === "floor") {
        p.progress = Math.max(p.progress || 0, ev.floor);
      } else if (ev.type === "crit" && q.type === "crit") {
        p.progress = (p.progress || 0) + 1;
      } else if (ev.type === "gather" && q.type === "gather") {
        if (q.itemId === ev.itemId) p.progress = (p.progress || 0) + ev.count;
      }
      if ((p.progress || 0) >= p.count) { p.complete = true; done = true; }
      if (done) {
        addMsg(`S Quest complete: ${p.name}`, "#fde047");
        if (p.reward) applyQuestReward(p.reward, p.name);
      }
      return p;
    }));
  }, [addMsg]);

  const applyQuestReward = useCallback((reward, questName) => {
    setPlayer(prev => {
      const p = { ...prev };
      if (reward.gold) { p.gold += reward.gold; addMsg(`  +${reward.gold}g`, "#fbbf24"); }
      if (reward.exp)  { p.exp += reward.exp; }
      if (reward.item) {
        const it = itemById(reward.item);
        if (it) {
          p.inventory = [...p.inventory, { ...it, uid: `qr_${Date.now()}` }];
          addMsg(`  +${it.icon} ${it.name}`, RARITY[it.rarity]?.color || "#e2e8f0");
        }
      }
      if (reward.rep) {
        setReputation(rep => {
          let next = rep;
          Object.entries(reward.rep).forEach(([f, v]) => { next = gainRep(next, f, v); });
          Object.entries(reward.rep).forEach(([f, v]) => addMsg(`  +${v} ${FACTIONS[f]?.name} rep`, FACTIONS[f]?.color));
          return next;
        });
      }
      return p;
    });
  }, [addMsg]);




  useEffect(() => {
    const handleKey = (e) => {
      if (screen !== "game") return;
      const moves = {
        ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
        w:[0,-1], s:[0,1], a:[-1,0], d:[1,0],
        W:[0,-1], S:[0,1], A:[-1,0], D:[1,0],
      };
      const mv = moves[e.key];
      if (mv) { e.preventDefault(); movePlayer(mv[0], mv[1]); }
      if (e.key === "i" || e.key === "I") setScreen("inventory");
      if (e.key === "m" || e.key === "M") setScreen("menu");
      if (e.key === "q" || e.key === "Q") setScreen("quests");
      if (e.key === "b" || e.key === "B") setScreen("bestiary");
      if (e.key === "k" || e.key === "K") setScreen("skilltree");
      if (e.key === "c" || e.key === "C") setScreen("crafting");
      if (e.key === "f" || e.key === "F") setScreen("factions");
      if (e.key === "h" || e.key === "H") setScreen("housing");
      if (e.key === "t" || e.key === "T") setScreen("achievements");
      if (e.key === "Escape") { if (screen !== "game" && screen !== "combat") setScreen("game"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, movePlayer]);




  const enemyTurnLogic = useCallback((p, enemy) => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      if (!enemy || enemy.hp <= 0) return;

      if (!canAct(enemy)) {
        addCombatMsg(`${enemy.icon} ${enemy.name} is ${enemy.status}ed!`, "#60a5fa");
        setEnemies(prev => prev.map(e => e.uid === enemy.uid ? { ...e, statusTurns: Math.max(0, e.statusTurns - 1), status: e.statusTurns <= 1 ? null : e.status } : e));
        setCombatEnemy(prev => prev ? { ...prev, statusTurns: Math.max(0, prev.statusTurns - 1), status: prev.statusTurns <= 1 ? null : prev.status } : prev);
        setPlayerTurn(true);
        return;
      }

      setPlayer(prev => {
        if (!prev) return prev;
        const s = calcPlayerStats(prev, house);
        let eAtk = Math.floor(enemy.atk * (0.85 + Math.random() * 0.3));
        let dmg = Math.max(Math.floor(eAtk * 0.15) || 1, eAtk - s.totalDef);


        if (prev.cls === "ROGUE" && Math.random() < 0.2) {
          addCombatMsg(`${prev.name} DODGED!`, "#22c55e");
          AUDIO.play("miss");
          fx.popText("DODGE", "#22c55e", { size: 22 });
          setPlayerTurn(true); return prev;
        }

        if (prev.divineShield && prev.hp <= dmg) {
          addCombatMsg("S Divine Shield absorbs!", "#f59e0b");
          AUDIO.play("holy");
          fx.flashScreen("#f59e0b", 250);
          fx.burst("#f59e0b", 24);
          fx.popText("DIVINE SHIELD", "#f59e0b", { size: 22 });
          setPlayerTurn(true);
          return { ...prev, divineShield: false, hp: 1 };
        }

        const newHp = Math.max(0, prev.hp - dmg);
        addCombatMsg(`${enemy.icon} ${enemy.name} hits for ${dmg}`, "#f87171");
        AUDIO.play("hurt");
        fx.shakeScreen(Math.min(10, 3 + Math.floor(dmg / 20)));
        fx.flashScreen("#ef4444", 120);
        fx.popText(`-${dmg}`, "#ef4444", { size: 22, y: 40 });

        if (newHp <= 0) {
          if (prev.cls === "NECROMANCER" && Math.random() < 0.2) {
            addCombatMsg("x Death Pact   revived!", "#8b5cf6");
            AUDIO.play("dark");
            fx.burst("#8b5cf6", 26);
            fx.popText("DEATH PACT", "#8b5cf6", { size: 22 });
            setPlayerTurn(true);
            return { ...prev, hp: Math.floor(s.maxHp * 0.3) };
          }
          addCombatMsg(`x ${prev.name} falls...`, "#ef4444");
          AUDIO.play("death");
          fx.flashScreen("#ef4444", 800);
          fx.shakeScreen(14);
          setTimeout(() => handleDeath(), 1500);
          return { ...prev, hp: 0 };
        }

        let final = newHp;
        if (prev.cls === "PALADIN" && prev.hp > 0) {
          final = Math.min(s.maxHp, newHp + 15);
        }

        setPlayerTurn(true);
        return { ...prev, hp: final };
      });
    }, 600);
  }, [addCombatMsg, house, fx]);

  const handleDeath = useCallback(() => {
    setMeta(prev => {
      const runData = {
        name: player.name, cls: player.cls, floor, kills: player.kills,
        died: true, cause: combatEnemy?.name || "unknown", hardcore,
      };
      const next = recordRun(prev, runData);
      saveMeta({ ...next, reputation, achievements, house });
      return next;
    });
    setScreen("gameover");
  }, [player, floor, combatEnemy, hardcore, reputation, achievements, house]);

  const doPlayerAction = useCallback((action, spellName) => {
    if (!playerTurn || animating || !combatEnemy || !player) return;
    setPlayerTurn(false);
    setAnimating(true);

    setTimeout(() => {
      let up = { ...player };
      let ue = { ...combatEnemy };
      const s = calcPlayerStats(player, house);

      if (action === "attack" || action === "spell") {
        let dmg = 0, isCrit = false;

        if (action === "attack") {
          AUDIO.play("attack");
          const res = calcBasicAttack({ ...player, totalAtk: s.totalAtk, crit: s.crit }, combatEnemy, s.mult || { type: "phys" });
          dmg = res.dmg; isCrit = res.isCrit;
          if (res.isAdapted) addCombatMsg("x Enemy adapted! -DMG", "#f87171");
          

          ue.adaptiveRes = { ...(ue.adaptiveRes || {}) };
          ue.adaptiveRes.phys = Math.min(0.8, (ue.adaptiveRes.phys || 0) + 0.25);

          if (up.shadowFirst && up.cls === "ROGUE") {
            isCrit = true; dmg = Math.floor(dmg * 1.5); up.shadowFirst = false;
            addCombatMsg("a Shadowstrike!", "#a78bfa");
            AUDIO.play("dark");
            fx.burst("#a78bfa", 20);
          }
        } else if (action === "spell" && spellName) {
          const sp = SPELLS[spellName];
          if (!sp) { setPlayerTurn(true); setAnimating(false); return; }
          const manaCost = (up.cls === "BERSERKER" && up.hp < s.maxHp * 0.25) ? 0 : sp.mana;
          if (up.mana < manaCost) { addCombatMsg("R Not enough mana!", "#ef4444"); AUDIO.play("miss"); setPlayerTurn(true); setAnimating(false); return; }
          up.mana = Math.max(0, up.mana - manaCost);


          AUDIO.playSpell(sp.type);

          if (sp.dmg[0] < 0) {

            const healAmt = Math.abs(Math.floor(Math.random() * (Math.abs(sp.dmg[1]) - Math.abs(sp.dmg[0]) + 1)) + Math.abs(sp.dmg[0]));
            up.hp = Math.min(s.maxHp, up.hp + healAmt);
            addCombatMsg(`xa +${healAmt} HP`, "#4ade80");
            AUDIO.play("heal");
            fx.burst("#4ade80", 18);
            fx.popText(`+${healAmt}`, "#4ade80", { size: 26, y: 60 });
            dmg = 0;
          } else if (sp.dmg[0] === 0 && sp.dmg[1] === 0) {

            if (spellName === "War Cry" || spellName === "Frenzy") up.buffTurns = 3;
            if (spellName === "Smoke Bomb") up.defBuffTurns = 2;
            if (spellName === "Lich Form") up.lichTurns = 3;
            if (spellName === "Death Mark") { ue.status = "MARK"; ue.statusTurns = 2; }
            if (spellName === "Trap") { ue.status = "STUN"; ue.statusTurns = 2; }
            addCombatMsg(`S ${spellName} activated!`, "#a78bfa");
            fx.burst("#a78bfa", 20);
            fx.popText(spellName.toUpperCase(), "#a78bfa", { size: 22, y: 60 });
            dmg = 0;
          } else {
            const res = calcSpellDamage({ ...player, totalAtk: s.totalAtk, crit: s.crit }, combatEnemy, spellName, s.mult || {});
            dmg = res.dmg; isCrit = res.isCrit;
            if (res.isAdapted) addCombatMsg("x Enemy adapted! -DMG", "#f87171");


            ue.adaptiveRes = { ...(ue.adaptiveRes || {}) };
            ue.adaptiveRes[sp.type] = Math.min(0.8, (ue.adaptiveRes[sp.type] || 0) + 0.35);


            const elemColor = { fire: "#f97316", ice: "#60a5fa", lightning: "#fbbf24", holy: "#fde047", dark: "#8b5cf6", arcane: "#c4b5fd", poison: "#22c55e", phys: "#fca5a5" }[sp.type] || "#a78bfa";
            fx.burst(elemColor, 24);
            if (sp.status && Math.random() < 0.45) {
              ue = applyStatus(ue, sp.status, 2 + Math.floor(Math.random() * 2));
              addCombatMsg(`S ${ue.name} is ${sp.status}!`, "#a78bfa");
            }
          }
          addCombatMsg(`${sp.icon} ${spellName}! (${manaCost} MP)`, "#c4b5fd");
        }


        if (ue.status === "MARK" && action === "attack") { dmg = ue.hp; addCombatMsg(`x DEATH MARK!`, "#8b5cf6"); AUDIO.play("dark"); fx.flashScreen("#8b5cf6", 250); fx.burst("#8b5cf6", 32); }

        if (dmg > 0) {
          ue.hp = Math.max(0, ue.hp - dmg);
          addCombatMsg(`${isCrit ? "x CRIT! " : ""}${dmg} dmg   ${ue.name}`, isCrit ? "#fbbf24" : "#e2e8f0");
          if (isCrit) {
            up.crits = (up.crits || 0) + 1; progressQuests({ type: "crit" });
            AUDIO.play("crit");
            if (ue.isBoss || ue.hp <= 0) setTimeout(() => AUDIO.play("monster_roar"), 100);
            else setTimeout(() => AUDIO.play("monster_hurt"), 100);
            fx.shakeScreen(8);
            fx.flashScreen("#fbbf24", 140);
            fx.burst("#fbbf24", 22);
            fx.popText(`CRIT ${dmg}!`, "#fbbf24", { size: 30, y: 30 });
            fx.monsterHit();
          } else {
            AUDIO.play("hit");
            if (ue.isBoss || ue.hp <= 0) setTimeout(() => AUDIO.play("monster_roar"), 100);
            else setTimeout(() => AUDIO.play("monster_hurt"), 100);
            fx.popText(`-${dmg}`, "#fca5a5", { size: 22, y: 35 });
            fx.monsterHit();
          }
        }

        if (spellName === "Blood Thirst" && dmg > 0) {
          const h = Math.floor(dmg * 0.5); up.hp = Math.min(s.maxHp, up.hp + h);
          addCombatMsg(`x +${h} HP`, "#4ade80");
        }
        if (spellName === "Soul Drain" && dmg > 0) {
          const m = Math.floor(dmg * 0.5); up.mana = Math.min(s.maxMana, up.mana + m);
          addCombatMsg(`x +${m} MP`, "#a78bfa");
        }
        if (up.cls === "BERSERKER" && dmg > 0) up.berserkerStacks = Math.min(5, (up.berserkerStacks || 0) + 1);


        if (ue.status && STATUS_EFFECTS[ue.status]?.kind === "dot") {
          const dot = Math.max(3, Math.floor((ue.maxHp || 100) * STATUS_EFFECTS[ue.status].dmgPct));
          ue.hp = Math.max(0, ue.hp - dot);
          addCombatMsg(`x ${dot} ${ue.status} dmg`, "#fb923c");
        }
        if (ue.statusTurns !== undefined) {
          ue.statusTurns = Math.max(0, (ue.statusTurns || 0) - 1);
          if (ue.statusTurns === 0) ue.status = null;
        }

        if (up.buffTurns > 0) up.buffTurns--;
        if (up.defBuffTurns > 0) up.defBuffTurns--;
        if (up.lichTurns > 0) up.lichTurns--;

        if (up.cls === "NECROMANCER" && ue.hp <= 0) {
          up.mana = Math.min(s.maxMana, up.mana + 30);
          addCombatMsg(`x Soul Harvest: +30 MP`, "#8b5cf6");
        }

        setAnimating(false);

        if (ue.hp <= 0) {
          addCombatMsg(`a  ${ue.name} defeated!`, "#4ade80");
          setEnemies(prev => prev.filter(e => e.uid !== combatEnemy.uid));

          const dData = DIFFICULTIES[currentDifficulty] || DIFFICULTIES.EASY;
          const sessionKey = (currentDungeon?.id || "unknown") + "_" + currentDifficulty;
          const sessionClears = sessionStats[sessionKey] || 1;
          const decayMult = Math.max(0.5, 1.1 - (sessionClears * 0.1)); // 100% -> 90% -> ... -> 50%
          
          const finalExp = Math.floor(ue.exp * decayMult);
          const finalGold = Math.floor(ue.gold * decayMult);

          addMsg(`S& Defeated ${ue.icon} ${ue.name}: +${finalExp} EXP, +${finalGold} gold ${decayMult < 1 ? `(Decay: ${Math.floor(decayMult*100)}%)` : ""}, "#4ade80");
          AUDIO.play(ue.isBoss ? "bossdown" : "victory");
          fx.burst(ue.isBoss ? "#fbbf24" : "#4ade80", ue.isBoss ? 50 : 28);
          if (ue.isBoss) { fx.flashScreen("#fbbf24", 500); fx.shakeScreen(12); }
          fx.popText(`+${finalExp} EXP`, "#4ade80", { size: 20, y: 55 });
          fx.popText(`+${finalGold}g`, "#fbbf24", { size: 18, y: 75 });
          up.gold += finalGold; up.kills++;
          if (ue.isBoss) up.bossKills++;
          up.exp += finalExp;



          progressQuests({ type: ue.isBoss ? "boss" : "kill", enemyId: ue.id });


          setMeta(m => recordBestiary(m, ue.id));


          if (up.cls === "BERSERKER") up.berserkerStacks = Math.min(5, (up.berserkerStacks || 0) + 1);


          const prevLevel = up.level;
          up = levelUp(up);
          if (up.level > prevLevel) {
            addMsg(`  LEVEL UP! Now Lv.${up.level}!`, "#fbbf24");
            AUDIO.play("levelup");
            fx.flashScreen("#fbbf24", 600);
            fx.burst("#fbbf24", 60);
            fx.burst("#a855f7", 40);
            fx.popText(`LEVEL ${up.level}!`, "#fbbf24", { size: 34, y: 40 });
          }


          const drops = ue.isBoss ? 4 : (Math.random() < 0.7 ? 1 : (Math.random() < 0.4 ? 2 : 0));
          if (drops > 0) {
            const loot = generateDungeonLoot(currentDungeon?.tier || 1, floor, drops, hardcore, currentDifficulty);
            if (Math.random() < 0.3) loot.push(...generateMaterials(floor, 1));
            loot.forEach(d => addMsg(`x} Loot: ${d.icon} ${d.name} [${RARITY[d.rarity]?.name}]${d.upgradeLevel > 0 ? ` +${d.upgradeLevel}` : ""}${d.isVariant  ? " ~" : ""}`, RARITY[d.rarity]?.color));
            up.inventory = [...up.inventory, ...loot];
            loot.forEach(d => setMeta(m => recordItemSeen(m, d.id)));

            if (ue.isBoss) {
              fx.popText("EPIC LOOT!", "#a855f7", { size: 28, y: 30 });
              fx.burst("#a855f7", 30);
            }
          }

          const biome = mapData?.biome;
          if (biome === "CATHEDRAL") setReputation(r => gainRep(r, "CELESTIAL_HOST", 5));
          if (biome === "NECROPOLIS") setReputation(r => gainRep(r, "BONEMARROW", 5));
          if (biome === "VOLCANO")   setReputation(r => gainRep(r, "EMBER_CONCLAVE", 5));
          if (biome === "FROZEN")    setReputation(r => gainRep(r, "FROSTWARD", 5));
          if (biome === "ABYSS")     setReputation(r => gainRep(r, "ABYSSAL_CULT", 5));

          setPlayer(up);
          setCombatEnemy(null);
          setScreen("game");
        } else {
          setPlayer(up);
          setCombatEnemy(ue);
          setEnemies(prev => prev.map(e => e.uid === combatEnemy.uid ? ue : e));
          enemyTurnLogic(up, ue);
        }
      } else if (action === "flee") {
        const chance = (up.cls === "ROGUE" || up.cls === "RANGER") ? 70 : 40;
        if (Math.random() * 100 < chance) {
          addCombatMsg("x Escaped!", "#22c55e");
          AUDIO.play("flee");
          fx.popText("ESCAPED", "#22c55e", { size: 24 });
          setAnimating(false); setCombatEnemy(null); setScreen("game");
          return;
        }
        addCombatMsg("R Couldn't escape!", "#ef4444");
        AUDIO.play("miss");
        setAnimating(false);
        enemyTurnLogic(up, ue);
      }
    }, 250);
  }, [playerTurn, animating, combatEnemy, player, addCombatMsg, addMsg, floor, enemyTurnLogic, progressQuests, mapData, house, fx]);

  const useItemInCombat = useCallback((item) => {
    if (!item || !player) return;
    let up = { ...player };
    const s = calcPlayerStats(player, house);
    if (item.heal) {
      up.hp = Math.min(s.maxHp, up.hp + item.heal);
      addCombatMsg(`x +${item.heal} HP`, "#4ade80");
      AUDIO.play("heal");
      fx.burst("#4ade80", 16);
      fx.popText(`+${item.heal}`, "#4ade80", { size: 22, y: 60 });
    }
    if (item.mana) {
      up.mana = Math.min(s.maxMana, up.mana + item.mana);
      addCombatMsg(`x +${item.mana} MP`, "#60a5fa");
      AUDIO.play("spell");
      fx.burst("#60a5fa", 14);
      fx.popText(`+${item.mana} MP`, "#60a5fa", { size: 20, y: 65 });
    }
    if (item.slot === "scroll" && item.spell && !up.spells.includes(item.spell)) {
      up.spells = [...up.spells, item.spell];
      addCombatMsg(`x S Learned ${item.spell}!`, "#a78bfa");
      AUDIO.play("levelup");
      fx.burst("#a78bfa", 26);
      fx.popText(`LEARNED ${item.spell}`, "#a78bfa", { size: 20 });
      if (item.isPermanent) {
        AUDIO.play("holy");
        fx.flashScreen("#ef4444", 600);
        fx.burst("#ef4444", 50);
      }
    }
    up.inventory = up.inventory.filter(i => i.uid !== item.uid);
    setPlayer(up);
    enemyTurnLogic(up, combatEnemy);
  }, [player, combatEnemy, enemyTurnLogic, addCombatMsg, house, fx]);




  const canClassEquip = (cls, item) => {
    if (item.slot === "weapon") {
      const n = (item.id + " " + item.name).toLowerCase();
      const map = {
        WARRIOR: ["sword", "axe", "mace", "hammer", "spear", "halberd", "shield", "blade", "club", "stick", "pitchfork", "flail"],
        PALADIN: ["sword", "mace", "hammer", "spear", "shield", "blade", "club", "flail"],
        BERSERKER: ["axe", "mace", "hammer", "cleaver", "scythe", "club", "flail"],
        MAGE: ["staff", "wand", "crystal", "orb", "stick"],
        SORCERER: ["staff", "wand", "orb", "stick"],
        NECROMANCER: ["staff", "scythe", "wand", "bone", "stick", "dagger"],
        ROGUE: ["dagger", "rapier", "scimitar", "knife", "blade", "whip", "sling", "stick"],
        RANGER: ["bow", "crossbow", "sling", "trap", "hatchet", "knife", "stick"]
      };
      const allowed = map[cls] || [];
      const allKeywords = Object.values(map).flat();
      const isKnown = allKeywords.some(kw => n.includes(kw));
      if (isKnown && !allowed.some(kw => n.includes(kw))) return { can: false, reason: "weapon" };
    }

    if (item.armorType) {
      const allowed = CLASSES[cls]?.allowedArmor || ["LIGHT"];
      if (!allowed.includes(item.armorType)) return { can: false, reason: "armor", type: item.armorType };
    }

    return { can: true };
  };

  const equipItem = useCallback((item) => {
    if (!player || !item.slot || ["consumable","scroll","misc","material","gem","catalyst"].includes(item.slot)) return;
    const check = canClassEquip(player.cls, item);
    if (!check.can) {
      if (check.reason === "weapon") {
        addMsg(`R ${CLASSES[player.cls]?.name}s cannot equip this weapon type!`, "#ef4444");
      } else {
        addMsg(`R ${CLASSES[player.cls]?.name}s cannot wear ${check.type} armor!`, "#ef4444");
      }
      fx.shakeScreen(4);
      AUDIO.play("miss");
      return;
    }
    setPlayer(prev => {
      const eq = { ...prev.equipment, [item.slot]: item };
      const inv = prev.inventory.filter(i => i.uid !== item.uid);
      const old = prev.equipment[item.slot];
      if (old) inv.push(old);
      addMsg(`S& Equipped ${item.icon} ${item.name}`, RARITY[item.rarity]?.color);
      return { ...prev, equipment: eq, inventory: inv };
    });
  }, [player, addMsg]);

  const unequipItem = useCallback((slot) => {
    if (!player) return;
    setPlayer(prev => {
      const old = prev.equipment[slot];
      if (!old) return prev;
      addMsg(`x   Unequipped ${old.name}`, "#9ca3af");
      return { ...prev, equipment: { ...prev.equipment, [slot]: null }, inventory: [...prev.inventory, old] };
    });
  }, [player, addMsg]);

  const buyItem = useCallback((item) => {
    if (!player || player.gold < item.val) { addMsg("R Not enough gold!", "#ef4444"); return; }
    setPlayer(prev => ({ ...prev, gold: prev.gold - item.val, inventory: [...prev.inventory, { ...item, uid: `shop_${Date.now()}` }] }));
    addMsg(`x: Bought ${item.icon} ${item.name} for ${item.val}g`, RARITY[item.rarity]?.color);
    setShopItems(prev => prev.filter(i => i.uid !== item.uid));
  }, [player, addMsg]);

  const sellItem = useCallback((item) => {
    if (!player) return;
    const v = Math.floor(item.val * 0.4);
    setPlayer(prev => ({ ...prev, gold: prev.gold + v, inventory: prev.inventory.filter(i => i.uid !== item.uid) }));
    addMsg(`x Sold ${item.name} for ${v}g`, "#fbbf24");
  }, [player, addMsg]);

  const dropItem = useCallback((item) => {
    if (!player) return;
    setPlayer(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.uid !== item.uid) }));
    addMsg(`x Dropped ${item.name}`, "#9ca3af");
  }, [player, addMsg]);

  const handleWeaponUpgrade = useCallback((item) => {
    if (!player) return;
    if (item.slot !== "weapon") return;
    
    const cost = upgradeWeaponCost(item);
    const maxLvl = maxUpgradeLevel(item.rarity);
    if ((item.upgradeLevel || 0) >= maxLvl) {
      addMsg(`R Weapon is already at max level (+${maxLvl})`, "#ef4444");
      return;
    }
    if (player.gold < cost) {
      addMsg(`R Need ${cost}g to upgrade!`, "#ef4444");
      return;
    }

    setPlayer(prev => {
      const upg = applyWeaponUpgrade(item);
      const isEquipped = prev.equipment.weapon?.uid === item.uid;
      const newState = { ...prev, gold: prev.gold - cost };
      
      if (isEquipped) {
        newState.equipment = { ...prev.equipment, weapon: upg };
      } else {
        newState.inventory = prev.inventory.map(i => i.uid === item.uid ? upg : i);
      }
      return newState;
    });
    
    AUDIO.play("forge");
    fx.burst("#f59e0b", 25);
    fx.popText("UPGRADED!", "#f59e0b", { size: 24 });
    addMsg(`x  Upgraded ${item.name} to +${(item.upgradeLevel || 0) + 1}!`, "#f59e0b");
  }, [player, addMsg, fx]);

  const useItem = useCallback((item) => {
    if (!player) return;
    const s = calcPlayerStats(player, house);
    if (item.isPermanent && item.spell) {
      if (player.spells.includes(item.spell)) {
        addMsg(`R You already know ${item.spell}!`, "#ef4444");
        return;
      }
      setPlayer(prev => ({
        ...prev,
        spells: [...prev.spells, item.spell],
        inventory: prev.inventory.filter(it => it.uid !== item.uid)
      }));
      addMsg(`S UNLOCKED PERMANENT SPELL: ${item.spell}!`, "#ef4444");
      AUDIO.play("holy");
      fx.flashScreen("#ef4444", 600);
      fx.burst("#ef4444", 60);
      fx.popText(`PERMANENT UNLOCK: ${item.spell}`, "#ef4444", { size: 30, y: 50 });
      return;
      return;
    }
    if (item.slot === "consumable") {
      setPlayer(prev => ({ ...prev,
        hp: Math.min(s.maxHp, prev.hp + (item.heal || 0)),
        mana: Math.min(s.maxMana, prev.mana + (item.mana || 0)),
        inventory: prev.inventory.filter(i => i.uid !== item.uid),
      }));
      addMsg(`x Used ${item.name}!`, "#4ade80");
    } else if (item.slot === "scroll" && item.spell) {
      setPlayer(prev => {
        if (prev.spells.includes(item.spell)) { addMsg("Already known", "#9ca3af"); return prev; }
        addMsg(`x S Learned ${item.spell}! (Single Use)`, "#a78bfa");
        return { ...prev, spells: [...prev.spells, item.spell], inventory: prev.inventory.filter(i => i.uid !== item.uid) };
      });
    }
  }, [player, house, addMsg]);

  const craftItem = useCallback((recipe) => {
    if (!player) return;

    const inv = [...player.inventory];
    const needed = recipe.mats || {};
    const have = {};
    inv.forEach(it => { have[it.id] = (have[it.id] || 0) + 1; });
    for (const [m, n] of Object.entries(needed)) {
      if ((have[m] || 0) < n) { addMsg(`R Need ${n}  ${m}`, "#ef4444"); return; }
    }
    if (player.gold < (recipe.gold || 0)) { addMsg("R Not enough gold", "#ef4444"); return; }

    for (const [m, n] of Object.entries(needed)) {
      let toRemove = n;
      for (let i = inv.length - 1; i >= 0 && toRemove > 0; i--) {
        if (inv[i].id === m) { inv.splice(i, 1); toRemove--; }
      }
    }
    const produced = itemById(recipe.produces);
    if (produced) {
      inv.push({ ...produced, uid: `craft_${Date.now()}` });
      addMsg(`x  Crafted ${produced.icon} ${produced.name}!`, RARITY[produced.rarity]?.color);
    }
    setPlayer(prev => ({ ...prev, gold: prev.gold - (recipe.gold || 0), inventory: inv }));
  }, [player, addMsg]);

  const unlockSkill = useCallback((nodeId) => {
    if (!player || player.unspentSkill <= 0) return;
    if (player.unlockedSkills.includes(nodeId)) return;

    const tree = SKILL_TREES[player.cls] || [];
    const node = tree.find(n => n.id === nodeId);
    if (!node) return;
    const unlocked = player.unlockedSkills;

    if (node.tier > 1) {
      const hasLower = tree.filter(n => n.tier === node.tier - 1).some(n => unlocked.includes(n.id));
      if (!hasLower) { addMsg("x  Need prior tier node first", "#ef4444"); return; }
    }
    setPlayer(prev => {
      const p = { ...prev, unlockedSkills: [...prev.unlockedSkills, nodeId], unspentSkill: prev.unspentSkill - 1 };
      if (node.grants?.spell && !p.spells.includes(node.grants.spell)) p.spells = [...p.spells, node.grants.spell];
      return p;
    });
    addMsg(`xRx Unlocked: ${node.name}`, "#a78bfa");
  }, [player, addMsg]);

  const buyHouseUpgrade = useCallback((id) => {
    if (!player) return;
    if (!canBuy(house, id, player.gold)) { addMsg("R Can't buy that yet", "#ef4444"); return; }
    const u = HOUSING_UPGRADES.find(h => h.id === id);
    setPlayer(prev => ({ ...prev, gold: prev.gold - u.cost }));
    setHouse(prev => ({ ...prev, upgrades: [...prev.upgrades, id], level: Math.max(prev.level, u.level) }));
    addMsg(`x Built: ${u.name}`, "#22c55e");
  }, [player, house, addMsg]);

  const pickSubclass = useCallback((sub) => {
    if (!player || player.level < SUBCLASS_UNLOCK_LEVEL) return;
    if (player.subclass) return;
    setPlayer(prev => {
      const spells = getClassSpells(prev.cls, sub);
      return { ...prev, subclass: sub, spells: [...new Set([...(prev.spells || []), ...spells])] };
    });
    addMsg(`xRx Subclass chosen: ${CLASSES[player.cls]?.subclasses?.[sub]?.name}`, "#a78bfa");
  }, [player, addMsg]);


  useEffect(() => {
    if (!player) return;
    const statsBag = {
      kills: player.kills || 0, bossKills: player.bossKills || 0,
      floor, level: player.level, gold: player.gold, items: (player.inventory || []).length,
      deaths: meta.totalDeaths || 0, crits: player.crits || 0, runs: meta.totalRuns || 0,
      mythicFound: Object.values(meta.itemsSeen || {}).filter((_, i) => (Object.keys(meta.itemsSeen || {})[i]||").includes("_mythic")).length,
      setsComplete: 0, spellsKnown: (player.spells || []).length,
      petsTamed: player.pet ? 1 : 0, recipesLearned: RECIPES.length,
      questsDone: quests.filter(q => q.complete).length,
      biomesSeen: biomesSeen.size,
    };
    const { newly, next } = checkAchievements(statsBag, achievements);
    if (newly.length > 0) {
      newly.forEach(a => addMsg(`x  Achievement: ${a.name}!`, "#fde047"));
      setAchievements(next);
    }
  }, [player, floor, quests, biomesSeen, achievements, meta, addMsg]);




  const renderHud = () => player && (
    <div style={{ flex: "0 0 auto", padding: "6px 12px", background: "#0d0d1a", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{CLASSES[player.cls]?.icon}</span>
        <div>
          <div style={{ color: CLASSES[player.cls]?.color, fontSize: 12, fontWeight: "bold" }}>
            {player.name} <span style={{ color: "#6b7280", fontSize: 11 }}>Lv.{player.level}</span>
            {player.subclass && <span style={{ color: "#a78bfa", fontSize: 10, marginLeft: 4 }}>({CLASSES[player.cls]?.subclasses?.[player.subclass]?.name})</span>}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <HpBar value={player.hp} max={stats?.maxHp || 1} />
            <MpBar value={player.mana} max={stats?.maxMana || 1} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#a78bfa" }}>x F{floor}</span>
        <span style={{ color: "#fbbf24" }}>x{player.gold}g</span>
        <span style={{ color: "#9ca3af" }}>a {stats?.totalAtk || 0} x:{stats?.totalDef || 0}</span>
        <span style={{ color: BIOMES[mapData?.biome]?.accent || "#9ca3af" }}>{BIOMES[mapData?.biome]?.icon} {BIOMES[mapData?.biome]?.name}</span>
        <span style={{ color: "#60a5fa" }}>{WEATHER[mapData?.weather]?.icon}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 60, height: 4, background: "#1a2a1a", borderRadius: 2 }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#22c55e", width: `${expPct}%` }} />
          </div>
          <span style={{ fontSize: 9, color: "#6b7280" }}>EXP</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <button style={S.hudBtn} onClick={() => { AUDIO.play("click"); setScreen("inventory"); }}>x} I</button>
        <button style={S.hudBtn} onClick={() => { AUDIO.play("click"); setScreen("menu"); }}> Menu</button>
        <button style={{ ...S.hudBtn, color: muted ? "#6b7280" : "#60a5fa" }} onClick={() => { const m = !muted; setMuted(m); AUDIO.muted = m; if (!m) AUDIO.play("click"); }} title={muted ? "Unmute" : "Mute" }>{muted ? "x !" : "x `" }</button>
      </div>
    </div>
  );




  if (!audioReady) {
    return (
      <div style={{ ...S.root, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundImage: "radial-gradient(circle at center, #1a0a2e 0%, #000 100%)" }}
           onClick={() => { AUDIO.init(); AUDIO.resume(); AUDIO.startMusic("title"); setAudioReady(true); }}>
        <h1 style={{ color: "#a855f7", fontFamily: "'Cinzel', serif", fontSize: "3vw", letterSpacing: 6, animation: "doe-pulse 2s infinite", textAlign: "center" }}>CLICK ANYWHERE TO START</h1>
        <p style={{ color: "#6b7280", marginTop: 24, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Initializes audio engine</p>
      </div>
    );
  }


  if (screen === "title") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "radial-gradient(ellipse at center, #1a0a2e 0%, #0d0d0d 70%)" }}>
        <div style={S.titleBg} />
        <div style={S.titleContent}>
          <div style={{ fontSize: 80, marginBottom: 8, filter: "drop-shadow(0 0 30px #a855f7)" }}>a </div>
          <h1 style={S.titleH1}>DUNGEON OF ETERNITY</h1>
          <p style={S.titleSub}>EXPANDED EDITION</p>
          <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 13, textAlign: "center" }}>
            8 classes  3 subclasses  500+ items  50+ enemies<br/>
            16 biomes  8 factions  15 pets  Crafting  Skill trees<br/>
            Achievements  Housing  Quests  Endless floors
          </p>
          <div>
            <button style={S.bigBtn} onClick={() => setScreen("charselect")}>a  NEW GAME</button>
            <button style={{ ...S.bigBtn, background: "linear-gradient(135deg, #374151, #1f2937)" }} onClick={() => setScreen("loadgame")}>x  LOAD GAME</button>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button style={S.smallBtn} onClick={() => setScreen("leaderboards")}>x  Leaderboards</button>
            <button style={S.smallBtn} onClick={() => setScreen("bestiary")}>x  Bestiary</button>
            <button style={S.smallBtn} onClick={() => setScreen("collectionlog")}>x a Collection</button>
          </div>
          <p style={{ marginTop: 20, color: "#6b7280", fontSize: 11 }}>
            Best floor: {meta.highestFloor || 0}  Runs: {meta.totalRuns || 0}  NG+: {meta.ngPlus || 0}
          </p>
        </div>
      </div>
    </div>
  );




  if (screen === "charselect") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", overflowY: "auto", padding: "20px 10px" }}>
        <h2 style={{ textAlign: "center", color: "#e2e8f0", fontFamily: "serif", fontSize: 28, marginBottom: 4 }}>a  Choose Your Class</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 20, fontSize: 13 }}>Your destiny awaits below.</p>
        <div style={S.classGrid}>
          {Object.entries(CLASSES).map(([key, cd]) => {
            const mb = masteryBonuses(meta, key);
            const runs = meta.classMastery?.[key] || 0;
            return (
              <div key={key} style={{ ...S.classCard,
                border: playerClass === key ? `2px solid ${cd.color}` : "2px solid #2d2d3d",
                boxShadow: playerClass === key ? `0 0 20px ${cd.color}66` : "none" }}
                onClick={() => setPlayerClass(key)}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>{cd.icon}</div>
                <div style={{ color: cd.color, fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>{cd.name}</div>
                <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 8, lineHeight: 1.4, textAlign: "center" }}>{cd.desc}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 6 }}>
                  {[["HP",cd.stats.hp,"#ef4444"],["MP",cd.stats.mana,"#3b82f6"],["ATK",cd.stats.atk,"#f59e0b"],["DEF",cd.stats.def,"#22c55e"]].map(([l,v,c]) => (
                    <div key={l} style={{ background:"#1a1a2e", borderRadius:4, padding:"2px 6px", fontSize:10 }}>
                      <span style={{ color:"#6b7280" }}>{l}:</span><span style={{ color:c, marginLeft:2 }}>{v}</span>
                    </div>
                  ))}
                </div>
                {runs > 0 && <div style={{ fontSize: 10, color: "#22c55e", marginBottom: 4 }}>
                  x  {runs} runs  +{mb.atk}A +{mb.def}D +{mb.hp}HP
                </div>}
                <div style={{ fontSize: 10, color: "#a78bfa", textAlign: "center" }}>
                  Subclasses (lv {SUBCLASS_UNLOCK_LEVEL}): {Object.values(cd.subclasses || {}).map(s => s.name).join("  ")}
                </div>
                <div style={{ fontSize: 10, color: "#60a5fa", textAlign: "center", marginTop: 4 }}>
                  Armor: {cd.allowedArmor?.join(",  ") || "LIGHT" }
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ display: "inline-flex", gap: 12, alignItems: "center", background: "#1a1a2e", padding: "10px 20px", borderRadius: 8, flexWrap: "wrap" }}>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Name:</span>
            <input style={S.nameInput} value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Hero" maxLength={16} />
            <label style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
              <input type="checkbox" checked={hardcore} onChange={e => setHardcore(e.target.checked)} /> Hardcore
            </label>
            {meta.totalRuns > 0 && (
              <label style={{ fontSize: 12, color: "#a78bfa", display: "flex", alignItems: "center", gap: 4 }}>
                NG+: <input type="number" min={0} max={meta.ngPlus || 0} value={ngPlus} onChange={e => setNgPlus(Math.min(meta.ngPlus || 0, Math.max(0, parseInt(e.target.value) || 0)))} style={{ ...S.nameInput, width: 50 }} />
              </label>
            )}
            <button style={{ ...S.bigBtn, padding: "8px 24px", opacity: playerClass ? 1 : 0.4 }} disabled={!playerClass} onClick={startGame}>
               PROCEED TO WORLD MAP
            </button>
            <button style={S.smallBtn} onClick={() => setScreen("title")}>  Back</button>
          </div>
        </div>
      </div>
    </div>
  );




  if (screen === "dungeon_select" && player) {
    return (
      <div style={S.root}>
        <div style={{ ...S.screen, background: "#0a0a14", padding: "30px 40px", overflowY: "auto", backgroundImage: "radial-gradient(circle at top, #1a1a3a 0%, #05050a 80%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, borderBottom: "1px solid #2d2d4d", paddingBottom: 16 }}>
            <div>
              <h2 style={{ color: "#e2e8f0", fontFamily: "'Cinzel', serif", fontSize: 32, textShadow: "0 2px 10px #000", margin: 0 }}>World Map</h2>
              <p style={{ color: "#9ca3af", margin: "4px 0 0 0", fontSize: 13, textTransform: "uppercase", letterSpacing: 2 }}>Select your destination</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fbbf24", fontWeight: "bold", fontSize: 14 }}>{player.name}</div>
                <div style={{ color: "#a78bfa", fontSize: 11 }}>Level {player.level} {CLASSES[player.cls]?.name}</div>
              </div>
              <button style={{ ...S.smallBtn, background: "#1a1a2e" }} onClick={() => setScreen("gameover")}>Exit Run</button>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {DUNGEONS.map((d, i) => {
              const brackets = getDungeonDifficultyBrackets(d);
              const lockedDungeon = player.level < d.requiredLevel;
              
              return (
                <div key={d.id} className="doe-card-in" style={{ ...S.dungeonCard(d.colors.accent), animationDelay: `${i * 0.05}s`, opacity: lockedDungeon ? 0.6 : 1, filter: lockedDungeon ? "grayscale(80%)" : "none" }}>
                  <div style={{ position: "absolute", inset: 0, background: d.colors.bg, zIndex: -1, opacity: 0.5 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 38, filter: `drop-shadow(0 0 10px ${d.colors.glow})` }}>{d.icon}</div>
                    <div style={{ background: lockedDungeon ? "#ef444433" : "#22c55e33", color: lockedDungeon ? "#ef4444" : "#22c55e", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: "bold", border: `1px solid ${lockedDungeon ? '#ef444466' : '#22c55e66'}` }}>
                      {lockedDungeon ? `x  LVL ${d.requiredLevel}` : `Tier ${d.tier}`}
                    </div>
                  </div>
                  <h3 style={{ color: d.colors.accent, fontFamily: "'Cinzel', serif", fontSize: 20, margin: "0 0 4px 0", textShadow: "0 2px 4px #000" }}>{d.name}</h3>
                  <p style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.4, margin: "0 0 16px 0" }}>{d.desc}</p>
                  
                  {!lockedDungeon && (
                    <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: 8, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Select Difficulty</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {brackets.map(b => {
                          const isDiffLocked = player.level < b.requiredLevel;
                          const isSelected = selectedDifficulty === b.key;
                          return (
                            <button key={b.key} disabled={isDiffLocked} 
                              onClick={() => setSelectedDifficulty(b.key)}
                              style={{ 
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "6px 10px", borderRadius: 4, border: isSelected ? `1px solid ${b.color}` : "1px solid #2d2d4d",
                                background: isSelected ? `${b.color}22` : isDiffLocked ? "#1a1a1a" : "#252535",
                                cursor: isDiffLocked ? "not-allowed" : "pointer",
                                opacity: isDiffLocked ? 0.4 : 1,
                                transition: "all 0.2s" }}>
                              <span style={{ fontSize: 11, color: isSelected ? b.color : "#e2e8f0" }}>{b.icon} {b.name}</span>
                              <span style={{ fontSize: 10, color: isDiffLocked ? "#ef4444" : "#6b7280" }}>
                                {isDiffLocked ? `Lv ${b.requiredLevel}` : `x${b.statMult} Stats`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ffffff15", paddingTop: 12 }}>
                    <div style={{ color: "#6b7280", fontSize: 10 }}>{d.maxFloors} Floors</div>
                    {!lockedDungeon && (
                      <button style={{ 
                        background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", 
                        border: "none", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: "bold", 
                        cursor: "pointer", boxShadow: "0 2px 10px rgba(34, 197, 94, 0.3)" }} onClick={() => startDungeon(d, selectedDifficulty)}>
                        ENTER DUNGEON ~
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }





  if (screen === "loadgame") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22, marginBottom: 8 }}>x  Load Game</h2>
        <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 16 }}>Select a save slot.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
          {listCharacters().map(({ slot, save }) => (
            <div key={slot} style={{ background: "#1a1a2e", padding: 12, borderRadius: 6, border: "1px solid #2d2d3d" }}>
              <div style={{ color: "#a78bfa", fontSize: 12, marginBottom: 4 }}>Slot {slot}</div>
              {save ? (
                <>
                  <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: "bold" }}>{save.player?.name}   Lv.{save.player?.level}</div>
                  <div style={{ color: "#9ca3af", fontSize: 11 }}>{CLASSES[save.player?.cls]?.icon} {CLASSES[save.player?.cls]?.name}  F{save.floor}</div>
                  <div style={{ color: "#6b7280", fontSize: 10, marginBottom: 6 }}>Saved: {new Date(save.savedAt).toLocaleString()}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={S.smallBtn} onClick={() => {
                      setPlayer(save.player); setFloor(save.floor); setMapData(save.mapData); setEnemies(save.enemies || []);
                      setQuests(save.quests || []); setScreen("game");
                    }}>Load</button>
                    <button style={{ ...S.smallBtn, color: "#ef4444" }} onClick={() => { deleteCharacter(slot); setScreen("title"); setTimeout(() => setScreen("loadgame"), 0); }}>Delete</button>
                  </div>
                </>
              ) : <div style={{ color: "#4b5563", fontSize: 12 }}>Empty</div>}
            </div>
          ))}
        </div>
        <button style={{ ...S.smallBtn, marginTop: 12 }} onClick={() => setScreen("title")}>  Back</button>
      </div>
    </div>
  );




  if (screen === "gameover") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>x</div>
        <h1 style={{ color: "#ef4444", fontFamily: "serif", fontSize: 36, marginBottom: 8 }}>YOU HAVE FALLEN</h1>
        <p style={{ color: "#9ca3af", marginBottom: 4 }}>Floor {floor}  Level {player?.level}  {player?.kills} kills</p>
        <p style={{ color: "#9ca3af", marginBottom: 32 }}>Cause of death: {combatEnemy?.name || "unknown" }</p>
        {hardcore && <p style={{ color: "#dc2626", marginBottom: 8 }}>HARDCORE   character permanently deleted</p>}
        <button style={S.bigBtn} onClick={() => { setPlayer(null); setFloor(1); setScreen("title"); }}>  RETURN TO TITLE</button>
      </div>
    </div>
  );




  if (screen === "game" && mapData && player) {
    return (
      <div style={S.root}>
        <div className={fx.shake ? "doe-shake" : ""} style={{ ...S.screen, display: "flex", flexDirection: "column", background: BIOMES[mapData.biome]?.wall || "#0a0a10", overflow: "hidden", position: "relative" }}>
          <FXOverlay floats={fx.floats} particles={fx.particles} flash={fx.flash} />
          {renderHud()}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <MapView mapData={mapData} enemies={enemies} player={player} movePlayer={movePlayer} />
            <SidebarLog messages={messages} logRef={logRef} movePlayer={movePlayer} openScreen={setScreen} />
          </div>
        </div>
      </div>
    );
  }




  if (screen === "combat" && combatEnemy && player) {
    const enemyHpPct = combatEnemy.hp / combatEnemy.maxHp * 100;
    const potions = player.inventory.filter(i => i.slot === "consumable");
    const scrolls = player.inventory.filter(i => i.slot === "scroll");
    return (
      <div style={S.root}>
        <div className={fx.shake ? "doe-shake" : ""} style={{ ...S.screen, background: "radial-gradient(ellipse at center, #1a0a0a 0%, #0d0505 70%)", display: "flex", flexDirection: "column", position: "relative" }}>
          <FXOverlay floats={fx.floats} particles={fx.particles} flash={fx.flash} />
          <div style={{ flex: "0 0 auto", padding: "14px 20px", borderBottom: "1px solid #2d1a1a" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
              <div className={fx.monsterHitAnim ? "doe-monster-hit" : ""} style={{ fontSize: 44, filter: combatEnemy.hp < combatEnemy.maxHp * 0.3 ? "drop-shadow(0 0 8px #ef4444)" : "none", transition: "transform 0.1s"" }}>
                {combatEnemy.icon}
              </div>
              <div style={{ flex: 1, paddingLeft: 6 }}>
                <div style={{ color: combatEnemy.isBoss ? "#fbbf24" : "#ef4444", fontFamily: "serif", fontSize: 20, fontWeight: "bold" }}>
                  {combatEnemy.isBoss ? "& BOSS & " : "" }{combatEnemy.name}
                  {combatEnemy.status && <span style={{ fontSize: 11, background: "#1a1a2e", borderRadius: 3, padding: "1px 6px", marginLeft: 6, color: STATUS_EFFECTS[combatEnemy.status]?.color }}>{combatEnemy.status}</span>}
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#9ca3af" }}>
                  <span>HP: {combatEnemy.hp}/{combatEnemy.maxHp}</span>
                  <span>ATK: {combatEnemy.atk}</span>
                  <span>DEF: {combatEnemy.def}</span>
                  <span>EXP: {combatEnemy.exp}</span>
                </div>
                <div style={{ background: "#2d1a1a", borderRadius: 4, height: 10, marginTop: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: enemyHpPct > 50 ? "#22c55e" : enemyHpPct > 25 ? "#f59e0b" : "#ef4444", width: `${enemyHpPct}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
          </div>

          <div ref={combatLogRef} style={{ flex: "1 1 0", overflowY: "auto", padding: "8px 16px", minHeight: 0 }}>
            {combatLog.map(m => <div key={m.id} style={{ color: m.color, fontSize: 12, marginBottom: 2, lineHeight: 1.4 }}>{m.text}</div>)}
            {animating && <div style={{ color: "#6b7280", fontSize: 12 }}>...</div>}
          </div>

          <div style={{ flex: "0 0 auto", borderTop: "1px solid #2d1a1a", padding: "8px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: "bold" }}>{player.name} Lv.{player.level}</span>
              <span style={{ color: "#fbbf24", fontSize: 12 }}>x{player.gold}g</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <HpBar value={player.hp} max={stats?.maxHp || 1} big />
              <MpBar value={player.mana} max={stats?.maxMana || 1} big />
            </div>
          </div>

          <div style={{ flex: "0 0 auto", borderTop: "1px solid #2d1a1a", padding: "8px 12px", background: "#0d0a0a" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              <button style={{ ...S.combatBtn("#ef4444"), opacity: playerTurn && !animating ? 1 : 0.4 }} disabled={!playerTurn || animating} onClick={() => { AUDIO.play("click"); doPlayerAction("attack"); }}>a  Attack</button>
              <button style={{ ...S.combatBtn("#22c55e"), opacity: playerTurn && !animating ? 1 : 0.4 }} disabled={!playerTurn || animating} onClick={() => { AUDIO.play("click"); doPlayerAction("flee"); }}>x Flee</button>
              <button style={{ ...S.combatBtn(muted ? "#6b7280" : "#60a5fa"), marginLeft: "auto" }} onClick={() => { const m = !muted; setMuted(m); AUDIO.muted = m; if (!m) AUDIO.play("click"); }} title={muted ? "Unmute" : "Mute" }>{muted ? "x !" : "x `" }</button>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
              {player.spells.map(name => {
                const sp = SPELLS[name];
                if (!sp) return null;
                const can = player.mana >= sp.mana;
                return (
                  <button key={name} style={{ ...S.spellBtn, opacity: playerTurn && !animating && can ? 1 : 0.4, border: `1px solid ${can ? "#a78bfa" : "#4b5563" }` }}
                    disabled={!playerTurn || animating || !can} onClick={() => doPlayerAction("spell", name)} title={`${name}   ${sp.desc} (${sp.mana} MP)`}>
                    <span style={{ fontSize: 14 }}>{sp.icon}</span>
                    <span style={{ fontSize: 9, display: "block", color: "#c4b5fd" }}>{name}</span>
                    <span style={{ fontSize: 8, display: "block", color: "#6b7280" }}>{sp.mana}MP</span>
                  </button>
                );
              })}
            </div>
            {(potions.length > 0 || scrolls.length > 0) && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: "#6b7280", alignSelf: "center" }}>Items:</span>
                {[...potions.slice(0, 4), ...scrolls.slice(0, 2)].map(it => (
                  <button key={it.uid} style={{ ...S.spellBtn, border: "1px solid #2d3d2d" }} disabled={!playerTurn || animating} onClick={() => useItemInCombat(it)} title={it.name}>
                    <span style={{ fontSize: 14 }}>{it.icon}</span>
                    <span style={{ fontSize: 8, display: "block", color: "#9ca3af" }}>{it.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }




  if (screen === "inventory" && player) {
    return (
      <div style={S.root}>
        <div style={{ ...S.screen, background: "#0d0d15", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #2d2d3d" }}>
            <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>x} Inventory & Equipment</h2>
            <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
          </div>
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <div style={{ width: 220, borderRight: "1px solid #2d2d3d", padding: 12, overflowY: "auto" }}>
              <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 8 }}>EQUIPPED</p>
              {["weapon","armor","helmet","boots","ring","neck","cloak","glove","shield"].map(slot => {
                const eq = player.equipment[slot];
                return (
                  <div key={slot} style={{ ...S.eqSlot, border: eq ? `1px solid ${RARITY[eq.rarity]?.color || "#4b5563" }` : "1px solid #2d2d3d" }}>
                    <div style={{ fontSize: 20 }}>{eq ? eq.icon : " " }</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>{slot}</div>
                      {eq && <div style={{ fontSize: 11, color: RARITY[eq.rarity]?.color || "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eq.name}</div>}
                    </div>
                    {eq && <button style={S.smBtn("#f87171")} onClick={() => unequipItem(slot)}> </button>}
                  </div>
                );
              })}
              <div style={{ marginTop: 12, borderTop: "1px solid #2d2d3d", paddingTop: 8 }}>
                <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>STATS</p>
                {[["ATK",stats?.totalAtk,"#f59e0b"],["DEF",stats?.totalDef,"#22c55e"],["HP",`${player.hp}/${stats?.maxHp}`,"#ef4444"],["MP",`${player.mana}/${stats?.maxMana}`,"#3b82f6"],["Crit",`${stats?.crit||0}%`,"#fbbf24"]].map(([l,v,c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: "#6b7280" }}>{l}</span><span style={{ color: c }}>{v}</span>
                  </div>
                ))}
                {stats?.setLabels && stats.setLabels.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <p style={{ color: "#14b8a6", fontSize: 10, marginBottom: 2 }}>SET BONUSES</p>
                    {stats.setLabels.map((l, i) => <div key={i} style={{ color: "#14b8a6", fontSize: 10 }}>{l}</div>)}
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1, padding: 12, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {["WEAPON", "ARMOR", "SCROLL", "CONSUMABLE"].map(t => (
                  <button key={t} onClick={() => setInventoryTab(t)} style={{
                    ...S.tabBtn(inventoryTab === t), padding: "4px 12px", fontSize: 10
                  }}>{t}S</button>
                ))}
              </div>
              <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 8 }}>INVENTORY ({player.inventory.length}/80)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 6 }}>
                {player.inventory.filter(it => {
                  if (inventoryTab === "WEAPON") return it.slot === "weapon";
                  if (inventoryTab === "ARMOR") return ["armor", "helmet", "boots", "ring", "neck", "cloak", "glove", "shield"].includes(it.slot);
                  if (inventoryTab === "SCROLL") return it.slot === "scroll" || it.id?.includes("scroll");
                  return it.slot === "consumable" || it.slot === "material" || it.slot === "gem";
                }).map(item => (
                  <div key={item.uid} style={{ ...S.invItem, borderColor: (RARITY[item.rarity]?.color || "#2d2d3d") + "55", background: RARITY[item.rarity]?.glow || "#1a1a2e", opacity: canClassEquip(player.cls, item).can ? 1 : 0.6 }}>
                    <div style={{ fontSize: 22, marginBottom: 2 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, color: RARITY[item.rarity]?.color || "#e2e8f0", fontWeight: "bold", marginBottom: 2, textAlign: "center" }}>{item.name}</div>
                    <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 6, textAlign: "center" }}>{RARITY[item.rarity]?.name}</div>
                    {!canClassEquip(player.cls, item).can && <div style={{ fontSize: 8, color: "#ef4444", marginBottom: 4, fontWeight: "bold", textAlign: "center" }}>xa {CLASSES[player.cls]?.name.toUpperCase()} RESTRICTED</div>}
                    {item.isPermanent && <div style={{ fontSize: 8, color: "#ef4444", marginBottom: 4, fontWeight: "bold" }}>& PERMANENT UNLOCK &</div>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", marginBottom: 6 }}>
                      {item.armorType && <span style={S.statBadge(item.armorType === "HEAVY" ? "#ef4444" : item.armorType === "MEDIUM" ? "#f59e0b" : "#60a5fa")}>{item.armorType}</span>}
                      {item.atk > 0 && <span style={S.statBadge("#ef4444")}>+{item.atk}A</span>}
                      {item.def > 0 && <span style={S.statBadge("#22c55e")}>+{item.def}D</span>}
                      {item.hp > 0 && <span style={S.statBadge("#f59e0b")}>+{item.hp}HP</span>}
                      {item.mana > 0 && item.slot !== "consumable" && <span style={S.statBadge("#3b82f6")}>+{item.mana}MP</span>}
                      {item.heal > 0 && <span style={S.statBadge("#4ade80")}>Heal {item.heal}</span>}
                      {item.mana > 0 && item.slot === "consumable" && <span style={S.statBadge("#60a5fa")}>MP {item.mana}</span>}
                      {item.spell && <span style={S.statBadge("#a78bfa")}>x S {item.spell}</span>}
                      {item.upgradeLevel > 0 && <span style={S.statBadge("#f59e0b")}>+{item.upgradeLevel} x </span>}
                    </div>
                    {item.slot === "weapon" && (item.upgradeLevel || 0) < maxUpgradeLevel(item.rarity) && (
                      <button style={{ ...S.upgradeBtn, marginBottom: 6 }} onClick={() => handleWeaponUpgrade(item)}>
                        Upgrade (-{upgradeWeaponCost(item)}g)
                      </button>
                    )}
                    <div style={{ display: "flex", gap: 4 }}>
                      {(item.slot && !["consumable","scroll","misc","material","gem","catalyst"].includes(item.slot)) &&
                        <button style={S.smBtn("#22c55e")} onClick={() => equipItem(item)}>Equip</button>}
                      {(item.slot === "consumable" || item.slot === "scroll") &&
                        <button style={S.smBtn("#3b82f6")} onClick={() => useItem(item)}>Use</button>}
                      <button style={S.smBtn("#ef4444")} onClick={() => dropItem(item)}>Drop</button>
                    </div>
                  </div>
                ))}
                {player.inventory.length === 0 && <p style={{ color: "#4b5563", fontSize: 13, gridColumn: "1/-1" }}>Inventory is empty.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }




  if (screen === "shop" && player) return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #2d2d3d" }}>
          <h2 style={{ color: "#fbbf24", fontFamily: "serif", fontSize: 22 }}>x Dungeon Merchant</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#fbbf24", fontSize: 14 }}>x {player.gold}g</span>
            <button style={S.closeBtn} onClick={() => setScreen("game")}>Leave</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 12 }}>Refreshes each visit. Sell your loot for 40%.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8, marginBottom: 20 }}>
            {shopItems.map(it => (
              <div key={it.uid} style={{ ...S.invItem, borderColor: (RARITY[it.rarity]?.color || "#2d2d3d") + "55", background: RARITY[it.rarity]?.glow }}>
                <div style={{ fontSize: 24 }}>{it.icon}</div>
                <div style={{ fontSize: 11, color: RARITY[it.rarity]?.color, fontWeight: "bold", textAlign: "center" }}>{it.name}</div>
                <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 4 }}>[{RARITY[it.rarity]?.name}]</div>
                <div style={{ fontSize: 11, color: "#fbbf24", marginBottom: 6 }}>{it.val}g</div>
                <button style={{ ...S.smBtn("#fbbf24"), opacity: player.gold >= it.val ? 1 : 0.4 }} disabled={player.gold < it.val} onClick={() => buyItem(it)}>Buy</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #2d2d3d", paddingTop: 12 }}>
            <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>SELL (40%)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 6 }}>
              {player.inventory.map(it => (
                <div key={it.uid} style={{ ...S.invItem, cursor: "pointer" }} onClick={() => sellItem(it)}>
                  <div style={{ fontSize: 20 }}>{it.icon}</div>
                  <div style={{ fontSize: 10, color: RARITY[it.rarity]?.color, textAlign: "center" }}>{it.name}</div>
                  <div style={{ fontSize: 10, color: "#fbbf24" }}>Sell: {Math.floor(it.val * 0.4)}g</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );




  if (screen === "menu") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", overflowY: "auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 26 }}> Menu</h2>
          <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {[
            ["inventory","x}","Inventory","(I)"],
            ["quests","x S","Quests","(Q)"],
            ["skilltree","xR","Skill Tree","(K)"],
            ["crafting","x ","Crafting","(C)"],
            ["factions","x","Factions","(F)"],
            ["bestiary","x ","Bestiary","(B)"],
            ["achievements","x ","Achievements","(T)"],
            ["housing","x","Hero's Rest","(H)"],
            ["subclass","xRx","Subclass", player.level >= SUBCLASS_UNLOCK_LEVEL ? " : "(Lv20)""],
            ["collectionlog","x a","Collection Log",""],
            ["titles","x","Titles",""],
            ["leaderboards","x ","Leaderboards",""],
            ["savegame","x","Save Game",""],
          ].map(([s,i,n,hint]) => (
            <button key={s} style={{ ...S.classCard, cursor: "pointer", border: "1px solid #2d2d3d" }} onClick={() => setScreen(s)}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{i}</div>
              <div style={{ color: "#e2e8f0", fontWeight: "bold" }}>{n}</div>
              {hint && <div style={{ color: "#6b7280", fontSize: 10, marginTop: 4 }}>{hint}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );




  if (screen === "quests" && player) return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>x S Quest Log</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.smallBtn} onClick={() => { const q = rollQuests(floor, 3); setQuests(q); addMsg("x S New quests!", "#a78bfa"); }}>x   Roll Quests</button>
            <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
          </div>
        </div>
        <h3 style={S.sectionH}>Active Quests</h3>
        {quests.length === 0 && <p style={{ color: "#4b5563", fontSize: 13 }}>No quests. Click "Roll Quests" to get some.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
          {quests.map(q => {
            const fmt = formatQuest(q);
            const pct = Math.min(100, ((q.progress || 0) / q.count) * 100);
            return (
              <div key={q.uid} style={{ background: "#1a1a2e", padding: 12, borderRadius: 6, border: q.complete ? "1px solid #22c55e" : "1px solid #2d2d3d" }}>
                <div style={{ color: q.complete ? "#22c55e" : "#fde047", fontWeight: "bold", fontSize: 14 }}>{fmt.name} {q.complete && "S " }</div>
                <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 6 }}>{fmt.desc}</div>
                <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{q.progress || 0} / {q.count}</div>
                <div style={{ height: 5, background: "#2d2d3d", borderRadius: 3 }}>
                  <div style={{ height: "100%", background: "#22c55e", width: `${pct}%`, borderRadius: 3 }} />
                </div>
                {q.reward && (
                  <div style={{ marginTop: 6, fontSize: 10, color: "#fbbf24" }}>
                    Reward: {q.reward.gold ? `${q.reward.gold}g ` : "" }
                    {q.reward.exp ? `${q.reward.exp}xp ` : "" }
                    {q.reward.rep ? Object.keys(q.reward.rep).join(" ") : "" }
                    {q.reward.item ? "+Item" : "" }
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <h3 style={{ ...S.sectionH, marginTop: 20 }}>Daily Challenges</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8 }}>
          {DAILY_CHALLENGES.map(c => (
            <div key={c.id} style={{ background: "#1a1a2e", padding: 10, borderRadius: 5, border: "1px solid #2d2d3d" }}>
              <div style={{ color: "#60a5fa", fontWeight: "bold" }}>{c.name}</div>
              <div style={{ color: "#9ca3af", fontSize: 11 }}>{c.desc}</div>
              <div style={{ fontSize: 10, color: "#fbbf24", marginTop: 4 }}>+{c.reward.gold}g</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );




  if (screen === "skilltree" && player) {
    const tree = SKILL_TREES[player.cls] || [];
    const byTier = {};
    tree.forEach(n => { byTier[n.tier] = byTier[n.tier] || []; byTier[n.tier].push(n); });
    return (
      <div style={S.root}>
        <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>xR {CLASSES[player.cls]?.name} Skill Tree</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#fde047", fontSize: 13 }}>Points: {player.unspentSkill || 0}</span>
              <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
            </div>
          </div>
          {Object.keys(byTier).sort().map(t => (
            <div key={t} style={{ marginBottom: 14 }}>
              <h3 style={{ color: "#a78bfa", fontSize: 14, marginBottom: 6 }}>Tier {t}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {byTier[t].map(n => {
                  const unlocked = player.unlockedSkills.includes(n.id);
                  return (
                    <div key={n.id} style={{ background: unlocked ? "#1a2e1a" : "#1a1a2e", padding: 10, borderRadius: 5, border: unlocked ? "1px solid #22c55e" : "1px solid #2d2d3d", cursor: unlocked ? "default" : "pointer" }}
                      onClick={() => !unlocked && unlockSkill(n.id)}>
                      <div style={{ color: unlocked ? "#22c55e" : "#e2e8f0", fontWeight: "bold", fontSize: 12 }}>{n.name} {unlocked && "S " }</div>
                      <div style={{ color: "#9ca3af", fontSize: 11 }}>{n.desc}</div>
                      <div style={{ color: "#6b7280", fontSize: 10, marginTop: 3 }}>Branch: {n.branch}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }




  if (screen === "crafting" && player) {
    const matCounts = {};
    player.inventory.forEach(it => { matCounts[it.id] = (matCounts[it.id] || 0) + 1; });
    return (
      <div style={S.root}>
        <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "#f59e0b", fontFamily: "serif", fontSize: 22 }}>x  Crafting Forge</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#fbbf24" }}>x {player.gold}g</span>
              <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {RECIPES.filter(r => r.level <= player.level + 5).map(r => {
              const produced = itemById(r.produces);
              const canCraft = Object.entries(r.mats).every(([m, n]) => (matCounts[m] || 0) >= n) && player.gold >= r.gold;
              return (
                <div key={r.id} style={{ background: "#1a1a2e", padding: 12, borderRadius: 6, border: canCraft ? "1px solid #22c55e" : "1px solid #2d2d3d" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 26 }}>{produced?.icon || "x " }</span>
                    <div>
                      <div style={{ color: RARITY[produced?.rarity]?.color || "#e2e8f0", fontWeight: "bold" }}>{r.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 10 }}>Lv {r.level} required</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 6 }}>
                    {Object.entries(r.mats).map(([m, n]) => {
                      const it = itemById(m);
                      const ok = (matCounts[m] || 0) >= n;
                      return <span key={m} style={{ marginRight: 8, color: ok ? "#22c55e" : "#ef4444" }}>{it?.icon || "" } {m} ({matCounts[m] || 0}/{n})</span>;
                    })}
                  </div>
                  <div style={{ fontSize: 10, color: "#fbbf24", marginBottom: 6 }}>Gold: {r.gold}</div>
                  <button style={{ ...S.smBtn("#f59e0b"), opacity: canCraft ? 1 : 0.4 }} disabled={!canCraft} onClick={() => craftItem(r)}>x  Craft</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }




  if (screen === "factions") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>x Factions & Reputation</h2>
          <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10 }}>
          {Object.values(FACTIONS).map(f => {
            const rep = reputation[f.id] || 0;
            const tier = tierFor(f.id, rep);
            const nextTier = f.tiers.find(t => t.min > rep);
            const pct = nextTier ? ((rep - tier.min) / (nextTier.min - tier.min)) * 100 : 100;
            return (
              <div key={f.id} style={{ background: "#1a1a2e", padding: 12, borderRadius: 6, border: `1px solid ${f.color}55` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                  <div>
                    <div style={{ color: f.color, fontWeight: "bold", fontSize: 14 }}>{f.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 10 }}>{f.hq}</div>
                  </div>
                </div>
                <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 6 }}>{f.desc}</div>
                <div style={{ fontSize: 11, color: "#e2e8f0", marginBottom: 3 }}>Rank: <span style={{ color: f.color }}>{tier.name}</span> ({rep} rep)</div>
                <div style={{ height: 4, background: "#2d2d3d", borderRadius: 2, marginBottom: 4 }}>
                  <div style={{ height: "100%", background: f.color, width: `${pct}%`, borderRadius: 2 }} />
                </div>
                {nextTier && <div style={{ fontSize: 10, color: "#6b7280" }}>Next: {nextTier.name} ({nextTier.min - rep} more)</div>}
                {tier.unlock && <div style={{ fontSize: 10, color: "#22c55e", marginTop: 3 }}>Unlocked: {tier.unlock}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );




  if (screen === "bestiary") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>x  Bestiary</h2>
          <button style={S.closeBtn} onClick={() => (player ? setScreen("game") : setScreen("title"))}>Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {ENEMY_DATA.map(e => {
            const data = meta.bestiary?.[e.id];
            const seen = !!data;
            return (
              <div key={e.id} style={{ background: "#1a1a2e", padding: 10, borderRadius: 5, border: "1px solid #2d2d3d", opacity: seen ? 1 : 0.4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 22 }}>{seen ? e.icon : "?" }</span>
                  <div>
                    <div style={{ color: e.isBoss ? "#fbbf24" : "#e2e8f0", fontWeight: "bold" }}>{seen ? e.name : "???" }</div>
                    <div style={{ color: "#6b7280", fontSize: 10 }}>Floor {e.floor}+</div>
                  </div>
                </div>
                {seen && (
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                    HP:{e.hp} ATK:{e.atk} DEF:{e.def}  Kills: {data.kills}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );




  if (screen === "achievements") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#fde047", fontFamily: "serif", fontSize: 22 }}>x  Achievements</h2>
          <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
        </div>
        <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 16 }}>
          Completed: {Object.values(achievements || {}).filter(a => a.done).length} / {ACHIEVEMENTS.length}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
          {ACHIEVEMENTS.map(a => {
            const p = achievements[a.id] || { done: false, progress: 0 };
            return (
              <div key={a.id} style={{ background: "#1a1a2e", padding: 10, borderRadius: 5, border: p.done ? "1px solid #fde047" : "1px solid #2d2d3d", opacity: p.done ? 1 : 0.8 }}>
                <div style={{ color: p.done ? "#fde047" : "#e2e8f0", fontWeight: "bold" }}>{p.done ? "x  " : "" }{a.name}</div>
                <div style={{ color: "#6b7280", fontSize: 10 }}>{a.cat}</div>
                <div style={{ color: "#9ca3af", fontSize: 11 }}>{a.desc}</div>
                <div style={{ fontSize: 10, color: "#a78bfa", marginTop: 3 }}>Progress: {p.progress}/{a.goal}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );




  if (screen === "housing" && player) return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#10b981", fontFamily: "serif", fontSize: 22 }}>x Hero's Rest</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "#fbbf24" }}>x {player.gold}g</span>
            <span style={{ color: "#10b981" }}>Level {house.level}</span>
            <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
          </div>
        </div>
        <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 16 }}>
          Upgrade your base between runs. Owned: {house.upgrades.length} / {HOUSING_UPGRADES.length}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {HOUSING_UPGRADES.map(u => {
            const owned = house.upgrades.includes(u.id);
            const affordable = canBuy(house, u.id, player.gold);
            return (
              <div key={u.id} style={{ background: "#1a1a2e", padding: 12, borderRadius: 6, border: owned ? "1px solid #22c55e" : affordable ? "1px solid #a78bfa" : "1px solid #2d2d3d" }}>
                <div style={{ color: owned ? "#22c55e" : "#e2e8f0", fontWeight: "bold" }}>{u.name} {owned && "S " }</div>
                <div style={{ color: "#9ca3af", fontSize: 11 }}>{u.desc}</div>
                <div style={{ color: "#fbbf24", fontSize: 11, marginTop: 3 }}>Cost: {u.cost}g  House Lv {u.level}</div>
                {!owned && <button style={{ ...S.smBtn("#10b981"), opacity: affordable ? 1 : 0.4, marginTop: 6 }} disabled={!affordable} onClick={() => buyHouseUpgrade(u.id)}>Build</button>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );




  if (screen === "subclass" && player) {
    if (player.level < SUBCLASS_UNLOCK_LEVEL) {
      return (
        <div style={S.root}>
          <div style={{ ...S.screen, background: "#0d0d15", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>x </div>
            <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>Reach level {SUBCLASS_UNLOCK_LEVEL} to unlock subclasses</h2>
            <p style={{ color: "#9ca3af" }}>Current: Level {player.level}</p>
            <button style={{ ...S.smallBtn, marginTop: 20 }} onClick={() => setScreen("game")}>Back</button>
          </div>
        </div>
      );
    }
    const cd = CLASSES[player.cls];
    return (
      <div style={S.root}>
        <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>xRx Choose Subclass</h2>
            <button style={S.closeBtn} onClick={() => setScreen("game")}>Close</button>
          </div>
          {player.subclass ? (
            <p style={{ color: "#22c55e" }}>You are already a {cd?.subclasses?.[player.subclass]?.name}.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {Object.entries(cd?.subclasses || {}).map(([key, sd]) => (
                <div key={key} style={{ background: "#1a1a2e", padding: 14, borderRadius: 8, border: "1px solid #2d2d3d", cursor: "pointer" }} onClick={() => pickSubclass(key)}>
                  <div style={{ fontSize: 36, textAlign: "center" }}>{sd.icon}</div>
                  <div style={{ color: cd.color, fontWeight: "bold", fontSize: 16, textAlign: "center" }}>{sd.name}</div>
                  <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center", marginBottom: 6 }}>{sd.desc}</div>
                  <div style={{ fontSize: 10, color: "#a78bfa", textAlign: "center" }}>Spells: {sd.spells.join("  ")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }




  if (screen === "collectionlog") return (
    <div style={S.root}>
      <div style={{ ...S.screen, background: "#0d0d15", padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#e2e8f0", fontFamily: "serif", fontSize: 22 }}>x a Collection Log</h2>
          <button style={S.closeBtn} onClick={() => (player ? setScreen("game") : setScreen("title"))}>Close</button>
        </div>
        <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 16 }}>
          Discovered: {Object.keys(meta.collectionLog || {}).length} / {ALL_ITEMS.length}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
          {ALL_ITEMS.map(it => {
            const found = meta.collectionLog?.[it.id];
            return (
              <div key={it.id} style={{ background: "#1a1a2e", padding: 8, borderRadius: 5, border: "1px solid #2d2d3d", opacity: found ? 1 : 0.3 }}>
                <div style={{ fontSize: 22, textAlign: "center" }}>{found ? it.icon : " " }</div>
                <div style={{ fontSize: 10, color: found ? RARITY[it.rarity]?.color : "#6b7280", textAlign: "center" }}>{found ? it.name : "???" }</div>
                {found && <div style={{ fontSize: 9, color: "#6b7280", textAlign: "center" }}>x{found.count}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── DEFAULT / LOADING ────────────────────────────────────────
  return (
    <div style={S.root}>
      <div style={{ ...S.screen, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "white" }}>Loading screen: {screen}</div>
      </div>
    </div>
  );
}

try {
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(DungeonQuest));
  console.log("Dungeon of Eternity: Rendered.");
} catch (e) {
  console.error("Render failed:", e);
  const sub = document.querySelector('.loading-sub');
  if (sub) sub.innerText = "Render failed: " + e.message;
}
  