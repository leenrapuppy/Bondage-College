"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemNeckAccessoriesCollarNameTagDrawHook(Data, OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}
	const XYCoords = InventoryItemNeckAccessoriesCollarNameTagGetXY(Data.options.length);
	ExtendedItemDraw(Data.options, Data.dialogPrefix.option, Data.options.length, Data.drawImages, XYCoords);
}

/** @type {ExtendedItemScriptHookCallbacks.Click<TypedItemData>} */
function InventoryItemNeckAccessoriesCollarNameTagClickHook(Data, OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}
	const XYCoords = InventoryItemNeckAccessoriesCollarNameTagGetXY(Data.options.length);
	ExtendedItemClick(Data.options, Data.options.length, Data.drawImages, XYCoords);
}

/**
 * Construct an array with X & Y coordinates for the name tag extended item menu.
 * @param {number} Count - The number of buttons
 * @returns {[number, number][]} - The array with X & Y coordinates
 */
function InventoryItemNeckAccessoriesCollarNameTagGetXY(Count, X=1000, Y=400) {
	/** @type {[number, number][]} */
	const XYCoords = [];
	const xStart = X;
	for (let T = 0; T < Count; T++) {
		XYCoords.push([X, Y]);
		X += 250;
		if (T % 4 == 3) {
			X = xStart;
			Y += 60;
		}
	}
	return XYCoords;
}

/** @type {ExtendedItemScriptHookCallbacks.PublishAction<TypedItemData, ExtendedItemOption>} */
function InventoryItemNeckAccessoriesCollarNameTagPublishActionHook(data, OriginalFunction, C, item, newOption, previousOption) {
	/** @type {ExtendedItemChatData<ExtendedItemOption>} */
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
		dictionary.push({ Tag: "NameTagType", Text: "blank" });
	} else {
		dictionary.push({ Tag: "NameTagType", TextToLookUp: `${prefix}${newOption.Name}` });
	}
	ChatRoomPublishCustomAction(prefix, true, dictionary);
}
