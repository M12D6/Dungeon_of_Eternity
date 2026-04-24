// ═══════════════════════════════════════════════════════════════
//  TITLES — earned cosmetic/prestige titles
// ═══════════════════════════════════════════════════════════════
export const TITLES = {
  NOVICE:        { name:"Novice",         color:"#9ca3af", desc:"A new hero." },
  VETERAN:       { name:"Veteran",        color:"#22c55e", desc:"Has seen battle." },
  BUTCHER:       { name:"the Butcher",    color:"#dc2626", desc:"A slayer of many." },
  ANNIHILATOR:   { name:"the Annihilator",color:"#ef4444", desc:"Extinction walks." },
  EXTINCTION:    { name:"Extinction",     color:"#7f1d1d", desc:"The last sound they heard." },
  BOSS_HUNTER:   { name:"Boss Hunter",    color:"#fbbf24", desc:"Felled champions." },
  WORLDSLAYER:   { name:"Worldslayer",    color:"#f59e0b", desc:"Broke the world's heroes." },
  DEEP_DIVER:    { name:"Deep Diver",     color:"#a855f7", desc:"Went too far down." },
  ABYSSAL:       { name:"the Abyssal",    color:"#7c2d12", desc:"Kissed the abyss and lived." },
  ENDLESS:       { name:"the Endless",    color:"#6366f1", desc:"Never stops descending." },
  WORLDBORN:     { name:"Worldborn",      color:"#fcd34d", desc:"Born in the deep." },
  MASTER:        { name:"Master",         color:"#60a5fa", desc:"Mastered their class." },
  LEGENDARY:     { name:"the Legendary",  color:"#f97316", desc:"Songs are sung about them." },
  TRANSCENDENT:  { name:"Transcendent",   color:"#e879f9", desc:"Beyond mortal limits." },
  MERCHANT:      { name:"the Merchant",   color:"#facc15", desc:"Rich beyond measure." },
  DRAGONHOARDER: { name:"Dragonhoarder",  color:"#eab308", desc:"Rivals dragons in greed." },
  HOARDER:       { name:"the Hoarder",    color:"#fcd34d", desc:"Cannot let go." },
  ARCHIVIST:     { name:"Archivist",      color:"#38bdf8", desc:"Knows every artifact." },
  MYTHWALKER:    { name:"Mythwalker",     color:"#a855f7", desc:"Found something mythic." },
  MYTH_COLLECTOR:{ name:"Myth Collector", color:"#d946ef", desc:"Treasure-hunter supreme." },
  SET_MASTER:    { name:"Set Master",     color:"#14b8a6", desc:"Collected matched sets." },
  LEGENDARY_ATTIRE:{name:"in Legendary Attire",color:"#14b8a6", desc:"All sets complete." },
  SCHOLAR:       { name:"Scholar",        color:"#60a5fa", desc:"Keeper of magic lore." },
  GRIMOIRE:      { name:"Grimoire",       color:"#3b82f6", desc:"A walking spellbook." },
  OMNISCIENT:    { name:"the Omniscient", color:"#06b6d4", desc:"Knows all spells." },
  PACK_LEADER:   { name:"Pack Leader",    color:"#10b981", desc:"Commands loyal beasts." },
  ZOO_MASTER:    { name:"Zoo Master",     color:"#22c55e", desc:"Tamed every beast." },
  MASTER_CRAFTER:{ name:"Master Crafter", color:"#f59e0b", desc:"Skilled at the forge." },
  GRANDMASTER_SMITH:{name:"Grandmaster Smith",color:"#f97316", desc:"Legendary craftsman." },
  JOURNEY:       { name:"on a Journey",   color:"#84cc16", desc:"Many quests completed." },
  CHOSEN_ONE:    { name:"the Chosen One", color:"#fde047", desc:"Destiny incarnate." },
  WORLDWALKER:   { name:"Worldwalker",    color:"#8b5cf6", desc:"Roamed many realms." },
  CARTOGRAPHER:  { name:"Cartographer",   color:"#a78bfa", desc:"Mapped the world." },
  PERSISTENT:    { name:"Persistent",     color:"#a3e635", desc:"Never gives up." },
  ETERNAL_HERO:  { name:"Eternal Hero",   color:"#fbbf24", desc:"Immortal in spirit." },
  DEATH_ACQUAINTED:{name:"Death-Touched", color:"#64748b", desc:"Met death and returned." },
  CRIT_MASTER:   { name:"Crit Master",    color:"#fbbf24", desc:"Deadly accurate." },
  CRIT_LORD:     { name:"Crit Lord",      color:"#f59e0b", desc:"Lives for crits." },
  ARTISAN:       { name:"Artisan",        color:"#f59e0b", desc:"Skilled crafter." },
  WEEKLY_EXPLORER:{name:"Weekly Explorer",color:"#06b6d4", desc:"Weekly champion." },
  DRAGONSLAYER:  { name:"Dragonslayer",   color:"#ef4444", desc:"Slew an ancient dragon." },
  // Hardcore titles
  HARDCORE:      { name:"Hardcore",       color:"#dc2626", desc:"Permadeath survivor." },
  NG_PLUS:       { name:"Reborn",         color:"#a855f7", desc:"Returned for more." },
  SPEEDRUNNER:   { name:"Speedrunner",    color:"#06b6d4", desc:"Quick descent champion." },
  // Role titles
  FORGELORD:     { name:"Forgelord",      color:"#f59e0b", desc:"Forge mastery." },
  ORACLE:        { name:"Oracle",         color:"#3b82f6", desc:"Council revered." },
  SHADOWLORD:    { name:"Shadowlord",     color:"#8b5cf6", desc:"Veil master." },
  HIEROPHANT:    { name:"Hierophant",     color:"#fde047", desc:"Holy incarnate." },
  ETERNAL:       { name:"Eternal",        color:"#64748b", desc:"Defeated death itself." },
  ASHEN_KING:    { name:"Ashen King",     color:"#ef4444", desc:"Flame sovereign." },
  JOTUN:         { name:"Jotun",          color:"#60a5fa", desc:"Ice-bound colossus." },
  EYE_OF_ABYSS:  { name:"Eye of the Abyss",color:"#a855f7", desc:"Unmade and remade." },
};

export function titleLabel(key) {
  const t = TITLES[key];
  return t ? t.name : "";
}
