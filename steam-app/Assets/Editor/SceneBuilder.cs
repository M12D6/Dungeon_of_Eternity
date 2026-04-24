using System.IO;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEditor;
using UnityEditor.SceneManagement;
using TMPro;
using DungeonOfEternity;
using DungeonOfEternity.UI;

namespace DungeonOfEternity.EditorTools
{
    /// <summary>
    /// One-click builder that creates the full Canvas + panels + prefabs
    /// and wires every controller in MainScene.
    /// Menu: Tools > Dungeon Of Eternity > Build Main Scene
    /// </summary>
    public static class SceneBuilder
    {
        const string ScenePath = "Assets/Scenes/MainScene.unity";
        const string PrefabDir = "Assets/Prefabs";

        // Dark-fantasy palette, tuned for AAA-ish contrast rather than muddy greys.
        static readonly Color ColBgDeep  = new Color(0.03f, 0.03f, 0.05f, 1f);
        static readonly Color ColBg      = new Color(0.07f, 0.07f, 0.10f, 1f);
        static readonly Color ColPanel   = new Color(0.11f, 0.11f, 0.15f, 0.92f);
        static readonly Color ColPanel2  = new Color(0.16f, 0.16f, 0.21f, 0.98f);
        static readonly Color ColPanelHi = new Color(0.22f, 0.22f, 0.30f, 1.00f);
        static readonly Color ColAccent  = new Color(1.00f, 0.78f, 0.26f, 1f); // warm gold
        static readonly Color ColAccent2 = new Color(0.28f, 0.79f, 0.89f, 1f); // cold teal / mana
        static readonly Color ColDanger  = new Color(0.89f, 0.26f, 0.30f, 1f); // blood red / HP
        static readonly Color ColDanger2 = new Color(0.55f, 0.10f, 0.10f, 1f);
        static readonly Color ColGood    = new Color(0.50f, 0.87f, 0.52f, 1f); // XP / heal green
        static readonly Color ColMuted   = new Color(0.58f, 0.58f, 0.65f, 1f);
        static readonly Color ColText    = new Color(0.94f, 0.93f, 0.88f, 1f); // warm parchment white
        static readonly Color ColBorder  = new Color(1.00f, 0.78f, 0.26f, 0.35f);

        // Cached procedural sprites (built first run, reused after).
        static Sprite _roundedSprite;
        static Sprite _vignetteSprite;
        static Sprite _gradientSprite;

