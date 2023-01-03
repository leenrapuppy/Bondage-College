"use strict";
var LuckyWheelBackground = "Black";
var LuckyWheelCharacterName = "";
var LuckyWheelRoleplay = false;
var LuckyWheelPos = 0;
var LuckyWheelPosMax = 0;
var LuckyWheelVelocity = 0;
var LuckyWheelVelocityTime = 0;
var LuckyWheelPosY = null;
var LuckyWheelInitY = 0;
var LuckyWheelInitTime = 0;
var LuckyWheelValue = "";
var LuckyWheelList = "";
var LuckyWheelPasswordChar = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var LuckyWheelDefault = "ABCFGHKLMNPQRSUVWabcfgj$!-()0123456";
var LuckyWheelOption = [
	{
		// Gagged
		ID: "A",
		Color: "Yellow",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 0);
		}
	},
	{
		// Gagged for 5 minutes
		ID: "B",
		Color: "Yellow",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 5);
		}
	},
	{
		// Gagged for 15 minutes
		ID: "C",
		Color: "Yellow",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 15);
		}
	},
	{
		// Gagged for 60 minutes
		ID: "D",
		Color: "Yellow",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 60);
		}
	},
	{
		// Gagged for 4 hours
		ID: "E",
		Color: "Yellow",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 240);
		}
	},
	{
		// Blindfolded
		ID: "F",
		Color: "Purple",
		Script: function() {
			LuckyWheelInventoryWear("ItemHead", 0);
		}
	},
	{
		// Blindfolded for 5 minutes
		ID: "G",
		Color: "Purple",
		Script: function() {
			LuckyWheelInventoryWear("ItemHead", 5);
		}
	},
	{
		// Blindfolded for 15 minutes
		ID: "H",
		Color: "Purple",
		Script: function() {
			LuckyWheelInventoryWear("ItemHead", 15);
		}
	},
	{
		// Blindfolded for 60 minutes
		ID: "I",
		Color: "Purple",
		Script: function() {
			LuckyWheelInventoryWear("ItemHead", 60);
		}
	},
	{
		// Blindfolded for 4 hours
		ID: "J",
		Color: "Purple",
		Script: function() {
			LuckyWheelInventoryWear("ItemHead", 240);
		}
	},
	{
		// Arms bound
		ID: "K",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemArms", 0);
		}
	},
	{
		// Arms bound for 5 minutes
		ID: "L",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemArms", 5);
		}
	},
	{
		// Arms bound for 15 minutes
		ID: "M",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemArms", 15);
		}
	},
	{
		// Arms bound for 60 minutes
		ID: "N",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemArms", 60);
		}
	},
	{
		// Arms bound for 4 hours
		ID: "O",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemArms", 240);
		}
	},
	{
		// Legs bound
		ID: "P",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemFeet", 0);
		}
	},
	{
		// Legs bound for 5 minutes
		ID: "Q",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemFeet", 5);
		}
	},
	{
		// Legs bound for 15 minutes
		ID: "R",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemFeet", 15);
		}
	},
	{
		// Legs bound for 60 minutes
		ID: "S",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemFeet", 60);
		}
	},
	{
		// Legs bound for 4 hours
		ID: "T",
		Color: "Blue",
		Script: function() {
			LuckyWheelInventoryWear("ItemFeet", 240);
		}
	},
	{
		// Full bondage
		ID: "U",
		Color: "Orange",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 0);
			LuckyWheelInventoryWear("ItemHead", 0);
			LuckyWheelInventoryWear("ItemArms", 0);
			LuckyWheelInventoryWear("ItemFeet", 0);
		}
	},
	{
		// Full bondage for 5 minutes
		ID: "V",
		Color: "Orange",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 5);
			LuckyWheelInventoryWear("ItemHead", 5);
			LuckyWheelInventoryWear("ItemArms", 5);
			LuckyWheelInventoryWear("ItemFeet", 5);
		}
	},
	{
		// Full bondage for 15 minutes
		ID: "W",
		Color: "Orange",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 15);
			LuckyWheelInventoryWear("ItemHead", 15);
			LuckyWheelInventoryWear("ItemArms", 15);
			LuckyWheelInventoryWear("ItemFeet", 15);
		}
	},
	{
		// Full bondage for 60 minutes
		ID: "X",
		Color: "Orange",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 60);
			LuckyWheelInventoryWear("ItemHead", 60);
			LuckyWheelInventoryWear("ItemArms", 60);
			LuckyWheelInventoryWear("ItemFeet", 60);
		}
	},
	{
		// Full bondage for 4 hours
		ID: "Y",
		Color: "Orange",
		Script: function() {
			LuckyWheelInventoryWear("ItemMouth", 240);
			LuckyWheelInventoryWear("ItemHead", 240);
			LuckyWheelInventoryWear("ItemArms", 240);
			LuckyWheelInventoryWear("ItemFeet", 240);
		}
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
 * Wears an item from the lucky wheel spin
 * @returns {void} - Nothing
 */
function LuckyWheelInventoryWear(Group, Minutes) {

	// If the item is already locked with a timer lock, we extend the time and exit
	let Item = InventoryGet(Player, Group);
	if ((Item != null) && (InventoryGetLock(Item) != null)) {
		if ((Item.Property != null) && (Item.Property.LockedBy === "TimerPasswordPadlock")) {
			Item.Property.RemoveTimer = Item.Property.RemoveTimer + Minutes * 60000;
			if (Item.Property.RemoveTimer > CurrentTime + 240 * 60000) Item.Property.RemoveTimer = CurrentTime + 240 * 60000;
			CharacterRefresh(Player);
			ChatRoomCharacterUpdate(Player);
		}
		return;
	}

	// Tries to wear a random item that locks, 20 tries max
	let Try = 0;
	while (((Item == null) || (Item.Asset == null) || (Item.Asset.AllowLock == false)) && (Try <= 20)) {
		InventoryRemove(Player, Group, false);
		InventoryWearRandom(Player, Group, null, false);
		Item = InventoryGet(Player, Group);
		Try++;
	}

	// Applies a lock if needed
	Item = InventoryGet(Player, Group);
	if ((Minutes != null) && (Minutes > 0) && Item.Asset.AllowLock) {
		InventoryLock(Player, Item, "TimerPasswordPadlock", null, true);
		if (Item.Property == null) Item.Property = {};
		Item.Property.RemoveTimer = CurrentTime + Minutes * 60000;
		Item.Property.RemoveItem = true;
		Item.Property.LockSet = true;
		Item.Property.Password = CommonRandomItemFromList("", LuckyWheelPasswordChar) + CommonRandomItemFromList("", LuckyWheelPasswordChar) + CommonRandomItemFromList("", LuckyWheelPasswordChar) + CommonRandomItemFromList("", LuckyWheelPasswordChar) + CommonRandomItemFromList("", LuckyWheelPasswordChar) + CommonRandomItemFromList("", LuckyWheelPasswordChar);
	}

	// Refresh the character to the whole chat room
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);

}

