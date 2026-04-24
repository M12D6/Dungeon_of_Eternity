using System.Collections.Generic;

namespace DungeonOfEternity.Data
{
    public enum EffectKind { DoT, Buff, Debuff, CC }

    [System.Serializable]
    public class StatusEffect
    {
        public StatusType Id;
        public string Name;
        public string Icon;
        public string ColorHex;
        public EffectKind Kind;
        public float DmgPct;
        public string Description;

        public StatusEffect(StatusType id, string name, string icon, string color, EffectKind kind, float dmgPct, string desc)
        {
            Id = id; Name = name; Icon = icon; ColorHex = color; Kind = kind; DmgPct = dmgPct; Description = desc;
        }
    }

    public static class StatusDB
    {
        public static readonly Dictionary<StatusType, StatusEffect> All = Build();

        static Dictionary<StatusType, StatusEffect> Build()
        {
            var d = new Dictionary<StatusType, StatusEffect>();
            Add(d, new StatusEffect(StatusType.Burn,     "Burn",     "F", "#f97316", EffectKind.DoT,    0.08f, "Takes fire dmg each turn"));
            Add(d, new StatusEffect(StatusType.Poison,   "Poison",   "P", "#4ade80", EffectKind.DoT,    0.06f, "Slow poison drain"));
            Add(d, new StatusEffect(StatusType.Bleed,    "Bleed",    "B", "#dc2626", EffectKind.DoT,    0.10f, "Bleeds HP each turn"));
            Add(d, new StatusEffect(StatusType.Curse,    "Curse",    "C", "#8b5cf6", EffectKind.DoT,    0.07f, "Dark curse eats soul"));
            Add(d, new StatusEffect(StatusType.Stun,     "Stun",     "!", "#fbbf24", EffectKind.CC,     0.0f,  "Skips next turn"));
            Add(d, new StatusEffect(StatusType.Freeze,   "Freeze",   "*", "#60a5fa", EffectKind.CC,     0.0f,  "Frozen, cannot act"));
            Add(d, new StatusEffect(StatusType.Mark,     "Mark",     "X", "#8b5cf6", EffectKind.Debuff, 0.0f,  "Next attack = instant kill"));
            Add(d, new StatusEffect(StatusType.AtkBuff,  "Empower",  "^", "#f59e0b", EffectKind.Buff,   0.0f,  "+40% ATK"));
            Add(d, new StatusEffect(StatusType.DefBuff,  "Bulwark",  "#", "#3b82f6", EffectKind.Buff,   0.0f,  "+50% DEF"));
            Add(d, new StatusEffect(StatusType.DodgeBuff,"Evasion",  "~", "#22c55e", EffectKind.Buff,   0.0f,  "+50% dodge"));
            Add(d, new StatusEffect(StatusType.Lich,     "Lich Form","L", "#8b5cf6", EffectKind.Buff,   0.0f,  "+100% all stats"));
            Add(d, new StatusEffect(StatusType.Frenzy,   "Frenzy",   "R", "#dc2626", EffectKind.Buff,   0.0f,  "+60% ATK, -30% DEF"));
            Add(d, new StatusEffect(StatusType.Haste,    "Haste",    ">", "#06b6d4", EffectKind.Buff,   0.0f,  "Extra turn chance"));
            Add(d, new StatusEffect(StatusType.Regen,    "Regen",    "+", "#22c55e", EffectKind.Buff,   0.0f,  "Heals over time"));
            return d;
        }

        static void Add(Dictionary<StatusType, StatusEffect> d, StatusEffect e) => d[e.Id] = e;
    }
}
