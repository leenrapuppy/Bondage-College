"use strict";
let KDDebug = false;

var KinkyDungeonBackground = "BrickWall";
var KinkyDungeonPlayer = null;
var KinkyDungeonState = "Menu";

var KinkyDungeonRep = 0; // Variable to store max level to avoid losing it if the server doesnt take the rep update

var KinkyDungeonKeybindings = null;
var KinkyDungeonKeybindingsTemp = null;
var KinkyDungeonKeybindingCurrentKey = 0;

let KinkyDungeonNewGame = 0;
let KinkyDungeonDifficultyMode = 0;

var KinkyDungeonGameRunning = false;

//var KinkyDungeonKeyLower = [87+32, 65+32, 83+32, 68+32, 81+32, 45+32, 90+32, 43+32]; // WASD
var KinkyDungeonKey = [119, 97, 115, 100, 113, 101, 122, 99]; // WASD
//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
var KinkyDungeonKeySpell = [49, 50, 51, 52, 53]; // 1 2 3
var KinkyDungeonKeyWait = [120]; // x
let KinkyDungeonKeySkip = [13]; // Enter

var KinkyDungeonRootDirectory = "Screens/MiniGame/KinkyDungeon/";
var KinkyDungeonPlayerCharacter = null; // Other player object
var KinkyDungeonGameData = null; // Data sent by other player
var KinkyDungeonGameDataNullTimer = 4000; // If data is null, we query this often
var KinkyDungeonGameDataNullTimerTime = 0;
var KinkyDungeonStreamingPlayers = []; // List of players to stream to

var KinkyDungeonInitTime = 0;

let KinkyDungeonSleepTime = 0;
let KinkyDungeonFreezeTime = 1000;
let KinkyDungeonAutoWait = false;

let KinkyDungeonConfigAppearance = false;


/**
*  @typedef {{
* PoolUses: number,
* PoolUsesGrace: number,
* JailRemoveRestraintsTimer: number;
* KinkyDungeonSpawnJailers: number;
* KinkyDungeonSpawnJailersMax: number;
* KinkyDungeonLeashedPlayer: number;
* KinkyDungeonLeashingEnemy: number;
* KinkyDungeonJailGuard: number;
* KinkyDungeonGuardTimer: number;
* KinkyDungeonGuardTimerMax: number;
* KinkyDungeonGuardSpawnTimer: number;
* KinkyDungeonGuardSpawnTimerMax: number;
* KinkyDungeonGuardSpawnTimerMin: number;
* KinkyDungeonMaxPrisonReduction: number;
* KinkyDungeonPrisonReduction: number;
* KinkyDungeonPrisonExtraGhostRep: number;
* PrisonGoodBehaviorFromLeash: number;
* KinkyDungeonJailTourTimer: number;
* KinkyDungeonJailTourTimerMin: number;
* KinkyDungeonJailTourTimerMax: number;
* KinkyDungeonPenanceCostCurrent: number;
* KinkyDungeonAngel: number;
* KDPenanceStage: number;
* KDPenanceStageEnd: number;
* AngelCurrentRep: string;
* KDPenanceMode: string;
* OrgasmStage: number;
* OrgasmTurns: number;
* OrgasmStamina: number;
* SleepTurns: number;
* PlaySelfTurns: number;
* RescueFlag: boolean;
* KinkyDungeonPenance: boolean;
* GuardApplyTime: number;
* WarningLevel: number;
* AncientEnergyLevel: number;
* Outfit: string,
*}} KDGameDataBase
*/
let KDGameDataBase = {
	PoolUses: 0,
	PoolUsesGrace: 3,
	JailRemoveRestraintsTimer: 0,
	KinkyDungeonSpawnJailers: 0,
	KinkyDungeonSpawnJailersMax: 5,
	KinkyDungeonLeashedPlayer: 0,
	KinkyDungeonLeashingEnemy: 0,

	KinkyDungeonJailGuard: 0,
	KinkyDungeonGuardTimer: 0,
	KinkyDungeonGuardTimerMax: 22,
	KinkyDungeonGuardSpawnTimer: 0,
	KinkyDungeonGuardSpawnTimerMax: 30,
	KinkyDungeonGuardSpawnTimerMin: 10,
	KinkyDungeonMaxPrisonReduction: 10,
	KinkyDungeonPrisonReduction: 0,
	KinkyDungeonPrisonExtraGhostRep: 0,
	PrisonGoodBehaviorFromLeash: 0,

	KinkyDungeonJailTourTimer: 0,
	KinkyDungeonJailTourTimerMin: 20,
	KinkyDungeonJailTourTimerMax: 40,

	KinkyDungeonPenanceCostCurrent: 100,

	KinkyDungeonAngel: 0,
	KDPenanceStage: 0,
	KDPenanceStageEnd: 0,
	AngelCurrentRep: "",
	KDPenanceMode: "",

	OrgasmStage: 0,
	OrgasmTurns: 0,
	OrgasmStamina: 0,

	KinkyDungeonPenance: false,

	RescueFlag: false,

	SleepTurns: 0,
	PlaySelfTurns: 0,
	GuardApplyTime: 0,

	AncientEnergyLevel: 0,

	Outfit: "OutfitDefault",

	WarningLevel: 0,
};
/**
 * @type {KDGameDataBase}
 */
let KDGameData = Object.assign({}, KDGameDataBase);
/*{
	KinkyDungeonSpawnJailers: 0,
	KinkyDungeonSpawnJailersMax: 5,
	KinkyDungeonLeashedPlayer: 0,
	KinkyDungeonLeashingEnemy: 0,

	KinkyDungeonJailGuard: 0,
	KinkyDungeonGuardTimer: 0,
	KinkyDungeonGuardTimerMax: 22,
	KinkyDungeonGuardSpawnTimer: 0,
	KinkyDungeonGuardSpawnTimerMax: 20,
	KinkyDungeonGuardSpawnTimerMin: 6,
	KinkyDungeonMaxPrisonReduction: 10,
	KinkyDungeonPrisonReduction: 0,
	KinkyDungeonPrisonExtraGhostRep: 0,

	KinkyDungeonJailTourTimer: 0,
	KinkyDungeonJailTourTimerMin: 20,
	KinkyDungeonJailTourTimerMax: 40,

	KinkyDungeonPenanceCostCurrent: 100,

	KinkyDungeonAngel: 0,
	KDPenanceStage: 0,
	KDPenanceStageEnd: 0,
	AngelCurrentRep: "",
	KDPenanceMode: "",

	KinkyDungeonPenance: false,
};*/

let KDLeashingEnemy = null;
function KinkyDungeonLeashingEnemy() {
	if (KDGameData.KinkyDungeonLeashingEnemy) {
		if (!KDLeashingEnemy) {
			KDLeashingEnemy = KinkyDungeonFindID(KDGameData.KinkyDungeonLeashingEnemy);
		}
	} else {
		KDLeashingEnemy = null;
	}
	return KDLeashingEnemy;
}
let KDJailGuard = null;
function KinkyDungeonJailGuard() {
	if (KDGameData.KinkyDungeonJailGuard) {
		if (!KDJailGuard) {
			KDJailGuard = KinkyDungeonFindID(KDGameData.KinkyDungeonJailGuard);
		}
	} else {
		KDJailGuard = null;
	}
	return KDJailGuard;
}
let KDAngel = null;
function KinkyDungeonAngel() {
	if (KDGameData.KinkyDungeonAngel) {
		if (!KDAngel) {
			KDAngel = KinkyDungeonFindID(KDGameData.KinkyDungeonAngel);
		}
	} else {
		KDAngel = null;
	}
	return KDAngel;
}

