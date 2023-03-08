"use strict";

/**
 * The name of vertical slider element
 * @const {string}
 */
const VariableHeightSliderId = "VariableHeightSlider";

/**
 * The name of the numerical percentage input element
 * @const {string}
 */
const VariableHeightNumerId = "VariableHeightNumber";

/**
 * Tracks the original properties to revert back to if the user cancels their changes
 * @type ItemProperties
 */
let VariableHeightPreviousProperty;

/**
 * A lookup for the variable height configurations for each registered variable height item
 * @const
 * @type {Record<string, VariableHeightData>}
 */
const VariableHeightDataLookup = {};

/**
 * Registers a variable height extended item. This automatically creates the item's load, draw and click functions.
 * @param {Asset} asset - The asset being registered
 * @param {VariableHeightConfig | undefined} config - The variable height configuration
 * @param {ItemProperties | undefined} property - The default properties to use
 * @param {ExtendedItemOption[]} [parentOptions=null] - The variable height configuration of the option's parent item, if any
 * @returns {void} - Nothing
 */
function VariableHeightRegister(asset, config, property, parentOptions = null) {
	const data = VariableHeightCreateData(asset, config, property, parentOptions);

	if (IsBrowser()) {
		VariableHeightCreateLoadFunction(data);
		VariableHeightCreateDrawFunction(data);
		VariableHeightCreateClickFunction(data);
		VariableHeightCreateExitFunction(data);
		VariableHeightCreatePublishFunction(data);
		ExtendedItemCreateNpcDialogFunction(data.asset, data.functionPrefix, data.dialog.npcPrefix);
	}
}

/**
 * Generates an asset's variable height data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {VariableHeightConfig} config - The variable height configuration
 * @param {ItemProperties} property
 * @param {ExtendedItemOption[]} parentOptions
 * @returns {VariableHeightData} - The generated variable height data for the asset
 */
function VariableHeightCreateData(asset,
	{ MaxHeight, MinHeight, Slider, Dialog, ChatTags, GetHeightFunction, SetHeightFunction },
	property, parentOptions)
{
	const key = `${asset.Group.Name}${asset.Name}${property.Type || ""}`;
	return VariableHeightDataLookup[key] = {
		key,
		asset,
		functionPrefix: `Inventory${key}`,
		maxHeight: MaxHeight,
		minHeight: MinHeight,
		slider: Slider,
		defaultProperty: property,
		dialog: {
			chatPrefix: Dialog.ChatPrefix || `${key}Set`,
			npcPrefix: Dialog.NpcPrefix || key,
		},
		chatTags: Array.isArray(ChatTags) ? ChatTags : [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
			CommonChatTags.TARGET_CHAR,
			CommonChatTags.ASSET_NAME
		],
		getHeight: GetHeightFunction || VariableHeightGetOverrideHeight,
		setHeight: SetHeightFunction || VariableHeightSetOverrideHeight,
		parentOptions: parentOptions,
	};
}

