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
	if ((DialogTightenLoosenItem.Craft != null) && (DialogTightenLoosenItem.Craft.Property === "Secure")) TightenLoosenItemMaximumDifficulty = TightenLoosenItemMaximumDifficulty + 4;
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
 * Sets a facial expression for the character being tightneded/loosened
 * @param {Character} C - The character affected
 * @param {string} Blush - The blush style
 * @param {string} Eyes - The eyes style
 * @param {string} Eyebrows - The eyebrows style
 * @returns {void} Nothing
 */
function TightenLoosenFacialExpression(C, Blush, Eyes, Eyebrows) {
	if ((Blush != "") && (InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)) CharacterSetFacialExpression(C, "Blush", Blush, 7);
	if ((Eyes != "") && (InventoryGet(C, "Eyes") == null) || (InventoryGet(C, "Eyes").Property == null) || (InventoryGet(C, "Eyes").Property.Expression == null)) CharacterSetFacialExpression(C, "Eyes", Eyes, 3);
	if ((Eyebrows != "") && (InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)) CharacterSetFacialExpression(C, "Eyebrows", Eyebrows, 5);
}

/**
 * Handles clicks on the tighten / loosen menu
 * @returns {void} Nothing
 */
function TightenLoosenItemClick() {

	// Exit button
	if (MouseIn(1885, 25, 90, 90)) {
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = false;
		TightenLoosenItemExit();
		return;
	}

	// Gets the current character and action to do
	const C = CharacterGetCurrent();
	let Action = "";

	// Tigthen a little
	if (MouseIn(1150, 650, 300, 65) && (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMaximumDifficulty)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty + 2;
		if (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMaximumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMaximumDifficulty;
		TightenLoosenFacialExpression(C, "Low", "Angry", "Angry");
		Action = "TightenLittle";
	}

	// Tigthen a lot
	if (MouseIn(1150, 800, 300, 65) && (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMaximumDifficulty - 2)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty + 4;
		if (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMaximumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMaximumDifficulty;
		TightenLoosenFacialExpression(C, "Medium", "Surprised", "Harsh");
		Action = "TightenLot";
	}

	// Loosen a little
	if (MouseIn(1550, 650, 300, 65) && (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMinimumDifficulty)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty - 2;
		if (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMinimumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMinimumDifficulty;
		TightenLoosenFacialExpression(C, "", "Shy", "Lowered");
		Action = "LoosenLittle";
	}

	// Loosen a lot
	if (MouseIn(1550, 800, 300, 65) && (DialogTightenLoosenItem.Difficulty > TightenLoosenItemMinimumDifficulty + 2)) {
		DialogTightenLoosenItem.Difficulty = DialogTightenLoosenItem.Difficulty - 4;
		if (DialogTightenLoosenItem.Difficulty < TightenLoosenItemMinimumDifficulty) DialogTightenLoosenItem.Difficulty = TightenLoosenItemMinimumDifficulty;
		TightenLoosenFacialExpression(C, "ShortBreath", "Closed", "Soft");
		Action = "LoosenLot";
	}

	// If the difficulty changed and we must refresh, improves the skill a little if done in a multiplayer
	if (Action != "") {
		CharacterRefresh(C, true);
		if (CurrentScreen == "ChatRoom") {
			if (((Action == "LoosenLot") || (Action == "LoosenLittle")) && C.IsPlayer()) SkillProgress("Evasion", 25);
			if (((Action == "LoosenLot") || (Action == "LoosenLittle")) && !C.IsPlayer()) SkillProgress("Bondage", 25);
			if (((Action == "TightenLot") || (Action == "TightenLittle")) && C.IsPlayer()) SkillProgress("SelfBondage", 25);
			if (((Action == "TightenLot") || (Action == "TightenLittle")) && !C.IsPlayer()) SkillProgress("Bondage", 25);
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