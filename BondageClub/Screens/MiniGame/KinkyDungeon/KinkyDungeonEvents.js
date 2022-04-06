"use strict";

let KinkyDungeonSlimeLevel = 0;
let KinkyDungeonSlimeLevelStart = 0;
let KinkyDungeonSlimeParts = [
	{group: "ItemHead", restraint: "SlimeHead"},
	{group: "ItemArms", restraint: "SlimeArms"},
	{group: "ItemHands", restraint: "SlimeHands"},
	{group: "ItemLegs", restraint: "SlimeLegs"},
	{group: "ItemFeet", restraint: "SlimeFeet"},
	{group: "ItemBoots", restraint: "SlimeBoots"},
];
let KDAlertCD = 5;

function KinkyDungeonSendEvent(Event, data) {
	KinkyDungeonSendMagicEvent(Event, data);
	KinkyDungeonSendWeaponEvent(Event, data);
	KinkyDungeonSendInventoryEvent(Event, data);
	KinkyDungeonSendBulletEvent(Event, data.bullet, data);
	KinkyDungeonSendBuffEvent(Event, data);
}

function KinkyDungeonResetEventVariables() {
	KinkyDungeonSlimeLevel = 0;
}
function KinkyDungeonResetEventVariablesTick(delta) {
	if (KinkyDungeonSlimeLevel < 0)
		KinkyDungeonSlimeLevel = 0;
	KinkyDungeonSlimeLevelStart = KinkyDungeonSlimeLevel;
	if (KDAlertCD > 0) KDAlertCD -= delta;

	if (KinkyDungeonLastTurnAction != "Attack" && KDGameData.WarningLevel > 0) {
		if (KDRandom() < 0.25) KDGameData.WarningLevel -= delta;
		if (KDGameData.WarningLevel > 5) KDGameData.WarningLevel = 5;
	}
}

