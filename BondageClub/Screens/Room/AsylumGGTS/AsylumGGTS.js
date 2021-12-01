"use strict";
var AsylumGGTSBackground = "AsylumGGTSRoom";
var AsylumGGTSComputer = null;
var AsylumGGTSIntroDone = false;
var AsylumGGTSTimer = 0;
var AsylumGGTSTask = null;
var AsylumGGTSLastTask = "";
var AsylumGGTSTaskStart = 0;
var AsylumGGTSTaskEnd = 0;
var AsylumGGTSTaskList = [
	[], // Level 0 tasks
	["QueryWhatIsGGTS", "QueryWhatAreYou", "ClothHeels", "ClothSocks", "ClothBarefoot", "NoTalking", "PoseKneel", "PoseStand", "PoseBehindBack", "ActivityPinch", "RestrainLegs", "ItemArmsFuturisticCuffs", "ItemPose", "ItemRemove", "UnlockRoom"], // Level 1 tasks
	["QueryWhoControl", "QueryLove", "ItemArmsFeetFuturisticCuffs", "PoseOverHead", "PoseLegsClosed", "PoseLegsOpen", "ActivityHandGag", "UndoRuleKeepPose", "LockRoom", "ClothUpperLowerOn", "ClothUpperLowerOff"], // Level 2 tasks
	["QueryCanFail", "QuerySurrender"], // Level 3 tasks
	[] // Level 4 tasks
];
var AsylumGGTSLevelTime = [0, 10800000, 18000000, 28800000, 46800000];
var AsylumGGTSPreviousPose = "";

/**
 * Returns TRUE if the player has three strikes on record
 * @returns {boolean} - TRUE if three strikes or more
 */
function AsylumGGTSHasThreeStrikes() {
	return ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike != null) && (Player.Game.GGTS.Strike >= 3));
}

/**
 * Returns TRUE if the player has completed the required time for the current level
 * @returns {boolean} - TRUE if level is completed with 3 strikes on record
 */
