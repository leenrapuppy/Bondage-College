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

];

let KinkyDungeonSpellLevel = {
	"Elements":1,
	"Conjure":1,
	"Illusion":1,
};
let KinkyDungeonLearnableSpells = [
	//Page 1
	[
		// Verbal
		["Electrify", "Flash", "Shroud", "Ally",],
		// Arms
		["Firebolt", "Icebolt", "ChainBolt", "SlimeBall", "Dagger"],
		// Legs
		["Shield", "Snare", "Wall", ],
	],

	//Page 2
	[
		// Verbal
		["Incinerate", "IceBreath", "Bomb", "FireElemental", "Blink", "GreaterFlash", "ShadowWarrior"],
		// Arms
		["Crackle", "ShadowSlash", "ShadowBlade"],
		// Legs
		["GreaterShield", "Slime", "StormCrystal", "Decoy", ],
	],

	//Page 3
	[
		// Verbal
		["FocusedFlash", "Invisibility",],
		// Arms
		["Fireball", "LightningBolt", ],
		// Legs
		["Golem", "Leap", ],
	],

	//Page 4
	[
		["SPUp1","SPUp2","SPUp3"],
		["MPUp1","MPUp2","MPUp3"],
		["APUp1","APUp2","APUp3"],
	],
];

let KinkyDungeonSpellPoints = 3;

