"use strict";
var PlatformBackground = "CollegeClass2";
var PlatformChar = [];
var PlatformPlayer = null;
var PlatformLastTime = null;
var PlatformKeys = [];
var PlatformFloor = 475;

// Template for characters with their animations
var PlatformTemplate = [
	{
		Name: "College",
		Status: "Nude",
		X: 1000,
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
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 50 }
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
	PlatformChar.push(PlatformTemplate[0]);
	PlatformPlayer = PlatformChar[0];
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
 * Draw all characters and apply X and Y forces
 * @returns {void} - Nothing
 */
function PlatformDrawCharacters() {

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
		PlatformPlayer.ForceY = PlatformPlayer.ForceY + Math.round((PlatformTime - PlatformLastTime) / 7);
	
	// Draw each characters
	for (let C of PlatformChar) {
		
		// Applies the forces and turns the face
		C.X = C.X + C.ForceX;
		if (C.X < 100) C.X = 100;
		if (C.X >= 1900) C.X = 1900;
		C.Y = C.Y + C.ForceY;
		if (C.Y >= PlatformFloor) C.Y = PlatformFloor;
		if (C.ForceX < 0) C.FaceLeft = true;
		if (C.ForceX > 0) C.FaceLeft = false;
		
		// Finds the animation based on what the character is doing
		let Anim = null;
		if ((C.Action != null) && (C.Action.Expire != null) && (C.Action.Expire >= CommonTime())) Anim = PlatformGetAnim(C, C.Action.Name, false);
		else if (C.Y != PlatformFloor) Anim = PlatformGetAnim(C, "Jump");
		else if ((C.ForceX != 0) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0))) Anim = PlatformGetAnim(C, "Crawl");
		else if (C.ForceX != 0) Anim = PlatformGetAnim(C, "Walk");
		else if ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) Anim = PlatformGetAnim(C, "Crouch");
		else Anim = PlatformGetAnim(C, "Idle");

		// Draws the character and reduces the force for the next run
		if (Anim != null) DrawImageEx("Screens/Room/Platform/Characters/" + C.Name + C.Status + "/" + Anim.Image + ".png", C.X - Anim.Width / 2, C.Y, { Mirror: C.FaceLeft, Width: Anim.Width, Height: Anim.Height } );
		C.ForceX = C.ForceX * 0.75;
		if (C.Y == PlatformFloor) C.ForceY = 0;
		else C.ForceY = C.ForceY + Math.round((PlatformTime - PlatformLastTime) / 7);
		if ((C.ForceX > -0.5) && (C.ForceX < 0.5)) C.ForceX = 0;
		
	}
	
	// Keeps the time of the frame for the next run
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
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) return PlatformExit();
	PlatformPlayer.Action = { Name: "Punch", Start: CommonTime(), Expire: CommonTime() + 500 };
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
