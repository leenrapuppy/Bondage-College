"use strict";
var ClubCardBackground = "ClubCardPlayBoard1";
var ClubCardLog = [];
var ClubCardLogText = "";
var ClubCardLogScroll = false;
var ClubCardColor = ["#808080", "#FFFFFF", "#B0FFB0", "#B0B0FF", "#FF80FF", "#FF8080", "#FFD700"];
var ClubCardOpponent = null;
var ClubCardHover = null;
var ClubCardFocus = null;
var ClubCardFirstTurn = true;
var ClubCardTurnIndex = 0;
var ClubCardTurnCardPlayed = 0;
var ClubCardTurnEndDraw = false;
var ClubCardFameGoal = 100;
var ClubCardDefaultDeck = {
	Name: "DEFAULT",
	Cards: [1000, 1001, 1002, 1003, 1004, 1006, 1007, 1009, 2000, 2002, 2004, 2005, 4000, 4002, 4003, 4004, 4005, 6000, 6001, 6002, 6003, 6004, 8000, 8001, 8002, 8003, 8004, 9000, 9001, 9002]
};
var ClubCardLevelLimit = [0, 4, 7, 12, 20, 40];
var ClubCardLevelCost = [0, 0, 10, 20, 40, 80];
/** @type {ClubCardPlayer[]} */
var ClubCardPlayer = [];
/** @type {ClubCard[]} */
var ClubCardList = [

	// 1000 - Regular Members (No specific rules)
	{
		ID: 1000,
		Name: "Kinky Neighbor",
		Type: "Member",
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Cute Girl Next Door")) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 1001,
		Name: "Cute Girl Next Door",
		FamePerTurn: 1,
	},
	{
		ID: 1002,
		Name: "Voyeur",
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Exhibitionist")) ClubCardPlayerAddMoney(CCPlayer, 4);
		}
	},
	{
		ID: 1003,
		Name: "Exhibitionist",
	},
	{
		ID: 1004,
		Name: "Party Animal",
		MoneyPerTurn: 2,
		FamePerTurn: -1
	},
	{
		ID: 1005,
		Name: "Auctioneer",
		MoneyPerTurn: 1
	},
	{
		ID: 1006,
		Name: "Uptown Girl",
		MoneyPerTurn: 2,
		RequiredLevel: 2
	},
	{
		ID: 1007,
		Name: "Tourist",
		MoneyPerTurn: 3,
		RequiredLevel: 4
	},
	{
		ID: 1008,
		Name: "Diplomat",
		MoneyPerTurn: 5,
		RequiredLevel: 5
	},
	{
		ID: 1009,
		Name: "Gambler",
		MoneyPerTurn: 1,
		OnBoardEntry: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 4);
		}
	},

	// 2000 - Staff Members (Club employees that can be targetted by events)
	{
		ID: 2000,
		Name: "Waitress",
		Group: ["Staff"],
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Party Animal")) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 2001,
		Name: "Bouncer",
		Group: ["Staff"],
		MoneyPerTurn: -1,
		FamePerTurn: 2
	},
	{
		ID: 2002,
		Name: "Accountant",
		Group: ["Staff"],
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (CCPlayer.Level >= 3) ClubCardPlayerAddMoney(CCPlayer, 1);
			if (CCPlayer.Level >= 5) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 2003,
		Name: "Secretary",
		Group: ["Staff"],
		ExtraTime: 1,
		RequiredLevel: 3
	},
	{
		ID: 2004,
		Name: "Associate",
		Group: ["Staff"],
		MoneyPerTurn: -2,
		ExtraPlay: 1,
		RequiredLevel: 3
	},
	{
		ID: 2005,
		Name: "Human Resource",
		Group: ["Staff"],
		MoneyPerTurn: -1,
		ExtraDraw: 1,
		RequiredLevel: 3
	},

	// 3000 - Police / Criminal Members (Cancel each others and offer protections against events)
	{
		ID: 3000,
		Name: "Policewoman",
		Group: ["Police"],
		MoneyPerTurn: 1,
		FamePerTurn: 1,
		RequiredLevel: 3
	},
	{
		ID: 3001,
		Name: "Pusher",
		Group: ["Criminal"],
		MoneyPerTurn: 2,
		FamePerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Police")) ClubCardRemoveFromBoard(CCPlayer.Board, this);
		}
	},
	{
		ID: 3002,
		Name: "Junkie",
		Group: ["Criminal"],
		MoneyPerTurn: 1,
		FamePerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Pusher")) ClubCardPlayerAddMoney(CCPlayer, 2);
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Police")) ClubCardRemoveFromBoard(CCPlayer.Board, this);
		}
	},
	{
		ID: 3003,
		Name: "Zealous Cop",
		Group: ["Liability", "Police"],
		RequiredLevel: 3,
		FamePerTurn: -2
	},

	// 4000 - Fetishists (Synergies with other groups)
	{
		ID: 4000,
		Name: "Maid Lover",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Maid"));
		}
	},
	{
		ID: 4001,
		Name: "College-Girl Fan",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "College"));
		}
	},
	{
		ID: 4002,
		Name: "Masochist",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Dominant")) {
				ClubCardPlayerAddMoney(CCPlayer, 1);
				ClubCardPlayerAddFame(CCPlayer, 1);
			}
		}
	},
	{
		ID: 4003,
		Name: "Feet Lover",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Dominant"))
				ClubCardPlayerAddMoney(CCPlayer, 2);
		}
	},
	{
		ID: 4004,
		Name: "Fin-Dom Simp",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Dominant"));
		}
	},
	{
		ID: 4005,
		Name: "Fin-Dom Whale",
		Group: ["Fetishist"],
		RequiredLevel: 3,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Dominant") * 2);
		}
	},
	{
		ID: 4006,
		Name: "Porn Adict",
		Group: ["Fetishist"],
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn"));
		}
	},

	// 5000 - Porn Members (Raise both Fame and Money)
	{
		ID: 5000,
		Name: "Porn Amateur",
		Group: ["Porn"],
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn"));
		}
	},
	{
		ID: 5001,
		Name: "Porn Movie Director",
		RequiredLevel: 2,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn") * 2);
		}
	},
	{
		ID: 5002,
		Name: "Porn Actress",
		Group: ["Porn"],
		MoneyPerTurn: 1,
		FamePerTurn: 1,
		RequiredLevel: 3
	},
	{
		ID: 5003,
		Name: "Porn Star",
		Group: ["Porn"],
		MoneyPerTurn: 2,
		FamePerTurn: 4,
		RequiredLevel: 5
	},

	// 6000 - Maid Members (Raise Fame, cost Money)
	{
		ID: 6000,
		Name: "Rookie Maid",
		Group: ["Maid"],
		FamePerTurn: 1
	},
	{
		ID: 6001,
		Name: "Coat Check Maid",
		Group: ["Maid"],
		MoneyPerTurn: 1
	},
	{
		ID: 6002,
		Name: "Regular Maid",
		Group: ["Maid"],
		MoneyPerTurn: -1,
		FamePerTurn: 2
	},
	{
		ID: 6003,
		Name: "French Maid",
		Group: ["Maid"],
		MoneyPerTurn: -1,
		FamePerTurn: 3,
		RequiredLevel: 3
	},
	{
		ID: 6004,
		Name: "Head Maid",
		Group: ["Maid"],
		MoneyPerTurn: -2,
		FamePerTurn: 2,
		RequiredLevel: 4,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Maid"));
		}
	},

	// 7000 - Asylum Patient and Nurse Members (Synergies between each other)
	{
		ID: 7000,
		Name: "Curious Patient",
		Group: ["Patient"],
		MoneyPerTurn: 1,
	},
	{
		ID: 7001,
		Name: "Nurse",
		Group: ["Nurse"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Patient"));
		}
	},
	{
		ID: 7002,
		Name: "Commited Patient",
		Group: ["Patient"],
		MoneyPerTurn: 2,
		RequiredLevel: 2
	},
	{
		ID: 7003,
		Name: "Head Nurse",
		Group: ["Nurse"],
		RequiredLevel: 3,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Patient") * 2);
		}
	},
	{
		ID: 7004,
		Name: "Permanent Patient",
		Group: ["Patient"],
		MoneyPerTurn: 3,
		RequiredLevel: 4
	},
	{
		ID: 7005,
		Name: "Doctor",
		Group: ["Nurse"],
		RequiredLevel: 5,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Patient") * 3);
		}
	},

	// 8000 - Dominant Members (Raise lots of Fame, cost Money)
	{
		ID: 8000,
		Name: "Amateur Rigger",
		Group: ["Dominant"],
		FamePerTurn: 1
	},
	{
		ID: 8001,
		Name: "Domme",
		Group: ["Dominant"],
		MoneyPerTurn: -1,
		FamePerTurn: 2
	},
	{
		ID: 8002,
		Name: "Madam",
		Group: ["Dominant"],
		RequiredLevel: 2,
		MoneyPerTurn: -2,
		FamePerTurn: 3
	},
	{
		ID: 8003,
		Name: "Mistress",
		Group: ["Dominant", "Mistress"],
		RequiredLevel: 3,
		MoneyPerTurn: -3,
		FamePerTurn: 5
	},
	{
		ID: 8004,
		Name: "Dominatrix",
		Group: ["Dominant", "Mistress"],
		RequiredLevel: 4,
		MoneyPerTurn: -4,
		FamePerTurn: 6
	},
	{
		ID: 8005,
		Name: "Mistress Sophie",
		Group: ["Dominant", "Mistress"],
		Unique: true,
		RequiredLevel: 5,
		MoneyPerTurn: -5,
		FamePerTurn: 8
	},

	// 9000 - Liability Members (Used on other board to handicap)
	{
		ID: 9000,
		Name: "Scammer",
		Group: ["Liability"],
		MoneyPerTurn: -1
	},
	{
		ID: 9001,
		Name: "Pyramid Schemer",
		Group: ["Liability"],
		RequiredLevel: 2,
		MoneyPerTurn: -2
	},
	{
		ID: 9002,
		Name: "Ponzi Schemer",
		Group: ["Liability"],
		RequiredLevel: 4,
		MoneyPerTurn: -3
	},
	{
		ID: 9003,
		Name: "Party Pooper",
		Group: ["Liability"],
		FamePerTurn: -1
	},
	{
		ID: 9004,
		Name: "College Dropout",
		Group: ["Liability"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "College") * -1);
		}
	},
	{
		ID: 9005,
		Name: "Union Leader",
		Group: ["Liability"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Maid") * -1);
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Staff") * -1);
		}
	},
	{
		ID: 9006,
		Name: "No-Fap Advocate",
		Group: ["Liability"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn") * -2);
		}
	},

	// 10000 - ABDL Members (Mostly gives Money)
	{
		ID: 10000,
		Name: "Baby Girl",
		Group: ["Baby"],
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Mommy")) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 10001,
		Name: "Mommy",
		MoneyPerTurn: 1
	},
	{
		ID: 10002,
		Name: "Diaper Lover",
		Group: ["Baby"],
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Maid")) ClubCardPlayerAddMoney(CCPlayer, 2);
		}
	},
	{
		ID: 10003,
		Name: "Sugar Baby",
		Group: ["Baby"],
		RequiredLevel: 4,
		MoneyPerTurn: 3
	},
	{
		ID: 10004,
		Name: "Babysitter",
		Group: ["Staff"],
		MoneyPerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Baby") * 2);
		}
	},

	// 11000 - College Members (Mostly gives Fame)
	{
		ID: 11000,
		Name: "Amanda",
		Group: ["Student"],
		Unique: true,
		FamePerTurn: 1
	},
	{
		ID: 11001,
		Name: "Sarah",
		Group: ["Student"],
		Unique: true,
		FamePerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Amanda")) ClubCardPlayerAddFame(CCPlayer, 1);
		}
	},
	{
		ID: 11002,
		Name: "Sidney",
		Group: ["Student"],
		Unique: true,
		FamePerTurn: 1
	},
	{
		ID: 11003,
		Name: "Jennifer",
		Group: ["Student"],
		Unique: true,
		FamePerTurn: 1
		// Remove one of your current member on entry
	},
	{
		ID: 11004,
		Name: "College Freshwoman",
		Group: ["Student"],
		FamePerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Julia")) ClubCardPlayerAddFame(CCPlayer, 1);
		}
	},
	{
		ID: 11005,
		Name: "College Nerd",
		Group: ["Student"],
		FamePerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Yuki")) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 11006,
		Name: "College Senior",
		Group: ["Student"],
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Mildred")) ClubCardPlayerAddFame(CCPlayer, 3);
		}
	},
	{
		ID: 11007,
		Name: "College Teacher",
		Group: ["Teacher"],
		MoneyPerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Student"));
		}
	},
	{
		ID: 11008,
		Name: "Julia",
		Group: ["Teacher"],
		Unique: true,
		RequiredLevel: 2,
		FamePerTurn: 2
	},
	{
		ID: 11009,
		Name: "Yuki",
		Group: ["Teacher"],
		Unique: true,
		RequiredLevel: 3,
		FamePerTurn: 2,
		MoneyPerTurn: 1,
	},
	{
		ID: 11010,
		Name: "Mildred",
		Group: ["Teacher"],
		Unique: true,
		RequiredLevel: 4,
		FamePerTurn: 3,
	},

];


