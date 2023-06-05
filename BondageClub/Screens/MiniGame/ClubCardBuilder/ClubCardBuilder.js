"use strict";
var ClubCardBuilderBackground = "ClubCardPlayBoard1";
var ClubCardBuilderDeckIndex = -1;
var ClubCardBuilderFocus = null;
var ClubCardBuilderDefaultDeck = [1000, 1001, 1002, 1003, 1004, 1006, 1007, 1009, 2000, 2002, 2004, 2005, 4000, 4002, 4003, 4004, 4005, 6000, 6001, 6002, 6003, 6004, 8000, 8001, 8002, 8003, 8004, 9000, 9001, 9002];
var ClubCardBuilderList = [];
var ClubCardBuilderOffset = 0;
var ClubCardBuilderDeckCurrent = [];
var ClubCardBuilderDeckSize = 30;

/**
 * Loads the deck # in memory so it can be edited
 * @returns {void} - Nothing
 */
function ClubCardBuilderLoadDeck(Deck) {

	// Loads the default deck if no deck exists or the deck is invalid
	ClubCardBuilderDeckIndex = Deck;
	if ((Player.Game.ClubCard.Deck.length <= Deck) || (Player.Game.ClubCard.Deck[Deck].length != ClubCardBuilderDeckSize)) {
		ClubCardBuilderDeckCurrent = ClubCardBuilderDefaultDeck.slice();
		return;
	}

	// Loads the deck from the saved string
	ClubCardBuilderDeckCurrent = [];
	for (let Index = 0; Index < ClubCardBuilderDeckSize; Index++)
		ClubCardBuilderDeckCurrent.push(Player.Game.ClubCard.Deck[Deck].charCodeAt(Index));

}

/**
 * Saves the modified deck as a string on the server
 * @returns {void} - Nothing
 */
