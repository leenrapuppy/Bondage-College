"use strict";

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemMiscSafewordPadlockInit(C, Item) {
	return ExtendedItemInitNoArch(C, Item, { RemoveItem: false }, false);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscTimerPadlockLoad() {
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscTimerPadlockDraw() {
	if ((DialogFocusItem == null) || (DialogFocusSourceItem.Property.RemoveTimer < CurrentTime)) { DialogLeaveFocusItem(); return; }
	DrawText(DialogFindPlayer("TimerLeft") + " " + TimerToString(DialogFocusSourceItem.Property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);
	DrawText(DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 600, "white", "gray");
	if ((DialogFocusSourceItem != null) && (DialogFocusSourceItem.Property != null) && (DialogFocusSourceItem.Property.LockMemberNumber != null))
		DrawText(DialogFindPlayer("LockMemberNumber") + " " + DialogFocusSourceItem.Property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
	if ((Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
		MainCanvas.textAlign = "left";
		DrawButton(1100, 836, 64, 64, "", "White", (DialogFocusSourceItem.Property.RemoveItem) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("RemoveItemWithTimer"), 1200, 868, "white", "gray");
		MainCanvas.textAlign = "center";
	} else DrawText(DialogFindPlayer((DialogFocusSourceItem.Property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
	if (Player.CanInteract()) DrawButton(1350, 910, 300, 65, DialogFindPlayer("RestartTimer"), "White");
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscTimerPadlockClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogLeaveFocusItem();
	if ((MouseX >= 1100) && (MouseX <= 1164) && (MouseY >= 836) && (MouseY <= 900) && (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber) && Player.CanInteract()) {
		DialogFocusSourceItem.Property.RemoveItem = !(DialogFocusSourceItem.Property.RemoveItem);
		if (CurrentScreen == "ChatRoom") ChatRoomCharacterItemUpdate(CharacterGetCurrent());
	}
	if ((MouseX >= 1350) && (MouseX <= 1650) && (MouseY >= 910) && (MouseY <= 975) && Player.CanInteract()) {
		InventoryItemMiscTimerPadlockReset();
		DialogLeaveFocusItem();
	}
}

// When the timer resets
function InventoryItemMiscTimerPadlockReset() {
	const C = CharacterGetCurrent();
	if (DialogFocusItem.Asset.RemoveTimer > 0) DialogFocusSourceItem.Property.RemoveTimer = Math.round(CurrentTime + (DialogFocusItem.Asset.RemoveTimer * 1000));

	const Dictionary = new DictionaryBuilder()
		.sourceCharacter(Player)
		.destinationCharacter(C)
		.focusGroup(C.FocusGroup.Name)
		.build();
	ChatRoomPublishCustomAction("TimerRestart", true, Dictionary);
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemMiscTimerPadlockExit() {}
