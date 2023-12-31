"use strict";

/**
 * ModularItem.js
 * --------------
 * This file contains utilities related to modular extended items (for example the High Security Straitjacket). It is
 * generally not necessary to call functions in this file directly - these are called from Asset.js when an item is
 * first registered.
 *
 * A modular item is a typed item, but each type may be comprised of several independent "modules". For example, the
 * High Security Straitjacket has 3 different modules: crotch panel (c), arms (a), and crotch straps (s), and each
 * module can be configured independently. The resulting type then uses an abbreviated format which represents the
 * module values comprising that type. Each module contains a number of options that may be chosen for that module.
 *
 * For example "c0a1s2" - represents the type where the crotch panel module uses option 0, the arms module uses option
 * 1, and the crotch straps module uses option 2. The properties of the type will be derived from a combination of the
 * properties of each of the type's module options. For example, difficulty will be calculated by summing up the
 * difficulties for each of its module options.
 *
 * All dialogue for modular items should be added to `Dialog_Player.csv`. To implement a modular item, you need the
 * following dialogue entries:
 * * "<GroupName><AssetName>SelectBase" - This is the text that will be displayed on the module selection screen (e.g.
 *   `ItemArmsHighSecurityStraitJacketSelectBase` - "Configure Straitjacket")
 * * For each module:
 *   * "<GroupName><AssetName>Select<ModuleName>" - This is the text that will be displayed on the module's subscreen
 *     (e.g. `ItemArmsHighSecurityStraitJacketSelectCrotch` - "Configure crotch panel")
 *   * "<GroupName><AssetName>Module<ModuleName>" - This is the text that will be used to describe the module (under
 *     the module's button) in the module selection screen (e.g. `ItemArmsHighSecurityStraitJacketModuleCrotch` -
 *     "Crotch Panel")
 * * For each option:
 *   * "<GroupName><AssetName>Option<ModuleKey><OptionNumber>" - This is the text that will be used to describe the
 *     option (under the option's button) in the module subscreen for the module containing that option (e.g.
 *     `ItemArmsHighSecurityStraitJacketOptionc0` - "No crotch panel")
 * * If the item's chat setting is configured to `PER_MODULE`, you will need a chatroom message for each module,
 *   which will be sent when that module changes. It should have the format "<GroupName><AssetName>Set<ModuleName>"
 *   (e.g. `ItemArmsHighSecurityStraitJacketSetCrotch` - "SourceCharacter changed the crotch panel on
 *   DestinationCharacter straitjacket")
 * * If the item's chat setting is configured to `PER_OPTION`, you will need a chatroom message for each option, which
 *   will be sent when that option is selected. It should have the format
 *   "<GroupName><AssetName>Set<ModuleKey><OptionNumber>" (e.g. `ItemArmsHighSecurityStraitJacketSetc0` -
 *   "SourceCharacter removes the crotch panel from DestinationCharacter straitjacket")
 */

/**
 * The keyword used for the base menu on modular items
 * @const {string}
 */
const ModularItemBase = "Base";

/**
 * A lookup for the modular item configurations for each registered modular item
 * @const
 * @type {Record<string, ModularItemData>}
 * @see {@link ModularItemData}
 */
const ModularItemDataLookup = {};

/**
 * An enum encapsulating the possible chatroom message settings for modular items
 * - PER_MODULE - The item has one chatroom message per module (messages for individual options within a module are all
 * the same)
 * - PER_OPTION - The item has one chatroom message per option (for finer granularity - each individual option within a
 * module can have its own chatroom message)
 * @type {Record<"PER_MODULE"|"PER_OPTION", ModularItemChatSetting>}
 */
const ModularItemChatSetting = {
	PER_OPTION: "default",
	PER_MODULE: "perModule",
};

/** A regular expression that knows how to split modular types into [module key, option index] components */
const ModularItemTypeSplitter = new RegExp(/([a-zA-Z]+\d+)/);
/** A regular expression that knows how to split a [key, index] into its parts */
const ModularItemSubtypeSplitter = new RegExp(/([a-zA-Z]+)(\d+)/);

/**
 * Registers a modular extended item. This automatically creates the item's load, draw and click functions. It will
 * also generate the asset's AllowType array, as AllowType arrays on modular items can get long due to the
 * multiplicative nature of the item's types, and also converts the AllowModuleTypes property on any asset layers into
 * an AllowTypes property, if present.
 * @param {Asset} asset - The asset being registered
 * @param {ModularItemConfig} config - The item's modular item configuration
 * @returns {ModularItemData} - The generated extended item data for the asset
 */
function ModularItemRegister(asset, config) {
	const data = ModularItemCreateModularData(asset, config);

	if (IsBrowser()) {
		/** @type {ExtendedItemCallbackStruct<ModularItemOption>} */
		const defaultCallbacks = {
			load: () => ModularItemLoad(data),
			click: () => ModularItemClick(data),
			draw: () => ModularItemDraw(data),
			validate: (...args) => ExtendedItemValidate(data, ...args),
			publishAction: (...args) => ModularItemPublishAction(data, ...args),
			init: (...args) => ModularItemInit(data, ...args),
			setOption: (...args) => ExtendedItemSetOption(data, ...args),
		};
		ExtendedItemCreateCallbacks(data, defaultCallbacks);
	}
	ModularItemGenerateValidationProperties(data);
	return data;
}

