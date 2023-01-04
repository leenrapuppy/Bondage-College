"use strict";
var WheelFortuneCustomizeBackground = "Sheet";
var WheelFortuneCustomizeOffset = 0;
var WheelFortuneCustomizeList = "";

/**
 * Loads the lucky wheel customization screen
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeLoad() {
	WheelFortuneCustomizeOffset = 0;
	if ((Player.OnlineSharedSettings != null) && (Player.OnlineSharedSettings.WheelFortune != null) && (typeof Player.OnlineSharedSettings.WheelFortune === "string"))
		WheelFortuneCustomizeList = Player.OnlineSharedSettings.WheelFortune;
	else
		WheelFortuneCustomizeList = WheelFortuneDefault;
}

/**
 * Draws the lucky wheel customization screen
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeRun() {

	// Draw the header
	DrawText(TextGet("Title"), 650, 105, "Black", "Silver");
	DrawButton(1830, 60, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
	DrawButton(1720, 60, 90, 90, "", "White", "Icons/Accept.png", TextGet("Save"));
	DrawButton(1610, 60, 90, 90, "", "White", "Icons/Reset.png", TextGet("Default"));
	DrawButton(1500, 60, 90, 90, "", "White", "Icons/CheckNone.png", TextGet("CheckNone"));
	DrawButton(1390, 60, 90, 90, "", "White", "Icons/CheckAll.png", TextGet("CheckAll"));
	DrawButton(1280, 60, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));

	// List all wheel options with check boxes
	MainCanvas.textAlign = "left";
	for (let O = WheelFortuneCustomizeOffset; O < WheelFortuneOption.length && O < WheelFortuneCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - WheelFortuneCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		DrawCheckbox(X, Y, 64, 64, TextGet("Option" + WheelFortuneOption[O].ID), (WheelFortuneCustomizeList.indexOf(WheelFortuneOption[O].ID) >= 0));
	}
	MainCanvas.textAlign = "center";

}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeClick() {

	// Click on the "Next" button, we increase the offset
	if (MouseIn(1280, 60, 90, 90)) {
		WheelFortuneCustomizeOffset = WheelFortuneCustomizeOffset + 30;
		if (WheelFortuneCustomizeOffset >= WheelFortuneOption.length) WheelFortuneCustomizeOffset = 0;
	}

	// "Check All" button, adds all options
	if (MouseIn(1390, 60, 90, 90)) {
		WheelFortuneCustomizeList = "";
		for (let O of WheelFortuneOption)
			WheelFortuneCustomizeList = WheelFortuneCustomizeList + O.ID;
	}

	// "Check None" button, clear all options
	if (MouseIn(1500, 60, 90, 90))
		WheelFortuneCustomizeList = "";

	// "Default" button, we reset to game default options
	if (MouseIn(1610, 60, 90, 90))
		WheelFortuneCustomizeList = WheelFortuneDefault;

	// "Exit" buttons
	if (MouseIn(1720, 60, 90, 90)) WheelFortuneCustomizeExit(true);
	if (MouseIn(1830, 60, 90, 90)) WheelFortuneCustomizeExit();

	// Check boxes
	for (let O = WheelFortuneCustomizeOffset; O < WheelFortuneOption.length && O < WheelFortuneCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - WheelFortuneCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		if (MouseIn(X, Y, 64, 64))
			if (WheelFortuneCustomizeList.indexOf(WheelFortuneOption[O].ID) >= 0)
				WheelFortuneCustomizeList = WheelFortuneCustomizeList.replace(WheelFortuneOption[O].ID, "");
			else
				WheelFortuneCustomizeList = WheelFortuneCustomizeList + WheelFortuneOption[O].ID;
	}

}

/**
 * Handles exiting from the screen, updates the lucky wheel in the online shared settings
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeExit(Save) {
	if (Save) {
		// @ts-ignore: Individual properties validated separately
		if (Player.OnlineSharedSettings == null) Player.OnlineSharedSettings = {};
		Player.OnlineSharedSettings.WheelFortune = WheelFortuneCustomizeList;
		ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings });
	}
	CommonSetScreen("Minigame", "WheelFortune");
}
