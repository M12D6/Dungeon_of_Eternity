using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DungeonOfEternity.Data;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    public class InventoryScreen : MonoBehaviour
    {
        public RectTransform InventoryGrid;
        public GameObject ItemCardPrefab;
        public RectTransform EquipmentPanel;
        public GameObject EquipSlotPrefab;
        public TMP_Text StatsText;
        public Button CloseButton;
        public Button UpgradeWeaponButton;
        public TMP_Text UpgradeCostLabel;

        void OnEnable()
        {
            if (CloseButton) CloseButton.onClick.AddListener(Close);
            if (UpgradeWeaponButton) UpgradeWeaponButton.onClick.AddListener(() => { GameManager.Instance.UpgradeWeapon(); Redraw(); });
            GameManager.Instance.OnPlayerChanged += Redraw;
            Redraw();
        }

        void OnDisable()
        {
            if (CloseButton) CloseButton.onClick.RemoveListener(Close);
            if (GameManager.Instance != null) GameManager.Instance.OnPlayerChanged -= Redraw;
        }

        void Close() { GameManager.Instance.SetScreen(GameScreen.Game); }

        void Redraw()
        {
            var p = GameManager.Instance.Player;
            if (p == null) return;
            RebuildInventory(p);
            RebuildEquipment(p);
            if (StatsText != null)
            {
                StatsText.text =
                    "ATK " + p.TotalAtk + "\n" +
                    "DEF " + p.TotalDef + "\n" +
                    "HP  " + p.HP + "/" + p.MaxHp + "\n" +
                    "MP  " + p.Mana + "/" + p.MaxMana + "\n" +
                    "XP  " + p.Exp + "/" + p.ExpToNext;
            }
            if (UpgradeCostLabel != null)
            {
                p.Equipment.TryGetValue(ItemSlot.Weapon, out var w);
                if (w == null) UpgradeCostLabel.text = "No weapon equipped";
                else if (w.UpgradeLevel >= 15) UpgradeCostLabel.text = "Max upgrade";
                else UpgradeCostLabel.text = "Upgrade: " + (50 * (w.UpgradeLevel + 1) * (w.UpgradeLevel + 1)) + "g";
            }
        }

        void RebuildInventory(PlayerState p)
        {
            if (InventoryGrid == null || ItemCardPrefab == null) return;
            foreach (Transform t in InventoryGrid) Destroy(t.gameObject);

            foreach (var item in p.Inventory)
            {
                var go = Instantiate(ItemCardPrefab, InventoryGrid);
                PopulateItemCard(go, item, p);
            }
        }

        void PopulateItemCard(GameObject go, Item item, PlayerState p)
        {
            // Populate child TMP_Text labels by name if present.
            SetText(go, "NameText", item.DisplayName);
            SetText(go, "RarityText", RarityDB.All[item.Rarity].Name);
            SetText(go, "StatsText", BuildStatsLine(item));
            SetText(go, "ValueText", item.Value + "g");

            var img = go.GetComponent<Image>();
            if (img != null)
            {
                var c = RarityDB.All[item.Rarity].Glow;
                img.color = c;
            }

            WireButton(go, "EquipButton", () => { GameManager.Instance.EquipItem(item); });
            WireButton(go, "UseButton",   () => { GameManager.Instance.UseConsumable(item); });
            WireButton(go, "DropButton",  () => { GameManager.Instance.DropItem(item); });
        }

        void RebuildEquipment(PlayerState p)
        {
            if (EquipmentPanel == null || EquipSlotPrefab == null) return;
            foreach (Transform t in EquipmentPanel) Destroy(t.gameObject);

            var slots = new ItemSlot[] { ItemSlot.Weapon, ItemSlot.Armor, ItemSlot.Helmet, ItemSlot.Boots, ItemSlot.Ring, ItemSlot.Neck };
            foreach (var s in slots)
            {
                var go = Instantiate(EquipSlotPrefab, EquipmentPanel);
                p.Equipment.TryGetValue(s, out var eq);
                SetText(go, "SlotText", s.ToString());
                SetText(go, "ItemText", eq == null ? "(empty)" : eq.DisplayName);
                WireButton(go, "UnequipButton", () => GameManager.Instance.UnequipItem(s));
            }
        }

        string BuildStatsLine(Item item)
        {
            var sb = new System.Text.StringBuilder();
            if (item.TotalAtk > 0) sb.Append("+" + item.TotalAtk + " ATK  ");
            if (item.TotalDef > 0) sb.Append("+" + item.TotalDef + " DEF  ");
            if (item.TotalHp  > 0) sb.Append("+" + item.TotalHp  + " HP  ");
            if (item.Mana     > 0) sb.Append("+" + item.Mana     + " MP  ");
            if (item.Heal     > 0) sb.Append("Heals " + item.Heal + "  ");
            if (item.ManaRestore > 0) sb.Append("Restores " + item.ManaRestore + " MP  ");
            if (!string.IsNullOrEmpty(item.Spell)) sb.Append("Teaches " + item.Spell);
            if (item.LevelReq > 0) sb.Append("  [Lv." + item.LevelReq + "]");
            return sb.ToString();
        }

        void SetText(GameObject root, string childName, string value)
        {
            var t = root.transform.Find(childName);
            if (t == null) return;
            var tmp = t.GetComponent<TMP_Text>();
            if (tmp != null) tmp.text = value;
        }

        void WireButton(GameObject root, string childName, System.Action act)
        {
            var t = root.transform.Find(childName);
            if (t == null) return;
            var btn = t.GetComponent<Button>();
            if (btn == null) return;
            btn.onClick.RemoveAllListeners();
            btn.onClick.AddListener(() => act());
        }
    }
}
