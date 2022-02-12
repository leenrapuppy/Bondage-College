"use strict";
let KinkyDungeonManaCost = 10; // The base mana cost of a spell, multiplied by the spell's level


let KinkyDungeonBookScale = 1.3;

let KinkyDungeonMysticSeals = 0; // Mystic seals are used to unlock a spell from one of 3 books:
// 0 Ars Pyrotecnica - Elemental magic such as fireballs, ice, wind, etc
// 1 Codex Imaginus - Conjuring things such as weapons and restraints, and also enchanting (and disenchanting)
// 2 Clavicula Romantica - Illusory magic, disorientation and affecting enemy AI

// Magic book image source: https://www.pinterest.es/pin/54324739242326557/

// Note that you have these 3 books in your inventory at the start; you select the page open in each of them but you need to have hands free or else you can only turn to a random page at a time. If you are blind, you also can't see any page after you turn the page

let KinkyDungeonCurrentBook = "Elements";
let KinkyDungeonCurrentPage = 0;
let KinkyDungeonCurrentSpellsPage = 0;
let KinkyDungeonBooks = ["Elements", "Conjure", "Illusion"];
let KinkyDungeonPreviewSpell = null;

// Glossary of spell effects
// manacost: Number of turns of no stamina regen after casting the spell. Stacks
// Components: Components required to cast the spell. All of them need to be met
// Level: Determines mana cost and availability. On enemies, increases cooldown
// Power: Determines damage
// Type: "bolt" is a projectile. "inert" is a static delayed blast. "self" is a spell that casts on the player.
// Delay: If the spell's type is "inert", this determines how long before it explodes
// Range: Max targeting range
// damage: damage TYPE. Various damage types have different effects, see KinkyDungeonDealDamage
// speed: speed of a "bolt" projectile
// playerEffect: What happens when the effect hits a player
// trail, trailchance, traildamage, traillifetime: for lingering projectiles left behind the projectile
// onhit: What happens on AoE. Deals aoepower damage, or just power otherwise

let KinkyDungeonSpellsStart = [
	{name: "Knife", sfx: "Miss", hitsfx: "LightSwing", school: "Elements", manacost: 0, components: ["Arms"], knifecost: 1, staminacost: 1, level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 2.5, delay: 0, range: 50, evadeable: true, damage: "piercing", speed: 2, playerEffect: {name: "Damage"},
		events: [{type: "DropKnife", trigger: "bulletHit"},]},
];

let KinkyDungeonSpellLevelMax = 5;

let KinkyDungeonSpellLevel = {
	"Elements":1,
	"Conjure":1,
	"Illusion":1,
};
let KinkyDungeonLearnableSpells = [
	//Page 1: Elements
	[
		// Verbal
		["Electrify", "IronBlood", "Incinerate", "IceBreath",],
		// Arms
		["Firebolt", "Icebolt", "StoneSkin", "Crackle", "Fireball", "LightningBolt"],
		// Legs
		["Shield", "GreaterShield", "Fissure"],
		// Passive
		["Knife", "FlameBlade",],
	],

	//Page 2: Conjuration
	[
		// Verbal
		["Bomb", "FireElemental", "Blink"],
		// Arms
		["ChainBolt", "SlimeBall"],
		// Legs
		["Snare", "Wall", "Ally", "Slime", "StormCrystal", "Golem", "Leap"],
		// Passive
		["Knife", "FloatingWeapon"],
	],

	//Page 3: Illusion
	[
		// Verbal
		["Flash", "Shroud", "GreaterFlash", "ShadowWarrior", "FocusedFlash", "Invisibility"],
		// Arms
		["Dagger", "ShadowSlash", "ShadowBlade", "Corona"],
		// Legs
		["Decoy", ],
		// Passive
		["Knife", "TrueSight", "EnemySense", "FleetFooted"],
	],

	//Page 4
	[
		["SPUp1","SPUp2","SPUp3"],
		["MPUp1","MPUp2","MPUp3"],
		["APUp1","APUp2","APUp3"],
		["SummonUp1", "SummonUp2", "SpellChoiceUp1", "SpellChoiceUp2"],
	],
];

let KinkyDungeonSpellChoices = [0];
let KinkyDungeonSpellChoicesToggle = [true];
let KinkyDungeonSpellChoiceCount = 5;

let KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. When you plan to use a mystic seal, you get 3 spells to choose from.
	"Elements": [
		{name: "SPUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Incinerate", noise: 3, sfx: "FireSpell", school: "Elements", manacost: 10, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 1, power: 2, range: 2.5, size: 3, aoe: 1.5, lifetime: 6, damage: "fire", playerEffect: {name: "Damage"}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
		{name: "Firebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 2, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Fireball", noise: 3, sfx: "FireSpell", school: "Elements", manacost: 8, components: ["Arms"], level:3, type:"bolt", projectileTargeting:true, onhit:"aoe", power: 6, delay: 0, range: 50, aoe: 1.5, size: 3, lifetime:1, damage: "fire", speed: 1, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Icebolt", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 6,  power: 2, delay: 0, range: 50, damage: "ice", speed: 3, playerEffect: {name: "Damage"}}, // Throws a blast of ice which stuns the target for 4 turns
		{name: "Electrify", noise: 6, sfx: "FireSpell", landsfx: "Shock", school: "Elements", manacost: 7, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 8, time: 4, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
		{name: "Crackle", noise: 6, sfx: "Shock", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
			trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0, playerEffect: {name: "Shock", time: 1}},
		{name: "Fissure", noise: 7, sfx: "FireSpell", school: "Elements", manacost: 8, components: ["Legs"], level:3, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 5.5, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "fire",
			trailPower: 1.5, trailLifetime: 6, trailTime: 4, piercingTrail: true, trailDamage:"fire", trail:"lingering", trailChance: 1, playerEffect: {name: "DamageNoMsg", hitTag: "Fissure", time: 1, damage:"fire", power: 3}},
		{name: "Shield", sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"inert", block: 10, onhit:"", power: 0, delay: 2, range: 1.5, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 1 turn
		{name: "GreaterShield", sfx: "MagicSlash", school: "Elements", manacost: 2, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"inert", block: 20, onhit:"", power: 0, delay: 8, range: 2, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 5 turns
		{name: "IceBreath", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 10, power: 5, lifetimeHitBonus: 5, damage: "ice", playerEffect: {name: "Damage"}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		{name: "LightningBolt", noise: 11, sfx: "Shock", school: "Elements", manacost: 10, components: ["Arms"], level:3, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 8, delay: 0, time: 1, range: 50, speed: 50, size: 1, damage: "electric",
			trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
		{name: "StoneSkin", sfx: "Bones", school: "Elements", manacost: 8, components: ["Arms"], mustTarget: true, level:1, type:"buff", buffs: [{id: "StoneSkin", type: "Armor", duration: 40, power: 2.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:30, power: 0, range: 2, size: 1, damage: ""},
		{name: "IronBlood", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Verbal"], mustTarget: true, selfTargetOnly: true, level:1, type:"buff", channel: 4,
			buffs: [
				{id: "IronBlood", aura: "#ff0000", type: "AttackStamina", duration: 99999, cancelOnReapply: true, endSleep: true, power: 1, player: true, enemies: false, tags: ["attack", "stamina"]},
				{id: "IronBlood2", type: "ManaCostMult", duration: 99999, cancelOnReapply: true, endSleep: true, power: 0.25, player: true, enemies: false, tags: ["manacost"]},
			], onhit:"", time:30, power: 0, range: 2, size: 1, damage: ""},
		{name: "FlameBlade", sfx: "FireSpell", school: "Elements", manacost: 3, components: [], level:1, type:"passive", events: [{type: "FlameBlade", trigger: "playerAttack"}]},
		{name: "FloatingWeapon", sfx: "MagicSlash", school: "Conjure", manacost: 2, components: [], level:3, type:"passive",
			events: [{type: "FloatingWeapon", trigger: "playerAttack"}, {type: "HandsFree", trigger: "getWeapon"}, {type: "HandsFree", trigger: "calcDamage"}]},
	],
	"Conjure": [
		{name: "MPUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SummonUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SummonUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Bomb", noise: 5, sfx: "FireSpell", school: "Conjure", manacost: 5, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 5, power: 10, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "Damage"}, channel: 1},
		{name: "Snare", sfx: "FireSpell", school: "Conjure", manacost: 2, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", onhit:"lingering", lifetime:9999, time: 12, delay: 5, range: 1, damage: "stun", playerEffect: {name: "MagicRope", time: 3}}, // Creates a magic rope trap that creates magic ropes on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
		{name: "Slime", landsfx: "MagicSlash", school: "Conjure", manacost: 9, components: ["Legs"], level:1, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 2, lifetime: 3, power: 4, lifetimeHitBonus: 20, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		//{name: "PinkGas", manacost: 4, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 2, range: 4, size: 3, aoe: 2.5, lifetime: 9999, damage: "stun", playerEffect: {name: "PinkGas", time: 3}}, // Dizzying gas, increases arousal
		{name: "ChainBolt", sfx: "FireSpell", school: "Conjure", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 10,  power: 2, delay: 0, range: 50, damage: "chain", speed: 2, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
		{name: "SlimeBall", noise: 1, sfx: "FireSpell", school: "Conjure", manacost: 8, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", time: 3,  power: 5, delay: 0, range: 50, damage: "glue", speed: 2,
			trailPower: 4, trailLifetime: 10, trailTime: 3, trailDamage:"glue", trail:"lingering", trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
		{name: "Leap", sfx: "Teleport", school: "Conjure", manacost: 8, components: ["Legs"], noTargetDark: true, noTargetEnemies: true, level:3, type:"hit", onhit:"teleport", delay: 1, lifetime:1, range: 3, damage: ""}, // A quick blink which takes effect instantly, but requires legs to be free
		{name: "Blink", sfx: "Teleport", school: "Conjure", manacost: 6, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"teleport", delay: 3, lifetime:1, range: 5, damage: ""}, // A slow blink with short range, but it uses verbal components
		{name: "Wall", sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"inert", onhit:"summon", summon: [{name: "Wall", count: 1, time: 10}], power: 0, time: 10, delay: -1, range: 6, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Ally", sfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", onhit:"summon", summon: [{name: "Ally", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "FireElemental", sfx: "MagicSlash", school: "Conjure", manacost: 20, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "FireElemental", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Golem", sfx: "MagicSlash", school: "Conjure", manacost: 24, components: ["Legs"], noTargetEnemies: true, level:3, type:"inert", onhit:"summon", summon: [{name: "Golem", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "StormCrystal", noise: 7, sfx: "MagicSlash", school: "Conjure", manacost: 14, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "StormCrystal", count: 1, time: 30}], power: 0, time: 30, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
	],
	"Illusion": [
		{name: "APUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp1", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp2", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:5, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Dagger", sfx: "MagicSlash", school: "Illusion", manacost: 2, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, noDoubleHit: true, piercing: true, onhit:"", power: 3, time: 0, delay: 0, range: 6, damage: "cold", speed: 4, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Flash", noise: 8, sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 3, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
		{name: "GreaterFlash", noise: 10, sfx: "FireSpell", school: "Illusion", manacost: 6, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", time: 8, delay: 1, power: 1, range: 2.5, size: 5, aoe: 2.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 5}}, // Much greater AoE. Careful not to get caught!
		{name: "FocusedFlash", noise: 10, sfx: "FireSpell", school: "Illusion", manacost: 9, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", time: 14, delay: 2, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 12}}, // Longer delay, but the stun lasts much longer.
		{name: "Shroud", sfx: "FireSpell", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [
			{id: "Shroud", type: "Evasion", power: 3.0, player: true, enemies: true, tags: ["darkness"], range: 1.5},
			{id: "Shroud2", type: "Sneak", power: 3.0, player: true, enemies: false, tags: ["darkness"], range: 1.5}
		], onhit:"", time:8, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
		{name: "Invisibility", sfx: "FireSpell", school: "Illusion", manacost: 8, components: ["Verbal"], mustTarget: true, level:3, type:"buff", buffs: [{id: "Invisibility", type: "Sneak", duration: 10, power: 10.0, player: true, enemies: true, tags: ["invisibility"]}], onhit:"", time:10, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowBlade", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Arms"], mustTarget: true, level:2, type:"buff",
			buffs: [{id: "ShadowBlade", type: "AttackDmg", duration: 50, power: 2.0, player: true, enemies: true, maxCount: 5, tags: ["attack", "damage"]}], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowSlash", noise: 3, sfx: "MagicSlash", school: "Illusion", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, piercing: true, noTerrainHit: true, noEnemyCollision: true, onhit:"aoe", power: 4.5, delay: 0, range: 1.5, aoe: 1.5, size: 3, lifetime:1, damage: "cold", speed: 1, time: 2,
			trailspawnaoe: 1.5, trailPower: 0, trailLifetime: 1.1, trailHit: "", trailDamage:"inert", trail:"lingering", trailChance: 0.4},
		{name: "Decoy", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "Decoy", count: 1, time: 20}], power: 0, time: 20, delay: -1, range: 4, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "ShadowWarrior", sfx: "MagicSlash", school: "Illusion", manacost: 10, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "ShadowWarrior", count: 1, time: 12}], power: 6, time: 12, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "inert"},
		{name: "Corona", noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: true,
			spellcast: {spell: "CoronaBeam", target: "target", directional:true, offset: false}, channel: 2},
		{name: "TrueSight", school: "Illusion", manacost: 1, defaultOff: true, cancelAutoMove: true, components: [], level:1, type:"passive", events: [
			{type: "TrueSight", trigger: "vision"},
			{type: "Blindness", trigger: "calcStats", power: -1},
		]},
		{name: "EnemySense", school: "Illusion", manacost: 4, defaultOff: true, cancelAutoMove: true, costOnToggle: true, components: [], level:2, type:"passive", events: [{type: "EnemySense", trigger: "draw", dist: 8, distStealth: 4}]},
		{name: "FleetFooted", sfx: "FireSpell", school: "Illusion", manacost: 0.5, components: [], level:2, type:"passive",
			events: [{type: "FleetFooted", trigger: "beforeMove", power: 1}, {type: "FleetFooted", trigger: "afterMove"}, {type: "FleetFooted", trigger: "beforeTrap", chance: 0.25}]},
	],
};
let KinkyDungeonSpellListEnemies = [
	{name: "DarkShroud", sfx: "FireSpell", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "DarkShroud", type: "Evasion", power: 1.5, player: false, enemies: true, tags: ["heavydarkness"], range: 1.5},], onhit:"", time:8, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Slippery", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Verbal"], mustTarget: true, selfTargetOnly: true, level:1, type:"buff", channel: 4,
		buffs: [
			{id: "Slippery", aura: "#00ff00", type: "BoostStruggle", duration: 10, power: 0.1, player: true, enemies: false, tags: ["struggle"]},
		], onhit:"", time:10, power: 0, range: 2, size: 1, damage: ""},
	{name: "Cutting", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Verbal"], mustTarget: true, selfTargetOnly: true, level:1, type:"buff", channel: 4,
		buffs: [
			{id: "Cutting", aura: "#ffff00", type: "BoostCutting", duration: 10, power: 0.3, player: true, enemies: false, tags: ["struggle"]},
			{id: "Cutting2", type: "BoostCuttingMinimum", duration: 10, power: 0.8, player: true, enemies: false, tags: ["struggle", "allowCut"]},
		], onhit:"", time:10, power: 0, range: 2, size: 1, damage: ""},
	{name: "CoronaBeam", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 12, delay: 0, time: 1, range: 8, speed: 50, size: 1, damage: "fire",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
	{name: "AllyCrackle", sfx: "Shock", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0},
	{name: "AllyFirebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1},
	{name: "AllyShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},
	{name: "HeelShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 3, time: 4, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},
	{name: "FlameStrike", sfx: "FireSpell", school: "Elementa", manacost: 6, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 3, time: 2, delay: 1, range: 1.5, size: 3, aoe: 1.5, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "ShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold", playerEffect: {name: "ShadowStrike", damage: "cold", power: 4, count: 1}},

	{enemySpell: true, msg: true, name: "AreaElectrify", landsfx: "Shock", school: "Conjure", manacost: 10, components: ["Legs"], level:1, type:"inert", onhit:"cast", dot: true, time: 4, delay: 3, range: 2.5, size: 3, aoe: 2.5, lifetime: 1, power: 1, damage: "inert",
		spellcasthit: {spell: "WitchElectrify", target: "onhit", chance: 0.22, directional:false, offset: false}, channel: 2}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "IceDragonBreath", sfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 50, size: 1, damage: "inert",
		trailPower: 4, trailLifetime: 1, trailLifetimeBonus: 4, trailTime: 3, trailspawnaoe: 1.5, trailDamage:"ice", trail:"lingering", trailChance: 0.3, trailPlayerEffect: {name: "Freeze", time: 3}},
	{enemySpell: true, name: "IceDragonBreathPrepare", sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 5, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "IceDragonBreath", target: "target", directional:true, offset: false}, channel: 2},

	{enemySpell: true, name: "IceSlow", sfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 1, delay: 0, time: 2, range: 4, speed: 50, size: 1, damage: "inert",
		trailPower: 4, trailLifetime: 2, trailLifetimeBonus: 8, trailTime: 3, trailspawnaoe: 1.5, trailDamage:"ice", trail:"lingering", trailChance: 0.5, trailPlayerEffect: {name: "Chill", time: 3, damage: "ice", power: 1}},
	{enemySpell: true, name: "IceSlowPrepare", sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 12, range: 5, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "IceSlow", target: "target", directional:true, offset: false}, channel: 1},

	{enemySpell: true, name: "FlashBomb", sfx: "Miss", school: "Illusion", manacost: 3, specialCD: 12, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1, range: 4, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 3}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
	{enemySpell: true, name: "EnemyFlash", noise: 8, sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 3, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!

	{enemySpell: true, name: "SleepGas", sfx: "Miss", school: "Illusion", manacost: 4, specialCD: 24, components: ["Verbal"], level:1, type:"inert", passthrough: true, noTerrainHit: true, buffs: [
		{id: "SleepGas", type: "Sleepiness", power: 1, player: true, enemies: false, tags: ["sleep"], range: 1.5}], onhit:"", time:6, aoe: 1.5, power: 1, delay: 8, range: 4, size: 3, damage: "poison", playerEffect: {name: "DamageNoMsg", damage: "poison", power: 1}}, // Creates a shroud. Enemies within are hard to hit with melee attacks.

	{enemySpell: true, name: "Glue", landsfx: "Freeze", school: "Conjure", manacost: 9, components: ["Legs"], level:1, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 1.5, lifetime: 24, power: 4, lifetimeHitBonus: 76, damage: "glue", playerEffect: {name: "Glue", count: 1, damage: "glue", power: 4, time: 1}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "RedSlime", sfx: "Miss", manacost: 4, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 4, delay: 0, range: 50, damage: "glue", speed: 1.5, playerEffect: {name: "DamageNoMsg", power: 4, damage: "glue"},
		spellcast: {spell: "SummonSingleRedSlime", target: "onhit", directional:false, offset: false, strict: true}},

	{enemySpell: true, name: "AmpuleBlue", sfx: "Miss", manacost: 5, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 4, delay: 0, range: 50, damage: "glue", speed: 1, playerEffect: {name: "AmpuleBlue", damage: "glue", power: 4, count: 1}},

	{enemySpell: true, name: "AmpuleGreen", sfx: "Miss", manacost: 4, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "SleepGas", target: "onhit", directional:false, offset: false}},
	{enemySpell: true, name: "AmpuleYellow", sfx: "Miss", manacost: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "Glue", target: "onhit", directional:false, offset: false}},
	{enemySpell: true, name: "AmpuleRed", sfx: "Miss", manacost: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "SummonRedSlime", target: "onhit", directional:true, offset: false}},

	{enemySpell: true, name: "ZombieOrb", sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "chain", speed: 1,
		playerEffect: {name: "CharmWraps", power: 2, damage: "ice", time: 1}},
	{enemySpell: true, name: "ZombieOrbIce", specialCD: 12, sfx: "MagicSlash", hitsfx: "Freeze", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 3, delay: 0, range: 50, damage: "ice", speed: 1,
		playerEffect: {name: "Freeze", power: 4, damage: "ice", time: 3}},

	{enemySpell: true, name: "RopeEngulf", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 6, range: 2, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "RopeEngulf", power: 2}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
	{enemySpell: true, name: "Entangle", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 4, range: 6, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "VineEngulf", power: 2}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
	{enemySpell: true, name: "SoulCrystalBind", sfx: "Freeze", manacost: 7, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 6, range: 6, size: 3, aoe: 1, lifetime: 1, damage: "drain", playerEffect: {name: "ObsidianEngulf", count: 1, power: 6, damage: "drain"}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!

	{enemySpell: true, name: "WitchChainBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "MagicChain", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleMagicChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "BanditBola", sfx: "Miss", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 3, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "BanditBola", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "RestrainingDevice", sfx: "Miss", manacost: 6, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 1,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "RestrainingDevice", count: 3, time: 3, power: 5, damage: "crush"}},
	{enemySpell: true, name: "MummyBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "MysticShock", time: 3}},
	{enemySpell: true, name: "RobotBolt", sfx: "Laser", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "electric", speed: 1, playerEffect: {name: "RobotShock", time: 2}},
	{enemySpell: true, name: "RubberBullets", sfx: "Gunfire", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "glue", speed: 2, playerEffect: {name: "RubberBullets", power: 4, count: 1, damage: "glue"}},
	{enemySpell: true, name: "HeatBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "HeatBlast", time: 1, damage: "pain", power: 5}},
	{enemySpell: true, noFirstChoice: true, name: "Hairpin", sfx: "Miss", manacost: 2, castRange: 6, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "pain", speed: 2, playerEffect: {name: "Hairpin", power: 2, damage: "pain", time: 1}},
	{enemySpell: true, name: "PoisonDragonBlast", sfx: "FireSpell", hitsfx: "Bones", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "grope", speed: 1, playerEffect: {name: "VineEngulf", power: 2}},
	{enemySpell: true, name: "ElfArrow", sfx: "Miss", hitsfx: "FireSpell", manacost: 3, components: ["Arms"], level: 1, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "EnchantedArrow", power: 2, count: 1}},
	{enemySpell: true, name: "ShadowOrb", sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 5, damage: "inert", speed: 2, playerEffect: {name: ""},
		spellcast: {spell: "ShadowScythe", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "ShadowScythe", sfx: "MagicSlash", manacost: 4, components: ["Verbal"], level:1, type:"inert", noTerrainHit: true, onhit:"aoe", time: 5, delay: 1, power: 6, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "ShadowBind", time: 4}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
	{enemySpell: true, name: "WitchSlime", landsfx: "MagicSlash", manacost: 2, components: ["Legs"], level:2, type:"inert", onhit:"lingering", time: 2, delay: 1, range: 4, size: 3, aoe: 1, lifetime: 1, lifetimeHitBonus: 9, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{enemySpell: true, name: "WitchSlimeBall", sfx: "FireSpell", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", time: 2,  power: 2, delay: 0, range: 50, damage: "glue", speed: 1, trailLifetime: 10, trailDamage:"glue", trail:"lingering", trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
	{enemySpell: true, name: "WitchElectrify", landsfx: "Shock", manacost: 3, components: ["Arms"], level:2, type:"inert", onhit:"aoe", power: 5, time: 1, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
	{enemySpell: true, name: "SummonSkeleton", landsfx: "Bones", manacost: 4, components: ["Verbal"], level:3, type:"inert", onhit:"summon", summon: [{name: "SummonedSkeleton", count: 1, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 4, size: 3, aoe: 2.1, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonSkeletons", landsfx: "Bones", manacost: 12, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "SummonedSkeleton", count: 4, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 4, size: 3, aoe: 2.6, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "RopeAttack", hitsfx: "Struggle", manacost: 6, components: ["Verbal"], level:4, type:"hit", onhit:"null", noSumMsg: true, summon: [
		{name: "LearnedRope", count: 1, chance: 0.5, time: 20, strict: true},
		{name: "UnforseenRope", count: 1, chance: 0.5, time: 20, strict: true}
	], power: 0, time: 12, delay: 1, range: 8, size: 3, aoe: 10, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonCrystals", landsfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "ChaoticCrystal", count: 3, time: 9999}], power: 0, time: 12, delay: 1, range: 40, size: 1, aoe: 2, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonTickleHand", sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "TickleHand", count: 3, time: 12}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonRedSlime", sfx: "Freeze", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "RedSlime", count: 3, time: 18, strict: true}], power: 0, damage: "glue", time: 12, delay: 1, range: 0.5, size: 1, aoe: 2, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonSingleRedSlime", sfx: "Freeze", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "RedSlime", count: 1, time: 18, strict: true}], power: 0, damage: "glue", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonLatexElemental", sfx: "MagicSlash", manacost: 6, specialCD: 40, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "ElementalLatex", count: 1, time: 28}], power: 0, damage: "glue", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "MirrorImage", selfcast: true, sfx: "FireSpell", manacost: 12, components: ["Verbal"], level:4, castRange: 50, type:"inert", onhit:"summon", summon: [{name: "MaidforceStalkerImage", count: 1, time: 12}], power: 0, time: 12, delay: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "fire",
		spellcast: {spell: "DarkShroud", target: "origin", directional:false, offset: false}},
	{enemySpell: true, name: "SummonBookChain", sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookChain", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, selfcast: true, buff: true, name: "ArmorUp", sfx: "Bones", school: "Elements", manacost: 8, components: ["Arms"], mustTarget: true, level:1, type:"buff", buffs: [{id: "ArmorUp", type: "Armor", duration: 6, power: 1.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:6, power: 0, range: 2, size: 1, damage: ""},
	{enemySpell: true, buff: true, name: "ParasolBuff", sfx: "MagicSlash", school: "Elements", manacost: 4, components: ["Arms"], mustTarget: true, level:3, type:"buff",
		buffs: [
			{id: "ParasolBuff", type: "Armor", duration: 5, power: 1.0, player: true, enemies: true, tags: ["defense", "armor"]},
			{id: "ParasolBuff2", type: "Evasion", duration: 5, power: 0.33, player: true, enemies: true, tags: ["defense", "evasion"]},
			{id: "ParasolBuff3", type: "SpellResist", duration: 5, power: 1.0, player: true, enemies: true, tags: ["defense", "spellresist"]},
		], onhit:"", time:5, power: 0, range: 6, size: 1, damage: ""},
	{enemySpell: true, buff: true, name: "ZombieBuff", sfx: "MagicSlash", school: "Elements", manacost: 4, components: ["Arms"], mustTarget: true, level:3, type:"buff", filterTags: ["zombie", "mummy"],
		buffs: [
			{id: "ZombieBuff", type: "Armor", duration: 8, power: 2.0, player: false, enemies: true, tags: ["defense", "armor"]},
			{id: "ZombieBuff2", type: "MoveSpeed", duration: 8, power: 2.1, player: false, enemies: true, tags: ["offense", "speed"]},
		], onhit:"", time:5, power: 0, range: 6, size: 1, damage: ""},
	{enemySpell: true, buff: true, heal: true, name: "OrbHeal", sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Arms"], mustTarget: true, level:3, type:"hit",
		onhit:"heal", time:2, lifetime: 1, delay: 1, power: 2, aoe: 1.5, range: 5, size: 3, damage: ""},
	{enemySpell: true, name: "Earthfield", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Earthfield", type: "Armor", power: 2.0, player: false, enemies: true, noAlly: true, tags: ["armor", "defense"], range: 1.5}], onhit:"", time:6, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Earthrune", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Earthfield", type: "Armor", power: 2.0, player: true, enemies: true, onlyAlly: true, tags: ["armor", "defense"], range: 1.5}], onhit:"", time:9, aoe: 1.5, power: 0, delay: 9, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Icerune", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 5, power: 4, lifetimeHitBonus: 3, damage: "ice"}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "TrapCharmWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsCharmWeak", tags: ["ribbonRestraints"], count: 4}},
	{enemySpell: true, name: "TrapShackleWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsShackleWeak", tags: ["shackleRestraints"], count: 2}},
	{enemySpell: true, name: "TrapMummyWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsMummyWeak", tags: ["mummyRestraints"], count: 2}},
	{enemySpell: true, name: "TrapRopeWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRopeWeak", tags: ["ropeMagicWeak", "clothRestraints"], count: 3}},
	{enemySpell: true, name: "TrapRopeStrong", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRopeStrong", tags: ["ropeMagicStrong", "ropeAuxiliary", "clothRestraints", "tapeRestraints"], count: 4}},
	{enemySpell: true, name: "TrapLeatherWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsLeatherWeak", tags: ["leatherRestraints", "leatherRestraintsHeavy"], count: 3}},
	{enemySpell: true, name: "TrapCableWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsCableWeak", tags: ["hitechCables"], count: 3}},
	{enemySpell: true, name: "TrapSlimeWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "glue", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsSlimeWeak", tags: ["slimeRestraints"], count: 2}},
	{enemySpell: true, name: "TrapMagicChainsWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsMagicChainsWeak", tags: ["chainRestraintsMagic"], count: 3}},
	{enemySpell: true, name: "TrapSleepDart", sfx: "Gunfire", manacost: 1, components: [], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "pain", speed: 2, playerEffect: {name: "TrapSleepDart", power: 5}},
	{enemySpell: true, name: "TrapLustCloud", sfx: "Freeze", manacost: 1, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "glue", playerEffect: {name: "TrapLustCloud", damage: "happygas", power: 30 }},
	{enemySpell: true, name: "SleepDart", sfx: "Miss", manacost: 1, components: [], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "pain", speed: 1, playerEffect: {name: "TrapSleepDart", power: 5}},
];

let KinkyDungeonSpellOffset = 120;
let KinkyDungeonSpellChoiceOffset = 110;

let KDPlayerHitBy = [];

function KinkyDungeonSearchSpell(list, name) {
	for (let L = 0; L < list.length; L++) {
		let spell = list[L];
		if (spell.name == name) return spell;
	}
	return null;
}

function KinkyDungeonFindSpell(name, SearchEnemies) {
	if (SearchEnemies) {
		let spell = KinkyDungeonSearchSpell(KinkyDungeonSpellListEnemies, name);
		if (spell) return spell;
	}
	let spell2 = KinkyDungeonSearchSpell(KinkyDungeonSpellsStart, name);
	if (spell2) return spell2;
	for (let key in KinkyDungeonSpellList) {
		let list = KinkyDungeonSpellList[key];
		let spell = KinkyDungeonSearchSpell(list, name);
		if (spell) return spell;
	}
	return KinkyDungeonSearchSpell(KinkyDungeonSpells, name);
}

function KinkyDungeonDisableSpell(Name) {
	for (let i = 0; i < KinkyDungeonSpellChoices.length; i++) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].name == Name) {
			KinkyDungeonSpellChoicesToggle[i] = false;
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
		}
	}
}

let KinkyDungeonSpellPress = 0;

function KinkyDungeonResetMagic() {
	KinkyDungeonSpellChoices = [0];
	KinkyDungeonSpellChoicesToggle = [true];
	KinkyDungeonSpellChoiceCount = 3;
	KinkyDungeonSpells = [];
	Object.assign(KinkyDungeonSpells, KinkyDungeonSpellsStart); // Copy the dictionary
	KinkyDungeonMysticSeals = 1.3;
	KinkyDungeonSpellPress = 0;
	KinkyDungeonCurrentPage = 0;
	KinkyDungeonCurrentSpellsPage = 0;
	KinkyDungeonSpellPoints = 3;
	KinkyDungeonSpellLevel = {
		"Elements":1,
		"Conjure":1,
		"Illusion":1,
	};
}


function KinkyDungeonPlayerEffect(damage, playerEffect, spell) {
	if (!playerEffect.name) return;
	let effect = false;
	let sfx = spell.hitsfx;
	if (!sfx) sfx = "Damage";
	if (damage == "inert") return;
	if (playerEffect.hitTag && !KDPlayerHitBy.includes(playerEffect.hitTag)) KDPlayerHitBy.push(playerEffect.hitTag);
	else if (playerEffect.hitTag) return;
	if (!playerEffect.chance || KDRandom() < playerEffect.chance) {
		if (playerEffect.name == "Ampule") {
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatter" + spell.name), "red", 1);
			effect = true;
		} if (playerEffect.name == "AmpuleBlue") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["latexRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatterBind" + spell.name), "red", 1);
				effect = true;
			} else {
				if (KinkyDungeonCurrentDress != "BlueSuit") {
					KinkyDungeonSetDress("BlueSuit", "Latex");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatterDress" + spell.name), "red", 1);
					effect = true;
				} else {
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShatter" + spell.name), "red", 1);
				}
				let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
				if (dmg) effect = true;
			}
		} if (playerEffect.name == "ShadowStrike") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["shadowRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSpellShadowStrike"), "red", 1);
				effect = true;
			}
			let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			if (dmg) effect = true;
		} if (playerEffect.name == "Damage") {
			let dmg = KinkyDungeonDealDamage({damage: Math.max((spell.aoepower) ? spell.aoepower : 0, spell.power), type: spell.damage});
			KinkyDungeonSendTextMessage(Math.min(spell.power, 5), TextGet("KinkyDungeonDamageSelf").replace("DamageDealt", dmg), "red", 1);
			if (dmg) effect = true;
		} if (playerEffect.name == "DamageNoMsg") {
			let dmg = KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			if (dmg) effect = true;
		} else if (playerEffect.name == "Blind") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonBlindSelf"), "red", playerEffect.time);
			effect = true;
		} else if (playerEffect.name == "Hairpin") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHairpin"), "red", playerEffect.time);
			if (spell.power > 0) {
				effect = true;
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			effect = true;
		} else if (playerEffect.name == "MagicRope") {
			let roped = false;
			roped = roped || KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WeakMagicRopeArms")) > 0;
			roped = roped || KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WeakMagicRopeLegs")) > 0;
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMagicRopeSelf"), "red", playerEffect.time);
			if (roped)
				effect = true;
		} else if (playerEffect.name == "SlimeTrap") {
			effect = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StickySlime")) > 0;
			KinkyDungeonMovePoints = -1;
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlime"), "red", playerEffect.time);

			if (spell.power > 0) {
				effect = true;
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			}
		} else if (playerEffect.name == "Shock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonShock"), "red", playerEffect.time);
			effect = true;
		} else if (playerEffect.name == "MysticShock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMysticShock"), "red", playerEffect.time);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
			effect = true;
		} else if (playerEffect.name == "RobotShock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRobotShock"), "red", playerEffect.time);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
			effect = true;
		} else if (playerEffect.name == "HeatBlast") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonHeatBlast"), "red", playerEffect.time);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
			}
			effect = true;
		}  else if (playerEffect.name == "RubberBullets") {
			if (KDRandom() < 0.25 && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax/2) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["slimeRestraintsRandom"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd) {
					KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRubberBulletsAttach"), "red", 2);
				}
			} else KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonRubberBullets"), "red", 2);
			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax/2 ? spell.power : spell.power*1.5, type: spell.damage});
			}
			effect = true;
		} else if (playerEffect.name == "SingleChain") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["chainRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleChain"), "red", playerEffect.time);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
				effect = true;
			}

		} else  if (playerEffect.name == "SingleMagicChain") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["chainRestraintsMagic"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleChain"), "red", playerEffect.time);
				effect = true;
			}

		} else if (playerEffect.name == "SingleRope" || playerEffect.name == "BanditBola") {
			if (playerEffect.name == "BanditBola") {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			}
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleRope"), "red", playerEffect.time);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
				effect = true;
			}

		} else if (playerEffect.name == "RestrainingDevice") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["hitechCables"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRestrainingDevice"), "red", 2);
				effect = true;
			} else {
				KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRestrainingDeviceStun"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				effect = true;
			}

		} else if (playerEffect.name == "Glue") {
			let added = [];
			if (KinkyDungeonLastAction == "Move")
				for (let i = 0; i < playerEffect.count; i++) {
					let restraintAdd = KinkyDungeonGetRestraint({tags: ["glueRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
						added.push(restraintAdd);
						effect = true;
					}
				}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonGlue"), "yellow", 2);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonGlueSlow"), "yellow", playerEffect.time);
				if (playerEffect.power) {
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonGlueSlowDamage").replace("DamageDealt", playerEffect.power), "yellow", 2);
					KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
				} else KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonGlueSlow"), "yellow", playerEffect.time);
				effect = true;
			}

		} else if (playerEffect.name == "RopeEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeMagicStrong", "ropeAuxiliary", "clothRestraints", "tapeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRopeEngulf"), "red", 2);
				effect = true;
			} else {
				let RopeDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRopeEngulfDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonCallGuard(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
					let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeMagicHogtie"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
						KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRopeEngulf"), "red", 2);
						effect = true;
					}

					KinkyDungeonSetFlag("kraken", 20);
				}
			}
		} else if (playerEffect.name == "VineEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["vineRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonVineEngulf"), "red", 2);
				effect = true;
			} else {
				let RopeDresses = ["GreenLeotard", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress) && KinkyDungeonCurrentDress != "Elven") {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonVineEngulfDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
					KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
					effect = true;
				}
			}
		}  else if (playerEffect.name == "ObsidianEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["obsidianRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonObsidianEngulf"), "red", 2);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				effect = true;
			}
		} else if (playerEffect.name == "CharmWraps") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["ribbonRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonCharmWraps"), "red", 2);
				effect = true;
			} else {
				let CharmDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!CharmDresses.includes(KinkyDungeonCurrentDress) && KinkyDungeonCurrentDress != "Prisoner") {
					KinkyDungeonSetDress(CharmDresses[Math.floor(Math.random() * CharmDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCharmWrapsDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
					KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
					effect = true;
				}
			}
		} else if (playerEffect.name == "EnchantedArrow") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["mithrilRope"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonEnchantedArrow"), "red", 2);
				effect = true;
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power, type: spell.damage});
				effect = true;
			}

		} else if (playerEffect.name == "TrapBindings") {
			let added = [];
			for (let i = 0; i < playerEffect.count; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: playerEffect.tags}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) {
					added.push(restraintAdd);
					effect = true;
				}
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet(playerEffect.text), "red", 2);
				effect = true;
			} else {
				let PossibleDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!PossibleDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(PossibleDresses[Math.floor(Math.random() * PossibleDresses.length)], "");
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapBindingsDress"), "red", 3);
					effect = true;
				} else {
					KinkyDungeonCallGuard(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
				}
			}

		} else if (playerEffect.name == "TrapSleepDart") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapSleepDart"), "red", 4);
			KinkyDungeonSlowMoveTurns = 4;
			KinkyDungeonSleepiness = 3;
			KinkyDungeonAlert = 4;
			effect = true;
		} else if (playerEffect.name == "TrapLustCloud") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonTrapLustCloud"), "yellow", 4);
			if (playerEffect.power > 0) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			effect = true;
		} else if (playerEffect.name == "Freeze") {
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonFreeze"), "red", playerEffect.time);
			if (playerEffect.power > 0) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			KinkyDungeonStatFreeze = Math.max(0, playerEffect.time);
			KinkyDungeonSleepTime = CommonTime() + KinkyDungeonFreezeTime;
			effect = true;
		} else if (playerEffect.name == "Chill") {
			let standingTile = KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			if (playerEffect.power > 0 && !KinkyDungeonFlags.chill) {
				KinkyDungeonDealDamage({damage: playerEffect.power, type: playerEffect.damage});
			}
			if (standingTile == 'w') {
				sfx = "Freeze";
				KinkyDungeonStatFreeze = Math.max(0, playerEffect.time);
				KinkyDungeonSleepTime = CommonTime() + KinkyDungeonFreezeTime;
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonFreeze"), "red", playerEffect.time);
			} else {
				sfx = "Bones";
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1);
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonChill"), "red", playerEffect.time);
			}
			KinkyDungeonSetFlag("chill", 1);
			effect = true;
		} else if (playerEffect.name == "ShadowBind") {
			KinkyDungeonStatBind = Math.max(0, playerEffect.time);
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonShadowBind"), "red", playerEffect.time);
			effect = true;
		}
	}

	if (sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
	if (effect) KinkyDungeonInterruptSleep();

	return effect;
}

