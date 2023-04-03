"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscOwnerPadlockLoad() {
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscOwnerPadlockDraw() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);
	DrawText(DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");

	let msg = DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Detail");
	const subst = ChatRoomPronounSubstitutions(CurrentCharacter, "TargetPronoun", false);
	msg = CommonStringSubstitute(msg, subst);
	DrawText(msg, 1500, 800, "white", "gray");
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscOwnerPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
}
