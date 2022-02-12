"use strict";
let KinkyDungeonKilledEnemy = null;
let KinkyDungeonAlert = 0;

let KinkyDungeonMissChancePerBlind = 0.15; // Max 3
let KinkyDungeonMissChancePerSlow = 0.1; // Max 3
let KinkyDungeonBullets = []; // Bullets on the game board
let KinkyDungeonBulletsID = {}; // Bullets on the game board

let KinkyDungeonOpenObjects = KinkyDungeonTransparentObjects; // Objects bullets can pass thru
let KinkyDungeonMeleeDamageTypes = ["unarmed", "crush", "slash", "pierce", "grope", "pain", "chain", "tickle"];
let KinkyDungeonHalfDamageTypes = ["tickle", "charm", "drain"];

// Weapons
let KinkyDungeonPlayerWeapon = null;
let KinkyDungeonPlayerDamageDefault = {dmg: 2, chance: 0.9, type: "unarmed", unarmed: true, sfx: "Unarmed"};
let KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault;

/**
 * @type {Record<string, KinkyDungeonWeapon>}
 */
let KinkyDungeonWeapons = {
	"Knife": {name: "Knife", dmg: 2.5, chance: 0.9, type: "unarmed", unarmed: false, rarity: 0, shop: false, noequip: true, sfx: "Unarmed"},
	"Sword": {name: "Sword", dmg: 3, chance: 1.5, staminacost: 1.0, type: "slash", unarmed: false, rarity: 2, shop: true, cutBonus: 0.1, sfx: "LightSwing"},
	"Feather": {name: "Feather", dmg: 1, chance: 2.0, staminacost: 0.1, type: "tickle", unarmed: false, rarity: 1, shop: true, sfx: "Tickle"},
	"IceCube": {name: "IceCube", dmg: 1, chance: 1.0, staminacost: 0.5, type: "ice", unarmed: false, rarity: 1, shop: true, sfx: "Freeze",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "ice", time: 3, chance: 0.1}]},
	"VibeWand": {name: "VibeWand", dmg: 1, chance: 1.0, staminacost: 0.1, type: "charm", unarmed: false, rarity: 1, shop: true, sfx: "Vibe",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "stun", time: 1, chance: 0.5}]},
	"MagicSword": {name: "MagicSword", dmg: 3, chance: 2, staminacost: 1.0, type: "slash", unarmed: false, rarity: 4, shop: false, magic: true, cutBonus: 0.2, sfx: "LightSwing"},
	"Axe": {name: "Axe", dmg: 4, chance: 1.0, staminacost: 2, type: "slash", unarmed: false, rarity: 2, shop: true, sfx: "HeavySwing",
		events: [{type: "Cleave", trigger: "playerAttack", power: 2, damage: "slash"}]},
	"Hammer": {name: "Hammer", dmg: 5, chance: 1.0, staminacost: 3, type: "crush", unarmed: false, rarity: 2, shop: true, sfx: "HeavySwing",
		events: [{type: "Knockback", trigger: "playerAttack", dist: 1}]},
	"Flail": {name: "Flail", dmg: 2.5, chance: 1.25, staminacost: 1, type: "crush", unarmed: false, rarity: 2, shop: true, sfx: "LightSwing",
		events: [{type: "Cleave", trigger: "playerAttack", power: 1, damage: "crush"}]},
	"Spear": {name: "Spear", dmg: 4.0, chance: 1.0, staminacost: 2.0, type: "pierce", unarmed: false, rarity: 2, shop: true, sfx: "LightSwing",
		events: [{type: "Pierce", trigger: "playerAttack", power: 3.5, damage: "pierce"}]},
	"StaffBind": {name: "StaffBind", dmg: 2, chance: 1.0, staminacost: 1.0, type: "chain", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "ElementalEffect", trigger: "playerAttack", power: 0, damage: "chain", time: 4}]},
	"StaffFlame": {name: "StaffFlame", dmg: 5, chance: 0.7, staminacost: 2.5, type: "fire", unarmed: false, rarity: 3, shop: true, sfx: "MagicSlash",
		events: [{type: "Buff", trigger: "tick", power: 0.15, buffType: "fireDamageBuff"}]},
	"BoltCutters": {name: "BoltCutters", dmg: 3, staminacost: 1.0, chance: 1.0, type: "crush", unarmed: false, rarity: 3, shop: false, cutBonus: 0.3, sfx: "Unarmed"},
};

