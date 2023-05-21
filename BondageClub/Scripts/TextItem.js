"use strict";

/**
 * A lookup for the text item configurations for each registered text item
 * @const
 * @type {Record<string, TextItemData>}
 * @see {@link TextItemData}
 */
const TextItemDataLookup = {};

/**
 * Registers a typed extended item. This automatically creates the item's load, draw and click functions. It will also
 * generate the asset's AllowType array.
 * @param {Asset} asset - The asset being registered
 * @param {TextItemConfig} config - The item's typed item configuration
 * @param {null | ExtendedItemOption} parentOption
 * @param {boolean} createCallbacks - Whether the archetype-specific callbacks should be created or not
 * @returns {TextItemData} - The generated extended item data for the asset
 */
function TextItemRegister(asset, config, parentOption=null, createCallbacks=true) {
	const data = TextItemCreateTextItemData(asset, config, parentOption);
	if (IsBrowser() && createCallbacks) {
		/** @type {ExtendedItemCallbackStruct<TextItemOption>} */
		const defaultCallbacks = {
			load: () => TextItem.Load(data),
			click: () => TextItem.Click(data),
			draw: () => TextItem.Draw(data),
			publishAction: (...args) => TextItem.PublishAction(data, ...args),
			init: (...args) => TextItem.Init(data, ...args),
			exit: () => TextItem.Exit(data),
		};
		ExtendedItemCreateCallbacks(data, defaultCallbacks);
	}
	asset.Extended = true;
	return data;
}

/**
 * Generates an asset's typed item data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {TextItemConfig} config - The item's extended item configuration
 * @param {null | ExtendedItemOption} parentOption - The parent extended item option of the super screens (if any)
 * @returns {TextItemData} - The generated typed item data for the asset
 */
function TextItemCreateTextItemData(asset, {
	MaxLength,
	Font,
	DialogPrefix,
	ChatTags,
	Dictionary,
	ScriptHooks,
	BaselineProperty,
	EventListeners,
	DrawData,
	PushOnPublish,
}, parentOption=null) {
	// Gather the asset's relevant text property names
	const textNames = CommonKeys(MaxLength);

	// Specify an event listener for each text property
	const eventListeners = EventListeners || {};
	for (const name of textNames) {
		if (typeof eventListeners[name] !== "function") {
			eventListeners[name] = asset.DynamicAfterDraw ? TextItemChange : TextItemChangeNoCanvas;
		}
	}

	DrawData = DrawData || {};
	const itemsPerPage = DrawData.ItemsPerPage || 8;
	const positions = DrawData.Positions || textNames.map((name, i) => {
		return [1505, 600 + (80 * (i % itemsPerPage))];
	});
	if (positions.length !== textNames.length) {
		console.error(`${asset.Group.Name}:${asset.Name}: text archetype MaxLength and drawdata Positions must be of the same length`);
	}

	const baselineProperty = BaselineProperty || {};
	for (const name of textNames) {
		if (typeof baselineProperty[name] !== "string") {
			baselineProperty[name] = "";
		}
	}

	DialogPrefix = DialogPrefix || {};
	const key = `${asset.Group.Name}${asset.Name}${parentOption == null ? "" : parentOption.Name}`;
	return TextItemDataLookup[key] = {
		asset,
		key,
		maxLength: MaxLength,
		font: typeof Font === "string" ? Font : null,
		functionPrefix: `Inventory${key}`,
		dynamicAssetsFunctionPrefix: `Assets${asset.Group.Name}${asset.Name}`,
		dialogPrefix: {
			header: DialogPrefix.Header || `TextItemSelect`,
			chat: DialogPrefix.Chat || "TextItem",
		},
		chatTags: Array.isArray(ChatTags) ? ChatTags : [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
			CommonChatTags.ASSET_NAME,
		],
		scriptHooks: ExtendedItemParseScriptHooks(ScriptHooks || {}),
		dictionary: Dictionary || [],
		chatSetting: "default",
		drawImages: false,
		baselineProperty,
		eventListeners,
		textNames,
		parentOption,
		drawData: {
			itemsPerPage,
			positions,
			drawImages: false,
			paginate: positions.length > itemsPerPage,
			pageCount: Math.ceil(positions.length / itemsPerPage),
		},
		pushOnPublish: typeof PushOnPublish === "boolean" ? PushOnPublish : true,
	};
}