function KinkyDungeoCheckComponents(spell) {
	let failedcomp = [];
	if (spell.components.includes("Verbal") && !KinkyDungeonCanTalk() && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoVerbalComp") > 0)) failedcomp.push("Verbal");
	if (spell.components.includes("Arms") && KinkyDungeonIsArmsBound() && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoArmsComp") > 0)) failedcomp.push("Arms");
	if (spell.components.includes("Legs") && (KinkyDungeonSlowLevel > 1 || KinkyDungeonLegsBlocked()) && !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "NoLegsComp") > 0)) failedcomp.push("Legs");

	return failedcomp;
}

function KinkyDungeonHandleSpellChoice(SpellChoice) {
	let spell = null;
	if (KinkyDungeoCheckComponents(KinkyDungeonSpells[SpellChoice]).length == 0) {
		if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(KinkyDungeonSpells[SpellChoice]))
			&& (!KinkyDungeonSpells[SpellChoice].knifecost || KinkyDungeonNormalBlades >= KinkyDungeonSpells[SpellChoice].knifecost)
			&& (!KinkyDungeonSpells[SpellChoice].staminacost || KinkyDungeonHasStamina(KinkyDungeonSpells[SpellChoice].staminacost)))
			spell = KinkyDungeonSpells[SpellChoice];
		else KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonNoMana"), "red", 1);
	} else {
		KinkyDungeonTargetingSpell = "";
		KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonComponentsFail" + KinkyDungeoCheckComponents(KinkyDungeonSpells[SpellChoice])[0]), "red", 1);
	}
	return spell;
}

