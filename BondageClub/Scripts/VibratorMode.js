"use strict";

/**
 * An enum for the possible vibrator modes
 * @readonly
 * @type {{OFF: "Off", LOW: "Low", MEDIUM: "Medium", HIGH: "High", MAXIMUM: "Maximum", RANDOM: "Random", ESCALATE: "Escalate", TEASE: "Tease", DENY: "Deny", EDGE: "Edge"}}
 */
var VibratorMode = {
	OFF: "Off",
	LOW: "Low",
	MEDIUM: "Medium",
	HIGH: "High",
	MAXIMUM: "Maximum",
	RANDOM: "Random",
	ESCALATE: "Escalate",
	TEASE: "Tease",
	DENY: "Deny",
	EDGE: "Edge",
};

/**
 * An enum for the possible vibrator states when a vibrator is in a state machine mode
 * @type {{DEFAULT: "Default", DENY: "Deny", ORGASM: "Orgasm", REST: "Rest"}}
 */
var VibratorModeState = {
	DEFAULT: "Default",
	DENY: "Deny",
	ORGASM: "Orgasm",
	REST: "Rest",
};

/**
 * An enum for the vibrator configuration sets that a vibrator can have
 * @type {{STANDARD: "Standard", ADVANCED: "Advanced"}}
 */
var VibratorModeSet = {
	STANDARD: "Standard",
	ADVANCED: "Advanced",
};

/**
 * A record of the various available vibrator sets of vibrator modes
 * @type {{
 *     Standard: VibratingItemOption[],
 *     Advanced: VibratingItemOption[],
 * }}
 * @constant
 */
var VibratorModeOptions = {
	[VibratorModeSet.STANDARD]: [
		{
			Name: "Off",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.OFF,
				Intensity: -1,
				Effect: ["Egged"]
			},
		},
		{
			Name: "Low",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.LOW,
				Intensity: 0,
				Effect: ["Egged", "Vibrating"],
			},
		},
		{
			Name: "Medium",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.MEDIUM,
				Intensity: 1,
				Effect: ["Egged", "Vibrating"],
			},
		},
		{
			Name: "High",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.HIGH,
				Intensity: 2,
				Effect: ["Egged", "Vibrating"],
			},
		},
		{
			Name: "Maximum",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.MAXIMUM,
				Intensity: 3,
				Effect: ["Egged", "Vibrating"],
			},
		},
	],
	[VibratorModeSet.ADVANCED]: [
		{
			Name: "Random",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.RANDOM,
				Intensity: 0,
				Effect: ["Egged", "Vibrating"],
			},
			DynamicProperty: (property) => {
				property.Intensity = CommonRandomItemFromList(null, [-1, 0, 1, 2, 3]);
				property.Effect = CommonArrayConcatDedupe(
					property.Effect,
					property.Intensity >= 0 ? ["Egged", "Vibrating"] : ["Egged"],
				);
			},
		},
		{
			Name: "Escalate",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.ESCALATE,
				Intensity: 0,
				Effect: ["Egged", "Vibrating"],
			},
		},
		{
			Name: "Tease",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.TEASE,
				Intensity: 0,
				Effect: ["Egged", "Vibrating"],
			},
			DynamicProperty: (property) => {
				property.Intensity = CommonRandomItemFromList(null, [0, 1, 2, 3]);
			},
		},
		{
			Name: "Deny",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.DENY,
				Intensity: 0,
				Effect: ["Egged", "Vibrating", "Edged"],
			},
			DynamicProperty: (property) => {
				property.Intensity = CommonRandomItemFromList(null, [0, 1, 2, 3]);
			},
		},
		{
			Name: "Edge",
			OptionType: "VibratingItemOption",
			Property: {
				Mode: VibratorMode.EDGE,
				Intensity: 0,
				Effect: ["Egged", "Vibrating", "Edged"],

			},
			DynamicProperty: (property) => {
				property.Intensity = CommonRandomItemFromList(null, [0, 1]);
			},
		},
	],
};

/**
 * An alias for the vibrators OFF mode. See {@link VibratorModeOptions}.
 */
const VibratorModeOff = VibratorModeOptions[VibratorModeSet.STANDARD][0];

/** A list with all advanced vibrator mode-names. */
const VibratorModesAdvanced = VibratorModeOptions[VibratorModeSet.ADVANCED].map(o => o.Property.Mode);

