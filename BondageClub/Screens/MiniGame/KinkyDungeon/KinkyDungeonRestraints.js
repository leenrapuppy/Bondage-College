"use strict";
// Escape chances
// Struggle : How difficult it is to struggle out of the item. Shouldn't be below 0.1 as that would be too tedious. Negative values help protect against spells.
// Cut : How difficult it is to cut with a knife. Metal items should have 0, rope and leather should be low but possible, and stuff like tape should be high
// Remove : How difficult it is to get it off by unbuckling. Most items should have a high chance if they have buckles, medium chance if they have knots, and low chance if they have a difficult mechanism.
// Pick : How hard it is to pick the lock on the item. Higher level items have more powerful locks. The general formula is 0.33 for easy items, 0.1 for medium items, 0.05 for hard items, and 0.01 for super punishing items
// Unlock : How hard it is to reach the lock. Should be higher than the pick chance, and based on accessibility. Items like the

// Note that there is a complex formula for how the chances are manipulated based on whether your arms are bound. Items that bind the arms are generally unaffected, and items that bind the hands are unaffected, but they do affect each other

// Power is a scale of how powerful the restraint is supposed to be. It should roughly match the difficulty of the item, but can be higher for special items. Power 10 or higher might be totally impossible to struggle out of.

// These are groups that the game is not allowed to remove because they were tied at the beginning
let KinkyDungeonRestraintsLocked = [];

let KinkyDungeonCurrentEscapingItem = null;
let KinkyDungeonCurrentEscapingMethod = null;
let KinkyDungeonStruggleTime = 0;

let KinkyDungeonMultiplayerInventoryFlag = false;
let KinkyDungeonItemDropChanceArmsBound = 0.2; // Chance to drop item with just bound arms and not bound hands.

//let KinkyDungeonKnifeBreakChance = 0.15;
let KinkyDungeonKeyJamChance = 0.33;
let KinkyDungeonKeyPickBreakAmount = 12; // Number of tries per pick on average 5-11
let KinkyDungeonPickBreakProgress = 0;
let KinkyDungeonKnifeBreakAmount = 10; // Number of tries per knife on average 6-12
let KinkyDungeonKnifeBreakProgress = 0;
let KinkyDungeonEnchKnifeBreakAmount = 24; // Number of tries per knife on average
let KinkyDungeonEnchKnifeBreakProgress = 0;

let KinkyDungeonMaxImpossibleAttempts = 3; // base, more if the item is close to being impossible

let KinkyDungeonEnchantedKnifeBonus = 0.1; // Bonus whenever you have an enchanted knife

let KinkyDungeonRestraintsCache = new Map();

// Format: strict group => [list of groups the strictness applies to]
const KinkyDungeonStrictnessTable = new Map([
	["ItemHead", ["ItemEars"]],
	["ItemMouth", ["ItemHead", "ItemEars"]],
	["ItemMouth2", ["ItemHead", "ItemEars"]],
	["ItemMouth3", ["ItemHead", "ItemEars"]],
	["ItemNeck", ["ItemMouth", "ItemArms"]],
	["ItemArms", ["ItemArms", "ItemHands"]],
	["ItemTorso", ["ItemArms", "ItemLegs", "ItemPelvis", "ItemBreast"]],
	["ItemLegs", ["ItemFeet", "ItemBoots"]],
	["ItemFeet", ["ItemBoots"]],
]);

