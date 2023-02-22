"use strict";
var TightenLoosenItemMaximumDifficulty = 0;
var TightenLoosenItemMinimumDifficulty = -10;

/**
 * Loads the item properties
 * @returns {void} Nothing
 */
function TightenLoosenItemLoad() {
	if (DialogTightenLoosenItem.Difficulty == null) DialogTightenLoosenItem.Difficulty = 0;
	TightenLoosenItemMaximumDifficulty = SkillGetLevel(Player, "Bondage") + 4;
	if (DialogTightenLoosenItem.Asset.Difficulty != null) TightenLoosenItemMaximumDifficulty = TightenLoosenItemMaximumDifficulty + DialogTightenLoosenItem.Asset.Difficulty;
}

/**
 * Draws the extended tighten / loosen menu
 * @returns {void} Nothing
 */
function TightenLoosenItemDraw() {

	// Draws the title, tightness and item image
	DrawText(DialogFindPlayer("TightenLoosenTitle"), 1500, 70, "White", "Silver");
	const Vibrating = DialogTightenLoosenItem.Property && DialogTightenLoosenItem.Property.Intensity != null && DialogTightenLoosenItem.Property.Intensity >= 0;
	const Locked = InventoryItemHasEffect(DialogTightenLoosenItem, "Lock", true);
	DrawAssetPreview(1200, 200, DialogTightenLoosenItem.Asset, { Vibrating, Icons: Locked ? ["Locked"] : undefined });
	DrawText(DialogFindPlayer("Tightness") + " " + DialogTightenLoosenItem.Difficulty.toString(), 1660, 240, "White", "Silver");
	DrawText(DialogFindPlayer("MaximumTightness") + " " + TightenLoosenItemMaximumDifficulty.toString(), 1660, 340, "White", "Silver");
	DrawText(DialogFindPlayer("MinimumTightness") + " " + TightenLoosenItemMinimumDifficulty.toString(), 1660, 440, "White", "Silver");

	// Draws the buttons
	DrawButton(1150, 650, 300, 65, DialogFindPlayer("TightenLittle"), (DialogTightenLoosenItem.Difficulty >= TightenLoosenItemMaximumDifficulty) ? "Gray": "White", null, null, (DialogTightenLoosenItem.Difficulty >= TightenLoosenItemMaximumDifficulty));
	DrawButton(1150, 800, 300, 65, DialogFindPlayer("TightenLot"), (DialogTightenLoosenItem.Difficulty >= TightenLoosenItemMaximumDifficulty - 2) ? "Gray": "White", null, null, (DialogTightenLoosenItem.Difficulty >= TightenLoosenItemMaximumDifficulty - 2));
	DrawButton(1550, 650, 300, 65, DialogFindPlayer("LoosenLittle"), (DialogTightenLoosenItem.Difficulty <= TightenLoosenItemMinimumDifficulty) ? "Gray": "White", null, null, (DialogTightenLoosenItem.Difficulty <= TightenLoosenItemMinimumDifficulty));
	DrawButton(1550, 800, 300, 65, DialogFindPlayer("LoosenLot"), (DialogTightenLoosenItem.Difficulty <= TightenLoosenItemMinimumDifficulty + 2) ? "Gray": "White", null, null, (DialogTightenLoosenItem.Difficulty <= TightenLoosenItemMinimumDifficulty + 2));
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

}

/**
 * Handles clicks on the tighten / loosen menu
 * @returns {void} Nothing
 */
function TightenLoosenItemClick() {
	const C = CharacterGetCurrent();

	// Exit button
	if (MouseIn(1885, 25, 90, 90)) {
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = false;
		TightenLoosenItemExit();
		return;
	}

	// Tigthen a little
	let Action = "";
	if (MouseIn(1150, 650, 300, 65) && (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMaximumDifficulty)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty + 2;
		if (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMaximumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMaximumDifficulty;
		Action = "TightenLittle";
	}

	// Tigthen a lot
	if (MouseIn(1150, 800, 300, 65) && (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMaximumDifficulty - 2)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty + 4;
		if (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMaximumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMaximumDifficulty;
		Action = "TightenLot";
	}

	// Loosen a little
	if (MouseIn(1550, 650, 300, 65) && (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMinimumDifficulty)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty - 2;
		if (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMinimumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMinimumDifficulty;
		Action = "LoosenLittle";
	}

	// Loosen a lot
	if (MouseIn(1550, 800, 300, 65) && (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMinimumDifficulty + 2)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty - 4;
		if (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMinimumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMinimumDifficulty;
		Action = "LoosenLot";
	}

	// If the difficulty changed and we must refresh
	if (Action != "") {
		CharacterRefresh(C, true);
		if (CurrentScreen == "ChatRoom") {
			ChatRoomCharacterUpdate(C);
			ChatRoomPublishAction(C, "Action" + Action, DialogTightenLoosenItem, null);
			DialogLeave();
		}
	}

}

/**
 * Exit function for sub menu
 * @returns {void} - Nothing
 */
function TightenLoosenItemExit() {
	DialogTightenLoosenItem = null;
}