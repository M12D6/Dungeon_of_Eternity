# Dungeon of Eternity — Steam Edition

A Unity 2022.3 LTS desktop port of the web-based Dungeon Quest prototype. Targets Windows, macOS, and Linux through Steam.

## Project Layout

```
steam-app/
  Assets/
    Scenes/MainScene.unity        Single entry scene
    Scripts/
      Data/                       Static game data (ported 1:1 from JSX)
        Rarity.cs                 Rarity tiers (Common .. Mythic + Unique) + RollByFloor()
        ClassData.cs              8 character classes with passives and spell lists
        Spell.cs                  40 spells + StatusType enum
        Item.cs                   ~70 items with upgrade-level support, LevelReq, Element
        Enemy.cs                  40+ enemies including 6 bosses
        Biome.cs                  15 themed biomes (colour palette + flavour text)
        StatusEffect.cs           14 status effects with DoT percentages
      Systems/
        LootGenerator.cs          Floor/biome/level-aware rarity rolling
        MapGenerator.cs           BSP-lite floor gen (21x15)
        PlayerState.cs            Live player: HP/MP/inventory, level-up, stat calc
        CombatSystem.cs           Damage calc, crit, status, spells, enemy AI
        GameManager.cs            Singleton state machine + save/load (JSON)
      UI/
        UIRouter.cs               Hides/shows panels per GameScreen
        TitleScreen.cs            Title screen buttons
        CharSelectScreen.cs       Class picker with name input
        GameScreenController.cs   Grid renderer, HUD, world log
        CombatScreenController.cs Combat HUD + spell bar
        InventoryScreen.cs        Inventory grid + equipment panel + weapon upgrade
        ShopScreen.cs             Buy / sell grids
        GameOverScreen.cs         Summary on death
      Steam/
        SteamManager.cs           Optional Steamworks.NET wrapper (no-op unless STEAMWORKS_NET is defined)
      Bootstrap.cs                Scene entry point
      DungeonOfEternity.asmdef    Assembly definition
  Packages/manifest.json          Unity package list (TMP, Input System, UGUI)
  ProjectSettings/                Unity project settings YAML
```

## First-time Setup

1. Install Unity Hub + Unity 2022.3.45f1 (or any 2022.3 LTS).
2. Open Unity Hub and click **Open > Add project from disk**, pointing at `steam-app/`.
3. Unity will import the project on first open — this generates the `Library/` cache and `.meta` files (both git-ignored).
4. Open `Assets/Scenes/MainScene.unity`.
5. Build out the UI by creating panels that each call the appropriate controller script (see **Scene Wiring** below).

## Scene Wiring (Recommended)

The scripts are decoupled from a specific prefab layout so you can drive them from any UGUI Canvas hierarchy. Typical setup:

- **Canvas (Screen Space Overlay)**
  - `TitlePanel` - buttons wired to `TitleScreen` fields
  - `CharSelectPanel` - `ScrollView > CardContainer`, `NameInput`, `ConfirmButton` -> `CharSelectScreen`
  - `GamePanel` - `GridParent` (GridLayoutGroup), `LogContent` (VerticalLayoutGroup), HUD bars -> `GameScreenController`
  - `CombatPanel` - enemy/player displays + spell grid -> `CombatScreenController`
  - `InventoryPanel` - item grid + equipment slot panel -> `InventoryScreen`
  - `ShopPanel` - buy/sell grids -> `ShopScreen`
  - `GameOverPanel` -> `GameOverScreen`
- **Bootstrap** GameObject with `Bootstrap` and `UIRouter` components (assign panels to the router fields).

Prefabs needed:
- `TileCellPrefab` - `Image` + child `TMP_Text` called `Label`
- `LogLinePrefab` - `TMP_Text`
- `ClassCardPrefab` - `Button`, `Image`, child `TMP_Text`s named `NameText`, `DescText`, `StatsText`
- `ItemCardPrefab` - `Image`, named `TMP_Text`s + optional `EquipButton`, `UseButton`, `DropButton`
- `EquipSlotPrefab` - labels `SlotText`, `ItemText` + optional `UnequipButton`
- `SpellButtonPrefab` - `Button` + `TMP_Text`

## Steamworks Integration

The game runs fine without Steam. To enable Steam features:

1. Register on [Steamworks](https://partner.steamgames.com) and reserve an App ID.
2. Download [Steamworks.NET](https://github.com/rlabrecque/Steamworks.NET/releases) and import the `.unitypackage` into the project.
3. Edit `SteamManager.cs` and replace `AppId = 480;` with your real AppID.
4. In **Project Settings > Player > Other Settings > Scripting Define Symbols**, add `STEAMWORKS_NET`.
5. Create a `steam_appid.txt` file at the project root containing just your App ID (for local testing).
6. Rebuild.

Optional next steps:
- Wire achievements into `GameManager` events (e.g., `OnPlayerChanged` for level milestones).
- Add Steam Cloud save by writing the output of `GameManager.Serialize()` to `SteamRemoteStorage.FileWrite`.
- Call `SteamUserStats.SetStat` when `Player.BossKills` or `Player.FloorsCleared` change.

## Build & Ship

1. **File > Build Settings > Windows, Mac, Linux (Standalone)**.
2. Add the MainScene to **Scenes in Build**.
3. Click **Build** — output goes to `Builds/Windows/DungeonOfEternity.exe` (or your chosen path).
4. Install the [SteamPipe tools](https://partner.steamgames.com/doc/sdk/uploading) (`steamcmd`).
5. Create a `depot_build.vdf` pointing at your `Builds/Windows/` directory.
6. Upload with: `steamcmd +login <user> +run_app_build depot_build.vdf +quit`.

## Design Notes (Dungeon Quest Parity)

- **Epic+ is rare**: the loot curve in `RarityDB.RollByFloor` hard-caps Mythic behind `roll > 115`. Floor bonus is +2 per floor, so even on floor 40 Mythic rolls are single-digit percent.
- **Biome-gated loot**: `LootGenerator` weights items with matching `Element` 4x for each biome, so frozen caverns tend to drop ice weapons, infernal depths drop fire, etc.
- **Level-locked equips**: each drop gets `LevelReq = clamp(floor/2 + tier*2, 1, playerLevel+4)`. `PlayerState.Equip` refuses items over the player's level.
- **Weapon upgrades**: `Item.UpgradeLevel` stacks up to +15. `PlayerState.UpgradeWeapon(cost)` bumps it; cost scales quadratically (`50 * (n+1)^2`). The `TotalAtk`/`TotalDef`/`TotalHp` getters include the upgrade bonus, so common drops from later floors genuinely outclass early-game rares once upgraded.
- **Stat variance**: every drop is rolled with a 0.9-1.15 stat multiplier, so two "Iron Plate" drops are not identical.

## Out of the Box You Get

- 8 playable classes with unique spells and passives
- 40+ enemies, 6 bosses, infinite floors
- 15 themed biomes
- 70+ items across weapons, armor, accessories, consumables, scrolls
- Turn-based combat with crits, status effects, and class-specific mechanics
- Save/load (JSON) with optional Steam Cloud hook
- Shop, shrines, traps, chests, procedural floors
