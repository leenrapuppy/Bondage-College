"use strict";
var ChatSelectBackground = "BrickWall";
var ChatSelectPlayerGenders = [];

function ChatSelectRun() {
	const allowedInFemale = ChatSelectGendersAllowed("FemaleOnly", ChatSelectPlayerGenders);
	const allowedInMale = ChatSelectGendersAllowed("MaleOnly", ChatSelectPlayerGenders);

	DrawButton(1895, 215, 90, 90, "", "White", "Icons/Character.png");
	DrawButton(1895, 15, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"))
	if (Player.CanChangeOwnClothes()) DrawButton(1895, 115, 90, 90, "", "White", "Icons/Dress.png")
	if (allowedInFemale) DrawRect(100, 45, 510, 125, "White");
	DrawRect(100, 420, 510, 125, "White");
	if (allowedInMale) DrawRect(100, 800, 510, 125, "White");
	DrawImage("Screens/Room/ChatSelect/Female.png", 650, 45);
	DrawText(TextGet("FemaleOnlyChatDescription1"), 1292, 100, "White", "Gray");
	DrawText(TextGet("Barrier"), 1300, 350, "White", "Gray");
	DrawText(TextGet("MixedChatDescription1"), 1300, 480, "White", "Gray");
	DrawImage("Screens/Room/ChatSelect/Female.png", 650, 520);
	DrawImage("Screens/Room/ChatSelect/Male.png", 650, 380);
	DrawText(TextGet("Barrier"), 1300, 600, "White", "Gray");
	DrawText(TextGet("MaleOnlyChat"), 350, 860, "Black", "Gray");
	DrawText(TextGet("MaleOnlyChatDescription1"), 1300, 860, "White", "Gray");
	DrawImage("Screens/Room/ChatSelect/Male.png", 650, 810);
	if (!allowedInFemale) DrawRect(100, 45, 510, 125, "Grey");
	if (!allowedInMale) DrawRect(100, 800, 510, 125, "Grey");
	DrawText(TextGet("FemaleOnlyChat"), 350, 100, "Black", "Gray");
	DrawText(TextGet("MixedChat"), 350, 480, "Black", "Gray");
	DrawText(TextGet("MaleOnlyChat"), 350, 860, "Black", "Gray");
}

function ChatSelectClick() {
	if (MouseIn(1895, 215, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1895, 15, 90, 90)) ChatSelectExit()
	if (MouseIn(1895, 115, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);
	if (MouseIn(100, 45, 510, 125) && ChatSelectGendersAllowed("FemaleOnly", ChatSelectPlayerGenders)) ChatSelectStartFemaleChat()
	if (MouseIn(100, 400, 510, 125)) ChatSelectStartMixedChat()
	if (MouseIn(100, 800, 510, 125) && ChatSelectGendersAllowed("MaleOnly", ChatSelectPlayerGenders)) ChatSelectStartMaleChat()
}

function ChatSelectLoad() {
	ChatSelectPlayerGenders = Player.GetGenders();
}

function ChatSelectStartFemaleChat () {
	ChatRoomStart("FemaleOnly", "", "ChatSelect", "BrickWall", BackgroundsTagList)
}

function ChatSelectStartMixedChat () {
	ChatRoomStart("", "", "ChatSelect", "BrickWall", BackgroundsTagList)
}

function ChatSelectStartMaleChat () {
	ChatRoomStart("MaleOnly", "", "ChatSelect", "BrickWall", BackgroundsTagList)
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
		&& !(space == "FemaleOnly" && genders.includes("M"))
}
