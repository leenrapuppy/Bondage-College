"use strict";


var KinkyDungeonFilters = [
	"Consumables",
	"Equipped",
	"Weapons",
	"Outfits",
	"Restraints",
	"Misc"
];

var KinkyDungeonCurrentFilter = KinkyDungeonFilters[0];
var KinkyDungeonCurrentPageInventory = 0;

let KinkyDungeonShowInventory = false;


function KinkyDungeonHandleInventory() {
	let filteredInventory = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter);

	if (KinkyDungeonCurrentPageInventory > 0 && MouseIn(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
		KinkyDungeonCurrentPageInventory -= 1;
		return true;
	}
	if (KinkyDungeonCurrentPageInventory < filteredInventory.length-1 && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
		KinkyDungeonCurrentPageInventory += 1;
		return true;
	}

	for (let I = 0; I < KinkyDungeonFilters.length; I++)
		if (KinkyDungeonFilterInventory(KinkyDungeonFilters[I]).length > 0 || I == 1)
			if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 115 + I*65, 225, 60)) {
				KinkyDungeonCurrentFilter = KinkyDungeonFilters[I];
				KinkyDungeonCurrentPageInventory = 0;
				return true;
			}

	if (KinkyDungeonDrawInventorySelected(filteredInventory)) {
		if (KinkyDungeonCurrentFilter == "Consumables" && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60)) {
			let item = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter)[KinkyDungeonCurrentPageInventory];
			if (!item || !item.name) return true;

			KinkyDungeonAttemptConsumable(item.name, 1);
		} else if (KinkyDungeonCurrentFilter == "Weapons") {
			let weapon = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : null);
			if (weapon && weapon != "knife") {
				let equipped = weapon == KinkyDungeonPlayerWeapon;
				if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60) && !equipped) {
					KinkyDungeonPlayerWeapon = weapon;
					KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + weapon)), "white", 5);
				} else if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale + 70, 350, 60) && equipped) {
					KinkyDungeonPlayerWeapon = null;
					KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
					KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonUnEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + weapon)), "white", 5);
				}
			}
		} else if (KinkyDungeonCurrentFilter == "Outfits" && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60)) {
			let outfit = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : null);
			let toWear = KinkyDungeonGetOutfit(outfit);
			if (toWear) {
				let dress = toWear.dress;
				if (dress == "JailUniform" && KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint])
					dress = KinkyDungeonMapParams[MiniGameKinkyDungeonCheckpoint].defeat_outfit;
				KinkyDungeonSetDress(dress, outfit);
				KinkyDungeonSlowMoveTurns = 3;
				KinkyDungeonSleepTime = CommonTime() + 200;
			}
		} else if (KinkyDungeonCurrentFilter == "Restraints" && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60)) {
			let equipped = false;
			let newItem = null;
			let currentItem = null;

			if (filteredInventory[KinkyDungeonCurrentPageInventory]
				&& filteredInventory[KinkyDungeonCurrentPageInventory].item
				&& filteredInventory[KinkyDungeonCurrentPageInventory].item.looserestraint) {
				newItem = filteredInventory[KinkyDungeonCurrentPageInventory].item.looserestraint;
				if (newItem) {
					currentItem = KinkyDungeonGetRestraintItem(newItem.Group);
					if (!currentItem || KinkyDungeonLinkableAndStricter(currentItem.restraint, newItem)) {
						equipped = false;
					} else equipped = true;
				}
			}
			if (!equipped && newItem) {
				let success = KinkyDungeonAddRestraintIfWeaker(newItem, 0, true, "", currentItem && !KinkyDungeonLinkableAndStricter(currentItem.restraint, newItem));
				if (success) {
					for (let II = 0; II < KinkyDungeonInventory.length; II++) {
						if (KinkyDungeonInventory[II].looserestraint && KinkyDungeonInventory[II].looserestraint.name == newItem.name) {
							let msg = "KinkyDungeonSelfBondage";
							if (KinkyDungeonInventory[II].looserestraint.Group == "ItemVulvaPiercings" || KinkyDungeonInventory[II].looserestraint.Group == "ItemVulva" || KinkyDungeonInventory[II].looserestraint.Group == "ItemButt") {
								if (KinkyDungeonIsChaste(false)) {
									msg = "KinkyDungeonSelfBondagePlug";
								}
							} else if (KinkyDungeonInventory[II].looserestraint.Group == "Item") {
								if (KinkyDungeonIsChaste(true)) {
									msg = "KinkyDungeonSelfBondageNipple";
								}
							} else if (KinkyDungeonInventory[II].looserestraint.enchanted) {
								msg = "KinkyDungeonSelfBondageEnchanted";
							}
							KinkyDungeonSendTextMessage(10, TextGet(msg).replace("RestraintName", TextGet("Restraint" + KinkyDungeonInventory[II].looserestraint.name)), "yellow", 1);
							KinkyDungeonInventory.splice(II, 1);
							return true;
						}
					}
				}
			}
		}

	}

	return true;
}