/**
 * A lookup for the vibrator configurations for each registered vibrator item
 * @const
 * @type {Record<string, VibratingItemData>}
 */
const VibratorModeDataLookup = {};

/**
 * Registers a vibrator item. This automatically creates the item's load, draw, click and scriptDraw functions.
 * @param {Asset} asset - The asset being registered
 * @param {VibratingItemConfig} config - The item's vibrator item configuration
 * @param {null | ExtendedItemOption} parentOption - The extended item option of the super screen that this archetype was initialized from (if any)
 * @returns {VibratingItemData} - The generated extended item data for the asset
 */
function VibratorModeRegister(asset, config, parentOption=null) {
	const data = VibratorModeCreateData(asset, config, parentOption);

	if (IsBrowser()) {
		/** @type {ExtendedItemCallbackStruct<VibratingItemOption>} */
		const defaultCallbacks = {
			load: () => VibratorModeLoad(data.dialogPrefix.header),
			click: () => VibratorModeClick(data.modeSet, 450, data.parentOption != null),
			draw: () => VibratorModeDraw(data.modeSet, 450, data.parentOption != null),
			validate: VibratorModeValidate,
			publishAction: (...args) => VibratorModePublishAction(data, ...args),
			init: (...args) => VibratorModeInit(data.modeSet, ...args),
			scriptDraw: VibratorModeScriptDraw,
		};
		ExtendedItemCreateCallbacks(data, defaultCallbacks);
	}
	VibratorModeSetAssetProperties(data);
	return data;
}

/**
 * Generates an asset's vibrating item data
 * @param {Asset} asset - The asset to generate vibrating item data for
 * @param {VibratingItemConfig} config - The item's extended item configuration
 * @returns {VibratingItemData} - The generated vibrating item data for the asset
 */
function VibratorModeCreateData(asset,
	{ Options, ScriptHooks, BaselineProperty, Dictionary, DialogPrefix },
	parentOption=null,
) {
	const key = `${asset.Group.Name}${asset.Name}${parentOption ? parentOption.Name : ""}`;
	const modeSet = Array.isArray(Options) ? Options : Object.values(VibratorModeSet);
	DialogPrefix = DialogPrefix || {};
	return VibratorModeDataLookup[key] = {
		key,
		asset,
		parentOption,
		options: VibratorModeGetOptions(modeSet),
		modeSet: modeSet,
		functionPrefix: `Inventory${key}`,
		dynamicAssetsFunctionPrefix: `Assets${asset.Group.Name}${asset.Name}`,
		scriptHooks: ExtendedItemParseScriptHooks(ScriptHooks || {}),
		dialogPrefix: {
			header: DialogPrefix.Header || "Intensity",
			chat: DialogPrefix.Chat || "VibeMode",
			option: DialogPrefix.Option || "",
		},
		chatSetting: "default",
		drawImages: false,
		baselineProperty: CommonIsObject(BaselineProperty) ? BaselineProperty : null,
		dictionary: Array.isArray(Dictionary) ? Dictionary : [],
		chatTags: [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
			CommonChatTags.ASSET_NAME,
		],
	};
}

/**
 * Gather all extended item options for a given list of modes.
 * @param {readonly VibratorModeSet[]} modeSet
 * @returns {VibratingItemOption[]}
 */
function VibratorModeGetOptions(modeSet=Object.values(VibratorModeSet)) {
	const options = [];
	for (const mode of modeSet) {
		options.push(...VibratorModeOptions[mode]);
	}
	return options;
}

/**
 * Loads the vibrating item's extended item menu.
 * @param {string} prefix
 */
function VibratorModeLoad(prefix) {
	const intensity = DialogFocusItem.Property.Intensity;
	if (ExtendedItemOffsets[ExtendedItemOffsetKey()] == null) {
		ExtendedItemSetOffset(0);
	}
	DialogExtendedMessage = DialogFindPlayer(`${prefix}${intensity}`);
}

/** @type {ExtendedItemCallbacks.Validate<ExtendedItemOption>} */
function VibratorModeValidate(C, item, option, currentOption) {
	if (
		option.Property
		&& VibratorModesAdvanced.includes(option.Property.Mode)
		&& C.ArousalSettings
		&& C.ArousalSettings.DisableAdvancedVibes
	) {
		return DialogFindPlayer("ExtendedItemNoItemPermission");
	} else {
		return ExtendedItemValidate(C, item, option, currentOption);
	}
}

