"use strict";
var ClubCardBackground = "ClubCardPlayBoard1";
var ClubCardColor = ["#808080", "#FFFFFF", "#B0FFB0", "#B0B0FF", "#FF80FF", "#FF8080", "#FFD700"];
var ClubCardOpponent = null;
var ClubCardHover = null;
var ClubCardFocus = null;
var ClubCardTurnIndex = 0;
var ClubCardFameGoal = 100;
var ClubCardDefaultDeck = {
    Name: "DEFAULT",
    Cards: [1000, 1001, 1002, 1003, 1004, 1006, 1007, 1008, 2000, 2001, 2002, 2003, 4000, 4002, 4003, 4004, 4005, 6000, 6001, 6002, 6003, 6004, 8000, 8001, 8002, 8003, 8004, 9000, 9001, 9002]
}
/** @type {ClubCardPlayer[]} */
var ClubCardPlayer = [];
var ClubCardList = [

    // 1000 - Regular Members (No specific rules)
    {
        ID: 1000,
        Name: "Kinky Neighbor",
        Group: ["Member"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Cute Girl Next Door")) ClubCardPlayerAddMoney(CCPlayer, 1);
        }
    },
    {
        ID: 1001,
        Name: "Cute Girl Next Door",
        Group: ["Member"],
        FamePerTurn: 1,
    },
    {
        ID: 1002,
        Name: "Voyeur",
        Group: ["Member"],
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Exhibitionist")) ClubCardPlayerAddMoney(CCPlayer, 4);
        }
    },
    {
        ID: 1003,
        Name: "Exhibitionist",
        Group: ["Member"]
    },
    {
        ID: 1004,
        Name: "Party Animal",
        Group: ["Member"],
        MoneyPerTurn: 2,
        FamePerTurn: -1
    },
    {
        ID: 1005,
        Name: "Auctioneer",
        Group: ["Member"],
        MoneyPerTurn: 1
    },
    {
        ID: 1006,
        Name: "Uptown Girl",
        Group: ["Member"],
        MoneyPerTurn: 2,
        RequiredLevel: 2
    },
    {
        ID: 1007,
        Name: "Foreigner",
        Group: ["Member"],
        MoneyPerTurn: 3,
        RequiredLevel: 4
    },
    {
        ID: 1008,
        Name: "Diplomat",
        Group: ["Member"],
        MoneyPerTurn: 5,
        RequiredLevel: 5
    },

    // 2000 - Staff Members (Club employees that can be targetted by events)
    {
        ID: 2000,
        Name: "Waitress",
        Group: ["Member", "Staff"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Party Animal")) ClubCardPlayerAddMoney(CCPlayer, 1);
        }
    },
    {
        ID: 2001,
        Name: "Bouncer",
        Group: ["Member", "Staff"],
        MoneyPerTurn: -1,
        FamePerTurn: 2
    },
    {
        ID: 2002,
        Name: "Secretary",
        Group: ["Member", "Staff"],
        MoneyPerTurn: 1,
        RequiredLevel: 3
    },
    {
        ID: 2003,
        Name: "Accountant",
        Group: ["Member", "Staff"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (CCPlayer.Level >= 3) ClubCardPlayerAddMoney(CCPlayer, 1);
            if (CCPlayer.Level >= 5) ClubCardPlayerAddMoney(CCPlayer, 1);
        }
    },
    {
        ID: 2004,
        Name: "Human Resource",
        Group: ["Member", "Staff"],
        MoneyPerTurn: -1,
        RequiredLevel: 3
        // Play an extra member card each turn
    },
    {
        ID: 2005,
        Name: "Recruiter",
        Group: ["Member", "Staff"],
        MoneyPerTurn: -1,
        RequiredLevel: 3
        // Draw an extra card each turn
    },

    // 3000 - Police / Criminal Members (Cancel each others and offer protections against events)
    {
        ID: 3000,
        Name: "Policewoman",
        Group: ["Member", "Police"],
        MoneyPerTurn: 1,
        FamePerTurn: 1,
        RequiredLevel: 3
    },
    {
        ID: 3001,
        Name: "Pusher",
        Group: ["Member", "Criminal"],
        MoneyPerTurn: 3,
        FamePerTurn: -2,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Police")) ClubCardRemoveFromBoard(CCPlayer.Board, this);
        }
    },
    {
        ID: 3002,
        Name: "Junkie",
        Group: ["Member", "Criminal"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Pusher")) ClubCardPlayerAddMoney(CCPlayer, 2);
            if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Police")) ClubCardRemoveFromBoard(CCPlayer.Board, this);
        }
    },
    {
        ID: 3003,
        Name: "Zealous Cop",
        Group: ["Member", "Liability", "Police"],
        RequiredLevel: 3,
        FamePerTurn: -2
    },

    // 4000 - Fetishists (Synergies with other groups)
    {
        ID: 4000,
        Name: "Maid Lover",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Maid"));
        }
    },
    {
        ID: 4001,
        Name: "College-Girl Fan",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "College"));
        }
    },
    {
        ID: 4002,
        Name: "Masochist",
        Group: ["Member", "Fetishist"],
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
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Dominant"))
                ClubCardPlayerAddMoney(CCPlayer, 2);
        }
    },
    {
        ID: 4004,
        Name: "Fin-Dom Simp",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Dominant"));
        }
    },
    {
        ID: 4005,
        Name: "Fin-Dom Whale",
        Group: ["Member", "Fetishist"],
        RequiredLevel: 3,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Dominant") * 2);
        }
    },
    {
        ID: 4006,
        Name: "Porn Adict",
        Group: ["Member", "Fetishist"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn"));
        }
    },

    // 5000 - Porn Members (Raise both Fame and Money)
    {
        ID: 5000,
        Name: "Porn Amateur",
        Group: ["Member", "Porn"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn"));
        }
    },
    {
        ID: 5001,
        Name: "Porn Movie Director",
        Group: ["Member"],
        RequiredLevel: 2, 
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn") * 2);
        }
    },
    {
        ID: 5002,
        Name: "Porn Actress",
        Group: ["Member", "Porn"],
        MoneyPerTurn: 1,
        FamePerTurn: 1,
        RequiredLevel: 3
    },
    {
        ID: 5003,
        Name: "Porn Star",
        Group: ["Member", "Porn"],
        MoneyPerTurn: 2,
        FamePerTurn: 4,
        RequiredLevel: 5
    },

    // 6000 - Maid Members (Raise Fame, cost Money)
    {
        ID: 6000,
        Name: "Rookie Maid",
        Group: ["Member", "Maid"],
        FamePerTurn: 1
    },
    {
        ID: 6001,
        Name: "Coat Check Maid",
        Group: ["Member", "Maid"],
        MoneyPerTurn: 1
    },
    {
        ID: 6002,
        Name: "Regular Maid",
        Group: ["Member", "Maid"],
        MoneyPerTurn: -1,
        FamePerTurn: 2
    },
    {
        ID: 6003,
        Name: "French Maid",
        Group: ["Member", "Maid"],
        MoneyPerTurn: -1,
        FamePerTurn: 3,
        RequiredLevel: 3
    },
    {
        ID: 6004,
        Name: "Head Maid",
        Group: ["Member", "Maid"],
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
        Group: ["Member", "Patient"],
        MoneyPerTurn: 1,
    },
    {
        ID: 7001,
        Name: "Nurse",
        Group: ["Member", "Nurse"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Patient"));
        }
    },
    {
        ID: 7002,
        Name: "Commited Patient",
        Group: ["Member", "Patient"],
        MoneyPerTurn: 2,
        RequiredLevel: 2
    },
    {
        ID: 7003,
        Name: "Head Nurse",
        Group: ["Member", "Nurse"],
        RequiredLevel: 3,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Patient") * 2);
        }
    },
    {
        ID: 7004,
        Name: "Permanent Patient",
        Group: ["Member", "Patient"],
        MoneyPerTurn: 3,
        RequiredLevel: 4
    },
    {
        ID: 7005,
        Name: "Doctor",
        Group: ["Member", "Nurse"],
        RequiredLevel: 5,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Patient") * 3);
        }
    },

    // 8000 - Dominant Members (Raise lots of Fame, cost Money)
    {
        ID: 8000,
        Name: "Amateur Rigger",
        Group: ["Member", "Dominant"],
        FamePerTurn: 1
    },
    {
        ID: 8001,
        Name: "Domme",
        Group: ["Member", "Dominant"],
        MoneyPerTurn: -1,
        FamePerTurn: 2
    },
    {
        ID: 8002,
        Name: "Madam",
        Group: ["Member", "Dominant"],
        RequiredLevel: 2,
        MoneyPerTurn: -2,
        FamePerTurn: 3
    },
    {
        ID: 8003,
        Name: "Mistress",
        Group: ["Member", "Dominant"],
        RequiredLevel: 3,
        MoneyPerTurn: -3,
        FamePerTurn: 5
    },
    {
        ID: 8004,
        Name: "Dominatrix",
        Group: ["Member", "Dominant"],
        RequiredLevel: 4,
        MoneyPerTurn: -4,
        FamePerTurn: 6
    },
    {
        ID: 8005,
        Name: "Mistress Sophie",
        Group: ["Member", "Dominant"],
        Unique: true,
        RequiredLevel: 5,
        MoneyPerTurn: -5,
        FamePerTurn: 8
    },

    // 9000 - Liability Members (Used on other board to handicap)
    {
        ID: 9000,
        Name: "Scammer",
        Group: ["Member", "Liability"],
        MoneyPerTurn: -1
    },
    {
        ID: 9001,
        Name: "Pyramid Schemer",
        Group: ["Member", "Liability"],
        RequiredLevel: 2,
        MoneyPerTurn: -2
    },
    {
        ID: 9002,
        Name: "Ponzi Schemer",
        Group: ["Member", "Liability"],
        RequiredLevel: 4,
        MoneyPerTurn: -3
    },
    {
        ID: 9003,
        Name: "Party Pooper",
        Group: ["Member", "Liability"],
        FamePerTurn: -1
    },
    {
        ID: 9004,
        Name: "College Dropout",
        Group: ["Member", "Liability"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "College") * -1);
        }
    },
    {
        ID: 9005,
        Name: "Union Leader",
        Group: ["Member", "Liability"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Maid") * -1);
            ClubCardPlayerAddMoney(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Staff") * -1);
        }
    },
    {
        ID: 9006,
        Name: "No-Fap Advocate",
        Group: ["Member", "Liability"],
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Porn") * -2);
        }
    },

    // 10000 - ABDL Members (Mostly gives Money)
    {
        ID: 10000,
        Name: "Baby Girl",
        Group: ["Member", "Baby"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Mommy")) ClubCardPlayerAddMoney(CCPlayer, 1);
        }
    },
    {
        ID: 10001,
        Name: "Mommy",
        Group: ["Member"],
        MoneyPerTurn: 1
    },
    {
        ID: 10002,
        Name: "Diaper Lover",
        Group: ["Member", "Baby"],
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardGroupIsOnBoard(CCPlayer.Board, "Maid")) ClubCardPlayerAddMoney(CCPlayer, 2);
        }
    },
    {
        ID: 10003,
        Name: "Sugar Baby",
        Group: ["Member", "Baby"],
        RequiredLevel: 4,
        MoneyPerTurn: 3
    },
    {
        ID: 10004,
        Name: "Babysitter",
        Group: ["Member", "Staff"],
        MoneyPerTurn: -1,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Baby") * 2);
        }
    },

    // 11000 - College Members (Mostly gives Fame)
    {
        ID: 11000,
        Name: "Amanda",
        Group: ["Member", "Student"],
        Unique: true,
        FamePerTurn: 1
    },
    {
        ID: 11001,
        Name: "Sarah",
        Group: ["Member", "Student"],
        Unique: true,
        FamePerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Amanda")) ClubCardPlayerAddFame(CCPlayer, 1);
        }
    },
    {
        ID: 11002,
        Name: "Sidney",
        Group: ["Member", "Student"],
        Unique: true,
        FamePerTurn: 1
    },
    {
        ID: 11003,
        Name: "Jennifer",
        Group: ["Member", "Student"],
        Unique: true,
        FamePerTurn: 1
        // Remove one of your current member on entry
    },
    {
        ID: 11004,
        Name: "College Freshwoman",
        Group: ["Member", "Student"],
        FamePerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Julia")) ClubCardPlayerAddFame(CCPlayer, 1);
        }
    },
    {
        ID: 11005,
        Name: "College Nerd",
        Group: ["Member", "Student"],
        FamePerTurn: 1,
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Yuki")) ClubCardPlayerAddMoney(CCPlayer, 1);
        }
    },
    {
        ID: 11006,
        Name: "College Senior",
        Group: ["Member", "Student"],
        OnTurnEnd: function(CCPlayer) {
            if (ClubCardNameIsOnBoard(CCPlayer.Board, "Mildred")) ClubCardPlayerAddFame(CCPlayer, 3);
        }
    },
    {
        ID: 11007,
        Name: "College Teacher",
        Group: ["Member", "Teacher"],
        MoneyPerTurn: -1,
        OnTurnEnd: function(CCPlayer) {
            ClubCardPlayerAddFame(CCPlayer, ClubCardGroupOnBoardCount(CCPlayer.Board, "Student"));
        }
    },
    {
        ID: 11008,
        Name: "Julia",
        Group: ["Member", "Teacher"],
        Unique: true,
        RequiredLevel: 2,
        FamePerTurn: 2
    },
    {
        ID: 11009,
        Name: "Yuki",
        Group: ["Member", "Teacher"],
        Unique: true,
        RequiredLevel: 3,
        FamePerTurn: 2,
        MoneyPerTurn: 1,
    },
    {
        ID: 11010,
        Name: "Mildred",
        Group: ["Member", "Teacher"],
        Unique: true,
        RequiredLevel: 4,
        FamePerTurn: 3,
    },

];

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
        for (let Group of Card.Group)
            if (Group === CardGroup)
                Count++;
    return Count;
}

