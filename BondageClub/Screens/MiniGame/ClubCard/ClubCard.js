"use strict";
var ClubCardPlayer = [];
var ClubCardList = [

    // 1000 - Regular Members (No specific rules)
    {
        ID: 1000,
        Name: "Kinky Neighbor",
        Group: ["Member"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Cute Girl Next Door")) TCGPlayerAddMoney(TCGPlayer, 1);
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
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Exhibitionist")) TCGPlayerAddMoney(TCGPlayer, 4);
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
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Party Animal")) TCGPlayerAddMoney(TCGPlayer, 1);
        }
    },
    {
        ID: 2001,
        Name: "Bouncer",
        Group: ["Member", "Staff"],
        MoneyPerTurn: -1,
        FamePerTurn: 2,
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Party Animal")) TCGPlayerAddMoney(TCGPlayer, 1);
        }
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
        OnTurnEnd: function(TCGPlayer) {
            if (TCGPlayer.Level >= 3) TCGPlayerAddMoney(TCGPlayer, 1);
            if (TCGPlayer.Level >= 5) TCGPlayerAddMoney(TCGPlayer, 1);
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
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardGroupIsOnBoard(TCGPlayer.Board, "Police")) ClubCardRemoveFromBoard(TCGPlayer.Board, this);
        }
    },
    {
        ID: 3002,
        Name: "Junkie",
        Group: ["Member", "Criminal"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Pusher")) TCGPlayerAddMoney(TCGPlayer, 2);
            if (ClubCardGroupIsOnBoard(TCGPlayer.Board, "Police")) ClubCardRemoveFromBoard(TCGPlayer.Board, this);
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Maid"));
        }
    },
    {
        ID: 4001,
        Name: "College-Girl Fan",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "College"));
        }
    },
    {
        ID: 4002,
        Name: "Masochist",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardGroupIsOnBoard(TCGPlayer.Board, "Dominant")) {
                TCGPlayerAddMoney(TCGPlayer, 1);
                TCGPlayerAddFame(TCGPlayer, 1);
            }
        }
    },
    {
        ID: 4003,
        Name: "Feet Lover",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardGroupIsOnBoard(TCGPlayer.Board, "Dominant"))
                TCGPlayerAddMoney(TCGPlayer, 2);
        }
    },
    {
        ID: 4004,
        Name: "Fin-Dom Simp",
        Group: ["Member", "Fetishist"],
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Dominant"));
        }
    },
    {
        ID: 4005,
        Name: "Fin-Dom Whale",
        Group: ["Member", "Fetishist"],
        RequiredLevel: 3,
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Dominant") * 2);
        }
    },
    {
        ID: 4006,
        Name: "Porn Adict",
        Group: ["Member", "Fetishist"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Porn"));
        }
    },

    // 5000 - Porn Members (Raise both Fame and Money)
    {
        ID: 5000,
        Name: "Porn Amateur",
        Group: ["Member", "Porn"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Porn"));
        }
    },
    {
        ID: 5001,
        Name: "Porn Movie Director",
        Group: ["Member"],
        RequiredLevel: 2, 
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Porn") * 2);
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Maid"));
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Patient"));
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Patient") * 2);
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Patient") * 3);
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "College") * -1);
        }
    },
    {
        ID: 9005,
        Name: "Union Leader",
        Group: ["Member", "Liability"],
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Maid") * -1);
            TCGPlayerAddMoney(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Staff") * -1);
        }
    },
    {
        ID: 9006,
        Name: "No-Fap Advocate",
        Group: ["Member", "Liability"],
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Porn") * -2);
        }
    },

    // 10000 - ABDL Members (Mostly gives Money)
    {
        ID: 10000,
        Name: "Baby Girl",
        Group: ["Member", "Baby"],
        MoneyPerTurn: 1,
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Mommy")) TCGPlayerAddMoney(TCGPlayer, 1);
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
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardGroupIsOnBoard(TCGPlayer.Board, "Maid")) TCGPlayerAddMoney(TCGPlayer, 2);
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
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Baby") * 2);
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
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Amanda")) TCGPlayerAddFame(TCGPlayer, 1);
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
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Julia")) TCGPlayerAddFame(TCGPlayer, 1);
        }
    },
    {
        ID: 11005,
        Name: "College Nerd",
        Group: ["Member", "Student"],
        FamePerTurn: 1,
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Yuki")) TCGPlayerAddMoney(TCGPlayer, 1);
        }
    },
    {
        ID: 11006,
        Name: "College Senior",
        Group: ["Member", "Student"],
        OnTurnEnd: function(TCGPlayer) {
            if (ClubCardNameIsOnBoard(TCGPlayer.Board, "Mildred")) TCGPlayerAddFame(TCGPlayer, 3);
        }
    },
    {
        ID: 11007,
        Name: "College Teacher",
        Group: ["Member", "Teacher"],
        MoneyPerTurn: -1,
        OnTurnEnd: function(TCGPlayer) {
            TCGPlayerAddFame(TCGPlayer, ClubCardGroupOnBoardCount(TCGPlayer.Board, "Student"));
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

// Returns TRUE if a card is currently present
function TCGPlayerAddMoney(TCGPlayer, Amount) {
    if (TCGPlayer.Money == null) TCGPlayer.Money = 0;
    TCGPlayer.Money = TCGPlayer.Money + Amount;
}

// Returns TRUE if a card is currently present
function TCGPlayerAddFame(TCGPlayer, Amount) {
    if (TCGPlayer.Money == null) TCGPlayer.Money = 0;
    TCGPlayer.Money = TCGPlayer.Money + Amount;
}

// Returns TRUE if a card (by name) is currently present on a board
function ClubCardNameIsOnBoard(Board, CardName) {
    if ((Board == null) || (Board.Card == null)) return false;
    for (let C of Board.Card)
        if (C.Asset.Name === CardName)
            return true;
    return false;
}

// Returns TRUE if a card (by group) is currently present on a board
function ClubCardGroupIsOnBoard(Board, CardGroup) {
    if ((Board == null) || (Board.Card == null) || (CardGroup == null)) return false;
    for (let C of Board.Card)
        for (let G of Board.Card.Asset.Group)
            if (G === CardGroup)
                return true;
    return false;
}

// Returns the number of cards of a specific group found on a board
function ClubCardGroupOnBoardCount(Board, CardGroup) {
    if ((Board == null) || (Board.Card == null) || (CardGroup == null)) return 0;
    let Count = 0;
    for (let C of Board.Card)
        for (let G of Board.Card.Asset.Group)
            if (G === CardGroup)
                Count++;
    return Count;
}

// Removes a card by ID from a specific board
function ClubCardRemoveFromBoard(Board, Card) {
    if ((Board == null) || (Board.Card == null)) return;
    let Pos = 0;
    for (let C of Board.Card) {
        if (C.Asset.ID === Card.ID)
            Board = Board.splice(Pos, 1);
        Pos++;
    }
}

