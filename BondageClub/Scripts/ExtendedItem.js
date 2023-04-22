"use strict";
/**
 * Utility file for handling extended items
 */

/**
 * A lookup for the current pagination offset for all extended item options. Offsets are only recorded if the extended
 * item requires pagination. Example format:
 * ```json
 * {
 *     "ItemArms/HempRope": 4,
 *     "ItemArms/Web": 0
 * }
 * ```
 * @type {Record<string, number>}
 * @constant
 */
var ExtendedItemOffsets = {};

/**
 * The X & Y co-ordinates of each option's button, based on the number to be displayed per page.
 * @type {[number, number][][]}
 */
const ExtendedXY = [
	[], //0 placeholder
	[[1385, 500]], //1 option per page
	[[1185, 500], [1590, 500]], //2 options per page
	[[1080, 500], [1385, 500], [1695, 500]], //3 options per page
	[[1185, 400], [1590, 400], [1185, 700], [1590, 700]], //4 options per page
	[[1080, 400], [1385, 400], [1695, 400], [1185, 700], [1590, 700]], //5 options per page
	[[1080, 400], [1385, 400], [1695, 400], [1080, 700], [1385, 700], [1695, 700]], //6 options per page
	[[1020, 400], [1265, 400], [1510, 400], [1755, 400], [1080, 700], [1385, 700], [1695, 700]], //7 options per page
	[[1020, 400], [1265, 400], [1510, 400], [1755, 400], [1020, 700], [1265, 700], [1510, 700], [1755, 700]], //8 options per page
];

/**
 * The X & Y co-ordinates of each option's button, based on the number to be displayed per page.
 * @type {[number, number][][]}
 */
const ExtendedXYWithoutImages = [
	[], //0 placeholder
	[[1385, 450]], //1 option per page
	[[1260, 450], [1510, 450]], //2 options per page
	[[1135, 450], [1385, 450], [1635, 450]], //3 options per page
	[[1260, 450], [1510, 450], [1260, 525], [1510, 525]], //4 options per page
	[[1135, 450], [1385, 450], [1635, 450], [1260, 525], [1510, 525]], //5 options per page
	[[1135, 450], [1385, 450], [1635, 450], [1135, 525], [1385, 525], [1635, 525]], //6 options per page
	[[1010, 450], [1260, 450], [1510, 450], [1760, 450], [1135, 525], [1385, 525], [1635, 525]], //7 options per page
	[[1010, 450], [1260, 450], [1510, 450], [1760, 450], [1010, 525], [1260, 525], [1510, 525], [1760, 525]], //8 options per page
];

/**
 * The X & Y co-ordinates of each option's button, based on the number to be displayed per page.
 * @type {[number, number][][]}
 */
const ExtendedXYClothes = [
	[], //0 placeholder
	[[1385, 450]], //1 option per page
	[[1220, 450], [1550, 450]], //2 options per page
	[[1140, 450], [1385, 450], [1630, 450]], //3 options per page
	[[1220, 400], [1550, 400], [1220, 700], [1550, 700]], //4 options per page
	[[1140, 400], [1385, 400], [1630, 400], [1220, 700], [1550, 700]], //5 options per page
	[[1140, 400], [1385, 400], [1630, 400], [1140, 700], [1385, 700], [1630, 700]], //6 options per page
];

/** Memoization of the requirements check */
const ExtendedItemRequirementCheckMessageMemo = CommonMemoize(ExtendedItemRequirementCheckMessage, [
	(item) => `${item.Asset.Group.Name}${item.Asset.Name}`,
	(character) => character.ID.toString(),
	(option) => option.Name,
	(option) => option.Name,
]);

/**
 * The current display mode
 * @type {boolean}
 */
var ExtendedItemPermissionMode = false;

/**
 * Tracks whether a selected option's subscreen is active - if active, the value is the name of the current subscreen's
 * corresponding option
 * @type {string|null}
 */
var ExtendedItemSubscreen = null;

/**
 * Get an asset-appropriate array with button coordinates, based on the number to be displayed per page.
 * @param {Asset} Asset - The relevant asset
 * @param {boolean} ShowImages - Whether images should be shown or not.
 * Note that whether an asset is clothing-based or not takes priority over this option.
 * @returns {[number, number][][]} The coordinates array
 */
function ExtendedItemGetXY(Asset, ShowImages=true) {
	const IsCloth = Asset.Group.Clothing;
	return !IsCloth ? ShowImages ? ExtendedXY : ExtendedXYWithoutImages : ExtendedXYClothes;
}

/**
 * @template {any[]} T
 * @template RT
 * @param {ExtendedItemData<any>} data
 * @param {string} name
 * @param {null | ExtendedItemCallback<T, RT>} originalFunction
 */
