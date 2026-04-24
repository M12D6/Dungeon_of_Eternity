// ═══════════════════════════════════════════════════════════════
//  QUESTS — templates + daily/weekly challenges + events
// ═══════════════════════════════════════════════════════════════
export const QUEST_TEMPLATES = [
  // Kill quests
  { id:"q_kill_goblins", type:"kill", enemyId:"goblin", count:8,
    name:"Greenskin Menace", desc:"Slay {count} goblins in the dungeon",
    reward:{gold:200,exp:150,rep:{IRONHOLD:30}} },
  { id:"q_kill_undead",  type:"kill", tag:"undead", count:12,
    name:"Restless Dead", desc:"Slay {count} undead",
    reward:{gold:400,exp:300,rep:{CELESTIAL_HOST:40}} },
  { id:"q_kill_boss",    type:"boss", count:1,
    name:"Hero's Trial", desc:"Defeat any boss",
    reward:{gold:600,exp:500,item:"m_crystal"} },
  { id:"q_kill_big",     type:"kill", count:30,
    name:"Monster Cull", desc:"Slay any {count} enemies",
    reward:{gold:300,exp:200} },
  // Floor quests
  { id:"q_descend_5",    type:"floor", count:5,
    name:"The Descent", desc:"Reach floor {count}",
    reward:{gold:500,exp:400} },
  { id:"q_descend_10",   type:"floor", count:10,
    name:"Deeper Still", desc:"Reach floor {count}",
    reward:{gold:1000,exp:800,item:"m_fang"} },
  // Gather quests
  { id:"q_gather_iron",  type:"gather", itemId:"mat_iron", count:10,
    name:"Ironmonger", desc:"Gather {count} Iron Ore",
    reward:{gold:150,rep:{IRONHOLD:20}} },
  { id:"q_gather_soul",  type:"gather", itemId:"mat_soul", count:3,
    name:"Soul Harvest", desc:"Gather {count} Soul Shards",
    reward:{gold:500,rep:{BONEMARROW:40}} },
  { id:"q_gather_gem",   type:"gather", itemId:"gem_ruby_s", count:5,
    name:"Gemhunter", desc:"Gather {count} rubies",
    reward:{gold:400,item:"gem_ruby_m"} },
  // Clear quests
  { id:"q_clear_chests", type:"chest", count:5,
    name:"Treasure Hunter", desc:"Open {count} chests",
    reward:{gold:200,exp:100} },
  { id:"q_crit_streak",  type:"crit", count:20,
    name:"Deadly Precision", desc:"Land {count} critical strikes",
    reward:{gold:300,exp:200,rep:{SHADOWVEIL:30}} },
  // Boss specific
  { id:"q_goblin_king",  type:"boss", enemyId:"boss_goblin_king", count:1,
    name:"Crown of the Greenskin", desc:"Slay the Goblin King",
    reward:{gold:800,exp:600,item:"m_ring"} },
  { id:"q_dragon",       type:"boss", enemyId:"boss_ancient", count:1,
    name:"Dragonslayer", desc:"Slay the Ancient Dragon",
    reward:{gold:3000,exp:2000,item:"m_fang",title:"Dragonslayer"} },
];

// Daily/weekly challenges rotate
export const DAILY_CHALLENGES = [
  { id:"d_speed",    name:"Speed Runner", desc:"Clear 5 floors in one run", metric:"floorsCleared", goal:5,  reward:{gold:500,exp:300} },
  { id:"d_pacifist", name:"Pacifist",     desc:"Clear a floor without killing",metric:"peacefulFloors", goal:1, reward:{gold:600,rep:{CELESTIAL_HOST:50}} },
  { id:"d_glass",    name:"Glass Cannon", desc:"Deal 1000+ dmg in one hit",    metric:"biggestHit", goal:1000, reward:{gold:700,exp:400} },
  { id:"d_mythic",   name:"Lucky Soul",   desc:"Find a mythic in a single run",metric:"mythicThisRun", goal:1, reward:{gold:1500,item:"m_godstone"} },
  { id:"d_combo",    name:"Comboer",      desc:"Chain 10 spells without miss", metric:"spellChain", goal:10, reward:{gold:800} },
];

export const WEEKLY_CHALLENGES = [
  { id:"w_kills",    name:"Weekly Slayer",    desc:"Kill 300 enemies this week",   metric:"weeklyKills", goal:300, reward:{gold:5000,exp:3000,item:"m_coin"} },
  { id:"w_floor",    name:"Weekly Explorer",  desc:"Reach floor 25 in one run",    metric:"weeklyFloor", goal:25,  reward:{gold:8000,title:"Weekly Explorer"} },
  { id:"w_bosses",   name:"Weekly Boss Run",  desc:"Defeat 10 bosses this week",   metric:"weeklyBosses",goal:10,  reward:{gold:10000,item:"m_fang"} },
  { id:"w_craft",    name:"Weekly Artisan",   desc:"Craft 20 items this week",     metric:"weeklyCrafts",goal:20,  reward:{gold:6000,title:"Artisan"} },
];

// Seasonal events — rotating world modifiers
export const EVENTS = [
  { id:"e_harvest",    name:"Harvest Festival", icon:"🎃",
    desc:"Pumpkin enemies drop extra gold; special boss: Great Pumpkin King!",
    bonuses:{goldBonus:1.5,expBonus:1.2}, uniqueBoss:"boss_pumpkin", durationHours:72 },
  { id:"e_winter",     name:"Winterveil",       icon:"❄️",
    desc:"All enemies wear red hats; Frost damage +50%; Santa chest drops.",
    bonuses:{iceDmg:1.5,xmasDrops:true}, durationHours:96 },
  { id:"e_bloodmoon",  name:"Blood Moon Rises", icon:"🌕",
    desc:"Enemies are aggressive and strong, but drops are doubled.",
    bonuses:{enemyHp:1.3,enemyAtk:1.3,lootBonus:2.0}, durationHours:24 },
  { id:"e_arcane",     name:"Arcane Convergence",icon:"🔮",
    desc:"All spells cost half mana; rare scrolls everywhere.",
    bonuses:{manaCost:0.5,scrollBonus:3.0}, durationHours:48 },
  { id:"e_chaos",      name:"Chaos Incursion",  icon:"🌀",
    desc:"Random status effects apply constantly; rare demon loot.",
    bonuses:{chaosMode:true,demonLoot:true}, durationHours:48 },
  { id:"e_unity",      name:"Unity Festival",   icon:"🎊",
    desc:"All factions give 2x reputation. Special vendor unlocked.",
    bonuses:{repMult:2.0}, durationHours:96 },
];

export function rollQuests(floor, count = 3) {
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

export function formatQuest(q) {
  return {
    ...q,
    desc: (q.desc || "").replace("{count}", q.count),
  };
}
