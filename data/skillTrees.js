// ═══════════════════════════════════════════════════════════════
//  SKILL TREES — ~40 nodes per class (~320 total nodes)
//  Each node: { id, name, desc, tier, branch, cost, grants }
//  grants: { stat?, spell?, passive?, mult? }
// ═══════════════════════════════════════════════════════════════

// Helper to build tree nodes quickly
const node = (id, name, desc, tier, branch, grants, cost=1) => ({ id, name, desc, tier, branch, grants, cost });

export const SKILL_TREES = {
  // ═══════════════ WARRIOR ═══════════════
  WARRIOR: [
    // Tier 1 — foundations
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
    // Capstones
    node("w_cap_off", "Blade Mastery",    "+30% ATK when above 50% HP", 5, "offense", { passive:"blade_mastery" }),
    node("w_cap_def", "Aegis Lord",       "Halves all damage below 30% HP", 5, "defense", { passive:"aegis_lord" }),
    node("w_cap_bal", "Warlord's Will",   "+15 to all stats", 5, "utility", { stat:{atk:15,def:15,hp:60,mana:30,crit:10} }),
  ],
  // ═══════════════ MAGE ═══════════════
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
  // ═══════════════ ROGUE ═══════════════
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
  // ═══════════════ PALADIN ═══════════════
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
  // ═══════════════ NECROMANCER ═══════════════
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
  // ═══════════════ BERSERKER ═══════════════
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
  // ═══════════════ RANGER ═══════════════
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
  // ═══════════════ SORCERER ═══════════════
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

// ── Skill tree helpers ──
export function getAvailableNodes(cls, unlocked = []) {
  const tree = SKILL_TREES[cls] || [];
  return tree.filter(n => !unlocked.includes(n.id));
}

export function getUnlockedNodes(cls, unlocked = []) {
  const tree = SKILL_TREES[cls] || [];
  return tree.filter(n => unlocked.includes(n.id));
}

// Aggregate all grants from unlocked nodes
export function aggregateGrants(cls, unlocked = []) {
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
