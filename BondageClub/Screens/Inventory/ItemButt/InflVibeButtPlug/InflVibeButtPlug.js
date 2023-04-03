"use strict";

/**
 * Draw the item extension screen.
 * @param {ModularItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemButtInflVibeButtPlugDraw(Data, OriginalFunction) {
	OriginalFunction();

	if (ModularItemModuleIsActive(ModularItemBase)) {
		const [InflateLevel, Intensity] = ModularItemParseCurrent(Data);

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("InflateLevel"), 1500, 565, "White", "Gray");
		DrawText(DialogFindPlayer("Intensity"), 1500, 640, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}f${InflateLevel}`), 1510, 565, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}i${Intensity}`), 1510, 640, "White", "Gray");
		MainCanvas.textAlign = "center";
	}
}