/**
 * Publish a vibrator action and exit the dialog of applicable
 * @param {VibratingItemData} data
 * @param {Character} C - The character wearing the item
 * @param {Item} item - The item in question
 * @param {VibratingItemOption} newOption - The newly selected option
 * @param {VibratingItemOption} previousOption - The currently selected option
 */
function VibratorModePublishAction(data, C, item, newOption, previousOption) {
	const [newProperty, prevProperty, chatPrefix] = [newOption.Property, previousOption.Property, data.dialogPrefix.chat];
	const chatData = {
		C,
		previousOption,
		newOption,
		previousIndex: data.options.indexOf(previousOption),
		newIndex: data.options.indexOf(newOption),
	};
	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data);

	const newIsAdvanced = VibratorModesAdvanced.includes(newOption.Name);
	const prevIsAdvanced = VibratorModesAdvanced.includes(previousOption.Name);
	let message = (typeof chatPrefix === "function") ? chatPrefix(chatData) : chatPrefix;
	if (!newIsAdvanced && !prevIsAdvanced) { // standard -> standard
		const direction = newProperty.Intensity > prevProperty.Intensity ? "Increase" : "Decrease";
		message += `${direction}To${newProperty.Intensity}`;
	} else if (newIsAdvanced) { // standard/advanced -> advanced
		message += newOption.Name;
	} else { // advanced -> standard
		message += `IncreaseTo${newProperty.Intensity}`;
	}
	ChatRoomPublishCustomAction(message, false, dictionary.build());
}

/**
 * Sets asset properties common to all vibrating items
 * @param {VibratingItemData} data - The vibrating item data for the asset
 * @returns {void} - Nothing
 */
function VibratorModeSetAssetProperties(data) {
	const { asset } = data;
	asset.DynamicScriptDraw = true;
	asset.Extended = true;
	VibratorModeSetAllowEffect(data);
	if (data.parentOption === null) {
		asset.AllowType = Object.values(VibratorMode);
		VibratorModeSetEffect(data);
	}
}

/**
 * Sets the AllowEffect property for a vibrating item
 * @param {VibratingItemData} data - The vibrating item data for the asset
 * @returns {void} - Nothing
 */
function VibratorModeSetAllowEffect({asset, modeSet}) {
	asset.AllowEffect = Array.isArray(asset.AllowEffect) ? [...asset.AllowEffect] : [];
	// @ts-ignore: ignore `readonly` while still building the asset
	CommonArrayConcatDedupe(asset.AllowEffect, ["Egged", "Vibrating"]);
	if (modeSet.includes(VibratorModeSet.ADVANCED)) {
		// @ts-ignore: ignore `readonly` while still building the asset
		CommonArrayConcatDedupe(asset.AllowEffect, ["Edged"]);
	}
}

/**
 * Sets the Effect property for a vibrating item
 * @param {VibratingItemData} data - The vibrating item data for the asset
 * @returns {void} - Nothing
 */
function VibratorModeSetEffect({asset}) {
	asset.Effect = Array.isArray(asset.Effect) ? [...asset.Effect] : [];
	// @ts-ignore: ignore `readonly` while still building the asset
	CommonArrayConcatDedupe(asset.Effect, ["Egged"]);
}

/**
 * Generate coordinates for vibrator buttons
 * @param {readonly VibratorModeSet[]} modeSet - The vibrator mode sets for the item
 * @param {number} Y - The y-coordinate at which to start drawing the controls
 * @returns {[X: number, Y: number][]} - The button coordinates
 */
function VibratorModeGenerateCoords(modeSet, Y=450) {
	/** @type {[X: number, Y: number][]} */
	const coords = [];
	modeSet.forEach((modeName) => {
		const OptionGroup = VibratorModeOptions[modeName];
		OptionGroup.forEach((_, i) => {
			const X = 1135 + (i % 3) * 250;
			if (i % 3 === 0) Y += 80;
			coords.push([X, Y]);
		});
		Y += 40;
	});
	return coords;
}

/**
 * Common draw function for vibrators
 * @param {readonly VibratorModeSet[]} modeSet - The vibrator mode sets for the item
 * @param {number} [Y] - The y-coordinate at which to start drawing the controls
 * @param {boolean} IgnoreSubscreen - Whether loading subscreen draw functions should be ignored.
 * Should be set to `true` to avoid infinite recursions if the the subscreen also calls this function.
 * @returns {void} - Nothing
 */
