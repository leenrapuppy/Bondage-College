"use strict";

let KinkyDungeonTrapMoved = false;

function KinkyDungeonHandleStepOffTraps(x, y, moveX, moveY) {
	let flags = {
		AllowTraps: true,
	};
	let tile = KinkyDungeonTiles.get(x + "," + y);
	if (tile && tile.StepOffTrap && (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
		if (!tile.StepOffTiles || tile.StepOffTiles.includes(moveX + "," + moveY)) {
			KinkyDungeonSendEvent("beforeStepOffTrap", {x:x, y:y, tile: tile, flags: flags});
			let msg = "";
			let color = "red";
			let lifetime = tile.Lifetime ? tile.Lifetime : undefined;

			if (tile.StepOffTrap == "DoorLock" && KinkyDungeonNoEnemy(x, y)) {
				KinkyDungeonMapSet(x, y, 'D');
				let spawned = 0;
				let maxspawn = 1 + Math.round(Math.min(2 + KDRandom() * 2, KinkyDungeonDifficulty/25) + Math.min(2 + KDRandom() * 2, 0.5*MiniGameKinkyDungeonLevel/KDLevelsPerCheckpoint));
				if (tile.SpawnMult) maxspawn *= tile.SpawnMult;
				let requireTags = ["doortrap"];

				let tags = ["doortrap"];
				KinkyDungeonAddTags(tags, MiniGameKinkyDungeonLevel);

				for (let i = 0; i < 30; i++) {
					if (spawned < maxspawn) {
						let Enemy = KinkyDungeonGetEnemy(
							tags, MiniGameKinkyDungeonLevel,
							KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint],
							'0', requireTags, true);
						if (Enemy) {
							KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, Enemy.name, 1, 7, true, undefined, undefined, true, "Ambush", true, 1.5);
							if (Enemy.tags.has("minor")) spawned += 0.4;
							else spawned += 1;
						}
					}
				}
				if (spawned > 0) {
					KinkyDungeonMapSet(x, y, 'd');
					let created = KinkyDungeonSummonEnemy(x, y, "DoorLock", 1, 0, false, lifetime);
					if (created > 0) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/MagicSlash.ogg");
						msg = "Default";
						KinkyDungeonMakeNoise(12, x, y);
						KinkyDungeonTiles.delete(x + "," + y);
						KinkyDungeonMapSet(x, y, 'D');
					}
				} else
					KinkyDungeonMapSet(x, y, 'd');
			}

			if (msg) {
				KDTrigPanic();

				if (msg == "Default")
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonTrap" + tile.StepOffTrap), color, 2);
				else
					KinkyDungeonSendTextMessage(10, msg, color, 2);
			}
		}
	}

}

function KinkyDungeonHandleTraps(x, y, Moved) {
	let flags = {
		AllowTraps: true,
	};
	let tile = KinkyDungeonTiles.get(x + "," + y);
	if (tile && tile.Type == "Trap" && (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
		KinkyDungeonSendEvent("beforeTrap", {x:x, y:y, tile: tile, flags: flags});
		if (flags.AllowTraps && Moved) {
			let msg = "";
			let color = "red";
			if (KinkyDungeonStatsChoice.has("Rusted") && KDRandom() < 0.25) {
				msg = TextGet("KDTrapMisfire");
			} else {
				if (tile.Trap === "SpawnEnemies") {
					let radius = tile.Power > 4 ? 4 : 2;
					let created = KinkyDungeonSummonEnemy(x, y, tile.Enemy, tile.Power, radius, true, undefined, undefined, true, "Ambush", true, 1.5);
					if (created > 0) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
						msg = TextGet("KinkyDungeonTrapSpawn" + tile.Enemy);
						KinkyDungeonTiles.delete(x + "," + y);
						if (!tile.noSmoke) {
							KDSmokePuff(x, y, 1.9, 0.5);
						}
					}
				}
				if (tile.Trap == "SpecificSpell") {
					let spell = KinkyDungeonFindSpell(tile.Spell, true);
					if (spell) {
						let xx = 0;
						let yy = 0;
						if (!tile.noVary) {
							for (let i = 0; i < 10; i++) {
								xx = Math.floor(KDRandom() * 3 - 1);
								yy = Math.floor(KDRandom() * 3 - 1);
								if (xx != 0 || yy != 0) i = 1000;
							}
						}
						KinkyDungeonCastSpell(x + xx, y + yy, spell, undefined, undefined, undefined, "Trap");
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
						msg = ""; // The spell will show a message on its own
						KinkyDungeonTiles.delete(x + "," + y);
						if (!tile.noSmoke) {
							KDSmokePuff(x, y, 1.9, 0.5);
						}
					}
				}
				if (tile.Trap == "BarrelTrap") {
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("BarrelTrap"), 0, true);
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
					msg = TextGet("KDBarrelTrap");
					KinkyDungeonTiles.delete(x + "," + y);
					KinkyDungeonMakeNoise(10, x, y);
				}
				if (tile.Trap == "BedTrap") {
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("BedTrap"), 0, true);
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
					msg = TextGet("KDBedTrap");
					KinkyDungeonTiles.delete(x + "," + y);
					KinkyDungeonMakeNoise(10, x, y);
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
								msg = "KinkyDungeonSpellCast" + spell.name;
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
			}
			if (msg) {
				KDTrigPanic();

				if (msg == "Default")
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonTrap" + tile.Trap), color, 2 + KinkyDungeonSlowMoveTurns);
				else
					KinkyDungeonSendTextMessage(10, msg, color, 2 + KinkyDungeonSlowMoveTurns);
			}
		}
	}

	KinkyDungeonTrapMoved = false;
}

function KDTrigPanic() {
	if (KinkyDungeonStatsChoice.has("Panic")) {
		KinkyDungeonSendActionMessage(10, TextGet("KDPanic"), "red", 3);
		KinkyDungeonSlowMoveTurns = Math.max(KinkyDungeonSlowMoveTurns, 2);
	}
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


function KDSmokePuff(x, y, radius, density) {
	KinkyDungeonSendTextMessage(2, TextGet("KDSmokePuff"), "white", 2);
	for (let X = x - Math.floor(radius); X <= x + Math.floor(radius); X++)
		for (let Y = y - Math.floor(radius); Y <= y + Math.floor(radius); Y++) {
			if ((!density || KDRandom() < density || (X == x && Y == Y)) && KDistEuclidean(X - x, Y - y) <= radius) {
				let spell = KinkyDungeonFindSpell("SmokePuff", true);
				if (spell) {
					KinkyDungeonCastSpell(X, Y, spell, undefined, undefined, undefined);
				}
			}
		}
}