/**
 * Initialize the modular item properties
 * @param {ModularItemData} Data - The item's extended item data
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {boolean} Refresh - Whether the character and relevant item should be refreshed and pushed to the server
 * @returns {boolean} Whether properties were initialized or not
 */
function ModularItemInit(Data, C, Item, Refresh=true) {
	const AllowType = Data.asset.AllowType;
	if (CommonIsObject(Item.Property) && CommonIncludes(AllowType, Item.Property.Type)) {
		return false;
	}

	const currentModuleValues = ModularItemParseCurrent(Data, null);
	Item.Property = ModularItemMergeModuleValues(Data, currentModuleValues, Data.baselineProperty);

	if (Refresh) {
		CharacterRefresh(C, true, false);
		ChatRoomCharacterItemUpdate(C, Data.asset.Group.Name);
	}
	return true;
}

/**
 * @param {ModularItemData} data
 */
function ModularItemLoad(data) {
	DialogExtendedMessage = DialogFindPlayer(`${data.dialogPrefix.header}${data.currentModule}`);
}

/**
 * @param {ModularItemData} data
 */
function ModularItemClick(data) {
	const currentModule = data.currentModule || ModularItemBase;
	return data.clickFunctions[currentModule]();
}

/**
 * @param {ModularItemData} data
 */
function ModularItemDraw(data) {
	const currentModule = data.currentModule || ModularItemBase;
	return data.drawFunctions[currentModule]();
}

/**
 * Parse the and pre-process the passed modules (and their options)
 * @param {Asset} asset - The asset in question
 * @param {readonly ModularItemModuleBase[]} modules - An object describing a single module for a modular item.
 * @param {boolean | undefined} [changeWhenLocked] - See {@link ModularItemConfig.ChangeWhenLocked}
 * @returns {ModularItemModule[]} - The updated modules and options
 */
function ModularItemBuildModules(asset, modules, changeWhenLocked) {
	return modules.map(protoMod => {
		const drawImages = typeof protoMod.DrawImages === "boolean" ? protoMod.DrawImages : true;
		/** @type {ModularItemModule} */
		return {
			...protoMod,
			drawData: TypedItemGetDrawData(asset, protoMod.DrawData, protoMod.Options.length, drawImages),
			OptionType: "ModularItemModule",
			DrawImages: drawImages,
			Options: protoMod.Options.map((protoOption, i) => {
				/** @type {ModularItemOption} */
				const option = {
					...protoOption,
					Name: `${protoMod.Key}${i}`,
					OptionType: "ModularItemOption",
					ModuleName: protoMod.Name,
					Index: i,
				};

				if (typeof changeWhenLocked === "boolean" && typeof option.ChangeWhenLocked !== "boolean") {
					option.ChangeWhenLocked = changeWhenLocked;
				}

				// @ts-expect-error: potentially copied from the protoOption via the spread operator
				delete option.ArchetypeConfig;
				if (protoOption.ArchetypeConfig) {
					option.ArchetypeData = /** @type {ModularItemOption["ArchetypeData"]} */(AssetBuildExtended(
						asset, protoOption.ArchetypeConfig, AssetFemale3DCGExtended, option,
					));
				}
				return option;
			}),
		};
	});
}

/**
 * Generates an asset's modular item data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {ModularItemConfig} config - The item's extended item configuration
 * @returns {ModularItemData} - The generated modular item data for the asset
 */
