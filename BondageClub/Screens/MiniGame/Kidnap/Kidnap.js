"use strict";
var KidnapVictory = false;
var KidnapDifficulty = 0;
var KidnapBackground = "KidnapLeague";
var KidnapReturnFunction = "";
/** @type {null | Character} */
var KidnapOpponent = null;
/** @type {null | Item} */
var KidnapPlayerCloth = null;
/** @type {null | Item} */
var KidnapPlayerClothAccessory = null;
/** @type {null | Item} */
var KidnapPlayerClothLower = null;
/** @type {null | Item} */
var KidnapOpponentCloth = null;
/** @type {null | Item} */
var KidnapOpponentClothAccessory = null;
/** @type {null | Item} */
var KidnapOpponentClothLower = null;
var KidnapTimer = 0;
var KidnapMode = "";
var KidnapDialog = "";
var KidnapPlayerMove = 0;
var KidnapOpponentMove = 0;
var KidnapPlayerDamage = 0;
var KidnapOpponentDamage = 0;
var KidnapResultPlayer = "test";
var KidnapResultOpponent = "test";
var KidnapResultUpperHand = "";
/** @type {null | Character} */
var KidnapUpperHandVictim = null;
var KidnapUpperHandSelection = 0;
var KidnapMoveType = ["BruteForce", "Domination", "Sneakiness", "Meditation"];
var KidnapUpperHandMoveType = ["Cloth", "ItemMouth", "ItemFeet", "UndoCloth", "UndoItemMouth", "UndoItemFeet", "Mercy"];
/** @type { [number, number, number, number][] } */
var KidnapMoveMap = [
	[1, 2, 0, 2], // BruteForce
	[0, 1, 2, 2], // Domination
	[2, 0, 1, 2], // Sneakiness
	[0, 0, 0, 0] // Meditation
];
var KidnapRPS = ["Rock", "Scissors", "Paper"];

/**
 * Generates the kidnap stats for the given character, factoring in any bonus it might have.
 * @param {Character} C - The character for which to generate the stats for.
 * @param {number} Bonus - The possible stat bonus a character has
 * @returns {void} - Nothing
 */
function KidnapLoadStats(C, Bonus) {
	let Pandora = (KidnapReturnFunction.indexOf("Pandora") == 0);
	if (C.ID == 0)
		C.KidnapStat = [
			6 + CharacterGetBonus(C, "Kidnap" + KidnapMoveType[0]) + ((Pandora && InfiltrationPerksActive("Strength")) ? 2 : 0),
			6 + CharacterGetBonus(C, "Kidnap" + KidnapMoveType[1]) + ((Pandora && InfiltrationPerksActive("Charisma")) ? 2 : 0),
			6 + CharacterGetBonus(C, "Kidnap" + KidnapMoveType[2]) + ((Pandora && InfiltrationPerksActive("Agility")) ? 2 : 0),
			-1];
	else
		C.KidnapStat = [6 + Bonus, 6 + Bonus, 6 + Bonus, -1];
}

/**
 * Builds a deck of kidnap cards for the character, the deck contains 7 random cards and must contain at least 1 card of each type
 * @param {Character} C - The character for which to generate the cards
 * @returns {void} - Nothing
 */
function KidnapBuildCards(C) {
	let MoveTypeCount = [0, 0, 0];
	while ((MoveTypeCount[0] == 0) || (MoveTypeCount[1] == 0) || (MoveTypeCount[2] == 0)) {
		C.KidnapCard = [];
		MoveTypeCount = [0, 0, 0];
		while (C.KidnapCard.length < 7) {
			let MoveType = Math.floor(Math.random() * 3);
			MoveTypeCount[MoveType]++;
			C.KidnapCard.push({Move: MoveType, Value: Math.floor(Math.random() * C.KidnapStat[MoveType]) + 2});
		}
	}
	C.KidnapCard.sort((a, b) => (a.Value > b.Value) ? 1 : -1);
	C.KidnapCard.sort((a, b) => (a.Move > b.Move) ? 1 : -1);
	C.KidnapCard.push({Move: 3});
}

/**
 * Builds the inventory items that are available when kidnapping
 * @returns {void} - Nothing
 */