const TextItem = {
	/**
	 * Init function for items with text input fields.
	 * @param {TextItemData} data
	 * @param {Character} C — The character that has the item equiped
	 * @param {Item} item — The item in question
	 * @param {boolean} refresh — Whether the character and relevant item should be refreshed and pushed to the server
	 */
	Init: function ({ asset, font, baselineProperty, maxLength }, C, item, refresh=true) {
		if (font != null) {
			DynamicDrawLoadFont(font);
		}

		let changed = false;
		if (!CommonIsObject(item.Property)) {
			changed = true;
			item.Property = {};
		}

		for (const [field, length] of CommonEntries(maxLength)) {
			const textProperty = item.Property[field];
			if (!(typeof textProperty === "string" && DynamicDrawTextRegex.test(textProperty))) {
				item.Property[field] = baselineProperty[field];
				changed = true;
			} else if (textProperty.length > length) {
				item.Property[field] = textProperty.slice(0, textProperty.length);
				changed = true;
			}
		}

		if (refresh && changed) {
			CharacterRefresh(C, true, false);
			ChatRoomCharacterItemUpdate(C, asset.Group.Name);
		}
		return changed;
	},
	/**
	 * Load function for items with text input fields.
	 * @param {TextItemData} data
	 */
	Load: function (data) {
		ExtendedItemLoad(data);

		const { asset, eventListeners, maxLength } = data;
		const item = (asset.IsLock) ? DialogFocusSourceItem : DialogFocusItem;
		const C = CharacterGetCurrent();
		for (const [name, length] of CommonEntries(maxLength)) {
			const ID = PropertyGetID(name, item);
			if (!PropertyOriginalValue.has(ID)) {
				PropertyOriginalValue.set(ID, item.Property[name]);
			}

			const textInput = ElementCreateInput(ID, "text", item.Property[name], length);
			if (textInput) {
				const callback = eventListeners[name];
				textInput.pattern = DynamicDrawTextInputPattern;
				textInput.addEventListener("input", (e) => {
					const innerItem = (asset.IsLock) ? DialogFocusSourceItem : DialogFocusItem;
					callback(C, innerItem, name, /** @type {HTMLInputElement} */ (e.target).value);
				});
			}
		}
	},
	/**
	 * Draw handler for extended item screens with text input fields.
	 * @param {TextItemData} data - The items extended item data
	 */
	Draw: function ({ asset, drawData, textNames }) {
		ExtendedItemDrawHeader();
		DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
		if (drawData.paginate) {
			DrawButton(1665, 240, 90, 90, "", "White", "Icons/Prev.png");
			DrawButton(1775, 240, 90, 90, "", "White", "Icons/Next.png");
		}

		const item = (asset.IsLock) ? DialogFocusSourceItem : DialogFocusItem;
		const offset = ExtendedItemGetOffset();
		const positions = drawData.positions.slice(offset, offset + drawData.itemsPerPage);
		positions.forEach(([x, y, width, height], i) => {
			const name = textNames[i];
			const ID = PropertyGetID(name, item);
			ElementPosition(ID, x, y, width || 400, height);
		});
	},
	/**
	 * Click handler for extended item screens with text input fields.
	 * @param {TextItemData} data - The items extended item data
	 */
	Click: function ({ functionPrefix, drawData }) {
		if (MouseIn(1885, 25, 90, 90)) {
			if (ExtendedItemSubscreen) {
				CommonCallFunctionByName(`${functionPrefix}Exit`);
				ExtendedItemSubscreen = null;
			} else {
				ExtendedItemExit();
			}
		} else if (drawData.paginate) {
			const currentPage = Math.floor(ExtendedItemGetOffset() / drawData.itemsPerPage);
			if (MouseIn(1665, 240, 90, 90)) {
				const newPage = (currentPage + drawData.pageCount - 1) % drawData.pageCount;
				ExtendedItemSetOffset(drawData.itemsPerPage * newPage);
			} else if (MouseIn(1775, 240, 90, 90)) {
				const newPage = (currentPage + drawData.pageCount + 1) % drawData.pageCount;
				ExtendedItemSetOffset(drawData.itemsPerPage * newPage);
			}
		}
	},
	/**
	 * Exit function for items with text input fields.
	 * @param {TextItemData} data - The items extended item data
	 * @param {boolean} publishAction - Whether
	 */
	Exit: function (data, publishAction=true) {
		if (publishAction) {
			const C = CharacterGetCurrent();
			const { newOption, previousOption } = TextItemConstructOptions(data, DialogFocusItem);
			const requirementMessage = ExtendedItemRequirementCheckMessage(DialogFocusItem, C, newOption, previousOption);
			if (requirementMessage) {
				TextItemPropertyRevert(data, DialogFocusItem);
			} else {
				/** @type {Parameters<ExtendedItemCallbacks.PublishAction<TextItemOption>>} */
				const args = [C, DialogFocusItem, newOption, previousOption];
				CommonCallFunctionByNameWarn(`${data.functionPrefix}PublishAction`, ...args);
				if (data.pushOnPublish) {
					CharacterRefresh(C, false, false);
					ChatRoomCharacterItemUpdate(C, data.asset.Group.Name);
				}
			}
		}

		for (const name of data.textNames) {
			const ID = PropertyGetID(name, DialogFocusItem);
			ElementRemove(ID);
			PropertyOriginalValue.delete(ID);
		}
	},
	/**
	 * Exit function for items with text input fields.
	 * @param {TextItemData} data - The items extended item data
	 * @param {Character} C - The character in question
	 * @param {Item} item - The item in question
	 * @param {TextItemOption} newOption
	 * @param {TextItemOption} previousOption
	 */
	PublishAction: function (data, C, item, newOption, previousOption) {
		const oldText = data.textNames.map((p) => previousOption.Property[p]).filter(Boolean).join(" ");
		const newText = data.textNames.map((p) => newOption.Property[p]).filter(Boolean).join(" ");
		if (oldText === newText) {
			return;
		}

		if (CurrentScreen === "ChatRoom") {
			/** @type {ExtendedItemChatData<TextItemOption>} */
			const chatData = {
				C,
				previousOption,
				newOption,
				previousIndex: -1,
				newIndex: -1,
			};
			const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data);
			dictionary.text("NewText", newText);

			// Avoid `ChatRoomPublishCustomAction` for tighter control over character refreshing
			const suffix = (newText === "") ? "Remove" : "Change";
			const prefix = (typeof data.dialogPrefix.chat === "function") ? data.dialogPrefix.chat(chatData) : data.dialogPrefix.chat;
			ServerSend(
				"ChatRoomChat",
				{ Content: `${prefix}${suffix}`, Type: "Action", Dictionary: dictionary.build() }
			);
		}
	}
};

