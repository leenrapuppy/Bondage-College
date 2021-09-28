"use strict";
var MagicPuzzleBackground = "MagicPuzzle/0";
var MagicPuzzleStart = 0;
var MagicPuzzleFinish = 0;
var MagicPuzzleSize = 0;
var MagicPuzzleSpell = 0;
var MagicPuzzleStarted = false;

/**
 * Loads the magic puzzle mini game and sets the difficulty ratio
 * @returns {void} - Nothing
 */
function MagicPuzzleLoad() {
	MagicPuzzleBackground = "MagicPuzzle/" + MagicPuzzleSpell;
	MagicPuzzleStart = CommonTime() + 5000;
	MagicPuzzleFinish = 0;
	MagicPuzzleSize = 10;
	if (InventoryGet(Player, "Cloth") == null) MagicPuzzleSize = MagicPuzzleSize + 5;
	if (InventoryGet(Player, "ItemLegs") != null) MagicPuzzleSize = MagicPuzzleSize + 5;
	if (InventoryGet(Player, "ItemArms") != null) MagicPuzzleSize = MagicPuzzleSize + 5;
	MagicPuzzleStarted = false;
	MiniGameVictory = false;
}

/**
 * Returns the time in seconds with 3 digits milliseconds
 * @returns {void} - Nothing
 */
function MagicPuzzleTime(Time) {
	Time = Time.toString();
	if (Time.indexOf(".") < 0) Time = Time + ".";
	while (Time.indexOf(".") > Time.length - 4)
		Time = Time + "0";
	return Time;
}

/**
 * Validates where the puzzle square is, validated 4 times for each end of the square
 * @returns {void} - Nothing
 */
function MagicPuzzleValidate(X, Y) {
	
	// Gets the pixel color at position
	if (MiniGameEnded) return;
	if ((X < 0) || (X > 1999)) X = 0;
	if ((Y < 0) || (Y > 999)) Y = 0;
	let Data = MainCanvas.getImageData(X, Y, 1, 1).data;
	
	// In the black zone, ends in failure
	if (Data[0] + Data[1] + Data[2] < 100) {
		MiniGameEnded = true;
		MagicPuzzleFinish = CommonTime();
		return;
	}
	
	// When starting the game, fully in the green zone
	if (((Data[0] > 100) || (Data[2] > 100)) && !MagicPuzzleStarted) {
		MiniGameEnded = true;
		MagicPuzzleFinish = CommonTime();
		return;
	}
	
	// When reaching the red zone, it ends in victory
	if ((Data[0] > 100) && (Data[1] < 100) && (Data[2] < 100) && MagicPuzzleStarted) {
		MiniGameEnded = true;
		MiniGameVictory = true;
		MagicPuzzleFinish = CommonTime();
		return;
	}

}

/**
 * Runs the magic puzzle mini game
 * @returns {void} - Nothing
 */
function MagicPuzzleRun() {

	// When the game is running, we make sure the end borders never hit the black zone
	if (!MiniGameEnded && (CommonTime() >= MagicPuzzleStart)) {
		MagicPuzzleValidate(MouseX - MagicPuzzleSize, MouseY - MagicPuzzleSize);
		MagicPuzzleValidate(MouseX - MagicPuzzleSize, MouseY + MagicPuzzleSize);
		MagicPuzzleValidate(MouseX + MagicPuzzleSize, MouseY - MagicPuzzleSize);
		MagicPuzzleValidate(MouseX + MagicPuzzleSize, MouseY + MagicPuzzleSize);
		MagicPuzzleStarted = true;
	}

	// Draw the game text and square
	if (MiniGameEnded) {
		if (MiniGameVictory)
			DrawText(TextGet("SuccessMessage") + " " + MagicPuzzleTime((MagicPuzzleFinish - MagicPuzzleStart) / 1000), 1000, 975, "#C0FFC0", "grey");
		else
			DrawText(TextGet("FailMessage") + " " + MagicPuzzleTime((MagicPuzzleFinish - MagicPuzzleStart) / 1000), 1000, 975, "#FFC0C0", "grey");
	} else {
		if (CommonTime() < MagicPuzzleStart)
			DrawText(TextGet("StartMessage") + " " + MagicPuzzleTime((MagicPuzzleStart - CommonTime()) / 1000), 1000, 975, "#FFFFFF", "grey");
		else
			DrawText(TextGet("GameMessage") + " " + MagicPuzzleTime((CommonTime() - MagicPuzzleStart) / 1000), 1000, 975, "#C0C0FF", "grey");
	}
	if (MouseIn(0, 0, 2000, 950))
		DrawRect(MouseX - MagicPuzzleSize, MouseY - MagicPuzzleSize, MagicPuzzleSize * 2, MagicPuzzleSize * 2, "Blue");
	
}

/**
 * Handles clicks during the mini game, the bottom part will end the game
 * @returns {void} - Nothing
 */
function MagicPuzzleClick() {
	if (MiniGameEnded && (MouseIn(0, 950, 2000, 50)))
		CommonDynamicFunction(MiniGameReturnFunction + "()");
}

/**
 * Handles the key press in the mini game, the C key for cheats
 * @returns {void} - Nothing
 */
function MagicPuzzleKeyDown() {
	//if (MiniGameCheatKeyDown()) 
}
