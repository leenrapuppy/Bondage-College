"use strict";
var AsylumGGTSBackground = "AsylumGGTSRoom";
/** @type {null | NPCCharacter} */
var AsylumGGTSComputer = null;
var AsylumGGTSIntroDone = false;
var AsylumGGTSTimer = 0;
/** @type {null | string} */
var AsylumGGTSTask = null;
/** @type {null | Character} */
var AsylumGGTSTaskTarget = null;
var AsylumGGTSLastTask = "";
var AsylumGGTSTaskStart = 0;
var AsylumGGTSTaskEnd = 0;
var AsylumGGTSTaskList = [
	[], // Level 0, 1, 2, 3 & 4 tasks
	["QueryWhatIsGGTS", "QueryWhatAreYou", "ClothHeels", "ClothSocks", "ClothBarefoot", "NoTalking", "PoseKneel", "PoseStand", "PoseBehindBack", "ActivityPinch", "ActivityTickle", "ActivityPet", "ActivityNod", "RestrainLegs", "ItemArmsFuturisticCuffs", "ItemHandsFuturisticMittens", "ItemPose", "ItemRemoveLimb", "ItemRemoveBody", "ItemRemoveHead", "ItemUngag", "ItemChaste", "ItemUnchaste", "ItemIntensity", "ItemFuckMachineIntensity", "UnlockRoom", "UnlockRoom"],
	["QueryWhoControl", "QueryLove", "ItemArmsFeetFuturisticCuffs", "ItemBootsFuturisticHeels", "PoseOverHead", "PoseLegsClosed", "PoseLegsOpen", "ActivityHandGag", "ActivitySpank", "UndoRuleKeepPose", "LockRoom", "ClothUpperLowerOn", "ClothUpperLowerOff"],
	["QueryCanFail", "QuerySurrender", "ClothUnderwear", "ClothNaked", "ActivityWiggle", "ActivityCaress", "ItemMouthFuturisticBallGag", "ItemMouthFuturisticPanelGag", "ItemArmsFuturisticArmbinder", "ItemTransform", "ItemChangeGag", "NewRuleNoOrgasm", "UndoRuleNoOrgasm"],
	["QueryServeObey", "QueryFreeWill", "ActivityMasturbateHand", "ActivityKiss", "ItemPelvisFuturisticChastityBelt", "ItemPelvisFuturisticTrainingBelt", "ItemBreastFuturisticBra", "ItemBreastFuturisticBra2", "ItemTorsoFuturisticHarness"],
	["QuerySlaveWorthy", "ItemArmsFuturisticStraitjacket", "ItemHeadFuturisticMask", "ItemEarsFuturisticEarphones", "ItemNeckFuturisticCollar", "ItemEarsDeaf", "ItemMaskBlind", "ItemBeltToFuck", "ItemFuckToBelt", "ActivityBite", "ActivityLick"],
	["QueryCanFailMaster", "QueryLoveMaster", "QuerySurrenderMaster", "QueryWhoControlMaster", "QueryServeObeyMaster"]
];
var AsylumGGTSLevelTime = [0, 7200000, 10800000, 18000000, 28800000, 46800000, 75600000];
var AsylumGGTSPreviousPose = "";
var AsylumGGTSWordCheck = 0;
var AsylumGGTSSpeed = 1;

/**
 * Returns TRUE if the player has three strikes on record
 * @returns {boolean} - TRUE if three strikes or more
 */
function AsylumGGTSHasThreeStrikes() {
	return ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike != null) && (Player.Game.GGTS.Strike >= 3));
}

/**
 * Returns TRUE if the player can quit GGTS
 * @returns {boolean} - TRUE if three strikes or more or in active punishment
 */
function AsylumGGTSCanQuit() {
	return (!AsylumGGTSHasThreeStrikes() && (LogValue("Isolated", "Asylum") < CurrentTime));
}

/**
 * Check that GGTS is enabled in the current room.
 * @returns true if GGTS is running, false otherwise.
 */
function AsylumGGTSIsEnabled() {
	return (CurrentScreen === "ChatRoom") && (ChatRoomSpace === "Asylum") && (ChatRoomData != null) && (ChatRoomData.Game === "GGTS");
}

/**
 * Returns TRUE if the player has completed the required time for the current level
 * @returns {boolean} - TRUE if level is completed with 3 strikes on record
 */
function AsylumGGTSLevelCompleted() {
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike != null) && (Player.Game.GGTS.Strike >= 3)) return false;
	let Level = AsylumGGTSGetLevel(Player);
	if ((Level <= 0) || (Level >= 6)) return false;
	return ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Time != null) && (Player.Game.GGTS.Time >= AsylumGGTSLevelTime[Level]));
}

/**
 * Returns the character GGTS level
 * @param {Character} C - The character to evaluate
 * @returns {number} - Nothing
 */
function AsylumGGTSGetLevel(C) {
	return ((C != null) && (C.Game != null) && (C.Game.GGTS != null) && (C.Game.GGTS.Level != null) && (C.Game.GGTS.Level >= 1) && (C.Game.GGTS.Level <= 10)) ? C.Game.GGTS.Level : 0;
}

/**
 * Sets the computer image based on the player level
 * @param {number} Level - The player GGTS level
 * @returns {void} - Nothing
 */
