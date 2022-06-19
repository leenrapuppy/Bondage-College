"use strict";
let KinkyDungeonKilledEnemy = null;
let KinkyDungeonAlert = 0;

let KDBrawlerAmount = 1.0;
let KDClumsyAmount = 0.7;
let KDDodgeAmount = 0.75;
let KinkyDungeonMissChancePerBlind = 0.15; // Max 3
let KinkyDungeonMissChancePerSlow = 0.1; // Max 3
let KinkyDungeonBullets = []; // Bullets on the game board
/**
 * @type {Map<string, {end: boolean, name: string, size: number, spriteID: string, xx:number, yy:number, visual_x: number, visual_y: number, updated: boolean, vx: number, vy: number, scale: number, delay: number}>}
 */
let KinkyDungeonBulletsVisual = new Map(); // Bullet sprites on the game board
let KinkyDungeonBulletsID = {}; // Bullets on the game board
let KDVulnerableDmg = 1.0;
let KDVulnerableDmgMult = 0.33;
let KDVulnerableHitMult = 1.33;
let KDPacifistReduction = 0.1;
let KDRiggerDmgBoost = 1.2;
let KDRiggerBindBoost = 1.3;
let KDStealthyDamageMult = 0.7;
let KDStealthyEvaMult = 0.8;
let KDStealthyEnemyCountMult = 1.7;
let KDBoundPowerMult = 0.4;
let KDBerserkerAmp = 0.3;
let KDUnstableAmp = 0.6;

let KinkyDungeonOpenObjects = KinkyDungeonTransparentObjects; // Objects bullets can pass thru
let KinkyDungeonMeleeDamageTypes = ["unarmed", "crush", "slash", "pierce", "grope", "pain", "chain", "tickle"];
let KinkyDungeonHalfDamageTypes = ["tickle", "charm", "drain"];
let KinkyDungeonTeaseDamageTypes = ["tickle", "charm", "grope", "pain", "happygas", "poison", "drain", "souldrain"];
let KinkyDungeonStunDamageTypes = ["fire", "electric", "stun"];
let KinkyDungeonBindDamageTypes = ["chain", "glue"];
let KinkyDungeonFreezeDamageTypes = ["ice"];
let KinkyDungeonSlowDamageTypes = ["crush", "slash", "pierce", "frost", "cold", "poison"];
let KinkyDungeonVulnerableDamageTypes = ["tickle", "acid"];

// Weapons
let KinkyDungeonPlayerWeapon = null;
/** @type {weapon} */
let KinkyDungeonPlayerDamageDefault = {name: "", dmg: 2, chance: 0.9, type: "unarmed", unarmed: true, rarity: 0, shop: false, sfx: "Unarmed"};
/** @type {weapon} */
let KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault;

let KinkyDungeonDamageTypes = [
	{name: "cold", color: "#21007F", bg: "white"},
	{name: "ice", color: "#00D8FF", bg: "black"},
	{name: "frost", color: "#00D8FF", bg: "black"},
	{name: "fire", color: "#FF6A00", bg: "black"},
	{name: "poison", color: "#00D404", bg: "black"},
	{name: "happygas", color: "#E27CD0", bg: "black"},
	{name: "charm", color: "#E27CD0", bg: "black"},
	{name: "electric", color: "#FFD800", bg: "black"},
	{name: "glue", color: "#E200D0", bg: "black"},
	{name: "stun", color: "white", bg: "black"},
	{name: "chain", color: "white", bg: "black"},
	{name: "tickle", color: "white", bg: "black"},
	{name: "crush", color: "white", bg: "black"},
	{name: "grope", color: "white", bg: "black"},
	{name: "slash", color: "white", bg: "black"},
	{name: "pierce", color: "white", bg: "black"},
	{name: "pain", color: "white", bg: "black"},
	{name: "unarmed", color: "white", bg: "black"},
	{name: "magic", color: "#00FF90", bg: "black"},
	{name: "melee", color: "#aaaaaa", bg: "black"},
];

/**
 *
 * @param {item} item
 * @returns {weapon}
 */
function KDWeapon(item) {
	return KinkyDungeonWeapons[item.name];
}

function KinkyDungeonFindWeapon(Name) {
	for (let con of Object.values(KinkyDungeonWeapons)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonWeaponCanCut(RequireInteract, MagicOnly) {
	if (KinkyDungeonPlayerWeapon
		&& KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].cutBonus != undefined
		&& (!MagicOnly || KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].magic != undefined)
		&& (!RequireInteract || !KinkyDungeonIsHandsBound())) return true;
	if (KinkyDungeonPlayerBuffs) {
		for (let b of Object.values(KinkyDungeonPlayerBuffs)) {
			if (b && b.tags && (b.tags.includes("allowCutMagic") || (!MagicOnly && b.tags.includes("allowCut")))) return true;
		}
	}
	return false;
}

// We reset the pity timer on weapon switch to prevent issues
function KDSetWeapon(Weapon) {
	KinkyDungeonEvasionPityModifier = 0;
	KinkyDungeonPlayerWeapon = Weapon;
}

function KinkyDungeonGetPlayerWeaponDamage(HandsFree, NoOverride) {
	let flags = {
		KDDamageHands: true.valueOf,
	};
	if (!NoOverride)
		KinkyDungeonSendEvent("calcDamage", {flags: flags});

	let damage = KinkyDungeonPlayerDamageDefault;
	// @ts-ignore
	KinkyDungeonPlayerDamage = {};
	let weapon = KinkyDungeonWeapons[KinkyDungeonPlayerWeapon];
	if (weapon && weapon.noHands) HandsFree = true;
	if (!HandsFree || (KinkyDungeonStatsChoice.get("Brawler") && !KinkyDungeonPlayerWeapon)) {
		damage = KinkyDungeonPlayerDamageDefault;
		if (!NoOverride)
			KDSetWeapon(null);
	} else if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon]) {
		damage = KinkyDungeonWeapons[KinkyDungeonPlayerWeapon];
	}

	Object.assign(KinkyDungeonPlayerDamage, damage);

	if (!KinkyDungeonPlayer.CanInteract() && flags.KDDamageHands && (!weapon || !weapon.noHands)) {
		KinkyDungeonPlayerDamage.chance /= 2;
	}
	if (KinkyDungeonSlowLevel > 1 && !KinkyDungeonPlayerDamage.name) {
		KinkyDungeonPlayerDamage.dmg /= 2;
	}
	if (KinkyDungeonStatsChoice.get("Brawler") && !KinkyDungeonPlayerDamage.name) {
		KinkyDungeonPlayerDamage.dmg += KDBrawlerAmount;
	}
	if ((KinkyDungeonPlayer.Pose.includes("Hogtied") || KinkyDungeonPlayer.Pose.includes("Kneel")) && flags.KDDamageHands && (!weapon || !weapon.noHands)) {
		KinkyDungeonPlayerDamage.chance /= 1.5;
	}

	return KinkyDungeonPlayerDamage;
}

let KinkyDungeonEvasionPityModifier = 0; // Current value
let KinkyDungeonEvasionPityModifierIncrementPercentage = 0.5; // Percent of the base hit chance to add

function KinkyDungeonGetEvasion(Enemy, NoOverride, IsSpell, IsMagic, cost) {
	let flags = {
		KDEvasionHands: true,
		KDEvasionSight: true,
		KDEvasionDeaf: true,
		KDEvasionSlow: true,
	};
	let data = {enemy: Enemy,
		isSpell: IsSpell,
		isMagic: IsMagic,
		flags: flags,
		cost: cost,
		hitmult: 1.0,
	};

	if (!NoOverride)
		KinkyDungeonSendEvent("calcEvasion", data);
	let hitChance = (Enemy && Enemy.buffs) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "Evasion")) : 1.0;
	hitChance *= data.hitmult;
	if (KinkyDungeonStatsChoice.get("Clumsy")) hitChance *= KDClumsyAmount;
	if (Enemy && Enemy.Enemy && Enemy.Enemy.evasion && (((!Enemy.stun || Enemy.stun < 1) && (!Enemy.freeze || Enemy.freeze < 1)) || Enemy.Enemy.alwaysEvade || Enemy.Enemy.evasion < 0)) hitChance *= Math.max(0,
		(Enemy.aware ? KinkyDungeonMultiplicativeStat(Enemy.Enemy.evasion) : Math.max(1, KinkyDungeonMultiplicativeStat(Enemy.Enemy.evasion))));
	if (Enemy && Enemy.Enemy && Enemy.Enemy.tags.has("ghost") && (IsMagic || (KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.magic))) hitChance = Math.max(hitChance, 1.0);

	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Accuracy")) {
		hitChance *= KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Accuracy"));
	}

	if (!IsSpell) hitChance *= KinkyDungeonPlayerDamage.chance;
	if (Enemy && Enemy.slow > 0) hitChance *= 2;
	if (Enemy && (Enemy.stun > 0 || Enemy.freeze > 0)) hitChance *= 5;
	if (Enemy && Enemy.bind > 0) hitChance *= 3;
	if (Enemy) hitChance *= 1 + 0.25 * KDBoundEffects(Enemy);
	if (Enemy && Enemy.vulnerable) hitChance *= KDVulnerableHitMult;

	if (!IsSpell) {
		if (flags.KDEvasionSight)
			hitChance = Math.min(hitChance, Math.max(0.1, hitChance - Math.min(3, KinkyDungeonBlindLevel) * KinkyDungeonMissChancePerBlind));
		if (flags.KDEvasionDeaf &&KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.9;
		if (flags.KDEvasionSlow && KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.name && KinkyDungeonSlowLevel > 0) hitChance *= 1.0 - Math.max(0.5, KinkyDungeonMissChancePerSlow * KinkyDungeonSlowLevel);
	}
	return hitChance;
}

