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
	const C = CharacterGetCurrent();
	const FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C);
	if (FuturisticCollarItems.length > 0) {
		DrawButton(1385, 800, 225, 55, DialogFindPlayer("FuturisticCollarColor"), "White");
	}
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
		const C = CharacterGetCurrent();
		const FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C);
		if (FuturisticCollarItems.length > 0 && DialogFocusItem) {
			InventoryItemNeckFuturisticCollarColor(C, DialogFocusItem);
			FuturisticAccessExit();
		}
	}
}