function ModularItemCreateModularData(asset, {
	Modules,
	ChatSetting,
	ChatTags,
	ChangeWhenLocked,
	DialogPrefix,
	ScriptHooks,
	Dictionary,
	DrawData,
	BaselineProperty=null,
	DrawImages=null,
}) {
	// Set the name of all modular item options
	// Use an external function as typescript does not like the inplace updating of an object's type
	const ModulesParsed = ModularItemBuildModules(asset, Modules, ChangeWhenLocked);
	// Only enable DrawImages in the base screen if all module-specific DrawImages are true
	const BaseDrawImages = (typeof DrawImages !== "boolean") ? ModulesParsed.every((m) => m.DrawImages) : DrawImages;

	const key = `${asset.Group.Name}${asset.Name}`;
	DialogPrefix = DialogPrefix || {};
	/** @type {ModularItemData} */
	const data = ModularItemDataLookup[key] = {
		archetype: ExtendedArchetype.MODULAR,
		asset,
		chatSetting: ChatSetting || ModularItemChatSetting.PER_OPTION,
		key,
		typeCount: 1,
		functionPrefix: `Inventory${key}`,
		dynamicAssetsFunctionPrefix: `Assets${key}`,
		dialogPrefix: {
			header: DialogPrefix.Header || `${key}Select`,
			module: DialogPrefix.Module || `${key}Module`,
			option: DialogPrefix.Option || `${key}Option`,
			chat: DialogPrefix.Chat || `${key}Set`,
		},
		chatTags: Array.isArray(ChatTags) ? ChatTags : [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
		],
		modules: ModulesParsed,
		currentModule: ModularItemBase,
		pages: { [ModularItemBase]: 0 },
		drawData: TypedItemGetDrawData(asset, DrawData, ModulesParsed.length, BaseDrawImages),
		scriptHooks: ExtendedItemParseScriptHooks(ScriptHooks || {}),
		drawFunctions: {},
		clickFunctions: {},
		baselineProperty: typeof BaselineProperty === "object" ? BaselineProperty : null,
		dictionary: Array.isArray(Dictionary) ? Dictionary : [],
		parentOption: null,
	};
	data.drawFunctions[ModularItemBase] = ModularItemCreateDrawBaseFunction(data);
	data.clickFunctions[ModularItemBase] = ModularItemCreateClickBaseFunction(data);
	for (const module of ModulesParsed) {
		data.pages[module.Name] = 0;
		data.drawFunctions[module.Name] = () => ModularItemDrawModule(module, data);
		data.clickFunctions[module.Name] = () => ModularItemClickModule(module, data);
		data.typeCount *= module.Options.length;
	}
	return data;
}

/**
 * Creates a modular item's base draw function (for the module selection screen)
 * @param {ModularItemData} data - The modular item data for the asset
 * @returns {() => void} - The modular item's base draw function
 */
function ModularItemCreateDrawBaseFunction(data) {
	return () => {
		/** @type {ModularItemButtonDefinition[]} */
		const buttonDefinitions = data.modules
			.map((module, i) => {
				const currentValues = ModularItemParseCurrent(data);
				const currentOption = module.Options[currentValues[i]];
				return [module, currentOption, data.dialogPrefix.module];
			});
		return ModularItemDrawCommon(ModularItemBase, buttonDefinitions, data, data.drawData);
	};
}

/**
 * Maps a modular item option to a button definition for rendering the option's button.
 * @param {ModularItemOption} option - The option to draw a button for
 * @param {ModularItemModule} module - A reference to the option's parent module
 * @param {ModularItemData} data - The modular item's data
 * @param {number} currentOptionIndex - The currently selected option index for the module
 * @returns {ModularItemButtonDefinition} - A button definition array representing the provided option
 */
function ModularItemMapOptionToButtonDefinition(option, module, { dialogPrefix }, currentOptionIndex) {
	const currentOption = module.Options[currentOptionIndex];
	return [option, currentOption, dialogPrefix.option];
}

/**
 * Draws a module screen from the provided button definitions and modular item data.
 * @param {string} moduleName - The name of the module whose page is being drawn
 * @param {readonly ModularItemButtonDefinition[]} buttonDefinitions - A list of button definitions to draw
 * @param {ModularItemData} data - The modular item's data
 * @param {ExtendedItemDrawData<ElementMetaData.Modular>} drawData
 * @returns {void} - Nothing
 */
function ModularItemDrawCommon(
	moduleName,
	buttonDefinitions,
	data,
	{ paginate, pageCount, elementData, itemsPerPage },
) {
	if (ExtendedItemSubscreen) {
		CommonCallFunctionByNameWarn(ExtendedItemFunctionPrefix() + ExtendedItemSubscreen + "Draw");
		return;
	}

	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");

	// Permission mode toggle
	DrawButton(
		1775, 25, 90, 90, "", "White",
		ExtendedItemPermissionMode ? "Icons/DialogNormalMode.png" : "Icons/DialogPermissionMode.png",
		DialogFindPlayer(ExtendedItemPermissionMode ? "DialogNormalMode" : "DialogPermissionMode"),
	);

	const pageNumber = Math.min(pageCount - 1, data.pages[moduleName] || 0);
	const pageStart = pageNumber * itemsPerPage;
	const page = buttonDefinitions.slice(pageStart, pageStart + itemsPerPage);

	for (const [i, [option, currentOption, prefix]] of page.entries()) {
		ExtendedItemDrawButton(option, currentOption, prefix, elementData[i]);
	}

	if (paginate) {
		DrawButton(1665, 240, 90, 90, "", "White", "Icons/Prev.png");
		DrawButton(1775, 240, 90, 90, "", "White", "Icons/Next.png");
	}
}

/**
 * Draws the extended item screen for a given module.
 * @param {ModularItemModule} module - The module whose screen to draw
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemDrawModule(module, data) {
	const moduleIndex = data.modules.indexOf(module);
	const currentValues = ModularItemParseCurrent(data);
	const buttonDefinitions = module.Options.map(
		(option) => ModularItemMapOptionToButtonDefinition(option, module, data, currentValues[moduleIndex]));
	ModularItemDrawCommon(module.Name, buttonDefinitions, data, module.drawData);
}

/**
 * Generates a click function for a modular item's module selection screen
 * @param {ModularItemData} data - The modular item's data
 * @returns {function(): void} - A click handler for the modular item's module selection screen
 */
