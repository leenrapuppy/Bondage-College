"use strict";

/**
 * TypedItem.js
 * ------------
 * This file contains utilities related to typed extended items (items that allow switching between a selection of
 * different states). It is generally not necessary to call functions in this file directly - these are called from
 * Asset.js when an item is first registered.
 *
 * All dialogue for typed items should be added to `Dialog_Player.csv`. To implement a typed item, you need the
 * following dialogue entries (these dialogue keys can also be configured through the item's configuration if custom
 * dialogue keys are needed):
 *  * "<GroupName><AssetName>Select" - This is the text that will be displayed at the top of the extended item screen
 *    (usually a prompt for the player to select a type)
 *  * For each type:
 *    * "<GroupName><AssetName><TypeName>" - This is the display name for the given type
 *  * If the item's chat setting is configured to `TO_ONLY`, you will need a chatroom message for each type, which will
 *    be sent when that type is selected. It should have the format "<GroupName><AssetName>Set<TypeName>" (e.g.
 *    "ItemArmsLatexBoxtieLeotardSetPolished" - "SourceCharacter polishes the latex of DestinationCharacter leotard
 *    until it's shiny")
 *  * If the item's chat setting is configured to `FROM_TO`, you will need a chatroom message for each possible type
 *    pairing, which will be sent when the item's type changes from the first type to the second type. It should have
 *    the format "<GroupName><AssetName>Set<Type1>To<Type2>".
 */

/**
 * A lookup for the typed item configurations for each registered typed item
 * @const
 * @type {Record<string, TypedItemData>}
 * @see {@link TypedItemData}
 */
const TypedItemDataLookup = {};

/**
 * An enum encapsulating the possible chatroom message settings for typed items
 * - TO_ONLY - The item has one chatroom message per type (indicating that the type has been selected)
 * - FROM_TO - The item has a chatroom message for from/to type pairing
 * - SILENT - The item doesn't publish an action when a type is selected.
 * @type {Record<"TO_ONLY"|"FROM_TO"|"SILENT", TypedItemChatSetting>}
 */
const TypedItemChatSetting = {
	TO_ONLY: "toOnly",
	FROM_TO: "fromTo",
	SILENT: "silent",
};

/**
 * Registers a typed extended item. This automatically creates the item's load, draw and click functions. It will also
 * generate the asset's AllowType array.
 * @param {Asset} asset - The asset being registered
 * @param {TypedItemConfig | undefined} config - The item's typed item configuration
 * @returns {void} - Nothing
 */
function TypedItemRegister(asset, config) {
	const data = TypedItemCreateTypedItemData(asset, config);

	if (IsBrowser()) {
		/** @type {ExtendedItemCallbackStruct<TypedItemOption>} */
		const defaultCallbacks = {
			load: () => ExtendedItemLoad(data.dialogPrefix.header),
			click: () => TypedItemClick(data.options, null, data.drawImages),
			draw: () => TypedItemDraw(data.options, data.dialogPrefix.option, null, data.drawImages),
			validate: ExtendedItemValidate,
			publishAction: (...args) => TypedItemPublishAction(data, ...args),
			init: (...args) => TypedItemInit(data, ...args),
		};
		ExtendedItemCreateCallbacks(data, defaultCallbacks);
		ExtendedItemCreateNpcDialogFunction(data.asset, data.functionPrefix, data.dialogPrefix.npc);
	}

	TypedItemGenerateAllowType(data);
	TypedItemGenerateAllowEffect(data);
	TypedItemGenerateAllowBlock(data);
	TypedItemGenerateAllowHide(data);
	TypedItemGenerateAllowTint(data);
	TypedItemGenerateAllowLockType(data);
	TypedItemRegisterSubscreens(asset, data.options);
	asset.Extended = true;
}

/**
 * Generates an asset's typed item data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {TypedItemConfig} config - The item's extended item configuration
 * @returns {TypedItemData} - The generated typed item data for the asset
 */
