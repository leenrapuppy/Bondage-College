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
	if (typeof WheelFortuneCharacter.OnlineSharedSettings.WheelFortune === "string")
		WheelFortuneCustomizeList = WheelFortuneCharacter.OnlineSharedSettings.WheelFortune;
	else
		WheelFortuneCustomizeList = WheelFortuneDefault;
}

/**
 * Draws the lucky wheel customization screen
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeRun() {
	const isDisabled = !WheelFortuneCharacter.IsPlayer();
	const buttonColor = isDisabled ? "Gray" : "White";
	let titleText = "";
	if (isDisabled) {
		titleText = TextGet("TitleView").replace(
			"DestinationCharacter",
			`${CharacterNickname(WheelFortuneCharacter)}${DialogFindPlayer("'s")}`,
		);
	} else {
		titleText = TextGet("Title");
	}

	// Draw the header
	DrawText(titleText, 650, 105, "Black", "Silver");
	DrawButton(1830, 60, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
	DrawButton(1280, 60, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
	DrawButton(1720, 60, 90, 90, "", buttonColor, "Icons/Accept.png", TextGet("Save"), isDisabled);
	DrawButton(1610, 60, 90, 90, "", buttonColor, "Icons/Reset.png", TextGet("Default"), isDisabled);
	DrawButton(1500, 60, 90, 90, "", buttonColor, "Icons/CheckNone.png", TextGet("CheckNone"), isDisabled);
	DrawButton(1390, 60, 90, 90, "", buttonColor, "Icons/CheckAll.png", TextGet("CheckAll"), isDisabled);

	// List all wheel options with check boxes
	MainCanvas.textAlign = "left";
	for (let O = WheelFortuneCustomizeOffset; O < WheelFortuneOption.length && O < WheelFortuneCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - WheelFortuneCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		DrawCheckbox(
			X, Y, 64, 64, TextGet("Option" + WheelFortuneOption[O].ID),
			(WheelFortuneCustomizeList.indexOf(WheelFortuneOption[O].ID) >= 0), isDisabled,
		);
	}
	MainCanvas.textAlign = "center";

}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeClick() {
	// Exit-without-save button
	if (MouseIn(1830, 60, 90, 90)) WheelFortuneCustomizeExit();

	// Click on the "Next" button, we increase the offset
	if (MouseIn(1280, 60, 90, 90)) {
		WheelFortuneCustomizeOffset = WheelFortuneCustomizeOffset + 30;
		if (WheelFortuneCustomizeOffset >= WheelFortuneOption.length) WheelFortuneCustomizeOffset = 0;
	}

	// Non-player characters only have readonly access; abort at this point if necessary
	if (!WheelFortuneCharacter.IsPlayer()) {
		return;
	}

	// Exit-and-save button
	if (MouseIn(1720, 60, 90, 90)) WheelFortuneCustomizeExit(true);

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
 * @param {boolean} Save - Whether to push the updated selection to the server
 * @returns {void} - Nothing
 */
function WheelFortuneCustomizeExit(Save=false) {
	if (Save && WheelFortuneCharacter.IsPlayer()) {
		// @ts-ignore: Individual properties validated separately
		if (Player.OnlineSharedSettings == null) Player.OnlineSharedSettings = {};
		Player.OnlineSharedSettings.WheelFortune = WheelFortuneCustomizeList;
		ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings });
	}
	CommonSetScreen("MiniGame", "WheelFortune");
}