function ModularItemCreateClickBaseFunction(data) {
	const DrawData = data.drawData;
	return () => {
		ModularItemClickCommon(
			DrawData,
			() => {
				DialogLeaveFocusItem();
			},
			i => {
				const pageNumber = Math.min(DrawData.pageCount - 1, data.pages[ModularItemBase] || 0);
				const pageStart = pageNumber * DrawData.itemsPerPage;
				const page = data.modules.slice(pageStart, pageStart + DrawData.itemsPerPage);
				const module = page[i];
				if (module) {
					if (CharacterGetCurrent().ID === 0 && module.AllowSelfSelect === false) {
						DialogExtendedMessage = DialogFindPlayer("CannotSelfSelect");
						return;
					}
					ModularItemModuleTransition(module.Name, data);
				}
			},
			(delta) => ModularItemChangePage(ModularItemBase, delta, data, DrawData)
		);
	};
}

/**
 * A generic click handler for a module's screen
 * @param {ModularItemModule} module - The module whose screen we are currently in
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemClickModule(module, data) {
	const DrawData = module.drawData;
	ModularItemClickCommon(
		DrawData,
		() => ModularItemModuleTransition(ModularItemBase, data),
		i => {
			const pageNumber = Math.min(DrawData.pageCount - 1, data.pages[module.Name] || 0);
			const pageStart = pageNumber * DrawData.itemsPerPage;
			const page = module.Options.slice(pageStart, pageStart + DrawData.itemsPerPage);
			const selected = page[i];
			if (selected) {
				if (ExtendedItemPermissionMode) {
					const C = CharacterGetCurrent();
					const IsFirst = selected.Name.includes("0");
					const Worn = C.ID == 0 && DialogFocusItem.Property.Type.includes(selected.Name);
					InventoryTogglePermission(DialogFocusItem, selected.Name, IsFirst || Worn);
				} else {
					ModularItemSetType(module, pageStart + i, data);
				}
			}
		},
		(delta) => ModularItemChangePage(module.Name, delta, data, DrawData),
	);
}

/**
 * A common click handler for modular item screens. Note that pagination is not currently handled, but will be added
 * in the future.
 * @param {ExtendedItemDrawData<ElementMetaData.Modular>} drawData
 * @param {function(): void} exitCallback - A callback to be called when the exit button has been clicked
 * @param {function(number): void} itemCallback - A callback to be called when an item has been clicked
 * @param {function(number): void} paginateCallback - A callback to be called when a pagination button has been clicked
 * @returns {void} - Nothing
 */
function ModularItemClickCommon({ paginate, elementData }, exitCallback, itemCallback, paginateCallback) {
	if (ExtendedItemSubscreen) {
		CommonCallFunctionByNameWarn(ExtendedItemFunctionPrefix() + ExtendedItemSubscreen + "Click");
		return;
	}

	// Exit button
	if (MouseIn(1885, 25, 90, 90)) {
		exitCallback();
		ExtendedItemPermissionMode = false;
		return;
	} else if (MouseIn(1775, 25, 90, 90)) {
		// Permission toggle button
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") {
			ChatRoomCharacterUpdate(Player);
			ExtendedItemRequirementCheckMessageMemo.clearCache();
		}
		ExtendedItemPermissionMode = !ExtendedItemPermissionMode;
		return;
	} else if (paginate) {
		if (MouseIn(1665, 240, 90, 90)) return paginateCallback(-1);
		else if (MouseIn(1775, 240, 90, 90)) return paginateCallback(1);
	}

	elementData.some(({ position, hidden }, i) => {
		if (!hidden && MouseIn(...position)) {
			itemCallback(i);
			return true;
		}
	});
}

/**
 * Handles page changing for modules
 * @param {string} moduleName - The name of the module whose page should be modified
 * @param {number} delta - The page delta to apply to the module's current page
 * @param {ModularItemData} data - The modular item's data
 * @param {ExtendedItemDrawData<ElementMetaData.Modular>} drawData
 * @returns {void} - Nothing
 */
function ModularItemChangePage(moduleName, delta, data, { pageCount }) {
	const currentPage = data.pages[moduleName];
	data.pages[moduleName] = (currentPage + pageCount + delta) % pageCount;
}

/**
 * Transitions between pages within a modular item's extended item menu
 * @param {string} newModule - The name of the new module to transition to
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemModuleTransition(newModule, data) {
	data.currentModule = newModule;
	DialogExtendedMessage = DialogFindPlayer(data.dialogPrefix.header + newModule);
}

/**
 * Parses the focus item's current type into an array representing the currently selected module options
 * @param {ModularItemData} data - The modular item's data
 * @param {string?} type - The type string for a modular item. If null, use a type string extracted from the selected module options
 * @returns {number[]} - An array of numbers representing the currently selected options for each of the item's modules
 */
