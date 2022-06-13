"use strict";

let KDCategoriesStart = [
	{name: "Restraints", buffs: [], debuffs: [],},
	{name: "Kinky", buffs: [], debuffs: [],},
	{name: "Combat", buffs: [], debuffs: [],},
	{name: "Magic", buffs: [], debuffs: [],},
	{name: "Enemies", buffs: [], debuffs: [],},
	{name: "Map", buffs: [], debuffs: [],},
	{name: "Start", buffs: [], debuffs: [],},
	{name: "Boss", buffs: [], debuffs: [],},
];

let KinkyDungeonStatsPresets = {
	"Strong": {category: "Restraints", id: 0, cost: 2, block: ["Weak"]},
	"Weak": {category: "Restraints", id: 1, cost: -1, block: ["Strong"]},
	"Flexible": {category: "Restraints", id: 2, cost: 2, block: ["Inflexible"]},
	"Inflexible": {category: "Restraints", id: 3, cost: -1, block: ["Flexible"]},
	"Locksmith": {category: "Restraints", id: 4, cost: 2, block: ["Clueless"]},
	"Clueless": {category: "Restraints", id: 5, cost: -1, block: ["Locksmith"]},
	"HighSecurity": {category: "Restraints", id: 48, cost: -1},
	"ShoddyKnives": {category: "Restraints", id: 49, cost: -1},
	"SearchParty": {category: "Enemies", id: 51, cost: -1},
	"NoWayOut": {category: "Restraints", id: 52, cost: -1},
	"TightRestraints": {category: "Restraints", id: 54, cost: -1},
	"Unchained": {category: "Kinky", id: 26, cost: 2, block: ["Damsel"]},
	"Damsel": {category: "Kinky", id: 27, cost: -1, block: ["Unchained"]},
	"Artist": {category: "Kinky", id: 28, cost: 2, block: ["Bunny"]},
	"Bunny": {category: "Kinky", id: 29, cost: -1, block: ["Artist"]},
	"Slippery": {category: "Kinky", id: 30, cost: 2, block: ["Doll"]},
	"Doll": {category: "Kinky", id: 31, cost: -1, block: ["Slippery"]},
	"Escapee": {category: "Kinky", id: 32, cost: 2, block: ["Dragon"]},
	"Dragon": {category: "Kinky", id: 33, cost: -1, block: ["Escapee"]},
	"Dodge": {category: "Combat", id: 18, cost: 3, block: ["Distracted"]},
	"Distracted": {category: "Combat", id: 19, cost: -1, block: ["Dodge"]},
	"Submissive": {category: "Kinky", id: 10, cost: 0},
	"Wanted": {category: "Kinky", id: 11, cost: -1},
	"QuickDraw": {category: "Combat", id: 55, cost: 2, block: ["Disorganized"]},
	"Disorganized": {category: "Combat", id: 57, cost: -2, block: ["QuickDraw", "QuickScribe"]},
	"Rigger": {category: "Combat", id: 24, cost: 1},
	"Pacifist": {category: "Combat", id: 25, cost: -2},
	"Brawler": {category: "Combat", id: 20, cost: 1},
	"Clumsy": {category: "Combat", id: 21, cost: -1},
	"HeelWalker": {category: "Combat", id: 53, cost: 1},
	"BondageLover": {category: "Kinky", id: 15, cost: -1},
	"BoundPower": {category: "Combat", id: 40, cost: 3},
	"KillSquad": {category: "Enemies", id: 41, cost: -3, block: ["Conspicuous"]},
	"Stealthy": {category: "Enemies", id: 38, cost: 0},
	"Conspicuous": {category: "Enemies", id: 39, cost: -1, block: ["KillSquad"]},
	"Dominant": {category: "Map", id: "Dominant", cost: 2, block: ["Oppression"]},
	"Oppression": {category: "Map", id: 50, cost: -1, block: ["Dominant"]},
	"Supermarket": {category: "Map", id: 42, cost: 1},
	"PriceGouging": {category: "Map", id: 43, cost: -2},
	"Psychic": {category: "Restraints", id: 6, cost: 4},
	"Slayer": {category: "Magic", id: 34, cost: 5},
	"Narcoleptic": {category: "Combat", id: 37, cost: -4},
	"Magician": {category: "Magic", id: 36, cost: 5},
	"Pristine": {category: "Map", id: 22, cost: -1},
	"Conjurer": {category: "Magic", id: 35, cost: 5},
	"LostTechnology": {category: "Map", id: 23, cost: -1},
	"Blessed": {category: "Map", id: 8, cost: 3},
	"Cursed": {category: "Enemies", id: 9, cost: -3},
	"Studious": {category: "Magic", id: 12, cost: 1},
	"Novice": {category: "Magic", id: 7, cost: -1},
	"Meditation": {category: "Magic", id: 13, cost: 2},
	"QuickScribe": {category: "Magic", id: 56, cost: 2, block: ["Disorganized"]},
	"FuukaCollar": {category: "Boss", id: "FuukaCollar", cost: -3, locked: true},
	"BerserkerRage": {category: "Combat", id: "BerserkerRage", cost: 3},
	"UnstableMagic": {category: "Magic", id: "UnstableMagic", cost: 2},
	"Vengeance": {category: "Enemies", id: "Vengeance", cost: -1},
	"AbsoluteFocus": {category: "Magic", id: "AbsoluteFocus", cost: -1},

	"StartMaid": {category: "Start", id: "StartMaid", cost: -3, outfit: "Maid", block: ["StartLatex", "StartWolfgirl", "StartObsidian"]},
	"StartLatex": {category: "Start", id: "StartLatex", cost: -1, outfit: "BlueSuitPrison", block: ["StartMaid", "StartWolfgirl", "StartObsidian"]},
	"StartWolfgirl": {category: "Start", id: "StartWolfgirl", cost: -2, outfit: "Wolfgirl", block: ["StartMaid", "StartLatex", "StartObsidian"]},
	"StartObsidian": {category: "Start", id: "StartObsidian", cost: -2, outfit: "Obsidian", block: ["StartMaid", "StartLatex", "StartWolfgirl"]},

	"Nowhere": {category: "Enemies", id: "Nowhere", cost: -1},
	"Prisoner": {category: "Start", id: "Prisoner", cost: 0},

	"Panic": {category: "Map", id: "Panic", cost: -1},

	"Rusted": {category: "Map", id: "Rusted", cost: 1},
	"Unmasked": {category: "Kinky", id: "Unmasked", cost: 0},

	"Quickness": {category: "Combat", id: "Quickness", cost: 2},

	"BoundCrusader": {category: "Kinky", id: "BoundCrusader", cost: -1},

	"Trespasser": {category: "Map", id: "Trespasser", cost: -2},




	//"FreeSpirit": {id: 44, cost: 0, block: "Unchaste", distractionMode: true},
	//"Deprived": {id: 45, cost: 0, block: "Purity", distractionMode: true},
	//"Purity": {id: 16, cost: 2, block: "Deprived", distractionMode: true},
	//"Unchaste": {id: 17, cost: -1, block: "FreeSpirit", distractionMode: true},
};

