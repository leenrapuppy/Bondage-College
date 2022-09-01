"use strict";
// Player entity
let KinkyDungeonPlayerEntity = null; // The current player entity

// Distraction -- It lowers your stamina regen
let KinkyDungeonStatMaxMax = 72; // Maximum any stat can get boosted to


let KinkyDungeonStatDistractionMax = 36;
let KinkyDungeonStatDistractionLower = 0;
let KinkyDungeonStatDistractionLowerCap = 0.9;
let KinkyDungeonStatArousalLowerRegenSleep = 36/40;
let KinkyDungeonDistractionUnlockSuccessMod = 0.5; // Determines how much harder it is to insert a key while aroused. 1.0 is half success chance, 2.0 is one-third, etc.
let KinkyDungeonStatDistraction = 0;
let KinkyDungeonCrotchRopeDistraction = 0.5;
let KinkyDungeonStatDistractionRegen = -1.5;
let KinkyDungeonStatDistractionRegenPerUpgrade = -0.5;
let KDNoUnchasteBraMult = 0.9;
let KDNoUnchasteMult = 0.8;
let KDDistractionDecayMultDistractionMode = 0.25;
let KDDistractedAmount = 0.15;
let KinkyDungeonStatDistractionRegenStaminaRegenFactor = -0.1; // Stamina drain per time per 100 distraction
let KinkyDungeonStatDistractionMiscastChance = 0.5; // Miscast chance at max distraction
let KinkyDungeonMiscastChance = 0;
let KinkyDungeonVibeLevel = 0;
let KinkyDungeonOrgasmVibeLevel = 0;
let KinkyDungeonDistractionPerVibe = 0.5; // How much distraction per turn per vibe energy cost
let KinkyDungeonDistractionPerPlug = 0.25; // How much distraction per move per plug level
let KinkyDungeonVibeCostPerIntensity = 0.15;

let KinkyDungeonStatWillpowerExhaustion = 0;
let KinkyDungeonSleepTurnsMax = 41;
let KinkyDungeonSlowMoveTurns = 0;
// Note that things which increase max distraction (aphrodiasic) also increase the max stamina drain. This can end up being very dangerous as being edged at extremely high distraction will drain all your energy completely, forcing you to wait until the torment is over or the drugs wear off

// Stamina -- your MP. Used to cast spells and also struggle
let KinkyDungeonStatStaminaMax = 36;
let KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
let KinkyDungeonStatStaminaRegen = 0;
let KDNarcolepticRegen = -0.06;
let KinkyDungeonStatStaminaRegenJail = 0.125;
let KinkyDungeonStatStaminaRegenSleep = 36/40;
let KinkyDungeonStatStaminaRegenSleepBedMultiplier = 1.5;
let KinkyDungeonStatStaminaRegenWait = 0;
let KinkyDungeoNStatStaminaLow = 4;
let KinkyDungeonStatManaMax = 36;
let KinkyDungeonStatMana = KinkyDungeonStatManaMax;
let KinkyDungeonStatManaRate = 0;
let KinkyDungeonStatManaRegen = 0; // How fast stamina that is converted to mana regenerates
let KinkyDungeonStatManaLowRegen = 0; // How fast stamina that is converted to mana regenerates when low
let KDMeditationRegen = 0.25;
let KinkyDungeonStatManaRegenLowThreshold = 4; // Threshold for fast mana regen
let KinkyDungeonStatStaminaRegenPerSlowLevel = -0.03; // It costs stamina to move while bound
let KinkyDungeonStatStaminaCostStruggle = -1; // It costs stamina to struggle
let KinkyDungeonStatStaminaCostRemove = -0.25; // It costs stamina to struggle
let KinkyDungeonStatStaminaCostTool = -0.1; // It costs stamina to cut, but much less
let KinkyDungeonStatStaminaCostPick = -0.0; // It costs stamina to pick, but much less
let KinkyDungeonStatStaminaCostAttack = -1.0; // Cost to attack
let KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

// Current Status
let KinkyDungeonStatBeltLevel = 0; // Chastity bra does not add belt level
let KinkyDungeonStatPlugLevel = 0; // Cumulative with front and rear plugs
let KinkyDungeonPlugCount = 0;
let KinkyDungeonStatVibeLevel = 0; // Cumulative with diminishing returns for multiple items
let KinkyDungeonStatEdged = false; // If all vibrating effects are edging, then this will be true

let KinkyDungeonStatDistractionGainChaste = -0.1; // Cumulative w/ groin and bra


// Restraint stats

let KinkyDungeonSlowLevel = 0; // Adds to the number of move points you need before you move
let KinkyDungeonMovePoints = 0;

let KinkyDungeonBlindLevelBase = 0; // Base, increased by buffs and such, set to 0 after consumed in UpdateStats
let KinkyDungeonBlindLevel = 0; // Blind level 1: -33% vision, blind level 2: -67% vision, Blind level 3: Vision radius = 1
let KinkyDungeonStatBlind = 0; // Used for temporary blindness
let KinkyDungeonStatFreeze = 0; // Used for temporary freeze
let KinkyDungeonStatBind = 0; // Used for temporary bind
let KinkyDungeonDeaf = false; // Deafness reduces your vision radius to 0 if you are fully blind (blind level 3)
let KinkyDungeonSleepiness = 0; // Sleepiness

// Other stats
let KinkyDungeonGold = 0;
let KinkyDungeonLockpicks = 0;
// 3 types of keys, for 4 different types of padlocks. The last type of padlock requires all 3 types of keys to unlock
// The red keys are one-use only as the lock traps the key
// The green keys are multi-use, but jam often
// The blue keys cannot be picked or cut.
// Monsters are not dextrous enough to steal keys from your satchel, although they may spill your satchel on a nearby tile
let KinkyDungeonRedKeys = 0;
let KinkyDungeonBlueKeys = 0;

let KinkyDungeonHasCrotchRope = false;

// Combat
let KinkyDungeonTorsoGrabChance = 0.4;
let KinkyDungeonWeaponGrabChance = 1.0;