function KinkyDungeonHandleSpell() {
	let spell = null;
	for (let i = 0; i < KinkyDungeonSpellChoiceCount; i++) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].passive && (MouseIn(1230 + i*KinkyDungeonSpellChoiceOffset, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[i])) {
			if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].type == "passive") {
				KinkyDungeonSpellChoicesToggle[i] = !KinkyDungeonSpellChoicesToggle[i];
				if (KinkyDungeonSpellChoicesToggle[i] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].costOnToggle) {
					if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[i]]))) {
						KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[i]]));
					} else KinkyDungeonSpellChoicesToggle[i] = false;
				}
				if (KinkyDungeonSpellChoicesToggle[i] && KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].cancelAutoMove) {
					KinkyDungeonFastMove = false;
					KinkyDungeonFastMoveSuppress = false;
				}
				KinkyDungeonSpellPress = 0;
				return true;
			} else spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[i]);
		}
	}
	/*else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[1]].passive && (MouseIn(1230 + 1*KinkyDungeonSpellChoiceOffset, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[1])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[1]);
	} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[2]].passive && (MouseIn(1230 + 2*KinkyDungeonSpellChoiceOffset, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[2])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[2]);
	}*/
	if (spell) {
		// Handle spell activation
		KinkyDungeonTargetingSpell = spell;
		KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellTarget" + spell.name).replace("SpellArea", "" + Math.floor(spell.aoe)), "white", 0.1, true);
		return true;
	}
	return false;
}

