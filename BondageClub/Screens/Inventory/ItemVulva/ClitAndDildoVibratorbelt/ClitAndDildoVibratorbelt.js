"use strict";

/**
 * Draw the item extension screen.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemVulvaClitAndDildoVibratorbeltDraw(OriginalFunction) {
	OriginalFunction();
    if (ModularItemModuleIsActive(ModularItemBase)) {
        const Data = ModularItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
        const [DildoIntensity, EggIntensity] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];

        // Display option information
        MainCanvas.textAlign = "right";
        DrawText(DialogFindPlayer("DildoIntensity"), 1500, 565, "White", "Gray");
        DrawText(DialogFindPlayer("EggIntensity"), 1500, 640, "White", "Gray");
        MainCanvas.textAlign = "left";
        DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${DildoIntensity}`), 1510, 565, "White", "Gray");
        DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${EggIntensity}`), 1510, 640, "White", "Gray");
        MainCanvas.textAlign = "center";
	}
}

/**
 * Exit the extended item screen.
 * @returns {void} Nothing
 */
function InventoryItemVulvaClitAndDildoVibratorbeltExit() {
	// Ensure that the vibrator intensity is set to the maximum of the egg and dildo intensity
	const Data = ModularItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
	const CurrentModuleValues = ModularItemParseCurrent(Data);
	const Intensities = Data.modules.map((m, i) => m.Options[CurrentModuleValues[i]].Property.Intensity);
	DialogFocusItem.Property.Intensity = /** @type {VibratorIntensity}*/(Math.max(...Intensities));

	const GroupName = Data.asset.Group.Name;
	const C = CharacterGetCurrent();
	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, GroupName);
}
