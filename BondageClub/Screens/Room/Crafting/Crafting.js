"use strict";
var CraftingBackground = "CraftingWorkshop";
var CraftingMode = "Slot";
var CraftingSlot = 0;
var CraftingOffset = 0;
var CraftingItemList = [];

/**
 * Loads the club crafting room in slot selection mode
 * @returns {void} - Nothing.
 */
function CraftingLoad() {
	CraftingMode = "Slot";
}

/**
 * Run the club crafting room if all possible modes
 * @returns {void} - Nothing.
 */
function CraftingRun() {

	// The exit button is everywhere
	DrawButton(1895, 15, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));

	// In slot selection mode, we show 20 slots to select from
	if (CraftingMode == "Slot") {
		DrawText(TextGet("SelectSlot"), 940, 60, "White", "Black");
		for (let S = 0; S < 20; S++) {
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			DrawButton(X, Y, 470, 140, TextGet("EmptySlot"), "White");
		}
	}

	// In item selection mode, we show all restraints from the player inventory
	if (CraftingMode == "Item") {
		DrawButton(1685, 15, 90, 90, "", "White", "Icons/Prev.png", TextGet("Previous"));
		DrawButton(1790, 15, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
		DrawButton(1895, 15, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
		DrawText(TextGet("SelectItem"), 1180, 60, "White", "Black");
		ElementPosition("InputSearch", 315, 52, 600);
		for (let I = CraftingOffset; I < CraftingItemList.length && I < CraftingOffset + 24; I++) {
			let Item = CraftingItemList[I];
			let X = ((I - CraftingOffset) % 8) * 249 + 17;
			let Y = Math.floor((I - CraftingOffset) / 8) * 290 + 130;
			let Hidden = CharacterAppearanceItemIsHidden(Item.Name, Item.Group.Name);
			let Description = Item.Description;
			let Background = MouseIn(X, Y, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
			let Foreground = "Black";
			let Icons = DialogGetAssetIcons(Item);
			if (Hidden) DrawPreviewBox(X, Y, "Icons/HiddenItem.png", Description, { Background, Foreground });
			else DrawAssetPreview(X, Y, Item, { Description, Background, Foreground, Icons });
		}
	}

}

/**
 * Handles clicks in the crafting room.
 * @returns {void} - Nothing.
 */
function CraftingClick() {

	// Can always exit
	if (MouseIn(1895, 15, 90, 90)) CraftingExit();

	// In slot mode, we can select which item slot to craft
	if (CraftingMode == "Slot") {
		for (let S = 0; S < 20; S++) {
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			if (MouseIn(X, Y, 470, 140)) {
				CraftingMode = "Item";
				CraftingSlot = S;
				CraftingOffset = 0;
				let Input = ElementCreateInput("InputSearch", "text", "", "50");
				Input.addEventListener("input", CraftingItemListBuild);
				CraftingItemListBuild();
			}
		}
		return;
	}

	// In item selection mode, the player picks an item from her inventory
	if (CraftingMode == "Item") {
		if (MouseIn(1685, 15, 90, 90)) {
			CraftingOffset = CraftingOffset - 24;
			if (CraftingOffset < 0) CraftingOffset = Math.floor(CraftingItemList.length / 24) * 24;
		}
		if (MouseIn(1790, 15, 90, 90)) {
			CraftingOffset = CraftingOffset + 24;
			if (CraftingOffset >= CraftingItemList.length) CraftingOffset = 0;
		}
	}

}

/**
 * When the player exits the crafting room
 * @returns {void} - Nothing.
 */
function CraftingExit() {
	ElementRemove("InputSearch");
	CommonSetScreen("Room", "MainHall");
}

/**
 * Builds the item list from the player inventory, filters by the search box content
 * @returns {void} - Nothing.
 */
function CraftingItemListBuild() {
	let Search = ElementValue("InputSearch");
	if (Search == null) Search = "";
	Search = Search.toUpperCase().trim();
	for (let A = 0; A < Asset.length; A++)
	CraftingItemList = [];
	for (let I of Player.Inventory)
		if ((I.Asset != null) && (I.Asset.Name != null) && (I.Asset.Group != null) && I.Asset.IsRestraint && (I.Asset.Group.Name.substr(0, 4) == "Item") && (I.Asset.Group.Name != "ItemAddon") && (I.Asset.Name.substr(0, 12) != "SpankingToys"))
			if ((Search == "") || (I.Asset.Description == null) || (I.Asset.Description.toUpperCase().trim().indexOf(Search) >= 0)) {
				let Found = false;
				for (let E of CraftingItemList)
					if (E.Name == I.Asset.Name)
						Found = true;
				if (!Found) CraftingItemList.push(I.Asset);
			}
	CraftingItemList.sort((a,b) => (a.Description > b.Description) ? 1 : (b.Description > a.Description) ? -1 : 0);
	if (CraftingOffset >= CraftingItemList.length) CraftingOffset = 0;
}