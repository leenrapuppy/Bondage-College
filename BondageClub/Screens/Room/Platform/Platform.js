"use strict";
var PlatformChar = [];
var PlatformPlayer = null;
var PlatformLastTime = null;
var PlatformKeys = [];
var PlatformFloor = 1180;
var PlatformViewX = 0;
var PlatformViewY = 200;
var PlatformRoom = null;

// Template for characters with their animations
var PlatformTemplate = [
	{
		Name: "Kara",
		Status: "Nude",
		Health: 20,
		HitBox: [-60, -475, 120, 475],
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Wounded", Width: 500, Height: 500, Cycle: ["Wounded0", "Wounded1", "Wounded2", "Wounded1"], Speed: 1000 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 },
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 40 },
			{ Name: "Sweep", Width: 500, Height: 500, Cycle: ["Sweep0", "Sweep1", "Sweep2", "Sweep3", "Sweep3", "Sweep3", "Sweep3", "Sweep2", "Sweep1", "Sweep0"], Speed: 60 }
		], 
		Attack: [
			{ Name: "Punch", HitBox: [135, -365, 30, 30], Animation: "Punch3", Damage: 2, Speed: 400, Stand: true },
			{ Name: "Sweep", HitBox: [190, -150, 55, 30], Animation: "Sweep3", Damage: 3, Speed: 600, Crouch: true }
		]
	},
	{
		Name: "Liane",
		Status: "School",
		Health: 20,
		HitBox: [-60, -475, 120, 475],
		Animation: [
			{ Name: "Idle", Width: 250, Height: 500, Cycle: ["Idle0", "Idle1", "Idle2", "Idle3", "Idle2", "Idle1"], Speed: 500 },
			{ Name: "Wounded", Width: 500, Height: 500, Cycle: ["Wounded0", "Wounded1", "Wounded2", "Wounded1"], Speed: 1000 },
			{ Name: "Walk", Width: 250, Height: 500, Cycle: ["Walk0", "Walk1", "Walk2", "Walk3", "Walk2", "Walk1"], Speed: 150 },
			{ Name: "Jump", Width: 250, Height: 500, Cycle: ["Jump0", "Jump1", "Jump2", "Jump3", "Jump2", "Jump1"], Speed: 250 },
			{ Name: "Crouch", Width: 250, Height: 500, Cycle: ["Crouch0", "Crouch1", "Crouch2", "Crouch3", "Crouch2", "Crouch1"], Speed: 400 },
			{ Name: "Crawl", Width: 500, Height: 500, Cycle: ["Crawl0", "Crawl1", "Crawl2", "Crawl3", "Crawl2", "Crawl1"], Speed: 300 },
			{ Name: "Punch", Width: 500, Height: 500, Cycle: ["Punch0", "Punch1", "Punch2", "Punch3", "Punch3", "Punch3", "Punch3", "Punch2", "Punch1", "Punch0"], Speed: 40 },
			{ Name: "Sweep", Width: 500, Height: 500, Cycle: ["Sweep0", "Sweep1", "Sweep2", "Sweep3", "Sweep3", "Sweep3", "Sweep3", "Sweep2", "Sweep1", "Sweep0"], Speed: 60 }
		],
		Attack: [
			{ Name: "Punch", HitBox: [135, -365, 30, 30], Animation: "Punch3", Damage: 2, Speed: 400, Stand: true },
			{ Name: "Sweep", HitBox: [190, -150, 55, 30], Animation: "Sweep3", Damage: 3, Speed: 600, Crouch: true }
		]
	}
];