function KinkyDungeonGetManaCost(Spell) {
	let cost = Spell.manacost;
	let costscale = KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ManaCostMult"));
	let lvlcostscale = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ManaCostLevelMult");
	if (costscale) cost = Math.floor(cost * costscale);
	if (costscale > 0) cost = Math.max(Spell.manacost, cost); // Keep it from rounding to 0
	if (lvlcostscale && Spell.level && Spell.manacost) cost += Spell.level * lvlcostscale;
	return cost;
}

function KinkyDungeonGetCost(Spell) {
	let cost = Spell.level;
	if (Spell.spellPointCost) return Spell.spellPointCost;
	return cost;
}

function KinkyDungeonCastSpell(targetX, targetY, spell, enemy, player, bullet) {
	let entity = KinkyDungeonPlayerEntity;
	let moveDirection = KinkyDungeonMoveDirection;
	let flags = {
		miscastChance: KinkyDungeonStatArousalMiscastChance * KinkyDungeonStatArousal / KinkyDungeonStatArousalMax,
	};
	if (!enemy && !bullet && player) {
		KinkyDungeonSendEvent("beforeCast", {spell: spell, targetX: targetX, targetY: targetY, originX: KinkyDungeonPlayerEntity.x, originY: KinkyDungeonPlayerEntity.y, flags: flags});
	}
	let tX = targetX;
	let tY = targetY;
	let miscast = false;
	let cast = spell.spellcast ? {} : undefined;
	if (!enemy && !player && !bullet) {
		moveDirection = {x:0, y:0, delta:1};
	}

	if (enemy) {
		entity = enemy;
		moveDirection = KinkyDungeonGetDirection(player.x - entity.x, player.y - entity.y);
		flags.miscastChance = 0;
	}
	if (bullet) {
		entity = bullet;
		if (bullet.bullet.cast) {
			moveDirection = {x:bullet.bullet.cast.mx, y:bullet.bullet.cast.my, delta: 1};
		} else {
			moveDirection = {x:0, y:0, delta: 0};
		}
		flags.miscastChance = 0;
	}
	if (!spell.noMiscast && !enemy && !bullet && player && KDRandom() < flags.miscastChance) {

		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonSpellMiscast"), "#FF8800", 2);

		moveDirection = {x:0, y:0, delta:1};
		tX = entity.x;
		tY = entity.y;
		miscast = true;
	}

	if (cast) {
		Object.assign(cast, spell.spellcast);
		if (cast.target == "target") {
			if (tX == entity.x + moveDirection.x && tY == entity.y + moveDirection.y) {
				cast.tx = tX + moveDirection.x;
				cast.ty = tY + moveDirection.y;
			} else {
				cast.tx = tX;
				cast.ty = tY;
			}
		} else if (cast.target == "origin") {
			cast.tx = entity.x;
			cast.ty = entity.y;
		}
		if (cast.directional) {
			cast.mx = moveDirection.x;
			cast.my = moveDirection.y;
		}
	}

	let spellRange = spell.range * KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "spellRange"));

	if (spell.type == "bolt") {
		let size = (spell.size) ? spell.size : 1;
		let xx = entity.x;
		let yy = entity.y;
		if (!bullet || (bullet.spell && bullet.spell.cast && bullet.spell.cast.offset)) {
			xx += moveDirection.x;
			yy += moveDirection.y;
		}
		let b = KinkyDungeonLaunchBullet(xx, yy,
			tX-entity.x,tY - entity.y,
			spell.speed, {name:spell.name, block: spell.block, width:size, height:size, summon:spell.summon, cast: cast, dot: spell.dot,
				passthrough: spell.noTerrainHit, noEnemyCollision: spell.noEnemyCollision, nonVolatile:spell.nonVolatile, noDoubleHit: spell.noDoubleHit, piercing: spell.piercing, events: spell.events,
				lifetime:miscast ? 1 : 1000, origin: {x: entity.x, y: entity.y}, range: spellRange, hit:spell.onhit, damage: {evadeable: spell.evadeable, damage:spell.power, type:spell.damage, time:spell.time}, spell: spell}, miscast);
		b.visual_x = entity.x;
		b.visual_y = entity.y;
	} else if (spell.type == "inert" || spell.type == "dot") {
		let sz = spell.size;
		if (!sz) sz = 1;
		if (spell.meleeOrigin) {
			tX = entity.x + moveDirection.x;
			tY = entity.y + moveDirection.y;
		}
		KinkyDungeonLaunchBullet(tX, tY,
			moveDirection.x,moveDirection.y,
			0, {name:spell.name, block: spell.block, width:sz, height:sz, summon:spell.summon, lifetime:spell.delay, cast: cast, dot: spell.dot, events: spell.events,
				passthrough:(spell.CastInWalls || spell.WallsOnly || spell.noTerrainHit), hit:spell.onhit, noDoubleHit: spell.noDoubleHit,
				damage: spell.type == "inert" ? null : {evadeable: spell.evadeable, damage:spell.power, type:spell.damage, time:spell.time}, spell: spell}, miscast);
	}  else if (spell.type == "hit") {
		let sz = spell.size;
		if (!sz) sz = 1;
		if (spell.meleeOrigin) {
			tX = entity.x + moveDirection.x;
			tY = entity.y + moveDirection.y;
		}
		let b = {x: tX, y:tY,
			vx: moveDirection.x,vy: moveDirection.y, born: 1,
			bullet: {name:spell.name, block: spell.block, width:sz, height:sz, summon:spell.summon, lifetime:spell.lifetime, cast: cast, dot: spell.dot, events: spell.events,
				passthrough:(spell.CastInWalls || spell.WallsOnly || spell.noTerrainHit), hit:spell.onhit, noDoubleHit: spell.noDoubleHit,
				damage: spell.type == "inert" ? null : {evadeable: spell.evadeable, damage:spell.power, type:spell.damage, time:spell.time}, spell: spell}};
		KinkyDungeonBulletHit(b, 1);
	} else if (spell.type == "buff") {
		let aoe = spell.aoe;
		let casted = false;
		if (!aoe) aoe = 0.1;
		if (Math.sqrt((KinkyDungeonPlayerEntity.x - targetX) * (KinkyDungeonPlayerEntity.x - targetX) + (KinkyDungeonPlayerEntity.y - targetY) * (KinkyDungeonPlayerEntity.y - targetY)) <= aoe) {
			for (let buff of spell.buffs) {
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff);
				casted = true;
			}
		}
		for (let e of KinkyDungeonEntities) {
			if (Math.sqrt((e.x - targetX) * (e.x - targetX) + (e.y - targetY) * (e.y - targetY)) <= aoe) {
				for (let buff of spell.buffs) {
					if (!e.buffs) e.buffs = [];
					KinkyDungeonApplyBuff(e.buffs, buff);
					casted = true;
				}
			}
		}
		if (!casted) return false;
	}

	if (!enemy && !bullet && player) { // Costs for the player
		KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonSpellCast"+spell.name), "#88AAFF", 2 + (spell.channel ? spell.channel - 1 : 0));

		KinkyDungeonSendEvent("playerCast", {spell: spell, targetX: targetX, targetY: targetY, originX: KinkyDungeonPlayerEntity.x, originY: KinkyDungeonPlayerEntity.y, flags: flags});

		//let cost = spell.staminacost ? spell.staminacost : KinkyDungeonGetCost(spell.level);

		//KinkyDungeonStatWillpowerExhaustion += spell.exhaustion + 1;
		KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
		if (spell.knifecost) KinkyDungeonNormalBlades -= spell.knifecost;
		if (spell.staminacost) KinkyDungeonChangeStamina(-spell.staminacost);

		KinkyDungeonChargeVibrators(KinkyDungeonGetManaCost(spell));
		if (spell.channel) {
			KinkyDungeonSlowMoveTurns = Math.max(KinkyDungeonSlowMoveTurns, spell.channel);
			KinkyDungeonSleepTime = CommonTime() + 200;
		}
		if (spell.noise)
			KinkyDungeonAlert = Math.max(spell.noise, KinkyDungeonAlert);
		KinkyDungeonLastAction = "Spell";
	}

	return true;
}

