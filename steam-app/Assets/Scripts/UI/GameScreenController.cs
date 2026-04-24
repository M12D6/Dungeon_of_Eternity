using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DungeonOfEternity.Data;
using DungeonOfEternity.Systems;

namespace DungeonOfEternity.UI
{
    /// <summary>
    /// Renders the dungeon grid + HUD + world log. Reads the GameManager state
    /// and redraws the tile grid on OnMapChanged / OnPlayerChanged events.
    /// </summary>
    public class GameScreenController : MonoBehaviour
    {
        [Header("Grid")]
        public RectTransform GridParent;
        public GameObject TileCellPrefab;   // Image + child TMP_Text "Label"
        public float TileSize = 36f;

        [Header("HUD")]
        public TMP_Text NameLabel;
        public TMP_Text LevelLabel;
        public TMP_Text FloorLabel;
        public TMP_Text GoldLabel;
        public TMP_Text BiomeLabel;
        public Slider HpBar;
        public Slider MpBar;
        public Slider ExpBar;

        [Header("Log")]
        public RectTransform LogContent;
        public GameObject LogLinePrefab;

        [Header("Buttons")]
        public Button InventoryButton;
        public Button SaveButton;

        GameObject[,] cells;

        void OnEnable()
        {
            GameManager.Instance.OnMapChanged += Redraw;
            GameManager.Instance.OnPlayerChanged += RefreshHud;
            GameManager.Instance.OnMessageAdded += AppendLog;
            Redraw();
            RefreshHud();
        }

        void OnDisable()
        {
            if (GameManager.Instance == null) return;
            GameManager.Instance.OnMapChanged -= Redraw;
            GameManager.Instance.OnPlayerChanged -= RefreshHud;
            GameManager.Instance.OnMessageAdded -= AppendLog;
        }

        void Start()
        {
            if (InventoryButton) InventoryButton.onClick.AddListener(() => GameManager.Instance.SetScreen(GameScreen.Inventory));
            if (SaveButton) SaveButton.onClick.AddListener(SaveGame);
        }

        void Update()
        {
            if (GameManager.Instance.Screen != GameScreen.Game) return;
            if (Input.GetKeyDown(KeyCode.UpArrow)    || Input.GetKeyDown(KeyCode.W)) GameManager.Instance.TryMovePlayer(0, -1);
            if (Input.GetKeyDown(KeyCode.DownArrow)  || Input.GetKeyDown(KeyCode.S)) GameManager.Instance.TryMovePlayer(0,  1);
            if (Input.GetKeyDown(KeyCode.LeftArrow)  || Input.GetKeyDown(KeyCode.A)) GameManager.Instance.TryMovePlayer(-1, 0);
            if (Input.GetKeyDown(KeyCode.RightArrow) || Input.GetKeyDown(KeyCode.D)) GameManager.Instance.TryMovePlayer(1,  0);
            if (Input.GetKeyDown(KeyCode.I)) GameManager.Instance.SetScreen(GameScreen.Inventory);
            if (Input.GetKeyDown(KeyCode.Escape)) GameManager.Instance.SetScreen(GameScreen.Pause);
        }

        void SaveGame()
        {
            string path = Application.persistentDataPath + "/save.json";
            System.IO.File.WriteAllText(path, GameManager.Instance.Serialize());
            GameManager.Instance.AddWorld("Game saved.", "#fbbf24");
        }

