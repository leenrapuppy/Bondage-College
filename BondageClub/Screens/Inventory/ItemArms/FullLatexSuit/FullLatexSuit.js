"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemArmsFullLatexSuitDrawHook(Data, OriginalFunction) {
	OriginalFunction();
	const C = CharacterGetCurrent();
	const CanEquip = InventoryGet(C, "ItemVulva") == null;
	ExtendedItemCustomDraw(`${Data.dialogPrefix.option}Wand`, ...ExtendedXY[6][4], true, !CanEquip);
}

/** @type {ExtendedItemScriptHookCallbacks.Click<TypedItemData>} */
function InventoryItemArmsFullLatexSuitClickHook(Data, OriginalFunction) {
	OriginalFunction();
	if (MouseIn(...ExtendedXY[6][4], 225, 275)) {
		const C = CharacterGetCurrent();
		const VulvaItem = InventoryGet(C, "ItemVulva");
		const Worn = (C.ID === 0 && VulvaItem != null && VulvaItem.Asset.Name === "FullLatexSuitWand");
		ExtendedItemCustomClick("Wand", () => InventoryItemArmsFullLatexSuitSetWand(Data, C), Worn);
	}
}

/** @type {(Data: TypedItemData, C: Character) => void} */
function InventoryItemArmsFullLatexSuitSetWand(Data, C) {
	InventoryWear(C, "FullLatexSuitWand", "ItemVulva");
	ChatRoomCharacterItemUpdate(C, "ItemVulva");
	CharacterRefresh(C);

	const Prefix = ExtendedItemCustomChatPrefix("Wand", Data);
	const Dictionary = [
		{Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber},
		{Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber},
	];

	ExtendedItemCustomExit(`${Prefix}Wand`, Dictionary);
}
