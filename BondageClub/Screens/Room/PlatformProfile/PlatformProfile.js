"use strict";

/**
 * Returns the number of available perks for the current player character
 * @returns {number} - The number of perks
 */
function PlatformProfileGetFreePerk() {
	return PlatformPlayer.Level - PlatformPlayer.Perk.split("1").length + 1;
}

/**
 * Draws a black arrow that goes down and right
 * @param {number} SX - The source X position on screen
 * @param {number} SY - The source Y position on screen
 * @param {number} TX - The target X position on screen
 * @param {number} TY - The target Y position on screen
 * @returns {void} - Nothing
 */
function PlatformProfileDrawArrow(SX, SY, TX, TY) {
	DrawRect(SX - 10, SY, 20, TY - SY, "Black");
	DrawRect(SX - 10, TY - 10, TX - SX + 10, 20, "Black");
	for (let X = 0; X < 40; X++)
		DrawRect(TX + X, TY - 20 + (X / 2), 1, 40 - X, "Black");

}

/**
 * Loads the screen and removes the key listeners
 * @returns {void} - Nothing
 */
function PlatformProfileLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
}

/**
 * Draws the perk button on the screen, the color changes based on if the perk is available or paid
 * @param {number} X - The X position on screen
 * @param {number} Y - The Y position on screen
 * @param {number} PerkNum - The perk number for the current character
 * @param {Object} Prerequisite1 - If there's a first prerequisite to validate
 * @param {Object} Prerequisite2 - If there's a second prerequisite to validate
 * @returns {void} - Nothing
 */
function PlatformProfileDrawPerkButton(X, Y, PerkNum, Prerequisite1, Prerequisite2) {
	let Color = "White";
	if (PlatformHasPerk(PlatformPlayer, PlatformPlayer.PerkName[PerkNum])) Color = "#AAFFAA";
	if ((Prerequisite1 != null) && !PlatformHasPerk(PlatformPlayer, Prerequisite1)) Color = "#FFAAAA";
	if ((Prerequisite2 != null) && !PlatformHasPerk(PlatformPlayer, Prerequisite2)) Color = "#FFAAAA";
	DrawButton(X, Y, 400, 60, TextGet("Perk" + PlatformPlayer.Name + PerkNum.toString()), Color, "", TextGet("PerkDesc" + PlatformPlayer.Name + PerkNum.toString()), (Color != "White"));
}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformProfileRun() {
	DrawRect(0, 0, 2000, 1000, "#EEEEEE");
	DrawImageResize("Screens/Room/PlatformDialog/Character/" + PlatformPlayer.Name + "/" + PlatformPlayer.Status + "/Idle.png", -50, 0, 500, 1000);
	DrawText(TextGet("Name") + " " + PlatformPlayer.Name, 700, 60, "Black", "Silver");
	DrawText(TextGet("Class") + " " + PlatformPlayer.Status, 700, 120, "Black", "Silver");
	DrawText(TextGet("Age" + PlatformPlayer.Name), 700, 180, "Black", "Silver");
	DrawText(TextGet("Owner") + " "  + TextGet("None"), 700, 240, "Black", "Silver");
	DrawText(TextGet("Lover") + " "  + TextGet("None"), 700, 300, "Black", "Silver");
	DrawText(TextGet("Health") + " " + PlatformPlayer.MaxHealth.toString(), 700, 360, "Black", "Silver");
	DrawText(TextGet("Level") + " " + PlatformPlayer.Level.toString() + " (" + Math.floor(PlatformPlayer.Experience / PlatformExperienceForLevel[PlatformPlayer.Level] * 100).toString() + "%)", 700, 420, "Black", "Silver");
	DrawText(TextGet("Perks") + " " + PlatformProfileGetFreePerk().toString(), 700, 480, "Black", "Silver");
	DrawTextWrap(TextGet("Intro" + PlatformPlayer.Name), 420, 500, 600, 500, "Black", null, 8);
	if (PlatformPlayer.Name == "Melody") {
		PlatformProfileDrawArrow(1150, 50, 1250, 150);
		PlatformProfileDrawArrow(1150, 50, 1250, 250);
		PlatformProfileDrawArrow(1150, 350, 1250, 450);
		PlatformProfileDrawArrow(1150, 550, 1250, 650);
		PlatformProfileDrawArrow(1150, 750, 1450, 950);
		PlatformProfileDrawArrow(1350, 850, 1450, 950);
		PlatformProfileDrawPerkButton(1100, 20, 0);
		PlatformProfileDrawPerkButton(1300, 120, 1, "Healthy");
		PlatformProfileDrawPerkButton(1300, 220, 2, "Healthy");
		PlatformProfileDrawPerkButton(1100, 320, 3);
		PlatformProfileDrawPerkButton(1300, 420, 4, "Spring");
		PlatformProfileDrawPerkButton(1100, 520, 5);
		PlatformProfileDrawPerkButton(1300, 620, 6, "Block");
		PlatformProfileDrawPerkButton(1100, 720, 7);
		PlatformProfileDrawPerkButton(1300, 820, 8);
		PlatformProfileDrawPerkButton(1500, 920, 9, "Seduction", "Persuasion");
	}
	DrawButton(1900, 10, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Adds the perk as an active perk for the current character
 * @param {number} PerkNum - The perk number for the current character
 * @returns {void} - Nothing
 */
function PlatformProfileBuyPerk(PerkNum) {
	if (PlatformProfileGetFreePerk() <= 0) return;
	if (PlatformHasPerk(PlatformPlayer, PlatformPlayer.PerkName[PerkNum])) return;
	PlatformPlayer.Perk = PlatformPlayer.Perk.substring(0, PerkNum) + "1" + PlatformPlayer.Perk.substring(PerkNum + 1);
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformProfileClick() {
	if (MouseIn(1900, 10, 90, 90)) return PlatformProfileExit();
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1100, 20, 400, 60)) PlatformProfileBuyPerk(0);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1300, 120, 400, 60) && PlatformHasPerk(PlatformPlayer, "Healthy")) PlatformProfileBuyPerk(1);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1300, 220, 400, 60) && PlatformHasPerk(PlatformPlayer, "Healthy")) PlatformProfileBuyPerk(2);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1100, 320, 400, 60)) PlatformProfileBuyPerk(3);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1300, 420, 400, 60) && PlatformHasPerk(PlatformPlayer, "Spring")) PlatformProfileBuyPerk(4);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1100, 520, 400, 60)) PlatformProfileBuyPerk(5);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1300, 620, 400, 60) && PlatformHasPerk(PlatformPlayer, "Block")) PlatformProfileBuyPerk(6);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1100, 720, 400, 60)) PlatformProfileBuyPerk(7);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1300, 820, 400, 60)) PlatformProfileBuyPerk(8);
	if ((PlatformPlayer.Name == "Melody") && MouseIn(1500, 920, 400, 60) && PlatformHasPerk(PlatformPlayer, "Seduction") && PlatformHasPerk(PlatformPlayer, "Persuasion")) PlatformProfileBuyPerk(9);
}

/**
 * When the screens exits, we unload the listeners
 * @returns {void} - Nothing
 */
function PlatformProfileExit() {
	CommonSetScreen("Room", "Platform");
}
