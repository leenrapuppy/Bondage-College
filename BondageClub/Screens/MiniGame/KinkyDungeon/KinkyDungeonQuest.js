"use strict";

let QuestCompleteWeight = 1000;

/**
 * @type {Record<string, any>}
 */
let KDQuests = {
	"DressmakerQuest": {
		name: "DressmakerQuest",
		npc: "DressmakerQuest",
		weight: (RoomType, MapMod, data) => {
			if (RoomType == "Tunnel") {
				let weight = 15;
				if (KinkyDungeonPlayerTags.has("BindingDress")) {
					return weight * QuestCompleteWeight;
				}
				return weight;
			}
			return 0;
		},
		prerequisite: (RoomType, MapMod, data) => {
			//if (KinkyDungeonFlags.has("DressmakerQuest") && KinkyDungeonPlayerTags.has("BindingDress")) {
			//return false;
			//}
			if (RoomType == "Tunnel") {
				return true;
			}
			return false;
		}
	},
	"ApprenticeQuest": {
		name: "ApprenticeQuest",
		npc: "ApprenticeQuest",
		weight: (RoomType, MapMod, data) => {
			if (RoomType == "Tunnel") {
				let weight = 30;
				if (
					KinkyDungeonInventoryGet("ScrollLegs")
					|| KinkyDungeonInventoryGet("ScrollArms")
					|| KinkyDungeonInventoryGet("ScrollVerbal")
					|| KinkyDungeonInventoryGet("ScrollPurity")
				) {
					return weight * QuestCompleteWeight;
				}
				return weight;
			}
			return 0;
		},
		prerequisite: (RoomType, MapMod, data) => {
			if (KDHasQuest("ApprenticeQuest") && !(KinkyDungeonInventoryGet("ScrollLegs")
				|| KinkyDungeonInventoryGet("ScrollArms")
				|| KinkyDungeonInventoryGet("ScrollVerbal")
				|| KinkyDungeonInventoryGet("ScrollPurity")
			)) {
				return false;
			}
			if (RoomType == "Tunnel") {
				return true;
			}
			return false;
		}
	},
	"DragonheartQuest": {
		name: "DragonheartQuest",
		npc: "DragonheartQuest",
		weight: (RoomType, MapMod, data) => {
			if (RoomType == "Tunnel") {
				let weight = 20;
				return weight;
			}
			return 0;
		},
		prerequisite: (RoomType, MapMod, data) => {
			if (KDHasQuest("DragonLeaderDuelist")) {
				return false;
			}
			if (KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel + 1)) return false;
			if (RoomType == "Tunnel") {
				return true;
			}
			return false;
		}
	},
	"BanditQuest": {
		name: "BanditQuest",
		npc: "BanditQuest",
		weight: (RoomType, MapMod, data) => {
			if (RoomType == "Tunnel") {
				let weight = 20;
				return weight;
			}
			return 0;
		},
		prerequisite: (RoomType, MapMod, data) => {
			if (KDHasQuest("BanditPrisoner")) {
				return false;
			}
			if (KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel + 1)) return false;
			if (RoomType == "Tunnel") {
				return true;
			}
			return false;
		}
	},
	"BlacksmithQuest": {
		name: "BlacksmithQuest",
		npc: "BlacksmithQuest",
		weight: (RoomType, MapMod, data) => {
			return 100;
		},
		prerequisite: (RoomType, MapMod, data) => {
			if (RoomType == "Tunnel") {
				return true;
			}
			return false;
		}
	},
};

function KDQuestList(count, mods, RoomType, MapMod, data) {
	let ret = [];
	for (let i = 0; i < count; i++) {
		let genWeightTotal = 0;
		let genWeights = [];

		for (let mod of Object.values(mods)) {
			if (!ret.includes(mod) && mod.prerequisite(RoomType, MapMod, data)) {
				genWeights.push({mod: mod, weight: genWeightTotal});
				genWeightTotal += mod.weight(RoomType, MapMod, data);
			}
		}

		let selection = KDRandom() * genWeightTotal;

		for (let L = genWeights.length - 1; L >= 0; L--) {
			if (selection > genWeights[L].weight) {
				ret.push(genWeights[L].mod);
				break;
			}
		}
	}
	return ret;
}

function KDQuestTick(quests) {
	if (quests) {
		for (let q of quests) {
			if (q == "DragonLeaderDuelist" && KDGameData.RoomType == "" && !KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel)) {
				let point = KinkyDungeonGetRandomEnemyPoint(true);
				if (point) {
					KinkyDungeonSummonEnemy(point.x, point.y, "DragonLeaderDuelist", 1, 2.9);
				}
			} else if (q == "ApprenticeQuest" && KDGameData.RoomType == "" && !KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel)) {
				let point = KinkyDungeonGetRandomEnemyPoint(true);
				if (point) {
					KinkyDungeonSummonEnemy(point.x, point.y, "Librarian", 1, 2.9);
				}
			} else if (q == "BanditPrisoner" && !KinkyDungeonBossFloor(MiniGameKinkyDungeonLevel)) {
				let point = KinkyDungeonGetRandomEnemyPoint(true);
				if (point) {
					point = KinkyDungeonNearestJailPoint(point.x, point.y);
					if (point) {
						KinkyDungeonSummonEnemy(point.x, point.y, "PrisonerBandit", 1, 1.5);
					}
				}
				KDRemoveQuest("BanditPrisoner"); // Only lasts 1 floor
			}
		}
	}
}

function KDRemoveQuest(quest) {
	if (!KDGameData.Quests)
		KDGameData.Quests = [];
	else
		KDGameData.Quests.splice(KDGameData.Quests.indexOf(quest), 1);
}
function KDAddQuest(quest) {
	if (!KDGameData.Quests) KDGameData.Quests = [];
	if (!KDGameData.Quests.includes(quest))
		KDGameData.Quests.push(quest);
}

function KDHasQuest(quest) {
	if (!KDGameData.Quests) return false;
	return KDGameData.Quests.includes(quest);
}