/**
 * Your inventory contains items that are on you
 * @type {Map<string, Map<string, item>>}
 */
let KinkyDungeonInventory = new Map();
function KDInitInventory() {
	KinkyDungeonInventory = new Map();
	for (const c of [Consumable, Restraint, LooseRestraint, Weapon, Outfit]) {
		KinkyDungeonInventory.set(c, new Map());
	}
}

let KinkyDungeonPlayerTags = new Map();

let KinkyDungeonCurrentDress = "Default";
let KinkyDungeonUndress = 0; // Level of undressedness

// Current list of spells
let KinkyDungeonSpells = [];
let KinkyDungeonPlayerBuffs = {};

// Temp - for multiplayer in future
let KinkyDungeonPlayers = [];

// For items like the cursed collar which make more enemies appear
let KinkyDungeonDifficulty = 0;

let KinkyDungeonSubmissiveMult = 0;

let KinkyDungeonSpellPoints = 3;

function KinkyDungeonDefaultStats(Load) {
	KinkyDungeonPenanceCosts = {};
	KinkyDungeonLostItems = [];
	KinkyDungeonFastMove = true;
	KinkyDungeonResetEventVariables();
	KinkyDungeonSetDress("Default", "OutfitDefault");
	KDGameData.KinkyDungeonSpawnJailers = 0;
	KDGameData.KinkyDungeonSpawnJailersMax = 0;
	KinkyDungeonGold = 0;
	KinkyDungeonLockpicks = 1;
	KinkyDungeonRedKeys = 0;
	KinkyDungeonBlueKeys = 0;

	KDOrigStamina = 36;
	KDOrigMana = 36;
	KDOrigDistraction = 0;

	KinkyDungeonHasCrotchRope = false;

	KinkyDungeonSubmissiveMult = 0;

	KDGameData.HeartTaken = false;

	KDSetWeapon(null);
	KinkyDungeonSpellPoints = 3;

	KinkyDungeonStatDistractionMax = 36;
	KinkyDungeonStatStaminaMax = 36;
	KinkyDungeonStatManaMax = 36;
	KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

	KinkyDungeonStatBlind = 0;
	KinkyDungeonSlowMoveTurns = 0;
	KDGameData.SleepTurns = 0;
	KinkyDungeonStatBind = 0;
	KinkyDungeonStatFreeze = 0;

	KinkyDungeonStatDistraction = 0;
	KinkyDungeonStatDistractionLower = 0;
	KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
	KinkyDungeonStatMana = KinkyDungeonStatManaMax;

	KinkyDungeonPlayerBuffs = {};

	KinkyDungeonMovePoints = 0;
	KDInitInventory();
	KinkyDungeonInventoryAdd({name: "OutfitDefault", type: Outfit});
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	KinkyDungeonInventoryAddWeapon("Unarmed");
	KinkyDungeonInventoryAddWeapon("Knife");
	KinkyDungeonPlayerTags = new Map();

	KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault;

	// Initialize all the other systems
	KinkyDungeonResetMagic();
	KinkyDungeonInitializeDresses();
	KinkyDungeonShrineInit();

	if (!Load) {

		if (KinkyDungeonStatsChoice.get("Submissive")) KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("BasicCollar"), 0, true, "Red");
		if (KinkyDungeonStatsChoice.get("Pacifist")) KinkyDungeonInventoryAddWeapon("Rope");
		if (KinkyDungeonStatsChoice.get("Unchained")) KinkyDungeonRedKeys += 1;

		if (KinkyDungeonStatsChoice.get("FuukaCollar")) KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);

		if (KinkyDungeonStatsChoice.get("Prisoner")) KDGameData.PrisonerState = 'parole';

		if (KinkyDungeonStatsChoice.get("Slayer")) {
			KinkyDungeonSpells.push(KinkyDungeonFindSpell("Firebolt"));
			KinkyDungeonSpellChoices[0] = KinkyDungeonSpells.length - 1;
		}
		if (KinkyDungeonStatsChoice.get("Conjurer")) {
			KinkyDungeonSpells.push(KinkyDungeonFindSpell("ChainBolt"));
			KinkyDungeonSpellChoices[0] = KinkyDungeonSpells.length - 1;
		}
		if (KinkyDungeonStatsChoice.get("Magician")) {
			KinkyDungeonSpells.push(KinkyDungeonFindSpell("Dagger"));
			KinkyDungeonSpellChoices[0] = KinkyDungeonSpells.length - 1;
		}

		if (KinkyDungeonStatsChoice.get("Brawler")) {
			KinkyDungeonInventoryAddWeapon("Knife");
			KDSetWeapon("Knife");
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
		}



		if (KinkyDungeonStatsChoice.get("StartLatex")) {
			KinkyDungeonChangeRep("Latex", 10);
			for (let i = 0; i < 30; i++) {
				let r = KinkyDungeonGetRestraint({tags: ["latexRestraints", "latexRestraintsHeavy"]}, 12, "grv", true, "Red");
				if (r)
					KinkyDungeonAddRestraintIfWeaker(r, 0, true, "Red");
			}
			let outfit = {name: "BlueSuitPrison", type: Outfit};
			if (!KinkyDungeonInventoryGet("BlueSuitPrison")) KinkyDungeonInventoryAdd(outfit);
			if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
			KinkyDungeonSetDress("BlueSuitPrison", "BlueSuitPrison");
		}
		if (KinkyDungeonStatsChoice.get("StartMaid")) {
			KDChangeFactionRelation("Player", "Maidforce", 0.2 - KDFactionRelation("Player", "Maidforce"), true);
			for (let i = 0; i < 30; i++) {
				let r = KinkyDungeonGetRestraint({tags: ["maidRestraints", "maidVibeRestraints"]}, 12, "grv", true, "Purple");
				if (r)
					KinkyDungeonAddRestraintIfWeaker(r, 0, true, "Purple");
			}
			let outfit = {name: "Maid", type: Outfit};
			if (!KinkyDungeonInventoryGet("Maid")) KinkyDungeonInventoryAdd(outfit);
			if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
			KinkyDungeonSetDress("Maid", "Maid");
		}
		if (KinkyDungeonStatsChoice.get("StartWolfgirl")) {
			KDChangeFactionRelation("Player", "Nevermere", 0.2 - KDFactionRelation("Player", "Nevermere"), true);
			for (let i = 0; i < 30; i++) {
				let r = KinkyDungeonGetRestraint({tags: (i < 3 ? ["wolfCuffs"] : ["wolfGear", "wolfRestraints"])}, 12, "grv", true, "Red");
				if (r)
					KinkyDungeonAddRestraintIfWeaker(r, 0, true, "Red");
			}
			let outfit = {name: "Wolfgirl", type: Outfit};
			if (!KinkyDungeonInventoryGet("Wolfgirl")) KinkyDungeonInventoryAdd(outfit);
			if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
			KinkyDungeonSetDress("Wolfgirl", "Wolfgirl");
		}
		if (KinkyDungeonStatsChoice.get("StartObsidian")) {
			KDChangeFactionRelation("Player", "Elemental", 0.2 - KDFactionRelation("Player", "Elemental"), true);
			for (let i = 0; i < 30; i++) {
				let r = KinkyDungeonGetRestraint({tags: ["obsidianRestraints", "genericChastity", "genericToys"]}, 12, "grv", true, "Red");
				if (r) {
					KinkyDungeonAddRestraintIfWeaker(r, 0, true, "Purple");
					let item = KinkyDungeonGetRestraintItem(r.Group);
					if (item && KDRestraint(item).Link) {
						let newRestraint = KinkyDungeonGetRestraintByName(KDRestraint(item).Link);
						KinkyDungeonAddRestraint(newRestraint, item.tightness, true, "Purple", false, undefined, undefined, undefined, item.faction);
						//KinkyDungeonLinkItem(newRestraint, item, item.tightness, "");
					}
				}
			}
			let outfit = {name: "Obsidian", type: Outfit};
			if (!KinkyDungeonInventoryGet("Obsidian")) KinkyDungeonInventoryAdd(outfit);
			if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
			KinkyDungeonSetDress("Obsidian", "Obsidian");
		}
	}

	KinkyDungeonDressPlayer();
	CharacterRefresh(KinkyDungeonPlayer);
}