        void Redraw()
        {
            var map = GameManager.Instance.CurrentMap;
            if (map == null || GridParent == null || TileCellPrefab == null) return;

            // Rebuild if grid dimensions changed
            if (cells == null || cells.GetLength(0) != map.Cols || cells.GetLength(1) != map.Rows)
            {
                foreach (Transform t in GridParent) Destroy(t.gameObject);
                cells = new GameObject[map.Cols, map.Rows];
                for (int y = 0; y < map.Rows; y++)
                    for (int x = 0; x < map.Cols; x++)
                    {
                        var go = Instantiate(TileCellPrefab, GridParent);
                        var rt = go.GetComponent<RectTransform>();
                        if (rt != null)
                        {
                            rt.sizeDelta = new Vector2(TileSize, TileSize);
                            rt.anchoredPosition = new Vector2(x * TileSize, -y * TileSize);
                        }
                        cells[x, y] = go;
                    }
            }

            var biome = BiomeDB.ForFloor(map.Floor);
            Color floorC = BiomeDB.ParseHex(biome.TileHex);
            Color wallC  = BiomeDB.ParseHex(biome.WallHex);
            Color accentC = BiomeDB.ParseHex(biome.AccentHex);

            for (int y = 0; y < map.Rows; y++)
            {
                for (int x = 0; x < map.Cols; x++)
                {
                    var cell = cells[x, y];
                    var img = cell.GetComponent<Image>();
                    var label = cell.GetComponentInChildren<TMP_Text>();

                    var t = map.Grid[x, y];
                    bool isPlayer = map.PlayerStart.x == x && map.PlayerStart.y == y;
                    var enemy = map.Enemies.Find(e => e.X == x && e.Y == y && e.HP > 0);

                    if (img != null)
                        img.color = t == TileType.Wall ? wallC : floorC;

                    if (label != null)
                    {
                        if (isPlayer)
                        {
                            label.text = "@";
                            label.color = ClassDB.All[GameManager.Instance.Player.Class].GetColor();
                        }
                        else if (enemy != null)
                        {
                            label.text = enemy.Icon;
                            label.color = enemy.IsBoss ? new Color(1, 0.8f, 0.2f) : new Color(0.95f, 0.3f, 0.3f);
                        }
                        else
                        {
                            switch (t)
                            {
                                case TileType.Chest:  label.text = "$"; label.color = new Color(1,0.7f,0.2f); break;
                                case TileType.Stairs: label.text = ">"; label.color = accentC; break;
                                case TileType.Shrine: label.text = "*"; label.color = new Color(0.7f,0.4f,1f); break;
                                case TileType.Trap:   label.text = "^"; label.color = new Color(1,0.3f,0.3f); break;
                                case TileType.Shop:   label.text = "$"; label.color = new Color(0.4f,1,0.5f); break;
                                case TileType.Wall:   label.text = ""; break;
                                default:              label.text = "."; label.color = accentC * 0.4f; break;
                            }
                        }
                    }
                }
            }

            if (BiomeLabel) BiomeLabel.text = biome.Name;
            if (FloorLabel) FloorLabel.text = "Floor " + map.Floor;
        }

        void RefreshHud()
        {
            var p = GameManager.Instance.Player;
            if (p == null) return;
            if (NameLabel)  NameLabel.text  = p.Name;
            if (LevelLabel) LevelLabel.text = "Lv." + p.Level;
            if (GoldLabel)  GoldLabel.text  = p.Gold + "g";
            if (HpBar)  { HpBar.maxValue  = p.MaxHp;   HpBar.value  = p.HP; }
            if (MpBar)  { MpBar.maxValue  = p.MaxMana; MpBar.value  = p.Mana; }
            if (ExpBar) { ExpBar.maxValue = p.ExpToNext; ExpBar.value = p.Exp; }
        }

        void AppendLog(CombatMessage m)
        {
            if (LogContent == null || LogLinePrefab == null) return;
            if (GameManager.Instance.Screen != GameScreen.Game) return;

            var line = Instantiate(LogLinePrefab, LogContent);
            var t = line.GetComponentInChildren<TMP_Text>();
            if (t != null)
            {
                t.text = m.Text;
                if (ColorUtility.TryParseHtmlString(m.Color, out var c)) t.color = c;
            }

            // Trim old lines
            while (LogContent.childCount > 60)
                Destroy(LogContent.GetChild(0).gameObject);
        }
    }
}
