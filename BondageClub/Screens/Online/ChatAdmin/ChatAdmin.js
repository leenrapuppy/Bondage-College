"use strict";
var ChatAdminBackground = "Sheet";
var ChatAdminMessage = "";
var ChatAdminBackgroundIndex = 0;
var ChatAdminBackgroundSelect = "";
var ChatAdminPrivate = false;
var ChatAdminLocked = false;
var ChatAdminGame = "";
var ChatAdminGameList = ["", "LARP", "MagicBattle", "GGTS"];
/** @type {null | string} */
var ChatAdminBackgroundSelected = null;
/** @type {null | { Name: string, Language: string, Description: string, Limit: string, AdminList: string, BanList: string, Private: boolean, Locked: boolean }} */
var ChatAdminTemporaryData = null;
/** @type {string[]} */
var ChatAdminBlockCategory = [];
var ChatAdminInitialLoad = false;
var ChatAdminLanguage = "EN";

/**
 * Loads the chat Admin screen properties and creates the inputs
 * @returns {void} - Nothing
 */
function ChatAdminLoad() {

	// If the current room background isn't valid, we pick the first one
	ChatAdminBackgroundSelect = ChatAdminBackgroundSelected || ChatRoomData.Background;
	ChatAdminBackgroundIndex = ChatCreateBackgroundList.indexOf(ChatAdminBackgroundSelect);
	if (ChatAdminBackgroundIndex < 0) ChatAdminBackgroundIndex = 0;
	ChatAdminBackgroundSelect = ChatCreateBackgroundList[ChatAdminBackgroundIndex];
	if (!ChatAdminInitialLoad) ChatAdminBlockCategory = ChatRoomData.BlockCategory.slice();
	ChatAdminGame = ChatRoomGame;

	// Sets the chat room language
	ChatAdminLanguage = ChatAdminTemporaryData ? ChatAdminTemporaryData.Language : ChatRoomData.Language;
	if (ChatAdminLanguage == null) ChatAdminLanguage = ChatCreateLanguageList[0];
	if (ChatCreateLanguageList.indexOf(ChatAdminLanguage) < 0) ChatAdminLanguage = ChatCreateLanguageList[0];

	// Prepares the controls to edit a room
	ElementCreateInput("InputName", "text", ChatAdminTemporaryData ? ChatAdminTemporaryData.Name : ChatRoomData.Name, "20");
	document.getElementById("InputName").setAttribute("autocomplete", "off");
	ElementCreateInput("InputSize", "text", ChatAdminTemporaryData ? ChatAdminTemporaryData.Limit : ChatRoomData.Limit.toString(), "2");
	document.getElementById("InputSize").setAttribute("autocomplete", "off");
	ElementCreateTextArea("InputDescription");
	document.getElementById("InputDescription").setAttribute("maxLength", 100);
	document.getElementById("InputDescription").setAttribute("autocomplete", "off");
	ElementValue("InputDescription", ChatAdminTemporaryData ? ChatAdminTemporaryData.Description : ChatRoomData.Description);
	ElementCreateTextArea("InputAdminList");
	document.getElementById("InputAdminList").setAttribute("maxLength", 250);
	document.getElementById("InputAdminList").setAttribute("autocomplete", "off");
	ElementValue("InputAdminList", ChatAdminTemporaryData ? ChatAdminTemporaryData.AdminList : CommonConvertArrayToString(ChatRoomData.Admin));
	ElementCreateTextArea("InputBanList");
	document.getElementById("InputBanList").setAttribute("maxLength", 1000);
	document.getElementById("InputBanList").setAttribute("autocomplete", "off");
	ElementValue("InputBanList", ChatAdminTemporaryData ? ChatAdminTemporaryData.BanList : CommonConvertArrayToString(ChatRoomData.Ban));
	ChatAdminPrivate = ChatAdminTemporaryData ? ChatAdminTemporaryData.Private :ChatRoomData.Private;
	ChatAdminLocked = ChatAdminTemporaryData ? ChatAdminTemporaryData.Locked : ChatRoomData.Locked;

	// If the player isn't an admin, we disable the inputs
	if (!ChatRoomPlayerIsAdmin()) {
		document.getElementById("InputName").setAttribute("disabled", "disabled");
		document.getElementById("InputDescription").setAttribute("disabled", "disabled");

		// We also garble them if possible
		ElementValue("InputName", ChatSearchMuffle(ChatAdminTemporaryData ? ChatAdminTemporaryData.Name : ChatRoomData.Name));
		ElementValue("InputDescription", ChatSearchMuffle(ChatAdminTemporaryData ? ChatAdminTemporaryData.Description : ChatRoomData.Description));


		document.getElementById("InputAdminList").setAttribute("disabled", "disabled");
		document.getElementById("InputBanList").setAttribute("disabled", "disabled");
		document.getElementById("InputSize").setAttribute("disabled", "disabled");
		ChatAdminMessage = "AdminOnly";
	} else ChatAdminMessage = "UseMemberNumbers";
	ChatAdminInitialLoad = true;

	TextPrefetch("Online", "ChatBlockItem");
}