function VibratorModeDraw(modeSet, Y=450, IgnoreSubscreen=false) {
	const coords = VibratorModeGenerateCoords(modeSet, Y);
	const actualOptions = VibratorModeGetOptions(modeSet);
	TypedItemDraw(actualOptions, "", 10, false, coords, IgnoreSubscreen);
}

/**
 * Common click function for vibrators
 * @param {readonly VibratorModeSet[]} modeSet - The vibrator mode sets for the item
 * @param {number} [Y] - The y-coordinate at which the extended item controls were drawn
 * @param {boolean} IgnoreSubscreen - Whether loading subscreen draw functions should be ignored.
 * Should be set to `true` to avoid infinite recursions if the the subscreen also calls this function.
 * @returns {void} - Nothing
 */
function VibratorModeClick(modeSet, Y=450, IgnoreSubscreen=false) {
	const coords = VibratorModeGenerateCoords(modeSet, Y);
	const options = VibratorModeGetOptions(modeSet);
	TypedItemClick(options, 10, false, coords, IgnoreSubscreen);
}

/**
 * Gets a vibrator mode from VibratorModeOptions
 * @param {VibratorMode} ModeName - The name of the mode from VibratorMode, e.g. VibratorMode.OFF
 * @returns {VibratingItemOption} - The option gotten
 */
function VibratorModeGetOption(ModeName) {
	const options = VibratorModeGetOptions();
	return options.find(o => o.Name === ModeName) || VibratorModeOff;
}

/**
 * @typedef {{ Mode?: VibratorMode, ChangeTime?: number, LastChange?: number }} VibratorModePersistentData
 */

/**
 * Common dynamic script draw function for vibrators. This function is called every frame. TO make use of dynamic script draw on vibrators,
 * ensure your item has a `Assets<AssetGroup><AssetName>ScriptDraw` function defined that calls this function, and that your asset
 * definition in Female3DCG.js has `DynamicScriptDraw: true` set. See the Heart Piercings for examples.
 * @type {ExtendedItemCallbacks.ScriptDraw<VibratorModePersistentData>}
 */
function VibratorModeScriptDraw(Data) {
	var C = Data.C;
	// Only run vibrator updates on the player and NPCs
	if (C.ID !== 0 && C.MemberNumber !== null) return;

	var Item = Data.Item;
	// No need to update the vibrator if it has no mode
	if (!Item.Property || !Item.Property.Mode) return;

	var PersistentData = Data.PersistentData();
	var ModeChanged = Item.Property.Mode !== PersistentData.Mode;
	if (ModeChanged || typeof PersistentData.ChangeTime !== "number") PersistentData.ChangeTime = CommonTime() + 60000;
	if (ModeChanged || typeof PersistentData.LastChange !== "number") PersistentData.LastChange = CommonTime();
	if (ModeChanged) PersistentData.Mode = Item.Property.Mode;

	if (CommonTime() > PersistentData.ChangeTime) {
		CommonCallFunctionByName("VibratorModeUpdate" + Item.Property.Mode, Item, C, PersistentData);
		PersistentData.Mode = Item.Property.Mode;
	}
}

/**
 * Vibrator update function for the Random mode
 * @param {Item} Item - The item that is being updated
 * @param {Character} C - The character that the item is equipped on
 * @param {VibratorModePersistentData} PersistentData - Persistent animation data for the item
 * @returns {void} - Nothing
 */
function VibratorModeUpdateRandom(Item, C, PersistentData) {
	const OldIntensity = Item.Property.Intensity;
	/** @type {VibratorIntensity} */
	const Intensity = CommonRandomItemFromList(OldIntensity, [-1, 0, 1, 2, 3]);
	/** @type {EffectName[]} */
	const Effect = Intensity === -1 ? ["Egged"] : ["Egged", "Vibrating"];
	const option = VibratorModeGetOption(PersistentData.Mode);
	ExtendedItemSetOption(C, Item, option.Property, { Mode: PersistentData.Mode, Intensity, Effect });

	// Next update in 1-3 minutes
	const OneMinute = 60000;
	PersistentData.ChangeTime = Math.floor(CommonTime() + OneMinute + Math.random() * 2 * OneMinute);
	VibratorModePublish(C, Item, OldIntensity, Intensity);
}