const KinkyDungeonRestraints = [
	{removePrison: true, name: "DuctTapeArms", Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", bindarms: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemArmsFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", blockfeet: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemLegsFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeBoots", Asset: "ToeTape", Type: "Full", Color: "#AA2222", Group: "ItemBoots", blockfeet: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "DuctTapeLegs", Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", hobble: true, power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeHead", Type: "Wrap", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":5}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeMouth", Asset: "DuctTape", Color: "#AA2222", Group: "ItemMouth2", power: -2, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":5}, playerTags: {"ItemMouth1Full":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "DuctTapeHeadMummy", Type: "Mummy", Asset: "DuctTape", Color: "#AA2222", Group: "ItemHead", power: 2, weight: 0,  escapeChance: {"Struggle": 0.15, "Cut": 0.8, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemMouth1Full":2, "ItemMouth2Full":1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "DuctTapeArmsMummy", Type: "Complete", remove: ["Cloth", "ClothLower"], Asset: "DuctTape", Color: "#AA2222", Group: "ItemArms", bindarms: true, power: 2, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemArmsFull":3}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "DuctTapeLegsMummy", Type: "CompleteLegs", remove: ["ClothLower"], Asset: "DuctTape", Color: "#AA2222", Group: "ItemLegs", hobble: true, power: 2, weight: 0,  escapeChance: {"Struggle": 0.15, "Cut": 0.8, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemLegsFull":3}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Hobbleskirts"]},
	{removePrison: true, name: "DuctTapeFeetMummy", Type: "CompleteFeet", Asset: "DuctTape", Color: "#AA2222", Group: "ItemFeet", blockfeet: true, power: 2, weight: 0,  escapeChance: {"Struggle": 0.15, "Cut": 0.8, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"ribbonRestraints":1}, playerTags: {"ItemFeetFull":3}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},

	{removePrison: true, name: "MysticDuctTapeHead", Type: "Wrap", Asset: "DuctTape", Color: "#55AA22", Group: "ItemHead", power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.6, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"mummyRestraints":-399}, playerTags: {"ItemMouth2Full":99, "ItemArmsFull":99, "ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "MysticDuctTapeMouth", Asset: "DuctTape", Color: "#55AA22", Group: "ItemMouth2", power: 1, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.6, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"mummyRestraints":-299}, playerTags: {"ItemArmsFull":99, "ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "MysticDuctTapeArmsMummy", Type: "Complete", remove: ["Cloth", "ClothLower"], Asset: "DuctTape", Color: "#55AA22", Group: "ItemArms", bindarms: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"mummyRestraints":-199}, playerTags: {"ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "MysticDuctTapeLegsMummy", Type: "CompleteLegs", remove: ["ClothLower"], Asset: "DuctTape", Color: "#55AA22", Group: "ItemLegs", hobble: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"mummyRestraints":-99}, playerTags: {"ItemFeetFull":99, "ItemBootsFull":99}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Hobbleskirts"]},
	{removePrison: true, name: "MysticDuctTapeFeetMummy", Type: "CompleteFeet", Asset: "DuctTape", Color: "#55AA22", Group: "ItemFeet", blockfeet: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"mummyRestraints":-1}, playerTags: {"ItemBootsFull":99}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "MysticDuctTapeBoots", Asset: "ToeTape", Type: "Full", Color: "#55AA22", Group: "ItemBoots", blockfeet: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"mummyRestraints":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},

	{removePrison: true, name: "AutoTapeArms", Type: "Top", Asset: "DuctTape", Color: "#6E9FA3", Group: "ItemArms", bindarms: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"autoTape":10}, playerTags: {"ItemArmsFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "AutoTapeFeet", Asset: "DuctTape", Color: "#6E9FA3", Group: "ItemFeet", blockfeet: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"autoTape":10}, playerTags: {"ItemLegsFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "AutoTapeBoots", Asset: "ToeTape", Type: "Full", Color: "#6E9FA3", Group: "ItemBoots", blockfeet: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"autoTape":10}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms", "Wrapping"]},
	{removePrison: true, name: "AutoTapeLegs", Type: "MostLegs", Asset: "DuctTape", Color: "#6E9FA3", Group: "ItemLegs", hobble: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"autoTape":10}, playerTags: {"ItemFeetFull":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "AutoTapeHead", Type: "Wrap", Asset: "DuctTape", Color: "#6E9FA3", Group: "ItemHead", power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},
	{removePrison: true, name: "AutoTapeMouth", Asset: "DuctTape", Type: "Double", Color: "#6E9FA3", Group: "ItemMouth2", power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0}, failSuffix: {"Remove": "Tape"},
		enemyTags: {"autoTape":10}, playerTags: {"ItemMouth1Full":8}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Charms"]},

	{removePrison: true, name: "SlimeBoots", Asset: "ToeTape", Type: "Full", Color: "#9B49BD", Group: "ItemBoots", blockfeet: true, power: 4, weight: 0,  escapeChance: {"Struggle": 0.2, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.04}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Wrapping"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeFeet", Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, Color: "#9B49BD", Group: "ItemFeet", blockfeet: true, power: 4, weight: -100,  escapeChance: {"Struggle": 0.2, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.05}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 101}, playerTags: {"ItemBootsFull":15}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Wrapping"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeLegs", remove: ["ClothLower"],  Asset: "SeamlessHobbleSkirt", Color: "#9B49BD", Group: "ItemLegs", hobble: true, power: 4, weight: -102,  escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.07}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 103}, playerTags: {"ItemFeetFull":2, "ItemBootsFull":2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Hobbleskirts"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeArms", remove: ["Bra"], Asset: "StraitLeotard", Modules: [0, 0, 0, 0], Color: "#9B49BD", Group: "ItemArms", bindarms: true, bindhands: true, power: 6, weight: -102,  escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.1}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 103}, playerTags: {"ItemFeetFull":2, "ItemBootsFull":2, "ItemLegsFull":2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeHands", Asset: "DuctTape", Color: "#9B49BD", Group: "ItemHands", bindhands: true, power: 1, weight: -102,  escapeChance: {"Struggle": 0.3, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.05}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 103}, playerTags: {"ItemFeetFull":1, "ItemBootsFull":1, "ItemLegsFull":1, "ItemHeadFull":1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"], addTag: ["slime"]},
	{removePrison: true, name: "SlimeHead", Asset: "LeatherSlimMask", Color: "#9B49BD", Group: "ItemHead", power: 4, weight: -102,  escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0}, events: [{trigger: "tick", type: "slimeSpread", power: 0.05}, {trigger: "remove", type: "slimeStop"}], slimeLevel: 1,
		enemyTags: {"slimeRestraints":100, "slimeRestraintsRandom": 100}, playerTags: {"ItemFeetFull":1, "ItemBootsFull":1, "ItemLegsFull":1, "ItemHandsFull":1, "ItemArmsFull":1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Wrapping"], addTag: ["slime"]},

	{removePrison: true, name: "HardSlimeBoots", Asset: "ToeTape", Type: "Full", Color: "#9B49BD", Group: "ItemBoots", blockfeet: true, power: 5, weight: 0,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Wrapping"]},
	{removePrison: true, name: "HardSlimeFeet", Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, Color: "#9B49BD", Group: "ItemFeet", blockfeet: true, power: 6, weight: -100,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Wrapping"]},
	{removePrison: true, name: "HardSlimeLegs", remove: ["ClothLower"], Asset: "SeamlessHobbleSkirt", Color: "#9B49BD", Group: "ItemLegs", hobble: true, power: 6, weight: -102,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Legbinders"]},
	{removePrison: true, name: "HardSlimeArms", remove: ["Bra"], Asset: "StraitLeotard", Modules: [0, 0, 0, 0], Color: "#9B49BD", Group: "ItemArms", bindarms: true, bindhands: true, power: 8, weight: -102,  escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"]},
	{removePrison: true, name: "HardSlimeHands", Asset: "DuctTape", Color: "#9B49BD", Group: "ItemHands", bindhands: true, power: 5, weight: -102,  escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"]},
	{removePrison: true, name: "HardSlimeHead", Asset: "LeatherSlimMask", Color: "#9B49BD", Group: "ItemHead", power: 6, weight: -102,  escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Wrapping"]},

	{removePrison: true, name: "GlueBoots", Asset: "ToeTape", Type: "Full", Color: "#f0b541", Group: "ItemBoots", blockfeet: true, power: 3, weight: 0,  escapeChance: {"Struggle": 0.3, "Cut": 0.0, "Remove": 0.05},
		enemyTags: {"glueRestraints":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"]},
	{removePrison: true, name: "GlueFeet", Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, Color: "#f0b541", Group: "ItemFeet", blockfeet: true, power: 3, weight: -100,  escapeChance: {"Struggle": 0.25, "Cut": 0.0, "Remove": 0.05},
		enemyTags: {"glueRestraints":100}, playerTags: {"ItemBootsFull":15}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"]},
	{removePrison: true, name: "GlueLegs", remove: ["ClothLower"], Asset: "SeamlessHobbleSkirt", Color: "#f0b541", Group: "ItemLegs", blockfeet: true, power: 34, weight: -102,  escapeChance: {"Struggle": 0.2, "Cut": 0.0, "Remove": 0.05},
		enemyTags: {"glueRestraints":100}, playerTags: {"ItemBootsFull":2, "ItemFeetFull":2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Hobbleskirts"]},

	{inventory: true, name: "LatexStraitjacket", remove: ["Bra"], Asset: "StraitLeotard", Modules: [0, 0, 0, 0], Color: "#6A94CC", Group: "ItemArms", bindarms: true, bindhands: true, power: 8, weight: 0, strictness: 0.2, escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		maxstamina: 0.25, enemyTags: {"latexRestraintsHeavy" : 1}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Straitjackets"]},
	{inventory: true, name: "LatexArmbinder", Asset: "SeamlessLatexArmbinder", strictness: 0.1, LinkableBy: ["Wrapping"], Color: "#6A94CC", Group: "ItemArms", bindarms: true, bindhands: true, power: 7, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		maxstamina: 0.35, enemyTags: {"latexRestraints" : 3}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Armbinders"]},
	{inventory: true, name: "LatexLegbinder", Asset: "SeamlessLegBinder", LinkableBy: ["Hobbleskirts"], Color: "#6A94CC", Group: "ItemLegs", hobble: true, power: 7, weight: 0,  escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		maxstamina: 0.6, enemyTags: {"latexRestraintsHeavy" : 6}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Hobbleskirts"]},
	{inventory: true, name: "LatexBoots", Asset: "HighThighBoots", Color: "#6A94CC", Group: "ItemBoots", hobble: true, power: 6, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.12, "Remove": 0.07, "Pick": 0.25},
		enemyTags: {"latexRestraints" : 8, "latexBoots" : 3}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex"]},
	{inventory: true, name: "LatexCorset", remove: ["Cloth"], Asset: "HeavyLatexCorset", strictness: 0.1, Color: "#5196EF", Group: "ItemTorso", harness: true, power: 8, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.2, "Remove": 0.15}, struggleMinSpeed: {"Remove": 0.05}, struggleMaxSpeed: {"Remove": 0.1},
		failSuffix: {"Remove": "Corset"}, enemyTags: {"latexRestraints" : 6}, playerTags: {"ItemTorsoFull": -5}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Corsets", "HeavyCorsets"]},
	{inventory: true, name: "LatexBallGag", Asset: "BallGag", gag: true, Color: ["#4EA1FF", "Default"], Type: "Tight", Group: "ItemMouth", power: 7, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.04, "Remove": 0.4, "Pick": 0.25},
		maxstamina: 0.8, enemyTags: {"latexRestraints" : 3, "latexGag" : 10}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Leather"]},

	{inventory: true, name: "WolfArmbinder", Asset: "SeamlessLatexArmbinder", strictness: 0.1, LinkableBy: ["Wrapping"], Color: "#2E2E2E", Group: "ItemArms", bindarms: true, bindhands: true, power: 7, weight: 0,  escapeChance: {"Struggle": 0.05, "Cut": 0.15, "Remove": 0.07, "Pick": 0.2},
		maxstamina: 0.35, enemyTags: {"wolfRestraints" : 3}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Armbinders"]},
	{inventory: true, name: "WolfAnkleCuffs", Asset: "FuturisticAnkleCuffs", Link: "WolfAnkleCuffs2", Type: "Chained", Color: ['#4F91DE', '#4F91DE', '#3F6945', '#000000'], Group: "ItemFeet", hobble: true, power: 8, weight: 0,
		escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 0.4, "Pick": 0.15},
		maxstamina: 1.0, enemyTags: {"wolfRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.6, noSub: 0.3, noLeash: true}]},
	{name: "WolfAnkleCuffs2", Asset: "FuturisticAnkleCuffs", UnLink: "WolfAnkleCuffs", Type: "Closed", Color: ['#4F91DE', '#4F91DE', '#3F6945', '#000000'], Group: "ItemFeet", blockfeet: true, power: 8, weight: 0,
		escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 0.4, "Pick": 0.15},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{inventory: true, name: "WolfHarness", remove: ["Cloth"], Asset: "FuturisticHarness", strictness: 0.05, Color: ['#4F91DE', '#346942', '#889FA7', 'Default'], Group: "ItemTorso", harness: true, power: 4, weight: 0,
		escapeChance: {"Struggle": 0, "Cut": 0.2, "Remove": 0.1},
		maxstamina: 1.0, enemyTags: {"wolfRestraints" : 6}, playerTags: {"ItemTorsoFull": -5}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Harnesses"]},
	{inventory: true, name: "WolfBallGag", Asset: "FuturisticHarnessBallGag", gag: true, Color: ['#4F91DE', '#428E4F', '#6E6E6E', '#FFFFFF', '#000000'], Group: "ItemMouth", power: 10, weight: 0,
		maxstamina: 0.75, escapeChance: {"Struggle": 0, "Cut": 0.0, "Remove": 0.05, "Pick": 0.2},
		enemyTags: {"wolfRestraints" : 8}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Leather"]},
	{name: "WolfCollar", Asset: "AutoShockCollar", Color: ['#6EAF81', '#6EAF81'], Group: "ItemNeck", power: 11, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0.1, "Pick": 0.05},
		maxstamina: 0.5, enemyTags: {"wolfRestraints":3}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Collars"],
		events: [
			{trigger: "playerAttack", type: "PunishPlayer", chance: 0.25, stun: 2, warningchance: 1.0, damage: "electric", power: 2, sfx: "Shock"},
			{trigger: "playerCast", type: "PunishPlayer", chance: 1.0, punishComponent: "Verbal", damage: "electric", power: 2, sfx: "Shock"}
		]},
	{removePrison: true, name: "WolfLeash", tether: 2.9, Asset: "CollarLeash", Color: "#44fF76", Group: "ItemNeckRestraints", leash: true, power: 1, weight: -99, harness: true,
		escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.4, "Pick": 0.35}, enemyTags: {"wolfRestraints":9}, playerTags: {"ItemNeckRestraintsFull":-2, "ItemNeckFull":999}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},

	{inventory: true, name: "WolfPanties", Asset: "RedBowPanties", strictness: 0.05, Color: ['#FFFFFF', '#D269CA'], AssetGroup: "Panties", Group: "ItemPelvis", power: 4,
		vibeType: "TeaserRemote", intensity: 2, orgasm: false, battery: 0, maxbattery: 12, weight: 0,
		escapeChance: {"Struggle": 0.05, "Cut": 0.3, "Remove": 0.05}, escapeMult: 3.0,
		maxstamina: 0.5, enemyTags: {"wolfRestraints" : 6}, playerTags: {"ItemPelvisFull": -5}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Panties"]},

	{inventory: true, name: "BindingDress", remove: ["Cloth", "Bra"], Type: "Strap", Asset: "LeatherArmbinder", strictness: 0.25, Color: ['#473488'], Group: "ItemArms", bindarms: true, bindhands: true, power: 7, weight: 0,
		escapeChance: {"Struggle": 0.0, "Cut": 0.2, "Remove": -0.2, "Pick": 0.15}, helpChance: {"Struggle": 0.0, "Cut": 0.2, "Remove": 0.025},
		alwaysDress: [
			{Item: "PleatedSkirt", Group: "ClothLower", Color: ['#6B48E0'], override: true},
			{Item: "SleevelessCatsuit", Group: "Suit", Color: ['#473488'], override: true}],
		maxstamina: 0.5, enemyTags: {"dressRestraints" : 10}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Panties"]},

	{inventory: true, name: "DressBra", Asset: "FuturisticBra2", Color: ['#6B48E0', '#F8BD01', '#6B48E0', '#6B48E0', '#F8BD01', '#6B48E0'], Group: "ItemBreast", chastitybra: true, power: 8, weight: -2,
		escapeChance: {"Struggle": 0, "Cut": -0.05, "Remove": 0.4, "Pick": 0.15}, DefaultLock: "Red", bypass: true,
		maxstamina: 0.9, enemyTags: {"dressRestraints" : 10}, playerTags: {"ItemNipplesFull": 2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Harnesses"]},

	{inventory: true, name: "NippleClamps", Asset: "HeartPasties", Color: "Default", Group: "ItemNipples", power: 3, weight: 0,
		vibeType: "TeaserRemote", intensity: 1, orgasm: false, battery: 0, maxbattery: 3.5,
		escapeChance: {"Struggle": -10, "Cut": -0.05, "Remove": 0.5}, failSuffix: {"Struggle": "Clamps"},
		maxstamina: 1.0, enemyTags: {"dressRestraints" : 4, "genericToys": 2, "maidRestraints": 1, "maidRestraintsLight": 1}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Vibes"]},

	{inventory: true, name: "ControlHarness", Asset: "FuturisticHarness", strictness: 0.1, Color: ['#8CF3FF', '#352753', '#889FA7', '#000000'], Group: "ItemTorso", harness: true, power: 10, weight: 0,
		escapeChance: {"Struggle": 0, "Cut": -0.2, "Remove": 0.4, "Pick": 0.1}, DefaultLock: "Red",
		maxstamina: 0.5, enemyTags: {"controlHarness" : 1}, playerTags: {}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Harnesses", "Futuristic"]},

	{name: "TrackingCollar", Asset: "FuturisticCollar", Color: ['#8CF3FF', '#352753', '#889FA7', '#000000'], Group: "ItemNeck", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.25, "Pick": 0.05},
		maxstamina: 0.5, enemyTags: {"controlHarness":10}, playerTags: {"ItemNeckEmpty":10}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Collars", "Futuristic"],
		events: [
			{trigger: "playerAttack", type: "AlertEnemies", chance: 1.0, power: 10, sfx: "Alarm"},
		]},

	// collar #6EAF81

	{inventory: true, name: "ExpArmbinder", Asset: "BoxTieArmbinder", strictness: 0.08, LinkableBy: ["Wrapping"], Color: ["#415690", "#ffffff"], Group: "ItemArms", bindarms: true, bindhands: true, power: 7, weight: 0,  escapeChance: {"Struggle": 0.1, "Cut": 0.15, "Remove": 0.1, "Pick": 0.35},
		maxstamina: 0.25, enemyTags: {"expRestraints" : 4}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Boxbinders"]},
	{inventory: true, name: "ExpArmbinderHarness", Asset: "Corset4", LinkableBy: ["HeavyCorsets", "Harnesses"], Color: "#383E4D", Group: "ItemTorso", strictness: 0.1, power: 9, weight: -10, escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0.15},
		maxstamina: 0.6, enemyTags: {"expRestraints" : 9}, playerTags: {"Boxbinders": 20, "Armbinders": 20}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "ArmbinderHarness", "Corset"],
		events: [{trigger: "remove", type: "armbinderHarness"}]},
	{inventory: true, name: "ExpAnkleCuffs", Asset: "SteelAnkleCuffs", Link: "ExpAnkleCuffs2", Type: "Chained", Color: "#333333", Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"expRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "ExpAnkleCuffs2", Asset: "SteelAnkleCuffs", UnLink: "ExpAnkleCuffs", Type: "Closed", Color: "#333333", Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "ExpCollar", Asset: "LatexPostureCollar", gag: true, Color: "#4E7DFF", Group: "ItemNeck", power: 8, weight: -2, strictness: 0.05, escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.2, "Pick": 0.25},
		maxstamina: 0.1, enemyTags: {"expRestraints" : 2.1}, playerTags: {"ItemMouthFull": 2, "ItemMouth2Full": 2, "ItemMouth3Full": 2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Posture", "Collars"]},
	{inventory: true, name: "ExpBoots", Asset: "BalletWedges", Color: "#748395", Group: "ItemBoots", hobble: true, power: 8, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.0, "Remove": 0.07, "Pick": 0.25},
		maxstamina: 0.9, enemyTags: {"expRestraints" : 6, "latexBoots" : 3, "wolfRestraints": 6}, playerTags: {}, minLevel: 5, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Boots"]},

	{inventory: true, name: "Stuffing", Asset: "ClothStuffing", Group: "ItemMouth", power: -20, weight: 0, escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, enemyTags: {"stuffedGag": 100, "clothRestraints":10, "ribbonRestraints":6}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])},

	{name: "WeakMagicRopeArms", Asset: "HempRope", Color: "#ff88AA", LinkableBy: ["Boxbinders", "Wrapping"], Group: "ItemArms", bindarms: true, power: 5, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.2},
		maxstamina: 0.65, enemyTags: {"ropeMagicWeak":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "WeakMagicRopeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "#ff88AA", Group: "ItemLegs", hobble: true, power: 3, weight: 1,
		escapeChance: {"Struggle": 0.3, "Cut": 0.67, "Remove": 0.15}, enemyTags: {"ropeMagicWeak":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "StrongMagicRopeCuffs", Asset: "HempRope", Color: "#ff00dd", Type: "RopeCuffs", LinkableBy: ["Boxbinders", "Armbinders", "Wrapping"], Group: "ItemArms", bindarms: true, power: 2, weight: 1, escapeChance: {"Struggle": 0.3, "Cut": 0.35, "Remove": -0.1}, specStruggleTypes: ["Remove"],
		maxstamina: 1.0, enemyTags: {"ropeMagicStrong":5}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "StrongMagicRopeArms", Asset: "HempRope", Color: "#ff00dd", LinkableBy: ["Boxbinders", "Wrapping"], Group: "ItemArms", bindarms: true, power: 6, weight: 1, escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, specStruggleTypes: ["Remove"],
		maxstamina: 0.65, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "StrongMagicRopeHogtie", Asset: "HempRope", Color: "#ff00dd", Type: "Hogtied", Group: "ItemArms", bindarms: true, power: 8, weight: 1, escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": -0.1}, specStruggleTypes: ["Remove"],
		maxstamina: 0.25, enemyTags: {"ropeMagicHogtie":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		events: [{trigger: "afterRemove", type: "replaceItem", list: ["StrongMagicRopeArms"], power: 6}]
	},
	{name: "StrongMagicRopeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "#ff00dd", Group: "ItemLegs", hobble: true, power: 5, weight: 1,
		escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, specStruggleTypes: ["Remove"],
		maxstamina: 0.8, enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "StrongMagicRopeFeet", Asset: "HempRope", Color: "#ff00dd", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 5, weight: 1,
		escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, specStruggleTypes: ["Remove"],
		enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "StrongMagicRopeCrotch", crotchrope: true, Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, Color: "#ff00dd", Group: "ItemPelvis", power: 5, weight: 1,
		escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, specStruggleTypes: ["Remove"], enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "StrongMagicRopeToe", Asset: "ToeTie", OverridePriority: 26, LinkableBy: ["Wrapping"], Color: "#ff00dd", Group: "ItemBoots", blockfeet: true, power: 5, weight: 1,
		escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, specStruggleTypes: ["Remove"], enemyTags: {"ropeMagicStrong":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},

	{name: "MithrilRopeArms", Asset: "HempRope", Color: "#ffffff", Type: "WristElbowTie", LinkableBy: ["Armbinders", "Wrapping"], Group: "ItemArms", bindarms: true, power: 6, weight: 1, magic: true,
		escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0.05}, specStruggleTypes: ["Remove"],
		maxstamina: 0.7, enemyTags: {"mithrilRope":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "MithrilRopeHogtie", Asset: "HempRope", Color: "#ffffff", Type: "KneelingHogtie", Group: "ItemArms", bindarms: true, power: 8, weight: 1, magic: true,
		escapeChance: {"Struggle": 0, "Cut": 0.15, "Remove": 0.05}, specStruggleTypes: ["Remove"],
		maxstamina: 0.15, enemyTags: {"mithrilRopeHogtie":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		events: [{trigger: "afterRemove", type: "replaceItem", list: ["MithrilRopeArms"], power: 6}]
	},
	{name: "MithrilRopeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "#ffffff", Group: "ItemLegs", hobble: true, power: 5, weight: 1, magic: true,
		escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0.05}, specStruggleTypes: ["Remove"], strictness: 0.1,
		maxstamina: 0.8, enemyTags: {"mithrilRope":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "MithrilRopeFeet", Asset: "HempRope", Color: "#ffffff", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 5, weight: 1, magic: true,
		escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0.05}, specStruggleTypes: ["Remove"], strictness: 0.1,
		enemyTags: {"mithrilRope":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "MithrilRopeHarness", harness: true, Asset: "HempRopeHarness", Type: "Star", OverridePriority: 26, Color: "#ffffff", Group: "ItemTorso", power: 5, weight: 1, magic: true,
		escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0.05}, specStruggleTypes: ["Remove"], strictness: 0.1,
		enemyTags: {"mithrilRope":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "MithrilRopeCrotch", crotchrope: true, Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, Color: "#ffffff", Group: "ItemPelvis", power: 5, weight: 1, magic: true,
		escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0.05}, specStruggleTypes: ["Remove"],
		enemyTags: {"mithrilRope":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{name: "MithrilRopeToe", Asset: "ToeTie", OverridePriority: 26, LinkableBy: ["Wrapping"], Color: "#ffffff", Group: "ItemBoots", blockfeet: true, power: 5, weight: 1, magic: true,
		escapeChance: {"Struggle": 0.1, "Cut": 0.2, "Remove": 0.05}, specStruggleTypes: ["Remove"],
		enemyTags: {"mithrilRope":2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},

	{inventory: true, name: "MithrilLegCuffs", Asset: "FuturisticLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Chained", Color: ['#888888', '#FFFFFF', '#CFBE88', '#000000'], Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25},
		maxstamina: 0.6, enemyTags: {"mithrilRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "MithrilAnkleCuffs", Asset: "FuturisticAnkleCuffs", LinkableBy: ["Wrapping"], Link: "MithrilAnkleCuffs2", Type: "Chained", Color: ['#888888', '#FFFFFF', '#CFBE88', '#000000'], Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"mithrilRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		maxstamina: 0.5, events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "MithrilAnkleCuffs2", Asset: "OrnateAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "FuturisticAnkleCuffs", Type: "Closed", Color: ['#888888', '#FFFFFF', '#CFBE88', '#000000'], Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"mithrilRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{nonbinding: true, inventory: true, name: "MithrilArmCuffs", Asset: "FuturisticCuffs", LinkableBy: ["Armbinders", "Straitjackets", "Boxbinders", "Wrapping"], Link: "MithrilArmCuffs2", Color: ['#FFFFFF', '#CFBE88', '#000000'], Group: "ItemArms", bindarms: false, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.25, "Pick": 0.35}, enemyTags: {"mithrilRestraints":24}, playerTags: {"ItemArmsFull":-2}, minLevel: 10, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		maxstamina: 0.4, events: [{trigger: "hit", type: "linkItem", chance: 0.33}, {trigger: "defeat", type: "linkItem", chance: 1.0}]},
	{name: "MithrilArmCuffs2", Asset: "FuturisticCuffs", Type: "Wrist", LinkableBy: ["Armbinders", "Boxbinders", "Wrapping"], Link: "MithrilArmCuffs3", UnLink: "MithrilArmCuffs", Color: ['#FFFFFF', '#CFBE88', '#000000'], Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.33}]},
	{name: "MithrilArmCuffs3", Asset: "FuturisticCuffs", Type: "Both", LinkableBy: ["Armbinders", "Wrapping"], UnLink: "MithrilArmCuffs4", Color: ['#FFFFFF', '#CFBE88', '#000000'], Group: "ItemArms", bindarms: true, power: 9, weight: 0, strictness: 0.1, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": -0.1, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "MithrilArmCuffs4", Asset: "FuturisticCuffs", Type: "Elbow", LinkableBy: ["Armbinders", "Wrapping"], Link: "MithrilArmCuffs3", UnLink: "MithrilArmCuffs", Color: ['#FFFFFF', '#CFBE88', '#000000'], Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": -0.15, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.5}]},
	{inventory: true, name: "MithrilCollar", Asset: "ShinySteelCollar", Color: ['#C9B883', '#C9B883'], Group: "ItemNeck", power: 9, weight: -2, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25},
		maxstamina: 0.1, enemyTags: {"mithrilRestraints":4}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Collars"]},


	// Not super punishing but would be hard to apply IRL
	{inventory: true, name: "DuctTapeHands", Asset: "DuctTape", Color: "Default", LinkableBy: ["Mittens"], Group: "ItemHands", bindhands: true, power: 1, weight: 0,  escapeChance: {"Struggle": 0, "Cut": 0.4, "Remove": 0.5}, struggleMaxSpeed: {"Remove": 0.1},
		maxstamina: 0.6, enemyTags: {"tapeRestraints":8}, playerTags: {"ItemHandsFull": -4}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},

	// Slime, added by slime effects. Easy to struggle out, not debilitating, but slows you greatly
	{removePrison: true, name: "StickySlime", Asset: "Web", Type: "Wrapped", Color: "#ff77ff", Group: "ItemArms", bindarms: true, bindhands: true, power: 0.1, weight: 1, freeze: true, escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, enemyTags: {"slime":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Slime"]},

	// High security prison restraints
	{inventory: true, name: "HighsecArmbinder", strictness: 0.1, Asset: "LeatherArmbinder", LinkableBy: ["Wrapping"], Type: "Strap", Group: "ItemArms", bindarms: true, bindhands: true, Color: "#333333", DefaultLock: "Red", power: 12, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Armbinders"]},
	{inventory: true, name: "HighsecShackles", Asset: "SteelAnkleCuffs", Type: "Chained", LinkableBy: ["Wrapping"], Group: "ItemFeet", hobble: true, Color: ["Default", "Default"], DefaultLock: "Red", power: 8, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": -0.5, "Remove": 1.1, "Pick": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "HighsecBallGag", Asset: "HarnessBallGag", gag: true, Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth", DefaultLock: "Red", power: 8, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": 0.0, "Remove": 0.5, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Latex", "Gags"]},
	{inventory: true, name: "HighsecLegbinder", Asset: "LegBinder", LinkableBy: ["Hobbleskirts"], Color: "Default", Group: "ItemLegs", blockfeet: true, DefaultLock: "Red", power: 8, weight: 2, escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Legbinders"]},
	{inventory: true, name: "PrisonVibe", Asset: "VibratingDildo", Color: "Default", Group: "ItemVulva", plugSize: 1.0, vibeType: "ChargingTeaserRemote", intensity: 2, orgasm: false, teaseRate: 5, power: 5, battery: 0, maxbattery: 12, weight: 2, escapeChance: {"Struggle": 10}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Vibes"]},
	{inventory: true, name: "PrisonBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "#444444", Group: "ItemPelvis", DefaultLock: "Red", chastity: true, power: 8, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": -0.30, "Remove": 100.0, "Pick": 0.25}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "PrisonBelt2", Asset: "OrnateChastityBelt", OverridePriority: 26, Color: ["#272727", "#AA0000"], Group: "ItemPelvis", DefaultLock: "Red", chastity: true, power: 9, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": -0.30, "Remove": 100.0, "Pick": 0.22}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Chastity"]},

	// Trap items. Note that traps do not respect stamina, so its okay for these to have reasonable maxstamina
	{inventory: true, name: "TrapArmbinderHarness", Asset: "LeatherHarness", LinkableBy: ["HeavyCorsets"], Group: "ItemTorso", power: 3, strictness: 0.1, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.25, "Remove": 0.25, "Pick": 0.15}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "ArmbinderHarness"],
		maxstamina: 0.6, events: [{trigger: "remove", type: "armbinderHarness"}]},

	{inventory: true, name: "TrapArmbinder", strictness: 0.1, Asset: "LeatherArmbinder", LinkableBy: ["Wrapping"], Type: "WrapStrap", Group: "ItemArms", bindarms: true, bindhands: true, power: 6, weight: 2,
		maxstamina: 0.25, escapeChance: {"Struggle": 0.1, "Cut": 0.5, "Remove": 0.35, "Pick": 0.15}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Armbinders"]},
	{inventory: true, name: "TrapCuffs", Asset: "MetalCuffs", LinkableBy: ["Wrapping", "Armbinders"], Group: "ItemArms", bindarms: true, power: 4, weight: 2, DefaultLock: "Red",
		escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 10, "Pick": 2.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "TrapHarness", strictness: 0.05, Asset: "LeatherStrapHarness", LinkableBy: ["HeavyCorsets"], OverridePriority: 26, Color: "#222222", Group: "ItemTorso", power: 2, weight: 2, harness: true,
		escapeChance: {"Struggle": 0.0, "Cut": 0.3, "Remove": 0.8, "Pick": 1.0}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Harnesses"]},
	{inventory: true, name: "TrapGag", Asset: "BallGag", gag: true, Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth", power: 3, weight: 2,
		maxstamina: 0.6, escapeChance: {"Struggle": 0.35, "Cut": 0.45, "Remove": 0.3, "Pick": 0.5}, enemyTags: {"trap":100, "leatherRestraintsHeavy":6}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Latex", "Gags"]},
	{inventory: true, name: "TrapBlindfold", Asset: "LeatherBlindfold", LinkableBy: ["Wrapping", "Mask"], Color: "Default", Group: "ItemHead", power: 3, weight: 2,
		maxstamina: 0.5, blindfold: 2, escapeChance: {"Struggle": 0.4, "Cut": 0.6, "Remove": 0.3, "Pick": 0.5}, enemyTags: {"trap":100, "leatherRestraintsHeavy":6, "ropeAuxiliary": 4}, playerTags: {}, minLevel: 0, floors: KDMapInit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Blindfolds"]},
	{inventory: true, name: "TrapBoots", Asset: "BalletHeels", Color: "Default", Group: "ItemBoots", hobble: true, power: 3, weight: 2,
		maxstamina: 0.9, escapeChance: {"Struggle": 0.15, "Cut": 0.45, "Remove": 0.4, "Pick": 0.9}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Boots"]},
	{inventory: true, name: "TrapLegirons", Asset: "Irish8Cuffs", LinkableBy: ["Wrapping"], Color: "Default", Group: "ItemFeet", blockfeet: true, power: 4, weight: 2,
		escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 10, "Pick": 2.5}, enemyTags: {"trap":100}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "TrapBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "Default", Group: "ItemPelvis", chastity: true, power: 4, weight: 0,
		maxstamina: 0.75, escapeChance: {"Struggle": 0.0, "Cut": -0.10, "Remove": 10.0, "Pick": 0.5}, enemyTags: {"trap":100, "maidRestraints": 51, "maidRestraintsLight": 51}, playerTags: {"ItemVulvaEmpty" : -50, "ItemVulvaPiercingsEmpty" : -50}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "TrapBra", Asset: "PolishedChastityBra", OverridePriority: 26, Color: "Default", Group: "ItemBreast", chastitybra: true, power: 4, weight: 0,
		maxstamina: 0.75, escapeChance: {"Struggle": 0.0, "Cut": -0.10, "Remove": 10.0, "Pick": 0.5}, enemyTags: {"trap":100, "maidRestraints": 51, "maidRestraintsLight": 51}, playerTags: {"ItemNipplesEmpty" : -100}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "TrapVibe", Asset: "TapedClitEgg", Color: "Default", Group: "ItemVulvaPiercings", vibeType: "Charging", intensity: 1, orgasm: false, power: 1, battery: 0, maxbattery: 8, weight: 2,
		escapeChance: {"Struggle": 10}, enemyTags: {"trap":100, "maidRestraintsLight": 5, "genericToys": 2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Vibes"]},
	{inventory: true, name: "TrapPlug", Asset: "VibratingDildo", Color: "Default", Group: "ItemVulva", plugSize: 1.0, vibeType: "TeaserRemote", intensity: 3, orgasm: true, teaseRate: 3, power: 3, battery: 0, maxbattery: 11, weight: 2,
		escapeChance: {"Struggle": 10}, enemyTags: {"trap":10, "maidRestraintsLight": 2}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Vibes"]},
	{inventory: true, name: "TrapPlug2", Asset: "VibratingDildo", Color: "Default", Group: "ItemVulva", plugSize: 1.0, vibeType: "TeaserRemoteDeny", intensity: 1, orgasm: false, teaseRate: 6, teaseCooldown: 130, denyChance: 0.4, denyTime: 30, power: 4, battery: 0, maxbattery: 30, weight: 2,
		escapeChance: {"Struggle": 10}, enemyTags: {"trap":0}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Vibes"]},
	{inventory: true, name: "TrapPlug3", Asset: "VibratingDildo", Color: "Default", Group: "ItemVulva", plugSize: 1.0, vibeType: "TeaserRemoteDeny", intensity: 6, orgasm: true, teaseRate: 4, teaseCooldown: 30, denyChance: 0.1, denyChanceLikely: 0.9, denyTime: 10, power: 5, battery: 0, maxbattery: 30, weight: 2,
		escapeChance: {"Struggle": 10}, enemyTags: {"trap":0}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Vibes"]},
	{inventory: true, name: "TrapMittens", Asset: "LeatherMittens", Color: "Default", Group: "ItemHands", bindhands: true, power: 5, weight: 0,
		maxstamina: 0.5, escapeChance: {"Struggle": 0.05, "Cut": 0.4, "Remove": 0.15, "Pick": 1.0}, enemyTags: {"leatherRestraintsHeavy":6}, playerTags: {"ItemHandsFull":-2}, minLevel: 0, floors: KDMapInit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Mittens"]},

	// These ones are tougher
	{inventory: true, name: "TrapBelt2", Asset: "OrnateChastityBelt", OverridePriority: 26, Color: ["#272727", "#D3B24B"], Group: "ItemPelvis", chastity: true, power: 6, weight: 0,
		escapeChance: {"Struggle": 0.0, "Cut": -0.125, "Remove": 10.0, "Pick": 0.1}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "TrapBra2", Asset: "FuturisticBra2", OverridePriority: 26, Color: ['#5E5E6B', '#F8BD01', '#5E5E6B', '#5E5E6B', '#F8BD01', '#5E5E6B'], Group: "ItemBreast", chastitybra: true, power: 6, weight: 0,
		escapeChance: {"Struggle": 0.0, "Cut": -0.125, "Remove": 10.0, "Pick": 0.1}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Chastity"]},
	// Maid chastity.
	{inventory: true, name: "MaidCBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "Default", Group: "ItemPelvis", chastity: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.5, "Pick": 0.12},
		maxstamina: 0.75, enemyTags: {"maidVibeRestraints": 200, "maidVibeRestraintsLimited": 100}, playerTags: {"ItemVulvaEmpty" : -50, "ItemVulvaPiercingsEmpty" : -50}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Chastity"]},
	{inventory: true, name: "MaidVibe", Asset: "TapedClitEgg", Color: "Default", Group: "ItemVulvaPiercings", vibeType: "ChargingRemote", intensity: 3, orgasm: true, power: 4, battery: 0, maxbattery: 9, weight: 2, escapeChance: {"Struggle": 10},
		enemyTags: {"maidVibeRestraints": 1000, "maidVibeRestraintsLimited": 100}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Vibes"]},

	// Generic ball gag thats stronger than the trap one
	{inventory: true, name: "MagicGag", Asset: "BallGag", gag: true, Type: "Tight", Color: ["Default", "Default"], Group: "ItemMouth", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": 0.45, "Remove": 0.65, "Pick": 0.5},
		maxstamina: 0.9, enemyTags: {"ballGagRestraints" : 4}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Latex", "Gags"]},
	{inventory: true, name: "MagicGag2", Asset: "BallGag", gag: true, Type: "Tight", Color: ["Default", "##ff00ff"], Group: "ItemMouth", DefaultLock: "Blue", magic: true, power: 8, weight: 2,
		escapeChance: {"Struggle": 0.0, "Cut": 0.25, "Remove": 0.65, "Pick": 0.5},
		enemyTags: {"ballGagRestraintsMagic" : 4}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Latex", "Gags"]},

	// Generic stronger gag
	{inventory: true, name: "PanelGag", Asset: "HarnessPanelGag", gag: true, Color: "#888888", Group: "ItemMouth2", power: 5, weight: 2, escapeChance: {"Struggle": 0, "Cut": 0.3, "Remove": 0.4, "Pick": 0.5},
		maxstamina: 0.75, enemyTags: {"leatherRestraintsHeavy":8, "ropeAuxiliary": 4}, playerTags: {}, minLevel: 10, floors: KDMapInit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},

	// Simple cloth stuff
	{inventory: true, name: "ClothGag", Asset: "ClothGag", gag: true, Type: "OTN", Color: "#888888", Group: "ItemMouth3", power: 0.1, weight: 2, escapeChance: {"Struggle": 0.5, "Cut": 1.0, "Remove": 0.8},
		maxstamina: 0.75, enemyTags: {"clothRestraints":8, "ropeAuxiliary": 1}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},
	{inventory: true, name: "ClothBlindfold", Asset: "ClothBlindfold", Color: "#888888", Group: "ItemHead", power: 0.1, weight: 2, escapeChance: {"Struggle": 0.5, "Cut": 1.0, "Remove": 0.8},
		maxstamina: 0.85, blindfold: 1, enemyTags: {"clothRestraints":8, "ropeAuxiliary": 1}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Blindfolds"]},

	// Baast warriors only apply two things so its okay that these have a high maxstamina
	{name: "KittyGag", Asset: "KittyHarnessPanelGag", gag: true, Color: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], Group: "ItemMouth2", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0, "Cut": 0.3, "Remove": 0.25, "Pick": 0.2},
		enemyTags: {"kittyRestraints":8}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},
	{name: "KittyMuzzle", Asset: "KittyGag", gag: true, Color: ["#FFFFFF", "#000000", "#E496E7"], Group: "ItemMouth3", DefaultLock: "Red", power: 5, weight: -6, escapeChance: {"Struggle": 0, "Cut": 0.18, "Remove": 0.4, "Pick": 0.2},
		maxstamina: 0.9, enemyTags: {"kittyRestraints":6}, playerTags: {"ItemMouth2Full": 4, "ItemMouthFull": 4}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},
	{name: "KittyBlindfold", Asset: "KittyBlindfold", blindfold: 2, Color: ["#FFFFFF","#000000","#E48FE9"], Group: "ItemHead", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0.1, "Cut": 0.3, "Remove": 0.25, "Pick": 0.2},
		enemyTags: {"kittyRestraints":8}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},
	{name: "KittyPaws", Asset: "PawMittens", Color: ["#FFFFFF","#FFFFFF","#FFFFFF","#B38295"], Group: "ItemHands", bindhands: true, power: 5, weight: 2, escapeChance: {"Struggle": 0.1, "Cut": 0.3, "Remove": 0.3, "Pick": 0.2},
		maxstamina: 0.9, enemyTags: {"kittyRestraints":8}, playerTags: {}, minLevel: 6, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Mittens"]},

	// These restraints are easy, so they dont have maxstamina
	{inventory: true, name: "WristShackles", Asset: "WristShackles", LinkableBy: ["Wrapping", "Armbinders"], Group: "ItemArms", bindarms: true, Type: "Behind", power: 3, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.1, "Cut": -0.25, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2, "handcuffer": 6}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "AnkleShackles", Asset: "AnkleShackles", LinkableBy: ["Wrapping"], Group: "ItemFeet", hobble: true, power: 2, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.1, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "LegShackles", Asset: "LeatherLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Group: "ItemLegs", hobble: true, Type: "Chained", Color: ["Default", "#888888", "#AAAAAA"], power: 3, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.2, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "FeetShackles", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], Link: "FeetShackles2", Group: "ItemFeet", hobble: true, Type: "Chained", Color: ["Default", "Default"], power: 5, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.15, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "FeetShackles2", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "FeetShackles", Group: "ItemFeet", blockfeet: true, Type: "Closed", Color: ["Default", "Default"], power: 5, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.15, "Cut": -0.3, "Remove": 10, "Pick": 5}, enemyTags: {"shackleRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{inventory: true, name: "SteelMuzzleGag", gag: true, Asset: "MuzzleGag", Group: "ItemMouth3", Color: "#999999", power: 3, weight: 2, DefaultLock: "Red", escapeChance: {"Struggle": 0.2, "Cut": -0.25, "Remove": 10, "Pick": 5}, enemyTags: {"shackleGag":1}, playerTags: {"ItemMouthFull":1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Gags"]},

	{curse: "5Keys", name: "GhostCollar", Asset: "OrnateCollar", Group: "ItemNeck", magic: true, Color: ["#555555", "#AAAAAA"], power: 20, weight: 0, difficultyBonus: 30,
		escapeChance: {"Struggle": -100, "Cut": -0.8, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},

	{name: "SturdyLeatherBeltsArms", Asset: "SturdyLeatherBelts", LinkableBy: ["Wrapping"], Type: "Three", Color: "Default", Group: "ItemArms", bindarms: true, power: 2, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.22},
		maxstamina: 0.9, enemyTags: {"leatherRestraints":6}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Belts"]},
	{name: "SturdyLeatherBeltsFeet", Asset: "SturdyLeatherBelts", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Three", Color: "Default", Group: "ItemFeet", blockfeet: true, power: 2, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.5},
		maxstamina: 1.0, enemyTags: {"leatherRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Belts"]},
	{name: "SturdyLeatherBeltsLegs", Asset: "SturdyLeatherBelts", LinkableBy: ["Wrapping"], Type: "Two", Color: "Default", Group: "ItemLegs", hobble: true, power: 2, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": 0.5, "Remove": 0.5},
		maxstamina: 0.8, enemyTags: {"leatherRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Belts"]},

	{nonbinding: true, inventory: true, name: "LeatherArmCuffs", Asset: "LeatherCuffs", LinkableBy: ["Armbinders", "Straitjackets", "Boxbinders", "Wrapping"], Link: "LeatherArmCuffs2", Color: ['Default', 'Default'], Group: "ItemArms", bindarms: false, power: 4, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": 0.1, "Remove": 0.25, "Pick": 0.35}, enemyTags: {"leatherRestraintsHeavy":4, "dragonRestraints":6, "handcuffer": 2}, playerTags: {"ItemArmsFull":-2}, minLevel: 5, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Cuffs"],
		maxstamina: 1.0, events: [{trigger: "hit", type: "linkItem", chance: 0.33}, {trigger: "defeat", type: "linkItem", chance: 1.0}]},
	{name: "LeatherArmCuffs2", Asset: "LeatherCuffs", Type: "Wrist", LinkableBy: ["Armbinders", "Boxbinders", "Wrapping"], Link: "LeatherArmCuffs3", UnLink: "MithrilArmCuffs", Color: ['Default', 'Default'], Group: "ItemArms", bindarms: true, power: 4, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0.2, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.33}]},
	{name: "LeatherArmCuffs3", Asset: "LeatherCuffs", Type: "Both", LinkableBy: ["Armbinders", "Wrapping"], UnLink: "LeatherArmCuffs4", Color: ['Default', 'Default'], Group: "ItemArms", bindarms: true, power: 5, weight: 0, strictness: 0.1, escapeChance: {"Struggle": -0.15, "Cut": 0.1, "Remove": -0.1, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "LeatherArmCuffs4", Asset: "LeatherCuffs", Type: "Elbow", LinkableBy: ["Armbinders", "Wrapping"], Link: "LeatherArmCuffs3", UnLink: "LeatherArmCuffs", Color: ['Default', 'Default'], Group: "ItemArms", bindarms: true, power: 4, weight: 0, escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": -0.15, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.5}]},

	{nonbinding: true, inventory: true, name: "ScaleArmCuffs", Asset: "LeatherCuffs", LinkableBy: ["Armbinders", "Straitjackets", "Boxbinders", "Wrapping"], Link: "LeatherArmCuffs2", Color: ["#9B1818", "#675F50"], Group: "ItemArms", bindarms: false, power: 8, weight: 0, escapeChance: {"Struggle": 0, "Cut": -0.05, "Remove": 0.25, "Pick": 0.35}, enemyTags: {"dragonRestraints":1}, playerTags: {"ItemArmsFull":2}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Cuffs"],
		maxstamina: 0.7, events: [{trigger: "hit", type: "linkItem", chance: 0.33}, {trigger: "defeat", type: "linkItem", chance: 1.0}]},
	{name: "ScaleArmCuffs2", Asset: "LeatherCuffs", Type: "Wrist", LinkableBy: ["Armbinders", "Boxbinders", "Wrapping"], Link: "ScaleArmCuffs3", UnLink: "MithrilArmCuffs", Color: ["#9B1818", "#675F50"], Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.05, "Remove": 0.2, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.33}]},
	{name: "ScaleArmCuffs3", Asset: "LeatherCuffs", Type: "Both", LinkableBy: ["Armbinders", "Wrapping"], UnLink: "ScaleArmCuffs4", Color: ["#9B1818", "#675F50"], Group: "ItemArms", bindarms: true, power: 9, weight: 0, strictness: 0.1, escapeChance: {"Struggle": -0.15, "Cut": -0.05, "Remove": -0.1, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "ScaleArmCuffs4", Asset: "LeatherCuffs", Type: "Elbow", LinkableBy: ["Armbinders", "Wrapping"], Link: "ScaleArmCuffs3", UnLink: "ScaleArmCuffs", Color: ["#9B1818", "#675F50"], Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": -0.15, "Cut": -0.05, "Remove": -0.15, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.5}]},


	{inventory: true, name: "MaidJacket", Asset: "Bolero", Color: ["#191919", "#A3A3A3"], Group: "ItemArms", bindarms: true, bindhands: true, power: 9, weight: 0, strictness: 0.2, escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0.1, "Pick": 0.15},
		maxstamina: 0.3, enemyTags: {"maidRestraints":5}, playerTags: {"ItemArmsFull":-2}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Latex", "Straitjackets"]},
	{inventory: true, name: "MaidBelt", Asset: "LeatherBelt", Color: "#DBDBDB", Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.05, "Remove": 0.1, "Pick": 0.25},
		maxstamina: 1.0, enemyTags: {"maidRestraints":10, "maidRestraintsLight":1}, playerTags: {"ItemLegsFull":-2}, minLevel: 5, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Belts"]},
	{inventory: true, name: "MaidAnkleCuffs", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], Link: "MaidAnkleCuffs2", Type: "Chained", Color: "Default", Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {"maidRestraints":7}, playerTags: {"ItemFeetFull":-2}, minLevel: 10, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		maxstamina: 0.8, events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "MaidAnkleCuffs2", Asset: "SteelAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "MaidAnkleCuffs", Type: "Closed", Color: "Default", Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.1, "Pick": 0.15},
		enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "MaidCollar", Asset: "HighCollar", Color: ["#C9C9C9", "#FFFFFF"], Group: "ItemNeck", power: 11, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.4, "Pick": 0.0},
		maxstamina: 0.1, enemyTags: {"maidRestraints":3, "maidCollar":1}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Collars"]},
	{inventory: true, name: "MaidGag", gag: true, Asset: "DildoPlugGag", Color: "Default", Type:"Plug", Group: "ItemMouth", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.05, "Remove": 0.33, "Pick": 0.15},
		maxstamina: 0.75, enemyTags: {"maidRestraints":7}, playerTags: {}, minLevel: 10, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},

	{inventory: true, name: "DragonStraps", Asset: "ThinLeatherStraps", LinkableBy: ["Boxbinders"], Color: "#9B1818", Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.1, "Pick": 0.25},
		maxstamina: 0.7, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemArmsFull":-2}, minLevel: 10, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Belts"]},
	{inventory: true, name: "DragonLegCuffs", Asset: "LeatherLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Chained", Color: ["Default", "#9B1818", "#675F50"], Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.3, "Pick": 0.25},
		maxstamina: 0.8, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 10, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Cuffs"]},
	{inventory: true, name: "DragonAnkleCuffs", Asset: "LeatherAnkleCuffs", LinkableBy: ["Wrapping"], Link: "DragonAnkleCuffs2", Type: "Chained", Color: ["Default", "#9B1818", "#675F50"], Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.3, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 5, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Cuffs"],
		maxstamina: 1.0, events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "DragonAnkleCuffs2", Asset: "LeatherAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "DragonAnkleCuffs", Type: "Closed", Color: ["Default", "#9B1818", "#675F50"], Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.3, "Pick": 0.25}, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{inventory: true, name: "DragonBoots", Asset: "BalletWedges", Color: "#424242", Group: "ItemBoots", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.05, "Pick": 0.25},
		enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 5, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Boots"]},
	{inventory: true, name: "DragonBallGag", gag: true, Asset: "FuturisticHarnessBallGag", Color: ['#680000', '#680000', '#680000', '#680000', '#680000'], Group: "ItemMouth", power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.05, "Remove": 0.05, "Pick": 0.25},
		maxstamina: 0.6, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Latex", "Gags"]},
	{inventory: true, name: "DragonMuzzleGag", gag: true, Asset: "StitchedMuzzleGag", Color: "#9B1818", Group: "ItemMouth3", power: 9, weight: -6, escapeChance: {"Struggle": 0.05, "Cut": 0.0, "Remove": 0.1},
		maxstamina: 0.75, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemMouthFull":4, "ItemMouth2Full":4}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Leather", "Gags"]},
	{name: "DragonCollar", Asset: "LatexCollar2", Color: "#9B1818", Group: "ItemNeck", power: 9, weight: 4, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.1},
		maxstamina: 0.1, enemyTags: {"dragonRestraints":6}, playerTags: {"ItemNeckFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Collars"]},

	{inventory: true, name: "ObsidianLegCuffs", Asset: "OrnateLegCuffs", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Chained", Color: ["#675F50", "#171222", "#9B63C5"], Group: "ItemLegs", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25},
		maxstamina: 0.8, enemyTags: {"obsidianRestraints":6}, playerTags: {"ItemLegsFull":-2}, minLevel: 15, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"]},
	{inventory: true, name: "ObsidianAnkleCuffs", Asset: "OrnateAnkleCuffs", LinkableBy: ["Wrapping"], Link: "ObsidianAnkleCuffs2", Type: "Chained", Color: ["#675F50", "#171222", "#9B63C5"], Group: "ItemFeet", hobble: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		maxstamina: 1.0, events: [{trigger: "hit", type: "linkItem", chance: 0.2, noSub: 0.1, noLeash: true}]},
	{name: "ObsidianAnkleCuffs2", Asset: "OrnateAnkleCuffs", LinkableBy: ["Wrapping"], UnLink: "ObsidianAnkleCuffs", Type: "Closed", Color: ["#675F50", "#171222", "#9B63C5"], Group: "ItemFeet", blockfeet: true, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, enemyTags: {"obsidianRestraints":6}, playerTags: {"ItemFeetFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{nonbinding: true, inventory: true, name: "ObsidianArmCuffs", Asset: "OrnateCuffs", LinkableBy: ["Armbinders", "Straitjackets", "Boxbinders", "Wrapping"], Link: "ObsidianArmCuffs2", Color: ["#171222", "#9B63C5"], Group: "ItemArms", bindarms: false, power: 9, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.2, "Remove": 0.25, "Pick": 0.35}, enemyTags: {"obsidianRestraints":24}, playerTags: {"ItemArmsFull":-2}, minLevel: 10, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Cuffs"],
		maxstamina: 0.8, events: [{trigger: "hit", type: "linkItem", chance: 0.33}, {trigger: "defeat", type: "linkItem", chance: 1.0}]},
	{name: "ObsidianArmCuffs2", Asset: "OrnateCuffs", Type: "Wrist", LinkableBy: ["Armbinders", "Boxbinders", "Wrapping"], Link: "ObsidianArmCuffs3", UnLink: "ObsidianArmCuffs", Color: ["#171222", "#9B63C5"], Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.33}]},
	{name: "ObsidianArmCuffs3", Asset: "OrnateCuffs", Type: "Both", LinkableBy: ["Armbinders", "Wrapping"], UnLink: "ObsidianArmCuffs4", Color: ["#171222", "#9B63C5"], Group: "ItemArms", bindarms: true, power: 9, weight: 0, strictness: 0.1, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": -0.1, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}]},
	{name: "ObsidianArmCuffs4", Asset: "OrnateCuffs", Type: "Elbow", LinkableBy: ["Armbinders", "Wrapping"], Link: "ObsidianArmCuffs3", UnLink: "ObsidianArmCuffs", Color: ["#171222", "#9B63C5"], Group: "ItemArms", bindarms: true, power: 9, weight: 0, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": -0.15, "Pick": 0.25}, helpChance: {"Remove": 0.4}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([]), shrine: ["Metal", "Cuffs"],
		events: [{trigger: "remove", type: "unlinkItem"}, {trigger: "hit", type: "linkItem", chance: 0.5}]},
	{inventory: true, name: "ObsidianGag", gag: true, Asset: "MuzzleGag", Color: ["#1C1847", "#1C1847"], Group: "ItemMouth3", power: 9, weight: -7, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25},
		maxstamina: 0.7, enemyTags: {"obsidianRestraints":8}, playerTags: {"ItemMouth3Full":-2, "ItemMouth2Full":2, "ItemMouth1Full":2}, minLevel: 6, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Gags"]},
	{inventory: true, name: "ObsidianCollar", Asset: "OrnateCollar", Color: ["#171222", "#9B63C5"], Group: "ItemNeck", power: 9, weight: -2, escapeChance: {"Struggle": -0.1, "Cut": -0.2, "Remove": 0.2, "Pick": 0.25},
		maxstamina: 0.1, enemyTags: {"obsidianRestraints":4}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Collars"]},

	{removePrison: true, name: "IceArms", sfx: "Freeze", Asset: "Ribbons", Type: "Heavy", Color: "#5DA9E5", Group: "ItemArms", bindarms: true, power: 4, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		maxstamina: 0.8, events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},
	{removePrison: true, name: "IceLegs", sfx: "Freeze", Asset: "Ribbons", Type: "MessyWrap", Color: "#5DA9E5", Group: "ItemLegs", hobble: true, power: 4, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},
	{removePrison: true, name: "IceHarness", sfx: "Freeze", Asset: "Ribbons", Type: "Harness2", Color: "#5DA9E5", Group: "ItemTorso", power: 1, harness: true, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemTorsoFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},
	{removePrison: true, name: "IceGag", gag: true, sfx: "Freeze", Asset: "Ribbons", Color: "#5DA9E5", Group: "ItemMouth", power: 4, harness: true, weight: 0, magic: true, escapeChance: {"Struggle": 0.15, "Cut": 0.05, "Remove": 0}, enemyTags: {"iceRestraints":4}, playerTags: {"ItemMouthFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		maxstamina: 0.7, events: [{trigger: "tick", type: "iceDrain", power: -0.025}]},

	{removePrison: true, name: "CableArms", sfx: "FutureLock", Asset: "Ribbons", Color: "#7D7D7D", Group: "ItemArms", bindarms: true, power: 6, weight: 0, magic: false, escapeChance: {"Struggle": 0.1, "Cut": 0.00, "Remove": 0.25, "Pick": 0.35},
		maxstamina: 0.8, enemyTags: {"hitechCables":4}, playerTags: {"ItemArmsFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal"]},
	{removePrison: true, name: "CableLegs", sfx: "FutureLock", Asset: "Ribbons", Type: "Cross", Color: "#7D7D7D", Group: "ItemLegs", hobble: true, power: 6, weight: 0, magic: false, escapeChance: {"Struggle": 0.1, "Cut": 0.0, "Remove": 0.25, "Pick": 0.35}, enemyTags: {"hitechCables":4}, playerTags: {"ItemLegsFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal"]},
	{removePrison: true, name: "CableHarness", sfx: "FutureLock", Asset: "Ribbons", Type: "Harness1", Color: "#7D7D7D", Group: "ItemTorso", power: 2, harness: true, weight: 0, magic: false, escapeChance: {"Struggle": 0.1, "Cut": 0.0, "Remove": 0.25, "Pick": 0.35}, enemyTags: {"hitechCables":4}, playerTags: {"ItemTorsoFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal"]},

	{name: "CableGag", Asset: "DeepthroatGag", gag: true, sfx: "FutureLock", Color: "Default", Group: "ItemMouth", DefaultLock: "Red", power: 5, weight: 2, escapeChance: {"Struggle": 0.0, "Cut": 0.0, "Remove": 0.5, "Pick": 0.35},
		maxstamina: 0.6, enemyTags: {"cableGag":3}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Metal", "Gags"]},

	{inventory: true, name: "RopeSnakeArms", Asset: "HempRope", Color: "Default", LinkableBy: ["Boxbinders", "Wrapping"], Group: "ItemArms", bindarms: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.25, "Cut": 0.45, "Remove": 0.1},
		maxstamina: 0.7, enemyTags: {"ropeRestraints":4}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{inventory: true, name: "RopeSnakeCuffs", Asset: "HempRope", Type: "RopeCuffs", Color: "Default", LinkableBy: ["Boxbinders", "Armbinders", "Wrapping"], Group: "ItemArms", bindarms: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.4, "Cut": 0.67, "Remove": 0.3},
		maxstamina: 1.0, enemyTags: {"ropeRestraints":8}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{inventory: true, name: "RopeSnakeArmsWrist", Asset: "HempRope", Type: "WristElbowHarnessTie", LinkableBy: ["Armbinders", "Wrapping"], Color: "Default", Group: "ItemArms", bindarms: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.45, "Remove": 0.2},
		maxstamina: 0.7, enemyTags: {"ropeRestraintsWrist":4}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{inventory: true, name: "RopeSnakeHogtie", Asset: "HempRope", Type: "Hogtied", Color: "Default", Group: "ItemArms", bindarms: true, power: 6, weight: 0, escapeChance: {"Struggle": 0.05, "Cut": 0.15, "Remove": 0.0},
		maxstamina: 0.15, enemyTags: {"ropeRestraintsHogtie":12}, playerTags: {}, minLevel: 5, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"],
		events: [{trigger: "afterRemove", type: "replaceItem", list: ["RopeSnakeArmsWrist"], power: 6}]
	},
	{inventory: true, name: "RopeSnakeFeet", Asset: "HempRope", Color: "Default", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.5, "Remove": 0.15},
		maxstamina: 1.0, enemyTags: {"ropeRestraints":4}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{inventory: true, name: "RopeSnakeLegs", Asset: "HempRope", Type: "FullBinding", LinkableBy: ["Legbinders", "Hobbleskirts"], Color: "Default", Group: "ItemLegs", hobble: true, power: 1, weight: 0, escapeChance: {"Struggle": 0.25, "Cut": 0.45, "Remove": 0.15},
		maxstamina: 0.6, enemyTags: {"ropeRestraints":4}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{inventory: true, name: "RopeSnakeTorso", Asset: "HempRopeHarness", Type: "Waist", Color: "Default", Group: "ItemTorso", power: 1, weight: 0, harness: true, escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.3},
		maxstamina: 0.9, enemyTags: {"ropeRestraints2":4}, playerTags: {"ItemTorsoFull":-3}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{inventory: true, name: "RopeSnakeCrotch", crotchrope: true, Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, Color: "Default", Group: "ItemPelvis", power: 1, weight: 0, harness: true,
		maxstamina: 0.75, escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.15}, enemyTags: {"ropeRestraints2":4}, playerTags: {"ItemPelvisFull":-3}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},

	{removePrison: true, name: "VinePlantArms", Asset: "HempRope", Color: "#00FF44", Group: "ItemArms", bindarms: true, power: 0.1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{removePrison: true, name: "VinePlantFeet", Asset: "HempRope", Color: "#00FF44", Group: "ItemFeet", blockfeet: true, power: 0.1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{removePrison: true, name: "VinePlantLegs", Asset: "HempRope", Color: "#00FF44", Group: "ItemLegs", hobble: true, power: 0.1, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},
	{removePrison: true, name: "VinePlantTorso", Asset: "HempRopeHarness", Type: "Diamond", OverridePriority: 26, Color: "#00FF44", Group: "ItemTorso", power: 0.1, weight: 0, harness: true, escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.2}, enemyTags: {"vineRestraints":4}, playerTags: {"ItemTorsoFull":-3}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Rope"]},

	{name: "ChainArms", sfx: "Chain", Asset: "Chains", Type: "WristElbowHarnessTie", LinkableBy: ["Armbinders", "Wrapping"], Color: "Default", Group: "ItemArms", bindarms: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.1, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5},
		maxstamina: 0.8, enemyTags: {"chainRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{name: "ChainLegs", sfx: "Chain", Asset: "Chains", Type: "Strict", Color: "Default", LinkableBy: ["Legbinders", "Hobbleskirts"], Group: "ItemLegs", hobble: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.15, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{name: "ChainFeet", sfx: "Chain", Asset: "Chains", Color: "Default", LinkableBy: ["Wrapping"], Group: "ItemFeet", blockfeet: true, power: 5, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{name: "ChainCrotch", sfx: "Chain", Asset: "CrotchChain", crotchrope: true, OverridePriority: 26, Color: "Default", Group: "ItemTorso", power: 3, weight: 0, harness: true, escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.3, "Pick": 1.5}, enemyTags: {"chainRestraints":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},

	{removePrison: true, sfx: "Chain", name: "MagicChainArms", Asset: "Chains", LinkableBy: ["Armbinders", "Wrapping"], Type: "WristElbowHarnessTie", Color: "#aa00aa", Group: "ItemArms", bindarms: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1},
		maxstamina: 0.9, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{removePrison: true, sfx: "Chain", name: "MagicChainLegs", Asset: "Chains", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Strict", Color: "#aa00aa", Group: "ItemLegs", hobble: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{removePrison: true, sfx: "Chain", name: "MagicChainFeet", Asset: "Chains", LinkableBy: ["Wrapping"], Color: "#aa00aa", Group: "ItemFeet", blockfeet: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{removePrison: true, sfx: "Chain", name: "MagicChainCrotch", crotchrope: true, Asset: "CrotchChain", OverridePriority: 26, Color: "#aa00aa", Group: "ItemTorso", power: 4, weight: 0, harness: true, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"chainRestraintsMagic":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},

	{removePrison: true, sfx: "Chain", name: "ShadowChainArms", Asset: "Chains", LinkableBy: ["Boxbinders", "Wrapping"], Type: "BoxTie", Color: "#000000", Group: "ItemArms", bindarms: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1},
		maxstamina: 0.9, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{removePrison: true, sfx: "Chain", name: "ShadowChainLegs", Asset: "Chains", LinkableBy: ["Legbinders", "Hobbleskirts"], Type: "Strict", Color: "#000000", Group: "ItemLegs", hobble: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.3, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemLegsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{removePrison: true, sfx: "Chain", name: "ShadowChainFeet", Asset: "Chains", LinkableBy: ["Wrapping"], Color: "#000000", Group: "ItemFeet", blockfeet: true, power: 4, weight: 0, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},
	{removePrison: true, sfx: "Chain", name: "ShadowChainCrotch", crotchrope: true, Asset: "CrotchChain", OverridePriority: 26, Color: "#000000", Group: "ItemTorso", power: 4, weight: 0, harness: true, escapeChance: {"Struggle": 0.2, "Cut": -0.1, "Remove": -0.1}, enemyTags: {"shadowRestraints":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Chains", "Metal"]},

	{removePrison: true, divine: true, name: "DivineCuffs", Asset: "FuturisticCuffs", LinkableBy: ["Boxbinders", "Armbinders", "Wrapping"], DefaultLock: "Gold", Type: "Wrist", Color: ['#6AB0ED', '#AE915C', '#FFFFFF'], Group: "ItemArms", bindarms: true, power: 50, weight: 0,
		specStruggleTypes: ["Struggle"], escapeChance: {"Struggle": -99, "Cut": -99, "Remove": -99}, enemyTags: {"divineRestraints":2}, playerTags: {"ItemArmsFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},
	{removePrison: true, divine: true, name: "DivineAnkleCuffs", Asset: "FuturisticAnkleCuffs", LinkableBy: ["Wrapping"], DefaultLock: "Gold", Color: ['#AE915C', '#71D2EE', '#AE915C', '#000000'], Group: "ItemFeet", Type: "Closed", blockfeet: true, power: 50, weight: 0,
		specStruggleTypes: ["Struggle"], escapeChance: {"Struggle": -99, "Cut": -99, "Remove": -99}, enemyTags: {"divineRestraints":2}, playerTags: {"ItemFeetFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},
	{removePrison: true, divine: true, name: "DivineMuzzle", gag: true, Asset: "FuturisticMuzzle", Modules: [0, 1, 1], Color: ['#AE915C', '#AE915C', '#CAA562', '#5FBEE8'], DefaultLock: "Gold", Group: "ItemMouth3", power: 30, weight: 0,
		specStruggleTypes: ["Struggle"], escapeChance: {"Struggle": -99, "Cut": -99, "Remove": -99}, enemyTags: {"divineRestraints":2}, playerTags: {"ItemPelvisFull":-1}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},

	{name: "BasicCollar", Asset: "LeatherCollar", Color: ["#000000", "Default"], Group: "ItemNeck", power: 1, weight: 0, escapeChance: {"Struggle": 0.0, "Cut": 0.15, "Remove": 0.5, "Pick": 0.75},
		maxstamina: 0.1, enemyTags: {"leashing":0.001, "maidCollar":-1, "dragonRestraints":-1, "expRestraints":-1, "wolfRestraints":-1, "mithrilRestraints": -1}, playerTags: {"ItemNeckFull":-2}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: ["Collars"]},
	{removePrison: true, name: "BasicLeash", tether: 2.9, Asset: "CollarLeash", Color: "Default", Group: "ItemNeckRestraints", leash: true, power: 1, weight: -99, harness: true, escapeChance: {"Struggle": 0.33, "Cut": 0.2, "Remove": 0.5, "Pick": 1.25}, enemyTags: {"leashing":1}, playerTags: {"ItemNeckRestraintsFull":-2, "ItemNeckFull":99}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: []},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedBelt", Asset: "PolishedChastityBelt", OverridePriority: 26, Color: "#AE915C", Group: "ItemPelvis", chastity: true, power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "beforeCast", type: "ReduceMiscastFlat", power: 0.3, requireEnergy: true},
			{trigger: "tick", type: "RegenStamina", power: 1.25, requireEnergy: true, energyCost: 0.002},
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedBra", Asset: "PolishedChastityBra", OverridePriority: 26, Color: "#AE915C", Group: "ItemBreast", chastitybra: true, power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "beforeDamage", type: "ModifyDamageFlat", power: -1, requireEnergy: true, energyCost: 0.01}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedHeels", Asset: "BalletWedges", Color: "#AE915C", Group: "ItemBoots", hobble: true, power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "tick", type: "ApplySlowLevelBuff", power: -2, requireEnergy: true, energyCost: 0.0005},
			{type: "ShadowHeel", trigger: "playerAttack", requireEnergy: true, energyCost: 0.00225},
			//{trigger: "beforePlayerAttack", type: "BoostDamage", power: 1, requireEnergy: true, energyCost: 0.001125}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedBlindfold", Asset: "PaddedBlindfold", Color: ["#AE915C", "#262626"], Group: "ItemHead", blindfold: 3, power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "calcEvasion", type: "BlindFighting", requireEnergy: true},
			{trigger: "tick", type: "AccuracyBuff", power: 1.0, requireEnergy: true},
			{trigger: "beforePlayerAttack", type: "BoostDamage", power: 1, requireEnergy: true, energyCost: 0.001125},
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedAnkleCuffs", Asset: "SteelAnkleCuffs", Type: "Chained", Color: ["#AE915C", "#B0B0B0"], Group: "ItemFeet", power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "tick", type: "EnchantedAnkleCuffs"},
			{trigger: "tick", type: "AllyHealingAura", aoe: 3.9, power: 1.5},
			{trigger: "tick", type: "EvasionBuff", power: 0.25, requireEnergy: true},
			{trigger: "miss", type: "EnergyCost", requireEnergy: true, energyCost: 0.0075}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, inventoryAs: "EnchantedAnkleCuffs", name: "EnchantedAnkleCuffs2", Asset: "SteelAnkleCuffs", Type: "Closed", blockfeet: true, Color: ["#AE915C", "#B0B0B0"], Group: "ItemFeet", power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "tick", type: "EnchantedAnkleCuffs2", requireEnergy: true}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedMuzzle", gag: true, Asset: "FuturisticMuzzle", Modules: [1, 1, 2], Color: ['#AE915C', '#AE915C', '#CAA562', '#000000'],
		Group: "ItemMouth3", power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "tick", type: "SneakBuff", power: 2, requireEnergy: true},
			{trigger: "tick", type: "RegenMana", power: 1.0, requireEnergy: true, energyCost: 0.0025},
			{trigger: "beforeDamageEnemy", type: "MultiplyDamageStealth", power: 3.0, requireEnergy: true, energyCost: 0.01}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedBallGag", gag: true, Asset: "FuturisticHarnessBallGag", Color: ['#AE915C', '#AE915C', '#424242', "#CAA562", '#000000'],
		Group: "ItemMouth", power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "beforeCast", type: "ReduceMiscastFlat", power: 0.3, requireEnergy: true},
			{trigger: "tick", type: "RegenMana", power: 1.0, requireEnergy: true, energyCost: 0.0025},
			{trigger: "beforeDamageEnemy", type: "MultiplyDamageStatus", power: 1.3, requireEnergy: true, energyCost: 0.0025}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedArmbinder", Asset: "FuturisticArmbinder", Type: "Tight", Color: ['#AE915C', '#AE915C', '#424242', "#424242", '#000000'],
		Group: "ItemArms", power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "tick", type: "spellRange", power: 0.5, requireEnergy: true},
			{trigger: "beforeDamageEnemy", type: "MultiplyDamageMagic", power: 1.4, requireEnergy: true, energyCost: 0.00002}
		]},

	{curse: "MistressKey", enchantedDrain: 0.00025, inventory: true, enchanted: true, name: "EnchantedMittens", Asset: "FuturisticMittens", bindhands: true,
		Color: ['#B6A262', '#B6A262', '#424242', '#000000'], Group: "ItemHands", power: 25, weight: 0,
		escapeChance: {"Struggle": -100, "Cut": -100, "Remove": -100}, enemyTags: {}, playerTags: {}, minLevel: 0, floors: KDMapInit([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), shrine: [],
		events: [
			{trigger: "beforeDamageEnemy", type: "MultiplyDamageMagic", power: 1.4, requireEnergy: true, energyCost: 0.000025} // Energy cost per point o' extra damage
		]},
];

let KDRestraintsCache = new Map();

function KinkyDungeonDrawTether(Entity, CamX, CamY) {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && inv.restraint && inv.restraint.tether && inv.tx && inv.ty) {
		let vx = inv.tx;
		let vy = inv.ty;
		if (inv.tetherToLeasher && KinkyDungeonLeashingEnemy()) {
			vx = KinkyDungeonLeashingEnemy().visual_x;
			vy = KinkyDungeonLeashingEnemy().visual_y;
		}
		if (inv.tetherToGuard && KinkyDungeonJailGuard()) {
			vx = KinkyDungeonJailGuard().visual_x;
			vy = KinkyDungeonJailGuard().visual_y;
		}

		//let dist = KDistEuclidean(inv.tx - Entity.visual_x, inv.ty - Entity.visual_y);
		let xx = canvasOffsetX + (Entity.visual_x - CamX)*KinkyDungeonGridSizeDisplay;
		let yy = canvasOffsetY + (Entity.visual_y - CamY)*KinkyDungeonGridSizeDisplay;
		let txx = canvasOffsetX + (vx - CamX)*KinkyDungeonGridSizeDisplay;
		let tyy = canvasOffsetY + (vy - CamY)*KinkyDungeonGridSizeDisplay;
		let dx = (txx - xx);
		let dy = (tyy - yy);
		let dd = 0.1; // Increments
		for (let d = 0; d < 1; d += dd) {
			let yOffset = 30 * Math.sin(Math.PI * d);
			let yOffset2 = 30 * Math.sin(Math.PI * (d + dd));

			MainCanvas.beginPath();
			MainCanvas.lineWidth = 4;
			MainCanvas.moveTo(KinkyDungeonGridSizeDisplay/2 + xx + dx*d, KinkyDungeonGridSizeDisplay*0.8 + yOffset + yy + dy*d);
			MainCanvas.lineTo(KinkyDungeonGridSizeDisplay/2 + xx + dx*(d+dd), KinkyDungeonGridSizeDisplay*0.8 + yOffset2 + yy + dy*(d+dd));
			//let color = (inv.restraint.Color.length > 0) ? inv.restraint.Color[0] : inv.restraint.Color;
			MainCanvas.strokeStyle = "#aaaaaa";//(color == "Default") ? "#aaaaaa" : color;
			MainCanvas.stroke();
		}
		return;
	}
}

function KinkyDungeonUpdateTether(Msg, Entity, xTo, yTo) {
	let exceeded = false;
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.tether && (inv.tx && inv.ty || inv.tetherToLeasher || inv.tetherToGuard)) {
			let tether = inv.tetherLength ? inv.tetherLength : inv.restraint.tether;

			if (inv.tetherToLeasher && KinkyDungeonLeashingEnemy()) {
				inv.tx = KinkyDungeonLeashingEnemy().x;
				inv.ty = KinkyDungeonLeashingEnemy().y;
			} else if (!KinkyDungeonLeashingEnemy()) {
				inv.tetherToLeasher = undefined;
				inv.tx = undefined;
				inv.ty = undefined;
			}
			if (inv.tetherToGuard && KinkyDungeonJailGuard()) {
				inv.tx = KinkyDungeonJailGuard().x;
				inv.ty = KinkyDungeonJailGuard().y;
			} else if (!KinkyDungeonJailGuard()) {
				inv.tetherToGuard = undefined;
				inv.tx = undefined;
				inv.ty = undefined;
			}

			if (xTo || yTo) {// This means we arre trying to move
				if (KDistChebyshev(xTo-inv.tx, yTo-inv.ty) > inv.restraint.tether) {
					if (Msg) KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonTetherTooShort"), "red", 2, true);
					return false;
				}
			} else {// Then we merely update
				for (let i = 0; i < 10; i++) {
					let playerDist = KDistChebyshev(Entity.x-inv.tx, Entity.y-inv.ty);
					if (playerDist > tether) {
						let slot = null;
						let mindist = playerDist;
						for (let X = Entity.x-1; X <= Entity.x+1; X++) {
							for (let Y = Entity.y-1; Y <= Entity.y+1; Y++) {
								if ((X !=  Entity.x || Y != Entity.y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y)) && KDistEuclidean(X-inv.tx, Y-inv.ty) < mindist) {
									mindist = KDistEuclidean(X-inv.tx, Y-inv.ty);
									slot = {x:X, y:Y};
								}
							}
						}
						if (!slot) { //Fallback
							slot = {x:inv.tx, y:inv.ty};
						}
						if (slot) {
							let enemy = KinkyDungeonEnemyAt(slot.x, slot.y);
							if (enemy) {
								let slot2 = null;
								let mindist2 = playerDist;
								for (let X = enemy.x-1; X <= enemy.x+1; X++) {
									for (let Y = enemy.y-1; Y <= enemy.y+1; Y++) {
										if ((X !=  enemy.x || Y != enemy.y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y)) && KDistEuclidean(X-Entity.x, Y-Entity.y) < mindist2) {
											mindist2 = KDistEuclidean(X-Entity.x, Y-Entity.y);
											slot2 = {x:X, y:Y};
										}
									}
								}
								if (slot2) {
									enemy.x = slot2.x;
									enemy.y = slot2.y;
								} else {
									enemy.x = Entity.x;
									enemy.y = Entity.y;
								}
							}
							Entity.x = slot.x;
							Entity.y = slot.y;
							KinkyDungeonInterruptSleep();
							if (Msg) KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonTetherPull"), "red", 2, true);
						}
					}
				}
			}
		}
	}

	return exceeded;
}

// Gets the length of the neck tether
function KinkyDungeonTetherLength() {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && inv.restraint && inv.restraint.tether && inv.tx && inv.ty) {
		return inv.restraint.tether;
	}
	return null;
}

function KinkyDungeonKeyGetPickBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonPickBreakProgress += mult;

	if (KinkyDungeonPickBreakProgress > KinkyDungeonKeyPickBreakAmount/1.5) chance = (KinkyDungeonPickBreakProgress - KinkyDungeonKeyPickBreakAmount/1.5) / (KinkyDungeonKeyPickBreakAmount + 1);

	return chance;
}
function KinkyDungeonGetKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonKnifeBreakProgress += mult;

	if (KinkyDungeonKnifeBreakProgress > KinkyDungeonKnifeBreakAmount/1.5) chance = (KinkyDungeonKnifeBreakProgress - KinkyDungeonKnifeBreakAmount/1.5) / (KinkyDungeonKnifeBreakAmount + 1);

	return chance;
}
function KinkyDungeonGetEnchKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonEnchKnifeBreakProgress += mult;

	if (KinkyDungeonEnchKnifeBreakProgress > KinkyDungeonEnchKnifeBreakAmount/1.5) chance = (KinkyDungeonEnchKnifeBreakProgress - KinkyDungeonEnchKnifeBreakAmount/1.5) / (KinkyDungeonEnchKnifeBreakAmount + 1);

	return chance;
}

function KinkyDungeonIsLockable(restraint) {
	if (restraint && restraint.escapeChance && (restraint.escapeChance.Pick != undefined || restraint.escapeChance.Unlock != undefined)) return true;
	return false;
}

function KinkyDungeonLock(item, lock) {
	if (item.restraint && InventoryGet(KinkyDungeonPlayer, item.restraint.Group) && lock != "") {
		if (KinkyDungeonIsLockable(item.restraint)) {
			item.lock = lock;
			if (lock == "Gold") item.lockTimer = Math.min(KinkyDungeonMaxLevel - 1, MiniGameKinkyDungeonLevel + 2 + Math.round(KDRandom() * 2));
			InventoryLock(KinkyDungeonPlayer, InventoryGet(KinkyDungeonPlayer, item.restraint.Group), "IntricatePadlock", Player.MemberNumber, true);
			item.pickProgress = 0;
			if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
				InventoryLock(Player, InventoryGet(Player, item.restraint.Group), "IntricatePadlock", null, true);
		}
	} else {
		item.lock = lock;
		InventoryUnlock(KinkyDungeonPlayer, item.restraint.Group);
		if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
			InventoryUnlock(Player, item.restraint.Group);
	}

}

function KinkyDungeonGetRestraintsWithShrine(shrine) {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine) && item.lock != "Gold") {
			ret.push(item);
		}
	}

	return ret;
}

function KinkyDungeonRemoveRestraintsWithShrine(shrine) {
	let count = 0;

	for (let i = 0; i < 10; i++) {
		for (let item of KinkyDungeonRestraintList()) {
			if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine) && item.lock != "Gold") {
				KinkyDungeonRemoveRestraint(item.restraint.Group, false, false, false, true);
				count++;
			}
		}
	}


	return count;
}

function KinkyDungeonUnlockRestraintsWithShrine(shrine) {
	let count = 0;

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.lock && item.restraint.shrine && item.restraint.shrine.includes(shrine) && item.lock != "Gold") {

			KinkyDungeonLock(item, "");
			count++;
		}
	}

	return count;
}

function KinkyDungeonPlayerGetLockableRestraints() {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (!item.lock && item.restraint && item.restraint.escapeChance && item.restraint.escapeChance.Pick != null) {
			ret.push(item);
		}
	}

	return ret;
}

function KinkyDungeonRemoveKeys(lock) {
	if (lock.includes("Red")) KinkyDungeonRedKeys -= 1;
	if (lock.includes("Blue")) KinkyDungeonBlueKeys -= 1;
}

function KinkyDungeonGetKey(lock) {
	if (lock.includes("Red")) return "Red";
	if (lock.includes("Blue")) return "Blue";
	return "";
}

function KinkyDungeonHasGhostHelp() {
	return (KinkyDungeonTargetTile && KinkyDungeonTargetTile.Type == "Ghost" && KinkyDungeonGhostDecision <= 1);
}

function KinkyDungeonIsWearingLeash() {
	for (let restraint of KinkyDungeonRestraintList()) {
		if (restraint.restraint && restraint.restraint.leash) {
			return true;
		}
	}
	return false;
}

function KinkyDungeonHasHook() {
	for (let X = KinkyDungeonPlayerEntity.x - 1; X <= KinkyDungeonPlayerEntity.x + 1; X++) {
		for (let Y = KinkyDungeonPlayerEntity.y - 1; Y <= KinkyDungeonPlayerEntity.y + 1; Y++) {
			let tile = KinkyDungeonMapGet(X, Y);
			if (tile == 'A'
				|| tile == 'a'
				|| tile == 'c'
				|| tile == 'O'
				|| tile == 'o'
				|| tile == 'B') {
				return true;
			} else if (tile == 'C') {
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonNeedOpenChest"), "red", 1);
			}
		}
	}

	return KinkyDungeonHasGhostHelp();
}

function KinkyDungeonIsHandsBound(ApplyGhost) {
	let blocked = InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands");
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.bindhands) {
			blocked = true;
			break;
		}
	}
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		blocked;
}

function KinkyDungeonIsArmsBound(ApplyGhost) {
	let blocked = InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemArms");
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.bindarms) {
			blocked = true;
			break;
		}
	}
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		blocked;
}

function KinkyDungeonStrictness(ApplyGhost, Group) {
	if (ApplyGhost && KinkyDungeonHasGhostHelp()) return 0;
	let strictness = 0;
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.Group != Group && inv.restraint.strictness && inv.restraint.strictness > strictness)  {
			let strictGroups = KinkyDungeonStrictnessTable.get(inv.restraint.Group);
			if (strictGroups) {
				for (let s of strictGroups) {
					if (s == Group) {
						strictness += inv.restraint.strictness;
						break;
					}
				}
			}
		}
	}
	return strictness;
}

function KinkyDungeonGetStrictnessItems(Group) {
	let list = [];
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.Group != Group && inv.restraint.strictness)  {
			let strictGroups = KinkyDungeonStrictnessTable.get(inv.restraint.Group);
			if (strictGroups) {
				for (let s of strictGroups) {
					if (s == Group) {
						list.push(inv.restraint.name);
						break;
					}
				}
			}
		}
	}
	return list;
}

function KinkyDungeonGetPickBaseChance() {
	return 0.33 / (1.0 + 0.02 * MiniGameKinkyDungeonLevel);
}

// Note: This is for tiles (doors, chests) only!!!
function KinkyDungeonPickAttempt() {
	let Pass = "Fail";
	let escapeChance = KinkyDungeonGetPickBaseChance();
	var cost = KinkyDungeonStatStaminaCostPick;
	let lock = KinkyDungeonTargetTile.Lock;
	if (!KinkyDungeonTargetTile.pickProgress) KinkyDungeonTargetTile.pickProgress = 0;

	KinkyDungeonInterruptSleep();

	if (lock.includes("Blue")) {
		if ((KinkyDungeonPlayer.IsBlind() < 1) || !lock.includes("Blue"))
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleCantPickBlueLock"), "orange", 2);
		Pass = "Fail";
	}

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	let strict = KinkyDungeonStrictness();
	if (!strict) strict = 0;
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.0, escapeChance - 0.25);
	if (handsBound && strict < 0.5) escapeChance = Math.max(0, escapeChance - 0.5);
	else if (strict) escapeChance = Math.max(0, escapeChance - strict);

	escapeChance /= 1.0 + KinkyDungeonStatArousal/KinkyDungeonStatArousalMax*KinkyDungeonArousalUnlockSuccessMod;

	if (!KinkyDungeonHasStamina(-cost, true)) {
		KinkyDungeonWaitMessage(true);
	} else if (KinkyDungeonTargetTile && KinkyDungeonTargetTile.pickProgress >= 1){//KDRandom() < escapeChance
		Pass = "Success";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
	} else if (KDRandom() < KinkyDungeonKeyGetPickBreakChance() || lock.includes("Blue")) { // Blue locks cannot be picked or cut!
		Pass = "Break";
		KinkyDungeonLockpicks -= 1;
		KinkyDungeonPickBreakProgress = 0;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
	} else if (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound)) {
		KinkyDungeonDropItem({name: "Pick"}, KinkyDungeonPlayerEntity, true);
		KinkyDungeonLockpicks -= 1;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	} else {
		KinkyDungeonTargetTile.pickProgress += escapeChance;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
	}
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonAttemptPick" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	KinkyDungeonChangeStamina(cost);
	return Pass == "Success";
}

function KinkyDungeonUnlockAttempt(lock) {
	let Pass = "Fail";
	let escapeChance = 1.0;

	KinkyDungeonInterruptSleep();

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	let strict = KinkyDungeonStrictness();
	if (!strict) strict = 0;
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.1, escapeChance - 0.25);
	if (handsBound && strict < 0.5) escapeChance = Math.max(0, escapeChance - 0.5);
	else if (strict) escapeChance = Math.max(0, escapeChance - strict);

	if (KDRandom() < escapeChance)
		Pass = "Success";
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonStruggleUnlock" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	if (Pass == "Success") {
		KinkyDungeonRemoveKeys(lock);
		if (lock == "Blue" && KinkyDungeonTargetTile && KinkyDungeonTargetTile.Loot == "normal") KinkyDungeonSpecialLoot = true;
		else if (lock == "Red" && KinkyDungeonTargetTile && KinkyDungeonTargetTile.Loot == "normal") KinkyDungeonLockedLoot = true;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
		return true;
	} else if (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound)) {
		let keytype = KinkyDungeonGetKey(lock);
		KinkyDungeonDropItem({name: keytype+"Key"}, KinkyDungeonPlayerEntity, true);
		if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
		else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	} else {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
	}
	return false;
}

// Lockpick = use tool or cut
// Otherwise, just a normal struggle
function KinkyDungeonStruggle(struggleGroup, StruggleType) {
	let restraint = KinkyDungeonGetRestraintItem(struggleGroup.group);
	let failSuffix = "";
	if (restraint.restraint && restraint.restraint.failSuffix && restraint.restraint.failSuffix[StruggleType]) {
		failSuffix = restraint.restraint.failSuffix[StruggleType];
	}
	KinkyDungeonCurrentEscapingItem = restraint;
	KinkyDungeonCurrentEscapingMethod = StruggleType;
	KinkyDungeonStruggleTime = CommonTime() + 750;
	let cost = KinkyDungeonStatStaminaCostStruggle;
	if (StruggleType == "Cut") cost = KinkyDungeonStatStaminaCostTool;
	else if (StruggleType == "Pick") cost = KinkyDungeonStatStaminaCostPick;
	else if (StruggleType == "Remove") cost = KinkyDungeonStatStaminaCostRemove;
	else if (StruggleType == "Unlock") cost = KinkyDungeonStatStaminaCostPick;
	KinkyDungeonInterruptSleep();
	if (StruggleType == "Unlock") cost = 0;
	let Pass = "Fail";
	let origEscapeChance = restraint.restraint.escapeChance[StruggleType];
	let restraintEscapeChance = origEscapeChance;
	if (KinkyDungeonHasGhostHelp() && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType]) {
		restraintEscapeChance = restraint.restraint.helpChance[StruggleType];
	}
	let escapeChance = (restraintEscapeChance != null) ? restraintEscapeChance : 1.0;
	if (!restraint.removeProgress) restraint.removeProgress = 0;
	if (!restraint.pickProgress) restraint.pickProgress = 0;
	if (!restraint.struggleProgress) restraint.struggleProgress = 0;
	if (!restraint.unlockProgress) restraint.unlockProgress = 0;
	if (!restraint.cutProgress) restraint.cutProgress = 0;

	let increasedAttempts = false;

	let handsBound = KinkyDungeonIsHandsBound(true);

	// Bonuses go here
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostStruggle")) escapeChance += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostStruggle");
	if (StruggleType == "Cut") {
		if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCutting")) escapeChance += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCutting");
		if (KinkyDungeonHasGhostHelp()) {
			let maxBonus = 0;
			for (let inv of KinkyDungeonInventory) {
				if (inv.weapon && inv.weapon.cutBonus > maxBonus) maxBonus = inv.weapon.cutBonus;
			}
			escapeChance += maxBonus;
		} else if (KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.cutBonus) {
			escapeChance += KinkyDungeonPlayerWeapon.cutBonus;
		}

		if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCuttingMinimum")) escapeChance = Math.max(escapeChance, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCuttingMinimum"));
	}
	if (StruggleType == "Cut" && KinkyDungeonEnchantedBlades > 0) escapeChance += KinkyDungeonEnchantedKnifeBonus;


	// Finger extensions will help if your hands are unbound. Some items cant be removed without them!
	// Mouth counts as a finger extension on your hands if your arms aren't tied
	let armsBound = KinkyDungeonIsArmsBound(true);
	if (StruggleType == "Remove" &&
		(!handsBound && (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0 || KinkyDungeonLockpicks > 0)
		|| (struggleGroup.group == "ItemHands" && KinkyDungeonCanTalk() && !armsBound)))
		escapeChance = Math.min(1, escapeChance + 0.15);

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts) {
			increasedAttempts = true;
			restraint.attempts += 0.5;
			if (escapeChance <= -0.5) restraint.attempts += 0.5;
		} else {
			let typesuff = "";
			if (origEscapeChance <= 0 && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType] > 0) typesuff = "3";
			else if (restraint.restraint.specStruggleTypes && restraint.restraint.specStruggleTypes.includes(StruggleType)) typesuff = "2";
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			if (typesuff == "" && failSuffix) typesuff = failSuffix;
			if (typesuff == "" && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) typesuff = typesuff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "Impossible" + typesuff), "red", 2);
			KinkyDungeonLastAction = "Struggle";
			KinkyDungeonSendEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			KinkyDungeonChangeStamina(cost);
			KinkyDungeonAdvanceTime(1);
			return "Impossible";
		}
	}

	let strict = KinkyDungeonStrictness(true, struggleGroup.group);
	let hasEdge = KinkyDungeonHasHook();

	// Struggling is unaffected by having arms bound
	let minAmount = 0.1 - Math.max(0, 0.01*restraint.restraint.power);
	if (StruggleType == "Remove" && !hasEdge) minAmount = 0;
	if (!KinkyDungeonHasGhostHelp() && StruggleType != "Struggle" && (struggleGroup.group != "ItemArms" && struggleGroup.group != "ItemHands" ) && !KinkyDungeonPlayer.CanInteract()) escapeChance /= 1.5;
	if (StruggleType != "Struggle" && struggleGroup.group != "ItemArms" && armsBound) escapeChance = Math.max(minAmount, escapeChance - 0.3);

	// Covered hands makes it harder to unlock, and twice as hard to remove
	if ((StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove") && struggleGroup.group != "ItemHands" && handsBound)
		escapeChance = (StruggleType == "Remove" && hasEdge) ? escapeChance / 2 : Math.max(0, escapeChance - 0.5);

	if (StruggleType == "Remove" && escapeChance == 0) {
		let typesuff = "";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
		if (typesuff == "" && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) typesuff = typesuff + "Aroused";
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "NeedEdge" + typesuff), "red", 2);
		KinkyDungeonLastAction = "Struggle";
		KinkyDungeonSendEvent("struggle", {
			restraint: restraint,
			group: struggleGroup,
			struggletype: StruggleType,
			result: "NeedEdge",
		});
		return "NeedEdge";
	}

	let possible = escapeChance > 0;
	// Strict bindings make it harder to escape
	if (strict) escapeChance = Math.max(0, escapeChance - strict);

	if (possible && escapeChance == 0) {
		let typesuff = "";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
		if (typesuff == "" && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) typesuff = typesuff + "Aroused";
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "Strict" + typesuff), "red", 2);
		KinkyDungeonLastAction = "Struggle";
		KinkyDungeonSendEvent("struggle", {
			restraint: restraint,
			group: struggleGroup,
			struggletype: StruggleType,
			result: "NeedEdge",
		});
		return "NeedEdge";
	}

	if (!KinkyDungeonHasGhostHelp() && (StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove")) escapeChance /= 1.0 + KinkyDungeonStatArousal/KinkyDungeonStatArousalMax*KinkyDungeonArousalUnlockSuccessMod;

	// Items which require a knife are much harder to cut without one
	if (StruggleType == "Cut" && KinkyDungeonNormalBlades <= 0 && KinkyDungeonEnchantedBlades <= 0 && restraintEscapeChance > 0.01) escapeChance/= 5;

	if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, struggleGroup.group)) escapeChance = 0;

	// Blue locks make it harder to escape an item
	if (restraint.lock == "Blue" && (StruggleType == "Cut" || StruggleType == "Remove" || StruggleType == "Struggle")) escapeChance = Math.max(0, escapeChance - 0.15);

	// Gold locks are extremely magical.
	if (restraint.lock == "Gold" && (StruggleType == "Cut" || StruggleType == "Remove" || StruggleType == "Struggle")) escapeChance = Math.max(0, escapeChance - 0.3);

	if (StruggleType == "Cut" && struggleGroup.group != "ItemHands" && handsBound)
		escapeChance = escapeChance / 2;

	// Struggling is affected by tightness
	if (escapeChance > 0 && StruggleType == "Struggle") {
		for (let T = 0; T < restraint.tightness; T++) {
			escapeChance *= 0.8; // Tougher for each tightness, however struggling will reduce the tightness
		}
	}

	if (StruggleType == "Pick") escapeChance *= KinkyDungeonGetPickBaseChance();

	let belt = null;
	let bra = null;

	if (struggleGroup.group != "ItemVulva" || struggleGroup.group != "ItemVulvaPiercings" || struggleGroup.group != "ItemButt") belt = KinkyDungeonGetRestraintItem("ItemPelvis");
	if (belt && belt.chastity) escapeChance = 0.0;

	if (struggleGroup.group != "ItemNipples" || struggleGroup.group != "ItemNipplesPiercings") bra = KinkyDungeonGetRestraintItem("ItemBreast");
	if (bra && bra.chastity) escapeChance = 0.0;

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts || increasedAttempts) {
			if (!increasedAttempts) {
				restraint.attempts += 0.5;
				if (escapeChance <= -0.5) restraint.attempts += 0.5;
			}
		} else {
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			let suff = "";
			if (suff == "" && failSuffix) suff = failSuffix;
			if (KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "ImpossibleBound" + suff), "red", 2);
			KinkyDungeonLastAction = "Struggle";
			KinkyDungeonSendEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			KinkyDungeonChangeStamina(cost);
			KinkyDungeonAdvanceTime(1);
			return "Impossible";
		}
	}

	if (restraint.restraint && restraint.restraint.escapeMult) escapeChance *= restraint.restraint.escapeMult;


	if (restraint.restraint && restraint.restraint.struggleMinSpeed && restraint.restraint.struggleMinSpeed[StruggleType])
		escapeChance = Math.max(escapeChance, restraint.restraint.struggleMinSpeed[StruggleType]);

	if (restraint.restraint && restraint.restraint.struggleMult && restraint.restraint.struggleMult[StruggleType])
		escapeChance *= restraint.restraint.struggleMult[StruggleType];

	if (restraint.restraint && restraint.restraint.struggleMaxSpeed && restraint.restraint.struggleMaxSpeed[StruggleType])
		escapeChance = Math.min(escapeChance, restraint.restraint.struggleMaxSpeed[StruggleType]);

	// Handle cases where you can't even attempt to unlock
	if ((StruggleType == "Unlock" && !((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)))
		|| (StruggleType == "Pick" && (restraint.lock == "Blue" || restraint.lock == "Gold"))) {
		if (StruggleType == "Unlock" && ((KinkyDungeonPlayer.IsBlind() < 1) || !(restraint.lock.includes("Blue") || restraint.lock.includes("Gold"))))
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : restraint.lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleCantPick" + restraint.lock + "Lock"), "orange", 2);
	} else {

		// Main struggling block
		if (!KinkyDungeonHasStamina(-cost, true)) {
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			KinkyDungeonWaitMessage(true);
		} else {
			// Pass block
			if (((StruggleType == "Cut" && restraint.cutProgress >= 1 - escapeChance)
					|| (StruggleType == "Pick" && restraint.pickProgress >= 1 - escapeChance)
					|| (StruggleType == "Unlock" && restraint.unlockProgress >= 1 - escapeChance)
					|| (StruggleType == "Remove" && restraint.removeProgress >= 1 - escapeChance)
					|| (restraint.struggleProgress >= 1 - escapeChance))
				&& !(restraint.lock == "Blue" && StruggleType == "Pick")) {
				Pass = "Success";
				if (StruggleType == "Pick" || StruggleType == "Unlock") {
					if (StruggleType == "Unlock") {
						if ((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)) {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
							KinkyDungeonRemoveKeys(restraint.lock);
							KinkyDungeonLock(restraint, "");
						}
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
						KinkyDungeonLock(restraint, "");
					}
				} else {
					if (KinkyDungeonSound) {
						if (StruggleType == "Cut") AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
						else if (StruggleType == "Remove") AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unbuckle.ogg");
						else AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					}
					KinkyDungeonRemoveRestraint(restraint.restraint.Group, StruggleType != "Cut");
				}
			} else {
				// Failure block for the different failure types
				if (StruggleType == "Cut") {
					let breakchance = 0;
					if (KinkyDungeonNormalBlades > 0 && !restraint.restraint.magic) breakchance = KinkyDungeonGetKnifeBreakChance();
					else if (KinkyDungeonEnchantedBlades > 0) breakchance = KinkyDungeonGetEnchKnifeBreakChance();
					if (KDRandom() < breakchance) {
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1;
						else {
							if (KinkyDungeonNormalBlades > 0) {
								KinkyDungeonNormalBlades -= 1;
								KinkyDungeonKnifeBreakProgress = 0;
							} else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonEnchantedBlades -= 1;
								KinkyDungeonEnchKnifeBreakProgress = 0;
							}
						}
					} else if ((handsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound) || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound)) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) {
							KinkyDungeonDropItem({name: "EnchKnife"}, KinkyDungeonPlayerEntity, true);
							KinkyDungeonEnchantedBlades -= 1;
						} else {
							if (KinkyDungeonNormalBlades > 0) {
								KinkyDungeonDropItem({name: "Knife"}, KinkyDungeonPlayerEntity, true);
								KinkyDungeonNormalBlades -= 1;
							} else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonDropItem({name: "EnchKnife"}, KinkyDungeonPlayerEntity, true);
								KinkyDungeonEnchantedBlades -= 1;
							}
						}
					} else {
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades == 0) {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/MagicSlash.ogg");
							Pass = "Fail";
						} else {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
							restraint.cutProgress += escapeChance * (0.3 + 0.2 * KDRandom() + 0.6 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
						}
					}
				} else if (StruggleType == "Pick") {
					if (KDRandom() < KinkyDungeonKeyGetPickBreakChance() || restraint.lock == "Blue" || restraint.lock == "Gold") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						KinkyDungeonLockpicks -= 1;
						KinkyDungeonPickBreakProgress = 0;
					} else if (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound)) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						KinkyDungeonDropItem({name: "Pick"}, KinkyDungeonPlayerEntity, true);
						KinkyDungeonLockpicks -= 1;
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						if (!restraint.pickProgress) restraint.pickProgress = 0;
						restraint.pickProgress += escapeChance * (0.5 + 1.0 * KDRandom());
					}
				} else if (StruggleType == "Unlock") {
					if (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound)) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						let keytype = KinkyDungeonGetKey(restraint.lock);
						KinkyDungeonDropItem({name: keytype+"Key"}, KinkyDungeonPlayerEntity, true);
						if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
						else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						restraint.unlockProgress += escapeChance * (0.75 + 0.5 * KDRandom());
					}
				} else if (StruggleType == "Remove") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					restraint.removeProgress += escapeChance * (0.55 + 0.2 * KDRandom() + 0.35 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				} else if (StruggleType == "Struggle") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					restraint.struggleProgress += escapeChance * (0.4 + 0.3 * KDRandom() + 0.4 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				}
			}

			// Aftermath
			let suff = "";
			if (Pass == "Fail" && escapeChance > 0 && origEscapeChance <= 0) {
				if (KinkyDungeonHasGhostHelp() && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType] > 0) suff = "3";
				else suff = "2";
			} else if (Pass == "Fail") {
				if (suff == "" && failSuffix) suff = failSuffix;
			}
			if ((suff == "" || (Pass == "Fail" && suff == failSuffix)) && (Pass == "Fail" || Pass == "Success") && KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonStruggle" + StruggleType + Pass + suff).replace("TargetRestraint", TextGet("Restraint" + restraint.restraint.name)), (Pass == "Success") ? "lightgreen" : "red", 2);

			KinkyDungeonChangeStamina(cost);

			if (Pass != "Success") {
				// Reduce the progress
				if (StruggleType == "Struggle") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.9 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.8 - 0.01);
				} else if (StruggleType == "Pick") {
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
				} else if (StruggleType == "Unlock") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
				} if (StruggleType == "Remove") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
				}

				// reduces the tightness of the restraint slightly
				if (StruggleType == "Struggle") {
					var tightness_reduction = 1;

					for (let I = 0; I < KinkyDungeonInventory.length; I++) {
						if (KinkyDungeonInventory[I].restraint) {
							tightness_reduction *= 0.8; // Reduced tightness reduction for each restraint currently worn
						}
					}

					restraint.tightness = Math.max(0, restraint.tightness - tightness_reduction);
				}
			} else if (KinkyDungeonHasGhostHelp())
				KinkyDungeonChangeRep("Ghost", 1);
		}

		KinkyDungeonSendEvent("struggle", {
			restraint: restraint,
			group: struggleGroup,
			struggletype: StruggleType,
			result: Pass,
		});
		KinkyDungeonLastAction = "Struggle";
		if (StruggleType == "Struggle") KinkyDungeonAlert = 4;
		KinkyDungeonAdvanceTime(1);
		if (Pass == "Success") KinkyDungeonCurrentEscapingItem = null;
		return Pass;
	}
	return "Impossible";
}

