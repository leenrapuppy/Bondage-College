"use strict";
var MagicBattleBackground = "";
var MagicBattleOpponent = null;
var MagicBattleReturnFunction = "";
var MagicBattleDifficulty = 0;
var MagicBattleVictory = false;

/**
 * Loads the magic puzzle mini game and sets the difficulty ratio
 * @returns {void} - Nothing
 */
function MagicBattleStart(Opponent, Difficulty, Background, FunctionName) {
	MagicBattleOpponent = Opponent;
	MagicBattleBackground = Background;
	MagicBattleReturnFunction = FunctionName;
	MagicBattleDifficulty = parseInt(Difficulty);
	if (isNaN(MagicBattleDifficulty)) MagicBattleDifficulty = 0;
	MagicBattleVictory = false;
	DialogLeave();
	CommonSetScreen("MiniGame", "MagicBattle");
}

function MagicBattleLoad() {
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
	DrawText(TextGet("SelectSpell"), 1000, 300, "White", "Black");
}

/**
 * Handles clicks during the game
 * @returns {void} - Nothing
 */
function MagicBattleClick() {
	if (MouseIn(0, 950, 2000, 50))
		CommonDynamicFunction(MagicBattleReturnFunction + "()");
}

/**
 * Handles the key press in the game, the C key for cheats
 * @returns {void} - Nothing
 */
function MagicBattleKeyDown() {
	//if (MiniGameCheatKeyDown()) 
}
