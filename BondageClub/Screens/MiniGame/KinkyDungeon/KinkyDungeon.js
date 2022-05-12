"use strict";
let KDDebugMode = false;
let KDDebug = false;
let KDDebugPerks = false;
let KDDebugGold = false;

let KinkyDungeonPerksConfig = "1";

let KinkyDungeonBackground = "BrickWall";
/**
 * @type {Character}
 */
let KinkyDungeonPlayer = null;
let KinkyDungeonState = "Consent";

let KinkyDungeonRep = 0; // Variable to store max level to avoid losing it if the server doesnt take the rep update

let KinkyDungeonKeybindings = null;
let KinkyDungeonKeybindingsTemp = null;
let KinkyDungeonKeybindingCurrentKey = 0;

let KinkyDungeonNewGame = 0;
let KinkyDungeonDifficultyMode = 0;

let KinkyDungeonGameRunning = false;

//let KinkyDungeonKeyLower = [87+32, 65+32, 83+32, 68+32, 81+32, 45+32, 90+32, 43+32]; // WASD
let KinkyDungeonKey = [119, 97, 115, 100, 113, 101, 122, 99]; // WASD
//let KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
let KinkyDungeonKeySpell = [49, 50, 51, 52, 53]; // 1 2 3
let KinkyDungeonKeyWait = [120]; // x
let KinkyDungeonKeySkip = [13]; // Enter
let KinkyDungeonKeyWeapon = [54]; // Enter

let KinkyDungeonRootDirectory = "Screens/MiniGame/KinkyDungeon/";
let KinkyDungeonPlayerCharacter = null; // Other player object
let KinkyDungeonGameData = null; // Data sent by other player
let KinkyDungeonGameDataNullTimer = 4000; // If data is null, we query this often
let KinkyDungeonGameDataNullTimerTime = 0;
let KinkyDungeonStreamingPlayers = []; // List of players to stream to

let KinkyDungeonInitTime = 0;

let KinkyDungeonSleepTime = 0;
let KinkyDungeonFreezeTime = 1000;
let KinkyDungeonAutoWait = false;

let KinkyDungeonConfigAppearance = false;

const Consumable = "consumable";
const Restraint = "restraint";
const LooseRestraint = "looserestraint";
const Outfit = "outfit";
const Accessory = "accessory";
const Weapon = "weapon";
const Misc = "misc";

let KinkyDungeonStatsChoice = new Map();

let KDJourney = "";

let KDOptOut = false;

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
* Champion: string,
* ChampionCurrent: number,
* JailPoints: {x: number, y: number}[],
* LastMapSeed: string,
* AlreadyOpened: {x: number, y:number}[],
* Journey: string,
* CheckpointIndices: number[],
* PrisonerState: string,
* TimesJailed: number,
* JailTurns: number,
* JailKey: boolean,
* CurrentDialog: string,
* CurrentDialogStage: string,
* OrgasmNextStageTimer: number,
* ConfirmAttack: boolean,
* CurrentDialogMsg: string,
* CurrentDialogMsgSpeaker: string,
* CurrentDialogMsgPersonality: string,
* CurrentDialogMsgID: number,
* CurrentDialogMsgData: Record<string, string>,
* CurrentDialogMsgValue: Record<string, number>,
* AlertTimer: number,
* RespawnQueue: {enemy: string, faction: string}[],
* HeartTaken: boolean,
* CurrentVibration: KinkyVibration,
* Edged: boolean,
* TimeSinceLastVibeStart: number,
* TimeSinceLastVibeEnd: number,
*}} KDGameDataBase
*/
let KDGameDataBase = {
	AlertTimer: 0,
	OrgasmNextStageTimer: 0,

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
	KinkyDungeonGuardSpawnTimerMax: 40,
	KinkyDungeonGuardSpawnTimerMin: 25,
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

	Champion: "",
	ChampionCurrent: 0,

	JailPoints: [],

	WarningLevel: 0,
	LastMapSeed: "",

	AlreadyOpened: [],
	Journey: "",
	CheckpointIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],

	// "" = not a prisoner
	// "jail" = must remain in cell
	// "parole" = can roam but not allowed to take most actions
	PrisonerState: "",
	TimesJailed: 0,
	JailTurns: 0,
	JailKey: true,

	CurrentDialog: "",
	CurrentDialogStage: "",
	CurrentDialogMsg: "",
	CurrentDialogMsgSpeaker: "",
	CurrentDialogMsgPersonality: "",
	CurrentDialogMsgData: {},
	CurrentDialogMsgValue: {},
	CurrentDialogMsgID: -1,

	ConfirmAttack: false,
	RespawnQueue: [],
	HeartTaken: false,

	CurrentVibration: null,
	Edged: false,
	TimeSinceLastVibeStart: 0,
	TimeSinceLastVibeEnd: 0,
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