        [MenuItem("Tools/Dungeon Of Eternity/Build Main Scene")]
        public static void Build()
        {
            // Freeze asset import & domain reloads while we build.
            // This is THE most common reason Unity leaves a half-written scene on disk —
            // a recompile kicks in mid-save, the editor tears the domain down, and the
            // YAML writer never gets to flush.
            EditorApplication.LockReloadAssemblies();
            AssetDatabase.StartAssetEditing();

            Scene scene = default;
            try
            {
                Debug.Log("[SceneBuilder] Starting build...");

                // Sanity: TMP Essentials imported?
                bool tmpReady = false;
                try { tmpReady = TMP_Settings.instance != null && TMP_Settings.defaultFontAsset != null; }
                catch { tmpReady = false; }
                if (!tmpReady)
                {
                    EditorUtility.DisplayDialog(
                        "TMP Essentials missing",
                        "TextMesh Pro essential resources are not imported yet.\n\n" +
                        "Go to:  Window -> TextMeshPro -> Import TMP Essential Resources.\n\n" +
                        "Then run this builder again.",
                        "OK");
                    return;
                }

                if (!AssetDatabase.IsValidFolder(PrefabDir))
                    AssetDatabase.CreateFolder("Assets", "Prefabs");

                // --- Open / load scene ---
                scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
                if (!scene.IsValid())
                {
                    Debug.LogError("[SceneBuilder] Could not open " + ScenePath);
                    return;
                }
                Debug.Log("[SceneBuilder] Scene opened.");

                // --- Build prefabs (as .prefab assets on disk) BEFORE wiring ---
                var tileCellPrefab    = BuildTileCellPrefab();
                var logLinePrefab     = BuildLogLinePrefab();
                var classCardPrefab   = BuildClassCardPrefab();
                var itemCardPrefab    = BuildItemCardPrefab();
                var equipSlotPrefab   = BuildEquipSlotPrefab();
                var spellButtonPrefab = BuildSpellButtonPrefab();
                Debug.Log("[SceneBuilder] Prefabs built.");

                // --- Clean any prior Canvas (safe re-runs) ---
                foreach (var c in Object.FindObjectsOfType<Canvas>())
                    Object.DestroyImmediate(c.gameObject);

                // --- Ensure Bootstrap GO with working Bootstrap component ---
                var bootstrap = GameObject.Find("Bootstrap");
                if (bootstrap == null)
                {
                    bootstrap = new GameObject("Bootstrap");
                    SceneManager.MoveGameObjectToScene(bootstrap, scene);
                }
                GameObjectUtility.RemoveMonoBehavioursWithMissingScript(bootstrap);
                if (bootstrap.GetComponent<Bootstrap>() == null)
                    bootstrap.AddComponent<Bootstrap>();
                // Strip any old UIRouter so we rewire fresh
                var oldRouter = bootstrap.GetComponent<UIRouter>();
                if (oldRouter != null) Object.DestroyImmediate(oldRouter);

                // --- Ensure EventSystem (destroy any existing one and rebuild clean) ---
                foreach (var oldEs in Object.FindObjectsOfType<EventSystem>())
                    Object.DestroyImmediate(oldEs.gameObject);
                var esGO = new GameObject("EventSystem");
                SceneManager.MoveGameObjectToScene(esGO, scene);
                esGO.AddComponent<EventSystem>();
                esGO.AddComponent<StandaloneInputModule>();

                // --- Canvas root ---
                var canvasGO = new GameObject("Canvas",
                    typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
                // CRITICAL: park it in our scene. Otherwise `new GameObject` can land in an
                // untitled scene during certain editor states, and SaveScene won't write it.
                SceneManager.MoveGameObjectToScene(canvasGO, scene);

                var canvas = canvasGO.GetComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                canvas.sortingOrder = 0;
                var scaler = canvasGO.GetComponent<CanvasScaler>();
                scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                scaler.referenceResolution = new Vector2(1920, 1080);
                scaler.matchWidthOrHeight = 0.5f;

                // --- Backdrop: deep solid + downward gradient + radial vignette ---
                var bgRoot = MakeUIObject("Background", canvasGO.transform, typeof(RectTransform));
                StretchAnchors(bgRoot.GetComponent<RectTransform>());

                var bgFill = MakeUIObject("BG_Base", bgRoot.transform, typeof(Image));
                var bgFillImg = bgFill.GetComponent<Image>();
                bgFillImg.color = ColBgDeep;
                bgFillImg.raycastTarget = false;
                StretchAnchors(bgFill.GetComponent<RectTransform>());

                var bgGrad = MakeUIObject("BG_Gradient", bgRoot.transform, typeof(Image));
                var bgGradImg = bgGrad.GetComponent<Image>();
                bgGradImg.sprite = GradientSprite;
                bgGradImg.color = new Color(0.12f, 0.06f, 0.05f, 0.75f); // warm ember wash up top
                bgGradImg.raycastTarget = false;
                StretchAnchors(bgGrad.GetComponent<RectTransform>());

                var bgVig = MakeUIObject("BG_Vignette", bgRoot.transform, typeof(Image));
                var bgVigImg = bgVig.GetComponent<Image>();
                bgVigImg.sprite = VignetteSprite;
                bgVigImg.color = new Color(0, 0, 0, 0.85f);
                bgVigImg.raycastTarget = false;
                StretchAnchors(bgVig.GetComponent<RectTransform>());

                // --- Panels ---
                Debug.Log("[SceneBuilder] Building panels...");
                var titlePanel     = BuildTitlePanel(canvasGO.transform);
                var charSelectPanel= BuildCharSelectPanel(canvasGO.transform, classCardPrefab);
                var gamePanel      = BuildGamePanel(canvasGO.transform, tileCellPrefab, logLinePrefab);
                var combatPanel    = BuildCombatPanel(canvasGO.transform, logLinePrefab, spellButtonPrefab);
                var inventoryPanel = BuildInventoryPanel(canvasGO.transform, itemCardPrefab, equipSlotPrefab);
                var shopPanel      = BuildShopPanel(canvasGO.transform, itemCardPrefab);
                var gameOverPanel  = BuildGameOverPanel(canvasGO.transform);
                Debug.Log("[SceneBuilder] Panels built.");

                // Start with only title visible
                titlePanel.SetActive(true);
                charSelectPanel.SetActive(false);
                gamePanel.SetActive(false);
                combatPanel.SetActive(false);
                inventoryPanel.SetActive(false);
                shopPanel.SetActive(false);
                gameOverPanel.SetActive(false);

                // --- UIRouter on Bootstrap, wired ---
                var router = bootstrap.AddComponent<UIRouter>();
                router.TitlePanel      = titlePanel;
                router.CharSelectPanel = charSelectPanel;
                router.GamePanel       = gamePanel;
                router.CombatPanel     = combatPanel;
                router.InventoryPanel  = inventoryPanel;
                router.ShopPanel       = shopPanel;
                router.GameOverPanel   = gameOverPanel;

                EditorUtility.SetDirty(router);
                EditorUtility.SetDirty(bootstrap);

                // --- Verify before save ---
                if (canvasGO.scene != scene)
                {
                    Debug.LogError("[SceneBuilder] Canvas is NOT in the target scene. Aborting save to avoid corruption.");
                    return;
                }

                // --- Save ---
                EditorSceneManager.MarkSceneDirty(scene);
                bool saved = EditorSceneManager.SaveScene(scene, ScenePath, false);
                if (!saved)
                {
                    Debug.LogError("[SceneBuilder] SaveScene returned FALSE. Scene may not have persisted.");
                    return;
                }
                Debug.Log("[SceneBuilder] Scene saved to " + ScenePath);

                EditorUtility.DisplayDialog(
                    "Dungeon Of Eternity",
                    "Scene built successfully!\n\n" +
                    "Press Play to see the Title Screen.\n" +
                    "Canvas, 7 panels, and 6 prefabs are now in place.",
                    "OK");
            }
            catch (System.Exception ex)
            {
                Debug.LogError("[SceneBuilder] FAILED: " + ex);
                EditorUtility.DisplayDialog(
                    "Dungeon Of Eternity - Build failed",
                    "Something went wrong:\n\n" + ex.Message +
                    "\n\nCheck the Console for a full stack trace.",
                    "OK");
            }
            finally
            {
                AssetDatabase.StopAssetEditing();
                AssetDatabase.SaveAssets();
                EditorApplication.UnlockReloadAssemblies();
                AssetDatabase.Refresh();
            }
        }

        // =====================================================================
        // PANEL BUILDERS
        // =====================================================================

        static GameObject BuildTitlePanel(Transform parent)
        {
            // Make the title panel itself transparent so the atmospheric background shows through.
            var panelGO = MakeUIObject("TitlePanel", parent, typeof(RectTransform));
            StretchAnchors(panelGO.GetComponent<RectTransform>());
            var ctrl = panelGO.AddComponent<TitleScreen>();

            // Glow behind the title — a second vignette, warm.
            var glow = MakeUIObject("TitleGlow", panelGO.transform, typeof(Image));
            var glowImg = glow.GetComponent<Image>();
            glowImg.sprite = VignetteSprite;
            glowImg.color = new Color(0.95f, 0.60f, 0.15f, 0.25f);
            glowImg.raycastTarget = false;
            glow.GetComponent<RectTransform>().SetAnchor(0.5f, 0.76f, new Vector2(1800, 900));

            // Top ornamental divider
            MakeTMP("OrnamentTop", panelGO.transform,
                "— · ✦ · —", 36, TextAlignmentOptions.Center, ColAccent)
                .rectTransform.SetAnchor(0.5f, 0.91f, new Vector2(600, 50));

            // Huge title with outline + shadow
            var title = MakeTMP("Title", panelGO.transform, "DUNGEON OF ETERNITY",
                    124, TextAlignmentOptions.Center, ColAccent, bold: true);
            title.characterSpacing = 8f;
            title.outlineWidth = 0.22f;
            title.outlineColor = new Color32(40, 10, 0, 255);
            title.enableVertexGradient = true;
            title.colorGradient = new VertexGradient(
                new Color(1.00f, 0.92f, 0.55f, 1f), // top-left  - pale gold
                new Color(1.00f, 0.92f, 0.55f, 1f), // top-right
                new Color(0.82f, 0.55f, 0.12f, 1f), // bot-left  - deep amber
                new Color(0.82f, 0.55f, 0.12f, 1f));// bot-right
            title.rectTransform.SetAnchor(0.5f, 0.80f, new Vector2(1700, 170));

            // Subtitle
            var sub = MakeTMP("Subtitle", panelGO.transform,
                "A R O G U E L I K E  ·  S T E A M  E D I T I O N",
                28, TextAlignmentOptions.Center, new Color(0.85f, 0.75f, 0.55f, 0.9f), italic: true);
            sub.characterSpacing = 6f;
            sub.rectTransform.SetAnchor(0.5f, 0.71f, new Vector2(1000, 40));

            // Divider under subtitle
            var dividerGO = MakeUIObject("Divider", panelGO.transform, typeof(Image));
            var dImg = dividerGO.GetComponent<Image>();
            dImg.color = new Color(1f, 0.78f, 0.26f, 0.55f);
            dImg.raycastTarget = false;
            dividerGO.GetComponent<RectTransform>().SetAnchor(0.5f, 0.66f, new Vector2(520, 2));

            // Button stack
            ctrl.NewGameButton  = MakeMenuButton("NewGameButton",  panelGO.transform, "▶  New Game",  0.5f, 0.52f);
            ctrl.LoadGameButton = MakeMenuButton("LoadGameButton", panelGO.transform, "⟲  Load Game", 0.5f, 0.42f);
            ctrl.QuitButton     = MakeMenuButton("QuitButton",     panelGO.transform, "✕  Quit",      0.5f, 0.32f);

            // Bottom ornament
            MakeTMP("OrnamentBottom", panelGO.transform,
                "— · ✦ · —", 28, TextAlignmentOptions.Center, ColAccent)
                .rectTransform.SetAnchor(0.5f, 0.18f, new Vector2(500, 40));

            MakeTMP("Footer", panelGO.transform,
                "Arrow keys / WASD move · I opens inventory · Esc pauses",
                18, TextAlignmentOptions.Center, ColMuted)
                .rectTransform.SetAnchor(0.5f, 0.10f, new Vector2(1400, 30));

            MakeTMP("BuildTag", panelGO.transform, "v0.1.0 · Unity 2022.3",
                14, TextAlignmentOptions.Right, new Color(0.5f, 0.5f, 0.55f, 0.7f))
                .rectTransform.SetAnchor(0.93f, 0.03f, new Vector2(240, 20));

            return panelGO;
        }

        static GameObject BuildCharSelectPanel(Transform parent, GameObject classCardPrefab)
        {
            // Transparent root so the atmospheric background shows.
            var panel = MakeUIObject("CharSelectPanel", parent, typeof(RectTransform));
            StretchAnchors(panel.GetComponent<RectTransform>());
            var ctrl = panel.AddComponent<CharSelectScreen>();
            ctrl.ClassCardPrefab = classCardPrefab;

            MakeTMP("Ornament", panel.transform, "— · ✦ · —",
                    26, TextAlignmentOptions.Center, ColAccent)
                .rectTransform.SetAnchor(0.5f, 0.97f, new Vector2(500, 30));

            var title = MakeTMP("Title", panel.transform, "CHOOSE YOUR CLASS",
                    68, TextAlignmentOptions.Center, ColAccent, bold: true);
            title.characterSpacing = 8f;
            title.outlineWidth = 0.18f;
            title.outlineColor = new Color32(40, 10, 0, 255);
            title.rectTransform.SetAnchor(0.5f, 0.91f, new Vector2(1400, 80));

            // Scrollable card container
            var scrollGO = MakeUIObject("ClassScroll", panel.transform, typeof(Image), typeof(ScrollRect));
            var scrollImg = scrollGO.GetComponent<Image>(); scrollImg.color = ColPanel2;
            scrollGO.GetComponent<RectTransform>().SetAnchor(0.5f, 0.52f, new Vector2(1600, 650));

            var viewport = MakeUIObject("Viewport", scrollGO.transform, typeof(Image), typeof(Mask));
            var vpImg = viewport.GetComponent<Image>(); vpImg.color = new Color(1,1,1,0.02f);
            viewport.GetComponent<Mask>().showMaskGraphic = false;
            var vpRT = viewport.GetComponent<RectTransform>();
            StretchAnchors(vpRT);

            var container = MakeUIObject("CardContainer", viewport.transform, typeof(GridLayoutGroup), typeof(ContentSizeFitter));
            var grid = container.GetComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(360, 280);
            grid.spacing = new Vector2(20, 20);
            grid.padding = new RectOffset(20, 20, 20, 20);
            grid.childAlignment = TextAnchor.UpperCenter;
            var csf = container.GetComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            var containerRT = container.GetComponent<RectTransform>();
            containerRT.anchorMin = new Vector2(0, 1);
            containerRT.anchorMax = new Vector2(1, 1);
            containerRT.pivot = new Vector2(0.5f, 1);
            containerRT.anchoredPosition = Vector2.zero;
            containerRT.sizeDelta = new Vector2(0, 600);

            var scroll = scrollGO.GetComponent<ScrollRect>();
            scroll.content = containerRT;
            scroll.viewport = vpRT;
            scroll.horizontal = false;
            scroll.vertical = true;

            ctrl.CardContainer = containerRT;

            // Name input
            ctrl.NameInput = MakeInputField("NameInput", panel.transform, "Hero name...", 0.5f, 0.16f);

            ctrl.ConfirmButton = MakeMenuButton("ConfirmButton", panel.transform, "✓  Confirm",  0.65f, 0.08f);
            ctrl.BackButton    = MakeMenuButton("BackButton",    panel.transform, "◀  Back",     0.35f, 0.08f);

            return panel;
        }

        static GameObject BuildGamePanel(Transform parent, GameObject tileCellPrefab, GameObject logLinePrefab)
        {
            var panel = MakePanel("GamePanel", parent, ColBg).gameObject;
            StretchAnchors(panel.GetComponent<RectTransform>());
            var ctrl = panel.AddComponent<GameScreenController>();
            ctrl.TileCellPrefab = tileCellPrefab;
            ctrl.LogLinePrefab = logLinePrefab;
            ctrl.TileSize = 36f;

            // HUD (top bar)
            var hud = MakePanel("HUD", panel.transform, ColPanel).gameObject;
            hud.GetComponent<RectTransform>().SetStretchTop(70, 0, 0);

            ctrl.NameLabel  = MakeTMP("NameLabel",  hud.transform, "Hero", 24, TextAlignmentOptions.Left,  ColText, bold:true);
            ctrl.NameLabel.rectTransform.SetAnchor(0.05f, 0.5f, new Vector2(200, 40));
            ctrl.LevelLabel = MakeTMP("LevelLabel", hud.transform, "Lv.1", 22, TextAlignmentOptions.Left,  ColAccent2);
            ctrl.LevelLabel.rectTransform.SetAnchor(0.14f, 0.5f, new Vector2(120, 40));
            ctrl.FloorLabel = MakeTMP("FloorLabel", hud.transform, "Floor 1", 22, TextAlignmentOptions.Center, ColAccent);
            ctrl.FloorLabel.rectTransform.SetAnchor(0.30f, 0.5f, new Vector2(200, 40));
            ctrl.BiomeLabel = MakeTMP("BiomeLabel", hud.transform, "Biome", 22, TextAlignmentOptions.Center, ColMuted);
            ctrl.BiomeLabel.rectTransform.SetAnchor(0.45f, 0.5f, new Vector2(260, 40));
            ctrl.GoldLabel  = MakeTMP("GoldLabel",  hud.transform, "0g", 22, TextAlignmentOptions.Right, ColAccent);
            ctrl.GoldLabel.rectTransform.SetAnchor(0.62f, 0.5f, new Vector2(140, 40));

            ctrl.HpBar  = MakeSlider("HpBar",  hud.transform, ColDanger);
            ctrl.HpBar.GetComponent<RectTransform>().SetAnchor(0.75f, 0.72f, new Vector2(280, 16));
            ctrl.MpBar  = MakeSlider("MpBar",  hud.transform, ColAccent2);
            ctrl.MpBar.GetComponent<RectTransform>().SetAnchor(0.75f, 0.50f, new Vector2(280, 16));
            ctrl.ExpBar = MakeSlider("ExpBar", hud.transform, ColGood);
            ctrl.ExpBar.GetComponent<RectTransform>().SetAnchor(0.75f, 0.28f, new Vector2(280, 16));

            // Grid area (center)
            var gridHolder = MakePanel("GridArea", panel.transform, ColPanel2).gameObject;
            var gridRT = gridHolder.GetComponent<RectTransform>();
            gridRT.anchorMin = new Vector2(0, 0);
            gridRT.anchorMax = new Vector2(0.66f, 1);
            gridRT.offsetMin = new Vector2(12, 80);
            gridRT.offsetMax = new Vector2(-6, -80);

            var gridParent = MakeUIObject("GridParent", gridHolder.transform, typeof(RectTransform));
            var gpRT = gridParent.GetComponent<RectTransform>();
            // Anchored in top-left; tiles position themselves at (x*size, -y*size)
            gpRT.anchorMin = new Vector2(0, 1);
            gpRT.anchorMax = new Vector2(0, 1);
            gpRT.pivot = new Vector2(0, 1);
            gpRT.anchoredPosition = new Vector2(24, -24);
            gpRT.sizeDelta = new Vector2(800, 600);
            ctrl.GridParent = gpRT;

            // Log area (right)
            var logScroll = BuildScrollView("LogScroll", panel.transform, out var logContent);
            var lsRT = logScroll.GetComponent<RectTransform>();
            lsRT.anchorMin = new Vector2(0.66f, 0);
            lsRT.anchorMax = new Vector2(1, 1);
            lsRT.offsetMin = new Vector2(6, 80);
            lsRT.offsetMax = new Vector2(-12, -80);
            var logVLG = logContent.gameObject.AddComponent<VerticalLayoutGroup>();
            logVLG.childForceExpandHeight = false;
            logVLG.childControlHeight = true;
            logVLG.childControlWidth = true;
            logVLG.spacing = 2;
            logVLG.padding = new RectOffset(8, 8, 8, 8);
            var logFit = logContent.gameObject.AddComponent<ContentSizeFitter>();
            logFit.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            ctrl.LogContent = logContent;

            // Bottom buttons
            ctrl.InventoryButton = MakeMenuButton("InventoryButton", panel.transform, "◈  Inventory (I)", 0.5f, 0.05f);
            ctrl.InventoryButton.GetComponent<RectTransform>().SetAnchor(0.45f, 0.05f, new Vector2(260, 60));
            ctrl.SaveButton      = MakeMenuButton("SaveButton",      panel.transform, "⬇  Save",         0.5f, 0.05f);
            ctrl.SaveButton.GetComponent<RectTransform>().SetAnchor(0.55f, 0.05f, new Vector2(180, 60));

            return panel;
        }

        static GameObject BuildCombatPanel(Transform parent, GameObject logLinePrefab, GameObject spellButtonPrefab)
        {
            var panel = MakePanel("CombatPanel", parent, ColPanel).gameObject;
            StretchAnchors(panel.GetComponent<RectTransform>());
            var ctrl = panel.AddComponent<CombatScreenController>();
            ctrl.LogLinePrefab = logLinePrefab;
            ctrl.SpellButtonPrefab = spellButtonPrefab;

            MakeTMP("Title", panel.transform, "COMBAT", 48, TextAlignmentOptions.Center, ColDanger, bold:true)
                .rectTransform.SetAnchor(0.5f, 0.95f, new Vector2(600, 70));

            // Enemy card (top)
            var enemyBox = MakePanel("EnemyBox", panel.transform, ColPanel2).gameObject;
            enemyBox.GetComponent<RectTransform>().SetAnchor(0.3f, 0.75f, new Vector2(700, 240));

            ctrl.EnemyName = MakeTMP("EnemyName", enemyBox.transform, "Enemy", 30, TextAlignmentOptions.Center, ColAccent, bold:true);
            ctrl.EnemyName.rectTransform.SetAnchor(0.5f, 0.85f, new Vector2(650, 40));
            ctrl.EnemyAscii = MakeTMP("EnemyAscii", enemyBox.transform, "?", 48, TextAlignmentOptions.Center, ColText);
            ctrl.EnemyAscii.rectTransform.SetAnchor(0.5f, 0.5f, new Vector2(650, 100));
            ctrl.EnemyHp = MakeSlider("EnemyHp", enemyBox.transform, ColDanger);
            ctrl.EnemyHp.GetComponent<RectTransform>().SetAnchor(0.5f, 0.2f, new Vector2(600, 22));
            ctrl.EnemyStatus = MakeTMP("EnemyStatus", enemyBox.transform, "", 18, TextAlignmentOptions.Center, ColMuted);
            ctrl.EnemyStatus.rectTransform.SetAnchor(0.5f, 0.08f, new Vector2(600, 30));

            // Player card
            var playerBox = MakePanel("PlayerBox", panel.transform, ColPanel2).gameObject;
            playerBox.GetComponent<RectTransform>().SetAnchor(0.3f, 0.40f, new Vector2(700, 180));

            ctrl.PlayerName = MakeTMP("PlayerName", playerBox.transform, "Hero Lv.1", 26, TextAlignmentOptions.Center, ColText, bold:true);
            ctrl.PlayerName.rectTransform.SetAnchor(0.5f, 0.80f, new Vector2(650, 40));
            ctrl.PlayerHp = MakeSlider("PlayerHp", playerBox.transform, ColDanger);
            ctrl.PlayerHp.GetComponent<RectTransform>().SetAnchor(0.5f, 0.5f, new Vector2(600, 22));
            ctrl.PlayerMp = MakeSlider("PlayerMp", playerBox.transform, ColAccent2);
            ctrl.PlayerMp.GetComponent<RectTransform>().SetAnchor(0.5f, 0.2f, new Vector2(600, 22));

            // Action buttons
            ctrl.AttackButton = MakeMenuButton("AttackButton", panel.transform, "⚔  Attack", 0, 0);
            ctrl.AttackButton.GetComponent<RectTransform>().SetAnchor(0.15f, 0.15f, new Vector2(220, 64));
            ctrl.FleeButton   = MakeMenuButton("FleeButton",   panel.transform, "↷  Flee",   0, 0);
            ctrl.FleeButton.GetComponent<RectTransform>().SetAnchor(0.30f, 0.15f, new Vector2(220, 64));
            ctrl.ItemButton   = MakeMenuButton("ItemButton",   panel.transform, "◈  Items",  0, 0);
            ctrl.ItemButton.GetComponent<RectTransform>().SetAnchor(0.45f, 0.15f, new Vector2(220, 64));

            // Spell grid
            var spellHolder = MakePanel("SpellArea", panel.transform, ColPanel2).gameObject;
            spellHolder.GetComponent<RectTransform>().SetAnchor(0.75f, 0.40f, new Vector2(400, 500));
            var spellGridGO = MakeUIObject("SpellGrid", spellHolder.transform,
                typeof(GridLayoutGroup), typeof(ContentSizeFitter));
            var spellGrid = spellGridGO.GetComponent<GridLayoutGroup>();
            spellGrid.cellSize = new Vector2(360, 60);
            spellGrid.spacing = new Vector2(6, 6);
            spellGrid.padding = new RectOffset(10, 10, 10, 10);
            var sgFit = spellGridGO.GetComponent<ContentSizeFitter>();
            sgFit.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            var sgRT = spellGridGO.GetComponent<RectTransform>();
            StretchAnchors(sgRT);
            ctrl.SpellGrid = sgRT;

            // Log area
            var logScroll = BuildScrollView("LogScroll", panel.transform, out var logContent);
            logScroll.GetComponent<RectTransform>().SetAnchor(0.75f, 0.08f, new Vector2(400, 120));
            logContent.gameObject.AddComponent<VerticalLayoutGroup>();
            var lvlg = logContent.GetComponent<VerticalLayoutGroup>();
            lvlg.childForceExpandHeight = false;
            lvlg.childControlHeight = true;
            lvlg.childControlWidth = true;
            var lfit = logContent.gameObject.AddComponent<ContentSizeFitter>();
            lfit.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            ctrl.LogContent = logContent;

            return panel;
        }

        static GameObject BuildInventoryPanel(Transform parent, GameObject itemCardPrefab, GameObject equipSlotPrefab)
        {
            var panel = MakePanel("InventoryPanel", parent, ColPanel).gameObject;
            StretchAnchors(panel.GetComponent<RectTransform>());
            var ctrl = panel.AddComponent<InventoryScreen>();
            ctrl.ItemCardPrefab = itemCardPrefab;
            ctrl.EquipSlotPrefab = equipSlotPrefab;

            MakeTMP("Title", panel.transform, "INVENTORY", 48, TextAlignmentOptions.Center, ColAccent, bold:true)
                .rectTransform.SetAnchor(0.5f, 0.93f, new Vector2(800, 70));

            // Inventory scrollable grid
            var invScroll = BuildScrollView("InventoryScroll", panel.transform, out var invContent);
            invScroll.GetComponent<RectTransform>().SetAnchor(0.3f, 0.5f, new Vector2(900, 700));
            var invGrid = invContent.gameObject.AddComponent<GridLayoutGroup>();
            invGrid.cellSize = new Vector2(280, 130);
            invGrid.spacing = new Vector2(10, 10);
            invGrid.padding = new RectOffset(10,10,10,10);
            var ifit = invContent.gameObject.AddComponent<ContentSizeFitter>();
            ifit.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            ctrl.InventoryGrid = invContent;

            // Equipment panel
            var equipBox = MakePanel("EquipmentBox", panel.transform, ColPanel2).gameObject;
            equipBox.GetComponent<RectTransform>().SetAnchor(0.78f, 0.62f, new Vector2(460, 500));

            var equipRoot = MakeUIObject("EquipmentPanel", equipBox.transform,
                typeof(VerticalLayoutGroup), typeof(ContentSizeFitter));
            var evlg = equipRoot.GetComponent<VerticalLayoutGroup>();
            evlg.childForceExpandHeight = false;
            evlg.childControlHeight = true;
            evlg.childControlWidth = true;
            evlg.spacing = 4;
            evlg.padding = new RectOffset(10,10,10,10);
            var efit = equipRoot.GetComponent<ContentSizeFitter>();
            efit.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            var erRT = equipRoot.GetComponent<RectTransform>();
            StretchAnchors(erRT);
            ctrl.EquipmentPanel = erRT;

            // Stats text
            ctrl.StatsText = MakeTMP("StatsText", panel.transform,
                "ATK 0\nDEF 0\nHP 0/0\nMP 0/0\nXP 0/0",
                22, TextAlignmentOptions.TopLeft, ColText);
            ctrl.StatsText.rectTransform.SetAnchor(0.78f, 0.23f, new Vector2(460, 180));

            // Upgrade button + cost
            ctrl.UpgradeCostLabel = MakeTMP("UpgradeCostLabel", panel.transform,
                "No weapon equipped", 20, TextAlignmentOptions.Center, ColMuted);
            ctrl.UpgradeCostLabel.rectTransform.SetAnchor(0.78f, 0.13f, new Vector2(460, 30));
            ctrl.UpgradeWeaponButton = MakeMenuButton("UpgradeWeaponButton", panel.transform, "⚒  Upgrade Weapon", 0.78f, 0.07f);
            ctrl.UpgradeWeaponButton.GetComponent<RectTransform>().SetAnchor(0.78f, 0.07f, new Vector2(320, 56));

            ctrl.CloseButton = MakeMenuButton("CloseButton", panel.transform, "◀  Close", 0.3f, 0.06f);
            ctrl.CloseButton.GetComponent<RectTransform>().SetAnchor(0.3f, 0.05f, new Vector2(260, 56));

            return panel;
        }

        static GameObject BuildShopPanel(Transform parent, GameObject itemCardPrefab)
        {
            var panel = MakePanel("ShopPanel", parent, ColPanel).gameObject;
            StretchAnchors(panel.GetComponent<RectTransform>());
            var ctrl = panel.AddComponent<ShopScreen>();
            ctrl.ItemCardPrefab = itemCardPrefab;

            MakeTMP("Title", panel.transform, "SHOP", 48, TextAlignmentOptions.Center, ColAccent, bold:true)
                .rectTransform.SetAnchor(0.5f, 0.94f, new Vector2(400, 70));

            ctrl.GoldLabel = MakeTMP("GoldLabel", panel.transform, "0g", 30, TextAlignmentOptions.Center, ColAccent, bold:true);
            ctrl.GoldLabel.rectTransform.SetAnchor(0.5f, 0.85f, new Vector2(300, 50));

            // Buy (left)
            MakeTMP("BuyHeader", panel.transform, "BUY", 28, TextAlignmentOptions.Center, ColGood, bold:true)
                .rectTransform.SetAnchor(0.25f, 0.77f, new Vector2(400, 40));
            var buyScroll = BuildScrollView("BuyScroll", panel.transform, out var buyContent);
            buyScroll.GetComponent<RectTransform>().SetAnchor(0.25f, 0.42f, new Vector2(720, 620));
            var buyGrid = buyContent.gameObject.AddComponent<GridLayoutGroup>();
            buyGrid.cellSize = new Vector2(340, 130);
            buyGrid.spacing = new Vector2(8, 8);
            buyGrid.padding = new RectOffset(10,10,10,10);
            buyContent.gameObject.AddComponent<ContentSizeFitter>().verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            ctrl.ShopGrid = buyContent;

            // Sell (right)
            MakeTMP("SellHeader", panel.transform, "SELL", 28, TextAlignmentOptions.Center, ColDanger, bold:true)
                .rectTransform.SetAnchor(0.75f, 0.77f, new Vector2(400, 40));
            var sellScroll = BuildScrollView("SellScroll", panel.transform, out var sellContent);
            sellScroll.GetComponent<RectTransform>().SetAnchor(0.75f, 0.42f, new Vector2(720, 620));
            var sellGrid = sellContent.gameObject.AddComponent<GridLayoutGroup>();
            sellGrid.cellSize = new Vector2(340, 130);
            sellGrid.spacing = new Vector2(8, 8);
            sellGrid.padding = new RectOffset(10,10,10,10);
            sellContent.gameObject.AddComponent<ContentSizeFitter>().verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            ctrl.SellGrid = sellContent;

            ctrl.LeaveButton = MakeMenuButton("LeaveButton", panel.transform, "◀  Leave Shop", 0.5f, 0.06f);

            return panel;
        }

        static GameObject BuildGameOverPanel(Transform parent)
        {
            var panel = MakePanel("GameOverPanel", parent, ColPanel).gameObject;
            StretchAnchors(panel.GetComponent<RectTransform>());
            var ctrl = panel.AddComponent<GameOverScreen>();

            MakeTMP("Title", panel.transform, "YOU HAVE FALLEN", 72, TextAlignmentOptions.Center, ColDanger, bold:true)
                .rectTransform.SetAnchor(0.5f, 0.80f, new Vector2(1200, 120));

            ctrl.SummaryText = MakeTMP("SummaryText", panel.transform,
                "Summary will appear here", 28, TextAlignmentOptions.Center, ColText);
            ctrl.SummaryText.rectTransform.SetAnchor(0.5f, 0.50f, new Vector2(800, 300));

            ctrl.ReturnButton = MakeMenuButton("ReturnButton", panel.transform, "⟲  Return to Title", 0.4f, 0.18f);
            ctrl.QuitButton   = MakeMenuButton("QuitButton",   panel.transform, "✕  Quit",           0.6f, 0.18f);
            return panel;
        }

        // =====================================================================
        // PREFAB BUILDERS (saved as .prefab assets)
        // =====================================================================

        static GameObject BuildTileCellPrefab()
        {
            var go = new GameObject("TileCellPrefab", typeof(RectTransform), typeof(Image));
            go.GetComponent<Image>().color = new Color(0.2f, 0.2f, 0.25f, 1);
            go.GetComponent<RectTransform>().sizeDelta = new Vector2(36, 36);

            var label = MakeTMP("Label", go.transform, ".", 22,
                TextAlignmentOptions.Center, ColText);
            StretchAnchors(label.rectTransform);

            return SavePrefab(go, "TileCellPrefab");
        }

        static GameObject BuildLogLinePrefab()
        {
            var go = new GameObject("LogLinePrefab", typeof(RectTransform));
            var le = go.AddComponent<LayoutElement>();
            le.preferredHeight = 22;
            var t = MakeTMP("Text", go.transform, "", 18, TextAlignmentOptions.Left, ColText);
            StretchAnchors(t.rectTransform);
            return SavePrefab(go, "LogLinePrefab");
        }

        static GameObject BuildClassCardPrefab()
        {
            var go = new GameObject("ClassCardPrefab",
                typeof(RectTransform), typeof(Image), typeof(Button));
            var cardImg = go.GetComponent<Image>();
            cardImg.color = new Color(0.10f, 0.10f, 0.12f, 0.9f);
            go.GetComponent<Button>().targetGraphic = cardImg;
            go.GetComponent<RectTransform>().sizeDelta = new Vector2(360, 280);

            var nameText  = MakeTMP("NameText",  go.transform, "Class",  28, TextAlignmentOptions.Center, ColAccent, bold:true);
            nameText.rectTransform.SetAnchor(0.5f, 0.85f, new Vector2(340, 40));
            var descText  = MakeTMP("DescText",  go.transform, "Description", 16, TextAlignmentOptions.Center, ColMuted);
            descText.rectTransform.SetAnchor(0.5f, 0.55f, new Vector2(340, 90));
            var statsText = MakeTMP("StatsText", go.transform, "Stats",  18, TextAlignmentOptions.Center, ColText);
            statsText.rectTransform.SetAnchor(0.5f, 0.22f, new Vector2(340, 90));

            return SavePrefab(go, "ClassCardPrefab");
        }

        static GameObject BuildItemCardPrefab()
        {
            var go = new GameObject("ItemCardPrefab",
                typeof(RectTransform), typeof(Image));
            go.GetComponent<Image>().color = ColPanel2;
            go.GetComponent<RectTransform>().sizeDelta = new Vector2(280, 130);

            var nameText   = MakeTMP("NameText",   go.transform, "Item",   20, TextAlignmentOptions.Left, ColText, bold:true);
            nameText.rectTransform.SetAnchor(0.32f, 0.85f, new Vector2(180, 28));
            var rarityText = MakeTMP("RarityText", go.transform, "Common", 14, TextAlignmentOptions.Left, ColMuted);
            rarityText.rectTransform.SetAnchor(0.32f, 0.68f, new Vector2(180, 22));
            var statsText  = MakeTMP("StatsText",  go.transform, "+0 ATK", 14, TextAlignmentOptions.Left, ColText);
            statsText.rectTransform.SetAnchor(0.32f, 0.48f, new Vector2(180, 42));
            var valueText  = MakeTMP("ValueText",  go.transform, "0g",     14, TextAlignmentOptions.Right, ColAccent);
            valueText.rectTransform.SetAnchor(0.85f, 0.85f, new Vector2(80, 22));

            MakeTinyButton("EquipButton", go.transform, "Equip",   0.20f, 0.15f);
            MakeTinyButton("UseButton",   go.transform, "Use",     0.50f, 0.15f);
            MakeTinyButton("DropButton",  go.transform, "Drop",    0.80f, 0.15f);

            return SavePrefab(go, "ItemCardPrefab");
        }

        static GameObject BuildEquipSlotPrefab()
        {
            var go = new GameObject("EquipSlotPrefab",
                typeof(RectTransform), typeof(Image), typeof(LayoutElement));
            go.GetComponent<Image>().color = new Color(1,1,1,0.04f);
            go.GetComponent<LayoutElement>().preferredHeight = 56;
            go.GetComponent<RectTransform>().sizeDelta = new Vector2(440, 56);

            var slotText = MakeTMP("SlotText", go.transform, "Weapon", 18, TextAlignmentOptions.Left, ColAccent2, bold:true);
            slotText.rectTransform.SetAnchor(0.15f, 0.5f, new Vector2(120, 40));
            var itemText = MakeTMP("ItemText", go.transform, "(empty)", 18, TextAlignmentOptions.Left, ColText);
            itemText.rectTransform.SetAnchor(0.50f, 0.5f, new Vector2(220, 40));
            MakeTinyButton("UnequipButton", go.transform, "X", 0.90f, 0.5f);

            return SavePrefab(go, "EquipSlotPrefab");
        }

        static GameObject BuildSpellButtonPrefab()
        {
            var go = new GameObject("SpellButtonPrefab",
                typeof(RectTransform), typeof(Image), typeof(Button), typeof(LayoutElement));
            var sbImg = go.GetComponent<Image>();
            sbImg.color = ColPanel2;
            go.GetComponent<Button>().targetGraphic = sbImg;
            go.GetComponent<LayoutElement>().preferredHeight = 60;
            go.GetComponent<RectTransform>().sizeDelta = new Vector2(360, 60);

            var label = MakeTMP("Label", go.transform, "Spell", 18, TextAlignmentOptions.Center, ColText);
            StretchAnchors(label.rectTransform);

            return SavePrefab(go, "SpellButtonPrefab");
        }

        // =====================================================================
        // PROCEDURAL SPRITES (generated once, cached as PNG assets)
        // =====================================================================

        const string SpriteDir = "Assets/UI/Sprites";

        static void EnsureSpriteDir()
        {
            if (!AssetDatabase.IsValidFolder("Assets/UI"))
                AssetDatabase.CreateFolder("Assets", "UI");
            if (!AssetDatabase.IsValidFolder(SpriteDir))
                AssetDatabase.CreateFolder("Assets/UI", "Sprites");
        }

        /// <summary>Rounded-rect sprite with soft antialiased edges, 9-sliced.</summary>
        static Sprite RoundedSprite
        {
            get
            {
                if (_roundedSprite != null) return _roundedSprite;
                EnsureSpriteDir();
                string path = SpriteDir + "/Rounded.png";
                if (!File.Exists(path))
                {
                    const int size = 64;
                    const int radius = 16;
                    var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
                    for (int y = 0; y < size; y++)
                    for (int x = 0; x < size; x++)
                    {
                        float dx = 0, dy = 0;
                        if (x < radius) dx = radius - x;
                        else if (x >= size - radius) dx = x - (size - radius - 1);
                        if (y < radius) dy = radius - y;
                        else if (y >= size - radius) dy = y - (size - radius - 1);
                        float dist = Mathf.Sqrt(dx * dx + dy * dy);
                        float a = Mathf.Clamp01(radius - dist + 0.5f);
                        tex.SetPixel(x, y, new Color(1, 1, 1, a));
                    }
                    tex.Apply();
                    File.WriteAllBytes(path, tex.EncodeToPNG());
                    Object.DestroyImmediate(tex);
                    AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate);
                    var imp = (TextureImporter)AssetImporter.GetAtPath(path);
                    imp.textureType = TextureImporterType.Sprite;
                    imp.spriteImportMode = SpriteImportMode.Single;
                    imp.spriteBorder = new Vector4(20, 20, 20, 20);
                    imp.filterMode = FilterMode.Bilinear;
                    imp.alphaIsTransparency = true;
                    imp.mipmapEnabled = false;
                    imp.SaveAndReimport();
                }
                _roundedSprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
                return _roundedSprite;
            }
        }

