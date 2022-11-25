"use strict";

/**
 * Draw handler the extended item screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemDevicesVacBedDeluxeDraw(OriginalFunction) {
    // Hide the Opacity slider while not in the base kmodule
    const ID = OpacityGetID();
    if (ModularItemHideElement(ID, ModularItemBase)) {
        OpacityDraw(OriginalFunction);
    } else {
        OriginalFunction();
    }
}