function KinkyDungeonAggro(Enemy, Spell, Attacker, Faction) {
	if (Enemy && Enemy.Enemy && (!Spell || !Spell.enemySpell) && (!Faction || Faction == "Player") && !(Enemy.rage > 0) && (!Attacker || Attacker.player || Attacker.Enemy.allied)) {
		if (Enemy.Enemy.name == "Angel") {
			Enemy.Enemy = KinkyDungeonGetEnemyByName("AngelHostile");
			if (KDGameData.KDPenanceStage < 4)
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngelAggro"), "yellow", 2);
		} else if (Enemy && !Enemy.Enemy.allied) {
			KinkyDungeonAggroAction('attack', {enemy: Enemy});
		}
	}
}

function KinkyDungeonPlayerEvasion() {
	let playerEvasionMult = KinkyDungeonStatsChoice.get("Dodge") && KinkyDungeonMiscastChance < 0.001 ? KDDodgeAmount : 1.0;
	let val = playerEvasionMult * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion"));

	return val;
}

function KinkyDungeonEvasion(Enemy, IsSpell, IsMagic, Attacker) {
	let hitChance = KinkyDungeonGetEvasion(Enemy, undefined, IsSpell, IsMagic, true);
	if (KDHostile(Enemy) && KinkyDungeonStatsChoice.get("Stealthy")) {
		hitChance *= KDStealthyEvaMult;
	}

	if (!Enemy) KinkyDungeonSleepTime = 0;

	KinkyDungeonAggro(Enemy, undefined, Attacker);

	if (KDRandom() < hitChance + KinkyDungeonEvasionPityModifier) {
		KinkyDungeonEvasionPityModifier = 0; // Reset the pity timer
		return true;
	}

	if (Enemy) {
		// Increment the pity timer
		KinkyDungeonEvasionPityModifier += KinkyDungeonEvasionPityModifierIncrementPercentage * hitChance;
	}

	return false;
}

function KinkyDungeonGetImmunity(tags, type, resist) {
	let t = type;
	if (type == "frost") t = "ice"; // Frost damage is treated as ice damage
	if (tags && tags.has(t + resist)
		|| ((KinkyDungeonMeleeDamageTypes.includes(t) && (type != "unarmed" || !resist.includes("weakness"))) && tags.has("melee" + resist))
		|| (!KinkyDungeonMeleeDamageTypes.includes(t) && tags.has("magic"+resist)))
		return true;
	return false;
}

