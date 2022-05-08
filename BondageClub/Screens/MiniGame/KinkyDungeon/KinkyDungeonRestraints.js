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
let KinkyDungeonKeyPickBreakAmountBase = 12; // Number of tries per pick on average 5-11
let KinkyDungeonPickBreakProgress = 0;
let KinkyDungeonKnifeBreakAmount = 10; // Number of tries per knife on average 6-12
let KinkyDungeonKnifeBreakAmountBase = 10; // Number of tries per knife on average 6-12
let KinkyDungeonKnifeBreakProgress = 0;
let KinkyDungeonEnchKnifeBreakAmount = 24; // Number of tries per knife on average
let KinkyDungeonEnchKnifeBreakAmountBase = 24; // Number of tries per knife on average
let KinkyDungeonEnchKnifeBreakProgress = 0;

let KinkyDungeonMaxImpossibleAttempts = 3; // base, more if the item is close to being impossible

let KinkyDungeonEnchantedKnifeBonus = 0.1; // Bonus whenever you have an enchanted knife

let KDLocksmithBonus = 0.15; // Locksmith background
let KDLocksmithSpeedBonus = 1.1;
let KDCluelessBonus = -0.2; // Clueless background
let KDCluelessSpeedBonus = 0.5;

let KDFlexibleBonus = 0.1;
let KDFlexibleSpeedBonus = 1.5;
let KDInflexibleBonus = -0.1;
let KDInflexibleSpeedBonus = 0.75;

let KDUnchainedBonus = 0.15;
let KDDamselBonus = -0.05;
let KDDamselPickAmount = 6;
let KDArtistBonus = 0.15;
let KDBunnyBonus = -0.05;
let KDBunnyKnifeAmount = 5;
let KDBunnyEnchKnifeAmount = 12;
let KDSlipperyBonus = 0.15;
let KDDollBonus = -0.05;
let KDEscapeeBonus = 0.15;
let KDDragonBonus = -0.05;

let KDStrongBonus = 0.2;
let KDWeakBonus = -0.15;

let KDBondageLoverAmount = 1;

/**
 * @type {Map<string, restraint>}
 */
let KinkyDungeonRestraintsCache = new Map();

/**
 * gets a restraint
 * @param {item} item
 * @returns {restraint}
 */
function KDRestraint(item) {
	return KinkyDungeonRestraintsCache.get(item.name);
}


// Format: strict group => [list of groups the strictness applies to]
const KinkyDungeonStrictnessTable = new Map([
	["ItemHood", ["ItemHead", "ItemEars","ItemMouth","ItemMouth2","ItemMouth3"]],
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

/**
 * @type {Map<string, {r: restraint, w:number}[]>}
 */
let KDRestraintsCache = new Map();

/**
 *
 * @param {entity} Entity
 * @param {number} CamX
 * @param {number} CamY
 * @returns {void}
 */
function KinkyDungeonDrawTether(Entity, CamX, CamY) {
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv && KDRestraint(inv).tether && inv.tx && inv.ty) {
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
				// @ts-ignore
				MainCanvas.strokeStyle = KDRestraint(inv).Color[0] ? KDRestraint(inv).Color[0] : KDRestraint(inv).Color;//(color == "Default") ? "#aaaaaa" : color;
				MainCanvas.stroke();
			}
			return;
		}
	}
}

/**
 *
 * @param {boolean} Msg
 * @param {entity} Entity
 * @param {number} [xTo]
 * @param {number} [yTo]
 * @returns {boolean}
 */
function KinkyDungeonUpdateTether(Msg, Entity, xTo, yTo) {
	let exceeded = false;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).tether && (inv.tx && inv.ty || inv.tetherToLeasher || inv.tetherToGuard)) {
			let tether = inv.tetherLength ? inv.tetherLength : KDRestraint(inv).tether;

			if (inv.tetherToLeasher && KinkyDungeonLeashingEnemy()) {
				inv.tx = KinkyDungeonLeashingEnemy().x;
				inv.ty = KinkyDungeonLeashingEnemy().y;
			} else if (inv.tetherToLeasher && !KinkyDungeonLeashingEnemy()) {
				inv.tetherToLeasher = undefined;
				inv.tx = undefined;
				inv.ty = undefined;
			}
			if (inv.tetherToGuard && KinkyDungeonJailGuard()) {
				inv.tx = KinkyDungeonJailGuard().x;
				inv.ty = KinkyDungeonJailGuard().y;
			} else if (inv.tetherToGuard && !KinkyDungeonJailGuard()) {
				inv.tetherToGuard = undefined;
				inv.tx = undefined;
				inv.ty = undefined;
			}

			if (xTo || yTo) {// This means we arre trying to move
				if (KDistChebyshev(xTo-inv.tx, yTo-inv.ty) > KDRestraint(inv).tether) {
					if (Msg) KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonTetherTooShort").replace("TETHER", TextGet("Restraint" + inv.name)), "red", 2, true);
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
							if (Msg) KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonTetherPull").replace("TETHER", TextGet("Restraint" + inv.name)), "red", 2, true);
						}
					}
				}
			}
		}
	}

	return exceeded;
}


/**
 * Gets the length of the neck tether
 * @returns {number}
 */
function KinkyDungeonTetherLength() {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && KDRestraint(inv).tether && inv.tx && inv.ty) {
		return KDRestraint(inv).tether;
	}
	return undefined;
}

/**
 *
 * @param {number} [modifier]
 * @returns {number}
 */
function KinkyDungeonKeyGetPickBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonPickBreakProgress += mult;

	if (KinkyDungeonPickBreakProgress > KinkyDungeonKeyPickBreakAmount/1.5) chance = (KinkyDungeonPickBreakProgress - KinkyDungeonKeyPickBreakAmount/1.5) / (KinkyDungeonKeyPickBreakAmount + 1);

	return chance;
}

/**
 *
 * @param {number} [modifier]
 * @returns {number}
 */
function KinkyDungeonGetKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonKnifeBreakProgress += mult;

	if (KinkyDungeonKnifeBreakProgress > KinkyDungeonKnifeBreakAmount/1.5) chance = (KinkyDungeonKnifeBreakProgress - KinkyDungeonKnifeBreakAmount/1.5) / (KinkyDungeonKnifeBreakAmount + 1);

	return chance;
}

/**
 *
 * @param {number} [modifier]
 * @returns {number}
 */
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

/**
 *
 * @param {item} item
 * @param {string} lock
 */
function KinkyDungeonLock(item, lock) {
	if (InventoryGet(KinkyDungeonPlayer, KDRestraint(item).Group) && lock != "") {
		if (KinkyDungeonIsLockable(KDRestraint(item))) {
			item.lock = lock;
			if (lock == "Gold") item.lockTimer = Math.min(KinkyDungeonMaxLevel - 1, MiniGameKinkyDungeonLevel + 2);
			InventoryLock(KinkyDungeonPlayer, InventoryGet(KinkyDungeonPlayer, KDRestraint(item).Group), "IntricatePadlock", Player.MemberNumber, true);
			item.pickProgress = 0;
			if (!KinkyDungeonRestraintsLocked.includes(KDRestraint(item).Group))
				InventoryLock(Player, InventoryGet(Player, KDRestraint(item).Group), "IntricatePadlock", null, true);
		}
	} else {
		item.lock = lock;
		InventoryUnlock(KinkyDungeonPlayer, KDRestraint(item).Group);
		if (!KinkyDungeonRestraintsLocked.includes(KDRestraint(item).Group))
			InventoryUnlock(Player, KDRestraint(item).Group);
	}

}

