"use strict";

const MistressTimerChooseList = [5, 10, 15, 30, 60, 120, 180, 240, -180, -120, -60, -30, -15];
let MistressTimerChooseIndex = 0;

/** @type {ExtendedItemInitCallback} */
function InventoryItemMiscMistressTimerPadlockInit(Item, C) {
	const PropRecord = {
		RemoveItem: false,
		ShowTimer: true,
		EnableRandomInput: false,
		MemberNumberList: [],
	};
	ExtendedItemInitNoArch(Item, C, PropRecord, false);
}

// Loads the item extension properties
function InventoryItemMiscMistressTimerPadlockLoad() {
}

// Draw the extension screen
function InventoryItemMiscMistressTimerPadlockDraw() {
	const property = DialogFocusSourceItem.Property;

	if (!DialogFocusItem || property.RemoveTimer < CurrentTime) {
		InventoryItemMiscMistressTimerPadlockExit();
		return;
	}

	const asset = DialogFocusItem.Asset;

	if (property.ShowTimer) {
		DrawText(DialogFindPlayer("TimerLeft") + " " + TimerToString(property.RemoveTimer - CurrentTime), 1500, 150, "white", "gray");
	} else {
		DrawText(DialogFindPlayer("TimerUnknown"), 1500, 150, "white", "gray");
	}
	DrawAssetPreview(1387, 225, asset);
	DrawText(DialogFindPlayer(asset.Group.Name + asset.Name + "Intro"), 1500, 600, "white", "gray");

	// Draw the settings
	if (Player.CanInteract() && (Player.MemberNumber == property.LockMemberNumber)) {
		MainCanvas.textAlign = "left";
		DrawButton(1100, 666, 64, 64, "", "White", (property.RemoveItem) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("RemoveItemWithTimer"), 1200, 698, "white", "gray");
		DrawButton(1100, 746, 64, 64, "", "White", (property.ShowTimer) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("ShowItemWithTimerRemaining"), 1200, 778, "white", "gray");
		DrawButton(1100, 828, 64, 64, "", "White", (property.EnableRandomInput) ? "Icons/Checked.png" : "");
		DrawText(DialogFindPlayer("EnableRandomInput"), 1200, 858, "white", "gray");
		MainCanvas.textAlign = "center";
	} else {
		if (property.LockMemberNumber != null) {
			DrawText(DialogFindPlayer("LockMemberNumber") + " " + property.LockMemberNumber.toString(), 1500, 700, "white", "gray");
		}
		DrawText(DialogFindPlayer((property.RemoveItem) ? "WillRemoveItemWithTimer" : "WontRemoveItemWithTimer"), 1500, 868, "white", "gray");
	}

	// Draw buttons to add/remove time if available
	if (Player.CanInteract() && (LogQuery("ClubMistress", "Management") || Player.MemberNumber === property.LockMemberNumber)) {
		DrawButton(1100, 910, 250, 70, DialogFindPlayer("AddTimerTime"), "White");
		DrawBackNextButton(1400, 910, 250, 70, MistressTimerChooseList[MistressTimerChooseIndex] + " " + DialogFindPlayer("Minutes"), "White", "",
			() => MistressTimerChooseList[(MistressTimerChooseList.length + MistressTimerChooseIndex - 1) % MistressTimerChooseList.length] + " " + DialogFindPlayer("Minutes"),
			() => MistressTimerChooseList[(MistressTimerChooseIndex + 1) % MistressTimerChooseList.length] + " " + DialogFindPlayer("Minutes")
		);
	} else if (Player.CanInteract() && property.EnableRandomInput && !property.MemberNumberList.includes(Player.MemberNumber)) {
		DrawButton(1100, 910, 250, 70, "- " + asset.RemoveTimer * 3 / 60 + " " + DialogFindPlayer("Minutes"), "White");
		DrawButton(1400, 910, 250, 70, DialogFindPlayer("Random"), "White");
		DrawButton(1700, 910, 250, 70, "+ " + asset.RemoveTimer * 3 / 60 + " " + DialogFindPlayer("Minutes"), "White");
	}
}

// Catches the item extension clicks
function InventoryItemMiscMistressTimerPadlockClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemMiscMistressTimerPadlockExit();
		return;
	}

	if (!Player.CanInteract()) {
		return;
	}

	const C = CharacterGetCurrent();
	const property = DialogFocusSourceItem.Property;
	const isLockedByPlayer = property.LockMemberNumber === Player.MemberNumber;
	const isClubMistress = LogQuery("ClubMistress", "Management");

	if (isLockedByPlayer) { // If the player's number is on the lock, they can control toggles
		if (MouseIn(1100, 666, 64, 64)) { // Remove when timer runs out checkbox
			property.RemoveItem = !property.RemoveItem;
			ChatRoomCharacterItemUpdate(C);
			return;
		} else if (MouseIn(1100, 746, 64, 64)) { // Show/hide timer checkbox
			property.ShowTimer = !property.ShowTimer;
			ChatRoomCharacterItemUpdate(C);
			return;
		} else if (MouseIn(1100, 826, 64, 64)) { // Enable random input checkbox
			property.EnableRandomInput = !property.EnableRandomInput;
			ChatRoomCharacterItemUpdate(C);
			return;
		}
	}
	if (isLockedByPlayer || isClubMistress) { // If the player is a Club Mistress or their number is on the lock, they can add/remove time
		if (MouseIn(1100, 910, 250, 70)) { // Add time button
			InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);
		} else if (MouseIn(1400, 910, 125, 70)) { // Previous time option
			MistressTimerChooseIndex = (MistressTimerChooseList.length + MistressTimerChooseIndex - 1) % MistressTimerChooseList.length;
		} else if (MouseIn(1525, 910, 125, 70)) { // Next time option
			MistressTimerChooseIndex = (MistressTimerChooseIndex + 1) % MistressTimerChooseList.length;
		}
	} else if (property.EnableRandomInput && !property.MemberNumberList.includes(Player.MemberNumber)) {
		// Everyone else can add/remove time if permitted, and they've not already done so
		if (MouseIn(1100, 910, 250, 70)) { // Remove time
			InventoryItemMiscMistressTimerPadlockAdd(-DialogFocusItem.Asset.RemoveTimer * 2, true);
		} else if (MouseIn(1400, 910, 250, 70)) { // Random
			InventoryItemMiscMistressTimerPadlockAdd(DialogFocusItem.Asset.RemoveTimer * 4 * ((Math.random() >= 0.5) ? 1 : -1), true);
		} else if (MouseIn(1700, 910, 250, 70)) { // Add time
			InventoryItemMiscMistressTimerPadlockAdd(DialogFocusItem.Asset.RemoveTimer * 2, true);
		}
	}
}

// When a value is added to the timer, can be a negative one
function InventoryItemMiscMistressTimerPadlockAdd(TimeToAdd, PlayerMemberNumberToList) {
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
		const timeAdded = (property.RemoveTimer - TimerBefore) / (1000 * 60);
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
			.textLookup("TimerUnit", "Minutes")
			.endif()
			.build();

		ChatRoomPublishCustomAction(msg, true, dictionary);
	} else {
		CharacterRefresh(C);
	}
	InventoryItemMiscMistressTimerPadlockExit();
}

// Exits the extended menu
function InventoryItemMiscMistressTimerPadlockExit() {
	DialogFocusItem = null;
	if (DialogInventory != null) {
		DialogMenuButtonBuild(CharacterGetCurrent());
	}
}
