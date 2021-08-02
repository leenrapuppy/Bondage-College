"use strict";
var KinkyDungeonShrineBaseCosts = {
	"Charms": 10,
	"Leather": 25,
	"Metal": 30,
	"Gags": 30,
	"Blindfolds": 30,
	"Boots": 30,
	"Rope": 15,
	"Locks": 25,
	"Will": 10,
	"Elements": 50,
	"Conjure": 50,
	"Illusion": 50,
};

var KinkyDungeonShrineBaseCostGrowth = {
	"Elements": 2,
	"Conjure": 2,
	"Illusion": 2,
};

var KinkyDungeonShopItems = [];
var KinkyDungeonShopIndex = 0;

var KinkyDungeonShrineCosts = {};
var KinkyDungeonShrineTypeRemove = ["Charms", "Leather", "Metal", "Rope", "Gags", "Blindfolds", "Boots"]; // These shrines will always remove restraints associated with their shrine

function KinkyDungeonShrineInit() {
	KinkyDungeonShrineCosts = {};

}

function KinkyDungeonShrineAvailable(type) {
	if (type == "Commerce") {
		if (KinkyDungeonShopItems.length > 0) return true;
		else return false;
	}
	if (KinkyDungeonShrineTypeRemove.includes(type) && KinkyDungeonGetRestraintsWithShrine(type).length > 0) return true;
	else if ((type == "Elements" || type == "Illusion" || type == "Conjure") && KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]).length > 0) return true;
	else if (type == "Will" && (KinkyDungeonStatWillpower < KinkyDungeonStatWillpowerMax || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax)) return true;

	return false;
}


function KinkyDungeonGenerateShop(Level) {
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
			let costt = 5 * Math.round((1 + MiniGameKinkyDungeonLevel/10)*(20 + 2 * item.rarity * item.rarity * 10)/5);
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

	// TODO shrine effects
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		KinkyDungeonRemoveRestraintsWithShrine(type);

		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints");
	} else if (type == "Elements" || type == "Illusion" || type == "Conjure") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList[type]);
		if (Math.random() < 0.1 || SpellsUnlearned.length == 0) SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5 + MiniGameKinkyDungeonCheckpoint, KinkyDungeonSpellList[type]);

		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (type == "Will") {
		KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;
		KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
		KinkyDungeonStatStaminaMana = 0;
		KinkyDungeonNextDataSendStatsTime = 0;

		ShrineMsg = TextGet("KinkyDungeonPayShrineHeal");
	} else if (type == "Commerce") {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item.shoptype == "Consumable")
			KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.name], 1);
		else if (item.shoptype == "Weapon")
			KinkyDungeonInventoryAddWeapon(item.name);
		ShrineMsg = TextGet("KinkyDungeonPayShrineCommerce").replace("ItemBought", TextGet("KinkyDungeonInventoryItem" + item.name));
		KinkyDungeonShopItems.splice(KinkyDungeonShopIndex, 1);
		if (KinkyDungeonShopIndex > 0) KinkyDungeonShopIndex -= 1;

	}

	if (ShrineMsg) KinkyDungeonSendActionMessage(10, ShrineMsg, "lightblue", 1);

	if (KinkyDungeonShrineCosts[type] > 0) KinkyDungeonShrineCosts[type] = KinkyDungeonShrineCosts[type] + 1;
	else KinkyDungeonShrineCosts[type] = 1;
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
		if (cost > 0 && MouseIn(675, 825, 350, 60)) {
			KinkyDungeonAdvanceTime(1, true);
			KinkyDungeonTargetTile = null;
			if (KinkyDungeonGold > cost) {
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
			DrawText(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name), 650, 850, "white", "silver");
		}
	} else {
		if (cost == 0) DrawText(TextGet("KinkyDungeonLockedShrine"), 850, 850, "white", "silver");
		else {
			DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonPayShrine").replace("XXX", "" + cost), "White", "", "");
		}
	}
}