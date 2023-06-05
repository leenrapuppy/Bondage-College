"use strict";

/**
 * Construct an array with X & Y coordinates for the name tag extended item menu.
 * @param {number} Count - The number of buttons
 * @returns {ExtendedItemConfigDrawData<{}>} - The array with X & Y coordinates
 */
function InventoryItemNeckAccessoriesCollarNameTagGetDrawData(Count, X=1000, Y=400) {
	/** @type {ElementConfigData<{}>[]} */
	const elementData = [];
	const xStart = X;
	for (let T = 0; T < Count; T++) {
		elementData.push({ position: [X, Y] });
		X += 250;
		if (T % 4 == 3) {
			X = xStart;
			Y += 60;
		}
	}
	return { elementData, itemsPerPage: Count };
}

/** @type {ExtendedItemScriptHookCallbacks.PublishAction<TypedItemData, TypedItemOption>} */
function InventoryItemNeckAccessoriesCollarNameTagPublishActionHook(data, OriginalFunction, C, item, newOption, previousOption) {
	/** @type {ExtendedItemChatData<TypedItemOption>} */
	const chatData = {
		C,
		previousOption,
		newOption,
		previousIndex: data.options.indexOf(previousOption),
		newIndex: data.options.indexOf(newOption),
	};
	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data);
	const prefix = (typeof data.dialogPrefix.chat === "function") ? data.dialogPrefix.chat(chatData) : data.dialogPrefix.chat;

	if (newOption.Name === "Blank") {
		dictionary.text("NameTagType", "blank");
	} else {
		dictionary.textLookup("NameTagType", `${data.dialogPrefix.option}${newOption.Name}`);
	}
	ChatRoomPublishCustomAction(prefix, true, dictionary.build());
}