function KDMapInit(list) {
	let map = new Map();
	for (let l of list) {
		map.set(l, true);
	}
	return map;
}

function KDistEuclidean(x, y) {
	return Math.sqrt(x*x + y*y);
}

function KDistChebyshev(x, y) {
	return Math.max(Math.abs(x), Math.abs(y));
}

/**
 * Loads the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonLoad() {
	CurrentDarkFactor = 0;

	KinkyDungeonInitTime = CommonTime();
	KinkyDungeonGameKey.load();

	if (!KinkyDungeonIsPlayer()) KinkyDungeonGameRunning = false;

	if (!Player.KinkyDungeonExploredLore) Player.KinkyDungeonExploredLore = [];
	//if (!Player.KinkyDungeonSave) Player.KinkyDungeonSave = {};

	if (!KinkyDungeonGameRunning) {
		if (!KinkyDungeonPlayer) {
			KDrandomizeSeed();
			KinkyDungeonPlayer = CharacterLoadNPC("NPC_Avatar");
			KinkyDungeonPlayer.Type = "simple";
			// @ts-ignore
			KinkyDungeonPlayer.OnlineSharedSettings = {BlockBodyCosplay: true, };
			KinkyDungeonSound = localStorage.getItem("KinkyDungeonSound") != undefined ? localStorage.getItem("KinkyDungeonSound") == "True" : true;

			KinkyDungeonNewDress = true;
			var appearance = LZString.decompressFromBase64(localStorage.getItem("kinkydungeonappearance"));
			if (!appearance) {
				KinkyDungeonNewDress = false;
				appearance = CharacterAppearanceStringify(KinkyDungeonPlayerCharacter ? KinkyDungeonPlayerCharacter : Player);
			}

			CharacterAppearanceRestore(KinkyDungeonPlayer, appearance);

			CharacterReleaseTotal(KinkyDungeonPlayer);
			KinkyDungeonDressSet();
			CharacterNaked(KinkyDungeonPlayer);
			KinkyDungeonInitializeDresses();
			KinkyDungeonDressPlayer();
		}

		if (localStorage.getItem("KinkyDungeonKeybindings") && JSON.parse(localStorage.getItem("KinkyDungeonKeybindings"))) {
			KinkyDungeonKeybindings = JSON.parse(localStorage.getItem("KinkyDungeonKeybindings"));
			KinkyDungeonKeybindingsTemp = {};
			Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			console.log(KinkyDungeonKeybindings);
		}
		else console.log("Failed to load keybindings");

		if (KinkyDungeonIsPlayer()) {
			KinkyDungeonState = "Menu";
			KinkyDungeonGameData = null;

			CharacterAppearancePreviousEmoticon = WardrobeGetExpression(Player).Emoticon;
			ServerSend("ChatRoomCharacterExpressionUpdate", { Name: "Gaming", Group: "Emoticon", Appearance: ServerAppearanceBundle(Player.Appearance) });
		} else {
			KinkyDungeonState = "Game";
			if (!KinkyDungeonGameData) {
				MiniGameKinkyDungeonLevel = 1;
				KinkyDungeonInitialize(1);
			}
		}

		for (let G = 0; G < KinkyDungeonStruggleGroupsBase.length; G++) {
			let group = KinkyDungeonStruggleGroupsBase[G];
			if (group == "ItemM") {
				if (InventoryGet(Player, "ItemMouth"))
					KinkyDungeonRestraintsLocked.push("ItemMouth");
				if (InventoryGet(Player, "ItemMouth2"))
					KinkyDungeonRestraintsLocked.push("ItemMouth2");
				if (InventoryGet(Player, "ItemMouth3"))
					KinkyDungeonRestraintsLocked.push("ItemMouth3");
			}

			if (InventoryGet(Player, group))
				KinkyDungeonRestraintsLocked.push(group);
		}
	}
}

/**
 * Restricts Devious Dungeon Challenge to only occur when inside the arcade
 * @returns {boolean} - If the player is in the arcade
 */
function KinkyDungeonDeviousDungeonAvailable() {
	return KinkyDungeonIsPlayer() && (DialogGamingPreviousRoom == "Arcade" || MiniGameReturnFunction == "ArcadeKinkyDungeonEnd");
}

/**
 * Returns whether or not the player is the one playing, which determines whether or not to draw the UI and struggle groups
 * @returns {boolean} - If the player is the game player
 */
function KinkyDungeonIsPlayer() {
	return (!KinkyDungeonPlayerCharacter || KinkyDungeonPlayerCharacter == Player) ;
}

/**
 * Runs the kinky dungeon game and draws its components on screen
 * @returns {void} - Nothing
 */

let KinkyDungeonCreditsPos = 0;
let KinkyDungeonPatronPos = 0;
let KinkyDungeonSound = true;
let KinkyDungeonDrool = true;
let KinkyDungeonGraphicsQuality = true;
let KinkyDungeonFastWait = true;

