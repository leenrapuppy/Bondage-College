"use strict";
var ChatSearchBackground = "Introduction";
var ChatSearchResult = [];
var ChatSearchHiddenResult = [];
var ChatSearchLastSearchDataJSON = "";
var ChatSearchLastQuerySearchTime = 0;
var ChatSearchLastQueryJoin = "";
var ChatSearchLastQueryJoinTime = 0;
var ChatSearchResultOffset = 0;
var ChatSearchRoomsPerPage = 24;
var ChatSearchMessage = "";
var ChatSearchLeaveRoom = "MainHall";
var ChatSearchSafewordAppearance = null;
var ChatSearchSafewordPose = null;
var ChatSearchPreviousActivePose = null;
var ChatSearchTempHiddenRooms = [];
var ChatSearchMode = "";
var ChatSearchGhostPlayerOnClickActive = false;
var ChatSearchShowHiddenRoomsActive = false;
var ChatSearchFilterHelpActive = false;
var ChatSearchFilterUnhideConfirm = null;
var ChatSearchRejoinIncrement = 1;
var ChatSearchReturnToScreen = null;
var ChatSearchLanguage = "";
var ChatSearchLanguageTemp = "";
var ChatSearchFilterTermsTemp = "";
var ChatRoomJoinLeash = "";

/**
 * Loads the chat search screen properties, creates the inputs and loads up the first 24 rooms.
 * @returns {void} - Nothing
 */
function ChatSearchLoad() {
	if (ChatSearchReturnToScreen != null) {
		CommonSetScreen("Room", ChatSearchReturnToScreen);
		ChatSearchReturnToScreen = null;
		return;
	}
	CurrentDarkFactor = 0.5;
	if (ChatSearchLeaveRoom == "MainHall") {
		ChatRoomGame = "";
		OnlineGameReset();
	}
	if (ChatSearchSafewordAppearance == null) {
		ChatSearchSafewordAppearance = Player.Appearance.slice(0);
		ChatSearchSafewordPose = Player.ActivePose;
	}
	AsylumGGTSIntroDone = false;
	AsylumGGTSTask = null;
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
	Player.ArousalSettings.OrgasmCount = 0;
	ElementCreateInput("InputSearch", "text", "", "20");
	ChatSearchQuery();
	ChatSearchMessage = "";
	ChatRoomNotificationReset();
	ChatSearchRejoinIncrement = 1;
	TextPrefetch("Character", "FriendList");
	TextPrefetch("Online", "ChatCreate");
	TextPrefetch("Online", "ChatRoom");
}

/**
 * When the chat Search screen runs, draws the screen
 * @returns {void} - Nothing
 */
function ChatSearchRun() {
	KidnapLeagueResetOnlineBountyProgress();

	// Draw special screens that hide everything else
	if (ChatSearchFilterHelpActive) return ChatSearchFilterHelpDraw();
	if (ChatSearchFilterUnhideConfirm) return ChatSearchFilterUnhideConfirmDraw();

	// Draw list of rooms depending on the current view
	if (ChatSearchMode == "") {
		ChatSearchNormalDraw();
		if ((ChatSearchMessage == "" || ChatSearchMessage == "FilterExcludeTerms")) ChatSearchMessage = "EnterName";
	}
	else if (ChatSearchMode == "Filter") {
		ChatSearchPermissionDraw();
		ChatSearchMessage = "FilterExcludeTerms";
	}

	// Draw the next button if it is needed
	if ((ChatSearchShowHiddenRoomsActive ? ChatSearchHiddenResult : ChatSearchResult).length > ChatSearchRoomsPerPage) DrawButton(1485, 885, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));

	// Hidden rooms view only shows a back button
	if (ChatSearchShowHiddenRoomsActive) {
		DrawButton(1885, 885, 90, 90, "", "White", "Icons/DialogNormalMode.png", TextGet("NormalFilterMode"));
		return;
	}

	// Draw the bottom bar for the normal mode and the filter mode when not in the hidden rooms view
	DrawTextFit(TextGet(ChatSearchMessage), 255, 935, 490, "White", "Gray");
	ElementPosition("InputSearch",  700, 926, 390);
	DrawButton(1585, 885, 90, 90, "", "White", ChatSearchMode != "Filter" ? "Icons/Private.png" : "Icons/DialogNormalMode.png", TextGet(ChatSearchMode != "Filter" ?  "FilterMode" : "NormalMode"));
	if (ChatSearchMode == "") {
		DrawButton(900, 885, 90, 90, "", "White", "Icons/Accept.png", TextGet("SearchRoom"));
		DrawButton(1685, 885, 90, 90, "", "White", "Icons/Plus.png", TextGet("CreateRoom"));
		DrawButton(1785, 885, 90, 90, "", "White", "Icons/FriendList.png", TextGet("FriendList"));
		DrawButton(1885, 885, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	} else {
		DrawButton(895, 898, 280, 64, TextGet("Language" + ChatSearchLanguageTemp), "White");
		if (ChatSearchChangedLanguageOrFilterTerms()) {
			DrawButton(1185, 885, 90, 90, "", "White", "Icons/Accept.png");
			DrawButton(1285, 885, 90, 90, "", "White", "Icons/Cancel.png");
		}
		DrawButton(1385, 885, 90, 90, "", "White", "Icons/Question.png", TextGet("Help"));
		DrawButton(1685, 885, 90, 90, "", !ChatSearchGhostPlayerOnClickActive ? "Lime" : "White", "Icons/Trash.png", TextGet("TempHideOnClick"));
		DrawButton(1785, 885, 90, 90, "", ChatSearchGhostPlayerOnClickActive ? "Lime" : "White", "Icons/GhostList.png", TextGet("GhostPlayerOnClick"));
		DrawButton(1885, 885, 90, 90, "", "White", "Icons/InspectLock.png", TextGet("ShowHiddenRooms"));
	}
}

