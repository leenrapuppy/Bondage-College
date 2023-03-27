"use strict";

/**
 * Custom draw function.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemMouthFuturisticPanelGagDraw(OriginalFunction) {
	if (!FuturisticAccessDraw(OriginalFunction)) {
		return;
	}

	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.MODULAR);
	if (ModularItemModuleIsActive(ModularItemBase) && Data != null) {
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

/**
 * Custom click function.
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemMouthFuturisticPanelGagClick(OriginalFunction) {
	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.MODULAR);
	if (Data == null) {
		return;
	}

	const GagBefore = ModularItemParseCurrent(Data)[0];
	if (!FuturisticAccessClick(OriginalFunction) || !DialogFocusItem) {
		return;
	}
	const GagAfter = ModularItemParseCurrent(Data)[0];

	// Reset the remaining deflation time if someone manually changes the gag mode
	if (GagBefore !== GagAfter) {
		DialogFocusItem.Property.AutoPunishUndoTime = 0;
	}

	if (ModularItemModuleIsActive(ModularItemBase)) {
		if (MouseIn(1637, 750, 225, 50)) {
			const C = CharacterGetCurrent();
			ExtendedItemCustomClick(
				`${Data.dialogPrefix.option}Pump`,
				() => InventoryItemMouthFuturisticPanelGagTrigger(C, DialogFocusItem, false),
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
 * @param {boolean} Deflate - Whether this function is triggered by an automatic deflation or not
 * @param {number[]} PreviousModuleValues - The current modules values prior to inflation
 * @return {number[]} - The new module values
 */
function InventoryItemMouthFuturisticPanelGagTriggerGetOptions(C, Item, Deflate, PreviousModuleValues) {
	const Data = ExtendedItemGetData(Item, ExtendedArchetype.MODULAR);
	if (Data == null) {
		return PreviousModuleValues;
	}

	const GagOptions = Data.modules[0].Options;
	let GagIndex = PreviousModuleValues[0];
	const GagIndexMax = GagOptions.length - 1;
	let OriginalSetting = Item.Property.OriginalSetting;
	if (GagOptions[OriginalSetting] === undefined) {
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
			if (InventoryBlockedOrLimited(C, Item, GagOptions[GagIndex].Name)) {
				GagIndex -= 1;
			} else {
				break;
			}
		}
	} else {
		GagIndex = Math.min(GagIndexMax, GagIndex + 1);
		while (GagIndex <= GagIndexMax) {
			if (InventoryBlockedOrLimited(C, Item, GagOptions[GagIndex].Name)) {
				GagIndex = (GagIndex === GagIndexMax) ? PreviousModuleValues[0] : 1 + GagIndex;
			} else {
				break;
			}
		}
	}

	// Construct and return the new item options
	const NewModuleValues = PreviousModuleValues.slice();
	NewModuleValues[0] = GagIndex;
	return NewModuleValues;
}

/**
 * Helper function for handling automatic gag inflation and deflation.
 * @param {Character} C - The selected character
 * @param {Item} Item - The item in question
 * @param {boolean} Deflate - Whether this function is triggered by an automatic deflation or not
 * @return {void}
 */
function InventoryItemMouthFuturisticPanelGagTrigger(C, Item, Deflate) {
	// Construct the new module values following the deflation/inflation
	const Data = ExtendedItemGetData(Item, ExtendedArchetype.MODULAR);
	if (Data == null) {
		return;
	}
	const PreviousModuleValues = ModularItemParseCurrent(Data, Item.Property.Type);
	const NewModuleValues = InventoryItemMouthFuturisticPanelGagTriggerGetOptions(C, Item, Deflate, PreviousModuleValues);

	// The gag is already fully inflated/deflated
	if (PreviousModuleValues[0] === NewModuleValues[0]) {
		return;
	}

	// After automatically changing it, we store the original setting again
	const OriginalSetting = Item.Property.OriginalSetting;
	ModularItemSetOption(C, Item, PreviousModuleValues, NewModuleValues, Data);
	Item.Property.OriginalSetting = OriginalSetting;

	const Name = Data.modules[0].Options[NewModuleValues[0]].Name;
	InventoryItemMouthFuturisticPanelGagPublishActionTrigger(C, Item, Name, Deflate);

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


/**  @type {DynamicScriptDrawCallback} */
function AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data) {
	const Item = data.Item;
	const LastMessages = data.PersistentData().LastMessageLen;

	if (PropertyAutoPunishDetectSpeech(Item, LastMessages)) {
		InventoryItemMouthFuturisticPanelGagTrigger(data.C, Item, false);
	} else if (Item.Property.AutoPunishUndoTime - CurrentTime <= 0) {
		// Deflate the gag back to the original setting after a while
		InventoryItemMouthFuturisticPanelGagTrigger(data.C, Item, true);
	}
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemMouthFuturisticPanelGagScriptDraw(data) {
	const persistentData = data.PersistentData();
	/** @type {ItemProperties} */
	const property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
	if (typeof property.BlinkState !== "boolean") property.BlinkState = false;

	if (ChatRoomLastMessage && ChatRoomLastMessage.length != persistentData.LastMessageLen && data.Item && data.Item.Property && data.Item.Property.AutoPunish > 0)
		persistentData.ChangeTime = Math.min(persistentData.ChangeTime, CommonTime() + 400); // Trigger shortly after if the user speaks

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {
		if (CurrentScreen == "ChatRoom") {
			AssetsItemMouthFuturisticPanelGagScriptUpdatePlayer(data);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		property.BlinkState = !property.BlinkState;

		const timeToNextRefresh = 3025;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemMouthFuturisticPanelGagBeforeDraw(data) {
	if (data.L === "_Light" && data.Property && data.Property.AutoPunish > 0) {
		const Opacity = (data.Property.BlinkState) ? 1 : 0;
		if (data.Color && data.Color != "" && data.Color != "Default") {return { Opacity: Opacity };}
		else if (data.Property.AutoPunish == 1) {return { Color : "#28ff28", Opacity: Opacity };}
		else if (data.Property.AutoPunish == 2) {return { Color : "#ffff28", Opacity: Opacity };}
		else if (data.Property.AutoPunish == 3) {return { Color : "#ff3838", Opacity: Opacity };}
	}
	return data;
}
