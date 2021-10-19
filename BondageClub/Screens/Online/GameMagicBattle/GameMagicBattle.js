"use strict";
var GameMagicBattleBackground = "Sheet";
var GameMagicBattleTimerDelay = 30;
var GameMagicBattleStatus = "";
var GameMagicBattlePlayer = [];
var GameMagicBattleTeamType = "";
var GameMagicBattleAction = "";
var GameMagicBattleTurnAdmin = null;
var GameMagicBattleTurnTimer = null;
var GameMagicBattleFocusCharacter = null;

/**
 * Checks if the character is an admin while the game is going.
 * @param {Character} C - Character to check for
 * @returns {boolean} -  Returns TRUE if that character is an admin/the game administrator
 */
function GameMagicBattleIsAdmin(C) {
	return (ChatRoomData.Admin.indexOf(C.MemberNumber) >= 0);
}

/**
 * Draws the Magic Battle class/team icon of a character
 * @param {Character} C - Character for which to draw the icons
 * @param {number} X - Position on the X axis of the canvas
 * @param {number} Y - Position on the Y axis of the canvas
 * @param {number} Zoom - Zoom factor of the character
 * @returns {void} - Nothing
 */
function GameMagicBattleDrawIcon(C, X, Y, Zoom) {
}

/**
 * Loads the Magic Battle game.
 * @returns {void} - Nothing
 */
function GameMagicBattleLoad() {
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.MagicBattle == null) Player.Game.MagicBattle = {};
	if ((GameMagicBattleTeamType == "") && (Player.Game.MagicBattle.TeamType != null)) GameMagicBattleTeamType = Player.Game.MagicBattle.TeamType;
	if (GameMagicBattleTeamType != "FreeForAll") GameMagicBattleTeamType = "House";
}

/**
 * Runs and draws the Magic Battle game.
 * @returns {void} - Nothing
 */
function GameMagicBattleRun() {

	// Draw the character, text and buttons to configure the game, admins can start the game from here
	DrawCharacter(Player, 50, 50, 0.9);
	DrawText(TextGet("Title"), 1200, 125, "Black", "Gray");
	if ((GameMagicBattleStatus == "") && GameMagicBattleIsAdmin(Player)) DrawBackNextButton(900, 343, 600, 64, TextGet("TeamType") + " " + TextGet(GameMagicBattleTeamType), "White", "", () => "", () => "");
	else DrawText(TextGet("TeamType") + " " + TextGet(GameMagicBattleTeamType), 1200, 375, "Black", "Gray");
	if (GameMagicBattleStatus == "") DrawText(TextGet("StartCondition" + GameMagicBattleTeamType), 1200, 500, "Black", "Gray");
	else DrawText(TextGet("RunningGame"), 1200, 500, "Black", "Gray");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (GameMagicBattleCanLaunchGame()) DrawButton(1050, 600, 400, 65, TextGet("StartGame"), "White");

}

/**
 * Runs the game from the chat room
 * @returns {void} - Nothing
 */
function GameMagicBattleRunProcess() {

}

/**
 * Triggered when an option is selected for the current target character. The inventory for it is built and the action is published
 * @param {string} Name - Name of the selected option
 * @returns {void} - Nothing
 */
function GameMagicBattleClickOption(Name) {
}

/**
 * Handles clicks during the online game.
 * @returns {boolean} - Returns TRUE if the click was handled by this online click handler
 */
function GameMagicBattleClickProcess() {
	return false;
}

/**
 * Starts a Magic Battle match.
 * @returns {void} - Nothing
 */
function GameMagicBattleStartProcess() {

	// Gives a delay in seconds, based on the player preference
	GameMagicBattleTurnTimer = TimerGetTime() + (GameMagicBattleTurnTimerDelay * 1000);

	// Notices everyone in the room that the game starts
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	ServerSend("ChatRoomChat", { Content: "MagicBattleGameStart", Type: "Action" , Dictionary: Dictionary});

	// Changes the game status and exits
	ServerSend("ChatRoomGame", { GameProgress: "Start" });
	Player.Game.MagicBattle.Status = "Running";
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	ChatRoomCharacterUpdate(Player);

}

/**
 * Handles clicks in the Magic Battle chat Admin screen
 * @returns {void} - Nothing
 */
function GameMagicBattleClick() {

	// When the user exits
	if (MouseIn(1815, 75, 90, 90)) GameMagicBattleExit();
	
	// When the user selects a new team configuration
	if (MouseIn(900, 343, 600, 64) && (GameMagicBattleStatus == "") && GameMagicBattleIsAdmin(Player))
		GameMagicBattleTeamType = (GameMagicBattleTeamType == "House") ? "FreeForAll" : "House";

	// If the administrator wants to start the game
	if (MouseIn(1050, 600, 400, 65) && GameMagicBattleCanLaunchGame()) {

		// Updates the player data
		Player.Game.MagicBattle.TeamType = GameMagicBattleTeamType;
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);

		// Starts the game
		CommonSetScreen("Online", "ChatRoom");
		GameMagicBattleStartProcess();

	}

}

/**
 * Triggered when the player exits the Magic Battle info screen.
 * @returns {void} - Nothing
 */
function GameMagicBattleExit() {

	// When the game isn't running, we allow to change the class or team
	if (GameMagicBattleStatus == "") {
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);
	}
	CommonSetScreen("Online", "ChatRoom");

}

/**
 * Checks if a Magic Battle match can be launched. The player must be an admin and two different houses must be selected.
 * @returns {boolean} - Returns TRUE if the game can be launched
 */
