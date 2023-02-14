"use strict";

/**
 * Draw the item extension screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemNeckAccessoriesCollarShockUnitDrawFunc(OriginalFunction) {
	OriginalFunction();

	MainCanvas.textAlign = "right";
	DrawText(DialogFindPlayer("ShockCount"), 1500, 575, "White", "Gray");
	MainCanvas.textAlign = "left";
	DrawText(`${DialogFocusItem.Property.TriggerCount}`, 1510, 575, "White", "Gray");
	MainCanvas.textAlign = "center";

	DrawCheckbox(1175, 618, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
	DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 648, "White", "Gray");
	ExtendedItemCustomDraw("ResetShockCount", 1635, 550);
	ExtendedItemCustomDraw("TriggerShock", 1635, 625);
}

/**
 * Catches the item extension clicks
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemNeckAccessoriesCollarShockUnitClickFunc(OriginalFunction) {
	OriginalFunction();

	if (!DialogFocusItem) {
		return;
	} else if (MouseIn(1175, 618, 64, 64) && !ExtendedItemPermissionMode) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
	} else if (MouseIn(1635, 550, 225, 55)) {
		ExtendedItemCustomClick("ResetShockCount", InventoryItemNeckAccessoriesCollarShockUnitResetCount);
	} else if (MouseIn(1635, 625, 225, 55)) {
		ExtendedItemCustomClick("TriggerShock", PropertyShockPublishAction);
	}
}

// Resets the trigger count
function InventoryItemNeckAccessoriesCollarShockUnitResetCount() {
	// Gets the current item and character
	DialogFocusItem.Property.TriggerCount = 0;
	const C = CharacterGetCurrent();
	const Dictionary = [
		{ Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber },
		{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
		{ Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name, GroupName: DialogFocusItem.Asset.Group.Name },
	];

	if (DialogFocusItem.Property.ShowText) {
		ChatRoomPublishCustomAction("ShockCountReset", false, Dictionary);
	}
}

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemNeckAccessoriesCollarShockUnitBeforeDraw(data) {
	if (data.L === "_Light") {
		/** @type {{ChangeTime?: number, DisplayCount?: number, LastTriggerCount?: number}} */
		const persistentData = data.PersistentData();
		const property = data.Property || {};
		const Triggered = persistentData.LastTriggerCount < property.TriggerCount;
		const intensity = property.ShockLevel || 0;
		const wasBlinking = property.BlinkState;
		if (wasBlinking && Triggered) persistentData.DisplayCount++;
		if (persistentData.DisplayCount >= intensity * 1.5 + 3) {
			persistentData.DisplayCount = 0;
			persistentData.LastTriggerCount = property.TriggerCount;
		}
		return { Color: Triggered ? "#f00" : "#2f0", Opacity: wasBlinking ? 0 : 1 };
	}
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data) {
	/** @type {{ChangeTime?: number, DisplayCount?: number, LastTriggerCount?: number}} */
	const persistentData = data.PersistentData();
	/** @type {ItemProperties} */
	const property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.ChangeTime !== "number") persistentData.ChangeTime = CommonTime() + 4000;
	if (typeof persistentData.DisplayCount !== "number") persistentData.DisplayCount = 0;
	if (typeof persistentData.LastTriggerCount !== "number") persistentData.LastTriggerCount = property.TriggerCount;

	const isTriggered = persistentData.LastTriggerCount < property.TriggerCount;
	const newlyTriggered = isTriggered && persistentData.DisplayCount == 0;
	if (newlyTriggered)
		persistentData.ChangeTime = Math.min(persistentData.ChangeTime, CommonTime());

	if (persistentData.ChangeTime < CommonTime()) {
		if (persistentData.LastTriggerCount > property.TriggerCount) persistentData.LastTriggerCount = 0;
		const wasBlinking = property.BlinkState;
		property.BlinkState = wasBlinking && !newlyTriggered ? false : true;
		const timeFactor = isTriggered ? 12 : 1;
		const timeToNextRefresh = (wasBlinking ? 4000 : 1000) / timeFactor;
		persistentData.ChangeTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, (5000 / timeFactor) - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