function KinkyDungeonGetVisionRadius() {
	return (KDGameData.SleepTurns > 2) ? 1 : (Math.max((KinkyDungeonDeaf || KinkyDungeonStatBlind > 0) ? 1 : 2, Math.round(KinkyDungeonMapBrightness-KinkyDungeonBlindLevel)));
}

function KinkyDungeonInterruptSleep() {
	KDGameData.SleepTurns = 0;
	KDGameData.PlaySelfTurns = 0;
}

function KinkyDungeonDealDamage(Damage) {
	let data = {
		dmg: Damage.damage,
		type: Damage.type,
		armor: Math.max(0, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Armor")),
		buffresist: KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, Damage.type + "DamageResist"))
			* (KinkyDungeonMeleeDamageTypes.includes(Damage.type) ?
			KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "meleeDamageResist"))
			: KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "magicDamageResist"))),
		arouseAmount: 0,
	};

	let arouseTypes = ["grope", "charm", "happygas"];
	if (arouseTypes.includes(data.type)) {
		data.arouseAmount = 0.2;
	}

	KinkyDungeonSendEvent("playerTakeDamage", data);

	let distractionTypesWeakNeg = ["pain", "acid"];
	let distractionTypesWeak = ["grope"];
	let distractionTypesStrong = ["tickle", "charm", "souldrain", "happygas"];
	let staminaTypesWeak = ["electric", "tickle", "drain", "acid"];
	let staminaTypesStrong = ["glue", "ice", "frost", "cold", "pain", "crush", "chain", "fire", "grope", "poison", "stun", "pierce", "slash", "unarmed", "souldrain"];
	let manaTypesWeak = ["electric", "poison", "souldrain"];
	let manaTypesString = ["drain"];


	data.dmg *= data.buffresist;

	if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 'w') {
		staminaTypesWeak.splice(staminaTypesWeak.indexOf("electric"), 1);
		staminaTypesStrong.push("electric");
		manaTypesWeak.splice(manaTypesWeak.indexOf("electric"), 1);
		manaTypesString.push("electric");
	}

	if (data.armor) data.dmg = Math.max(0, data.dmg - data.armor);

	if (data.dmg > 0) {
		let buffreduction = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "DamageReduction");
		if (buffreduction && data.dmg > 0) {
			data.dmg = Math.max(data.dmg - buffreduction, 0);
			KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "damageTaken", 1);
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Shield.ogg");
		}
	}


	if (distractionTypesWeak.includes(data.type)) {
		KinkyDungeonChangeDistraction(Math.ceil(data.dmg/2), false, data.arouseAmount);
	}
	if (distractionTypesWeakNeg.includes(data.type)) {
		KinkyDungeonChangeDistraction(Math.ceil(-data.dmg/2));
	}
	if (distractionTypesStrong.includes(data.type)) {
		KinkyDungeonChangeDistraction(data.dmg, false, data.arouseAmount);
	}
	if (staminaTypesStrong.includes(data.type)) {
		KinkyDungeonChangeStamina(-data.dmg);
	} else if (staminaTypesWeak.includes(data.type)) {
		KinkyDungeonChangeStamina(-Math.ceil(data.dmg/2));
	}
	if (manaTypesString.includes(data.type)) {
		KinkyDungeonChangeMana(-data.dmg);
	} else if (manaTypesWeak.includes(data.type)) {
		KinkyDungeonChangeMana(-Math.ceil(data.dmg/2));
	}
	KinkyDungeonInterruptSleep();

	if (KinkyDungeonStatFreeze > 0 && KinkyDungeonMeleeDamageTypes.includes(data.type)) {
		KinkyDungeonChangeStamina(-data.dmg);
		KinkyDungeonStatFreeze = 0;
	}



	return data.dmg;
}

