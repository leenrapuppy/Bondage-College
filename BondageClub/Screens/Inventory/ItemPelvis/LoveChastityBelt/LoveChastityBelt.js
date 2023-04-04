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

/**
 * Draw the item extension screen.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemPelvisLoveChastityBeltDraw(OriginalFunction) {
	OriginalFunction();
	if (ModularItemModuleIsActive(ModularItemBase)) {
		const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.MODULAR);
		if (Data == null) {
			return;
		}
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

/**
 * Catches the item extension clicks
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemPelvisLoveChastityBeltClick(OriginalFunction) {
	// Disable the vibrator when the front shield is removed
	if (!ExtendedItemPermissionMode && ModularItemModuleIsActive("FrontShield")) {
		const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.MODULAR);
		if (Data == null) {
			return;
		}

		const Module = Data.modules.find((m) => m.Name === "FrontShield");
		const Positions = Data.drawData.FrontShield.positions;
		for (const [i, [x, y]] of Positions.entries()) {
			if (MouseIn(x, y, 225, 55)) {
				return InventoryItemPelvisLoveChastityBeltSetType(Module, i, Data);
			}
		}
	}
	InventoryItemPelvisSciFiPleasurePantiesClickHook(OriginalFunction, false);
}

/**
 * Custom `SetType` function for the Love Chastity Belt's front shield.
 * @param {ModularItemModule} module - The module that changed
 * @param {number} index - The index of the newly chosen option within the module
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 * @see {@link ModularItemSetType}
 */
function InventoryItemPelvisLoveChastityBeltSetType(module, index, data) {
	const C = CharacterGetCurrent();
	const option = module.Options[index];
	const currentModuleValues = ModularItemParseCurrent(data);
	const moduleIndex = data.modules.indexOf(module);
	const currentOption = module.Options[currentModuleValues[moduleIndex]];

	// Make a final requirement check before actually modifying the item
	const requirementMessage = ExtendedItemRequirementCheckMessage(DialogFocusItem, C, option, currentOption);
	if (requirementMessage || currentModuleValues[moduleIndex] === index) {
		DialogExtendedMessage = requirementMessage;
		return;
	}

	// Ensure that the vibrator intensity is only set when the appropriate attachment is selected
	// Update the vibrator intensity without pushing before updating the front shield itself
	if (index !== 2 && currentModuleValues[2] !== 0) {
		const newModuleValues = currentModuleValues.slice();
		newModuleValues[2] = 0;
		ModularItemSetOption(C, DialogFocusItem, currentModuleValues, newModuleValues, data, false);
	}
	ModularItemSetType(module, index, data);
	ExtendedItemRequirementCheckMessageMemo.clearCache();
}

/** @type {ExtendedItemValidateScriptHookCallback<ModularItemOption>} */
function InventoryItemPelvisLoveChastityBeltValidate(OriginalFunction, C, Item, Option, CurrentOption) {
	const Data = ExtendedItemGetData(Item, ExtendedArchetype.MODULAR);
	if (Data == null) {
		return OriginalFunction(C, Item, Option, CurrentOption);
	}

	const Prefix = `${Item.Asset.Group.Name}${Item.Asset.Name}`;
	const Module = Data.modules.find((m) => m.Key === Option.Name[0]) || { Name: null };
	const FrontShield = ModularItemParseCurrent(Data)[0];

	if (!C.IsOwnedByPlayer()) {
		return DialogFindPlayer("PreviewIconOwnerOnly");
	} else if (Module.Name === "Intensity" && Option.Name !== "i0" && FrontShield !== 2) {
		return DialogFindPlayer(`${Prefix}ValidateIntensity`);
	} else if (Option.Name === "TriggerShock" && FrontShield !== 3) {
		return DialogFindPlayer(`${Prefix}ValidateTriggerShock`);
	} else {
		return OriginalFunction(C, Item, Option, CurrentOption);
	}
}
