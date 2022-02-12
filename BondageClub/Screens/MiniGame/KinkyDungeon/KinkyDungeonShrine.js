"use strict";

/**
 * Base costs for all the shrines. Starts at this value, increases thereafter
 * @type {Record<string, number>}
 */
var KinkyDungeonShrineBaseCosts = {
	//"Charms": 25,
	"Leather": 40,
	"Metal": 60,
	"Rope": 20,
	"Latex": 40,
	"Will": 20,
	"Elements": 100,
	"Conjure": 100,
	"Illusion": 100,
};

let KinkyDungeonOrbAmount = 0;

/**
 * Cost growth, overrides the default amount
 * @type {Record<string, number>}
 */
var KinkyDungeonShrineBaseCostGrowth = {
	"Elements": 2,
	"Conjure": 2,
	"Illusion": 2,
};

let KinkyDungeonGhostDecision = 0;

/**
 * @type {KinkyDungeonShopItem[]}
 */
var KinkyDungeonShopItems = [];
var KinkyDungeonShopIndex = 0;

var KinkyDungeonShrinePoolChancePerUse = 0.2;

/**
 * Current costs multipliers for shrines
 * @type {Record<string, number>}
 */
let KinkyDungeonShrineCosts = {};

let KinkyDungeonShrineTypeRemove = ["Charms", "Leather", "Metal", "Rope", "Latex", "Gags", "Blindfolds", "Boots"]; // These shrines will always remove restraints associated with their shrine

function KinkyDungeonShrineInit() {
	KinkyDungeonShrineCosts = {};
	KDGameData.PoolUsesGrace = 3;

	KinkyDungeonInitReputation();

}

function KinkyDungeonShrineAvailable(type) {
	if (type == "Commerce") {
		if (KinkyDungeonShopItems.length > 0) return true;
		else return false;
	}
	if (KinkyDungeonShrineTypeRemove.includes(type) && KinkyDungeonGetRestraintsWithShrine(type).length > 0) return true;
	else if ((type == "Elements" || type == "Illusion" || type == "Conjure") && KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]).length > 0) return true;
	else if (type == "Will" && (KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax)) return true;

	return false;
}


function KinkyDungeonGenerateShop(Level) {
	KinkyDungeonMakeGhostDecision(); // Decides if the ghosts will be friendly or not
	KDGameData.PoolUses = Math.min(KDGameData.PoolUses, 1);
	KinkyDungeonShopIndex = 0;
	KinkyDungeonShopItems = [];
	let items_mid = 0;
	let items_high = 0;
	for (let I = 3 + Math.floor(KDRandom() * 3); I > 0; I--) {
		let Rarity = 0;
		if (items_high == 0 && KDRandom() > 0.4) {Rarity = Math.floor(Level/10); items_high += 1;}
		else if (items_mid < 2 && KDRandom() > 0.6) {Rarity += Math.ceil(KDRandom() * 3); items_mid += 1;}

		let item = KinkyDungeonGetShopItem(Level, Rarity, true);
		KinkyDungeonShopItems.push({name: item.name, shoptype: item.shoptype, rarity: item.rarity, cost: item.cost});
	}
}

function KinkyDungeonShrineCost(type) {
	let mult = 1.0;
	let growth = 1.0;

	if (type == "Commerce" && KinkyDungeonShopIndex < KinkyDungeonShopItems.length) {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item.cost != null) return item.cost;
		if (item.rarity != null) {
			let rarity = item.rarity;
			if (item.costMod) rarity += item.costMod;
			let costt = 5 * Math.round((1 + MiniGameKinkyDungeonLevel/25)*(30 + 2 * rarity * rarity * 10)/5);
			if (costt > 100) costt = 50 * Math.round(costt / 50);
			return costt;
		}
		return 15;
	} else if (KinkyDungeonShrineTypeRemove.includes(type)) {
		let rest = KinkyDungeonGetRestraintsWithShrine(type);
		let maxPower = 1;
		for (let r of rest) {
			if (r.restraint && r.restraint.power > maxPower) maxPower = r.restraint.power;
		}
		mult = Math.sqrt(Math.max(1, rest.length));
		mult *= Math.pow(Math.max(1, maxPower), 0.75);
	} else if (type == "Will") {
		let value = 0;
		value += 100 * (1 - KinkyDungeonStatStamina/KinkyDungeonStatStaminaMax);
		value += 100 * (1 - KinkyDungeonStatMana/KinkyDungeonStatManaMax);
		return Math.round(value/10)*10;
	}
	if (KinkyDungeonShrineBaseCostGrowth[type]) growth = KinkyDungeonShrineBaseCostGrowth[type];
	if (KinkyDungeonShrineCosts[type] > 0) mult = Math.pow(growth, KinkyDungeonShrineCosts[type]);

	if (KinkyDungeonSpellLevel[type] && KinkyDungeonSpellLevel[type] >= KinkyDungeonSpellLevelMax)
		return 100;

	return Math.round(KinkyDungeonShrineBaseCosts[type] * mult/10)*10;
}

