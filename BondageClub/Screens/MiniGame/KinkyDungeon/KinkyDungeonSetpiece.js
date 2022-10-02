"use strict";

let KDSetpieceAttempts = 10;

let KDSetPieces = [
	{Name: "Bedroom", tags: ["decorative", "urban"], Radius: 4},
	{Name: "Graveyard", tags: ["decorative", "temple"], Radius: 5},
	{Name: "Altar", tags: ["shrine", "temple"], Radius: 5},
	{Name: "SmallAltar", tags: ["shrine", "temple", "endpoint"], Radius: 3, xPad: 1, yPad: 1, xPadEnd: 1, yPadEnd: 1},
	{Name: "FuukaAltar", tags: ["boss", "temple"], Radius: 7, Max: 1},
	{Name: "Storage", tags: ["loot", "urban"], Radius: 5},
	{Name: "GuardedChest", tags: ["loot", "endpoint"], Radius: 3, xPad: 1, yPad: 1, xPadEnd: 1, yPadEnd: 1},
	{Name: "BanditPrison", tags: ["rep", "endpoint"], Radius: 3, xPad: 1, yPad: 1, xPadEnd: 1, yPadEnd: 1},
	{Name: "QuadCell", tags: ["decorative", "urban"], Radius: 7},
	{Name: "PearlChest", tags: ["loot", "pearl"], Radius: 5, Prereqs: ["PearlEligible"], Max: 1, xPad: 1, yPad: 1, xPadEnd: 1, yPadEnd: 1},
	{Name: "LesserPearl", tags: ["loot", "pearl"], Radius: 5, Chance: 0.5, Max: 1},
	{Name: "GuaranteedCell", tags: ["jail", "urban"], Radius: 5, Max: 1, xPad: 2},
	{Name: "ForbiddenChest", tags: ["loot", "temple", "endpoint"], Radius: 3, Max: 1, xPad: 1},
	{Name: "ForbiddenHall", tags: ["loot", "temple", "open"], Radius: 7, Max: 1, xPad: 1},
	{Name: "Cache", tags: ["loot", "urban", "endpoint"], Radius: 5, Max: 1, xPad: 2},
	{Name: "ExtraCell", tags: ["jail", "urban"], Radius: 4, xPad: 2, yPad: 1, xPadEnd: 2, yPadEnd: 1},
];

let KDCountSetpiece = new Map();

function KinkyDungeonPlaceSetPieces(POI, trapLocations, chestlist, shrinelist, chargerlist, spawnPoints, InJail, width, height) {
	KDCountSetpiece = new Map();
	let pieces = new Map();

	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	let forcePOI = Params.forcePOI ? true : false;
	let setpieces = [];
	let alt = !KDGameData.RoomType ? KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel) : KinkyDungeonAltFloor(KDGameData.RoomType);
	if (!alt) {
		Object.assign(setpieces, Params.setpieces);
		setpieces.push({Type: "GuaranteedCell", Weight: 100000});
		setpieces.push({Type: "Cache", Weight: 100000});
		//setpieces.push({Type: "PearlChest", Weight: 100});
		if (MiniGameKinkyDungeonLevel > 1)
			setpieces.push({Type: "LesserPearl", Weight: 10});
		let forbiddenChance = Params.forbiddenChance != undefined ? Params.forbiddenChance : 1;
		let greaterChance = Params.forbiddenGreaterChance != undefined ? Params.forbiddenGreaterChance : 0.5;
		if (KDRandom() < forbiddenChance) {
			if (KDRandom() < greaterChance) {
				setpieces.push({Type: "ForbiddenHall", Weight: 100000});
			} else {
				setpieces.push({Type: "ForbiddenChest", Weight: 100000});
			}
		}
	} else {
		for (let s of Object.entries(alt.setpieces)) {
			setpieces.push({Type: s[0], Weight: s[1]});
		}
	}

	if (KDGameData.MapMod) {
		let mapmod = KDMapMods[KDGameData.MapMod];
		if (mapmod && mapmod.bonussetpieces) {
			for (let s of mapmod.bonussetpieces) {
				setpieces.push(s);
			}
		}
	}

	// Populate the map
	for (let p of KDSetPieces) {
		let prereqs = true;
		if (prereqs && p.Prereqs) {
			if (prereqs && p.Prereqs.includes("PearlEligible")) {
				let has = KDPearlRequirement();
				if (!has) prereqs = false;
			}
		}
		if (prereqs)
			pieces.set(p.Name, p);
	}

	let pieceCount = width * height / 25;
	let count = 0;
	let fails = 0;
	while (count < pieceCount && fails < KDSetpieceAttempts) {
		let Piece = KinkyDungeonGetSetPiece(POI, setpieces, pieces);
		if (Piece && pieces.get(Piece) && KinkyDungeonGenerateSetpiece(POI, pieces.get(Piece), InJail, trapLocations, chestlist, shrinelist, chargerlist, spawnPoints, forcePOI).Pass) {
			count += 1;
			KDCountSetpiece.set(Piece, KDCountSetpiece.get(Piece) ? (KDCountSetpiece.get(Piece) + 1) : 1);
		} else fails += 1;
	}

}

