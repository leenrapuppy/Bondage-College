"use strict";
var CraftingBackground = "CraftingWorkshop";
var CraftingMode = "Slot";
var CraftingDestroy = false;
var CraftingSlot = 0;
/** @type {{Name?: string, Description?: string, Color?: string, Asset?: Asset, Property?: string, Lock?: Asset, }} */
var CraftingSelectedItem = null;
var CraftingOffset = 0;
var CraftingItemList = [];
var CraftingSlotMax = 20;
/** @type {Character} */
var CraftingPreview = null;
/** @type {boolean} */
var CraftingNakedPreview = false;
var CraftingColoring = false;

/**
 * @type {{Name: string, Allow: (asset: Asset) => boolean}[]}
 */
var CraftingPropertyList = [
	{ Name: "Normal", Allow : function(Item) { return true; } },
	{ Name: "Large", Allow : function(Item) { return CraftingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); } },
	{ Name: "Small", Allow : function(Item) { return CraftingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); } },
	{ Name: "Thick", Allow : function(Item) { return CraftingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy"]); } },
	{ Name: "Thin", Allow : function(Item) { return CraftingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy"]); } },
	{ Name: "Secure", Allow : function(Item) { return true; } },
	{ Name: "Loose", Allow : function(Item) { return true; } },
	{ Name: "Decoy", Allow : function(Item) { return true; } },
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
 * Loads the club crafting room in slot selection mode
 * @returns {void} - Nothing.
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
 * Update the crafting character preview
 */
function CraftingUpdatePreview() {
	CraftingPreview.Appearance = [...Player.Appearance];
	CharacterReleaseTotal(CraftingPreview);
	if (CraftingNakedPreview) {
		CharacterNaked(CraftingPreview);
	}

	if (!CraftingSelectedItem) return;

	const selectedAsset = CraftingSelectedItem.Asset;
	const foundGroups = [];
	const relevantAssets = Asset.filter((a, _i, ary) => {
		if (!a.Group.Zone) return false;
		if (a.Name !== selectedAsset.Name) return false;

		if (foundGroups.includes(a.Group.Name))
			return false;

		foundGroups.push(a.DynamicGroupName || a.Group.Name);
		return true;
	});

	const craft = CraftingConvertSelectedToItem();
	for (const relevantAsset of relevantAssets) {
		InventoryWear(
			CraftingPreview,
			relevantAsset.Name,
			relevantAsset.Group.Name,
			null,
			null,
			CraftingPreview.MemberNumber,
			craft
		);
		InventoryCraft(CraftingPreview, CraftingPreview, relevantAsset.Group.Name, craft, false);
	}
	CharacterRefresh(CraftingPreview);
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
		if (CraftingDestroy) {
			DrawText(TextGet("SelectDestroy"), 890, 60, "White", "Black");
			DrawButton(1790, 15, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
		} else {
			DrawText(TextGet("SelectSlot"), 890, 60, "White", "Black");
			DrawButton(1790, 15, 90, 90, "", "White", "Icons/Trash.png", TextGet("Destroy"));
		}
		for (let S = 0; S < CraftingSlotMax; S++) {
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			let Craft = Player.Crafting[S];
			if (!Craft) {
				DrawButton(X, Y, 470, 140, TextGet("EmptySlot"), CraftingDestroy ? "Pink" : "White");
			} else {
				DrawButton(X, Y, 470, 140, "", CraftingDestroy ? "Pink" : "White");
				DrawTextFit(Craft.Name, X + 295, Y + 25, 315, "Black", "Silver");
				for (let Item of Player.Inventory)
					if (Item.Asset.Name == Craft.Item) {
						DrawImageResize("Assets/" + Player.AssetFamily + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + ".png", X + 3, Y + 3, 135, 135);
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

		DrawCharacter(CraftingPreview, 665, 65, 0.9, false);
		DrawButton(
			560, 870, 90, 90,
			"",
			"white",
			`Icons/${CraftingNakedPreview ? "Dress" : "Naked"}.png`
		);

		DrawText(TextGet("Property" + CraftingSelectedItem.Property), 365, 690, "Black", "Silver");
		DrawTextWrap(TextGet("Description" + CraftingSelectedItem.Property), 95, 730, 540, 100, "Black", null, 2);
		DrawText(TextGet("EnterName"), 1625, 150, "White", "Black");
		ElementPosition("InputName", 1625, 200, 700);
		DrawText(TextGet("EnterDescription"), 1625, 250, "White", "Black");
		ElementPosition("InputDescription", 1625, 300, 700);
		if (CraftingColoring) {
			ItemColorDraw(
				CraftingPreview, CraftingSelectedItem.Asset.Group.Name,
				1200, 350, 800, 650, true
			);
		} else {
			DrawButton(1275, 350, 700, 50, TextGet("OpenColorpicker"), "white");
		}
	}
}

/**
 * Sets the new mode and creates or removes the inputs
 * @param {string} NewMode - The new mode to set
 * @returns {void} - Nothing.
 */
function CraftingModeSet(NewMode) {
	CraftingDestroy = false;
	CraftingMode = NewMode;
	if (NewMode == "Item") {
		let Input = ElementCreateInput("InputSearch", "text", "", "50");
		Input.addEventListener("input", CraftingItemListBuild);
	} else
		ElementRemove("InputSearch");

	if (NewMode === "Lock" && CraftingSelectedItem.Asset.AllowLock !== true) {
		CraftingSelectedItem.Lock = null;
		CraftingMode = NewMode = "Name";
	}

	if (NewMode == "Name") {
		ElementCreateInput("InputName", "text", "", "30");
		ElementCreateInput("InputDescription", "text", "", "100");

		ElementValue("InputName", CraftingSelectedItem.Name || "");
		ElementValue("InputDescription", CraftingSelectedItem.Description || "");

		CraftingUpdatePreview();
	} else {
		ElementRemove("InputName");
		ElementRemove("InputDescription");
	}
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
 * Deserialize and unpack the crafting data from the server.
 *
 * @param {string|array} serializedData The serialized crafting data
 * @returns {CraftingItem[]}
 */
function CraftingDecompressServerData(serializedData) {
	if (Array.isArray(serializedData)) {
		// Seems already deserialized, use that
		return serializedData;
	}

	let decompressedData = null;
	if (typeof serializedData !== "string" || !(decompressedData = LZString.decompressFromUTF16(serializedData))) {
		console.error("Failed to decompress Crafting data:", serializedData);
		return [];
	}

	const crafts = [];
	const data = decompressedData.split("§");
	for (let P = 0; P < data.length; P++) {
		const element = data[P].split("¶");
		const craft = {};
		craft.Item = (element.length >= 1) ? element[0] : "";
		craft.Property = (element.length >= 2) ? element[1] : "";
		craft.Lock = /** @type {AssetLockType} */((element.length >= 3) ? element[2] : "");
		craft.Name = (element.length >= 4) ? element[3] : "";
		craft.Description = (element.length >= 5) ? element[4] : "";
		craft.Color = (element.length >= 6) ? element[5] : "";

		if (craft.Item && craft.Name)
			crafts.push(craft);
	}
	return crafts;
}

/**
 * Loads the server packet and creates the crafting array for the player
 * @param {string} Packet - The packet
 * @returns {void} - Nothing.
 */
function CraftingLoadServer(Packet) {
	Player.Crafting = [];
	const data = CraftingDecompressServerData(Packet);
	for (const item of data) {
		let valid = true;

		if (!item.Name || !item.Item)
			valid = false;

		// Make sure we own that item
		if (!Player.Inventory.find(a => a.Name === item.Item))
			valid = false;

		if (valid)
			Player.Crafting.push(item);

		// Too many items, skip the rest
		if (Player.Crafting.length >= CraftingSlotMax) break;
	}
}

/**
 * Handles clicks in the crafting room.
 * @returns {void} - Nothing.
 */
function CraftingClick() {

	// Can always exit or cancel
	if (MouseIn(1895, 15, 90, 90)) CraftingExit();
	if (MouseIn(1790, 15, 90, 90) && (CraftingMode != "Slot")) return CraftingModeSet("Slot");

	// In slot mode, we can select which item slot to craft
	if (CraftingMode == "Slot") {
		if (MouseIn(1790, 15, 90, 90)) CraftingDestroy = !CraftingDestroy;
		for (let S = 0; S < CraftingSlotMax; S++) {
			let X = (S % 4) * 500 + 15;
			let Y = Math.floor(S / 4) * 180 + 130;
			const Craft = Player.Crafting[S];
			if (!MouseIn(X, Y, 470, 140)) continue;

			if (CraftingDestroy) {
				if (Craft && Craft.Name) {
					Player.Crafting.splice(S, 1);
					CraftingSaveServer();
				}
			} else if (Craft && Craft.Name) {
				CraftingSlot = S;
				CraftingSelectedItem = CraftingConvertItemToSelected(Craft);
				CraftingColoring = false;
				CraftingOffset = 0;
				CraftingModeSet("Name");
			} else {
				CraftingModeSet("Item");
				CraftingSlot = S;
				CraftingSelectedItem = {};
				CraftingOffset = 0;
				CraftingColoring = false;
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
				let Y = Math.floor(Pos / 4) * 230 + 130;
				if (MouseIn(X, Y, 470, 190)) {
					CraftingSelectedItem.Property = Property.Name;
					if (CraftingSelectedItem.Lock) {
						// Editing item with a lock, skip to name
						CraftingModeSet("Name");
					} else {
						CraftingModeSet("Lock");
					}
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

	if (CraftingMode == "Name") {
		if (MouseIn(1685, 15, 90, 90)) {
			// When we need to save the new item
			const prop = CraftingConvertSelectedToItem();
			if (prop.Name == "") return;
			Player.Crafting[CraftingSlot] = prop;
			CraftingSelectedItem = null;
			CraftingSaveServer();
			CraftingModeSet("Slot");
		} else if (MouseIn(560, 870, 90, 90)) {
			CraftingNakedPreview = !CraftingNakedPreview;
			CraftingUpdatePreview();
		} else if (MouseIn(80, 250, 225, 275)) {
			// Item change
			CraftingModeSet("Item");
			CraftingOffset = 0;
			CraftingItemListBuild();
			return null;
		} else if (MouseIn(425, 250, 225, 275) && CraftingSelectedItem.Asset.AllowLock) {
			// Lock change
			CraftingModeSet("Lock");
			return null;
		} else if (MouseIn(80, 650, 570, 190)) {
			CraftingModeSet("Property");
			return null;
		} else if (MouseIn(1200, 350, 800, 550)) {
			if (!CraftingColoring) {
				CraftingColoring = true;
				const item = InventoryGet(CraftingPreview, CraftingSelectedItem.Asset.Group.Name);
				ItemColorLoad(
					CraftingPreview,
					item,
					1200,
					350,
					800,
					650,
					true
				);
				ItemColorOnExit((c, i) => {
					CraftingColoring = false;
					const colorSpec = Array.isArray(i.Color)
						? i.Color.join(",")
						: i.Color || "";
					CraftingSelectedItem.Color = colorSpec;
					CraftingUpdatePreview();
				});
			} else {
				ItemColorClick(
					CraftingPreview,
					CraftingSelectedItem.Asset.Group.Name,
					1200,
					350,
					800,
					650,
					true
				);
			}
		}
	}
}

/**
 * Converts the currently selected item into a crafting item.
 *
 * @return {CraftingItem}
 * */
function CraftingConvertSelectedToItem() {
	let Name = ElementValue("InputName").trim();
	let Description = ElementValue("InputDescription").trim();
	return {
		Item: CraftingSelectedItem.Asset.Name,
		Property: CraftingSelectedItem.Property,
		Lock: (CraftingSelectedItem.Lock == null) ? "" : CraftingSelectedItem.Lock.Name,
		Name: Name,
		Description: Description,
		Color: CraftingSelectedItem.Color,
	};
}

/**
 * Convert a crafting item to its selected format.
 *
 * @param {CraftingItem} craft
 */
function CraftingConvertItemToSelected(craft) {
	let obj = {
		Name: craft.Name,
		Description: craft.Description,
		Color: craft.Color,
		Property: craft.Property,
		Asset: Player.Inventory.find(a => a.Asset.Name === craft.Item).Asset,
		Lock: craft.Lock ? Player.Inventory.find(a => a.Asset.Group.Name === "ItemMisc" && a.Asset.Name == craft.Lock).Asset : null,
	}
	return obj;
}

/**
 * When the player exits the crafting room
 * @returns {void} - Nothing.
 */
function CraftingExit() {
	CharacterDelete(CraftingPreview.AccountName);
	CraftingModeSet("Slot");
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
		if ((I.Asset != null) && (I.Asset.Name != null) && I.Asset.Enable && I.Asset.Wear && (I.Asset.Group != null) && (I.Asset.Group.Name.substr(0, 4) == "Item") && (I.Asset.Group.Name != "ItemAddon") && (I.Asset.Group.Name != "ItemMisc") && (I.Asset.Name.substr(0, 12) != "SpankingToys"))
			if ((Search == "") || (I.Asset.Description == null) || (I.Asset.Description.toUpperCase().trim().indexOf(Search) >= 0)) {
				let Found = false;
				for (let E of CraftingItemList)
					if ((E.Name == I.Asset.Name) || (E.Description == I.Asset.Description))
						Found = true;
				if (!Found) CraftingItemList.push(I.Asset);
			}
	CraftingItemList.sort((a,b) => (a.Description > b.Description) ? 1 : (b.Description > a.Description) ? -1 : 0);
	if (CraftingOffset >= CraftingItemList.length) CraftingOffset = 0;
}
