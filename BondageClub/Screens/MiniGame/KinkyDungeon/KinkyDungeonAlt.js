"use strict";

let alts = {
	"Tunnel": {
		name: "Tunnel",
		bossroom: false,
		width: 8,
		height: 8,
		setpieces: {
			"PearlChest": 100,
		},
		genType: "Tunnel",
		spawns: false,
		chests: false,
		shrines: true,
		orbs: 0,
		chargers: true,
		heart: false,
		specialtiles: true,
		shortcut: false,
		enemies: false,
		nojail: true,
		nokeys: true,
		nostairs: true,
		notraps: true,
		noShrineTypes: ["Commerce", "Will"],
	},
	"Jail": {
		name: "Jail",
		bossroom: false,
		width: 15,
		height: 15,
		setpieces: {
			"GuaranteedCell": 100,
			"ExtraCell": 20,
			"Bedroom": 10,
			"QuadCell": 7,
			"Storage": 12,
		},
		genType: "NarrowMaze",
		spawns: false,
		chests: false,
		shrines: true,
		orbs: 0,
		chargers: true,
		heart: false,
		specialtiles: true,
		shortcut: false,
		enemies: true,
		nojail: false,
		nokeys: true,
		nostairs: false,
		notraps: false,
		noRelease: true,
		releaseOnLowSec: true,
		noShrineTypes: ["Commerce"],
	},
	"JourneyFloor": {
		name: "JourneyFloor",
		bossroom: false,
		width: 10,
		height: 8,
		setpieces: {
		},
		genType: "JourneyFloor",
		spawns: false,
		chests: false,
		shrines: false,
		orbs: 0,
		chargers: false,
		heart: false,
		specialtiles: false,
		shortcut: false,
		enemies: false,
		nojail: true,
		nokeys: true,
		nolore: true,
		nostairs: true,
		notraps: true,
		skiptunnel: true, // Skip the ending tunnel
	},
	"Tutorial": {
		name: "Tutorial",
		bossroom: false,
		width: 30,
		height: 7,
		setpieces: {
		},
		genType: "Tutorial",
		spawns: false,
		chests: false,
		shrines: false,
		orbs: 0,
		chargers: false,
		heart: false,
		specialtiles: false,
		shortcut: false,
		enemies: false,
		nojail: true,
		nokeys: true,
		nolore: true,
		nostairs: true,
		notraps: true,
	},
};

let KDJourneyList = ["Random", "Harder"];

function KinkyDungeonAltFloor(Type) {
	return alts[Type];
}


let KinkyDungeonCreateMapGenType = {
	"Room": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateRoom(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance);
	},
	"JourneyFloor": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateJourneyFloor(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance);
	},
	"Tutorial": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateTutorial(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance);
	},
	"Tunnel": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateTunnel(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance);
	},
	"Chamber": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateMaze(POI, VisitedRooms, width, height, 2, 1.5, 8, floodChance);
	},
	"Maze": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateMaze(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance);
	},
	"NarrowMaze": (POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) => {
		KinkyDungeonCreateMaze(POI, VisitedRooms, width, height, 0, 10, 0, floodChance);
	},
};


