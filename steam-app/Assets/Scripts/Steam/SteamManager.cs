using UnityEngine;

namespace DungeonOfEternity.Steam
{
    /// <summary>
    /// Stub SteamManager — wire up to Steamworks.NET once the package is imported.
    /// When the Steamworks.NET package is present, add the STEAMWORKS_NET define and
    /// this will call SteamAPI.Init() / SteamAPI.RunCallbacks() / SteamAPI.Shutdown().
    /// Until then, this is a no-op so the game runs fine outside of Steam.
    /// </summary>
    public class SteamManager : MonoBehaviour
    {
        public static SteamManager Instance { get; private set; }
        public bool IsSteamRunning { get; private set; }
        public uint AppId = 480; // Placeholder (Spacewar). Replace with real AppID after Steam registration.

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);

#if STEAMWORKS_NET
            try
            {
                if (Steamworks.SteamAPI.RestartAppIfNecessary((Steamworks.AppId_t)AppId))
                {
                    Application.Quit();
                    return;
                }
                IsSteamRunning = Steamworks.SteamAPI.Init();
                Debug.Log("Steam init: " + IsSteamRunning);
            }
            catch (System.Exception e) { Debug.LogError("Steam init failed: " + e); }
#else
            IsSteamRunning = false;
#endif
        }

        void Update()
        {
#if STEAMWORKS_NET
            if (IsSteamRunning) Steamworks.SteamAPI.RunCallbacks();
#endif
        }

        void OnApplicationQuit()
        {
#if STEAMWORKS_NET
            if (IsSteamRunning) Steamworks.SteamAPI.Shutdown();
#endif
        }

        /// <summary>Grants a Steam achievement by API name. No-op if Steam isn't running.</summary>
        public void UnlockAchievement(string apiName)
        {
#if STEAMWORKS_NET
            if (!IsSteamRunning) return;
            Steamworks.SteamUserStats.SetAchievement(apiName);
            Steamworks.SteamUserStats.StoreStats();
#endif
        }
    }
}
