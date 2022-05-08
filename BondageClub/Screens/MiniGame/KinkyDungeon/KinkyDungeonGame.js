"use strict";

let KinkyDungeonGagMumbleChance = 0.02;
let KinkyDungeonGagMumbleChancePerRestraint = 0.0025;

let MiniGameKinkyDungeonCheckpoint = 0;
let MiniGameKinkyDungeonShortcut = 0;
let MiniGameKinkyDungeonMainPath = 0;
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
let KinkyDungeonGridWidthDisplay = 2000/KinkyDungeonGridSizeDisplay;//17;
let KinkyDungeonGridHeightDisplay = 1000/KinkyDungeonGridSizeDisplay;//9;

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

/** @type {entity[]} */
let KinkyDungeonEntities = [];
let KinkyDungeonTerrain = [];

let KinkyDungeonMapBrightness = 5;

let KinkyDungeonGroundTiles = "023w][L";
let KinkyDungeonMovableTilesEnemy = KinkyDungeonGroundTiles + "HBSsRrdTg"; // Objects which can be moved into: floors, debris, open doors, staircases
let KinkyDungeonMovableTilesSmartEnemy = "D" + KinkyDungeonMovableTilesEnemy; //Smart enemies can open doors as well
let KinkyDungeonMovableTiles = "OCAGY+=" + KinkyDungeonMovableTilesSmartEnemy; // Player can open chests, orbs, shrines, chargers
let KinkyDungeonTransparentObjects = KinkyDungeonMovableTiles.replace("D", "").replace("g", "").replace("Y", "") + "OoAaCcBb+=-"; // Light does not pass thru doors or grates or shelves
let KinkyDungeonTransparentMovableObjects = KinkyDungeonMovableTiles.replace("D", "").replace("g", ""); // Light does not pass thru doors or grates

/**
 * Cost growth, overrides the default amount
//@type {Map<string, {x: number, y: number, tags?:string[]}>}
 */
let KinkyDungeonRandomPathablePoints = new Map();
/** @type {Map<string, any>} */
let KinkyDungeonTiles = new Map();
/** @type {Map<string, any>} */
let KinkyDungeonTilesMemory = new Map();
/** @type {Map<string, any>} */
let KinkyDungeonTilesSkin = new Map();
let KinkyDungeonTargetTile = null;
let KinkyDungeonTargetTileLocation = "";

const KinkyDungeonBaseLockChance = 0.1;
const KinkyDungeonScalingLockChance = 0.1; // Lock chance per 10 floors. Does not affect the guaranteed locked chest each level
const KinkyDungeonBlueLockChance = -0.1;
const KinkyDungeonBlueLockChanceScaling = 0.015;
const KinkyDungeonBlueLockChanceScalingMax = 0.4;
const KinkyDungeonGoldLockChance = -0.25; // Chance that a blue lock is replaced with a gold lock
const KinkyDungeonGoldLockChanceScaling = 0.015;
const KinkyDungeonGoldLockChanceScalingMax = 0.25;

let KinkyDungeonCurrentMaxEnemies = 1;

let KinkyDungeonNextDataSendTime = 0;
const KinkyDungeonNextDataSendTimeDelay = 500; // Send on moves every 0.5 second
let KinkyDungeonNextDataSendTimeDelayPing = 5000; // temporary ping
let KinkyDungeonNextDataSendStatsTimeDelay = 3000; // Send stats every 3s to save bandwidth
let KinkyDungeonNextDataSendStatsTime = 0;

let KinkyDungeonNextDataLastTimeReceived = 0;
let KinkyDungeonNextDataLastTimeReceivedTimeout = 15000; // Clear data if more than 15 seconds of no data received

let KinkyDungeonLastMoveDirection = null;
let KinkyDungeonTargetingSpell = null;

/**
 * Item to decrement by 1 when spell is cast
 */
let KinkyDungeonTargetingSpellItem = null;
let KinkyDungeonTargetingSpellWeapon = null;

/**
 * Game stops when you reach this level
 */
let KinkyDungeonMaxLevel = 24;

let KinkyDungeonLastMoveTimer = 0;
let KinkyDungeonLastMoveTimerStart = 0;
let KinkyDungeonLastMoveTimerCooldown = 175;
let KinkyDungeonLastMoveTimerCooldownStart = 50;

let KinkyDungeonPatrolPoints = [];
let KinkyDungeonStartPosition = {x: 1, y: 1};
let KinkyDungeonEndPosition = {x: 1, y: 1};
let KinkyDungeonShortcutPosition = null;
let KinkyDungeonJailLeash = 3;
let KinkyDungeonJailLeashX = 3;
let KinkyDungeonOrbsPlaced = [];
let KinkyDungeonCachesPlaced = [];
let KinkyDungeonHeartsPlaced = [];
let KinkyDungeonChestsOpened = [];

let KinkyDungeonSaveInterval = 10;

let KinkyDungeonSFX = [];

function KDAlreadyOpened(x, y) {
	if (KDGameData.AlreadyOpened) {
		for (let ao of KDGameData.AlreadyOpened) {
			if (ao.x == x && ao.y == y) {
				return true;
			}
		}
	}
	return false;
}

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

function KinkyDungeonSetCheckPoint(Checkpoint, AutoSave, suppressCheckPoint) {
	if (Checkpoint != undefined) MiniGameKinkyDungeonCheckpoint = Checkpoint;
	else if (Math.floor(MiniGameKinkyDungeonLevel / 10) == MiniGameKinkyDungeonLevel / 10)
		MiniGameKinkyDungeonCheckpoint = Math.floor(MiniGameKinkyDungeonLevel / 10);
}