function KinkyDungeonRun() {
	let BG = "BrickWall";
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	if (params && params.background) BG = params.background;
	if (KinkyDungeonState == "Lose") BG = "Pandora/Underground/Cell4";
	DrawImage("Backgrounds/" + BG + ".jpg", 0, 0);

	// Draw the characters
	if (KDGameData && KDGameData.AncientEnergyLevel) {
		let h = 1000 * KDGameData.AncientEnergyLevel;
		const Grad = MainCanvas.createLinearGradient(0, 1000-h, 0, 1000);
		Grad.addColorStop(0, `rgba(255,255,0,0)`);
		Grad.addColorStop(0.5, `rgba(255,255,128,0.5)`);
		Grad.addColorStop(0.75, `rgba(255,255,255,1.0)`);
		Grad.addColorStop(1.0, `rgba(255,255,255,0.25)`);
		MainCanvas.fillStyle = Grad;
		MainCanvas.fillRect(0, 1000-h, 500, h);
	}
	DrawCharacter(KinkyDungeonPlayer, 0, 0, 1);

	if ((KinkyDungeonDrawState == "Game" || KinkyDungeonState != "Game") && ServerURL != "foobar")
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");


	if (KinkyDungeonState == "Credits") {
		let credits = TextGet("KinkyDungeonCreditsList" + KinkyDungeonCreditsPos).split('|');
		let i = 0;
		MainCanvas.textAlign = "left";
		for (let c of credits) {
			DrawText(c, 550, 25 + 40 * i, "white", "silver");
			i++;
		}
		MainCanvas.textAlign = "center";

		DrawButton(1870, 930, 110, 64, TextGet("KinkyDungeonBack"), "White", "");
		DrawButton(1730, 930, 110, 64, TextGet("KinkyDungeonNext"), "White", "");
	} if (KinkyDungeonState == "Patrons") {
		let credits = TextGet("KinkyDungeonPatronsList" + KinkyDungeonCreditsPos).split('|');
		let i = 0;
		MainCanvas.textAlign = "left";
		for (let c of credits) {
			DrawText(c, 550, 25 + 40 * i, "white", "silver");
			i++;
		}
		MainCanvas.textAlign = "center";

		DrawButton(1870, 930, 110, 64, TextGet("KinkyDungeonBack"), "White", "");
		//DrawButton(1730, 930, 110, 64, TextGet("KinkyDungeonNext"), "White", "");
	} else if (KinkyDungeonState == "Menu") {
		KinkyDungeonGameFlag = false;
		MainCanvas.textAlign = "left";
		DrawCheckbox(600, 100, 64, 64, TextGet("KinkyDungeonSound"), KinkyDungeonSound, false, "white");
		MainCanvas.textAlign = "center";
		// Draw temp start screen
		DrawText(TextGet("KinkyDungeon"), 1250, 300, "white", "silver");
		DrawText(TextGet("Intro"), 1250, 400, "white", "silver");
		DrawText(TextGet("Intro2"), 1250, 500, "white", "silver");
		DrawText(TextGet("Intro3"), 1250, 600, "white", "silver");
		DrawText(TextGet("Intro4"), 1250, 700, "white", "silver");

		if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && ServerURL != "foobar")
			DrawText(TextGet("DeviousChallenge"), 1250, 925, "white", "silver");

		DrawButton(875, 750, 350, 64, TextGet("GameContinue"), localStorage.getItem('KinkyDungeonSave') ? "White" : "pink", "");
		DrawButton(875, 820, 350, 64, TextGet("GameStart"), "White", "");
		DrawButton(1275, 820, 350, 64, TextGet("LoadGame"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameConfigKeys"), "White", "");

		DrawButton(50, 930, 400, 64, TextGet("KinkyDungeonDressPlayer"), "White", "");
		DrawButton(500, 930, 220, 64, TextGet((KinkyDungeonReplaceConfirm > 0 ) ? "KinkyDungeonConfirm" : "KinkyDungeonDressPlayerReset"), "White", "");
		DrawButton(1870, 930, 110, 64, TextGet("KinkyDungeonCredits"), "White", "");
		DrawButton(1700, 930, 150, 64, TextGet("KinkyDungeonPatrons"), "White", "");
	} else if (KinkyDungeonState == "Load") {
		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonLoadConfirm"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");

		ElementPosition("saveInputField", 1250, 550, 1000, 230);
	} else if (KinkyDungeonState == "Diff") {
		DrawText(TextGet("KinkyDungeonDifficulty"), 1250, 300, "white", "silver");
		DrawButton(875, 450, 750, 64, TextGet("KinkyDungeonDifficulty0"), "White", "");
		DrawButton(875, 550, 750, 64, TextGet("KinkyDungeonDifficulty1"), "White", "");
		DrawButton(1075, 850, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");
	} else if (KinkyDungeonState == "Save") {
		// Draw temp start screen
		DrawText(TextGet("KinkyDungeonSaveIntro0"), 1250, 350, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro"), 1250, 475, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro2"), 1250, 550, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro3"), 1250, 625, "white", "silver");
		DrawText(TextGet("KinkyDungeonSaveIntro4"), 1250, 700, "white", "silver");

		ElementPosition("saveDataField", 1250, 150, 1000, 230);

		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonGameSave"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonGameContinue"), "White", "");
	} else if (KinkyDungeonState == "Lose") {
		MainCanvas.textAlign = "left";
		DrawCheckbox(600, 100, 64, 64, TextGet("KinkyDungeonSound"), KinkyDungeonSound, false, "white");
		MainCanvas.textAlign = "center";
		// Draw temp start screen
		DrawText(TextGet("End"), 1250, 400, "white", "silver");
		DrawText(TextGet("End2"), 1250, 500, "white", "silver");
		DrawText(TextGet("End3"), 1250, 600, "white", "silver");
		DrawButton(875, 750, 350, 64, TextGet("GameContinue"), localStorage.getItem('KinkyDungeonSave') ? "White" : "pink", "");
		DrawButton(875, 820, 350, 64, TextGet("GameStart"), "White", "");
		DrawButton(1275, 820, 350, 64, TextGet("LoadGame"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameConfigKeys"), "White", "");
		DrawButton(50, 930, 400, 64, TextGet("KinkyDungeonDressPlayer"), "White", "");
		DrawButton(500, 930, 220, 64, TextGet((KinkyDungeonReplaceConfirm > 0 ) ? "KinkyDungeonConfirm" : "KinkyDungeonDressPlayerReset"), "White", "");
	} else if (KinkyDungeonState == "Game") {
		KinkyDungeonGameRunning = true;
		KinkyDungeonGameFlag = true;
		KinkyDungeonDrawGame();
		if (KDGameData.SleepTurns > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KDGameData.SleepTurns -= 1;
				if (KinkyDungeonJailTransgressed)
					KinkyDungeonTotalSleepTurns += 1;
				if (KinkyDungeonStatStamina >= KinkyDungeonStatStaminaMax)  {
					KDGameData.SleepTurns = 0;
					if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && KinkyDungeonPlayer.IsKneeling()) {
						CharacterSetActivePose(KinkyDungeonPlayer, "BaseLower", false);
					}
				}
				KinkyDungeonAdvanceTime(1);
				KinkyDungeonSleepTime = CommonTime() + 10;
			}
			if (KDGameData.SleepTurns == 0) {
				KinkyDungeonChangeStamina(0);
			}
		} else if (KDGameData.PlaySelfTurns > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KinkyDungeonAdvanceTime(1);
				KDGameData.PlaySelfTurns -= 1;
				KinkyDungeonSleepTime = CommonTime() + 230;
			}
			if (KDGameData.SleepTurns == 0) {
				KinkyDungeonChangeStamina(0);
			}
		} else if (KinkyDungeonStatFreeze > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KinkyDungeonStatFreeze -= 1;
				KinkyDungeonAdvanceTime(1, false, true);
				KinkyDungeonSleepTime = CommonTime() + KinkyDungeonFreezeTime;
			}
		} else if (KinkyDungeonSlowMoveTurns > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KinkyDungeonSlowMoveTurns -= 1;
				KinkyDungeonAdvanceTime(1, false, true);
				KinkyDungeonSleepTime = CommonTime() + 200;
			}
		} else if (KinkyDungeonFastMove && KinkyDungeonFastMovePath && KinkyDungeonFastMovePath.length > 0) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				if (KinkyDungeonFastMovePath.length > 0) {
					let next = KinkyDungeonFastMovePath[0];
					KinkyDungeonDoorCloseTimer = 1;
					KinkyDungeonFastMovePath.splice(0, 1);
					if (Math.max(Math.abs(next.x-KinkyDungeonPlayerEntity.x), Math.abs(next.y-KinkyDungeonPlayerEntity.y)) < 1.5)
						KinkyDungeonMove({x:next.x-KinkyDungeonPlayerEntity.x, y:next.y-KinkyDungeonPlayerEntity.y}, 1, true);
					else KinkyDungeonFastMovePath = [];
				}
				KinkyDungeonSleepTime = CommonTime() + 100;
			}
		} else if (KinkyDungeonFastStruggle && KinkyDungeonFastStruggleType && KinkyDungeonFastStruggleGroup) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				let result = KinkyDungeonStruggle(KinkyDungeonFastStruggleGroup, KinkyDungeonFastStruggleType);
				if (result != "Fail" || !KinkyDungeonHasStamina(1.1)) {
					KinkyDungeonFastStruggleType = "";
					KinkyDungeonFastStruggleGroup = "";
				}
				KinkyDungeonSleepTime = CommonTime() + 250;
			}
		} else if (KinkyDungeonAutoWait) {
			if (CommonTime() > KinkyDungeonSleepTime) {
				KinkyDungeonMove({x:0, y: 0, delta: 0}, 1, false);
				KinkyDungeonSleepTime = CommonTime() + (KinkyDungeonFastWait ? 100 : 300);
			}
		} else KinkyDungeonSleepTime = CommonTime() + 100;
	} else if (KinkyDungeonState == "End") {
		KinkyDungeonGameRunning = false;
		// Draw temp start screen
		DrawText(TextGet("EndWin"), 1250, 400, "white", "silver");
		DrawText(TextGet("EndWin2"), 1250, 500, "white", "silver");

		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonNewGamePlus"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameReturnToMenu"), "White", "");
	} else if (KinkyDungeonState == "Keybindings") {
		// Draw temp start screen
		DrawButton(1075, 750, 350, 64, TextGet("GameReturnToMenu"), "White", "");

		// Draw key buttons
		DrawButton(1075, 350, 350, 64, TextGet("KinkyDungeonKeyUp") + ": '" + (KinkyDungeonKeybindingsTemp.Up) + "'", "White", "");
		DrawButton(1075, 550, 350, 64, TextGet("KinkyDungeonKeyDown") + ": '" + (KinkyDungeonKeybindingsTemp.Down) + "'", "White", "");
		DrawButton(675, 450, 350, 64, TextGet("KinkyDungeonKeyLeft") + ": '" + (KinkyDungeonKeybindingsTemp.Left) + "'", "White", "");
		DrawButton(1475, 450, 350, 64, TextGet("KinkyDungeonKeyRight") + ": '" + (KinkyDungeonKeybindingsTemp.Right) + "'", "White", "");

		DrawButton(675, 350, 350, 64, TextGet("KinkyDungeonKeyUpLeft") + ": '" + (KinkyDungeonKeybindingsTemp.UpLeft) + "'", "White", "");
		DrawButton(1475, 350, 350, 64, TextGet("KinkyDungeonKeyUpRight") + ": '" + (KinkyDungeonKeybindingsTemp.UpRight) + "'", "White", "");
		DrawButton(675, 550, 350, 64, TextGet("KinkyDungeonKeyDownLeft") + ": '" + (KinkyDungeonKeybindingsTemp.DownLeft) + "'", "White", "");
		DrawButton(1475, 550, 350, 64, TextGet("KinkyDungeonKeyDownRight") + ": '" + (KinkyDungeonKeybindingsTemp.DownRight) + "'", "White", "");

		DrawButton(1075, 450, 350, 64, TextGet("KinkyDungeonKeyWait") + ": '" + (KinkyDungeonKeybindingsTemp.Wait) + "'", "White", "");
		DrawButton(1050, 650, 400, 64, TextGet("KinkyDungeonKeySkip") + ": '" + (KinkyDungeonKeybindingsTemp.Skip) + "'", "White", "");

		DrawButton(675, 200, 200, 64, TextGet("KinkyDungeonKeySpell1") + ": '" + (KinkyDungeonKeybindingsTemp.Spell1) + "'", "White", "");
		DrawButton(900, 200, 200, 64, TextGet("KinkyDungeonKeySpell2") + ": '" + (KinkyDungeonKeybindingsTemp.Spell2) + "'", "White", "");
		DrawButton(1125, 200, 200, 64, TextGet("KinkyDungeonKeySpell3") + ": '" + (KinkyDungeonKeybindingsTemp.Spell3) + "'", "White", "");
		DrawButton(1350, 200, 200, 64, TextGet("KinkyDungeonKeySpell4") + ": '" + (KinkyDungeonKeybindingsTemp.Spell4) + "'", "White", "");
		DrawButton(1575, 200, 200, 64, TextGet("KinkyDungeonKeySpell5") + ": '" + (KinkyDungeonKeybindingsTemp.Spell5) + "'", "White", "");

		if (KinkyDungeonKeybindingCurrentKey)
			DrawText(TextGet("KinkyDungeonCurrentPress") + ": '" + (KinkyDungeonKeybindingCurrentKey) + "'", 1250, 900, "white", "silver");

		DrawText(TextGet("KinkyDungeonCurrentPressInfo"), 1250, 950, "white", "silver");
	}

}

