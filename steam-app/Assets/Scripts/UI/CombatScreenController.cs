using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DungeonOfEternity.Data;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    public class CombatScreenController : MonoBehaviour
    {
        [Header("Enemy")]
        public TMP_Text EnemyName;
        public TMP_Text EnemyAscii;
        public Slider EnemyHp;
        public TMP_Text EnemyStatus;

        [Header("Player")]
        public TMP_Text PlayerName;
        public Slider PlayerHp;
        public Slider PlayerMp;

        [Header("Log")]
        public RectTransform LogContent;
        public GameObject LogLinePrefab;

        [Header("Buttons")]
        public Button AttackButton;
        public Button FleeButton;
        public Button ItemButton;
        public RectTransform SpellGrid;
        public GameObject SpellButtonPrefab;

        void OnEnable()
        {
            GameManager.Instance.OnCombatChanged += Redraw;
            GameManager.Instance.OnPlayerChanged += Redraw;
            GameManager.Instance.OnMessageAdded += AppendLog;
            if (AttackButton) AttackButton.onClick.AddListener(OnAttack);
            if (FleeButton)   FleeButton.onClick.AddListener(OnFlee);
            Redraw();
        }

        void OnDisable()
        {
            if (GameManager.Instance == null) return;
            GameManager.Instance.OnCombatChanged -= Redraw;
            GameManager.Instance.OnPlayerChanged -= Redraw;
            GameManager.Instance.OnMessageAdded -= AppendLog;
            if (AttackButton) AttackButton.onClick.RemoveListener(OnAttack);
            if (FleeButton)   FleeButton.onClick.RemoveListener(OnFlee);
        }

        void OnAttack() { GameManager.Instance.DoPlayerAction(CombatAction.Attack); }
        void OnFlee()   { GameManager.Instance.DoPlayerAction(CombatAction.Flee); }

        void Redraw()
        {
            var gm = GameManager.Instance;
            var e = gm.CurrentCombatEnemy;
            var p = gm.Player;
            if (e == null || p == null) return;

            if (EnemyName)   EnemyName.text = (e.IsBoss ? "BOSS: " : "") + e.Name;
            if (EnemyAscii)  EnemyAscii.text = e.Art;
            if (EnemyHp)   { EnemyHp.maxValue = e.MaxHP; EnemyHp.value = e.HP; }
            if (EnemyStatus) EnemyStatus.text = e.Status == StatusType.None ? "" : e.Status.ToString();

            if (PlayerName) PlayerName.text = p.Name + " Lv." + p.Level;
            if (PlayerHp) { PlayerHp.maxValue = p.MaxHp;   PlayerHp.value = p.HP; }
            if (PlayerMp) { PlayerMp.maxValue = p.MaxMana; PlayerMp.value = p.Mana; }

            RebuildSpells();
        }

        void RebuildSpells()
        {
            if (SpellGrid == null || SpellButtonPrefab == null) return;
            foreach (Transform t in SpellGrid) Destroy(t.gameObject);
            var p = GameManager.Instance.Player;
            if (p == null) return;

            foreach (var spellName in p.Spells)
            {
                if (!SpellDB.All.TryGetValue(spellName, out var sp)) continue;
                var go = Instantiate(SpellButtonPrefab, SpellGrid);
                var btn = go.GetComponent<Button>();
                var label = go.GetComponentInChildren<TMP_Text>();
                if (label != null) label.text = sp.Icon + " " + sp.Name + "\n" + sp.ManaCost + " MP";
                bool canCast = p.Mana >= sp.ManaCost;
                if (btn != null)
                {
                    btn.interactable = canCast;
                    string n = spellName;
                    btn.onClick.AddListener(() => GameManager.Instance.DoPlayerAction(CombatAction.Spell, n));
                }
            }
        }

        void AppendLog(CombatMessage m)
        {
            if (LogContent == null || LogLinePrefab == null) return;
            if (GameManager.Instance.Screen != GameScreen.Combat) return;
            var line = Instantiate(LogLinePrefab, LogContent);
            var t = line.GetComponentInChildren<TMP_Text>();
            if (t != null)
            {
                t.text = m.Text;
                if (ColorUtility.TryParseHtmlString(m.Color, out var c)) t.color = c;
            }
            while (LogContent.childCount > 40)
                Destroy(LogContent.GetChild(0).gameObject);
        }
    }
}
