using System.Collections.Generic;

namespace DungeonOfEternity.Data
{
    [System.Serializable]
    public class EnemyTemplate
    {
        public string Id;
        public string Name;
        public string Icon;
        public int HP, Atk, Def, Exp, Gold;
        public int MinFloor;
        public bool IsBoss;
        public string Art;

        public EnemyTemplate(string id, string name, string icon, int hp, int atk, int def,
                             int exp, int gold, int minFloor, bool boss = false, string art = "")
        {
            Id = id; Name = name; Icon = icon;
            HP = hp; Atk = atk; Def = def; Exp = exp; Gold = gold;
            MinFloor = minFloor; IsBoss = boss; Art = art;
        }
    }

    public static class EnemyDB
    {
        public static readonly List<EnemyTemplate> All = Build();

        static List<EnemyTemplate> Build()
        {
            var l = new List<EnemyTemplate>();
            // Floor 1-3
            l.Add(new EnemyTemplate("goblin",  "Goblin",        "GOB", 40, 8,  2, 20, 5, 1));
            l.Add(new EnemyTemplate("rat",     "Giant Rat",     "RAT", 30, 6,  1, 15, 3, 1));
            l.Add(new EnemyTemplate("spider",  "Cave Spider",   "SPD", 45, 10, 3, 25, 6, 1));
            l.Add(new EnemyTemplate("imp",     "Imp",           "IMP", 35, 11, 2, 22, 7, 1));
            l.Add(new EnemyTemplate("zombie",  "Zombie",        "ZMB", 55, 7,  5, 28, 5, 1));
            l.Add(new EnemyTemplate("bat",     "Vampire Bat",   "BAT", 28, 9,  1, 18, 4, 1));
            l.Add(new EnemyTemplate("slime",   "Slime",         "SLM", 50, 5,  8, 20, 6, 1));
            // Floor 2-5
            l.Add(new EnemyTemplate("skeleton","Skeleton",      "SKL", 65, 16, 7, 55, 14, 2));
            l.Add(new EnemyTemplate("orc",     "Orc Warrior",   "ORC", 85, 20, 9, 70, 18, 2));
            l.Add(new EnemyTemplate("witch",   "Witch",         "WCH", 60, 22, 4, 75, 22, 2));
            l.Add(new EnemyTemplate("gnoll",   "Gnoll",         "GNL", 72, 18, 6, 60, 16, 2));
            l.Add(new EnemyTemplate("mushroom","Poison Mushroom","MSH", 48, 14, 10, 45, 10, 2));
            l.Add(new EnemyTemplate("banshee", "Banshee",       "BAN", 55, 24, 3, 80, 24, 2));
            l.Add(new EnemyTemplate("kobold",  "Kobold Mage",   "KOB", 50, 20, 4, 65, 20, 2));
            // Floor 4-8
            l.Add(new EnemyTemplate("werewolf","Werewolf",      "WLF", 120, 28, 11, 115, 38, 4));
            l.Add(new EnemyTemplate("darkknight","Dark Knight", "DKN", 140, 32, 17, 140, 48, 4));
            l.Add(new EnemyTemplate("necromancer","Necromancer","NCR", 105, 30, 7,  130, 55, 4));
            l.Add(new EnemyTemplate("vampire", "Vampire",       "VMP", 110, 28, 9,  125, 52, 4));
            l.Add(new EnemyTemplate("golem",   "Stone Golem",   "GLM", 160, 24, 22, 135, 44, 4));
            l.Add(new EnemyTemplate("troll",   "Troll",         "TRL", 135, 30, 13, 118, 40, 4));
            l.Add(new EnemyTemplate("wyvern",  "Wyvern",        "WYV", 150, 34, 14, 155, 58, 5));
            l.Add(new EnemyTemplate("wraith",  "Wraith",        "WRT", 90,  35, 5,  120, 50, 5));
            l.Add(new EnemyTemplate("basilisk","Basilisk",      "BAS", 155, 33, 16, 168, 65, 5));
            // Floor 7-12
            l.Add(new EnemyTemplate("elemental","Fire Elemental","ELM", 150, 38, 12, 170, 62, 7));
            l.Add(new EnemyTemplate("minotaur","Minotaur",      "MIN", 190, 42, 20, 198, 74, 7));
            l.Add(new EnemyTemplate("hydra",   "Hydra",         "HYD", 200, 36, 15, 210, 80, 7));
            l.Add(new EnemyTemplate("phoenix", "Phoenix",       "PHX", 175, 44, 13, 185, 78, 8));
            l.Add(new EnemyTemplate("abomination","Abomination","ABM", 260, 43, 25, 248, 96, 9));
            l.Add(new EnemyTemplate("shadow",  "Shadow Fiend",  "SHD", 130, 40, 8,  163, 60, 9));
            l.Add(new EnemyTemplate("lich",    "Lich",          "LCH", 220, 47, 22, 238, 92, 10));
            l.Add(new EnemyTemplate("demon",   "Demon Lord",    "DMN", 240, 51, 24, 258, 98, 10));
            // Floor 12+
            l.Add(new EnemyTemplate("ancient_dragon","Ancient Dragon","DRG", 350, 64, 30, 400, 150, 12));
            l.Add(new EnemyTemplate("void_wraith","Void Wraith",   "VWR", 200, 57, 18, 378, 142, 12));
            l.Add(new EnemyTemplate("titan",    "Shadow Titan",    "TTN", 400, 60, 35, 450, 170, 14));
            l.Add(new EnemyTemplate("elder_demon","Elder Demon",   "EDM", 300, 70, 28, 420, 160, 14));
            l.Add(new EnemyTemplate("cosmic_horror","Cosmic Horror","CHR", 450, 80, 40, 600, 220, 16));
            // Bosses
            l.Add(new EnemyTemplate("boss_goblin_king","Goblin King",   "GBK", 300,  30,  14, 400,  120,  1, true));
            l.Add(new EnemyTemplate("boss_bone_dragon","Bone Dragon",   "BDR", 500,  48,  22, 700,  220,  5, true));
            l.Add(new EnemyTemplate("boss_shadow_titan","Shadow Titan", "STN", 700,  62,  30, 1100, 440, 10, true));
            l.Add(new EnemyTemplate("boss_hydra_queen","Hydra Queen",   "HQN", 900,  72,  25, 1400, 550, 15, true));
            l.Add(new EnemyTemplate("boss_ancient","Ancient Dragon",    "ADR", 1200, 85,  38, 2000, 800, 20, true));
            l.Add(new EnemyTemplate("boss_god","God of Ruin",           "GOD", 2000, 120, 60, 5000, 2000,25, true));
            return l;
        }
    }
}
