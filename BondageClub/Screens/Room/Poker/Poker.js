"use strict";
var PokerBackground = "White";
/** @type {PokerPlayer[]} */
var PokerPlayer = [
	{ Type: "Character", Family: "Player", Name: "Player", Chip: 100 },
	{ Type: "None", Family: "None", Name: "None", Chip: 100 },
	{ Type: "None", Family: "None", Name: "None", Chip: 100 },
	{ Type: "None", Family: "None", Name: "None", Chip: 100 }
];
/** @type {PokerMode} */
var PokerMode = "";
/** @type {PokerGameType} */
var PokerGame = "TexasHoldem";
var PokerShowPlayer = true;
/** @type {PokerAsset[]} */
var PokerAsset = [
	{
		Family: "None",
		Type: "None",
		Opponent: ["None"]
	},
	{
		Family: "Illustration",
		Type: "Set",
		Opponent: ["Amanda", "Ann", "Aoi", "Lua", "Ornella", "Sally", "Sarah", "Sophie"]
	},
	{
		Family: "Model",
		Type: "Set",
		Opponent: ["Andrea", "Akira", "Becky", "Dita", "Emily", "Hannah", "Isanne", "Jasmine", "Jelena", "Lia", "Masuimi", "Missey", "Nadia", "Natalia", "Petra", "Sasha", "Supergirl", "Tasha", "Tigerr"]
	}
];
var PokerPlayerCount = 4;
/** @type {number[]} */
var PokerTableCards = [];
var PokerMessage = "";
var PokerResultMessage = "";
var PokerAnte = 2;
var PokerAnteCount = 0;
var PokerPot = 0;
var PokerChallenge = ["Sarah", "Jasmine", "Ann", "Andrea", "Sally", "Isanne", "Sasha", "Amanda", "Emily", "Nadia", "Tasha", "Aoi", "Becky", "Tigerr", "Jelena", "Ornella", "Natalia", "Akira", "Hannah", "Missey", "Masuimi", "Lua", "Dita", "Petra", "Supergirl", "Lia", "Sophie"];
var PokerOpponentList = ["None"];

/**
 * Loads the Bondage Poker room
 * @returns {void} - Nothing
 */
function PokerLoad() {
	PokerPlayer[0].Character = Player;
	PokerPlayer[0].Name = Player.Name;
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.Poker == null) Player.Game.Poker = {};
}

/**
 * Draws a poker player behind the table
 * @param {PokerPlayer} P
 * @param {number} X
 * @param {number} Y
 * @returns {void} - Nothing
 */
function PokerDrawPlayer(P, X, Y) {

	// For set images from the classic Bondage Poker game
	let Large = false;
	if ((P == null) || (P.Type == null) || (P.Type == "None") || (P.Name == "None") || (P.Name == null)) return;
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

			// If a valid image is loaded, we show it, we can move it a little to adjust the position on screen
			if (P.Image != null) {
				let Y2 = 0;
				let W = 300;
				let H = 440;
				if (DrawCacheImage.get(P.Image) != null) W = DrawCacheImage.get(P.Image).width;
				if (DrawCacheImage.get(P.Image) != null) H = DrawCacheImage.get(P.Image).height;
				if (W >= 800) {
					Y2 = (440 - H) * 0.5;
					Large = true;
					DrawImageEx(P.Image, (PokerShowPlayer ? 1250 - W / 2 : 1000 - W / 2), Y + Y2 + 50, {Canvas: MainCanvas, Zoom: 1});
				}
				else {
					if (H < 440) Y2 = (440 - H) * 1.25;
					DrawImageEx(P.Image, X + 215 - W / 2, Y + Y2, {Canvas: MainCanvas, Zoom: 1.25});
				}
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
		if ((P.TextColor == null) && (P.Data != null) && (P.Data.cache != null) && (P.Data.cache.TextColor != null))
			P.TextColor = P.Data.cache.TextColor;
		if (Large) X = (PokerShowPlayer ? 0 : -250) + 1000;
		DrawTextWrap(P.Text, X + 10, Y - 82, 480, 60, (P.TextColor == null) ? "black" : "#" + P.TextColor, null, 2);
	}

	// If no text is loaded, we load the intro
	if ((PokerMode != "") && ((P.Text == null) || (P.Text == "")))
		PokerGetText(P, "Intro");

}