function TypedItemCreateTypedItemData(asset, {
	Options,
	DialogPrefix,
	ChatTags,
	Dictionary,
	ChatSetting,
	DrawImages,
	ChangeWhenLocked,
	ScriptHooks,
	BaselineProperty=null,
}) {
	const optionsParsed = Options.map(o => {
		/** @type {TypedItemOption} */
		const ret = { ...o, OptionType: "TypedItemOption" };
		if (typeof ChangeWhenLocked === "boolean" && typeof ret.ChangeWhenLocked !== "boolean") {
			ret.ChangeWhenLocked = ChangeWhenLocked;
		}
		return ret;
	});

	DialogPrefix = DialogPrefix || {};
	const key = `${asset.Group.Name}${asset.Name}`;
	return TypedItemDataLookup[key] = {
		asset,
		options: optionsParsed,
		key,
		functionPrefix: `Inventory${key}`,
		dialogPrefix: {
			header: DialogPrefix.Header || `${key}Select`,
			option: DialogPrefix.Option || key,
			chat: DialogPrefix.Chat || `${key}Set`,
			npc: DialogPrefix.Npc || key,
		},
		chatTags: Array.isArray(ChatTags) ? ChatTags : [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
		],
		scriptHooks: ExtendedItemParseScriptHooks(ScriptHooks || {}),
		dictionary: Dictionary || [],
		chatSetting: ChatSetting || TypedItemChatSetting.TO_ONLY,
		drawImages: typeof DrawImages === "boolean" ? DrawImages : true,
		baselineProperty: typeof BaselineProperty === "object" ? BaselineProperty : null,
		parentOption: null,
	};
}

/**
 *
 * @param {TypedItemData} data
 * @param {Character} C
 * @param {Item} item
 * @param {TypedItemOption} newOption
 * @param {TypedItemOption} previousOption
 */
function TypedItemPublishAction(data, C, item, newOption, previousOption) {
	if (data.chatSetting === TypedItemChatSetting.SILENT) {
		return;
	}

	/** @type {ExtendedItemChatData<TypedItemOption>} */
	const chatData = {
		C,
		previousOption,
		newOption,
		previousIndex: data.options.indexOf(previousOption),
		newIndex: data.options.indexOf(newOption),
	};

	let msg = data.dialogPrefix.chat;
	if (typeof msg === "function") {
		msg = msg(chatData);
	}

	if (data.chatSetting === TypedItemChatSetting.FROM_TO) msg += `${previousOption.Name}To`;
	msg += newOption.Name;

	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data);
	ChatRoomPublishCustomAction(msg, true, dictionary.build());
}

/**
 * Generates an asset's AllowType property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowType({ asset, options }) {
	asset.AllowType = options
		.map((option) => option.Property.Type)
		.filter(Boolean);
}

/**
 * Generates an asset's AllowEffect property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowEffect({asset, options}) {
	asset.AllowEffect = Array.isArray(asset.Effect) ? asset.Effect.slice() : [];
	for (const option of options) {
		// @ts-ignore: ignore `readonly` while still building the asset
		CommonArrayConcatDedupe(asset.AllowEffect, option.Property.Effect);
	}
}

/**
 * Generates an asset's AllowBlock property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowBlock({asset, options}) {
	asset.AllowBlock = Array.isArray(asset.Block) ? asset.Block.slice() : [];
	for (const option of options) {
		// @ts-ignore: ignore `readonly` while still building the asset
		CommonArrayConcatDedupe(asset.AllowBlock, option.Property.Block);
	}
}

/**
 * Generates an asset's AllowHide & AllowHideItem properties based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowHide({asset, options}) {
	asset.AllowHide = Array.isArray(asset.Hide) ? asset.Hide.slice() : [];
	asset.AllowHideItem = Array.isArray(asset.HideItem) ? asset.HideItem.slice() : [];
	for (const option of options) {
		// @ts-ignore: ignore `readonly` while still building the asset
		CommonArrayConcatDedupe(asset.AllowHide, option.Property.Hide);
		// @ts-ignore: ignore `readonly` while still building the asset
		CommonArrayConcatDedupe(asset.AllowHideItem, option.Property.HideItem);
	}
}

/**
 * Generates an asset's AllowTint property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowTint({asset, options}) {
	if (asset.AllowTint) {
		return;
	}
	for (const option of options) {
		if (option.Property && Array.isArray(option.Property.Tint) && option.Property.Tint.length > 0) {
			asset.AllowTint = true;
			return;
		}
	}
}

/**
 * Generates an asset's AllowLockType property based on its typed item data.
 * @param {TypedItemData} data - The typed item's data
 * @returns {void} - Nothing
 */