function ExtendedItemCreateCallback(data, name, originalFunction) {
	const nameCaps = `${name[0].toUpperCase()}${name.slice(1)}`;
	const funcName = `${data.functionPrefix}${nameCaps}`;
	const scriptHook = /** @type {ExtendedItemScriptHookCallback<any, T, RT>} */(data.scriptHooks[name]);
	if (scriptHook != null) {
		/** @type {ExtendedItemCallback<T, RT>} */
		window[funcName] = (...args) => scriptHook(data, originalFunction, ...args);
	} else if (originalFunction != null) {
		window[funcName] = originalFunction;
	}
}

/**
 * Construct the extended item's archetypical callbacks and place them in the main namespace.
 * @template {ExtendedItemOption} T
 * @param {ExtendedItemData<T>} data - The extended item data
 * @param {ExtendedItemCallbackStruct<T>} defaults - The default archetypical callbacks
 */
function ExtendedItemCreateCallbacks(data, defaults) {
	/** @type {(keyof ExtendedItemCallbackStruct<T>)[]} */
	const ExtendedItemCreate = [
		"load",
		"click",
		"draw",
		"exit",
		"validate",
		"publishAction",
		"init",
	];

	const extraKeys = CommonKeys(defaults).filter(i => !ExtendedItemCreate.includes(i));
	if (extraKeys.length !== 0) {
		console.warn(`Found ${extraKeys.length} non-existent script hooks in the passed ${data.asset.Name} extended item data`);
	}

	ExtendedItemCreate.forEach(k => ExtendedItemCreateCallback(data, k, /** @type {ExtendedItemCallback<any[], any>} */(defaults[k])));
}

/**
 * Convert that passed extended item config script hooks into their item data counterpart.
 * @template {ExtendedItemData<any>} DataType
 * @template {ExtendedItemOption} OptionType
 * @param {ExtendedItemCapsScriptHooksStruct<DataType, OptionType>} scriptHooks - The extended item config script hooks
 * @returns {ExtendedItemScriptHookStruct<DataType, OptionType>} - The extended item data script hooks
 */
function ExtendedItemParseScriptHooks(scriptHooks) {
	return {
		load: typeof scriptHooks.Load === "function" ? scriptHooks.Load : null,
		click: typeof scriptHooks.Click === "function" ? scriptHooks.Click : null,
		draw: typeof scriptHooks.Draw === "function" ? scriptHooks.Draw : null,
		exit: typeof scriptHooks.Exit === "function" ? scriptHooks.Exit : null,
		validate: typeof scriptHooks.Validate === "function" ? scriptHooks.Validate : null,
		publishAction: typeof scriptHooks.PublishAction === "function" ? scriptHooks.PublishAction : null,
		init: typeof scriptHooks.Init === "function" ? scriptHooks.Init : null,
	};
}

/**
 * Initialize the extended item properties
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {boolean} Refresh - Whether the character and relevant item should be refreshed
 * @returns {boolean} Whether properties were updated or not
 */
function ExtendedItemInit(C, Item, Refresh=true) {
	if (Item == null || C == null || !Item.Asset.Extended) {
		return false;
	}

	const functionName = `Inventory${Item.Asset.Group.Name}${Item.Asset.Name}Init`;
	/** @type {Parameters<ExtendedItemCallbacks.Init>} */
	const args = [C, Item, Refresh];
	return CommonCallFunctionByNameWarn(functionName, ...args);
}

/**
 * Helper init function for extended items without an archetype.
 * Note that on the long term this function should ideally be removed in favor of adding appropriate archetypes.
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {ItemProperties} Properties - A record that maps property keys to their default value.
 *        The type of each value is used for basic validation.
 * @param {boolean} Refresh - Whether the character and relevant item should be refreshed
 * @returns {boolean} Whether properties were updated or not
 */
function ExtendedItemInitNoArch(C, Item, Properties, Refresh=true) {
	if (!CommonIsObject(Item.Property)) {
		Item.Property = {};
	}

	let Update = false;
	const PropertiesCopy = JSON.parse(JSON.stringify(Properties));
	for (const [name, value] of Object.entries(PropertiesCopy)) {
		if (Item.Property[name] == null) {
			Update = true;
			Item.Property[name] = value;
		}
	}

	if (Refresh) {
		CharacterRefresh(C, true);
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}
	return Update;
}

/**
 * Loads the item's extended item menu
 * @param {string} DialogKey - The dialog key for the message to display prompting the player to select an extended
 *     type
 * @param {boolean} IgnoreSubscreen - Whether loading subscreen draw functions should be ignored.
 * Should be set to `true` to avoid infinite recursions if the the subscreen also calls this function.
 * @returns {void} Nothing
 */
