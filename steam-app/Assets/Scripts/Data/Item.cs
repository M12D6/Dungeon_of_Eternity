using System.Collections.Generic;
using UnityEngine;

namespace DungeonOfEternity.Data
{
    public enum ItemSlot { Weapon, Armor, Helmet, Boots, Ring, Neck, Shield, Consumable, Scroll, Misc }

    [System.Serializable]
    public class Item
    {
        public string Id;
        public string Name;
        public ItemSlot Slot;
        public RarityTier Rarity;
        public int Atk, Def, Hp, Mana;
        public int Heal;          // consumables
        public int ManaRestore;   // consumables
        public string Spell;      // scrolls
        public string Icon;       // text label
        public int Value;
        public string UniqueId;   // runtime instance id
        public int LevelReq;
        public string Element;    // "fire" / "holy" / "poison" etc
        public int UpgradeLevel;  // +0..+15

        public Item Clone()
        {
            return new Item
            {
                Id = Id, Name = Name, Slot = Slot, Rarity = Rarity,
                Atk = Atk, Def = Def, Hp = Hp, Mana = Mana,
                Heal = Heal, ManaRestore = ManaRestore, Spell = Spell,
                Icon = Icon, Value = Value, LevelReq = LevelReq,
                Element = Element, UpgradeLevel = UpgradeLevel,
                UniqueId = System.Guid.NewGuid().ToString("N").Substring(0, 10)
            };
        }

        public int TotalAtk => Atk + UpgradeLevel * Mathf.Max(1, Atk / 8);
        public int TotalDef => Def + UpgradeLevel * Mathf.Max(1, Def / 8);
        public int TotalHp  => Hp  + UpgradeLevel * Mathf.Max(1, Hp  / 10);

        public string DisplayName => UpgradeLevel > 0 ? $"{Name} +{UpgradeLevel}" : Name;
    }

    public static class ItemDB
    {
        public static readonly List<Item> All = Build();

