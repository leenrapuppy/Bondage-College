"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemPelvisSciFiPleasurePantiesDrawHook(Data, OriginalFunction) {
	if (!FuturisticAccessDraw(Data, OriginalFunction)) {
		return;
	}
	if (Data.currentModule === ModularItemBase) {
		const [CrotchShield, Intensity, OrgasmLock, ShockLevel] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];
		const IntensitySuffix = (OrgasmLock === "o0") ? "" : ` (${DialogFindPlayer(`${Data.dialogPrefix.option}${OrgasmLock}`)})`;

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("CrotchShield"), 1500, 625, "White", "Gray");
		DrawText(DialogFindPlayer("Intensity"), 1500, 700, "White", "Gray");
		DrawText(DialogFindPlayer("ShockLevel"), 1500, 775, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${CrotchShield}`), 1510, 625, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${Intensity}`) + IntensitySuffix, 1510, 700, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${ShockLevel}`), 1510, 775, "White", "Gray");
		MainCanvas.textAlign = "center";

		// Display the ShowText checkbox
		DrawCheckbox(1175, 818, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
		DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 848, "White", "Gray");

		// Display the manual shock button
		ExtendedItemCustomDraw("TriggerShock", 1637, 825, false, false);
	}
}

/** @type {ExtendedItemScriptHookCallback<ModularItemData, [Futuristic?: boolean]>} */
function InventoryItemPelvisSciFiPleasurePantiesClickHook(Data, OriginalFunction, Futuristic=true) {
	if (!Futuristic) {
		OriginalFunction();
	} else if (!FuturisticAccessClick(Data, OriginalFunction)) {
		return;
	}

	if (DialogFocusItem && Data.currentModule === ModularItemBase) {
		if (MouseIn(1175, 818, 64, 64) && !ExtendedItemPermissionMode) {
			const Property = DialogFocusItem.Property;
			ExtendedItemCustomClick("ShowText", () => Property.ShowText = !Property.ShowText);
		} else if (MouseIn(1637, 825, 225, 55)) {
			ExtendedItemCustomClick("TriggerShock", PropertyShockPublishAction);
		}
	}
}

/** @type {ExtendedItemChatCallback<ModularItemOption>} */
function InventoryItemPelvisSciFiPleasurePantiesChatPrefix({previousOption, newOption}) {
	if (DialogFocusItem == null) {
		return "";
	}

	const Prefix = `${DialogFocusItem.Asset.Group.Name}${DialogFocusItem.Asset.Name}Set`;
	const IntensityPattern = /^(i)(\d+)$/g;
	if (!IntensityPattern.test(newOption.Name)) {
		return Prefix;
	}

	const Change = Number.parseInt(newOption.Name.slice(1)) - Number.parseInt(previousOption.Name.slice(1));
	const StateChange = (Change > 0) ? "Increase" : "Decrease";
	return `${Prefix}${StateChange}`;
}