/**
 * Removes a card from the board
 * @param {Array} Board - The board on which to remove the card
 * @param {Object} Card - The card object to remove
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
function ClubCardPlayerDrawCard(CCPlayer, Amount) {
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
                OutDeck.push(C);
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
        Money: 10,
        Fame: 0
    };
    ClubCardPlayer.push(P);
    ClubCardPlayerDrawCard(P, (P.Index == ClubCardTurnIndex) ? 5 : 6);
}

/**
 * Loads the club card mini-game: Assigns the opponents and draws the cards
 * @returns {void} - Nothing
 */
function ClubCardLoad() {
	ClubCardTurnIndex = Math.floor(Math.random() * 2);
    ClubCardPlayer = [];
    ClubCardAddPlayer(Player, "Player", ClubCardDefaultDeck.Cards);
    ClubCardAddPlayer(ClubCardOpponent, "AI", ClubCardDefaultDeck.Cards);
}

function ClubCardRenderBubble(Value, X, Y, W, Image) {
    DrawImageResize("Screens/MiniGame/ClubCard/Bubble/" + Image + ".png", X, Y - W / 20, W, W);
    DrawTextWrap(Value, X, Y, W, W, "Black");
    return Y + W * 1.5;
}

/**
 * Draw the club card player hand on screen, show only sleeves if not controlled by player
 * @param {Object|Number} Card - The card to draw
 * @param {number} X - The X on screen position
 * @param {number} Y - The Y on screen position
 * @param {number} W - The width of the card
 * @param {string|null} Sleeve - The sleeve image to draw instead of the card
 * @returns {void} - Nothing
 */
