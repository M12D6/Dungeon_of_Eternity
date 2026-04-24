using System.Collections.Generic;
using UnityEngine;
using DungeonOfEternity.Data;

namespace DungeonOfEternity.Systems
{
    /// <summary>
    /// Live player data — separate from MonoBehaviour so it's trivially serializable
    /// for save/load and multi-character support.
    /// </summary>
    [System.Serializable]
    public class PlayerState
    {
        public string Name;
        public ClassId Class;

        public int Level;
        public int Exp;
        public int ExpToNext;

        public int HP;
        public int Mana;

        // Base stats from class + level
        public int BaseAtk;
        public int BaseDef;
        public int Crit;
        public int Spd;

        public int MaxHpBase;
        public int MaxManaBase;

        public int Gold;
        public int Kills;
        public int BossKills;
        public int FloorsCleared;

        public Dictionary<ItemSlot, Item> Equipment = new Dictionary<ItemSlot, Item>();
        public List<Item> Inventory = new List<Item>();
        public List<string> Spells = new List<string>();
        public List<string> Passives = new List<string>();

        // Combat timers / temporary state
        public int BuffTurns;       // ATK buff
        public int DefBuffTurns;    // DEF buff
        public int LichTurns;       // +100% all stats
        public int BerserkerStacks;
        public int RegenTurns;

        public bool DivineShieldAvailable; // Paladin: absorbs one fatal hit
        public bool ShadowFirstCrit;       // Rogue: next attack is guaranteed crit

        public PlayerState() { }

        public static PlayerState Create(string name, ClassId cls)
        {
            var cd = ClassDB.All[cls];
            var p = new PlayerState
            {
                Name = string.IsNullOrEmpty(name) ? "Hero" : name,
                Class = cls,
                Level = 1,
                Exp = 0,
                ExpToNext = 100,
                MaxHpBase = cd.Stats.HP,
                MaxManaBase = cd.Stats.Mana,
                HP = cd.Stats.HP,
                Mana = cd.Stats.Mana,
                BaseAtk = cd.Stats.Atk,
                BaseDef = cd.Stats.Def,
                Crit = cd.Stats.Crit,
                Spd = cd.Stats.Spd,
                Gold = 100,
                Spells = new List<string>(cd.Spells),
                Passives = new List<string>(cd.Passives),
                DivineShieldAvailable = cls == ClassId.Paladin,
                ShadowFirstCrit = cls == ClassId.Rogue,
            };

            // Starter gear
            string starterWeaponId =
                (cls == ClassId.Mage || cls == ClassId.Sorcerer) ? "w_staff1" :
                (cls == ClassId.Rogue || cls == ClassId.Ranger)  ? "w_dagger1" :
                                                                   "w_sword1";

            var sw = ItemDB.All.Find(i => i.Id == starterWeaponId);
            if (sw != null) p.Equipment[ItemSlot.Weapon] = sw.Clone();

            var sa = ItemDB.All.Find(i => i.Id == "a_leather");
            if (sa != null) p.Equipment[ItemSlot.Armor] = sa.Clone();

            // Starter potions
            var hp = ItemDB.All.Find(i => i.Id == "p_hp");
            var mp = ItemDB.All.Find(i => i.Id == "p_mana");
            if (hp != null) { p.Inventory.Add(hp.Clone()); p.Inventory.Add(hp.Clone()); }
            if (mp != null) p.Inventory.Add(mp.Clone());

            return p;
        }

        // ── DERIVED STATS ──────────────────────────────
        public int MaxHp
        {
            get
            {
                int hp = MaxHpBase + (Level - 1) * 15;
                foreach (var eq in Equipment.Values) if (eq != null) hp += eq.TotalHp;
                return hp;
            }
        }

        public int MaxMana
        {
            get
            {
                int m = MaxManaBase + (Level - 1) * 10;
                foreach (var eq in Equipment.Values) if (eq != null) m += eq.Mana;
                return m;
            }
        }

