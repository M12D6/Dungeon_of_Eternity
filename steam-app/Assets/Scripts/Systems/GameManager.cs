using System;
using System.Collections.Generic;
using UnityEngine;
using DungeonOfEternity.Data;

namespace DungeonOfEternity.Systems
{
    public enum GameScreen
    {
        Title, CharSelect, Game, Combat, Inventory, Shop, GameOver, Pause
    }

    /// <summary>
    /// Central game-state singleton. Holds the PlayerState, current map, active combat,
    /// screen state, and message log. UI scripts observe this and render.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        // ── STATE ────────────────────────────────────
        public GameScreen Screen { get; private set; } = GameScreen.Title;
        public PlayerState Player { get; private set; }
        public GeneratedMap CurrentMap { get; private set; }
        public int Floor { get; private set; } = 1;
        public EnemyInstance CurrentCombatEnemy { get; private set; }

        public List<Item> ShopItems { get; private set; } = new List<Item>();
        public List<CombatMessage> CombatLog { get; } = new List<CombatMessage>();
        public List<CombatMessage> WorldLog { get; } = new List<CombatMessage>();

        // ── EVENTS ───────────────────────────────────
        public event Action<GameScreen> OnScreenChanged;
        public event Action OnPlayerChanged;
        public event Action OnMapChanged;
        public event Action OnCombatChanged;
        public event Action<CombatMessage> OnMessageAdded;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        // ── SCREEN TRANSITIONS ───────────────────────
        public void SetScreen(GameScreen s)
        {
            Screen = s;
            OnScreenChanged?.Invoke(s);
        }

        // ── START / NEW GAME ─────────────────────────
        public void StartNewGame(string name, ClassId cls)
        {
            Player = PlayerState.Create(name, cls);
            Floor = 1;
            WorldLog.Clear();
            AddWorld("You descend into the dungeon...", "#a78bfa");
            GenerateFloor(1);
            SetScreen(GameScreen.Game);
        }

        public void GenerateFloor(int floorNum)
        {
            Floor = floorNum;
            CurrentMap = MapGenerator.Generate(floorNum);
            var biome = BiomeDB.ForFloor(floorNum);
            AddWorld("Floor " + floorNum + " - " + biome.Name, "#a78bfa");
            AddWorld(biome.FlavorText, "#6b7280");
            OnMapChanged?.Invoke();
            OnPlayerChanged?.Invoke();
        }

        // ── MOVEMENT ─────────────────────────────────
        public void TryMovePlayer(int dx, int dy)
        {
            if (Screen != GameScreen.Game || Player == null || CurrentMap == null) return;

            int nx = CurrentMap.PlayerStart.x + dx;
            int ny = CurrentMap.PlayerStart.y + dy;
            if (nx < 0 || ny < 0 || nx >= CurrentMap.Cols || ny >= CurrentMap.Rows) return;

            var tile = CurrentMap.Grid[nx, ny];
            if (tile == TileType.Wall) return;

            // Enemy collision
            var enemy = CurrentMap.Enemies.Find(e => e.X == nx && e.Y == ny && e.HP > 0);
            if (enemy != null) { StartCombat(enemy); return; }

            CurrentMap.PlayerStart = new Vector2Int(nx, ny);
            HandleTile(nx, ny, tile);
            OnMapChanged?.Invoke();
        }

        void HandleTile(int x, int y, TileType tile)
        {
            switch (tile)
            {
                case TileType.Chest:
                    var loot = LootGenerator.RollChest(Floor, CurrentMap.Biome, Player.Level);
                    foreach (var l in loot)
                    {
                        Player.Inventory.Add(l);
                        AddWorld("Found: " + l.DisplayName + " [" + RarityDB.All[l.Rarity].Name + "]",
                                 "#" + ColorUtility.ToHtmlStringRGB(RarityDB.All[l.Rarity].Color));
                    }
                    CurrentMap.Grid[x, y] = TileType.Floor;
                    break;

                case TileType.Stairs:
                    int next = Floor + 1;
                    Player.FloorsCleared++;
                    Player.Heal(Mathf.FloorToInt(Player.MaxHp * 0.2f));
                    Player.RestoreMana(Mathf.FloorToInt(Player.MaxMana * 0.2f));
                    AddWorld("Descending to floor " + next + " (+20% HP/MP)", "#a78bfa");
                    GenerateFloor(next);
                    break;

                case TileType.Shrine:
                    Player.Heal(Mathf.FloorToInt(Player.MaxHp * 0.4f));
                    Player.RestoreMana(Mathf.FloorToInt(Player.MaxMana * 0.4f));
                    AddWorld("Ancient shrine restores you (+40% HP/MP)", "#22c55e");
                    CurrentMap.Grid[x, y] = TileType.Floor;
                    break;

                case TileType.Trap:
                    int dmg = UnityEngine.Random.Range(10, 31) + Floor * 2;
                    Player.HP = Mathf.Max(1, Player.HP - dmg);
                    AddWorld("TRAP! " + dmg + " damage!", "#ef4444");
                    CurrentMap.Grid[x, y] = TileType.Floor;
                    break;

                case TileType.Shop:
                    ShopItems = LootGenerator.RollShop(Floor, CurrentMap.Biome, Player.Level);
                    SetScreen(GameScreen.Shop);
                    break;
            }
            OnPlayerChanged?.Invoke();
        }

