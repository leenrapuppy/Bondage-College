"use strict";
var LuckyWheelBackground = "Black";
var LuckyWheelRoleplay = false;
var LuckyWheelPos = 0;
var LuckyWheelValue = "";
var LuckyWheelList = "";
var LuckyWheelDefault = "ABCFGHKLMNPQRSUVWabcfgj$!-()0123456";
var LuckyWheelOption = [
	{
		// Gagged
		ID: "A",
		Color: "Yellow",
		Script: function() {}
	},
	{
		// Gagged for 5 minutes
		ID: "B",
		Color: "Yellow",
		Script: function() {}
	},
	{
		// Gagged for 15 minutes
		ID: "C",
		Color: "Yellow",
		Script: function() {}
	},
	{
		// Gagged for 60 minutes
		ID: "D",
		Color: "Yellow",
		Script: function() {}
	},
	{
		// Gagged for 4 hours
		ID: "E",
		Color: "Yellow",
		Script: function() {}
	},
	{
		// Blindfolded
		ID: "F",
		Color: "Purple",
		Script: function() {}
	},
	{
		// Blindfolded for 5 minutes
		ID: "G",
		Color: "Purple",
		Script: function() {}
	},
	{
		// Blindfolded for 15 minutes
		ID: "H",
		Color: "Purple",
		Script: function() {}
	},
	{
		// Blindfolded for 60 minutes
		ID: "I",
		Color: "Purple",
		Script: function() {}
	},
	{
		// Blindfolded for 4 hours
		ID: "J",
		Color: "Purple",
		Script: function() {}
	},
	{
		// Arms bound
		ID: "K",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Arms bound for 5 minutes
		ID: "L",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Arms bound for 15 minutes
		ID: "M",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Arms bound for 60 minutes
		ID: "N",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Arms bound for 4 hours
		ID: "O",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Legs bound
		ID: "P",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Legs bound for 5 minutes
		ID: "Q",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Legs bound for 15 minutes
		ID: "R",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Legs bound for 60 minutes
		ID: "S",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Legs bound for 4 hours
		ID: "T",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Full bondage
		ID: "U",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Full bondage for 5 minutes
		ID: "V",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Full bondage for 15 minutes
		ID: "W",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Full bondage for 60 minutes
		ID: "X",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Full bondage for 4 hours
		ID: "Y",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Encased
		ID: "a",
		Color: "Red",
		Script: function() {}
	},
	{
		// Encased for 5 minutes
		ID: "b",
		Color: "Red",
		Script: function() {}
	},
	{
		// Encased for 15 minutes
		ID: "c",
		Color: "Red",
		Script: function() {}
	},
	{
		// Encased for 60 minutes
		ID: "d",
		Color: "Red",
		Script: function() {}
	},
	{
		// Encased for 4 hours
		ID: "e",
		Color: "Red",
		Script: function() {}
	},
	{
		// No wardrobe for 5 minutes
		ID: "f",
		Color: "Gray",
		Script: function() {}
	},
	{
		// No wardrobe for 15 minutes
		ID: "g",
		Color: "Gray",
		Script: function() {}
	},
	{
		// No wardrobe for 60 minutes
		ID: "h",
		Color: "Gray",
		Script: function() {}
	},
	{
		// No wardrobe for 4 hours
		ID: "i",
		Color: "Gray",
		Script: function() {}
	},
	{
		// Isolation cell for 5 minutes
		ID: "j",
		Color: "Red",
		Script: function() {}
	},
	{
		// Isolation cell for 15 minutes
		ID: "k",
		Color: "Red",
		Script: function() {}
	},
	{
		// Isolation cell for 60 minutes
		ID: "l",
		Color: "Red",
		Script: function() {}
	},
	{
		// Isolation cell for 4 hours
		ID: "m",
		Color: "Red",
		Script: function() {}
	},
	{
		// Hogtie bondage
		ID: "$",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Shibari bondage
		ID: "!",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Futuristic bondage
		ID: "&",
		Color: "Orange",
		Script: function() {}
	},
	{
		// Maid outfit
		ID: "@",
		Color: "Blue",
		Script: function() {}
	},
	{
		// ADBL outfit
		ID: "#",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Slave outfit
		ID: "+",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Lingerie
		ID: "-",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Underwear
		ID: "(",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Naked
		ID: ")",
		Color: "Blue",
		Script: function() {}
	},
	{
		// Everyone should cheer for you
		ID: "0",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should pat your head
		ID: "1",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should hug you
		ID: "2",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should tickle you
		ID: "3",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should kiss you
		ID: "4",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should pinch you
		ID: "5",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should spank you
		ID: "6",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should caress you
		ID: "7",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should grope you
		ID: "8",
		Color: "Green",
		Script: function() {}
	},
	{
		// Everyone should masturbate you
		ID: "9",
		Color: "Green",
		Script: function() {}
	},
];

