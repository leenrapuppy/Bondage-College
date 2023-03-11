"use strict";

/** @type {string | null} */
var InventoryItemHandsPaddedMittensMsg = null;

// Loads the item extension properties
function InventoryItemHandsPaddedMittensLoad() {
	InventoryItemHandsPaddedMittensMsg = null;
}

// Draw the item extension screen
function InventoryItemHandsPaddedMittensDraw() {
	// Draw the header and item
	ExtendedItemDrawHeader(1387, 125);

	// Draw the possible options
	DrawText(DialogFindPlayer("SelectFeature"), 1500, 500, "white", "gray");
	DrawPreviewBox(1250, 550, `${AssetGetInventoryPath(DialogFocusItem.Asset)}/AdultBabyHarness.png`, "", {Hover: true});
	DrawText(DialogFindPlayer("mittenstoharness"), 1375, 800, "white", "gray");

	// Draw the message if present
	if (InventoryItemHandsPaddedMittensMsg != null) {
		let msg = DialogFindPlayer(InventoryItemHandsPaddedMittensMsg);
		const subst = ChatRoomPronounSubstitutions(CurrentCharacter, "TargetPronoun", false);
		msg = CommonStringSubstitute(msg, subst);
		DrawTextWrap(msg, 1100, 850, 800, 160, "White");
	}
}

// Catches the item extension clicks
function InventoryItemHandsPaddedMittensClick() {
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1250) && (MouseX <= 1475) && (MouseY >= 550) && (MouseY <= 775)) InventoryItemHandsPaddedMittensChain();
}

// Chain/Unchain function
function InventoryItemHandsPaddedMittensChain() {
	var C = CharacterGetCurrent();
	if (InventoryGet(C, "ItemArms") != null) {
		InventoryItemHandsPaddedMittensMsg = "FreeArms";
		return;
	}

	if (!CharacterHasItemWithAttribute(C, "CanAttachMittens")) {
		InventoryItemHandsPaddedMittensMsg = "NeedHarness";
		return;
	}

	InventoryWear(C, "MittenChain1", "ItemArms");
	if (C.ID == 0) ServerPlayerAppearanceSync();
	if (CurrentScreen == "ChatRoom") {
		const Dictionary = new DictionaryBuilder()
			.sourceCharacter(Player)
			.destinationCharacter(C)
			.build();
		ChatRoomPublishCustomAction("MittenChain", true, Dictionary);
		ChatRoomCharacterUpdate(C);
	}
}
