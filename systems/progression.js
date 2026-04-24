// ═══════════════════════════════════════════════════════════════
//  PROGRESSION — XP, leveling, stat calc, equipment, mastery
// ═══════════════════════════════════════════════════════════════
import { CLASSES, getSubclassBonus } from "../data/classes.js";
import { aggregateGrants } from "../data/skillTrees.js";
import { ITEM_SETS, ITEM_TO_SET } from "../data/items.js";
import { applyHouseBonuses } from "../data/housing.js";

export function expNeededForLevel(level) {
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

export function levelUp(player) {
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

// Aggregate set bonuses
export function setBonuses(equipment) {
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
    // Find highest tier ≤ count
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
      bonus.labels.push(`${set.name} (${best.n}): ${best.data.desc || ""}`);
    }
  });
  return bonus;
}

// Calculate total combat stats from all sources
export function calcPlayerStats(p, house = null) {
  if (!p) return { totalAtk: 0, totalDef: 0, maxHp: 1, maxMana: 1, crit: 0 };
  let atk = p.baseAtk, def = p.baseDef, hp = CLASSES[p.cls]?.stats?.hp || 100, mana = CLASSES[p.cls]?.stats?.mana || 50, crit = p.crit;

  // Level bonuses
  atk  += (p.level - 1) * 3;
  def  += (p.level - 1) * 2;
  hp   += (p.level - 1) * 15;
  mana += (p.level - 1) * 10;

  // Equipment
  Object.values(p.equipment || {}).forEach(eq => {
    if (!eq) return;
    atk  += eq.atk  || 0;
    def  += eq.def  || 0;
    hp   += eq.hp   || 0;
    mana += eq.mana || 0;
    crit += eq.crit || 0;
  });

  // Set bonuses
  const sets = setBonuses(p.equipment);
  atk += sets.atk; def += sets.def; hp += sets.hp; mana += sets.mana; crit += sets.crit;

  // Subclass bonuses
  if (p.subclass) {
    const sub = getSubclassBonus(p.cls, p.subclass);
    atk += sub.atk || 0; def += sub.def || 0;
    hp += sub.hp || 0; mana += sub.mana || 0; crit += sub.crit || 0;
  }

  // Skill-tree grants
  const grants = aggregateGrants(p.cls, p.unlockedSkills || []);
  atk += grants.stat.atk || 0; def += grants.stat.def || 0;
  hp += grants.stat.hp || 0; mana += grants.stat.mana || 0; crit += grants.stat.crit || 0;

  // House bonuses
  if (house) {
    const hb = applyHouseBonuses(p, house);
    atk += hb.atk; def += hb.def; hp += hb.hp; mana += hb.mana;
  }

  // Mastery (applied on init)
  if (p.masteryBonus) {
    atk += p.masteryBonus.atk || 0; def += p.masteryBonus.def || 0;
    hp += p.masteryBonus.hp || 0; mana += p.masteryBonus.mana || 0;
  }

  // Active buffs / passives
  let totalAtk = atk;
  let totalDef = def;
  if (p.buffTurns > 0) totalAtk = Math.floor(totalAtk * 1.4);
  if (p.lichTurns > 0) { totalAtk = Math.floor(totalAtk * 2); totalDef = Math.floor(totalDef * 2); }
  if (p.defBuffTurns > 0) totalDef = Math.floor(totalDef * 1.5);
  if (p.cls === "BERSERKER" && p.hp < (hp * 0.25)) totalAtk = Math.floor(totalAtk * 2);
  if (p.cls === "BERSERKER" && p.berserkerStacks > 0) totalAtk += p.berserkerStacks * 5;

  // Multiplier grants (mult.atkDmg etc.)
  if (grants.mult.atkDmg) totalAtk = Math.floor(totalAtk * grants.mult.atkDmg);

  return { totalAtk, totalDef, maxHp: hp, maxMana: mana, crit, setLabels: sets.labels, passives: grants.passives, mult: grants.mult };
}

// Starter player factory
export function createPlayer(cls, subclass, name, masteryBonus = null) {
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