function KinkyDungeonFindWeapon(Name) {
	for (let con of Object.values(KinkyDungeonWeapons)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonWeaponCanCut(RequireInteract) {
	if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].cutBonus > 0 && (!RequireInteract || KinkyDungeonPlayer.CanInteract())) return true;
	if (KinkyDungeonPlayerBuffs) {
		for (let b of Object.values(KinkyDungeonPlayerBuffs)) {
			if (b && b.tags && b.tags.includes("allowCut")) return true;
		}
	}
	return false;
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
	if (!HandsFree || (KinkyDungeonNormalBlades + KinkyDungeonEnchantedBlades < 1 && !KinkyDungeonPlayerWeapon)) {
		damage = KinkyDungeonPlayerDamageDefault;
		if (!NoOverride)
			KinkyDungeonPlayerWeapon = null;
	}
	else if (KinkyDungeonNormalBlades + KinkyDungeonEnchantedBlades >= 1 && !KinkyDungeonPlayerWeapon) {
		damage = KinkyDungeonWeapons.Knife;
		if (!NoOverride)
			KinkyDungeonPlayerWeapon = null;
	} else if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon]) {
		damage = KinkyDungeonWeapons[KinkyDungeonPlayerWeapon];
	}

	Object.assign(KinkyDungeonPlayerDamage, damage);

	if (!KinkyDungeonPlayer.CanInteract() && flags.KDDamageHands) {
		KinkyDungeonPlayerDamage.chance /= 2;
	}
	if (KinkyDungeonSlowLevel > 1 && !KinkyDungeonPlayerDamage.name) {
		KinkyDungeonPlayerDamage.dmg /= 2;
	}
	if ((KinkyDungeonPlayer.Pose.includes("Hogtied") || KinkyDungeonPlayer.Pose.includes("Kneel")) && flags.KDDamageHands) {
		KinkyDungeonPlayerDamage.chance /= 1.5;
	}

	return KinkyDungeonPlayerDamage;
}

function KinkyDungeonGetEvasion(Enemy, NoOverride, IsSpell, IsMagic) {
	let flags = {
		KDEvasionHands: true,
		KDEvasionSight: true,
		KDEvasionDeaf: true,
		KDEvasionSlow: true,
	};

	if (!NoOverride)
		KinkyDungeonSendEvent("calcEvasion", {isSpell: IsSpell, isMagic: IsMagic, flags: flags});
	var hitChance = (Enemy && Enemy.buffs) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "Evasion")) : 1.0;
	if (Enemy && Enemy.Enemy && Enemy.Enemy.evasion && (((!Enemy.stun || Enemy.stun < 1) && (!Enemy.freeze || Enemy.freeze < 1)) || Enemy.Enemy.alwaysEvade || Enemy.Enemy.evasion < 0)) hitChance *= Math.max(0, KinkyDungeonMultiplicativeStat(Enemy.Enemy.evasion));
	if (Enemy && Enemy.Enemy && Enemy.Enemy.tags.has("ghost") && (IsMagic || (KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.magic))) hitChance = Math.max(hitChance, 1.0);

	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Accuracy")) {
		hitChance *= KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Accuracy"));
	}

	if (!IsSpell) hitChance *= KinkyDungeonPlayerDamage.chance;
	if (Enemy && Enemy.slow > 0) hitChance *= 2;
	if (Enemy && (Enemy.stun > 0 || Enemy.freeze > 0)) hitChance *= 5;
	if (Enemy && Enemy.bind > 0) hitChance *= 3;

	if (!IsSpell) {
		if (flags.KDEvasionSight)
			hitChance = Math.min(hitChance, Math.max(0.1, hitChance - Math.min(3, KinkyDungeonBlindLevel) * KinkyDungeonMissChancePerBlind));
		if (flags.KDEvasionDeaf &&KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.9;
		if (flags.KDEvasionSlow && KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.name && KinkyDungeonSlowLevel > 0) hitChance *= 1.0 - Math.max(0.5, KinkyDungeonMissChancePerSlow * KinkyDungeonSlowLevel);
	}
	return hitChance;
}

