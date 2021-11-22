"use strict";
var AsylumGGTSBackground = "AsylumGGTSRoom";
var AsylumGGTSComputer = null;
var AsylumGGTSIntroDone = false;

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
 * @returns {void} - Nothing
 */
function AsylumGGTSStartLevel(Level) {
	Level = parseInt(Level);
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.GGTS == null) Player.Game.GGTS = {};
	Player.Game.GGTS.Level = Level;
	Player.Game.GGTS.Time = 0;
	if (Level == 1) InventoryAdd(Player, "FuturisticCuffs", "ItemArms");
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
}

/**
 * Builds a private room online chat room for single player GGTS experience
 * @returns {void} - Nothing
 */
function AsylumGGTSBuildPrivate() {
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

function AsylumGGTSMessage(Msg) {
	ChatRoomMessage({ Content: Msg, Type: "Action", Sender: Player.MemberNumber, Dictionary: [{Tag: "SourceCharacter", Text: Player.Name + "-" + Player.MemberNumber.toString(), MemberNumber: Player.MemberNumber}] });
}

/**
 * Processes the GGTS AI in the chatroom
 * @returns {void} - Nothing
 */
function AsylumGGTSProcess() {
	if ((ChatRoomData == null) || (ChatRoomData.Game == null) || (ChatRoomData.Game != "GGTS")) return;
	if (!AsylumGGTSIntroDone) {
		if (ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) AsylumGGTSMessage("GGTSIntroPrivate");
		else AsylumGGTSMessage("GGTSIntroPublic");
		AsylumGGTSIntroDone = true;
		return;
	}
}