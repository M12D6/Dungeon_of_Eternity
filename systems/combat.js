// ═══════════════════════════════════════════════════════════════
//  COMBAT HELPERS — damage, crit, status, resistances
// ═══════════════════════════════════════════════════════════════
import { SPELLS } from "../data/spells.js";
import { STATUS_EFFECTS, isControl, isDot } from "../data/statusEffects.js";

// Calculates a single basic-attack outcome
export function calcBasicAttack(attacker, defender, mods = {}) {
  const atk = (attacker.totalAtk || attacker.atk || 10);
  let baseDmg = Math.floor(Math.random() * 15) + atk;
  const crit = (attacker.crit || 10) + (mods.critBonus || 0);
  const isCrit = Math.random() * 100 < crit;
  if (isCrit) baseDmg = Math.floor(baseDmg * (1.85 + (mods.critMultBonus || 0)));
  const blocked = Math.max(0, (defender.def || 0) - Math.floor(Math.random() * 4));
  const dmg = Math.max(1, baseDmg - blocked);
  return { dmg, isCrit, blocked };
}

// Calculates a spell-damage outcome
export function calcSpellDamage(attacker, defender, spellName, mods = {}) {
  const sp = SPELLS[spellName];
  if (!sp) return { dmg: 0, isCrit: false, blocked: 0 };
  if (sp.dmg[0] < 0) {
    // Healing spell — return absolute heal amount
    const heal = Math.abs(Math.floor(Math.random() * (Math.abs(sp.dmg[1]) - Math.abs(sp.dmg[0]) + 1)) + Math.abs(sp.dmg[0]));
    return { heal, isCrit: false, blocked: 0 };
  }
  const spMin = sp.dmg[0], spMax = sp.dmg[1];
  let dmg = Math.floor(Math.random() * (spMax - spMin + 1)) + spMin;
  dmg += Math.floor((attacker.totalAtk || attacker.atk || 0) * 0.4);
  // Type multiplier (fire/ice/etc.)
  const typeMul = (mods[`${sp.type}Dmg`] || 1);
  dmg = Math.floor(dmg * typeMul);
  const crit = (attacker.crit || 10) + (mods.critBonus || 0);
  const isCrit = Math.random() * 100 < crit;
  if (isCrit) dmg = Math.floor(dmg * (1.85 + (mods.critMultBonus || 0)));
  const blocked = Math.max(0, Math.floor((defender.def || 0) / 2) - Math.floor(Math.random() * 3));
  dmg = Math.max(1, dmg - blocked);
  return { dmg, isCrit, blocked };
}

// Tick status effects at end of turn
export function tickStatus(entity) {
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

// Check whether an entity can act this turn (stunned/frozen/etc.)
export function canAct(entity) {
  if (!entity.status) return true;
  return !isControl(entity.status);
}

// Apply a new status, respecting immunities
export function applyStatus(target, status, turns = 3) {
  if (!status || !STATUS_EFFECTS[status]) return target;
  if (target.passives && target.passives.no_silence && status === "SILENCE") return target;
  return { ...target, status, statusTurns: turns };
}
