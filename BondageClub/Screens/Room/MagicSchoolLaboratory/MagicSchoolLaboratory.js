"use strict";
var MagicSchoolLaboratoryBackground = "MagicSchoolLaboratory";
var MagicSchoolLaboratoryTeacher = null;
var MagicSchoolLaboratoryStudent = null;
var MagicSchoolLaboratoryBattleWage = "";

/**
 * Dresses a character C as a witch, the colors and clothes can changes based on the house
 * @param {Character} C - The character that will wear the clothes
 * @param {String} House - The house name
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryPrepareNPC(C, House) {
	if (C.ID != 0) {
		C.Stage = "0";
		C.AllowItem = false;
		C.House = House;
	}
	let DarkColor = "#555555";
	let LightColor = "#777777";
	if (House == "Maiestas") { DarkColor = "#DFAC13"; LightColor = "#FFCC33"; }
	if (House == "Vincula") { DarkColor = "#447744"; LightColor = "#559955"; }
	if (House == "Amplector") { DarkColor = "#335577"; LightColor = "#4477AA"; }
	if (House == "Corporis") { DarkColor = "#BB4422"; LightColor = "#EE6022"; }
	InventoryRemove(C, "HairAccessory1");
	InventoryRemove(C, "HairAccessory2");
	InventoryRemove(C, "HairAccessory3");
	InventoryRemove(C, "ClothAccessory");
	InventoryRemove(C, "Necklace");
	InventoryRemove(C, "Gloves");
	InventoryRemove(C, "Socks");
	InventoryWear(C, "SpankingToys", "ItemHands");
	if (House == "Maiestas") InventoryGet(C, "ItemHands").Property = { Type: "Whip" };
	else if (House == "Vincula") InventoryGet(C, "ItemHands").Property = { Type: "Belt" };
	else if (House == "Amplector") InventoryGet(C, "ItemHands").Property = { Type: "Feather" };
	else if (House == "Corporis") InventoryGet(C, "ItemHands").Property = { Type: "CandleWax" };
	else InventoryGet(C, "ItemHands").Property = { Type: "Broom" };
	InventoryWear(C, "Bra1", "Bra", LightColor);
	InventoryWear(C, "Panties1", "Panties", LightColor);
	InventoryWear(C, "LongSkirt1", "ClothLower", LightColor);
	InventoryWear(C, "GrandMage", "Cloth", DarkColor);
	InventoryWear(C, "ThighHighLatexHeels", "Shoes", DarkColor);
	InventoryWear(C, "WitchHat1", "Hat", LightColor);
	if (House == "Vincula") {
		InventoryWear(C, "NecklaceBallGag", "Necklace");
		InventoryWear(C, "Bodice1", "Cloth", DarkColor);
	}
	if (House == "Corporis") {
		InventoryWear(C, "LatexAnkleShoes", "Shoes", DarkColor);
		InventoryWear(C, "BlackHeart", "Necklace");
		InventoryWear(C, "PleatedSkirt", "ClothLower", DarkColor);
	}
	if (House == "Amplector") {
		InventoryWear(C, "ElegantHeartNecklace", "Necklace");
		InventoryWear(C, "Sandals", "Shoes", DarkColor);
	}
	if (House == "Maiestas") {
		InventoryWear(C, "Tiara1", "Hat", "#AAAAAA");
		InventoryWear(C, "Necklace4", "Necklace", "#999999");
		InventoryWear(C, "Gloves2", "Gloves", "#AAAAAA");
		InventoryWear(C, "AnkleStrapShoes", "Shoes", DarkColor);
	}
		
}

/**
 * Loads the magic school laboratory and the teacher
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryLoad() {
	if (MagicSchoolLaboratoryTeacher == null) {
		MagicSchoolLaboratoryTeacher = CharacterLoadNPC("NPC_MagicSchoolLaboratory_Teacher");
		MagicSchoolLaboratoryPrepareNPC(MagicSchoolLaboratoryTeacher, "");
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
	if (!MagicSchoolLaboratoryInHouse("")) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Explore.png", TextGet("Explore"));
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryClick() {
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MagicSchoolLaboratoryTeacher);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90) && !MagicSchoolLaboratoryInHouse("")) MagicSchoolLaboratoryFindStudent();
}

/**
 * When the user wants to practice a spell
 * @param {number} S - The spell number (0 to strip, etc.)
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
 * @param {string} House - The house name
 * @returns {boolean} - TRUE if a member, FALSE if not
 */
