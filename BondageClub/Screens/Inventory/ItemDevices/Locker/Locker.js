"use strict";
const InventoryItemDevicesLockerOpacityInputId = "InventoryItemDevicesLockerOpacity";

/**
 * Add an event listener for the vac bed's opacity slider.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemDevicesLockerLoad(OriginalFunction) {
	OriginalFunction();
	const opacitySlider = ElementCreateRangeInput(
		InventoryItemDevicesLockerOpacityInputId,
		DialogFocusItem.Property.Opacity,
		DialogFocusItem.Asset.MinOpacity,
		DialogFocusItem.Asset.MaxOpacity,
		0.01, "blindfold",
	);
	if (opacitySlider) {
		const C = CharacterGetCurrent();
		opacitySlider.addEventListener("input", (e) => InventoryItemDevicesLockerOpacityChange(C, DialogFocusItem, Number(e.target.value)));
	}
}

/**
 * Draw handler for the vac bed's extended item screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemDevicesLockerDraw(OriginalFunction) {
	OriginalFunction();

	MainCanvas.textAlign = "left";
	DrawTextFit(DialogFindPlayer("ItemDevicesLockerOpacity"), 1185, 430, 400, "#fff", "#000");
	ElementPosition(InventoryItemDevicesLockerOpacityInputId, 1700, 430, 425);
	MainCanvas.textAlign = "center";
}

/**
 * Throttled callback for opacity slider changes
 * @param {Character} C - The character being modified
 * @param {Item} item - The item being modified
 * @param {number} brightness - The new brightness to set on the item
 * @returns {void} - Nothing
 */
const InventoryItemDevicesLockerOpacityChange = CommonLimitFunction((C, item, brightness) => {
	item.Property.Opacity = brightness;
	CharacterLoadCanvas(C);
});

/**
 * Exit handler for the item's extended item screen. Updates the character and removes UI components.
 * @returns {void} - Nothing
 */
function InventoryItemDevicesLockerExit() {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;

	item.Property.Opacity = Number(ElementValue(InventoryItemDevicesLockerOpacityInputId));
	ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);

	ElementRemove(InventoryItemDevicesLockerOpacityInputId);
	PreferenceMessage = "";
}