/**
 * Adds a text entry to the game log
 * @param {string} LogEntry - The club card player
 * @returns {void} - Nothing
 */
function ClubCardLogAdd(LogEntry) {
	ClubCardLog.push(LogEntry);
	ClubCardLogScroll = true;
	ClubCardLogText = "";
	for (let L of ClubCardLog)
		ClubCardLogText = ClubCardLogText + ((ClubCardLogText == "") ? "" : "\r\n--------------------\r\n") + L;
}

/**
 * Adds money to the club card player stats
 * @param {Object} CCPlayer - The club card player
 * @param {Number} Amount - The amount to add
 * @returns {void} - Nothing
 */
function ClubCardPlayerAddMoney(CCPlayer, Amount) {
	if (CCPlayer.Money == null) CCPlayer.Money = 0;
	CCPlayer.Money = CCPlayer.Money + Amount;
}

/**
 * Adds fame to the club card player stats, can trigger a victory
 * @param {Object} CCPlayer - The club card player
 * @param {Number} Amount - The amount to add
 * @returns {void} - Nothing
 */
function ClubCardPlayerAddFame(CCPlayer, Amount) {
	if (CCPlayer.Fame == null) CCPlayer.Fame = 0;
	CCPlayer.Fame = CCPlayer.Fame + Amount;
	if (CCPlayer.Fame >= ClubCardFameGoal) {
		MiniGameEnded = true;
		MiniGameVictory = (CCPlayer.Control == "Player");
	}
}

