"use strict";

let KinkyDungeonCurrentLore = -1;
let KinkyDungeonCurrentLoreTab = -1;
let KinkyDungeonCurrentLoreTabs = [-1];
let KinkyDungeonCurrentLoreItems = [];
let KinkyDungeonCurrentLoreItemOffset = 0;
let KinkyDungeonLore = [0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16];
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
	/*14*/ [],
	/*15*/ [],
	/*16*/ [],
	/*17*/ [],
	/*18*/ [],
	/*19*/ [],
	/*20*/ [],

];
let KinkyDungeonLoreScale = 1.5;
let KinkyDungeonRepeatLoreChance = 0.4; // Chance you will find a duplicate piece of lore
let KinkyDungeonGenericLoreChance = 0.33; // Chance you will find a generic note instead of a previous note

let KinkyDungeonNewLoreList = localStorage.getItem("kinkydungeonnewlore") ? JSON.parse(localStorage.getItem("kinkydungeonnewlore")) : [];

function KinkyDungeonNewLore() {
	let availableLore = [];
	let exploredLore = localStorage.getItem("kinkydungeonexploredlore") ? JSON.parse(localStorage.getItem("kinkydungeonexploredlore")) : [];
	let newLore = localStorage.getItem("kinkydungeonnewlore") ? JSON.parse(localStorage.getItem("kinkydungeonnewlore")) : [];

	if (exploredLore.length == 0) {
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

		} else KinkyDungeonLore.forEach((element) => {if (!exploredLore.includes(element)) {availableLore.push(element);}});

	}

	let result = false;

	if (availableLore.length > 0) {
		KinkyDungeonCurrentLore = availableLore[Math.floor(Math.random() * availableLore.length)];
		if (!exploredLore.includes(KinkyDungeonCurrentLore)) {

			KinkyDungeonSendActionMessage(5, TextGet("ItemPickupLore"), "white", 2);
			exploredLore.push(KinkyDungeonCurrentLore);
			newLore.push(KinkyDungeonCurrentLore);

			KinkyDungeonCurrentLoreTab = -1;
			for (let i = 0; i < KinkyDungeonCheckpointLore.length; i++) {
				if (KinkyDungeonCheckpointLore[i].includes(KinkyDungeonCurrentLore)) {
					KinkyDungeonCurrentLoreTab = i;
					break;
				}
			}

			//ServerAccountUpdate.QueueData({ KinkyDungeonExploredLore: Player.KinkyDungeonExploredLore });
		}
		result = true;
	} else {
		KinkyDungeonSendActionMessage(4, TextGet("ItemPickupLoreOld"), "gray", 2);
		KinkyDungeonCurrentLore = -(1 + Math.floor(Math.random() * 10));
	}

	localStorage.setItem("kinkydungeonexploredlore", JSON.stringify(exploredLore));
	KinkyDungeonNewLoreList = newLore;
	localStorage.setItem("kinkydungeonnewlore", JSON.stringify(newLore));

	KinkyDungeonUpdateTabs(exploredLore);

	return result;
}

function KinkyDungeonUpdateTabs(exploredLore) {
	KinkyDungeonCurrentLoreTabs = [-1];
	for (let lore of exploredLore) {
		for (let i = 0; i < KinkyDungeonCheckpointLore.length; i++) {
			if (KinkyDungeonCheckpointLore[i].includes(lore)) KinkyDungeonCurrentLoreTabs.push(i);
		}
	}
}

KinkyDungeonUpdateTabs(localStorage.getItem("kinkydungeonexploredlore") ? JSON.parse(localStorage.getItem("kinkydungeonexploredlore")) : []);