function KinkyDungeonCreateMaze(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) {
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

	// We add POI's at dead ends
	for (let X = 1; X < KinkyDungeonGridWidth; X += 1)
		for (let Y = 1; Y < KinkyDungeonGridWidth; Y += 1) {
			let nearwalls = 0;
			for (let XX = X - 1; XX <= X + 1; XX += 1)
				for (let YY = Y - 1; YY <= Y + 1; YY += 1) {
					if (KinkyDungeonMapGet(XX, YY) == '1') {
						nearwalls += 1;
					}
				}
			if (nearwalls == 7) {
				POI.push({x: X*2, y: Y*2, requireTags: ["endpoint"], favor: [], used: false});
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
								KinkyDungeonMapSet(X, Y, 'X');
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


function KinkyDungeonCreateRoom(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) {
	// Variable setup

	KinkyDungeonCreateRectangle(0, 0, width, height, true, false, false, false);

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
}

function KinkyDungeonCreateTunnel(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) {
	// Variable setup

	KinkyDungeonCreateRectangle(0, 0, width, height, true, true, false, false);

	KinkyDungeonCreateRectangle(VisitedRooms[0].x, VisitedRooms[0].y - 1, 2, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, VisitedRooms[0].y, width - 2, 1, false, false, false, false);

	// Create the two branching hallways
	let b1 = 3 + Math.floor(KDRandom() * (width-7));
	let b2 = 4 + Math.floor(KDRandom() * (width-6));

	let y1 = VisitedRooms[0].y > 4 ? 1 : VisitedRooms[0].y;
	let h1 = VisitedRooms[0].y > 4 ? Math.abs(y1 - VisitedRooms[0].y) : height - VisitedRooms[0].y - 1;

	let y2 = VisitedRooms[0].y < height - 4 ? VisitedRooms[0].y : 1;
	let h2 = VisitedRooms[0].y < height - 4 ? Math.abs(height - 1 - VisitedRooms[0].y) : VisitedRooms[0].y - 1;

	if (Math.abs(b1 - b2) < 2) {
		if (b1 < width - 4) b2 = b1 + 2;
		else b2 = b1 - 2;
	}

	KinkyDungeonCreateRectangle(b1, y1, 1, h1, false, false, false, false);
	KinkyDungeonCreateRectangle(b2, y2, 1, h2, false, false, false, false);

	POI.push({x: VisitedRooms[0].x*2 + 7, y: VisitedRooms[0].y*2, requireTags: [], favor: ["PearlChest"], used: false});

	/*
	// Add the prison
	let py = (VisitedRooms[0].y < height - 5 ? height - 3 : 3);
	POI.push({x: 2*VisitedRooms[0].x + 4, y: 2*py, requireTags: [], favor: ["GuaranteedCell"], used: false});
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, Math.min(py, VisitedRooms[0].y), 1, Math.abs(VisitedRooms[0].y - py), false, false, false, false);
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, Math.min(py, VisitedRooms[0].y), b2-2, 1, false, false, false, false);
	KinkyDungeonCreateRectangle(b2, Math.min(py, VisitedRooms[0].y), 1, Math.abs(VisitedRooms[0].y - py), false, false, false, false);*/


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

	// Place a shop and a restoration shrine

	KinkyDungeonMapSet(VisitedRooms[0].x*2 + 3, VisitedRooms[0].y*2 + 1, 'A');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x*2 + 3) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Shrine", Name: "Will"});

	KinkyDungeonMapSet(VisitedRooms[0].x*2 + 3, VisitedRooms[0].y*2 - 2, 'A');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x*2 + 3) + "," + (VisitedRooms[0].y*2 - 2), {Type: "Shrine", Name: "Commerce"});

	// Place the exit stairs

	let boss = KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel + 1);
	let mods = !boss ? KDGetMapGenList(3, KDMapMods) : ["None", "None", "None"];
	if (!boss) {
		let exit1 = mods[0].name;
		KinkyDungeonMapSet(b1*2, VisitedRooms[0].y > 4 ? 2 : height*2 - 3, 's');
		KinkyDungeonMapSet(b1*2 + 1, VisitedRooms[0].y > 4 ? 2 : height*2 - 3, 'G');
		KinkyDungeonTiles.set("" + (b1*2) + "," + (VisitedRooms[0].y > 4 ? 2 : height*2 - 3), {MapMod: exit1});
		KinkyDungeonTiles.set("" + (b1*2 + 1) + "," + (VisitedRooms[0].y > 4 ? 2 : height*2 - 3), {Type: "Ghost", Msg: "MapMod" + exit1});

		let exit2 = mods[1].name;
		KinkyDungeonMapSet(b2*2 + 1, VisitedRooms[0].y < height - 4 ? height*2 - 3 : 2, 's');
		KinkyDungeonMapSet(b2*2, VisitedRooms[0].y < height - 4 ? height*2 - 3 : 2, 'G');
		KinkyDungeonTiles.set("" + (b2*2 + 1) + "," + (VisitedRooms[0].y < height - 4 ? height*2 - 3 : 2), {MapMod: exit2});
		KinkyDungeonTiles.set("" + (b2*2) + "," + (VisitedRooms[0].y < height - 4 ? height*2 - 3 : 2), {Type: "Ghost", Msg: "MapMod" + exit2});
	}

	let exit3 = boss ? "Boss" : mods[2].name;
	KinkyDungeonMapSet(width*2 - 2, VisitedRooms[0].y*2, 's');
	KinkyDungeonMapSet(width*2 - 2, VisitedRooms[0].y*2 + 1, 'G');
	if (!boss)
		KinkyDungeonTiles.set("" + (width*2 - 2) + "," + (VisitedRooms[0].y*2), {MapMod: exit3});
	KinkyDungeonTiles.set("" + (width*2 - 2) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "MapMod" + exit3});

	KinkyDungeonEndPosition = {x: width*2 - 2, y: VisitedRooms[0].y*2};

	// Place quest NPCs
	let quests = KDQuestList(2 + Math.round(KDRandom()), KDQuests, "Tunnel", "");
	for (let q of quests) {
		if (q.npc)
			KinkyDungeonSummonEnemy(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y, q.npc, 1, 14, true);
	}
}


