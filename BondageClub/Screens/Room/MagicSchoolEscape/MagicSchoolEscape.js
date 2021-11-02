"use strict";
var MagicSchoolEscapeBackground = "MagicSchoolEscape";
var MagicSchoolEscapeInstructor = null;

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
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(MagicSchoolEscapeInstructor, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeClick() {
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MagicSchoolEscapeInstructor);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MagicSchoolLaboratory");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}