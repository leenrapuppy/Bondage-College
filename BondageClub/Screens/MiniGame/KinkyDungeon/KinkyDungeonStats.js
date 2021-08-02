"use strict";
// Player entity
var KinkyDungeonPlayerEntity = null; // The current player entity

// Arousal -- It lowers your stamina regen
var KinkyDungeonStatArousalMax = 100;
var KinkyDungeonArousalUnlockSuccessMod = 0.5; // Determines how much harder it is to insert a key while aroused. 1.0 is half success chance, 2.0 is one-third, etc.
var KinkyDungeonStatArousal = 0;
var KinkyDungeonStatArousalRegen = -1;
var KinkyDungeonStatArousalRegenStaminaRegenFactor = -0.9; // Stamina drain per time per 100 arousal
var KinkyDungeonStatArousalMiscastChance = 0.8; // Miscast chance at max arousal
var KinkyDungeonVibeLevel = 0;
var KinkyDungeonArousalPerVibe = 1.0; // How much arousal per turn per vibe level
// Note that things which increase max arousal (aphrodiasic) also increase the max stamina drain. This can end up being very dangerous as being edged at extremely high arousal will drain all your energy completely, forcing you to wait until the torment is over or the drugs wear off

// Stamina -- your MP. Used to cast spells and also struggle
var KinkyDungeonStatStaminaMax = 100;
var KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
var KinkyDungeonStatStaminaMana = 0;
var KinkyDungeonStatStaminaManaRate = 0;
var KinkyDungeonStatStaminaRegen = 4;
var KinkyDungeonStatStaminaRegenMana = 0; // How fast stamina that is converted to mana regenerates
var KinkyDungeonStatStaminaRegenManaLow = -0.33; // How fast stamina that is converted to mana regenerates when low
var KinkyDungeonStatStaminaRegenManaLowThreshold = 10; // Threshold for fast mana regen
var KinkyDungeonStatStaminaRegenPerSlowLevel = -0.33; // It costs stamina to move while bound
var KinkyDungeonStatStaminaCostStruggle = -10; // It costs stamina to struggle
var KinkyDungeonStatStaminaCostTool = -5; // It costs stamina to pick or cut, but less
var KinkyDungeonStatStaminaCostAttack = -12; // Cost to attack
var KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

// Willpower -- your HP. When it falls to 0, your character gives up and accepts her fate
var KinkyDungeonStatWillpowerMax = 100;
var KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;
var KinkyDungeonStatWillpowerRegen = 0.0; // Willpower does not regenerate! You have to visit a shrine, with an exponentially increasing price tag
var KinkyDungeonStatWillpowerExhaustion = 0; // When casting spells, your willpower regen is stopped for this many turns

// Willpower loss
var KinkyDungeonWillpowerLossOnOrgasm = -5;
var KinkyDungeonWillpowerDrainLowStamina = -0.1; // Willpower does not regen when totally exhausted
var KinkyDungeonWillpowerDrainLowStaminaThreshold = 33; // Threshold at which willpower starts to drain
var KinkyDungeonStatWillpowerCostStruggleFail = -1.0; // Cost when failing a struggle

// Current Status
var KinkyDungeonStatBeltLevel = 0; // Chastity bra does not add belt level
var KinkyDungeonStatPlugLevel = 0; // Cumulative with front and rear plugs
var KinkyDungeonStatVibeLevel = 0; // Cumulative with diminishing returns for multiple items
var KinkyDungeonStatEdged = false; // If all vibrating effects are edging, then this will be true

var KinkyDungeonStatArousalGainChaste = -0.25; // Cumulative w/ groin and bra

// Restraint stats

var KinkyDungeonSlowLevel = 0; // Adds to the number of move points you need before you move
var KinkyDungeonMovePoints = 0;

var KinkyDungeonBlindLevelBase = 0; // Base, increased by buffs and such, set to 0 after consumed in UpdateStats
var KinkyDungeonBlindLevel = 0; // Blind level 1: -33% vision, blind level 2: -67% vision, Blind level 3: Vision radius = 1
var KinkyDungeonStatBlind = 0; // Used for temporary blindness
var KinkyDungeonDeaf = false; // Deafness reduces your vision radius to 0 if you are fully blind (blind level 3)