/**
 *
 * @param {string} shrine
 * @returns {item[]}
 */
function KinkyDungeonGetRestraintsWithShrine(shrine) {
	/**
	 * @type {item[]}
	 */
	let ret = [];

	for (let item of KinkyDungeonAllRestraint()) {
		if (KDRestraint(item).shrine && KDRestraint(item).shrine.includes(shrine) && item.lock != "Gold") {
			ret.push(item);
		}
	}

	return ret;
}

/**
 *
 * @param {string} shrine
 * @returns {number}
 */
function KinkyDungeonRemoveRestraintsWithShrine(shrine) {
	let count = 0;

	for (let i = 0; i < 10; i++) {
		for (let item of KinkyDungeonAllRestraint()) {
			if (KDRestraint(item).shrine && KDRestraint(item).shrine.includes(shrine) && item.lock != "Gold") {
				KinkyDungeonRemoveRestraint(KDRestraint(item).Group, false, false, false, true);
				KDSendStatus('escape', item.name, "shrine_" + shrine);
				count++;
			}
		}
	}


	return count;
}

/**
 *
 * @param {string} shrine
 * @returns {number}
 */
function KinkyDungeonUnlockRestraintsWithShrine(shrine) {
	let count = 0;

	for (let item of KinkyDungeonAllRestraint()) {
		if (item.lock && KDRestraint(item).shrine && KDRestraint(item).shrine.includes(shrine) && item.lock != "Gold") {

			KinkyDungeonLock(item, "");
			count++;
		}
	}

	return count;
}

/**
 *
 * @returns {item[]}
 */
function KinkyDungeonPlayerGetLockableRestraints() {
	/**
	 * @type {item[]}
	 */
	let ret = [];

	for (let item of KinkyDungeonAllRestraint()) {
		if (!item.lock && KDRestraint(item).escapeChance && KDRestraint(item).escapeChance.Pick != null) {
			ret.push(item);
		}
	}

	return ret;
}

/**
 *
 * @param {string} lock
 */
function KinkyDungeonRemoveKeys(lock) {
	if (lock.includes("Red")) KinkyDungeonRedKeys -= 1;
	if (lock.includes("Blue")) KinkyDungeonBlueKeys -= 1;
}

/**
 *
 * @param {string} lock
 * @returns {string}
 */
function KinkyDungeonGetKey(lock) {
	if (lock.includes("Red")) return "Red";
	if (lock.includes("Blue")) return "Blue";
	return "";
}

/**
 *
 * @returns {boolean}
 */
function KinkyDungeonHasGhostHelp() {
	return (KinkyDungeonTargetTile && KinkyDungeonTargetTile.Type == "Ghost" && KinkyDungeonGhostDecision <= 1);
}

/**
 *
 * @returns {boolean}
 */
function KinkyDungeonIsWearingLeash() {
	for (let restraint of KinkyDungeonAllRestraint()) {
		if (KDRestraint(restraint) && KDRestraint(restraint).leash) {
			return true;
		}
	}
	return false;
}

/**
 *
 * @returns {boolean}
 */
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

/**
 *
 * @param {boolean} [ApplyGhost]
 * @returns {boolean}
 */
function KinkyDungeonIsHandsBound(ApplyGhost) {
	let blocked = InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands");
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).bindhands) {
			blocked = true;
			break;
		}
	}
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		blocked;
}

/**
 *
 * @param {boolean} [ApplyGhost]
 * @returns {boolean}
 */
function KinkyDungeonIsArmsBound(ApplyGhost) {
	let blocked = InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemArms");
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).bindarms) {
			blocked = true;
			break;
		}
	}
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		blocked;
}

/**
 *
 * @param {boolean} ApplyGhost
 * @param {string} Group
 * @returns {number}
 */
function KinkyDungeonStrictness(ApplyGhost, Group) {
	if (ApplyGhost && KinkyDungeonHasGhostHelp()) return 0;
	let strictness = 0;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).Group != Group && KDRestraint(inv).strictness && KDRestraint(inv).strictness > strictness)  {
			let strictGroups = KinkyDungeonStrictnessTable.get(KDRestraint(inv).Group);
			if (strictGroups) {
				for (let s of strictGroups) {
					if (s == Group) {
						strictness += KDRestraint(inv).strictness;
						break;
					}
				}
			}
		}
	}
	return strictness;
}

/**
 * Gets the list of restraint nammes affecting the Group
 * @param {string} Group
 * @returns {string[]}
 */
function KinkyDungeonGetStrictnessItems(Group) {
	let list = [];
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).Group != Group && KDRestraint(inv).strictness)  {
			let strictGroups = KinkyDungeonStrictnessTable.get(KDRestraint(inv).Group);
			if (strictGroups) {
				for (let s of strictGroups) {
					if (s == Group) {
						list.push(KDRestraint(inv).name);
						break;
					}
				}
			}
		}
	}
	return list;
}


/**
 *
 * @returns {number}
 */
function KinkyDungeonGetPickBaseChance() {
	let bonus = 0;
	if (KinkyDungeonStatsChoice.get("Locksmith")) bonus += KDLocksmithBonus;
	if (KinkyDungeonStatsChoice.get("Clueless")) bonus += KDCluelessBonus;
	if (KinkyDungeonStatsChoice.get("LocksmithMaster")) bonus += 0.15;
	return 0.33 / (1.0 + 0.02 * MiniGameKinkyDungeonLevel) + bonus;
}

/**
 *
 * @returns {boolean}
 */