let KDDamageQueue = [];

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg, Spell, bullet, attacker, Delay, noAlreadyHit) {
	if (bullet && !noAlreadyHit) {
		if (!bullet.alreadyHit) bullet.alreadyHit = [];
		// A bullet can only damage an enemy once per turn
		if (bullet.alreadyHit.includes(Enemy.id)) return 0;
		bullet.alreadyHit.push(Enemy.id);
	}

	let predata = {
		aggro: false,
		faction: "Enemy",
		enemy: Enemy,
		spell: Spell,
		bullet: bullet,
		attacker: attacker,
		type: (Damage) ? Damage.type : 0,
		time: (Damage) ? Damage.time : 0,
		dmg: (Damage) ? Damage.damage : 0,
		bind: (Damage) ? Damage.bind : 0,
		flags: (Damage) ? Damage.flags : undefined,
		boundBonus: (Damage) ? Damage.boundBonus : 0,
		incomingDamage: Damage,
		freezebroke: false,
	};

	if (attacker) {
		if (attacker.player) predata.faction = "Player";
		else if (attacker.Enemy) predata.faction = KDGetFaction(attacker);
	} else if (bullet) {
		if (bullet.bullet.faction) predata.faction = bullet.bullet.faction;
		else if (bullet.bullet.spell && bullet.bullet.spell.enemySpell) predata.faction = "Enemy";
		else predata.faction = "Player";
	} else if (Spell) {
		if (Spell.enemySpell) predata.faction = "Enemy";
		else predata.faction = "Player";
	}

	KinkyDungeonSendEvent("beforeDamageEnemy", predata);
	if (!predata.dmg) predata.dmg = 0;
	//let type = (Damage) ? Damage.type : "";
	let effect = false;
	let resistStun = 0;
	let resistSlow = 0;
	let resistDamage = 0;
	let dmgDealt = 0;
	let sr = Enemy.Enemy.spellResist ? Enemy.Enemy.spellResist : 0;
	let spellResist = KinkyDungeonMultiplicativeStat(sr) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "SpellResist"));
	let armor = (Damage && Enemy.Enemy.armor && KinkyDungeonMeleeDamageTypes.includes(predata.type)) ? Enemy.Enemy.armor : 0;
	if (KinkyDungeonGetBuffedStat(Enemy.buffs, "Armor")) armor += KinkyDungeonGetBuffedStat(Enemy.buffs, "Armor");

	armor = Math.max(armor, Enemy.Enemy.armor < 0 ? Enemy.Enemy.armor : 0);

	if (Enemy.freeze > 0 && Damage && KinkyDungeonMeleeDamageTypes.includes(predata.type)) {
		predata.dmg *= 2;
	}
	if (KDHostile(Enemy) && KinkyDungeonStatsChoice.get("Stealthy")) {
		predata.dmg *= KDStealthyDamageMult;
	}

	let miss = !(!Damage || !Damage.evadeable || KinkyDungeonEvasion(Enemy, (true && Spell), !KinkyDungeonMeleeDamageTypes.includes(predata.type), attacker));
	if (Damage && !miss) {
		if (KinkyDungeonStatsChoice.get("Pacifist") && KDHostile(Enemy) && Enemy.Enemy.bound && !KinkyDungeonTeaseDamageTypes.includes(predata.type) && predata.type != "glue" && predata.type != "chain") {
			predata.dmg *= KDPacifistReduction;
		}
		if (KinkyDungeonStatsChoice.get("Rigger") && KDHostile(Enemy) && (predata.type != "glue" || predata.type != "chain")) {
			predata.dmg *= KDRiggerDmgBoost;
		}
		let DamageAmpBonusPerks = KDBoundPowerLevel * KDBoundPowerMult
		+ ((KinkyDungeonStatsChoice.get("BerserkerRage") && KinkyDungeonMeleeDamageTypes.includes(predata.type)) ? KDBerserkerAmp * KinkyDungeonStatDistraction / KinkyDungeonStatDistractionMax : 0)
		+ ((KinkyDungeonStatsChoice.get("UnstableMagic") && Spell && !Spell.allySpell && !Spell.enemySpell) ? KDUnstableAmp * Math.min(1, Math.max(KinkyDungeonStatDistraction / KinkyDungeonStatDistractionMax, KinkyDungeonMiscastChance)) : 0);
		let damageAmp = KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(Enemy.buffs, "DamageAmp") - (KDHostile(Enemy) && (!attacker || attacker.player) ? (DamageAmpBonusPerks) : 0));
		let buffreduction = KinkyDungeonGetBuffedStat(Enemy.buffs, "DamageReduction");
		let buffresist = KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, predata.type + "DamageResist"));
		buffresist *= KinkyDungeonMeleeDamageTypes.includes(predata.type) ?
			KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "meleeDamageResist"))
			: KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "magicDamageResist"));
		let buffType = predata.type + "DamageBuff";
		let buffAmount = 1 + (KDHostile(Enemy) ? KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, buffType) : 0);
		predata.dmg *= buffAmount;
		predata.dmg *= buffresist;

		if (predata.type == "electric" && KinkyDungeonMapGet(Enemy.x, Enemy.y) == 'w') {
			predata.dmg *= 2;
		}
		if (damageAmp) predata.dmg *= damageAmp;

		let time = predata.time ? predata.time : 0;
		if (spellResist && !KinkyDungeonMeleeDamageTypes.includes(predata.type)) {
			if (time)
				time = Math.max(0, Math.ceil(time * spellResist));
			predata.dmg = Math.max(0, predata.dmg * spellResist);
		}


		if (Enemy.Enemy.tags) {
			if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, predata.type, "severeweakness")) resistDamage = -2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, predata.type, "weakness")) resistDamage = -1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, predata.type, "immune")) resistDamage = 2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, predata.type, "resist")) resistDamage = 1;

			if (Enemy.Enemy.tags.has("unstoppable")) resistStun = 2;
			else if (Enemy.Enemy.tags.has("unflinching")) resistStun = 1;
			if (Enemy.Enemy.tags.has("unslowable")) resistSlow = 2;
			else if (Enemy.Enemy.tags.has("slowresist")) resistSlow = 1;

		}

		if (KinkyDungeonHalfDamageTypes.includes(predata.type) && resistDamage >= 0) predata.dmg *= 0.5;
		if (Enemy.boundLevel > 0 && (KinkyDungeonTeaseDamageTypes.includes(predata.type) || Damage.tease)) {
			let eff = KDBoundEffects(Enemy);
			let mult = 1.0;
			if (eff > 0) {
				mult += 0.5;
			}
			if (eff > 3) {
				mult += 0.5;
			}
			if (KinkyDungeonHalfDamageTypes.includes(predata.type)) {
				mult *= 2.0;
			}
			predata.dmg *= mult;
		}
		if (Enemy.boundLevel > 0 && Damage && Damage.boundBonus) {
			let eff = KDBoundEffects(Enemy);
			predata.dmg += Damage.boundBonus * eff;
		}

		let forceKill = false;

		if (predata.type != "inert" && resistDamage < 2) {
			if (resistDamage == 1 || (resistStun > 0 && predata.type == "stun")) {
				dmgDealt = Math.max(predata.dmg - armor, 0); // Armor goes before resistance
				dmgDealt = dmgDealt*0.5; // Enemies that are vulnerable take either dmg+0.5 or 1.5x damage, whichever is greater
			} else if (resistDamage == -1) {
				if (predata.dmg > 0)
					dmgDealt = Math.max(predata.dmg+0.5, predata.dmg*1.5); // Enemies that are vulnerable take either dmg+1 or 1.5x damage, whichever is greater
				else dmgDealt = 0;
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else if (resistDamage == -2) {
				dmgDealt = Math.max(predata.dmg+1, predata.dmg*2); // Enemies that are severely vulnerable take either dmg+1 or 2x damage, whichever is greater
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else {
				dmgDealt = Math.max(predata.dmg - armor, 0);
			}

			if (Enemy.freeze > 0 && (KinkyDungeonMeleeDamageTypes.includes(predata.type) || predata.type == "fire")) {
				Enemy.freeze = 0;
				predata.freezebroke = true;
			}

			if (Enemy.Enemy.tags && Enemy.Enemy.tags.has("playerinstakill") && attacker && attacker.player) dmgDealt = Enemy.hp;
			else if (buffreduction && dmgDealt > 0) {
				dmgDealt = Math.max(dmgDealt - buffreduction, 0);
				KinkyDungeonTickBuffTag(Enemy.buffs, "damageTaken", 1);
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Shield.ogg");
			}

			KinkyDungeonSendEvent("duringDamageEnemy", predata);

			if (Spell && Spell.hitsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Spell.hitsfx + ".ogg");
			else if (dmgDealt > 0 && bullet) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/DealDamage.ogg");
			if (Damage && Damage.damage) {
				if (KinkyDungeonLightGet(Enemy.x, Enemy.y) > 0)
					KDDamageQueue.push({floater: Math.round(Math.min(dmgDealt, Enemy.hp)*10), Entity: Enemy, Color: "#ff4444", Delay: Delay});
				//KinkyDungeonSendFloater(Enemy, Math.round(Math.min(dmgDealt, Enemy.hp)*10), "#ff4444");
			}
			forceKill = (Enemy.hp <= Enemy.Enemy.maxhp*0.1 || Enemy.hp <= 0.52) && KDistChebyshev(Enemy.x - KinkyDungeonPlayerEntity.x, Enemy.y - KinkyDungeonPlayerEntity.y) < 1.5;
			Enemy.hp -= dmgDealt;
			if (Enemy.hp > 0 && Enemy.hp <= 0.51 && dmgDealt > 2.01 && !forceKill && KDBoundEffects(Enemy) < 4) Enemy.hp = 0;
			if (dmgDealt > 0) Enemy.revealed = true;
		}

		if ((resistStun < 2 && resistDamage < 2) && (KinkyDungeonStunDamageTypes.includes(predata.type))) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.stun) KDAddThought(Enemy.id, "Annoyed", 5, 1);
			if (!Enemy.stun) Enemy.stun = 0;
			if (resistStun == 1 || resistDamage == 1)
				Enemy.stun = Math.max(Enemy.stun, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.stun = Math.max(Enemy.stun, time);
		}
		if ((resistStun < 2 && resistDamage < 2) && (KinkyDungeonFreezeDamageTypes.includes(predata.type))) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.freeze) Enemy.freeze = 0;
			if (resistDamage == 1 || resistStun == 1)
				Enemy.freeze = Math.max(Enemy.freeze, Math.min(Math.floor(time/2), time-1)); // Enemies with ice resistance have freeze reduced to 1/2, and anything that freezes them for one turn doesn't affect them
			else Enemy.freeze = Math.max(Enemy.freeze, time);
		}

		if ((resistStun < 2 && resistDamage < 2) && (KinkyDungeonBindDamageTypes.includes(predata.type))) { // Being immune to the damage stops the bind
			effect = true;
			if (!Enemy.bind) Enemy.bind = 0;
			if (resistDamage == 1 || resistStun == 1)
				Enemy.bind = Math.max(Enemy.bind, Math.min(Math.floor(time/2), time-1)); // Enemies with resistance have bind reduced to 1/2, and anything that binds them for one turn doesn't affect them
			else Enemy.bind = Math.max(Enemy.bind, time);
		}
		if ((predata.dmg || predata.bind) && Enemy.Enemy.bound && (resistDamage < 2) && (Damage.bind || predata.type == "chain" || predata.type == "glue" || predata.type == "magicbind")) {
			effect = true;
			if (!Enemy.boundLevel) Enemy.boundLevel = 0;
			let efficiency = Damage.bindEff ? Damage.bindEff : 1.0;
			if (resistStun == -2) {
				efficiency *= 2;
			} else if (resistStun == -1) {
				efficiency *= 1.5;
			}
			if (resistDamage == 1 || resistStun == 1) {
				efficiency *= 0.75;
			}
			if (resistDamage == 2) {
				efficiency *= 0.5;
			}
			if (resistStun == 2) {
				efficiency *= 0.5;
			}
			if (predata.vulnerable || Enemy.boundLevel > Enemy.Enemy.maxhp) {
				efficiency *= 2;
			}

			if (!(Enemy.boundLevel > 0)) KDAddThought(Enemy.id, "Annoyed", 5, 1);
			Enemy.boundLevel += efficiency * (predata.bind ? predata.bind : predata.dmg);
			if (predata.vulnerable && efficiency * (predata.bind ? predata.bind : predata.dmg) > 0.01 && Enemy.boundLevel < Enemy.Enemy.maxhp * 0.6) {
				Enemy.boundLevel += Enemy.Enemy.maxhp * 0.2;
			}
		}

		if (!forceKill && KDBoundEffects(Enemy) > 3 && (Enemy.hp < 0 || (Enemy.hp <= Enemy.Enemy.maxhp * 0.1))) {
			if (KinkyDungeonLightGet(Enemy.x, Enemy.y) > 0) {
				KDAddThought(Enemy.id, "GiveUp", 6, 3);
				KDDamageQueue.push({floater: TextGet("KDHelpless"), Entity: {x: Enemy.x - 0.5 + Math.random(), y: Enemy.y - 0.5 + Math.random()}, Color: "white", Time: 2, Delay: Delay});
			}
			//KinkyDungeonSendFloater({x: Enemy.x - 0.5 + Math.random(), y: Enemy.y - 0.5 + Math.random()}, TextGet("KDHelpless"), "white", 2);
			Enemy.hp = 0.51;
		}

		if ((resistSlow < 2 && resistDamage < 2) && (KinkyDungeonSlowDamageTypes.includes(predata.type))) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.slow) KDAddThought(Enemy.id, "Annoyed", 5, 1);
			if (!Enemy.slow) Enemy.slow = 0;
			if (resistSlow == 1 || resistDamage == 1)
				Enemy.slow = Math.max(Enemy.slow, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.slow = Math.max(Enemy.slow, time);
		}
		if ((resistDamage < 2) && (KinkyDungeonVulnerableDamageTypes.includes(predata.type))) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.vulnerable) KDAddThought(Enemy.id, "Status", 4, 1);
			if (!Enemy.vulnerable) Enemy.vulnerable = 0;
			if (resistDamage == 1)
				Enemy.vulnerable = Math.max(Enemy.vulnerable, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.vulnerable = Math.max(Enemy.vulnerable, time);
		}
	}

	predata.aggro = predata.type != "heal" && predata.type != "inert" && (!Spell || !Spell.allySpell) && (!bullet || !bullet.spell || !bullet.spell.allySpell);

	KinkyDungeonSendEvent("afterDamageEnemy", predata);

	let atkname = (Spell) ? TextGet("KinkyDungeonSpell" + Spell.name) : TextGet("KinkyDungeonBasicAttack");

	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy;
	}
	let mod = "";
	if (resistDamage == 1) mod = "Weak";
	if (resistDamage == 2) mod = "Immune";
	if (resistDamage == -1) mod = "Strong";
	if (resistDamage == -2) mod = "VeryStrong";
	if (Damage && !mod && spellResist < 1 && !KinkyDungeonMeleeDamageTypes.includes(predata.type)) mod = "SpellResist";

	if (predata.faction == "Player" || predata.faction == "Rage") {
		if (!Enemy.playerdmg) Enemy.playerdmg = 0.01;
		Enemy.playerdmg += dmgDealt;
	}

	if (!NoMsg && (dmgDealt > 0 || !Spell || effect)) KinkyDungeonSendActionMessage(4, (Damage && dmgDealt > 0) ?
		TextGet((Ranged) ? "PlayerRanged" + mod : "PlayerAttack" + mod).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("AttackName", atkname).replace("DamageDealt", "" + Math.round(dmgDealt * 10))
		: TextGet("PlayerMiss" + ((Damage && !miss) ? "Armor" : "")).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)),
			(Damage && (predata.dmg > 0 || effect)) ? "orange" : "red", 2, undefined, undefined, Enemy);

	if (Enemy && Enemy.Enemy && Enemy.Enemy.AI == "ambush" && Spell) {
		Enemy.ambushtrigger = true;
	}

	if (!Damage && predata.type != "inert" && dmgDealt <= 0) {
		KDAddThought(Enemy.id, "Laugh", 4, 1);
		KDDamageQueue.push({floater: TextGet("KDMissed"), Entity: {x: Enemy.x - 0.5 + Math.random(), y: Enemy.y - 0.5 + Math.random()}, Color: "white", Time: 2, Delay: Delay});

		if (KinkyDungeonSound && Enemy.Enemy.cueSfx && Enemy.Enemy.cueSfx.Miss) {
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Enemy.Enemy.cueSfx.Miss + ".ogg");
		}
		//KinkyDungeonSendFloater({x: Enemy.x - 0.5 + Math.random(), y: Enemy.y - 0.5 + Math.random()}, TextGet("KDMissed"), "white", 2);
	} else if (Damage && Damage.damage > 0 && predata.type != "inert" && dmgDealt <= 0 && !miss) {
		if (KinkyDungeonLightGet(Enemy.x, Enemy.y) > 0) {
			KDAddThought(Enemy.id, "Laugh", 5, 3);
			KDDamageQueue.push({floater: TextGet("KDBlocked"), Entity: {x: Enemy.x - 0.5 + Math.random(), y: Enemy.y - 0.5 + Math.random()}, Color: "white", Time: 2, Delay: Delay});
		}

		let type = KinkyDungeonMeleeDamageTypes.includes(predata.type) ? "Block" : "Resist";
		if (KinkyDungeonSound && Enemy.Enemy.cueSfx && Enemy.Enemy.cueSfx[type]) {
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Enemy.Enemy.cueSfx[type] + ".ogg");
		}
		//KinkyDungeonSendFloater({x: Enemy.x - 0.5 + Math.random(), y: Enemy.y - 0.5 + Math.random()}, TextGet("KDBlocked"), "white", 2);
	} else if (dmgDealt > 0 && KinkyDungeonSound && Enemy.Enemy.cueSfx && Enemy.Enemy.cueSfx.Damage) {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Enemy.Enemy.cueSfx.Damage + ".ogg");
	}

	if (predata.aggro)
		KinkyDungeonAggro(Enemy, Spell, attacker, predata.faction);

	if (predata.dmg > 0)
		KinkyDungeonTickBuffTag(Enemy.buffs, "takeDamage", 1);
	return predata.dmg;
}