/**
 * Handles the click events on the chat search screen. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatSearchClick() {
	// Handle special screens
	if (ChatSearchFilterHelpActive) {
		if (MouseIn(1385, 885, 90, 90)) ChatSearchToggleHelpMode();
		return;
	}
	if (ChatSearchFilterUnhideConfirm) {
		if (MouseIn(620, 898, 280, 64)) {
			ChatSearchFilterUnhideConfirm = null;
		}
		if (MouseIn(1100, 898, 280, 64)) {
			ChatSearchClickUnhideRoom(ChatSearchFilterUnhideConfirm.Index, true);
			ChatSearchFilterUnhideConfirm = null;
		}
		return;
	}

	// Handle clicks on the room list
	if ((MouseX >= 25) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 875)) {
		if (ChatSearchMode == "Filter") ChatSearchClickPermission();
		if (ChatSearchMode == "") ChatSearchJoin();
	}

	// Handle the next button
	if (MouseIn(1485, 885, 90, 90)) {
		ChatSearchResultOffset += ChatSearchRoomsPerPage;
		if (ChatSearchResultOffset >= (ChatSearchShowHiddenRoomsActive ? ChatSearchHiddenResult : ChatSearchResult).length) ChatSearchResultOffset = 0;
	}

	// Handle back button for hidden rooms view
	if (ChatSearchShowHiddenRoomsActive) {
		if (MouseIn(1885, 885, 90, 90)) ChatSearchToggleHiddenMode();
		return;
	}

	// Handle the bottom bar for the normal mode and the filter mode when not in the hidden rooms view
	if (MouseIn(1585, 885, 90, 90)) {
		ChatSearchToggleSearchMode();
		ChatSearchQuery();
	}
	if (ChatSearchMode == "") {
		if (MouseIn(900, 885, 90, 90)) ChatSearchQuery();
		if (MouseIn(1685, 885, 90, 90)) {
			ChatBlockItemCategory = [];
			CommonSetScreen("Online", "ChatCreate");
		}
		if (MouseIn(1785, 885, 90, 90)) {
			ElementRemove("InputSearch");
			FriendListReturn = { Screen: CurrentScreen , Module: CurrentModule };
			CommonSetScreen("Character", "FriendList");
		}
		if (MouseIn(1885, 885, 90, 90)) ChatSearchExit();
	} else {
		if (MouseIn(895, 898, 280, 64)) {
			let Pos = ChatCreateLanguageList.indexOf(ChatSearchLanguageTemp) + 1;
			if (Pos >= ChatCreateLanguageList.length)
				ChatSearchLanguageTemp = "";
			else
				ChatSearchLanguageTemp = ChatCreateLanguageList[Pos];
		}
		if (ChatSearchChangedLanguageOrFilterTerms()) {
			if (MouseIn(1185, 885, 90, 90)) ChatSearchSaveLanguageAndFilterTerms();
			if (MouseIn(1285, 885, 90, 90)) ChatSearchLoadLanguageAndFilterTerms();
		}
		if (MouseIn(1385, 885, 90, 90)) ChatSearchToggleHelpMode();
		if (MouseIn(1685, 885, 90, 90)) ChatSearchGhostPlayerOnClickActive = false;
		if (MouseIn(1785, 885, 90, 90)) ChatSearchGhostPlayerOnClickActive = true;
		if (MouseIn(1885, 885, 90, 90)) ChatSearchToggleHiddenMode();
	}
}

/**
 * @returns {boolean} - True if the player changed the options and the apply/revert buttons should show
 */
function ChatSearchChangedLanguageOrFilterTerms() {
	return ChatSearchLanguageTemp != ChatSearchLanguage || ChatSearchFilterTermsTemp != Player.ChatSearchFilterTerms;
}

/**
 * While in filter view, called when player clicks apply, presses enter, or returns to the normal view.
 * Saves the "temp" options into their normal variables, and sends them to the server.
 * Also refreshes the displayed rooms accordingly.
 * @returns {void} - Nothing
 */
