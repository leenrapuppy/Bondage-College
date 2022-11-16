"use strict";

/**
 * Draw the item extension screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemTorsoFuturisticHarnessDraw(OriginalFunction) {
	if (!FuturisticAccessDraw(OriginalFunction)) {
		return;
	}
	ExtendedItemCustomDraw("FuturisticCollarColor", 1385, 800, false, !InventoryItemTorsoFuturisticHarnessIsColorable());
}

/**
 * Catches the item extension clicks
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemTorsoFuturisticHarnessClick(OriginalFunction) {
	if (!FuturisticAccessClick(OriginalFunction)) {
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
