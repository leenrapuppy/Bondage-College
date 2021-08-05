"use strict";
/* eslint-disable */
var PokerBackground = "White";
var PokerPlayer = [
	{ Type: "Character", Family: "Player", Name: "Player", Chip: 100 },
	{ Type: "Set", Family: "Comic", Name: "Amanda", Chip: 100 },
	{ Type: "Set", Family: "Comic", Name: "Sarah", Chip: 100 },
	{ Type: "Set", Family: "Comic", Name: "Sophie", Chip: 100 }
];
var PokerMode = "";
var PokerGame = "TexasHoldem"
var PokerShowPlayer = true;
var PokerAsset = [
	{
		Family: "None",
		Type: "None",
		Opponent: ["None"]
	},
	{
		Family: "Comic",
		Type: "Set",
		Opponent: ["Amanda", "Sarah", "Sophie"]
	},
	{
		Family: "Drawing",
		Type: "Set",
		Opponent: ["Ann"]
	}
];
var PokerPlayerCount = 4;
var PokerTableCards = [];
var PokerMessage = "";

/**
 * Loads the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerLoad() {
	PokerPlayer[0].Character = Player;
	PokerPlayer[0].Name = Player.Name;
}

/**
 * Draws a poker player behind the table
 * @returns {void} - Nothing
 */
function PokerDrawPlayer(P, X, Y) {
	
	// For set images from the classic Bondage Poker game
	if ((P == null) || (P.Type == null) || (P.Type == "None") || (P.Name == null)) return;
	if (P.Type == "Set") {
		
		// If data isn't loaded yet, we fetch the CSV file
		if (P.Data == null) {
			let FullPath = "Screens/Room/Poker/" + P.Name + "/Data.csv";
			let TextScreenCache = TextAllScreenCache.get(FullPath);
			if (!TextScreenCache) {
				TextScreenCache = new TextCache(FullPath, "MISSING VALUE FOR TAG: ");
				TextAllScreenCache.set(FullPath, TextScreenCache);
			} else P.Data = TextScreenCache;
		}
		else {
			
			// If there's no image loaded, we fetch a possible one based on the chip progress
			if (P.Image == null) PokerGetImage(P);
			
			// If a valid image is loaded, we show it
			if (P.Image != null) {
				let W = 300;
				if (DrawCacheImage.get(P.Image) != null)
					W = DrawCacheImage.get(P.Image).width;
				DrawImageEx(P.Image, X + 210 - W / 2, Y, {Canvas: MainCanvas, Zoom: 1.25});
			}

		}

		// Loads the text single data if needed
		if (P.TextSingle == null) {
			let FullPath = "Screens/Room/Poker/" + P.Name + "/Text_Single.csv";
			let TextScreenCache = TextAllScreenCache.get(FullPath);
			if (!TextScreenCache) {
				TextScreenCache = new TextCache(FullPath, "MISSING VALUE FOR TAG: ");
				TextAllScreenCache.set(FullPath, TextScreenCache);
			} else P.TextSingle = TextScreenCache;
		}

		// Loads the text multiple data if needed
		if (P.TextMultiple == null) {
			let FullPath = "Screens/Room/Poker/" + P.Name + "/Text_Multiple.csv";
			let TextScreenCache = TextAllScreenCache.get(FullPath);
			if (!TextScreenCache) {
				TextScreenCache = new TextCache(FullPath, "MISSING VALUE FOR TAG: ");
				TextAllScreenCache.set(FullPath, TextScreenCache);
			} else P.TextMultiple = TextScreenCache;
		}

	}

	// For regular bondage club characters
	if (P.Type == "Character") DrawCharacter(P.Character, X, Y - 60, 1, false);
	
	// Draw the top text
	if ((PokerMode != "") && (P.Text != "")) {
		if ((P.TextColor == null) && (P.Data != null) && (P.Data.cache != null) && (P.Data.cache["TextColor"] != null))
			P.TextColor = P.Data.cache["TextColor"];
		DrawTextWrap(P.Text, X + 10, Y - 82, 480, 60, (P.TextColor == null) ? "black" : "#" + P.TextColor, null, 2);
	}

}

