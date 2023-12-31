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
	return `${Item.Asset.Group.Name}${Item.Asset.Name}${Name}`;
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
 * @param {null | ExtendedItemData<any>} Data - The items extended item data
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {string} thumbIcon The icon to use for the range input's "thumb" (handle).
 * @returns {HTMLInputElement} - The new or pre-existing range input element of the opacity slider
 */
function PropertyOpacityLoad(Data=null, OriginalFunction=null, thumbIcon="blindfold") {
	if (OriginalFunction != null) {
		OriginalFunction();
	}
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
		opacitySlider.addEventListener("input", (e) => PropertyOpacityChange(C, DialogFocusItem, Number(/** @type {HTMLInputElement} */ (e.target).value)));
		return opacitySlider;
	} else {
		return /** @type {HTMLInputElement} */(document.getElementById(ID));
	}
}

/**
 * Draw function for items with opacity sliders. Draws the opacity slider and further opacity-related information.
 * @param {null | ExtendedItemData<any>} Data - The items extended item data
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {number} XOffset - An offset for all text and slider X coordinates
 * @param {number} YOffset - An offset for all text and slider Y coordinates
 * @param {string} LabelKeyword - The keyword of the opacity label
 * @returns {void} Nothing
 */
function PropertyOpacityDraw(Data=null, OriginalFunction=null, XOffset=0, YOffset=0, LabelKeyword="OpacityLabel") {
	if (OriginalFunction != null) {
		OriginalFunction();
	}
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
 * @param {null | ExtendedItemData<any>} Data - The items extended item data
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {boolean} Refresh - Whether character parameters and the respective item should be refreshed or not
 * @returns {boolean} Whether the opacity was updated or not
 */
function PropertyOpacityExit(Data=null, OriginalFunction=null, Refresh=true) {
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
		CharacterRefresh(C, true, false);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	ElementRemove(ID);
	PropertyOriginalValue.delete(ID);
	return true;
}

/**
 * Validation function for items with opacity sliders.
 * @type {ExtendedItemScriptHookCallbacks.Validate<ExtendedItemData<any>, any>}
 */
function PropertyOpacityValidate(Data, OriginalFunction, C, Item, Option, CurrentOption) {
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

	const Dictionary = new DictionaryBuilder()
		.destinationCharacterName(C)
		.asset(Item.Asset)
		.shockIntensity(ShockLevel * 1.5)
		.focusGroup(Item.Asset.Group.Name)
		.if(Automatic)
		.markAutomatic()
		.endif()
		.build();

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
		ExtendedItemCustomExit(ActionTag);
	}
}

/**
 * A set of group names whose auto-punishment has successfully been handled by {@link PropertyAutoPunishDetectSpeech}.
 * If a group name is absent from the set then it's eligible for action-based punishment triggers.
 * The initial set is populated by {@link AssetLoadAll} after all asset groups are defined.
 * @type {Set<AssetGroupName>}
 */
let PropertyAutoPunishHandled = new Set();

/**
 * A list of keywords that can trigger automatic punishment when included in `/me`- or `*`-based messages
 * @type {readonly string[]}
 */
const PropertyAutoPunishKeywords = [
	"moan",
	"whimper",
	"shout",
	"scream",
	"whine",
	"growl",
	"laugh",
	"giggle",
	"mutter",
	"stutter",
	"stammer",
	"grunt",
	"hiss",
	"screech",
	"bark",
	"mumble",
];

/**
 * Check if a given message warants automatic punishment given the provided sensitivety level
 * @param {0 | 1 | 2 | 3} Sensitivity - The auto-punishment sensitivety
 * @param {string} msg - The to-be checked message
 * @returns {boolean} Whether the passed message should trigger automatic speech-based punishment
 */
function PropertyAutoPunishParseMessage(Sensitivity, msg) {
	// Conditions which are never punishable
	if (msg.startsWith("(")) {
		return false;
	}

	// Conditions that are always punishable
	const PunishableSpeech = (
		msg.includes('!')
		|| msg.includes('！')
		|| (msg === msg.toUpperCase() && msg !== msg.toLowerCase())
	);

	// Check for sensitivity-specific conditions
	let PunishableKeywords = false;
	switch (Sensitivity) {
		case 1:
			return (
				!msg.startsWith("*")
				&& !msg.startsWith("/")
				&& (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') !== msg && PunishableSpeech)
			);
		case 2:
			return (
				!msg.startsWith("*")
				&& !msg.startsWith("/")
				&& (
					msg.length > 25
					|| (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') !== msg && PunishableSpeech)
				)
			);
		case 3:
			PunishableKeywords = PropertyAutoPunishKeywords.some((k) => msg.includes(k));
			if (PunishableKeywords && (msg.startsWith("/me") || msg.startsWith("*"))) {
				return true;
			}

			return (
				!msg.startsWith("*")
				&& !msg.startsWith("/")
				&& (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') !== msg || PunishableSpeech)
			);
		default:
			return false;
	}
}

/**
 * Check whether the last uttered message should trigger automatic punishment from the provided item
 * @param {Item} Item - The item in question
 * @param {number | null} LastMessageLen - The length of {@link ChatRoomLastMessage} prior to the last message (if applicable)
 * @returns {boolean} Whether the last message should trigger automatic speech-based punishment
 */
function PropertyAutoPunishDetectSpeech(Item, LastMessageLen=null) {
	const GroupName = Item.Asset.Group.Name;
	const GagAction = !PropertyAutoPunishHandled.has(GroupName);
	PropertyAutoPunishHandled.add(GroupName);

	// Abort the item does not have `AutoPunish` set
	if (!Item.Property || !Item.Property.AutoPunish) {
		return false;
	}

	// Gag actions at maximum `AutoPunish` values always inflate
	if (Item.Property.AutoPunish === 3 && GagAction) {
		return true;
	}

	// Abort on whispers or if no new messages have been submitted
	if (ChatRoomTargetMemberNumber != null || !ChatRoomLastMessage || ChatRoomLastMessage.length === LastMessageLen) {
		return false;
	}

	const msg = ChatRoomLastMessage[ChatRoomLastMessage.length - 1];
	return PropertyAutoPunishParseMessage(Item.Property.AutoPunish, msg);
}

/**
 * Merge all passed item properties into the passed output, merging (and shallow copying) arrays if necessary.
 * @param {ItemProperties} output - The to be updated properties
 * @param {readonly ItemProperties[]} args - The additional item properties to be merged into the output
 * @returns {ItemProperties} - The passed output modified inplace
 */
function PropertyUnion(output, ...args) {
	for (const property of args) {
		for (const [key, value] of Object.entries(property)) {
			if (Array.isArray(value)) {
				const previousValue = Array.isArray(output[key]) ? [...output[key]] : [];
				output[key] = [
					...previousValue,
					...value.filter(i => !previousValue.includes(i)),
				];
			} else {
				output[key] = value;
			}
		}
	}
	return output;
}

/**
 * Remove all passed item properties from the passed output, removing (and shallow copying) array entries if necessary.
 * @param {ItemProperties} output - The to-be updated properties
 * @param {readonly ItemProperties[]} args - The additional item properties to be removed from the output
 * @returns {ItemProperties} - The passed output modified inplace
 */
function PropertyDifference(output, ...args) {
	for (const property of args) {
		for (const [key, value] of Object.entries(property)) {
			if (Array.isArray(value)) {
				const previousValue = Array.isArray(output[key]) ? output[key] : [];
				output[key] = previousValue.filter(i => !value.includes(i));
			} else {
				delete output[key];
			}
		}
	}
	return output;
}