/**
 * Raises the level of player
 * @param {Object} CCPlayer - The club card player
 * @returns {void} - Nothing
 */
function ClubCardUpgradeLevel(CCPlayer) {
	if ((CCPlayer.Level >= ClubCardLevelCost.length - 1) || (CCPlayer.Money < ClubCardLevelCost[CCPlayer.Level + 1])) return;
	CCPlayer.Level++;
	ClubCardPlayerAddMoney(CCPlayer, ClubCardLevelCost[CCPlayer.Level] * -1);
	let Text = TextGet("UpgradedToLevel" + CCPlayer.Level.toString());
	Text = Text.replace("PLAYERNAME", CharacterNickname(CCPlayer.Character));
	Text = Text.replace("MONEY", ClubCardLevelCost[CCPlayer.Level].toString());
	ClubCardLogAdd(Text);
	ClubCardEndTurn();
}

/**
 * Returns TRUE if a card (by name) is currently present on a board
 * @param {Array} Board - The board to scan
 * @param {Object} CardName - The card name
 * @returns {boolean} - TRUE if at least one card with that name is present
 */
function ClubCardNameIsOnBoard(Board, CardName) {
	if ((Board == null) || (Board == null)) return false;
	for (let Card of Board)
		if (Card.Name === CardName)
			return true;
	return false;
}

