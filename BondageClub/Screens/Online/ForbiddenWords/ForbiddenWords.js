"use strict";
var ForbiddenWordsBackground = "Sheet";
var ForbiddenWordsTarget = null;
var ForbiddenWordsList = [];
var ForbiddenWordsOffset = 0;
var ForbiddenWordsConsequence = "Block";
var ForbiddenWordsConsequenceList = ["Block", "Mute5", "Mute15", "Mute30"];

/**
 * Loads the forbidden words screen, fetches the word list from the current character rules
 * @returns {void} - Nothing
 */
function ForbiddenWordsLoad() {
	ElementCreateInput("InputWord", "text", "", "50");
	ForbiddenWordsOffset = 0;
	ForbiddenWordsList = [];
	if ((ForbiddenWordsTarget != null) && (ForbiddenWordsTarget.Rule != null))
		for (let R of ForbiddenWordsTarget.Rule)
			if (R.Name.startsWith("ForbiddenWords"))
				ForbiddenWordsList = R.Name.substring("ForbiddenWords".length, 10000).split("|");
	if (ForbiddenWordsList.length > 0) {
		ForbiddenWordsConsequence = ForbiddenWordsList[0];
		if (ForbiddenWordsConsequenceList.indexOf(ForbiddenWordsConsequence) < 0) ForbiddenWordsConsequence = ForbiddenWordsConsequenceList[0];
		ForbiddenWordsList.splice(0, 1);
	}
}

/**
 * Starts the forbidden words screen and loads it
 * @returns {void} - Nothing
 */
function ForbiddenWordsOpen(RuleType) {
	ForbiddenWordsTarget = CurrentCharacter;
	DialogLeave();
	CommonSetScreen("Online", "ForbiddenWords");
}

/**
 * Draws the forbidden words text and check boxes
 * @returns {void} - Nothing
 */
function ForbiddenWordsRun() {

	// Draw the header
	DrawText(TextGet("Title"), 930, 105, "Black", "Silver");
	DrawButton(1830, 60, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawText(TextGet("Consequence"), 200, 205, "Black", "Silver");
	DrawButton(350, 175, 550, 60, TextGet("Consequence" + ForbiddenWordsConsequence), "White");
	DrawText(TextGet("Word"), 1090, 205, "Black", "Silver");
	ElementPosition("InputWord", 1385, 200, 300);
	DrawButton(1550, 175, 180, 60, TextGet("Add"), "White");
	if (ForbiddenWordsList.length > 32) DrawButton(1830, 175, 90, 90, "", "White", "Icons/Next.png");

	// List all words with a delete button
	MainCanvas.textAlign = "left";
	for (let O = ForbiddenWordsOffset; O < ForbiddenWordsList.length && O < ForbiddenWordsOffset + 32; O++) {
		let X = 100 + Math.floor((O - ForbiddenWordsOffset)/ 8) * 450;
		let Y = 270 + ((O % 8) * 84);
		DrawButton(X, Y, 60, 60, "", "White", "Icons/Small/Remove.png");
		DrawText(ForbiddenWordsList[O], X + 100, Y + 30, "Black", "Gray");
	}
	MainCanvas.textAlign = "center";

}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function ForbiddenWordsClick() {

	// When the user clicks on the header buttons
	if (MouseIn(1830, 60, 250, 65)) ForbiddenWordsExit();
	if (MouseIn(1550, 175, 180, 60)) {
		let Word = ElementValue("InputWord").trim().toUpperCase().replace("|", "");
		if ((Word != "") && (ForbiddenWordsList.indexOf(Word) < 0)) {
			ForbiddenWordsList.push(Word);
			ForbiddenWordsList.sort();
			ElementValue("InputWord", "");
		}
		return;
	}
	if (MouseIn(350, 175, 550, 60)) {
		if (ForbiddenWordsConsequenceList.indexOf(ForbiddenWordsConsequence) < 0) ForbiddenWordsConsequence = ForbiddenWordsConsequenceList[0];
		let Index = ForbiddenWordsConsequenceList.indexOf(ForbiddenWordsConsequence);
		Index++;
		ForbiddenWordsConsequence = (Index >= ForbiddenWordsConsequenceList.length) ? ForbiddenWordsConsequenceList[0] : ForbiddenWordsConsequenceList[Index];
		return;
	}
	if (MouseIn(1830, 175, 250, 65)) {
		ForbiddenWordsOffset = ForbiddenWordsOffset + 32;
		if (ForbiddenWordsOffset >= ForbiddenWordsList.length) ForbiddenWordsOffset = 0;
		return;
	}

	// When the user clicks to delete one of the words
	for (let O = ForbiddenWordsOffset; O < ForbiddenWordsList.length && O < ForbiddenWordsOffset + 32; O++) {
		let X = 100 + Math.floor((O - ForbiddenWordsOffset)/ 8) * 450;
		let Y = 270 + ((O % 8) * 84);
		if (MouseIn(X, Y, 60, 60)) {
			ForbiddenWordsList.splice(O, 1);
			if (ForbiddenWordsOffset >= ForbiddenWordsList.length) ForbiddenWordsOffset = 0;
			return;
		}
	}

}

/**
 * Handles exiting from the screen, updates the sub rules
 * @returns {void} - Nothing
 */
function ForbiddenWordsExit() {
	ElementRemove("InputWord")
	CommonSetScreen("Online", "ChatRoom");
	let FW = ForbiddenWordsConsequence + "|" + ForbiddenWordsList.join("|");
	ServerSend("ChatRoomChat", { Content: "OwnerRuleForbiddenWords" + FW, Type: "Hidden", Target: ForbiddenWordsTarget.MemberNumber });
	ChatRoomFocusCharacter(ForbiddenWordsTarget);
}