function KinkyDungeonGetStatPoints(Stats) {
	let total = 0;
	for (let k of Stats.keys()) {
		if (Stats.get(k)) {
			if (KinkyDungeonStatsPresets[k]) {
				total -= KinkyDungeonStatsPresets[k].cost;
			}
		}
	}
	return total;
}

function KinkyDungeonCanPickStat(Stat) {
	let stat = KinkyDungeonStatsPresets[Stat];
	if (!stat) return false;
	if (stat.cost > 0 && KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice) < stat.cost) return false;
	for (let k of KinkyDungeonStatsChoice.keys()) {
		if (KinkyDungeonStatsChoice.get(k)) {
			if (KinkyDungeonStatsPresets[k] && KinkyDungeonStatsPresets[k].block && KinkyDungeonStatsPresets[k].block.includes(Stat)) {
				return false;
			}
		}
	}
	return true;
}
function KinkyDungeonCanUnPickStat(Stat) {
	let stat = KinkyDungeonStatsPresets[Stat];
	if (!stat) return false;
	if (stat.cost < 0 && KinkyDungeonGetStatPoints(KinkyDungeonStatsChoice) < -stat.cost) return false;
	for (let k of KinkyDungeonStatsChoice.keys()) {
		if (KinkyDungeonStatsChoice.get(k)) {
			if (KinkyDungeonStatsPresets[k] && KinkyDungeonStatsPresets[k].require == Stat) {
				return false;
			}
		}
	}
	return true;
}
