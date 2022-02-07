"use strict";

// This file is for Kinky Dungeon unit tests, run from the console

function KDTestMapGen(count, FloorRange, Checkpoint) {
	KinkyDungeonSetCheckPoint(Checkpoint);
	for (let f = FloorRange; f < FloorRange + 10; f++) {
		console.log(`Testing floor ${f}`);
		MiniGameKinkyDungeonLevel = f;
		for (let i = 0; i < count; i++) {
			if (i % (count/10) == 0)
				console.log(`Testing iteration ${i}`);
			KinkyDungeonCreateMap(KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint], f, true);
			let accessible = KinkyDungeonIsAccessible(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y);
			if (!accessible) {
				console.log(`Error, stairs are inaccessible on iteration ${i}`);
				return;
			}
		}
	}
}