function KinkyDungeonDisarm(Enemy) {
	if (!Enemy) {
		console.log("Error processing disarm! Please report!");
		return false;
	}
	if (KDRandom() < KinkyDungeonWeaponGrabChance) {
		let slots = [];
		for (let X = -Math.ceil(1); X <= Math.ceil(1); X++)
			for (let Y = -Math.ceil(1); Y <= Math.ceil(1); Y++) {
				if ((X != 0 || Y != 0) && KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(Enemy.x + X, Enemy.y + Y))) {
					// We add the slot and those around it
					slots.push({x:Enemy.x + X, y:Enemy.y + Y});
					for (let XX = -Math.ceil(1); XX <= Math.ceil(1); XX++)
						for (let YY = -Math.ceil(1); YY <= Math.ceil(1); YY++) {
							if ((Math.abs(X + XX) > 1 || Math.abs(Y + YY) > 1) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Enemy.x + XX + X, Enemy.y + YY + Y))) {
								slots.push({x:Enemy.x + XX + X, y:Enemy.y + YY + Y});
							}
						}
				}
			}

		let foundslot = null;
		for (let C = 0; C < 100; C++) {
			let slot = slots[Math.floor(KDRandom() * slots.length)];
			if (slot && KinkyDungeonNoEnemy(slot.x, slot.y, true)
				&& Math.max(Math.abs(KinkyDungeonPlayerEntity.x - slot.x), Math.abs(KinkyDungeonPlayerEntity.y - slot.y)) > 1.5
				&& KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(slot.x, slot.y))) {
				foundslot = {x: slot.x, y: slot.y};

				C = 100;
			} else slots.splice(C, 1);
		}

		if (foundslot) {
			let weapon = KinkyDungeonPlayerDamage.name;

			let dropped = {x:foundslot.x, y:foundslot.y, name: weapon};

			KDSetWeapon(null);
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			KinkyDungeonInventoryRemove(KinkyDungeonInventoryGetWeapon(weapon));

			KinkyDungeonGroundItems.push(dropped);
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonDisarm"), "red", 2);

			return true;
		}
	}
	return false;
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	let disarm = false;
	if (Enemy.Enemy && Enemy.Enemy.disarm && Enemy.disarmflag > 0) {
		if (Enemy.stun > 0 || Enemy.freeze > 0 || Enemy.blind > 0) Enemy.disarmflag = 0;
		else if (Enemy.Enemy && Enemy.Enemy.disarm && Enemy.disarmflag >= 0.97 && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.type != "unarmed") {
			Enemy.disarmflag = 0;
			disarm = true;
		}
	}
	let evaded = KinkyDungeonEvasion(Enemy, undefined, undefined, KinkyDungeonPlayerEntity);
	let dmg = Damage;
	let buffdmg = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg");
	let predata = {
		enemy: Enemy,
		evaded: evaded,
		disarm: disarm,
		eva: !disarm && evaded,
		Damage: Damage,
		buffdmg: buffdmg,
		vulnerable: Enemy.vulnerable,
	};
	KinkyDungeonSendEvent("beforePlayerAttack", predata);

	if (predata.vulnerable && (predata.eva)) {
		let dmgBonus = Math.max(KDVulnerableDmg, dmg.damage * KDVulnerableDmgMult);
		dmg.damage = Math.max(0, dmg.damage + dmgBonus);
		KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonVulnerable").replace("AMOUNT", "" + Math.round(10 * dmgBonus)), "lightgreen", 2);
	}

	if (predata.buffdmg) dmg.damage = Math.max(0, dmg.damage + predata.buffdmg);

	let hp = Enemy.hp;
	KinkyDungeonDamageEnemy(Enemy, (predata.eva) ? dmg : null, undefined, undefined, undefined, undefined, KinkyDungeonPlayerEntity);
	if (predata.eva && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.sfx) {
		if (KinkyDungeonSound) KDDamageQueue.push({sfx: KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonPlayerDamage.sfx + ".ogg"});
		//AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonPlayerDamage.sfx + ".ogg");
	} else if (!predata.eva) if (KinkyDungeonSound) KDDamageQueue.push({sfx: KinkyDungeonRootDirectory + "/Audio/Miss.ogg"});
	//AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	if (disarm) {
		KinkyDungeonDisarm(Enemy);
	}
	if (!KinkyDungeonPlayerDamage || !KinkyDungeonPlayerDamage.silent || !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") > 0)) {
		if (Enemy && hp < Enemy.Enemy.maxhp) {
			KinkyDungeonAlert = 4;
		} else {
			KinkyDungeonAlert = 2;
		}
	} else {
		if (!KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") < 2) {
			if (KinkyDungeonAlert) {
				KinkyDungeonAlert = 2;
			} else {
				KinkyDungeonAlert = 1;
			}
		} else if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") < 3) {
			// Meep
		}
	}

	if (Enemy.Enemy && Enemy.Enemy.disarm && !disarm && KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.unarmed) {
		if (!Enemy.disarmflag) Enemy.disarmflag = 0;
		Enemy.disarmflag += Enemy.Enemy.disarm;
	}
	let data = {
		targetX: Enemy.x,
		targetY: Enemy.y,
		enemy: Enemy,
		miss: !evaded,
		disarm: disarm,
		damage: Damage,
	};
	KinkyDungeonSendEvent("playerAttack", data);

	KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "damage", 1);
	KinkyDungeonTickBuffTag(Enemy.buffs, "incomingHit", 1);
	if (predata.eva)
		KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "hit", 1);

}