/**
 * Gets the chip progress of the current player P
 * @returns {number} - The progress as a %
 */
function PokerGetProgress(P) {

	// At 100 chips or less (or 2 players only), we cut the value in half to get the %
	if ((P.Chip <= 100) || (PokerPlayerCount <= 2)) return Math.floor(P.Chip / 2);

	// At more than 100 chips, the % varies based on the number of players
	return 50 + Math.floor((P.Chip - 100) / ((PokerPlayerCount - 1) * 2));

}

/**
 * Gets a possible text for a poker player P
 * @returns {void} - Nothing
 */
function PokerGetText(P, Tag) {
	
	// Exits right away if data is missing
	if ((P.Type == "None") || (P.Family == "Player")) return P.Text = "";
	let T;
	T = (PokerPlayerCount <= 2) ? P.TextSingle : P.TextMultiple;
	if (T == null) return P.Text = "";

	// If there's a tag, we search for it specifically
	let Texts = [];
	let X = 0;
	if (Tag != null) {
		while (T.cache[X] != null) {
			if (T.cache[X].substr(0, Tag.length + 1) == Tag + "=")
				Texts.push(T.cache[X].substr(Tag.length + 1, 500));
			X++;
		}
	} else {

		// Without a tag, we find all values within the player progress
		let Progress = PokerGetProgress(P);
		while (T.cache[X] != null) {
			if (T.cache[X].substr(8, 5) == "Chat=") {
				let From = T.cache[X].substr(0, 3);
				let To = T.cache[X].substr(4, 3);
				if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
					if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
						Texts.push(T.cache[X].substr(13, 500));
			}
			X++;
		}

	}

	// Sets the final text at random from all possible values
	P.Text = (Texts.length > 0) ? CommonRandomItemFromList("", Texts) : "";

}

/**
 * Gets a possible image for a poker player P
 * @returns {void} - Nothing
 */
function PokerGetImage(P) {
	if ((P.Type == "None") || (P.Family == "Player")) return;
	let X = 0;
	let Images = [];
	let Progress = PokerGetProgress(P);
	while (P.Data.cache[X] != null) {
		if (P.Data.cache[X].substr(8, 9) == "Opponent=") {
			let From = P.Data.cache[X].substr(0, 3);
			let To = P.Data.cache[X].substr(4, 3);
			if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
				if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
					Images.push(P.Data.cache[X].substr(17, 100));
		}
		X++;
	}
	if (Images.length > 0)
		P.Image = "Screens/Room/Poker/" + CommonRandomItemFromList("", Images);
}

