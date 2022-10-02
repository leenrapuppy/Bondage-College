"use strict";

/**
 * @param {number} startx - the start position
 * @param {number} starty - the start position
 * @param {number} endx - the end positon
 * @param {number} endy - the end positon
 * @param {boolean} blockEnemy - Do enemies block movement?
 * @param {boolean} blockPlayer - Does player block movement?
 * @param {string} Tiles - Allowed move tiles!
 * @returns {any} - Returns an array of x, y points in order
 */
function KinkyDungeonFindPath(startx, starty, endx, endy, blockEnemy, blockPlayer, ignoreLocks, Tiles, RequireLight, noDoors, needDoorMemory) {
	if (KDistChebyshev(startx - endx, starty - endy) < 1.5) {
		return [{x: endx, y: endy}];
	}

	function heuristic(xx, yy, endxx, endyy) {
		return Math.sqrt((xx - endxx) * (xx - endxx) + (yy - endyy) * (yy - endyy));
	}
	// g = cost
	// f = cost with heuristic
	// s = source
	let TilesTemp = Tiles;
	if (noDoors) TilesTemp = Tiles.replace("D", "");
	let start = {x: startx, y: starty, g: 0, f: 0, s: ""};

	// We generate a grid based on map size
	let open = new Map();
	open.set(startx + "," + starty, start);
	let closed = new Map();

	while(open.size > 0) {
		let lowest = {}; lowest = undefined;
		let lc = 1000000000;
		open.forEach(o => {
			if (o.f < lc) {
				lc = o.f;
				lowest = o;
			}
		});
		if (lowest) {
			let moveCost = 1;
			let succ = new Map();
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x != 0 || y != 0) {
						let xx = lowest.x + x;
						let yy = lowest.y + y;
						let tile = (xx == endx && yy == endy) ? "" : KinkyDungeonMapGet(xx, yy);
						if (xx == endx && yy == endy) {
							closed.set(lowest.x + "," + lowest.y, lowest);
							return KinkyDungeonGetPath(closed, lowest.x, lowest.y, endx, endy);
						}
						else if (TilesTemp.includes(tile) && (!RequireLight || KinkyDungeonLightGet(xx, yy) > 0)
							&& (ignoreLocks || !KinkyDungeonTiles.get((xx) + "," + (yy)) || !KinkyDungeonTiles.get(xx + "," + yy).Lock)
							&& (!blockEnemy || KinkyDungeonNoEnemy(xx, yy, blockPlayer))
							&& (!needDoorMemory || tile != "d" || KinkyDungeonTilesMemory.get(xx + "," + yy) == "DoorOpen")) {
							let costBonus = 0;
							if (KinkyDungeonMapGet(xx, yy) == "D") costBonus = 2;
							else if (KinkyDungeonMapGet(xx, yy) == "d") costBonus = 1;
							else if (KinkyDungeonMapGet(xx, yy) == "g") costBonus = 2;
							else if (KinkyDungeonMapGet(xx, yy) == "L") costBonus = 2;
							costBonus = (KinkyDungeonTiles.get((xx) + "," + (yy)) && KinkyDungeonTiles.get(xx + "," + yy).Lock) ? costBonus + 2 : costBonus;
							succ.set(xx + "," + yy, {x: xx, y: yy,
								g: moveCost + costBonus + lowest.g,
								f: moveCost + costBonus + lowest.g + heuristic(xx, yy, endx, endy),
								s: lowest.x + "," + lowest.y});
						}
					}
				}
			}
			succ.forEach(s => {
				let openSucc = open.get(s.x + "," + s.y);
				if (!openSucc || openSucc.f > s.f) {
					let closedSucc = closed.get(s.x + "," + s.y);
					if (!closedSucc || closedSucc.f > s.f) {
						open.set(s.x + "," + s.y, s);
					}
				}
			});


			open.delete(lowest.x + "," + lowest.y);

			closed.set(lowest.x + "," + lowest.y, lowest);
		} else {
			open.clear();
			console.log("Pathfinding error! Please report this!");
		}
	}

	return undefined;
}

function KinkyDungeonGetPath(closed, xx, yy, endx, endy) {
	let list = [{x: endx, y: endy}];

	let current = closed.get(xx + "," + yy);
	while (current) {
		if (current.s) {
			list.push({x: current.x, y: current.y});
			current = closed.get(current.s);
		} else current = undefined;
	}

	return list.reverse();
}