function ExtendedItemLoad(DialogKey, IgnoreSubscreen=false) {
	if (ExtendedItemSubscreen && !IgnoreSubscreen) {
		CommonCallFunctionByNameWarn(ExtendedItemFunctionPrefix() + ExtendedItemSubscreen + "Load");
		return;
	}

	if (ExtendedItemOffsets[ExtendedItemOffsetKey()] == null) ExtendedItemSetOffset(0);

	DialogExtendedMessage = DialogFindPlayer(DialogKey);
}

/**
 * Draw a single button in the extended item type selection screen.
 * @param {ExtendedItemOption | ModularItemModule} Option - The new extended item option
 * @param {ExtendedItemOption} CurrentOption - The current extended item option
 * @param {number} X - The X coordinate of the button
 * @param {number} Y - The Y coordinate of the button
 * @param {string} DialogPrefix - The prefix to the dialog keys for the display strings describing each extended type.
 *     The full dialog key will be <Prefix><Option.Name>
 * @param {boolean} ShowImages - Denotes whether images should be shown for the specific item
 * @param {Item} Item - The item in question; defaults to {@link DialogFocusItem}
 * @param {boolean | null} IsSelected - Whether the button is already selected or not. If `null` compute this value by checking if the item's current type matches `Option`.
 * @see {@link TypedItemDraw}
 */
function ExtendedItemDrawButton(Option, CurrentOption, DialogPrefix, X, Y, ShowImages=true, Item=DialogFocusItem, IsSelected=null) {
	/** @type {[null | string, string, boolean]} */
	let [Type, AssetSource, IsFavorite] = [null, null, false];
	const Asset = Item.Asset;
	const C = CharacterGetCurrent();
	const ImageHeight = ShowImages ? 220 : 0;
	const Hover = MouseIn(X, Y, 225, 55 + ImageHeight) && !CommonIsMobile;
	let Effect = null;

	switch (Option.OptionType) {
		case "ModularItemModule":
			AssetSource = `${AssetGetInventoryPath(Asset)}/${CurrentOption.Name}.png`;
			IsSelected = (IsSelected == null) ? false : IsSelected;
			break;
		case "ModularItemOption":
		case "VibratingItemOption":
		case "TypedItemOption":
		case "ExtendedItemOption": {
			Type = (Option.OptionType === "TypedItemOption") ? (Option.Property && Option.Property.Type) || null : Option.Name;
			Effect = Option.Property && Option.Property.Effect || null;
			IsFavorite = InventoryIsFavorite(ExtendedItemPermissionMode ? Player : C, Asset.Name, Asset.Group.Name, Type);
			AssetSource = `${AssetGetInventoryPath(Asset)}/${Option.Name}.png`;
			break;
		}
		default:
			console.error(`Unsupported extended item option type: ${Option.OptionType}`);
			return;
	}

	if (IsSelected == null) {
		switch (Option.OptionType) {
			case "ModularItemOption":
				IsSelected = (ExtendedItemPermissionMode && Type.includes("0")) ? true : Item.Property.Type.includes(Type);
				break;
			case "VibratingItemOption":
				IsSelected = (ExtendedItemPermissionMode && Type === VibratorModeOff.Name) ? true : Item.Property.Mode === Type;
				break;
			case "TypedItemOption":
				IsSelected = (ExtendedItemPermissionMode && Type == null) ? true : Item.Property.Type === Type;
				break;
		}
	}

	const ButtonColor = ExtendedItemGetButtonColor(C, Option, CurrentOption, Hover, IsSelected, Item);
	DrawButton(X, Y, 225, 55 + ImageHeight, "", ButtonColor, null, null, IsSelected);
	if (ShowImages) {
		DrawImageResize(AssetSource, X + 2, Y, 221, 221);
		if (Option.OptionType !== "ModularItemModule") {
			DrawPreviewIcons(ExtendItemGetIcons(C, Asset, Type, Effect), X + 2, Y);
		}
	}
	DrawTextFit((IsFavorite && !ShowImages ? "★ " : "") + DialogFindPlayer(DialogPrefix + Option.Name), X + 112, Y + 30 + ImageHeight, 225, "black");
	if (ControllerActive == true) {
		setButton(X + 112, Y + 30 + ImageHeight);
	}
}

/**
 * Determine the background color for the item option's button
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption | ModularItemModule} Option - A type for the extended item
 * @param {ExtendedItemOption} CurrentOption - The currently selected option for the item
 * @param {boolean} Hover - TRUE if the mouse cursor is on the button
 * @param {boolean} IsSelected - TRUE if the item's current type matches Option
 * @param {Item} Item - The item in question; defaults to {@link DialogFocusItem}
 * @returns {string} The name or hex code of the color
 */