        /// <summary>Vertical gradient, white top → transparent bottom. Use tinted for moody backgrounds.</summary>
        static Sprite GradientSprite
        {
            get
            {
                if (_gradientSprite != null) return _gradientSprite;
                EnsureSpriteDir();
                string path = SpriteDir + "/Gradient.png";
                if (!File.Exists(path))
                {
                    const int h = 256;
                    var tex = new Texture2D(4, h, TextureFormat.RGBA32, false);
                    for (int y = 0; y < h; y++)
                    {
                        float t = 1f - (y / (float)(h - 1));
                        var c = new Color(1, 1, 1, t);
                        for (int x = 0; x < 4; x++) tex.SetPixel(x, y, c);
                    }
                    tex.Apply();
                    File.WriteAllBytes(path, tex.EncodeToPNG());
                    Object.DestroyImmediate(tex);
                    AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate);
                    var imp = (TextureImporter)AssetImporter.GetAtPath(path);
                    imp.textureType = TextureImporterType.Sprite;
                    imp.filterMode = FilterMode.Bilinear;
                    imp.alphaIsTransparency = true;
                    imp.mipmapEnabled = false;
                    imp.SaveAndReimport();
                }
                _gradientSprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
                return _gradientSprite;
            }
        }

        /// <summary>Radial vignette, transparent center → dark edges.</summary>
        static Sprite VignetteSprite
        {
            get
            {
                if (_vignetteSprite != null) return _vignetteSprite;
                EnsureSpriteDir();
                string path = SpriteDir + "/Vignette.png";
                if (!File.Exists(path))
                {
                    const int size = 256;
                    const float cx = (size - 1) * 0.5f;
                    const float cy = (size - 1) * 0.5f;
                    float maxD = Mathf.Sqrt(cx * cx + cy * cy);
                    var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
                    for (int y = 0; y < size; y++)
                    for (int x = 0; x < size; x++)
                    {
                        float dx = x - cx, dy = y - cy;
                        float d = Mathf.Sqrt(dx * dx + dy * dy) / maxD;
                        float a = Mathf.Clamp01(Mathf.Pow(d, 2.2f));
                        tex.SetPixel(x, y, new Color(0, 0, 0, a));
                    }
                    tex.Apply();
                    File.WriteAllBytes(path, tex.EncodeToPNG());
                    Object.DestroyImmediate(tex);
                    AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate);
                    var imp = (TextureImporter)AssetImporter.GetAtPath(path);
                    imp.textureType = TextureImporterType.Sprite;
                    imp.filterMode = FilterMode.Bilinear;
                    imp.alphaIsTransparency = true;
                    imp.mipmapEnabled = false;
                    imp.SaveAndReimport();
                }
                _vignetteSprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
                return _vignetteSprite;
            }
        }

        // =====================================================================
        // HELPERS
        // =====================================================================

        static GameObject MakeUIObject(string name, Transform parent, params System.Type[] comps)
        {
            var full = new System.Collections.Generic.List<System.Type> { typeof(RectTransform) };
            full.AddRange(comps);
            var go = new GameObject(name, full.ToArray());
            go.transform.SetParent(parent, false);
            return go;
        }

        static Image MakePanel(string name, Transform parent, Color color)
        {
            var go = MakeUIObject(name, parent, typeof(Image));
            var img = go.GetComponent<Image>();
            img.sprite = RoundedSprite;
            img.type = Image.Type.Sliced;
            img.pixelsPerUnitMultiplier = 0.75f;
            img.color = color;
            return img;
        }

        /// <summary>Panel with a thin gold border ring on top.</summary>
        static Image MakeBorderedPanel(string name, Transform parent, Color fill, Color border)
        {
            var img = MakePanel(name, parent, fill);
            var ring = MakeUIObject("Border", img.transform, typeof(Image));
            var ri = ring.GetComponent<Image>();
            ri.sprite = RoundedSprite;
            ri.type = Image.Type.Sliced;
            ri.pixelsPerUnitMultiplier = 0.75f;
            ri.color = border;
            ri.raycastTarget = false;
            // Use an Outline via offsets: draw a slightly larger ring behind the fill.
            var rrt = ri.rectTransform;
            StretchAnchors(rrt);
            rrt.offsetMin = new Vector2(-2, -2);
            rrt.offsetMax = new Vector2(2, 2);
            rrt.SetAsFirstSibling();
            return img;
        }

        static TMP_Text MakeTMP(string name, Transform parent, string text,
            int fontSize, TextAlignmentOptions align, Color color,
            bool bold = false, bool italic = false)
        {
            var go = MakeUIObject(name, parent, typeof(TextMeshProUGUI));
            var t = go.GetComponent<TextMeshProUGUI>();
            t.text = text;
            t.fontSize = fontSize;
            t.alignment = align;
            t.color = color;
            t.raycastTarget = false;
            var style = FontStyles.Normal;
            if (bold)   style |= FontStyles.Bold;
            if (italic) style |= FontStyles.Italic;
            t.fontStyle = style;
            return t;
        }

        static Button MakeMenuButton(string name, Transform parent, string label, float ax, float ay)
        {
            // Outer root: doesn't have the Image — the visual fill is a child so we can
            // layer a border behind it without the border catching raycasts.
            var go = MakeUIObject(name, parent, typeof(Image), typeof(Button));
            var img = go.GetComponent<Image>();
            img.sprite = RoundedSprite;
            img.type = Image.Type.Sliced;
            img.pixelsPerUnitMultiplier = 0.7f;
            img.color = new Color(0.12f, 0.12f, 0.17f, 0.98f);

            var btn = go.GetComponent<Button>();
            btn.targetGraphic = img;
            btn.transition = Selectable.Transition.ColorTint;
            var colors = btn.colors;
            colors.normalColor      = new Color(1f, 1f, 1f, 1f);
            colors.highlightedColor = new Color(1.6f, 1.35f, 0.95f, 1f);
            colors.pressedColor     = new Color(0.7f, 0.58f, 0.25f, 1f);
            colors.selectedColor    = new Color(1.25f, 1.1f, 0.8f, 1f);
            colors.disabledColor    = new Color(0.4f, 0.4f, 0.45f, 0.55f);
            colors.fadeDuration = 0.08f;
            btn.colors = colors;

            // Gold border ring
            var border = MakeUIObject("Border", go.transform, typeof(Image));
            var bi = border.GetComponent<Image>();
            bi.sprite = RoundedSprite;
            bi.type = Image.Type.Sliced;
            bi.pixelsPerUnitMultiplier = 0.7f;
            bi.color = ColBorder;
            bi.raycastTarget = false;
            var brt = bi.rectTransform;
            StretchAnchors(brt);
            brt.offsetMin = new Vector2(-2, -2);
            brt.offsetMax = new Vector2(2, 2);
            brt.SetAsFirstSibling();

            var t = MakeTMP("Label", go.transform, label, 28,
                TextAlignmentOptions.Center, ColText, bold: true);
            t.fontStyle |= FontStyles.UpperCase;
            t.characterSpacing = 5f;
            t.outlineWidth = 0.18f;
            t.outlineColor = new Color32(0, 0, 0, 255);
            StretchAnchors(t.rectTransform);

            go.AddComponent<HoverScale>();

            var rt = go.GetComponent<RectTransform>();
            if (ax != 0 || ay != 0) rt.SetAnchor(ax, ay, new Vector2(360, 72));
            return btn;
        }

        static Button MakeTinyButton(string name, Transform parent, string label, float ax, float ay)
        {
            var go = MakeUIObject(name, parent, typeof(Image), typeof(Button));
            var img = go.GetComponent<Image>();
            img.sprite = RoundedSprite;
            img.type = Image.Type.Sliced;
            img.pixelsPerUnitMultiplier = 0.6f;
            img.color = new Color(0.20f, 0.20f, 0.25f, 1);
            var btn = go.GetComponent<Button>();
            btn.targetGraphic = img;
            var colors = btn.colors;
            colors.highlightedColor = new Color(1.4f, 1.2f, 0.85f, 1f);
            colors.pressedColor     = new Color(0.7f, 0.58f, 0.25f, 1f);
            btn.colors = colors;

            var t = MakeTMP("Label", go.transform, label, 14,
                TextAlignmentOptions.Center, ColText);
            t.outlineWidth = 0.15f;
            t.outlineColor = new Color32(0, 0, 0, 255);
            StretchAnchors(t.rectTransform);
            go.AddComponent<HoverScale>();
            go.GetComponent<RectTransform>().SetAnchor(ax, ay, new Vector2(80, 30));
            return btn;
        }

        static TMP_InputField MakeInputField(string name, Transform parent, string placeholder, float ax, float ay)
        {
            var go = MakeUIObject(name, parent, typeof(Image), typeof(TMP_InputField));
            go.GetComponent<Image>().color = ColPanel2;
            var rt = go.GetComponent<RectTransform>();
            rt.SetAnchor(ax, ay, new Vector2(600, 60));

            var textArea = MakeUIObject("Text Area", go.transform, typeof(RectMask2D));
            var taRT = textArea.GetComponent<RectTransform>();
            taRT.anchorMin = new Vector2(0, 0);
            taRT.anchorMax = new Vector2(1, 1);
            taRT.offsetMin = new Vector2(12, 8);
            taRT.offsetMax = new Vector2(-12, -8);

            var placeholderT = MakeTMP("Placeholder", textArea.transform, placeholder, 22,
                TextAlignmentOptions.Left, ColMuted, italic: true);
            StretchAnchors(placeholderT.rectTransform);

            var textT = MakeTMP("Text", textArea.transform, "", 22,
                TextAlignmentOptions.Left, ColText);
            StretchAnchors(textT.rectTransform);

            var input = go.GetComponent<TMP_InputField>();
            input.textViewport = taRT;
            input.textComponent = textT;
            input.placeholder = placeholderT;
            input.characterLimit = 24;
            return input;
        }

        static Slider MakeSlider(string name, Transform parent, Color fill)
        {
            var go = MakeUIObject(name, parent, typeof(Slider));
            var slider = go.GetComponent<Slider>();

            var bg = MakeUIObject("Background", go.transform, typeof(Image));
            bg.GetComponent<Image>().color = new Color(0,0,0,0.5f);
            StretchAnchors(bg.GetComponent<RectTransform>());

            var fillArea = MakeUIObject("Fill Area", go.transform, typeof(RectTransform));
            var faRT = fillArea.GetComponent<RectTransform>();
            StretchAnchors(faRT);
            faRT.offsetMin = new Vector2(2, 2);
            faRT.offsetMax = new Vector2(-2, -2);

            var fillGO = MakeUIObject("Fill", fillArea.transform, typeof(Image));
            fillGO.GetComponent<Image>().color = fill;
            var fillRT = fillGO.GetComponent<RectTransform>();
            fillRT.anchorMin = new Vector2(0, 0);
            fillRT.anchorMax = new Vector2(1, 1);
            fillRT.offsetMin = Vector2.zero;
            fillRT.offsetMax = Vector2.zero;

            slider.fillRect = fillRT;
            slider.direction = Slider.Direction.LeftToRight;
            slider.minValue = 0;
            slider.maxValue = 100;
            slider.value = 100;
            slider.interactable = false;
            return slider;
        }

        static GameObject BuildScrollView(string name, Transform parent, out RectTransform content)
        {
            var sv = MakeUIObject(name, parent, typeof(Image), typeof(ScrollRect));
            sv.GetComponent<Image>().color = new Color(0,0,0,0.3f);

            var viewport = MakeUIObject("Viewport", sv.transform, typeof(Image), typeof(Mask));
            viewport.GetComponent<Image>().color = new Color(1,1,1,0.02f);
            viewport.GetComponent<Mask>().showMaskGraphic = false;
            var vpRT = viewport.GetComponent<RectTransform>();
            StretchAnchors(vpRT);

            var contentGO = MakeUIObject("Content", viewport.transform);
            var contentRT = contentGO.GetComponent<RectTransform>();
            contentRT.anchorMin = new Vector2(0, 1);
            contentRT.anchorMax = new Vector2(1, 1);
            contentRT.pivot = new Vector2(0.5f, 1);
            contentRT.anchoredPosition = Vector2.zero;
            contentRT.sizeDelta = new Vector2(0, 200);

            var scroll = sv.GetComponent<ScrollRect>();
            scroll.content = contentRT;
            scroll.viewport = vpRT;
            scroll.horizontal = false;
            scroll.vertical = true;

            content = contentRT;
            return sv;
        }

        static void StretchAnchors(RectTransform rt)
        {
            rt.anchorMin = new Vector2(0, 0);
            rt.anchorMax = new Vector2(1, 1);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
        }

        static GameObject SavePrefab(GameObject src, string name)
        {
            var path = PrefabDir + "/" + name + ".prefab";
            var asset = PrefabUtility.SaveAsPrefabAsset(src, path);
            Object.DestroyImmediate(src);
            return asset;
        }
    }

    // ---- RectTransform extension: anchor a floating UI element by normalized position + size ----
    internal static class RectExt
    {
        public static void SetAnchor(this RectTransform rt, float ax, float ay, Vector2 size)
        {
            rt.anchorMin = new Vector2(ax, ay);
            rt.anchorMax = new Vector2(ax, ay);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = size;
        }

        /// <summary>Anchor to full-width top strip; height from top.</summary>
        public static void SetStretchTop(this RectTransform rt, float height, float leftPad, float rightPad)
        {
            rt.anchorMin = new Vector2(0, 1);
            rt.anchorMax = new Vector2(1, 1);
            rt.pivot = new Vector2(0.5f, 1);
            rt.offsetMin = new Vector2(leftPad, -height);
            rt.offsetMax = new Vector2(-rightPad, 0);
        }
    }
}
