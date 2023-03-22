"use strict";
var PandoraPrisonBackground = "Cell";
var PandoraWillpowerTimer = 0;
/** @type {null | NPCCharacter} */
var PandoraPrisonMaid = null;
/** @type {null | NPCCharacter} */
var PandoraPrisonGuard = null;
/** @type {null | NPCCharacter} */
var PandoraPrisonCharacter = null;
var PandoraPrisonCharacterTimer = 0;
var PandoraPrisonEscaped = false;
var PandoraPrisonBribeEnabled = true;
var PandoraQuickieCount = 0;
var PandoraQuickiePleasure = 0;

/**
 * Loads the Pandora's Box prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonLoad() {
	PandoraParty = [];
	if (!PandoraPrisonEscaped) PandoraPrisonCharacter = null;
	if (PandoraPrisonMaid == null) {
		PandoraPrisonMaid = CharacterLoadNPC("NPC_PandoraPrison_Maid");
		PandoraPrisonMaid.AllowItem = false;
		PandoraPrisonMaid.TriggerIntro = false;
		PandoraDress(PandoraPrisonMaid, "Maid");
	}
	if (PandoraPrisonGuard == null) {
		PandoraPrisonGuard = CharacterLoadNPC("NPC_PandoraPrison_Guard");
		PandoraPrisonGuard.AllowItem = false;
		PandoraPrisonGuard.TriggerIntro = true;
		PandoraDress(PandoraPrisonGuard, "Guard");
	}
	if (PandoraWillpowerTimer == 0) PandoraWillpowerTimer = CommonTime() + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	PandoraMaxWillpower = 20 + (SkillGetLevel(Player, "Willpower") * 2) + (InfiltrationPerksActive("Resilience") ? 5 : 0) + (InfiltrationPerksActive("Endurance") ? 5 : 0);
	PandoraPrisonBackground = Player.Infiltration.Punishment.Background;
	PandoraPrisonCharacterTimer = CommonTime() + 30000 + Math.floor(Math.random() * 30000);
	CharacterSetActivePose(Player, null);
}

/**
 * Runs and draws the prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonRun() {

	// When time is up, a maid comes to escort the player out, validates that prison time cannot go over 1 hour
	if (Player.Infiltration.Punishment.Timer > CurrentTime + 3600000) Player.Infiltration.Punishment.Timer = CurrentTime + 3600000;
	if ((Player.Infiltration.Punishment.Timer < CurrentTime) && (CurrentCharacter == null) && !PandoraPrisonEscaped)
		PandoraPrisonCharacter = PandoraPrisonMaid;

	// When the willpower timer ticks, we raise willpower by 1
	if (PandoraWillpowerTimer < CommonTime()) {
		if (PandoraWillpower < PandoraMaxWillpower) PandoraWillpower++;
		PandoraWillpowerTimer = PandoraWillpowerTimer + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	}

	// When the character timer ticks, the guard can come in or leave
	if ((Player.Infiltration.Punishment.Timer >= CurrentTime) && (PandoraPrisonCharacterTimer < CommonTime()) && (CurrentCharacter == null) && !PandoraPrisonEscaped) {
		PandoraPrisonBribeEnabled = true;
		PandoraPrisonCharacter = (PandoraPrisonCharacter == null) ? PandoraPrisonGuard : null;
		PandoraPrisonCharacterTimer = CommonTime() + 30000 + Math.floor(Math.random() * 30000);
	}

	// Draws the character and it's sentence
	if (PandoraPrisonCharacter != null) {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PandoraPrisonCharacter, 1000, 0, 1);
	} else DrawCharacter(Player, 750, 0, 1);
	if (Player.CanKneel()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Kneel.png", TextGet("Kneel"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (Player.Infiltration.Punishment.Timer > CurrentTime) {
		DrawText(TextGet("Sentence") + " " + Player.Infiltration.Punishment.Minutes.toString() + " " + TextGet("Minutes"), 1800, 870, "White", "Black");
		DrawText(TextGet("EndsIn") + " " + TimerToString(Player.Infiltration.Punishment.Timer - CurrentTime), 1800, 920, "White", "Black");
	}

	// Draw the willpower / max
	DrawProgressBar(1610, 954, 380, 36, Math.round(PandoraWillpower / PandoraMaxWillpower * 100));
	DrawText(PandoraWillpower.toString(), 1800, 973, "black", "white");

}

/**
 * Generates a new valid activity for the prison guard
 * @returns {void} - Nothing
 */