function KidnapInventoryBuild() {

	// Loop in the player inventory for that group for items that can be worn, is enable and is allowed for random events
	DialogInventory = [];
	if (KidnapOpponent.FocusGroup != null)
		for (let A = 0; A < Player.Inventory.length; A++)
			if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == KidnapOpponent.FocusGroup.Name) && Player.Inventory[A].Asset.Enable && Player.Inventory[A].Asset.Wear && Player.Inventory[A].Asset.Random)
				DialogInventoryAdd(KidnapOpponent, Player.Inventory[A], false);
	DialogInventorySort();

}

/**
 * Sets the current battle status and its related timer
 * @param {string} NewMode - New mode for the battle
 * @returns {void} - Nothing
 */
function KidnapSetMode(NewMode) {

	// Removes the focus group if not selecting an item
	if (NewMode != "SelectItem") KidnapOpponent.FocusGroup = null;

	// If we must enter in Upper Hand mode
	if (KidnapMode == "UpperHand") KidnapUpperHandVictim = null;
	if ((NewMode == "SelectMove") && (KidnapUpperHandVictim != null)) NewMode = "UpperHand";
	if ((NewMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0)) KidnapAIMoveUpperHand();

	// If we must enter the sudden death mode
	if ((NewMode == "SelectMove") && (Player.KidnapWillpower <= 0) && (KidnapOpponent.KidnapWillpower <= 0)) {
		Player.KidnapWillpower = 1;
		KidnapOpponent.KidnapWillpower = 1;
		NewMode = "SuddenDeath";
	}

	// If we must end the mini game in defeat
	if ((NewMode == "SelectMove") && (Player.KidnapWillpower <= 0)) {
		InventoryWearRandom(Player, "ItemArms", KidnapDifficulty);
		NewMode = "End";
	}

	// If we must end the mini game in victory, one last item can be equipped
	if ((NewMode == "SelectMove") && (KidnapOpponent.KidnapWillpower <= 0)) {
		if (!KidnapVictory) {
			KidnapOpponent.FocusGroup = /** @type {AssetItemGroup} */ (AssetGroupGet("Female3DCG", "ItemArms"));
			KidnapInventoryBuild();
			NewMode = (KidnapOpponent.FocusGroup != null) ? "SelectItem" : "End";
			KidnapVictory = true;
		} else NewMode = "End";
	}

	// Sets the mode and timer
	KidnapMode = NewMode;
	if ((NewMode == "Intro") || (NewMode == "SuddenDeath") || (NewMode == "End")) KidnapTimer = CommonTime() + 5000;
	else KidnapTimer = CommonTime() + 15000;

}

/**
 * Generates a move value for the NPC based on the best possible options
 * @returns {number} - Returns the move type
 */
function KidnapAIMove() {

	// Builds a value for each moves and puts that value in an array
	let MoveOdds = [];
	for (let M = 0; M < KidnapOpponent.KidnapCard.length; M++) {
		let Value = 10;
		if (KidnapOpponent.KidnapCard[M].Move != 3)
			for (let P = 0; P < Player.KidnapCard.length; P++) {
				let PlaEff = Math.round(Player.KidnapCard[P].Value / (KidnapMoveEffective(Player, Player.KidnapCard[P].Move) ? 1 : 2));
				let OppEff = Math.round(KidnapOpponent.KidnapCard[M].Value / (KidnapMoveEffective(KidnapOpponent, KidnapOpponent.KidnapCard[M].Move) ? 1 : 2));
				if (KidnapMoveMap[KidnapOpponent.KidnapCard[M].Move][Player.KidnapCard[P].Move] == 0) Value = Value - PlaEff;
				if (KidnapMoveMap[KidnapOpponent.KidnapCard[M].Move][Player.KidnapCard[P].Move] == 1) Value = Value + OppEff - PlaEff;
				if (KidnapMoveMap[KidnapOpponent.KidnapCard[M].Move][Player.KidnapCard[P].Move] == 2) Value = Value + OppEff;
			}
		else
			Value = (6 - KidnapOpponent.KidnapCard.length) * (Player.KidnapCard.length + 2);
		if (Value < 0) Value = 0;
		MoveOdds.push(Value);
	}

	// Builds the total, if it's zero, we return a random move
	let Total = 0;
	for (let M = 0; M < MoveOdds.length; M++)
		Total = Total + MoveOdds[M];
	if (Total <= 0) return Math.floor(Math.random() * KidnapOpponent.KidnapCard.length);

	// Picks a random position in the best values, the higher the value, the higher the chance it will get picked
	let Pos = Math.floor(Math.random() * Total);
	let RunningTotal = 0;
	for (let M = 0; M < MoveOdds.length; M++) {
		if ((Pos >= RunningTotal) && (Pos <= RunningTotal + MoveOdds[M]))
			return M;
		RunningTotal = RunningTotal + MoveOdds[M];
	}

	// No move found, we go full random
	return Math.floor(Math.random() * KidnapOpponent.KidnapCard.length);

}

