"use strict";
var CollegeDetentionBackground = "CollegeDetention";
/** @type {null | NPCCharacter} */
var CollegeDetentionYuki = null;
var CollegeDetentionYukiLove = 0;
var CollegeDetentionYukiWillReleaseAt = 0;

// Returns TRUE if the dialog option should be shown
/**
 * Checks, if Yuki can be invited to the private room
 * @returns {boolean} - Returns true, if Yuki can be invited, false otherwise
 */
function CollegeDetentionCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)); }

/**
 * Checks Yuki's current love level
 * @param {string} LoveLevel - The love level that should be checked
 * @returns {boolean} - Returns true, if Yuki's love is greater or equal the given level, false otherwise
 */
function CollegeDetentionYukiLoveIs(LoveLevel) { return (CollegeDetentionYukiLove >= parseInt(LoveLevel)); }

/**
 * Adds the sleeping pill to the player's invertory
 * @returns {void} - Nothing
 */
function CollegeDetentionGetSleepingPills() { InventoryAdd(Player, "RegularSleepingPill", "ItemMouth"); }

/**
 * Adds the teacher key to the players 'inventory'
 * @returns {void} - Nothing
 */
function CollegeDetentionGetTeacherKey() { LogAdd("TeacherKey", "College"); }

/**
 * Checks, if Yuki will release the player
 * @returns {boolean} - Returns true if the detention time is over, flase otherwise
 */
function CollegeDetentionYukiWillRelease() { return (CollegeDetentionYukiWillReleaseAt < CurrentTime); }

/**
 * Creates a fully dressed Yuki
 * @param {Character} C - The character object to dress up
 * @returns {void} - Nothing
 */
function CollegeDetentionYukiClothes(C) {
	CharacterNaked(C);
	InventoryWear(C, "TeacherOutfit1", "Cloth", "Default");
	InventoryWear(C, "PussyDark3", "Pussy", "#333333");
	InventoryWear(C, "Eyes1", "Eyes", "#a57b78");
	InventoryWear(C, "Eyes1", "Eyes2", "#a57b78");
	InventoryWear(C, "Glasses1", "Glasses", "#333333");
	InventoryWear(C, "Mouth", "Mouth", "Default");
	InventoryWear(C, "H0920", "Height", "Default");
	InventoryWear(C, "Small", "BodyUpper", "Asian");
	InventoryWear(C, "Small", "BodyLower", "Asian");
	InventoryWear(C, "Default", "Hands", "Default");
	InventoryWear(C, "Default", "Head", "Default");
	InventoryWear(C, "HairBack6", "HairBack", "#603022");
	InventoryWear(C, "HairFront4", "HairFront", "#603022");
	InventoryWear(C, "Ribbons2", "HairAccessory1", "#111111");
	InventoryWear(C, "Bra1", "Bra", "#2222AA");
	InventoryWear(C, "Panties11", "Panties", "#2222AA");
	InventoryWear(C, "Socks5", "Socks", "#444458");
	InventoryWear(C, "Shoes2", "Shoes", "#111111");
}

/**
 * Loads the room and generates Yuki
 * @returns {void} - Nothing
 */
function CollegeDetentionLoad() {

	// Generates a full Yuki model based on the Bondage College template
	if (CollegeDetentionYuki == null) {

		// Do not generate her if she's already in the private room
		if (PrivateCharacter.length > 1)
			for (let P = 1; P < PrivateCharacter.length; P++)
				if (PrivateCharacter[P].Name == "Yuki")
					return;

		// Generates the model
		CollegeDetentionYuki = CharacterLoadNPC("NPC_CollegeDetention_Yuki");
		CollegeDetentionYuki.AllowItem = false;
		CollegeDetentionYuki.Name = "Yuki";
		CollegeDetentionYuki.GoneAway = false;
		CollegeDetentionYukiClothes(CollegeDetentionYuki);
		CharacterRefresh(CollegeDetentionYuki);

	}

}

/**
 * Runs the room (shows the player and Yuki)
 * @returns {void} - Nothing
 */
