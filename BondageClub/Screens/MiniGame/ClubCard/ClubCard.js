"use strict";
var ClubCardBackground = "ClubCardPlayBoard1";
var ClubCardLog = [];
var ClubCardLogText = "";
var ClubCardLogScroll = false;
var ClubCardColor = ["#808080", "#FFFFFF", "#E0E0E0", "#D0FFD0", "#D0D0FF", "#FFD0D0", "#FFE080"];
var ClubCardOpponent = null;
var ClubCardHover = null;
var ClubCardFocus = null;
var ClubCardTextCache = null;
var ClubCardTurnIndex = 0;
var ClubCardTurnCardPlayed = 0;
var ClubCardTurnEndDraw = false;
var ClubCardFameGoal = 100;
var ClubCardPopup = null;
var ClubCardLevelLimit = [0, 5, 8, 13, 20, 40];
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
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Cute Girl Next Door")) ClubCardPlayerAddMoney(CCPlayer, 2);
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
		MoneyPerTurn: 2,
		FamePerTurn: 3,
		RequiredLevel: 5
	},
	{
		ID: 1009,
		Name: "Gambler",
		MoneyPerTurn: 1,
		OnPlay: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 4);
		}
	},
	{
		ID: 1010,
		Name: "Red Twin",
		MoneyPerTurn: 1,
		RequiredLevel: 2
	},
	{
		ID: 1011,
		Name: "Blue Twin",
		MoneyPerTurn: 1,
		RequiredLevel: 2,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Red Twin")) ClubCardPlayerAddFame(CCPlayer, 4);
		}
	},
	{
		ID: 1012,
		Name: "Rope Bunny",
		MoneyPerTurn: 1,
		RequiredLevel: 2,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Dominant")) ClubCardPlayerAddMoney(CCPlayer, 2);
		}
	},
	{
		ID: 1013,
		Name: "Shy Submissive",
		MoneyPerTurn: 2,
		OnTurnEnd: function(CCPlayer) {
			if ((CCPlayer.Board != null) && (CCPlayer.Board.length >= 7)) ClubCardRemoveFromBoard(CCPlayer.Board, this);
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
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Tourist")) ClubCardPlayerAddMoney(CCPlayer, 1);
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
		RequiredLevel: 2
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
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Pusher")) ClubCardPlayerAddMoney(CCPlayer, 3);
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Police")) ClubCardRemoveFromBoard(CCPlayer.Board, this);
		}
	},
	{
		ID: 3003,
		Name: "Zealous Cop",
		Group: ["Liability", "Police"],
		RequiredLevel: 2,
		MoneyPerTurn: -1,
		FamePerTurn: -1
	},
	{
		ID: 3004,
		Name: "Gangster",
		Group: ["Criminal"],
		MoneyPerTurn: 3,
		FamePerTurn: -2,
		RequiredLevel: 3,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Criminal") * 2);
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Police")) ClubCardRemoveFromBoard(CCPlayer.Board, this);
		}
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
		Name: "Diaper Lover",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "ABDLBaby"));
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
		Name: "Feet Worshiper",
		Group: ["Fetishist"],
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "PornActress") || ClubCardGroupIsOnBoard(CCPlayer.Board, "ABDLMommy"))
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
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Dominant"));
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Mistress") * 2);
		}
	},
	{
		ID: 4006,
		Name: "Porn Addict",
		Group: ["Fetishist"],
		MoneyPerTurn: 1,
		FamePerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "PornActress"));
		}
	},

	// 5000 - Porn Members (Raise both Fame and Money)
	{
		ID: 5000,
		Name: "Porn Amateur",
		Group: ["PornActress"],
		MoneyPerTurn: 1
	},
	{
		ID: 5001,
		Name: "Porn Movie Director",
		RequiredLevel: 2,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "PornActress"));
			ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "PornActress"));
		}
	},
	{
		ID: 5002,
		Name: "Porn Lesbian",
		Group: ["PornActress"],
		MoneyPerTurn: 1,
		FamePerTurn: 1,
		RequiredLevel: 3,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupOnBoardCount(CCPlayer.Board, "PornActress") >= 2)
				ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 5003,
		Name: "Porn Veteran",
		Group: ["PornActress"],
		MoneyPerTurn: 1,
		FamePerTurn: 2,
		RequiredLevel: 4
	},
	{
		ID: 5004,
		Name: "Porn Star",
		Group: ["PornActress"],
		MoneyPerTurn: 1,
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
		FamePerTurn: 3,
		RequiredLevel: 4,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Maid") - 1);
		}
	},

	// 7000 - Asylum Patient and Nurse Members (Synergies between each other)
	{
		ID: 7000,
		Name: "Curious Patient",
		Group: ["AsylumPatient"],
		MoneyPerTurn: 1
	},
	{
		ID: 7001,
		Name: "Part-Time Patient",
		Group: ["AsylumPatient"],
		OnPlay: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 6);
		}
	},
	{
		ID: 7002,
		Name: "Rookie Nurse",
		Group: ["AsylumNurse"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "AsylumPatient"));
		}
	},
	{
		ID: 7003,
		Name: "Commited Patient",
		Group: ["AsylumPatient"],
		MoneyPerTurn: 2,
		RequiredLevel: 2
	},
	{
		ID: 7004,
		Name: "Veteran Nurse",
		Group: ["AsylumNurse"],
		RequiredLevel: 3,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "AsylumPatient") * 2);
		}
	},
	{
		ID: 7005,
		Name: "Permanent Patient",
		Group: ["AsylumPatient"],
		MoneyPerTurn: 3,
		RequiredLevel: 4
	},
	{
		ID: 7006,
		Name: "Doctor",
		Group: ["AsylumNurse"],
		RequiredLevel: 5,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "AsylumPatient") * 3);
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
		MoneyPerTurn: -4
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
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "PornActress") * -2);
		}
	},
	{
		ID: 9007,
		Name: "Pandora Infiltrator",
		Group: ["Liability"],
		FamePerTurn: -3,
		RequiredLevel: 3
	},
	{
		ID: 9008,
		Name: "Uncontrollable Sub",
		Group: ["Liability"],
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Dominant") * -1);
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Mistress") * -1);
		}
	},

	// 10000 - ABDL Members (Mostly gives Money)
	{
		ID: 10000,
		Name: "Baby Girl",
		Group: ["ABDLBaby"],
		MoneyPerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "ABDLMommy")) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 10001,
		Name: "Caring Mother",
		Group: ["ABDLMommy"],
		MoneyPerTurn: 1
	},
	{
		ID: 10002,
		Name: "Diaper Baby",
		Group: ["ABDLBaby"],
		RequiredLevel: 2,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Maid")) ClubCardPlayerAddMoney(CCPlayer, 3);
		}
	},
	{
		ID: 10003,
		Name: "Sugar Baby",
		Group: ["ABDLBaby"],
		RequiredLevel: 4,
		MoneyPerTurn: 4
	},
	{
		ID: 10004,
		Name: "Babysitter",
		Group: ["ABDLMommy", "Staff"],
		RequiredLevel: 2,
		MoneyPerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "ABDLBaby") * 2);
		}
	},
	{
		ID: 10005,
		Name: "Soap Opera Mother",
		Group: ["ABDLMommy"],
		RequiredLevel: 5,
		OnPlay: function(CCPlayer) {
			if (ClubCardGroupIsOnBoard(CCPlayer.Board, "ABDLBaby")) {
				ClubCardPlayerAddMoney(CCPlayer, -25);
				ClubCardPlayerAddFame(CCPlayer, 25);
			}
		}
	},

	// 11000 - College Members (Mostly gives Fame, give bonuses/maluses between each other)
	{
		ID: 11000,
		Name: "Amanda",
		Group: ["CollegeStudent"],
		Unique: true,
		FamePerTurn: 1
	},
	{
		ID: 11001,
		Name: "Sarah",
		Group: ["CollegeStudent"],
		Unique: true,
		FamePerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Amanda")) ClubCardPlayerAddFame(CCPlayer, 2);
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Sidney")) ClubCardPlayerAddFame(CCPlayer, -2);
		}
	},
	{
		ID: 11002,
		Name: "Sidney",
		Group: ["CollegeStudent"],
		Unique: true,
		FamePerTurn: 1
	},
	{
		ID: 11003,
		Name: "Jennifer",
		Group: ["CollegeStudent"],
		Unique: true,
		FamePerTurn: 1
		// Remove one of your current member on entry
	},
	{
		ID: 11004,
		Name: "College Freshwoman",
		Group: ["CollegeStudent"],
		FamePerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Yuki")) ClubCardPlayerAddFame(CCPlayer, 1);
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Julia")) ClubCardPlayerAddFame(CCPlayer, 1);
		}
	},
	{
		ID: 11005,
		Name: "College Nerd",
		Group: ["CollegeStudent"],
		FamePerTurn: 1,
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Yuki")) ClubCardPlayerAddMoney(CCPlayer, 1);
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Julia")) ClubCardPlayerAddMoney(CCPlayer, 1);
		}
	},
	{
		ID: 11006,
		Name: "College Hidden Genius",
		Group: ["CollegeStudent"],
		OnTurnEnd: function(CCPlayer) {
			if (ClubCardNameIsOnBoard(CCPlayer.Board, "Mildred")) ClubCardPlayerAddFame(CCPlayer, 5);
		}
	},
	{
		ID: 11007,
		Name: "Substitute Teacher",
		Group: ["CollegeTeacher"],
		MoneyPerTurn: -1,
		OnTurnEnd: function(CCPlayer) {
			ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "CollegeStudent"));
		}
	},
	{
		ID: 11008,
		Name: "Julia",
		Group: ["CollegeTeacher"],
		Unique: true,
		RequiredLevel: 2,
		FamePerTurn: 2
	},
	{
		ID: 11009,
		Name: "Yuki",
		Group: ["CollegeTeacher"],
		Unique: true,
		RequiredLevel: 3,
		FamePerTurn: 2,
		MoneyPerTurn: 1,
	},
	{
		ID: 11010,
		Name: "Mildred",
		Group: ["CollegeTeacher"],
		Unique: true,
		RequiredLevel: 4,
		FamePerTurn: 3,
	},

	// Event cards
	{
		ID: 30000,
		Name: "Scratch and Win",
		Type: "Event",
		OnPlay: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 7);
		}
	},
	{
		ID: 30001,
		Name: "Kinky Garage Sale",
		Type: "Event",
		RequiredLevel: 2,
		OnPlay: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 12);
		}
	},
	{
		ID: 30002,
		Name: "Second Mortgage",
		Type: "Event",
		RequiredLevel: 3,
		OnPlay: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 20);
		}
	},
	{
		ID: 30003,
		Name: "Foreign Investment",
		Type: "Event",
		RequiredLevel: 4,
		OnPlay: function(CCPlayer) {
			ClubCardPlayerAddMoney(CCPlayer, 30);
		}
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
 * Creates a popop in the middle of the board that pauses the game
 * @param {string} Mode - The popup mode "DECK", "TEXT" or "YESNO"
 * @param {string|null} Text - The text to display
 * @param {string|null} Button1 - The label of the first button
 * @param {string|null} Button2 - The label of the second button
 * @param {string|null} Function1 - The function of the first button
 * @param {string|null} Function2 - The function of the second button
 * @returns {void} - Nothing
 */
function ClubCardCreatePopup(Mode, Text = null, Button1 = null, Button2 = null, Function1 = null, Function2 = null) {
	ClubCardPopup = {
		Mode: Mode,
		Text: Text,
		Button1: Button1,
		Button2: Button2,
		Function1: Function1,
		Function2: Function2
	};
}

/**
 * Destroys the current popup
 * @returns {void} - Nothing
 */
function ClubCardDestroyPopup() {
	ClubCardPopup = null;
}

/**
 * Returns TRUE if the card is a liability (should be played on the opponent side)
 * @param {ClubCard} Card - The card to evaluate
 * @returns {boolean} - TRUE if the card is a liability
 */
function ClubCardIsLiability(Card) {
	return ((Card != null) && (Card.Group != null) && (Card.Group.indexOf("Liability") >= 0));
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
 * Removes all cards that belong to a group (ex: Liability) from a board
 * @param {Array} Board - The board on which to remove the card
 * @param {String} GroupName - The group name to remove
 * @returns {void} - Nothing
 */
function ClubCardRemoveGroupFromBoard(Board, GroupName) {
	if (Board == null) return;
	for (let C of Board)
		if (C.Group != null)
			for (let Pos = 0; Pos < C.Group.length; Pos++)
				if (C.Group[Pos] == GroupName) {
					Board = Board.splice(Pos, 1);
					break;
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
 * Sets the glowing border for a card
 * @param {ClubCard} Card - The card that must glow
 * @param {string} Color - The color of the glow
 * @returns {void} - Nothing
 */
function ClubCardSetGlow(Card, Color) {
	Card.GlowTimer = CommonTime() + 10000;
	Card.GlowColor = Color;
}

/**
 * Draw cards from the player deck into it's hand
 * @param {ClubCardPlayer} CCPlayer - The club card player that draws the cards
 * @param {number|null} Amount - The amount of cards to draw, 1 if null
 * @returns {void} - Nothing
 */
function ClubCardPlayerDrawCard(CCPlayer, Amount = null) {
	if ((CCPlayer == null) || (CCPlayer.Deck == null) || (CCPlayer.Hand == null)) return;
	if (Amount == null) Amount = ClubCardDrawCardCount(CCPlayer);
	let FocusCard = ((CCPlayer.Index == 0) && (Amount == 1));
	while (Amount > 0) {
		if (CCPlayer.Deck.length > 0) {
			if (FocusCard) {
				ClubCardFocus = CCPlayer.Deck[0];
				ClubCardSetGlow(ClubCardFocus, "#00FFFF");
			}
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
 * Builds a deck array of object from a deck array of numbers
 * @param {number} DeckNum - The array of number deck
 * @returns {void} - The resulting deck
 */
function ClubCardLoadDeckNumber(DeckNum) {

	// Invalid decks cannot be loaded, we get the default one if that's the case
	let Deck = [];
	if ((Player.Game.ClubCard.Deck.length <= DeckNum) || (Player.Game.ClubCard.Deck[DeckNum].length != ClubCardBuilderDeckSize)) {
		ClubCardLogAdd(TextGet("NoValidDeckFound").replace("DECKNUMBER", (DeckNum + 1).toString()));
		Deck = ClubCardBuilderDefaultDeck.slice();
	} else {
		ClubCardLogAdd(TextGet("UsingDeck").replace("DECKNUMBER", (DeckNum + 1).toString()));
		for (let Index = 0; Index < ClubCardBuilderDeckSize; Index++)
			Deck.push(Player.Game.ClubCard.Deck[DeckNum].charCodeAt(Index));
	}

	// Loads the deck and shuffles it
	ClubCardPlayer[0].Deck = ClubCardShuffle(ClubCardLoadDeck(Deck));
	ClubCardPlayer[0].FullDeck = ClubCardLoadDeck(Deck);

	// Starts the game with the loaded deck
	ClubCardLogAdd(ClubCardTextGet("Start" + ((ClubCardTurnIndex == 0) ? "Player" : "Opponent")));
	ClubCardPlayerDrawCard(ClubCardPlayer[0], (ClubCardTurnIndex == 0) ? 5 : 6);
	ClubCardPlayerDrawCard(ClubCardPlayer[1], (ClubCardTurnIndex == 1) ? 5 : 6);
	ClubCardDestroyPopup();
	ClubCardAIStart();

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
}

/**
 * When a turn ends, we move to the next player
 * @param {boolean|null} Draw - If the end of turn was triggered by a draw
 * @returns {void} - Nothing
 */
function ClubCardEndTurn(Draw = false) {

	// Adds fame, money and run custom card scripts
	let CCPlayer = ClubCardPlayer[ClubCardTurnIndex];
	let StartingFame = CCPlayer.Fame;
	let StartingMoney = CCPlayer.Money;
	let FameMoneyText = "";
	if (CCPlayer.Board != null)
		for (let Card of CCPlayer.Board) {
			if (Card.FamePerTurn != null) ClubCardPlayerAddFame(CCPlayer, Card.FamePerTurn);
			if (Card.MoneyPerTurn != null) ClubCardPlayerAddMoney(CCPlayer, Card.MoneyPerTurn);
			if (Card.OnTurnEnd != null) Card.OnTurnEnd(CCPlayer);
		}
	if ((CCPlayer.Money < 0) && (CCPlayer.Fame > StartingFame)) CCPlayer.Fame = StartingFame;
	CCPlayer.LastFamePerTurn = CCPlayer.Fame - StartingFame;
	CCPlayer.LastMoneyPerTurn = CCPlayer.Money - StartingMoney;
	FameMoneyText = ((CCPlayer.LastFamePerTurn >= 0) ? "+" : "") + CCPlayer.LastFamePerTurn.toString() + " Fame,  " + ((CCPlayer.LastMoneyPerTurn >= 0) ? "+" : "") + CCPlayer.LastMoneyPerTurn.toString() + " Money";

	// If that player wins the game from Fame gain
	if (CCPlayer.Fame >= ClubCardFameGoal) {
		MiniGameVictory = (CCPlayer.Control == "Player");
		MiniGameEnded = true;
		ClubCardLogAdd(TextGet("VictoryFor" + CCPlayer.Control));
		ClubCardCreatePopup("TEXT", TextGet("VictoryFor" + CCPlayer.Control), TextGet("Return"), null, "ClubCardEndGame()", null);
		return;
	}

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
 * Returns the number of cards that can be played in one turn by a player
 * @param {ClubCardPlayer} CCPlayer - The club card player
 * @returns {Number} - The number of cards
 */
function ClubCardTurnPlayableCardCount(CCPlayer) {
	if ((CCPlayer == null) || (CCPlayer.Board == null)) return 1;
	let Count = 1;
	for (let Card of CCPlayer.Board)
		if (Card.ExtraPlay != null)
			Count = Count + Card.ExtraPlay;
	if (Count < 1) Count = 1;
	return Count;
}

/**
 * Returns the number of cards that will be drawn when the player choses to draw instead of playing
 * @param {ClubCardPlayer} CCPlayer - The club card player
 * @returns {Number} - The number of cards to draw
 */
function ClubCardDrawCardCount(CCPlayer) {
	if ((CCPlayer == null) || (CCPlayer.Board == null)) return 1;
	let Count = 1;
	for (let Card of CCPlayer.Board)
		if (Card.ExtraDraw != null)
			Count = Count + Card.ExtraDraw;
	if (Count < 1) Count = 1;
	return Count;
}

/**
 * Returns the player that will be the target of a card.  Liability cards are played on the other side.
 * @param {ClubCard} Card - The card to play
 * @returns {ClubCardPlayer} - The target player
 */
function ClubCardFindTarget(Card) {
	if (ClubCardIsLiability(Card))
		return (ClubCardTurnIndex == 0) ? ClubCardPlayer[1] : ClubCardPlayer[0];
	else
		return ClubCardPlayer[ClubCardTurnIndex];
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
	let Target = ClubCardFindTarget(Card);
	if ((Target.Board != null) && (Card.Type == "Member") && (Target.Level != null) && (Target.Board.length >= ClubCardLevelLimit[Target.Level])) return false;
	if ((Card.RequiredLevel != null) && (Target.Level != null) && (Card.RequiredLevel > Target.Level)) return false;
	return true;
}

/**
 * When a player plays a card
 * @param {ClubCardPlayer} CCPlayer - The club card player
 * @param {ClubCard} Card - The card to play
 * @returns {void} - Nothing
 */
function ClubCardPlayCard(CCPlayer, Card) {

	// Sets the log text, different for a liability card
	let Target = ClubCardFindTarget(Card);
	let Text = TextGet(ClubCardIsLiability(Card) ? "PlayACardOpponentBoard" : "PlayACard");
	Text = Text.replace("PLAYERNAME", CharacterNickname(CCPlayer.Character));
	Text = Text.replace("CARDNAME", Card.Title);
	ClubCardLogAdd(Text);
	ClubCardTurnCardPlayed++;

	// Plays the card
	if (CCPlayer.Hand != null) {
		let Index = 0;
		for (let C of CCPlayer.Hand) {
			if (C.ID == Card.ID) {
				if (Card.Type == "Member") Target.Board.push(Card);
				CCPlayer.Hand.splice(Index, 1);
				Card.Location = "Board";
				ClubCardSetGlow(Card, (ClubCardTurnIndex == 0) ? "#FFFF00" : "#FF0000");
			}
			Index++;
		}
	}

	// Focuses on the card, runs it's scripts and end the turn if needed
	ClubCardFocus = Card;
	if (Card.OnPlay != null) Card.OnPlay(CCPlayer);
	if (ClubCardTurnCardPlayed >= ClubCardTurnPlayableCardCount(CCPlayer)) return ClubCardEndTurn();

	// If that player can play more than one card per turn, we announce it
	Text = TextGet("PlayAnotherCard");
	Text = Text.replace("PLAYERNAME", CharacterNickname(CCPlayer.Character));
	ClubCardLogAdd(Text);
	ClubCardAIStart();

}

/**
 * When the AI plays it's move
 * @returns {void} - Nothing
 */
function ClubCardAIPlay() {

	// Make sure the current player is an AI
	let CCPlayer = ClubCardPlayer[ClubCardTurnIndex];
	if (CCPlayer.Control != "AI") return;

	// If the AI can upgrade, there's a 50/50 odds he does it
	if ((Math.random() >= 0.5) && (CCPlayer.Level < ClubCardLevelCost.length - 1) && (CCPlayer.Money >= ClubCardLevelCost[CCPlayer.Level + 1]))
		return ClubCardUpgradeLevel(CCPlayer);

	// Builds an array of all valid cards
	let ValidCards = [];
	if (CCPlayer.Hand != null)
		for (let Card of CCPlayer.Hand) {
			Card.Location = "OpponentHand";
			if (ClubCardCanPlayCard(CCPlayer, Card))
				ValidCards.push(Card);
		}

	// If we have valid cards, we play one at random
	if (ValidCards.length > 0)
		return ClubCardPlayCard(CCPlayer, CommonRandomItemFromList(null, ValidCards));

	// If nothing can be played and money or fame is going negative, the computer can go bankrupt
	if ((CCPlayer.LastMoneyPerTurn != null) && (CCPlayer.LastFamePerTurn != null) && (CCPlayer.LastMoneyPerTurn + CCPlayer.LastFamePerTurn <= 0) && (100 - CCPlayer.Money - CCPlayer.Fame > Math.random() * 100))
		return ClubCardBankrupt();

	// Since nothing could be done, we end the turn by skipping
	ClubCardEndTurn(true);

}

/**
 * When the opponent (AI) starts it's turn, gives 3 seconds before it's move
 * @returns {void} - Nothing
 */
function ClubCardAIStart() {
	if (!MiniGameEnded && ClubCardPlayer[ClubCardTurnIndex].Control == "AI")
		setTimeout(ClubCardAIPlay, 3000);
}

/**
 * When a player concedes the game
 * @returns {void} - Nothing
 */
function ClubCardConcede() {
	ClubCardDestroyPopup();
	ClubCardEndGame(false);
}

/**
 * When a player goes bankrupt, she restarts her club from scratch, draws 5 new cards and ends her turn
 * @returns {void} - Nothing
 */
function ClubCardBankrupt() {

	// Resets that player game & board
	let CCPlayer = ClubCardPlayer[ClubCardTurnIndex];
	CCPlayer.Money = 5;
	CCPlayer.Fame = 0;
	CCPlayer.Board = [];
	CCPlayer.Hand = [];
	CCPlayer.Deck = ClubCardShuffle(CCPlayer.FullDeck.slice());
	ClubCardPlayerDrawCard(CCPlayer, 5);

	// The opponent loses all liability cards on her board
	let Opponent = ClubCardPlayer[(ClubCardTurnIndex == 0) ? 1 : 0];
	ClubCardRemoveGroupFromBoard(Opponent.Board, "Liability");

	// Announces the bankrupty and jumps to the next turn
	ClubCardLogAdd(ClubCardTextGet("Bankrupt" + ((ClubCardTurnIndex == 0) ? "Player" : "Opponent")));
	ClubCardDestroyPopup();
	ClubCardEndTurn(false);

}

/**
 * When the game ends
 * @param {boolean} Victory - TRUE if the player is victorious
 * @returns {void} - Nothing
 */
function ClubCardEndGame(Victory) {
	ElementRemove("CCLog");
	MiniGameEnded = true;
	if (Victory != null) MiniGameVictory = Victory;
	MiniGameEnd();
}

function ClubCardTextGet(Text) {
	if(!ClubCardTextCache){
		const CardTextPath = "Screens/MiniGame/ClubCard/Text_ClubCard.csv";
		ClubCardTextCache = TextAllScreenCache.get(CardTextPath);
		if(!ClubCardTextCache){
			ClubCardTextCache = new TextCache(CardTextPath,"");
			TextAllScreenCache.set(CardTextPath, ClubCardTextCache);
		}
	}
	return ClubCardTextCache ? ClubCardTextCache.get(Text) : "";
}

/**
 * Prepares the card titles, texts and initialize the log if needed
 * @returns {void} - Nothing
 */
function ClubCardLoadCaption() {
	if ((ClubCardList[0].Title == null) && (ClubCardTextGet("Title Kinky Neighbor") != "")) {
		for (let Card of ClubCardBuilderList) {
			Card.Title = ClubCardTextGet("Title " + Card.Name);
			Card.Text = ClubCardTextGet("Text " + Card.Name);
		}
		for (let Card of ClubCardList) {
			Card.Title = ClubCardTextGet("Title " + Card.Name);
			Card.Text = ClubCardTextGet("Text " + Card.Name);
		}
		for (let P of ClubCardPlayer) {
			for (let Card of P.Hand) {
				Card.Title = ClubCardTextGet("Title " + Card.Name);
				Card.Text = ClubCardTextGet("Text " + Card.Name);
			}
			for (let Card of P.Board) {
				Card.Title = ClubCardTextGet("Title " + Card.Name);
				Card.Text = ClubCardTextGet("Text " + Card.Name);
			}
			for (let Card of P.Deck) {
				Card.Title = ClubCardTextGet("Title " + Card.Name);
				Card.Text = ClubCardTextGet("Text " + Card.Name);
			}
			for (let Card of P.FullDeck) {
				Card.Title = ClubCardTextGet("Title " + Card.Name);
				Card.Text = ClubCardTextGet("Text " + Card.Name);
			}
		}
	}
}

/**
 * Assigns the club card object if needed and loads the CSV file
 * @returns {void} - Nothing
 */
function ClubCardCommonLoad() {
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.ClubCard == null) Player.Game.ClubCard = { Deck: [] };
	ClubCardList[0].Title = null;
	CommonReadCSV("NoArravVar", "MiniGame", "ClubCard", "Text_ClubCard");
}

/**
 * Loads the club card mini-game: Assigns the opponents and draws the cards
 * @returns {void} - Nothing
 */
function ClubCardLoad() {
	ClubCardCommonLoad();
	ClubCardTurnCardPlayed = 0;
	ClubCardLogText = "";
	ClubCardFocus = null;
	ClubCardLogScroll = false;
	ClubCardLog = [];
	ClubCardTurnIndex = Math.floor(Math.random() * 2);
	ClubCardPlayer = [];
	ClubCardAddPlayer(Player, "Player", []);
	ClubCardAddPlayer(ClubCardOpponent, "AI", ClubCardBuilderDefaultDeck);
	ClubCardCreatePopup("DECK");
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
	if (Value != null) DrawTextWrap(Value.toString(), X, Y, W, W, "Black");
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
		Text = Text + ((Text == "") ? "" : ", ") + ClubCardTextGet("Group" + G);
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
	if (Card.Type == null) Card.Type = "Member";

	// Draw the images and texts on the screen
	DrawImageResize("Screens/MiniGame/ClubCard/Frame/" + Card.Type + ((Card.Unique == true) ? "6" : Level.toString()) + ".png", X, Y, W, W * 2);
	DrawImageResize("Screens/MiniGame/ClubCard/" + (Card.Type) + "/" + Card.Name + ".png", X + W * 0.05, Y + W * 0.16, W * 0.9, W * 1.8);
	MainCanvas.font = "bold " + Math.round(W / 12) + "px arial";
	DrawTextWrap(Card.Title, X + W * 0.05, Y + W * 0.05, W * 0.9, W * 0.1, "Black");
	let BubblePos = Y + W * 0.2;
	if (ClubCardIsLiability(Card)) BubblePos = ClubCardRenderBubble(null, X + W * 0.05, BubblePos, W * 0.1, "Liability");
	if (Level > 1) BubblePos = ClubCardRenderBubble(Level, X + W * 0.05, BubblePos, W * 0.1, "Level");
	if (Card.FamePerTurn != null) BubblePos = ClubCardRenderBubble(Card.FamePerTurn, X + W * 0.05, BubblePos, W * 0.1, "Fame");
	if (Card.MoneyPerTurn != null) BubblePos = ClubCardRenderBubble(Card.MoneyPerTurn, X + W * 0.05, BubblePos, W * 0.1, "Money");
	if (Card.Text != null) {
		DrawRect(X + W * 0.05, Y + W * 1.5, W * 0.9, W * 0.48, Color + "A0");
		let GroupText = ClubCardGetGroupText(Card.Group);
		if (GroupText != "") {
			MainCanvas.font = "bold " + Math.round(W / 16) + "px arial";
			DrawTextWrap(GroupText, X + W * 0.05, Y + W * 1.5, W * 0.925, W * 0.1, "Black");
			MainCanvas.font = ((Card.Text.startsWith("<F>")) ? "italic " : "bold") + Math.round(W / 12) + "px arial";
			DrawTextWrap(Card.Text.replace("<F>", ""), X + W * 0.05, Y + W * 1.6, W * 0.925, W * 0.38, "Black", null, null, Math.round(W / 20));
		}
		else {
			MainCanvas.font = ((Card.Text.startsWith("<F>")) ? "italic " : "bold") + Math.round(W / 12) + "px arial";
			DrawTextWrap(Card.Text.replace("<F>", ""), X + W * 0.05, Y + W * 1.5, W * 0.925, W * 0.48, "Black", null, null, Math.round(W / 20));
		}
	}
	MainCanvas.font = CommonGetFont(36);

	// If the card has a glowing border, we draw it
	let Time = CommonTime();
	if ((Card.GlowTimer != null) && (Card.GlowTimer > Time))
		DrawEmptyRect(X + (W * 0.005), Y + (W * 0.01), W - (W * 0.01), W * 2 - (W * 0.02), Card.GlowColor + Math.round((Card.GlowTimer - Time) / 40).toString(16), Math.round(W / 50));

}

/**
 * Draw the club card player board on screen
 * @param {Object} CCPlayer - The club card player that draws the cards
 * @param {number} X - The X on screen position
 * @param {number} Y - The Y on screen position
 * @param {number} W - The width of the game board
 * @param {number} H - The height of the game board
 * @param {boolean} Mirror - If the board should be rendered bottom to top
 * @returns {void} - Nothing
 */
function ClubCardRenderBoard(CCPlayer, X, Y, W, H, Mirror) {

	// Draws the money, fame and level
	MainCanvas.font = CommonGetFont(Math.round(H / 20));
	let TextY = Mirror ? Y + H * 0.895 : Y + H * 0.01;
	if (CCPlayer.Character != null) DrawTextWrap(CharacterNickname(CCPlayer.Character), X + W * 0.01, TextY, W * 0.19, H * 0.1, "White");
	if (CCPlayer.Fame != null) DrawTextWrap(TextGet("Fame") + " " + CCPlayer.Fame + (((CCPlayer.LastFamePerTurn != null) && (CCPlayer.LastFamePerTurn != 0)) ? " (" + ((CCPlayer.LastFamePerTurn > 0) ? "+" : "") + CCPlayer.LastFamePerTurn.toString() + ")" : ""), X + W * 0.21, TextY, W * 0.19, H * 0.1, (CCPlayer.Fame >= 0) ? "White" : "Pink");
	if (CCPlayer.Money != null) DrawTextWrap(TextGet("Money") + " " + CCPlayer.Money + (((CCPlayer.LastMoneyPerTurn != null) && (CCPlayer.LastMoneyPerTurn != 0)) ? " (" + ((CCPlayer.LastMoneyPerTurn > 0) ? "+" : "") + CCPlayer.LastMoneyPerTurn.toString() + ")" : ""), X + W * 0.61, TextY, W * 0.19, H * 0.1, (CCPlayer.Money >= 0) ? "White" : "Pink");
	if (CCPlayer.Level != null) DrawTextWrap(TextGet("Level" + CCPlayer.Level) + " (" + CCPlayer.Board.length + " / " + ClubCardLevelLimit[CCPlayer.Level] + ")", X + W * 0.81, TextY, W * 0.19, H * 0.1, ClubCardColor[CCPlayer.Level]);

	// Draws the played cards
	if ((CCPlayer == null) || (CCPlayer.Board == null)) return;
	let PosX = Math.round(X + (W / 2) - (CCPlayer.Board.length * W / 20));
	let IncX = Math.round(W / 10);
	if (PosX < X) {
		PosX = X;
		IncX = Math.round(W / CCPlayer.Board.length);
	}
	let Time = CommonTime();
	for (let C of CCPlayer.Board) {
		let PosY = Mirror ? Y + H - (H * 0.65) : Y + (H * 0.1);
		ClubCardRenderCard(C, PosX + 5, PosY, (W / 12) - 5);
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
 * Shows the status text on the bottom right
 * @param {string} Text - The status text to show
 * @returns {void} - Nothing
 */
function ClubCardStatusText(Text) {
	MainCanvas.font = CommonGetFont(32);
	DrawTextWrap(TextGet(Text), 1745, 900, 230, 100, "White");
	MainCanvas.font = CommonGetFont(36);
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
	ElementPositionFix("CCLog", 20, 1705, (ClubCardFocus == null) ? 10 : 600, 285, (ClubCardFocus == null) ? 880 : 290);
	ElementValue("CCLog", ClubCardLogText);
	if (ClubCardLogScroll) {
		ElementScrollToEnd("CCLog");
		ClubCardLogScroll = false;
	}

	// In deck popup mode
	if ((ClubCardPopup != null) && (ClubCardPopup.Mode == "DECK")) {
		ClubCardStatusText("SelectDeck");
		return;
	}

	// Draw the bottom butttons and texts
	if (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") {
		DrawButton(1905, 905, 90, 90, null, "White", "Screens/MiniGame/ClubCard/Button/Concede.png", TextGet("Concede"));
		DrawButton(1805, 905, 90, 90, null, "White", "Screens/MiniGame/ClubCard/Button/Bankrupt.png", TextGet("Bankrupt"));
		DrawButton(1705, 905, 90, 90, null, "White", "Screens/MiniGame/ClubCard/Button/Draw.png", TextGet("Draw"));
		if (ClubCardCanPlayCard(ClubCardPlayer[ClubCardTurnIndex], ClubCardFocus)) DrawButton(1725, 300, 250, 60, TextGet("PlayCard"), "White");
	} else ClubCardStatusText("OpponentPlaying");

}

/**
 * Renders the popup on the top of the game board
 * @returns {void} - Nothing
 */
function ClubCardRenderPopup() {

	// Exit on no popup
	if (ClubCardPopup == null) return;

	// In deck mode, we draw 10 deck buttons
	if (ClubCardPopup.Mode == "DECK") {
		DrawRect(648, 298, 404, 404, "White");
		DrawRect(650, 300, 400, 400, "Black");
		for (let Deck = 0; Deck < 10; Deck++)
			DrawButton(660 + Math.floor(Deck / 5) * 200, 310 + (Deck % 5) * 80, 180, 60, TextGet("DeckNumber") + (Deck + 1).toString(), "White");
		return;
	}

	// Draw the yes/no/text popups
	DrawRect(648, 348, 404, 304, "White");
	DrawRect(650, 350, 400, 300, "Black");
	DrawTextWrap(ClubCardPopup.Text, 670, 360, 370, 210, "White");
	if (ClubCardPopup.Mode == "TEXT") DrawButton(700, 570, 300, 60, ClubCardPopup.Button1, "White");
	if (ClubCardPopup.Mode == "YESNO") {
		DrawButton(660, 570, 180, 60, ClubCardPopup.Button1, "White");
		DrawButton(860, 570, 180, 60, ClubCardPopup.Button2, "White");
	}

}

/**
 * Runs the club card game, draws all the controls
 * @returns {void} - Nothing
 */
function ClubCardRun() {
	ClubCardHover = null;
	ClubCardLoadCaption();
	ClubCardRenderBoard(ClubCardPlayer[0], 0, 500, 1700, 500, false);
	ClubCardRenderBoard(ClubCardPlayer[1], 0, 0, 1700, 500, true);
	DrawRect(0, 499, 1700, 2, "White");
	ClubCardRenderHand(ClubCardPlayer[0], 0, 800, 1700, 300);
	ClubCardRenderHand(ClubCardPlayer[1], 0, -200, 1700, 300);
	ClubCardRenderPanel();
	if ((ClubCardPopup == null) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") && (ClubCardPlayer[ClubCardTurnIndex].Level < ClubCardLevelCost.length - 1) && (ClubCardPlayer[ClubCardTurnIndex].Money >= ClubCardLevelCost[ClubCardPlayer[ClubCardTurnIndex].Level + 1])) DrawButton(1390, 435, 300, 60, TextGet("UpgradeToLevel" + (ClubCardPlayer[ClubCardTurnIndex].Level + 1).toString()).replace("MONEY", ClubCardLevelCost[ClubCardPlayer[ClubCardTurnIndex].Level + 1].toString()), "White");
	ClubCardRenderPopup();
}

/**
 * Handles clicks during the club card game
 * @returns {void} - Nothing
 */
function ClubCardClick() {

	// In popup mode, no other clicks can be done but the popup buttons
	if (ClubCardPopup != null) {
		if ((ClubCardPopup.Mode == "TEXT") && MouseIn(700, 570, 300, 60)) CommonDynamicFunction(ClubCardPopup.Function1);
		if ((ClubCardPopup.Mode == "YESNO") && MouseIn(660, 570, 180, 60)) CommonDynamicFunction(ClubCardPopup.Function1);
		if ((ClubCardPopup.Mode == "YESNO") && MouseIn(860, 570, 180, 60)) CommonDynamicFunction(ClubCardPopup.Function2);
		if (ClubCardPopup.Mode == "DECK")
			for (let Deck = 0; Deck < 10; Deck++)
				if (MouseIn(660 + Math.floor(Deck / 5) * 200, 310 + (Deck % 5) * 80, 180, 60))
					ClubCardLoadDeckNumber(Deck);
		return;
	}

	// Runs the basic game buttons
	if (MouseIn(1725, 300, 250, 60) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") && ClubCardCanPlayCard(ClubCardPlayer[ClubCardTurnIndex], ClubCardFocus)) return ClubCardPlayCard(ClubCardPlayer[ClubCardTurnIndex], ClubCardFocus);
	if (MouseIn(1700, 0, 300, 600) && (ClubCardFocus != null)) return ClubCardFocus = null;
	if (MouseIn(1705, 905, 90, 90) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player")) return ClubCardEndTurn(true);
	if (MouseIn(1805, 905, 90, 90) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player")) return ClubCardCreatePopup("YESNO", TextGet("ConfirmBankrupt"), TextGet("Yes"), TextGet("No"), "ClubCardBankrupt()", "ClubCardDestroyPopup()");
	if (MouseIn(1905, 905, 90, 90) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player")) return ClubCardCreatePopup("YESNO", TextGet("ConfirmConcede"), TextGet("Yes"), TextGet("No"), "ClubCardConcede()", "ClubCardDestroyPopup()");
	if (MouseIn(1390, 435, 300, 60) && (ClubCardPlayer[ClubCardTurnIndex].Control == "Player") && (ClubCardPlayer[ClubCardTurnIndex].Level < ClubCardLevelCost.length - 1) && (ClubCardPlayer[ClubCardTurnIndex].Money >= ClubCardLevelCost[ClubCardPlayer[ClubCardTurnIndex].Level + 1])) return ClubCardUpgradeLevel(ClubCardPlayer[ClubCardTurnIndex]);

	// Sets the focus card if nothing else was clicked
	if (ClubCardHover != null) return ClubCardFocus = {...ClubCardHover};

}
