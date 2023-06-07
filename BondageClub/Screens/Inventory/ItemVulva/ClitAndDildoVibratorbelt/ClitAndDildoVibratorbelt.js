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

/** @type {ExtendedItemScriptHookCallbacks.SetOption<ModularItemData, ModularItemOption>} */
function InventoryItemVulvaClitAndDildoVibratorbeltSetOptionHook(data, originalFunction, C, item, newOption, previousOption, push) {
	// Ensure that the vibrator intensity is set to the maximum of the egg and dildo intensity
	originalFunction(C, item, newOption, previousOption, false);
	const CurrentModuleValues = ModularItemParseCurrent(data);
	const Intensities = data.modules.map((m, i) => m.Options[CurrentModuleValues[i]].Property.Intensity);
	item.Property.Intensity = /** @type {VibratorIntensity}*/(Math.max(...Intensities));
	CharacterRefresh(C, push, false);
}
