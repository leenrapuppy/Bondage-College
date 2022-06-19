"use strict";

/**
 * @type {Record<string, (moveX, moveY) => boolean>}
 */
let KDMoveObjectFunctions = {
	'D': (moveX, moveY) => { // Open the door
		KinkyDungeonMapSet(moveX, moveY, 'd');

		// For private doors, aggro the faction
		let faction = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Faction ? KinkyDungeonTiles.get(moveX + "," +moveY).Faction : undefined;
		if (faction) {
			KinkyDungeonAggroFaction(faction, true);
		}

		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorOpen.ogg");
		return true;
	},
	'C': (moveX, moveY) => { // Open the chest
		let chestType = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Loot ? KinkyDungeonTiles.get(moveX + "," +moveY).Loot : "chest";
		let faction = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Faction ? KinkyDungeonTiles.get(moveX + "," +moveY).Faction : undefined;
		let noTrap = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).NoTrap ? KinkyDungeonTiles.get(moveX + "," +moveY).NoTrap : false;
		let roll = KinkyDungeonTiles.get(moveX + "," +moveY) ? KinkyDungeonTiles.get(moveX + "," +moveY).Roll : KDRandom();
		if (faction && !KinkyDungeonChestConfirm) {
			KinkyDungeonChestConfirm = true;
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChestFaction").replace("FACTION", TextGet("KinkyDungeonFaction" + faction)), "red", 2);
		} else {
			KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType, roll, KinkyDungeonTiles.get(moveX + "," +moveY), undefined, noTrap);
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/ChestOpen.ogg");
			KinkyDungeonMapSet(moveX, moveY, 'c');
			KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
			KinkyDungeonAggroAction('chest', {faction: faction});
		}
		return true;
	},
	'Y': (moveX, moveY) => { // Open the chest
		let chestType = MiniGameKinkyDungeonCheckpoint == "lib" ? "shelf" : "rubble";
		KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType);
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
		KinkyDungeonMapSet(moveX, moveY, 'X');
		KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
		return true;
	},
	'O': (moveX, moveY) => { // Open the chest
		if (KinkyDungeonIsPlayer())
			KinkyDungeonTakeOrb(1, moveX, moveY); // 1 spell point
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
		KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
		return true;
	},
	'-': (moveX, moveY) => { // Open the chest
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonObjectChargerDestroyed"), "gray", 2);
		return true;
	},
};

function KinkyDungeonUpdateTileEffects(delta) {
	let tile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (tile == "]") { // Happy Gas!
		KinkyDungeonChangeDistraction(3 * delta, false, 0.5);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHappyGas"), "pink", 1);
	} else if (tile == "[") { // Happy Gas!
		KinkyDungeonSleepiness = Math.max(KinkyDungeonSleepiness + 2, 5);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSporeGas"), "pink", 1);
	} else if (tile == "L") { // Barrel
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel", type: "SlowDetection", duration: 1, power: 9.0, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["SlowDetection", "move", "cast"]});
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel3", type: "Sneak", duration: 1, power: 1.95, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["Sneak", "darkness", "move", "cast"]});
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel2", type: "SlowLevel", duration: 1, power: 1, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["Slow", "move", "cast"]});
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonBarrel"), "lightgreen", 1);
	} else if (tile == "?") { // High hook
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonHookHigh"), "lightgreen", 1);
	} else if (tile == "/") { // Low hook
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonScrap"), "lightgreen", 1);
	} else {
		let tileUp = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y - 1);
		let tileL = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x - 1, KinkyDungeonPlayerEntity.y);
		let tileR = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x + 1, KinkyDungeonPlayerEntity.y);
		let tileD = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y + 1);
		if (tileUp == ",") {
			// Low hook
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonHookLow"), "lightgreen", 1);
		} else if (tileUp == "4" || tileL == '4' || tileR == '4' || tileD == '4') {
			// Crack
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCrack"), "lightgreen", 1);
		}
	}
}

let KinkyDungeonChestConfirm = false;

function KinkyDungeonHandleMoveToTile(toTile) {
	if (toTile == 's' || toTile == 'H') { // Go down the next stairs
		if (KinkyDungeonConfirmStairs && KinkyDungeonLastAction == "Wait") {
			KinkyDungeonConfirmStairs = false;
			KinkyDungeonHandleStairs(toTile);
		} else if (!(KDGameData.SleepTurns > 0)) {
			if (KinkyDungeonLastAction == "Move" || KinkyDungeonLastAction == "Wait")
				KinkyDungeonConfirmStairs = true;
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonConfirmStairs"), "white", 1);
		}
	}
}