function GameMagicBattleCanLaunchGame() {
	if (GameMagicBattleStatus != "") return false;
	if (!GameMagicBattleIsAdmin(Player)) return false;
	if ((GameMagicBattleTeamType != "House") && (GameMagicBattleTeamType != "FreeForAll")) return false;
	var House = "";
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game.MagicBattle.House != "NotPlaying") && ChatRoomCharacter[C].CanTalk()) {
			if (House == "")
				House = ChatRoomCharacter[C].Game.MagicBattle.House;
			else
				if ((House != ChatRoomCharacter[C].Game.MagicBattle.House) || (GameMagicBattleTeamType == "FreeForAll"))
					return true;
		}
	return false;
}

/**
 * Gets a character from the Magic Battle game by member number
 * @param {number} MemberNumber - Member number of the character to get.
 * @returns {Character | null} - The corresponding character, if it exists.
 */
function GameMagicBattleGetPlayer(MemberNumber) {
	for (let C = 0; C < GameMagicBattlePlayer.length; C++)
		if (GameMagicBattlePlayer[C].MemberNumber == MemberNumber)
			return GameMagicBattlePlayer[C];
	return null;
}

/**
 * Processes the Magic Battle game clicks. This method is called from the generic OnlineGameClickCharacter function when the current game is Magic Battle.
 * @param {Character} C - Character clicked on
 * @returns {boolean} - returns TRUE if the code handles the click
 */
function GameMagicBattleCharacterClick(C) {

	// If it's the player turn, we allow clicking on a character to get the abilities menu
	if ((GameMagicBattleStatus == "Running") && (C.Game != null) && (C.Game.MagicBattle != null) && (C.Game.MagicBattle.House != null) && (C.Game.MagicBattle.House != "NotPlaying"))
		GameMagicBattleTurnFocusCharacter = C;

	// Flags that transaction as being handled
	return true;

}

/**
 * Adds a game message to the chat log.
 * @param {string} Msg - Message tag
 * @param {Character} Source - Source character of the message
 * @param {Character} Target - Character targetted by the message
 * @param {string} Description - Description of the message (item name, team name, etc.)
 * @param {string} [Color] - Color of the message to add.
 * @returns {void} - Nothing
 */
function GameMagicBattleAddChatLog(Msg, Source, Target, Description, Color) {

	// Gets the message from the dictionary
	Msg = OnlineGameDictionaryText(Msg);
	Msg = Msg.replace("SourceName", Source.Name);
	Msg = Msg.replace("SourceNumber", Source.MemberNumber.toString());
	Msg = Msg.replace("TargetName", Target.Name);
	Msg = Msg.replace("TargetNumber", Target.MemberNumber.toString());
	Msg = Msg.replace("ItemDesc", Description);
	Msg = Msg.replace("TeamName", Description);

	// Adds the message and scrolls down unless the user has scrolled up
	var div = document.createElement("div");
	div.setAttribute('class', 'ChatMessage ChatMessageServerMessage');
	div.setAttribute('data-time', ChatRoomCurrentTime());
	if ((Color != null) && (Color != "")) div.style.color = Color;
	div.innerHTML = Msg;
	var Refocus = document.activeElement.id == "InputChat";
	var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
	if (document.getElementById("TextAreaChatLog") != null) {
		document.getElementById("TextAreaChatLog").appendChild(div);
		if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
		if (Refocus) ElementFocus("InputChat");
	}

}

/**
 * Builds the game player list.
 * @returns {void} - Nothing
 */
function GameMagicBattleBuildPlayerList() {
	GameMagicBattlePlayer = [];
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.MagicBattle != null) && (ChatRoomCharacter[C].Game.MagicBattle.House != null) && (ChatRoomCharacter[C].Game.MagicBattle.House != "NotPlaying"))
			GameMagicBattlePlayer.push(ChatRoomCharacter[C]);
}

/**
 * Processes the Magic Battle game messages for turns and actions.
 * @param {object} P - Data object containing the message data.
 * @returns {void} - Nothing
 */
function GameMagicBattleProcess(P) {
	if ((P != null) && (typeof P === "object") && (P.Data != null) && (typeof P.Data === "object") && (P.Sender != null) && (typeof P.Sender === "number") && (P.RNG != null) && (typeof P.RNG === "number")) {

		// The administrator can start the Magic Battle game, he becomes the turn admin in the process
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress == "Start")) {
			GameMagicBattleStatus = "Running";
			GameMagicBattleTurnAdmin = P.Sender;
			GameMagicBattleBuildPlayerList();
			GameMagicBattleNewTurn("TurnStart");
		}

		// The turn administrator can skip turns after the delay has ran out
		if ((GameMagicBattleStatus == "Running") && (GameMagicBattleTurnAdmin == P.Sender) && (P.Data.GameProgress == "Skip")) {
			GameMagicBattleProgress.push({ Sender: P.Sender, Time: CurrentTime, RNG: P.RNG, Data: P.Data });
			if (GameMagicBattleContinue()) GameMagicBattleNewTurn("TurnNext");
		}

		// The current turn player can trigger an action
		if ((GameMagicBattleStatus == "Running") && (P.Data.GameProgress == "Action") && (P.Data.Action != null) && (P.Data.Target != null)) {

			// Before we process it, we make sure the action is valid by checking all possible options
			var Source = GameMagicBattleGetPlayer(P.Sender);
			var Target = GameMagicBattleGetPlayer(P.Data.Target);
			if ((Source != null) && (Target != null)) {
			}

		}

	}
}

/**
 * Resets the Magic Battle game so a new game might be started
 * @returns {void} - Nothing
 */
function GameMagicBattleReset() {
	GameMagicBattleStatus = "";
	if ((Player.Game != null) && (Player.Game.MagicBattle != null)) Player.Game.MagicBattle.Status = "";
}
