"use strict";

var ItemVulvaFuturisticVibratorTriggers = ["Increase", "Decrease", "Disable", "Edge", "Random", "Deny", "Tease", "Shock"];
/** @type {string[]} */
var ItemVulvaFuturisticVibratorTriggerValues = [];

/** @type {{EVERYONE: "", PROHIBIT_SELF: "ProhibitSelf", LOCK_MEMBER_ONLY: "LockMember"}} */
const ItemVulvaFuturisticVibratorAccessMode = {
	EVERYONE: "",
	PROHIBIT_SELF: "ProhibitSelf",
	LOCK_MEMBER_ONLY: "LockMember",
};
const ItemVulvaFuturisticVibratorAccessModes = Object.values(ItemVulvaFuturisticVibratorAccessMode);

/** @type {ExtendedItemScriptHookCallbacks.Load<VibratingItemData>} */
function InventoryItemVulvaFuturisticVibratorLoadHook(data, originalFunction) {
	if (!FuturisticAccessLoad()) {
		return;
	}

	const mode = DialogFindPlayer(DialogFocusItem.Property.Mode || "Off");
	DialogExtendedMessage = `${DialogFindPlayer("CurrentMode")} ${mode}`;

	ItemVulvaFuturisticVibratorTriggerValues = DialogFocusItem.Property.TriggerValues.split(',');

	// Only create the inputs if the zone isn't blocked
	ItemVulvaFuturisticVibratorTriggers.forEach((trigger, i) => {
		const input = ElementCreateInput("FuturisticVibe" + trigger, "text", "", "12");
		if (input) input.setAttribute("placeholder", ItemVulvaFuturisticVibratorTriggerValues[i]);
	});
}

/** @type {ExtendedItemScriptHookCallbacks.Draw<VibratingItemData>} */
function InventoryItemVulvaFuturisticVibratorDrawHook(data, originalFunction) {
	const Item = DialogFocusItem;
	if (!FuturisticAccessDraw()) {
		return;
	}

	// Draw the preview & current mode
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");

	// Draw each of the triggers and position their inputs
	ItemVulvaFuturisticVibratorTriggers.forEach((trigger, i) => {
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("FuturisticVibrator" + trigger), 1400, 450 + 60 * i, "white", "gray");
		MainCanvas.textAlign = "center";
		ElementPosition("FuturisticVibe" + trigger, 1650, 450 + 60 * i, 400);
	});
	// Draw the save button
	DrawButton(1525, 450 + 60 * ItemVulvaFuturisticVibratorTriggers.length, 350, 64, DialogFindPlayer("FuturisticVibratorSaveVoiceCommands"), "White", "");

	DrawBackNextButton(1100, 450 + 60 * ItemVulvaFuturisticVibratorTriggers.length, 350, 64, DialogFindPlayer("FuturisticVibratorPermissions" + (Item.Property.AccessMode || "")), "White", "",
		() => DialogFindPlayer("FuturisticVibratorPermissions" + InventoryItemVulvaFuturisticVibratorPreviousAccessMode(Item.Property.AccessMode || "")),
		() => DialogFindPlayer("FuturisticVibratorPermissions" + InventoryItemVulvaFuturisticVibratorNextAccessMode(Item.Property.AccessMode || "")));
}

function InventoryItemVulvaFuturisticVibratorPreviousAccessMode(current) {
	return ItemVulvaFuturisticVibratorAccessModes[(ItemVulvaFuturisticVibratorAccessModes.indexOf(current) + ItemVulvaFuturisticVibratorAccessModes.length - 1) % ItemVulvaFuturisticVibratorAccessModes.length];
}

function InventoryItemVulvaFuturisticVibratorNextAccessMode(current) {
	return ItemVulvaFuturisticVibratorAccessModes[(ItemVulvaFuturisticVibratorAccessModes.indexOf(current) + 1) % ItemVulvaFuturisticVibratorAccessModes.length];
}

/** @type {ExtendedItemScriptHookCallbacks.Click<VibratingItemData>} */
function InventoryItemVulvaFuturisticVibratorClickHook(data, originalFunction) {
	if (!FuturisticAccessClick()) {
		return;
	} else if (MouseIn(1885, 25, 90, 90)) {
		ExtendedItemExit();
	} else if (MouseIn(1525, 450 + 60 * ItemVulvaFuturisticVibratorTriggers.length, 350, 64)) {
		InventoryItemVulvaFuturisticVibratorClickSet();
	} else if (MouseIn(1100, 450 + 60 * ItemVulvaFuturisticVibratorTriggers.length, 350, 64)) {
		const C = CharacterGetCurrent();
		const Item = DialogFocusItem;
		if (MouseX < 1100 + (350 / 2)) {
			InventoryItemVulvaFuturisticVibratorSetAccessMode(C, Item, InventoryItemVulvaFuturisticVibratorPreviousAccessMode(Item.Property.AccessMode || ""));
		} else {
			InventoryItemVulvaFuturisticVibratorSetAccessMode(C, Item, InventoryItemVulvaFuturisticVibratorNextAccessMode(Item.Property.AccessMode || ""));
		}
	}
}


