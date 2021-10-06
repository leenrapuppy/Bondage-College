"use strict";
var MagicBattleBackground = "";
var MagicBattleOpponent = null;
var MagicBattleReturnFunction = "";
var MagicBattleDifficulty = 0;
var MagicBattleVictory = false;
var MagicBattleAvailSpell = [];
var MagicBattleOpponentSpell = 0;
var MagicBattlePlayerAppearance = null;
var MagicBattleOpponentAppearance = null;

/**
 * Start a magic battle against an opponent
 * @returns {void} - Nothing
 */
function MagicBattleStart(Opponent, Difficulty, Background, FunctionName) {
	MagicBattlePlayerAppearance = CharacterAppearanceStringify(Player);
	MagicBattleOpponentAppearance = CharacterAppearanceStringify(Opponent);
	MagicBattleOpponent = Opponent;
	MagicBattleBackground = Background;
	MagicBattleReturnFunction = FunctionName;
	MagicBattleDifficulty = parseInt(Difficulty);
	if (isNaN(MagicBattleDifficulty)) MagicBattleDifficulty = 0;
	MagicBattleVictory = false;
	MagicBattleAvailSpell = MagicBattleGetAvailSpells(MagicBattleOpponent);
	DialogLeave();
	CommonSetScreen("MiniGame", "MagicBattle");
}

/**
 * Loads the magic battle
 * @returns {void} - Nothing
 */
function MagicBattleLoad() {
}

/**
 * Returns a difficulty factor based on the character nakedness and predicament
 * @returns {number} - Difficulty from 0 (full cloth, no restrain) to 10 (naked, fully restrained)
 */
function MagicBattleGetDifficulty(C) {
	let D = 0;
	if ((InventoryGet(C, "Cloth") == null) && (InventoryGet(C, "ClothLower") == null) && (InventoryGet(C, "ClothAccessory") == null) && (InventoryGet(C, "Shoes") == null)) D = D + 2;		
	if ((InventoryGet(C, "Bra") == null) && (InventoryGet(C, "Panties") == null) && (InventoryGet(C, "Socks") == null) && (InventoryGet(C, "Gloves") == null) && (InventoryGet(C, "Garters") == null) && (InventoryGet(C, "Corset") == null)) D = D + 2;
	if (InventoryGet(C, "ItemLegs") != null) D++; 
	if (InventoryGet(C, "ItemFeet") != null) D++;
	if (InventoryGet(C, "ItemArms") != null) D = D + 2;
	if (InventoryGet(C, "ItemTorso") != null) D = D + 2;
	return D;
}

/**
 * Returns the spells that are available based on opponent (C) clothing and restraints
 * @returns {void} - Nothing
 */
function MagicBattleGetAvailSpells(C) {
	if ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ClothLower") != null) || (InventoryGet(C, "ClothAccessory") != null) || (InventoryGet(C, "Shoes") != null)) {
		return [0];
	} else {
		let Spells = [];
		if ((InventoryGet(C, "Bra") != null) || (InventoryGet(C, "Panties") != null) || (InventoryGet(C, "Socks") != null) || (InventoryGet(C, "Gloves") != null) || (InventoryGet(C, "Garters") != null) || (InventoryGet(C, "Corset") != null))
			Spells.push(0);
		if ((InventoryGet(C, "ItemLegs") == null) || (InventoryGet(C, "ItemFeet") == null))
			Spells.push(1);
		else
			if ((InventoryGet(C, "ItemArms") == null) || (InventoryGet(C, "ItemTorso") == null))
				Spells.push(2);
		if (InventoryGet(C, "ItemArms") != null)
			Spells.push(3);
		return Spells;
	}
}

/**
 * Runs the magic battle, 1 player vs 1 opponent
 * @returns {void} - Nothing
 */
