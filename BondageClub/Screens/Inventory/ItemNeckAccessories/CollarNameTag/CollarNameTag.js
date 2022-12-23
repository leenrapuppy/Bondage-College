"use strict";

/**
 * Draw the item extension screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemNeckAccessoriesCollarNameTagDraw(OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}

	const Data = TypedItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
	if (Data === undefined) {
		return;
	}
	const XYCoords = InventoryItemNeckAccessoriesCollarNameTagGetXY(Data.options.length);
	ExtendedItemDraw(Data.options, Data.dialog.typePrefix, Data.options.length, Data.drawImages, XYCoords);
}

/**
 * Catches the item extension clicks
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemNeckAccessoriesCollarNameTagClick(OriginalFunction) {
	if (!DialogFocusItem) {
		return;
	}

	const Data = TypedItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
	if (Data === undefined) {
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

/**
 * Custom publish action function
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption} Option - The currently selected item option
 * @param {ExtendedItemOption} PreviousOption - The previously selected item option
 * @return {void} - Nothing
 */
function InventoryItemNeckAccessoriesCollarNameTagPublishAction(C, Option, PreviousOption) {
	if (!DialogFocusItem) {
		return;
	}

	/** @type {ChatMessageDictionary} */
	const Dictionary = [
		{Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber},
		{Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber},

	];

	const Prefix = DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name;
	if (Option.Name === "Blank") {
		Dictionary.push({Tag: "NameTagType", Text: "blank"});
	} else {
		Dictionary.push({Tag: "NameTagType", TextToLookUp: `${Prefix}${Option.Name}`});
	}
	ChatRoomPublishCustomAction(`${Prefix}Set`, true, Dictionary);
}
