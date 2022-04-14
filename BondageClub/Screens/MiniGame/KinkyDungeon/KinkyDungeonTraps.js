"use strict";

let KinkyDungeonTrapMoved = false;


function KinkyDungeonHandleTraps(x, y, Moved) {
	let flags = {
		AllowTraps: true,
	};
	let tile = KinkyDungeonTiles.get(x + "," + y);
	if (tile && tile.Type == "Trap" && (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
		KinkyDungeonSendEvent("beforeTrap", {x:x, y:y, tile: tile, flags: flags});
		if (flags.AllowTraps) {
			let msg = "";
			let color = "red";
			if (tile.Trap === "SpawnEnemies") {
				let radius = tile.Power > 4 ? 4 : 2;
				let created = KinkyDungeonSummonEnemy(x, y, tile.Enemy, tile.Power, radius);
				if (created > 0) {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
					msg = TextGet("KinkyDungeonTrapSpawn" + tile.Enemy);
					KinkyDungeonTiles.delete(x + "," + y);
				}
			}
			if (tile.Trap == "SpecificSpell") {
				let spell = KinkyDungeonFindSpell(tile.Spell, true);
				if (spell) {
					KinkyDungeonCastSpell(x, y, spell, undefined, undefined, undefined);
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
					msg = ""; // The spell will show a message on its own
					KinkyDungeonTiles.delete(x + "," + y);
				}
			}
			if (tile.Trap === "CustomSleepDart") {
				let spell = KinkyDungeonFindSpell("TrapSleepDart", true);
				if (spell) {
					// Search any tile 4 tiles up or down that have Line of Sight to the player
					let startX = x;
					let startY = y;
					let possible_coords = [
						{x: -4, y: 0}, {x: 4, y: 0}, {x: 0, y: -4}, {x: 0, y: 4},
						{x: -3, y: 0}, {x: 3, y: 0}, {x: 0, y: -3}, {x: 0, y: 3},
						{x: -2, y: 0}, {x: 2, y: 0}, {x: 0, y: -2}, {x: 0, y: 2},
					];
					let success = false;
					for (let coord of possible_coords) {
						if (KinkyDungeonCheckProjectileClearance(startX + coord.x, startY + coord.y, startX, startY)) {
							startX += coord.x;
							startY += coord.y;
							success = true;
							break;
						}
					}
					if (success) {
						// We fire the dart
						let player = KinkyDungeonEnemyAt(x, y) ? KinkyDungeonEnemyAt(x, y) : KinkyDungeonPlayerEntity;
						KinkyDungeonCastSpell(x, y, spell, { x: startX, y: startY }, player, undefined);
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
						msg = ""; // We don't want to warn the player about what just happened
						KinkyDungeonTiles.delete(x + "," + y);
					} else {
						// We do sleep gas instead
						spell = KinkyDungeonFindSpell("SleepGas", true);
						if (spell) {
							KinkyDungeonCastSpell(x, y, spell, undefined, undefined, undefined);
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
							msg = ""; // The spell will show a message on its own
							KinkyDungeonTiles.delete(x + "," + y);
						}
					}
				}
			}
			if (tile.Trap === "CustomVine") {
				let restraint = KinkyDungeonGetRestraintByName("VinePlantFeet");
				if (restraint) {
					KDSendStatus('bound', tile.Trap, "trap");
					KinkyDungeonAddRestraintIfWeaker(restraint, tile.Power, false);
				}
				let created = KinkyDungeonSummonEnemy(x, y, "VinePlant", tile.Power, 1);
				if (created > 0) {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
					msg = "Default";
					KinkyDungeonTiles.delete(x + "," + y);
				}
			}
			if (msg) {
				if (msg == "Default")
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonTrap" + tile.Trap), color, 2);
				else
					KinkyDungeonSendTextMessage(10, msg, color, 2);
			}
		}
	}

	KinkyDungeonTrapMoved = false;
}

function KinkyDungeonGetGoddessTrapTypes() {
	let trapTypes = [];
	if (KinkyDungeonGoddessRep.Rope < KDANGER) {
		trapTypes.push({ Name: "SpecificSpell", Spell: "TrapRopeWeak", Level: 0, Power: 3, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Ninja", Level: 0, Power: 3, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Rope < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "RopeKraken", Level: 0, Power: 1, Weight: 10 });
		trapTypes.push({ Name: "SpecificSpell", Spell: "TrapRopeStrong", Level: 0, Power: 3, Weight: 40 });
	}
	if (KinkyDungeonGoddessRep.Leather < KDANGER) {
		trapTypes.push({ Name: "SpecificSpell", Spell: "TrapLeatherWeak", Level: 0, Power: 3, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Dragon", Level: 0, Power: 3, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Leather < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "DragonLeader", Level: 0, Power: 2, Weight: 50 });
	}
	if (KinkyDungeonGoddessRep.Metal < KDANGER) {
		trapTypes.push({ Name: "SpecificSpell", Spell: "TrapCableWeak", Level: 0, Power: 3, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Drone", Level: 0, Power: 3, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Metal < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Wolfgirl", Level: 0, Power: 3, Weight: 50 });
	}
	if (KinkyDungeonGoddessRep.Latex < KDANGER) {
		trapTypes.push({ Name: "SpecificSpell", Spell: "TrapSlimeWeak", Level: 0, Power: 3, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Alkahestor", Level: 0, Power: 1, Weight: 5 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "SmallSlime", Level: 0, Power: 6, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Latex < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "SlimeEnthusiast", Level: 0, Power: 2, Weight: 20 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "BigSlime", Level: 0, Power: 3, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalLatex", Level: 0, Power: 2, Weight: 20 });
	}
	if (KinkyDungeonGoddessRep.Elements < KDANGER) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalFire", Level: 0, Power: 2, Weight: 5 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalIce", Level: 0, Power: 2, Weight: 5 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalWater", Level: 0, Power: 2, Weight: 5 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalEarth", Level: 0, Power: 2, Weight: 5 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalAir", Level: 0, Power: 2, Weight: 5 });
	}
	if (KinkyDungeonGoddessRep.Elements < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalFire", Level: 0, Power: 4, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalIce", Level: 0, Power: 4, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalWater", Level: 0, Power: 4, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalEarth", Level: 0, Power: 4, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ElementalAir", Level: 0, Power: 4, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Conjure < KDANGER) {
		trapTypes.push({ Name: "SpecificSpell", Spell: "TrapMagicChainsWeak", Level: 0, Power: 3, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "TickleHand", Level: 0, Power: 6, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Conjure < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Conjurer", Level: 0, Power: 1, Weight: 25 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "ConjurerTickler", Level: 0, Power: 1, Weight: 25 });
	}
	if (KinkyDungeonGoddessRep.Illusion < KDANGER) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Maidforce", Level: 0, Power: 3, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "MaidforcePara", Level: 0, Power: 2, Weight: 10 });
	}
	if (KinkyDungeonGoddessRep.Illusion < KDRAGE) {
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "Maidforce", Level: 0, Power: 4, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "MaidforcePara", Level: 0, Power: 3, Weight: 15 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "MaidforceMafia", Level: 0, Power: 3, Weight: 10 });
		trapTypes.push({ Name: "SpawnEnemies", strict: true,Enemy: "MaidforceHead", Level: 0, Power: 1, Weight: 10 });
	}

	return trapTypes;
}

function KinkyDungeonGetTrap(trapTypes, Level, tags) {

	let trapWeightTotal = 0;
	let trapWeights = [];

	for (let trap of trapTypes) {
		let effLevel = Level;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (effLevel >= trap.Level) {
			trapWeights.push({trap: trap, weight: trapWeightTotal});
			let weight = trap.Weight + weightBonus;
			if (trap.terrainTags)
				for (let tag of tags)
					if (trap.terrainTags[tag]) weight += trap.terrainTags[tag];

			trapWeightTotal += Math.max(0, weight*weightMulti);

		}
	}

	let selection = KDRandom() * trapWeightTotal;

	for (let L = trapWeights.length - 1; L >= 0; L--) {
		if (selection > trapWeights[L].weight) {
			return {
				Name: trapWeights[L].trap.Name,
				Restraint: trapWeights[L].trap.Restraint,
				Enemy: trapWeights[L].trap.Enemy,
				Spell: trapWeights[L].trap.Spell,
				Power: trapWeights[L].trap.Power,
			};
		}
	}

}