/**
 * Gets the chip progress of the current player P
 * @param {PokerPlayer} P
 * @returns {number} - The progress as a %
 */
function PokerGetProgress(P) {

	// At more than 100 chips, the % varies based on the number of players
	let Progress = 50 + Math.floor((P.Chip - 100) / ((PokerPlayerCount - 1) * 2));

	// At 100 chips or less (or 2 players only), we cut the value in half to get the %
	if ((P.Chip <= 100) || (PokerPlayerCount <= 2)) Progress = Math.floor(P.Chip / 2);

	// Can't be at fully zero if there are remaining chips
	if ((Progress == 0) && (P.Chip > 0)) Progress = 1;
	return Progress;

}

/**
 * Gets a possible text for a poker player P
 * @param {PokerPlayer} P
 * @param {string} [Tag]
 * @returns {void} - Nothing
 */
function PokerGetText(P, Tag) {

	// Exits right away if data is missing
	if ((P.Type == "None") || (P.Name == "None") || (P.Family == "Player")) {
		P.Text = "";
		return;
	}
	let T = (PokerPlayerCount <= 2) ? P.TextSingle : P.TextMultiple;
	if (!T) return;

	// If there's an alternative text, we search for it first
	let Texts = [];
	if ((P.Alternate == null) && (P.Data != null) && (P.Data.cache.Alternate != null))
		P.Alternate = Math.floor(Math.random() * parseInt(P.Data.cache.Alternate)) + 1;
	if (P.Alternate != null) {
		let X = 0;
		if (Tag != null) {
			while (T.cache[X] != null) {
				if (T.cache[X].substr(0, Tag.length + 6) == Tag + "-Alt" + P.Alternate.toString() + "=")
					Texts.push(T.cache[X].substr(Tag.length + 6, 500));
				X++;
			}
		} else {

			// Without a tag, we find all values within the player progress
			let Progress = PokerGetProgress(P);
			while (T.cache[X] != null) {
				if (T.cache[X].substr(8, 10) == "Chat-Alt" + P.Alternate.toString() + "=") {
					let From = T.cache[X].substr(0, 3);
					let To = T.cache[X].substr(4, 3);
					if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
						if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
							Texts.push(T.cache[X].substr(18, 500));
				}
				X++;
			}

		}
	}

	// If there's a tag, we search for it specifically
	if (Tag != null) {
		let X = 0;
		while (T.cache[X] != null) {
			if (T.cache[X].substr(0, Tag.length + 1) == Tag + "=")
				Texts.push(T.cache[X].substr(Tag.length + 1, 500));
			X++;
		}
	} else {
		let X = 0;
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
 * @param {PokerPlayer} P
 * @returns {void} - Nothing
 */
function PokerGetImage(P) {

	// Skip if there's no player
	if ((P.Type == "None") || (P.Name == "None")) return;
	let Progress = PokerGetProgress(P);

	// For a regular Bondage Club character, we can add or remove restraints
	if (P.Type == "Character") {
		if ((Progress > 40) && (P.Cloth != null) && (InventoryGet(P.Character, "Cloth") == null)) InventoryWear(P.Character, P.Cloth.Asset.Name, "Cloth", P.Cloth.Color);
		if ((Progress > 40) && (P.ClothLower != null) && (InventoryGet(P.Character, "ClothLower") == null)) InventoryWear(P.Character, P.ClothLower.Asset.Name, "ClothLower", P.ClothLower.Color);
		if ((Progress > 40) && (P.ClothAccessory != null) && (InventoryGet(P.Character, "ClothAccessory") == null)) InventoryWear(P.Character, P.ClothAccessory.Asset.Name, "ClothAccessory", P.ClothAccessory.Color);
		if ((Progress <= 40) && (InventoryGet(P.Character, "Cloth") != null)) InventoryRemove(P.Character, "Cloth");
		if ((Progress <= 40) && (InventoryGet(P.Character, "ClothLower") != null)) InventoryRemove(P.Character, "ClothLower");
		if ((Progress <= 40) && (InventoryGet(P.Character, "ClothAccessory") != null)) InventoryRemove(P.Character, "ClothAccessory");
		if ((Progress > 30) && (InventoryGet(P.Character, "ItemLegs") != null)) InventoryRemove(P.Character, 'ItemLegs');
		if ((Progress <= 30) && (InventoryGet(P.Character, "ItemLegs") == null)) InventoryWearRandom(P.Character, 'ItemLegs');
		if ((Progress > 20) && (InventoryGet(P.Character, "ItemMouth") != null)) InventoryRemove(P.Character, 'ItemMouth');
		if ((Progress <= 20) && (InventoryGet(P.Character, "ItemMouth") == null)) InventoryWearRandom(P.Character, 'ItemMouth');
		if ((Progress > 10) && (P.Panties != null) && (InventoryGet(P.Character, "Panties") == null)) InventoryWear(P.Character, P.Panties.Asset.Name, "Panties", P.Panties.Color);
		if ((Progress > 10) && (P.Bra != null) && (InventoryGet(P.Character, "Bra") == null)) InventoryWear(P.Character, P.Bra.Asset.Name, "Bra", P.Bra.Color);
		if ((Progress <= 10) && (InventoryGet(P.Character, "Panties") != null)) InventoryRemove(P.Character, "Panties");
		if ((Progress <= 10) && (InventoryGet(P.Character, "Bra") != null)) InventoryRemove(P.Character, "Bra");
		if ((Progress > 0) && (InventoryGet(P.Character, "ItemArms") != null)) InventoryRemove(P.Character, 'ItemArms');
		if ((Progress <= 0) && (InventoryGet(P.Character, "ItemArms") == null)) InventoryWearRandom(P.Character, 'ItemArms');
		CharacterRefresh(P.Character);
	}

	// For set images, a single opponent can have a large image, else we find a valid image from the game progress
	if ((P.Type == "Set") && (P.Data != null)) {

		// First try to get an alternate version of the image
		let Images = [];
		if ((P.Alternate == null) && (P.Data != null) && (P.Data.cache.Alternate != null))
			P.Alternate = Math.floor(Math.random() * parseInt(P.Data.cache.Alternate)) + 1;
		if (P.Alternate != null) {
			if ((PokerPlayerCount == 2) && (PokerMode != "")) {
				let X = 0;
				while (P.Data.cache[X] != null) {
					if (P.Data.cache[X].substr(8, 19) == "OpponentLarge-Alt" + P.Alternate.toString() + "=") {
						let From = P.Data.cache[X].substr(0, 3);
						let To = P.Data.cache[X].substr(4, 3);
						if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
							if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
								Images.push(P.Data.cache[X].substr(27, 100));
					}
					X++;
				}
			}
			if (Images.length == 0) {
				let X = 0;
				while (P.Data.cache[X] != null) {
					if (P.Data.cache[X].substr(8, 14) == "Opponent-Alt" + P.Alternate.toString() + "=") {
						let From = P.Data.cache[X].substr(0, 3);
						let To = P.Data.cache[X].substr(4, 3);
						if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
							if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
								Images.push(P.Data.cache[X].substr(22, 100));
					}
					X++;
				}
			}
		}

		// Sets the non alternative images
		if ((PokerPlayerCount == 2) && (PokerMode != "")) {
			let X = 0;
			while (P.Data.cache[X] != null) {
				if (P.Data.cache[X].substr(8, 14) == "OpponentLarge=") {
					let From = P.Data.cache[X].substr(0, 3);
					let To = P.Data.cache[X].substr(4, 3);
					if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
						if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
							Images.push(P.Data.cache[X].substr(22, 100));
				}
				X++;
			}
		}
		if (Images.length == 0) {
			let X = 0;
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
		}

		// If an image was found
		if (Images.length > 0)
			P.Image = "Screens/Room/Poker/" + CommonRandomItemFromList("", Images);

	}

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
		DrawButton(1885, 140, 90, 90, "", "White", "Icons/Poker.png", TextGet("Challenge"));
		DrawButton(1885, 265, 90, 90, "", "White", "Icons/Preference.png", TextGet("Custom"));
		DrawButton(100, 790, 64, 64, "", "White", PokerShowPlayer ? "Icons/Checked.png" : "");
		DrawText(TextGet("ShowPlayer"), 300, 822, "white", "gray");
		DrawBackNextButton(50, 880, 400, 60, TextGet("Rules" + PokerGame), "White", "", () => "", () => "");
		DrawBackNextButton(550, 760, 400, 60, TextGet("Family" + PokerPlayer[1].Family), "White", "", () => "", () => "");
		DrawBackNextButton(1050, 760, 400, 60, TextGet("Family" + PokerPlayer[2].Family), "White", "", () => "", () => "");
		DrawBackNextButton(1550, 760, 400, 60, TextGet("Family" + PokerPlayer[3].Family), "White", "", () => "", () => "");
		for (let P = 1; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Type != "None") {
				DrawBackNextButton(50 + P * 500, 840, 400, 60, PokerPlayer[P].Name, "White", "", () => "", () => "");
				if ((PokerPlayer[P].WebLink == null) && (PokerPlayer[P].Data != null)) PokerPlayer[P].WebLink = PokerPlayer[P].Data.cache.WebLink;
				if ((PokerPlayer[P].WebLink != null) && (PokerPlayer[P].WebLink != "")) DrawButton(50 + P * 500, 920, 400, 60, TextGet("VisitArtist"), "White");
			}
	}

	// Draws the cards and chips
	if ((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER") || (PokerMode == "RESULT")) {
		for (let P = (PokerShowPlayer ? 0 : 1); P < PokerPlayer.length; P++)
			if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Hand.length > 0)) {
				DrawText(PokerPlayer[P].Name + ": " + PokerPlayer[P].Chip.toString(), (PokerShowPlayer ? 250 : 0) + P * 500, 682, "white", "gray");
				if ((PokerPlayer[P].Family != "Player") && (PokerMode != "RESULT"))
					DrawImageEx("Screens/Room/Poker/Cards/OpponentCards.gif", (PokerShowPlayer ? 250 : 0) + P * 500 - 75, 720, {Canvas: MainCanvas, Zoom: 1.5});
				else {
					DrawImageEx(PokerCardFileName(PokerPlayer[P].Hand[0]), (PokerShowPlayer ? 250 : 0) + P * 500 - 135, 710, {Canvas: MainCanvas, Zoom: 0.6});
					DrawImageEx(PokerCardFileName(PokerPlayer[P].Hand[1]), (PokerShowPlayer ? 250 : 0) + P * 500 + 20, 710, {Canvas: MainCanvas, Zoom: 0.6});
				}
			}
		if ((!PokerShowPlayer) && (PokerPlayer[0].Hand.length > 0)) {
			DrawText(TextGet("Chip") + ": " + PokerPlayer[0].Chip.toString(), 1887, 970, "white", "gray");
			if (PokerMode == "RESULT") {
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[0]), 50, 825, {Canvas: MainCanvas, Zoom: 0.6});
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[1]), 200, 825, {Canvas: MainCanvas, Zoom: 0.6});
			} else {
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[0]), 25, 800, {Canvas: MainCanvas, Zoom: 1.25});
				DrawImageEx(PokerCardFileName(PokerPlayer[0].Hand[1]), 250, 800, {Canvas: MainCanvas, Zoom: 1.25});
			}
		}
	}

	// Draws the table cards
	if ((PokerTableCards.length > 0) && ((PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER") || (PokerMode == "RESULT"))) {
		for (let C = 0; C < PokerTableCards.length; C++)
			DrawImageEx(PokerCardFileName(PokerTableCards[C]), C * 150 + 640, 850, {Canvas: MainCanvas, Zoom: 0.6});
	}

	// In deal mode, we allow the regular actions when the player can play
	if (((PokerMode == "DEAL") || (PokerMode == "FLOP") || (PokerMode == "TURN") || (PokerMode == "RIVER")) && (PokerPlayer[0].Hand.length > 0)) {
		DrawText(TextGet("Pot") + " " + PokerPot.toString(), 1487, 970, "white", "gray");
		DrawText(TextGet("Ante") + " " + PokerAnte.toString(), 1687, 970, "white", "gray");
		DrawButton(1400, 875, 175, 60, TextGet("Bet"), "White");
		DrawButton(1600, 875, 175, 60, TextGet("Raise"), "White");
		DrawButton(1800, 875, 175, 60, TextGet("Fold"), "White");
	}

	// In deal mode, we can only watch without a hand
	if ((PokerMode == "DEAL") && (PokerPlayer[0].Hand.length == 0)) {
		DrawText(TextGet("Ante") + " " + PokerAnte.toString(), 1887, 970, "white", "gray");
		DrawButton(1800, 875, 175, 60, TextGet("Watch"), "White");
	}

	// In result mode, we show the winner and allow to deal new cards
	if (PokerMode == "RESULT") {
		DrawText(PokerResultMessage, 1600, 910, "white", "gray");
		DrawText(PokerMessage, 1600, 960, "white", "gray");
		DrawButton(1800, 875, 175, 60, TextGet("Deal"), "White");
	}

	// In End mode, we present the winner and allow to restart
	if (PokerMode == "END") {
		DrawText(PokerMessage, 1000, 800, "white", "gray");
		DrawButton(800, 875, 400, 60, TextGet("EndGame"), "White");
	}

}

/**
 * Clears the player data for player P
 * @param {PokerPlayer} P
 * @returns {void} - Nothing
 */
function PokerClearData(P) {
	P.Difficulty = null;
	P.Data = null;
	P.Image = null;
	P.TextColor = null;
	P.TextSingle = null;
	P.TextMultiple = null;
	P.WebLink = null;
	P.Alternate = null;
}

/**
 * Returns TRUE if the opponent has been unlocked and can be faced
 * @param {string} Opponent
 * @returns {boolean}
 */
function PokerChallengeUnlocked(Opponent) {
	if (Player.Game.Poker.Challenge == null) return false;
	let OpponentPos = PokerChallenge.indexOf(Opponent);
	let ProgressPos = PokerChallenge.indexOf(Player.Game.Poker.Challenge);
	return (ProgressPos >= OpponentPos);
}

/**
 * Picks the next/previous opponent family for a player P
 * @param {PokerPlayer} P - The player to change
 * @param {boolean} Next - Whether to pick the next or previous opponent
 * @returns {void} - Nothing
 */
function PokerChangeOpponentFamily(P, Next) {

	// Picks the next/previous family
	let Found = false;
	for (let A = (Next ? 0 : 1); A < PokerAsset.length + (Next ? -1 : 0); A++)
		if (!Found && (PokerAsset[A].Family == P.Family)) {
			P.Family = PokerAsset[A + (Next ? 1 : -1)].Family;
			P.Type = PokerAsset[A + (Next ? 1 : -1)].Type;
			Found = true;
		}
	if (!Found) {
		P.Family = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Family;
		P.Type = PokerAsset[(Next ? 0 : PokerAsset.length - 1)].Type;
	}

	// Builds the opponent list
	PokerOpponentList = [];
	for (let A = 0; A < PokerAsset.length; A++)
		if (PokerAsset[A].Family == P.Family)
			for (let O = 0; O < PokerAsset[A].Opponent.length; O++)
				if (PokerChallengeUnlocked(PokerAsset[A].Opponent[O]))
					PokerOpponentList.push(PokerAsset[A].Opponent[O]);
	if (PokerOpponentList.length == 0) PokerOpponentList.push("None");

	// Sets the first opponent
	P.Name = PokerOpponentList[0];
	PokerClearData(P);

}

/**
 * Picks the next/previous opponent for a player P
 * @param {PokerPlayer} P
 * @param {boolean} Next - true for next, false for previous
 * @returns {void} - Nothing
 */
function PokerChangeOpponent(P, Next) {
	let Pos = PokerOpponentList.indexOf(P.Name);
	Pos = Pos + (Next ? 1 : -1);
	if (Pos < 0) Pos = PokerOpponentList.length - 1;
	if (Pos > PokerOpponentList.length - 1) Pos = 0;
	P.Name = PokerOpponentList[Pos];
	PokerClearData(P);
}

/**
 * Picks the next challenge in the list
 * @returns {PokerPlayer} - Nothing
 */
function PokerNextChallenge() {
	let ProgressPos = PokerChallenge.indexOf(Player.Game.Poker.Challenge) + 1;
	if (ProgressPos <= PokerChallenge.length)
		for (let A = 0; A < PokerAsset.length; A++)
			for (let O = 0; O < PokerAsset[A].Opponent.length; O++)
				if (PokerAsset[A].Opponent[O] == PokerChallenge[ProgressPos])
					return { Type: "Set", Family: PokerAsset[A].Family, Name: PokerAsset[A].Opponent[O], Chip: 100 };
	return { Type: "None", Family: "None", Name: "None", Chip: 100 };
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function PokerClick() {

	// The main buttons to select the game options
	if (PokerMode == "") {
		if (MouseIn(100, 790, 64, 64)) PokerShowPlayer = !PokerShowPlayer;
		if (MouseIn(50, 880, 400, 60)) PokerGame = (PokerGame == "TexasHoldem") ? "TwoCards" : "TexasHoldem";
		if (MouseIn(1885, 25, 90, 90)) PokerExit();
		for (let P = 1; P < PokerPlayer.length; P++) {
			if (MouseIn(50 + P * 500, 760, 400, 60))
				PokerChangeOpponentFamily(PokerPlayer[P], (MouseX >= 250 + P * 500));
			if ((PokerPlayer[P].Type != "None") && MouseIn(50 + P * 500, 840, 400, 60))
				PokerChangeOpponent(PokerPlayer[P], (MouseX >= 250 + P * 500));
			if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && MouseIn(50 + P * 500, 920, 400, 60) && (PokerPlayer[P].WebLink != null) && (PokerPlayer[P].WebLink != ""))
				window.open(PokerPlayer[P].WebLink);
		}
	}

	// If we must challenge a new opponent, we select it and click on the start game button
	if (MouseIn(1885, 145, 90, 90) && (PokerMode == "")) {
		PokerPlayer[1] = { Type: "None", Family: "None", Name: "None", Chip: 100 };
		PokerPlayer[2] = PokerNextChallenge();
		PokerPlayer[3] = { Type: "None", Family: "None", Name: "None", Chip: 100 };
		if (PokerPlayer[2].Name != "None") MouseY = 300;
	}

	// If we must start a new custom game
	if (MouseIn(1885, 265, 90, 90) && (PokerMode == "")) {
		PokerPlayerCount = 0;
		for (let P = 0; P < PokerPlayer.length; P++) {
			if (PokerPlayer[P].Type == "Character") {
				PokerPlayer[P].Cloth = InventoryGet(PokerPlayer[P].Character, "Cloth");
				PokerPlayer[P].ClothLower = InventoryGet(PokerPlayer[P].Character, "ClothLower");
				PokerPlayer[P].ClothAccessory = InventoryGet(PokerPlayer[P].Character, "ClothAccessory");
				PokerPlayer[P].Panties = InventoryGet(PokerPlayer[P].Character, "Panties");
				PokerPlayer[P].Bra = InventoryGet(PokerPlayer[P].Character, "Bra");
			}
			PokerGetText(PokerPlayer[P], "Intro");
			if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None")) PokerPlayerCount++;
		}
		if (PokerPlayerCount >= 2) {
			for (let P = 0; P < PokerPlayer.length; P++)
				PokerPlayer[P].Chip = ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None")) ? 100 : 0;
			PokerAnte = (PokerGame == "TwoCards") ? 2 : 1;
			PokerAnteCount = 0;
			PokerDealHands();
		}
	}

	// If we can process to the next step
	let modeCheck = ["DEAL", "FLOP", "TURN", "RIVER"].includes(PokerMode);
	if (MouseIn(1400, 875, 175, 60) && modeCheck && (PokerPlayer[0].Hand.length > 0))
		PokerProcess("Bet");

	if (MouseIn(1600, 875, 175, 60) && modeCheck && (PokerPlayer[0].Hand.length > 0))
		PokerProcess("Raise");

	if (MouseIn(1800, 875, 175, 60) && modeCheck && (PokerPlayer[0].Hand.length > 0))
		PokerProcess("Fold");

	if (MouseIn(1800, 875, 175, 60) && modeCheck && (PokerPlayer[0].Hand.length <= 0))
		PokerProcess("Watch");

	if (MouseIn(1800, 875, 175, 60) && (PokerMode == "RESULT"))
		PokerDealHands();

	if (MouseIn(800, 875, 400, 60) && (PokerMode == "END")) {
		if ((PokerPlayerCount == 2) && (PokerPlayer[2].Type != "None") && (PokerPlayer[2].Name != "None"))
			PokerPlayer[2] = { Type: "None", Family: "None", Name: "None", Chip: 100 };
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
	let modeCheck = ["DEAL", "FLOP", "TURN", "RIVER"].includes(PokerMode);
	let handSize = PokerPlayer[0].Hand.length;

	if ((KeyPress == 66 || KeyPress == 98) && modeCheck && handSize > 0)
		PokerProcess("Bet"); // B to bet

	if ((KeyPress == 82 || KeyPress == 114) && modeCheck && handSize > 0)
		PokerProcess("Raise"); // R to raise

	if ((KeyPress == 70 || KeyPress == 102) && modeCheck && handSize > 0)
		PokerProcess("Fold"); // F to fold

	if ((KeyPress == 87 || KeyPress == 119) && modeCheck && handSize <= 0)
		PokerProcess("Watch"); // W to watch

	if ((KeyPress == 68 || KeyPress == 100) && PokerMode === "RESULT")
		PokerDealHands(); // D to deal
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
 * @param {PokerPlayer} PP
 * @returns {void} - Nothing
 */
function PokerDrawCard(PP) {

	// Tries to assign the difficulty
	if ((PP.Difficulty == null) && (PP.Data != null) && (PP.Data.cache != null) && (PP.Data.cache.Difficulty != null))
		PP.Difficulty = parseInt(PP.Data.cache.Difficulty);

	// Draw until we find a valid card
	let Draw = true;
	let Card = -1;
	while (Draw) {

		// Finds a card that's not already picked
		Draw = false;
		Card = Math.floor(Math.random() * 52) + 1;
		for (let P = 0; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Hand.indexOf(Card) >= 0)
				Draw = true;

		// On low difficulty, cannot draw a high card, on high, cannot draw a low card
		let Value = ((Card - 1) % 13) + 2;
		if ((PP.Difficulty < 0) && (Value >= 15 + PP.Difficulty)) Draw = true;
		if ((PP.Difficulty > 0) && (Value <= 1 + PP.Difficulty)) Draw = true;

	}

	// Add that card to the player hand
	PP.Hand.push(Card);

}

/**
 * Returns the file name associated with the card
 * @param {number} Card
 * @returns {string} - The file name of the card image
 */
function PokerCardFileName(Card) {
	if (Card <= 13) return "Screens/Room/Poker/Cards/" + (Card + 1) + "C.png";
	else if (Card <= 26) return "Screens/Room/Poker/Cards/" + (Card - 12) + "D.png";
	else if (Card <= 39) return "Screens/Room/Poker/Cards/" + (Card - 25) + "H.png";
	else if (Card <= 52) return "Screens/Room/Poker/Cards/" + (Card - 38) + "S.png";
	return "";
}

/**
 * Draw one card on the poker table, only used in Texas Hold'em
 * @returns {void} - Nothing
 */
function PokerTableDraw() {

	// Draw until we find a card that's not picked yet
	let Draw = true;
	let Card = -1;
	while (Draw) {
		Draw = false;
		Card = Math.floor(Math.random() * 52) + 1;
		for (let P = 0; P < PokerPlayer.length; P++)
			if (PokerPlayer[P].Hand.indexOf(Card) >= 0)
				Draw = true;
		if (PokerTableCards.indexOf(Card) >= 0)
			Draw = true;
	}

	// Add that card to the player hand
	PokerTableCards.push(Card);

}

/**
 * When all players chip in the pot
 * @returns {void} - Nothing
 */
function PokerAddPot(Multiplier, StartPos) {
	for (let P = StartPos; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Chip > 0)) {
			let Bet = PokerAnte * Multiplier;
			if (PokerPlayer[P].Chip < Bet) Bet = PokerPlayer[P].Chip;
			PokerPot = PokerPot + Bet;
			PokerPlayer[P].Chip = PokerPlayer[P].Chip - Bet;
		}
}

/**
 * When the player wins, she can unlock new opponents and win money
 * @returns {void}
 */
function PokerChallengeDone() {
	if ((PokerPlayerCount == 2) && (PokerPlayer[2].Type != "None") && (PokerPlayer[2].Name != "None")) {
		let OpponentPos = PokerChallenge.indexOf(PokerPlayer[2].Name);
		let ProgressPos = PokerChallenge.indexOf(Player.Game.Poker.Challenge);
		if (OpponentPos > ProgressPos) {
			let Money = 4 + OpponentPos;
			CharacterChangeMoney(Player, Money);
			PokerMessage = TextGet("WinChallenge").replace("MoneyAmount", Money.toString()).replace("OpponentName", PokerPlayer[2].Name);
			Player.Game.Poker.Challenge = PokerPlayer[2].Name;
			ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		}
	}
}

/**
 * Process an action to advance the poker game
 * @param {string} Action - Bet, Raise, Fold or Watch
 * @returns {string} - The file name of the card image
 */
function PokerProcess(Action) {

	// In Texas, watching the game resolves it fully
	if ((PokerGame == "TexasHoldem") && ((Action == "Watch") || (Action == "Fold"))) {
		PokerMode = "RIVER";
		if (PokerTableCards.length == 0) {
			PokerAddPot(1, 1);
			PokerTableDraw();
			PokerTableDraw();
			PokerTableDraw();
		}
		if (PokerTableCards.length == 3) {
			PokerAddPot(1, 1);
			PokerTableDraw();
		}
		if (PokerTableCards.length == 4) {
			PokerAddPot(1, 1);
			PokerTableDraw();
		}
	}

	// In Texas Hold'em, we go: deal, flop, turn, river, result
	if ((PokerGame == "TexasHoldem") && (PokerMode != "RIVER")) {
		if (PokerMode == "TURN") {
			PokerMode = "RIVER";
			PokerTableDraw();
		}
		if (PokerMode == "FLOP") {
			PokerMode = "TURN";
			PokerTableDraw();
		}
		if (PokerMode == "DEAL") {
			PokerMode = "FLOP";
			PokerTableDraw();
			PokerTableDraw();
			PokerTableDraw();
		}
		PokerAddPot((Action == "Raise") ? 2 : 1, (Action == "Fold") ? 1 : 0);
		return;
	}

	// Gets the hand values and round winner
	PokerAddPot((Action == "Raise") ? 2 : 1, (Action == "Fold") ? 1 : 0);
	let Winner = 0;
	let MaxValue = -1;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Hand.length > 0)) {
			PokerPlayer[P].HandValue = PokerHandValueCalcHandValue(PokerPlayer[P].Hand[0], PokerPlayer[P].Hand[1], PokerGame, PokerMode, PokerTableCards);
			if ((P == 0) && (Action == "Fold")) PokerPlayer[P].HandValue = -1;
			if (PokerPlayer[P].HandValue > MaxValue) {
				MaxValue = PokerPlayer[P].HandValue;
				Winner = P;
			}
		}

	// Gets the number of winners and split the chips between them
	let WinnerCount = 0;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Hand.length > 0) && (PokerPlayer[P].HandValue == MaxValue))
			WinnerCount++;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Hand.length > 0) && (PokerPlayer[P].HandValue == MaxValue))
			PokerPlayer[P].Chip = PokerPlayer[P].Chip + Math.floor(PokerPot / WinnerCount);
	PokerMessage = (WinnerCount > 1) ? TextGet("SplitPot") : (PokerPlayer[Winner].Name + " " + TextGet("Win"));

	// Gets the final result
	PokerResultMessage = TextGet("Hand" + PokerHandValueTextHandValue(MaxValue));
	PokerMode = "RESULT";

	// Raises the ante after 5 rounds
	PokerAnteCount++;
	if (PokerAnteCount >= 5) {
		PokerAnte = PokerAnte + ((PokerGame == "TwoCards") ? 2 : 1);
		PokerAnteCount = 0;
	}

	// Reloads the opponents text and images
	for (let P = 0; P < PokerPlayer.length; P++) {
		PokerGetImage(PokerPlayer[P]);
		PokerGetText(PokerPlayer[P]);
	}

	// If there's only 1 active player, we stop the game
	let PlayerCount = 0;
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Chip > 0))
			PlayerCount++;
	if (PlayerCount <= 1) {
		for (let P = 1; P < PokerPlayer.length; P++)
			if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None")) {
				let TextType = "Win";
				if (PokerPlayer[P].Chip == 0) TextType = "Lose";
				if ((PokerPlayer[P].Chip == 0) && (PokerPlayer[0].Chip == 0)) TextType = "LoseOther";
				PokerGetText(PokerPlayer[P], TextType);
			}
		PokerMessage = PokerPlayer[Winner].Name + " " + TextGet("WinGame");
		if (Winner == 0) PokerChallengeDone();
		PokerMode = "END";
	}

}

/**
 * Deals a fresh new hand for all poker players
 * @returns {void} - Nothing
 */
function PokerDealHands() {
	PokerTableCards = [];
	for (let P = 0; P < PokerPlayer.length; P++)
		PokerPlayer[P].Hand = [];
	for (let P = 0; P < PokerPlayer.length; P++)
		if ((PokerPlayer[P].Type != "None") && (PokerPlayer[P].Name != "None") && (PokerPlayer[P].Chip > 0)) {
			PokerDrawCard(PokerPlayer[P]);
			PokerDrawCard(PokerPlayer[P]);
		}
	PokerMode = "DEAL";
	PokerPot = 0;
	PokerAddPot(1, 0);
}
