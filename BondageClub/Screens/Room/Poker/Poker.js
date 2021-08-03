"use strict";
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
			if (P.Image == null) {
				let X = 0;
				let Images = [];
				while (P.Data.cache[X] != null) {
					if (P.Data.cache[X].substr(8, 9) == "Opponent=") {
						let From = P.Data.cache[X].substr(0, 3);
						let To = P.Data.cache[X].substr(4, 3);
						let Progress = 50;
						if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
							if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
								Images.push(P.Data.cache[X].substr(17, 100));
					}
					X++;
				}
				if (Images.length > 0)
					P.Image = "Screens/Room/Poker/" + CommonRandomItemFromList("", Images);
			}
			
			// If a valid image is loaded, we show it
			if (P.Image != null) {
				let W = 300;
				if (DrawCacheImage.get(P.Image) != null)
					W = DrawCacheImage.get(P.Image).width;
				DrawImageEx(P.Image, X + 210 - W / 2, Y, {Canvas: MainCanvas, Zoom: 1.25});
			}

		}

	}

	// For regular bondage club characters
	if (P.Type == "Character") DrawCharacter(P.Character, X, Y - 60, 1, false);
	if (PokerMode != "") DrawText(P.Text, X + 250, Y - 50, "black", "gray");

}

/**
 * Gets a possible starting text for a poker player P
 * @returns {void} - Nothing
 */
function PokerStartingText(P) {
	if ((P.Type == "None") || (P.Family == "Player")) return P.Text = "";;
	P.Text = "TEST";
}

/**
 * Runs & Draws the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerRun() {
	for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
		PokerDrawPlayer(PokerPlayer[P], (PokerShowPlayer ? 0 : -250) + P * 500, 100);
	if (PokerMode == "") DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (PokerMode == "") DrawButton(1885, 140, 90, 90, "", "White", "Icons/Poker.png", TextGet("Start"));
	DrawImage("Screens/Room/Poker/Table.png", 0, 650);
	if (PokerMode == "") {
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
	if (PokerMode == "Play") {
		for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
			DrawText(TextGet("Chip") + ": " + PokerPlayer[P].Chip.toString(), (PokerShowPlayer ? 250 : 0) + P * 500, 685, "white", "gray");
		if (!PokerShowPlayer)
			DrawText(TextGet("Chip") + ": " + PokerPlayer[0].Chip.toString(), 175, 970, "white", "gray");
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
			return;
		}
	P.Family = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Family;
	P.Type = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Type;
	P.Name = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Opponent[0];
	P.Data = null;
	P.Image = null;
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
		for (let P = 0; P < PokerPlayer.length; P++) {
			PokerPlayer[P].Chip = (PokerPlayer[P].Type != "None") ? 100 : 0;
			PokerStartingText(PokerPlayer[P]);
		}
		PokerMode = "Play";
	}
}

/**
 * When the player exits from Bondage Poker
 * @returns {void} - Nothing
 */
function PokerExit() {
	if (PokerMode == "") CommonSetScreen("Room", "MainHall");
}