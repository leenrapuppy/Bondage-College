"use strict";

/**
 * Draw the item extension screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemArmsPrisonLockdownSuitDraw(OriginalFunction) {
	if (ModularItemModuleIsActive("ShockModule")) {
		InventoryItemNeckAccessoriesCollarShockUnitDrawFunc(OriginalFunction);
	} else {
		OriginalFunction();
	}
}

/**
 * Catches the item extension clicks
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemArmsPrisonLockdownSuitClick(OriginalFunction) {
	if (ModularItemModuleIsActive("ShockModule")) {
		InventoryItemNeckAccessoriesCollarShockUnitClickFunc(OriginalFunction);
	} else {
		OriginalFunction();
	}
}
