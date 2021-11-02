"use strict";
var MagicSchoolEscapeBackground = "MagicSchoolEscape";
var MagicSchoolEscapeInstructor = null;
var MagicSchoolEscapeMinute = 6;
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
	}

}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeClick() {
	if (MagicSchoolEscapeTimer < CommonTime()) {
		if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MagicSchoolEscapeInstructor);
		if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MagicSchoolLaboratory");
		if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	} else {
	}
}

/**
 * Sets the difficulty for the escape challenge
 * @param {number} Minutes - The number of minutes before the challenge ends
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeSetTime(Minute) {
	MagicSchoolEscapeMinute = parseInt(Minute);
}

/**
 * Starts the escape challenge and sets the clock
 * @returns {void} - Nothing
 */
function MagicSchoolEscapeStart() {
	MagicSchoolEscapeTimer = CommonTime() + MagicSchoolEscapeMinute * 6000;
	DialogLeave();
}