let KDOrigStamina = 36;
let KDOrigMana = 36;
let KDOrigDistraction = 36;

function KinkyDungeonChangeDistraction(Amount, NoFloater, lowerPerc) {
	KinkyDungeonStatDistraction += Amount;
	KinkyDungeonStatDistraction = Math.min(Math.max(0, KinkyDungeonStatDistraction), KinkyDungeonStatDistractionMax);

	if (lowerPerc) {
		KinkyDungeonStatDistractionLower += Amount * lowerPerc;
		KinkyDungeonStatDistractionLower = Math.min(Math.max(0, KinkyDungeonStatDistractionLower), KinkyDungeonStatDistractionMax * KinkyDungeonStatDistractionLowerCap);
	}
	if (!NoFloater && Math.abs(KDOrigDistraction - Math.floor(KinkyDungeonStatDistraction)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatDistraction) - KDOrigDistraction, "#ff00ff", undefined, undefined, " ap");
		KDOrigDistraction = Math.floor(KinkyDungeonStatDistraction);
	}
}
function KinkyDungeonChangeStamina(Amount, NoFloater) {
	KinkyDungeonStatStamina += Amount;
	KinkyDungeonStatStamina = Math.min(Math.max(0, KinkyDungeonStatStamina), KinkyDungeonStatStaminaMax);
	if (!NoFloater && Math.abs(KDOrigStamina - Math.floor(KinkyDungeonStatStamina)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatStamina) - KDOrigStamina, "#44ff66", undefined, undefined, " sp");
		KDOrigStamina = Math.floor(KinkyDungeonStatStamina);
	}
}
function KinkyDungeonChangeMana(Amount, NoFloater) {
	KinkyDungeonStatMana += Amount;
	KinkyDungeonStatMana = Math.min(Math.max(0, KinkyDungeonStatMana), KinkyDungeonStatManaMax);
	if (!NoFloater && Math.abs(KDOrigMana - Math.floor(KinkyDungeonStatMana)) >= 0.99) {
		KinkyDungeonSendFloater(KinkyDungeonPlayerEntity, Math.floor(KinkyDungeonStatMana) - KDOrigMana, "#4499ff", undefined, undefined, " mp");
		KDOrigMana = Math.floor(KinkyDungeonStatMana);
	}
}

function KinkyDungeonHasStamina(Cost, AddRate) {
	let s = KinkyDungeonStatStamina;
	if (AddRate) s += KinkyDungeonStaminaRate;

	return s >= Cost;
}
function KinkyDungeonHasMana(Cost, AddRate) {
	let s = KinkyDungeonStatMana;
	if (AddRate) s += KinkyDungeonStatManaRate;

	return s >= Cost;
}

function KinkyDungeonSetMaxStats() {
	// Upgradeable stats
	KinkyDungeonStatStaminaMax = 36;
	KinkyDungeonStatDistractionMax = 36;
	KinkyDungeonStatManaMax = 36;
	KinkyDungeonSpellChoiceCount = 4;
	KinkyDungeonSummonCount = 2;
	let distractionRate = 0;

	for (let s of KinkyDungeonSpells) {
		if (s.name == "SPUp1" || s.name == "SPUp2" || s.name == "SPUp3") KinkyDungeonStatStaminaMax += 6;
		if (s.name == "MPUp1" || s.name == "MPUp2" || s.name == "MPUp3") KinkyDungeonStatManaMax += 12;
		if (s.name == "SpellChoiceUp1" || s.name == "SpellChoiceUp2" || s.name == "SpellChoiceUp3") KinkyDungeonSpellChoiceCount += 1;
		if (s.name == "SummonUp1" || s.name == "SummonUp2") KinkyDungeonSummonCount += 2;
		if (s.name == "APUp1" || s.name == "APUp2" || s.name == "APUp3") {
			KinkyDungeonStatDistractionMax += 12;
			distractionRate += KinkyDungeonStatDistractionRegenPerUpgrade;
		}
	}
	return distractionRate;
}

function KinkyDungeonCanUseWeapon(NoOverride, e) {
	let flags = {
		HandsFree: false,
	};
	if (!NoOverride)
		KinkyDungeonSendEvent("getWeapon", {event: e, flags: flags});
	return (flags.HandsFree || !KinkyDungeonIsHandsBound() || KinkyDungeonPlayerDamage.noHands);
}

let KDBlindnessCap = 0;
let KDBoundPowerLevel = 0;

function KDGetDistractionRate(delta) {
	let distractionRate = (KinkyDungeonVibeLevel == 0 && KDGameData.OrgasmNextStageTimer < 4) ? (!KinkyDungeonStatsChoice.get("arousalMode") ? KinkyDungeonStatDistractionRegen * KDDistractionDecayMultDistractionMode : (KDGameData.PlaySelfTurns < 1 ? KinkyDungeonStatDistractionRegen*(
		(KinkyDungeonChastityMult() > 0.9 ? KDNoUnchasteMult : (KinkyDungeonChastityMult() > 0 ? KDNoUnchasteBraMult : 1.0))) : 0)) : (KinkyDungeonDistractionPerVibe * KinkyDungeonVibeLevel);

	if (KDGameData.OrgasmStamina > 0 && delta > 0) {
		let amount = KDGameData.OrgasmStamina/24;
		KDGameData.OrgasmStamina = Math.max(0, KDGameData.OrgasmStamina*0.98 - delta/70);
		distractionRate += -amount;
	}

	let distractionBonus = KinkyDungeonSetMaxStats();
	if (KDGameData.PlaySelfTurns < 1) distractionRate += distractionBonus;
	return distractionRate;
}

