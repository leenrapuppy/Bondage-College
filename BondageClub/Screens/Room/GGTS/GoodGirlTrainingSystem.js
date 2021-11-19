"use strict";
var GoodGirlTrainingSystemBackground = "GoodGirlTrainingSystemAI";
var GoodGirlTrainingSystemComputer = null;

/**
 * Loads the GGTS and computer NPC
 * @returns {void} - Nothing
 */
function GoodGirlTrainingSystemLoad() {
	if (GoodGirlTrainingSystemComputer == null) {
		GoodGirlTrainingSystemComputer = CharacterLoadNPC("NPC_GoodGirlTrainingSystem_Computer");
		GoodGirlTrainingSystemComputer.AllowItem = false;
	}
}

/**
 * Runs the room
 * @returns {void} - Nothing
 */
function GoodGirlTrainingSystemRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(GoodGirlTrainingSystemComputer, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function GoodGirlTrainingSystemClick() {
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(GoodGirlTrainingSystemComputer);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "AsylumEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}