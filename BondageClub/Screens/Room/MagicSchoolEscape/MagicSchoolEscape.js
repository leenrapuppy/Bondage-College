"use strict";
var MagicSchoolEscapeBackground = "MagicSchoolEscape";
/** @type {null | NPCCharacter} */
var MagicSchoolEscapeInstructor = null;
var MagicSchoolEscapeSeconds = 120;
var MagicSchoolEscapeTimer = 0;

/**
 * Loads the magic school laboratory and the teacher
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeLoad() {
	MagicPuzzleBackground = MagicSchoolEscapeBackground;
	if (MagicSchoolEscapeInstructor == null) {
		MagicSchoolEscapeInstructor = CharacterLoadNPC("NPC_MagicSchoolEscape_Instructor");
		MagicSchoolLaboratoryPrepareNPC(MagicSchoolEscapeInstructor, "");
	}
}

/**
 * Runs the room
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeRun() {

	// If the challenge was failed
	if ((MagicSchoolEscapeTimer > 0) && (MagicSchoolEscapeTimer < CommonTime())) {
		CharacterAppearanceRestore(Player, MagicBattlePlayerAppearance);
		CharacterRefresh(Player);
		MagicSchoolEscapeTimer = 0;
		MagicSchoolEscapeInstructor.Stage = "200";
		CharacterSetCurrent(MagicSchoolEscapeInstructor);
		MagicSchoolEscapeInstructor.CurrentDialog = DialogFind(MagicSchoolEscapeInstructor, "EscapeFail");
		return;
	}

	// Check if the challenge is running to draw the room
	if (MagicSchoolEscapeTimer < CommonTime()) {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(MagicSchoolEscapeInstructor, 1000, 0, 1);
		DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
		DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	} else {
		DrawCharacter(Player, 750, 0, 1);
		DrawText(TimerToString(MagicSchoolEscapeTimer - CommonTime()), 1900, 970, "white", "gray");
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Magic.png", TextGet("Cast"));
	}

}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeClick() {

	// Outside of challenge, we have the side buttons and the characters
	if (MagicSchoolEscapeTimer < CommonTime()) {
		if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MagicSchoolEscapeInstructor);
		if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MagicSchoolLaboratory");
		if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	} else {

		// If a spell is clicked, we launch the mini-game based on the player predicament
		if (MouseIn(1885, 25, 90, 90)) {
			MagicPuzzleSpell = 3;
			if ((InventoryGet(Player, "ItemLegs") != null) || (InventoryGet(Player, "ItemFeet") != null)) MagicPuzzleSpell = 5;
			if ((InventoryGet(Player, "ItemArms") != null) || (InventoryGet(Player, "ItemTorso") != null)) MagicPuzzleSpell = 4;
			if ((InventoryGet(Player, "ItemMouth") != null) || (InventoryGet(Player, "ItemHead") != null)) MagicPuzzleSpell = 0;
			MagicPuzzleAutoExit = true;
			MiniGameStart("MagicPuzzle", MagicBattleSpellDifficulty[MagicPuzzleSpell] * MagicSchoolEscapeSeconds / 30, "MagicSchoolEscapeSpellEnd");
		}

	}

}

/**
 * When the spell ends, we remove some restraints if the player succeeded
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeSpellEnd() {
	CommonSetScreen("Room", "MagicSchoolEscape");
	if (MagicSchoolEscapeTimer < CommonTime()) MiniGameVictory = false;
	if (!MiniGameVictory) {
		if ((InventoryGet(Player, "Cloth") != null) || (InventoryGet(Player, "ClothLower") != null) || (InventoryGet(Player, "ClothAccessory") != null) || (InventoryGet(Player, "Shoes") != null)) {
			InventoryRemove(Player, "Cloth", false);
			InventoryRemove(Player, "ClothLower", false);
			InventoryRemove(Player, "ClothAccessory", false);
			InventoryRemove(Player, "Shoes", false);
			CharacterRefresh(Player);
			return;
		}
		if ((InventoryGet(Player, "Bra") != null) || (InventoryGet(Player, "Panties") != null) || (InventoryGet(Player, "Socks") != null) || (InventoryGet(Player, "Gloves") != null) || (InventoryGet(Player, "Corset") != null) || (InventoryGet(Player, "Garters") != null)) {
			InventoryRemove(Player, "Bra", false);
			InventoryRemove(Player, "Panties", false);
			InventoryRemove(Player, "Socks", false);
			InventoryRemove(Player, "Gloves", false);
			InventoryRemove(Player, "Corset", false);
			InventoryRemove(Player, "Garters", false);
			CharacterRefresh(Player);
			return;
		}
		return;
	}
	if ((InventoryGet(Player, "ItemHead") != null) || (InventoryGet(Player, "ItemMouth") != null)) {
		InventoryRemove(Player, "ItemHead");
		InventoryRemove(Player, "ItemMouth");
		return;
	}
	if ((InventoryGet(Player, "ItemArms") != null) || (InventoryGet(Player, "ItemTorso") != null)) {
		InventoryRemove(Player, "ItemArms");
		InventoryRemove(Player, "ItemTorso");
		return;
	}
	if ((InventoryGet(Player, "ItemLegs") != null) || (InventoryGet(Player, "ItemFeet") != null)) {
		InventoryRemove(Player, "ItemLegs");
		InventoryRemove(Player, "ItemFeet");
		return;
	}
	CharacterAppearanceRestore(Player, MagicBattlePlayerAppearance);
	CharacterRefresh(Player);
	MagicSchoolEscapeTimer = 0;
	MagicSchoolEscapeInstructor.Stage = "100";
	CharacterSetCurrent(MagicSchoolEscapeInstructor);
	let Money = Math.round((1 / MagicSchoolEscapeSeconds) * 1000);
	CharacterChangeMoney(Player, Money);
	MagicSchoolEscapeInstructor.CurrentDialog = DialogFind(MagicSchoolEscapeInstructor, "EscapeSuccess").replace("MoneyAmount", Money.toString());
	return;
}

/**
 * Sets the difficulty for the escape challenge
 * @param {number} Seconds - The number of seconds before the challenge ends
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeSetTime(Seconds) {
	MagicSchoolEscapeSeconds = parseInt(Seconds);
}

/**
 * Starts the escape challenge and sets the clock
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeStart() {
	MagicBattlePlayerAppearance = CharacterAppearanceStringify(Player);
	CharacterFullRandomRestrain(Player, "ALL");
	MagicSchoolEscapeTimer = CommonTime() + MagicSchoolEscapeSeconds * 1000;
	DialogLeave();
}
