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
var PlatformExperienceForLevel = [0, 10, 15, 25, 40, 60, 90, 135, 200, 300];
var PlatformShowHitBox = false;
var PlatformMessage = null;
var PlatformHeal = null;
var PlatformEvent = [];
var PlatformDrawUpArrow = [null, null];
var PlatformButtons = null;
var PlatformRunDirection = "";
var PlatformRunTime = 0;
var PlatformLastTouch = null;
var PlatformImmunityTime = 500;
var PlatformSaveMode = false;
var PlatformJumpPhase = "";
var PlatformParty = [];
var PlatformRegen = 0;
var PlatformCooldown = [];
var PlatformTimedScreenFilter = { End: 0, Filter: "" };

// Template for characters with their animations
var PlatformTemplate = [
	{
		Name: "Melody", // MMD Z: 39
		Status: "Maid",
		Perk: "0000000000",
		PerkName: ["Healthy", "Robust", "Vigorous", "Spring", "Bounce", "Block", "Deflect", "Seduction", "Persuasion", "Manipulation"],
		Health: 12,
		HealthPerLevel: 4,
		Width: 400,
		Height: 400,
		HitBox: [0.42, 0.03, 0.58, 1],
		JumpHitBox: [0.42, 0.03, 0.58, 0.65],
		RunSpeed: 18,
		WalkSpeed: 12,
		CrawlSpeed: 6,
		JumpForce: 43,
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
			{ Name: "Stun", Cycle: [0], Speed: 1000 },
			{ Name: "Block", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 13 },
			{ Name: "StandAttackSlow", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], Speed: 30 },
			{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], Speed: 18 },
			{ Name: "CrouchAttackSlow", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], Speed: 43 },
		],
		Attack: [
			{ Name: "StandAttackFast", HitBox: [0.7, 0.2, 0.9, 0.3], HitAnimation: [8, 9, 10, 11, 12], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "StandAttackSlow", HitBox: [0.8, 0.4, 1, 0.5], HitAnimation: [9, 10, 11, 12, 13], Damage: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], Speed: 600 },
			{ Name: "CrouchAttackFast", HitBox: [0.725, 0.65, 0.925, 0.75], HitAnimation: [5, 6, 7, 8, 9], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "CrouchAttackSlow", HitBox: [0.8, 0.7, 1, 0.8], HitAnimation: [5, 6, 7, 8, 9], Damage: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], Speed: 600 }
		]
	},
	{
		Name: "Olivia", // MMD Z: 39
		Status: "Oracle",
		Perk: "0000000000",
		PerkName: ["Apprentice", "Magician", "Witch", "Regenaration", "Heal", "Cure", "Howl", "Roar", "Teleport", "Freedom"],
		Width: 400,
		Height: 400,
		Health: 10,
		HealthPerLevel: 3,
		Magic: 6,
		MagicPerLevel: 1,
		HitBox: [0.42, 0.03, 0.58, 1],
		JumpHitBox: [0.42, 0.03, 0.58, 0.65],
		RunSpeed: 18,
		WalkSpeed: 12,
		CrawlSpeed: 6,
		JumpForce: 43,
		CollisionDamage: 0,
		ExperienceValue: 0,
		DamageBackOdds: 0,
		DamageKnockForce: 25,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61], Speed: 90 },
			{ Name: "HalfBoundIdle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 150 },
			{ Name: "HalfBoundWounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "HalfBoundWalk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 25 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], Speed: 40 },
			{ Name: "HalfBoundRun", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 18 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 30 },
			{ Name: "HalfBoundJump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 30 },
			{ Name: "Crouch", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Crawl", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], Speed: 30 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 },
			{ Name: "HalfBoundStun", Cycle: [0], Speed: 1000 },
			{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], Speed: 17 },
			{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], Speed: 19 },
			{ Name: "Scream", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 10 }
		],
		Attack: [
			{ Name: "StandAttackFast", HitBox: [0.7, 0.15, 0.9, 0.3], HitAnimation: [6, 7, 8, 9, 10], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "CrouchAttackFast", HitBox: [0.725, 0.65, 0.925, 0.75], HitAnimation: [6, 7, 8, 9], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "Scream", Magic: 2, Cooldown: 3000, HitBox: [-100, -100, 100, 100], HitAnimation: [8, 9, 10], Damage: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4], Speed: 200 }
		]
	},
	{ 
		Name: "Edlaran", // MMD Z: 35.30
		Status: "Archer",
		Perk: "0000000000",
		PerkName: ["Thief", "Burglar", "Kidnapper", "Spring", "Bounce", "Backflip", "Acrobat", "Archery", "Celerity", "Capacity"],
		Width: 400,
		Height: 400,
		Health: 14,
		HealthPerLevel: 3,
		Projectile: 15,
		ProjectileName: "Arrow",
		ProjectileType: "Wood",
		ProjectileDamage: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		ProjectileTime: 1000,
		HitBox: [0.43, 0.07, 0.57, 1],
		JumpHitBox: [0.43, 0.07, 0.57, 0.7],
		RunSpeed: 21,
		WalkSpeed: 14,
		CrawlSpeed: 7,
		JumpForce: 43,
		CollisionDamage: 0,
		ExperienceValue: 0,
		DamageBackOdds: 0,
		DamageKnockForce: 25,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 25 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], Speed: 36 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 32 },
			{ Name: "Crawl", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], Speed: 30 },
			{ Name: "Crouch", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 60 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 },
			{ Name: "Aim", Cycle: [0], Speed: 1000 },
			{ Name: "AimReady", Cycle: [0], Speed: 1000 },
			{ Name: "AimFull", Cycle: [0], Speed: 1000 },
			{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], Speed: 15 },
			{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], Speed: 20 },
			{ Name: "Backflip", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], Speed: 16 },
		],
		Attack: [
			{ Name: "StandAttackFast", HitBox: [0.8, 0.1, 1, 0.3], HitAnimation: [7, 8, 9, 10, 11, 12], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "CrouchAttackFast", HitBox: [0.8, 0.58, 1, 0.78], HitAnimation: [4, 5, 6, 7], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "Backflip", Speed: 336 },
		]

	},
	{
		Name: "Olivia",
		Status: "Chained",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 }
		]
	},
	{
		Name: "Olivia",
		Status: "Chastity",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 }
		]
	},
	{
		Name: "Isabella",
		Status: "Winter",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 150 }
		]
	},
	{
		Name: "Edlaran",
		Status: "Chained",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 1000 }
		]
	},
	{
		Name: "Arrow",
		Status: "Wood",
		Width: 400,
		Height: 400,
		HitBox: [0.3, 0.95, 0.7, 1],
		Animation: [
			{ Name: "Jump", Cycle: [0], Speed: 1000 }
		]
	},
	{
		Name: "Dagger",
		Status: "Iron",
		Width: 400,
		Height: 400,
		HitBox: [0.35, 0.65, 0.65, 1],
		Animation: [
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], Speed: 25 }
		]
	},
	{
		Name: "Chest",
		Status: "Metal",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 1000 }
		]
	},
	{
		Name: "Crate",
		Status: "Wood",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 1000 }
		]
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
		Name: "Hazel",
		Status: "Maid",
		Health: 11,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		JumpHitBox: [0.4, 0.05, 0.6, 0.7],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 50,
		CollisionDamage: 1,
		ExperienceValue: 1,
		JumpOdds: 0.0003,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "WalkHit", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], Speed: 30 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 35 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], Speed: 130 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 }
		]
	},
	{
		Name: "Yuna",
		Status: "Maid",
		Health: 17,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		JumpHitBox: [0.4, 0.05, 0.6, 0.7],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 70,
		CollisionDamage: 2,
		ExperienceValue: 2,
		JumpOdds: 0.0006,
		RunOdds: 0.0003,
		DamageKnockForce: 40,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 60 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "WalkHit", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], Speed: 60 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 }
		]
	},
	{
		Name: "Lucy",
		Status: "Armor",
		Health: 26,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 15,
		WalkSpeed: 10,
		CrawlSpeed: 5,
		CollisionDamage: 3,
		ExperienceValue: 4,
		RunOdds: 0.0005,
		DamageBackOdds: 0,
		DamageFaceOdds: 0.5,
		DamageKnockForce: 30,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 150 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 }
		],
		OnBind: function() { if (PlatformEventDone("EdlaranCurseIntro") && !PlatformEventDone("EdlaranKey") && (Math.random() >= 0.8)) { PlatformMessageSet("You found keys for shackles on the guard."); PlatformEventSet("EdlaranKey"); } }
	},
	{
		Name: "Camille",
		Status: "Armor",
		Health: 53,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		JumpHitBox: [0.4, 0.05, 0.6, 0.7],
		RunSpeed: 9,
		WalkSpeed: 6,
		CrawlSpeed: 3,
		JumpForce: 60,
		CollisionDamage: 6,
		ExperienceValue: 15,
		JumpOdds: 0.0002,
		RunOdds: 0.0004,
		StandAttackSlowOdds: 0.0003,
		DamageBackOdds: 0,
		DamageFaceOdds: 0.5,
		DamageKnockForce: 20,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 250 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], CycleLeft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Speed: 100 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], CycleLeft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Speed: 66 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "StandAttackSlow", OffsetY: 50, Width: 500, Height: 500, Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], Speed: 25 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 }
		],
		Attack: [
			{ Name: "StandAttackSlow", HitBox: [0.6, 0.3, 1.3, 0.65], HitAnimation: [30, 31, 32, 33, 34, 35, 36], Damage: [12, 12], Speed: 1000 }
		],
		OnBind: function() {
			PlatformEventSet("CamilleDefeat");
			PlatformDialogStart("CamilleDefeat");
			PlatformLoadRoom();
		}
	},
	{
		Name: "Vera", // MMD Z: 41.00
		Status: "Leather",
		Health: 29,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 19,
		WalkSpeed: 13,
		CrawlSpeed: 7,
		Projectile: 10,
		ProjectileName: "Dagger",
		ProjectileType: "Iron",
		ProjectileDamage: [6, 6],
		ProjectileOdds: 0.0002,
		ProjectileTime: 900,
		CollisionDamage: 3,
		ExperienceValue: 6,
		RunOdds: 0.0004,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 150 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], Speed: 30 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Stun", Cycle: [0], Speed: 1000 },
			{ Name: "FireProjectile", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], Speed: 48 }
		],
		Attack: [
			{ Name: "FireProjectile", Speed: 1000 }
		],
		OnBind: function() { if (!PlatformEventDone("EdlaranJoin") && !PlatformEventDone("EdlaranForestKey") && PlatformEventDone("EdlaranForestIntro") && (Math.random() >= 0.8)) { PlatformMessageSet("You found keys for chains on the bandit."); PlatformEventSet("EdlaranForestKey"); } }
	},
	{
		Name: "Lyn", // MMD Z: 41.00
		Status: "Thief",
		Health: 29,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 19,
		WalkSpeed: 13,
		CrawlSpeed: 7,
		Projectile: 10,
		ProjectileName: "Dagger",
		ProjectileType: "Iron",
		ProjectileDamage: [6, 6],
		ProjectileOdds: 0.0002,
		ProjectileTime: 900,
		CollisionDamage: 3,
		ExperienceValue: 6,
		RunOdds: 0.0004,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 1000 },
		],
		Attack: [
			{ Name: "FireProjectile", Speed: 1000 }
		],
	},

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
		Heal: 250,
		Door: [
			{ Name: "CastleHall3W", FromX: 200, FromY: 0, FromW: 150, FromH: 1200, FromType: "Up", ToX: 500, ToFaceLeft: false },
		]
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
				PlatformRoom.Door.push({ Name: "CastleHall2C", FromX: 1950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1100, ToFaceLeft: false });
				PlatformRoom.Background = "Castle/Hall3Cv2";
			}
		},
		Text: "3F - Bedroom Hallway - Center",
		Background: "Castle/Hall3C",
		AlternateBackground: "Castle/Hall3Cv2",
		Width: 4800,
		Height: 1200,
		Door: [
			{ Name: "CastleHall3W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3100, ToFaceLeft: true },
			{ Name: "CastleHall4C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: false },
			{ Name: "CastleHall3E", FromX: 4700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleHall2E", FromX: -1000, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false } // Used for faster loading
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
			{ Name: "Yuna", Status: "Maid", X: 2100 }
		]
	},
	{
		Name: "BedroomOlivia",
		Entry: function() {
			PlatformChar.splice(1, 100);
			if (!PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Olivia", "Chained", 2200, true, false, "IntroOliviaBeforeCollarKey");
			if (!PlatformEventDone("OliviaUnchain") && PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Olivia", "Chained", 2200, true, false, "IntroOliviaAfterCollarKey");
			if (PlatformEventDone("OliviaBath") && !PlatformEventDone("Curse")) { PlatformCreateCharacter("Olivia", "Oracle", 2200, true, false, "OliviaAfterBath"); PlatformChar[1].FaceLeft = true; }
			if (PlatformEventDone("OliviaBath") && PlatformEventDone("Curse") && !PlatformEventDone("OliviaCurseIntro") && !PlatformEventDone("CamilleDefeat")) { PlatformCreateCharacter("Olivia", "Oracle", 2200, true, false, "OliviaCurseIntro"); PlatformChar[1].Health = 0; PlatformChar[1].Bound = true; }
			if (PlatformEventDone("OliviaBath") && PlatformEventDone("Curse") && PlatformEventDone("OliviaCurseIntro") && !PlatformEventDone("CamilleDefeat")) { PlatformCreateCharacter("Olivia", "Oracle", 2200, true, false, "OliviaCurse"); PlatformChar[1].Health = 0; PlatformChar[1].Bound = true; }
			if (PlatformEventDone("OliviaBath") && PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && !PlatformEventDone("OliviaCurseRelease")) { PlatformCreateCharacter("Olivia", "Oracle", 2200, true, false, "OliviaCurseRelease"); PlatformChar[1].Health = 0; PlatformChar[1].Bound = true; }
		},
		Text: "Olivia's Bedroom (heal and save)",
		Background: "Castle/BedroomOlivia",
		Width: 3000,
		Height: 1200,
		Heal: 250,
		Door: [
			{ Name: "CastleHall3E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 900, ToFaceLeft: false },
			{ Name: "BathroomOlivia", FromX: 2900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		]
	},
	{
		Name: "BathroomOlivia",
		Entry: function() {
			if (PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaBath")) PlatformCreateCharacter("Olivia", "Chastity", 1050, true, false, "OliviaBath");
		},
		Text: "Olivia's Bathroom",
		Background: "Castle/BathroomOlivia",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "BedroomOlivia", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2900, ToFaceLeft: false }
		]
	},
	{
		Name: "BedroomIsabella",
		Entry: function() {
			if (!PlatformEventDone("EdlaranUnlock")) PlatformCreateCharacter("Hazel", "Maid", 2200);
			if (PlatformEventDone("EdlaranUnlock") && !PlatformEventDone("EdlaranBedroomIsabella") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Archer", 2200, true, false, "EdlaranBedroomIsabella");
		},
		Text: "Isabella's Bedroom",
		Background: "Castle/BedroomIsabella",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleHall3E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3300, ToFaceLeft: true }
		]
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
			{ Name: "Yuna", Status: "Maid", X: 1400 },
			{ Name: "Hazel", Status: "Maid", X: 2100 }
		]
	},
	{
		Name: "CastleBalcony",
		Entry: function() {
			if (!PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Isabella", "Winter", 1175, true, false, "IntroIsabellaBeforeCollarKey");
			else if (!PlatformEventDone("OliviaUnchain") && PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Isabella", "Winter", 1175, true, false, "IntroIsabellaAfterCollarKey");
			else PlatformCreateCharacter("Yuna", "Maid", 1500);
		},
		Text: "Roof Balcony",
		Background: "Castle/Balcony",
		Width: 2000,
		Height: 1200,
		LimitRight: 1700,
		Door: [
			{ Name: "CastleHall4E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3300, ToFaceLeft: true }
		]
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
			{ Name: "Hazel", Status: "Maid", X: 1000 },
			{ Name: "Hazel", Status: "Maid", X: 1400 }
		]
	},
	{
		Name: "CastleHall4W2",
		Text: "4F - Roof Hallway - West 2",
		Background: "Castle/Hall4W2",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W3", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4W1", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1000 },
			{ Name: "Yuna", Status: "Maid", X: 1400 }
		]
	},
	{
		Name: "CastleHall4W3",
		Entry: function() {
			if (PlatformEventDone("Curse")) {
				PlatformCreateCharacter("Lucy", "Armor", 1000);
				PlatformCreateCharacter("Lucy", "Armor", 1400);
			}
		},
		Text: "4F - Roof Hallway - West 3",
		Background: "Castle/Hall4W1",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleCountessHall", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2100, ToFaceLeft: true },
			{ Name: "CastleHall4W2", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		]
	},
	{
		Name: "CastleCountessHall",
		Entry: function() {
			if (PlatformEventDone("Curse") && !PlatformEventDone("CamilleDefeat")) {
				PlatformCreateCharacter("Camille", "Armor", 300);
				PlatformRoom.LimitRight = 2200;
				PlatformRoom.Background = "Castle/CountessHallClosed";
				PlatformDialogStart("CamilleIntro");
			}
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && !PlatformEventDone("OliviaCurseRelease")) {
				PlatformCreateCharacter("Camille", "Armor", 1100);
				PlatformChar[1].Health = 0;
				PlatformChar[1].Bound = true;
				PlatformChar[1].Dialog = "CamilleDefeatEnd";
			}
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && PlatformEventDone("OliviaCurseRelease")) {
				PlatformRoom.Background = "Castle/CountessHall";
				PlatformRoom.LimitLeft = 0;
				if (!PlatformEventDone("CamilleEscape")) {
					PlatformEventSet("CamilleEscape");
					PlatformDialogStart("CamilleEscape");
				}
			}
		},
		Text: "Countess Hall",
		Background: "Castle/CountessHallDeadEnd",
		AlternateBackground: "Castle/CountessHallClosed",
		Width: 2400,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleHall4W3", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleTerrace", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 1900, ToFaceLeft: true }
		]
	},
	{
		Name: "CastleTerrace",
		Entry: function() {
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && PlatformEventDone("OliviaCurseRelease") && !PlatformEventDone("OliviaTerrace") && (PlatformPlayer.Name != "Olivia")) PlatformCreateCharacter("Olivia", "Oracle", 400, true, false, "OliviaTerrace");
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && PlatformEventDone("OliviaCurseRelease") && !PlatformEventDone("OliviaTerrace") && (PlatformPlayer.Name != "Melody")) PlatformCreateCharacter("Melody", "Maid", 600, true, false, "OliviaTerrace", true);
			if (PlatformEventDone("EdlaranJoin") && !PlatformEventDone("OliviaTerrace") && (PlatformPlayer.Name != "Edlaran")) PlatformCreateCharacter("Edlaran", "Archer", 800, true, false, "EdlaranTerrace", true);
			if (PlatformEventDone("OliviaTerrace")) PlatformRoom.Door.push({ Name: "ForestCastleWall", FromX: 400, FromY: 0, FromW: 550, FromH: 1200, FromType: "Up", ToX: 500, ToFaceLeft: false });
		},
		Text: "Countess Terrace",
		Background: "Castle/Terrace",
		Width: 2000,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleCountessHall", FromX: 1900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "ForestCastleWall", FromX: -1000, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false } // Used for faster loading
		]
	},
	{
		Name: "CastleHall2C",
		Entry: function() { if (!PlatformEventDone("CursedMaid") && PlatformEventDone("Curse")) PlatformDialogStart("CursedMaid"); },
		Text: "2F - Storehouse Hallway - Center",
		Background: "Castle/Hall2C",
		Width: 8200,
		Height: 1200,
		LimitLeft: 200,
		LimitRight: 8000,
		Door: [
			{ Name: "CastleHall3C", FromX: 950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2100, ToFaceLeft: false },
			{ Name: "WineCellar", FromX: 3950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1050, ToFaceLeft: false },
			{ Name: "CastleHall1C", FromX: 6950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 2000 },
			{ Name: "Yuna", Status: "Maid", X: 3200 },
			{ Name: "Yuna", Status: "Maid", X: 5000 },
			{ Name: "Hazel", Status: "Maid", X: 6200 }
		]
	},
	{
		Name: "WineCellar",
		Entry: function() {
			if (!PlatformEventDone("EdlaranBedroomIsabella")) PlatformCreateCharacter("Yuna", "Maid", 2500);
			if (PlatformEventDone("EdlaranBedroomIsabella") && !PlatformEventDone("EdlaranWineCellar") && !PlatformEventDone("EdlaranJoin") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Archer", 2500, true, false, "EdlaranWineCellar");
		},
		Text: "Wine Cellar",
		Background: "Castle/WineCellar",
		Width: 3000,
		Height: 1200,
		Door: [
			{ Name: "CastleHall2C", FromX: 900, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 4100, ToFaceLeft: false }
		]
	},
	{
		Name: "CastleHall1C",
		Entry: function() {
			if (!PlatformEventDone("IntroGuard") && !PlatformEventDone("Curse")) PlatformDialogStart("IntroGuardBeforeCurse");
			if (!PlatformEventDone("Curse")) PlatformChar[1].Combat = false;
		},
		Text: "1F - Guard Hallway - Center",
		Background: "Castle/Hall1C",
		Width: 4000,
		Height: 1200,
		LimitRight: 3800,
		Door: [
			{ Name: "CastleHall1W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 6300, ToFaceLeft: true },
			{ Name: "CastleHall2C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 7100, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2100 }
		]
	},
	{
		Name: "CastleHall1W",
		Entry: function() {
			if (!PlatformEventDone("Curse")) { PlatformChar[1].Combat = false; PlatformChar[2].Combat = false; }
		},
		Text: "1F - Guard Hallway - West",
		Background: "Castle/Hall1W",
		Width: 6400,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleHall1C", FromX: 6300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleDungeon1W", FromX: 1150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2800 },
			{ Name: "Lucy", Status: "Armor", X: 3600 }
		]
	},
	{
		Name: "CastleDungeon1W",
		Entry: function() {
			if (!PlatformEventDone("Curse")) { PlatformChar[1].Combat = false; PlatformChar[2].Combat = false; }
		},
		Text: "Dungeon Hallway - West",
		Background: "Castle/Dungeon1W",
		BackgroundFilter: "#00000040",
		Width: 6200,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleDungeon1C", FromX: 6100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleHall1W", FromX: 950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1300, ToFaceLeft: false },
			{ Name: "DungeonCell", FromX: 5150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2800 },
			{ Name: "Lucy", Status: "Armor", X: 3600 }
		]
	},
	{
		Name: "CastleDungeon1C",
		Entry: function() {
			if (!PlatformEventDone("IntroGuardCurse") && PlatformEventDone("Curse")) PlatformDialogStart("IntroGuardAfterCurse");
			if (!PlatformEventDone("Curse")) PlatformChar[1].Combat = false;
		},
		Text: "Dungeon Hallway - East",
		Background: "Castle/Dungeon1C",
		BackgroundFilter: "#00000040",
		Width: 4400,
		Height: 1200,
		LimitRight: 4200,
		Door: [
			{ Name: "CastleDungeon1W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 6300, ToFaceLeft: true },
			{ Name: "BedroomDungeon", FromX: 750, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 350, ToFaceLeft: false },
			{ Name: "DungeonStorage", FromX: 3150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 350, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2100 }
		]
	},
	{
		Name: "BedroomDungeon",
		Text: "Dungeon Bedroom (heal and save)",
		Background: "Castle/BedroomDungeon",
		BackgroundFilter: "#00000080",
		Width: 2200,
		Height: 1200,
		Heal: 250,
		Door: [
			{ Name: "CastleDungeon1C", FromX: 200, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 900, ToFaceLeft: false },
		]
	},
	{
		Name: "DungeonCell",
		Entry: function() {
			if (!PlatformEventDone("EdlaranFree") && !PlatformEventDone("Curse") && !PlatformEventDone("EdlaranIntro") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranBeforeCurseStart");
			if (!PlatformEventDone("EdlaranFree") && !PlatformEventDone("Curse") && PlatformEventDone("EdlaranIntro") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranBeforeCurseEnd");
			if (!PlatformEventDone("EdlaranFree") && PlatformEventDone("Curse") && !PlatformEventDone("EdlaranCurseIntro") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranAfterCurseStart");
			if (!PlatformEventDone("EdlaranFree") && PlatformEventDone("EdlaranCurseIntro") && !PlatformEventDone("EdlaranKey") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranAfterCurseEnd");
			if (!PlatformEventDone("EdlaranFree") && PlatformEventDone("EdlaranKey") && !PlatformEventDone("EdlaranUnlock") && !PlatformEventDone("CamilleDefeat")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "EdlaranUnlock");
		},
		Text: "Dungeon Cell",
		Background: "Castle/DungeonCell",
		BackgroundFilter: "#00000080",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "CastleDungeon1W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 5300, ToFaceLeft: true }
		]
	},
	{
		Name: "DungeonStorage",
		Entry: function() {
			if (PlatformEventDone("Curse")) PlatformChar[1].Dialog = "ChestRestraintsAfterCurse";
		},
		Text: "Dungeon Restraints Storage",
		Background: "Castle/DungeonStorage",
		BackgroundFilter: "#00000060",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "CastleDungeon1C", FromX: 250, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 3300, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Chest", Status: "Metal", X: 1700, Combat: false, Fix: true, Dialog: "ChestRestraintsBeforeCurse" }
		]
	},
	{
		Name: "ForestCastleWall",
		Text: "Wall Exterior",
		Background: "Forest/CastleWall",
		Width: 3800,
		Height: 1200,
		LimitLeft: 300,
		Door: [
			{ Name: "CastleTerrace", FromX: 350, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 625, ToFaceLeft: false },
			{ Name: "ForestVulture", FromX: 3700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 1300 },
			{ Name: "Lucy", Status: "Armor", X: 2500 }
		]
	},
	{
		Name: "ForestVulture",
		Text: "Forest Entrance",
		Background: "Forest/VulturePlain",
		Width: 2200,
		Height: 1200,
		Door: [
			{ Name: "ForestCastleWall", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3700, ToFaceLeft: false },
			{ Name: "ForestCabinPath", FromX: 2100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1400 }
		]
	},
	{
		Name: "ForestCabinPath",
		Text: "Cabin Path",
		Background: "Forest/CabinPath",
		Width: 3800,
		Height: 1200,
		Door: [
			{ Name: "ForestVulture", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2100, ToFaceLeft: true },
			{ Name: "ForestCabin", FromX: 2200, FromY: 0, FromW: 350, FromH: 1200, FromType: "Up", ToX: 250, ToFaceLeft: false },
			{ Name: "ForestBirchWest", FromX: 3700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		]
	},
	{
		Name: "ForestCabin",
		Entry: function() {
			PlatformChar.splice(1, 100);
			if (!PlatformEventDone("ForestCapture") || PlatformEventDone("ForestCaptureEnd")) {
				if (PlatformPlayer.Name != "Olivia") PlatformCreateCharacter("Olivia", "Oracle", 1300, true, false, "OliviaCabin");
				if (PlatformPlayer.Name != "Melody") PlatformCreateCharacter("Melody", "Maid", 1700, true, false, (PlatformPlayer.Name == "Olivia") ? "OliviaCabin" : "EdlaranCabin", true);
				if (PlatformEventDone("EdlaranJoin") && (PlatformPlayer.Name != "Edlaran")) PlatformCreateCharacter("Edlaran", "Archer", 2100, true, false, "EdlaranCabin", true);
			}
		},
		Text: "Wooden Cabin (heal and save)",
		Background: "Forest/CabinInterior",
		Width: 3300,
		Height: 1000,
		Heal: 250,
		Door: [
			{ Name: "ForestCabinPath", FromX: 0, FromY: 0, FromW: 500, FromH: 1200, FromType: "Up", ToX: 2375, ToFaceLeft: false }
		]
	},
	{
		Name: "ForestBirchWest",
		Entry: function() {
			if (!PlatformEventDone("IntroForestBandit") && PlatformEventDone("EdlaranJoin")) PlatformDialogStart("IntroForestBanditEdlaran");
			if (!PlatformEventDone("IntroForestBandit") && !PlatformEventDone("EdlaranJoin")) PlatformDialogStart("IntroForestBanditOlivia");
		},
		Text: "Birch Path West",
		Background: "Forest/BirchLight",
		Width: 3500,
		Height: 1400,
		Door: [
			{ Name: "ForestCabinPath", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3700, ToFaceLeft: true },
			{ Name: "ForestBirchCenter", FromX: 3400, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 2100 }
		]
	},
	{
		Name: "ForestBirchCenter",
		Text: "Birch Path Center",
		Background: "Forest/BirchHeavy",
		Width: 3200,
		Height: 1400,
		Door: [
			{ Name: "ForestBirchWest", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3400, ToFaceLeft: true },
			{ Name: "ForestBirchEast", FromX: 3100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1800 },
		]
	},
	{
		Name: "ForestBirchEast",
		Text: "Birch Path East",
		Background: "Forest/BirchClear",
		Width: 4300,
		Height: 1400,
		Door: [
			{ Name: "ForestBirchCenter", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3100, ToFaceLeft: true },
			{ Name: "ForestOakHeavy", FromX: 1650, FromY: 0, FromW: 800, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false },
			{ Name: "ForestBirchMaze", FromX: 4200, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1200 },
			{ Name: "Vera", Status: "Leather", X: 3100 }
		]
	},
	{
		Name: "ForestOakHeavy",
		Entry: function() {
			if (!PlatformEventDone("EdlaranForestIntro") && !PlatformEventDone("EdlaranJoin")) PlatformDialogStart("IntroForestBanditKidnapEdlaran");
			if (!PlatformEventDone("EdlaranJoin")) {
				let Char = PlatformCreateCharacter("Edlaran", "Archer", 2200, true, false, "EdlaranForestBeg");
				Char.Health = 0; 
				Char.Bound = true;
			}
		},
		Text: "Giant Oak",
		Background: "Forest/OakHeavy",
		Width: 2700,
		Height: 1400,
		LimitRight: 2500,
		Door: [
			{ Name: "ForestBirchEast", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2050, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1900 }
		]
	},
	{
		Name: "ForestBirchMaze",
		Text: "Lost Birch Path",
		Background: "Forest/BirchMaze",
		BackgroundFilter: "#00000040",
		Width: 3200,
		Height: 1400,
		Door: [
			{ Name: "ForestBirchEast", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4200, ToFaceLeft: true },
			{ Name: "ForestBirchMazePath", FromX: 3100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 1500, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1800 }
		]
	},
	{
		Name: "ForestBirchMazePath",
		Background: "Forest/BirchMaze",
		Entry: function() {
			if (PlatformEventDone("ForestCapture") || PlatformEventDone("ForestCaptureEnd")) PlatformLoadRoom("ForestFirPath");
			else PlatformDialogStart(PlatformEventDone("EdlaranJoin") ? "ForestPath" : "ForestLost");
		},
	},
	{
		Name: "ForestBarnInterior",
		Entry: function() {
			if (PlatformEventDone("ForestCaptureRescueMelody") && !PlatformEventDone("BarnThiefRescueMelody")) PlatformCreateCharacter("Hazel", "Maid", 1650, true, false, "BarnThiefRescueMelody", false);
			if (!PlatformEventDone("BarnThiefRescueMelody")) PlatformCreateCharacter("Lyn", "Thief", 1800, true, false, PlatformEventDone("ForestCaptureRescueMelody") ? "BarnThiefRescueMelody" : "BarnThief", true);
			if (PlatformEventDone("BarnThiefRescueMelody")) {
				PlatformCreateCharacter("Hazel", "Maid", 1800, false, true, null, true);
				PlatformRoom.Heal = null;
				PlatformRoom.Door.push({ Name: "ForestBarnExterior", FromX: 900, FromY: 0, FromW: 250, FromH: 1200, FromType: "Up", ToX: 1050, ToFaceLeft: false });
				PlatformMessageSet("Wooden Barn");
				PlatformHeal = null;
			}
		},		
		Text: "Wooden Barn (heal and save)",
		Background: "Forest/BarnInterior",
		Width: 2000,
		Height: 1333,
		Heal: 250,
		Door: []
	},
	{
		Name: "ForestCrateInterior",
		Text: "Wooden Crate (heal and save)",
		Background: "Forest/CrateInterior",
		Width: 2000,
		Height: 1000,
		Heal: 250,
		Door: []
	},
	{
		Name: "ForestCampGround",
		Text: "Camp Site (heal and save)",
		Background: "Forest/CampGround",
		AlternateBackground: "Forest/CampGroundRaft",
		Entry: function() {
			if (PlatformEventDone("ForestCaptureEnd")) {
				PlatformRoom.Door.push({ Name: "ForestLakeShore", FromX: 200, FromY: 0, FromW: 400, FromH: 1200, FromType: "Up", ToX: 3100, ToFaceLeft: true });
				PlatformRoom.LimitLeft = 200;
				PlatformRoom.Background = "Forest/CampGroundRaft";
			}
		},
		Width: 2000,
		Height: 1400,
		LimitLeft: 600,
		Heal: 250,
		Door: [
			{ Name: "ForestLakePath", FromX: 1900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
	},
	{
		Name: "ForestLakePath",
		Text: "Lake Path",
		Background: "Forest/LakeBetweenRocks",
		Width: 2800,
		Height: 1400,
		Door: [
			{ Name: "ForestCampGround", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 1900, ToFaceLeft: true },
			{ Name: "ForestFirPath", FromX: 2700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 600 },
			{ Name: "Hazel", Status: "Maid", X: 2200 }
		]
	},
	{
		Name: "ForestFirPath",
		Text: "Fir Path",
		Background: "Forest/FirLight",
		Width: 3000,
		Height: 1400,
		Door: [
			{ Name: "ForestLakePath", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2700, ToFaceLeft: true },
			{ Name: "ForestBirchMaze", FromX: 1200, FromY: 0, FromW: 600, FromH: 1200, FromType: "Up", ToX: 3100, ToFaceLeft: true },
			{ Name: "ForestPond", FromX: 2900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 600 },
			{ Name: "Yuna", Status: "Maid", X: 2400 }
		]
	},
	{
		Name: "ForestPond",
		Text: "Frog Pond",
		Background: "Forest/LostPond",
		Width: 4200,
		Height: 1400,
		Door: [
			{ Name: "ForestFirPath", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2900, ToFaceLeft: true },
			{ Name: "ForestSecluded", FromX: 4100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 800 },
			{ Name: "Vera", Status: "Leather", X: 3300 },
			{ Name: "Yuna", Status: "Maid", X: 2050 }
		]
	},
	{
		Name: "ForestSecluded",
		Entry: function() {
			if (!PlatformEventDone("ForestBanditCrate")) PlatformDialogStart("ForestBanditCrate");
		},
		Text: "Secluded Clearing",
		Background: "Forest/SecludedClearing",
		Width: 2500,
		Height: 1400,
		LimitRight: 2350,
		Door: [
			{ Name: "ForestPond", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4100, ToFaceLeft: true },
		],
		Character: [
			{ Name: "Crate", Status: "Wood", X: 1800, Combat: false, Fix: true, Dialog: "MelodyCrate" },
			{ Name: "Vera", Status: "Leather", X: 600 },
			{ Name: "Lucy", Status: "Armor", X: 1800 }
		]
	},
	{
		Name: "ForestBarnExterior",
		Text: "Barn Exterior",
		Background: "Forest/BarnExterior",
		Width: 3000,
		Height: 1400,
		Door: [
			{ Name: "ForestPlainToSavannah", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3500, ToFaceLeft: true },
			{ Name: "ForestBarnInterior", FromX: 900, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1050, ToFaceLeft: false },
			{ Name: "ForestPlainSparseRocks", FromX: 2900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 2100 }
		]		
	},
	{
		Name: "ForestPlainSparseRocks",
		Text: "Sparse Plain",
		Background: "Forest/PlainSparseRocks",
		Width: 5000,
		Height: 1400,
		Door: [
			{ Name: "ForestBarnExterior", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2900, ToFaceLeft: true },
			{ Name: "ForestMountainLake", FromX: 4900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 2100 },
			{ Name: "Lucy", Status: "Armor", X: 2900 },
		]
	},
	{
		Name: "ForestMountainLake",
		Text: "Lake Path",
		Background: "Forest/MountainLake",
		Width: 4400,
		Height: 1400,
		Door: [
			{ Name: "ForestPlainSparseRocks", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4900, ToFaceLeft: true },
			{ Name: "ForestLakeShore", FromX: 4300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1500 },
			{ Name: "Hazel", Status: "Maid", X: 2900 },
		]
	},
	{
		Name: "ForestLakeShore",
		Text: "Lake Shore",
		Background: "Forest/LakeShoreRaft",
		Width: 4000,
		Height: 1400,
		LimitRight: 3300,
		Door: [
			{ Name: "ForestMountainLake", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4300, ToFaceLeft: true },
			{ Name: "ForestLake", FromX: 2900, FromY: 0, FromW: 400, FromH: 1200, FromType: "Up", ToX: 400, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1500 },
			{ Name: "Lucy", Status: "Armor", X: 2500 },
		]
	},
	{
		Name: "ForestLake",
		Background: "Forest/LakeShore",
		Entry: function() {
			PlatformLoadRoom("ForestCampGround");
			if (!PlatformEventDone("ForestCaptureEnd")) PlatformDialogStart("ForestCaptureEnd");
		},
	},
	{
		Name: "ForestPlainToSavannah",
		Text: "Savannah Plain",
		Background: "Forest/PlainToSavannah",
		Width: 3600,
		Height: 1400,
		Door: [
			{ Name: "ForestSavannah", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 5400, ToFaceLeft: true },
			{ Name: "ForestBarnExterior", FromX: 3500, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1300 },
			{ Name: "Vera", Status: "Leather", X: 2300 },
		]
	},
	{
		Name: "ForestSavannah",
		Text: "Savannah",
		Background: "Forest/Savannah",
		Entry: function() {
			if (!PlatformEventDone("ForestCaptureEnd")) PlatformDialogStart("ThiefBossFlee");
			else if (!PlatformEventDone("ThiefBossIntro")) PlatformDialogStart("ThiefBossIntro");
		},
		Width: 5500,
		Height: 1400,
		Door: [
			{ Name: "ForestPlainToSavannah", FromX: 5400, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
		],
		Character: [
			{ Name: "Vera", Status: "Leather", X: 1400 },
			{ Name: "Lyn", Status: "Thief", X: 2800 },
			{ Name: "Vera", Status: "Leather", X: 4100 },
		]
	},

]

/**
 * Loads a room and it's parameters
 * @param {String} CharacterName - The character name to load
 * @param {String} StatusName - The status of that character
 * @param {Number} X - The X position of the character
 * @param {Boolean} Fix - TRUE if the character won't move
 * @param {Boolean} Combat - TRUE if the character will deal and receive combat damage
 * @param {String} Dialog - The dialog name to open when talking to that character
 * @param {Boolean} FaceLeft  - TRUE if the character should be facing left
 * @param {Number} ReplaceAtPos  - The position in the index to replace the char, if NULL we add it
 * @returns {Object} - Returns the platform character
 */
function PlatformCreateCharacter(CharacterName, StatusName, X, Fix  = null, Combat = null, Dialog = null, FaceLeft = null, ReplaceAtPos = null) {
	let NewChar = null;
	for (let CharTemplate of PlatformTemplate)
		if ((CharTemplate.Name == CharacterName) && (CharTemplate.Status == StatusName)) {
			NewChar = JSON.parse(JSON.stringify(CharTemplate));
			if (CharTemplate.OnBind != null) NewChar.OnBind = CharTemplate.OnBind;
			break;
		}
	if (NewChar == null) return;
	NewChar.Camera = (PlatformChar.length == 0);
	NewChar.ID = (ReplaceAtPos == null) ? PlatformChar.length : ReplaceAtPos;
	NewChar.X = X;
	NewChar.Y = PlatformFloor;
	NewChar.ForceX = 0;
	NewChar.ForceY = 0;
	NewChar.Experience = 0;
	NewChar.Level = 1;
	NewChar.BaseHealth = NewChar.Health;
	NewChar.BaseMagic = NewChar.Magic;
	NewChar.BaseProjectile = NewChar.Projectile;
	NewChar.BaseProjectileTime = NewChar.ProjectileTime;
	NewChar.HalfBound = false;
	PlatformSetHealth(NewChar);
	if (Fix != null) NewChar.Fix = Fix;
	if (Combat != null) NewChar.Combat = Combat;
	if (Dialog != null) NewChar.Dialog = Dialog;
	if (NewChar.Fix == null) NewChar.Fix = false;
	if (NewChar.Combat == null) NewChar.Combat = true;
	NewChar.Run = false;
	NewChar.NextJump = 0;
	if ((NewChar.DamageBackOdds == null) || (NewChar.DamageBackOdds < 0) || (NewChar.DamageBackOdds > 1)) NewChar.DamageBackOdds = 1;
	if ((NewChar.DamageFaceOdds == null) || (NewChar.DamageFaceOdds < 0) || (NewChar.DamageFaceOdds > 1)) NewChar.DamageFaceOdds = 1;
	NewChar.FaceLeft = ((NewChar.Dialog == null) && (PlatformRoom != null) && (PlatformRoom.Width != null) && (X > PlatformRoom.Width / 2));
	if (FaceLeft != null) NewChar.FaceLeft = FaceLeft;
	if (NewChar.Perk == null) NewChar.Perk = "";
	if (NewChar.PerkName == null) NewChar.PerkName = [];
	if (ReplaceAtPos == null) PlatformChar.push(NewChar);
	else PlatformChar[ReplaceAtPos] = NewChar;
	if (NewChar.Camera) {
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
	if (CurrentScreen == "Platform")
		PlatformMessage = { Text: Text, Timer: CommonTime() + 4000 };
}

/**
 * Loads a room and it's parameters
 * @param {Object} RoomName - The name of the room to load, can be null to reload the current room
 * @returns {void} - Nothing
 */
function PlatformLoadRoom(RoomName) {
	if (RoomName == null) RoomName = PlatformRoom.Name
	PlatformRoom = null;
	PlatformSaveMode = false;
	for (let Room of PlatformRoomList)
		if (Room.Name == RoomName)
			PlatformRoom = JSON.parse(JSON.stringify(Room));
	if (PlatformRoom == null) return;
	if (PlatformRoom.Text != null) PlatformMessageSet(PlatformRoom.Text);
	PlatformHeal = (PlatformRoom.Heal == null) ? null : CommonTime() + PlatformRoom.Heal;
	PlatformChar.splice(1, 100);
	if (PlatformRoom.Character != null)
		for (let Char of PlatformRoom.Character)
			PlatformCreateCharacter(Char.Name, Char.Status, Char.X, Char.Fix, Char.Battle, Char.Dialog);
	for (let Room of PlatformRoomList)
		if ((Room.Name == RoomName) && (Room.Entry != null))
			Room.Entry();
}

/**
 * Adds a character to the party
 * @param {Object} C - The character to add to the roster
 * @returns {void} - Nothing
 */
function PlatformPartyAdd(C) {
	let P = {
		Character: C.Character,
		Status: C.Status,
		Level: C.Level,
		Experience: C.Experience,
		Perk: C.Perk
	}
	if ((P.Character == null) || (P.Status == null)) return;
	if ((P.Level == null) || (P.Level <= 0) || (P.Level > 10)) P.Level = 1;
	if ((P.Experience == null) || (P.Experience < 0)) P.Experience = 0;
	if ((P.Perk == null) || (P.Perk.length != 10)) P.Perk = "0000000000";
	PlatformParty.push(P);
}

/**
 * Saves the current character stats in the party object
 * @returns {void} - Nothing
 */
function PlatformPartySave() {
	for (let P of PlatformParty)
		if (P.Character == PlatformPlayer.Name) {
			P.Experience = PlatformPlayer.Experience;
			P.Level = PlatformPlayer.Level;
			P.Perk = PlatformPlayer.Perk;
			return;
		}
}

/**
 * Loads the current character stats from the party object
 * @returns {void} - Nothing
 */
 function PlatformPartyLoad() {
	for (let P of PlatformParty)
		if (P.Character == PlatformPlayer.Name) {
			PlatformPlayer.Experience = P.Experience;
			PlatformPlayer.Level = P.Level;
			PlatformPlayer.Perk = P.Perk;
			PlatformSetHealth(PlatformPlayer);
			return;
		}
}

/**
 * Activates the next party character
 * @returns {void} - Nothing
 */
function PlatformPartyNext() {
	if (PlatformParty.length <= 1) return;
	PlatformPartySave();
	let Pos = 0;
	for (let P = 0; P < PlatformParty.length - 1; P++)
		if (PlatformParty[P].Character == PlatformPlayer.Name)
			Pos = P + 1;
	PlatformPlayer = PlatformCreateCharacter(PlatformParty[Pos].Character, PlatformParty[Pos].Status, PlatformPlayer.X, null, null, null, PlatformPlayer.FaceLeft, 0);
	PlatformPlayer.Camera = true;
	PlatformPlayer.Level = PlatformParty[Pos].Level;
	PlatformPlayer.Experience = PlatformParty[Pos].Experience;
	PlatformPlayer.Perk = PlatformParty[Pos].Perk;
	PlatformSetHealth(PlatformPlayer);
	PlatformDialogEvent();
	for (let Room of PlatformRoomList)
		if ((Room.Name == PlatformRoom.Name) && (Room.Entry != null))
			Room.Entry();
}

/**
 * Activates a specific character by name
 * @param {String} CharacterName - The character name to activate
 * @returns {void} - Nothing
 */
function PlatformPartyActivate(CharacterName) {
	while (PlatformPlayer.Name != CharacterName)
		PlatformPartyNext();
}

/**
 * Builds the party to switch active characters
 * @returns {void} - Nothing
 */
function PlatformPartyBuild() {
	if (PlatformParty.length == 0)
		PlatformPartyAdd({ Character: "Melody", Status: "Maid", Level: 1, Experience: 0, Perk: "0000000000" });
	if (PlatformEventDone("OliviaCurseRelease")) {
		let CreateOlivia = true;
		for (let P of PlatformParty)
			if (P.Character == "Olivia")
				CreateOlivia = false;
		if (CreateOlivia)
			PlatformPartyAdd({ Character: "Olivia", Status: "Oracle", Level: 1, Experience: 0, Perk: "0000000000" });
	}
	if (PlatformEventDone("EdlaranJoin")) {
		let CreateEdlaran = true;
		for (let P of PlatformParty)
			if (P.Character == "Edlaran")
				CreateEdlaran = false;
		if (CreateEdlaran)
			PlatformPartyAdd({ Character: "Edlaran", Status: "Archer", Level: 1, Experience: 0, Perk: "0000000000" });
	}
	PlatformDialogEvent();
}

/**
 * Loads the screen, adds listeners for keys
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
	PlatformKeys = [];
	PlatformLastTime = CommonTime();
}

/**
 * Get the proper animation from the cycle to draw
 * @param {Object} C - The character to evaluate
 * @param {String} Pose - The pose we want
 * @param {Boolean} Cycle - TRUE if we must use the animation cycle
 * @returns {Object} - An object with the image, width & height to draw
 */
function PlatformGetAnim(C, Pose, Cycle = null) {
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
 * @returns {boolean} - TRUE if the character action is that string
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
	if (PlatformTimedScreenFilter.End >= CommonTime()) DrawRect(0, 0, 2000, 1000, PlatformTimedScreenFilter.Filter);
	DrawProgressBar(10, 10, 180, 40, PlatformPlayer.Health / PlatformPlayer.MaxHealth * 100, "#00B000", "#B00000");
	DrawText(PlatformPlayer.Health.toString(), 100, 32, "White", "Black");
	DrawProgressBar(10, 60, 180, 40, PlatformPlayer.Experience / PlatformExperienceForLevel[PlatformPlayer.Level] * 100, "#600060", "Black");
	DrawText(PlatformPlayer.Level.toString(), 100, 82, "White", "Black");
	if (PlatformActionIs(PlatformPlayer, "Bind"))
		DrawProgressBar(10, 110, 180, 40, (CommonTime() - PlatformPlayer.Action.Start) / (PlatformPlayer.Action.Expire - PlatformPlayer.Action.Start) * 100, "White", "Black");
	else if ((PlatformPlayer.Health <= 0) && !PlatformPlayer.Bound && (PlatformPlayer.RiseTime != null) && (PlatformPlayer.RiseTime >= CommonTime()))
		DrawProgressBar(10, 110, 180, 40, 100 - ((PlatformPlayer.RiseTime - CommonTime()) / 100), "White", "Black");

	// Draws the magic or projectile reserve
	if ((PlatformPlayer.MaxMagic != null) && (PlatformPlayer.MaxMagic > 0) && PlatformHasPerk(PlatformPlayer, "Apprentice")) {
		DrawProgressBar(200, 10, 180, 40, PlatformPlayer.Magic / PlatformPlayer.MaxMagic * 100, "#0000B0", "#000000");
		DrawText(PlatformPlayer.Magic.toString(), 290, 32, "White", "Black");	
	}
	if ((PlatformPlayer.MaxProjectile != null) && (PlatformPlayer.MaxProjectile > 0)) {
		DrawProgressBar(200, 10, 180, 40, PlatformPlayer.Projectile / PlatformPlayer.MaxProjectile * 100, "#808000", "#000000");
		DrawText(PlatformPlayer.Projectile.toString(), 290, 32, "White", "Black");	
	}
	if ((PlatformPlayer.ProjectileAim == null) && PlatformMoveActive("Aim")) PlatformPlayer.ProjectileAim = CommonTime();
	if (PlatformPlayer.ProjectileAim != null) {
		let Progress = (CommonTime() - PlatformPlayer.ProjectileAim) / (PlatformPlayer.ProjectileTime / 50);
		if (Progress > 100) Progress = 100;
		DrawProgressBar(200, 60, 180, 40, Progress, (Progress >= 100) ? "#00FF00" : (Progress >= 50) ? "#FFFF00" : "#FF0000", "#000000");
	}

	// Clears the past cooldowns
	for (let C = 0; C < PlatformCooldown.length; C++)
		if (PlatformCooldown[C].Time < CommonTime()) {
			PlatformCooldown.splice(C, 1);
			C--;
		}

	// Draws the cooldowns
	let Y = 50;
	for (let C of PlatformCooldown) {
		DrawProgressBar(200, Y + 10, 180, 40, 100 - ((C.Time - CommonTime()) / C.Delay * 100), "White", "Black");
		DrawImage("Screens/Room/Platform/Icon/" + C.Type + ".png", 203, Y + 13);
		Y = Y + 50;
	}

	// Preloads the next rooms
	if (PlatformRoom.Door != null)
		for (let Door of PlatformRoom.Door)
			for (let Room of PlatformRoomList)
				if ((Room.Name == Door.Name) && (Room.Background != null)) {
					let FileName = "Screens/Room/Platform/Background/" + Room.Background + ".jpg";
					let Obj = DrawCacheImage.get(FileName);
					if ((Obj == null) || (Obj.width == null) || (Obj.width <= 0))
						DrawImage(FileName, 2000, 1000);
					if (Room.AlternateBackground != null) {
						FileName = "Screens/Room/Platform/Background/" + Room.AlternateBackground + ".jpg";
						Obj = DrawCacheImage.get(FileName);
						if ((Obj == null) || (Obj.width == null) || (Obj.width <= 0))
							DrawImage(FileName, 2000, 1000);
					}
				}

}

/**
 * Draw a specific character on the screen if needed
 * @param {Object} C - The character to draw
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformDrawCharacter(C, Time) {
	if (C.Anim == null) return;
	let X = C.X - C.Anim.Width / 2 - PlatformViewX;
	let Y = C.Y - C.Anim.Height - PlatformViewY - 1200 + PlatformRoom.Height;
	if ((X >= 2000) || (Y >= 1000)) return;
	if ((X + C.Anim.Width <= 0) || (Y + C.Anim.Height <= 0)) return;
	DrawImageEx("Screens/Room/Platform/Character/" + C.Name + "/" + C.Status + "/" + C.Anim.Name + "/" + C.Anim.Image.toString() + ".png", X + C.Anim.OffsetX, Y + C.Anim.OffsetY, { Mirror: C.Anim.Mirror, Width: C.Anim.Width, Height: C.Anim.Height } );
	if ((C.Effect != null) && (C.Effect.Name != null) && (C.Effect.End != null) && (C.Effect.End >= Time)) DrawImageEx("Screens/Room/Platform/Effect/" + C.Effect.Name + ".png", X + C.Anim.OffsetX, Y + C.Anim.OffsetY, { Mirror: C.Anim.Mirror, Width: C.Anim.Width, Height: C.Anim.Height } );
	if (C.Damage != null)
		for (let Damage of C.Damage)
			if (Damage.Expire >= Time) {
				DrawImageZoomCanvas("Screens/Room/Platform/" + (Damage.Value < 0 ? "Green" : (C.Camera ? "Enemy" : "Player")) + "Hit.png", MainCanvas, 0, 0, 512, 512, X + C.Anim.Width / 2 - 50, Y - 250 + Math.floor((Damage.Expire - Time) / 10), 100, 100);
				DrawText(Math.abs(Damage.Value).toString(), X + C.Anim.Width / 2, Y - 200 + Math.floor((Damage.Expire - Time) / 10), (C.Camera && Damage.Value >= 0 ? "White" : "Black"), (C.Camera && Damage.Value >= 0 ? "Black" : "White"));
			}
}

/**
 * Sets the max health and current health for the character based on the level and skill
 * @param {Object} C - The character to evaluate
 * @returns {void} - Nothing
 */
 function PlatformSetHealth(C) {
	C.MaxHealth = C.BaseHealth;
	C.MaxMagic = C.BaseMagic;
	C.MaxProjectile = C.BaseProjectile;
	if (C.HealthPerLevel != null) C.MaxHealth = C.MaxHealth + C.HealthPerLevel * C.Level;
	if (C.MagicPerLevel != null) C.MaxMagic = C.MaxMagic + C.MagicPerLevel * C.Level;
	C.MaxHealth = Math.round(C.MaxHealth * (1 + ((PlatformHasPerk(C, "Healthy") ? 0.1 : 0) + (PlatformHasPerk(C, "Robust") ? 0.15 : 0))));
	if (C.MaxMagic != null) C.MaxMagic = Math.round(C.MaxMagic * (1 + ((PlatformHasPerk(C, "Magician") ? 0.1 : 0) + (PlatformHasPerk(C, "Witch") ? 0.15 : 0))));
	if ((C.MaxProjectile != null) && PlatformHasPerk(C, "Capacity")) C.MaxProjectile = C.MaxProjectile + 5;
	C.Health = C.MaxHealth;
	C.Magic = C.MaxMagic;
	C.Projectile = C.MaxProjectile;
	if (C.BaseProjectileTime != null) C.ProjectileTime = C.BaseProjectileTime * (PlatformHasPerk(C, "Celerity") ? 0.8 : 1);
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
		if (C.Camera) PlatformMessageSet(TextGet("LevelUp").replace("CharacterName", C.Name));
		C.Experience = 0;
		C.Level++;
		PlatformSetHealth(C);
	}
}

/**
 * Some perks allow the player to steal items from bound ennemies 
 * @param {Object} C - The character that will gain experience
 * @param {Number} Value - The experience value to factor the quantity
 * @returns {void} - Nothing
 */
function PlatformSteal(C, Value) {
	if ((C == null) || (Value == null) || (Value <= 0)) return;
	if (PlatformHasPerk(C, "Thief") && (C.Projectile != null) && (C.MaxProjectile != null)) {
		let Qty = Math.floor(Math.random() * (Value + 1));
		C.Projectile = C.Projectile + Qty;
		if (C.Projectile > C.MaxProjectile) C.Projectile = C.MaxProjectile;
	}
	if (PlatformHasPerk(C, "Burglar")) {
		let Money = Math.floor(Math.random() * (Value + 1));
		if (Money > 0) CharacterChangeMoney(Player, Money);
	}
}

/**
 * Applies damage on a target, can become wounded at 0 health
 * @param {Object} Source - The character doing the damage
 * @param {Object} Target - The character getting the damage
 * @param {Number} Damage - The number of damage to apply
 * @param {Number} Time - The current time when the action is done
 * @param {String} Type - The damage type (Collsion or Action)
 * @returns {void} - Nothing
 */
function PlatformDamage(Source, Target, Damage, Time, Type) {
	if (!PlatformActionIs(Target, "Any") && (!PlatformActionIs(Source, "Scream") || PlatformHasPerk(Source, "Roar"))) {
		if (Math.random() < Target.DamageBackOdds) Target.FaceLeft = (Source.X - Target.X > 0);
		else if (Math.random() < Target.DamageFaceOdds) Target.FaceLeft = (Source.X - Target.X <= 0);
	}
	if (Target.Camera && PlatformMoveActive("Block") && (Target.FaceLeft != Source.FaceLeft)) {
		Target.ForceX = 0;
		Damage = Math.ceil(Damage / 2);
		if (PlatformHasPerk(PlatformPlayer, "Deflect") && (Type == "Collision")) {
			Source.FaceLeft = !Source.FaceLeft;
			Source.ForceX = (30 + Math.random() * 30) * (Source.FaceLeft ? -1 : 1);
		}
	} else Target.ForceX = (Target.DamageKnockForce + Math.random() * Target.DamageKnockForce) * ((Source.X - Target.X < 0) ? 1 : -1);
	Target.Health = Target.Health - Damage;
	Target.Immunity = Time + PlatformImmunityTime;
	if (Target.Damage == null) Target.Damage = [];
	Target.Damage.push({ Value: Damage, Expire: Time + 2000});
	if (Target.Health <= 0) {
		Target.Health = 0;
		Target.RiseTime = Time + (PlatformHasPerk(Target, "Vigorous") ? 7000 : 10000);
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

	// When jumping, the hitbox can change
	let TBox = Target.HitBox;
	if ((Target.JumpHitBox != null) && (Target.Y != PlatformFloor) && !PlatformActionIs(Target, "Any")) TBox = Target.JumpHitBox;

	// Finds the X and Y of the target hitbox
	let TX1 = Target.X - (Target.Width / 2) + (TBox[0] * Target.Width);
	if (Target.FaceLeft) TX1 = Target.X + (Target.Width / 2) - (TBox[2] * Target.Width);
	let TX2 = Target.X - (Target.Width / 2) + (TBox[2] * Target.Width);
	if (Target.FaceLeft) TX2 = Target.X + (Target.Width / 2) - (TBox[0] * Target.Width);
	let TY1 = Target.Y - Target.Height + (TBox[1] * Target.Height);
	let TY2 = Target.Y - Target.Height + (TBox[3] * Target.Height);

	// Shows the hitboxes if we debug
	if (PlatformShowHitBox) {
		DrawRect(SX1 - PlatformViewX, SY1 - PlatformViewY, SX2 - SX1, SY2 - SY1, "red");
		DrawRect(TX1 - PlatformViewX, TY1 - PlatformViewY, TX2 - TX1, TY2 - TY1, "green");
		console.log(SX1 + " " + SX2 + " " + SY1 + " " + SY2);
		console.log(TX1 + " " + TX2 + " " + TY1 + " " + TY2);
	}

	// A full screen hitbox always works
	if ((SX1 < 0) && (SX2 > 2000) && (SY1 < 0) && (SY2 > 1000)) return true;

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
		if ((Target.ID != Source.ID) && (Target.Health > 0) && Target.Combat && ((Target.Immunity == null) || (Target.Immunity < Time))) {
			let HitBox = null;
			let Damage = 0;
			if (Source.Attack != null)
				for (let Attack of Source.Attack)
					if ((Attack.Name == Source.Anim.Name) && (Attack.HitAnimation != null) && (Attack.HitAnimation.indexOf(Source.Anim.Image) >= 0)) {
						Damage = Attack.Damage[Source.Level];
						HitBox = Attack.HitBox;
						break;
					}
			if (PlatformHitBoxClash(Source, Target, HitBox))
				return PlatformDamage(Source, Target, Damage, Time, "Action");
		}
}

/**
 * Calculates the X force to apply based on the time it took until the last frame and the speed of the object
 * @param {Number} Speed - The speed of the object
 * @param {Number} Frame - The number of milliseconds since the last frame
 * @returns {Number} - The force to apply
 */
function PlatformWalkFrame(Speed, Frame) {
	return Frame * Speed / 50;
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
		if ((Source.ID != Target.ID) && (Source.Health > 0) && Source.Combat && (Source.CollisionDamage > 0) && ((Target.Immunity == null) || (Target.Immunity < Time)))
			if (PlatformHitBoxClash(Source, Target, Source.HitBox))
				return PlatformDamage(Source, Target, Source.CollisionDamage, Time, "Collision");
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
	PlatformPlayer.RiseTime = Time + (PlatformHasPerk(PlatformPlayer, "Vigorous") ? 7000 : 10000);
	Source.ForceX = 0;
	Source.Action = { Name: "Bind", Target: PlatformPlayer.ID, Start: Time, Expire: Time + 2000 };
}

/**
 * Returns TRUE if the player input is valid for a move
 * @param {Object} Move - The movement type (Crouch, jump, left, right, etc.)
 * @returns {boolean}
 */
function PlatformMoveActive(Move) {

	// Crouching can be done by down on the joystick DPAD or S on the keyboard
	if ((Move == "Crouch") && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0))) return true;
	if ((Move == "Crouch") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerDPadDown].pressed) return true;
	if ((Move == "Crouch") && CommonTouchActive(150, 850, 100, 100)) return true;

	// Moving left can be done with jostick DPAD or A or Z on the keyboard
	if ((Move == "Left") && ((PlatformKeys.indexOf(65) >= 0) || (PlatformKeys.indexOf(97) >= 0) || (PlatformKeys.indexOf(81) >= 0) || (PlatformKeys.indexOf(113) >= 0))) return true;
	if ((Move == "Left") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerDPadLeft].pressed) return true;
	if ((Move == "Left") && CommonTouchActive(50, 750, 100, 100)) return true;

	// Moving right can be done with jostick DPAD or D on the keyboard
	if ((Move == "Right") && ((PlatformKeys.indexOf(68) >= 0) || (PlatformKeys.indexOf(100) >= 0))) return true;
	if ((Move == "Right") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerDPadRight].pressed) return true;
	if ((Move == "Right") && CommonTouchActive(250, 750, 100, 100)) return true;

	// Jumping can be done by B on the joystick DPAD or spacebar on the keyboard
	if ((Move == "Jump") && (PlatformKeys.indexOf(32) >= 0)) return true;
	if ((Move == "Jump") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerA].pressed) return true;
	if ((Move == "Jump") && CommonTouchActive(1850, 750, 100, 100)) return true;

	// Aiming requires holding the K key for a set time, only for Edlaran if she has arrows left
	if ((Move == "Aim") && (PlatformPlayer.ForceX == 0) && (PlatformPlayer.ForceY == 0) && (PlatformPlayer.Name == "Edlaran") && (PlatformPlayer.Projectile != null) && (PlatformPlayer.Projectile > 0)) {
		if ((PlatformKeys.indexOf(75) >= 0) || (PlatformKeys.indexOf(107) >= 0)) return true;
		if (ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerX].pressed) return true;
		if (CommonTouchActive(1750, 750, 100, 100)) return true;
	}

	// Blocking can be done using I, but you need to get the perk first
	if ((Move == "Block") && (PlatformPlayer.ForceX == 0) && PlatformHasPerk(PlatformPlayer, "Block")) {
		if ((PlatformKeys.indexOf(73) >= 0) || (PlatformKeys.indexOf(105) >= 0)) return true;
		if (ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerTriggerLeft].pressed) return true;
		if (CommonTouchActive(1750, 750, 100, 100)) return true;
	}

	// If all else fails, the move is not active
	return false;

}

