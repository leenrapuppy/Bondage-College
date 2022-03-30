"use strict";
var PlatformChar = [];
var PlatformPlayer = null;
var PlatformLastTime = null;
var PlatformKeys = [];
var PlatformFloor = 1180;
var PlatformViewX = 0;
var PlatformViewY = 200;
var PlatformRoom = null;
var PlatformGravitySpeed = 6;
var PlatformLastKeyCode = 0;
var PlatformLastKeyTime = 0;
var PlatformExperienceForLevel = [0, 10, 15, 25, 40, 60, 90, 135, 200, 300, 500];
var PlatformShowHitBox = false;
var PlatformMessage = null;
var PlatformHeal = null;
var PlatformEvent = [];

// Template for characters with their animations
var PlatformTemplate = [
	{
		Name: "Melody",
		Status: "Maid",
		Health: 16,
		HealthPerLevel: 4,
		Width: 400,
		Height: 400,
		HitBox: [0.42, 0.03, 0.58, 1],
		RunSpeed: 18,
		WalkSpeed: 12,
		CrawlSpeed: 6,
		JumpForce: 50,
		CollisionDamage: 0,
		ExperienceValue: 0,
		DamageBackOdds: 0,
		DamageKnockForce: 30,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], Speed: 50 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Crouch", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Crawl", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], Speed: 20 },
			{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 13 },
			{ Name: "StandAttackSlow", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], Speed: 30 },
			{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], Speed: 18 },
			{ Name: "CrouchAttackSlow", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], Speed: 43 },
		],
		Attack: [
			{ Name: "StandAttackFast", HitBox: [0.7, 0.2, 0.9, 0.3], HitAnimation: [8, 9, 10, 11, 12], Damage: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], Speed: 300 },
			{ Name: "StandAttackSlow", HitBox: [0.8, 0.4, 1, 0.5], HitAnimation: [9, 10, 11, 12, 13], Damage: [2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17], Speed: 600 },
			{ Name: "CrouchAttackFast", HitBox: [0.725, 0.65, 0.925, 0.75], HitAnimation: [5, 6, 7, 8, 9], Damage: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], Speed: 300 },
			{ Name: "CrouchAttackSlow", HitBox: [0.8, 0.7, 1, 0.8], HitAnimation: [5, 6, 7, 8, 9], Damage: [2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17], Speed: 600 }
		]
	},
	{
		Name: "Olivia",
		Status: "Chained",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 }
		],
		Attack: []
	},
	{
		Name: "Olivia",
		Status: "Chastity",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 }
		],
		Attack: []
	},
	{
		Name: "Olivia",
		Status: "Flower",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61], Speed: 90 }
		],
		Attack: []
	},
	{
		Name: "Isabella",
		Status: "Winter",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 150 }
		],
		Attack: []
	},
/*	{
		Name: "Kara",
		Status: "Nude",
		Health: 10,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 50,
		CollisionDamage: 1,
		ExperienceValue: 1,
		JumpOdds: 0.0002,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Width: 200, Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0], Speed: 1000 },
			{ Name: "Bound", Cycle: [0], Speed: 1000 },
			{ Name: "Walk", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 150 },
			{ Name: "Jump", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 250 },
			//{ Name: "Crouch", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 400 },
			//{ Name: "Crawl", Cycle: [0, 1, 2, 3, 2, 1], Speed: 300 },
			{ Name: "Bind", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 400 },
			//{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 40 },
			//{ Name: "StandAttackSlow", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 60 },
			//{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 40 },
			//{ Name: "CrouchAttackSlow", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 60 },
		], 
		Attack: [
			//{ Name: "StandAttackFast", HitBox: [135, -365, 30, 30], Animation: [3], Damage: 2, Speed: 400 },
			//{ Name: "StandAttackSlow", HitBox: [135, -365, 30, 30], Animation: [3], Damage: 3, Speed: 600 },
			//{ Name: "CrouchAttackFast", HitBox: [190, -150, 55, 30], Animation: [3], Damage: 2, Speed: 400 },
			//{ Name: "CrouchAttackSlow", HitBox: [190, -150, 55, 30], Animation: [3], Damage: 3, Speed: 600 }
		]
	},
	{
		Name: "Liane",
		Status: "School",
		Health: 15,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 15,
		WalkSpeed: 10,
		CrawlSpeed: 5,
		CollisionDamage: 2,
		ExperienceValue: 2,
		RunOdds: 0.0004,
		DamageBackOdds: 1,
		DamageKnockForce: 40,
		Animation: [
			{ Name: "Idle", Width: 200, Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 1], Speed: 1000 },
			{ Name: "Bound", Cycle: [0], Speed: 10000 },
			{ Name: "Walk", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 150 },
			{ Name: "Run", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 100 },
			{ Name: "Bind", Width: 200, Cycle: [0], Speed: 10000 }
		],
		Attack: []

	},*/
	{
		Name: "Yuna",
		Status: "Maid",
		Health: 21,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 70,
		CollisionDamage: 3,
		ExperienceValue: 4,
		JumpOdds: 0.0006,
		RunOdds: 0.0003,
		DamageBackOdds: 0.5,
		DamageKnockForce: 30,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 60 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
		],
		Attack: []
	},
	{
		Name: "Hazel",
		Status: "Maid",
		Health: 10,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 50,
		CollisionDamage: 1,
		ExperienceValue: 1,
		JumpOdds: 0.0002,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 35 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], Speed: 130 },
		],
		Attack: []
	},
	{
		Name: "Camille",
		Status: "Armor",
		Health: 42,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 9,
		WalkSpeed: 6,
		CrawlSpeed: 3,
		JumpForce: 60,
		CollisionDamage: 6,
		ExperienceValue: 9,
		JumpOdds: 0.0002,
		RunOdds: 0.0004,
		StandAttackSlowOdds: 0.0003,
		DamageBackOdds: 0,
		DamageFaceOdds: 0.5,
		DamageKnockForce: 20,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], CycleLeft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Speed: 100 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], CycleLeft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Speed: 66 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "StandAttackSlow", OffsetY: 50, Width: 500, Height: 500, Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], Speed: 25 }
		],
		Attack: [
			{ Name: "StandAttackSlow", HitBox: [0.6, 0.3, 1.3, 0.65], HitAnimation: [30, 31, 32, 33, 34, 35, 36], Damage: [12, 12], Speed: 1000 }
		]
	}

];

