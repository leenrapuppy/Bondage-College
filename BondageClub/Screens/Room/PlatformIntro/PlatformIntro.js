"use strict";
var PlatformIntroDrawAsset = -1;

/**
 * Loads the screen
 * @returns {void} - Nothing
 */
function PlatformIntroLoad() {
	PlatformIntroDrawAsset = -1;
}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformIntroRun() {

	DrawRect(0, 0, 2000, 1000, "#EEEEEE");

	// Gets the count & total of assets and loads 10 of them at each run
	PlatformIntroDrawAsset++;
	let Total = 0;
	let Count = 0;
	let Load = 10;
	let LastAnimCycle;
	for (let Char of PlatformTemplate) {
		for (let Anim of Char.Animation) {
			LastAnimCycle = -1;
			for (let C of Anim.Cycle) {
				if (C <= LastAnimCycle) break;
				LastAnimCycle = C;
				Total++;
				let FileName = "Screens/Room/Platform/Character/" + Char.Name + "/" + Char.Status + "/" + Anim.Name + "/" + C.toString() + ".png";
				let Obj = DrawCacheImage.get(FileName);
				if ((Obj != null) && (Obj.width != null) && (Obj.width > 0)) {
					if (Count == PlatformIntroDrawAsset) DrawImageZoomCanvas(FileName, MainCanvas, 0, 0, Obj.width, Obj.height, -50, 0, 1000, 1000);
					Count++;
				}
				else
				if (Load > 0) {
					DrawImage(FileName, 2000, 1000);
					Load--;
				}
			}
			if (Anim.CycleLeft != null) {
				LastAnimCycle = -1;
				for (let C of Anim.CycleLeft) {
					if (LastAnimCycle <= C) break;
					LastAnimCycle = C;
					Total++;
					let FileName = "Screens/Room/Platform/Character/" + Char.Name + "/" + Char.Status + "/" + Anim.Name + "Left/" + C.toString() + ".png";
					let Obj = DrawCacheImage.get(FileName);
					if ((Obj != null) && (Obj.width != null) && (Obj.width > 0)) {
						if (Count == PlatformIntroDrawAsset) DrawImageZoomCanvas(FileName, MainCanvas, 0, 0, Obj.width, Obj.height, -50, 0, 1000, 1000);
						Count++;
					}
					else
					if (Load > 0) {
						DrawImage(FileName, 2000, 1000);
						Load--;
					}
				}
			}
		}
		if ((PlatformIntroDrawAsset == Total) && (Char.Name == "Melody")) PlatformIntroDrawAsset = -1;
	}
	DrawText(TextGet("LoadingAssets") + " " + Count.toString() + " / " + Total.toString(), 1125, 930, "Black", "Silver");

	for (let X = 0; X <= 9; X++)
		DrawText(TextGet("Text" + X.toString()), 1400, 67 + X * 65, "Black", "Silver");

	for (let X = 0; X <= 9; X++)
		DrawButton(920 + (X % 5) * 200, 710 + Math.floor(X / 5) * 90, 160, 60, TextGet("Load") + " " + X.toString(), "White", "");

	DrawButton(1370, 900, 230, 60, TextGet("NewGame"), "White", "");
	DrawButton(1650, 900, 230, 60, TextGet("Cancel"), "White", "");

}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformIntroClick() {
	for (let X = 0; X <= 9; X++)
		if (MouseIn(920 + (X % 5) * 200, 710 + Math.floor(X / 5) * 90, 160, 60))
			PlatformLoadGame(X);
	if (MouseIn(1370, 900, 230, 60)) {
		PlatformDialogCharacter = JSON.parse(JSON.stringify(PlatformDialogCharacterTemplate));
		PlatformEvent = [];
		PlatformChar = [];
		PlatformParty = [];
		PlatformCreateCharacter("Melody", "Maid", 1000);
		PlatformPartyBuild();
		PlatformLoadRoom("BedroomMelody");
		PlatformDialogStart("IntroMelody");
	}
	if (MouseIn(1650, 900, 230, 60)) PlatformIntroExit();
}

/**
 * When the screens exits
 * @returns {void} - Nothing
 */
function PlatformIntroExit() {
	CommonSetScreen("Room", "MainHall");
}
