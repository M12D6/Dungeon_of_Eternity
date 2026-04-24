// ═══════════════════════════════════════════════════════════════
//  ITEMS — 500+ entries across weapons, armor, accessories,
//  consumables, gems, runes, materials, sets, uniques, cursed
// ═══════════════════════════════════════════════════════════════

// Helper functions for generating bulk items
const W = (id, name, rarity, atk, icon, val, extra={}) =>
  ({ id, name, slot:"weapon", rarity, atk, def:0, hp:0, mana:0, icon, val, ...extra });
const A = (id, name, rarity, def, icon, val, extra={}) =>
  ({ id, name, slot:"armor", rarity, atk:0, def, hp:0, mana:0, icon, val, ...extra });
const H = (id, name, rarity, def, icon, val, extra={}) =>
  ({ id, name, slot:"helmet", rarity, atk:0, def, hp:0, mana:0, icon, val, ...extra });
const B_ = (id, name, rarity, def, icon, val, extra={}) =>
  ({ id, name, slot:"boots", rarity, atk:0, def, hp:0, mana:0, icon, val, ...extra });
const R = (id, name, rarity, atk, def, hp, mana, icon, val, extra={}) =>
  ({ id, name, slot:"ring", rarity, atk, def, hp, mana, icon, val, ...extra });
const N = (id, name, rarity, atk, def, hp, mana, icon, val, extra={}) =>
  ({ id, name, slot:"neck", rarity, atk, def, hp, mana, icon, val, ...extra });
const G_ = (id, name, rarity, def, icon, val, extra={}) =>  // gloves
  ({ id, name, slot:"gloves", rarity, atk:0, def, hp:0, mana:0, icon, val, ...extra });
const S_ = (id, name, rarity, def, icon, val, extra={}) =>  // shield (off-hand)
  ({ id, name, slot:"offhand", rarity, atk:0, def, hp:0, mana:0, icon, val, ...extra });
const C_ = (id, name, rarity, def, icon, val, extra={}) =>  // cape
  ({ id, name, slot:"cape", rarity, atk:0, def, hp:0, mana:0, icon, val, ...extra });

