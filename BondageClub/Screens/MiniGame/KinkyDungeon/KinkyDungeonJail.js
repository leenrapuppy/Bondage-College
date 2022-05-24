"use strict";

let KinkyDungeonJailRemoveRestraintsTimerMin = 90;
let KinkyDungeonJailedOnce = false;
let KDJailReleaseTurns = [
	{minSub: 0, releaseTurns: 250},
	{minSub: 5, releaseTurns: 140},
	{minSub: 40, releaseTurns: 80},
	{minSub: 90, releaseTurns: 40},
];

function KinkyDungeonLoseJailKeys(Taken) {
	if (KDGameData.PrisonerState == 'parole' || KDGameData.PrisonerState == 'jail' || KDGameData.PrisonerState == 'chase') {
		if (KDGameData.JailKey) {
			if (Taken)
				KinkyDungeonSendActionMessage(6, TextGet("KinkyDungeonRemoveJailKey"), "red", 3);
			KDGameData.JailKey = false;
		}
	}
	if (!KDGameData.JailKey) {
		let keyCount = KinkyDungeonGroundItems.filter((item) => {return item.name == "Keyring";}).length;
		for (let i = 0; i < 2 - keyCount; i++) {
			KinkyDungeonPlaceJailKeys();
		}
	}

}

function KinkyDungeonPlayerIsVisibleToJailers() {
	let list = [];
	for (let enemy of KinkyDungeonEntities) {
		if (KDHostile(enemy) && !(enemy.rage > 0) && (enemy.Enemy.tags.has('jail') || enemy.Enemy.tags.has('jailer') || enemy.Enemy.playLine)) {
			if (KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, KDistChebyshev(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y), enemy.Enemy.visionRadius, false, true)) {
				list.push(enemy);
			}
		}
	}
	if (list.length > 0) return list[Math.floor(Math.random() * list.length)];
	return null;
}

/**
 *
 * @param {entity} enemy
 * @returns {boolean}
 */
function KinkyDungeonCanPlay(enemy) {
	return KDGameData.PrisonerState == 'parole' || (!KDHostile(enemy) && !KDAllied(enemy));
}

function KinkyDungeonCheckRelease() {
	let sub = KinkyDungeonGoddessRep.Ghost + 50;
	let security = KinkyDungeonGoddessRep.Prisoner + 50;
	if (sub == undefined || isNaN(sub)) sub = 0;
	if (security == undefined || isNaN(security)) security = 0;
	let turns = KDGameData.JailTurns - security;
	for (let i = 0; i < KDJailReleaseTurns.length; i++) {
		let condition = KDJailReleaseTurns[i];
		if (sub >= condition.minSub && turns >= condition.releaseTurns) return i;
	}
	return -1;
}

/** Max turns for the alert timer until the whole map becomes hostile */
let KDMaxAlertTimer = 14;
let KDMaxAlertTimerAggro = 300;

/**
 *
 * @param {string} action
 * @param {{enemy?: entity, x?: number, y?: number}} data
 */
function KinkyDungeonAggroAction(action, data) {
	let e = null;
	switch (action) {
		// Attacking ALWAYS makes the enemy angry
		case 'attack':
			KinkyDungeonStartChase(data.enemy, "Attack");
			break;

		// Magic ALWAYS makes the enemy angry
		case 'magic':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonStartChase(e, "Spell");
			}
			break;
		// Magic ALWAYS makes the enemy angry
		case 'item':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonStartChase(e, "SpellItem");
			}
			break;

		// Having a guard called ALWAYS makes the enemy angry
		case 'call':
			KinkyDungeonStartChase(data.enemy, "");
			break;

		// Chests ALWAYS make the enemy angry
		case 'chest':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonStartChase(e, "Chest");
			}
			break;

		// Chests ALWAYS make the enemy angry
		case 'rubble':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonPlayExcuse(e, "Loot");
			}
			break;

		// Altars ALWAYS make the enemy angry
		case 'shrine':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonStartChase(e, "Shrine");
			}
			break;

		// Chests ALWAYS make the enemy angry
		case 'orb':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonStartChase(e, "Orb");
			}
			break;

		case 'struggle':
			if (data.enemy) // KDGameData.PrisonerState == "parole" &&
				KinkyDungeonPlayExcuse(data.enemy, "Struggle");
			break;

		case 'unrestrained':
			if (KDGameData.PrisonerState == "parole" && data.enemy)
				KinkyDungeonPlayExcuse(data.enemy, "Free");
			break;

		// Roaming free only makes them angry if you are a prisoner
		case 'jailbreak':
			if (KDGameData.PrisonerState == "jail"){
				KinkyDungeonStartChase(data.enemy, "Jailbreak");
			}
			break;

		// Roaming free only makes them angry if you are a prisoner
		case 'key':
			e = KinkyDungeonPlayerIsVisibleToJailers();
			if (e) {
				KinkyDungeonPlayExcuse(e, "Key");
			}
			break;
	}
}

/**
 * @type {string[]}
 */
let KDLocalChaseTypes = ["Refusal", "Attack", "Spell", "SpellItem", "Shrine", "Orb", "Chest"];

/**
 *
 * @param {entity} enemy
 * @param {string} Type
 */
function KinkyDungeonStartChase(enemy, Type) {
	if ((!enemy && !KDLocalChaseTypes.includes(Type))) {
		if (KDGameData.PrisonerState == 'parole') {
			KinkyDungeonChangeRep("Ghost", -10);
			KinkyDungeonChangeRep("Prisoner", 10);
			KDGameData.PrisonerState = "chase";
		}
		if (KDGameData.PrisonerState == 'jail' || KDGameData.PrisonerState == 'parole' || KDGameData.PrisonerState == 'chase')
			KDGameData.PrisonerState = "chase";
	} else if (KDLocalChaseTypes.includes(Type)) {
		for (let e of KinkyDungeonEntities) {
			if (KDHostile(e) && KDFactionAllied(KDGetFaction(enemy), e) && KinkyDungeonCheckLOS(e, KinkyDungeonPlayerEntity, 7, 8, false, false)) {
				if (!e.hostile) e.hostile = KDMaxAlertTimerAggro;
				else e.hostile = Math.max(KDMaxAlertTimerAggro, e.hostile);
			}
		}
	}

	if (Type && enemy && (enemy.Enemy.tags.has('jail') || enemy.Enemy.tags.has('jailer') || enemy.Enemy.playLine)) {
		let suff = enemy.Enemy.playLine ? enemy.Enemy.playLine + Type : Type;
		let index = (Type == "Attack" || Type == "Spell") ? ("" + Math.floor(Math.random() * 3)) : "";
		KinkyDungeonSendTextMessage((!KDGameData.PrisonerState) ? 3 : 5, TextGet("KinkyDungeonRemindJailChase" + suff + index).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 4, (!KDGameData.PrisonerState));
	}
	if (enemy) {
		if (!enemy.hostile) enemy.hostile = KDMaxAlertTimerAggro;
		else enemy.hostile = Math.max(KDMaxAlertTimerAggro, enemy.hostile);
	}
}

