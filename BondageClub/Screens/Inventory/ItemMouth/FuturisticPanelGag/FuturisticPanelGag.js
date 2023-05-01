"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemMouthFuturisticPanelGagDrawHook(Data, OriginalFunction) {
	if (!FuturisticAccessDraw(Data, OriginalFunction)) {
		return;
	}

	if (Data.currentModule === ModularItemBase) {
		const [Gag, AutoPunish, AutoPunishUndoTimeSetting] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];
		const AutoPunishUndoTime = DialogFocusItem.Property.AutoPunishUndoTime;
		const UndoTimer =  DialogFindPlayer(`${Data.dialogPrefix.option}${AutoPunishUndoTimeSetting}`);

		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("GagConfig"), 1500, 550, "White", "Gray");
		DrawText(DialogFindPlayer("AutoPunish"), 1500, 625, "White", "Gray");
		DrawText(DialogFindPlayer("DeflationTime"), 1500, 700, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${Gag}`), 1510, 550, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${AutoPunish}`) + ` (${UndoTimer})`, 1510, 625, "White", "Gray");
		DrawText(AutoPunishUndoTime ? TimerToString(AutoPunishUndoTime - CurrentTime) : "00:00", 1510, 700, "White", "Gray");
		MainCanvas.textAlign = "center";

		DrawCheckbox(1175, 743, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
		DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 773, "White", "Gray");
		ExtendedItemCustomDraw(`${Data.dialogPrefix.option}Pump`, 1637, 750);
	}
}

/** @type {ExtendedItemScriptHookCallbacks.Click<ModularItemData>} */
function InventoryItemMouthFuturisticPanelGagClickHook(Data, OriginalFunction) {
	const GagBefore = ModularItemParseCurrent(Data)[0];
	if (!FuturisticAccessClick(Data, OriginalFunction) || !DialogFocusItem) {
		return;
	}
	const GagAfter = ModularItemParseCurrent(Data)[0];

	// Reset the remaining deflation time if someone manually changes the gag mode
	if (GagBefore !== GagAfter) {
		DialogFocusItem.Property.AutoPunishUndoTime = 0;
	}

	if (Data.currentModule ===ModularItemBase) {
		if (MouseIn(1637, 750, 225, 50)) {
			const C = CharacterGetCurrent();
			ExtendedItemCustomClick(
				`${Data.dialogPrefix.option}Pump`,
				() => InventoryItemMouthFuturisticPanelGagTrigger(Data, C, DialogFocusItem, false),
			);
		} else if (MouseIn(1175, 743, 64, 64) && !ExtendedItemPermissionMode) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		}
	}
}

/**
 * Send message for an automatic gag inflation.
 * @param {Character} C - The selected character
 * @param {Item} Item - The item in question
 * @param {string} OptionName - The name of the newly choosen option within the `Gag` module
 * @param {boolean} Deflate - Whether the gag is deflated or not
 * @return {void} Nothing
 */
function InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, OptionName, Deflate) {
	const Data = ExtendedItemGetData(Item, ExtendedArchetype.MODULAR);
	const Prefix = (Data == null) ? "" : ExtendedItemCustomChatPrefix("Pump", Data);
	const ActionTag = `${Prefix}Pump${Deflate ? "Deflate" : "Inflate"}${OptionName}`;

	const Dictionary = new DictionaryBuilder()
		.targetCharacterName(C)
		.asset(Item.Asset)
		.markAutomatic()
		.build();

	if (Item.Property.ShowText) {
		ChatRoomPublishCustomAction(ActionTag, false, Dictionary);
	} else {
		ChatRoomMessage({ Content: ActionTag, Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary });
	}
}

/**
 * Helper function for handling automatic gag inflation and deflation.
 * @param {Character} C - The selected character
 * @param {Item} Item - The item in question
 * @param {ModularItemOption} previousOption
 * @param {readonly ModularItemOption[]} options
 * @param {boolean} Deflate - Whether this function is triggered by an automatic deflation or not
 * @returns {ModularItemOption}
 */
function InventoryItemMouthFuturisticPanelGagTriggerGetOptions(C, Item, previousOption, options, Deflate) {
	let GagIndex = previousOption.Index;
	const GagIndexMax = options.length - 1;
	let OriginalSetting = Item.Property.OriginalSetting;
	if (options[OriginalSetting] === undefined) {
		console.warn(`[${Item.Asset.Group.Name}:${Item.Asset.Name}] Sanitizing illegal "OriginalSetting" property value: ${OriginalSetting}`);
		OriginalSetting = Item.Property.OriginalSetting = 0;
	}

	/**
	 * Increment or decrement the gag level, clipping it to an appropriate interval.
	 * Also ensure that the desired gag level is not blocked and, if so,
	 * keep incrementing/decrementing until a non-blocked gag-level is reached
	 */
	if (Deflate) {
		GagIndex = Math.max(OriginalSetting, GagIndex - 1);
		while (GagIndex > OriginalSetting) {
			if (InventoryBlockedOrLimited(C, Item, options[GagIndex].Name)) {
				GagIndex -= 1;
			} else {
				break;
			}
		}
	} else {
		GagIndex = Math.min(GagIndexMax, GagIndex + 1);
		while (GagIndex <= GagIndexMax) {
			if (InventoryBlockedOrLimited(C, Item, options[GagIndex].Name)) {
				GagIndex = (GagIndex === GagIndexMax) ? previousOption.Index : 1 + GagIndex;
			} else {
				break;
			}
		}
	}
	return options[GagIndex];
}

