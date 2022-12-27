"use strict";
var LuckyWheelCustomizeBackground = "Sheet";
var LuckyWheelCustomizeOffset = 0;
var LuckyWheelCustomizeList = "";
var LuckyWheelCustomizeDefault = "ABCFGHKLMNPQRSUVWabcfgj$!-()0123456";
var LuckyWheelCustomizeOption = [
	{
		// Gagged
		ID: "A",
		Script: function() {}
	},
	{
		// Gagged for 5 minutes
		ID: "B",
		Script: function() {}
	},
	{
		// Gagged for 15 minutes
		ID: "C",
		Script: function() {}
	},
	{
		// Gagged for 60 minutes
		ID: "D",
		Script: function() {}
	},
	{
		// Gagged for 4 hours
		ID: "E",
		Script: function() {}
	},
	{
		// Blindfolded
		ID: "F",
		Script: function() {}
	},
	{
		// Blindfolded for 5 minutes
		ID: "G",
		Script: function() {}
	},
	{
		// Blindfolded for 15 minutes
		ID: "H",
		Script: function() {}
	},
	{
		// Blindfolded for 60 minutes
		ID: "I",
		Script: function() {}
	},
	{
		// Blindfolded for 4 hours
		ID: "J",
		Script: function() {}
	},
	{
		// Arms bound
		ID: "K",
		Script: function() {}
	},
	{
		// Arms bound for 5 minutes
		ID: "L",
		Script: function() {}
	},
	{
		// Arms bound for 15 minutes
		ID: "M",
		Script: function() {}
	},
	{
		// Arms bound for 60 minutes
		ID: "N",
		Script: function() {}
	},
	{
		// Arms bound for 4 hours
		ID: "O",
		Script: function() {}
	},
	{
		// Legs bound
		ID: "P",
		Script: function() {}
	},
	{
		// Legs bound for 5 minutes
		ID: "Q",
		Script: function() {}
	},
	{
		// Legs bound for 15 minutes
		ID: "R",
		Script: function() {}
	},
	{
		// Legs bound for 60 minutes
		ID: "S",
		Script: function() {}
	},
	{
		// Legs bound for 4 hours
		ID: "T",
		Script: function() {}
	},
	{
		// Full bondage
		ID: "U",
		Script: function() {}
	},
	{
		// Full bondage for 5 minutes
		ID: "V",
		Script: function() {}
	},
	{
		// Full bondage for 15 minutes
		ID: "W",
		Script: function() {}
	},
	{
		// Full bondage for 60 minutes
		ID: "X",
		Script: function() {}
	},
	{
		// Full bondage for 4 hours
		ID: "Y",
		Script: function() {}
	},
	{
		// Encased
		ID: "a",
		Script: function() {}
	},
	{
		// Encased for 5 minutes
		ID: "b",
		Script: function() {}
	},
	{
		// Encased for 15 minutes
		ID: "c",
		Script: function() {}
	},
	{
		// Encased for 60 minutes
		ID: "d",
		Script: function() {}
	},
	{
		// Encased for 4 hours
		ID: "e",
		Script: function() {}
	},
	{
		// No wardrobe for 5 minutes
		ID: "f",
		Script: function() {}
	},
	{
		// No wardrobe for 15 minutes
		ID: "g",
		Script: function() {}
	},
	{
		// No wardrobe for 60 minutes
		ID: "h",
		Script: function() {}
	},
	{
		// No wardrobe for 4 hours
		ID: "i",
		Script: function() {}
	},
	{
		// Isolation cell for 5 minutes
		ID: "j",
		Script: function() {}
	},
	{
		// Isolation cell for 15 minutes
		ID: "k",
		Script: function() {}
	},
	{
		// Isolation cell for 60 minutes
		ID: "l",
		Script: function() {}
	},
	{
		// Isolation cell for 4 hours
		ID: "m",
		Script: function() {}
	},
	{
		// Hogtie bondage
		ID: "$",
		Script: function() {}
	},
	{
		// Shibari bondage
		ID: "!",
		Script: function() {}
	},
	{
		// Futuristic bondage
		ID: "&",
		Script: function() {}
	},
	{
		// Maid outfit
		ID: "@",
		Script: function() {}
	},
	{
		// ADBL outfit
		ID: "#",
		Script: function() {}
	},
	{
		// Slave outfit
		ID: "+",
		Script: function() {}
	},
	{
		// Lingerie
		ID: "-",
		Script: function() {}
	},
	{
		// Underwear
		ID: "(",
		Script: function() {}
	},
	{
		// Naked
		ID: ")",
		Script: function() {}
	},
	{
		// Everyone should cheer for you
		ID: "0",
		Script: function() {}
	},
	{
		// Everyone should pat your head
		ID: "1",
		Script: function() {}
	},
	{
		// Everyone should hug you
		ID: "2",
		Script: function() {}
	},
	{
		// Everyone should tickle you
		ID: "3",
		Script: function() {}
	},
	{
		// Everyone should kiss you
		ID: "4",
		Script: function() {}
	},
	{
		// Everyone should pinch you
		ID: "5",
		Script: function() {}
	},
	{
		// Everyone should spank you
		ID: "6",
		Script: function() {}
	},
	{
		// Everyone should caress you
		ID: "7",
		Script: function() {}
	},
	{
		// Everyone should grope you
		ID: "8",
		Script: function() {}
	},
	{
		// Everyone should masturbate you
		ID: "9",
		Script: function() {}
	},
];