function ModularItemParseCurrent({ asset, modules }, type=null) {
	if (type == null) {
		type = (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Type) || ModularItemConstructType(modules);
	}
	return modules.map(module => {
		const index = type.indexOf(module.Key);
		if (index !== -1) {
			const match = type.substring(index + module.Key.length).match(/^\d+/);
			if (match) {
				return Number(match[0]);
			}
		}
		console.warn(`[${asset.Group.Name}:${asset.Name}] Module ${module.Key} not found in type "${type}"`);
		return 0;
	});
}

/**
 * Merges all of the selected module options for a modular item into a single Property object to set on the item
 * @param {ModularItemData} data - The modular item's data
 * @param {readonly number[]} moduleValues - The numeric values representing the current options for each module
 * @param {ItemProperties|null} BaselineProperty - Initial properties
 * @returns {ItemProperties} - A property object created from combining each module of the modular item
 */
function ModularItemMergeModuleValues({ asset, modules }, moduleValues, BaselineProperty=null) {
	const options = modules.map((module, i) => module.Options[moduleValues[i] || 0]);
	const BaseLineProperties = /** @type {ItemProperties} */({
		Type: ModularItemConstructType(modules, moduleValues),
		Difficulty: 0,
		CustomBlindBackground: asset.CustomBlindBackground,
		Block: Array.isArray(asset.Block) ? asset.Block.slice() : [],
		Effect: Array.isArray(asset.Effect) ? asset.Effect.slice() : [],
		Hide: Array.isArray(asset.Hide) ? asset.Hide.slice() : [],
		HideItem: Array.isArray(asset.HideItem) ? asset.HideItem.slice() : [],
		AllowActivity: Array.isArray(asset.AllowActivity) ? asset.AllowActivity.slice() : [],
		Attribute: Array.isArray(asset.Attribute) ? asset.Attribute.slice() : [],
		Tint: asset.AllowTint ? Array.isArray(asset.Tint) ? asset.Tint.slice() : [] : undefined,
	});
	if (BaselineProperty != null) {
		ModularItemSanitizeProperties(BaselineProperty, BaseLineProperties, asset);
	}

	return options.reduce((mergedProperty, { Property }) => {
		return ModularItemSanitizeProperties(Property, mergedProperty, asset);
	}, BaseLineProperties);
}

/**
 * Sanitize and merge all modular item properties
 * @param {ItemProperties} Property - The to-be sanitized properties
 * @param {ItemProperties} mergedProperty - The to-be returned object with the newly sanitized properties
 * @param {Asset} Asset - The relevant asset
 * @returns {ItemProperties} - The updated merged properties
 */