/**
 *
 * @param list
 * @return {Map<any, any>}
 */
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
	KDCategories = [
		{name: "Restraints", buffs: [], debuffs: [],},
		{name: "Kinky", buffs: [], debuffs: [],},
		{name: "Combat", buffs: [], debuffs: [],},
		{name: "Magic", buffs: [], debuffs: [],},
		{name: "Enemies", buffs: [], debuffs: [],},
		{name: "Map", buffs: [], debuffs: [],},
	];

	for (let stat of Object.entries(KinkyDungeonStatsPresets)) {
		for (let c of KDCategories) {
			if (stat[1].category == c.name) {
				if (stat[1].cost < 0)
					c.debuffs.push(stat);
				else
					c.buffs.push(stat);
			}
		}
	}

	CurrentDarkFactor = 0;

	KinkyDungeonInitTime = CommonTime();
	KinkyDungeonGameKey.load();

	if (!KinkyDungeonIsPlayer()) KinkyDungeonGameRunning = false;
	// @ts-ignore
	if (ServerURL != 'foobar' && KinkyDungeonState == 'Consent') KinkyDungeonState = "Menu";
	//if (!Player.KinkyDungeonSave) Player.KinkyDungeonSave = {};

	if (!KinkyDungeonGameRunning) {
		if (!KinkyDungeonPlayer) { // new game
			KDrandomizeSeed(false);
			KinkyDungeonPlayer = CharacterLoadNPC("NPC_Avatar");
			KinkyDungeonPlayer.Type = "simple";
			// @ts-ignore
			KinkyDungeonPlayer.OnlineSharedSettings = {BlockBodyCosplay: true, };
			KinkyDungeonSound = localStorage.getItem("KinkyDungeonSound") != undefined ? localStorage.getItem("KinkyDungeonSound") == "True" : true;
			KinkyDungeonFullscreen = localStorage.getItem("KinkyDungeonFullscreen") != undefined ? localStorage.getItem("KinkyDungeonFullscreen") == "True" : true;
			KinkyDungeonDrool = localStorage.getItem("KinkyDungeonDrool") != undefined ? localStorage.getItem("KinkyDungeonDrool") == "True" : true;

			KinkyDungeonSexyMode = localStorage.getItem("KinkyDungeonSexyMode") != undefined ? localStorage.getItem("KinkyDungeonSexyMode") == "True" : true;
			KinkyDungeonSexyPiercing = localStorage.getItem("KinkyDungeonSexyPiercing") != undefined ? localStorage.getItem("KinkyDungeonSexyPiercing") == "True" : false;
			KinkyDungeonSexyPlug = localStorage.getItem("KinkyDungeonSexyPlug") != undefined ? localStorage.getItem("KinkyDungeonSexyPlug") == "True" : false;

			KinkyDungeonNewDress = true;
			let appearance = LZString.decompressFromBase64(localStorage.getItem("kinkydungeonappearance"));
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
			KDInitProtectedGroups();
		}

		if (localStorage.getItem("KinkyDungeonKeybindings") && JSON.parse(localStorage.getItem("KinkyDungeonKeybindings"))) {
			KinkyDungeonKeybindings = JSON.parse(localStorage.getItem("KinkyDungeonKeybindings"));
			KinkyDungeonKeybindingsTemp = {};
			Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			console.log(KinkyDungeonKeybindings);
		}
		else console.log("Failed to load keybindings");

		if (KinkyDungeonIsPlayer()) {
			if (ServerURL != 'foobar' && KinkyDungeonState == "Consent")
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

		for (const group of KinkyDungeonStruggleGroupsBase) {
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
let KinkyDungeonFullscreen = true;
let KinkyDungeonDrool = true;
let KinkyDungeonGraphicsQuality = true;
let KinkyDungeonFastWait = true;
let KinkyDungeonSexyMode = false;
let KinkyDungeonSexyPiercing = false;
let KinkyDungeonSexyPlug = false;
let KDOldValue = "";
let KDOriginalValue = "";

function KinkyDungeonRun() {
	let BG = "BrickWall";
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	if (params && params.background) BG = params.background;
	if (KinkyDungeonState == "Lose") BG = "Pandora/Underground/Cell4";
	DrawImage("Backgrounds/" + BG + ".jpg", 0, 0);

	if (KinkyDungeonFullscreen) {
		KinkyDungeonGridWidthDisplay = 2000/KinkyDungeonGridSizeDisplay;//17;
		KinkyDungeonGridHeightDisplay = 1000/KinkyDungeonGridSizeDisplay;//9;
		canvasOffsetX = 0;
		canvasOffsetY = 0;
		KinkyDungeonCanvas.width = 2000;
		KinkyDungeonCanvas.height = 1000;
	} else {
		KinkyDungeonGridWidthDisplay = 16;
		KinkyDungeonGridHeightDisplay = 9;
		canvasOffsetX = canvasOffsetX_ui;
		canvasOffsetY = canvasOffsetY_ui;
		KinkyDungeonCanvas.width = KinkyDungeonGridSizeDisplay * KinkyDungeonGridWidthDisplay;
		KinkyDungeonCanvas.height = KinkyDungeonGridSizeDisplay * KinkyDungeonGridHeightDisplay;
	}

	// Draw the characters
	if (KinkyDungeonState != "Game" || KinkyDungeonDrawState != "Game")
		DrawCharacter(KinkyDungeonPlayer, 0, 0, 1);

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
		DrawButton(1730, 930, 110, 64, TextGet("KinkyDungeonNext"), "White", "");
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

		DrawButton(25, 930, 325, 64, TextGet("KinkyDungeonDressPlayer"), "White", "");
		DrawButton(360, 930, 220, 64, TextGet((KinkyDungeonReplaceConfirm > 0 ) ? "KinkyDungeonConfirm" : "KinkyDungeonDressPlayerReset"), "White", "");
		DrawButton(590, 930, 150, 64, TextGet("KinkyDungeonDressPlayerImport"), "White", "");
		DrawButton(1870, 930, 110, 64, TextGet("KinkyDungeonCredits"), "White", "");
		DrawButton(1700, 930, 150, 64, TextGet("KinkyDungeonPatrons"), "White", "");
		DrawButton(850, 930, 375, 64, TextGet("KinkyDungeonDeviantart"), "White", "");
		DrawButton(1275, 930, 375, 64, TextGet("KinkyDungeonPatreon"), "#ffeecc", "");
	} else if (KinkyDungeonState == "Consent") {
		MainCanvas.textAlign = "center";
		// Draw temp start screen
		DrawText(TextGet("KinkyDungeonConsent"), 1250, 300, "white", "silver");
		DrawText(TextGet("KinkyDungeonConsent2"), 1250, 400, "white", "silver");
		DrawText(TextGet("KinkyDungeonConsent3"), 1250, 500, "white", "silver");
		DrawButton(975, 720, 450, 64, TextGet("KDOptIn"), "White", "");
		DrawButton(975, 820, 450, 64, TextGet("KDOptOut"), "White", "");
	} else if (KinkyDungeonState == "Load") {
		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonLoadConfirm"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");

		ElementPosition("saveInputField", 1250, 550, 1000, 230);
	} else if (KinkyDungeonState == "LoadOutfit") {
		DrawButton(875, 750, 350, 64, TextGet("LoadOutfit"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");

		let newValue = ElementValue("saveInputField");
		if (newValue != KDOldValue) {
			CharacterAppearanceRestore(KinkyDungeonPlayer, LZString.decompressFromBase64(ElementValue("saveInputField")));
			CharacterRefresh(KinkyDungeonPlayer);
			KDOldValue = newValue;
			KDInitProtectedGroups();
		}

		ElementPosition("saveInputField", 1250, 550, 1000, 230);
	} else if (KinkyDungeonState == "Journey") {
		DrawText(TextGet("KinkyDungeonJourney"), 1250, 300, "white", "silver");
		DrawButton(875, 350, 750, 64, TextGet("KinkyDungeonJourney0"), "White", "");
		DrawButton(875, 450, 750, 64, TextGet("KinkyDungeonJourney1"), "White", "");
		DrawButton(875, 550, 750, 64, TextGet("KinkyDungeonJourney2"), "White", "");
		DrawButton(1075, 850, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");

	} else if (KinkyDungeonState == "Diff") {
		DrawText(TextGet("KinkyDungeonDifficulty"), 1250, 300, "white", "silver");
		DrawButton(875, 350, 750, 64, TextGet("KinkyDungeonDifficulty0"), "White", "");
		DrawButton(875, 450, 750, 64, TextGet("KinkyDungeonDifficulty3"), "White", "");
		DrawButton(875, 550, 750, 64, TextGet("KinkyDungeonDifficulty1"), "White", "");
		DrawButton(875, 650, 750, 64, TextGet("KinkyDungeonDifficulty2"), "White", "");
		DrawButton(1075, 850, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");

		DrawButton(875, 150, 275, 64, TextGet("KinkyDungeonSexyMode0"), !KinkyDungeonSexyMode ? "White" : "#888888", "");
		if (MouseIn(875, 150, 275, 64)) {
			DrawTextFit(TextGet("KinkyDungeonSexyModeDesc0"), 1250, 80, 1000, "white", "black");
		}
		DrawButton(1175, 150, 275, 64, TextGet("KinkyDungeonSexyMode1"), KinkyDungeonSexyMode ? "White" : "#888888", "");
		if (MouseIn(1175, 150, 275, 64)) {
			DrawTextFit(TextGet("KinkyDungeonSexyModeDesc1"), 1250, 80, 1000, "white", "black");
		}

		if (KinkyDungeonSexyMode) {
			MainCanvas.textAlign = "left";
			DrawCheckbox(1500, 120, 64, 64, TextGet("KinkyDungeonSexyPlugs"), KinkyDungeonSexyPlug, false, "white");
			DrawCheckbox(1500, 200, 64, 64, TextGet("KinkyDungeonSexyPiercings"), KinkyDungeonSexyPiercing, false, "white");
			MainCanvas.textAlign = "center";
		}


	} else if (KinkyDungeonState == "Stats") {
		let tooltip = KinkyDungeonDrawPerks(false);
		DrawText(TextGet("KinkyDungeonStats"), 1250, 100, "white", "silver");
		if (!tooltip)
			DrawText(TextGet("KinkyDungeonStatPoints").replace("AMOUNT", "" + KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice)), 1250, 150, "white", "silver");
		DrawButton(875, 920, 350, 64, TextGet("KinkyDungeonStartGame"), KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice) >= 0 ? "White" : "pink", "");
		DrawButton(1275, 920, 350, 64, TextGet("KinkyDungeonLoadBack"), "White", "");
		DrawButton(100, 920, 190, 64, TextGet("KinkyDungeonClearAll"), "White", "");
		DrawButton(330, 930, 140, 54, TextGet("KinkyDungeonConfig") + "1", KinkyDungeonPerksConfig == "1" ? "White" : "#888888", "");
		DrawButton(480, 930, 140, 54, TextGet("KinkyDungeonConfig") + "2", KinkyDungeonPerksConfig == "2" ? "White" : "#888888", "");
		DrawButton(630, 930, 140, 54, TextGet("KinkyDungeonConfig") + "3", KinkyDungeonPerksConfig == "3" ? "White" : "#888888", "");
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
		DrawButton(25, 930, 325, 64, TextGet("KinkyDungeonDressPlayer"), "White", "");
		DrawButton(360, 930, 220, 64, TextGet((KinkyDungeonReplaceConfirm > 0 ) ? "KinkyDungeonConfirm" : "KinkyDungeonDressPlayerReset"), "White", "");
		DrawButton(590, 930, 150, 64, TextGet("KinkyDungeonDressPlayerImport"), "White", "");
	} else if (KinkyDungeonState == "Game") {
		KinkyDungeonGameRunning = true;
		KinkyDungeonGameFlag = true;
		KinkyDungeonDrawGame();
		if (KinkyDungeonInputQueue.length < 1) {
			if (KDGameData.SleepTurns > 0) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					KDGameData.SleepTurns -= 1;
					if (KinkyDungeonAggressive())
						KinkyDungeonTotalSleepTurns += 1;
					if (KinkyDungeonStatStamina >= KinkyDungeonStatStaminaMax)  {
						KDGameData.SleepTurns = 0;
						if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && KinkyDungeonPlayer.IsKneeling()) {
							CharacterSetActivePose(KinkyDungeonPlayer, "BaseLower", false);
						}
					}
					KDSendInput("tick", {delta: 1});
					KinkyDungeonSleepTime = CommonTime() + 10;
				}
				if (KDGameData.SleepTurns == 0) {
					KinkyDungeonChangeStamina(0);
				}
			} else if (KDGameData.PlaySelfTurns > 0) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					KDSendInput("tick", {delta: 1});
					KDGameData.PlaySelfTurns -= 1;
					KinkyDungeonSleepTime = CommonTime() + 230;
				}
				if (KDGameData.SleepTurns == 0) {
					KinkyDungeonChangeStamina(0);
				}
			} else if (KinkyDungeonStatFreeze > 0) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					KinkyDungeonStatFreeze -= 1;
					KDSendInput("tick", {delta: 1, NoUpdate: false, NoMsgTick: true});
					KinkyDungeonSleepTime = CommonTime() + KinkyDungeonFreezeTime;
				}
			} else if (KinkyDungeonSlowMoveTurns > 0) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					KinkyDungeonSlowMoveTurns -= 1;
					KDSendInput("tick", {delta: 1, NoUpdate: false, NoMsgTick: true});
					KinkyDungeonSleepTime = CommonTime() + 200;
				}
			} else if (KinkyDungeonFastMove && KinkyDungeonFastMovePath && KinkyDungeonFastMovePath.length > 0) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					if (KinkyDungeonFastMovePath.length > 0) {
						let next = KinkyDungeonFastMovePath[0];
						KinkyDungeonFastMovePath.splice(0, 1);
						if (Math.max(Math.abs(next.x-KinkyDungeonPlayerEntity.x), Math.abs(next.y-KinkyDungeonPlayerEntity.y)) < 1.5)
							KDSendInput("move", {dir: {x:next.x-KinkyDungeonPlayerEntity.x, y:next.y-KinkyDungeonPlayerEntity.y}, delta: 1, AllowInteract: true, AutoDoor: KinkyDungeonToggleAutoDoor});
						else KinkyDungeonFastMovePath = [];
					}
					KinkyDungeonSleepTime = CommonTime() + 100;
				}
			} else if (KinkyDungeonFastStruggle && KinkyDungeonFastStruggleType && KinkyDungeonFastStruggleGroup) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					let result = KDSendInput("struggle", {group: KinkyDungeonFastStruggleGroup, type: KinkyDungeonFastStruggleType});
					if (result != "Fail" || !KinkyDungeonHasStamina(1.1)) {
						KinkyDungeonFastStruggleType = "";
						KinkyDungeonFastStruggleGroup = "";
					}
					KinkyDungeonSleepTime = CommonTime() + 250;
				}
			} else if (KinkyDungeonAutoWait) {
				if (CommonTime() > KinkyDungeonSleepTime) {
					KDSendInput("move", {dir: {x:0, y: 0, delta: 0}, delta: 1, AllowInteract: true, AutoDoor: KinkyDungeonToggleAutoDoor});
					KinkyDungeonSleepTime = CommonTime() + (KinkyDungeonFastWait ? 100 : 300);
				}
			} else KinkyDungeonSleepTime = CommonTime() + 100;
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

		DrawButton(1075, 100, 300, 64, TextGet("KinkyDungeonKeySpellWeapon") + ": '" + (KinkyDungeonKeybindingsTemp.SpellWeapon) + "'", "White", "");

		if (KinkyDungeonKeybindingCurrentKey)
			DrawText(TextGet("KinkyDungeonCurrentPress") + ": '" + (KinkyDungeonKeybindingCurrentKey) + "'", 1250, 900, "white", "silver");

		DrawText(TextGet("KinkyDungeonCurrentPressInfo"), 1250, 950, "white", "silver");
	}

}