/**
 * Loads the lucky wheel mini game and builds the wheel
 * @returns {void} - Nothing
 */
function LuckyWheelLoad() {

	// Resets to the default wheel if the options are incorrect
	if ((LuckyWheelList == null) || (typeof LuckyWheelList !== "string") || (LuckyWheelList.length < 2)) LuckyWheelList = LuckyWheelDefault;

	// Shuffles the wheel to give a random order
	LuckyWheelPos = Math.floor(Math.random() * 80);
	LuckyWheelVelocity = 0;
	LuckyWheelList = CommonStringShuffle(LuckyWheelList);

	// Gets the maximum position after which the wheel resets
	LuckyWheelPosMax = LuckyWheelList.length;
	while (LuckyWheelPosMax < 12)
		LuckyWheelPosMax = LuckyWheelPosMax + LuckyWheelPosMax;
	LuckyWheelPosMax = LuckyWheelPosMax * 83;

	// Create events to spin the wheel for mobile or not
	if (!CommonIsMobile) document.getElementById("MainCanvas").addEventListener("mousedown", LuckyWheelMouseDown);
	if (!CommonIsMobile) document.getElementById("MainCanvas").addEventListener("mouseup", LuckyWheelMouseUp);
	if (CommonIsMobile) document.getElementById("MainCanvas").addEventListener("touchstart", LuckyWheelMouseDown);
	if (CommonIsMobile) document.getElementById("MainCanvas").addEventListener("touchend", LuckyWheelMouseUp);

}

