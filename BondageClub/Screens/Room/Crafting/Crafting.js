"use strict";

// NOTE: Keep as `var` to enable `window`-based lookup
/** The background of the crafting screen. */
var CraftingBackground = "CraftingWorkshop";

/**
 * The active subscreen within the crafting screen:
 * * `"Slot"`: The main crafting screens wherein the {@link CraftingItem} is selected, created or destroyed.
 * * `"Item"`: The item selection screen wherein the underlying {@link Asset} is selected.
 * * `"Property"`: The {@link CraftingPropertyType} selection screen.
 * * `"Lock"`: The {@link CraftingLockList} selection screen.
 * * `"Name"`: The main menu wherein the crafted item is customized, allowing for the specification of names, descriptions, colors, extended item types, _etc._
 * * `"Color"`: A dedicated coloring screen for the crafted item.
 * @type {"Slot" | "Item" | "Property" | "Lock" | "Name" | "Color"}
 */
let CraftingMode = "Slot";

/** Whether selecting a crafted item in the crafting screen should destroy it. */
let CraftingDestroy = false;

/** The index of the selected crafted item within the crafting screen. */
let CraftingSlot = 0;

/**
 * The currently selected crafted item in the crafting screen.
 * @type {CraftingItemSelected | null}
 */
let CraftingSelectedItem = null;

/** An offset used for the pagination of {@link CraftingItemList} and all crafted items. */
let CraftingOffset = 0;

/**
 * A list of all assets valid for crafting, potentially filtered by a user-provided keyword.
 * @type {Asset[]}
 */
let CraftingItemList = [];

/** The maximum number of crafting slots. */
let CraftingSlotMax = 40;

/**
 * The character used for the crafting preview.
 * @type {Character | null}
 */
let CraftingPreview = null;

/** Whether the crafting character preview should be naked or not. */
let CraftingNakedPreview = false;

/** Whether exiting the crafting menu should return you to the chatroom or, otherwise, the main hall. */
let CraftingReturnToChatroom = false;

/**
 * Map crafting properties to their respective validation function.
 * @type {Map<CraftingPropertyType, (asset: Asset) => boolean>}
 */
