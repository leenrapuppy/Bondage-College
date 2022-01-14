"use strict";
var KinkyDungeonGroundItems = []; // Tracking all items on the ground

function KinkyDungeonItemDrop(x, y, dropTable) {
	if (dropTable) {
		let dropWeightTotal = 0;
		let dropWeights = [];

		for (let L = 0; L < dropTable.length; L++) {
			let drop = dropTable[L];
			let weight = drop.weight;
			dropWeights.push({drop: drop, weight: dropWeightTotal});
			if (drop.ignoreInInventory && KinkyDungeonInventoryGet(drop.name)) weight = 0;
			dropWeightTotal += weight;
		}

		let selection = Math.random() * dropWeightTotal;

		for (let L = dropWeights.length - 1; L >= 0; L--) {
			if (selection > dropWeights[L].weight) {
				if (dropWeights[L].drop.name != "Nothing") {
					let dropped = {x:x, y:y, name: dropWeights[L].drop.name, amount: dropWeights[L].drop.amountMin + Math.floor(Math.random()*dropWeights[L].drop.amountMax)};
					KinkyDungeonGroundItems.push(dropped);
					return dropped;
				}
				return false;
			}
		}
	}
	return false;
}

function KinkyDungeonDropItem(Item) {
	let slots = [];
	for (let X = -Math.ceil(1); X <= Math.ceil(1); X++)
		for (let Y = -Math.ceil(1); Y <= Math.ceil(1); Y++) {
			slots.push({x:X, y:Y});
		}

	let foundslot = null;
	for (let C = 0; C < 100; C++) {
		let slot = slots[Math.floor(Math.random() * slots.length)];
		if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x+slot.x, KinkyDungeonPlayerEntity.y+slot.y)) && KinkyDungeonNoEnemy(KinkyDungeonPlayerEntity.x+slot.x, KinkyDungeonPlayerEntity.y+slot.y, true)) {
			foundslot = {x: KinkyDungeonPlayerEntity.x+slot.x, y: KinkyDungeonPlayerEntity.y+slot.y};

			C = 100;
		} else slots.splice(C, 1);
	}

	if (foundslot) {

		let dropped = {x:foundslot.x, y:foundslot.y, name: Item.name};
		if (Item.amountMin && Item.amountMax) {
			dropped.amount = Item.amountMin + Math.floor(Math.random()*Item.amountMax);
		} else if (Item.amount) {
			dropped.amount = Item.amount;
		}

		KinkyDungeonGroundItems.push(dropped);
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonDrop" + Item.name), "red", 2);

		return true;
	}

	return false;
}

function KinkyDungeonItemEvent(Item) {
	let color = "white";
	let priority = 1;
	if (Item.name == "Gold") {
		color = "yellow";
		KinkyDungeonAddGold(Item.amount);
	} else if (Item.name == "Lore") {
		KinkyDungeonNewLore();
	} else if (Item.name == "Pick") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonLockpicks += 1;
	} else if (Item.name == "Hammer") {
		priority = 4;
		color = "orange";
		KinkyDungeonInventoryAddWeapon("Hammer");
	} else if (Item.name == "MagicSword") {
		priority = 4;
		color = "orange";
		KinkyDungeonInventoryAddWeapon("MagicSword");
	} else if (Item.name == "Knife") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonNormalBlades += 1;
	} else if (Item.name == "Knives") {
		priority = 3;
		color = "lightgreen";
		KinkyDungeonNormalBlades += 3;
	} else if (Item.name == "EnchKnife") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonEnchantedBlades += 1;
	} else if (Item.name == "RedKey") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonRedKeys += 1;
	} else if (Item.name == "BlueKey") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonBlueKeys += 1;
	} else if (Item.name == "PotionMana") {
		priority = 3;
		color = "lightblue";
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	} else if (Item.name == "PotionStamina") {
		priority = 3;
		color = "lightgreen";
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	} else if (Item.name == "PotionFrigid") {
		priority = 3;
		color = "grey";
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	}
	AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Coins.ogg");
	KinkyDungeonSendActionMessage(priority, TextGet("ItemPickup" + Item.name).replace("XXX", Item.amount), color, 2);
}


function KinkyDungeonItemCheck(x, y, Index) {
	for (let I = 0; I < KinkyDungeonGroundItems.length; I++) {
		var item = KinkyDungeonGroundItems[I];
		if (KinkyDungeonPlayerEntity.x == item.x && KinkyDungeonPlayerEntity.y == item.y) {
			KinkyDungeonGroundItems.splice(I, 1);
			return KinkyDungeonItemEvent(item);
		}
	}
}

function KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonGroundItems.length; E++) {
		var item = KinkyDungeonGroundItems[E];
		var sprite = item.name;
		if (KinkyDungeonGroundItems[E].x >= CamX && KinkyDungeonGroundItems[E].y >= CamY && KinkyDungeonGroundItems[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonGroundItems[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Items/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(KinkyDungeonGroundItems[E].x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonGroundItems[E].y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
		}
	}
}

