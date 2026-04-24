// ═══════════════════════════════════════════════════════════════
//  META — saving, loading, mastery, NG+
// ═══════════════════════════════════════════════════════════════
const SAVE_KEY_PREFIX = "doe_save_";
const META_KEY = "doe_meta";

// In-memory save store (for environments without localStorage)
const memStore = {};

function safeSet(key, val) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(val));
    else memStore[key] = JSON.parse(JSON.stringify(val));
  } catch (e) { memStore[key] = val; }
}

function safeGet(key) {
  try {
    if (typeof localStorage !== "undefined") {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    }
    return memStore[key] || null;
  } catch (e) { return memStore[key] || null; }
}

function safeRemove(key) {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    delete memStore[key];
  } catch (e) { delete memStore[key]; }
}

// ─────────────────────────────────────────────────────────────
// Character saves — slots 1..5
// ─────────────────────────────────────────────────────────────
export function saveCharacter(slot, state) {
  safeSet(SAVE_KEY_PREFIX + slot, {
    savedAt: Date.now(),
    ...state,
  });
}

export function loadCharacter(slot) {
  return safeGet(SAVE_KEY_PREFIX + slot);
}

export function deleteCharacter(slot) {
  safeRemove(SAVE_KEY_PREFIX + slot);
}

export function listCharacters() {
  const out = [];
  for (let i = 1; i <= 5; i++) {
    const s = safeGet(SAVE_KEY_PREFIX + i);
    out.push({ slot: i, save: s });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// Meta progression — mastery, unlocks, NG+
// ─────────────────────────────────────────────────────────────
export function loadMeta() {
  const m = safeGet(META_KEY);
  if (m) return m;
  return initialMeta();
}

export function saveMeta(meta) {
  safeSet(META_KEY, meta);
}

export function initialMeta() {
  return {
    masteryPoints: 0,
    classMastery: {},  // class -> runs
    highestFloor: 0,
    totalRuns: 0,
    totalDeaths: 0,
    ngPlus: 0,
    hardcoreClears: 0,
    speedrunBest: null,
    unlockedClasses: ["WARRIOR","MAGE","ROGUE","PALADIN","NECROMANCER","BERSERKER","RANGER","SORCERER"],
    unlockedTitles: [],
    cosmetics: [],
    bestiary: {},    // enemy id -> { kills, firstSeen }
    itemsSeen: {},   // item id -> count
    collectionLog: {}, // item id -> { count, firstFound }
    leaderboard: [], // { name, floor, class, date }
    ghosts: [],      // { name, floor, class, cause, date }
    dailySeed: "",
    lastDailyDate: "",
    house: null,
    reputation: null,
    achievements: null,
  };
}

// Record a run's completion into meta
export function recordRun(meta, runData) {
  const next = { ...meta };
  next.totalRuns = (meta.totalRuns || 0) + 1;
  next.highestFloor = Math.max(meta.highestFloor || 0, runData.floor || 0);
  next.classMastery = { ...(meta.classMastery || {}) };
  next.classMastery[runData.cls] = (next.classMastery[runData.cls] || 0) + 1;
  next.masteryPoints = (meta.masteryPoints || 0) + Math.floor((runData.floor || 0) / 2);
  if (runData.died) next.totalDeaths = (meta.totalDeaths || 0) + 1;
  if (runData.hardcore && !runData.died) next.hardcoreClears = (meta.hardcoreClears || 0) + 1;
  // Leaderboard
  next.leaderboard = [...(meta.leaderboard || []), {
    name: runData.name, cls: runData.cls, floor: runData.floor,
    kills: runData.kills || 0, died: !!runData.died, date: Date.now(),
  }].sort((a, b) => b.floor - a.floor).slice(0, 25);
  // Ghost (for death)
  if (runData.died) {
    next.ghosts = [{
      name: runData.name, cls: runData.cls, floor: runData.floor,
      cause: runData.cause || "unknown", date: Date.now(),
    }, ...(meta.ghosts || [])].slice(0, 10);
  }
  return next;
}

// Update bestiary with newly-seen enemy
export function recordBestiary(meta, enemyId) {
  const next = { ...meta, bestiary: { ...(meta.bestiary || {}) } };
  const cur = next.bestiary[enemyId] || { kills: 0, firstSeen: Date.now() };
  cur.kills += 1;
  next.bestiary[enemyId] = cur;
  return next;
}

export function recordItemSeen(meta, itemId) {
  const next = { ...meta, itemsSeen: { ...(meta.itemsSeen || {}) } };
  next.itemsSeen[itemId] = (next.itemsSeen[itemId] || 0) + 1;
  if (!next.collectionLog) next.collectionLog = {};
  if (!next.collectionLog[itemId]) next.collectionLog[itemId] = { count: 0, firstFound: Date.now() };
  next.collectionLog[itemId].count += 1;
  return next;
}

// Mastery bonuses applied to new runs
export function masteryBonuses(meta, cls) {
  const runs = (meta.classMastery || {})[cls] || 0;
  return {
    hp:   Math.floor(runs * 3),
    mana: Math.floor(runs * 2),
    atk:  Math.floor(runs * 0.7),
    def:  Math.floor(runs * 0.5),
  };
}

// NG+ scaling
export function ngPlusMods(ngLevel) {
  return {
    enemyHp:   1 + ngLevel * 0.35,
    enemyAtk:  1 + ngLevel * 0.25,
    goldMult:  1 + ngLevel * 0.50,
    expMult:   1 + ngLevel * 0.40,
    lootLuck:  ngLevel * 10,
  };
}

// Daily seed
export function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

export function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s & 0xffff) / 0xffff;
  };
}