/**
 * Creates an asset's extended item load function
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightCreateLoadFunction({ maxHeight, minHeight, slider, functionPrefix, getHeight, setHeight }) {
	// Create the load function
	const loadFunctionName = `${functionPrefix}Load`;
	window[loadFunctionName] = function () {
		// Record the previously set properties, reverting back to them on exiting unless otherwise instructed
		if ((!VariableHeightPreviousProperty || VariableHeightPreviousProperty.Revert) && DialogFocusItem.Property) {
			VariableHeightPreviousProperty = JSON.parse(JSON.stringify(DialogFocusItem.Property));
			VariableHeightPreviousProperty.Revert = true;
		}

		// Create the function to apply the user's setting changes
		const changeHeight = function (heightValue, elementId) {
			VariableHeightChange(heightValue, maxHeight, minHeight, setHeight, elementId);
		};

		// Create the controls and listeners
		const currentHeight = getHeight(DialogFocusItem.Property);
		const heightSlider = ElementCreateRangeInput(VariableHeightSliderId, currentHeight, 0, 1, 0.01, slider.Icon, true);
		if (heightSlider) {
			heightSlider.addEventListener("input", (e) => changeHeight(Number(e.target.value), VariableHeightSliderId));
		}
		const heightNumber = ElementCreateInput(VariableHeightNumerId, "number", String(Math.round(currentHeight * 100)), "");
		if (heightNumber) {
			heightNumber.setAttribute("min", "0");
			heightNumber.setAttribute("max", "100");
			heightNumber.addEventListener("change", (e) => changeHeight(Number(e.target.value) / 100, VariableHeightNumerId));
		}
	};
}

/**
 * Creates an asset's extended item draw function
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightCreateDrawFunction({ functionPrefix, asset, slider }) {
	const drawFunctionName = `${functionPrefix}Draw`;
	window[drawFunctionName] = function () {
		ExtendedItemDrawHeader();
		DrawText(DialogFindPlayer("VariableHeightSelect"), 1500, 375, "white", "gray");

		ElementPosition(VariableHeightSliderId, 1140, slider.Top + slider.Height / 2, 100, slider.Height);

		DrawTextFit(DialogFindPlayer("VariableHeightPercent"), 1405, 555, 250, "white", "gray");
		ElementPosition(VariableHeightNumerId, 1640, 550, 175);

		DrawButton(1350, 700, 300, 64, DialogFind(Player, "VariableHeightConfirm"), "White", "");
	};
}

/**
 * Creates an asset's extended item click function
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightCreateClickFunction({ parentOptions, functionPrefix, dialog, asset, chatTags, getHeight }) {
	const clickFunctionName = `${functionPrefix}Click`;
	window[clickFunctionName] = function () {
		// Exit the screen
		if (MouseIn(1885, 25, 90, 90)) {
			VariableHeightExit();
			if (!parentOptions) {
				DialogFocusItem = null;
			}
		}

		// Confirm button
		if (MouseIn(1350, 700, 300, 64)) {
			if (VariableHeightPreviousProperty) {
				VariableHeightPreviousProperty.Revert = false;
			}
			if (parentOptions) {
				let option = Object.assign({}, parentOptions.find(o => o.Property.Type == DialogFocusItem.Property.Type));
				option.Property = DialogFocusItem.Property;
				const C = CharacterGetCurrent();
				ExtendedItemSetType(C, parentOptions, option);
			} else {
				if (CurrentScreen == "ChatRoom") {
					VariableHeightPublish(dialog, asset, chatTags, getHeight);
				}
			}
		}
	};
}

/**
 * Creates an asset's extended item exit function
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightCreateExitFunction({ functionPrefix }) {
	const drawFunctionName = `${functionPrefix}Exit`;
	window[drawFunctionName] = VariableHeightExit;
}

/**
 * Creates an asset's extended item chatroom message publishing function
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightCreatePublishFunction({ functionPrefix, dialog, asset, chatTags, getHeight }) {
	const loadFunctionName = `${functionPrefix}PublishAction`;
	window[loadFunctionName] = function () {
		VariableHeightPublish(dialog, asset, chatTags, getHeight);
	};
}

/**
 * Apply the setting change, throttling to limit the refreshes
 * @param {number} height - The new height value for the character
 * @param {number} maxHeight - The maximum height value for the character
 * @param {number} minHeight - The minimum height value for the character
 * @param {(Property: ItemProperties, height: number, maxHeight: number, minHeight: number) => void} setHeight - The control that triggered the change
 * @param {string} fromElementId - The element ID
 * @returns {void} - Nothing
 */
const VariableHeightChange = CommonLimitFunction((height, maxHeight, minHeight, setHeight, fromElementId) => {
	// Validate the value
	if (isNaN(height) || height < 0 || height > 1 || !DialogFocusItem) return;

	// Round to the nearest 0.01
	height = Math.round(height * 100) / 100;

	// Update values on controls, except the one just changed
	if (fromElementId !== VariableHeightSliderId) {
		ElementValue(VariableHeightSliderId, height);
	}
	if (fromElementId !== VariableHeightNumerId) {
		ElementValue(VariableHeightNumerId, String(Math.round(height * 100)));
	}

	// Apply the new setting
	setHeight(DialogFocusItem.Property, height, maxHeight, minHeight);

	// Reload to see the change
	const C = CharacterGetCurrent();
	CharacterRefresh(C, false, false);
});

/**
 * Exit handler for the item's extended item screen. Updates the character and removes UI components.
 * @returns {void} - Nothing
 */
