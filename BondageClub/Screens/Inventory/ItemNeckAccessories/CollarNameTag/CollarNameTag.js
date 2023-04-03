"use strict";

/**
 * Draw the item extension screen
 * @param {TypedItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemNeckAccessoriesCollarNameTagDraw(Data, OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}
	const XYCoords = InventoryItemNeckAccessoriesCollarNameTagGetXY(Data.options.length);
	ExtendedItemDraw(Data.options, Data.dialogPrefix.option, Data.options.length, Data.drawImages, XYCoords);
}

/**
 * Catches the item extension clicks
 * @param {TypedItemData} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemNeckAccessoriesCollarNameTagClick(Data, OriginalFunction) {
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

/** @type {ExtendedItemScriptHookStruct<TypedItemData, ExtendedItemOption>["publishAction"]} */
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