function KinkyDungeonHandleInventoryEvent(Event, e, item, data) {
	if (Event == "tick") {
		if (e.type == "spellRange" && e.trigger == Event) {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: item.restraint.name+e.type+e.trigger, type: "spellRange", duration: 1, power: e.power});
		} else if (e.type == "SneakBuff" && e.trigger == Event) {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: item.restraint.name+e.type+e.trigger, type: "Sneak", duration: 1, power: e.power});
		} else if (e.type == "EvasionBuff" && e.trigger == Event) {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: item.restraint.name+e.type+e.trigger, type: "Evasion", duration: 1, power: e.power});
		} else if (e.type == "AccuracyBuff" && e.trigger == Event) {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: item.restraint.name+e.type+e.trigger, type: "Accuracy", duration: 1, power: e.power});
		} else if (e.type == "AllyHealingAura" && e.trigger == Event) {
			let healed = false;
			for (let enemy of KinkyDungeonEntities) {
				if (enemy.Enemy.allied && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					let origHP = enemy.hp;
					enemy.hp = Math.min(enemy.hp + e.power, enemy.Enemy.maxhp);
					if (enemy.hp - origHP > 0) {
						KinkyDungeonSendFloater(enemy, `+${Math.round((enemy.hp - origHP) * 10)}`, "#44ff77", 3);
						healed = true;
					}
				}
			}
			if (healed) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "EnchantedAnkleCuffs2" && e.trigger == Event) {
			KinkyDungeonRemoveRestraint(item.restraint.Group);
			KinkyDungeonAddRestraint(KinkyDungeonGetRestraintByName("EnchantedAnkleCuffs"), 0, true);
		} else if (e.type == "EnchantedAnkleCuffs" && e.trigger == Event && KDGameData.AncientEnergyLevel <= 0.0000001) {
			KinkyDungeonRemoveRestraint(item.restraint.Group);
			KinkyDungeonAddRestraint(KinkyDungeonGetRestraintByName("EnchantedAnkleCuffs2"), 0, true);
		} else if (e.type == "RegenMana" && e.trigger == Event && (!e.limit || KinkyDungeonStatMana/KinkyDungeonStatManaMax < e.limit)) {
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			KinkyDungeonChangeMana(e.power);
		} else if (e.type == "RegenStamina" && e.trigger == Event && (!e.limit || KinkyDungeonStatStamina/KinkyDungeonStatStaminaMax < e.limit)) {
			if (e.energyCost && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			KinkyDungeonChangeStamina(e.power);
		} else if (e.type == "ApplySlowLevelBuff" && e.trigger == Event && item.restraint) {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: item.restraint.name+e.type+e.trigger, type: "SlowLevel", duration: 1, power: e.power});
			if (e.energyCost) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: item.restraint.name+e.type+e.trigger + "2", type: "SlowLevelEnergyDrain", duration: 1, power: e.energyCost});
		} else if (e.type == "AlertEnemies" && e.trigger == Event) {
			if (!e.chance || KDRandom() < e.chance) {
				KinkyDungeonAlert = Math.max(KinkyDungeonAlert, e.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonAlertEnemies").replace("RestraintName", TextGet("Restraint" + item.restraint.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		} else if (e.type == "iceDrain" && e.trigger == "tick" && e.power) {
			KinkyDungeonChangeMana(e.power);
			KinkyDungeonChangeStamina(e.power);
			KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonIceDrain"), "lightblue", 2);
		} else if (e.type == "crystalDrain" && e.trigger == "tick" && e.power) {
			KinkyDungeonChangeMana(e.power);
			KinkyDungeonChangeDistraction(-e.power * 3);
			KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonCrystalDrain"), "lightblue", 2);
		} else if (e.type == "slimeSpread" && e.trigger == "tick") {
			KinkyDungeonSlimeLevel = Math.max(KinkyDungeonSlimeLevel, KinkyDungeonSlimeLevelStart + e.power);
			if (KinkyDungeonSlimeLevel >= 0.99999) {
				KinkyDungeonSlimeLevel = 0;
				KinkyDungeonSlimeLevelStart = -100;
				let slimedParts = [];
				let potentialSlimeParts = [];
				for (let inv of KinkyDungeonAllRestraint()) {
					if (inv.restraint && inv.restraint.slimeLevel > 0) {
						slimedParts.push({name: inv.restraint.name, group: inv.restraint.Group, level: inv.restraint.slimeLevel});
					}
				}
				for (let slime of slimedParts) {
					let index = -1;
					for (let i = 0; i < KinkyDungeonSlimeParts.length; i++) if (KinkyDungeonSlimeParts[i].group == slime.group) {index = i; break;}
					if (index >= 0) {
						let slime2 = undefined;
						let slime3 = undefined;
						if (index > 0) {
							for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index-1].group && !s.level > slime.level) {slime2 = s; break;}
							if (!slime2) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index-1].group, restraint: KinkyDungeonSlimeParts[index-1].restraint, level: slime.level});
						}
						if (index < KinkyDungeonSlimeParts.length - 1) {
							for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index+1].group && !s.level > slime.level) {slime3 = s; break;}
							if (!slime3) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index+1].group, restraint: KinkyDungeonSlimeParts[index+1].restraint, level: slime.level});
						}
					}
				}
				let slimed = false;
				if (potentialSlimeParts.length == 0) {
					KinkyDungeonSlimeLevel = Math.min(KinkyDungeonSlimeLevel, 0.5);
					KinkyDungeonSlimeLevelStart = Math.min(KinkyDungeonSlimeLevelStart, 0.5);
				} else while (potentialSlimeParts.length > 0) {
					let newSlime = potentialSlimeParts[Math.floor(KDRandom() * potentialSlimeParts.length)];
					if (newSlime) {
						let added = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(newSlime.restraint), 0, true);
						if (added) {
							KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
							potentialSlimeParts = [];
							KinkyDungeonSlimeLevel = -100;
							slimed = true;
						}
					}
					potentialSlimeParts.splice(potentialSlimeParts.indexOf(newSlime), 1);
				}
				if (!slimed && potentialSlimeParts.length == 0) {
					let slime = slimedParts[Math.floor(KDRandom() * slimedParts.length)];
					if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("Hard" + slime.name), 0, true)) {
						KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeHarden"), "#ff44ff", 3);
						if (KinkyDungeonCurrentDress != "SlimeSuit") {
							KinkyDungeonSetDress("SlimeSuit", "");
							KinkyDungeonDressPlayer();
							KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
						}
					}
					KinkyDungeonSlimeLevel = -100;
				}
			}
		}
	} else if (Event == "remove") {
		if (e.type == "slimeStop" && e.trigger == "remove" && data.item == item) {
			KinkyDungeonSlimeLevel = 0;
		}
		if (e.type == "unlinkItem" && e.trigger == "remove" && data.item == item && !data.add && !data.shrine) {
			//KinkyDungeonUnLinkItem(item);
			//Obsolete
		}
	} else if (Event == "afterRemove") {
		if (e.type == "replaceItem" && e.trigger == Event && data.item == item && !data.add && !data.shrine && e.list) {
			for (let restraint of e.list) {
				KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(restraint), e.power, true, e.lock, data.keep);
			}
		}
		if (e.type == "armbinderHarness" && e.trigger == Event && data.item != item && item.restraint && item.restraint && item.restraint.Group) {
			let armbinder = false;
			for (let inv of KinkyDungeonAllRestraint()) {
				if (inv.restraint && inv.restraint.shrine && (inv.restraint.shrine.includes("Armbinders") || inv.restraint.shrine.includes("Boxbinders"))) {
					armbinder = true;
					break;
				}
			}
			if (!armbinder) {
				KinkyDungeonRemoveRestraint(item.restraint.Group, false, false, true);
				KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemoveArmbinderHarness"), "lightgreen", 2);
			}
		}
	} else if (Event == "hit") {
		if (e.type == "linkItem" && e.trigger == "hit" && (data.attack && data.attack.includes("Bind") && !data.attack.includes("Suicide"))) {
			let subMult = 1;
			let chance = e.chance ? e.chance : 1.0;
			if (e.subMult != undefined) {
				let rep = (KinkyDungeonGoddessRep.Ghost + 50)/100;
				subMult = 1.0 + e.subMult * rep;
			}
			if (item.restraint && item.restraint.Link && (KDRandom() < chance * subMult) && (!e.noLeash || KDGameData.KinkyDungeonLeashedPlayer < 1)) {
				let newRestraint = KinkyDungeonGetRestraintByName(item.restraint.Link);
				//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
				KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false);
			}
		}
	} else if (Event == "miss") {
		if (e.type == "EnergyCost" && e.trigger == Event) {
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		}
	} if (Event == "calcEvasion") {
		if (e.type == "HandsFree" && e.trigger == "calcEvasion" && data.flags.KDEvasionHands) {
			data.flags.KDEvasionHands = false;
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		} else if (e.type == "BlindFighting" && e.trigger == "calcEvasion" && data.flags.KDEvasionSight) {
			data.flags.KDEvasionSight = false;
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		}
	} else if (Event == "beforePlayerAttack") {
		if (e.type == "BoostDamage" && e.trigger == Event) {
			data.buffdmg = Math.max(0, data.buffdmg + e.power);
			if (e.energyCost && KinkyDungeonStatMana < KinkyDungeonStatManaMax - 0.01) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		}
	} else if (Event == "beforeDamage") {
		if (e.type == "ModifyDamageFlat" && e.trigger == Event && data.damage > 0) {
			if (!e.chance || KDRandom() < e.chance) {
				data.damage = Math.max(data.damage + e.power, 0);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		}
	} else if (Event == "beforeDamageEnemy") {
		if (e.type == "MultiplyDamageStealth" && e.trigger == Event && data.dmg > 0 && data.enemy && !data.enemy.Enemy.allied && !data.enemy.aware) {
			if (!e.chance || KDRandom() < e.chance) {
				let dmg = Math.max(0, Math.min(data.enemy.hp, data.dmg));
				if (e.energyCost && e.power > 1) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * dmg*(e.power - 1));
				data.dmg = Math.max(data.dmg * e.power, 0);
			}
		} else if (e.type == "MultiplyDamageStatus" && e.trigger == Event && data.dmg > 0 && data.enemy && !data.enemy.Enemy.allied
			&& (KinkyDungeonHasStatus(data.enemy))) {
			if (!e.chance || KDRandom() < e.chance) {
				let dmg = Math.max(0, Math.min(data.enemy.hp, data.dmg));
				if (e.energyCost && e.power > 1) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * dmg*(e.power - 1));
				data.dmg = Math.max(data.dmg * e.power, 0);
			}
		} else if (e.type == "MultiplyDamageMagic" && e.trigger == Event && data.dmg > 0 && data.incomingDamage && !KinkyDungeonMeleeDamageTypes.includes(data.incomingDamage.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				let dmg = Math.max(0, Math.min(data.enemy.hp, data.dmg));
				if (e.energyCost && e.power > 1) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost * dmg*(e.power - 1));
				data.dmg = Math.max(data.dmg * e.power, 0);
			}
		}
	} else if (Event == "defeat") {
		if (e.type == "linkItem" && e.trigger == "defeat") {
			if (item.restraint && item.restraint.Link && (KDRandom() < e.chance)) {
				let newRestraint = KinkyDungeonGetRestraintByName(item.restraint.Link);
				KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "", false);
				//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
			}
		}
	} else if (Event == "struggle") {
		if (e.type == "crotchrope" && e.trigger == "struggle" && data.restraint && data.restraint.restraint && data.restraint.restraint.crotchrope && data.struggletype == "Struggle" && data.struggletype == "Remove") {
			KinkyDungeonChangeDistraction(1);
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCrotchRope").replace("RestraintName", TextGet("Restraint" + data.restraint.name)), "pink", 3);
		} else if (e.type == "celestialRopePunish" && e.trigger == "struggle" && data.restraint && item == data.restraint) {
			KinkyDungeonChangeDistraction(3);
			KinkyDungeonChangeMana(-1);
			KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind + 1, 2);

			for (let A = 0; A < KinkyDungeonPlayer.Appearance.length; A++) {
				if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes" || KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2") {
					let property = KinkyDungeonPlayer.Appearance[A].Property;
					if (!property || property.Expression != "Surprised") {
						KinkyDungeonPlayer.Appearance[A].Property = { Expression: "Surprised" };
						KDRefresh = true;
					}
				}
			}
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonCelestialPunish" + Math.floor(KDRandom() * 3)), "red", 2);
		} else if (e.type == "crystalPunish" && e.trigger == "struggle" && data.restraint && item == data.restraint) {
			KinkyDungeonChangeDistraction(1);
			KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonCrystalPunish" + Math.floor(KDRandom() * 3)), "red", 2);
		}
	} else if (Event == "playerAttack") {
		if (e.type == "ShadowHeel" && e.trigger == "playerAttack" && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
			KinkyDungeonCastSpell(data.targetX, data.targetY, KinkyDungeonFindSpell("HeelShadowStrike", true), undefined, undefined, undefined);
			if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		} else if (e.type == "AlertEnemies" && e.trigger == Event) {
			if (KDAlertCD < 1 && data.enemy && (!e.chance || KDRandom() < e.chance)) { // (data.damage && data.damage.damage && data.enemy.hp > data.enemy.Enemy.maxhp - data.damage.damage*2 - 1)
				KinkyDungeonAlert = Math.max(KinkyDungeonAlert, e.power);
				KDAlertCD = 5;
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonAlertEnemies").replace("RestraintName", TextGet("Restraint" + item.restraint.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		} else if (e.type == "PunishPlayer" && e.trigger == Event && item.restraint && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
			if (KDRandom() < e.chance || (KDGameData.WarningLevel > 2 && KDRandom() < e.warningchance)) {
				if (e.stun && KDGameData.WarningLevel > 2) {
					KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, e.stun);
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				}
				KDGameData.WarningLevel += 1;
				KinkyDungeonDealDamage({damage: e.power, type: e.damage});
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonPunishPlayer" + (KDGameData.WarningLevel > 2 ? "Harsh" : "")).replace("RestraintName", TextGet("Restraint" + item.restraint.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		}
	} else if (Event == "calcMiscast") {
		if (e.type == "ReduceMiscastFlat" && e.trigger == Event && data.flags.miscastChance > 0) {
			data.flags.miscastChance -= e.power;
		}
	} else if (Event == "playerCast") {
		if (e.type == "AlertEnemies" && e.trigger == Event) {
			if (!e.chance || KDRandom() < e.chance) {
				KinkyDungeonAlert = Math.max(KinkyDungeonAlert, e.power);
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonAlertEnemies").replace("RestraintName", TextGet("Restraint" + item.restraint.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		} else if (e.type == "PunishPlayer" && e.trigger == "playerCast" && data.spell && item.restraint && (!e.punishComponent || (data.spell.components && data.spell.components.includes(e.punishComponent)))) {
			if (KDRandom() < e.chance || (KDGameData.WarningLevel > 2 && KDRandom() < e.warningchance)) {
				if (e.stun && KDGameData.WarningLevel > 2) {
					KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, e.stun);
					KinkyDungeonMovePoints = Math.max(-1, KinkyDungeonMovePoints-1); // This is to prevent stunlock while slowed heavily
				}
				KDGameData.WarningLevel += 1;
				KinkyDungeonDealDamage({damage: e.power, type: e.damage});
				KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonPunishPlayer" + (KDGameData.WarningLevel > 2 ? "Harsh" : "")).replace("RestraintName", TextGet("Restraint" + item.restraint.name)), "red", 2);
				if (e.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + e.sfx + ".ogg");
			}
		}
	}
}

function KinkyDungeonHandleBuffEvent(Event, buff, entity, data) {

}

function KinkyDungeonHandleMagicEvent(Event, e, spell, data) {
	if (Event == "calcEvasion") {
		if (e.type == "HandsFree" && e.trigger == "calcEvasion" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags.KDEvasionHands) {
			data.flags.KDEvasionHands = false;
		}
	} if (Event == "calcStats") {
		if (e.type == "Blindness" && e.trigger == "calcStats" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
			//KDBlindnessCap = Math.min(KDBlindnessCap, e.power);
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: spell.name+e.type+e.trigger, type: "Blindness", duration: e.time ? e.time : 0, power: -1});
		}
	} else if (Event == "beforeMove") {
		if (e.type == "FleetFooted" && e.trigger == "beforeMove" && !data.IsSpell && !KinkyDungeonNoMoveFlag && KinkyDungeonSlowLevel > 1 && KinkyDungeonHasStamina(1.1) &&  KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
			let manacost = -KinkyDungeonGetManaCost(spell);
			e.prevSlowLevel = KinkyDungeonSlowLevel;
			KinkyDungeonSlowLevel = Math.max(0, KinkyDungeonSlowLevel - e.power);
			if (KinkyDungeonHasMana(1.5) && KinkyDungeonMovePoints < 0) {
				KinkyDungeonMovePoints = 0;
				manacost -= 1.5;
				KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonFleetFootedIgnoreSlow"), "lightgreen", 2);
			} else KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonFleetFooted"), "lightgreen", 2, false, true);
			KinkyDungeonChangeMana(manacost);
		}
	} else if (Event == "afterMove") {
		if (e.type == "FleetFooted" && e.trigger == "afterMove" && e.prevSlowLevel && !data.IsSpell && KinkyDungeonSlowLevel < e.prevSlowLevel) {
			KinkyDungeonSlowLevel = e.prevSlowLevel;
			e.prevSlowLevel = undefined;
		}
	} else if (Event == "beforeTrap") {
		if (e.type == "FleetFooted" && e.trigger == "beforeTrap" && data.flags.AllowTraps && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell))) {
			if (KDRandom() < e.chance) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
				data.flags.AllowTraps = false;
				KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonFleetFootedIgnoreTrap"), "lightgreen", 2);
			}
		}
	} else if (Event == "beforeDamageEnemy") {
		if (e.type == "MultiplyDamageStealth" && e.trigger == Event && data.dmg > 0 && data.enemy && !data.enemy.Enemy.allied && !data.enemy.aware) {
			if ((!e.humanOnly || data.enemy.Enemy.bound) && (!e.chance || KDRandom() < e.chance)) {
				data.dmg = Math.max(data.dmg * e.power, 0);
			}
		}
	} else if (Event == "calcDamage") {
		if (e.type == "HandsFree" && e.trigger == "calcDamage" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags.KDDamageHands) {
			data.flags.KDDamageHands = false;
		}
	} else if (Event == "getWeapon") {
		if (e.type == "HandsFree" && e.trigger == "getWeapon" && !data.IsSpell && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags && !data.flags.HandsFree) {
			data.flags.HandsFree = true;
		}
	} else if (Event == "playerAttack") {
		if (e.type == "FlameBlade" && e.trigger == Event && KinkyDungeonPlayerDamage && (KinkyDungeonPlayerDamage.name || KinkyDungeonStatsChoice.get("Brawler")) && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
			KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
			KinkyDungeonCastSpell(data.targetX, data.targetY, KinkyDungeonFindSpell("FlameStrike", true), undefined, undefined, undefined);
		} else if (e.type == "FloatingWeapon" && e.trigger == Event && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.targetX && data.targetY && !(data.enemy && data.enemy.Enemy && data.enemy.Enemy.allied)) {
			let chanceWith = KinkyDungeonPlayerDamage.chance;
			let chanceWithout = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon(true), true).chance;
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name && chanceWithout < chanceWith)
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell));
		}
	} else if (Event == "vision") {
		if (e.type == "TrueSight" && e.trigger == "vision" && KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && data.flags) {
			if (data.update)
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
			data.flags.SeeThroughWalls = Math.max(data.flags.SeeThroughWalls, 2);
		}
	} else if (Event == "draw") {
		if (e.type == "EnemySense" && e.trigger == "draw") {
			let activate = false;
			if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(spell)) && !KinkyDungeonPlayerBuffs.EnemySense) {
				KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(spell) * data.update);
				KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "EnemySense", type: "EnemySense", duration: 5});
				activate = true;
			}
			if (KinkyDungeonPlayerBuffs.EnemySense && KinkyDungeonPlayerBuffs.EnemySense.duration > 1)
				for (let enemy of KinkyDungeonEntities) {
					if (!KinkyDungeonLightGet(enemy.x, enemy.y)
						&& Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x) * (KinkyDungeonPlayerEntity.x - enemy.x) + (KinkyDungeonPlayerEntity.y - enemy.y) * (KinkyDungeonPlayerEntity.y - enemy.y)) < e.dist) {
						let color = "#882222";
						if (enemy.Enemy.stealth > 0 || enemy.Enemy.AI == "ambush") color = "#441111";
						if (color == "#882222" || Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x) * (KinkyDungeonPlayerEntity.x - enemy.x) + (KinkyDungeonPlayerEntity.y - enemy.y) * (KinkyDungeonPlayerEntity.y - enemy.y)) < e.distStealth)
							DrawImageCanvasColorize(KinkyDungeonRootDirectory + "Aura.png", KinkyDungeonContext,
								(enemy.visual_x - data.CamX - data.CamX_offset)*KinkyDungeonGridSizeDisplay,
								(enemy.visual_y - data.CamY - data.CamY_offset)*KinkyDungeonGridSizeDisplay,
								KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
								color, true, []);
					}
				}
			else if (!activate) {
				KinkyDungeonDisableSpell("EnemySense");
				KinkyDungeonExpireBuff(KinkyDungeonPlayerBuffs, "EnemySense");
			}
		}
	}
}

