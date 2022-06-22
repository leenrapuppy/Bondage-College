"use strict";

/**
 * Loads the screen and removes the key listeners
 * @returns {void} - Nothing
 */
function PlatformProfileLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformProfileRun() {
	DrawRect(0, 0, 2000, 1000, "#EEEEEE");
	DrawImageResize("Screens/Room/PlatformDialog/Character/" + PlatformPlayer.Name + "/" + PlatformPlayer.Status + "/Idle.png", -50, 0, 500, 1000);
	DrawText(TextGet("Name") + " " + PlatformPlayer.Name, 700, 80, "Black", "Silver");
	DrawText(TextGet("Class") + " " + PlatformPlayer.Status, 700, 180, "Black", "Silver");
	DrawText(TextGet("Age" + PlatformPlayer.Name), 700, 280, "Black", "Silver");
	DrawText(TextGet("Level") + " " + PlatformPlayer.Level.toString(), 700, 380, "Black", "Silver");
	DrawText(TextGet("Health") + " " + PlatformPlayer.MaxHealth.toString(), 700, 480, "Black", "Silver");
	DrawTextWrap(TextGet("Intro" + PlatformPlayer.Name), 420, 500, 600, 500, "Black", null, 8);
	DrawButton(1900, 10, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformProfileClick() {
	if (MouseIn(1900, 10, 90, 90)) return PlatformProfileExit();
}

/**
 * When the screens exits, we unload the listeners
 * @returns {void} - Nothing
 */
function PlatformProfileExit() {
	CommonSetScreen("Room", "Platform");
}
