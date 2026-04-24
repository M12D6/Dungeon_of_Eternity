using System.Collections.Generic;

namespace DungeonOfEternity.Data
{
    public enum SpellType { Physical, Fire, Ice, Lightning, Arcane, Holy, Dark, Poison, Buff, Debuff, Heal, Summon }
    public enum StatusType
    {
        None, Stun, Freeze, Burn, Poison, Bleed, Curse, Mark,
        AtkBuff, DefBuff, DodgeBuff, Lich, Frenzy, Haste, Regen
    }

    [System.Serializable]
    public class Spell
    {
        public string Name;
        public string Icon;
        public int DmgMin;
        public int DmgMax;
        public int ManaCost;
        public SpellType Type;
        public string Description;
        public StatusType Status;

        public Spell(string name, string icon, int dmgMin, int dmgMax, int mana,
                     SpellType type, string desc, StatusType status = StatusType.None)
        {
            Name = name; Icon = icon; DmgMin = dmgMin; DmgMax = dmgMax;
            ManaCost = mana; Type = type; Description = desc; Status = status;
        }

        public bool IsHeal => DmgMin < 0;
        public bool IsBuff => DmgMin == 0 && DmgMax == 0;
    }

    public static class SpellDB
    {
        public static readonly Dictionary<string, Spell> All = Build();

        static Dictionary<string, Spell> Build()
        {
            var d = new Dictionary<string, Spell>();
            // Warrior
            Add(d, new Spell("Whirlwind", "WHR", 40, 70, 30, SpellType.Physical, "Spin dealing dmg to all"));
            Add(d, new Spell("Shield Bash", "SB", 25, 45, 20, SpellType.Physical, "Stuns enemy 1 turn", StatusType.Stun));
            Add(d, new Spell("War Cry", "WC", 0, 0, 25, SpellType.Buff, "+40% ATK for 3 turns", StatusType.AtkBuff));
            Add(d, new Spell("Blade Storm", "BST", 60, 100, 45, SpellType.Physical, "Multi-hit melee flurry"));
            Add(d, new Spell("Deathblow", "DB", 100, 160, 70, SpellType.Physical, "Massive single strike"));
            // Mage
            Add(d, new Spell("Fireball", "FB", 50, 80, 30, SpellType.Fire, "Burning projectile", StatusType.Burn));
            Add(d, new Spell("Ice Lance", "IL", 40, 70, 25, SpellType.Ice, "Freezes enemy 1 turn", StatusType.Freeze));
            Add(d, new Spell("Chain Lightning", "CL", 55, 90, 40, SpellType.Lightning, "Chains to hit twice", StatusType.Stun));
            Add(d, new Spell("Arcane Missile", "AM", 35, 55, 20, SpellType.Arcane, "Rapid arcane bolt"));
            Add(d, new Spell("Meteor", "MET", 120, 200, 80, SpellType.Fire, "Devastating meteor drop", StatusType.Burn));
            // Rogue
            Add(d, new Spell("Backstab", "BS", 70, 120, 30, SpellType.Physical, "Triple crit from shadow"));
            Add(d, new Spell("Poison Blade", "PB", 30, 50, 20, SpellType.Poison, "Poisons for 5 turns", StatusType.Poison));
            Add(d, new Spell("Smoke Bomb", "SMK", 0, 0, 25, SpellType.Buff, "+50% dodge for 2 turns", StatusType.DodgeBuff));
            Add(d, new Spell("Fan of Knives", "FOK", 45, 75, 35, SpellType.Physical, "Throws 5 blades"));
            Add(d, new Spell("Death Mark", "DM", 0, 0, 50, SpellType.Debuff, "Next hit = instant kill", StatusType.Mark));
            // Paladin
            Add(d, new Spell("Holy Strike", "HS", 40, 65, 25, SpellType.Holy, "Holy-charged melee"));
            Add(d, new Spell("Smite", "SMT", 55, 85, 35, SpellType.Holy, "Divine smite from above", StatusType.Burn));
            Add(d, new Spell("Consecrate", "CON", 30, 50, 30, SpellType.Holy, "Damages+heals each turn"));
            Add(d, new Spell("Divine Heal", "HEAL", -120, -70, 40, SpellType.Heal, "Restore 70-120 HP"));
            Add(d, new Spell("Judgment", "JDG", 90, 150, 65, SpellType.Holy, "Final divine reckoning"));
            // Necromancer
            Add(d, new Spell("Death Bolt", "DTH", 55, 90, 30, SpellType.Dark, "Bolt of necrotic energy", StatusType.Curse));
            Add(d, new Spell("Soul Drain", "SD", 40, 70, 35, SpellType.Dark, "Drain HP -> mana"));
            Add(d, new Spell("Raise Dead", "RD", 0, 0, 50, SpellType.Summon, "Summon skeleton minion"));
            Add(d, new Spell("Bone Nova", "BN", 70, 110, 55, SpellType.Dark, "Bone shards explode out"));
            Add(d, new Spell("Lich Form", "LF", 0, 0, 90, SpellType.Buff, "+100% all stats, 3 turns", StatusType.Lich));
            // Berserker
            Add(d, new Spell("Savage Strike", "SS", 55, 95, 20, SpellType.Physical, "Wild savage attack"));
            Add(d, new Spell("Frenzy", "FRZ", 0, 0, 30, SpellType.Buff, "+60% ATK, -30% DEF", StatusType.Frenzy));
            Add(d, new Spell("Blood Thirst", "BT", 50, 80, 35, SpellType.Physical, "Heal 50% of dmg dealt"));
            Add(d, new Spell("Earthquake", "EQ", 80, 130, 60, SpellType.Physical, "Shockwave hits all", StatusType.Stun));
            Add(d, new Spell("Ragnarok", "RAG", 150, 250, 100, SpellType.Physical, "Apocalyptic destruction"));
            // Ranger
            Add(d, new Spell("Arrow Rain", "AR", 45, 75, 35, SpellType.Physical, "Volley of arrows"));
            Add(d, new Spell("Piercing Shot", "PS", 60, 100, 30, SpellType.Physical, "Ignores armor"));
            Add(d, new Spell("Trap", "TRP", 0, 0, 25, SpellType.Debuff, "Stuns enemy 2 turns", StatusType.Stun));
            Add(d, new Spell("Barrage", "BRG", 35, 55, 40, SpellType.Physical, "Rapid fire 3 shots"));
            Add(d, new Spell("Sniper Shot", "SNP", 100, 180, 70, SpellType.Physical, "High-crit precision shot"));
            // Sorcerer
            Add(d, new Spell("Blizzard", "BLZ", 65, 105, 50, SpellType.Ice, "Freezes + mass ice dmg", StatusType.Freeze));
            Add(d, new Spell("Inferno", "INF", 80, 130, 60, SpellType.Fire, "Engulf in flames", StatusType.Burn));
            Add(d, new Spell("Void Bolt", "VB", 70, 115, 45, SpellType.Dark, "Piercing void energy"));
            Add(d, new Spell("Thunderstorm", "TS", 90, 140, 65, SpellType.Lightning, "Storm of lightning", StatusType.Stun));
            Add(d, new Spell("Reality Tear", "RT", 160, 260, 110, SpellType.Arcane, "Tear reality apart"));
            return d;
        }

        static void Add(Dictionary<string, Spell> d, Spell s) => d[s.Name] = s;
    }
}
