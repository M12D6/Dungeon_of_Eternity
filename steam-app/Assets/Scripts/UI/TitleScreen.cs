using UnityEngine;
using UnityEngine.UI;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    public class TitleScreen : MonoBehaviour
    {
        public Button NewGameButton;
        public Button LoadGameButton;
        public Button QuitButton;

        void Awake()
        {
            if (NewGameButton) NewGameButton.onClick.AddListener(() => GameManager.Instance.SetScreen(GameScreen.CharSelect));
            if (LoadGameButton) LoadGameButton.onClick.AddListener(OnLoad);
            if (QuitButton) QuitButton.onClick.AddListener(() => Application.Quit());
        }

        void OnLoad()
        {
            string path = Application.persistentDataPath + "/save.json";
            if (!System.IO.File.Exists(path)) return;
            string json = System.IO.File.ReadAllText(path);
            GameManager.Instance.LoadFromJson(json);
        }
    }
}
