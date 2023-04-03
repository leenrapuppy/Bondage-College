"use strict";

/**
 * Draw the item extension screen.
 * @param {ModularItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemVulvaClitAndDildoVibratorbeltDraw(Data, OriginalFunction) {
	OriginalFunction();
	if (Data.currentModule === ModularItemBase) {
		const [DildoIntensity, EggIntensity] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("DildoIntensity"), 1500, 565, "White", "Gray");
		DrawText(DialogFindPlayer("EggIntensity"), 1500, 640, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${DildoIntensity}`), 1510, 565, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${EggIntensity}`), 1510, 640, "White", "Gray");
		MainCanvas.textAlign = "center";
	}
}

/**
 * Exit the extended item screen.
 * @param {ModularItemData}  Data - The items extended item data
 * @returns {void} Nothing
 */
function InventoryItemVulvaClitAndDildoVibratorbeltExit(Data) {
	// Ensure that the vibrator intensity is set to the maximum of the egg and dildo intensity
	const CurrentModuleValues = ModularItemParseCurrent(Data);
	const Intensities = Data.modules.map((m, i) => m.Options[CurrentModuleValues[i]].Property.Intensity);
	DialogFocusItem.Property.Intensity = /** @type {VibratorIntensity}*/(Math.max(...Intensities));

	const GroupName = Data.asset.Group.Name;
	const C = CharacterGetCurrent();
	CharacterRefresh(C, true, false);
	ChatRoomCharacterItemUpdate(C, GroupName);
}
