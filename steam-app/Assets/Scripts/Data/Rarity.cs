using UnityEngine;
using System.Collections.Generic;

namespace DungeonOfEternity.Data
{
    public enum RarityTier
    {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary,
        Mythic,
        Unique
    }

    [System.Serializable]
    public class RarityInfo
    {
        public string Name;
        public Color Color;
        public Color Glow;
        public int Weight;
        public float StatMult;

        public RarityInfo(string name, string hex, string glow, int weight, float mult)
        {
            Name = name;
            Color = HexToColor(hex);
            Glow = HexToColor(glow);
            Weight = weight;
            StatMult = mult;
        }

        static Color HexToColor(string hex)
        {
            if (hex.StartsWith("#")) hex = hex.Substring(1);
            if (hex.Length == 6) hex += "FF";
            byte r = System.Convert.ToByte(hex.Substring(0, 2), 16);
            byte g = System.Convert.ToByte(hex.Substring(2, 2), 16);
            byte b = System.Convert.ToByte(hex.Substring(4, 2), 16);
            byte a = System.Convert.ToByte(hex.Substring(6, 2), 16);
            return new Color32(r, g, b, a);
        }
    }

    public static class RarityDB
    {
        public static readonly Dictionary<RarityTier, RarityInfo> All = new Dictionary<RarityTier, RarityInfo>
        {
            { RarityTier.Common,    new RarityInfo("Common",    "#9ca3af", "#9ca3af33", 100, 1.0f) },
            { RarityTier.Uncommon,  new RarityInfo("Uncommon",  "#22c55e", "#22c55e44",  50, 1.4f) },
            { RarityTier.Rare,      new RarityInfo("Rare",      "#3b82f6", "#3b82f655",  22, 2.0f) },
            { RarityTier.Epic,      new RarityInfo("Epic",      "#a855f7", "#a855f766",   9, 3.0f) },
            { RarityTier.Legendary, new RarityInfo("Legendary", "#f97316", "#f9731677",   3, 4.5f) },
            { RarityTier.Mythic,    new RarityInfo("Mythic",    "#ef4444", "#ef444488",   1, 7.0f) },
            { RarityTier.Unique,    new RarityInfo("Unique",    "#fcd34d", "#fcd34d88",   1, 6.0f) },
        };

        public static RarityTier RollByFloor(int floor)
        {
            float roll = Random.Range(0f, 100f) + floor * 2f;
            if (roll > 115) return RarityTier.Mythic;
            if (roll > 100) return RarityTier.Unique;
            if (roll > 95)  return RarityTier.Legendary;
            if (roll > 78)  return RarityTier.Epic;
            if (roll > 58)  return RarityTier.Rare;
            if (roll > 35)  return RarityTier.Uncommon;
            return RarityTier.Common;
        }
    }
}
