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
	[], // Level 0, 1, 2, 3 & 4 tasks
	["QueryWhatIsGGTS", "QueryWhatAreYou", "ClothHeels", "ClothSocks", "ClothBarefoot", "NoTalking", "PoseKneel", "PoseStand", "PoseBehindBack", "ActivityPinch", "ActivityTickle", "ActivityPet", "RestrainLegs", "ItemArmsFuturisticCuffs", "ItemPose", "ItemRemove", "ItemUngag", "UnlockRoom"],
	["QueryWhoControl", "QueryLove", "ItemArmsFeetFuturisticCuffs", "PoseOverHead", "PoseLegsClosed", "PoseLegsOpen", "ActivityHandGag", "ActivitySpank", "UndoRuleKeepPose", "LockRoom", "ClothUpperLowerOn", "ClothUpperLowerOff"],
	["QueryCanFail", "QuerySurrender", "ClothUnderwear", "ClothNaked", "ItemMouthFuturisticBallGag", "ItemMouthFuturisticPanelGag", "NewRuleNoOrgasm", "UndoRuleNoOrgasm"],
	[]
];
var AsylumGGTSLevelTime = [0, 10800000, 18000000, 28800000, 46800000];
var AsylumGGTSPreviousPose = "";
var AsylumGGTSWordCheck = 0;

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
	if ((Level <= 0) || (Level >= 5)) return false;
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
		if (Level == 4) AsylumGGTSComputer.Stage = "3000";
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
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
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
		InventoryAdd(Player, "FuturisticPanelGag", "ItemMouth");
		InventoryAdd(Player, "FuturisticHarnessPanelGag", "ItemMouth");
		InventoryAdd(Player, "FuturisticHarnessBallGag", "ItemMouth");
		AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/ComputerGG.png";
	}
	if (Level == 4) {
		InventoryAdd(Player, "FuturisticChastityBelt", "ItemPelvis");
		InventoryAdd(Player, "FuturisticTrainingBelt", "ItemPelvis");
		InventoryAdd(Player, "FuturisticBra", "ItemBreast");
		InventoryAdd(Player, "FuturisticBra2", "ItemBreast");
		InventoryAdd(Player, "FuturisticHarness", "ItemTorso");
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
	AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/Computer.png";
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
 * Gets the new character name based on it's GGTS level
 * @param {Character} C - The character to rename
 * @returns {string} - The new name for that character
 */
function AsylumGGTSCharacterName(C) {
	let Name = C.Name;
	if ((CurrentScreen != "ChatRoom") || (ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) return Name;
	if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return Name;
	let Level = AsylumGGTSGetLevel(C);
	if ((Level >= 2) && (Level <= 2)) Name = C.Name + "-" + C.MemberNumber.toString();
	if ((Level >= 3) && (Level <= 3)) Name = C.Name + "-GG-" + C.MemberNumber.toString();
	if ((Level >= 4) && (Level <= 10)) Name = "GG-" + C.MemberNumber.toString();
	return Name;
}

/**
 * Sends a chat message from the GGTS.  GGTS slowly replaces the player name by the player number as level rises.
 * @param {string} Msg - The message to publish
 * @returns {void} - Nothing
 */
function AsylumGGTSMessage(Msg) {
	ServerSend("ChatRoomChat", { Content: "GGTS" + Msg, Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: AsylumGGTSCharacterName(Player), MemberNumber: Player.MemberNumber }] });
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
	if ((T == "ClothUnderwear") && CharacterIsInUnderwear(C) && !CharacterIsNaked(C)) return true;
	if ((T == "ClothNaked") && CharacterIsNaked(C)) return true;
	if ((T == "RestrainLegs") && ((InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return true;
	if ((T == "ItemArmsFuturisticCuffs") && ((Level != 1) || InventoryIsWorn(C, "FuturisticCuffs", "ItemArms"))) return true;
	if ((T == "ItemArmsFeetFuturisticCuffs") && InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet")) return true;
	if ((T == "ItemMouthFuturisticBallGag") && (InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth") || InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth2") || InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth3"))) return true;
	if ((T == "ItemMouthFuturisticPanelGag") && (InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth") || InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth2") || InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth3") || InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth") || InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth2") || InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth3"))) return true;
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
	if ((T.substr(0, 8) == "UndoRule") && ((C.Game.GGTS.Rule == null) || (C.Game.GGTS.Rule.indexOf(T.substr(8, 100)) < 0))) return false; // Rule cannot be removed if not active
	if ((T.substr(0, 7) == "NewRule") && (C.Game.GGTS.Rule != null) && (C.Game.GGTS.Rule.indexOf(T.substr(7, 100)) >= 0)) return false; // Rule cannot be added if already active
	if ((T.substr(0, 5) == "Cloth") && !C.CanChange()) return false; // Cloth tasks cannot be done if cannot change
	if ((T.substr(0, 4) == "Pose") && !C.CanKneel()) return false; // If cannot kneel, we skip pose change activities
	if ((T.substr(0, 8) == "Activity") && (!C.CanInteract() || (Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Inactive"))) return false; // Must allow activities
	if (((T == "ClothHeels") || (T == "ClothSocks") || (T == "ClothBarefoot")) && (InventoryGet(C, "ItemBoots") != null)) return false; // No feet tasks if locked in boots
	if ((T == "NewRuleNoOrgasm") && (Player.ArousalSettings != null) && (Player.ArousalSettings.Active != "Hybrid") && (Player.ArousalSettings.Active != "Automatic")) return false; // Orgasm rule are only available on hybrid or auto
	if ((T == "ItemPose") && !InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && !InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet")) return false;
	if ((T == "ItemRemove") && !InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && !InventoryIsWorn(C, "FuturisticArmbinder", "ItemArms") && !InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet")) return false;
	if ((T == "ItemUngag") && (
	((InventoryGet(C, "ItemMouth") == null) || (InventoryGet(C, "ItemMouth").Asset.Name.substr(0, 10) != "Futuristic")) &&
	((InventoryGet(C, "ItemMouth2") == null) || (InventoryGet(C, "ItemMouth2").Asset.Name.substr(0, 10) != "Futuristic")) &&
	((InventoryGet(C, "ItemMouth3") == null) || (InventoryGet(C, "ItemMouth3").Asset.Name.substr(0, 10) != "Futuristic")))) return false;
	if ((T == "PoseOverHead") && !C.CanInteract()) return false; // Must be able to use hands for hands poses
	if ((T == "PoseBehindBack") && !C.CanInteract()) return false; // Must be able to use hands for hands poses
	if ((T == "PoseLegsClosed") && (C.IsKneeling() || (InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return false; // Close legs only without restraints and not kneeling
	if ((T == "PoseLegsOpen") && (C.IsKneeling() || (InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return false; // Open legs only without restraints and not kneeling
	if ((T == "LockRoom") && (((ChatRoomData != null) && (ChatRoomData.Locked == true)) || !ChatRoomPlayerIsAdmin())) return false; // Can only lock/unlock if admin
	if ((T == "UnlockRoom") && (((ChatRoomData != null) && (ChatRoomData.Locked == false)) || !ChatRoomPlayerIsAdmin())) return false; // Can only lock/unlock if admin
	if ((T == "RestrainLegs") && !C.CanInteract()) return false;
	if ((T == "ItemArmsFuturisticCuffs") && !C.CanInteract()) return false;
	if ((T == "ItemArmsFeetFuturisticCuffs") && !C.CanInteract()) return false;
	if ((T == "ItemMouthFuturisticBallGag") && (!C.CanInteract() || (InventoryGet(C, "ItemMouth") != null) || (InventoryGet(C, "ItemMouth2") != null) || (InventoryGet(C, "ItemMouth3") != null))) return false;
	if ((T == "ItemMouthFuturisticPanelGag") && (!C.CanInteract() || (InventoryGet(C, "ItemMouth") != null) || (InventoryGet(C, "ItemMouth2") != null) || (InventoryGet(C, "ItemMouth3") != null))) return false;
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
 * Checks if there's a futuristic item in the group slot and remove it if it's the case
 * @param {string} Group - The group name to validate
 * @returns {void} - Nothing
 */
function AsylumGGTSTaskRemoveFuturisticItem(Group) {
	let Item = InventoryGet(Player, Group);
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name != null) && (Item.Asset.Name.substr(0, 10) == "Futuristic"))
		InventoryRemove(Player, Group);
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

	// The ItemRemove task automatically removes all futuristic arms and legs items
	if (AsylumGGTSTask == "ItemRemove") {
		AsylumGGTSTaskRemoveFuturisticItem("ItemArms");
		AsylumGGTSTaskRemoveFuturisticItem("ItemFeet");
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemUngag task automatically removes all futuristic gags
	if (AsylumGGTSTask == "ItemUngag") {
		AsylumGGTSTaskRemoveFuturisticItem("ItemMouth");
		AsylumGGTSTaskRemoveFuturisticItem("ItemMouth2");
		AsylumGGTSTaskRemoveFuturisticItem("ItemMouth3");
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// If we must enforce a new rule
	if (AsylumGGTSTask.substr(0, 7) == "NewRule") {
		AsylumGGTSAddRule(AsylumGGTSTask.substr(7, 100), false);
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
	let Level = AsylumGGTSGetLevel(Player);
	if (Level <= 1) AsylumGGTSTimer = Math.round(CommonTime() + 60000);
	if (Level == 2) AsylumGGTSTimer = Math.round(CommonTime() + 50000);
	if (Level >= 3) AsylumGGTSTimer = Math.round(CommonTime() + 40000);
	if (Level <= 0) return;
	if ((ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) return;
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike >= 3)) return;
	let TaskList = [];
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
	if (AsylumGGTSTask == "NoTalking") AsylumGGTSTimer = Math.round(CommonTime() + 60000);
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
 * @param {string} Rule - The rule name to add
 * @param {boolean} Publish - TRUE if we must publish to local chat
 * @returns {void} - Nothing
 */
function AsylumGGTSAddRule(NewRule, Publish) {
	if (Player.Game.GGTS.Rule == null) Player.Game.GGTS.Rule = [];
	if (Player.Game.GGTS.Rule.indexOf(NewRule) < 0) {
		Player.Game.GGTS.Rule.push(NewRule);
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);
		if (Publish) AsylumGGTSMessage("TaskNewRule" + NewRule);
	}
}

/**
 * Removes a rule for the player to follow, syncs with the chatroom
 * @param {string} Rule - The rule name to remove
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
		if ((Math.random() >= 0.5) && (["PoseOverHead", "PoseKneel", "PoseBehindBack", "PoseLegsClosed"].indexOf(AsylumGGTSTask) >= 0) && (AsylumGGTSGetLevel(Player) >= 2)) AsylumGGTSAddRule("KeepPose", true);
		return AsylumGGTSEndTaskSave();
	}
	if ((CommonTime() >= AsylumGGTSTimer) || (AsylumGGTSTaskFail(Player, AsylumGGTSTask))) {
		AsylumGGTSAddStrike();
		AsylumGGTSMessage(((CommonTime() >= AsylumGGTSTimer) ? "TimeOver" : "Failure") + "Strike" + Player.Game.GGTS.Strike.toString());
		return AsylumGGTSEndTaskSave();
	}
}

/**
 * Checks for forbidden words spoken by a character
 * @param {Character} C - The character to evaluate
 * @returns {boolean} - TRUE if a forbidden word was said
 */
function AsylumGGTSForbiddenWord(C) {

	// Keeps the last check time
	let LastCheck = AsylumGGTSWordCheck;
	AsylumGGTSWordCheck = CommonTime();

	// Builds the word list
	if (ChatRoomChatLog == null) return false;
	let Level = AsylumGGTSGetLevel(C);
	if (Level <= 2) return;
	let WordList = ["fuck", "shit"];
	if (Level >= 4) WordList.push("cunt", "bitch");

	// Scans the original
	for (let L = 0; L < ChatRoomChatLog.length; L++)
		if ((ChatRoomChatLog[L].SenderMemberNumber == C.MemberNumber) && (ChatRoomChatLog[L].Time > LastCheck)) {
			let Chat = ChatRoomChatLog[L].Original.trim().toLowerCase();
			for (let W = 0; W < WordList.length; W++)
				if (Chat.indexOf(WordList[W]) >= 0)
					return true;
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

	// Validates for forbidden words
	if (AsylumGGTSForbiddenWord(Player)) {
		AsylumGGTSAddStrike();
		AsylumGGTSMessage("ForbiddenWordStrike" + Player.Game.GGTS.Strike.toString());
		return AsylumGGTSEndTaskSave();
	}

	// Validates that the pose rule isn't broken
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Rule != null) && (Player.Game.GGTS.Rule.indexOf("KeepPose") >= 0) && (AsylumGGTSPreviousPose != JSON.stringify(Player.Pose)))
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
	if (Level <= 0) return false;
	if (Level <= 2) {
		if (CurrentScreen != "ChatRoom") return false;
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
 * Adds a strike to the player game info.  At strike 3, we auto-unlock the door to allow players to leave.
 * @returns {void} - Nothing
 */
function AsylumGGTSAddStrike() {
	Player.Game.GGTS.Strike++;
	if (Player.Game.GGTS.Strike > 3) Player.Game.GGTS.Strike = 3;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	if ((Player.Game.GGTS.Strike >= 3) && AsylumGGTSTaskCanBeDone(Player, "UnlockRoom")) {
		AsylumGGTSTask = "UnlockRoom";
		AsylumGGTSAutomaticTask();
	}
}

/**
 * Allows the player to start the punishment phase with a futuristic gag on
 * @returns {boolean} - Returns TRUE if the player is due for a punishment with a future gag
 */
function AsylumGGTSFuturisticGaggedPunished() {
	if (Player.Game.GGTS.Strike < 3) return false;
	if ((InventoryGet(Player, "ItemMouth") != null) && (InventoryGet(Player, "ItemMouth").Asset.Name.substr(0, 10) == "Futuristic")) return true;
	if ((InventoryGet(Player, "ItemMouth2") != null) && (InventoryGet(Player, "ItemMouth2").Asset.Name.substr(0, 10) == "Futuristic")) return true;
	if ((InventoryGet(Player, "ItemMouth3") != null) && (InventoryGet(Player, "ItemMouth3").Asset.Name.substr(0, 10) == "Futuristic")) return true;
	return false;
}

/**
 * Ungags the player
 * @returns {void} - Nothing
 */
function AsylumGGTSUngag() {
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
}

/**
 * When an orgasm starts, we check if it breaks any GGTS rule
 * @param {Character} C - The character getting the orgasm
 * @return {void} - Nothing
 */
function AsylumGGTSTOrgasm(C) {
	if ((ChatRoomSpace == null) || (ChatRoomSpace != "Asylum")) return;
	if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return;
	if ((C == null) || (C.ID != 0)) return;
	if ((Player.Game == null) || (Player.Game.GGTS == null) || (Player.Game.GGTS.Strike == null) || (Player.Game.GGTS.Strike >= 3) || (Player.Game.GGTS.Level == null) || (Player.Game.GGTS.Level < 1)) return;
	if ((Player.Game.GGTS.Rule == null) || (C.Game.GGTS.Rule.indexOf("NoOrgasm") < 0)) return;
	AsylumGGTSAddStrike();
	AsylumGGTSMessage("OrgasmStrike" + Player.Game.GGTS.Strike.toString());
	AsylumGGTSRemoveRule("NoOrgasm");
}