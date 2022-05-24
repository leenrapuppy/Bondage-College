"use strict";

/**
 * @type {Record<string, (moveX, moveY) => boolean>}
 */
let KDMoveObjectFunctions = {
	'D': (moveX, moveY) => { // Open the door
		KinkyDungeonMapSet(moveX, moveY, 'd');
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorOpen.ogg");
		return true;
	},
	'C': (moveX, moveY) => { // Open the chest
		let chestType = KinkyDungeonTiles.get(moveX + "," +moveY) && KinkyDungeonTiles.get(moveX + "," +moveY).Loot ? KinkyDungeonTiles.get(moveX + "," +moveY).Loot : "chest";
		let roll = KinkyDungeonTiles.get(moveX + "," +moveY) ? KinkyDungeonTiles.get(moveX + "," +moveY).Roll : KDRandom();
		KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType, roll, KinkyDungeonTiles.get(moveX + "," +moveY));
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/ChestOpen.ogg");
		KinkyDungeonMapSet(moveX, moveY, 'c');
		KDGameData.AlreadyOpened.push({x: moveX, y: moveY});
		KinkyDungeonAggroAction('chest', {});
		return true;
	},
	'Y': (moveX, moveY) => { // Open the chest
		let chestType = MiniGameKinkyDungeonCheckpoint == 12 ? "shelf" : "rubble";
		KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], chestType);
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
		KinkyDungeonMapSet(moveX, moveY, '1');
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
		KinkyDungeonChangeDistraction(3 * delta);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHappyGas"), "pink", 1);
	} else if (tile == "[") { // Happy Gas!
		KinkyDungeonSleepiness = Math.max(KinkyDungeonSleepiness + 2, 5);
		KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSporeGas"), "pink", 1);
	} else if (tile == "L") { // Barrel
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel", type: "SlowDetection", duration: 1, power: 9.0, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["SlowDetection", "move", "cast"]});
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel3", type: "Sneak", duration: 1, power: 1.95, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["Sneak", "darkness", "move", "cast"]});
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "barrel2", type: "SlowLevel", duration: 1, power: 1, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["Slow", "move", "cast"]});
		KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonBarrel"), "lightgreen", 1);
	}
}

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

function KinkyDungeonHandleStairs(toTile, suppressCheckPoint) {
	if (!KDGameData.JailKey) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonNeedJailKey"), "#ffffff", 1);
	}
	else {
		if (!KinkyDungeonJailGuard() || !KinkyDungeonTetherLength() || (!(KDistEuclidean(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y) <= KinkyDungeonTetherLength() + 2) && !(KinkyDungeonJailGuard().CurrentAction == "jailLeashTour"))) {
			if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
				KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
				DialogSetReputation("Gaming", KinkyDungeonRep);
			}
			MiniGameVictory = false;

			MiniGameKinkyDungeonLevel += 1;
			if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
				MiniGameKinkyDungeonLevel = 1;
				MiniGameKinkyDungeonMainPath = 0;
				KinkyDungeonState = "End";
				MiniGameVictory = true;
				suppressCheckPoint = true;
			}

			let currCheckpoint = MiniGameKinkyDungeonCheckpoint;
			if (toTile == 's') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonMainPath, true, suppressCheckPoint);
			} else if (toTile == 'H') {
				KinkyDungeonSendActionMessage(10, TextGet("ClimbDownShortcut"), "#ffffff", 1);
				KinkyDungeonSetCheckPoint(MiniGameKinkyDungeonShortcut, true, suppressCheckPoint);
			}
			// Reduce security level when entering a new area
			if (MiniGameKinkyDungeonCheckpoint != currCheckpoint)
				KinkyDungeonChangeRep("Prisoner", -5);
			else // Otherwise it's just a little bit
				KinkyDungeonChangeRep("Prisoner", -1);

			if (KinkyDungeonState != "End") {
				KDGameData.HeartTaken = false;
				KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel);
				let saveData = KinkyDungeonSaveGame(true);
				if (MiniGameKinkyDungeonCheckpoint != currCheckpoint || (Math.floor(MiniGameKinkyDungeonLevel / 3) == MiniGameKinkyDungeonLevel / 3 && MiniGameKinkyDungeonCheckpoint < 11)) {
					KDGameData.KinkyDungeonSpawnJailers = 0;
					KDGameData.KinkyDungeonSpawnJailersMax = 0;
					if ((KinkyDungeonDifficultyMode == 0 || KinkyDungeonDifficultyMode == 3) && !suppressCheckPoint) {
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