function InventoryItemVulvaFuturisticVibratorClickSet() {
	if ((DialogFocusItem != null) && (DialogFocusItem.Property != null)) {
		var ItemVulvaFuturisticVibratorTriggerValuesTemp = [];
		for (let I = 0; I < ItemVulvaFuturisticVibratorTriggers.length; I++) {
			ItemVulvaFuturisticVibratorTriggerValuesTemp.push((ElementValue("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I]) != "") ? ElementValue("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I])
				: ItemVulvaFuturisticVibratorTriggerValues[I]);
		}

		ItemVulvaFuturisticVibratorTriggerValues = ItemVulvaFuturisticVibratorTriggerValuesTemp;

		var temp = CommonConvertArrayToString(ItemVulvaFuturisticVibratorTriggerValues);

		if (temp != "" && typeof temp === "string") {
			DialogFocusItem.Property.TriggerValues = temp;
			if (CurrentScreen == "ChatRoom") {
				const Dictionary = new DictionaryBuilder()
					.sourceCharacter(Player)
					.destinationCharacter(CurrentCharacter)
					.asset(DialogFocusItem.Asset)
					.build();
				ChatRoomPublishCustomAction("FuturisticVibratorSaveVoiceCommandsAction", true, Dictionary);
			}
			DialogLeave();
		}
	}
}

/** @type {ExtendedItemScriptHookCallbacks.Exit<VibratingItemData>} */
function InventoryItemVulvaFuturisticVibratorExitHook(data, originalFunction) {
	InventoryItemFuturisticExitAccessDenied();
	ItemVulvaFuturisticVibratorTriggers.forEach(i => ElementRemove(`FuturisticVibe${i}`));
}

/**
 * @param {string} msg
 * @param {readonly string[]} TriggerValues
 * @returns {string[]}
 */
function InventoryItemVulvaFuturisticVibratorDetectMsg(msg, TriggerValues) {
	var commandsReceived = [];

	// If the message is OOC, just return immediately
	if (msg.indexOf('(') == 0) return commandsReceived;

	for (let I = 0; I < TriggerValues.length; I++) {
		// Don't execute arbitrary regex
		let regexString = TriggerValues[I].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		// Allow `*` wildcard, and normalize case
		regexString = regexString.replace(/\*/g, ".*");//regexString.replaceAll("\\*", ".*")
		regexString = regexString.toUpperCase();

		const nonLatinCharRegex = new RegExp('^([^\\x20-\\x7F]|\\\\.\\*)+$');
		let triggerRegex;

		// In general, in most of the Asian language, the full sentence will be considered as one whole word
		// Because how regex consider word boundaries to be position between \w -> [A-Za-z0-9_] and \W.

		// So if commands are set to those languages, the command will never be triggered.
		// Or if the command is not a word
		// This enhancement should allow Asian language commands, and also emoji/special characters
		// (e.g. A symbol such as ↑ or ↓, Languages in CJK group such as Chinese, Japanese, and Korean.)
		// This should be a fun addition to boost the user's experience.
		if (nonLatinCharRegex.test(regexString)) {
			triggerRegex = new RegExp(regexString);
		} else {
			triggerRegex = new RegExp(`\\b${regexString}\\b`);
		}
		const success = triggerRegex.test(msg);

		if (success) commandsReceived.push(ItemVulvaFuturisticVibratorTriggers[I]);
	}
	return commandsReceived;
}

/**
 * @param {Character} C
 * @param {Item} Item
 * @param {ItemVulvaFuturisticVibratorAccessMode} Mode
 */
function InventoryItemVulvaFuturisticVibratorSetAccessMode(C, Item, Mode) {
	Item.Property.AccessMode = Mode;
	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
}

/**
 * @param {Item} Item
 * @param {boolean} Increase
 * @returns {VibratorMode}
 */
function InventoryItemVulvaFuturisticVibratorGetMode(Item, Increase) {
	if (Item.Property.Mode == VibratorMode.MAXIMUM) return (Increase ? VibratorMode.MAXIMUM : VibratorMode.HIGH);
	if (Item.Property.Mode == VibratorMode.HIGH) return (Increase ? VibratorMode.MAXIMUM : VibratorMode.MEDIUM);
	if (Item.Property.Mode == VibratorMode.MEDIUM) return (Increase ? VibratorMode.HIGH : VibratorMode.LOW);
	if (Item.Property.Mode == VibratorMode.LOW) return (Increase ? VibratorMode.MEDIUM : VibratorMode.OFF);

	return (Increase ? ((Item.Property.Mode == VibratorMode.OFF) ? VibratorMode.LOW : VibratorMode.MAXIMUM ): VibratorMode.LOW);
}

