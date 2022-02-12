"use strict";

let KinkyDungeonGagMumbleChance = 0.02;
let KinkyDungeonGagMumbleChancePerRestraint = 0.0025;

let MiniGameKinkyDungeonCheckpoint = 0;
let MiniGameKinkyDungeonShortcut = 0;
let MiniGameKinkyDungeonLevel = -1;
let KinkyDungeonMapIndex = [];

let KinkyDungeonLightGrid = [];
let KinkyDungeonFogGrid = [];
let KinkyDungeonUpdateLightGrid = true;
let KinkyDungeonGrid = "";
let KinkyDungeonGrid_Last = "";
let KinkyDungeonGridSize = 50;
let KinkyDungeonGridWidth = 31;
let KinkyDungeonGridHeight = 19;

let KinkyDungeonGridSizeDisplay = 72;
let KinkyDungeonGridWidthDisplay = 17;
let KinkyDungeonGridHeightDisplay = 9;

let KinkyDungeonMoveDirection = KinkyDungeonGetDirection(0, 0);

let KinkyDungeonTextMessagePriority = 0;
let KinkyDungeonTextMessage = "";
let KinkyDungeonTextMessageTime = 0;
let KinkyDungeonTextMessageColor = "white";

let KinkyDungeonActionMessagePriority = 0;
let KinkyDungeonActionMessage = "";
let KinkyDungeonActionMessageTime = 0;
let KinkyDungeonActionMessageColor = "white";

let KinkyDungeonSpriteSize = 72;

let KinkyDungeonCanvas = document.createElement("canvas");
let KinkyDungeonContext = null;
let KinkyDungeonCanvasFow = document.createElement("canvas");
let KinkyDungeonContextFow = null;
let KinkyDungeonCanvasPlayer = document.createElement("canvas");
let KinkyDungeonContextPlayer = null;

let KinkyDungeonEntities = [];
let KinkyDungeonTerrain = [];

let KinkyDungeonMapBrightness = 5;

let KinkyDungeonGroundTiles = "023w]";
let KinkyDungeonMovableTilesEnemy = KinkyDungeonGroundTiles + "HBSsRrdTg"; // Objects which can be moved into: floors, debris, open doors, staircases
let KinkyDungeonMovableTilesSmartEnemy = "D" + KinkyDungeonMovableTilesEnemy; //Smart enemies can open doors as well
let KinkyDungeonMovableTiles = "OCAG" + KinkyDungeonMovableTilesSmartEnemy; // Player can open chests
let KinkyDungeonTransparentObjects = KinkyDungeonMovableTiles.replace("D", "").replace("g", "") + "OoAaCcBb"; // Light does not pass thru doors or grates
let KinkyDungeonTransparentMovableObjects = KinkyDungeonMovableTiles.replace("D", "").replace("g", ""); // Light does not pass thru doors or grates

/**
 * Cost growth, overrides the default amount
//@type {Map<string, {x: number, y: number, tags?:string[]}>}
 */
let KinkyDungeonRandomPathablePoints = new Map();
let KinkyDungeonTiles = new Map();
let KinkyDungeonTargetTile = null;
let KinkyDungeonTargetTileLocation = "";

const KinkyDungeonBaseLockChance = 0.1;
const KinkyDungeonScalingLockChance = 0.1; // Lock chance per 10 floors. Does not affect the guaranteed locked chest each level
const KinkyDungeonGreenLockChance = 0.3;
const KinkyDungeonGreenLockChanceScaling = 0.01;
const KinkyDungeonGreenLockChanceScalingMax = 0.8;
const KinkyDungeonYellowLockChance = 0.15;
const KinkyDungeonYellowLockChanceScaling = 0.008;
const KinkyDungeonYellowLockChanceScalingMax = 0.7;
const KinkyDungeonBlueLockChance = -0.1;
const KinkyDungeonBlueLockChanceScaling = 0.01;
const KinkyDungeonBlueLockChanceScalingMax = 0.4;
const KinkyDungeonGoldLockChance = -0.25; // Chance that a blue lock is replaced with a gold lock
const KinkyDungeonGoldLockChanceScaling = 0.01;
const KinkyDungeonGoldLockChanceScalingMax = 0.25;

let KinkyDungeonDoorShutTimer = 6;

const KinkyDungeonEasyLockChance = 0.8;
const KinkyDungeonEasyLockChanceScaling = -0.007;
const KinkyDungeonEasyLockChanceScalingMax = 1.0;
const KinkyDungeonHardLockChance = 0.2;
const KinkyDungeonHardLockChanceScaling = 0.005;
const KinkyDungeonHardLockChanceScalingMax = 0.4;

let KinkyDungeonCurrentMaxEnemies = 1;

let KinkyDungeonNextDataSendTime = 0;
const KinkyDungeonNextDataSendTimeDelay = 500; // Send on moves every 0.5 second
let KinkyDungeonNextDataSendTimeDelayPing = 5000; // temporary ping
let KinkyDungeonNextDataSendStatsTimeDelay = 3000; // Send stats every 3s to save bandwidth
let KinkyDungeonNextDataSendStatsTime = 0;

let KinkyDungeonNextDataLastTimeReceived = 0;
let KinkyDungeonNextDataLastTimeReceivedTimeout = 15000; // Clear data if more than 15 seconds of no data received


let KinkyDungeonDoorCloseTimer = 0;
let KinkyDungeonLastMoveDirection = null;
let KinkyDungeonTargetingSpell = null;

let KinkyDungeonMaxLevel = 40; // Game stops when you reach this level

let KinkyDungeonLastMoveTimer = 0;
let KinkyDungeonLastMoveTimerStart = 0;
let KinkyDungeonLastMoveTimerCooldown = 175;
let KinkyDungeonLastMoveTimerCooldownStart = 50;

let KinkyDungeonPatrolPoints = [];
let KinkyDungeonStartPosition = {x: 1, y: 1};
let KinkyDungeonEndPosition = {x: 1, y: 1};
let KinkyDungeonJailLeash = 3;
let KinkyDungeonJailLeashX = 4;
let KinkyDungeonJailTransgressed = false;
let KinkyDungeonOrbsPlaced = [];
let KinkyDungeonCachesPlaced = [];
let KinkyDungeonChestsOpened = [];

let KinkyDungeonSaveInterval = 10;

let KinkyDungeonSFX = [];

function KinkyDungeonPlaySound(src) {
	if (KinkyDungeonSound && !KinkyDungeonSFX.includes(src)) {
		AudioPlayInstantSound(src);
		KinkyDungeonSFX.push(src);
	}
}

function KinkyDungeonAddChest(Amount, Floor) {
	if (KinkyDungeonChestsOpened.length < Floor - 1) {
		KinkyDungeonChestsOpened.push(0);
	}
	KinkyDungeonChestsOpened[Floor] += Amount;
}

function KinkyDungeonSetCheckPoint(Checkpoint, AutoSave) {
	let prevCheckpoint = MiniGameKinkyDungeonCheckpoint;
	if (Checkpoint != undefined) MiniGameKinkyDungeonCheckpoint = Checkpoint;
	else if (Math.floor(MiniGameKinkyDungeonLevel / 10) == MiniGameKinkyDungeonLevel / 10)
		MiniGameKinkyDungeonCheckpoint = Math.floor(MiniGameKinkyDungeonLevel / 10);
	let saveData = KinkyDungeonSaveGame(true);
	if (MiniGameKinkyDungeonCheckpoint != prevCheckpoint || (Math.floor(MiniGameKinkyDungeonLevel / 5) == MiniGameKinkyDungeonLevel / 5 && MiniGameKinkyDungeonCheckpoint < 11)) {
		KDGameData.KinkyDungeonSpawnJailers = 0;
		KDGameData.KinkyDungeonSpawnJailersMax = 0;
		if (KinkyDungeonDifficultyMode == 0) {
			KinkyDungeonState = "Save";
			ElementCreateTextArea("saveDataField");
			ElementValue("saveDataField", saveData);
		}
	}
	if (AutoSave)
		KinkyDungeonSaveGame();
}

