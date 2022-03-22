"use strict";
var PlatformIntroBackground = "Sheet";
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
	
	// Gets the count & total of assets and loads 10 of them at each run
	PlatformIntroDrawAsset++;
	let Total = 0;
	let Count = 0;
	let Load = 10;
	for (let Char of PlatformTemplate) {
		for (let Anim of Char.Animation) {
			Total = Total + Anim.Cycle.length;
			for (let C of Anim.Cycle) {
				let FileName = "Screens/Room/Platform/Characters/" + Char.Name + "/" + Char.Status + "/" + Anim.Name + "/" + C.toString() + ".png";
				let Obj = DrawCacheImage.get(FileName);
				if ((Obj != null) && (Obj.width != null) && (Obj.width > 0)) {
					if (Count == PlatformIntroDrawAsset) DrawImageZoomCanvas(FileName, MainCanvas, 0, 0, Obj.width, Obj.height, 50, 75, 850, 850);
					Count++;
				}
				else
					if (Load > 0) {
						DrawImage(FileName, 2000, 1000);
						Load--;
					}
			}
			if (Anim.CycleLeft != null) {
				Total = Total + Anim.CycleLeft.length;
				for (let C of Anim.CycleLeft) {
					let FileName = "Screens/Room/Platform/Characters/" + Char.Name + "/" + Char.Status + "/" + Anim.Name + "Left/" + C.toString() + ".png";
					let Obj = DrawCacheImage.get(FileName);
					if ((Obj != null) && (Obj.width != null) && (Obj.width > 0)) {
						if (Count == PlatformIntroDrawAsset) DrawImageZoomCanvas(FileName, MainCanvas, 0, 0, Obj.width, Obj.height, 50, 75, 850, 850);
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
	DrawText(TextGet("LoadingAssets") + " " + Count.toString() + " / " + Total.toString(), 1150, 870);
	
	for (let X = 0; X <= 9; X++)
		DrawText(TextGet("Text" + X.toString()), 1400, 120 + X * 72, "Black", "Silver");
		
	DrawButton(1400, 840, 200, 60, TextGet("Launch"), "White", "");
	DrawButton(1650, 840, 200, 60, TextGet("Cancel"), "White", "");
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformIntroClick() {
	if (MouseIn(1400, 840, 200, 60)) PlatformDialogStart("Intro");
	if (MouseIn(1650, 840, 200, 60)) PlatformExit();
}

/**
 * When the screens exits
 * @returns {void} - Nothing
 */
function PlatformIntroExit() {
	CommonSetScreen("Room", "MainHall");
}