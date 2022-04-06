"use strict";


var KinkyDungeonFilters = [
	Consumable,
	Restraint,
	Weapon,
	Outfit,
	LooseRestraint,
	Misc,
];

var KinkyDungeonCurrentFilter = KinkyDungeonFilters[0];
var KinkyDungeonCurrentPageInventory = 0;

let KinkyDungeonShowInventory = false;


function KinkyDungeonHandleInventory() {
	let filteredInventory = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter);

	if (KinkyDungeonCurrentPageInventory > 0 && MouseIn(canvasOffsetX_ui + 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60)) {
		KinkyDungeonCurrentPageInventory -= 1;
		return true;
	}
	if (KinkyDungeonCurrentPageInventory < filteredInventory.length-1 && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 325, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60)) {
		KinkyDungeonCurrentPageInventory += 1;
		return true;
	}

	for (let I = 0; I < KinkyDungeonFilters.length; I++)
		if (KinkyDungeonFilterInventory(KinkyDungeonFilters[I]).length > 0 || I == 1)
			if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 115 + I*65, 225, 60)) {
				KinkyDungeonCurrentFilter = KinkyDungeonFilters[I];
				KinkyDungeonCurrentPageInventory = 0;
				return true;
			}

	if (KinkyDungeonDrawInventorySelected(filteredInventory)) {
		if (KinkyDungeonCurrentFilter == Consumable && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60)) {
			let item = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter)[KinkyDungeonCurrentPageInventory];
			if (!item || !item.name) return true;

			KinkyDungeonAttemptConsumable(item.name, 1);
		} else if (KinkyDungeonCurrentFilter == Weapon) {
			let weapon = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : null);
			if (weapon && weapon != "knife") {
				let equipped = weapon == KinkyDungeonPlayerWeapon;
				if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60) && !equipped) {
					KDSetWeapon(weapon);
					KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + weapon)), "white", 5);
				} else if (MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale + 70, 350, 60) && equipped) {
					KDSetWeapon(null);
					KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
					KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonUnEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + weapon)), "white", 5);
				}
			}
		} else if (KinkyDungeonCurrentFilter == Outfit && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60)) {
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
		} else if (KinkyDungeonCurrentFilter == LooseRestraint && MouseIn(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60)) {
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
					let loose = KinkyDungeonInventoryGetLoose(newItem.name);
					let msg = "KinkyDungeonSelfBondage";
					if (loose.looserestraint.Group == "ItemVulvaPiercings" || loose.looserestraint.Group == "ItemVulva" || loose.looserestraint.Group == "ItemButt") {
						if (KinkyDungeonIsChaste(false)) {
							msg = "KinkyDungeonSelfBondagePlug";
						}
					} else if (loose.looserestraint.Group == "Item") {
						if (KinkyDungeonIsChaste(true)) {
							msg = "KinkyDungeonSelfBondageNipple";
						}
					} else if (loose.looserestraint.enchanted) {
						msg = "KinkyDungeonSelfBondageEnchanted";
					}
					KinkyDungeonSendTextMessage(10, TextGet(msg).replace("RestraintName", TextGet("Restraint" + loose.looserestraint.name)), "yellow", 1);
					KinkyDungeonInventoryRemove(loose);
					return true;
				}
			}
		}

	}

	return true;
}

function KinkyDungeonInventoryAddWeapon(Name) {
	if (!KinkyDungeonInventoryGet(Name) && KinkyDungeonWeapons[Name])
		KinkyDungeonInventoryAdd({weapon: KinkyDungeonWeapons[Name], events: KinkyDungeonWeapons[Name].events});
}

function KDInventoryType(item) {
	if (item.restraint) return Restraint;
	if (item.looserestraint) return LooseRestraint;
	if (item.consumable) return Consumable;
	if (item.weapon) return Weapon;
	if (item.outfit) return Outfit;
	return Misc;
}

function KDInventoryName(item) {
	if (item.name) return item.name;
	if (item.restraint) return item.restraint.name;
	if (item.looserestraint) return item.looserestraint.name;
	if (item.consumable) return item.consumable.name;
	if (item.weapon) return item.weapon.name;
	if (item.outfit) return item.outfit.name;
}

function KinkyDungeonFullInventory() {
	let ret = [];
	for (let m of KinkyDungeonInventory.values()) {
		for (let item of m.values()) {
			ret.push(item);
		}
	}
	return ret;
}

