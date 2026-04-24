using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DungeonOfEternity.Data;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    public class ShopScreen : MonoBehaviour
    {
        public RectTransform ShopGrid;
        public RectTransform SellGrid;
        public GameObject ItemCardPrefab;
        public TMP_Text GoldLabel;
        public Button LeaveButton;

        void OnEnable()
        {
            if (LeaveButton) LeaveButton.onClick.AddListener(Leave);
            GameManager.Instance.OnPlayerChanged += Redraw;
            Redraw();
        }

        void OnDisable()
        {
            if (LeaveButton) LeaveButton.onClick.RemoveListener(Leave);
            if (GameManager.Instance != null) GameManager.Instance.OnPlayerChanged -= Redraw;
        }

        void Leave() { GameManager.Instance.SetScreen(GameScreen.Game); }

        void Redraw()
        {
            var gm = GameManager.Instance;
            if (gm.Player == null) return;
            if (GoldLabel) GoldLabel.text = gm.Player.Gold + "g";
            Populate(ShopGrid, gm.ShopItems, buy: true);
            Populate(SellGrid, gm.Player.Inventory, buy: false);
        }

        void Populate(RectTransform grid, System.Collections.Generic.IEnumerable<Item> items, bool buy)
        {
            if (grid == null || ItemCardPrefab == null) return;
            foreach (Transform t in grid) Destroy(t.gameObject);
            foreach (var item in items)
            {
                var go = Instantiate(ItemCardPrefab, grid);
                SetText(go, "NameText", item.DisplayName);
                SetText(go, "RarityText", RarityDB.All[item.Rarity].Name);
                SetText(go, "ValueText", buy ? item.Value + "g" : Mathf.FloorToInt(item.Value * 0.4f) + "g");

                var img = go.GetComponent<Image>();
                if (img != null) img.color = RarityDB.All[item.Rarity].Glow;

                var btn = go.GetComponent<Button>();
                if (btn == null) btn = go.GetComponentInChildren<Button>();
                if (btn != null)
                {
                    Item captured = item;
                    btn.onClick.RemoveAllListeners();
                    if (buy) btn.onClick.AddListener(() => GameManager.Instance.BuyItem(captured));
                    else     btn.onClick.AddListener(() => GameManager.Instance.SellItem(captured));
                }
            }
        }

        void SetText(GameObject root, string childName, string value)
        {
            var t = root.transform.Find(childName);
            if (t == null) return;
            var tmp = t.GetComponent<TMP_Text>();
            if (tmp != null) tmp.text = value;
        }
    }
}