function KDGetFavoredSetpieces(POI, setpieces) {
	let pieces = [];
	for (let p of POI) {
		if (p.used) continue;
		for (let f of p.favor) {
			if (!pieces.includes(f)) {
				pieces.push(f);
			}
		}
	}
	return setpieces.filter((p) => {return pieces.includes(p.Name);});
}
function KDGetFavoringSetpieces(Name, tags, POI) {
	let pois = [];
	for (let p of POI) {
		if (p.used) continue;
		if (p.favor.includes(Name)) {
			pois.push(p);
		} else if (p.requireTags.length == 0 || p.requireTags.some((tag) => {return tags.includes(tag);})) {
			pois.push(p);
		}
	}

	return pois[Math.floor(KDRandom() * pois.length)];
}

function KinkyDungeonGetSetPiece(POI, setpieces, pieces) {
	let setpieces2 = KDGetFavoredSetpieces(POI, setpieces);
	if (setpieces2.length < 1 || KDRandom() < 0.1) setpieces2 = setpieces;

	if (setpieces2) {

		let pieceWeightTotal = 0;
		let pieceWeights = [];

		for (let piece of setpieces2) {
			if (pieces.has(piece.Type) && (!pieces.get(piece.Type).Max || !(KDCountSetpiece.get(piece.Type) >= pieces.get(piece.Type).Max))) {
				pieceWeights.push({piece: piece, weight: pieceWeightTotal});
				pieceWeightTotal += piece.Weight;
			}
		}

		let selection = KDRandom() * pieceWeightTotal;

		for (let L = pieceWeights.length - 1; L >= 0; L--) {
			if (selection > pieceWeights[L].weight) {
				return pieceWeights[L].piece.Type;
			}
		}
	}
}