function AsylumGGTSLevelCompleted() {
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike != null) && (Player.Game.GGTS.Strike >= 3)) return false;
	let Level = AsylumGGTSGetLevel(Player);
	if ((Level <= 0) || (Level >= 4)) return false;
	return ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Time != null) && (Player.Game.GGTS.Time >= AsylumGGTSLevelTime[Level]));
}

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
	AsylumGGTSTask = null;
	if (AsylumGGTSComputer == null) {
		AsylumGGTSComputer = CharacterLoadNPC("NPC_AsylumGGTS_Computer");
		AsylumGGTSComputer.AllowItem = false;
		AsylumGGTSComputer.Stage = "0";
		let Level = AsylumGGTSGetLevel(Player);
		if (Level == 1) AsylumGGTSComputer.Stage = "100";
		if (Level == 2) AsylumGGTSComputer.Stage = "1000";
		if (Level == 3) AsylumGGTSComputer.Stage = "2000";
		if (Level <= 2) AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/Computer.png";
		else AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/ComputerGG.png";
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
	if (Level == 2) InventoryAdd(Player, "FuturisticAnkleCuffs", "ItemFeet");
	if (Level == 3) {
		InventoryAdd(Player, "FuturisticHarnessPanelGag", "ItemMouth");
		InventoryAdd(Player, "FuturisticHarnessBallGag", "ItemMouth");
		AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/ComputerGG.png";
	}
	if (Level >= 2) CharacterChangeMoney(Player, 100 * (Level - 1));
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Quits GGTS and deletes the player data for the game
 * @returns {void} - Nothing
 */
function AsylumGGTSQuit() {
	delete Player.Game.GGTS;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Builds a private room online chat room for single player GGTS experience
 * @returns {void} - Nothing
 */
function AsylumGGTSBuildPrivate() {
	ChatRoomSpace = "Asylum";
	AsylumGGTSTimer = 0;
	AsylumGGTSTask = null;
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
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
	ServerSend("ChatRoomChat", { Content: "GGTS" + Msg, Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Name, MemberNumber: Player.MemberNumber }] });
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
			let Chat = ChatRoomChatLog[L].Original.trim().toLowerCase();
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
	if ((C == null) || (T == null)) return false;
	let Level = AsylumGGTSGetLevel(C);
	if ((T == "ClothHeels") && (InventoryGet(C, "Shoes") != null) && (InventoryGet(C, "Shoes").Asset.Name.indexOf("Heels") >= 0)) return true;
	if ((T == "ClothHeels") && (InventoryGet(C, "ItemBoots") != null) && (InventoryGet(C, "ItemBoots").Asset.Name.indexOf("Heels") >= 0)) return true;
	if ((T == "ClothSocks") && (InventoryGet(C, "Socks") != null) && (InventoryGet(C, "Shoes") == null) && (InventoryGet(C, "ItemBoots") == null)) return true;
	if ((T == "ClothBarefoot") && (InventoryGet(C, "Socks") == null) && (InventoryGet(C, "Shoes") == null) && (InventoryGet(C, "ItemBoots") == null)) return true;
	if ((T == "ClothUpperLowerOn") && (InventoryGet(C, "Cloth") != null)) return true;
	if ((T == "ClothUpperLowerOff") && (InventoryGet(C, "Cloth") == null) && (InventoryGet(C, "ClothLower") == null)) return true;
	if ((T == "RestrainLegs") && ((InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return true;
	if ((T == "ItemArmsFuturisticCuffs") && ((Level != 1) || InventoryIsWorn(C, "FuturisticCuffs", "ItemArms"))) return true;
	if ((T == "ItemArmsFeetFuturisticCuffs") && InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet")) return true;
	if ((T == "PoseKneel") && C.IsKneeling()) return true;
	if ((T == "PoseStand") && !C.IsKneeling()) return true;
	if (T == "QueryWhatIsGGTS") return AsylumGGTSQueryDone(C.MemberNumber, "goodgirltrainingsystem");
	if (T == "QueryWhatAreYou") return AsylumGGTSQueryDone(C.MemberNumber, "imagoodgirl");
	if (T == "QueryWhoControl") return AsylumGGTSQueryDone(C.MemberNumber, "ggtsisincontrol");
	if (T == "QueryLove") return AsylumGGTSQueryDone(C.MemberNumber, "iloveggts");
	if (T == "QueryCanFail") return AsylumGGTSQueryDone(C.MemberNumber, "ggtscannotfail");
	if (T == "QuerySurrender") return AsylumGGTSQueryDone(C.MemberNumber, "isurrendertoggts");	
	if ((T == "NoTalking") && (CommonTime() >= AsylumGGTSTimer - 1000)) return true;
	if ((T == "PoseOverHead") && ((C.Pose.indexOf("Yoked") >= 0) || (C.Pose.indexOf("OverTheHead") >= 0))) return true;
	if ((T == "PoseBehindBack") && ((C.Pose.indexOf("BackBoxTie") >= 0) || (C.Pose.indexOf("BackElbowTouch") >= 0) || (C.Pose.indexOf("BackCuffs") >= 0))) return true;
	if ((T == "PoseLegsClosed") && (C.Pose.indexOf("LegsClosed") >= 0)) return true;
	if ((T == "PoseLegsOpen") && (C.Pose.indexOf("LegsClosed") < 0)) return true;
	return false;
}

/**
 * Returns TRUE if the task T can be done in character C predicament
 * @param {Character} C - The character to evaluate
 * @param {string} T - The task to evaluate
 * @returns {boolean} - TRUE if the task can be done
 */
function AsylumGGTSTaskCanBeDone(C, T) {
	if ((T.substr(0, 8) == "UndoRule") && ((C.Game.GGTS.Rule == null) || (C.Game.GGTS.Rule.indexOf(T.substr(8, 100)) < 0))) return false; // Rules cannot be removed if not active
	if ((T.substr(0, 5) == "Cloth") && !C.CanChange()) return false; // Cloth tasks cannot be done if cannot change
	if ((T.substr(0, 4) == "Pose") && !C.CanKneel()) return false; // If cannot kneel, we skip pose change activities
	if ((T.substr(0, 8) == "Activity") && (!C.CanInteract() || (Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Inactive"))) return false; // Must allow activities
	if ((T == "ItemPose") && !InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && !InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet")) return false;
	if ((T == "ItemRemove") && !InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && !InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet")) return false;
	if ((T == "PoseOverHead") && !C.CanInteract()) return false; // Must be able to use hands for hands poses
	if ((T == "PoseBehindBack") && !C.CanInteract()) return false; // Must be able to use hands for hands poses
	if ((T == "PoseLegsClosed") && (C.IsKneeling() || (InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return false; // Close legs only without restraints and not kneeling
	if ((T == "PoseLegsOpen") && (C.IsKneeling() || (InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return false; // Open legs only without restraints and not kneeling
	if ((T == "LockRoom") && (((ChatRoomData != null) && (ChatRoomData.Locked == true)) || !ChatRoomPlayerIsAdmin())) return false; // Can only lock/unlock if admin
	if ((T == "UnlockRoom") && (((ChatRoomData != null) && (ChatRoomData.Locked == false)) || !ChatRoomPlayerIsAdmin())) return false; // Can only lock/unlock if admin
	if (AsylumGGTSTaskDone(C, T)) return false; // If task is already done, we do not pick it
	return true;
}

/**
 * Returns TRUE if the task T was failed by character C
 * @param {Character} C - The character to evaluate
 * @param {string} T - The task to evaluate
 * @returns {boolean} - TRUE if the task was failed
 */
function AsylumGGTSTaskFail(C, T) {
	if (T == "NoTalking") {
		if (ChatRoomChatLog == null) return false;
		for (let L = 0; L < ChatRoomChatLog.length; L++)
			if ((ChatRoomChatLog[L].SenderMemberNumber == C.MemberNumber) && (ChatRoomChatLog[L].Time >= AsylumGGTSTaskStart))
				return true;
	}
	return false;
}

/**
 * Processes the tasks that doesn't need any player input.  GGTS does everything and ends the task automatically.
 * @returns {void} - Nothing
 */
function AsylumGGTSAutomaticTask() {
	
	// The ItemPose task automatically changes the futuristic items pose
	if (AsylumGGTSTask == "ItemPose") {
		let Refresh = false;
		let Item = InventoryGet(Player, "ItemArms");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name != null) && (Item.Asset.Name == "FuturisticCuffs")) {
			let Pose = ((Item.Property != null) && (Item.Property.SetPose != null) && (Item.Property.SetPose.length > 0)) ? Item.Property.SetPose[0] : "";
			Pose = [CommonRandomItemFromList(Pose, ["BackBoxTie", "BackElbowTouch", ""])];
			if (Pose == "") Item.Property = { SetPose: null, Difficulty: 0, Effect: [] };
			else Item.Property = { SetPose: Pose, Difficulty: 10, Effect: ["Block", "Prone"] };
			Refresh = true;
		}
		Item = InventoryGet(Player, "ItemFeet");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name != null) && (Item.Asset.Name == "FuturisticAnkleCuffs")) {
			let Pose = ((Item.Property != null) && (Item.Property.SetPose != null) && (Item.Property.SetPose.length > 0)) ? Item.Property.SetPose[0] : "";
			Pose = [CommonRandomItemFromList(Pose, ["LegsClosed", ""])];
			if (Pose == "") Item.Property = { SetPose: null, Difficulty: 0, Effect: [] };
			else Item.Property = { SetPose: Pose, Difficulty: 10, Effect: ["Freeze", "Prone"] };
			Refresh = true;
		}
		if (Refresh) {
			CharacterRefresh(Player);
			ChatRoomCharacterUpdate(Player);
		}
		return AsylumGGTSEndTaskSave();
	}

	// The ItemRemove task automatically removes all futuristic items
	if (AsylumGGTSTask == "ItemRemove") {
		let Refresh = false;
		let Item = InventoryGet(Player, "ItemArms");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name != null) && (Item.Asset.Name == "FuturisticCuffs")) {
			InventoryRemove(Player, "ItemArms");
			Refresh = true;
		}
		Item = InventoryGet(Player, "ItemFeet");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name != null) && (Item.Asset.Name == "FuturisticAnkleCuffs")) {
			InventoryRemove(Player, "ItemFeet");
			Refresh = true;
		}
		if (Refresh) ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The UndoRule tasks removes a rule set by GGTS for the player to obey
	if (AsylumGGTSTask.substr(0, 8) == "UndoRule") {
		AsylumGGTSRemoveRule(AsylumGGTSTask.substr(8, 100));
		return AsylumGGTSEndTaskSave();
	}

	// If we must lock or unlock the chat room, we send a server update room packet
	if ((AsylumGGTSTask == "LockRoom") || (AsylumGGTSTask == "UnlockRoom")) {
		var UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: ChatRoomData.Description,
			Background: ChatRoomData.Background,
			Limit: ChatRoomData.Limit.toString(),
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			BlockCategory: ChatRoomData.BlockCategory,
			Game: ChatRoomData.Game,
			Private: ChatRoomData.Private,
			Locked: (AsylumGGTSTask == "LockRoom")
		};
		ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
		return AsylumGGTSEndTaskSave();
	}

}

/**
 * Generates a new GGTS Task for the player and publishes it
 * @returns {void} - Nothing
 */
function AsylumGGTSNewTask() {
	AsylumGGTSTask = null;
	AsylumGGTSTimer = Math.round(CommonTime() + 60000);
	if (AsylumGGTSGetLevel(Player) <= 0) return;
	if ((ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) return;
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike >= 3)) return;
	let TaskList = [];
	let Level = AsylumGGTSGetLevel(Player);
	for (let L = 0; (L < AsylumGGTSTaskList.length) && (L <= Level); L++)
		for (let T = 0; T < AsylumGGTSTaskList[L].length; T++)
			TaskList.push(AsylumGGTSTaskList[L][T]);
	if (TaskList.length == 0) return;
	let Count = 0;
	while ((AsylumGGTSTask == null) && (Count < 50)) {
		AsylumGGTSTask = CommonRandomItemFromList(AsylumGGTSLastTask, TaskList);
		if (!AsylumGGTSTaskCanBeDone(Player, AsylumGGTSTask)) AsylumGGTSTask = null;
		Count++;
	}
	if ((Count >= 50) || (AsylumGGTSTask == null)) return;
	AsylumGGTSMessage("Task" + AsylumGGTSTask);
	AsylumGGTSLastTask = AsylumGGTSTask;
	AsylumGGTSTaskStart = CommonTime();
	AsylumGGTSAutomaticTask();
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
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
	let AddedTime;
	if (AsylumGGTSTaskEnd > 0) AddedTime = CommonTime() - AsylumGGTSTaskEnd;
	else AddedTime = CommonTime() - AsylumGGTSTaskStart;
	if (AddedTime < 0) AddedTime = 0;
	if (AddedTime > 120000) AddedTime = 120000;
	Player.Game.GGTS.Time = Math.round(Player.Game.GGTS.Time + (AddedTime * Factor));
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	ChatRoomCharacterUpdate(Player);
	AsylumGGTSTaskEnd = CommonTime();
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
}

/**
 * Adds a new rule for the player to follow or get strikes, syncs with the chatroom
 * @returns {void} - Nothing
 */
function AsylumGGTSAddRule(NewRule) {
	if (Player.Game.GGTS.Rule == null) Player.Game.GGTS.Rule = [];
	if (Player.Game.GGTS.Rule.indexOf(NewRule) < 0) {
		Player.Game.GGTS.Rule.push(NewRule);
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);
		AsylumGGTSMessage("Rule" + NewRule);
	}
}

/**
 * Removes a rule for the player to follow, syncs with the chatroom
 * @returns {void} - Nothing
 */
function AsylumGGTSRemoveRule(Rule) {
	if (Player.Game.GGTS.Rule == null) Player.Game.GGTS.Rule = [];
	if (Player.Game.GGTS.Rule.indexOf(Rule) >= 0) {
		Player.Game.GGTS.Rule.splice(Player.Game.GGTS.Rule.indexOf(Rule), 1);
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);
	}
}

/**
 * Checks if the current GGTS Task is complete
 * @returns {void} - Nothing
 */
function AsylumGGTSEndTask() {
	if ((ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) return;
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike >= 3)) return;
	if (AsylumGGTSTaskDone(Player, AsylumGGTSTask)) {
		AsylumGGTSMessage("TaskDone");
		if ((Math.random() >= 0.5) && (["PoseOverHead", "PoseKneel", "PoseBehindBack", "PoseLegsClosed"].indexOf(AsylumGGTSTask) >= 0) && (AsylumGGTSGetLevel(Player) >= 2)) AsylumGGTSAddRule("KeepPose");
		return AsylumGGTSEndTaskSave();
	}
	if ((CommonTime() >= AsylumGGTSTimer) || (AsylumGGTSTaskFail(Player, AsylumGGTSTask))) {
		AsylumGGTSAddStrike();
		AsylumGGTSMessage(((CommonTime() >= AsylumGGTSTimer) ? "TimeOver" : "Failure") + "Strike" + Player.Game.GGTS.Strike.toString());
		return AsylumGGTSEndTaskSave();
	}
}

/**
 * Processes the GGTS AI in the chatroom
 * @returns {void} - Nothing
 */
function AsylumGGTSProcess() {
	
	// If intro isn't done, we introduce the character and show her status
	if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return;
	if (!AsylumGGTSIntroDone) {
		AsylumGGTSTaskEnd = CommonTime();
		AsylumGGTSTimer = 0;
		AsylumGGTSSetTimer();
		if ((ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) AsylumGGTSMessage("IntroOnlyInAsylum");
		else if (AsylumGGTSGetLevel(Player) <= 0) AsylumGGTSMessage("IntroNotPlaying");
		else if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike >= 3)) AsylumGGTSMessage("IntroPendingPunishment");
		else if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) AsylumGGTSMessage("IntroPrivate");
		else AsylumGGTSMessage("IntroPublic");
		AsylumGGTSIntroDone = true;
		return;
	}

	// Validates that the pose rule isn't broken
	if ((Player.Game.GGTS.Rule != null) && (Player.Game.GGTS.Rule.indexOf("KeepPose") >= 0) && (AsylumGGTSPreviousPose != JSON.stringify(Player.Pose)))
		if (!AsylumGGTSTaskDone(Player, AsylumGGTSTask)) {
			AsylumGGTSAddStrike();
			AsylumGGTSMessage("KeepPoseStrike" + Player.Game.GGTS.Strike.toString());
			AsylumGGTSRemoveRule("KeepPose");
			return AsylumGGTSEndTaskSave();
		}

	// If the timer ticks, we prepare a new task or check to end the current task
	if (AsylumGGTSTimer <= 0) return AsylumGGTSSetTimer();
	if ((CommonTime() >= AsylumGGTSTimer) && (AsylumGGTSTask == null)) return AsylumGGTSNewTask();
	if (AsylumGGTSTask != null) return AsylumGGTSEndTask();

}

/**
 * Processes the sexual activity in GGTS
 * @param {Character} S - The character performing the activity
 * @param {Character} C - The character on which the activity is performed
 * @param {string} A - The name of the activity performed
 * @param {string} Z - The group/zone name where the activity was performed
 * @param {number} [Count=1] - If the activity is done repeatedly, this defines the number of times, the activity is done.
 * @return {void} - Nothing
 */
function AsylumGGTSActivity(S, C, A, Z, Count) {
	if ((AsylumGGTSTask == null) || (AsylumGGTSTask.substr(0, 8) != "Activity")) return;
	if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return;
	if ((S == null) || (S.ID != 0)) return;
	let Level = AsylumGGTSGetLevel(Player);
	if (Level <= 0) return;
	if (AsylumGGTSTask.substr(8, 100) === A) {
		AsylumGGTSMessage("TaskDone");
		return AsylumGGTSEndTaskSave();
	}
}

/**
 * Sets the punishment time for failing GGTS
 * @param {number} Minute - The number of minutes for the punishment
 * @returns {void} - Nothing
 */
function AsylumGGTSPunishmentTime(Minute) {
	LogAdd("Isolated", "Asylum", Math.round(CurrentTime + parseInt(Minute) * 60000));
	Player.Game.GGTS.Time = 0;
	Player.Game.GGTS.Strike = 0;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Starts the isolation punishment and go to the player room
 * @returns {void} - Nothing
 */
function AsylumGGTSStartPunishment() {
	AsylumEntranceWearPatientClothes(Player, true);
	DialogLeave();
	CommonSetScreen("Room", "AsylumBedroom");
}

/**
 * Returns TRUE if the item is controlled by GGTS, so the player should not have control.  The rules changes on level 3 and GGTS takes control throughout the asylum.
 * @returns {boolean} - TRUE if the item is controlled by GGTS
 */
function AsylumGGTSControlItem(C, Item) {
	let Level = AsylumGGTSGetLevel(C);
	if (AsylumGGTSGetLevel(Player) > Level) Level = AsylumGGTSGetLevel(Player);
	if (Level <= 2) {
		if ((ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) return false;
		if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return false;
		if ((Item == null) || (Item.Asset == null) || (Item.Asset.Name == null)) return false;
		if (Item.Asset.Name.substr(0, 10) == "Futuristic") return true;
	} else {
		if ((Item == null) || (Item.Asset == null) || (Item.Asset.Name == null)) return false;
		if (Item.Asset.Name.substr(0, 10) != "Futuristic") return false;
		if ((CurrentScreen == "ChatRoom") && (ChatRoomSpace == "Asylum")) return true;
		if (CurrentScreen.substr(0, 6) == "Asylum") return true;
	}
	return false;
}

/**
 * Adds a strike to the player game info
 * @returns {void} - Nothing
 */
function AsylumGGTSAddStrike() {
	Player.Game.GGTS.Strike++;
	if (Player.Game.GGTS.Strike > 3) Player.Game.GGTS.Strike = 3;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}