function KinkyDungeonPayShrine(type) {
	KinkyDungeonGold -= KinkyDungeonShrineCost(type);
	let ShrineMsg = "";
	let rep = 0;

	// TODO shrine effects
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		rep = KinkyDungeonRemoveRestraintsWithShrine(type);
		KinkyDungeonChangeRep("Ghost", -rep);

		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints");
	} else if (type == "Elements" || type == "Illusion" || type == "Conjure") {
		/*let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList[type]);
		if (KDRandom() < 0.1 || SpellsUnlearned.length == 0) SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]);

		let spellIndex = Math.floor(KDRandom()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
		rep = spell.level;*/
		if (KinkyDungeonSpellLevel[type] < KinkyDungeonSpellLevelMax) {
			KinkyDungeonSpellLevel[type] += 1;
			ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + type));
			rep = Math.floor(2 * Math.pow(KinkyDungeonSpellLevel[type], 1.25));
		} else {
			ShrineMsg = TextGet("KinkyDungeonPayShrineBuff").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + type));
			rep = 1;
		}

	} else if (type == "Will") {
		rep = Math.ceil(KinkyDungeonStatMana * 2 / KinkyDungeonStatManaMax + KinkyDungeonStatStamina * 3 / KinkyDungeonStatStaminaMax);
		KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
		KinkyDungeonStatMana = KinkyDungeonStatManaMax;
		KinkyDungeonStatArousal = 0;
		KinkyDungeonChangeStamina(0);
		KinkyDungeonChangeMana(0);
		KinkyDungeonChangeArousal(0);
		KinkyDungeonNextDataSendStatsTime = 0;

		ShrineMsg = TextGet("KinkyDungeonPayShrineHeal");
	} else if (type == "Commerce") {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item) {
			if (item.shoptype == "Consumable")
				KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.name], 1);
			else if (item.shoptype == "Weapon")
				KinkyDungeonInventoryAddWeapon(item.name);
			else if (item.shoptype == "Basic") {
				if (item.name == "RedKey") {
					KinkyDungeonRedKeys += 1;
				} else if (item.name == "BlueKey") {
					KinkyDungeonBlueKeys += 1;
				} else if (item.name == "Knife") {
					KinkyDungeonNormalBlades += 1;
				} else if (item.name == "MagicKnife") {
					KinkyDungeonEnchantedBlades += 1;
				} else if (item.name == "Lockpick") {
					KinkyDungeonLockpicks += 1;
				} else if (item.name == "2Lockpick") {
					KinkyDungeonLockpicks += 2;
				} else if (item.name == "4Lockpick") {
					KinkyDungeonLockpicks += 4;
				}
			}
			ShrineMsg = TextGet("KinkyDungeonPayShrineCommerce").replace("ItemBought", TextGet("KinkyDungeonInventoryItem" + item.name));
			KinkyDungeonShopItems.splice(KinkyDungeonShopIndex, 1);
			if (KinkyDungeonShopIndex > 0) KinkyDungeonShopIndex -= 1;

			rep = item.rarity + 1;
		}
	}

	if (ShrineMsg) KinkyDungeonSendActionMessage(10, ShrineMsg, "lightblue", 1);

	if (KinkyDungeonShrineCosts[type] > 0) KinkyDungeonShrineCosts[type] = KinkyDungeonShrineCosts[type] + 1;
	else KinkyDungeonShrineCosts[type] = 1;

	if (rep != 0) {
		KinkyDungeonChangeRep(type, rep);
	}
}