function KinkyDungeonGenerateSetpiece(POI, Piece, InJail, trapLocations, chestlist, shrinelist, chargerlist, spawnPoints, forcePOI) {
	let radius = Piece.Radius;
	let xPadStart = Piece.xPad || 5;
	let yPadStart = Piece.yPad || 2;
	let xPadEnd = Piece.xPadEnd || 2;
	let yPadEnd = Piece.yPadEnd || 2;
	if (InJail) {
		xPadStart = Math.max(xPadStart, KinkyDungeonJailLeashX + 2);
	}
	let cornerX =  Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - xPadEnd - radius - 1));
	let cornerY = Math.ceil(yPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridHeight - yPadStart - yPadEnd - radius - 1));

	let favoringPOI = KDGetFavoringSetpieces(Piece.Name, Piece.tags ? Piece.tags : ["decorative"], POI);
	if (favoringPOI) {
		cornerX = favoringPOI.x - Math.floor(Piece.Radius / 2);
		cornerY = favoringPOI.y - Math.floor(Piece.Radius / 2);
	}

	let i = 0;
	for (i = 0; i < 1000; i++) {
		let specialDist = KinkyDungeonGetClosestSpecialAreaDist(cornerX + Math.floor(radius/2) - 1, cornerY + Math.floor(radius/2));
		if (specialDist <= 4 || !(cornerX > Math.ceil(xPadStart) && cornerX < KinkyDungeonGridWidth - radius - xPadEnd && cornerY > Math.ceil(yPadStart) && cornerY < KinkyDungeonGridHeight - radius - yPadEnd)) {
			cornerY = Math.ceil(yPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridHeight - yPadStart - yPadEnd - radius - 1));
			cornerX = Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - radius - 1));

			if (i < 30 || i % 3 == 0 || forcePOI) {
				favoringPOI = KDGetFavoringSetpieces(Piece.Name, Piece.tags ? Piece.tags : ["decorative"], POI);
				if (favoringPOI) {
					cornerX = favoringPOI.x - Math.floor(Piece.Radius / 2);
					cornerY = favoringPOI.y - Math.floor(Piece.Radius / 2);
				}
			}
		} else break;
	}
	if (i > 990) {
		console.log("Could not place " + Piece.Name);
		return {Pass: false, Traps: trapLocations};
	}

	if (favoringPOI)
		favoringPOI.used = true;
	let skip = false;
	if (forcePOI && !favoringPOI) {
		skip = true;
	}

	if (!skip)
		switch (Piece.Name) {
			case "Bedroom":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, true);
				if (KDRandom() < 0.25) {
					KinkyDungeonMapSet(cornerX + 2, cornerY + 3, 'D');
					KinkyDungeonMapSet(cornerX + 2, cornerY + 1, 'c');
					KinkyDungeonTiles.set("" + (cornerX + 2) + "," + (cornerY + 3), {Type: "Door", NoTrap: true, OffLimits: true});
				} else if (KDRandom() < 0.33) {
					KinkyDungeonMapSet(cornerX + 2, cornerY, 'D');
					KinkyDungeonMapSet(cornerX + 1, cornerY + 2, 'c');
					KinkyDungeonTiles.set("" + (cornerX + 2) + "," + (cornerY), {Type: "Door", NoTrap: true, OffLimits: true});
				} else if (KDRandom() < 0.5) {
					KinkyDungeonMapSet(cornerX + 3, cornerY + 2, 'D');
					KinkyDungeonMapSet(cornerX + 2, cornerY + 1, 'c');
					KinkyDungeonTiles.set("" + (cornerX + 3) + "," + (cornerY + 2), {Type: "Door", NoTrap: true, OffLimits: true});
				} else {
					KinkyDungeonMapSet(cornerX, cornerY + 2, 'D');
					KinkyDungeonMapSet(cornerX + 2, cornerY + 1, 'c');
					KinkyDungeonTiles.set("" + (cornerX) + "," + (cornerY + 2), {Type: "Door", NoTrap: true, OffLimits: true});
				}
				KinkyDungeonMapSet(cornerX + 1, cornerY + 1, 'B');
				if (KinkyDungeonStatsChoice.has("Nowhere")) {
					if (KDRandom() < 0.5)
						KinkyDungeonTiles.set((cornerX + 1) + "," + (cornerY + 1), {
							Type: "Trap",
							Trap: "BedTrap",
						});
				}
				if (KDRandom() < 0.15) spawnPoints.push({x:cornerX + 1, y:cornerY + 1, required: ["human"], AI: "guard"});
				break;
			case "Graveyard": {
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
				let ghost = false;
				for (let X = cornerX; X <= cornerX + radius - 1; X += 2) {
					for (let Y = cornerY; Y < cornerY + radius; Y += 2) {
						if (KDRandom() < 0.5) KinkyDungeonMapSet(X, Y, 'X');
						else if (KDRandom() < 0.33) KinkyDungeonMapSet(X, Y, 'a');
						else KinkyDungeonMapSet(X, Y, '2');
						if (!ghost && KDRandom() < 0.14) {
							spawnPoints.push({x:X, y:Y, required: ["ghost"], tags: ["ghost"], AI: "guard"});
							ghost = true;
						}
					}
				}
			}
				break;
			case "Altar":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, false);
				KinkyDungeonMapSet(cornerX, cornerY , 'X');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'X');
				KinkyDungeonMapSet(cornerX, cornerY + radius - 1, 'X');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 1, 'X');
				shrinelist.push({x: cornerX + 2, y: cornerY + 2, priority: true});
				break;
			case "SmallAltar":
				if (!favoringPOI || KinkyDungeonBoringGet(cornerX + 1, cornerY + 1) < 3) skip = true;
				else {
					//KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 0, true);
					KinkyDungeonMapSet(cornerX + 1, cornerY + 1, 'a');
					if (KDUnblock(cornerX, cornerY)) KinkyDungeonMapSet(cornerX, cornerY, 'X');
					if (KDUnblock(cornerX + radius - 1, cornerY)) KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'X');
					if (KDUnblock(cornerX, cornerY + radius - 1)) KinkyDungeonMapSet(cornerX, cornerY + radius - 1, 'X');
					if (KDUnblock(cornerX + radius - 1, cornerY + radius - 1)) KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 1, 'X');
					shrinelist.push({x: cornerX + 1, y: cornerY + 1, priority: true});
				}
				break;
			case "FuukaAltar": {
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
				KinkyDungeonMapSet(cornerX + 1, cornerY + 1 , 'o');
				KinkyDungeonMapSet(cornerX + radius - 2, cornerY + 1, 'o');
				KinkyDungeonMapSet(cornerX + 1, cornerY + radius - 2, 'o');
				KinkyDungeonMapSet(cornerX + radius - 2, cornerY + radius - 2, 'o');

				KinkyDungeonMapSet(cornerX, cornerY + 3 , 'o');
				KinkyDungeonMapSet(cornerX + 3, cornerY , 'o');
				KinkyDungeonMapSet(cornerX + 3, cornerY + radius - 1 , 'o');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY + 3 , 'o');

				let Enemy = KinkyDungeonGetEnemyByName("Fuuka1");
				let e = {tracking: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(), x:cornerX + 3, y:cornerY + 3, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};
				KinkyDungeonEntities.push(e);
				KDStageBossGenerated = true;
				break;
			}
			case "PearlChest":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius-1, false, false, 1, true);
				/*if (KDRandom() < 0.6) KinkyDungeonMapSet(cornerX, cornerY , 'a');
				else shrinelist.push({x: cornerX, y: cornerY, priority: true});
				if (KDRandom() < 0.6) KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'a');
				else shrinelist.push({x: cornerX + radius - 1, y: cornerY, priority: true});
				if (KDRandom() < 0.6) KinkyDungeonMapSet(cornerX, cornerY + radius - 1, 'a');
				else shrinelist.push({x: cornerX, y: cornerY + radius - 1, priority: true});
				if (KDRandom() < 0.6) KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 1, 'a');
				else shrinelist.push({x: cornerX + radius - 1, y: cornerY + radius - 1, priority: true});*/
				KinkyDungeonMapSet(cornerX, cornerY , 'a');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'a');
				KinkyDungeonMapSet(cornerX, cornerY + radius - 2, 'a');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 2, 'a');
				KinkyDungeonMapSet(cornerX + 2, cornerY + 2, 'C');
				KinkyDungeonTiles.set((cornerX + 2) + "," + (cornerY + 2), {Loot: "pearl", Roll: KDRandom()});
				break;
			case "LesserPearl":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
				KinkyDungeonMapSet(cornerX, cornerY , 'o');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'o');
				KinkyDungeonMapSet(cornerX, cornerY + radius - 1, 'o');
				KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 1, 'o');

				if (!Piece.Chance || KDRandom() < Piece.Chance) {
					KinkyDungeonMapSet(cornerX + 2, cornerY + 2, 'C');
					KinkyDungeonTiles.set((cornerX + 2) + "," + (cornerY + 2), {Loot: "lesserpearl", Roll: KDRandom()});
					KinkyDungeonPatrolPoints.push({x: cornerX + 2, y: cornerY + 2});
					let chance = 0.75;
					let chance2 = 0.25;
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 3, y: cornerY + 1});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 3, y: cornerY + 2});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 3, y: cornerY + 3});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 1, y: cornerY + 1});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 1, y: cornerY + 2});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 1, y: cornerY + 3});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 2, y: cornerY + 1});
					if (KDRandom() < chance) trapLocations.push({x: cornerX + 2, y: cornerY + 3});

					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 1, y: cornerY});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 2, y: cornerY});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 3, y: cornerY});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 1, y: cornerY + radius - 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 2, y: cornerY + radius - 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 3, y: cornerY + radius - 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX, y: cornerY + 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX, y: cornerY + 2});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX, y: cornerY + 3});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + radius - 1, y: cornerY + 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + radius - 1, y: cornerY + 2});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + radius - 1, y: cornerY + 3});
				} else {
					shrinelist.push({x: cornerX+2, y: cornerY+2, priority: true});

					let chance2 = 0.1;
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 1, y: cornerY});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 2, y: cornerY});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 3, y: cornerY});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 1, y: cornerY + radius - 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 2, y: cornerY + radius - 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + 3, y: cornerY + radius - 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX, y: cornerY + 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX, y: cornerY + 2});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX, y: cornerY + 3});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + radius - 1, y: cornerY + 1});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + radius - 1, y: cornerY + 2});
					if (KDRandom() < chance2) trapLocations.push({x: cornerX + radius - 1, y: cornerY + 3});
				}

				break;
			case "GuaranteedCell":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, true);
				KinkyDungeonMapSet(cornerX+4, cornerY+2, 'd');
				KinkyDungeonTiles.set("" + (cornerX+4) + "," + (cornerY+2), {Type: "Door", NoTrap: true, Jail: true, ReLock: true, OffLimits: true});
				KinkyDungeonPatrolPoints.push({x: cornerX + 5, y: cornerY + 2});

				KinkyDungeonMapSet(cornerX+4, cornerY+1, 'b');
				KinkyDungeonMapSet(cornerX+4, cornerY+3, 'b');
				KinkyDungeonMapSet(cornerX+1, cornerY, 'b');
				KinkyDungeonMapSet(cornerX+2, cornerY, 'b');
				KinkyDungeonMapSet(cornerX+3, cornerY, 'b');
				KinkyDungeonMapSet(cornerX+1, cornerY+4, 'b');
				KinkyDungeonMapSet(cornerX+2, cornerY+4, 'b');
				KinkyDungeonMapSet(cornerX+3, cornerY+4, 'b');
				KinkyDungeonMapSet(cornerX+4, cornerY+1, 'b');
				KinkyDungeonMapSet(cornerX, cornerY+1, 'b');
				KinkyDungeonMapSet(cornerX, cornerY+2, 'b');
				KinkyDungeonMapSet(cornerX, cornerY+3, 'b');

				KinkyDungeonMapSet(cornerX+2, cornerY+2, 'B');
				if (KDRandom() < 0.0 + (KDGameData.RoomType == "Jail" ? 1.0 : 0)) {
					SetpieceSpawnPrisoner(cornerX+1, cornerY+1);
				}
				if (KDRandom() < 0.5 + (KDGameData.RoomType == "Jail" ? 0.25 : 0)) {
					SetpieceSpawnPrisoner(cornerX+1, cornerY+2);
				}
				if (KDRandom() < 0.5 + (KDGameData.RoomType == "Jail" ? 0.25 : 0)) {
					SetpieceSpawnPrisoner(cornerX+1, cornerY+3);
				}
				KDGameData.JailPoints.push({x: cornerX+2, y: cornerY+2});
				break;
			case "ExtraCell":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, true);
				KinkyDungeonMapSet(cornerX+3, cornerY+1, 'D');
				KinkyDungeonTiles.set("" + (cornerX+3) + "," + (cornerY+1), {Type: "Door", NoTrap: true, Jail: true, ReLock: true, OffLimits: true});

				KinkyDungeonMapSet(cornerX+3, cornerY+2, 'b');

				// Chance for seethru
				if (KDRandom() < 0.5) {
					KinkyDungeonMapSet(cornerX, cornerY+1, 'b');
					KinkyDungeonMapSet(cornerX, cornerY+2, 'b');
				}
				if (KDRandom() < 0.5) {
					KinkyDungeonMapSet(cornerX+1, cornerY, 'b');
					KinkyDungeonMapSet(cornerX+2, cornerY, 'b');
				}
				if (KDRandom() < 0.5) {
					KinkyDungeonMapSet(cornerX+1, cornerY+3, 'b');
					KinkyDungeonMapSet(cornerX+2, cornerY+3, 'b');
				}

				if (KDRandom() < 0.6 + (KDGameData.RoomType == "Jail" ? 0.35 : 0)) {
					SetpieceSpawnPrisoner(cornerX+1, cornerY+2);
				}

				KinkyDungeonMapSet(cornerX+1, cornerY+1, 'B');
				KDGameData.JailPoints.push({x: cornerX+1, y: cornerY+1});
				break;
			case "Storage":
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, false);
				KinkyDungeonPatrolPoints.push({x: cornerX + 2, y: cornerY + 2});
				KinkyDungeonMapSet(cornerX+2, cornerY , KDRandom() < 0.5 ? 'D' : (KDRandom() < 0.5 ? 'g' : 'd'));
				KinkyDungeonTiles.set("" + (cornerX+2) + "," + (cornerY), {Type: "Door"});
				KinkyDungeonMapSet(cornerX+2, cornerY+4 , KDRandom() < 0.5 ? 'D' : (KDRandom() < 0.5 ? 'g' : 'd'));
				KinkyDungeonTiles.set("" + (cornerX+2) + "," + (cornerY+4), {Type: "Door"});

				KinkyDungeonMapSet(cornerX+1, cornerY+1 , KDRandom() < 0.6 ? 'L' : (KDRandom() < 0.5 ? 'c' : 'C'));
				if (KinkyDungeonMapGet(cornerX+1, cornerY+1) == 'C')
					KinkyDungeonTiles.set((cornerX + 1) + "," + (cornerY + 1), {Loot: "storage", Roll: KDRandom()});
				KinkyDungeonMapSet(cornerX+1, cornerY+2 , KDRandom() < 0.5 ? 'L' : (KDRandom() < 0.5 ? 'c' : 'C'));
				if (KinkyDungeonMapGet(cornerX+1, cornerY+2) == 'C')
					KinkyDungeonTiles.set((cornerX + 1) + "," + (cornerY + 2), {Loot: "storage", Roll: KDRandom()});
				KinkyDungeonMapSet(cornerX+1, cornerY+3 , KDRandom() < 0.7 ? 'L' : (KDRandom() < 0.5 ? 'c' : 'C'));
				if (KinkyDungeonMapGet(cornerX+1, cornerY+3) == 'C')
					KinkyDungeonTiles.set((cornerX + 1) + "," + (cornerY + 3), {Loot: "storage", Roll: KDRandom()});
				KinkyDungeonMapSet(cornerX+3, cornerY+1 , KDRandom() < 0.5 ? 'L' : (KDRandom() < 0.5 ? 'c' : 'C'));
				if (KinkyDungeonMapGet(cornerX+3, cornerY+1) == 'C')
					KinkyDungeonTiles.set((cornerX + 3) + "," + (cornerY + 1), {Loot: "storage", Roll: KDRandom()});
				KinkyDungeonMapSet(cornerX+3, cornerY+2 , KDRandom() < 0.75 ? 'L' : (KDRandom() < 0.5 ? 'c' : 'C'));
				if (KinkyDungeonMapGet(cornerX+3, cornerY+2) == 'C')
					KinkyDungeonTiles.set((cornerX + 3) + "," + (cornerY + 2), {Loot: "storage", Roll: KDRandom()});
				KinkyDungeonMapSet(cornerX+3, cornerY+3 , KDRandom() < 0.5 ? 'L' : (KDRandom() < 0.5 ? 'c' : 'C'));
				if (KinkyDungeonMapGet(cornerX+3, cornerY+3) == 'C')
					KinkyDungeonTiles.set((cornerX + 3) + "," + (cornerY + 3), {Loot: "storage", Roll: KDRandom()});
				if (KDRandom() < 0.5) {
					if (KDRandom() < 0.75)
						spawnPoints.push({x:cornerX+2, y:cornerY+3, required:["beast"], AI: "guard"});
					else if (KDRandom() < 0.5)
						spawnPoints.push({x:cornerX+2, y:cornerY+3, required:["human"], AI: "guard"});
					else
						spawnPoints.push({x:cornerX+2, y:cornerY+3, required:["mold", "spawner"], tags: ["mold"], AI: "guard"});
				}
				break;
			case "GuardedChest": {
				let chests = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].chestcount ? KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].chestcount : 6;
				if ((!favoringPOI && KDRandom() < 0.7) || KinkyDungeonBoringGet(cornerX + 1, cornerY + 1) < 3 || chestlist.length >= chests) skip = true;
				else {
					// Hollow out a 2x2 area for the chest
					KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 0, false);
					// Determine faction
					let factionList = [
						{faction: "Bandit", tags: ["bandit"], rtags: ["bandit"]},
						{faction: "Dragon", tags: ["dragon"], rtags: ["dragon"]},
						{faction: "AncientRobot", tags: ["robot"], rtags: ["robot"]},
						{faction: "Maidforce", tags: ["maid"], rtags: ["maid"]},
						{faction: "Bountyhunter", tags: ["bountyhunter"], rtags: ["bountyhunter"]},
						{faction: "Dressmaker", tags: ["dressmaker"], rtags: ["dressmaker"]},
						{faction: "Witch", tags: ["witch", "apprentice", "skeleton"], rtags: ["witch", "apprentice", "skeleton"]},
						{faction: "Apprentice", tags: ["apprentice"], rtags: ["apprentice"]},
						{faction: "Mushy", tags: ["mushroom"], rtags: ["mushy"]},
						{faction: "Nevermere", tags: ["wolfgirl"], rtags: ["wolfgirl"]},
						{faction: "Bast", tags: ["mummy"], rtags: ["mummy"]},
						{faction: "Elf", tags: ["elf"], rtags: ["elf"]},
						{faction: "Elemental", tags: ["elemental", "witch"], rtags: ["elemental", "witch"]},
						{faction: "Alchemist", tags: ["alchemist"], rtags: ["alchemist"]},
						{faction: "", tags: ["skeleton", "construct"], rtags: ["skeleton", "construct"]},
					];
					let factionSelected = factionList[Math.floor(KDRandom() * factionList.length)];
					// Place the chest
					chestlist.push({x: cornerX + 1, y: cornerY + 1, priority: true, Faction: factionSelected.faction, NoTrap: true});
					// Place the guards
					spawnPoints.push({x:cornerX, y:cornerY, required:[factionSelected.rtags[Math.floor(KDRandom()*factionSelected.rtags.length)]], tags: factionSelected.tags, AI: "guard"});
					spawnPoints.push({x:cornerX+2, y:cornerY, required:[factionSelected.rtags[Math.floor(KDRandom()*factionSelected.rtags.length)]], tags: factionSelected.tags, AI: "guard"});
					spawnPoints.push({x:cornerX, y:cornerY+2, required:[factionSelected.rtags[Math.floor(KDRandom()*factionSelected.rtags.length)]], tags: factionSelected.tags, AI: "guard"});
					spawnPoints.push({x:cornerX+2, y:cornerY+2, required:[factionSelected.rtags[Math.floor(KDRandom()*factionSelected.rtags.length)]], tags: factionSelected.tags, AI: "guard"});
				}
				break;
			}
			case "BanditPrison": {
				if (KinkyDungeonBoringGet(cornerX + 1, cornerY + 1) < 3) skip = true;
				else {
					// Hollow out a 2x2 area for the chest
					KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 0, false);
					// Place the chest
					DialogueCreateEnemy(cornerX+1, cornerY+1, "PrisonerBandit");
					//spawnPoints.push({x:cornerX, y:cornerY, required:["prisoner"], tags: ["bandit"], priority: true});
					// Place the guards
					spawnPoints.push({x:cornerX, y:cornerY, required:["bountyhunter"], tags: ["human"], AI: "guard"});
					spawnPoints.push({x:cornerX+2, y:cornerY, required:["bountyhunter"], tags: ["human"], AI: "guard"});
					spawnPoints.push({x:cornerX, y:cornerY+2, required:["bountyhunter"], tags: ["human"], AI: "guard"});
					spawnPoints.push({x:cornerX+2, y:cornerY+2, required:["bountyhunter"], tags: ["human"], AI: "guard"});
				}
				break;
			}
			case "QuadCell": {
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
				KinkyDungeonPatrolPoints.push({x: cornerX + 3, y: cornerY + 3});
				for (let X = cornerX; X < cornerX + radius; X++) {
					KinkyDungeonMapSet(X, cornerY , '1');
					KinkyDungeonMapSet(X, cornerY+2 , '1');
					KinkyDungeonMapSet(X, cornerY+4 , '1');
					KinkyDungeonMapSet(X, cornerY+6, '1');
				}
				KinkyDungeonMapSet(cornerX, cornerY+1, '1');
				KinkyDungeonMapSet(cornerX+3, cornerY+1, '1');
				KinkyDungeonMapSet(cornerX+6, cornerY+1, '1');
				KinkyDungeonMapSet(cornerX, cornerY+5, '1');
				KinkyDungeonMapSet(cornerX+3, cornerY+5, '1');
				KinkyDungeonMapSet(cornerX+6, cornerY+5, '1');
				KinkyDungeonMapSet(cornerX+2, cornerY+2, 'b');
				KinkyDungeonMapSet(cornerX+4, cornerY+2, 'b');
				KinkyDungeonMapSet(cornerX+2, cornerY+4, 'b');
				KinkyDungeonMapSet(cornerX+4, cornerY+4, 'b');

				KinkyDungeonMapSet(cornerX + 2, cornerY + 1, 'B');
				KinkyDungeonMapSet(cornerX + 4, cornerY + 1, 'B');
				KinkyDungeonMapSet(cornerX + 2, cornerY + 5, 'B');
				KinkyDungeonMapSet(cornerX + 4, cornerY + 5, 'B');
				if (KinkyDungeonStatsChoice.has("Nowhere")) {
					if (KDRandom() < 0.5)
						KinkyDungeonTiles.set((cornerX + 2) + "," + (cornerY + 1), {
							Type: "Trap",
							Trap: "BedTrap",
						});
					if (KDRandom() < 0.5)
						KinkyDungeonTiles.set((cornerX + 4) + "," + (cornerY + 1), {
							Type: "Trap",
							Trap: "BedTrap",
						});
					if (KDRandom() < 0.5)
						KinkyDungeonTiles.set((cornerX + 2) + "," + (cornerY + 5), {
							Type: "Trap",
							Trap: "BedTrap",
						});
					if (KDRandom() < 0.5)
						KinkyDungeonTiles.set((cornerX + 4) + "," + (cornerY + 5), {
							Type: "Trap",
							Trap: "BedTrap",
						});
				}

				let l = KinkyDungeonMapGet(cornerX+1, cornerY+2) == 'D' ? "Red" : undefined;
				KinkyDungeonMapSet(cornerX+1, cornerY+2, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+1) + "," + (cornerY + 2), {Type: "Door", NoTrap: true, OffLimits: true, Lock: l});
				if (l && KDRandom() < 0.5)
					spawnPoints.push({x:cornerX + 2, y:cornerY + 1, required: ["human"], AI: "guard"});
				else if (l && KDRandom() < 0.6 + (KDGameData.RoomType == "Jail" ? 0.35 : 0)) {
					SetpieceSpawnPrisoner(cornerX+2, cornerY+1);
				}

				l = KinkyDungeonMapGet(cornerX+5, cornerY+2) == 'D' ? "Red" : undefined;
				KinkyDungeonMapSet(cornerX+5, cornerY+2, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+5) + "," + (cornerY + 2), {Type: "Door", NoTrap: true, OffLimits: true, Lock: l});
				if (l && KDRandom() < 0.5)
					spawnPoints.push({x:cornerX + 4, y:cornerY + 1, required: ["human"], AI: "guard"});
				else if (l && KDRandom() < 0.6 + (KDGameData.RoomType == "Jail" ? 0.35 : 0)) {
					SetpieceSpawnPrisoner(cornerX+4, cornerY+1);
				}

				l = KinkyDungeonMapGet(cornerX+1, cornerY+4) == 'D' ? "Red" : undefined;
				KinkyDungeonMapSet(cornerX+1, cornerY+4, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+1) + "," + (cornerY + 4), {Type: "Door", NoTrap: true, OffLimits: true, Lock: l});
				if (l && KDRandom() < 0.5)
					spawnPoints.push({x:cornerX + 2, y:cornerY + 5, required: ["human"], AI: "guard"});
				else if (l && KDRandom() < 0.6 + (KDGameData.RoomType == "Jail" ? 0.35 : 0)) {
					SetpieceSpawnPrisoner(cornerX+2, cornerY+5);
				}

				l = KinkyDungeonMapGet(cornerX+5, cornerY+4) == 'D' ? "Red" : undefined;
				KinkyDungeonMapSet(cornerX+5, cornerY+4, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+5) + "," + (cornerY + 4), {Type: "Door", NoTrap: true, OffLimits: true, Lock: l});
				if (l && KDRandom() < 0.5)
					spawnPoints.push({x:cornerX + 4, y:cornerY + 5, required: ["human"], AI: "guard"});
				else if (l && KDRandom() < 0.6 + (KDGameData.RoomType == "Jail" ? 0.35 : 0)) {
					SetpieceSpawnPrisoner(cornerX+4, cornerY+5);
				}

				break;
			}
			case "Cache": {
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, true);
				KinkyDungeonPatrolPoints.push({x: cornerX - 1, y: cornerY + 2});
				KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + Math.floor(radius/2), 'C');
				KinkyDungeonMapSet(cornerX, cornerY + Math.floor(radius/2) - 1, 'b');
				KinkyDungeonMapSet(cornerX, cornerY + Math.floor(radius/2) + 1, 'b');
				KinkyDungeonMapSet(cornerX, cornerY + Math.floor(radius/2), 'D');
				spawnPoints.push({x:cornerX-1, y:cornerY + Math.floor(radius/2)-1, required: ["cacheguard"], tags: ["bandit"], AI: "guard"});
				spawnPoints.push({x:cornerX-1, y:cornerY + Math.floor(radius/2)+1, required: ["cacheguard"], tags: ["bandit"], AI: "guard"});
				KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + Math.floor(radius/2)), {Loot: "cache", Faction: "Bandit", Roll: KDRandom()});
				KinkyDungeonTiles.set(cornerX + "," + (cornerY + Math.floor(radius/2)), {Type: "Door", Lock: "Red", OffLimits: true, ReLock: true});
				KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2) + 1});
				break;
			}
			case "ForbiddenHall": {
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, false);
				KinkyDungeonCreateRectangle(cornerX+1, cornerY, radius-2, radius, true, false, 1, true);

				for (let X = cornerX + Math.floor(radius/2) - 1; X <= cornerX + Math.floor(radius/2) + 1; X++) {
					for (let Y = cornerY + 1; Y < cornerY + radius - 1; Y++) {
						if (!(X == cornerX + Math.floor(radius/2) && Y == cornerY + 1) && !(X == cornerX + Math.floor(radius/2) && Y == cornerY + radius - 2)) {
							if (KDRandom() < 0.65) {
								trapLocations.push({x: X, y: Y});
							} else if (X != cornerX + Math.floor(radius/2) && Y >= cornerY + 1) {
								KinkyDungeonMapSet(X, Y, '2');
							}
						}
					}
				}

				KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + 1, 'C');
				KinkyDungeonMapSet(cornerX + Math.floor(radius/2) + 1, cornerY + radius - 1, '1');
				KinkyDungeonMapSet(cornerX + Math.floor(radius/2) - 1, cornerY + radius - 1, '1');
				KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + radius - 1, '2');

				KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + 1), {Loot: "gold", Faction: "AncientRobot", Roll: KDRandom()});

				// Trapped Door
				KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + radius - 1, 'd');
				KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + radius - 1), {
					Type: "Door",
					StepOffTrap: "DoorLock",
					SpawnMult: 0.5,
					Lifetime: 12,
					StepOffTiles: [
						(cornerX + Math.floor(radius/2) - 1) + "," + (cornerY + radius - 2),
						(cornerX + Math.floor(radius/2)) + "," + (cornerY + radius - 2),
						(cornerX + Math.floor(radius/2)) + 1 + "," + (cornerY + radius - 2)
					]});
				console.log("Created forbidden hall");
				break;
			}
			case "ForbiddenChest": {
				KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 0, true);
				KinkyDungeonCreateRectangle(cornerX, cornerY - 1, radius, 1, false, false, 0, false);
				KinkyDungeonCreateRectangle(cornerX, cornerY + radius, radius, 1, false, false, 0, false);
				KinkyDungeonCreateRectangle(cornerX - 1, cornerY, 1, radius, false, false, 0, false);
				KinkyDungeonCreateRectangle(cornerX + radius, cornerY, 1, radius, false, false, 0, false);
				KinkyDungeonPatrolPoints.push({x: cornerX + 2, y: cornerY + 2});

				for (let X = cornerX; X < cornerX + radius; X++) {
					for (let Y = cornerY; Y < cornerY + radius; Y++) {
						if (!(X == cornerX + 1 && Y == cornerY + 1)) {
							trapLocations.push({x: X, y: Y});
						}
					}
				}

				KinkyDungeonMapSet(cornerX + Math.floor(radius/2), cornerY + Math.floor(radius/2), 'C');

				KinkyDungeonTiles.set((cornerX + Math.floor(radius/2)) + "," + (cornerY + Math.floor(radius/2)), {Loot: "lessergold", Roll: KDRandom()});
				console.log("Created lesser gold chest");
				break;
			}
		}

	if (!skip)
		KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2)});
	else if (favoringPOI)
		favoringPOI.used = false;

	if ( KDDebug) {
		console.log("Created " + Piece.Name);
	}
	return {Pass: true, Traps: trapLocations};
}