let KinkyDungeonReplaceConfirm = 0;
let KinkyDungeonGameFlag = false;

function KinkyDungeonStartNewGame(Load) {
	KinkyDungeonNewGame = 0;
	KinkyDungeonInitialize(1);
	MiniGameKinkyDungeonCheckpoint = 0;
	if (Load)
		KinkyDungeonLoadGame();
	KinkyDungeonCreateMap(KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint], MiniGameKinkyDungeonLevel);
	KinkyDungeonState = "Game";

	if (KinkyDungeonKeybindings) {
		KinkyDungeonKey = [KinkyDungeonKeybindings.Up, KinkyDungeonKeybindings.Left, KinkyDungeonKeybindings.Down, KinkyDungeonKeybindings.Right, KinkyDungeonKeybindings.UpLeft, KinkyDungeonKeybindings.UpRight, KinkyDungeonKeybindings.DownLeft, KinkyDungeonKeybindings.DownRight]; // WASD
		KinkyDungeonGameKey.KEY_UP = (KinkyDungeonKeybindings.Up);
		KinkyDungeonGameKey.KEY_DOWN = (KinkyDungeonKeybindings.Down);
		KinkyDungeonGameKey.KEY_LEFT = (KinkyDungeonKeybindings.Left);
		KinkyDungeonGameKey.KEY_RIGHT = (KinkyDungeonKeybindings.Right);
		KinkyDungeonGameKey.KEY_UPLEFT = (KinkyDungeonKeybindings.UpLeft);
		KinkyDungeonGameKey.KEY_DOWNLEFT = (KinkyDungeonKeybindings.DownLeft);
		KinkyDungeonGameKey.KEY_UPRIGHT = (KinkyDungeonKeybindings.UpRight);
		KinkyDungeonGameKey.KEY_DOWNRIGHT = (KinkyDungeonKeybindings.DownRight);

		//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
		KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3, KinkyDungeonKeybindings.Spell4, KinkyDungeonKeybindings.Spell5]; // ! @ #
		KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
		KinkyDungeonKeySkip = [KinkyDungeonKeybindings.Skip]; // Space and 5 (53)

		KinkyDungeonGameKey.KEY_WAIT = (KinkyDungeonKeybindings.Wait);
		KinkyDungeonGameKey.KEY_SKIP = (KinkyDungeonKeybindings.Skip);
	}
	if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/StoneDoor_Close.ogg");
}

