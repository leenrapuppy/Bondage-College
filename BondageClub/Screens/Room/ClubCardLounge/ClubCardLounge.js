"use strict";
var ClubCardLoungeBackground = "ClubCardLounge";
/** @type {null | NPCCharacter} */
var ClubCardLoungeTutor = null;

/**
 * Loads the club card room and the tutor
 * @returns {void} - Nothing
 */
function ClubCardLoungeLoad() {
	if (ClubCardLoungeTutor == null) {
		CollegeEntranceStudent = CharacterLoadNPC("NPC_ClubCardLounge_Tutor");
		CollegeEntranceStudent.AllowItem = false;
	}
}

/**
 * Runs and draws the club card  room with the player and tutor
 * @returns {void} - Nothing
 */
function ClubCardLoungeRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CollegeEntranceStudent, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 131, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	DrawButton(1885, 237, 90, 90, "", "White", "Icons/ClubCard.png", TextGet("Build"));
}

/**
 * Handles clicks in the college entrance room
 * @returns {void} - Nothing
 */
function ClubCardLoungeClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(CollegeEntranceStudent);
	if (MouseIn(1885, 25, 90, 90)) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 131, 90, 90)) InformationSheetLoadCharacter(Player);
}