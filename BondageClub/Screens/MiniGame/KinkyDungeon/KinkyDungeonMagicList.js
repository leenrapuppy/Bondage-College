"use strict";
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

/**
 * These are starting spells
 */
let KinkyDungeonSpellsStart = [
	{name: "Knife", sfx: "Miss", hitsfx: "LightSwing", school: "Elements", manacost: 0, components: ["Arms"], noMiscast: true, knifecost: 1, staminacost: 1, level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 2.5, delay: 0, range: 50, evadeable: true, damage: "pierce", speed: 2, playerEffect: {name: "Damage"},
		events: [{type: "DropKnife", trigger: "bulletHit"},]},
	{name: "Analyze", sfx: "MagicSlash", school: "Illusion", manacost: 5, components: [], level:1, type:"special", special: "analyze", noMiscast: true,
		onhit:"", time:25, power: 0, range: 1.5, size: 1, damage: ""},
];
/**
 * These spells occur in the menu and the player can learn them
 * Spells with NoBuy cannot be bought, but can be looked at.
 * Spells with NoMenu do not appear in the menu until the player has them
 */
let KinkyDungeonLearnableSpells = [
	//Page 1: Elements
	[
		// Verbal
		["Electrify", "IronBlood", "Incinerate", "IceBreath",],
		// Arms
		["Firebolt", "Icebolt", "StoneSkin", "Crackle", "Icicles", "Fireball", "LightningBolt"],
		// Legs
		["Shield", "BoulderLaunch", "GreaterShield", "Fissure", "Sleet"],
		// Passive
		["FlameBlade", "Strength"],
		// Always on
		["Knife", "Analyze"],
	],

	//Page 2: Conjuration
	[
		// Verbal
		["Heal2", "RopeStrike", "Bomb", "FireElemental", "Blink"],
		// Arms
		["ChainBolt", "SlimeBall", "SummonGag", "Heal"],
		// Legs
		["Snare", "Wall", "Ally", "Slime", "StormCrystal", "Golem", "Leap"],
		// Passive
		["FloatingWeapon"],
		// Always on
		["Knife", "Analyze"],
	],

	//Page 3: Illusion
	[
		// Verbal
		["Flash", "Shroud", "GreaterFlash", "ShadowWarrior", "FocusedFlash", "Invisibility"],
		// Arms
		["Dagger", "TrueSteel", "Ring", "ShadowSlash", "ShadowBlade", "Corona"],
		// Legs
		["Evasion", "Decoy", "Camo"],
		// Passive
		["TrueSight", "EnemySense", "FleetFooted"],
		// Always on
		["Knife", "Analyze"],
	],

	//Page 4
	[
		["SpellChoiceUp1", "SpellChoiceUp2"],
		["SummonUp1", "SummonUp2"],
	],
];

/**
 * Spells that the player can choose
 */
let KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. When you plan to use a mystic seal, you get 3 spells to choose from.
	"Elements": [
		{name: "SPUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Incinerate", noise: 3, sfx: "FireSpell", school: "Elements", manacost: 10, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 1, power: 2.5, range: 2.5, size: 3, aoe: 1.5, lifetime: 6, damage: "fire", playerEffect: {name: "Damage"}},
		{name: "Sleet", noise: 8, sfx: "FireSpell", school: "Elements", manacost: 14, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", delay: 1, power: 2, range: 4.5, size: 5, aoe: 2.9, lifetime: 10, time: 2, damage: "frost"},
		{name: "Firebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4.5, delay: 0, range: 50, damage: "fire", speed: 2, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Fireball", noise: 3, sfx: "FireSpell", school: "Elements", manacost: 8, components: ["Arms"], level:3, type:"bolt", projectileTargeting:true, onhit:"aoe", power: 6, delay: 0, range: 50, aoe: 1.5, size: 3, lifetime:1, damage: "fire", speed: 1, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Icebolt", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 6,  power: 3, delay: 0, range: 50, damage: "ice", speed: 3, playerEffect: {name: "Damage"}}, // Throws a blast of ice which stuns the target for 4 turns
		{name: "Icicles", noise: 3, sfx: "MagicSlash", school: "Elements", manacost: 6, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 3, power: 3, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false, castDuringDelay: true, noCastOnHit: true,
			spellcast: {spell: "Icicle", target: "target", directional:true, offset: false}, channel: 3},
		{name: "BoulderLaunch", sfx: "FireSpell", school: "Elements", manacost: 2, components: ["Legs"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 4, delay: 1, power: 4, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
			spellcast: {spell: "Boulder", target: "target", directional:true, offset: false}, channel: 1},
		{name: "Electrify", noise: 6, sfx: "FireSpell", landsfx: "Shock", school: "Elements", manacost: 5, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 8, time: 4, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
		{name: "Crackle", noise: 6, sfx: "Shock", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4.5, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
			trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0, playerEffect: {name: "Shock", time: 1}},
		{name: "Fissure", noise: 7, sfx: "FireSpell", school: "Elements", manacost: 8, components: ["Legs"], level:3, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 5.5, delay: 0, range: 4, speed: 4, size: 1, damage: "fire",
			trailPower: 1.5, trailLifetime: 6, trailTime: 4, piercingTrail: true, trailDamage:"fire", trail:"lingering", trailChance: 1, playerEffect: {name: "DamageNoMsg", hitTag: "Fissure", time: 1, damage:"fire", power: 3}},
		//{name: "Shield", sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"inert", block: 10, onhit:"", power: 0, delay: 2, range: 1.5, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 1 turn
		{name: "Shield", sfx: "MagicSlash", school: "Elements", manacost: 3, components: ["Arms"], mustTarget: true, level:1, type:"buff",
			buffs: [
				{id: "Shield", type: "DamageReduction", duration: 50, power: 2.5, player: false, enemies: true, maxCount: 3, tags: ["defense", "damageTaken"]},
				{id: "Shield2", type: "DamageReduction", duration: 50, power: 5, player: true, enemies: false, maxCount: 3, tags: ["defense", "damageTaken"]},
			], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "GreaterShield", sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"inert", block: 20, onhit:"", power: 0, delay: 5, range: 2, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 5 turns
		{name: "IceBreath", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 10, power: 5, lifetimeHitBonus: 5, damage: "ice"}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		{name: "LightningBolt", noise: 11, sfx: "Shock", school: "Elements", manacost: 9, components: ["Arms"], level:3, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 8.5, delay: 0, time: 1, range: 50, speed: 50, size: 1, damage: "electric",
			trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
		{name: "StoneSkin", sfx: "Bones", school: "Elements", manacost: 6, components: ["Arms"], mustTarget: true, level:1, type:"buff", buffs: [{id: "StoneSkin", type: "Armor", duration: 50, power: 2.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "IronBlood", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Verbal"], mustTarget: true, selfTargetOnly: true, level:1, type:"buff", channel: 4,
			buffs: [
				{id: "IronBlood", aura: "#ff0000", type: "AttackStamina", duration: 99999, cancelOnReapply: true, endSleep: true, power: 1, player: true, enemies: false, tags: ["attack", "stamina"]},
				{id: "IronBlood2", type: "ManaCostMult", duration: 99999, cancelOnReapply: true, endSleep: true, power: 0.25, player: true, enemies: false, tags: ["manacost"]},
			], onhit:"", time:30, power: 0, range: 2, size: 1, damage: ""},
		{name: "FlameBlade", sfx: "FireSpell", school: "Elements", manacost: 3, components: [], level:1, type:"passive", events: [{type: "FlameBlade", trigger: "playerAttack"}]},
		{name: "Strength", sfx: "FireSpell", school: "Elements", manacost: 1, components: [], level:1, type:"passive", events: [
			{type: "ElementalEffect", power: 2, damage: "crush", trigger: "playerAttack"},
			{type: "ModifyStruggle", mult: 1.5, power: 0.2, StruggleType: "Struggle", trigger: "beforeStruggleCalc", msg: "KinkyDungeonSpellStrengthStruggle"},
		]},
	],
	"Conjure": [
		{name: "MPUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SummonUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SummonUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Bomb", noise: 5, sfx: "FireSpell", school: "Conjure", manacost: 5, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", time: 3, delay: 5, power: 10, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "Damage"}, channel: 1},
		{name: "Snare", sfx: "FireSpell", school: "Conjure", manacost: 2, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", onhit:"lingering", lifetime:9999, time: 8, bind: 20, delay: 5, range: 1, damage: "stun", playerEffect: {name: "MagicRope", time: 3}}, // Creates a magic rope trap that creates magic ropes on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
		{name: "SummonGag", sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Arms"], level:2, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "PlayerGag", count: 3, time: 12, strict: true, goToTarget: true}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.5, lifetime: 1, speed: 1, playerEffect: {}},
		{name: "RopeStrike", sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", delay: 1, power: 5, bind: 9, range: 3.5, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "MagicRope", time: 4}},
		//{name: "Constrict", sfx: "FireSpell", school: "Conjure", manacost: 3, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 1, boundBonus: 1, power: 4, bind: 4, range: 3.5, size: 1, aoe: 0.75, lifetime: 1, damage: "chain", playerEffect: {name: "MagicRope", time: 4}},
		{name: "Slime", landsfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Legs"], level:1, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 2, lifetime: 3, power: 4, lifetimeHitBonus: 20, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		//{name: "PinkGas", manacost: 4, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 2, range: 4, size: 3, aoe: 2.5, lifetime: 9999, damage: "stun", playerEffect: {name: "PinkGas", time: 3}}, // Dizzying gas, increases distraction
		{name: "ChainBolt", sfx: "FireSpell", school: "Conjure", manacost: 2, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 8, bind: 10, power: 2.0, delay: 0, range: 50, damage: "chain", speed: 3, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
		{name: "SlimeBall", noise: 1, sfx: "FireSpell", school: "Conjure", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", time: 3,  power: 4, delay: 0, range: 50, damage: "glue", speed: 2,
			trailPower: 4, trailLifetime: 10, trailTime: 3, trailDamage:"glue", trail:"lingering", trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
		{name: "Leap", sfx: "Teleport", school: "Conjure", manacost: 8, components: ["Legs"], noTargetDark: true, noTargetEnemies: true, level:3, type:"hit", onhit:"teleport", delay: 1, lifetime:1, range: 3, damage: ""}, // A quick blink which takes effect instantly, but requires legs to be free
		{name: "Blink", sfx: "Teleport", school: "Conjure", manacost: 6, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"teleport", delay: 3, lifetime:1, range: 5, damage: ""}, // A slow blink with short range, but it uses verbal components
		{name: "Wall", sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"inert", onhit:"summon", summon: [{name: "Wall", count: 1, time: 10}], power: 0, time: 10, delay: -1, range: 6, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Ally", sfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", onhit:"summon", summon: [{name: "Ally", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.9, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "FireElemental", sfx: "MagicSlash", school: "Conjure", manacost: 20, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "FireElemental", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Golem", sfx: "MagicSlash", school: "Conjure", manacost: 24, components: ["Legs"], noTargetEnemies: true, level:3, type:"inert", onhit:"summon", summon: [{name: "Golem", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "StormCrystal", noise: 7, sfx: "MagicSlash", school: "Conjure", manacost: 14, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "StormCrystal", count: 1, time: 30}], power: 0, time: 30, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Heal", noise: 3, sfx: "FireSpell", school: "Conjure", manacost: 4, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", delay: 1, power: 1.5, range: 4.5, size: 5, aoe: 2.9, lifetime: 4, time: 2, damage: "heal", channel: 4},
		{buff: true, heal: true, name: "Heal2", sfx: "MagicSlash", school: "Conjure", manacost: 3, components: ["Verbal"], noTargetPlayer: true, mustTarget: true, level:1, type:"hit",
			onhit:"heal", time:2, lifetime: 1, delay: 1, power: 4.5, aoe: 0.9, range: 7, size: 1, damage: "inert"},
		{name: "FloatingWeapon", sfx: "MagicSlash", school: "Conjure", manacost: 2, components: [], level:3, type:"passive",
			events: [{type: "FloatingWeapon", trigger: "playerAttack"}, {type: "HandsFree", trigger: "getWeapon"}, {type: "HandsFree", trigger: "calcDamage"}]},
	],
	"Illusion": [
		{name: "APUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp1", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp2", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:5, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Dagger", sfx: "MagicSlash", school: "Illusion", manacost: 2, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, noDoubleHit: true, piercing: true, onhit:"", power: 2.5, time: 0, delay: 0, range: 6, damage: "cold", speed: 4, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Flash", noise: 8, sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 4, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}},
		{name: "Ring", noise: 10, sfx: "MagicSlash", school: "Illusion", manacost: 1, components: ["Arms"], level:2, type:"inert", onhit:"aoe", time: 2, delay: 1, power: 1, range: 7, size: 3, aoe: 1.5, lifetime: 1, damage: "stun"},
		{name: "GreaterFlash", noise: 10, sfx: "FireSpell", school: "Illusion", manacost: 6, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", time: 8, delay: 1, power: 1, range: 2.5, size: 5, aoe: 2.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 5}}, // Much greater AoE. Careful not to get caught!
		{name: "FocusedFlash", noise: 10, sfx: "FireSpell", school: "Illusion", manacost: 9, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", time: 14, delay: 2, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 12}}, // Longer delay, but the stun lasts much longer.
		{name: "Shroud", sfx: "FireSpell", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [
			{id: "Shroud", type: "Evasion", power: 7.0, player: true, enemies: true, tags: ["darkness"], range: 1.5},
			{id: "Shroud2", type: "Sneak", power: 3.0, player: true, duration: 6, enemies: false, tags: ["darkness"], range: 1.5}
		], onhit:"", time:8, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
		{name: "Invisibility", sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Verbal"], mustTarget: true, level:3, type:"buff", buffs: [{id: "Invisibility", type: "Sneak", duration: 10, power: 10.0, player: true, enemies: true, tags: ["invisibility"]}], onhit:"", time:10, power: 0, range: 2, size: 1, damage: ""},
		{name: "TrueSteel", sfx: "MagicSlash", school: "Illusion", manacost: 2, components: ["Arms"], noTargetPlayer: true, mustTarget: true, level:1, type:"hit", onhit:"instant", evadeable: true, time:1, power: 4, range: 1.5, size: 1, lifetime: 1, aoe: 0.5, damage: "slash",
			events: [{trigger: "beforeDamageEnemy", type: "MultiplyDamageStealth", power: 2.5, humanOnly: true}]
		},
		{name: "Camo", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Legs"], mustTarget: true, noTargetEnemies: true, level:2, type:"buff",
			buffs: [
				{id: "Camo", type: "SlowDetection", duration: 50, power: 49.0, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["SlowDetection", "move", "cast"]}
			], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowBlade", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Arms"], mustTarget: true, level:2, type:"buff",
			buffs: [{id: "ShadowBlade", type: "AttackDmg", duration: 50, power: 2.0, player: true, enemies: true, maxCount: 5, tags: ["attack", "damage"]}], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowSlash", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, piercing: true, noTerrainHit: true, noEnemyCollision: true, onhit:"aoe", power: 4.5, delay: 0, range: 1.5, aoe: 1.5, size: 3, lifetime:1, damage: "cold", speed: 1, time: 2,
			trailspawnaoe: 1.5, trailPower: 0, trailLifetime: 1.1, trailHit: "", trailDamage:"inert", trail:"lingering", trailChance: 0.4},
		{name: "Decoy", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "Decoy", count: 1, time: 20}], power: 0, time: 20, delay: -1, range: 4, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "ShadowWarrior", sfx: "MagicSlash", school: "Illusion", manacost: 10, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "ShadowWarrior", count: 1, time: 12}], power: 6, time: 12, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "inert"},
		{name: "Corona", noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
			spellcast: {spell: "CoronaBeam", target: "target", directional:true, offset: false}, channel: 2},
		{name: "TrueSight", school: "Illusion", manacost: 1, defaultOff: true, cancelAutoMove: true, components: [], level:1, type:"passive", events: [
			{type: "TrueSight", trigger: "vision"},
			{type: "Blindness", trigger: "calcStats", power: -1},
		]},
		{name: "EnemySense", school: "Illusion", manacost: 4, defaultOff: true, cancelAutoMove: true, costOnToggle: true, components: [], level:2, type:"passive", events: [{type: "EnemySense", trigger: "draw", dist: 8, distStealth: 4}]},
		{name: "FleetFooted", sfx: "FireSpell", school: "Illusion", manacost: 0.5, components: [], level:2, type:"passive",
			events: [{type: "FleetFooted", trigger: "beforeMove", power: 1}, {type: "FleetFooted", trigger: "afterMove"}, {type: "FleetFooted", trigger: "beforeTrap", chance: 0.25}]},
		{name: "Evasion", sfx: "MagicSlash", school: "Illusion", manacost: 5, components: ["Legs"], mustTarget: true, level:1, type:"buff",
			buffs: [
				{id: "Evasion", type: "Evasion", duration: 25, power: 3.0, player: true, enemies: true, maxCount: 5, tags: ["defense", "incomingHit"]},
			], onhit:"", time:25, power: 0, range: 2, size: 1, damage: ""},
	],
};
/**
 * Spells that are not in the base spell lists
 */
let KinkyDungeonSpellListEnemies = [
	// Divine Gifts
	{name: "Freedom", sfx: "Magic", hitsfx: "Struggle", school: "Conjure", manacost: 15, components: [], mustTarget: true, selfTargetOnly: true, level:5, type:"hit",
		onhit:"instant", time:4, lifetime: 1, bind: 8, delay: 1, power: 4, aoe: 2.99, range: 1.5, size: 5, damage: "chain", playerEffect: {name: "RemoveLowLevelRope"}},

	// Rest of the spells
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
	{enemySpell: true, name: "EnemyCorona", noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false,
		spellcast: {spell: "EnemyCoronaBeam", target: "target", directional:true, offset: false}, channel: 2},
	{enemySpell: true, name: "EnemyCoronaBeam", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, range: 8, speed: 50, size: 1, damage: "fire",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "CoronaShock", time: 3}},
	{enemySpell: true, name: "MonolithBeam", noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false,
		spellcast: {spell: "MonolithBeamBeam", target: "target", directional:true, offset: false}, channel: 2},
	{enemySpell: true, name: "MonolithBeamBeam", sfx: "MagicSlash", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 6, delay: 0, range: 8, speed: 50, size: 1, damage: "chain",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "CrystalBind", time: 3}},
	{name: "CoronaBeam", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 12, delay: 0, range: 8, speed: 50, size: 1, damage: "fire",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
	{name: "AllyCrackle", sfx: "Shock", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0},
	{allyspell: true, name: "AllyFirebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1},
	{allyspell: true, name: "AllyShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},
	{allyspell: true, name: "HeelShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 2.5, time: 4, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},
	{allyspell: true, name: "FlameStrike", sfx: "FireSpell", school: "Element", manacost: 6, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", noTerrainHit: true, power: 3, time: 2, delay: 1, range: 1.5, size: 3, aoe: 1.5, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "ShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold", playerEffect: {name: "ShadowStrike", damage: "cold", power: 4, count: 1}},

	{name: "Icicle", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 3,  power: 3, delay: 0, range: 50, damage: "ice", speed: 2, playerEffect: {name: "Damage"}}, // Throws a blast of ice which stuns the target for 4 turns
	{name: "Boulder", sfx: "Bones", hitsfx: "HeavySwing", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 4,  power: 4, delay: 0, range: 50, damage: "crush", speed: 2, playerEffect: {name: "Damage"}}, // Throws a blast of ice which stuns the target for 4 turns

	{allySpell: true, name: "BeltStrike", noise: 2, sfx: "Struggle", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, castRange: 3, nonVolatile: true, onhit:"", power: 4, delay: 0, range: 4, speed: 4, size: 1, damage: "inert",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"cast", trailChance: 1.0,
		trailcast: {spell: "SingleBelt", target: "onhit", directional:true, offset: false}},
	{allySpell: true, name: "SingleBelt", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 4, bind: 4, range: 2, size: 1, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsLeatherWeak", tags: ["leatherRestraints", "leatherRestraintsHeavy"], power: 3, damage: "chain", count: 2, noGuard: true}},


	{enemySpell: true, name: "Ribbons", noise: 6, sfx: "Struggle", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, castRange: 3, nonVolatile: true, onhit:"", power: 3, delay: 0, range: 4, speed: 4, size: 1, damage: "inert",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"cast", trailChance: 1.0,
		trailcast: {spell: "SingleRibbon", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "SingleRibbon", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 4, range: 2, size: 1, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRibbons", tags: ["magicRibbons"], power: 3, damage: "chain", count: 1, noGuard: true}},

	{enemySpell: true, msg: true, name: "AreaElectrify", landsfx: "Shock", school: "Conjure", manacost: 10, components: ["Legs"], level:1, type:"inert", onhit:"cast", dot: true, time: 4, delay: 3, range: 2.5, size: 3, aoe: 2.5, lifetime: 1, power: 1, damage: "inert",
		spellcasthit: {spell: "WitchElectrify", target: "onhit", chance: 0.22, directional:false, offset: false}, channel: 2}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "IceDragonBreath", sfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", time: 1, power: 4, delay: 0, range: 4, speed: 50, size: 1, damage: "inert",
		trailPower: 4, trailLifetime: 1, trailLifetimeBonus: 4, trailTime: 3, trailspawnaoe: 1.5, trailDamage:"ice", trail:"lingering", trailChance: 0.3, trailPlayerEffect: {name: "Freeze", time: 3}},
	{enemySpell: true, name: "IceDragonBreathPrepare", sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 5, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "IceDragonBreath", target: "target", directional:true, offset: false}, channel: 2},

	{enemySpell: true, name: "IceSlow", sfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 1, delay: 0, time: 2, range: 4, speed: 50, size: 1, damage: "inert",
		trailPower: 4, trailLifetime: 2, trailLifetimeBonus: 8, trailTime: 3, trailspawnaoe: 1.5, trailDamage:"ice", trail:"lingering", trailChance: 0.5, trailPlayerEffect: {name: "Chill", time: 3, damage: "ice", power: 1}},
	{enemySpell: true, name: "IceSlowPrepare", sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 12, range: 5, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "IceSlow", target: "target", directional:true, offset: false}, channel: 1},

	{enemySpell: true, name: "FlashBomb", sfx: "Miss", school: "Illusion", manacost: 3, specialCD: 12, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1, range: 4, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 3}},
	{enemySpell: true, name: "EnemyFlash", noise: 8, sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 3, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}},

	{enemySpell: true, name: "SleepGas", sfx: "Miss", school: "Illusion", manacost: 4, specialCD: 24, components: ["Verbal"], level:1, type:"inert", passthrough: true, noTerrainHit: true, buffs: [
		{id: "SleepGas", type: "Sleepiness", power: 1, player: true, enemies: false, tags: ["sleep"], range: 1.5}], onhit:"", time:6, aoe: 1.5, power: 1, delay: 8, range: 4, size: 3, damage: "poison", playerEffect: {name: "DamageNoMsg", damage: "poison", power: 1}}, // Creates a shroud. Enemies within are hard to hit with melee attacks.

	{enemySpell: true, name: "Glue", landsfx: "Freeze", school: "Conjure", manacost: 9, components: ["Legs"], level:1, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 1.5, lifetime: 24, power: 4, lifetimeHitBonus: 76, damage: "glue", playerEffect: {name: "Glue", count: 1, damage: "glue", power: 4, time: 1}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "RedSlime", sfx: "Miss", manacost: 4, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 4, delay: 0, range: 50, damage: "glue", speed: 1.5, playerEffect: {name: "DamageNoMsg", power: 4, damage: "glue"},
		spellcast: {spell: "SummonSingleRedSlime", target: "onhit", directional:false, offset: false, strict: true}},

	{enemySpell: true, name: "AmpuleBlue", sfx: "Miss", manacost: 5, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 4, delay: 0, range: 50, damage: "glue", speed: 1, playerEffect: {name: "AmpuleBlue", damage: "glue", power: 4, count: 1}},

	{enemySpell: true, name: "AmpuleGreen", sfx: "Miss", manacost: 4, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "SleepGas", target: "onhit", directional:false, offset: false}},
	{enemySpell: true, name: "AmpuleYellow", sfx: "Miss", manacost: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "Glue", target: "onhit", directional:false, offset: false}},
	{enemySpell: true, name: "AmpuleRed", sfx: "Miss", manacost: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "SummonRedSlime", target: "onhit", directional:true, offset: false}},

	{enemySpell: true, name: "ZombieOrb", sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "chain", speed: 1,
		playerEffect: {name: "CharmWraps", power: 2, damage: "ice", time: 1}},
	{enemySpell: true, name: "ZombieOrbIce", specialCD: 12, sfx: "MagicSlash", hitsfx: "Freeze", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 3, delay: 0, range: 50, damage: "ice", speed: 1,
		playerEffect: {name: "Freeze", power: 4, damage: "ice", time: 3}},

	{enemySpell: true, name: "RopeEngulf", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 6, range: 2, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "RopeEngulf", power: 2}},
	{enemySpell: true, name: "RopeEngulfWeak", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 3.5, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "RopeEngulfWeak", power: 1, damage: "chain"}},
	{enemySpell: true, name: "Entangle", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 4, range: 6, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "VineEngulf", power: 2}},
	{enemySpell: true, name: "Feathers", sfx: "Tickle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 6, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "tickle", playerEffect: {name: "Damage"}},
	{enemySpell: true, name: "RibbonBurst", sfx: "MagicSlash", manacost: 5, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 4, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRibbons", tags: ["magicRibbons"], power: 3, damage: "chain", count: 2, noGuard: true}},
	{enemySpell: true, name: "Spores", sfx: "MagicSlash", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 3, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "poison", playerEffect: {name: "Spores", power: 2, damage: "poison"}},
	{enemySpell: true, name: "SporesHappy", sfx: "FireSpell", noCastMsg: true, selfcast: true, manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "poison", playerEffect: {name: "SporesHappy", power: 2, damage: "poison", distraction: 10}},
	{enemySpell: true, name: "SporesSick", noCastMsg: true, hitsfx: "DamageWeak", selfcast: true, manacost: 0, components: ["Verbal"], level:1, type:"hit", onhit:"aoe", time: 5, delay: 0, power: 1, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "poison", playerEffect: {name: "SporesSick", power: 2, damage: "poison"}},
	{enemySpell: true, name: "SoulCrystalBind", sfx: "Freeze", manacost: 7, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 6, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "drain", playerEffect: {name: "ObsidianEngulf", count: 1, power: 6, damage: "drain"}},

	{enemySpell: true, name: "MinerBomb", selfcast: true, noise: 5, sfx: "FireSpell", hitsfx: "FireSpell", school: "Conjure", manacost: 5, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 5, power: 6, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "HeatBlast", time: 3, damage: "pain", power: 6}},

	{enemySpell: true, name: "WitchChainBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", bind: 12, time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "MagicChain", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleMagicChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "BanditBola", sfx: "Miss", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 3, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "BanditBola"}}, // Throws a chain which stuns the target for 1 turn
	{allySpell: true, name: "PlayerBola", noMiscast: true, sfx: "Miss", manacost: 0, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 4, power: 3, bind: 9, delay: 0, range: 50, damage: "chain", speed: 2, playerEffect: {name: "BanditBola", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "RestrainingDevice", sfx: "Miss", manacost: 6, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "RestrainingDevice", count: 3, time: 3, power: 5, damage: "crush"}},
	{enemySpell: true, name: "MummyBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "MysticShock", time: 3}},
	{enemySpell: true, name: "RobotBolt", sfx: "Laser", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "electric", speed: 1, playerEffect: {name: "RobotShock", time: 2}},
	{enemySpell: true, name: "RubberBullets", sfx: "Gunfire", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "glue", speed: 2, playerEffect: {name: "RubberBullets", power: 4, count: 1, damage: "glue"}},
	{enemySpell: true, name: "HeatBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "HeatBlast", time: 1, damage: "pain", power: 5}},
	{enemySpell: true, name: "HighBolt", sfx: "MagicSlash", manacost: 2, specialCD: 18, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",
		power: 6, delay: 0, range: 50, damage: "poison", speed: 1, playerEffect: {name: "Flummox", time: 1, damage: "poison", power: 6}},
	{enemySpell: true, noFirstChoice: true, name: "Hairpin", sfx: "Miss", manacost: 2, castRange: 6, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "pain", speed: 2, playerEffect: {name: "Hairpin", power: 2, damage: "pain", time: 1}},
	{enemySpell: true, name: "PoisonDragonBlast", sfx: "FireSpell", hitsfx: "Bones", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "grope", speed: 1, playerEffect: {name: "VineEngulf", power: 2}},
	{enemySpell: true, name: "ElfArrow", sfx: "Miss", hitsfx: "FireSpell", manacost: 3, components: ["Arms"], level: 1, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "EnchantedArrow", power: 2, count: 1}},
	{enemySpell: true, name: "ShadowOrb", sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 5, damage: "inert", speed: 2, playerEffect: {name: ""},
		spellcast: {spell: "ShadowScythe", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "ShadowScythe", sfx: "MagicSlash", manacost: 4, components: ["Verbal"], level:1, type:"inert", noTerrainHit: true, onhit:"aoe", time: 5, delay: 1, power: 6, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "ShadowBind", time: 4}},
	{enemySpell: true, name: "WitchSlime", landsfx: "MagicSlash", manacost: 2, components: ["Legs"], level:2, type:"inert", onhit:"lingering", time: 2, delay: 1, range: 4, power: 2, size: 3, aoe: 1, lifetime: 1, lifetimeHitBonus: 9, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{enemySpell: true, name: "WitchSlimeBall", sfx: "FireSpell", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", time: 2,  power: 2, delay: 0, range: 50, damage: "glue", speed: 1, trailLifetime: 10, trailDamage:"glue", trail:"lingering", trailPower: 2, trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
	{enemySpell: true, name: "SlimePuddle", sfx: "FireSpell", manacost: 3, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"lingering", time: 2, power: 2, lifetime: 5, lifetimeHitBonus: 5, aoe: 1.5, delay: 0, range: 50, damage: "glue", speed: 1, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime

	// Shockwitch spells
	{enemySpell: true, name: "WitchElectrify", landsfx: "Shock", manacost: 3, components: ["Arms"], level:2, type:"inert", onhit:"aoe", power: 3.5, time: 1, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
	{enemySpell: true, name: "WitchElectricOrb", sfx: "MagicSlash", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 5, damage: "inert", speed: 1, playerEffect: {name: ""},
		spellcast: {spell: "WitchElectricBurst", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "WitchElectricBurst", sfx: "Shock", manacost: 4, components: ["Verbal"], level:1, type:"hit", noTerrainHit: true, onhit:"aoe", time: 5, delay: 1, power: 4, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}},


	{enemySpell: true, name: "SummonSkeleton", landsfx: "Bones", manacost: 8, components: ["Verbal"], level:3, type:"inert", onhit:"summon", summon: [{name: "SummonedSkeleton", count: 1, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 4, size: 3, aoe: 2.1, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonSkeletons", landsfx: "Bones", manacost: 18, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "SummonedSkeleton", count: 4, time: 16, strict: true}], power: 0, time: 16, delay: 1, range: 4, size: 3, aoe: 2.6, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "RopeAttack", hitsfx: "Struggle", manacost: 6, components: ["Verbal"], level:4, type:"hit", onhit:"null", noSumMsg: true, summon: [
		{name: "LearnedRope", count: 1, chance: 0.5, time: 20, strict: true},
		{name: "UnforseenRope", count: 1, chance: 0.5, time: 20, strict: true}
	], power: 0, time: 12, delay: 1, range: 8, size: 3, aoe: 10, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonCrystals", landsfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "ChaoticCrystal", count: 3, time: 10}], power: 0, time: 10, delay: 1, range: 40, size: 1, aoe: 2, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonTickleHand", sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "TickleHand", count: 3, time: 12}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonSingleTickleHand", sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "TickleHand", count: 1, time: 12}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonEnemyGag", sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "Gag", count: 1, time: 12}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonCuffs", sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "Cuffs", count: 1, time: 12}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonLock", sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "Lock", count: 1, time: 12}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonRedSlime", sfx: "Freeze", manacost: 8, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "RedSlime", count: 1, time: 12, strict: true}], power: 0, damage: "glue", time: 12, delay: 1, range: 0.5, size: 1, aoe: 2, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonSingleRedSlime", sfx: "Freeze", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "RedSlime", count: 1, time: 12, strict: true}], power: 0, damage: "glue", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonLatexElemental", sfx: "MagicSlash", manacost: 6, specialCD: 40, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "ElementalLatex", count: 1, time: 28}], power: 0, damage: "glue", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "MirrorImage", selfcast: true, sfx: "FireSpell", manacost: 12, components: ["Verbal"], level:4, castRange: 50, type:"inert", onhit:"summon", summon: [{name: "MaidforceStalkerImage", count: 1, time: 12}], power: 0, time: 12, delay: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "fire",
		spellcast: {spell: "DarkShroud", target: "origin", directional:false, offset: false}},
	{enemySpell: true, name: "SummonBookChain", sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookChain", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, selfcast: true, buff: true, name: "ArmorUp", sfx: "Bones", school: "Elements", manacost: 8, components: ["Arms"], mustTarget: true, level:1, type:"buff", buffs: [{id: "ArmorUp", type: "Armor", duration: 6, power: 1.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:6, power: 0, range: 2, size: 1, damage: ""},
	{enemySpell: true, selfcast: true, buff: true, name: "ArmorUpArea", sfx: "MagicSlash", school: "Elements", manacost: 8, components: ["Arms"], mustTarget: true, level:1,
		type:"buff", buffs: [{id: "ArmorUpArea", type: "Armor", duration: 6, power: 2.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:6, power: 0, range: 2.9, aoe: 2.9, size: 1, damage: ""},
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
		onhit:"heal", time:2, lifetime: 1, delay: 1, power: 2, aoe: 1.5, range: 8, size: 3, damage: "inert"},
	{enemySpell: true, name: "Earthfield", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Earthfield", type: "Armor", power: 2.0, player: false, enemies: true, noAlly: true, tags: ["armor", "defense"], range: 1.5}], onhit:"", time:6, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Earthrune", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Earthfield", type: "Armor", power: 2.0, player: true, enemies: true, onlyAlly: true, tags: ["armor", "defense"], range: 1.5}], onhit:"", time:9, aoe: 1.5, power: 0, delay: 9, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Icerune", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 5, power: 4, lifetimeHitBonus: 3, damage: "ice"}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{name: "Waterrune", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert",
		buffs: [
			{id: "WaterRune", type: "SpellResist", power: 1.0, player: true, enemies: true, onlyAlly: true, tags: ["spellresist", "defense"], range: 1.5},
			{id: "WaterRune2", type: "MoveSpeed", power: 1.0, player: false, enemies: true, noAlly: true, tags: ["slow", "debuff"], range: 1.5},
		], onhit:"", time:9, aoe: 1.5, power: 0, delay: 9, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.

	{enemySpell: true, name: "TrapCharmWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsCharmWeak", tags: ["ribbonRestraints"], count: 4}},
	{enemySpell: true, name: "TrapRibbons", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 4, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRibbons", tags: ["magicRibbons"], count: 3}},
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