function KinkyDungeonUpdateStats(delta) {
	KDBoundPowerLevel = 0;
	if (KinkyDungeonStatsChoice.get("BoundPower")) {
		for (let inv of KinkyDungeonAllRestraint()) {
			if (!KDRestraint(inv).nonbinding)
				switch (KDRestraint(inv).Group) {
					case "ItemArms": KDBoundPowerLevel += 0.2; break;
					case "ItemLegs": KDBoundPowerLevel += 0.08; break;
					case "ItemFeet": KDBoundPowerLevel += 0.08; break;
					case "ItemBoots": KDBoundPowerLevel += 0.04; break;
					case "ItemMouth": KDBoundPowerLevel += 0.05; break;
					case "ItemMouth2": KDBoundPowerLevel += 0.05; break;
					case "ItemMouth3": KDBoundPowerLevel += 0.1; break;
					case "ItemHead": KDBoundPowerLevel += 0.1; break;
					case "ItemHands": KDBoundPowerLevel += 0.1; break;
					case "ItemPelvis": KDBoundPowerLevel += 0.05; break;
					case "ItemTorso": KDBoundPowerLevel += 0.05; break;
					case "ItemBreast": KDBoundPowerLevel += 0.05; break;
					case "ItemNeck": KDBoundPowerLevel += 0.05; break;
				}
		}
		if (KDBoundPowerLevel > 1) KDBoundPowerLevel = 1;
	}
	if (KinkyDungeonStatsChoice.get("BoundPower")) {
		KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {
			id:"BoundPower",
			type: "Evasion",
			duration: 1,
			power: KDBoundPowerLevel * KDBoundPowerMult,
		});
	}

	KinkyDungeonPlayers = [KinkyDungeonPlayerEntity];

	KDBlindnessCap = 6;
	KinkyDungeonSendEvent("calcStats", {});
	// Initialize
	KinkyDungeonCalculateVibeLevel(delta);
	if (KinkyDungeonVibeLevel > 0 && KinkyDungeonCanPlayWithSelf() && KDGameData.SleepTurns > 0) {
		KinkyDungeonInterruptSleep();
		KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSleepDeprivation"), "pink", 3);
	}
	KinkyDungeonDifficulty = KinkyDungeonNewGame * 20;
	if (KinkyDungeonVibeLevel > 0) {
		KDGameData.OrgasmNextStageTimer = Math.min(KDOrgasmStageTimerMax, KDGameData.OrgasmNextStageTimer + delta);
		if (KDGameData.OrgasmNextStageTimer >= KDOrgasmStageTimerMax && KDRandom() < KDOrgasmStageTimerMaxChance && KinkyDungeonControlsEnabled()) {
			if (KDGameData.OrgasmStage < KinkyDungeonMaxOrgasmStage) {
				if (KinkyDungeonCanPlayWithSelf() && !KinkyDungeonInDanger()) {
					if (!KinkyDungeonStatsChoice.get("Purity")) {
						KinkyDungeonDoPlayWithSelf();
						KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonPlaySelfAutomatic" + (KinkyDungeonIsArmsBound() ? "Bound" : "")), "#FF5BE9", 5);
					} else {
						KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonPlaySelfAutomaticPurity"), "#FF5BE9", 5);
					}
				}
				KDGameData.OrgasmStage += 1;
				KDGameData.OrgasmNextStageTimer = 1;
			} else {
				if (KinkyDungeonCanOrgasm()) {
					KinkyDungeonDoTryOrgasm();
					KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonOrgasmAutomatic"), "#FF5BE9", KinkyDungeonOrgasmStunTime + 1);
					KDGameData.OrgasmNextStageTimer = 1;
				}
			}
		}
	} else if (KDGameData.OrgasmNextStageTimer > 0) {
		KDGameData.OrgasmNextStageTimer = Math.max(0, KDGameData.OrgasmNextStageTimer - delta);
	}

	let distractionRate = KDGetDistractionRate(delta);
	let arousalPercent = distractionRate > 0 ? 0.1 : 0;

	if (KDGameData.OrgasmStage > 0 && KDRandom() < 0.25 && KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * 0.75) KDGameData.OrgasmStage = Math.max(0, KDGameData.OrgasmStage - delta);
	if (KinkyDungeonStatDistraction >= KinkyDungeonStatDistractionMax * 0.99) KDGameData.OrgasmTurns = Math.min(KDGameData.OrgasmTurns + delta, KinkyDungeonOrgasmTurnsMax);
	else KDGameData.OrgasmTurns = Math.max(KDGameData.OrgasmTurns - delta, 0);


	let sleepRegen = KinkyDungeonStatStaminaRegenSleep * KinkyDungeonStatStaminaMax / 36;
	let sleepRegenDistraction = KinkyDungeonStatArousalLowerRegenSleep * KinkyDungeonStatDistractionMax / 36;
	if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 'B') sleepRegen *= 2;
	let stamRegen = KinkyDungeonStatsChoice.get("Narcoleptic") ? KDNarcolepticRegen : KinkyDungeonStatStaminaRegen;
	if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 'B' && KinkyDungeonPlayerInCell()) {
		stamRegen = Math.max(stamRegen, KinkyDungeonStatStaminaRegenJail);
	}
	KinkyDungeonStaminaRate = KDGameData.SleepTurns > 0 && KDGameData.SleepTurns < KinkyDungeonSleepTurnsMax - 1? sleepRegen : stamRegen;
	KinkyDungeonStatManaRate = (KinkyDungeonStatMana < KinkyDungeonStatManaRegenLowThreshold && KinkyDungeonStatsChoice.get("Meditation")) ? KDMeditationRegen : 0;

	// Update the player tags based on the player's groups
	KinkyDungeonPlayerTags = KinkyDungeonUpdateRestraints(delta);

	let blind = Math.max(KinkyDungeonBlindLevelBase, KinkyDungeonGetBlindLevel());
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blindness")) blind = Math.max(0, blind + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blindness"));
	KinkyDungeonBlindLevel = Math.min(KDBlindnessCap, blind);
	if (KinkyDungeonBlindLevel > 0 && KinkyDungeonStatsChoice.has("Unmasked")) KinkyDungeonBlindLevel += 1;
	if (KinkyDungeonStatBlind > 0) KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel, 6);
	if (KinkyDungeonStatStamina < 6) KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel, Math.round(6 - KinkyDungeonStatStamina));
	KinkyDungeonDeaf = KinkyDungeonPlayer.IsDeaf();

	// Unarmed damage calc
	KinkyDungeonPlayerDamage = KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());

	KinkyDungeonUpdateStruggleGroups();

	KinkyDungeonDressPlayer();
	// Slowness calculation
	KinkyDungeonCalculateSlowLevel();
	let sleepRate = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sleepiness");
	if ((sleepRate && sleepRate > 0) || KinkyDungeonSleepiness > 0) {
		KinkyDungeonSleepiness = Math.min(8, KinkyDungeonSleepiness + sleepRate * delta);
		if (KinkyDungeonSleepiness > 2.99) {
			KinkyDungeonSlowLevel = Math.max(KinkyDungeonSlowLevel, 2);
			KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel + 1, 3);
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "Sleepy", aura: "#222222", type: "AttackStamina", duration: 3, power: -1, player: true, enemies: false, tags: ["attack", "stamina"]});
		} else if (KinkyDungeonSleepiness > 2) {
			KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel, 2);
		} else if (KinkyDungeonSleepiness > 1) {
			KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevel, 1);
		}
		if (KinkyDungeonSleepiness > 0) {
			KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonSleepy"), "red", 1);
		}
	}
	if ((!sleepRate || sleepRate <= 0) && KinkyDungeonSleepiness > 0) KinkyDungeonSleepiness = Math.max(0, KinkyDungeonSleepiness - delta);

	// Cap off the values between 0 and maximum
	KinkyDungeonStatDistraction += distractionRate*delta;
	if (sleepRegenDistraction > 0 && KDGameData.SleepTurns > 0) {
		KinkyDungeonStatDistractionLower -= sleepRegenDistraction*delta;
	} else {
		KinkyDungeonStatDistractionLower += distractionRate*delta * arousalPercent;
	}
	KDOrigDistraction = Math.floor(KinkyDungeonStatDistraction);
	KinkyDungeonStatStamina += KinkyDungeonStaminaRate*delta;
	KinkyDungeonStatMana += KinkyDungeonStatManaRate;

	if (KDGameData.OrgasmTurns > KinkyDungeonOrgasmTurnsCrave) {
		KinkyDungeonChangeStamina(KinkyDungeonOrgasmExhaustionAmount * (KinkyDungeonStatsChoice.get("Willpower") ? KDWillpowerMultiplier : 1.0));
		let vibe = KinkyDungeonVibeLevel > 0 ? "Vibe" : "";
		KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonOrgasmExhaustion" + vibe), "red", 2, false, true);
	}

	KinkyDungeonStatBlind = Math.max(0, KinkyDungeonStatBlind - delta);
	KinkyDungeonStatFreeze = Math.max(0, KinkyDungeonStatFreeze - delta);
	KinkyDungeonStatBind = Math.max(0, KinkyDungeonStatBind - delta);

	KinkyDungeonCapStats();

	KinkyDungeonCalculateMiscastChance();

	KinkyDungeonHasCrotchRope = false;

	for (let item of KinkyDungeonFullInventory()) {
		if (item.type == Restraint) {
			if (KDRestraint(item).difficultyBonus) {
				KinkyDungeonDifficulty += KDRestraint(item).difficultyBonus;
			}
			if (KDRestraint(item).crotchrope) KinkyDungeonHasCrotchRope = true;
			if (KDRestraint(item).enchantedDrain) {
				if (KDGameData.AncientEnergyLevel > 0) KDGameData.AncientEnergyLevel = Math.max(0, KDGameData.AncientEnergyLevel - KDRestraint(item).enchantedDrain * delta);
			}
		}
	}
	KinkyDungeonSubmissiveMult = KinkyDungeonCalculateSubmissiveMult();

	if (!KDGameData.TimeSinceLastVibeEnd) KDGameData.TimeSinceLastVibeEnd = {};
	if (!KDGameData.TimeSinceLastVibeStart) KDGameData.TimeSinceLastVibeStart = {};

	for (let type of Object.entries(KDGameData.TimeSinceLastVibeStart)) {
		if (!KDGameData.TimeSinceLastVibeStart[type[0]]) KDGameData.TimeSinceLastVibeStart[type[0]] = 1;
		else KDGameData.TimeSinceLastVibeStart[type[0]] += delta;
	}
	for (let type of Object.entries(KDGameData.TimeSinceLastVibeEnd)) {
		if (!KDGameData.TimeSinceLastVibeEnd[type[0]]) KDGameData.TimeSinceLastVibeEnd[type[0]] = 1;
		else KDGameData.TimeSinceLastVibeEnd[type[0]] += delta;
	}
}

