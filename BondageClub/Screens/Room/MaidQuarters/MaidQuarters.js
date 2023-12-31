"use strict";
var MaidQuartersBackground = "MaidQuarters";
/** @type {null | NPCCharacter} */
var MaidQuartersMaid = null;
/** @type {null | NPCCharacter} */
var MaidQuartersMaidInitiation = null;
/** @type {{ Cloth?: Item, Hat?: Item, ItemArms?: Item, ItemLegs?: Item, ItemFeet?: Item }} */
var MaidQuartersItemClothPrev = { Cloth: null, Hat: null, ItemArms: null, ItemLegs: null, ItemFeet: null };
var MaidQuartersMaidReleasedPlayer = false;
var MaidQuartersCanBecomeMaid = false;
var MaidQuartersCannotBecomeMaidYet = false;
var MaidQuartersCanBecomeHeadMaid = false;
var MaidQuartersCannotBecomeHeadMaidYet = false;
var MaidQuartersIsMaid = false;
var MaidQuartersIsHeadMaid = false;
var MaidQuartersSelfBondageMaidDrinksAccepted = false;
var MaidQuartersSelfBondageMaidCleaningAccepted = false;
var MaidQuartersDominantRep = 0;
var MaidQuartersCurrentRescue = "";
var MaidQuartersRescueList = ["IntroductionClass", "ShibariDojo", "Shop", "Gambling"]; // "Prison" should be re-added when git4nick code is ready
var MaidQuartersRescueStage = ["310", "320", "330", "340", "350"];
var MaidQuartersCurrentRescueStarted = false;
var MaidQuartersCurrentRescueCompleted = false;
var MaidQuartersOnlineDrinkStarted = false;
var MaidQuartersOnlineDrinkCount = 0;
var MaidQuartersOnlineDrinkValue = 0;
/** @type {number[]} */
var MaidQuartersOnlineDrinkCustomer = [];
var MaidQuartersOnlineDrinkFromOwner = false;

/**
 * Checks if the player is helpless (maids disabled) or not.
 * @returns {boolean} - Returns true if the player still has time remaining after asking the maids to stop helping
 */
function MaidQuartersIsMaidsDisabled() { var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime ; return (expire > 0 ); }
/**
 * Checks if the player is helpless (maids disabled) or not and also if they have reputation to do work
 * @returns {boolean} - Returns true if the player has maids enabled and also has rep
 */
function MaidQuartersCanDoWorkForMaids() { return (DialogReputationGreater("Maid", "1") && !MaidQuartersIsMaidsDisabled()); }
/**
 * Checks if the player is helpless (maids disabled) or not and also if they have reputation to do work
 * @returns {boolean} - Returns true if the player has maids enabled and also has rep
 */
function MaidQuartersCanDoWorkButMaidsDisabled() { return (DialogReputationGreater("Maid", "1") && MaidQuartersIsMaidsDisabled()); }
/**
 * CHecks for appropriate dressing
 * @returns {boolean} - Returns true if the player wears a maid dress and a maid hair band, false otherwise
 */
