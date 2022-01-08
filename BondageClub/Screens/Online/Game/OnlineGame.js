"use strict";
var OnlineGameDictionary = null;

/**
 * Loads the online game dictionary that will be used throughout the game to output messages
 * @returns {void} - Nothing
 */
function OnlneGameDictionaryLoad() {
	if (OnlineGameDictionary == null) {

		// Tries to read it from cache first
		var FullPath = "Screens/Online/Game/OnlineGameDictionary.csv";
		if (CommonCSVCache[FullPath]) {
			OnlineGameDictionary = CommonCSVCache[FullPath];
			return;
		}

		// Opens the file, parse it and returns the result in an object
		CommonGet(FullPath, function () {
			if (this.status == 200) {
				CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
				OnlineGameDictionary = CommonCSVCache[FullPath];
			}
		});

		// If a translation file is available, we open the txt file and keep it in cache
		var TranslationPath = FullPath.replace(".csv", "_" + TranslationLanguage + ".txt");
		if (TranslationAvailable(TranslationPath))
			CommonGet(TranslationPath, function() {
				if (this.status == 200) TranslationCache[TranslationPath] = TranslationParseTXT(this.responseText);
			});

	}
}

/**
 * Searches in the dictionary for a specific keyword and returns the message linked to it
 * @param {string} KeyWord - Keyword of the text to look for
 * @returns {string} The text attached to the keyword, will return a missing text if it was not found
 */
function OnlineGameDictionaryText(KeyWord) {
	for (let D = 0; D < OnlineGameDictionary.length; D++)
		if (OnlineGameDictionary[D][0] == ChatRoomGame + KeyWord)
			return OnlineGameDictionary[D][1].trim();
	return "MISSING ONLINE GAME DESCRIPTION FOR KEYWORD " + KeyWord;
}

/**
 * Catches the character click from chat rooms and make sure the online game doesn't need to handle them
 * @param {Character} C - Character that has been clicked on
 * @return {*} Returns the return content of click function of the currently selected game, or false if there is no corresponding game
 */
function OnlineGameClickCharacter(C) {
	if ((ChatRoomGame == "LARP") && (GameLARPStatus != "")) return GameLARPCharacterClick(C);
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleStatus != "")) return GameMagicBattleCharacterClick(C);
	return false;
}

/**
 * Catches the chat room clicks and make sure the online game doesn't need to handle them
 * @return {*} Returns the return content of click function of the currently selected game, or false if there is no corresponding game
 */
function OnlineGameClick() {
	if ((ChatRoomGame == "LARP") && (GameLARPStatus != "")) return GameLARPClickProcess();
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleStatus != "")) return GameMagicBattleClickProcess();
	return false;
}

/**
 * Run the corresponding online game scripts
 * @returns {void} - Nothing
 */
function OnlineGameRun() {

	// In LARP, the player turn can be skipped by an administrator after 20 seconds
	if (ChatRoomGame == "LARP") GameLARPRunProcess();
	if (ChatRoomGame == "MagicBattle") GameMagicBattleRunProcess();

}

/**
 * Checks if clothes can be changed in an online game space
 * @returns {boolean} - Returns TRUE if there's no online game that currently blocks changing
 */
function OnlineGameAllowChange() {
	if ((ChatRoomGame == "LARP") && (GameLARPStatus != "")) return false;
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleStatus != "")) return false;
	return true;
}

/**
 * Checks if blocking items is currently allowed
 * @returns {boolean} - Returns TRUE if the online game allows you to block items
 */
function OnlineGameAllowBlockItems() {
	if ((ChatRoomGame == "LARP") && (GameLARPStatus != "")) return false;
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleStatus != "")) return false;
	return true;
}

/**
 * Retrieves the current status of online games and stores it
 * @returns {void} - Nothing
 */
