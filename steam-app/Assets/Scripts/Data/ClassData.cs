using UnityEngine;
using System.Collections.Generic;

namespace DungeonOfEternity.Data
{
    public enum ClassId
    {
        Warrior, Mage, Rogue, Paladin, Necromancer, Berserker, Ranger, Sorcerer
    }

    [System.Serializable]
    public class ClassStats
    {
        public int HP;
        public int Mana;
        public int Atk;
        public int Def;
        public int Spd;
        public int Crit;

        public ClassStats(int hp, int mana, int atk, int def, int spd, int crit)
        {
            HP = hp; Mana = mana; Atk = atk; Def = def; Spd = spd; Crit = crit;
        }
    }

    [System.Serializable]
    public class CharacterClass
    {
        public ClassId Id;
        public string Name;
        public string Icon;
        public string ColorHex;
        public string Description;
        public ClassStats Stats;
        public List<string> Passives;
        public List<string> Spells;

        public CharacterClass(ClassId id, string name, string icon, string colorHex, string desc,
                              ClassStats stats, List<string> passives, List<string> spells)
        {
            Id = id; Name = name; Icon = icon; ColorHex = colorHex; Description = desc;
            Stats = stats; Passives = passives; Spells = spells;
        }

        public Color GetColor()
        {
            ColorUtility.TryParseHtmlString(ColorHex, out Color c);
            return c;
        }
    }

    public static class ClassDB
    {
        public static readonly Dictionary<ClassId, CharacterClass> All = new Dictionary<ClassId, CharacterClass>
        {
            { ClassId.Warrior, new CharacterClass(
                ClassId.Warrior, "Warrior", "WAR", "#ef4444",
                "Unstoppable frontline fighter. Master of melee combat.",
                new ClassStats(150, 60, 22, 18, 8, 10),
                new List<string>{ "Iron Skin: +20% DEF", "Berserker: +5% ATK per kill (stacks 5x)" },
                new List<string>{ "Whirlwind","Shield Bash","War Cry","Blade Storm","Deathblow" }) },

            { ClassId.Mage, new CharacterClass(
                ClassId.Mage, "Mage", "MAG", "#3b82f6",
                "Master of arcane destruction. Devastating spell power.",
                new ClassStats(90, 200, 14, 7, 9, 15),
                new List<string>{ "Arcane Mastery: Spells +25% DMG", "Mana Shield: 30% dmg absorbed" },
                new List<string>{ "Fireball","Ice Lance","Chain Lightning","Arcane Missile","Meteor" }) },

            { ClassId.Rogue, new CharacterClass(
                ClassId.Rogue, "Rogue", "ROG", "#22c55e",
                "Deadly assassin. Strikes from shadows with lethal precision.",
                new ClassStats(110, 90, 28, 9, 14, 35),
                new List<string>{ "Shadowstrike: First hit always crits", "Evasion: 20% dodge chance" },
                new List<string>{ "Backstab","Poison Blade","Smoke Bomb","Fan of Knives","Death Mark" }) },

            { ClassId.Paladin, new CharacterClass(
                ClassId.Paladin, "Paladin", "PAL", "#f59e0b",
                "Holy warrior. Balance of offense, defense, and divine healing.",
                new ClassStats(130, 110, 18, 20, 7, 12),
                new List<string>{ "Holy Aura: +15 HP regen/turn", "Divine Shield: Block 1 fatal hit" },
                new List<string>{ "Holy Strike","Smite","Consecrate","Divine Heal","Judgment" }) },

            { ClassId.Necromancer, new CharacterClass(
                ClassId.Necromancer, "Necromancer", "NEC", "#8b5cf6",
                "Master of death and undead. Drains life and summons minions.",
                new ClassStats(95, 180, 16, 8, 8, 20),
                new List<string>{ "Death Pact: 20% chance to revive on death", "Soul Harvest: Gain mana on kill" },
                new List<string>{ "Death Bolt","Soul Drain","Raise Dead","Bone Nova","Lich Form" }) },

            { ClassId.Berserker, new CharacterClass(
                ClassId.Berserker, "Berserker", "BSK", "#dc2626",
                "Rage-fueled destroyer. Gets stronger as HP drops.",
                new ClassStats(160, 40, 30, 10, 11, 20),
                new List<string>{ "Blood Rage: ATK doubles below 25% HP", "Rampage: No mana cost at low HP" },
                new List<string>{ "Savage Strike","Frenzy","Blood Thirst","Earthquake","Ragnarok" }) },

            { ClassId.Ranger, new CharacterClass(
                ClassId.Ranger, "Ranger", "RNG", "#10b981",
                "Swift hunter. Attacks from range with deadly accuracy.",
                new ClassStats(105, 100, 24, 11, 13, 28),
                new List<string>{ "Eagle Eye: +15% crit damage", "Kiting: Never takes damage first" },
                new List<string>{ "Arrow Rain","Piercing Shot","Trap","Barrage","Sniper Shot" }) },

            { ClassId.Sorcerer, new CharacterClass(
                ClassId.Sorcerer, "Sorcerer", "SOR", "#06b6d4",
                "Pure elemental power. Inflicts status effects on every spell.",
                new ClassStats(85, 220, 12, 6, 10, 22),
                new List<string>{ "Elemental Overload: 50% status chance", "Mana Surge: Cast 2 spells/turn" },
                new List<string>{ "Blizzard","Inferno","Void Bolt","Thunderstorm","Reality Tear" }) },
        };
    }
}
