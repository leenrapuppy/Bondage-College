"use strict";

/**
 * Draw the item extension screen.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemArmsFullLatexSuitDraw(OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}

	// Manually call `ExtendedItemDraw` (rather than `OriginalFunction`) for tighter control over the button positions
	const Prefix = DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name;
	const Data = TypedItemDataLookup[Prefix];
	if (Data === undefined) {
		return;
	}
	const XYCoords = [ExtendedXY[6][0], ExtendedXY[6][2]];
	ExtendedItemDraw(Data.options, Data.dialog.typePrefix, Data.options.length, Data.drawImages, XYCoords);

	const C = CharacterGetCurrent();
	const VibeAsset = AssetGet(C.AssetFamily, "ItemVulva", "FullLatexSuitWand");
	const [X, Y] = ExtendedXY[6][4];
	const CanEquip = InventoryGet(C, "ItemVulva") == null;

	// Provide 2 pseudo-extended item options with `Type: null`
	ExtendedItemDrawButton(
		{Name: "Wand", Property: {Type: null}},
		{Name: "Wand", Property: {Type: null}},
		Prefix, X, Y, true,
		{Asset: VibeAsset},
		!CanEquip,
	);
}

/**
 * Catches the item extension clicks.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemArmsFullLatexSuitClick(OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}

	// Manually call `ExtendedItemDraw` (rather than `OriginalFunction`) for tighter control over the button positions
	const Data = TypedItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
	if (Data === undefined) {
		return;
	}
	const XYCoords = [ExtendedXY[6][0], ExtendedXY[6][2]];
	ExtendedItemClick(Data.options, Data.options.length, Data.drawImages, XYCoords);

	if (MouseIn(...ExtendedXY[6][4], 225, 275)) {
		const C = CharacterGetCurrent();
		const VibeItem = InventoryItemCreate(C, "ItemVulva", "FullLatexSuitWand");
		const VulvaItem = InventoryGet(C, "ItemVulva");
		if (ExtendedItemPermissionMode) {
			const Worn = (C.ID === 0 && VulvaItem != null && VulvaItem.Asset.Name === VibeItem.Asset.Name);
			InventoryTogglePermission(VibeItem, null, Worn);
		} else if (VulvaItem == null) {
			if (InventoryBlockedOrLimited(C, VibeItem)) {
				DialogExtendedMessage = DialogFindPlayer("ExtendedItemNoItemPermission");
			} else {
				InventoryItemArmsFullLatexSuitSetWand(C);
				ExtendedItemExit();
			}
		}
	}
}

/** @type {(C: Character) => void} */
function InventoryItemArmsFullLatexSuitSetWand(C) {
	InventoryWear(C, "FullLatexSuitWand", "ItemVulva");
	ChatRoomCharacterItemUpdate(C, "ItemVulva");
	CharacterRefresh(C);

	const Prefix = DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name;
	const Dictionary = [
		{Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber},
		{Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber},
	]
	ChatRoomPublishCustomAction(`${Prefix}SetWand`, true, Dictionary);
}
