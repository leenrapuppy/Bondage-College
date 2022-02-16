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
		Health: 20,
		HitBox: [-75, -475, 75, 0],
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Wounded", Width: 500, Height: 500, Cycle: ["Wounded0", "Wounded1", "Wounded2", "Wounded1"], Speed: 1000 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 },
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 50 },
			{ Name: "Sweep", Width: 500, Height: 500, Cycle: ["Sweep0", "Sweep1", "Sweep2", "Sweep3", "Sweep3", "Sweep3", "Sweep3", "Sweep2", "Sweep1", "Sweep0"], Speed: 50 }
		], 
		Attack: [
			{ Name: "Punch", HitX: 150, HitY: -350, Animation: ["Punch3"], Damage: 2 },
			{ Name: "Sweep", HitX: 225, HitY: -140, Animation: ["Sweep3"], Damage: 3 }
		]
	},
	{
		Name: "Liane",
		Status: "School",
		Health: 20,
		HitBox: [-75, -475, 75, 0],
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Wounded", Width: 500, Height: 500, Cycle: ["Wounded0", "Wounded1", "Wounded2", "Wounded1"], Speed: 1000 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 },
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 50 },
			{ Name: "Sweep", Width: 500, Height: 500, Cycle: ["Sweep0", "Sweep1", "Sweep2", "Sweep3", "Sweep3", "Sweep3", "Sweep3", "Sweep2", "Sweep1", "Sweep0"], Speed: 50 }
		],
		Attack: [
			{ Name: "Punch", HitX: 150, HitY: -350, Animation: "Punch3", Damage: 2 },
			{ Name: "Sweep", HitX: 225, HitY: -140, Animation: "Sweep3", Damage: 3 }
		]
	}
];

function PlatformCreateCharacter(TemplateName, IsPlayer, X, Y) {
	let NewChar = null;
	for (let Template of PlatformTemplate)
		if (Template.Name == TemplateName)
			NewChar = JSON.parse(JSON.stringify(Template));
	if (IsPlayer) NewChar.Camera = true;
	NewChar.ID = PlatformChar.length;
	NewChar.X = X;
	NewChar.Y = Y;
	NewChar.ForceX = 0;
	NewChar.ForceY = 0;
	NewChar.FaceLeft = (X > 2000);
	PlatformChar.push(NewChar);
	if (IsPlayer) PlatformPlayer = NewChar;
}