let KDBulletWarnings = [];

function KinkyDungeonUpdateBullets(delta, Allied) {
	if (delta > 0)
		for (let b of KinkyDungeonBullets) {
			if ((Allied && b.bullet && b.bullet.spell && !b.bullet.spell.enemySpell) || (!Allied && !(b.bullet && b.bullet.spell && !b.bullet.spell.enemySpell))) {
				if (b.bullet && b.bullet.dot) {
					KinkyDungeonBulletDoT(b);
				}
				if (b.bullet.cast && b.bullet.spell && b.bullet.spell.castDuringDelay && (!b.bullet.cast.chance || KDRandom() < b.bullet.cast.chance) && b.time > 1) {
					let xx = b.bullet.cast.tx;
					let yy = b.bullet.cast.ty;
					let castingSpell = KinkyDungeonFindSpell(b.bullet.cast.spell, true);
					if (b.bullet.cast.spread) {
						let xxx = xx + Math.round(-b.bullet.cast.spread + 2*b.bullet.cast.spread * KDRandom());
						let yyy = yy + Math.round(-b.bullet.cast.spread + 2*b.bullet.cast.spread * KDRandom());
						if (xxx != b.x || yyy != b.y || castingSpell.type != 'bolt') {
							xx = xxx;
							yy = yyy;
						}
					}
					if (castingSpell.type != 'bolt') {
						if (!xx) xx = b.x;
						if (!yy) yy = b.y;
					} else if (xx == b.x && yy == b.y) {
						for (let i = 0; i < 20; i++) {
							xx = b.x + Math.floor(KDRandom() * 3 - 1);
							yy = b.y + Math.floor(KDRandom() * 3 - 1);
							if (xx != b.x || yy != b.y) i = 1000;
							else if (i > 19) {
								xx = b.x + 1;
								yy = b.y + 0;
							}
						}
					}

					KinkyDungeonCastSpell(xx, yy, castingSpell, undefined, undefined, b);
				}
			}
		}
	if (Allied) {
		KDBulletWarnings = [];
	}
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		let b = KinkyDungeonBullets[E];

		if ((Allied && b.bullet && b.bullet.spell && !b.bullet.spell.enemySpell) || (!Allied && !(b.bullet && b.bullet.spell && !b.bullet.spell.enemySpell))) {
			let d = delta;
			let first = true;
			let justBorn = false;
			let trailSquares = [];
			let startx = b.x;
			let starty = b.y;
			let end = false;

			while (d > 0.1) {
				if (!first && delta > 0) {
					let dt = (d - Math.max(0, d - 1))/Math.sqrt(Math.max(1, b.vx*b.vx+b.vy*b.vy));
					if (b.born >= 0) {
						b.born -= 1;
						justBorn = true;
					}

					let mod = (b.spell && b.spell.speed == 1) ? 1 : 0;
					if (b.born < mod) {
						b.xx += b.vx * dt;
						b.yy += b.vy * dt;
						b.time -= delta;
					}

					if (b.bullet.spell && b.trail && (b.x != Math.round(b.xx) || b.y != Math.round(b.yy))
						&& !trailSquares.includes(Math.round(b.xx) + "," + Math.round(b.yy))) {
						if (KinkyDungeonBulletTrail(b)) {
							trailSquares.push(Math.round(b.xx) + "," + Math.round(b.yy));
						}
					}

					b.x = Math.round(b.xx);
					b.y = Math.round(b.yy);

					d -= dt;
				} else first = false;

				let outOfRange = false;
				let endTime = false;
				if (b.bullet && b.bullet.origin) {
					let dist = Math.sqrt((b.bullet.origin.x - b.x) * (b.bullet.origin.x - b.x) + (b.bullet.origin.y - b.y) * (b.bullet.origin.y - b.y));
					if (dist > b.bullet.range) outOfRange = true;
					if (dist >= b.bullet.range) endTime = true;
				}
				let outOfTime = (b.bullet.lifetime != 0 && b.time <= 0.001);
				end = false;
				let checkCollision = justBorn || b.x != startx || b.y != starty || (!b.vx && !b.vy) || (KDistEuclidean(b.vx, b.vy) < 0.9); // Check collision for bullets only once they leave their square or if they are slower than one
				if ((checkCollision && !KinkyDungeonBulletsCheckCollision(b, undefined, undefined, delta - d)) || outOfTime || outOfRange) {
					if (!(b.bullet.spell && ((!b.bullet.trail && b.bullet.spell.piercing) || (b.bullet.trail && b.bullet.spell.piercingTrail))) || outOfRange || outOfTime) {
						d = 0;
						KinkyDungeonBullets.splice(E, 1);
						KinkyDungeonBulletsID[b.spriteID] = null;
						KinkyDungeonSendEvent("bulletDestroy", {bullet: b, target: undefined, outOfRange:outOfRange, outOfTime: outOfTime});
						end = true;
						E -= 1;
					}
					if (!((outOfTime || outOfRange) && b.bullet.spell && ((!b.bullet.trail && b.bullet.spell.nonVolatile) || (b.bullet.trail && b.bullet.spell.nonVolatileTrail))))
						KinkyDungeonBulletHit(b, 1.1, outOfTime, outOfRange, delta - d);
				}
				if (endTime) b.time = 0;
				// Update the bullet's visual position
				KinkyDungeonUpdateSingleBulletVisual(b, end);
			}
			if (!end) {
				let show = KDFactionRelation("Player", b.bullet.faction) < 0.5 && (
					(b.bullet.hit == "lingering" || (b.bullet.spell && b.bullet.name == b.bullet.spell.name && (b.bullet.spell.onhit == "aoe" || b.bullet.spell.onhit == "dot")))
					|| ((b.lifetime > 0 || b.lifetime == undefined) && b.bullet.damage && b.bullet.damage.type && b.bullet.damage.type != "heal" && b.bullet.damage.type != "inert")
				);
				let bxx = b.xx;
				let byy = b.yy;
				let bx = b.x;
				let by = b.y;
				let btime = b.time;
				let bborn = b.born;
				// Lookforward
				d = delta;
				first = true;
				startx = bx;
				starty = by;

				b.warnings = [];

				while (d > 0.1) {
					if (!first && delta > 0) {
						let dt = (d - Math.max(0, d - 1))/Math.sqrt(Math.max(1, b.vx*b.vx+b.vy*b.vy));
						if (bborn >= 0) bborn -= 1;

						let mod = (b.spell && b.spell.speed == 1) ? 1 : 0;
						if (bborn < mod) {
							bxx += b.vx * dt;
							byy += b.vy * dt;
							btime -= delta;
						}

						bx = Math.round(bxx);
						by = Math.round(byy);

						d -= dt;
					} else first = false;

					let outOfRange = false;
					if (b.bullet && b.bullet.origin) {
						let dist = Math.sqrt((b.bullet.origin.x - bx) * (b.bullet.origin.x - bx) + (b.bullet.origin.y - by) * (b.bullet.origin.y - by));
						if (dist > b.bullet.range) outOfRange = true;
					}
					let outOfTime = (b.bullet.lifetime != 0 && btime <= 0.001);
					let checkCollision = bx != startx || by != starty || (!b.vx && !b.vy) || (KDistEuclidean(b.vx, b.vy) < 0.9) || b.bullet.aoe; // Check collision for bullets only once they leave their square or if they are slower than one
					if (outOfTime || outOfRange) {
						d = 0;
					} else if (checkCollision) {
						let rad = b.bullet.aoe ? b.bullet.aoe : ((b.bullet.spell && b.bullet.spell.aoe && b.bullet.name == b.bullet.spell.name) ? b.bullet.spell.aoe : 0);
						for (let xx = bx - Math.floor(rad); xx <= bx + Math.ceil(rad); xx++) {
							for (let yy = by - Math.floor(rad); yy <= by + Math.ceil(rad); yy++) {
								if (KDistEuclidean(bx - xx, by - yy) <= rad) {
									if (show && !KDBulletWarnings.some((w) => {return w.x == xx && w.y == yy;}))
										KDBulletWarnings.push({x: xx, y: yy, color:b.bullet.spell ? (b.bullet.spell.color ? b.bullet.spell.color : "#ff0000") : "#ff0000"});
									if (!b.warnings.includes(xx + "," + yy)) {
										b.warnings.push(xx + "," + yy);
									}
								}
							}
						}
					}
				}
			}


			// A bullet can only damage an enemy in one location at a time
			// Resets at the end of the bullet update!
			// But only for piercing bullets. Non-piercing bullets just expire
			if (!b.bullet.piercing && !b.bullet.noDoubleHit)
				b.alreadyHit = undefined;
		}
	}
}

