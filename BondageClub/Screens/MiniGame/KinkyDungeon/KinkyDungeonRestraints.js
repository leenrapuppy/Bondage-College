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

let KDUnchainedBonus = 0.2;
let KDDamselBonus = -0.2;
let KDDamselPickAmount = 6;
let KDArtistBonus = 0.2;
let KDBunnyBonus = -0.2;
let KDBunnyKnifeAmount = 5;
let KDBunnyEnchKnifeAmount = 12;
let KDSlipperyBonus = 0.2;
let KDDollBonus = -0.2;
let KDEscapeeBonus = 0.2;
let KDDragonBonus = -0.2;

let KDStrongBonus = 0.2;
let KDWeakBonus = -0.15;

let KDBondageLoverAmount = 1;

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
	for (let inv of KinkyDungeonAllRestraint()) {
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
			if (lock == "Gold") item.lockTimer = Math.min(KinkyDungeonMaxLevel - 1, MiniGameKinkyDungeonLevel + 2);
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

	for (let item of KinkyDungeonAllRestraint()) {
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine) && item.lock != "Gold") {
			ret.push(item);
		}
	}

	return ret;
}

function KinkyDungeonRemoveRestraintsWithShrine(shrine) {
	let count = 0;

	for (let i = 0; i < 10; i++) {
		for (let item of KinkyDungeonAllRestraint()) {
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

	for (let item of KinkyDungeonAllRestraint()) {
		if (item.restraint && item.lock && item.restraint.shrine && item.restraint.shrine.includes(shrine) && item.lock != "Gold") {

			KinkyDungeonLock(item, "");
			count++;
		}
	}

	return count;
}

function KinkyDungeonPlayerGetLockableRestraints() {
	let ret = [];

	for (let item of KinkyDungeonAllRestraint()) {
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
	for (let restraint of KinkyDungeonAllRestraint()) {
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
	for (let inv of KinkyDungeonAllRestraint()) {
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
	for (let inv of KinkyDungeonAllRestraint()) {
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
	for (let inv of KinkyDungeonAllRestraint()) {
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
	for (let inv of KinkyDungeonAllRestraint()) {
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
	let bonus = 0;
	if (KinkyDungeonStatsChoice.get("Locksmith")) bonus += KDLocksmithBonus;
	if (KinkyDungeonStatsChoice.get("Clueless")) bonus += KDCluelessBonus;
	if (KinkyDungeonStatsChoice.get("LocksmithMaster")) bonus += 0.15;
	return 0.33 / (1.0 + 0.02 * MiniGameKinkyDungeonLevel) + bonus;
}

// Note: This is for tiles (doors, chests) only!!!
function KinkyDungeonPickAttempt() {
	let Pass = "Fail";
	let escapeChance = KinkyDungeonGetPickBaseChance();
	let cost = KinkyDungeonStatStaminaCostPick;
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
	if (StruggleType == "Pick") {
		if (KinkyDungeonStatsChoice.get("Locksmith")) escapeChance += KDLocksmithBonus;
		if (KinkyDungeonStatsChoice.get("Clueless")) escapeChance += KDCluelessBonus;
	} else if (StruggleType == "Remove" || StruggleType == "Unlock") {
		if (KinkyDungeonStatsChoice.get("Flexible")) escapeChance += KDFlexibleBonus;
		if (KinkyDungeonStatsChoice.get("Inflexible")) escapeChance += KDInflexibleBonus;
	} else if (StruggleType == "Struggle") {
		if (KinkyDungeonStatsChoice.get("Strong")) escapeChance += KDStrongBonus;
		if (KinkyDungeonStatsChoice.get("Weak")) escapeChance += KDWeakBonus;
	}
	if (KinkyDungeonStatsChoice.get("Unchained") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Metal"))
		escapeChance += KDUnchainedBonus;
	if (KinkyDungeonStatsChoice.get("Damsel") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Metal")) {
		escapeChance += KDDamselBonus;
		KinkyDungeonKeyPickBreakAmount = KDDamselPickAmount;
	} else KinkyDungeonKeyPickBreakAmount = KinkyDungeonKeyPickBreakAmountBase;

	if (KinkyDungeonStatsChoice.get("FreeSpirit") && (restraint.restraint.chastity || restraint.restraint.chastitybra)) escapeChance += 0.5;
	if (KinkyDungeonStatsChoice.get("Artist") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Rope"))
		escapeChance += KDArtistBonus;
	if (KinkyDungeonStatsChoice.get("Bunny") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Rope")) {
		KinkyDungeonKnifeBreakAmount = KDBunnyKnifeAmount;
		KinkyDungeonEnchKnifeBreakAmount = KDBunnyEnchKnifeAmount;
		escapeChance += KDBunnyBonus;
	} else {
		KinkyDungeonKnifeBreakAmount = KinkyDungeonKnifeBreakAmountBase;
		KinkyDungeonEnchKnifeBreakAmount = KinkyDungeonEnchKnifeBreakAmountBase;
	}

	if (KinkyDungeonStatsChoice.get("Slippery") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Latex"))
		escapeChance += KDSlipperyBonus;
	else if (KinkyDungeonStatsChoice.get("Doll") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Latex"))
		escapeChance += KDDollBonus;

	if (KinkyDungeonStatsChoice.get("Escapee") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Leather"))
		escapeChance += KDEscapeeBonus;
	else if (KinkyDungeonStatsChoice.get("Dragon") && restraint.restraint.shrine && restraint.restraint.shrine.includes("Leather"))
		escapeChance += KDDragonBonus;




	let increasedAttempts = false;

	let handsBound = KinkyDungeonIsHandsBound(true);

	// Bonuses go here
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostStruggle")) escapeChance += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostStruggle");
	if (StruggleType == "Cut") {
		if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCutting")) escapeChance += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCutting");
		if (KinkyDungeonHasGhostHelp()) {
			let maxBonus = 0;
			for (let inv of KinkyDungeonFullInventory()) {
				if (inv.weapon && inv.weapon.cutBonus > maxBonus) maxBonus = inv.weapon.cutBonus;
			}
			escapeChance += maxBonus;
		} else if (KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.cutBonus) {
			escapeChance += KinkyDungeonPlayerWeapon.cutBonus;
		}

		if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCuttingMinimum")) escapeChance = Math.max(escapeChance, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "BoostCuttingMinimum"));
	}
	if (StruggleType == "Cut" && KinkyDungeonEnchantedBlades > 0) escapeChance += KinkyDungeonEnchantedKnifeBonus;

	let escapeSpeed = 1.0;

	// Finger extensions will help if your hands are unbound. Some items cant be removed without them!
	// Mouth counts as a finger extension on your hands if your arms aren't tied
	let armsBound = KinkyDungeonIsArmsBound(true);
	if (StruggleType == "Remove" &&
		(!handsBound && (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0 || KinkyDungeonLockpicks > 0)
		|| (struggleGroup.group == "ItemHands" && KinkyDungeonCanTalk() && !armsBound)))
		escapeChance = Math.min(1, escapeChance + 0.15);

	// You can tug using unbound hands
	if (StruggleType == "Struggle" &&
		(!handsBound && !armsBound && struggleGroup.group != "ItemHands" && struggleGroup.group != "ItemArms")) {
		escapeSpeed *= 1.4;
		escapeChance = Math.min(1, escapeChance + 0.05);
	}


	if (StruggleType == "Unlock" && KinkyDungeonStatsChoice.get("Psychic")) escapeChance = Math.max(escapeChance, 0.25);

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts) {
			increasedAttempts = true;
			restraint.attempts += 0.5;
			if (StruggleType == "Struggle") restraint.attempts += 0.5;
			if (escapeChance <= -0.5) restraint.attempts += 0.5;
		} else {
			let typesuff = "";
			if (origEscapeChance <= 0 && restraint.restraint.helpChance && restraint.restraint.helpChance[StruggleType] > 0) typesuff = "3";
			else if (restraint.restraint.specStruggleTypes && restraint.restraint.specStruggleTypes.includes(StruggleType)) typesuff = "2";
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
			KinkyDungeonChangeStamina(cost);
			if (KinkyDungeonStatsChoice.get("BondageLover")) KinkyDungeonChangeDistraction(KDBondageLoverAmount);
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

	let possible = escapeChance > 0;
	// Strict bindings make it harder to escape
	if (strict) escapeChance = Math.max(0, escapeChance - strict);

	if (StruggleType == "Unlock" && KinkyDungeonStatsChoice.get("Psychic")) escapeChance = Math.max(escapeChance, 0.2);

	if (possible && escapeChance == 0) {
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

	if (!KinkyDungeonHasGhostHelp() && (StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove")) escapeChance /= 1.0 + KinkyDungeonStatDistraction/KinkyDungeonStatDistractionMax*KinkyDungeonDistractionUnlockSuccessMod;

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

	if (StruggleType == "Unlock" && KinkyDungeonStatsChoice.get("Psychic")) escapeChance = Math.max(escapeChance, 0.15);

	let belt = null;
	let bra = null;

	if (struggleGroup.group == "ItemVulva" || struggleGroup.group == "ItemVulvaPiercings" || struggleGroup.group == "ItemButt") belt = KinkyDungeonGetRestraintItem("ItemPelvis");
	if (belt && belt.restraint && belt.restraint.chastity) escapeChance = 0.0;

	if (struggleGroup.group == "ItemNipples" || struggleGroup.group == "ItemNipplesPiercings") bra = KinkyDungeonGetRestraintItem("ItemBreast");
	if (bra && bra.restraint && bra.restraint.chastity) escapeChance = 0.0;

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
			if (KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStruggle" + StruggleType + "ImpossibleBound" + suff), "red", 2);
			KinkyDungeonLastAction = "Struggle";
			KinkyDungeonSendEvent("struggle", {
				restraint: restraint,
				group: struggleGroup,
				struggletype: StruggleType,
				result: "Impossible",
			});
			KinkyDungeonChangeStamina(cost);
			if (KinkyDungeonStatsChoice.get("BondageLover")) KinkyDungeonChangeDistraction(KDBondageLoverAmount);
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
					let trap = restraint.trap;
					KinkyDungeonRemoveRestraint(restraint.restraint.Group, StruggleType != "Cut");
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
					if (KinkyDungeonNormalBlades > 0 && !restraint.restraint.magic) breakchance = KinkyDungeonGetKnifeBreakChance();
					else if (KinkyDungeonEnchantedBlades > 0) breakchance = KinkyDungeonGetEnchKnifeBreakChance();
					if (KDRandom() < breakchance) {
						Pass = "Break";
						if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1;
						else {
							if (KinkyDungeonNormalBlades > 0 && (!restraint.restraint.magic || (KinkyDungeonEnchantedBlades == 0))) {
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
							let mult = 1.0;
							if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
							if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
							restraint.cutProgress += escapeSpeed * mult * escapeChance * (0.3 + 0.2 * KDRandom() + 0.6 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
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
						let mult = 1.0;
						if (KinkyDungeonStatsChoice.get("Locksmith")) mult *= KDLocksmithSpeedBonus;
						if (KinkyDungeonStatsChoice.get("Clueless")) mult *= KDCluelessSpeedBonus;
						restraint.pickProgress += escapeSpeed * mult * escapeChance * (0.5 + 1.0 * KDRandom());
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
						restraint.unlockProgress += escapeSpeed * mult * escapeChance * (0.75 + 0.5 * KDRandom());
					}
				} else if (StruggleType == "Remove") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");let mult = 1.0;
					if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
					if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
					restraint.removeProgress += escapeSpeed * mult * escapeChance * (0.55 + 0.2 * KDRandom() + 0.35 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
				} else if (StruggleType == "Struggle") {
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");let mult = 1.0;
					if (KinkyDungeonStatsChoice.get("Flexible")) mult *= KDFlexibleSpeedBonus;
					if (KinkyDungeonStatsChoice.get("Inflexible")) mult *= KDInflexibleSpeedBonus;
					restraint.struggleProgress += escapeSpeed * mult * escapeChance * (0.4 + 0.3 * KDRandom() + 0.4 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
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
			if ((suff == "" || (Pass == "Fail" && suff == failSuffix)) && (Pass == "Fail" || Pass == "Success") && KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.1) suff = suff + "Aroused";
			KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonStruggle" + StruggleType + Pass + suff).replace("TargetRestraint", TextGet("Restraint" + restraint.restraint.name)), (Pass == "Success") ? "lightgreen" : "red", 2);

			KinkyDungeonChangeStamina(cost);
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

function KinkyDungeonGetRestraintItem(group) {
	for (let item of KinkyDungeonAllRestraint()) {
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
	let staminaPercent = (Math.min(KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax, 1 - KinkyDungeonStatDistraction / KinkyDungeonStatDistractionMax))
		/(1 + (KinkyDungeonGoddessRep.Ghost + 50)/100);

	if (KinkyDungeonSlowLevel > 0) staminaPercent = staminaPercent * (0.5 + 0.5 * Math.min(1, Math.max(0, 1 - KinkyDungeonSlowLevel/3)));

	if (!cache || !enemy.name) {
		cache = [];
		let start2 = performance.now();
		for (let restraint of KinkyDungeonRestraints) {
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


	let selection = KDRandom() * restraintWeightTotal;

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
	for (let inv of KinkyDungeonAllRestraint()) {
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
	if (KinkyDungeonStatsChoice.get("Deprived")) playerTags.set("NoVibes", true);
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

function KinkyDungeonGenerateRestraintTrap() {
	let enemy = KinkyDungeonGetEnemy(["chestTrap"], MiniGameKinkyDungeonLevel, MiniGameKinkyDungeonCheckpoint, '0', ["chestTrap"]);
	if (enemy) return enemy.name;
	return "GreedyGhast";
}

function KinkyDungeonAddRestraintIfWeaker(restraint, Tightness, Bypass, Lock, Keep, Trapped) {
	let r = KinkyDungeonGetRestraintItem(restraint.Group);
	let power = KinkyDungeonRestraintPower(r);
	let newLock = (Lock && KinkyDungeonIsLockable(restraint)) ? Lock : restraint.DefaultLock;
	if (restraint.shrine && restraint.shrine.includes("Vibes") && KinkyDungeonPlayerTags.get("NoVibes")) return 0;
	if (restraint.arousalMode && !KinkyDungeonStatsChoice.get("arousalMode")) return 0;
	if (!r || (r.restraint && (!r.dynamicLink || !r.dynamicLink.includes(restraint.name)) && !r.restraint.enchanted
		&& ((power < ((newLock) ? restraint.power * KinkyDungeonGetLockMult(newLock) : restraint.power))
			|| (r && r.restraint && KinkyDungeonLinkableAndStricter(r.restraint, restraint, r.dynamicLink, r.oldLock))))) {
		let ret = KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock, Keep, false, true);
		if (Trapped) {
			let rest = KinkyDungeonGetRestraintItem(restraint.Group);
			if (rest && rest.restraint && rest.restraint.trappable && !rest.trap) {
				rest.trap = KinkyDungeonGenerateRestraintTrap();
			}
		}
		return ret;
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
	let tight = (Tightness) ? Tightness : 0;
	let AssetGroup = restraint.AssetGroup ? restraint.AssetGroup : restraint.Group;
	if (restraint) {
		if (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			KinkyDungeonEvasionPityModifier = 0;
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
				if (restraint.Color) {
					CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, restraint.Color, AssetGroup);
					if (placedOnPlayer)
						CharacterAppearanceSetColorForGroup(Player, restraint.Color, AssetGroup);
				}
				let item = {restraint: restraint, tightness: tight, lock: "", events: restraint.events};
				KinkyDungeonInventoryAdd(item);

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
	for (let item of KinkyDungeonAllRestraint()) {
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

				if (item.restraint.inventory && (Keep || item.restraint.enchanted || item.restraint.alwaysKeep) && !KinkyDungeonInventoryGetLoose(item.restraint.name)) {
					if (item.restraint.inventoryAs) {
						let origRestraint = KinkyDungeonGetRestraintByName(item.restraint.inventoryAs);
						if (!KinkyDungeonInventoryGetLoose(origRestraint.name))
							KinkyDungeonInventoryAdd({looserestraint: origRestraint, events: origRestraint.looseevents});
					} else KinkyDungeonInventoryAdd({looserestraint: item.restraint, events: item.restraint.looseevents});
				}

				InventoryRemove(KinkyDungeonPlayer, AssetGroup);

				for (let _item of KinkyDungeonInventory.get(Restraint).values()) {
					if (_item && _item.restraint && _item.restraint.Group == Group) {
						KinkyDungeonInventoryRemove(_item);
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

function KinkyDungeonRestraintTypes(ShrineFilter) {
	let ret = [];

	for (let inv of KinkyDungeonAllRestraint()) {
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
