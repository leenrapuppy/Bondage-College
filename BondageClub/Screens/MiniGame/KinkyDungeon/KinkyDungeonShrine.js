"use strict";
var KinkyDungeonShrineBaseCosts = {
	//"Charms": 25,
	"Leather": 40,
	"Metal": 60,
	"Rope": 20,
	//"Latex": 40,
	"Will": 20,
	"Elements": 100,
	"Conjure": 100,
	"Illusion": 100,
};

let KinkyDungeonOrbAmount = 0;

var KinkyDungeonShrineBaseCostGrowth = {
	"Elements": 2,
	"Conjure": 2,
	"Illusion": 2,
};

let KinkyDungeonGhostDecision = 0;

var KinkyDungeonShopItems = [];
var KinkyDungeonShopIndex = 0;

var KinkyDungeonPoolUses = 0;
var KinkyDungeonShrinePoolChancePerUse = 0.25;
var KinkyDungeonPoolUsesGrace = 2;

var KinkyDungeonShrineCosts = {};
var KinkyDungeonShrineTypeRemove = ["Charms", "Leather", "Metal", "Rope", "Gags", "Blindfolds", "Boots"]; // These shrines will always remove restraints associated with their shrine

function KinkyDungeonShrineInit() {
	KinkyDungeonShrineCosts = {};
	KinkyDungeonPoolUsesGrace = 2;

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
	KinkyDungeonPoolUses = 0;
	KinkyDungeonShopIndex = 0;
	KinkyDungeonShopItems = [];
	let items_mid = 0;
	let items_high = 0;
	for (let I = 3 + Math.floor(Math.random() * (1 + Level / 34)); I > 0; I--) {
		let Rarity = Math.floor(MiniGameKinkyDungeonCheckpoint/2.5);
		if (items_high == 0 && Math.random() > 0.4) {Rarity = MiniGameKinkyDungeonCheckpoint; items_high += 1;}
		else if (items_mid < 2 && Math.random() > 0.6) {Rarity += Math.ceil(Math.random() * 3); items_mid += 1;}

		let item = KinkyDungeonGetShopItem(Level, Rarity, true);
		KinkyDungeonShopItems.push({name: item.name, shoptype: item.shoptype, rarity: item.rarity, cost: item.cost});
	}
}

function KinkyDungeonShrineCost(type) {
	if (type == "Commerce" && KinkyDungeonShopIndex < KinkyDungeonShopItems.length) {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item.cost != null) return item.cost;
		if (item.rarity != null) {
			let costt = 5 * Math.round((1 + MiniGameKinkyDungeonLevel/10)*(30 + 2 * item.rarity * item.rarity * 10)/5);
			if (costt > 100) costt = 50 * Math.round(costt / 50);
			return costt;
		}
		return 15;
	}

	let mult = 1.0;
	let growth = 1.33;
	if (KinkyDungeonShrineBaseCostGrowth[type]) growth = KinkyDungeonShrineBaseCostGrowth[type];
	if (KinkyDungeonShrineCosts[type] > 0) mult = Math.pow(growth, KinkyDungeonShrineCosts[type]);

	return Math.round(KinkyDungeonShrineBaseCosts[type] * mult);
}