let KinkyDungeonSpellChoices = [0, 1, 2];
let KinkyDungeonSpellChoiceCount = 3;
let KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. When you plan to use a mystic seal, you get 3 spells to choose from.
	"Elements": [
		{name: "SPUp1", school: "Elements", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp2", school: "Elements", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "SPUp3", school: "Elements", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Incinerate", sfx: "FireSpell", school: "Elements", manacost: 10, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 1, power: 2, range: 2.5, size: 3, aoe: 1.5, lifetime: 6, damage: "fire", playerEffect: {name: "Damage"}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
		{name: "Firebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 2, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Fireball", sfx: "FireSpell", school: "Elements", manacost: 10, components: ["Arms"], level:3, type:"bolt", projectile:true, onhit:"aoe", power: 6, delay: 0, range: 50, aoe: 1.5, size: 3, lifetime:1, damage: "fire", speed: 1, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Icebolt", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", time: 10,  power: 2, delay: 0, range: 50, damage: "ice", speed: 3, playerEffect: {name: "Damage"}}, // Throws a blast of ice which stuns the target for 4 turns
		{name: "Electrify", sfx: "FireSpell", school: "Elements", manacost: 7, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 8, time: 4, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
		{name: "Crackle", sfx: "FireSpell", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectile:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
			trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0, playerEffect: {name: "Shock", time: 1}},
		{name: "Shield", sfx: "MagicSlash", school: "Elements", manacost: 1, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", block: 10, onhit:"", power: 0, delay: 2, range: 1.5, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 1 turn
		{name: "GreaterShield", sfx: "MagicSlash", school: "Elements", manacost: 2, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", block: 20, onhit:"", power: 0, delay: 8, range: 2, size: 1, damage: ""}, // Creates a shield that blocks projectiles for 5 turns
		{name: "IceBreath", sfx: "MagicSlash", hitsfx: "Freeze", school: "Elements", manacost: 8, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 1, range: 3, size: 3, aoe: 1.5, lifetime: 10, power: 5, lifetimeHitBonus: 5, damage: "ice", playerEffect: {name: "Damage"}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		{name: "LightningBolt", sfx: "FireSpell", school: "Elements", manacost: 10, components: ["Arms"], level:3, type:"bolt", piercing: true, projectile:true, nonVolatile: true, onhit:"", power: 8, delay: 0, time: 1, range: 50, speed: 50, size: 1, damage: "electric",
			trailHit: "", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1, playerEffect: {name: "Shock", time: 3}},
	],
	"Conjure": [
		{name: "MPUp1", school: "Conjure", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp2", school: "Conjure", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "MPUp3", school: "Conjure", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Bomb", sfx: "FireSpell", school: "Conjure", manacost: 6, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", delay: 6, power: 8, range: 3, size: 3, aoe: 1.5, lifetime: 1, damage: "fire", playerEffect: {name: "Damage"}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
		{name: "Snare", sfx: "FireSpell", school: "Conjure", manacost: 2, components: ["Legs"], noTargetEnemies: true, level:1, type:"inert", onhit:"lingering", lifetime:9999, time: 12, delay: 5, range: 1, damage: "stun", playerEffect: {name: "MagicRope", time: 3}}, // Creates a magic rope trap that creates magic ropes on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
		{name: "Slime", landsfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Legs"], level:2, type:"inert", onhit:"lingering", time: 4, delay: 1, range: 4, size: 3, aoe: 2, lifetime: 3, power: 4, lifetimeHitBonus: 20, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
		//{name: "PinkGas", manacost: 4, components: ["Verbal"], level:2, type:"inert", onhit:"lingering", time: 1, delay: 2, range: 4, size: 3, aoe: 2.5, lifetime: 9999, damage: "stun", playerEffect: {name: "PinkGas", time: 3}}, // Dizzying gas, increases arousal
		{name: "ChainBolt", sfx: "FireSpell", school: "Conjure", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", time: 6,  power: 2, delay: 0, range: 50, damage: "chain", speed: 2, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
		{name: "SlimeBall", sfx: "FireSpell", school: "Conjure", manacost: 6, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", time: 3,  power: 8, delay: 0, range: 50, damage: "glue", speed: 1,
			trailPower: 4, trailLifetime: 10, trailTime: 3, trailDamage:"glue", trail:"lingering", trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
		{name: "Leap", sfx: "Teleport", school: "Conjure", manacost: 8, components: ["Legs"], noTargetEnemies: true, level:3, type:"inert", onhit:"teleport", delay: 1, lifetime:1, range: 5, damage: ""}, // A quick blink which takes effect instantly, but requires legs to be free
		{name: "Blink", sfx: "Teleport", school: "Conjure", manacost: 4, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"teleport", delay: 3, lifetime:1, range: 3, damage: ""}, // A slow blink with short range, but it uses verbal components
		{name: "Wall", sfx: "MagicSlash", school: "Conjure", manacost: 6, components: ["Legs"], noTargetEnemies: true, noTargetPlayer: true, level:1, type:"inert", onhit:"summon", summon: [{name: "Wall", count: 1, time: 10}], power: 0, time: 10, delay: -1, range: 6, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Ally", sfx: "MagicSlash", school: "Conjure", manacost: 8, components: ["Verbal"], noTargetEnemies: true, level:1, type:"inert", onhit:"summon", summon: [{name: "Ally", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "FireElemental", sfx: "MagicSlash", school: "Conjure", manacost: 20, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "FireElemental", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 3.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "Golem", sfx: "MagicSlash", school: "Conjure", manacost: 24, components: ["Legs"], noTargetEnemies: true, level:3, type:"inert", onhit:"summon", summon: [{name: "Golem", count: 1, time: 9999}], power: 0, time: 9999, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "StormCrystal", sfx: "MagicSlash", school: "Conjure", manacost: 14, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "StormCrystal", count: 1, time: 30}], power: 0, time: 30, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
	],
	"Illusion": [
		{name: "APUp1", school: "Illusion", manacost: 0, components: [], level:2, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp2", school: "Illusion", manacost: 0, components: [], level:3, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "APUp3", school: "Illusion", manacost: 0, components: [], level:4, passive: true, type:"", onhit:"", time: 0, delay: 0, range: 0, lifetime: 0, power: 0, damage: "inert"},
		{name: "Dagger", sfx: "MagicSlash", school: "Illusion", manacost: 1, components: ["Arms"], level:1, type:"bolt", projectile:true, piercing: true, onhit:"", power: 1, time: 0, delay: 0, range: 10, damage: "cold", speed: 4, playerEffect: {name: "Damage"}}, // Throws a fireball in a direction that moves 1 square each turn
		{name: "Flash", sfx: "FireSpell", school: "Illusion", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 4}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
		{name: "GreaterFlash", sfx: "FireSpell", school: "Illusion", manacost: 6, components: ["Verbal"], level:2, type:"inert", onhit:"aoe", time: 8, delay: 1, power: 1, range: 2.5, size: 5, aoe: 2.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 5}}, // Much greater AoE. Careful not to get caught!
		{name: "FocusedFlash", sfx: "FireSpell", school: "Illusion", manacost: 12, components: ["Verbal"], level:3, type:"inert", onhit:"aoe", time: 20, delay: 2, power: 1, range: 2.5, size: 3, aoe: 1.5, lifetime: 1, damage: "stun", playerEffect: {name: "Blind", time: 12}}, // Longer delay, but the stun lasts much longer.
		{name: "Shroud", sfx: "FireSpell", school: "Illusion", manacost: 5, components: ["Verbal"], level:1, type:"inert", buffs: [{id: "Shroud", type: "Evasion", power: 3.0, player: true, enemies: true, tags: ["darkness"], range: 1.5}, {type: "Sneak", power: 3.0, player: true, enemies: false, tags: ["darkness"], range: 1.5}], onhit:"", time:8, aoe: 1.5, power: 0, delay: 8, range: 4, size: 3, damage: ""}, // Creates a shroud. Enemies within are hard to hit with melee attacks.
		{name: "Invisibility", sfx: "FireSpell", school: "Illusion", manacost: 9, components: ["Verbal"], mustTarget: true, level:3, type:"buff", buffs: [{id: "Invisibility", type: "Sneak", duration: 10, power: 10.0, player: true, enemies: true, tags: ["invisibility"]}], onhit:"", time:10, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowBlade", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Arms"], mustTarget: true, level:2, type:"buff", buffs: [{id: "ShadowBlade", type: "AttackDmg", duration: 10, power: 2.0, player: true, enemies: true, tags: ["attack", "damage"]}], onhit:"", time:10, power: 0, range: 2, size: 1, damage: ""},
		{name: "ShadowSlash", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Arms"], level:2, type:"bolt", projectile:true, piercing: true, noTerrainHit: true, noEnemyCollision: true, onhit:"aoe", power: 5, delay: 0, range: 1.5, aoe: 1.5, size: 3, lifetime:1, damage: "cold", speed: 1, time: 2,
			trailspawnaoe: 1.5, trailPower: 0, trailLifetime: 1.1, trailHit: "", trailDamage:"inert", trail:"lingering", trailChance: 0.4},
		{name: "Decoy", sfx: "MagicSlash", school: "Illusion", manacost: 6, components: ["Legs"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "Decoy", count: 1, time: 20}], power: 0, time: 20, delay: -1, range: 4, size: 1, aoe: 0, lifetime: 1, damage: "fire"},
		{name: "ShadowWarrior", sfx: "MagicSlash", school: "Illusion", manacost: 12, components: ["Verbal"], noTargetEnemies: true, level:2, type:"inert", onhit:"summon", summon: [{name: "ShadowWarrior", count: 1, time: 14}], power: 6, time: 14, delay: -1, range: 2.5, size: 1, aoe: 0, lifetime: 1, damage: "inert"},
	],
};
let KinkyDungeonSpellListEnemies = [
	{name: "AllyCrackle", sfx: "FireSpell", school: "Elements", manacost: 4, components: ["Arms"], level:2, type:"bolt", piercing: true, projectile:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric",
		trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0},
	{name: "AllyFirebolt", sfx: "FireSpell", school: "Elements", manacost: 3, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1}, // Throws a fireball in a direction that moves 1 square each turn
	{name: "AllyShadowStrike", sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"}, // A series of light shocks incapacitate you
	{enemySpell: true, name: "RopeEngulf", sfx: "Struggle", manacost: 4, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", time: 5, delay: 1, power: 0, range: 2, size: 3, aoe: 1, lifetime: 1, damage: "grope", playerEffect: {name: "RopeEngulf", power: 2}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
	{enemySpell: true, name: "WitchChainBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", time: 6,  power: 6, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "SingleChain", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "BanditBola", sfx: "Miss", manacost: 5, components: ["Arms"], level:1, type:"bolt", projectile:true, onhit:"", time: 1,  power: 3, delay: 0, range: 50, damage: "chain", speed: 1, playerEffect: {name: "BanditBola", time: 1}}, // Throws a chain which stuns the target for 1 turn
	{enemySpell: true, name: "MummyBolt", sfx: "FireSpell", manacost: 5, components: ["Arms"], level:2, type:"bolt", projectile:true, onhit:"", power: 4, delay: 0, range: 50, damage: "fire", speed: 1, playerEffect: {name: "MysticShock", time: 3}},
	{enemySpell: true, name: "WitchSlime", landsfx: "MagicSlash", manacost: 2, components: ["Legs"], level:2, type:"inert", onhit:"lingering", time: 2, delay: 1, range: 4, size: 3, aoe: 1, lifetime: 1, lifetimeHitBonus: 9, damage: "glue", playerEffect: {name: "SlimeTrap", time: 3}}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{enemySpell: true, name: "WitchSlimeBall", sfx: "FireSpell", manacost: 4, components: ["Arms"], level:2, type:"bolt", projectile:true, onhit:"", time: 2,  power: 2, delay: 0, range: 50, damage: "glue", speed: 1, trailLifetime: 10, trailDamage:"glue", trail:"lingering", trailChance: 1.0, playerEffect: {name: "SlimeTrap", time: 3}}, // Throws a ball of slime which oozes more slime
	{enemySpell: true, name: "WitchElectrify", landsfx: "FireSpell", manacost: 3, components: ["Arms"], level:2, type:"inert", onhit:"aoe", power: 5, time: 1, delay: 1, range: 4, size: 1, aoe: 0.75, lifetime: 1, damage: "electric", playerEffect: {name: "Shock", time: 1}}, // A series of light shocks incapacitate you
	{enemySpell: true, name: "SummonSkeleton", sfx: "Bones", landsfx: "Bones", manacost: 4, components: ["Verbal"], level:3, type:"inert", onhit:"summon", summon: [{name: "LesserSkeleton", count: 1, time: 12}], power: 0, time: 12, delay: 1, range: 4, size: 3, aoe: 2.1, lifetime: 1, damage: "fire"},
	{enemySpell: true, name: "SummonSkeletons", sfx: "Bones", landsfx: "Bones", manacost: 12, components: ["Verbal"], level:4, type:"inert", onhit:"summon", summon: [{name: "LesserSkeleton", count: 4, time: 12}], power: 0, time: 12, delay: 1, range: 4, size: 3, aoe: 2.6, lifetime: 1, damage: "fire"},
];

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
	for (let key in KinkyDungeonSpellList) {
		let list = KinkyDungeonSpellList[key];
		let spell = KinkyDungeonSearchSpell(list, name);
		if (spell) return spell;
	}
	return KinkyDungeonSearchSpell(KinkyDungeonSpells, name);
}

let KinkyDungeonSpellPress = 0;

function KinkyDungeonResetMagic() {
	KinkyDungeonSpellChoices = [0, 1, 2];
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
	let sfx = spell.hitsfx;
	if (!sfx) sfx = "Damage";
	if (damage == "inert") return;
	if (!playerEffect.chance || Math.random() < playerEffect.chance) {
		if (playerEffect.name == "Damage") {
			let dmg = KinkyDungeonDealDamage({damage: Math.max((spell.aoepower) ? spell.aoepower : 0, spell.power), type: spell.damage});
			KinkyDungeonSendTextMessage(Math.min(spell.power, 5), TextGet("KinkyDungeonDamageSelf").replace("DamageDealt", dmg), "red", 1);
		} else if (playerEffect.name == "Blind") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonBlindSelf"), "red", playerEffect.time);
		} else if (playerEffect.name == "MagicRope") {
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WeakMagicRopeArms"));
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("WeakMagicRopeLegs"));
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMagicRopeSelf"), "red", playerEffect.time);
		} else if (playerEffect.name == "SlimeTrap") {
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StickySlime"));
			KinkyDungeonMovePoints = -1;
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlime"), "red", playerEffect.time);

			if (spell.power > 0) {
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			}
		} else if (playerEffect.name == "Shock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonShock"), "red", playerEffect.time);
		} else if (playerEffect.name == "MysticShock") {
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, playerEffect.time);
			KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonMysticShock"), "red", playerEffect.time);
		} else if (playerEffect.name == "SingleChain") {
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["chainRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleChain"), "red", playerEffect.time);
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			}

		} else if (playerEffect.name == "SingleRope" || playerEffect.name == "BanditBola") {
			if (playerEffect.name == "BanditBola") {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
			}
			let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSingleRope"), "red", playerEffect.time);
			} else {
				KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonSlowedBySpell"), "yellow", playerEffect.time);
				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			}

		} else if (playerEffect.name == "RopeEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({tags: ["ropeMagicStrong", "ropeAuxiliary", "clothRestraints", "tapeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) added.push(restraintAdd);
			}
			if (added.length > 0) {
				KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonRopeEngulf"), "red", 2);
			} else {
				let RopeDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)]);
					KinkyDungeonDressPlayer();
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRopeEngulfDress"), "red", 3);
				} else KinkyDungeonSetFlag("kraken", 10);
			}
		}
	}

	if (sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
}

