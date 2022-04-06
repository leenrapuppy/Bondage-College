"use strict";

// This file is for Kinky Dungeon unit tests, run from the console

function KDRunTests() {
	KDDebug = true;
	if (KDTestMapGen(100, [0, 6, 12, 18,], [0, 1, 2, 3, 11,])
		&& KDTestFullRunthrough(3, true, true)) {
		console.log("All tests passed!");
	}
	KDDebug = false;
}

function KDTestMapGen(count, Ranges, Checkpoints) {
	for (let Checkpoint of Checkpoints) {
		MiniGameKinkyDungeonCheckpoint = Checkpoint;
		for (let FloorRange of Ranges)
			for (let f = FloorRange; f < FloorRange + 6; f++) {
				console.log(`Testing floor ${f}`);
				MiniGameKinkyDungeonLevel = f;
				for (let i = 0; i < count; i++) {
					if (i % (count/KDLevelsPerCheckpoint) == 0)
						console.log(`Testing iteration ${i} on floor ${MiniGameKinkyDungeonLevel}`);
					KinkyDungeonCreateMap(KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint], f, true);
					let accessible = KinkyDungeonIsAccessible(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y);
					if (!accessible) {
						console.log(`Error, stairs are inaccessible on iteration ${i}`);
						return false;
					}
				}
			}
	}
	return true;
}


function KDTestFullRunthrough(GameLoops, Init, NGP) {
	let EnemySpawnData = {};
	console.log("Testing full runthrough");
	if (Init) {
		MiniGameKinkyDungeonLevel = 1;
		MiniGameKinkyDungeonCheckpoint = 0;
		KinkyDungeonInitialize(1);
	}
	for (let i = 0; i < KinkyDungeonMaxLevel * GameLoops; i++) {
		// Run through the stairs
		KinkyDungeonHandleStairs('s', true);
		console.log(`Arrived at floor ${MiniGameKinkyDungeonLevel}`);

		if (!EnemySpawnData["" + MiniGameKinkyDungeonCheckpoint]) {
			EnemySpawnData["" + MiniGameKinkyDungeonCheckpoint] = {};
		}
		for (let e of KinkyDungeonEntities) {
			if (EnemySpawnData["" + MiniGameKinkyDungeonCheckpoint][e.Enemy.name] == undefined)
				EnemySpawnData["" + MiniGameKinkyDungeonCheckpoint][e.Enemy.name] = 1;
			else EnemySpawnData["" + MiniGameKinkyDungeonCheckpoint][e.Enemy.name] += 1;
		}

		if (KinkyDungeonState == "End") {
			if (NGP)
				KinkyDungeonNewGamePlus();
			else {
				MiniGameKinkyDungeonLevel = 1;
				MiniGameKinkyDungeonCheckpoint = 0;
				KinkyDungeonState = "Game";
			}
		}

		// Check various things
		if (KinkyDungeonEnemies.length < 1) {
			console.log(`Error, no enemies on floor ${MiniGameKinkyDungeonLevel}, iteration ${i}`);
			return false;
		} else if (MiniGameKinkyDungeonCheckpoint != Math.floor(MiniGameKinkyDungeonLevel / 10)) {
			console.log(`Error, wrong checkpoint on floor ${MiniGameKinkyDungeonLevel}, iteration ${i}: Found ${MiniGameKinkyDungeonCheckpoint}, Checkpoint should be ${Math.floor(MiniGameKinkyDungeonLevel / 10)}`);
			return false;
		}
	}
	console.log(EnemySpawnData);
	return true;
}