/**
 * Validates or checks if a given upper hand move type is available.
 * @param {number} MoveType - The type of move to check for or perform
 * @param {boolean} DoMove - Whether or not the move is being performed
 * @returns {boolean} - Returns TRUE if the upper hand move type is available
 */
function KidnapUpperHandMoveAvailable(MoveType, DoMove) {

	// Mercy is always available
	let MoveName = KidnapUpperHandMoveType[MoveType];
	if (MoveName == "Mercy") return true;

	// If we need to check to strip the opponent
	if ((MoveName == "Cloth") && (InventoryGet(KidnapUpperHandVictim, "Cloth") != null)) {
		if (DoMove) {
			InventoryRemove(KidnapUpperHandVictim, "Cloth");
			InventoryRemove(KidnapUpperHandVictim, "ClothLower");
			InventoryRemove(KidnapUpperHandVictim, "ClothAccessory");
		}
		return true;
	}

	// If we need to check to apply a restrain
	if (((MoveName == "ItemFeet") || (MoveName == "ItemMouth")) && (InventoryGet(KidnapUpperHandVictim, MoveName) == null)) {
		if (DoMove) InventoryWearRandom(KidnapUpperHandVictim, MoveName, (KidnapUpperHandVictim.ID == 0) ? KidnapDifficulty : 0);
		return true;
	}

	// If we need to check to dress back
	let C = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponent : Player;
	let Cloth = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentCloth : KidnapPlayerCloth;
	let ClothAccessory = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentClothAccessory : KidnapPlayerClothAccessory;
	let ClothLower = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentClothLower : KidnapPlayerClothLower;
	if ((MoveName == "UndoCloth") && (InventoryGet(C, "Cloth") == null) && (Cloth != null)) {
		if (DoMove) InventoryWear(C, Cloth.Asset.Name, "Cloth", Cloth.Color);
		if (DoMove && (ClothAccessory != null)) InventoryWear(C, ClothAccessory.Asset.Name, "ClothAccessory", ClothAccessory.Color);
		if (DoMove && (ClothLower != null)) InventoryWear(C, ClothLower.Asset.Name, "ClothLower", ClothLower.Color);
		return true;
	}

	// If we need to check to remove the restrain
	if ((MoveName == "UndoItemFeet") || (MoveName == "UndoItemMouth")) {
		const groupName = /** @type {AssetGroupName} */(MoveName.replace("Undo", ""));
		let I = InventoryGet(C, groupName);
		if ((I != null) && ((C.ID != 0) || !InventoryItemHasEffect(I, "Lock", true))) {
			if (DoMove) InventoryRemove(C, groupName);
			return true;
		}
	}

	// Invalid move
	return false;

}

/**
 * Sets a random upper hand move for the NPC to use
 * @returns {void} - Nothing
 */
function KidnapAIMoveUpperHand() {
	var Try = 0;
	var MoveDone = false;
	while ((Try < 100) && (MoveDone == false)) {
		KidnapUpperHandSelection = Math.floor(Math.random() * (KidnapUpperHandMoveType.length - 1));
		MoveDone = KidnapUpperHandMoveAvailable(KidnapUpperHandSelection, true);
		Try++;
	}
	if (MoveDone == false) KidnapUpperHandSelection = KidnapUpperHandMoveType.indexOf("Mercy");
}

/**
 * Draws the move text (left side) and the effect (right side)
 * @returns {void} - Nothing
 */
