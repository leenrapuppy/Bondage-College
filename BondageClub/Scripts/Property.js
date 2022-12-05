"use strict";

/**
 * Property.js
 * -----------
 * A module with common helper functions for the handling of specific {@link ItemProperties} properties.
 * Note that more generic extended item functions should be confined to `ExtendedItem.js`.
 */

/**
 * A Map that maps input element IDs to their original value is defined in, _.e.g_, {@link PropertyOpacityLoad}.
 * Used as fallback in case an invalid opacity value is encountered when exiting.
 * @type {Map<string, any>}
 */
const PropertyOriginalValue = new Map([]);

/**
 * Construct an item-specific ID for a properties input element (_e.g._ an opacity slider).
 * @param {string} Name - The name of the input element
 * @param {Item} Item - The item for whom the ID should be constructed; defaults to {@link DialogFocusItem}
 * @returns {string} - The ID of the property
 */
function PropertyGetID(Name, Item=DialogFocusItem) {
	return `${Item.Asset.Group.Name}${Item.Asset.Name}${Name}`
}

/**
 * Throttled callback for opacity slider changes
 * @param {Character} C - The character being modified
 * @param {Item} item - The item being modified
 * @param {number} Opacity - The new opacity to set on the item
 * @returns {void} - Nothing
 */
 const PropertyOpacityChange = CommonLimitFunction((C, Item, Opacity) => {
	Item.Property.Opacity = Opacity;
	CharacterLoadCanvas(C);
});

/**
 * Load function for items with opacity sliders. Constructs the opacity slider.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @param {string} thumbIcon The icon to use for the range input's "thumb" (handle).
 * @returns {HTMLInputElement} - The new or pre-existing range input element of the opacity slider
 */
function PropertyOpacityLoad(OriginalFunction, thumbIcon="blindfold") {
	OriginalFunction();
	const ID = PropertyGetID("Opacity");
	const Asset = DialogFocusItem.Asset;

	if (!PropertyOriginalValue.has(ID)) {
		PropertyOriginalValue.set(ID, DialogFocusItem.Property.Opacity);
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
		opacitySlider.addEventListener("input", (e) => PropertyOpacityChange(C, DialogFocusItem, Number(e.target.value)));
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
function PropertyOpacityDraw(OriginalFunction, XOffset=0, YOffset=0, LabelKeyword="OpacityLabel") {
	OriginalFunction();
	const ID = PropertyGetID("Opacity");

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
function PropertyOpacityExit(Refresh=true) {
	const Asset = DialogFocusItem.Asset;
	const ID = PropertyGetID("Opacity");
	const C = CharacterGetCurrent();
	const Opacity = Number(ElementValue(ID));

	// Restore the original opacity if the new opacity is invalid
	if (!(Opacity <= Asset.MaxOpacity && Opacity >= Asset.MinOpacity)) {
		DialogFocusItem.Property.Opacity = PropertyOriginalValue.get(ID);
		ElementRemove(ID);
		PropertyOriginalValue.delete(ID);
		return false;
	}

	// Remove the element after calling `CharacterRefresh`
	// The latter will call `Load`, which would otherwise restore the slider again
	if (Refresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	ElementRemove(ID);
	PropertyOriginalValue.delete(ID);
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
function PropertyOpacityValidate(OriginalFunction, C, Item, Option, CurrentOption) {
	if (Item && Item.Property) {
		const Asset = Item.Asset;
		if (!(Item.Property.Opacity <= Asset.MaxOpacity && Item.Property.Opacity >= Asset.MinOpacity)) {
			Item.Property.Opacity = Asset.Opacity;
		}
	}
	return OriginalFunction(C, Item, Option, CurrentOption);
}

/**
 * Helper fuction for publishing shock-related actions.
 * @param {Character} C - The shocked character; defaults to the {@link CharacterGetCurrent} output
 * @param {Item} Item - The shocking item; defaults to {@link DialogFocusItem}
 * @param {boolean} Automatic - Whether the shock was triggered automatically or otherwise manually
 */
 function PropertyShockPublishAction(C=null, Item=DialogFocusItem, Automatic=false) {
	if (C == null) {
		C = CharacterGetCurrent();
	}
	if (Item == null) {
		return;
	}

	// Get item-specific properties and choose a suitable default if absent
	const ShockLevel = (Item.Property.ShockLevel != null) ? Item.Property.ShockLevel : 1;
	const ShowText = (Item.Property.ShowText != null) ? Item.Property.ShowText : true;
	if (Item.Property.TriggerCount != null) {
		Item.Property.TriggerCount++;
	}

	if (C.ID === Player.ID) {
		// The Player shocks herself
		ActivityArousalItem(C, C, Item.Asset);
	}
	InventoryShockExpression(C);

	/** @type {ChatMessageDictionary} */
	const Dictionary = [
		{ Tag: "DestinationCharacterName", Text: CharacterNickname(C), MemberNumber: C.MemberNumber },
		{ Tag: "AssetName", AssetName: Item.Asset.Name },
		{ ShockIntensity : ShockLevel * 1.5 },
		{ AssetName: Item.Asset.Name },
		{ FocusGroupName: Item.Asset.Group.Name },
	];
	if (Automatic) {
		Dictionary.push({ Automatic: true });
	}
	const ActionTag = `TriggerShock${ShockLevel}`;

	// Manually play audio and flash the screen when not in a chatroom
	if (CurrentScreen !== "ChatRoom") {
		AudioPlaySoundEffect("Shocks", 3 + (3 * ShockLevel));
		if (C.ID === Player.ID) {
			const duration = (Math.random() + ShockLevel * 1.5) * 500;
			DrawFlashScreen("#FFFFFF", duration, 500);
		}
	}

	// Publish the action, be it either quietly or not
	if (ShowText && CurrentScreen === "ChatRoom") {
		ChatRoomPublishCustomAction(ActionTag, false, Dictionary);
	} else if (CurrentScreen === "ChatRoom") {
		ChatRoomMessage({ Content: ActionTag, Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary });
	}

	// Exit the dialog menu when triggering a manual shock
	if (!Automatic) {
		ExtendedItemCustomExit(ActionTag, C, null)
	}
}
