"use strict";

let KinkyDungeonTrapMoved = false;

function KinkyDungeonHandleTraps(x, y, Moved) {
	let tile = KinkyDungeonTiles[x + "," + y];
	if (tile && tile.Type == "Trap") {
		let msg = "";
		let color = "red";
		if (tile.Trap == "Skeletons") {
			let created = KinkyDungeonSummonEnemy(x, y, "SummonedSkeleton", tile.Power, 4);
			if (created > 0) {
				AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		} else if (tile.Trap == "Bandits") {
			let created = KinkyDungeonSummonEnemy(x, y, "Bandit", tile.Power, 2);
			if (created > 0) {
				AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		}
		if (msg) {
			if (msg == "Default")
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonTrap" + tile.Trap), color, 2);
			else
				KinkyDungeonSendTextMessage(10, msg, color, 2);
		}
	}

	KinkyDungeonTrapMoved = false;
}

function KinkyDungeonGetTrap(trapTypes, Level, tags) {

	var trapWeightTotal = 0;
	var trapWeights = [];

	for (let L = 0; L < trapTypes.length; L++) {
		var trap = trapTypes[L];
		let effLevel = Level;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (effLevel >= trap.Level) {
			trapWeights.push({trap: trap, weight: trapWeightTotal});
			let weight = trap.Weight + weightBonus;
			if (trap.terrainTags)
				for (let T = 0; T < tags.length; T++)
					if (trap.terrainTags[tags[T]]) weight += trap.terrainTags[tags[T]];

			trapWeightTotal += Math.max(0, weight*weightMulti);

		}
	}

	var selection = Math.random() * trapWeightTotal;

	for (let L = trapWeights.length - 1; L >= 0; L--) {
		if (selection > trapWeights[L].weight) {
			return {Name: trapWeights[L].trap.Name, Power: trapWeights[L].trap.Power};
		}
	}

}