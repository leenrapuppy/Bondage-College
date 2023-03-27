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
	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TYPED);
	if (Data == null) {
		return;
	}
	const XYCoords = [ExtendedXY[6][0], ExtendedXY[6][2]];
	ExtendedItemDraw(Data.options, Data.dialogPrefix.option, Data.options.length, Data.drawImages, XYCoords);

	const C = CharacterGetCurrent();
	const CanEquip = InventoryGet(C, "ItemVulva") == null;
	ExtendedItemCustomDraw(`${Data.dialogPrefix.option}Wand`, ...ExtendedXY[6][4], true, !CanEquip);
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
	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TYPED);
	if (Data == null) {
		return;
	}
	const XYCoords = [ExtendedXY[6][0], ExtendedXY[6][2]];
	ExtendedItemClick(Data.options, Data.options.length, Data.drawImages, XYCoords);

	if (MouseIn(...ExtendedXY[6][4], 225, 275)) {
		const C = CharacterGetCurrent();
		const VulvaItem = InventoryGet(C, "ItemVulva");
		const Worn = (C.ID === 0 && VulvaItem != null && VulvaItem.Asset.Name === "FullLatexSuitWand");
		ExtendedItemCustomClick("Wand", () => InventoryItemArmsFullLatexSuitSetWand(C), Worn);
	}
}

/** @type {(C: Character) => void} */
function InventoryItemArmsFullLatexSuitSetWand(C) {
	InventoryWear(C, "FullLatexSuitWand", "ItemVulva");
	ChatRoomCharacterItemUpdate(C, "ItemVulva");
	CharacterRefresh(C);

	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TYPED);
	const Prefix = (Data == null) ? "" : ExtendedItemCustomChatPrefix("Wand", Data);
	const Dictionary = [
		{Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber},
		{Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber},
	];

	ExtendedItemCustomExit(`${Prefix}Wand`, C, Dictionary);
}
