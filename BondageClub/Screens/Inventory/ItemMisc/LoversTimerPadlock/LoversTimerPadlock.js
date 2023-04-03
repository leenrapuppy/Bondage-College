"use strict";

const LoverTimerChooseList = [1, 2, 4, 8, 16, 24, 48, 72, 96, 120, 144, 168, -144, -72, -48, -24, -8, -4];
let LoverTimerChooseIndex = 0;

/** @type {ExtendedItemInitCallback} */
function InventoryItemMiscLoversTimerPadlockInit(Item, C) {
	const PropRecord = {
		RemoveItem: false,
		ShowTimer: true,
		EnableRandomInput: false,
		MemberNumberList: [],
	};
	ExtendedItemInitNoArch(Item, C, PropRecord, false);
}

// Loads the item extension properties
function InventoryItemMiscLoversTimerPadlockLoad() {
}

// Draw the extension screen
function InventoryItemMiscLoversTimerPadlockDraw() {
	const property = DialogFocusSourceItem.Property;

	if (!DialogFocusItem || (property.RemoveTimer < CurrentTime)) {
		InventoryItemMiscLoversTimerPadlockExit();
		return;
	}

	const C = CharacterGetCurrent();
	const asset = DialogFocusItem.Asset;

	if (property.ShowTimer) {
		DrawText(DialogFindPlayer("TimerLeft") + " " + TimerToString(property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
	} else {
		DrawText(DialogFindPlayer("TimerUnknown"), 1500, 150, "white", "gray");
	}
	DrawAssetPreview(1387, 225, asset);
	DrawText(DialogFindPlayer(asset.Group.Name + asset.Name + "Intro"), 1500, 600, "white", "gray");

	// Draw the settings
	if (Player.CanInteract() && (C.IsLoverOfPlayer() || C.IsOwnedByPlayer())) {
		MainCanvas.textAlign = "left";
		DrawButton(1100, 666, 64, 64, "", "White", (property.RemoveItem) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("RemoveItemWithTimer"), 1200, 698, "white", "gray");
		DrawButton(1100, 746, 64, 64, "", "White", (property.ShowTimer) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("ShowItemWithTimerRemaining"), 1200, 778, "white", "gray");
		DrawButton(1100, 826, 64, 64, "", "White", (property.EnableRandomInput) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("EnableRandomInput"), 1200, 858, "white", "gray");
		MainCanvas.textAlign = "center";
	} else {
		if (property.LockMemberNumber != null) {
			DrawText(DialogFindPlayer("LockMemberNumber") + " " + property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
		}

		let msg = DialogFindPlayer(asset.Group.Name + asset.Name + "Detail");
		const subst = ChatRoomPronounSubstitutions(CurrentCharacter, "TargetPronoun", false);
		msg = CommonStringSubstitute(msg, subst);
		DrawText(msg, 1500, 800, "white", "gray");

		DrawText(DialogFindPlayer(property.RemoveItem ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
	}

	// Draw buttons to add/remove time if available
	if (Player.CanInteract() && (C.IsLoverOfPlayer() || C.IsOwnedByPlayer())) {
		DrawButton(1100, 910, 250, 70, DialogFindPlayer("AddTimerTime"), "White");
		DrawBackNextButton(1400, 910, 250, 70, LoverTimerChooseList[LoverTimerChooseIndex] + " " + DialogFindPlayer("Hours"), "White", "",
			() => LoverTimerChooseList[(LoverTimerChooseList.length + LoverTimerChooseIndex - 1) % LoverTimerChooseList.length] + " " + DialogFindPlayer("Hours"),
			() => LoverTimerChooseList[(LoverTimerChooseIndex + 1) % LoverTimerChooseList.length] + " " + DialogFindPlayer("Hours")
		);
	} else if (Player.CanInteract() && property.EnableRandomInput && !property.MemberNumberList.includes(Player.MemberNumber)) {
		DrawButton(1100, 910, 250, 70, "- 2 " + DialogFindPlayer("Hours"), "White");
		DrawButton(1400, 910, 250, 70, DialogFindPlayer("Random"), "White");
		DrawButton(1700, 910, 250, 70, "+ 2 " + DialogFindPlayer("Hours"), "White");
	}
}

// Catches the item extension clicks
function InventoryItemMiscLoversTimerPadlockClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemMiscLoversTimerPadlockExit();
		return;
	}

	if (!Player.CanInteract()) {
		return;
	}

	const C = CharacterGetCurrent();
	const property = DialogFocusSourceItem.Property;

	if (C.IsLoverOfPlayer() || C.IsOwnedByPlayer()) { // Owner/lovers get full control over lock
		if (MouseIn(1100, 666, 64, 64)) { // Remove when timer runs out checkbox
			property.RemoveItem = !property.RemoveItem;
			ChatRoomCharacterItemUpdate(C);
		} else if (MouseIn(1100, 746, 64, 64)) { // Show/hide timer checkbox
			property.ShowTimer = !property.ShowTimer;
			ChatRoomCharacterItemUpdate(C);
		} else if (MouseIn(1100, 826, 64, 64)) { // Enable random input checkbox
			property.EnableRandomInput = !property.EnableRandomInput;
			ChatRoomCharacterItemUpdate(C);
		} else if (MouseIn(1100, 910, 250, 70)) { // Add time button
			InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);
		} else if (MouseIn(1400, 910, 125, 70)) { // Previous time option
			LoverTimerChooseIndex = (LoverTimerChooseList.length + LoverTimerChooseIndex - 1) % LoverTimerChooseList.length;
		} else if (MouseIn(1525, 910, 125, 70)) { // Next time option
			LoverTimerChooseIndex = (LoverTimerChooseIndex + 1) % LoverTimerChooseList.length;
		}
	} else if (property.EnableRandomInput && !property.MemberNumberList.includes(Player.MemberNumber)) {
		// Everyone else can add/remove time if permitted, and they've not already done so
		if (MouseIn(1100, 910, 250, 70)) { // -2 hours
			InventoryItemMiscLoversTimerPadlockAdd(-2 * 3600, true);
		} else if (MouseIn(1400, 910, 250, 70)) { // Random - +/-4 hours
			InventoryItemMiscLoversTimerPadlockAdd(4 * 3600 * ((Math.random() >= 0.5) ? 1 : -1), true);
		} else if (MouseIn(1700, 910, 250, 70)) { // +2 hours
			InventoryItemMiscLoversTimerPadlockAdd(2 * 3600, true);
		}
	}
}

// When a value is added to the timer, can be a negative one
function InventoryItemMiscLoversTimerPadlockAdd(TimeToAdd, PlayerMemberNumberToList) {
	const C = CharacterGetCurrent();
	const property = DialogFocusSourceItem.Property;
	const TimerBefore = property.RemoveTimer;

	if (PlayerMemberNumberToList) {
		property.MemberNumberList.push(Player.MemberNumber);
	}
	if (DialogFocusItem.Asset.RemoveTimer > 0) {
		property.RemoveTimer = Math.round(Math.min(property.RemoveTimer + (TimeToAdd * 1000), CurrentTime + (DialogFocusItem.Asset.MaxTimer * 1000)));
	}
	if (CurrentScreen === "ChatRoom") {
		const timeAdded = (property.RemoveTimer - TimerBefore) / (1000 * 3600);
		let msg = "TimerAddRemoveUnknownTime";
		if (property.ShowTimer) {
			msg = timeAdded < 0 ? "TimerRemoveTime" : "TimerAddTime";
		}

		const dictionary = new DictionaryBuilder()
			.sourceCharacter(Player)
			.destinationCharacter(C)
			.focusGroup(C.FocusGroup.Name)
			.if(property.ShowTimer)
			.text("TimerTime", Math.round(Math.abs(timeAdded)).toString())
			.textLookup("TimerUnit", "Hours")
			.endif()
			.build();

		ChatRoomPublishCustomAction(msg, true, dictionary);
	} else {
		CharacterRefresh(C);
	}
	InventoryItemMiscLoversTimerPadlockExit();
}

// Exits the extended menu
function InventoryItemMiscLoversTimerPadlockExit() {
	DialogFocusItem = null;
	if (DialogInventory != null) {
		DialogMenuButtonBuild(CharacterGetCurrent());
	}
}