function KinkyDungeonUpdateSingleBulletVisual(b, end, delay) {
	if (b.spriteID && !b.bullet.noSprite) {
		let bb = KinkyDungeonBulletsVisual.get(b.spriteID);
		let scale = bb ? bb.scale : 0;
		let dd = bb ? bb.delay : delay;
		let visx = bb ? bb.visual_x : b.visual_x;
		let visy = bb ? bb.visual_y : b.visual_y;
		if (!visx) visx = b.xx;
		if (!visy) visy = b.yy;
		KinkyDungeonBulletsVisual.set(b.spriteID, {end: end, name: b.bullet.name, spriteID: b.spriteID, size: b.bullet.width ? b.bullet.width : 1, vx: b.vx, vy: b.vy, xx: b.xx, yy: b.yy, visual_x: visx, visual_y: visy, updated: true, scale: scale, delay: dd});
	}
}

function KinkyDungeonUpdateBulletVisuals(delta) {
	if (delta > 0)
		for (let b of KinkyDungeonBulletsVisual.entries()) {
			if (b[1].updated) {
				b[1].updated = false;
			} else KinkyDungeonBulletsVisual.delete(b[0]);
		}
}

let KinkyDungeonCurrentTick = 0;

function KinkyDungeonUpdateBulletsCollisions(delta, Catchup) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		let b = KinkyDungeonBullets[E];
		if ((!Catchup && !b.secondary) || (Catchup && b.secondary)) {
			if (!KinkyDungeonBulletsCheckCollision(b, b.time >= 0, undefined, undefined, !(b.bullet.faction == "Player" || (!b.vx && !b.vy) || b.bullet.aoe || (KDistEuclidean(b.vx, b.vy) < 0.9)))) { // (b.bullet.faction == "Player" || (!b.vx && !b.vy) || b.bullet.aoe || (KDistEuclidean(b.vx, b.vy) < 0.9)) &&
				if (!(b.bullet.spell && b.bullet.spell.piercing)) {
					KinkyDungeonBullets.splice(E, 1);
					KinkyDungeonBulletsID[b.spriteID] = null;
					KinkyDungeonUpdateSingleBulletVisual(b, true);
					KinkyDungeonSendEvent("bulletDestroy", {bullet: b, target: undefined, outOfRange:false, outOfTime: false});
					E -= 1;
				}
				KinkyDungeonBulletHit(b, 1);
			}
		}
	}
}

function KinkyDungeonBulletHit(b, born, outOfTime, outOfRange, d) {
	if (b.bullet.hit && b.bullet.spell && b.bullet.spell.landsfx) {
		if (KinkyDungeonSound && KinkyDungeonLightGet(b.x, b.y) > 0) {
			KDDamageQueue.push({sfx: KinkyDungeonRootDirectory + "/Audio/" + b.bullet.spell.landsfx + ".ogg"});
		}
		//KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + b.bullet.spell.landsfx + ".ogg");
	}

	KinkyDungeonSendEvent("beforeBulletHit", {bullet: b, target: undefined, outOfRange:outOfRange, outOfTime: outOfTime});

	if (b.bullet.cast && (!b.bullet.cast.chance || KDRandom() < b.bullet.cast.chance) && (!b.bullet.spell || !b.bullet.spell.noCastOnHit)) {
		let xx = b.bullet.cast.tx;
		let yy = b.bullet.cast.ty;
		if (!xx) xx = b.x;
		if (!yy) yy = b.y;
		KinkyDungeonCastSpell(xx, yy, KinkyDungeonFindSpell(b.bullet.cast.spell, true), undefined, undefined, b);
	}

	if (b.bullet.hit == "") {
		let newB = {born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Hit" + CommonTime(), bullet:{faction: b.bullet.faction, lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}};
		KinkyDungeonBullets.push(newB);
		KinkyDungeonUpdateSingleBulletVisual(newB, false, d);
	} else if (b.bullet.hit == "aoe") {
		let newB = {secondary: true, born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Hit" + CommonTime(),
			bullet:{faction: b.bullet.faction, spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, bind: b.bullet.spell.bind, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}};
		KinkyDungeonBullets.push(newB);
		KinkyDungeonUpdateSingleBulletVisual(newB, false, d);
	} else if (b.bullet.hit == "instant") {
		if (!KinkyDungeonBulletsCheckCollision(b, true, true, d)) {
			if (!(b.bullet.spell && b.bullet.spell.piercing)) {
				KinkyDungeonBullets.splice(KinkyDungeonBullets.indexOf(b), 1);
				KinkyDungeonBulletsID[b.spriteID] = null;
				KinkyDungeonUpdateSingleBulletVisual(b, true, d);
				KinkyDungeonSendEvent("bulletDestroy", {bullet: b, target: undefined, outOfRange:outOfRange, outOfTime: outOfTime});
			}
		}
		let newB = {born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Hit" + CommonTime(), bullet:{faction: b.bullet.faction, lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}};
		KinkyDungeonBullets.push(newB);
		KinkyDungeonUpdateSingleBulletVisual(newB, false);
	} else if (b.bullet.hit == "lingering") {
		let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad) {
					let dd = KDistEuclidean(X, Y) / rad;
					let LifetimeBonus = (b.bullet.spell.lifetimeHitBonus) ? Math.floor(KDRandom() * b.bullet.spell.lifetimeHitBonus) : 0;
					let newB = {delay: dd, born: born, time:b.bullet.spell.lifetime + LifetimeBonus, x:b.x+X, y:b.y+Y, vx:0, vy:0, xx:b.x+X, yy:b.y+Y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Hit" + CommonTime(),
						bullet:{faction: b.bullet.faction, spell:b.bullet.spell, block: (b.bullet.blockhit ? b.bullet.blockhit : 0), damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, bind: b.bullet.spell.bind, time:b.bullet.spell.time}, lifetime: b.bullet.spell.lifetime + LifetimeBonus, name:b.bullet.name+"Hit", width:1, height:1}};
					KinkyDungeonBullets.push(newB);
					KinkyDungeonUpdateSingleBulletVisual(newB, false, dd);
				}
			}

	} else if (b.bullet.hit == "heal") {
		let newB = {born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Hit" + CommonTime(),
			bullet:{faction: b.bullet.faction, spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, bind: b.bullet.spell.bind, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}};
		KinkyDungeonBullets.push(newB);
		KinkyDungeonUpdateSingleBulletVisual(newB, false);

		if (b.bullet.spell && (b.bullet.spell.playerEffect || b.bullet.playerEffect) && KDistEuclidean(b.x - KinkyDungeonPlayerEntity.x, b.y - KinkyDungeonPlayerEntity.y) < b.bullet.spell.aoe) {
			KinkyDungeonPlayerEffect(b.bullet.damage.type, b.bullet.playerEffect ? b.bullet.playerEffect : b.bullet.spell.playerEffect, b.bullet.spell, b.bullet.faction);
		}
		for (let enemy of KinkyDungeonEntities) {
			if ((b.reflected
				|| (!b.bullet.spell || !b.bullet.faction
					|| (!KDFactionHostile(b.bullet.faction, enemy))
				))
				&& ((enemy.x == b.x && enemy.y == b.y) || (b.bullet.spell && b.bullet.spell.aoe && KDistEuclidean(b.x - enemy.x, b.y - enemy.y) < b.bullet.spell.aoe))) {
				let origHP = enemy.hp;
				enemy.hp = Math.min(enemy.hp + b.bullet.spell.power, enemy.Enemy.maxhp);
				//KDDamageQueue.push({floater: `+${Math.round((enemy.hp - origHP) * 10)}`, Entity: enemy, Color: "#ffaa00", Time: 3});
				if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0)
					KinkyDungeonSendFloater(enemy, `+${Math.round((enemy.hp - origHP) * 10)}`, "#ffaa00", 3);
				if (b.bullet.faction == "Player")
					KDHealRepChange(enemy, enemy.hp - origHP);
			}
		}
	} else if (b.bullet.hit == "cast" && b.bullet.spell && b.bullet.spell.spellcasthit) {
		let cast = b.bullet.spell.spellcasthit;
		let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad && (!cast.chance || KDRandom() < cast.chance)) {
					let spell = KinkyDungeonFindSpell(cast.spell, true);
					let xx = b.x + X;
					let yy = b.y + Y;
					KinkyDungeonCastSpell(xx, yy, spell, undefined, undefined, b);
				}
			}
	} else if (b.bullet.hit == "teleport") {
		if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(b.x, b.y))) {
			let newB = {born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Hit" + CommonTime(),
				bullet:{faction: b.bullet.faction, spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, boundBonus: b.bullet.spell.boundBonus, bind: b.bullet.spell.bind, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}};
			KinkyDungeonBullets.push(newB);
			KinkyDungeonUpdateSingleBulletVisual(newB, false);

			KinkyDungeonMoveTo(b.x, b.y);
		}
	}

	if (b.bullet.summon && b.bullet.summon) {
		let created = 0;
		let type = "";
		for (let sum of b.bullet.summon) {
			if (!sum.chance || KDRandom() < sum.chance) {
				let summonType = sum.name; // Second operand is the enemy type
				if (!type) type = summonType;
				let count = sum.count ? sum.count : 1;
				let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
				if (count > 0) {
					let faction = (b.bullet.spell && b.bullet.spell.defaultFaction) ? undefined : b.bullet.faction;
					if (!faction && b.bullet.spell && b.bullet.spell.enemySpell) faction = "Enemy";
					else if (!faction && b.bullet.spell && b.bullet.spell.allySpell) faction = "Player";

					if (b.bullet.faction) faction = b.bullet.faction;
					let e = KinkyDungeonSummonEnemy(b.x, b.y, summonType, count, rad, sum.strict, sum.time ? sum.time : undefined, sum.hidden, sum.goToTarget, faction, faction && KDFactionRelation("Player", faction) <= -0.5, sum.minRange);
					created += e;
				}
			}
		}
		if (!b.bullet.spell || !b.bullet.spell.noSumMsg) {
			if (created == 1) KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSummonSingle"+type), "white", 2, undefined, undefined, b);
			else if (created > 1) KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonSummonMulti"+type).replace("SummonCount", "" + created), "white", 3, undefined, undefined, b);
		}
	}
}


