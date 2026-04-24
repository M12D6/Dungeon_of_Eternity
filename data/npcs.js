// ═══════════════════════════════════════════════════════════════
//  NPCs — town-dwellers, merchants, quest givers
// ═══════════════════════════════════════════════════════════════
export const NPC_TEMPLATES = [
  { id:"npc_smith",      name:"Durgan Ironforge", icon:"🧔", role:"Blacksmith",
    faction:"IRONHOLD", dialogue:["Another sword? I'll forge it.","Steel bends to my will.","Bring me iron and I'll make it sing."],
    services:["craft"] },
  { id:"npc_alchemist",  name:"Zeladra the Wise", icon:"🧙‍♀️", role:"Alchemist",
    faction:"ARCANE_COUNCIL", dialogue:["The right brew changes everything.","I have potions — all colors.","Trade me soul shards for elixirs."],
    services:["potions","scrolls"] },
  { id:"npc_rogue",      name:"Vex the Silent",   icon:"🥷", role:"Fence",
    faction:"SHADOWVEIL", dialogue:["You see nothing.","The black market has... everything.","Discretion is gold."],
    services:["blackmarket"] },
  { id:"npc_priest",     name:"Father Halen",     icon:"⛪", role:"Priest",
    faction:"CELESTIAL_HOST", dialogue:["Light guide your path.","I can heal your wounds, for a price.","Blessings to the faithful."],
    services:["heal","bless","resurrect"] },
  { id:"npc_necro",      name:"Mother Ossur",     icon:"💀", role:"Bone-Wife",
    faction:"BONEMARROW", dialogue:["The dead speak if you listen.","I trade in souls. Got any?","Death is just a door."],
    services:["souls","raise"] },
  { id:"npc_stable",     name:"Barta Stablemaster",icon:"🐴", role:"Beast Keeper",
    faction:"EMBER_CONCLAVE", dialogue:["Every creature can be tamed.","Feed them. Love them. Then they'll die for you.","Pick a pet — any pet."],
    services:["pets","stable"] },
  { id:"npc_jeweler",    name:"Faela Goldsmith",  icon:"💎", role:"Jeweler",
    faction:"SHADOWVEIL", dialogue:["Gems tell stories in their cuts.","Socketing is an art.","I deal only in the finest."],
    services:["socket","gems"] },
  { id:"npc_scribe",     name:"Archivist Wen",    icon:"📜", role:"Scribe",
    faction:"ARCANE_COUNCIL", dialogue:["Knowledge is the deepest treasure.","I collect all scrolls.","Let me read your future."],
    services:["scrolls","lore"] },
  { id:"npc_innkeeper",  name:"Brilla Ale-Mother",icon:"🍺", role:"Innkeeper",
    faction:null, dialogue:["Sit, warrior, sit!","The soup is free for the injured.","Rest here — you look half-dead."],
    services:["rest","food"] },
  { id:"npc_gambler",    name:"Dice Randal",      icon:"🎲", role:"Gambler",
    faction:null, dialogue:["Feeling lucky?","One roll, one life.","Double or nothing, eh?"],
    services:["gamble"] },
  { id:"npc_ranger",     name:"Tael Greenhand",   icon:"🏹", role:"Ranger Captain",
    faction:null, dialogue:["The wilds are my home.","Quests for the brave only.","Have you seen the old oak?"],
    services:["quest"] },
  { id:"npc_mystic",     name:"Oracle Umbra",     icon:"🔮", role:"Mystic",
    faction:"ABYSSAL_CULT", dialogue:["I see... blood. Always blood.","The void whispers to me.","Would you take the black gift?"],
    services:["curse","unmake"] },
];

// Town templates — a random town picks NPCs from pool
export const TOWN_TEMPLATES = [
  { id:"t_crossroads", name:"Crossroads Hamlet", size:4, flavor:"A dusty waypoint between dungeons." },
  { id:"t_ironhold",   name:"Ironhold Keep",     size:6, flavor:"A stout fortress of grim warriors." },
  { id:"t_spire",      name:"The Spire",         size:5, flavor:"A mage-built tower piercing the clouds." },
  { id:"t_hollow",     name:"The Hollow",        size:5, flavor:"A hidden thieves' den in the rocks." },
  { id:"t_sanctuary",  name:"Dawn Sanctuary",    size:5, flavor:"White walls, golden spires, watchful angels." },
  { id:"t_ossuary",    name:"The Ossuary",       size:4, flavor:"Bone-walled necropolis of the cult." },
  { id:"t_emberkeep",  name:"Emberkeep",         size:5, flavor:"A city built in an active volcano." },
  { id:"t_frostward",  name:"Frostward Hall",    size:5, flavor:"Ice-carved halls of the northern clans." },
  { id:"t_eyeless",    name:"The Eyeless Temple",size:4, flavor:"A shrine to a god without eyes." },
  { id:"t_harborow",   name:"Harborow",          size:6, flavor:"A sunken port town, half underwater." },
];

export function generateTown(floor) {
  const tpl = TOWN_TEMPLATES[Math.floor(Math.random() * TOWN_TEMPLATES.length)];
  const pool = [...NPC_TEMPLATES];
  const npcs = [];
  for (let i = 0; i < tpl.size && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    npcs.push({ ...pool.splice(idx, 1)[0], uid:`npc_${Date.now()}_${i}` });
  }
  return { ...tpl, floor, npcs, uid:`town_${Date.now()}` };
}