        static List<Item> Build()
        {
            var list = new List<Item>();
            // Weapons - Common
            W(list, "w_stick",   "Cracked Branch",   RarityTier.Common,    4,  5,  "BR");
            W(list, "w_knife",   "Rusty Knife",      RarityTier.Common,    7,  10, "KN");
            W(list, "w_sword1",  "Iron Sword",       RarityTier.Common,    12, 25, "SW");
            W(list, "w_axe1",    "Woodcutter Axe",   RarityTier.Common,    14, 30, "AX");
            W(list, "w_bow1",    "Crude Bow",        RarityTier.Common,    10, 20, "BW");
            W(list, "w_staff1",  "Apprentice Staff", RarityTier.Common,    8,  22, "ST", mana: 20);
            W(list, "w_dagger1", "Short Dagger",     RarityTier.Common,    11, 18, "DG");
            // Uncommon
            W(list, "w_sword2",  "Steel Longsword",  RarityTier.Uncommon,  22, 80, "SW");
            W(list, "w_axe2",    "Battle Axe",       RarityTier.Uncommon,  26, 90, "AX");
            W(list, "w_bow2",    "Silver Bow",       RarityTier.Uncommon,  20, 75, "BW");
            W(list, "w_staff2",  "Wizard Staff",     RarityTier.Uncommon,  16, 85, "ST", mana: 40);
            W(list, "w_hammer1", "War Hammer",       RarityTier.Uncommon,  28, 95, "HM");
            W(list, "w_spear1",  "Iron Spear",       RarityTier.Uncommon,  24, 85, "SP", def: 2);
            W(list, "w_wand1",   "Magic Wand",       RarityTier.Uncommon,  18, 90, "WN", mana: 50);
            // Rare
            W(list, "w_flamebrand", "Flamebrand",    RarityTier.Rare,      40, 250, "FL", mana: 10, elem: "fire");
            W(list, "w_frostfang",  "Frostfang",     RarityTier.Rare,      36, 240, "FR", mana: 20, elem: "ice");
            W(list, "w_stormcall",  "Stormcaller",   RarityTier.Rare,      38, 260, "SC", mana: 25, elem: "lightning");
            W(list, "w_shadowstk",  "Shadowstrike",  RarityTier.Rare,      44, 280, "SS", elem: "dark");
            W(list, "w_twin",       "Twin Blades",   RarityTier.Rare,      48, 300, "TB");
            W(list, "w_scythe1",    "Reaper Scythe", RarityTier.Rare,      50, 310, "SC", hp: 10);
            W(list, "w_trident",    "Cursed Trident",RarityTier.Rare,      42, 255, "TR", mana: 15);
            // Epic
            W(list, "w_obsidian", "Obsidian Blade",  RarityTier.Epic,      65, 700, "OB");
            W(list, "w_dragonbow","Dragonbone Bow",  RarityTier.Epic,      60, 680, "DB");
            W(list, "w_voidstaff","Void Staff",      RarityTier.Epic,      50, 720, "VS", mana: 80, elem: "dark");
            W(list, "w_soulreap", "Soulreaper",      RarityTier.Epic,      72, 750, "SR", hp: 20);
            W(list, "w_moonblade","Moonblade",       RarityTier.Epic,      68, 730, "MB", def: 5, mana: 20);
            W(list, "w_sunspear", "Sunforged Spear", RarityTier.Epic,      62, 710, "SN", def: 5, mana: 10, elem: "holy");
            W(list, "w_chaos",    "Chaos Axe",       RarityTier.Epic,      78, 780, "CX");
            // Legendary
            W(list, "w_dragonslyr","Dragonslayer",   RarityTier.Legendary, 95, 2000, "DS", hp: 50);
            W(list, "w_excalibur", "Excalibur",      RarityTier.Legendary, 105,2500, "EX", def: 10, hp: 30, mana: 20);
            W(list, "w_deathscyth","Death's Scythe", RarityTier.Legendary, 110,2800, "DS", mana: 30);
            W(list, "w_godslayer", "Godslayer",      RarityTier.Legendary, 130,3500, "GS", def: 5, hp: 20, mana: 10);
            W(list, "w_cosmicbow", "Cosmic Bow",     RarityTier.Legendary, 115,2900, "CB", mana: 40);
            // Mythic
            W(list, "w_worldend", "Worldender",      RarityTier.Mythic,    180,9999, "WE", def: 10, hp: 50, mana: 50);
            W(list, "w_creation", "Staff of Creation",RarityTier.Mythic,   150,9999, "SC", hp: 30, mana: 150);

            // Armor
            A(list, "a_rags",    "Tattered Rags",    RarityTier.Common,    5,  5,  "RG", hp: 10);
            A(list, "a_leather", "Leather Vest",     RarityTier.Common,    10, 30, "LV", hp: 20);
            A(list, "a_chain",   "Chain Mail",       RarityTier.Uncommon,  20, 90, "CM", hp: 30);
            A(list, "a_iron",    "Iron Plate",       RarityTier.Rare,      35, 250, "IP", hp: 40);
            A(list, "a_bone",    "Bone Armor",       RarityTier.Rare,      30, 260, "BN", hp: 50, mana: 10);
            A(list, "a_shadow",  "Shadow Plate",     RarityTier.Epic,      50, 700, "SP", atk: 5, hp: 60);
            A(list, "a_mithril", "Mithril Armor",    RarityTier.Epic,      60, 750, "MT", hp: 80);
            A(list, "a_dragon",  "Dragonscale Mail", RarityTier.Legendary, 85, 2200,"DM", hp: 120);
            A(list, "a_divine",  "Divine Plate",     RarityTier.Legendary, 95, 2800,"DV", atk: 5, hp: 150, mana: 30);
            A(list, "a_void",    "Void Aegis",       RarityTier.Mythic,    130,9999,"VA", atk: 10, hp: 200, mana: 50);

            // Helmets
            H(list, "h_cap",     "Cloth Cap",        RarityTier.Common,    4,  10, "CP", hp: 10, mana: 5);
            H(list, "h_iron",    "Iron Helm",        RarityTier.Uncommon,  12, 70, "IH", hp: 15);
            H(list, "h_wizard",  "Wizard Hat",       RarityTier.Uncommon,  6,  75, "WH", hp: 10, mana: 30);
            H(list, "h_horned",  "Horned Helm",      RarityTier.Rare,      20, 220,"HH", atk: 3, hp: 20);
            H(list, "h_crown",   "Crown of Thorns",  RarityTier.Epic,      30, 680,"CT", atk: 5, hp: 40, mana: 20);
            H(list, "h_dragon",  "Dragon Crown",     RarityTier.Legendary, 45, 2100,"DC", atk: 8, hp: 70, mana: 40);
            H(list, "h_godcrown","Crown of Gods",    RarityTier.Mythic,    70, 9999,"GC", atk: 15, hp: 120, mana: 80);

            // Boots
            B(list, "b_sandals", "Worn Sandals",     RarityTier.Common,    3,  8,   "SL", hp: 5);
            B(list, "b_leather", "Leather Boots",    RarityTier.Uncommon,  8,  60,  "LB", hp: 10);
            B(list, "b_iron",    "Iron Greaves",     RarityTier.Rare,      16, 210, "IG", hp: 15);
            B(list, "b_shadow",  "Shadowstep Boots", RarityTier.Epic,      22, 660, "SB", atk: 4, hp: 20);
            B(list, "b_winged",  "Winged Boots",     RarityTier.Epic,      25, 700, "WB", hp: 30, mana: 20);
            B(list, "b_eternal", "Boots of Eternity",RarityTier.Legendary, 40, 2000,"BE", atk: 5, hp: 60, mana: 30);
            B(list, "b_cosmic",  "Cosmic Treads",    RarityTier.Mythic,    65, 9999,"CT", atk: 10, hp: 100, mana: 50);

            // Rings
            R(list, "r_copper",  "Copper Ring",      RarityTier.Common,    15,  "RG", atk: 2, def: 2, hp: 8, mana: 5);
            R(list, "r_vitality","Ring of Vitality", RarityTier.Uncommon,  80,  "RV", hp: 30);
            R(list, "r_power",   "Ring of Power",    RarityTier.Rare,      220, "RP", atk: 12);
            R(list, "r_mana",    "Ring of Mana",     RarityTier.Rare,      210, "RM", mana: 40);
            R(list, "r_arcane",  "Arcane Band",      RarityTier.Epic,      680, "AB", atk: 15, def: 8, hp: 25, mana: 25);
            R(list, "r_ouroboros","Ouroboros Ring",  RarityTier.Legendary, 2200,"OR", atk: 20, def: 15, hp: 60, mana: 50);
            R(list, "r_cosmos",  "Cosmic Ring",      RarityTier.Mythic,    9999,"CR", atk: 35, def: 30, hp: 120, mana: 100);

            // Necklaces
            N(list, "n_thread",  "Lucky Thread",     RarityTier.Common,    12,  "LT", atk: 1, def: 1, hp: 5, mana: 5);
            N(list, "n_ruby",    "Ruby Pendant",     RarityTier.Uncommon,  85,  "RB", atk: 5, hp: 15);
            N(list, "n_sapphire","Sapphire Amulet",  RarityTier.Rare,      230, "SA", def: 5, hp: 20, mana: 35);
            N(list, "n_dragon",  "Dragon Heart",     RarityTier.Epic,      690, "DH", atk: 10, def: 10, hp: 40, mana: 20);
            N(list, "n_divine",  "Divine Pendant",   RarityTier.Legendary, 2300,"DP", atk: 15, def: 15, hp: 80, mana: 60);

            // Potions
            P(list, "p_tiny_hp", "Tiny HP Vial",     RarityTier.Common,    8,    heal: 30);
            P(list, "p_hp",      "HP Potion",        RarityTier.Common,    18,   heal: 70);
            P(list, "p_big_hp",  "Great HP Potion",  RarityTier.Uncommon,  50,   heal: 150);
            P(list, "p_mega_hp", "Mega HP Potion",   RarityTier.Rare,      120,  heal: 300);
            P(list, "p_mana",    "Mana Potion",      RarityTier.Common,    15,   mana: 50);
            P(list, "p_big_mana","Great Mana Potion",RarityTier.Uncommon,  45,   mana: 100);
            P(list, "p_elixir",  "Elixir of Power",  RarityTier.Epic,      500,  heal: 200, mana: 150);
            P(list, "p_divine",  "Divine Nectar",    RarityTier.Legendary, 2000, heal: 999, mana: 999);

            // Scrolls
            Sc(list, "sc_fireball",   "Scroll of Fireball",  RarityTier.Uncommon,  60,  "Fireball");
            Sc(list, "sc_freeze",     "Scroll of Ice",       RarityTier.Uncommon,  55,  "Ice Lance");
            Sc(list, "sc_lightning",  "Scroll of Thunder",   RarityTier.Rare,      150, "Chain Lightning");
            Sc(list, "sc_meteor",     "Scroll of Meteor",    RarityTier.Epic,      600, "Meteor");
            Sc(list, "sc_blizzard",   "Scroll of Blizzard",  RarityTier.Rare,      160, "Blizzard");
            Sc(list, "sc_ragnarok",   "Scroll of Ragnarok",  RarityTier.Legendary, 2500,"Ragnarok");

            // Misc collectibles
            M(list, "m_coin",    "Ancient Coin",     RarityTier.Uncommon,  50);
            M(list, "m_fang",    "Dragon Fang",      RarityTier.Rare,      120);
            M(list, "m_crystal", "Soul Crystal",     RarityTier.Epic,      350);
            M(list, "m_godstone","Godstone",         RarityTier.Mythic,    9999);

            return list;
        }

