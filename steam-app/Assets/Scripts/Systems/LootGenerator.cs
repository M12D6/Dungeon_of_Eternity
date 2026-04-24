using System.Collections.Generic;
using UnityEngine;
using DungeonOfEternity.Data;

namespace DungeonOfEternity.Systems
{
    /// <summary>
    /// Rolls loot filtered by floor, biome, and level requirement.
    /// Ports generateLoot() from the JSX game and layers on the Dungeon-Quest-style
    /// level-lock + biome-theme extensions requested by the user.
    /// </summary>
    public static class LootGenerator
    {
        // Biome -> preferred weapon element affinity. Non-matching elements can still drop,
        // they just get de-prioritized in the weighted pick.
        static readonly Dictionary<BiomeId, string> BiomePreferredElement = new Dictionary<BiomeId, string>
        {
            { BiomeId.Catacombs,        "dark" },
            { BiomeId.FrozenCaverns,    "ice" },
            { BiomeId.InfernalDepths,   "fire" },
            { BiomeId.EnchantedForest,  "" },
            { BiomeId.SunkenTemple,     "" },
            { BiomeId.ShadowRealm,      "dark" },
            { BiomeId.CrystalMines,     "lightning" },
            { BiomeId.VolcanicForge,    "fire" },
            { BiomeId.HauntedCastle,    "dark" },
            { BiomeId.VoidSpire,        "dark" },
            { BiomeId.AncientLibrary,   "" },
            { BiomeId.PoisonSwamp,      "" },
            { BiomeId.CelestialGardens, "holy" },
            { BiomeId.DesertTombs,      "" },
            { BiomeId.Abyss,            "dark" },
        };

        /// <summary>Generates a batch of loot items for the given floor.</summary>
        public static List<Item> Generate(int floor, int count = 1, BiomeId? biome = null, int playerLevel = 1)
        {
            var results = new List<Item>(count);
            for (int i = 0; i < count; i++)
            {
                var tier = RarityDB.RollByFloor(floor);
                var item = PickItem(tier, floor, biome, playerLevel);
                if (item != null) results.Add(item);
            }
            return results;
        }

        /// <summary>Picks a single item instance of the target rarity, respecting biome + level.</summary>
        public static Item PickItem(RarityTier tier, int floor, BiomeId? biome, int playerLevel)
        {
            // Tier pool; fall back down to Common if nothing available.
            var pool = ItemDB.All.FindAll(it => it.Rarity == tier);
            if (pool.Count == 0) pool = ItemDB.All.FindAll(it => it.Rarity == RarityTier.Common);
            if (pool.Count == 0) return null;

            // Biome weighting — preferred element items get more weight.
            string pref = biome.HasValue && BiomePreferredElement.TryGetValue(biome.Value, out var e) ? e : "";
            int totalWeight = 0;
            var weights = new int[pool.Count];
            for (int i = 0; i < pool.Count; i++)
            {
                int w = 10;
                if (!string.IsNullOrEmpty(pref) && pool[i].Element == pref) w *= 4;
                weights[i] = w;
                totalWeight += w;
            }

            int roll = Random.Range(0, totalWeight);
            int acc = 0;
            Item chosen = pool[pool.Count - 1];
            for (int i = 0; i < pool.Count; i++)
            {
                acc += weights[i];
                if (roll < acc) { chosen = pool[i]; break; }
            }

            var clone = chosen.Clone();

            // Level requirement: higher floor -> higher lv-req, bounded by player's level+2.
            clone.LevelReq = Mathf.Clamp(Mathf.Max(1, floor / 2 + ((int)tier) * 2), 1, playerLevel + 4);

            // Variance: slight random roll on stats so drops feel unique.
            float variance = Random.Range(0.9f, 1.15f);
            clone.Atk  = Mathf.RoundToInt(clone.Atk  * variance);
            clone.Def  = Mathf.RoundToInt(clone.Def  * variance);
            clone.Hp   = Mathf.RoundToInt(clone.Hp   * variance);
            clone.Mana = Mathf.RoundToInt(clone.Mana * variance);

            // Small chance for a pre-upgraded drop on higher floors.
            if (floor >= 5 && Random.value < 0.08f)
                clone.UpgradeLevel = Random.Range(1, 1 + floor / 6);

            return clone;
        }

        /// <summary>Chest contents: 1-3 items scaled by floor.</summary>
        public static List<Item> RollChest(int floor, BiomeId? biome, int playerLevel)
        {
            int count = 1 + Random.Range(0, 3);
            return Generate(floor, count, biome, playerLevel);
        }

        /// <summary>Enemy drops: bosses always drop 4, normals occasional 0-2.</summary>
        public static List<Item> RollEnemyDrops(int floor, BiomeId? biome, int playerLevel, bool isBoss)
        {
            if (isBoss) return Generate(floor, 4, biome, playerLevel);
            float r = Random.value;
            int count = r < 0.7f ? 1 : (r < 0.9f ? 2 : 0);
            return Generate(floor, count, biome, playerLevel);
        }

        /// <summary>Shop inventory: 6-10 items biased to usefulness (fewer misc).</summary>
        public static List<Item> RollShop(int floor, BiomeId? biome, int playerLevel)
        {
            var items = Generate(floor, 8, biome, playerLevel);
            // Ensure at least one potion exists in stock.
            bool hasPotion = items.Exists(i => i.Slot == ItemSlot.Consumable);
            if (!hasPotion)
            {
                var potionPool = ItemDB.All.FindAll(i => i.Slot == ItemSlot.Consumable);
                if (potionPool.Count > 0) items.Add(potionPool[Random.Range(0, potionPool.Count)].Clone());
            }
            return items;
        }
    }
}