function KidnapShowMove() {
	DrawTextWrap(TextGet(KidnapDialog + "Action"), 10, 150, 580, 200, "white");
	DrawTextWrap(Player.Name + ": " + SpeechGarble(Player, TextGet(KidnapDialog + "Player")), 10, 350, 580, 200, "white");
	DrawTextWrap(KidnapOpponent.Name + ": " + SpeechGarble(KidnapOpponent, TextGet(KidnapDialog + "Opponent")), 10, 550, 580, 200, "white");
	DrawTextWrap(KidnapResultPlayer, 1410, 150, 580, 200, "white");
	DrawTextWrap(KidnapResultOpponent, 1410, 350, 580, 200, "white");
	DrawTextWrap(KidnapResultUpperHand, 1410, 550, 580, 200, "white");
	DrawText(TextGet(KidnapMoveType[KidnapPlayerMove]) + ((KidnapPlayerDamage != null) ? " - " + KidnapPlayerDamage.toString() : ""), 750, 25, "white", "gray");
	DrawText(TextGet(KidnapMoveType[KidnapOpponentMove]) + ((KidnapOpponentDamage != null) ? " - " + KidnapOpponentDamage.toString() : ""), 1250, 25, "white", "gray");
}

/**
 * Checks if a given move is effective against a given character
 * @param {Character} C - Character for which to check if the move is
 * @param {number} MoveType - Type of move to check for
 * @returns {boolean} - Returns TRUE if the move for that person is effective
 */
function KidnapMoveEffective(C, MoveType) {
	// Not completely true, but unknown groups will just return null anyway
	const groupName = /** @type {AssetGroupName} */(KidnapUpperHandMoveType[MoveType]);
	if ((KidnapUpperHandMoveType[MoveType] == "Cloth") && (InventoryGet(C, groupName) != null)) return true;
	if ((KidnapUpperHandMoveType[MoveType] != "Cloth") && (InventoryGet(C, groupName) == null)) return true;
	return false;
}

/**
 * Processes a selected move. Triggered when the player selects their move.
 * @param {number} CardIndex - Type of the player move (Represented by the index of the character move array)
 * @returns {void} - Nothing
 */
