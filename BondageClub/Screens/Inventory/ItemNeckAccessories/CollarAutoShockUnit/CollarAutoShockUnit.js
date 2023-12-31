"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemNeckAccessoriesCollarAutoShockUnitDraw(Data, OriginalFunction) {
	OriginalFunction();
	if (Data.currentModule === ModularItemBase) {
		const [ShockLevel, AutoPunish] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("ShockLevel"), 1500, 550, "White", "Gray");
		DrawText(DialogFindPlayer("AutoPunish"), 1500, 625, "White", "Gray");
		DrawText(DialogFindPlayer("ShockCount"), 1500, 700, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${ShockLevel}`), 1510, 550, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogPrefix.option}${AutoPunish}`), 1510, 625, "White", "Gray");
		DrawText(`${DialogFocusItem.Property.TriggerCount}`, 1510, 700, "White", "Gray");
		MainCanvas.textAlign = "center";

		// Display the ShowText checkbox and reset/trigger buttons
		DrawCheckbox(1175, 743, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
		DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 773, "White", "Gray");
		ExtendedItemCustomDraw("ResetShockCount", 1635, 675);
		ExtendedItemCustomDraw("TriggerShock", 1635, 750);
	}
}

/** @type {ExtendedItemScriptHookCallbacks.Click<ModularItemData>} */
function InventoryItemNeckAccessoriesCollarAutoShockUnitClick(Data, OriginalFunction) {
	OriginalFunction();
	if (DialogFocusItem && Data.currentModule === ModularItemBase) {
		if (MouseIn(1175, 768, 64, 64) && !ExtendedItemPermissionMode) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		} else if (MouseIn(1635, 700, 225, 55)) {
			ExtendedItemCustomClick("ResetShockCount", InventoryItemNeckAccessoriesCollarShockUnitResetCount);
		} else if (MouseIn(1635, 775, 225, 55)) {
			ExtendedItemCustomClick("TriggerShock", PropertyShockPublishAction);
		}
	}
}

/**
 * @typedef {{ ChangeTime?: number, LastMessageLen?: number }} AutoShockUnitPersistentData
 */

/** @type {ExtendedItemCallbacks.BeforeDraw<AutoShockUnitPersistentData>} */
function AssetsItemNeckAccessoriesCollarAutoShockUnitBeforeDraw(data) {
	if (data.L === "_Light") {
		const property = data.Property || {};
		return { Color: "#2f0", Opacity: property.BlinkState ? 0 : 1 };
	}
}

/** @type {ExtendedItemCallbacks.ScriptDraw<AutoShockUnitPersistentData>} */
function AssetsItemNeckAccessoriesCollarAutoShockUnitScriptDraw(data) {
	const persistentData = data.PersistentData();
	/** @type {ItemProperties} */
	const property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.ChangeTime !== "number") persistentData.ChangeTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;

	if (ChatRoomLastMessage && ChatRoomLastMessage.length != persistentData.LastMessageLen && data.Item && data.Item.Property && data.Item.Property.AutoPunish > 0)
		persistentData.ChangeTime = Math.min(persistentData.ChangeTime, CommonTime()); // Trigger immediately if the user speaks

	if (persistentData.ChangeTime < CommonTime()) {
		const wasBlinking = property.BlinkState;
		property.BlinkState = !wasBlinking;
		const timeToNextRefresh = wasBlinking ? 4000 : 1000;

		if (CurrentScreen == "ChatRoom" && data.C == Player) {
			if (PropertyAutoPunishDetectSpeech(data.Item, persistentData.LastMessageLen)) {
				PropertyShockPublishAction(data.C, data.Item, true);
			}
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		persistentData.ChangeTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