function KinkyDungeonInventoryAddWeapon(Name) {
	if (!KinkyDungeonInventoryGet(Name) && KinkyDungeonWeapons[Name])
		KinkyDungeonInventory.push({weapon: KinkyDungeonWeapons[Name], events: KinkyDungeonWeapons[Name].events});
}

function KinkyDungeonInventoryGet(Name) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.name == Name) return item;
		if (item.restraint && item.restraint.name == Name) return item;
		if (item.looserestraint && item.looserestraint.name == Name) return item;
		if (item.consumable && item.consumable.name == Name) return item;
		if (item.weapon && item.weapon.name == Name) return item;
		if (item.outfit && item.outfit.name == Name) return item;
	}
	return null;
}

function KinkyDungeonInventoryGetLoose(Name) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.looserestraint && item.looserestraint.name == Name) return item;
	}
	return null;
}
function KinkyDungeonInventoryGetOutfit(Name) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.outfit && item.outfit.name == Name) return item;
	}
	return null;
}


function KinkyDungeonFilterInventory(Filter, enchanted) {
	let ret = [];
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		let Group = "";
		if (item.restraint && item.restraint.Group) Group = item.restraint.Group;
		else if (item.looserestraint && item.looserestraint.Group) Group = item.looserestraint.Group;
		if (Group == "ItemMouth2" || Group == "ItemMouth3") Group = "ItemMouth";

		if (item.restraint && (Filter == "Equipped")) ret.push({name: item.restraint.name, item: item, preview: `Assets/Female3DCG/${Group}/Preview/${item.restraint.Asset}.png`});
		else if (item.looserestraint && (!enchanted || item.looserestraint.enchanted) && (Filter == "restraint" || Filter == "Restraints")) ret.push({name: item.looserestraint.name, item: item, preview: `Assets/Female3DCG/${Group}/Preview/${item.looserestraint.Asset}.png`});
		else if (item.consumable && (Filter == "consumable" || Filter == "Consumables")) ret.push({name: item.consumable.name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Consumables/${item.consumable.name}.png`});
		else if (item.weapon && (Filter == "weapon" || Filter == "Weapons")) ret.push({name: item.weapon.name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Weapons/${item.weapon.name}.png`});
		else if (item.outfit && (Filter == "outfit" || Filter == "Outfits")) ret.push({name: item.outfit.name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Outfits/${item.outfit.name}.png`});
		else if (item && item.name && (Filter == "Misc")) ret.push({name: item.name, item: item});
	}

	return ret;
}

function KinkyDungeonDrawInventorySelected(List) {
	KinkyDungeonDrawMessages(true);

	let item = List[KinkyDungeonCurrentPageInventory];
	if (!item) return false;
	let name = item.name;
	let prefix = "KinkyDungeonInventoryItem";
	if (item.item.restraint || item.item.looserestraint) prefix = "Restraint";

	DrawTextFit(TextGet(prefix + name), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5, 300, "black", "silver");
	let textSplit = KinkyDungeonWordWrap(TextGet(prefix + name + "Desc"), 17).split('\n');
	let textSplit2 = KinkyDungeonWordWrap(TextGet(prefix + name + "Desc2"), 17).split('\n');


	let showpreview =  (item.preview && !MouseIn(canvasOffsetX, canvasOffsetY, 840, 583));


	let i = 2;
	if (showpreview) {
		DrawPreviewBox(canvasOffsetX + 640*KinkyDungeonBookScale/3.35 - 100, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 45, item.preview, "", {Background: "#00000000"});
		let restraint = item.item.restraint ? item.item.restraint : (item.item.looserestraint ? item.item.looserestraint : null);
		let consumable = item.item.consumable;
		let weapon = item.item.weapon;
		if (restraint) {
			DrawText(TextGet("KinkyDungeonRestraintLevel").replace("RestraintLevel", "" + Math.max(1, restraint.power)).replace("Rarity", TextGet("KinkyDungeonRarity" + Math.max(0, Math.min(Math.floor(restraint.power/5))))), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 330, "black", "silver");
			DrawText(
			item.item.restraint && restraint.escapeChance ? (item.item.lock ? (TextGet("KinkyLocked") + " " + TextGet("Kinky" + item.item.lock + "LockType")) : TextGet("KinkyUnlocked"))
			: (restraint.escapeChance.Pick != null ? TextGet("KinkyLockable") : TextGet("KinkyNonLockable")), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 370, "black", "silver");
		} else if (consumable) {
			DrawText(TextGet("KinkyDungeonConsumableQuantity") + item.item.quantity, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 330, "black", "silver");
			DrawText(TextGet("KinkyDungeonRarity") + TextGet("KinkyDungeonRarity" + consumable.rarity), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 370, "black", "silver");
		} else if (weapon) {
			DrawText(TextGet("KinkyDungeonWeaponDamage") + (item.item.weapon.dmg * 10), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 310, "black", "silver");
			DrawText(TextGet("KinkyDungeonWeaponAccuracy") + Math.round(item.item.weapon.chance * 100) + "%", canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 350, "black", "silver");
			let cost = -KinkyDungeonStatStaminaCostAttack;
			if (item.item.weapon.staminacost) cost = item.item.weapon.staminacost;
			DrawText(TextGet("KinkyDungeonWeaponStamina") + (-1*cost), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + 390, "black", "silver");
		}

	} else {
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}
	}
	i = 0;
	for (let N = 0; N < textSplit2.length; N++) {
		DrawText(textSplit2[N],
			canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}

	i = 0;

	return true;
}



function KinkyDungeonDrawInventory() {
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX, canvasOffsetY, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false);



	if (KinkyDungeonCurrentPageInventory >= KinkyDungeonInventory.length) KinkyDungeonCurrentPageInventory = 0;

	let defaultIndex = 0;
	if (KinkyDungeonFilterInventory(KinkyDungeonFilters[0]).length == 0) defaultIndex = 1;

	for (let I = 0; I < KinkyDungeonFilters.length; I++) {
		let col = "#444444";
		if (KinkyDungeonFilterInventory(KinkyDungeonFilters[I]).length > 0 || I == defaultIndex)
			col = "#888888";
		else if (KinkyDungeonFilters.indexOf(KinkyDungeonCurrentFilter) == I) KinkyDungeonCurrentFilter = KinkyDungeonFilters[defaultIndex];

		DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 115 + I*65, 225, 60, TextGet("KinkyDungeonCategoryFilter" + KinkyDungeonFilters[I]), (KinkyDungeonCurrentFilter == KinkyDungeonFilters[I]) ? "White" : col, "", "");
	}

	let filteredInventory = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter);
	if (KinkyDungeonDrawInventorySelected(filteredInventory)) {
		if (KinkyDungeonCurrentFilter == "Consumables")
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonConsume"), "White", "", "");
		if (KinkyDungeonCurrentFilter == "Weapons" && filteredInventory[KinkyDungeonCurrentPageInventory].name != "Knife") {
			let equipped = filteredInventory[KinkyDungeonCurrentPageInventory] && filteredInventory[KinkyDungeonCurrentPageInventory].name == KinkyDungeonPlayerWeapon;
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60, TextGet(equipped ? "KinkyDungeonEquipped" : "KinkyDungeonEquip"), equipped ? "grey" : "White", "", "");
			if (equipped) DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale + 70, 350, 60, TextGet("KinkyDungeonUnEquip"), "White", "", "");
		}
		if (KinkyDungeonCurrentFilter == "Outfits") {
			let outfit = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : "");
			let toWear = KinkyDungeonGetOutfit(outfit);
			if (toWear) {
				DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonEquip"), KDGameData.Outfit == outfit ? "grey" : "White", "", "");
			}
		}
		if (KinkyDungeonCurrentFilter == "Restraints") {
			let equipped = false;

			if (filteredInventory[KinkyDungeonCurrentPageInventory]
				&& filteredInventory[KinkyDungeonCurrentPageInventory].item
				&& filteredInventory[KinkyDungeonCurrentPageInventory].item.looserestraint) {
				let newItem = filteredInventory[KinkyDungeonCurrentPageInventory].item.looserestraint;
				if (newItem) {
					let currentItem = KinkyDungeonGetRestraintItem(newItem.Group);
					if (!currentItem || KinkyDungeonLinkableAndStricter(currentItem.restraint, newItem)) {
						equipped = false;
					} else equipped = true;
				}
			}
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 25, canvasOffsetY + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonEquip"), equipped ? "grey" : "White", "", "");
		}
	}
	if (KinkyDungeonCurrentPageInventory >= filteredInventory.length) KinkyDungeonCurrentPageInventory = Math.max(0, KinkyDungeonCurrentPageInventory - 1);

	if (KinkyDungeonCurrentPageInventory > 0) {
		DrawButton(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
	}
	if (KinkyDungeonCurrentPageInventory < filteredInventory.length-1) {
		DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
	}

}

function KinkyDungeonSendInventoryEvent(Event, data) {
	for (let item of KinkyDungeonInventory) {
		if (item.events) {
			for (let e of item.events) {
				if (e.trigger == Event && (!e.requireEnergy || ((!e.energyCost && KDGameData.AncientEnergyLevel > 0) || (e.energyCost && KDGameData.AncientEnergyLevel > e.energyCost)))) {
					KinkyDungeonHandleInventoryEvent(Event, e, item, data);
				}
			}
		}
	}
}

let KinkyDungeonInvDraw = [];

function KinkyDungeonQuickGrid(I, Width, Height, Xcount) {
	let i = 0;
	let h = 0;
	let v = 0;
	while (i < I) {
		if (h < Xcount - 1) h++; else {
			h = 0;
			v++;
		}
		i++;
	}
	return {x: Width*h, y: Height*v};
}

function KinkyDungeonDrawQuickInv() {
	let H = 80;
	let V = 80;
	let consumables = KinkyDungeonFilterInventory("Consumables");
	let weapons = KinkyDungeonFilterInventory("Weapons");
	let restraints = KinkyDungeonFilterInventory("Restraints", true);
	let Wheight = KinkyDungeonQuickGrid(weapons.length-1, H, V, 6).y;
	let Rheight = Wheight + V + KinkyDungeonQuickGrid(restraints.length-1, H, V, 6).y;


	for (let c = 0; c < consumables.length; c++) {
		let item = consumables[c];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(c, H, V, 6);
			if (MouseIn(point.x, point.y + 30, H, V)) {
				DrawRect(point.x, point.y + 30, H, V, "white");
				MainCanvas.textAlign = "left";
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), 500, point.y+1 + 30 + V/2, "black");
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), 500, point.y + 30 + V/2, "white");

				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), 500, point.y+1 + 30 + 50 + V/2, KinkyDungeonCanvas.width, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), 500, point.y + 30 + 50 + V/2, KinkyDungeonCanvas.width, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), 500, point.y+1 + 30 + 100 + V/2, KinkyDungeonCanvas.width, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), 500, point.y + 30 + 100 + V/2, KinkyDungeonCanvas.width, "white");
				MainCanvas.textAlign = "center";
			}
			DrawImageEx(item.preview, point.x, point.y + 30, {Width: 80, Height: 80});

			MainCanvas.textAlign = "left";
			DrawText("" + item.item.quantity, point.x+1, point.y+1 + 30, "black");
			DrawText("" + item.item.quantity, point.x, point.y + 30, "white");
			MainCanvas.textAlign = "center";
		}
	}

	for (let w = 0; w < weapons.length; w++) {
		let item = weapons[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Wheight + point.y, H, V)) {
				DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
				MainCanvas.textAlign = "left";
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)+1, "black");
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2), "white");
				MainCanvas.textAlign = "center";
			}
			DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}

	for (let w = 0; w < restraints.length; w++) {
		let item = restraints[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Rheight + point.y, H, V)) {
				DrawRect(point.x, 1000 - V - Rheight + point.y, H, V, "white");
				MainCanvas.textAlign = "left";
				DrawText(TextGet("Restraint" + item.name), 500, Math.min(800, 1000 - V - Rheight + point.y + V/2) + 1, "black");
				DrawText(TextGet("Restraint" + item.name), 500, Math.min(800, 1000 - V - Rheight + point.y + V/2), "white");
				MainCanvas.textAlign = "center";
			}
			DrawImageEx(item.preview, point.x, 1000 - V - Rheight + point.y, {Width: 80, Height: 80});
		}
	}
}

function KinkyDungeonhandleQuickInv() {
	KinkyDungeonShowInventory = false;

	let H = 80;
	let V = 80;
	let consumables = KinkyDungeonFilterInventory("Consumables");
	let weapons = KinkyDungeonFilterInventory("Weapons");
	let restraints = KinkyDungeonFilterInventory("Restraints", true);
	let Wheight = KinkyDungeonQuickGrid(weapons.length-1, H, V, 6).y;
	let Rheight = Wheight + V + KinkyDungeonQuickGrid(restraints.length-1, H, V, 6).y;


	for (let c = 0; c < consumables.length; c++) {
		let item = consumables[c];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(c, H, V, 6);
			if (MouseIn(point.x, point.y + 30, H, V))
				KinkyDungeonAttemptConsumable(item.name, 1);
				//DrawRect(point.x, point.y + 30, H, V, "white");
			//DrawImageEx(item.preview, point.x, point.y + 30, {Width: 80, Height: 80});
		}
	}

	for (let w = 0; w < weapons.length; w++) {
		let item = weapons[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Wheight + point.y, H, V)) {
				let weapon = item.name != "Knife" ? item.name : null;
				KinkyDungeonPlayerWeapon = weapon;
				KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
				KinkyDungeonAdvanceTime(1);
			}
			//DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
			//DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}

	for (let w = 0; w < restraints.length; w++) {
		let item = restraints[w];
		if (item.preview) {
			let point = KinkyDungeonQuickGrid(w, H, V, 6);
			if (MouseIn(point.x, 1000 - V - Rheight + point.y, H, V)) {
				let equipped = false;
				let newItem = null;
				let currentItem = null;

				if (item
					&& item.item
					&& item.item.looserestraint) {
					newItem = item.item.looserestraint;
					if (newItem) {
						currentItem = KinkyDungeonGetRestraintItem(newItem.Group);
						if (!currentItem || KinkyDungeonLinkableAndStricter(currentItem.restraint, newItem)) {
							equipped = false;
						} else equipped = true;
					}
				}
				if (!equipped && newItem) {
					let success = KinkyDungeonAddRestraintIfWeaker(newItem, 0, true, "", currentItem && !KinkyDungeonLinkableAndStricter(currentItem.restraint, newItem));
					if (success) {
						for (let II = 0; II < KinkyDungeonInventory.length; II++) {
							if (KinkyDungeonInventory[II].looserestraint && KinkyDungeonInventory[II].looserestraint.name == newItem.name) {
								let msg = "KinkyDungeonSelfBondage";
								if (KinkyDungeonInventory[II].looserestraint.Group == "ItemVulvaPiercings" || KinkyDungeonInventory[II].looserestraint.Group == "ItemVulva" || KinkyDungeonInventory[II].looserestraint.Group == "ItemButt") {
									if (KinkyDungeonIsChaste(false)) {
										msg = "KinkyDungeonSelfBondagePlug";
									}
								} else if (KinkyDungeonInventory[II].looserestraint.Group == "Item") {
									if (KinkyDungeonIsChaste(true)) {
										msg = "KinkyDungeonSelfBondageNipple";
									}
								} else if (KinkyDungeonInventory[II].looserestraint.enchanted) {
									msg = "KinkyDungeonSelfBondageEnchanted";
								}
								KinkyDungeonSendTextMessage(10, TextGet(msg).replace("RestraintName", TextGet("Restraint" + KinkyDungeonInventory[II].looserestraint.name)), "yellow", 1);
								KinkyDungeonInventory.splice(II, 1);
								return true;
							}
						}
					}
				}
			}
			//DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
			//DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}


	return false;
}