/**
 * Returns TRUE if a card (by group) is currently present on a board
 * @param {Array} Board - The board to scan
 * @param {Object} CardGroup - The card group
 * @returns {boolean} - TRUE if at least one card from that group is present
 */
function ClubCardGroupIsOnBoard(Board, CardGroup) {
	if ((Board == null) || (Board == null) || (CardGroup == null)) return false;
	for (let Card of Board)
		if (Card.Group != null)
			for (let Group of Card.Group)
				if (Group === CardGroup)
					return true;
	return false;
}

/**
 * Returns the number of cards of a specific group found on a board
 * @param {Array} Board - The board to scan
 * @param {Object} CardGroup - The card group
 * @returns {number} - The number of cards from that group on the board
 */
function ClubCardGroupOnBoardCount(Board, CardGroup) {
	if ((Board == null) || (CardGroup == null)) return 0;
	let Count = 0;
	for (let Card of Board)
		if (Card.Group != null)
			for (let Group of Card.Group)
					if (Group === CardGroup)
						Count++;
	return Count;
}

/**
 * Removes a card from the board
 * @param {Array} Board - The board on which to remove the card
 * @param {ClubCard} Card - The card object to remove
 * @returns {void} - Nothing
 */
function ClubCardRemoveFromBoard(Board, Card) {
	if (Board == null) return;
	let Pos = 0;
	for (let C of Board) {
		if (C.ID === Card.ID)
			Board = Board.splice(Pos, 1);
		Pos++;
	}
}

/**
 * Shuffles an array of cards
 * @param {Array} array - The array of cards to shuffle
 * @returns {Array} - The shuffled cards
 */
function ClubCardShuffle(array) {
	let currentIndex = array.length,  randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
	return array;
}

/**
 * Draw cards from the player deck into it's hand
 * @param {ClubCardPlayer} CCPlayer - The club card player that draws the cards
 * @param {number|null} Amount - The amount of cards to draw, 1 if null
 * @returns {void} - Nothing
 */
function ClubCardPlayerDrawCard(CCPlayer, Amount = 1) {
	if ((CCPlayer == null) || (CCPlayer.Deck == null) || (CCPlayer.Hand == null)) return;
	if (Amount == null) Amount = 1;
	while (Amount > 0) {
		if (CCPlayer.Deck.length > 0) {
			CCPlayer.Hand.push(CCPlayer.Deck[0]);
			CCPlayer.Deck.splice(0, 1);
		}
		Amount--;
	}
}

/**
 * Builds a deck array of object from a deck array of numbers
 * @param {Array} InDeck - The array of number deck
 * @returns {Array} - The resulting deck
 */
function ClubCardLoadDeck(InDeck) {
	let OutDeck = [];
	for (let D of InDeck)
		for (let C of ClubCardList)
			if (C.ID == D) {
				let Card = {...C};
				if (Card.Type == null) Card.Type = "Member";
				OutDeck.push(Card);
				break;
			}
	return OutDeck;
}

/**
 * Draw the club card player hand on screen, show only sleeves if not controlled by player
 * @param {Character} Char - The character to link to that club card player
 * @param {String} Cont - The control linked to that player
 * @param {Array} Cards - The cards to build the deck with
 * @returns {void} - Nothing
 */
