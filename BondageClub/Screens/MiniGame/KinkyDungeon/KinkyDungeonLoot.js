"use strict";

let KinkyDungeonLostItems = [];

function KinkyDungeonAddLostItems(list, excludeBound) {
	for (let item of list) {
		let unique = true;
		let itemType = "";
		if (item.weapon) itemType = Weapon;
		else if (item.looserestraint) itemType = LooseRestraint;
		else if (item.consumable) itemType = Consumable;
		else if (item.outfit) itemType = Outfit;
		if (item.weapon && item.weapon.name == "Knife") unique = false;
		if (itemType && item[itemType]) {
			for (let item2 of KinkyDungeonLostItems) {
				if (item2[itemType] && item2[itemType].name == item[itemType].name) {
					unique = false;
					break;
				}
			}
		}
		if (unique && itemType && (!excludeBound || itemType != Weapon || (item[itemType].magic))) {
			KinkyDungeonLostItems.push(item);
			if (itemType == Consumable) {
				item.quantity = Math.min(item.quantity, 3 + Math.floor(KDRandom() * 3));
			}
		}
	}
}


// Determines if you get a good loot from a blue locked chest
let KinkyDungeonSpecialLoot = false;
let KinkyDungeonLockedLoot = false;

function KinkyDungeonLoot(Level, Index, Type, roll, tile, returnOnly) {
	let lootWeightTotal = 0;
	let lootWeights = [];

	let lootType = KinkyDungeonLootTable[Type];
	for (let loot of lootType) {
		if ((Level >= loot.minLevel || KinkyDungeonNewGame > 0) && loot.floors.get(Index)) {
			let prereqs = true;
			if (loot.arousalMode && !KinkyDungeonStatsChoice.get("arousalMode")) prereqs = false;

			if (loot.prerequisites) {

				let maxlevel = 999;
				let minlevel = 0;
				let SpellList = null;
				if (prereqs && loot.prerequisites.includes("vibe") && KinkyDungeonPlayerTags.has("NoVibes")) prereqs = false;
				if (prereqs && loot.prerequisites.includes("alreadyBelted") && KinkyDungeonChastityMult() < 0.9) prereqs = false;
				if (prereqs && loot.prerequisites.includes("lowlevel")) maxlevel = 2;
				if (prereqs && loot.prerequisites.includes("fewknife") && KinkyDungeonNormalBlades > 3) prereqs = false;
				if (prereqs && loot.prerequisites.includes("fewpick") && KinkyDungeonLockpicks > 3) prereqs = false;
				if (prereqs && loot.prerequisites.includes("lowpotions") && (
					KinkyDungeonItemCount("PotionFrigid") + KinkyDungeonItemCount("PotionMana") + KinkyDungeonItemCount("PotionStamina") > 10
				)) prereqs = false;
				if (prereqs && loot.prerequisites.includes("lowmanapotions") && (
					KinkyDungeonItemCount("PotionMana") > 10
				)) prereqs = false;
				if (prereqs && loot.prerequisites.includes("UnlearnedElements")) SpellList = KinkyDungeonSpellList.Elements;
				if (prereqs && loot.prerequisites.includes("UnlearnedConjure")) SpellList = KinkyDungeonSpellList.Conjure;
				if (prereqs && loot.prerequisites.includes("UnlearnedIllusion")) SpellList = KinkyDungeonSpellList.Illusion;
				if (prereqs && loot.prerequisites.includes("NoBoltCutters") && KinkyDungeonInventoryGet("BoltCutters")) prereqs = false;
				else if (prereqs && loot.prerequisites.includes("LostItems") && KinkyDungeonLostItems.length < 1) prereqs = false;
				else if (prereqs && loot.prerequisites.includes("LightRestraint") && KinkyDungeonAllRestraint().length < 1) prereqs = false;
				else if (prereqs && loot.prerequisites.includes("ModerateRestraint") && KinkyDungeonAllRestraint().length < 4 && !(!KinkyDungeonIsHandsBound() && !KinkyDungeonCanTalk() && KinkyDungeonSlowLevel < 1)) prereqs = false;
				if (prereqs && loot.prerequisites.includes("pearlChest") && !KDPearlRequirement) prereqs = false;

				if (prereqs)
					for (let prereq of loot.prerequisites) {
						if (prereq.startsWith("Group_")) {
							let group = prereq.substring(6);
							let item = KinkyDungeonGetRestraintItem(group);
							let power = item && item.restraint && item.restraint.power ? KinkyDungeonRestraintPower(item) : 0;
							if (power && (power >= loot.power || item.restraint.enchanted)) {
								prereqs = false;
								break;
							}
						}
					}

				if (SpellList != null && KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList).length == 0) {
					prereqs = false;
				}
			}
			if (KinkyDungeonGoddessRep.Ghost && loot.submissive && (KinkyDungeonGoddessRep.Ghost + 50 < loot.submissive)) prereqs = false;
			if (loot.noweapon) {
				for (let w of loot.noweapon) {
					if (KinkyDungeonInventoryGet(w)) {
						prereqs = false;
						break;
					}
				}
			}
			if (loot.norestraint) {
				for (let r of loot.norestraint) {
					if (KinkyDungeonInventoryGet(r)) {
						prereqs = false;
						break;
					}
				}
			}

			if (prereqs) {
				let weightMult = 1.0;
				let weightBonus = 0;
				if (Type == "chest") {
					if (tile && tile.Special && loot.special) weightBonus += loot.special;
					else if (tile && tile.Special) weightMult = 0;
					if (tile && tile.RedSpecial && loot.redspecial) weightBonus += loot.redspecial;
				}

				let rep = (KinkyDungeonGoddessRep.Ghost + 50)/100;
				if (loot.trap || loot.magic) weightMult *= (1 + rep);
				if (loot.trap && KinkyDungeonCurrentMaxEnemies > 0) {
					let nonSumEnemies = 0;
					for (let e of KinkyDungeonEntities) {if (!e.summoned) nonSumEnemies++;}
					weightMult *= Math.max(0, 1 - 0.5*nonSumEnemies/KinkyDungeonCurrentMaxEnemies);
				}

				lootWeights.push({loot: loot, weight: lootWeightTotal});
				lootWeightTotal += (loot.weight + weightBonus) * weightMult;
			}
		}
	}

	let selection = (roll ? roll : KDRandom()) * lootWeightTotal;

	for (let L = lootWeights.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			if (returnOnly) return lootWeights[L].loot;
			let replace = KinkyDungeonLootEvent(lootWeights[L].loot, Level, TextGet(lootWeights[L].loot.message), lootWeights[L].loot.lock);

			if (!KinkyDungeonSendActionMessage(8, replace, lootWeights[L].loot.messageColor, lootWeights[L].loot.messageTime))
				KinkyDungeonSendTextMessage(8, replace, lootWeights[L].loot.messageColor, lootWeights[L].loot.messageTime);

			break;
		}
	}
}

function KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList) {
	let SpellsUnlearned = [];

	for (let spell of SpellList) {
		if (spell.level >= minlevel && spell.level <= maxlevel && !spell.passive) {
			SpellsUnlearned.push(spell);
		}
	}

	for (let spell of KinkyDungeonSpells) {
		for (let S = 0; S < SpellsUnlearned.length; S++) {
			if (spell.name == SpellsUnlearned[S].name) {
				SpellsUnlearned.splice(S, 1);
				S--;
			}
		}
	}

	return SpellsUnlearned;
}

/*
You find a scrap of a journal! (pg. 24)
From the journal of Catherine Edgar Willows, well-known explorer (who vanished in the dungeon 30 years ago)

"Many who trowel the upper levels of the Mistress' tomb often ask rhetorically: 'Why are there weird kinky traps guarding treasure chests? Why not have real, deadly traps if the purpose is to dissuade intruders?'

They make a crucial mistake: The treasure chests aren't trapped. Rather, they are full of gold. And we know that gold is pleasing to the gods: our economy runs on it, and the gods only make interventions in our day-to-day affairs because we give them gold.
Lesser gods, known as spirits, also love gold, but unlike the gods we know, these lesser spirits cannot consume gold on an altar in one fell swoop like the gods can. Therefore, they need to physically inhabit the place where the gold sits, slowly draining it of its pleasing essence.

So the question is not "why did somebody lay these traps." The answer is that they are not traps at all. I surmise that the upper floors were once a place of offering for the dead. And when the old civilization perished and the entire complex sank into the ground, there was no longer anyone to drive the spirits away and keep them from inhabiting the upstairs.

As for why there are so many restraints in general rather than your typical sort of spirits... well we know what the Mistress surrounded herself with."
*/