function KinkyDungeonGetRestraintItem(group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.Group == group) {
			return item;
		}
	}
	return null;
}

function KinkyDungeonRefreshRestraintsCache() {
	KinkyDungeonRestraintsCache = new Map();
	for (let r of KinkyDungeonRestraints) {
		KinkyDungeonRestraintsCache.set(r.name, r);
	}
}


function KinkyDungeonGetRestraintByName(Name) {
	if (KinkyDungeonRestraintsCache.size > 0) {
		return KinkyDungeonRestraintsCache.get(Name);
	} else KinkyDungeonRefreshRestraintsCache();
	/*for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		var restraint = KinkyDungeonRestraints[L];
		if (restraint.name == Name) return restraint;
	}
	return null;*/
}

function KinkyDungeonGetLockMult(Lock) {
	if (Lock == "Red") return 2.0;
	if (Lock == "Blue") return 3.0;
	if (Lock == "Gold") return 3.25;

	return 1;
}

function KinkyDungeonGetRestraint(enemy, Level, Index, Bypass, Lock, RequireStamina, LeashingOnly) {
	let restraintWeightTotal = 0;
	let restraintWeights = [];
	let cache = KDRestraintsCache.get(enemy.name);
	let staminaPercent = KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax;

	if (KinkyDungeonSlowLevel > 0) staminaPercent = staminaPercent * (0.5 + 0.5 * Math.min(1, Math.max(0, 1 - KinkyDungeonSlowLevel/3)));

	if (!cache || !enemy.name) {
		cache = [];
		let start2 = performance.now();
		for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
			let restraint = KinkyDungeonRestraints[L];
			if ((Level >= restraint.minLevel || KinkyDungeonNewGame > 0) && restraint.floors.get(Index)) {
				let enabled = false;
				let weight = 0;
				if (enemy.tags.length) {
					for (let t of enemy.tags)
						if (restraint.enemyTags[t] != undefined) {
							weight += restraint.enemyTags[t];
							enabled = true;
						}
				} else {
					for (let t of enemy.tags.keys())
						if (restraint.enemyTags[t] != undefined) {
							weight += restraint.enemyTags[t];
							enabled = true;
						}
				}
				if (enabled) {
					cache.push({r: restraint, w:weight});
				}
			}
		}
		let end2 = performance.now();
		if (KDDebug)
			console.log(`Saved ${end2 - start2} milliseconds by caching`);
		if (enemy.name)
			KDRestraintsCache.set(enemy.name, cache);
	}

	let start = performance.now();
	for (let r of cache) {
		let restraint = r.r;
		let currentRestraint = KinkyDungeonGetRestraintItem(restraint.Group);
		//let lockMult = currentRestraint ? KinkyDungeonGetLockMult(currentRestraint.lock) : 1;
		let newLock = Lock ? Lock : restraint.DefaultLock;
		let power = KinkyDungeonRestraintPower(currentRestraint);
		if ((!LeashingOnly || (restraint.Group == "ItemNeck" || restraint.Group == "ItemNeckRestraints"))
			&& (!RequireStamina || !restraint.maxstamina || staminaPercent <= restraint.maxstamina || (LeashingOnly && (restraint.Group == "ItemNeck" || restraint.Group == "ItemNeckRestraints")))
			&& (!currentRestraint || !currentRestraint.restraint ||
			(power <
			(((Lock || restraint.DefaultLock) && KinkyDungeonIsLockable(restraint)) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power)
				|| (currentRestraint && currentRestraint.restraint && KinkyDungeonLinkableAndStricter(currentRestraint.restraint, restraint, currentRestraint.dynamicLink, currentRestraint.oldLock))))
			&& (!r.dynamicLink || !r.dynamicLink.includes(restraint.name))
			&& (Bypass || restraint.bypass || !InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group))) {

			restraintWeights.push({restraint: restraint, weight: restraintWeightTotal});
			let weight = r.w;
			weight += restraint.weight;
			if (restraint.playerTags)
				for (let tag in restraint.playerTags)
					if (KinkyDungeonPlayerTags.get(tag)) weight += restraint.playerTags[tag];
			restraintWeightTotal += Math.max(0, weight);
		}
	}
	let end = performance.now();
	if (KDDebug)
		console.log(`Took ${end - start} milliseconds to generate restraints for ${enemy.name}`);


	var selection = KDRandom() * restraintWeightTotal;

	for (let L = restraintWeights.length - 1; L >= 0; L--) {
		if (selection > restraintWeights[L].weight) {
			return restraintWeights[L].restraint;
		}
	}

}

