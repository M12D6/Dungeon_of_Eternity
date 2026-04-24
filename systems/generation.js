// ═══════════════════════════════════════════════════════════════
//  MAP & CONTENT GENERATION
// ═══════════════════════════════════════════════════════════════
import { ENEMY_DATA, bossForFloor } from "../data/enemies.js";
import { ALL_ITEMS } from "../data/items.js";
import { rollRarity } from "../data/rarity.js";
import { BIOMES, biomeForFloor, rollWeather } from "../data/world.js";

export const COLS = 19;
export const ROWS = 14;

export const T = {
  FLOOR: 0, WALL: 1, DOOR: 2, CHEST: 3, STAIRS: 4,
  SHRINE: 5, TRAP: 6, SHOP: 7, TOWN: 8, RAID: 9,
  PUZZLE: 10, PORTAL: 11, FOUNTAIN: 12, SECRET: 13, FORGE: 14,
};

// ─────────────────────────────────────────────────────────────
// Room-based BSP-lite generator
// ─────────────────────────────────────────────────────────────
export function generateMap(floor, biomeId = null, opts = {}) {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(T.WALL));
  const rooms = [];
  const biome = biomeId || biomeForFloor(floor);

  // Create 6–11 rooms in a grid-aligned BSP-lite layout
  const numRooms = 7 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numRooms; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4) % 3;
    const ax = col * 4 + 1;
    const ay = row * 4 + 1;
    const aw = 6, ah = 4;
    const w = Math.floor(Math.random() * (aw - 2)) + 4;
    const h = Math.floor(Math.random() * (ah - 1)) + 3;
    const x = ax + Math.floor(Math.random() * Math.max(1, aw - w));
    const y = ay + Math.floor(Math.random() * Math.max(1, ah - h));
    if (x + w >= COLS - 1 || y + h >= ROWS - 1) continue;
    rooms.push({ x, y, w, h });
    for (let ry = y; ry < y + h; ry++)
      for (let rx = x; rx < x + w; rx++) grid[ry][rx] = T.FLOOR;
  }

  // Corridors — L-shaped between room centers
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1], b = rooms[i];
    const ax = Math.floor(a.x + a.w / 2), ay = Math.floor(a.y + a.h / 2);
    const bx = Math.floor(b.x + b.w / 2), by = Math.floor(b.y + b.h / 2);
    let cx = ax, cy = ay;
    while (cx !== bx) { if (grid[cy] && cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) grid[cy][cx] = T.FLOOR; cx += cx < bx ? 1 : -1; }
    while (cy !== by) { if (grid[cy] && cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) grid[cy][cx] = T.FLOOR; cy += cy < by ? 1 : -1; }
  }

  // Tile pool
  const floorTiles = [];
  for (let ry = 0; ry < ROWS; ry++)
    for (let rx = 0; rx < COLS; rx++)
      if (grid[ry][rx] === T.FLOOR) floorTiles.push({ x: rx, y: ry });

  const pick = () => {
    if (!floorTiles.length) return null;
    const idx = Math.floor(Math.random() * floorTiles.length);
    return floorTiles.splice(idx, 1)[0];
  };

  // Place features
  const chests  = Math.min(4, Math.floor(Math.random() * 3) + 2);
  const traps   = Math.min(5, Math.floor(Math.random() * 3) + 1 + Math.floor(floor / 5));
  const shrines = Math.floor(Math.random() * 2) + 1;
  const shops   = floor > 1 ? Math.floor(Math.random() * 2) : 1;
  const fountains = Math.random() < 0.4 ? 1 : 0;
  const secrets = Math.random() < 0.25 ? 1 : 0;
  const town    = (floor > 1 && floor % 4 === 0) ? 1 : 0;
  const puzzle  = (floor > 5 && Math.random() < 0.15) ? 1 : 0;
  const portal  = (floor > 8 && Math.random() < 0.1) ? 1 : 0;
  const forge   = (floor > 3 && Math.random() < 0.3) ? 1 : 0;

  for (let i = 0; i < chests; i++)   { const t = pick(); if (t) grid[t.y][t.x] = T.CHEST; }
  for (let i = 0; i < traps; i++)    { const t = pick(); if (t) grid[t.y][t.x] = T.TRAP; }
  for (let i = 0; i < shrines; i++)  { const t = pick(); if (t) grid[t.y][t.x] = T.SHRINE; }
  for (let i = 0; i < shops; i++)    { const t = pick(); if (t) grid[t.y][t.x] = T.SHOP; }
  for (let i = 0; i < fountains; i++){ const t = pick(); if (t) grid[t.y][t.x] = T.FOUNTAIN; }
  for (let i = 0; i < secrets; i++)  { const t = pick(); if (t) grid[t.y][t.x] = T.SECRET; }
  for (let i = 0; i < town; i++)     { const t = pick(); if (t) grid[t.y][t.x] = T.TOWN; }
  for (let i = 0; i < puzzle; i++)   { const t = pick(); if (t) grid[t.y][t.x] = T.PUZZLE; }
  for (let i = 0; i < portal; i++)   { const t = pick(); if (t) grid[t.y][t.x] = T.PORTAL; }
  for (let i = 0; i < forge; i++)    { const t = pick(); if (t) grid[t.y][t.x] = T.FORGE; }

  // Boss lair every 5 floors uses RAID tile
  const stairsTile = pick();
  if (stairsTile) grid[stairsTile.y][stairsTile.x] = T.STAIRS;

  const playerStart = pick() || { x: 1, y: 1 };
  grid[playerStart.y][playerStart.x] = T.FLOOR;

  // Enemies scale with floor
  const enemies = [];
  const biomeEnemies = (BIOMES[biome]?.enemies || []);
  const pool = ENEMY_DATA.filter(e =>
    !e.isBoss && !e.rare && !e.isMimic &&
    e.floor <= Math.min(floor, 20) &&
    (biomeEnemies.length === 0 || biomeEnemies.includes(e.id) || !biomeEnemies.length)
  );
  const fallback = ENEMY_DATA.filter(e => !e.isBoss && !e.rare && e.floor <= 3);
  const enemySrc = pool.length > 0 ? pool : fallback;
  const numEnemies = 4 + Math.floor(floor * 0.9) + Math.floor(Math.random() * 3);

  for (let i = 0; i < numEnemies; i++) {
    const t = pick();
    if (!t) break;
    const base = enemySrc[Math.floor(Math.random() * enemySrc.length)];
    const scale = 1 + (floor - 1) * 0.12;
    enemies.push({
      ...base,
      uid: `e_${i}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      hp: Math.round(base.hp * scale),
      maxHp: Math.round(base.hp * scale),
      atk: Math.round(base.atk * scale),
      def: Math.round(base.def * scale),
      exp: Math.round(base.exp * scale),
      gold: Math.round(base.gold * scale),
      x: t.x, y: t.y,
      status: null, statusTurns: 0,
    });
  }

  // Boss every 5 floors
  if (floor % 5 === 0) {
    const base = bossForFloor(floor);
    if (base) {
      const scale = 1 + (floor - base.floor) * 0.1;
      const t = pick() || { x: 8, y: 6 };
      enemies.push({
        ...base,
        uid: `boss_${Date.now()}`,
        hp: Math.round(base.hp * scale),
        maxHp: Math.round(base.hp * scale),
        atk: Math.round(base.atk * scale),
        def: Math.round(base.def * scale),
        exp: Math.round(base.exp * scale),
        gold: Math.round(base.gold * scale),
        x: t.x, y: t.y,
        status: null, statusTurns: 0,
      });
    }
  }

  const weather = rollWeather(floor);
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const visionRadius = 4;
  return { grid, enemies, playerStart, biome, weather, visited, visionRadius };
}

// ─────────────────────────────────────────────────────────────
// Fog of war — mark tiles visible around the player
// ─────────────────────────────────────────────────────────────
export function updateVisibility(mapData, px, py, radius = 4) {
  const visited = mapData.visited.map(r => [...r]);
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      if (dx * dx + dy * dy <= radius * radius) visited[ny][nx] = true;
    }
  }
  return visited;
}

// ─────────────────────────────────────────────────────────────
// Loot generator — picks items of appropriate rarity
// ─────────────────────────────────────────────────────────────
export function generateLoot(floor, count = 1, opts = {}) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const rarity = rollRarity(floor, opts.luck || 0);
    const pool = ALL_ITEMS.filter(it => it.rarity === rarity);
    const fallback = ALL_ITEMS.filter(it => it.rarity === "COMMON");
    const src = pool.length > 0 ? pool : fallback;
    const base = src[Math.floor(Math.random() * src.length)];
    items.push({ ...base, uid: `item_${Date.now()}_${Math.random().toString(36).slice(2,8)}` });
  }
  return items;
}

// Materials loot — drops materials for crafting
export function generateMaterials(floor, count = 1) {
  const mats = ALL_ITEMS.filter(it => it.slot === "material" || it.slot === "gem");
  const items = [];
  for (let i = 0; i < count; i++) {
    const base = mats[Math.floor(Math.random() * mats.length)];
    if (base) items.push({ ...base, uid: `mat_${Date.now()}_${Math.random().toString(36).slice(2,8)}` });
  }
  return items;
}