/**
 * Throttled callback for handling text changes.
 * @type {TextItemEventListener}
 */
const TextItemChange = CommonLimitFunction((C, item, name, text) => {
	if (DynamicDrawTextRegex.test(text)) {
		item.Property[name] = text;
		CharacterLoadCanvas(C);
	}
});

/**
 * Throttled callback for handling text changes that do not require a canvas.
 * @type {TextItemEventListener}
 */
const TextItemChangeNoCanvas = CommonLimitFunction((C, item, name, text) => {
	if (DynamicDrawTextRegex.test(text)) {
		item.Property[name] = text;
	}
});

/**
 * @param {TextItemData} data - The extended item data
 * @param {Item} item - The item in question
 * @returns {{ newOption: TextItemOption, previousOption: TextItemOption }}
 */
function TextItemConstructOptions({ textNames }, item) {
	/** @type {TextItemOption} */
	const newOption = { Name: "newOption", OptionType: "TextItemOption", Property: {} };
	/** @type {TextItemOption} */
	const previousOption = { Name: "previousOption", OptionType: "TextItemOption", Property: {} };

	for (const name of textNames) {
		const ID = PropertyGetID(name, item);
		previousOption.Property[name] = PropertyOriginalValue.get(ID);
		newOption.Property[name] = item.Property[name];
	}
	return { newOption, previousOption };
}

/**
 * Revert all text item properties back to their previous state prior to opening the extended item menu
 * @param {TextItemData} data - The extended item data
 * @param {Item} item - The item in question
 */
function TextItemPropertyRevert({ textNames }, item) {
	for (const name of textNames) {
		const ID = PropertyGetID(name, item);
		item.Property[name] = PropertyOriginalValue.get(ID);
	}
}
