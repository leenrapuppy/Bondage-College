"use strict";
var MagicBattleBackground = "";
/** @type {null | Character} */
var MagicBattleOpponent = null;
var MagicBattleReturnFunction = "";
var MagicBattleDifficulty = 0;
var MagicBattleVictory = false;
/** @type {number[]} */
var MagicBattleAvailSpell = [];
var MagicBattleOpponentSpell = 0;
/** @type {null | string} */
var MagicBattlePlayerAppearance = null;
/** @type {null | string} */
var MagicBattleOpponentAppearance = null;
var MagicBattleSpellDifficulty = [3, 5, 7, 9, 6, 8, 4, 8];

/**
 * Start a magic battle against an opponent
 * @param {Character} Opponent
 * @param {number} Difficulty
 * @param {string} Background
 * @param {string} FunctionName
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
 * @param {Character} C
 * @returns {number} - Difficulty from 0 (full cloth, no restrain) to 10 (naked, fully restrained)
 */
function MagicBattleGetDifficulty(C) {
	let D = 0;
	let NF = ((C.ID == 0) && (ReputationGet("HouseAmplector") >= 100) && LogQuery("Mastery", "MagicSchool")) ? 0 : 1; // House Amplector masters aren't affected by nudity
	let BF = ((C.ID == 0) && (ReputationGet("HouseMaiestas") >= 100) && LogQuery("Mastery", "MagicSchool")) ? 0.5 : 1; // House Maiestas masters are half affected by bondage items
	if ((InventoryGet(C, "Cloth") == null) && (InventoryGet(C, "ClothLower") == null) && (InventoryGet(C, "ClothAccessory") == null) && (InventoryGet(C, "Shoes") == null)) D = D + 2 * NF;
	if ((InventoryGet(C, "Bra") == null) && (InventoryGet(C, "Panties") == null) && (InventoryGet(C, "Socks") == null) && (InventoryGet(C, "Gloves") == null) && (InventoryGet(C, "Garters") == null) && (InventoryGet(C, "Corset") == null)) D = D + 3 * NF;
	if (InventoryGet(C, "ItemLegs") != null) D = D + 1 * BF;
	if (InventoryGet(C, "ItemFeet") != null) D = D + 1 * BF;
	if (InventoryIsWorn(C, "HempRope", "ItemArms")) D = D + 1 * BF;
	if (InventoryIsWorn(C, "Chains", "ItemArms")) D = D + 3 * BF;
	if (InventoryIsWorn(C, "Chains", "LeatherArmbinder")) D = D + 4 * BF;
	if (InventoryIsWorn(C, "Chains", "ArmbinderJacket")) D = D + 4 * BF;
	if (InventoryIsWorn(C, "Chains", "BoxTieArmbinder")) D = D + 4 * BF;
	if (InventoryIsWorn(C, "Chains", "LatexArmbinder")) D = D + 4 * BF;
	if (InventoryIsWorn(C, "Chains", "SeamlessLatexArmbinder")) D = D + 4 * BF;
	if (InventoryIsWorn(C, "HempRopeHarness", "ItemTorso")) D = D + 2 * BF;
	if (InventoryIsWorn(C, "CrotchChain", "ItemTorso")) D = D + 4 * BF;
	return D;
}

/**
 * Returns the spells that are available based on opponent (C) clothing and restraints
 * @param {Character} C
 * @returns {Array<number>} - Nothing
 */