function ChatSearchSaveLanguageAndFilterTerms() {
	let changed = false;

	// Save Language option
	if (ChatSearchLanguage != ChatSearchLanguageTemp) {
		ChatSearchLanguage = ChatSearchLanguageTemp;
		ServerAccountUpdate.QueueData({ RoomSearchLanguage: ChatSearchLanguage });
		changed = true;
	}

	// Save Filter Terms option
	if (Player.ChatSearchFilterTerms != ChatSearchFilterTermsTemp) {
		Player.ChatSearchFilterTerms = ChatSearchFilterTermsTemp;
		ServerSend("AccountUpdate", { ChatSearchFilterTerms: Player.ChatSearchFilterTerms });
		changed = true;

		// Re-apply the filter client side immediately - in case searching doesn't update fast enough
		ChatSearchResult.unshift(...ChatSearchHiddenResult);
		ChatSearchApplyFilterTerms();
	}

	// If either/both options changed, refresh the room list
	if (changed)
		ChatSearchQuery();
}

/**
 * While in filter view, calls when player clicks revert.
 * Also called when entering the filter view, so that the values are correct on first load or if they got changed in any other way somehow.
 * Loads the "temp" options from their normal variables, and updates the search box.
 * @returns {void} - Nothing
 */
function ChatSearchLoadLanguageAndFilterTerms() {
	// Load options from the saved vars into the temp ones
	ChatSearchLanguageTemp = ChatSearchLanguage;
	ChatSearchFilterTermsTemp = Player.ChatSearchFilterTerms;
	ElementValue("InputSearch", ChatSearchFilterTermsTemp);
}

/**
 * Handles the key presses while in the chat search screen.
 * When the user presses enter, we launch the search query or save the temp options.
 * @returns {void} - Nothing
 */
function ChatSearchKeyDown() {
	if (KeyPress == 13) {
		if (ChatSearchMode == "")
			ChatSearchQuery();
		else
			ChatSearchSaveLanguageAndFilterTerms();
	}
}

/**
 * Handles exiting from the chat search screen, removes the input.
 * @returns {void} - Nothing
 */
function ChatSearchExit() {
	ChatSearchPreviousActivePose = Player.ActivePose;
	ElementRemove("InputSearch");
	CommonSetScreen("Room", ChatSearchLeaveRoom);
	DrawingGetTextSize.clearCache();
}

/**
 * Draws the filter mode help screen: just text and a back button.
 * @returns {void} - Nothing
 */
function ChatSearchFilterHelpDraw() {
	DrawRect(50, 50, 1900, 800, "White");
	DrawEmptyRect(50, 50, 1900, 800, "Black");
	for (let i = 0; i < 7; i++)
		DrawTextWrap(TextGet("HelpText"+(i+1)), 70, 50+i*100, 1860, 70, "Black", undefined, 2);
	DrawButton(1385, 885, 90, 90, "", "White", "Icons/DialogNormalMode.png", TextGet("CloseHelp"));
}

/**
 * Draws the filter mode unhide confirm screen: just text and confirm/cancel buttons.
 * @returns {void} - Nothing
 */
function ChatSearchFilterUnhideConfirmDraw() {
	const UnhideConfirm = ChatSearchFilterUnhideConfirm;
	DrawRect(50, 50, 1900, 800, "White");
	DrawEmptyRect(50, 50, 1900, 800, "Black");
	let y = 150;
	DrawTextWrap(TextGet("UnhideConfirmRoom").replace("{RoomLabel}", UnhideConfirm.RoomLabel), 70, y, 1860, 70, "Black", undefined, 2);
	y += 100;
	if (UnhideConfirm.MemberLabel != "") {
		DrawTextWrap(TextGet("UnhideConfirmMember").replace("{MemberLabel}", UnhideConfirm.MemberLabel), 70, y, 1860, 70, "Black", undefined, 2);
		y += 100;
	}
	if (UnhideConfirm.WordsLabel != "") {
		DrawTextWrap(TextGet("UnhideConfirmWords").replace("{WordsLabel}", UnhideConfirm.WordsLabel), 70, y, 1860, 70, "Black", undefined, 2);
		y += 100;
	}
	DrawTextWrap(TextGet("UnhideConfirmEnd"), 70, y, 1860, 70, "Black", undefined, 2);
	DrawButton(620, 898, 280, 64, TextGet("UnhideCancel"), "White");
	DrawButton(1100, 898, 280, 64, TextGet("UnhideConfirm"), "White");
}

/**
 * Draws the list of rooms in normal mode.
 * @returns {void} - Nothing
 */
