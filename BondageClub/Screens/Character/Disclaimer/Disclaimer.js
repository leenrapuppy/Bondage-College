"use strict";
var DisclaimerBackground = "Sheet";

/**
 * Loads the disclaimer screen
 * @returns {void} - Nothing
 */
function DisclaimerLoad() {
}

/**
 * Runs & draws the disclaimer screen
 * @returns {void} - Nothing
 */
function DisclaimerRun() {
	var Lmax = 10;
	var L = 0;
	if(TextGet("Line" + L.toString()) == "Отказ от ответственности") 
	{
		(Lmax = 12); 
	}
	for (let L = 0; L <= Lmax; L++)
		DrawText(TextGet("Line" + L.toString()), 1000, 130 + L * 55, "Black", "Silver");
	DrawButton(700, 840, 250, 60, TextGet("Return"), "White", "");
	DrawButton(1050, 840, 250, 60, TextGet("Accept"), "White", "");
}

/**
 * Handles click events in the disclaimer screen
 * @returns {void} - Nothing
 */
function DisclaimerClick() {
	if (MouseIn(700, 840, 250, 60)) DisclaimerExit();
	if (MouseIn(1050, 840, 250, 60)) {
		CharacterAppearanceSetDefault(Player);
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "ItemLegs");
		InventoryRemove(Player, "ItemArms");
		CharacterAppearanceLoadCharacter(Player);
	}
}

/**
 * Does the cleanup, if the user exits the screen
 * @returns {void} - Nothing
 */
function DisclaimerExit() {
	CommonSetScreen("Character", "Login");
}