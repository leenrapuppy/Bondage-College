"use strict";

let KinkyDungeonFactionColors = {
	"Jail": ["#8A120C"],
	"Slime": ["#9B49BD"],
};

/** Hidden factions do not auto-rep change when you attack them */
let KinkyDungeonHiddenFactions = [
	"Player",
	"Enemy",
	"Jail",
	"Prisoner",
	"Beast",
	"Slime",
	"KinkyConstruct",
];

let KinkyDungeonFactionRelationsBase = {
	"Player": {
		Enemy: -1.0,
		Jail: -1.0,
		Prisoner: 0.1,

		// Wild factions
		KinkyConstruct: -0.9,
		Slime: -1.0,
		Beast: -0.6,

		// Mainline factions
		Bountyhunter: -0.35,
		Bandit: -0.7,
		Alchemist: -0.25,
		Nevermere: -0.1,
		Apprentice: 0.1,
		Dressmaker: -0.45,
		Witch: -0.8,
		Elemental: -0.6,
		Dragon: 0.1,
		Maidforce: -0.06,
		Bast: -0.6,
		Elf: -0.26,
		Mushy: -0.64,
		AncientRobot: -0.45,
	},
	"Enemy": {
	},
	"Prisoner": {
	},
	"Jail": {
	},
	"Slime": {
		Jail: -0.25,

		Bountyhunter: -0.5,
		Bandit: -0.6,
		Alchemist: -0.8,
		Nevermere: -0.55,
		Apprentice: -0.4,
		Dressmaker: -0.4,
		Witch: 0.4,
		Elemental: -0.4,
		Dragon: -1.0,
		Maidforce: -1.0,
		Bast: -0.1,
		Elf: -0.1,
		Mushy: 0.1,
		AncientRobot: -1.0,
	},
	"Beast": {
		Jail: -0.25,

		Bountyhunter: -0.4,
		Bandit: -0.4,
		Alchemist: -0.4,
		Nevermere: -0.4,
		Apprentice: -0.4,
		Dressmaker: -0.4,
		Witch: -0.55,
		Elemental: -0.4,
		Dragon: -1.0,
		Maidforce: -0.4,
		Mushy: -0.4,
		AncientRobot: -1.0,
	},
	"KinkyConstruct": {
		Jail: -0.25,
	},
	"Nevermere": {
		"Alchemist": 1.0,
		"Elf": -1.0,
		"Bast": -0.55,
		"Mushy": -0.4,
		"Bandit": 0.3,
		"Witch": 0.15,
		"Apprentice": 0.15,
		"AncientRobot": -0.3,
	},
	"Alchemist": {
		"Bandit": 0.15,
	},
	"Bountyhunter": {
		"Jail": 0.8,
		"Dragon": 0.15,
		"Bandit": -0.4,
		"Maidforce": -0.15,
		"Witch": -0.4,
		"Dressmaker": 0.4,
		"Nevermere": 0.55,
	},
	"Elf": {
		"Mushy": 1.0,
		"Beast": 1.0,
	},
	"Bast": {
		"Elf": -1.0,
		"Witch": -0.4,
		"Beast": 0.4,
	},
	"Bandit": {
		"Mushy": -0.6,
	},
	"Elemental": {
		"Witch": 0.4,
		"Dressmaker": 0.15,
		"Apprentice": 1.0,
		"Bandit": -0.15,
		"Elf": -0.5,
		"Bast": -0.35,
		"Dragon": -0.5,
		"AncientRobot": -0.15,
	},
	"AncientRobot": {
		"Bast": 0.4,
		"Elf": -0.6,
		"Maidforce": 0.4,
		"Dragon": 0.4,
		"Dressmaker": 0.4,
		"Apprentice": 0.4,
	},
	"Dragon": {
		"Jail": 1.0,
		"Apprentice": 0.4,
		"Bandit": -0.6,
		"Witch": -0.4,
		"Alchemist": -0.15,
		"Beast": -1.0,
		"Mushy": 0.1,
	},
	"Mushy": {
	},
	"Witch": {
		"Apprentice": 1.0,
		"Dressmaker": 0.35,
	},
	"Dressmaker": {
		"Apprentice": 1.0,
		"Nevermere": 0.6,
	},
	"Apprentice": {
		"Jail": 1.0,
	},
	"Maidforce": {
		"Alchemist": 1.0,
		"Jail": 1.0,
		"Nevermere": 1.0,
		"Dragon": 1.0,
		"Elf": 1.0,
		"Apprentice": 1.0,
		"Bandit": -0.6,
		"Witch": -0.4,
	},
};