// Other stats
var KinkyDungeonGold = 0;
var KinkyDungeonLockpicks = 0;
// 3 types of keys, for 4 different types of padlocks. The last type of padlock requires all 3 types of keys to unlock
// The red keys are one-use only as the lock traps the key
// The green keys are multi-use, but jam often
// The blue keys cannot be picked or cut.
// Monsters are not dextrous enough to steal keys from your satchel, although they may spill your satchel on a nearby tile
var KinkyDungeonRedKeys = 0;
var KinkyDungeonGreenKeys = 0;
var KinkyDungeonBlueKeys = 0;
// Regular blades are used to cut soft restraints. Enchanted blades turn into regular blades after one use, and can cut magic items
// Some items are trapped with a curse, which will destroy the knife when cut, but otherwise still freeing you
var KinkyDungeonNormalBlades = 1;
var KinkyDungeonEnchantedBlades = 0;



// Combat
var KinkyDungeonTorsoGrabChance = 0.33;

// Your inventory contains items that are on you
var KinkyDungeonInventory = [];
var KinkyDungeonPlayerTags = [];

var KinkyDungeonCurrentDress = "Default";
var KinkyDungeonUndress = 0; // Level of undressedness

// Current list of spells
var KinkyDungeonSpells = [];
var KinkyDungeonPlayerBuffs = {};

// Current list of dresses
var KinkyDungeonDresses = {};

// Temp - for multiplayer in future
var KinkyDungeonPlayers = [];

function KinkyDungeonDefaultStats() {
	KinkyDungeonGold = 0;
	KinkyDungeonLockpicks = 1;
	KinkyDungeonRedKeys = 0;
	KinkyDungeonGreenKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonNormalBlades = 1;
	KinkyDungeonEnchantedBlades = 0;

	KinkyDungeonStatArousalMax = 100;
	KinkyDungeonStatStaminaMax = 100;
	KinkyDungeonStatWillpowerMax = 100;
	KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

	KinkyDungeonStatArousal = 0;
	KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
	KinkyDungeonStatStaminaMana = 0;
	KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;
	KinkyDungeonStatWillpowerExhaustion = 0;

	KinkyDungeonMovePoints = 0;
	KinkyDungeonInventory = [];
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	KinkyDungeonInventoryAddWeapon("Knife");
	KinkyDungeonPlayerTags = [];

	KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault;

	// Initialize all the other systems
	KinkyDungeonResetMagic();
	KinkyDungeonInitializeDresses();
	KinkyDungeonDressPlayer();
	KinkyDungeonShrineInit();
}

function KinkyDungeonGetVisionRadius() {
	return Math.max((KinkyDungeonDeaf || KinkyDungeonStatBlind > 0) ? 1 : (KinkyDungeonBlindLevel > 2) ? 2 : 3, Math.floor(KinkyDungeonMapBrightness*(1.0 - 0.33 * KinkyDungeonBlindLevel)));
}

function KinkyDungeonDealDamage(Damage) {
	var dmg = Damage.damage;
	var type = Damage.type;
	KinkyDungeonStatWillpower -= dmg;
	if (type == "grope") { // Groping attacks increase arousal
		KinkyDungeonStatArousal += dmg;
	} else if (type == "electric") { // Electric attacks are mildly arousing and reduce stamina
		KinkyDungeonStatArousal += dmg/2;
		KinkyDungeonStatStamina -= dmg/2;
	} else if (type == "ice") { // Ice attacks are mildly painful and reduce stamina
		KinkyDungeonStatArousal -= dmg/2;
		KinkyDungeonStatStamina -= dmg/2;
	} else if (type == "pain") { // Painful attacks decrease arousal
		KinkyDungeonStatArousal -= dmg/2;
	} else if (type == "glue") { // Glue slows the player
		KinkyDungeonStatStamina -= dmg/2;
	}
	return dmg;
}

function KinkyDungeonHasStamina(Cost, AddRate, IgnoreMana) {
	let s = KinkyDungeonStatStamina;
	let m = KinkyDungeonStatStaminaMana;
	if (AddRate) s += KinkyDungeonStaminaRate;
	if (IgnoreMana) m = 0;

	return s - m >= Cost;
}

