using System;
using System.Collections.Generic;
using UnityEngine;
using DungeonOfEternity.Data;

namespace DungeonOfEternity.Systems
{
    public enum CombatAction { Attack, Spell, Flee, Item }

    [System.Serializable]
    public class CombatMessage
    {
        public string Text;
        public string Color; // hex
        public CombatMessage(string t, string c) { Text = t; Color = c; }
    }

    [System.Serializable]
    public class CombatResult
    {
        public bool EnemyDefeated;
        public bool PlayerDefeated;
        public bool Fled;
        public List<Item> Loot = new List<Item>();
        public int XpGained;
        public int GoldGained;
        public List<CombatMessage> Log = new List<CombatMessage>();
    }

    /// <summary>Core damage/spell/AI resolution for turn-based fights.</summary>
    public static class CombatSystem
    {
        public const float CRIT_MULT = 1.85f;

        // ── ENTRY POINT ──────────────────────────────
        /// <summary>Resolves the player's action this turn. Enemy turn is resolved after.</summary>
        public static CombatResult ResolvePlayerTurn(PlayerState player, EnemyInstance enemy,
                                                    CombatAction action, string spellName, Item item,
                                                    int floor, BiomeId biome)
        {
            var result = new CombatResult();

            switch (action)
            {
                case CombatAction.Attack: DoAttack(player, enemy, result); break;
                case CombatAction.Spell:  DoSpell(player, enemy, spellName, result); break;
                case CombatAction.Flee:   DoFlee(player, result); break;
                case CombatAction.Item:   DoItem(player, item, result); break;
            }

            if (enemy.HP <= 0)
            {
                result.EnemyDefeated = true;
                result.XpGained = enemy.Exp;
                result.GoldGained = enemy.Gold;
                player.GainExp(enemy.Exp);
                player.Gold += enemy.Gold;
                player.Kills++;
                if (enemy.IsBoss) player.BossKills++;

                // Necromancer: Soul Harvest
                if (player.Class == ClassId.Necromancer) player.RestoreMana(30);

                // Berserker stack on kill
                if (player.Class == ClassId.Berserker)
                    player.BerserkerStacks = Mathf.Min(5, player.BerserkerStacks + 1);

                result.Loot = LootGenerator.RollEnemyDrops(floor, biome, player.Level, enemy.IsBoss);
                foreach (var l in result.Loot) player.Inventory.Add(l);

                return result;
            }

            if (result.Fled) return result;

            // Enemy turn
            EnemyTurn(player, enemy, result);

            if (player.HP <= 0)
            {
                // Necro death pact
                if (player.Class == ClassId.Necromancer && UnityEngine.Random.value < 0.2f)
                {
                    player.HP = Mathf.FloorToInt(player.MaxHp * 0.3f);
                    result.Log.Add(new CombatMessage("Death Pact triggers - you revive!", "#8b5cf6"));
                }
                else
                {
                    result.PlayerDefeated = true;
                }
            }

            // Tick status effects on enemy after round
            TickEnemyStatus(enemy, result);
            player.TickBuffs();

            return result;
        }

        // ── ACTIONS ──────────────────────────────────
        static void DoAttack(PlayerState p, EnemyInstance e, CombatResult r)
        {
            bool crit = UnityEngine.Random.Range(0, 100) < p.EffectiveCrit;
            if (p.Class == ClassId.Rogue && p.ShadowFirstCrit)
            {
                crit = true;
                p.ShadowFirstCrit = false;
            }

            int roll = UnityEngine.Random.Range(0, 15) + p.TotalAtk;
            int dmg = crit ? Mathf.FloorToInt(roll * CRIT_MULT) : roll;

            // Ranger: Eagle Eye bonus crit dmg
            if (crit && p.Class == ClassId.Ranger) dmg = Mathf.FloorToInt(dmg * 1.15f);

            int blocked = Mathf.Max(0, e.Def - UnityEngine.Random.Range(0, 4));
            dmg = Mathf.Max(1, dmg - blocked);

            // Death Mark instant kill
            if (e.Status == StatusType.Mark)
            {
                dmg = e.HP;
                r.Log.Add(new CombatMessage("DEATH MARK - instant kill!", "#8b5cf6"));
            }

            e.HP = Mathf.Max(0, e.HP - dmg);
            r.Log.Add(new CombatMessage(
                (crit ? "CRIT! " : "") + dmg + " damage to " + e.Name,
                crit ? "#fbbf24" : "#e2e8f0"));
        }

        static void DoSpell(PlayerState p, EnemyInstance e, string spellName, CombatResult r)
        {
            if (!SpellDB.All.TryGetValue(spellName, out var sp))
            {
                r.Log.Add(new CombatMessage("Unknown spell.", "#ef4444"));
                return;
            }

            int manaCost = sp.ManaCost;
            if (p.Class == ClassId.Berserker && p.HP < p.MaxHp * 0.25f) manaCost = 0;

            if (p.Mana < manaCost)
            {
                r.Log.Add(new CombatMessage("Not enough mana!", "#ef4444"));
                return;
            }
            p.Mana -= manaCost;

            // Heal
            if (sp.IsHeal)
            {
                int heal = UnityEngine.Random.Range(Mathf.Abs(sp.DmgMax), Mathf.Abs(sp.DmgMin) + 1);
                p.Heal(heal);
                r.Log.Add(new CombatMessage("Healed for " + heal + " HP!", "#4ade80"));
                return;
            }

            // Buff
            if (sp.IsBuff)
            {
                ApplyBuff(p, e, spellName, r);
                r.Log.Add(new CombatMessage(spellName + " activated!", "#a78bfa"));
                return;
            }

            // Damage
            int dmg = UnityEngine.Random.Range(sp.DmgMin, sp.DmgMax + 1);
            dmg += Mathf.FloorToInt(p.TotalAtk * 0.5f);

            // Mage: Arcane Mastery
            if (p.Class == ClassId.Mage) dmg = Mathf.FloorToInt(dmg * 1.25f);

            bool crit = UnityEngine.Random.Range(0, 100) < p.EffectiveCrit;
            if (crit) dmg = Mathf.FloorToInt(dmg * CRIT_MULT);

            int blocked = Mathf.Max(0, e.Def / 2 - UnityEngine.Random.Range(0, 3));
            dmg = Mathf.Max(1, dmg - blocked);

            e.HP = Mathf.Max(0, e.HP - dmg);

            // Status
            float statusChance = p.Class == ClassId.Sorcerer ? 0.75f : 0.45f;
            if (sp.Status != StatusType.None && UnityEngine.Random.value < statusChance)
            {
                e.Status = sp.Status;
                e.StatusTurns = 2 + UnityEngine.Random.Range(0, 2);
                r.Log.Add(new CombatMessage(e.Name + " is " + sp.Status + "!", "#a78bfa"));
            }

            r.Log.Add(new CombatMessage(
                sp.Icon + " " + spellName + "! " + (crit ? "CRIT " : "") + dmg + " dmg (" + manaCost + " MP)",
                crit ? "#fbbf24" : "#c4b5fd"));

            // Blood Thirst heal
            if (spellName == "Blood Thirst")
            {
                int heal = Mathf.FloorToInt(dmg * 0.5f);
                p.Heal(heal);
                r.Log.Add(new CombatMessage("Blood Thirst heals " + heal + "!", "#4ade80"));
            }

            // Soul Drain mana gain
            if (spellName == "Soul Drain")
            {
                int mp = Mathf.FloorToInt(dmg * 0.5f);
                p.RestoreMana(mp);
                r.Log.Add(new CombatMessage("Soul Drain restores " + mp + " MP!", "#a78bfa"));
            }

            if (p.Class == ClassId.Berserker)
                p.BerserkerStacks = Mathf.Min(5, p.BerserkerStacks + 1);
        }

        static void ApplyBuff(PlayerState p, EnemyInstance e, string spellName, CombatResult r)
        {
            switch (spellName)
            {
                case "War Cry":
                case "Frenzy":       p.BuffTurns = 3; break;
                case "Smoke Bomb":   p.DefBuffTurns = 2; break;
                case "Lich Form":    p.LichTurns = 3; break;
                case "Death Mark":   e.Status = StatusType.Mark; e.StatusTurns = 99; break;
                case "Trap":         e.Status = StatusType.Stun; e.StatusTurns = 2; break;
                case "Consecrate":   p.RegenTurns = 3; break;
            }
        }

