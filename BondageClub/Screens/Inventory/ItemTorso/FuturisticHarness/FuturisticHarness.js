"use strict";

/**
 * Draw the item extension screen
 * @param {TypedItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemTorsoFuturisticHarnessDraw(Data, OriginalFunction) {
	if (!FuturisticAccessDraw(Data, OriginalFunction)) {
		return;
	}
	ExtendedItemCustomDraw("FuturisticCollarColor", 1385, 800, false, !InventoryItemTorsoFuturisticHarnessIsColorable());
}

/**
 * Catches the item extension clicks
 * @param {TypedItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemTorsoFuturisticHarnessClick(Data, OriginalFunction) {
	if (!FuturisticAccessClick(Data, OriginalFunction)) {
		return;
	}
	if (MouseIn(1385, 800, 225, 55)) {
		if (ExtendedItemPermissionMode || InventoryItemTorsoFuturisticHarnessIsColorable()) {
			ExtendedItemCustomClick("FuturisticCollarColor", InventoryItemTorsoFuturisticHarnessColor);
		}
	}
}

/** @type {() => boolean} */
function InventoryItemTorsoFuturisticHarnessIsColorable() {
	const C = CharacterGetCurrent();
	const FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C);
	return (FuturisticCollarItems.length > 0);
}

/** @type {() => void} */
function InventoryItemTorsoFuturisticHarnessColor() {
	const C = CharacterGetCurrent();
	InventoryItemNeckFuturisticCollarColor(C, DialogFocusItem);
}