function KinkyDungeonInventoryLength() {
	let size = 0;
	for (let m of KinkyDungeonInventory.values()) {
		size += m.size;
	}
	return size;
}

function KinkyDungeonInventoryAdd(item) {
	let type = KDInventoryType(item);
	if (KinkyDungeonInventory.has(type)) {
		KinkyDungeonInventory.get(type).set(KDInventoryName(item), item);
	}
}

function KinkyDungeonInventoryRemove(item) {
	if (item) {
		let type = KDInventoryType(item);
		if (KinkyDungeonInventory.has(type)) {
			KinkyDungeonInventory.get(type).delete(KDInventoryName(item));
		}
	}
}

function KinkyDungeonInventoryGet(Name) {
	for (let m of KinkyDungeonInventory.values()) {
		if (m.has(Name)) return m.get(Name);
	}
	return null;
}

function KinkyDungeonInventoryGetLoose(Name) {
	return KinkyDungeonInventory.get(LooseRestraint).get(Name);
}
function KinkyDungeonInventoryGetConsumable(Name) {
	return KinkyDungeonInventory.get(Consumable).get(Name);
}
function KinkyDungeonInventoryGetWeapon(Name) {
	return KinkyDungeonInventory.get(Weapon).get(Name);
}
function KinkyDungeonInventoryGetOutfit(Name) {
	return KinkyDungeonInventory.get(Outfit).get(Name);
}

function KinkyDungeonAllRestraint() {
	return KinkyDungeonInventory.get(Restraint) ? Array.from(KinkyDungeonInventory.get(Restraint).values()) : [];
}
function KinkyDungeonAllLooseRestraint() {
	return KinkyDungeonInventory.get(LooseRestraint) ? Array.from(KinkyDungeonInventory.get(LooseRestraint).values()) : [];
}
function KinkyDungeonAllConsumable() {
	return KinkyDungeonInventory.get(Consumable) ? Array.from(KinkyDungeonInventory.get(Consumable).values()) : [];
}
function KinkyDungeonAllOutfit() {
	return KinkyDungeonInventory.get(Outfit) ? Array.from(KinkyDungeonInventory.get(Outfit).values()) : [];
}
function KinkyDungeonAllWeapon() {
	return KinkyDungeonInventory.get(Weapon) ? Array.from(KinkyDungeonInventory.get(Weapon).values()) : [];
}

/*for (let item of KinkyDungeonInventory.get(LooseRestraint).values()) {
	if (item.looserestraint && item.looserestraint.name == Name) return item;
}
return null;*/