// All available rooms
var PlatformRoomList = [
	/*{
		Name: "CollegeClass1",
		Background: "CollegeClass1",
		Width: 4000,
		Height: 1200,
		Door: [
			{ Name: "CollegeHall1", FromX: 3800, FromY: 500, FromW: 200, FromH: 700, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Kara", X: 1700 }
		]
	},
	{
		Name: "CollegeHall1",
		Background: "CollegeHall1",
		Width: 3500,
		Height: 1200,
		Door: [
			{ Name: "CollegeClass1", FromX: 0, FromY: 500, FromW: 300, FromH: 700, FromType: "Up", ToX: 3900, ToFaceLeft: true },
			{ Name: "CollegeArt1", FromX: 3200, FromY: 500, FromW: 300, FromH: 700, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Liane", X: 3000 }
		]
	},
	{
		Name: "CollegeArt1",
		Background: "CollegeArt1",
		Width: 3800,
		Height: 1200,
		Door: [
			{ Name: "CollegeHall1", FromX: 0, FromY: 500, FromW: 200, FromH: 700, FromType: "Up", ToX: 3900, ToFaceLeft: true },
			{ Name: "CastleHall1A", FromX: 3700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 200, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Liane", X: 1400 },
			{ Name: "Kara", X: 2500 }
		]
	},*/
	{
		Name: "BedroomMelody",
		Text: "Melody's Bedroom (heal and save)",
		Background: "Castle/BedroomMelody",
		Width: 2000,
		Height: 1200,
		LimitLeft: 200,
		LimitRight: 1750,
		Heal: 1000,
		Door: [
			{ Name: "CastleHall3W", FromX: 200, FromY: 0, FromW: 150, FromH: 1200, FromType: "Up", ToX: 500, ToFaceLeft: false },
		],
		Character: []
	},
	{
		Name: "CastleHall3W",
		Entry: function() { if (!PlatformEventDone("JealousMaid")) PlatformDialogStart("JealousMaid"); },
		Text: "3F - Bedroom Hallway - West",
		Background: "Castle/Hall3W",
		Width: 3200,
		Height: 1200,
		LimitLeft: 250,
		Door: [
			{ Name: "BedroomMelody", FromX: 350, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 275, ToFaceLeft: false },
			{ Name: "CastleHall3C", FromX: 3100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 2000 }
		]
	},
	{
		Name: "CastleHall3C",
		Entry: function() {
			if (PlatformEventDone("OliviaBath")) { 
				PlatformRoom.Door.push({ Name: "CastleHall2C", FromX: 1950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2100, ToFaceLeft: false });
				PlatformRoom.Background = "Castle/Hall3Cv2";
			}
		},
		Text: "3F - Bedroom Hallway - Center",
		Background: "Castle/Hall3C",
		Width: 4800,
		Height: 1200,
		Door: [
			{ Name: "CastleHall3W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3100, ToFaceLeft: true },
			{ Name: "CastleHall4C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: false },
			{ Name: "CastleHall3E", FromX: 4700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 1300 },
			{ Name: "Hazel", Status: "Maid", X: 3500 }
		]
	},
	{
		Name: "CastleHall3E",
		Text: "3F - Bedroom Hallway - East",
		Background: "Castle/Hall3E",
		Width: 3800,
		Height: 1200,
		LimitRight: 3550,
		Door: [
			{ Name: "CastleHall3C", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4700, ToFaceLeft: true },
			{ Name: "BedroomOlivia", FromX: 750, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false },
			{ Name: "BedroomIsabella", FromX: 3150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 2100 }
		]
	},
	{
		Name: "BedroomOlivia",
		Entry: function() {
			if (!PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Olivia", "Chained", false, 2200, "IntroOliviaBeforeCollarKey");
			if (!PlatformEventDone("OliviaUnchain") && PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Olivia", "Chained", false, 2200, "IntroOliviaAfterCollarKey");
			if (PlatformEventDone("OliviaBath")) { PlatformCreateCharacter("Olivia", "Flower", false, 2200, "OliviaAfterBath"); PlatformChar[1].FaceLeft = true; }
		},
		Text: "Olivia's Bedroom",
		Background: "Castle/BedroomOlivia",
		Width: 3000,
		Height: 1200,
		Heal: 1000,
		Door: [
			{ Name: "CastleHall3E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 900, ToFaceLeft: false },
			{ Name: "BathroomOlivia", FromX: 2900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: []
	},
	{
		Name: "BathroomOlivia",
		Entry: function() { 
			if (PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaBath")) PlatformCreateCharacter("Olivia", "Chastity", false, 1050, "OliviaBath"); 
		},
		Text: "Olivia's Bathroom",
		Background: "Castle/BathroomOlivia",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "BedroomOlivia", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2900, ToFaceLeft: false }
		],
		Character: []
	},
	{
		Name: "BedroomIsabella",
		Text: "Isabella's Bedroom",
		Background: "Castle/BedroomIsabella",
		Width: 2000,
		Height: 1200,
		Heal: 1000,
		Door: [
			{ Name: "CastleHall3E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3300, ToFaceLeft: true }
		],
		Character: []
	},
	{
		Name: "CastleHall4C",
		Text: "4F - Roof Hallway - Center",
		Background: "Castle/Hall4C",
		Width: 4800,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W1", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4E", FromX: 4700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleHall3C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 1300 },
			{ Name: "Hazel", Status: "Maid", X: 3500 }
		]
	},
	{
		Name: "CastleHall4E",
		Text: "4F - Roof Hallway - East",
		Background: "Castle/Hall4E",
		Width: 3800,
		Height: 1200,
		LimitRight: 3550,
		Door: [
			{ Name: "CastleHall4C", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4700, ToFaceLeft: true },
			{ Name: "CastleBalcony", FromX: 3150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 1400 },
			{ Name: "Hazel", Status: "Maid", X: 2100 }
		]
	},
	{
		Name: "CastleBalcony",
		Entry: function() { 
			if (!PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Isabella", "Winter", false, 1175, "IntroIsabellaBeforeCollarKey");
			if (!PlatformEventDone("OliviaUnchain") && PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Isabella", "Winter", false, 1175, "IntroIsabellaAfterCollarKey");
		},
		Text: "Roof Balcony",
		Background: "Castle/Balcony",
		Width: 2000,
		Height: 1200,
		LimitRight: 1700,
		Door: [
			{ Name: "CastleHall4E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3300, ToFaceLeft: true }
		],
		Character: []
	},
	{
		Name: "CastleHall4W1",
		Text: "4F - Roof Hallway - West 1",
		Background: "Castle/Hall4W1",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W2", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4C", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1250 }
		]
	},
	{
		Name: "CastleHall4W2",
		Text: "4F - Roof Hallway - West 2",
		Background: "Castle/Hall4W2",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleBallroom", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4W1", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1100 },
			{ Name: "Yuna", Status: "Maid", X: 1300 }
		]
	},
	{
		Name: "CastleBallroom",
		Text: "Ballroom",
		Background: "Castle/Ballroom",
		Width: 2600,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W2", FromX: 2500, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Camille", Status: "Armor", X: 500 }
		]
	},
	{
		Name: "CastleHall2C",
		Text: "2F - Storehouse Hallway - Center",
		Background: "Castle/Hall2C",
		Width: 4800,
		Height: 1200,
		Door: [
			{ Name: "CastleHall3C", FromX: 1950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2100, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1300 },
			{ Name: "Yuna", Status: "Maid", X: 3500 }
		]
	},

]

/**
 * Loads a room and it's parameters
 * @param {String} CharacterName - The character name to load
 * @param {String} StatusName - The status of that character
 * @param {Boolean} RoomName - The name of the room to load
 * @param {Number}X - The X position of the character
 * @returns {Object} - Returns the platform character
 */
function PlatformCreateCharacter(CharacterName, StatusName, IsPlayer, X, FixDialog) {
	let NewChar = null;
	for (let CharTemplate of PlatformTemplate)
		if ((CharTemplate.Name == CharacterName) && (CharTemplate.Status == StatusName))
			NewChar = JSON.parse(JSON.stringify(CharTemplate));
	if (NewChar == null) return;
	if (IsPlayer) NewChar.Camera = true;
	NewChar.ID = PlatformChar.length;
	NewChar.MaxHealth = NewChar.Health;
	NewChar.X = X;
	NewChar.Y = PlatformFloor;
	NewChar.ForceX = 0;
	NewChar.ForceY = 0;
	NewChar.Experience = 0;
	NewChar.Level = 1;
	NewChar.Fix = (FixDialog == null) ? false : true;
	NewChar.FixDialog = FixDialog;
	NewChar.Run = false;
	NewChar.NextJump = 0;
	if ((NewChar.DamageBackOdds == null) || (NewChar.DamageBackOdds < 0) || (NewChar.DamageBackOdds > 1)) NewChar.DamageBackOdds = 1;
	if ((NewChar.DamageFaceOdds == null) || (NewChar.DamageFaceOdds < 0) || (NewChar.DamageFaceOdds > 1)) NewChar.DamageFaceOdds = 1;
	NewChar.FaceLeft = ((FixDialog == null) && (PlatformRoom != null) && (PlatformRoom.Width != null) && (X > PlatformRoom.Width / 2));
	PlatformChar.push(NewChar);
	if (IsPlayer) {
		PlatformPlayer = NewChar;
		PlatformPlayer.DamageBackOdds = 0;
		PlatformPlayer.DamageFaceOdds = 0;
	}
	return NewChar;
}

/**
 * Returns TRUE if a specific event is already done
 * @param {String} Event - The name of the event
 * @returns {Boolean} - TRUE if done
 */
function PlatformEventDone(Event) {
	return (PlatformEvent.indexOf(Event) >= 0);
}

/**
 * Adds an event to the list of events done
 * @param {String} Event - The name of the event
 * @returns {void} - Nothing
 */
function PlatformEventSet(Event) {
	if (!PlatformEventDone(Event)) PlatformEvent.push(Event);
}

/**
 * Sets the on screen message for 4 seconds
 * @param {String} Text - The text to show
 * @returns {void} - Nothing
 */
function PlatformMessageSet(Text) {
	PlatformMessage = { Text: Text, Timer: CommonTime() + 4000 };
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
	if (PlatformRoom == null) return;
	if (PlatformRoom.Text != null) PlatformMessageSet(PlatformRoom.Text);
	PlatformHeal = (PlatformRoom.Heal == null) ? null : CommonTime() + PlatformRoom.Heal;
	PlatformChar.splice(1, 100);
	if (PlatformRoom.Character != null)
		for (let Char of PlatformRoom.Character)
			PlatformCreateCharacter(Char.Name, Char.Status, false, Char.X);
	if (PlatformRoom.Entry != null) PlatformRoom.Entry();
}

/**
 * Loads the screen, adds listeners for keys
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
	if (PlatformChar.length == 0) {
		PlatformEvent = [];
		PlatformChar = [];
		PlatformCreateCharacter("Melody", "Maid", true, 1000);
		PlatformLoadRoom("BedroomMelody");
	}
	PlatformLastTime = CommonTime();
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
			let CycleList = ((C.FaceLeft === true) && (C.Animation[A].CycleLeft != null)) ? C.Animation[A].CycleLeft : C.Animation[A].Cycle;
			let AnimPos;
			if ((Cycle == null) || Cycle) AnimPos = Math.floor(CommonTime() / C.Animation[A].Speed + C.ID) % CycleList.length;
			else AnimPos = Math.floor((CommonTime() - C.Action.Start) / C.Animation[A].Speed);
			if (AnimPos < 0) AnimPos = 0;
			if (AnimPos >= CycleList.length) AnimPos = CycleList.length - 1;
			if ((C.FaceLeft === true) && (C.Animation[A].CycleLeft != null)) Pose = Pose + "Left";
			return {
				Name: Pose,
				Image: CycleList[AnimPos],
				OffsetX: (C.Animation[A].OffsetX || 0),
				OffsetY: (C.Animation[A].OffsetY || 0),
				Width: (C.Animation[A].Width || C.Width),
				Height: (C.Animation[A].Height || C.Height),
				Mirror: ((C.FaceLeft === true) && (C.Animation[A].CycleLeft == null))
			}
		}
	return null;
}

/**
 * Returns TRUE if the current action for a character is ActionName
 * @param {Object} C - The character to validate
 * @param {String} ActionName - The action to validate (all actions are valid if "Any"
 * @returns {void} - Nothing
 */
function PlatformActionIs(C, ActionName) {
	if ((C.Action != null) && (ActionName == "Any") && (C.Action.Expire != null) && (C.Action.Expire > CommonTime())) return true;
	if ((C.Action != null) && (C.Action.Name == ActionName) && (C.Action.Expire != null) && (C.Action.Expire > CommonTime())) return true;
	return false;
}

/**
 * Focuses the background camera and draws it
 * @returns {void} - Nothing
 */
function PlatformDrawBackground() {
	
	// Draws the background within the borders
	PlatformViewX = PlatformPlayer.X - 1000;
	if (PlatformViewX < 0) PlatformViewX = 0;
	if (PlatformViewX > PlatformRoom.Width - 2000) PlatformViewX = PlatformRoom.Width - 2000;
	PlatformViewY = PlatformPlayer.Y - 600;
	if (PlatformViewY < 0) PlatformViewY = 0;
	if (PlatformViewY > PlatformRoom.Height - 1000) PlatformViewY = PlatformRoom.Height - 1000;
	DrawImageZoomCanvas("Screens/Room/Platform/Background/" + PlatformRoom.Background + ".jpg", MainCanvas, PlatformViewX, PlatformViewY, 2000, 1000, 0, 0, 2000, 1000);
	if (PlatformRoom.BackgroundFilter != null) DrawRect(0, 0, 2000, 1000, PlatformRoom.BackgroundFilter);
	DrawProgressBar(10, 10, 180, 40, PlatformPlayer.Health / PlatformPlayer.MaxHealth * 100, "#00B000", "#B00000");
	DrawText(PlatformPlayer.Health.toString(), 100, 32, "White", "Black");
	DrawProgressBar(10, 60, 180, 40, PlatformPlayer.Experience / PlatformExperienceForLevel[PlatformPlayer.Level] * 100, "#0000B0", "Black");
	DrawText(PlatformPlayer.Level.toString(), 100, 82, "White", "Black");
	if (PlatformActionIs(PlatformPlayer, "Bind")) DrawProgressBar(10, 110, 180, 40, (CommonTime() - PlatformPlayer.Action.Start) / (PlatformPlayer.Action.Expire - PlatformPlayer.Action.Start) * 100, "White", "Black");

	// Preloads the next rooms
	if (PlatformRoom.Door != null)
		for (let Door of PlatformRoom.Door)
			for (let Room of PlatformRoomList)
				if ((Room.Name == Door.Name) && (Room.Background != null)) {
					let FileName = "Screens/Room/Platform/Background/" + Room.Background + ".jpg";
					let Obj = DrawCacheImage.get(FileName);
					if ((Obj == null) || (Obj.width == null) || (Obj.width <= 0))
						DrawImage(FileName, 2000, 1000);
				}

}

/**
 * Draw a specific character on the screen if needed
 * @param {Object} C - The character to draw
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformDrawCharacter(C, Time) {
	let X = C.X - C.Anim.Width / 2 - PlatformViewX;
	let Y = C.Y - C.Anim.Height - PlatformViewY
	if ((X >= 2000) || (Y >= 1000)) return;
	if ((X + C.Anim.Width <= 0) || (Y + C.Anim.Height <= 0)) return;
	DrawImageEx("Screens/Room/Platform/Character/" + C.Name + "/" + C.Status + "/" + C.Anim.Name + "/" + C.Anim.Image.toString() + ".png", X + C.Anim.OffsetX, Y + C.Anim.OffsetY, { Mirror: C.Anim.Mirror, Width: C.Anim.Width, Height: C.Anim.Height } );
	if (C.Damage != null)
		for (let Damage of C.Damage)
			if (Damage.Expire >= Time) {
				DrawImageZoomCanvas("Screens/Room/Platform/" + (C.Camera ? "Enemy" : "Player") + "Hit.png", MainCanvas, 0, 0, 512, 512, X + C.Anim.Width / 2 - 50, Y - 250 + Math.floor((Damage.Expire - Time) / 10), 100, 100);
				DrawText(Damage.Value.toString(), X + C.Anim.Width / 2, Y - 200 + Math.floor((Damage.Expire - Time) / 10), (C.Camera ? "White" : "Black"), (C.Camera ? "Black" : "White"));
			}
}

/**
 * Adds experience points to the player, can also gain a level which heals fully
 * @param {Object} C - The character that will gain experience
 * @param {Number} Value - The exp value to add
 * @returns {void} - Nothing
 */
function PlatformAddExperience(C, Value) {
	C.Experience = C.Experience + Value;
	if (C.Experience >= PlatformExperienceForLevel[C.Level]) {
		C.MaxHealth = C.MaxHealth + C.HealthPerLevel;
		C.Health = C.MaxHealth;
		C.Experience = 0;
		C.Level++;
	}
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
	if (!PlatformActionIs(Target, "Any")) {
		if (Math.random() < Target.DamageBackOdds) Target.FaceLeft = (Source.X - Target.X > 0);
		else if (Math.random() < Target.DamageFaceOdds) Target.FaceLeft = (Source.X - Target.X <= 0);
	}
	Target.ForceX = (Target.DamageKnockForce + Math.random() * Target.DamageKnockForce) * ((Source.X - Target.X < 0) ? 1 : -1);
	Target.Immunity = Time + 500;
	Target.Health = Target.Health - Damage;
	if (Target.Damage == null) Target.Damage = [];
	Target.Damage.push({ Value: Damage, Expire: Time + 2000});
	if (Target.Health <= 0) {
		Target.Health = 0;
		Target.RiseTime = Time + 10000;
		Target.Immunity = Time + 2000;
	}
}

/**
 * Checks if the hitbox of an attack clashes with a hitbox of the target
 * @param {Object} Source - The character doing the damage
 * @param {Object} Target - The character getting the damage
 * @param {Array} HitBox - The hitbox of the attack
 * @returns {boolean} - TRUE if there's a clash
 */
function PlatformHitBoxClash(Source, Target, HitBox) {

	// Exits right away if data is invalid
	if ((Source == null) || (Target == null) || (HitBox == null)) return;
	
	// Finds the X and Y of the source hitbox
	let SX1 = Source.X - (Source.Width / 2) + (HitBox[0] * Source.Width);
	if (Source.FaceLeft) SX1 = Source.X + (Source.Width / 2) - (HitBox[2] * Source.Width);
	let SX2 = Source.X - (Source.Width / 2) + (HitBox[2] * Source.Width);
	if (Source.FaceLeft) SX2 = Source.X + (Source.Width / 2) - (HitBox[0] * Source.Width);
	let SY1 = Source.Y - Source.Height + (HitBox[1] * Source.Height);
	let SY2 = Source.Y - Source.Height + (HitBox[3] * Source.Height);

	// Finds the X and Y of the target hitbox
	let TX1 = Target.X - (Target.Width / 2) + (Target.HitBox[0] * Target.Width);
	if (Target.FaceLeft) TX1 = Target.X + (Target.Width / 2) - (Target.HitBox[2] * Target.Width);
	let TX2 = Target.X - (Target.Width / 2) + (Target.HitBox[2] * Target.Width);
	if (Target.FaceLeft) TX2 = Target.X + (Target.Width / 2) - (Target.HitBox[0] * Target.Width);
	let TY1 = Target.Y - Target.Height + (Target.HitBox[1] * Target.Height);
	let TY2 = Target.Y - Target.Height + (Target.HitBox[3] * Target.Height);

	// Shows the hitboxes if we debug
	if (PlatformShowHitBox) {
		DrawRect(SX1 - PlatformViewX, SY1 - PlatformViewY, SX2 - SX1, SY2 - SY1, "red");
		DrawRect(TX1 - PlatformViewX, TY1 - PlatformViewY, TX2 - TX1, TY2 - TY1, "green");	
		console.log(SX1 + " " + SX2 + " " + SY1 + " " + SY2);
		console.log(TX1 + " " + TX2 + " " + TY1 + " " + TY2);
	}

	// If both hitboxes clashes, we return TRUE
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
	if ((Source == null) || (Source.Anim == null) || (Source.Anim.Name == null) || (Source.Anim.Image == null) || (Source.Health <= 0)) return;
	for (let Target of PlatformChar)
		if ((Target.ID != Source.ID) && (Target.Health > 0) && !Target.Fix && ((Target.Immunity == null) || (Target.Immunity < Time))) {
			let HitBox = null;
			let Damage = 0;
			for (let Attack of Source.Attack)
				if ((Attack.Name == Source.Anim.Name) && (Attack.HitAnimation != null) && (Attack.HitAnimation.indexOf(Source.Anim.Image) >= 0)) {
					Damage = Attack.Damage[Source.Level];
					HitBox = Attack.HitBox;
					break;
				}
			if (PlatformHitBoxClash(Source, Target, HitBox))
				return PlatformDamage(Source, Target, Damage, Time);
		}	
}

/**
 * Calculates the X force to apply based on the time it took until the last frame and the speed of the object
 * @param {Number} Speed - The speed of the object
 * @param {Number} Time - The number of milliseconds since the last frame
 * @returns {Number} - The force to apply
 */
function PlatformWalkFrame(Speed, Frame) {
	return Math.round(Frame * Speed / 50);
}

/**
 * Does collision damage for a character
 * @param {Object} Target - The character that will be damaged
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformCollisionDamage(Target, Time) {
	if ((Target == null) || (PlatformChar == null) || (Target.Health <= 0)) return;
	for (let Source of PlatformChar)
		if ((Source.ID != Target.ID) && (Source.Health > 0) && (Source.CollisionDamage > 0) && ((Target.Immunity == null) || (Target.Immunity < Time)))
			if (PlatformHitBoxClash(Source, Target, Source.HitBox))
				return PlatformDamage(Source, Target, Source.CollisionDamage, Time);
}

/**
 * Checks if an opponent can bind the player
 * @param {Object} Source - The opponent that can bind
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformBindPlayer(Source, Time) {
	if ((PlatformPlayer.Health > 0) || (Source.Health <= 0)) return;
	if (PlatformPlayer.Bound || Source.Bound) return;
	if ((PlatformPlayer.Immunity != null) && (PlatformPlayer.Immunity > Time)) return;
	if ((Source.Action != null) && (Source.Action.Name == "Bind")) return;
	if ((PlatformPlayer.Y != PlatformFloor) || (Source.Y != PlatformFloor) || (Math.abs(PlatformPlayer.X - Source.X) > 50)) return;
	PlatformPlayer.RiseTime = Time + 10000;
	Source.ForceX = 0;
	Source.Action = { Name: "Bind", Target: PlatformPlayer.ID, Start: Time, Expire: Time + 2000 };
}

/**
 * Draw scenery + all characters, apply X and Y forces
 * @returns {void} - Nothing
 */
function PlatformDraw() {
	
	// Check if we must enter a new room
	PlatformEnterRoom(PlatformPlayer.FaceLeft ? "Left" : "Right");
	if (PlatformPlayer.Bound) PlatformMessageSet(TextGet("GameOver"));

	// Keep the last time
	let PlatformTime = CommonTime();
	if (PlatformLastTime == null) PlatformLastTime = PlatformTime;
	let Frame = PlatformTime - PlatformLastTime;

	// Only catches actions if health is greater than zero
	if (PlatformPlayer.Health > 0) {

		// Walk/Crawl left (A or Q for QWERTY and AZERTY)
		if ((PlatformKeys.indexOf(65) >= 0) || (PlatformKeys.indexOf(97) >= 0) || (PlatformKeys.indexOf(81) >= 0) || (PlatformKeys.indexOf(113) >= 0)) {
			PlatformPlayer.FaceLeft = true;
			if (PlatformPlayer.ForceX > 0) PlatformPlayer.ForceX = 0;
			else PlatformPlayer.ForceX = PlatformPlayer.ForceX - PlatformWalkFrame(((PlatformPlayer.Y == PlatformFloor) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0))) ? PlatformPlayer.CrawlSpeed : (PlatformPlayer.Run ? PlatformPlayer.RunSpeed : PlatformPlayer.WalkSpeed), Frame);
		}

		// Walk/Crawl right
		if ((PlatformKeys.indexOf(68) >= 0) || (PlatformKeys.indexOf(100) >= 0)) {
			PlatformPlayer.FaceLeft = false;
			if (PlatformPlayer.ForceX < 0) PlatformPlayer.ForceX = 0;
			else PlatformPlayer.ForceX = PlatformPlayer.ForceX + PlatformWalkFrame(((PlatformPlayer.Y == PlatformFloor) && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0))) ? PlatformPlayer.CrawlSpeed : (PlatformPlayer.Run ? PlatformPlayer.RunSpeed : PlatformPlayer.WalkSpeed), Frame);
		}

		// Jump foces the player up on the Y axis
		if ((PlatformKeys.indexOf(32) >= 0) && (PlatformPlayer.Y == PlatformFloor))
			PlatformPlayer.ForceY = PlatformPlayer.JumpForce * -1;

	}

	// Release jump
	if ((PlatformKeys.indexOf(32) < 0) && (PlatformPlayer.ForceY < 0))
		PlatformPlayer.ForceY = PlatformPlayer.ForceY + PlatformWalkFrame(PlatformGravitySpeed * 2, Frame);
	
	// If we must heal 1 HP to all characters in the room
	let MustHeal = ((PlatformHeal != null) && (PlatformHeal < PlatformTime));
	if (MustHeal) PlatformHeal = (PlatformRoom.Heal == null) ? null : CommonTime() + PlatformRoom.Heal;
	
	// Draw each characters
	for (let C of PlatformChar) {
	
		// Enemies will stand up at half health if they were not restrained
		if ((C.Health == 0) && (C.RiseTime != null) && (C.RiseTime < PlatformTime) && !C.Bound)
			C.Health = Math.round(C.MaxHealth / 2);

		// Heal the character
		if (MustHeal && (C.Health > 0) && (C.Health < C.MaxHealth))
			C.Health++;
		
		// AI walks from left to right
		if (!C.Camera && (C.Health > 0) && !C.Fix) {
			if (C.FaceLeft) {
				if (C.X <= ((PlatformRoom.LimitLeft != null) ? PlatformRoom.LimitLeft + 50 : 100)) {
					C.FaceLeft = false;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX - PlatformWalkFrame(C.Run ? C.RunSpeed : C.WalkSpeed, Frame);
			} else {
				if (C.X >= ((PlatformRoom.LimitRight != null) ? PlatformRoom.LimitRight - 50 : PlatformRoom.Width - 100)) {
					C.FaceLeft = true;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX + PlatformWalkFrame(C.Run ? C.RunSpeed : C.WalkSpeed, Frame);
			}
			if ((C.JumpOdds != null) && (C.JumpOdds > 0) && (Math.random() < C.JumpOdds * Frame) && (C.Y == PlatformFloor) && (C.NextJump <= PlatformTime) && !PlatformActionIs(C, "Any"))
				C.ForceY = (C.JumpForce + Math.random() * C.JumpForce) * -0.5;
			if ((C.RunOdds != null) && (C.RunOdds > 0) && (Math.random() < C.RunOdds * Frame) && (C.Y == PlatformFloor))
				C.Run = !C.Run;
			if ((C.StandAttackSlowOdds != null) && (C.StandAttackSlowOdds > 0) && (Math.random() < C.StandAttackSlowOdds * Frame))
				PlatformAttack(C, "StandAttackSlow");
			PlatformBindPlayer(C, PlatformTime);
		}

		// If the bind action has expired, we bind or release the target
		if ((C.Action != null) && (C.Action.Name === "Bind") && (C.Action.Expire != null) && (C.Action.Target != null)) {
			C.ForceX = 0;
			if (C.Action.Expire < CommonTime()) {			
				for (let Target of PlatformChar)
					if (Target.ID == C.Action.Target) {
						PlatformAddExperience(C, Target.ExperienceValue);
						Target.Bound = true;
					}
				C.Action = null;
			}
		}

		// Applies the forces and turns the face
		C.X = C.X + C.ForceX;
		if (C.X < 100) C.X = 100;
		if ((PlatformRoom.LimitLeft != null) && (C.X < PlatformRoom.LimitLeft)) C.X = PlatformRoom.LimitLeft;
		if (C.X > PlatformRoom.Width - 100) C.X = PlatformRoom.Width - 100;
		if ((PlatformRoom.LimitRight != null) && (C.X > PlatformRoom.LimitRight)) C.X = PlatformRoom.LimitRight;
		C.Y = C.Y + C.ForceY;
		if (C.Y > PlatformFloor) {
			C.Y = PlatformFloor;
			C.NextJump = PlatformTime + 500;
		}
		
		// Finds the animation based on what the character is doing
		let Crouch = (C.Camera && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)));
		if ((C.Health <= 0) && C.Bound) C.Anim = PlatformGetAnim(C, "Bound");
		else if (C.Health <= 0) C.Anim = PlatformGetAnim(C, "Wounded");
		else if (PlatformActionIs(C, "Any")) C.Anim = PlatformGetAnim(C, C.Action.Name, false);
		else if (C.Y != PlatformFloor) C.Anim = PlatformGetAnim(C, "Jump");
		else if ((C.ForceX != 0) && Crouch) C.Anim = PlatformGetAnim(C, "Crawl");
		else if ((C.ForceX != 0) && C.Run) C.Anim = PlatformGetAnim(C, "Run");
		else if (C.ForceX != 0) C.Anim = PlatformGetAnim(C, "Walk");
		else if (Crouch) C.Anim = PlatformGetAnim(C, "Crouch");
		else C.Anim = PlatformGetAnim(C, "Idle");

		// Draws the background if we are focusing on that character
		if (C.Camera) {
			PlatformDrawBackground();
			if ((PlatformMessage != null) && (PlatformMessage.Text != null) && (PlatformMessage.Timer != null) && (PlatformMessage.Timer > CommonTime()))
				DrawText(PlatformMessage.Text, 1000, 50, "White", "Black");
		}

		// Draws the character and reduces the force for the next run
		if (!C.Camera && C.Anim != null) PlatformDrawCharacter(C, PlatformTime);
		C.ForceX = C.ForceX * 0.75;
		if (C.Y == PlatformFloor) C.ForceY = 0;
		else C.ForceY = C.ForceY + PlatformWalkFrame(PlatformGravitySpeed, Frame);
		if ((C.ForceX > -0.5) && (C.ForceX < 0.5)) C.ForceX = 0;

	}

	// Processes the action done by the characters
	for (let C of PlatformChar)
		if (PlatformActionIs(C, "Any"))
			PlatformProcessAction(C, PlatformTime);

	// Does collision damage for the player
	PlatformCollisionDamage(PlatformPlayer, PlatformTime);

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
	if (Player.CanWalk()) DrawButton(1900, 10, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Starts an attack by the source
 * @param {Object} Source - The character doing the action
 * @param {String} Type - The action type (Punch, Kick, Sweep, etc.)
 * @returns {void} - Nothing
 */
function PlatformAttack(Source, Type) {
	if (PlatformActionIs(Source, "Any")) return;
	Source.Run = false;
	for (let Attack of Source.Attack)
		if (Attack.Name == Type)
			Source.Action = { Name: Type, Start: CommonTime(), Expire: CommonTime() + Attack.Speed };
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1900, 10, 90, 90) && Player.CanWalk()) return PlatformExit();
	PlatformAttack(PlatformPlayer, ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) ? "CrouchAttackFast" : "StandAttackFast");
}