function KinkyDungeonCalculateMiscastChance() {
	let flags = {
		miscastChance: Math.max(0, KinkyDungeonStatDistractionMiscastChance * Math.min(1, KinkyDungeonStatDistraction / KinkyDungeonStatDistractionMax)),
	};
	if (KinkyDungeonStatsChoice.has("AbsoluteFocus")) {
		flags.miscastChance = Math.min(flags.miscastChance * 2, 1);
	}
	if (KinkyDungeonStatsChoice.get("Distracted")) flags.miscastChance += KDDistractedAmount;
	KinkyDungeonSendEvent("calcMiscast", {flags: flags});
	KinkyDungeonMiscastChance = flags.miscastChance;
}

function KinkyDungeonGetBlindLevel() {
	let blindness = 0;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).blindfold) blindness = Math.max(Math.min(5, blindness + 1), KDRestraint(inv).blindfold);
	}
	return blindness ? blindness : 0;
}

function KinkyDungeonCapStats() {
	KinkyDungeonStatDistractionLower = Math.max(0, Math.min(KinkyDungeonStatDistractionLower, KinkyDungeonStatDistractionMax * KinkyDungeonStatDistractionLowerCap));
	KinkyDungeonStatDistraction = Math.max(KinkyDungeonStatDistractionLower, Math.min(KinkyDungeonStatDistraction, KinkyDungeonStatDistractionMax));
	KinkyDungeonStatStamina = Math.max(0, Math.min(KinkyDungeonStatStamina, KinkyDungeonStatStaminaMax));
	KinkyDungeonStatMana = Math.max(0, Math.min(KinkyDungeonStatMana, KinkyDungeonStatManaMax));
}

function KinkyDungeonLegsBlocked() {
	if (KinkyDungeonPlayer.Pose.includes("Hogtie")) return true;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv) && KDRestraint(inv).blockfeet) return true;
	}
	return false;
}

function KinkyDungeonCanStand() {
	return !KinkyDungeonPlayer.Pose.includes("Kneel");
}

function KinkyDungeonCalculateSlowLevel() {
	KinkyDungeonSlowLevel = 0;
	if (KinkyDungeonAllRestraint().some((r) => {return KDRestraint(r).immobile;})) {KinkyDungeonSlowLevel += 100; KinkyDungeonMovePoints = -1;}
	else {
		for (let inv of KinkyDungeonAllRestraint()) {
			if ((KDRestraint(inv).blockfeet || KDRestraint(inv).hobble)) KinkyDungeonSlowLevel += 1;
		}
		for (let inv of KinkyDungeonAllRestraint()) {
			if (KDRestraint(inv).blockfeet) {
				KinkyDungeonSlowLevel = Math.max(KinkyDungeonSlowLevel, 2);
				break;
			}
		}
		if (KinkyDungeonStatStamina < 0.5 || !KinkyDungeonCanStand()) KinkyDungeonSlowLevel = Math.max(3, KinkyDungeonSlowLevel + 1);
		if (KinkyDungeonPlayer.Pose.includes("Hogtied")) KinkyDungeonSlowLevel = Math.max(4, KinkyDungeonSlowLevel + 1);
		for (let inv of KinkyDungeonAllRestraint()) {
			if (KDRestraint(inv).freeze) KinkyDungeonSlowLevel = Math.max(2, KinkyDungeonSlowLevel);
		}
	}
	let origSlowLevel = KinkyDungeonSlowLevel;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel")) KinkyDungeonSlowLevel += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel");
	KinkyDungeonSlowLevel = Math.max(0, KinkyDungeonSlowLevel);
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevelEnergyDrain")) KDGameData.AncientEnergyLevel =
		Math.max(0, KDGameData.AncientEnergyLevel - Math.max(0, origSlowLevel - KinkyDungeonSlowLevel) * KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevelEnergyDrain"));
}
/**
 * Returns the total level of gagging, 1.0 or higher meaning "fully gagged" and 0.0 being able to speak.
 * @param   {boolean} [AllowFlags] - Whether or not flags such as allowPotions and blockPotions should override the final result
 * @return  {number} - The gag level, sum of all gag properties of worn restraints
 */
function KinkyDungeonGagTotal(AllowFlags) {
	let total = 0;
	let allow = false;
	let prevent = false;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).gag) total += KDRestraint(inv).gag;
		if (KDRestraint(inv).allowPotions) allow = true;
	}
	if (AllowFlags) {
		if (prevent) return 1.00;
		else if (allow) return 0.0;
	}
	return total;
}

function KinkyDungeonCanTalk(Loose) {
	for (let inv of KinkyDungeonAllRestraint()) {
		if ((Loose ? KinkyDungeonGagTotal() >= 0.99 : KDRestraint(inv).gag)) return false;
	}
	return true;
}

function KinkyDungeonCalculateSubmissiveMult() {
	let base = 0;
	for (let item of KinkyDungeonAllRestraint()) {
		if (item.type == Restraint) {
			let power = Math.sqrt(Math.max(0, KinkyDungeonGetLockMult(item.lock) * KDRestraint(item).power));
			base = Math.max(power, base + power/5);
		}
	}

	base *= 0.28;

	let mult = Math.max(0, 0.1 + 0.9 * (KinkyDungeonGoddessRep.Ghost + 50)/100);
	let amount = Math.max(0, base * mult);
	//console.log(amount);
	return amount;
}

function KinkyDungeonCanPlayWithSelf() {
	if (!KinkyDungeonStatsChoice.get("arousalMode")) return false;
	return KinkyDungeonStatDistraction > KinkyDungeonDistractionSleepDeprivationThreshold * KinkyDungeonStatDistractionMax && KinkyDungeonHasStamina(-KinkyDungeonOrgasmCost);
}

function KinkyDungeonCanTryOrgasm() {
	if (!KinkyDungeonStatsChoice.get("arousalMode")) return false;
	return KinkyDungeonStatDistraction >= KinkyDungeonStatDistractionMax - 0.01 && (KinkyDungeonHasStamina(-KinkyDungeonOrgasmCost) || KDGameData.OrgasmStage > 3) && KDGameData.OrgasmStamina < 1;
}

function KinkyDungeonDoPlayWithSelf() {
	KinkyDungeonAlert = 3; // Alerts nearby enemies because of your moaning~
	let OrigAmount = KinkyDungeonPlayWithSelfPowerMin + (KinkyDungeonPlayWithSelfPowerMax - KinkyDungeonPlayWithSelfPowerMin)*KDRandom();
	let amount = Math.max(0, OrigAmount - KinkyDungeonChastityMult() * KinkyDungeonPlayWithSelfChastityPenalty);
	if (KinkyDungeonStatsChoice.get("Purity")) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPlaySelfPurity"), "#FF5BE9", 4);
		return 0;
	}
	if (KinkyDungeonIsArmsBound()) amount = Math.max(0, Math.min(amount, OrigAmount - KinkyDungeonPlayWithSelfBoundPenalty));
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.playSelfBonus) amount += KinkyDungeonPlayerDamage.playSelfBonus;
	KinkyDungeonChangeDistraction(amount * KinkyDungeonPlayWithSelfMult, false, 0.05);
	KinkyDungeonChangeStamina(KinkyDungeonPlayCost);
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.playSelfSound) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonPlayerDamage.playSelfSound + ".ogg");
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.playSelfMsg) {
		KinkyDungeonSendActionMessage(10, TextGet(KinkyDungeonPlayerDamage.playSelfMsg), "#FF5BE9", 4);
	} else if (KinkyDungeonIsArmsBound()) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPlaySelfBound"), "#FF5BE9", 4);
	} else if (KinkyDungeonChastityMult() > 0.9) {
		KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChastityDeny"), "#FF5BE9", 4);
	} else KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPlaySelf"), "#FF5BE9", 4);
	KDGameData.PlaySelfTurns = 3;
	return amount;
}