function KinkyDungeonPickAttempt() {
	let Pass = "Fail";
	let escapeChance = KinkyDungeonGetPickBaseChance();
	let cost = KinkyDungeonStatStaminaCostPick;
	let lock = KinkyDungeonTargetTile.Lock;
	if (!KinkyDungeonTargetTile.pickProgress) KinkyDungeonTargetTile.pickProgress = 0;

	if (!lock) return;

	KinkyDungeonInterruptSleep();

	if (lock.includes("Blue")) {
		if ((KinkyDungeonBlindLevel < 1) || !lock.includes("Blue"))
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonBlindLevel > 0) ? "Unknown" : lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleCantPickBlueLock"), "orange", 2);
		Pass = "Fail";
	}

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	let strict = KinkyDungeonStrictness(false, "ItemHands");
	if (!strict) strict = 0;
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.0, escapeChance - 0.25);
	if (handsBound && strict < 0.5) escapeChance = Math.max(0, escapeChance - 0.5);
	else if (strict) escapeChance = Math.max(0, escapeChance - strict);

	escapeChance /= 1.0 + KinkyDungeonStatDistraction/KinkyDungeonStatDistractionMax*KinkyDungeonDistractionUnlockSuccessMod;

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
	} else if (!KinkyDungeonStatsChoice.get("Psychic") && (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound))) {
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

/**
 *
 * @param {string} lock
 * @returns {boolean}
 */
function KinkyDungeonUnlockAttempt(lock) {
	let Pass = "Fail";
	let escapeChance = 1.0;

	KinkyDungeonInterruptSleep();

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	let strict = KinkyDungeonStrictness(false, "ItemHands");
	if (!strict) strict = 0;
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.1, escapeChance - 0.25);
	if (handsBound && strict < 0.5) escapeChance = Math.max(0, escapeChance - 0.5);
	else if (strict) escapeChance = Math.max(0, escapeChance - strict);

	if (KinkyDungeonStatsChoice.get("Psychic")) escapeChance = Math.max(escapeChance, 0.33);
	if (KDRandom() < escapeChance)
		Pass = "Success";
	KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonStruggleUnlock" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	if (Pass == "Success") {
		KinkyDungeonRemoveKeys(lock);
		if (lock == "Blue" && KinkyDungeonTargetTile && KinkyDungeonTargetTile.Loot == "normal") KinkyDungeonSpecialLoot = true;
		else if (lock == "Red" && KinkyDungeonTargetTile && KinkyDungeonTargetTile.Loot == "normal") KinkyDungeonLockedLoot = true;
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
		return true;
	} else if (!KinkyDungeonStatsChoice.get("Psychic") && (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound))) {
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
/**
 *
 * @param {string} struggleGroup
 * @param {string} StruggleType
 * @returns {string}
 */
function KinkyDungeonStruggle(struggleGroup, StruggleType) {


	let restraint = KinkyDungeonGetRestraintItem(struggleGroup);
	let failSuffix = "";
	if (restraint && KDRestraint(restraint).failSuffix && KDRestraint(restraint).failSuffix[StruggleType]) {
		failSuffix = KDRestraint(restraint).failSuffix[StruggleType];
	}
	KinkyDungeonCurrentEscapingItem = restraint;
	KinkyDungeonCurrentEscapingMethod = StruggleType;
	KinkyDungeonStruggleTime = CommonTime() + 750;
	let Pass = "Fail";
	let restraintEscapeChancePre = KDRestraint(restraint).escapeChance[StruggleType] != undefined ? KDRestraint(restraint).escapeChance[StruggleType] : 1.0;
	let helpChance = (KDRestraint(restraint).helpChance != undefined && KDRestraint(restraint).helpChance[StruggleType] != undefined) ? KDRestraint(restraint).helpChance[StruggleType] : 0.0;
	if (KinkyDungeonHasGhostHelp() && helpChance) {
		restraintEscapeChancePre = helpChance;
	}

	/**
	 * @type {{
	 * struggleType: string,
	 * escapeChance: number,
	 * origEscapeChance: number,
	 * helpChance: number,
	 * strict: number,
	 * hasEdge: boolean,
	 * restraintEscapeChance: number,
	 * cost: number,
	 * }}
	 */
	let data = {
		struggleType: StruggleType,
		escapeChance: restraintEscapeChancePre,
		origEscapeChance: restraintEscapeChancePre,
		helpChance: helpChance,
		strict: KinkyDungeonStrictness(true, struggleGroup),
		hasEdge: KinkyDungeonHasHook(),
		restraintEscapeChance: KDRestraint(restraint).escapeChance[StruggleType],
		cost: KinkyDungeonStatStaminaCostStruggle,
	};

	if (StruggleType == "Cut") data.cost = KinkyDungeonStatStaminaCostTool;
	else if (StruggleType == "Pick") data.cost = KinkyDungeonStatStaminaCostPick;
	else if (StruggleType == "Remove") data.cost = KinkyDungeonStatStaminaCostRemove;
	else if (StruggleType == "Unlock") data.cost = KinkyDungeonStatStaminaCostPick;
	KinkyDungeonInterruptSleep();
	if (StruggleType == "Unlock") data.cost = 0;
	KinkyDungeonSendEvent("beforeStruggleCalc", data);
	if (!restraint.removeProgress) restraint.removeProgress = 0;
	if (!restraint.pickProgress) restraint.pickProgress = 0;
	if (!restraint.struggleProgress) restraint.struggleProgress = 0;
	if (!restraint.unlockProgress) restraint.unlockProgress = 0;
	if (!restraint.cutProgress) restraint.cutProgress = 0;
	if (StruggleType == "Pick") {
		if (KinkyDungeonStatsChoice.get("Locksmith")) data.escapeChance += KDLocksmithBonus;
		if (KinkyDungeonStatsChoice.get("Clueless")) data.escapeChance += KDCluelessBonus;
	} else if (StruggleType == "Remove" || StruggleType == "Unlock") {
		if (KinkyDungeonStatsChoice.get("Flexible")) data.escapeChance += KDFlexibleBonus;
		if (KinkyDungeonStatsChoice.get("Inflexible")) data.escapeChance += KDInflexibleBonus;
	} else if (StruggleType == "Struggle") {
		if (KinkyDungeonStatsChoice.get("Strong")) data.escapeChance += KDStrongBonus;
		if (KinkyDungeonStatsChoice.get("Weak")) data.escapeChance += KDWeakBonus;
	}
	if (KinkyDungeonStatsChoice.get("Unchained") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Metal"))
		data.escapeChance += KDUnchainedBonus;
	if (KinkyDungeonStatsChoice.get("Damsel") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Metal")) {
		data.escapeChance /= 2;
		data.escapeChance += KDDamselBonus;
	}
	if (KinkyDungeonStatsChoice.get("HighSecurity")) {
		KinkyDungeonKeyPickBreakAmount = KDDamselPickAmount;
	} else {
		KinkyDungeonKeyPickBreakAmount = KinkyDungeonKeyPickBreakAmountBase;
	}

	if (KinkyDungeonStatsChoice.get("FreeSpirit") && (KDRestraint(restraint).chastity || KDRestraint(restraint).chastitybra)) data.escapeChance += 0.5;
	if (KinkyDungeonStatsChoice.get("Artist") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Rope"))
		data.escapeChance += KDArtistBonus;
	if (KinkyDungeonStatsChoice.get("Bunny") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Rope")) {
		data.escapeChance /= 2;
		data.escapeChance += KDBunnyBonus;
	}
	if (KinkyDungeonStatsChoice.get("ShoddyKnives")) {
		KinkyDungeonKnifeBreakAmount = KDBunnyKnifeAmount;
		KinkyDungeonEnchKnifeBreakAmount = KDBunnyEnchKnifeAmount;
	} else {
		KinkyDungeonKnifeBreakAmount = KinkyDungeonKnifeBreakAmountBase;
		KinkyDungeonEnchKnifeBreakAmount = KinkyDungeonEnchKnifeBreakAmountBase;
	}

	if (KinkyDungeonStatsChoice.get("Slippery") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Latex"))
		data.escapeChance += KDSlipperyBonus;
	else if (KinkyDungeonStatsChoice.get("Doll") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Latex")) {
		data.escapeChance /= 2;
		data.escapeChance += KDDollBonus;
	}

	if (KinkyDungeonStatsChoice.get("Escapee") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Leather"))
		data.escapeChance += KDEscapeeBonus;
	else if (KinkyDungeonStatsChoice.get("Dragon") && KDRestraint(restraint).shrine && KDRestraint(restraint).shrine.includes("Leather")) {
		data.escapeChance /= 2;
		data.escapeChance += KDDragonBonus;
	}


	data.origEscapeChance = data.escapeChance;

	let increasedAttempts = false;

	let handsBound = KinkyDungeonIsHandsBound(true);

	// Bonuses go here. Buffs dont get added to orig escape chance, but
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostStruggle")) data.escapeChance += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostStruggle");
	if (StruggleType == "Cut") {
		if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCutting")) data.escapeChance += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCutting");
		if (KinkyDungeonHasGhostHelp()) {
			let maxBonus = 0;
			for (let inv of KinkyDungeonAllWeapon()) {
				if (KDWeapon(inv).cutBonus > maxBonus) maxBonus = KDWeapon(inv).cutBonus;
			}
			data.escapeChance += maxBonus;
			data.origEscapeChance += maxBonus;
		} else if (KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.cutBonus) {
			data.escapeChance += KinkyDungeonPlayerWeapon.cutBonus;
			data.origEscapeChance += KinkyDungeonPlayerWeapon.cutBonus;
		}

		if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCuttingMinimum")) data.escapeChance = Math.max(data.escapeChance, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCuttingMinimum"));
	}
	if (StruggleType == "Cut" && KinkyDungeonEnchantedBlades > 0) {
		data.escapeChance += KinkyDungeonEnchantedKnifeBonus;
		data.origEscapeChance += KinkyDungeonEnchantedKnifeBonus;
	}

	let escapeSpeed = 1.0;

	// Finger extensions will help if your hands are unbound. Some items cant be removed without them!
	// Mouth counts as a finger extension on your hands if your arms aren't tied
	let armsBound = KinkyDungeonIsArmsBound(true);
	if (StruggleType == "Remove" &&
		(!handsBound && (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0 || KinkyDungeonLockpicks > 0)
		|| (struggleGroup == "ItemHands" && KinkyDungeonCanTalk() && !armsBound))) {
		data.escapeChance = Math.max(data.escapeChance, Math.min(1, data.escapeChance + 0.15));
		data.origEscapeChance = Math.max(data.origEscapeChance, Math.min(1, data.origEscapeChance + 0.15));
	}

	// You can tug using unbound hands
	if (StruggleType == "Struggle" &&
		(!handsBound && !armsBound && struggleGroup != "ItemHands" && struggleGroup != "ItemArms")) {
		escapeSpeed *= 1.4;
		data.escapeChance = Math.max(data.escapeChance, Math.min(1, data.escapeChance + 0.05));
		data.origEscapeChance = Math.max(data.origEscapeChance, Math.min(1, data.origEscapeChance + 0.05));
	}

	// Psychic doesnt modify original chance, so that you understand its the perk helping you
	if (StruggleType == "Unlock" && KinkyDungeonStatsChoice.get("Psychic")) data.escapeChance = Math.max(data.escapeChance, 0.25);



	if (data.escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts) {
			increasedAttempts = true;
			restraint.attempts += 0.5;
			if (StruggleType == "Struggle") restraint.attempts += 0.5;
			if (data.escapeChance <= -0.5) restraint.attempts += 0.5;
		} else {
			let typesuff = "";
			if (data.origEscapeChance <= 0 && data.helpChance) typesuff = "3";
			else if (KDRestraint(restraint).specStruggleTypes && KDRestraint(restraint).specStruggleTypes.includes(StruggleType)) typesuff = "2";
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			if (typesuff == "" && failSuffix) typesuff = failSuffix;
			if (typesuff == "" && KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) typesuff = typesuff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "Impossible" + typesuff), "red", 2);
			KinkyDungeonLastAction = "Struggle";
			KinkyDungeonSendEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			KinkyDungeonChangeStamina(data.cost);
			if (KinkyDungeonStatsChoice.get("BondageLover")) KinkyDungeonChangeDistraction(KDBondageLoverAmount);
			KinkyDungeonAdvanceTime(1);
			return "Impossible";
		}
	}

	// Struggling is unaffected by having arms bound
	let minAmount = 0.1 - Math.max(0, 0.01*KDRestraint(restraint).power);
	if (StruggleType == "Remove" && !data.hasEdge) minAmount = 0;
	if (!KinkyDungeonHasGhostHelp() && StruggleType != "Struggle" && (struggleGroup != "ItemArms" && struggleGroup != "ItemHands" ) && !KinkyDungeonPlayer.CanInteract()) data.escapeChance /= 1.5;
	if (StruggleType != "Struggle" && struggleGroup != "ItemArms" && armsBound) data.escapeChance = Math.max(minAmount, data.escapeChance - 0.3);

	// Covered hands makes it harder to unlock, and twice as hard to remove
	if ((StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove") && struggleGroup != "ItemHands" && handsBound)
		data.escapeChance = (StruggleType == "Remove" && data.hasEdge) ? data.escapeChance / 2 : Math.max(0, data.escapeChance - 0.5);

	if (StruggleType == "Remove" && data.escapeChance == 0) {
		let typesuff = "";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
		if (typesuff == "" && KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) typesuff = typesuff + "Aroused";
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

	let possible = data.escapeChance > 0;
	// Strict bindings make it harder to escape
	if (data.strict) data.escapeChance = Math.max(0, data.escapeChance - data.strict);

	if (StruggleType == "Unlock" && KinkyDungeonStatsChoice.get("Psychic")) data.escapeChance = Math.max(data.escapeChance, 0.2);

	if (possible && data.escapeChance == 0) {
		let typesuff = "";
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
		if (typesuff == "" && KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) typesuff = typesuff + "Aroused";
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

	if (!KinkyDungeonHasGhostHelp() && (StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove")) data.escapeChance /= 1.0 + KinkyDungeonStatDistraction/KinkyDungeonStatDistractionMax*KinkyDungeonDistractionUnlockSuccessMod;

	// Items which require a knife are much harder to cut without one
	if (StruggleType == "Cut" && KinkyDungeonNormalBlades <= 0 && KinkyDungeonEnchantedBlades <= 0 && data.restraintEscapeChance > 0.01) data.escapeChance/= 5;

	if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, struggleGroup)) data.escapeChance = 0;

	// Blue locks make it harder to escape an item
	if (restraint.lock == "Blue" && (StruggleType == "Cut" || StruggleType == "Remove" || StruggleType == "Struggle")) data.escapeChance = Math.max(0, data.escapeChance - 0.15);

	// Gold locks are extremely magical.
	if (restraint.lock == "Gold" && (StruggleType == "Cut" || StruggleType == "Remove" || StruggleType == "Struggle")) data.escapeChance = Math.max(0, data.escapeChance - 0.3);

	if (StruggleType == "Cut" && struggleGroup != "ItemHands" && handsBound)
		data.escapeChance = data.escapeChance / 2;

	// Struggling is affected by tightness
	if (data.escapeChance > 0 && StruggleType == "Struggle") {
		for (let T = 0; T < restraint.tightness; T++) {
			data.escapeChance *= 0.8; // Tougher for each tightness, however struggling will reduce the tightness
		}
	}

	if (StruggleType == "Pick") data.escapeChance *= KinkyDungeonGetPickBaseChance();

	if (StruggleType == "Unlock" && KinkyDungeonStatsChoice.get("Psychic")) data.escapeChance = Math.max(data.escapeChance, 0.15);

	let belt = null;
	let bra = null;

	if (struggleGroup == "ItemVulva" || struggleGroup == "ItemVulvaPiercings" || struggleGroup == "ItemButt") belt = KinkyDungeonGetRestraintItem("ItemPelvis");
	if (belt && KDRestraint(belt) && KDRestraint(belt).chastity) data.escapeChance = 0.0;

	if (struggleGroup == "ItemNipples" || struggleGroup == "ItemNipplesPiercings") bra = KinkyDungeonGetRestraintItem("ItemBreast");
	if (bra && KDRestraint(bra) && KDRestraint(bra).chastity) data.escapeChance = 0.0;

	if (data.escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts || increasedAttempts) {
			if (!increasedAttempts) {
				restraint.attempts += 0.5;
				if (data.escapeChance <= -0.5) restraint.attempts += 0.5;
			}
		} else {
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			let suff = "";
			if (suff == "" && failSuffix) suff = failSuffix;
			if (KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "ImpossibleBound" + suff), "red", 2);
			KinkyDungeonLastAction = "Struggle";
			KinkyDungeonSendEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			KinkyDungeonChangeStamina(data.cost);
			if (KinkyDungeonStatsChoice.get("BondageLover")) KinkyDungeonChangeDistraction(KDBondageLoverAmount);
			KinkyDungeonAdvanceTime(1);
			return "Impossible";
		}
	}

	if (KDRestraint(restraint) && KDRestraint(restraint).escapeMult != undefined) data.escapeChance *= KDRestraint(restraint).escapeMult;


	if (KDRestraint(restraint) && KDRestraint(restraint).struggleMinSpeed && KDRestraint(restraint).struggleMinSpeed[StruggleType] != undefined)
		data.escapeChance = Math.max(data.escapeChance, KDRestraint(restraint).struggleMinSpeed[StruggleType]);

	if (KDRestraint(restraint) && KDRestraint(restraint).struggleMult && KDRestraint(restraint).struggleMult[StruggleType] != undefined)
		data.escapeChance *= KDRestraint(restraint).struggleMult[StruggleType];

	if (KDRestraint(restraint) && KDRestraint(restraint).struggleMaxSpeed && KDRestraint(restraint).struggleMaxSpeed[StruggleType] != undefined)
		data.escapeChance = Math.min(data.escapeChance, KDRestraint(restraint).struggleMaxSpeed[StruggleType]);

	// Handle cases where you can't even attempt to unlock
	if ((StruggleType == "Unlock" && !((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)))
		|| (StruggleType == "Pick" && (restraint.lock == "Blue" || restraint.lock == "Gold"))) {
		if (StruggleType == "Unlock" && ((KinkyDungeonBlindLevel < 1) || !(restraint.lock.includes("Blue") || restraint.lock.includes("Gold"))))
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonBlindLevel > 0) ? "Unknown" : restraint.lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggleCantPick" + restraint.lock + "Lock"), "orange", 2);
	} else {

		// Main struggling block
		if (!KinkyDungeonHasStamina(-data.cost, true)) {
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			KinkyDungeonWaitMessage(true);
		} else {
			// Pass block
			if (((StruggleType == "Cut" && restraint.cutProgress >= 1 - data.escapeChance)
					|| (StruggleType == "Pick" && restraint.pickProgress >= 1 - data.escapeChance)
					|| (StruggleType == "Unlock" && restraint.unlockProgress >= 1 - data.escapeChance)
					|| (StruggleType == "Remove" && restraint.removeProgress >= 1 - data.escapeChance)
					|| (restraint.struggleProgress >= 1 - data.escapeChance))
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
					let trap = restraint.trap;
					KDSendStatus('escape', restraint.name, StruggleType);
					KinkyDungeonRemoveRestraint(KDRestraint(restraint).Group, StruggleType != "Cut");
					if (trap) {
						let summon = KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, trap, 1, 2.5);
						if (summon) {
							KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonSummonTrapMonster"), "red", 2);
						}
					}
				}
			} else {
				// Failure block for the different failure types
				if (StruggleType == "Cut") {
					let breakchance = 0;
					if (KinkyDungeonNormalBlades > 0 && !KDRestraint(restraint).magic) breakchance = KinkyDungeonGetKnifeBreakChance();
					else if (KinkyDungeonEnchantedBlades > 0) breakchance = KinkyDungeonGetEnchKnifeBreakChance();
					if (KDRandom() < breakchance) {
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						if (KDRestraint(restraint).magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1;
						else {
							if (KinkyDungeonNormalBlades > 0 && (!KDRestraint(restraint).magic || (KinkyDungeonEnchantedBlades == 0))) {
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
						if (KDRestraint(restraint).magic && KinkyDungeonEnchantedBlades > 0) {
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
						if (KDRestraint(restraint).magic && KinkyDungeonEnchantedBlades == 0) {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/MagicSlash.ogg");
							Pass = "Fail";
						} else {
							if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
							let mult = 1.0;
							if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
							if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
							restraint.cutProgress += escapeSpeed * mult * data.escapeChance * (0.3 + 0.2 * KDRandom() + 0.6 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
						}
					}
				} else if (StruggleType == "Pick") {
					if (KDRandom() < KinkyDungeonKeyGetPickBreakChance() || restraint.lock == "Blue" || restraint.lock == "Gold") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						KinkyDungeonLockpicks -= 1;
						KinkyDungeonPickBreakProgress = 0;
					} else if (!KinkyDungeonStatsChoice.get("Psychic") && (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound))) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						KinkyDungeonDropItem({name: "Pick"}, KinkyDungeonPlayerEntity, true);
						KinkyDungeonLockpicks -= 1;
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						if (!restraint.pickProgress) restraint.pickProgress = 0;
						let mult = 1.0;
						if (KinkyDungeonStatsChoice.get("Locksmith")) mult *= KDLocksmithSpeedBonus;
						if (KinkyDungeonStatsChoice.get("Clueless")) mult *= KDCluelessSpeedBonus;
						restraint.pickProgress += escapeSpeed * mult * data.escapeChance * (0.5 + 1.0 * KDRandom());
					}
				} else if (StruggleType == "Unlock") {
					if (!KinkyDungeonStatsChoice.get("Psychic") && (handsBound || (armsBound && KDRandom() < KinkyDungeonItemDropChanceArmsBound))) {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						Pass = "Drop";
						let keytype = KinkyDungeonGetKey(restraint.lock);
						KinkyDungeonDropItem({name: keytype+"Key"}, KinkyDungeonPlayerEntity, true);
						if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
						else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
					} else {
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						let mult = 1.0;
						if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
						if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
						restraint.unlockProgress += escapeSpeed * mult * data.escapeChance * (0.75 + 0.5 * KDRandom());
					}
				} else if (StruggleType == "Remove") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");let mult = 1.0;
					if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
					if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
					restraint.removeProgress += escapeSpeed * mult * data.escapeChance * (0.55 + 0.2 * KDRandom() + 0.35 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				} else if (StruggleType == "Struggle") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");let mult = 1.0;
					if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
					if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
					restraint.struggleProgress += escapeSpeed * mult * data.escapeChance * (0.4 + 0.3 * KDRandom() + 0.4 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				}
			}

			// Aftermath
			let suff = "";
			if (Pass == "Fail" && data.escapeChance > 0 && data.origEscapeChance <= 0) {
				if (KinkyDungeonHasGhostHelp() && data.helpChance) suff = "3";
				else suff = "2";
			} else if (Pass == "Fail") {
				if (suff == "" && failSuffix) suff = failSuffix;
			}
			if ((suff == "" || (Pass == "Fail" && suff == failSuffix)) && (Pass == "Fail" || Pass == "Success") && KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonStruggle" + StruggleType + Pass + suff).replace("TargetRestraint", TextGet("Restraint" + KDRestraint(restraint).name)), (Pass == "Success") ? "lightgreen" : "red", 2);

			KinkyDungeonChangeStamina(data.cost);
			if (KinkyDungeonStatsChoice.get("BondageLover")) KinkyDungeonChangeDistraction(KDBondageLoverAmount);

			if (Pass != "Success") {
				// Reduce the progress
				if (StruggleType == "Struggle") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress * 0.7 - 0.01);
					//restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.9 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.5 - 0.01);
				} else if (StruggleType == "Pick") {
					//restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					//restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.5 - 0.01);
				} else if (StruggleType == "Unlock") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress* 0.7 - 0.01);
					//restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
				} if (StruggleType == "Remove") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress* 0.7 - 0.01);
					//restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.7 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.5 - 0.01);
				}

				// reduces the tightness of the restraint slightly
				if (StruggleType == "Struggle") {
					let tightness_reduction = 1;

					// eslint-disable-next-line no-unused-vars
					for (let _item of KinkyDungeonAllRestraint()) {
						tightness_reduction *= 0.8; // Reduced tightness reduction for each restraint currently worn
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

/**
 * "Return the first restraint item in the game that belongs to the given group."
 * @param {string} group - The group of the restraint item you want to get.
 * @returns {item} The item that matches the group.
 */
function KinkyDungeonGetRestraintItem(group) {
	for (let item of KinkyDungeonAllRestraint()) {
		if (item.type == Restraint && KDRestraint(item).Group == group) {
			return item;
		}
	}
	return null;
}

/**
 * Refreshes the restraints map
 */
function KinkyDungeonRefreshRestraintsCache() {
	KinkyDungeonRestraintsCache = new Map();
	for (let r of KinkyDungeonRestraints) {
		KinkyDungeonRestraintsCache.set(r.name, r);
	}
}


/**
 *
 * @param {string} Name
 * @returns {restraint}
 */
function KinkyDungeonGetRestraintByName(Name) {
	if (KinkyDungeonRestraintsCache.size > 0) {
		return KinkyDungeonRestraintsCache.get(Name);
	} else KinkyDungeonRefreshRestraintsCache();
}

/**
 *
 * @param {string} Lock
 * @returns {number}
 */
function KinkyDungeonGetLockMult(Lock) {
	if (Lock == "Red") return 2.0;
	if (Lock == "Blue") return 3.0;
	if (Lock == "Gold") return 3.25;

	return 1;
}

function KinkyDungeonGetRestraint(enemy, Level, Index, Bypass, Lock, RequireStamina, LeashingOnly) {
	let restraintWeightTotal = 0;
	if (KinkyDungeonStatsChoice.has("NoWayOut")) RequireStamina = false;
	let restraintWeights = [];
	let cache = KDRestraintsCache.get(enemy.name);
	let staminaPercent = (Math.min(KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax, 1 - KinkyDungeonStatDistraction / KinkyDungeonStatDistractionMax))
		/(1 + (KinkyDungeonGoddessRep.Ghost + 50)/100);

	if (KinkyDungeonSlowLevel > 0) staminaPercent = staminaPercent * (0.5 + 0.5 * Math.min(1, Math.max(0, 1 - KinkyDungeonSlowLevel/3)));

	//if (!cache || !enemy.name) {
	cache = [];
	let start2 = performance.now();
	for (let restraint of KinkyDungeonRestraints) {
		let effLevel = Level;
		if (KinkyDungeonStatsChoice.has("TightRestraints")) {
			effLevel *= KDTightRestraintsMult;
			effLevel += KDTightRestraintsMod;
		}
		if ((effLevel >= restraint.minLevel || KinkyDungeonNewGame > 0) && (!restraint.maxLevel || effLevel < restraint.maxLevel) && (restraint.allFloors || restraint.floors.get(Index))) {
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
	//}

	let start = performance.now();
	for (let r of cache) {
		let restraint = r.r;
		let currentRestraint = KinkyDungeonGetRestraintItem(restraint.Group);
		//let lockMult = currentRestraint ? KinkyDungeonGetLockMult(currentRestraint.lock) : 1;
		let newLock = Lock ? Lock : restraint.DefaultLock;
		let power = KinkyDungeonRestraintPower(currentRestraint, true);
		if ((!LeashingOnly || (restraint.Group == "ItemNeck" || restraint.Group == "ItemNeckRestraints"))
			&& (!RequireStamina || !restraint.maxstamina || staminaPercent <= restraint.maxstamina || (LeashingOnly && (restraint.Group == "ItemNeck" || restraint.Group == "ItemNeckRestraints")))
			&& (!currentRestraint || currentRestraint.type != Restraint ||
			(power <
			(((Lock || restraint.DefaultLock) && KinkyDungeonIsLockable(restraint)) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power)
				|| (currentRestraint && KDRestraint(currentRestraint) && KinkyDungeonLinkableAndStricter(KDRestraint(currentRestraint), restraint, currentRestraint.dynamicLink, currentRestraint.oldLock))))
			&& (!currentRestraint || !currentRestraint.dynamicLink || !currentRestraint.dynamicLink.includes(restraint.name))
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


	let selection = KDRandom() * restraintWeightTotal;

	for (let L = restraintWeights.length - 1; L >= 0; L--) {
		if (selection > restraintWeights[L].weight) {
			return restraintWeights[L].restraint;
		}
	}

}

// @ts-ignore
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
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).addTag)
			for (let tag of KDRestraint(inv).addTag) {
				if (!playerTags.get(tag)) playerTags.set(tag, true);
			}
		if (KDRestraint(inv).shrine)
			for (let tag of KDRestraint(inv).shrine) {
				if (!playerTags.get(tag)) playerTags.set(tag, true);
			}
	}
	if (KinkyDungeonStatsChoice.get("Deprived")) playerTags.set("NoVibes", true);
	if (KinkyDungeonStatsChoice.get("Unchained")) playerTags.set("Unchained", true);
	if (KinkyDungeonStatsChoice.get("Damsel")) playerTags.set("Damsel", true);

	let tags = [];
	KinkyDungeonAddTags(tags, MiniGameKinkyDungeonLevel);
	for (let t of tags) {
		playerTags.set(t, true);
	}
	return playerTags;
}

/**
 *
 * @param {item} item
 * @param {boolean} [NoLink]
 * @returns
 */
function KinkyDungeonRestraintPower(item, NoLink) {
	if (item && item.type == Restraint) {
		let lockMult = item ? KinkyDungeonGetLockMult(item.lock) : 1;
		let power = (item.lock ? KDRestraint(item).power * lockMult : KDRestraint(item).power);

		if (item.dynamicLink && item.dynamicLink.length > 0 && !NoLink) {
			let link = item.dynamicLink[item.dynamicLink.length - 1];
			if (!KinkyDungeonIsLinkable(KinkyDungeonGetRestraintByName(link), KDRestraint(item))) {
				let lock = (item.oldLock && item.oldLock.length > 0) ? item.oldLock[item.oldLock.length - 1] : "";
				let mult = lock ? KinkyDungeonGetLockMult(lock) : 1;
				power = Math.max(power, KDRestraint({name: link}).power * mult);
			}
		}
		return power;
	}
	return 0;
}

/**
 * @param {restraint} oldRestraint
 * @param {restraint} newRestraint
 * @param {string[]} [dynamicLink]
 * @param {string[]} [oldLock]
 * @param {string} [newLock]
 * @returns {boolean}
 */
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
			// Allow for a power multiplier, set to 20 currently for basically always cover
			let linkable = KinkyDungeonIsLinkable(oldRestraint, newRestraint);
			return KinkyDungeonGetLockMult(newLock) * newRestraint.power * (linkable ? 20 : 1) > power && linkable;
		}
	}
	return false;
}

