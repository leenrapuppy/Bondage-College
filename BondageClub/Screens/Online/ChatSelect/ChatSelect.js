"use strict";
var ChatSelectBackground = "BrickWall";
var ChatSelectAllowedInFemaleOnly;
var ChatSelectAllowedInMaleOnly;

function ChatSelectRun() {
	//top-right menu buttons
	DrawButton(1895, 215, 90, 90, "", "White", "Icons/Character.png");
	DrawButton(1895, 15, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (Player.CanChangeOwnClothes()) DrawButton(1895, 115, 90, 90, "", "White", "Icons/Dress.png");

	//female-only space
	DrawButton(100, 45, 510, 125, TextGet("FemaleOnlyChat"), ChatSelectAllowedInFemaleOnly ? "White" : "Gray", "", "", !ChatSelectAllowedInFemaleOnly);
	DrawImage("Screens/Online/ChatSelect/Female.png", 650, 45);
	DrawText(TextGet("FemaleOnlyChatDescription1"), 1292, 100, "White", "Gray");
	DrawText(TextGet("Barrier"), 1300, 350, "White", "Gray");

	//mixed space
	DrawButton(100, 420, 510, 125, TextGet("MixedChat"), "White");
	DrawText(TextGet("MixedChatDescription1"), 1300, 480, "White", "Gray");
	DrawImage("Screens/Online/ChatSelect/Female.png", 650, 520);
	DrawImage("Screens/Online/ChatSelect/Male.png", 650, 380);
	DrawText(TextGet("Barrier"), 1300, 600, "White", "Gray");

	//male-only space
	DrawButton(100, 800, 510, 125, TextGet("MaleOnlyChat"), ChatSelectAllowedInMaleOnly ? "White" : "Gray", "", "", !ChatSelectAllowedInMaleOnly);
	DrawText(TextGet("MaleOnlyChatDescription1"), 1300, 860, "White", "Gray");
	DrawImage("Screens/Online/ChatSelect/Male.png", 650, 810);
}

function ChatSelectClick() {
	if (MouseIn(1895, 215, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1895, 15, 90, 90)) ChatSelectExit();
	if (MouseIn(1895, 115, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);
	if (MouseIn(100, 45, 510, 125) && ChatSelectAllowedInFemaleOnly) ChatSelectStartFemaleChat();
	if (MouseIn(100, 420, 510, 125)) ChatSelectStartMixedChat();
	if (MouseIn(100, 800, 510, 125) && ChatSelectAllowedInMaleOnly) ChatSelectStartMaleChat();
}

function ChatSelectLoad() {
	const playerGenders = Player.GetGenders();
	ChatSelectAllowedInFemaleOnly = ChatSelectGendersAllowed("FemaleOnly", playerGenders);
	ChatSelectAllowedInMaleOnly = ChatSelectGendersAllowed("MaleOnly", playerGenders);
}

function ChatSelectStartFemaleChat () {
	ChatRoomStart("FemaleOnly", "", "ChatSelect", "Online", "Introduction", BackgroundsTagList);
}

function ChatSelectStartMixedChat () {
	ChatRoomStart("", "", "ChatSelect", "Online", "Introduction", BackgroundsTagList);
}

function ChatSelectStartMaleChat () {
	ChatRoomStart("MaleOnly", "", "ChatSelect", "Online", "Introduction", BackgroundsTagList);
}

function ChatSelectExit() {
	CommonSetScreen("Room", "MainHall");
}

/**
 * Returns whether all provided genders are allowed in the specified space
 * @param {string} space - The chatroom space
 * @param {string[]} genders - A list of relevant genders to check#
 * @returns {boolean} - Whether the genders are allowed
 */
function ChatSelectGendersAllowed(space, genders) {
	return !(space == "MaleOnly" && genders.includes("F"))
		&& !(space == "FemaleOnly" && genders.includes("M"));
}
