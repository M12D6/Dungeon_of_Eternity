using System.Collections.Generic;
using UnityEngine;
using DungeonOfEternity.Data;

namespace DungeonOfEternity.Systems
{
    public enum TileType { Floor, Wall, Door, Chest, Stairs, Shrine, Trap, Shop }

    [System.Serializable]
    public class EnemyInstance
    {
        public string TemplateId;
        public string Name;
        public string Icon;
        public int HP, MaxHP, Atk, Def, Exp, Gold;
        public bool IsBoss;
        public int X, Y;
        public StatusType Status;
        public int StatusTurns;
        public string Art;
        public string UniqueId;

        public static EnemyInstance FromTemplate(EnemyTemplate t, int floor)
        {
            float scale = 1f + (floor - 1) * 0.14f;
            int hp = Mathf.RoundToInt(t.HP * scale);
            return new EnemyInstance
            {
                TemplateId = t.Id,
                Name = t.Name,
                Icon = t.Icon,
                HP = hp,
                MaxHP = hp,
                Atk = Mathf.RoundToInt(t.Atk * scale),
                Def = Mathf.RoundToInt(t.Def * scale),
                Exp = Mathf.RoundToInt(t.Exp * scale),
                Gold = Mathf.RoundToInt(t.Gold * scale),
                IsBoss = t.IsBoss,
                Art = t.Art,
                Status = StatusType.None,
                StatusTurns = 0,
                UniqueId = System.Guid.NewGuid().ToString("N").Substring(0, 8),
            };
        }
    }

    [System.Serializable]
    public class GeneratedMap
    {
        public int Floor;
        public int Cols;
        public int Rows;
        public TileType[,] Grid;
        public Vector2Int PlayerStart;
        public List<EnemyInstance> Enemies;
        public BiomeId Biome;
    }

    /// <summary>Procedural floor generator — BSP-lite rooms, corridor joins, feature placement.</summary>
    public static class MapGenerator
    {
        public const int COLS = 21;
        public const int ROWS = 15;

        public static GeneratedMap Generate(int floor)
        {
            var map = new GeneratedMap
            {
                Floor = floor,
                Cols = COLS,
                Rows = ROWS,
                Grid = new TileType[COLS, ROWS],
                Enemies = new List<EnemyInstance>(),
                Biome = BiomeDB.ForFloor(floor).Id,
            };

            // Fill walls
            for (int x = 0; x < COLS; x++)
                for (int y = 0; y < ROWS; y++)
                    map.Grid[x, y] = TileType.Wall;

            // Carve rooms
            var rooms = new List<RectInt>();
            int numRooms = 7 + Random.Range(0, 4);
            for (int i = 0; i < numRooms; i++)
            {
                int col = i % 4;
                int row = (i / 4) % 3;
                int ax = col * 5 + 1;
                int ay = row * 4 + 1;
                int aw = 5, ah = 4;
                if (aw < 4 || ah < 4) continue;

                int w = Random.Range(4, Mathf.Min(aw + 2, 8));
                int h = Random.Range(3, Mathf.Min(ah + 2, 6));
                int rx = ax + (aw - w > 0 ? Random.Range(0, aw - w + 1) : 0);
                int ry = ay + (ah - h > 0 ? Random.Range(0, ah - h + 1) : 0);
                rx = Mathf.Clamp(rx, 1, COLS - w - 1);
                ry = Mathf.Clamp(ry, 1, ROWS - h - 1);

                var room = new RectInt(rx, ry, w, h);
                rooms.Add(room);

                for (int yy = room.y; yy < room.y + room.height; yy++)
                    for (int xx = room.x; xx < room.x + room.width; xx++)
                        map.Grid[xx, yy] = TileType.Floor;
            }

            // Connect room centers
            for (int i = 1; i < rooms.Count; i++)
            {
                var a = rooms[i - 1];
                var b = rooms[i];
                int ax = a.x + a.width / 2;
                int ay = a.y + a.height / 2;
                int bx = b.x + b.width / 2;
                int by = b.y + b.height / 2;
                int cx = ax, cy = ay;
                while (cx != bx) { SafeCarve(map, cx, cy); cx += cx < bx ? 1 : -1; }
                while (cy != by) { SafeCarve(map, cx, cy); cy += cy < by ? 1 : -1; }
            }

            // Collect floor tiles
            var floorTiles = new List<Vector2Int>();
            for (int x = 0; x < COLS; x++)
                for (int y = 0; y < ROWS; y++)
                    if (map.Grid[x, y] == TileType.Floor)
                        floorTiles.Add(new Vector2Int(x, y));

            Vector2Int Pick()
            {
                if (floorTiles.Count == 0) return Vector2Int.zero;
                int idx = Random.Range(0, floorTiles.Count);
                var t = floorTiles[idx];
                floorTiles.RemoveAt(idx);
                return t;
            }

            // Features
            int chests = 2 + Random.Range(0, 3);
            int traps = 1 + Random.Range(0, 3);
            int shrines = 1 + Random.Range(0, 2);
            int shops = floor > 1 ? Random.Range(0, 2) : 1;

            for (int i = 0; i < chests;  i++) { var t = Pick(); map.Grid[t.x, t.y] = TileType.Chest;  }
            for (int i = 0; i < traps;   i++) { var t = Pick(); map.Grid[t.x, t.y] = TileType.Trap;   }
            for (int i = 0; i < shrines; i++) { var t = Pick(); map.Grid[t.x, t.y] = TileType.Shrine; }
            for (int i = 0; i < shops;   i++) { var t = Pick(); map.Grid[t.x, t.y] = TileType.Shop;   }

            var stairs = Pick();
            map.Grid[stairs.x, stairs.y] = TileType.Stairs;

            var start = floorTiles.Count > 0 ? Pick() : new Vector2Int(1, 1);
            map.Grid[start.x, start.y] = TileType.Floor;
            map.PlayerStart = start;

            // Enemies
            var possible = EnemyDB.All.FindAll(e => !e.IsBoss && e.MinFloor <= Mathf.Min(floor, 16));
            int numEnemies = 3 + Mathf.FloorToInt(floor * 0.8f) + Random.Range(0, 3);
            for (int i = 0; i < numEnemies && floorTiles.Count > 0; i++)
            {
                var tile = Pick();
                if (possible.Count == 0) break;
                var tmpl = possible[Random.Range(0, possible.Count)];
                var inst = EnemyInstance.FromTemplate(tmpl, floor);
                inst.X = tile.x;
                inst.Y = tile.y;
                map.Enemies.Add(inst);
            }

            // Boss every 5th floor
            if (floor % 5 == 0)
            {
                var bossPool = EnemyDB.All.FindAll(e => e.IsBoss && e.MinFloor <= floor);
                if (bossPool.Count > 0 && floorTiles.Count > 0)
                {
                    var tmpl = bossPool[bossPool.Count - 1];
                    var tile = Pick();
                    var inst = EnemyInstance.FromTemplate(tmpl, floor);
                    inst.X = tile.x;
                    inst.Y = tile.y;
                    map.Enemies.Add(inst);
                }
            }

            return map;
        }

        static void SafeCarve(GeneratedMap map, int x, int y)
        {
            if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
            map.Grid[x, y] = TileType.Floor;
        }
    }
}