function KinkyDungeoCheckComponents(spell) {
	let failedcomp = [];
	if (spell.components.includes("Verbal") && !KinkyDungeonPlayer.CanTalk()) failedcomp.push("Verbal");
	if (spell.components.includes("Arms") && (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemArms"))) failedcomp.push("Arms");
	if (spell.components.includes("Legs") && (!KinkyDungeonPlayer.CanWalk() || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Block", true) || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "KneelFreeze", true))) failedcomp.push("Legs");

	return failedcomp;
}

function KinkyDungeonHandleSpellChoice(SpellChoice) {
	let spell = null;
	if (KinkyDungeoCheckComponents(KinkyDungeonSpells[SpellChoice]).length == 0) {
		if (KinkyDungeonHasMana(KinkyDungeonSpells[SpellChoice].manacost))
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
	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[0]].passive && (MouseIn(1230, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[0])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[0]);
	} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[1]].passive && (MouseIn(1480, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[1])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[1]);
	} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[2]].passive && (MouseIn(1730, 895, 90, 90) || KinkyDungeonSpellPress == KinkyDungeonKeySpell[2])) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[2]);
	}
	if (spell) {
		// Handle spell activation
		KinkyDungeonTargetingSpell = spell;
		KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellTarget" + spell.name).replace("SpellArea", "" + Math.floor(spell.aoe)), "white", 1);
		return true;
	}
	return false;
}