function KinkyDungeonAggro(Enemy) {
	if (Enemy && Enemy.Enemy ) {
		if (Enemy.Enemy.name == "Angel") {
			Enemy.Enemy = KinkyDungeonEnemies.find(element => element.name == "AngelHostile");
			if (KDGameData.KDPenanceStage < 4)
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngelAggro"), "yellow", 2);
		} else if (Enemy.Enemy.tags && (Enemy.Enemy.tags.has("jailer") || Enemy.Enemy.tags.has("jail"))) {
			KinkyDungeonJailTransgressed = true;
		}
	}
}

function KinkyDungeonEvasion(Enemy, IsSpell, IsMagic) {
	let hitChance = KinkyDungeonGetEvasion(Enemy, undefined, IsSpell, IsMagic);

	if (!Enemy) KinkyDungeonSleepTime = 0;

	KinkyDungeonAggro(Enemy);

	if (KDRandom() < hitChance) return true;

	return false;
}

function KinkyDungeonGetImmunity(tags, type, resist) {
	if (tags && tags.has(type + resist)
		|| ((KinkyDungeonMeleeDamageTypes.includes(type) && (type != "unarmed" || !resist.includes("weakness"))) && tags.has("melee" + resist))
		|| (!KinkyDungeonMeleeDamageTypes.includes(type) && tags.has("magic"+resist)))
		return true;
	return false;
}

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg, Spell, bullet, attacker) {
	if (bullet) {
		if (!bullet.alreadyHit) bullet.alreadyHit = [];
		// A bullet can only damage an enemy once per turn
		if (bullet.alreadyHit.includes(Enemy.id)) return 0;
		bullet.alreadyHit.push(Enemy.id);
	}

	let predata = {
		enemy: Enemy,
		spell: Spell,
		bullet: bullet,
		attacker: attacker,
		dmg: (Damage) ? Damage.damage : 0,
		incomingDamage: Damage,
	};
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
	let armor = (Damage && Enemy.Enemy.armor && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) ? Enemy.Enemy.armor : 0;
	if (KinkyDungeonGetBuffedStat(Enemy.buffs, "Armor")) armor += KinkyDungeonGetBuffedStat(Enemy.buffs, "Armor");

	if (Enemy.freeze > 0 && Damage && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
		predata.dmg *= 2;
	}

	let miss = !(!Damage || !Damage.evadeable || KinkyDungeonEvasion(Enemy, (true && Spell), !KinkyDungeonMeleeDamageTypes.includes(Damage.type)));
	if (Damage && !miss) {
		let buffType = Damage.type + "DamageBuff";
		let buffAmount = 1 + ((!Enemy.Enemy || !Enemy.Enemy.allied) ? KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, buffType) : 0);
		predata.dmg *= buffAmount;

		if (Damage.type == "electric" && KinkyDungeonMapGet(Enemy.x, Enemy.y) == 'w') {
			predata.dmg *= 2;
		}

		let time = Damage.time ? Damage.time : 0;
		if (spellResist && !KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
			if (time)
				time = Math.max(0, Math.ceil(time * spellResist));
			predata.dmg = Math.max(0, predata.dmg * spellResist);
		}


		if (Enemy.Enemy.tags) {
			if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "severeweakness")) resistDamage = -2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "weakness")) resistDamage = -1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "immune")) resistDamage = 2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.tags, Damage.type, "resist")) resistDamage = 1;

			if (Enemy.Enemy.tags.has("unstoppable")) resistStun = 2;
			else if (Enemy.Enemy.tags.has("unflinching")) resistStun = 1;
			if (Enemy.Enemy.tags.has("unslowable")) resistSlow = 2;
			else if (Enemy.Enemy.tags.has("slowresist")) resistSlow = 1;

		}

		if (KinkyDungeonHalfDamageTypes.includes(Damage.type) && resistDamage >= 0) predata.dmg *= 0.5;

		if (Damage.type != "inert" && resistDamage < 2) {
			if (resistDamage == 1 || (resistStun > 0 && Damage.type == "stun")) {
				dmgDealt = Math.max(predata.dmg - armor, 0); // Armor goes before resistance
				dmgDealt = dmgDealt*0.5; // Enemies that are vulnerable take either dmg+1 or 1.5x damage, whichever is greater
			} else if (resistDamage == -1) {
				if (predata.dmg > 0)
					dmgDealt = Math.max(predata.dmg+1, predata.dmg*1.5); // Enemies that are vulnerable take either dmg+1 or 1.5x damage, whichever is greater
				else dmgDealt = 0;
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else if (resistDamage == -2) {
				dmgDealt = Math.max(predata.dmg+1, predata.dmg*2); // Enemies that are severely vulnerable take either dmg+1 or 2x damage, whichever is greater
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else {
				dmgDealt = Math.max(predata.dmg - armor, 0);
			}

			if (Enemy.freeze > 0 && (KinkyDungeonMeleeDamageTypes.includes(Damage.type) || Damage.type == "fire")) {
				Enemy.freeze = 0;
			}

			if (Enemy.Enemy.tags && Enemy.Enemy.tags.has("playerinstakill") && attacker && attacker.player) dmgDealt = Enemy.hp;

			if (Spell && Spell.hitsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Spell.hitsfx + ".ogg");
			else if (dmgDealt > 0 && bullet) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/DealDamage.ogg");
			KinkyDungeonSendFloater(Enemy, Math.round(Math.min(dmgDealt, Enemy.hp)*10), "#ff4444");
			Enemy.hp -= dmgDealt;
			if (dmgDealt > 0) Enemy.revealed = true;
		}
		if ((resistStun < 2 && resistDamage < 2) && (Damage.type == "stun" || Damage.type == "electric")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.stun) Enemy.stun = 0;
			if (resistStun == 1 || resistDamage == 1)
				Enemy.stun = Math.max(Enemy.stun, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.stun = Math.max(Enemy.stun, time);
		}
		if ((resistStun < 2 && resistDamage < 2) && (Damage.type == "ice")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.freeze) Enemy.freeze = 0;
			if (resistDamage == 1 || resistStun == 1)
				Enemy.freeze = Math.max(Enemy.freeze, Math.min(Math.floor(time/2), time-1)); // Enemies with ice resistance have freeze reduced to 1/2, and anything that freezes them for one turn doesn't affect them
			else Enemy.freeze = Math.max(Enemy.freeze, time);
		}
		if ((resistStun < 2 && resistDamage < 2) && (Damage.type == "chain" || Damage.type == "glue")) { // Being immune to the damage stops the bind
			effect = true;
			if (!Enemy.bind) Enemy.bind = 0;
			if (resistDamage == 1 || resistStun == 1)
				Enemy.bind = Math.max(Enemy.bind, Math.min(Math.floor(time/2), time-1)); // Enemies with resistance have bind reduced to 1/2, and anything that binds them for one turn doesn't affect them
			else Enemy.bind = Math.max(Enemy.bind, time);
		}
		if ((resistSlow < 2 && resistDamage < 2) && (Damage.type == "slow" || Damage.type == "cold" || Damage.type == "poison")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.slow) Enemy.slow = 0;
			if (resistSlow == 1 || resistDamage == 1)
				Enemy.slow = Math.max(Enemy.slow, Math.min(Math.floor(time/2), time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.slow = Math.max(Enemy.slow, time);
		}
	}

	var atkname = (Spell) ? TextGet("KinkyDungeonSpell" + Spell.name) : TextGet("KinkyDungeonBasicAttack");

	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy;
	}
	let mod = "";
	if (resistDamage == 1) mod = "Weak";
	if (resistDamage == 2) mod = "Immune";
	if (resistDamage == -1) mod = "Strong";
	if (resistDamage == -2) mod = "VeryStrong";
	if (!NoMsg && (dmgDealt > 0 || !Spell || effect)) KinkyDungeonSendActionMessage(4, (Damage && dmgDealt > 0) ?
		TextGet((Ranged) ? "PlayerRanged" + mod : "PlayerAttack" + mod).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("AttackName", atkname).replace("DamageDealt", "" + Math.round(dmgDealt * 10))
		: TextGet("PlayerMiss" + ((Damage && !miss) ? "Armor" : "")).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)),
			(Damage && (predata.dmg > 0 || effect)) ? "orange" : "red", 2);

	if (Enemy && Enemy.Enemy && Enemy.Enemy.AI == "ambush" && Spell) {
		Enemy.ambushtrigger = true;
	}

	KinkyDungeonAggro(Enemy);

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

			KinkyDungeonPlayerWeapon = "";
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			for (let I = 0; I < KinkyDungeonInventory.length; I++) {
				let item = KinkyDungeonInventory[I];
				if (item && item.weapon && item.weapon.name == weapon) {
					KinkyDungeonInventory.splice(I, 1);
					break;
				}
			}

			KinkyDungeonGroundItems.push(dropped);
			KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonDisarm"), "red", 2);

			return true;
		}
	}
	return false;
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	let disarm = false;
	if (Enemy.Enemy && Enemy.Enemy.disarm && Enemy.disarmflag >= 0.97 && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.type != "unarmed") {
		Enemy.disarmflag = 0;
		disarm = true;
	}
	let evaded = KinkyDungeonEvasion(Enemy);
	let dmg = Damage;
	let buffdmg = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg");
	let predata = {
		evaded: evaded,
		disarm: disarm,
		eva: !disarm && evaded,
		Damage: Damage,
		buffdmg: buffdmg,
	};
	KinkyDungeonSendEvent("beforePlayerAttack", predata);

	if (predata.buffdmg) dmg.damage = Math.max(0, dmg.damage + predata.buffdmg);

	KinkyDungeonDamageEnemy(Enemy, (predata.eva) ? dmg : null, undefined, undefined, undefined, undefined, KinkyDungeonPlayerEntity);
	if (predata.eva && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.sfx) {
		if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonPlayerDamage.sfx + ".ogg");
	} else if (!predata.eva) if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	if (disarm) {
		KinkyDungeonDisarm(Enemy);
	}
	if (!KinkyDungeonPlayerDamage || !KinkyDungeonPlayerDamage.silent || !(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") > 0)) {
		KinkyDungeonAlert = 4;
	} else {
		if (!KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") < 2)
			KinkyDungeonAlert = 1;
		else if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence") < 3) {
			Enemy.aware = true;
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
	if (predata.eva)
		KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "hit", 1);
}

function KinkyDungeonUpdateBullets(delta) {
	if (delta > 0)
		for (let b of KinkyDungeonBullets) {
			if (b.bullet && b.bullet.dot) {
				KinkyDungeonBulletDoT(b);
			}
		}

	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		let b = KinkyDungeonBullets[E];
		let d = delta;
		let first = true;
		let trailSquares = [];

		while (d > 0.1) {
			if (!first && delta > 0) {
				let dt = (d - Math.max(0, d - 1))/Math.sqrt(Math.max(1, b.vx*b.vx+b.vy*b.vy));
				if (b.born >= 0) b.born -= 1;

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
			if (!KinkyDungeonBulletsCheckCollision(b) || outOfTime || outOfRange) {
				if (!(b.bullet.spell && ((!b.bullet.trail && b.bullet.spell.piercing) || (b.bullet.trail && b.bullet.spell.piercingTrail))) || outOfRange || outOfTime) {
					d = 0;
					KinkyDungeonBullets.splice(E, 1);
					KinkyDungeonBulletsID[b.spriteID] = null;
					E -= 1;
				}
				if (!((outOfTime || outOfRange) && b.bullet.spell && ((!b.bullet.trail && b.bullet.spell.nonVolatile) || (b.bullet.trail && b.bullet.spell.nonVolatileTrail))))
					KinkyDungeonBulletHit(b, 1.1, outOfTime, outOfRange);
			}
			if (endTime) b.time = 0;
		}
		// A bullet can only damage an enemy in one location at a time
		// Resets at the end of the bullet update!
		// But only for piercing bullets. Non-piercing bullets just expire
		if (!b.bullet.piercing && !b.bullet.noDoubleHit)
			b.alreadyHit = undefined;
	}
}

let KinkyDungeonCurrentTick = 0;

function KinkyDungeonUpdateBulletsCollisions(delta, Catchup) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E];
		if ((!Catchup && !b.secondary) || (Catchup && b.secondary)) {
			if (!KinkyDungeonBulletsCheckCollision(b, b.time >= 0)) {
				if (!(b.bullet.spell && b.bullet.spell.piercing)) {
					KinkyDungeonBullets.splice(E, 1);
					KinkyDungeonBulletsID[b.spriteID] = null;
					E -= 1;
				}
				KinkyDungeonBulletHit(b, 1);
			}
		}
	}
}

