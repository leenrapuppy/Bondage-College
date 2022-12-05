"use strict";


var AutoShockGagActionFlag = false;

/**
 * Draw the item extension screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemNeckAccessoriesCollarAutoShockUnitDraw(OriginalFunction) {
	OriginalFunction();
	if (ModularItemModuleIsActive(ModularItemBase)) {
		const Data = ModularItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
		const [ShockLevel, Sensitivity] = ModularItemDeconstructType(DialogFocusItem.Property.Type) || [];

		// Display option information
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("ShockLevel"), 1500, 550, "White", "Gray");
		DrawText(DialogFindPlayer("Sensitivity"), 1500, 625, "White", "Gray");
		DrawText(DialogFindPlayer("ShockCount"), 1500, 700, "White", "Gray");
		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${ShockLevel}`), 1510, 550, "White", "Gray");
		DrawText(DialogFindPlayer(`${Data.dialogOptionPrefix}${Sensitivity}`), 1510, 625, "White", "Gray");
		DrawText(`${DialogFocusItem.Property.TriggerCount}`, 1510, 700, "White", "Gray");
		MainCanvas.textAlign = "center";

		// Display the ShowText checkbox and reset/trigger buttons
		DrawCheckbox(1175, 743, 64, 64, "", DialogFocusItem.Property.ShowText, ExtendedItemPermissionMode);
		DrawText(DialogFindPlayer("ShowMessageInChat"), 1420, 773, "White", "Gray");
		ExtendedItemCustomDraw("ResetShockCount", 1635, 675);
		ExtendedItemCustomDraw("TriggerShock", 1635, 750);
	}
}

/**
 * Catches the item extension clicks
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} Nothing
 */
function InventoryItemNeckAccessoriesCollarAutoShockUnitClick(OriginalFunction) {
	OriginalFunction();
	if (DialogFocusItem && ModularItemModuleIsActive(ModularItemBase)) {
		if (MouseIn(1175, 768, 64, 64) && !ExtendedItemPermissionMode) {
			DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		} else if (MouseIn(1635, 700, 225, 55)) {
			ExtendedItemCustomClick("ResetShockCount", InventoryItemNeckAccessoriesCollarShockUnitResetCount);
		} else if (MouseIn(1635, 775, 225, 55)) {
			ExtendedItemCustomClick("TriggerShock", PropertyShockPublishAction);
		}
	}
}

function InventoryItemNeckAccessoriesCollarAutoShockUnitDetectSpeech(Sensitivity, Emote, Keywords, LastMessages) {
	let msg = ChatRoomLastMessage[ChatRoomLastMessage.length - 1];
	if (Sensitivity == 3 && (Emote || (ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
		&& !msg.startsWith("(") && !msg.startsWith("*") && (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') != msg || (msg.includes('!')))
		&& (!msg.startsWith("/")
			|| (Keywords && (msg.startsWith("/me") || msg.startsWith("*")))))))
			return true;
	if (Sensitivity == 2 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
		&& !msg.startsWith("(") && !msg.startsWith("*") && !msg.startsWith("/")
		&& (msg.length > 25
			|| (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') != msg && ((msg === msg.toUpperCase() && msg !== msg.toLowerCase())
				|| (msg.includes('!')) || (msg.includes('！'))))))
		return true;
	if (Sensitivity == 1 && ChatRoomLastMessage && ChatRoomLastMessage.length != LastMessages
		&& !msg.startsWith("(") && !msg.startsWith("*") && !msg.startsWith("/")
		&& (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') != msg && ((msg === msg.toUpperCase() && msg !== msg.toLowerCase())
			|| (msg.includes('!')) || (msg.includes('！')))))
		return true;
	return false;
}

function InventoryItemNeckAccessoriesCollarAutoShockUnitUpdate(data) {
	var Item = data.Item;
	if (Item.Property.Sensitivity < 3)
		AutoShockGagActionFlag = false;

	// Punish the player if they speak
	if (Item.Property.Sensitivity && Item.Property.Sensitivity > 0) {

		var LastMessages = data.PersistentData().LastMessageLen;
		var ShockTriggerPunish = false;
		var keywords = false;
		var gagaction = false;

		if (Item.Property.Sensitivity == 3) {
			if (AutoShockGagActionFlag == true) {
				gagaction = true;
				AutoShockGagActionFlag = false;
			} else for (let K = 0; K < AutoPunishKeywords.length; K++) {
				if (ChatRoomLastMessage[ChatRoomLastMessage.length-1].includes(AutoPunishKeywords[K])) {
					keywords = true;
					break;
				}
			}
		}

		ShockTriggerPunish = InventoryItemNeckAccessoriesCollarAutoShockUnitDetectSpeech(Item.Property.Sensitivity, gagaction, keywords, LastMessages);

		if (ChatRoomTargetMemberNumber != null) {
			ShockTriggerPunish = false; // No trigger on whispers
		}

		if (ShockTriggerPunish) {
			ExtendedItemShockPublishAction(data.C, Item, true);
			ChatRoomCharacterUpdate(Player);
		}
	}
}

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemNeckAccessoriesCollarAutoShockUnitBeforeDraw(data) {
	if (data.L === "_Light") {
		const property = data.Property || {};
		return { Color: "#2f0", Opacity: property.BlinkState ? 0 : 1 }
	}
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemNeckAccessoriesCollarAutoShockUnitScriptDraw(data) {
	/** @type {{ChangeTime?: number, LastMessageLen?: number}} */
	const persistentData = data.PersistentData();
	/** @type {ItemProperties} */
	const property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.ChangeTime !== "number") persistentData.ChangeTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;

	if (ChatRoomLastMessage && ChatRoomLastMessage.length != persistentData.LastMessageLen && data.Item && data.Item.Property && data.Item.Property.Sensitivity > 0)
		persistentData.ChangeTime = Math.min(persistentData.ChangeTime, CommonTime()); // Trigger immediately if the user speaks

	if (persistentData.ChangeTime < CommonTime()) {
		const wasBlinking = property.BlinkState;
		property.BlinkState = !wasBlinking;
		const timeToNextRefresh = wasBlinking ? 4000 : 1000;

		if (CurrentScreen == "ChatRoom" && data.C == Player) {

			InventoryItemNeckAccessoriesCollarAutoShockUnitUpdate(data);

			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		persistentData.ChangeTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