function TypedItemGenerateAllowLockType({asset, options}) {
	const allowLockType = [];
	for (const option of options) {
		const type = option.Property && option.Property.Type;
		const allowLock = typeof option.AllowLock === "boolean" ? option.AllowLock : asset.AllowLock;
		if (allowLock) {
			// "" is used to represent the null type in AllowLockType arrays
			allowLockType.push(type != null ? type : "");
		}
	}
	TypedItemSetAllowLockType(asset, allowLockType, options.length);
}

/**
 * Sets the AllowLock and AllowLockType properties on an asset based on an AllowLockType array and the total number of
 * possible types.
 * @param {Asset} asset - The asset to set properties on
 * @param {readonly string[]} allowLockType - The AllowLockType array indicating which of the asset's types permit locks
 * @param {number} typeCount - The total number of types available on the asset
 * @returns {void} - Nothing
 */
function TypedItemSetAllowLockType(asset, allowLockType, typeCount) {
	if (allowLockType.length === 0) {
		// If no types are allowed to lock, set AllowLock to false for quick checking
		asset.AllowLock = false;
		asset.AllowLockType = null;
	} else if (allowLockType.length === typeCount) {
		// If all types are allowed to lock, set AllowLock to true for quick checking
		asset.AllowLock = true;
		asset.AllowLockType = null;
	} else {
		// If it's somewhere in between, set an explicit AllowLockType array
		asset.AllowLockType = allowLockType;
	}
}

/**
 * @param {Asset} asset - The asset whose subscreen is being registered
 * @param {readonly TypedItemOption[]} options - The parent item's typed item data
 */
function TypedItemRegisterSubscreens(asset, options) {
	for (const option of options) {
		switch (option.Archetype) {
			case ExtendedArchetype.VARIABLEHEIGHT:
				VariableHeightRegister(asset, /** @type {VariableHeightConfig} */(option.ArchetypeConfig), option);
				break;
			case ExtendedArchetype.VIBRATING:
				VibratorModeRegister(asset, /** @type {VibratingItemConfig} */(option.ArchetypeConfig), option);
				break;
		}
	}
}

/**
 * Returns the options configuration array for a typed item
 * @param {AssetGroupName} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @returns {TypedItemOption[]|null} - The options array for the item, or null if no typed item data was found
 */
function TypedItemGetOptions(groupName, assetName) {
	const data = TypedItemDataLookup[`${groupName}${assetName}`];
	return data ? data.options : null;
}

/**
 * Returns a list of typed item option names available for the given asset, or an empty array if the asset is not typed
 * @param {AssetGroupName} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @returns {string[]} - The option names available for the asset, or an empty array if the asset is not typed or no
 * typed item data was found
 */
function TypedItemGetOptionNames(groupName, assetName) {
	const options = TypedItemGetOptions(groupName, assetName);
	return options ? options.map(option => option.Name) : [];
}

/**
 * Returns the named option configuration object for a typed item
 * @param {AssetGroupName} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @param {string} optionName - The name of the option
 * @returns {TypedItemOption|null} - The named option configuration object, or null if none was found
 */
function TypedItemGetOption(groupName, assetName, optionName) {
	const options = TypedItemGetOptions(groupName, assetName);
	return options ? options.find(option => option.Name === optionName) : null;
}

/**
 * Validates a selected option. A typed item may provide a custom validation function. Returning a non-empty string from
 * the validation function indicates that the new option is not compatible with the character's current state (generally
 * due to prerequisites or other requirements).
 * @template {ExtendedItemOption} T
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} item - The item whose options are being validated
 * @param {T} option - The new option
 * @param {T} previousOption - The previously applied option
 * @returns {string|undefined} - undefined or an empty string if the validation passes. Otherwise, returns a string
 * message informing the player of the requirements that are not met.
 */
function TypedItemValidateOption(C, item, option, previousOption) {
	let PermissionFailure = false;
	switch (option.OptionType) {
		case "ModularItemOption":
			PermissionFailure = !option.Name.includes("0") && InventoryBlockedOrLimited(C, item, option.Name);
			break;
		case "TypedItemOption":
			PermissionFailure = option.Property && option.Property.Type && InventoryBlockedOrLimited(C, item, option.Property.Type);
			break;
		case "VibratingItemOption":
		case "ExtendedItemOption":
			PermissionFailure = InventoryBlockedOrLimited(C, item, option.Name);
			break;
		default:
			console.error(`Unsupported extended item option type: ${option.OptionType}`);
			return "";
	}
	if (PermissionFailure) {
		return DialogFindPlayer("ExtendedItemNoItemPermission");
	}

	const validationFunctionName = `${ExtendedItemFunctionPrefix(item)}${ExtendedItemSubscreen || ""}Validate`;
	/** @type {Parameters<ExtendedItemCallbacks.Validate<T>>} */
	const args = [C, item, option, previousOption];
	const validationMessage = CommonCallFunctionByName(validationFunctionName, ...args);
	if (typeof validationMessage === "string") {
		return validationMessage;
	} else {
		return ExtendedItemValidate(C, item, option, previousOption);
	}
}