function KinkyDungeonChargeVibrators(cost) {
	if (cost > 0) {
		for (let I = 0; I < KinkyDungeonInventory.length; I++) {
			let vibe = KinkyDungeonInventory[I].restraint;
			if (vibe && vibe.maxbattery > 0 && vibe.vibeType.includes("Charging")) {
				if (KinkyDungeonInventory[I].battery == 0) {
					KinkyDungeonPlaySound("Audio/VibrationTone4Long3.mp3");
					if (!KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2)) KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2);
				}

				KinkyDungeonInventory[I].battery = Math.min(vibe.maxbattery, KinkyDungeonInventory[I].battery + cost * 1.5);
			}
		}
	}
}

function KinkyDungeonChargeRemoteVibrators(Name, Amount, Overcharge, noSound) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let vibe = KinkyDungeonInventory[I].restraint;
		if (vibe && vibe.maxbattery > 0 && vibe.vibeType.includes("Charging")) {
			if (KinkyDungeonInventory[I].battery == 0 || Overcharge) {
				if (KinkyDungeonInventory[I].battery < Math.max(0.1, vibe.maxbattery - Amount)) {
					if (!noSound) {
						KinkyDungeonPlaySound("Audio/VibrationTone4Long3.mp3");
					}
					let text = TextGet("KinkyDungeonStartVibeRemote").replace("EnemyName", TextGet("Name" + Name));
					if (!KinkyDungeonSendTextMessage(5, text, "#FFaadd", 2)) KinkyDungeonSendActionMessage(5, text, "#FFaadd", 2);
				}
				KinkyDungeonInventory[I].battery = Math.min(vibe.maxbattery, KinkyDungeonInventory[I].battery + Amount);
			}
		}
	}
}

