"use strict";
var AsylumMeetingBackground = "AsylumMeeting";
var AsylumMeetingPatientLeft = null;
var AsylumMeetingPatientRight = null;

// Returns TRUE if specific dialog conditions are met
/**
 * Checks if the player can be released
 * @returns {boolean} - Returns true, if the player can be released, false otherwise
 */
function AsylumMeetingCanReleasePlayer() { return (Player.IsRestrained() && !AsylumMeetingPatientLeft.IsRestrained() && !InventoryIsWorn(Player, "FuturisticCuffs", "ItemArms") && (LogValue("Committed", "Asylum") >= CurrentTime)); }
/**
 * Checks if the player cannot be released
 * @returns {boolean} - Returns true, if the player cannot be released, false otherwise
 */
function AsylumMeetingCannotReleasePlayer() { return (Player.IsRestrained() && (AsylumMeetingPatientLeft.IsRestrained() || InventoryIsWorn(Player, "FuturisticCuffs", "ItemArms") || (LogValue("Committed", "Asylum") < CurrentTime))); }
/**
 * Checks wether the player can be restrained or not
 * @returns {boolean} - Returns true, if the player can be restrained, flase otherwise
 */
function AsylumMeetingCanRestrainPlayer() { return (!Player.IsRestrained() && !AsylumMeetingPatientLeft.IsRestrained() && (LogValue("Committed", "Asylum") >= CurrentTime)); }
function AsylumMeetingCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()); }
function AsylumMeetingWearingGGTS() { return InventoryIsWorn(CurrentCharacter, "FuturisticCuffs", "ItemArms"); }
function AsylumMeetingGGTSCollar() { return InventoryIsWorn(CurrentCharacter, "FuturisticCollar", "ItemNeck"); }

/**
 * Loads the room and it's patients
 * @returns {void} - Nothing
 */
function AsylumMeetingLoad() {
	
	// Dress the left patient (dealer)
	if (AsylumMeetingPatientLeft == null) {
		AsylumMeetingPatientLeft = CharacterLoadNPC("NPC_AsylumMeeting_PatientLeft");
		AsylumEntranceWearPatientClothes(AsylumMeetingPatientLeft);
		AsylumMeetingPatientLeft.AllowItem = false;
		AsylumMeetingPatientLeft.RunAway = false;
		InventoryWear(AsylumMeetingPatientLeft, "Beret1", "Hat", "#BB0000");
	}

	// Dress the right patient (bound girl)
	if (AsylumMeetingPatientRight == null) {
		AsylumMeetingPatientRight = CharacterLoadNPC("NPC_AsylumMeeting_PatientRight");
		AsylumEntranceWearPatientClothes(AsylumMeetingPatientRight);
		InventoryWear(AsylumMeetingPatientRight, "SlaveCollar", "ItemNeck");
		InventoryWear(AsylumMeetingPatientRight, "StraitJacket", "ItemArms");
		InventoryWear(AsylumMeetingPatientRight, "SmallBlindfold", "ItemHead");
		InventoryWear(AsylumMeetingPatientRight, "MuzzleGag", "ItemMouth");
		InventoryAdd(AsylumMeetingPatientRight, "StraitJacket", "ItemArms");
		InventoryAdd(AsylumMeetingPatientRight, "SmallBlindfold", "ItemHead");
		InventoryAdd(AsylumMeetingPatientRight, "MuzzleGag", "ItemMouth");
	}

	// At level 6 GGTS, everyone is a full slave
	let Level = AsylumGGTSGetLevel(Player);
	if (Level >= 6) {
		AsylumGGTSDroneDress(AsylumMeetingPatientLeft);
		InventoryWear(AsylumMeetingPatientLeft, "Beret1", "Hat", "#BB0000");
		AsylumGGTSDroneDress(AsylumMeetingPatientRight);
		InventoryWear(AsylumMeetingPatientRight, "FuturisticHarnessBallGag", "ItemMouth");
	} else {

		// At level 2 GGTS or more, the right patient joins the system
		if (Level >= 2) {
			InventoryWear(AsylumMeetingPatientRight, "FuturisticCuffs", "ItemArms");
			InventoryGet(AsylumMeetingPatientRight, "ItemArms").Property = { SetPose: ["BackBoxTie"], Difficulty: 10, Effect: ["Block", "Prone"] };
			InventoryWear(AsylumMeetingPatientRight, "FuturisticAnkleCuffs", "ItemFeet");
			InventoryAdd(AsylumMeetingPatientRight, "FuturisticCuffs", "ItemArms");
			InventoryAdd(AsylumMeetingPatientRight, "FuturisticAnkleCuffs", "ItemFeet");
		}

		// At level 3 GGTS or more, the left patient joins the system
		if (Level >= 3) {
			InventoryWear(AsylumMeetingPatientLeft, "FuturisticCuffs", "ItemArms");
			InventoryWear(AsylumMeetingPatientLeft, "FuturisticAnkleCuffs", "ItemFeet");
			InventoryAdd(AsylumMeetingPatientLeft, "FuturisticCuffs", "ItemArms");
			InventoryAdd(AsylumMeetingPatientLeft, "FuturisticAnkleCuffs", "ItemFeet");
			InventoryWear(AsylumMeetingPatientRight, "FuturisticHarnessBallGag", "ItemMouth");
			InventoryAdd(AsylumMeetingPatientRight, "FuturisticHarnessBallGag", "ItemMouth");
		}

		// At level 5 or more, both patients gets the GGTS collar
		if (Level >= 5) {
			InventoryWear(AsylumMeetingPatientLeft, "FuturisticCollar", "ItemNeck");
			InventoryWear(AsylumMeetingPatientRight, "FuturisticCollar", "ItemNeck");
		}

	}

}