/**
 * Sets a typed item's type and properties to the option whose name matches the provided option name parameter.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item | AssetGroupName} itemOrGroupName - The item whose type to set, or the group name for the item
 * @param {string} optionName - The name of the option to set
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function TypedItemSetOptionByName(C, itemOrGroupName, optionName, push = false) {
	const item = typeof itemOrGroupName === "string" ? InventoryGet(C, itemOrGroupName) : itemOrGroupName;

	if (!item) return;

	const assetName = item.Asset.Name;
	const groupName = item.Asset.Group.Name;
	const warningMessage = `Cannot set option for ${groupName}:${assetName} to ${optionName}`;

	if (item.Asset.Archetype !== ExtendedArchetype.TYPED) {
		const msg = `${warningMessage}: item does not use the typed archetype`;
		console.warn(msg);
		return msg;
	}

	const options = TypedItemGetOptions(groupName, assetName);
	const option = options.find(o => o.Name === optionName);

	if (!option) {
		const msg = `${warningMessage}: option "${optionName}" does not exist`;
		console.warn(msg);
		return msg;
	}

	return TypedItemSetOption(C, item, options, option, push);
}

/**
 * Sets a typed item's type and properties to the option provided.
 * @template {TypedItemOption | VibratingItemOption} T
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} item - The item whose type to set
 * @param {readonly T[]} options - The typed item options for the item
 * @param {T} option - The option to set
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function TypedItemSetOption(C, item, options, option, push = false) {
	if (!item || !options || !option) return;

	/** @type {ItemProperties} */
	const newProperty = JSON.parse(JSON.stringify(option.Property));
	const typeField = (option.OptionType === "VibratingItemOption") ? "Mode" : "Type";
	const previousOption = TypedItemFindPreviousOption(item, options, typeField);

	const requirementMessage = TypedItemValidateOption(C, item, option, previousOption);
	if (requirementMessage) {
		return requirementMessage;
	}

	ExtendedItemSetOption(C, item, previousOption.Property, newProperty, push, option.DynamicProperty);
}

/**
 * Finds the currently set option on the given typed item
 * @template {TypedItemOption | VibratingItemOption} T
 * @param {Item} item - The equipped item
 * @param {readonly T[]} options - The list of available options for the item
 * @param {"Type" | "Mode"} typeField - The name of the item property field containing the item's type (or equivalent thereof)
 * @returns {T} - The option which is currently applied to the item, or the first item in the options
 * array if no type is set.
 */
function TypedItemFindPreviousOption(item, options, typeField="Type") {
	const previousProperty = item.Property || options[0].Property;
	const previousType = previousProperty[typeField];
	return options.find(o => o.Property[typeField] === previousType) || options[0];
}

/**
 * Sets a typed item's type to a random option, respecting prerequisites and option validation.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item | AssetGroupName} itemOrGroupName - The item whose type to set, or the group name for the item
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function TypedItemSetRandomOption(C, itemOrGroupName, push = false) {
	const item = typeof itemOrGroupName === "string" ? InventoryGet(C, itemOrGroupName) : itemOrGroupName;

	if (!item || item.Asset.Archetype !== ExtendedArchetype.TYPED) {
		console.warn("Cannot set random option: item does not exist or does not use the typed archetype");
		return;
	}

	const allOptions = TypedItemGetOptions(item.Asset.Group.Name, item.Asset.Name);
	// Avoid blocked & non-random options
	const availableOptions = allOptions
		.filter(o => o.Random !== false && !InventoryBlockedOrLimited(C, item, o.Property.Type));

	/** @type {TypedItemOption} */
	let option;
	if (availableOptions.length === 0) {
		// If no options are available, use the null type
		option = allOptions.find(O => O.Property.Type == null);
	} else {
		option = CommonRandomItemFromList(null, availableOptions);
	}
	return TypedItemSetOption(C, item, availableOptions, option, push);
}