function KidnapSelectMove(CardIndex) {

	// Gets both moves effectiveness
	var OpponentCardIndex = KidnapAIMove();
	var PlayerMove = Player.KidnapCard[CardIndex].Move;
	var OpponentMove = KidnapOpponent.KidnapCard[OpponentCardIndex].Move;
	var PM = KidnapMoveMap[PlayerMove][OpponentMove];
	var OM = KidnapMoveMap[OpponentMove][PlayerMove];
	KidnapDialog = "Player" + KidnapMoveType[PlayerMove] + "Opponent" + KidnapMoveType[OpponentMove];

	// Keep the move to show it later
	KidnapPlayerMove = PlayerMove;
	KidnapOpponentMove = OpponentMove;

	// Gets the damage done by both sides
	KidnapPlayerDamage = Player.KidnapCard[CardIndex].Value;
	if (!KidnapMoveEffective(Player, PlayerMove)) KidnapPlayerDamage = Math.round(KidnapPlayerDamage / 2);
	KidnapOpponentDamage = KidnapOpponent.KidnapCard[OpponentCardIndex].Value;
	if (!KidnapMoveEffective(KidnapOpponent, OpponentMove)) KidnapOpponentDamage = Math.round(KidnapOpponentDamage / 2);

	// If the move is effective, we lower the willpower and show it as text
	if (PM >= 1) {
		let Damage = KidnapPlayerDamage;
		if (PlayerMove == OpponentMove) Damage = Damage - KidnapOpponentDamage;
		if (Damage < 0) Damage = 0;
		KidnapOpponent.KidnapWillpower = parseInt(KidnapOpponent.KidnapWillpower) - Damage;
		KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("NoLost");
	if (OM >= 1) {
		let Damage = KidnapOpponentDamage;
		if (PlayerMove == OpponentMove) Damage = Damage - KidnapPlayerDamage;
		if (Damage < 0) Damage = 0;
		Player.KidnapWillpower = parseInt(Player.KidnapWillpower) - Damage;
		KidnapResultPlayer = Player.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultPlayer = Player.Name + " " + TextGet("NoLost");

	// Builds the "Upperhand" text
	KidnapResultUpperHand = "";
	KidnapUpperHandVictim = null;
	if ((PM >= 2) && (PlayerMove != 3) && (OpponentMove != 3)) { KidnapUpperHandVictim = KidnapOpponent; KidnapResultUpperHand = Player.Name + " " + TextGet("UpperHand"); }
	if ((OM >= 2) && (PlayerMove != 3) && (OpponentMove != 3)) { KidnapUpperHandVictim = Player; KidnapResultUpperHand = KidnapOpponent.Name + " " + TextGet("UpperHand"); }

	// Cannot go below zero
	if (Player.KidnapWillpower < 0) Player.KidnapWillpower = 0;
	if (KidnapOpponent.KidnapWillpower < 0) KidnapOpponent.KidnapWillpower = 0;

	// Removes the card from the deck
	Player.KidnapCard.splice(CardIndex, 1);
	KidnapOpponent.KidnapCard.splice(OpponentCardIndex, 1);

	// When someone meditates, it resets her stats to max
	if (PlayerMove == 3) KidnapBuildCards(Player);
	if (OpponentMove == 3) KidnapBuildCards(KidnapOpponent);

	// Shows the move dialog
	KidnapSetMode("ShowMove");

}

/**
 * Processes a selected upper handmove. Triggered when the player selects their upper hand move.
 * @param {number} PlayerMove - Type of the player upper hand move (Represented by the index of the character move array)
 * @returns {void} - Nothing
 */
function KidnapSelectMoveUpperHand(PlayerMove) {
	const MoveName = KidnapUpperHandMoveType[PlayerMove];

	// Stripping or undoing something is automatic
	if ((MoveName === "Cloth") || (MoveName === "UndoCloth") || (MoveName === "UndoItemFeet") || (MoveName === "UndoItemMouth"))
		if (KidnapUpperHandMoveAvailable(PlayerMove, true))
			KidnapSetMode("SelectMove");

	// Apply an item enters another mode with a focused group
	if ((MoveName === "ItemFeet") || (MoveName === "ItemMouth"))
		if (KidnapUpperHandMoveAvailable(PlayerMove, false)) {
			KidnapOpponent.FocusGroup = /** @type {AssetItemGroup} */ (AssetGroupGet("Female3DCG", MoveName));
			KidnapInventoryBuild();
			KidnapSetMode("SelectItem");
		}

	// Mercy is always available
	if (MoveName === "Mercy") KidnapSetMode("SelectMove");
}

/**
 * Triggered when the player surrenders to her opponent
 * @returns {void} - Nothing
 */
function KidnapSurrender() {
	Player.KidnapWillpower = 0;
	KidnapSetMode("SelectMove");
}

/**
 * Starts a kidnap match
 * @param {Character} Opponent - The NPC that will be the opponent for the fight
 * @param {string} Background - The background for the fight, changes depending on which room the battle is happening
 * @param {number} Difficulty - Difficulty modifier for the fight, higher is harder
 * @param {string} ReturnFunction - The callback to execute through CommonDynamicFunction
 * @returns {void} - Nothing
 */
function KidnapStart(Opponent, Background, Difficulty, ReturnFunction) {
	KidnapDifficulty = (Difficulty == null) ? 0 : Difficulty;
	KidnapVictory = false;
	KidnapReturnFunction = ReturnFunction;
	KidnapPlayerCloth = InventoryGet(Player, "Cloth");
	KidnapPlayerClothAccessory = InventoryGet(Player, "ClothAccessory");
	KidnapPlayerClothLower = InventoryGet(Player, "ClothLower");
	KidnapOpponentCloth = InventoryGet(Opponent, "Cloth");
	KidnapOpponentClothAccessory = InventoryGet(Opponent, "ClothAccessory");
	KidnapOpponentClothLower = InventoryGet(Opponent, "ClothLower");
	KidnapOpponent = Opponent;
	KidnapBackground = Background;
	MiniGameCheatAvailable = (CheatFactor("MiniGameBonus", 0) == 0);
	CurrentCharacter = null;
	if (KidnapReturnFunction.indexOf("Pandora") == 0) {
		Player.KidnapMaxWillpower = PandoraMaxWillpower;
		Player.KidnapWillpower = PandoraWillpower;
	} else {
		Player.KidnapMaxWillpower = 20 + (SkillGetLevel(Player, "Willpower") * 2);
		Player.KidnapWillpower = Player.KidnapMaxWillpower;
	}
	KidnapOpponent.KidnapMaxWillpower = 20 + (KidnapDifficulty * 2);
	KidnapOpponent.KidnapWillpower = KidnapOpponent.KidnapMaxWillpower;
	KidnapLoadStats(Player, 0);
	KidnapLoadStats(KidnapOpponent, Math.round(KidnapDifficulty / 2.5));
	KidnapBuildCards(Player);
	KidnapBuildCards(KidnapOpponent);
	KidnapSetMode("Intro");
	CommonSetScreen("MiniGame", "Kidnap");
}

/**
 * Draws the given character move.
 * @param {Character} C - Character to draw the move for
 * @param {string} Header - Text to display
 * @param {number} X - Position of the text to draw on the X axis, normally the position of the character
 * @returns {void} - Nothing
 */
function KidnapDrawMove(C, Header, X, Side) {
	DrawText(TextGet(Header), X, 50, "White", "Gray");
	for (let M = 0; M < C.KidnapCard.length; M++) {
		let Color = KidnapMoveEffective(C, C.KidnapCard[M].Move) ? "White" : "Silver";
		let Value = KidnapMoveEffective(C, C.KidnapCard[M].Move) ? C.KidnapCard[M].Value : Math.round(C.KidnapCard[M].Value / 2);
		let Text = TextGet(KidnapMoveType[C.KidnapCard[M].Move]);
		if (Value != null) Text = Text + " - " + Value.toString();
		DrawButton(X - 240, (M * 100) + 100, 480, 80, "", Color);
		DrawText(Text, X + ((Value != null) ? ((Side == "Left") ? -60 : 60) : 0), (M * 100) + 140, "Black", "Silver");
		if (Value != null) DrawImage("Screens/MiniGame/Kidnap/" + Side + KidnapRPS[C.KidnapCard[M].Move] + ".png", X + ((Side == "Left") ? 115 : -220), (M * 100) + 100);
	}
}

/**
 * Draws the upper hand moves
 * @returns {void} - Nothing
 */
function KidnapDrawMoveUpperHand() {
	var X = (KidnapUpperHandVictim.ID == 0) ? 1500 : 0;
	if (KidnapUpperHandVictim.ID == 0) DrawTextWrap(TextGet("UpperHand" + KidnapUpperHandMoveType[KidnapUpperHandSelection]), 10, 300, 580, 200, "White");
	DrawText(TextGet("UpperHandMove"), X + 250, 50, "white", "gray");
	for (let M = 0; M <= KidnapUpperHandMoveType.length - 1; M++)
		DrawButton(X + 50, (M * 100) + 100, 400, 70, TextGet(KidnapUpperHandMoveType[M]), (KidnapUpperHandVictim.ID != 0) ? ((KidnapUpperHandMoveAvailable(M, false)) ? "White" : "Pink") : ((KidnapUpperHandSelection == M) ? "Aquamarine" : "Pink"));
}

/**
 * Draws a large timer in the middle of the screen based on the kidnapping timer.
 * @returns {void} - Nothing
 */
function KidnapShowTimer() {
	if ((KidnapMode == "SelectItem") || (KidnapMode == "SelectMove") || (KidnapMode == "UpperHand") || (KidnapMode == "ShowMove")) {
		var Sec = Math.floor((KidnapTimer - CommonTime() + 1000) / 1000);
		MainCanvas.font = "italic 300 " + CommonGetFont(200);
		DrawText(Sec.toString(), (KidnapMode == "SelectItem") ? 500 : 1000, 500, (Sec <= 3) ? "red" : "white", "black");
		MainCanvas.font = CommonGetFont(36);
	}
}

/**
 * Draws a large title in the center of the screen.
 * @param {string} Title - Title to display on screen
 * @returns {void} - Nothing
 */
function KidnapTitle(Title) {
	MainCanvas.font = "italic 300 " + CommonGetFont(200);
	DrawText(Title, 1003, 503, "White");
	DrawText(Title, 997, 497, "Red");
	MainCanvas.font = CommonGetFont(36);
}

/**
 * Shows the items that can be used by the player.
 * @returns {void} - Nothing
 */
function KidnapShowItem() {

	// Draw the header
	DrawText(TextGet("SelectItemToUse"), 1375, 50, "white", "black");
	DrawButton(1750, 25, 225, 65, TextGet("Cancel"), "White");

	// For each items in the player inventory
	var X = 1000;
	var Y = 125;
	for (let I = 0; I < DialogInventory.length; I++) {
		const Item = DialogInventory[I];
		const Hover = MouseIn(X, Y, 225, 275) && !CommonIsMobile;
		const Background = Hover ? "cyan" : DialogInventory[I].Worn ? "pink" : "#fff";
		DrawAssetPreview(X, Y, Item.Asset, { Background });

		X = X + 250;
		if (X > 1800) {
			X = 1000;
			Y = Y + 300;
		}
	}

}

/**
 * Runs and draws the kidnapping minigame
 * @returns {void} - Nothing
 */
function KidnapRun() {

	// Draw the kidnap elements
	var X = 500;
	if (KidnapMode == "SelectItem") X = 0;
	DrawCharacter(Player, X, 0, 1);
	DrawCharacter(KidnapOpponent, X + 500, 0, 1);
	DrawProgressBar(X + 100, 960, 300, 35, Math.round(Player.KidnapWillpower / Player.KidnapMaxWillpower * 100));
	DrawProgressBar(X + 600, 960, 300, 35, Math.round(KidnapOpponent.KidnapWillpower / KidnapOpponent.KidnapMaxWillpower * 100));
	DrawText(Player.KidnapWillpower.toString(), X + 250, 979, "black", "white");
	DrawText(KidnapOpponent.KidnapWillpower.toString(), X + 750, 979, "black", "white");
	if (KidnapMode == "Intro") KidnapTitle(Player.Name + " vs " + KidnapOpponent.Name);
	if (KidnapMode == "SuddenDeath") KidnapTitle(TextGet("SuddenDeath"));
	if (KidnapMode == "End") KidnapTitle(((KidnapVictory) ? Player.Name : KidnapOpponent.Name) + " " + TextGet("Wins"));
	if (KidnapMode == "SelectMove") { KidnapDrawMove(Player, "SelectMove", 250, "Left"); KidnapDrawMove(KidnapOpponent, "OpponentMove", 1750, "Right"); }
	if (KidnapMode == "UpperHand") KidnapDrawMoveUpperHand();
	if (KidnapMode == "ShowMove") KidnapShowMove();
	if (KidnapMode == "SelectItem") KidnapShowItem();

	// If the time is over, we go to the next step
	if (CommonTime() >= KidnapTimer) {
		if (KidnapMode == "SelectMove") { KidnapSelectMove(Player.KidnapCard.length - 1); return; }
		if (KidnapMode == "End") { CommonDynamicFunction(KidnapReturnFunction); return; }
		if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || (KidnapMode == "UpperHand") || (KidnapMode == "SelectItem")) KidnapSetMode("SelectMove");
	} else KidnapShowTimer();

}

/**
 * Handles clicks in the kidnap mini game
 * @returns {void} - Nothing
 */
function KidnapClick() {

	// If we must end the fight
	if (KidnapMode == "End") { CommonDynamicFunction(KidnapReturnFunction); return; }

	// When the user wants to skip the result or upper hand selection from the AI
	if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0))) {
		KidnapSetMode("SelectMove");
		return;
	}

	// When the user selects a regular move
	if (KidnapMode == "SelectMove") {
		for (let M = 0; M < Player.KidnapCard.length; M++)
			if ((MouseX >= 10) && (MouseX <= 490) && (MouseY >= 100 + (M * 100)) && (MouseY <= 180 + (M * 100)))
				KidnapSelectMove(M);
		return;
	}

	// When the user selects a upper hand move
	if ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID > 0)) {
		for (let M = 0; M <= KidnapUpperHandMoveType.length - 1; M++)
			if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
				KidnapSelectMoveUpperHand(M);
		return;
	}

	// If we must cancel out and don't select any item
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 90))
		KidnapSetMode("SelectMove");

	// If the user clicks on one of the items to be applied to the opponent
	if ((KidnapMode == "SelectItem") && (MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000)) {

		// For each items in the player/opponent inventory
		var X = 1000;
		var Y = 125;
		for (let I = 0; I < DialogInventory.length; I++) {

			// If the item at position is clicked, we add the item to the opponent
			if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
				InventoryWear(KidnapOpponent, DialogInventory[I].Asset.Name, DialogInventory[I].Asset.Group.Name);
				KidnapSetMode("SelectMove");
				break;
			}

			// Change the X and Y position to get the next square
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}

		}

	}

}

/**
 * Handles the key press in the kidnap mini game, the C cheat key can help you recover some lost willpower
 * @returns {void} - Nothing
 */
function KidnapKeyDown() {
	if (MiniGameCheatKeyDown()) {
		Player.KidnapWillpower = Player.KidnapWillpower + 6;
		if (Player.KidnapWillpower > Player.KidnapMaxWillpower) Player.KidnapWillpower = Player.KidnapMaxWillpower;
	}
}
