"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<VibratingItemData>} */
function InventoryItemVulvaLoversVibratorDrawHook(Data, OriginalFunction) {
	const { Asset, Property } = DialogFocusItem;
	const ItemMemberNumber = DialogFindPlayer("ItemMemberNumber").replace("Item", Asset.Description);
	DrawText(ItemMemberNumber + " " + Property.ItemMemberNumber, 1500, 450, "white", "gray");
	VibratorModeDraw(Data.modeSet, 525);
}

/** @type {ExtendedItemScriptHookCallbacks.Click<VibratingItemData>} */
function InventoryItemVulvaLoversVibratorClickHook(Data, OriginalFunction) {
	VibratorModeClick(Data.modeSet, 525);
}
