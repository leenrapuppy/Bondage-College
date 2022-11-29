"use strict";

/**
 * Opacity.js
 * ----------
 * A module with common helper functions for adding opacity related functionalities to extended items.
 */

/**
 * A Map that maps opacity slider IDs to the original opacity value is defined in {@link OpacityLoad}.
 * Used as fallback in case an invalid opacity value is encountered during  {@link OpacityExit}.
 * @type {Map<string, number>}
 */
const OpacityOriginalValue = new Map([]);

/**
 * Construct an item-specific ID for an opacity slider.
 * @param {Item} Item - The item for whom the ID should be constructed; defaults to {@link DialogFocusItem}
 * @returns {string} - The ID of the opacity slider
 */
function OpacityGetID(Item=DialogFocusItem) {
	return `${Item.Asset.Group.Name}${Item.Asset.Name}OpacitySlider`
}

/**
 * Throttled callback for opacity slider changes
 * @param {Character} C - The character being modified
 * @param {Item} item - The item being modified
 * @param {number} Opacity - The new opacity to set on the item
 * @returns {void} - Nothing
 */
 const OpacityChange = CommonLimitFunction((C, Item, Opacity) => {
	Item.Property.Opacity = Opacity;
	CharacterLoadCanvas(C);
});

/**
 * Load function for items with opacity sliders. Constructs the opacity slider.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @param {string} thumbIcon The icon to use for the range input's "thumb" (handle).
 * @returns {HTMLInputElement} - The new or pre-existing range input element of the opacity slider
 */
function OpacityLoad(OriginalFunction, thumbIcon="blindfold") {
	OriginalFunction();
	const ID = OpacityGetID();
	const Asset = DialogFocusItem.Asset;

	if (!OpacityOriginalValue.has(ID)) {
		OpacityOriginalValue.set(ID, DialogFocusItem.Property.Opacity);
	}

	const opacitySlider = ElementCreateRangeInput(
		ID,
		DialogFocusItem.Property.Opacity,
		Asset.MinOpacity,
		Asset.MaxOpacity,
		0.01, thumbIcon,
	);

	if (opacitySlider) {
		const C = CharacterGetCurrent();
		opacitySlider.addEventListener("input", (e) => OpacityChange(C, DialogFocusItem, Number(e.target.value)));
		return opacitySlider;
	} else {
		return /** @type {HTMLInputElement} */(document.getElementById(ID));
	}
}

/**
 * Draw function for items with opacity sliders. Draws the opacity slider and further opacity-related information.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @param {number} XOffset - An offset for all text and slider X coordinates
 * @param {number} YOffset - An offset for all text and slider Y coordinates
 * @param {string} LabelKeyword - The keyword of the opacity label
 * @returns {void} Nothing
 */
function OpacityDraw(OriginalFunction, XOffset=0, YOffset=0, LabelKeyword="OpacityLabel") {
	OriginalFunction();
	const ID = OpacityGetID();

	MainCanvas.textAlign = "right";
	DrawTextFit(
        DialogFindPlayer(LabelKeyword), 1375 + XOffset, 450 + YOffset,
        400, "#FFFFFF", "#000",
    );
	ElementPosition(ID, 1625 + XOffset, 450 + YOffset, 400);
	DrawTextFit(
        `${Math.round(DialogFocusItem.Property.Opacity * 100)}%`, 1925 + XOffset, 450 + YOffset,
        400, "#FFFFFF", "#000",
    );
	MainCanvas.textAlign = "center";
}

/**
 * Exit function for items with opacity sliders. Updates the items opacity, deletes the slider and (optionally) refreshes the character and item.
 * @param {boolean} Refresh - Whether character parameters and the respective item should be refreshed or not
 * @returns {boolean} Whether the opacity was updated or not
 */
function OpacityExit(Refresh=true) {
	const Asset = DialogFocusItem.Asset;
	const ID = OpacityGetID();
	const C = CharacterGetCurrent();
	const Opacity = Number(ElementValue(ID));

	// Restore the original opacity if the new opacity is invalid
	if (!(Opacity <= Asset.MaxOpacity && Opacity >= Asset.MinOpacity)) {
		DialogFocusItem.Property.Opacity = OpacityOriginalValue.get(ID);
		ElementRemove(ID);
		OpacityOriginalValue.delete(ID);
		return false;
	}

	// Remove the element after calling `CharacterRefresh`
	// The latter will call `Load`, which would otherwise restore the slider again
	if (Refresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	ElementRemove(ID);
	OpacityOriginalValue.delete(ID);
	return true;
}

/**
 * Validation function for items with opacity sliders.
 * @template {ExtendedItemOption | ModularItemOption} OptionType
 * @param {ExtendedItemValidateCallback<OptionType>} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @param {Character} C - The character to validate the option
 * @param {Item} Item - The equipped item
 * @param {OptionType} Option - The selected option
 * @param {OptionType} CurrentOption - The currently selected option
 * @returns {string} - Set and returns {@link DialogExtendedMessage} if the chosen option is not possible.
 */
function OpacityValidate(OriginalFunction, C, Item, Option, CurrentOption) {
	if (Item && Item.Property) {
		const Asset = Item.Asset;
		if (!(Item.Property.Opacity <= Asset.MaxOpacity && Item.Property.Opacity >= Asset.MinOpacity)) {
			Item.Property.Opacity = Asset.Opacity;
		}
	}
	return OriginalFunction(C, Item, Option, CurrentOption);
}