function KinkyDungeonUpdateRestraints(delta) {
	let playerTags = new Map();
	for (let G = 0; G < KinkyDungeonPlayer.Appearance.length; G++) {
		if (KinkyDungeonPlayer.Appearance[G].Asset) {
			let group = KinkyDungeonPlayer.Appearance[G].Asset.Group;
			if (group) {
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, group.Name)) playerTags.set(group.Name + "Blocked", true);
				if (InventoryGet(KinkyDungeonPlayer, group.Name)) playerTags.set(group.Name + "Full", true);
			}
		}
	}
	for (let sg of KinkyDungeonStruggleGroupsBase) {
		let group = sg;
		if (group == "ItemM") {
			if (!InventoryGet(KinkyDungeonPlayer, "ItemMouth")) playerTags.set("ItemMouth" + "Empty", true);
			if (!InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) playerTags.set("ItemMouth2" + "Empty", true);
			if (!InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) playerTags.set("ItemMouth3" + "Empty", true);
		} else if (!InventoryGet(KinkyDungeonPlayer, group)) playerTags.set(group + "Empty", true);
	}
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint) {
			if (inv.restraint.addTag)
				for (let tag of inv.restraint.addTag) {
					if (!playerTags.get(tag)) playerTags.set(tag, true);
				}
			if (inv.restraint.shrine)
				for (let tag of inv.restraint.shrine) {
					if (!playerTags.get(tag)) playerTags.set(tag, true);
				}
		}
	}
	return playerTags;
}