/**
 * Initialize the typed item properties
 * @param {TypedItemData} Data - The item's extended item data
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {boolean} Refresh - Whether the character and relevant item should be refreshed and pushed to the server
 * @returns {boolean} Whether properties were initialized or not
 */
function TypedItemInit(Data, C, Item, Refresh=true) {
	const AllowType = [null, ...Item.Asset.AllowType];
	if (CommonIsObject(Item.Property) && CommonIncludes(AllowType, Item.Property.Type)) {
		return false;
	}

	// Default to the first option if no property is set
	let InitialProperty = Data.options[0].Property;
	Item.Property = JSON.parse(JSON.stringify(Data.options[0].Property));

	// If the default type is not the null type, check whether the default type is blocked
	if (InitialProperty && InitialProperty.Type && InventoryBlockedOrLimited(C, Item, InitialProperty.Type)) {
		// If the first option is blocked by the character, switch to the null type option
		const InitialOption = Data.options.find(O => O.Property.Type == null);
		if (InitialOption) InitialProperty = InitialOption.Property;
	}

	// If there is an initial and/or baseline property, set it and update the character
	if (InitialProperty || Data.baselineProperty) {
		Item.Property = (Data.baselineProperty != null) ? JSON.parse(JSON.stringify(Data.baselineProperty)) : {};
		Item.Property = Object.assign(
			Item.Property,
			(InitialProperty != null) ? JSON.parse(JSON.stringify(InitialProperty)) : {},
		);
	}

	if (Refresh) {
		CharacterRefresh(C, true, false);
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}
	return true;
}

/**
 * Draws the extended item type selection screen
 * @param {readonly (TypedItemOption | VibratingItemOption)[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {string} DialogPrefix - The prefix to the dialog keys for the display strings describing each extended type.
 *     The full dialog key will be <Prefix><Option.Name>
 * @param {number} [OptionsPerPage] - The number of options displayed on each page
 * @param {boolean} [ShowImages=true] - Denotes whether images should be shown for the specific item
 * @param {readonly [number, number][]} [XYPositions] - An array with custom X & Y coordinates of the buttons
 * @param {boolean} IgnoreSubscreen - Whether loading subscreen draw functions should be ignored.
 * Should be set to `true` to avoid infinite recursions if the the subscreen also calls this function.
 * @returns {void} Nothing
 */
function TypedItemDraw(Options, DialogPrefix, OptionsPerPage, ShowImages=true, XYPositions=null, IgnoreSubscreen=false) {
	// If an option's subscreen is open, it overrides the standard screen
	if (ExtendedItemSubscreen && !IgnoreSubscreen) {
		CommonCallFunctionByNameWarn(`${ExtendedItemFunctionPrefix()}${ExtendedItemSubscreen}Draw`);
		return;
	}

	const Asset = DialogFocusItem.Asset;
	const ItemOptionsOffset = ExtendedItemGetOffset();
	if (XYPositions === null) {
		const XYPositionsArray = ExtendedItemGetXY(Asset, ShowImages);
		OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositionsArray.length - 1);
		XYPositions = XYPositionsArray[OptionsPerPage];
	} else {
		OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositions.length - 1);
	}

	// If we have to paginate, draw the back/next button
	if (Options.length > OptionsPerPage) {
		const currPage = Math.ceil(ExtendedItemGetOffset() / OptionsPerPage) + 1;
		const totalPages = Math.ceil(Options.length / OptionsPerPage);
		DrawBackNextButton(1675, 240, 300, 90, DialogFindPlayer("Page") + " " + currPage.toString() + " / " + totalPages.toString(), "White", "", () => "", () => "");
	}

	// Draw the header and item
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");

	const isVibe = (Options.length && Options[0].OptionType === "VibratingItemOption");
	const typeField = isVibe ? "Mode" : "Type";
	const CurrentOption = Options.find(O => (isVibe ? O.Name : O.Property[typeField]) === DialogFocusItem.Property[typeField]);

	// Draw the possible variants and their requirements, arranged based on the number per page
	for (let I = ItemOptionsOffset; I < Options.length && I < ItemOptionsOffset + OptionsPerPage; I++) {
		const PageOffset = I - ItemOptionsOffset;
		const X = XYPositions[PageOffset][0];
		const Y = XYPositions[PageOffset][1];
		ExtendedItemDrawButton(Options[I], CurrentOption, DialogPrefix, X, Y, ShowImages);
	}

	// Permission mode toggle
	DrawButton(1775, 25, 90, 90, "", "White",
		ExtendedItemPermissionMode ? "Icons/DialogNormalMode.png" : "Icons/DialogPermissionMode.png",
		DialogFindPlayer(ExtendedItemPermissionMode ? "DialogNormalMode" : "DialogPermissionMode"));

	// If the assets allows tightening / loosening
	if (Asset.AllowTighten && !InventoryItemHasEffect(DialogFocusItem, "Lock")) {
		let Difficulty = DialogFocusItem.Difficulty;
		if (Difficulty == null) Difficulty = 0;
		DrawText(DialogFindPlayer("Tightness") + " " + Difficulty.toString(), 1200, 140, "White", "Silver");
		DrawButton(1050, 220, 300, 65, DialogFindPlayer("AdjustTightness"), "White");
	}
}

