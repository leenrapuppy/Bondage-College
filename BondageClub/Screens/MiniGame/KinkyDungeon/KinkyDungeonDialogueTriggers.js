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
				&& KinkyDungeonPlayerDamage.name != "Unarmed"
				&& dist < 3.9
				&& KDHostile(enemy)
				&& KDRandom() < 0.25);
		},
		weight: (enemy, dist) => {
			return KDStrictPersonalities.includes(enemy.personality) ? 10 : 1;
		},
	},
	"OfferDress": {
		dialogue: "OfferDress",
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
				&& KinkyDungeonGetRestraint({tags: ["bindingDress"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]) != undefined);
		},
		weight: (enemy, dist) => {
			return 1 + 0.8 * Math.max(Math.abs(KinkyDungeonGoddessRep.Latex)/100, Math.abs(KinkyDungeonGoddessRep.Conjure)/100);
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
			return 1 + 0.4 * Math.max(Math.abs(KinkyDungeonGoddessRep.Latex)/100, Math.abs(KinkyDungeonGoddessRep.Conjure)/100);
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
			return 1 + 0.8 * Math.max(Math.abs(KinkyDungeonGoddessRep.Metal)/100, Math.abs(KinkyDungeonGoddessRep.Elements)/100, Math.abs(KinkyDungeonGoddessRep.Illusion)/100, Math.abs(KinkyDungeonGoddessRep.Ghost)/100);
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
			return 1 + 0.4 * Math.abs(KinkyDungeonGoddessRep.Rope + 50)/100;
		},
	},

	"OfferMithril": {
		dialogue: "OfferMithril",
		allowedPrisonStates: ["parole", ""],
		allowedPersonalities: ["Dom","Sub"],
		requireTagsSingle: ["mithrilRestraints"],
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
                && KinkyDungeonGetRestraint({tags: ["mithrilRestraints"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]) != undefined);
		},
		weight: (enemy, dist) => {
			return 1 + 0.4 * Math.max(Math.abs(KinkyDungeonGoddessRep.Metal)/100, Math.abs(KinkyDungeonGoddessRep.Ghost)/100);
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
			return 1 + 0.5 * Math.abs(KinkyDungeonGoddessRep.Leather + 50)/100;
		},
	},
	"OfferWolfgirl": KDRecruitTrigger("OfferWolfgirl"),
	"PotionSell": KDShopTrigger("PotionSell"),
	"ElfCrystalSell": KDShopTrigger("ElfCrystalSell"),
	"NinjaSell": KDShopTrigger("NinjaSell"),
	"ScrollSell": KDShopTrigger("ScrollSell"),
	"GhostSell": KDShopTrigger("GhostSell"),
	"WolfgirlSell": KDShopTrigger("WolfgirlSell"),
	"Fuuka": KDBossTrigger("Fuuka", ["Fuuka1", "Fuuka2"]),
	"FuukaLose": KDBossLose("FuukaLose", ["Fuuka1", "Fuuka2"]),

};

function KDShopTrigger(name) {
	return {
		dialogue: name,
		allowedPrisonStates: ["parole", ""],
		nonHostile: true,
		noCombat: true,
		excludeTags: ["noshop"],
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

/**
 *
 * @param {string} name
 * @returns {KinkyDialogueTrigger}
 */
function KDRecruitTrigger(name) {
	let dialogue = KDRecruitDialog.find((e) => {return name == e.name;});
	if (dialogue)
		return {
			dialogue: name,
			allowedPrisonStates: ["parole", ""],
			requireTags: dialogue.tags,
			requireTagsSingle: dialogue.singletag,
			excludeTags: dialogue.excludeTags,
			playRequired: true,
			nonHostile: true,
			noCombat: true,
			noAlly: true,
			blockDuringPlaytime: true,
			prerequisite: (enemy, dist) => {
				return (dist < 1.5
					&& !KinkyDungeonFlags.get("DangerFlag")
					&& !KinkyDungeonFlags.get(name)
					&& !KinkyDungeonFlags.get("NoTalk")
					&& KinkyDungeonCurrentDress != dialogue.outfit
					&& KDFactionRelation("Player", KDGetFactionOriginal(enemy)) > -0.1
					&& KDRandom() < dialogue.chance);
			},
			weight: (enemy, dist) => {
				return 10;
			},
		};
	return null;
}

/** Boss intro dialogue */
function KDBossTrigger(name, enemyName) {
	return {
		dialogue: name,
		nonHostile: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !(KDGameData.SleepTurns > 0)
				&& enemyName.includes(enemy.Enemy.name)
				&& !KinkyDungeonFlags.has("BossUnlocked")
				&& !KinkyDungeonFlags.has("BossDialogue" + name));
		},
		weight: (enemy, dist) => {
			return 100;
		},
	};
}

/** Lose to a boss */
function KDBossLose(name, enemyName) {
	return {
		dialogue: name,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5
				&& !(KDGameData.SleepTurns > 0)
				&& enemyName.includes(enemy.Enemy.name)
				&& !KinkyDungeonFlags.has("BossUnlocked")
				&& !KinkyDungeonHasStamina(1.1));
		},
		weight: (enemy, dist) => {
			return 100;
		},
	};
}

function KinkyDungeonGetShopForEnemy(enemy, guaranteed) {
	if (enemy.Enemy.tags.has("noshop")) return "";
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
		if (!end && (guaranteed || !s.chance || KDRandom() < s.chance)) shoplist.push(s.name);
	}
	if (shoplist.length > 0) return shoplist[Math.floor(KDRandom() * shoplist.length)];
	return "";
}