function ExtendedItemGetButtonColor(C, Option, CurrentOption, Hover, IsSelected, Item=DialogFocusItem) {
	/** @type {[null | string, boolean, boolean, boolean]} */
	let [Type, IsFirst, HasSubscreen, FailSkillCheck] = [null, false, false, false];

	// Identify appropriate values for each type of item option/module
	switch (Option.OptionType) {
		case "ModularItemModule":
			break;
		case "ModularItemOption":
			Type = Option.Name;
			IsFirst = Type.includes("0");
			break;
		case "VibratingItemOption":
			Type = Option.Name;
			IsFirst = Option.Name === VibratorModeOff.Name;
			break;
		case "TypedItemOption":
			Type = (Option.Property && Option.Property.Type) || null;
			IsFirst = Type == null;
			break;
		case "ExtendedItemOption":
			Type = Option.Name;
			break;
		default:
			console.error(`Unsupported extended item option type: ${Option.OptionType}`);
			return "Red";
	}
	if (Option.OptionType !== "ModularItemModule") {
		HasSubscreen = Option.HasSubscreen || false;
		FailSkillCheck = !!ExtendedItemRequirementCheckMessageMemo(Item, C, Option, CurrentOption);
	}

	let ButtonColor;
	if (ExtendedItemPermissionMode) {
		const IsSelfBondage = C.ID === 0;
		const PlayerBlocked = InventoryIsPermissionBlocked(
			Player, Item.Asset.DynamicName(Player), Item.Asset.Group.Name, Type,
		);
		const PlayerLimited = InventoryIsPermissionLimited(
			Player, Item.Asset.Name, Item.Asset.Group.Name, Type
		);

		if ((IsSelfBondage && IsSelected) || IsFirst) {
			ButtonColor = "#888888";
		} else if (PlayerBlocked) {
			ButtonColor = Hover ? "red" : "pink";
		} else if (PlayerLimited) {
			ButtonColor = Hover ? "orange" : "#fed8b1";
		} else {
			ButtonColor = Hover ? "green" : "lime";
		}
	} else {
		const BlockedOrLimited = InventoryBlockedOrLimited(C, Item, Type);
		if (IsSelected && !HasSubscreen) {
			ButtonColor = "#888888";
		} else if (BlockedOrLimited) {
			ButtonColor = "Red";
		} else if (FailSkillCheck) {
			ButtonColor = "Pink";
		} else if (IsSelected && HasSubscreen) {
			ButtonColor = Hover ? "Cyan" : "LightGreen";
		} else {
			ButtonColor = Hover ? "Cyan" : "White";
		}
	}
	return ButtonColor;
}

/**
 * Exit function for the extended item dialog.
 *
 * Used for:
 *  1. Removing the cache from memory
 *  2. Calling item-appropriate `Exit` functions
 *  3. Setting {@link DialogFocusItem} and {@link ExtendedItemSubscreen} back to `null`
 * @returns {void} - Nothing
 */
function ExtendedItemExit() {
	// Check if an `Exit` function has already been called
	if (DialogFocusItem == null) {
		return;
	}

	// invalidate the cache
	ExtendedItemRequirementCheckMessageMemo.clearCache();

	// Run the subscreen's Exit function if any
	const FuncName = ExtendedItemFunctionPrefix() + (ExtendedItemSubscreen || "") + "Exit";
	CommonCallFunctionByName(FuncName);
	DialogFocusItem = null;
	DialogExtendedMessage = "";
	ExtendedItemSubscreen = null;
	ExtendedItemPermissionMode = false;
}

/**
 * Sets a typed item's type and properties to the option provided.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} item - The item whose type to set
 * @param {ItemProperties} previousProperty - The typed item options for the item
 * @param {ItemProperties} newProperty - The option to set
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @param {null | DynamicPropertyCallback} dynamicProperty - An optional callback for dynamically setting the item's properties.
 * Executed after the conventional properties have been assigned.
 * @returns {void} Nothing
 */
function ExtendedItemSetOption(C, item, previousProperty, newProperty, push=false, dynamicProperty=null) {
	// Delete properties added by the previous option
	const Property = Object.assign({}, item.Property);
	for (const key of Object.keys(previousProperty)) {
		delete Property[key];
	}
	// Clone the new properties and use them to extend the existing properties
	Object.assign(Property, newProperty);

	// If the item is locked, ensure it has the "Lock" effect
	if (Property.LockedBy && !(Property.Effect || []).includes("Lock")) {
		Property.Effect = (Property.Effect || []);
		Property.Effect.push("Lock");
	}

	item.Property = Property;

	if (!InventoryDoesItemAllowLock(item)) {
		// If the new type does not permit locking, remove the lock
		ValidationDeleteLock(item.Property, false);
	}

	if (dynamicProperty != null) {
		dynamicProperty(item.Property);
	}
	CharacterRefresh(C, push);
}

