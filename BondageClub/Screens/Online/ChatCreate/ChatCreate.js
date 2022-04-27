"use strict";
var ChatCreateBackground = "Sheet";
var ChatCreateResult = [];
var ChatCreateMessage = "";
var ChatCreatePrivate = null;
var ChatCreateLocked = null;
var ChatCreateGame = "";
var ChatCreateGameList = ["", "LARP", "MagicBattle", "GGTS"];
var ChatCreateBackgroundIndex = 0;
var ChatCreateBackgroundSelect = "";
var ChatCreateBackgroundList = null;
var ChatCreateShowBackgroundMode = false;
var ChatCreateIsHidden = false;
var ChatCreateLanguage = "EN";
var ChatCreateLanguageList = ["EN", "DE", "FR", "ES", "CN", "RU"];

/**
 * Loads the chat creation screen properties and creates the inputs
 * @returns {void} - Nothing
 */
function ChatCreateLoad() {

	// Resets the LARP game status
	if ((ChatRoomGame == "LARP") && (GameLARPGetStatus() != "")) {
		GameLARPSetStatus("");
	}

	// Resets the Magic Battle game status
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleGetStatus() != "")) {
		GameMagicBattleSetStatus("");
	}

	// If the current background isn't valid, we pick the first one
	ChatCreateBackgroundIndex = ChatCreateBackgroundList.indexOf(ChatCreateBackgroundSelect);
	if (ChatCreateBackgroundIndex < 0) {
		ChatCreateBackgroundIndex = 0;
	}
	ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];

	// Prepares the controls to create a room
	ElementRemove("InputSearch");
	if (document.getElementById("InputName") == null) {
		// Prepares the controls to edit a room
		ElementCreateInput("InputName", "text", "", "20");
		document.getElementById("InputName").setAttribute("autocomplete", "off");
		document.getElementById("InputName").setAttribute("placeholder", TextGet("NameExplanation"));
		ElementCreateInput("InputSize", "text", "10", "2");
		document.getElementById("InputSize").setAttribute("autocomplete", "off");
		ElementCreateTextArea("InputDescription");
		document.getElementById("InputDescription").setAttribute("maxLength", 100);
		document.getElementById("InputDescription").setAttribute("autocomplete", "off");
		document.getElementById("InputDescription").setAttribute("placeholder", TextGet("DescriptionExplanation"));
		ElementValue("InputDescription", "");
		ElementCreateTextArea("InputAdminList");
		document.getElementById("InputAdminList").setAttribute("maxLength", 250);
		document.getElementById("InputAdminList").setAttribute("autocomplete", "off");
		document.getElementById("InputAdminList").setAttribute("placeholder", TextGet("UseMemberNumbersAdmin"));
		ElementValue("InputAdminList", Player.MemberNumber.toString());
		ElementCreateTextArea("InputBanList");
		document.getElementById("InputBanList").setAttribute("maxLength", 1000);
		document.getElementById("InputBanList").setAttribute("autocomplete", "off");
		document.getElementById("InputBanList").setAttribute("placeholder", TextGet("UseMemberNumbersBan"));
		ElementValue("InputBanList", CommonConvertArrayToString(Player.OnlineSettings ? ChatRoomConcatenateBanList(Player.OnlineSettings.AutoBanBlackList, Player.OnlineSettings.AutoBanGhostList) : []));
	}
	ChatCreateMessage = "";
	ChatCreatePrivate = ChatCreatePrivate || false;

	TextPrefetch("Online", "ChatBlockItem");
}

/**
 * When the chat creation screen runs, draws the screen
 * @returns {void} - Nothing
 */
