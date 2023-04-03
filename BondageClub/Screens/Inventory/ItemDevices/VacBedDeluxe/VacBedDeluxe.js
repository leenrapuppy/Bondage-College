"use strict";

/**
 * Draw handler the extended item screen
 * @param {ModularItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemDevicesVacBedDeluxeDraw(Data, OriginalFunction) {
	// Hide the Opacity slider while not in the base kmodule
	const ID = PropertyGetID("Opacity");
	if (ModularItemHideElement(ID, ModularItemBase)) {
		PropertyOpacityDraw(Data, OriginalFunction);
	} else {
		OriginalFunction();
	}
}