function ClubCardBuilderSaveChanges() {
	while (Player.Game.ClubCard.Deck.length <= 10)
		Player.Game.ClubCard.Deck.push("");
	let Deck = "";
	for (let C of ClubCardBuilderDeckCurrent)
		Deck = Deck + String.fromCharCode(C);
	Player.Game.ClubCard.Deck[ClubCardBuilderDeckIndex] = Deck;
	ClubCardBuilderDeckIndex = -1;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Loads the club card deck builder
 * @returns {void} - Nothing
 */
function ClubCardBuilderLoad() {
	ClubCardCommonLoad();
	ClubCardBuilderDeckIndex = -1;
	ClubCardBuilderFocus = null;
	ClubCardBuilderList = [];
	ClubCardBuilderOffset = 0;
	for (let Card of ClubCardList)
		if ((Card.Unique == null) || (Card.Unique == false))
			ClubCardBuilderList.push({...Card});
	for (let Card of ClubCardBuilderList)
		if (Card.RequiredLevel == null)
			Card.RequiredLevel = 1;
	ClubCardBuilderList.sort((a, b) => a.RequiredLevel * 10 - b.RequiredLevel * 10 + ((a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0)));
}

/**
 * Runs the club card deck builder
 * @returns {void} - Nothing
 */
function ClubCardBuilderRun() {

	// In deck selection mode
	ClubCardLoadCaption();
	if (ClubCardBuilderDeckIndex == -1) {

		// Draws the 10 decks buttons
		DrawText(TextGet("SelectDeck"), 940, 70, "White", "Black");
		for (let Deck = 0; Deck < 10; Deck++)
			DrawButton(180 + (Deck % 5) * 350, 350 + Math.floor(Deck / 5) * 300, 250, 60, TextGet("DeckNumber") + (Deck + 1).toString(), "White");
		DrawButton(1885, 25, 90, 90, null, "White", "Icons/Exit.png", TextGet("Exit"));
		return;

	}

	// In card selection mode, we draw the cards in a 3x10 grid
	let Index = (ClubCardBuilderOffset * -1);
	for (let Card of ClubCardBuilderList) {
		if ((Index >= 0) && (Index <= 29)) {
			let PosX = (Index % 10) * 154 + 5;
			let PosY = Math.floor(Index / 10) * 305 + 80;
			ClubCardRenderCard(Card, PosX, PosY, 150);
			if (MouseIn(PosX, PosY, 150, 300)) ClubCardBuilderFocus = Card;
			if (ClubCardBuilderDeckCurrent.indexOf(Card.ID) >= 0) DrawImageResize("Screens/MiniGame/ClubCardBuilder/Selected.png", PosX + 110, PosY + 40, 40, 40);
		}
		Index++;
	}

	// Draw the text, the zoomed card and buttons
	ClubCardRenderCard(ClubCardBuilderFocus, 1545, 105, 445);
	if ((ClubCardBuilderFocus != null) && (ClubCardBuilderDeckCurrent.indexOf(ClubCardBuilderFocus.ID) >= 0)) DrawImageResize("Screens/MiniGame/ClubCardBuilder/Selected.png", 1870, 200, 120, 120);
	DrawText(TextGet("SelectCards") + (ClubCardBuilderDeckIndex + 1).toString() + " (" + ClubCardBuilderDeckCurrent.length + " / " + ClubCardBuilderDeckSize.toString() + ")", 950, 37, (ClubCardBuilderDeckCurrent.length == ClubCardBuilderDeckSize) ? "White" : "Pink", "Black");
	if (ClubCardBuilderFocus == null) DrawTextWrap(TextGet("ClickCard"), 1560, 400, 430, 300, "White");
	DrawButton(1895, 5, 90, 90, null, "White", "Icons/Cancel.png", TextGet("UndoChanges"));
	DrawButton(1780, 5, 90, 90, null, "White", "Icons/Accept.png", TextGet("SaveChanges"));
	DrawButton(1665, 5, 90, 90, null, "White", "Icons/Next.png", TextGet("NextCards"));
	DrawButton(1550, 5, 90, 90, null, "White", "Icons/Prev.png", TextGet("PreviousCards"));
	DrawButton(5, 5, 150, 60, TextGet("Clear"), "White", "", TextGet("ClearHover"));
	DrawButton(159, 5, 150, 60, TextGet("Default"), "White", "", TextGet("DefaultHover"));

}

/**
 * Handles clicks during the club card game
 * @returns {void} - Nothing
 */
function ClubCardBuilderClick() {

	// If the user wants to exit
	if ((ClubCardBuilderDeckIndex == -1) && MouseIn(1885, 25, 90, 90)) return CommonSetScreen("Room", "ClubCardLounge");
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(1895, 5, 90, 90)) { ClubCardBuilderDeckIndex = -1; return; }
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(1780, 5, 90, 90) && (ClubCardBuilderDeckCurrent.length == ClubCardBuilderDeckSize)) return ClubCardBuilderSaveChanges();

	// When we navigate through the cards
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(1665, 5, 90, 90)) {
		ClubCardBuilderOffset = ClubCardBuilderOffset + 30;
		if (ClubCardBuilderOffset >= ClubCardBuilderList.length) ClubCardBuilderOffset = 0;
		return;
	}
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(1550, 5, 90, 90)) {
		ClubCardBuilderOffset = ClubCardBuilderOffset - 30;
		if (ClubCardBuilderOffset < 0) ClubCardBuilderOffset = Math.floor(ClubCardBuilderList.length / 30) * 30;
		return;
	}

	// When we need to clear all the cards or reset to the default deck
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(5, 5, 150, 60)) ClubCardBuilderDeckCurrent = [];
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(159, 5, 150, 60)) ClubCardBuilderDeckCurrent = ClubCardBuilderDefaultDeck.slice();

	// If the user clicks to select a deck
	if (ClubCardBuilderDeckIndex == -1)
		for (let Deck = 0; Deck < 10; Deck++)
			if (MouseIn(180 + (Deck % 5) * 350, 350 + Math.floor(Deck / 5) * 300, 250, 60))
				return ClubCardBuilderLoadDeck(Deck);

	// If the user clicks on the focused card
	if ((ClubCardBuilderDeckIndex != -1) && MouseIn(1545, 105, 445, 890) && (ClubCardBuilderFocus != null)) {
		if (ClubCardBuilderDeckCurrent.indexOf(ClubCardBuilderFocus.ID) >= 0) ClubCardBuilderDeckCurrent.splice(ClubCardBuilderDeckCurrent.indexOf(ClubCardBuilderFocus.ID), 1);
		else ClubCardBuilderDeckCurrent.push(ClubCardBuilderFocus.ID);
		return;
	}

	// In card selection mode, we can pick a card from the 3x10 grid
	if (ClubCardBuilderDeckIndex != -1) {
		let Index = (ClubCardBuilderOffset * -1);
		for (let Card of ClubCardBuilderList) {
			if ((Index >= 0) && (Index <= 29)) {
				let PosX = (Index % 10) * 150 + 20;
				let PosY = Math.floor(Index / 10) * 300 + 95;
				if (MouseIn(PosX, PosY, 150, 300)) {
					ClubCardBuilderFocus = Card;
					if (ClubCardBuilderDeckCurrent.indexOf(Card.ID) >= 0) ClubCardBuilderDeckCurrent.splice(ClubCardBuilderDeckCurrent.indexOf(Card.ID), 1);
					else ClubCardBuilderDeckCurrent.push(Card.ID);
					return;
				}
			}
			Index++;
		}
	}

}
