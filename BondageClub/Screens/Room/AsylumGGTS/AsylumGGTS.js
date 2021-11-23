"use strict";
var AsylumGGTSBackground = "AsylumGGTSRoom";
var AsylumGGTSComputer = null;
var AsylumGGTSIntroDone = false;
var AsylumGGTSTimer = 0;
var AsylumGGTSTask = null;
var AsylumGGTSLastTask = "";
var AsylumGGTSTaskStart = 0;
var AsylumGGTSTaskList = [
	[], // Level 0 tasks
	["ClothHeels", "ClothSocks", "ClothBarefoot", "QueryWhatAreYou"], // Level 1 tasks
	[], // Level 2 tasks
	[], // Level 3 tasks
	[] // Level 4 tasks
];

/**
 * Returns the character GGTS level
 * @param {Character} C - The character to evaluate
 * @returns {void} - Nothing
 */
function AsylumGGTSGetLevel(C) {
	return ((C.Game != null) && (C.Game.GGTS != null) && (C.Game.GGTS.Level != null) && (C.Game.GGTS.Level >= 1) && (C.Game.GGTS.Level <= 10)) ? C.Game.GGTS.Level : 0;
}

/**
 * Loads the GGTS and computer NPC
 * @returns {void} - Nothing
 */
function AsylumGGTSLoad() {
	AsylumGGTSIntroDone = false;
	if (AsylumGGTSComputer == null) {
		AsylumGGTSComputer = CharacterLoadNPC("NPC_AsylumGGTS_Computer");
		AsylumGGTSComputer.AllowItem = false;
		AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/Computer.png";
		AsylumGGTSComputer.Stage = "0";
		if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Level != null) && (Player.Game.GGTS.Level == 1)) AsylumGGTSComputer.Stage = "100";
	}
}

/**
 * Runs the room
 * @returns {void} - Nothing
 */
function AsylumGGTSRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(AsylumGGTSComputer, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events.  Called from CommonClick()
 * @returns {void} - Nothing
 */
function AsylumGGTSClick() {
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(AsylumGGTSComputer);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "AsylumEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * Starts a new GGTS level for the player
 * @param {number} Level - The new level to set
 * @returns {void} - Nothing
 */
function AsylumGGTSStartLevel(Level) {
	Level = parseInt(Level);
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.GGTS == null) Player.Game.GGTS = {};
	Player.Game.GGTS.Level = Level;
	Player.Game.GGTS.Time = 0;
	Player.Game.GGTS.Strike = 0;
	if (Level == 1) InventoryAdd(Player, "FuturisticCuffs", "ItemArms");
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Builds a private room online chat room for single player GGTS experience
 * @returns {void} - Nothing
 */
function AsylumGGTSBuildPrivate() {
	AsylumGGTSTimer = 0;
	AsylumGGTSTask = null;
	ChatCreateBackgroundList = BackgroundsGenerateList([BackgroundsTagAsylum]);
	ChatSearchReturnToScreen = "AsylumGGTS";
	ChatCreateLoad();
	ChatRoomPlayerCanJoin = true;
	var NewRoom = {
		Name: "GGTS" + Math.round(CurrentTime).toString() + Math.round(Math.random() * 1000).toString(),
		Description: "Private GGTS Room",
		Background: "AsylumGGTSRoom",
		Private: true,
		Locked: false,
		Space: "Asylum",
		Game: "GGTS",
		Admin: [Player.MemberNumber],
		Ban: [],
		Limit: "2",
		BlockCategory: []
	};
	ServerSend("ChatRoomCreate", NewRoom);
	DialogLeave();
}

/**
 * Sends a chat message from the GGTS.  GGTS slowly replaces the player name by the player number as level rises.
 * @param {string} Msg - The message to publish
 * @returns {void} - Nothing
 */
function AsylumGGTSMessage(Msg) {
	let Name = Player.Name;
	let Level = AsylumGGTSGetLevel(Player);
	if ((Level >= 2) && (Level <= 2)) Name = Player.Name + "-" + Player.MemberNumber.toString();
	if ((Level >= 3) && (Level <= 3)) Name = Player.Name + "-GG-" + Player.MemberNumber.toString();
	if ((Level >= 4) && (Level <= 10)) Name = "GG-" + Player.MemberNumber.toString();
	ChatRoomMessage({ Content: Msg, Type: "Action", Sender: Player.MemberNumber, Dictionary: [{Tag: "SourceCharacter", Text: Name, MemberNumber: Player.MemberNumber}] });
}

/**
 * Generates a new GGTS Task for the player and publishes it
 * @returns {void} - Nothing
 */
function AsylumGGTSSetTimer() {
	let Factor = 1;
	if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) Factor = Factor / 3;
	if (AsylumGGTSTimer == 0) Factor = Factor / 3;
	AsylumGGTSTimer = Math.round(CommonTime() + 24000 * Factor + Math.random() * 36000 * Factor);
}

/**
 * Returns TRUE if the query was answered by character number M
 * @param {number} M - The member number to evaluate
 * @param {string} T - The text to evaluate
 * @returns {boolean} - TRUE if the is done
 */
function AsylumGGTSQueryDone(M, T) {
	if (ChatRoomChatLog == null) return false;
	for (let L = 0; L < ChatRoomChatLog.length; L++)
		if ((ChatRoomChatLog[L].SenderMemberNumber == M) && (ChatRoomChatLog[L].Time >= AsylumGGTSTaskStart)) {
			let Chat = ChatRoomChatLog[L].Chat.trim().toLowerCase();
			Chat = Chat.replace(/\s/g, "");
			Chat = Chat.replace(/\./g, "");
			Chat = Chat.replace(/,/g, "");
			Chat = Chat.replace(/'/g, "");
			if (Chat === T) return true;
		}
	return false;
}

/**
 * Returns TRUE if the task T is currently done by character C
 * @param {Character} C - The character to evaluate
 * @param {string} T - The task to evaluate
 * @returns {boolean} - TRUE if the is done
 */
function AsylumGGTSTaskDone(C, T) {
	if ((T == "ClothHeels") && (InventoryGet(C, "Shoes") != null) && (InventoryGet(C, "Shoes").Asset.Name.indexOf("Heels") >= 0)) return true;
	if ((T == "ClothHeels") && (InventoryGet(C, "ItemBoots") != null) && (InventoryGet(C, "ItemBoots").Asset.Name.indexOf("Heels") >= 0)) return true;
	if ((T == "ClothSocks") && (InventoryGet(C, "Socks") != null) && (InventoryGet(C, "Shoes") == null) && (InventoryGet(C, "ItemBoots") == null)) return true;
	if ((T == "ClothBarefoot") && (InventoryGet(C, "Socks") == null) && (InventoryGet(C, "Shoes") == null) && (InventoryGet(C, "ItemBoots") == null)) return true;
	if (T == "QueryWhatAreYou") return AsylumGGTSQueryDone(C.MemberNumber, "imagoodgirl");
	return false;
}

/**
 * Returns TRUE if the task T can be done in character C predicament
 * @param {Character} C - The character to evaluate
 * @param {string} T - The task to evaluate
 * @returns {boolean} - TRUE if the task can be done
 */
function AsylumGGTSTaskCanBeDone(C, T) {
	if ((T.substr(0, 5) == "Query") && !C.CanTalk()) return false; // Query tasks cannot be done if gagged
	if ((T.substr(0, 5) == "Cloth") && !C.CanChange()) return false; // Cloth tasks cannot be done if cannot change
	if (AsylumGGTSTaskDone(C, T)) return false; // If task is already done, we do not pick it
	return true;
}

/**
 * Generates a new GGTS Task for the player and publishes it
 * @returns {void} - Nothing
 */
function AsylumGGTSNewTask() {
	AsylumGGTSTask = null;
	AsylumGGTSTimer = Math.round(CommonTime() + 60000);
	let TaskList = [];
	let Level = AsylumGGTSGetLevel(Player);
	for (let L = 0; L < AsylumGGTSTaskList.length; L++)
		for (let T = 0; T < AsylumGGTSTaskList[L].length; T++)
			TaskList.push(AsylumGGTSTaskList[L][T]);
	if (TaskList.length == 0) return;
	while (AsylumGGTSTask == null) {
		AsylumGGTSTask = CommonRandomItemFromList(AsylumGGTSLastTask, TaskList);
		if (!AsylumGGTSTaskCanBeDone(Player, AsylumGGTSTask)) AsylumGGTSTask = null;
	}
	AsylumGGTSMessage("GGTSTask" + AsylumGGTSTask);
	AsylumGGTSLastTask = AsylumGGTSTask;
	AsylumGGTSTaskStart = CommonTime();
}

/**
 * Saves the game progress after a task ended
 * @returns {void} - Nothing
 */
function AsylumGGTSEndTaskSave() {
	AsylumGGTSSetTimer();
	AsylumGGTSTask = null;
	let Factor = 1;
	if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) Factor = 3;
	Player.Game.GGTS.Time = Player.Game.GGTS.Time + (CommonTime() - AsylumGGTSTaskStart) * Factor;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Checks if the current GGTS Task is complete
 * @returns {void} - Nothing
 */
function AsylumGGTSEndTask() {
	if (AsylumGGTSTaskDone(Player, AsylumGGTSTask)) {
		AsylumGGTSMessage("GGTSTaskDone");
		return AsylumGGTSEndTaskSave();
	}
	if (CommonTime() >= AsylumGGTSTimer) {
		AsylumGGTSMessage("GGTSTimeOverStrike");
		Player.Game.GGTS.Strike++;
		return AsylumGGTSEndTaskSave();
	}
}

/**
 * Processes the GGTS AI in the chatroom
 * @returns {void} - Nothing
 */
function AsylumGGTSProcess() {
	if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return;
	if (!AsylumGGTSIntroDone) {
		AsylumGGTSTimer = 0;
		AsylumGGTSSetTimer();
		if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) AsylumGGTSMessage("GGTSIntroPrivate");
		else AsylumGGTSMessage("GGTSIntroPublic");
		AsylumGGTSIntroDone = true;
		return;
	}
	if (AsylumGGTSTimer <= 0) return AsylumGGTSSetTimer();
	if ((CommonTime() >= AsylumGGTSTimer) && (AsylumGGTSTask == null)) return AsylumGGTSNewTask();
	if (AsylumGGTSTask != null) return AsylumGGTSEndTask();
}