function ClubCardAddPlayer(Char, Cont, Cards) {
	let P = {
		Character: {...Char},
		Control: Cont,
		Deck: ClubCardShuffle(ClubCardLoadDeck(Cards)),
		FullDeck: ClubCardLoadDeck(Cards),
		Index: ClubCardPlayer.length,
		Sleeve: "Default",
		Hand: [],
		Board: [],
		Level: 1,
		Money: 5,
		Fame: 0
	};
	ClubCardPlayer.push(P);
	ClubCardPlayerDrawCard(P, (P.Index == ClubCardTurnIndex) ? 5 : 6);
}


/**
 * When a turn ends, we move to the next player
 * @param {boolean|null} Draw - If the end of turn was triggered by a draw
 * @returns {void} - Nothing
 */
function ClubCardEndTurn(Draw = false) {

	// Adds fame, money and run custom card scripts
	let CCPlayer = ClubCardPlayer[ClubCardTurnIndex];
	let Fame = 0;
	let Money = 0;
	let FameMoneyText = "";
	if (CCPlayer.Board != null)
		for (let Card of CCPlayer.Board) {
			if (Card.FamePerTurn != null) Fame = Fame + Card.FamePerTurn;
			if (Card.MoneyPerTurn != null) Money = Money + Card.MoneyPerTurn;
			if (Card.OnTurnEnd != null) Card.OnTurnEnd(CCPlayer);
		}
	ClubCardPlayerAddFame(CCPlayer, Fame);
	ClubCardPlayerAddMoney(CCPlayer, Money);
	FameMoneyText = ((Fame >= 0) ? "+" : "") + Fame.toString() + " Fame,  " + ((Money >= 0) ? "+" : "") + Money.toString() + " Money"

	// Adds an entry to the log
	ClubCardTurnEndDraw = Draw;
	if (Draw) {
		ClubCardLogAdd(TextGet((ClubCardTurnIndex == 0) ? "EndDrawPlayer" : "EndDrawOpponent").replace("FAMEMONEY", FameMoneyText));
		ClubCardPlayerDrawCard(ClubCardPlayer[ClubCardTurnIndex]);
	} else {
		ClubCardLogAdd(TextGet((ClubCardTurnIndex == 0) ? "EndTurnPlayer" : "EndTurnOpponent").replace("FAMEMONEY", FameMoneyText));
	}

	// Move to the next player
	ClubCardTurnIndex++;
	if (ClubCardTurnIndex >= ClubCardPlayer.length) ClubCardTurnIndex = 0;
	ClubCardTurnCardPlayed = 0;
	ClubCardAIStart();

}

/**
 * Returns the number of cards that can be played in one turn by a player TO DO
 * @param {ClubCardPlayer} CCPlayer - The club card player
 * @returns {Number} - The number of cards
 */
function ClubCardTurnPlayableCardCount(CCPlayer) {
	return 1;
}

/**
 * Returns TRUE if a specific card can be played by the player
 * @param {ClubCardPlayer} CCPlayer - The club card player
 * @param {ClubCard} Card - The card to play
 * @returns {boolean} - TRUE if the card can be played
 */
function ClubCardCanPlayCard(CCPlayer, Card) {
	if ((CCPlayer == null) || (Card == null) || (Card.Location == null)) return false;
	if ((CCPlayer.Index == 0) && (Card.Location != "PlayerHand")) return false;
	if ((CCPlayer.Index != 0) && (Card.Location != "OpponentHand")) return false;
	if ((CCPlayer.Board != null) && (CCPlayer.Level != null) && (CCPlayer.Board.length >= ClubCardLevelLimit[CCPlayer.Level])) return false;
	if ((Card.RequiredLevel != null) && (CCPlayer.Level != null) && (Card.RequiredLevel > CCPlayer.Level)) return;
	return true;
}

/**
 * When a player plays a card
 * @param {ClubCardPlayer} CCPlayer - The club card player
 * @param {ClubCard} Card - The card to play
 * @returns {void} - Nothing
 */
function ClubCardPlayCard(CCPlayer, Card) {
	let Text = TextGet("PlayACard");
	Text = Text.replace("PLAYERNAME", CharacterNickname(CCPlayer.Character));
	Text = Text.replace("CARDNAME", Card.Title);
	ClubCardLogAdd(Text);
	ClubCardTurnCardPlayed++;
	if (CCPlayer.Hand != null) {
		let Index = 0;
		for (let C of CCPlayer.Hand) {
			if (C.ID == Card.ID) {
				CCPlayer.Board.push(Card);
				CCPlayer.Hand.splice(Index, 1);
				Card.Location = "Board";
			}
			Index++;
		}
	}
	if (Card.OnBoardEntry != null) Card.OnBoardEntry(CCPlayer);
	if (ClubCardTurnCardPlayed >= ClubCardTurnPlayableCardCount(CCPlayer)) ClubCardEndTurn();
}

/**
 * When the AI plays it's move
 * @returns {void} - Nothing
 */
function ClubCardAIPlay() {
	ClubCardEndTurn(true);
}

/**
 * When starts it's turn
 * @returns {void} - Nothing
 */
function ClubCardAIStart() {
	if (ClubCardPlayer[ClubCardTurnIndex].Control == "AI")
		setTimeout(ClubCardAIPlay, 2000);
}