function KinkyDungeonFilterInventory(Filter, enchanted) {
	let ret = [];
	let category = KinkyDungeonInventory.get(Filter);
	if (category)
		for (let item of category.values()) {
			let Group = "";
			if (item.restraint && item.restraint.Group) Group = item.restraint.Group;
			else if (item.looserestraint && item.looserestraint.Group) Group = item.looserestraint.Group;
			if (Group == "ItemMouth2" || Group == "ItemMouth3") Group = "ItemMouth";

			if (item.restraint) ret.push({name: item.restraint.name, item: item, preview: `Assets/Female3DCG/${Group}/Preview/${item.restraint.AssetGroup ? item.restraint.AssetGroup : item.restraint.Asset}.png`});
			else if (item.looserestraint && (!enchanted || item.looserestraint.enchanted || item.looserestraint.potionAncientCost)) ret.push({name: item.looserestraint.name, item: item, preview: `Assets/Female3DCG/${Group}/Preview/${item.looserestraint.Asset}.png`});
			else if (item.consumable) ret.push({name: item.consumable.name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Consumables/${item.consumable.name}.png`});
			else if (item.weapon) ret.push({name: item.weapon.name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Weapons/${item.weapon.name}.png`});
			else if (item.outfit) ret.push({name: item.outfit.name, item: item, preview: `Screens/MiniGame/KinkyDungeon/Outfits/${item.outfit.name}.png`});
			else if (item && item.name) ret.push({name: item.name, item: item});
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

	DrawTextFit(TextGet(prefix + name), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5, 300, "black", "silver");
	let textSplit = KinkyDungeonWordWrap(TextGet(prefix + name + "Desc"), 17).split('\n');
	let textSplit2 = KinkyDungeonWordWrap(TextGet(prefix + name + "Desc2"), 17).split('\n');


	let showpreview =  (item.preview && !MouseIn(canvasOffsetX_ui, canvasOffsetY_ui, 840, 583));


	let i = 2;
	if (showpreview) {
		DrawPreviewBox(canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35 - 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 45, item.preview, "", {Background: "#00000000"});
		let restraint = item.item.restraint ? item.item.restraint : (item.item.looserestraint ? item.item.looserestraint : null);
		let consumable = item.item.consumable;
		let weapon = item.item.weapon;
		if (restraint) {
			DrawText(TextGet("KinkyDungeonRestraintLevel").replace("RestraintLevel", "" + Math.max(1, restraint.power)).replace("Rarity", TextGet("KinkyDungeonRarity" + Math.max(0, Math.min(Math.floor(restraint.power/5))))), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 330, "black", "silver");
			DrawText(
			item.item.restraint && restraint.escapeChance ? (item.item.lock ? (TextGet("KinkyLocked") + " " + TextGet("Kinky" + item.item.lock + "LockType")) : TextGet("KinkyUnlocked"))
			: (restraint.escapeChance.Pick != null ? TextGet("KinkyLockable") : TextGet("KinkyNonLockable")), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 370, "black", "silver");
		} else if (consumable) {
			DrawText(TextGet("KinkyDungeonConsumableQuantity") + item.item.quantity, canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 330, "black", "silver");
			DrawText(TextGet("KinkyDungeonRarity") + TextGet("KinkyDungeonRarity" + consumable.rarity), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 370, "black", "silver");
		} else if (weapon) {
			DrawText(TextGet("KinkyDungeonWeaponDamage") + (item.item.weapon.dmg * 10), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 310, "black", "silver");
			DrawText(TextGet("KinkyDungeonWeaponAccuracy") + Math.round(item.item.weapon.chance * 100) + "%", canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 350, "black", "silver");
			let cost = -KinkyDungeonStatStaminaCostAttack;
			if (item.item.weapon.staminacost) cost = item.item.weapon.staminacost;
			DrawText(TextGet("KinkyDungeonWeaponStamina") + (-1*cost), canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + 390, "black", "silver");
		}

	} else {
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX_ui + 640*KinkyDungeonBookScale/3.35, canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}
	}
	i = 0;
	for (let N = 0; N < textSplit2.length; N++) {
		DrawText(textSplit2[N],
			canvasOffsetX_ui + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY_ui + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}

	i = 0;

	return true;
}



function KinkyDungeonDrawInventory() {
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX_ui, canvasOffsetY_ui, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false);



	if (KinkyDungeonCurrentPageInventory >= KinkyDungeonInventoryLength()) KinkyDungeonCurrentPageInventory = 0;

	let defaultIndex = 0;
	if (KinkyDungeonFilterInventory(KinkyDungeonFilters[0]).length == 0) defaultIndex = 1;

	for (let I = 0; I < KinkyDungeonFilters.length; I++) {
		let col = "#444444";
		if (KinkyDungeonFilterInventory(KinkyDungeonFilters[I]).length > 0 || I == defaultIndex)
			col = "#888888";
		else if (KinkyDungeonFilters.indexOf(KinkyDungeonCurrentFilter) == I) KinkyDungeonCurrentFilter = KinkyDungeonFilters[defaultIndex];

		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 40, canvasOffsetY_ui + 115 + I*65, 225, 60, TextGet("KinkyDungeonCategoryFilter" + KinkyDungeonFilters[I]), (KinkyDungeonCurrentFilter == KinkyDungeonFilters[I]) ? "White" : col, "", "");
	}

	let filteredInventory = KinkyDungeonFilterInventory(KinkyDungeonCurrentFilter);
	if (KinkyDungeonDrawInventorySelected(filteredInventory)) {
		if (KinkyDungeonCurrentFilter == Consumable)
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonConsume"), "White", "", "");
		if (KinkyDungeonCurrentFilter == Weapon && filteredInventory[KinkyDungeonCurrentPageInventory].name != "Knife") {
			let equipped = filteredInventory[KinkyDungeonCurrentPageInventory] && filteredInventory[KinkyDungeonCurrentPageInventory].name == KinkyDungeonPlayerWeapon;
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet(equipped ? "KinkyDungeonEquipped" : "KinkyDungeonEquip"), equipped ? "grey" : "White", "", "");
			if (equipped) DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale + 70, 350, 60, TextGet("KinkyDungeonUnEquip"), "White", "", "");
		}
		if (KinkyDungeonCurrentFilter == Outfit) {
			let outfit = ((filteredInventory[KinkyDungeonCurrentPageInventory] != null) ? filteredInventory[KinkyDungeonCurrentPageInventory].name : "");
			let toWear = KinkyDungeonGetOutfit(outfit);
			if (toWear) {
				DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonEquip"), KDGameData.Outfit == outfit ? "grey" : "White", "", "");
			}
		}
		if (KinkyDungeonCurrentFilter == LooseRestraint) {
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
			DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale + 25, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 350, 60, TextGet("KinkyDungeonEquip"), equipped ? "grey" : "White", "", "");
		}
	}
	if (KinkyDungeonCurrentPageInventory >= filteredInventory.length) KinkyDungeonCurrentPageInventory = Math.max(0, KinkyDungeonCurrentPageInventory - 1);

	if (KinkyDungeonCurrentPageInventory > 0) {
		DrawButton(canvasOffsetX_ui + 100, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
	}
	if (KinkyDungeonCurrentPageInventory < filteredInventory.length-1) {
		DrawButton(canvasOffsetX_ui + 640*KinkyDungeonBookScale - 325, canvasOffsetY_ui + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
	}

}

function KinkyDungeonSendInventoryEvent(Event, data) {
	for (let item of KinkyDungeonFullInventory()) {
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
	let consumables = KinkyDungeonFilterInventory(Consumable);
	let weapons = KinkyDungeonFilterInventory(Weapon);
	let restraints = KinkyDungeonFilterInventory(LooseRestraint, true);
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

				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), 500, point.y+1 + 30 + 50 + V/2, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), 500, point.y + 30 + 50 + V/2, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), 500, point.y+1 + 30 + 100 + V/2, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), 500, point.y + 30 + 100 + V/2, 1000, "white");
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
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)-100+1, "black");
				DrawText(TextGet("KinkyDungeonInventoryItem" + item.name), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)-100, "white");

				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)-50+1, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)-50, 1000, "white");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)+1, 1000, "black");
				DrawTextFit(TextGet("KinkyDungeonInventoryItem" + item.name + "Desc2"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2), 1000, "white");
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
				DrawText(TextGet("Restraint" + item.name), 500, Math.min(800, 1000 - V - Rheight + point.y + V/2)-100 + 1, "black");
				DrawText(TextGet("Restraint" + item.name), 500, Math.min(800, 1000 - V - Rheight + point.y + V/2)-100, "white");

				DrawTextFit(TextGet("Restraint" + item.name + "Desc"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)-50+1, 1000, "black");
				DrawTextFit(TextGet("Restraint" + item.name + "Desc"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)-50, 1000, "white");
				DrawTextFit(TextGet("Restraint" + item.name + "Desc2"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2)+1, 1000, "black");
				DrawTextFit(TextGet("Restraint" + item.name + "Desc2"), 500, Math.min(800, 1000 - V - Wheight + point.y + V/2), 1000, "white");
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
	let consumables = KinkyDungeonFilterInventory(Consumable);
	let weapons = KinkyDungeonFilterInventory(Weapon);
	let restraints = KinkyDungeonFilterInventory(LooseRestraint, true);
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
				KDSetWeapon(weapon);
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
						let loose = KinkyDungeonInventoryGetLoose(newItem.name);
						let msg = "KinkyDungeonSelfBondage";
						if (loose.looserestraint.Group == "ItemVulvaPiercings" || loose.looserestraint.Group == "ItemVulva" || loose.looserestraint.Group == "ItemButt") {
							if (KinkyDungeonIsChaste(false)) {
								msg = "KinkyDungeonSelfBondagePlug";
							}
						} else if (loose.looserestraint.Group == "Item") {
							if (KinkyDungeonIsChaste(true)) {
								msg = "KinkyDungeonSelfBondageNipple";
							}
						} else if (loose.looserestraint.enchanted) {
							msg = "KinkyDungeonSelfBondageEnchanted";
						}
						KinkyDungeonSendTextMessage(10, TextGet(msg).replace("RestraintName", TextGet("Restraint" + loose.looserestraint.name)), "yellow", 1);
						KinkyDungeonInventoryRemove(loose);
						return true;
					}
				}
			}
			//DrawRect(point.x, 1000 - V - Wheight + point.y, H, V, "white");
			//DrawImageEx(item.preview, point.x, 1000 - V - Wheight + point.y, {Width: 80, Height: 80});
		}
	}


	return false;
}