        static void W(List<Item> l, string id, string n, RarityTier r, int atk, int val, string icon,
                      int def = 0, int hp = 0, int mana = 0, string elem = "")
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Weapon, Rarity=r, Atk=atk, Def=def, Hp=hp, Mana=mana, Icon=icon, Value=val, Element=elem });

        static void A(List<Item> l, string id, string n, RarityTier r, int def, int val, string icon,
                      int atk = 0, int hp = 0, int mana = 0)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Armor, Rarity=r, Atk=atk, Def=def, Hp=hp, Mana=mana, Icon=icon, Value=val });

        static void H(List<Item> l, string id, string n, RarityTier r, int def, int val, string icon,
                      int atk = 0, int hp = 0, int mana = 0)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Helmet, Rarity=r, Atk=atk, Def=def, Hp=hp, Mana=mana, Icon=icon, Value=val });

        static void B(List<Item> l, string id, string n, RarityTier r, int def, int val, string icon,
                      int atk = 0, int hp = 0, int mana = 0)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Boots, Rarity=r, Atk=atk, Def=def, Hp=hp, Mana=mana, Icon=icon, Value=val });

        static void R(List<Item> l, string id, string n, RarityTier r, int val, string icon,
                      int atk = 0, int def = 0, int hp = 0, int mana = 0)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Ring, Rarity=r, Atk=atk, Def=def, Hp=hp, Mana=mana, Icon=icon, Value=val });

        static void N(List<Item> l, string id, string n, RarityTier r, int val, string icon,
                      int atk = 0, int def = 0, int hp = 0, int mana = 0)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Neck, Rarity=r, Atk=atk, Def=def, Hp=hp, Mana=mana, Icon=icon, Value=val });

        static void P(List<Item> l, string id, string n, RarityTier r, int val, int heal = 0, int mana = 0)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Consumable, Rarity=r, Heal=heal, ManaRestore=mana, Icon="PO", Value=val });

        static void Sc(List<Item> l, string id, string n, RarityTier r, int val, string spell)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Scroll, Rarity=r, Spell=spell, Icon="SL", Value=val });

        static void M(List<Item> l, string id, string n, RarityTier r, int val)
            => l.Add(new Item{ Id=id, Name=n, Slot=ItemSlot.Misc, Rarity=r, Icon="MS", Value=val });
    }
}