/**
 * Loads the screen, adds listeners for keys
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
	PlatformChar = [];
	PlatformCreateCharacter("Kara", true, 300, PlatformFloor);
	PlatformCreateCharacter("Liane", false, 2500, PlatformFloor);
	PlatformCreateCharacter("Liane", false, 3700, PlatformFloor);
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
			if ((Cycle == null) || Cycle) AnimPos = Math.floor(CommonTime() / C.Animation[A].Speed + C.ID) % C.Animation[A].Cycle.length;
			else AnimPos = Math.floor((CommonTime() - C.Action.Start) / C.Animation[A].Speed);
			if (AnimPos < 0) AnimPos = 0;
			if (AnimPos >= C.Animation[A].Cycle.length) AnimPos = C.Animation[A].Cycle.length - 1;
			return {
				Name: Pose,
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
function PlatformDrawCharacter(C, Time) {
	let X = C.X - C.Anim.Width / 2 - PlatformViewX;
	let Y = C.Y - C.Anim.Height - PlatformViewY
	if ((X >= 2000) || (Y >= 1000)) return;
	if ((X + C.Anim.Width <= 0) || (Y + C.Anim.Height <= 0)) return;
	DrawImageEx("Screens/Room/Platform/Characters/" + C.Name + "/" + C.Status + "/" + C.Anim.Image + ".png", X, Y, { Mirror: C.FaceLeft, Width: C.Anim.Width, Height: C.Anim.Height } );
	if (C.Damage != null)
		for (let Damage of C.Damage)
			if (Damage.Expire >= Time)
				DrawText(Damage.Value.toString(), X + C.Anim.Width / 2, Y - 100 + Math.floor((Damage.Expire - Time) / 20), "Red", "Black");
}

/**
 * Applies damage on a target, can become wounded at 0 health
 * @param {Object} Source - The character doing the damage
 * @param {Object} Target - The character getting the damage
 * @param {Number} Damage - The number of damage to apply
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformDamage(Source, Target, Damage, Time) {
	Target.ForceX = Math.round((40 + Math.random() * 40) * ((Source.FaceLeft) ? -1 : 1));
	Target.Immunity = Time + 500;
	Target.Health = Target.Health - Damage;
	if (Target.Damage == null) Target.Damage = [];
	Target.Damage.push({ Value: Damage, Expire: Time + 2000});
	if (Target.Health <= 0) Target.Health = 0;
}

/**
 * Checks if the character action can attack someone else
 * @param {Object} Source - The character doing the action
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformProcessAction(Source, Time) {
	if ((Source == null) || (Source.Anim == null) || (Source.Anim.Name == null) || (Source.Anim.Image == null)) return;
	for (let Target of PlatformChar)
		if ((Target.ID != Source.ID) && (Target.Health > 0) && ((Target.Immunity == null) || (Target.Immunity < Time))) {
			let HitX = -1000;
			let HitY = -1000;
			let Damage = 0;
			for (let Attack of Source.Attack)
				if ((Attack.Name == Source.Anim.Name) && (Attack.Animation == Source.Anim.Image)) {
					Damage = Attack.Damage;
					HitX = Source.X + Attack.HitX * ((Source.FaceLeft) ? -1 : 1);
					HitY = Source.Y + Attack.HitY;
					break;
				}
			if ((HitX >= Target.X + Target.HitBox[0]) && (HitY >= Target.Y + Target.HitBox[1]) && (HitX <= Target.X + Target.HitBox[2]) && (HitY <= Target.Y + Target.HitBox[3]))
				return PlatformDamage(Source, Target, Damage, Time);
		}	
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

	// Processes the action done by the characters
	for (let C of PlatformChar)
		if ((C.Action != null) && (C.Action.Expire != null) && (C.Action.Expire >= PlatformTime))
			PlatformProcessAction(C, PlatformTime);
	
	// Draw each characters
	for (let C of PlatformChar) {
		
		// AI walks from left to right
		if (!C.Camera && (C.Health > 0)) {
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
		if (C.Health <= 0) C.Anim = PlatformGetAnim(C, "Wounded");
		else if ((C.Action != null) && (C.Action.Expire != null) && (C.Action.Expire >= PlatformTime)) C.Anim = PlatformGetAnim(C, C.Action.Name, false);
		else if (C.Y != PlatformFloor) C.Anim = PlatformGetAnim(C, "Jump");
		else if ((C.ForceX != 0) && Crouch) C.Anim = PlatformGetAnim(C, "Crawl");
		else if (C.ForceX != 0) C.Anim = PlatformGetAnim(C, "Walk");
		else if (Crouch) C.Anim = PlatformGetAnim(C, "Crouch");
		else C.Anim = PlatformGetAnim(C, "Idle");

		// Draws the background if we are focusing on that character
		if (C.Camera) PlatformDrawBackground();

		// Draws the character and reduces the force for the next run
		if (!C.Camera && C.Anim != null) PlatformDrawCharacter(C, PlatformTime);
		C.ForceX = C.ForceX * 0.75;
		if (C.Y == PlatformFloor) C.ForceY = 0;
		else C.ForceY = C.ForceY + Math.round((PlatformTime - PlatformLastTime) / 7);
		if ((C.ForceX > -0.5) && (C.ForceX < 0.5)) C.ForceX = 0;
		
	}
	
	// Draws the player last to put her in front
	PlatformDrawCharacter(PlatformPlayer, PlatformTime);
	
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
 * Starts an attack by the source
 * @param {Object} Source - The character doing the action
 * @param {String} Type - The action type (Punch, Kick, Sweep, etc.)
 * @returns {void} - Nothing
 */
function PlatformAttack(Source, Type) {
	Source.Action = { Name: Type, Start: CommonTime(), Expire: CommonTime() + 500 };
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) return PlatformExit();
	PlatformAttack(PlatformPlayer, ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) ? "Sweep" : "Punch" );
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