/**
 * When the screens exits, we unload the listeners
 * @returns {void} - Nothing
 */
function PlatformExit() {
	window.removeEventListener("keydown", PlatformEventKeyDown);
	window.removeEventListener("keyup", PlatformEventKeyUp);
	CommonSetScreen("Room", "MainHall");
}

/**
 * Enters a new room if the entry conditions are met
 * @param {String} FromType - The type of room enter (Up, Left, Right)
 * @returns {void} - Nothing
 */
function PlatformEnterRoom(FromType) {
	if ((PlatformRoom == null) || (PlatformRoom.Door == null)) return;
	for (let Door of PlatformRoom.Door)
		if ((PlatformPlayer.X >= Door.FromX) && (PlatformPlayer.X <= Door.FromX + Door.FromW) && (PlatformPlayer.Y >= Door.FromY) && (PlatformPlayer.Y <= Door.FromY + Door.FromH) && (FromType === Door.FromType)) {
			PlatformLoadRoom(Door.Name);
			PlatformPlayer.Run = false;
			PlatformPlayer.X = Door.ToX;
			PlatformPlayer.FaceLeft = Door.ToFaceLeft;
			return;
		}
	if (FromType == "Up")
		for (let Char of PlatformChar)
			if ((Char.FixDialog != null) && (Math.abs(PlatformPlayer.X - Char.X) <= 150) && (Math.abs(PlatformPlayer.Y - Char.Y) <= 450))
				return PlatformDialogStart(Char.FixDialog);
}