function PandoraPrisonGuardNewActivity() {
	let Activity = "";
	while (Activity == "") {
		Activity = CommonRandomItemFromList(PandoraPrisonGuard.LastActivity, ["Beat", "Water", "Transfer", "Quickie", "Strip", "Chastity", "Tickle", "ChangeBondage"]);
		if ((Activity == "Beat") && (PandoraWillpower * 2 < PandoraMaxWillpower)) Activity = ""; // Beat only happen at 50% health or more
		if ((Activity == "Water") && (PandoraWillpower * 2 >= PandoraMaxWillpower)) Activity = ""; // Water only happen at 50% health or less
		if ((Activity == "Water") && (Player.Infiltration.Punishment.FightDone != null) && Player.Infiltration.Punishment.FightDone) Activity = ""; // Water cannot happen if there was a fight
		if ((Activity == "Strip") && CharacterIsNaked(Player)) Activity = ""; // Strip cannot happen if already naked
		if ((Activity == "Chastity") && Player.IsChaste()) Activity = ""; // Chastity cannot happen if the player is already chaste
		if ((Activity == "Tickle") && !CharacterIsNaked(Player)) Activity = ""; // Tickle can only happen when the player is naked
		if ((Activity == "Tickle") && Player.CanInteract()) Activity = ""; // Tickle cannot happen when the player isn't bound
	}
	PandoraPrisonGuard.Stage = Activity;
	PandoraPrisonGuard.LastActivity = /** @type {PandoraPrisonActivity} */(Activity);
}

/**
 * Handles clicks in the prison screen, the guard will pick a random activity to do on the player
 * @returns {void} - Nothing
 */
function PandoraPrisonClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose.length === 0) ? "Kneel" : null, true);
	if ((PandoraPrisonCharacter == null) && MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((PandoraPrisonCharacter != null) && MouseIn(1000, 0, 500, 1000)) {
		if (PandoraPrisonGuard.Stage == "RANDOM") PandoraPrisonGuardNewActivity();
		CharacterSetCurrent(PandoraPrisonCharacter);
		if (PandoraPrisonCharacter.TriggerIntro) PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, "Intro" + (Player.CanInteract() ? "" : "Restrained") + PandoraPrisonCharacter.Stage);
	}
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When the player gets fully released by a maid
 * @returns {void} - Nothing
 */
function PandoraPrisonReleasePlayer() {
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null);
	PandoraPrisonBackground = "MainHall";
}

/**
 * When the player exits the prison
 * @returns {void} - Nothing
 */
function PandoraPrisonExitPrison() {
	CharacterRelease(Player);
	CharacterRelease(PandoraPrisonGuard);
	PandoraDress(PandoraPrisonGuard, "Guard");
	PandoraPrisonGuard.AllowItem = false;
	PandoraPrisonEscaped = false;
	CharacterSetActivePose(Player, null);
	delete Player.Infiltration.Punishment;
	ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	DialogLeave();
	CharacterDelete("NPC_PandoraPrison_Maid");
	PandoraPrisonMaid = null;
	if (InfiltrationSupervisor == null) CommonSetScreen("Room", "MainHall");
	else CommonSetScreen("Room", "Infiltration");
}

