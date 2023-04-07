"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemVulvaClitAndDildoVibratorbeltDrawHook(Data, OriginalFunction) {
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

/** @type {ExtendedItemScriptHookCallbacks.Exit<ModularItemData>} */
function InventoryItemVulvaClitAndDildoVibratorbeltExitHook(Data) {
	// Ensure that the vibrator intensity is set to the maximum of the egg and dildo intensity
	const CurrentModuleValues = ModularItemParseCurrent(Data);
	const Intensities = Data.modules.map((m, i) => m.Options[CurrentModuleValues[i]].Property.Intensity);
	DialogFocusItem.Property.Intensity = /** @type {VibratorIntensity}*/(Math.max(...Intensities));

	const GroupName = Data.asset.Group.Name;
	const C = CharacterGetCurrent();
	CharacterRefresh(C, true, false);
	ChatRoomCharacterItemUpdate(C, GroupName);
}