// All available rooms
var PlatformRoomList = [
	{
		Name: "Class",
		Background: "CollegeClassWide",
		Width: 4000,
		Height: 1200,
		Door: [
			{ Name: "Hall", FromX: 3800, FromY: 500, FromW: 200, FromH: 700, ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Liane", X: 2500 }
		]
	},
	{
		Name: "Hall",
		Background: "CollegeHallWide",
		Width: 3500,
		Height: 1200,
		Door: [
			{ Name: "Class", FromX: 0, FromY: 500, FromW: 300, FromH: 700, ToX: 3900, ToFaceLeft: true },
			{ Name: "Art", FromX: 3200, FromY: 500, FromW: 300, FromH: 700, ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Liane", X: 1400 },
			{ Name: "Liane", X: 2100 }
		]
	},
	{
		Name: "Art",
		Background: "CollegeArtWide",
		Width: 4000,
		Height: 1200,
		Door: [
			{ Name: "Hall", FromX: 0, FromY: 500, FromW: 200, FromH: 700, ToX: 3900, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Liane", X: 1700 },
			{ Name: "Liane", X: 2700 },
			{ Name: "Liane", X: 3700 }
		]
	}
]

/**
 * Loads a room and it's parameters
 * @param {String} TemplateName - The template name of the character to load
 * @param {Boolean} RoomName - The name of the room to load
 * @param {Number}X - The X position of the character
 * @returns {void} - Nothing
 */
function PlatformCreateCharacter(TemplateName, IsPlayer, X) {
	let NewChar = null;
	for (let Template of PlatformTemplate)
		if (Template.Name == TemplateName)
			NewChar = JSON.parse(JSON.stringify(Template));
	if (IsPlayer) NewChar.Camera = true;
	NewChar.ID = PlatformChar.length;
	NewChar.X = X;
	NewChar.Y = PlatformFloor;
	NewChar.ForceX = 0;
	NewChar.ForceY = 0;
	NewChar.FaceLeft = ((PlatformRoom != null) && (PlatformRoom.Width != null) && (X > PlatformRoom.Width / 2));
	PlatformChar.push(NewChar);
	if (IsPlayer) PlatformPlayer = NewChar;
}

/**
 * Loads a room and it's parameters
 * @param {Object} RoomName - The name of the room to load
 * @returns {void} - Nothing
 */
function PlatformLoadRoom(RoomName) {
	PlatformRoom = null;
	for (let Room of PlatformRoomList)
		if (Room.Name == RoomName)
			PlatformRoom = Room;
	PlatformChar.splice(1, 100);
	for (let Char of PlatformRoom.Character)
		PlatformCreateCharacter(Char.Name, false, Char.X);
}

/**
 * Loads the screen, adds listeners for keys
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
	PlatformChar = [];
	PlatformCreateCharacter("Kara", true, 300);
	PlatformLoadRoom("Class");
}

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
	if (PlatformViewX > PlatformRoom.Width - 2000) PlatformViewX = PlatformRoom.Width - 2000;
	PlatformViewY = PlatformPlayer.Y - 500;
	if (PlatformViewY < 0) PlatformViewY = 0;
	if (PlatformViewY > PlatformRoom.Height - 1000) PlatformViewY = PlatformRoom.Height - 1000;
	DrawImageZoomCanvas("Backgrounds/" + PlatformRoom.Background + ".jpg", MainCanvas, PlatformViewX, PlatformViewY, 2000, 1000, 0, 0, 2000, 1000);
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
 * Checks if the hitbox of an attack clashes with a hitbox of the target
 * @param {Object} Source - The character doing the damage
 * @param {Object} Target - The character getting the damage
 * @param {Array} HitBox - The hitbox of the attack
 * @returns {boolean} - TRUE if there's a clash
 */
function PlatformHitBoxClash(Source, Target, HitBox) {
	if ((Source == null) || (Target == null) || (HitBox == null)) return;
	let SX1 = Source.X + HitBox[0] * ((Source.FaceLeft) ? -1 : 1);
	let SX2 = SX1 + HitBox[2] * ((Source.FaceLeft) ? -1 : 1);
	if (SX1 > SX2) { let Back = SX2; SX2 = SX1; SX1 = Back; };
	let SY1 = Source.Y + HitBox[1];
	let SY2 = SY1 + HitBox[3];
	let TX1 = Target.X + Target.HitBox[0] * ((Target.FaceLeft) ? -1 : 1);
	let TX2 = TX1 + Target.HitBox[2] * ((Target.FaceLeft) ? -1 : 1);
	if (TX1 > TX2) { let Back = TX2; TX2 = TX1; TX1 = Back; };
	let TY1 = Target.Y + Target.HitBox[1];
	let TY2 = TY1 + Target.HitBox[3];
	if ((SX1 >= TX1) && (SY1 >= TY1) && (SX1 <= TX2) && (SY1 <= TY2)) return true;
	if ((SX2 >= TX1) && (SY1 >= TY1) && (SX2 <= TX2) && (SY1 <= TY2)) return true;
	if ((SX1 >= TX1) && (SY2 >= TY1) && (SX1 <= TX2) && (SY2 <= TY2)) return true;
	if ((SX2 >= TX1) && (SY2 >= TY1) && (SX2 <= TX2) && (SY2 <= TY2)) return true;
	return false;
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
			let HitBox = null;
			let Damage = 0;
			for (let Attack of Source.Attack)
				if ((Attack.Name == Source.Anim.Name) && (Attack.Animation == Source.Anim.Image)) {
					Damage = Attack.Damage;
					HitBox = Attack.HitBox;
					break;
				}
			if (PlatformHitBoxClash(Source, Target, HitBox)) return PlatformDamage(Source, Target, Damage, Time);
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
		PlatformPlayer.ForceY = -52;

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
				if (C.X >= PlatformRoom.Width - 300) {
					C.FaceLeft = true;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX + Math.round((PlatformTime - PlatformLastTime) / 8);
			}
		}
		
		// Applies the forces and turns the face
		C.X = C.X + C.ForceX;
		if (C.X < 100) C.X = 100;
		if (C.X > PlatformRoom.Width - 100) C.X = PlatformRoom.Width - 100;
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
	for (let Attack of Source.Attack)
		if (Attack.Name == Type)
			Source.Action = { Name: Type, Start: CommonTime(), Expire: CommonTime() + Attack.Speed };
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) return PlatformExit();
	if ((PlatformPlayer.Action == null) || (PlatformPlayer.Action.Expire == null) || (PlatformPlayer.Action.Expire < CommonTime()))
		PlatformAttack(PlatformPlayer, ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) ? "Sweep" : "Punch");
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
 * If there's a door, the player can enter it with the W key
 * @returns {void} - Nothing
 */
function PlatformEnterDoor() {
	if ((PlatformRoom == null) || (PlatformRoom.Door == null)) return;
	for (let Door of PlatformRoom.Door)
		if ((PlatformPlayer.X >= Door.FromX) && (PlatformPlayer.X <= Door.FromX + Door.FromW) && (PlatformPlayer.Y >= Door.FromY) && (PlatformPlayer.Y <= Door.FromY + Door.FromH)) {
			PlatformLoadRoom(Door.Name);
			PlatformPlayer.X = Door.ToX;
			PlatformPlayer.FaceLeft = Door.ToFaceLeft;
			return;
		}
}

/**
 * Handles keys pressed
 * @param {Event} e - The key pressed
 * @returns {void} - Nothing
 */
function PlatformEventKeyDown(e) {
	if (e.keyCode == 32) PlatformPlayer.Action = null;
	if ((e.keyCode == 87) || (e.keyCode == 119)) return PlatformEnterDoor();
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
