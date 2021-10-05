"use strict";
var MagicSchoolLaboratoryBackground = "MagicSchoolLaboratory";
var MagicSchoolLaboratoryTeacher = null;
var MagicSchoolLaboratoryPlayerAppearance = null;
var MagicSchoolLaboratoryTeacherAppearance = null;

/**
 * Loads the magic school laboratory and the teacher
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryLoad() {

	// Generates the teacher if she doesn't exist in memory
	if (MagicSchoolLaboratoryTeacher == null) {
		MagicSchoolLaboratoryTeacher = CharacterLoadNPC("NPC_MagicSchoolLaboratory_Teacher");
		MagicSchoolLaboratoryTeacher.AllowItem = false;
		InventoryRemove(MagicSchoolLaboratoryTeacher, "ClothAccessory");
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
	MagicPuzzleSpell = SpellNumber;
	MiniGameStart("MagicPuzzle", 0, "MagicSchoolLaboratorySpellPracticeEnd");
}

/**
 * When the magic spell practice puzzle ends
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratorySpellPracticeEnd() {
	CommonSetScreen("Room", "MagicSchoolLaboratory");
	CharacterSetCurrent(MagicSchoolLaboratoryTeacher);
	MagicSchoolLaboratoryTeacher.CurrentDialog = DialogFind(MagicSchoolLaboratoryTeacher, MiniGameVictory ? "PracticeSuccess" : "PracticeFail");
}

/**
 * Check if someone is a member of a magic house or not
 * @returns {boolean} - TRUE if a member, FALSE if not
 */
function MagicSchoolLaboratoryInHouse(House) {
	if (House == "") return ((ReputationGet("HouseMaiestas") <= 0) && (ReputationGet("HouseVincula") <= 0) && (ReputationGet("HouseAmplector") <= 0) && (ReputationGet("HouseCorporis") <= 0));
	return (ReputationGet("House" + House) > 0);
}

/**
 * Joins a specific magic house, sets the reputation to 1 and clear all other reputations
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryJoinHouse(House) {
	DialogSetReputation("HouseMaiestas", 0);
	DialogSetReputation("HouseVincula", 0);
	DialogSetReputation("HouseAmplector", 0);
	DialogSetReputation("HouseCorporis", 0);
	if (House != "") DialogSetReputation("House" + House, 1);
}

/**
 * Starts a practice battle against the school teacher
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryMagicBattleStart(Difficulty) {
	MagicSchoolLaboratoryPlayerAppearance = CharacterAppearanceStringify(Player);
	MagicSchoolLaboratoryTeacherAppearance = CharacterAppearanceStringify(MagicSchoolLaboratoryTeacher);
	MagicBattleStart(MagicSchoolLaboratoryTeacher, Difficulty, MagicSchoolLaboratoryBackground, "MagicSchoolLaboratoryMagicBattleEnd");
}

/**
 * When the magic battle practice ends
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryMagicBattleEnd() {
	CommonSetScreen("Room", "MagicSchoolLaboratory");
	CharacterAppearanceRestore(Player, MagicSchoolLaboratoryPlayerAppearance);
	CharacterRefresh(Player);
	CharacterAppearanceRestore(MagicSchoolLaboratoryTeacher, MagicSchoolLaboratoryTeacherAppearance);
	CharacterRefresh(MagicSchoolLaboratoryTeacher);
	CharacterSetCurrent(MagicSchoolLaboratoryTeacher);
	MagicSchoolLaboratoryTeacher.CurrentDialog = DialogFind(MagicSchoolLaboratoryTeacher, MiniGameVictory ? "BattleSuccess" : "BattleFail");
}