function KinkyDungeonInitialize(Level, Random) {
	CharacterReleaseTotal(KinkyDungeonPlayer);
	Object.assign(KDGameData, KDGameDataBase);

	KinkyDungeonRefreshRestraintsCache();
	KinkyDungeonRefreshOutfitCache();
	//KinkyDungeonRefreshEnemyCache();

	KinkyDungeonDressSet();
	if (KinkyDungeonConfigAppearance) {
		localStorage.setItem("kinkydungeonappearance", LZString.compressToBase64(CharacterAppearanceStringify(KinkyDungeonPlayer)));
		KinkyDungeonConfigAppearance = false;
	}

	KinkyDungeonDressPlayer();
	KinkyDungeonDrawState = "Game";



	KinkyDungeonTextMessage = "";
	KinkyDungeonActionMessage = "";
	MiniGameKinkyDungeonLevel = Level;
	KinkyDungeonSetCheckPoint();

	KinkyDungeonMapIndex = [];


	for (let I = 1; I < KinkyDungeonMapParams.length; I++)
		KinkyDungeonMapIndex.push(I);

	// Option to shuffle the dungeon types besides the initial one (graveyard)
	if (Random) {
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (let i = KinkyDungeonMapIndex.length - 1; i > 0; i--) {
			let j = Math.floor(KDRandom() * (i + 1));
			let temp = KinkyDungeonMapIndex[i];
			KinkyDungeonMapIndex[i] = KinkyDungeonMapIndex[j];
			KinkyDungeonMapIndex[j] = temp;
		}
	}
	KinkyDungeonMapIndex.unshift(0);
	KinkyDungeonMapIndex.push(10);


	KinkyDungeonContextPlayer = KinkyDungeonCanvasPlayer.getContext("2d");
	KinkyDungeonCanvasPlayer.width = KinkyDungeonGridSizeDisplay;
	KinkyDungeonCanvasPlayer.height = KinkyDungeonGridSizeDisplay;

	KinkyDungeonContext = KinkyDungeonCanvas.getContext("2d");
	KinkyDungeonCanvas.height = KinkyDungeonCanvasPlayer.height*KinkyDungeonGridHeightDisplay;

	KinkyDungeonContextFow = KinkyDungeonCanvasFow.getContext("2d");
	KinkyDungeonCanvasFow.width = KinkyDungeonCanvas.width;
	KinkyDungeonCanvasFow.height = KinkyDungeonCanvas.height;

	KinkyDungeonDefaultStats();

	// Set up the first level
	KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[0]], 0);
}
// Starts the the game at a specified level
function KinkyDungeonCreateMap(MapParams, Floor, testPlacement) {
	KinkyDungeonSpecialAreas = [];
	KinkyDungeonRescued = {};
	KinkyDungeonAid = {};
	KDGameData.KinkyDungeonPenance = false;
	KDRestraintsCache = new Map();
	KDEnemiesCache = new Map();
	KinkyDungeonGrid = "";
	KinkyDungeonTiles = new Map();
	KinkyDungeonTargetTile = "";

	KDGameData.RescueFlag = false;

	KinkyDungeonTotalSleepTurns = 0;

	KinkyDungeonFastMovePath = [];

	KinkyDungeonGenerateShop(MiniGameKinkyDungeonLevel);

	let height = MapParams.min_height + 2*Math.floor(0.5*KDRandom() * (MapParams.max_height - MapParams.min_height));
	let width = MapParams.min_width + 2*Math.floor(0.5*KDRandom() * (MapParams.max_width - MapParams.min_width));

	KinkyDungeonCanvas.width = KinkyDungeonCanvasPlayer.width*KinkyDungeonGridWidthDisplay;
	KinkyDungeonGridHeight = height;
	KinkyDungeonGridWidth = width;

	KinkyDungeonResetFog();

	// Generate the grid
	for (let X = 0; X < height; X++) {
		for (let Y = 0; Y < width; Y++)
			KinkyDungeonGrid = KinkyDungeonGrid + '1';
		KinkyDungeonGrid = KinkyDungeonGrid + '\n';
	}

	// We only rerender the map when the grid changes
	KinkyDungeonGrid_Last = "";
	KinkyDungeonUpdateLightGrid = true;

	let InJail = KDGameData.KinkyDungeonSpawnJailers > 0 && KDGameData.KinkyDungeonSpawnJailers == KDGameData.KinkyDungeonSpawnJailersMax;
	// Setup variables
	let startpos = 1 + 2*Math.floor(KDRandom()*0.5 * (height - 2));
	if (InJail) startpos = Math.floor(height/2);
	if (startpos % 2 != 1) startpos += 1; // startpos MUST be odd

	// MAP GENERATION

	let VisitedRooms = [];
	KinkyDungeonMapSet(1, startpos, '1', VisitedRooms);

	// Use primm algorithm with modification to spawn random rooms in the maze
	let openness = MapParams.openness;
	let density = MapParams.density;
	let doodadchance = MapParams.doodadchance;
	let barchance = MapParams.barchance;
	let treasurechance = 1.0; // Chance for an extra locked chest
	let treasurecount = MapParams.chestcount; // Max treasure chest count
	if (KDGameData.KinkyDungeonSpawnJailers > 0) treasurecount = 0;
	let shrinechance = MapParams.shrinechance; // Chance for an extra shrine
	let ghostchance = MapParams.ghostchance; // Chance for a ghost
	let shrinecount = MapParams.shrinecount; // Max treasure chest count
	let rubblechance = MapParams.rubblechance; // Chance of lootable rubble
	let doorchance = MapParams.doorchance; // Chance door will be closed
	let nodoorchance = MapParams.nodoorchance; // Chance of there not being a door
	let doorlockchance = MapParams.doorlockchance; // Max treasure chest count
	if (KinkyDungeonGoddessRep.Prisoner && KDGameData.KinkyDungeonSpawnJailers > 0) doorlockchance = doorlockchance + (KDGameData.KinkyDungeonSpawnJailers / KDGameData.KinkyDungeonSpawnJailersMax) * (1.0 - doorlockchance) * (KinkyDungeonGoddessRep.Prisoner + 50)/100;
	let trapChance = MapParams.trapchance; // Chance of a pathway being split between a trap and a door
	let grateChance = MapParams.grateChance;
	let floodChance = MapParams.floodchance ? MapParams.floodchance : 0;
	let gasChance = MapParams.gaschance ? MapParams.gaschance : 0;
	let brickchance = MapParams.brickchance; // Chance for brickwork to start being placed
	let shrinefilter = KinkyDungeonGetMapShrines(MapParams.shrines);
	let traptypes = MapParams.traps.concat(KinkyDungeonGetGoddessTrapTypes());
	let cacheInterval = MapParams.cacheInterval;
	let forbiddenChance = MapParams.forbiddenChance;
	let greaterChance = MapParams.forbiddenGreaterChance;

	let shrineTypes = [];
	KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density, floodChance);

	KinkyDungeonGroundItems = []; // Clear items on the ground
	KinkyDungeonBullets = []; // Clear all bullets

	// Place the player!
	KinkyDungeonPlayerEntity = {MemberNumber:Player.MemberNumber, x: 1, y:startpos, player:true};
	KinkyDungeonStartPosition = {x: 1, y: startpos};

	KinkyDungeonJailTransgressed = true;

	KinkyDungeonReplaceDoodads(doodadchance, barchance, width, height); // Replace random internal walls with doodads
	KinkyDungeonPlaceStairs(startpos, width, height); // Place the start and end locations
	if (InJail) KinkyDungeonCreateCell((KinkyDungeonGoddessRep.Prisoner + 50), width, height);
	if ((InJail && KinkyDungeonLostItems.length > 0) || ((MiniGameKinkyDungeonLevel % 10) % cacheInterval == 0 && !KinkyDungeonCachesPlaced.includes(Floor)))
		KinkyDungeonCreateCache(Floor, width, height);
	let createForbidden = !InJail && KDRandom() < forbiddenChance && (MiniGameKinkyDungeonLevel > 3 || KinkyDungeonNewGame > 0);
	let traps = (createForbidden ? KinkyDungeonCreateForbidden(greaterChance) : []);
	if (traps.length > 0) {
		console.log("Attempted to create forbidden stuff");
	}
	if (!testPlacement) {
		KinkyDungeonPlaceShortcut(KinkyDungeonGetShortcut(Floor), width, height);
		KinkyDungeonPlaceChests(treasurechance, treasurecount, rubblechance, Floor, width, height); // Place treasure chests inside dead ends
		let traps2 = KinkyDungeonPlaceDoors(doorchance, nodoorchance, doorlockchance, trapChance, grateChance, Floor, width, height);
		for (let t of traps2) {
			traps.push(t);
		}
		KinkyDungeonPlaceShrines(shrinechance, shrineTypes, shrinecount, shrinefilter, ghostchance, Floor, width, height);
		KinkyDungeonPlaceBrickwork(brickchance, Floor, width, height);
		KinkyDungeonPlaceTraps(traps, traptypes, Floor, width, height);
		KinkyDungeonPlacePatrols(4, width, height);
		KinkyDungeonPlaceLore(width, height);
		KinkyDungeonPlaceSpecialTiles(gasChance, Floor, width, height);
		KinkyDungeonGenNavMap();
		if (InJail) {
			KinkyDungeonTiles.get(KinkyDungeonJailLeashX + "," + KinkyDungeonStartPosition.y).Lock = KinkyDungeonGenerateLock(true, Floor);
		}

		KinkyDungeonUpdateStats(0);

		// Place enemies after player
		KinkyDungeonPlaceEnemies(InJail, MapParams.enemytags, Floor, width, height);
	}

	// Set map brightness
	KinkyDungeonMapBrightness = MapParams.brightness;
}

/**
 * Creates a list of all tiles accessible and not hidden by doors
 */
function KinkyDungeonGenNavMap() {
	KinkyDungeonRandomPathablePoints = new Map();
	let accessible = KinkyDungeonGetAccessible(KinkyDungeonEndPosition.x, KinkyDungeonEndPosition.y);
	for (let a of accessible) {
		let X = parseFloat(a.split(',')[0]);
		let Y = parseFloat(a.split(',')[1]);
		let tags = [];
		if (!KinkyDungeonTiles.get(a) || !KinkyDungeonTiles.get(a).OffLimits)
			KinkyDungeonRandomPathablePoints.set(a,{x: X, y:Y, tags:tags});
	}
}

// Checks everything that is accessible to the player
function KinkyDungeonGetAccessible(startX, startY, testX, testY) {
	let tempGrid = [];
	let checkGrid = [(startX + "," + startY)];
	while (checkGrid.length > 0) {
		for (let g of checkGrid) {
			let split = g.split(',');
			let X = parseInt(split[0]);
			let Y = parseInt(split[1]);
			for (let XX = -1; XX <= 1; XX++)
				for (let YY = -1; YY <= 1; YY++) {
					let test = ((X+XX) + "," + (Y+YY));
					let locked = (testX != undefined && testY != undefined && X+XX == testX && Y+YY == testY)
						|| (KinkyDungeonTiles.get("" + (X+XX) + "," + (Y+YY)) && KinkyDungeonTiles.get("" + (X+XX) + "," + (Y+YY)).Lock);
					if (!checkGrid.includes(test) && !tempGrid.includes(test) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+XX, Y+YY)) && !locked) {
						checkGrid.push(test);
						tempGrid.push(test);
					}
				}

			checkGrid.splice(checkGrid.indexOf(g), 1);
		}
	}

	return tempGrid;
}

// Checks everything that is accessible to the player, treating all doors as walls
function KinkyDungeonGetAccessibleRoom(startX, startY) {
	let tempGrid = [];
	let checkGrid = [(startX + "," + startY)];
	while (checkGrid.length > 0) {
		for (let g of checkGrid) {
			let split = g.split(',');
			let X = parseInt(split[0]);
			let Y = parseInt(split[1]);
			for (let XX = -1; XX <= 1; XX++)
				for (let YY = -1; YY <= 1; YY++) {
					let test = ((X+XX) + "," + (Y+YY));
					let Tiles = KinkyDungeonMovableTiles.replace("D", "").replace("d", "");
					if (!checkGrid.includes(test) && !tempGrid.includes(test) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+XX, Y+YY))) {
						if (Tiles.includes(KinkyDungeonMapGet(X+XX, Y+YY)))
							checkGrid.push(test);
						tempGrid.push(test);
					}
				}

			checkGrid.splice(checkGrid.indexOf(g), 1);
		}
	}

	return tempGrid;
}

// Tests if the player can reach the end stair even if the test spot is blocked
function KinkyDungeonIsAccessible(testX, testY) {
	let accessible = KinkyDungeonGetAccessible(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, testX, testY);
	for (let a of accessible) {
		let split = a.split(',');
		let X = parseInt(split[0]);
		let Y = parseInt(split[1]);
		if (KinkyDungeonMapGet(X, Y) == 's') return true;
	}
	return false;
}

// Tests if the player can reach the spot from the start point
function KinkyDungeonIsReachable(testX, testY, testLockX, testLockY) {
	let accessible = KinkyDungeonGetAccessible(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, testLockX, testLockY);
	for (let a of accessible) {
		let split = a.split(',');
		let X = parseInt(split[0]);
		let Y = parseInt(split[1]);
		if (X == testX && Y == testY) return true;
	}
	return false;
}

// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceEnemies(InJail, Tags, Floor, width, height) {
	KinkyDungeonEntities = [];

	KinkyDungeonHuntDownPlayer = false;
	KinkyDungeonFirstSpawn = true;
	KinkyDungeonSearchTimer = 0;

	let enemyCount = 4 + Math.floor(Math.sqrt(Floor) + width/20 + height/20 + KinkyDungeonDifficulty/10);
	if (InJail) enemyCount = Math.floor(enemyCount/2);
	let count = 0;
	let tries = 0;
	let miniboss = false;
	let boss = false;
	let jailerCount = 0;
	let EnemyNames = [];

	// Create this number of enemies
	while (count < enemyCount && tries < 1000) {
		let X = 1 + Math.floor(KDRandom()*(width - 1));
		let Y = 1 + Math.floor(KDRandom()*(height - 1));
		let playerDist = 6;
		let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y});

		if ((!KinkyDungeonTiles.get("" + X + "," + Y) || !KinkyDungeonTiles.get("" + X + "," + Y).OffLimits) && Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist && (!InJail || X > KinkyDungeonJailLeashX + 3) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))
			&& KinkyDungeonNoEnemy(X, Y, true) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
			let tags = [];
			if (KDGameData.KinkyDungeonSpawnJailers > 0 && jailerCount < KDGameData.KinkyDungeonSpawnJailersMax) tags.push("jailer");
			if (KinkyDungeonMapGet(X, Y) == 'R' || KinkyDungeonMapGet(X, Y) == 'r') tags.push("rubble");
			if (KinkyDungeonMapGet(X, Y) == 'D' || KinkyDungeonMapGet(X, Y) == 'd') tags.push("door");
			if (KinkyDungeonMapGet(X, Y) == 'g') tags.push("grate");
			if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y+1)) && !KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y-1))) tags.push("passage");
			else if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+1, Y)) && !KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X-1, Y))) tags.push("passage");
			else if (KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+1, Y+1))
					&& KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X+1, Y-1))
					&& KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X-1, Y+1))
					&& KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X-1, Y-1))) tags.push("open");

			for (let XX = X-1; XX <= X+1; XX += 1)
				for (let YY = Y-1; YY <= Y+1; YY += 1)
					if (!(XX == X && YY == Y)) {
						if (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X') tags.push("adjWall");
						if (KinkyDungeonMapGet(XX, YY) == 'D' || KinkyDungeonMapGet(XX, YY) == 'd') tags.push("adjDoor");
						if (KinkyDungeonMapGet(XX, YY) == 'D') tags.push("adjClosedDoor");
						if (KinkyDungeonMapGet(XX, YY) == 'c' || KinkyDungeonMapGet(XX, YY) == 'C') tags.push("adjChest");
						if (KinkyDungeonMapGet(XX, YY) == 'r' || KinkyDungeonMapGet(XX, YY) == 'R') tags.push("adjRubble");

					}

			if (miniboss) tags.push("miniboss");
			if (boss) tags.push("boss");

			KinkyDungeonAddTags(tags, Floor);
			for (let t of Tags) {
				tags.push(t);
			}

			let Enemy = KinkyDungeonGetEnemy(tags, Floor + KinkyDungeonDifficulty/5, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], KinkyDungeonMapGet(X, Y));
			if (Enemy && (!InJail || (Enemy.tags.has("jailer") || Enemy.tags.has("jail")))) {
				KinkyDungeonEntities.push({Enemy: Enemy, id: KinkyDungeonGetEnemyID(), x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
				if (Enemy.tags.has("mimicBlock") && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) KinkyDungeonMapSet(X, Y, '3');
				if (Enemy.tags.has("minor")) count += 0.2; else count += 1; // Minor enemies count as 1/5th of an enemy
				if (Enemy.tags.has("boss")) {boss = true; count += 3 * Math.max(1, 100/(100 + KinkyDungeonDifficulty));} // Boss enemies count as 4 normal enemies
				else if (Enemy.tags.has("elite")) count += Math.max(1, 100/(100 + KinkyDungeonDifficulty)); // Elite enemies count as 2 normal enemies
				if (Enemy.tags.has("miniboss")) miniboss = true; // Adds miniboss as a tag
				if (Enemy.tags.has("removeDoorSpawn") && KinkyDungeonMapGet(X, Y) == "d") KinkyDungeonMapSet(X, Y, '0');
				if (Enemy.tags.has("jailer")) jailerCount += 1;

				if (Enemy.summon) {
					for (let sum of Enemy.summon) {
						if (!sum.chance || KDRandom() < sum.chance)
							KinkyDungeonSummonEnemy(X, Y, sum.enemy, sum.count, sum.range, sum.strict);
					}
				}
				EnemyNames.push(Enemy.name);
			}
		}
		tries += 1;
	}
	console.log(EnemyNames);

	if (KDGameData.KinkyDungeonSpawnJailers > 0) KDGameData.KinkyDungeonSpawnJailers -= 1;
	if (KDGameData.KinkyDungeonSpawnJailers > 3 && KDGameData.KinkyDungeonSpawnJailers < KDGameData.KinkyDungeonSpawnJailersMax - 1) KDGameData.KinkyDungeonSpawnJailers -= 1; // Reduce twice as fast when you are in deep...

	KinkyDungeonCurrentMaxEnemies = KinkyDungeonEntities.length;
}

let KinkyDungeonSpecialAreas = [];

function KinkyDungeonGetClosestSpecialAreaDist(x ,y) {
	let minDist = 10000;
	for (let area of KinkyDungeonSpecialAreas) {
		let dist = KDistChebyshev(x - area.x, y - area.y) - area.radius;
		if (dist < minDist) minDist = dist;
	}

	return minDist;
}

function KinkyDungeonCreateCache(Floor, width, height) {
	let radius = 5;
	let ypos = 1 + Math.floor(KDRandom() * (KinkyDungeonGridHeight - radius - 1));
	let cornerX = KinkyDungeonGridWidth - 7;
	let cornerY = ypos;
	let i = 0;
	let xPadStart = KinkyDungeonJailLeashX + 5;
	for (i = 0; i < 10000; i++) {
		let specialDist = KinkyDungeonGetClosestSpecialAreaDist(cornerX + Math.floor(radius/2), cornerY + Math.floor(radius/2));
		if (specialDist <= 4) {
			cornerY = 1 + Math.floor(KDRandom() * (KinkyDungeonGridHeight - radius - 1));
			cornerX = Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - radius - 1));
		} else break;
	}
	if (i > 9990) {
		console.log("Error generating cache, please report this");
		return;
	}
	KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, true);
	KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + Math.floor(radius/2), 'C');
	KinkyDungeonMapSet(cornerX, cornerY + Math.floor(radius/2) - 1, 'b');
	KinkyDungeonMapSet(cornerX, cornerY + Math.floor(radius/2) + 1, 'b');
	KinkyDungeonMapSet(cornerX, cornerY + Math.floor(radius/2), 'D');
	KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + Math.floor(radius/2)), {Loot: "cache"});
	KinkyDungeonTiles.set(cornerX + "," + (cornerY + Math.floor(radius/2)), {Type: "Door", Lock: "Red", OffLimits: true, ReLock: true});
	KinkyDungeonCachesPlaced.push(Floor);
	KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2) + 1});
}


function KinkyDungeonCreateForbidden(greaterChance, Floor, width, height) {
	if (KDRandom() < greaterChance) {
		let trapLocations = [];
		let radius = 7;
		let ypos = 2 + Math.floor(KDRandom() * (KinkyDungeonGridHeight - radius - 3));
		let cornerX = KinkyDungeonGridWidth - 7;
		let cornerY = ypos;
		let i = 0;
		let xPadStart = KinkyDungeonJailLeashX + 2;
		for (i = 0; i < 10000; i++) {
			let specialDist = KinkyDungeonGetClosestSpecialAreaDist(cornerX + Math.floor(radius/2) - 1, cornerY + Math.floor(radius/2));
			if (specialDist <= 5) {
				cornerY = 2 + Math.floor(KDRandom() * (KinkyDungeonGridHeight - radius - 3));
				cornerX = Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - radius - 1));
			} else break;
		}
		if (i > 9990) {
			console.log("Error generating forbidden temple");
			return trapLocations;
		}
		KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, false);
		KinkyDungeonCreateRectangle(cornerX+1, cornerY, radius-2, radius, true, false, 1, true);

		for (let X = cornerX + Math.floor(radius/2) - 1; X <= cornerX + Math.floor(radius/2) + 1; X++) {
			for (let Y = cornerY + 1; Y < cornerY + radius - 1; Y++) {
				if (!(X == cornerX + Math.floor(radius/2) && Y == cornerY + 1) && !(X == cornerX + Math.floor(radius/2) && Y == cornerY + radius - 2)) {
					if (KDRandom() < 0.65) {
						trapLocations.push({x: X, y: Y});
					} else if (X != cornerX + Math.floor(radius/2) && Y >= cornerY + 1) {
						KinkyDungeonMapSet(X, Y, 'X');
					}
				}
			}
		}

		KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + 1, 'C');
		KinkyDungeonMapSet(cornerX + Math.floor(radius/2) + 1, cornerY + radius - 1, 'X');
		KinkyDungeonMapSet(cornerX + Math.floor(radius/2) - 1, cornerY + radius - 1, 'X');
		KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + radius - 1, '2');

		KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + 1), {Loot: "gold"});
		KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2) + 4});

		return trapLocations;
	} else {
		let trapLocations = [];
		let radius = 3;
		let ypos = 2 + Math.floor(KDRandom() * (KinkyDungeonGridHeight - radius - 3));
		let cornerX = KinkyDungeonGridWidth - 7;
		let cornerY = ypos;
		let i = 0;
		let xPadStart = KinkyDungeonJailLeashX + 2;
		for (i = 0; i < 10000; i++) {
			let specialDist = KinkyDungeonGetClosestSpecialAreaDist(cornerX + Math.floor(radius/2) - 1, cornerY + Math.floor(radius/2));
			if (specialDist <= 4) {
				cornerY = 2 + Math.floor(KDRandom() * (KinkyDungeonGridHeight - radius - 3));
				cornerX = Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - radius - 1));
			} else break;
		}
		if (i > 9990) {
			console.log("Error generating forbidden cache");
			return trapLocations;
		}
		KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 0, true);
		KinkyDungeonCreateRectangle(cornerX, cornerY - 1, radius, 1, false, false, 0, false);
		KinkyDungeonCreateRectangle(cornerX, cornerY + radius, radius, 1, false, false, 0, false);
		KinkyDungeonCreateRectangle(cornerX - 1, cornerY, 1, radius, false, false, 0, false);
		KinkyDungeonCreateRectangle(cornerX + radius, cornerY, 1, radius, false, false, 0, false);

		for (let X = cornerX; X < cornerX + radius; X++) {
			for (let Y = cornerY; Y < cornerY + radius; Y++) {
				if (!(X == cornerX + 1 && Y == cornerY + 1)) {
					trapLocations.push({x: X, y: Y});
				}
			}
		}

		KinkyDungeonMapSet(cornerX + 1, cornerY + 1, 'C');

		KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + 1), {Loot: "lessergold"});
		KinkyDungeonSpecialAreas.push({x: cornerX + 1, y: cornerY + 1, radius: 1});

		return trapLocations;
	}
}

// Type 0: empty border, hollow
// Type 1: hollow, no empty border
// Type 2: only empty space
// Type 3: completely filled
function KinkyDungeonCreateRectangle(Left, Top, Width, Height, Border, Fill, Padding, OffLimits) {
	let pad = Padding ? Padding : 0;
	let borderType = (Border) ? '1' : '0';
	let fillType = (Fill) ? '1' : '0';
	for (let X = -pad; X < Width + pad; X++)
		for (let Y = - pad; Y < Height + pad; Y++) {
			if (X + Left < KinkyDungeonGridWidth-1 && Y + Top < KinkyDungeonGridHeight-1 && X + Left > 0 && Y + Top > 0) {
				let setTo = "";
				let offlimit = true;
				if (X < 0 || Y < 0 || X >= Width || Y >= Height) {
					setTo = '0';
					offlimit = false;
				} else {
					if (X == 0 || X == Width - 1 || Y == 0 || Y == Height-1) {
						setTo = borderType;
					} else setTo = fillType;
				}
				if (setTo != "" && KinkyDungeonMapGet(Left + X, Top + Y) != "s") {
					KinkyDungeonMapSet(Left + X, Top + Y, setTo);
					if (offlimit && OffLimits) {
						KinkyDungeonTiles.set((Left + X) + "," + (Top + Y), {OffLimits: true});
					}
				}
			}


			/*
			if ((X == cellWidth || X == 0) && (Y > KinkyDungeonStartPosition.y - cellHeight && Y < KinkyDungeonStartPosition.y + cellHeight)) {
				wall = true;
				if (KDRandom() < barchance) bar = true;
			}
			if (Y == KinkyDungeonStartPosition.y - cellHeight && X <= cellWidth || Y == KinkyDungeonStartPosition.y + cellHeight && X <= cellWidth) {
				wall = true;
				if (KDRandom() < grateChance/(grateCount*3) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y+1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y-1))) grate = true;
			}
			if (X == cellWidth && Y == KinkyDungeonStartPosition.y) {
				wall = false;
				door = true;
			}
			if (door) {
				KinkyDungeonMapSet(X, Y, 'D');
				KinkyDungeonTiles.get(X + "," + Y] = {Type: "Door"};
				if (lock) KinkyDungeonTiles.get(X + "," + Y].Lock = lock;
			} else if (wall) {
				if (bar)
					KinkyDungeonMapSet(X, Y, 'b');
				else if (grate) {
					KinkyDungeonMapSet(X, Y, 'g');
					grateCount += 1;
				} else
					KinkyDungeonMapSet(X, Y, '1');
			} else KinkyDungeonMapSet(X, Y, '0');*/
		}
}

