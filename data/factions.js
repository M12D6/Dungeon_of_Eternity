// ═══════════════════════════════════════════════════════════════
//  FACTIONS — 8 factions with reputation rewards
// ═══════════════════════════════════════════════════════════════
export const FACTIONS = {
  IRONHOLD: {
    id:"IRONHOLD", name:"The Ironhold Order", icon:"⚒️", color:"#f59e0b",
    desc:"A warrior brotherhood of dwarven smiths. Values steel and strength.",
    hq:"Ironhold Keep",
    tiers:[
      { tier:0, name:"Stranger",    min:0 },
      { tier:1, name:"Initiate",    min:100, unlock:"5% discount at shops" },
      { tier:2, name:"Soldier",     min:300, unlock:"Crafting recipes for iron weapons" },
      { tier:3, name:"Captain",     min:700, unlock:"Access to Ironhold Quartermaster" },
      { tier:4, name:"Warlord",     min:1500, unlock:"Legendary weapon: Ironhold Edge" },
      { tier:5, name:"Grandmaster", min:3500, unlock:"Mythic hammer + Forgelord title" },
    ],
    rivals:["SHADOWVEIL"],
    allies:["EMBER_CONCLAVE"],
  },
  ARCANE_COUNCIL: {
    id:"ARCANE_COUNCIL", name:"The Arcane Council", icon:"📘", color:"#3b82f6",
    desc:"Scholar-mages who catalog all magic. Values knowledge.",
    hq:"The Spire of Lumos",
    tiers:[
      { tier:0, name:"Outsider",    min:0 },
      { tier:1, name:"Apprentice",  min:100, unlock:"Scrolls at reduced price" },
      { tier:2, name:"Adept",       min:300, unlock:"Access to rare scrolls" },
      { tier:3, name:"Magister",    min:700, unlock:"+50 max mana passive" },
      { tier:4, name:"Archmage",    min:1500, unlock:"Mythic staff craftable" },
      { tier:5, name:"Oracle",      min:3500, unlock:"All spells cost 15% less MP" },
    ],
    rivals:["BONEMARROW"],
    allies:["CELESTIAL_HOST"],
  },
  SHADOWVEIL: {
    id:"SHADOWVEIL", name:"The Shadowveil", icon:"🗡️", color:"#8b5cf6",
    desc:"A thieves guild. Deals in secrets and blades.",
    hq:"The Hidden Tavern",
    tiers:[
      { tier:0, name:"Unknown",     min:0 },
      { tier:1, name:"Mark",        min:100, unlock:"Black market access" },
      { tier:2, name:"Blade",       min:300, unlock:"Stealth potions +quality" },
      { tier:3, name:"Shadow",      min:700, unlock:"Lockpick — always succeeds" },
      { tier:4, name:"Assassin",    min:1500, unlock:"Shadowstrike dagger + Poison master" },
      { tier:5, name:"Shadowlord",  min:3500, unlock:"Phase-step: once per floor, teleport" },
    ],
    rivals:["IRONHOLD","CELESTIAL_HOST"],
    allies:["BONEMARROW"],
  },
  CELESTIAL_HOST: {
    id:"CELESTIAL_HOST", name:"The Celestial Host", icon:"😇", color:"#fde047",
    desc:"Paladins and clerics. Values light and mercy.",
    hq:"The Cathedral of Dawn",
    tiers:[
      { tier:0, name:"Lay",         min:0 },
      { tier:1, name:"Acolyte",     min:100, unlock:"Free heal once per floor" },
      { tier:2, name:"Priest",      min:300, unlock:"Resurrection service in towns" },
      { tier:3, name:"Paladin",     min:700, unlock:"+15 HP regen passive" },
      { tier:4, name:"Templar",     min:1500, unlock:"Divine Plate crafting" },
      { tier:5, name:"Hierophant",  min:3500, unlock:"Auto-revive once per run" },
    ],
    rivals:["BONEMARROW","ABYSSAL_CULT"],
    allies:["ARCANE_COUNCIL","IRONHOLD"],
  },
  BONEMARROW: {
    id:"BONEMARROW", name:"The Bonemarrow Cult", icon:"💀", color:"#64748b",
    desc:"Necromancers who defy death. Values domination.",
    hq:"The Ossuary",
    tiers:[
      { tier:0, name:"Living",      min:0 },
      { tier:1, name:"Acolyte",     min:100, unlock:"Raise Dead scroll" },
      { tier:2, name:"Deathcaller", min:300, unlock:"Undead pets remain between floors" },
      { tier:3, name:"Necromancer", min:700, unlock:"+20% dark damage" },
      { tier:4, name:"Liche",       min:1500, unlock:"Lich Crown equipment" },
      { tier:5, name:"Eternal",     min:3500, unlock:"Undeath: revive as lich once per run" },
    ],
    rivals:["CELESTIAL_HOST"],
    allies:["SHADOWVEIL","ABYSSAL_CULT"],
  },
  EMBER_CONCLAVE: {
    id:"EMBER_CONCLAVE", name:"The Ember Conclave", icon:"🔥", color:"#ef4444",
    desc:"Fire-worshipers of the volcano. Masters of forge magic.",
    hq:"Emberkeep",
    tiers:[
      { tier:0, name:"Ashen",       min:0 },
      { tier:1, name:"Emberborn",   min:100, unlock:"Fire-infusion recipes" },
      { tier:2, name:"Flamewalker", min:300, unlock:"Fire resistance +30%" },
      { tier:3, name:"Pyromancer",  min:700, unlock:"Flamebrand +upgrade" },
      { tier:4, name:"Inferno",     min:1500, unlock:"Phoenix companion" },
      { tier:5, name:"Ashen King",  min:3500, unlock:"Meteor passive on kill" },
    ],
    rivals:["FROSTWARD"],
    allies:["IRONHOLD"],
  },
  FROSTWARD: {
    id:"FROSTWARD", name:"The Frostward Kin", icon:"🧊", color:"#60a5fa",
    desc:"Northern clans who bind ice. Cold-hearted but honorable.",
    hq:"Frostward Hall",
    tiers:[
      { tier:0, name:"Stranger",    min:0 },
      { tier:1, name:"Kin",         min:100, unlock:"Ice resistance +30%" },
      { tier:2, name:"Winterborn",  min:300, unlock:"Frostfang craftable" },
      { tier:3, name:"Winter Hunter",min:700,unlock:"Ice spells chance to freeze 2x" },
      { tier:4, name:"Frostlord",   min:1500, unlock:"Summon ice wolf pack" },
      { tier:5, name:"Jotun",       min:3500, unlock:"Absolute Zero — freeze all" },
    ],
    rivals:["EMBER_CONCLAVE"],
    allies:[],
  },
  ABYSSAL_CULT: {
    id:"ABYSSAL_CULT", name:"The Abyssal Eye", icon:"👁️", color:"#a855f7",
    desc:"Worshipers of the void. Forbidden, dangerous, powerful.",
    hq:"The Eyeless Temple",
    tiers:[
      { tier:0, name:"Sane",        min:0 },
      { tier:1, name:"Whispered",   min:100, unlock:"Void scrolls" },
      { tier:2, name:"Tainted",     min:300, unlock:"+1 spell slot" },
      { tier:3, name:"Touched",     min:700, unlock:"Eldritch Sight — see all traps" },
      { tier:4, name:"Unmade",      min:1500, unlock:"Reality Tear scroll" },
      { tier:5, name:"Eye of the Abyss",min:3500, unlock:"Void form transformation" },
    ],
    rivals:["CELESTIAL_HOST"],
    allies:["BONEMARROW"],
  },
};

export const FACTION_LIST = Object.keys(FACTIONS);

export function initialReputation() {
  const rep = {};
  FACTION_LIST.forEach(f => { rep[f] = 0; });
  return rep;
}

export function tierFor(factionId, reputation) {
  const f = FACTIONS[factionId];
  if (!f) return null;
  let best = f.tiers[0];
  for (const t of f.tiers) if (reputation >= t.min) best = t;
  return best;
}

export function gainRep(repObj, factionId, amount) {
  const next = { ...repObj };
  const f = FACTIONS[factionId];
  if (!f) return next;
  next[factionId] = Math.max(0, (next[factionId] || 0) + amount);
  // Rivals lose rep, allies gain small rep
  if (amount > 0) {
    (f.rivals || []).forEach(r => { next[r] = Math.max(0, (next[r] || 0) - Math.floor(amount * 0.3)); });
    (f.allies || []).forEach(a => { next[a] = (next[a] || 0) + Math.floor(amount * 0.1); });
  }
  return next;
}