/**
 * When the player gets ungagged by an NPC, we remove everything on the head
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerUngag() {
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemNose");
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
}

/**
 * When the player gets restrained by an NPC, the arms bondage get tighter with difficulty and if a fight occured
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerRestrain(Level) {
	CharacterSetActivePose(Player, null);
	CharacterRelease(Player);
	CharacterFullRandomRestrain(Player, Level);
	let Item = InventoryGet(Player, "ItemArms");
	if (Item != null) {
		if (Item.Difficulty == null) Item.Difficulty = 0;
		Item.Difficulty = parseInt(Item.Difficulty) + parseInt(InfiltrationDifficulty) + 1;
		if ((Player.Infiltration.Punishment.FightDone != null) && Player.Infiltration.Punishment.FightDone) Item.Difficulty = Item.Difficulty + 5;
	}
}

/**
 * When the player gets stripped and restrained by an NPC, call the regular restrain function
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerStrip(Level) {
	CharacterNaked(Player);
	PandoraPrisonPlayerRestrain(Level);
}

/**
 * When the player gets locked in a chastity device by the guard
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerChastity(LockType) {
	if (InventoryGet(Player, "ItemPelvis") == null) {
		InventoryWearRandom(Player, "ItemPelvis", null, null, false, true, ["MetalChastityBelt", "LeatherChastityBelt", "SleekLeatherChastityBelt", "StuddedChastityBelt", "PolishedChastityBelt", "SteelChastityPanties"], true);
		InventoryLock(Player, "ItemPelvis", LockType);
	}
	if (InventoryGet(Player, "ItemBreast") == null) {
		InventoryWearRandom(Player, "ItemBreast", null, null, false, true, ["MetalChastityBra", "PolishedChastityBra", "LeatherBreastBinder"], true);
		InventoryLock(Player, "ItemBreast", LockType);
	}
}

/**
 * When the NPC leaves the prison
 * @returns {void} - Nothing
 */
function PandoraPrisonCharacterRemove() {
	InventoryRemove(CurrentCharacter, "ItemHandheld");
	PandoraPrisonCharacter = null;
	PandoraPrisonCharacterTimer = CommonTime() + 30000 + Math.floor(Math.random() * 30000);
	PandoraPrisonGuard.Stage = "RANDOM";
	DialogLeave();
}

/**
 * Returns TRUE if the player can start a fight
 * @returns {boolean} - TRUE if the player can start a fight
 */
function PandoraPrisonCanStartFight() {
	return (!Player.IsRestrained() && (PandoraWillpower >= 1) && Player.CanTalk());
}

/**
 * Starts the fight with the NPC guard
 * @returns {void} - Nothing
 */
function PandoraPrisonStartFight() {
	CharacterSetActivePose(Player, null);
	let Difficulty = (InfiltrationDifficulty * 2) + 2;
	KidnapStart(CurrentCharacter, PandoraPrisonBackground, Difficulty, "PandoraPrisonFightEnd()");
}

/**
 * When the fight with the NPC ends
 * @returns {void} - Nothing
 */
function PandoraPrisonFightEnd() {
	CharacterSetCurrent(PandoraPrisonGuard);
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (CurrentCharacter.KidnapMaxWillpower - CurrentCharacter.KidnapWillpower)));
	PandoraWillpower = Player.KidnapWillpower;
	CurrentCharacter.Stage = (KidnapVictory) ? "100" : "200";
	CharacterRelease(KidnapVictory ? Player : CurrentCharacter);
	CurrentCharacter.AllowItem = KidnapVictory;
	PandoraPrisonEscaped = KidnapVictory;
	CommonSetScreen("Room", "PandoraPrison");
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, (KidnapVictory) ? "FightVictory" : "FightDefeat");
	if (!KidnapVictory) {
		Player.Infiltration.Punishment.FightDone = true;
		ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
		PandoraDress(PandoraPrisonGuard, "Guard");
	}
}

/**
 * When the player must strips the current character
 * @returns {void} - Nothing
 */
function PandoraPrisonCharacterNaked() {
	CharacterNaked(CurrentCharacter);
}

/**
 * When the player changes in the clothes of someone else (type)
 * @param {string} Type - The type of character to dress as (ex: Guard)
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerClothes(Type) {
	PandoraDress(Player, Type);
}

/**
 * When the player escapes from the prison, she gains some infiltration skills
 * @returns {void} - Nothing
 */
function PandoraPrisonEscape() {
	CharacterSetActivePose(Player, null);
	PandoraInfiltrationChange(75);
	PandoraPrisonExitPrison();
}

/**
 * When the player starts bribing the guard
 * @returns {void} - Nothing
 */
function PandoraPrisonBribeStart() {
	PandoraPrisonBribeEnabled = false;
}

/**
 * A guard can only bribed once on every round
 * @returns {boolean} - TRUE if bribing the guard is allowed
 */
