"use strict";
let KinkyDungeonGroundItems = []; // Tracking all items on the ground

function KinkyDungeonItemDrop(x, y, dropTable, summoned) {
	if (dropTable) {
		let dropWeightTotal = 0;
		let dropWeights = [];

		for (let drop of dropTable) {
			let weight = drop.weight;
			dropWeights.push({drop: drop, weight: dropWeightTotal});
			if (drop.ignoreInInventory && KinkyDungeonInventoryGet(drop.name)) weight = 0;
			dropWeightTotal += weight;
		}

		let selection = KDRandom() * dropWeightTotal;

		for (let L = dropWeights.length - 1; L >= 0; L--) {
			if (selection > dropWeights[L].weight) {
				if (dropWeights[L].drop.name != "Nothing" && (!KinkyDungeonStatsChoice.get("Stealthy") || dropWeights[L].drop.name != "Gold") && (!summoned || !dropWeights[L].drop.noSummon)) {
					let dropped = {x:x, y:y, name: dropWeights[L].drop.name, amount: dropWeights[L].drop.amountMin + Math.floor(KDRandom()*dropWeights[L].drop.amountMax)};
					if (!KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x, y))) {
						let newPoint = KinkyDungeonGetNearbyPoint(x, y, false, undefined, true);
						if (newPoint) {
							dropped.x = newPoint.x;
							dropped.y = newPoint.y;
						} else {
							console.log("Failed to find point to drop " + TextGet("KinkyDungeonInventoryItem" + dropWeights[L].drop.name));
						}
					}
					KinkyDungeonGroundItems.push(dropped);
					return dropped;
				}
				return false;
			}
		}
	}
	return false;
}

function KinkyDungeonDropItem(Item, Origin, AllowOrigin, noMsg, allowEnemies) {
	let slots = [];
	for (let X = -Math.ceil(1); X <= Math.ceil(1); X++)
		for (let Y = -Math.ceil(1); Y <= Math.ceil(1); Y++) {
			if ((X != 0 || Y != 0))
				slots.push({x:X, y:Y});
		}

	let foundslot = AllowOrigin ? {x:Origin.x, y:Origin.y} : null;
	if (!foundslot || !(KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(foundslot.x, foundslot.y))
			&& (allowEnemies || KinkyDungeonNoEnemy(foundslot.x, foundslot.y, true))))
		for (let C = 0; C < 100; C++) {
			let slot = slots[Math.floor(KDRandom() * slots.length)];
			if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Origin.x+slot.x, Origin.y+slot.y))
				&& (allowEnemies || KinkyDungeonNoEnemy(Origin.x+slot.x, Origin.y+slot.y, true))) {
				foundslot = {x: Origin.x+slot.x, y: Origin.y+slot.y};

				C = 100;
			} else slots.splice(C, 1);
		}

	if (foundslot) {

		let dropped = {x:foundslot.x, y:foundslot.y, name: Item.name};
		if (Item.amountMin && Item.amountMax) {
			dropped.amount = Item.amountMin + Math.floor(KDRandom()*Item.amountMax);
		} else if (Item.amount) {
			dropped.amount = Item.amount;
		}

		KinkyDungeonGroundItems.push(dropped);
		if (!noMsg)
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonDrop" + Item.name), "red", 2);

		return true;
	}

	return false;
}