function KinkyDungeonSummonEnemy(x, y, summonType, count, rad, strict, lifetime, hidden, goToTarget, faction, hostile, minrad) {
	let slots = [];
	for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
		for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
			if (Math.sqrt(X*X+Y*Y) <= rad && (!minrad || Math.sqrt(X*X+Y*Y) >= minrad)) {
				if ((x + X > 0 && y + Y > 0 && x + X < KinkyDungeonGridWidth && y + Y < KinkyDungeonGridHeight))
					slots.push({x:X, y:Y});
			}
		}

	if (slots.length == 0) return 0;
	let created = 0;
	let maxcounter = 0;
	let Enemy = KinkyDungeonGetEnemyByName(summonType);
	for (let C = 0; C < count && KinkyDungeonEntities.length < 100 && maxcounter < count * 30; C++) {
		let slot = slots[Math.floor(KDRandom() * slots.length)];
		if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x+slot.x, y+slot.y))
			&& (KinkyDungeonNoEnemy(x+slot.x, y+slot.y, true) || (Enemy.noblockplayer && KDistChebyshev(x+slot.x - KinkyDungeonPlayerEntity.x, y+slot.y - KinkyDungeonPlayerEntity.y) < 1.5))
			&& (!strict || KinkyDungeonCheckPath(x, y, x+slot.x, y+slot.y, false))
			&& (!hidden || KinkyDungeonLightGet(x, y) < 1)) {
			let e = {summoned: true, faction: faction, hostile: hostile ? 100 : undefined, rage: Enemy.summonRage ? 9999 : undefined, Enemy: Enemy, id: KinkyDungeonGetEnemyID(), gx: goToTarget ? KinkyDungeonTargetX : undefined, gy: goToTarget ? KinkyDungeonTargetY : undefined,
				x:x+slot.x, y:y+slot.y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0, lifetime: lifetime, maxlifetime: lifetime};
			KinkyDungeonEntities.push(e);
			created += 1;
		} else C -= 1;
		maxcounter += 1;
	}
	return created;
}

function KinkyDungeonBulletDoT(b) {
	KinkyDungeonBulletHit(b, 1.1);
}

function KinkyDungeonBulletTrail(b) {
	let trail = false;
	if (b.bullet.spell.trail == "lingering" && !b.bullet.trail) {
		let aoe = b.bullet.spell.trailspawnaoe ? b.bullet.spell.trailspawnaoe : 0.0;
		let rad = Math.ceil(aoe/2);
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= aoe && KDRandom() < b.bullet.spell.trailChance) {
					trail = true;
					let newB = {born: 0, time:b.bullet.spell.trailLifetime + (b.bullet.spell.trailLifetimeBonus ? Math.floor(KDRandom() * b.bullet.spell.trailLifetimeBonus) : 0), x:b.x + X, y:b.y + Y, vx:0, vy:0, xx:b.x + X, yy:b.y + Y, spriteID: KinkyDungeonGetEnemyID() + b.bullet.name+"Trail" + CommonTime(),
						bullet:{faction: b.bullet.faction, trail: true, hit: b.bullet.spell.trailHit, spell:b.bullet.spell, playerEffect:b.bullet.spell.trailPlayerEffect, damage: {damage:b.bullet.spell.trailPower, type:b.bullet.spell.trailDamage, boundBonus: b.bullet.spell.boundBonus, bind: b.bullet.spell.trailBind, time:b.bullet.spell.trailTime}, lifetime: b.bullet.spell.trailLifetime, name:b.bullet.name+"Trail", width:1, height:1}};
					KinkyDungeonBullets.push(newB);
					KinkyDungeonUpdateSingleBulletVisual(newB, false);
				}
			}
	} else if (b.bullet.spell.trail == "cast" && !b.bullet.trail && b.bullet.spell && b.bullet.spell.trailcast) {
		let aoe = b.bullet.spell.trailspawnaoe ? b.bullet.spell.trailspawnaoe : 0.0;
		let rad = Math.ceil(aoe/2);
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= aoe && KDRandom() < b.bullet.spell.trailChance) {
					trail = true;
					let cast = b.bullet.spell.trailcast;
					let spell = KinkyDungeonFindSpell(cast.spell, true);
					if (spell) {
						KinkyDungeonCastSpell(b.x + X, b.y + Y, spell, undefined, undefined, undefined);
					}
				}
			}
	}
	return trail;
}

function KinkyDungeonBulletsCheckCollision(bullet, AoE, force, d, inWarningOnly) {
	let mapItem = KinkyDungeonMapGet(bullet.x, bullet.y);
	if (!bullet.bullet.passthrough && !bullet.bullet.piercing && !KinkyDungeonOpenObjects.includes(mapItem)) return false;
	if (bullet.bullet.noEnemyCollision) return true;

	if (bullet.delay && !d) d = bullet.delay;

	if (bullet.bullet.damage && (bullet.time > 0 || force)) {
		if (bullet.bullet.aoe) {
			if (AoE) {
				if (bullet.bullet.spell && (bullet.bullet.spell.playerEffect || bullet.bullet.playerEffect) && bullet.bullet.aoe >= Math.sqrt((KinkyDungeonPlayerEntity.x - bullet.x) * (KinkyDungeonPlayerEntity.x - bullet.x) + (KinkyDungeonPlayerEntity.y - bullet.y) * (KinkyDungeonPlayerEntity.y - bullet.y))) {
					KinkyDungeonPlayerEffect(bullet.bullet.damage.type, bullet.bullet.playerEffect ? bullet.bullet.playerEffect : bullet.bullet.spell.playerEffect, bullet.bullet.spell, bullet.bullet.faction);
				}
				let nomsg = bullet.bullet && bullet.bullet.spell && bullet.bullet.spell.enemyspell && !bullet.reflected;
				for (let enemy of KinkyDungeonEntities) {
					if ((bullet.reflected
						|| (!bullet.bullet.spell || !bullet.bullet.faction
							|| (!KDFactionAllied(bullet.bullet.faction, enemy) && (!bullet.bullet.damage || bullet.bullet.damage.type != "heal"))
							|| (!KDFactionHostile(bullet.bullet.faction, enemy) && (bullet.bullet.damage && bullet.bullet.damage.type == "heal"))
						))
							&& bullet.bullet.aoe >= Math.sqrt((enemy.x - bullet.x) * (enemy.x - bullet.x) + (enemy.y - bullet.y) * (enemy.y - bullet.y))) {
						KinkyDungeonSendEvent("bulletHitEnemy", {bullet: bullet, enemy: enemy});
						if (bullet.bullet.damage.type == "heal") {
							let origHP = enemy.hp;
							enemy.hp = Math.min(enemy.hp + bullet.bullet.spell.power, enemy.Enemy.maxhp);
							if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0)
								KinkyDungeonSendFloater(enemy, `+${Math.round((enemy.hp - origHP) * 10)}`, "#ffaa00", 3);
							if (bullet.bullet.faction == "Player")
								KDHealRepChange(enemy, enemy.hp - origHP);
						} else if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0)
							KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, nomsg, bullet.bullet.spell, bullet, undefined, d);
						nomsg = true;
					}
				}
			}
		} else {
			if (bullet.bullet.spell && (bullet.bullet.spell.playerEffect || bullet.bullet.playerEffect)
				&& KinkyDungeonPlayerEntity.x == bullet.x && KinkyDungeonPlayerEntity.y == bullet.y
				&& (!inWarningOnly || (bullet.warnings && bullet.warnings.includes(KinkyDungeonPlayerEntity.lastx + "," + KinkyDungeonPlayerEntity.lasty)))) {
				KinkyDungeonPlayerEffect(bullet.bullet.damage.type, bullet.bullet.playerEffect ? bullet.bullet.playerEffect : bullet.bullet.spell.playerEffect, bullet.bullet.spell, bullet.bullet.faction);
				return false;
			}
			for (let enemy of KinkyDungeonEntities) {
				if ((bullet.reflected
					|| (!bullet.bullet.spell || !bullet.bullet.faction
						|| (!KDFactionAllied(bullet.bullet.faction, enemy) && (!bullet.bullet.damage || bullet.bullet.damage.type != "heal"))
						|| (!KDFactionHostile(bullet.bullet.faction, enemy) && (bullet.bullet.damage && bullet.bullet.damage.type == "heal"))
					))
						&& (enemy.x == bullet.x && enemy.y == bullet.y)
						&& (!inWarningOnly || (bullet.warnings && bullet.warnings.includes(enemy.lastx + "," + enemy.lasty)))) {
					KinkyDungeonSendEvent("bulletHitEnemy", {bullet: bullet, enemy: enemy});
					if (bullet.bullet.damage.type == "heal") {
						let origHP = enemy.hp;
						enemy.hp = Math.min(enemy.hp + bullet.bullet.spell.power, enemy.Enemy.maxhp);
						if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0)
							KinkyDungeonSendFloater(enemy, `+${Math.round((enemy.hp - origHP) * 10)}`, "#ffaa00", 3);
						if (bullet.bullet.faction == "Player")
							KDHealRepChange(enemy, enemy.hp - origHP);
					} else if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0)
						KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, bullet.bullet.NoMsg, bullet.bullet.spell, bullet, undefined, d);

					return false;
				}
			}
		}
	}
	if (!(bullet.bullet.block > 0) && bullet.vx != 0 || bullet.vy != 0) {

		for (let b2 of KinkyDungeonBullets) {
			if (b2 != bullet && b2.bullet.block > 0 && b2.x == bullet.x && b2.y == bullet.y) {
				b2.bullet.block -= bullet.bullet.damage.damage;
				if (b2.bullet.block <= 0) b2.bullet.block = -1;

				return false;
			}
		}
	} else if (bullet.bullet.block == -1) return false; // Shields expire

	if (bullet.bullet.lifetime == -1) return false; // Instant spells

	if (!bullet.bullet.passthrough && !KinkyDungeonOpenObjects.includes(mapItem)) return false;
	return true;
}