        static void DoFlee(PlayerState p, CombatResult r)
        {
            int chance = (p.Class == ClassId.Rogue || p.Class == ClassId.Ranger) ? 65 : 40;
            if (UnityEngine.Random.Range(0, 100) < chance)
            {
                r.Fled = true;
                r.Log.Add(new CombatMessage("Escaped!", "#22c55e"));
            }
            else
            {
                r.Log.Add(new CombatMessage("Couldn't escape!", "#ef4444"));
            }
        }

        static void DoItem(PlayerState p, Item item, CombatResult r)
        {
            if (item == null) return;
            if (item.Heal > 0) { p.Heal(item.Heal); r.Log.Add(new CombatMessage("+" + item.Heal + " HP", "#4ade80")); }
            if (item.ManaRestore > 0) { p.RestoreMana(item.ManaRestore); r.Log.Add(new CombatMessage("+" + item.ManaRestore + " MP", "#60a5fa")); }
            if (item.Slot == ItemSlot.Scroll && !string.IsNullOrEmpty(item.Spell) && !p.Spells.Contains(item.Spell))
            {
                p.Spells.Add(item.Spell);
                r.Log.Add(new CombatMessage("Learned " + item.Spell + "!", "#a78bfa"));
            }
            p.Inventory.Remove(item);
        }

        // ── ENEMY TURN ───────────────────────────────
        static void EnemyTurn(PlayerState p, EnemyInstance e, CombatResult r)
        {
            if (e.Status == StatusType.Freeze || e.Status == StatusType.Stun)
            {
                r.Log.Add(new CombatMessage(e.Name + " is " + e.Status + " and can't act!", "#60a5fa"));
                return;
            }

            // Rogue dodge
            if (p.Class == ClassId.Rogue && UnityEngine.Random.value < 0.2f)
            {
                r.Log.Add(new CombatMessage(p.Name + " DODGED the attack!", "#22c55e"));
                return;
            }

            int eAtk = Mathf.FloorToInt(e.Atk * UnityEngine.Random.Range(0.85f, 1.15f));
            int dmg = Mathf.Max(1, eAtk - p.TotalDef);

            // Paladin divine shield
            if (p.DivineShieldAvailable && p.HP <= dmg)
            {
                p.DivineShieldAvailable = false;
                p.HP = 1;
                r.Log.Add(new CombatMessage("Divine Shield absorbs the fatal blow!", "#f59e0b"));
                return;
            }

            // Mage mana shield
            if (p.Class == ClassId.Mage && p.Mana > 0)
            {
                int absorb = Mathf.FloorToInt(dmg * 0.3f);
                int manaUsed = Mathf.Min(p.Mana, absorb);
                p.Mana -= manaUsed;
                dmg = Mathf.Max(1, dmg - manaUsed);
            }

            p.HP = Mathf.Max(0, p.HP - dmg);
            r.Log.Add(new CombatMessage(e.Name + " attacks for " + dmg + " DMG!", "#f87171"));

            // Paladin Holy Aura regen
            if (p.Class == ClassId.Paladin && p.HP > 0)
                p.Heal(15);
        }

        // ── STATUS TICK ──────────────────────────────
        static void TickEnemyStatus(EnemyInstance e, CombatResult r)
        {
            if (e.Status == StatusType.Poison || e.Status == StatusType.Burn ||
                e.Status == StatusType.Curse  || e.Status == StatusType.Bleed)
            {
                if (StatusDB.All.TryGetValue(e.Status, out var info))
                {
                    int dot = Mathf.Max(1, Mathf.RoundToInt(e.MaxHP * info.DmgPct));
                    e.HP = Mathf.Max(0, e.HP - dot);
                    r.Log.Add(new CombatMessage(e.Name + " takes " + dot + " " + info.Name + " dmg", "#fb923c"));
                }
            }

            if (e.StatusTurns > 0)
            {
                e.StatusTurns--;
                if (e.StatusTurns <= 0 && e.Status != StatusType.Mark) e.Status = StatusType.None;
            }
        }
    }
}