function KinkyDungeonLootEvent(Loot, Floor, Replacemsg, Lock) {
	let value = 0;
	if (Loot.name == "spell_points") {
		let amount = 1;
		KinkyDungeonSpellPoints += amount;
		KinkyDungeonSendFloater({x: 1100, y: 800 - KDRecentRepIndex * 40}, `+${amount} Spell Points!!!`, "#8888ff", 5, true);
		KDRecentRepIndex += 1;
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("AMOUNT", "" + amount);
	} else if (Loot.name == "spell_illusion_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 2, KinkyDungeonSpellList.Illusion);
		let spellIndex = Math.floor(KDRandom()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_conjuration_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 2, KinkyDungeonSpellList.Conjure);
		let spellIndex = Math.floor(KDRandom()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_elemental_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 2, KinkyDungeonSpellList.Elements);
		let spellIndex = Math.floor(KDRandom()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "pearlReward") {
		let rewardAvailable = [];
		for (let rep of Object.entries(KinkyDungeonGoddessRep)) {
			let rewards = KDBlessedRewards[rep[0]];
			if (rewards && rep[1] > 45) {
				for (let r of rewards) {
					if (!KinkyDungeonInventoryGet(r)) {
						rewardAvailable.push(r);
					}
				}
			}
		}
		let reward = rewardAvailable[Math.floor(KDRandom() * rewardAvailable.length)];
		if (KinkyDungeonWeapons[reward]) {
			KinkyDungeonInventoryAddWeapon(reward);
			if (Replacemsg)
				Replacemsg = Replacemsg.replace("ITEMGET", TextGet("KinkyDungeonInventoryItem" + reward));
		} else if (KinkyDungeonFindSpell(reward, true)) {
			KinkyDungeonSpells.push(KinkyDungeonFindSpell(reward, true));
			if (Replacemsg)
				Replacemsg = Replacemsg.replace("ITEMGET", TextGet("KinkyDungeonSpell" + reward));
		} else if (KinkyDungeonConsumables[reward]) {
			KinkyDungeonChangeConsumable(KinkyDungeonConsumables[reward], 1);
			if (Replacemsg)
				Replacemsg = Replacemsg.replace("ITEMGET", TextGet("KinkyDungeonInventoryItem" + reward));
		}

	} else if (Loot.name == "gold") {
		value = Math.ceil((150 + 50 * KDRandom()) * (1 + Floor/40));
	} else if (Loot.name == "smallgold") {
		value = Math.ceil((20 + 10 * KDRandom()) * (1 + Floor/35));
	} else if (Loot.name == "knife") {
		KinkyDungeonNormalBlades += 1;
	} else if (Loot.name == "magicknife") {
		KinkyDungeonEnchantedBlades += 1;
	}  else if (Loot.name == "pick") {
		KinkyDungeonLockpicks += 1;
	}  else if (Loot.name == "redkey") {
		KinkyDungeonRedKeys += 1;
	} else if (Loot.name == "bluekey") {
		KinkyDungeonBlueKeys += 1;
	} else if (Loot.name == "grinder") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.EnchantedGrinder, 1);
	} else if (Loot.name == "bola") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.Bola, 2);
	} else if (Loot.name == "bomb") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.Bomb, 1);
	} else if (Loot.name == "MistressKey") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.MistressKey, 1);
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 3);
	} else if (Loot.name == "Scrolls") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 2);
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollArms, 2 + Math.floor(KDRandom() * 3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollLegs, 2 + Math.floor(KDRandom() * 3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollVerbal, 2 + Math.floor(KDRandom() * 3));
	} else if (Loot.name == "scroll_legs") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollLegs, 1);
	} else if (Loot.name == "scroll_arms") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollArms, 1);
	} else if (Loot.name == "scroll_verbal") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollVerbal, 1);
	} else if (Loot.name == "scrolls_basic") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollArms, 1 + Math.floor(KDRandom() * 3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollLegs, 1 + Math.floor(KDRandom() * 3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollVerbal, 1 + Math.floor(KDRandom() * 3));
	} else if (Loot.name == "scrolls_purity") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.ScrollPurity, 1);
	} else if (Loot.name == "AncientCores") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 4);
	} else if (Loot.name == "EnchantedBelt") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedBelt");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedBra") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedBra");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedHeels") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedHeels");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedAnkleCuffs") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedAnkleCuffs");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedMuzzle") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedMuzzle");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedBlindfold") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedBlindfold");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedMittens") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedMittens");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedBallGag") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedBallGag");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "EnchantedArmbinder") {
		let restraint = KinkyDungeonGetRestraintByName("EnchantedArmbinder");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
	} else if (Loot.name == "potioncollar") {
		let restraint = KinkyDungeonGetRestraintByName("PotionCollar");
		KinkyDungeonInventoryAdd({looserestraint: restraint, events: restraint.looseevents});
	} else if (Loot.name == "weapon_boltcutters") {
		KinkyDungeonInventoryAddWeapon("BoltCutters");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemBoltCutters"));
	} else if (Loot.name == "weapon_spear") {
		KinkyDungeonInventoryAddWeapon("Spear");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemSpear"));
	} else if (Loot.name == "weapon_flail") {
		KinkyDungeonInventoryAddWeapon("Flail");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemFlail"));
	} else if (Loot.name == "staff_flame") {
		KinkyDungeonInventoryAddWeapon("StaffFlame");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemStaffFlame"));
	} else if (Loot.name == "staff_bind") {
		KinkyDungeonInventoryAddWeapon("StaffBind");
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItemStaffBind"));
	} else if (Loot.weapon) {
		KinkyDungeonInventoryAddWeapon(Loot.weapon);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItem" + Loot.weapon));
	} else if (Loot.name == "potions_mana") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 2+Math.floor(KDRandom()*2));
	} else if (Loot.name == "potions_many") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1+Math.floor(KDRandom()*2));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 2+Math.floor(KDRandom()*3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, Math.floor(KDRandom()*3));
	} else if (Loot.name == "potion_mana") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	} else if (Loot.name == "potion_stamina") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	} else if (Loot.name == "potion_frigid") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	} else if (Loot.name == "trap_armbinder") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), MiniGameKinkyDungeonCheckpoint, true, false, undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapArmbinder"));
	} else if (Loot.name == "trap_armbinderHeavy") {
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		let harness = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinderHarness"), MiniGameKinkyDungeonCheckpoint, true, KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			if (!harness)
				Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapArmbinder"));
			else Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapArmbinderHarness"));
	} else if (Loot.name == "trap_cuffs") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapCuffs"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapCuffs"));
	} else if (Loot.name == "trap_harness") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapHarness"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapHarness"));
	} else if (Loot.name == "trap_gag") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapGag"));
	} else if (Loot.name == "trap_gagHeavy") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("PanelGag"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintPanelGag"));
	} else if (Loot.name == "trap_mithrilankle") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MithrilAnkleCuffs"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintMithrilAnkleCuffs"));
	} else if (Loot.name == "trap_mitts") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapMittens"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapMittens"));
	} else if (Loot.name == "trap_blindfold") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBlindfold"));
	} else if (Loot.name == "trap_boots") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBoots"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBoots"));
	} else if (Loot.name == "trap_legirons") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapLegirons"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapLegirons"));
	} else if (Loot.name == "trap_belt") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapVibe"));
	} else if (Loot.name == "trap_beltonly") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBelt"));
	} else if (Loot.name == "trap_plug") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapPlug"));
	} else if (Loot.name == "trap_plug_tease") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug2"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapPlug2"));
	} else if (Loot.name == "trap_plug_torment") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug3"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapPlug3"));
	} else if (Loot.name == "trap_nipple") {
		value = Math.ceil((70 + 80 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("NippleClamps"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBra"), MiniGameKinkyDungeonCheckpoint, true, Lock ? Lock : KinkyDungeonGenerateLock(true, undefined, true), undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintNippleClamps"));
	} else if (Loot.name == "trap_plug2") {
		value = Math.ceil((150 + 50 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt2"), MiniGameKinkyDungeonCheckpoint, true, (MiniGameKinkyDungeonLevel > 5 || KinkyDungeonNewGame > 0) ? "Gold" : "Red", undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBelt2"));
	}  else if (Loot.name == "trap_plug2_torment") {
		value = Math.ceil((150 + 50 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug3"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt2"), MiniGameKinkyDungeonCheckpoint, true, (MiniGameKinkyDungeonLevel > 5 || KinkyDungeonNewGame > 0) ? "Gold" : "Red", undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBelt2"));
	} else if (Loot.name == "trap_nipple2") {
		value = Math.ceil((150 + 50 * KDRandom()) * (1 + Floor/40));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("NippleClamps"), MiniGameKinkyDungeonCheckpoint, true, false);
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBra2"), MiniGameKinkyDungeonCheckpoint, true, (MiniGameKinkyDungeonLevel > 5 || KinkyDungeonNewGame > 0) ? "Gold" : "Red", undefined, true);
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("RestraintType", TextGet("RestraintTrapBra2"));
	} else if (Loot.name == "trap_book") {
		let spell = null;
		if (KDRandom() < 0.33) {
			spell = KinkyDungeonFindSpell("TrapRopeStrong", true);
		} else if (KDRandom() < 0.5) {
			spell = KinkyDungeonFindSpell("TrapMagicChainsWeak", true);
		} else {
			spell = KinkyDungeonFindSpell("TrapRibbons", true);
		}
		if (spell) {
			KinkyDungeonCastSpell(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, spell, undefined, undefined, undefined);
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/MagicSlash.ogg");
		}
	}

	else if (Loot.name == "lost_items") {
		if (!KinkyDungeonInventoryGet("OutfitDefault")) {
			KinkyDungeonInventoryAdd({outfit: KinkyDungeonGetOutfit("OutfitDefault")});
		}
		for (let I = 0; I < KinkyDungeonLostItems.length; I++) {
			let lostitem = KinkyDungeonLostItems[I];
			if (lostitem) {
				let itemType = "";
				if (lostitem.weapon) itemType = "weapon";
				else if (lostitem.looserestraint) itemType = "looserestraint";
				else if (lostitem.consumable) itemType = "consumable";
				else if (lostitem.outfit) itemType = "outfit";
				let remove = false;
				if (lostitem[itemType]) {
					let existingitem = KinkyDungeonGetInventoryItem(lostitem[itemType].name, itemType);
					if (existingitem && existingitem.item) {
						if (existingitem.item.consumable) {
							if (lostitem.consumable.name != "MistressKey") {
								if (!existingitem.item.quantity) existingitem.item.quantity = lostitem.quantity;
								else existingitem.item.quantity += lostitem.quantity;
								KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * KDRandom(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * KDRandom()},
									`+${lostitem.quantity} ${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 5);
							} else
								KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonMistressKeysTakenAway"), "orange", 2);
						}
					} else {
						if (lostitem.consumable) {
							if (lostitem.consumable.name != "MistressKey")
								KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * KDRandom(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * KDRandom()},
									`+${lostitem.quantity} ${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 4);
							else
								KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonMistressKeysTakenAway"), "orange", 2);
							remove = true;
						} if (lostitem.weapon) {
							KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * KDRandom(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * KDRandom()},
								`+${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 6);
							remove = true;
						} else if (lostitem.outfit) {
							KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * KDRandom(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * KDRandom()},
								`+${TextGet("KinkyDungeonInventoryItem" + lostitem[itemType].name)}`, "white", 7);
							remove = true;
						} else if (lostitem.looserestraint) {
							KinkyDungeonSendFloater({x: KinkyDungeonPlayerEntity.x - 1 + 2 * KDRandom(), y: KinkyDungeonPlayerEntity.y - 1 + 2 * KDRandom()},
								`+ (loose) ${TextGet("Restraint" + lostitem[itemType].name)}`, "white", 5);
							remove = true;
						}
					}
					if (remove) {
						if (!lostitem.consumable || lostitem.consumable.name != "MistressKey") {
							//if (lostitem.looserestraint && lostitem.looserestraint.enchanted) {
							//KinkyDungeonInventory.unshift(lostitem);
							//} else
							KinkyDungeonInventoryAdd(lostitem);
						}
						//KinkyDungeonLostItems.splice(I, 1);
						//I -= 1;
					}
				}
			}
		}
		KinkyDungeonLostItems = [];
	}

	if (value > 0) {
		if (Replacemsg)
			Replacemsg = Replacemsg.replace("XXX", "" + value);
		KinkyDungeonAddGold(value);
	}
	return Replacemsg;
}


function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value;
	if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable()) CharacterChangeMoney(Player, Math.round(value/10));
	let pre = value >= 0 ? "+" : "";
	KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, pre + `${value} GP`, "white", 3.5);
}