function KinkyDungeonGenerateRestraintTrap() {
	let enemy = KinkyDungeonGetEnemy(["chestTrap"], MiniGameKinkyDungeonLevel, MiniGameKinkyDungeonCheckpoint, '0', ["chestTrap"]);
	if (enemy) return enemy.name;
	return "GreedyGhast";
}

/**
 * @param {restraint} restraint
 * @param {number} [Tightness]
 * @param {boolean} [Bypass]
 * @param {string} [Lock]
 * @param {boolean} [Keep]
 * @param {boolean} [Trapped]
 * @param {KinkyDungeonEvent[]} [events]
 * @param {string} [faction]
 * @returns {number}
 */
function KinkyDungeonAddRestraintIfWeaker(restraint, Tightness, Bypass, Lock, Keep, Trapped, events, faction) {
	let r = KinkyDungeonGetRestraintItem(restraint.Group);
	let power = KinkyDungeonRestraintPower(r);
	let newLock = (Lock && KinkyDungeonIsLockable(restraint)) ? Lock : restraint.DefaultLock;
	if (restraint.shrine && restraint.shrine.includes("Vibes") && KinkyDungeonPlayerTags.get("NoVibes")) return 0;
	if (restraint.arousalMode && !KinkyDungeonStatsChoice.get("arousalMode")) return 0;
	if (!r || (!r.dynamicLink || !r.dynamicLink.includes(restraint.name)) && !KDRestraint(r).enchanted
		&& ((power < ((newLock) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power))
			|| (r && KDRestraint(r) && KinkyDungeonLinkableAndStricter(KDRestraint(r), restraint, r.dynamicLink, r.oldLock)))) {
		let ret = KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep, false, true, events, faction);
		if (Trapped) {
			let rest = KinkyDungeonGetRestraintItem(restraint.Group);
			if (rest && KDRestraint(rest) && KDRestraint(rest).trappable && !rest.trap) {
				rest.trap = KinkyDungeonGenerateRestraintTrap();
			}
		}
		return ret;
	}
	return 0;
}