function ModularItemSanitizeProperties(Property, mergedProperty, Asset) {
	Property = Property || {};
	mergedProperty.Difficulty += (Property.Difficulty || 0);
	if (Property.CustomBlindBackground) mergedProperty.CustomBlindBackground = Property.CustomBlindBackground;
	if (Property.Block) CommonArrayConcatDedupe(mergedProperty.Block, Property.Block);
	if (Property.Effect) CommonArrayConcatDedupe(mergedProperty.Effect, Property.Effect);
	if (Property.Hide) CommonArrayConcatDedupe(mergedProperty.Hide, Property.Hide);
	if (Property.HideItem) CommonArrayConcatDedupe(mergedProperty.HideItem, Property.HideItem);
	if (Property.SetPose) mergedProperty.SetPose = CommonArrayConcatDedupe(mergedProperty.SetPose || [], Property.SetPose);
	if (Property.AllowActivity) CommonArrayConcatDedupe(mergedProperty.AllowActivity, Property.AllowActivity);
	if (Property.Attribute) CommonArrayConcatDedupe(mergedProperty.Attribute, Property.Attribute);
	if (typeof Property.OverridePriority === "number") mergedProperty.OverridePriority = Property.OverridePriority;
	else if (typeof Property.OverridePriority === "object") {
		let valid = true;
		for (const [layerName] of Object.entries(Property.OverridePriority)) {
			if (!Asset.Layer.find(l => l.Name === layerName)) {
				console.warn(`invalid OverridePriority property: unknown layer name ${layerName}`);
				valid = false;
				break;
			}
		}
		if (valid)
			mergedProperty.OverridePriority = Property.OverridePriority;
	}
	if (typeof Property.HeightModifier === "number") mergedProperty.HeightModifier = (mergedProperty.HeightModifier || 0) + Property.HeightModifier;
	if (Property.OverrideHeight) mergedProperty.OverrideHeight = ModularItemMergeOverrideHeight(mergedProperty.OverrideHeight, Property.OverrideHeight);
	if (Asset.AllowTint && Property.Tint) mergedProperty.Tint = CommonArrayConcatDedupe(mergedProperty.Tint, Property.Tint);
	if (typeof Property.Door === "boolean") mergedProperty.Door = Property.Door;
	if (typeof Property.Padding === "boolean") mergedProperty.Padding = Property.Padding;
	if (typeof Property.ShockLevel === "number") mergedProperty.ShockLevel = Property.ShockLevel;
	if (typeof Property.TriggerCount === "number") mergedProperty.TriggerCount = Property.TriggerCount;
	if (typeof Property.ShowText === "boolean") mergedProperty.ShowText = Property.ShowText;
	if (typeof Property.InflateLevel === "number") mergedProperty.InflateLevel = Property.InflateLevel;
	if (typeof Property.Intensity === "number") mergedProperty.Intensity = Property.Intensity;
	if (typeof Property.Opacity === "number") mergedProperty.Opacity = Property.Opacity;
	if (typeof Property.AutoPunishUndoTimeSetting === "number") mergedProperty.AutoPunishUndoTimeSetting = Property.AutoPunishUndoTimeSetting;
	if (typeof Property.OriginalSetting === "number") mergedProperty.OriginalSetting = Property.OriginalSetting;
	if (typeof Property.BlinkState === "boolean") mergedProperty.BlinkState = Property.BlinkState;
	if (typeof Property.AutoPunishUndoTime === "number") mergedProperty.AutoPunishUndoTime = Property.AutoPunishUndoTime;
	if (typeof Property.AutoPunish === "number") mergedProperty.AutoPunish = Property.AutoPunish;
	if (typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text)) mergedProperty.Text = Property.Text;
	if (typeof Property.Text2 === "string" && DynamicDrawTextRegex.test(Property.Text2)) mergedProperty.Text2 = Property.Text2;
	if (typeof Property.Text3 === "string" && DynamicDrawTextRegex.test(Property.Text3)) mergedProperty.Text3 = Property.Text3;
	if (typeof Property.PunishOrgasm === "boolean") mergedProperty.PunishOrgasm = Property.PunishOrgasm;
	if (typeof Property.PunishStandup === "boolean") mergedProperty.PunishStandup = Property.PunishStandup;
	if (typeof Property.NextShockTime === "number") mergedProperty.NextShockTime = Property.NextShockTime;
	if (typeof Property.TargetAngle === "number") mergedProperty.TargetAngle = Property.TargetAngle;
	if (typeof Property.PortalLinkCode === "string" && PortalLinkCodeRegex.test(Property.PortalLinkCode)) mergedProperty.PortalLinkCode = Property.PortalLinkCode;
	if (Array.isArray(Property.Texts)) mergedProperty.Texts = Property.Texts;
	return mergedProperty;
}

/**
 * Generates the type string for a modular item from its modules and their current values.
 * @param {AssetOverrideHeight} currentValue - The OverrideHeight for the future item
 * @param {AssetOverrideHeight} newValue - The OverrideHeight being merged
 * @returns {AssetOverrideHeight | undefined} - A string type generated from the selected option values for each module
 */
function ModularItemMergeOverrideHeight(currentValue, newValue) {
	if (typeof newValue.Height === "number" && typeof newValue.Priority === "number" &&
	(!currentValue || (currentValue.Priority < currentValue.Priority)))
		return {Height: newValue.Height, Priority: newValue.Priority};
	return currentValue;
}

/**
 * Generates the type string for a modular item from its modules and their current values.
 * @param {ModularItemModule[]} modules - The modules array for the modular item
 * @param {readonly number[]} [values] - The numeric values representing the current options for each module
 * @returns {string} - A string type generated from the selected option values for each module
 */
function ModularItemConstructType(modules, values) {
	values = values || [];
	let type = "";
	modules.forEach((module, i) => {
		type += module.Key;
		type += (values[i] || 0);
	});
	return type;
}

/**
 * Separate a modular item type string into a list with the types of each individual module.
 * @param {string} Type - The modular item type string
 * @returns {string[] | null} - A list with the options of each individual module or `null` if the input type wasn't a string
 */
function ModularItemDeconstructType(Type) {
	if (typeof Type !== "string") {
		return null;
	} else {
		return Type.split(/([a-zA-Z]+\d+)/).filter(t => t);
	}
}

