"use strict";
var PokerBackground = "White";
var PokerPlayer = [
	{ Type: "Character", Name: "Player", Money: 100 },
	{ Type: "ImageSet", Name: "Amanda", Money: 100 },
	{ Type: "ImageSet", Name: "Sarah", Money: 100 },
	{ Type: "ImageSet", Name: "Sophie", Money: 100 }
];
var PokerMode = "";
var PokerGame = "TexasHoldem"
var PokerShowPlayer = true;
var PokerOpponentType = ["None", "Friend", "ImageSet", "ModelSet"];

/**
 * Loads the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerLoad() {
	PokerPlayer[0].Character = Player;
}

/**
 * Draws a poker player behind the table
 * @returns {void} - Nothing
 */
function PokerDrawPlayer(P, X, Y) {
	if ((P == null) || (P.Type == null) || (P.Name == null) || (P.Money == null)) return;
	if (P.Type == "ImageSet") DrawImageEx("Screens/Room/Poker/" + P.Name + "/" + P.Name + "3.jpg", X, Y, {Canvas: MainCanvas, Zoom: 1.5});
	if (P.Type == "Character") DrawCharacter(P.Character, X - 150, Y - 60, 1.2, false);
}

/**
 * Runs & Draws the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerRun() {
	for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
		PokerDrawPlayer(PokerPlayer[P], (PokerShowPlayer ? 100 : -125) + P * 450, 20);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawImage("Screens/Room/Poker/Table.png", 0, 650);
	if (PokerMode == "") {
		DrawButton(100, 790, 64, 64, "", "White", PokerShowPlayer ? "Icons/Checked.png" : "");
		DrawText(TextGet("ShowPlayer"), 300, 822, "white", "gray");
		DrawBackNextButton(50, 880, 400, 60, TextGet("Rules" + PokerGame), "White", "", () => "", () => "");
		DrawBackNextButton(550, 790, 400, 60, TextGet("Opponent" + PokerPlayer[1].Type), "White", "", () => "", () => "");
		DrawBackNextButton(1050, 790, 400, 60, TextGet("Opponent" + PokerPlayer[2].Type), "White", "", () => "", () => "");
		DrawBackNextButton(1550, 790, 400, 60, TextGet("Opponent" + PokerPlayer[3].Type), "White", "", () => "", () => "");
	}
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function PokerClick() {
	if (MouseIn(100, 790, 64, 64)) PokerShowPlayer = !PokerShowPlayer;
	if (MouseIn(50, 880, 400, 60)) PokerGame = (PokerGame == "TexasHoldem") ? "TwoCards" : "TexasHoldem";
	if (MouseIn(1885, 25, 90, 90)) CommonSetScreen("Room", "MainHall");
}

/**
 * When the player exits from Bondage Poker
 * @returns {void} - Nothing
 */
function PokerExit() {
}