function KinkyDungeonHandleClick() {
	if (MouseIn(1885, 25, 90, 90) && (KinkyDungeonDrawState == "Game" || KinkyDungeonState != "Game")) {
		ElementRemove("saveDataField");
		ElementRemove("saveInputField");
		KinkyDungeonExit();
		return true;
	}
	if (KinkyDungeonState == "Credits") {
		if (MouseIn(1870, 930, 110, 64)) {
			KinkyDungeonState = "Menu";
			return true;
		}
		if (MouseIn(1730, 930, 110, 64)) {
			if (KinkyDungeonCreditsPos < 1) KinkyDungeonCreditsPos += 1;
			else KinkyDungeonCreditsPos = 0;
		}
	} if (KinkyDungeonState == "Patrons") {
		if (MouseIn(1870, 930, 110, 64)) {
			KinkyDungeonState = "Menu";
			return true;
		}
	} else if (KinkyDungeonState == "Diff") {
		if (MouseIn(875, 450, 750, 64)) {
			KinkyDungeonDifficultyMode = 0;
			KinkyDungeonStartNewGame();
		} else if (MouseIn(875, 550, 750, 64)) {
			KinkyDungeonDifficultyMode = 1;
			KinkyDungeonStartNewGame();
		} else if (MouseIn(1075, 850, 350, 64)) {
			KinkyDungeonState = "Menu";
		}
	} else if (KinkyDungeonState == "Load"){
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonChestsOpened = [];
			KinkyDungeonOrbsPlaced = [];
			KinkyDungeonCachesPlaced = [];
			KinkyDungeonNewGame = 0;
			KinkyDungeonDifficultyMode = 0;
			KinkyDungeonInitialize(1);
			MiniGameKinkyDungeonCheckpoint = 1;
			if (KinkyDungeonLoadGame(ElementValue("saveInputField"))) {
				KinkyDungeonCreateMap(KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint], MiniGameKinkyDungeonLevel);
				ElementRemove("saveInputField");
				KinkyDungeonState = "Game";

				if (KinkyDungeonKeybindings) {
					KinkyDungeonKey = [KinkyDungeonKeybindings.Up, KinkyDungeonKeybindings.Left, KinkyDungeonKeybindings.Down, KinkyDungeonKeybindings.Right, KinkyDungeonKeybindings.UpLeft, KinkyDungeonKeybindings.UpRight, KinkyDungeonKeybindings.DownLeft, KinkyDungeonKeybindings.DownRight]; // WASD
					KinkyDungeonGameKey.KEY_UP = (KinkyDungeonKeybindings.Up);
					KinkyDungeonGameKey.KEY_DOWN = (KinkyDungeonKeybindings.Down);
					KinkyDungeonGameKey.KEY_LEFT = (KinkyDungeonKeybindings.Left);
					KinkyDungeonGameKey.KEY_RIGHT = (KinkyDungeonKeybindings.Right);
					KinkyDungeonGameKey.KEY_UPLEFT = (KinkyDungeonKeybindings.UpLeft);
					KinkyDungeonGameKey.KEY_DOWNLEFT = (KinkyDungeonKeybindings.DownLeft);
					KinkyDungeonGameKey.KEY_UPRIGHT = (KinkyDungeonKeybindings.UpRight);
					KinkyDungeonGameKey.KEY_DOWNRIGHT = (KinkyDungeonKeybindings.DownRight);

					//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
					KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3, KinkyDungeonKeybindings.Spell4, KinkyDungeonKeybindings.Spell5]; // ! @ #
					KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
					KinkyDungeonKeySkip = [KinkyDungeonKeybindings.Skip]; // Space and 5 (53)

					KinkyDungeonGameKey.KEY_WAIT = (KinkyDungeonKeybindings.Wait);
					KinkyDungeonGameKey.KEY_SKIP = (KinkyDungeonKeybindings.Skip);
				}
			}
			return true;
		} else if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Menu";
			ElementRemove("saveInputField");
			return true;
		}
	} else if (KinkyDungeonState == "Menu" || KinkyDungeonState == "Lose") {
		if (MouseIn(600, 100, 64, 64)) {
			KinkyDungeonSound = !KinkyDungeonSound;
			localStorage.setItem("KinkyDungeonSound", KinkyDungeonSound ? "True" : "False");
		}
		if ((MouseIn(875, 750, 350, 64) && (localStorage.getItem('KinkyDungeonSave') || KinkyDungeonState == "Lose")) || MouseIn(875, 820, 350, 64)) {
			if (!MouseIn(875, 820, 350, 64)) {
				KinkyDungeonStartNewGame(true);
			} else KinkyDungeonState = "Diff";

			return false;
		} else if (MouseIn(1275, 820, 350, 64)) {
			KinkyDungeonState = "Load";
			ElementCreateTextArea("saveInputField");
			return true;
		} else if (MouseIn(50, 930, 400, 64)) {
			KinkyDungeonPlayer.OnlineSharedSettings = {AllowFullWardrobeAccess: true};
			KinkyDungeonNewDress = true;
			if (ServerURL == "foobar") {
				// Give all of the items
				for (let A = 0; A < Asset.length; A++)
					if ((Asset[A] != null) && (Asset[A].Group != null) && !InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name))
						InventoryAdd(Player, Asset[A].Name, Asset[A].Group.Name);
			}
			CharacterReleaseTotal(KinkyDungeonPlayer);
			KinkyDungeonDressPlayer();
			KinkyDungeonPlayer.OnlineSharedSettings = {BlockBodyCosplay: false, AllowFullWardrobeAccess: true};
			CharacterAppearanceLoadCharacter(KinkyDungeonPlayer);
			KinkyDungeonConfigAppearance = true;
			return true;
		} else if (MouseIn(500, 930, 220, 64)) {
			if (KinkyDungeonReplaceConfirm > 0) {
				KinkyDungeonDresses.Default = KinkyDungeonDefaultDefaultDress;
				CharacterAppearanceRestore(KinkyDungeonPlayer, CharacterAppearanceStringify(KinkyDungeonPlayerCharacter ? KinkyDungeonPlayerCharacter : Player));
				CharacterReleaseTotal(KinkyDungeonPlayer);
				KinkyDungeonSetDress("Default", "OutfitDefault");
				KinkyDungeonDressPlayer();
				KinkyDungeonConfigAppearance = true;
				return true;
			} else {
				KinkyDungeonReplaceConfirm = 2;
				return true;
			}
		} else if (MouseIn(1870, 930, 110, 64)) {
			KinkyDungeonState = "Credits";
			return true;
		}
		if (MouseIn(1700, 930, 150, 64)) {
			KinkyDungeonState = "Patrons";
			return true;
		}
		if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Keybindings";

			if (!KinkyDungeonKeybindings)
				KinkyDungeonKeybindingsTemp = {
					Down: 115,
					DownLeft: 122,
					DownRight: 99,
					Left: 97,
					Right: 100,
					Spell1: 49,
					Spell2: 50,
					Spell3: 51,
					Spell4: 52,
					Spell5: 53,
					Up: 119,
					UpLeft: 113,
					UpRight: 101,
					Wait: 120,
					Skip: 13,
				};
			else {
				KinkyDungeonKeybindingsTemp = {};
				Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			}
			return true;
		}
	} else if (KinkyDungeonState == "Save") {
		if (!KinkyDungeonIsPlayer()) KinkyDungeonState = "Game";
		if (MouseIn(875, 750, 350, 64)) {
			//KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonSavedGame"), "white", 1);
			//KinkyDungeonSaveGame();
			KinkyDungeonState = "Game";
			ElementRemove("saveDataField");
			KinkyDungeonChangeRep("Ghost", 5);
			return true;
		} else if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Game";
			ElementRemove("saveDataField");
			KinkyDungeonChangeRep("Ghost", -5);
			return true;
		}
	} else if (KinkyDungeonState == "Game") {
		if (KinkyDungeonIsPlayer()) KinkyDungeonClickGame();
	} else if (KinkyDungeonState == "Keybindings") {
		if (MouseIn(1075, 750, 350, 64)) {
			KinkyDungeonKeybindings = KinkyDungeonKeybindingsTemp;
			if (KinkyDungeonGameFlag) {
				KinkyDungeonState = "Game";
				if (KinkyDungeonKeybindings) {
					KinkyDungeonKey = [KinkyDungeonKeybindings.Up, KinkyDungeonKeybindings.Left, KinkyDungeonKeybindings.Down, KinkyDungeonKeybindings.Right, KinkyDungeonKeybindings.UpLeft, KinkyDungeonKeybindings.UpRight, KinkyDungeonKeybindings.DownLeft, KinkyDungeonKeybindings.DownRight]; // WASD
					KinkyDungeonGameKey.KEY_UP = (KinkyDungeonKeybindings.Up);
					KinkyDungeonGameKey.KEY_DOWN = (KinkyDungeonKeybindings.Down);
					KinkyDungeonGameKey.KEY_LEFT = (KinkyDungeonKeybindings.Left);
					KinkyDungeonGameKey.KEY_RIGHT = (KinkyDungeonKeybindings.Right);
					KinkyDungeonGameKey.KEY_UPLEFT = (KinkyDungeonKeybindings.UpLeft);
					KinkyDungeonGameKey.KEY_DOWNLEFT = (KinkyDungeonKeybindings.DownLeft);
					KinkyDungeonGameKey.KEY_UPRIGHT = (KinkyDungeonKeybindings.UpRight);
					KinkyDungeonGameKey.KEY_DOWNRIGHT = (KinkyDungeonKeybindings.DownRight);

					//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
					KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3, KinkyDungeonKeybindings.Spell4, KinkyDungeonKeybindings.Spell5]; // ! @ #
					KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
					KinkyDungeonKeySkip = [KinkyDungeonKeybindings.Skip]; // Space and 5 (53)

					KinkyDungeonGameKey.KEY_WAIT = (KinkyDungeonKeybindings.Wait);
					KinkyDungeonGameKey.KEY_SKIP = (KinkyDungeonKeybindings.Skip);
				}
			} else KinkyDungeonState = "Menu";
			localStorage.setItem("KinkyDungeonKeybindings", JSON.stringify(KinkyDungeonKeybindings));
			//ServerAccountUpdate.QueueData({ KinkyDungeonKeybindings: KinkyDungeonKeybindings });
			return true;
		}

		if (KinkyDungeonKeybindingCurrentKey) {
			if (MouseIn(1075, 350, 350, 64)) {
				KinkyDungeonKeybindingsTemp.Up = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1075, 550, 350, 64)) {
				KinkyDungeonKeybindingsTemp.Down = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(675, 450, 350, 64)) {
				KinkyDungeonKeybindingsTemp.Left = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1475, 450, 350, 64)) {
				KinkyDungeonKeybindingsTemp.Right = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(675, 350, 350, 64)) {
				KinkyDungeonKeybindingsTemp.UpLeft = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1475, 350, 350, 64)) {
				KinkyDungeonKeybindingsTemp.UpRight = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(675, 550, 350, 64)) {
				KinkyDungeonKeybindingsTemp.DownLeft = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1475, 550, 350, 64)) {
				KinkyDungeonKeybindingsTemp.DownRight = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1075, 450, 350, 64)) {
				KinkyDungeonKeybindingsTemp.Wait = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1050, 650, 400, 64)) {
				KinkyDungeonKeybindingsTemp.Skip = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(675, 200, 200, 64)) {
				KinkyDungeonKeybindingsTemp.Spell1 = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(900, 200, 200, 64)) {
				KinkyDungeonKeybindingsTemp.Spell2 = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1125, 200, 200, 64)) {
				KinkyDungeonKeybindingsTemp.Spell3 = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1350, 200, 200, 64)) {
				KinkyDungeonKeybindingsTemp.Spell4 = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
			if (MouseIn(1575, 200, 200, 64)) {
				KinkyDungeonKeybindingsTemp.Spell5 = KinkyDungeonKeybindingCurrentKey;
				return true;
			}
		}
	} else if (KinkyDungeonState == "End") {
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonState = "Game";
			let temp = [];
			for (let o of KinkyDungeonOrbsPlaced) {
				if (KDRandom() < 0.5) temp.push(o);
			}
			KinkyDungeonOrbsPlaced = temp;
			KinkyDungeonCachesPlaced = [];
			MiniGameKinkyDungeonLevel = 1;
			KinkyDungeonSetCheckPoint(0, true);
			KinkyDungeonCreateMap(KinkyDungeonMapParams[0], 1);
			KinkyDungeonNewGame += 1;
			return true;
		} if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Menu";
			return true;
		}
	}


	return false;
}

