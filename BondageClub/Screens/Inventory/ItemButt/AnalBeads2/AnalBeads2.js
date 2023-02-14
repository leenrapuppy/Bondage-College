"use strict";

/**
 * Custom publish action function
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption} Option - The currently selected item option
 * @param {ExtendedItemOption} PreviousOption - The previously selected item option
 * @return {void} - Nothing
 */
function InventoryItemButtAnalBeads2PublishAction(C, Option, PreviousOption) {
	const BeadsOld = PreviousOption.Property.InsertedBeads || 1;
	const BeadsNew = Option.Property.InsertedBeads || 1;
	const BeadsChange = BeadsNew - BeadsOld;
	if (BeadsChange === 0) {
		return;
	}

	// Push Chatroom Event
	const Dictionary = [];
	Dictionary.push({ Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
	Dictionary.push({ ActivityName: "MasturbateItem" });
	Dictionary.push({ FocusGroupName: "ItemButt" });
	Dictionary.push({ Tag: "AssetName", AssetName: "AnalBeads2", GroupName: "ItemButt" });
	Dictionary.push({ AssetGroupName: "ItemButt" });
	Dictionary.push({ ActivityCounter: Math.min(BeadsChange, 0) });

	const Prefix = DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name;
	if (BeadsChange > 0) {
		ChatRoomPublishCustomAction(`${Prefix}Set${BeadsChange}Increase`, true, Dictionary);
	} else if (BeadsChange < 0) {
		ChatRoomPublishCustomAction(`${Prefix}Set${-BeadsChange}Decrease`, true, Dictionary);
	}

	if (C.ID === Player.ID) {
		// The Player pulls beads from her own butt
		const A = AssetGet(C.AssetFamily, "ItemButt", "AnalBeads2");
		for (let i = BeadsChange; i < 0; i++) {
			ActivityArousalItem(C, C, A);
		}
	}
}