/**
 * Checks whether the character meets the requirements for an extended type option. This will check against their Bondage
 * skill if applying the item to another character, or their Self Bondage skill if applying the item to themselves.
 * @template {ExtendedItemOption} T
 * @param {Item} item - The item in question
 * @param {Character} C - The character in question
 * @param {T} Option - The selected type definition
 * @param {T} CurrentOption - The current type definition
 * @returns {string|null} null if the player meets the option requirements. Otherwise a string message informing them
 * of the requirements they do not meet
 */
function ExtendedItemRequirementCheckMessage(item, C, Option, CurrentOption) {
	return TypedItemValidateOption(C, item, Option, CurrentOption)
		|| ExtendedItemCheckSelfSelect(C, Option)
		|| ExtendedItemCheckBuyGroups(Option)
		|| ExtendedItemCheckSkillRequirements(C, item, Option);
}

/**
 * Checks whether the player is able to select an option based on it's self-selection criteria (whether or not the
 * wearer may select the option)
 * @param {Character} C - The character on whom the bondage is applied
 * @param {ExtendedItemOption} Option - The option whose requirements should be checked against
 * @returns {string | undefined} - undefined if the
 */
function ExtendedItemCheckSelfSelect(C, Option) {
	if (C.ID === 0 && Option.AllowSelfSelect === false) {
		return DialogFindPlayer("CannotSelfSelect");
	}
}

/**
 * Checks whether the player meets an option's self-bondage/bondage skill level requirements
 * @param {Character} C - The character on whom the bondage is applied
 * @param {Item} Item - The item whose options are being checked
 * @param {ExtendedItemOption} Option - The option whose requirements should be checked against
 * @returns {string|undefined} - undefined if the player meets the option's skill level requirements. Otherwise returns
 * a string message informing them of the requirements they do not meet.
 */
function ExtendedItemCheckSkillRequirements(C, Item, Option) {
	const SelfBondage = C.ID === 0;
	if (SelfBondage) {
		let RequiredLevel = Option.SelfBondageLevel;
		if (typeof RequiredLevel !== "number") RequiredLevel = Math.max(Item.Asset.SelfBondage, Option.BondageLevel);
		if (SkillGetLevelReal(Player, "SelfBondage") < RequiredLevel) {
			return DialogFindPlayer("RequireSelfBondage" + RequiredLevel);
		}
	} else {
		let RequiredLevel = Option.BondageLevel || 0;
		if (SkillGetLevelReal(Player, "Bondage") < RequiredLevel) {
			return DialogFindPlayer("RequireBondageLevel").replace("ReqLevel", `${RequiredLevel}`);
		}
	}
}

/**
 * Checks whether the character meets an option's required bought items
 * @param {ExtendedItemOption} Option - The option being checked
 * @returns {string|undefined} undefined if the requirement is met, otherwise the error message
 */
function ExtendedItemCheckBuyGroups(Option) {
	if (Option.PrerequisiteBuyGroup) {
		const requiredAsset = Asset.find(A => A.BuyGroup && A.BuyGroup === Option.PrerequisiteBuyGroup);
		if (requiredAsset && !InventoryAvailable(Player, requiredAsset.Name, requiredAsset.Group.Name)) {
			return DialogFindPlayer("OptionNeedsToBeBought");
		}
	}
}

/**
 * Checks whether a change from the given current option to the newly selected option is valid.
 * @template {ExtendedItemOption} T
 * @param {Character} C - The character wearing the item
 * @param {Item} Item - The extended item to validate
 * @param {T} Option - The selected option
 * @param {T} CurrentOption - The currently applied option on the item
 * @returns {string} - Returns a non-empty message string if the item failed validation, or an empty string otherwise
 */