function KinkyDungeonRestraintPower(item, NoLink) {
	if (item && item.restraint) {
		let lockMult = item ? KinkyDungeonGetLockMult(item.lock) : 1;
		let power = (item.lock ? item.restraint.power * lockMult : item.restraint.power);

		if (item.dynamicLink && item.dynamicLink.length > 0 && !NoLink) {
			let link = item.dynamicLink[item.dynamicLink.length - 1];
			if (!KinkyDungeonIsLinkable(KinkyDungeonGetRestraintByName(link), item.restraint)) {
				let lock = (item.oldLock && item.oldLock.length > 0) ? item.oldLock[item.oldLock.length - 1] : "";
				let mult = lock ? KinkyDungeonGetLockMult(lock) : 1;
				power = Math.max(power, link.power * mult);
			}
		}
		return power;
	}
	return 0;
}

function KinkyDungeonLinkableAndStricter(oldRestraint, newRestraint, dynamicLink, oldLock, newLock) {
	if (oldRestraint && newRestraint) {
		if ((!oldRestraint.strictness || newRestraint.strictness >= oldRestraint.strictness)
			&& (newRestraint.power >= oldRestraint.power - 1)) {
			let power = 0;
			if (dynamicLink && oldLock) {
				let link = dynamicLink[dynamicLink.length - 1];
				let lock = oldLock[oldLock.length - 1];
				if (link) {
					let r = KinkyDungeonGetRestraintByName(link);
					if (r) {
						let p = KinkyDungeonGetLockMult(lock) * r.power;
						if (p > power) power = p;
					}
				}
			}
			return KinkyDungeonGetLockMult(newLock) * newRestraint.power > power && KinkyDungeonIsLinkable(oldRestraint, newRestraint);
		}
	}
	return false;
}


