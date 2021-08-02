"use strict";

var KinkyDungeonConsumables = {
	"PotionHealth" : {name: "PotionHealth", rarity: 1, shop: true, type: "restore", wp_instant: 10, wp_gradual: 20, duration: 10},
	"PotionHealthGreater" : {name: "PotionHealthGreater", rarity: 2, shop: true, type: "restore", wp_instant: 10, wp_gradual: 40, duration: 10},
	"PotionHealthUltimate" : {name: "PotionHealthUltimate", rarity: 3, shop: true, type: "restore", wp_instant: 20, wp_gradual: 80, duration: 10},
	"PotionMana" : {name: "PotionMana", rarity: 0, shop: true, type: "restore", mp_instant: -10, mp_gradual: -40, duration: 20},
	"PotionStamina" : {name: "PotionStamina", rarity: 1, shop: true, type: "restore", sp_gradual: 100, duration: 10},
	"PotionFrigid" : {name: "PotionFrigid", rarity: 1, shop: true, type: "restore", ap_instant: 0, ap_gradual: -50, duration: 5},
};

function KinkyDungeonGetInventoryItem(Name, Filter = "Consumables") {
	let Filtered = KinkyDungeonFilterInventory(Filter);
	for (let I = 0; I < Filtered.length; I++) {
		let item = Filtered[I];
		if (item.name == Name) return item;
	}
	return null;
}

function KinkyDungeonGetShopItem(Level, Rarity, Shop) {
	let Table = [];
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	if (params.ShopExclusives) {
		for (let S = 0; S < params.ShopExclusives.length; S++) {
			Table.push(params.ShopExclusives[S]);
		}
	}
	let Shopable = Object.entries(KinkyDungeonConsumables).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Consumable";
		Table.push(s);
	}
	// @ts-ignore
	Shopable = Object.entries(KinkyDungeonWeapons).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Weapon";
		Table.push(s);
	}

	for (let R = Rarity; R >= 0; R--) {
		let available = Table.filter((item) => (item.rarity == R));
		if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
	}
	return null;
}



function KinkyDungeonChangeConsumable(Consumable, Quantity) {
	let consumables = KinkyDungeonFilterInventory("Consumables");
	for (let I = 0; I < consumables.length; I++) {
		let item = consumables[I];
		if (item.name == Consumable.name) {
			item.item.quantity += Quantity;
			if (item.item.quantity <= 0) {
				for (let II = 0; II < KinkyDungeonInventory.length; II++) {
					if (KinkyDungeonInventory[II].consumable && KinkyDungeonInventory[II].consumable.name == Consumable.name) {
						KinkyDungeonInventory.splice(II, 1);
						return true;
					}
				}
			}
			return true;
		}
	}

	if (Quantity >= 0) {
		KinkyDungeonInventory.push({consumable: Consumable, quantity: Quantity});
	}

	return false;
}

function KinkyDungeonConsumableEffect(Consumable) {
	if (Consumable.type == "restore") {
		if (Consumable.wp_instant) KinkyDungeonStatWillpower += Consumable.wp_instant;
		if (Consumable.mp_instant) KinkyDungeonStatStaminaMana += Consumable.mp_instant;
		if (Consumable.sp_instant) KinkyDungeonStatStamina += Consumable.sp_instant;
		if (Consumable.ap_instant) KinkyDungeonStatArousal += Consumable.ap_instant;

		if (Consumable.wp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionHealth", type: "restore_wp", power: Consumable.wp_gradual/Consumable.duration, duration: Consumable.duration}, true);
		if (Consumable.mp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionMana", type: "restore_mp", power: Consumable.mp_gradual/Consumable.duration, duration: Consumable.duration}, true);
		if (Consumable.sp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionStamina", type: "restore_sp", power: Consumable.sp_gradual/Consumable.duration, duration: Consumable.duration}, true);
		if (Consumable.ap_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {name: "PotionFrigid", type: "restore_ap", power: Consumable.ap_gradual/Consumable.duration, duration: Consumable.duration}, true);
	}
}

function KinkyDungeonUseConsumable(Name, Quantity) {
	let item = KinkyDungeonGetInventoryItem(Name, "Consumables");
	if (!item || item.item.quantity < Quantity) return false;

	for (let I = 0; I < Quantity; I++) {
		KinkyDungeonConsumableEffect(item.item.consumable);
	}
	KinkyDungeonChangeConsumable(item.item.consumable, -Quantity);

	KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonInventoryItem" + Name + "Use"), "#88FF88", 1);
	return true;
}