function KinkyDungeonGetTraitsCount() {
	return Array.from(KinkyDungeonStatsChoice.keys()).filter((element) => {return !element.includes('arousalMode');}).length;
}

function KDSendTrait(trait) {
	// @ts-ignore
	if (window.dataLayer)
		// @ts-ignore
		window.dataLayer.push({
			'event':'trait',
			'traitType':trait,
			'journey':KDJourney,
		});
}

function KDSendSpell(spell) {
	// @ts-ignore
	if (window.dataLayer)
		// @ts-ignore
		window.dataLayer.push({
			'event':'spell',
			'spellType':spell,
			'currentLevel':MiniGameKinkyDungeonLevel,
			'currentCheckpoint':MiniGameKinkyDungeonCheckpoint,
			'journey':KDJourney,
		});
}

function KDSendSpellCast(spell) {
	// @ts-ignore
	if (window.dataLayer)
		// @ts-ignore
		window.dataLayer.push({
			'event':'spellCast',
			'spellType':spell,
			'currentLevel':MiniGameKinkyDungeonLevel,
			'currentCheckpoint':MiniGameKinkyDungeonCheckpoint,
			'journey':KDJourney,
		});
}
function KDSendWeapon(weapon) {
	// @ts-ignore
	if (window.dataLayer)
		// @ts-ignore
		window.dataLayer.push({
			'event':'weapon',
			'weapon':weapon,
			'currentLevel':MiniGameKinkyDungeonLevel,
			'currentCheckpoint':MiniGameKinkyDungeonCheckpoint,
			'journey':KDJourney,
		});
}