function KinkyDungeonBulletHit(b, born, outOfTime, outOfRange) {
	if (b.bullet.hit && b.bullet.spell && b.bullet.spell.landsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + b.bullet.spell.landsfx + ".ogg");

	KinkyDungeonSendEvent("bulletHit", {bullet: b, target: undefined, outOfRange:outOfRange, outOfTime: outOfTime});

	if (b.bullet.cast && (!b.bullet.cast.chance || KDRandom() < b.bullet.cast.chance)) {
		let xx = b.bullet.cast.tx;
		let yy = b.bullet.cast.ty;
		if (!xx) xx = b.x;
		if (!yy) yy = b.y;
		KinkyDungeonCastSpell(xx, yy, KinkyDungeonFindSpell(b.bullet.cast.spell, true), undefined, undefined, b);
	}

	if (b.bullet.hit == "") {
		KinkyDungeonBullets.push({born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(), bullet:{lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	} else if (b.bullet.hit == "aoe") {
		KinkyDungeonBullets.push({secondary: true, born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	} else if (b.bullet.hit == "lingering") {
		let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad) {
					let LifetimeBonus = (b.bullet.spell.lifetimeHitBonus) ? Math.floor(KDRandom() * b.bullet.spell.lifetimeHitBonus) : 0;
					KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime + LifetimeBonus, x:b.x+X, y:b.y+Y, vx:0, vy:0, xx:b.x+X, yy:b.y+Y, spriteID:b.bullet.name+"Hit" + CommonTime(),
						bullet:{spell:b.bullet.spell, block: (b.bullet.blockhit ? b.bullet.blockhit : 0), damage: {damage:b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, lifetime: b.bullet.spell.lifetime + LifetimeBonus, name:b.bullet.name+"Hit", width:1, height:1}});
				}
			}

	} else if (b.bullet.hit == "heal") {
		KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
		if (b.bullet.spell && (b.bullet.spell.playerEffect || b.bullet.playerEffect) && KinkyDungeonPlayerEntity.x == b.x && KinkyDungeonPlayerEntity.y == b.y) {
			KinkyDungeonPlayerEffect(b.bullet.damage.type, b.bullet.playerEffect ? b.bullet.playerEffect : b.bullet.spell.playerEffect, b.bullet.spell);
		}
		for (let L = 0; L < KinkyDungeonEntities.length; L++) {
			let enemy = KinkyDungeonEntities[L];
			if ((!b.bullet.spell || (!b.bullet.spell.enemySpell && enemy.Enemy.allied) || (!b.bullet.spell.allySpell && !enemy.Enemy.allied))
				&& ((enemy.x == b.x && enemy.y == b.y) || (b.bullet.spell && b.bullet.spell.aoe && KDistEuclidean(b.x - enemy.x, b.y - enemy.y) < b.bullet.spell.aoe))) {
				let origHP = enemy.hp;
				enemy.hp = Math.min(enemy.hp + b.bullet.spell.power, enemy.Enemy.maxhp);
				KinkyDungeonSendFloater(enemy, `+${Math.round((enemy.hp - origHP) * 10)}`, "#ffaa00", 3);
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
			KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
				bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
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
				if (count > 0)
					created += KinkyDungeonSummonEnemy(b.x, b.y, summonType, count, rad, sum.strict, sum.time ? sum.time : undefined, sum.hidden);
			}
		}
		if (!b.bullet.spell || !b.bullet.spell.noSumMsg) {
			if (created == 1) KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSummonSingle"+type), "white", 2);
			else if (created > 1) KinkyDungeonSendTextMessage(8, TextGet("KinkyDungeonSummonMulti"+type).replace("SummonCount", "" + created), "white", 3);
		}
	}
}


function KinkyDungeonSummonEnemy(x, y, summonType, count, rad, strict, lifetime, hidden) {
	let slots = [];
	for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
		for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
			if (Math.sqrt(X*X+Y*Y) <= rad) {
				if ((x + X > 0 && y + Y > 0 && x + X < KinkyDungeonGridWidth && y + Y < KinkyDungeonGridHeight))
					slots.push({x:X, y:Y});
			}
		}

	let created = 0;
	let maxcounter = 0;
	let Enemy = KinkyDungeonEnemies.find(element => element.name == summonType);
	for (let C = 0; C < count && KinkyDungeonEntities.length < 100 && maxcounter < count * 30; C++) {
		let slot = slots[Math.floor(KDRandom() * slots.length)];
		if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x+slot.x, y+slot.y)) && (KinkyDungeonNoEnemy(x+slot.x, y+slot.y, true) || Enemy.noblockplayer)
			&& (!strict || KinkyDungeonCheckPath(x, y, x+slot.x, y+slot.y, false))
			&& (!hidden || KinkyDungeonLightGet(x, y) < 1)) {
			KinkyDungeonEntities.push({summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
				x:x+slot.x, y:y+slot.y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0, lifetime: lifetime, maxlifetime: lifetime});
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
					KinkyDungeonBullets.push({born: 0, time:b.bullet.spell.trailLifetime + (b.bullet.spell.trailLifetimeBonus ? Math.floor(KDRandom() * b.bullet.spell.trailLifetimeBonus) : 0), x:b.x + X, y:b.y + Y, vx:0, vy:0, xx:b.x + X, yy:b.y + Y, spriteID:b.bullet.name+"Trail" + CommonTime(),
						bullet:{trail: true, hit: b.bullet.spell.trailHit, spell:b.bullet.spell, playerEffect:b.bullet.spell.trailPlayerEffect, damage: {damage:b.bullet.spell.trailPower, type:b.bullet.spell.trailDamage, time:b.bullet.spell.trailTime}, lifetime: b.bullet.spell.trailLifetime, name:b.bullet.name+"Trail", width:1, height:1}});
				}
			}
	}
	return trail;
}

