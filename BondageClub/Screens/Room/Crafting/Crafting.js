"use strict";
var CraftingBackground = "CraftingWorkshop";
var CraftingMode = "Slot";
var CraftingSlot = 0;
var CraftingOffset = 0;
var CraftingItemList = [];
var CraftingItem = null;
var CraftingLock = null;
var CraftingProperty = "";
var CraftingPropertyList = [
	{ Name: "Normal", Allow : function(Item) { return true; } },
	{ Name: "Large", Allow : function(Item) { return CreatingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); } },
	{ Name: "Small", Allow : function(Item) { return CreatingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); } },
	{ Name: "Thick", Allow : function(Item) { return CreatingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy"]); } },
	{ Name: "Thin", Allow : function(Item) { return CreatingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy"]); } },
	{ Name: "Secure", Allow : function(Item) { return true; } },
	{ Name: "Loose", Allow : function(Item) { return true; } },
	{ Name: "Decoy", Allow : function(Item) { return true; } },
	{ Name: "Painful", Allow : function(Item) { return true; } },
	{ Name: "Comfy", Allow : function(Item) { return true; } },
	{ Name: "Strong", Allow : function(Item) { return true; } },
	{ Name: "Flexible", Allow : function(Item) { return true; } },
	{ Name: "Nimble", Allow : function(Item) { return true; } },
	{ Name: "Arousing", Allow : function(Item) { return CreatingItemHasEffect(Item, ["Egged", "Vibrating"]); } },
	{ Name: "Dull", Allow : function(Item) { return CreatingItemHasEffect(Item, ["Egged", "Vibrating"]); } }
];
var CraftingLockList = ["", "MetalPadlock", "IntricatePadlock", "HighSecurityPadlock", "OwnerPadlock", "LoversPadlock", "MistressPadlock", "PandoraPadlock", "ExclusivePadlock"];

/**
 * Returns TRUE if a crafting item has an effect from a list or allows that effect
 * @param {Object} Item - The item asset to validate
 * @param {Array} Effect - The list of effects to validate
 * @returns {Boolean}
 */
function CreatingItemHasEffect(Item, Effect) {
	if (Item.Effect != null)
		for (let E of Effect)
			if (Item.Effect.indexOf(E) >= 0)
				return true;
	if (Item.AllowEffect != null)
		for (let E of Effect)
			if (Item.AllowEffect.indexOf(E) >= 0)
				return true;
	return false;
}

/**
 * Loads the club crafting room in slot selection mode
 * @returns {void} - Nothing.
 */
function CraftingLoad() {
	if ((Player.Crafting == null) || (Player.Crafting.length != 20)) {
		Player.Crafting = [];
		for (let C = 0; C < 20; C++)
			Player.Crafting.push({});
	}
	CraftingModeSet("Slot");
}

/**
 * Run the club crafting room if all possible modes
 * @returns {void} - Nothing.
 */
function CraftingRun() {

	// The exit button is everywhere
	DrawButton(1895, 15, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (CraftingMode != "Slot") DrawButton(1790, 15, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));

	// In slot selection mode, we show 20 slots to select from
	if (CraftingMode == "Slot") {
		DrawText(TextGet("SelectSlot"), 940, 60, "White", "Black");
		for (let S = 0; S < 20; S++) {
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			let Craft = Player.Crafting[S];
			if ((Craft.Name == null) || (Craft.Name == "") || (Craft.Item == null) || (Craft.Item == "")) {
				DrawButton(X, Y, 470, 140, TextGet("EmptySlot"), "White");
			} else {
				DrawButton(X, Y, 470, 140, "", "White");
				DrawTextFit(Craft.Name, X + 295, Y + 25, 315, "Black", "Silver");
				for (let Item of Player.Inventory)
					if (Item.Asset.Name == Craft.Item) {
						DrawImageResize("Assets/" + Player.AssetFamily + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + ".png", X + 3, Y + 3, 135, 135)
						DrawTextFit(Item.Asset.Description, X + 295, Y + 70, 315,  "Black", "Silver");
						DrawTextFit(TextGet("Property" + Craft.Property), X + 295, Y + 115, 315, "Black", "Silver");
						if ((Craft.Lock != null) && (Craft.Lock != ""))
							DrawImageResize("Assets/" + Player.AssetFamily + "/ItemMisc/Preview/" + Craft.Lock + ".png", X + 70, Y + 70, 70, 70);
						break;
					}
			}
		}
	}

	// In item selection mode, we show all restraints from the player inventory
	if (CraftingMode == "Item") {
		DrawText(TextGet("SelectItem"), 1120, 60, "White", "Black");
		DrawButton(1580, 15, 90, 90, "", "White", "Icons/Prev.png", TextGet("Previous"));
		DrawButton(1685, 15, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
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

	// In item selection mode, we show all restraints from the player inventory
	if (CraftingMode == "Property") {
		DrawText(TextGet("SelectProperty").replace("AssetDescription", CraftingItem.Description), 880, 60, "White", "Black");
		let Pos = 0;
		for (let Property of CraftingPropertyList) 
			if (Property.Allow(CraftingItem)) {
				let X = (Pos % 4) * 500 + 15;
				let Y = Math.floor(Pos / 4) * 230 + 130;
				DrawButton(X, Y, 470, 190, "", "White");
				DrawText(TextGet("Property" + Property.Name), X + 235, Y + 40, "Black", "Silver");
				DrawTextWrap(TextGet("Description" + Property.Name), X + 20, Y + 80, 440, 100, "Black", null, 2);
				Pos++;
			}
	}

	// In lock selection mode, the player can auto-apply a lock to it's item
	if (CraftingMode == "Lock") {
		DrawButton(1685, 15, 90, 90, "", "White", "Icons/Unlock.png", TextGet("NoLock"));
		DrawText(TextGet("SelectLock").replace("AssetDescription", CraftingItem.Description).replace("PropertyName", TextGet("Property" + CraftingProperty)), 830, 60, "White", "Black");
		let Pos = 0;
		for (let L = 0; L < CraftingLockList.length; L++)
			for (let Item of Player.Inventory)
				if ((Item.Asset != null) && (Item.Asset.Name == CraftingLockList[L]) && (Item.Asset.Group != null) && (Item.Asset.Group.Name == "ItemMisc")) {
					let X = (Pos % 8) * 249 + 17;
					let Y = Math.floor(Pos / 8) * 290 + 130;
					let Description = Item.Asset.Description;
					let Background = MouseIn(X, Y, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
					let Foreground = "Black";
					let Icons = DialogGetAssetIcons(Item.Asset);
					DrawAssetPreview(X, Y, Item.Asset, { Description, Background, Foreground, Icons });
					Pos++;
				}
	}

	// In lock selection mode, the player can auto-apply a lock to it's item
	if (CraftingMode == "Name") {
		DrawButton(1685, 15, 90, 90, "", "White", "Icons/Accept.png", TextGet("Accept"));
		DrawText(TextGet("SelectName").replace("AssetDescription", CraftingItem.Description).replace("PropertyName", TextGet("Property" + CraftingProperty)), 830, 60, "White", "Black");
		let Hidden = CharacterAppearanceItemIsHidden(CraftingItem.Name, CraftingItem.Group.Name);
		let Description = CraftingItem.Description;
		let Background = MouseIn(80, 250, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
		let Foreground = "Black";
		let Icons = DialogGetAssetIcons(CraftingItem);
		if (Hidden) DrawPreviewBox(80, 250, "Icons/HiddenItem.png", Description, { Background, Foreground });
		else DrawAssetPreview(80, 250, CraftingItem, { Description, Background, Foreground, Icons });
		if (CraftingLock != null) {
			Description = CraftingLock.Description;
			Background = MouseIn(425, 250, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
			Icons = DialogGetAssetIcons(CraftingLock.Asset);
			DrawAssetPreview(425, 250, CraftingLock.Asset, { Description, Background, Foreground, Icons });	
		} else DrawButton(425, 250, 225, 275, TextGet("NoLock"), "White");
		DrawButton(80, 650, 570, 190, "", "White");
		DrawText(TextGet("Property" + CraftingProperty), 365, 690, "Black", "Silver");
		DrawTextWrap(TextGet("Description" + CraftingProperty), 95, 730, 540, 100, "Black", null, 2);
		DrawText(TextGet("EnterName"), 1325, 250, "White", "Black");
		ElementPosition("InputName", 1325, 320, 1000);
		DrawText(TextGet("EnterDescription"), 1325, 500, "White", "Black");
		ElementPosition("InputDescription", 1325, 570, 1000);
		DrawText(TextGet("EnterColor"), 1325, 750, "White", "Black");
		ElementPosition("InputColor", 1325, 820, 1000);
	}

}

/**
 * Sets the new mode and creates or removes the inputs
 * @param {string} NewMode - The new mode to set
 * @returns {void} - Nothing.
 */
function CraftingModeSet(NewMode) {
	CraftingMode = NewMode;
	if (NewMode == "Item") {
		let Input = ElementCreateInput("InputSearch", "text", "", "50");
		Input.addEventListener("input", CraftingItemListBuild);
	} else ElementRemove("InputSearch");
	if (NewMode == "Name") ElementCreateInput("InputName", "text", "", "30");
	else ElementRemove("InputName");
	if (NewMode == "Name") ElementCreateInput("InputDescription", "text", "", "100");
	else ElementRemove("InputDescription");
	if (NewMode == "Name") ElementCreateInput("InputColor", "text", "", "100");
	else ElementRemove("InputColor");
}

/**
 * Prepares a compressed packet of the crafting data and sends it to the server
 * @returns {void} - Nothing.
 */
function CraftingSaveServer() {
	if (Player.Crafting == null) return;
	let P = "";
	for (let C of Player.Crafting) {
		if ((C.Item == null) || (C.Item == "")) {
			P = P + "§";
		} else {
			P = P + C.Item + "¶";
			P = P + ((C.Property == null) ? "" : C.Property) + "¶";
			P = P + ((C.Lock == null) ? "" : C.Lock) + "¶";
			P = P + ((C.Name == null) ? "" : C.Name.replace("¶", " ").replace("§", " ")) + "¶";
			P = P + ((C.Description == null) ? "" : C.Description.replace("¶", " ").replace("§", " ")) + "¶";
			P = P + ((C.Color == null) ? "" : C.Color.replace("¶", " ").replace("§", " ")) + "§";
		}
	}
	let Obj = { Crafting: LZString.compressToUTF16(P) };
	ServerAccountUpdate.QueueData(Obj, true);
}

/**
 * Loads the server packet and creates the crating array for the player
 * @param {string} Packet - The packet
 * @returns {void} - Nothing.
 */
function CraftingLoadServer(Packet) {
	CraftingLoad();
	if ((Packet == null) || (typeof Packet != "string")) return;
	let PacketString = LZString.decompressFromUTF16(Packet);
	let PacketArray = PacketString.split("§");
	for (let P = 0; P < PacketArray.length && P < 20; P++) {
		let PacketData = PacketArray[P].split("¶");
		Player.Crafting[P].Item = (PacketData.length >= 1) ? PacketData[0] : ""; 
		Player.Crafting[P].Property = (PacketData.length >= 2) ? PacketData[1] : ""; 
		Player.Crafting[P].Lock = (PacketData.length >= 3) ? PacketData[2] : ""; 
		Player.Crafting[P].Name = (PacketData.length >= 4) ? PacketData[3] : ""; 
		Player.Crafting[P].Description = (PacketData.length >= 5) ? PacketData[4] : ""; 
		Player.Crafting[P].Color = (PacketData.length >= 6) ? PacketData[5] : ""; 
	}
}

/**
 * Handles clicks in the crafting room.
 * @returns {void} - Nothing.
 */
function CraftingClick() {

	// Can always exit or cancel
	if (MouseIn(1895, 15, 90, 90)) CraftingExit();
	if (MouseIn(1790, 15, 90, 90)) CraftingModeSet("Slot");

	// In slot mode, we can select which item slot to craft
	if (CraftingMode == "Slot") {
		for (let S = 0; S < 20; S++) {
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			if (MouseIn(X, Y, 470, 140)) {
				CraftingModeSet("Item");
				CraftingSlot = S;
				CraftingOffset = 0;
				CraftingItemListBuild();
			}
		}
		return;
	}

	// In item selection mode, the player picks an item from her inventory
	if (CraftingMode == "Item") {
		if (MouseIn(1580, 15, 90, 90)) {
			CraftingOffset = CraftingOffset - 24;
			if (CraftingOffset < 0) CraftingOffset = Math.floor(CraftingItemList.length / 24) * 24;
		}
		if (MouseIn(1685, 15, 90, 90)) {
			CraftingOffset = CraftingOffset + 24;
			if (CraftingOffset >= CraftingItemList.length) CraftingOffset = 0;
		}
		for (let I = CraftingOffset; I < CraftingItemList.length && I < CraftingOffset + 24; I++) {
			let X = ((I - CraftingOffset) % 8) * 249 + 17;
			let Y = Math.floor((I - CraftingOffset) / 8) * 290 + 130;
			if (MouseIn(X, Y, 225, 275)) {
				CraftingItem = CraftingItemList[I];
				CraftingLock = null;
				CraftingModeSet("Property");
				ElementRemove("InputSearch");
			}
		}
		return;
	}

	// In property mode, the user can select a special property to apply to the item
	if (CraftingMode == "Property") {
		let Pos = 0;
		for (let Property of CraftingPropertyList) 
			if (Property.Allow(CraftingItem)) {
				let X = (Pos % 4) * 500 + 15;
				let Y = Math.floor(Pos / 4) * 230 + 130;
				if (MouseIn(X, Y, 470, 190)) {
					CraftingProperty = Property.Name;
					if (CraftingItem.AllowLock == true) CraftingModeSet("Lock");
					else CraftingModeSet("Name");
				}
				Pos++;
			}
		return;
	}

	// In lock selection mode, the user can pick a default lock or no lock at all
	if (CraftingMode == "Lock") {
		if (MouseIn(1685, 15, 90, 90)) CraftingModeSet("Name");
		let Pos = 0;
		for (let L = 0; L < CraftingLockList.length; L++)
			for (let Item of Player.Inventory)
				if ((Item.Asset != null) && (Item.Asset.Name == CraftingLockList[L]) && (Item.Asset.Group != null) && (Item.Asset.Group.Name == "ItemMisc")) {
					let X = (Pos % 8) * 249 + 17;
					let Y = Math.floor(Pos / 8) * 290 + 130;
					if (MouseIn(X, Y, 225, 275)) {
						CraftingModeSet("Name");
						CraftingLock = Item;
					}
					Pos++;
				}
		return;
	}

	// When we need to save the new item
	if ((CraftingMode == "Name") && MouseIn(1685, 15, 90, 90)) {
		let Name = ElementValue("InputName").trim();
		let Description = ElementValue("InputDescription").trim();
		let Color = ElementValue("InputColor").trim();
		if (Name == "") return;
		Player.Crafting[CraftingSlot] = {
			Item: CraftingItem.Name,
			Property: CraftingProperty,
			Lock: (CraftingLock == null) ? "" : CraftingLock.Name,
			Name: Name,
			Description: Description,
			Color: Color
		}
		CraftingSaveServer();
		CraftingModeSet("Slot");
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