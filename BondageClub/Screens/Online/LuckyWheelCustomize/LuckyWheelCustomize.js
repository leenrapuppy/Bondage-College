"use strict";
var LuckyWheelCustomizeBackground = "Sheet";
var LuckyWheelCustomizeOffset = 0;
var LuckyWheelCustomizeList = "";

/**
 * Loads the lucky wheel customization screen
 * @returns {void} - Nothing
 */
function LuckyWheelCustomizeLoad() {
	LuckyWheelCustomizeOffset = 0;
	if ((Player.OnlineSharedSettings != null) && (Player.OnlineSharedSettings.LuckyWheel != null) && (typeof Player.OnlineSharedSettings.LuckyWheel === "string"))
		LuckyWheelCustomizeList = Player.OnlineSharedSettings.LuckyWheel;
	else
		LuckyWheelCustomizeList = LuckyWheelDefault;
}

/**
 * Draws the lucky wheel customization screen
 * @returns {void} - Nothing
 */
function LuckyWheelCustomizeRun() {

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
	for (let O = LuckyWheelCustomizeOffset; O < LuckyWheelOption.length && O < LuckyWheelCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - LuckyWheelCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		DrawCheckbox(X, Y, 64, 64, TextGet("Option" + LuckyWheelOption[O].ID), (LuckyWheelCustomizeList.indexOf(LuckyWheelOption[O].ID) >= 0));
	}
	MainCanvas.textAlign = "center";

}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function LuckyWheelCustomizeClick() {

	// Click on the "Next" button, we increase the offset
	if (MouseIn(1280, 60, 90, 90)) {
		LuckyWheelCustomizeOffset = LuckyWheelCustomizeOffset + 30;
		if (LuckyWheelCustomizeOffset >= LuckyWheelOption.length) LuckyWheelCustomizeOffset = 0;
	}

	// "Check All" button, adds all options
	if (MouseIn(1390, 60, 90, 90)) {
		LuckyWheelCustomizeList = "";
		for (let O of LuckyWheelOption)
			LuckyWheelCustomizeList = LuckyWheelCustomizeList + O.ID;
	}

	// "Check None" button, clear all options
	if (MouseIn(1500, 60, 90, 90))
		LuckyWheelCustomizeList = "";

	// "Default" button, we reset to game default options
	if (MouseIn(1610, 60, 90, 90))
		LuckyWheelCustomizeList = LuckyWheelDefault;

	// "Exit" buttons
	if (MouseIn(1720, 60, 90, 90)) LuckyWheelCustomizeExit(true);
	if (MouseIn(1830, 60, 90, 90)) LuckyWheelCustomizeExit();

	// Check boxes
	for (let O = LuckyWheelCustomizeOffset; O < LuckyWheelOption.length && O < LuckyWheelCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - LuckyWheelCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		if (MouseIn(X, Y, 64, 64))
			if (LuckyWheelCustomizeList.indexOf(LuckyWheelOption[O].ID) >= 0)
				LuckyWheelCustomizeList = LuckyWheelCustomizeList.replace(LuckyWheelOption[O].ID, "");
			else
				LuckyWheelCustomizeList = LuckyWheelCustomizeList + LuckyWheelOption[O].ID;
	}

}

/**
 * Handles exiting from the screen, updates the lucky wheel in the online shared settings
 * @returns {void} - Nothing
 */
function LuckyWheelCustomizeExit(Save) {
	if (Save) {
		// @ts-ignore: Individual properties validated separately
		if (Player.OnlineSharedSettings == null) Player.OnlineSharedSettings = {};
		Player.OnlineSharedSettings.LuckyWheel = LuckyWheelCustomizeList;
		ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings });
	}
	CommonSetScreen("Online", "ChatRoom");
}
