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
 * @param {TypedItemOption[]} [parentOptions=null] - The variable height configuration of the option's parent item, if any
 * @returns {void} - Nothing
 */
function VariableHeightRegister(asset, config, property, parentOptions = null) {
	const data = VariableHeightCreateData(asset, config, property, parentOptions);

	if (IsBrowser()) {
		/** @type {ExtendedItemCallbackStruct<VariableHeightOption>} */
		const defaultCallbacks = {
			load: () => VariableHeightLoad(data),
			click: () => VariableHeightClick(data),
			draw: () => VariableHeightDraw(data),
			exit: VariableHeightExit,
			publishAction: (...args) => VariableHeightPublishAction(data, ...args),
			init: (...args) => VariableHeightInit(data, ...args),
		};
		ExtendedItemCreateCallbacks(data, defaultCallbacks);
		ExtendedItemCreateNpcDialogFunction(data.asset, data.functionPrefix, data.dialogPrefix.npc);
	}
}

/**
 * Generates an asset's variable height data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {VariableHeightConfig} config - The variable height configuration
 * @param {ItemProperties} property
 * @param {TypedItemOption[]} parentOptions
 * @returns {VariableHeightData} - The generated variable height data for the asset
 */
function VariableHeightCreateData(asset,
	{ MaxHeight, MinHeight, Slider, DialogPrefix, ChatTags, Dictionary, GetHeightFunction, SetHeightFunction, ScriptHooks },
	property, parentOptions)
{
	const key = `${asset.Group.Name}${asset.Name}${property.Type || ""}`;
	DialogPrefix = DialogPrefix || {};
	return VariableHeightDataLookup[key] = {
		key,
		asset,
		functionPrefix: `Inventory${key}`,
		maxHeight: MaxHeight,
		minHeight: MinHeight,
		slider: Slider,
		baselineProperty: property,
		dialogPrefix: {
			header: DialogPrefix.Header || "VariableHeightSelect",
			chat: DialogPrefix.Chat || `${key}Set`,
			npc: DialogPrefix.Npc || key,
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
		scriptHooks: {
			load: ScriptHooks ? ScriptHooks.Load : undefined,
			draw: ScriptHooks ? ScriptHooks.Draw : undefined,
			exit: ScriptHooks ? ScriptHooks.Exit : undefined,
			click: ScriptHooks ? ScriptHooks.Click : undefined,
			publishAction: ScriptHooks ? ScriptHooks.PublishAction : undefined,
			init: ScriptHooks ? ScriptHooks.Init : undefined,
		},
		drawImages: false,
		chatSetting: "default",
		dictionary: Array.isArray(Dictionary) ? Dictionary : [],
	};
}

/**
 * @param {VariableHeightData} data - The variable height data for the asset
 */
function VariableHeightLoad({ maxHeight, minHeight, slider, getHeight, setHeight, dialogPrefix }) {
	DialogExtendedMessage = DialogFindPlayer(dialogPrefix.header);

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
		heightSlider.addEventListener("input", (e) => changeHeight(Number(/** @type {HTMLInputElement} */ (e.target).value), VariableHeightSliderId));
	}
	const heightNumber = ElementCreateInput(VariableHeightNumerId, "number", String(Math.round(currentHeight * 100)), "");
	if (heightNumber) {
		heightNumber.setAttribute("min", "0");
		heightNumber.setAttribute("max", "100");
		heightNumber.addEventListener("change", (e) => changeHeight(Number(/** @type {HTMLInputElement} */ (e.target).value) / 100, VariableHeightNumerId));
	}
}

/**
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightDraw({ slider }) {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");

	ElementPosition(VariableHeightSliderId, 1140, slider.Top + slider.Height / 2, 100, slider.Height);

	DrawTextFit(DialogFindPlayer("VariableHeightPercent"), 1405, 555, 250, "white", "gray");
	ElementPosition(VariableHeightNumerId, 1640, 550, 175);

	DrawButton(1350, 700, 300, 64, DialogFind(Player, "VariableHeightConfirm"), "White", "");
}

/**
 * @param {VariableHeightData} data - The variable height data for the asset
 * @returns {void} - Nothing
 */
function VariableHeightClick(data) {
	// Exit the screen
	if (MouseIn(1885, 25, 90, 90)) {
		VariableHeightExit();
		if (!data.parentOptions) {
			DialogFocusItem = null;
		}
	}

	// Confirm button
	if (MouseIn(1350, 700, 300, 64)) {
		const C = CharacterGetCurrent();
		if (VariableHeightPreviousProperty) {
			VariableHeightPreviousProperty.Revert = false;
		}
		if (data.parentOptions) {
			let option = Object.assign({}, data.parentOptions.find(o => o.Property.Type == DialogFocusItem.Property.Type));
			option.Property = /** @type {typeof option.Property} */(DialogFocusItem.Property);
			TypedItemSetType(C, data.parentOptions, option);
		} else {
			if (CurrentScreen == "ChatRoom") {
				/** @type {Parameters<ExtendedItemCallbacks.PublishAction<VariableHeightOption>>} */
				const args = [
					C,
					DialogFocusItem,
					{ OptionType: "VariableHeightOption", Name: "newOption", Property: DialogFocusItem.Property },
					{ OptionType: "VariableHeightOption", Name: "previousOption", Property: VariableHeightPreviousProperty },
				];
				CommonCallFunctionByNameWarn(`${data.functionPrefix}PublishAction`, ...args);
			}
		}
	}
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
 * @param {VariableHeightData} data
 * @param {Character} C
 * @param {Item} item
 * @param {VariableHeightOption} newOption
 * @param {VariableHeightOption} previousOption
 */
function VariableHeightPublishAction(data, C, item, newOption, previousOption) {
	const chatData = {
		C,
		previousOption,
		newOption,
		previousIndex: -1,
		newIndex: -1,
	};
	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data);

	const newHeight = data.getHeight(newOption.Property);
	const prevHeight = data.getHeight(previousOption.Property);
	const msgType = prevHeight !== null && previousOption.Property.Type == newOption.Property.Type
		? prevHeight < newHeight ? "Raise" : "Lower"
		: "";
	let msg = (typeof data.dialogPrefix.chat === "function") ? data.dialogPrefix.chat(chatData) : data.dialogPrefix.chat;
	msg += msgType;
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
 * @param {VariableHeightData} Data
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {boolean} Refresh -  Whether the character and relevant item should be refreshed and pushed to the server
 * @returns {boolean} Whether properties were initialized or not
 */
function VariableHeightInit(Data, C, Item, Refresh) {
	// Get the item/option's current height setting, initialising it if not set or invalid
	let currentHeight = Item.Property && Item.Property.Type == Data.baselineProperty.Type ? Data.getHeight(Item.Property) : null;
	if (typeof currentHeight === "number") {
		return false;
	}

	const lockProperties = Item.Property ? InventoryExtractLockProperties(Item.Property) : undefined;
	Item.Property = Object.assign(JSON.parse(JSON.stringify(Data.baselineProperty)), lockProperties);

	if (Item.Property.LockedBy && !(Item.Property.Effect || []).includes("Lock")) {
		Item.Property.Effect = (Item.Property.Effect || []);
		Item.Property.Effect.push("Lock");
	}

	currentHeight = Data.getHeight(Item.Property);
	Data.setHeight(Item.Property, currentHeight, Data.maxHeight, Data.minHeight);
	if (Refresh) {
		// Reload to see the change
		CharacterRefresh(C, false, false);
	}
	return true;
}