function KinkyDungeonDrawLore() {
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX_ui, canvasOffsetY_ui - 100, 640*KinkyDungeonLoreScale, 483*KinkyDungeonLoreScale, false);

	// Draw the current note
	MainCanvas.textAlign = "left";

	let lore = KinkyDungeonWordWrap(TextGet("KinkyDungeonLore" + KinkyDungeonCurrentLore), 45).split('\n');
	let i = 0;
	for (let N = 0; N < lore.length; N++) {
		DrawTextFit(lore[N],
			canvasOffsetX_ui + 640*KinkyDungeonLoreScale/8, canvasOffsetY_ui - 100 + 483*KinkyDungeonLoreScale/6 + i * 40, 0.75 * 640*KinkyDungeonLoreScale, "black", "silver"); i++;}

	if (KinkyDungeonNewLoreList.includes(KinkyDungeonCurrentLore)) {
		KinkyDungeonNewLoreList.splice(KinkyDungeonNewLoreList.indexOf(KinkyDungeonCurrentLore), 1);
		localStorage.setItem("kinkydungeonnewlore", JSON.stringify(KinkyDungeonNewLoreList));
	}

	MainCanvas.textAlign = "center";

	// Draw the tabs
	let tabs = KinkyDungeonCheckpointLore;
	for (i = -1; i < tabs.length; i++) {
		let newLore = false;
		for (let ll of KinkyDungeonNewLoreList) {
			if ((i == -1 && KinkyDungeonLore.includes(ll)) || (i >= 0 && KinkyDungeonCheckpointLore[i].includes(ll))) {
				newLore = true;
				break;
			}
		}
		DrawButton(1800, 100 + i * 42, 190, 40, KinkyDungeonCurrentLoreTabs.includes(i) ? TextGet("KinkyDungeonCheckpointLore" + i) : TextGet("KinkyDungeonCheckpointLoreUnknown"), i == KinkyDungeonCurrentLoreTab ? "white" : (newLore ? "#cdcdcd" :"#888888"));
	}

	let numNotes = tabs.length * 3 - 6;
	DrawButton(1550, 80, 90, 40, "", KinkyDungeonCurrentLoreItemOffset > 0 ? "white" : "#888888", KinkyDungeonRootDirectory + "Up.png");
	DrawButton(1550, 860, 90, 40, "", numNotes + KinkyDungeonCurrentLoreItemOffset < KinkyDungeonCurrentLoreItems.length ? "white" : "#888888", KinkyDungeonRootDirectory + "Down.png");
	for (i = 0; i < numNotes; i++) {
		let ii = Math.floor(i / 3);
		let xx = i % 3;
		if (i + KinkyDungeonCurrentLoreItemOffset < KinkyDungeonCurrentLoreItems.length) {
			let loreNum = KinkyDungeonCurrentLoreItems[i + KinkyDungeonCurrentLoreItemOffset];
			DrawButton(1450 + 100 * xx, 142 + (ii) * 42, 90, 40, "#" + loreNum, loreNum == KinkyDungeonCurrentLore ? "white" : (KinkyDungeonNewLoreList.includes(loreNum) ? "#cdcdcd": "#888888"));
		} else {
			if (i + KinkyDungeonCurrentLoreItemOffset > KinkyDungeonCurrentLoreItems.length + 3)
				KinkyDungeonCurrentLoreItemOffset = 0;
			break;
		}
	}
}

function KinkyDungeonUpdateLore(exploredLore) {
	KinkyDungeonCurrentLoreItems = [];
	for (let lore of exploredLore) {
		if (KinkyDungeonCurrentLoreTab == -1 && KinkyDungeonLore.includes(lore)) {
			KinkyDungeonCurrentLoreItems.push(lore);
		} else if (KinkyDungeonCheckpointLore[KinkyDungeonCurrentLoreTab] && KinkyDungeonCheckpointLore[KinkyDungeonCurrentLoreTab].includes(lore)) {
			KinkyDungeonCurrentLoreItems.push(lore);
		}
	}
}

function KinkyDungeonHandleLore() {
	let tabs = KinkyDungeonCheckpointLore;
	for (let i = -1; i < tabs.length; i++) {
		if (MouseIn(1800, 100 + i * 42, 190, 40) && KinkyDungeonCurrentLoreTabs.includes(i)) {
			KinkyDungeonCurrentLoreTab = i;
			KinkyDungeonUpdateLore(localStorage.getItem("kinkydungeonexploredlore") ? JSON.parse(localStorage.getItem("kinkydungeonexploredlore")) : []);
		}
	}

	let numNotes = tabs.length * 3 - 6;
	if (MouseIn(1550, 80, 90, 40) && KinkyDungeonCurrentLoreItemOffset > 0) KinkyDungeonCurrentLoreItemOffset -= 3;
	if (MouseIn(1550, 860, 90, 40) && numNotes + KinkyDungeonCurrentLoreItemOffset < KinkyDungeonCurrentLoreItems.length) KinkyDungeonCurrentLoreItemOffset += 3;
	for (let i = 0; i < numNotes; i++) {
		let ii = Math.floor(i / 3);
		let xx = i % 3;
		if (i + KinkyDungeonCurrentLoreItemOffset < KinkyDungeonCurrentLoreItems.length) {
			let loreNum = KinkyDungeonCurrentLoreItems[i + KinkyDungeonCurrentLoreItemOffset];
			if (MouseIn(1450 + 100 * xx, 142 + (ii) * 42, 90, 40)) {
				KinkyDungeonCurrentLore = loreNum;
			}
		} else {
			break;
		}
	}

	return true;
}