/**
 * Vibrator update function for the Escalate mode
 * @param {Item} Item - The item that is being updated
 * @param {Character} C - The character that the item is equipped on
 * @param {VibratorModePersistentData} PersistentData - Persistent animation data for the item
 * @returns {void} - Nothing
 */
function VibratorModeUpdateEscalate(Item, C, PersistentData) {
	const OldIntensity = Item.Property.Intensity;
	const Intensity = /** @type {VibratorIntensity} */((OldIntensity + 1) % 4);
	const option = VibratorModeGetOption(PersistentData.Mode);
	ExtendedItemSetOption(C, Item, option.Property, { Mode: PersistentData.Mode, Intensity, Effect: ["Egged", "Vibrating"] });

	// As intensity increases, time between updates decreases
	const TimeFactor = Math.pow((5 - Intensity), 1.8);
	const TimeToNextUpdate = (8000 + Math.random() * 4000) * TimeFactor;
	PersistentData.ChangeTime = Math.floor(CommonTime() + TimeToNextUpdate);
	VibratorModePublish(C, Item, OldIntensity, Intensity);
}

/**
 * Vibrator update function for the Tease mode
 * @param {Item} Item - The item that is being updated
 * @param {Character} C - The character that the item is equipped on
 * @param {VibratorModePersistentData} PersistentData - Persistent animation data for the item
 * @returns {void} - Nothing
 */
function VibratorModeUpdateTease(Item, C, PersistentData) {
	// Tease mode allows orgasm and denial states once arousal gets high enough
	VibratorModeUpdateStateBased(Item, C, PersistentData, [VibratorModeState.DENY, VibratorModeState.ORGASM]);
}

/**
 * Vibrator update function for the Deny mode
 * @param {Item} Item - The item that is being updated
 * @param {Character} C - The character that the item is equipped on
 * @param {VibratorModePersistentData} PersistentData - Persistent animation data for the item
 * @returns {void} - Nothing
 */
function VibratorModeUpdateDeny(Item, C, PersistentData) {
	// Deny mode only allows the denial state on high arousal
	VibratorModeUpdateStateBased(Item, C, PersistentData, [VibratorModeState.DENY]);
}

/**
 * Vibrator update function for the Edge mode
 * @param {Item} Item - The item that is being updated
 * @param {Character} C - The character that the item is equipped on
 * @param {VibratorModePersistentData} PersistentData - Persistent animation data for the item
 * @returns {void} - Nothing
 */
function VibratorModeUpdateEdge(Item, C, PersistentData) {
	const OldIntensity = Item.Property.Intensity;
	const Intensity = /** @type {VibratorIntensity} */(Math.min(Item.Property.Intensity + 1, 3));
	const option = VibratorModeGetOption(PersistentData.Mode);
	ExtendedItemSetOption(C, Item, option.Property, { Mode: PersistentData.Mode, Intensity, Effect: ["Egged", "Vibrating", "Edged"] });

	if (Intensity === 3) {
		// If we've hit max intensity, no more changes needed
		PersistentData.ChangeTime = Infinity;
	} else {
		const OneMinute = 60000;
		// Next update 1-2 minutes from now
		PersistentData.ChangeTime = Math.floor(CommonTime() + OneMinute + Math.random() * OneMinute);
	}
	VibratorModePublish(C, Item, OldIntensity, Intensity);
}

/**
 * Vibrator update function for vibrator state machine modes
 * @param {Item} Item - The item that is being updated
 * @param {Character} C - The character that the item is equipped on
 * @param {VibratorModePersistentData} PersistentData - Persistent animation data for the item
 * @param {readonly VibratorModeState[]} TransitionsFromDefault - The possible vibrator states that may be transitioned to from
 * the default state
 * @returns {void} - Nothing
 */
