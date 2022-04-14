"use strict";

let KDSetPieces = [
	{Name: "Bedroom", Radius: 4},
	{Name: "Graveyard", Radius: 5},
	{Name: "Altar", Radius: 5},
	{Name: "Storage", Radius: 5},
	{Name: "QuadCell", Radius: 7},
	{Name: "PearlChest", Radius: 5, Prereqs: ["PearlEligible"], Max: 1},
	{Name: "GuaranteedCell", Radius: 5, Max: 1},
];

let KDCountSetpiece = new Map();

function KinkyDungeonPlaceSetPieces(trapLocations, spawnPoints, InJail, width, height) {
	KDCountSetpiece = new Map();
	let pieces = new Map();

	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	let setpieces = [];
	Object.assign(setpieces, Params.setpieces);
	setpieces.push({Type: "PearlChest", Weight: 1000});
	setpieces.push({Type: "GuaranteedCell", Weight: 1000});
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
	while (count < pieceCount && fails < 4) {
		let Piece = KinkyDungeonGetSetPiece(setpieces, pieces);
		if (Piece && pieces.get(Piece) && KinkyDungeonGenerateSetpiece(pieces.get(Piece), InJail, trapLocations, spawnPoints).Pass) {
			count += 1;
			KDCountSetpiece.set(Piece, KDCountSetpiece.get(Piece) ? (KDCountSetpiece.get(Piece) + 1) : 1);
		} else fails += 1;
	}

}

function KinkyDungeonGetSetPiece(setpieces, pieces) {

	if (setpieces) {

		let pieceWeightTotal = 0;
		let pieceWeights = [];

		for (let piece of setpieces) {
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

function KinkyDungeonGenerateSetpiece(Piece, InJail, trapLocations, spawnPoints) {
	let radius = Piece.Radius;
	let xPadStart = Piece.xPad || 5;
	let yPadStart = Piece.yPad || 2;
	let xPadEnd = Piece.xPadEnd || 2;
	let yPadEnd = Piece.yPadEnd || 2;
	if (InJail) {
		xPadStart = Math.max(xPadStart, KinkyDungeonJailLeashX + 2);
	}
	let ypos = Math.ceil(yPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridHeight - yPadStart - yPadEnd - radius - 1));
	let cornerX =  Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - xPadEnd - radius - 1));
	let cornerY = ypos;
	let i = 0;
	for (i = 0; i < 10000; i++) {
		let specialDist = KinkyDungeonGetClosestSpecialAreaDist(cornerX + Math.floor(radius/2) - 1, cornerY + Math.floor(radius/2));
		if (specialDist <= 3) {
			cornerY = Math.ceil(yPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridHeight - yPadStart - yPadEnd - radius - 1));
			cornerX = Math.ceil(xPadStart) + Math.floor(KDRandom() * (KinkyDungeonGridWidth - xPadStart - radius - 1));
		} else break;
	}
	if (i > 9990) {
		console.log("Error generating " + Piece.Name);
		return {Pass: false, Traps: trapLocations};
	}

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
			KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
			KinkyDungeonMapSet(cornerX, cornerY , 'X');
			KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'X');
			KinkyDungeonMapSet(cornerX, cornerY + radius - 1, 'X');
			KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 1, 'X');
			KinkyDungeonMapSet(cornerX + 2, cornerY + 2, 'a');
			break;
		case "PearlChest":
			KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
			KinkyDungeonMapSet(cornerX, cornerY , 'a');
			KinkyDungeonMapSet(cornerX + radius - 1, cornerY, 'a');
			KinkyDungeonMapSet(cornerX, cornerY + radius - 1, 'a');
			KinkyDungeonMapSet(cornerX + radius - 1, cornerY + radius - 1, 'a');
			KinkyDungeonMapSet(cornerX + 2, cornerY + 2, 'C');
			KinkyDungeonTiles.set((cornerX + 2) + "," + (cornerY + 2), {Loot: "pearl", Roll: KDRandom()});
			break;
		case "GuaranteedCell":
			KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, true);
			KinkyDungeonMapSet(cornerX+4, cornerY+2, 'd');
			KinkyDungeonTiles.set("" + (cornerX+4) + "," + (cornerY+2), {Type: "Door", NoTrap: true, Jail: true, ReLock: true, OffLimits: true});

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
			KDGameData.JailPoints.push({x: cornerX+2, y: cornerY+2});
			break;
		case "Storage":
			KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, true, false, 1, false);
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
			if (KDRandom() < 0.33) {
				if (KDRandom() < 0.75)
					spawnPoints.push({x:cornerX+2, y:cornerY+3, required:["beast"], AI: "guard"});
				else
					spawnPoints.push({x:cornerX+2, y:cornerY+3, required:["human"], AI: "guard"});
			}
			break;
		case "QuadCell":
			KinkyDungeonCreateRectangle(cornerX, cornerY, radius, radius, false, false, 1, true);
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

			KinkyDungeonMapSet(cornerX+1, cornerY+2, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+1) + "," + (cornerY + 2), {Type: "Door", NoTrap: true, OffLimits: true, Lock: KinkyDungeonMapGet(cornerX+1, cornerY+2) == 'D' ? "Red" : undefined});
			KinkyDungeonMapSet(cornerX+5, cornerY+2, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+5) + "," + (cornerY + 2), {Type: "Door", NoTrap: true, OffLimits: true, Lock: KinkyDungeonMapGet(cornerX+5, cornerY+2) == 'D' ? "Red" : undefined});
			KinkyDungeonMapSet(cornerX+1, cornerY+4, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+1) + "," + (cornerY + 4), {Type: "Door", NoTrap: true, OffLimits: true, Lock: KinkyDungeonMapGet(cornerX+1, cornerY+4) == 'D' ? "Red" : undefined});
			KinkyDungeonMapSet(cornerX+5, cornerY+4, KDRandom() < 0.75 ? 'D' : 'd'); KinkyDungeonTiles.set("" + (cornerX+5) + "," + (cornerY + 4), {Type: "Door", NoTrap: true, OffLimits: true, Lock: KinkyDungeonMapGet(cornerX+5, cornerY+4) == 'D' ? "Red" : undefined});
			break;
	}

	KinkyDungeonSpecialAreas.push({x: cornerX + Math.floor(radius/2), y: cornerY + Math.floor(radius/2), radius: Math.ceil(radius/2) + 4});

	if ( KDDebug) {
		console.log("Created " + Piece.Name);
	}
	return {Pass: true, Traps: trapLocations};
}

