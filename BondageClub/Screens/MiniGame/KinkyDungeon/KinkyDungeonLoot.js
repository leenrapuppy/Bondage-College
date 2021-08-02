"use strict";
var KinkyDungeonLootTable = {
	"rubble": [
		{name: "nothing", minLevel: 0, weight:15, message:"LootRubbleFail", messageColor:"#aaaaaa", messageTime: 2, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "smallgold", minLevel: 0, weight:15, message:"LootRubbleSmallGold", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "knife", minLevel: 0, weight:6, message:"LootRubbleKnife", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "pick", minLevel: 0, weight:10, message:"LootRubbleLockpick", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "redkey", minLevel: 1, weight:3, message:"LootRubbleRedKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "greenkey", minLevel: 2, weight:2, message:"LootRubbleGreenKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "bluekey", minLevel: 3, weight:1, message:"LootRubbleBlueKey", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "potion_health", minLevel: 1, weight:4, message:"LootPotionHealth", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "potion_mana", minLevel: 0, weight:10, message:"LootPotionMana", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "potion_stamina", minLevel: 2, weight:6, message:"LootPotionStamina", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "potion_frigid", minLevel: 2, weight:5, message:"LootPotionFrigid", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],
	"chest": [
		//{name: "gold", minLevel: 0, weight:4, message:"LootChestGold", messageColor:"yellow", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "spell_illusion_low", minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["UnlearnedIllusion", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "spell_conjuration_low", minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["UnlearnedConjure", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "spell_elemental_low", minLevel: 0, weight:1, message:"LootChestSpell", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["UnlearnedElements", "lowlevel"]}, // lowlevel is spell levels 1-7
		{name: "trap_armbinder", minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemArms"], power: 8},
		{name: "trap_cuffs", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemArms"], power: 8},
		{name: "trap_harness", minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemTorso"], power: 8},
		{name: "trap_gag", minLevel: 1, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemMouth"], power: 8},
		{name: "trap_blindfold", minLevel: 1, weight:2, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemHead"], power: 8},
		{name: "trap_boots", minLevel: 1, weight:3, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemBoots"], power: 8},
		{name: "trap_legirons", minLevel: 1, weight:1, message:"LootChestTrapMagic", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemFeet"], power: 8},
		{name: "trap_belt", minLevel: 1, weight:1, message:"LootChestTrapMagicVibe", messageColor:"red", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], prerequisites: ["Group_ItemPelvis"], power: 8},
		{name: "potions_health", minLevel: 0, weight:1, message:"LootPotionsHealth", messageColor:"lightgreen", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "potions_mana", minLevel: 0, weight:1, message:"LootPotionsMana", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
		{name: "potions_many", minLevel: 1, weight:1, message:"LootPotionsMedley", messageColor:"lightblue", messageTime: 3, floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
	],


};

function KinkyDungeonLoot(Level, Index, Type) {
	let lootWeightTotal = 0;
	let lootWeights = [];

	let lootType = KinkyDungeonLootTable[Type];
	for (let L = 0; L < lootType.length; L++) {
		let loot = lootType[L];
		if (Level >= loot.minLevel && loot.floors.includes(Index)) {
			let prereqs = true;

			if (loot.prerequisites) {

				let maxlevel = 999;
				let minlevel = 0;
				let SpellList = null;
				if (loot.prerequisites.includes("lowlevel")) maxlevel = 5;
				if (loot.prerequisites.includes("UnlearnedElements")) SpellList = KinkyDungeonSpellList.Elements;
				if (loot.prerequisites.includes("UnlearnedConjure")) SpellList = KinkyDungeonSpellList.Conjure;
				if (loot.prerequisites.includes("UnlearnedIllusion")) SpellList = KinkyDungeonSpellList.Illusion;

				for (let P = 0; P < loot.prerequisites.length; P++) {
					if (loot.prerequisites[P].startsWith("Group_")) {
						let group = loot.prerequisites[P].substring(6);
						let item = KinkyDungeonGetRestraintItem(group);
						if (item && item.restraint && item.restraint.power <= loot.power) {
							prereqs = false;
							break;
						}
					}
				}

				if (SpellList != null && KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList).length == 0) {
					prereqs = false;
				}
			}

			if (prereqs) {
				lootWeights.push({loot: loot, weight: lootWeightTotal});
				lootWeightTotal += loot.weight;
			}
		}
	}

	let selection = Math.random() * lootWeightTotal;

	for (let L = lootWeights.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			let replace = false;

			replace = KinkyDungeonSendActionMessage(6, TextGet(lootWeights[L].loot.message), lootWeights[L].loot.messageColor, lootWeights[L].loot.messageTime);

			KinkyDungeonLootEvent(lootWeights[L].loot, Index, replace);

			break;
		}
	}
}

function KinkyDungeonGetUnlearnedSpells(minlevel, maxlevel, SpellList) {
	let SpellsUnlearned = [];

	for (let S = 0; S < SpellList.length; S++) {
		if (SpellList[S].level >= minlevel && SpellList[S].level <= maxlevel) {
			SpellsUnlearned.push(SpellList[S]);
		}
	}

	for (let SS = 0; SS < KinkyDungeonSpells.length; SS++) {
		for (let S = 0; S < SpellsUnlearned.length; S++) {
			if (KinkyDungeonSpells[SS].name == SpellsUnlearned[S].name) {
				SpellsUnlearned.splice(S, 1);
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

function KinkyDungeonLootEvent(Loot, Index, Replacemsg) {
	let value = 0;
	if (Loot.name == "spell_illusion_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Illusion);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_conjuration_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Conjure);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "spell_elemental_low") {
		let SpellsUnlearned = KinkyDungeonGetUnlearnedSpells(0, 5, KinkyDungeonSpellList.Elements);
		let spellIndex = Math.floor(Math.random()*SpellsUnlearned.length);

		let spell = SpellsUnlearned[spellIndex];
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("SpellLearned", TextGet("KinkyDungeonSpell" + spell.name));
		KinkyDungeonSpells.push(spell);
	} else if (Loot.name == "gold") {
		value = Math.ceil((25 + 25 * Math.random()) * (1 + Index/2));
	} else if (Loot.name == "smallgold") {
		value = Math.ceil((1 + 4 * Math.random()) * (1 + Index));
	} else if (Loot.name == "knife") {
		KinkyDungeonNormalBlades += 1;
	} else if (Loot.name == "magicknife") {
		KinkyDungeonEnchantedBlades += 1;
	}  else if (Loot.name == "pick") {
		KinkyDungeonLockpicks += 1;
	}  else if (Loot.name == "redkey") {
		KinkyDungeonRedKeys += 1;
	}  else if (Loot.name == "greenkey") {
		KinkyDungeonGreenKeys += 1;
	}  else if (Loot.name == "bluekey") {
		KinkyDungeonBlueKeys += 1;
	} else if (Loot.name == "potions_health") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionHealth, 2+Math.floor(Math.random()*2));
	} else if (Loot.name == "potions_mana") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 2+Math.floor(Math.random()*3));
	} else if (Loot.name == "potions_many") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1+Math.floor(Math.random()*2));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1+Math.floor(Math.random()*3));
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1+Math.floor(Math.random()*3));
	} else if (Loot.name == "potion_health") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionHealth, 1);
	} else if (Loot.name == "potion_mana") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	} else if (Loot.name == "potion_stamina") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	} else if (Loot.name == "potion_frigid") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	} else if (Loot.name == "trap_armbinder") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapArmbinder"), MiniGameKinkyDungeonCheckpoint, true, false);
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapArmbinder"));
	} else if (Loot.name == "trap_cuffs") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapCuffs"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemArms"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapCuffs"));
	} else if (Loot.name == "trap_harness") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapHarness"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemTorso"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapHarness"));
	} else if (Loot.name == "trap_gag") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapGag"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemMouth"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapGag"));
	} else if (Loot.name == "trap_blindfold") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBlindfold"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemHead"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapBlindfold"));
	} else if (Loot.name == "trap_boots") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBoots"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemBoots"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapBoots"));
	} else if (Loot.name == "trap_legirons") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapLegirons"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemFeet"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapLegirons"));
	} else if (Loot.name == "trap_belt") {
		value = Math.ceil((40 + 40 * Math.random()) * (1 + Index/2));
		KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapVibe"), MiniGameKinkyDungeonCheckpoint, true, false);
		if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), MiniGameKinkyDungeonCheckpoint, true, true) > 0)
			KinkyDungeonLock(KinkyDungeonGetRestraintItem("ItemPelvis"), KinkyDungeonGenerateLock(true));
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("RestraintType", TextGet("RestraintTrapBelt"));
	}

	if (value > 0) {
		if (Replacemsg)
			KinkyDungeonActionMessage = KinkyDungeonActionMessage.replace("XXX", "" + value);
		KinkyDungeonAddGold(value);
	}
}


function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value;
	if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable()) CharacterChangeMoney(Player, Math.round(value/10));
}