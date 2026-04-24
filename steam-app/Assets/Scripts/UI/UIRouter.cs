using UnityEngine;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    /// <summary>
    /// Shows/hides the panel associated with each GameScreen.
    /// Drag the panel GameObjects onto these fields in the inspector.
    /// </summary>
    public class UIRouter : MonoBehaviour
    {
        public GameObject TitlePanel;
        public GameObject CharSelectPanel;
        public GameObject GamePanel;
        public GameObject CombatPanel;
        public GameObject InventoryPanel;
        public GameObject ShopPanel;
        public GameObject GameOverPanel;
        public GameObject PausePanel;

        void OnEnable()
        {
            if (GameManager.Instance != null)
                GameManager.Instance.OnScreenChanged += HandleScreen;
        }

        void OnDisable()
        {
            if (GameManager.Instance != null)
                GameManager.Instance.OnScreenChanged -= HandleScreen;
        }

        void Start()
        {
            // Initial state
            HandleScreen(GameManager.Instance != null ? GameManager.Instance.Screen : GameScreen.Title);
        }

        void HandleScreen(GameScreen s)
        {
            if (TitlePanel)      TitlePanel.SetActive(s == GameScreen.Title);
            if (CharSelectPanel) CharSelectPanel.SetActive(s == GameScreen.CharSelect);
            if (GamePanel)       GamePanel.SetActive(s == GameScreen.Game);
            if (CombatPanel)     CombatPanel.SetActive(s == GameScreen.Combat);
            if (InventoryPanel)  InventoryPanel.SetActive(s == GameScreen.Inventory);
            if (ShopPanel)       ShopPanel.SetActive(s == GameScreen.Shop);
            if (GameOverPanel)   GameOverPanel.SetActive(s == GameScreen.GameOver);
            if (PausePanel)      PausePanel.SetActive(s == GameScreen.Pause);
        }
    }
}
