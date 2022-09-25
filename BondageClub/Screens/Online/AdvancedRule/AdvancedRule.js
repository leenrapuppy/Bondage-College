"use strict";
var AdvancedRuleBackground = "Sheet";
var AdvancedRuleTarget = null;
var AdvancedRuleType = "";

/**
 * Loads the advanced rule screen
 * @returns {void} - Nothing
 */
function AdvancedRuleLoad() {
}

/**
 * Starts the advanced rule screen and loads it
 * @returns {void} - Nothing
 */
function AdvancedRuleOpen(RuleType) {
	AdvancedRuleType = RuleType;
	AdvancedRuleTarget = CurrentCharacter;
	DialogLeave();
	CommonSetScreen("Online", "AdvancedRule");
}

/**
 * Draws the advanced rule text and check boxes
 * @returns {void} - Nothing
 */
function AdvancedRuleRun() {
	DrawText(TextGet(AdvancedRuleType + "Title"), 930, 105, "Black", "Silver");
	DrawButton(1830, 60, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function AdvancedRuleClick() {

	// When the user cancels/exits
	if (MouseIn(1830, 60, 250, 65)) AdvancedRuleExit();

}

/**
 * Handles exiting from the screen, updates the sub rules
 * @returns {void} - Nothing
 */
function AdvancedRuleExit() {
	CommonSetScreen("Online", "ChatRoom");
	ChatRoomFocusCharacter(AdvancedRuleTarget);
}
