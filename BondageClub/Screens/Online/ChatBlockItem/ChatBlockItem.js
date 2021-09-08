"use strict";
var ChatBlockItemBackground = "Sheet";
var ChatBlockItemList = ["ABDL", "SciFi", "Leashing", "Photos", "Arousal"];
var ChatBlockItemCategory = [];
var ChatBlockItemEditable = true;
var ChatBlockItemReturnData = {};

/**
 * Loads the chat room item blocking screen
 * @returns {void} - Nothing
 */
function ChatBlockItemLoad() {
}

/**
 * When the chat room item blocking screen runs, draws the screen
 * @returns {void} - Nothing
 */
function ChatBlockItemRun() {
	DrawText(TextGet("Title"), 1000, 150, "Black", "Gray");
	for (let L = 0; L < ChatBlockItemList.length; L++) {
		DrawButton(600, 200 + L * 100, 64, 64, "",
			ChatBlockItemEditable ? "White" : "#ebebe4",
			(ChatBlockItemCategory.indexOf(ChatBlockItemList[L]) >= 0) ? "Icons/Checked.png" : null, null, !ChatBlockItemEditable);
		DrawText(TextGet(ChatBlockItemList[L]), 1000, 232 + L * 100, "Black", "Gray");
	}
	DrawButton(850, 800, 300, 65, TextGet("Return"), "White");
}

/**
 * Handles the click events on the chat room item blocking screen. Called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatBlockItemClick() {
	if (ChatBlockItemEditable) {
		for (let L = 0; L < ChatBlockItemList.length; L++)
			if (MouseIn(600, 200 + L * 100, 64, 64))
				if (ChatBlockItemCategory.indexOf(ChatBlockItemList[L]) < 0)
					ChatBlockItemCategory.push(ChatBlockItemList[L]);
				else
					ChatBlockItemCategory.splice(ChatBlockItemCategory.indexOf(ChatBlockItemList[L]), 1);
	}
	if (MouseIn(850, 800, 300, 65)) ChatBlockItemExit();
}

/**
 * Handles exiting from the screen
 * @returns {void} - Nothing
 */
function ChatBlockItemExit() {
	CommonSetScreen("Online", ChatBlockItemReturnData.Screen);
	ChatBlockItemEditable = true;
	if (ChatBlockItemReturnData.Screen == "ChatCreate") {
		ElementValue("InputName", ChatBlockItemReturnData.Name);
		ElementValue("InputDescription", ChatBlockItemReturnData.Description);
		ElementValue("InputSize", ChatBlockItemReturnData.Limit);
	}
}