"use strict";

var KinkyDungeonCurrentLore = -1;
var KinkyDungeonLore = [2, 3, 4, 5, 6, 7, 8];
var KinkyDungeonCheckpointLore = [
	/*0*/ [1,],
	/*1*/ [101, 102, 103, 9],
	/*2*/ [201],
	/*3*/ [],
	/*4*/ [],
	/*5*/ [],
	/*6*/ [],
	/*7*/ [],
	/*8*/ [],
	/*9*/ [],
	/*10*/ [],
	/*11*/ [9,],
	/*12*/ [],
	/*13*/ [],

];
var KinkyDungeonLoreScale = 1.7;
var KinkyDungeonRepeatLoreChance = 0.4; // Chance you will find a duplicate piece of lore
var KinkyDungeonGenericLoreChance = 0.5; // Chance you will find a generic note instead of a previous note

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
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX, canvasOffsetY, 640*KinkyDungeonLoreScale, 483*KinkyDungeonLoreScale, false);

	MainCanvas.textAlign = "left";

	let lore = KinkyDungeonWordWrap(TextGet("KinkyDungeonLore" + KinkyDungeonCurrentLore), 45).split('\n');
	let i = 0;
	for (let N = 0; N < lore.length; N++) {
		DrawText(lore[N],
			canvasOffsetX + 640*KinkyDungeonLoreScale/8, canvasOffsetY + 483*KinkyDungeonLoreScale/6 + i * 40, "black", "silver"); i++;}

	MainCanvas.textAlign = "center";
}

function KinkyDungeonHandleLore() {
	return true;
}