/**
 * When a player concedes the game TO DO
 * @returns {void} - Nothing
 */
function ClubCardConcede() {
}

/**
 * Prepares the card titles, texts and initialize the log if needed
 * @returns {void} - Nothing
 */
function ClubCardLoadCaption() {
	if ((ClubCardList[0].Title == null) && (TextGet("Title Kinky Neighbor") != "")) {
		for (let Card of ClubCardList) {
			Card.Title = TextGet("Title " + Card.Name);
			Card.Text = TextGet("Text " + Card.Name);
		}
		for (let P of ClubCardPlayer) {
			for (let Card of P.Hand) {
				Card.Title = TextGet("Title " + Card.Name);
				Card.Text = TextGet("Text " + Card.Name);
			}
			for (let Card of P.Board) {
				Card.Title = TextGet("Title " + Card.Name);
				Card.Text = TextGet("Text " + Card.Name);
			}
			for (let Card of P.Deck) {
				Card.Title = TextGet("Title " + Card.Name);
				Card.Text = TextGet("Text " + Card.Name);
			}
			for (let Card of P.FullDeck) {
				Card.Title = TextGet("Title " + Card.Name);
				Card.Text = TextGet("Text " + Card.Name);
			}
		}
		ClubCardLogAdd(TextGet("Start" + ((ClubCardTurnIndex == 0) ? "Player" : "Opponent")));
	}
}

/**
 * Loads the club card mini-game: Assigns the opponents and draws the cards
 * @returns {void} - Nothing
 */
function ClubCardLoad() {
	ClubCardFirstTurn = true;
	ClubCardTurnCardPlayed = 0;
	ClubCardLogText = "";
	ClubCardLogScroll = false;
	ClubCardLog = [];
	ClubCardTurnIndex = Math.floor(Math.random() * 2);
	ClubCardPlayer = [];
	ClubCardAddPlayer(Player, "Player", ClubCardDefaultDeck.Cards);
	ClubCardAddPlayer(ClubCardOpponent, "AI", ClubCardDefaultDeck.Cards);
	ClubCardAIStart();
}

/**
 * Draw the club card player hand on screen, show only sleeves if not controlled by player
 * @param {Number} Value - The card to draw
 * @param {number} X - The X on screen position
 * @param {number} Y - The Y on screen position
 * @param {number} W - The width of the card
 * @param {string} Image - The buble 
 * @returns {Number} - The next bubble Y position
 */
function ClubCardRenderBubble(Value, X, Y, W, Image) {
	DrawImageResize("Screens/MiniGame/ClubCard/Bubble/" + Image + ".png", X, Y - W / 20, W, W);
	DrawTextWrap(Value.toString(), X, Y, W, W, "Black");
	return Y + W * 1.5;
}

/**
 * Returns the text description of all groups, separated by commas
 * @param {Array} Group - The card to draw
 * @returns {string} - The
 */
function ClubCardGetGroupText(Group) {
	if ((Group == null) || (Group.length == 0)) return "";
	let Text = "";
	for (let G of Group)
		Text = Text + ((Text == "") ? "" : ", ") + TextGet("Group" + G);
	return Text;
}

/**
 * Draw the club card player hand on screen, show only sleeves if not controlled by player
 * @param {ClubCard|Number} Card - The card to draw
 * @param {number} X - The X on screen position
 * @param {number} Y - The Y on screen position
 * @param {number} W - The width of the card
 * @param {string|null} Sleeve - The sleeve image to draw instead of the card
 * @param {string|null} Source - The source from where it's called
 * @returns {void} - Nothing
 */