function ChatCreateRun() {

	if (ChatCreateShowBackgroundMode) {
		ChatCreateBackground = ChatCreateBackgroundSelect;
		DrawButton(40, 40, 260, 60, TextGet("ReturnMenu"), "White");
		return;
	}

	if (ChatCreateIsHidden)
		ElementToggleGeneratedElements("ChatCreate", true);

	// Draw the controls
	if (!document.getElementById("InputName").getAttribute("placeholder")) {
		document.getElementById("InputName").setAttribute("placeholder", TextGet("NameExplanation"));
		document.getElementById("InputDescription").setAttribute("placeholder", TextGet("DescriptionExplanation"));
		document.getElementById("InputAdminList").setAttribute("placeholder", TextGet("UseMemberNumbersAdmin"));
		document.getElementById("InputBanList").setAttribute("placeholder", TextGet("UseMemberNumbersBan"));
	}
	if (ChatCreateMessage == "") ChatCreateMessage = "EnterRoomInfo";
	DrawText(TextGet(ChatCreateMessage), 650, 885, "Black", "Gray");
	DrawText(TextGet("RoomName"), 250, 120, "Black", "Gray");
	ElementPosition("InputName", 815, 115, 820);
	DrawText(TextGet("RoomLanguage"), 250, 205, "Black", "Gray");
	DrawButton(405, 172, 300, 60, TextGet("Language" + ChatCreateLanguage), "White");
	DrawText(TextGet("RoomSize"), 850, 205, "Black", "Gray");
	ElementPosition("InputSize", 1099, 200, 250);
	DrawText(TextGet("RoomDescription"), 675, 285, "Black", "Gray");
	ElementPosition("InputDescription", 675, 380, 1100, 140);
	DrawText(TextGet("RoomAdminList"), 390, 510, "Black", "Gray");
	ElementPosition("InputAdminList", 390, 645, 530, 210);
	DrawText(TextGet("RoomBanList"), 960, 510, "Black", "Gray");
	ElementPosition("InputBanList", 960, 645, 530, 210);
	DrawButton(125, 770, 250, 65, TextGet("AddOwnerAdminList"), "White");
	DrawButton(390, 770, 250, 65, TextGet("AddLoverAdminList"), "White");
	DrawButton(695, 770, 250, 65, TextGet("QuickbanBlackList"), "White");
	DrawButton(960, 770, 250, 65, TextGet("QuickbanGhostList"), "White");

	// Background selection, block button and game selection
	DrawImageResize("Backgrounds/" + ChatCreateBackgroundSelect + ".jpg", 1300, 75, 600, 350);
	DrawBackNextButton(1300, 450, 500, 60, DialogFindPlayer(ChatCreateBackgroundSelect), "White", null,
		() => DialogFindPlayer((ChatCreateBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatCreateBackgroundIndex - 1]),
		() => DialogFindPlayer((ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatCreateBackgroundIndex + 1]));
	DrawButton(1840, 450, 60, 60, "", "White", "Icons/Small/Preference.png", null);
	DrawButton(1300, 540, 275, 60, TextGet("BlockCategory"), "White");
	DrawBackNextButton(1625, 540, 275, 60, TextGet("Game" + ChatCreateGame), "White",  null, () => "", () => "");

	// Private and Locked check boxes
	DrawTextFit(TextGet("RoomPrivate"), 1650, 663, 550, "Black", "Gray");
	DrawButton(1300, 633, 64, 64, "",  "White", ChatCreatePrivate ? "Icons/Checked.png" : "");
	DrawTextFit(TextGet("RoomLocked"), 1650, 755, 550, "Black", "Gray");
	DrawButton(1300, 725, 64, 64, "", "White", ChatCreateLocked ? "Icons/Checked.png" : "");

	// Create & Exit buttons
	DrawButton(1325, 840, 250, 65, TextGet("Create"), "White");
	DrawButton(1625, 840, 250, 65, TextGet("Exit"), "White");
}