function MagicBattleGetAvailSpells(C) {
	if (C == null) return [];
	if ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ClothLower") != null) || (InventoryGet(C, "ClothAccessory") != null) || (InventoryGet(C, "Shoes") != null)) {
		if ((ReputationGet("HouseCorporis") >= 100) && LogQuery("Mastery", "MagicSchool"))
			return [0, 6]; // Strip & double-strip spell if Corporis master
		else
			return [0]; // Strip spell
	} else {
		let Spells = [];
		if ((InventoryGet(C, "Bra") != null) || (InventoryGet(C, "Panties") != null) || (InventoryGet(C, "Socks") != null) || (InventoryGet(C, "Gloves") != null) || (InventoryGet(C, "Garters") != null) || (InventoryGet(C, "Corset") != null))
			Spells.push(0); // Strip spell
		if ((InventoryGet(C, "ItemLegs") == null) || (InventoryGet(C, "ItemFeet") == null)) {
			Spells.push(1); // Rope legs spell
			Spells.push(4); // Chain legs spell
		} else {
			if ((InventoryGet(C, "ItemArms") == null) || (InventoryGet(C, "ItemTorso") == null)) {
				Spells.push(2); // Rope arms/torso spell
				Spells.push(5); // Chain arms/torso spell
			}
			if ((ReputationGet("HouseVincula") >= 100) && LogQuery("Mastery", "MagicSchool") && (InventoryGet(C, "ItemArms") == null))
				Spells.push(7); // Armbinder spell
		}
		if (InventoryGet(C, "ItemArms") != null)
			Spells.push(3); // Random gag spell
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
 * @param {number} S
 * @returns {void} - Nothing
 */
function MagicBattleSpellStart(S) {

	// Gets the timer difficulty based on the spell cast by the opponent
	let Spells = MagicBattleGetAvailSpells(Player);
	MagicBattleOpponentSpell = Spells[Math.floor(Spells.length * Math.random())];
	let Difficulty = MagicBattleSpellDifficulty[MagicBattleOpponentSpell] * (2 - MagicBattleDifficulty * 0.1) * (1 + MagicBattleGetDifficulty(MagicBattleOpponent) * 0.1);

	// Launches the magic puzzle mini game for that spell
	MagicPuzzleSpell = S;
	MagicPuzzleAutoExit = false;
	MiniGameStart("MagicPuzzle", Difficulty, "MagicBattleSpellEnd");

}

/**
 * Applies the effect of a magic spell (Spell) on a character (C)
 * @param {Character} C
 * @param {number} Spell
 * @returns {void} - Nothing
 */
function MagicSpellEffect(C, Spell) {

	// Strip spell
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

	// Rope legs spell
	if (Spell == 1) {
		InventoryWear(C, "HempRope", "ItemLegs");
		InventoryWear(C, "HempRope", "ItemFeet");
	}

	// Rope arms/torso spell
	if (Spell == 2) {
		if (InventoryGet(C, "ItemArms") == null) {
			InventoryWear(C, "HempRope", "ItemArms");
		} else {
			InventoryWear(C, "HempRopeHarness", "ItemTorso");
			InventoryGet(C, "ItemTorso").Property = { Type: "Diamond", Difficulty: 0, Effect: [] };
			CharacterRefresh(C);
		}
	}

	// Random gag spell
	if (Spell == 3)
		InventoryWearRandom(C, "ItemMouth", MagicBattleDifficulty);

	// Chain legs spell
	if (Spell == 4) {
		InventoryWear(C, "Chains", "ItemLegs");
		InventoryWear(C, "Chains", "ItemFeet");
	}

	// Chain arms/torso spell
	if (Spell == 5) {
		if (InventoryGet(C, "ItemArms") == null)
			InventoryWear(C, "Chains", "ItemArms");
		else
			InventoryWear(C, "CrotchChain", "ItemTorso");
	}

	// Double strip spell (House Corporis only)
	if (Spell == 6) {
		InventoryRemove(C, "Cloth", false);
		InventoryRemove(C, "ClothLower", false);
		InventoryRemove(C, "ClothAccessory", false);
		InventoryRemove(C, "Shoes", false);
		InventoryRemove(C, "Bra", false);
		InventoryRemove(C, "Panties", false);
		InventoryRemove(C, "Socks", false);
		InventoryRemove(C, "Gloves", false);
		InventoryRemove(C, "Corset", false);
		InventoryRemove(C, "Garters", false);
		CharacterRefresh(C);
	}

	// Armbinder spell (House Vincula only)
	if (Spell == 7)
		InventoryWear(C, CommonRandomItemFromList("", ["LeatherArmbinder", "ArmbinderJacket", "BoxTieArmbinder", "LatexArmbinder", "SeamlessLatexArmbinder"]), "ItemArms");

}

/**
 * When the spell ends, we apply the effect of the spell on the loser
 * @returns {void} - Nothing
 */
function MagicBattleSpellEnd() {
	let Spell = MiniGameVictory ? MagicPuzzleSpell : MagicBattleOpponentSpell;
	let C = MiniGameVictory ? MagicBattleOpponent : Player;
	MagicSpellEffect(C, Spell);
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
