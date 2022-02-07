"use strict";
// Lots of good info here: http://www.adammil.net/blog/v125_Roguelike_Vision_Algorithms.html#permissivecode
// For this implementation I decided that ray calculations are too much so I just did a terraria style lighting system
// -Ada


let KinkyDungeonSeeAll = false;

function KinkyDungeonCheckProjectileClearance(x1, y1, x2, y2) {
	let tiles = KinkyDungeonTransparentObjects;
	let dist = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	for (let d = 0; d < dist; d += 0.5) {
		let mult = d / dist;
		let xx = x1 + mult * (x2-x1);
		let yy = y1 + mult * (y2-y1);
		if (!tiles.includes(KinkyDungeonMapGet(Math.round(xx), Math.round(yy)))) return false;
	}
	return true;
}

function KinkyDungeonCheckPath(x1, y1, x2, y2, allowBars, allowEnemies) {
	let length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	let obj = allowBars ? KinkyDungeonTransparentObjects : KinkyDungeonTransparentMovableObjects;

	for (let F = 0; F <= length; F++) {
		let xx = x1 + (x2-x1)*F/length;
		let yy = y1 + (y2-y1)*F/length;

		if ((Math.round(xx) != x1 || Math.round(yy) != y1) && (Math.round(xx) != x2 || Math.round(yy) != y2)) {
			let hits = 0;
			if (!obj.includes(KinkyDungeonMapGet(Math.floor(xx), Math.floor(yy))) || ((xx != x1 || yy != y1) && (allowEnemies && KinkyDungeonEnemyAt(Math.floor(xx), Math.floor(yy))))) hits += 1;
			if (!obj.includes(KinkyDungeonMapGet(Math.round(xx), Math.round(yy))) || ((xx != x1 || yy != y1) && (allowEnemies && KinkyDungeonEnemyAt(Math.round(xx), Math.round(yy))))) hits += 1;
			if (hits < 2 && !obj.includes(KinkyDungeonMapGet(Math.ceil(xx), Math.ceil(yy))) || ((xx != x1 || yy != y1) && (allowEnemies && KinkyDungeonEnemyAt(Math.ceil(xx), Math.ceil(yy))))) hits += 1;


			if (hits >= 2) return false;
		}
	}

	return true;
}

function KinkyDungeonResetFog() {
	KinkyDungeonFogGrid = [];
	// Generate the grid
	for (let X = 0; X < KinkyDungeonGridWidth; X++) {
		for (let Y = 0; Y < KinkyDungeonGridHeight; Y++)
			KinkyDungeonFogGrid.push(0); // 0 = pitch dark
	}
}