function KinkyDungeonHandleShrine() {
	let cost = 0;
	let type = KinkyDungeonTargetTile.Name;

	if (KinkyDungeonShrineAvailable(type)) cost = KinkyDungeonShrineCost(type);

	if (type == "Commerce") {
		if (cost > 0) {
			if (MouseIn(840, 825, 112-15, 60) && cost <= KinkyDungeonGold) {
				KinkyDungeonPayShrine(type);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
				return true;
			}
			else if (MouseIn(963, 825, 112, 60)) {
				KinkyDungeonShopIndex = (KinkyDungeonShopIndex + 1) % KinkyDungeonShopItems.length;

				return true;
			}

		}
	} else {
		if (cost > 0 && MouseIn(650, 825, 325, 60)) {
			KinkyDungeonAdvanceTime(1, true);
			KinkyDungeonTargetTile = null;
			if (KinkyDungeonGold >= cost) {
				KinkyDungeonPayShrine(type);
				KinkyDungeonTiles.delete(KinkyDungeonTargetTileLocation);
				let x = KinkyDungeonTargetTileLocation.split(',')[0];
				let y = KinkyDungeonTargetTileLocation.split(',')[1];
				KinkyDungeonMapSet(parseInt(x), parseInt(y), "a");
				KinkyDungeonUpdateStats(0);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			} else {
				KinkyDungeonSendActionMessage(1, TextGet("KinkyDungeonPayShrineFail"), "red", 1);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			return true;
		} else if (KDGameData.PoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && (KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonPlayerTags.get("slime")) && ((cost == 0 && MouseIn(650, 825, 375, 60)) || MouseIn(1000, 825, 100, 60))) {
			let chance = 0 + KinkyDungeonShrinePoolChancePerUse * KDGameData.PoolUses;

			KinkyDungeonAdvanceTime(1, true);

			if ((KDRandom() > chance || KDGameData.PoolUsesGrace > 0) && (!KinkyDungeonGoddessRep[type] || KinkyDungeonGoddessRep[type] > -49.9)) {
				let slimed = 0;
				for (let inv of KinkyDungeonRestraintList()) {
					if (inv.restraint && inv.restraint.slimeLevel) {
						slimed += 1;
						KinkyDungeonRemoveRestraint(inv.restraint.Group, false);
					}
				}
				if (slimed) KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonPoolDrinkSlime"), "#FF00FF", 2);
				else KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonPoolDrink" + Math.min(2, KDGameData.PoolUses)), "#AAFFFF", 2);
				KinkyDungeonStatMana = KinkyDungeonStatManaMax;
				if (chance > 0) KDGameData.PoolUsesGrace -= 1;
				KinkyDungeonChangeRep(type, -2 - slimed * 2);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			} else {
				// You have angered the gods!
				KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + type)), "#AA0000", 3);
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + type)), "#AA0000", 3);

				KinkyDungeonShrineAngerGods(type);
				KDGameData.PoolUses = 10000;
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
			}

			KDGameData.PoolUses += 1;
			return true;
		}
	}
	return false;
}