        // ── COMBAT ──────────────────────────────────
        public void StartCombat(EnemyInstance enemy)
        {
            CurrentCombatEnemy = enemy;
            CombatLog.Clear();
            AddCombat(enemy.Name + " appears!", "#f87171");
            SetScreen(GameScreen.Combat);
            OnCombatChanged?.Invoke();
        }

        public void DoPlayerAction(CombatAction action, string spellName = null, Item item = null)
        {
            if (CurrentCombatEnemy == null || Player == null) return;
            var result = CombatSystem.ResolvePlayerTurn(Player, CurrentCombatEnemy, action, spellName, item,
                                                        Floor, CurrentMap.Biome);
            foreach (var m in result.Log) AddCombat(m.Text, m.Color);

            if (result.EnemyDefeated)
            {
                AddWorld("Defeated " + CurrentCombatEnemy.Name + "! +" + result.XpGained + " XP, +" + result.GoldGained + "g", "#4ade80");
                foreach (var l in result.Loot)
                    AddWorld("Loot: " + l.DisplayName + " [" + RarityDB.All[l.Rarity].Name + "]",
                             "#" + ColorUtility.ToHtmlStringRGB(RarityDB.All[l.Rarity].Color));
                CurrentMap.Enemies.RemoveAll(e => e.UniqueId == CurrentCombatEnemy.UniqueId);
                CurrentCombatEnemy = null;
                SetScreen(GameScreen.Game);
                OnMapChanged?.Invoke();
            }
            else if (result.PlayerDefeated)
            {
                AddWorld(Player.Name + " has fallen...", "#ef4444");
                SetScreen(GameScreen.GameOver);
            }
            else if (result.Fled)
            {
                CurrentCombatEnemy = null;
                SetScreen(GameScreen.Game);
            }

            OnPlayerChanged?.Invoke();
            OnCombatChanged?.Invoke();
        }

        // ── INVENTORY / SHOP ACTIONS ────────────────
        public void EquipItem(Item item) { if (Player.Equip(item)) OnPlayerChanged?.Invoke(); }
        public void UnequipItem(ItemSlot slot) { Player.Unequip(slot); OnPlayerChanged?.Invoke(); }

        public void UseConsumable(Item item)
        {
            if (item == null || Player == null) return;
            if (item.Heal > 0) Player.Heal(item.Heal);
            if (item.ManaRestore > 0) Player.RestoreMana(item.ManaRestore);
            if (item.Slot == ItemSlot.Scroll && !string.IsNullOrEmpty(item.Spell))
            {
                if (!Player.Spells.Contains(item.Spell)) Player.Spells.Add(item.Spell);
            }
            Player.Inventory.Remove(item);
            OnPlayerChanged?.Invoke();
        }

        public void DropItem(Item item) { if (Player.Inventory.Remove(item)) OnPlayerChanged?.Invoke(); }

        public bool BuyItem(Item item)
        {
            if (Player.Gold < item.Value) return false;
            Player.Gold -= item.Value;
            Player.Inventory.Add(item);
            ShopItems.Remove(item);
            AddWorld("Bought " + item.DisplayName + " for " + item.Value + "g", "#fbbf24");
            OnPlayerChanged?.Invoke();
            return true;
        }

        public void SellItem(Item item)
        {
            int v = Mathf.FloorToInt(item.Value * 0.4f);
            Player.Gold += v;
            Player.Inventory.Remove(item);
            AddWorld("Sold " + item.DisplayName + " for " + v + "g", "#fbbf24");
            OnPlayerChanged?.Invoke();
        }

        /// <summary>Upgrade current weapon. Cost grows with upgrade level.</summary>
        public bool UpgradeWeapon()
        {
            if (Player == null) return false;
            Player.Equipment.TryGetValue(ItemSlot.Weapon, out var w);
            if (w == null) return false;
            int cost = 50 * (w.UpgradeLevel + 1) * (w.UpgradeLevel + 1);
            bool ok = Player.UpgradeWeapon(cost);
            if (ok) AddWorld("Upgraded " + w.DisplayName + "! (Cost: " + cost + "g)", "#fbbf24");
            else AddWorld("Upgrade failed (not enough gold or max level)", "#ef4444");
            OnPlayerChanged?.Invoke();
            return ok;
        }

        // ── LOGGING ─────────────────────────────────
        public void AddWorld(string msg, string color = "#e2e8f0")
        {
            var m = new CombatMessage(msg, color);
            WorldLog.Add(m);
            if (WorldLog.Count > 200) WorldLog.RemoveAt(0);
            OnMessageAdded?.Invoke(m);
        }

        public void AddCombat(string msg, string color = "#e2e8f0")
        {
            var m = new CombatMessage(msg, color);
            CombatLog.Add(m);
            if (CombatLog.Count > 100) CombatLog.RemoveAt(0);
            OnMessageAdded?.Invoke(m);
        }

        // ── SAVE / LOAD (JSON) ──────────────────────
        [System.Serializable]
        class SaveBlob
        {
            public PlayerState player;
            public int floor;
        }

        public string Serialize()
        {
            var blob = new SaveBlob { player = Player, floor = Floor };
            return JsonUtility.ToJson(blob);
        }

        public bool LoadFromJson(string json)
        {
            try
            {
                var blob = JsonUtility.FromJson<SaveBlob>(json);
                if (blob?.player == null) return false;
                Player = blob.player;
                GenerateFloor(blob.floor);
                SetScreen(GameScreen.Game);
                return true;
            }
            catch { return false; }
        }
    }
}