function ClubCardRenderCard(Card, X, Y, W, Sleeve = null) {

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
    if (MouseIn(X, Y, W, W * 2)) ClubCardHover = Card;

    // Gets the text and frame color
    let Level = ((Card.RequiredLevel == null) || (Card.RequiredLevel <= 1)) ? 1 : Card.RequiredLevel;
    let Color = ClubCardColor[(Card.Unique == true) ? 6 : Level];

    // Draw the images and texts on the screen
    DrawImageResize("Screens/MiniGame/ClubCard/Frame/Member" + ((Card.Unique == true) ? "6" : Level.toString()) + ".png", X, Y, W, W * 2);
    DrawImageResize("Screens/MiniGame/ClubCard/Card/" + Card.Name + ".png", X + W * 0.05, Y + W * 0.18, W * 0.9, W * 1.8);
	MainCanvas.font = "bold " + Math.round(W / 12) + "px arial";
    DrawTextWrap(Card.Title, X + W * 0.05, Y + W * 0.05, W * 0.9, W * 0.1, "Black");
    let BubblePos = Y + W * 0.2;
    if (Level > 1) BubblePos = ClubCardRenderBubble(Level.toString(), X + W * 0.05, BubblePos, W * 0.1, "Level");
    if (Card.FamePerTurn != null) BubblePos = ClubCardRenderBubble(Card.FamePerTurn.toString(), X + W * 0.05, BubblePos, W * 0.1, "Fame");
    if (Card.MoneyPerTurn != null) BubblePos = ClubCardRenderBubble(Card.MoneyPerTurn.toString(), X + W * 0.05, BubblePos, W * 0.1, "Money");
    if (Card.Text != null) {
        MainCanvas.font = ((Card.Text.startsWith("<F>")) ? "italic " : "") + Math.round(W / 12) + "px arial";
        DrawRect(X + W * 0.05, Y + W * 1.5, W * 0.9, W * 0.48, Color + "80");
        DrawTextWrap(Card.Text.replace("<F>", ""), X + W * 0.05, Y + W * 1.5, W * 0.9, W * 0.48, "Black");
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
	MainCanvas.font = CommonGetFont(Math.round(H / 20));
    if (CCPlayer.Character != null) DrawTextWrap(CharacterNickname(CCPlayer.Character), X + W * 0.01, TextY + H * 0.01, W * 0.23, H * 0.1, "White");
    if (CCPlayer.Fame != null) DrawTextWrap(TextGet("Fame") + " " + CCPlayer.Fame, X + W * 0.26, TextY + H * 0.01, W * 0.23, H * 0.1, (CCPlayer.Fame >= 0) ? "White" : "Pink");
    if (CCPlayer.Money != null) DrawTextWrap(TextGet("Money") + " " + CCPlayer.Money, X + W * 0.51, TextY + H * 0.01, W * 0.23, H * 0.1, (CCPlayer.Money >= 0) ? "White" : "Pink");
    if (CCPlayer.Level != null) DrawTextWrap(TextGet("Level" + CCPlayer.Level), X + W * 0.76, TextY + H * 0.01, W * 0.23, H * 0.1, (CCPlayer.Money >= 0) ? "White" : "Pink");
    if ((CCPlayer == null) || (CCPlayer.Board == null)) return;
    let PosX = X;
    for (let C of CCPlayer.Board) {
        ClubCardRenderCard(C, PosX + 5, Y + 5 + (H * 0.1), (W / 7) - 5);
        PosX = PosX + (W / ((CCPlayer.Board.length >= 8) ? CCPlayer.Board.length : 7));
    }
	MainCanvas.font = CommonGetFont(36);
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
        ClubCardRenderCard(C, PosX + 5, Y + 5 + (H * 0.1), (W / 10) - 5, (CCPlayer.Control == "Player") ? null : CCPlayer.Sleeve);
        PosX = PosX + IncX;
    }
}

