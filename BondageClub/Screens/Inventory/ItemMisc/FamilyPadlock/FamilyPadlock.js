"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscFamilyPadlockLoad() {
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscFamilyPadlockDraw() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);
	DrawText(DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
	let msg = DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Detail");
	const subst = ChatRoomPronounSubstitutions(CurrentCharacter, "TargetPronoun", false);
	msg = CommonStringSubstitute(msg, subst);
	DrawText(msg, 1500, 800, "white", "gray");
	if (LogQuery("BlockFamilyKey", "OwnerRule"))
		DrawText(DialogFindPlayer("ItemMiscFamilyPadlockDetailNoKey"), 1500, 900, "pink", "gray");
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscFamilyPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
}