function ExtendedItemValidate(C, Item, { Prerequisite, AllowLock }, CurrentOption) {
	const CurrentLockedBy = InventoryGetItemProperty(Item, "LockedBy");
	const canChangeWhenLocked = typeof CurrentOption.ChangeWhenLocked === "boolean" ? CurrentOption.ChangeWhenLocked : true;

	if (!canChangeWhenLocked && CurrentLockedBy && !DialogCanUnlock(C, Item)) {
		// If the option can't be changed when locked, ensure that the player can unlock the item (if it's locked)
		return DialogFindPlayer("CantChangeWhileLocked");
	} else if (Prerequisite && !InventoryAllow(C, Item.Asset, Prerequisite, true)) {
		// Otherwise use the standard prerequisite check
		return DialogText;
	} else if (CurrentOption.AllowLock && !AllowLock && InventoryItemHasEffect(Item, "Lock", true)) {
		// We're switching from a locked, lockable option to one that can't be locked. Prevent that.
		return DialogFindPlayer("ExtendedItemUnlockBeforeChange");
	}

	return "";
}

/**
 * Simple getter for the function prefix used for the passed extended item - used for calling standard
 * extended item functions (e.g. if the currently focused it is the hemp rope arm restraint, this will return
 * "InventoryItemArmsHempRope", allowing functions like InventoryItemArmsHempRopeLoad to be called)
 * @param {Item} Item - The extended item in question; defaults to {@link DialogFocusItem}
 * @returns {string} The extended item function prefix for the currently focused item
 */
function ExtendedItemFunctionPrefix(Item=DialogFocusItem) {
	const Asset = Item.Asset;
	return "Inventory" + Asset.Group.Name + Asset.Name;
}

/**
 * Simple getter for the key of the currently focused extended item in the ExtendedItemOffsets lookup
 * @returns {string} The offset lookup key for the currently focused extended item
 */
function ExtendedItemOffsetKey() {
	var Asset = DialogFocusItem.Asset;
	return Asset.Group.Name + "/" + Asset.Name;
}

/**
 * Gets the pagination offset of the currently focused extended item
 * @returns {number} The pagination offset for the currently focused extended item
 */
function ExtendedItemGetOffset() {
	return ExtendedItemOffsets[ExtendedItemOffsetKey()];
}

/**
 * Sets the pagination offset for the currently focused extended item
 * @param {number} Offset - The new offset to set
 * @returns {void} Nothing
 */
function ExtendedItemSetOffset(Offset) {
	ExtendedItemOffsets[ExtendedItemOffsetKey()] = Offset;
}

/**
 * Maps a chat tag to a dictionary entry for use in item chatroom messages.
 * @param {DictionaryBuilder} dictionary - The to-be updated dictionary builder
 * @param {Character} C - The target character
 * @param {Asset} asset - The asset for the typed item
 * @param {CommonChatTags} tag - The tag to map to a dictionary entry
 * @returns {DictionaryBuilder} - The originally passed dictionary builder, modified inplace
 */
function ExtendedItemMapChatTagToDictionaryEntry(dictionary, C, asset, tag) {
	switch (tag) {
		case CommonChatTags.SOURCE_CHAR:
			return dictionary.sourceCharacter(Player);
		case CommonChatTags.DEST_CHAR:
			return dictionary.destinationCharacter(C);
		case CommonChatTags.DEST_CHAR_NAME:
			return dictionary.destinationCharacterName(C);
		case CommonChatTags.TARGET_CHAR:
			return dictionary.targetCharacter(C);
		case CommonChatTags.TARGET_CHAR_NAME:
			return dictionary.targetCharacterName(C);
		case CommonChatTags.ASSET_NAME:
			return dictionary.asset(asset);
		default:
			console.warn(`Unknown ${asset.Group.Name}:${asset.Name} chat tag "${tag}"`);
			return dictionary;
	}
}

/**
 * Construct an array of inventory icons for a given asset and type
 * @param {Character} C - The target character
 * @param {Asset} Asset - The asset for the typed item
 * @param {string | null} Type - The type of the asse
 * @param {readonly EffectName[]} [Effects]
 * @returns {InventoryIcon[]} - The inventory icons
 */
function ExtendItemGetIcons(C, Asset, Type=null, Effects=null) {
	const IsBlocked = InventoryIsPermissionBlocked(C, Asset.Name, Asset.Group.Name, Type);
	const IsLimited = InventoryIsPermissionLimited(C, Asset.Name, Asset.Group.Name, Type);

	/** @type {InventoryIcon[]} */
	const icons = [];
	if (!C.IsPlayer() && !IsBlocked && IsLimited) {
		icons.push("AllowedLimited");
	}
	const FavoriteDetails = DialogGetFavoriteStateDetails(C, Asset, Type);
	if (FavoriteDetails && FavoriteDetails.Icon) {
		icons.push(FavoriteDetails.Icon);
	}

	if (Array.isArray(Effects)) {
		for (const [icon, effects] of /** @type {[InventoryIcon, EffectName[]][]} */(Object.entries(DialogEffectIconTable))) {
			for (const effect of effects) {
				if (Effects.includes(effect)) {
					icons.push(icon);
					break;
				}
			}
		}
	}

	return icons;
}

