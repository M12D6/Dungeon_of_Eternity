using System.Collections.Generic;
using UnityEngine;

namespace DungeonOfEternity.Data
{
    public enum BiomeId
    {
        Catacombs, FrozenCaverns, InfernalDepths, EnchantedForest, SunkenTemple,
        ShadowRealm, CrystalMines, VolcanicForge, HauntedCastle, VoidSpire,
        AncientLibrary, PoisonSwamp, CelestialGardens, DesertTombs, Abyss
    }

    [System.Serializable]
    public class Biome
    {
        public BiomeId Id;
        public string Name;
        public string TileHex;
        public string WallHex;
        public string AccentHex;
        public int MinFloor;
        public string FlavorText;

        public Biome(BiomeId id, string name, string tile, string wall, string accent, int minFloor, string flavor)
        {
            Id = id; Name = name; TileHex = tile; WallHex = wall; AccentHex = accent;
            MinFloor = minFloor; FlavorText = flavor;
        }
    }

    public static class BiomeDB
    {
        public static readonly List<Biome> All = new List<Biome>
        {
            new Biome(BiomeId.Catacombs,        "The Catacombs",       "#1a1a28", "#0a0a14", "#6b7280",  1,  "Bones crunch underfoot. Ancient crypts stretch into darkness."),
            new Biome(BiomeId.FrozenCaverns,    "Frozen Caverns",      "#1e3a5f", "#0a1a2e", "#60a5fa",  3,  "Breath freezes. Ice walls shimmer with trapped souls."),
            new Biome(BiomeId.InfernalDepths,   "Infernal Depths",     "#3b1010", "#1a0505", "#ef4444",  5,  "Lava flows beneath. The air burns your lungs."),
            new Biome(BiomeId.EnchantedForest,  "Enchanted Forest",    "#1a3d1a", "#0a1e0a", "#22c55e",  2,  "Trees whisper. Something watches from the canopy."),
            new Biome(BiomeId.SunkenTemple,     "Sunken Temple",       "#0a3d3d", "#051e1e", "#06b6d4",  6,  "Water drips from carved gods. Drowned priests rise."),
            new Biome(BiomeId.ShadowRealm,      "Shadow Realm",        "#1a0a2e", "#0a0515", "#8b5cf6",  8,  "Reality thins here. Shadows move without owners."),
            new Biome(BiomeId.CrystalMines,     "Crystal Mines",       "#2d1a3d", "#150a1e", "#d946ef",  4,  "Prismatic walls refract torchlight. Golems guard the veins."),
            new Biome(BiomeId.VolcanicForge,    "Volcanic Forge",      "#3d1a0a", "#1e0a05", "#f97316",  9,  "Hammers ring from forgotten smithies. Fire elementals stalk."),
            new Biome(BiomeId.HauntedCastle,    "Haunted Castle",      "#1a1a1a", "#0a0a0a", "#a8a29e",  7,  "Tapestries rot. Every portrait's eyes follow you."),
            new Biome(BiomeId.VoidSpire,        "Void Spire",          "#0a0a1e", "#050510", "#1e1b4b", 12,  "Nothing. Not even silence. Existence itself is optional here."),
            new Biome(BiomeId.AncientLibrary,   "Ancient Library",     "#3d2a1a", "#1e150a", "#fbbf24", 10,  "Books float. Knowledge wants you, but the cost is sanity."),
            new Biome(BiomeId.PoisonSwamp,      "Poison Swamp",        "#1a3d1a", "#0a1e0a", "#84cc16", 11,  "Every step squelches. The air itself is deadly."),
            new Biome(BiomeId.CelestialGardens, "Celestial Gardens",   "#3d3d1a", "#1e1e0a", "#fcd34d", 13,  "Flowers of light bloom impossibly. This place is older than stars."),
            new Biome(BiomeId.DesertTombs,      "Desert Tombs",        "#3d2e1a", "#1e170a", "#ca8a04", 14,  "Sand buries the corridors. Mummies stir from millennial sleep."),
            new Biome(BiomeId.Abyss,            "The Abyss",           "#000000", "#050505", "#dc2626", 20,  "The final descent. Every step could be your last."),
        };

        public static Biome ForFloor(int floor)
        {
            var valid = All.FindAll(b => b.MinFloor <= floor);
            if (valid.Count == 0) return All[0];
            return valid[(floor - 1) % valid.Count];
        }

        public static Color ParseHex(string hex)
        {
            ColorUtility.TryParseHtmlString(hex, out Color c);
            return c;
        }
    }
}
