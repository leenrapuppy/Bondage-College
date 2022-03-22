"use strict";
var PlatformDialog = null;
var PlatformDialogBackground = null;
var PlatformDialogText = null;
var PlatformDialogCharacter = null;
var PlatformDialogPosition = 0;
var PlatformDialogData = [
	{
		Name: "Intro",
		Exit : function () { CommonSetScreen("Room", "Platform") },
		Dialog: [
			{
				Start: true,
				Background: "MaidBed",
				Character: [
					{
						Name: "Melody",
						Status: "Underwear",
						Image: "Sleep",
						Left: 0,
						Top: 200
					}
				]
			},
			{ Text: "Zzzzzzzzzz...", },
			{ Text: "Zzzzz..." },
			{
				Character: [
					{
						Name: "Melody",
						Status: "Underwear",
						Image: "Lay",
						Left: 0,
						Top: -150
					}
				]
			},
			{ Text: "Is it morning already?" },
			{ Text: "It's a big day today, there's so much to do.  Let's review..." },
			{ Text: "First thing first, I need to unlock and bathe Lady Olivia." },
			{ Text: "Secondly, I have to clean the royal restraints for Countess Isabella." },
			{ Text: "And finally, I need to serve dinner for Marchioness Camille." },
			{ 
				Text: "Time to get dressed!",
				Background: "Black",
				Character: [
					{
						Name: "Melody",
						Status: "Maid",
						Image: "StandCocky",
						Left: 750,
						Top: 0
					}
				]
			},
			{ Text: "Lady Olivia needs me first.  Let's go find her." },
		]
	}
];

function PlatformDialogLoadPosition(Position) {
	PlatformDialogPosition = Position;
	if (Position >= PlatformDialog.Dialog.length) return PlatformDialog.Exit();
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Background != null)) PlatformDialogBackground = "../Screens/Room/PlatformDialog/Background/" + PlatformDialog.Dialog[Position].Background;
	PlatformDialogText = PlatformDialog.Dialog[Position].Text;
	if ((Position == 0) || (PlatformDialog.Dialog[Position].Character != null)) PlatformDialogCharacter = PlatformDialog.Dialog[Position].Character;
}

function PlatformDialogStart(DialogName) {
	PlatformDialog = null;
	for (let Dialog of PlatformDialogData)
		if (Dialog.Name == DialogName)
			PlatformDialog = Dialog;
	if (PlatformDialog == null) return;
	PlatformDialogLoadPosition(0);
	CommonSetScreen("Room", "PlatformDialog");
}

/**
 * Loads the screen
 * @returns {void} - Nothing
 */
function PlatformDialogLoad() {
}

function PlatformDialogDraw() {
	if (PlatformDialogCharacter != null)
		for (let Character of PlatformDialogCharacter)
			DrawImage("Screens/Room/PlatformDialog/Character/" + Character.Name + "/" + Character.Status + "/" + Character.Image + ".png", Character.Left, Character.Top);
	if (PlatformDialogText != null) {
		DrawEmptyRect(17, 677, 1966, 306, "#fe92cf", 6);
		DrawRect(20, 680, 1960, 300, "#000000E0");
		DrawText(PlatformDialogText, 1000, 830, "White", "Black");
	}
	
}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformDialogRun() {
	PlatformDialogDraw();
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformDialogClick() {
	PlatformDialogLoadPosition(PlatformDialogPosition + 1);
}