// @ts-ignore
function KinkyDungeonCreateCell(security, width, height) {
	KinkyDungeonJailTransgressed = false;
	let cellWidth = KinkyDungeonJailLeashX;
	KinkyDungeonJailLeash = 5;
	let modsecurity = security - (KinkyDungeonGoddessRep.Ghost + 50);
	if (security > 25) KinkyDungeonJailLeash -= 1;
	if (security > 50) KinkyDungeonJailLeash -= 1;
	if (security > 75) KinkyDungeonJailLeash -= 1;
	let cellHeight = KinkyDungeonJailLeash;
	let barchance = 1.0 - 0.9 * Math.min(1, modsecurity / 100);
	let grateChance = 1.0 - 1.0 * Math.min(1, security / 100);
	let grateCount = 1/3;

	for (let X = 0; X <= cellWidth + 1; X++)
		for (let Y = KinkyDungeonStartPosition.y - cellHeight - 1; Y <= KinkyDungeonStartPosition.y + cellHeight + 1; Y++) {
			let wall = false;
			let door = false;
			let bar = false;
			let grate = false;
			if ((X == cellWidth || X == 0) && (Y > KinkyDungeonStartPosition.y - cellHeight && Y < KinkyDungeonStartPosition.y + cellHeight)) {
				wall = true;
				if (KDRandom() < barchance) bar = true;
			}
			if (Y == KinkyDungeonStartPosition.y - cellHeight && X <= cellWidth || Y == KinkyDungeonStartPosition.y + cellHeight && X <= cellWidth) {
				wall = true;
				if (KDRandom() < grateChance/(grateCount*3) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y+1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y-1))) grate = true;
			}
			if (X == cellWidth && Y == KinkyDungeonStartPosition.y) {
				wall = false;
				door = true;
			}
			if (door) {
				KinkyDungeonMapSet(X, Y, 'D');
				KinkyDungeonTiles.set(X + "," + Y, {Type: "Door", Lock: "Red", Jail: true, ReLock: true});
			} else if (wall) {
				if (bar)
					KinkyDungeonMapSet(X, Y, 'b');
				else if (grate) {
					KinkyDungeonMapSet(X, Y, 'g');
					grateCount += 1;
				} else
					KinkyDungeonMapSet(X, Y, '1');
			} else KinkyDungeonMapSet(X, Y, '0');
		}
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y, 'B');
}

function KinkyDungeonPlaceStairs(startpos, width, height) {
	// Starting stairs are predetermined and guaranteed to be open
	KinkyDungeonMapSet(1, startpos, 'S');
	if (startpos > 1) KinkyDungeonMapSet(2, startpos - 1, '0');
	KinkyDungeonMapSet(2, startpos, '0');
	if (startpos < KinkyDungeonGridHeight-1) KinkyDungeonMapSet(2, startpos + 1, '0');
	if (startpos > 1) KinkyDungeonMapSet(3, startpos - 1, '0');
	KinkyDungeonMapSet(3, startpos, '0');
	if (startpos < KinkyDungeonGridHeight-1) KinkyDungeonMapSet(3, startpos + 1, '0');

	// Ending stairs are not.
	let placed = false;

	for (let X = width - 2; X > 0.75 * width - 2 && !placed; X--)
		for (let L = 100; L > 0; L -= 1) { // Try up to 100 times
			//let X = width - 2;
			let Y = 1 + 2*Math.floor(KDRandom()*0.5 * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				// Check the 3x3 area
				let wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					placed = true;
					KinkyDungeonMapSet(X, Y, 's');
					KinkyDungeonEndPosition = {x: X, y: Y};
					L = 0;
					break;
				}
			}
		}

	if (!placed) // Loosen the constraints
		for (let L = 100; L > 0; L -= 1) { // Try up to 100 times
			let X = width - 2 - Math.floor(KDRandom() * width/4);
			let Y = 1 + Math.floor(KDRandom() * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				KinkyDungeonMapSet(X, Y, 's');
				KinkyDungeonEndPosition = {x: X, y: Y};
				L = 0;
			}
		}


	KinkyDungeonSpecialAreas.push({x: KinkyDungeonEndPosition.x, y: KinkyDungeonEndPosition.y, radius: 0});
}

function KinkyDungeonGetShortcut(level) {

	if (level == 3) {
		return 11;
	}
	if (level == 2 && KinkyDungeonRep > 5) {
		return 11;
	}

	return 0;
}

function KinkyDungeonPlaceShortcut(checkpoint, width, height) {

	if (checkpoint > 0) {

		// Ending stairs are not.
		let placed = false;

		for (let L = 1000; L > 0; L -= 1) { // Try up to 1000 times
			let X = Math.floor(width * 0.75) - 2 - Math.floor(KDRandom() * width/2);
			let Y = 1 + 2*Math.floor(KDRandom()*0.5 * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					placed = true;
					KinkyDungeonMapSet(X, Y, 'H');
					L = 0;
					break;
				}
			}
		}

		if (!placed) // Loosen the constraints
			for (let L = 1000; L > 0; L -= 1) { // Try up to 1000 times
				let X = Math.floor(width * 0.75) - 2 - Math.floor(KDRandom() * width/2);
				let Y = 1 + Math.floor(KDRandom() * (height - 2));
				if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))
					&& (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
					KinkyDungeonMapSet(X, Y, 'H');
					L = 0;
					placed = true;
				}
			}

		if (placed) {
			MiniGameKinkyDungeonShortcut = checkpoint;
		}
	}
}

function KinkyDungeonPlaceChests(treasurechance, treasurecount, rubblechance, Floor, width, height) {
	let chestlist = [];

	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) &&
			(!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					chestlist.push({x:X, y:Y});
				}
			}

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	let extra = KDRandom() < treasurechance;
	treasurecount += (extra ? 1 : 0);
	let alreadyOpened = (KinkyDungeonChestsOpened.length > Floor) ? KinkyDungeonChestsOpened[Floor] : 0;
	if (KinkyDungeonNewGame < 1) treasurecount -= alreadyOpened;
	while (chestlist.length > 0) {
		let N = Math.floor(KDRandom()*chestlist.length);
		if (count < treasurecount) {
			let chest = chestlist[N];
			KinkyDungeonMapSet(chest.x, chest.y, 'C');

			// Add a lock on the chest! For testing purposes ATM
			let lock = KinkyDungeonGenerateLock((extra && count == 0) ? true : false, Floor);
			if (count == 0 || count >= treasurecount - alreadyOpened) {
				KinkyDungeonTiles.set("" + chest.x + "," +chest.y, {Loot: "silver"});
			} else if (lock)
				KinkyDungeonTiles.set("" + chest.x + "," +chest.y, {Type: "Lock", Lock: lock, Loot: "chest"});

			count += 1;
		} else {

			let chest = chestlist[N];
			if (KDRandom() < rubblechance) KinkyDungeonMapSet(chest.x, chest.y, 'R');
			else KinkyDungeonMapSet(chest.x, chest.y, 'r');
		}
		chestlist.splice(N, 1);
	}
}


function KinkyDungeonPlaceLore(width, height) {
	let loreList = [];

	// Populate the lore
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && KDRandom() < 0.6) loreList.push({x:X, y:Y});

	while (loreList.length > 0) {
		let N = Math.floor(KDRandom()*loreList.length);
		KinkyDungeonGroundItems.push({x:loreList[N].x, y:loreList[N].y, name: "Lore"});
		return true;
	}

}


// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceShrines(shrinechance, shrineTypes, shrinecount, shrinefilter, ghostchance, Floor, width, height) {
	let shrinelist = [];
	KinkyDungeonCommercePlaced = 0;

	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.max(Math.abs(X - KinkyDungeonStartPosition.x), Math.abs(Y - KinkyDungeonStartPosition.y)) > KinkyDungeonJailLeash
				&& (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let freecount = 0;
				let freecount_diag = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							if (XX == X || YY == Y)
								freecount += 1;
							else
								freecount_diag += 1;

				if (freecount >= 4 && freecount_diag >= 1)
					shrinelist.push({x:X, y:Y});


			} else if (KinkyDungeonMapGet(X, Y) == "R" || KinkyDungeonMapGet(X, Y) == "r")
				shrinelist.push({x:X, y:Y});

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	while (shrinelist.length > 0) {
		let N = Math.floor(KDRandom()*shrinelist.length);
		if (count <= shrinecount) {

			let shrine = shrinelist[N];
			if (count == shrinecount && KDRandom() > shrinechance)
				KinkyDungeonMapSet(shrine.x, shrine.y, 'a');
			else {
				let playerTypes = KinkyDungeonRestraintTypes(shrinefilter);
				let type = shrineTypes.length == 0 ? "Orb"
					: (shrineTypes.length == 1 && playerTypes.length > 0 ?
						playerTypes[Math.floor(KDRandom() * playerTypes.length)]
						: KinkyDungeonGenerateShrine(Floor));
				let tile = 'A';
				if (shrineTypes.includes(type)) type = "";
				if (type == "Orb") {
					if (!KinkyDungeonOrbsPlaced.includes(Floor) && Floor > 0) {
						tile = 'O';
						KinkyDungeonOrbsPlaced.push(Floor);
					} else tile = 'o';
					shrineTypes.push("Orb");
				} else if (type) {
					KinkyDungeonTiles.set("" + shrine.x + "," +shrine.y, {Type: "Shrine", Name: type});
					shrineTypes.push(type);
				} else if (!shrineTypes.includes("Ghost")) {
					shrineTypes.push("Ghost");
					tile = 'G';
					KinkyDungeonTiles.set("" + shrine.x + "," +shrine.y, {Type: "Ghost"});
				} else tile = 'a';

				KinkyDungeonMapSet(shrine.x, shrine.y, tile);
			}

			count += 1;
		}

		shrinelist.splice(N, 1);
	}
}

let KinkyDungeonCommercePlaced = 0;

// @ts-ignore
// @ts-ignore
function KinkyDungeonGenerateShrine(Floor) {
	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];

	if (Params.shrines) {

		let shrineWeightTotal = 0;
		let shrineWeights = [];

		for (let L = 0; L < Params.shrines.length; L++) {
			let shrine = Params.shrines[L];
			shrineWeights.push({shrine: shrine, weight: shrineWeightTotal});
			shrineWeightTotal += shrine.Weight;
		}

		let selection = KDRandom() * shrineWeightTotal;

		for (let L = shrineWeights.length - 1; L >= 0; L--) {
			if (selection > shrineWeights[L].weight) {
				return shrineWeights[L].shrine.Type;
			}
		}
	}

	return "";
}


function KinkyDungeonPlaceSpecialTiles(gaschance, Floor, width, height) {
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			// Happy Gas
			if (KinkyDungeonMapGet(X, Y) == '0') {
				let chance = 0;
				// Check the 3x3 area
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && !KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							chance += gaschance;
					}

				if (KDRandom() < chance)
					KinkyDungeonMapSet(X, Y, ']');
			}
}

// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceBrickwork( brickchance, Floor, width, height) {
	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '0') {
				let chance = brickchance;
				// Check the 3x3 area
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && !KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							chance += 0.01;
						if (KinkyDungeonMapGet(XX, YY) == 'A')
							chance += 0.5;
						else if (KinkyDungeonMapGet(XX, YY) == 'a')
							chance += 0.25;
					}

				if (KDRandom() < chance)
					KinkyDungeonMapSet(X, Y, '2');
			}
}

// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceTraps( traps, traptypes, Floor, width, height) {
	for (let trap of traps) {
		KinkyDungeonMapSet(trap.x, trap.y, 'T');
		let t = KinkyDungeonGetTrap(traptypes, Floor, []);
		KinkyDungeonTiles.set(trap.x + "," + trap.y, {
			Type: "Trap",
			Trap: t.Name,
			Restraint: t.Restraint,
			Enemy: t.Enemy,
			Spell: t.Spell,
			Power: t.Power,
		});
	}
}

// @ts-ignore
function KinkyDungeonPlacePatrols(Count, width, height) {
	KinkyDungeonPatrolPoints = [];
	for (let i = 1; i <= Count; i++) {
		for (let L = 1000; L > 0; L -= 1) { // Try up to 1000 times
			let X = Math.floor(i * width / (Count + 1)) + Math.floor(KDRandom() * width/(Count + 1));
			let Y = Math.floor(KDRandom()*height);
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				KinkyDungeonPatrolPoints.push({x: X, y: Y});
				break;
			}
		}
	}
}


function KinkyDungeonGenerateLock(Guaranteed, Floor, AllowGold) {
	let level = (Floor) ? Floor : MiniGameKinkyDungeonLevel;
	//let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];

	let chance = (level == 0) ? 0 : KinkyDungeonBaseLockChance;
	chance += KinkyDungeonScalingLockChance * level / 10;

	if (Guaranteed) chance = 1.0;

	if (KDRandom() < chance) {
		// Now we get the amount failed by
		// Default: red lock
		let locktype = KDRandom();

		let modifiers = "";

		let BlueChance = Math.min(KinkyDungeonBlueLockChance + level * KinkyDungeonBlueLockChanceScaling, KinkyDungeonBlueLockChanceScalingMax);

		if (locktype < BlueChance) {
			let GoldChance = Math.min(KinkyDungeonGoldLockChance + level * KinkyDungeonGoldLockChanceScaling, KinkyDungeonGoldLockChanceScalingMax);
			if (AllowGold && KDRandom() < GoldChance) return "Gold" + modifiers;
			return "Blue" + modifiers;
		}
		return "Red" + modifiers;
	}

	return "";
}

function KinkyDungeonPlaceDoors(doorchance, nodoorchance, doorlockchance, trapChance, grateChance, Floor, width, height) {
	let doorlist = [];
	let doorlist_2ndpass = [];
	let trapLocations = [];

	// Populate the doors
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && KinkyDungeonMapGet(X, Y) != 'D' && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let wallcount = 0;
				let up = false;
				let down = false;
				let left = false;
				let right = false;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						let get = KinkyDungeonMapGet(XX, YY);
						if (!(XX == X && YY == Y) && (get == '1' || get == 'X' || get == 'C')) {
							wallcount += 1; // Get number of adjacent walls
							if (XX == X+1 && YY == Y && get == '1') right = true;
							else if (XX == X-1 && YY == Y && get == '1') left = true;
							else if (XX == X && YY == Y+1 && get == '1') down = true;
							else if (XX == X && YY == Y-1 && get == '1') up = true;
						} else if (get == 'D') // No adjacent doors
							wallcount = 100;
					}
				if (wallcount < 5 && ((up && down) != (left && right)) && KDRandom() > nodoorchance) { // Requirements: 4 doors and either a set in up/down or left/right but not both
					doorlist.push({x:X, y:Y});
					doorlist_2ndpass.push({x:X, y:Y});
				}
			}

	while (doorlist.length > 0) {
		let N = Math.floor(KDRandom()*doorlist.length);

		let door = doorlist[N];
		let X = door.x;
		let Y = door.y;

		let closed = KDRandom() < doorchance;
		KinkyDungeonMapSet(X, Y, (closed ? 'D' : 'd'));
		KinkyDungeonTiles.set("" + X + "," + Y, {Type: "Door"});
		if (closed && KDRandom() < doorlockchance && KinkyDungeonIsAccessible(X, Y)) {
			KinkyDungeonTiles.get("" + X + "," + Y).Lock = KinkyDungeonGenerateLock(true, Floor);
		}

		doorlist.splice(N, 1);
	}

	while (doorlist_2ndpass.length > 0) {
		let N = Math.floor(KDRandom()*doorlist_2ndpass.length);
		let minLockedRoomSize = 5;
		let maxPlayerDist = 4;

		let door = doorlist_2ndpass[N];
		let X = door.x;
		let Y = door.y;

		let roomDoors = [];
		let accessible = KinkyDungeonGetAccessibleRoom(X, Y);
		if (accessible.length > minLockedRoomSize) {
			for (let a of accessible) {
				let split = a.split(',');
				let XX = parseInt(split[0]);
				let YY = parseInt(split[1]);
				let tileType = KinkyDungeonMapGet(XX, YY);
				if ((tileType == "D" || tileType == 'd') && !KinkyDungeonTiles.get(a).Lock && XX != X && YY != Y) {
					roomDoors.push({x: XX, y: YY});
				}
			}
			let rooms = [];
			for (let ddoor of roomDoors) {
				let room = KinkyDungeonGetAccessibleRoom(X, Y);
				rooms.push({door: ddoor, room: room});
			}
			for (let room of rooms) {
				let success = room.room.length == accessible.length;
				for (let tile of accessible) {
					if (!room.room.includes(tile)) {
						success = false;
						break;
					}
				}
				if (success) {
					if (!KinkyDungeonTiles.get(room.door.x + "," + room.door.y).Lock && !KinkyDungeonTiles.get(X + "," + Y).Lock
						&& ((KinkyDungeonGetAccessibleRoom(X+1, Y).length != KinkyDungeonGetAccessibleRoom(X-1, Y).length
							&& KinkyDungeonIsReachable(X+1, Y, X, Y) && KinkyDungeonIsReachable(X-1, Y, X, Y))
						|| (KinkyDungeonGetAccessibleRoom(X, Y+1).length != KinkyDungeonGetAccessibleRoom(X, Y-1).length)
							&& KinkyDungeonIsReachable(X, Y+1, X, Y) && KinkyDungeonIsReachable(X, Y-1, X, Y))
						&& KinkyDungeonIsAccessible(X, Y)) {
						let lock = false;
						//console.log(X + "," + Y + " locked")
						if (KDRandom() < trapChance && Math.max(Math.abs(room.door.x - KinkyDungeonPlayerEntity.x), Math.abs(room.door.y - KinkyDungeonPlayerEntity.y)) > maxPlayerDist) {
							// Place a trap or something at the other door if it's far enough from the player
							trapLocations.push({x: room.door.x, y: room.door.y});
							if (KDRandom() < 0.1) {
								let dropped = {x:room.door.x, y:room.door.y, name: "Gold", amount: 1};
								KinkyDungeonGroundItems.push(dropped);
							}
							lock = true;
						} else if (((KDRandom() < grateChance && (!room.room || room.room.length > minLockedRoomSize))
								|| Math.max(Math.abs(room.door.x - KinkyDungeonPlayerEntity.x), Math.abs(room.door.y - KinkyDungeonPlayerEntity.y)) <= maxPlayerDist)
								&& room.door.y != KinkyDungeonStartPosition.y) {
							// Place a grate instead
							KinkyDungeonMapSet(room.door.x, room.door.y, 'g');
							lock = true;
						}
						if (lock) {
							KinkyDungeonTiles.get("" + X + "," + Y).Lock = KinkyDungeonGenerateLock(true, Floor);
							KinkyDungeonMapSet(X, Y, 'D');
						}
					}
					break;
				}
			}
		}
		doorlist_2ndpass.splice(N, 1);
	}
	return trapLocations;
}

function KinkyDungeonReplaceDoodads(Chance, barchance, width, height) {
	for (let X = 1; X < width-1; X += 1)
		for (let Y = 1; Y < height-1; Y += 1) {
			if (KinkyDungeonMapGet(X, Y) == '1' && KDRandom() < Chance)
				KinkyDungeonMapSet(X, Y, 'X');
			else if (KinkyDungeonMapGet(X, Y) == '1' && KDRandom() < barchance
				&& ((KinkyDungeonMapGet(X, Y-1) == '1' && KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X-1, Y) == '0' && KinkyDungeonMapGet(X+1, Y) == '0')
					|| (KinkyDungeonMapGet(X-1, Y) == '1' && KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X, Y-1) == '0' && KinkyDungeonMapGet(X, Y+1) == '0')))
				KinkyDungeonMapSet(X, Y, 'b');
		}
	for (let X = 1; X < width - 1; X += 1)
		for (let Y = 1; Y < height - 1; Y += 1) {
			let tl = KinkyDungeonMapGet(X, Y);
			let tr = KinkyDungeonMapGet(X+1, Y);
			let bl = KinkyDungeonMapGet(X, Y+1);
			let br = KinkyDungeonMapGet(X+1, Y+1);
			if (tl == '1' && br == '1' && KinkyDungeonMovableTilesEnemy.includes(tr) && KinkyDungeonMovableTilesEnemy.includes(bl))
				if (KDRandom() < 0.5) KinkyDungeonMapSet(X, Y, 'X');
				else KinkyDungeonMapSet(X+1, Y+1, 'b');
			else if (tr == '1' && bl == '1' && KinkyDungeonMovableTilesEnemy.includes(tl) && KinkyDungeonMovableTilesEnemy.includes(br))
				if (KDRandom() < 0.5) KinkyDungeonMapSet(X, Y+1, 'X');
				else KinkyDungeonMapSet(X+1, Y, 'b');
		}
}

function KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density, floodChance) {
	// Variable setup

	let Walls = {};
	let WallsList = {};
	let VisitedCells = {};

	// Initialize the first cell in our Visited Cells list

	VisitedCells[VisitedRooms[0].x + "," + VisitedRooms[0].y] = {x:VisitedRooms[0].x, y:VisitedRooms[0].y};

	// Walls are basically even/odd pairs.
	for (let X = 2; X < width; X += 2)
		for (let Y = 1; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y};
			}
	for (let X = 1; X < width; X += 2)
		for (let Y = 2; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y};
			}

	// Setup the wallslist for the first room
	KinkyDungeonMazeWalls(VisitedRooms[0], Walls, WallsList);

	// Per a randomized primm algorithm from Wikipedia, we loop through the list of walls until there are no more walls

	let WallKeys = Object.keys(WallsList);
	//let CellKeys = Object.keys(VisitedCells);

	while (WallKeys.length > 0) {
		let I = Math.floor(KDRandom() * WallKeys.length);
		let wall = Walls[WallKeys[I]];
		let unvisitedCell = null;

		// Check if wall is horizontal or vertical and determine if there is a single unvisited cell on the other side of the wall
		if (wall.x % 2 == 0) { //horizontal wall
			if (!VisitedCells[(wall.x-1) + "," + wall.y]) unvisitedCell = {x:wall.x-1, y:wall.y};
			if (!VisitedCells[(wall.x+1) + "," + wall.y]) {
				if (unvisitedCell) unvisitedCell = null;
				else unvisitedCell = {x:wall.x+1, y:wall.y};
			}
		} else { //vertical wall
			if (!VisitedCells[wall.x + "," + (wall.y-1)]) unvisitedCell = {x:wall.x, y:wall.y-1};
			if (!VisitedCells[wall.x + "," + (wall.y+1)]) {
				if (unvisitedCell) unvisitedCell = null;
				else unvisitedCell = {x:wall.x, y:wall.y+1};
			}
		}

		// We only add a new cell if only one of the cells is unvisited
		if (unvisitedCell) {
			delete Walls[wall.x + "," + wall.y];

			KinkyDungeonMapSet(wall.x, wall.y, '0');
			KinkyDungeonMapSet(unvisitedCell.x, unvisitedCell.y, '0');
			VisitedCells[unvisitedCell.x + "," + unvisitedCell.y] = unvisitedCell;

			KinkyDungeonMazeWalls(unvisitedCell, Walls, WallsList);
		}

		// Either way we remove this wall from consideration
		delete WallsList[wall.x + "," + wall.y];

		// Chance of spawning a room!
		if (KDRandom() < 0.1 - 0.015*density) {
			let size = 1+Math.ceil(KDRandom() * (openness));

			let tile = '0';
			if (floodChance > 0 && KDRandom() < floodChance) tile = 'w';

			// We open up the tiles
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					if (!KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(XX, YY)))
						KinkyDungeonMapSet(XX, YY, tile);
					VisitedCells[XX + "," + YY] = {x:XX, y:YY};
					KinkyDungeonMazeWalls({x:XX, y:YY}, Walls, WallsList);
					delete Walls[XX + "," + YY];
				}

			// We also remove all walls inside the room from consideration!
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					delete WallsList[XX + "," + YY];
				}
		}

		// Update keys

		WallKeys = Object.keys(WallsList);
		//CellKeys = Object.keys(VisitedCells);
	}
}