function MagicBattleRun() {
	DrawRect(0, 0, 2000, 1000, "#00000080");
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(MagicBattleOpponent, 1250, 0, 1);
	DrawText(TextGet("MagicBattle"), 1000, 150, "White", "Black");
	if (Player.CanTalk() && MagicBattleOpponent.CanTalk()) {
		DrawText(TextGet("SelectSpell"), 1000, 300, "White", "Black");
		for (let S = 0; S < MagicBattleAvailSpell.length; S++)
			DrawButton(800, 500 + S * 100, 400, 60, TextGet("Spell" + MagicBattleAvailSpell[S].toString() + "Name"), "White", "", TextGet("Spell" + MagicBattleAvailSpell[S].toString() + "Hover"));
	} else {
		DrawText(TextGet(Player.CanTalk() ? "Won" : "Lost"), 1000, 300, "White", "Black");
		DrawButton(800, 600, 400, 60, TextGet("EndBattle"), "White", "");
	}
}

/**
 * Handles clicks during the game
 * @returns {void} - Nothing
 */
function MagicBattleClick() {
	if (Player.CanTalk() && MagicBattleOpponent.CanTalk())
		for (let S = 0; S < MagicBattleAvailSpell.length; S++)
			if (MouseIn(800, 500 + S * 100, 400, 60))
				return MagicBattleSpellStart(MagicBattleAvailSpell[S]);
	if (((!Player.CanTalk() || !MagicBattleOpponent.CanTalk())) && (MouseIn(800, 600, 400, 60)))
		CommonDynamicFunction(MagicBattleReturnFunction + "()");
}

/**
 * Starts the magic puzzle mini-game for a specific spell (S)
 * @returns {void} - Nothing
 */
function MagicBattleSpellStart(S) {

	// Gets the timer difficulty based on the spell cast by the opponent
	let Spells = MagicBattleGetAvailSpells(Player);
	MagicBattleOpponentSpell = Spells[Math.floor(Spells.length * Math.random())];
	let Difficulty = (3 + (MagicBattleOpponentSpell * 2)) * (2 - MagicBattleDifficulty * 0.1) * (1 + MagicBattleGetDifficulty(MagicBattleOpponent) * 0.1);

	// Launches the magic puzzle mini game for that spell
	MagicPuzzleSpell = S;
	MiniGameStart("MagicPuzzle", Difficulty, "MagicBattleSpellEnd");

}

/**
 * When the spell ends, we apply the effect of the spell on the loser
 * @returns {void} - Nothing
 */
function MagicBattleSpellEnd() {
	let Spell = MiniGameVictory ? MagicPuzzleSpell : MagicBattleOpponentSpell;
	let C = MiniGameVictory ? MagicBattleOpponent : Player;
	if (Spell == 0) {
		if ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ClothLower") != null) || (InventoryGet(C, "ClothAccessory") != null) || (InventoryGet(C, "Shoes") != null)) {
			InventoryRemove(C, "Cloth", false);
			InventoryRemove(C, "ClothLower", false);
			InventoryRemove(C, "ClothAccessory", false);
			InventoryRemove(C, "Shoes", false);
		} else {
			InventoryRemove(C, "Bra", false);
			InventoryRemove(C, "Panties", false);
			InventoryRemove(C, "Socks", false);
			InventoryRemove(C, "Gloves", false);
			InventoryRemove(C, "Corset", false);
			InventoryRemove(C, "Garters", false);
		}
		CharacterRefresh(C);
	}
	if (Spell == 1) {
		InventoryWear(C, "HempRope", "ItemLegs");
		InventoryWear(C, "HempRope", "ItemFeet");
	}
	if (Spell == 2) {
		if (InventoryGet(C, "ItemArms") == null) {
			InventoryWear(C, "HempRope", "ItemArms");
		} else {
			InventoryWear(C, "HempRopeHarness", "ItemTorso");
			InventoryGet(C, "ItemTorso").Property = { Type: "Diamond", Difficulty: 0, Effect: [] };
			CharacterRefresh(C);
		}
	}
	if (Spell == 3)
		InventoryWearRandom(C, "ItemMouth", MagicBattleDifficulty);
	if (MiniGameVictory) MagicBattleAvailSpell = MagicBattleGetAvailSpells(MagicBattleOpponent);
	CommonSetScreen("MiniGame", "MagicBattle");
}

/**
 * Handles the key press in the game, the C key for cheats
 * @returns {void} - Nothing
 */
function MagicBattleKeyDown() {
	//if (MiniGameCheatKeyDown()) 
}