function KinkyDungeonPayShrine(type) {
	KinkyDungeonGold -= KinkyDungeonShrineCost(type);
	let ShrineMsg = "";
	let rep = 0;

	// TODO shrine effects
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		rep = KinkyDungeonRemoveRestraintsWithShrine(type);

		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints");
	} else if (type == "Elements" || type == "Illusion" || type == "Conjure") {
		/*let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList[type]);
		if (Math.random() < 0.1 || SpellsUnlearned.length == 0) SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]);

		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
		rep = spell.level;*/
		KinkyDungeonSpellLevel[type] += 1;
		ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + type));
		rep = 2 * KinkyDungeonSpellLevel[type] * KinkyDungeonSpellLevel[type];

	} else if (type == "Will") {
		KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
		KinkyDungeonStatMana = Math.min(KinkyDungeonStatManaMax, KinkyDungeonStatMana+KinkyDungeonStatManaMax/3);
		KinkyDungeonStatArousal = 0;
		KinkyDungeonNextDataSendStatsTime = 0;

		rep = Math.ceil(KinkyDungeonStatMana * 2 / KinkyDungeonStatManaMax + KinkyDungeonStatStamina * 3 / KinkyDungeonStatStaminaMax);

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
				} else if (item.name == "Knife") {
					KinkyDungeonNormalBlades += 1;
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
			if (MouseIn(825, 825, 112, 60) && cost <= KinkyDungeonGold) {
				KinkyDungeonPayShrine(type);

				return true;
			}
			else if (MouseIn(963, 825, 112, 60)) {
				KinkyDungeonShopIndex = (KinkyDungeonShopIndex + 1) % KinkyDungeonShopItems.length;

				return true;
			}

		}
	} else {
		if (cost > 0 && MouseIn(675, 825, 300, 60)) {
			KinkyDungeonAdvanceTime(1, true);
			KinkyDungeonTargetTile = null;
			if (KinkyDungeonGold >= cost) {
				KinkyDungeonPayShrine(type);
				delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
				let x = KinkyDungeonTargetTileLocation.split(',')[0];
				let y = KinkyDungeonTargetTileLocation.split(',')[1];
				KinkyDungeonMapSet(parseInt(x), parseInt(y), "a");
				KinkyDungeonUpdateStats(0);
			} else if (1 >= KinkyDungeonActionMessagePriority) {
				KinkyDungeonActionMessageTime = 1;

				KinkyDungeonActionMessage = TextGet("KinkyDungeonPayShrineFail");
				KinkyDungeonActionMessagePriority = 1;
				KinkyDungeonActionMessageColor = "red";
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			return true;
		} else if (KinkyDungeonPoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && KinkyDungeonStatMana < KinkyDungeonStatManaMax && ((cost == 0 && MouseIn(675, 825, 350, 60)) || MouseIn(1000, 825, 100, 60))) {
			let chance = 0 + KinkyDungeonShrinePoolChancePerUse * KinkyDungeonPoolUses;

			KinkyDungeonAdvanceTime(1, true);

			if (Math.random() > chance || KinkyDungeonPoolUsesGrace > 0) {
				KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonPoolDrink" + Math.min(2, KinkyDungeonPoolUses)), "#AAFFFF", 2);
				KinkyDungeonStatMana = KinkyDungeonStatManaMax;
				if (chance > 0) KinkyDungeonPoolUsesGrace -= 1;
				KinkyDungeonChangeRep(type, -1);
			} else {
				// You have angered the gods!
				KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + type)), "#AA0000", 3);
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + type)), "#AA0000", 3);

				KinkyDungeonShrineAngerGods(type);
				KinkyDungeonPoolUses = 10000;
			}

			KinkyDungeonPoolUses += 1;
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
			DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonCommercePurchase").replace("ItemCost", "" + cost), (cost <= KinkyDungeonGold) ? "White" : "Pink", "", "");
			DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonCommerceNext"), "White", "", "");
			if (KinkyDungeonShopIndex > KinkyDungeonShopItems.length) {
				KinkyDungeonShopIndex = 0;
			} else if (KinkyDungeonShopItems.length > 0 && KinkyDungeonShopItems[KinkyDungeonShopIndex]) {
				DrawText(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name), 650, 850, "white", "silver");
			}
		}
	} else {
		if (cost == 0) {
			DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonDrinkShrine"), (KinkyDungeonPoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && KinkyDungeonStatMana < KinkyDungeonStatManaMax) ? "#AAFFFF" : "#444444", "", "");
		} else {
			DrawButton(675, 825, 300, 60, TextGet("KinkyDungeonPayShrine").replace("XXX", "" + cost), "White", "", "");
			DrawButton(1000, 825, 100, 60, TextGet("KinkyDungeonDrinkShrine"), (KinkyDungeonPoolUses <= 1 / KinkyDungeonShrinePoolChancePerUse && KinkyDungeonStatMana < KinkyDungeonStatManaMax) ? "#AAFFFF" : "#444444", "", "");
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
			if (!KinkyDungeonPlayer.CanTalk() && Math.random() < 0.33) BoundType = "Gag";
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
		if (Math.random() * 100 > -rep + 75) KinkyDungeonGhostDecision += 1;
		if (Math.random() * 100 > -rep + 85) KinkyDungeonGhostDecision += 1;
		if (Math.random() * 100 > -rep + 95) KinkyDungeonGhostDecision += 1;
	}
}

function KinkyDungeonShrineAngerGods(Type) {
	if (Type == "Elements") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), 0, true, KinkyDungeonGenerateLock(true));

		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainArms"), 2, true, KinkyDungeonGenerateLock(true));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("ChainLegs"), 0, true, KinkyDungeonGenerateLock(true));
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

function KinkyDungeonTakeOrb(Amount) {
	KinkyDungeonDrawState = "Orb";
	KinkyDungeonOrbAmount = Amount;
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

	MainCanvas.textAlign = "center";
}
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
			if (MouseIn(canvasOffsetX + XX, yPad + canvasOffsetY + spacing * i, 250, 55)) {
				KinkyDungeonChangeRep(shrine, Amount * -10);
				KinkyDungeonSpellPoints += Amount;
				KinkyDungeonDrawState = "Game";
				return true;
			}
			i++;
		}

	}


	return true;
}