function OnlineGameLoadStatus() {
	if (ChatRoomGame == "LARP") {
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if ((ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) && (ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.LARP != null) && (ChatRoomCharacter[C].Game.LARP.Status != "")) {
				GameLARPStatus = ChatRoomCharacter[C].Game.LARP.Status;
				return;
			}
		GameLARPReset();
	}
	if (ChatRoomGame == "MagicBattle") {
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if ((ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) && (ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.MagicBattle != null) && (ChatRoomCharacter[C].Game.MagicBattle.Status != "")) {
				GameMagicBattleStatus = ChatRoomCharacter[C].Game.MagicBattle.Status;
				return;
			}
		GameMagicBattleReset();
	}
}

/**
 * Resets the game status if needed when the chat room data is updated
 * @returns {void} - Nothing
 */
function OnlineGameReset() {
	if (ChatRoomGame != "LARP") GameLARPReset();
	if (ChatRoomGame != "MagicBattle") GameMagicBattleReset();
}

/**
 * Returns TRUE if the MemberPlayer supplied is still in the current chat room
 * @param {number} MemberNumber - The number to validate
 * @returns {boolean} - Returns TRUE if that number is still in the room
 */
function OnlineGameCharacterInChatRoom(MemberNumber) {
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == MemberNumber)
			return true;
	return false;
}

/**
 * Draws the online game images/text needed on the characters
 * @param {Character} C - Character to draw the info for
 * @param {number} X - Position of the character the X axis
 * @param {number} Y - Position of the character the Y axis
 * @param {number} Zoom - Amount of zoom the character has (Height)
 * @returns {void} - Nothing
 */