function ClubCardRenderCard(Card, X, Y, W, Sleeve = null, Source = null) {

	// Make sure the card object is valid, find it in the list if possible
	if (Card == null) return;
	if (typeof Card === "number") {
		for (let C of ClubCardList) {
			if (C.ID == Card) {
				Card = C;
				break;
			}
		}
	}
	if (typeof Card !== "object") return;

	// Draw the sleeved version if required
	if (Sleeve != null) {
		DrawImageResize("Screens/MiniGame/ClubCard/Sleeve/" + Sleeve + ".png", X, Y, W, W * 2);
		return;
	}

	// Keeps the hover card
	if (MouseIn(X, Y, W, W * 2)) {
		ClubCardHover = {...Card};
		ClubCardHover.Location = Source;
	}

	// Gets the text and frame color
	let Level = ((Card.RequiredLevel == null) || (Card.RequiredLevel <= 1)) ? 1 : Card.RequiredLevel;
	let Color = ClubCardColor[(Card.Unique == true) ? 6 : Level];

	// Draw the images and texts on the screen
	DrawImageResize("Screens/MiniGame/ClubCard/Frame/Member" + ((Card.Unique == true) ? "6" : Level.toString()) + ".png", X, Y, W, W * 2);
	DrawImageResize("Screens/MiniGame/ClubCard/Card/" + Card.Name + ".png", X + W * 0.05, Y + W * 0.18, W * 0.9, W * 1.8);
	MainCanvas.font = "bold " + Math.round(W / 12) + "px arial";
	DrawTextWrap(Card.Title, X + W * 0.05, Y + W * 0.05, W * 0.9, W * 0.1, "Black");
	let BubblePos = Y + W * 0.2;
	if (Level > 1) BubblePos = ClubCardRenderBubble(Level, X + W * 0.05, BubblePos, W * 0.1, "Level");
	if (Card.FamePerTurn != null) BubblePos = ClubCardRenderBubble(Card.FamePerTurn, X + W * 0.05, BubblePos, W * 0.1, "Fame");
	if (Card.MoneyPerTurn != null) BubblePos = ClubCardRenderBubble(Card.MoneyPerTurn, X + W * 0.05, BubblePos, W * 0.1, "Money");
	if (Card.Text != null) {
		DrawRect(X + W * 0.05, Y + W * 1.5, W * 0.9, W * 0.48, Color + "A0");
		let GroupText = ClubCardGetGroupText(Card.Group);
		if (GroupText != "") {
			MainCanvas.font = "bold " + Math.round(W / 16) + "px arial";
			DrawTextWrap(GroupText, X + W * 0.05, Y + W * 1.5, W * 0.9, W * 0.1, "Black");
			MainCanvas.font = ((Card.Text.startsWith("<F>")) ? "italic " : "bold") + Math.round(W / 12) + "px arial";
			DrawTextWrap(Card.Text.replace("<F>", ""), X + W * 0.05, Y + W * 1.6, W * 0.9, W * 0.38, "Black", null, null, Math.round(W / 20));
		}
		else {
			MainCanvas.font = ((Card.Text.startsWith("<F>")) ? "italic " : "bold") + Math.round(W / 12) + "px arial";
			DrawTextWrap(Card.Text.replace("<F>", ""), X + W * 0.05, Y + W * 1.5, W * 0.9, W * 0.48, "Black", null, null, Math.round(W / 20));
		}
	}
	MainCanvas.font = CommonGetFont(36);

}

/**
 * Draw the club card player board on screen
 * @param {Object} CCPlayer - The club card player that draws the cards
 * @param {number} X - The X on screen position
 * @param {number} Y - The Y on screen position
 * @param {number} W - The width of the game board
 * @param {number} H - The height of the game board
 * @param {number} TextY - The Y on screen position of the text
 * @returns {void} - Nothing
 */
function ClubCardRenderBoard(CCPlayer, X, Y, W, H, TextY) {

	// Draws the money, fame and level
	MainCanvas.font = CommonGetFont(Math.round(H / 20));
	if (CCPlayer.Character != null) DrawTextWrap(CharacterNickname(CCPlayer.Character), X + W * 0.01, TextY + H * 0.01, W * 0.19, H * 0.1, "White");
	if (CCPlayer.Fame != null) DrawTextWrap(TextGet("Fame") + " " + CCPlayer.Fame, X + W * 0.21, TextY + H * 0.01, W * 0.19, H * 0.1, (CCPlayer.Fame >= 0) ? "White" : "Pink");
	if (CCPlayer.Money != null) DrawTextWrap(TextGet("Money") + " " + CCPlayer.Money, X + W * 0.61, TextY + H * 0.01, W * 0.19, H * 0.1, (CCPlayer.Money >= 0) ? "White" : "Pink");
	if (CCPlayer.Level != null) DrawTextWrap(TextGet("Level" + CCPlayer.Level) + " (" + CCPlayer.Board.length + " / " + ClubCardLevelLimit[CCPlayer.Level] + ")", X + W * 0.81, TextY + H * 0.01, W * 0.19, H * 0.1, ClubCardColor[CCPlayer.Level]);

	// Draws the played cards
	if ((CCPlayer == null) || (CCPlayer.Board == null)) return;
	let PosX = Math.round(X + (W / 2) - (CCPlayer.Board.length * W / 20));
	let IncX = Math.round(W / 10);
	if (PosX < X) {
		PosX = X;
		IncX = Math.round(W / CCPlayer.Hand.length);
	}
	for (let C of CCPlayer.Board) {
		ClubCardRenderCard(C, PosX + 5, Y + 5 + (H * 0.1), (W / 12) - 5);
		PosX = PosX + IncX;
	}

	// Puts a shadow over the board if not playing
	MainCanvas.font = CommonGetFont(36);
	if (CCPlayer.Index != ClubCardTurnIndex) DrawRect(X, Y, W, H, "#0000007F");
}

/**
 * Draw the club card player hand on screen, show only sleeves if not controlled by player
 * @param {ClubCardPlayer} CCPlayer - The club card player that draws it's hand
 * @param {number} X - The X on screen position
 * @param {number} Y - The Y on screen position
 * @param {number} W - The width of the game board
 * @param {number} H - The height of the game board
 * @returns {void} - Nothing
 */
