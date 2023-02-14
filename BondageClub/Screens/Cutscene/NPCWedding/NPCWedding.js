"use strict";
var NPCWeddingBackground = "Management";
/** @type {null | NPCCharacter} */
var NPCWeddingWife = null;
/** @type {null | NPCCharacter} */
var NPCWeddingGirlLeft = null;
/** @type {null | NPCCharacter} */
var NPCWeddingGirlRight = null;

/**
 * Puts a wedding dress on a specified character
 * @param {Character} C - The character that must wear the ring.
 * @param {string} Dress - The asset name of wedding dress to wear.
 * @returns {void} - Nothing.
 */
 function NPCWeddingDress(C, Dress) {
	CharacterNaked(C);
	InventoryWear(C, Dress, "Cloth");
	InventoryWear(C, "WeddingVeil1", "HairAccessory1");
	InventoryWear(C, "Stockings2", "Socks");
	InventoryWear(C, "Heels1", "Shoes", "#DDDDDD");
}

/**
 * Puts a bridesmaid dress on a specified character
 * @param {Character} C - The character that must wear the ring.
 * @returns {void} - Nothing.
 */
 function NPCWeddingBridesmaid(C) {
	CharacterNaked(C);
	InventoryWear(C, "BridesmaidDress1", "Cloth");
	InventoryWear(C, "Bouquet", "ClothAccessory");
	InventoryWear(C, "Stockings1", "Socks", "#FF4444");
	InventoryWear(C, "Heels1", "Shoes", "#800000");
}

/**
 * Loads the NPC wedding cutscene by creating the random NPCs and setting the stage
 * @returns {void} - Nothing
 */
function NPCWeddingLoad() {
	CharacterRelease(Player);
	CharacterRelease(NPCWeddingWife);
	CharacterSetActivePose(Player, null);
	CharacterSetActivePose(NPCWeddingWife, null);
	CutsceneStage = 0;
	NPCWeddingBackground = CommonRandomItemFromList("", ["WeddingRoom", "WeddingArch", "WeddingBeach"])
	NPCWeddingGirlLeft = CharacterLoadNPC("NPC_NPCWedding_GirlLeft");
	NPCWeddingBridesmaid(NPCWeddingGirlLeft);
	NPCWeddingGirlRight = CharacterLoadNPC("NPC_NPCWedding_GirlRight");
	NPCWeddingBridesmaid(NPCWeddingGirlRight);
}

/**
 * Runs and draws the NPC wedding cutscene
 * @returns {void} - Nothing
 */
function NPCWeddingRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(NPCWeddingWife, 1000, 0, 1);
	if ((CutsceneStage >= 2) && (CutsceneStage <= 8)) {
		DrawCharacter(NPCWeddingGirlLeft, 0, 0, 1);
		DrawCharacter(NPCWeddingGirlRight, 1500, 0, 1);
	}
	DrawText(TextGet("NPCWedding" + CutsceneStage.toString()), 1000, 980, "Black", "White");
}

/**
 * Handles clicks during the NPC wedding cutscene. Clicking anywhere on the screen advances the cutscene. At the end of the cutscene, the player is sent back to her private room.
 * @returns {void} - Nothing
 */
function NPCWeddingClick() {
	CutsceneStage++;
	if (CutsceneStage == 1) {
		NPCWeddingDress(Player, "WeddingDress1");
		NPCWeddingDress(NPCWeddingWife, "WeddingDress2");
	}
	if (CutsceneStage == 4) {
		PrivateWearRing(Player, "#D0D000");
		PrivateWearRing(NPCWeddingWife, "#D0D000");
	}
	if (CutsceneStage == 7) {
		CharacterFullRandomRestrain(NPCWeddingGirlLeft, "ALL", true);
		CharacterFullRandomRestrain(NPCWeddingGirlRight, "ALL", true);
	}
	if (CutsceneStage == 9) {
		NPCWeddingBackground = CommonRandomItemFromList("", ["BDSMRoomBlue", "BDSMRoomPurple", "BDSMRoomRed"])
	}
	if (CutsceneStage == 10) {
		CharacterNaked(Player);
		CharacterNaked(NPCWeddingWife);
	}
	if (CutsceneStage > 11) {
		NPCWeddingDress(Player, "WeddingDress1");
		NPCWeddingDress(NPCWeddingWife, "WeddingDress2");
		CommonSetScreen("Room", "Private");
		ServerPrivateCharacterSync();
	}
}