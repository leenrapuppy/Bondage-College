"use strict";
var PokerBackground = "White";
var PokerPlayer = [
	{ Type: "Character", Name: "Player", Money: 100 },
	{ Type: "Set", Name: "Amanda", Money: 100 },
	{ Type: "Set", Name: "Sarah", Money: 100 },
	{ Type: "Set", Name: "Sophie", Money: 100 }
];

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
	if (P.Type == "Set") DrawImageEx("Screens/Room/Poker/" + P.Name + "/" + P.Name + "3.jpg", X, Y, {Canvas: MainCanvas, Zoom: 1.5});
	if (P.Type == "Character") DrawCharacter(P.Character, X - 150, Y - 60, 1.2, false);
}

/**
 * Runs & Draws the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerRun() {
	for (let P = 0; P < PokerPlayer.length; P++)
		PokerDrawPlayer(PokerPlayer[P], 100 + P * 450, 20);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawImage("Screens/Room/Poker/Table.png", 0, 650);
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function PokerClick() {
	if (MouseIn(1885, 25, 90, 90)) CommonSetScreen("Room", "MainHall");
}

/**
 * When the player exits from Bondage Poker
 * @returns {void} - Nothing
 */
function PokerExit() {
}