/**
 * Returns TRUE if an animation is available for the character
 * @param {Object} C - The character to evaluate
 * @param {String} AnimationName - The animation name to search
 * @returns {boolean} - TRUE if it's available
 */
function PlatformAnimAvailable(C, AnimationName) {
	for (let Anim of C.Animation)
		if (Anim.Name == AnimationName)
			return true;
	return false;
}

/**
 * Creates a projectile that will disappear when it hits the floor or a wall
 * @param {String} Name - The name of the projectile (Arrow, Bullet, etc.)
 * @param {String} Type - The type of the projectile (Wood, Iron, etc.)
 * @param {Boolean} FaceLeft - IF the projectile is facing the left direction
 * @param {Number} X - The X position
 * @param {Number} Y - The Y position
 * @param {Number} Force - The speed of the projectile
 * @param {Number} Damage - The damage done by the projectile
 * @returns {void} - Nothing
 */
function PlatformCreateProjectile(Name, Type, FaceLeft, X, Y, Force, Damage) {
	let Proj = PlatformCreateCharacter(Name, Type, X, false, true, null, FaceLeft, null);
	Proj.Y = PlatformFloor - Y;
	Proj.IsProjectile = true;
	Proj.Gravity = 0.25;
	Proj.CollisionDamage = Damage;
	Proj.ProjectileForce = Force * (FaceLeft ? -1 : 1);
}

/**
 * Calculates the projectiles
 * @param {Number} Time - The current time stamp of the frame
 * @returns {void} - Nothing
 */
function PlatformProcessProjectile(Time) {

	// First, we remove projectiles that hit a wall or the floor
	for (let C = 0; C < PlatformChar.length; C++)
		if ((PlatformChar[C].IsProjectile != null) && (PlatformChar[C].IsProjectile == true)) {
			let Remove = false;
			if (PlatformChar[C].Y == PlatformFloor) Remove = true;
			else if (PlatformChar[C].X <= 100) Remove = true;
			else if (PlatformChar[C].X >= PlatformRoom.Width - 100) Remove = true;
			else if ((PlatformRoom.LimitLeft != null) && (PlatformChar[C].X <= PlatformRoom.LimitLeft)) Remove = true;
			else if ((PlatformRoom.LimitRight != null) && (PlatformChar[C].X >= PlatformRoom.LimitRight)) Remove = true;
			if (Remove) {
				PlatformChar.splice(C, 1);
				C--;
			} 
		}

	// Second, we remove projectiles that hit a target, applying damage
	for (let C = 0; C < PlatformChar.length; C++)
		if ((PlatformChar[C].IsProjectile != null) && (PlatformChar[C].IsProjectile == true) && (PlatformChar[C].CollisionDamage != null) && (PlatformChar[C].CollisionDamage > 0)) {
			let Remove = false;
			let Source = PlatformChar[C];
			for (let Target of PlatformChar)
				if ((Source.ID != Target.ID) && (Target.Health > 0) && !Remove && Target.Combat && ((Target.Immunity == null) || (Target.Immunity < Time)))
					if (PlatformHitBoxClash(Source, Target, Source.HitBox)) {
						PlatformDamage(Source, Target, Source.CollisionDamage, Time, "Collision");
						Remove = true;
					}
			if (Remove) {
				PlatformChar.splice(C, 1);
				C--;
			} 
		}

}

