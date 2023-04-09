"use strict";

/** @type {ExtendedItemScriptHookCallbacks.PublishAction<TypedItemData, TypedItemOption>} */
function InventoryItemButtAnalBeads2PublishActionHook(data, originalFunction, C, item, newOption, previousOption) {
	const beadsOld = previousOption.Property.InsertedBeads || 1;
	const beadsNew = newOption.Property.InsertedBeads || 1;
	const beadsChange = beadsNew - beadsOld;
	if (beadsChange === 0 || data === null) {
		return;
	}

	/** @type {ExtendedItemChatData<TypedItemOption>} */
	const chatData = {
		C,
		previousOption,
		newOption,
		previousIndex: data.options.indexOf(previousOption),
		newIndex: data.options.indexOf(newOption),
	};

	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data)
		.focusGroup(item.Asset.Group.Name)
		.build();
	dictionary.push(
		{ ActivityName: "MasturbateItem" },
		{ ActivityCounter: Math.abs(beadsChange) },
	);

	const Prefix = (typeof data.dialogPrefix.chat === "function") ? data.dialogPrefix.chat(chatData) : data.dialogPrefix.chat;
	const Suffix = beadsChange > 0 ? "Increase" : "Decrease";
	ChatRoomPublishCustomAction(`${Prefix}${Math.abs(beadsChange)}${Suffix}`, true, dictionary);

	if (C.IsPlayer()) {
		// The Player pulls beads from her own butt
		for (let i = beadsChange; i < 0; i++) {
			ActivityArousalItem(C, C, item.Asset);
		}
	}
}