/**
 * Checks if there's a target character to bind and starts the binding process
 * @param {Object} Source - The source character that does the binding
 * @returns {void} - Nothing
 */
function PlatformBindStart(Source) {
	if (PlatformActionIs(Source, "Any")) return;
	if (PlatformKeys.length > 0) return;
	for (let C of PlatformChar)
		if ((Source.ID != C.ID) && (C.Bound == null) && (C.Status != "Bound") && (C.Health == 0) && (Math.abs(Source.X - C.X + (Source.FaceLeft ? -75 : 75)) < 150) && (Math.abs(Source.Y - C.Y) < 150) && (Source.Y == PlatformFloor)) {
			C.RiseTime = CommonTime() + 10000;
			Source.ForceX = 0;
			Source.Action = { Name: "Bind", Target: C.ID, Start: CommonTime(), Expire: CommonTime() + 2000 };
			return;
		}
}

/**
 * Saves the game on a specific slot
 * @param {Number} Slot - The slot to use (from 0 to 9)
 * @returns {void} - Nothing
 */
function PlatformSaveGame(Slot) {
	let SaveChar = [];
	for (let Char of PlatformDialogCharacter)
		if ((Char.Love != null) || (Char.Domination != null))
			SaveChar.push({ Name: Char.Name, Love: Char.Love, Domination: Char.Domination });
	let SaveObj = {
		Character: PlatformPlayer.Name,
		Status: PlatformPlayer.Status,
		Level: PlatformPlayer.Level,
		Experience: PlatformPlayer.Experience,
		Room: PlatformRoom.Name,
		Event: PlatformEvent,
		Dialog: SaveChar
	};
	localStorage.setItem("BondageBrawlSave" + Slot.toString(), JSON.stringify(SaveObj));
	PlatformMessageSet("Game saved on slot " + Slot.toString());
}