/**
 * Draws the full lucky wheel
 * @returns {void} - Nothing
 */
 function LuckyWheelDraw(FullWheel, Pos, MaxPos, X, Y, Zoom) {

	// Draw the black background
	DrawRect(X + 2, Y, 496 * Zoom, 1000 * Zoom, "Black");

	// Make sure the wheel has at least wheel count + 50 elements
	let Wheel = FullWheel.split("");
	while (Wheel.length < FullWheel.length + 50)
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
	DrawEmptyRect(X - 2, Y - 2, 504, 1004 * Zoom, (LuckyWheelVelocity == 0) ? "White" : "Gold", 2);
	DrawImageResize("Screens/MiniGame/LuckyWheel/WheelArrowLeft.png", X - 100, Y + 450 * Zoom, 100 * Zoom, 100 * Zoom);
	DrawImageResize("Screens/MiniGame/LuckyWheel/WheelArrowRight.png", X + 500, Y + 450 * Zoom, 100 * Zoom, 100 * Zoom);

}

/**
 * Runs the lucky wheel mini game
 * @returns {void} - Nothing
 */
function LuckyWheelRun() {

	// If the mouse position changed to spin the wheel
    if (MouseY < 0) LuckyWheelMouseUp();
	if ((LuckyWheelPosY != null) && (LuckyWheelPosY != MouseY) && (MouseY != -1) && (LuckyWheelVelocity == 0)) {
		LuckyWheelPos = LuckyWheelPos - LuckyWheelPosY + MouseY;
		LuckyWheelPosY = MouseY;
	}

	// In a top to bottom spin
	if (LuckyWheelVelocity > 0) {
		let Diff = CommonTime() - LuckyWheelVelocityTime;
		LuckyWheelVelocityTime = LuckyWheelVelocityTime + Diff;
		Diff = (LuckyWheelVelocity * Diff / 1500) + Diff / 40;
		if (Diff > LuckyWheelVelocity) Diff = LuckyWheelVelocity;
		LuckyWheelPos = LuckyWheelPos + Diff;
		LuckyWheelVelocity = LuckyWheelVelocity - Diff;
		if (LuckyWheelVelocity <= 0) LuckyWheelResult();
	}

	// In a bottom to top spin
	if (LuckyWheelVelocity < 0) {
		let Diff = CommonTime() - LuckyWheelVelocityTime;
		LuckyWheelVelocityTime = LuckyWheelVelocityTime + Diff;
		Diff = (LuckyWheelVelocity * Diff * -1 / 1500) + Diff / 40;
		if (Diff > LuckyWheelVelocity * -1) Diff = LuckyWheelVelocity * -1;
		LuckyWheelPos = LuckyWheelPos - Diff;
		LuckyWheelVelocity = LuckyWheelVelocity + Diff;
		if (LuckyWheelVelocity >= 0) LuckyWheelResult();
	}

	// Resets the wheel if max position is reached
	LuckyWheelPos = LuckyWheelPos % LuckyWheelPosMax;

	// Draw the character and buttons
	DrawRect(0, 0, 2000, 1000, "#00000080")
	DrawCharacter(Player, 100, 0, 1, true);
	let BackColor = (LuckyWheelVelocity == 0) ? "White" : "Silver";
	DrawButton(1885, 25, 90, 90, "", BackColor, "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1770, 25, 90, 90, "", BackColor, "Icons/Random.png", TextGet("Random"));
	LuckyWheelDraw(LuckyWheelList, LuckyWheelPos, LuckyWheelPosMax, 750, 0, 1);
	DrawTextWrap(TextGet((LuckyWheelVelocity == 0) ? "Title" : "Wait"), 1375, 200, 560, 200, "White");
	MainCanvas.textAlign = "left";
	DrawCheckbox(1436, 468, 64, 64, TextGet("Roleplay"), LuckyWheelRoleplay, (LuckyWheelVelocity != 0), "White");
	MainCanvas.textAlign = "center";

}

/**
 * Handles clicks during the mini game
 * @returns {void} - Nothing
 */
function LuckyWheelClick() {

	// No more clicks if the wheel is spinning
	if (LuckyWheelVelocity != 0) return;

	// When the user wishes to exit
	if (MouseIn(1885, 25, 90, 90)) LuckyWheelExit();

	// When the user wishes to do a random spin
	if (MouseIn(1770, 25, 90, 90)) {
		LuckyWheelVelocity = LuckyWheelVelocity + 3000 + (Math.random() * 3000);
		LuckyWheelVelocityTime = CommonTime();
		let Msg = TextGet("Spin" + (LuckyWheelRoleplay ? "Roleplay" : ""));
		Msg = Msg.replace("CharacterName", LuckyWheelCharacterName);
		ServerSend("ChatRoomChat", { Content: Msg, Type: "Emote" });
	}

	// Roleplay check box
	if (MouseIn(1436, 468, 64, 64)) LuckyWheelRoleplay = !LuckyWheelRoleplay;

}

/**
 * If the user clicks to spin the wheel, we keep the starting position
 * @returns {void} - Nothing
 */
function LuckyWheelMouseDown() {
	if (MouseIn(750, 0, 500, 1000) && (LuckyWheelVelocity == 0)) {
		LuckyWheelPosY = MouseY;
		LuckyWheelInitY = MouseY;
		LuckyWheelInitTime = CommonTime();
		return;
	}
}

/**
 * If the user releases the mouse/finger to spin the wheel
 * @returns {void} - Nothing
 */
function LuckyWheelMouseUp() {
    if ((LuckyWheelPosY != null) && (LuckyWheelVelocity == 0)) {
		if ((LuckyWheelPosY < 400) && (MouseY == -1)) LuckyWheelPosY = -1;
		if ((LuckyWheelPosY > 600) && (MouseY == -1)) LuckyWheelPosY = 1001;
		if ((LuckyWheelInitTime + 1000 >= CommonTime()) && (Math.abs(LuckyWheelInitY - LuckyWheelPosY) > 300)) {
			LuckyWheelVelocity = (LuckyWheelPosY - LuckyWheelInitY) * 3;
			if (LuckyWheelVelocity > 0) LuckyWheelVelocity = LuckyWheelVelocity + 800 + (Math.random() * 800);
			if (LuckyWheelVelocity < 0) LuckyWheelVelocity = LuckyWheelVelocity - 800 - (Math.random() * 800);
			LuckyWheelVelocityTime = CommonTime();
			let Msg = TextGet("Spin" + (LuckyWheelRoleplay ? "Roleplay" : ""));
			Msg = Msg.replace("CharacterName", LuckyWheelCharacterName);
			ServerSend("ChatRoomChat", { Content: Msg, Type: "Emote" });
		}
		LuckyWheelPosY = null;
	}
}

/**
 * When the wheel result is set, we publish it and return to the chat room
 * @returns {void} - Nothing
 */
function LuckyWheelResult() {
	let Msg = TextGet("Result" + (LuckyWheelRoleplay ? "Roleplay" : "")) + " " + TextGet("Option" + LuckyWheelValue);
	ServerSend("ChatRoomChat", { Content: Msg, Type: "Emote" });
	CommonSetScreen("Online", "ChatRoom");
	if (!LuckyWheelRoleplay)
		for (let O of LuckyWheelOption)
			if (O.ID == LuckyWheelValue)
				if (O.Script != null)
					O.Script();
}

/**
 * When the mini exits
 * @returns {void} - Nothing
 */
function LuckyWheelExit() {
	if (LuckyWheelVelocity == 0) CommonSetScreen("Online", "ChatRoom");
}