function KinkyDungeonNewGamePlus() {
	KDInitializeJourney(KDGameData.Journey);

	let temp = [];
	for (let o of KinkyDungeonOrbsPlaced) {
		if (KDRandom() < 0.5) temp.push(o);
	}
	KinkyDungeonOrbsPlaced = temp;
	KinkyDungeonCachesPlaced = [];
	KinkyDungeonHeartsPlaced = [];
	MiniGameKinkyDungeonLevel = 1;
	KinkyDungeonSetCheckPoint(0, true);
	KinkyDungeonCreateMap(KinkyDungeonMapParams[0], 1);
	KinkyDungeonNewGame += 1;
}
function KinkyDungeonInitialize(Level, Load) {
	KDGameData.RespawnQueue = [];
	KDInitFactions(true);
	CharacterReleaseTotal(KinkyDungeonPlayer);
	Object.assign(KDGameData, KDGameDataBase);

	KinkyDungeonRefreshRestraintsCache();
	KinkyDungeonRefreshOutfitCache();
	//KinkyDungeonRefreshEnemyCache();
	KinkyDungeonFlags = new Map();

	KinkyDungeonDressSet();
	if (KinkyDungeonConfigAppearance) {
		localStorage.setItem("kinkydungeonappearance", LZString.compressToBase64(CharacterAppearanceStringify(KinkyDungeonPlayer)));
		KinkyDungeonConfigAppearance = false;
	}

	KinkyDungeonDressPlayer();
	KinkyDungeonDrawState = "Game";

	KinkyDungeonMapIndex = [];
	for (let I = 0; I < KinkyDungeonMapParams.length; I++) {
		KinkyDungeonMapIndex.push(I);
	}

	KinkyDungeonTextMessage = "";
	KinkyDungeonActionMessage = "";
	MiniGameKinkyDungeonLevel = Level;
	KinkyDungeonSetCheckPoint();

	KinkyDungeonMapIndex = [];

	for (let I = 1; I < KinkyDungeonMapParams.length; I++) {
		KinkyDungeonMapIndex.push(I);
	}

	KinkyDungeonContextPlayer = KinkyDungeonCanvasPlayer.getContext("2d");
	KinkyDungeonCanvasPlayer.width = KinkyDungeonGridSizeDisplay;
	KinkyDungeonCanvasPlayer.height = KinkyDungeonGridSizeDisplay;

	KinkyDungeonContext = KinkyDungeonCanvas.getContext("2d");
	KinkyDungeonCanvas.height = KinkyDungeonCanvasPlayer.height*KinkyDungeonGridHeightDisplay;

	KinkyDungeonContextFow = KinkyDungeonCanvasFow.getContext("2d");
	KinkyDungeonCanvasFow.width = KinkyDungeonCanvas.width;
	KinkyDungeonCanvasFow.height = KinkyDungeonCanvas.height;

	KinkyDungeonDefaultStats(Load);

	// Set up the first level
	//KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[0]], 0);
}
// Starts the the game at a specified level
function KinkyDungeonCreateMap(MapParams, Floor, testPlacement, seed) {
	for (let iterations = 0; iterations < 100; iterations++) {
		KinkyDungeonSpecialAreas = [];
		KinkyDungeonShortcutPosition = null;
		KinkyDungeonRescued = {};
		KDGameData.ChampionCurrent = 0;
		KinkyDungeonAid = {};
		KDGameData.KinkyDungeonPenance = false;
		KDRestraintsCache = new Map();
		KDEnemiesCache = new Map();
		KinkyDungeonGrid = "";
		KinkyDungeonTiles = new Map();
		KinkyDungeonTilesSkin = new Map();
		KinkyDungeonTargetTile = null;
		KinkyDungeonTargetTileLocation = "";
		KinkyDungeonGroundItems = []; // Clear items on the ground
		KinkyDungeonBullets = []; // Clear all bullets

		if (KDGameData.JailKey == undefined) {
			KDGameData.JailKey = true;
		}
		if (!KDGameData.JailKey || (KDGameData.PrisonerState == 'parole' || KDGameData.PrisonerState == 'jail')) KinkyDungeonLoseJailKeys();

		KDGameData.JailPoints = [];

		KDGameData.RescueFlag = false;

		KinkyDungeonTotalSleepTurns = 0;

		KinkyDungeonFastMovePath = [];

		// These are generated before the seed as they depend on the player's restraints and rep
		KinkyDungeonGenerateShop(MiniGameKinkyDungeonLevel);
		let shrinefilter = KinkyDungeonGetMapShrines(MapParams.shrines);
		let traptypes = MapParams.traps.concat(KinkyDungeonGetGoddessTrapTypes());

		if (iterations == 0) {
			//console.log(seed);
			if (!seed) {
				KDGameData.AlreadyOpened = [];
				KDrandomizeSeed(true);
				KDGameData.LastMapSeed = KinkyDungeonSeed;
				// Reset the chase if this is a new floor
				if (KDGameData.PrisonerState == "chase") {
					KDGameData.PrisonerState = "";
				}
			}
			console.log("Map Seed: " + KinkyDungeonSeed);
			KDsetSeed(KinkyDungeonSeed);
			//console.log(KDRandom());
		}

		let height = MapParams.min_height + 2*Math.floor(0.5*KDRandom() * (MapParams.max_height - MapParams.min_height));
		let width = MapParams.min_width + 2*Math.floor(0.5*KDRandom() * (MapParams.max_width - MapParams.min_width));

		KinkyDungeonCanvas.width = KinkyDungeonCanvasPlayer.width*KinkyDungeonGridWidthDisplay;
		KinkyDungeonGridHeight = height;
		KinkyDungeonGridWidth = width;


		// Generate the grid
		for (let X = 0; X < height; X++) {
			for (let Y = 0; Y < width; Y++)
				KinkyDungeonGrid = KinkyDungeonGrid + '1';
			KinkyDungeonGrid = KinkyDungeonGrid + '\n';
		}

		// We only rerender the map when the grid changes
		KinkyDungeonGrid_Last = "";
		KinkyDungeonUpdateLightGrid = true;

		// Setup variables
		let startpos = 1 + 2*Math.floor(KDRandom()*0.5 * (height - 2));
		if (startpos % 2 != 1) startpos += 1; // startpos MUST be odd

		// MAP GENERATION

		let VisitedRooms = [];
		KinkyDungeonMapSet(1, startpos, '1', VisitedRooms);

		//console.log(KDRandom());
		// Use primm algorithm with modification to spawn random rooms in the maze
		let openness = MapParams.openness;
		let density = MapParams.density;
		let hallopenness = MapParams.hallopenness ? MapParams.hallopenness : MapParams.openness;
		let chargerchance = MapParams.chargerchance ? MapParams.chargerchance : 0.75;
		let litchargerchance = MapParams.litchargerchance ? MapParams.litchargerchance : 0.1;
		let chargercount = MapParams.chargercount ? MapParams.chargercount : 4;
		let doodadchance = MapParams.doodadchance;
		let barchance = MapParams.barchance;
		let treasurechance = 1.0; // Chance for an extra locked chest
		let treasurecount = MapParams.chestcount; // Max treasure chest count
		//if (KDGameData.KinkyDungeonSpawnJailers > 0) treasurecount = 0;
		let shrinechance = MapParams.shrinechance; // Chance for an extra shrine
		let ghostchance = MapParams.ghostchance; // Chance for a ghost
		let shrinecount = MapParams.shrinecount; // Max treasure chest count
		let rubblechance = MapParams.rubblechance; // Chance of lootable rubble
		if (KinkyDungeonStatsChoice.get("Pristine")) rubblechance = 0;
		let doorchance = MapParams.doorchance; // Chance door will be closed
		let nodoorchance = MapParams.nodoorchance; // Chance of there not being a door
		let doorlockchance = MapParams.doorlockchance; // Max treasure chest count
		//if (KinkyDungeonGoddessRep.Prisoner && KDGameData.KinkyDungeonSpawnJailers > 0) doorlockchance = doorlockchance + (KDGameData.KinkyDungeonSpawnJailers / KDGameData.KinkyDungeonSpawnJailersMax) * (1.0 - doorlockchance) * (KinkyDungeonGoddessRep.Prisoner + 50)/100;
		let trapChance = MapParams.trapchance; // Chance of a pathway being split between a trap and a door
		let grateChance = MapParams.grateChance;
		let floodChance = MapParams.floodchance ? MapParams.floodchance : 0;
		let gasChance = (MapParams.gaschance && KDRandom() < MapParams.gaschance) ? (MapParams.gasdensity ? MapParams.gasdensity : 0) : 0;
		let gasType = MapParams.gastype ? MapParams.gastype : 0;
		let brickchance = MapParams.brickchance; // Chance for brickwork to start being placed
		let cacheInterval = MapParams.cacheInterval;
		let forbiddenChance = MapParams.forbiddenChance;
		let greaterChance = MapParams.forbiddenGreaterChance;
		let wallRubblechance = MapParams.wallRubblechance ? MapParams.wallRubblechance : 0;
		let barrelChance = MapParams.barrelChance ? MapParams.barrelChance : 0.045;

		//console.log(KDRandom());
		let shrineTypes = [];
		let shrinelist = [];
		let chargerlist = [];
		let chestlist = [];
		let startTime = performance.now();
		KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density, hallopenness, floodChance);
		//console.log(KDRandom());
		if (KDDebug) {
			console.log(`${performance.now() - startTime} ms for maze creation`);
			startTime = performance.now();
		}
		width = KinkyDungeonGridWidth;
		height = KinkyDungeonGridHeight;
		startpos *= 2;

		KinkyDungeonResetFog();

		// Place the player!
		KinkyDungeonPlayerEntity = {MemberNumber:Player.MemberNumber, x: 2, y:startpos, player:true};

		KinkyDungeonStartPosition = {x: 2, y: startpos};

		let spawnPoints = [];

		KinkyDungeonReplaceDoodads(doodadchance, barchance, wallRubblechance, barrelChance, width, height); // Replace random internal walls with doodads
		//console.log(KDRandom());
		if (KDDebug) {
			console.log(`${performance.now() - startTime} ms for doodad creation`);
			startTime = performance.now();
		}
		KinkyDungeonPlaceStairs(KinkyDungeonGetMainPath(Floor), startpos, width, height); // Place the start and end locations
		if (KDDebug) {
			console.log(`${performance.now() - startTime} ms for stair creation`);
			startTime = performance.now();
		}

		// We removed cachesplaced due to the rework of the prison system
		if ((MiniGameKinkyDungeonLevel % 6) % cacheInterval == 0)
			KinkyDungeonCreateCache(spawnPoints, Floor, width, height);
		if (KDDebug) {
			console.log(`${performance.now() - startTime} ms for cache and cell creation`);
			startTime = performance.now();
		}
		let createForbidden = KDRandom() < forbiddenChance || MiniGameKinkyDungeonLevel <= 1;
		let traps = (createForbidden ? KinkyDungeonCreateForbidden(MiniGameKinkyDungeonLevel <= 1 ? 1.0 : greaterChance) : []);
		if (KDDebug) {
			console.log(`${performance.now() - startTime} ms for gold hall creation`);
			startTime = performance.now();
		}
		//console.log(KDRandom());

		// Create enemies first so we can spawn them in the set pieces if needed
		let allies = KinkyDungeonGetAllies();
		KinkyDungeonEntities = allies;

		KinkyDungeonPlaceSetPieces(traps, chestlist, shrinelist, chargerlist, spawnPoints, false, width, height);

		if (!testPlacement) {
			KinkyDungeonPlaceShortcut(KinkyDungeonGetShortcut(Floor), width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for shortcut creation`);
				startTime = performance.now();
			}
			KinkyDungeonPlaceChests(chestlist, treasurechance, treasurecount, rubblechance, Floor, width, height); // Place treasure chests inside dead ends
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for chest creation`);
				startTime = performance.now();
			}
			let traps2 = KinkyDungeonPlaceDoors(doorchance, nodoorchance, doorlockchance, trapChance, grateChance, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for door creation`);
				startTime = performance.now();
			}
			for (let t of traps2) {
				traps.push(t);
			}
			KinkyDungeonPlaceShrines(shrinelist, shrinechance, shrineTypes, shrinecount, shrinefilter, ghostchance, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for shrine creation`);
				startTime = performance.now();
			}
			KinkyDungeonPlaceChargers(chargerlist, chargerchance, litchargerchance, chargercount, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for charger creation`);
				startTime = performance.now();
			}
			KinkyDungeonPlaceBrickwork(brickchance, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for brickwork creation`);
				startTime = performance.now();
			}
			KinkyDungeonPlaceTraps(traps, traptypes, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for trap creation`);
				startTime = performance.now();
			}
			KinkyDungeonPlacePatrols(4, width, height);if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for patrol point creation`);
				startTime = performance.now();
			}
			KinkyDungeonPlaceLore(width, height);if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for lore creation`);
				startTime = performance.now();
			}
			if ((MiniGameKinkyDungeonLevel % 6 == 2 || MiniGameKinkyDungeonLevel % 6 == 4 || (MiniGameKinkyDungeonLevel % 6 == 5 && MiniGameKinkyDungeonCheckpoint > 9)) && !KinkyDungeonHeartsPlaced.includes(Floor))
				KinkyDungeonPlaceHeart(width, height, Floor);
			KinkyDungeonPlaceSpecialTiles(gasChance, gasType, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for special tile creation`);
				startTime = performance.now();
			}
			KinkyDungeonGenNavMap();
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for navmap creation`);
				startTime = performance.now();
			}

			KinkyDungeonUpdateStats(0);

			// Place enemies after player
			KinkyDungeonPlaceEnemies(spawnPoints, false, MapParams.enemytags, Floor, width, height);
			if (KDDebug) {
				console.log(`${performance.now() - startTime} ms for enemy creation`);
				startTime = performance.now();
			}
		}

		if (KDGameData.PrisonerState == 'jail' && seed) {
			// The above condition is the condition to start in jail
			// We move the player to the jail after generating one
			let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			if (nearestJail) {
				KinkyDungeonPlayerEntity.x = nearestJail.x;
				KinkyDungeonPlayerEntity.y = nearestJail.y;
			}
		}

		if (KDGameData.KinkyDungeonSpawnJailers > 0) KDGameData.KinkyDungeonSpawnJailers -= 1;
		if (KDGameData.KinkyDungeonSpawnJailers > 3 && KDGameData.KinkyDungeonSpawnJailers < KDGameData.KinkyDungeonSpawnJailersMax - 1) KDGameData.KinkyDungeonSpawnJailers -= 1; // Reduce twice as fast when you are in deep...

		// Set map brightness
		KinkyDungeonMapBrightness = MapParams.brightness;

		if (KinkyDungeonNearestJailPoint(1, 1)) iterations = 100000;
		else console.log("This map failed to generate a jail! Please screenshot and send your save code to Ada on deviantart or discord!");
	}
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

function KinkyDungeonGetAllies() {
	let temp = [];
	for (let e of KinkyDungeonEntities) {
		if (e.Enemy && e.Enemy.keepLevel) {
			e.x = KinkyDungeonStartPosition.x;
			e.y = KinkyDungeonStartPosition.y;
			e.visual_x = KinkyDungeonStartPosition.x;
			e.visual_y = KinkyDungeonStartPosition.y;
			temp.push(e);
		}
	}

	return temp;
}

// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceEnemies(spawnPoints, InJail, Tags, Floor, width, height) {
	KinkyDungeonHuntDownPlayer = false;
	KinkyDungeonFirstSpawn = true;
	KinkyDungeonSearchTimer = 0;

	let enemyCount = 12 + Math.floor(Math.sqrt(Floor) + width/20 + height/20 + KinkyDungeonDifficulty/10);
	if (KinkyDungeonStatsChoice.get("Stealthy")) enemyCount = Math.round(enemyCount * KDStealthyEnemyCountMult);
	if (InJail) enemyCount = Math.floor(enemyCount/2);
	let count = 0;
	let tries = 0;
	let miniboss = false;
	let boss = false;
	let jailerCount = 0;
	let EnemyNames = [];

	let currentCluster = null;

	let spawns = [];
	for (let sp of spawnPoints) spawns.push(sp);

	// Create this number of enemies
	while (count < enemyCount && tries < 1000) {
		let X = 1 + Math.floor(KDRandom()*(width - 1));
		let Y = 1 + Math.floor(KDRandom()*(height - 1));
		let required = undefined;
		let spawnPoint = false;
		let AI = undefined;
		let tags = [];

		if (currentCluster && !(10 * KDRandom() < currentCluster.count)) {
			required = [currentCluster.required];
			X = currentCluster.x - 2 + Math.floor(KDRandom() * 5);
			Y = currentCluster.y - 2 + Math.floor(KDRandom() * 5);

			if (!KinkyDungeonCheckPath(currentCluster.x, currentCluster.y, X, Y, false, true)) {
				if (5 * KDRandom() < currentCluster.count) currentCluster = null;
				continue;
			}
		} else {
			currentCluster = null;
			if (spawns.length > 0) {
				spawnPoint = true;
				if (spawns[0].required)
					required = spawns[0].required;
				if (spawns[0].tags)
					tags = spawns[0].tags;
				X = spawns[0].x;
				Y = spawns[0].y;
				AI = spawns[0].AI;
				spawns.splice(0, 1);
			}
		}

		let playerDist = 6;
		let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y});

		if ((spawnPoint && KinkyDungeonNoEnemy(X, Y, true)) || ((!KinkyDungeonTiles.get("" + X + "," + Y) || !KinkyDungeonTiles.get("" + X + "," + Y).OffLimits) && Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist && (!InJail || X > KinkyDungeonJailLeashX + 3) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))
			&& KinkyDungeonNoEnemy(X, Y, true) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits))) {

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

			if (count < enemyCount * 0.15 && !spawnPoint) {
				if (!required) required = ["minor"];
				else required.push("minor");
			}
			let Enemy = KinkyDungeonGetEnemy(tags, Floor + KinkyDungeonDifficulty/5, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], KinkyDungeonMapGet(X, Y), required);
			if (Enemy && (!InJail || (Enemy.tags.has("jailer") || Enemy.tags.has("jail")))) {
				KinkyDungeonEntities.push({Enemy: Enemy, id: KinkyDungeonGetEnemyID(), x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0, AI: AI});
				if (!spawnPoint && !currentCluster && Enemy.clusterWith) {
					let clusterChance = 1.0; //1.1 + 0.9 * MiniGameKinkyDungeonLevel/KinkyDungeonMaxLevel;
					if (Enemy.tags.has("boss")) clusterChance *= 0.4;
					//else if (Enemy.tags.has("elite") || Enemy.tags.has("miniboss")) clusterChance *= 0.6;
					if (KDRandom() < clusterChance)
						currentCluster = {
							x : X,
							y : Y,
							required: Enemy.clusterWith,
							count: 1,
						};
				} else if (currentCluster) currentCluster.count += 1;
				if (Enemy.tags.has("mimicBlock") && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) KinkyDungeonMapSet(X, Y, '3');
				if (Enemy.difficulty) count += Enemy.difficulty;
				if (Enemy.tags.has("minor")) count += 0.2; else count += currentCluster ? 0.75 : 1.0; // Minor enemies count as 1/5th of an enemy
				if (Enemy.tags.has("boss")) {boss = true; count += 3 * Math.max(1, 100/(100 + KinkyDungeonDifficulty));} // Boss enemies count as 4 normal enemies
				else if (Enemy.tags.has("elite")) count += Math.max(0.5, 50/(100 + KinkyDungeonDifficulty)); // Elite enemies count as 1.5 normal enemies
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

// @ts-ignore
function KinkyDungeonCreateCache(spawnPoints, Floor, width, height) {
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
	spawnPoints.push({x:cornerX-1, y:cornerY + Math.floor(radius/2)-1, required: ["cacheguard"], tags: ["bandit"], AI: "guard"});
	spawnPoints.push({x:cornerX-1, y:cornerY + Math.floor(radius/2)+1, required: ["cacheguard"], tags: ["bandit"], AI: "guard"});
	KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + Math.floor(radius/2)), {Loot: "cache", Roll: KDRandom()});
	KinkyDungeonTiles.set(cornerX + "," + (cornerY + Math.floor(radius/2)), {Type: "Door", Lock: "Red", OffLimits: true, ReLock: true});
	KinkyDungeonCachesPlaced.push(Floor);
	KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2) + 1});
}


// @ts-ignore
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

		KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + 1), {Loot: "gold", Roll: KDRandom()});
		KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2) + 4});
		if ( KDDebug) {
			console.log("Created forbidden hall");
		}
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

		KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + 1), {Loot: "lessergold", Roll: KDRandom()});
		KinkyDungeonSpecialAreas.push({x: cornerX + 1, y: cornerY + 1, radius: 3});
		if (KDDebug) {
			console.log("Created lesser gold chest");
		}
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
// @ts-ignore
function KinkyDungeonCreateCell(security, width, height) {
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

function KinkyDungeonPlaceStairs(checkpoint, startpos, width, height) {
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
				if (wallcount == 7
					|| (wallcount >= 5
						&& (KinkyDungeonMapGet(X+1, Y) == '1' || KinkyDungeonMapGet(X-1, Y) == '1')
						&& (KinkyDungeonMapGet(X, Y+1) == '1' || KinkyDungeonMapGet(X, Y-1) == '1'))) {
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

	MiniGameKinkyDungeonMainPath = checkpoint;
	if (MiniGameKinkyDungeonMainPath != MiniGameKinkyDungeonCheckpoint) KinkyDungeonSkinArea({skin: MiniGameKinkyDungeonMainPath}, KinkyDungeonEndPosition.x, KinkyDungeonEndPosition.y, 8.5);
	KinkyDungeonSpecialAreas.push({x: KinkyDungeonEndPosition.x, y: KinkyDungeonEndPosition.y, radius: 2});
}

function KinkyDungeonSkinArea(skin, X, Y, Radius, NoStairs) {
	for (let xx = Math.floor(X - Radius); xx <= Math.ceil(X + Radius); xx++) {
		for (let yy = Math.floor(Y - Radius); yy <= Math.ceil(Y + Radius); yy++) {
			if (xx >= 0 && xx <= KinkyDungeonGridWidth - 1 && yy >= 0 && yy <= KinkyDungeonGridHeight - 1) {
				if (KDistEuclidean(xx - X, yy - Y) <= Radius + 0.01 && (!NoStairs || KinkyDungeonMapGet(xx, yy) != 's')) {
					if (!KinkyDungeonTilesSkin.get(xx + "," + yy)) {
						KinkyDungeonTilesSkin.set(xx + "," + yy, skin);
					}
				}
			}
		}
	}
}

// @ts-ignore
function KinkyDungeonGetMainPath(level) {
	let params = KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint];
	let paths = params ? params.mainpath : null;
	let path = null;
	let chanceRoll = KDRandom(); // This is always rolled, in order to not break saves
	if (paths) {
		for (let p of paths) {
			if (p.Level == MiniGameKinkyDungeonLevel) {
				path = p;
				break;
			}
		}
	}
	if (path) {
		if (chanceRoll < path.chance || !path.chance) {
			return path.checkpoint;
		}
	}
	if ((MiniGameKinkyDungeonLevel + 1) % 6 == 0) {
		return Math.floor((MiniGameKinkyDungeonLevel + 1) / 10);
	}
	return MiniGameKinkyDungeonCheckpoint;
}

// @ts-ignore
function KinkyDungeonGetShortcut(level) {
	let params = KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint];
	let paths = params ? params.shortcuts : null;
	let path = null;
	let chanceRoll = KDRandom(); // This is always rolled, in order to not break saves
	if (paths) {
		for (let p of paths) {
			if (p.Level == MiniGameKinkyDungeonLevel) {
				path = p;
				break;
			}
		}
	}
	if (path) {
		if (chanceRoll < path.chance || !path.chance) {
			return path.checkpoint;
		}
	}
	return 0;
}

function KinkyDungeonPlaceShortcut(checkpoint, width, height) {

	if (checkpoint > 0) {

		// Ending stairs are not.
		let placed = false;
		let xx = 0;
		let yy = 0;

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
				if (wallcount == 7
					|| (wallcount >= 5
						&& (KinkyDungeonMapGet(X+1, Y) == '1' || KinkyDungeonMapGet(X-1, Y) == '1')
						&& (KinkyDungeonMapGet(X, Y+1) == '1' || KinkyDungeonMapGet(X, Y-1) == '1'))) {
					placed = true;
					KinkyDungeonMapSet(X, Y, 'H');
					KinkyDungeonShortcutPosition = {x:X, y:Y};
					xx = X;
					yy = Y;
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
					xx = X;
					yy = Y;
					KinkyDungeonShortcutPosition = {x:X, y:Y};
				}
			}

		if (placed) {
			MiniGameKinkyDungeonShortcut = checkpoint;
			if (MiniGameKinkyDungeonShortcut != MiniGameKinkyDungeonCheckpoint) KinkyDungeonSkinArea({skin: MiniGameKinkyDungeonShortcut}, xx, yy, 4.5, true);
		}
	}
}

let KDRandomDisallowedNeighbors = "AasSHcCHDdOo+"; // tiles that can't be neighboring a randomly selected point

function KinkyDungeonPlaceChests(chestlist, treasurechance, treasurecount, rubblechance, Floor, width, height) {

	let chestPoints = new Map();

	for (let s of chestlist) {
		chestPoints.set(s.x + "," + s.y, true);
	}
	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && KDistChebyshev(X - KinkyDungeonStartPosition.x, Y - KinkyDungeonStartPosition.y) > 10 &&
			(!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let wallcount = 0;
				let adjcount = 0;
				let diagadj = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X')) {
							wallcount += 1;
							// Adjacent wall
							if (XX == X || YY == Y) adjcount += 1;
						} else if (!(XX == X && YY == Y) && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(XX, YY))) {
							if (!(XX == X || YY == Y)) {// Diagonal floor. We check the adjacent floors around the diagonals to determine if this is an alcove or a passage
								if (XX == X + 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X + 1, Y))) diagadj += 1;
								else if (XX == X - 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X - 1, Y))) diagadj += 1;
								else if (YY == Y + 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y + 1))) diagadj += 1;
								else if (YY == Y - 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y - 1))) diagadj += 1;
							}
						}
					}

				if (wallcount == 7
					|| (wallcount >= 4 && (wallcount - adjcount - diagadj == 0 || (wallcount == 5 && adjcount == 2 && diagadj == 1) || (wallcount > 4 && adjcount == 3 && diagadj == 7 - wallcount))
						&& (KinkyDungeonMapGet(X+1, Y) == '1' || KinkyDungeonMapGet(X-1, Y) == '1')
						&& (KinkyDungeonMapGet(X, Y+1) == '1' || KinkyDungeonMapGet(X, Y-1) == '1')
						&& (!(KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X-1, Y) == '1') || (wallcount > 4 && adjcount == 3 && diagadj == 7 - wallcount))
						&& (!(KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X, Y-1) == '1') || (wallcount > 4 && adjcount == 3 && diagadj == 7 - wallcount)))) {
					if (!chestPoints.get((X+1) + "," + (Y))
						&& !chestPoints.get((X-1) + "," + (Y))
						&& !chestPoints.get((X+1) + "," + (Y+1))
						&& !chestPoints.get((X+1) + "," + (Y-1))
						&& !chestPoints.get((X-1) + "," + (Y+1))
						&& !chestPoints.get((X-1) + "," + (Y-1))
						&& !chestPoints.get((X) + "," + (Y+1))
						&& !chestPoints.get((X) + "," + (Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y+1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X, Y+1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y+1))) {
						chestlist.push({x:X, y:Y});
						chestPoints.set(X + "," + Y, true);
					}
				}
			}

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	let extra = KDRandom() < treasurechance;
	treasurecount += (extra ? 1 : 0);
	if (KinkyDungeonStatsChoice.get("Stealthy")) treasurecount *= 2;
	// Removed due to the way the jail system was reworked
	let alreadyOpened = 0;//(KinkyDungeonChestsOpened.length > Floor) ? KinkyDungeonChestsOpened[Floor] : 0;
	if (KinkyDungeonNewGame < 1) treasurecount -= alreadyOpened;
	while (chestlist.length > 0) {
		let N = Math.floor(KDRandom()*chestlist.length);
		if (count < treasurecount) {
			let chest = chestlist[N];
			KinkyDungeonMapSet(chest.x, chest.y, 'C');

			// Add a lock on the chest! For testing purposes ATM
			let lock = KinkyDungeonGenerateLock((extra && count == 0) ? true : false, Floor);
			if (count == 0 || count >= treasurecount - alreadyOpened) {
				KinkyDungeonTiles.set("" + chest.x + "," +chest.y, {Loot: "silver", Roll: KDRandom()});
			} else if (lock) {
				KinkyDungeonTiles.set("" + chest.x + "," +chest.y, {Type: "Lock", Lock: lock, Loot: lock == "Blue" ? "blue" : "chest", Roll: KDRandom(), Special: lock == "Blue", RedSpecial: lock == "Red"});
			} else KinkyDungeonTiles.set("" + chest.x + "," +chest.y, {Loot: "chest", Roll: KDRandom()});

			if (KDAlreadyOpened(chest.x, chest.y)) {
				KinkyDungeonMapSet(chest.x, chest.y, 'c');
				KinkyDungeonTiles.delete("" + chest.x + "," +chest.y);
			}
			count += 1;
		} else {

			let chest = chestlist[N];
			if (KDRandom() < rubblechance) KinkyDungeonMapSet(chest.x, chest.y, 'R');
			else KinkyDungeonMapSet(chest.x, chest.y, 'r');
			if (KDAlreadyOpened(chest.x, chest.y)) KinkyDungeonMapSet(chest.x, chest.y, 'r');
		}
		chestlist.splice(N, 1);
	}
}


function KinkyDungeonPlaceLore(width, height) {
	let loreList = [];

	// Populate the lore
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits) && KDRandom() < 0.6) loreList.push({x:X, y:Y});

	while (loreList.length > 0) {
		let N = Math.floor(KDRandom()*loreList.length);
		KinkyDungeonGroundItems.push({x:loreList[N].x, y:loreList[N].y, name: "Lore"});
		return true;
	}

}

function KinkyDungeonPlaceHeart(width, height, Floor) {
	let heartList = [];

	// Populate the lore
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) heartList.push({x:X, y:Y});

	while (heartList.length > 0) {
		let N = Math.floor(KDRandom()*heartList.length);
		KinkyDungeonGroundItems.push({x:heartList[N].x, y:heartList[N].y, name: "Heart"});
		KinkyDungeonHeartsPlaced.push(Floor);
		return true;
	}

}



// @ts-ignore
// @ts-ignore
// @ts-ignore
function KinkyDungeonPlaceShrines(shrinelist, shrinechance, shrineTypes, shrinecount, shrinefilter, ghostchance, Floor, width, height) {
	KinkyDungeonCommercePlaced = 0;


	let shrinePoints = new Map();

	for (let s of shrinelist) {
		shrinePoints.set(s.x + "," + s.y, true);
	}


	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.max(Math.abs(X - KinkyDungeonStartPosition.x), Math.abs(Y - KinkyDungeonStartPosition.y)) > KinkyDungeonJailLeash
				&& (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let wallcount = 0;
				let adjcount = 0;
				let diagadj = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X')) {
							wallcount += 1;
							// Adjacent wall
							if (XX == X || YY == Y) adjcount += 1;
						} else if (!(XX == X && YY == Y) && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(XX, YY))) {
							if (!(XX == X || YY == Y)) {// Diagonal floor. We check the adjacent floors around the diagonals to determine if this is an alcove or a passage
								if (XX == X + 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X + 1, Y))) diagadj += 1;
								else if (XX == X - 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X - 1, Y))) diagadj += 1;
								else if (YY == Y + 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y + 1))) diagadj += 1;
								else if (YY == Y - 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y - 1))) diagadj += 1;
							}
						}
					}

				if (wallcount == 7
					|| (wallcount >= 4 && (wallcount - adjcount - diagadj == 0 || (wallcount == 5 && adjcount == 2 && diagadj == 1) || (wallcount == 6 && adjcount == 3 && diagadj == 1))
						&& (KinkyDungeonMapGet(X+1, Y) == '1' || KinkyDungeonMapGet(X-1, Y) == '1')
						&& (KinkyDungeonMapGet(X, Y+1) == '1' || KinkyDungeonMapGet(X, Y-1) == '1')
						&& (!(KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X-1, Y) == '1') || (wallcount == 6 && adjcount == 3 && diagadj == 1))
						&& (!(KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X, Y-1) == '1') || (wallcount == 6 && adjcount == 3 && diagadj == 1)))) {
					if (!shrinePoints.get((X+1) + "," + (Y))
						&& !shrinePoints.get((X-1) + "," + (Y))
						&& !shrinePoints.get((X+1) + "," + (Y+1))
						&& !shrinePoints.get((X+1) + "," + (Y-1))
						&& !shrinePoints.get((X-1) + "," + (Y+1))
						&& !shrinePoints.get((X-1) + "," + (Y-1))
						&& !shrinePoints.get((X) + "," + (Y+1))
						&& !shrinePoints.get((X) + "," + (Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y+1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X, Y+1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y+1))) {
						shrinelist.push({x:X, y:Y});
						shrinePoints.set(X + "," + Y, true);
					}
				}


			} else if (KinkyDungeonMapGet(X, Y) == "R" || KinkyDungeonMapGet(X, Y) == "r")
				shrinelist.push({x:X, y:Y});

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	let orbs = 0;
	while (shrinelist.length > 0) {
		let N = Math.floor(KDRandom()*shrinelist.length);
		if (count <= shrinecount) {

			let shrine = shrinelist[N];
			if (count == shrinecount && KDRandom() > shrinechance)
				KinkyDungeonMapSet(shrine.x, shrine.y, 'a');
			else {
				let playerTypes = KinkyDungeonRestraintTypes(shrinefilter);
				let type = shrineTypes.length < 2 ? "Orb"
					: (shrineTypes.length == 2 && playerTypes.length > 0 ?
						playerTypes[Math.floor(KDRandom() * playerTypes.length)]
						: KinkyDungeonGenerateShrine(Floor));
				let tile = 'A';
				if (type != "Orb" && shrineTypes.includes(type)) type = "";
				if (type == "Orb") {
					if (orbs < 2 || !KinkyDungeonOrbsPlaced.includes(Floor)) {
						tile = 'O';
						orbs += 1;
						// We removed orbsplaced due to the rework of the prison system
						//if (orbs >= 2)
						// KinkyDungeonOrbsPlaced.push(Floor);
					} else tile = 'o';
					if (KDAlreadyOpened(shrine.x, shrine.y)) {
						tile = 'o';
					}
					shrineTypes.push("Orb");
				} else if (type) {
					if (KDAlreadyOpened(shrine.x, shrine.y)) {
						tile = 'a';
					} else {
						KinkyDungeonTiles.set("" + shrine.x + "," +shrine.y, {Type: "Shrine", Name: type});
					}
					shrineTypes.push(type);
				} else if (!shrineTypes.includes("Ghost") || KDRandom() < 0.5) {
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


function KinkyDungeonPlaceChargers(chargerlist, chargerchance, litchargerchance, chargercount, Floor, width, height) {
	let chargerPoints = new Map();

	for (let s of chargerlist) {
		chargerPoints.set(s.x + "," + s.y, true);
	}


	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.max(Math.abs(X - KinkyDungeonStartPosition.x), Math.abs(Y - KinkyDungeonStartPosition.y)) > KinkyDungeonJailLeash
				&& (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				// Check the 3x3 area
				let wallcount = 0;
				let adjcount = 0;
				let diagadj = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X')) {
							wallcount += 1;
							// Adjacent wall
							if (XX == X || YY == Y) adjcount += 1;
						} else if (!(XX == X && YY == Y) && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(XX, YY))) {
							if (!(XX == X || YY == Y)) {// Diagonal floor. We check the adjacent floors around the diagonals to determine if this is an alcove or a passage
								if (XX == X + 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X + 1, Y))) diagadj += 1;
								else if (XX == X - 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X - 1, Y))) diagadj += 1;
								else if (YY == Y + 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y + 1))) diagadj += 1;
								else if (YY == Y - 1 && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y - 1))) diagadj += 1;
							}
						}
					}

				if (wallcount == 7 || wallcount == 0
					|| (wallcount >= 4 && (wallcount - adjcount - diagadj == 0 || (wallcount == 5 && adjcount == 2 && diagadj == 1) || (wallcount == 6 && adjcount == 3 && diagadj == 1))
						&& (KinkyDungeonMapGet(X+1, Y) == '1' || KinkyDungeonMapGet(X-1, Y) == '1')
						&& (KinkyDungeonMapGet(X, Y+1) == '1' || KinkyDungeonMapGet(X, Y-1) == '1')
						&& (!(KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X-1, Y) == '1') || (wallcount == 6 && adjcount == 3 && diagadj == 1))
						&& (!(KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X, Y-1) == '1') || (wallcount == 6 && adjcount == 3 && diagadj == 1)))) {
					if (!chargerPoints.get((X+1) + "," + (Y))
						&& !chargerPoints.get((X-1) + "," + (Y))
						&& !chargerPoints.get((X+1) + "," + (Y+1))
						&& !chargerPoints.get((X+1) + "," + (Y-1))
						&& !chargerPoints.get((X-1) + "," + (Y+1))
						&& !chargerPoints.get((X-1) + "," + (Y-1))
						&& !chargerPoints.get((X) + "," + (Y+1))
						&& !chargerPoints.get((X) + "," + (Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y-1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X-1, Y+1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X, Y+1))
						&& !KDRandomDisallowedNeighbors.includes(KinkyDungeonMapGet(X+1, Y+1))) {
						chargerlist.push({x:X, y:Y});
						chargerPoints.set(X + "," + Y, true);
					}
				}


			}

	// Truncate down to max chest count in a location-neutral way
	let count = 0;
	while (chargerlist.length > 0) {
		let N = Math.floor(KDRandom()*chargerlist.length);
		if (count <= chargercount) {

			let charger = chargerlist[N];
			let tile = KDRandom() > chargerchance ? '-' : (KDRandom() < litchargerchance ? '=' : '+');

			if (tile != '-') {
				KinkyDungeonTiles.set("" + charger.x + "," +charger.y, {Type: "Charger", Light: (tile == '=' ? 5 : undefined)});
			}

			KinkyDungeonMapSet(charger.x, charger.y, tile);

			count += (tile == '-' ? 0.4 : 1.0);
		}

		chargerlist.splice(N, 1);
	}
}

let KinkyDungeonCommercePlaced = 0;

// @ts-ignore
// @ts-ignore
// @ts-ignore
function KinkyDungeonGenerateShrine(Floor) {
	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];

	if (Params.shrines) {

		let shrineWeightTotal = 0;
		let shrineWeights = [];

		for (let shrine of Params.shrines) {
			shrineWeights.push({shrine: shrine, weight: shrineWeightTotal});
			shrineWeightTotal += shrine.Weight;
			if (KinkyDungeonStatsChoice.has("Supermarket")) {
				shrineWeightTotal += shrine.Weight; // Double weight of shop shrines
			}
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


// @ts-ignore
function KinkyDungeonPlaceSpecialTiles(gaschance, gasType, Floor, width, height) {
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
					KinkyDungeonMapSet(X, Y, gasType);
			}
}

// @ts-ignore
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
			if ((!KinkyDungeonInJail() || !KinkyDungeonPointInCell(X, Y)) && KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
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
	chance += KinkyDungeonScalingLockChance * level / KDLevelsPerCheckpoint;

	if (Guaranteed) chance = 1.0;

	if (KDRandom() < chance) {
		// Now we get the amount failed by
		// Default: red lock
		let locktype = KDRandom();

		let modifiers = "";

		let BlueChance = Math.min(KinkyDungeonBlueLockChance + (KinkyDungeonStatsChoice.get("HighSecurity") ? 1.5 : 1.0) * level * KinkyDungeonBlueLockChanceScaling, (KinkyDungeonStatsChoice.get("HighSecurity") ? 1.6 : 1.0) * KinkyDungeonBlueLockChanceScalingMax);

		if (KinkyDungeonStatsChoice.get("HighSecurity")) {
			BlueChance *= 1.5;
			BlueChance += 0.05;
		}
		if (locktype < BlueChance) {
			let GoldChance = Math.min(KinkyDungeonGoldLockChance + (KinkyDungeonStatsChoice.get("HighSecurity") ? 1.6 : 1.0) * level * KinkyDungeonGoldLockChanceScaling, (KinkyDungeonStatsChoice.get("HighSecurity") ? 1.9 : 1.0) * KinkyDungeonGoldLockChanceScalingMax);

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
		let minLockedRoomSize = 12;
		let maxPlayerDist = 4;

		let door = doorlist_2ndpass[N];
		let X = door.x;
		let Y = door.y;

		let roomDoors = [];

		let trap = KDRandom() < trapChance;
		let grate = KDRandom() < grateChance;

		if ((trap || grate) && KinkyDungeonTiles.get(X + "," + Y) && !KinkyDungeonTiles.get(X + "," + Y).NoTrap && !KinkyDungeonTiles.get(X + "," + Y).OffLimits) {
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
				let room2 = KinkyDungeonGetAccessibleRoom(X, Y);
				for (let ddoor of roomDoors) {
					rooms.push({door: ddoor, room: room2});
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
						if (!KinkyDungeonTiles.get(room.door.x + "," + room.door.y).Lock && !KinkyDungeonTiles.get(X + "," + Y).Lock && !KinkyDungeonTiles.get(room.door.x + "," + room.door.y).NoTrap
							&& ((KinkyDungeonGetAccessibleRoom(X+1, Y).length != KinkyDungeonGetAccessibleRoom(X-1, Y).length
								&& KinkyDungeonIsReachable(X+1, Y, X, Y) && KinkyDungeonIsReachable(X-1, Y, X, Y))
							|| (KinkyDungeonGetAccessibleRoom(X, Y+1).length != KinkyDungeonGetAccessibleRoom(X, Y-1).length)
								&& KinkyDungeonIsReachable(X, Y+1, X, Y) && KinkyDungeonIsReachable(X, Y-1, X, Y))
							&& KinkyDungeonIsAccessible(X, Y)) {
							let lock = false;
							//console.log(X + "," + Y + " locked")
							if (trap && Math.max(Math.abs(room.door.x - KinkyDungeonPlayerEntity.x), Math.abs(room.door.y - KinkyDungeonPlayerEntity.y)) > maxPlayerDist) {
								// Place a trap or something at the other door if it's far enough from the player
								if (KDDebug)
									console.log("Trap at " + X + "," + Y);
								trapLocations.push({x: room.door.x, y: room.door.y});
								if (KDRandom() < 0.1) {
									let dropped = {x:room.door.x, y:room.door.y, name: "Gold", amount: 1};
									KinkyDungeonGroundItems.push(dropped);
								}
								lock = true;
							} else if (((grate && (!room.room || room.room.length > minLockedRoomSize))
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
		}
		doorlist_2ndpass.splice(N, 1);
	}
	return trapLocations;
}

function KinkyDungeonReplaceDoodads(Chance, barchance, wallRubblechance, barrelChance, width, height) {
	for (let X = 1; X < width-1; X += 1)
		for (let Y = 1; Y < height-1; Y += 1) {
			if (KinkyDungeonMapGet(X, Y) == '1' && KDRandom() < Chance)
				KinkyDungeonMapSet(X, Y, 'X');
			else if (KinkyDungeonMapGet(X, Y) == '1' && KDRandom() < wallRubblechance) {
				KinkyDungeonMapSet(X, Y, 'Y');
				if (KDAlreadyOpened(X, Y)) {
					KinkyDungeonMapSet(X, Y, '1');
				}
			}

		}
	for (let X = 1; X < width - 1; X += 1)
		for (let Y = 1; Y < height - 1; Y += 1) {
			let tl = KinkyDungeonMapGet(X, Y);
			let tr = KinkyDungeonMapGet(X+1, Y);
			let bl = KinkyDungeonMapGet(X, Y+1);
			let br = KinkyDungeonMapGet(X+1, Y+1);
			if (tl == '1' && br == '1' && KinkyDungeonMovableTilesEnemy.includes(tr) && KinkyDungeonMovableTilesEnemy.includes(bl))
				KinkyDungeonMapSet(X, Y, 'X');
			else if (tr == '1' && bl == '1' && KinkyDungeonMovableTilesEnemy.includes(tl) && KinkyDungeonMovableTilesEnemy.includes(br))
				KinkyDungeonMapSet(X, Y+1, 'X');
		}
	for (let X = 1; X < width-1; X += 1)
		for (let Y = 1; Y < height-1; Y += 1) {
			if (KinkyDungeonMapGet(X, Y) == '1' && KDRandom() < barchance
				&& ((KinkyDungeonMapGet(X, Y-1) == '1' && KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X-1, Y) == '0' && KinkyDungeonMapGet(X+1, Y) == '0')
					|| (KinkyDungeonMapGet(X-1, Y) == '1' && KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X, Y-1) == '0' && KinkyDungeonMapGet(X, Y+1) == '0'))) {
				KinkyDungeonMapSet(X, Y, 'b');
			} else if (KinkyDungeonMapGet(X, Y) == '0'
				&& (KinkyDungeonMapGet(X+1, Y) != 'd' && KinkyDungeonMapGet(X+1, Y) != 'D'
					&& KinkyDungeonMapGet(X-1, Y) != 'd' && KinkyDungeonMapGet(X-1, Y) != 'D'
					&& KinkyDungeonMapGet(X, Y+1) != 'd' && KinkyDungeonMapGet(X, Y+1) != 'D'
					&& KinkyDungeonMapGet(X, Y-1) != 'd' && KinkyDungeonMapGet(X, Y-1) != 'D')
				&& ((KDRandom() < barrelChance*4 && KinkyDungeonMapGet(X-2, Y) == '1' && KinkyDungeonMapGet(X+2, Y) == '1' && KinkyDungeonMapGet(X, Y-2) == '1' && KinkyDungeonMapGet(X, Y+2) == '1')
					|| (KDRandom() < barrelChance*2 && KinkyDungeonMapGet(X-1, Y-1) == '1' && KinkyDungeonMapGet(X+1, Y-1) == '1' && KinkyDungeonMapGet(X-1, Y+1) == '1' && KinkyDungeonMapGet(X-1, Y+1) == '1')
					|| (KDRandom() < barrelChance && KinkyDungeonMapGet(X-1, Y) == '1' && KinkyDungeonMapGet(X+1, Y) == '0' && KinkyDungeonMapGet(X+1, Y-1) == '0' && KinkyDungeonMapGet(X+1, Y+1) == '0')
					|| (KDRandom() < barrelChance && KinkyDungeonMapGet(X+1, Y) == '1' && KinkyDungeonMapGet(X-1, Y) == '0' && KinkyDungeonMapGet(X-1, Y-1) == '0' && KinkyDungeonMapGet(X-1, Y+1) == '0')
					|| (KDRandom() < barrelChance && KinkyDungeonMapGet(X, Y-1) == '1' && KinkyDungeonMapGet(X, Y+1) == '0' && KinkyDungeonMapGet(X+1, Y+1) == '0' && KinkyDungeonMapGet(X-1, Y+1) == '0')
					|| (KDRandom() < barrelChance && KinkyDungeonMapGet(X, Y+1) == '1' && KinkyDungeonMapGet(X, Y-1) == '0' && KinkyDungeonMapGet(X+1, Y-1) == '0' && KinkyDungeonMapGet(X-1, Y-1) == '0'))) {
				KinkyDungeonMapSet(X, Y, 'L');
			}
		}
}

function KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density, hallopenness, floodChance) {
	// Variable setup

	let Walls = {};
	let WallsList = {};
	let VisitedCells = {};

	// Initialize the first cell in our Visited Cells list
	if (KDDebug) console.log("Created maze with dimensions " + width + "x" + height + ", openness: "+ openness + ", density: "+ density);

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
		// Update keys

		WallKeys = Object.keys(WallsList);
		//CellKeys = Object.keys(VisitedCells);
	}

	for (let X = 1; X < KinkyDungeonGridWidth; X += 1)
		for (let Y = 1; Y < KinkyDungeonGridWidth; Y += 1) {
			if ((X % 2 == 0 && Y % 2 == 1) || (X % 2 == 1 && Y % 2 == 0)) {
				let size = 1+Math.ceil(KDRandom() * (openness));
				if (KDRandom() < 0.4 - 0.02*density * size * size) {

					let tile = '0';

					// We open up the tiles
					for (let XX = X; XX < X +size; XX++)
						for (let YY = Y; YY < Y+size; YY++) {
							if (!KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(XX, YY)))
								KinkyDungeonMapSet(XX, YY, tile);
							VisitedCells[XX + "," + YY] = {x:XX, y:YY};
							KinkyDungeonMazeWalls({x:XX, y:YY}, Walls, WallsList);
							delete Walls[XX + "," + YY];
						}
				}
			}
		}

	// Now we STRETCH the map
	let KinkyDungeonOldGrid = KinkyDungeonGrid;
	let w = KinkyDungeonGridWidth;
	let h = KinkyDungeonGridHeight;
	KinkyDungeonGridWidth = Math.floor(KinkyDungeonGridWidth*2);
	KinkyDungeonGridHeight = Math.floor(KinkyDungeonGridHeight*2);
	KinkyDungeonGrid = "";

	// Generate the grid
	for (let Y = 0; Y < KinkyDungeonGridHeight; Y++) {
		for (let X = 0; X < KinkyDungeonGridWidth; X++)
			KinkyDungeonGrid = KinkyDungeonGrid + KinkyDungeonOldGrid[Math.floor(X * w / KinkyDungeonGridWidth) + Math.floor(Y * h / KinkyDungeonGridHeight)*(w+1)];
		KinkyDungeonGrid = KinkyDungeonGrid + '\n';
	}

	// Constrict hallways randomly in X
	for (let Y = 2; Y < KinkyDungeonGridHeight - 1; Y += 1) {
		if (KDRandom() < 0.4 - 0.04*hallopenness) {
			let row_top = [];
			let row_mid = [];
			let row_bot = [];
			for (let X = 0; X < KinkyDungeonGridWidth; X++) {
				row_top.push(KinkyDungeonMapGet(X, Y-1));
				row_mid.push(KinkyDungeonMapGet(X, Y));
				row_bot.push(KinkyDungeonMapGet(X, Y+1));
			}
			for (let X = 1; X < KinkyDungeonGridWidth-1; X++) {
				if (row_mid[X] == '0') {
					if (row_mid[X-1] == '0' || row_mid[X+1] == '0') {
						if (row_top[X] == '0' && row_bot[X] == '0' && (row_top[X-1] == '1' || row_bot[X+1] == '1')) {
							// Avoid creating diagonals
							if (((row_top[X+1] == '0' && row_bot[X+1] == '0') || row_mid[X+1] == '1')
								&& ((row_top[X-1] == '0' && row_bot[X-1] == '0') || row_mid[X-1] == '1')) {
								KinkyDungeonMapSet(X, Y, '1');
								X++;
							}
						}
					}
				}
			}
		}
	}

	// Constrict hallways randomly in Y
	for (let X = 2; X < KinkyDungeonGridWidth - 1; X += 1) {
		if (KDRandom() < 0.4 - 0.04*hallopenness) {
			let col_top = [];
			let col_mid = [];
			let col_bot = [];
			for (let Y = 0; Y < KinkyDungeonGridHeight; Y++) {
				col_top.push(KinkyDungeonMapGet(X-1, Y));
				col_mid.push(KinkyDungeonMapGet(X, Y));
				col_bot.push(KinkyDungeonMapGet(X+1, Y));
			}
			for (let Y = 1; Y < KinkyDungeonGridHeight-1; Y++) {
				if (col_mid[Y] == '0') {
					if (col_mid[Y-1] == '0' || col_mid[Y+1] == '0') {
						if (col_top[Y] == '0' && col_bot[Y] == '0' && (col_top[Y-1] == '1' || col_bot[Y+1] == '1')) {
							if (((col_top[Y+1] == '0' && col_bot[Y+1] == '0') || col_mid[Y+1] == '1')
								&& ((col_top[Y-1] == '0' && col_bot[Y-1] == '0') || col_mid[Y-1] == '1')) {
								KinkyDungeonMapSet(X, Y, '1');
								Y++;
							}
						}
					}
				}
			}
		}
	}

	for (let X = 2; X < KinkyDungeonGridWidth; X += 2)
		for (let Y = 2; Y < KinkyDungeonGridWidth; Y += 2) {
			let size = 2*Math.ceil(KDRandom() * (openness));
			if (KDRandom() < 0.4 - 0.04*density * size) {

				let tile = '0';
				if (floodChance > 0 && KDRandom() < floodChance) tile = 'w';

				// We open up the tiles
				for (let XX = X; XX < X +size; XX++)
					for (let YY = Y; YY < Y+size; YY++) {
						if (!KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(XX, YY)))
							KinkyDungeonMapSet(XX, YY, tile);
					}
			}
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

let canvasOffsetX = 0;
let canvasOffsetY = 0;
const canvasOffsetX_ui = 500;
const canvasOffsetY_ui = 164;

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

function KinkyDungeonControlsEnabled() {
	return KinkyDungeonSlowMoveTurns < 1 && KinkyDungeonStatFreeze < 1 && KDGameData.SleepTurns < 1 && !KDGameData.CurrentDialog;
}

function KDStartSpellcast(tx, ty, SpellToCast, enemy, player, bullet) {
	let spell = KinkyDungeonFindSpell(SpellToCast.name, true);
	let spellname = undefined;
	if (spell) {
		spellname = spell.name;
		spell = undefined;
	} else spell = SpellToCast;
	return KDSendInput("tryCastSpell", {tx: tx, ty: ty, spell: spell, spellname: spellname, enemy: enemy, player: player, bullet: bullet});
}

// Click function for the game portion
// @ts-ignore
// @ts-ignore
// @ts-ignore
function KinkyDungeonClickGame(Level) {
	let _CharacterRefresh = CharacterRefresh;
	let _CharacterAppearanceBuildCanvas = CharacterAppearanceBuildCanvas;
	// @ts-ignore
	CharacterRefresh = () => {KDRefresh = true;};
	// @ts-ignore
	CharacterAppearanceBuildCanvas = () => {};

	// First we handle buttons
	let prevSpell = KinkyDungeonTargetingSpell;
	if (KDGameData.CurrentDialog) {
		let result = false;
		try {
			result = KDHandleDialogue();
		} finally {
			// @ts-ignore
			CharacterRefresh = _CharacterRefresh;
			// @ts-ignore
			CharacterAppearanceBuildCanvas = _CharacterAppearanceBuildCanvas;
			// Done, converted to input
		}
		return result;
	}
	if (KinkyDungeonControlsEnabled() && KinkyDungeonHandleHUD()) {
		try {
			if (prevSpell) KinkyDungeonTargetingSpell = null;
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
		} finally {
			// @ts-ignore
			CharacterRefresh = _CharacterRefresh;
			// @ts-ignore
			CharacterAppearanceBuildCanvas = _CharacterAppearanceBuildCanvas;
		}
		return;
	}
	// beep
	else if (KinkyDungeonAutoWait && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
		KinkyDungeonAutoWait = false;

		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
	}
	// If no buttons are clicked then we handle move
	else if (KinkyDungeonControlsEnabled()) {
		try {
			KinkyDungeonSetMoveDirection();

			if (KinkyDungeonTargetingSpell) {
				if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
					if (KinkyDungeoCheckComponents(KinkyDungeonTargetingSpell).length == 0 || (
						(KinkyDungeonStatsChoice.get("Slayer") && KinkyDungeonTargetingSpell.school == "Elements")
						|| (KinkyDungeonStatsChoice.get("Conjurer") && KinkyDungeonTargetingSpell.school == "Conjure")
						|| (KinkyDungeonStatsChoice.get("Magician") && KinkyDungeonTargetingSpell.school == "Illusion"))) {
						if (KinkyDungeonSpellValid) {
							KDStartSpellcast(KinkyDungeonTargetX, KinkyDungeonTargetY, KinkyDungeonTargetingSpell, undefined, KinkyDungeonPlayerEntity, undefined);

							KinkyDungeonTargetingSpell = null;
						}
					} else KinkyDungeonTargetingSpell = null;
				} else KinkyDungeonTargetingSpell = null;
			} else if (KinkyDungeonIsPlayer() && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
				if (KinkyDungeonFastMove && Math.max(Math.abs(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)) > 1
					&& (KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0 || KinkyDungeonFogGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0 || KDistChebyshev(KinkyDungeonPlayerEntity.x - KinkyDungeonTargetX, KinkyDungeonPlayerEntity.y - KinkyDungeonTargetY) < 1.5)) {
					let requireLight = KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0;
					let path = KinkyDungeonFindPath(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonTargetX, KinkyDungeonTargetY, false, false, false, KinkyDungeonMovableTilesEnemy, requireLight, false, true);
					if (path) {
						KinkyDungeonFastMovePath = path;
						KinkyDungeonSleepTime = 100;
					}
				} else if (!KinkyDungeonFastMove || Math.max(Math.abs(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)) <= 1) {
					KDSendInput("move", {dir: KinkyDungeonMoveDirection, delta: 1, AllowInteract: true, AutoDoor: KinkyDungeonToggleAutoDoor});
				}
			}
		} finally {
			// @ts-ignore
			CharacterRefresh = _CharacterRefresh;
			// @ts-ignore
			CharacterAppearanceBuildCanvas = _CharacterAppearanceBuildCanvas;
		}
	}

	// @ts-ignore
	CharacterRefresh = _CharacterRefresh;
	// @ts-ignore
	CharacterAppearanceBuildCanvas = _CharacterAppearanceBuildCanvas;
	return;
}

function KinkyDungeonGetMovable() {
	let MovableTiles = KinkyDungeonMovableTiles;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Squeeze") > 0) MovableTiles = MovableTiles + "b";
	return MovableTiles;
}

function KinkyDungeonListenKeyMove() {
	if (KinkyDungeonLastMoveTimer < performance.now() && KinkyDungeonControlsEnabled()) {
		let moveDirection = null;
		let moveDirectionDiag = null;

		let MovableTiles = KinkyDungeonGetMovable();

		if ((KinkyDungeonGameKey.keyPressed[0]) && MovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x,  KinkyDungeonPlayerEntity.y - 1))) moveDirection = KinkyDungeonGetDirection(0, -1);
		else if ((KinkyDungeonGameKey.keyPressed[1]) && MovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x,  KinkyDungeonPlayerEntity.y + 1))) moveDirection = KinkyDungeonGetDirection(0, 1);
		else if ((KinkyDungeonGameKey.keyPressed[2]) && MovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x - 1,  KinkyDungeonPlayerEntity.y))) moveDirection = KinkyDungeonGetDirection(-1, 0);
		else if ((KinkyDungeonGameKey.keyPressed[3]) && MovableTiles.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x + 1,  KinkyDungeonPlayerEntity.y))) moveDirection = KinkyDungeonGetDirection(1, 0);
		// Diagonal moves
		if ((KinkyDungeonGameKey.keyPressed[4]) || (KinkyDungeonGameKey.keyPressed[2] && KinkyDungeonGameKey.keyPressed[0])) moveDirectionDiag = KinkyDungeonGetDirection(-1, -1);
		else if ((KinkyDungeonGameKey.keyPressed[5]) || (KinkyDungeonGameKey.keyPressed[3] && KinkyDungeonGameKey.keyPressed[0])) moveDirectionDiag = KinkyDungeonGetDirection(1, -1);
		else if ((KinkyDungeonGameKey.keyPressed[6]) || (KinkyDungeonGameKey.keyPressed[2] && KinkyDungeonGameKey.keyPressed[1])) moveDirectionDiag = KinkyDungeonGetDirection(-1, 1);
		else if ((KinkyDungeonGameKey.keyPressed[7]) || (KinkyDungeonGameKey.keyPressed[3] && KinkyDungeonGameKey.keyPressed[1])) moveDirectionDiag = KinkyDungeonGetDirection(1, 1);

		if ((KinkyDungeonGameKey.keyPressed[8])) {moveDirection = KinkyDungeonGetDirection(0, 0); moveDirectionDiag = null;}

		if (moveDirectionDiag && MovableTiles.includes(KinkyDungeonMapGet(moveDirectionDiag.x + KinkyDungeonPlayerEntity.x,  moveDirectionDiag.y + KinkyDungeonPlayerEntity.y))) {
			moveDirection = moveDirectionDiag;
		}

		if (moveDirection) {
			if (KinkyDungeonLastMoveTimerStart < performance.now() && KinkyDungeonLastMoveTimerStart > 0) {
				KDSendInput("move", {dir: moveDirection, delta: 1, AllowInteract: KinkyDungeonLastMoveTimer == 0, AutoDoor: KinkyDungeonToggleAutoDoor});
				KinkyDungeonLastMoveTimer = performance.now() + KinkyDungeonLastMoveTimerCooldown;
			} else if (KinkyDungeonLastMoveTimerStart == 0) {
				KinkyDungeonLastMoveTimerStart = performance.now()+ KinkyDungeonLastMoveTimerCooldownStart;
			}


		}
	}
	if (KinkyDungeonLastMoveTimerStart < performance.now() && KinkyDungeonLastMoveTimer == 0) KinkyDungeonLastMoveTimerStart = 0;
	if (!KinkyDungeonGameKey.keyPressed.some((element)=>{return element;})) { KinkyDungeonLastMoveTimer = 0;}
}

function KinkyDungeonGameKeyDown() {
	let moveDirection = null;

	if (KDGameData.CurrentDialog) return;
	if (!KinkyDungeonControlsEnabled()) return;

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
		KDSendInput("move", {dir: moveDirection, delta: 1, AutoDoor: KinkyDungeonToggleAutoDoor});
	// @ts-ignore
	} else if (KinkyDungeonKeySpell.includes(KinkyDungeonKeybindingCurrentKey)) {
		// @ts-ignore
		KinkyDungeonSpellPress = KinkyDungeonKeybindingCurrentKey;
		KinkyDungeonHandleSpell();
	} else if (KinkyDungeonKeyWeapon.includes(KinkyDungeonKeybindingCurrentKey)) {
		// @ts-ignore
		KinkyDungeonSpellPress = KinkyDungeonKeybindingCurrentKey;
		KinkyDungeonRangedAttack();
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

function KinkyDungeonLaunchAttack(Enemy, skip) {
	let attackCost = KinkyDungeonStatStaminaCostAttack;
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.staminacost) attackCost = -KinkyDungeonPlayerDamage.staminacost;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackStamina")) {
		attackCost = Math.min(0, attackCost * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackStamina")));
	}
	let noadvance = false;
	if (KinkyDungeonHasStamina(Math.abs(attackCost), true)) {
		if (!KDGameData.ConfirmAttack && (!KinkyDungeonAggressive(Enemy) || KDAllied(Enemy))) {
			KinkyDungeonSendActionMessage(10, TextGet("KDGameData.ConfirmAttack"), "red", 1);
			KDGameData.ConfirmAttack = true;
			noadvance = true;
		} else {
			KinkyDungeonAttackEnemy(Enemy, {damage: KinkyDungeonPlayerDamage.dmg, type: KinkyDungeonPlayerDamage.type, bind: KinkyDungeonPlayerDamage.bind, boundBonus: KinkyDungeonPlayerDamage.boundBonus, tease: KinkyDungeonPlayerDamage.tease});
			KinkyDungeonLastAction = "Attack";
			KDGameData.ConfirmAttack = false;

			KinkyDungeonChangeStamina(attackCost);
		}
	} else {
		KinkyDungeonWaitMessage();
	}

	if (!noadvance) {
		KinkyDungeonInterruptSleep();
		if (!skip)
			KinkyDungeonAdvanceTime(1);
	}
}

function KinkyDungeonMove(moveDirection, delta, AllowInteract) {
	let moveX = moveDirection.x + KinkyDungeonPlayerEntity.x;
	let moveY = moveDirection.y + KinkyDungeonPlayerEntity.y;
	let moved = false;
	let Enemy = KinkyDungeonEnemyAt(moveX, moveY);
	if (Enemy && (!Enemy.Enemy || !Enemy.Enemy.noblockplayer)) {
		if (AllowInteract) {
			KinkyDungeonLaunchAttack(Enemy);
		}
	} else {
		let MovableTiles = KinkyDungeonGetMovable();
		let moveObject = KinkyDungeonMapGet(moveX, moveY);
		if (MovableTiles.includes(moveObject) && (KinkyDungeonNoEnemy(moveX, moveY) || (Enemy.Enemy && Enemy.Enemy.noblockplayer))) { // If the player can move to an empy space or a door

			KDGameData.ConfirmAttack = false;

			if (KinkyDungeonTiles.get("" + moveX + "," + moveY) && KinkyDungeonTiles.get("" + moveX + "," + moveY).Type && ((KinkyDungeonToggleAutoDoor && moveObject == 'd' && KinkyDungeonTargetTile == null && KinkyDungeonNoEnemy(moveX, moveY, true))
				|| (KinkyDungeonTiles.get("" + moveX + "," + moveY).Type != "Trap" && (KinkyDungeonTiles.get("" + moveX + "," + moveY).Type != "Door" || (KinkyDungeonTiles.get("" + moveX + "," + moveY).Lock && KinkyDungeonTiles.get("" + moveX + "," + moveY).Type == "Door"))))) {
				if (AllowInteract) {
					KinkyDungeonTargetTileLocation = "" + moveX + "," + moveY;
					KinkyDungeonTargetTile = KinkyDungeonTiles.get(KinkyDungeonTargetTileLocation);
					KinkyDungeonTargetTileMsg();
				}
			} else if (moveX != KinkyDungeonPlayerEntity.x || moveY != KinkyDungeonPlayerEntity.y) {
				let newDelta = 1;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
				if (!KinkyDungeonHandleMoveObject(moveX, moveY, moveObject)) {// Move
					KinkyDungeonNoMoveFlag = false;
					KinkyDungeonConfirmStairs = false;
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
						if (KinkyDungeonSlowLevel == 1 && !KinkyDungeonStatsChoice.has("HeelWalker")) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonSlowed" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "yellow", 2, true);
						else if (KinkyDungeonSlowLevel == 2) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHopping" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "orange", 2, true);
						else if (KinkyDungeonSlowLevel == 3) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonInching" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);
						else if (KinkyDungeonSlowLevel > 3 && KinkyDungeonSlowLevel < 10) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrawling" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);
						else if (KinkyDungeonSlowLevel >= 10) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCantMove" + plugLevel).replace("plugs", dict).replace("(s)", dicts), "red", 2, true);

						let moveMult = Math.max(1, KinkyDungeonSlowLevel);
						if (KinkyDungeonSlowLevel > 9) moveMult = 1;
						if ((moveDirection.x != 0 || moveDirection.y != 0)) {
							if (KinkyDungeonSlowLevel > 1 || (!KinkyDungeonStatsChoice.has("HeelWalker") && KinkyDungeonSlowLevel > 0)) {
								KinkyDungeonChangeStamina(moveMult * (KinkyDungeonStatStaminaRegenPerSlowLevel * KinkyDungeonSlowLevel) * delta);
								KinkyDungeonStatWillpowerExhaustion = Math.max(1, KinkyDungeonStatWillpowerExhaustion);
							}
							KinkyDungeonStatDistraction += (KinkyDungeonStatPlugLevel * KinkyDungeonDistractionPerPlug * moveMult);
							if (KinkyDungeonHasCrotchRope) {
								if (KinkyDungeonStatPlugLevel == 0) KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrotchRope"), "pink", 2);
								KinkyDungeonStatDistraction += (KinkyDungeonCrotchRopeDistraction * moveMult);
							}
							if (KinkyDungeonVibeLevel == 0 && KinkyDungeonStatPlugLevel > 0 && !KinkyDungeonHasCrotchRope) KinkyDungeonStatDistraction -= KinkyDungeonStatDistractionRegen;
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
			+ (KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.33 ?
				((KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.67 ?
					"ArousedHeavy"
					: "Aroused"))
					: "")), "yellow", 2);
		else KinkyDungeonSendActionMessage(1, TextGet("Wait" + (KinkyDungeonStatDistraction > 12 ? "Aroused" : "")), "silver", 2);
	}

	if (!NoTime && KinkyDungeonStatStamina < KinkyDungeoNStatStaminaLow)
		KinkyDungeonStatStamina += KinkyDungeonStatStaminaRegenWait;

	KinkyDungeonLastAction = "Wait";
}

// Returns th number of turns that must elapse
function KinkyDungeonMoveTo(moveX, moveY) {
	//if (KinkyDungeonNoEnemy(moveX, moveY, true)) {
	if (KinkyDungeonPlayerEntity.x != moveX || KinkyDungeonPlayerEntity.y != moveY) {
		KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "move", 1);
	}
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
	let _CharacterRefresh = CharacterRefresh;
	let _CharacterAppearanceBuildCanvas = CharacterAppearanceBuildCanvas;
	// @ts-ignore
	CharacterRefresh = () => {KDRefresh = true;};
	// @ts-ignore
	CharacterAppearanceBuildCanvas = () => {};
	let start = performance.now();

	for (let inv of KinkyDungeonAllRestraint()) {
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
	KinkyDungeonUpdateEnemies(delta, true); //console.log("Enemy Check " + (performance.now() - now));
	KinkyDungeonUpdateBullets(delta, true); //console.log("Bullets Check " + (performance.now() - now));
	KinkyDungeonUpdateBulletsCollisions(delta); //console.log("Bullet Check " + (performance.now() - now));
	KinkyDungeonUpdateEnemies(delta, false); //console.log("Enemy Check " + (performance.now() - now));
	KinkyDungeonUpdateBullets(delta); //console.log("Bullets Check " + (performance.now() - now));
	KinkyDungeonUpdateBulletsCollisions(delta, true); //"catchup" phase for explosions!

	KinkyDungeonUpdateTileEffects(delta);
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1; continue;}
	}

	KinkyDungeonUpdateStats(delta);

	let toTile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	KinkyDungeonHandleMoveToTile(toTile);
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
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv))
			gagchance += KinkyDungeonGagMumbleChancePerRestraint;
	}
	if (!KinkyDungeonCanTalk() && KDRandom() < gagchance) {
		let msg = "KinkyDungeonGagMumble";
		let gagMsg = Math.floor(KDRandom() * 5);
		const GagEffect = -2 + SpeechGetGagLevel(KinkyDungeonPlayer, ["ItemMouth", "ItemMouth2", "ItemMouth3"]);
		gagMsg += GagEffect/3;
		gagMsg = Math.max(0, Math.min(7, Math.floor(gagMsg)));

		if (KDRandom() < KinkyDungeonStatDistraction / KinkyDungeonStatDistractionMax) msg = "KinkyDungeonGagMumbleAroused";

		msg = msg + gagMsg;

		if (!KinkyDungeonSendActionMessage(1, TextGet(msg), "#ffffff", 1, true))
			KinkyDungeonSendTextMessage(1, TextGet(msg), "#ffffff", 1, true);
	}
	let end = performance.now();
	if (KDDebug) console.log(`Tick ${KinkyDungeonCurrentTick} took ${(end - start)} milliseconds.`);

	KinkyDungeonLastTurnAction = KinkyDungeonLastAction;
	KinkyDungeonLastAction = "";
	if (KDGameData.AncientEnergyLevel > 1) KDGameData.AncientEnergyLevel = 1;

	// @ts-ignore
	CharacterRefresh = _CharacterRefresh;
	// @ts-ignore
	CharacterAppearanceBuildCanvas = _CharacterAppearanceBuildCanvas;

	if (KinkyDungeonInDanger()) KinkyDungeonSetFlag("DangerFlag",  3);
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
