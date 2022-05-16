"use strict";

/** No dialogues will trigger when the player dist is higher than this */
let KinkyDungeonMaxDialogueTriggerDist = 5.9;

/** @type {Record<string, KinkyDialogueTrigger>} */
let KDDialogueTriggers = {
	"WeaponStop": {
		dialogue: "WeaponFound",
		allowedPrisonStates: ["parole"],
		excludeTags: ["zombie", "skeleton"],
		playRequired: true,
		noCombat: true,
		noAlly: true,
		blockDuringPlaytime: false,
		prerequisite: (enemy, dist) => {
			return (KinkyDungeonPlayerDamage
				&& !KinkyDungeonPlayerDamage.unarmed
				&& KinkyDungeonPlayerDamage.name != "Knife"
				&& dist < 3.9
				&& KDHostile(enemy)
				&& KDRandom() < 0.25);
		},
		weight: (enemy, dist) => {
			return KDStrictPersonalities.includes(enemy.personality) ? 10 : 1;
		},
	},
	"OfferLatex": {
		dialogue: "OfferLatex",
		allowedPrisonStates: ["parole", ""],
		allowedPersonalities: ["Sub"],
		excludeTags: ["zombie", "skeleton", "robot"],
		playRequired: true,
		nonHostile: true,
		noCombat: true,
		noAlly: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !KinkyDungeonFlags.get("DangerFlag")
				&& !KinkyDungeonFlags.get("BondageOffer")
				&& !KinkyDungeonFlags.get("NoTalk")
				&& KDRandom() < 0.25
				&& KinkyDungeonGetRestraint({tags: ["latexRestraints", "latexRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]) != undefined);
		},
		weight: (enemy, dist) => {
			return 1 + 0.2 * Math.max(Math.abs(KinkyDungeonGoddessRep.Latex), Math.abs(KinkyDungeonGoddessRep.Conjure));
		},
	},
	"OfferChastity": {
		dialogue: "OfferChastity",
		allowedPrisonStates: ["parole", ""],
		allowedPersonalities: ["Sub"],
		excludeTags: ["zombie", "skeleton", "robot"],
		playRequired: true,
		nonHostile: true,
		noCombat: true,
		noAlly: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& KinkyDungeonStatsChoice.has("arousalMode")
				&& !KinkyDungeonFlags.get("DangerFlag")
				&& !KinkyDungeonFlags.get("BondageOffer")
				&& !KinkyDungeonFlags.get("ChastityOffer")
				&& !KinkyDungeonFlags.get("NoTalk")
				&& KDRandom() < 0.05
				&& KinkyDungeonGetRestraint({tags: ["genericChastity"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]) != undefined);
		},
		weight: (enemy, dist) => {
			return 1 + 0.2 * Math.max(Math.abs(KinkyDungeonGoddessRep.Metal), Math.abs(KinkyDungeonGoddessRep.Elements), Math.abs(KinkyDungeonGoddessRep.Illusion), Math.abs(KinkyDungeonGoddessRep.Ghost));
		},
	},
	"OfferRopes": {
		dialogue: "OfferRopes",
		allowedPrisonStates: ["parole", ""],
		allowedPersonalities: ["Dom"],
		excludeTags: ["zombie", "skeleton", "robot"],
		playRequired: true,
		nonHostile: true,
		noCombat: true,
		noAlly: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !KinkyDungeonFlags.get("DangerFlag")
				&& !KinkyDungeonFlags.get("BondageOffer")
				&& !KinkyDungeonFlags.get("NoTalk")
				&& KDRandom() < 0.5
				&& KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]) != undefined);
		},
		weight: (enemy, dist) => {
			return 1 + 0.2 * Math.abs(KinkyDungeonGoddessRep.Rope);
		},
	},
	"OfferLeather": {
		dialogue: "OfferLeather",
		allowedPrisonStates: ["parole", ""],
		excludeTags: ["zombie", "skeleton", "robot"],
		playRequired: true,
		nonHostile: true,
		noCombat: true,
		noAlly: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !KinkyDungeonFlags.get("DangerFlag")
				&& !KinkyDungeonFlags.get("BondageOffer")
				&& !KinkyDungeonFlags.get("NoTalk")
				&& KDRandom() < 0.5
				&& KinkyDungeonGetRestraint({tags: ["leatherRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]) != undefined);
		},
		weight: (enemy, dist) => {
			return 1 + 0.1 * Math.abs(KinkyDungeonGoddessRep.Leather + 50);
		},
	},
	"OfferWolfgirl": {
		dialogue: "OfferWolfgirl",
		allowedPrisonStates: ["parole", ""],
		requireTags: ["wolfgirl", "trainer"],
		playRequired: true,
		nonHostile: true,
		noCombat: true,
		noAlly: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !KinkyDungeonFlags.get("DangerFlag")
				&& !KinkyDungeonFlags.get("WolfgirlOffer")
				&& !KinkyDungeonFlags.get("NoTalk")
				&& KinkyDungeonCurrentDress != "Wolfgirl"
				&& KDRandom() < 0.5);
		},
		weight: (enemy, dist) => {
			return 10;
		},
	},
	"PotionSell": KDShopTrigger("PotionSell"),
	"ElfCrystalSell": KDShopTrigger("ElfCrystalSell"),
	"NinjaSell": KDShopTrigger("NinjaSell"),
	"ScrollSell": KDShopTrigger("ScrollSell"),
	"GhostSell": KDShopTrigger("GhostSell"),
	"WolfgirlSell": KDShopTrigger("WolfgirlSell"),

};

function KDShopTrigger(name) {
	return {
		dialogue: name,
		allowedPrisonStates: ["parole", ""],
		nonHostile: true,
		noCombat: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !(KDGameData.SleepTurns > 0)
				&& KDEnemyHasFlag(enemy, name)
				&& !KDEnemyHasFlag(enemy, "NoShop"));
		},
		weight: (enemy, dist) => {
			return 100;
		},
	};
}

function KinkyDungeonGetShopForEnemy(enemy) {
	let shoplist = [];
	for (let s of KDShops) {
		let end = false;
		if (s.tags) {
			for (let t of s.tags) {
				if (!enemy.Enemy.tags.has(t)) {
					end = true;
					break;
				}
			}
		}
		let hasTag = !s.singletag;
		if (!end && s.singletag) {
			for (let t of s.singletag) {
				if (enemy.Enemy.tags.has(t)) {
					hasTag = true;
					break;
				}
			}
		}
		if (!hasTag) end = true;
		if (!end && (!s.chance || KDRandom() < s.chance)) shoplist.push(s.name);
	}
	if (shoplist.length > 0) return shoplist[Math.floor(KDRandom() * shoplist.length)];
	return "";
}