/**
 * Runs & Draws the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerRun() {
	
	// Shows the players and table
	for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
		PokerDrawPlayer(PokerPlayer[P], (PokerShowPlayer ? 0 : -250) + P * 500, 100);
	DrawImage("Screens/Room/Poker/Table.png", 0, 650);

	// Draws the control to pick the opponent
	if (PokerMode == "") {
		DrawText(TextGet("IntroTitle"), 950, 45, "black", "gray");
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
		DrawButton(1885, 140, 90, 90, "", "White", "Icons/Poker.png", TextGet("Start"));
		DrawButton(100, 790, 64, 64, "", "White", PokerShowPlayer ? "Icons/Checked.png" : "");
		DrawText(TextGet("ShowPlayer"), 300, 822, "white", "gray");
		DrawBackNextButton(50, 880, 400, 60, TextGet("Rules" + PokerGame), "White", "", () => "", () => "");
		DrawBackNextButton(550, 790, 400, 60, TextGet("Family" + PokerPlayer[1].Family), "White", "", () => "", () => "");
		DrawBackNextButton(1050, 790, 400, 60, TextGet("Family" + PokerPlayer[2].Family), "White", "", () => "", () => "");
		DrawBackNextButton(1550, 790, 400, 60, TextGet("Family" + PokerPlayer[3].Family), "White", "", () => "", () => "");
		for (let P = 1; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Type != "None")
				DrawBackNextButton(50 + P * 500, 880, 400, 60, PokerPlayer[P].Name, "White", "", () => "", () => "");
	}

	// Draws the cards and chips
	if ((PokerMode == "DEAL") || (PokerMode == "RESULT")) {
		for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++) 
			if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Hand.length > 0)) {
				DrawText(TextGet("Chip") + ": " + PokerPlayer[P].Chip.toString(), (PokerShowPlayer ? 250 : 0) + P * 500, 685, "white", "gray");
				if ((PokerPlayer[P].Family != "Player") && (PokerMode != "RESULT"))
					DrawImageEx("Screens/Room/Poker/Cards/OpponentCards.gif", (PokerShowPlayer ? 250 : 0) + P * 500 - 75, 720, {Canvas: MainCanvas, Zoom: 1.5});
				else {
					DrawImageEx(PokerCardFileName(PokerPlayer[P].Hand[0]), (PokerShowPlayer ? 250 : 0) + P * 500 - 135, 720, {Canvas: MainCanvas, Zoom: 0.75});
					DrawImageEx(PokerCardFileName(PokerPlayer[P].Hand[1]), (PokerShowPlayer ? 250 : 0) + P * 500 + 20, 720, {Canvas: MainCanvas, Zoom: 0.75});
				}
			}
		if ((!PokerShowPlayer) && (PokerPlayer[0].Hand.length > 0)) {
			DrawText(TextGet("Chip") + ": " + PokerPlayer[0].Chip.toString(), 1885, 970, "white", "gray");
			DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[0]), 25, 800, {Canvas: MainCanvas, Zoom: 1.25});
			DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[1]), 250, 800, {Canvas: MainCanvas, Zoom: 1.25});
		}
		
	}

	// In deal mode, we allow the regular actions when the player has chips
	if ((PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) {
		DrawButton(1400, 875, 175, 60, TextGet("Bet"), "White");
		DrawButton(1600, 875, 175, 60, TextGet("Raise"), "White");
		DrawButton(1800, 875, 175, 60, TextGet("Fold"), "White");
	}

	// In deal mode, we can only watch without chips
	if ((PokerMode == "DEAL") && (PokerPlayer[0].Chip <= 0))
		DrawButton(1800, 875, 175, 60, TextGet("Watch"), "White");
	
	// In result mode, we show the winner and allow to deal new cards
	if (PokerMode == "RESULT") {
		DrawText(PokerMessage, 1600, 940, "white", "gray");
		DrawButton(1800, 875, 175, 60, TextGet("Deal"), "White");
	}
	
	// In End mode, we present the winner and allow to restart
	if (PokerMode == "END") {
		DrawText(PokerMessage, 1000, 800, "white", "gray");
		DrawButton(800, 875, 400, 60, TextGet("EndGame"), "White");		
	}

}

/**
 * Picks the next/previous opponent family for a player P
 * @returns {void} - Nothing
 */
function PokerChangeOpponentFamily(P, Next) {
	for (let A = (Next ? 0 : 1); A < PokerAsset.length + (Next ? -1 : 0); A++)
		if (PokerAsset[A].Family == P.Family) {
			P.Family = PokerAsset[A + (Next ? 1 : -1)].Family;
			P.Type = PokerAsset[A + (Next ? 1 : -1)].Type;
			P.Name = PokerAsset[A + (Next ? 1 : -1)].Opponent[0];
			P.Data = null;
			P.Image = null;
			P.TextColor = null;
			P.TextSingle = null;
			P.TextMultiple = null;
			return;
		}
	P.Family = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Family;
	P.Type = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Type;
	P.Name = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Opponent[0];
	P.Data = null;
	P.Image = null;
	P.TextColor = null;
	P.TextSingle = null;
	P.TextMultiple = null;
}