/**
 * This function unblocks movement to ensure a map is pathable
 * @param {number} x
 * @param {number} y
 * @returns {boolean} - whether it's possible
 */
function KDUnblock(x, y) {
	let blocked = false;
	let blockTiles = "1X";
	let t = KinkyDungeonMapGet(x, y-1);
	let tr = KinkyDungeonMapGet(x+1, y-1);
	let tl = KinkyDungeonMapGet(x-1, y-1);
	let r = KinkyDungeonMapGet(x+1, y);
	let l = KinkyDungeonMapGet(x-1, y);
	let b = KinkyDungeonMapGet(x, y-1);
	let br = KinkyDungeonMapGet(x+1, y+1);
	let bl = KinkyDungeonMapGet(x-1, y+1);

	let m_t = KinkyDungeonMovableTilesSmartEnemy.includes(t);
	let m_tr = KinkyDungeonMovableTilesSmartEnemy.includes(tr);
	let m_tl = KinkyDungeonMovableTilesSmartEnemy.includes(tl);
	let m_r = KinkyDungeonMovableTilesSmartEnemy.includes(r);
	let m_l = KinkyDungeonMovableTilesSmartEnemy.includes(l);
	let m_b = KinkyDungeonMovableTilesSmartEnemy.includes(b);
	let m_br = KinkyDungeonMovableTilesSmartEnemy.includes(br);
	let m_bl = KinkyDungeonMovableTilesSmartEnemy.includes(bl);

	if (!blocked && m_t && m_b && !m_r && !m_l) {
		if (KDRandom() < 0.5 && blockTiles.includes(r)) {
			m_r = true;
			KinkyDungeonMapSet(x + 1, y, '2'); // Set to brickwork
		} else if (blockTiles.includes(l)) {
			m_l = true;
			KinkyDungeonMapSet(x - 1, y, '2'); // Set to brickwork
		} else blocked = true; // Cancel
	}
	if (!blocked && m_r && m_l && !m_t && !m_b) {
		if (KDRandom() < 0.5 && blockTiles.includes(b)) {
			m_b = true;
			KinkyDungeonMapSet(x, y + 1, '2'); // Set to brickwork
		} else if (blockTiles.includes(t)) {
			m_t = true;
			KinkyDungeonMapSet(x, y - 1, '2'); // Set to brickwork
		} else blocked = true; // Cancel
	}
	if (!blocked && m_tr && m_br && !m_r) {
		if (blockTiles.includes(r)) {
			m_r = true;
			KinkyDungeonMapSet(x + 1, y, '2'); // Set to brickwork
		} else if (!m_t && !m_l && !m_b) {
			blocked = true;
		}
	}
	if (!blocked && m_tl && m_bl && !m_l) {
		if (blockTiles.includes(l)) {
			m_l = true;
			KinkyDungeonMapSet(x - 1, y, '2'); // Set to brickwork
		} else if (!m_t && !m_r && !m_b) {
			blocked = true;
		}
	}
	if (!blocked && m_tl && m_tr && !m_t) {
		if (blockTiles.includes(t)) {
			m_t = true;
			KinkyDungeonMapSet(x, y - 1, '2'); // Set to brickwork
		} else if (!m_l && !m_b && !m_r) {
			blocked = true;
		}
	}
	if (!blocked && m_bl && m_br && !m_b) {
		if (blockTiles.includes(b)) {
			m_b = true;
			KinkyDungeonMapSet(x, y + 1, '2'); // Set to brickwork
		} else if (!m_l && !m_t && !m_r) {
			blocked = true;
		}
	}
	return !blocked;
}

function SetpieceSpawnPrisoner(x, y) {
	let Enemy = KinkyDungeonGetEnemy(["imprisonable"], MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], KinkyDungeonMapGet(x, y), ["imprisonable"]);
	if (Enemy) {
		let e = DialogueCreateEnemy(x, y, Enemy.name);
		e.faction = "Prisoner";
		e.boundLevel = e.hp * 11;
		e.specialdialogue = "PrisonerJail";
		KinkyDungeonSetEnemyFlag(e, "noswap", -1);
		KinkyDungeonSetEnemyFlag(e, "imprisoned", -1);
	}
}