function KinkyDungeonDrawStats(x, y, width, heightPerBar) {
	// Draw labels
	if (KinkyDungeonStatArousal > 0)
		DrawText(TextGet("StatArousal"), x+width/2, y + 25, (KinkyDungeonStatArousal < 100) ? "white" : "pink", "silver");
	DrawText(TextGet("StatStamina"), x+width/2, y + 25 + heightPerBar, (KinkyDungeonStatStamina > KinkyDungeonWillpowerDrainLowStaminaThreshold) ? "white" : "pink", "silver");
	DrawText(TextGet("StatWillpower"), x+width/2, y + 25 + 2 * heightPerBar, (KinkyDungeonStatWillpower > 10) ? "white" : "pink", "silver");

	// Draw arousal
	if (KinkyDungeonStatArousal > 0)
		DrawProgressBarColor(x, y + heightPerBar/2, width, heightPerBar/3, 100*KinkyDungeonStatArousal/KinkyDungeonStatArousalMax, "pink", "#111111");
	DrawProgressBarColor(x, y + heightPerBar + heightPerBar/2, width, heightPerBar/3, 100*KinkyDungeonStatStamina/KinkyDungeonStatStaminaMax, "#22AA22", "#111111");

	DrawRect(x + 2 + Math.max(0, Math.floor((width - 4) * (KinkyDungeonStatStamina - KinkyDungeonStatStaminaMana)/KinkyDungeonStatStaminaMax)), y + heightPerBar + heightPerBar/2 + 2,
		Math.floor((width - 4) * Math.min(KinkyDungeonStatStaminaMana, KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax),  heightPerBar/3 - 4, "#3377AA");
	DrawProgressBarColor(x, y + 2*heightPerBar + heightPerBar/2, width, heightPerBar/3, 100*KinkyDungeonStatWillpower/KinkyDungeonStatWillpowerMax, "#DDCCCC", "#881111");

	var i = 3;
	DrawText(TextGet("CurrentGold") + KinkyDungeonGold, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;
	DrawText(TextGet("CurrentLockpicks") + KinkyDungeonLockpicks, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;
	DrawText(TextGet("CurrentKnife") + KinkyDungeonNormalBlades, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;

	if (KinkyDungeonEnchantedBlades > 0) {DrawText(TextGet("CurrentKnifeMagic") + KinkyDungeonEnchantedBlades, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonRedKeys > 0) {DrawText(TextGet("CurrentKeyRed") + KinkyDungeonRedKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonGreenKeys > 0) {DrawText(TextGet("CurrentKeyGreen") + KinkyDungeonGreenKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonBlueKeys > 0) {DrawText(TextGet("CurrentKeyBlue") + KinkyDungeonBlueKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
}


function KinkyDungeonUpdateStats(delta) {
	KinkyDungeonPlayers = [KinkyDungeonPlayerEntity];
	// Initialize
	KinkyDungeonCalculateVibeLevel();

	var arousalRate = (KinkyDungeonVibeLevel == 0) ? KinkyDungeonStatArousalRegen : (KinkyDungeonArousalPerVibe * KinkyDungeonVibeLevel);
	// Dont regen while exhausted
	if (KinkyDungeonStatWillpowerExhaustion > 0) {
		KinkyDungeonStatWillpowerExhaustion = Math.max(0, KinkyDungeonStatWillpowerExhaustion - delta);
		KinkyDungeonStaminaRate = 0;
		KinkyDungeonStatStaminaManaRate = 0;
	} else {
		KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;
		KinkyDungeonStatStaminaManaRate = (KinkyDungeonStatStaminaMax - KinkyDungeonStatStaminaMana < KinkyDungeonStatStaminaRegenManaLowThreshold) ? KinkyDungeonStatStaminaRegenManaLow : KinkyDungeonStatStaminaRegenMana;
	}
	var willpowerRate = KinkyDungeonStatWillpowerRegen;

	// Arousal reduces staminal regen
	KinkyDungeonStaminaRate += KinkyDungeonStatArousal / 100 * KinkyDungeonStatArousalRegenStaminaRegenFactor;

	// If below a threshold, willpower starts to drain
	if (KinkyDungeonStatStamina <= KinkyDungeonWillpowerDrainLowStaminaThreshold) willpowerRate += KinkyDungeonWillpowerDrainLowStamina;

	// Update the player tags based on the player's groups
	KinkyDungeonPlayerTags = KinkyDungeonUpdateRestraints(delta);

	KinkyDungeonBlindLevel = Math.max(KinkyDungeonBlindLevelBase, KinkyDungeonPlayer.GetBlindLevel());
	if (KinkyDungeonStatBlind > 0) KinkyDungeonBlindLevel = 3;
	KinkyDungeonDeaf = KinkyDungeonPlayer.IsDeaf();

	// Slowness calculation
	KinkyDungeonCalculateSlowLevel();

	// Unarmed damage calc
	KinkyDungeonPlayerDamage = KinkyDungeonGetPlayerWeaponDamage(!InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) && !InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands"));

	if (!KinkyDungeonPlayer.CanInteract()) {
		KinkyDungeonPlayerDamage.chance /= 2;
	}
	if (!KinkyDungeonPlayer.CanWalk() && KinkyDungeonPlayerDamage.unarmed) {
		KinkyDungeonPlayerDamage.dmg /= 2;
	}
	if (KinkyDungeonPlayer.Pose.includes("Hogtied") || KinkyDungeonPlayer.Pose.includes("Kneel")) {
		KinkyDungeonPlayerDamage.chance /= 1.5;
	}

	KinkyDungeonUpdateStruggleGroups();

	KinkyDungeonDressPlayer();

	// Cap off the values between 0 and maximum
	KinkyDungeonStatArousal += arousalRate*delta;
	KinkyDungeonStatStamina += KinkyDungeonStaminaRate*delta;
	KinkyDungeonStatStaminaMana += KinkyDungeonStatStaminaManaRate;
	KinkyDungeonStatWillpower += willpowerRate*delta;
	KinkyDungeonStatBlind = Math.max(0, KinkyDungeonStatBlind - delta);

	KinkyDungeonCapStats();


}

function KinkyDungeonCapStats() {
	KinkyDungeonStatArousal = Math.max(0, Math.min(KinkyDungeonStatArousal, KinkyDungeonStatArousalMax));
	KinkyDungeonStatStamina = Math.max(0, Math.min(KinkyDungeonStatStamina, KinkyDungeonStatStaminaMax));
	KinkyDungeonStatStaminaMana = Math.max(0, Math.min(KinkyDungeonStatStaminaMana, KinkyDungeonStatStamina));
	KinkyDungeonStatWillpower = Math.max(0, Math.min(KinkyDungeonStatWillpower, KinkyDungeonStatWillpowerMax));
}

function KinkyDungeonCalculateVibeLevel() {
	let oldVibe = KinkyDungeonVibeLevel;
	KinkyDungeonVibeLevel = 0;
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint && KinkyDungeonInventory[I].restraint.intensity) {
			let vibe = KinkyDungeonInventory[I].restraint;
			let drain = vibe.battery - Math.max(0, vibe.battery - vibe.intensity/2);
			if (drain > 0)
				KinkyDungeonVibeLevel = Math.max(KinkyDungeonVibeLevel + drain/4, drain);

			vibe.battery = Math.max(0, vibe.battery - drain);
		}
	}

	if (oldVibe > 0 && KinkyDungeonVibeLevel == 0) {
		if (!KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonEndVibe"), "#FFaadd", 2)) KinkyDungeonSendActionMessage(2, TextGet("KinkyDungeonEndVibe"), "#FFaadd", 2);
	}

	if (KinkyDungeonVibeLevel > 0) {
		KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonVibing" + Math.max(0, Math.min(Math.floor(KinkyDungeonVibeLevel), 4))), "#FFaadd", 1);
	}
}

function KinkyDungeonCanOrgasm() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint && KinkyDungeonInventory[I].restraint.orgasm) {
			return true;
		}
	}
	return false;
}

function KinkyDungeonCalculateSlowLevel() {
	KinkyDungeonSlowLevel = 0;
	if (KinkyDungeonPlayer.IsMounted() || KinkyDungeonPlayer.Effect.indexOf("Tethered") >= 0 || KinkyDungeonPlayer.IsEnclose()) {KinkyDungeonSlowLevel = 100; KinkyDungeonMovePoints = 0;}
	else {
		let boots = KinkyDungeonGetRestraintItem("ItemBoots");
		if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Block", true) || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "KneelFreeze", true)) KinkyDungeonSlowLevel += 1.0;
		if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Block", true) || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Freeze", true) || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Slow", true)) KinkyDungeonSlowLevel += 1;
		if (boots && boots.restraint && boots.restraint.slowboots) KinkyDungeonSlowLevel += 1.0;
		if (KinkyDungeonPlayer.Pose.includes("Kneel")) KinkyDungeonSlowLevel = Math.max(3, KinkyDungeonSlowLevel + 1);
		if (KinkyDungeonPlayer.Pose.includes("Hogtied")) KinkyDungeonSlowLevel = Math.max(5, KinkyDungeonSlowLevel + 1);

		for (let I = 0; I < KinkyDungeonInventory.length; I++) {
			if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint && KinkyDungeonInventory[I].restraint.freeze) {
				KinkyDungeonSlowLevel = 100;
			}
		}
	}
}