/**
 * Creates an asset's extended item NPC dialog function
 * @param {Asset} Asset - The asset for the typed item
 * @param {string} FunctionPrefix - The prefix of the new `NpcDialog` function
 * @param {string | ExtendedItemNPCCallback<ExtendedItemOption>} NpcPrefix - A dialog prefix or a function for creating one
 * @returns {void} - Nothing
 */
function ExtendedItemCreateNpcDialogFunction(Asset, FunctionPrefix, NpcPrefix) {
	const npcDialogFunctionName = `${FunctionPrefix}NpcDialog`;
	if (typeof NpcPrefix === "function") {
		window[npcDialogFunctionName] = function (C, Option, PreviousOption) {
			const Prefix = NpcPrefix(C, Option, PreviousOption);
			C.CurrentDialog = DialogFind(C, Prefix, Asset.Group.Name);
		};
	} else {
		window[npcDialogFunctionName] = function (C, Option, PreviousOption) {
			C.CurrentDialog = DialogFind(C, `${NpcPrefix}${Option.Name}`, Asset.Group.Name);
		};
	}
}

/**
 * Helper click function for creating custom buttons, including extended item permission support.
 * @param {string} Name - The name of the button and its pseudo-type
 * @param {number} X - The X coordinate of the button
 * @param {number} Y - The Y coordinate of the button
 * @param {boolean} ShowImages — Denotes whether images should be shown for the specific item
 * @param {boolean} IsSelected - Whether the button is selected or not
 * @returns {void} Nothing
 */
function ExtendedItemCustomDraw(Name, X, Y, ShowImages=false, IsSelected=false) {
	// Use a `name` for a "fictional" item option for interfacing with the extended item API
	/** @type {ExtendedItemOption} */
	const Option = { OptionType: "ExtendedItemOption", Name: Name };
	return ExtendedItemDrawButton(Option, Option, "", X, Y, ShowImages, DialogFocusItem, IsSelected);
}

/**
 * Helper click function for creating custom buttons, including extended item permission support.
 * @param {string} Name - The name of the button and its pseudo-type
 * @param {() => void} Callback - A callback to be executed whenever the button is clicked and all requirements are met
 * @param {boolean} Worn - `true` if the player is changing permissions for an item they're wearing
 * @returns {boolean} `false` if the item's requirement check failed and `true` otherwise
 */
function ExtendedItemCustomClick(Name, Callback, Worn=false) {
	// Use a `name` for a "fictional" item option for interfacing with the extended item API
	if (ExtendedItemPermissionMode) {
		InventoryTogglePermission(DialogFocusItem, Name, Worn);
		return true;
	} else {
		// Check if the option is blocked/limited/etc.
		/** @type {ExtendedItemOption} */
		const Option = { OptionType: "ExtendedItemOption", Name: Name };
		const requirementMessage = ExtendedItemRequirementCheckMessage(DialogFocusItem, CharacterGetCurrent(), Option, Option);
		if (requirementMessage) {
			DialogExtendedMessage = requirementMessage;
			return false;
		} else {
			// Requirement checks have passed; execute the callback
			Callback();
			return true;
		}
	}
}

/**
 * Helper publish + exit function for creating custom buttons whose clicks exit the dialog menu.
 *
 * If exiting the dialog menu is undesirable then something akin to the following example should be used instead:
 * @example
 * if (ServerPlayerIsInChatRoom()) {
 *     ChatRoomPublishCustomAction(Name, false, Dictionary);
 * }
 * @param {string} Name - Tag of the action to send
 * @param {Character} C - The affected character
 * @param {ChatMessageDictionary | null} Dictionary - Dictionary of tags and data to send to the room (if any).
 * @returns {void} Nothing
 */
function ExtendedItemCustomExit(Name, C, Dictionary=null) {
	// The logic below is largely adapted from the exiting functionality within `TypedItemSetType`
	if (ServerPlayerIsInChatRoom()) {
		if (Dictionary != null) {
			ChatRoomPublishCustomAction(Name, true, Dictionary);
		} else {
			DialogLeave();
		}
	} else {
		ExtendedItemExit();
		if (C.ID === Player.ID) {
			DialogMenuButtonBuild(C);
		} else {
			C.FocusGroup = null;
		}
	}
}

/**
 * Common draw function for drawing the header of the extended item menu screen.
 * Automatically applies any Locked and/or Vibrating options to the preview.
 * @param {number} X - Position of the preview box on the X axis
 * @param {number} Y - Position of the preview box on the Y axis
 * @param {Item} Item - The item for whom the preview box should be drawn
 * @returns {void} Nothing
 */
