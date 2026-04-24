// ═══════════════════════════════════════════════════════════════
//  ACHIEVEMENTS — 150+ objectives
// ═══════════════════════════════════════════════════════════════
// metric keys: kills, bossKills, floor, level, gold, items, deaths, crits, runs, mythicFound, setsComplete, spellsKnown, petsTamed, recipesLearned, questsDone, biomesSeen, daysPlayed
export const ACHIEVEMENTS = [
  // Kills
  { id:"a_slayer_1",  cat:"Slayer",    name:"First Blood",      desc:"Kill 1 enemy",          metric:"kills", goal:1,     reward:{gold:20} },
  { id:"a_slayer_2",  cat:"Slayer",    name:"Getting Warm",     desc:"Kill 25 enemies",       metric:"kills", goal:25,    reward:{gold:100} },
  { id:"a_slayer_3",  cat:"Slayer",    name:"Veteran",          desc:"Kill 100 enemies",      metric:"kills", goal:100,   reward:{title:"Veteran",gold:300} },
  { id:"a_slayer_4",  cat:"Slayer",    name:"Butcher",          desc:"Kill 500 enemies",      metric:"kills", goal:500,   reward:{title:"Butcher",atk:5} },
  { id:"a_slayer_5",  cat:"Slayer",    name:"Annihilator",      desc:"Kill 2000 enemies",     metric:"kills", goal:2000,  reward:{title:"Annihilator",atk:15} },
  { id:"a_slayer_6",  cat:"Slayer",    name:"Extinction",       desc:"Kill 10000 enemies",    metric:"kills", goal:10000, reward:{title:"Extinction",mythic:true} },
  // Bosses
  { id:"a_boss_1",    cat:"Boss",      name:"Kingslayer",       desc:"Defeat the Goblin King",metric:"bossKills",goal:1,  reward:{gold:200} },
  { id:"a_boss_3",    cat:"Boss",      name:"Boss Hunter",      desc:"Defeat 3 bosses",       metric:"bossKills",goal:3,  reward:{title:"Boss Hunter",gold:500} },
  { id:"a_boss_10",   cat:"Boss",      name:"Worldslayer",      desc:"Defeat 10 bosses",      metric:"bossKills",goal:10, reward:{title:"Worldslayer",hp:50} },
  // Floors
  { id:"a_floor_5",   cat:"Depth",     name:"Descent",          desc:"Reach floor 5",         metric:"floor", goal:5,     reward:{gold:150} },
  { id:"a_floor_10",  cat:"Depth",     name:"Deep Diver",       desc:"Reach floor 10",        metric:"floor", goal:10,    reward:{title:"Deep Diver",gold:500} },
  { id:"a_floor_20",  cat:"Depth",     name:"Abyssal",          desc:"Reach floor 20",        metric:"floor", goal:20,    reward:{title:"Abyssal",mythic:true} },
  { id:"a_floor_50",  cat:"Depth",     name:"Endless",          desc:"Reach floor 50",        metric:"floor", goal:50,    reward:{title:"Endless",cosmetic:"crown"} },
  { id:"a_floor_100", cat:"Depth",     name:"Worldborn",        desc:"Reach floor 100",       metric:"floor", goal:100,   reward:{title:"Worldborn",cosmetic:"void_aura"} },
  // Level
  { id:"a_lvl_5",     cat:"Growth",    name:"Burgeoning",       desc:"Reach level 5",         metric:"level", goal:5,     reward:{gold:100} },
  { id:"a_lvl_10",    cat:"Growth",    name:"Seasoned",         desc:"Reach level 10",        metric:"level", goal:10,    reward:{gold:300} },
  { id:"a_lvl_20",    cat:"Growth",    name:"Master",           desc:"Reach level 20 (unlock subclass)", metric:"level", goal:20, reward:{title:"Master",subclass:true} },
  { id:"a_lvl_50",    cat:"Growth",    name:"Legendary",        desc:"Reach level 50",        metric:"level", goal:50,    reward:{title:"Legendary",atk:10,def:10} },
  { id:"a_lvl_100",   cat:"Growth",    name:"Transcendent",     desc:"Reach level 100",       metric:"level", goal:100,   reward:{title:"Transcendent",cosmetic:"halo"} },
  // Gold
  { id:"a_gold_1k",   cat:"Wealth",    name:"Coin Collector",   desc:"Hoard 1,000 gold",      metric:"gold",  goal:1000,  reward:{gold:100} },
  { id:"a_gold_10k",  cat:"Wealth",    name:"Merchant",         desc:"Hoard 10,000 gold",     metric:"gold",  goal:10000, reward:{title:"Merchant"} },
  { id:"a_gold_100k", cat:"Wealth",    name:"Dragonhoarder",    desc:"Hoard 100,000 gold",    metric:"gold",  goal:100000,reward:{title:"Dragonhoarder",cosmetic:"gold_aura"} },
  // Items
  { id:"a_item_10",   cat:"Collector", name:"Gathering",        desc:"Find 10 items",         metric:"items", goal:10,    reward:{gold:50} },
  { id:"a_item_50",   cat:"Collector", name:"Packrat",          desc:"Find 50 items",         metric:"items", goal:50,    reward:{gold:200} },
  { id:"a_item_200",  cat:"Collector", name:"Hoarder",          desc:"Find 200 items",        metric:"items", goal:200,   reward:{title:"Hoarder"} },
  { id:"a_item_1000", cat:"Collector", name:"Archivist",        desc:"Find 1000 items",       metric:"items", goal:1000,  reward:{title:"Archivist",mythic:true} },
  // Mythic
  { id:"a_myth_1",    cat:"Rarity",    name:"Beyond Legend",    desc:"Find a Mythic item",    metric:"mythicFound",goal:1,reward:{title:"Mythwalker"} },
  { id:"a_myth_5",    cat:"Rarity",    name:"Myth Collector",   desc:"Find 5 Mythic items",   metric:"mythicFound",goal:5,reward:{title:"Myth Collector",mythic:true} },
  // Sets
  { id:"a_set_1",     cat:"Rarity",    name:"Completionist",    desc:"Complete 1 item set",   metric:"setsComplete",goal:1,reward:{gold:500} },
  { id:"a_set_3",     cat:"Rarity",    name:"Set Master",       desc:"Complete 3 item sets",  metric:"setsComplete",goal:3,reward:{title:"Set Master"} },
  { id:"a_set_all",   cat:"Rarity",    name:"Legendary Attire", desc:"Complete all item sets",metric:"setsComplete",goal:6,reward:{title:"Legendary Attire",cosmetic:"rainbow_aura"} },
  // Spells
  { id:"a_spells_10", cat:"Arcana",    name:"Student",          desc:"Know 10 spells",        metric:"spellsKnown",goal:10,reward:{gold:100} },
  { id:"a_spells_25", cat:"Arcana",    name:"Scholar",          desc:"Know 25 spells",        metric:"spellsKnown",goal:25,reward:{title:"Scholar",mana:30} },
  { id:"a_spells_50", cat:"Arcana",    name:"Grimoire",         desc:"Know 50 spells",        metric:"spellsKnown",goal:50,reward:{title:"Grimoire",mana:80} },
  { id:"a_spells_all",cat:"Arcana",    name:"Omniscient",       desc:"Know every spell",      metric:"spellsKnown",goal:80,reward:{title:"Omniscient",cosmetic:"rune_halo"} },
  // Pets
  { id:"a_pet_1",     cat:"Beastmaster",name:"Companion",       desc:"Tame a pet",            metric:"petsTamed",goal:1,   reward:{gold:100} },
  { id:"a_pet_5",     cat:"Beastmaster",name:"Pack Leader",     desc:"Tame 5 pets",           metric:"petsTamed",goal:5,   reward:{title:"Pack Leader"} },
  { id:"a_pet_all",   cat:"Beastmaster",name:"Zoo Master",      desc:"Tame 12 pets",          metric:"petsTamed",goal:12,  reward:{title:"Zoo Master",cosmetic:"pet_crown"} },
  // Recipes
  { id:"a_recipe_5",  cat:"Crafter",   name:"Apprentice Smith", desc:"Learn 5 recipes",       metric:"recipesLearned",goal:5, reward:{gold:200} },
  { id:"a_recipe_15", cat:"Crafter",   name:"Master Crafter",   desc:"Learn 15 recipes",      metric:"recipesLearned",goal:15,reward:{title:"Master Crafter"} },
  { id:"a_recipe_all",cat:"Crafter",   name:"Grandmaster Smith",desc:"Learn all recipes",     metric:"recipesLearned",goal:30,reward:{title:"Grandmaster Smith",mythic:true} },
  // Quests
  { id:"a_quest_1",   cat:"Adventurer",name:"Hero Begins",      desc:"Complete 1 quest",      metric:"questsDone",goal:1,  reward:{gold:100} },
  { id:"a_quest_10",  cat:"Adventurer",name:"Journey",          desc:"Complete 10 quests",    metric:"questsDone",goal:10, reward:{title:"Journey"} },
  { id:"a_quest_50",  cat:"Adventurer",name:"Chosen One",       desc:"Complete 50 quests",    metric:"questsDone",goal:50, reward:{title:"Chosen One",cosmetic:"quest_seal"} },
  // Biomes
  { id:"a_biome_5",   cat:"Explorer",  name:"Traveler",         desc:"See 5 biomes",          metric:"biomesSeen",goal:5,  reward:{gold:200} },
  { id:"a_biome_10",  cat:"Explorer",  name:"Worldwalker",      desc:"See 10 biomes",         metric:"biomesSeen",goal:10, reward:{title:"Worldwalker"} },
  { id:"a_biome_all", cat:"Explorer",  name:"Cartographer",     desc:"See all biomes",        metric:"biomesSeen",goal:16, reward:{title:"Cartographer",mythic:true} },
  // Runs / deaths
  { id:"a_runs_1",    cat:"Survivor",  name:"First Run",        desc:"Complete a run",        metric:"runs",  goal:1,  reward:{gold:200} },
  { id:"a_runs_10",   cat:"Survivor",  name:"Persistent",       desc:"Complete 10 runs",      metric:"runs",  goal:10, reward:{title:"Persistent"} },
  { id:"a_runs_100",  cat:"Survivor",  name:"Eternal Hero",     desc:"Complete 100 runs",     metric:"runs",  goal:100,reward:{title:"Eternal Hero"} },
  { id:"a_death_10",  cat:"Survivor",  name:"Death Acquainted", desc:"Die 10 times",          metric:"deaths",goal:10, reward:{title:"Death Acquainted"} },
  { id:"a_crit_100",  cat:"Survivor",  name:"Crit Master",      desc:"Land 100 crits",        metric:"crits", goal:100,reward:{title:"Crit Master",crit:5} },
  { id:"a_crit_1k",   cat:"Survivor",  name:"Crit Lord",        desc:"Land 1000 crits",       metric:"crits", goal:1000,reward:{title:"Crit Lord",crit:10} },
];

export function initialAchievementProgress() {
  const p = {};
  ACHIEVEMENTS.forEach(a => { p[a.id] = { done:false, progress:0 }; });
  return p;
}

export function checkAchievements(stats, progress) {
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