function MaidQuartersPlayerInMaidUniform() {
	const clothes = CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name");
	var NakedOrWithApron =
		(CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "None"
		|| CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidApron1"
		|| CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidApron2");
	return (
		// Wearing maid headdress
		(CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1")
		&& (
		// Either regular maid outfits
			(clothes == "MaidOutfit1" || clothes == "MaidOutfit2")
		// Or mostly naked
		|| (NakedOrWithApron
		&& CharacterAppearanceGetCurrentValue(Player, "ClothLower", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Suit", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "SuitLower", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Bra", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Corset", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Panties", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Garters", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Shoes", "Name") == "None")
		// Or in maid underwears
		|| (NakedOrWithApron
		&& CharacterAppearanceGetCurrentValue(Player, "ClothLower", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Suit", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "SuitLower", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Bra", "Name") == "MaidBra1"
		&& CharacterAppearanceGetCurrentValue(Player, "Corset", "Name") == "None"
		&& CharacterAppearanceGetCurrentValue(Player, "Panties", "Name") == "MaidPanties2")
		)
	);
}
/**
 * Checks, if the player is fully dressed for the 'serve drinks' job
 * @returns {boolean} - Retruns true, if the player is wearing a maid uniform, has her legs and arms restrained, is gagged and wearing a serving tray
 */
function MaidQuartersPlayerInDrinksUniform() {
	const legsRestrained = (CharacterAppearanceGetCurrentValue(Player, "ItemLegs", "ID") != "None");
	const armsRestrained = (CharacterAppearanceGetCurrentValue(Player, "ItemArms", "ID") != "None");
	const hasTray = (InventoryGet(Player, "ItemMisc") && InventoryGet(Player, "ItemMisc").Asset.Name == "ServingTray");
	return (MaidQuartersPlayerInMaidUniform() && legsRestrained && armsRestrained && hasTray && Player.CanWalk() && !Player.CanTalk() && !Player.IsBlind());
}
/**
 * Checks, if the player can leave the maid to wear her uniform for the 'serve drink job'
 * @returns {boolean} - Returns true, if the player is a maid, not wearing her uniform and was not forced to do the job
 */
function MaidQuartersPlayerCanChangeForDrinks() {
	return (MaidQuartersIsMaid && !MaidQuartersPlayerInMaidUniform() && !MaidQuartersOnlineDrinkFromOwner);
}
/**
 * Checks, if the player is fully dressed for the 'clean room job'
 * @returns {boolean} - Returns true, if the player is wearing a maid uniform, has her feet, legs and arms restrained and is wearing a duster gag
 */
function MaidQuartersPlayerInCleaningUniform() {
	const feetRestrained = (CharacterAppearanceGetCurrentValue(Player, "ItemFeet", "ID") != "None");
	const legsRestrained = (CharacterAppearanceGetCurrentValue(Player, "ItemLegs", "ID") != "None");
	const armsRestrained = (CharacterAppearanceGetCurrentValue(Player, "ItemArms", "ID") != "None");
	const hasDusterGag = (CharacterAppearanceGetCurrentValue(Player, "ItemMouth", "Name") == "DusterGag" || CharacterAppearanceGetCurrentValue(Player, "ItemMouth2", "Name") == "DusterGag" || CharacterAppearanceGetCurrentValue(Player, "ItemMouth3", "Name") == "DusterGag");
	return (MaidQuartersPlayerInMaidUniform() && feetRestrained && legsRestrained && armsRestrained && hasDusterGag && !Player.IsBlind());
}
/**
 * Checks, if the player can leave the maid to wear her uniform for the 'clean room job'
 * @returns {boolean} - Returns true, if the player is a maid and not wearing her uniform
 */
function MaidQuartersPlayerCanChangeForCleaning() {
	return (MaidQuartersIsMaid && !MaidQuartersPlayerInMaidUniform());
}
/**
 * Checks, if the player can leave the maid to wear her uniform for the 'rescue job'
 * @returns {boolean} - Returns true, if the player is a maid and not wearing her uniform
 */
function MaidQuartersPlayerCanChangeForRescue() {
	return (MaidQuartersIsMaid && !MaidQuartersPlayerInMaidUniform());
}
/**
 * Update the maid current dialog to give an advice about why the player's current outfit isn't a maid outfit
 */
function MaidQuartersAdviceMaidUniform() {
	if (!(CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1")) {
		MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "NoHairband");
	} else if (CharacterAppearanceGetCurrentValue(Player, "Bra", "Name") == "MaidBra1" && CharacterAppearanceGetCurrentValue(Player, "Panties", "Name") == "MaidPanties2") {
		MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "NoDress");
	} else {
		MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "WrongOutfit");
	}
}

/**
 * Checks, if the player is able to do the 'serve drinks' job
 * @returns {boolean} - Returns true, if the player can do the job, false otherwise
 */
function MaidQuartersAllowMaidDrinks() { return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained() && !LogQuery("ClubMistress", "Management")); }
/**
 * Checks, if the player is ready for the 'serve drinks' job and is allowed to do it
 * @returns {boolean} - Returns true, if the player is ready for the job, false otherwise
 */
function MaidQuartersAllowSelfBondageMaidDrinks() { return (MaidQuartersPlayerInDrinksUniform() && !MaidQuartersMaid.IsRestrained() && !LogQuery("ClubMistress", "Management")); }
/**
 * Accept to start the 'serve drinks' job when self prepared for it
 * @returns {void} - Nothing
 */
function MaidQuartersAcceptSelfBondageMaidDrinks() {
	MaidQuartersSelfBondageMaidDrinksAccepted = true;
	DialogChangeReputation("Dominant", -2);
	InventoryWear(Player, "WoodenMaidTray", "ItemMisc");
}
/**
 * Checks, if the player can do the 'clean room job'
 * @returns {boolean} - Returns true, if the player can do the job, false otherwise
 */