function ExtendedItemDrawHeader(X=1387, Y=55, Item=DialogFocusItem) {
	if (Item == null) {
		return;
	}
	const Vibrating = Item.Property && Item.Property.Intensity != null && Item.Property.Intensity >= 0;
	const Locked = InventoryItemHasEffect(Item, "Lock", true);
	DrawAssetPreview(X, Y, Item.Asset, { Vibrating, Icons: Locked ? ["Locked"] : undefined });
}

/**
 * Extract the passed item's data from one of the extended item lookup tables
 * @template {ExtendedArchetype} Archetype
 * @param {Item} Item - The item whose data should be extracted
 * @param {Archetype} Archetype - The archetype corresponding to the lookup table
 * @param {string} Type - The item's type. Only relevant in the case of {@link VariableHeightData}
 * @returns {null | ExtendedDataLookupStruct[Archetype]} The item's data or `null` if the lookup failed
 */
function ExtendedItemGetData(Item, Archetype, Type=null) {
	if (Item == null) {
		return null;
	}

	/** @type {TypedItemData | ModularItemData | VibratingItemData | VariableHeightData} */
	let Data;
	const Key = `${Item.Asset.Group.Name}${Item.Asset.Name}${Type == null ? "" : Type}`;
	switch (Archetype) {
		case ExtendedArchetype.TYPED:
			Data = TypedItemDataLookup[Key];
			break;
		case ExtendedArchetype.MODULAR:
			Data = ModularItemDataLookup[Key];
			break;
		case ExtendedArchetype.VIBRATING:
			Data = VibratorModeDataLookup[Key];
			break;
		case ExtendedArchetype.VARIABLEHEIGHT:
			Data = VariableHeightDataLookup[Key];
			break;
		default:
			console.warn(`Unsupported archetype: "${Archetype}"`);
			return null;
	}

	if (Data === undefined) {
		console.warn(`No key "${Key}" in "${Archetype}" lookup table`);
		return null;
	} else {
		// @ts-ignore It works but I don't know why.
		return Data;
	}
}

/**
 * Constructs the chat message dictionary for the extended item based on the items configuration data.
 * @template {ExtendedItemOption} OptionType
 * @param {ExtendedItemChatData<OptionType>} chatData - The chat data that triggered the message.
 * @param {ExtendedItemData<OptionType>} data - The extended item data for the asset
 * @returns {DictionaryBuilder} - The dictionary for the item based on its required chat tags
 */
function ExtendedItemBuildChatMessageDictionary(chatData, { asset, chatTags, dictionary }) {
	const dictBuilder = new DictionaryBuilder();
	chatTags.forEach(tag => ExtendedItemMapChatTagToDictionaryEntry(dictBuilder, chatData.C, asset, tag));
	dictionary.forEach(entry => entry(dictBuilder, chatData));
	return dictBuilder;
}

/**
 * Return {@link ExtendedItemDialog.chat} if it's a string or call it using chat data based on a fictional extended item option.
 * Generally used for getting a chat prefix for extended item buttons with custom functionality.
 * @param {string} Name - The name of the pseudo-type
 * @param {ExtendedItemData} Data - The extended item data
 * @returns {string} The dialogue prefix for the custom chatroom messages
 */
function ExtendedItemCustomChatPrefix(Name, Data) {
	if (typeof Data.dialogPrefix.chat === "function") {
		return Data.dialogPrefix.chat({
			C: CharacterGetCurrent(),
			previousOption: { OptionType: "ExtendedItemOption", Name: Name },
			newOption: { OptionType: "ExtendedItemOption", Name: Name },
			previousIndex: -1,
			newIndex: -1,
		});
	} else {
		return Data.dialogPrefix.chat;
	}
}

/**
 * Register archetypical subscreens for the passed extended item options
 * @param {Asset} asset - The asset whose subscreen is being registered
 * @param {VariableHeightConfig | VibratingItemConfig} config - The subscreens extended item config
 * @param {TypedItemOption | ModularItemOption} option - The parent item's extended item option
 * @returns {null | VariableHeightData | VibratingItemData} - The subscreens extended item data or `null` if no archetypical subscreen is present
 */
function ExtendedItemRegisterSubscreen(asset, config, option) {
	switch (option.Archetype) {
		case ExtendedArchetype.VARIABLEHEIGHT:
			return VariableHeightRegister(asset, /** @type {VariableHeightConfig} */(config), option);
		case ExtendedArchetype.VIBRATING:
			return VibratorModeRegister(asset, /** @type {VibratingItemConfig} */(config || {}), option);
		default:
			return null;
	}
}