function KDSendStatus(type, data, data2) {
	// @ts-ignore
	if (window.dataLayer && !KDOptOut) {
		// @ts-ignore
		window.dataLayer.push({
			'event':'gameStatus',
			'currentLevel':MiniGameKinkyDungeonLevel,
			'currentCheckpoint':MiniGameKinkyDungeonCheckpoint,
			'difficulty':KinkyDungeonDifficultyMode,
			'newgameplus':KinkyDungeonNewGame,
			'statusType':type,
			'aroused':KinkyDungeonStatsChoice.get("arousalMode") ? 'yes' : 'no',
			'traitscount':KinkyDungeonGetTraitsCount(),
			'gold':Math.round(KinkyDungeonGold / 100) * 100,
			'spellType': type == 'learnspell' ? data : undefined,
			'goddess': type == 'goddess' ? data : undefined,
			'helpType': type == 'goddess' ? data2 : undefined,
			'restraint': (type == 'escape' || type == 'bound') ? data : undefined,
			'method': type == 'escape' ? data2 : undefined,
			'attacker': type == 'bound' ? data2 : undefined,
			'prisonerstate': KDGameData.PrisonerState,
		});
		if (type == 'nextLevel' && KinkyDungeonDifficultyMode < 2) {
			for (let s of KinkyDungeonSpells) {
				KDSendSpell(s.name);
			}
			KDSendWeapon((KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name) ? KinkyDungeonPlayerDamage.name : 'unarmed');
		}
	}
}
function KDSendEvent(type) {
	// @ts-ignore
	if (window.dataLayer && !KDOptOut)
		if (type == 'newGame') {
		// @ts-ignore
			window.dataLayer.push({
				'event':type,
				'aroused':KinkyDungeonStatsChoice.get("arousalMode") ? 'yes' : 'no',
				'traitscount':KinkyDungeonGetTraitsCount(),
				'journey':KDJourney,
			});
			for (let s of KinkyDungeonStatsChoice.keys()) {
				KDSendTrait(s);
			}
		} else if (type == 'jail') {
			// @ts-ignore
			window.dataLayer.push({
				'event':type,
				'currentLevel':MiniGameKinkyDungeonLevel,
				'alreadyInJail':KinkyDungeonInJail() ? 'true' : 'false',
				'currentCheckpoint':MiniGameKinkyDungeonCheckpoint,
				'difficulty':KinkyDungeonDifficultyMode,
				'newgameplus':KinkyDungeonNewGame,
				'aroused':KinkyDungeonStatsChoice.get("arousalMode") ? 'yes' : 'no',
				'traitscount':KinkyDungeonGetTraitsCount(),
				'gold':Math.round(KinkyDungeonGold / 100) * 100,
				'journey':KDJourney,
			});
		} else if (type == 'loadGame') {
			// @ts-ignore
			window.dataLayer.push({
				'event':type,
				'currentLevel':MiniGameKinkyDungeonLevel,
				'currentCheckpoint':MiniGameKinkyDungeonCheckpoint,
				'difficulty':KinkyDungeonDifficultyMode,
				'newgameplus':KinkyDungeonNewGame,
				'aroused':KinkyDungeonStatsChoice.get("arousalMode") ? 'yes' : 'no',
				'traitscount':KinkyDungeonGetTraitsCount(),
				'gold':Math.round(KinkyDungeonGold / 100) * 100,
				'journey':KDJourney,
			});
		} else if (type == 'patreon') {
			// @ts-ignore
			window.dataLayer.push({
				'event':type,
			});
		} else if (type == 'optout' || type == 'optin') {
			// @ts-ignore
			window.dataLayer.push({
				'event':type,
			});
		}
}