function MaidQuartersAllowMaidCleaning() { return (!Player.IsRestrained() && !MaidQuartersMaid.IsRestrained() && !LogQuery("ClubMistress", "Management")); }
/**
 * Checks, if the player is ready for the 'clean room job' and is allowed to do it
 * @returns {boolean} - Returns true, if the player is ready for the job, false otherwise
 */
function MaidQuartersAllowSelfBondageMaidCleaning() {
	return (MaidQuartersPlayerInCleaningUniform() && !MaidQuartersMaid.IsRestrained() && !LogQuery("ClubMistress", "Management"));
}

/**
 * Accept to start the 'clean room job' when self prepared for it
 * @returns {void} - Nothing
 */
function MaidQuartersAcceptSelfBondageMaidCleaning() {
	MaidQuartersSelfBondageMaidCleaningAccepted = true;
	DialogChangeReputation("Dominant", -2);
}
/**
 * Checks, if the player can do the 'play music' job
 * @returns {boolean} - Returns true, if the player can do the job, false otherwise
 */
function MaidQuartersAllowMaidPlayMusic() { return (!Player.IsRestrained()); }
/**
 * Checks, if the player can do a rescue mission
 * @returns {boolean} - Returns true, if the player can do the job, false otherwise
 */
function MaidQuartersAllowRescue() { return (!Player.IsRestrained()); }
/**
 * Checks, if the player is on a running rescue mission
 * @returns {boolean} - Returns true, if the player has a running but unfinished rescue mission, false otherwise
 */
function MaidQuartersAllowCancelRescue() { return (MaidQuartersCurrentRescueStarted && !MaidQuartersCurrentRescueCompleted); }
/**
 * Checks, if the 'Unlock Sarah' quest is available
 * @returns {boolean} - Returns true, if the quest is available, false otherwise
 */
function MaidQuartersCanFreeSarah() { return (SarahUnlockQuest && LogQuery("LeadSorority", "Maid")); }
/**
 * Checks, if the maid can release the player from her restraint
 * @returns {boolean} - Returns true, if the player can be released, false otherwise
 */
function MaidQuartersCanReleasePlayer() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && !InventoryCharacterHasLockedRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract()) && !MaidQuartersIsMaidsDisabled();}
/**
 * Checks, if the maid is unable to free the player
 * @returns {boolean} - Returns true, if the maid is unable to free the player, false otherwise
 */
function MaidQuartersCannotReleasePlayer() { return (Player.IsRestrained() && (InventoryCharacterHasOwnerOnlyRestraint(Player) || InventoryCharacterHasLockedRestraint(Player) || !CurrentCharacter.CanTalk() || !CurrentCharacter.CanInteract())); }
/**
 * Checks, if the player can get the duster gag
 * @returns {boolean} - Returns true, if the player can get the duster gag, false otherwise
 */
function MaidQuartersCanGetDusterGag() { return (!SarahUnlockQuest && LogQuery("JoinedSorority", "Maid") && Player.CanTalk() && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && (!InventoryAvailable(Player, "DusterGag", "ItemMouth") || !InventoryAvailable(Player, "DusterGag", "ItemMouth2") || !InventoryAvailable(Player, "DusterGag", "ItemMouth3"))); }
/**
 * Checks, if the player has finished the 'serve drinks' job
 * @returns {boolean} - Returns true, if the job is finished, false otherwise
 */
function MaidQuartersOnlineDrinkCompleted() { return (MaidQuartersOnlineDrinkCount >= 5); }
/**
 * Checks if the player can talk after being rewarded for the online drinks mini-game
 * @returns {boolean} - Returns true, if the player is gagged or restrained.
 */
function MaidQuartersOnlineDrinkIsRestrained() { return Player.IsRestrained() || !Player.CanTalk();}
/**
 * Checks if the player can get ungagged by the maids
 * @returns {boolean} - Returns true, if the maids can remove the gag, false otherwise
 */
function MaidQuartersCanUngag() { return (!Player.CanTalk() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && !MaidQuartersIsMaidsDisabled()); }
function MaidQuartersCanUngagAndMaidsDisabled() { return MaidQuartersIsMaidsDisabled() && (!Player.CanTalk()); }
/**
 * Checks, if the maids are unable to remove the gag (if there is one)
 * @returns {boolean} - Returns true, if the player cannot be ungagged by the maids, false otherwise
 */