let KinkyDungeonOrgasmVibeLevelMult = 5;
let KinkyDungeonOrgasmChanceBase = -0.1;
let KinkyDungeonOrgasmChanceScaling = 1.1;
let KinkyDungeonMaxOrgasmStage = 7;
let KinkyDungeonOrgasmStageVariation = 4; // determines the text message variation

let KinkyDungeonDistractionSleepDeprivationThreshold = 0.25;
let KinkyDungeonPlaySelfOrgasmThreshold = 3; // Note that it is impossible if you have a belt on, but possible if you only have a bra on

let KinkyDungeonOrgasmTurnsMax = 10;
let KinkyDungeonOrgasmTurnsCrave = 8;
let KinkyDungeonPlayWithSelfPowerMin = 3;
let KinkyDungeonPlayWithSelfPowerMax = 6;
let KinkyDungeonPlayWithSelfPowerVibeWand = 5;
let KinkyDungeonPlayWithSelfChastityPenalty = 5;
let KinkyDungeonPlayWithSelfBoundPenalty = 3;
let KinkyDungeonOrgasmExhaustionAmount = -0.1;

let KDOrgasmStageTimerMax = 10; // Turns for orgasm stage timer to progress naturally
let KDOrgasmStageTimerMaxChance = 0.1; // Chance for the event to happen

let KDWillpowerMultiplier = 0.5;

let KinkyDungeonOrgasmCost = -8;
let KinkyDungeonEdgeCost = -1;
let KinkyDungeonPlayCost = -0.05;

let KinkyDungeonOrgasmStunTime = 4;
let KinkyDungeonPlayWithSelfMult = 0.25;

function KinkyDungeonDoTryOrgasm() {
	let amount = KinkyDungeonOrgasmVibeLevel * KinkyDungeonOrgasmVibeLevelMult;
	let playSelfAmount = KinkyDungeonDoPlayWithSelf();
	//if (playSelfAmount > KinkyDungeonOrgasmVibeLevel) {
	amount += playSelfAmount;
	//}
	let chance = KinkyDungeonOrgasmChanceBase + KinkyDungeonOrgasmChanceScaling*(KDGameData.OrgasmTurns/KinkyDungeonOrgasmTurnsMax);
	let msg = "KinkyDungeonOrgasm";
	let msgTime = 4;

	let denied = KinkyDungeonVibratorsDeny(chance);
	if (!denied && amount > KinkyDungeonPlaySelfOrgasmThreshold && KDRandom() < chance) {
		// You finally shudder and tremble as a wave of pleasure washes over you...
		KinkyDungeonStatBlind = 6;
		KinkyDungeonOrgasmStunTime = 4;
		KDGameData.OrgasmStamina = KinkyDungeonStatDistraction;
		KinkyDungeonChangeStamina(KinkyDungeonOrgasmCost);
		KinkyDungeonAlert = 7; // Alerts nearby enemies because of your moaning~
	} else {
		KinkyDungeonChangeStamina(KinkyDungeonEdgeCost);
		// You close your eyes and breath rapidly in anticipation...
		// You feel frustrated as the stimulation isn't quite enough...
		// You groan with pleasure as you keep close to the edge...
		// You whimper as you rub your legs together furiously...
		// You tilt your head back and moan as your heart beats faster...
		// Your whole body shakes, but you don't quite go over the edge...
		// This is starting to feel like torture...
		// You let out a frustrated scream as the torment continues...
		// You simmer just under the edge, heart racing, breathing quickly...
		// You let out an anguished moan as release dances just out of reach...
		// You squirm helplessly as your futile struggles simply arouse you more...
		KDGameData.OrgasmTurns = Math.min(KDGameData.OrgasmTurns + amount, KinkyDungeonOrgasmTurnsMax); // Progress the meter if you're not ready yet...
		KDGameData.OrgasmStage = Math.min(KinkyDungeonMaxOrgasmStage, KDGameData.OrgasmStage + 1); // Stage of denial
		if (KDGameData.CurrentVibration) {
			if (KDGameData.CurrentVibration.denialsLeft > 0 || KDGameData.CurrentVibration.denialsLeft == undefined) {
				KDGameData.CurrentVibration.denyTimeLeft = KDGameData.CurrentVibration.denyTime;
				if (KDGameData.CurrentVibration.denialsLeft > 0) KDGameData.CurrentVibration.denialsLeft -= 1;
			}
		}
		if (denied && KinkyDungeonVibeLevel > 0) msg = "KinkyDungeonDeny";
		else msg = "KinkyDungeonEdge";
	}

	let msgIndex = Math.min(KinkyDungeonMaxOrgasmStage, KDGameData.OrgasmStage) + Math.floor(Math.random() * KinkyDungeonOrgasmStageVariation);
	KinkyDungeonSendActionMessage(10, TextGet(msg + ("" + msgIndex)), "#FF5BE9", msgTime);
}

function KinkyDungeonIsChaste(Breast) {
	for (let inv of KinkyDungeonAllRestraint()) {
		if ((!Breast && KDRestraint(inv).chastity) || (Breast && KDRestraint(inv).chastitybra)) return true;
	}
}

function KinkyDungeonChastityMult() {
	let chaste = 0.0;
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).chastity) chaste += 1;
		else if (KDRestraint(inv).chastitybra) chaste += 0.2;
	}
	return chaste;
}