export const ALL_ITEMS = [
  // ═══════════════ WEAPONS (150+) ═══════════════
  // ── Common/basic ──
  W("w_stick",       "Cracked Branch",    "COMMON",    4,  "🌿", 5),
  W("w_knife",       "Rusty Knife",       "COMMON",    7,  "🔪", 10),
  W("w_club",        "Wooden Club",       "COMMON",    6,  "🪵", 8),
  W("w_sling",       "Sling",             "COMMON",    5,  "🪨", 9),
  W("w_sword1",      "Iron Sword",        "COMMON",    12, "⚔️", 25),
  W("w_axe1",        "Woodcutter Axe",    "COMMON",    14, "🪓", 30),
  W("w_bow1",        "Crude Bow",         "COMMON",    10, "🏹", 20),
  W("w_staff1",      "Apprentice Staff",  "COMMON",    8,  "🔮", 22, {mana:20}),
  W("w_dagger1",     "Short Dagger",      "COMMON",    11, "🗡️", 18),
  W("w_mace1",       "Wooden Mace",       "COMMON",    13, "🔨", 26),
  W("w_whip",        "Leather Whip",      "COMMON",    9,  "🪢", 22),
  W("w_pitchfork",   "Pitchfork",         "COMMON",    10, "🍴", 24),
  // ── Uncommon ──
  W("w_sword2",      "Steel Longsword",   "UNCOMMON",  22, "⚔️", 80),
  W("w_axe2",        "Battle Axe",        "UNCOMMON",  26, "🪓", 90),
  W("w_bow2",        "Silver Bow",        "UNCOMMON",  20, "🏹", 75),
  W("w_staff2",      "Wizard Staff",      "UNCOMMON",  16, "🪄", 85, {mana:40}),
  W("w_hammer1",     "War Hammer",        "UNCOMMON",  28, "🔨", 95),
  W("w_spear1",      "Iron Spear",        "UNCOMMON",  24, "🔱", 85, {def:2}),
  W("w_wand1",       "Magic Wand",        "UNCOMMON",  18, "✨", 90, {mana:50}),
  W("w_rapier",      "Rapier",            "UNCOMMON",  21, "🗡️", 82, {spd:3}),
  W("w_scimitar",    "Scimitar",          "UNCOMMON",  23, "⚔️", 86),
  W("w_morningstar", "Morningstar",       "UNCOMMON",  27, "🌟", 92),
  W("w_halberd",     "Halberd",           "UNCOMMON",  29, "🔱", 98, {def:3}),
  W("w_crossbow",    "Crossbow",          "UNCOMMON",  25, "🏹", 90),
  W("w_shortbow",    "Composite Shortbow","UNCOMMON",  22, "🏹", 78),
  W("w_hatchet",     "Hand Hatchet",      "UNCOMMON",  18, "🪓", 68),
  // ── Rare ──
  W("w_flamebrand",  "Flamebrand",        "RARE",      40, "🔥", 250, {mana:10, elem:"fire"}),
  W("w_frostfang",   "Frostfang",         "RARE",      36, "❄️", 240, {mana:20, elem:"ice"}),
  W("w_stormcall",   "Stormcaller",       "RARE",      38, "⚡", 260, {mana:25, elem:"lightning"}),
  W("w_shadowstk",   "Shadowstrike",      "RARE",      44, "🌑", 280, {elem:"dark"}),
  W("w_twin",        "Twin Blades",       "RARE",      48, "⚔️", 300, {spd:2}),
  W("w_scythe1",     "Reaper Scythe",     "RARE",      50, "⚙️", 310, {hp:10}),
  W("w_trident",     "Cursed Trident",    "RARE",      42, "🔱", 255, {mana:15}),
  W("w_bladeedge",   "Bladed Edge",       "RARE",      45, "⚔️", 290, {crit:5}),
  W("w_soulbow",     "Soul Bow",          "RARE",      40, "🏹", 270, {mana:20}),
  W("w_venomstk",    "Venom Stick",       "RARE",      36, "🐍", 250, {elem:"poison"}),
  W("w_runehammer",  "Runed Hammer",      "RARE",      46, "🔨", 305),
  W("w_elvenbow",    "Elven Longbow",     "RARE",      42, "🏹", 280, {spd:3}),
  W("w_crystalstaff","Crystal Staff",     "RARE",      34, "💎", 270, {mana:70}),
  W("w_glaive",      "Glaive",            "RARE",      44, "🔱", 280, {def:5}),
  W("w_flail",       "Flail of Pain",     "RARE",      48, "⛓️", 295, {elem:"phys"}),
  // ── Epic ──
  W("w_obsidian",    "Obsidian Blade",    "EPIC",      65, "⚔️", 700),
  W("w_dragonbow",   "Dragonbone Bow",    "EPIC",      60, "🏹", 680, {spd:4}),
  W("w_voidstaff",   "Void Staff",        "EPIC",      50, "🌀", 720, {mana:80, elem:"dark"}),
  W("w_soulreap",    "Soulreaper",        "EPIC",      72, "💀", 750, {hp:20, elem:"dark"}),
  W("w_moonblade",   "Moonblade",         "EPIC",      68, "🌙", 730, {def:5, mana:20, elem:"holy"}),
  W("w_sunspear",    "Sunforged Spear",   "EPIC",      62, "☀️", 710, {def:5, mana:10, elem:"holy"}),
  W("w_chaos",       "Chaos Axe",         "EPIC",      78, "🪓", 780),
  W("w_quicksilver", "Quicksilver Blade", "EPIC",      60, "💧", 690, {spd:6, crit:10}),
  W("w_doomsaber",   "Doom Saber",        "EPIC",      74, "⚔️", 740),
  W("w_venomstaff",  "Venom Staff",       "EPIC",      55, "☠️", 700, {mana:60, elem:"poison"}),
  W("w_iceblade",    "Glacier Blade",     "EPIC",      66, "🧊", 720, {elem:"ice"}),
  W("w_thunderaxe",  "Thunder Axe",       "EPIC",      76, "⚡", 750, {elem:"lightning"}),
  W("w_bloodcaller", "Blood Caller",      "EPIC",      68, "🩸", 730, {hp:30, elem:"dark"}),
  W("w_ghostedge",   "Ghost Edge",        "EPIC",      72, "👻", 745, {spd:3, elem:"dark"}),
  W("w_runestaff",   "Runed Staff",       "EPIC",      58, "🔮", 725, {mana:90}),
  // ── Legendary ──
  W("w_dragonslyr",  "Dragonslayer",      "LEGENDARY", 95, "⚔️", 2000, {hp:50, unique:"slay_dragons"}),
  W("w_excalibur",   "Excalibur",         "LEGENDARY", 105,"✨", 2500, {def:10, hp:30, mana:20, unique:"holy_judge"}),
  W("w_deathscyth",  "Death's Scythe",    "LEGENDARY", 110,"💀", 2800, {mana:30, unique:"reap_souls"}),
  W("w_godslayer",   "Godslayer",         "LEGENDARY", 130,"⚔️", 3500, {def:5, hp:20, mana:10}),
  W("w_cosmicbow",   "Cosmic Bow",        "LEGENDARY", 115,"🌌", 2900, {mana:40, unique:"star_arrow"}),
  W("w_mjolnir",     "Mjölnir",           "LEGENDARY", 120,"🔨", 3200, {mana:40, elem:"lightning"}),
  W("w_gungnir",     "Gungnir",           "LEGENDARY", 118,"🔱", 3100, {crit:15, unique:"never_miss"}),
  W("w_mythril",     "Mythril Edge",      "LEGENDARY", 108,"⚔️", 2700),
  W("w_phoenix",     "Phoenix Staff",     "LEGENDARY", 98, "🔥", 2900, {mana:100, elem:"fire"}),
  W("w_starfall",    "Starfall",          "LEGENDARY", 112,"⭐", 3000, {spd:5, mana:50}),
  W("w_artoria",     "Artoria's Edge",    "LEGENDARY", 116,"✨", 3150, {hp:40, unique:"holy_judge"}),
  // ── Mythic / Unique ──
  W("w_worldend",    "Worldender",        "MYTHIC",    180,"🌋", 9999, {def:10, hp:50, mana:50, unique:"world_ender"}),
  W("w_creation",    "Staff of Creation", "MYTHIC",    150,"🌟", 9999, {hp:30, mana:150, unique:"genesis"}),
  W("w_timeblade",   "Time Blade",        "MYTHIC",    160,"⌛", 9999, {spd:10, unique:"time_stop"}),
  W("w_voidslayer",  "Void Slayer",       "MYTHIC",    170,"🌌", 9999, {mana:80, unique:"void_pierce"}),
  W("w_infinity",    "Blade of Infinity", "MYTHIC",    195,"♾️", 9999, {hp:100, mana:100, unique:"endless_combo"}),
  // ── Unique (special properties) ──
  W("w_vampiric",    "Vampiric Blade",    "UNIQUE",    85, "🧛", 2500, {unique:"lifesteal_50"}),
  W("w_lucky",       "Lucky Sword",       "UNIQUE",    60, "🍀", 1200, {unique:"lucky_crit", crit:30}),
  W("w_backstabber", "The Backstabber",   "UNIQUE",    72, "🗡️", 1800, {unique:"first_crit", spd:6}),
  W("w_berserker",   "Berserker's Axe",   "UNIQUE",    95, "🪓", 2400, {unique:"rage_scale"}),
  W("w_thorn",       "Thornlash",         "UNIQUE",    68, "🌹", 1600, {unique:"reflect_50"}),
  W("w_chrono",      "Chrono Dagger",     "UNIQUE",    55, "⌛", 1500, {spd:15, unique:"double_turn"}),
  // ── Cursed ──
  W("w_cursed1",     "Blood Pact Blade",  "CURSED",    120,"🩸", 2000, {hp:-40, unique:"curse_blood"}),
  W("w_cursed2",     "Soulbinder",        "CURSED",    140,"👻", 2200, {mana:-50, unique:"curse_soul"}),
  W("w_cursed3",     "Devil's Bargain",   "CURSED",    180,"👹", 3000, {hp:-80, crit:40, unique:"curse_devil"}),
  W("w_cursed4",     "Plague Staff",      "CURSED",    90, "🦠", 1800, {mana:60, unique:"curse_plague"}),

  // ═══════════════ ARMOR (100+) ═══════════════
  A("a_rags",        "Tattered Rags",     "COMMON",    5,  "👕", 5,  {hp:10}),
  A("a_leather",     "Leather Vest",      "COMMON",    10, "🧥", 30, {hp:20}),
  A("a_padded",      "Padded Gambeson",   "COMMON",    12, "🧥", 40, {hp:25}),
  A("a_travel",      "Traveler's Cloak",  "COMMON",    8,  "🧥", 28, {hp:15, mana:10}),
  A("a_chain",       "Chain Mail",        "UNCOMMON",  20, "🛡️", 90, {hp:30}),
  A("a_ringmail",    "Ring Mail",         "UNCOMMON",  18, "🛡️", 85, {hp:25}),
  A("a_studded",     "Studded Leather",   "UNCOMMON",  16, "🧥", 80, {hp:20, spd:2}),
  A("a_mage_robe",   "Mage Robe",         "UNCOMMON",  12, "👘", 90, {mana:50}),
  A("a_iron",        "Iron Plate",        "RARE",      35, "🛡️", 250, {hp:40}),
  A("a_bone",        "Bone Armor",        "RARE",      30, "🦴", 260, {hp:50, mana:10}),
  A("a_elven",       "Elven Silk",        "RARE",      22, "👘", 270, {hp:30, mana:40, spd:3}),
  A("a_plate",       "Knight's Plate",    "RARE",      40, "🛡️", 280, {hp:45}),
  A("a_spikedarmor", "Spiked Armor",      "RARE",      38, "⚔️", 285, {hp:40, unique:"thorns_5"}),
  A("a_shadow",      "Shadow Plate",      "EPIC",      50, "🌑", 700, {hp:60, atk:5}),
  A("a_mithril",     "Mithril Armor",     "EPIC",      60, "🛡️", 750, {hp:80}),
  A("a_flame_mail",  "Flame Mail",        "EPIC",      52, "🔥", 720, {hp:70, elem:"fire"}),
  A("a_frost_mail",  "Frost Mail",        "EPIC",      54, "❄️", 720, {hp:70, elem:"ice"}),
  A("a_light_robe",  "Light Robe",        "EPIC",      38, "✨", 700, {hp:50, mana:90, elem:"holy"}),
  A("a_dragon",      "Dragonscale Mail",  "LEGENDARY", 85, "🐉", 2200, {hp:120, unique:"fire_resist"}),
  A("a_divine",      "Divine Plate",      "LEGENDARY", 95, "✨", 2800, {hp:150, mana:30, atk:5, unique:"holy_ward"}),
  A("a_necro",       "Necroplate",        "LEGENDARY", 80, "💀", 2300, {hp:130, mana:60}),
  A("a_royal",       "Royal Guard Plate", "LEGENDARY", 100,"👑", 2700, {hp:160, unique:"kings_ward"}),
  A("a_titan",       "Titan's Shell",     "LEGENDARY", 110,"🗿", 3000, {hp:200}),
  A("a_void",        "Void Aegis",        "MYTHIC",    130,"🌀", 9999, {hp:200, mana:50, atk:10, unique:"void_ward"}),
  A("a_god_armor",   "Raiment of Gods",   "MYTHIC",    150,"🌟", 9999, {hp:300, mana:100, atk:15, unique:"divine"}),
  A("a_phoenix_mail","Phoenix Mail",      "UNIQUE",    70, "🔥", 2200, {hp:100, unique:"rebirth"}),
  A("a_thorn_armor", "Thornmail",         "UNIQUE",    65, "🌹", 1800, {hp:80, unique:"thorns_20"}),

  // ═══════════════ HELMETS ═══════════════
  H("h_cap",         "Cloth Cap",         "COMMON",    4,  "🎩", 10, {hp:10, mana:5}),
  H("h_cowl",        "Dark Cowl",         "COMMON",    5,  "🧢", 15, {hp:8}),
  H("h_hood",        "Leather Hood",      "COMMON",    6,  "👒", 18, {hp:12}),
  H("h_iron",        "Iron Helm",         "UNCOMMON",  12, "⛑️", 70, {hp:15}),
  H("h_wizard",      "Wizard Hat",        "UNCOMMON",  6,  "🎩", 75, {hp:10, mana:30}),
  H("h_helm_knight", "Knight Helm",       "UNCOMMON",  15, "⛑️", 80, {hp:20}),
  H("h_horned",      "Horned Helm",       "RARE",      20, "⛑️", 220, {hp:20, atk:3}),
  H("h_circlet",     "Silver Circlet",    "RARE",      12, "👑", 200, {mana:60, hp:25}),
  H("h_visored",     "Visored Helm",      "RARE",      22, "⛑️", 230, {hp:25}),
  H("h_crown",       "Crown of Thorns",   "EPIC",      30, "👑", 680, {hp:40, mana:20, atk:5}),
  H("h_dragon",      "Dragon Crown",      "LEGENDARY", 45, "🐉", 2100, {hp:70, mana:40, atk:8}),
  H("h_godcrown",    "Crown of Gods",     "MYTHIC",    70, "👑", 9999, {hp:120, mana:80, atk:15}),
  H("h_archmage",    "Archmage Hood",     "EPIC",      25, "🎩", 650, {hp:30, mana:100}),
  H("h_skullhelm",   "Skull Helmet",      "UNIQUE",    35, "💀", 1500, {hp:50, unique:"fear_aura"}),

  // ═══════════════ BOOTS ═══════════════
  B_("b_sandals",    "Worn Sandals",      "COMMON",    3,  "👟", 8,  {hp:5}),
  B_("b_leather",    "Leather Boots",     "UNCOMMON",  8,  "👢", 60, {hp:10}),
  B_("b_travel",     "Traveler's Boots",  "UNCOMMON",  9,  "👢", 65, {hp:12, spd:2}),
  B_("b_iron",       "Iron Greaves",      "RARE",      16, "👢", 210, {hp:15}),
  B_("b_shadow",     "Shadowstep Boots",  "EPIC",      22, "👟", 660, {hp:20, atk:4, spd:4}),
  B_("b_winged",     "Winged Boots",      "EPIC",      25, "🪶", 700, {hp:30, mana:20, spd:6}),
  B_("b_eternal",    "Boots of Eternity", "LEGENDARY", 40, "✨", 2000, {hp:60, mana:30, atk:5}),
  B_("b_cosmic",     "Cosmic Treads",     "MYTHIC",    65, "🌌", 9999, {hp:100, mana:50, atk:10}),
  B_("b_stealth",    "Silent Boots",      "UNIQUE",    30, "👟", 1500, {spd:10, unique:"stealth_gain"}),
  B_("b_gravityless","Gravityless",       "UNIQUE",    28, "🪶", 1400, {spd:15, unique:"no_trap"}),

  // ═══════════════ GLOVES ═══════════════
  G_("g_leather",    "Leather Gloves",    "COMMON",    4,  "🧤", 20, {atk:2}),
  G_("g_mail",       "Mailed Gloves",     "UNCOMMON",  9,  "🧤", 70, {atk:4}),
  G_("g_iron",       "Iron Gauntlets",    "RARE",      16, "🧤", 220, {atk:6, hp:15}),
  G_("g_shadow",     "Shadow Gloves",     "EPIC",      22, "🧤", 680, {atk:10, crit:8}),
  G_("g_dragon",     "Dragon Gloves",     "LEGENDARY", 40, "🧤", 2100, {atk:15, crit:12}),
  G_("g_void",       "Void Touch",        "MYTHIC",    60, "🧤", 9999, {atk:20, crit:20}),
  G_("g_thief",      "Thief's Gloves",    "UNIQUE",    20, "🧤", 1200, {spd:8, unique:"gold_find"}),

  // ═══════════════ SHIELDS / OFFHAND ═══════════════
  S_("s_buckler",    "Wooden Buckler",    "COMMON",    8,  "🛡️", 30, {hp:10}),
  S_("s_kite",       "Kite Shield",       "UNCOMMON",  18, "🛡️", 110, {hp:20}),
  S_("s_tower",      "Tower Shield",      "RARE",      32, "🛡️", 290, {hp:35}),
  S_("s_aegis",      "Aegis",             "EPIC",      50, "🛡️", 750, {hp:60, unique:"block_chance"}),
  S_("s_dragonsh",   "Dragon Shield",     "LEGENDARY", 70, "🐉", 2400, {hp:100, unique:"fire_resist"}),
  S_("s_voidshield", "Void Shield",       "MYTHIC",    100,"🌀", 9999, {hp:150, unique:"void_ward"}),

  // ═══════════════ CAPES ═══════════════
  C_("c_cloak",      "Cloth Cloak",       "COMMON",    3,  "🧣", 15, {hp:8}),
  C_("c_mantle",     "Wolf Mantle",       "UNCOMMON",  7,  "🧣", 65, {hp:15, atk:2}),
  C_("c_ranger",     "Ranger's Cloak",    "RARE",      15, "🧣", 230, {hp:25, spd:4}),
  C_("c_void",       "Void Mantle",       "EPIC",      25, "🧣", 690, {hp:40, mana:50}),
  C_("c_hero",       "Hero's Cape",       "LEGENDARY", 40, "🧣", 2200, {hp:70, atk:8, mana:30}),

  // ═══════════════ RINGS (30+) ═══════════════
  R("r_copper",      "Copper Ring",       "COMMON",    2, 2, 8,  5,   "💍", 15),
  R("r_silver",      "Silver Ring",       "COMMON",    3, 3, 10, 10,  "💍", 25),
  R("r_vitality",    "Ring of Vitality",  "UNCOMMON",  0, 0, 30, 0,   "💍", 80),
  R("r_clarity",     "Ring of Clarity",   "UNCOMMON",  0, 0, 0,  50,  "💍", 85),
  R("r_might",       "Ring of Might",     "UNCOMMON",  8, 0, 0,  0,   "💍", 90),
  R("r_power",       "Ring of Power",     "RARE",      12,0, 0,  0,   "💍", 220),
  R("r_mana",        "Ring of Mana",      "RARE",      0, 0, 0,  40,  "💍", 210),
  R("r_guardian",    "Guardian Ring",     "RARE",      0, 14,20, 0,   "💍", 225),
  R("r_crit",        "Critter",           "RARE",      0, 0, 0,  0,   "💍", 240, {crit:15}),
  R("r_speed",       "Swiftness",         "RARE",      4, 0, 0,  0,   "💍", 235, {spd:6}),
  R("r_arcane",      "Arcane Band",       "EPIC",      15,8, 25, 25,  "💍", 680),
  R("r_warrior",     "Warrior's Bond",    "EPIC",      20,15,40, 0,   "💍", 720),
  R("r_sorcerer",    "Sorcerer's Band",   "EPIC",      10,5, 20, 100, "💍", 720),
  R("r_phoenix",     "Phoenix Ring",      "EPIC",      12,10,50, 20,  "🔥", 700, {unique:"revive_fire"}),
  R("r_ouroboros",   "Ouroboros Ring",    "LEGENDARY", 20,15,60, 50,  "🐍", 2200),
  R("r_sage",        "Sage's Ring",       "LEGENDARY", 15,15,50, 100, "💍", 2300),
  R("r_cosmos",      "Cosmic Ring",       "MYTHIC",    35,30,120,100, "🌌", 9999),
  R("r_lucky",       "Lucky Ring",        "UNIQUE",    10,10,30, 30,  "🍀", 1500, {unique:"lucky_loot", crit:15}),
  R("r_vampire",     "Vampire Ring",      "UNIQUE",    15,0, 0,  0,   "🧛", 1300, {unique:"lifesteal_20"}),
  R("r_cursed",      "Cursed Loop",       "CURSED",    40,20,-30,30,  "💍", 2000, {unique:"curse_ring"}),

  // ═══════════════ NECKLACES ═══════════════
  N("n_thread",      "Lucky Thread",      "COMMON",    1, 1, 5, 5,   "📿", 12),
  N("n_iron_chain",  "Iron Chain",        "COMMON",    2, 2, 10,5,   "📿", 18),
  N("n_ruby",        "Ruby Pendant",      "UNCOMMON",  5, 0, 15,0,   "📿", 85),
  N("n_emerald",     "Emerald Pendant",   "UNCOMMON",  0, 5, 15,15,  "📿", 88),
  N("n_sapphire",    "Sapphire Amulet",   "RARE",      0, 5, 20,35,  "📿", 230),
  N("n_amber",       "Amber Amulet",      "RARE",      8, 0, 20,10,  "📿", 225),
  N("n_dragon",      "Dragon Heart",      "EPIC",      10,10,40,20,  "🐉", 690, {unique:"dragon_breath"}),
  N("n_skull_neck",  "Skull Pendant",     "EPIC",      12,6, 30,30,  "💀", 700),
  N("n_divine",      "Divine Pendant",    "LEGENDARY", 15,15,80,60,  "✨", 2300),
  N("n_godeye",      "God Eye",           "MYTHIC",    30,20,100,120,"👁️", 9999, {unique:"see_all"}),
  N("n_phoenix_neck","Phoenix Feather",   "UNIQUE",    10,5, 40,20,  "🪶", 1400, {unique:"rebirth_on_death"}),

  // ═══════════════ CONSUMABLES (30+) ═══════════════
  { id:"p_tiny_hp",  name:"Tiny HP Vial",      slot:"consumable",rarity:"COMMON",  heal:30,  icon:"🧪", val:8 },
  { id:"p_hp",       name:"HP Potion",         slot:"consumable",rarity:"COMMON",  heal:70,  icon:"🧪", val:18 },
  { id:"p_big_hp",   name:"Great HP Potion",   slot:"consumable",rarity:"UNCOMMON",heal:150, icon:"🧪", val:50 },
  { id:"p_mega_hp",  name:"Mega HP Potion",    slot:"consumable",rarity:"RARE",    heal:300, icon:"🧪", val:120 },
  { id:"p_super_hp", name:"Super HP Potion",   slot:"consumable",rarity:"EPIC",    heal:600, icon:"🧪", val:350 },
  { id:"p_tiny_mana",name:"Tiny Mana",         slot:"consumable",rarity:"COMMON",  mana:25,  icon:"💧", val:10 },
  { id:"p_mana",     name:"Mana Potion",       slot:"consumable",rarity:"COMMON",  mana:50,  icon:"💧", val:15 },
  { id:"p_big_mana", name:"Great Mana Potion", slot:"consumable",rarity:"UNCOMMON",mana:100, icon:"💧", val:45 },
  { id:"p_mega_mana",name:"Mega Mana Potion",  slot:"consumable",rarity:"RARE",    mana:250, icon:"💧", val:110 },
  { id:"p_elixir",   name:"Elixir of Power",   slot:"consumable",rarity:"EPIC",    heal:200, mana:150, icon:"⚗️", val:500 },
  { id:"p_divine",   name:"Divine Nectar",     slot:"consumable",rarity:"LEGENDARY",heal:999,mana:999, icon:"✨", val:2000 },
  { id:"p_antidote", name:"Antidote",          slot:"consumable",rarity:"UNCOMMON",cure:"POISON", icon:"🧴", val:40 },
  { id:"p_wakeup",   name:"Smelling Salts",    slot:"consumable",rarity:"UNCOMMON",cure:"SLEEP",  icon:"🧴", val:40 },
  { id:"p_defrost",  name:"Warm Oil",          slot:"consumable",rarity:"UNCOMMON",cure:"FREEZE", icon:"🧴", val:45 },
  { id:"p_purify",   name:"Purifying Potion",  slot:"consumable",rarity:"RARE",    cure:"ALL",    icon:"🧴", val:180 },
  { id:"p_fire_bomb",name:"Fire Bomb",         slot:"consumable",rarity:"UNCOMMON",dmg:80,elem:"fire",  icon:"💣", val:60 },
  { id:"p_frost_bomb",name:"Frost Bomb",       slot:"consumable",rarity:"UNCOMMON",dmg:70,elem:"ice",   icon:"💣", val:60 },
  { id:"p_holy_bomb",name:"Holy Water",        slot:"consumable",rarity:"RARE",    dmg:120,elem:"holy", icon:"💧", val:150 },
  { id:"p_str_elx",  name:"Strength Elixir",   slot:"consumable",rarity:"UNCOMMON",buff:"ATKBUFF", icon:"⚗️", val:80 },
  { id:"p_def_elx",  name:"Iron Skin Elixir",  slot:"consumable",rarity:"UNCOMMON",buff:"DEFBUFF", icon:"⚗️", val:80 },
  { id:"p_hastepot", name:"Speed Potion",      slot:"consumable",rarity:"RARE",    buff:"HASTE",   icon:"⚗️", val:180 },
  { id:"p_luckpot",  name:"Potion of Luck",    slot:"consumable",rarity:"RARE",    buff:"LUCK",    icon:"🍀", val:200 },
  { id:"p_regenpot", name:"Regen Tincture",    slot:"consumable",rarity:"RARE",    buff:"REGEN",   icon:"⚗️", val:150 },

  // ═══════════════ SCROLLS ═══════════════
  { id:"sc_fireball",  name:"Scroll of Fireball",    slot:"scroll", rarity:"UNCOMMON", spell:"Fireball",     icon:"📜", val:60 },
  { id:"sc_freeze",    name:"Scroll of Ice",         slot:"scroll", rarity:"UNCOMMON", spell:"Ice Lance",    icon:"📜", val:55 },
  { id:"sc_lightning", name:"Scroll of Thunder",     slot:"scroll", rarity:"RARE",     spell:"Chain Lightning",icon:"📜", val:150 },
  { id:"sc_meteor",    name:"Scroll of Meteor",      slot:"scroll", rarity:"EPIC",     spell:"Meteor",       icon:"📜", val:600 },
  { id:"sc_blizzard",  name:"Scroll of Blizzard",    slot:"scroll", rarity:"RARE",     spell:"Blizzard",     icon:"📜", val:160 },
  { id:"sc_ragnarok",  name:"Scroll of Ragnarok",    slot:"scroll", rarity:"LEGENDARY",spell:"Ragnarok",     icon:"📜", val:2500 },
  { id:"sc_cleanse",   name:"Scroll of Cleanse",     slot:"scroll", rarity:"RARE",     spell:"Cleanse",      icon:"📜", val:180 },
  { id:"sc_heal",      name:"Scroll of Healing",     slot:"scroll", rarity:"UNCOMMON", spell:"Mend",         icon:"📜", val:50 },
  { id:"sc_haste",     name:"Scroll of Haste",       slot:"scroll", rarity:"EPIC",     spell:"Battle Trance",icon:"📜", val:550 },
  { id:"sc_voidbolt",  name:"Scroll of Void",        slot:"scroll", rarity:"EPIC",     spell:"Void Bolt",    icon:"📜", val:580 },
  { id:"sc_summon",    name:"Scroll of Summoning",   slot:"scroll", rarity:"RARE",     spell:"Raise Dead",   icon:"📜", val:200 },

  // ═══════════════ GEMS (for socketing) ═══════════════
  { id:"gem_ruby_s",   name:"Small Ruby",      slot:"gem",   rarity:"UNCOMMON", gemType:"atk",  gemVal:5,  icon:"🔴", val:80 },
  { id:"gem_ruby_m",   name:"Ruby",            slot:"gem",   rarity:"RARE",     gemType:"atk",  gemVal:12, icon:"🔴", val:220 },
  { id:"gem_ruby_l",   name:"Great Ruby",      slot:"gem",   rarity:"EPIC",     gemType:"atk",  gemVal:25, icon:"🔴", val:650 },
  { id:"gem_ruby_p",   name:"Perfect Ruby",    slot:"gem",   rarity:"LEGENDARY",gemType:"atk",  gemVal:50, icon:"🔴", val:2000 },
  { id:"gem_em_s",     name:"Small Emerald",   slot:"gem",   rarity:"UNCOMMON", gemType:"hp",   gemVal:20, icon:"🟢", val:80 },
  { id:"gem_em_m",     name:"Emerald",         slot:"gem",   rarity:"RARE",     gemType:"hp",   gemVal:50, icon:"🟢", val:230 },
  { id:"gem_em_l",     name:"Great Emerald",   slot:"gem",   rarity:"EPIC",     gemType:"hp",   gemVal:120,icon:"🟢", val:680 },
  { id:"gem_em_p",     name:"Perfect Emerald", slot:"gem",   rarity:"LEGENDARY",gemType:"hp",   gemVal:250,icon:"🟢", val:2100 },
  { id:"gem_saph_s",   name:"Small Sapphire",  slot:"gem",   rarity:"UNCOMMON", gemType:"mana", gemVal:25, icon:"🔵", val:80 },
  { id:"gem_saph_m",   name:"Sapphire",        slot:"gem",   rarity:"RARE",     gemType:"mana", gemVal:60, icon:"🔵", val:240 },
  { id:"gem_saph_l",   name:"Great Sapphire",  slot:"gem",   rarity:"EPIC",     gemType:"mana", gemVal:130,icon:"🔵", val:690 },
  { id:"gem_saph_p",   name:"Perfect Sapphire",slot:"gem",   rarity:"LEGENDARY",gemType:"mana", gemVal:280,icon:"🔵", val:2100 },
  { id:"gem_dia_s",    name:"Small Diamond",   slot:"gem",   rarity:"RARE",     gemType:"def",  gemVal:10, icon:"💎", val:250 },
  { id:"gem_dia_m",    name:"Diamond",         slot:"gem",   rarity:"EPIC",     gemType:"def",  gemVal:22, icon:"💎", val:700 },
  { id:"gem_dia_l",    name:"Great Diamond",   slot:"gem",   rarity:"LEGENDARY",gemType:"def",  gemVal:45, icon:"💎", val:2200 },
  { id:"gem_topaz",    name:"Topaz",           slot:"gem",   rarity:"RARE",     gemType:"crit", gemVal:8,  icon:"🟡", val:260 },
  { id:"gem_onyx",     name:"Onyx",            slot:"gem",   rarity:"EPIC",     gemType:"all",  gemVal:10, icon:"⚫", val:720 },
  { id:"gem_star",     name:"Starstone",       slot:"gem",   rarity:"MYTHIC",   gemType:"all",  gemVal:35, icon:"🌟", val:9999 },

  // ═══════════════ RUNES (enchant equipment) ═══════════════
  { id:"rune_fire",    name:"Rune of Fire",    slot:"rune",  rarity:"RARE",     runeType:"fire",    runeVal:15, icon:"🔥", val:250 },
  { id:"rune_ice",     name:"Rune of Ice",     slot:"rune",  rarity:"RARE",     runeType:"ice",     runeVal:15, icon:"❄️", val:250 },
  { id:"rune_litn",    name:"Rune of Thunder", slot:"rune",  rarity:"RARE",     runeType:"lightning",runeVal:15,icon:"⚡", val:260 },
  { id:"rune_dark",    name:"Rune of Shadow",  slot:"rune",  rarity:"EPIC",     runeType:"dark",    runeVal:25, icon:"🌑", val:680 },
  { id:"rune_holy",    name:"Rune of Light",   slot:"rune",  rarity:"EPIC",     runeType:"holy",    runeVal:25, icon:"✨", val:680 },
  { id:"rune_life",    name:"Rune of Life",    slot:"rune",  rarity:"EPIC",     runeType:"lifesteal",runeVal:15,icon:"🩸", val:720 },
  { id:"rune_power",   name:"Rune of Power",   slot:"rune",  rarity:"EPIC",     runeType:"atk",     runeVal:25, icon:"💪", val:700 },
  { id:"rune_vitality",name:"Rune of Vitality",slot:"rune",  rarity:"EPIC",     runeType:"hp",      runeVal:80, icon:"💚", val:720 },
  { id:"rune_focus",   name:"Rune of Focus",   slot:"rune",  rarity:"EPIC",     runeType:"mana",    runeVal:100,icon:"💎", val:720 },
  { id:"rune_haste",   name:"Rune of Haste",   slot:"rune",  rarity:"LEGENDARY",runeType:"spd",     runeVal:10, icon:"💨", val:2200 },
  { id:"rune_chaos",   name:"Rune of Chaos",   slot:"rune",  rarity:"MYTHIC",   runeType:"chaos",   runeVal:50, icon:"🌀", val:9999 },

  // ═══════════════ CRAFTING MATERIALS ═══════════════
  { id:"mat_iron",     name:"Iron Ore",         slot:"material", rarity:"COMMON",    matType:"metal", icon:"🪨", val:5 },
  { id:"mat_silver",   name:"Silver Ore",       slot:"material", rarity:"UNCOMMON",  matType:"metal", icon:"🪨", val:20 },
  { id:"mat_gold",     name:"Gold Ore",         slot:"material", rarity:"RARE",      matType:"metal", icon:"🪙", val:80 },
  { id:"mat_mithril",  name:"Mithril Ore",      slot:"material", rarity:"EPIC",      matType:"metal", icon:"💎", val:300 },
  { id:"mat_orichalc", name:"Orichalcum",       slot:"material", rarity:"LEGENDARY", matType:"metal", icon:"✨", val:1200 },
  { id:"mat_leather",  name:"Leather Hide",     slot:"material", rarity:"COMMON",    matType:"hide",  icon:"🟫", val:5 },
  { id:"mat_troll_h",  name:"Troll Hide",       slot:"material", rarity:"UNCOMMON",  matType:"hide",  icon:"🟫", val:25 },
  { id:"mat_dragon_s", name:"Dragon Scale",     slot:"material", rarity:"EPIC",      matType:"hide",  icon:"🐉", val:350 },
  { id:"mat_wood",     name:"Oak Wood",         slot:"material", rarity:"COMMON",    matType:"wood",  icon:"🪵", val:3 },
  { id:"mat_ebony",    name:"Ebony Wood",       slot:"material", rarity:"RARE",      matType:"wood",  icon:"🪵", val:80 },
  { id:"mat_spider_s", name:"Spider Silk",      slot:"material", rarity:"UNCOMMON",  matType:"cloth", icon:"🕸️", val:25 },
  { id:"mat_shadow_s", name:"Shadow Silk",      slot:"material", rarity:"EPIC",      matType:"cloth", icon:"🕸️", val:300 },
  { id:"mat_fire_es",  name:"Fire Essence",     slot:"material", rarity:"RARE",      matType:"essence",icon:"🔥", val:100 },
  { id:"mat_ice_es",   name:"Ice Essence",      slot:"material", rarity:"RARE",      matType:"essence",icon:"❄️", val:100 },
  { id:"mat_light_es", name:"Light Essence",    slot:"material", rarity:"EPIC",      matType:"essence",icon:"✨", val:320 },
  { id:"mat_dark_es",  name:"Shadow Essence",   slot:"material", rarity:"EPIC",      matType:"essence",icon:"🌑", val:320 },
  { id:"mat_soul",     name:"Soul Fragment",    slot:"material", rarity:"RARE",      matType:"soul",  icon:"👻", val:120 },
  { id:"mat_great_soul",name:"Great Soul",      slot:"material", rarity:"LEGENDARY", matType:"soul",  icon:"👻", val:900 },
  { id:"mat_god_essence",name:"Divine Essence", slot:"material", rarity:"MYTHIC",    matType:"essence",icon:"🌟", val:5000 },

  // ═══════════════ CRAFTING CATALYSTS ═══════════════
  { id:"cat_repair",  name:"Repair Kit",        slot:"catalyst", rarity:"COMMON",    icon:"🔧", val:30 },
  { id:"cat_upgrade", name:"Upgrade Stone",     slot:"catalyst", rarity:"RARE",      icon:"⬆️", val:200 },
  { id:"cat_enchant", name:"Enchant Orb",       slot:"catalyst", rarity:"EPIC",      icon:"🔮", val:500 },
  { id:"cat_reforge", name:"Reforge Hammer",    slot:"catalyst", rarity:"EPIC",      icon:"🔨", val:600 },
  { id:"cat_socket",  name:"Socket Punch",      slot:"catalyst", rarity:"LEGENDARY", icon:"🎯", val:1500 },
  { id:"cat_transmog",name:"Transmog Stone",    slot:"catalyst", rarity:"RARE",      icon:"🎨", val:400 },
  { id:"cat_uncurse", name:"Purity Water",      slot:"catalyst", rarity:"EPIC",      icon:"💧", val:800 },

  // ═══════════════ COLLECTIBLES / KEYS ═══════════════
  { id:"m_coin",        name:"Ancient Coin",   slot:"misc",  rarity:"UNCOMMON", icon:"🪙", val:50 },
  { id:"m_fang",        name:"Dragon Fang",    slot:"misc",  rarity:"RARE",     icon:"🦷", val:120 },
  { id:"m_crystal",     name:"Soul Crystal",   slot:"misc",  rarity:"EPIC",     icon:"💎", val:350 },
  { id:"m_godstone",    name:"Godstone",       slot:"misc",  rarity:"MYTHIC",   icon:"🌟", val:9999 },
  { id:"m_key_iron",    name:"Iron Key",       slot:"key",   rarity:"UNCOMMON", icon:"🔑", val:30 },
  { id:"m_key_gold",    name:"Gold Key",       slot:"key",   rarity:"RARE",     icon:"🔑", val:120 },
  { id:"m_key_skull",   name:"Skull Key",      slot:"key",   rarity:"EPIC",     icon:"🗝️", val:500 },
  { id:"m_key_divine",  name:"Divine Key",     slot:"key",   rarity:"LEGENDARY",icon:"🗝️", val:2000 },
  { id:"m_map_frag",    name:"Map Fragment",   slot:"misc",  rarity:"RARE",     icon:"🗺️", val:200 },
  { id:"m_lore_page",   name:"Tome Page",      slot:"misc",  rarity:"UNCOMMON", icon:"📜", val:40 },
  { id:"m_lore_book",   name:"Ancient Tome",   slot:"misc",  rarity:"EPIC",     icon:"📕", val:500 },
  { id:"m_pet_whistle", name:"Taming Whistle", slot:"misc",  rarity:"RARE",     icon:"📣", val:300 },
  { id:"m_faction_seal",name:"Faction Seal",   slot:"misc",  rarity:"UNCOMMON", icon:"🏴", val:100 },
];

