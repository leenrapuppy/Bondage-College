"use strict";
var PlatformBackground = "CollegeClass2";
var PlatformChar = [];
var PlatformPlayer = null;
var PlatformLastTime = null;
var PlatformKeys = [];
var PlatformFloor = 475;
var PlatformTemplate = [
	{
		Name: "College",
		Status: "Nude",
		X: 1000,
		Y: PlatformFloor,
		ForceX: 0,
		ForceY: 0,
		FaceLeft: false,
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 }
		]
	}
];

/**
 * Loads the screen
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);	
	PlatformChar = [];
	PlatformChar.push(PlatformTemplate[0]);
	PlatformPlayer = PlatformChar[0];
}

function PlatformGetAnim(C, Pose) {
	for (let A = 0; A < C.Animation.length; A++)
		if (C.Animation[A].Name == Pose)
			return {
				Image: C.Animation[A].Cycle[Math.floor(CommonTime() / C.Animation[A].Speed) % C.Animation[A].Cycle.length],
				Width: C.Animation[A].Width,
				Height: C.Animation[A].Height
			}
	return null;
}

function PlatformDrawCharacters() {

	let PlatformTime = CommonTime();
	if (PlatformLastTime == null) PlatformLastTime = PlatformTime;

	if ((PlatformKeys.indexOf(65) >= 0) || (PlatformKeys.indexOf(97) >= 0)) {
		if (PlatformPlayer.ForceX > 0) PlatformPlayer.ForceX = 0;
		else {
			if ((PlatformPlayer.Y == PlatformFloor) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)))
				PlatformPlayer.ForceX = PlatformPlayer.ForceX - Math.round((PlatformTime - PlatformLastTime) / 8);
			else
				PlatformPlayer.ForceX = PlatformPlayer.ForceX - Math.round((PlatformTime - PlatformLastTime) / 4);
		}
	}
		
	if ((PlatformKeys.indexOf(68) >= 0) || (PlatformKeys.indexOf(100) >= 0)) {
		if (PlatformPlayer.ForceX < 0) PlatformPlayer.ForceX = 0;
		else {
			if ((PlatformPlayer.Y == PlatformFloor) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)))
				PlatformPlayer.ForceX = PlatformPlayer.ForceX + Math.round((PlatformTime - PlatformLastTime) / 8);
			else
				PlatformPlayer.ForceX = PlatformPlayer.ForceX + Math.round((PlatformTime - PlatformLastTime) / 4);
		}
	}

	if ((PlatformKeys.indexOf(32) >= 0) && (PlatformPlayer.Y == PlatformFloor)) {
		PlatformPlayer.ForceY = -45;
	}

	if ((PlatformKeys.indexOf(32) < 0) && (PlatformPlayer.ForceY < 0))
		PlatformPlayer.ForceY = PlatformPlayer.ForceY + Math.round((PlatformTime - PlatformLastTime) / 7);
	
	for (let C = 0; C < PlatformChar.length; C++) {
		PlatformChar[C].X = PlatformChar[C].X + PlatformChar[C].ForceX;
		if (PlatformChar[C].X < 100) PlatformChar[C].X = 100;
		if (PlatformChar[C].X >= 1900) PlatformChar[C].X = 1900;
		PlatformChar[C].Y = PlatformChar[C].Y + PlatformChar[C].ForceY;
		if (PlatformChar[C].Y >= PlatformFloor) PlatformChar[C].Y = PlatformFloor;
		if (PlatformChar[C].ForceX < 0) PlatformChar[C].FaceLeft = true;
		if (PlatformChar[C].ForceX > 0) PlatformChar[C].FaceLeft = false;
		
		let Anim = null;
		if (PlatformChar[C].Y != PlatformFloor) Anim = PlatformGetAnim(PlatformChar[C], "Jump");
		else if ((PlatformChar[C].ForceX != 0) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0))) Anim = PlatformGetAnim(PlatformChar[C], "Crawl");
		else if (PlatformChar[C].ForceX != 0) Anim = PlatformGetAnim(PlatformChar[C], "Walk");
		else if ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) Anim = PlatformGetAnim(PlatformChar[C], "Crouch");
		else Anim = PlatformGetAnim(PlatformChar[C], "Idle");

		if (Anim != null) DrawImageEx("Screens/Room/Platform/Characters/" + PlatformChar[C].Name + PlatformChar[C].Status + "/" + Anim.Image + ".png", PlatformChar[C].X - Anim.Width / 2, PlatformChar[C].Y, { Mirror: PlatformChar[C].FaceLeft, Width: Anim.Width, Height: Anim.Height } );
		PlatformChar[C].ForceX = PlatformChar[C].ForceX * 0.75;
		if (PlatformChar[C].Y == PlatformFloor) PlatformChar[C].ForceY = 0;
		else PlatformChar[C].ForceY = PlatformChar[C].ForceY + Math.round((PlatformTime - PlatformLastTime) / 7);
		if ((PlatformChar[C].ForceX > -0.5) && (PlatformChar[C].ForceX < 0.5)) PlatformChar[C].ForceX = 0;
	}
	PlatformLastTime = PlatformTime;
}



/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformRun() {
	PlatformDrawCharacters();
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) PlatformExit();
}

function PlatformExit() {
	window.removeEventListener("keydown", PlatformEventKeyDown);
	window.removeEventListener("keyup", PlatformEventKeyUp);
	CommonSetScreen("Room", "CollegeEntrance");
}

/**
 * Handles keys
 * @returns {void} - Nothing
 */
function PlatformEventKeyDown(e) {
	if (PlatformKeys.indexOf(e.keyCode) < 0) PlatformKeys.push(e.keyCode);
}

/**
 * Handles keys
 * @returns {void} - Nothing
 */
function PlatformEventKeyUp(e) {
	if (PlatformKeys.indexOf(e.keyCode) >= 0) PlatformKeys.splice(PlatformKeys.indexOf(e.keyCode), 1);
}