/**
 * Handles clicks on the extended item type selection screen
 * @param {readonly (TypedItemOption | VibratingItemOption)[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {number} [OptionsPerPage] - The number of options displayed on each page
 * @param {boolean} [ShowImages=true] - Denotes whether images are shown for the specific item
 * @param {[number, number][]} [XYPositions] - An array with custom X & Y coordinates of the buttons
 * @param {boolean} IgnoreSubscreen - Whether loading subscreen draw functions should be ignored.
 * Should be set to `true` to avoid infinite recursions if the the subscreen also calls this function.
 * @returns {void} Nothing
 */
function TypedItemClick(Options, OptionsPerPage, ShowImages=true, XYPositions=null, IgnoreSubscreen=false) {
	const C = CharacterGetCurrent();

	// If an option's subscreen is open, pass the click into it
	if (ExtendedItemSubscreen && !IgnoreSubscreen) {
		CommonCallFunctionByNameWarn(`${ExtendedItemFunctionPrefix()}${ExtendedItemSubscreen}Click`);
		return;
	}

	const ItemOptionsOffset = ExtendedItemGetOffset();
	const ImageHeight = ShowImages ? 220 : 0;
	if (XYPositions === null) {
		const XYPositionsArray = ExtendedItemGetXY(DialogFocusItem.Asset, ShowImages);
		OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositionsArray.length - 1);
		XYPositions = XYPositionsArray[OptionsPerPage];
	} else {
		OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositions.length - 1);
	}

	// Exit button
	if (MouseIn(1885, 25, 90, 90)) {
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		if (ExtendedItemSubscreen) {
			CommonCallFunctionByName(`${ExtendedItemFunctionPrefix()}${ExtendedItemSubscreen}Exit`);
			ExtendedItemSubscreen = null;
		} else {
			ExtendedItemExit();
		}
		return;
	}

	// Permission toggle button
	if (MouseIn(1775, 25, 90, 90)) {
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") {
			ChatRoomCharacterUpdate(Player);
			ExtendedItemRequirementCheckMessageMemo.clearCache();
		}
		ExtendedItemPermissionMode = !ExtendedItemPermissionMode;
	}

	// Pagination buttons
	if (MouseIn(1675, 240, 150, 90) && Options.length > OptionsPerPage) {
		if (ItemOptionsOffset - OptionsPerPage < 0) ExtendedItemSetOffset(OptionsPerPage * (Math.ceil(Options.length / OptionsPerPage) - 1));
		else ExtendedItemSetOffset(ItemOptionsOffset - OptionsPerPage);
	}
	else if (MouseIn(1825, 240, 150, 90) && Options.length > OptionsPerPage) {
		if (ItemOptionsOffset + OptionsPerPage >= Options.length) ExtendedItemSetOffset(0);
		else ExtendedItemSetOffset(ItemOptionsOffset + OptionsPerPage);
	}

	// Options
	for (let I = ItemOptionsOffset; I < Options.length && I < ItemOptionsOffset + OptionsPerPage; I++) {
		const PageOffset = I - ItemOptionsOffset;
		const X = XYPositions[PageOffset][0];
		const Y = XYPositions[PageOffset][1];
		const Option = Options[I];
		if (MouseIn(X, Y, 225, 55 + ImageHeight)) {
			TypedItemHandleOptionClick(C, Options, Option);
		}
	}

	// If the assets allows tightening / loosening
	if ((DialogFocusItem != null) && (DialogFocusItem.Asset != null) && DialogFocusItem.Asset.AllowTighten && !InventoryItemHasEffect(DialogFocusItem, "Lock") && MouseIn(1050, 220, 300, 65)) {
		DialogTightenLoosenItem = DialogFocusItem;
		TightenLoosenItemLoad();
	}
}