function KinkyDungeonMazeWalls(Cell, Walls, WallsList) {
	if (Walls[(Cell.x+1) + "," + Cell.y]) WallsList[(Cell.x+1) + "," + Cell.y] = {x:Cell.x+1, y:Cell.y};
	if (Walls[(Cell.x-1) + "," + Cell.y]) WallsList[(Cell.x-1) + "," + Cell.y] = {x:Cell.x-1, y:Cell.y};
	if (Walls[Cell.x + "," + (Cell.y+1)]) WallsList[Cell.x + "," + (Cell.y+1)] = {x:Cell.x, y:Cell.y+1};
	if (Walls[Cell.x + "," + (Cell.y-1)]) WallsList[Cell.x + "," + (Cell.y-1)] = {x:Cell.x, y:Cell.y-1};
}

function KinkyDungeonMapSet(X, Y, SetTo, VisitedRooms) {
	let height = KinkyDungeonGridHeight;
	let width = KinkyDungeonGridWidth;

	if (X > 0 && X < width-1 && Y > 0 && Y < height-1) {
		KinkyDungeonGrid = KinkyDungeonGrid.replaceAt(X + Y*(width+1), SetTo);
		if (VisitedRooms)
			VisitedRooms.push({x: X, y: Y});
		return true;
	}
	return false;
}

function KinkyDungeonMapGet(X, Y) {
	//let height = KinkyDungeonGrid.split('\n').length;
	//let width = //KinkyDungeonGrid.split('\n')[0].length;

	return KinkyDungeonGrid[X + Y*(KinkyDungeonGridWidth+1)];
}

function KinkyDungeonLightSet(X, Y, SetTo) {
	if (X >= 0 && X <= KinkyDungeonGridWidth-1 && Y >= 0 && Y <= KinkyDungeonGridHeight-1) {
		KinkyDungeonLightGrid[X + Y*(KinkyDungeonGridWidth)] = SetTo;
		return true;
	}
	return false;
}

function KinkyDungeonLightGet(X, Y) {
	return KinkyDungeonLightGrid[X + Y*(KinkyDungeonGridWidth)];
}
function KinkyDungeonFogGet(X, Y) {
	return KinkyDungeonFogGrid[X + Y*(KinkyDungeonGridWidth)];
}

const canvasOffsetX = 500;
const canvasOffsetY = 164;

// returns an object containing coordinates of which direction the player will move after a click, plus a time multiplier
function KinkyDungeonGetDirection(dx, dy) {

	let X = 0;
	let Y = 0;

	if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)
		return {x:0, y:0, delta:1};

	// Cardinal directions first - up down left right
	if (dy > 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = 1;
	else if (dy < 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = -1;
	else if (dx > 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = 1;
	else if (dx < 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = -1;

	// Diagonals
	else if (dy > 0 && dx > dy/2.61312593) {Y = 1; X = 1;}
	else if (dy > 0 && -dx > dy/2.61312593) {Y = 1; X = -1;}
	else if (dy < 0 && dx > -dy/2.61312593) {Y = -1; X = 1;}
	else if (dy < 0 && -dx > -dy/2.61312593) {Y = -1; X = -1;}

	return {x:X, y:Y, delta:Math.round(Math.sqrt(X*X+Y*Y)*2)/2}; // Delta is always in increments of 0.5
}

// GetDirection, but it also pivots randomly 45 degrees to either side
function KinkyDungeonGetDirectionRandom(dx, dy) {
	let dir = KinkyDungeonGetDirection(dx, dy);
	let pivot = Math.floor(KDRandom()*3)-1;

	if (dir.x == 0 && dir.y == 1) dir.x = pivot;
	else if (dir.x == 0 && dir.y == -1) dir.x = -pivot;
	else if (dir.x == 1 && dir.y == 0) dir.y = pivot;
	else if (dir.x == -1 && dir.y == 0) dir.y = -pivot;
	else if (dir.x == 1 && dir.y == 1) {if (pivot == 1) {dir.y = 0;} else if (pivot == -1) {dir.x = 0;}}
	else if (dir.x == 1 && dir.y == -1) {if (pivot == 1) {dir.x = 0;} else if (pivot == -1) {dir.y = 0;}}
	else if (dir.x == -1 && dir.y == 1) {if (pivot == 1) {dir.x = 0;} else if (pivot == -1) {dir.y = 0;}}
	else if (dir.x == -1 && dir.y == -1) {if (pivot == 1) {dir.y = 0;} else if (pivot == -1) {dir.x = 0;}}

	dir.delta = Math.round(Math.sqrt(dir.x*dir.x+dir.y*dir.y)*2)/2;
	return dir; // Delta is always in increments of 0.5
}


let KinkyDungeonAutoWaitSuppress = false;

// Click function for the game portion
// @ts-ignore
// @ts-ignore
function KinkyDungeonClickGame(Level) {
	// First we handle buttons
	if (KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KDGameData.SleepTurns < 1 && KinkyDungeonHandleHUD()) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
		KinkyDungeonGameKey.keyPressed = [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
		];
		if (KinkyDungeonAutoWaitSuppress) KinkyDungeonAutoWaitSuppress = false;
		else if (KinkyDungeonAutoWait) {
			KinkyDungeonAutoWait = false;
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
		}
		return;
	}
	// beep
	else if (KinkyDungeonAutoWait && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
		KinkyDungeonAutoWait = false;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
	}
	// If no buttons are clicked then we handle move
	else if (KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KDGameData.SleepTurns < 1) {
		KinkyDungeonSetMoveDirection();

		if (KinkyDungeonTargetingSpell) {
			if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
				if (KinkyDungeoCheckComponents(KinkyDungeonTargetingSpell).length == 0) {
					if (KinkyDungeonSpellValid) {
						if (KinkyDungeonCastSpell(KinkyDungeonTargetX, KinkyDungeonTargetY, KinkyDungeonTargetingSpell, undefined, KinkyDungeonPlayerEntity) && KinkyDungeonTargetingSpell.sfx) {
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonTargetingSpell.sfx + ".ogg");
						}
						KinkyDungeonAdvanceTime(1);
						KinkyDungeonInterruptSleep();
						KinkyDungeonTargetingSpell = null;
					}
				} else KinkyDungeonTargetingSpell = null;
			} else KinkyDungeonTargetingSpell = null;
		} else if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
			if (KinkyDungeonFastMove && Math.max(Math.abs(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)) > 1
				&& (KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0 || KinkyDungeonFogGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0 || KDistChebyshev(KinkyDungeonPlayerEntity.x - KinkyDungeonTargetX, KinkyDungeonPlayerEntity.y - KinkyDungeonTargetY) < 1.5)) {
				let requireLight = KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0;
				let path = KinkyDungeonFindPath(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonTargetX, KinkyDungeonTargetY, false, false, false, KinkyDungeonMovableTilesEnemy, requireLight, !requireLight);
				if (path) {
					KinkyDungeonFastMovePath = path;
					KinkyDungeonSleepTime = 100;
				}
			} else if (!KinkyDungeonFastMove || Math.max(Math.abs(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)) <= 1) {
				KinkyDungeonMove(KinkyDungeonMoveDirection, 1, true);
			}
		}
	}
}

function KinkyDungeonListenKeyMove() {
	if (KinkyDungeonLastMoveTimer < performance.now() && KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KDGameData.SleepTurns < 1) {
		let moveDirection = null;
		let moveDirectionDiag = null;

		if ((KinkyDungeonGameKey.keyPressed[0]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x,  KinkyDungeonPlayerEntity.y - 1))) moveDirection = KinkyDungeonGetDirection(0, -1);
		else if ((KinkyDungeonGameKey.keyPressed[1]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x,  KinkyDungeonPlayerEntity.y + 1))) moveDirection = KinkyDungeonGetDirection(0, 1);
		else if ((KinkyDungeonGameKey.keyPressed[2]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x - 1,  KinkyDungeonPlayerEntity.y))) moveDirection = KinkyDungeonGetDirection(-1, 0);
		else if ((KinkyDungeonGameKey.keyPressed[3]) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x + 1,  KinkyDungeonPlayerEntity.y))) moveDirection = KinkyDungeonGetDirection(1, 0);
		// Diagonal moves
		if ((KinkyDungeonGameKey.keyPressed[4]) || (KinkyDungeonGameKey.keyPressed[2] && KinkyDungeonGameKey.keyPressed[0])) moveDirectionDiag = KinkyDungeonGetDirection(-1, -1);
		else if ((KinkyDungeonGameKey.keyPressed[5]) || (KinkyDungeonGameKey.keyPressed[3] && KinkyDungeonGameKey.keyPressed[0])) moveDirectionDiag = KinkyDungeonGetDirection(1, -1);
		else if ((KinkyDungeonGameKey.keyPressed[6]) || (KinkyDungeonGameKey.keyPressed[2] && KinkyDungeonGameKey.keyPressed[1])) moveDirectionDiag = KinkyDungeonGetDirection(-1, 1);
		else if ((KinkyDungeonGameKey.keyPressed[7]) || (KinkyDungeonGameKey.keyPressed[3] && KinkyDungeonGameKey.keyPressed[1])) moveDirectionDiag = KinkyDungeonGetDirection(1, 1);

		if ((KinkyDungeonGameKey.keyPressed[8])) {moveDirection = KinkyDungeonGetDirection(0, 0); moveDirectionDiag = null;}

		if (moveDirectionDiag && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(moveDirectionDiag.x + KinkyDungeonPlayerEntity.x,  moveDirectionDiag.y + KinkyDungeonPlayerEntity.y))) {
			moveDirection = moveDirectionDiag;
		}

		if (moveDirection) {
			if (KinkyDungeonLastMoveTimerStart < performance.now() && KinkyDungeonLastMoveTimerStart > 0) {
				KinkyDungeonMove(moveDirection, 1, KinkyDungeonLastMoveTimer == 0);
				KinkyDungeonLastMoveTimer = performance.now() + KinkyDungeonLastMoveTimerCooldown;
			} else if (KinkyDungeonLastMoveTimerStart == 0) {
				KinkyDungeonLastMoveTimerStart = performance.now()+ KinkyDungeonLastMoveTimerCooldownStart;
			}


		}
	}
	if (KinkyDungeonLastMoveTimerStart < performance.now() && KinkyDungeonLastMoveTimer == 0) KinkyDungeonLastMoveTimerStart = 0;
	if (!KinkyDungeonGameKey.keyPressed.some((element)=>{return element;})) { KinkyDungeonLastMoveTimer = 0; KinkyDungeonDoorCloseTimer = 0;}
}