/**
 * Picks the next/previous opponent for a player P
 * @returns {void} - Nothing
 */
function PokerChangeOpponent(P, Next) {
	for (let A = 0; A < PokerAsset.length; A++)
		if (PokerAsset[A].Family == P.Family) {
			let Pos = PokerAsset[A].Opponent.indexOf(P.Name);
			Pos = Pos + (Next ? 1 : -1);
			if (Pos < 0) Pos = PokerAsset[A].Opponent.length - 1;
			if (Pos > PokerAsset[A].Opponent.length - 1) Pos = 0;
			P.Name = PokerAsset[A].Opponent[Pos];
			P.Data = null;
			P.Image = null;
			P.TextColor = null;
			P.TextSingle = null;
			P.TextMultiple = null;
			return;
		}
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function PokerClick() {
	if (MouseIn(100, 790, 64, 64)) PokerShowPlayer = !PokerShowPlayer;
	if (MouseIn(50, 880, 400, 60)) PokerGame = (PokerGame == "TexasHoldem") ? "TwoCards" : "TexasHoldem";
	if (MouseIn(1885, 25, 90, 90) && (PokerMode == "")) PokerExit();
	if (PokerMode == "")
		for (let P = 1; P < PokerPlayer.length; P++) {
			if (MouseIn(50 + P * 500, 790, 400, 60))
				PokerChangeOpponentFamily(PokerPlayer[P], (MouseX >= 250 + P * 500));
			if ((PokerPlayer[P].Type != "None") && MouseIn(50 + P * 500, 880, 400, 60))
				PokerChangeOpponent(PokerPlayer[P], (MouseX >= 250 + P * 500));
		}
	if (MouseIn(1885, 140, 90, 90) && (PokerMode == "")) {
		PokerPlayerCount = 0;
		for (let P = 0; P < PokerPlayer.length; P++) {
			PokerPlayer[P].Chip = (PokerPlayer[P].Type != "None") ? 100 : 0;
			PokerGetText(PokerPlayer[P], "Intro");
			if (PokerPlayer[P].Type != "None") PokerPlayerCount++;
		}
		if (PokerPlayerCount >= 2) PokerDealHands();
	}

	// If we can process to the next step
	if (MouseIn(1400, 875, 175, 60) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) return PokerProcess("Bet");
	if (MouseIn(1600, 875, 175, 60) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) return PokerProcess("Raise");
	if (MouseIn(1800, 875, 175, 60) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) return PokerProcess("Fold");
	if (MouseIn(1800, 875, 175, 60) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip <= 0)) return PokerProcess("Watch");
	if (MouseIn(1800, 875, 175, 60) && (PokerMode == "RESULT")) return PokerDealHands();
	if (MouseIn(800, 875, 400, 60) && (PokerMode == "END")) {		
		PokerMode = "";
		for (let P = 0; P < PokerPlayer.length; P++) {
			PokerPlayer[P].Chip = 100;
			PokerGetImage(PokerPlayer[P]);
		}
	}

}

/**
 * Handles key presses during the bondage poker game
 * @returns {void} - Nothing
 */
function PokerKeyDown() {
	if (((KeyPress == 66) || (KeyPress == 98)) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) return PokerProcess("Bet"); // B to bet
	if (((KeyPress == 82) || (KeyPress == 114)) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) return PokerProcess("Raise"); // R to raise
	if (((KeyPress == 70) || (KeyPress == 102)) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip > 0)) return PokerProcess("Fold"); // F to fold
	if (((KeyPress == 87) || (KeyPress == 119)) && (PokerMode == "DEAL") && (PokerPlayer[0].Chip <= 0)) return PokerProcess("Watch"); // W to watch
	if (((KeyPress == 68) || (KeyPress == 100)) && (PokerMode == "RESULT")) return PokerDealHands(); // D to deal
}

/**
 * When the player exits from Bondage Poker
 * @returns {void} - Nothing
 */
