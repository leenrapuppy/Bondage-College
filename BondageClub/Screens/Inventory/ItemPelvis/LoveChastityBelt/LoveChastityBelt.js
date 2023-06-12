"use strict";

/** Map the names of the love chastity belt front + black shield options to its scifi pleasure panties equivalent. */
const InventoryItemPelvisLoveChastityBeltCrotchShield = new Map([
	["f0b0", "c0"],
	["f1b0", "c1"],
	["f2b0", "c1"],
	["f3b0", "c1"],
	["f0b1", "c2"],
	["f1b1", "c3"],
	["f2b1", "c3"],
	["f3b1", "c3"],
]);

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemPelvisLoveChastityBeltDraw(Data, OriginalFunction) {
	OriginalFunction();
	if (Data.currentModule === ModularItemBase) {
		const [FrontShield, BackShield, Intensity, ShockLevel] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];
		const CrotchShield = InventoryItemPelvisLoveChastityBeltCrotchShield.get(`${FrontShield}${BackShield}`);
		const ShieldSuffix = (["f2", "f3"].includes(FrontShield)) ? "" : ` (${DialogFindPlayer(`${Data.dialogPrefix.option}${FrontShield}`)})`;

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("CrotchShield"), 1500, 625, "White", "Gray");
		DrawText(DialogFindPlayer("Intensity"), 1500, 700, "White", "Gray");
		DrawText(DialogFindPlayer("ShockLevel"), 1500, 775, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`ItemPelvisSciFiPleasurePantiesOption${CrotchShield}`) + ShieldSuffix, 1510, 625, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${Intensity}`), 1510, 700, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${ShockLevel}`), 1510, 775, "White", "Gray");
		MainCanvas.textAlign = "center";

		// Display the ShowText checkbox
		DrawCheckbox(1175, 818, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
		DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 848, "White", "Gray");

		// Display the manual shock button
		ExtendedItemCustomDraw("TriggerShock", 1637, 825, false, false);
	}
}

/** @type {ExtendedItemScriptHookCallbacks.SetOption<ModularItemData, ModularItemOption>} */
function InventoryItemPelvisLoveChastityBeltSetOptionHook(data, originalFunction, C, item, newOption, previousOption, push) {
	originalFunction(C, item, newOption, previousOption, false);

	// Switch off the vibe module if the corresponding front shield is removed
	if (previousOption.Name === "f2") { // 2 - close front & vibrator
		ExtendedItemRequirementCheckMessageMemo.clearCache();
		const previousModuleValues = ModularItemParseCurrent(data, item.Property.Type);
		const vibePreviousOption = data.modules[2].Options[previousModuleValues[2]];
		const vibeNewOption = data.modules[2].Options[0];
		return originalFunction(C, item, vibeNewOption, vibePreviousOption, push);
	} else {
		CharacterRefresh(C, push, false);
	}
}

/** @type {ExtendedItemScriptHookCallbacks.Validate<ModularItemData, ModularItemOption>} */
function InventoryItemPelvisLoveChastityBeltValidate(Data, OriginalFunction, C, Item, Option, CurrentOption) {
	const Prefix = `${Item.Asset.Group.Name}${Item.Asset.Name}`;
	const Module = Data.modules.find((m) => m.Key === Option.Name[0]) || { Name: null };
	const FrontShield = ModularItemParseCurrent(Data)[0];

	// Allow simple characters (used for things like appearance previews) to bypass the owner-only restriction
	// TODO: Review the relationship-based methods such as `IsOwnedByPlayer` and their interaction with simple characters
	if (!C.IsSimple() && !C.IsOwnedByPlayer()) {
		return DialogFindPlayer("PreviewIconOwnerOnly");
	} else if (Module.Name === "Intensity" && Option.Name !== "i0" && FrontShield !== 2) {
		return DialogFindPlayer(`${Prefix}ValidateIntensity`);
	} else if (Option.Name === "TriggerShock" && FrontShield !== 3) {
		return DialogFindPlayer(`${Prefix}ValidateTriggerShock`);
	} else {
		return OriginalFunction(C, Item, Option, CurrentOption);
	}
}