function KinkyDungeonAddRestraintIfWeaker(restraint, Tightness, Bypass, Lock, Keep) {
	let r = KinkyDungeonGetRestraintItem(restraint.Group);
	let power = KinkyDungeonRestraintPower(r);
	let newLock = (Lock && KinkyDungeonIsLockable(restraint)) ? Lock : restraint.DefaultLock;
	if (!r || (r.restraint && (!r.dynamicLink || !r.dynamicLink.includes(restraint.name)) && !r.restraint.enchanted
		&& ((power < ((newLock) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power))
			|| (r && r.restraint && KinkyDungeonLinkableAndStricter(r.restraint, restraint, r.dynamicLink, r.oldLock))))) {
		return KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep, false, true);
	}
	return 0;
}

function KinkyDungeonIsLinkable(oldRestraint, newRestraint) {
	if (oldRestraint && newRestraint && oldRestraint && oldRestraint.LinkableBy && newRestraint.shrine) {
		for (let l of oldRestraint.LinkableBy) {
			for (let s of newRestraint.shrine) {
				if (l == s) {
					return true;
				}
			}
		}
	}
	if (oldRestraint && newRestraint && oldRestraint && oldRestraint.Link) {
		if (newRestraint.name == oldRestraint.Link) return true;
	}
	return false;
}