function KinkyDungeonLoadStats() {
	KinkyDungeonStatsChoice = new Map();
	let statsChoice = localStorage.getItem('KinkyDungeonStatsChoice' + KinkyDungeonPerksConfig);
	if (statsChoice) {
		let statsArray = JSON.parse(statsChoice);
		if (statsArray) {
			for (let s of statsArray) {
				if (!s.includes('arousalMode') && KinkyDungeonStatsPresets[s])
					KinkyDungeonStatsChoice.set(s, true);
			}
		}
	}
}

let KinkyDungeonReplaceConfirm = 0;
let KinkyDungeonGameFlag = false;

function KDInitializeJourney(Journey) {
	KinkyDungeonMapIndex = [];

	for (let I = 0; I < KinkyDungeonMapParams.length; I++) {
		let II = I;
		if (II > 3 && II < 11) II = Math.floor(4*KDRandom());
		else if (II > 13) II = 11 + Math.floor(2*KDRandom());
		KinkyDungeonMapIndex.push(II);
	}

	if (Journey)
		KDGameData.Journey = Journey;
	// Option to shuffle the dungeon types besides the initial one (graveyard)
	if (KDGameData.Journey == "Random") {
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (let i = KinkyDungeonMapIndex.length - 1; i >= 0; i--) {
			let j = Math.floor(KDRandom() * (i + 1));
			let temp = KinkyDungeonMapIndex[i];
			KinkyDungeonMapIndex[i] = KinkyDungeonMapIndex[j];
			KinkyDungeonMapIndex[j] = temp;
		}
	} else if (KDGameData.Journey == "Harder") {
		KinkyDungeonMapIndex = [11, 12, 13, 3, 15, 16, 17, 18, 19, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	}
	//KinkyDungeonMapIndex.unshift(0);
	KinkyDungeonMapIndex.push(10);
}

function KinkyDungeonStartNewGame(Load) {
	KinkyDungeonNewGame = 0;
	KinkyDungeonInitialize(1, Load);
	MiniGameKinkyDungeonCheckpoint = 0;
	if (Load) {
		KinkyDungeonLoadGame();
		KDSendEvent('loadGame');
	} else {
		KDSendEvent('newGame');
		KDInitializeJourney(KDJourney);
	}
	KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel, false, Load);
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

		//let KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
		KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3, KinkyDungeonKeybindings.Spell4, KinkyDungeonKeybindings.Spell5]; // ! @ #
		KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
		KinkyDungeonKeySkip = [KinkyDungeonKeybindings.Skip]; // Space and 5 (53)
		KinkyDungeonKeyWeapon = [KinkyDungeonKeybindings.SpellWeapon]; // 6 (54)

		KinkyDungeonGameKey.KEY_WAIT = (KinkyDungeonKeybindings.Wait);
		KinkyDungeonGameKey.KEY_SKIP = (KinkyDungeonKeybindings.Skip);
	}
	if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/StoneDoor_Close.ogg");
}

