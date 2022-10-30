"use strict";
var PrivateBedBackground = "Private";
var PrivateBedCharacter = [];
var PrivateBedActivity = "Caress";
var PrivateBedActivityList = ["Caress", "Kiss"];
var PrivateBedLog = [];

/**
 * Loads the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedLoad() {
	PrivateBedLog = [];
	CharacterSetActivePose(Player, null, true);
	PrivateBedBackground = PrivateBackground;
	PrivateBedCharacter = [];
	PrivateBedCharacter.push(Player);
	Player.PrivateBedLeft = 1100;
	Player.PrivateBedTop = 0;
	if (Player.HeightRatio != null) Player.PrivateBedTop = (1 - Player.HeightRatio) * -1000;
}

/**
 * Draws a private bedroom character.
 * @param {Character} C - The character to draw.
 * @returns {void} - Nothing.
 */
function PrivateBedDrawCharacter(C) {
	DrawCharacter(C, C.PrivateBedLeft, C.PrivateBedTop, 1);
}

/**
 * Runs the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedRun() {
	if (LogQuery("BedBlack", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/Black.png", 0, 0);
	if (LogQuery("BedWhite", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/White.png", 0, 0);
	for (let C of PrivateBedCharacter)
		PrivateBedDrawCharacter(C);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (Player.CanChangeOwnClothes()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Dress.png", TextGet("Dress"));
	for (let A = PrivateBedActivityList.length - 1; A >= 0; A--)
		DrawButton(20 + (A * 110), 20, 90, 90, "", ((PrivateBedActivityList[A] == PrivateBedActivity) ? "#AAFFAA" : "White"), "Icons/Activity/" + PrivateBedActivityList[A] + ".png", TextGet("Activity" + PrivateBedActivityList[A]));
	DrawRect(20, 260, 820, 720, "#000000A0");
	DrawEmptyRect(20, 260, 820, 720, "#FFFFFF", 2);
	for (let L = PrivateBedLog.length - 1; L >= 0; L--)
		DrawTextFit(PrivateBedLog[L], 420, (L * 57) + 305, 800, "#FFFFFF", "#000000");
}

/**
 * Starts an arousal action on a character.
 * @param {Character} Source - The source character.
 * @param {Character} Target - The target character.
 * @param {AssetGroup} Group - The zone / group to target.
 * @param {String} Activity - The activity to do.
 * @returns {void} - Nothing.
 */
function PrivateBedActivityStart(Source, Target, Group, Activity) {
	ActivityEffect(Source, Target, Activity, Group.Name, 1);
	if (PrivateBedLog.length >= 12) PrivateBedLog.splice(0, 1);
	PrivateBedLog.push(CharacterNickname(Source) + " " + TextGet("Activity" + Activity) + " " + ((Source.ID == Target.ID) ? TextGet("Her") : CharacterNickname(Target)) + " " + Group.Description);
}

/**
 * Handles clicks in the private bedroom.
 * @returns {void} - Nothing.
 */
function PrivateBedClick() {

	// Bedroom buttons on the right side
	if (MouseIn(1885, 25, 90, 90)) PrivateBedExit();
	if (MouseIn(1885, 145, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);

	// Activity buttons on the left side
	for (let A = PrivateBedActivityList.length - 1; A >= 0; A--)
		if (MouseIn(20 + (A * 110), 20, 90, 90))
			PrivateBedActivity = PrivateBedActivityList[A];

	// If an arousal zone on one of the character was clicked
	for (let C of PrivateBedCharacter)
		if (MouseIn(C.PrivateBedLeft, C.PrivateBedTop, 500, C.HeightRatio * 1000))
			for (let A = 0; A < AssetGroup.length; A++)
				if ((AssetGroup[A].Zone != null) && !AssetGroup[A].MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", AssetGroup[A].Name).length)
					if (ActivityCanBeDone(C, PrivateBedActivity, AssetGroup[A].Name) && !InventoryGroupIsBlocked(C, AssetGroup[A].Name, true))
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if (DialogClickedInZone(C, AssetGroup[A].Zone[Z], 1, C.PrivateBedLeft, C.PrivateBedTop, C.HeightRatio))
								return PrivateBedActivityStart(Player, C, AssetGroup[A], PrivateBedActivity);

}

/**
 * When the player exits the private bedroom.
 * @returns {void} - Nothing.
 */
function PrivateBedExit(Type) {
	CommonSetScreen("Room", "Private");
}