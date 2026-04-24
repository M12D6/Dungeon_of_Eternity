using UnityEngine;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity
{
    /// <summary>
    /// Tiny bootstrap: place this on one GameObject in MainScene.
    /// It ensures GameManager and SteamManager exist.
    /// </summary>
    public class Bootstrap : MonoBehaviour
    {
        public GameObject GameManagerPrefab;
        public GameObject SteamManagerPrefab;

        void Awake()
        {
            if (GameManager.Instance == null)
            {
                if (GameManagerPrefab != null) Instantiate(GameManagerPrefab);
                else
                {
                    var go = new GameObject("GameManager");
                    go.AddComponent<GameManager>();
                }
            }

#if !UNITY_EDITOR
            if (SteamManagerPrefab != null && Steam.SteamManager.Instance == null)
                Instantiate(SteamManagerPrefab);
#endif
        }
    }
}
