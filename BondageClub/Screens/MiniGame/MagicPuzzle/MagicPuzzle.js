"use strict";
var MagicPuzzleBackground = "MagicSchoolLaboratory";
var MagicPuzzleStart = 0;
var MagicPuzzleFinish = 0;
var MagicPuzzleSize = 0;
var MagicPuzzleSpell = 0;
var MagicPuzzleAutoExit = false;
var MagicPuzzleStarted = false;
var MagicPuzzleTimer = 0;
var MagicPuzzleLastMouseX = 0;
var MagicPuzzleLastMouseY = 0;
/** @type { { X: number, Y: number }[] } */
var MagicPuzzleTrail = [];
var MagicPuzzleTrailLimit = 20;
var MagicPuzzleTrailRainbow = false;

/**
 * Loads the magic puzzle mini game and sets the difficulty ratio
 * @returns {void} - Nothing
 */
function MagicPuzzleLoad() {
	if (CommonIsMobile) document.addEventListener("touchmove", MagicPuzzleTouchMove);
	MagicPuzzleStart = CommonTime() + 5000;
	MagicPuzzleFinish = 0;
	MagicPuzzleSize = 10 + Math.round(MagicBattleGetDifficulty(Player) * 1.5);
	MagicPuzzleTimer = (MiniGameDifficulty > 0) ? CommonTime() + 5000 + MiniGameDifficulty * 1000 : 0;
	MagicPuzzleStarted = false;
	MiniGameVictory = false;
	MagicPuzzleTrailRainbow = ((InventoryGet(Player, "ItemHandheld") != null) && (InventoryGet(Player, "ItemHandheld").Asset.Name === "RainbowWand"));
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

	// In the dark zone, ends in failure
	if ((Data[0] < 100) && (Data[1] < 100) && (Data[2] < 100)) {
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
 * Prevents cheats in the mini-game by validating the last X and Y positions
 * @returns {void} - Nothing
 */
function MagicPuzzleAntiCheat() {
	if (MagicPuzzleStarted) {
		if ((Math.abs(MouseX - MagicPuzzleLastMouseX) >= 200) || (Math.abs(MouseY - MagicPuzzleLastMouseY) >= 200) || (Math.abs(MouseX + MouseY - MagicPuzzleLastMouseX - MagicPuzzleLastMouseY) >= 300)) {
			MiniGameEnded = true;
			MagicPuzzleFinish = CommonTime();
			return;
		}
	}
	MagicPuzzleLastMouseX = MouseX;
	MagicPuzzleLastMouseY = MouseY;
}

/**
 * On mobile only, when the finger is dragged on the screen, we change the MouseX & MouseY to process the game
 * @param {TouchEvent} Event - contains the X & Y coordinates on where the finger is positioned
 * @returns {void} - Nothing
 */
function MagicPuzzleTouchMove(Event) {
	if ((Event == null) || (Event.changedTouches == null) || (Event.changedTouches.length == 0) || (Event.changedTouches[0].clientX == null) || (Event.changedTouches[0].clientY == null)) return;
	MouseX = (Event.changedTouches[0].clientX - MainCanvas.canvas.offsetLeft) / MainCanvas.canvas.clientWidth * 2000;
	MouseY = (Event.changedTouches[0].clientY - MainCanvas.canvas.offsetTop) / MainCanvas.canvas.clientHeight * 1000;
}

/**
 * Runs the magic puzzle mini game
 * @returns {void} - Nothing
 */
function MagicPuzzleRun() {

	// Draw the puzzle over the background
	DrawImage("Screens/MiniGame/MagicPuzzle/" + MagicPuzzleSpell + ".png", 0, 0);

	// Build the trail following the square position
	MagicPuzzleBuildTrail();

	// When the game is running, we make sure the end borders never hit the black zone
	if (!MiniGameEnded && (CommonTime() >= MagicPuzzleStart)) {
		MagicPuzzleAntiCheat();
		MagicPuzzleValidate(MouseX - MagicPuzzleSize, MouseY - MagicPuzzleSize);
		MagicPuzzleValidate(MouseX - MagicPuzzleSize, MouseY + MagicPuzzleSize);
		MagicPuzzleValidate(MouseX + MagicPuzzleSize, MouseY - MagicPuzzleSize);
		MagicPuzzleValidate(MouseX + MagicPuzzleSize, MouseY + MagicPuzzleSize);
		MagicPuzzleStarted = true;
	}

	// If there's a timer and it runs out
	if (!MiniGameEnded && (MagicPuzzleTimer > 0) && (CommonTime() > MagicPuzzleTimer)) {
		MagicPuzzleFinish = CommonTime();
		MiniGameEnded = true;
	}

	// Draw the game text
	if (MiniGameEnded) {
		if (MagicPuzzleAutoExit) return MagicPuzzleEnd();
		if (MiniGameVictory)
			DrawText(TextGet("SuccessMessage") + " " + MagicPuzzleTime((MagicPuzzleFinish - MagicPuzzleStart) / 1000), 1000, 975, "#C0FFC0", "grey");
		else
			DrawText(TextGet("FailMessage") + " " + MagicPuzzleTime((MagicPuzzleFinish - MagicPuzzleStart) / 1000), 1000, 975, "#FFC0C0", "grey");
	} else {
		if (CommonTime() < MagicPuzzleStart)
			DrawText(TextGet("StartMessage") + " " + MagicPuzzleTime((MagicPuzzleStart - CommonTime()) / 1000), 1000, 975, "#FFFFFF", "grey");
		else
		if (MagicPuzzleTimer == 0)
			DrawText(TextGet("GameMessage") + " " + MagicPuzzleTime((CommonTime() - MagicPuzzleStart) / 1000), 1000, 975, "#C0C0FF", "grey");
		else {
			let Pos = 100 - (CommonTime() - MagicPuzzleStart) / (MagicPuzzleTimer - MagicPuzzleStart) * 100;
			DrawProgressBar(0, 950, 2000, 50, Pos);
			DrawText(TextGet("GameMessage") + " " + MagicPuzzleTime((CommonTime() - MagicPuzzleStart) / 1000), 1000, 975, "black", "white");
		}
	}

	// Draw the trail of previous square positions
	if (MagicPuzzleStart <= CommonTime()) MagicPuzzleDrawTrail();

	// Draw the current square position
	if (MouseIn(0, 0, 2000, 950))
		DrawRect(MouseX - MagicPuzzleSize, MouseY - MagicPuzzleSize, MagicPuzzleSize * 2, MagicPuzzleSize * 2, "Blue");

}

/**
 * Add the current square position onto the trail and trim the end
 * @returns {void} - Nothing
 */
function MagicPuzzleBuildTrail() {
	if (MagicPuzzleStart <= CommonTime()) {
		let nextSquare = null;
		if (!MiniGameEnded || MagicPuzzleTrail.length == 0) {
			nextSquare = { X: MouseX, Y: MouseY };
		}
		else {
			const lastSquare = MagicPuzzleTrail[MagicPuzzleTrail.length - 1];
			nextSquare = { X: lastSquare.X, Y: lastSquare.Y };
		}
		MagicPuzzleTrail.push(nextSquare);
	}

	if (MagicPuzzleTrail.length > MagicPuzzleTrailLimit) {
		MagicPuzzleTrail.shift();
	}
}

/**
 * Draw a trail of faded past squares following the current square's position
 * @returns {void} - Nothing
 */
function MagicPuzzleDrawTrail() {
	if (MagicPuzzleTrail.length > 0) {
		const initialSquares = { first: MagicPuzzleTrail[0], second: MagicPuzzleTrail[0] };

		MagicPuzzleTrail.reduce((prevSquares, currSquare, index) => {
			const startingColor = MagicPuzzleTrailRainbow ? ColorPickerHSVToCSS({ H: Math.random(), S: 1, V: 1 }) : "#0000FF";
			const fadePercentage = 0.8 * index / MagicPuzzleTrail.length;
			const squareColor = MagicPuzzleTransitionToColor(startingColor, "#FFFFFF", fadePercentage);

			DrawLineCorner(currSquare.X, currSquare.Y,
				prevSquares.first.X, prevSquares.first.Y,
				prevSquares.second.X, prevSquares.second.Y,
				MagicPuzzleSize * 2,
				squareColor);

			return { first: currSquare, second: prevSquares.first };
		}, initialSquares);
	}
}

/**
 * Adjust one colour to be closer to another
 * @param {HexColor} startingColor - Hex code of the starting colour
 * @param {HexColor} targetColor - Hex code of the colour to transition to
 * @param {number} progressPercentage - The percentage the colour should transition, with 0 = none and 1 = fully
 * @returns {HexColor} - The final composed colour
 */
function MagicPuzzleTransitionToColor(startingColor, targetColor, progressPercentage) {
	const startRgb = DrawHexToRGB(startingColor);
	const targetRgb = DrawHexToRGB(targetColor);

	const newR = Math.round(targetRgb.r - (targetRgb.r - startRgb.r) * progressPercentage);
	const newG = Math.round(targetRgb.g - (targetRgb.g - startRgb.g) * progressPercentage);
	const newB = Math.round(targetRgb.b - (targetRgb.b - startRgb.b) * progressPercentage);

	const finalColor = DrawRGBToHex([newR, newG, newB]);
	return finalColor;
}

/**
 * Handles clicks during the mini game, the bottom part will end the game
 * @returns {void} - Nothing
 */
function MagicPuzzleClick() {
	if (MiniGameEnded && (MouseIn(0, 950, 2000, 50)))
		MagicPuzzleEnd();
}

/**
 * Handles the key press in the mini game, the C key for cheats adds 5 seconds to the enemy timer
 * @returns {void} - Nothing
 */
function MagicPuzzleKeyDown() {
	if (MiniGameCheatKeyDown() && (MagicPuzzleTimer > 0) && !MagicPuzzleAutoExit)
		MagicPuzzleTimer = MagicPuzzleTimer + 5000;
}

/**
 * When the magic puzzle must end
 * @returns {void} - Nothing
 */
function MagicPuzzleEnd() {
	MagicPuzzleTrail = [];
	if (CommonIsMobile) document.removeEventListener("touchmove", MagicPuzzleTouchMove);
	CommonDynamicFunction(MiniGameReturnFunction + "()");
}