/**
 *
 * @param {restraint} oldRestraint
 * @param {restraint} newRestraint
 * @returns {boolean}
 */
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

/**
 * @param {restraint} restraint
 * @param {number} Tightness
 * @param {boolean} [Bypass]
 * @param {string} [Lock]
 * @param {boolean} [Keep]
 * @param {boolean} [Link]
 * @param {boolean} [SwitchItems]
 * @param {KinkyDungeonEvent[]} [events]
 * @param {string} [faction]
 * @returns
 */
function KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep, Link, SwitchItems, events, faction) {
	let start = performance.now();
	let tight = (Tightness) ? Tightness : 0;
	let AssetGroup = restraint.AssetGroup ? restraint.AssetGroup : restraint.Group;
	if (restraint) {
		if (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			KinkyDungeonEvasionPityModifier = 0;
			let r = KinkyDungeonGetRestraintItem(restraint.Group);
			let linkable = (!Link && r && KinkyDungeonIsLinkable(KDRestraint(r), restraint));
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

			let color = (typeof restraint.Color === "string") ? [restraint.Color] : restraint.Color;
			if (restraint.factionColor && faction && KinkyDungeonFactionColors[faction]) {
				for (let n of restraint.factionColor) {
					color[n] = KinkyDungeonFactionColors[faction][0]; // 0 is the primary color
				}
			}

			// If we did not link an item (or unlink one) then we proceed as normal
			if (!KinkyDungeonCancelFlag) {
				KinkyDungeonRemoveRestraint(restraint.Group, Keep, false);
				if (restraint.remove)
					for (let remove of restraint.remove) {
						InventoryRemove(KinkyDungeonPlayer, remove);
					}
				InventoryWear(KinkyDungeonPlayer, restraint.Asset, AssetGroup, color);
				KinkyDungeonSendFloater({x: 1100, y: 600 - KDRecentRepIndex * 40}, `+${TextGet("Restraint" + restraint.name)}!`, "pink", 5, true);
				KDRecentRepIndex += 1;
				let placed = InventoryGet(KinkyDungeonPlayer, AssetGroup);
				let placedOnPlayer = false;
				if (!placed) console.log(`Error placing ${restraint.name} on player!!!`);
				if (placed && ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(AssetGroup) && AssetGroup != "ItemHead" && InventoryAllow(
					Player, placed.Asset) &&
					(!InventoryGetLock(InventoryGet(Player, AssetGroup))
					|| (InventoryGetLock(InventoryGet(Player, AssetGroup)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, AssetGroup)).Asset.LoverOnly == false))) {
					InventoryWear(Player, restraint.Asset, AssetGroup, color);
					placedOnPlayer = true;
				}
				if (placed && !placed.Property) placed.Property = {};
				if (restraint.Type) {
					KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", AssetGroup);
					let options = window["Inventory" + ((AssetGroup.includes("ItemMouth")) ? "ItemMouth" : AssetGroup) + restraint.Asset + "Options"];
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
				if (color) {
					// @ts-ignore
					CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, color, AssetGroup);
					if (placedOnPlayer)
						// @ts-ignore
						CharacterAppearanceSetColorForGroup(Player, color, AssetGroup);
				}
				let item = {name: restraint.name, type: Restraint, events:events ? events : restraint.events, tightness: tight, lock: "", faction: faction};
				KinkyDungeonInventoryAdd(item);

				if (Lock) KinkyDungeonLock(item, Lock);
				else if (restraint.DefaultLock) KinkyDungeonLock(item, restraint.DefaultLock);
			} else if ((!Link && !linked) || SwitchItems) {
				KinkyDungeonCancelFlag = false;
				// Otherwise, if we did unlink an item, and we are not in the process of linking (very important to prevent loops)
				// Then we link the new item to the unlinked item if possible
				r = KinkyDungeonGetRestraintItem(restraint.Group);
				if (r && KDRestraint(r) && KinkyDungeonIsLinkable(KDRestraint(r), restraint))
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

/**
 * It removes a restraint from the player
 * @param {string} Group - The group of the item to remove.
 * @param {boolean} [Keep] - If true, the item will be kept in the player's inventory.
 * @param {boolean} [Add] - If true, the item will be added to the player's inventory.
 * @param {boolean} [NoEvent] - If true, the item will not trigger any events.
 * @param {boolean} [Shrine] - If the item is being removed from a shrine, this is true.
 * @returns {boolean} true if the item was removed, false if it was not.
 */
function KinkyDungeonRemoveRestraint(Group, Keep, Add, NoEvent, Shrine) {
	for (let i of KinkyDungeonAllRestraint()) {
		const rest = KinkyDungeonRestraintsCache.get(i.name);
		let AssetGroup = rest && rest.AssetGroup ? rest.AssetGroup : Group;
		if (rest.Group == Group) {
			if (!NoEvent)
				KinkyDungeonSendEvent("remove", {item: rest, add: Add, keep: Keep, shrine: Shrine});

			if (!KinkyDungeonCancelFlag && !Add) {
				KinkyDungeonCancelFlag = KinkyDungeonUnLinkItem(i, Keep);
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

				if (rest.inventory && (Keep || rest.enchanted || rest.alwaysKeep) && !KinkyDungeonInventoryGetLoose(rest.name)) {
					if (rest.inventoryAs) {
						let origRestraint = KinkyDungeonGetRestraintByName(rest.inventoryAs);
						if (!KinkyDungeonInventoryGetLoose(origRestraint.name))
							KinkyDungeonInventoryAdd({name: origRestraint.name, type: LooseRestraint, events:origRestraint.events});
					} else KinkyDungeonInventoryAdd({name: rest.name, type: LooseRestraint, events:rest.events});
				}

				InventoryRemove(KinkyDungeonPlayer, AssetGroup);

				for (let _item of KinkyDungeonInventory.get(Restraint).values()) {
					if (_item && KDRestraint(_item).Group == Group) {
						KinkyDungeonInventoryRemove(_item);
						break;
					}
				}


				if (rest.Group == "ItemNeck" && KinkyDungeonGetRestraintItem("ItemNeckRestraints")) KinkyDungeonRemoveRestraint("ItemNeckRestraints", KDRestraint(KinkyDungeonGetRestraintItem("ItemNeckRestraints")).inventory);

				if (!NoEvent) {
					if (rest.events) {
						for (let e of rest.events) {
							if (e.trigger == "afterRemove" && (!e.requireEnergy || ((!e.energyCost && KDGameData.AncientEnergyLevel > 0) || (e.energyCost && KDGameData.AncientEnergyLevel > e.energyCost)))) {
								KinkyDungeonHandleInventoryEvent("afterRemove", e, rest, {item: rest, add: Add, keep: Keep, shrine: Shrine});
							}
						}
					}
					KinkyDungeonSendEvent("afterRemove", {item: rest, add: Add, keep: Keep, shrine: Shrine});
				}

				KinkyDungeonCalculateSlowLevel();
				KinkyDungeonCheckClothesLoss = true;
				KinkyDungeonDressPlayer();

				KinkyDungeonMultiplayerInventoryFlag = true;
				KinkyDungeonUpdateStruggleGroups();

			}
			KinkyDungeonCancelFlag = false;
			return true;
		}
	}
	return false;
}

/**
 * "Returns an array of all the shrine types that have at least one restraint item."
 *
 * The function takes one argument, `ShrineFilter`, which is an array of shrine types. If the argument is not provided, the
 * function will return all shrine types. If the argument is provided, the function will only return shrine types that are
 * in the argument
 * @param ShrineFilter - An array of strings, each string being the name of a shrine.
 * @returns An array of all the restraint types that can be used in the shrine.
 */
function KinkyDungeonRestraintTypes(ShrineFilter) {
	let ret = [];

	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).shrine) {
			for (let shrine of KDRestraint(inv).shrine) {
				if (ShrineFilter.includes(shrine) && !ret.includes(shrine)) ret.push(shrine);
			}
		}
	}

	return ret;
}