function VariableHeightExit() {
	// Revert the changes
	if (VariableHeightPreviousProperty && VariableHeightPreviousProperty.Revert) {
		const C = CharacterGetCurrent();
		DialogFocusItem.Property = JSON.parse(JSON.stringify(VariableHeightPreviousProperty));
		CharacterRefresh(C, false, false);
	}

	// Cleanup
	VariableHeightPreviousProperty = null;
	ElementRemove(VariableHeightSliderId);
	ElementRemove(VariableHeightNumerId);
	ExtendedItemSubscreen = null;
}

/**
 * Publishes a custom action to the chat for the height change
 * @param {Object} dialog - The keywords for the dialog entries to look up
 * @param {Asset} asset - The asset for the variable height item
 * @param {readonly CommonChatTags[]} chatTags - The tags to map to a dictionary entry
 * @param {Function} getHeight - Function to find the current setting from a property
 * @returns {void} - Nothing
 */
function VariableHeightPublish(dialog, asset, chatTags, getHeight) {
	const newHeight = getHeight(DialogFocusItem.Property);
	const prevHeight = getHeight(VariableHeightPreviousProperty);
	const msgType = prevHeight !== null && VariableHeightPreviousProperty.Type == DialogFocusItem.Property.Type
		? prevHeight < newHeight ? "Raise" : "Lower"
		: "";

	const C = CharacterGetCurrent();
	const msg = dialog.chatPrefix + msgType;
	const dictionary = chatTags
		.map((tag) => ExtendedItemMapChatTagToDictionaryEntry(C, asset, tag))
		.filter(Boolean);
	ChatRoomPublishCustomAction(msg, true, dictionary);
}

/**
 * Retrieve the current height position override if set, accounting for inversion
 * @param {ItemProperties} property - Property of the item determining the variable height
 * @returns {number | null} - The height value between 0 and 1, null if missing or invalid
 */
function VariableHeightGetOverrideHeight(property) {
	if (property
		&& property.OverrideHeight
		&& typeof property.OverrideHeight.Height == "number"
		&& typeof property.OverrideHeight.HeightRatioProportion == "number")
	{
		const isInverted = property.SetPose && property.SetPose.includes("Suspension");
		const heightSetting = property.OverrideHeight.HeightRatioProportion;

		return isInverted ? heightSetting : 1 - heightSetting;
	}

	return null;
}

/**
 * Reposition the character vertically when upside-down, accounting for height ratio and inversion
 * @param {ItemProperties} property - Property of the item determining the variable height
 * @param {number} height - The 0 to 1 height setting to use
 * @param {number} maxHeight - The maximum number of the item's height range
 * @param {number} minHeight - The minimum number of the item's height range
 * @returns {void} - Nothing
 */
function VariableHeightSetOverrideHeight(property, height, maxHeight, minHeight) {
	if (property && property.OverrideHeight) {
		const isInverted = property.SetPose && property.SetPose.includes("Suspension");
		const heightSetting = isInverted ? height : 1 - height;

		property.OverrideHeight.HeightRatioProportion = heightSetting;
		property.OverrideHeight.Height = Math.round(maxHeight - heightSetting * (maxHeight - minHeight));
	}
}

/**
 * Initialize the variable height item properties
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {string} Type - The item's type
 * @param {boolean} Refresh -  Whether the character and relevant item should be refreshed and pushed to the server
 * @see {@link ExtendedItemInit}
 */
function VariableHeightInit(Item, C, Type, Refresh=true) {
	const Data = ExtendedItemGetData(Item, ExtendedArchetype.VARIABLEHEIGHT, Type);
	if (Data === null) {
		return;
	}

	// Get the item/option's current height setting, initialising it if not set or invalid
	let currentHeight = Item.Property && Item.Property.Type == Data.defaultProperty.Type ? Data.getHeight(Item.Property) : null;
	if (currentHeight == null) {
		const lockProperties = Item.Property ? InventoryExtractLockProperties(Item.Property) : undefined;
		Item.Property = Object.assign(JSON.parse(JSON.stringify(Data.defaultProperty)), lockProperties);

		if (Item.Property.LockedBy && !(Item.Property.Effect || []).includes("Lock")) {
			Item.Property.Effect = (Item.Property.Effect || []);
			Item.Property.Effect.push("Lock");
		}

		currentHeight = Data.getHeight(Item.Property);
		Data.setHeight(Item.Property, currentHeight, Data.maxHeight, Data.minHeight);
	}
	if (Refresh) {
		// Reload to see the change
		CharacterRefresh(C, false, false);
	}
}
