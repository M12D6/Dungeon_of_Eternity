using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    public class GameOverScreen : MonoBehaviour
    {
        public TMP_Text SummaryText;
        public Button ReturnButton;
        public Button QuitButton;

        void OnEnable()
        {
            if (ReturnButton) ReturnButton.onClick.AddListener(OnReturn);
            if (QuitButton)   QuitButton.onClick.AddListener(() => Application.Quit());
            UpdateSummary();
        }

        void OnDisable()
        {
            if (ReturnButton) ReturnButton.onClick.RemoveListener(OnReturn);
        }

        void OnReturn()
        {
            GameManager.Instance.SetScreen(GameScreen.Title);
        }

        void UpdateSummary()
        {
            var p = GameManager.Instance.Player;
            if (p == null || SummaryText == null) return;
            SummaryText.text =
                "You Have Fallen\n" +
                "Floor reached: " + GameManager.Instance.Floor + "\n" +
                "Level: " + p.Level + "\n" +
                "Kills: " + p.Kills + " (Bosses: " + p.BossKills + ")\n" +
                "Floors cleared: " + p.FloorsCleared + "\n" +
                "Gold: " + p.Gold;
        }
    }
}
