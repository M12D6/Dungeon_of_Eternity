// ═══════════════════════════════════════════════════════════════
//  ENEMIES — 100+ regular + 25+ bosses with unique mechanics
// ═══════════════════════════════════════════════════════════════

// Helper shortcut for enemies
const E = (id, name, icon, hp, atk, def, exp, gold, floor, extra = {}) =>
  ({ id, name, icon, hp, atk, def, exp, gold, floor, art: extra.art || `  ${icon}`, ...extra });

export const ENEMY_DATA = [
  // ═══════════════ FLOORS 1-3 (Sewers / Crypts biome) ═══════════════
  E("goblin",      "Goblin",          "👺", 40, 8, 2, 20, 5,  1, { art:"  (>_<)\n   )=(\n  /   \\", biome:"crypt" }),
  E("rat",         "Giant Rat",       "🐀", 30, 6, 1, 15, 3,  1, { art:"  (ò_ó)\n  /www\\", biome:"sewer" }),
  E("spider",      "Cave Spider",     "🕷️", 45, 10,3, 25, 6,  1, { art:"  /\\  /\\\n  |oo  oo|\n  \\----/", biome:"crypt", status:"POISON" }),
  E("imp",         "Imp",             "😈", 35, 11,2, 22, 7,  1, { art:"  ^  ^\n (o  o)\n  \\--/", biome:"crypt", elem:"fire" }),
  E("zombie",      "Zombie",          "🧟", 55, 7, 5, 28, 5,  1, { art:"  (x.x)\n  |   |\n  | | |", biome:"crypt" }),
  E("bat",         "Vampire Bat",     "🦇", 28, 9, 1, 18, 4,  1, { art:"  /\\  /\\\n (oo  oo)\n  \\--/", biome:"crypt" }),
  E("slime",       "Slime",           "🟢", 50, 5, 8, 20, 6,  1, { art:"  ._____.\n  |SLIME|\n  '-----'", biome:"sewer", status:"ACID" }),
  E("giantfrog",   "Giant Frog",      "🐸", 40, 8, 4, 22, 5,  1, { biome:"sewer", status:"POISON" }),
  E("rat_swarm",   "Rat Swarm",       "🐀", 35, 12,1, 24, 6,  1, { biome:"sewer" }),
  E("shade",       "Shade",           "👻", 32, 10,2, 24, 8,  1, { biome:"crypt", elem:"dark", passive:"phase" }),
  E("worm",        "Cave Worm",       "🪱", 38, 7, 6, 19, 5,  1, { biome:"crypt" }),
  E("skeleton_r",  "Restless Skeleton","💀",45, 9, 5, 26, 7,  1, { biome:"crypt" }),

  // ═══════════════ FLOORS 2-5 (Catacombs) ═══════════════
  E("skeleton",    "Skeleton",        "💀", 65, 16,7, 55, 14, 2, { art:"   .--.\n  (o o)\n  |   |\n  /|   |\\", biome:"catacomb" }),
  E("orc",         "Orc Warrior",     "👹", 85, 20,9, 70, 18, 2, { art:"   ___\n  |o o|\n  | ^ |\n  /   \\", biome:"catacomb" }),
  E("witch",       "Witch",           "🧙", 60, 22,4, 75, 22, 2, { art:"  .  *  .\n  (o~o)\n  |HEX|", biome:"catacomb", status:"CURSE", elem:"dark" }),
  E("gnoll",       "Gnoll",           "🐺", 72, 18,6, 60, 16, 2, { art:"  /\\_/\\\n  (o.o)\n  / V \\", biome:"forest" }),
  E("mushroom",    "Poison Mushroom", "🍄", 48, 14,10,45, 10, 2, { art:"   ___\n  (o o)\n  | M |", biome:"forest", status:"POISON" }),
  E("banshee",     "Banshee",         "👻", 55, 24,3, 80, 24, 2, { art:"  ~~~*~~~\n  ~(o o)~", biome:"catacomb", status:"FEAR", elem:"dark" }),
  E("kobold",      "Kobold Mage",     "🦎", 50, 20,4, 65, 20, 2, { art:"  (>.<)\n  |   |\n  // \\\\", biome:"forest", elem:"fire" }),
  E("ghoul",       "Ghoul",           "🧟", 70, 18,8, 62, 16, 2, { biome:"catacomb", status:"DECAY" }),
  E("harpy",       "Harpy",           "🪶", 58, 22,5, 68, 18, 2, { biome:"mountain" }),
  E("dryad",       "Wild Dryad",      "🌿", 62, 20,7, 66, 18, 2, { biome:"forest", status:"ROOT" }),
  E("fire_imp",    "Fire Imp",        "🔥", 55, 24,4, 72, 22, 3, { biome:"volcano", elem:"fire", status:"BURN" }),
  E("ice_imp",     "Frost Imp",       "❄️", 55, 22,5, 70, 22, 3, { biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("specter",     "Specter",         "👻", 68, 26,3, 82, 26, 3, { biome:"catacomb", elem:"dark", passive:"phase" }),
  E("plague_rat",  "Plague Rat",      "🐀", 52, 15,4, 55, 15, 3, { biome:"sewer", status:"PLAGUE" }),

  // ═══════════════ FLOORS 4-8 (Dungeon Depths) ═══════════════
  E("werewolf",    "Werewolf",        "🐺", 120,28,11,115,38, 4, { art:"  /\\_/\\\n  (o.o)\n  )ROAR(", biome:"forest" }),
  E("darkknight",  "Dark Knight",     "🗡️", 140,32,17,140,48, 4, { art:"  [|||]\n  |o o|", biome:"fortress" }),
  E("necromancer", "Necromancer",     "💀", 105,30,7, 130,55, 4, { biome:"catacomb", elem:"dark", status:"CURSE" }),
  E("vampire",     "Vampire",         "🧛", 110,28,9, 125,52, 4, { biome:"catacomb", unique:"lifesteal", elem:"dark" }),
  E("golem",       "Stone Golem",     "🗿", 160,24,22,135,44, 4, { biome:"mountain" }),
  E("troll",       "Troll",           "👾", 135,30,13,118,40, 4, { biome:"forest", passive:"regen" }),
  E("wyvern",      "Wyvern",          "🐲", 150,34,14,155,58, 5, { biome:"mountain", elem:"fire" }),
  E("wraith",      "Wraith",          "👻", 90, 35,5, 120,50, 5, { biome:"catacomb", elem:"dark", passive:"phase" }),
  E("basilisk",    "Basilisk",        "🐍", 155,33,16,168,65, 5, { biome:"swamp", status:"PARALYZE" }),
  E("mummy",       "Mummy",           "🧟", 145,28,12,142,52, 5, { biome:"desert", status:"CURSE" }),
  E("sand_worm",   "Sand Worm",       "🪱", 165,30,15,160,55, 5, { biome:"desert" }),
  E("wendigo",     "Wendigo",         "❄️", 135,36,8, 148,54, 5, { biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("giant_scorp", "Giant Scorpion",  "🦂", 125,32,14,140,50, 5, { biome:"desert", status:"POISON" }),
  E("shambler",    "Shambler",        "🧟", 155,26,16,144,50, 5, { biome:"swamp" }),
  E("ogre",        "Ogre",            "👹", 170,35,12,160,60, 5, { biome:"mountain" }),
  E("dire_wolf",   "Dire Wolf",       "🐺", 125,38,10,150,52, 6, { biome:"forest", passive:"pack" }),
  E("yeti",        "Yeti",            "🦍", 180,32,18,175,65, 6, { biome:"glacier", elem:"ice" }),
  E("salamander",  "Salamander",      "🦎", 140,38,12,158,58, 6, { biome:"volcano", elem:"fire" }),
  E("lizardman",   "Lizardman",       "🦎", 125,36,14,148,56, 6, { biome:"swamp" }),
  E("mantis",      "Giant Mantis",    "🦗", 130,40,11,152,55, 6, { biome:"forest", passive:"swift" }),

  // ═══════════════ FLOORS 7-12 (Deep Dungeon) ═══════════════
  E("elemental",   "Fire Elemental",  "🔥", 150,38,12,170,62, 7, { biome:"volcano", elem:"fire", status:"BURN" }),
  E("ice_elem",    "Ice Elemental",   "❄️", 150,36,12,170,62, 7, { biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("thunder_elem","Thunder Elemental","⚡",150,40,10,172,64, 7, { biome:"mountain", elem:"lightning", status:"STUN" }),
  E("earth_elem",  "Earth Elemental", "🗿", 180,32,22,174,60, 7, { biome:"mountain" }),
  E("minotaur",    "Minotaur",        "🐂", 190,42,20,198,74, 7, { biome:"fortress" }),
  E("hydra",       "Hydra",           "🐉", 200,36,15,210,80, 7, { biome:"swamp", passive:"regen" }),
  E("phoenix",     "Phoenix",         "🦅", 175,44,13,185,78, 8, { biome:"volcano", elem:"fire", passive:"rebirth" }),
  E("abomination", "Abomination",     "👾", 260,43,25,248,96, 9, { biome:"catacomb" }),
  E("shadow",      "Shadow Fiend",    "🌑", 130,40,8, 163,60, 9, { biome:"void", elem:"dark", passive:"phase" }),
  E("lich",        "Lich",            "💀", 220,47,22,238,92, 10,{ biome:"catacomb", elem:"dark", status:"CURSE" }),
  E("demon",       "Demon Lord",      "😈", 240,51,24,258,98, 10,{ biome:"hell", elem:"fire", status:"BURN" }),
  E("dragon_wh",   "White Dragon",    "🐉", 260,52,28,275,110,10,{ biome:"glacier", elem:"ice" }),
  E("dragon_bl",   "Black Dragon",    "🐉", 255,55,26,280,115,10,{ biome:"swamp", elem:"dark", status:"POISON" }),
  E("chimera",     "Chimera",         "🐉", 240,48,24,260,105,11,{ biome:"volcano", elem:"fire" }),
  E("manticore",   "Manticore",       "🦁", 220,50,22,250,100,11,{ biome:"desert" }),
  E("djinn",       "Djinn",           "✨", 200,52,18,265,105,11,{ biome:"desert", elem:"arcane", status:"CHARM" }),
  E("behemoth",    "Behemoth",        "🐂", 290,48,30,285,115,12,{ biome:"mountain" }),
  E("kraken",      "Kraken",          "🐙", 270,52,25,290,120,12,{ biome:"swamp", status:"ROOT" }),
  E("golem_obs",   "Obsidian Golem",  "🗿", 310,42,36,300,120,12,{ biome:"volcano", elem:"fire" }),
  E("revenant",    "Revenant",        "💀", 225,58,18,290,115,12,{ biome:"catacomb", elem:"dark", passive:"revive" }),

  // ═══════════════ FLOORS 13+ (Endgame) ═══════════════
  E("ancient_dragon","Ancient Dragon","🐉", 350,64,30,400,150,13,{ biome:"volcano", elem:"fire" }),
  E("void_wraith", "Void Wraith",     "🌀", 200,57,18,378,142,13,{ biome:"void", elem:"dark", passive:"phase" }),
  E("titan",       "Shadow Titan",    "🗿", 400,60,35,450,170,14,{ biome:"void" }),
  E("elder_demon", "Elder Demon",     "👹", 300,70,28,420,160,14,{ biome:"hell", elem:"dark", status:"CURSE" }),
  E("seraph",      "Fallen Seraph",   "👼", 280,72,22,430,165,14,{ biome:"heavenly", elem:"holy", status:"HOLY_FIRE" }),
  E("cosmic_horror","Cosmic Horror",  "🌌", 450,80,40,600,220,16,{ biome:"void", elem:"arcane", status:"VOID" }),
  E("void_lord",   "Void Lord",       "🌌", 480,85,35,650,240,17,{ biome:"void", elem:"dark", status:"VOID" }),
  E("primordial",  "Primordial Beast","🐉", 550,75,42,720,260,18,{ biome:"volcano" }),
  E("star_spawn",  "Star Spawn",      "⭐", 420,92,28,750,275,19,{ biome:"void", elem:"arcane" }),
  E("ender",       "Ender",           "🌌", 600,100,38,900,330,20,{ biome:"void", elem:"dark", status:"DOOM" }),

  // ═══════════════ BOSSES — 25+ with mechanics ═══════════════
  E("boss_goblin_king","Goblin King", "👑", 300, 30, 14, 400, 120, 1,
    { isBoss:true, mechanic:"summon_minions", biome:"crypt",
      art:"  ~~CROWN~~\n  |O    O|\n  |  GG  |\n  |KING  |" }),
  E("boss_spider_q","Spider Queen",   "🕷️", 420, 36, 16, 500, 160, 3,
    { isBoss:true, mechanic:"poison_web", biome:"crypt", status:"POISON",
      art:"  /\\  /\\\n  QUEEN\n  OF WEB" }),
  E("boss_bone_dragon","Bone Dragon", "🦴", 500, 48, 22, 700, 220, 5,
    { isBoss:true, mechanic:"bone_nova", biome:"catacomb",
      art:"  BONE\n  /----\\\n  |X  X|\n  DRAGON" }),
  E("boss_werewolf","Alpha Werewolf", "🐺", 600, 55, 20, 850, 280, 7,
    { isBoss:true, mechanic:"enrage", biome:"forest",
      art:"  /\\_/\\\n  ALPHA\n  ROARS!" }),
  E("boss_minotaur","Minotaur Lord",  "🐂", 680, 58, 28, 920, 310, 8,
    { isBoss:true, mechanic:"charge", biome:"fortress" }),
  E("boss_shadow_titan","Shadow Titan","🌑", 700, 62, 30, 1100, 440, 10,
    { isBoss:true, mechanic:"shadow_clone", biome:"void", elem:"dark",
      art:"  #########\n  #O     O#\n  # TITAN #\n  #########" }),
  E("boss_fire_lord","Fire Lord",     "🔥", 820, 68, 28, 1250, 500, 11,
    { isBoss:true, mechanic:"inferno", biome:"volcano", elem:"fire", status:"BURN" }),
  E("boss_ice_queen","Ice Queen",     "❄️", 760, 66, 30, 1220, 490, 11,
    { isBoss:true, mechanic:"blizzard", biome:"glacier", elem:"ice", status:"FREEZE" }),
  E("boss_lich_king","Lich King",     "💀", 850, 72, 28, 1350, 540, 12,
    { isBoss:true, mechanic:"raise_dead", biome:"catacomb", elem:"dark", status:"CURSE" }),
  E("boss_demon","Pit Lord",          "😈", 900, 75, 30, 1400, 560, 13,
    { isBoss:true, mechanic:"pit_flames", biome:"hell", elem:"fire" }),
  E("boss_hydra_queen","Hydra Queen", "🐉", 900, 72, 25, 1400, 550, 15,
    { isBoss:true, mechanic:"multi_head", biome:"swamp",
      art:"  o  o  o\n  HYDRA\n  QUEEN!!!" }),
  E("boss_kraken","Kraken",           "🐙", 1050,78, 28, 1650, 650, 15,
    { isBoss:true, mechanic:"tentacles", biome:"swamp", status:"ROOT" }),
  E("boss_ancient","Ancient Dragon",  "🐲", 1200,85, 38, 2000, 800, 20,
    { isBoss:true, mechanic:"dragon_fury", biome:"volcano", elem:"fire",
      art:"  .--.\n  ANCIENT\n  DRAGON\n  AWAKENED" }),
  E("boss_void_lord","Void Lord",     "🌀", 1300,92, 32, 2200, 850, 22,
    { isBoss:true, mechanic:"void_rift", biome:"void", elem:"dark", status:"VOID" }),
  E("boss_titan","Titan Colossus",    "🗿", 1500,88, 45, 2500, 900, 23,
    { isBoss:true, mechanic:"earth_shake", biome:"mountain" }),
  E("boss_god","God of Ruin",         "🌋", 2000,120,60, 5000, 2000,25,
    { isBoss:true, mechanic:"apocalypse", biome:"void",
      art:"  *GOD*\n  OF RUIN\n  AWAKENED\n  !!!!!!" }),
  E("boss_angel","Fallen Archangel",  "👼", 1400,100,40, 3000, 1200,24,
    { isBoss:true, mechanic:"holy_judgment", biome:"heavenly", elem:"holy" }),
  E("boss_chrono","Chrono Guardian",  "⌛", 1200,95, 35, 2800, 1100,22,
    { isBoss:true, mechanic:"time_loop", biome:"void", elem:"arcane" }),
  E("boss_world","World Serpent",     "🐍", 2500,105,50, 6000, 2500,30,
    { isBoss:true, mechanic:"world_coil", biome:"void", elem:"dark" }),
  E("boss_creator","The Creator",     "🌟", 3500,140,70, 9999, 5000,40,
    { isBoss:true, mechanic:"creation", biome:"void", elem:"arcane" }),
  E("boss_destroyer","The Destroyer", "🌌", 5000,180,90, 12000,8000,50,
    { isBoss:true, mechanic:"destruction", biome:"void", elem:"dark" }),
  // Endless mode bosses
  E("boss_infinity","Infinity Warden","♾️", 4000,160,80, 15000,6000,60,
    { isBoss:true, mechanic:"infinite", biome:"void", elem:"arcane" }),
  E("boss_aspect","Aspect of All",    "✨", 6000,200,100,25000,15000,75,
    { isBoss:true, mechanic:"aspects", biome:"void", elem:"arcane" }),

  // ═══════════════ SECRET / HIDDEN ENEMIES ═══════════════
  E("mimic",         "Mimic",             "🪤", 180, 40, 20, 300, 200, 5,
    { isMimic:true, biome:"any" }),
  E("treasure_goblin","Treasure Goblin",  "👺", 60, 15, 5, 100, 500, 3,
    { rare:true, mechanic:"flee", biome:"any" }),
  E("ghost_king",    "Ghost King",        "👻", 500, 65, 25, 1200, 400, 10,
    { rare:true, biome:"catacomb", elem:"dark" }),
];

// ═══════════════════════════════════════════════════════════════
//  PETS / COMPANIONS
// ═══════════════════════════════════════════════════════════════
export const PETS = {
  WOLF:      { id:"wolf",    name:"Wolf",      icon:"🐺", hp:80, atk:15, def:5, desc:"Loyal melee companion",    tameable:true, spell:"Bite" },
  BEAR:      { id:"bear",    name:"Bear",      icon:"🐻", hp:150,atk:22, def:10,desc:"Heavy defensive tank",     tameable:true, spell:"Maul" },
  HAWK:      { id:"hawk",    name:"Hawk",      icon:"🦅", hp:50, atk:20, def:3, desc:"Fast aerial striker",      tameable:true, spell:"Dive" },
  PANTHER:   { id:"panther", name:"Panther",   icon:"🐆", hp:90, atk:25, def:6, desc:"Stealthy assassin",        tameable:true, spell:"Pounce" },
  FOX:       { id:"fox",     name:"Shadow Fox",icon:"🦊", hp:60, atk:18, def:4, desc:"Clever trickster, evades", tameable:true, spell:"Illusion" },
  SPIDER:    { id:"spider",  name:"Spider",    icon:"🕷️", hp:55, atk:14, def:4, desc:"Poisonous little friend",  tameable:true, spell:"Web" },
  BAT:       { id:"bat",     name:"Bat",       icon:"🦇", hp:40, atk:16, def:2, desc:"Vampiric leech",           tameable:true, spell:"Drain" },
  // Summonable (necromancer)
  SKELETON:  { id:"skelepet",name:"Skeleton Minion",icon:"💀",hp:70,atk:18,def:5,desc:"Bone minion",              summonable:true, spell:"Bone Slash" },
  GHOUL:     { id:"ghoulpet",name:"Ghoul Minion",   icon:"🧟",hp:100,atk:20,def:8,desc:"Flesh-eating ally",       summonable:true, spell:"Rend" },
  IMP:       { id:"imppet",  name:"Imp Familiar",   icon:"😈",hp:55, atk:20,def:3,desc:"Fire-casting imp",        summonable:true, spell:"Flame Jab" },
  // Rare/legendary
  PHOENIX:   { id:"phoenix", name:"Phoenix Chick",icon:"🦜",hp:120,atk:28,def:6,desc:"Reborn from ashes",         rare:true,     spell:"Rebirth Flame" },
  DRAGONLING:{ id:"dragonling",name:"Dragonling", icon:"🐉",hp:150,atk:32,def:12,desc:"Young dragon",             rare:true,     spell:"Fire Breath" },
  UNICORN:   { id:"unicorn", name:"Unicorn",    icon:"🦄", hp:130,atk:25, def:8,desc:"Mythical, heals you",       rare:true,     spell:"Healing Horn" },
  VOIDPET:   { id:"voidpup", name:"Void Pup",   icon:"🌀", hp:100,atk:30, def:5,desc:"Strange otherworldly pup",   rare:true,     spell:"Void Shock" },
};

// Helper: get enemies matching biome + floor tier
export function enemiesForBiome(biome, floor) {
  return ENEMY_DATA.filter(e =>
    !e.isBoss &&
    !e.rare &&
    !e.isMimic &&
    (e.biome === biome || e.biome === "any" || !e.biome) &&
    e.floor <= Math.max(floor, 1) &&
    e.floor >= Math.max(1, floor - 8)
  );
}

export function bossForFloor(floor) {
  const bosses = ENEMY_DATA.filter(e => e.isBoss && e.floor <= floor);
  if (!bosses.length) return ENEMY_DATA.find(e => e.id === "boss_goblin_king");
  return bosses.reduce((best, cur) => (cur.floor > best.floor ? cur : best), bosses[0]);
}