/**
 *
 * @param {entity} enemy
 * @param {string} Type
 */
function KinkyDungeonPlayExcuse(enemy, Type) {
	if (Type == "Free" && enemy && enemy.Enemy.noChaseUnrestrained) {
		return;
	}
	if (KinkyDungeonCanPlay(enemy) && !(enemy.playWithPlayer > 0) && enemy.aware && !(enemy.playWithPlayerCD > 0) && (enemy.Enemy.tags.has('jail') || enemy.Enemy.tags.has('jailer') || enemy.Enemy.playLine)) {
		enemy.playWithPlayer = 17;
		enemy.playWithPlayerCD = enemy.playWithPlayer * 1.5;

		if (Type == "Key") {
			enemy.playWithPlayer = 30;
			enemy.playWithPlayerCD = enemy.playWithPlayer;
		}
		let suff = enemy.Enemy.playLine ? enemy.Enemy.playLine + Type : Type;
		KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemindJailPlay" + suff).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 4, true);
	}
}

/**
 *
 * @param {string} Group
 * @returns {restraint}
 */
function KinkyDungeonGetJailRestraintForGroup(Group) {
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	/**
	 * @type {restraint}
	 */
	let cand = null;
	let candLevel = 0;
	for (let r of params.defeat_restraints) {
		let level = 0;
		if (KinkyDungeonGoddessRep.Prisoner) level = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);
		if (!r.Level || level >= r.Level) {
			let candidate = KinkyDungeonGetRestraintByName(r.Name);
			if (candidate.Group == Group && !candidate.nonbinding) {
				if (candLevel == 0 || r.Level > candLevel) {
					cand = candidate;
					candLevel = r.Level;
				}
			}
		}
	}
	return cand;
}

function KinkyDungeonGetJailRestraintLevelFor(Name) {
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	for (let r of params.defeat_restraints) {
		if (r.Name === Name) {
			return r.Level;
		}
	}
	return -1;
}

function KinkyDungeonAttachTetherToGuard(dist) {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && KDRestraint(inv).tether) {
		inv.tetherToGuard = true;
		if (dist) inv.tetherLength = dist;
	}
}

function KinkyDungeonInJail() {
	return KinkyDungeonPlayerInCell();//KDGameData.KinkyDungeonSpawnJailers > 0 && KDGameData.KinkyDungeonSpawnJailers + 1 >= KDGameData.KinkyDungeonSpawnJailersMax;
}


function KinkyDungeonPlaceJailKeys() {
	let jailKeyList = [];

	// Populate the key
	for (let X = 1; X < KinkyDungeonGridWidth; X += 1)
		for (let Y = 1; Y < KinkyDungeonGridHeight; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))
				&& KDistChebyshev(X - KinkyDungeonPlayerEntity.x, Y - KinkyDungeonPlayerEntity.y) > 15
				&& KDistChebyshev(X - KinkyDungeonEndPosition.x, Y - KinkyDungeonEndPosition.y) > 15
				&& (!KinkyDungeonShortcutPosition || KDistChebyshev(X - KinkyDungeonShortcutPosition.x, Y - KinkyDungeonShortcutPosition.y) > 15)
				&& (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits))
				jailKeyList.push({x:X, y:Y});

	while (jailKeyList.length > 0) {
		let N = Math.floor(KDRandom()*jailKeyList.length);
		KinkyDungeonGroundItems.push({x:jailKeyList[N].x, y:jailKeyList[N].y, name: "Keyring"});
		return true;
	}

}

