"use strict";

let KinkyDungeonCurrentLore = -1;
let KinkyDungeonLore = [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16];
let KinkyDungeonCheckpointLore = [
	/*0*/ [1,],
	/*1*/ [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 9,],
	/*2*/ [201, 202, 203, 204, 205],
	/*3*/ [],
	/*4*/ [],
	/*5*/ [],
	/*6*/ [],
	/*7*/ [],
	/*8*/ [],
	/*9*/ [],
	/*10*/ [],
	/*11*/ [9, 1100, 1101, 1102, 1103, 1104],
	/*12*/ [],
	/*13*/ [],

];
let KinkyDungeonLoreScale = 1.7;
let KinkyDungeonRepeatLoreChance = 0.4; // Chance you will find a duplicate piece of lore
let KinkyDungeonGenericLoreChance = 0.33; // Chance you will find a generic note instead of a previous note

function KinkyDungeonNewLore() {
	let availableLore = [];
	KinkyDungeonDrawState = "Lore";
	if (Player.KinkyDungeonExploredLore.length == 0) {
		availableLore = [0];
	} else {
		for (let L = 0; L < KinkyDungeonCheckpointLore[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].length; L++) {
			availableLore.push(KinkyDungeonCheckpointLore[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]][L]);
		}

		if (Math.random() < KinkyDungeonRepeatLoreChance) {
			if (Math.random() > KinkyDungeonGenericLoreChance) {
				availableLore = KinkyDungeonLore;
			} else {
				availableLore = [];
			}

		} else availableLore = KinkyDungeonLore.filter(element => !Player.KinkyDungeonExploredLore.includes(element));

	}

	if (availableLore.length > 0) {
		KinkyDungeonCurrentLore = availableLore[Math.floor(Math.random() * availableLore.length)];
		if (!Player.KinkyDungeonExploredLore.includes(KinkyDungeonCurrentLore)) {
			Player.KinkyDungeonExploredLore.push(KinkyDungeonCurrentLore);
			ServerAccountUpdate.QueueData({ KinkyDungeonExploredLore: Player.KinkyDungeonExploredLore });
		}

		return true;
	}
	KinkyDungeonCurrentLore = -(1 + Math.floor(Math.random() * 10));

	return false;
}

function KinkyDungeonDrawLore() {
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX_ui, canvasOffsetY_ui, 640*KinkyDungeonLoreScale, 483*KinkyDungeonLoreScale, false);

	MainCanvas.textAlign = "left";

	let lore = KinkyDungeonWordWrap(TextGet("KinkyDungeonLore" + KinkyDungeonCurrentLore), 45).split('\n');
	let i = 0;
	for (let N = 0; N < lore.length; N++) {
		DrawText(lore[N],
			canvasOffsetX_ui + 640*KinkyDungeonLoreScale/8, canvasOffsetY_ui + 483*KinkyDungeonLoreScale/6 + i * 40, "black", "silver"); i++;}

	MainCanvas.textAlign = "center";
}

function KinkyDungeonHandleLore() {
	return true;
}