/**
 * Handles clicks during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonClick() {
	if (KinkyDungeonHandleClick()) {
		if (KinkyDungeonReplaceConfirm > 0) KinkyDungeonReplaceConfirm -= 1;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
	}
}

/**
 * Handles exit during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonExit() {
	CommonDynamicFunction(MiniGameReturnFunction + "()");

	if (CharacterAppearancePreviousEmoticon) {
		CharacterSetFacialExpression(Player, "Emoticon", CharacterAppearancePreviousEmoticon);
		CharacterAppearancePreviousEmoticon = "";
	}

	if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
		KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
		DialogSetReputation("Gaming", KinkyDungeonRep);
	}

	if (CurrentScreen == "ChatRoom" && KinkyDungeonState != "Menu" && KinkyDungeonState == "Lose") {
		let Dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "KinkyDungeonLevel", Text: String(MiniGameKinkyDungeonLevel)},
		];
		// @ts-ignore
		ChatRoomPublishCustomAction("KinkyDungeonLose", false, Dictionary);
	}
}




/**
 * Handles key presses during the mini game. (Both keyboard and mobile)
 * @returns {void} - Nothing
 */
function KinkyDungeonKeyDown() {
	if (KinkyDungeonState == "Game") {
		if (KinkyDungeonIsPlayer())
			KinkyDungeonGameKeyDown();
	}// else if (KinkyDungeonState == "Keybindings")
	//// @ts-ignore
	//KinkyDungeonKeybindingCurrentKey = KeyPress;

}


/**
 * Game keyboard input handler object: Handles keyboard inputs.
 * @constant
 * @type {object} - The game keyboard input handler object. Contains the functions and properties required to handle key press events.
 */