function KDCanEscape() {
	return KDGameData.JailKey || KinkyDungeonFlags.has("BossUnlocked");
}

function KinkyDungeonHandleStairs(toTile, suppressCheckPoint) {
	if (!KDCanEscape()) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonNeedJailKey"), "#ffffff", 1);
	}
	else {
		if (!KinkyDungeonJailGuard() || !KinkyDungeonTetherLength() || (!(KDistEuclidean(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y) <= KinkyDungeonTetherLength() + 2) && !(KinkyDungeonJailGuard().CurrentAction == "jailLeashTour"))) {
			if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
				KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
				DialogSetReputation("Gaming", KinkyDungeonRep);
			}
			MiniGameVictory = false;
			let roomType = "";
			let currCheckpoint = MiniGameKinkyDungeonCheckpoint;
			let altRoom = KinkyDungeonAltFloor(KDGameData.RoomType);

			// We increment the save, etc, after the tunnel
			if (KDGameData.RoomType == "Tunnel" || (altRoom && altRoom.skiptunnel)) {

				MiniGameKinkyDungeonLevel += 1;

				if (KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel)) {
					roomType = ""; // We let the boss spawn naturally
				} else {
					roomType = ""; // TODO add more room types
				}

				if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
					MiniGameKinkyDungeonLevel = 1;
					MiniGameKinkyDungeonMainPath = "grv";
					KinkyDungeonState = "End";
					MiniGameVictory = true;
					suppressCheckPoint = true;
				}
			} else {
				roomType = "Tunnel"; // We do a tunnel every other room
				KDGameData.MapMod = ""; // Reset the map mod

				// Reduce security level when entering a new area
				if (MiniGameKinkyDungeonCheckpoint != currCheckpoint)
					KinkyDungeonChangeRep("Prisoner", -5);
				else // Otherwise it's just a little bit
					KinkyDungeonChangeRep("Prisoner", -1);

				if (KinkyDungeonStatsChoice.get("Trespasser")) {
					KinkyDungeonChangeRep("Rope", -1);
					KinkyDungeonChangeRep("Metal", -1);
					KinkyDungeonChangeRep("Leather", -1);
					KinkyDungeonChangeRep("Latex", -1);
					KinkyDungeonChangeRep("Will", -1);
					KinkyDungeonChangeRep("Elements", -1);
					KinkyDungeonChangeRep("Conjure", -1);
					KinkyDungeonChangeRep("Illusion", -1);
				}
			}

			KDGameData.RoomType = roomType;
			if (KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y)) {
				let MapMod = KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).MapMod;
				if (MapMod) {
					KDGameData.MapMod = MapMod;
				} else KDGameData.MapMod = "";
				let Journey = KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).Journey;
				if (Journey) {
					KDGameData.Journey = Journey;
					KDInitializeJourney(KDGameData.Journey);
				}
				let RoomType = KinkyDungeonTiles.get(KinkyDungeonPlayerEntity.x + "," + KinkyDungeonPlayerEntity.y).RoomType;
				if (RoomType) {
					KDGameData.RoomType = RoomType;
				}
			}


			if (toTile == 's') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonMainPath, true, suppressCheckPoint);
			} else if (toTile == 'H') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDownShortcut"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonShortcut, true, suppressCheckPoint);
			}

			if (KinkyDungeonState != "End") {
				KDGameData.HeartTaken = false;
				KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel, undefined, undefined);
				let saveData = KinkyDungeonSaveGame(true);
				if (KDGameData.RoomType == "Tunnel" && Math.floor(MiniGameKinkyDungeonLevel / 3) == MiniGameKinkyDungeonLevel / 3 && KDDefaultJourney.includes(MiniGameKinkyDungeonCheckpoint)) {
					if ((!KinkyDungeonStatsChoice.get("saveMode")) && !suppressCheckPoint) {
						KinkyDungeonState = "Save";
						ElementCreateTextArea("saveDataField");
						ElementValue("saveDataField", saveData);
					}
				}
				KinkyDungeonSaveGame();
				KDSendStatus('nextLevel');
			} else {
				KDSendStatus('end');
			}

		} else {
			KinkyDungeonSendActionMessage(10, TextGet("ClimbDownFail"), "#ffffff", 1);
		}
	}
}


let KinkyDungeonConfirmStairs = false;

function KinkyDungeonHandleMoveObject(moveX, moveY, moveObject) {
	if (KDMoveObjectFunctions[moveObject]) {
		return KDMoveObjectFunctions[moveObject](moveX, moveY);
	}
	return false;
}