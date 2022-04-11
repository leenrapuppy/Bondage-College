"use strict";



function KinkyDungeonAddTags(tags, Floor) {
	let security = (KinkyDungeonGoddessRep.Prisoner + 50);

	if (Floor % 6 >= 2 || KinkyDungeonDifficulty >= 20) tags.push("secondhalf");
	if (Floor % 6 >= 5 || KinkyDungeonDifficulty >= 40) tags.push("lastthird");

	let angeredGoddesses = [];

	if (KinkyDungeonGoddessRep.Rope < KDANGER) angeredGoddesses.push({tag: "ropeAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Rope < KDRAGE) angeredGoddesses.push({tag: "ropeRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Leather < KDANGER) angeredGoddesses.push({tag: "leatherAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Leather < KDRAGE) angeredGoddesses.push({tag: "leatherRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Metal < KDANGER) angeredGoddesses.push({tag: "metalAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Metal < KDRAGE) angeredGoddesses.push({tag: "metalRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Latex < KDANGER) angeredGoddesses.push({tag: "latexAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Latex < KDRAGE) angeredGoddesses.push({tag: "latexRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Elements < KDANGER) angeredGoddesses.push({tag: "elementsAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Elements < KDRAGE) angeredGoddesses.push({tag: "elementsRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Conjure < KDANGER) angeredGoddesses.push({tag: "conjureAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Conjure < KDRAGE) angeredGoddesses.push({tag: "conjureRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Illusion < KDANGER) angeredGoddesses.push({tag: "illusionAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Illusion < KDRAGE) angeredGoddesses.push({tag: "illusionRage", type: "rope"});
	if (KinkyDungeonGoddessRep.Will < KDANGER) angeredGoddesses.push({tag: "willAnger", type: "rope"});
	if (KinkyDungeonGoddessRep.Will < KDRAGE) angeredGoddesses.push({tag: "willRage", type: "rope"});

	if (angeredGoddesses.length > 0) {
		let rage = false;
		for (let a of angeredGoddesses) {
			if (!rage && a.tag && a.tag.includes("Rage")) {
				rage = true;
				tags.push("goddessRage");
			}
		}
		for (let i = 0; i < 2; i++) {
			let tag = angeredGoddesses[Math.floor(angeredGoddesses.length * KDRandom())];
			if (tag && !tags.includes(tag.tag)) {
				for (let a of angeredGoddesses) {
					if (a.type == tag.type) {
						tags.push(a.tag);
					}
				}
			}
		}
		tags.push("goddessAnger");
	}


	let overrideTags = [];
	if (KinkyDungeonGoddessRep.Will < -45) {tags.push("plant"); tags.push("beast");}
	if (KinkyDungeonGoddessRep.Metal < -45) tags.push("robot");
	if (KinkyDungeonGoddessRep.Leather < -45) tags.push("bandit");
	if (KinkyDungeonGoddessRep.Illusion < -45) tags.push("ghost");
	if (KinkyDungeonGoddessRep.Conjure < -45) tags.push("witch");
	if (KinkyDungeonGoddessRep.Conjure < -45) tags.push("book");
	if (KinkyDungeonGoddessRep.Elements < -45) tags.push("elemental");
	if (KinkyDungeonGoddessRep.Latex < -45) tags.push("slime");
	if (KinkyDungeonGoddessRep.Rope < -45) tags.push("construct");

	if (security > 0) tags.push("jailbreak");
	if (security > 40) tags.push("highsecurity");

	return overrideTags;
}


function KinkyDungeonGetEnemy(tags, Level, Index, Tile, requireTags) {
	let enemyWeightTotal = 0;
	let enemyWeights = [];

	for (let enemy of KinkyDungeonEnemies) {
		let effLevel = Level + 25 * KinkyDungeonNewGame;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (enemy.shrines) {
			for (let shrine of enemy.shrines) {
				if (KinkyDungeonGoddessRep[shrine]) {
					let rep = KinkyDungeonGoddessRep[shrine];
					if (rep > 0) weightMulti *= Math.max(0, 1 - rep/100); // ranges from 1 to 0.5
					else if (rep < 0) {
						weightMulti = Math.max(weightMulti, Math.max(1, 1 - rep/100)); // ranges from 1 to 2
						weightBonus = Math.max(weightBonus, Math.min(10, -rep/10));
						//effLevel += -rep/2.5;
					}
				}
			}
		}

		let noOverride = ["boss", "miniboss", "elite", "minor"];
		let overrideFloor = false;
		for (let t of tags) {
			if (!noOverride.includes(t))
				if (enemy.tags.has(t)) {
					overrideFloor = true;
					weightMulti *= 1.25;
				}
		}

		if (effLevel >= enemy.minLevel && (overrideFloor || enemy.floors.get(Index)) && (KinkyDungeonGroundTiles.includes(Tile) || !enemy.tags.has("spawnFloorsOnly"))) {
			let rt = requireTags ? false : true;
			if (requireTags)
				for (let t of requireTags) {
					if (enemy.tags.has(t)) {rt = true; break;}
				}
			if (rt) {
				enemyWeights.push({enemy: enemy, weight: enemyWeightTotal});
				let weight = enemy.weight + weightBonus;
				if (enemy.terrainTags.increasingWeight)
					weight += enemy.terrainTags.increasingWeight * Math.floor(Level/KDLevelsPerCheckpoint);
				if (!enemy.terrainTags.grate && tags.includes("grate"))
					weight -= 1000;
				for (let tag of tags)
					if (enemy.terrainTags[tag]) weight += enemy.terrainTags[tag];

				if (weight > 0)
					enemyWeightTotal += Math.max(0, weight*weightMulti);
			}
		}
	}

	let selection = KDRandom() * enemyWeightTotal;

	for (let L = enemyWeights.length - 1; L >= 0; L--) {
		if (selection > enemyWeights[L].weight) {
			if (enemyWeights[L].enemy.name == "Mimic") console.log("Mimic says boo");
			return enemyWeights[L].enemy;
		}
	}
}

function KinkyDungeonCallGuard(x, y, noTransgress, normalDrops) {
	if (!noTransgress)
		KinkyDungeonJailTransgressed = true;
	if (!KinkyDungeonJailGuard()) {
		let Enemy = KinkyDungeonEnemies.find(element => element.name == "Guard");
		let guard = {summoned: true, noRep: true, noDrop: !normalDrops, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
			x:KinkyDungeonStartPosition.x, y:KinkyDungeonStartPosition.y, gx: x, gy: y,
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};
		KDGameData.KinkyDungeonJailGuard = guard.id;
		KinkyDungeonEntities.push(guard);
	} else {
		KinkyDungeonJailGuard().gx = x;
		KinkyDungeonJailGuard().gy = y;
	}
}

let KinkyDungeonTotalSleepTurns = 0;
let KinkyDungeonSearchTimer = 0;
let KinkyDungeonSearchTimerMin = 60;
let KinkyDungeonFirstSpawn = false;
let KinkyDungeonSearchStartAmount = 30;
let KinkyDungeonSearchHuntersAmount = 90;
let KinkyDungeonSearchEntranceAdjustAmount = 130;
let KinkyDungeonSearchEntranceChaseAmount = 160;

function KinkyDungeonHandleWanderingSpawns(delta) {
	let effLevel = MiniGameKinkyDungeonLevel + KinkyDungeonDifficulty;
	let HunterAdjust = KinkyDungeonDifficulty;
	let EntranceAdjust = KinkyDungeonDifficulty/2;
	let BaseAdjust = KinkyDungeonDifficulty/10;
	if (KinkyDungeonStatsChoice.get("Dragon")) {
		BaseAdjust *= 1.2;
		BaseAdjust += 20;
		HunterAdjust += 30;
		EntranceAdjust += 100;
		effLevel += 12;
	}
	let sleepTurnsSpeedMult = 100;
	let sleepTurnsPerExtraSpawnLevel = 25;
	let baseChance = ((KDGameData.SleepTurns > 0 && (KinkyDungeonStatStamina > KinkyDungeonStatStaminaMax - 10 * KinkyDungeonStatStaminaRegenSleep || KDGameData.SleepTurns < 11)) ? 0.05 : 0.0005) * Math.sqrt(Math.max(1, effLevel)) * (1 + KinkyDungeonTotalSleepTurns / sleepTurnsSpeedMult);
	// Chance of bothering with random spawns this turn
	if (delta > 0 && KDRandom() < baseChance && KinkyDungeonSearchTimer > KinkyDungeonSearchTimerMin) {
		let hunters = false;
		let spawnLocation = KinkyDungeonMapGet(KinkyDungeonStartPosition.x, KinkyDungeonStartPosition.y) == 'S' ? KinkyDungeonStartPosition : KinkyDungeonEndPosition;
		if (KinkyDungeonTotalSleepTurns > KinkyDungeonSearchStartAmount - BaseAdjust && KinkyDungeonEntities.length < Math.min(100, (KinkyDungeonInJail()) ? (5 + effLevel/15) : (20 + effLevel/KDLevelsPerCheckpoint))) {
			if (KinkyDungeonTotalSleepTurns > KinkyDungeonSearchHuntersAmount - HunterAdjust) hunters = true;
			if ((KinkyDungeonTotalSleepTurns > KinkyDungeonSearchEntranceAdjustAmount - EntranceAdjust && KDistChebyshev(KinkyDungeonPlayerEntity.x - KinkyDungeonEndPosition.x, KinkyDungeonPlayerEntity.y - KinkyDungeonEndPosition.y) > 5 && KDRandom() < 0.5)
				|| KDistChebyshev(KinkyDungeonPlayerEntity.x - KinkyDungeonStartPosition.x, KinkyDungeonPlayerEntity.y - KinkyDungeonStartPosition.y) < 5) spawnLocation = KinkyDungeonEndPosition;

			if (KinkyDungeonLightGet(spawnLocation.x, spawnLocation.y) < 1 || KinkyDungeonSeeAll) {
				KinkyDungeonSearchTimer = 0;
				let count = 0;
				let maxCount = (2 + Math.min(5, Math.round(MiniGameKinkyDungeonLevel/10))) * Math.sqrt(1 + KinkyDungeonTotalSleepTurns / sleepTurnsSpeedMult);
				if (KinkyDungeonStatsChoice.get("Dragon")) {
					maxCount *= 2;
				}
				// Spawn a killsquad!
				let tags = [];
				KinkyDungeonAddTags(tags, MiniGameKinkyDungeonLevel);
				tags.push("boss");

				let miniboss = false;
				let requireTags = ["search"];
				if (hunters) {
					requireTags.push("hunter");
					tags.push("secondhalf");
					if (KinkyDungeonTotalSleepTurns > KinkyDungeonSearchEntranceChaseAmount)
						tags.push("thirdhalf");
				}

				tags.push("bandit");

				let Enemy = KinkyDungeonGetEnemy(
					tags, MiniGameKinkyDungeonLevel + KinkyDungeonDifficulty/5 + Math.round(KinkyDungeonTotalSleepTurns / sleepTurnsPerExtraSpawnLevel),
					KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint],
					KinkyDungeonMapGet(spawnLocation.x, spawnLocation.y), requireTags);
				let EnemiesSummoned = [];
				// We are going to reroll the ghost decision just to provide some grace for players who are well and truly stuck
				KinkyDungeonMakeGhostDecision();
				while (Enemy && count < maxCount) {
					let point = KinkyDungeonGetNearbyPoint(spawnLocation.x, spawnLocation.y, true);
					if (point && (KinkyDungeonJailTransgressed || Enemy.tags.has("jail") || Enemy.tags.has("jailer"))) {
						let X = point.x;
						let Y = point.y;
						EnemiesSummoned.push(Enemy.name);
						KinkyDungeonEntities.push({tracking: true, summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(), x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
						if (Enemy.tags.has("minor")) count += 0.1; else count += 1; // Minor enemies count as 1/10th of an enemy
						if (Enemy.tags.has("boss")) {
							count += 3 * Math.max(1, 100/(100 + KinkyDungeonDifficulty));
							tags.push("boss");
						} // Boss enemies count as 4 normal enemies
						else if (Enemy.tags.has("elite")) count += Math.max(1, 1000/(2000 + 20*KinkyDungeonDifficulty + KinkyDungeonTotalSleepTurns)); // Elite enemies count as 1.5 normal enemies
						if (Enemy.tags.has("miniboss")) {
							if (!miniboss) tags.push("boss");
							miniboss = true; // Adds miniboss as a tag
						}

						if (Enemy.summon) {
							for (let sum of Enemy.summon) {
								if (!sum.chance || KDRandom() < sum.chance)
									KinkyDungeonSummonEnemy(X, Y, sum.enemy, sum.count, sum.range, sum.strict);
							}
						}
					} else count += 0.1;

					Enemy = KinkyDungeonGetEnemy(tags, MiniGameKinkyDungeonLevel + effLevel/6, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], KinkyDungeonMapGet(spawnLocation.x, spawnLocation.y), requireTags);
				}
				if (EnemiesSummoned.length > 0 && KinkyDungeonFirstSpawn) {
					KinkyDungeonFirstSpawn = false;
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonFirstSpawn"), "white", KDGameData.SleepTurns + 5);
				}
				if (KinkyDungeonTotalSleepTurns > KinkyDungeonSearchEntranceChaseAmount && !KinkyDungeonHuntDownPlayer && KDGameData.SleepTurns < 3) {
					KinkyDungeonHuntDownPlayer = true;
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonHuntDownPlayer"), "red", KDGameData.SleepTurns + 10);
				}
				console.log(EnemiesSummoned);
			}
		}

	} else if (KinkyDungeonJailTransgressed) KinkyDungeonSearchTimer += delta;
}