function KinkyDungeonHandleWeaponEvent(Event, e, weapon, data) {
	if (Event == "tick") {
		if (e.type == "Buff" && e.trigger == "tick") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: weapon.name, type: e.buffType, power: e.power, duration: 2});
		} else if (e.type == "AoEDamageFrozen" && e.trigger == Event) {
			let trigger = false;
			for (let enemy of KinkyDungeonEntities) {
				if (!enemy.Enemy.allied && enemy.freeze && (!e.chance || KDRandom() < e.chance) && enemy.hp > 0 && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					KinkyDungeonDamageEnemy(enemy, {type:e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
					trigger = true;
				}
			}
			if (trigger) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "AoEDamage" && e.trigger == Event) {
			let trigger = false;
			for (let enemy of KinkyDungeonEntities) {
				if (!enemy.Enemy.allied && (!e.chance || KDRandom() < e.chance) && enemy.hp > 0 && KDistEuclidean(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) <= e.aoe) {
					KinkyDungeonDamageEnemy(enemy, {type:e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
					trigger = true;
				}
			}
			if (trigger) {
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		}
	} else if (Event == "playerAttack") {
		if (e.type == "ElementalEffect" && e.trigger == Event && data.enemy && !data.miss && !data.disarm) {
			if (data.enemy && (!e.chance || KDRandom() < e.chance) && data.enemy.hp > 0) {
				KinkyDungeonDamageEnemy(data.enemy, {type:e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
			}
		} else if (e.type == "ApplyBuff" && e.trigger == Event && data.enemy && !data.miss && !data.disarm) {
			if (data.enemy && (!e.chance || KDRandom() < e.chance)) {
				if (!data.enemy.buffs) data.enemy.buffs = {};
				KinkyDungeonApplyBuff(data.enemy.buffs, e.buff);
			}
		} else if (e.type == "Cleave" && e.trigger == Event && data.enemy && !data.disarm) {
			for (let enemy of KinkyDungeonEntities) {
				if (enemy != data.enemy && !enemy.Enemy.allied) {
					let dist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
					if (dist < 1.5 && KinkyDungeonEvasion(enemy) && Math.max(Math.abs(enemy.x - data.enemy.x), Math.abs(enemy.y - data.enemy.y))) {
						KinkyDungeonDamageEnemy(enemy, {type: e.damage, damage: e.power, time: e.time}, false, true, undefined, undefined, undefined);
					}
				}
			}
		} else if (e.type == "CastSpell" && e.trigger == Event && data.enemy && !data.disarm) {
			let spell = KinkyDungeonFindSpell(e.spell, true);
			KinkyDungeonCastSpell(data.enemy.x, data.enemy.y, spell, {x:KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y}, {x:data.enemy.x, y:data.enemy.y}, undefined);
			if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
		} else if (e.type == "Pierce" && e.trigger == Event && data.enemy && !data.disarm) {
			let dist = e.dist ? e.dist : 1;
			for (let i = 1; i <= dist; i++) {
				let xx = data.enemy.x + i * (data.enemy.x - KinkyDungeonPlayerEntity.x);
				let yy = data.enemy.y + i * (data.enemy.y - KinkyDungeonPlayerEntity.y);
				for (let enemy of KinkyDungeonEntities) {
					if (enemy != data.enemy && !enemy.Enemy.allied) {
						if (KinkyDungeonEvasion(enemy) && enemy.x == xx && enemy.y == yy) {
							KinkyDungeonDamageEnemy(enemy, {type: e.damage, damage: e.power}, false, true, undefined, undefined, undefined);
						}
					}
				}
			}
		} else if (e.type == "Knockback" && e.trigger == Event && e.dist && data.enemy && data.targetX && data.targetY && !data.miss && !data.disarm) {
			if (data.enemy.Enemy && !data.enemy.Enemy.tags.has("unflinching") && !data.enemy.Enemy.tags.has("stunresist") && !data.enemy.Enemy.tags.has("unstoppable")) {
				let newX = data.targetX + Math.round(e.dist * (data.targetX - KinkyDungeonPlayerEntity.x));
				let newY = data.targetY + Math.round(e.dist * (data.targetY - KinkyDungeonPlayerEntity.y));
				if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(newX, newY)) && KinkyDungeonNoEnemy(newX, newY, true)
					&& (e.dist == 1|| KinkyDungeonCheckProjectileClearance(data.enemy.x, data.enemy.y, newX, newY))) {
					data.enemy.x = newX;
					data.enemy.y = newY;
				}
			}
		}
	} else if (Event == "beforeDamageEnemy") {
		if (e.type == "MultiplyTime" && e.trigger == Event && data.time > 0 && (!e.damage || e.damage == data.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				data.time = Math.ceil(data.time * e.power);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "MultiplyDamageFrozen" && data.enemy && data.enemy.freeze && e.trigger == Event && data.dmg > 0 && (!e.damage || e.damage == data.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				data.dmg = Math.ceil(data.dmg * e.power);
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		} else if (e.type == "EchoDamage" && data.enemy && (!data.flags || !data.flags.includes("EchoDamage")) && e.trigger == Event && data.dmg > 0 && (!e.damage || e.damage == data.type)) {
			if (!e.chance || KDRandom() < e.chance) {
				let trigger = false;
				for (let enemy of KinkyDungeonEntities) {
					if ((enemy.rage || (enemy.Enemy.allied && data.enemy.Enemy.allied) || (!enemy.Enemy.allied && !data.enemy.Enemy.allied)) && enemy != data.enemy && enemy.hp > 0 && KDistEuclidean(enemy.x - data.enemy.x, enemy.y - data.enemy.y) <= e.aoe) {
						KinkyDungeonDamageEnemy(enemy, {type:e.damage, damage: e.power, time: e.time, flags: ["EchoDamage"]}, false, true, undefined, undefined, undefined);
						trigger = true;
					}
				}
				if (trigger) {
					if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
				}
			}
		}
	} else if (Event == "afterDamageEnemy") {
		if (e.type == "Dollmaker" && e.trigger == Event && data.attacker && data.attacker.player && data.enemy && KDBoundEffects(data.enemy) > 3 && data.enemy.hp < 0.01) {
			if (!e.chance || KDRandom() < e.chance) {
				let Enemy = KinkyDungeonEnemies.find(element => element.name == "AllyDoll");
				KinkyDungeonEntities.push({summoned: true, rage: Enemy.summonRage ? 9999 : undefined, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
					x:data.enemy.x, y:data.enemy.y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
				if (e.energyCost) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - e.energyCost);
			}
		}
	}
}

function KinkyDungeonHandleBulletEvent(Event, e, b, data) {
	if (b.bullet) {
		if (Event == "bulletHit") {
			if (e.type == "DropKnife" && e.trigger == "bulletHit") {
				let point = {x: b.x, y:b.y};
				if (!KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y))) {
					if (b.vx || b.vy) {
						let speed = KDistEuclidean(b.vx, b.vy);
						if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Math.round(b.x - b.vx/speed), Math.round(b.y - b.vy/speed)))) {
							point = {x: Math.round(b.x - b.vx/speed), y: Math.round(b.y - b.vy/speed)};
						} else if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(Math.floor(b.x - b.vx/speed), Math.floor(b.y - b.vy/speed)))) {
							point = {x: Math.floor(b.x - b.vx/speed), y: Math.floor(b.y - b.vy/speed)};
						} else {
							point = {x: Math.ceil(b.x - b.vx/speed), y: Math.ceil(b.y - b.vy/speed)};
						}
					}
				}
				KinkyDungeonDropItem({name: "Knife"}, point, KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(point.x, point.y)), true, true);
			}
		}
	}
}