function KinkyDungeonDrawShrine() {
	let cost = 0;
	let type = KinkyDungeonTargetTile.Name;

	if (KinkyDungeonShrineAvailable(type)) cost = KinkyDungeonShrineCost(type);

	if (type == "Commerce") {
		if (cost == 0) {
			DrawText(TextGet("KinkyDungeonLockedShrine"), 850, 850, "white", "silver");
		} else {
			DrawButton(840, 825, 112-15, 60, TextGet("KinkyDungeonCommercePurchase").replace("ItemCost", "" + cost), (cost <= KinkyDungeonGold) ? "White" : "Pink", "", "");
			if (MouseIn(840, 825, 112-15, 60) && KinkyDungeonShopItems.length > 0 && KinkyDungeonShopItems[KinkyDungeonShopIndex]) {
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), MouseX+1, 1+canvasOffsetY + KinkyDungeonCanvas.height - 100, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc"), MouseX, canvasOffsetY + KinkyDungeonCanvas.height - 100, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc2"), MouseX+1, 1+canvasOffsetY + KinkyDungeonCanvas.height - 50, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name + "Desc2"), MouseX, canvasOffsetY + KinkyDungeonCanvas.height - 50, 1000, "white");
			}
			DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonCommerceNext"), "White", "", "");
			if (KinkyDungeonShopIndex > KinkyDungeonShopItems.length) {
				KinkyDungeonShopIndex = 0;
			} else if (KinkyDungeonShopItems.length > 0 && KinkyDungeonShopItems[KinkyDungeonShopIndex]) {
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name), 650 + 175/2, 845, 175, "white", "silver");
				DrawTextFit(TextGet("KinkyDungeonCommerceCost").replace("ItemCost", "" + cost), 650 + 175/2, 890, 130, "white", "silver");
			}
		}
	} else {
		if (cost == 0) {
			DrawButton(650, 825, 375, 60, TextGet("KinkyDungeonDrinkShrine"), (KDGameData.PoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && (KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonPlayerTags.get("slime"))) ? "#AAFFFF" : "#444444", "", "");
		} else {
			DrawButton(650, 825, 325, 60, TextGet("KinkyDungeonPayShrine").replace("XXX", "" + cost), "White", "", "");
			DrawButton(1000, 825, 100, 60, TextGet("KinkyDungeonDrinkShrine"), (KDGameData.PoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && KinkyDungeonStatMana < KinkyDungeonStatManaMax || KinkyDungeonPlayerTags.get("slime")) ? "#AAFFFF" : "#444444", "", "");
		}
	}
}
function KinkyDungeonDrawGhost() {
	if (KinkyDungeonGhostDecision == 0) DrawText(TextGet("KinkyDungeonDrawGhostHelpful"), 850, 850, "white", "silver");
	else DrawText(TextGet("KinkyDungeonDrawGhostUnhelpful"), 850, 850, "white", "silver");
}
function KinkyDungeonGhostMessage() {
	let restraints = KinkyDungeonRestraintList();
	let msg = "";
	if (restraints.length == 0) {
		msg = TextGet("KinkyDungeonGhostGreet" + KinkyDungeonGhostDecision);
	} else {
		if (KinkyDungeonGhostDecision <= 1) {
			msg = TextGet("KinkyDungeonGhostHelpful" + KinkyDungeonGhostDecision);
		} else {
			let BoundType = "Generic";
			if (!KinkyDungeonCanTalk() && Math.random() < 0.33) BoundType = "Gag";
			if (!KinkyDungeonPlayer.CanInteract() && Math.random() < 0.33) BoundType = "Arms";
			if (!KinkyDungeonPlayer.CanWalk() && Math.random() < 0.33) BoundType = "Feet";
			if (KinkyDungeonPlayer.IsChaste() && Math.random() < 0.33) BoundType = "Chaste";

			msg = TextGet("KinkyDungeonGhostUnhelpful" + BoundType + KinkyDungeonGhostDecision);
		}
	}
	if (msg) {
		KinkyDungeonSendActionMessage(3, msg, "white", 3);
	}
}


function KinkyDungeonMakeGhostDecision() {
	KinkyDungeonGhostDecision = 0;

	let rep = KinkyDungeonGoddessRep.Ghost;

	if (rep > 0) KinkyDungeonGhostDecision += 1;
	if (rep != undefined) {
		if (KDRandom() * 100 > -rep + 75) KinkyDungeonGhostDecision += 1;
		if (KDRandom() * 100 > -rep + 85) KinkyDungeonGhostDecision += 1;
		if (KDRandom() * 100 > -rep + 95) KinkyDungeonGhostDecision += 1;
	}
}

function KinkyDungeonShrineAngerGods(Type) {
	if (Type == "Elements") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainArms"), 2, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainLegs"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainCrotch"), 0, true, KinkyDungeonGenerateLock(true));

	} else if (Type == "Latex") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexStraitjacket"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexLegbinder"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexBoots"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LatexCorset"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainCrotch"), 0, true, KinkyDungeonGenerateLock(true));

	} else if (Type == "Conjure" || Type == "Rope") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeArms"), 4, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeLegs"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeCrotch"), 2, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StrongMagicRopeFeet"), 0, true);


	} else if (Type == "Illusion") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapMittens"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), 0, true, KinkyDungeonGenerateLock(true));
	} else if (Type == "Leather") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapHarness"), 4, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBoots"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("SturdyLeatherBeltsFeet"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("SturdyLeatherBeltsLegs"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), 4, true, KinkyDungeonGenerateLock(true));
	} else if (Type == "Metal") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WristShackles"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("AnkleShackles"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("LegShackles"), 0, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), 0, true);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), 0, true, KinkyDungeonGenerateLock(true));
	} else if (Type == "Will") {
		KinkyDungeonStatMana = 0;
		KinkyDungeonStatStamina = 0;
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("GhostCollar"), 0, true);
	}
	if (KinkyDungeonGoddessRep[Type] < -45) {
		KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, "OrbGuardian", 3 + Math.floor(Math.sqrt(1 + MiniGameKinkyDungeonLevel)), 10, false, 30);
	}
	KinkyDungeonChangeRep(Type, -10);
}