function KinkyDungeonGetCost(Spell) {
	let cost = Spell.level;
	return cost;
}

function KinkyDungeonCastSpell(targetX, targetY, spell, enemy, player) {
	let entity = KinkyDungeonPlayerEntity;
	let moveDirection = KinkyDungeonMoveDirection;
	let miscastChance = KinkyDungeonStatArousalMiscastChance * KinkyDungeonStatArousal / KinkyDungeonStatArousalMax;
	let tX = targetX;
	let tY = targetY;
	let miscast = false;

	if (enemy) {
		entity = enemy;
		moveDirection = KinkyDungeonGetDirection(player.x - entity.x, player.y - entity.y);
		miscastChance = 0;
	}
	if (Math.random() < miscastChance) {

		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonSpellMiscast"), "#FF8800", 2);

		moveDirection = {x:0, y:0, delta:1};
		tX = entity.x;
		tY = entity.y;
		miscast = true;
	}

	if (spell.type == "bolt") {
		let size = (spell.size) ? spell.size : 1;
		let b = KinkyDungeonLaunchBullet(entity.x + moveDirection.x, entity.y + moveDirection.y,
			tX-entity.x,tY - entity.y,
			spell.speed, {name:spell.name, block: spell.block, width:size, height:size, summon:spell.summon, passthrough: spell.noTerrainHit, noEnemyCollision: spell.noEnemyCollision, nonVolatile:spell.nonVolatile, lifetime:1000, origin: {x: entity.x, y: entity.y}, range: spell.range, hit:spell.onhit, damage: {damage:spell.power, type:spell.damage, time:spell.time}, spell: spell}, miscast);
		b.visual_x = entity.x;
		b.visual_y = entity.y;
	} else if (spell.type == "inert" || spell.type == "dot") {
		let sz = spell.size;
		if (!sz) sz = 1;
		KinkyDungeonLaunchBullet(tX, tY,
			moveDirection.x,moveDirection.y,
			0, {name:spell.name, block: spell.block, width:sz, height:sz, summon:spell.summon, lifetime:spell.delay, passthrough:(spell.CastInWalls || spell.WallsOnly), hit:spell.onhit,
				damage: spell.type == "inert" ? null : {damage:spell.power, type:spell.damage, time:spell.time}, spell: spell}, miscast);
	} else if (spell.type == "buff") {
		let aoe = spell.aoe;
		let cast = false;
		if (!aoe) aoe = 0.1;
		if (Math.sqrt((KinkyDungeonPlayerEntity.x - targetX) * (KinkyDungeonPlayerEntity.x - targetX) + (KinkyDungeonPlayerEntity.y - targetY) * (KinkyDungeonPlayerEntity.y - targetY)) <= aoe) {
			for (let buff of spell.buffs) {
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff);
				cast = true;
			}
		}
		for (let e of KinkyDungeonEntities) {
			if (Math.sqrt((e.x - targetX) * (e.x - targetX) + (e.y - targetY) * (e.y - targetY)) <= aoe) {
				for (let buff of spell.buffs) {
					if (!e.buffs) e.buffs = [];
					KinkyDungeonApplyBuff(e.buffs, buff);
					cast = true;
				}
			}
		}
		if (!cast) return false;
	}

	if (!enemy) { // Costs for the player
		KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonSpellCast"+spell.name), "#88AAFF", 2);

		//let cost = spell.staminacost ? spell.staminacost : KinkyDungeonGetCost(spell.level);

		//KinkyDungeonStatWillpowerExhaustion += spell.exhaustion + 1;
		KinkyDungeonStatMana -= spell.manacost;

		KinkyDungeonChargeVibrators(spell.manacost);
	}

	return true;
}