function KinkyDungeonHandleVibrators() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let vibe = KinkyDungeonInventory[I].restraint;
		if (vibe && vibe.maxbattery > 0 && vibe.vibeType.includes("Teaser") && KinkyDungeonInventory[I].battery == 0 && !(KinkyDungeonInventory[I].cooldown > 0) && KDRandom() * 100 < ( vibe.teaseRate ?  vibe.teaseRate : vibe.power)) {
			if (KinkyDungeonInventory[I].battery == 0) {
				KinkyDungeonPlaySound("Audio/VibrationTone4Long3.mp3");
				if (!KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2)) KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2);
				KinkyDungeonInventory[I].cooldown = vibe.teaseCooldown;
			}

			KinkyDungeonInventory[I].battery = Math.min(vibe.maxbattery, KinkyDungeonInventory[I].battery + vibe.maxbattery * (0.3 + KDRandom() * 0.7));
		}
	}
}


function KinkyDungeonHandleMagic() {
	//if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
	if (KinkyDungeonCurrentPage > 0 && MouseIn(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else KinkyDungeonCurrentPage -= 1;
		return true;
	}
	if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1 && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else KinkyDungeonCurrentPage += 1;
		return true;
	}
	/*} else if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale/2 - 250, canvasOffsetY + 483*KinkyDungeonBookScale, 500, 60)) {
		KinkyDungeonCurrentPage = Math.floor(KDRandom()*KinkyDungeonSpells.length);
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else {
			KinkyDungeonAdvanceTime(1);
			if (KinkyDungeonTextMessageTime > 0)
				KinkyDungeonDrawState = "Game";
		}
		return true;
	}*/

	if (KinkyDungeonSpells[KinkyDungeonCurrentPage] && !KinkyDungeonPreviewSpell) {
		for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
			if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage)) {
				if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*KinkyDungeonSpellOffset, 225, 60)) {
					KinkyDungeonSpellChoices[I] = KinkyDungeonCurrentPage;
					KinkyDungeonSpellChoicesToggle[I] = !KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].defaultOff;
					if (KinkyDungeonSpellChoicesToggle[I] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].costOnToggle) {
						if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[I]]))) {
							KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[I]]));
						} else KinkyDungeonSpellChoicesToggle[I] = false;
					}
					if (KinkyDungeonSpellChoicesToggle[I] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].cancelAutoMove) {
						KinkyDungeonFastMove = false;
						KinkyDungeonFastMoveSuppress = false;
					}
					KinkyDungeonAdvanceTime(1);
					if (KinkyDungeonTextMessageTime > 0)
						KinkyDungeonDrawState = "Game";
					return true;
				}
			} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].type == "passive") {
				if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*KinkyDungeonSpellOffset, 225, 60)) {
					KinkyDungeonSpellChoices[I] = -1;
					KinkyDungeonSpellChoicesToggle[I] = true;
					return true;
				}
			}
		}
	} else if (KinkyDungeonPreviewSpell && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125, 225, 60)) {
		let cost = KinkyDungeonGetCost(KinkyDungeonPreviewSpell);
		let spell = KinkyDungeonPreviewSpell;
		if (KinkyDungeonCheckSpellSchool(spell)) {
			if (KinkyDungeonSpellPoints >= cost) {
				KinkyDungeonSpellPoints -= cost;
				KinkyDungeonSpells.push(KinkyDungeonPreviewSpell);
				KinkyDungeonSetMaxStats();
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
				KinkyDungeonCurrentPage = KinkyDungeonSpellIndex(KinkyDungeonPreviewSpell.name);
				KinkyDungeonPreviewSpell = undefined;
				KinkyDungeonAdvanceTime(1);
				if (KinkyDungeonTextMessageTime > 0)
					KinkyDungeonDrawState = "Game";
			} else KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellsNotEnoughPoints"), "orange", 1);
		} else KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellsNotEnoughLevels").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + spell.school)), "orange", 1);
		return true;
	}

	if (MouseIn(650, 925, 355, 60)) {
		KinkyDungeonDrawState = "MagicSpells";
		return true;
	}
	return true;
}

function KinkyDungeonCheckSpellSchool(spell) {
	if (spell.school == "Any") {
		return KinkyDungeonSpellLevel.Elements >= spell.level
			|| KinkyDungeonSpellLevel.Conjure >= spell.level
			|| KinkyDungeonSpellLevel.Illusion >= spell.level;
	}
	return KinkyDungeonSpellLevel[spell.school] >= spell.level;
}

// https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function KinkyDungeonWordWrap(str, maxWidth) {
	let newLineStr = "\n";
	let res = '';
	while (str.length > maxWidth) {
		let found = false;
		// Inserts new line at first whitespace of the line
		for (let i = maxWidth - 1; i >= 0; i--) {
			if (KinkyDungeonTestWhite(str.charAt(i))) {
				res = res + [str.slice(0, i), newLineStr].join('');
				str = str.slice(i + 1);
				found = true;
				break;
			}
		}
		// Inserts new line at maxWidth position, the word is too long to wrap
		if (!found) {
			res += [str.slice(0, maxWidth), newLineStr].join('');
			str = str.slice(maxWidth);
		}

	}

	return res + str;
}

function KinkyDungeonTestWhite(x) {
	let white = new RegExp(/^\s$/);
	return white.test(x.charAt(0));
}

function KinkyDungeonDrawMagic() {
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX, canvasOffsetY, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false);

	if (KinkyDungeonSpells[KinkyDungeonCurrentPage] || KinkyDungeonPreviewSpell) {
		let spell = KinkyDungeonPreviewSpell ? KinkyDungeonPreviewSpell : KinkyDungeonSpells[KinkyDungeonCurrentPage];

		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5, "black", "silver");
		DrawText(TextGet("KinkyDungeonSpellsSchool" + spell.school), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/3.5, "black", "silver");
		DrawText(TextGet("KinkyDungeonMagicLevel") + spell.level, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2, "black", "silver");
		if (KinkyDungeonPreviewSpell) DrawText(TextGet("KinkyDungeonMagicCost") + KinkyDungeonGetCost(spell), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 150, "black", "silver");
		DrawText(TextGet("KinkyDungeonMagicManaCost") + spell.manacost, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195, "black", "silver");
		//DrawText(TextGet("KinkyDungeonMagicExhaustion").replace("TimeTaken", spell.exhaustion), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 150, "black", "silver");
		//DrawText(TextGet("KinkyDungeonMagicExhaustion2").replace("TimeTaken", spell.exhaustion), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195, "black", "silver");
		let textSplit = KinkyDungeonWordWrap(TextGet("KinkyDungeonSpellDescription"+ spell.name).replace("DamageDealt", "" + (spell.power * 10)).replace("Duration", spell.time).replace("LifeTime", spell.lifetime).replace("DelayTime", spell.delay).replace("BlockAmount", "" + (10 * spell.block)), 18).split('\n');
		let i = 0;
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}

		i = 0;
		if (spell.components.includes("Verbal")) {DrawText(TextGet("KinkyDungeonComponentsVerbal"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i++;}
		if (spell.components.includes("Arms")) {DrawText(TextGet("KinkyDungeonComponentsArms"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195  - 40*i, "black", "silver"); i++;}
		if (spell.components.includes("Legs")) {DrawText(TextGet("KinkyDungeonComponentsLegs"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i++;}
		DrawText(TextGet("KinkyDungeonComponents"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i = 1;

		if (!KinkyDungeonPreviewSpell)
			for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
				if ( KinkyDungeonSpellChoices[I] != null && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].passive) {
					//DrawTextFit(TextGet("KinkyDungeonSpellChoice" + I), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 73 + I*KinkyDungeonSpellOffset, KinkyDungeonSpellOffset, "white", "silver");
					DrawTextFit(TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].name), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 105 + I*KinkyDungeonSpellOffset, 225, "white", "silver");
				}
				if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage) && !KinkyDungeonSpells[KinkyDungeonCurrentPage].passive)
					DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*KinkyDungeonSpellOffset, 225, 60, TextGet("KinkyDungeonSpell" + I), "White", "", "");
				else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].type == "passive")
					DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*KinkyDungeonSpellOffset, 225, 60, TextGet("KinkyDungeonSpellRemove" + I), "White", "", "");
			}
		else {
			let cost = KinkyDungeonGetCost(spell);
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125, 225, 60, TextGet("KinkyDungeonSpellsBuy"),
				(KinkyDungeonSpellPoints >= cost && KinkyDungeonCheckSpellSchool(spell)) ? "White" : "Pink", "", "");
		}
	}

	//if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
	if (KinkyDungeonCurrentPage > 0) {
		DrawButton(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
	}
	if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1) {
		DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
	}
	/*} else {
		DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale/2 - 250, canvasOffsetY + 483*KinkyDungeonBookScale, 500, 60, TextGet("KinkyDungeonBookRandomPage"), "White", "", "");
	}*/
	DrawButton(650, 925, 355, 60, TextGet("KinkyDungeonMagicSpells"), "White", "", "");

	DrawText(TextGet("KinkyDungeonSpellsLevels")
		.replace("SPELLPOINTS", "" + KinkyDungeonSpellPoints)
		.replace("ELEMLEVEL", "" + KinkyDungeonSpellLevel.Elements)
		.replace("CONJLEVEL", "" + KinkyDungeonSpellLevel.Conjure)
		.replace("ILLULEVEL", "" + KinkyDungeonSpellLevel.Illusion), canvasOffsetX + 600, 900, "white", "black");
}

