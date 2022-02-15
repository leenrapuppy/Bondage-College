"use strict";
//var PlatformBackground = "";
var PlatformChar = [];
var PlatformPlayer = null;
var PlatformLastTime = null;
var PlatformKeys = [];
var PlatformFloor = 980;
var PlatformViewX = 0;
var PlatformViewY = 0;

// Template for characters with their animations
var PlatformTemplate = [
	{
		Name: "Kara",
		Status: "Nude",
		X: 300,
		Y: PlatformFloor,
		ForceX: 0,
		ForceY: 0,
		FaceLeft: false,
		Action: null,
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 },
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 50 },
			{ Name: "Sweep", Width: 500, Height: 500, Cycle: ["Sweep0", "Sweep1", "Sweep2", "Sweep3", "Sweep3", "Sweep3", "Sweep3", "Sweep2", "Sweep1", "Sweep0"], Speed: 50 }
		]
	},
	{
		Name: "Liane",
		Status: "School",
		X: 3700,
		Y: PlatformFloor,
		ForceX: 0,
		ForceY: 0,
		FaceLeft: true,
		Action: null,
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 },
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 50 },
			{ Name: "Sweep", Width: 500, Height: 500, Cycle: ["Sweep0", "Sweep1", "Sweep2", "Sweep3", "Sweep3", "Sweep3", "Sweep3", "Sweep2", "Sweep1", "Sweep0"], Speed: 50 }
		]
	}
];

/**
 * Loads the screen, adds listeners for keys
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);	
	PlatformChar = [];
	PlatformChar.push(JSON.parse(JSON.stringify(PlatformTemplate[0])));
	PlatformPlayer = PlatformChar[0];
	PlatformPlayer.Camera = true;
	PlatformChar.push(JSON.parse(JSON.stringify(PlatformTemplate[1])));
}

// 
/**
 * Get the proper animation from the cycle to draw
 * @param {PlatformCharacter} C - The character to evaluate
 * @param {String} Pose - The pose we want
 * @param {Boolean} Cycle - TRUE if we must use the animation cycle
 * @returns {Object} - An object with the image, width & height to draw
 */
function PlatformGetAnim(C, Pose, Cycle) {
	for (let A = 0; A < C.Animation.length; A++)
		if (C.Animation[A].Name == Pose) {
			let AnimPos;
			if ((Cycle == null) || Cycle) AnimPos = Math.floor(CommonTime() / C.Animation[A].Speed) % C.Animation[A].Cycle.length;
			else AnimPos = Math.floor((CommonTime() - C.Action.Start) / C.Animation[A].Speed);
			if (AnimPos < 0) AnimPos = 0;
			if (AnimPos >= C.Animation[A].Cycle.length) AnimPos = C.Animation[A].Cycle.length - 1;
			return {
				Image: C.Animation[A].Cycle[AnimPos],
				Width: C.Animation[A].Width,
				Height: C.Animation[A].Height
			}
		}
	return null;
}

/**
 * Focuses the background camera and draws it
 * @returns {void} - Nothing
 */
function PlatformDrawBackground() {
	PlatformViewX = PlatformPlayer.X - 1000;
	if (PlatformViewX < 0) PlatformViewX = 0;
	if (PlatformViewX > 2000) PlatformViewX = 2000;
	PlatformViewY = 0;
	DrawImageZoomCanvas("Backgrounds/CollegeClassWide.jpg", MainCanvas, PlatformViewX, PlatformViewY, 2000, 1000, 0, 0, 2000, 1000);
}

/**
 * Draw a specific character on the screen if needed
 * @returns {void} - Nothing
 */
function PlatformDrawCharacter(C) {
	let X = C.X - C.Anim.Width / 2 - PlatformViewX;
	let Y = C.Y - C.Anim.Height - PlatformViewY
	if ((X >= 2000) || (Y >= 1000)) return;
	if ((X + C.Anim.Width <= 0) || (Y + C.Anim.Height <= 0)) return;
	DrawImageEx("Screens/Room/Platform/Characters/" + C.Name + "/" + C.Status + "/" + C.Anim.Image + ".png", X, Y, { Mirror: C.FaceLeft, Width: C.Anim.Width, Height: C.Anim.Height } );
}

/**
 * Draw all characters and apply X and Y forces
 * @returns {void} - Nothing
 */
