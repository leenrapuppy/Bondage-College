"use strict";

/**
 * Custom draw function.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemVulvaLoversVibratorDrawHook(OriginalFunction) {
	const { Asset, Property } = DialogFocusItem;
	const ItemMemberNumber = DialogFindPlayer("ItemMemberNumber").replace("Item", Asset.Description);
	DrawText(ItemMemberNumber + " " + Property.ItemMemberNumber, 1500, 450, "white", "gray");
	VibratorModeDraw([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED], 525);
}

/**
 * Custom click function.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemVulvaLoversVibratorClickHook(OriginalFunction) {
	VibratorModeClick([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED], 525);
}