function MagicSchoolLaboratoryInHouse(House) {
	if (House == "") return ((ReputationGet("HouseMaiestas") <= 0) && (ReputationGet("HouseVincula") <= 0) && (ReputationGet("HouseAmplector") <= 0) && (ReputationGet("HouseCorporis") <= 0));
	return (ReputationGet("House" + House) > 0);
}

/**
 * Joins a specific magic house, sets the reputation to 1 and clear all other reputations
 * @param {string} House - The house name
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryJoinHouse(House) {
	DialogSetReputation("HouseMaiestas", 0);
	DialogSetReputation("HouseVincula", 0);
	DialogSetReputation("HouseAmplector", 0);
	DialogSetReputation("HouseCorporis", 0);
	if (House != "") {
		DialogSetReputation("House" + House, 1);
		MagicSchoolLaboratoryPrepareNPC(Player, House);
	}
}

/**
 * Dresses the player as it's current magic school house
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryDressHouse() {
	let House = "";
	if (ReputationGet("HouseMaiestas") > 0) House = "Maiestas";
	if (ReputationGet("HouseVincula") > 0) House = "Vincula";
	if (ReputationGet("HouseAmplector") > 0) House = "Amplector";
	if (ReputationGet("HouseCorporis") > 0) House = "Corporis";
	if (House != "") MagicSchoolLaboratoryPrepareNPC(Player, House);
}

/**
 * Check if a NPC is a member of a magic house or not
 * @param {string} House - The house name
 * @returns {boolean} - TRUE if a member, FALSE if not
 */
function MagicSchoolLaboratoryFromHouse(House) {
	if ((CurrentCharacter == null) || (CurrentCharacter.House == null) || (CurrentCharacter.House == "")) return false;
	return (House == CurrentCharacter.House);
}

/**
 * Check if a NPC is a member of the player's house
 * @param {string} House - The house name
 * @returns {boolean} - TRUE if from same house, FALSE if not
 */
function MagicSchoolLaboratoryFromSameHouse(House) {
	if ((CurrentCharacter == null) || (CurrentCharacter.House == null) || (CurrentCharacter.House == "")) return false;
	if ((House == "Maiestas") && (ReputationGet("HouseMaiestas") > 0)) return true;
	if ((House == "Vincula") && (ReputationGet("HouseVincula") > 0)) return true;
	if ((House == "Amplector") && (ReputationGet("HouseAmplector") > 0)) return true;
	if ((House == "Corporis") && (ReputationGet("HouseCorporis") > 0)) return true;
	return false;
}

/**
 * Check if a NPC is a member of the player's rival house
 * @param {string} House - The house name
 * @returns {boolean} - TRUE if a rival, FALSE if not
 */
function MagicSchoolLaboratoryFromRivalHouse(House) {
	if ((CurrentCharacter == null) || (CurrentCharacter.House == null) || (CurrentCharacter.House == "")) return false;
	if (House != CurrentCharacter.House) return false;
	if ((CurrentCharacter.House == "Maiestas") && (ReputationGet("HouseVincula") > 0)) return true;
	if ((CurrentCharacter.House == "Vincula") && (ReputationGet("HouseMaiestas") > 0)) return true;
	if ((CurrentCharacter.House == "Amplector") && (ReputationGet("HouseCorporis") > 0)) return true;
	if ((CurrentCharacter.House == "Corporis") && (ReputationGet("HouseAmplector") > 0)) return true;
	return false;
}