/**
 * Runs the room. Is called at short intervals so don't use expensive loops or function calls from here
 * @returns {void} - Nothing
 */
function AsylumMeetingRun() {
	if (!AsylumMeetingPatientLeft.RunAway) DrawCharacter(AsylumMeetingPatientLeft, 250, 0, 1);
	DrawCharacter(Player, 750, 0, 1);
	DrawCharacter(AsylumMeetingPatientRight, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

/**
 * Handles the click events. Is called by CommonClick()
 * @returns {void} - Nothing
 */
function AsylumMeetingClick() {
	if (MouseIn(250, 0, 500, 1000) && !AsylumMeetingPatientLeft.RunAway) CharacterSetCurrent(AsylumMeetingPatientLeft);
	if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(AsylumMeetingPatientRight);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "AsylumEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When the player smokes with the patient
 * @returns {void} - Nothing
 */
function AsylumMeetingSmoke() {
	CharacterSetFacialExpression(Player, "Blush", "Low", 15);
	CharacterSetFacialExpression(Player, "Eyebrows", "Soft", 15);
	CharacterSetFacialExpression(AsylumMeetingPatientLeft, "Blush", "Low", 15);
	CharacterSetFacialExpression(AsylumMeetingPatientLeft, "Eyebrows", "Soft", 15);
	CharacterChangeMoney(Player, -1);
}

/**
 * The player buys a vibrating wand from the left hand patient
 * @returns {void} - Nothing
 */
function AsylumMeetingBuyVibratingWand() {
	InventoryAdd(Player, "VibratingWand", "ItemVulva");
	CharacterChangeMoney(Player, -80);
	DialogChangeReputation("Asylum", -5);
}

/**
 * The player buys lockpicks from the left hand patient
 * @returns {void} - Nothing
 */
function AsylumMeetingBuyLockPicks() {
	InventoryAdd(Player, "Lockpicks", "ItemMisc");
	CharacterChangeMoney(Player, -40);
}

/**
 * The player pays the left hand patient to release her
 * @returns {void} - Nothing
 */
function AsylumMeetingReleaseForMoney() {
	CharacterRelease(Player);
	CharacterChangeMoney(Player, -10);
	DialogChangeReputation("Dominant", -1);
}

/**
 * When the girl on the left runs away, the player's reputation changes
 * @param {number} RepChange - The amount to change the player's reputation by
 * @returns {void} - Nothing
 */
function AsylumMeetingRunAway(RepChange) {
	DialogChangeReputation("Asylum", RepChange);
	DialogLeave();
	AsylumMeetingPatientLeft.RunAway = true;
}

/**
 * When the player gets restrained by the left hand patient
 * @param {"FEW"|"LOT"|"ALL"} RestraintsType - The amount of restraints to put on the player
 * @returns {void} - Nothing
 */
function AsylumMeetingRestrainPlayer(RestraintsType) {
	CharacterFullRandomRestrain(Player, RestraintsType);
	DialogChangeReputation("Dominant", -1);
}

/**
 * When the player plays with a patient, she blushes
 * @param {"Low"| "Medium"| "High"| "VeryHigh"| "Extreme"| "ShortBreath"} BlushType - The expression to use
 * @returns {void} - Nothing
 */
function AsylumMeetingBlush(BlushType) {
	CharacterSetFacialExpression(CurrentCharacter, "Blush", BlushType, 10);
	CharacterSetFacialExpression(CurrentCharacter, "Eyebrows", "Lowered", 10);
}