function PokerExit() {
	if (PokerMode == "") CommonSetScreen("Room", "MainHall");
}

/**
 * Draws a card for a poker player PP
 * @returns {void} - Nothing
 */
function PokerDrawCard(PP) {

	// Finds a card that's not already picked
	let Draw = true;
	let Card = -1;
	while (Draw) {
		Draw = false;
		Card = Math.floor(Math.random() * 52) + 1;
		for (let P = 0; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Hand.indexOf(Card) >= 0)
				Draw = true;
	}

	// Add that card to the player hand
	PP.Hand.push(Card);

}

/**
 * Returns the file name associated with the card
 * @returns {String} - The file name of the card image
 */
function PokerCardFileName(Card) {
	if (Card <= 13) return "Screens/Room/Poker/Cards/" + (Card + 1) + "C.png";
	else if (Card <= 26) return "Screens/Room/Poker/Cards/" + (Card - 12) + "D.png";
	else if (Card <= 39) return "Screens/Room/Poker/Cards/" + (Card - 25) + "H.png";
	else if (Card <= 52) return "Screens/Room/Poker/Cards/" + (Card - 38) + "S.png";
	return "";
}

/**
 * When we must process an action to advance the poker game, the action can be Bet, Raise, Fold or Watch
 * @returns {String} - The file name of the card image
 */
function PokerProcess(Action) {

	// Gets the hand values and round winner
	let Winner = 0;
	let MaxValue = -1;
	let Pot = 0;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Chip > 0)) {
			PokerPlayer[P].HandValue = PokerHandValueCalcHandValue(PokerPlayer[P].Hand[0], PokerPlayer[P].Hand[1], PokerGame, PokerMode, PokerTableCards);
			if ((P == 0) && (Action == "Fold")) PokerPlayer[P].HandValue = -1;
			console.log(P.toString() + " " + PokerPlayer[P].HandValue.toString());
			if (PokerPlayer[P].HandValue > MaxValue) {
				MaxValue = PokerPlayer[P].HandValue;
				Winner = P;
			}
			let Bet = 10;
			if ((Action == "Raise") || (Action == "Watch")) Bet = 50;
			if (PokerPlayer[P].Chip < Bet) Bet = PokerPlayer[P].Chip;
			Pot = Pot + Bet;
			PokerPlayer[P].Chip = PokerPlayer[P].Chip - Bet;
		}

	// Shows the winner and awards the chips
	PokerMessage = PokerPlayer[Winner].Name + " " + TextGet("Win");
	PokerPlayer[Winner].Chip = PokerPlayer[Winner].Chip + Pot;
	PokerMode = "RESULT";

	// Reloads the opponents text and images
	for (let P = 1; P < PokerPlayer.length; P++) {
		PokerGetImage(PokerPlayer[P]);
		PokerGetText(PokerPlayer[P]);
	}

	// If there's only 1 active player, we stop the game
	let PlayerCount = 0;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Chip > 0))
			PlayerCount++;
	if (PlayerCount <= 1) {
		for (let P = 1; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Type != "None") {
				let TextType = "Win";
				if (PokerPlayer[P].Chip == 0) TextType = "Lose";
				if ((PokerPlayer[P].Chip == 0) && (PokerPlayer[0].Chip == 0)) TextType = "LoseOther";
				PokerGetText(PokerPlayer[P], TextType);
			}
		PokerMessage = PokerPlayer[Winner].Name + " " + TextGet("WinGame");
		PokerMode = "END";
	}

}

/**
 * Deals a fresh new hand for all poker players
 * @returns {void} - Nothing
 */
function PokerDealHands() {
	PokerGame = "TwoCards"; // To remove
	for (let P = 0; P < PokerPlayer.length; P++)
		PokerPlayer[P].Hand = [];
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Chip > 0)) {
			PokerDrawCard(PokerPlayer[P]);
			PokerDrawCard(PokerPlayer[P]);
		}
	PokerMode = "DEAL";
}