function ClubCardRenderHand(CCPlayer, X, Y, W, H) {
	if ((CCPlayer == null) || (CCPlayer.Hand == null)) return;
	let PosX = Math.round(X + (W / 2) - (CCPlayer.Hand.length * W / 16));
	let IncX = Math.round(W / 8);
	if (PosX < X) {
		PosX = X;
		IncX = Math.round(W / CCPlayer.Hand.length);
	}
	for (let C of CCPlayer.Hand) {
		ClubCardRenderCard(C, PosX + 5, Y + 5 + (H * 0.1), (W / 10) - 5, (CCPlayer.Control == "Player") ? null : CCPlayer.Sleeve, (CCPlayer.Control == "Player") ? "PlayerHand" : "OpponentHand");
		PosX = PosX + IncX;
	}
}

/**
 * Renders the right side panel
 * @returns {void} - Nothing
 */
function ClubCardRenderPanel() {

	// Draws the focused card, panel and log
	DrawRect(1702, 0, 298, 1000, "#404040");
	DrawRect(1700, 0, 2, 1000, "White");
	if (ClubCardFocus != null) ClubCardRenderCard(ClubCardFocus, 1705, 5, 290);
	if (document.getElementById("CCLog") == null) {
		ElementCreateTextArea("CCLog");
		let Elem = document.getElementById("CCLog");
		Elem.style.backgroundColor = "#000000";
		Elem.style.color = "#FFFFFF";
	}
	ElementPositionFix("CCLog", 20, 1705, (ClubCardFocus == null) ? 10 : 600, 285, (ClubCardFocus == null) ? 830 : 240);
	ElementValue("CCLog", ClubCardLogText);
	if (ClubCardLogScroll) {
		ElementScrollToEnd("CCLog");
		ClubCardLogScroll = false;
	}
	
	// Draw the bottom butttons and texts
	if (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") {
		DrawButton(1725, 860, 250, 60, TextGet("EndDraw"), "White");
		DrawButton(1725, 930, 250, 60, TextGet("Concede"), "White");
		if (ClubCardCanPlayCard(ClubCardPlayer[ClubCardTurnIndex], ClubCardFocus)) DrawButton(1725, 300, 250, 60, TextGet("PlayCard"), "White");
	} else {
		DrawTextWrap(TextGet("OpponentPlaying"), 1735, 870, 250, 100, "White");
	}

}

/**
 * Runs the club card game, draws all the controls
 * @returns {void} - Nothing
 */
function ClubCardRun() {
	ClubCardHover = null;
	ClubCardLoadCaption()
	ClubCardRenderBoard(ClubCardPlayer[0], 0, 500, 1700, 500, 500);
	ClubCardRenderBoard(ClubCardPlayer[1], 0, 0, 1700, 500, 440);
	DrawRect(0, 499, 1700, 2, "White");
	ClubCardRenderHand(ClubCardPlayer[0], 0, 800, 1700, 300);
	ClubCardRenderHand(ClubCardPlayer[1], 0, -250, 1700, 300);
	ClubCardRenderPanel();
	if ((ClubCardPlayer[ClubCardTurnIndex].Control == "Player") && (ClubCardPlayer[ClubCardTurnIndex].Level < ClubCardLevelCost.length - 1) && (ClubCardPlayer[ClubCardTurnIndex].Money >= ClubCardLevelCost[ClubCardPlayer[ClubCardTurnIndex].Level + 1])) DrawButton(1390, 435, 300, 60, TextGet("UpgradeToLevel" + (ClubCardPlayer[ClubCardTurnIndex].Level + 1).toString()).replace("MONEY", ClubCardLevelCost[ClubCardPlayer[ClubCardTurnIndex].Level + 1].toString()), "White");
}

/**
 * Handles clicks during the club card game
 * @returns {void} - Nothing
 */
function ClubCardClick() {
	if (MouseIn(1725, 300, 250, 60) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") && ClubCardCanPlayCard(ClubCardPlayer[ClubCardTurnIndex], ClubCardFocus)) return ClubCardPlayCard(ClubCardPlayer[ClubCardTurnIndex], ClubCardFocus);
	if (MouseIn(1700, 0, 300, 600) && (ClubCardFocus != null)) return ClubCardFocus = null;
	if (MouseIn(1725, 860, 250, 60) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player")) return ClubCardEndTurn(true);
	if (MouseIn(1725, 930, 250, 60) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player")) return ClubCardConcede();
	if (MouseIn(1390, 435, 300, 60) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") && (ClubCardPlayer[ClubCardTurnIndex].Level < ClubCardLevelCost.length - 1) && (ClubCardPlayer[ClubCardTurnIndex].Money >= ClubCardLevelCost[ClubCardPlayer[ClubCardTurnIndex].Level + 1])) return ClubCardUpgradeLevel(ClubCardPlayer[ClubCardTurnIndex]);
	if (ClubCardHover != null) return ClubCardFocus = {...ClubCardHover};
}