/**
 * Starts a practice battle against the school teacher
 * @param {number} Difficulty - The difficulty level from 0 to 10 (hardest)
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryMagicBattleStart(Difficulty) {
	MagicBattleStart(MagicSchoolLaboratoryTeacher, Difficulty, MagicSchoolLaboratoryBackground, "MagicSchoolLaboratoryMagicBattleEnd");
}

/**
 * When the magic battle practice ends
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryMagicBattleEnd() {
	CommonSetScreen("Room", "MagicSchoolLaboratory");
	CharacterAppearanceRestore(Player, MagicBattlePlayerAppearance);
	CharacterRefresh(Player);
	CharacterAppearanceRestore(MagicSchoolLaboratoryTeacher, MagicBattleOpponentAppearance);
	CharacterRefresh(MagicSchoolLaboratoryTeacher);
	CharacterSetCurrent(MagicSchoolLaboratoryTeacher);
	MagicSchoolLaboratoryTeacher.CurrentDialog = DialogFind(MagicSchoolLaboratoryTeacher, MiniGameVictory ? "BattleSuccess" : "BattleFail");
}

/**
 * Generates a random student that will meet the player
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryFindStudent() {

	// Builds a list of all possible houses for that student, based on the player house
	let Houses = [];
	if (ReputationGet("HouseMaiestas") > 0) {
		Houses.push("Vincula");
		Houses.push("Vincula");
		Houses.push("Amplector");
		Houses.push("Corporis");
	}
	if (ReputationGet("HouseVincula") > 0) {
		Houses.push("Maiestas");
		Houses.push("Maiestas");
		Houses.push("Amplector");
		Houses.push("Corporis");
	}
	if (ReputationGet("HouseAmplector") > 0) {
		Houses.push("Maiestas");
		Houses.push("Vincula");
		Houses.push("Corporis");
		Houses.push("Corporis");
	}
	if (ReputationGet("HouseCorporis") > 0) {
		Houses.push("Maiestas");
		Houses.push("Vincula");
		Houses.push("Amplector");
		Houses.push("Amplector");
	}

	// Creates the student NPC and gives her a house
	CharacterDelete("NPC_MagicSchoolLaboratory_Student");
	if (MagicSchoolLaboratoryStudent != null) {
		delete CommonCSVCache["Screens/Room/MagicSchoolLaboratory/Dialog_NPC_MagicSchoolLaboratory_Student.csv"];
		CharacterRandomName(MagicSchoolLaboratoryStudent);
	}
	MagicSchoolLaboratoryStudent = CharacterLoadNPC("NPC_MagicSchoolLaboratory_Student");
	CharacterRelease(MagicSchoolLaboratoryStudent);
	MagicSchoolLaboratoryPrepareNPC(MagicSchoolLaboratoryStudent, CommonRandomItemFromList("", Houses));
	setTimeout(() => CharacterSetCurrent(MagicSchoolLaboratoryStudent), 500);
	
}

/**
 * When a fight begins between the player and a student
 * @param {string} Type - The type of battle to do (Normal, Wage or Honor)
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryBattleStudentStart(Type) {
	MagicSchoolLaboratoryBattleWage = Type;
	if (Type == "Wage25") CharacterChangeMoney(Player, -25);
	let Difficulty = 2;
	if (Type == "Wage25") Difficulty = 5;
	if (Type == "Honor") Difficulty = 8;
	MagicBattleStart(MagicSchoolLaboratoryStudent, Difficulty, MagicSchoolLaboratoryBackground, "MagicSchoolLaboratoryBattleStudentEnd");
}

/**
 * When a student battle ends, we release the winner, change reputation or give some money based on the wage
 * @returns {void} - Nothing
 */
function MagicSchoolLaboratoryBattleStudentEnd() {
	CommonSetScreen("Room", "MagicSchoolLaboratory");
	CharacterSetCurrent(MagicSchoolLaboratoryStudent);
	if (MiniGameVictory) {
		MagicSchoolLaboratoryStudent.AllowItem = true;
		CharacterAppearanceRestore(Player, MagicBattlePlayerAppearance);
		CharacterRefresh(Player);
		if (MagicSchoolLaboratoryBattleWage == "Wage25") CharacterChangeMoney(Player, 50);
		let RepGain = (MagicSchoolLaboratoryBattleWage == "Honor") ? 6 : 3;
		if (ReputationGet("HouseMaiestas") > 0) DialogChangeReputation("HouseMaiestas", RepGain);
		if (ReputationGet("HouseVincula") > 0) DialogChangeReputation("HouseVincula", RepGain);
		if (ReputationGet("HouseAmplector") > 0) DialogChangeReputation("HouseAmplector", RepGain);
		if (ReputationGet("HouseCorporis") > 0) DialogChangeReputation("HouseCorporis", RepGain);
		MagicSchoolLaboratoryStudent.Stage = "100";
		MagicSchoolLaboratoryStudent.CurrentDialog = DialogFind(MagicSchoolLaboratoryStudent, "BattleSuccess");
	} else {
		CharacterAppearanceRestore(MagicSchoolLaboratoryStudent, MagicBattleOpponentAppearance);
		CharacterRefresh(MagicSchoolLaboratoryStudent);
		if (MagicSchoolLaboratoryBattleWage == "Honor") {
			if (ReputationGet("HouseMaiestas") >= 3) DialogChangeReputation("HouseMaiestas", -2);
			if (ReputationGet("HouseVincula") >= 3) DialogChangeReputation("HouseVincula", -2);
			if (ReputationGet("HouseAmplector") >= 3) DialogChangeReputation("HouseAmplector", -2);
			if (ReputationGet("HouseCorporis") >= 3) DialogChangeReputation("HouseCorporis", -2);
		}
		MagicSchoolLaboratoryStudent.Stage = "200";
		MagicSchoolLaboratoryStudent.CurrentDialog = DialogFind(MagicSchoolLaboratoryStudent, "BattleFail");
	}
}