function MaidQuartersCannotUngag() { return (!Player.CanTalk() && InventoryCharacterHasOwnerOnlyRestraint(Player)); }
function MaidQuartersCannotUngagAndMaidsNotDisabled() { return !MaidQuartersIsMaidsDisabled() && (!Player.CanTalk() && InventoryCharacterHasOwnerOnlyRestraint(Player)); }

/**
 * Loads the maid quarters. This function is called dynamically, as soon, as the player enters the maid quarters
 * @returns {void} - Nothing
 */
function MaidQuartersLoad() {

	// Creates the maid that gives work and the initiation maids
	MaidQuartersMaid = CharacterLoadNPC("NPC_MaidQuarters_Maid");
	MaidQuartersMaidInitiation = CharacterLoadNPC("NPC_MaidQuarters_InitiationMaids");
	InventoryWear(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");

}

/**
 * Runs the maid quarters dialog
 * This function is called periodically so don't use it for extensive use or the call of other complex functions
 * @returns {void} - Nothing
 */
function MaidQuartersRun() {
	MaidQuartersCanBecomeMaid = (!LogQuery("JoinedSorority", "Maid") && (ReputationGet("Maid") >= 50));
	MaidQuartersCannotBecomeMaidYet = ((ReputationGet("Maid") > 0) && (ReputationGet("Maid") < 50) && !LogQuery("JoinedSorority", "Maid"));
	MaidQuartersCanBecomeHeadMaid = ((ReputationGet("Maid") >= 100) && (ReputationGet("Dominant") >= 50) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersCannotBecomeHeadMaidYet = (((ReputationGet("Maid") < 100) || (ReputationGet("Dominant") < 50)) && LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid"));
	MaidQuartersIsMaid = LogQuery("JoinedSorority", "Maid");
	MaidQuartersIsHeadMaid = LogQuery("LeadSorority", "Maid");
	if (!DailyJobSubSearchIsActive()) DrawCharacter(Player, 500, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(MaidQuartersMaid, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (Player.CanChangeOwnClothes()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png", TextGet("Change"));
	if (Player.CanChangeOwnClothes() && LogQuery("JoinedSorority", "Maid")) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Wardrobe.png", TextGet("Dress"));
	DailyJobSubSearchRun();
}

/**
 * Handles the click events of the maid quarters. Clicks are propageted from 'CommonClick()'
 * @returns {void} - Nothing
 */
function MaidQuartersClick() {
	if (!DailyJobSubSearchIsActive() && (MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && (MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) {
		ManagementClubSlaveDialog(MaidQuartersMaid);
		CharacterSetCurrent(MaidQuartersMaid);
		if (MaidQuartersMaid.Stage == "285") {
			let MaidDialog = "";
			if (MaidQuartersOnlineDrinkCompleted()) MaidDialog = "MaidDrinkOnlineComplete";
			if (!MaidQuartersOnlineDrinkCompleted()) {
				if (!InventoryGet(Player, "ItemMisc") || InventoryGet(Player, "ItemMisc").Asset.Name !== "WoodenMaidTrayFull") {
					MaidDialog = "MaidDrinkOnlineIncompleteMissingTray";
					InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");
				} else {
					MaidDialog = "MaidDrinkOnlineIncomplete";
				}
			}
			MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, MaidDialog);
		}
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanChangeOwnClothes() && LogQuery("JoinedSorority", "Maid")) {
		if (!MaidQuartersPlayerInMaidUniform()) {
			MaidQuartersWearMaidUniform();
		} else {
			switch (CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name")){
				case "MaidOutfit1": InventoryWear(Player,"MaidOutfit2","Cloth"); break;
				case "MaidOutfit2": InventoryWear(Player,"MaidApron1","Cloth"); break;
				case "MaidApron1": InventoryWear(Player,"MaidApron2","Cloth"); break;
				case "MaidApron2": InventoryWear(Player,"MaidOutfit1","Cloth"); break;
			}
		}
	}
	DailyJobSubSearchClick();
}

/**
 * The maid ungags the player
 * @returns {void} - Nothing
 */
function MaidQuartersMaidUngagPlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		InventoryRemove(Player, "ItemMouth");
		InventoryRemove(Player, "ItemMouth2");
		InventoryRemove(Player, "ItemMouth3");
		InventoryRemove(Player, "ItemHead");
		InventoryRemove(Player, "ItemHood");
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

/**
 * Dresses the player as a maid
 * @returns {void} - Nothing
 */
function MaidQuartersWearMaidUniform() {
	const InUniform = MaidQuartersPlayerInMaidUniform();

	const groupNames = /** @type {AssetGroupName[]} */(Object.keys(MaidQuartersItemClothPrev));
	for (const ItemAssetGroupName of groupNames) {
		MaidQuartersItemClothPrev[ItemAssetGroupName] = InventoryGet(Player, ItemAssetGroupName);
		if (!InUniform)
			InventoryRemove(Player, ItemAssetGroupName);
	}

	if (!InUniform) {
		InventoryWear(Player, "MaidOutfit1", "Cloth", "Default");
		InventoryWear(Player, "MaidHairband1", "Hat", "Default");
	}
}

/**
 * Removes the maid uniform and dresses the character back
 * @returns {void} - Nothing
 */
function MaidQuartersRemoveMaidUniform() {
	CharacterReleaseNoLock(Player);
	if (MaidQuartersSelfBondageMaidCleaningAccepted) {
		MaidQuartersSelfBondageMaidCleaningAccepted = false;
	} else if (MaidQuartersSelfBondageMaidDrinksAccepted) {
		MaidQuartersSelfBondageMaidDrinksAccepted = false;
	} else {
		const groupNames = /** @type {AssetGroupName[]} */(Object.keys(MaidQuartersItemClothPrev));
		for (let ItemAssetGroupName of groupNames) {
			var PreviousItem = MaidQuartersItemClothPrev[ItemAssetGroupName];
			InventoryRemove(Player, ItemAssetGroupName);
			if (PreviousItem) InventoryWear(Player, PreviousItem.Asset.Name, ItemAssetGroupName, PreviousItem.Color);
			if (PreviousItem && PreviousItem.Property) InventoryGet(Player, ItemAssetGroupName).Property = PreviousItem.Property;
			MaidQuartersItemClothPrev[ItemAssetGroupName] = null;
		}
	}
	InventoryRemove(Player, "ItemMisc");
	CharacterRefresh(Player);
}

/**
 * Starts a mini game or maid chore
 * @param {string} GameType - Name of the mini-game to launch
 * @param {number} Difficulty - Difficulty Ration for the mini-game
 * @returns {void} - Nothing
 */
function MaidQuartersMiniGameStart(GameType, Difficulty) {
	MiniGameStart(GameType, Difficulty, "MaidQuartersMiniGameEnd");
}

/**
 * Is called when the mini game ends and sends the player back to the maid quarters.
 * Depending on the choosen game, the next dialog option is selected
 * @returns {void} - Nothing
 */
function MaidQuartersMiniGameEnd() {
	CommonSetScreen("Room", "MaidQuarters");
	CharacterSetCurrent(MaidQuartersMaid);
	if (MiniGameVictory && (MiniGameType == "MaidDrinks")) MaidQuartersMaid.Stage = "281";
	if (!MiniGameVictory && (MiniGameType == "MaidDrinks")) MaidQuartersMaid.Stage = "282";
	if (MiniGameVictory && (MiniGameType == "MaidCleaning")) MaidQuartersMaid.Stage = "481";
	if (!MiniGameVictory && (MiniGameType == "MaidCleaning")) MaidQuartersMaid.Stage = "482";
	if (MiniGameVictory && (MiniGameType == "RhythmGame")) MaidQuartersMaid.Stage = "590";
	if (!MiniGameVictory && (MiniGameType == "RhythmGame")) MaidQuartersMaid.Stage = "591";
	MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, MiniGameType + (MiniGameVictory ? "Victory" : "Defeat"));
}

/**
 * When an ordinary  mini game / maid chore is successful, the player gets paid and the maid reputation increases
 * @returns {void} - Nothing
 */
function MaidQuartersMiniGamePay() {
	ReputationProgress("Maid", 4);
	var M = 14;
	if (MiniGameDifficultyMode == "Normal") M = M * 1.5;
	if (MiniGameDifficultyMode == "Hard") M = M * 2;
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
	IntroductionJobProgress("SubMaid");
}

/**
 * When the music mini game is successful, the player gets paid
 * @returns {void} - Nothing
 */
function MaidQuartersMiniGamePayAdvanced() {
	ReputationProgress("Maid", 4);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", MiniGameAdvancedPayment.toString());
	CharacterChangeMoney(Player, MiniGameAdvancedPayment);
	IntroductionJobProgress("SubMaid");
}

/**
 * Handles the payment after a successful rescue mission
 * @returns {void} - Nothing
 */
function MaidQuartersRescuePay() {
	MaidQuartersRemoveMaidUniform();
	ReputationProgress("Maid", 4);
	var M = 15 + Math.floor(Math.random() * 11);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	CharacterChangeMoney(Player, M);
	IntroductionJobProgress("SubMaid");
}

/**
 * The maid releases the player, reduces her dominant score and assures that this option is only used once
 * @returns {void} - Nothing
 */
function MaidQuartersMaidReleasePlayer() {
	if (MaidQuartersMaid.CanInteract()) {
		if (!MaidQuartersMaidReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			MaidQuartersMaidReleasedPlayer = true;
		}
		CharacterReleaseNoLock(Player);
	} else MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "CantReleasePlayer");
}

/**
 * Collects the dominant reputation change of a player during the course of the various dialog options.
 * When the player becomes a maid, the change is applied
 * @param {string} Value - The value by which the reputation is changed
 * @returns {void} - Nothing
 */
function MaidQuartersDominantRepChange(Value) {
	MaidQuartersDominantRep = MaidQuartersDominantRep + parseInt(Value);
}

/**
 * Switches from one maid to another in the initiation
 * @param {string} MaidType - Name of the current maid type
 */
function MaidQuartersInitiationTransition(MaidType) {
	var C = ((MaidType == "MainMaid") ? MaidQuartersMaid : MaidQuartersMaidInitiation);
	CharacterSetCurrent(C);
	C.CurrentDialog = DialogFind(C, "MaidInitiationTransition");
}

/**
 * Change the initiation maid appearance on the spot to simulate a new character
 * @returns {void} - Nothing
 */
function MaidQuartersChangeInitiationMaid() {
	CharacterRandomName(MaidQuartersMaidInitiation);
	CharacterAppearanceFullRandom(MaidQuartersMaidInitiation);
	CharacterAppearanceSetItem(MaidQuartersMaidInitiation, "Cloth", MaidQuartersMaidInitiation.Inventory[MaidQuartersMaidInitiation.Inventory.length - 2].Asset);
	CharacterAppearanceSetItem(MaidQuartersMaidInitiation, "Hat", MaidQuartersMaidInitiation.Inventory[MaidQuartersMaidInitiation.Inventory.length - 1].Asset);
	CharacterAppearanceSetColorForGroup(MaidQuartersMaidInitiation, "Default", "Cloth");
	CharacterAppearanceSetColorForGroup(MaidQuartersMaidInitiation, "Default", "Hat");
	InventoryWear(MaidQuartersMaidInitiation, "WoodenPaddle", "ItemMisc");
}

/**
 * The player joins the maid sorority
 * @returns {void} - Nothing
 */
function MaidQuartersBecomMaid() {
	LogAdd("JoinedSorority", "Maid");
	LoginMaidItems();
	ServerPlayerInventorySync();
	InventoryWear(Player, "MaidOutfit1", "Cloth", "Default");
	InventoryWear(Player, "MaidHairband1", "Hat", "Default");
	ReputationProgress("Dominant", MaidQuartersDominantRep);
	MaidQuartersCanBecomeMaid = false;
	MaidQuartersIsMaid = true;
}

/**
 * The player is promoted to head maid
 * @returns {void} - Nothing
 */
function MaidQuartersBecomHeadMaid() {
	MaidQuartersIsHeadMaid = true;
	MaidQuartersMaid.AllowItem = true;
	LogAdd("LeadSorority", "Maid");
}

/**
 * Starts a maid rescue mission in a random room. The same room is never selected twice and
 * the player is not sent to the introduction room when doing the daily quest
 * @returns {void} - Nothing
 */
function MaidQuartersStartRescue() {

	MaidQuartersCurrentRescue = CommonRandomItemFromList(MaidQuartersCurrentRescue, MaidQuartersRescueList);
	if ((MaidQuartersCurrentRescue == "IntroductionClass") && (IntroductionJobCurrent == "SubMaid")) MaidQuartersCurrentRescue = CommonRandomItemFromList(MaidQuartersCurrentRescue, ["ShibariDojo", "Shop", "Gambling"]);
	MaidQuartersMaid.Stage = MaidQuartersRescueStage[MaidQuartersRescueList.indexOf(MaidQuartersCurrentRescue)];
	MaidQuartersMaid.CurrentDialog = DialogFind(MaidQuartersMaid, "Rescue" + MaidQuartersCurrentRescue);
	MaidQuartersCurrentRescueStarted = false;
	MaidQuartersCurrentRescueCompleted = false;
	MaidQuartersWearMaidUniform();
}

/**
 * Cancels the current rescue mission
 * @returns {void} - Nothing
 */
function MaidQuartersCancelRescue() {
	MaidQuartersRemoveMaidUniform();
	if (MaidQuartersCurrentRescue == "IntroductionClass") { IntroductionCompleteRescue(); IntroductionMaid.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "ShibariDojo") { ShibariCompleteRescue(); ShibariTeacher.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "Shop") { ShopCompleteRescue(); ShopVendor.Stage = "0"; }
	if (MaidQuartersCurrentRescue == "Gambling") { GamblingCompleteRescue(); GamblingFirstSub.Stage = "0"; }
}

/**
 * The player as head maid can trick the maids into freeing Sarah
 * @returns {void} - Nothing
 */
function MaidQuartersFreeSarah() {
	SarahUnlock();
}

/**
 * The maid gives a duster gag to the player if she's in the sorority
 * @returns {void} - Nothing
 */
function MaidQuartersGetDusterGag() {
	/** @type {ItemBundle[]} */
	var ItemsToEarn = [];
	ItemsToEarn.push({Name: "DusterGag", Group: "ItemMouth"});
	ItemsToEarn.push({Name: "DusterGag", Group: "ItemMouth2"});
	ItemsToEarn.push({Name: "DusterGag", Group: "ItemMouth3"});
	InventoryAddMany(Player, ItemsToEarn);
}

/**
 * Starts the online drink serving game
 * @returns {void} - Nothing
 */
function MaidQuartersOnlineDrinkStart() {
	InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");
	MaidQuartersOnlineDrinkCount = 0;
	MaidQuartersOnlineDrinkValue = 0;
	ChatRoomMoneyForOwner = 0;
	MaidQuartersOnlineDrinkCustomer = [];
	MaidQuartersOnlineDrinkStarted = true;
}

/**
 * On online player picks a drink from the plyers tray. She only gets credited, if it was a new customer
 * @param {number} MemberNumber - The member ID of the customer
 * @param {number|string} DrinkValue - The value of the picked drink
 */
function MaidQuartersOnlineDrinkPick(MemberNumber, DrinkValue) {
	if ((MaidQuartersOnlineDrinkCount < 5) && (MaidQuartersOnlineDrinkCustomer.indexOf(MemberNumber) < 0)) {
		MaidQuartersOnlineDrinkCount++;
		MaidQuartersOnlineDrinkValue = MaidQuartersOnlineDrinkValue + parseInt(DrinkValue);
		MaidQuartersOnlineDrinkCustomer.push(MemberNumber);
		if (MaidQuartersOnlineDrinkCount >= 5) {
			InventoryWear(Player, "WoodenMaidTray", "ItemMisc");
			CharacterRefresh(Player);
			ChatRoomCharacterUpdate(Player);
		}
	}
}

/**
 * Calculates the player's earnings from the online drink serving.
 * When the maid tray is empty, the player can get paid (40% of drink value + 10$)
 * @returns {void} - Nothing
 */
function MaidQuartersOnlineDrinkPay() {
	var M = 15 + Math.floor(MaidQuartersOnlineDrinkValue * 0.4);
	MaidQuartersMaid.CurrentDialog = MaidQuartersMaid.CurrentDialog.replace("REPLACEMONEY", M.toString());
	if (!MaidQuartersOnlineDrinkFromOwner) CharacterChangeMoney(Player, M);
	else ChatRoomMoneyForOwner = M;
	ReputationProgress("Maid", 4);
	IntroductionJobProgress("SubMaid");
	MaidQuartersOnlineDrinkStarted = false;
}

/**
 * Flags the online drink serving as not initiated by the player's owner
 * @returns {void} - Nothing
 */
function MaidQuartersNotFromOwner() {
	MaidQuartersOnlineDrinkFromOwner = false;
}

function MaidQuartersSetMaidsDisabled(minutes) {
	var millis = minutes * 60000;
	LogAdd("MaidsDisabled", "Maid", CurrentTime + millis);
}