let KinkyDungeonGameKey = {
	keyPressed : [false, false, false, false, false, false, false, false, false],

	KEY_UP : 'KeyB',
	KEY_DOWN : 'KeyV',
	KEY_LEFT : 'KeyC',
	KEY_RIGHT : 'KeyX',
	KEY_UPLEFT : 'KeyC',
	KEY_UPRIGHT : 'KeyB',
	KEY_DOWNLEFT : 'KeyX',
	KEY_DOWNRIGHT : 'KeyV',
	KEY_WAIT : 'KeyV',
	KEY_SKIP : 'KeyEnter',

	load : function(){
		KinkyDungeonGameKey.keyPressed = [false, false, false, false, false, false, false, false, false];
		KinkyDungeonGameKey.addKeyListener();
	},

	addKeyListener : function () {
		window.addEventListener('keydown', KinkyDungeonGameKey.keyDownEvent);
		window.addEventListener('keyup', KinkyDungeonGameKey.keyUpEvent);
	},
	removeKeyListener : function () {
		window.removeEventListener('keydown', KinkyDungeonGameKey.keyDownEvent);
		window.removeEventListener('keyup', KinkyDungeonGameKey.keyUpEvent);
	},
	keyDownEvent : {
		handleEvent : function (event) {
			let code = event.code;
			KinkyDungeonKeybindingCurrentKey = code;
			switch(code){
				case KinkyDungeonGameKey.KEY_UP:
					if(!KinkyDungeonGameKey.keyPressed[0]){
						KinkyDungeonGameKey.keyPressed[0] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_DOWN:
					if(!KinkyDungeonGameKey.keyPressed[1]){
						KinkyDungeonGameKey.keyPressed[1] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_LEFT:
					if(!KinkyDungeonGameKey.keyPressed[2]){
						KinkyDungeonGameKey.keyPressed[2] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_RIGHT:
					if(!KinkyDungeonGameKey.keyPressed[3]){
						KinkyDungeonGameKey.keyPressed[3] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_UPLEFT:
					if(!KinkyDungeonGameKey.keyPressed[4]){
						KinkyDungeonGameKey.keyPressed[4] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_UPRIGHT:
					if(!KinkyDungeonGameKey.keyPressed[5]){
						KinkyDungeonGameKey.keyPressed[5] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_DOWNLEFT:
					if(!KinkyDungeonGameKey.keyPressed[6]){
						KinkyDungeonGameKey.keyPressed[6] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_DOWNRIGHT:
					if(!KinkyDungeonGameKey.keyPressed[7]){
						KinkyDungeonGameKey.keyPressed[7] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_WAIT:
					if(!KinkyDungeonGameKey.keyPressed[8]){
						KinkyDungeonGameKey.keyPressed[8] = true;
					}
					break;
				case KinkyDungeonGameKey.KEY_SKIP:
					if(!KinkyDungeonGameKey.keyPressed[9]){
						KinkyDungeonGameKey.keyPressed[9] = true;
					}
					break;
			}
		}
	},
	keyUpEvent : {
		handleEvent : function (event) {
			let code = event.code;
			switch(code){
				case KinkyDungeonGameKey.KEY_UP:
					if (KinkyDungeonGameKey.keyPressed[0]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[0] = false;
					break;
				case KinkyDungeonGameKey.KEY_DOWN:
					if (KinkyDungeonGameKey.keyPressed[1]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[1] = false;
					break;
				case KinkyDungeonGameKey.KEY_LEFT:
					if (KinkyDungeonGameKey.keyPressed[2]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[2] = false;
					break;
				case KinkyDungeonGameKey.KEY_RIGHT:
					if (KinkyDungeonGameKey.keyPressed[3]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[3] = false;
					break;
				case KinkyDungeonGameKey.KEY_UPLEFT:
					if (KinkyDungeonGameKey.keyPressed[4]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[4] = false;
					break;
				case KinkyDungeonGameKey.KEY_UPRIGHT:
					if (KinkyDungeonGameKey.keyPressed[5]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[5] = false;
					break;
				case KinkyDungeonGameKey.KEY_DOWNLEFT:
					if (KinkyDungeonGameKey.keyPressed[6]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[6] = false;
					break;
				case KinkyDungeonGameKey.KEY_DOWNRIGHT:
					if (KinkyDungeonGameKey.keyPressed[7]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[7] = false;
					break;
				case KinkyDungeonGameKey.KEY_WAIT:
					if (KinkyDungeonGameKey.keyPressed[8]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[8] = false;
					break;
				case KinkyDungeonGameKey.KEY_SKIP:
					if (KinkyDungeonGameKey.keyPressed[9]) KinkyDungeonLastMoveTimerStart = 0;
					KinkyDungeonGameKey.keyPressed[9] = false;
					break;
			}

		}
	},
};



/**
 * Outputs a savegame
 * @returns {KinkyDungeonSave} - Saved game object
 */
function KinkyDungeonGenerateSaveData() {
	let save = {};
	save.level = MiniGameKinkyDungeonLevel;
	save.checkpoint = MiniGameKinkyDungeonCheckpoint;
	save.rep = KinkyDungeonGoddessRep;
	save.costs = KinkyDungeonShrineCosts;
	save.pcosts = KinkyDungeonPenanceCosts;
	save.orbs = KinkyDungeonOrbsPlaced;
	save.chests = KinkyDungeonChestsOpened;
	save.dress = KinkyDungeonCurrentDress;
	save.gold = KinkyDungeonGold;
	save.points = KinkyDungeonSpellPoints;
	save.levels = KinkyDungeonSpellLevel;
	save.id = KinkyDungeonEnemyID;
	save.choices = KinkyDungeonSpellChoices;
	save.choices2 = KinkyDungeonSpellChoicesToggle;
	save.buffs = KinkyDungeonPlayerBuffs;
	save.lostitems = KinkyDungeonLostItems;
	save.caches = KinkyDungeonCachesPlaced;
	save.rescued = KinkyDungeonRescued;
	save.aid = KinkyDungeonAid;
	KDrandomizeSeed();
	save.seed = KinkyDungeonSeed;

	let spells = [];
	let newInv = [];

	for (let inv of KinkyDungeonInventory) {
		let item = {};
		Object.assign(item, inv);
		if (item.restraint) item.restraint = {name: item.restraint.name};
		if (item.looserestraint) item.looserestraint = {name: item.looserestraint.name};
		if (item.outfit) item.outfit = {name: item.outfit.name};
		if (item.weapon) item.weapon = {name: item.weapon.name};
		if (item.consumable) item.consumable = {name: item.consumable.name};
		newInv.push(item);
	}

	for (let spell of KinkyDungeonSpells) {
		spells.push(spell.name);
	}

	save.spells = spells;
	save.inventory = newInv;
	save.KDGameData = KDGameData;

	save.stats = {
		picks: KinkyDungeonLockpicks,
		keys: KinkyDungeonRedKeys,
		bkeys: KinkyDungeonBlueKeys,
		knife: KinkyDungeonNormalBlades,
		eknife: KinkyDungeonEnchantedBlades,
		mana: KinkyDungeonStatMana,
		stamina: KinkyDungeonStatStamina,
		arousal: KinkyDungeonStatArousal,
		wep: KinkyDungeonPlayerWeapon,
		npp: KinkyDungeonNewGame,
		diff: KinkyDungeonDifficultyMode,
	};
	return save;
}

function KinkyDungeonSaveGame(ToString) {
	let save = KinkyDungeonGenerateSaveData();

	let data = LZString.compressToBase64(JSON.stringify(save));
	if (!ToString) {
		//Player.KinkyDungeonSave = saveData.KinkyDungeonSave;
		//ServerAccountUpdate.QueueData(saveData);
		localStorage.setItem('KinkyDungeonSave', data);
	}
	return data;
}

// N4IgNgpgbhYgXARgDQgMYAsJoNYAcB7ASwDsAXBABlQCcI8FQBxDAgZwvgFoBWakAAo0ibAiQg0EvfgBkIAQzJZJ8fgFkIZeXFWoASgTwQqqAOpEwO/gFFIAWwjk2JkAGExAKwCudFwElLLzYiMSoAX1Q0djJneGAIkAIaACNYgG0AXUisDnSskAATOjZYkAARCAAzeS8wClQAcwIwApdCUhiEAGZUSBgwWNBbCAcnBBQ3Tx9jJFQAsCCQknGEtiNLPNRSGHIkgE8ENNAokjYvO3lkyEYQEnkHBEECMiW1eTuQBIBHL3eXsgOSAixzEZwuVxmoDuD3gTxeYgAylo7KR5J9UD8/kQAStkCDTudLtc4rd7jM4UsAGLCBpEVrfX7kbGAxDAkAAdwUhGWJOh5IA0iQiJVjGE2cUyDR5B0bnzHmUvGgyAAVeRGOQNZwJF4NDBkcQlca9Ai4R7o0ASqUy3lk+WKlVqiCUiCaNTnOwHbVEXX6iCG2bgE04M1hDJhIA=
function KinkyDungeonLoadGame(String) {
	let str = String ? LZString.decompressFromBase64(String) : (localStorage.getItem('KinkyDungeonSave') ? LZString.decompressFromBase64(localStorage.getItem('KinkyDungeonSave')) : "");
	if (str) {
		let saveData = JSON.parse(str);
		if (saveData
			&& saveData.spells != undefined
			&& saveData.level != undefined
			&& saveData.checkpoint != undefined
			&& saveData.inventory != undefined
			&& saveData.costs != undefined
			&& saveData.rep != undefined
			&& saveData.orbs != undefined
			&& saveData.chests != undefined
			&& saveData.dress != undefined) {
			MiniGameKinkyDungeonLevel = saveData.level;
			MiniGameKinkyDungeonCheckpoint = saveData.checkpoint;
			KinkyDungeonShrineCosts = saveData.costs;
			KinkyDungeonGoddessRep = saveData.rep;
			KinkyDungeonOrbsPlaced = saveData.orbs;
			if (saveData.caches != undefined) KinkyDungeonCachesPlaced = saveData.caches;
			KinkyDungeonChestsOpened = saveData.chests;
			KinkyDungeonCurrentDress = saveData.dress;
			KDGameData.KinkyDungeonSpawnJailers = 0;
			KDGameData.KinkyDungeonSpawnJailersMax = 0;
			if (saveData.seed) KDsetSeed(saveData.seed);
			if (saveData.pcosts) KinkyDungeonPenanceCosts = saveData.pcosts;
			if (saveData.choices) KinkyDungeonSpellChoices = saveData.choices;
			if (saveData.choices2) KinkyDungeonSpellChoicesToggle = saveData.choices2;
			if (saveData.buffs) KinkyDungeonPlayerBuffs = saveData.buffs;
			if (saveData.gold != undefined) KinkyDungeonGold = saveData.gold;
			if (saveData.id != undefined) KinkyDungeonEnemyID = saveData.id;
			if (saveData.points != undefined) KinkyDungeonSpellPoints = saveData.points;
			if (saveData.levels != undefined) KinkyDungeonSpellLevel = saveData.levels;
			if (saveData.lostitems != undefined) KinkyDungeonLostItems = saveData.lostitems;
			if (saveData.rescued != undefined) KinkyDungeonRescued = saveData.rescued;
			if (saveData.aid != undefined) KinkyDungeonAid = saveData.aid;
			if (saveData.stats) {
				if (saveData.stats.picks != undefined) KinkyDungeonLockpicks = saveData.stats.picks;
				if (saveData.stats.keys != undefined) KinkyDungeonRedKeys = saveData.stats.keys;
				if (saveData.stats.bkeys != undefined) KinkyDungeonBlueKeys = saveData.stats.bkeys;
				if (saveData.stats.knife != undefined) KinkyDungeonNormalBlades = saveData.stats.knife;
				if (saveData.stats.eknife != undefined) KinkyDungeonEnchantedBlades = saveData.stats.eknife;
				if (saveData.stats.mana != undefined) KinkyDungeonStatMana = saveData.stats.mana;
				if (saveData.stats.stamina != undefined) KinkyDungeonStatStamina = saveData.stats.stamina;
				if (saveData.stats.arousal != undefined) KinkyDungeonStatArousal = saveData.stats.arousal;
				if (saveData.stats.wep != undefined) KinkyDungeonPlayerWeapon = saveData.stats.wep;
				if (saveData.stats.npp != undefined) KinkyDungeonNewGame = saveData.stats.npp;
				if (saveData.stats.diff != undefined) KinkyDungeonDifficultyMode = saveData.stats.diff;


				KDOrigStamina = KinkyDungeonStatStamina;
				KDOrigMana = KinkyDungeonStatMana;
				KDOrigArousal = KinkyDungeonStatArousal;
			}
			if (saveData.KDGameData != undefined) KDGameData = saveData.KDGameData;

			KinkyDungeonInventory = [];
			for (let item of saveData.inventory) {
				if (item.restraint) {
					let restraint = KinkyDungeonGetRestraintByName(item.restraint.name);
					if (restraint) {
						KinkyDungeonAddRestraint(restraint, 0, true, item.lock); // Add the item
						let createdrestraint = KinkyDungeonGetRestraintItem(restraint.Group);
						if (createdrestraint)
							createdrestraint.lock = item.lock; // Lock if applicable
					}
				}
			}
			Object.assign(KinkyDungeonInventory, saveData.inventory);
			for (let item of KinkyDungeonInventory) {
				if (item.restraint) item.restraint = KinkyDungeonGetRestraintByName(item.restraint.name);
				if (item.looserestraint) item.looserestraint = KinkyDungeonGetRestraintByName(item.looserestraint.name);
				if (item.outfit) item.outfit = KinkyDungeonGetOutfit(item.outfit.name);
				if (item.consumable) item.consumable = KinkyDungeonFindConsumable(item.consumable.name);
				if (item.weapon) item.weapon = KinkyDungeonFindWeapon(item.weapon.name);
			}

			KinkyDungeonSpells = [];
			for (let spell of saveData.spells) {
				let sp = KinkyDungeonFindSpell(spell);
				if (sp) KinkyDungeonSpells.push(sp);
			}

			KinkyDungeonSetMaxStats();
			KinkyDungeonCheckClothesLoss = true;
			KinkyDungeonDressPlayer();

			if (String)
				localStorage.setItem('KinkyDungeonSave', String);
			return true;
		}
	}
	return false;
}

let KinkyDungeonSeed = (Math.random() * 4294967296).toString();
let KDRandom = sfc32(xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)());

function KDrandomizeSeed() {
	KinkyDungeonSeed = (Math.random() * 4294967296).toString();
	for (let i = 0; i < 20; i++) {
		let index = Math.random() * KinkyDungeonSeed.length;
		KinkyDungeonSeed = KinkyDungeonSeed.replaceAt(index, String.fromCharCode(65 + Math.floor(Math.random()*50)) + String.fromCharCode(65 + Math.floor(Math.random()*50)));
	}
	KDRandom = sfc32(xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)());
	for (let i = 0; i < 1000; i++) {
		KDRandom();
	}
}

function KDsetSeed(string) {
	KinkyDungeonSeed = string;
	KDRandom = sfc32(xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)());
	for (let i = 0; i < 1000; i++) {
		KDRandom();
	}
}

function xmur3(str) {
	for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
		h = h << 13 | h >>> 19;
	} return function() {
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
}

function sfc32(a, b, c, d) {
	return function() {
		a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
		var t = (a + b) | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		d = d + 1 | 0;
		t = t + d | 0;
		c = c + t | 0;
		return (t >>> 0) / 4294967296;
	};
}