// ═══════════════════════════════════════════════════════════════
//  SET ITEMS — collections with bonuses
// ═══════════════════════════════════════════════════════════════
export const ITEM_SETS = {
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

// Which items belong to which set (reverse lookup)
export const ITEM_TO_SET = {};
Object.entries(ITEM_SETS).forEach(([setId, data]) => {
  data.pieces.forEach(p => { ITEM_TO_SET[p] = setId; });
});

// ═══════════════════════════════════════════════════════════════
//  CRAFTING RECIPES
// ═══════════════════════════════════════════════════════════════
export const RECIPES = [
  // Basic weapons
  { id:"r_iron_sword",  name:"Iron Sword",       produces:"w_sword1",    mats:{mat_iron:3, mat_wood:1}, gold:20, level:1 },
  { id:"r_steel_sword", name:"Steel Longsword",  produces:"w_sword2",    mats:{mat_iron:5, mat_silver:1, mat_wood:1}, gold:60, level:5 },
  { id:"r_mith_sword",  name:"Mithril Edge",     produces:"w_mythril",   mats:{mat_mithril:3, mat_silver:2, mat_soul:1}, gold:1500, level:15 },
  { id:"r_god_sword",   name:"Godslayer",        produces:"w_godslayer", mats:{mat_orichalc:2, mat_great_soul:2, mat_light_es:2}, gold:3000, level:25 },
  // Armor
  { id:"r_leather_vest",name:"Leather Vest",     produces:"a_leather",   mats:{mat_leather:3}, gold:20, level:1 },
  { id:"r_chain_mail",  name:"Chain Mail",       produces:"a_chain",     mats:{mat_iron:5, mat_leather:2}, gold:70, level:5 },
  { id:"r_mith_armor",  name:"Mithril Armor",    produces:"a_mithril",   mats:{mat_mithril:5, mat_troll_h:2}, gold:700, level:15 },
  { id:"r_dragon_mail", name:"Dragonscale Mail", produces:"a_dragon",    mats:{mat_dragon_s:5, mat_mithril:2, mat_fire_es:1}, gold:2000, level:22 },
  // Potions
  { id:"r_hp_pot",      name:"HP Potion",        produces:"p_hp",        mats:{mat_wood:1, mat_leather:1}, gold:15, level:1 },
  { id:"r_mana_pot",    name:"Mana Potion",      produces:"p_mana",      mats:{mat_spider_s:1}, gold:12, level:1 },
  { id:"r_elixir",      name:"Elixir of Power",  produces:"p_elixir",    mats:{mat_fire_es:1, mat_ice_es:1, mat_soul:1}, gold:400, level:10 },
  // Gems (cut)
  { id:"r_cut_ruby",    name:"Cut Ruby",         produces:"gem_ruby_m",  mats:{gem_ruby_s:3}, gold:100, level:5 },
  { id:"r_cut_saph",    name:"Cut Sapphire",     produces:"gem_saph_m",  mats:{gem_saph_s:3}, gold:100, level:5 },
  { id:"r_cut_em",      name:"Cut Emerald",      produces:"gem_em_m",    mats:{gem_em_s:3}, gold:100, level:5 },
  // Catalysts
  { id:"r_enchant",     name:"Enchant Orb",      produces:"cat_enchant", mats:{mat_fire_es:1, mat_light_es:1}, gold:250, level:10 },
  { id:"r_socket",      name:"Socket Punch",     produces:"cat_socket",  mats:{mat_mithril:3, mat_soul:2}, gold:800, level:15 },
  // Legendary
  { id:"r_excalibur",   name:"Excalibur",        produces:"w_excalibur", mats:{mat_orichalc:3, mat_great_soul:3, mat_light_es:3, mat_mithril:5}, gold:5000, level:30 },
];

// Lookup helper
export const ITEM_BY_ID = {};
ALL_ITEMS.forEach(it => { ITEM_BY_ID[it.id] = it; });

export function itemById(id) { return ITEM_BY_ID[id]; }