function KinkyDungeonHandleClick() {
	if (MouseIn(1885, 25, 90, 90) && (ServerURL != "foobar" && KinkyDungeonDrawState == "Game" && KinkyDungeonState == "Game")) {
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
		if (MouseIn(1730, 930, 110, 64)) {
			if (KinkyDungeonCreditsPos < 1) KinkyDungeonCreditsPos += 1;
			else KinkyDungeonCreditsPos = 0;
		}
	} else if (KinkyDungeonState == "Journey") {
		if (MouseIn(875, 350, 750, 64)) {
			KDJourney = "";
			KinkyDungeonState = "Stats";
			return true;
		} else if (MouseIn(875, 450, 750, 64)) {
			KDJourney = "Random";
			KinkyDungeonState = "Stats";
			return true;
		} else if (MouseIn(875, 550, 750, 64)) {
			KDJourney = "Harder";
			KinkyDungeonState = "Stats";
			return true;
		} else if (MouseIn(1075, 850, 350, 64)) {
			KinkyDungeonState = "Menu";
			return true;
		}
	} else if (KinkyDungeonState == "Diff") {
		if (MouseIn(875, 150, 275, 64)) {
			KinkyDungeonSexyMode = false;
			localStorage.setItem("KinkyDungeonSexyMode", KinkyDungeonSexyMode ? "True" : "False");
			return true;
		} else if (MouseIn(1175, 150, 275, 64)) {
			KinkyDungeonSexyMode = true;
			localStorage.setItem("KinkyDungeonSexyMode", KinkyDungeonSexyMode ? "True" : "False");
			return true;
		} else if (MouseIn(1500, 120, 64, 64) && KinkyDungeonSexyMode) {
			KinkyDungeonSexyPlug = !KinkyDungeonSexyPlug;
			localStorage.setItem("KinkyDungeonSexyPlug", KinkyDungeonSexyPlug ? "True" : "False");
			return true;
		} else if (MouseIn(1500, 200, 64, 64) && KinkyDungeonSexyMode) {
			KinkyDungeonSexyPiercing = !KinkyDungeonSexyPiercing;
			localStorage.setItem("KinkyDungeonSexyPiercing", KinkyDungeonSexyPiercing ? "True" : "False");
			return true;
		}
		KinkyDungeonStatsChoice.set("arousalMode", KinkyDungeonSexyMode ? true : undefined);
		KinkyDungeonStatsChoice.set("arousalModePlug", KinkyDungeonSexyPlug ? true : undefined);
		KinkyDungeonStatsChoice.set("arousalModePiercing", KinkyDungeonSexyPiercing ? true : undefined);
		if (MouseIn(875, 350, 750, 64)) {
			KinkyDungeonDifficultyMode = 0;
			KinkyDungeonStartNewGame();
			return true;
		} else if (MouseIn(875, 450, 750, 64)) {
			KinkyDungeonDifficultyMode = 3;
			KinkyDungeonStartNewGame();
			return true;
		} else if (MouseIn(875, 550, 750, 64)) {
			KinkyDungeonDifficultyMode = 1;
			KinkyDungeonStartNewGame();
			return true;
		} else if (MouseIn(875, 650, 750, 64)) {
			KinkyDungeonDifficultyMode = 2;
			KinkyDungeonStartNewGame();
			return true;
		} else if (MouseIn(1075, 850, 350, 64)) {
			KinkyDungeonState = "Menu";
			return true;
		}
	} else if (KinkyDungeonState == "Stats") {
		let X = KDPerksXStart;
		let Y = KDPerksYStart;
		let Y_alt = KDPerksYStart;

		for (let c of KDCategories) {

			Y = Math.max(Y, Y_alt);
			let height = KDPerksYPad + KDPerksButtonHeight*Math.max(c.buffs.length, c.debuffs.length);
			if (Y + height > KDPerksMaxY) {
				X += (KDPerksButtonWidth + KDPerksButtonWidthPad)*2 + KDPerksXPad;
				Y = KDPerksYStart;
			}

			Y += KDPerksYPad;
			Y_alt = Y;
			for (let stat of c.buffs.concat(c.debuffs)) {
				let YY = stat[1].cost < 0 ? Y_alt : Y;
				let XX = stat[1].cost < 0 ? X + KDPerksButtonWidth + KDPerksButtonWidthPad : X;

				if (MouseIn(XX, YY, KDPerksButtonWidth, KDPerksButtonHeight)) {
					if (!KinkyDungeonStatsChoice.get(stat[0]) && KinkyDungeonCanPickStat(stat[0])) {
						KinkyDungeonStatsChoice.set(stat[0], true);
						localStorage.setItem('KinkyDungeonStatsChoice' + KinkyDungeonPerksConfig, JSON.stringify(Array.from(KinkyDungeonStatsChoice.keys())));
					} else if (KinkyDungeonStatsChoice.get(stat[0])) {
						KinkyDungeonStatsChoice.delete(stat[0]);
						localStorage.setItem('KinkyDungeonStatsChoice' + KinkyDungeonPerksConfig, JSON.stringify(Array.from(KinkyDungeonStatsChoice.keys())));
					}
				}
				if (stat[1].cost < 0) Y_alt += KDPerksButtonHeight + KDPerksButtonHeightPad;
				else Y += KDPerksButtonHeight + KDPerksButtonHeightPad;
			}
		}

		if (MouseIn(100, 920, 190, 64)) {
			KinkyDungeonStatsChoice = new Map();
			return true;
		}

		if (MouseIn(330, 930, 140, 54)) {
			KinkyDungeonPerksConfig = "1";
			KinkyDungeonLoadStats();
			return true;
		} else if (MouseIn(480, 930, 140, 54)) {
			KinkyDungeonPerksConfig = "2";
			KinkyDungeonLoadStats();
			return true;
		} else if (MouseIn(630, 930, 140, 54)) {
			KinkyDungeonPerksConfig = "3";
			KinkyDungeonLoadStats();
			return true;
		}

		if (MouseIn(875, 920, 350, 64) && KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice) >= 0) {
			KinkyDungeonState = "Diff";
			return true;
		} else if (MouseIn(1275, 920, 350, 64)) {
			KinkyDungeonState = "Menu";
			return true;
		}
	} else if (KinkyDungeonState == "Load"){
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonNewGame = 0;
			KinkyDungeonDifficultyMode = 0;
			KinkyDungeonInitialize(1, true);
			MiniGameKinkyDungeonCheckpoint = 1;
			if (KinkyDungeonLoadGame(ElementValue("saveInputField"))) {
				KDSendEvent('loadGame');
				//KDInitializeJourney(KDJourney);
				KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel, false, true);
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

					//let KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
					KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3, KinkyDungeonKeybindings.Spell4, KinkyDungeonKeybindings.Spell5]; // ! @ #
					KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
					KinkyDungeonKeySkip = [KinkyDungeonKeybindings.Skip]; // Space and 5 (53)
					KinkyDungeonKeyWeapon = [KinkyDungeonKeybindings.SpellWeapon]; // 6 (54)

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
	} else if (KinkyDungeonState == "LoadOutfit"){
		if (MouseIn(875, 750, 350, 64)) {
			// Save outfit
			let appearance = LZString.decompressFromBase64(ElementValue("saveInputField"));

			if (appearance) {
				CharacterAppearanceRestore(KinkyDungeonPlayer, appearance);
				CharacterRefresh(KinkyDungeonPlayer);
				KDInitProtectedGroups();
				localStorage.setItem("kinkydungeonappearance", LZString.compressToBase64(CharacterAppearanceStringify(KinkyDungeonPlayer)));
			}
			// Return to menu
			KinkyDungeonState = "Menu";
			ElementRemove("saveInputField");
			return true;
		} else if (MouseIn(1275, 750, 350, 64)) {
			// Restore the original outfit
			if (KDOriginalValue) {
				CharacterAppearanceRestore(KinkyDungeonPlayer, LZString.decompressFromBase64(KDOriginalValue));
				CharacterRefresh(KinkyDungeonPlayer);
				KDInitProtectedGroups();
			}


			KinkyDungeonState = "Menu";
			ElementRemove("saveInputField");
			return true;
		}
	} else if (KinkyDungeonState == "Consent") {
		if (MouseIn(975, 720, 450, 64)) {
			KinkyDungeonState = "Menu";
			KDSendEvent('optin');
			return true;
		} else if (MouseIn(975, 820, 450, 64)) {
			KDSendEvent('optout');
			KDOptOut = true;
			KinkyDungeonState = "Menu";
			return true;
		}
	} else if (KinkyDungeonState == "Menu" || KinkyDungeonState == "Lose") {
		if (MouseIn(600, 100, 64, 64)) {
			KinkyDungeonSound = !KinkyDungeonSound;
			localStorage.setItem("KinkyDungeonSound", KinkyDungeonSound ? "True" : "False");
		}
		if (MouseIn(600, 260, 64, 64)) {
			KinkyDungeonFullscreen = !KinkyDungeonFullscreen;
			localStorage.setItem("KinkyDungeonFullscreen", KinkyDungeonFullscreen ? "True" : "False");
		}
		if ((MouseIn(875, 750, 350, 64) && (localStorage.getItem('KinkyDungeonSave') || KinkyDungeonState == "Lose")) || MouseIn(875, 820, 350, 64)) {
			if (!MouseIn(875, 820, 350, 64)) {
				KinkyDungeonStartNewGame(true);
			} else {
				KinkyDungeonState = "Journey";
				KinkyDungeonLoadStats();
			}

			return false;
		} else if (MouseIn(1275, 820, 350, 64)) {
			KinkyDungeonState = "Load";
			ElementCreateTextArea("saveInputField");
			return true;
		} else if (MouseIn(590, 930, 150, 64)) {
			KinkyDungeonState = "LoadOutfit";

			KDOriginalValue = LZString.compressToBase64(CharacterAppearanceStringify(KinkyDungeonPlayer));
			CharacterReleaseTotal(KinkyDungeonPlayer);
			ElementCreateTextArea("saveInputField");
			ElementValue("saveInputField", LZString.compressToBase64(CharacterAppearanceStringify(KinkyDungeonPlayer)));
			return true;
		} else if (MouseIn(25, 930, 325, 64)) {
			if (KinkyDungeonState == "Lose") {
				KinkyDungeonState = "Menu";
				let appearance = LZString.decompressFromBase64(localStorage.getItem("kinkydungeonappearance"));
				if (appearance) {
					CharacterAppearanceRestore(KinkyDungeonPlayer, appearance);
					CharacterRefresh(KinkyDungeonPlayer);
				}
			}
			// @ts-ignore
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
			// @ts-ignore
			KinkyDungeonPlayer.OnlineSharedSettings = {BlockBodyCosplay: false, AllowFullWardrobeAccess: true};
			CharacterAppearanceLoadCharacter(KinkyDungeonPlayer);
			KinkyDungeonConfigAppearance = true;
			return true;
		} else if (MouseIn(360, 930, 220, 64)) {
			if (KinkyDungeonReplaceConfirm > 0) {
				KinkyDungeonDresses.Default = KinkyDungeonDefaultDefaultDress;
				CharacterAppearanceRestore(KinkyDungeonPlayer, CharacterAppearanceStringify(KinkyDungeonPlayerCharacter ? KinkyDungeonPlayerCharacter : Player));
				CharacterReleaseTotal(KinkyDungeonPlayer);
				KinkyDungeonSetDress("Default", "OutfitDefault");
				KinkyDungeonDressPlayer();
				KDInitProtectedGroups();
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
		if (MouseIn(850, 930, 375, 64)) {
			let url = 'https://www.deviantart.com/ada18980';
			window.open(url, '_blank');
			return true;
		}
		if (MouseIn(1275, 930, 375, 64)) {
			let url = 'https://www.patreon.com/ada18980';
			KDSendEvent('patreon');
			window.open(url, '_blank');
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

					//let KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
					KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3, KinkyDungeonKeybindings.Spell4, KinkyDungeonKeybindings.Spell5]; // ! @ #
					KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
					KinkyDungeonKeySkip = [KinkyDungeonKeybindings.Skip]; // Space and 5 (53)
					KinkyDungeonKeyWeapon = [KinkyDungeonKeybindings.SpellWeapon]; // 6 (54)

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
			if (MouseIn(1075, 100, 300, 64)) {
				KinkyDungeonKeybindingsTemp.SpellWeapon = KinkyDungeonKeybindingCurrentKey;
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
			KinkyDungeonNewGamePlus();
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
			{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
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
	/** @type {KinkyDungeonSave} */
	let save = {};
	save.level = MiniGameKinkyDungeonLevel;
	save.checkpoint = MiniGameKinkyDungeonCheckpoint;
	save.rep = KinkyDungeonGoddessRep;
	save.costs = KinkyDungeonShrineCosts;
	save.pcosts = KinkyDungeonPenanceCosts;
	save.dress = KinkyDungeonCurrentDress;
	save.gold = KinkyDungeonGold;
	save.points = KinkyDungeonSpellPoints;
	save.levels = KinkyDungeonSpellLevel;
	save.id = KinkyDungeonEnemyID;
	save.choices = KinkyDungeonSpellChoices;
	save.choices2 = KinkyDungeonSpellChoicesToggle;
	save.buffs = KinkyDungeonPlayerBuffs;
	save.lostitems = KinkyDungeonLostItems;
	save.rescued = KinkyDungeonRescued;
	save.aid = KinkyDungeonAid;
	save.seed = KinkyDungeonSeed;
	save.statchoice = Array.from(KinkyDungeonStatsChoice);
	save.mapIndex = KinkyDungeonMapIndex;
	save.flags = Array.from(KinkyDungeonFlags);
	save.faction = KinkyDungeonFactionRelations;

	let spells = [];
	/**@type {item[]} */
	let newInv = [];

	for (let inv of KinkyDungeonFullInventory()) {
		let item = Object.assign({}, inv);
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
		distraction: KinkyDungeonStatDistraction,
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
			&& saveData.dress != undefined) {
			KinkyDungeonEntities = [];
			if (saveData.flags && saveData.flags.length) KinkyDungeonFlags = new Map(saveData.flags);
			MiniGameKinkyDungeonLevel = saveData.level;
			MiniGameKinkyDungeonCheckpoint = saveData.checkpoint;
			KinkyDungeonShrineCosts = saveData.costs;
			KinkyDungeonGoddessRep = saveData.rep;
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
				if (saveData.stats.distraction != undefined) KinkyDungeonStatDistraction = saveData.stats.distraction;
				if (saveData.stats.wep != undefined) KDSetWeapon(saveData.stats.wep);
				if (saveData.stats.npp != undefined) KinkyDungeonNewGame = saveData.stats.npp;
				if (saveData.stats.diff != undefined) KinkyDungeonDifficultyMode = saveData.stats.diff;


				KDOrigStamina = KinkyDungeonStatStamina;
				KDOrigMana = KinkyDungeonStatMana;
				KDOrigDistraction = KinkyDungeonStatDistraction;
			}
			if (saveData.KDGameData != undefined) KDGameData = saveData.KDGameData;
			if (saveData.statchoice != undefined) KinkyDungeonStatsChoice = new Map(saveData.statchoice);
			if (saveData.faction != undefined) KinkyDungeonFactionRelations = saveData.faction;
			KDInitFactions();

			if (!KDGameData.AlreadyOpened) KDGameData.AlreadyOpened = [];

			KDInitInventory();
			for (let item of saveData.inventory) {
				if (item.type == Restraint) {
					let restraint = KinkyDungeonGetRestraintByName(item.name);
					if (restraint) {
						KinkyDungeonAddRestraint(restraint, 0, true, item.lock, undefined, undefined, undefined, undefined, item.faction); // Add the item
						let createdrestraint = KinkyDungeonGetRestraintItem(restraint.Group);
						if (createdrestraint) createdrestraint.lock = item.lock; // Lock if applicable
					}
				}
			}
			for (let item of saveData.inventory) {
				KinkyDungeonInventoryAdd(item);
			}

			KinkyDungeonSpells = [];
			for (let spell of saveData.spells) {
				let sp = KinkyDungeonFindSpell(spell);
				if (sp) KinkyDungeonSpells.push(sp);
			}

			KinkyDungeonSetMaxStats();
			KinkyDungeonCheckClothesLoss = true;
			KDNaked = false;
			KinkyDungeonDressPlayer();
			KDRefresh = true;
			if (KDGameData.Journey)
				KDJourney = KDGameData.Journey;
			if (saveData.mapIndex) KinkyDungeonMapIndex = saveData.mapIndex;

			if (String)
				localStorage.setItem('KinkyDungeonSave', String);

			if (saveData.KDGameData && saveData.KDGameData.LastMapSeed) KDsetSeed(saveData.KDGameData.LastMapSeed);
			return true;
		}
	}
	return false;
}

let KinkyDungeonSeed = (Math.random() * 4294967296).toString();
let KDRandom = sfc32(xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)(), xmur3(KinkyDungeonSeed)());

/**
 *
 * @param {boolean} Native Decides whether or not to use native KDRandom to randomize
 */
function KDrandomizeSeed(Native) {
	let rand = Native ? KDRandom : () => {return Math.random();};
	KinkyDungeonSeed = (rand() * 4294967296).toString();
	for (let i = 0; i < 20; i++) {
		let index = rand() * KinkyDungeonSeed.length;
		KinkyDungeonSeed = KinkyDungeonSeed.replaceAt(index, String.fromCharCode(65 + Math.floor(rand()*50)) + String.fromCharCode(65 + Math.floor(rand()*50)));
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
	let h = 1779033703 ^ str.length;
	for(let i = 0; i < str.length; i++) {
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
		let t = (a + b) | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		d = d + 1 | 0;
		t = t + d | 0;
		c = c + t | 0;
		return (t >>> 0) / 4294967296;
	};
}

let KDPerksButtonWidth = 198;
let KDPerksButtonWidthPad = 2;
let KDPerksButtonHeight = 38;
let KDPerksButtonHeightPad = 2;
let KDPerksXPad = 50;
let KDPerksYPad = 50;
let KDPerksYStart = 220;
let KDPerksXStart = 100;
let KDPerksMaxY = 910;

let KDCategories = [

];

function KinkyDungeonDrawPerks(NonSelectable) {
	let fadeColor = NonSelectable ? "#808080" : "#999999";
	let X = KDPerksXStart;
	let Y = KDPerksYStart;
	let Y_alt = KDPerksYStart;

	let tooltip = false;

	for (let c of KDCategories) {
		Y = Math.max(Y, Y_alt);
		let height = KDPerksYPad + KDPerksButtonHeight*Math.max(c.buffs.length, c.debuffs.length);
		if (Y + height > KDPerksMaxY) {
			X += (KDPerksButtonWidth + KDPerksButtonWidthPad)*2 + KDPerksXPad;
			Y = KDPerksYStart;
		}

		Y += KDPerksYPad;
		Y_alt = Y;
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("KDCategory" + c.name), X+1, Y - KDPerksButtonHeight/2, KDPerksButtonWidth*2+1, "black");
		DrawTextFit(TextGet("KDCategory" + c.name), X, Y - KDPerksButtonHeight/2, KDPerksButtonWidth*2, "white");
		MainCanvas.textAlign = "center";
		for (let stat of c.buffs.concat(c.debuffs)) {
			let YY = stat[1].cost < 0 ? Y_alt : Y;
			let XX = stat[1].cost < 0 ? X + KDPerksButtonWidth + KDPerksButtonWidthPad : X;

			let colorAvailable = NonSelectable ?
			fadeColor :
			stat[1].cost > 0 ?
				"#aaaacc" :
				stat[1].cost < 0 ?
					"#ccaaaa" :
					"#aaaacc";
			let colorSelected = stat[1].cost > 0 ? "#eeeeff" : stat[1].cost < 0 ? "#ffeeee" : "#eeeeff";
			let colorExpensive = stat[1].cost > 0 ? "#555588" : stat[1].cost < 0 ? "#885555" : "#555588";

			DrawButton(XX, YY, KDPerksButtonWidth, KDPerksButtonHeight, TextGet("KinkyDungeonStat" + (stat[1].id)) + ` (${stat[1].cost})`, (!KinkyDungeonStatsChoice.get(stat[0]) && KinkyDungeonCanPickStat(stat[0])) ? colorAvailable : (KinkyDungeonStatsChoice.get(stat[0]) ? colorSelected : (NonSelectable ? colorAvailable : colorExpensive)));
			if (MouseIn(XX, YY, KDPerksButtonWidth, KDPerksButtonHeight)) {
				DrawTextFit(TextGet("KinkyDungeonStatDesc" + (stat[1].id)), 1250+1, 150+1, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonStatDesc" + (stat[1].id)), 1250, 150, 1000, "white");

				DrawTextFit(TextGet("KinkyDungeonStatCost").replace("AMOUNT", stat[1].cost + ""), 1250+1, 190+1, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonStatCost").replace("AMOUNT", stat[1].cost + ""), 1250, 190, 1000, "white");
				tooltip = true;
			}
			if (stat[1].cost < 0) Y_alt += KDPerksButtonHeight + KDPerksButtonHeightPad;
			else Y += KDPerksButtonHeight + KDPerksButtonHeightPad;
		}
	}
	return tooltip;
}
