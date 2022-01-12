"use strict";
// Lots of good info here: http://www.adammil.net/blog/v125_Roguelike_Vision_Algorithms.html#permissivecode
// For this implementation I decided that ray calculations are too much so I just did a terraria style lighting system
// -Ada


let KinkyDungeonSeeAll = false;

function KinkyDungeonCheckPath(x1, y1, x2, y2, allowBars) {
	let length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	let obj = allowBars ? KinkyDungeonTransparentObjects : KinkyDungeonTransparentMovableObjects;

	for (let F = 0; F <= length; F++) {
		let xx = x1 + (x2-x1)*F/length;
		let yy = y1 + (y2-y1)*F/length;

		if ((xx != x1 || yy != y1) && (xx != x2 || yy != y2)) {
			let hits = 0;
			if (!obj.includes(KinkyDungeonMapGet(Math.floor(xx), Math.floor(yy)))) hits += 1;
			if (!obj.includes(KinkyDungeonMapGet(Math.round(xx), Math.round(yy)))) hits += 1;
			if (hits < 2 && !obj.includes(KinkyDungeonMapGet(Math.ceil(xx), Math.ceil(yy)))) hits += 1;


			if (hits >= 2) return false;
		}
	}

	return true;
}

function KinkyDungeonMakeLightMap(width, height, Lights) {
	KinkyDungeonBlindLevelBase = 0; // Set to 0 when consumed. We only redraw lightmap once so this is safe.
	KinkyDungeonLightGrid = "";
	// Generate the grid
	for (let X = 0; X < KinkyDungeonGridHeight; X++) {
		for (let Y = 0; Y < KinkyDungeonGridWidth; Y++)
			KinkyDungeonLightGrid = KinkyDungeonLightGrid + '0'; // 0 = pitch dark
		KinkyDungeonLightGrid = KinkyDungeonLightGrid + '\n';
	}
	let maxPass = 0;

	for (let L = 0; L < Lights.length; L++) {
		maxPass = Math.max(maxPass, Lights[L].brightness);
		KinkyDungeonLightSet(Lights[L].x, Lights[L].y, "" + Lights[L].brightness);
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
				if ((KinkyDungeonTransparentObjects.includes(tile) || (X == KinkyDungeonPlayerEntity.x && Y == KinkyDungeonPlayerEntity.y)) && !visionBlockers[X + "," + Y]) {
					let brightness = KinkyDungeonLightGet(X, Y);
					if (brightness > 0) {
						let nearbywalls = 0;
						for (let XX = X-1; XX <= X+1; XX++)
							for (let YY = Y-1; YY <= Y+1; YY++)
								if (!KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(XX, YY)) || visionBlockers[XX + "," + YY]) nearbywalls += 1;

						if (nearbywalls > 3 && brightness <= 3 && X != KinkyDungeonPlayerEntity.x && Y != KinkyDungeonPlayerEntity.y) brightness -= 1;

						if (brightness > 0) {
							if (Number(KinkyDungeonLightGet(X-1, Y)) < brightness) KinkyDungeonLightSet(X-1, Y, "" + (brightness - 1));
							if (Number(KinkyDungeonLightGet(X+1, Y)) < brightness) KinkyDungeonLightSet(X+1, Y, "" + (brightness - 1));
							if (Number(KinkyDungeonLightGet(X, Y-1)) < brightness) KinkyDungeonLightSet(X, Y-1, "" + (brightness - 1));
							if (Number(KinkyDungeonLightGet(X, Y+1)) < brightness) KinkyDungeonLightSet(X, Y+1, "" + (brightness - 1));

							if (brightness > 1) {
								if (Number(KinkyDungeonLightGet(X-1, Y-1)) < brightness) KinkyDungeonLightSet(X-1, Y-1, "" + (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
								if (Number(KinkyDungeonLightGet(X-1, Y+1)) < brightness) KinkyDungeonLightSet(X-1, Y+1, "" + (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
								if (Number(KinkyDungeonLightGet(X+1, Y-1)) < brightness) KinkyDungeonLightSet(X+1, Y-1, "" + (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
								if (Number(KinkyDungeonLightGet(X+1, Y+1)) < brightness) KinkyDungeonLightSet(X+1, Y+1, "" + (brightness - 1-(Math.random() > 0.4 ? 1 : 0)));
							}
						}
					}
				}
			}
		}
	}

	if (KinkyDungeonSeeAll) {
		KinkyDungeonLightGrid = "";
		// Generate the grid
		for (let X = 0; X < KinkyDungeonGridHeight; X++) {
			for (let Y = 0; Y < KinkyDungeonGridWidth; Y++)
				KinkyDungeonLightGrid = KinkyDungeonLightGrid + '9'; // 0 = pitch dark
			KinkyDungeonLightGrid = KinkyDungeonLightGrid + '\n';
		}
	}
}