function PandoraPrisonBribeAllowed() {
	return (PandoraPrisonBribeEnabled && (Player.Infiltration.Punishment.Timer > CurrentTime + 60000) && (Player.Money >= 10) && Player.CanTalk());
}

/**
 * Checks if the perk specified is currently selected
 * @param {string} Type - The perk type
 * @returns {boolean} - Returns TRUE if it's selected
 */
function PandoraPrisonHasPerk(Type) {
	return InfiltrationPerksActive(Type);
}

/**
 * When the player bribes the guard to lower her sentence
 * @param {string|number} Money - The amount of money spent
 * @param {string|number} Minutes - The number of minutes to remove from the sentence
 * @returns {void} - Nothing
 */
function PandoraPrisonBribeProcess(Money, Minutes) {
	Money = parseInt(Money);
	Minutes = parseInt(Minutes);
	if (Money != 0) CharacterChangeMoney(Player, Money * -1);
	if (Minutes != 0) {
		Player.Infiltration.Punishment.Timer = Player.Infiltration.Punishment.Timer - (Minutes * 60000);
		if (Player.Infiltration.Punishment.Timer < CurrentTime + 60000) Player.Infiltration.Punishment.Timer = CurrentTime + 60000;
		ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	}
}

/**
 * When the current NPC picks a random weapon to beat up the player
 * @returns {void} - Nothing
 */
function PandoraPrisonPickWeapon() {
	InventoryWear(PandoraPrisonGuard, CommonRandomItemFromList("", ["Flogger", "Cane", "Paddle", "WhipPaddle", "Whip", "CattleProd", "Belt"]), "ItemHandheld");
	CharacterRefresh(PandoraPrisonGuard);
}

/**
 * When the guard beats up the player, she loses some strength for fights
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerBeat(Damage, Blush) {
	Damage = parseInt(Damage);
	Damage = Math.round(Damage * PandoraMaxWillpower / 100);
	PandoraWillpower = PandoraWillpower - Damage;
	if (PandoraWillpower < 0) PandoraWillpower = 0;
	PandoraWillpowerTimer = PandoraWillpowerTimer + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	CharacterSetFacialExpression(Player, "Blush", Blush, 10);
	CharacterSetFacialExpression(Player, "Eyes", "Closed", 10);
	CharacterSetFacialExpression(Player, "Eyes2", "Closed", 10);
}

/**
 * When the current NPC picks a random tickling item
 * @returns {void} - Nothing
 */
function PandoraPrisonPickTickle() {
	PandoraPrisonPlayerUngag();
	InventoryWear(PandoraPrisonGuard, CommonRandomItemFromList("", ["Feather", "FeatherDuster", "ElectricToothbrush", "Toothbrush", "Vibrator", "VibratingWand", "SmallVibratingWand"]), "ItemHandheld");
	CharacterRefresh(PandoraPrisonGuard);
}

/**
 * When the player squeals, it shorten her sentence
 * @param {string|number} Minutes - The number of minutes to remove from the sentence
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerSqueal(Minutes) {
	Minutes = parseInt(Minutes);
	if (Minutes > 0) {
		Player.Infiltration.Punishment.Timer = Player.Infiltration.Punishment.Timer - (Minutes * 60000);
		if (Player.Infiltration.Punishment.Timer < CurrentTime + 60000) Player.Infiltration.Punishment.Timer = CurrentTime + 60000;
		ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	}
}

/**
 * When the player gets tickled, she reacts and loses some willpower
 * @param {string|number} Damage - The health damage done by the tickle
 * @returns {void} - Nothing
 */
function PandoraPrisonPlayerTickle(Damage) {
	Damage = parseInt(Damage);
	PandoraWillpower = PandoraWillpower - Damage;
	if (PandoraWillpower < 0) PandoraWillpower = 0;
	PandoraWillpowerTimer = PandoraWillpowerTimer + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	CharacterSetFacialExpression(Player, "Blush", "Medium", 10);
	CharacterSetFacialExpression(Player, "Eyes", "Surprised", 10);
	CharacterSetFacialExpression(Player, "Eyes2", "Surprised", 10);
}

/**
 * When the player gets transfered, she gets a hood for the process
 * @returns {void} - Nothing
 */
