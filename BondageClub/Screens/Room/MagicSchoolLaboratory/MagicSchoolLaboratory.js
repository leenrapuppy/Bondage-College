"use strict";
var MagicSchoolLaboratoryBackground = "MagicSchoolLaboratory";
var MagicSchoolLaboratoryTeacher = null;

/**
 * Loads the magic school laboratory and the teacher
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryLoad() {

	// Generates the teacher if she doesn't exist in memory
	if (MagicSchoolLaboratoryTeacher == null) {
		MagicSchoolLaboratoryTeacher = CharacterLoadNPC("NPC_MagicSchoolLaboratory_Teacher");
		MagicSchoolLaboratoryTeacher.AllowItem = false;
		CharacterNaked(MagicSchoolLaboratoryTeacher);
		InventoryWear(MagicSchoolLaboratoryTeacher, "SpankingToys", "ItemHands");
		InventoryGet(MagicSchoolLaboratoryTeacher, "ItemHands").Property = { Type: "Broom" };
		InventoryWear(MagicSchoolLaboratoryTeacher, "GrandMage", "Cloth", "#555555");
		InventoryWear(MagicSchoolLaboratoryTeacher, "WitchHat1", "Hat", "#777777");
		InventoryWear(MagicSchoolLaboratoryTeacher, "BlackHeart", "Necklace", "#555555");
		InventoryWear(MagicSchoolLaboratoryTeacher, "LongSkirt1", "ClothLower", "#777777");
		InventoryWear(MagicSchoolLaboratoryTeacher, "ThighHighLatexHeels", "Shoes", "#555555");
	}

}

/**
 * Runs the room
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(MagicSchoolLaboratoryTeacher, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryClick() {
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MagicSchoolLaboratoryTeacher);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When the user wants to practice a spell
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratorySpellPractice(SpellNumber) {
}