const CraftingPropertyMap = new Map([
	["Normal", function(Item) { return true; }],
	["Large", function(Item) { return CraftingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); }],
	["Small", function(Item) { return CraftingItemHasEffect(Item, ["GagVeryLight", "GagEasy", "GagLight", "GagNormal", "GagMedium", "GagHeavy", "GagVeryHeavy", "GagTotal", "GagTotal2"]); }],
	["Thick", function(Item) { return CraftingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy", "BlindTotal"]); }],
	["Thin", function(Item) { return CraftingItemHasEffect(Item, ["BlindLight", "BlindNormal", "BlindHeavy", "BlindTotal"]); }],
	["Secure", function(Item) { return true; }],
	["Loose", function(Item) { return true; }],
	["Decoy", function(Item) { return true; }],
	["Malleable", function(Item) { return true; }],
	["Rigid", function(Item) { return true; }],
	["Simple", function(Item) { return Item.AllowLock; }],
	["Puzzling", function(Item) { return Item.AllowLock; }],
	["Painful", function(Item) { return true; }],
	["Comfy", function(Item) { return true; }],
	["Strong", function(Item) { return Item.IsRestraint || (Item.Difficulty > 0); }],
	["Flexible", function(Item) { return Item.IsRestraint || (Item.Difficulty > 0); }],
	["Nimble", function(Item) { return Item.IsRestraint || (Item.Difficulty > 0); }],
	["Arousing", function(Item) { return CraftingItemHasEffect(Item, ["Egged", "Vibrating"]); }],
	["Dull", function(Item) { return CraftingItemHasEffect(Item, ["Egged", "Vibrating"]); } ],
]);

/**
 * An enum with status codes for crafting validation.
 * @property OK - The validation proceded without errors
 * @property ERROR - The validation produced one or more errors that were successfully resolved
 * @property CRITICAL_ERROR - The validation produced an unrecoverable error
 * @type {{OK: 2, ERROR: 1, CRITICAL_ERROR: 0}}
 */
const CraftingStatusType = {
	OK: 2,
	ERROR: 1,
	CRITICAL_ERROR: 0,
}

/**
 * The Names of all locks that can be automatically applied to crafted items.
 * An empty string implies the absence of a lock.
 * @type {readonly (AssetLockType | "")[]}
 */
const CraftingLockList = ["", "MetalPadlock", "IntricatePadlock", "HighSecurityPadlock", "OwnerPadlock", "LoversPadlock", "MistressPadlock", "PandoraPadlock", "ExclusivePadlock"];

/**
 * Returns TRUE if a crafting item has an effect from a list or allows that effect
 * @param {Asset} Item - The item asset to validate
 * @param {EffectName[]} Effect - The list of effects to validate
 * @returns {Boolean} - TRUE if the item has that effect
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
 * Shows the crating screen and remember if the entry came from an online chat room
 * @param {boolean} FromChatRoom - TRUE if we come from an online chat room
 * @returns {void} - Nothing
 */
function CraftingShowScreen(FromChatRoom) {
	CraftingReturnToChatroom = FromChatRoom;
	CommonSetScreen("Room", "Crafting");
}

/**
 * Loads the club crafting room in slot selection mode, creates a dummy character for previews
 * @returns {void} - Nothing
 */
function CraftingLoad() {
	CraftingModeSet("Slot");
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
		InventoryWear(CraftingPreview, RelevantAsset.Name, RelevantAsset.Group.Name, null, null, CraftingPreview.MemberNumber, Craft);
		InventoryCraft(CraftingPreview, CraftingPreview, RelevantAsset.Group.Name, Craft, false, true, false);
		// Hack for the stuff in ItemAddons, since there's no way to resolve their prerequisites
		if (RelevantAsset.Prerequisite.includes("OnBed")) {
			const bedType = RelevantAsset.Name.includes("Medical") ? "MedicalBed" : "Bed";
			const bed = AssetGet(CraftingPreview.AssetFamily, "ItemDevices", bedType);
			InventoryWear(CraftingPreview, bed.Name, bed.Group.Name, null, null, CraftingPreview.MemberNumber);
		}
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
		for (const [Name, Allow] of CraftingPropertyMap)
			if (Allow(CraftingSelectedItem.Asset)) {
				let X = (Pos % 4) * 500 + 15;
				let Y = Math.floor(Pos / 4) * 175 + 130;
				DrawButton(X, Y, 470, 150, "", "White");
				DrawText(TextGet("Property" + Name), X + 235, Y + 30, "Black", "Silver");
				DrawTextWrap(TextGet("Description" + Name), X + 20, Y + 50, 440, 100, "Black", null, 2);
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
		DrawText(TextGet("EnterPriority"), 1550, 715, "White", "Black");
		ElementPosition("InputPriority", 1225, 710, 100);
		DrawText(TextGet("EnterPrivate"), 1550, 805, "White", "Black");
		DrawButton(1175, 768, 64, 64, "", "White", CraftingSelectedItem.Private ? "Icons/Checked.png" : "");
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
 * @param {CraftingMode} NewMode - The new mode to set
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
		ElementCreateInput("InputPriority", "number", "", "20");
		document.getElementById("InputPriority").addEventListener('input', CraftingKeyUp);

		ElementValue("InputName", CraftingSelectedItem.Name || "");
		ElementValue("InputDescription", CraftingSelectedItem.Description || "");
		ElementValue("InputColor", CraftingSelectedItem.Color || "Default");
		ElementValue(
			"InputPriority",
			(CraftingSelectedItem.Asset == null) ? "" :
				(CraftingSelectedItem.OverridePriority == null) ? AssetLayerSort(CraftingSelectedItem.Asset.Layer)[0].Priority.toString() : CraftingSelectedItem.OverridePriority.toString(),
		);
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
		ElementRemove("InputPriority");
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
	if (document.getElementById("InputPriority") != null) CraftingSelectedItem.OverridePriority = CraftingParsePriorityElement();
	CraftingUpdatePreview();
}

/**
 * Helper function for parsing the `InputPriority` HTML element.
 * @returns {number | null}
 */
function CraftingParsePriorityElement() {
	const DrawingPriority = Number.parseInt(ElementValue("InputPriority"));
	const InitialPriority = AssetLayerSort(CraftingSelectedItem.Asset.Layer)[0].Priority;

	// Treat the initial priority as equivalent to null if `OverridePriority` has not been set yet
	if (InitialPriority === DrawingPriority && CraftingSelectedItem.OverridePriority == null) {
		return null;
	} else if (!Number.isNaN(DrawingPriority)) {
		return DrawingPriority;
	} else {
		return null;
	}
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
			P = P + ((C.Type == null) ? "" : C.Type.replace("¶", " ").replace("§", " ")) + "¶";
			P = P + ((C.OverridePriority == null) ? "" : C.OverridePriority.toString()) + "§";
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
		DecompressedData = null;
	}
	if (DecompressedData == null) {
		console.warn("An error occured while decompressing Crafting data, entries have been reset.");
		return [];
	}

	// Builds the craft array to assign to the player
	/** @type {CraftingItem[]} */
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
		Craft.Type = (Element.length >= 8) ? Element[7] || null : null;
		Craft.OverridePriority = (Element.length >= 9 && Element[8] !== "") ? Number.parseInt(Element[8]) : null;
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
	let Refresh = false;
	const data = CraftingDecompressServerData(Packet);
	for (const item of data) {
		// Make sure that the item is a valid craft
		switch (CraftingValidate(item)) {
			case CraftingStatusType.OK:
				Player.Crafting.push(item);
				break;
			case CraftingStatusType.ERROR:
				Player.Crafting.push(item);
				Refresh = true;
				break;
			case CraftingStatusType.CRITICAL_ERROR:
				Player.Crafting.push(null);
				Refresh = true;
				break;
		}

		// Too many items, skip the rest
		if (Player.Crafting.length >= CraftingSlotMax) break;
	}
	/**
	 * One or more validation errors were encountered that were successfully resolved;
	 * push the fixed items back to the server */
	if (Refresh) {
		CraftingSaveServer();
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
				CraftingSelectedItem = {
					Name: "",
					Description: "",
					Color: "Default",
					Asset: null,
					Property: "Normal",
					Lock: null,
					Private: false,
					Type: "",
					OverridePriority: null,
				};
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
				CraftingSelectedItem.OverridePriority = null;
				// @ts-ignore
				CraftingSelectedItem.Type = CraftingValidationRecord.Type.GetDefault(CraftingSelectedItem, CraftingSelectedItem.Asset) || "";
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
		for (const [Name, Allow] of CraftingPropertyMap)
			if (Allow(CraftingSelectedItem.Asset)) {
				let X = (Pos % 4) * 500 + 15;
				let Y = Math.floor(Pos / 4) * 175 + 130;
				if (MouseIn(X, Y, 470, 150)) {
					CraftingSelectedItem.Property = Name;
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
		} else if (MouseIn(1175, 768, 64, 64)) {
			CraftingSelectedItem.Private = !CraftingSelectedItem.Private;
		} else if (MouseIn(1840, 858, 60, 60) && CraftingItemSupportsAutoType()) {
			if ((CraftingSelectedItem.Type == null) || (CraftingSelectedItem.Type == "") || (CraftingSelectedItem.Asset.AllowType.indexOf(CraftingSelectedItem.Type) < 0))
				CraftingSelectedItem.Type = CraftingSelectedItem.Asset.AllowType[0];
			else
				if (CraftingSelectedItem.Asset.AllowType.indexOf(CraftingSelectedItem.Type) >= CraftingSelectedItem.Asset.AllowType.length - 1)
					// @ts-ignore
					CraftingSelectedItem.Type = CraftingValidationRecord.Type.GetDefault(CraftingSelectedItem, CraftingSelectedItem.Asset) || "";
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
	let OverridePriority = (CraftingMode == "Name") ? CraftingParsePriorityElement() : CraftingSelectedItem.OverridePriority;
	return {
		Item: (CraftingSelectedItem.Asset == null) ? "" : CraftingSelectedItem.Asset.Name,
		Property: CraftingSelectedItem.Property,
		Lock: (CraftingSelectedItem.Lock == null) ? "" : /**@type {AssetLockType}*/(CraftingSelectedItem.Lock.Name),
		Name: Name,
		Description: Description,
		Color: Color,
		Private: CraftingSelectedItem.Private,
		Type: Type || null,
		OverridePriority: OverridePriority,
	};
}

/**
 * Convert a crafting item to its selected format.
 * @param {CraftingItem} Craft
 * @returns {CraftingItemSelected}
 */
function CraftingConvertItemToSelected(Craft) {
	return {
		Name: Craft.Name,
		Description: Craft.Description,
		Color: Craft.Color,
		Private: Craft.Private,
		Type: Craft.Type || "",
		Property: Craft.Property,
		Asset: Player.Inventory.find(a => a.Asset.Name === Craft.Item && !a.Asset.IsLock).Asset,
		Lock: Craft.Lock ? Player.Inventory.find(a => a.Asset.Group.Name === "ItemMisc" && a.Asset.Name == Craft.Lock).Asset : null,
		OverridePriority: Craft.OverridePriority,
	}
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

		// That asset must be in the player inventory or location-specific, not for clothes or spanking toys
		if (!InventoryAvailable(Player, A.Name, A.Group.Name) && A.AvailableLocations.length === 0) continue;
		if (!A.Enable || !A.Wear || !A.Group.Name.startsWith("Item") || A.IsLock) continue;

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

/**
 * A record with tools for validating {@link CraftingItem} properties.
 * @type {Record<string, CratingValidationStruct>}
 * @see {@link CratingValidationStruct}
 * @todo Let the Validate/GetDefault functions take the respective attribute rather than the entire {@link CraftingItem}
 */
 const CraftingValidationRecord = {
	Color: {
		Validate: function(c, a) {
			if (typeof c.Color !== "string") {
				return false;
			} else if ((c.Color === "") || (a == null)) {
				return true
			} else {
				const Colors = c.Color.replace(" ", "").split(",");
				return Colors.every((c) => CommonIsColor(c) || (c === "Default"));
			}
		},
		GetDefault: function(c, a) {
			if ((typeof c.Color !== "string") || (a == null)) {
				return "";
			} else {
				const Colors = c.Color.replace(" ", "").split(",");
				const ColorsNew = Colors.map((c) => CommonIsColor(c) ? c : "Default");
				return ColorsNew.join(",");
			}
		},
		StatusCode: CraftingStatusType.ERROR,
	},
	Description: {
		Validate: (c, a) => typeof c.Description === "string",
		GetDefault: (c, a) => "",
		StatusCode: CraftingStatusType.ERROR,
	},
	Item: {
		Validate: (c, a) => Player.Inventory.some((i) => i.Name === c.Item),
		GetDefault: (c, a) => null,
		StatusCode: CraftingStatusType.CRITICAL_ERROR,
	},
	Lock: {
		Validate: function (c, a) {
			if ((a != null) && (!a.AllowLock)) {
				return (c.Lock === "");
			} else if (c.Lock === "") {
				return true;
			} else {
				return CraftingLockList.includes(c.Lock) && Player.Inventory.some((i) => i.Name === c.Lock);
			}
		},
		GetDefault: (c, a) => "",
		StatusCode: CraftingStatusType.ERROR,
	},
	MemberName: {
		Validate: (c, a) => c.MemberName == null || typeof c.MemberName === "string",
		GetDefault: (c, a) => null,
		StatusCode: CraftingStatusType.ERROR,
	},
	MemberNumber: {
		Validate: (c, a) => c.MemberNumber == null || typeof c.MemberNumber === "number",
		GetDefault: (c, a) => null,
		StatusCode: CraftingStatusType.ERROR,
	},
	Name: {
		Validate: (c, a) => typeof c.Name === "string",
		GetDefault: (c, a) => "",
		StatusCode: CraftingStatusType.CRITICAL_ERROR,
	},
	OverridePriority: {
		Validate: (c, a) => (c.OverridePriority == null) || Number.isInteger(c.OverridePriority),
		GetDefault: (c, a) => null,
		StatusCode: CraftingStatusType.ERROR,
	},
	Private: {
		Validate: (c, a) => typeof c.Private === "boolean",
		GetDefault: (c, a) => false,
		StatusCode: CraftingStatusType.ERROR,
	},
	Property: {
		Validate: function (c, a) {
			if (a == null) {
				return CraftingPropertyMap.has(c.Property);
			} else {
				const Allow = CraftingPropertyMap.get(c.Property);
				return (Allow !== undefined) ? Allow(a) : false;
			}
		},
		GetDefault: (c, a) => "Normal",
		StatusCode: CraftingStatusType.ERROR,
	},
	Type: {
		Validate: function (c, a) {
			// We can't reliably validate w.r.t. `Asset.AllowTypes` here, as there are potentially multiple assets with
			// the same name but distinct types (e.g. the SturdyLeatherBelt and Ribbons)
			return (c.Type == null) || (typeof c.Type === "string");
		},
		GetDefault: function (c, a) {
			if (a == null) {
				return c.Type;
			} else if (a.Archetype === ExtendedArchetype.TYPED) {
				return null;
			} else {
				return (a.AllowType && (a.AllowType.length >= 1)) ? a.AllowType[0] : null;
			}
		},
		StatusCode: CraftingStatusType.ERROR,
	},
}

/**
 * Validate and sanitinize crafting properties of the passed item inplace.
 * @param {CraftingItem} Craft - The crafted item properties or `null`
 * @param {Asset | null} Asset - The matching Asset. Will be extracted from the player inventory if `null`
 * @param {boolean} Warn - Whether a warning should logged whenever the crafting validation fails
 * @return {CraftingStatusType} - One of the {@link CraftingStatusType} status codes; 0 denoting an unrecoverable validation error
 */
function CraftingValidate(Craft, Asset=null, Warn=true) {
	if (Craft == null) {
		return CraftingStatusType.CRITICAL_ERROR;
	}
	/** @type {Map<string, CraftingStatusType>} */
	const StatusMap = new Map();
	const Name = Craft.Name;

	// Manually search for the Asset if it has not been provided
	if (Asset == null) {
		const Item = Player.Inventory.find((a) => a.Name === Craft.Item);
		if (Item === undefined) {
			StatusMap.set("Item", CraftingStatusType.CRITICAL_ERROR);
		} else {
			Asset = Item.Asset;
		}
	}

	/**
	 * Check all legal attributes.
	 * If `Asset == null` at this point then let all Asset-requiring checks pass, as we
	 * can't properly validate them. Note that this will introduce the potential for false negatives.
	 */
	for (const [AttrName, {Validate, GetDefault, StatusCode}] of Object.entries(CraftingValidationRecord)) {
		if (!Validate(Craft, Asset)) {
			const AttrValue = (typeof Craft[AttrName] === "string") ? `"${Craft[AttrName]}"` : Craft[AttrName];
			if (Warn) {
				console.warn(`Invalid "Craft.${AttrName}" value for crafted item "${Name}": ${AttrValue}`);
			}
			Craft[AttrName] = GetDefault(Craft, Asset);
			StatusMap.set(AttrName, StatusCode);
		} else {
			StatusMap.set(AttrName, CraftingStatusType.OK);
		}
	}

	// If the Asset has been explicetly passed then `Craft.Item` errors are fully recoverable
	if ((Asset != null) && (StatusMap.get("Item") === CraftingStatusType.CRITICAL_ERROR)) {
		StatusMap.set("Item", CraftingStatusType.ERROR);
		Craft.Item = Asset.Name;
	}

	// Check for extra attributes
	const LegalAttributes = Object.keys(CraftingValidationRecord);
	for (const AttrName of Object.keys(Craft)) {
		if (!LegalAttributes.includes(AttrName)) {
			if (Warn) {
				console.warn(`Invalid extra "Craft.${AttrName}" attribute for crafted item "${Name}"`);
			}
			delete Craft[AttrName];
			StatusMap.set(AttrName, CraftingStatusType.ERROR);
		}
	}
	return /** @type {CraftingStatusType} */(Math.min(...StatusMap.values()));
}