function VibratorModeUpdateStateBased(Item, C, PersistentData, TransitionsFromDefault) {
	var Arousal = C.ArousalSettings.Progress;
	var TimeSinceLastChange = CommonTime() - PersistentData.LastChange;
	var OldState = Item.Property.State || VibratorModeState.DEFAULT;
	var OldIntensity = Item.Property.Intensity;

	var NewStateAndIntensity = CommonCallFunctionByName(
		"VibratorModeStateUpdate" + OldState,
		C,
		Arousal,
		TimeSinceLastChange,
		OldIntensity,
		TransitionsFromDefault
	);
	var State = NewStateAndIntensity.State;
	var Intensity = NewStateAndIntensity.Intensity;

	if (!State) State = VibratorModeState.DEFAULT;
	if (typeof Intensity !== "number" || Intensity < -1 || Intensity > 3) Intensity = OldIntensity;

	/** @type {EffectName[]} */
	var Effect = ["Egged"];
	if (State === VibratorModeState.DENY || Item.Property.Mode === VibratorMode.DENY) Effect.push("Edged");
	if (Intensity !== -1) Effect.push("Vibrating");

	const option = VibratorModeGetOption(PersistentData.Mode);
	ExtendedItemSetOption(C, Item, option.Property, { Mode: PersistentData.Mode, State, Intensity, Effect }, false);

	Object.assign(PersistentData, {
		ChangeTime: CommonTime() + 5000,
		LastChange: Intensity !== OldIntensity ? CommonTime() : PersistentData.LastChange,
	});

	VibratorModePublish(C, Item, OldIntensity, Intensity);
}

/**
 * Vibrator update function for vibrator state machine modes in the Default state
 * @param {Character} C - The character that the item is equipped on
 * @param {number} Arousal - The current arousal of the character
 * @param {number} TimeSinceLastChange - The time in milliseconds since the vibrator intensity was last changed
 * @param {VibratorIntensity} OldIntensity - The current intensity of the vibrating item
 * @param {readonly VibratorModeState[]} TransitionsFromDefault - The possible vibrator states that may be transitioned to from
 * the default state
 * @returns {StateAndIntensity} - The updated state and intensity of the vibrator
 */
function VibratorModeStateUpdateDefault(C, Arousal, TimeSinceLastChange, OldIntensity, TransitionsFromDefault) {
	var OneMinute = 60000;
	/** @type {VibratorModeState} */
	var State = VibratorModeState.DEFAULT;
	var Intensity = OldIntensity;
	// If arousal is high, decide whether to deny or orgasm, based on provided transitions
	if (Arousal > 90) State = CommonRandomItemFromList(VibratorModeState.DEFAULT, TransitionsFromDefault);
	// If it's been at least a minute since the last intensity change, there's a small chance to change intensity
	if (TimeSinceLastChange > OneMinute && Math.random() < 0.1) Intensity = CommonRandomItemFromList(OldIntensity, [0, 1, 2, 3]);
	return { State, Intensity };
}

/**
 * Vibrator update function for vibrator state machine modes in the Deny state
 * @param {Character} C - The character that the item is equipped on
 * @param {number} Arousal - The current arousal of the character
 * @param {number} TimeSinceLastChange - The time in milliseconds since the vibrator intensity was last changed
 * @param {VibratorIntensity} OldIntensity - The current intensity of the vibrating item
 * the default state
 * @returns {StateAndIntensity} - The updated state and intensity of the vibrator
 */
function VibratorModeStateUpdateDeny(C, Arousal, TimeSinceLastChange, OldIntensity) {
	var OneMinute = 60000;
	/** @type {VibratorModeState} */
	var State = VibratorModeState.DENY;
	var Intensity = OldIntensity;
	if (Arousal >= 95 && TimeSinceLastChange > OneMinute && Math.random() < 0.2) {
		if (Player.IsEdged()) {
			// In deny mode, there's a small chance to change to give a fake orgasm and then go to rest mode after a minute
			// Here we give the fake orgasm, passing a special parameter that indicates we bypass the usual restriction on Edge
			ActivityOrgasmPrepare(C, true);
		}

		// Set the vibrator to rest
		State = VibratorModeState.REST;
		Intensity = -1;
	} else if (Arousal >= 95) {
		// If arousal is too high, change intensity back down to tease
		Intensity = 0;
	} else if (TimeSinceLastChange > OneMinute && Math.random() < 0.1) {
		// Otherwise, there's a small chance to change intensity if it's been more than a minute since the last change
		Intensity = CommonRandomItemFromList(OldIntensity, [0, 1, 2, 3]);
	}
	return { State, Intensity };
}

/**
 * Vibrator update function for vibrator state machine modes in the Orgasm state
 * @param {Character} C - The character that the item is equipped on
 * @param {number} Arousal - The current arousal of the character
 * @param {number} TimeSinceLastChange - The time in milliseconds since the vibrator intensity was last changed
 * @param {VibratorIntensity} OldIntensity - The current intensity of the vibrating item
 * the default state
 * @returns {StateAndIntensity} - The updated state and intensity of the vibrator
 */
