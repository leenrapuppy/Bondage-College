"use strict";

let bosses = {
	"Fuuka": {
		boss: "Fuuka",
		bossroom: true,
		width: 13,
		height: 13,
		setpieces: {
			"GuaranteedCell": 1000,
			"Altar": 10,
			"FuukaAltar": 10,
		},
		genType: "Chamber",
		spawns: false,
		chests: false,
		shrines: true,
		chargers: true,
		heart: false,
		specialtiles: true,
		shortcut: false,
		enemies: false,
		nokeys: true,
		nojail: false,
	}
};

function KinkyDungeonBossFloor(Floor) {
	if (Floor == 6) return bosses.Fuuka;
	return null;
}