/**
 * Handler function called when an option on the type selection screen is clicked
 * @template {TypedItemOption | VibratingItemOption} T
 * @param {Character} C - The character wearing the item
 * @param {readonly (T)[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {T} Option - The selected type definition
 * @returns {void} Nothing
 */
function TypedItemHandleOptionClick(C, Options, Option) {
	const IsVibeArch = Option.OptionType === "VibratingItemOption";
	const typeField = IsVibeArch ? "Mode" : "Type";
	if (ExtendedItemPermissionMode) {
		const IsFirst = IsVibeArch ? Option.Property.Mode == VibratorModeOff.Property.Mode : Option.Property.Type == null;
		const Worn = C.IsPlayer() && DialogFocusItem.Property[typeField] == Option.Property[typeField];
		InventoryTogglePermission(DialogFocusItem, Option.Property[typeField], Worn || IsFirst);
	} else {
		if (DialogFocusItem.Property[typeField] === Option.Property[typeField] && !Option.HasSubscreen) {
			return;
		}

		const CurrentType = DialogFocusItem.Property[typeField] || (IsVibeArch ? VibratorModeOff.Property.Mode : null);
		const CurrentOption = Options.find(O => O.Property[typeField] === CurrentType);
		// use the unmemoized function to ensure we make a final check to the requirements
		const RequirementMessage = ExtendedItemRequirementCheckMessage(DialogFocusItem, C, Option, CurrentOption);
		if (RequirementMessage) {
			DialogExtendedMessage = RequirementMessage;
		} else if (Option.HasSubscreen) {
			ExtendedItemSubscreen = Option.Name;
			if (Option.Archetype) {
				/** @type {Parameters<ExtendedItemCallbacks.Init>} */
				const args = [C, DialogFocusItem, true];
				CommonCallFunctionByNameWarn(`${ExtendedItemFunctionPrefix()}${ExtendedItemSubscreen}Init`, ...args);
			}
			CommonCallFunctionByNameWarn(ExtendedItemFunctionPrefix() + ExtendedItemSubscreen + "Load", C, Option);
		} else {
			TypedItemSetType(C, Options, Option);
		}
	}
}

/**
 * Handler function for setting the type of an typed item
 * @template {TypedItemOption | VibratingItemOption} T
 * @param {Character} C - The character wearing the item
 * @param {readonly T[]} Options - An Array of type definitions for each allowed extended type. The first item
 *     in the array should be the default option.
 * @param {T} Option - The selected type definition
 * @returns {void} Nothing
 */
function TypedItemSetType(C, Options, Option) {
	const typeField = (Option.OptionType === "VibratingItemOption") ? "Mode" : "Type";
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
	const FunctionPrefix = ExtendedItemFunctionPrefix() + (ExtendedItemSubscreen || "");
	const IsCloth = DialogFocusItem.Asset.Group.Clothing;
	const previousOption = TypedItemFindPreviousOption(DialogFocusItem, Options, typeField);

	TypedItemSetOption(C, DialogFocusItem, Options, Option, !IsCloth); // Do not sync appearance while in the wardrobe

	// For a restraint, we might publish an action, change the expression or change the dialog of a NPC
	if (!IsCloth) {
		// If the item triggers an expression, start the expression change
		if (Option.Expression) {
			InventoryExpressionTriggerApply(C, Option.Expression);
		}
		ChatRoomCharacterUpdate(C);
		if (CurrentScreen === "ChatRoom") {
			// If we're in a chatroom, call the item's publish function to publish a message to the chatroom
			/** @type {Parameters<ExtendedItemCallbacks.PublishAction<T>>} */
			const args = [C, DialogFocusItem, Option, previousOption];
			CommonCallFunctionByName(FunctionPrefix + "PublishAction", ...args);
		} else {
			ExtendedItemExit();
			if (C.ID === 0) {
				// Player is using the item on herself
				DialogMenuButtonBuild(C);
			} else {
				// Otherwise, call the item's NPC dialog function, if one exists
				CommonCallFunctionByName(FunctionPrefix + "NpcDialog", C, Option, previousOption);
				C.FocusGroup = null;
			}
		}
	}
}