function KinkyDungeonGameKeyDown() {
	let moveDirection = null;



	/*
	// Cardinal moves
	if ((KeyPress == KinkyDungeonKey[0])) moveDirection = KinkyDungeonGetDirection(0, -1);
	else if ((KeyPress == KinkyDungeonKey[1])) moveDirection = KinkyDungeonGetDirection(-1, 0);
	else if ((KeyPress == KinkyDungeonKey[2])) moveDirection = KinkyDungeonGetDirection(0, 1);
	else if ((KeyPress == KinkyDungeonKey[3])) moveDirection = KinkyDungeonGetDirection(1, 0);
	// Diagonal moves
	else if ((KeyPress == KinkyDungeonKey[4])) moveDirection = KinkyDungeonGetDirection(-1, -1);
	else if ((KeyPress == KinkyDungeonKey[5])) moveDirection = KinkyDungeonGetDirection(1, -1);
	else if ((KeyPress == KinkyDungeonKey[6])) moveDirection = KinkyDungeonGetDirection(-1, 1);
	else if ((KeyPress == KinkyDungeonKey[7])) moveDirection = KinkyDungeonGetDirection(1, 1);

	else if (KinkyDungeonKeyWait.includes(KeyPress)) moveDirection = KinkyDungeonGetDirection(0, 0);
	*/

	/*
	if ((KeyPress == KinkyDungeonKey[0]) || (KeyPress == KinkyDungeonKeyLower[0]) || (KeyPress == KinkyDungeonKeyNumpad[0])) moveDirection = KinkyDungeonGetDirection(0, -1);
	else if ((KeyPress == KinkyDungeonKey[1]) || (KeyPress == KinkyDungeonKeyLower[1]) || (KeyPress == KinkyDungeonKeyNumpad[1])) moveDirection = KinkyDungeonGetDirection(-1, 0);
	else if ((KeyPress == KinkyDungeonKey[2]) || (KeyPress == KinkyDungeonKeyLower[2]) || (KeyPress == KinkyDungeonKeyNumpad[2])) moveDirection = KinkyDungeonGetDirection(0, 1);
	else if ((KeyPress == KinkyDungeonKey[3]) || (KeyPress == KinkyDungeonKeyLower[3]) || (KeyPress == KinkyDungeonKeyNumpad[3])) moveDirection = KinkyDungeonGetDirection(1, 0);
	// Diagonal moves
	else if ((KeyPress == KinkyDungeonKey[4]) || (KeyPress == KinkyDungeonKeyLower[4]) || (KeyPress == KinkyDungeonKeyNumpad[4])) moveDirection = KinkyDungeonGetDirection(-1, -1);
	else if ((KeyPress == KinkyDungeonKey[5]) || (KeyPress == KinkyDungeonKeyLower[5]) || (KeyPress == KinkyDungeonKeyNumpad[5])) moveDirection = KinkyDungeonGetDirection(1, -1);
	else if ((KeyPress == KinkyDungeonKey[6]) || (KeyPress == KinkyDungeonKeyLower[6]) || (KeyPress == KinkyDungeonKeyNumpad[6])) moveDirection = KinkyDungeonGetDirection(-1, 1);
	else if ((KeyPress == KinkyDungeonKey[7]) || (KeyPress == KinkyDungeonKeyLower[7]) || (KeyPress == KinkyDungeonKeyNumpad[7])) moveDirection = KinkyDungeonGetDirection(1, 1);
	*/

	if (moveDirection) {
		KinkyDungeonMove(moveDirection, 1);
	// @ts-ignore
	} else if (KinkyDungeonKeySpell.includes(KinkyDungeonKeybindingCurrentKey)) {
		// @ts-ignore
		KinkyDungeonSpellPress = KinkyDungeonKeybindingCurrentKey;
		KinkyDungeonHandleSpell();
	}
}

function KinkyDungeonSendTextMessage(priority, text, color, time, noPush, noDupe) {
	if (text) {
		if (!noPush)
			if (!noDupe || KinkyDungeonMessageLog.length == 0 || !KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1] || text != KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1].text)
				KinkyDungeonMessageLog.push({text: text, color: color});
		if ( priority >= KinkyDungeonTextMessagePriority || KinkyDungeonActionMessageTime < 0.5) {
			KinkyDungeonTextMessageTime = time;
			KinkyDungeonTextMessage = text;
			KinkyDungeonTextMessageColor = color;
			KinkyDungeonTextMessagePriority = priority;
			return true;
		}
	}
	return false;
}


function KinkyDungeonSendActionMessage(priority, text, color, time, noPush, noDupe) {
	if (text) {
		if (!noPush)
			if (!noDupe || KinkyDungeonMessageLog.length == 0 || !KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1] || text != KinkyDungeonMessageLog[KinkyDungeonMessageLog.length-1].text)
				KinkyDungeonMessageLog.push({text: text, color: color});
		if ( priority >= KinkyDungeonActionMessagePriority || KinkyDungeonActionMessageTime < 0.5) {
			KinkyDungeonActionMessageTime = time;
			KinkyDungeonActionMessage = text;
			KinkyDungeonActionMessageColor = color;
			KinkyDungeonActionMessagePriority = priority;
			return true;
		}
	}
	return false;
}

let KinkyDungeonNoMoveFlag = false;
let KinkyDungeonConfirmAttack = false;

function KinkyDungeonMove(moveDirection, delta, AllowInteract) {
	let moveX = moveDirection.x + KinkyDungeonPlayerEntity.x;
	let moveY = moveDirection.y + KinkyDungeonPlayerEntity.y;
	let moved = false;
	let Enemy = KinkyDungeonEnemyAt(moveX, moveY);
	if (Enemy && (!Enemy.Enemy || !Enemy.Enemy.noblockplayer)) {
		if (AllowInteract) {
			let attackCost = KinkyDungeonStatStaminaCostAttack;
			if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.staminacost) attackCost = -KinkyDungeonPlayerDamage.staminacost;
			if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackStamina")) {
				attackCost = Math.min(0, attackCost * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackStamina")));
			}
			let noadvance = false;
			if (KinkyDungeonHasStamina(Math.abs(attackCost), true)) {
				if (!KinkyDungeonConfirmAttack && (!KinkyDungeonJailTransgressed || Enemy.Enemy.allied)) {
					KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonConfirmAttack"), "red", 1);
					KinkyDungeonConfirmAttack = true;
					noadvance = true;
				} else {
					KinkyDungeonAttackEnemy(Enemy, {damage: KinkyDungeonPlayerDamage.dmg, type: KinkyDungeonPlayerDamage.type});
					KinkyDungeonLastAction = "Attack";
					KinkyDungeonConfirmAttack = false;

					KinkyDungeonChangeStamina(attackCost);
				}
			} else {
				KinkyDungeonWaitMessage();
			}

			if (!noadvance) {
				KinkyDungeonInterruptSleep();
				KinkyDungeonAdvanceTime(1);
			}
		}
	} else {
		if (moveDirection.x == 0 && moveDirection.y == 0) KinkyDungeonDoorCloseTimer = 0; // Allow manually waiting to turn around and be able to slam a door
		else if (KinkyDungeonLastMoveDirection && !(KinkyDungeonLastMoveDirection.x == 0 && KinkyDungeonLastMoveDirection.y == 0) && (Math.abs(KinkyDungeonLastMoveDirection.x - moveDirection.x) + Math.abs(KinkyDungeonLastMoveDirection.y - moveDirection.y)) <= 1) {
			KinkyDungeonDoorCloseTimer = Math.max(KinkyDungeonDoorCloseTimer, 1); // if you are running in the same direction you cant close the door without turning around. this also helps speed up the game
		}

		let moveObject = KinkyDungeonMapGet(moveX, moveY);
		if (KinkyDungeonMovableTiles.includes(moveObject) && (KinkyDungeonNoEnemy(moveX, moveY) || (Enemy.Enemy && Enemy.Enemy.noblockplayer))) { // If the player can move to an empy space or a door

			KinkyDungeonConfirmAttack = false;

			if (!KinkyDungeonToggleAutoDoor) KinkyDungeonDoorCloseTimer = 1;
			if (KinkyDungeonTiles.get("" + moveX + "," + moveY) && KinkyDungeonTiles.get("" + moveX + "," + moveY).Type && ((moveObject == 'd' && KinkyDungeonTargetTile == null && KinkyDungeonNoEnemy(moveX, moveY, true) && KinkyDungeonDoorCloseTimer <= 0)
				|| (KinkyDungeonTiles.get("" + moveX + "," + moveY).Type != "Trap" && (KinkyDungeonTiles.get("" + moveX + "," + moveY).Type != "Door" || (KinkyDungeonTiles.get("" + moveX + "," + moveY).Lock && KinkyDungeonTiles.get("" + moveX + "," + moveY).Type == "Door"))))) {
				if (AllowInteract) {
					KinkyDungeonTargetTileLocation = "" + moveX + "," + moveY;
					KinkyDungeonTargetTile = KinkyDungeonTiles.get(KinkyDungeonTargetTileLocation);
					KinkyDungeonTargetTileMsg();
					KinkyDungeonDoorCloseTimer = 2; // To avoid cases with severe annoyance while walking through halls with lots of doors
				}
			} else if (moveX != KinkyDungeonPlayerEntity.x || moveY != KinkyDungeonPlayerEntity.y) {
				let newDelta = 1;
				if (KinkyDungeonDoorCloseTimer > 0) KinkyDungeonDoorCloseTimer -= 1;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
				if (moveObject == 'D') { // Open the door
					KinkyDungeonMapSet(moveX, moveY, 'd');
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorOpen.ogg");
					KinkyDungeonDoorCloseTimer = 1;
				} else if (moveObject == 'C') { // Open the chest
					let chestType = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Loot ? KinkyDungeonTiles.get(moveX + "," +moveY).Loot : "chest";
					KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType);
					if (chestType == "chest") KinkyDungeonAddChest(1, MiniGameKinkyDungeonLevel);
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/ChestOpen.ogg");
					KinkyDungeonMapSet(moveX, moveY, 'c');
				} else if (moveObject == 'O') { // Open the chest
					KinkyDungeonTakeOrb(1, moveX, moveY); // 1 spell point
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
				} else {// Move
					KinkyDungeonNoMoveFlag = false;
					KinkyDungeonSendEvent("beforeMove", {x:moveX, y:moveY});
					if (!KinkyDungeonNoMoveFlag) {
						//if (KinkyDungeonHasStamina(0)) { // You can only move if your stamina is > 0
						KinkyDungeonMovePoints = Math.min(Math.ceil(KinkyDungeonSlowLevel + 1), KinkyDungeonMovePoints + delta); // Can't store extra move points

						if (KinkyDungeonStatBind) KinkyDungeonMovePoints = 0;

						if (KinkyDungeonMovePoints >= 1) {// Math.max(1, KinkyDungeonSlowLevel) // You need more move points than your slow level, unless your slow level is 1
							newDelta = Math.max(newDelta, KinkyDungeonMoveTo(moveX, moveY));
							KinkyDungeonLastAction = "Move";
							moved = true;
							if (KinkyDungeonSound) {
								if (moveObject == 'w')
									AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/FootstepWater.ogg");
								else AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Footstep.ogg");
							}

							if (moveObject == 'g') {
								KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonGrateEnter"), "white", 3);
								KinkyDungeonSlowMoveTurns = Math.max(KinkyDungeonSlowMoveTurns, 1);
								KDGameData.SleepTurns = CommonTime() + 250;
							}
						}

						// Messages to inform player they are slowed
						let plugLevel = Math.round(Math.min(3, KinkyDungeonStatPlugLevel));
						let dict = KinkyDungeonPlugCount > 1 ? "plugs" : "plug";
						let dicts = KinkyDungeonPlugCount > 1 ? "" : "s";
						if (KinkyDungeonSlowLevel == 0 && KinkyDungeonPlugCount > 0) KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonPlugWalk" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "yellow", 2, true);
						if (KinkyDungeonSlowLevel == 1) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonSlowed" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "yellow", 2, true);
						else if (KinkyDungeonSlowLevel == 2) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHopping" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "orange", 2, true);
						else if (KinkyDungeonSlowLevel == 3) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonInching" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);
						else if (KinkyDungeonSlowLevel > 3 && KinkyDungeonSlowLevel < 10) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrawling" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);
						else if (KinkyDungeonSlowLevel >= 10) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCantMove" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);

						let moveMult = Math.max(1, KinkyDungeonSlowLevel);
						if (KinkyDungeonSlowLevel > 9) moveMult = 1;
						if ((moveDirection.x != 0 || moveDirection.y != 0)) {
							if (KinkyDungeonSlowLevel > 0) {
								KinkyDungeonChangeStamina(moveMult * (KinkyDungeonStatStaminaRegenPerSlowLevel * KinkyDungeonSlowLevel) * delta);
								KinkyDungeonStatWillpowerExhaustion = Math.max(1, KinkyDungeonStatWillpowerExhaustion);
							}
							KinkyDungeonStatArousal += (KinkyDungeonStatPlugLevel * KinkyDungeonArousalPerPlug * moveMult);
							if (KinkyDungeonHasCrotchRope) {
								if (KinkyDungeonStatPlugLevel == 0) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrotchRope"), "pink", 2);
								KinkyDungeonStatArousal += (KinkyDungeonCrotchRopeArousal * moveMult);
							}
							if (KinkyDungeonVibeLevel == 0 && KinkyDungeonStatPlugLevel > 0 && !KinkyDungeonHasCrotchRope) KinkyDungeonStatArousal -= KinkyDungeonStatArousalRegen;
						} else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
							KinkyDungeonMovePoints = 0;
							KinkyDungeonWaitMessage();
						}

						if (moveObject == 'R') {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
							KinkyDungeonLoot(MiniGameKinkyDungeonLevel, MiniGameKinkyDungeonCheckpoint, "rubble");

							KinkyDungeonMapSet(moveX, moveY, 'r');
						}
						KinkyDungeonTrapMoved = true;
						//}
					}

				}
				KinkyDungeonInterruptSleep();
				//for (let d = 0; d < newDelta; d++)
				// KinkyDungeonAdvanceTime(1, false, d != 0); // was moveDirection.delta, but became too confusing
				if (newDelta > 1 && newDelta < 10) {
					KinkyDungeonSlowMoveTurns = newDelta -1;
					KinkyDungeonSleepTime = CommonTime() + 200;
				}
				KinkyDungeonAdvanceTime(1);
			} else {
				KinkyDungeonWaitMessage();
				KinkyDungeonAdvanceTime(1); // was moveDirection.delta, but became too confusing
			}
		} else { // If we are blind we can bump into walls!
			if (KinkyDungeonGetVisionRadius() <= 1) {
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Footstep.ogg");
				KinkyDungeonInterruptSleep();
				KinkyDungeonAdvanceTime(1);
			}
		}
	}

	KinkyDungeonLastMoveDirection = moveDirection;

	return moved;
}