let KinkyDungeonRestraintAdded = false;
let KinkyDungeonCancelFlag = false;

function KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep, Link, SwitchItems) {
	let start = performance.now();
	var tight = (Tightness) ? Tightness : 0;
	let AssetGroup = restraint.AssetGroup ? restraint.AssetGroup : restraint.Group;
	if (restraint) {
		if (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			let r = KinkyDungeonGetRestraintItem(restraint.Group);
			let linkable = (!Link && r && r.restraint && KinkyDungeonIsLinkable(r.restraint, restraint));
			let linked = false;
			if (linkable) {
				linked = true;
				KinkyDungeonCancelFlag = KinkyDungeonLinkItem(restraint, r, Tightness, Lock, Keep);
			}

			// Some confusing stuff here to prevent recursion. If Link = true this means we are in the middle of linking, we dont want to do that
			if (!KinkyDungeonCancelFlag) {
				KinkyDungeonRemoveRestraint(restraint.Group, Keep, Link);

				r = KinkyDungeonGetRestraintItem(restraint.Group);
				KinkyDungeonCancelFlag = r != undefined;
			}

			// If we did not link an item (or unlink one) then we proceed as normal
			if (!KinkyDungeonCancelFlag) {
				KinkyDungeonRemoveRestraint(restraint.Group, Keep, false);
				if (restraint.remove)
					for (let remove of restraint.remove) {
						InventoryRemove(KinkyDungeonPlayer, remove);
					}
				InventoryWear(KinkyDungeonPlayer, restraint.Asset, AssetGroup, restraint.power);
				KinkyDungeonSendFloater({x: 1100, y: 600 - KDRecentRepIndex * 40}, `+${TextGet("Restraint" + restraint.name)}!`, "pink", 5, true);
				KDRecentRepIndex += 1;
				let placed = InventoryGet(KinkyDungeonPlayer, AssetGroup);
				let placedOnPlayer = false;
				if (!placed) console.log(`Error placing ${restraint.name} on player!!!`);
				if (placed && ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(AssetGroup) && AssetGroup != "ItemHead" && InventoryAllow(
					Player, placed.Asset) &&
					(!InventoryGetLock(InventoryGet(Player, AssetGroup))
					|| (InventoryGetLock(InventoryGet(Player, AssetGroup)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, AssetGroup)).Asset.LoverOnly == false))) {
					InventoryWear(Player, restraint.Asset, AssetGroup, restraint.power);
					placedOnPlayer = true;
				}
				if (placed && !placed.Property) placed.Property = {};
				if (restraint.Type) {
					KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", AssetGroup);
					var options = window["Inventory" + ((AssetGroup.includes("ItemMouth")) ? "ItemMouth" : AssetGroup) + restraint.Asset + "Options"];
					if (!options) options = TypedItemDataLookup[`${AssetGroup}${restraint.Asset}`].options; // Try again
					const option = options.find(o => o.Name === restraint.Type);
					ExtendedItemSetType(KinkyDungeonPlayer, options, option);
					if (placedOnPlayer) {
						Player.FocusGroup = AssetGroupGet("Female3DCG", AssetGroup);
						ExtendedItemSetType(Player, options, option);
						Player.FocusGroup = null;
					}
					KinkyDungeonPlayer.FocusGroup = null;
				}
				if (restraint.Modules) {
					let data = ModularItemDataLookup[AssetGroup + restraint.Asset];
					let asset = data.asset;
					let modules = data.modules;
					// @ts-ignore
					InventoryGet(KinkyDungeonPlayer, AssetGroup).Property = ModularItemMergeModuleValues({ asset, modules }, restraint.Modules);
					if (placedOnPlayer) {
						// @ts-ignore
						InventoryGet(Player, AssetGroup).Property = ModularItemMergeModuleValues({ asset, modules }, restraint.Modules);
					}
				}
				if (restraint.OverridePriority) {
					if (!InventoryGet(KinkyDungeonPlayer, AssetGroup).Property) InventoryGet(KinkyDungeonPlayer, AssetGroup).Property = {OverridePriority: restraint.OverridePriority};
					else InventoryGet(KinkyDungeonPlayer, AssetGroup).Property.OverridePriority = restraint.OverridePriority;
				}
				if (restraint.Color) {
					CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, restraint.Color, AssetGroup);
					if (placedOnPlayer)
						CharacterAppearanceSetColorForGroup(Player, restraint.Color, AssetGroup);
				}
				let item = {restraint: restraint, tightness: tight, lock: "", events: restraint.events};
				KinkyDungeonInventory.push(item);

				if (Lock) KinkyDungeonLock(item, Lock);
				else if (restraint.DefaultLock) KinkyDungeonLock(item, restraint.DefaultLock);
			} else if ((!Link && !linked) || SwitchItems) {
				KinkyDungeonCancelFlag = false;
				// Otherwise, if we did unlink an item, and we are not in the process of linking (very important to prevent loops)
				// Then we link the new item to the unlinked item if possible
				r = KinkyDungeonGetRestraintItem(restraint.Group);
				if (r && r.restraint && KinkyDungeonIsLinkable(r.restraint, restraint))
					KinkyDungeonLinkItem(restraint, r, Tightness, Lock, Keep);
			}
			KinkyDungeonCancelFlag = false;
		}
		KinkyDungeonWearForcedClothes();
		KinkyDungeonUpdateRestraints(0); // We update the restraints but no time drain on batteries, etc
		KinkyDungeonCheckClothesLoss = true; // We signal it is OK to check whether the player should get undressed due to restraints
		KinkyDungeonMultiplayerInventoryFlag = true; // Signal that we can send the inventory now
		KinkyDungeonSleepTime = 0;
		KinkyDungeonUpdateStruggleGroups();
		if (!KinkyDungeonRestraintAdded) {
			KinkyDungeonRestraintAdded = true;
			let sfx = (restraint && restraint.sfx) ? restraint.sfx : "Struggle";
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
		}
		let end = performance.now();
		if (KDDebug)
			console.log(`Took ${end - start} milliseconds to add restraint ${restraint.name}`);
		return Math.max(1, restraint.power);
	}
	return 0;
}