/**
 * Loads the game on a specific slot
 * @param {Number} Slot - The slot to use (from 0 to 9)
 * @returns {void} - Nothing
 */
function PlatformLoadGame(Slot) {
	let LoadObj = localStorage.getItem("BondageBrawlSave" + Slot.toString());
	if (LoadObj == null) return;
	LoadObj = JSON.parse(LoadObj);
	if (LoadObj.Character == null) return;
	if (LoadObj.Status == null) return;
	if (LoadObj.Room == null) return;
	PlatformChar = [];
	PlatformCreateCharacter(LoadObj.Character, LoadObj.Status, true, 1000);
	PlatformPlayer.Status = LoadObj.Status;
	PlatformEvent = LoadObj.Event;
	if (PlatformEvent == null) PlatformEvent = [];
	PlatformLoadRoom(LoadObj.Room);
	PlatformPlayer.X = Math.round(PlatformRoom.Width / 2);
	if (LoadObj.Level != null) PlatformPlayer.Level = LoadObj.Level;
	if (PlatformPlayer.Level > 1) PlatformPlayer.MaxHealth = PlatformPlayer.MaxHealth + PlatformPlayer.HealthPerLevel * (PlatformPlayer.Level - 1);
	PlatformPlayer.Health = PlatformPlayer.MaxHealth;
	if (LoadObj.Experience != null) PlatformPlayer.Experience = LoadObj.Experience;
	if (LoadObj.Dialog != null)
		for (let DialogChar of LoadObj.Dialog)
			for (let Char of PlatformDialogCharacter)
				if (DialogChar.Name == Char.Name) {
					Char.Love = DialogChar.Love;
					Char.Domination = DialogChar.Domination;
				}
	CommonSetScreen("Room", "Platform");
}