/**
 * @param {VibratingItemData} data
 * @param {Character} C
 * @param {Item} Item
 * @param {VibratingItemOption} newOption
 * @param {VibratingItemOption} previousOption
 */
function InventoryItemVulvaFuturisticVibratorSetMode(data, C, Item, newOption, previousOption) {
	if (ExtendedItemSetOption(data, C, Item, newOption, { ...previousOption, ChangeWhenLocked: true }, true)) {
		return;
	}
	ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);

	/** @type {Parameters<ExtendedItemCallbacks.PublishAction<VibratingItemOption>>} */
	const args = [C, Item, newOption, previousOption];
	CommonCallFunctionByName(`${data.functionPrefix}PublishAction`, ...args);
}

/**
 * @param {VibratingItemData} data
 * @param {Character} C
 * @param {Item} Item
 * @param {number} LastTime
 */
function InventoryItemVulvaFuturisticVibratorHandleChat(data, C, Item, LastTime) {
	if (!Item) return;
	if (!Item.Property) {
		/** @type {Parameters<ExtendedItemCallbacks.Init>} */
		const args = [C, Item, true];
		CommonCallFunctionByNameWarn(`${data.functionPrefix}Init`, ...args);
	}

	var TriggerValues = Item.Property.TriggerValues && Item.Property.TriggerValues.split(',');
	if (!TriggerValues) TriggerValues = ItemVulvaFuturisticVibratorTriggers;

	// Search from latest message backwards, allowing early exit
	for (let CH = ChatRoomChatLog.length - 1; CH >= 0; CH--) {

		// Messages are in order, no need to keep looping
		if (ChatRoomChatLog[CH].Time <= LastTime) break;

		// Skip messages from unauthorized users
		if (Item.Property.AccessMode === ItemVulvaFuturisticVibratorAccessMode.PROHIBIT_SELF && ChatRoomChatLog[CH].SenderMemberNumber === Player.MemberNumber) continue;
		if (Item.Property.AccessMode === ItemVulvaFuturisticVibratorAccessMode.LOCK_MEMBER_ONLY && ChatRoomChatLog[CH].SenderMemberNumber !== Item.Property.LockMemberNumber) continue;

		var msg = InventoryItemVulvaFuturisticVibratorDetectMsg(ChatRoomChatLog[CH].Chat.toUpperCase(), TriggerValues);

		if (msg.length > 0) {
			/** @type {null | VibratingItemOption} */
			let newOption = null;

			//vibrator modes, can only pick one
			if (msg.includes("Edge")) {
				newOption = data.options.find(o => o.Name === "Edge");
			} else if (msg.includes("Deny")) {
				newOption = data.options.find(o => o.Name === "Deny");
			} else if (msg.includes("Tease")) {
				newOption = data.options.find(o => o.Name === "Tease");
			} else if (msg.includes("Random")) {
				newOption = data.options.find(o => o.Name === "Random");
			} else if (msg.includes("Disable")) {
				newOption = VibratorModeOff;
			} else if (msg.includes("Increase") || msg.includes("Decrease")) {
				const mode = InventoryItemVulvaFuturisticVibratorGetMode(Item, msg.includes("Increase"));
				newOption = data.options.find(o => o.Name === mode);
			}

			if (newOption !== null) {
				const previousOption = TypedItemFindPreviousOption(Item, data.options, "Mode");
				InventoryItemVulvaFuturisticVibratorSetMode(data, C, Item, newOption, previousOption);
			}

			//triggered actions
			if (msg.includes("Shock")) PropertyShockPublishAction(C, Item, true);
		}
	}
}

/**
 * @typedef {{ CheckTime?: number, Mode?: VibratorMode, ChangeTime?: number, LastChange?: number }} FuturisticVibratorPersistentData
 */

/** @type {ExtendedItemScriptHookCallbacks.ScriptDraw<VibratingItemData, FuturisticVibratorPersistentData>} */
function AssetsItemVulvaFuturisticVibratorScriptDrawHook(data, originalFunction, drawData) {
	var PersistentData = drawData.PersistentData();
	var C = drawData.C;
	var Item = drawData.Item;
	// Only run updates on the player and NPCs
	if (C.ID !== 0 && C.MemberNumber !== null) return;

	// Default to some number that just means all messages are viable
	if (typeof PersistentData.CheckTime !== "number") PersistentData.CheckTime = 0;

	// Trigger a check if a new message is detected
	let lastMsgIndex = ChatRoomChatLog.length - 1;
	if (lastMsgIndex >= 0 && ChatRoomChatLog[lastMsgIndex].Time > PersistentData.CheckTime) {
		InventoryItemVulvaFuturisticVibratorHandleChat(data, C, Item, PersistentData.CheckTime);
		PersistentData.CheckTime = ChatRoomChatLog[lastMsgIndex].Time;
	}

	originalFunction(drawData);
}