function OnlineGameDrawCharacter(C, X, Y, Zoom) {

	// GGTS Draws the level, the number of strikes and a progress bar, level 6 shows the time in a gold frame
	if ((CurrentModule == "Online") && (CurrentScreen == "ChatRoom") && (ChatRoomGame == "GGTS") && (ChatRoomSpace === "Asylum")) {
		let Level = AsylumGGTSGetLevel(C);
		if ((Level > 0) && (C.Game != null) && (C.Game.GGTS != null)) {
			if (C.Game.GGTS.Strike >= 1) DrawImageZoomCanvas("Screens/Room/AsylumGGTS/Strike" + C.Game.GGTS.Strike.toString() + ".png", MainCanvas, 0, 0, 100, 50, X + 50 * Zoom, Y + 800 * Zoom, 100 * Zoom, 50 * Zoom);
			MainCanvas.font = CommonGetFont(Math.round(36 * Zoom));
			let Progress = Math.floor(C.Game.GGTS.Time / AsylumGGTSLevelTime[Level] * 100);
			if (C.Game.GGTS.Strike >= 3) Progress = 0;
			if ((Level >= 6) || (Progress >= 100)) DrawEmptyRect(X + 50 * Zoom, Y + 860 * Zoom, 100 * Zoom, 40 * Zoom, "Black");
			if (Level >= 6) DrawRect(X + 52 * Zoom, Y + 862 * Zoom, 96 * Zoom, 36 * Zoom, "#FFD700");
			else if (Progress >= 100) DrawRect(X + 50 * Zoom, Y + 860 * Zoom, 100 * Zoom, 40 * Zoom, "White");
			else DrawProgressBar(X + 50 * Zoom, Y + 860 * Zoom, 100 * Zoom, 40 * Zoom, Progress);
			if (Level >= 6) DrawText(Math.floor(C.Game.GGTS.Time / 60000).toString(), X + 100 * Zoom, Y + 881 * Zoom, "Black", "White");
			else if (Progress >= 50) DrawText(Level.toString(), X + 100 * Zoom, Y + 881 * Zoom, "Black", "White");
			else DrawText(Level.toString(), X + 101 * Zoom, Y + 882 * Zoom, "White", "Black");
			if (C.Game.GGTS.Rule != null)
				for (let R = 0; R < C.Game.GGTS.Rule.length; R++)
					DrawImageZoomCanvas("Screens/Room/AsylumGGTS/Rule" + C.Game.GGTS.Rule[R] + ".png", MainCanvas, 0, 0, 33, 33, X + 50 * Zoom + R * 33 * Zoom, Y + 902 * Zoom, 33 * Zoom, 33 * Zoom);
			if ((C.ID == 0) && (AsylumGGTSTimer > 0) && (AsylumGGTSTimer > CommonTime()) && (C.Game.GGTS.Strike < 3)) {
				let ForeColor = (AsylumGGTSTask == null) ? "Black" : "White";
				let BackColor = (ForeColor == "White") ? "Black" : "White";
				if ((BackColor == "Black") && (Math.round((AsylumGGTSTimer - CommonTime()) / 1000) <= 10)) BackColor = "Red";
				DrawEmptyRect(X + 350 * Zoom, Y + 860 * Zoom, 100 * Zoom, 40 * Zoom, ForeColor, 2);
				DrawRect(X + 352 * Zoom, Y + 862 * Zoom, 96 * Zoom, 36 * Zoom, BackColor);
				DrawText(Math.round((AsylumGGTSTimer - CommonTime()) / 1000).toString(), X + 399 * Zoom, Y + 882 * Zoom, ForeColor, "Silver");
			}
			MainCanvas.font = CommonGetFont(36);
		}
	}

	// LARP draws the timer if needed and the icon linked to team and class
	if ((CurrentModule == "Online") && (CurrentScreen == "ChatRoom") && (ChatRoomGame == "LARP")) {
		GameLARPDrawIcon(C, X + 70 * Zoom, Y + 800 * Zoom, 0.6 * Zoom);
		if ((GameLARPPlayer.length > 0) && (C.MemberNumber == GameLARPPlayer[GameLARPTurnPosition].MemberNumber) && (GameLARPStatus == "Running") && (GameLARPTurnFocusCharacter == null)) {
			MainCanvas.font = CommonGetFont(72);
			var Time = Math.ceil((GameLARPTurnTimer - TimerGetTime()) / 1000);
			DrawText(((Time < 0) || (Time > GameLARPTimerDelay[GameLARPTimerDelay.length - 1])) ? OnlineGameDictionaryText("TimerNA") : Time.toString(), X + 250 * Zoom, Y + 830 * Zoom, "Red", "Black");
			MainCanvas.font = CommonGetFont(36);
		}
	}

	// Magic battle draws the timer and the spell buttons
	if ((CurrentModule == "Online") && (CurrentScreen == "ChatRoom") && (ChatRoomGame == "MagicBattle")) {
		GameMagicBattleDrawIcon(C, X + 70 * Zoom, Y + 800 * Zoom, 0.6 * Zoom);
		if (Player.CanTalk() && (GameMagicBattleStatus == "Running")) {
			if (C.MemberNumber == Player.MemberNumber) {
				MainCanvas.font = CommonGetFont(72);
				let Time = Math.ceil((GameMagicBattleTurnTimer - TimerGetTime()) / 1000);
				let Color = "#00FF00";
				if (Time <= 15) Color = "#FFFF00";
				if (Time <= 6) Color = "#FF0000";
				DrawText(((Time < 0) || (Time > GameMagicBattleTimerDelay)) ? OnlineGameDictionaryText("TimerNA") : Time.toString(), X + 250 * Zoom, Y + 830 * Zoom, Color, "Black");
				MainCanvas.font = CommonGetFont(36);
			}
			if ((GameMagicBattleFocusCharacter != null) && (C.MemberNumber == GameMagicBattleFocusCharacter.MemberNumber) && (GameMagicBattleStatus == "Running")) {
				GameMagicBattleButton = [];
				for (let S = 0; S < MagicBattleAvailSpell.length; S++) {
					let B = { X: X + 50 * Zoom, Y: Y + (400 + (S * 100)) * Zoom, W: 400 * Zoom, H: 60 * Zoom };
					GameMagicBattleButton.push(B);
					DrawButton(B.X, B.Y, B.W, B.H, OnlineGameDictionaryText("Spell" + MagicBattleAvailSpell[S].toString() + "Name"), "White");
				}
			}
		}
	}

}