        /// <summary>ATK including equipment, level, buffs, and class passives.</summary>
        public int TotalAtk
        {
            get
            {
                int atk = BaseAtk + (Level - 1) * 3;
                foreach (var eq in Equipment.Values) if (eq != null) atk += eq.TotalAtk;

                if (BuffTurns > 0) atk = Mathf.FloorToInt(atk * 1.4f);
                if (LichTurns > 0) atk = atk * 2;

                // Berserker passives
                if (Class == ClassId.Berserker && HP < MaxHp * 0.25f) atk *= 2;
                if (Class == ClassId.Berserker) atk += BerserkerStacks * 5;

                return atk;
            }
        }

        public int TotalDef
        {
            get
            {
                int def = BaseDef + (Level - 1) * 2;
                foreach (var eq in Equipment.Values) if (eq != null) def += eq.TotalDef;

                if (DefBuffTurns > 0) def = Mathf.FloorToInt(def * 1.5f);
                if (LichTurns > 0) def *= 2;

                // Warrior: Iron Skin
                if (Class == ClassId.Warrior) def = Mathf.FloorToInt(def * 1.2f);

                return def;
            }
        }

        public int EffectiveCrit
        {
            get
            {
                int c = Crit;
                // Ranger: Eagle Eye contributes in CombatSystem via crit damage, not crit chance.
                return c;
            }
        }

        // ── LEVEL UP ──────────────────────────────────
        /// <summary>Grants XP; loops for multi-level-ups. Returns the number of levels gained.</summary>
        public int GainExp(int amount)
        {
            Exp += amount;
            int gained = 0;
            while (Exp >= ExpToNext)
            {
                Exp -= ExpToNext;
                ExpToNext = Mathf.FloorToInt(ExpToNext * 1.4f);
                Level++;
                BaseAtk += 3;
                BaseDef += 2;
                MaxHpBase += 15;
                MaxManaBase += 10;
                HP = MaxHp;
                Mana = MaxMana;
                gained++;
            }
            return gained;
        }

        // ── EQUIPMENT ─────────────────────────────────
        public bool Equip(Item item)
        {
            if (item == null) return false;
            if (item.Slot == ItemSlot.Consumable || item.Slot == ItemSlot.Scroll || item.Slot == ItemSlot.Misc) return false;
            if (item.LevelReq > Level) return false;

            // Swap
            Equipment.TryGetValue(item.Slot, out var old);
            Equipment[item.Slot] = item;
            Inventory.Remove(item);
            if (old != null) Inventory.Add(old);

            // Clamp current HP/MP to new max
            HP = Mathf.Min(HP, MaxHp);
            Mana = Mathf.Min(Mana, MaxMana);
            return true;
        }

        public void Unequip(ItemSlot slot)
        {
            if (Equipment.TryGetValue(slot, out var eq) && eq != null)
            {
                Inventory.Add(eq);
                Equipment[slot] = null;
                HP = Mathf.Min(HP, MaxHp);
                Mana = Mathf.Min(Mana, MaxMana);
            }
        }

        public bool UpgradeWeapon(int goldCost)
        {
            if (!Equipment.TryGetValue(ItemSlot.Weapon, out var w) || w == null) return false;
            if (Gold < goldCost) return false;
            if (w.UpgradeLevel >= 15) return false;
            Gold -= goldCost;
            w.UpgradeLevel++;
            return true;
        }

        // ── TICK ──────────────────────────────────────
        /// <summary>Decrements buff timers — called after each combat turn.</summary>
        public void TickBuffs()
        {
            if (BuffTurns > 0) BuffTurns--;
            if (DefBuffTurns > 0) DefBuffTurns--;
            if (LichTurns > 0) LichTurns--;
            if (RegenTurns > 0)
            {
                HP = Mathf.Min(MaxHp, HP + Mathf.Max(5, MaxHp / 20));
                RegenTurns--;
            }
        }

        public void Heal(int amount) => HP = Mathf.Min(MaxHp, HP + Mathf.Max(0, amount));
        public void RestoreMana(int amount) => Mana = Mathf.Min(MaxMana, Mana + Mathf.Max(0, amount));
    }
}
