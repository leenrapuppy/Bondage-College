"use strict";
var PrivateBedBackground = "Private";

/**
 * Loads the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedLoad() {
	PrivateBedBackground = PrivateBackground;
}

/**
 * Runs the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedRun() {
	if (LogQuery("BedBlack", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/Black.png", 0, 0);
	if (LogQuery("BedWhite", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/White.png", 0, 0);
	let Y = 0;
	if (Player.HeightRatio != null) Y = (1 - Player.HeightRatio) * -1000;
	DrawCharacter(Player, 750, Y, 1);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (Player.CanChangeOwnClothes()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Dress.png", TextGet("Dress"));
}

/**
 * Handles clicks in the private bedroom.
 * @returns {void} - Nothing.
 */
function PrivateBedClick() {
	if (MouseIn(1885, 25, 90, 90)) PrivateBedExit();
	if (MouseIn(1885, 145, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);
}

/**
 * When the player exits the private bedroom.
 * @returns {void} - Nothing.
 */
function PrivateBedExit(Type) {
	CommonSetScreen("Room", "Private");
}