/**
 * Runs the club card game, draws all the controls
 * @returns {void} - Nothing
 */
function ClubCardRun() {

    // Prepares the card titles and texts if needed
    if ((ClubCardList[0].Title == null) && (TextGet("Title Kinky Neighbor") != ""))
        for (let Card of ClubCardList) {
            Card.Title = TextGet("Title " + Card.Name);
            Card.Text = TextGet("Text " + Card.Name);
        }

    // Render the controls
    ClubCardHover = null;
    let Width = (ClubCardFocus == null) ? 2000 : 1500;
    ClubCardRenderBoard(ClubCardPlayer[0], 0, 500, Width, 500, 500);
    ClubCardRenderBoard(ClubCardPlayer[1], 0, 0, Width, 500, 440);
    DrawRect(0, 499, 2000, 2, "White");
    ClubCardRenderHand(ClubCardPlayer[0], 0, 750, Width, 300);
    ClubCardRenderHand(ClubCardPlayer[1], 0, -250, Width, 300);
    ClubCardRenderCard(ClubCardFocus, 1500, 0, 500);

}

/**
 * Handles clicks during the club card game
 * @returns {void} - Nothing
 */
function ClubCardClick() {
    if ((ClubCardFocus != null) && (MouseX >= 1500)) return ClubCardFocus = null;
    if (ClubCardHover != null) ClubCardFocus = ClubCardHover;
}
