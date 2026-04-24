// ═══════════════════════════════════════════════════════════════
//  HOUSING — Hero's Rest base building
// ═══════════════════════════════════════════════════════════════
export const HOUSING_UPGRADES = [
  // Core rooms
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
  { id:"h_menagerie",     name:"Menagerie",        cost:12000,  level:6,  desc:"Pet stable — swap active pet",
    effect:{ menagerie:true } },
  { id:"h_observatory",   name:"Observatory",      cost:18000,  level:9,  desc:"+50% XP from first floor each run",
    effect:{ expBonus:0.5 } },
  { id:"h_enchanter",     name:"Enchanter's Room", cost:8000,   level:6,  desc:"Enchant equipment at home",
    effect:{ enchant:true } },
  { id:"h_hall_heroes",   name:"Hall of Heroes",   cost:25000,  level:10, desc:"Displays past heroes (cosmetic)",
    effect:{ heroHall:true } },
  { id:"h_treasury",      name:"Royal Treasury",   cost:40000,  level:12, desc:"+20% gold found permanently",
    effect:{ goldBonus:0.2 } },
  { id:"h_vault_mythic",  name:"Mythic Vault",     cost:100000, level:15, desc:"Mythic item display — grants passive bonuses",
    effect:{ mythicDisplay:true, atk:20, def:20 } },
];

export function initialHouse() {
  return {
    level: 1,
    upgrades: [],
    vault: [],
    herbsReady: 0,
    lastVisit: 0,
  };
}

export function canBuy(house, upgradeId, gold) {
  const u = HOUSING_UPGRADES.find(h => h.id === upgradeId);
  if (!u) return false;
  if (house.upgrades.includes(upgradeId)) return false;
  if (house.level < u.level) return false;
  if (gold < u.cost) return false;
  return true;
}

export function applyHouseBonuses(player, house) {
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
