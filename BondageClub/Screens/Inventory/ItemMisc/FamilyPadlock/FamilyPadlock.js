"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscFamilyPadlockLoad() {
	InventoryItemMiscOwnerPadlockLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscFamilyPadlockDraw() {
	InventoryItemMiscOwnerPadlockDraw();
	if (LogQuery("BlockFamilyKey", "OwnerRule"))
		DrawText(DialogFindPlayer("ItemMiscFamilyPadlockDetailNoKey"), 1500, 900, "pink", "gray");
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscFamilyPadlockClick() {
	InventoryItemMiscOwnerPadlockClick();
}
