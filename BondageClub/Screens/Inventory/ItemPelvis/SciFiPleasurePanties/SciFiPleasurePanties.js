"use strict";

/**
 * Custom draw function for adding the `Shock` menu.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemPelvisSciFiPleasurePantiesDraw(OriginalFunction) {
	if (!FuturisticAccessDraw(OriginalFunction)) {
		return;
	}
	if (ModularItemModuleIsActive(ModularItemBase)) {
		const Data = ModularItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
		const [CrotchShield, Intensity, OrgasmLock, ShockLevel] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];
		const IntensitySuffix = (OrgasmLock === "o0") ? "" : ` (${DialogFindPlayer(`${Data.dialogOptionPrefix}${OrgasmLock}`)})`;

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("CrotchShield"), 1500, 625, "White", "Gray");
		DrawText(DialogFindPlayer("Intensity"), 1500, 700, "White", "Gray");
		DrawText(DialogFindPlayer("ShockLevel"), 1500, 775, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${CrotchShield}`), 1510, 625, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${Intensity}`) + IntensitySuffix, 1510, 700, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${ShockLevel}`), 1510, 775, "White", "Gray");
		MainCanvas.textAlign = "center";

		// Display the ShowText checkbox
		DrawCheckbox(1175, 818, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
		DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 848, "White", "Gray");

		// Display the manual shock button
		ExtendedItemCustomDraw("TriggerShock", 1637, 825, false, false);
	}
}

/**
 * Custom click function for adding the `Shock` menu.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemPelvisSciFiPleasurePantiesClick(OriginalFunction) {
	if (!FuturisticAccessClick(OriginalFunction) || !DialogFocusItem) {
		return;
	}
	if (ModularItemModuleIsActive(ModularItemBase)) {
		if (MouseIn(1175, 818, 64, 64) && !ExtendedItemPermissionMode) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		} else if (MouseIn(1637, 825, 225, 55)) {
			ExtendedItemCustomClick("TriggerShock", ExtendedItemShockPublishAction);
		}
	}
}