function ChatSearchNormalDraw() {

	// If we can show the chat room search result in normal mode
	if ((ChatSearchResult.length >= 1)) {

		// Show up to 24 results
		var X = 25;
		var Y = 25;
		for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

			// Draw the room rectangle
			var HasFriends = ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0;
			var IsFull = ChatSearchResult[C].MemberCount >= ChatSearchResult[C].MemberLimit;
			var HasBlock = CharacterHasBlockedItem(Player, ChatSearchResult[C].BlockCategory);
			DrawButton(X, Y, 630, 85, "", (HasBlock && IsFull ? "#884444" : HasBlock ? "#FF9999" : HasFriends && IsFull ? "#448855" : HasFriends ? "#CFFFCF" : IsFull ? "#666" : "White"), null, null, IsFull);
			DrawTextFit((ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0 ? "(" + ChatSearchResult[C].Friends.length + ") " : "") + ChatSearchMuffle(ChatSearchResult[C].Name) + " - " + ChatSearchMuffle(ChatSearchResult[C].Creator) + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchMuffle(ChatSearchResult[C].Description), X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
		}

		// Draws the hovering text of friends in the current room
		if (!CommonIsMobile && MouseIn(25, 25, 1950, 850)) {

			// Finds the room where the mouse is hovering
			X = 25;
			Y = 25;
			for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

				// Determine the hover text starting position to ensure there's enough room
				let Height = 58;
				let ListHeight = Height * (
					(ChatSearchResult[C].Friends.length > 0 ? 1 : 0) + ChatSearchResult[C].Friends.length
					+ (ChatSearchResult[C].BlockCategory.length > 0 ? 1 : 0)
					+ (ChatSearchResult[C].Game != "" ? 1 : 0));
				let ListY = Math.min(Y, 872 - ListHeight);

				// Builds the friend list as hover text
				if (MouseIn(X, Y, 630, 85) && ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0) {
					DrawTextWrap(TextGet("FriendsInRoom") + " " + ChatSearchMuffle(ChatSearchResult[C].Name), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FFFF88", 1);
					ListY += Height;
					for (let F = 0; F < ChatSearchResult[C].Friends.length; F++) {
						DrawTextWrap(ChatSearchMuffle(ChatSearchResult[C].Friends[F].MemberName + " (" + ChatSearchResult[C].Friends[F].MemberNumber + ")"), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FFFF88", 1);
						ListY += Height;
					}
				}

				// Builds the blocked categories list below it
				if (MouseIn(X, Y, 630, 85) && (ChatSearchResult[C].BlockCategory != null) && (ChatSearchResult[C].BlockCategory.length > 0)) {
					let Block = TextGet("Block");
					for (let B = 0; B < ChatSearchResult[C].BlockCategory.length; B++)
						Block = Block + ((B > 0) ? ", " : " ") + TextGet(ChatSearchResult[C].BlockCategory[B]);
					DrawTextWrap(Block, (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FF9999", 1);
					ListY += Height;
				}

				// Builds the game box below it
				if (MouseIn(X, Y, 630, 85) && (ChatSearchResult[C].Game != null) && (ChatSearchResult[C].Game != "")) {
					DrawTextWrap(TextGet("GameLabel") + " " + TextGet("Game" + ChatSearchResult[C].Game), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#9999FF", 1);
					ListY += Height;
				}

				// Moves the next window position
				X = X + 660;
				if (X > 1500) {
					X = 25;
					Y = Y + 109;
				}
			}

		}

	} else DrawText(TextGet("NoChatRoomFound"), 1000, 450, "White", "Gray");
}

/**
 * Garbles based on immersion settings
 * @param {string} Text - The text to garble
 * @returns {string} - Garbled text
 */
function ChatSearchMuffle(Text) {
	let ret = Text;
	if (Player.ImmersionSettings && Player.ImmersionSettings.ChatRoomMuffle && Player.GetBlindLevel() > 0) {
		ret = SpeechGarbleByGagLevel(Player.GetBlindLevel() * Player.GetBlindLevel(), Text, true);
		if (ret.length == 0)
			return "...";
		return ret;
	}
	return ret;
}

/**
 * Draws the list of rooms in permission mode.
 * @returns {void} - Nothing
 */
function ChatSearchPermissionDraw() {
	if (((ChatSearchShowHiddenRoomsActive ? ChatSearchHiddenResult : ChatSearchResult).length < 1)) {
		DrawText(TextGet("NoChatRoomFound"), 1000, 450, "White", "Gray");
		return;
	}

	if (!ChatSearchShowHiddenRoomsActive)
	{
		// Show currently visible rooms
		var X = 25;
		var Y = 25;
		var ShownRooms = 0;

		for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
			let Hover = (MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && !CommonIsMobile;
			// Draw the room rectangle
			DrawRect(X, Y, 630, 85, Hover ? "green" : "lime");
			DrawTextFit(ChatSearchMuffle(ChatSearchResult[C].Name) + " - " + ChatSearchMuffle(ChatSearchResult[C].Creator) + " (" + ChatSearchResult[C].CreatorMemberNumber + ")", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchMuffle(ChatSearchResult[C].Description), X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
			ShownRooms++;
		}
	} else {
		// Show hidden rooms
		var X = 25;
		var Y = 25;
		var ShownRooms = 0;

		for (let C = ChatSearchResultOffset; C < ChatSearchHiddenResult.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
			let Hover = (MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && !CommonIsMobile;

			// Draw the room rectangle
			DrawRect(X, Y, 630, 85, Hover ? "red" : "pink");
			DrawTextFit(ChatSearchMuffle(ChatSearchHiddenResult[C].Name) + " - " + ChatSearchMuffle(ChatSearchHiddenResult[C].Creator) + " (" + ChatSearchHiddenResult[C].CreatorMemberNumber + ")", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchMuffle(ChatSearchHiddenResult[C].Description), X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
			ShownRooms++;
		}

		// Draws the hovering text of why the room is hidden
		if (!CommonIsMobile && MouseIn(25, 25, 1950, 850)) {
			// Finds the room where the mouse is hovering
			X = 25;
			Y = 25;
			for (let C = ChatSearchResultOffset; C < ChatSearchHiddenResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {
				const Reasons = ChatSearchGetFilterReasons(ChatSearchHiddenResult[C]);

				// Determine the hover text starting position to ensure there's enough room
				let Height = 58;
				let ListHeight = Height * ((Reasons.length > 0 ? 1 : 0) + Reasons.length);
				let ListY = Math.min(Y, 872 - ListHeight);

				// Builds the reason list as hover text
				if (MouseIn(X, Y, 630, 85) && Reasons.length > 0) {
					DrawTextWrap(TextGet("FilteredBecause"), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FFFF88", 1);
					ListY += Height;
					for (let F = 0; F < Reasons.length; F++) {
						DrawTextWrap(TextGet("FilterReason" + Reasons[F]), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FFFF88", 1);
						ListY += Height;
					}
				}

				// Moves the next window position
				X = X + 660;
				if (X > 1500) {
					X = 25;
					Y = Y + 109;
				}
			}
		}
	}
}

/**
 * Handles the clicks related to the chatroom list when in normal mode
 * @returns {void} - Nothing
 */
function ChatSearchJoin() {

	// Scans results
	var X = 25;
	var Y = 25;
	for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

		// If the player clicked on a valid room
		if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
			var RoomName = ChatSearchResult[C].Name;
			if (ChatSearchLastQueryJoin != RoomName || (ChatSearchLastQueryJoin == RoomName && ChatSearchLastQueryJoinTime + 1000 < CommonTime())) {
				ChatSearchLastQueryJoinTime = CommonTime();
				ChatSearchLastQueryJoin = RoomName;
				ChatRoomPlayerCanJoin = true;
				ServerSend("ChatRoomJoin", { Name: RoomName });
				ChatRoomPingLeashedPlayers();
			}

		}

		// Moves the next window position
		X = X + 660;
		if (X > 1500) {
			X = 25;
			Y = Y + 109;
		}
	}
}

/**
 * Switch the search screen between the normal view and the filter mode which allows hiding of rooms
 * @returns {void} - Nothing
 */
function ChatSearchToggleSearchMode() {
	if (ChatSearchMode == "") {
		ElementSetAttribute("InputSearch", "maxlength", "200");
		ChatSearchLoadLanguageAndFilterTerms();
		ChatSearchSetFilterChangeHandler(true);
		ChatSearchMode = "Filter";
	} else if (ChatSearchMode == "Filter") {
		ChatSearchSetFilterChangeHandler(false);
		ChatSearchSaveLanguageAndFilterTerms();
		ElementValue("InputSearch", "");
		ElementSetAttribute("InputSearch", "maxlength", "20");
		ChatSearchMode = "";
	}
}

/**
 * Switch to the Hidden Rooms view or back again.
 * Correctly handles adding/removing the input box as needed.
 * @returns {void} - Nothing
 */
function ChatSearchToggleHiddenMode() {
	ChatSearchShowHiddenRoomsActive = !ChatSearchShowHiddenRoomsActive;
	ChatSearchResultOffset = 0;
	if (ChatSearchShowHiddenRoomsActive)
		ElementRemove("InputSearch");
	else {
		ElementCreateInput("InputSearch", "text", ChatSearchFilterTermsTemp, "200");
		ChatSearchSetFilterChangeHandler(true);
	}
}

/**
 * Switch to the Filter Help view or back again.
 * Correctly handles adding/removing the input box as needed.
 * @returns {void} - Nothing
 */
function ChatSearchToggleHelpMode() {
	ChatSearchFilterHelpActive = !ChatSearchFilterHelpActive;
	if (ChatSearchFilterHelpActive)
		ElementRemove("InputSearch");
	else {
		ElementCreateInput("InputSearch", "text", ChatSearchFilterTermsTemp, "200");
		ChatSearchSetFilterChangeHandler(true);
	}
}

/**
 * Adds/removes event listeners to the input box when entering/exiting filter view.
 * @param {boolean} add - true to add listeners, false to remove.
 * @returns {void} - Nothing
 */
function ChatSearchSetFilterChangeHandler(add) {
	const EventNames = ['change', 'keypress', 'keydown', 'keyup', 'paste'];
	var i;

	if (add)
		for (i = 0; i < EventNames.length; i++)
			document.getElementById("InputSearch").addEventListener(EventNames[i], ChatSearchFilterChangeHandler);
	else
		for (i = 0; i < EventNames.length; i++)
			document.getElementById("InputSearch").removeEventListener(EventNames[i], ChatSearchFilterChangeHandler);
}

/**
 * Handles the input box being changed in any way, while in filter view.
 * Makes sure the "temp" filter terms variable is kept updated, so the apply/revert buttons will appear/disappear at the correct times.
 * @returns {void} - Nothing
 */
function ChatSearchFilterChangeHandler() {
	ChatSearchFilterTermsTemp = ElementValue("InputSearch");
}

/**
 * Handles the clicks related to the chatroom list when in permission mode
 * @returns {void} - Nothing
 */
function ChatSearchClickPermission() {
	const Result = (ChatSearchShowHiddenRoomsActive ? ChatSearchHiddenResult : ChatSearchResult);

	// Scans results + hidden rooms
	var X = 25;
	var Y = 25;
	var ShownRooms = 0;
	for (let C = ChatSearchResultOffset; C < Result.length && ShownRooms < ChatSearchRoomsPerPage; C++) {

		// If the player clicked on an existing room
		if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
			if (ChatSearchShowHiddenRoomsActive) {
				ChatSearchClickUnhideRoom(C, false);
			} else {
				// Do what player has chosen to do when clicking a room to hide it
				const Room = ChatSearchResult[C];
				if (ChatSearchGhostPlayerOnClickActive) {
					// Add the room's creator to ghostlist
					ChatRoomListManipulation(Player.GhostList, true, "" + Room.CreatorMemberNumber);
				} else {
					// Just temp hide the room
					ChatSearchTempHiddenRooms.push(Room.CreatorMemberNumber);
				}
				// Move the room from the normal result to the hidden result
				ChatSearchHiddenResult.push(Room);
				ChatSearchResult.splice(C, 1);
			}
			// Return early because we changed the list so it's no longer valid
			return;
		}

		// Moves the next window position
		X = X + 660;
		if (X > 1500) {
			X = 25;
			Y = Y + 109;
		}
		ShownRooms++;
	}
}

/**
 * Does whatever is necessary to unhide a room.
 * Shows a confirmation screen first, unless the only reason is "TempHidden".
 * This is called when clicking a room in the list and also, if a confirmation is shown, called again when the confirm button is clicked.
 *
 * @param {number} C - Index of the room within ChatSearchHiddenResult
 * @param {boolean} Confirmed - False when clicking on room list, true when clicking Confirm button
 */
function ChatSearchClickUnhideRoom(C, Confirmed) {
	const Room = ChatSearchHiddenResult[C];
	const Reasons = ChatSearchGetFilterReasons(Room);
	const ReasonsHasWord = (Reasons.indexOf("Word") != -1);
	const ReasonsHasTempHidden = (Reasons.indexOf("TempHidden") != -1);
	const ReasonsHasGhostList = (Reasons.indexOf("GhostList") != -1);

	// If the only reason is "TempHidden" we don't need a confirmation screen so just act like we clicked the confirm button already
	if (Reasons.length == 1 && ReasonsHasTempHidden) Confirmed = true;

	// If room matches filtered words, calculate the words to be removed/kept
	let KeepTerms = [], RemoveTerms = [];
	if (ReasonsHasWord) {
		let OldTerms = Player.ChatSearchFilterTerms.split(',').filter(s => s);
		for (let Idx = 0; Idx < OldTerms.length; Idx++)
			if (ChatSearchMatchesTerms(Room, [OldTerms[Idx].toUpperCase()]))
				RemoveTerms.push(OldTerms[Idx]);
			else
				KeepTerms.push(OldTerms[Idx]);
	}

	// If not confirmed, store data for later and show confirm screen
	if (!Confirmed) {
		const MemberLabel = ChatSearchMuffle(ChatSearchHiddenResult[C].Creator) + " (" + ChatSearchHiddenResult[C].CreatorMemberNumber + ")";
		let UnhideConfirm = {
			Index: C,
			RoomLabel: ChatSearchMuffle(ChatSearchHiddenResult[C].Name) + " - " + MemberLabel,
			MemberLabel: "",
			WordsLabel: "",
		};
		if (ReasonsHasGhostList)
			UnhideConfirm.MemberLabel = MemberLabel;
		if (ReasonsHasWord)
			UnhideConfirm.WordsLabel = RemoveTerms.join(',');
		ChatSearchFilterUnhideConfirm = UnhideConfirm;
		return;
	}

	if (ReasonsHasWord) {
		// Remove all filtered terms that this room matches
		Player.ChatSearchFilterTerms = KeepTerms.join(',');
		ServerSend("AccountUpdate", { ChatSearchFilterTerms: Player.ChatSearchFilterTerms });
		// Update the temp var too because we don't reload it when we exit the hidden room list
		ChatSearchFilterTermsTemp = Player.ChatSearchFilterTerms;
	}
	if (ReasonsHasTempHidden) {
		// Remove from Temp Hidden list
		const Idx = ChatSearchTempHiddenRooms.indexOf(Room.CreatorMemberNumber);
		ChatSearchTempHiddenRooms.splice(Idx, 1);
	}
	if (ReasonsHasGhostList) {
		// Remove creator from ghostlist
		ChatRoomListManipulation(Player.GhostList, false, "" + Room.CreatorMemberNumber);
	}

	// Move the room from the hidden result to the normal result
	ChatSearchResult.push(Room);
	ChatSearchHiddenResult.splice(C, 1);
}

/**
 * Handles the reception of the server response when joining a room or when getting banned/kicked
 * @param {string} data - Response from the server
 * @returns {void} - Nothing
 */
function ChatSearchResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != "")) {
		if (((data == "RoomBanned") || (data == "RoomKicked")) && ServerPlayerIsInChatRoom()) {
			ChatRoomClearAllElements();
			CommonSetScreen("Online", "ChatSearch");
			CharacterDeleteAllOnline();
			ChatRoomSetLastChatRoom("");
		}
		ChatSearchMessage = "Response" + data;
	}
}

/**
 * Handles the reception of the server data when it responds to the search query
 * @param {any[]} data - Response from the server, contains the room list matching the query
 * @returns {void} - Nothing
 */
function ChatSearchResultResponse(data) {
	ChatSearchResult = data;
	ChatSearchResultOffset = 0;
	ChatSearchQuerySort();
	ChatSearchApplyFilterTerms();
	ChatSearchAutoJoinRoom();
}

/**
 * Automatically join a room, for example due to leashes or reconnect
 * @returns {void} - Nothing
 */
function ChatSearchAutoJoinRoom() {
	if (ChatRoomJoinLeash != "") {
		for (let R = 0; R < ChatSearchResult.length; R++)
			if (ChatSearchResult[R].Name == ChatRoomJoinLeash) {
				ChatSearchLastQueryJoinTime = CommonTime();
				ChatSearchLastQueryJoin = ChatSearchResult[R].Name;
				ChatRoomPlayerCanJoin = true;
				ServerSend("ChatRoomJoin", { Name: ChatSearchResult[R].Name });
				break;
			}
	} else if (Player.ImmersionSettings && Player.ImmersionSettings.ReturnToChatRoom && (Player.LastChatRoom != "") && ((ChatSearchLeaveRoom !== "AsylumEntrance") || (AsylumGGTSGetLevel(Player) <= 0))) {
		let roomFound = false;
		let roomIsFull = false;
		for (let R = 0; R < ChatSearchResult.length; R++) {
			var room = ChatSearchResult[R];
			if (room.Name == Player.LastChatRoom && room.Game == "") {
				if (room.MemberCount < room.MemberLimit) {
					var RoomName = room.Name;
					if (ChatSearchLastQueryJoin != RoomName || (ChatSearchLastQueryJoin == RoomName && ChatSearchLastQueryJoinTime + 1000 < CommonTime())) {
						roomFound = true;
						ChatSearchLastQueryJoinTime = CommonTime();
						ChatSearchLastQueryJoin = RoomName;
						ChatRoomPlayerCanJoin = true;
						ServerSend("ChatRoomJoin", { Name: RoomName });
						break;
					}
				} else {
					roomIsFull = true;
					break;
				}
			}
		}
		if (!roomFound) {
			if (Player.ImmersionSettings.ReturnToChatRoomAdmin
				&& Player.LastChatRoomAdmin
				&& Player.LastChatRoomBG
				&& Player.LastChatRoomPrivate != null
				&& Player.LastChatRoomSize
				&& Player.LastChatRoomDesc != null) {
				ChatRoomPlayerCanJoin = true;
				if ((ChatCreateMessage === "ResponseRoomAlreadyExist" || roomIsFull) && ChatSearchRejoinIncrement < 50) {
					ChatSearchRejoinIncrement += 1;
					const ChatRoomSuffix = " " + ChatSearchRejoinIncrement;
					Player.LastChatRoom = Player.LastChatRoom.substring(0, Math.min(Player.LastChatRoom.length, 19 - ChatRoomSuffix.length)) + ChatRoomSuffix; // Added
					ChatCreateMessage = "";
					ChatSearchQuery();
				} else {
					var NewRoom = {
						Name: Player.LastChatRoom.trim(),
						Description: Player.LastChatRoomDesc.trim(),
						Background: Player.LastChatRoomBG,
						Private: Player.LastChatRoomPrivate,
						Space: ChatRoomSpace,
						Game: "",
						Admin: [Player.MemberNumber],
						Limit: ("" + Math.min(Math.max(Player.LastChatRoomSize, 2), 10)).trim(),
						Language: Player.LastChatRoomLanguage,
						BlockCategory: ChatBlockItemCategory || []
					};
					ServerSend("ChatRoomCreate", NewRoom);
					ChatCreateMessage = "CreatingRoom";

					if (Player.ImmersionSettings.ReturnToChatRoomAdmin && Player.LastChatRoomAdmin) {
						NewRoom.Admin = Player.LastChatRoomAdmin;
						ChatRoomNewRoomToUpdate = NewRoom;
						ChatRoomNewRoomToUpdateTimer = CurrentTime + 1000;
					}
				}
			} else {
				ChatSearchMessage = roomIsFull ? "ResponseRoomFull" : "ResponseCannotFindRoom";
				ChatRoomSetLastChatRoom("");
			}
		}
	}
	ChatRoomJoinLeash = "";
}

/**
 * Sends the search query data to the server. The response will be handled by ChatSearchResponse once it is received
 * @returns {void} - Nothing
 */
function ChatSearchQuery() {
	var Query = ChatSearchMode == "Filter" ? "" : ElementValue("InputSearch").toUpperCase().trim();
	let FullRooms = (Player.OnlineSettings && Player.OnlineSettings.SearchShowsFullRooms);

	if (ChatRoomJoinLeash != null && ChatRoomJoinLeash != "") {
		Query = ChatRoomJoinLeash.toUpperCase().trim();
	} else if (Player.ImmersionSettings && Player.LastChatRoom && Player.LastChatRoom != "") {
		if (Player.ImmersionSettings.ReturnToChatRoom) {
			Query = Player.LastChatRoom.toUpperCase().trim();
			FullRooms = true;
		} else {
			ChatRoomSetLastChatRoom("");
		}
	} else {
		ChatSearchRejoinIncrement = 1; // Reset the join increment
	}

	const SearchData = { Query: Query, Language: ChatSearchLanguage, Space: ChatRoomSpace, Game: ChatRoomGame, FullRooms: FullRooms };

	// Prevent spam searching the same thing.
	const SearchDataJSON = JSON.stringify(SearchData);
	if (ChatSearchLastSearchDataJSON != SearchDataJSON || (ChatSearchLastQuerySearchTime + 2000 < CommonTime())) {
		ChatSearchLastQuerySearchTime = CommonTime();
		ChatSearchLastSearchDataJSON = SearchDataJSON;
		ChatSearchResult = [];
		ServerSend("ChatRoomSearch", SearchData);
	}

	ChatSearchMessage = "EnterName";
}

/**
 * Sorts the room result based on a player's settings
 * @returns {void} - Nothing
 */
function ChatSearchQuerySort() {
	// Send full rooms to the back of the list and save the order of creation.
	ChatSearchResult = ChatSearchResult.map((Room, Idx) => { Room.Order = Idx; return Room; });
	ChatSearchResult.sort((R1, R2) => R1.MemberCount >= R1.MemberLimit ? 1 : (R2.MemberCount >= R2.MemberLimit ? -1 : (R1.Order - R2.Order)));

	// Friendlist option overrides basic order, but keeps full rooms at the back for each number of each different total of friends.
	if (Player.OnlineSettings && Player.OnlineSettings.SearchFriendsFirst)
		ChatSearchResult.sort((R1, R2) => R2.Friends.length - R1.Friends.length);
}

/**
 * Remove any rooms from the room list which contain the player's filter terms in the name
 * @returns {void} - Nothing
 */
function ChatSearchApplyFilterTerms() {
	ChatSearchHiddenResult = ChatSearchResult.filter(room => {return ChatSearchGetFilterReasons(room).length != 0;});
	ChatSearchResult = ChatSearchResult.filter(room => {return ChatSearchGetFilterReasons(room).length == 0;});
}

/**
 * Get a list of reasons why a room should be hidden.
 * If the returned array is empty, the room should be shown.
 * @param {object} Room - the room object to check
 * @returns {string[]} - list of reasons
 */
function ChatSearchGetFilterReasons(Room) {
	var Reasons = [];

	// for an exact room name match, ignore filters
	if (ChatSearchMode == "" && Room.Name.toUpperCase() == ElementValue("InputSearch").toUpperCase().trim())
		return [];

	// are any words filtered?
	if (ChatSearchMatchesTerms(Room, Player.ChatSearchFilterTerms.split(',').filter(s => s).map(s => s.toUpperCase())))
		Reasons.push("Word");

	// is room temp hidden?
	if (ChatSearchTempHiddenRooms.indexOf(Room.CreatorMemberNumber) != -1)
		Reasons.push("TempHidden");

	// is creator on ghostlist?
	if (Player.GhostList.indexOf(Room.CreatorMemberNumber) != -1)
		Reasons.push("GhostList");

	return Reasons;
}

/**
 * Check if a room matches filtered-out terms and should thus be hidden.
 * Also used when deciding which terms need to be removed from the filter option in order to make a room be no longer hidden.
 * Only checks the room name, not the description.
 * @param {object} Room - the room object to check
 * @param {string[]} Terms - list of terms to check
 * @returns {boolean} - true if room matches, false otherwise
 */
function ChatSearchMatchesTerms(Room, Terms) {
	const roomName = Room.Name.toUpperCase();
	return Terms.some(term => roomName.includes(term));
}

/**
 * Calculates starting offset for the ignored rooms list when displaying results in filter/permission mode.
 * @param {number} shownRooms - Number of rooms shown before the ignored rooms.
 * @returns {number} - Starting offset for ingored rooms
 */
function ChatSearchCalculateIgnoredRoomsOffset(shownRooms) {
	return ChatSearchResultOffset + shownRooms - ChatSearchResult.length;
}
