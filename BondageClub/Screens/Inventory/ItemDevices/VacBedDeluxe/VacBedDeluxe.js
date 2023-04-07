"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemDevicesVacBedDeluxeDrawHook(Data, OriginalFunction) {
	// Hide the Opacity slider while not in the base kmodule
	const ID = PropertyGetID("Opacity");
	if (ModularItemHideElement(Data, ID, ModularItemBase)) {
		PropertyOpacityDraw(Data, OriginalFunction);
	} else {
		OriginalFunction();
	}
}