let KinkyDungeonFactionRelations = Object.assign({}, KinkyDungeonFactionRelationsBase);

function KDFactionRelation(a, b) {
	if (a == "Rage" || b == "Rage") return -1.0;
	if (a == b) return 1.0;
	if (KDFactionRelations.get(a) && KDFactionRelations.get(a).get(b)) {
		return KDFactionRelations.get(a).get(b);
	}
	return 0.0;
}

/**
 * @type {Map<string, Map<string, number>>};
 */
let KDFactionRelations = new Map();

function KDInitFactions(Reset) {
	if (Reset) KinkyDungeonFactionRelations = Object.assign({}, KinkyDungeonFactionRelationsBase);
	KDFactionRelations = new Map();
	// For each faction in faction relations we create all the maps
	for (let f1 of Object.entries(KinkyDungeonFactionRelations)) {
		let fmap = new Map();

		KDFactionRelations.set(f1[0], fmap);
	}
	// Next we create the faction relationships
	for (let f1 of Object.entries(KinkyDungeonFactionRelations)) {
		let fmap = KDFactionRelations.get(f1[0]);
		for (let f2 of Object.entries(f1[1])) {
			// Set mutual opinions
			fmap.set(f2[0], f2[1]);
			KDFactionRelations.get(f2[0]).set(f1[0], f2[1]);
		}
	}
}

/**
 * Sets faction relation and refreshes the map
 * @param {string} a
 * @param {string} b
 * @param {number} relation
 */
function KDSetFactionRelation(a, b, relation) {
	if (a == "Rage" || b == "Rage") return;
	if (KinkyDungeonFactionRelations[a])
		KinkyDungeonFactionRelations[a][b] = Math.max(-1, Math.min(1, relation));
	if (KinkyDungeonFactionRelations[b])
		KinkyDungeonFactionRelations[b][a] = Math.max(-1, Math.min(1, relation));
	KDInitFactions();
}

/**
 * Changes faction relation and refreshes the map
 * @param {string} a
 * @param {string} b
 * @param {number} amount
 */
function KDChangeFactionRelation(a, b, amount) {
	if (a == "Rage" || b == "Rage") return;
	if (!KinkyDungeonFactionRelations[a]) KinkyDungeonFactionRelations[a] = KinkyDungeonFactionRelationsBase[a];
	if (!KinkyDungeonFactionRelations[b]) KinkyDungeonFactionRelations[b] = KinkyDungeonFactionRelationsBase[b];

	if (KinkyDungeonFactionRelations[a]) {
		if (!KinkyDungeonFactionRelations[a][b] && KinkyDungeonFactionRelations[b][a])
			KinkyDungeonFactionRelations[a][b] = KinkyDungeonFactionRelations[b][a];
		else if (!KinkyDungeonFactionRelations[a][b]) KinkyDungeonFactionRelations[a][b] = 0;
		KinkyDungeonFactionRelations[a][b] = Math.max(-1, Math.min(1, KinkyDungeonFactionRelations[a][b] + amount));
	}

	if (KinkyDungeonFactionRelations[b]) {
		if (!KinkyDungeonFactionRelations[b][a] && KinkyDungeonFactionRelations[a][b])
			KinkyDungeonFactionRelations[b][a] = KinkyDungeonFactionRelations[a][b];
		else if (!KinkyDungeonFactionRelations[b][a]) KinkyDungeonFactionRelations[b][a] = 0;
		KinkyDungeonFactionRelations[b][a] = Math.max(-1, Math.min(1, KinkyDungeonFactionRelations[b][a] + amount));
	}
	KDInitFactions();
}