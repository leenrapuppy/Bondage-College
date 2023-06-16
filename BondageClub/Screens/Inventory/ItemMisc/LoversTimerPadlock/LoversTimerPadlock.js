"use strict";

const LoverTimerChooseList = [1, 2, 4, 8, 16, 24, 48, 72, 96, 120, 144, 168, -144, -72, -48, -24, -8, -4];
let LoverTimerChooseIndex = 0;

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemMiscLoversTimerPadlockInit(C, Item) {
	return InventoryItemMiscOwnerTimerPadlockInit(C, Item, false);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscLoversTimerPadlockLoad() {
	InventoryItemMiscOwnerTimerPadlockLoad();
}

/**
 * @param {Character} C
 * @returns {boolean} - Whether the passed character is elligble for full control over the lock
 */
function InventoryItemMiscLoversTimerPadlockValidator(C) {
	return C.IsLoverOfPlayer() || C.IsOwnedByPlayer();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscLoversTimerPadlockDraw() {
	InventoryItemMiscOwnerTimerPadlockDraw(InventoryItemMiscLoversTimerPadlockValidator);
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscLoversTimerPadlockClick() {
	InventoryItemMiscOwnerTimerPadlockClick(InventoryItemMiscLoversTimerPadlockValidator);
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemMiscLoversTimerPadlockExit() {
	InventoryItemMiscOwnerTimerPadlockExit();
}