function VibratorModeStateUpdateOrgasm(C, Arousal, TimeSinceLastChange, OldIntensity) {
	var OneMinute = 60000;
	/** @type {VibratorModeState} */
	var State = VibratorModeState.ORGASM;
	var Intensity = OldIntensity;
	if (C.ArousalSettings.OrgasmStage > 0) {
		// If we're in orgasm mode and the player is either resisting or mid-orgasm, change back to either rest or default mode
		State = Math.random() < 0.75 ? VibratorModeState.REST : VibratorModeState.DEFAULT;
	} else if (TimeSinceLastChange > OneMinute && Math.random() < 0.1) {
		// Otherwise, if it's been over a minute since the last intensity change, there's a small chance to change intensity
		Intensity = CommonRandomItemFromList(OldIntensity, [0, 1, 2, 3]);
	}
	return { State, Intensity };
}

/**
 * Vibrator update function for vibrator state machine modes in the Rest state
 * @param {Character} C - The character that the item is equipped on
 * @param {number} Arousal - The current arousal of the character
 * @param {number} TimeSinceLastChange - The time in milliseconds since the vibrator intensity was last changed
 * @param {VibratorIntensity} OldIntensity - The current intensity of the vibrating item
 * the default state
 * @returns {StateAndIntensity} - The updated state and intensity of the vibrator
 */
function VibratorModeStateUpdateRest(C, Arousal, TimeSinceLastChange, OldIntensity) {
	var FiveMinutes = 5 * 60000;
	var TenMinutes = 10 * 60000;
	/** @type {VibratorModeState} */
	var State = VibratorModeState.REST;
	/** @type {VibratorIntensity} */
	var Intensity = -1;
	if (TimeSinceLastChange > FiveMinutes && Math.random() < Math.pow((TimeSinceLastChange - FiveMinutes) / TenMinutes, 2)) {
		// Rest between 5 and 15 minutes (probably of change gets increasingly more likely as time approaches 15 minutes)
		State = VibratorModeState.DEFAULT;
		Intensity = CommonRandomItemFromList(OldIntensity, [0, 1, 2, 3]);
	}
	return { State, Intensity };
}

/**
 * Publishes a chatroom message for an automatic change in vibrator intensity. Does nothing if the vibrator's intensity
 * did not change.
 * @param {Character} C - The character that the vibrator is equipped on
 * @param {Item} Item - The vibrator item
 * @param {number} OldIntensity - The previous intensity of the vibrator
 * @param {number} Intensity - The new intensity of the vibrator
 * @returns {void} - Nothing
 */
function VibratorModePublish(C, Item, OldIntensity, Intensity) {
	// If the intensity hasn't changed, don't publish a chat message
	if (OldIntensity === Intensity) return;

	var Direction = Intensity > OldIntensity ? "Increase" : "Decrease";
	const Dictionary = new DictionaryBuilder()
		.targetCharacterName(C)
		.asset(Item.Asset)
		.markAutomatic()
		.build();

	if (CurrentScreen == "ChatRoom") {
		// TODO: Use `VibratingItemData.dialogPrefix.chat` rather than hard-coding "VibeMode"
		ServerSend("ChatRoomChat", { Content: `VibeMode${Direction}To${Intensity}`, Type: "Action", Dictionary });
		CharacterLoadEffect(C);
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
		ActivityChatRoomArousalSync(C);
	}
}

/**
 * Initialize the vibrating item properties
 * @param {VibratorModeSet[]} modeSet optional list with the names of all supported configuration sets.
 * @param {Item} Item - The item in question
 * @param {Character} C - The character that has the item equiped
 * @param {boolean} Refresh - Whether the character and relevant item should be refreshed and pushed to the server
 * @returns {boolean} Whether properties were initialized or not
 */
function VibratorModeInit(modeSet, C, Item, Refresh=true) {
	const options = VibratorModeGetOptions(modeSet);
	if (CommonIsObject(Item.Property) && options.some(o => o.Name === Item.Property.Mode)) {
		return false;
	}

	const Options = VibratorModeGetOptions(modeSet);
	const FirstOption = Options[0] || VibratorModeOff;
	TypedItemSetOption(C, Item, Options, FirstOption, false);

	if (Refresh) {
		CharacterRefresh(C, true, false);
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}
	return true;
}