/**
 * Loads the lucky wheel customization screen
 * @returns {void} - Nothing
 */
function LuckyWheelCustomizeLoad() {
	LuckyWheelCustomizeOffset = 0;
	if ((Player.OnlineSharedSettings != null) && (Player.OnlineSharedSettings.LuckyWheel != null) && (typeof Player.OnlineSharedSettings.LuckyWheel === "string"))
		LuckyWheelCustomizeList = Player.OnlineSharedSettings.LuckyWheel;
	else
		LuckyWheelCustomizeList = LuckyWheelCustomizeDefault;
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
	for (let O = LuckyWheelCustomizeOffset; O < LuckyWheelCustomizeOption.length && O < LuckyWheelCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - LuckyWheelCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		DrawCheckbox(X, Y, 64, 64, TextGet("Option" + LuckyWheelCustomizeOption[O].ID), (LuckyWheelCustomizeList.indexOf(LuckyWheelCustomizeOption[O].ID) >= 0));
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
		if (LuckyWheelCustomizeOffset >= LuckyWheelCustomizeOption.length) LuckyWheelCustomizeOffset = 0;
	}

	// "Check All" button, adds all options
	if (MouseIn(1390, 60, 90, 90)) {
		LuckyWheelCustomizeList = "";
		for (let O of LuckyWheelCustomizeOption)
			LuckyWheelCustomizeList = LuckyWheelCustomizeList + O.ID;
	}

	// "Check None" button, clear all options
	if (MouseIn(1500, 60, 90, 90))
		LuckyWheelCustomizeList = "";

	// "Default" button, we reset to game default options
	if (MouseIn(1610, 60, 90, 90))
		LuckyWheelCustomizeList = LuckyWheelCustomizeDefault;

	// "Exit" buttons
	if (MouseIn(1720, 60, 90, 90)) LuckyWheelCustomizeExit(true);
	if (MouseIn(1830, 60, 90, 90)) LuckyWheelCustomizeExit();

	// Check boxes
	for (let O = LuckyWheelCustomizeOffset; O < LuckyWheelCustomizeOption.length && O < LuckyWheelCustomizeOffset + 30; O++) {
		let X = 100 + Math.floor((O - LuckyWheelCustomizeOffset) / 10) * 600;
		let Y = 175 + ((O % 10) * 75);
		if (MouseIn(X, Y, 64, 64))
			if (LuckyWheelCustomizeList.indexOf(LuckyWheelCustomizeOption[O].ID) >= 0)
				LuckyWheelCustomizeList = LuckyWheelCustomizeList.replace(LuckyWheelCustomizeOption[O].ID, "");
			else
				LuckyWheelCustomizeList = LuckyWheelCustomizeList + LuckyWheelCustomizeOption[O].ID;
	}

}

/**
 * Handles exiting from the screen, updates the lucky wheel in the online shared settings
 * @returns {void} - Nothing
 */
function LuckyWheelCustomizeExit(Save) {
	if (Save) {
		if (Player.OnlineSharedSettings == null) Player.OnlineSharedSettings = {};
		Player.OnlineSharedSettings.LuckyWheel = LuckyWheelCustomizeList;
		ServerAccountUpdate.QueueData({ OnlineSharedSettings: Player.OnlineSharedSettings });
	}
	CommonSetScreen("Online", "ChatRoom");
}
