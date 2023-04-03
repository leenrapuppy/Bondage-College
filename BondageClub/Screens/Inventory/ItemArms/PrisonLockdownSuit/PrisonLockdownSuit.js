"use strict";

/**
 * Draw the item extension screen
 * @param {ModularItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemArmsPrisonLockdownSuitDraw(Data, OriginalFunction) {
	if (ModularItemModuleIsActive("ShockModule")) {
		InventoryItemNeckAccessoriesCollarShockUnitDrawFunc(Data, OriginalFunction);
	} else {
		OriginalFunction();
	}
}

/**
 * Catches the item extension clicks
 * @param {ModularItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemArmsPrisonLockdownSuitClick(Data, OriginalFunction) {
	if (ModularItemModuleIsActive("ShockModule")) {
		InventoryItemNeckAccessoriesCollarShockUnitClickFunc(Data, OriginalFunction);
	} else {
		OriginalFunction();
	}
}