/**
 * Sets a modular item's type based on a change in a module's option selection.
 * @param {ModularItemModule} module - The module that changed
 * @param {number} index - The index of the newly chosen option within the module
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemSetType(module, index, data) {
	const C = CharacterGetCurrent();
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
	const newOption = module.Options[index];
	const currentModuleValues = ModularItemParseCurrent(data);
	const moduleIndex = data.modules.indexOf(module);
	const previousOption = module.Options[currentModuleValues[moduleIndex]];

	const requirementMessage = ExtendedItemRequirementCheckMessage(data, C, DialogFocusItem, newOption, previousOption);
	if (requirementMessage) {
		DialogExtendedMessage = requirementMessage;
		return;
	}

	// Do not sync appearance while in the wardrobe
	const IsCloth = DialogFocusItem.Asset.Group.Clothing;
	/** @type {Parameters<ExtendedItemCallbacks.SetOption<ModularItemOption>>} */
	const optionArgs = [C, DialogFocusItem, newOption, previousOption, !IsCloth];
	CommonCallFunctionByNameWarn(`${data.functionPrefix}SetOption`, ...optionArgs);

	if (!IsCloth) {
		const groupName = data.asset.Group.Name;
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, groupName);

		if (ServerPlayerIsInChatRoom()) {
			/** @type {Parameters<ExtendedItemCallbacks.PublishAction<ModularItemOption>>} */
			const args = [C, DialogFocusItem, newOption, previousOption];
			CommonCallFunctionByNameWarn(`${data.functionPrefix}PublishAction`, ...args);
		} else if (!C.IsPlayer()) {
			C.CurrentDialog = DialogFind(C, data.key + DialogFocusItem.Property.Type, groupName);
		}
	}

	// If the module's option has a subscreen, transition to that screen instead of the main page of the item.
	if (newOption.HasSubscreen) {
		ExtendedItemSubscreen = newOption.Name;
		CommonCallFunctionByName(`${data.functionPrefix}${ExtendedItemSubscreen}Load`);
	} else {
		ModularItemModuleTransition(ModularItemBase, data);
	}
}

/**
 * Sets a modular item's type and properties to the option whose name matches the provided option name parameter.
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item | AssetGroupName} itemOrGroupName - The item whose type to set, or the group name for the item
 * @param {string} optionNames - The name of the option to set
 * @param {boolean} [push] - Whether or not appearance updates should be persisted (only applies if the character is the
 * player) - defaults to false.
 * @param {null | Character} [C_Source] - The character setting the new item option. If `null`, assume that it is _not_ the player character.
 * @returns {string|undefined} - undefined or an empty string if the type was set correctly. Otherwise, returns a string
 * informing the player of the requirements that are not met.
 */
function ModularItemSetOptionByName(C, itemOrGroupName, optionNames, push = false, C_Source=null) {
	const item = typeof itemOrGroupName === "string" ? InventoryGet(C, itemOrGroupName) : itemOrGroupName;
	if (!item) return;

	const assetName = item.Asset.Name;
	const groupName = item.Asset.Group.Name;
	const warningMessage = `Cannot set option for ${groupName}:${assetName} to ${optionNames}`;

	if (item.Asset.Archetype !== ExtendedArchetype.MODULAR) {
		const msg = `${warningMessage}: item does not use the modular archetype`;
		console.warn(msg);
		return msg;
	}

	if (!item.Asset.AllowType.includes(optionNames)) {
		const msg = `${warningMessage}: option "${optionNames}" does not exist`;
		console.warn(msg);
		return msg;
	}

	const data = ModularItemDataLookup[`${groupName}${assetName}`];
	const newModuleValues = ModularItemParseCurrent(data, optionNames);
	const previousModuleValues = ModularItemParseCurrent(data, item.Property && item.Property.Type);

	// A number of validation checks assume that the option is applied by the player; skip them if this is not the case
	const validationCallback = C_Source && C_Source.IsPlayer() ? ExtendedItemRequirementCheckMessage : TypedItemValidateOption;
	let i = -1;
	for (const mod of data.modules) {
		i += 1;
		const newOption = mod.Options[newModuleValues[i]];
		const previousOption = mod.Options[previousModuleValues[i]];
		const requirementMessage = validationCallback(data, C, item, newOption, previousOption);
		if (requirementMessage && newOption.Name !== previousOption.Name) {
			console.warn(`Cannot set option for ${groupName}:${assetName} to ${newOption.Name}: ${requirementMessage}`);
		} else {
			ExtendedItemSetOption(data, C, item, newOption, previousOption, false);
		}
	}

	if (push) {
		ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);
	}
}

/**
 * Publishes the chatroom message for a modular item when one of its modules has changed.
 * @param {ModularItemData} data
 * @param {Character} C
 * @param {Item} item
 * @param {ModularItemOption} newOption
 * @param {ModularItemOption} previousOption
 * @returns {void} - Nothing
 */
function ModularItemPublishAction(data, C, item, newOption, previousOption) {
	if (newOption.Name === previousOption.Name) {
		return;
	}

	const chatData = {
		C,
		newOption,
		previousOption,
		newIndex: newOption.Index,
		previousIndex: previousOption.Index,
	};
	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data);

	let msg = (typeof data.dialogPrefix.chat === "function") ? data.dialogPrefix.chat(chatData) : data.dialogPrefix.chat;
	switch (data.chatSetting) {
		case ModularItemChatSetting.PER_OPTION:
			msg += newOption.Name;
			break;
		case ModularItemChatSetting.PER_MODULE:
			msg += newOption.ModuleName;
			break;
	}
	ChatRoomPublishCustomAction(msg, false, dictionary.build());
}

/**
 * Generates an array of all types available for an asset based on its modular item data, filtered by the provided
 * predicate function, if needed.
 * @param {ModularItemData} data - The modular item's data
 * @param {(typeObject: Record<string, number>) => boolean} [predicate] - An optional predicate for filtering the
 * resulting types
 * @returns {string[]} - The generated array of types
 */