function PandoraPrisonAddHood() {
	InventoryWear(Player, CommonRandomItemFromList("", ["LeatherHoodSealed", "PolishedSteelHood", "SackHood", "LeatherHoodSensDep", "LeatherHood", "LeatherHoodOpenMouth", "CanvasHood"]), "ItemHood");
	InventoryGet(Player, "ItemHood").Property = { Effect: ["BlindHeavy", "Prone"] };
	CharacterRefresh(Player);
}

/**
 * When the transfer is done, we remove the hood and assign a new background
 * @returns {void} - Nothing
 */
function PandoraPrisonRemoveHood() {
	PandoraPrisonBackground = CommonRandomItemFromList(PandoraPrisonBackground, ["Pandora/Underground/Cell0", "Pandora/Underground/Cell1", "Pandora/Underground/Cell2", "Pandora/Underground/Cell3", "Pandora/Underground/Cell4", "Pandora/Underground/Cell5", "Pandora/Underground/Cell6"]);
	Player.Infiltration.Punishment.Background = PandoraPrisonBackground;
	ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	InventoryRemove(Player, "ItemHood");
}

/**
 * Prepares the quickie scene by kneeling the player and removing the guards pants
 * @returns {void} - Nothing
 */
function PandoraPrisonQuikieStart() {
	CharacterSetActivePose(Player, "Kneel", true);
	InventoryRemove(PandoraPrisonGuard, "ClothLower");
	InventoryRemove(PandoraPrisonGuard, "Panties");
	PandoraQuickieCount = 0;
	PandoraQuickiePleasure = 1;
}

/**
 * Process the quickie scene, the player must progress slowly but only has 5 tries
 * @param {string|number} Factor - The pleasure factor to apply
 * @returns {void} - Nothing
 */
function PandoraPrisonQuikieProcess(Factor) {
	Factor = parseInt(Factor);
	PandoraQuickieCount++;
	if (Factor > PandoraQuickiePleasure) {
		if (PandoraQuickieCount >= 5) {
			PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, "QuickieFail");
			PandoraPrisonQuickieEnd("QuickieEnough");
		} else PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, "QuickieTooFast");
		return;
	}
	PandoraQuickiePleasure = PandoraQuickiePleasure + Factor;
	CharacterSetFacialExpression(PandoraPrisonCharacter, "Blush", "Medium", 7);
	if ((PandoraQuickieCount >= 5) || (PandoraQuickiePleasure >= 15)) {
		if (PandoraQuickiePleasure >= 15) {
			CharacterSetFacialExpression(PandoraPrisonCharacter, "Blush", "High", 7);
			CharacterSetFacialExpression(PandoraPrisonCharacter, "Eyes", "Closed", 7);
			CharacterSetFacialExpression(PandoraPrisonCharacter, "Eyes2", "Closed", 7);
			Player.Infiltration.Punishment.Timer = Player.Infiltration.Punishment.Timer - 300000;
			if (Player.Infiltration.Punishment.Timer < CurrentTime + 60000) Player.Infiltration.Punishment.Timer = CurrentTime + 60000;
			ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
			PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, "QuickieOrgasm");
			PandoraPrisonCharacter.Stage = "QuickieSuccess";
		} else PandoraPrisonQuickieEnd("QuickieEnough");
	}
}

/**
 * Ends the quickie scenario
 * @returns {void} - Nothing
 */
function PandoraPrisonQuickieEnd(Message) {
	if ((Message != null) && (Message != "")) PandoraPrisonCharacter.CurrentDialog = DialogFind(PandoraPrisonCharacter, Message);
	PandoraPrisonCharacter.Stage = "QuickieLeave";
	PandoraDress(PandoraPrisonGuard, "Guard");
	CharacterSetActivePose(Player, null, true);
}

/**
 * When the player drinks water, she heals 25% of her max
 * @returns {void} - Nothing
 */
function PandoraPrisonDrinkWater() {
	PandoraWillpower = PandoraWillpower + Math.round(PandoraMaxWillpower / 4);
	if (PandoraWillpower > PandoraMaxWillpower) PandoraWillpower = PandoraMaxWillpower;
}
