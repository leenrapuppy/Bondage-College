"use strict";
/** @type {null | string[][]} */
let OnlineGameDictionary = null;

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
				if (this.status == 200)
				{
					TranslationCache[TranslationPath] = TranslationParseTXT(this.responseText);
					OnlineGameTranslate(TranslationPath);
				}

			});
	}
}
function OnlineGameTranslate(CachePath) {
	if (!Array.isArray(TranslationCache[CachePath])) return;

	for (let T = 0; T < OnlineGameDictionary.length; T++) {
		if (OnlineGameDictionary[T][1]) {
			let indexText = TranslationCache[CachePath].indexOf(OnlineGameDictionary[T][1].trim());
			if (indexText >= 0) {
				OnlineGameDictionary[T][1] = TranslationCache[CachePath][indexText + 1];
			}
		}
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
	if ((ChatRoomGame == "LARP") && (GameLARPGetStatus() != "")) return GameLARPCharacterClick(C);
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleGetStatus() != "")) return GameMagicBattleCharacterClick(C);
	return false;
}

/**
 * Catches the chat room clicks and make sure the online game doesn't need to handle them
 * @return {*} Returns the return content of click function of the currently selected game, or false if there is no corresponding game
 */
function OnlineGameClick() {
	if ((ChatRoomGame == "LARP") && (GameLARPGetStatus() != "")) return GameLARPClickProcess();
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleGetStatus() != "")) return GameMagicBattleClickProcess();
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
	if ((ChatRoomGame == "LARP") && (GameLARPGetStatus() != "")) return false;
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleGetStatus() != "")) return false;
	return true;
}

/**
 * Checks if blocking items is currently allowed
 * @returns {boolean} - Returns TRUE if the online game allows you to block items
 */
function OnlineGameAllowBlockItems() {
	if ((ChatRoomGame == "LARP") && (GameLARPGetStatus() != "")) return false;
	if ((ChatRoomGame == "MagicBattle") && (GameMagicBattleGetStatus() != "")) return false;
	return true;
}

/**
 * Retrieves the current status of online games and stores it
 * @returns {void} - Nothing
 */
function OnlineGameLoadStatus() {
	if (ChatRoomGame == "LARP") GameLARPLoadStatus();
	if (ChatRoomGame == "MagicBattle") GameMagicBattleLoadStatus();
}

/**
 * Resets the game status if needed when the chat room data is updated
 * @returns {void} - Nothing
 */
function OnlineGameReset() {
	if (ChatRoomGame != "LARP") GameLARPReset();
	if (ChatRoomGame != "MagicBattle") GameMagicBattleReset();
	if (ChatRoomGame == "GGTS") AsylumGGTSReset();
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
	if (ChatRoomGame === "GGTS") AsylumGGTSDrawCharacter(C, X, Y, Zoom);
	if (ChatRoomGame === "LARP") GameLARPDrawCharacter(C, X, Y, Zoom);
	if (ChatRoomGame === "MagicBattle") GameMagicBattleDrawCharacter(C, X, Y, Zoom);
}