/**
 * Handles the click events on the chat creation screen. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatCreateClick() {

	// Background preview mode
	if (ChatCreateShowBackgroundMode || MouseIn(1300, 75, 600, 350)) {
		ChatCreateShowBackgroundMode = !ChatCreateShowBackgroundMode;
		ChatCreateBackground = "Sheet";
		ElementToggleGeneratedElements("ChatCreate", !ChatCreateShowBackgroundMode);
		return;
	}

	// When the user cancels/exits
	if (MouseIn(1625, 840, 250, 65)) ChatCreateExit();


	// When we select a new background
	if (MouseIn(1300, 450, 500, 60)) {
		ChatCreateBackgroundIndex += ((MouseX < 1550) ? -1 : 1);
		if (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length) ChatCreateBackgroundIndex = 0;
		if (ChatCreateBackgroundIndex < 0) ChatCreateBackgroundIndex = ChatCreateBackgroundList.length - 1;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
	}

	// When we select a new game type
	if (MouseIn(1625, 540, 275, 60)) {
		let Index = ChatCreateGameList.indexOf(ChatCreateGame);
		Index = Index + ((MouseX < 1763) ? -1 : 1);
		if (Index < 0) Index = ChatCreateGameList.length - 1;
		if (Index >= ChatCreateGameList.length) Index = 0;
		ChatCreateGame = ChatCreateGameList[Index];
	}

	// Item block button
	if (MouseIn(1300, 540, 275, 60)) {
		ElementToggleGeneratedElements("ChatCreate", false);
		ChatCreateBlockItems();
	}

	// Background selection button (Save values before entering)
	if (MouseIn(1840, 450, 60, 60)) {
		ElementToggleGeneratedElements("ChatCreate", false);
		BackgroundSelectionMake(ChatCreateBackgroundList, ChatCreateBackgroundIndex, Name => {
			ChatCreateBackgroundSelect = Name;
		});
	}

	// Flips from one language to another
	if (MouseIn(405, 172, 300, 60)) {		
		let Pos = ChatCreateLanguageList.indexOf(ChatCreateLanguage) + 1;
		if (Pos >= ChatCreateLanguageList.length) Pos = 0;
		ChatCreateLanguage = ChatCreateLanguageList[Pos];
	}

	// Private & Locked check boxes + save button + quickban buttons
	if (MouseIn(1300, 633, 64, 64)) ChatCreatePrivate = !ChatCreatePrivate;
	if (MouseIn(1300, 725, 64, 64)) ChatCreateLocked = !ChatCreateLocked;
	if (MouseIn(1325, 840, 250, 65)) ChatCreateRoom();
	if (MouseIn(125, 770, 250, 65)) ElementValue("InputAdminList", CommonConvertArrayToString(ChatRoomConcatenateAdminList(true, false, CommonConvertStringToArray(ElementValue("InputAdminList").trim()))));
	if (MouseIn(390, 770, 250, 65)) ElementValue("InputAdminList", CommonConvertArrayToString(ChatRoomConcatenateAdminList(false, true, CommonConvertStringToArray(ElementValue("InputAdminList").trim()))));
	if (MouseIn(695, 770, 250, 65)) ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomConcatenateBanList(true, false, CommonConvertStringToArray(ElementValue("InputBanList").trim()))));
	if (MouseIn(960, 770, 250, 65)) ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomConcatenateBanList(false, true, CommonConvertStringToArray(ElementValue("InputBanList").trim()))));

}

/**
 * Handles the key presses while in the creation screen. When the user presses enter, we create the room.
 * @returns {void} - Nothing
 */
function ChatCreateKeyDown() {
	if (KeyPress == 13) ChatCreateRoom();
}

/**
 * Handles exiting from the chat creation screen, removes the inputs and resets the state of the variable
 * @returns {void} - Nothing
 */
function ChatCreateExit() {
	ChatCreatePrivate = null;
	ChatCreateLocked = null;
	ChatRoomCreateRemoveInput();
	CommonSetScreen("Online", "ChatSearch");
}

/**
 * Handles the reception of the server response after attempting to create a chatroom: shows the error message, if applicable
 * @param {string} data - Response from the server
 * @returns {void} - Nothing
 */
function ChatCreateResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatCreateMessage = "Response" + data;
}

/**
 * Sends the chat room data packet to the server and prepares the player to join a room. The response will be handled by ChatCreateResponse once it is received
 * @returns {void} - Nothing
 */
function ChatCreateRoom() {
	ServerAccountUpdate.QueueData({ RoomLanguage: ChatCreateLanguage });
	ChatRoomPlayerCanJoin = true;
	var NewRoom = {
		Name: ElementValue("InputName").trim(),
		Language: ChatCreateLanguage,
		Description: ElementValue("InputDescription").trim(),
		Background: ChatCreateBackgroundSelect,
		Private: ChatCreatePrivate,
		Locked: ChatCreateLocked,
		Space: ChatRoomSpace,
		Game: ChatCreateGame,
		Admin: CommonConvertStringToArray(ElementValue("InputAdminList").trim()),
		Ban: CommonConvertStringToArray(ElementValue("InputBanList").trim()),
		Limit: ElementValue("InputSize").trim(),
		BlockCategory: ChatBlockItemCategory
	};
	ServerSend("ChatRoomCreate", NewRoom);
	ChatCreateMessage = "CreatingRoom";
	ChatRoomPingLeashedPlayers();
}

/**
 * When we need to enter the item blocking screen
 * @returns {void} - Nothing
 */
function ChatCreateBlockItems() {
	ChatBlockItemReturnData = { Screen: "ChatCreate" };
	CommonSetScreen("Online", "ChatBlockItem");
}

/**
 * Removes all chatroom creation inputs
 */
function ChatRoomCreateRemoveInput() {
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	ElementRemove("InputSize");
}