function KinkyDungeonHandleJailSpawns(delta) {
	if (KDGameData.JailTurns) KDGameData.JailTurns += delta;
	else KDGameData.JailTurns = 1;
	if (KinkyDungeonInJail()) KDGameData.JailRemoveRestraintsTimer += delta;

	let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);

	let xx = nearestJail.x + KinkyDungeonJailLeashX;
	let yy = nearestJail.y;
	let playerInCell = (Math.abs(KinkyDungeonPlayerEntity.x - nearestJail.x) < KinkyDungeonJailLeashX - 1 && Math.abs(KinkyDungeonPlayerEntity.y - nearestJail.y) <= KinkyDungeonJailLeash);
	if (KinkyDungeonInJail() && KDGameData.PrisonerState == "jail" && (KDGameData.KinkyDungeonGuardSpawnTimer <= 1 || KDGameData.SleepTurns == 3) && !KinkyDungeonJailGuard() && playerInCell && !KDGameData.RescueFlag) {
		KDGameData.KinkyDungeonGuardSpawnTimer = KDGameData.KinkyDungeonGuardSpawnTimerMin + Math.floor(KDRandom() * (KDGameData.KinkyDungeonGuardSpawnTimerMax - KDGameData.KinkyDungeonGuardSpawnTimerMin));
		let Enemy = KinkyDungeonGetEnemyByName((KinkyDungeonGoddessRep.Prisoner < 0 ? "Guard" : "GuardHeavy"));
		let guard = {summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
			x:xx, y:yy, gx: xx - 2, gy: yy, CurrentAction: "jailWander",
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};

		if (!KinkyDungeonFlags.get("JailIntro")) {
			KinkyDungeonSetFlag("JailIntro", -1);
			KDStartDialog("PrisonIntro", guard.Enemy.name, true, "");
		} else if (KinkyDungeonFlags.get("JailRepeat")) {
			KinkyDungeonSetFlag("JailRepeat",  0);
			KDStartDialog("PrisonRepeat", guard.Enemy.name, true, "");
		}

		if (KinkyDungeonTiles.get((xx-1) + "," + yy) && KinkyDungeonTiles.get((xx-1) + "," + yy).Type == "Door") {
			KinkyDungeonTiles.get((xx-1) + "," + yy).Lock = undefined;
		}
		KDGameData.KinkyDungeonJailGuard = guard.id;
		KinkyDungeonEntities.push(guard);
		KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonGuardAppear"), "white", 6);

		KDGameData.KinkyDungeonGuardTimer = KDGameData.KinkyDungeonGuardTimerMax;
	} else if (KDGameData.KinkyDungeonGuardSpawnTimer > 0 && KDGameData.SleepTurns < 1 && !KinkyDungeonAngel()) KDGameData.KinkyDungeonGuardSpawnTimer -= delta;

	if (KDGameData.KinkyDungeonJailTourTimer > 0) {
		KDGameData.KinkyDungeonJailTourTimer = Math.max(0, KDGameData.KinkyDungeonJailTourTimer - delta);
	}

	if (KinkyDungeonJailGuard() && KDGameData.KinkyDungeonGuardTimer > 0 && KDGameData.KinkyDungeonGuardTimerMax - KDGameData.KinkyDungeonGuardTimer > 6 && KDGameData.PrisonerState == 'jail') {
		let securityLevel = 0;
		if (KinkyDungeonGoddessRep.Prisoner) securityLevel = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);

		if (KinkyDungeonJailGuard().CurrentAction === "jailWander" && KDistChebyshev(KinkyDungeonJailGuard().gx - KinkyDungeonJailGuard().x, KinkyDungeonJailGuard().gy - KinkyDungeonJailGuard().y) < 1.5) {
			// Random meandering about the cell, sometimes stopping near the player
			if (KDRandom() < 0.2) {
				KinkyDungeonJailGuard().gx = xx - 2;
				if (KDRandom() < 0.5)
					KinkyDungeonJailGuard().gy = yy + Math.round(KDRandom() * KinkyDungeonJailLeash * 2 - KinkyDungeonJailLeash);
				else
					KinkyDungeonJailGuard().gy = KinkyDungeonPlayerEntity.y;
			}

			// Determine if the jailer should change restraints
			let missingJailUniform = KinkyDungeonMissingJailUniform();
			let tooMuchRestraint = KinkyDungeonTooMuchRestraint();
			let changeForFun = false;
			let release = KinkyDungeonCheckRelease();

			// Determine which action to take
			if (release >= 0) {
				KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonRemindJailRelease" + release).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name)), "yellow", 4);
				KDGameData.PrisonerState = 'parole';
				KinkyDungeonJailGuard().CurrentAction = "jailWander";
				KinkyDungeonInterruptSleep();
				// Unlock all jail doors
				for (let T of KinkyDungeonTiles.values()) {
					if (T.Lock && T.Jail) T.Lock = undefined;
					if (T.Type == "Lock") T.Type = undefined;
				}

			}
			else if (missingJailUniform.length > 0 || (tooMuchRestraint.length > 0 && KDGameData.JailRemoveRestraintsTimer > KinkyDungeonJailRemoveRestraintsTimerMin) || changeForFun) {
				if (missingJailUniform.length > 0 || KDRandom() < 0.2) {
					if (tooMuchRestraint.length > 0 && (KDRandom() < 0.5 || missingJailUniform.length < 1) && KDGameData.JailRemoveRestraintsTimer > KinkyDungeonJailRemoveRestraintsTimerMin) {
						let group = "";
						if (tooMuchRestraint.includes("ItemMouth3")) group = "ItemMouth3";
						else if (tooMuchRestraint.includes("ItemMouth2")) group = "ItemMouth2";
						else if (tooMuchRestraint.includes("ItemMouth")) group = "ItemMouth";
						else group = tooMuchRestraint[Math.floor(tooMuchRestraint.length * KDRandom())];
						if (group) {
							KinkyDungeonJailGuard().CurrentAction = "jailRemoveRestraints";
							KinkyDungeonJailGuard().CurrentRestraintSwapGroup = group;
						}
						KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonJailerRemove").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name)), "yellow", 2);
					} else if (missingJailUniform.length > 0 && (KDRandom() < 0.33 || !KinkyDungeonGetRestraintItem("ItemArms"))) {
						let group = "";
						if (missingJailUniform.includes("ItemMouth3")) group = "ItemMouth3";
						else if (missingJailUniform.includes("ItemMouth2")) group = "ItemMouth2";
						else if (missingJailUniform.includes("ItemMouth")) group = "ItemMouth";
						else group = missingJailUniform[Math.floor(missingJailUniform.length * KDRandom())];
						if (group) {
							KinkyDungeonJailGuard().CurrentAction = "jailAddRestraints";
							KinkyDungeonJailGuard().CurrentRestraintSwapGroup = group;
						}
						KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonJailerAdd").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name)), "yellow", 2);
					}
				}
			} else if (KDRandom() < 0.05 + securityLevel * 0.1 / 100) {
				// Always a random chance to tease
				KinkyDungeonJailGuard().CurrentAction = "jailTease";
			} else if (KDRandom() < 0.08 && KDGameData.SleepTurns < 1 && KDGameData.KinkyDungeonJailTourTimer < 1 && KinkyDungeonStatStamina > 0.25*KinkyDungeonStatStaminaMax && KinkyDungeonGoddessRep.Ghost > 5) {
				KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints = 2 + Math.ceil(KDRandom() * 4);
				KinkyDungeonJailGuard().CurrentAction = "jailLeashTour";
				KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions = 0;
				let msg = TextGet("KinkyDungeonRemindJailTourStart").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
				KinkyDungeonSendTextMessage(9, msg, "yellow", 4);
			}
		}

		// Handle leash touring or end it if the player is not jailed
		if (KinkyDungeonJailGuard().CurrentAction === "jailLeashTour" && KDGameData.PrisonerState == 'jail') {
			KinkyDungeonHandleLeashTour(xx, yy, playerInCell);
		} else if (KDGameData.PrisonerState != 'jail') {
			KinkyDungeonJailGuard().CurrentAction = "jailWander";
			KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
			KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
		}

		// Main jail cell loop
		if (KinkyDungeonJailGuard().CurrentAction === "jailTease" || KinkyDungeonJailGuard().CurrentAction === "jailAddRestraints" || KinkyDungeonJailGuard().CurrentAction === "jailRemoveRestraints") {
			KinkyDungeonJailHandleCellActions(xx, yy, securityLevel, delta);
		} else
			KDGameData.GuardApplyTime = 0;
	}

	if (KinkyDungeonJailGuard()) {
		KinkyDungeonJailGuard().gxx = KinkyDungeonJailGuard().gx;
		KinkyDungeonJailGuard().gyy = KinkyDungeonJailGuard().gy;
		if (KDGameData.KinkyDungeonGuardTimer > 0) {
			// Decrease timer when not on a tour
			if (KinkyDungeonJailGuard().CurrentAction !== "jailLeashTour" && !KinkyDungeonAngel()) {
				KDGameData.KinkyDungeonGuardTimer -= 1;
				if (KDGameData.KinkyDungeonGuardTimer <= 0) {
					KinkyDungeonJailGuard().gx = xx;
					KinkyDungeonJailGuard().gy = yy;
				}
			}
		} else {
			// Leave the cell and lock the door
			if (KinkyDungeonJailGuard() && KinkyDungeonJailGuard().x == xx && KinkyDungeonJailGuard().y == yy && KDGameData.PrisonerState) {
				KinkyDungeonEntities.splice(KinkyDungeonEntities.indexOf(KinkyDungeonJailGuard()), 1);
				if (KinkyDungeonTiles.get((xx-1) + "," + yy) && KinkyDungeonTiles.get((xx-1) + "," + yy).Type == "Door") {
					KinkyDungeonMapSet(xx-1, yy, 'D');
					if (KDGameData.PrisonerState == 'jail')
						KinkyDungeonTiles.get((xx-1) + "," + yy).Lock = KinkyDungeonGenerateLock(true, MiniGameKinkyDungeonLevel);
					if (KDGameData.PrisonerState == 'jail')
						KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonGuardDisappear"), "red", 6);
					if (KDGameData.KinkyDungeonPrisonReduction < KDGameData.KinkyDungeonMaxPrisonReduction || KinkyDungeonGoddessRep.Ghost > 0) {
						KDGameData.KinkyDungeonPrisonReduction += 1;
						KinkyDungeonChangeRep("Prisoner", -1);
					}
					KinkyDungeonChangeRep("Ghost", 1 + KDGameData.KinkyDungeonPrisonExtraGhostRep);
					KDGameData.KinkyDungeonPrisonExtraGhostRep = 0;
				}
			} else {
				KinkyDungeonJailGuard().gx = xx;
				KinkyDungeonJailGuard().gy = yy;
			}
		}
	}

	// Unlock all jail doors when chasing
	if (!KDGameData.PrisonerState || KDGameData.PrisonerState == 'chase') {
		for (let T of KinkyDungeonTiles.values()) {
			if (T.Lock && T.Type == "Door" && T.Jail) T.Lock = undefined;
		}
	}

	if (!KinkyDungeonJailGuard()) {
		KDGameData.KinkyDungeonGuardTimer = 0;
	}
	if (!KinkyDungeonEntities.includes(KinkyDungeonJailGuard())) {
		if (KDGameData.KinkyDungeonGuardSpawnTimer == 0 || KinkyDungeonJailGuard())
			KDGameData.KinkyDungeonGuardSpawnTimer = 4 + Math.floor(KDRandom() * (KDGameData.KinkyDungeonGuardSpawnTimerMax - KDGameData.KinkyDungeonGuardSpawnTimerMin));
		KDGameData.KinkyDungeonJailGuard = 0;
	}
}