function PlatformDraw() {

	// Keep the last time
	let PlatformTime = CommonTime();
	if (PlatformLastTime == null) PlatformLastTime = PlatformTime;

	// Walk/Crawl left
	if ((PlatformKeys.indexOf(65) >= 0) || (PlatformKeys.indexOf(97) >= 0)) {
		if (PlatformPlayer.ForceX > 0) PlatformPlayer.ForceX = 0;
		else {
			if ((PlatformPlayer.Y == PlatformFloor) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)))
				PlatformPlayer.ForceX = PlatformPlayer.ForceX - Math.round((PlatformTime - PlatformLastTime) / 8);
			else
				PlatformPlayer.ForceX = PlatformPlayer.ForceX - Math.round((PlatformTime - PlatformLastTime) / 4);
		}
	}
		
	// Walk/Crawl right
	if ((PlatformKeys.indexOf(68) >= 0) || (PlatformKeys.indexOf(100) >= 0)) {
		if (PlatformPlayer.ForceX < 0) PlatformPlayer.ForceX = 0;
		else {
			if ((PlatformPlayer.Y == PlatformFloor) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)))
				PlatformPlayer.ForceX = PlatformPlayer.ForceX + Math.round((PlatformTime - PlatformLastTime) / 8);
			else
				PlatformPlayer.ForceX = PlatformPlayer.ForceX + Math.round((PlatformTime - PlatformLastTime) / 4);
		}
	}

	// Jump
	if ((PlatformKeys.indexOf(32) >= 0) && (PlatformPlayer.Y == PlatformFloor))
		PlatformPlayer.ForceY = -45;

	// Release jump
	if ((PlatformKeys.indexOf(32) < 0) && (PlatformPlayer.ForceY < 0))
		PlatformPlayer.ForceY = PlatformPlayer.ForceY + Math.round((PlatformTime - PlatformLastTime) / 4);
	
	// Draw each characters
	for (let C of PlatformChar) {
		
		// AI walks from left to right
		if (!C.Camera) {
			if (C.FaceLeft) {
				if (C.X <= 300) {
					C.FaceLeft = false;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX - Math.round((PlatformTime - PlatformLastTime) / 8);
			} else {
				if (C.X >= 3700) {
					C.FaceLeft = true;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX + Math.round((PlatformTime - PlatformLastTime) / 8);
			}
		}
		
		// Applies the forces and turns the face
		C.X = C.X + C.ForceX;
		if (C.X < 100) C.X = 100;
		if (C.X >= 3900) C.X = 3900;
		C.Y = C.Y + C.ForceY;
		if (C.Y >= PlatformFloor) C.Y = PlatformFloor;
		if (C.ForceX < 0) C.FaceLeft = true;
		if (C.ForceX > 0) C.FaceLeft = false;
		
		// Finds the animation based on what the character is doing
		let Crouch = (C.Camera && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)));
		if ((C.Action != null) && (C.Action.Expire != null) && (C.Action.Expire >= CommonTime())) C.Anim = PlatformGetAnim(C, C.Action.Name, false);
		else if (C.Y != PlatformFloor) C.Anim = PlatformGetAnim(C, "Jump");
		else if ((C.ForceX != 0) && Crouch) C.Anim = PlatformGetAnim(C, "Crawl");
		else if (C.ForceX != 0) C.Anim = PlatformGetAnim(C, "Walk");
		else if (Crouch) C.Anim = PlatformGetAnim(C, "Crouch");
		else C.Anim = PlatformGetAnim(C, "Idle");

		// Draws the background if we are focusing on that character
		if (C.Camera) PlatformDrawBackground();

		// Draws the character and reduces the force for the next run
		if (!C.Camera && C.Anim != null) PlatformDrawCharacter(C);
		C.ForceX = C.ForceX * 0.75;
		if (C.Y == PlatformFloor) C.ForceY = 0;
		else C.ForceY = C.ForceY + Math.round((PlatformTime - PlatformLastTime) / 7);
		if ((C.ForceX > -0.5) && (C.ForceX < 0.5)) C.ForceX = 0;
		
	}
	
	// Draws the player last to put her in front
	PlatformDrawCharacter(PlatformPlayer);
	
	// Keeps the time of the frame for the next run
	PlatformLastTime = PlatformTime;

}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformRun() {	
	PlatformDraw();
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) return PlatformExit();
	if ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) PlatformPlayer.Action = { Name: "Sweep", Start: CommonTime(), Expire: CommonTime() + 500 };
	else PlatformPlayer.Action = { Name: "Punch", Start: CommonTime(), Expire: CommonTime() + 500 };
}

/**
 * When the screens exits, we unload the listeners
 * @returns {void} - Nothing
 */
function PlatformExit() {
	window.removeEventListener("keydown", PlatformEventKeyDown);
	window.removeEventListener("keyup", PlatformEventKeyUp);
	CommonSetScreen("Room", "CollegeEntrance");
}

/**
 * Handles keys pressed
 * @param {Event} e - The key pressed
 * @returns {void} - Nothing
 */
function PlatformEventKeyDown(e) {
	if (e.keyCode == 32) PlatformPlayer.Action = null;
	if (PlatformKeys.indexOf(e.keyCode) < 0) PlatformKeys.push(e.keyCode);
}

/**
 * Handles keys released
 * @param {Event} e - The key released
 * @returns {void} - Nothing
 */
function PlatformEventKeyUp(e) {
	if (PlatformKeys.indexOf(e.keyCode) >= 0) PlatformKeys.splice(PlatformKeys.indexOf(e.keyCode), 1);
}