/**
 * Consume a projectile from the character and creates it on screen
 * @param {Object} C - The character that generates the projectile
 * @param {Boolean} LongShot - TRUE if it's a long shot
 * @returns {void} - Nothing
 */
function PlatformProjectile(C, LongShot) {
	C.Projectile--;
	let Damage = C.ProjectileDamage[C.Level];
	if ((Damage == null) || (Damage < 1)) Damage = 1;
	if (PlatformHasPerk(C, "Archery")) Damage++;
	PlatformCreateProjectile(C.ProjectileName, C.ProjectileType, C.FaceLeft, C.X + ((C.FaceLeft) ? -200 : 200), C.Height * 0.8, LongShot ? 60 : 36, Damage);
}

/**
 * Draw scenery + all characters, apply X and Y forces
 * @returns {void} - Nothing
 */
function PlatformDraw() {

	// Check if we must enter a new room
	PlatformEnterRoom(PlatformPlayer.FaceLeft ? "Left" : "Right");
	if (PlatformPlayer.Bound && (PlatformRoom.Heal == null)) PlatformMessageSet(TextGet("GameOver"));

	// Keep the last time
	let PlatformTime = CommonTime();
	if (PlatformLastTime == null) PlatformLastTime = PlatformTime;
	let Frame = PlatformTime - PlatformLastTime;

	// Only catches actions if health is greater than zero
	if (PlatformPlayer.Health > 0) {

		// Walk/Crawl left (A or Q for QWERTY and AZERTY)
		if (PlatformMoveActive("Left")) {
			PlatformPlayer.FaceLeft = true;
			if (PlatformPlayer.ForceX > 0) PlatformPlayer.ForceX = 0;
			else PlatformPlayer.ForceX = PlatformPlayer.ForceX - PlatformWalkFrame(((PlatformPlayer.Y == PlatformFloor) && PlatformMoveActive("Crouch")) ? PlatformPlayer.CrawlSpeed : (PlatformPlayer.Run ? PlatformPlayer.RunSpeed : PlatformPlayer.WalkSpeed), Frame);
		}

		// Walk/Crawl right
		if (PlatformMoveActive("Right")) {
			PlatformPlayer.FaceLeft = false;
			if (PlatformPlayer.ForceX < 0) PlatformPlayer.ForceX = 0;
			else PlatformPlayer.ForceX = PlatformPlayer.ForceX + PlatformWalkFrame(((PlatformPlayer.Y == PlatformFloor) && PlatformMoveActive("Crouch")) ? PlatformPlayer.CrawlSpeed : (PlatformPlayer.Run ? PlatformPlayer.RunSpeed : PlatformPlayer.WalkSpeed), Frame);
		}

		// Jump forces the player up on the Y axis
		if (PlatformMoveActive("Jump") && (PlatformPlayer.Y == PlatformFloor)) {
			PlatformPlayer.ForceY = PlatformPlayer.JumpForce * ((PlatformHasPerk(PlatformPlayer, "Spring") && !PlatformHasPerk(PlatformPlayer, "Bounce")) ? 1.1667 : 1) * -1;
			PlatformJumpPhase = "Jump1";
		}

		// Double jump allows for a second spring
		if (PlatformMoveActive("Jump") && (PlatformPlayer.Y != PlatformFloor) && PlatformHasPerk(PlatformPlayer, "Bounce") && (PlatformJumpPhase == "Release1")) {
			PlatformPlayer.ForceY = PlatformPlayer.JumpForce * -1;
			PlatformJumpPhase = "Jump2";
		}

		// Release jump for double jumps
		if (!PlatformMoveActive("Jump") && (PlatformPlayer.Y != PlatformFloor) && (PlatformJumpPhase == "Jump1")) PlatformJumpPhase = "Release1";
		if (!PlatformMoveActive("Jump") && (PlatformPlayer.Y != PlatformFloor) && (PlatformJumpPhase == "Jump2")) PlatformJumpPhase = "Release2";

	}

	// Slows down the jump force when jump isn't holded
	if (!PlatformMoveActive("Jump") && (PlatformPlayer.ForceY < 0))
		PlatformPlayer.ForceY = PlatformPlayer.ForceY + PlatformWalkFrame(PlatformGravitySpeed * 2, Frame);

	// If we must heal 1 HP to all characters in the room
	let MustHeal = ((PlatformHeal != null) && (PlatformHeal < PlatformTime));
	if (MustHeal) PlatformHeal = (PlatformRoom.Heal == null) ? null : CommonTime() + PlatformRoom.Heal;

	// If we must regenarate magic for the player
	if (!MustHeal && (PlatformPlayer.MaxMagic != null) && (PlatformPlayer.Magic != null) && (PlatformRegen < PlatformTime)) {
		if (PlatformPlayer.Magic < PlatformPlayer.MaxMagic) PlatformPlayer.Magic++;
		PlatformRegen = PlatformTime + (PlatformHasPerk("Regeneration") ? 6000 : 8000);
	} 

	// Draw each characters
	for (let C of PlatformChar) {

		// Fires a projectile if the aim was on
		if ((C.ProjectileAim != null) && !PlatformMoveActive("Aim")) {
			if (PlatformTime - C.ProjectileAim >= C.ProjectileTime) PlatformProjectile(C, (PlatformTime - C.ProjectileAim >= C.ProjectileTime * 2));
			C.ProjectileAim = null;
		}

		// Enemies will stand up at half health if they were not restrained
		if ((C.Health == 0) && (C.RiseTime != null) && (C.RiseTime < PlatformTime) && !C.Bound)
			C.Health = Math.round(C.MaxHealth / 4);

		// Heal the character
		if (MustHeal && (C.Health > 0) && (C.Health < C.MaxHealth)) C.Health++;
		if (MustHeal && (C.Magic != null) && (C.MaxMagic != null) && (C.MaxMagic > 0) && (C.Magic < C.MaxMagic)) C.Magic++;
		if (MustHeal && (C.Projectile != null) && (C.MaxProjectile != null) && (C.MaxProjectile > 0) && (C.Projectile < C.MaxProjectile)) C.Projectile++;

		// AI walks from left to right
		if (!C.Camera && (C.Health > 0) && !C.Fix) {
			if (PlatformActionIs(C, "FireProjectile")) {
				if ((PlatformTime >= C.Action.Start + C.ProjectileTime) && (C.Action.Done == null)) {
					PlatformProjectile(C, false);
					C.Action.Done = true;
				}
			} else {
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
				if ((C.ProjectileOdds != null) && (C.Projectile != null) && (C.Projectile > 0) && (C.ProjectileOdds > 0) && (Math.random() < C.ProjectileOdds * Frame))
					PlatformAttack(C, "FireProjectile");
				PlatformBindPlayer(C, PlatformTime);
			}
		}

		// If the bind action has expired, we bind or release the target
		if ((C.Action != null) && (C.Action.Name === "Bind") && (C.Action.Expire != null) && (C.Action.Target != null)) {
			C.ForceX = 0;
			if (C.Action.Expire < CommonTime()) {
				for (let Target of PlatformChar)
					if (Target.ID == C.Action.Target) {
						PlatformAddExperience(C, Target.ExperienceValue);
						PlatformSteal(C, Target.ExperienceValue);
						if (Target.OnBind != null) Target.OnBind();
						Target.Bound = true;
					}
				C.Action = null;
			}
		}

		// Applies the forces and turns the face
		C.X = C.X + ((C.ProjectileForce != null) ? C.ProjectileForce : C.ForceX) * Frame / 16.6667;
		if (C.X < 100) C.X = 100;
		if ((PlatformRoom.LimitLeft != null) && (C.X < PlatformRoom.LimitLeft)) C.X = PlatformRoom.LimitLeft;
		if (C.X > PlatformRoom.Width - 100) C.X = PlatformRoom.Width - 100;
		if ((PlatformRoom.LimitRight != null) && (C.X > PlatformRoom.LimitRight)) C.X = PlatformRoom.LimitRight;
		C.Y = C.Y + C.ForceY * ((C.Gravity != null) ? C.Gravity : 1) * Frame / 16.6667;
		if (C.Y > PlatformFloor) {
			C.Y = PlatformFloor;
			C.NextJump = PlatformTime + 500;
		}

		// Finds the animation based on what the character is doing
		let Crouch = (C.Camera && PlatformMoveActive("Crouch"));
		if ((C.Health <= 0) && C.Bound) C.Anim = PlatformGetAnim(C, "Bound");
		else if (C.Health <= 0 && C.HalfBound) C.Anim = PlatformGetAnim(C, "HalfBoundWounded");
		else if (C.Health <= 0) C.Anim = PlatformGetAnim(C, "Wounded");
		else if ((C.ProjectileAim != null) && (PlatformTime - C.ProjectileAim < C.ProjectileTime)) C.Anim = PlatformGetAnim(C, "Aim");
		else if ((C.ProjectileAim != null) && (PlatformTime - C.ProjectileAim < C.ProjectileTime * 2)) C.Anim = PlatformGetAnim(C, "AimReady");
		else if (C.ProjectileAim != null) C.Anim = PlatformGetAnim(C, "AimFull");
		else if (PlatformActionIs(C, "Any")) C.Anim = PlatformGetAnim(C, C.Action.Name, false);
		else if (C.Y != PlatformFloor && C.HalfBound) C.Anim = PlatformGetAnim(C, "HalfBoundJump");
		else if (C.Y != PlatformFloor) C.Anim = PlatformGetAnim(C, "Jump");
		else if ((C.ForceX != 0) && Crouch) C.Anim = PlatformGetAnim(C, "Crawl");
		else if ((C.ForceX != 0) && (C.Immunity >= PlatformTime + PlatformImmunityTime * 0.6) && C.HalfBound && PlatformAnimAvailable(C, "HalfBoundStun")) C.Anim = PlatformGetAnim(C, "HalfBoundStun");
		else if ((C.ForceX != 0) && (C.Immunity >= PlatformTime + PlatformImmunityTime * 0.6) && PlatformAnimAvailable(C, "Stun")) C.Anim = PlatformGetAnim(C, "Stun");
		else if ((C.ForceX != 0) && (C.Immunity >= PlatformTime - PlatformImmunityTime) && PlatformAnimAvailable(C, "WalkHit")) C.Anim = PlatformGetAnim(C, "WalkHit");
		else if ((C.ForceX != 0) && C.Run && PlatformAnimAvailable(C, "HalfBoundRun") && C.HalfBound) C.Anim = PlatformGetAnim(C, "HalfBoundRun");
		else if ((C.ForceX != 0) && C.Run && PlatformAnimAvailable(C, "Run")) C.Anim = PlatformGetAnim(C, "Run");
		else if ((C.ForceX != 0) && Crouch) C.Anim = PlatformGetAnim(C, "Crawl");
		else if ((C.ForceX != 0) && C.HalfBound) C.Anim = PlatformGetAnim(C, "HalfBoundWalk");
		else if (C.ForceX != 0) C.Anim = PlatformGetAnim(C, "Walk");
		else if (Crouch) C.Anim = PlatformGetAnim(C, "Crouch");
		else if (PlatformMoveActive("Block") && PlatformAnimAvailable(C, "Block")) C.Anim = PlatformGetAnim(C, "Block");
		else if (C.HalfBound) C.Anim = PlatformGetAnim(C, "HalfBoundIdle");
		else C.Anim = PlatformGetAnim(C, "Idle");

		// Draws the background if we are focusing on that character
		if (C.Camera) {
			PlatformDrawBackground();
			if ((PlatformMessage != null) && (PlatformMessage.Text != null) && (PlatformMessage.Timer != null) && (PlatformMessage.Timer > CommonTime()))
				DrawText(PlatformMessage.Text, 1000, 50, "White", "Black");
		}

		// Draws the character and reduces the force for the next run
		if (!C.Camera && C.Anim != null) PlatformDrawCharacter(C, PlatformTime);
		C.ForceX = C.ForceX * (1 - 0.25 * (Frame / 16.6667));
		if (C.Y == PlatformFloor) C.ForceY = 0;
		else C.ForceY = C.ForceY + (PlatformGravitySpeed * Frame / 50);
		if ((C.ForceX > -0.5) && (C.ForceX < 0.5)) C.ForceX = 0;

	}

	// Processes the action done by the characters
	for (let C of PlatformChar)
		if (PlatformActionIs(C, "Any"))
			PlatformProcessAction(C, PlatformTime);

	// Does collision damage for the player
	PlatformCollisionDamage(PlatformPlayer, PlatformTime);

	// Process the projectiles damage & life spawn
	PlatformProcessProjectile(PlatformTime);

	// Draws the UpArrow
	if (PlatformDrawUpArrow[0] != null || PlatformDrawUpArrow[1] != null) {
		DrawRect(PlatformDrawUpArrow[0] - PlatformViewX - 43, PlatformDrawUpArrow[1] - PlatformViewY - 43, 86, 86, "white");
		DrawImage("Icons/North.png", PlatformDrawUpArrow[0] - PlatformViewX - 43, PlatformDrawUpArrow[1] - PlatformViewY - 43);
	}

	// Draws the player last to put her in front
	PlatformDrawCharacter(PlatformPlayer, PlatformTime);

	// Draws the mobile buttons
	if (CommonIsMobile) {
		DrawEmptyRect(50, 750, 100, 100, CommonTouchActive(50, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(250, 750, 100, 100, CommonTouchActive(250, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(150, 650, 100, 100, CommonTouchActive(150, 650, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(150, 850, 100, 100, CommonTouchActive(150, 850, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		if (CommonTouchActive(1750, 750, 100, 100)) DrawEmptyRect(1750, 750, 100, 100, "cyan", 4);
		DrawEmptyRect(1650, 750, 100, 100, CommonTouchActive(1650, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1850, 750, 100, 100, CommonTouchActive(1850, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1750, 650, 100, 100, CommonTouchActive(1750, 650, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1750, 850, 100, 100, CommonTouchActive(1750, 850, 100, 100) ? "cyan" : "#FFFFFF80", 4);
	}

	// Keeps the time of the frame for the next run
	PlatformLastTime = PlatformTime;

}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformRun() {
	PlatformDraw();
	DrawButton(1900, 10, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (PlatformHeal != null) DrawButton(1800, 10, 90, 90, "", "White", "Icons/Save.png", TextGet("Save"));
	if (PlatformHeal != null) DrawButton(1700, 10, 90, 90, "", "White", "Icons/Character.png", TextGet("Character"));
	if ((PlatformHeal != null) && (PlatformParty.length >= 2)) DrawButton(1600, 10, 90, 90, "", "White", "Icons/Next.png", TextGet("ChangeCharacter"));
	if ((PlatformHeal != null) && PlatformSaveMode)
		for (let S = 0; S < 10; S++)
			DrawButton(250 + (S * 157), 200, 90, 90, S.toString(), "White", "", TextGet("SaveOn") + S.toString());
	if (CommonIsMobile) PlatformTouch();
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
	if (Source.Attack != null)
		for (let Attack of Source.Attack)
			if (Attack.Name == Type) {
				if ((Attack.Cooldown != null) && (Attack.Cooldown > 0) && PlatformCooldownActive(Type)) return;
				if ((Attack.Magic != null) && (Attack.Magic > 0)) {
					if ((PlatformPlayer.Magic == null) || (PlatformPlayer.Magic < Attack.Magic)) return;
					PlatformPlayer.Magic = PlatformPlayer.Magic - Attack.Magic;
				}
				if ((Attack.Cooldown != null) && (Attack.Cooldown > 0)) {
					let Time = Attack.Cooldown;
					if ((Type == "Scream") && (PlatformHasPerk(PlatformPlayer, "Howl"))) Time = Time - 1000;
					if (Type == "Scream") PlatformTimedScreenFilter = { End: CommonTime() + 1000, Filter: "#00000060" };
					PlatformCooldown.push({Type: Attack.Name, Time: CommonTime() + Time, Delay: Time});
				}
				if (Type == "Backflip") Source.ForceX = (Source.FaceLeft ? 1 : -1) * (PlatformHasPerk(Source, "Acrobat") ? 180 : 120);
				Source.Action = { Name: Type, Start: CommonTime(), Expire: CommonTime() + Attack.Speed };
			}
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1900, 10, 90, 90)) return PlatformLeave();
	if ((PlatformHeal != null) && PlatformSaveMode)
		for (let S = 0; S < 10; S++)
			if (MouseIn(250 + (S * 157), 200, 90, 90))
				return PlatformSaveGame(S);
	if (MouseIn(1800, 10, 90, 90) && (PlatformHeal != null)) {
		PlatformSaveMode = !PlatformSaveMode;
		if (PlatformSaveMode) PlatformMessageSet(TextGet("SelectSave"));
		return;
	}
	if (MouseIn(1700, 10, 90, 90) && (PlatformHeal != null)) return CommonSetScreen("Room", "PlatformProfile");
	if (MouseIn(1600, 10, 90, 90) && (PlatformHeal != null)) return PlatformPartyNext();
	if (!CommonIsMobile && !PlatformPlayer.HalfBound) PlatformAttack(PlatformPlayer, PlatformMoveActive("Crouch") ? "CrouchAttackFast" : "StandAttackFast");
}

/**
 * When the screens exits, we unload the listeners
 * @returns {void} - Nothing
 */
function PlatformLeave() {
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
	PlatformDrawUpArrow = [null,null];
	if ((PlatformRoom == null) || (PlatformRoom.Door == null)) return;
	for (let Door of PlatformRoom.Door)
		if ((PlatformPlayer.X >= Door.FromX) && (PlatformPlayer.X <= Door.FromX + Door.FromW) && (PlatformPlayer.Y >= Door.FromY) && (PlatformPlayer.Y <= Door.FromY + Door.FromH) && ("Up" === Door.FromType)) {
			PlatformDrawUpArrow = [Door.FromX + Door.FromW / 2, Door.FromY + Door.FromH / 2];
		}
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
			if ((Char.Dialog != null) && (Math.abs(PlatformPlayer.X - Char.X) <= 150) && (Math.abs(PlatformPlayer.Y - Char.Y) <= 450))
				return PlatformDialogStart(Char.Dialog);
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
			Source.Action = { Name: "Bind", Target: C.ID, Start: CommonTime(), Expire: CommonTime() + (PlatformHasPerk(PlatformPlayer, "Kidnapper") ? 1200 : 2400)};
			return;
		}
}

/**
 * Saves the game on a specific slot
 * @param {Number} Slot - The slot to use (from 0 to 9)
 * @returns {void} - Nothing
 */
function PlatformSaveGame(Slot) {
	PlatformPartySave();
	PlatformSaveMode = false;
	let SaveDialog = [];
	for (let Char of PlatformDialogCharacter)
		if ((Char.Love != null) || (Char.Domination != null))
			SaveDialog.push({ Name: Char.Name, Love: Char.Love, Domination: Char.Domination });
	let SaveObj = {
		Character: PlatformPlayer.Name,
		Status: PlatformPlayer.Status,
		Party: PlatformParty,
		Room: PlatformRoom.Name,
		Event: PlatformEvent,
		Dialog: SaveDialog
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

	// Gets the saved JSON object and make sure it's valid
	let LoadStr = localStorage.getItem("BondageBrawlSave" + Slot.toString());
	if (LoadStr == null) return;
	let LoadObj = JSON.parse(LoadStr);
	if (LoadObj.Character == null) return;
	if (LoadObj.Status == null) return;
	if (LoadObj.Room == null) return;

	// Adds the character manually or load the saved party
	PlatformChar = [];
	if (Array.isArray(LoadObj.Party)) {
		PlatformParty = LoadObj.Party;
	} else {
		PlatformParty = [];
		PlatformPartyAdd(LoadObj);
	}
	PlatformCreateCharacter(LoadObj.Character, LoadObj.Status, 1000);
	PlatformPartyLoad();

	// Loads the game events and party
	PlatformEvent = LoadObj.Event;
	if (PlatformEvent == null) PlatformEvent = [];
	PlatformPartyBuild();

	// Loads the character relationships
	PlatformDialogCharacter = JSON.parse(JSON.stringify(PlatformDialogCharacterTemplate));
	if (LoadObj.Dialog != null)
		for (let DialogChar of LoadObj.Dialog)
			for (let Char of PlatformDialogCharacter)
				if (DialogChar.Name == Char.Name) {
					Char.Love = DialogChar.Love;
					Char.Domination = DialogChar.Domination;
				}

	// Loads the current room and launches it
	PlatformLoadRoom(LoadObj.Room);
	PlatformPlayer.X = Math.round(PlatformRoom.Width / 2);
	CommonSetScreen("Room", "Platform");

}

/**
 * Teleports a character forward
 * @param {Object} C - The character to teleport
 * @returns {void} - Nothing
 */
function PlatformCastTeleport(C) {
	if (PlatformCooldownActive("Teleport")) return;
	if ((C.Magic == null) || (C.Magic == 0)) return;
	C.Magic--;
	let Time = 3000;
	if (PlatformHasPerk(C, "Freedom")) Time = 2000;
	if (C.Camera) PlatformCooldown.push({Type: "Teleport", Time: CommonTime() + Time, Delay: Time});
	C.ForceX = C.ForceX + (C.FaceLeft ? -250 : 250);
	C.Immunity = CommonTime() + 500;
	C.Effect = { Name: "Teleport", End: C.Immunity };
}

/**
 * Heals the character for 20% of it's max HP
 * @param {Object} C - The character to teleport
 * @returns {void} - Nothing
 */
function PlatformCastHeal(C) {
	if (PlatformCooldownActive("Heal")) return;
	if ((C.Magic == null) || (C.Magic <= 2)) return;
	if (C.Health >= C.MaxHealth) return;
	let Heal = Math.round(C.MaxHealth * 0.2);
	if (Heal > C.MaxHealth - C.Health) Heal = C.MaxHealth - C.Health;
	C.Health = C.Health + Heal;
	C.Magic = C.Magic - 3;
	C.Damage.push({ Value: Heal * -1, Expire: CommonTime() + 2000});
	let Time = 30000;
	if (PlatformHasPerk(C, "Cure")) Time = 20000;
	if (C.Camera) PlatformCooldown.push({Type: "Heal", Time: CommonTime() + Time, Delay: Time});
}

/**
 * Handles keys pressed
 * @param {Object} e - The key pressed
 * @returns {void} - Nothing
 */
function PlatformEventKeyDown(e) {
	PlatformPlayer.Run = ((e.keyCode == PlatformLastKeyCode) && (CommonTime() <= PlatformLastKeyTime + 333) && ([65, 97, 68, 100].indexOf(e.keyCode) >= 0) && (PlatformKeys.indexOf(e.keyCode) < 0)) || ((e.keyCode == PlatformLastKeyCode) && PlatformPlayer.Run && (PlatformKeys.indexOf(e.keyCode) >= 0));
	if (PlatformPlayer.Health <= 0) return;
	if (PlatformActionIs(PlatformPlayer, "Bind")) PlatformPlayer.Action = null;
	if (e.keyCode == 32) PlatformPlayer.Action = null;
	if ((e.keyCode == 87) || (e.keyCode == 119) || (e.keyCode == 90) || (e.keyCode == 122)) return PlatformEnterRoom("Up");
	if (((e.keyCode == 83) || (e.keyCode == 115)) && PlatformPlayer.HalfBound) return;
	if (((e.keyCode == 73) || (e.keyCode == 105)) && !PlatformPlayer.HalfBound && PlatformHasPerk(PlatformPlayer, "Teleport")) return PlatformCastTeleport(PlatformPlayer);
	if (((e.keyCode == 73) || (e.keyCode == 105)) && !PlatformPlayer.HalfBound && PlatformHasPerk(PlatformPlayer, "Backflip")) return PlatformAttack(PlatformPlayer, "Backflip");
	if (((e.keyCode == 80) || (e.keyCode == 112)) && !PlatformPlayer.HalfBound && PlatformHasPerk(PlatformPlayer, "Heal")) return PlatformCastHeal(PlatformPlayer);
	if (((e.keyCode == 76) || (e.keyCode == 108)) && !PlatformPlayer.HalfBound && PlatformAnimAvailable(PlatformPlayer, "StandAttackFast")) return PlatformAttack(PlatformPlayer, PlatformMoveActive("Crouch") ? "CrouchAttackFast" : "StandAttackFast");
	if (((e.keyCode == 75) || (e.keyCode == 107)) && !PlatformPlayer.HalfBound && !PlatformMoveActive("Crouch") && PlatformHasPerk(PlatformPlayer, "Apprentice")) return PlatformAttack(PlatformPlayer, "Scream");
	if (((e.keyCode == 75) || (e.keyCode == 107)) && !PlatformPlayer.HalfBound && PlatformAnimAvailable(PlatformPlayer, "StandAttackSlow")) return PlatformAttack(PlatformPlayer, PlatformMoveActive("Crouch") ? "CrouchAttackSlow" : "StandAttackSlow");
	if ((e.keyCode == 79) || (e.keyCode == 111)) return PlatformBindStart(PlatformPlayer);
	if ((PlatformRoom.Heal != null) && (e.keyCode >= 48) && (e.keyCode <= 57)) return PlatformSaveGame(e.keyCode - 48);
	if (PlatformKeys.indexOf(e.keyCode) < 0) PlatformKeys.push(e.keyCode);
	PlatformLastKeyCode = e.keyCode;
	PlatformLastKeyTime = CommonTime();
}

/**
 * Handles keys released
 * @param {Object} e - The key released
 * @returns {void} - Nothing
 */
function PlatformEventKeyUp(e) {
	if (PlatformKeys.indexOf(e.keyCode) >= 0) PlatformKeys.splice(PlatformKeys.indexOf(e.keyCode), 1);
}

/**
 * Handles the controller inputs
 * @param {Object} Buttons - The buttons pressed on the controller
 * @returns {boolean} - Always TRUE to indicate that the controller is handled
 */
function PlatformController(Buttons) {

	// Double-tap management to run left
	if ((Buttons[ControllerDPadLeft].pressed == true) && (ControllerGameActiveButttons.LEFT == false)) {
		PlatformPlayer.Run = false;
		if (PlatformRunDirection != "LEFT") {
			PlatformRunDirection = "LEFT";
		} else {
			if ((CommonTime() <= PlatformRunTime + 333))
				PlatformPlayer.Run = true;
		}
		PlatformRunTime = CommonTime();
	}

	// Double-tap management to run right
	if ((Buttons[ControllerDPadRight].pressed == true) && (ControllerGameActiveButttons.RIGHT == false)) {
		PlatformPlayer.Run = false;
		if (PlatformRunDirection != "RIGHT") {
			PlatformRunDirection = "RIGHT";
		} else {
			if ((CommonTime() <= PlatformRunTime + 333))
				PlatformPlayer.Run = true;
		}
		PlatformRunTime = CommonTime();
	}

	// On a new A, X, Y or UP button, we activate the keyboard equivalent
	if ((Buttons[ControllerB].pressed == true) && (ControllerGameActiveButttons.B == false)) PlatformEventKeyDown({ keyCode: 76 });
	if ((Buttons[ControllerX].pressed == true) && (ControllerGameActiveButttons.X == false)) PlatformEventKeyDown({ keyCode: 75 });
	if ((Buttons[ControllerY].pressed == true) && (ControllerGameActiveButttons.Y == false)) PlatformEventKeyDown({ keyCode: 79 });
	if ((Buttons[ControllerDPadUp].pressed == true) && (ControllerGameActiveButttons.UP == false)) PlatformEventKeyDown({ keyCode: 90 });
	if ((Buttons[ControllerTriggerRight].pressed == true) && (ControllerGameActiveButttons.TRIGHT == false)) PlatformEventKeyDown({ keyCode: 73 });
	if ((Buttons[ControllerTriggerLeft].pressed == true) && (ControllerGameActiveButttons.TLEFT == false)) PlatformEventKeyDown({ keyCode: 80 });
	PlatformButtons = Buttons;
	return true;

}

/**
 * Handles the touched regions for mobile play
 * @returns {void}
 */
function PlatformTouch() {
	if (CommonTouchActive(150, 650, 100, 100) && !CommonTouchActive(150, 650, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 90 });
	if (CommonTouchActive(1750, 850, 100, 100) && !CommonTouchActive(1750, 850, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 76 });
	if (CommonTouchActive(1650, 750, 100, 100) && !CommonTouchActive(1650, 750, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 75 });
	if (CommonTouchActive(1750, 650, 100, 100) && !CommonTouchActive(1750, 650, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 79 });
	PlatformLastTouch = CommonTouchList;
}

/**
 * Returns TRUE if a specific perk is allocated for that character
 * @param {Object} C - The platform character to evaluate
 * @param {Object} Perk - The perk name to validate
 * @returns {boolean} - TRUE if the perk is paid
 */
function PlatformHasPerk(C, Perk) {
	if ((C.Perk == null) || (C.PerkName == null)) return false;
	if (C.PerkName.indexOf(Perk) < 0) return false;
	return (C.Perk.substr(C.PerkName.indexOf(Perk), 1) == "1");
}

/**
 * Returns TRUE if a specific cooldown is currently active
 * @param {String} Name - The name of the cooldown to validate
 * @returns {boolean} - TRUE if active
 */
function PlatformCooldownActive(Name) {
	for (let C of PlatformCooldown)
		if (C.Type == Name)
			return true;
	return false;
}