/**
 * When the chat Admin screen runs, draws the screen
 * @returns {void} - Nothing
 */
function ChatAdminRun() {

	// Draw the main controls
	DrawText(TextGet(ChatAdminMessage), 675, 885, "Black", "Gray");
	DrawText(TextGet("RoomName"), 250, 120, "Black", "Gray");
	ElementPosition("InputName", 815, 115, 820);
	DrawText(TextGet("RoomLanguage"), 250, 205, "Black", "Gray");
	DrawButton(405, 172, 300, 60, TextGet("Language" + ChatAdminLanguage), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawText(TextGet("RoomSize"), 850, 205, "Black", "Gray");
	ElementPosition("InputSize", 1099, 200, 250);
	DrawText(TextGet("RoomDescription"), 675, 285, "Black", "Gray");
	ElementPosition("InputDescription", 675, 380, 1100, 140);
	DrawText(TextGet("RoomAdminList"), 390, 510, "Black", "Gray");
	ElementPosition("InputAdminList", 390, 645, 530, 210);
	DrawText(TextGet("RoomBanList"), 960, 510, "Black", "Gray");
	ElementPosition("InputBanList", 960, 645, 530, 210);
	DrawButton(125, 770, 250, 65, TextGet("AddOwnerAdminList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(390, 770, 250, 65, TextGet("AddLoverAdminList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(695, 770, 250, 65, TextGet("QuickbanBlackList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(960, 770, 250, 65, TextGet("QuickbanGhostList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());

	// Background selection, block button and game selection
	DrawImageResize("Backgrounds/" + ChatAdminBackgroundSelect + ".jpg", 1300, 75, 600, 350);
	DrawBackNextButton(1300, 450, 500, 60, DialogFindPlayer(ChatAdminBackgroundSelect), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null,
		() => DialogFindPlayer((ChatAdminBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatAdminBackgroundIndex - 1]),
		() => DialogFindPlayer((ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatAdminBackgroundIndex + 1]), !ChatRoomPlayerIsAdmin());
	DrawButton(1840, 450, 60, 60, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", "Icons/Small/Preference.png", null, !ChatRoomPlayerIsAdmin());
	DrawButton(1300, 575, 275, 60, TextGet("BlockCategory"), "White");
	DrawBackNextButton(1625, 575, 275, 60, TextGet("Game" + ChatAdminGame), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, () => "", () => "");

	// Private and Locked check boxes
	DrawText(TextGet("RoomPrivate"), 1384, 740, "Black", "Gray");
	DrawButton(1486, 708, 64, 64, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", ChatAdminPrivate ? "Icons/Checked.png" : "", null, !ChatRoomPlayerIsAdmin());
	DrawText(TextGet("RoomLocked"), 1684, 740, "Black", "Gray");
	DrawButton(1786, 708, 64, 64, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", ChatAdminLocked ? "Icons/Checked.png" : "", null, !ChatRoomPlayerIsAdmin());

	// Save & Cancel/Exit buttons + help text
	DrawButton(1325, 840, 250, 65, TextGet("Save"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(1625, 840, 250, 65, TextGet(ChatRoomPlayerIsAdmin() ? "Cancel" : "Exit"), "White");
}

/**
 * Handles the click events on the admin screen. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatAdminClick() {

	// When the user cancels/exits
	if (MouseIn(1625, 840, 250, 65)) ChatAdminExit();

	// Background selection button (admin only) and item block button (anyone)
	// Saves values before entering.
	if ((ChatRoomPlayerIsAdmin() && (MouseIn(1300, 75, 600, 350) || MouseIn(1840, 450, 60, 60))) || MouseIn(1300, 575, 275, 60)) {
		ChatAdminTemporaryData = {
			Name: ElementValue("InputName"),
			Language: ChatAdminLanguage,
			Description: ElementValue("InputDescription"),
			Limit: ElementValue("InputSize"),
			AdminList: ElementValue("InputAdminList"),
			BanList: ElementValue("InputBanList"),
			Private: ChatAdminPrivate,
			Locked: ChatAdminLocked,
		};
		ElementRemove("InputName");
		ElementRemove("InputDescription");
		ElementRemove("InputSize");
		ElementRemove("InputAdminList");
		ElementRemove("InputBanList");
		if (MouseIn(1300, 575, 275, 60)) {
			ChatBlockItemEditable = ChatRoomPlayerIsAdmin();
			ChatBlockItemReturnData = { Screen: "ChatAdmin" };
			ChatBlockItemCategory = ChatAdminBlockCategory;
			CommonSetScreen("Online", "ChatBlockItem");
		} else BackgroundSelectionMake(ChatCreateBackgroundList, ChatAdminBackgroundIndex, Name => ChatAdminBackgroundSelected = Name);
	}

	// All other controls are for administrators only
	if (ChatRoomPlayerIsAdmin()) {

		// When we select a new background
		if (MouseIn(1300, 450, 500, 60)) {
			ChatAdminBackgroundIndex += ((MouseX < 1550) ? -1 : 1);
			if (ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length) ChatAdminBackgroundIndex = 0;
			if (ChatAdminBackgroundIndex < 0) ChatAdminBackgroundIndex = ChatCreateBackgroundList.length - 1;
			ChatAdminBackgroundSelect = ChatCreateBackgroundList[ChatAdminBackgroundIndex];
		}

		// When we select a new game type
		if (MouseIn(1625, 575, 275, 60)) {
			let Index = ChatAdminGameList.indexOf(ChatAdminGame);
			Index = Index + ((MouseX < 1763) ? -1 : 1);
			if (Index < 0) Index = ChatAdminGameList.length - 1;
			if (Index >= ChatAdminGameList.length) Index = 0;
			ChatAdminGame = ChatAdminGameList[Index];
		}

		// Flips from one language to another
		if (MouseIn(405, 172, 300, 60)) {
			let Pos = ChatCreateLanguageList.indexOf(ChatAdminLanguage) + 1;
			if (Pos >= ChatCreateLanguageList.length) Pos = 0;
			ChatAdminLanguage = ChatCreateLanguageList[Pos];
		}

		// Private & Locked check boxes + save button + quickban buttons
		if (MouseIn(1486, 708, 64, 64)) ChatAdminPrivate = !ChatAdminPrivate;
		if (MouseIn(1786, 708, 64, 64)) ChatAdminLocked = !ChatAdminLocked;
		if (MouseIn(1325, 840, 250, 65) && ChatRoomPlayerIsAdmin()) ChatAdminUpdateRoom();
		if (MouseIn(125, 770, 250, 65)) ElementValue("InputAdminList", CommonConvertArrayToString(ChatRoomConcatenateAdminList(true, false, CommonConvertStringToArray(ElementValue("InputAdminList").trim()))));
		if (MouseIn(390, 770, 250, 65)) ElementValue("InputAdminList", CommonConvertArrayToString(ChatRoomConcatenateAdminList(false, true, CommonConvertStringToArray(ElementValue("InputAdminList").trim()))));
		if (MouseIn(695, 770, 250, 65)) ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomConcatenateBanList(true, false, CommonConvertStringToArray(ElementValue("InputBanList").trim()))));
		if (MouseIn(960, 770, 250, 65)) ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomConcatenateBanList(false, true, CommonConvertStringToArray(ElementValue("InputBanList").trim()))));

	}
}

/**
 * Handles exiting from the admin screen, removes the inputs and resets the state of the variables
 * @returns {void} - Nothing
 */
function ChatAdminExit() {
	AsylumGGTSReset();
	ChatAdminBackgroundSelected = null;
	ChatAdminTemporaryData = null;
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	CommonSetScreen("Online", "ChatRoom");
	ChatAdminInitialLoad = false;
}

/**
 * Handles the reception of the server response after attempting to update a chatroom: Leaves the admin screen or shows an error message
 * @param {string} data - Response from the server ("Updated" or error message)
 * @returns {void} - Nothing
 */
function ChatAdminResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		if (data === "Updated") ChatAdminExit();
		else ChatAdminMessage = "Response" + data;
}

/**
 * Sends the chat room data packet to the server. The response will be handled by ChatAdminResponse once it is received
 * @returns {void} - Nothing
 */
function ChatAdminUpdateRoom() {
	var UpdatedRoom = {
		Name: ElementValue("InputName").trim(),
		Language: ChatAdminLanguage,
		Description: ElementValue("InputDescription").trim(),
		Background: ChatAdminBackgroundSelect,
		Limit: ElementValue("InputSize").trim(),
		Admin: CommonConvertStringToArray(ElementValue("InputAdminList").trim()),
		Ban: CommonConvertStringToArray(ElementValue("InputBanList").trim()),
		BlockCategory: ChatAdminBlockCategory,
		Game: ChatAdminGame,
		Private: ChatAdminPrivate,
		Locked: ChatAdminLocked
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";
}