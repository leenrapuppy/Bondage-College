"use strict";

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemMiscSafewordPadlockInit(C, Item) {
	const PropRecord = {
		Password: "PLEASE",
		Hint: "Say the magic word...",
		LockSet: false,
		RemoveOnUnlock: false,
	};
	return ExtendedItemInitNoArch(C, Item, PropRecord, false);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscSafewordPadlockLoad() {
	if (!DialogFocusItem || !DialogFocusSourceItem) return DialogLeaveFocusItem();
	const Property = DialogFocusSourceItem.Property;
	const C = CharacterGetCurrent();

	if (InventoryItemMiscPasswordPadlockIsSet()) {
		// Normal lock interface
		ElementCreateInput("Password", "text", "", "8");
		// the current code is shown for owners, lovers and the member whose number is on the padlock
		// It is also shown for the person who is bound by it
		if (
			C.ID === 0 ||
			Player.MemberNumber === Property.LockMemberNumber ||
			C.IsOwnedByPlayer() ||
			C.IsLoverOfPlayer()
		) {
			document.getElementById("Password").setAttribute("placeholder", Property.Password);
		}
	} else {
		// Set a password and hint
		ElementCreateInput("SetHint", "text", "", "140");
		ElementCreateInput("SetPassword", "text", "", "8");
		// the current code is shown for owners, lovers and the member whose number is on the padlock
		document.getElementById("SetPassword").setAttribute("placeholder", Property.Password);
		document.getElementById("SetHint").setAttribute("placeholder", Property.Hint);
	}
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscSafewordPadlockDraw() {
	if (!DialogFocusSourceItem) return;
	const Property = DialogFocusSourceItem.Property;

	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);

	if (Property && Property.LockMemberNumber != null) {
		DrawText(
			DialogFindPlayer("LockMemberNumber") + " " + Property.LockMemberNumber.toString(),
			1500, 600, "white", "gray",
		);
	}

	InventoryItemMiscPasswordPadlockDrawControls();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscSafewordPadlockClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		return DialogLeaveFocusItem();
	}

	InventoryItemMiscPasswordPadlockControlsClick();
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemMiscSafewordPadlockExit() {
	InventoryItemMiscPasswordPadlockExit();
}
