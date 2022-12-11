"use strict";

/**
 * Draw the item extension screen.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemButtInflVibeButtPlugDraw(OriginalFunction) {
    OriginalFunction();

    const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.MODULAR);
    if (ModularItemModuleIsActive(ModularItemBase) && Data != null) {
        const [InflateLevel, Intensity] = ModularItemParseCurrent(Data);

        // Display option information
        MainCanvas.textAlign = "right";
        DrawText(DialogFindPlayer("InflateLevel"), 1500, 565, "White", "Gray");
        DrawText(DialogFindPlayer("Intensity"), 1500, 640, "White", "Gray");
        MainCanvas.textAlign = "left";
        DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}f${InflateLevel}`), 1510, 565, "White", "Gray");
        DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}i${Intensity}`), 1510, 640, "White", "Gray");
        MainCanvas.textAlign = "center";
    }
}