function KinkyDungeonChargeVibrators(cost) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let vibe = KinkyDungeonInventory[I].restraint;
		if (vibe && vibe.maxbattery > 0 && vibe.vibeType.includes("Charging")) {
			if (vibe.battery == 0) {
				KinkyDungeonPlaySound("Audio/VibrationTone4Long3.mp3");
				if (!KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2)) KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2);
			}

			vibe.battery = Math.min(vibe.maxbattery, vibe.battery + cost);
		}
	}
}

function KinkyDungeonHandleVibrators() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let vibe = KinkyDungeonInventory[I].restraint;
		if (vibe && vibe.maxbattery > 0 && vibe.vibeType.includes("Teaser") && vibe.battery == 0 && Math.random() * 100 < vibe.power) {
			if (vibe.battery == 0) {
				KinkyDungeonPlaySound("Audio/VibrationTone4Long3.mp3");
				if (!KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2)) KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2);
			}

			vibe.battery = Math.min(vibe.maxbattery, vibe.battery + vibe.maxbattery * (0.3 + Math.random() * 0.7));
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
		KinkyDungeonCurrentPage = Math.floor(Math.random()*KinkyDungeonSpells.length);
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
			if ( KinkyDungeonSpellChoices[I] != null && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]]) {
				if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage)) {
					if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*200, 225, 60)) {
						KinkyDungeonSpellChoices[I] = KinkyDungeonCurrentPage;
						KinkyDungeonAdvanceTime(1);
						if (KinkyDungeonTextMessageTime > 0)
							KinkyDungeonDrawState = "Game";
						return true;
					}
				}
			}
		}
	} else if (KinkyDungeonPreviewSpell && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125, 225, 60)) {
		let cost = KinkyDungeonGetCost(KinkyDungeonPreviewSpell);
		let spell = KinkyDungeonPreviewSpell;
		if (KinkyDungeonSpellLevel[spell.school] >= spell.level) {
			if (KinkyDungeonSpellPoints >= cost) {
				KinkyDungeonSpellPoints -= cost;
				KinkyDungeonSpells.push(KinkyDungeonPreviewSpell);
				AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
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
		let textSplit = KinkyDungeonWordWrap(TextGet("KinkyDungeonSpellDescription"+ spell.name).replace("DamageDealt", spell.power).replace("Duration", spell.time).replace("LifeTime", spell.lifetime).replace("DelayTime", spell.delay).replace("BlockAmount", spell.block), 18).split('\n');
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
					DrawText(TextGet("KinkyDungeonSpellChoice" + I), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 50 + I*200, "white", "silver");
					DrawText(TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].name), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 95 + I*200, "white", "silver");
				}
				if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage) && !KinkyDungeonSpells[KinkyDungeonCurrentPage].passive)
					DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*200, 225, 60, TextGet("KinkyDungeonSpell" + I), "White", "", "");
			}
		else {
			let cost = KinkyDungeonGetCost(spell);
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125, 225, 60, TextGet("KinkyDungeonSpellsBuy"),
				(KinkyDungeonSpellPoints >= cost && KinkyDungeonSpellLevel[spell.school] >= spell.level) ? "White" : "Pink", "", "");
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

				if (Mode == "Draw") {
					let color = "white";
					if (KinkyDungeonSpellIndex(spell.name) >= 0) {
						color = "#555555";
					} else if (KinkyDungeonSpellPoints < cost || KinkyDungeonSpellLevel[spell.school] < spell.level) {
						color = "pink";
					}
					DrawButton(canvasOffsetX + XX, yPad + canvasOffsetY + spacing * ii, buttonwidth, spacing - ypadding, TextGet("KinkyDungeonSpell" + spell.name), color);
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
	MainCanvas.textAlign = "left";

	DrawText(TextGet("KinkyDungeonSpellsPage") + (KinkyDungeonCurrentSpellsPage + 1), canvasOffsetX + 425, canvasOffsetY + 25, "white", "black");
	//DrawText(TextGet("KinkyDungeonSpellsPoints") + KinkyDungeonSpellPoints, 650, 900, "white", "black");

	MainCanvas.textAlign = "center";

	DrawText(TextGet("KinkyDungeonSpellsLevels")
		.replace("SPELLPOINTS", "" + KinkyDungeonSpellPoints)
		.replace("ELEMLEVEL", "" + KinkyDungeonSpellLevel.Elements)
		.replace("CONJLEVEL", "" + KinkyDungeonSpellLevel.Conjure)
		.replace("ILLULEVEL", "" + KinkyDungeonSpellLevel.Illusion), canvasOffsetX + 600, 900, "white", "black");

	DrawButton(canvasOffsetX + 50, canvasOffsetY, 250, 50, TextGet("KinkyDungeonSpellsPageBack"), "White", "", "");
	DrawButton(canvasOffsetX + 850, canvasOffsetY, 250, 50, TextGet("KinkyDungeonSpellsPageNext"), "White", "", "");

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