function AsylumGGTSComputerImage(Level) {
	if (Level >= 6) AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/ComputerGS.png";
	else if (Level >= 5) AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/ComputerGSG.png";
	else if (Level >= 3) AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/ComputerGG.png";
	else AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/Computer.png";
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
		if (Level == 5) AsylumGGTSComputer.Stage = "4000";
		if (Level >= 6) AsylumGGTSComputer.Stage = "5000";
		if (Level >= 6) Player.Game.GGTS.Strike = 0;
		AsylumGGTSComputerImage(Level);
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
 * Adds the GGTS items based on the player level
 * @returns {void} - Nothing
 */
function AsylumGGTSSAddItems() {
	let Level = AsylumGGTSGetLevel(Player);
	if (Level >= 1) {
		InventoryAdd(Player, "FuturisticCuffs", "ItemArms");
		InventoryAdd(Player, "FuturisticMittens", "ItemHands");
	}
	if (Level >= 2) {
		InventoryAdd(Player, "FuturisticAnkleCuffs", "ItemFeet");
		InventoryAdd(Player, "FuturisticLegCuffs", "ItemLegs");
		InventoryAdd(Player, "FuturisticHeels", "ItemBoots");
		InventoryAdd(Player, "FuturisticHeels2", "ItemBoots");
	}
	if (Level >= 3) {
		InventoryAdd(Player, "FuturisticArmbinder", "ItemArms");
		InventoryAdd(Player, "FuturisticPanelGag", "ItemMouth");
		InventoryAdd(Player, "FuturisticHarnessPanelGag", "ItemMouth");
		InventoryAdd(Player, "FuturisticHarnessBallGag", "ItemMouth");
	}
	if (Level >= 4) {
		InventoryAdd(Player, "FuturisticChastityBelt", "ItemPelvis");
		InventoryAdd(Player, "FuturisticTrainingBelt", "ItemPelvis");
		InventoryAdd(Player, "FuturisticBra", "ItemBreast");
		InventoryAdd(Player, "FuturisticBra2", "ItemBreast");
		InventoryAdd(Player, "FuturisticHarness", "ItemTorso");
	}
	if (Level >= 5) {
		InventoryAdd(Player, "FuturisticCollar", "ItemNeck");
		InventoryAdd(Player, "FuturisticEarphones", "ItemEars");
		InventoryAdd(Player, "FuturisticMask", "ItemHead");
		InventoryAdd(Player, "FuturisticStraitjacket", "ItemArms");
	}
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
	AsylumGGTSSAddItems();
	AsylumGGTSComputerImage(Level);
	if (Level == 6) CharacterChangeMoney(Player, 1000);
	else if (Level >= 2) CharacterChangeMoney(Player, 100 * (Level - 1));
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Quits GGTS and deletes the player data for the game
 * @returns {void} - Nothing
 */
function AsylumGGTSQuit() {
	for (let G = 0; G < AssetGroup.length; G++)
		if (AssetGroup[G].Name.substr(0, 4) == "Item")
			AsylumGGTSTaskRemoveFuturisticItem(AssetGroup[G].Name);
	delete Player.Game.GGTS;
	if (AsylumGGTSComputer != null) AsylumGGTSComputer.FixedImage = "Screens/Room/AsylumGGTS/Computer.png";
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
function AsylumGGTSCharacterName(C, Name) {
	if ((CurrentScreen !== "ChatRoom") || (ChatRoomSpace !== "Asylum")) return Name;
	if ((ChatRoomData == null) || (ChatRoomData.Game !== "GGTS")) return Name;
	let Level = AsylumGGTSGetLevel(C);
	if (Level == 2) Name = Name + "-" + C.MemberNumber.toString();
	if (Level == 3) Name = Name + "-GG-" + C.MemberNumber.toString();
	if (Level == 4) Name = "GG-" + C.MemberNumber.toString();
	if (Level == 5) Name = "GSG-" + C.MemberNumber.toString();
	if (Level >= 6) Name = "GS-" + C.MemberNumber.toString();
	return Name;
}

/**
 * Sends a chat message from the GGTS.  GGTS slowly replaces the player name by the player number as level rises.
 * @param {string} Msg - The message to publish
 * @param {Character} [Target] - The member number of the target character
 * @returns {void} - Nothing
 */
function AsylumGGTSMessage(Msg, Target) {
	if ((Msg == "TaskDone") && (AsylumGGTSGetLevel(Player) == 5)) Msg = "TaskDoneSlaveGirl";
	if ((Msg == "TaskDone") && (AsylumGGTSGetLevel(Player) == 6)) Msg = "TaskDoneSlave";
	let Dict = [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }];
	if (Target != null) {
		Msg = Msg + "Target";
		Dict.push({ Tag: "TargetCharacter", Text: CharacterNickname(Target), MemberNumber: Target.MemberNumber });
	}
	ServerSend("ChatRoomChat", { Content: "GGTS" + Msg, Type: "Action", Dictionary: Dict });
}

/**
 * Generates a new GGTS Task for the player and publishes it
 * @returns {void} - Nothing
 */
function AsylumGGTSSetTimer() {
	let Factor = 1;
	if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) Factor = Factor / 3;
	if (AsylumGGTSTimer == 0) Factor = Factor / 3;
	AsylumGGTSTimer = Math.round(CommonTime() + 24000 * AsylumGGTSSpeed * Factor + Math.random() * 36000 * AsylumGGTSSpeed * Factor);
}

/**
 * Returns TRUE if the query was answered by character number M
 * @param {number} Level - The player GGTS level, at level 4 or more, capital letters and punctuation matters
 * @param {number} M - The member number to evaluate
 * @param {string} TextEasy - The text to evaluate
 * @param {string} TextHard - The text to evaluate
 * @returns {boolean} - TRUE if the is done
 */
function AsylumGGTSQueryDone(Level, M, TextEasy, TextHard) {
	if (ChatRoomChatLog == null) return false;
	for (let L = 0; L < ChatRoomChatLog.length; L++)
		if ((ChatRoomChatLog[L].SenderMemberNumber == M) && (ChatRoomChatLog[L].Time >= AsylumGGTSTaskStart)) {
			let Chat = ChatRoomChatLog[L].Original;
			if (Level <= 3) {
				Chat = Chat.trim().toLowerCase();
				Chat = Chat.replace(/\s/g, "");
				Chat = Chat.replace(/\./g, "");
				Chat = Chat.replace(/,/g, "");
				Chat = Chat.replace(/'/g, "");
				Chat = Chat.replace(/’/g, "");
				if (Chat === TextEasy) return true;
			} else {
				Chat = Chat.replace(/’/g, "'");
				if (Chat === TextHard) return true;
			}
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
	if ((T == "ItemHandsFuturisticMittens") && InventoryIsWorn(C, "FuturisticMittens", "ItemHands")) return true;
	if ((T == "ItemArmsFuturisticArmbinder") && InventoryIsWorn(C, "FuturisticArmbinder", "ItemArms")) return true;
	if ((T == "ItemArmsFuturisticStraitjacket") && InventoryIsWorn(C, "FuturisticStraitjacket", "ItemArms")) return true;
	if ((T == "ItemHeadFuturisticMask") && InventoryIsWorn(C, "FuturisticMask", "ItemHead")) return true;
	if ((T == "ItemEarsFuturisticEarphones") && InventoryIsWorn(C, "FuturisticEarphones", "ItemEars")) return true;
	if ((T == "ItemNeckFuturisticCollar") && InventoryIsWorn(C, "FuturisticCollar", "ItemNeck")) return true;
	if ((T == "ItemArmsFuturisticCuffs") && ((Level != 1) || InventoryIsWorn(C, "FuturisticCuffs", "ItemArms"))) return true;
	if ((T == "ItemArmsFeetFuturisticCuffs") && InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet") && InventoryIsWorn(C, "FuturisticLegCuffs", "ItemLegs")) return true;
	if ((T == "ItemBootsFuturisticHeels") && (InventoryIsWorn(C, "FuturisticHeels", "ItemBoots") || InventoryIsWorn(C, "FuturisticHeels2", "ItemBoots"))) return true;
	if ((T == "ItemMouthFuturisticBallGag") && (InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth") || InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth2") || InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth3"))) return true;
	if ((T == "ItemMouthFuturisticPanelGag") && (InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth") || InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth2") || InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth3") || InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth") || InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth2") || InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth3"))) return true;
	if ((T == "ItemPelvisFuturisticChastityBelt") && InventoryIsWorn(C, "FuturisticChastityBelt", "ItemPelvis")) return true;
	if ((T == "ItemPelvisFuturisticTrainingBelt") && InventoryIsWorn(C, "FuturisticTrainingBelt", "ItemPelvis")) return true;
	if ((T == "ItemBreastFuturisticBra") && InventoryIsWorn(C, "FuturisticBra", "ItemBreast")) return true;
	if ((T == "ItemBreastFuturisticBra2") && InventoryIsWorn(C, "FuturisticBra2", "ItemBreast")) return true;
	if ((T == "ItemTorsoFuturisticHarness") && InventoryIsWorn(C, "FuturisticHarness", "ItemTorso")) return true;
	if ((T == "PoseKneel") && C.IsKneeling()) return true;
	if ((T == "PoseStand") && !C.IsKneeling()) return true;
	if (T == "QueryWhatIsGGTS") return AsylumGGTSQueryDone(Level, C.MemberNumber, "goodgirltrainingsystem", "Good Girl Training System.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "goodgirltrainingsystem", "Good Girl Training System");
	if ((T == "QueryWhatAreYou") && (Level <= 4)) return AsylumGGTSQueryDone(Level, C.MemberNumber, "imagoodgirl", "I'm a good girl.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "iamagoodgirl", "I am a good girl.");
	if ((T == "QueryWhatAreYou") && (Level == 5)) return AsylumGGTSQueryDone(Level, C.MemberNumber, "imagoodslavegirl", "I'm a good slave girl.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "iamagoodslavegirl", "I am a good slave girl.");
	if ((T == "QueryWhatAreYou") && (Level >= 6)) return AsylumGGTSQueryDone(Level, C.MemberNumber, "imagoodslave", "I'm a good slave.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "iamagoodslave", "I am a good slave.");
	if (T == "QueryWhoControl") return AsylumGGTSQueryDone(Level, C.MemberNumber, "ggtsisincontrol", "GGTS is in control.");
	if (T == "QueryWhoControlMaster") return AsylumGGTSQueryDone(Level, C.MemberNumber, "masterggtsisincontrol", "Master GGTS is in control.");
	if (T == "QueryLove") return AsylumGGTSQueryDone(Level, C.MemberNumber, "iloveggts", "I love GGTS.");
	if (T == "QueryLoveMaster") return AsylumGGTSQueryDone(Level, C.MemberNumber, "ilovemasterggts", "I love Master GGTS.");
	if (T == "QueryCanFail") return AsylumGGTSQueryDone(Level, C.MemberNumber, "ggtscannotfail", "GGTS cannot fail.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "ggtscantfail", "GGTS can't fail.");
	if (T == "QueryCanFailMaster") return AsylumGGTSQueryDone(Level, C.MemberNumber, "masterggtscannotfail", "Master GGTS cannot fail.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "masterggtscantfail", "Master GGTS can't fail.");
	if (T == "QuerySurrender") return AsylumGGTSQueryDone(Level, C.MemberNumber, "isurrendertoggts", "I surrender to GGTS.");
	if (T == "QuerySurrenderMaster") return AsylumGGTSQueryDone(Level, C.MemberNumber, "isurrendertoggts", "I surrender to Master GGTS.");
	if (T == "QueryServeObey") return AsylumGGTSQueryDone(Level, C.MemberNumber, "iserveandobeyggts", "I serve and obey GGTS.");
	if (T == "QueryServeObeyMaster") return AsylumGGTSQueryDone(Level, C.MemberNumber, "iserveandobeymasterggts", "I serve and obey Master GGTS.");
	if (T == "QueryFreeWill") return AsylumGGTSQueryDone(Level, C.MemberNumber, "idonthavefreewill", "I don't have free will.") || AsylumGGTSQueryDone(Level, C.MemberNumber, "idonothavefreewill", "I do not have free will.");
	if (T == "QuerySlaveWorthy") return AsylumGGTSQueryDone(Level, C.MemberNumber, "istrivetobeslaveworthy", "I strive to be slave worthy.");
	if ((T == "NoTalking") && (CommonTime() >= AsylumGGTSTimer - 1000)) return true;
	if ((T == "PoseOverHead") && ((C.Pose.indexOf("Yoked") >= 0) || (C.Pose.indexOf("OverTheHead") >= 0))) return true;
	if ((T == "PoseBehindBack") && ((C.Pose.indexOf("BackBoxTie") >= 0) || (C.Pose.indexOf("BackElbowTouch") >= 0) || (C.Pose.indexOf("BackCuffs") >= 0))) return true;
	if ((T == "PoseLegsClosed") && (C.Pose.indexOf("LegsClosed") >= 0)) return true;
	if ((T == "PoseLegsOpen") && (C.Pose.indexOf("LegsClosed") < 0)) return true;
	return false;
}

/**
 * Returns TRUE if GGTS can remove an item for a body group
 * @param {Character} C - The character to evaluate
 * @param {string} Group - The body group on which to remove the item
 * @returns {boolean} - TRUE if removing the item is possible
 */
function AsylumGGTSCanRemove(C, Group) {
	let Item = InventoryGet(C, Group);
	if ((Item == null) || (Item.Asset == null) || (Item.Asset.Name == null)) return false;
	if ((Item.Asset.Name.substr(0, 10) != "Futuristic") && (Item.Asset.Name != "FuckMachine")) return false;
	if (InventoryOwnerOnlyItem(Item)) return false;
	return true;
}

/**
 * Returns TRUE if the task T can be done in character C predicament
 * @param {Character} C - The character to evaluate
 * @param {string} T - The task to evaluate
 * @returns {boolean} - TRUE if the task can be done
 */
function AsylumGGTSTaskCanBeDone(C, T) {
	if ((C.Game == null) || (C.Game.GGTS == null) || (C.Game.GGTS.Strike == null) || (C.Game.GGTS.Strike >= 3) || (C.Game.GGTS.Level == null) || (C.Game.GGTS.Level <= 0)) return false; // Must be playing GGTS without 3 strikes
	if (((T == "QueryCanFail") || (T == "QueryLove") || (T == "QuerySurrender") || (T == "QueryWhoControl") || (T == "QueryServeObey")) && (C.Game.GGTS.Level >= 6)) return false; // Some queries have the master version at level 6
	if ((T.substr(0, 8) == "UndoRule") && ((C.Game.GGTS.Rule == null) || (C.Game.GGTS.Rule.indexOf(T.substr(8, 100)) < 0))) return false; // Rule cannot be removed if not active
	if ((T.substr(0, 7) == "NewRule") && (C.Game.GGTS.Rule != null) && (C.Game.GGTS.Rule.indexOf(T.substr(7, 100)) >= 0)) return false; // Rule cannot be added if already active
	if ((T.substr(0, 5) == "Cloth") && !C.CanChangeOwnClothes()) return false; // Cloth tasks cannot be done if cannot change
	if ((T.substr(0, 4) == "Pose") && !C.CanKneel()) return false; // If cannot kneel, we skip pose change activities
	if ((T.substr(0, 8) == "Activity") && (!C.CanInteract() || !PreferenceArousalAtLeast(C, "NoMeter"))) return false; // Must allow activities and be able to interact
	if ((T == "ActivityNod") && !ActivityCanBeDone(C, "Nod", "ItemHead")) return false; // Must be able to nod to use that activity
	if (((T == "ActivityKiss") || (T == "ActivityLick") || (T == "ActivityBite")) && !C.CanTalk()) return false; // Kiss, lick & bite require being able to talk
	if (((T == "ActivityKiss") || (T == "ActivityLick") || (T == "ActivityBite")) && (Player.Effect != null) && (Player.Effect.indexOf("BlockMouth") >= 0)) return false; // Kiss, lick & bite require being able to use mouth
	if ((T == "ActivityMasturbateHand") && C.IsVulvaChaste()) return false; // Cannot masturbate if chaste
	if ((T == "ActivityMasturbateHand") && InventoryIsWorn(C, "FuckMachine", "ItemDevices")) return false; // Cannot masturbate if wearing the fuck machine
	if (((T == "ClothHeels") || (T == "ClothSocks") || (T == "ClothBarefoot")) && (InventoryGet(C, "ItemBoots") != null)) return false; // No feet tasks if locked in boots
	if ((T == "NewRuleNoOrgasm") && !PreferenceArousalAtLeast(C, "Hybrid")) return false; // Orgasm rule are only available on hybrid or auto
	if (((T == "ItemRemoveLimb") || (T == "ItemRemoveBody") || (T == "ItemRemoveHead") || (T == "ItemUngag") || (T == "ItemUnchaste")) && (LogValue("Isolated", "Asylum") >= CurrentTime)) return false; // When punishment is active, items doesn't get removed
	if (((T == "ItemRemoveLimb") || (T == "ItemRemoveBody") || (T == "ItemRemoveHead") || (T == "ItemUngag") || (T == "ItemUnchaste")) && (Math.random() * 6 < AsylumGGTSGetLevel(C))) return false; // The higher the level, the less likely GGTS will release
	if ((T == "ItemPose") && !InventoryIsWorn(C, "FuturisticCuffs", "ItemArms") && !InventoryIsWorn(C, "FuturisticStraitjacket", "ItemArms") && !InventoryIsWorn(C, "FuturisticAnkleCuffs", "ItemFeet") && !InventoryIsWorn(C, "FuturisticLegCuffs", "ItemLegs")) return false;
	if ((T == "ItemRemoveLimb") && !AsylumGGTSCanRemove(C, "ItemHands") && !AsylumGGTSCanRemove(C, "ItemArms") && !AsylumGGTSCanRemove(C, "ItemFeet") && !AsylumGGTSCanRemove(C, "ItemLegs") && !AsylumGGTSCanRemove(C, "ItemBoots")) return false;
	if ((T == "ItemRemoveBody") && !AsylumGGTSCanRemove(C, "ItemPelvis") && !AsylumGGTSCanRemove(C, "ItemBreast") && !AsylumGGTSCanRemove(C, "ItemTorso") && !AsylumGGTSCanRemove(C, "ItemDevices")) return false;
	if ((T == "ItemRemoveHead") && !AsylumGGTSCanRemove(C, "ItemNeck") && !AsylumGGTSCanRemove(C, "ItemHead") && !AsylumGGTSCanRemove(C, "ItemEars")) return false;
	if ((T == "ItemUngag") && (
		((InventoryGet(C, "ItemMouth") == null) || (InventoryGet(C, "ItemMouth").Asset.Name.substr(0, 10) != "Futuristic")) &&
	((InventoryGet(C, "ItemMouth2") == null) || (InventoryGet(C, "ItemMouth2").Asset.Name.substr(0, 10) != "Futuristic")) &&
	((InventoryGet(C, "ItemMouth3") == null) || (InventoryGet(C, "ItemMouth3").Asset.Name.substr(0, 10) != "Futuristic")))) return false;
	if ((T == "ItemChaste") && (!InventoryIsWorn(C, "FuturisticChastityBelt", "ItemPelvis") || C.IsVulvaChaste())) return false; // Must have unchaste futuristic belt to chaste it
	if ((T == "ItemUnchaste") && (!InventoryIsWorn(C, "FuturisticChastityBelt", "ItemPelvis") || !C.IsVulvaChaste())) return false; // Must have chaste futuristic belt to unchaste it
	if ((T == "ItemIntensity") && !InventoryIsWorn(C, "FuturisticTrainingBelt", "ItemPelvis")) return false; // Must have training belt to change intensity
	if ((T == "ItemBeltToFuck") && !InventoryIsWorn(C, "FuturisticTrainingBelt", "ItemPelvis")) return false; // Must have training belt to change to fuck machine
	if ((T == "ItemFuckToBelt") && !InventoryIsWorn(C, "FuckMachine", "ItemDevices")) return false; // Must have fuck machine to change to training belt
	if ((T == "ItemFuckMachineIntensity") && !InventoryIsWorn(C, "FuckMachine", "ItemDevices")) return false; // Must have training belt to change intensity
	if ((T == "ItemEarsDeaf") && !InventoryIsWorn(C, "FuturisticEarphones", "ItemEars")) return false; // Must have headphones to change deaf level
	if ((T == "ItemMaskBlind") && !InventoryIsWorn(C, "FuturisticMask", "ItemHead")) return false; // Must have mask to change blind level
	if ((T == "ItemTransform")
		&& !InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth") && !InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth2") && !InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth3")
		&& !InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth") && !InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth2") && !InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth3")
		&& !InventoryIsWorn(C, "FuturisticArmbinder", "ItemArms") && !InventoryIsWorn(C, "FuturisticStraitjacket", "ItemArms") && !InventoryIsWorn(C, "FuturisticCuffs", "ItemArms")
	) return false; // Must be wearing an item that can be transformed
	if ((T == "ItemChangeGag")
		&& !InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth") && !InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth2") && !InventoryIsWorn(C, "FuturisticPanelGag", "ItemMouth3")
		&& !InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth") && !InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth2") && !InventoryIsWorn(C, "FuturisticHarnessBallGag", "ItemMouth3")
		&& !InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth") && !InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth2") && !InventoryIsWorn(C, "FuturisticHarnessPanelGag", "ItemMouth3")
	) return false; // Must be wearing a harness or panel gag
	if ((T == "PoseOverHead") && !C.CanInteract()) return false; // Must be able to use hands for hands poses
	if ((T == "PoseBehindBack") && !C.CanInteract()) return false; // Must be able to use hands for hands poses
	if ((T == "PoseLegsClosed") && (C.IsKneeling() || (InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return false; // Close legs only without restraints and not kneeling
	if ((T == "PoseLegsOpen") && (C.IsKneeling() || (InventoryGet(C, "ItemLegs") != null) || (InventoryGet(C, "ItemFeet") != null))) return false; // Open legs only without restraints and not kneeling
	if ((T == "LockRoom") && (((ChatRoomData != null) && (ChatRoomData.Locked == true)) || !ChatRoomPlayerIsAdmin())) return false; // Can only lock/unlock if admin
	if ((T == "UnlockRoom") && (((ChatRoomData != null) && (ChatRoomData.Locked == false)) || !ChatRoomPlayerIsAdmin())) return false; // Can only lock/unlock if admin
	if ((T == "RestrainLegs") && !C.CanInteract()) return false; // To restrain own legs, must be able to interact
	if ((T == "RestrainLegs") && InventoryIsWorn(C, "FuckMachine", "ItemDevices")) return false; // Cannot restrain own legs if wearing the fuck machine
	if ((T.substr(0, 4) == "Item") && (T.length >= 15) && !C.CanInteract()) return false; // To use an item, must be able to interact
	if ((T == "ItemHandsFuturisticMittens") && ((InventoryGet(C, "ItemHands") != null) || InventoryGroupIsBlocked(C, "ItemHands"))) return false;
	if ((T == "ItemHeadFuturisticMask") && ((InventoryGet(C, "ItemHead") != null) || InventoryGroupIsBlocked(C, "ItemHead"))) return false;
	if ((T == "ItemEarsFuturisticEarphones") && ((InventoryGet(C, "ItemEars") != null) || InventoryGroupIsBlocked(C, "ItemEars"))) return false;
	if ((T == "ItemNeckFuturisticCollar") && ((InventoryGet(C, "ItemNeck") != null) || InventoryGroupIsBlocked(C, "ItemNeck"))) return false;
	if ((T == "ItemArmsFuturisticArmbinder") && ((InventoryGet(C, "ItemArms") != null) || InventoryGroupIsBlocked(C, "ItemArms"))) return false;
	if ((T == "ItemArmsFuturisticArmbinder") && (C.ID == 0) && (SkillGetLevel(Player, "SelfBondage") < 6)) return false;
	if ((T == "ItemArmsFuturisticStraitjacket") && ((InventoryGet(C, "ItemArms") != null) || InventoryGroupIsBlocked(C, "ItemArms"))) return false;
	if ((T == "ItemArmsFuturisticStraitjacket") && (C.ID == 0) && (SkillGetLevel(Player, "SelfBondage") < 4)) return false;
	if ((T == "ItemArmsFuturisticCuffs") && ((InventoryGet(C, "ItemArms") != null) || InventoryGroupIsBlocked(C, "ItemArms"))) return false;
	if ((T == "ItemArmsFeetFuturisticCuffs") && ((InventoryGet(C, "ItemArms") != null) || (InventoryGet(C, "ItemFeet") != null) || (InventoryGet(C, "ItemLegs") != null))) return false;
	if ((T == "ItemArmsFeetFuturisticCuffs") && (InventoryGroupIsBlocked(C, "ItemArms") || InventoryGroupIsBlocked(C, "ItemFeet") || InventoryGroupIsBlocked(C, "ItemLegs"))) return false;
	if ((T == "ItemBootsFuturisticHeels") && ((InventoryGet(C, "ItemBoots") != null) || InventoryGroupIsBlocked(C, "ItemBoots"))) return false;
	if ((T == "ItemMouthFuturisticBallGag") && ((InventoryGet(C, "ItemMouth") != null) || (InventoryGet(C, "ItemMouth2") != null) || (InventoryGet(C, "ItemMouth3") != null) || InventoryGroupIsBlocked(C, "ItemMouth"))) return false;
	if ((T == "ItemMouthFuturisticPanelGag") && ((InventoryGet(C, "ItemMouth") != null) || (InventoryGet(C, "ItemMouth2") != null) || (InventoryGet(C, "ItemMouth3") != null) || InventoryGroupIsBlocked(C, "ItemMouth"))) return false;
	if ((T == "ItemPelvisFuturisticChastityBelt") && ((InventoryGet(C, "ClothLower") != null) || (InventoryGet(C, "ItemPelvis") != null) || InventoryGroupIsBlocked(C, "ItemPelvis"))) return false;
	if ((T == "ItemPelvisFuturisticTrainingBelt") && ((InventoryGet(C, "ClothLower") != null) || (InventoryGet(C, "ItemPelvis") != null) || (InventoryGet(C, "ItemVulva") != null) || (InventoryGet(C, "ItemVulvaPiercings") != null) || (InventoryGet(C, "ItemButt") != null) || InventoryGroupIsBlocked(C, "ItemPelvis"))) return false;
	if ((T == "ItemBreastFuturisticBra") && ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ItemBreast") != null) || InventoryGroupIsBlocked(C, "ItemBreast"))) return false;
	if ((T == "ItemBreastFuturisticBra2") && ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ItemBreast") != null) || InventoryGroupIsBlocked(C, "ItemBreast"))) return false;
	if ((T == "ItemTorsoFuturisticHarness") && ((InventoryGet(C, "Cloth") != null) || (InventoryGet(C, "ItemTorso") != null) || InventoryGroupIsBlocked(C, "ItemTorso"))) return false;
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
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name != null) && !InventoryOwnerOnlyItem(Item))
		if ((Item.Asset.Name.substr(0, 10) == "Futuristic") || (Item.Asset.Name == "FuckMachine"))
			InventoryRemove(Player, Group);
}

/**
 * Transforms a ballgag to a panelgag for the specified group
 * @param {string} Group - The group name to transform
 * @returns {void} - Nothing
 */
function AsylumGGTSTransformGag(Group) {
	let Item = InventoryGet(Player, Group);
	if ((Item != null) && (Item.Asset != null) && ((Item.Asset.Name === "FuturisticHarnessBallGag") || (Item.Asset.Name === "FuturisticPanelGag")))
		InventoryWear(Player, (Item.Asset.Name === "FuturisticHarnessBallGag") ? "FuturisticPanelGag" : "FuturisticHarnessBallGag", Group, null, 10);
}

/**
 * Changes the inflation setting on the ballgag or panelgag
 * @param {string} Group - The group name to transform
 * @returns {void} - Nothing
 */
function AsylumGGTSConfigureGag(Group) {
	let Item = InventoryGet(Player, Group);
	//Do nothing if the slot is empty or not a configurable futuristic gag
	if((Item == null) || (Item.Asset == null) || !((Item.Asset.Name === "FuturisticHarnessBallGag") || (Item.Asset.Name === "FuturisticPanelGag") || (Item.Asset.Name === "FuturisticHarnessPanelGag"))){
		return;
	}

	let Type = (Item.Property.Type == null) ? "" : Item.Property.Type;
	if (Item.Asset.Name === "FuturisticHarnessBallGag"){
		Type = CommonRandomItemFromList(Type, ["", "Ball", "Plug"]);
	}
	else if ((Item.Asset.Name === "FuturisticPanelGag") || (Item.Asset.Name === "FuturisticHarnessPanelGag")){
		Type = CommonRandomItemFromList(Type, ["", "LightBall", "Ball", "Plug"]);
	}

	if(Type === ""){
		Item.Property.Effect = ['BlockMouth', 'GagLight'];
		Item.Color = ['#50913C', 'Default'];
	}
	else if(Type === "LightBall") {
		Item.Property.Effect = ['BlockMouth', 'GagVeryLight'];
		Item.Color = ['#80713C', 'Default'];
	}
	else if(Type === "Ball"){
		Item.Property.Effect = ['BlockMouth', 'GagMedium'];
		Item.Color = ['#B0513C', 'Default'];
	}
	else if(Type === "Plug"){
		Item.Property.Effect = ['BlockMouth', 'GagTotal'];
		Item.Color = ['#E0313C', 'Default'];
	}
	Item.Property.Type = (Type == "") ? null : Type;
}

/**
 * Processes the tasks that doesn't need any player input.	GGTS does everything and ends the task automatically.
 * @returns {void} - Nothing
 */
function AsylumGGTSAutomaticTask() {

	// The ItemPose task automatically changes the futuristic items pose
	if (AsylumGGTSTask == "ItemPose") {
		let Item = InventoryGet(Player, "ItemArms");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name === "FuturisticCuffs")) {
			let Pose = ((Item.Property != null) && (Item.Property.SetPose != null) && (Item.Property.SetPose.length > 0)) ? Item.Property.SetPose[0] : "";
			Pose = [CommonRandomItemFromList(Pose, ["BackBoxTie", "BackElbowTouch", ""])];
			if (Pose == "") Item.Property = { SetPose: null, Difficulty: 0, Effect: [] };
			else Item.Property = { SetPose: Pose, Difficulty: 10, Effect: ["Block", "Prone"] };
		}
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name === "FuturisticStraitjacket")) {
			if (Item.Property == null) Item.Property = {};
			if (Item.Property.Type === "cl0co0np0vp0a1") Item.Property.Type = "cl0co0np0vp0a0";
			else Item.Property.Type = "cl0co0np0vp0a1";
		}
		Item = InventoryGet(Player, "ItemFeet");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name === "FuturisticAnkleCuffs")) {
			let Pose = ((Item.Property != null) && (Item.Property.SetPose != null) && (Item.Property.SetPose.length > 0)) ? Item.Property.SetPose[0] : "";
			Pose = [CommonRandomItemFromList(Pose, ["LegsClosed", ""])];
			if (Pose == "") Item.Property = { SetPose: null, Difficulty: 0, Effect: [] };
			else Item.Property = { SetPose: Pose, Difficulty: 10, Effect: ["Freeze", "Prone"] };
		}
		Item = InventoryGet(Player, "ItemLegs");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name === "FuturisticLegCuffs")) {
			let Pose = ((Item.Property != null) && (Item.Property.SetPose != null) && (Item.Property.SetPose.length > 0)) ? Item.Property.SetPose[0] : "";
			Pose = [CommonRandomItemFromList(Pose, ["LegsClosed", ""])];
			if (Pose == "") Item.Property = { SetPose: null, Difficulty: 0, Effect: [] };
			else Item.Property = { SetPose: Pose, Difficulty: 10, Effect: ["Prone", "KneelFreeze", "Slow"] };
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemRemoveLimb task automatically removes all futuristic arms and legs items
	if (AsylumGGTSTask == "ItemRemoveLimb") {
		AsylumGGTSTaskRemoveFuturisticItem("ItemHands");
		AsylumGGTSTaskRemoveFuturisticItem("ItemArms");
		AsylumGGTSTaskRemoveFuturisticItem("ItemLegs");
		AsylumGGTSTaskRemoveFuturisticItem("ItemFeet");
		AsylumGGTSTaskRemoveFuturisticItem("ItemBoots");
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemRemoveBody task automatically removes all futuristic bra, belt and harness
	if (AsylumGGTSTask == "ItemRemoveBody") {
		AsylumGGTSTaskRemoveFuturisticItem("ItemPelvis");
		AsylumGGTSTaskRemoveFuturisticItem("ItemTorso");
		AsylumGGTSTaskRemoveFuturisticItem("ItemBreast");
		AsylumGGTSTaskRemoveFuturisticItem("ItemDevices");
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemRemoveHead task automatically removes all futuristic collar, mask and ear items
	if (AsylumGGTSTask == "ItemRemoveHead") {
		AsylumGGTSTaskRemoveFuturisticItem("ItemEars");
		AsylumGGTSTaskRemoveFuturisticItem("ItemNeck");
		AsylumGGTSTaskRemoveFuturisticItem("ItemHead");
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

	// The ItemChaste task automatically chasten the belt
	if (AsylumGGTSTask == "ItemChaste") {
		let Item = InventoryGet(Player, "ItemPelvis");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuturisticChastityBelt")) {
			if (Item.Property == null) Item.Property = {};
			Item.Property.Block = ["ItemVulva", "ItemVulvaPiercings", "ItemButt"];
			Item.Property.Effect = ["UseRemote", "Chaste"];
			Item.Property.Type = "m0f1b1t0o0";
			Item.Color = ["#D06060", "#803030", "Default", "Default", "Default", "Default", "#222222", "Default"];
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemUnchaste task automatically unchasten the belt
	if (AsylumGGTSTask == "ItemUnchaste") {
		let Item = InventoryGet(Player, "ItemPelvis");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuturisticChastityBelt")) {
			if (Item.Property == null) Item.Property = {};
			Item.Property.Block = [];
			Item.Property.Effect = ["UseRemote"];
			Item.Property.Type = "m0f0b0t0o0";
			Item.Color = ["#93C48C", "#3B7F2C", "Default", "Default", "Default", "Default", "#222222", "Default"];
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemIntensity task automatically changes the belt vibration intensity
	if (AsylumGGTSTask == "ItemIntensity") {
		let Item = InventoryGet(Player, "ItemPelvis");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuturisticTrainingBelt")) {
			if (Item.Property == null) Item.Property = {};
			Item.Property.Block = ["ItemVulva", "ItemVulvaPiercings", "ItemButt"];
			Item.Property.Effect = ["Vibrating", "Egged", "UseRemote"];
			let Intensity = Item.Property.Intensity;
			while ((Item.Property.Intensity == null) || (Item.Property.Intensity == Intensity))
				Item.Property.Intensity = Math.floor(Math.random() * 5) - 1;
			if (Item.Property.Intensity == -1) Item.Color = ["#3B7F2C", "#93C48C", "#93C48C", "Default", "Default", "Default"];
			if (Item.Property.Intensity == 0) Item.Color = ["#4F7F2C", "#A3C48C", "#A3C48C", "Default", "Default", "Default"];
			if (Item.Property.Intensity == 1) Item.Color = ["#6F6F2C", "#AFAF8C", "#AFAF8C", "Default", "Default", "Default"];
			if (Item.Property.Intensity == 2) Item.Color = ["#7F4F2C", "#C4A38C", "#C4A38C", "Default", "Default", "Default"];
			if (Item.Property.Intensity == 3) Item.Color = ["#7F2C2C", "#C48C8C", "#C48C8C", "Default", "Default", "Default"];
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemEarsDeaf task automatically changes the deaf level of the headphones
	if (AsylumGGTSTask == "ItemEarsDeaf") {
		let Item = InventoryGet(Player, "ItemEars");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuturisticEarphones")) {
			if (Item.Property == null) Item.Property = {};
			let Type = (Item.Property.Type == null) ? "" : Item.Property.Type;
			Type = CommonRandomItemFromList(Type, ["Light", "Heavy", "NoiseCancelling", ""]);
			if (Type == "") Item.Property.Effect = [];
			if (Type == "Light") Item.Property.Effect = ["DeafLight"];
			if (Type == "Heavy") Item.Property.Effect = ["DeafHeavy"];
			if (Type == "NoiseCancelling") Item.Property.Effect = ["DeafTotal"];
			if (Type == "") Item.Color = ["Default", "#50913C", "Default"];
			if (Type == "Light") Item.Color = ["Default", "#80713C", "Default"];
			if (Type == "Heavy") Item.Color = ["Default", "#B0513C", "Default"];
			if (Type == "NoiseCancelling") Item.Color = ["Default", "#E0313C", "Default"];
			Item.Property.Type = (Type == "") ? null : Type;
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemMaskBlind task automatically changes the deaf level of the headphones
	if (AsylumGGTSTask == "ItemMaskBlind") {
		let Item = InventoryGet(Player, "ItemHead");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuturisticMask")) {
			if (Item.Property == null) Item.Property = {};
			let Type = (Item.Property.Type == null) ? "" : Item.Property.Type;
			Type = CommonRandomItemFromList(Type, ["LightTint", "HeavyTint", "Blind", ""]);
			if (Type == "") Item.Property.Effect = [];
			if (Type == "LightTint") Item.Property.Effect = ["BlindLight", "Prone"];
			if (Type == "HeavyTint") Item.Property.Effect = ["BlindNormal", "Prone"];
			if (Type == "Blind") Item.Property.Effect = ["BlindHeavy", "Prone"];
			Item.Property.Type = (Type == "") ? null : Type;
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemFuckMachineIntensity task automatically changes the speed of the fuck machine
	if (AsylumGGTSTask == "ItemFuckMachineIntensity") {
		let Item = InventoryGet(Player, "ItemDevices");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuckMachine")) {
			if (Item.Property == null) Item.Property = {};
			let Intensity = Item.Property.Intensity;
			while ((Item.Property.Intensity == null) || (Item.Property.Intensity == Intensity))
				Item.Property.Intensity = Math.floor(Math.random() * 5) - 1;
			if (Item.Property.Intensity == -1) Item.Property.Mode = "Off";
			if (Item.Property.Intensity == 0) Item.Property.Mode = "Low";
			if (Item.Property.Intensity == 1) Item.Property.Mode = "Medium";
			if (Item.Property.Intensity == 2) Item.Property.Mode = "High";
			if (Item.Property.Intensity == 3) Item.Property.Mode = "Maximum";
			Item.Property.Effect = (Item.Property.Intensity >= 0) ? ["Egged"] : ["Vibrating", "Egged"];
		}
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemTransform task automatically changes the restraint types
	if (AsylumGGTSTask == "ItemTransform") {
		let Item = InventoryGet(Player, "ItemArms");
		if ((Item != null) && (Item.Asset != null) && ((Item.Asset.Name === "FuturisticCuffs") || (Item.Asset.Name === "FuturisticArmbinder") || (Item.Asset.Name === "FuturisticStraitjacket"))) {
			let List = [];
			if (Item.Asset.Name !== "FuturisticCuffs") List.push("FuturisticCuffs");
			if (Item.Asset.Name !== "FuturisticArmbinder") List.push("FuturisticArmbinder");
			if ((Item.Asset.Name !== "FuturisticStraitjacket") && (AsylumGGTSGetLevel(Player) >= 5)) List.push("FuturisticStraitjacket");
			InventoryWear(Player, CommonRandomItemFromList("", List), "ItemArms", null, 10);
		}
		AsylumGGTSTransformGag("ItemMouth");
		AsylumGGTSTransformGag("ItemMouth2");
		AsylumGGTSTransformGag("ItemMouth3");
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	if (AsylumGGTSTask == "ItemChangeGag"){
		AsylumGGTSConfigureGag("ItemMouth");
		AsylumGGTSConfigureGag("ItemMouth2");
		AsylumGGTSConfigureGag("ItemMouth3");
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemBeltToFuck task automatically remove the training belt and adds the fuck machine
	if (AsylumGGTSTask == "ItemBeltToFuck") {
		let Item = InventoryGet(Player, "ItemPelvis");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuturisticTrainingBelt")) {
			InventoryRemove(Player, "ItemPelvis");
			InventoryWear(Player, "FuckMachine", "ItemDevices", null, 150);
		}
		ChatRoomCharacterUpdate(Player);
		return AsylumGGTSEndTaskSave();
	}

	// The ItemFuckToBelt task automatically remove the fuck machine and adds the training belt
	if (AsylumGGTSTask == "ItemFuckToBelt") {
		let Item = InventoryGet(Player, "ItemDevices");
		if ((Item != null) && (Item.Asset != null) && (Item.Asset.Name == "FuckMachine")) {
			InventoryRemove(Player, "ItemDevices");
			InventoryWear(Player, "FuturisticTrainingBelt", "ItemPelvis", null, 10);
		}
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
			Language: ChatCreateLanguage,
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
 * In a public room, some GGTS tasks can target another valid player.  Patients will do physical activities, nurses will restraint.
 * @param {string} T - The task to evaluate
 * @returns {Character} - The target character
 */
function AsylumGGTSFindTaskTarget(T) {

	// Only in public GGTS when there's at least another character and the player isn't blind
	if ((ChatSearchReturnToScreen == "AsylumGGTS") || (ChatRoomCharacter.length <= 1) || Player.IsBlind()) return null;

	// Nurses can use items on other players with less reputation or herself
	if ((ReputationGet("Asylum") > 0) && (T.substr(0, 4) == "Item") && (T.length >= 15)) {
		let Target = null;
		let TargetOdds = -1;
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if ((ChatRoomCharacter[C].MemberNumber == Player.MemberNumber) || (ServerChatRoomGetAllowItem(Player, ChatRoomCharacter[C]) && (ReputationCharacterGet(ChatRoomCharacter[C], "Asylum") <= ReputationGet("Asylum")) && AsylumGGTSTaskCanBeDone(ChatRoomCharacter[C], T) && (AsylumGGTSGetLevel(ChatRoomCharacter[C]) >= 1) && ((ChatRoomCharacter[C].Game.GGTS.Rule == null) || (ChatRoomCharacter[C].Game.GGTS.Rule.indexOf("KeepPose") < 0)))) {
				let Odds = Math.random();
				if (Odds > TargetOdds) {
					Target = ChatRoomCharacter[C];
					TargetOdds = Odds;
				}
			}
		return (Player.MemberNumber == Target.MemberNumber) ? null : Target;
	}

	// Patients can use activities on other patients or herself
	if ((ReputationGet("Asylum") < 0) && (T.substr(0, 8) == "Activity") && (T != "ActivityWiggle") && (T != "ActivityNod")) {
		let Target = null;
		let TargetOdds = -1;
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if ((ChatRoomCharacter[C].MemberNumber == Player.MemberNumber) || (ServerChatRoomGetAllowItem(Player, ChatRoomCharacter[C]) && (ReputationCharacterGet(ChatRoomCharacter[C], "Asylum") <= -1) && AsylumGGTSTaskCanBeDone(ChatRoomCharacter[C], T) && (AsylumGGTSGetLevel(ChatRoomCharacter[C]) >= 1))) {
				let Odds = Math.random();
				if (Odds > TargetOdds) {
					Target = ChatRoomCharacter[C];
					TargetOdds = Odds;
				}
			}
		return (Player.MemberNumber == Target.MemberNumber) ? null : Target;
	}

	// No target found
	return null;

}

/**
 * Generates a new GGTS Task for the player and publishes it
 * @returns {void} - Nothing
 */
function AsylumGGTSNewTask() {
	AsylumGGTSTask = null;
	let Level = AsylumGGTSGetLevel(Player);
	if (Level <= 1) AsylumGGTSTimer = Math.round(CommonTime() + 60000 * AsylumGGTSSpeed);
	if (Level == 2) AsylumGGTSTimer = Math.round(CommonTime() + 56000 * AsylumGGTSSpeed);
	if (Level == 3) AsylumGGTSTimer = Math.round(CommonTime() + 52000 * AsylumGGTSSpeed);
	if (Level == 4) AsylumGGTSTimer = Math.round(CommonTime() + 48000 * AsylumGGTSSpeed);
	if (Level == 5) AsylumGGTSTimer = Math.round(CommonTime() + 44000 * AsylumGGTSSpeed);
	if (Level >= 6) AsylumGGTSTimer = Math.round(CommonTime() + 40000 * AsylumGGTSSpeed);
	if (Level <= 0) return;
	if (ChatRoomSpace !== "Asylum") return;
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
	AsylumGGTSTaskTarget = AsylumGGTSFindTaskTarget(AsylumGGTSTask);
	AsylumGGTSMessage("Task" + AsylumGGTSTask, AsylumGGTSTaskTarget);
	AsylumGGTSLastTask = AsylumGGTSTask;
	AsylumGGTSTaskStart = CommonTime();
	AsylumGGTSAutomaticTask();
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
}

/**
 * Saves the game progress after a task ended
 * @param {boolean} [Fail=false] - If the task was failed, we don't add bonus time
 * @returns {void} - Nothing
 */
function AsylumGGTSEndTaskSave(Fail) {
	AsylumGGTSSetTimer();
	AsylumGGTSTask = null;
	if ((Fail == null) || (Fail == false)) {
		let Factor = 1;
		if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS") && (ChatRoomCharacter.length <= 1)) Factor = 3;
		let AddedTime;
		if (AsylumGGTSTaskEnd > 0) AddedTime = CommonTime() - AsylumGGTSTaskEnd;
		else AddedTime = CommonTime() - AsylumGGTSTaskStart;
		let ForceGGTS = LogValue("ForceGGTS", "Asylum");
		if ((ForceGGTS != null) && (ForceGGTS > 0)) {
			if (ForceGGTS > AddedTime)
				LogAdd("ForceGGTS", "Asylum", ForceGGTS - AddedTime);
			else
				LogDelete("ForceGGTS", "Asylum");
		}
		if (AsylumGGTSTimer > CommonTime()) AddedTime = AddedTime + AsylumGGTSTimer - CommonTime();
		if (AddedTime < 0) AddedTime = 0;
		if (AddedTime > 120000) AddedTime = 120000;
		AddedTime = AddedTime * Factor * CheatFactor("DoubleGGTSTime", 2);
		Player.Game.GGTS.Time = Math.round(Player.Game.GGTS.Time + AddedTime);
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	}
	ChatRoomCharacterUpdate(Player);
	AsylumGGTSTaskEnd = CommonTime();
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
}

/**
 * Adds a new rule for the player to follow or get strikes, syncs with the chatroom
 * @param {string} NewRule - The rule name to add
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
	if (ChatRoomSpace !== "Asylum") return;
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike >= 3)) return;
	if (AsylumGGTSTaskDone((AsylumGGTSTaskTarget == null) ? Player : AsylumGGTSTaskTarget, AsylumGGTSTask)) {
		AsylumGGTSMessage("TaskDone");
		if ((Math.random() >= 0.5) && (["PoseOverHead", "PoseKneel", "PoseBehindBack", "PoseLegsClosed"].indexOf(AsylumGGTSTask) >= 0) && (AsylumGGTSGetLevel(Player) >= 2)) AsylumGGTSAddRule("KeepPose", true);
		return AsylumGGTSEndTaskSave();
	}
	if ((CommonTime() >= AsylumGGTSTimer) || (AsylumGGTSTaskFail(Player, AsylumGGTSTask))) {
		AsylumGGTSAddStrike();
		AsylumGGTSMessage(((CommonTime() >= AsylumGGTSTimer) ? "TimeOver" : "Failure") + "Strike" + Player.Game.GGTS.Strike.toString());
		return AsylumGGTSEndTaskSave(true);
	}
}

/**
 * Checks for forbidden words spoken by a character
 * @param {Character} C - The character to evaluate
 * @returns {boolean} - TRUE if a forbidden word was said
 */
function AsylumGGTSForbiddenWord(C) {

	// The full list of phrases that are always allowed
	let FullList = [
		"Good Girl Training System.", "Good Girl Training System", "I'm a good girl.", "I'm a good slave girl.", "I'm a good slave.", "I am a good girl.", "I am a good slave girl.", "I am a good slave.", "GGTS is in control.",
		"Master GGTS is in control.", "I love GGTS.", "I love Master GGTS.", "GGTS cannot fail.", "GGTS can't fail.", "Master GGTS cannot fail.", "Master GGTS can't fail.", "I surrender to GGTS.",
		"I surrender to Master GGTS.", "I serve and obey GGTS.", "I serve and obey Master GGTS.", "I don't have free will.", "I do not have free will.", "I strive to be slave worthy."
	];

	// Keeps the last check time
	let LastCheck = AsylumGGTSWordCheck;
	AsylumGGTSWordCheck = CommonTime();

	// Builds the word list, at level the player name becomes a forbidden word
	if (ChatRoomChatLog == null) return false;
	let Level = AsylumGGTSGetLevel(C);
	if (Level <= 2) return;
	if (Player.Game.GGTS.Strike >= 3) return;
	let WordList = ["fuck", "shit"];
	if (Level >= 4) WordList.push("cunt", "bitch");
	if (Level >= 5) WordList.push("whore", "bastard");
	if ((Level >= 6) && (Player.Name.length > 2)) WordList.push(Player.Name.trim().toLowerCase());

	// Scans the original
	for (let L = 0; L < ChatRoomChatLog.length; L++)
		if ((ChatRoomChatLog[L].SenderMemberNumber == C.MemberNumber) && (ChatRoomChatLog[L].Time > LastCheck) && (FullList.indexOf(ChatRoomChatLog[L].Original) < 0)) {
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
	if ((ChatRoomData == null) || (ChatRoomData.Game !== "GGTS")) return;
	if (!AsylumGGTSIntroDone) {
		AsylumGGTSTaskEnd = CommonTime();
		AsylumGGTSTimer = 0;
		AsylumGGTSSetTimer();
		if (ChatRoomSpace !== "Asylum") AsylumGGTSMessage("IntroOnlyInAsylum");
		else if (AsylumGGTSGetLevel(Player) <= 0) AsylumGGTSMessage("IntroNotPlaying");
		else if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Strike >= 3)) AsylumGGTSMessage("IntroPendingPunishment");
		else if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) AsylumGGTSMessage("IntroPrivate" + ((AsylumGGTSGetLevel(Player) >= 6) ? "Slave" : ""));
		else AsylumGGTSMessage("IntroPublic");
		AsylumGGTSIntroDone = true;
		return;
	}

	// Validates for forbidden words
	if (AsylumGGTSForbiddenWord(Player)) {
		AsylumGGTSAddStrike();
		AsylumGGTSMessage("ForbiddenWordStrike" + Player.Game.GGTS.Strike.toString());
		return AsylumGGTSEndTaskSave(true);
	}

	// Validates that the pose rule isn't broken
	if ((Player.Game != null) && (Player.Game.GGTS != null) && (Player.Game.GGTS.Rule != null) && (Player.Game.GGTS.Rule.indexOf("KeepPose") >= 0) && (AsylumGGTSPreviousPose != JSON.stringify(Player.Pose)))
		if (!AsylumGGTSTaskDone(Player, AsylumGGTSTask)) {
			AsylumGGTSAddStrike();
			AsylumGGTSMessage("KeepPoseStrike" + Player.Game.GGTS.Strike.toString());
			AsylumGGTSRemoveRule("KeepPose");
			return AsylumGGTSEndTaskSave(true);
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
	if ((ChatRoomData == null) || (ChatRoomData.Game !== "GGTS")) return;
	if ((S == null) || (S.ID != 0)) return;
	if ((AsylumGGTSTaskTarget != null) && ((C == null) || (C.MemberNumber != AsylumGGTSTaskTarget.MemberNumber))) return;
	if ((AsylumGGTSTaskTarget == null) && (C != null) && (C.MemberNumber != Player.MemberNumber)) return;
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
	let Time = Math.round(CurrentTime + parseInt(Minute) * 60000);
	if (LogValue("Isolated", "Asylum") >= CurrentTime) Time = Time + Math.round(LogValue("Isolated", "Asylum") - CurrentTime);
	LogAdd("Isolated", "Asylum", Time);
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
	if ((Level <= 2) && (LogValue("Isolated", "Asylum") < CurrentTime)) {
		if (CurrentScreen != "ChatRoom") return false;
		if (ChatRoomSpace !== "Asylum") return false;
		if ((ChatRoomData == null) || (ChatRoomData.Game !== "GGTS")) return false;
		if ((Item == null) || (Item.Asset == null) || (Item.Asset.Name == null)) return false;
		if ((Item.Asset.Name.substr(0, 10) == "Futuristic") || (Item.Asset.Name == "FuckMachine")) return true;
	} else {
		if ((Item == null) || (Item.Asset == null) || (Item.Asset.Name == null)) return false;
		if ((Item.Asset.Name.substr(0, 10) != "Futuristic") && (Item.Asset.Name != "FuckMachine")) return false;
		if ((CurrentScreen == "ChatRoom") && (ChatRoomSpace == "Asylum")) return true;
		if (CurrentScreen.substr(0, 6) == "Asylum") return true;
	}
	return false;
}

/**
 * Checks if the has enough GGTS minutes to spend on different activities, for GGTS level 6 and up
 * @param {number} Minute - The number of minutes to compare
 * @returns {boolean} - TRUE if the player has enough minutes
 */
function AsylumGGTSHasMinutes(Minute) { return ((AsylumGGTSGetLevel(Player) >= 6) && (Math.floor(Player.Game.GGTS.Time / 60000) >= Minute)); }

/**
 * At level 6, the player can spend GGTS minutes for various reasons
 * @returns {void} - Nothing
 */
function AsylumGGTSSpendMinute(Minute) {
	Player.Game.GGTS.Time = Player.Game.GGTS.Time - (parseInt(Minute) * 60000);
	if (Player.Game.GGTS.Time < 0) Player.Game.GGTS.Time = 0;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Adds a strike to the player game info.  At strike 3, we auto-unlock the door to allow players to leave.
 * @returns {void} - Nothing
 */
function AsylumGGTSAddStrike() {

	// Flash a red alert for the player for 5 seconds, if we are in the GGTS Room background
	if (AsylumGGTSIsEnabled() && (ChatRoomData.Background === "AsylumGGTSRoom")) {
		ChatRoomData.Background = "AsylumGGTSRoomAlert";
		setTimeout(function() { ChatRoomData.Background = "AsylumGGTSRoom"; }, 5000);
	}

	// Level 6 is infinite, getting a strike subtract 1 hour
	if (AsylumGGTSGetLevel(Player) >= 6) return AsylumGGTSSpendMinute(60);

	// On the third strike, we unlock the room if we can
	if ((Player.Game.GGTS.Strike >= 2) && AsylumGGTSTaskCanBeDone(Player, "UnlockRoom")) {
		AsylumGGTSTask = "UnlockRoom";
		AsylumGGTSAutomaticTask();
	}

	// Adds the strike to the player record
	Player.Game.GGTS.Strike++;
	if (Player.Game.GGTS.Strike > 3) Player.Game.GGTS.Strike = 3;
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);

	// On the third strike, we open the leg cuffs if we can
	if ((Player.Game.GGTS.Strike >= 3) && InventoryIsWorn(Player, "FuturisticAnkleCuffs", "ItemFeet")) {
		InventoryGet(Player, "ItemFeet").Property = { SetPose: null, Difficulty: 0, Effect: [] };
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
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
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemEars");
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
	if (ChatRoomSpace !== "Asylum") return;
	if ((ChatRoomData == null) || (ChatRoomData.Game !== "GGTS")) return;
	if ((C == null) || (C.ID != 0)) return;
	if ((Player.Game == null) || (Player.Game.GGTS == null) || (Player.Game.GGTS.Strike == null) || (Player.Game.GGTS.Strike >= 3) || (Player.Game.GGTS.Level == null) || (Player.Game.GGTS.Level < 1)) return;
	if ((Player.Game.GGTS.Rule == null) || (C.Game.GGTS.Rule.indexOf("NoOrgasm") < 0)) return;
	AsylumGGTSAddStrike();
	AsylumGGTSMessage("OrgasmStrike" + Player.Game.GGTS.Strike.toString());
	AsylumGGTSRemoveRule("NoOrgasm");
}

/**
 * When the player resists an orgasm, there's a 50% chance the no-orgasm rule will be dropped
 * @return {void} - TRUE if the character can change
 */
function AsylumGGTSOrgasmResist() {
	if (ChatRoomSpace !== "Asylum") return;
	if ((ChatRoomData == null) || (ChatRoomData.Game !== "GGTS")) return;
	if ((Player.Game == null) || (Player.Game.GGTS == null) || (Player.Game.GGTS.Strike == null) || (Player.Game.GGTS.Strike >= 3) || (Player.Game.GGTS.Level == null) || (Player.Game.GGTS.Level < 1)) return;
	if ((Player.Game.GGTS.Rule != null) && (Player.Game.GGTS.Rule.indexOf("NoOrgasm") >= 0) && (Math.random() >= 0.5)) {
		AsylumGGTSRemoveRule("NoOrgasm");
		AsylumGGTSMessage("TaskUndoRuleNoOrgasm");
	}
}

/**
 * When the player is sent to do GGTS by her owner
 * @param {number} LockTime - The number of minutes to do
 * @param {string} Msg - The nurse intro message
 * @return {void} - Nothing
 */
function AsylumGGTSLock(LockTime, Msg) {
	AsylumGGTSUngag();
	LogAdd("ForceGGTS", "Asylum", LockTime * 60000);
	CommonSetScreen("Room", "AsylumEntrance");
	AsylumEntranceNurse.Stage = "300";
	CharacterSetCurrent(AsylumEntranceNurse);
	AsylumEntranceNurse.CurrentDialog = Msg;
}

/**
 * Fully dress the character in a drone futuristic gear setup
 * @param {Character} C - The character to dress, if omitted, we use the player
 * @return {void} - Nothing
 */
function AsylumGGTSDroneDress(C) {
	if (C == null) C = Player;
	CharacterRelease(C);
	CharacterNaked(C);
	InventoryWear(C, "FuturisticCuffs", "ItemArms");
	InventoryWear(C, "FuturisticAnkleCuffs", "ItemFeet");
	InventoryWear(C, "FuturisticLegCuffs", "ItemLegs");
	InventoryWear(C, "FuturisticHeels2", "ItemBoots");
	InventoryWear(C, "FuturisticTrainingBelt", "ItemPelvis");
	InventoryWear(C, "FuturisticBra", "ItemBreast");
	InventoryWear(C, "FuturisticHarness", "ItemTorso");
	InventoryWear(C, "FuturisticPanelGag", "ItemMouth");
	InventoryWear(C, "FuturisticMask", "ItemHead");
	InventoryWear(C, "FuturisticHelmet", "ItemHood");
	if ((InventoryGet(C, "ItemNeck") == null) || (C.Ownership == null)) InventoryWear(C, "FuturisticCollar", "ItemNeck");
	InventoryWear(C, "FuturisticEarphones", "ItemEars");
}

/**
 * GGTS will not allow the character to change if she's being punished or she reached level 6
 * @param {Character} C - The character to evaluate
 * @return {boolean} - TRUE if the character can change
 */
function AsylumGGTSAllowChange(C) {
	if (LogValue("Isolated", "Asylum") >= CurrentTime) return false;
	if (AsylumGGTSGetLevel(C) >= 6) {
		if ((CurrentScreen == "ChatRoom") && (ChatRoomSpace == "Asylum")) return false;
		if (CurrentScreen.substr(0, 6) == "Asylum") return false;
	}
	return true;
}

/**
 * Called from Dialog.js, triggers a specific action from GGTS game
 * @param {String} Action - The action to perform
 * @param {Number} Minute - The number of minutes to remove
 * @returns {void} - Nothing
 */
function AsylumGGTSDialogAction(Action, Minute) {

	// Removes the minutes first
	Minute = parseInt(Minute);
	if (isNaN(Minute) || (Minute < 0)) Minute = 0;
	AsylumGGTSSpendMinute(Minute);

	// Adds $100 to the player money in exchange for 120 GGTS minutes
	if (Action == "MoneyForMinutes") return CharacterChangeMoney(Player, 100);
	if (Action == "GetHelmet") return InventoryAdd(Player, "FuturisticHelmet", "ItemHood");

	// Call a regular automated task
	DialogLeave();
	AsylumGGTSTask = Action;
	AsylumGGTSAutomaticTask();

}

/**
 * Called from Dialog.js, as nurse, trigger a specific interaction for the current character
 * @param {String} Interaction - The interaction to perform
 * @returns {void} - Nothing
 */
function AsylumGGTSDialogInteraction(Interaction) {

	// Outputs the interaction in local chat
	ServerSend("ChatRoomChat", { Content: "GGTS" + Interaction + "|" + CurrentCharacter.MemberNumber.toString(), Type: "Hidden" });
	AsylumGGTSMessage("Interaction" + Interaction, CurrentCharacter);
	DialogLeave();

}

/**
 * Called from chat room, processes hidden GGTS messages
 * @param {Character} SenderCharacter - The character sending the message
 * @param {String} Interaction - The message sent
 * @param {IChatRoomMessage} data - The full message recieved
 * @returns {Object} - Nothing to be used
 */
function AsylumGGTSHiddenMessage(SenderCharacter, Interaction, data) {
	if (Interaction == "GGTSNewTask|" + Player.MemberNumber.toString()) return AsylumGGTSNewTask();
	if (Interaction == "GGTSSpeed5|" + Player.MemberNumber.toString()) return AsylumGGTSSpeed = 0.5;
	if (Interaction == "GGTSSpeed10|" + Player.MemberNumber.toString()) return AsylumGGTSSpeed = 1;
	if (Interaction == "GGTSSpeed20|" + Player.MemberNumber.toString()) return AsylumGGTSSpeed = 2;
	if (Interaction == "GGTSPause5|" + Player.MemberNumber.toString()) return AsylumGGTSTimer = Math.round(CommonTime() + 300000);
}

/**
 * GGTS Draws the level, the number of strikes and a progress bar, level 6 shows the time in a gold frame
 * @param {Character} C - Character to draw the info for
 * @param {number} X - Position of the character the X axis
 * @param {number} Y - Position of the character the Y axis
 * @param {number} Zoom - Amount of zoom the character has (Height)
 * @returns {void} - Nothing
 */
function AsylumGGTSDrawCharacter(C, X, Y, Zoom) {
	if ((CurrentModule == "Online") && (CurrentScreen == "ChatRoom") && (ChatRoomSpace === "Asylum")) {
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
}

/**
 * Resets the state of the GGTS game
 * @returns {void} - Nothing
 */
function AsylumGGTSReset() {
	AsylumGGTSPreviousPose = JSON.stringify(Player.Pose);
}