function KinkyDungeonCreateJourneyFloor(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) {
	// Variable setup

	KinkyDungeonStartPosition = {x: 2, y: height};
	VisitedRooms[0].x = 1;
	VisitedRooms[0].y = Math.floor(height/2);

	KinkyDungeonCreateRectangle(0, 0, width, height, true, true, false, false);

	KinkyDungeonCreateRectangle(VisitedRooms[0].x, VisitedRooms[0].y - 1, 2, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, VisitedRooms[0].y, 6, 1, false, false, false, false);

	// Create a branching room for journeys
	let b1 = 4;
	KinkyDungeonCreateRectangle(b1, VisitedRooms[0].y - 3, width - b1, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(b1, VisitedRooms[0].y - 3, 1, 3, false, false, false, false);

	/*
	// Add the prison
	let py = (VisitedRooms[0].y < height - 5 ? height - 3 : 3);
	POI.push({x: 2*VisitedRooms[0].x + 4, y: 2*py, requireTags: [], favor: ["GuaranteedCell"], used: false});
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, Math.min(py, VisitedRooms[0].y), 1, Math.abs(VisitedRooms[0].y - py), false, false, false, false);
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, Math.min(py, VisitedRooms[0].y), b2-2, 1, false, false, false, false);
	KinkyDungeonCreateRectangle(b2, Math.min(py, VisitedRooms[0].y), 1, Math.abs(VisitedRooms[0].y - py), false, false, false, false);*/


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

	// Normal end stairs
	KinkyDungeonMapSet(b1*2 + 5, VisitedRooms[0].y*2, 's');
	KinkyDungeonMapSet(b1*2 + 5, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (b1*2 + 5) + "," + (VisitedRooms[0].y*2), {Journey: undefined});
	KinkyDungeonTiles.set("" + (b1*2 + 5) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "JourneyNone"});

	// Tutorial end stairs
	KinkyDungeonMapSet(VisitedRooms[0].x*2 + 3, VisitedRooms[0].y*2 - 2, 's');
	KinkyDungeonMapSet(VisitedRooms[0].x*2 + 3, VisitedRooms[0].y*2 - 1, 'G');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x*2 + 3) + "," + (VisitedRooms[0].y*2 - 2), {RoomType: "Tutorial"});
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x*2 + 3) + "," + (VisitedRooms[0].y*2 - 1), {Type: "Ghost", Msg: "JourneyTutorial"});

	// Place journey stairs
	let x = b1 * 2;
	let i = 0;
	while (x < width*2-2) {
		if (KDJourneyList[i]) {
			KinkyDungeonMapSet(x, VisitedRooms[0].y*2 - 6, 's');
			KinkyDungeonMapSet(x, VisitedRooms[0].y*2 - 5, 'G');
			KinkyDungeonTiles.set("" + (x) + "," + (VisitedRooms[0].y*2 - 6), {Journey: KDJourneyList[i]});
			KinkyDungeonTiles.set("" + (x) + "," + (VisitedRooms[0].y*2 - 5), {Type: "Ghost", Msg: "Journey" + KDJourneyList[i]});
		}
		i++;
		x += 2;
	}

	KinkyDungeonEndPosition = {x: b1*2 + 5, y: VisitedRooms[0].y*2};
}