function KinkyDungeonMissingJailUniform() {
	let MissingGroups = [];
	for (let gr of KinkyDungeonStruggleGroupsBase) {
		let g = gr;
		if (gr == "ItemM") {
			if (KinkyDungeonGetRestraintItem("ItemMouth2")) g = "ItemMouth3";
			else if (KinkyDungeonGetRestraintItem("ItemMouth")) g = "ItemMouth2";
			else g = "ItemMouth";
		}
		let rest = KinkyDungeonGetJailRestraintForGroup(g);
		let currentItem = KinkyDungeonGetRestraintItem(g);
		if (rest && (!currentItem || KinkyDungeonIsLinkable(KDRestraint(currentItem), rest)) && (KinkyDungeonStatsChoice.get("arousalMode") || !rest.arousalMode) && (KinkyDungeonStatsChoice.get("arousalModePlug") || rest.Group != "ItemButt") && (KinkyDungeonStatsChoice.get("arousalModePiercing") || !rest.piercing)) {
			MissingGroups.push(g);
		}
	}
	return MissingGroups;
}

function KinkyDungeonTooMuchRestraint() {
	let Groups = ["ItemArms", "ItemHands", "ItemHead", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemLegs", "ItemFeet", "ItemHands"];

	for (let g of KinkyDungeonStruggleGroupsBase) {
		let rest = KinkyDungeonGetJailRestraintForGroup(g);
		if (rest && !Groups.includes(g)) Groups.push(g);
	}
	let RemoveGroups = [];
	for (let g of Groups) {
		let rest = KinkyDungeonGetJailRestraintForGroup(g);
		let currentItem = KinkyDungeonGetRestraintItem(g);
		let lockMult = 1;//currentItem ? Math.max(1, KinkyDungeonGetLockMult(currentItem.lock) - 1) : 0;
		if (
			(!rest && currentItem) // There shouldnt be one here
			|| (rest && currentItem && currentItem && rest.name != currentItem.name && (KDRestraint(currentItem).power < rest.power || KDRestraint(currentItem).power * lockMult <= Math.max(10.1, rest ? rest.power : 10))) // Wrong item equipped
		) {
			if (!currentItem || (!KDRestraint(currentItem).curse && !KDRestraint(currentItem).enchanted))
				RemoveGroups.push(g);
		}
	}
	return RemoveGroups;
}

// @ts-ignore
function KinkyDungeonJailHandleCellActions(xx, yy, level, delta) {
	let applyTime = 2;
	let playerDist = Math.sqrt((KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x)*(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x) + (KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y)*(KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y));
	let touchesPlayer = KinkyDungeonCheckLOS(KinkyDungeonJailGuard(), KinkyDungeonPlayerEntity, playerDist, 1.5, false, false);
	if (touchesPlayer) {
		if (KinkyDungeonJailGuard().CurrentAction === "jailTease") {
			let playerHasVibrator = Array.from(KinkyDungeonAllRestraint()).some(i => KDRestraint(i).allowRemote);
			if (playerHasVibrator) {
				let extraCharge = Math.round(2 + level * KDRandom() * 0.2);
				KinkyDungeonSendEvent("remoteVibe", {enemy: KinkyDungeonJailGuard().Enemy.name, power: extraCharge, overcharge: true, noSound: false});
			} else if (KinkyDungeonJailGuard().Enemy.dmgType === "grope" || KinkyDungeonJailGuard().Enemy.dmgType === "tickle") {
				KinkyDungeonDealDamage({damage: KinkyDungeonJailGuard().Enemy.power, type: KinkyDungeonJailGuard().Enemy.dmgType});
				KinkyDungeonSendTextMessage(5, TextGet("Attack" + KinkyDungeonJailGuard().Enemy.name), "yellow", 3);
			}
			if (KDRandom() < 0.02 || (KinkyDungeonStatStamina < 10 && KDRandom() < 0.1))
				KinkyDungeonJailGuard().CurrentAction = "jailWander";
			KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
			KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
		}

		if (KinkyDungeonJailGuard().CurrentAction === "jailAddRestraints") {
			KDGameData.KinkyDungeonGuardTimer = Math.max(KDGameData.KinkyDungeonGuardTimer, 2);
			let newRestraint = KinkyDungeonGetJailRestraintForGroup(KinkyDungeonJailGuard().CurrentRestraintSwapGroup);
			if (KDGameData.GuardApplyTime > applyTime) {
				if (newRestraint) {
					let oldRestraintItem = KinkyDungeonGetRestraintItem(KinkyDungeonJailGuard().CurrentRestraintSwapGroup);
					let added = KinkyDungeonAddRestraintIfWeaker(newRestraint, 0, true, "Red");
					if (added) {
						let restraintModification = oldRestraintItem ? "ChangeRestraints" : "AddRestraints";
						let msg = TextGet("KinkyDungeon" + restraintModification).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
						if (oldRestraintItem) msg = msg.replace("OldRestraintName", TextGet("Restraint"+oldRestraintItem.name));
						msg = msg.replace("NewRestraintName", TextGet("Restraint"+newRestraint.name));
						KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
					} else
						KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonJailerCheck"), "yellow", 3);
				}
				KinkyDungeonJailGuard().CurrentAction = "jailWander";
				KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
				KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
				KDGameData.GuardApplyTime = 0;
			} else if (newRestraint) {
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonJailerStartAdding").replace("RestraintName", TextGet("Restraint" + newRestraint.name)), "yellow", 2);
				KDGameData.GuardApplyTime += delta;
			}
		}

		if (KinkyDungeonJailGuard().CurrentAction === "jailRemoveRestraints") {
			KDGameData.KinkyDungeonGuardTimer = Math.max(KDGameData.KinkyDungeonGuardTimer, 2);
			let oldRestraintItem = KinkyDungeonGetRestraintItem(KinkyDungeonJailGuard().CurrentRestraintSwapGroup);
			if (KDGameData.GuardApplyTime > applyTime) {
				if (oldRestraintItem && KDRestraint(oldRestraintItem) && !KDRestraint(oldRestraintItem).noJailRemove) {
					KinkyDungeonRemoveRestraint(KDRestraint(oldRestraintItem).Group, false, false, false);
					let msg = TextGet("KinkyDungeonRemoveRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
					//let msg = TextGet("Attack" + KinkyDungeonJailGuard().Enemy.name + "RemoveRestraints");
					if (oldRestraintItem) msg = msg.replace("OldRestraintName", TextGet("Restraint"+oldRestraintItem.name));
					KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
				}
				KinkyDungeonJailGuard().CurrentAction = "jailWander";
				KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
				KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
				KDGameData.GuardApplyTime = 0;
			} else if (oldRestraintItem) {
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonJailerStartRemoving").replace("RestraintName", TextGet("Restraint" + oldRestraintItem.name)), "yellow", 2);
				KDGameData.GuardApplyTime += delta;
			} else {
				KinkyDungeonJailGuard().CurrentAction = "jailWander";
				KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
				KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
				KDGameData.GuardApplyTime = 0;
			}
		}

	} else {
		KDGameData.KinkyDungeonGuardTimer = Math.max(KDGameData.KinkyDungeonGuardTimer, 2);
		KDGameData.GuardApplyTime = 0;
		KinkyDungeonJailGuard().gx = KinkyDungeonPlayerEntity.x;
		KinkyDungeonJailGuard().gy = KinkyDungeonPlayerEntity.y;
	}
}

function KinkyDungeonHandleLeashTour(xx, yy, playerInCell) {
	if (!KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints && KinkyDungeonJailGuard().x === KinkyDungeonJailGuard().NextJailLeashTourWaypointX && KinkyDungeonJailGuard().y === KinkyDungeonJailGuard().NextJailLeashTourWaypointY) {
		let leashItemToRemove = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
		if (leashItemToRemove) {
			KinkyDungeonRemoveRestraint("ItemNeckRestraints", false);
			let msg = TextGet("KinkyDungeonRemoveRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
			msg = msg.replace("OldRestraintName", TextGet("Restraint"+leashItemToRemove.name));
			KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
		}
		KDGameData.KinkyDungeonPrisonExtraGhostRep += 2;
		if (!playerInCell) {
			let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			let point = KinkyDungeonGetNearbyPoint(nearestJail.x, nearestJail.y, true, undefined, true);
			if (point) {
				KinkyDungeonPlayerEntity.x = point.x;
				KinkyDungeonPlayerEntity.y = point.y;
			}
		}
		let enemy = KinkyDungeonEnemyAt(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
		if (enemy) enemy.x += 1;
		KinkyDungeonJailGuard().CurrentAction = "jailWander";
		KDGameData.KinkyDungeonJailTourTimer = KDGameData.KinkyDungeonJailTourTimerMin + Math.floor((KDGameData.KinkyDungeonJailTourTimerMax - KDGameData.KinkyDungeonJailTourTimerMin) * KDRandom());
		KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
		KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
	} else {
		let playerDist = KDistChebyshev(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x, KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y);//Math.sqrt((KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x)*(KinkyDungeonJailGuard().x - KinkyDungeonPlayerEntity.x) + (KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y)*(KinkyDungeonJailGuard().y - KinkyDungeonPlayerEntity.y));
		let wearingLeash = KinkyDungeonIsWearingLeash();
		if (!wearingLeash) {
			let touchesPlayer = KinkyDungeonCheckLOS(KinkyDungeonJailGuard(), KinkyDungeonPlayerEntity, playerDist, 1.5, false, false);
			if (touchesPlayer) {
				if (!KinkyDungeonGetRestraintItem("ItemNeck")) {
					let collar = KinkyDungeonGetRestraintByName("BasicCollar");
					KinkyDungeonAddRestraintIfWeaker(collar, KinkyDungeonJailGuard().Enemy.power, true, "");
					let msg = TextGet("KinkyDungeonAddRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
					msg = msg.replace("NewRestraintName", TextGet("Restraint"+collar.name));
					KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
					KinkyDungeonJailGuard().NextJailLeashTourWaypointX = KinkyDungeonJailGuard().x;
					KinkyDungeonJailGuard().NextJailLeashTourWaypointY = KinkyDungeonJailGuard().y;
					KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
					KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
				} else {
					let leash = KinkyDungeonGetRestraintByName("BasicLeash");
					KinkyDungeonAddRestraintIfWeaker(leash, KinkyDungeonJailGuard().Enemy.power, true, "");
					let msg = TextGet("KinkyDungeonAddRestraints").replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
					msg = msg.replace("NewRestraintName", TextGet("Restraint"+leash.name));
					KinkyDungeonSendTextMessage(5, msg, "yellow", 1);
					KinkyDungeonJailGuard().NextJailLeashTourWaypointX = KinkyDungeonJailGuard().x;
					KinkyDungeonJailGuard().NextJailLeashTourWaypointY = KinkyDungeonJailGuard().y;
					KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().x;
					KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().y;
				}
				KinkyDungeonAttachTetherToGuard(2);
			} else {
				KinkyDungeonJailGuard().gx = KinkyDungeonPlayerEntity.x;
				KinkyDungeonJailGuard().gy = KinkyDungeonPlayerEntity.y;
			}
		} else if (!KinkyDungeonTetherLength()) {
			KinkyDungeonJailGuard().gx = KinkyDungeonPlayerEntity.x;
			KinkyDungeonJailGuard().gy = KinkyDungeonPlayerEntity.y;
			if (playerDist < 1.5) {
				KinkyDungeonAttachTetherToGuard(2);
			}
		} else if (KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints > 0
            && (KDistChebyshev(KinkyDungeonJailGuard().x - KinkyDungeonJailGuard().NextJailLeashTourWaypointX, KinkyDungeonJailGuard().y - KinkyDungeonJailGuard().NextJailLeashTourWaypointY) < 2
            || (KDRandom() < 0.05 && KDistChebyshev(KinkyDungeonJailGuard().x - KinkyDungeonJailGuard().NextJailLeashTourWaypointX, KinkyDungeonJailGuard().y - KinkyDungeonJailGuard().NextJailLeashTourWaypointY) < 5)
			|| KDRandom() < 0.01)) {
			KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints--;
			if (KinkyDungeonJailGuard().NextJailLeashTourWaypointX > KinkyDungeonJailLeashX + 2) {
				if (KinkyDungeonHasStamina(1.1) && KDRandom() < 0.5 && KinkyDungeonLastAction == "Move") {
					let index = "0";
					if (KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions < 1) {
						index = "" + Math.floor(KDRandom() * 6);
						KinkyDungeonChangeRep("Ghost", 8);
					}
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonJailerGoodGirl" + index).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name)), "yellow", 3);
				}
			}
			KinkyDungeonJailGuardGetLeashWaypoint(xx, yy);
		} else {
			let pullDist = 2.5;//KinkyDungeonTetherLength() - 1;//KinkyDungeonJailGuard().Enemy.pullDist ? KinkyDungeonJailGuard().Enemy.pullDist : 1;
			if (playerDist < 1.5) {
				KinkyDungeonAttachTetherToGuard(2);
			}
			if (playerDist > pullDist && KinkyDungeonSlowLevel < 2 && KinkyDungeonCheckProjectileClearance(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonJailGuard().x, KinkyDungeonJailGuard().y)) {
				// Guard goes back towards the player and reminds them
				let msg = TextGet("KinkyDungeonRemindJailTour" + KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
				let msgPrev = TextGet("KinkyDungeonRemindJailTour" + Math.max(0, KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions-1)).replace("EnemyName", TextGet("Name" + KinkyDungeonJailGuard().Enemy.name));
				if (KinkyDungeonLastAction == "Move") {
					KinkyDungeonSendTextMessage(7 + KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions, msg, "yellow", 3);
					if (KinkyDungeonJailGuard().gx != KinkyDungeonPlayerEntity.x || KinkyDungeonJailGuard().gy != KinkyDungeonPlayerEntity.y && KinkyDungeonTextMessage != msgPrev) {
						KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions = Math.min(3, KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions + 1);
					}
				}
				if (KinkyDungeonJailGuard().KinkyDungeonJailTourInfractions == 3 && KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints > 1) KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints = 1;
				KinkyDungeonJailGuard().gx = KinkyDungeonPlayerEntity.x;
				KinkyDungeonJailGuard().gy = KinkyDungeonPlayerEntity.y;
				KinkyDungeonUpdateTether(true, KinkyDungeonPlayerEntity);
			} else {
				KDGameData.KinkyDungeonLeashedPlayer = 2;
				KDGameData.KinkyDungeonLeashingEnemy = KinkyDungeonJailGuard().id;
				KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().NextJailLeashTourWaypointX;
				KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().NextJailLeashTourWaypointY;
				let guardPath = KinkyDungeonFindPath(KinkyDungeonJailGuard().x, KinkyDungeonJailGuard().y, KinkyDungeonJailGuard().gx, KinkyDungeonJailGuard().gy, false, false, true, KinkyDungeonMovableTiles);
				if (guardPath && guardPath.length > 0 && KDistChebyshev(guardPath[0].x - KinkyDungeonJailGuard().x, guardPath[0].y - KinkyDungeonJailGuard().y) < 1.5) {
					if (guardPath[0].x === KinkyDungeonPlayerEntity.x && guardPath[0].y === KinkyDungeonPlayerEntity.y) {
						// Swap the player and the guard
						KinkyDungeonTargetTile = null;
						KinkyDungeonTargetTileLocation = "";
						KinkyDungeonPlayerEntity.x = KinkyDungeonJailGuard().x;
						KinkyDungeonPlayerEntity.y = KinkyDungeonJailGuard().y;
						KinkyDungeonJailGuard().x = guardPath[0].x;
						KinkyDungeonJailGuard().y = guardPath[0].y;
					}
					let enemy = KinkyDungeonEnemyAt(guardPath[0].x, guardPath[0].y);
					if (enemy) {
						enemy.x = KinkyDungeonJailGuard().x;
						enemy.y = KinkyDungeonJailGuard().y;
						KinkyDungeonJailGuard().x = guardPath[0].x;
						KinkyDungeonJailGuard().y = guardPath[0].y;
					}
				} else KinkyDungeonJailGuardGetLeashWaypoint(xx, yy);
				KinkyDungeonUpdateTether(true, KinkyDungeonPlayerEntity);
			}
		}
	}
}

function KinkyDungeonJailGuardGetLeashWaypoint(xx, yy) {
	if (KinkyDungeonJailGuard().RemainingJailLeashTourWaypoints === 0) {
		// Go back to the cell's bed
		let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
		KinkyDungeonJailGuard().NextJailLeashTourWaypointX = nearestJail.x;
		KinkyDungeonJailGuard().NextJailLeashTourWaypointY = nearestJail.y;
		KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().NextJailLeashTourWaypointX;
		KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().NextJailLeashTourWaypointY;
	} else {
		// Get a random next waypoint in an acceptable range outside of the cell
		let randomPoint = KinkyDungeonJailGetLeashPoint(xx, yy, KinkyDungeonJailGuard());
		KinkyDungeonJailGuard().NextJailLeashTourWaypointX = randomPoint.x;
		KinkyDungeonJailGuard().NextJailLeashTourWaypointY = randomPoint.y;
		KinkyDungeonJailGuard().gx = KinkyDungeonJailGuard().NextJailLeashTourWaypointX;
		KinkyDungeonJailGuard().gy = KinkyDungeonJailGuard().NextJailLeashTourWaypointY;
	}
}

function KinkyDungeonJailGetLeashPoint(xx, yy, enemy) {
	let randomPoint = { x: xx, y: yy };
	for(let i = 0; i < 40; ++i) {
		let candidatePoint = KinkyDungeonGetRandomEnemyPoint(true, false, enemy);
		if (candidatePoint) {
			let distanceFromCell = Math.sqrt((xx - candidatePoint.x) * (xx - candidatePoint.x) + (yy - candidatePoint.y) * (yy - candidatePoint.y));
			if (distanceFromCell > KinkyDungeonJailLeash * 2 && distanceFromCell < KinkyDungeonJailLeash * 6) {
				randomPoint = candidatePoint;
				break;
			}
		}
	}
	return randomPoint;
}

/**
 *
 * @returns {boolean} - Returns if the player is inside the nearest jail cell
 */
function KinkyDungeonPlayerInCell() {
	let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (!nearestJail) return false;
	return KDistChebyshev(KinkyDungeonPlayerEntity.x - nearestJail.x, KinkyDungeonPlayerEntity.y - nearestJail.y) < 2;
	//return (Math.abs(KinkyDungeonPlayerEntity.x - KinkyDungeonStartPosition.x) < KinkyDungeonJailLeashX - 1 && Math.abs(KinkyDungeonPlayerEntity.y - KinkyDungeonStartPosition.y) <= KinkyDungeonJailLeash);
}
function KinkyDungeonPointInCell(x, y) {
	let nearestJail = KinkyDungeonNearestJailPoint(x, y);
	if (!nearestJail) return false;
	return KDistChebyshev(x - nearestJail.x, y - nearestJail.y) < 2;
	//return (Math.abs(x - KinkyDungeonStartPosition.x) < KinkyDungeonJailLeashX - 1 && Math.abs(y - KinkyDungeonStartPosition.y) <= KinkyDungeonJailLeash);
}

function KinkyDungeonDefeat() {
	KDGameData.KinkyDungeonLeashedPlayer = 0;
	if (KinkyDungeonFlags.get("JailIntro"))
		KinkyDungeonSetFlag("JailRepeat", -1);
	KinkyDungeonBlindLevel = 3;
	KinkyDungeonUpdateLightGrid = true;
	if (!KDGameData.TimesJailed) KDGameData.TimesJailed = 1;
	else KDGameData.TimesJailed += 1;
	KDGameData.JailTurns = 0;
	KDGameData.PrisonerState = "jail";
	KDGameData.AlertTimer = 0;
	KinkyDungeonLoseJailKeys();
	let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	KDSendStatus('jailed');
	KDSendEvent('jail');
	KDGameData.WarningLevel = 0;
	KDGameData.AncientEnergyLevel = 0;
	KDGameData.JailRemoveRestraintsTimer = 0;
	//MiniGameKinkyDungeonLevel = Math.min(MiniGameKinkyDungeonLevel, Math.max(Math.floor(MiniGameKinkyDungeonLevel/10)*10, MiniGameKinkyDungeonLevel - KinkyDungeonSpawnJailers + KinkyDungeonSpawnJailersMax - 1));
	KinkyDungeonSendEvent("defeat", {});

	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).removePrison) {
			KinkyDungeonRemoveRestraint(KDRestraint(inv).Group, false);
		}
	}
	KDGameData.KinkyDungeonPrisonReduction = 0;
	let firstTime = KDGameData.KinkyDungeonSpawnJailersMax == 0;
	KDGameData.KinkyDungeonGuardSpawnTimer = 4 + Math.floor(KDRandom() * (KDGameData.KinkyDungeonGuardSpawnTimerMax - KDGameData.KinkyDungeonGuardSpawnTimerMin));
	KDGameData.KinkyDungeonSpawnJailersMax = 2;
	if (KinkyDungeonGoddessRep.Prisoner) KDGameData.KinkyDungeonSpawnJailersMax += Math.round(6 * (KinkyDungeonGoddessRep.Prisoner + 50)/100);
	let securityBoost = (firstTime) ? 0 : Math.max(2, Math.ceil(4 * (KDGameData.KinkyDungeonSpawnJailersMax - KDGameData.KinkyDungeonSpawnJailers + 1)/KDGameData.KinkyDungeonSpawnJailersMax));

	KinkyDungeonStatBlind = 3;

	//MiniGameKinkyDungeonLevel = Math.floor((MiniGameKinkyDungeonLevel + Math.max(0, KinkyDungeonSpawnJailersMax - KinkyDungeonSpawnJailers))/5)*5;
	//MiniGameKinkyDungeonLevel = Math.floor(MiniGameKinkyDungeonLevel/2)*2;
	KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonLeashed"), "#ff0000", 3);
	if (!KinkyDungeonJailedOnce) {
		KinkyDungeonJailedOnce = true;
		KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonLeashed2"), "#ff0000", 3);
	}
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	KDGameData.KinkyDungeonSpawnJailers = KDGameData.KinkyDungeonSpawnJailersMax;
	let defeat_outfit = params.defeat_outfit;
	// Handle special cases
	let collar = KinkyDungeonGetRestraintItem("ItemNeck");
	if (collar && KDRestraint(collar)) {
		if (KDRestraint(collar).name == "DragonCollar") defeat_outfit = "Dragon";
		if (KDRestraint(collar).name == "MaidCollar") defeat_outfit = "Maid";
		if (KDRestraint(collar).name == "ExpCollar") defeat_outfit = "BlueSuitPrison";
		if (KDRestraint(collar).name == "WolfCollar") defeat_outfit = "Wolfgirl";
		if (KDRestraint(collar).name == "MithrilCollar") defeat_outfit = "Elven";
	}

	KinkyDungeonSetDress(defeat_outfit, "JailUniform");
	KinkyDungeonDressPlayer();
	for (let r of params.defeat_restraints) {
		let level = 0;
		//if (KinkyDungeonGoddessRep.Prisoner) level = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);
		if (!r.Level || level >= r.Level)
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(r.Name), 0, true);
	}
	KinkyDungeonRedKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonLockpicks = Math.min(Math.max(0, Math.round(3 * (1 - (KinkyDungeonGoddessRep.Prisoner + 50)/100))), KinkyDungeonLockpicks);
	KinkyDungeonNormalBlades = 0;

	let newInv = KinkyDungeonInventory.get(Restraint);
	let HasBound = false;
	let boundWeapons = [];
	if (HasBound) {
		// TODO add bound weapons here
	}
	KinkyDungeonAddLostItems(KinkyDungeonFullInventory(), HasBound);
	KDInitInventory();
	KinkyDungeonInventory.set(Restraint, newInv);
	KinkyDungeonInventoryAddWeapon("Knife");
	KDSetWeapon(null);
	for (let b of boundWeapons) {
		KinkyDungeonInventoryAddWeapon(b);
	}

	if (defeat_outfit != params.defeat_outfit) {
		if (!KinkyDungeonInventoryGet(defeat_outfit)) KinkyDungeonInventoryAdd({name: defeat_outfit, type: Outfit});
	} else if (!KinkyDungeonInventoryGet("JailUniform")) KinkyDungeonInventoryAdd({name: "JailUniform", type: Outfit});

	//KinkyDungeonChangeRep("Ghost", 1 + Math.round(KinkyDungeonSpawnJailers/2));
	KinkyDungeonChangeRep("Prisoner", securityBoost); // Each time you get caught, security increases...

	KinkyDungeonDressPlayer();
	if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/StoneDoor_Close.ogg");

	KinkyDungeonSaveGame();

	//if (KinkyDungeonMapGet(nearestJail.x, nearestJail.y) != "B") {
	// KinkyDungeonCreateMap(params, MiniGameKinkyDungeonLevel);
	//} else {
	KinkyDungeonPlayerEntity.x = nearestJail.x;
	KinkyDungeonPlayerEntity.y = nearestJail.y;
	let leash = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (leash && (leash.tx || leash.ty)) {
		leash.tx = undefined;
		leash.ty = undefined;
	}
	KDGameData.KinkyDungeonSpawnJailers = KDGameData.KinkyDungeonSpawnJailersMax - 1;

	// Lock all jail doors
	for (let X = 1; X < KinkyDungeonGridWidth - 1; X++)
		for (let Y = 1; Y < KinkyDungeonGridHeight - 1; Y++) {
			let tile = KinkyDungeonTiles.get(X + "," + Y);
			if (tile && tile.Jail && tile.ReLock && (KinkyDungeonMapGet(X, Y) == 'd' || KinkyDungeonMapGet(X, Y) == 'D')) {
				KinkyDungeonMapSet(X, Y, 'D');
				if (tile && !tile.Lock)
					tile.Lock = "Red";
			}
		}

	let enemies = [];
	for (let e of  KinkyDungeonEntities) {
		if (!e.summoned) { // (e.Enemy.tags.has("jail") || e.Enemy.tags.has("jailer"))
			if (KDistChebyshev(e.x - nearestJail.x, e.y - nearestJail.y) <= KinkyDungeonJailLeashX + 1) {
				let p = KinkyDungeonGetRandomEnemyPoint(true);
				if (p) {
					e.x = p.x;
					e.y = p.y;
					e.path = undefined;
					e.gx = e.x;
					e.gy = e.y;
				}

			}
			if (e.hostile < 9000) e.hostile = 0;
			enemies.push(e);
		}
	}
	KinkyDungeonEntities = enemies;
}
