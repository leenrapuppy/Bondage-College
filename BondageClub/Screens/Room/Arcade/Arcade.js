"use strict";
var ArcadeBackground = "PartyBasement";
/** @type {null | NPCCharacter} */
var ArcadeEmployee = null;
/** @type {null | NPCCharacter} */
var ArcadePlayer = null;
var ArcadeAskedFor = null;
var ArcadePrice = 0;
var ArcadeDeviousChallenge = false;
var ArcadeCannotDoDeviousChallenge = false;
//

/**
 * Determines whether or not the player is bound and can plead to have their own headset put on them
 * @returns {boolean} - Whether or not the player can ask to have a headset put on
 */
function ArcadeCanAskForHeadsetHelpBound() {
	if (ArcadeCanPlayGames()) return false;
	return !Player.CanInteract() && DialogInventoryAvailable("InteractiveVRHeadset", "ItemHead");
}

/**
 * Determines whether or not the player is gagged and can plead to have their own headset put on them
 * @returns {boolean} - Whether or not the player can ask to have a headset put on
 */
function ArcadeCanAskForHeadsetHelpGagged() {
	if (ArcadeCanPlayGames()) return false;
	return !Player.CanInteract() && !Player.CanTalk() && DialogInventoryAvailable("InteractiveVRHeadset", "ItemHead");
}

/**
 * Determines whether or not the player can play games
 * @returns {boolean} - Whether or not the player has a headset
 */
function ArcadeCanPlayGames() {
	var head = InventoryGet(Player, "ItemHead");
	return head && head.Asset && (head.Asset.Name == "InteractiveVRHeadset" || head.Asset.Name == "InteractiveVisor");
}

/**
 * Determines whether or not the player can play games and is gagged
 * @returns {boolean} - Whether or not the player has a headset and is gagged
 */
function ArcadeCanPlayGamesAndGagged() {
	var head = InventoryGet(Player, "ItemHead");
	return !Player.CanTalk() && head && head.Asset && (head.Asset.Name == "InteractiveVRHeadset" || head.Asset.Name == "InteractiveVisor");
}

/**
 * Determines whether or not the player needs to rent a headset
 * @returns {boolean} - Whether or not the player needs to rent a headset
 */
function ArcadeNeedToRent() {
	return !ArcadeCanPlayGames() && !DialogInventoryAvailable("InteractiveVRHeadset", "ItemHead");
}


/**
 * Places a headset on the player
 * @returns {void} - Nothing
 */
function ArcadePutOnHeadset() {
	InventoryWear(Player, "InteractiveVRHeadset","ItemHead");
}





/**
 * Places a headset on the player and charges them 10
 * @returns {void} - Nothing
 */
function ArcadeBuyHeadset() {
	InventoryWear(Player, "InteractiveVRHeadset","ItemHead");
	CharacterChangeMoney(Player, -10);
}



/**
 * Toggles the Devious Dungeon Challenge
 * @returns {void} - Nothing
 */
function ArcadeToggleDeviousChallenge() {
	ArcadeDeviousChallenge = !ArcadeDeviousChallenge;
	if (ArcadeDeviousChallenge)
		LogAdd("DeviousChallenge", "Arcade", 1, true);
	else
		LogDelete("DeviousChallenge", "Arcade", true);
}

/**
 * Returns the deviouschallenge
 * @returns {boolean} - ArcadeDeviousChallenge
 */
function ArcadeDeviousChallengeAllowed() {
	return !ArcadeDeviousChallenge && !ArcadeCannotDoDeviousChallenge;
}

/**
 * Returns the deviouschallenge
 * @returns {boolean} - ArcadeDeviousChallenge
 */
function ArcadeDeviousChallengeEnabled() {
	return ArcadeDeviousChallenge;
}


/**
 * Loads the Arcade room and initializes the NPCs. This function is called dynamically
 * @returns {void} - Nothing
 */
function ArcadeLoad() {
	ArcadeEmployee = CharacterLoadNPC("NPC_Arcade_Employee");
	ArcadePlayer = CharacterLoadNPC("NPC_Arcade_Player");
	InventoryWear(ArcadePlayer, "InteractiveVRHeadset","ItemHead");

	//if (!InventoryCharacterHasOwnerOnlyRestraint(Player) && !InventoryCharacterHasLoverOnlyRestraint(Player)) {
	ArcadeDeviousChallenge = LogValue("DeviousChallenge", "Arcade") == 1;
	//ArcadeCannotDoDeviousChallenge = false
	//}
	//else
	//ArcadeCannotDoDeviousChallenge = true

}