function KinkyDungeonRemoveRestraint(Group, Keep, Add, NoEvent, Shrine) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		let AssetGroup = item && item.restraint && item.restraint.AssetGroup ? item.restraint.AssetGroup : Group;
		if ((item.restraint && item.restraint.Group == Group)) {
			if (!NoEvent)
				KinkyDungeonSendEvent("remove", {item: item, add: Add, keep: Keep, shrine: Shrine});

			if (!KinkyDungeonCancelFlag && !Add) {
				KinkyDungeonCancelFlag = KinkyDungeonUnLinkItem(item, Keep);
			}

			if (!KinkyDungeonCancelFlag) {
				if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(AssetGroup) && InventoryGet(Player, AssetGroup) &&
					(!InventoryGetLock(InventoryGet(Player, AssetGroup)) || (InventoryGetLock(InventoryGet(Player, AssetGroup)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, Group)).Asset.LoverOnly == false))
					&& Group != "ItemHead") {
					InventoryRemove(Player, AssetGroup);
					if (Group == "ItemNeck") {
						InventoryRemove(Player, "ItemNeckAccessories");
						InventoryRemove(Player, "ItemNeckRestraints");
					}
				}

				if (item.restraint.inventory && (Keep || item.restraint.enchanted) && !KinkyDungeonInventoryGetLoose(item.restraint.name)) {
					if (item.restraint.inventoryAs) {
						let origRestraint = KinkyDungeonGetRestraintByName(item.restraint.inventoryAs);
						if (!KinkyDungeonInventoryGetLoose(origRestraint.name))
							KinkyDungeonInventory.push({looserestraint: origRestraint, events: origRestraint.looseevents});
					} else KinkyDungeonInventory.push({looserestraint: item.restraint, events: item.restraint.looseevents});
				}

				InventoryRemove(KinkyDungeonPlayer, AssetGroup);

				for (let II = 0; II < KinkyDungeonInventory.length; II++) {
					if (KinkyDungeonInventory[II] && KinkyDungeonInventory[II].restraint && KinkyDungeonInventory[II].restraint.Group == Group) {
						KinkyDungeonInventory.splice(II, 1);
						break;
					}
				}


				if (item.restraint.Group == "ItemNeck" && KinkyDungeonGetRestraintItem("ItemNeckRestraints")) KinkyDungeonRemoveRestraint("ItemNeckRestraints", KinkyDungeonGetRestraintItem("ItemNeckRestraints").restraint.inventory);

				if (!NoEvent) {
					if (item.events) {
						for (let e of item.events) {
							if (e.trigger == "afterRemove" && (!e.requireEnergy || ((!e.energyCost && KDGameData.AncientEnergyLevel > 0) || (e.energyCost && KDGameData.AncientEnergyLevel > e.energyCost)))) {
								KinkyDungeonHandleInventoryEvent("afterRemove", e, item, {item: item, add: Add, keep: Keep, shrine: Shrine});
							}
						}
					}
					KinkyDungeonSendEvent("afterRemove", {item: item, add: Add, keep: Keep, shrine: Shrine});
				}

				KinkyDungeonCalculateSlowLevel();
				KinkyDungeonCheckClothesLoss = true;

				KinkyDungeonMultiplayerInventoryFlag = true;
				KinkyDungeonUpdateStruggleGroups();

			}
			KinkyDungeonCancelFlag = false;
			return true;
		}
	}
	return false;
}

function KinkyDungeonRestraintList() {
	let ret = [];

	for (let inv of KinkyDungeonInventory) {
		if (inv.restraint) {
			ret.push(inv);
		}
	}

	return ret;
}

function KinkyDungeonRestraintTypes(ShrineFilter) {
	let ret = [];

	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.shrine) {
			for (let shrine of inv.restraint.shrine) {
				if (ShrineFilter.includes(shrine) && !ret.includes(shrine)) ret.push(shrine);
			}
		}
	}

	return ret;
}



function KinkyDungeonLinkItem(newRestraint, oldItem, tightness, Lock, Keep) {
	if (newRestraint && oldItem && oldItem.restraint) {
		let oldLock = [];
		let oldTightness = [];
		let dynamicLink = [];
		if (oldItem.oldLock) oldLock = oldItem.oldLock;
		if (oldItem.oldTightness) oldTightness = oldItem.oldTightness;
		if (oldItem.dynamicLink) dynamicLink = oldItem.dynamicLink;
		let olock = oldItem.lock ? oldItem.lock : "";
		let oldtight = oldItem.tightness ? oldItem.tightness : 0;
		let oldlink = oldItem.restraint.name;
		oldLock.push(olock);
		oldTightness.push(oldtight);
		dynamicLink.push(oldlink);
		if (newRestraint) {
			KinkyDungeonAddRestraint(newRestraint, tightness, true, Lock, Keep, true);
			let newItem = KinkyDungeonGetRestraintItem(newRestraint.Group);
			if (newItem) newItem.oldLock = oldLock;
			if (newItem) newItem.oldTightness = oldTightness;
			if (newItem) newItem.dynamicLink = dynamicLink;
			if (oldItem.restraint.Link)
				KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonLink" + oldItem.restraint.name), "red", 2);
			return true;
		}
	}
	return false;
}

function KinkyDungeonUnLinkItem(item, Keep) {
	//if (!data.add && !data.shrine)
	if (item.restraint) {
		let UnLink = "";
		let dynamic = false;
		if (item.dynamicLink && item.dynamicLink.length > 0) {
			UnLink = item.dynamicLink[item.dynamicLink.length - 1];
			dynamic = true;
		}
		if (UnLink) {
			let newRestraint = KinkyDungeonGetRestraintByName(UnLink);
			let oldLock = "";
			let oldTightness = 0;
			if (item.oldLock && item.oldLock.length > 0) {
				oldLock = item.oldLock[item.oldLock.length - 1];
			}
			if (item.oldTightness && item.oldTightness.length > 0) {
				oldTightness = item.oldTightness[item.oldTightness.length - 1];
			}
			if (newRestraint) {
				if (item.dynamicLink && dynamic)
					item.dynamicLink.splice(item.dynamicLink.length-1, 1);
				if (item.oldLock)
					item.oldLock.splice(item.oldLock.length-1, 1);
				if (item.oldTightness)
					item.oldTightness.splice(item.oldTightness.length-1, 1);
				KinkyDungeonAddRestraint(newRestraint, oldTightness, true, oldLock ? oldLock : "", Keep);
				let res = KinkyDungeonGetRestraintItem(newRestraint.Group);
				if (res && res.restraint && item.dynamicLink && item.dynamicLink.length > 0) {
					res.dynamicLink = item.dynamicLink;
				}
				if (res && res.restraint && item.oldLock && item.oldLock.length > 0) {
					res.oldLock = item.oldLock;
				}
				if (res && res.restraint && item.oldTightness && item.oldTightness.length > 0) {
					res.oldTightness = item.oldTightness;
				}
				if (item.restraint.UnLink)
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnLink" + item.restraint.name), "lightgreen", 2);
				else
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnLink"), "lightgreen", 2);
				return true;
			}
		}
	}
	return false;
}