function KinkyDungeonListSpells(Mode) {
	let i = 0;
	let ii = 0;
	//let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let ypadding = 5;
	let yPad = 100;
	let buttonwidth = 250;
	let xpadding = 50;
	let col = 0;

	for (let pg of KinkyDungeonLearnableSpells[KinkyDungeonCurrentSpellsPage]) {
		let column = col;//Math.floor((spacing * i) / (maxY));
		i = 0;
		for (let sp of pg) {
			let spell = KinkyDungeonFindSpell(sp, false);
			if (spell) {

				XX = column * (buttonwidth + xpadding);
				ii = i;// - column * Math.ceil(maxY / spacing);

				let cost = KinkyDungeonGetCost(spell);
				let suff = "";

				if (Mode == "Draw") {
					let color = "#bbbbbb";
					if (KinkyDungeonSpellIndex(spell.name) >= 0) {
						color = "white";
					} else if (KinkyDungeonSpellPoints < cost || !KinkyDungeonCheckSpellSchool(spell)) {
						if (spell.school == "Elements") {color = "#aa8866"; suff = "-";}
						else if (spell.school == "Conjure") {color = "#66aa88"; suff = "+";}
						else if (spell.school == "Illusion") {color = "#775599"; suff = "*";}
						else color = "#aa4444";
					}
					let finalsuff = suff;
					if (spell.level > 2) {
						for (let S = 2; S < spell.level; S++) {
							finalsuff = finalsuff + suff;
						}
					}
					DrawButton(canvasOffsetX + XX, yPad + canvasOffsetY + spacing * ii, buttonwidth, spacing - ypadding, finalsuff + TextGet("KinkyDungeonSpell" + spell.name) + finalsuff, color);
				} else if (Mode == "Click") {
					if (MouseIn(canvasOffsetX + XX, yPad + canvasOffsetY + spacing * ii, buttonwidth, spacing - ypadding)) return spell;
				}
				i++;
			}
		}
		col++;
	}
	return undefined;
}

function KinkyDungeonDrawMagicSpells() {

	KinkyDungeonListSpells("Draw");
	MainCanvas.textAlign = "center";

	DrawText(TextGet("KinkyDungeonSpellsPage") + (KinkyDungeonCurrentSpellsPage + 1) + ": " + TextGet("KinkyDungeonSpellsPage" + KinkyDungeonCurrentSpellsPage), canvasOffsetX + 575, canvasOffsetY + 25, "white", "black");
	//DrawText(TextGet("KinkyDungeonSpellsPoints") + KinkyDungeonSpellPoints, 650, 900, "white", "black");

	MainCanvas.textAlign = "center";

	DrawText(TextGet("KinkyDungeonSpellsLevels")
		.replace("SPELLPOINTS", "" + KinkyDungeonSpellPoints)
		.replace("ELEMLEVEL", "" + KinkyDungeonSpellLevel.Elements)
		.replace("CONJLEVEL", "" + KinkyDungeonSpellLevel.Conjure)
		.replace("ILLULEVEL", "" + KinkyDungeonSpellLevel.Illusion), canvasOffsetX + 600, 900, "white", "black");

	DrawButton(canvasOffsetX + 0, canvasOffsetY, 50, 50, TextGet("KinkyDungeonSpellsPageBackFast"), "White", "", "");
	DrawButton(canvasOffsetX + 1100, canvasOffsetY, 50, 50, TextGet("KinkyDungeonSpellsPageNextFast"), "White", "", "");
	DrawButton(canvasOffsetX + 55, canvasOffsetY, 245, 50, TextGet("KinkyDungeonSpellsPageBack"), "White", "", "");
	DrawButton(canvasOffsetX + 850, canvasOffsetY, 245, 50, TextGet("KinkyDungeonSpellsPageNext"), "White", "", "");

	DrawButton(650, 925, 355, 60, TextGet("KinkyDungeonMagicSpellsBack"), "White", "", "");
}


function KinkyDungeonHandleMagicSpells() {

	if (MouseIn(650, 925, 355, 60)) {
		KinkyDungeonDrawState = "Magic";
		return true;
	} else if (MouseIn(canvasOffsetX + 50, canvasOffsetY, 250, 50)) {
		if (KinkyDungeonCurrentSpellsPage > 0) KinkyDungeonCurrentSpellsPage -= 1;
		else KinkyDungeonCurrentSpellsPage = KinkyDungeonLearnableSpells.length - 1;
		return true;
	} else if (MouseIn(canvasOffsetX + 850, canvasOffsetY, 250, 50)) {
		if (KinkyDungeonCurrentSpellsPage < KinkyDungeonLearnableSpells.length - 1) KinkyDungeonCurrentSpellsPage += 1;
		else KinkyDungeonCurrentSpellsPage = 0;
		return true;
	} else if (MouseIn(canvasOffsetX + 0, canvasOffsetY, 50, 50)) {
		if (KinkyDungeonCurrentSpellsPage > 0) {
			if (KinkyDungeonCurrentSpellsPage > 2) KinkyDungeonCurrentSpellsPage -= 3;
			else KinkyDungeonCurrentSpellsPage = 0;
		} else KinkyDungeonCurrentSpellsPage = KinkyDungeonLearnableSpells.length - 1;
		return true;
	} else if (MouseIn(canvasOffsetX + 1100, canvasOffsetY, 50, 50)) {
		if (KinkyDungeonCurrentSpellsPage < KinkyDungeonLearnableSpells.length - 1)  {
			if (KinkyDungeonCurrentSpellsPage < KinkyDungeonLearnableSpells.length - 3) KinkyDungeonCurrentSpellsPage += 3;
			else KinkyDungeonCurrentSpellsPage = KinkyDungeonLearnableSpells.length - 1;
		}
		else KinkyDungeonCurrentSpellsPage = 0;
		return true;
	}

	let spell = KinkyDungeonListSpells("Click");
	if (spell) {
		KinkyDungeonSetPreviewSpell(spell);
		return true;
	}

	return true;
}

function KinkyDungeonSpellIndex(Name) {
	for (let i = 0; i < KinkyDungeonSpells.length; i++) {
		if (KinkyDungeonSpells[i].name == Name) return i;
	}
	return -1;
}

function KinkyDungeonSetPreviewSpell(spell) {
	let index = KinkyDungeonSpellIndex(spell.name);
	KinkyDungeonPreviewSpell = index >= 0 ? null : spell;
	if (!KinkyDungeonPreviewSpell) KinkyDungeonCurrentPage = index;
	KinkyDungeonDrawState = "Magic";
}

function KinkyDungeonGetCompList(spell) {
	let ret = "";
	if (spell.components)
		for (let c of spell.components) {
			if (ret) ret = ret + "/";
			if (c == "Verbal") ret = ret + (ret ? "V" : "Verbal");
			else if (c == "Arms") ret = ret + (ret ? "A" : "Arms");
			else if (c == "Legs") ret = ret + (ret ? "L" : "Legs");
		}

	//if (ret)
	//return "(" + ret + ")";
	//else
	return ret;
}

function KinkyDungeonSendMagicEvent(Event, data) {
	for (let i = 0; i < KinkyDungeonSpellChoices.length; i++) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[i]];
		if (spell && spell.events) {
			for (let e of spell.events) {
				if (e.trigger == Event && (KinkyDungeonSpellChoicesToggle[i] || e.always)) {
					KinkyDungeonHandleMagicEvent(Event, e, spell, data);
				}
			}
		}
	}
}