/**
 * Helper function for handling automatic gag inflation and deflation.
 * @param {ModularItemData} data
 * @param {Character} C - The selected character
 * @param {Item} Item - The item in question
 * @param {boolean} Deflate - Whether this function is triggered by an automatic deflation or not
 * @return {void}
 */
function InventoryItemMouthFuturisticPanelGagTrigger(data, C, Item, Deflate) {
	const options = data.modules[0].Options;
	const previousModuleValues = ModularItemParseCurrent(data, Item.Property.Type);
	const previousOption = options[previousModuleValues[0]];
	const newOption = InventoryItemMouthFuturisticPanelGagTriggerGetOptions(C, Item, previousOption, options, Deflate);

	if (newOption.Name === previousOption.Name) {
		return;
	}

	// After automatically changing it, we store the original setting again
	const OriginalSetting = Item.Property.OriginalSetting;
	ExtendedItemSetOption(data, C, Item, newOption, previousOption);
	Item.Property.OriginalSetting = OriginalSetting;
	InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, newOption.Name, Deflate);

	/** @type {ExpressionTrigger[]} */
	const expressions = [
		{ Group: "Eyebrows", Name: "Soft", Timer: 10 },
		{ Group: "Blush", Name: "Extreme", Timer: 15 },
		{ Group: "Eyes", Name: "Lewd", Timer: 5 },
	];
	InventoryExpressionTriggerApply(C, expressions);

	Item.Property.AutoPunishUndoTime = CurrentTime + Item.Property.AutoPunishUndoTimeSetting; // Reset the deflation time
	CharacterRefresh(C, true); // Does not sync appearance while in the wardrobe
	ChatRoomCharacterUpdate(C);
}

/**
 * @typedef {{ LastMessageLen?: number, UpdateTime?: number, ChangeTime?: number }} FuturisticPanelGagPersistentData
 */

/**
 * @param {ModularItemData} data
 * @param {DynamicScriptCallbackData<FuturisticPanelGagPersistentData>} drawData
 */
function AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data, drawData) {
	const Item = drawData.Item;
	const LastMessages = drawData.PersistentData().LastMessageLen;

	if (PropertyAutoPunishDetectSpeech(Item, LastMessages)) {
		InventoryItemMouthFuturisticPanelGagTrigger(data, drawData.C, Item, false);
	} else if (Item.Property.AutoPunishUndoTime - CurrentTime <= 0) {
		// Deflate the gag back to the original setting after a while
		InventoryItemMouthFuturisticPanelGagTrigger(data, drawData.C, Item, true);
	}
}

/** @type {ExtendedItemScriptHookCallbacks.ScriptDraw<ModularItemData, FuturisticPanelGagPersistentData>} */
function AssetsItemMouthFuturisticPanelGagScriptDrawHook(data, originalFunction, drawData) {
	const persistentData = drawData.PersistentData();
	/** @type {ItemProperties} */
	const property = (drawData.Item.Property = drawData.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
	if (typeof property.BlinkState !== "boolean") property.BlinkState = false;

	if (ChatRoomLastMessage && ChatRoomLastMessage.length != persistentData.LastMessageLen && drawData.Item && drawData.Item.Property && drawData.Item.Property.AutoPunish > 0)
		persistentData.ChangeTime = Math.min(persistentData.ChangeTime, CommonTime() + 400); // Trigger shortly after if the user speaks

	if (persistentData.UpdateTime < CommonTime() && drawData.C == Player) {
		if (CurrentScreen == "ChatRoom") {
			AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data, drawData);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		property.BlinkState = !property.BlinkState;

		const timeToNextRefresh = 3025;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(drawData.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(drawData.C);
	}
}

/** @type {ExtendedItemScriptHookCallbacks.BeforeDraw<ModularItemData, FuturisticPanelGagPersistentData>} */
function AssetsItemMouthFuturisticPanelGagBeforeDrawHook(data, originalFunction, drawData) {
	if (drawData.L === "_Light" && drawData.Property && drawData.Property.AutoPunish > 0) {
		const Opacity = (drawData.Property.BlinkState) ? 1 : 0;
		if (drawData.Color && drawData.Color != "" && drawData.Color != "Default") {return { Opacity: Opacity };}
		else if (drawData.Property.AutoPunish == 1) {return { Color : "#28ff28", Opacity: Opacity };}
		else if (drawData.Property.AutoPunish == 2) {return { Color : "#ffff28", Opacity: Opacity };}
		else if (drawData.Property.AutoPunish == 3) {return { Color : "#ff3838", Opacity: Opacity };}
	}
	return drawData;
}