/**
 *
 * @param {restraint} newRestraint
 * @param {item} oldItem
 * @param {number} tightness
 * @param {string} [Lock]
 * @param {boolean} [Keep]
 * @param {string} [faction]
 * @returns {boolean}
 */
function KinkyDungeonLinkItem(newRestraint, oldItem, tightness, Lock, Keep, faction) {
	if (newRestraint && oldItem && oldItem.type == Restraint) {
		let oldLock = [];
		let oldFaction = [];
		let oldTightness = [];
		let dynamicLink = [];
		let oldEvents = [];
		if (oldItem.oldLock) oldLock = oldItem.oldLock;
		if (oldItem.oldFaction) oldFaction = oldItem.oldFaction;
		if (oldItem.oldTightness) oldTightness = oldItem.oldTightness;
		if (oldItem.oldEvents) oldEvents = oldItem.oldEvents;
		if (oldItem.dynamicLink) dynamicLink = oldItem.dynamicLink;
		let olock = oldItem.lock ? oldItem.lock : "";
		let ofaction = oldItem.faction ? oldItem.faction : "";
		let oldtight = oldItem.tightness ? oldItem.tightness : 0;
		let oevents = oldItem.events ? oldItem.events : [];
		let oldlink = oldItem.name;
		oldLock.push(olock);
		oldFaction.push(ofaction);
		oldTightness.push(oldtight);
		oldEvents.push(oevents);
		dynamicLink.push(oldlink);
		if (newRestraint) {
			KinkyDungeonAddRestraint(newRestraint, tightness, true, Lock, Keep, true, undefined, undefined, faction);
			let newItem = KinkyDungeonGetRestraintItem(newRestraint.Group);
			if (newItem) newItem.oldLock = oldLock;
			if (newItem) newItem.oldFaction = oldFaction;
			if (newItem) newItem.oldTightness = oldTightness;
			if (newItem) newItem.dynamicLink = dynamicLink;
			if (newItem) newItem.oldEvents = oldEvents;
			if (KDRestraint(oldItem).Link)
				KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonLink" + oldItem.name), "red", 2);
			return true;
		}
	}
	return false;
}

