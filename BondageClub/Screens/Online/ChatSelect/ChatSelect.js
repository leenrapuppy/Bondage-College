"use strict";
var ChatSelectBackground = "BrickWall";
var ChatSelectAllowedInFemaleOnly;
var ChatSelectAllowedInMaleOnly;

/**
 * Runs the chatroom search select screen
 * @returns {void} - Nothing
 */
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

/**
 * Handles clicks on the chat select screen
 * @returns {void} - Nothing
 */
function ChatSelectClick() {
	if (MouseIn(1895, 215, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1895, 15, 90, 90)) ChatSelectExit();
	if (MouseIn(1895, 115, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);

	if (MouseIn(100, 45, 510, 125) && ChatSelectAllowedInFemaleOnly) {
		ChatSelectStartSearch(ChatRoomSpaceType.FEMALE_ONLY);
	}
	if (MouseIn(100, 420, 510, 125)) {
		ChatSelectStartSearch(ChatRoomSpaceType.MIXED);
	}
	if (MouseIn(100, 800, 510, 125) && ChatSelectAllowedInMaleOnly) {
		ChatSelectStartSearch(ChatRoomSpaceType.MALE_ONLY);
	}
}

/**
 * Loads the chat select screen, automatically joining a chat search space if configured
 * @returns {void} - Nothing
 */
function ChatSelectLoad() {
	const autoJoinSpace = Player.GenderSettings.AutoJoinSearch.Female
		? Player.GenderSettings.AutoJoinSearch.Male ? ChatRoomSpaceType.MIXED : ChatRoomSpaceType.FEMALE_ONLY
		: Player.GenderSettings.AutoJoinSearch.Male ? ChatRoomSpaceType.MALE_ONLY : null;

	const playerGenders = Player.GetGenders();

	if (autoJoinSpace != null && ChatSelectGendersAllowed(autoJoinSpace, playerGenders)) {
		ChatSelectStartSearch(autoJoinSpace);
		return;
	}

	ChatSelectAllowedInFemaleOnly = ChatSelectGendersAllowed(ChatRoomSpaceType.FEMALE_ONLY, playerGenders);
	ChatSelectAllowedInMaleOnly = ChatSelectGendersAllowed(ChatRoomSpaceType.MALE_ONLY, playerGenders);
}

/**
 * Start the chat search screen for the relevant chat room space
 * @param {ChatRoomSpaceType} space - The space to join
 */
function ChatSelectStartSearch(space) {
	ChatRoomStart(space, "", null, null, "Introduction", BackgroundsTagList);
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
	return !(space == ChatRoomSpaceType.MALE_ONLY && genders.includes("F"))
		&& !(space == ChatRoomSpaceType.FEMALE_ONLY && genders.includes("M"));
}
