"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscPortalLinkPadlockLoad() {}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscPortalLinkPadlockDraw() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);
	DrawText(DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	DrawText(DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Detail"), 1500, 700, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 800, "white", "gray");
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscPortalLinkPadlockClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		DialogFocusItem = null;
		return;
	}
}