function KinkyDungeonMakeLightMap(width, height, Lights, delta) {
	let flags = {
		SeeThroughWalls: 0,
	};

	KinkyDungeonSendEvent("vision",{update: delta, flags: flags});

	KinkyDungeonBlindLevelBase = 0; // Set to 0 when consumed. We only redraw lightmap once so this is safe.
	KinkyDungeonLightGrid = [];
	// Generate the grid
	for (let X = 0; X < KinkyDungeonGridWidth; X++) {
		for (let Y = 0; Y < KinkyDungeonGridHeight; Y++)
			KinkyDungeonLightGrid.push(0); // 0 = pitch dark
	}
	let maxPass = 0;

	for (let L = 0; L < Lights.length; L++) {
		maxPass = Math.max(maxPass, Lights[L].brightness);
		KinkyDungeonLightSet(Lights[L].x, Lights[L].y, Lights[L].brightness);
	}

	let visionBlockers = {};
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let EE = KinkyDungeonEntities[E];
		let Enemy = EE.Enemy;
		if (Enemy && Enemy.blockVision || (Enemy.blockVisionWhileStationary && !EE.moved && EE.idle)) // Add
			visionBlockers[EE.x + "," + EE.y] = true;
	}

	for (let L = maxPass; L > 0; L--) {
		// if a grid square is next to a brighter transparent object, it gets that light minus one, or minus two if diagonal

		// Main grid square loop
		for (let X = 0; X < KinkyDungeonGridWidth; X++) {
			for (let Y = 0; Y < KinkyDungeonGridHeight; Y++) {
				let tile = KinkyDungeonMapGet(X, Y);
				if (((flags.SeeThroughWalls || KinkyDungeonTransparentObjects.includes(tile)) || (X == KinkyDungeonPlayerEntity.x && Y == KinkyDungeonPlayerEntity.y)) && !visionBlockers[X + "," + Y]) {
					let brightness = KinkyDungeonLightGet(X, Y);
					if (brightness > 0) {
						let nearbywalls = 0;
						for (let XX = X-1; XX <= X+1; XX++)
							for (let YY = Y-1; YY <= Y+1; YY++)
								if (!KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(XX, YY)) || visionBlockers[XX + "," + YY]) nearbywalls += 1;

						if (nearbywalls > 3 && brightness <= 3 && X != KinkyDungeonPlayerEntity.x && Y != KinkyDungeonPlayerEntity.y) brightness -= 1;
						if (flags.SeeThroughWalls && !KinkyDungeonTransparentObjects.includes(tile)) {
							if (flags.SeeThroughWalls > 2)
								brightness -= 2;
							else if (flags.SeeThroughWalls > 1)
								brightness -= 3;
							else brightness -= 4;
						}

						if (brightness > 0) {
							if (Number(KinkyDungeonLightGet(X-1, Y)) < brightness) KinkyDungeonLightSet(X-1, Y, (brightness - 1));
							if (Number(KinkyDungeonLightGet(X+1, Y)) < brightness) KinkyDungeonLightSet(X+1, Y, (brightness - 1));
							if (Number(KinkyDungeonLightGet(X, Y-1)) < brightness) KinkyDungeonLightSet(X, Y-1, (brightness - 1));
							if (Number(KinkyDungeonLightGet(X, Y+1)) < brightness) KinkyDungeonLightSet(X, Y+1, (brightness - 1));

							if (brightness > 1) {
								if (Number(KinkyDungeonLightGet(X-1, Y-1)) < brightness) KinkyDungeonLightSet(X-1, Y-1, (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
								if (Number(KinkyDungeonLightGet(X-1, Y+1)) < brightness) KinkyDungeonLightSet(X-1, Y+1, (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
								if (Number(KinkyDungeonLightGet(X+1, Y-1)) < brightness) KinkyDungeonLightSet(X+1, Y-1, (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
								if (Number(KinkyDungeonLightGet(X+1, Y+1)) < brightness) KinkyDungeonLightSet(X+1, Y+1, (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
							}
						}
					}
				}
			}
		}
	}

	if (KinkyDungeonSeeAll) {
		KinkyDungeonLightGrid = [];
		// Generate the grid
		for (let X = 0; X < KinkyDungeonGridWidth; X++) {
			for (let Y = 0; Y < KinkyDungeonGridHeight; Y++)
				//KinkyDungeonLightGrid = KinkyDungeonLightGrid + '9'; // 0 = pitch dark
				KinkyDungeonLightGrid.push(10); // 0 = pitch dark
			//KinkyDungeonLightGrid = KinkyDungeonLightGrid + '\n';
		}
	} else {
		// Generate the grid
		let dist = 0;
		for (let X = 0; X < KinkyDungeonGridWidth; X++) {
			for (let Y = 0; Y < KinkyDungeonGridHeight; Y++)
				if (X >= 0 && X <= width-1 && Y >= 0 && Y <= height-1) {
					dist = KDistChebyshev(KinkyDungeonPlayerEntity.x - X, KinkyDungeonPlayerEntity.y - Y);
					if (dist < 3) {
						if (dist < 3
							&& KDistEuclidean(KinkyDungeonPlayerEntity.x - X, KinkyDungeonPlayerEntity.y - Y) < 2.9
							&& KinkyDungeonCheckPath(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, X, Y)) {
							KinkyDungeonFogGrid[X + Y*(width)] = Math.max(KinkyDungeonFogGrid[X + Y*(width)], 3);
						}
						if (dist < 1.5 && KinkyDungeonLightGrid[X + Y*(width)] == 0) {
							KinkyDungeonLightGrid[X + Y*(width)] = 1;
						}
					}

					KinkyDungeonFogGrid[X + Y*(width)] = Math.max(KinkyDungeonFogGrid[X + Y*(width)], KinkyDungeonLightGrid[X + Y*(width)]);
				}
		}
	}
}