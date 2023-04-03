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
		/** @type {ExtendedItemCallbackStruct<ExtendedItemOption>} */
		const defaultCallbacks = {
			load: () => ExtendedItemLoad(data.dialogPrefix.header),
			click: () => ExtendedItemClick(data.options, null, data.drawImages),
			draw: () => ExtendedItemDraw(data.options, data.dialogPrefix.option, null, data.drawImages),
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
	TypedItemRegisterSubscreens(asset, config);
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
	for (const option of Options) {
		option.OptionType = "ExtendedItemOption";
	}

	DialogPrefix = DialogPrefix || {};
	const key = `${asset.Group.Name}${asset.Name}`;
	return TypedItemDataLookup[key] = {
		asset,
		options: Options,
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
		scriptHooks: {
			load: ScriptHooks ? ScriptHooks.Load : undefined,
			click: ScriptHooks ? ScriptHooks.Click : undefined,
			draw: ScriptHooks ? ScriptHooks.Draw : undefined,
			exit: ScriptHooks ? ScriptHooks.Exit : undefined,
			validate: ScriptHooks ? ScriptHooks.Validate : undefined,
			publishAction: ScriptHooks ? ScriptHooks.PublishAction : undefined,
			init: ScriptHooks ? ScriptHooks.Init : undefined,
		},
		dictionary: Dictionary || [],
		chatSetting: ChatSetting || TypedItemChatSetting.TO_ONLY,
		drawImages: typeof DrawImages === "boolean" ? DrawImages : true,
		baselineProperty: typeof BaselineProperty === "object" ? BaselineProperty : null,
	};
}

/**
 *
 * @param {TypedItemData} data
 * @param {Character} C
 * @param {Item} item
 * @param {ExtendedItemOption} newOption
 * @param {ExtendedItemOption} previousOption
 */
function TypedItemPublishAction(data, C, item, newOption, previousOption) {
	/** @type ExtendedItemChatData<ExtendedItemOption> */
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
	ChatRoomPublishCustomAction(msg, true, dictionary);
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
 * @param {TypedItemConfig} config - The parent item's typed item configuration
 */
function TypedItemRegisterSubscreens(asset, config) {
	return config.Options
		.filter(option => option.Archetype !== undefined)
		.forEach((option, i, options) => {
			switch (option.Archetype) {
				case ExtendedArchetype.VARIABLEHEIGHT:
					VariableHeightRegister(asset, /** @type {VariableHeightConfig} */(option.ArchetypeConfig), option.Property, options);
					break;
			}
		});
}

/**
 * Returns the options configuration array for a typed item
 * @param {AssetGroupName} groupName - The name of the asset group
 * @param {string} assetName - The name of the asset
 * @returns {ExtendedItemOption[]|null} - The options array for the item, or null if no typed item data was found
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
 * @returns {ExtendedItemOption|null} - The named option configuration object, or null if none was found
 */
function TypedItemGetOption(groupName, assetName, optionName) {
	const options = TypedItemGetOptions(groupName, assetName);
	return options ? options.find(option => option.Name === optionName) : null;
}

/**
 * Validates a selected option. A typed item may provide a custom validation function. Returning a non-empty string from
 * the validation function indicates that the new option is not compatible with the character's current state (generally
 * due to prerequisites or other requirements).
 * @template {ExtendedItemOption | VibratingItemOption | ModularItemOption} T
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
		case "VibratingItemOption":
		case "ExtendedItemOption":
		default: {
			const typeField = (option.OptionType === "VibratingItemOption") ? "Mode" : "Type";
			PermissionFailure = option.Property && option.Property[typeField] && InventoryBlockedOrLimited(C, item, option.Property[typeField]);
			break;
		}
	}
	if (PermissionFailure) {
		return DialogFindPlayer("ExtendedItemNoItemPermission");
	}

	const validationFunctionName = `${ExtendedItemFunctionPrefix(item)}Validate`;
	const validationMessage = CommonCallFunctionByName(validationFunctionName, C, item, option, previousOption);
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
 * @template {ExtendedItemOption | VibratingItemOption} T
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
 * @template {ExtendedItemOption | VibratingItemOption} T
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

	/** @type {ExtendedItemOption[]} */
	const allOptions = TypedItemGetOptions(item.Asset.Group.Name, item.Asset.Name);
	// Avoid blocked & non-random options
	const availableOptions = allOptions
		.filter(o => o.Random !== false && !InventoryBlockedOrLimited(C, item, o.Property.Type));

	/** @type {ExtendedItemOption} */
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