function KinkyDungeonWaitMessage(NoTime) {
	if (!KinkyDungeonAutoWait) {
		if (KinkyDungeonStatWillpowerExhaustion > 1) KinkyDungeonSendActionMessage(3, TextGet("WaitSpellExhaustion"), "orange", 2);
		else if (!KinkyDungeonHasStamina(5, false)) KinkyDungeonSendActionMessage(1, TextGet("WaitExhaustion"
			+ (KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.33 ?
				((KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.67 ?
					"ArousedHeavy"
					: "Aroused"))
					: "")), "yellow", 2);
		else KinkyDungeonSendActionMessage(1, TextGet("Wait" + (KinkyDungeonStatArousal > 12 ? "Aroused" : "")), "silver", 2);
	}

	if (!NoTime && KinkyDungeonStatStamina < KinkyDungeoNStatStaminaLow)
		KinkyDungeonStatStamina += KinkyDungeonStatStaminaRegenWait;
}

// Returns th number of turns that must elapse
function KinkyDungeonMoveTo(moveX, moveY) {
	//if (KinkyDungeonNoEnemy(moveX, moveY, true)) {
	KinkyDungeonPlayerEntity.x = moveX;
	KinkyDungeonPlayerEntity.y = moveY;

	KinkyDungeonMovePoints = 0;
	return Math.max(1, KinkyDungeonSlowLevel);
	//}
	//return 0;
}

let KinkyDungeonLastAction = "";
let KinkyDungeonLastTurnAction = "";
let KDDrawUpdate = 0;
let KDVisionUpdate = 0;

function KinkyDungeonAdvanceTime(delta, NoUpdate, NoMsgTick) {
	let start = performance.now();

	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.lock == "Gold" && (MiniGameKinkyDungeonLevel >= inv.lockTimer || !inv.lockTimer)) {
			KinkyDungeonLock(inv, "Blue");
			KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonGoldLockRemove"), "yellow", 2);
		}
	}

	if (KinkyDungeonMovePoints < -1 && KDGameData.KinkyDungeonLeashedPlayer < 1) KinkyDungeonMovePoints += delta;
	if (delta > 0) {
		KDDrawUpdate = delta;
		KDVisionUpdate = delta;
	}
	KDRecentRepIndex = 0;
	KinkyDungeonRestraintAdded = false;
	KinkyDungeonSFX = [];
	KDPlayerHitBy = [];

	//if (KinkyDungeonMovePoints < 0 && KinkyDungeonStatBind < 1) KinkyDungeonMovePoints = 0;
	KinkyDungeonUpdatePenance(delta);

	KinkyDungeonUpdateTether(true, KinkyDungeonPlayerEntity);

	KinkyDungeonResetEventVariablesTick(delta);
	KinkyDungeonSendEvent("tick", {delta: delta});

	if (delta >= 1) {
		KinkyDungeonHandleTraps(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonTrapMoved);
	}

	KinkyDungeonHandleVibrators();
	// Here we move enemies and such
	KinkyDungeonUpdateLightGrid = true;
	if (!NoMsgTick) {
		if (KinkyDungeonTextMessageTime > 0) KinkyDungeonTextMessageTime -= 1;
		if (KinkyDungeonTextMessageTime <= 0) KinkyDungeonTextMessagePriority = 0;
		if (KinkyDungeonActionMessageTime > 0) KinkyDungeonActionMessageTime -= 1;
		if (KinkyDungeonActionMessageTime <= 0) KinkyDungeonActionMessagePriority = 0;
	}

	// Updates the character's stats
	KinkyDungeonCurrentTick += 1;
	if (KinkyDungeonCurrentTick > 100000) KinkyDungeonCurrentTick = 0;
	KinkyDungeonItemCheck(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, MiniGameKinkyDungeonLevel); //console.log("Item Check " + (performance.now() - now));
	KinkyDungeonUpdateBuffs(delta);
	KinkyDungeonUpdateBulletsCollisions(delta); //console.log("Bullet Check " + (performance.now() - now));
	KinkyDungeonUpdateEnemies(delta); //console.log("Enemy Check " + (performance.now() - now));
	KinkyDungeonUpdateBullets(delta); //console.log("Bullets Check " + (performance.now() - now));
	KinkyDungeonUpdateBulletsCollisions(delta, true); //"catchup" phase for explosions!

	KinkyDungeonUpdateTileEffects(delta);

	KinkyDungeonUpdateStats(delta);

	let toTile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (toTile == 's' || toTile == 'H') { // Go down the next stairs
		if (!KinkyDungeonJailGuard() || (KDistEuclidean(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y) > KinkyDungeonTetherLength() + 2 && KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
			if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
				KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
				DialogSetReputation("Gaming", KinkyDungeonRep);
			}

			MiniGameKinkyDungeonLevel += 1;
			if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
				MiniGameKinkyDungeonLevel = 1;
				KinkyDungeonState = "End";
				MiniGameVictory = true;
			}

			let currCheckpoint = MiniGameKinkyDungeonCheckpoint;
			if (toTile == 's') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(undefined, true);
			} else if (toTile == 'H') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDownShortcut"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonShortcut, true);
			}
			// Reduce security level when entering a new area
			if (MiniGameKinkyDungeonCheckpoint != currCheckpoint)
				KinkyDungeonChangeRep("Prisoner", -5);
			else // Otherwise it's just a little bit
				KinkyDungeonChangeRep("Prisoner", -1);

			if (KinkyDungeonState != "End")
				KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel);
		} else {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDownFail"), "#ffffff", 1);
		}
	}
	// else if (KinkyDungeonStatWillpower == 0) {
	// KinkyDungeonState = "Lose";
	//}

	if (!NoUpdate)
		KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);

	if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.5) {
		let msg = "KinkyDungeonStaminaWarningMed";
		if (KinkyDungeonStatStamina < 12) msg = "KinkyDungeonStaminaWarningLow";
		if (KinkyDungeonStatStamina < 4) msg = "KinkyDungeonStaminaWarningNone";
		if (!KinkyDungeonSendActionMessage(1, TextGet(msg), "#ff8800", 1, true))
			KinkyDungeonSendTextMessage(1, TextGet(msg), "#ff8800", 1, true);
	}
	let gagchance = KinkyDungeonGagMumbleChance;
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint)
			gagchance += KinkyDungeonGagMumbleChancePerRestraint;
	}
	if (!KinkyDungeonCanTalk() && KDRandom() < gagchance) {
		let msg = "KinkyDungeonGagMumble";
		let gagMsg = Math.floor(KDRandom() * 5);
		const GagEffect = -2 + SpeechGetGagLevel(KinkyDungeonPlayer, ["ItemMouth", "ItemMouth2", "ItemMouth3"]);
		gagMsg += GagEffect/3;
		gagMsg = Math.max(0, Math.min(7, Math.floor(gagMsg)));

		if (KDRandom() < KinkyDungeonStatArousal / KinkyDungeonStatArousalMax) msg = "KinkyDungeonGagMumbleAroused";

		msg = msg + gagMsg;

		if (!KinkyDungeonSendActionMessage(1, TextGet(msg), "#ffffff", 1, true))
			KinkyDungeonSendTextMessage(1, TextGet(msg), "#ffffff", 1, true);
	}
	let end = performance.now();
	if (KDDebug) console.log(`Tick ${KinkyDungeonCurrentTick} took ${(end - start)} milliseconds.`);

	KinkyDungeonLastTurnAction = KinkyDungeonLastAction;
	KinkyDungeonLastAction = "";
	if (KDGameData.AncientEnergyLevel > 1) KDGameData.AncientEnergyLevel = 1;
}


function KinkyDungeonTargetTileMsg() {
	if (KinkyDungeonTargetTile.Type == "Ghost") {
		KinkyDungeonGhostMessage();
	} else if (KinkyDungeonTargetTile.Lock) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Locked.ogg");
		KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonObjectLock").replace("TYPE", TextGet("KinkyDungeonShrine" + KinkyDungeonTargetTile.Name)), "white", 1, false, true);
	} else {
		let suff = "";
		if (KinkyDungeonTargetTile.Name == "Commerce") suff = "Commerce";
		KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonObject" + KinkyDungeonTargetTile.Type + suff).replace("TYPE", TextGet("KinkyDungeonShrine" + KinkyDungeonTargetTile.Name)), "white", 1);
	}
}