function KinkyDungeonItemEvent(Item) {
	let color = "white";
	let priority = 1;
	let sfx = "Coins";
	if (Item.name == "Gold") {
		color = "yellow";
		KinkyDungeonAddGold(Item.amount);
	} else if (Item.name == "Lore") {
		KinkyDungeonNewLore();
	} else if (Item.name == "Pick") {
		priority = 2;
		color = "lightgreen";
		KinkyDungeonLockpicks += 1;
	} else if (Item.name == "MagicSword") {
		priority = 8;
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
		sfx = "PotionDrink";
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	} else if (Item.name == "PotionStamina") {
		priority = 3;
		sfx = "PotionDrink";
		color = "lightgreen";
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	} else if (Item.name == "PotionFrigid") {
		priority = 3;
		sfx = "PotionDrink";
		color = "white";
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	} else if (KinkyDungeonFindConsumable(Item.name)) {
		let item = KinkyDungeonFindConsumable(Item.name);
		priority = item.rarity;
		if (item.potion) sfx = "PotionDrink";
		color = "white";
		KinkyDungeonChangeConsumable(item, 1);
	} else if (KinkyDungeonFindWeapon(Item.name)) {
		let item = KinkyDungeonFindWeapon(Item.name);
		priority = Math.min(8, item.rarity + 4);
		color = "orange";
		KinkyDungeonInventoryAddWeapon(Item.name);
	} else if (Item.name == "Heart") {
		if (KinkyDungeonStatDistractionMax >= 70 && KinkyDungeonStatStaminaMax >= 70 && KinkyDungeonStatManaMax >= 70) {
			KinkyDungeonDrawState = "Game";
			KinkyDungeonChangeStamina(24);
			KinkyDungeonChangeMana(24);
		} else if (KinkyDungeonIsPlayer()) KinkyDungeonDrawState = "Heart";
	} else if (Item.name == "Keyring") {
		KDGameData.JailKey = true;
		KinkyDungeonAggroAction('key', {});
	}
	if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
	KinkyDungeonSendActionMessage(priority, TextGet("ItemPickup" + Item.name).replace("XXX", Item.amount), color, 2);
}


function KinkyDungeonItemCheck(x, y, Index) {
	for (let I = 0; I < KinkyDungeonGroundItems.length; I++) {
		let item = KinkyDungeonGroundItems[I];
		if (KinkyDungeonPlayerEntity.x == item.x && KinkyDungeonPlayerEntity.y == item.y) {
			KinkyDungeonGroundItems.splice(I, 1);
			I -= 1;
			KinkyDungeonItemEvent(item);
		}
	}
}

function KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let item of KinkyDungeonGroundItems) {
		let sprite = item.name;
		if (item.x >= CamX && item.y >= CamY && item.x < CamX + KinkyDungeonGridWidthDisplay && item.y < CamY + KinkyDungeonGridHeightDisplay && KinkyDungeonLightGet(item.x, item.y) > 0) {
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Items/" + sprite + ".png",
				KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
				(item.x - CamX)*KinkyDungeonGridSizeDisplay, (item.y - CamY)*KinkyDungeonGridSizeDisplay,
				KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
		}
	}
}



function KinkyDungeonDrawHeart() {

	DrawText(TextGet("KinkyDungeonHeartIntro"), 1250, 200, "white", "silver");
	DrawText(TextGet("KinkyDungeonHeartIntro1"), 1250, 300, "white", "silver");
	DrawText(TextGet("KinkyDungeonHeartIntro2"), 1250, 350, "white", "silver");
	DrawText(TextGet("KinkyDungeonHeartIntro3"), 1250, 400, "white", "silver");

	DrawText(TextGet("StatDistraction").replace("CURRENT/MAX", "" + KinkyDungeonStatDistractionMax), 650 + 350/2, 650, "white", "silver");
	DrawText(TextGet("StatStamina").replace("CURRENT/MAX", "" + KinkyDungeonStatStaminaMax), 1050 + 350/2, 650, "white", "silver");
	DrawText(TextGet("StatMana").replace("CURRENT/MAX", "" + KinkyDungeonStatManaMax), 1450 + 350/2, 650, "white", "silver");

	DrawButton(650, 700, 350, 60, TextGet("KinkyDungeonHeartDistraction"), KinkyDungeonStatDistractionMax < 70 ? "White" : "Grey");
	DrawButton(1050, 700, 350, 60, TextGet("KinkyDungeonHeartStamina"), KinkyDungeonStatStaminaMax < 70 ? "White" : "Grey");
	DrawButton(1450, 700, 350, 60, TextGet("KinkyDungeonHeartMana"), KinkyDungeonStatManaMax < 70 ? "White" : "Grey");
}

function KinkyDungeonHandleHeart() {
	if (MouseIn(650, 700, 350, 60) && KinkyDungeonStatDistractionMax < 70) {
		KDSendInput("heart", {type: "AP"});
		KinkyDungeonDrawState = "Game";
	} else if (MouseIn(1050, 700, 350, 60) && KinkyDungeonStatStaminaMax < 70) {
		KDSendInput("heart", {type: "SP"});
		KinkyDungeonDrawState = "Game";
	} else if (MouseIn(1450, 700, 350, 60) && KinkyDungeonStatManaMax < 70) {
		KDSendInput("heart", {type: "MP"});
		KinkyDungeonDrawState = "Game";
	}

	return true;
}