function CollegeDetentionRun() {
	DrawCharacter(Player, 500, 0, 1);
	if ((CollegeDetentionYuki != null) && !CollegeDetentionYuki.GoneAway) DrawCharacter(CollegeDetentionYuki, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function CollegeDetentionClick() {
	if (MouseIn(1000, 0, 500, 1000) && (CollegeDetentionYuki != null) && !CollegeDetentionYuki.GoneAway) CharacterSetCurrent(CollegeDetentionYuki);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When Yuki's love towards the player changes, it can also trigger an event.
 * When a good or bad move is done, her expression will change quickly.
 * @param {string} LoveChange - The amount the love of Yuki towards the player is altered
 * @param {*} Event - This parameter is never used. Perhaps legacy code from the college?
 * @returns {void} - Nothing
 */
function CollegeDetentionYukiLoveChange(LoveChange, Event) {
	if (LoveChange != null) CollegeDetentionYukiLove = CollegeDetentionYukiLove + parseInt(LoveChange);
	if ((LoveChange != null) && (parseInt(LoveChange) < 0)) {
		CharacterSetFacialExpression(CollegeDetentionYuki, "Eyes", "Dazed", 2);
		if (CollegeDetentionYukiLove <= -5) {
			CollegeDetentionYuki.Stage = "1000";
			CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "YukiHadEnough");
		}
	}
	if ((LoveChange != null) && (parseInt(LoveChange) > 0)) {
		CharacterSetFacialExpression(CollegeDetentionYuki, "Blush", "Low", 2);
		if (CollegeDetentionYukiLove > 10) {
			CollegeDetentionYuki.Stage = "2000";
			CollegeDetentionYukiLove = 0;
			CollegeDetentionYukiWillReleaseAt = 0;
			CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "YukiPropose");
		}
	}
}

/**
 * Dress the player and Yuki back
 * @returns {void} - Nothing
 */
function CollegeDetentionDressBack() {
	CharacterRelease(Player);
	CharacterRelease(CollegeDetentionYuki);
	CollegeEntranceWearStudentClothes(Player);
	CollegeDetentionYukiClothes(CollegeDetentionYuki);
}

/**
 * Strips both the player and Yuki
 * @returns {void} - Nothing
 */
function CollegeDetentionBothNaked() {
	CharacterNaked(Player);
	CharacterNaked(CollegeDetentionYuki);
}

/**
 * When the player pleases Yuki, it's a race against the clock to make her orgasm
 * @param {string} Factor - The factor that alters Yuki's love towards the player
 * @returns {void} - Nothing
 */
function CollegeDetentionPleaseYuki(Factor) {
	CollegeDetentionYukiWillReleaseAt++;
	CollegeDetentionYukiLove = CollegeDetentionYukiLove + parseInt(Factor);
	if (CollegeDetentionYukiLove >= 6) {
		CollegeDetentionYuki.Stage = "2100";
		CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "Orgasm");
		return;
	}
	if (CollegeDetentionYukiWillReleaseAt >= 6) {
		CollegeDetentionYuki.Stage = "2200";
		CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "NoOrgasm");
		return;
	}
}

/**
 * Yuki restraints the player
 * @param {"Arms" | "Legs" | "Mouth"} Type - The type of restraint to use
 * @returns {void} - Nothing
 */
function CollegeDetentionRestrainPlayer(Type) {
	if (Type == "Arms") InventoryWearRandom(Player, "ItemArms", 4);
	if (Type == "Legs") { InventoryWearRandom(Player, "ItemFeet", 4); InventoryWearRandom(Player, "ItemLegs", 4); }
	if (Type == "Mouth") { InventoryWearRandom(Player, "ItemMouth", 4); CollegeDetentionYukiWillReleaseAt = CurrentTime + 120000; }
}

/**
 * The player invites Yuki to her room. Add her ribbon and the sleeping pill to the player's inventory
 * @returns {void} - Nothing
 */
function CollegeDetentionInviteToPrivateRoom() {
	CollegeDetentionDressBack();

	/** @type {ItemBundle[]} */
	var ItemsToEarn = [];
	ItemsToEarn.push({Name: "Ribbons2", Group: "HairAccessory1"});
	ItemsToEarn.push({Name: "Ribbons2", Group: "HairAccessory3"});
	ItemsToEarn.push({Name: "RegularSleepingPill", Group: "ItemMouth"});
	InventoryAddMany(Player, ItemsToEarn);

	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeDetentionYuki, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Dominant", 20);
	NPCTraitSet(C, "Horny", 80);
	NPCTraitSet(C, "Rude", 60);
	NPCTraitSet(C, "Serious", 40);
	C.Love = 20;
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CollegeDetentionYuki.GoneAway = true;
}
