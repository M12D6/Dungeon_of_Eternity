using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DungeonOfEternity.Data;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    /// <summary>
    /// Renders 8 class cards. Click selects; confirm button starts new game.
    /// </summary>
    public class CharSelectScreen : MonoBehaviour
    {
        public RectTransform CardContainer;
        public GameObject ClassCardPrefab;  // Must have a Button + TMP_Text children named "NameText", "DescText", "StatsText"
        public TMP_InputField NameInput;
        public Button ConfirmButton;
        public Button BackButton;

        ClassId? selected;
        System.Collections.Generic.List<Button> cards = new System.Collections.Generic.List<Button>();

        void Start()
        {
            if (BackButton) BackButton.onClick.AddListener(() => GameManager.Instance.SetScreen(GameScreen.Title));
            if (ConfirmButton)
            {
                ConfirmButton.onClick.AddListener(OnConfirm);
                ConfirmButton.interactable = false;
            }
            BuildCards();
        }

        void BuildCards()
        {
            if (CardContainer == null || ClassCardPrefab == null) return;
            foreach (Transform t in CardContainer) Destroy(t.gameObject);
            cards.Clear();

            foreach (var kv in ClassDB.All)
            {
                var cls = kv.Value;
                var go = Instantiate(ClassCardPrefab, CardContainer);
                var btn = go.GetComponent<Button>();
                if (btn == null) btn = go.AddComponent<Button>();

                // Try populate text labels by name
                SetText(go, "NameText", cls.Name);
                SetText(go, "DescText", cls.Description);
                SetText(go, "StatsText",
                    "HP " + cls.Stats.HP + "   MP " + cls.Stats.Mana + "\n" +
                    "ATK " + cls.Stats.Atk + "   DEF " + cls.Stats.Def + "\n" +
                    "SPD " + cls.Stats.Spd + "   CRIT " + cls.Stats.Crit + "%");

                var image = go.GetComponent<Image>();
                if (image != null) image.color = new Color(0.1f, 0.1f, 0.12f, 0.9f);

                ClassId id = cls.Id;
                btn.onClick.AddListener(() => Select(id, image, cls));
                cards.Add(btn);
            }
        }

        void SetText(GameObject root, string childName, string value)
        {
            var t = root.transform.Find(childName);
            if (t == null) return;
            var tmp = t.GetComponent<TMP_Text>();
            if (tmp != null) tmp.text = value;
        }

        void Select(ClassId id, Image image, CharacterClass cls)
        {
            selected = id;
            if (ConfirmButton) ConfirmButton.interactable = true;
            foreach (var c in cards)
            {
                var img = c.GetComponent<Image>();
                if (img != null) img.color = new Color(0.1f, 0.1f, 0.12f, 0.9f);
            }
            if (image != null) image.color = cls.GetColor() * 0.5f;
        }

        void OnConfirm()
        {
            if (!selected.HasValue) return;
            string n = NameInput != null ? NameInput.text : "Hero";
            GameManager.Instance.StartNewGame(string.IsNullOrWhiteSpace(n) ? "Hero" : n, selected.Value);
        }
    }
}