/**
 *
 * @param {item} item
 * @param {boolean} Keep
 * @returns
 */
function KinkyDungeonUnLinkItem(item, Keep) {
	//if (!data.add && !data.shrine)
	if (item.type == Restraint) {
		let UnLink = "";
		let dynamic = false;
		if (item.dynamicLink && item.dynamicLink.length > 0) {
			UnLink = item.dynamicLink[item.dynamicLink.length - 1];
			dynamic = true;
		}
		if (UnLink) {
			let newRestraint = KinkyDungeonGetRestraintByName(UnLink);
			let oldLock = "";
			let oldFaction = undefined;
			let oldTightness = 0;
			/** @type {KinkyDungeonEvent[]} */
			let oldEvents = undefined;
			if (item.oldLock && item.oldLock.length > 0) {
				oldLock = item.oldLock[item.oldLock.length - 1];
			}
			if (item.oldFaction && item.oldFaction.length > 0) {
				oldFaction = item.oldFaction[item.oldFaction.length - 1];
			}
			if (item.oldTightness && item.oldTightness.length > 0) {
				oldTightness = item.oldTightness[item.oldTightness.length - 1];
			}
			if (item.oldEvents && item.oldEvents.length > 0) {
				oldEvents = item.oldEvents[item.oldEvents.length - 1];
			}
			if (newRestraint) {
				if (item.dynamicLink && dynamic)
					item.dynamicLink.splice(item.dynamicLink.length-1, 1);
				if (item.oldLock)
					item.oldLock.splice(item.oldLock.length-1, 1);
				if (item.oldFaction)
					item.oldFaction.splice(item.oldFaction.length-1, 1);
				if (item.oldTightness)
					item.oldTightness.splice(item.oldTightness.length-1, 1);
				if (item.oldEvents)
					item.oldEvents.splice(item.oldEvents.length-1, 1);
				KinkyDungeonAddRestraint(newRestraint, oldTightness, true, oldLock ? oldLock : "", Keep, undefined, undefined, undefined, oldFaction);
				let res = KinkyDungeonGetRestraintItem(newRestraint.Group);
				if (res && KDRestraint(res) && KDRestraint(res).name == newRestraint.name) res.events = oldEvents;
				if (res && KDRestraint(res) && item.dynamicLink && item.dynamicLink.length > 0) {
					res.dynamicLink = item.dynamicLink;
				}
				if (res && KDRestraint(res) && item.oldLock && item.oldLock.length > 0) {
					res.oldLock = item.oldLock;
				}
				if (res && KDRestraint(res) && item.oldFaction && item.oldFaction.length > 0) {
					res.oldFaction = item.oldFaction;
				}
				if (res && KDRestraint(res) && item.oldTightness && item.oldTightness.length > 0) {
					res.oldTightness = item.oldTightness;
				}
				if (res && KDRestraint(res) && item.oldEvents && item.oldEvents.length > 0) {
					res.oldEvents = item.oldEvents;
				}
				if (KDRestraint(item).UnLink)
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnLink" + item.name), "lightgreen", 2);
				else
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnLink"), "lightgreen", 2);
				return true;
			}
		}
	}
	return false;
}