function KinkyDungeonGetMapShrines(Dict) {
	let ret = [];
	for (let sh of Dict) {
		if (sh.Type) {
			ret.push(sh.Type);
		}
	}
	return ret;
}

function KinkyDungeonTakeOrb(Amount, X, Y) {
	KinkyDungeonDrawState = "Orb";
	KinkyDungeonOrbAmount = Amount;
	KDOrbX = X;
	KDOrbY = Y;
}
function KinkyDungeonDrawOrb() {

	MainCanvas.textAlign = "center";
	DrawText(TextGet("KinkyDungeonOrbIntro"), 1250, 200, "white", "silver");
	DrawText(TextGet("KinkyDungeonOrbIntro2"), 1250, 250, "white", "silver");
	let i = 0;
	let maxY = 560;
	let XX = 500;
	let spacing = 60;
	let yPad = 150;
	MainCanvas.textAlign = "center";
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		let value = KinkyDungeonGoddessRep[shrine];

		if (value != undefined) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			let color = "#ffff00";
			if (value < -10) {
				if (value < -30) color = "#ff0000";
				else color = "#ff8800";
			} else if (value > 10) {
				if (value > 30) color = "#00ff00";
				else color = "#88ff00";
			}
			DrawButton(canvasOffsetX + XX, yPad + canvasOffsetY + spacing * i - 27, 250, 55, TextGet("KinkyDungeonShrine" + shrine), "white");
			DrawProgressBar(canvasOffsetX + 275 + XX, yPad + canvasOffsetY + spacing * i - spacing/4, 200, spacing/2, 50 + value, color, "#444444");

			i++;
		}

	}

	DrawButton(canvasOffsetX + KinkyDungeonCanvas.width/2 - 200, yPad + canvasOffsetY + spacing * i, 425, 55, TextGet("KinkyDungeonSurpriseMe"), "white");

	MainCanvas.textAlign = "center";
}

let KDOrbX = 0;
let KDOrbY = 0;

function KinkyDungeonHandleOrb() {
	let Amount = KinkyDungeonOrbAmount;
	let i = 0;
	let maxY = 560;
	let XX = 500;
	let spacing = 60;
	let yPad = 150;
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		let value = KinkyDungeonGoddessRep[shrine];

		if (value != undefined) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			if (MouseIn(canvasOffsetX + XX, yPad + canvasOffsetY + spacing * i - 27, 250, 55)) {
				if (KinkyDungeonMapGet(KDOrbX, KDOrbY) == 'O') {
					if (KinkyDungeonGoddessRep[shrine] < -45) {
						KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, "OrbGuardian", 3 + Math.floor(Math.sqrt(1 + MiniGameKinkyDungeonLevel)), 10, false, 30);
					}
					KinkyDungeonChangeRep(shrine, Amount * -10);
					KinkyDungeonSpellPoints += Amount;
					KinkyDungeonMapSet(KDOrbX, KDOrbY, 'o');
				}

				KinkyDungeonDrawState = "Game";
				return true;
			}
			i++;
		}

	}

	if (MouseIn(canvasOffsetX + KinkyDungeonCanvas.width/2 - 200, yPad + canvasOffsetY + spacing * i, 425, 55)) {
		let shrine = Object.keys(KinkyDungeonShrineBaseCosts)[Math.floor(KDRandom() * Object.keys(KinkyDungeonShrineBaseCosts).length)];
		if (KinkyDungeonMapGet(KDOrbX, KDOrbY) == 'O') {
			if (KinkyDungeonGoddessRep[shrine] < -45) {
				KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, "OrbGuardian", 3 + Math.floor(Math.sqrt(1 + MiniGameKinkyDungeonLevel)), 10, false, 30);
			}
			KinkyDungeonChangeRep(shrine, Amount * -9);
			KinkyDungeonSpellPoints += Amount;
			KinkyDungeonMapSet(KDOrbX, KDOrbY, 'o');
		}

		KinkyDungeonDrawState = "Game";
		return true;
	}


	return true;
}