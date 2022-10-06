"use strict";
var AdvancedRuleBackground = "Sheet";
var AdvancedRuleTarget = null;
var AdvancedRuleType = "";
var AdvancedRuleOption = [];
var AdvancedRuleSelection = "";

/**
 * Loads the advanced rule screen
 * @returns {void} - Nothing
 */
function AdvancedRuleLoad() {
	AdvancedRuleSelection = "";
	if ((AdvancedRuleTarget != null) && (AdvancedRuleTarget.Rule != null))
		for (let R of AdvancedRuleTarget.Rule)
			if (R.Name.substring(0, AdvancedRuleType.length) == AdvancedRuleType)
				AdvancedRuleSelection = R.Name.substring(AdvancedRuleType.length, 100);
}

/**
 * Starts the advanced rule screen and loads it
 * @returns {void} - Nothing
 */
function AdvancedRuleOpen(RuleType) {
	AdvancedRuleType = RuleType;
	AdvancedRuleTarget = CurrentCharacter;
	if (RuleType == "BlockScreen") AdvancedRuleOption = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "0", "1", "2", "3", "4", "5", "6", "7"];
	if (RuleType == "BlockAppearance") AdvancedRuleOption = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	if (RuleType == "BlockItemGroup") AdvancedRuleOption = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "0", "1", "2"];
	DialogLeave();
	CommonSetScreen("Online", "AdvancedRule");
}

/**
 * Draws the advanced rule text and check boxes
 * @returns {void} - Nothing
 */
function AdvancedRuleRun() {

	// List the options with a check box
	MainCanvas.textAlign = "left";
	for (let O = 0; O < AdvancedRuleOption.length; O++) {
		let X = 100 + Math.floor(O / 9) * 450;
		let Y = 170 + ((O % 9) * 85);
		DrawButton(X, Y, 64, 64, "", "White", (AdvancedRuleSelection.indexOf(AdvancedRuleOption[O]) >= 0) ? "Icons/Checked.png" : "");
		DrawText(TextGet(AdvancedRuleType + AdvancedRuleOption[O]), X + 100, Y + 32, "Black", "Gray");
	}

	// Draw the exit button
	MainCanvas.textAlign = "center";
	DrawText(TextGet(AdvancedRuleType + "Title"), 930, 105, "Black", "Silver");
	DrawButton(1830, 60, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));

}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function AdvancedRuleClick() {

	// When the user exits
	if (MouseIn(1830, 60, 250, 65)) AdvancedRuleExit();

	// When the user clicks on one of the options
	for (let O = 0; O < AdvancedRuleOption.length; O++) {
		let X = 100 + Math.floor(O / 9) * 450;
		let Y = 170 + ((O % 9) * 85);
		if (MouseIn(X, Y, 64, 64)) {
			if (AdvancedRuleSelection.indexOf(AdvancedRuleOption[O]) >= 0)
				AdvancedRuleSelection = AdvancedRuleSelection.replace(AdvancedRuleOption[O], "");
			else
				AdvancedRuleSelection = AdvancedRuleSelection + AdvancedRuleOption[O];
		}
	}

}

/**
 * Handles exiting from the screen, updates the sub rules
 * @returns {void} - Nothing
 */
function AdvancedRuleExit() {
	CommonSetScreen("Online", "ChatRoom");
	ServerSend("ChatRoomChat", { Content: "OwnerRule" + AdvancedRuleType + AdvancedRuleSelection, Type: "Hidden", Target: AdvancedRuleTarget.MemberNumber });
	ChatRoomFocusCharacter(AdvancedRuleTarget);
}
