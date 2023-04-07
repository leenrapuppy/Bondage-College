"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemButtInflVibeButtPlugDrawHook(Data, OriginalFunction) {
	OriginalFunction();

	if (Data.currentModule === ModularItemBase) {
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