function ModularItemGenerateTypeList({ modules }, predicate) {
	let allowType = [{}];
	modules.forEach((module) => {
		let newCombinations = [];
		module.Options.forEach((option, i) => {
			const newTypes = allowType.map(moduleValues => Object.assign({}, moduleValues, { [module.Key]: i }));
			newCombinations = newCombinations.concat(newTypes);
		});
		allowType = newCombinations;
	});
	if (predicate) allowType = allowType.filter(predicate);
	return allowType.map(combination => {
		return modules.map(module => `${module.Key}${combination[module.Key]}`).join("");
	});
}

/**
 * Generates and sets the AllowLock and AllowLockType properties for an asset based on its modular item data. For types
 * where two independent options declare conflicting AllowLock properties (i.e. one option declares AllowLock: false and
 * another declares AllowLock: true), the resulting type will permit locking (i.e. true overrides false).
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemGenerateAllowLockType(data) {
	const {asset, modules, typeCount} = data;
	/** @type {Record<string, boolean | null>} */
	const optionAllowLockMap = {};
	// Create a mapping of partial types (i.e. the "type" for a single module) to their AllowLock values. If the
	// corresponding option doesn't explicitly set AllowLock, set the value to null to distinguish between explicit
	// and inherited AllowLock (if present, explicit should override inherited)
	for (const module of modules) {
		for (const [index, option] of Object.entries(module.Options)) {
			optionAllowLockMap[`${module.Key}${index}`] = typeof option.AllowLock === "boolean" ? option.AllowLock : null;
		}
	}

	const allowLockType = ModularItemGenerateTypeList(data, (combination) => {
		const typeParts = Object.keys(combination).map((key) => `${key}${combination[key]}`);
		// Fallback allowLock value for the type if no option explicitly sets it to true
		let allowLock = asset.AllowLock;
		for (const typePart of typeParts) {
			const optionAllowLock = optionAllowLockMap[typePart];
			if (optionAllowLock) {
				// If one of the type's options explicitly sets AllowLock: true, the type permits locks
				return true;
			} else if (optionAllowLock === false) {
				// If an option explicitly sets AllowLock: false, it overrides the asset-level AllowLock
				allowLock = false;
			}
		}

		// If no option set it to true, then return the fallback value (either the asset-level AllowLock, or false if an
		// option explicitly overrode it
		return allowLock;
	});

	TypedItemSetAllowLockType(asset, allowLockType, typeCount);
}

/**
 * Generates and assigns a modular asset's AllowType, AllowEffect and AllowBlock properties, along with the AllowTypes
 * properties on the asset layers based on the values set in its module definitions.
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemGenerateValidationProperties(data) {
	const {asset, modules} = data;
	asset.Extended = true;
	asset.AllowType = ModularItemGenerateTypeList(data);
	asset.AllowEffect = Array.isArray(asset.AllowEffect) ? asset.AllowEffect.slice() : [];
	// @ts-ignore: ignore `readonly` while still building the asset
	CommonArrayConcatDedupe(asset.AllowEffect, asset.Effect);
	asset.AllowBlock = Array.isArray(asset.Block) ? asset.Block.slice() : [];
	asset.AllowHide = Array.isArray(asset.Hide) ? asset.Hide.slice() : [];
	asset.AllowHideItem = Array.isArray(asset.HideItem) ? asset.HideItem.slice() : [];
	for (const module of modules) {
		for (const {Property} of module.Options) {
			if (Property) {
				// @ts-ignore: ignore `readonly` while still building the asset
				if (Property.Effect) CommonArrayConcatDedupe(asset.AllowEffect, Property.Effect);
				// @ts-ignore: ignore `readonly` while still building the asset
				if (Property.Block) CommonArrayConcatDedupe(asset.AllowBlock, Property.Block);
				// @ts-ignore: ignore `readonly` while still building the asset
				if (Property.Hide) CommonArrayConcatDedupe(asset.AllowHide, Property.Hide);
				// @ts-ignore: ignore `readonly` while still building the asset
				if (Property.HideItem) CommonArrayConcatDedupe(asset.AllowHideItem, Property.HideItem);
				if (Property.Tint && Array.isArray(Property.Tint) && Property.Tint.length > 0) asset.AllowTint = true;
			}
		}
	}
	ModularItemGenerateAllowLockType(data);
}

/**
 * Hide an HTML element if a given module is not active.
 * @param {ModularItemData} Data - The modular item data
 * @param {string} ID - The id of the element
 * @param {string} Module - The module that must be active
 * @returns {boolean} Whether the module is active or not
 */
function ModularItemHideElement(Data, ID, Module) {
	const Element = document.getElementById(ID);
	if (Element == null) {
		return Data.currentModule === Module;
	}

	if (Data.currentModule === Module) {
		Element.style.display = "block";
		return true;
	} else {
		Element.style.display = "none";
		return false;
	}
}
