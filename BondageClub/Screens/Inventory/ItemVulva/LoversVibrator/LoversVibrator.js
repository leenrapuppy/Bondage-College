"use strict";

/**
 * Custom draw function.
 * @param {VibratingItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemVulvaLoversVibratorDrawHook(Data, OriginalFunction) {
	const { Asset, Property } = DialogFocusItem;
	const ItemMemberNumber = DialogFindPlayer("ItemMemberNumber").replace("Item", Asset.Description);
	DrawText(ItemMemberNumber + " " + Property.ItemMemberNumber, 1500, 450, "white", "gray");
	VibratorModeDraw(Data.modeSet, 525);
}

/**
 * Custom click function.
 * @param {VibratingItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemVulvaLoversVibratorClickHook(Data, OriginalFunction) {
	VibratorModeClick(Data.modeSet, 525);
}