/**
 * Handles keys pressed
 * @param {Event} e - The key pressed
 * @returns {void} - Nothing
 */
function PlatformEventKeyDown(e) {
	PlatformPlayer.Run = ((e.keyCode == PlatformLastKeyCode) && (CommonTime() <= PlatformLastKeyTime + 333) && ([65, 97, 68, 100].indexOf(e.keyCode) >= 0) && (PlatformKeys.indexOf(e.keyCode) < 0)) || ((e.keyCode == PlatformLastKeyCode) && PlatformPlayer.Run && (PlatformKeys.indexOf(e.keyCode) >= 0));
	if (PlatformPlayer.Health <= 0) return;
	if (PlatformActionIs(PlatformPlayer, "Bind")) PlatformPlayer.Action = null;
	if (e.keyCode == 32) PlatformPlayer.Action = null;
	if ((e.keyCode == 87) || (e.keyCode == 119) || (e.keyCode == 90) || (e.keyCode == 122)) return PlatformEnterRoom("Up");
	if ((e.keyCode == 76) || (e.keyCode == 108)) return PlatformAttack(PlatformPlayer, ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) ? "CrouchAttackFast" : "StandAttackFast");
	if ((e.keyCode == 75) || (e.keyCode == 107)) return PlatformAttack(PlatformPlayer, ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0)) ? "CrouchAttackSlow" : "StandAttackSlow");
	if ((e.keyCode == 79) || (e.keyCode == 111)) return PlatformBindStart(PlatformPlayer, e.keyCode);
	if ((PlatformRoom.Heal != null) && (e.keyCode >= 48) && (e.keyCode <= 57)) return PlatformSaveGame(e.keyCode - 48);
	if (PlatformKeys.indexOf(e.keyCode) < 0) PlatformKeys.push(e.keyCode);
	PlatformLastKeyCode = e.keyCode;
	PlatformLastKeyTime = CommonTime();
}

/**
 * Handles keys released
 * @param {Event} e - The key released
 * @returns {void} - Nothing
 */
function PlatformEventKeyUp(e) {
	if (PlatformKeys.indexOf(e.keyCode) >= 0) PlatformKeys.splice(PlatformKeys.indexOf(e.keyCode), 1);
}