/**
 * Run the Arcade room and draw characters. This function is called dynamically at short intervals.
 * Don't use expensive loops or functions from here
 * @returns {void} - Nothing
 */
function ArcadeRun() {
	DrawCharacter(Player, 750, 0, 1);
	DrawCharacter(ArcadeEmployee, 250, 0, 1);
	DrawCharacter(ArcadePlayer, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	const ready = ArcadeKinkyDungeonLoad();
	if (ArcadeCanPlayGames()) DrawButton(1885, 265, 90, 90, "", ready ? "White" : "Grey", "Icons/KinkyDungeon.png", ready ? undefined : "Loading...", !ready);
	else DrawButton(1885, 265, 90, 90, "", "Pink", "Icons/KinkyDungeon.png");
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ArcadeClick() {
	if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(250, 0, 500, 1000)) {
		ArcadeEmployee.Stage = "0";
		CharacterSetCurrent(ArcadeEmployee);
	}
	if (MouseIn(1250, 0, 500, 1000)) {
		ArcadePlayer.Stage = "0";
		CharacterSetCurrent(ArcadePlayer);
	}

	if (ArcadeCanPlayGames()) {
		if (MouseIn(1885, 265, 90, 90)) ArcadeKinkyDungeonStart(ReputationGet("Gaming"));
	}

	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * Starts the kinky dungeon game
 * @param {number} PlayerLevel - The player's current level in the game
 * @returns {void} - Nothing
 */
function ArcadeKinkyDungeonStart(PlayerLevel) {
	if (!ArcadeKinkyDungeonLoad())
		return;
	if (KinkyDungeonPlayerCharacter != null) {
		KinkyDungeonGameRunning = false; // Reset the game to prevent carrying over spectator data
		KinkyDungeonPlayerCharacter = null;
	}
	MiniGameStart("KinkyDungeon", PlayerLevel, "ArcadeKinkyDungeonEnd");
}

/**
 * Ends the therapy mini-game as a nurse, plays with reputation and money
 * @returns {void} - Nothing
 */
function ArcadeKinkyDungeonEnd() {
	CommonSetScreen("Room", "Arcade");

	//if (MiniGameVictory) {

	//}
}

var KinkyDungeonFiles = [
	"Screens/MiniGame/KinkyDungeon/KDModUtils.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonStats.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEditorTiles.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEditor.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEditorGen.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonErrors.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeon.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonGame.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonVibe.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonBuffsList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonAlt.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonBones.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMapMods.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonBoss.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonPerks.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonParams.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonVision.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonQuest.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonLoot.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEnemies.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonPersonality.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEnemiesList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEnemyEventList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonCurse.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonRestraints.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonRestraintsList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonFight.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonWeaponList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonInput.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonHUD.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonDraw.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonFurniture.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMagic.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMagicCode.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMagicList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonPlayerEffects.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonShrine.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonObject.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonItem.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonDress.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEffectTiles.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonDressList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonConsumables.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonConsumablesList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonInventory.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMultiplayer.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonLore.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonReputation.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonTraps.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonTiles.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonTilesList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonPathfinding.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonBuffs.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonEvents.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonSpawns.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonJail.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonSetpiece.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonDialogue.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonDialogueTriggers.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonDialogueList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonFactions.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonFactionsList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMistress.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonJailList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonTests.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonLootList.js",
	"Screens/MiniGame/KinkyDungeon/KinkyDungeonMusic.js",
	"Screens/MiniGame/KinkyDungeon/KDDelayedActions.js",
];

var KinkyDungeonIsLoading = false;
var KinkyDungeonReady = false;

async function ArcadeKinkyDungeonStartLoad() {
	for (const file of KinkyDungeonFiles) {
		await new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.onerror = reject;
			script.onload = () => resolve();
			script.setAttribute("language", "JavaScript");
			script.setAttribute("crossorigin", "anonymous");
			script.setAttribute("src", file);
			document.head.appendChild(script);
		});
	}
}

/**
 * @returns {boolean} - False if the dungeon is not ready yet, true otherwise
 */
function ArcadeKinkyDungeonLoad() {
	if (!KinkyDungeonIsLoading) {
		KinkyDungeonIsLoading = true;
		void ArcadeKinkyDungeonStartLoad().then(() => {
			KinkyDungeonReady = true;
		});
	}
	return KinkyDungeonReady;
}