function KinkyDungeonLaunchBullet(x, y, targetx, targety, speed, bullet, miscast) {
	let direction = (!targetx && !targety) ? 0 : Math.atan2(targety, targetx);
	let vx = (targetx != 0 && targetx != undefined) ? Math.cos(direction) * speed : 0;
	let vy = (targety != 0 && targetx != undefined) ? Math.sin(direction) * speed : 0;
	let lifetime = bullet.lifetime;
	if (miscast) {
		vx = 0;
		vy = 0;
		//lifetime = 1;
	}
	let b = {born: 1, time:lifetime, x:x, y:y, vx:vx, vy:vy, xx:x, yy:y, spriteID: KinkyDungeonGetEnemyID() + bullet.name + CommonTime(), bullet:bullet, trail:bullet.spell.trail};
	KinkyDungeonBullets.push(b);
	KinkyDungeonUpdateSingleBulletVisual(b, false);
	return b;
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let damage of KDDamageQueue) {
		if (!damage.Delay || KDTimescale * (performance.now() - KDLastTick) > damage.Delay) {
			if (damage.sfx && KinkyDungeonSound) KinkyDungeonPlaySound(damage.sfx);

			if (damage.floater) {
				KinkyDungeonSendFloater(damage.Entity, damage.floater, damage.Color, damage.Time);
			}

			KDDamageQueue.splice(KDDamageQueue.indexOf(damage), 1);
		}
	}

	for (let t of KDBulletWarnings) {
		let tx = t.x;
		let ty = t.y;
		//  && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))
		if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay) {
			if (t.color)
				DrawImageCanvasColorize(KinkyDungeonRootDirectory + "WarningColorSpecialBasic.png", KinkyDungeonContext,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
					t.color, true, []);
			else
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "WarningSpecialBasic.png",
					KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
		}
	}

	for (let bullet of KinkyDungeonBulletsVisual.values()) {
		if (!bullet.delay || KDTimescale * (performance.now() - KDLastTick) > bullet.delay) {
			let sprite = bullet.name;
			let spriteCanvas = KinkyDungeonBulletsID[bullet.spriteID];
			if (!spriteCanvas) {
				spriteCanvas = document.createElement("canvas");
				spriteCanvas.width = bullet.size*KinkyDungeonSpriteSize;
				spriteCanvas.height = bullet.size*KinkyDungeonSpriteSize;
				KinkyDungeonBulletsID[bullet.spriteID] = spriteCanvas;

			}

			let Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + ".png");

			let spriteContext = spriteCanvas.getContext("2d");
			let direction = (!bullet.vy && !bullet.vx) ? 0 : Math.atan2(bullet.vy, bullet.vx);

			// Rotate the canvas m
			spriteContext.translate(spriteCanvas.width/2, spriteCanvas.height/2);
			spriteContext.rotate(direction);
			spriteContext.translate(-spriteCanvas.width/2, -spriteCanvas.height/2);

			// Draw the sprite
			spriteContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
			spriteContext.drawImage(Img, 0, 0);

			// Reset the transformation
			spriteContext.setTransform(1, 0, 0, 1, 0, 0);

			let dd = KinkyDungeonUpdateVisualPosition(bullet, KinkyDungeonDrawDelta);
			let tx = bullet.visual_x;
			let ty = bullet.visual_y;
			let scale = bullet.scale != undefined ? bullet.scale : 1.0;

			if (bullet.end && dd == 0 && (!bullet.scale || bullet.scale <= 0.0)) {
				KinkyDungeonBulletsVisual.delete(bullet.spriteID);
			} else if (bullet.xx >= CamX && bullet.yy >= CamY && bullet.xx < CamX + KinkyDungeonGridWidthDisplay && bullet.yy < CamY + KinkyDungeonGridHeightDisplay) {
				KinkyDungeonContext.drawImage(spriteCanvas,
					(tx - CamX + 0.5 - 0.5*scale*(bullet.size))*KinkyDungeonGridSizeDisplay,
					(ty - CamY + 0.5 - 0.5*scale*(bullet.size))*KinkyDungeonGridSizeDisplay,
					bullet.size*scale*KinkyDungeonGridSizeDisplay,
					bullet.size*scale*KinkyDungeonGridSizeDisplay);
			}
			bullet.delay = undefined;
		}
	}
}

function KinkyDungeonSendWeaponEvent(Event, data) {
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.events) {
		for (let e of KinkyDungeonPlayerDamage.events) {
			if (e.trigger == Event && (!e.requireEnergy || ((!e.energyCost && KDGameData.AncientEnergyLevel > 0) || (e.energyCost && KDGameData.AncientEnergyLevel > e.energyCost)))) {
				KinkyDungeonHandleWeaponEvent(Event, e, KinkyDungeonPlayerDamage, data);
			}
		}
	}
}

function KinkyDungeonSendBulletEvent(Event, b, data) {
	if (b && b.bullet && b.bullet.events)
		for (let e of b.bullet.events) {
			if (e.trigger == Event) {
				KinkyDungeonHandleBulletEvent(Event, e, b, data);
			}
		}
}


function KDHealRepChange(enemy, amount) {
	// De-aggro an enemy if you heal them to full
	if (enemy.hostile && amount > 0) {
		if (enemy.hp >= enemy.Enemy.maxhp - 0.5) {
			enemy.hostile = 0;
		}
	} else if ((!enemy.allied || enemy.allied <= 400) && amount > 0) {
		// Befriend enemies if you save them
		if (enemy.hp <= 0.25 * enemy.Enemy.maxhp && enemy.allied <= 400) {
			enemy.allied = 400;
		} else if (enemy.allied < 15) enemy.allied = 15;
	}
	// Raise rep based on amount
	let amountRep = amount * 0.001;
	if (KDHostile(enemy)) amountRep *= 0.5;
	else if (KDFactionRelation("Player", KDGetFactionOriginal(enemy)) > 0.45) amountRep *= 0;
	else if (KDFactionRelation("Player", KDGetFactionOriginal(enemy)) > 0.35) amountRep *= 0.25;
	else if (KDFactionRelation("Player", KDGetFactionOriginal(enemy)) > 0.25) amountRep *= 0.5;
	if (amountRep > 0 && !KinkyDungeonHiddenFactions.includes(KDGetFactionOriginal(enemy))) {
		if (amountRep > 0.01) amountRep = 0.01;
		KinkyDungeonChangeFactionRep(KDGetFactionOriginal(enemy), amountRep);
	}
}