function KinkyDungeonCreateTutorial(POI, VisitedRooms, width, height, openness, density, hallopenness, floodChance) {
	// Variable setup

	KinkyDungeonStartPosition = {x: 2, y: height};
	VisitedRooms[0].x = 1;
	VisitedRooms[0].y = Math.floor(height/2);

	KinkyDungeonCreateRectangle(0, 0, width, height, true, true, false, false);

	KinkyDungeonCreateRectangle(VisitedRooms[0].x, VisitedRooms[0].y - 1, 2, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, VisitedRooms[0].y, width, 1, false, false, false, false);


	/*
	// Add the prison
	let py = (VisitedRooms[0].y < height - 5 ? height - 3 : 3);
	POI.push({x: 2*VisitedRooms[0].x + 4, y: 2*py, requireTags: [], favor: ["GuaranteedCell"], used: false});
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, Math.min(py, VisitedRooms[0].y), 1, Math.abs(VisitedRooms[0].y - py), false, false, false, false);
	KinkyDungeonCreateRectangle(VisitedRooms[0].x, Math.min(py, VisitedRooms[0].y), b2-2, 1, false, false, false, false);
	KinkyDungeonCreateRectangle(b2, Math.min(py, VisitedRooms[0].y), 1, Math.abs(VisitedRooms[0].y - py), false, false, false, false);*/


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

	// Normal end stairs
	KinkyDungeonMapSet(width*2 - 2, VisitedRooms[0].y*2, 's');
	KinkyDungeonMapSet(width*2 - 2, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (width*2 - 2) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "TutorialCongrats"});

	// Tutorial start
	KinkyDungeonMapSet(VisitedRooms[0].x + 3, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x + 3) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial0"});

	// Barrels
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + 7, 3, 2, height*2, false, false, false, false);
	KinkyDungeonMapSet(VisitedRooms[0].x + 7, VisitedRooms[0].y*2, 'L');
	KinkyDungeonMapSet(VisitedRooms[0].x + 7, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x + 7) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Dialogue: "Tutorial1"});

	// Stats
	KinkyDungeonMapSet(VisitedRooms[0].x + 11, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x + 11) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2"});

	// SP
	let xx = 13;
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx + 4, 3, 2, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx + 4, 3, 1, 5, false, false, false, false);
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 4, 5, 'd');
	KinkyDungeonTiles.set((KinkyDungeonStartPosition.x + xx + 4) + "," + 5, {
		Type: "Door",
	});

	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 2, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 1, 5, false, false, false, false);
	KinkyDungeonGroundItems.push({x:KinkyDungeonStartPosition.x + xx, y:4, name: "PotionStamina"});
	KinkyDungeonMapSet(VisitedRooms[0].x + xx + 1, 5, 'T');
	KinkyDungeonTiles.set((VisitedRooms[0].x + xx + 1) + "," + 5, {
		Type: "Trap",
		Trap: "SpecificSpell",
		noVary: true,
		Spell: "TrapSCloud",
	});
	KinkyDungeonMapSet(VisitedRooms[0].x + xx + 3, VisitedRooms[0].y*2, 'T');
	KinkyDungeonTiles.set((VisitedRooms[0].x + xx + 3) + "," + (VisitedRooms[0].y*2), {
		Type: "Trap",
		Trap: "SpecificSpell",
		noVary: true,
		Spell: "TrapSCloud",
	});
	KinkyDungeonMapSet(VisitedRooms[0].x + xx + 3, VisitedRooms[0].y*2 + 1, 'T');
	KinkyDungeonTiles.set((VisitedRooms[0].x + xx + 3) + "," + (VisitedRooms[0].y*2 + 1), {
		Type: "Trap",
		Trap: "SpecificSpell",
		noVary: true,
		Spell: "TrapSCloud",
	});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 1, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 1) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2_sp1"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 1, 3, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 1) + "," + (3), {Type: "Ghost", Msg: "Tutorial2_sp2"});
	KinkyDungeonMapSet(VisitedRooms[0].x + xx + 4, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (VisitedRooms[0].x + xx + 4) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2_sp3"});


	// MP
	xx = 22;
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 2, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 1, 5, false, false, false, false);
	KinkyDungeonGroundItems.push({x:KinkyDungeonStartPosition.x + xx, y:4, name: "PotionMana"});
	KinkyDungeonMapSet(VisitedRooms[0].x + xx + 1, 5, 'd');
	KinkyDungeonTiles.set((VisitedRooms[0].x + xx + 1) + "," + 5, {
		Type: "Door",
	});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 5, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 5) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2_mp1"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 3, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 3) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2_mp2"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 1, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 1) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Dialogue: "Tutorial2_mp3"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 2, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 2) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2_mp4"});


	// DP
	xx = 28;
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 7, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 1, 5, false, false, false, false);
	KinkyDungeonGroundItems.push({x:KinkyDungeonStartPosition.x + xx, y:4, name: "PotionFrigid"});
	KinkyDungeonMapSet(VisitedRooms[0].x + xx + 1, 5, 'T');
	KinkyDungeonTiles.set((VisitedRooms[0].x + xx + 1) + "," + 5, {
		Type: "Trap",
		Trap: "SpecificSpell",
		noVary: true,
		Spell: "TrapLustCloud",
	});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 1, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 1) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial2_dp1"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 1, 3, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 1) + "," + (3), {Type: "Ghost", Dialogue: "Tutorial2_dp2"});


	// Struggle
	xx = 36;
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 5, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 1, 5, false, false, false, false);
	KinkyDungeonGroundItems.push({x:KinkyDungeonStartPosition.x + xx + 4, y:4, name: "RedKey"});

	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 1, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 1) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial3_1"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 4, 3, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 4) + "," + (3), {Type: "Ghost", Msg: "Tutorial3_2"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 1, 3, 'C');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 1) + "," + (3), {Loot: "tutorial1", Roll: KDRandom()});

	// Struggle
	xx = 43;
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 5, 2, false, false, false, false);
	KinkyDungeonCreateRectangle(KinkyDungeonStartPosition.x + xx, 3, 1, 5, false, false, false, false);
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 4, 4, '?');

	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx - 1, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx - 1) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial3_3"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 4, 3, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 4) + "," + (3), {Type: "Ghost", Msg: "Tutorial3_4"});
	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx, 3, 'C');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx) + "," + (3), {Loot: "tutorial2", Roll: KDRandom()});

	// END


	KinkyDungeonMapSet(KinkyDungeonStartPosition.x + xx + 4, VisitedRooms[0].y*2 + 1, 'G');
	KinkyDungeonTiles.set("" + (KinkyDungeonStartPosition.x + xx + 4) + "," + (VisitedRooms[0].y*2 + 1), {Type: "Ghost", Msg: "Tutorial4"});

	DialogueCreateEnemy(width*2 - 7, VisitedRooms[0].y*2, "FastZombie").AI = "guard";
	DialogueCreateEnemy(width*2 - 5, VisitedRooms[0].y*2 + 1, "FastZombie").AI = "guard";
	DialogueCreateEnemy(width*2 - 3, VisitedRooms[0].y*2, "FastZombie").AI = "guard";
	DialogueCreateEnemy(width*2 - 3, VisitedRooms[0].y*2 + 1, "BlindZombie").AI = "guard";

	KinkyDungeonMapSet(width*2 - 5, VisitedRooms[0].y*2, 'C');
	KinkyDungeonTiles.set("" + (width*2 - 5) + "," + (VisitedRooms[0].y*2), {Loot: "silver", Roll: KDRandom()});
	KinkyDungeonMapSet(width*2 - 6, VisitedRooms[0].y*2, 'C');
	KinkyDungeonTiles.set("" + (width*2 - 6) + "," + (VisitedRooms[0].y*2), {Loot: "chest", Roll: KDRandom()});

	KinkyDungeonEndPosition = {x: width*2 - 2, y: VisitedRooms[0].y*2};
}