function KinkyDungeonBulletsCheckCollision(bullet, AoE) {
	var mapItem = KinkyDungeonMapGet(bullet.x, bullet.y);
	if (!bullet.bullet.passthrough && !bullet.bullet.piercing && !KinkyDungeonOpenObjects.includes(mapItem)) return false;
	if (bullet.bullet.noEnemyCollision) return true;

	if (bullet.bullet.damage && bullet.time > 0) {
		if (bullet.bullet.aoe) {
			if (AoE) {
				if (bullet.bullet.spell && (bullet.bullet.spell.playerEffect || bullet.bullet.playerEffect) && bullet.bullet.aoe >= Math.sqrt((KinkyDungeonPlayerEntity.x - bullet.x) * (KinkyDungeonPlayerEntity.x - bullet.x) + (KinkyDungeonPlayerEntity.y - bullet.y) * (KinkyDungeonPlayerEntity.y - bullet.y))) {
					KinkyDungeonPlayerEffect(bullet.bullet.damage.type, bullet.bullet.playerEffect ? bullet.bullet.playerEffect : bullet.bullet.spell.playerEffect, bullet.bullet.spell);
				}
				var nomsg = bullet.bullet && bullet.bullet.spell && bullet.bullet.spell.enemyspell;
				for (let L = 0; L < KinkyDungeonEntities.length; L++) {
					let enemy = KinkyDungeonEntities[L];
					if ((!bullet.bullet.spell || (!bullet.bullet.spell.enemySpell && !enemy.Enemy.allied) || (!bullet.bullet.spell.allySpell && enemy.Enemy.allied)) && bullet.bullet.aoe >= Math.sqrt((enemy.x - bullet.x) * (enemy.x - bullet.x) + (enemy.y - bullet.y) * (enemy.y - bullet.y))) {
						KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, nomsg, bullet.bullet.spell, bullet);
						nomsg = true;
					}
				}
			}
		} else {
			if (bullet.bullet.spell && (bullet.bullet.spell.playerEffect || bullet.bullet.playerEffect) && KinkyDungeonPlayerEntity.x == bullet.x && KinkyDungeonPlayerEntity.y == bullet.y) {
				KinkyDungeonPlayerEffect(bullet.bullet.damage.type, bullet.bullet.playerEffect ? bullet.bullet.playerEffect : bullet.bullet.spell.playerEffect, bullet.bullet.spell);
				return false;
			}
			for (let L = 0; L < KinkyDungeonEntities.length; L++) {
				let enemy = KinkyDungeonEntities[L];
				if ((!bullet.bullet.spell || (!bullet.bullet.spell.enemySpell && !enemy.Enemy.allied) || (!bullet.bullet.spell.allySpell && enemy.Enemy.allied)) && enemy.x == bullet.x && enemy.y == bullet.y) {
					KinkyDungeonDamageEnemy(enemy, bullet.bullet.damage, true, bullet.bullet.NoMsg, bullet.bullet.spell, bullet);

					return false;
				}
			}
		}
	}
	if (!(bullet.bullet.block > 0) && bullet.vx != 0 || bullet.vy != 0) {

		for (let E = 0; E < KinkyDungeonBullets.length; E++) {
			let b2 = KinkyDungeonBullets[E];
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
	let b = {born: 1, time:lifetime, x:x, y:y, vx:vx, vy:vy, xx:x, yy:y, spriteID:bullet.name + CommonTime(), bullet:bullet, trail:bullet.spell.trail};
	KinkyDungeonBullets.push(b);
	return b;
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var bullet = KinkyDungeonBullets[E].bullet;
		var sprite = bullet.name;
		var spriteCanvas = KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID];
		if (!spriteCanvas) {
			spriteCanvas = document.createElement("canvas");
			spriteCanvas.width = bullet.width*KinkyDungeonSpriteSize;
			spriteCanvas.height = bullet.height*KinkyDungeonSpriteSize;
			KinkyDungeonBulletsID[KinkyDungeonBullets[E].spriteID] = spriteCanvas;

		}

		var Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + ".png");

		var spriteContext = spriteCanvas.getContext("2d");
		var direction = (!KinkyDungeonBullets[E].vy && !KinkyDungeonBullets[E].vx) ? 0 : Math.atan2(KinkyDungeonBullets[E].vy, KinkyDungeonBullets[E].vx);

		// Rotate the canvas m,
		spriteContext.translate(spriteCanvas.width/2, spriteCanvas.height/2);
		spriteContext.rotate(direction);
		spriteContext.translate(-spriteCanvas.width/2, -spriteCanvas.height/2);

		// Draw the sprite
		spriteContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
		spriteContext.drawImage(Img, 0, 0);

		// Reset the transformation
		spriteContext.setTransform(1, 0, 0, 1, 0, 0);

		KinkyDungeonUpdateVisualPosition(KinkyDungeonBullets[E], KinkyDungeonDrawDelta);
		let tx = KinkyDungeonBullets[E].visual_x;
		let ty = KinkyDungeonBullets[E].visual_y;

		if (KinkyDungeonBullets[E].x >= CamX && KinkyDungeonBullets[E].y >= CamY && KinkyDungeonBullets[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonBullets[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			KinkyDungeonContext.drawImage(spriteCanvas,  (tx - CamX - (bullet.width-1)/2)*KinkyDungeonGridSizeDisplay, (ty - CamY - (bullet.height-1)/2)*KinkyDungeonGridSizeDisplay);
		}
	}
}

function KinkyDungeonSendWeaponEvent(Event, data) {
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.events) {
		for (let e of KinkyDungeonPlayerDamage.events) {
			if (e.trigger == Event) {
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