/**
 * Loads the lucky wheel mini game and builds the wheel
 * @returns {void} - Nothing
 */
function LuckyWheelLoad() {

	// Resets to the default wheel if the options are incorrect
	if ((LuckyWheelList == null) || (typeof Player.OnlineSharedSettings.LuckyWheel !== "string") || (LuckyWheelList.length < 2)) LuckyWheelList = LuckyWheelDefault;

	// Shuffles the wheel to give a random order
	LuckyWheelPos = Math.floor(Math.random() * 80);
	LuckyWheelList = CommonStringShuffle(LuckyWheelList);

}

/**
 * Draws the full lucky wheel
 * @returns {void} - Nothing
 */
 function LuckyWheelDraw(FullWheel, Pos, MaxPos, X, Y, Zoom) {

	// Draw the black background
	DrawRect(X + 2, Y, 496 * Zoom, 1000 * Zoom, "Black");

	// Make sure the wheel has at least 40 elements
	let Wheel = FullWheel.split("");
	while (Wheel.length < 80)
		Wheel = [].concat(Wheel, FullWheel.split(""));

	// For each elements in the wheel
    for (let W = 0; W < Wheel.length; W++) {

		// If the element would be visible on screen
		let PosY = (Y + 3 + Pos * Zoom + W * 83 * Zoom) - MaxPos;
		if ((PosY > -83) && (PosY < 1000)) {

			// Gets the wheel option image color
			let Color;
			for (let O of LuckyWheelOption)
				if (O.ID == Wheel[W])
					Color = O.Color;
			if ((Color == null) || (Color == "")) Color = "Green";

			// Draw the wheel option image
			let TextColor = "Black";
			if ((PosY >= 417 * Zoom) && (PosY <= 500 * Zoom)) {
				LuckyWheelValue = Wheel[W];
				TextColor = "White";
			}

			// Draw the text
			DrawImageResize("Screens/MiniGame/LuckyWheel/" + Color + ".png", X + 3, PosY, 494 * Zoom, 83 * Zoom);
			DrawTextFit(TextGet("Option" + Wheel[W]), X + 250 * Zoom, PosY + 44 * Zoom, 440, TextColor, "Silver");

		}
                
    }

	// Draw the border and arrow
	DrawEmptyRect(X - 2, Y - 2, 504, 1004 * Zoom, "White", 2);
	DrawImageResize("Screens/MiniGame/LuckyWheel/WheelArrowLeft.png", X - 100, Y + 450 * Zoom, 100 * Zoom, 100 * Zoom);
	DrawImageResize("Screens/MiniGame/LuckyWheel/WheelArrowRight.png", X + 500, Y + 450 * Zoom, 100 * Zoom, 100 * Zoom);

}

/**
 * Runs the lucky wheel mini game
 * @returns {void} - Nothing
 */
function LuckyWheelRun() {

	// Draw the character and buttons
	DrawRect(0, 0, 2000, 1000, "#00000080")
	DrawCharacter(Player, 100, 0, 1, true);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1770, 25, 90, 90, "", "White", "Icons/Random.png", TextGet("Random"));
	LuckyWheelDraw(LuckyWheelList, LuckyWheelPos, 1000, 750, 0, 1);
	DrawTextWrap(TextGet("Title"), 1375, 200, 560, 200, "White");
	MainCanvas.textAlign = "left";
	DrawCheckbox(1436, 468, 64, 64, TextGet("Roleplay"), LuckyWheelRoleplay, false, "White");
	MainCanvas.textAlign = "center";

}

/**
 * Handles clicks during the mini game
 * @returns {void} - Nothing
 */
function LuckyWheelClick() {

	// When the user wishes to exit
	if (MouseIn(1885, 25, 90, 90)) LuckyWheelExit();

	// Roleplay check box
	if (MouseIn(1436, 468, 64, 64)) LuckyWheelRoleplay = !LuckyWheelRoleplay;

}

/**
 * When the mini exits
 * @returns {void} - Nothing
 */
function LuckyWheelExit() {
	CommonSetScreen("Online", "ChatRoom");
}