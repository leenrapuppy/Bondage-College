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
	{name: "Analyze", sfx: "MagicSlash", school: "Elements", manacost: 5, components: [], level:1, type:"special", special: "analyze", noMiscast: true,
		onhit:"", time:25, power: 0, range: 1.5, size: 1, damage: ""},
	{name: "CommandWord", sfx: "Magic", school: "Conjure", manacost: 12, components: ["Verbal"], level:1, type:"special", special: "CommandWord", noMiscast: true,
		onhit:"", time:25, power: 0, range: 1.5, size: 1, damage: ""},
	{name: "FleetFooted", sfx: "FireSpell", school: "Illusion", manacost: 0.5, components: [], level:1, type:"passive",
		events: [{type: "FleetFooted", trigger: "beforeMove", power: 1}, {type: "FleetFooted", trigger: "afterMove"}, {type: "FleetFooted", trigger: "beforeTrap", msg: "KinkyDungeonFleetFootedIgnoreTrapFail", chance: 0.35}]},
];

// Filters
let filters = ["buff", "bolt", "aoe", "dot", "denial", "offense", "defense", "utility"];
/** Extra filters, indexed according to the learnable spells menu */
let filtersExtra = [
	["fire", "ice", "earth", "air"],
	["conjure", "slime", "summon", "bind", "teleport"],
	["stealth", "light", "shadow"],
	[],
];

let KDColumnLabels = [
	["Verbal", "Arms", "Legs", "Passive"],
	["Verbal", "Arms", "Legs", "Passive"],
	["Verbal", "Arms", "Legs", "Passive"],
	[],
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
		["Incinerate", "Freeze", "IceBreath", "IronBlood", "Electrify"],
		// Arms
		["Firebolt", "Fireball", "Icebolt", "Icicles", "StoneSkin", "Crackle", "LightningBolt"],
		// Legs
		["Ignite", "Fissure", "Sleet", "Shield", "GreaterShield", "BoulderLaunch", ],
		// Passive
		["Analyze", "FlameBlade", "Strength", "Shatter"],
	],

	//Page 2: Conjuration
	[
		// Verbal
		["CommandWord", "Heal2", "Bomb", "RopeStrike", "Lockdown", "FireElemental", "Blink"],
		// Arms
		["Heal", "ChainBolt", "SummonGag", "SlimeBall"],
		// Legs
		["Snare", "Wall", "Slime", "StormCrystal", "Ally", "Golem", "Leap"],
		// Passive
		["FloatingWeapon"],
	],

	//Page 3: Illusion
	[
		// Verbal
		["Flash", "FocusedFlash", "GreaterFlash", "ShadowWarrior", "Shroud", "Invisibility"],
		// Arms
		["ShadowBlade", "ShadowSlash", "Dagger", "TrueSteel", "Ring", "Corona"],
		// Legs
		["Evasion", "Camo", "Decoy"],
		// Passive
		["FleetFooted", "TrueSight", "EnemySense"],
	],

	//Page 4
	[
		["SpellChoiceUp1", "SpellChoiceUp2", "SpellChoiceUp3"],
		["SummonUp1", "SummonUp2"],
	],
];

/**
 * Spells that the player can choose
 * @type {Record<string, spell[]>}
 */
let KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. When you plan to use a mystic seal, you get 3 spells to choose from.
	"Elements": [
		{name: "SPUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Incinerate", tags: ["fire", "aoe", "dot", "offense", "denial"], noise: 3, sfx: "FireSpell", school: "Elements", manacost: 10, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 1, power: 2.5, range: 2.5, size: 3, aoe: 1.5, lifetime: 6, damage: "fire", playerEffect: {name: "Damage"}},
		{name: "Freeze", tags: ["ice", "utility", "offense"], sfx: "Freeze", school: "Elements", manacost: 3, components: ["Verbal"], noTargetPlayer: true, mustTarget: true, level:1, type:"hit", onhit:"instant", evadeable: false, time:6, power: 0, range: 1.5, size: 1, lifetime: 1, aoe: 0.5, damage: "ice"},
		{name: "Sleet", tags: ["ice", "aoe", "dot", "offense", "denial"], noise: 8, sfx: "FireSpell", school: "Elements", manacost: 14, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", delay: 1, power: 1, range: 4.5, size: 5, aoe: 2.9, lifetime: 20, time: 2, damage: "frost"},
		{name: "Firebolt", tags: ["fire", "bolt", "offense"], sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4.5, delay: 0, range: 50, damage: "fire", speed: 2, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Fireball", prerequisite: "Firebolt", tags: ["fire", "bolt", "aoe", "offense"], noise: 3, sfx: "FireSpell", school: "Elements", manacost: 8, components: ["Arms"], level:3, type:"bolt", projectileTargeting:true, onhit:"aoe", power: 6, delay: 0, range: 50, aoe: 1.5, size: 3, lifetime:1, damage: "fire", speed: 1, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Icebolt", tags: ["ice", "bolt", "offense"], sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 4,  power: 3.5, delay: 0, range: 50, damage: "frost", speed: 3, playerEffect: {name: "Damage"},
			events: [{type: "ElementalOnSlowOrBind", trigger: "bulletHitEnemy", damage: "ice", time: 4, power: 0},]},
		{name: "Icicles", tags: ["ice", "bolt", "offense"], prerequisite: "Icebolt", noise: 3, sfx: "MagicSlash", school: "Elements", manacost: 6, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 3, power: 3, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false, castDuringDelay: true, noCastOnHit: true,
			spellcast: {spell: "Icicle", target: "target", directional:true, offset: false}, channel: 3},
		{name: "BoulderLaunch", tags: ["earth", "bolt", "offense"], sfx: "Telekinesis", school: "Elements", manacost: 2, components: ["Legs"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 4, delay: 1, power: 4, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
			spellcast: {spell: "Boulder", target: "target", directional:true, offset: false}, channel: 1},
		{name: "Electrify", tags: ["electric", "offense"], noise: 6, sfx: "FireSpell", landsfx: "Shock", school: "Elements", manacost: 5, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 8, time: 4, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
		{name: "Crackle", tags: ["electric", "offense", "aoe"], noise: 6, sfx: "Shock", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4.5, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
			trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0, playerEffect: {name: "Shock", time: 1}},
		{name: "Fissure", tags: ["fire", "denial", "dot", "aoe", "offense"], prerequisite: "Ignite", noise: 7, sfx: "FireSpell", school: "Elements", manacost: 8, components: ["Legs"], level:3, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 5.5, delay: 0, range: 4, speed: 4, size: 1, damage: "fire",
			trailPower: 1.5, trailLifetime: 6, trailTime: 4, piercingTrail: true, trailDamage:"fire", trail:"lingering", trailChance: 1, playerEffect: {name: "DamageNoMsg", hitTag: "Fissure", time: 1, damage:"fire", power: 3}},
		//{name: "Shield", sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"inert", block: 10, onhit:"", power: 0, delay: 2, range: 1.5, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 1 turn
		{name: "Shield", tags: ["shield", "defense"], sfx: "MagicSlash", school: "Elements", manacost: 3, components: ["Arms"], mustTarget: true, level:1, type:"buff",
			buffs: [
				{id: "Shield", type: "DamageReduction", labelcolor: "#73efe8", duration: 50, power: 2.5, player: false, enemies: true, maxCount: 3, tags: ["defense", "damageTaken"]},
				{id: "Shield2", type: "DamageReduction", duration: 50, power: 5, player: true, enemies: false, maxCount: 3, tags: ["defense", "damageTaken"]},
			], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "GreaterShield", tags: ["shield", "defense", "utility"], prerequisite: "Shield", spellPointCost: 1, sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"inert", block: 20, onhit:"", power: 0, delay: 5, range: 2, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 5 turns
		{name: "IceBreath", tags: ["ice", "denial", "offense", "utility", "aoe"], prerequisite: "Freeze", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 10, power: 5, lifetimeHitBonus: 5, damage: "ice"}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		{name: "LightningBolt", tags: ["electric", "aoe", "offense"], prerequisite: "Crackle", noise: 11, sfx: "Shock", school: "Elements", manacost: 9, components: ["Arms"], level:3, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 8.5, delay: 0, time: 1, range: 50, speed: 50, size: 1, damage: "electric",
			trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
		{name: "StoneSkin", tags: ["earth", "buff", "defense"], sfx: "Bones", school: "Elements", manacost: 6, components: ["Arms"], mustTarget: true, level:1, type:"buff", buffs: [{id: "StoneSkin", aura: "orange", type: "Armor", duration: 50, power: 2.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "IronBlood", tags: ["earth", "buff", "offense"], sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Verbal"], mustTarget: true, selfTargetOnly: true, level:1, type:"buff", channel: 4,
			buffs: [
				{id: "IronBlood", aura: "#ff0000", type: "AttackStamina", duration: 99999, cancelOnReapply: true, endSleep: true, power: 1, player: true, enemies: false, tags: ["attack", "stamina"]},
				{id: "IronBlood2", type: "ManaCostMult", duration: 99999, cancelOnReapply: true, endSleep: true, power: 0.25, player: true, enemies: false, tags: ["manacost"]},
			], onhit:"", time:30, power: 0, range: 2, size: 1, damage: ""},
		{name: "FlameBlade", tags: ["fire", "aoe", "offense", "buff"], sfx: "FireSpell", school: "Elements", manacost: 3, components: [], level:1, type:"passive", events: [{type: "FlameBlade", trigger: "playerAttack"}]},
		{name: "Strength", tags: ["earth", "struggle", "buff", "utility", "offense"], sfx: "FireSpell", school: "Elements", manacost: 1, components: [], level:1, type:"passive", events: [
			{type: "ElementalEffect", power: 2, damage: "crush", trigger: "playerAttack"},
			{type: "ModifyStruggle", mult: 1.5, power: 0.2, StruggleType: "Struggle", trigger: "beforeStruggleCalc", msg: "KinkyDungeonSpellStrengthStruggle"},
		]},
		{name: "Ignite", tags: ["fire", "aoe", "dot", "buff"], sfx: "FireSpell", school: "Elements", manacost: 2, spellPointCost: 1, components: ["Legs"], mustTarget: true, noTargetEnemies: true, level:2, type:"buff",
			buffs: [
				{id: "Ignite", aura: "#ff8400", type: "SpellCastConstant", duration: 6, power: 10.0, player: true, enemies: true, spell: "Ignition", tags: ["offense"]},
			],
			onhit:"", time:6, power: 1.5, range: 2.9, size: 1, damage: ""},

		// Passive spells
		{name: "Shatter", tags: ["ice", "aoe", "offense"], school: "Elements", manacost: 1, components: [], power: 1.5, time: 4, level:2, type:"passive", events: [
			{type: "Shatter", trigger: "enemyStatusEnd"},
			{type: "Shatter", trigger: "beforePlayerAttack"},
			{type: "Shatter", trigger: "kill"},
		]},

	],
	"Conjure": [
		{name: "MPUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SummonUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SummonUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Bomb", tags: ["conjure", "aoe", "offense"], noise: 5, sfx: "FireSpell", school: "Conjure", manacost: 5, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", time: 3, delay: 5, power: 10, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "Damage"}, channel: 1},
		{name: "Snare", tags: ["conjure", "denial", "utility", "offense"], sfx: "FireSpell", school: "Conjure", manacost: 2, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", onhit:"lingering", lifetime:9999, time: 8, bind: 20, delay: 5, range: 1, damage: "stun", playerEffect: {name: "MagicRope", time: 3}}, // Creates a magic rope trap that creates magic ropes on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
		{name: "SummonGag", tags: ["summon", "utility", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Arms"], level:2, projectileTargeting:true, noSprite: true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "PlayerGag", count: 3, time: 12, strict: true, goToTarget: true}], power: 0, damage: "tickle", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.5, lifetime: 1, speed: 1, playerEffect: {}},
		{name: "RopeStrike", tags: ["binding", "aoe", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", delay: 1, power: 3, bind: 9, range: 3.5, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "MagicRope", time: 4}},
		//{name: "Constrict", sfx: "FireSpell", school: "Conjure", manacost: 3, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 1, boundBonus: 1, power: 4, bind: 4, range: 3.5, size: 1, aoe: 0.75, lifetime: 1, damage: "chain", playerEffect: {name: "MagicRope", time: 4}},
		{name: "Slime", tags: ["slime", "aoe", "denial", "offense"], landsfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Legs"], level:1, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 2, lifetime: 3, power: 4, lifetimeHitBonus: 20, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		//{name: "PinkGas", manacost: 4, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 2, range: 4, size: 3, aoe: 2.5, lifetime: 9999, damage: "stun", playerEffect: {name: "PinkGas", time: 3}}, // Dizzying gas, increases distraction
		{name: "ChainBolt", tags: ["binding", "bolt", "offense"], sfx: "FireSpell", school: "Conjure", manacost: 2, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 8, bind: 7, power: 2.0, delay: 0, range: 50, damage: "chain", speed: 3, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
		{name: "SlimeBall", tags: ["slime", "denial", "bolt", "offense"], noise: 1, sfx: "FireSpell", school: "Conjure", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", time: 3,  power: 4, delay: 0, range: 50, damage: "glue", speed: 2,
			trailPower: 4, trailLifetime: 10, trailTime: 3, trailDamage:"glue", trail:"lingering", trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
		{name: "Leap", tags: ["teleport", "utility", "defense"], sfx: "Teleport", school: "Conjure", manacost: 8, components: ["Legs"], noTargetDark: true, noTargetEnemies: true, level:3, type:"hit", onhit:"teleport", delay: 1, lifetime:1, range: 3, damage: ""}, // A quick blink which takes effect instantly, but requires legs to be free
		{name: "Blink", tags: ["teleport", "utility", "defense"], sfx: "Teleport", school: "Conjure", manacost: 6, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"teleport", delay: 3, lifetime:1, range: 5, damage: ""}, // A slow blink with short range, but it uses verbal components
		{name: "Wall", tags: ["summon", "utility", "defense"], sfx: "MagicSlash", school: "Conjure", manacost: 3, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"hit", noSprite: true, onhit:"summon", summon: [{name: "Wall", count: 1, time: 10}], power: 0, time: 10, delay: -1, range: 6, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Ally", tags: ["summon", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"hit", onhit:"summon", noSprite: true, summon: [{name: "Ally", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.9, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "FireElemental", tags: ["summon", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 20, components: ["Verbal"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"hit", noSprite: true, onhit:"summon", summon: [{name: "FireElemental", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Golem", prerequisite: "Ally", tags: ["summon", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 24, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:3, type:"hit", noSprite: true, onhit:"summon", summon: [{name: "Golem", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "StormCrystal", tags: ["summon", "denial", "offense"], noise: 7, sfx: "MagicSlash", school: "Conjure", manacost: 14, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"hit", noSprite: true, onhit:"summon", summon: [{name: "StormCrystal", count: 1, time: 30}], power: 0, time: 30, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{noAggro: true, name: "Heal", noise: 3, sfx: "FireSpell", school: "Conjure", manacost: 4, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", delay: 1, power: 1.5, range: 4.5, size: 5, aoe: 2.9, lifetime: 4, time: 2, damage: "heal", channel: 4},
		{noAggro: true, buff: true, heal: true, name: "Heal2", sfx: "MagicSlash", school: "Conjure", manacost: 3, components: ["Verbal"], noTargetPlayer: true, mustTarget: true, level:1, type:"hit",
			onhit:"heal", time:2, lifetime: 1, delay: 1, power: 4.5, aoe: 0.9, range: 7, size: 1, damage: "inert"},
		{name: "FloatingWeapon", tags: ["buff", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 2, components: [], level:3, type:"passive",
			events: [{type: "FloatingWeapon", trigger: "playerAttack"}, {type: "HandsFree", trigger: "getWeapon"}, {type: "HandsFree", trigger: "calcDamage"}]},
		{name: "Lockdown", tags: ["binding", "utility", "offense"], sfx: "MagicSlash", school: "Conjure", manacost: 1, components: ["Verbal"], mustTarget: true, level:2, type:"buff",
			buffs: [
				{id: "Lockdown", aura: "#a96ef5", type: "Locked", duration: 8, power: 1.0, player: true, enemies: true, tags: ["lock", "debuff"]},
				{id: "Lockdown2", type: "MoveSpeed", duration: 8, power: -1.0, player: false, enemies: true, noAlly: true, tags: ["slow", "debuff"]},
				{id: "Lockdown3", type: "AttackSlow", duration: 8, power: 1.0, player: false, enemies: true, noAlly: true, tags: ["slow", "debuff"]},
			], onhit:"", time:8, power: 0, range: 1.5, size: 1, damage: ""},
	],
	"Illusion": [
		{name: "APUp1", school: "Any", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp2", school: "Any", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp3", school: "Any", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp1", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp2", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SpellChoiceUp3", school: "Any", manacost: 0, components: [], spellPointCost: 1, level:5, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Dagger", tags: ["bolt", "shadow", "offense"], sfx: "MagicSlash", school: "Illusion", manacost: 2, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, noDoubleHit: true, piercing: true, onhit:"", power: 2.5, time: 0, delay: 0, range: 6, damage: "cold", speed: 4, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Flash", tags: ["light", "utility", "aoe", "offense"], noise: 8, sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 4, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}},
		{name: "Ring", tags: ["aoe", "utility", "stealth"], noise: 10, sfx: "MagicSlash", school: "Illusion", manacost: 1, components: ["Arms"], level:2, type:"inert", onhit:"aoe", time: 2, delay: 1, power: 1, range: 7, size: 3, aoe: 1.5, lifetime: 1, damage: "stun"},
		{name: "GreaterFlash", tags: ["light", "utility", "aoe", "offense"], prerequisite: "Flash", spellPointCost: 1, noise: 10, sfx: "FireSpell", school: "Illusion", manacost: 6, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", time: 8, delay: 1, power: 1, range: 2.5, size: 5, aoe: 2.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 5}}, // Much greater AoE. Careful not to get caught!
		{name: "FocusedFlash", tags: ["light", "utility", "aoe", "offense"], prerequisite: "GreaterFlash", spellPointCost: 1, noise: 10, sfx: "FireSpell", school: "Illusion", manacost: 9, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", time: 14, delay: 2, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 12}}, // Longer delay, but the stun lasts much longer.
		{name: "Shroud", tags: ["aoe", "buff", "utility", "stealth", "defense"], sfx: "Fwoosh", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [
			{id: "Shroud", type: "Evasion", power: 7.0, player: true, enemies: true, tags: ["darkness"], range: 1.5},
			{id: "Shroud2", aura: "#444488", type: "Sneak", power: 4.0, player: true, duration: 8, enemies: false, tags: ["darkness"], range: 1.5}
		], onhit:"", time:8, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
		{name: "Invisibility", tags: ["buff", "utility", "stealth", "defense"], sfx: "Invis", school: "Illusion", manacost: 8, components: ["Verbal"], mustTarget: true, level:3, type:"buff",
			buffs: [
				{id: "Invisibility", aura: "#888888", type: "Sneak", duration: 10, power: 10.0, player: true, enemies: true, tags: ["invisibility"]},
				{id: "Invisibility2", type: "SlowDetection", duration: 14, power: 0.5, player: true, enemies: false, tags: ["invisibility"]},
			], onhit:"", time:14, power: 0, range: 2, size: 1, damage: ""},
		{name: "TrueSteel", tags: ["offense", "stealth"], sfx: "MagicSlash", school: "Illusion", manacost: 2, components: ["Arms"], noTargetPlayer: true, mustTarget: true, level:1, type:"hit", onhit:"instant", evadeable: false, time:1, power: 4, range: 1.5, size: 1, lifetime: 1, aoe: 0.5, damage: "slash",
			events: [{trigger: "beforeDamageEnemy", type: "MultiplyDamageStealth", power: 2.5, humanOnly: true}]
		},
		{name: "Camo", tags: ["buff", "utility", "stealth", "defense"], sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Legs"], mustTarget: true, noTargetEnemies: true, level:2, type:"buff",
			buffs: [
				{id: "Camo", aura: "#3b7d4f", type: "SlowDetection", duration: 50, power: 49.0, player: true, enemies: true, endSleep: true, maxCount: 1, tags: ["SlowDetection", "move", "cast"]}
			], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowBlade", tags: ["buff", "offense", "shadow"], sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Arms"], mustTarget: true, level:2, type:"buff",
			buffs: [{id: "ShadowBlade", aura: "#7022a0", type: "AttackDmg", duration: 50, power: 2.0, player: true, enemies: true, maxCount: 5, tags: ["attack", "damage"]}], onhit:"", time:50, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowSlash", tags: ["aoe", "offense", "shadow"], prerequisite: "ShadowBlade", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, piercing: true, noTerrainHit: true, noEnemyCollision: true, onhit:"aoe", power: 4.5, delay: 0, range: 1.5, aoe: 1.5, size: 3, lifetime:1, damage: "cold", speed: 1, time: 2,
			trailspawnaoe: 1.5, trailPower: 0, trailLifetime: 1.1, trailHit: "", trailDamage:"inert", trail:"lingering", trailChance: 0.4},
		{name: "Decoy", tags: ["summon", "utility", "stealth", "defense"], prerequisite: "Camo", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"hit", noSprite: true, onhit:"summon", summon: [{name: "Decoy", count: 1, time: 20}], power: 0, time: 20, delay: -1, range: 4, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "ShadowWarrior", tags: ["summon", "offense", "shadow", "dot"], sfx: "MagicSlash", school: "Illusion", manacost: 10, components: ["Verbal"], noTargetEnemies: true, noTargetPlayer: true, level:2, type:"hit", noSprite: true, onhit:"summon", summon: [{name: "ShadowWarrior", count: 1, time: 12}], power: 6, time: 12, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "inert"},
		{name: "Corona", tags: ["light", "offense"], noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
			spellcast: {spell: "CoronaBeam", target: "target", directional:true, offset: false}, channel: 2},
		{name: "TrueSight", tags: ["buff", "utility"], school: "Illusion", manacost: 1, defaultOff: true, cancelAutoMove: true, components: [], level:1, type:"passive", events: [
			{type: "TrueSight", trigger: "vision"},
			{type: "Blindness", trigger: "calcStats", power: -1},
			{type: "AccuracyBuff", trigger: "tick", power: 0.4},
		]},
		{name: "EnemySense", tags: ["buff", "utility"], school: "Illusion", manacost: 2, defaultOff: true, cancelAutoMove: true, costOnToggle: true, components: [], level:2, type:"passive", events: [{type: "EnemySense", trigger: "draw", dist: 12, distStealth: 6}]},
		{name: "Evasion", tags: ["buff", "utility", "defense"], sfx: "Fwoosh", school: "Illusion", manacost: 5, components: ["Legs"], mustTarget: true, level:1, type:"buff",
			buffs: [
				{id: "Evasion", type: "Evasion", labelcolor: "#a288b6", duration: 25, power: 3.0, player: true, enemies: true, maxCount: 5, tags: ["defense", "incomingHit"]},
			], onhit:"", time:25, power: 0, range: 2, size: 1, damage: ""},
	],
};
/**
 * Spells that are not in the base spell lists
 * @type {spell[]}
 */
let KinkyDungeonSpellListEnemies = [
	// A puff of smoke
	{name: "SmokePuff", school: "Illusion", manacost: 1, components: ["Verbal"], level:1, type:"inert", buffs: [
		{id: "SmokePuff", type: "Evasion", power: 3.0, player: true, enemies: true, tags: ["darkness"], range: 0.5},
		{id: "SmokePuff2", type: "Sneak", power: 3.0, player: true, duration: 1, enemies: true, tags: ["darkness"], range: 0.5}
	], onhit:"", time:5, aoe: 0.5, power: 0, delay: 2, delayRandom: 5, range: 4, size: 1, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.

	{name: "LesserInvisibility", sfx: "MagicSlash", school: "Illusion", manacost: 0, components: ["Verbal"], mustTarget: true, level:3, type:"buff", buffs: [{id: "LesserInvisibility", aura: "#888888", type: "Sneak", duration: 10, power: 3, player: true, enemies: true, tags: ["invisibility"]}], onhit:"", time:10, power: 0, range: 1.5, size: 1, damage: ""},


	// Divine Gifts
	{name: "Freedom", sfx: "Magic", hitsfx: "Struggle", school: "Conjure", manacost: 15, components: [], mustTarget: true, selfTargetOnly: true, level:5, type:"hit",
		onhit:"instant", time:4, lifetime: 1, bind: 8, delay: 1, power: 4, aoe: 2.99, range: 1.5, size: 5, damage: "chain", playerEffect: {name: "RemoveLowLevelRope"}},

	{allySpell: true, name: "BeltStrike", noise: 2, sfx: "Struggle", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, castRange: 3, nonVolatile: true, onhit:"", power: 4, delay: 0, range: 4, speed: 4, size: 1, damage: "inert",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"cast", trailChance: 1.0,
		trailcast: {spell: "SingleBelt", target: "onhit", directional:true, offset: false}},
	{allySpell: true, name: "SingleBelt", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 4, bind: 4, range: 2, size: 1, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsLeatherWeak", tags: ["leatherRestraints", "leatherRestraintsHeavy"], power: 3, damage: "chain", count: 2, noGuard: true}},
	{allySpell: true, name: "Slimethrower", landsfx: "FireSpell", manacost: 0, components: ["Legs"], level:2, type:"hit", onhit:"lingering", time: 3, range: 3.9, power: 3.5, size: 1, aoe: 1, lifetime: 1, lifetimeHitBonus: 9, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{allySpell: true, name: "Slimethrower2", landsfx: "FireSpell", manacost: 0, components: [], level:2, type:"hit", onhit:"lingering", time: 3, range: 3.9, power: 2.5, size: 1, aoe: 1, lifetime: 1, lifetimeHitBonus: 9, damage: "glue"}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{name: "SlimeSuit", sfx: "MagicSlash", school: "Illusion", manacost: 5, components: [], level:1, type:"special", special: "dress", outfit: "SlimeSuit", noMiscast: true,
		onhit:"", time:25, power: 0, range: 1.5, size: 1, damage: ""},

	{name: "SlimeForm", sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Verbal"], mustTarget: true, level:3, type:"buff", noMiscast: true,
		buffs: [
			{id: "SlimeForm", type: "glueDamageResist", aura: "#ff00ff", duration: 25, power: 0.5, player: true, enemies: false, tags: ["defense"]},
			{id: "SlimeForm2", type: "Squeeze", duration: 25, power: 0.5, player: true, enemies: false, tags: ["mobility"]},
			{id: "SlimeForm3", type: "Evasion", duration: 25, power: 0.5, player: true, enemies: false, tags: ["defense"]},
			{id: "SlimeForm4", type: "Counterattack", duration: 25, power: 2.5, player: true, enemies: false, tags: ["counter"], events: [
				{trigger: "beforeAttack", type: "CounterattackDamage", power: 2.5, damage: "glue"},
			]},
		], onhit:"", time:10, power: 0, range: 2, size: 1, damage: "",
		extraCast: [{spell: "Slimethrower2"}, {spell: "SlimeSuit"}]},


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
	{enemySpell: true, name: "EnemyCorona", minRange: 0, noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false,
		spellcast: {spell: "EnemyCoronaBeam", target: "target", directional:true, offset: false}, channel: 2},
	{enemySpell: true, name: "EnemyCoronaBeam", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, range: 8, speed: 50, size: 1, damage: "fire",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "CoronaShock", time: 3}},
	{enemySpell: true, name: "MonolithBeam", minRange: 0, noise: 4, sfx: "MagicSlash", school: "Illusion", manacost: 7, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false,
		spellcast: {spell: "MonolithBeamBeam", target: "target", directional:true, offset: false}, channel: 2},
	{enemySpell: true, name: "MonolithBeamBeam", sfx: "MagicSlash", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 6, delay: 0, range: 8, speed: 50, size: 1, damage: "chain",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "CrystalBind", time: 3}},

	{name: "BondageBust", noise: 7, sfx: "Laser", school: "Illusion", manacost: 0, components: [], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1.5, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "BondageBustBeam", target: "target", directional:true, offset: false}, noMiscast: true, channel: 1},
	{name: "BondageBustBeam", hitsfx: "Shock", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 1.5, time: 3, delay: 0, range: 8, speed: 50, size: 1, damage: "electric",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},

	{name: "CoronaBeam", sfx: "FireSpell", school: "Elements", manacost: 0, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, nonVolatile: true, onhit:"", power: 12, delay: 0, range: 8, speed: 50, size: 1, damage: "fire",
		trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
	{name: "AllyCrackle", sfx: "Shock", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0},
	{allySpell: true, name: "AllyFirebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1},
	{allySpell: true, name: "AllyShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},
	{allySpell: true, name: "HeelShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 2.5, time: 4, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},
	{allySpell: true, name: "FlameStrike", sfx: "FireSpell", school: "Element", manacost: 6, components: [], level:1, type:"inert", onhit:"aoe", noTerrainHit: true, power: 3, delay: 1, range: 1.5, size: 3, aoe: 1.5, lifetime: 1, damage: "fire"},
	{allySpell: true, name: "ShatterStrike", sfx: "MagicSlash", school: "Element", manacost: 0, components: [], level:1, type:"hit", onhit:"instant", noTerrainHit: true, power: 1.5, delay: 1, range: 1.5, time: 4, size: 3, aoe: 1.5, lifetime: 1, damage: "frost"},
	{name: "Ignition", faction: "Rage", school: "Element", manacost: 0, components: [], level:1, type:"hit", onhit:"instant", noTerrainHit: true, power: 1.5, delay: 1, range: 1.5, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "Ignition", power: 1, damage: "fire"}},
	{allySpell: true, name: "ArcaneStrike", school: "Element", manacost: 0, components: [], level:1, type:"hit", onhit:"instant", noTerrainHit: true, power: 2.5, delay: 1, range: 1.5, size: 3, aoe: 1.5, lifetime: 1, damage: "soul"},
	{enemySpell: true, name: "ShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold", playerEffect: {name: "ShadowStrike", damage: "cold", power: 4, count: 1}},

	{name: "Icicle", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 4,  power: 3, delay: 0, range: 50, damage: "frost", speed: 2, playerEffect: {name: "Damage"},
		events: [{type: "ElementalOnSlowOrBind", trigger: "bulletHitEnemy", damage: "ice", time: 3, power: 0},]},
	{name: "Boulder", sfx: "Bones", hitsfx: "HeavySwing", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 4,  power: 4, delay: 0, range: 50, damage: "crush", speed: 2, playerEffect: {name: "Damage"}}, // Throws a blast of ice which stuns the target for 4 turns


	{enemySpell: true, name: "Ribbons", color: "#6700ff", noise: 6, sfx: "Struggle", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, castRange: 3, nonVolatile: true, onhit:"", power: 3, delay: 0, range: 4, speed: 4, size: 1, damage: "inert",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"cast", trailChance: 1.0,
		trailcast: {spell: "SingleRibbon", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "SingleRibbon", color: "#6700ff", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 4, range: 2, size: 1, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRibbons", tags: ["magicRibbons"], power: 3, damage: "chain", count: 1, noGuard: true}},

	{enemySpell: true, msg: true, name: "AreaElectrify", minRange: 0, landsfx: "Shock", school: "Conjure", specialCD: 10, manacost: 10, components: ["Legs"], level:1, type:"inert", onhit:"cast", dot: true, time: 4, delay: 3, range: 2.5, size: 3, aoe: 2.5, lifetime: 1, power: 1, damage: "inert",
		spellcasthit: {spell: "WitchElectrify", target: "onhit", chance: 0.22, directional:false, offset: false}, channel: 2}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "IceDragonBreath", color: "#00ffff", sfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", time: 1, power: 4, delay: 0, range: 4, speed: 50, size: 1, damage: "inert",
		trailPower: 4, trailLifetime: 1, trailLifetimeBonus: 4, trailTime: 3, trailspawnaoe: 1.5, trailDamage:"ice", trail:"lingering", trailChance: 0.3, trailPlayerEffect: {name: "Freeze", time: 3}},
	{enemySpell: true, name: "IceDragonBreathPrepare", color: "#00ffff", minRange: 0, sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 5, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "IceDragonBreath", target: "target", directional:true, offset: false}, channel: 2},

	{enemySpell: true, name: "IceSlow", color: "#00ffff", sfx: "Freeze", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectileTargeting:true, nonVolatile: true, onhit:"", power: 1, delay: 0, time: 2, range: 4, speed: 50, size: 1, damage: "inert",
		trailPower: 4, trailLifetime: 2, trailLifetimeBonus: 8, trailTime: 3, trailspawnaoe: 1.5, trailDamage:"ice", trail:"lingering", trailChance: 0.5, trailPlayerEffect: {name: "Chill", time: 3, damage: "ice", power: 1}},
	{enemySpell: true, name: "IceSlowPrepare", color: "#00ffff", minRange: 0, sfx: "MagicSlash", school: "Illusion", manacost: 8, components: ["Arms"], projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:2, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 12, range: 5, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert",
		spellcast: {spell: "IceSlow", target: "target", directional:true, offset: false}, channel: 1},

	{enemySpell: true, name: "FlashBomb", color: "#ff2200", minRange: 0, sfx: "Miss", school: "Illusion", manacost: 3, specialCD: 12, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1, range: 4, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 3}},
	{enemySpell: true, name: "EnemyFlash", color: "#ffffff", minRange: 0, noise: 8, sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 3, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}},

	{enemySpell: true, name: "SleepGas", color: "#00ff00", sfx: "Miss", school: "Illusion", manacost: 4, specialCD: 24, components: ["Verbal"], level:1, type:"inert", passthrough: true, noTerrainHit: true, buffs: [
		{id: "SleepGas", type: "Sleepiness", power: 1, player: true, enemies: false, tags: ["sleep"], range: 1.5}], onhit:"", time:6, aoe: 1.5, power: 1, delay: 8, range: 4, size: 3, damage: "poison", playerEffect: {name: "DamageNoMsg", damage: "poison", power: 1}}, // Creates a shroud. Enemies within are hard to hit with melee attacks.

	{enemySpell: true, name: "Glue", color: "#ffff00", landsfx: "Freeze", school: "Conjure", manacost: 9, components: ["Legs"], level:1, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 1.5, lifetime: 24, power: 4, lifetimeHitBonus: 76, damage: "glue", playerEffect: {name: "Glue", count: 1, damage: "glue", power: 4, time: 1}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!

	{enemySpell: true, name: "RedSlime", sfx: "Miss", manacost: 4, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 4, delay: 0, range: 50, damage: "glue", speed: 1.5, playerEffect: {name: "DamageNoMsg", power: 4, damage: "glue"},
		spellcast: {spell: "SummonSingleRedSlime", target: "onhit", directional:false, offset: false, strict: true}},

	{enemySpell: true, name: "AmpuleBlue", sfx: "Miss", manacost: 5, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 4, delay: 0, range: 50, damage: "glue", speed: 1, playerEffect: {name: "AmpuleBlue", damage: "glue", power: 4, count: 1}},

	{enemySpell: true, name: "AmpuleGreen", sfx: "Miss", manacost: 4, specialCD: 15, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "SleepGas", target: "onhit", directional:false, offset: false}},
	{enemySpell: true, name: "AmpuleYellow", sfx: "Miss", manacost: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "Glue", target: "onhit", directional:false, offset: false}},
	{enemySpell: true, name: "AmpuleRed", sfx: "Miss", manacost: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 1, delay: 0, range: 50, damage: "crush", speed: 1, playerEffect: {name: "Ampule", damage: "inert"},
		spellcast: {spell: "SummonRedSlime", target: "onhit", directional:true, offset: false}},

	{name: "ManyOrbs", sfx: "MagicSlash", minRange: 0, manacost: 4, projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:1, type:"inert", onhit:"aoe", time: 5, delay: 3, power: 3, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false, castDuringDelay: true, noCastOnHit: true,
		spellcast: {spell: "ZombieOrbMini", target: "target", directional:true, randomDirection: true, noTargetMoveDir: true, spread: 2.5, offset: false}, channel: 3},
	{enemySpell: true, name: "ZombieOrbMini", sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "chain", speed: 1,
		playerEffect: {name: "MysticShock", time: 3}},

	{enemySpell: true, name: "ZombieOrb", sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "chain", speed: 1,
		playerEffect: {name: "CharmWraps", power: 2, damage: "ice", time: 1}},
	{enemySpell: true, name: "ZombieOrbIce", color: "#00ffff", specialCD: 12, sfx: "MagicSlash", hitsfx: "Freeze", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 3, delay: 0, range: 50, damage: "ice", speed: 1,
		playerEffect: {name: "Freeze", power: 4, damage: "ice", time: 4}},

	{enemySpell: true, name: "RopeEngulf", color: "#ff2200", sfx: "Struggle", manacost: 4, minRange: 0, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 6, range: 2, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "RopeEngulf", power: 2}},
	{enemySpell: true, name: "RopeEngulfWeak", color: "#ff2200", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 3, range: 3.5, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "RopeEngulfWeak", power: 1, damage: "chain"}},
	{enemySpell: true, name: "Entangle", color: "#88ff88", minRange: 0, sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 4, range: 6, size: 3, aoe: 1, lifetime: 1, damage: "chain", playerEffect: {name: "VineEngulf", power: 2}},
	{enemySpell: true, name: "Feathers", color: "#ffffff", sfx: "Tickle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 12, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "tickle", playerEffect: {name: "Damage"}},
	{enemySpell: true, name: "RibbonBurst", color: "#ff00ff", sfx: "MagicSlash", manacost: 5, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 4, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRibbons", tags: ["magicRibbons"], power: 3, damage: "chain", count: 2, noGuard: true}},
	{enemySpell: true, name: "Spores", color: "#6733aa", sfx: "MagicSlash", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 3, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "poison", playerEffect: {name: "Spores", power: 2, damage: "poison"}},
	{enemySpell: true, name: "SporesHappy", color: "#ff00ff", sfx: "FireSpell", noCastMsg: true, selfcast: true, manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "poison", playerEffect: {name: "SporesHappy", power: 2, damage: "poison", distraction: 10}},
	{enemySpell: true, name: "SporesSick", color: "#55ff55", noCastMsg: true, hitsfx: "DamageWeak", selfcast: true, manacost: 0, components: ["Verbal"], level:1, type:"hit", onhit:"aoe", time: 5, delay: 0, power: 1, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "poison", playerEffect: {name: "SporesSick", power: 2, damage: "poison"}},
	{enemySpell: true, name: "SoulCrystalBind", color: "#ff5277", minRange: 0, sfx: "Evil", manacost: 7, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 2, power: 6, range: 6, size: 3, aoe: 1.5, lifetime: 1, damage: "drain", playerEffect: {name: "ObsidianEngulf", count: 1, power: 6, damage: "drain"}},

	{enemySpell: true, name: "MinerBomb", color: "#ff2200", selfcast: true, noise: 5, sfx: "FireSpell", hitsfx: "FireSpell", school: "Conjure", manacost: 5, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 5, power: 6, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "HeatBlast", time: 3, damage: "pain", power: 6}},

	{name: "ManyChains", sfx: "MagicSlash", minRange: 0, manacost: 3, projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:1, type:"inert", onhit:"aoe", time: 5, delay: 3, power: 3, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false, castDuringDelay: true, noCastOnHit: true,
		spellcast: {spell: "WitchChainBolt", target: "target", directional:true, randomDirection: true, noTargetMoveDir: true, spread: 1, offset: false}, channel: 3},

	{enemySpell: true, name: "WitchChainBolt", color: "#ffffff", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", bind: 12, time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "MagicChain", color: "#ff00ff", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleMagicChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "BanditBola", color: "#ff2200", sfx: "Miss", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 3, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "BanditBola"}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "WitchRope", color: "#ff2200", sfx: "Miss", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 2, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleRope"}},
	{allySpell: true, name: "PlayerBola", color: "#ff2200", noMiscast: true, sfx: "Miss", manacost: 0, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 4, power: 3, bind: 9, delay: 0, range: 50, damage: "chain", speed: 2, playerEffect: {name: "BanditBola", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "RestrainingDevice", color: "#19fac1", sfx: "Miss", manacost: 6, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "RestrainingDevice", count: 3, time: 3, power: 5, damage: "crush"}},
	{enemySpell: true, name: "MummyBolt", color: "#88ff88", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "MysticShock", time: 3}},
	{enemySpell: true, name: "RobotBolt", color: "#ff5277", minRange: 0, sfx: "Laser", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "electric", speed: 1, playerEffect: {name: "RobotShock", time: 2}},
	{enemySpell: true, name: "RubberBullets", color: "#ffff00", minRange: 2.9, sfx: "Gunfire", manacost: 2, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "glue", speed: 2, playerEffect: {name: "RubberBullets", power: 4, count: 1, damage: "glue"}},
	{enemySpell: true, name: "HeatBolt", color: "#ffff00", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "HeatBlast", time: 1, damage: "pain", power: 5}},
	{enemySpell: true, noFirstChoice: true, name: "Hairpin", color: "#ffffff", minRange: 2.9, sfx: "Miss", manacost: 2, castRange: 6, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "pain", speed: 2, playerEffect: {name: "Hairpin", power: 2, damage: "pain", time: 1}},
	{enemySpell: true, name: "PoisonDragonBlast", color: "#88ff88", sfx: "FireSpell", hitsfx: "Bones", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "grope", speed: 1, playerEffect: {name: "VineEngulf", power: 2}},
	{enemySpell: true, name: "ElfArrow", color: "#88ff88", sfx: "Miss", hitsfx: "FireSpell", manacost: 3, components: ["Arms"], level: 1, type:"bolt", projectileTargeting:true, onhit:"", power: 2, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "EnchantedArrow", power: 2, count: 1}},
	{enemySpell: true, name: "ShadowOrb", color: "#8833ff", minRange: 2.9, sfx: "MagicSlash", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 5, damage: "inert", speed: 2, playerEffect: {name: ""},
		spellcast: {spell: "ShadowScythe", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "ShadowScythe", color: "#0000ff", sfx: "MagicSlash", manacost: 4, components: ["Verbal"], level:1, type:"inert", noTerrainHit: true, onhit:"aoe", time: 5, delay: 1, power: 6, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "ShadowBind", time: 4}},
	{enemySpell: true, name: "WitchSlime", color: "#ff00ff", minRange: 0, landsfx: "MagicSlash", manacost: 7, components: ["Legs"], level:2, type:"inert", onhit:"lingering", time: 2, delay: 1, range: 4, power: 2, size: 3, aoe: 1, lifetime: 1, lifetimeHitBonus: 9, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{enemySpell: true, name: "WitchSlimeBall", color: "#ff00ff", sfx: "FireSpell", manacost: 6, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", time: 2,  power: 2, delay: 0, range: 50, damage: "glue", speed: 1, trailLifetime: 10, trailDamage:"glue", trail:"lingering", trailPower: 2, trailChance: 1.0, playerEffect: {name: "Slime", time: 3}}, // Throws a ball of slime which oozes more slime
	{enemySpell: true, name: "SlimePuddle", color: "#ff00ff", sfx: "FireSpell", manacost: 3, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"lingering", time: 2, power: 2, lifetime: 5, lifetimeHitBonus: 5, aoe: 1.5, delay: 0, range: 50, damage: "glue", speed: 1, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime

	{enemySpell: true, name: "MiniSlime", color: "#ff00ff", sfx: "MagicSlash", landsfx: "MagicSlash", manacost: 1, level:1, type:"bolt", projectileTargeting:true, onhit:"", time: 2, power: 2, delay: 0, range: 50, damage: "glue", speed: 1, playerEffect: {name: "MiniSlime", time: 2}}, // Throws a ball of slime which oozes more slime
	{name: "ManySlimes", sfx: "MagicSlash", minRange: 0, manacost: 4, projectileTargeting: true, noTargetPlayer: true, CastInWalls: true, level:1, type:"inert", onhit:"aoe", time: 5, delay: 3, power: 3, range: 8, meleeOrigin: true, size: 1, lifetime: 1, damage: "inert", noMiscast: false, castDuringDelay: true, noCastOnHit: true,
		spellcast: {spell: "MiniSlime", target: "target", directional:true, randomDirection: true, noTargetMoveDir: true, spread: 1, offset: false}, channel: 3},

	// Bandit trader
	{enemySpell: true, name: "PoisonDagger", color: "#ff00ff", minRange: 1.5, sfx: "Miss", manacost: 2, castRange: 6, components: ["Arms"], level:1, speed: 1,
		type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 50, damage: "poison", playerEffect: {name: "PoisonDagger", power: 4, type: "poison", time: 8},},
	{enemySpell: true, name: "LustBomb", color: "#ff5277", minRange: 0, sfx: "Miss", school: "Illusion", manacost: 2, specialCD: 12, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 6, range: 4, size: 3, aoe: 1.5, lifetime: 1, damage: "happygas", playerEffect: {name: "LustBomb", damage: "happygas", power: 24 }},

	// Fungal spells
	{enemySpell: true, name: "CrystalPuff", color: "#b37bdc", minRange: 0, landsfx: "MagicSlash", manacost: 4, components: ["Arms"], level:1, type:"inert", onhit:"aoe", power: 3.5, time: 1, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "souldrain", playerEffect: {name: "CrystalBind", time: 1}},
	{enemySpell: true, name: "HighBolt", color: "#8888ff", sfx: "MagicSlash", manacost: 3, specialCD: 7, components: ["Arms"], level:1, type:"bolt", projectileTargeting:true, onhit:"",
		power: 6, delay: 0, range: 50, damage: "poison", speed: 1, playerEffect: {name: "Flummox", time: 1, damage: "poison", power: 6}},

	// Shockwitch spells
	{enemySpell: true, name: "WitchElectrify", color: "#8888ff", minRange: 0, landsfx: "Shock", manacost: 3, components: ["Arms"], level:2, type:"inert", onhit:"aoe", power: 3.5, time: 1, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
	{enemySpell: true, name: "WitchElectricOrb", color: "#8888ff", sfx: "MagicSlash", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectileTargeting:true, onhit:"", power: 4, delay: 0, range: 5, damage: "inert", speed: 1, playerEffect: {name: ""},
		spellcast: {spell: "WitchElectricBurst", target: "onhit", directional:true, offset: false}},
	{enemySpell: true, name: "WitchElectricBurst", sfx: "Shock", manacost: 4, components: ["Verbal"], level:1, type:"hit", noTerrainHit: true, onhit:"aoe", time: 5, delay: 1, power: 4, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}},

	{enemySpell: true, name: "SummonSlimeMold", noSprite: true, minRange: 0, sfx: "Bones", manacost: 8, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "SlimeMold", count: 1, strict: true}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},

	{enemySpell: true, name: "SummonSkeleton", landsfx: "Bones", minRange: 0, manacost: 8, components: ["Verbal"], level:3, type:"inert", onhit:"summon", summon: [{name: "SummonedSkeleton", count: 1, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 4, size: 3, aoe: 2.1, lifetime: 1, damage: "inert"},
	{enemySpell: true, name: "SummonSkeletons", landsfx: "Bones", minRange: 0, manacost: 18, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "SummonedSkeleton", count: 4, time: 16, strict: true}], power: 0, time: 16, delay: 1, range: 4, size: 3, aoe: 2.6, lifetime: 1, damage: "inert"},
	{enemySpell: true, name: "SummonZombies", landsfx: "Bones", specialCD:16, minRange: 0, manacost: 4, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "SummonedZombie", count: 4, strict: true, minRange: 1.5}], power: 0, time: 16, delay: 1, range: 4, size: 3, aoe: 4.6, lifetime: 1, damage: "inert"},
	{enemySpell: true, name: "RopeAttack", hitsfx: "Struggle", manacost: 6, components: ["Verbal"], level:4, type:"hit", onhit:"null", noSprite: true, noSumMsg: true, summon: [
		{name: "LearnedRope", count: 1, chance: 0.5, time: 20, strict: true},
		{name: "UnforseenRope", count: 1, chance: 0.5, time: 20, strict: true}
	], power: 0, time: 12, delay: 1, range: 8, size: 3, aoe: 10, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonCrystals", noSprite: true, minRange: 0, landsfx: "Freeze", manacost: 12, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "ChaoticCrystal", count: 3, time: 10}], power: 0, time: 10, delay: 1, range: 40, size: 1, aoe: 2, lifetime: 1, damage: "inert"},
	{enemySpell: true, name: "SummonChainWalls", noSprite: true, minRange: 0, landsfx: "MagicSlash", manacost: 2, specialCD: 12, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "ChainWall", count: 3, time: 0}], power: 0, time: 10, delay: 1, range: 40, size: 1, aoe: 3.5, lifetime: 1, damage: "inert"},
	{enemySpell: true, name: "SummonTickleHand", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "TickleHand", count: 3, time: 12}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonMikoGhosts", noSprite: true, minRange: 0, specialCD: 20, sfx: "MagicSlash", manacost: 4, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "MikoGhost", count: 8, minRange: 8}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 3, aoe: 12.9, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonSingleTickleHand", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "TickleHand", count: 1, time: 12}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonEnemyGag", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "Gag", count: 1, time: 12}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonCuffs", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "Cuffs", count: 1, time: 12}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonLock", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 6, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "Lock", count: 1, time: 12}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 3, aoe: 2.6, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonRedSlime", noSprite: true, minRange: 0, sfx: "Freeze", manacost: 8, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "RedSlime", count: 1, time: 12, strict: true}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 1, aoe: 2, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonSingleRedSlime", noSprite: true, minRange: 0, sfx: "Freeze", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "RedSlime", count: 1, time: 12, strict: true}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "SummonLatexElemental", noSprite: true, sfx: "MagicSlash", manacost: 6, specialCD: 40, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "ElementalLatex", count: 1, time: 28}], power: 0, damage: "inert", time: 12, delay: 1, range: 0.5, size: 1, aoe: 1.5, lifetime: 1, speed: 1, playerEffect: {}},
	{enemySpell: true, name: "MirrorImage", noSprite: true, minRange: 0, selfcast: true, sfx: "FireSpell", manacost: 12, components: ["Verbal"], level:4, castRange: 50, type:"inert", onhit:"summon", summon: [{name: "MaidforceStalkerImage", count: 1, time: 12}], power: 0, time: 12, delay: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "inert",
		spellcast: {spell: "DarkShroud", target: "origin", directional:false, offset: false}},

	{enemySpell: true, name: "SummonBookChain", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookChain", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookNature", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 8, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookNature", count: 2, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookElectric", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 8, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookElectric", count: 1, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookIce", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookIce", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookCelestial", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookCelestial", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookArcane", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookArcane", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookForbidden", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 12, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookForbidden", count: 3, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},
	{enemySpell: true, name: "SummonBookSlime", noSprite: true, minRange: 0, sfx: "MagicSlash", manacost: 8, components: ["Verbal"], level:4, projectileTargeting:true, castRange: 50, type:"bolt", onhit:"summon", summon: [{name: "BookSlime", count: 2, time: 12, strict: true}], power: 0, time: 12, delay: 1, range: 0.5, size: 3, aoe: 3, lifetime: 1, speed: 1},

	{enemySpell: true, selfcast: true, buff: true, minRange: 0, name: "ArmorUp", sfx: "Bones", school: "Elements", manacost: 8, components: ["Arms"], mustTarget: true, level:1, type:"buff", buffs: [{id: "ArmorUp", type: "Armor", duration: 6, power: 1.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:6, power: 0, range: 2, size: 1, damage: ""},
	{enemySpell: true, selfcast: true, buff: true, minRange: 0, name: "ArmorUpArea", sfx: "MagicSlash", school: "Elements", manacost: 8, components: ["Arms"], mustTarget: true, level:1,
		type:"buff", buffs: [{id: "ArmorUpArea", type: "Armor", duration: 6, power: 2.0, player: true, enemies: true, tags: ["defense", "armor"]}], onhit:"", time:6, power: 0, range: 2.9, aoe: 2.9, size: 1, damage: ""},
	{enemySpell: true, buff: true, name: "ParasolBuff", minRange: 0, sfx: "MagicSlash", school: "Elements", manacost: 4, components: ["Arms"], mustTarget: true, level:3, type:"buff",
		buffs: [
			{id: "ParasolBuff", type: "Armor", duration: 5, power: 1.0, player: true, enemies: true, tags: ["defense", "armor"]},
			{id: "ParasolBuff2", type: "Evasion", duration: 5, power: 0.33, player: true, enemies: true, tags: ["defense", "evasion"]},
			{id: "ParasolBuff3", type: "SpellResist", duration: 5, power: 1.0, player: true, enemies: true, tags: ["defense", "spellresist"]},
		], onhit:"", time:5, power: 0, range: 6, size: 1, damage: ""},
	{enemySpell: true, buff: true, name: "ZombieBuff", minRange: 0, sfx: "MagicSlash", school: "Elements", manacost: 4, components: ["Arms"], mustTarget: true, level:3, type:"buff", filterTags: ["zombie", "mummy"],
		buffs: [
			{id: "ZombieBuff", type: "Armor", duration: 8, power: 2.0, player: false, enemies: true, tags: ["defense", "armor"]},
			{id: "ZombieBuff2", type: "MoveSpeed", duration: 8, power: 2.1, player: false, enemies: true, tags: ["offense", "speed"]},
		], onhit:"", time:5, power: 0, range: 6, size: 1, damage: ""},
	{enemySpell: true, buff: true, heal: true, name: "OrbHeal", minRange: 0, sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Arms"], mustTarget: true, level:3, type:"hit",
		onhit:"heal", time:2, lifetime: 1, delay: 1, power: 2, aoe: 1.5, range: 8, size: 3, damage: "inert"},
	{enemySpell: true, name: "Earthfield", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Earthfield", type: "Armor", power: 2.0, player: false, enemies: true, noAlly: true, tags: ["armor", "defense"], range: 1.5}], onhit:"", time:6, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Earthrune", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Earthfield", type: "Armor", power: 2.0, player: true, enemies: true, onlyAlly: true, tags: ["armor", "defense"], range: 1.5}], onhit:"", time:9, aoe: 1.5, power: 0, delay: 9, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
	{name: "Icerune", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 5, power: 4, lifetimeHitBonus: 3, damage: "ice"}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{name: "Waterrune", selfcast: true, sfx: "Bones", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert",
		buffs: [
			{id: "WaterRune", type: "magicDamageResist", power: 1.0, player: true, enemies: true, onlyAlly: true, tags: ["spellresist", "defense"], range: 1.5},
			{id: "WaterRune2", type: "MoveSpeed", power: -1.0, player: false, enemies: true, noAlly: true, tags: ["slow", "debuff"], range: 1.5},
		], onhit:"", time:9, aoe: 1.5, power: 0, delay: 9, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.

	{enemySpell: true, name: "TrapCharmWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsCharmWeak", tags: ["ribbonRestraints"], count: 4}},
	{enemySpell: true, name: "TrapRibbons", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 4, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRibbons", tags: ["magicRibbons"], count: 3}},
	{enemySpell: true, name: "TrapShackleWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsShackleWeak", tags: ["shackleRestraints"], count: 2}},
	{enemySpell: true, name: "TrapMummyWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsMummyWeak", tags: ["mummyRestraints"], count: 2}},
	{enemySpell: true, name: "TrapRopeWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRopeWeak", tags: ["ropeMagicWeak", "clothRestraints"], count: 3}},
	{enemySpell: true, name: "TrapRopeStrong", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsRopeStrong", tags: ["ropeMagicStrong", "ropeAuxiliary", "clothRestraints", "tapeRestraints"], count: 4}},
	{enemySpell: true, name: "TrapLeatherWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsLeatherWeak", tags: ["leatherRestraints", "leatherRestraintsHeavy"], count: 3}},
	{enemySpell: true, name: "TrapCableWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsCableWeak", tags: ["hitechCables"], count: 3}},
	{enemySpell: true, name: "TrapSlimeWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "glue", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsSlimeWeak", tags: ["slimeRestraints"], count: 2}},
	{enemySpell: true, name: "TrapMagicChainsWeak", sfx: "Struggle", manacost: 4, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "chain", playerEffect: {name: "TrapBindings", text: "KinkyDungeonTrapBindingsMagicChainsWeak", tags: ["chainRestraintsMagic"], count: 3}},
	{enemySpell: true, name: "TrapSleepDart", sfx: "Gunfire", manacost: 1, components: [], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "pain", speed: 2, playerEffect: {name: "TrapSleepDart", power: 5}},
	{enemySpell: true, name: "TrapLustCloud", sfx: "Freeze", manacost: 1, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "glue", playerEffect: {name: "TrapLustCloud", damage: "happygas", power: 30 }},
	{enemySpell: true, name: "TrapSCloud", sfx: "Freeze", manacost: 1, components: [], level:1, type:"inert", onhit:"aoe", passthrough: true, noTerrainHit: true, time: 5, delay: 1, power: 3, range: 2, size: 3, aoe: 1.5, lifetime: 1, damage: "glue", playerEffect: {name: "TrapSPCloud", damage: "pain", power: 72 }},
	{enemySpell: true, name: "SleepDart", sfx: "Miss", manacost: 1, components: [], level:1, type:"bolt", projectileTargeting:true, onhit:"", power: 4, time: 0, delay: 0, range: 50, damage: "pain", speed: 1, playerEffect: {name: "TrapSleepDart", power: 5}},
];
