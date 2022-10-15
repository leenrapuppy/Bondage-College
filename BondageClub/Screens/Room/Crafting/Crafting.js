"use strict";
var CraftingBackground = "CraftingWorkshop";
var CraftingMode = "Slot";
var CraftingDestroy = false;
var CraftingSlot = 0;
/** @type {{Name?: string, Description?: string, Color?: string, Asset?: Asset, Property?: string, Lock?: Asset, Private?: boolean, Type: String }} */
var CraftingSelectedItem = null;
var CraftingOffset = 0;
/** @type {Asset[]} */
var CraftingItemList = [];
var CraftingSlotMax = 40;
/** @type {Character} */
var CraftingPreview = null;
/** @type {boolean} */
var CraftingNakedPreview = false;
var CraftingReturnToChatroom = false;

/**
 * @type {{Name: string, Allow: (asset: Asset) => boolean}[]}
 */
var CraftingPropertyList = [
	{ Name: "Normal", Allow : function(Item) { return true; } },
	{ Name: "Large", Allow : function(Item) { return CraftingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); } },
	{ Name: "Small", Allow : function(Item) { return CraftingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); } },
	{ Name: "Thick", Allow : function(Item) { return CraftingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy", "BlindTotal"]); } },
	{ Name: "Thin", Allow : function(Item) { return CraftingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy", "BlindTotal"]); } },
	{ Name: "Secure", Allow : function(Item) { return true; } },
	{ Name: "Loose", Allow : function(Item) { return true; } },
	{ Name: "Decoy", Allow : function(Item) { return true; } },
	{ Name: "Malleable", Allow : function(Item) { return true; } },
	{ Name: "Rigid", Allow : function(Item) { return true; } },
	{ Name: "Simple", Allow : function(Item) { return Item.AllowLock; } },
	{ Name: "Puzzling", Allow : function(Item) { return Item.AllowLock; } },
	{ Name: "Painful", Allow : function(Item) { return true; } },
	{ Name: "Comfy", Allow : function(Item) { return true; } },
	{ Name: "Strong", Allow : function(Item) { return Item.IsRestraint || (Item.Difficulty > 0); } },
	{ Name: "Flexible", Allow : function(Item) { return Item.IsRestraint || (Item.Difficulty > 0); } },
	{ Name: "Nimble", Allow : function(Item) { return Item.IsRestraint || (Item.Difficulty > 0); } },
	{ Name: "Arousing", Allow : function(Item) { return CraftingItemHasEffect(Item, ["Egged", "Vibrating"]); } },
	{ Name: "Dull", Allow : function(Item) { return CraftingItemHasEffect(Item, ["Egged", "Vibrating"]); } }
];
var CraftingLockList = ["", "MetalPadlock", "IntricatePadlock", "HighSecurityPadlock", "OwnerPadlock", "LoversPadlock", "MistressPadlock", "PandoraPadlock", "ExclusivePadlock"];

/**
 * Returns TRUE if a crafting item has an effect from a list or allows that effect
 * @param {Asset} Item - The item asset to validate
 * @param {EffectName[]} Effect - The list of effects to validate
 * @returns {Boolean}
 */
function CraftingItemHasEffect(Item, Effect) {
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
 *
 * @param {boolean} [fromRoom]
 */
function CraftingShowScreen(fromRoom) {
	CraftingReturnToChatroom = fromRoom;
	CommonSetScreen("Room", "Crafting");
}

/**
 * Loads the club crafting room in slot selection mode
 * @returns {void} - Nothing
 */
function CraftingLoad() {
	CraftingModeSet("Slot");
	// Create a dummy character for previews
	CraftingPreview = CharacterLoadSimple(`CraftingPreview-${Player.MemberNumber}`);
	CraftingPreview.Appearance = [...Player.Appearance];
	CraftingPreview.Crafting = JSON.parse(JSON.stringify(Player.Crafting));
	CharacterReleaseTotal(CraftingPreview);
}

/**
 * Update the crafting character preview image, applies the item on all possible body parts
 * @returns {void} - Nothing
 */
function CraftingUpdatePreview() {
	CraftingPreview.Appearance = Player.Appearance.slice();
	CharacterReleaseTotal(CraftingPreview);
	if (CraftingNakedPreview) CharacterNaked(CraftingPreview);
	if (!CraftingSelectedItem) return;
	const Craft = CraftingConvertSelectedToItem();
	const FoundGroups = [];
	const RelevantAssets = Asset.filter(a => {
		if (!a.Group.Zone) return false;
		if (!CraftingAppliesToItem(Craft, a)) return false;
		if (FoundGroups.includes(a.DynamicGroupName || a.Group.Name)) return false;
		FoundGroups.push(a.Group.Name);
		return true;
	});
	for (const RelevantAsset of RelevantAssets) {
		if ((RelevantAsset.Group == null) || (RelevantAsset.Group.Name == null) || (RelevantAsset.Group.Name == "ItemAddon")) continue;
		InventoryWear(CraftingPreview, RelevantAsset.Name, RelevantAsset.Group.Name, null, null, CraftingPreview.MemberNumber, Craft);
		InventoryCraft(CraftingPreview, CraftingPreview, RelevantAsset.Group.Name, Craft, false);
	}
	CharacterRefresh(CraftingPreview);
}

/**
 * Check whether the item can safely be used with the crafting auto-type system.
 * @returns {Boolean}
 */
 function CraftingItemSupportsAutoType() {
	const ItemAsset = CraftingSelectedItem.Asset;
	if (ItemAsset == null) {
		return false;
	} else {
		return (ItemAsset.AllowType != null) && (ItemAsset.AllowType.length > 0);
	}
}

/**
 * Run the club crafting room if all possible modes
 * @returns {void} - Nothing
 */
function CraftingRun() {

	// The exit button is everywhere
	if (CraftingMode != "Color") DrawButton(1895, 15, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if ((CraftingMode != "Color") && (CraftingMode != "Slot")) DrawButton(1790, 15, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));

	// In slot selection mode, we show the slots to select from
	if (CraftingMode == "Slot") {
		DrawButton(1685, 15, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
		if (CraftingDestroy) {
			DrawText(TextGet("SelectDestroy"), 840, 60, "White", "Black");
			DrawButton(1790, 15, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
		} else {
			DrawText(TextGet("SelectSlot"), 840, 60, "White", "Black");
			DrawButton(1790, 15, 90, 90, "", "White", "Icons/Trash.png", TextGet("Destroy"));
		}
		for (let S = CraftingOffset; S < CraftingOffset + 20; S++) {
			let X = ((S - CraftingOffset) % 4) * 500 + 15;
			let Y = Math.floor((S - CraftingOffset) / 4) * 180 + 130;
			let Craft = Player.Crafting[S];
			if (!Craft) {
				DrawButton(X, Y, 470, 140, TextGet("EmptySlot"), CraftingDestroy ? "Pink" : "White");
			} else {
				DrawButton(X, Y, 470, 140, "", CraftingDestroy ? "Pink" : "White");
				DrawTextFit(Craft.Name, X + 295, Y + 25, 315, "Black", "Silver");
				for (let Item of Player.Inventory)
					if (Item.Asset.Name == Craft.Item) {
						DrawImageResize("Assets/" + Player.AssetFamily + "/" + Item.Asset.DynamicGroupName + "/Preview/" + Item.Asset.Name + ".png", X + 3, Y + 3, 135, 135);
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
		DrawText(TextGet("SelectProperty").replace("AssetDescription", CraftingSelectedItem.Asset.Description), 880, 60, "White", "Black");
		let Pos = 0;
		for (let Property of CraftingPropertyList)
			if (Property.Allow(CraftingSelectedItem.Asset)) {
				let X = (Pos % 4) * 500 + 15;
				let Y = Math.floor(Pos / 4) * 175 + 130;
				DrawButton(X, Y, 470, 150, "", "White");
				DrawText(TextGet("Property" + Property.Name), X + 235, Y + 30, "Black", "Silver");
				DrawTextWrap(TextGet("Description" + Property.Name), X + 20, Y + 50, 440, 100, "Black", null, 2);
				Pos++;
			}
	}

	// In lock selection mode, the player can auto-apply a lock to it's item
	if (CraftingMode == "Lock") {
		DrawButton(1685, 15, 90, 90, "", "White", "Icons/Unlock.png", TextGet("NoLock"));
		DrawText(TextGet("SelectLock").replace("AssetDescription", CraftingSelectedItem.Asset.Description).replace("PropertyName", TextGet("Property" + CraftingSelectedItem.Property)), 830, 60, "White", "Black");
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
		DrawText(TextGet("SelectName").replace("AssetDescription", CraftingSelectedItem.Asset.Description).replace("PropertyName", TextGet("Property" + CraftingSelectedItem.Property)), 830, 60, "White", "Black");
		let Hidden = CharacterAppearanceItemIsHidden(CraftingSelectedItem.Asset.Name, CraftingSelectedItem.Asset.Group.Name);
		let Description = CraftingSelectedItem.Asset.Description;
		let Background = MouseIn(80, 250, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
		let Foreground = "Black";
		let Icons = DialogGetAssetIcons(CraftingSelectedItem.Asset);
		if (Hidden) DrawPreviewBox(80, 250, "Icons/HiddenItem.png", Description, { Background, Foreground });
		else DrawAssetPreview(80, 250, CraftingSelectedItem.Asset, { Description, Background, Foreground, Icons });
		if (CraftingSelectedItem.Lock != null) {
			Description = CraftingSelectedItem.Lock.Description;
			Background = MouseIn(425, 250, 225, 275) && !CommonIsMobile ? "cyan" : "#fff";
			Icons = DialogGetAssetIcons(CraftingSelectedItem.Lock);
			DrawAssetPreview(425, 250, CraftingSelectedItem.Lock, { Description, Background, Foreground, Icons });
		} else DrawButton(425, 250, 225, 275, TextGet("NoLock"), "White");
		DrawButton(80, 650, 570, 190, "", "White");
		DrawCharacter(CraftingPreview, 700, 100, 0.9, false);
		DrawButton(880, 900, 90, 90, "", "white", `Icons/${CraftingNakedPreview ? "Dress" : "Naked"}.png`);
		DrawText(TextGet("Property" + CraftingSelectedItem.Property), 365, 690, "Black", "Silver");
		DrawTextWrap(TextGet("Description" + CraftingSelectedItem.Property), 95, 730, 540, 100, "Black", null, 2);
		DrawText(TextGet("EnterName"), 1550, 200, "White", "Black");
		ElementPosition("InputName", 1550, 275, 750);
		DrawText(TextGet("EnterDescription"), 1550, 375, "White", "Black");
		ElementPosition("InputDescription", 1550, 450, 750);
		DrawText(TextGet("EnterColor"), 1550, 550, "White", "Black");
		ElementPosition("InputColor", 1510, 625, 670);
		DrawButton(1843, 598, 64, 64, "", "White", "Icons/Color.png");
		DrawText(TextGet("EnterPrivate"), 1550, 760, "White", "Black");
		DrawButton(1175, 728, 64, 64, "", "White", CraftingSelectedItem.Private ? "Icons/Checked.png" : "");
		if (CraftingItemSupportsAutoType()) {
			DrawText(TextGet("EnterType"), 1335, 890, "White", "Black");
			ElementPosition("InputType", 1685, 883, 310);
			DrawButton(1840, 858, 60, 60, "", "White", "Icons/Small/Next.png");
		}
	}

	// In color mode, the player can change the color of each parts of the item
	if (CraftingMode == "Color") {
		DrawText(TextGet("SelectColor"), 600, 60, "White", "Black");
		DrawCharacter(CraftingPreview, -100, 100, 2, false);
		DrawCharacter(CraftingPreview, 700, 100, 0.9, false);
		DrawButton(880, 900, 90, 90, "", "white", `Icons/${CraftingNakedPreview ? "Dress" : "Naked"}.png`);
		ItemColorDraw(CraftingPreview, CraftingSelectedItem.Asset.DynamicGroupName, 1200, 25, 775, 950, true);
	}

}

/**
 * Sets the new mode and creates or removes the inputs
 * @param {string} NewMode - The new mode to set
 * @returns {void} - Nothing
 */
function CraftingModeSet(NewMode) {
	CraftingDestroy = false;
	CraftingMode = NewMode;
	CraftingOffset = 0;
	if (NewMode == "Item") {
		let Input = ElementCreateInput("InputSearch", "text", "", "50");
		Input.addEventListener("input", CraftingItemListBuild);
	} else ElementRemove("InputSearch");
	if (NewMode === "Lock" && CraftingSelectedItem.Asset.AllowLock !== true) {
		CraftingSelectedItem.Lock = null;
		CraftingMode = NewMode = "Name";
	}
	if (NewMode == "Name") {
		ElementCreateInput("InputName", "text", "", "30");
		document.getElementById("InputName").addEventListener('keyup', CraftingKeyUp);
		ElementCreateInput("InputDescription", "text", "", "100");
		document.getElementById("InputDescription").addEventListener('keyup', CraftingKeyUp);
		ElementCreateInput("InputColor", "text", "", "500");
		document.getElementById("InputColor").addEventListener('keyup', CraftingKeyUp);
		ElementValue("InputName", CraftingSelectedItem.Name || "");
		ElementValue("InputDescription", CraftingSelectedItem.Description || "");
		ElementValue("InputColor", CraftingSelectedItem.Color || "");
		if (CraftingItemSupportsAutoType()) {
			ElementCreateInput("InputType", "text", "", "20");
			document.getElementById("InputType").addEventListener('keyup', CraftingKeyUp);
			ElementValue("InputType", CraftingSelectedItem.Type || "");
		}
		CraftingUpdatePreview();
	} else {
		ElementRemove("InputName");
		ElementRemove("InputDescription");
		ElementRemove("InputColor");
		ElementRemove("InputType");
	}
}

/**
 * When the color or type field is updated manually, we update the preview image
 * @returns {void} - Nothing
 */
function CraftingKeyUp() {
	//if (CraftingMode == "Color") CraftingSelectedItem.Color = ElementValue("InputColor");
	if (document.getElementById("InputName") != null) CraftingSelectedItem.Name = ElementValue("InputName");
	if (document.getElementById("InputDescription") != null) CraftingSelectedItem.Description = ElementValue("InputDescription");
	if (document.getElementById("InputColor") != null) CraftingSelectedItem.Color = ElementValue("InputColor");
	if (document.getElementById("InputType") != null) CraftingSelectedItem.Type = ElementValue("InputType");
	CraftingUpdatePreview();
}

/**
 * Prepares a compressed packet of the crafting data and sends it to the server
 * @returns {void} - Nothing
 */
function CraftingSaveServer() {
	if (Player.Crafting == null) return;
	let P = "";
	for (let C of Player.Crafting)
		if ((C != null) && (C.Item != null) && (C.Item != "")) {
			P = P + C.Item + "¶";
			P = P + ((C.Property == null) ? "" : C.Property) + "¶";
			P = P + ((C.Lock == null) ? "" : C.Lock) + "¶";
			P = P + ((C.Name == null) ? "" : C.Name.replace("¶", " ").replace("§", " ")) + "¶";
			P = P + ((C.Description == null) ? "" : C.Description.replace("¶", " ").replace("§", " ")) + "¶";
			P = P + ((C.Color == null) ? "" : C.Color.replace("¶", " ").replace("§", " ")) + "¶";
			P = P + (((C.Private != null) && C.Private) ? "T" : "") + "¶";
			P = P + ((C.Type == null) ? "" : C.Type.replace("¶", " ").replace("§", " ")) + "§";
		} else P = P + "§";
	while ((P.length >= 1) && (P.substring(P.length - 1) == "§"))
		P = P.substring(0, P.length - 1);
	let Obj = { Crafting: LZString.compressToUTF16(P) };
	ServerAccountUpdate.QueueData(Obj, true);
}

/**
 * Deserialize and unpack the crafting data from the server.
 * @param {string|array} Data The serialized crafting data
 * @returns {CraftingItem[]}
 */
function CraftingDecompressServerData(Data) {

	// Arrays are returned right away, only strings can be parsed
	if (Array.isArray(Data)) return Data;
	if (typeof Data !== "string") return [];

	// Decompress the data
	let DecompressedData = null;
	try {
		DecompressedData = LZString.decompressFromUTF16(Data);
	} catch(err) {
		console.warn("An error occured while decompressing Crafting data, entries have been reset.");
		return [];
	}

	// Builds the craft array to assign to the player
	const Crafts = [];
	Data = DecompressedData.split("§");
	for (let P = 0; P < Data.length; P++) {
		const Element = Data[P].split("¶");
		const Craft = {};
		Craft.Item = (Element.length >= 1) ? Element[0] : "";
		Craft.Property = (Element.length >= 2) ? Element[1] : "";
		Craft.Lock = /** @type {AssetLockType} */((Element.length >= 3) ? Element[2] : "");
		Craft.Name = (Element.length >= 4) ? Element[3] : "";
		Craft.Description = (Element.length >= 5) ? Element[4] : "";
		Craft.Color = (Element.length >= 6) ? Element[5] : "";
		Craft.Private = ((Element.length >= 7) && (Element[6] == "T"));
		Craft.Type = (Element.length >= 8) ? Element[7] : "";
		if (Craft.Item && Craft.Name && (Craft.Item != "") && (Craft.Name != "")) Crafts.push(Craft);
		else Crafts.push(null);
	}
	return Crafts;

}

/**
 * Loads the server packet and creates the crafting array for the player
 * @param {string} Packet - The packet
 * @returns {void} - Nothing
 */
function CraftingLoadServer(Packet) {
	Player.Crafting = [];
	const data = CraftingDecompressServerData(Packet);
	for (const item of data) {

		// Make sure we own that item and it's a valid craft
		let valid = true;
		if ((item == null) || !item.Name || !item.Item) valid = false;
		if ((item == null) || !Player.Inventory.find(a => a.Name === item.Item)) valid = false;
		if (valid) Player.Crafting.push(item);
		else Player.Crafting.push(null);

		// Too many items, skip the rest
		if (Player.Crafting.length >= CraftingSlotMax) break;

	}
}

/**
 * Handles clicks in the crafting room.
 * @returns {void} - Nothing
 */
function CraftingClick() {

	// Can always exit or cancel
	if (MouseIn(1895, 15, 90, 90) && (CraftingMode != "Color")) CraftingExit();
	if (MouseIn(1790, 15, 90, 90) && (CraftingMode != "Color") && (CraftingMode != "Slot")) return CraftingModeSet("Slot");

	// In slot mode, we can select which item slot to craft
	if (CraftingMode == "Slot") {

		// Two pages of slots
		if (MouseIn(1685, 15, 90, 90)) {
			CraftingOffset = CraftingOffset + 20;
			if (CraftingOffset >= CraftingSlotMax) CraftingOffset = 0;
		}

		// Enter/Exit the destroy item mode
		if (MouseIn(1790, 15, 90, 90)) CraftingDestroy = !CraftingDestroy;

		// Scan 20 items for clicks
		for (let S = 0; S < 20; S++) {

			// If the box was clicked
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			const Craft = Player.Crafting[S + CraftingOffset];
			if (!MouseIn(X, Y, 470, 140)) continue;

			// Destroy, edit or create a new crafting item
			if (CraftingDestroy) {
				if (Craft && Craft.Name) {
					if (S + CraftingOffset < Player.Crafting.length) Player.Crafting[S + CraftingOffset] = null;
					CraftingSaveServer();
				}
			} else if (Craft && Craft.Name) {
				CraftingSlot = S + CraftingOffset;
				CraftingSelectedItem = CraftingConvertItemToSelected(Craft);
				CraftingModeSet("Name");
			} else {
				CraftingSlot = S + CraftingOffset;
				CraftingSelectedItem = {};
				CraftingModeSet("Item");
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
				CraftingSelectedItem.Asset = CraftingItemList[I];
				CraftingSelectedItem.Lock = null;
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
			if (Property.Allow(CraftingSelectedItem.Asset)) {
				let X = (Pos % 4) * 500 + 15;
				let Y = Math.floor(Pos / 4) * 175 + 130;
				if (MouseIn(X, Y, 470, 150)) {
					CraftingSelectedItem.Property = Property.Name;
					if (CraftingSelectedItem.Lock) CraftingModeSet("Name");
					else CraftingModeSet("Lock");
					return;
				}
				Pos++;
			}
		return;
	}

	// In lock selection mode, the user can pick a default lock or no lock at all
	if (CraftingMode == "Lock") {
		if (MouseIn(1685, 15, 90, 90)) {
			CraftingSelectedItem.Lock = null;
			CraftingModeSet("Name");
		}
		let Pos = 0;
		for (let L = 0; L < CraftingLockList.length; L++)
			for (let Item of Player.Inventory)
				if ((Item.Asset != null) && (Item.Asset.Name == CraftingLockList[L]) && (Item.Asset.Group != null) && (Item.Asset.Group.Name == "ItemMisc")) {
					let X = (Pos % 8) * 249 + 17;
					let Y = Math.floor(Pos / 8) * 290 + 130;
					if (MouseIn(X, Y, 225, 275)) {
						CraftingModeSet("Name");
						CraftingSelectedItem.Lock = Item.Asset;
					}
					Pos++;
				}
		return;
	}

	// In naming mode, we can also modify the color or go back to previous screens
	if (CraftingMode == "Name") {
		if (MouseIn(1685, 15, 90, 90)) {
			const prop = CraftingConvertSelectedToItem();
			if (prop.Name == "") return;
			Player.Crafting[CraftingSlot] = prop;
			CraftingSelectedItem = null;
			CraftingSaveServer();
			CraftingModeSet("Slot");
		} else if (MouseIn(880, 900, 90, 90)) {
			CraftingNakedPreview = !CraftingNakedPreview;
			CraftingUpdatePreview();
		} else if (MouseIn(80, 250, 225, 275)) {
			CraftingModeSet("Item");
			CraftingItemListBuild();
			return null;
		} else if (MouseIn(425, 250, 225, 275) && CraftingSelectedItem.Asset.AllowLock) {
			CraftingModeSet("Lock");
			return null;
		} else if (MouseIn(80, 650, 570, 190)) {
			CraftingModeSet("Property");
			return null;
		} else if (MouseIn(1843, 598, 64, 64)) {
			CraftingModeSet("Color");
			const Item = InventoryGet(CraftingPreview, CraftingSelectedItem.Asset.DynamicGroupName);
			ItemColorLoad(CraftingPreview, Item, 1200, 25, 775, 950, true);
			ItemColorOnExit((c, i) => {
				CraftingModeSet("Name");
				CraftingSelectedItem.Color = Array.isArray(i.Color) ? i.Color.join(",") : i.Color || "";
				ElementValue("InputColor", CraftingSelectedItem.Color);
				CraftingUpdatePreview();
			});
		} else if (MouseIn(1175, 728, 64, 64)) {
			CraftingSelectedItem.Private = !CraftingSelectedItem.Private;
		} else if (MouseIn(1840, 858, 60, 60) && CraftingItemSupportsAutoType()) {
			if ((CraftingSelectedItem.Type == null) || (CraftingSelectedItem.Type == "") || (CraftingSelectedItem.Asset.AllowType.indexOf(CraftingSelectedItem.Type) < 0))
				CraftingSelectedItem.Type = CraftingSelectedItem.Asset.AllowType[0];
			else
				if (CraftingSelectedItem.Asset.AllowType.indexOf(CraftingSelectedItem.Type) >= CraftingSelectedItem.Asset.AllowType.length - 1)
					CraftingSelectedItem.Type = "";
				else
					CraftingSelectedItem.Type = CraftingSelectedItem.Asset.AllowType[CraftingSelectedItem.Asset.AllowType.indexOf(CraftingSelectedItem.Type) + 1];
			ElementValue("InputType", CraftingSelectedItem.Type);
			CraftingUpdatePreview();
		}
		return;
	}

	// In color selection mode, we allow picking a color
	if (CraftingMode == "Color") {
		if (MouseIn(880, 900, 90, 90)) {
			CraftingNakedPreview = !CraftingNakedPreview;
			CraftingUpdatePreview();
		} else if (MouseIn(1200, 25, 775, 950)) {
			ItemColorClick(CraftingPreview, CraftingSelectedItem.Asset.DynamicGroupName, 1200, 25, 775, 950, true);
			setTimeout(CraftingRefreshPreview, 100);
		}
		return;
	}

}

/**
 * Refreshes the preview model with a slight delay so the item color process is done
 * @returns {void} - Nothing
 * */
function CraftingRefreshPreview() {
	let Item = InventoryGet(CraftingPreview, CraftingSelectedItem.Asset.DynamicGroupName);
	if ((Item != null) && (Item.Color != null)) {
		CraftingSelectedItem.Color = Array.isArray(Item.Color) ? Item.Color.join(",") : Item.Color || "";
		CraftingUpdatePreview();
	}
}

/**
 * Converts the currently selected item into a crafting item.
 * @return {CraftingItem}
 * */
function CraftingConvertSelectedToItem() {
	let Name = (CraftingMode == "Name") ? ElementValue("InputName").trim() : CraftingSelectedItem.Name;
	let Description = (CraftingMode == "Name") ? ElementValue("InputDescription").trim() : CraftingSelectedItem.Description;
	let Color = (CraftingMode == "Name") ? ElementValue("InputColor").trim() : CraftingSelectedItem.Color;
	let Type = ((CraftingMode == "Name") && (document.getElementById("InputType") != null)) ? ElementValue("InputType").trim() : CraftingSelectedItem.Type;
	return {
		Item: (CraftingSelectedItem.Asset == null) ? "" : CraftingSelectedItem.Asset.Name,
		Property: CraftingSelectedItem.Property,
		Lock: (CraftingSelectedItem.Lock == null) ? "" : CraftingSelectedItem.Lock.Name,
		Name: Name,
		Description: Description,
		Color: Color,
		Private: CraftingSelectedItem.Private,
		Type: Type
	};
}

/**
 * Convert a crafting item to its selected format.
 * @param {CraftingItem} Craft
 */
function CraftingConvertItemToSelected(Craft) {
	let Obj = {
		Name: Craft.Name,
		Description: Craft.Description,
		Color: Craft.Color,
		Private: Craft.Private,
		Type: Craft.Type,
		Property: Craft.Property,
		Asset: Player.Inventory.find(a => a.Asset.Name === Craft.Item).Asset,
		Lock: Craft.Lock ? Player.Inventory.find(a => a.Asset.Group.Name === "ItemMisc" && a.Asset.Name == Craft.Lock).Asset : null,
	}
	return Obj;
}

/**
 * When the player exits the crafting room
 * @returns {void} - Nothing
 */
function CraftingExit() {
	CharacterDelete(CraftingPreview.AccountName);
	CraftingModeSet("Slot");
	if (CraftingReturnToChatroom)
		CommonSetScreen("Online", "ChatRoom");
	else
		CommonSetScreen("Room", "MainHall");
}

/**
 * Applies the craft to all matching items
 * @param {CraftingItem} Craft
 * @param {Asset} Item
 */
function CraftingAppliesToItem(Craft, Item) {

	// Validates the craft asset
	if (!Craft || !Item) return false;
	const craftAsset = Asset.find(a => a.Name === Craft.Item && a.Group.Zone);
	if (!craftAsset) return false;

	// Find all assets that match our name/group combination, or have the same description
	const matchingAssets = Asset.filter(a => a.Name === craftAsset.Name || a.CraftGroup === craftAsset.Name);

	// Now check any of those matches are the item to test
	return matchingAssets.find(m => m.Name === Item.Name && m.Group.Name === Item.Group.Name);

}

/**
 * Builds the item list from the player inventory, filters by the search box content
 * @returns {void} - Nothing
 */
function CraftingItemListBuild() {

	// Prepares the search string to compare
	let Search = ElementValue("InputSearch");
	if (Search == null) Search = "";
	Search = Search.toUpperCase().trim();
	CraftingItemList = [];

	// For all assets
	for (let A of Asset) {

		// That asset must be in the player inventory, not for clothes or spanking toys
		if (!InventoryAvailable(Player, A.Name, A.Group.Name)) continue;
		if (!A.Enable || !A.Wear || !A.Group.Name.startsWith("Item")) continue;
		if (A.Group.Name === "ItemMisc" || A.Name.startsWith("SpankingToys")) continue;

		// Match against the search term. The empty string matches every string
		let Match = true;
		const desc = A.DynamicDescription(Player).toUpperCase().trim();
		if (desc.indexOf(Search) < 0) Match = false;

		// Make sure we don't add assets that are kinda-sorta the same asset (ropes, webs)
		if (Match)
			for (let E of CraftingItemList)
				if (E.CraftGroup === A.Name || E.Name === A.CraftGroup)
					Match = false;

		// If there's a match, we add it to the list
		if (Match) CraftingItemList.push(A);

	}

	// Sorts and make sure the offset is still valid
	CraftingItemList.sort((a,b) => (a.Description > b.Description) ? 1 : (b.Description > a.Description) ? -1 : 0);
	if (CraftingOffset >= CraftingItemList.length) CraftingOffset = 0;

}
