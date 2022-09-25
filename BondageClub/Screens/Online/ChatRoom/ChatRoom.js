"use strict";
var ChatRoomBackground = "";
/** @type {ChatRoom} */
let ChatRoomData = {};
/** @type {Character[]} */
var ChatRoomCharacter = [];
var ChatRoomChatLog = [];
var ChatRoomLastMessage = [""];
var ChatRoomLastMessageIndex = 0;
var ChatRoomTargetMemberNumber = null;
var ChatRoomOwnershipOption = "";
var ChatRoomLovershipOption = "";
var ChatRoomPlayerCanJoin = false;
var ChatRoomMoneyForOwner = 0;
var ChatRoomQuestGiven = [];
var ChatRoomSpace = "";
var ChatRoomGame = "";
var ChatRoomMoveTarget = null;
var ChatRoomHelpSeen = false;
var ChatRoomAllowCharacterUpdate = true;
var ChatRoomStruggleAssistBonus = 0;
var ChatRoomStruggleAssistTimer = 0;
var ChatRoomSlowtimer = 0;
var ChatRoomSlowStop = false;
var ChatRoomChatHidden = false;
var ChatRoomCharacterCount = 0;
var ChatRoomCharacterDrawlist = [];
var ChatRoomSenseDepBypass = false;
var ChatRoomGetUpTimer = 0;
var ChatRoomLastName = "";
var ChatRoomLastBG = "";
var ChatRoomLastPrivate = false;
var ChatRoomLastSize = 0;
var ChatRoomLastLanguage = "EN";
var ChatRoomLastDesc = "";
var ChatRoomLastAdmin = [];
var ChatRoomLastBan = [];
var ChatRoomLastBlockCategory = [];
var ChatRoomNewRoomToUpdate = null;
var ChatRoomNewRoomToUpdateTimer = 0;
var ChatRoomLeashList = [];
var ChatRoomLeashPlayer = null;
var ChatRoomTargetDirty = false;

/**
 * Chances of a chat message popping up reminding you of some stimulation.
 *
 * @type {Record<StimulationAction, StimulationEvent>}
 */
const ChatRoomStimulationEvents = {
	Kneel: {
		Chance: 0.1,
		ArousalScaling: 0.8,
		VibeScaling: 0.0,
		InflationScaling: 0.1,
	},
	Walk: {
		Chance: 0.33,
		ArousalScaling: 0.67,
		VibeScaling: 0.8,
		InflationScaling: 0.5,
	},
	Struggle: {
		Chance: 0.05,
		ArousalScaling: 0.2,
		VibeScaling: 0.3,
		InflationScaling: 0.2,
	},
	StruggleFail: {
		Chance: 0.4,
		ArousalScaling: 0.4,
		VibeScaling: 0.3,
		InflationScaling: 0.4,
	},
	Talk: {
		Chance: 0,
		TalkChance: 0.3,
		ArousalScaling: 0.22,
	},
};

const ChatRoomArousalMsg_Chance = {
	"Kneel" : 0.1,
	"Walk" : 0.33,
	"StruggleFail" : 0.4,
	"StruggleAction" : 0.05,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceScaling = {
	"Kneel" : 0.8,
	"Walk" : 0.67,
	"StruggleFail" : 0.4,
	"StruggleAction" : 0.2,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceVibeMod = {
	"Kneel" : 0.0,
	"Walk" : 0.8,
	"StruggleFail" : 0.6,
	"StruggleAction" : 0.3,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceInflationMod = {
	"Kneel" : 0.1,
	"Walk" : 0.5,
	"StruggleFail" : 0.4,
	"StruggleAction" : 0.2,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceGagMod = {
	"Kneel" : 0,
	"Walk" : 0,
	"StruggleFail" : 0,
	"StruggleAction" : 0,
	"Gag" : 0.3,
};
var ChatRoomHideIconState = 0;
var ChatRoomMenuButtons = [];
let ChatRoomFontSize = 30;
const ChatRoomFontSizes = {
	Small: 28,
	Medium: 36,
	Large: 44,
};

var ChatRoomCharacterX_Upper = 0;
var ChatRoomCharacterX_Lower = 0;
var ChatRoomCharacterZoom = 1;
var ChatRoomSlideWeight = 9;
var ChatRoomCharacterInitialize = true;

/** @type {Map<CommonChatTags | string, number>} */
var ChatRoomDictionarySortOrder = new Map([
	[CommonChatTags.TARGET_CHAR, 1],
	[CommonChatTags.DEST_CHAR, 1],
]);

/** Sets whether an add/remove for one list automatically triggers an add/remove for another list */
const ChatRoomListOperationTriggers = () => [
	{
		list: Player.WhiteList, adding: true, triggers: [
			{ list: Player.BlackList, add: false },
			{ list: Player.GhostList, add: false }
		]
	},
	{
		list: Player.BlackList, adding: true, triggers: [
			{ list: Player.WhiteList, add: false }
		]
	},
	{
		list: Player.GhostList, adding: true, triggers: [
			{ list: Player.WhiteList, add: false },
			{ list: Player.BlackList, add: true }
		]
	},
	{
		list: Player.GhostList, adding: false, triggers: [
			{ list: Player.BlackList, add: false }
		]
	}
];

/**
 * Chat room resize manager object: Handles resize events for the chat log.
 * @constant
 * @type {object} - The chat room resize manager object. Contains the functions and properties required to handle
 *     resize events.
 */
let ChatRoomResizeManager = {
	atStart: true, // Is this the first event in a chain of resize events?
	timer: null, // Timer that triggers the end function after no resize events have been received recently.
	timeOut: 200, // The amount of milliseconds that has to pass before the chain of resize events is considered over and the timer is called.
	ChatRoomScrollPercentage: 0, // Height of the chat log scroll bar before the first resize event occurs, as a percentage.
	ChatLogScrolledToEnd: false, // Is the chat log scrolled all the way to the end before the first resize event occurs?

	// Triggered by resize event
	ChatRoomResizeEvent : function() {
		if(ChatRoomResizeManager.atStart) { // Run code for the first resize event in a chain of resize events.
			ChatRoomResizeManager.ChatRoomScrollPercentage = ElementGetScrollPercentage("TextAreaChatLog");
			ChatRoomResizeManager.ChatLogScrolledToEnd = ElementIsScrolledToEnd("TextAreaChatLog");
			ChatRoomResizeManager.atStart = false;
		}

		// Reset timer if an event was received recently.
		if (ChatRoomResizeManager.timer) clearTimeout(ChatRoomResizeManager.timer);
		ChatRoomResizeManager.timer = setTimeout(ChatRoomResizeManager.ChatRoomResizeEventsEnd, ChatRoomResizeManager.timeOut);
	},

	// Triggered by ChatRoomResizeManager.timer at the end of a chain of resize events
	ChatRoomResizeEventsEnd : function(){
		var TextAreaChatLog = document.getElementById("TextAreaChatLog");

		if (TextAreaChatLog != null) {
			// Scrolls to the position held before the resize events.
			if (ChatRoomResizeManager.ChatLogScrolledToEnd) ElementScrollToEnd("TextAreaChatLog"); // Prevents drift away from the end of the chat log.
			else TextAreaChatLog.scrollTop = (ChatRoomResizeManager.ChatRoomScrollPercentage * TextAreaChatLog.scrollHeight) - TextAreaChatLog.clientHeight;
		}
		ChatRoomResizeManager.atStart = true;
	},
};


/**
 * Checks if the player can add the current character to her whitelist.
 * @returns {boolean} - TRUE if the current character is not in the player's whitelist nor blacklist.
 */
function ChatRoomCanAddWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can add the current character to her blacklist.
 * @returns {boolean} - TRUE if the current character is not in the player's whitelist nor blacklist.
 */
function ChatRoomCanAddBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can remove the current character from her whitelist.
 * @returns {boolean} - TRUE if the current character is in the player's whitelist, but not her blacklist.
 */
function ChatRoomCanRemoveWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can remove the current character from her blacklist.
 * @returns {boolean} - TRUE if the current character is in the player's blacklist, but not her whitelist.
 */
function ChatRoomCanRemoveBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can add the current character to her friendlist
 * @returns {boolean} - TRUE if the current character is not in the player's friendlist yet.
 */
function ChatRoomCanAddFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can remove the current character from her friendlist.
 * @returns {boolean} - TRUE if the current character is in the player's friendlist.
 */
function ChatRoomCanRemoveFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can add the current character to her ghostlist
 * @returns {boolean} - TRUE if the current character is not in the player's ghostlist yet.
 */
function ChatRoomCanAddGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can remove the current character from her ghostlist.
 * @returns {boolean} - TRUE if the current character is in the player's ghostlist.
 */
function ChatRoomCanRemoveGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can change the current character's clothes
 * @returns {boolean} - TRUE if the player can change the character's clothes and is allowed to.
 */
function DialogCanChangeClothes() {
	return (
		["ChatRoom", "MainHall", "Private", "Photographic"].includes(CurrentScreen)
		&& CurrentCharacter != null
		&& Player.CanChangeClothesOn(CurrentCharacter)
	);
}
/**
 * Checks if the specified owner option is available.
 * @param {string} Option - The option to check for availability
 * @returns {boolean} - TRUE if the current ownership option is the specified one.
 */
function ChatRoomOwnershipOptionIs(Option) { return (Option == ChatRoomOwnershipOption); }
/**
 * Checks if the specified lover option is available.
 * @param {string} Option - The option to check for availability
 * @returns {boolean} - TRUE if the current lover option is the specified one.
 */
function ChatRoomLovershipOptionIs(Option) { return (Option == ChatRoomLovershipOption); }
/**
 * Checks if the player can take a drink from the current character's tray.
 * @returns {boolean} - TRUE if the current character is wearing a drinks tray and the player can interact.
 */
function ChatRoomCanTakeDrink() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (CurrentCharacter.ID != 0) && Player.CanInteract() && (InventoryGet(CurrentCharacter, "ItemMisc") != null) && (InventoryGet(CurrentCharacter, "ItemMisc").Asset.Name == "WoodenMaidTrayFull")); }
/**
 * Checks if the current character is owned by the player.
 * @returns {boolean} - TRUE if the current character is owned by the player.
 */
function ChatRoomIsCollaredByPlayer() { return ((CurrentCharacter != null) && (CurrentCharacter.Ownership != null) && (CurrentCharacter.Ownership.Stage == 1) && (CurrentCharacter.Ownership.MemberNumber == Player.MemberNumber)); }
/**
 * Checks if the current character is owned by the player. (Including trial)
 * @returns {boolean} - TRUE if the current character is owned by the player.
 */
function ChatRoomIsOwnedByPlayer() { return CurrentCharacter != null && CurrentCharacter.Ownership != null && CurrentCharacter.Ownership.MemberNumber == Player.MemberNumber; }
/**
 * Checks if the current character is wearing any collar.
 * @returns {boolean} - TRUE if the current character is owned by the player.
 */
function ChatRoomIsWearingCollar() { return CurrentCharacter != null && InventoryGet(CurrentCharacter, "ItemNeck") !== null; }
/**
 * Checks if the current character is lover of the player.
 * @returns {boolean} - TRUE if the current character is lover of the player.
 */
function ChatRoomIsLoverOfPlayer() { return ((CurrentCharacter != null) && CurrentCharacter.GetLoversNumbers().includes(Player.MemberNumber)); }
/**
 * Checks if the current character can serve drinks.
 * @returns {boolean} - TRUE if the character is a maid and is free.
 */
function ChatRoomCanServeDrink() { return ((CurrentCharacter != null) && CurrentCharacter.CanWalk() && (ReputationCharacterGet(CurrentCharacter, "Maid") > 0) && CurrentCharacter.CanTalk()); }
/**
 * Checks if the player can give a money envelope to her owner
 * @returns {boolean} - TRUE if the current character is the owner of the player, and the player has the envelope
 */
function ChatRoomCanGiveMoneyForOwner() { return ((ChatRoomMoneyForOwner > 0) && (CurrentCharacter != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == CurrentCharacter.MemberNumber)); }
/**
 * Checks if the player is a chatroom admin.
 * @returns {boolean} - TRUE if the player is an admin of the current chatroom.
 */
function ChatRoomPlayerIsAdmin() { return ((ChatRoomData != null && ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(Player.MemberNumber) >= 0)); }
/**
 * Checks if the current character is an admin of the chatroom.
 * @returns {boolean} - TRUE if the current character is an admin.
 */
function ChatRoomCurrentCharacterIsAdmin() { return ((CurrentCharacter != null) && (ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the room allows the photograph feature to be used.
 * @returns {boolean} - TRUE if the player can take a photo.
 */
function DialogCanTakePhotos() { return (ChatRoomData && ChatRoomData.BlockCategory && !ChatRoomData.BlockCategory.includes("Photos")) || !ChatRoomData; }

/**
 * Checks if the player can start searching a player
 * @returns {boolean} - Returns TRUE if the player can start searching a player
 */
function ChatRoomCanTakeSuitcase() {
	return ChatRoomCarryingBounty(CurrentCharacter) && !CurrentCharacter.CanInteract();
}
/**
 * Checks if the player can start searching a player
 * @returns {boolean} - Returns TRUE if the player can start searching a player
 */
function ChatRoomCanTakeSuitcaseOpened() {
	return ChatRoomCarryingBountyOpened(CurrentCharacter) && !CurrentCharacter.CanInteract();
}
/**
 * Checks if the player carries a bounty
 * @param {Character} C - The character to search
 * @returns {boolean} - Returns TRUE if the player can start searching a player
 */
function ChatRoomCarryingBounty(C) {
	return (ReputationGet("Kidnap") > 0 && Player.CanInteract() && C.AllowItem != false && InventoryIsWorn(C,"BountySuitcase", "ItemMisc"));
}
/**
 * Checks if the player carries an opened bounty
 * @param {Character} C - The character to search
 * @returns {boolean} - Returns TRUE if the player can start searching a player
 */
function ChatRoomCarryingBountyOpened(C) {
	return (ReputationGet("Kidnap") > 0 && Player.CanInteract() && C.AllowItem != false && InventoryIsWorn(C,"BountySuitcaseEmpty", "ItemMisc"));
}
/**
 * Checks if the player can start searching a player but the player is unbound
 * @returns {boolean} - Returns TRUE if the player can start searching a player
 */
function ChatRoomCantTakeSuitcase() {
	return (Player.CanInteract() && CurrentCharacter.CanInteract() && CurrentCharacter.AllowItem && InventoryIsWorn(CurrentCharacter,"BountySuitcase", "ItemMisc"));
}
/**
 * Checks if the player can start searching a player but the player is unbound
 * @returns {boolean} - Returns TRUE if the player can start searching a player
 */
function ChatRoomCantTakeSuitcaseOpened() {
	return (Player.CanInteract() && CurrentCharacter.CanInteract() && CurrentCharacter.AllowItem && InventoryIsWorn(CurrentCharacter,"BountySuitcaseEmpty", "ItemMisc"));
}
/**
 * Attempts to take the suitcase from the current player
 * @returns {void}
 */
function ChatRoomTryToTakeSuitcase() {
	ServerSend("ChatRoomChat", { Content: "TakeSuitcase", Type: "Hidden", Target: CurrentCharacter.MemberNumber});

	if (KidnapLeagueOnlineBountyTarget == 0) {
		KidnapLeagueOnlineBountyTargetStartedTime = CommonTime();
	}
	KidnapLeagueOnlineBountyTarget = CurrentCharacter.MemberNumber;
	CurrentCharacter = null;
}
/**
 * Receives money from the suitcase
 * @returns {void}
 */
function ChatRoomReceiveSuitcaseMoney() {
	let money = Math.max(1, Math.ceil(15 * Math.min(1, Math.max(0, (CommonTime() - KidnapLeagueOnlineBountyTargetStartedTime)/KidnapLeagueSearchFinishDuration))));
	CharacterChangeMoney(Player, money);
	ChatRoomMessage({ Content: "OnlineBountySuitcaseFinish", Type: "Action", Dictionary: [{Tag: "MONEYAMOUNT", Text: ""+Math.ceil(money)}], Sender: Player.MemberNumber });
	KidnapLeagueOnlineBountyTarget = 0;
	KidnapLeagueOnlineBountyTargetStartedTime = 0;
}

/**
 * Checks if the player can give the target character her high security keys.
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanGiveHighSecurityKeys() {
	if (Player.Appearance != null)
		for (let A = 0; A < Player.Appearance.length; A++)
			if (Player.Appearance[A].Asset && Player.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& (Player.Appearance[A].Property.MemberNumberListKeys)
			&& (Player.Appearance[A].Property.MemberNumberListKeys
			&& CommonConvertStringToArray("" + Player.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0
			&& CommonConvertStringToArray("" + Player.Appearance[A].Property.MemberNumberListKeys).indexOf(CurrentCharacter.MemberNumber) < 0)) // Make sure you have a lock they dont have the keys to
				return true;
	return false;
}

/**
 * Checks if the player can give the target character her high security keys, while also removing the ones from her
 * possession
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanGiveHighSecurityKeysAll() {
	if (Player.Appearance != null)
		for (let A = 0; A < Player.Appearance.length; A++)
			if (Player.Appearance[A].Asset && Player.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& (Player.Appearance[A].Property.MemberNumberListKeys || (!Player.Appearance[A].Property.MemberNumberListKeys && Player.Appearance[A].Property.LockMemberNumber == Player.MemberNumber))
			&& (!Player.Appearance[A].Property.MemberNumberListKeys
			|| (CommonConvertStringToArray("" + Player.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0))) // Make sure you have a lock they dont have the keys to
				return true;
	return false;
}

function ChatRoomGiveHighSecurityKeys() {
	var C = Player;
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset && C.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& C.Appearance[A].Property.MemberNumberListKeys
			&& CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0
			&& CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys).indexOf(CurrentCharacter.MemberNumber) < 0) // Make sure you have a lock they dont have the keys to
				C.Appearance[A].Property.MemberNumberListKeys = C.Appearance[A].Property.MemberNumberListKeys + "," + CurrentCharacter.MemberNumber;
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}
function ChatRoomGiveHighSecurityKeysAll() {
	var C = Player;
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset && C.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& (C.Appearance[A].Property.MemberNumberListKeys || (!C.Appearance[A].Property.MemberNumberListKeys && C.Appearance[A].Property.LockMemberNumber == Player.MemberNumber))
			&& (!C.Appearance[A].Property.MemberNumberListKeys || (C.Appearance[A].Property.MemberNumberListKeys
			&& CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0))) // Make sure you have a lock they dont have the keys to
			{
				if (C.Appearance[A].Property.MemberNumberListKeys) {
					var list = CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys);

					if (list) {
						list = list.filter(x => x !== Player.MemberNumber);
						if (list.indexOf(CurrentCharacter.MemberNumber) < 0)
							list.push(CurrentCharacter.MemberNumber);
						C.Appearance[A].Property.MemberNumberListKeys = "" +
							CommonConvertArrayToString(list); // Convert to array and back; can only save strings on server
					}
				}
				C.Appearance[A].Property.LockMemberNumber = CurrentCharacter.MemberNumber;
			}
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}



/**
 * Checks if the player can help the current character by giving them a lockpick
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanGiveLockpicks() {
	if (Player.CanInteract())
		for (let I = 0; I < Player.Inventory.length; I++)
			if (Player.Inventory[I].Name == "Lockpicks") {
				return true;
			}
	return false;
}
/**
 * Checks if the player can help the current character by giving her lockpicks
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanAssistStruggle() { return CurrentCharacter.AllowItem && !CurrentCharacter.CanInteract(); }
/**
 * Checks if the character options menu is available.
 * @returns {boolean} - Whether or not the player can interact with the target character
 */
function DialogCanPerformCharacterAction() {
	return (
		ChatRoomCanAssistStand() || ChatRoomCanAssistKneel() || ChatRoomCanAssistStruggle() ||
		ChatRoomCanHoldLeash() || ChatRoomCanStopHoldLeash() ||
		DialogCanTakePhotos() ||
		ChatRoomCanGiveLockpicks() || ChatRoomCanGiveHighSecurityKeys() || ChatRoomCanGiveHighSecurityKeysAll() ||
		DialogHasGamingHeadset() || DialogCanWatchKinkyDungeon()
	);
}
/**
 * Checks if the target character can be helped back on her feet. This is different than CurrentCharacter.CanKneel()
 * because it listens for the current active pose and removes certain checks that are not required for someone else to
 * help a person kneel down.
 * @returns {boolean} - Whether or not the target character can stand
 */
function ChatRoomCanAssistStand() {
	return Player.CanInteract() && CurrentCharacter.AllowItem && CharacterItemsHavePoseAvailable(CurrentCharacter, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(CurrentCharacter, "Kneel") && CurrentCharacter.IsKneeling();
}
/**
 * Checks if the target character can be helped down on her knees. This is different than CurrentCharacter.CanKneel()
 * because it listens for the current active pose and removes certain checks that are not required for someone else to
 * help a person kneel down.
 * @returns {boolean} - Whether or not the target character can stand
 */

function ChatRoomCanAssistKneel() {
	return Player.CanInteract() && CurrentCharacter.AllowItem && CharacterItemsHavePoseAvailable(CurrentCharacter, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(CurrentCharacter, "Kneel") && !CurrentCharacter.IsKneeling();
}

/**
* Checks if the player character can attempt to stand up. This is different than CurrentCharacter.CanKneel() because it
* listens for the current active pose, but it forces the player to do a minigame.
 * @returns {boolean} - Whether or not the player character can stand
 */
function ChatRoomCanAttemptStand() { return CharacterItemsHavePoseAvailable(Player, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(Player, "Kneel") && Player.IsKneeling();}
/**
 * Checks if the player character can attempt to get down on her knees. This is different than
 * CurrentCharacter.CanKneel() because it listens for the current active pose, but it forces the player to do a
 * minigame.
 * @returns {boolean} - Whether or not the player character can stand
 */
function ChatRoomCanAttemptKneel() { return CharacterItemsHavePoseAvailable(Player, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(Player, "Kneel") && !Player.IsKneeling(); }

/**
 * Checks if the player can stop the current character from leaving.
 * @returns {boolean} - TRUE if the current character is slowed down and can be interacted with.
 */
function ChatRoomCanStopSlowPlayer() { return (CurrentCharacter.IsSlow() && Player.CanInteract() && CurrentCharacter.AllowItem ); }
/**
 * Checks if the player can grab the targeted player's leash
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanHoldLeash() { return CurrentCharacter.AllowItem && Player.CanInteract() && CurrentCharacter.OnlineSharedSettings && CurrentCharacter.OnlineSharedSettings.AllowPlayerLeashing != false && ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) < 0
	&& ChatRoomCanBeLeashed(CurrentCharacter);}
/**
 * Checks if the player can let go of the targeted player's leash
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanStopHoldLeash() {
	if (CurrentCharacter.AllowItem && Player.CanInteract() && CurrentCharacter.OnlineSharedSettings && CurrentCharacter.OnlineSharedSettings.AllowPlayerLeashing != false && ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) >= 0) {
		if (ChatRoomCanBeLeashed(CurrentCharacter)) {
			return true;
		} else {
			ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber), 1);
		}
	}
	return false;
}
/**
 * Checks if the given character is a valid leash target for the player
 * @param {Character} C - The character to search
 * @returns {boolean} - TRUE if the player can be leashed
 */
function ChatRoomCanBeLeashed(C) {
	return ChatRoomCanBeLeashedBy(Player.MemberNumber, C);
}

/**
 * Checks if the targeted player is a valid leash target for the source member number
 * @param {number} sourceMemberNumber - Member number of the source player
 * @param {Character} C - Target player
 * @returns {boolean} - TRUE if the player can be leashed
 */
function ChatRoomCanBeLeashedBy(sourceMemberNumber, C) {
	if ((ChatRoomData && ChatRoomData.BlockCategory && ChatRoomData.BlockCategory.indexOf("Leashing") < 0) || !ChatRoomData) {
		// Have to not be tethered, and need a leash
		var canLeash = false;
		var isTrapped = false;
		var neckLock = null;
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily)) {
				if (InventoryItemHasEffect(C.Appearance[A], "Leash", true)) {
					canLeash = true;
					if (C.Appearance[A].Asset.Group.Name == "ItemNeckRestraints")
						neckLock = InventoryGetLock(C.Appearance[A]);
				} else if (InventoryItemHasEffect(C.Appearance[A], "Tethered", true) || InventoryItemHasEffect(C.Appearance[A], "Mounted", true) || InventoryItemHasEffect(C.Appearance[A], "Enclose", true) || InventoryItemHasEffect(C.Appearance[A], "OneWayEnclose", true)){
					isTrapped = true;
				}
			}

		if (canLeash && !isTrapped) {
			if (sourceMemberNumber == 0 || !neckLock || (!neckLock.Asset.OwnerOnly && !neckLock.Asset.LoverOnly) ||
				(neckLock.Asset.OwnerOnly && C.IsOwnedByMemberNumber(sourceMemberNumber)) ||
				(neckLock.Asset.LoverOnly && C.IsLoverOfMemberNumber(sourceMemberNumber))) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Checks if the player has waited long enough to be able to call the maids
 * @returns {boolean} - TRUE if the current character has been in the last chat room for more than 30 minutes
 */
function DialogCanCallMaids() { return (CurrentScreen == "ChatRoom" && (ChatRoomData && ChatRoomData.Game == "" && !(LogValue("Committed", "Asylum") >= CurrentTime)) &&  !Player.CanWalk()) && !MainHallIsMaidsDisabled();}


/**
 * Checks if the player has waited long enough to be able to call the maids
 * @returns {boolean} - TRUE if the current character has been in the last chat room for more than 30 minutes
 */
function DialogCanCallMaidsPunishmentOn() { return (DialogCanCallMaids() && (!Player.RestrictionSettings || !Player.RestrictionSettings.BypassNPCPunishments));}


/**
 * Checks if the player has waited long enough to be able to call the maids
 * @returns {boolean} - TRUE if the current character has been in the last chat room for more than 30 minutes
 */
function DialogCanCallMaidsPunishmentOff() { return (DialogCanCallMaids() && Player.RestrictionSettings && Player.RestrictionSettings.BypassNPCPunishments);}

/**
 * Creates the chat room input elements.
 * @returns {void} - Nothing.
 */
function ChatRoomCreateElement() {
	// Creates the chat box
	if (document.getElementById("InputChat") == null) {
		ElementCreateTextArea("InputChat");
		document.getElementById("InputChat").setAttribute("maxLength", 1000);
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
		document.getElementById("InputChat").addEventListener("keyup", ChatRoomStatusUpdateTalk);
		ElementFocus("InputChat");
	} else if (document.getElementById("InputChat").style.display == "none") ElementFocus("InputChat");

	// Creates the chat log
	if (document.getElementById("TextAreaChatLog") == null) {

		// Sets the size and position
		ElementCreateDiv("TextAreaChatLog");
		ElementPositionFix("TextAreaChatLog", ChatRoomFontSize, 1005, 5, 988, 859);
		ElementScrollToEnd("TextAreaChatLog");
		ChatRoomRefreshChatSettings();

		// If we relog, we reload the previous chat log
		if (RelogChatLog != null) {
			while (RelogChatLog.children.length > 0)
				document.getElementById("TextAreaChatLog").appendChild(RelogChatLog.children[0]);
			ElementValue("InputChat", RelogInputText);
			RelogChatLog = null;
			RelogInputText = "";
		} else ElementContent("TextAreaChatLog", "");

		// Creates listener for resize events.
		window.addEventListener("resize", ChatRoomResizeManager.ChatRoomResizeEvent);

	} else if (document.getElementById("TextAreaChatLog").style.display == "none") {
		setTimeout(() => ElementScrollToEnd("TextAreaChatLog"), 100);
		ChatRoomRefreshChatSettings();
	}

}

/**
 * Loads the chat room screen by displaying the proper inputs.
 * @returns {void} - Nothing.
 */
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ChatRoomCreateRemoveInput();
	ChatRoomRefreshFontSize();
	ChatRoomCreateElement();
	ChatRoomCharacterUpdate(Player);
	ActivityChatRoomArousalSync(Player);
	if (!ChatRoomData || ChatRoomData.Name !== Player.LastChatRoom) {
		ChatRoomHideIconState = 0;
	}
	ChatRoomMenuBuild();

	ChatRoomCharacterInitialize = true;

	TextPrefetch("Character", "FriendList");
	TextPrefetch("Online", "ChatAdmin");
}

/**
 * Removes all elements that can be open in the chat room
*/
function ChatRoomClearAllElements() {
	// Dialog
	DialogLeave();

	// Friendlist
	ElementRemove("FriendList");
	FriendListBeepMenuClose();
	FriendListModeIndex = 0;

	// Admin
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	ElementRemove("InputBackground");
	ElementRemove("TagDropDown");

	// Chatroom
	ElementRemove("InputChat");
	ElementRemove("TextAreaChatLog");

	// Preferences
	ElementRemove("InputEmailOld");
	ElementRemove("InputEmailNew");
	ElementRemove("InputCharacterLabelColor");
	PreferenceSubscreen = "";

	// Profile
	ElementRemove("DescriptionInput");

	// Wardrobe
	ElementRemove("InputWardrobeName");
	CharacterAppearanceMode = "";

	// Listeners
	window.removeEventListener("resize", ChatRoomResizeManager.ChatRoomResizeEvent);
}

/**
 * Starts the chatroom selection screen.
 * @param {string} Space - Name of the chatroom space
 * @param {string} Game - Name of the chatroom game to play
 * @param {string} LeaveRoom - Name of the room to go too when exiting chatsearch.
 * @param {string} Background - Name of the background to use in chatsearch.
 * @param {Array} BackgroundTagList - List of available backgrounds in the chatroom space.
 * @returns {void} - Nothing.
 */
function ChatRoomStart(Space, Game, LeaveRoom, Background, BackgroundTagList) {
	ChatRoomSpace = Space;
	ChatRoomGame = Game;
	ChatSearchLeaveRoom = LeaveRoom;
	ChatSearchBackground = Background;
	ChatCreateBackgroundList = BackgroundsGenerateList(BackgroundTagList);
	BackgroundSelectionTagList = BackgroundTagList;
	CommonSetScreen("Online", "ChatSearch");

}

/**
 * Create the list of chat room menu buttons
 * @returns {void} - Nothing
 */
function ChatRoomMenuBuild() {
	ChatRoomMenuButtons = [];
	ChatRoomMenuButtons.push("Exit");
	if ((ChatRoomGame === "") || (ChatRoomGame === "GGTS")) ChatRoomMenuButtons.push("Cut");
	else ChatRoomMenuButtons.push("GameOption");
	ChatRoomMenuButtons.push("Kneel", "Icons");
	if (DialogCanTakePhotos()) ChatRoomMenuButtons.push("Camera");
	ChatRoomMenuButtons.push("Dress", "Profile", "Admin");
}

/**
 * Checks if the player's owner is inside the chatroom.
 * @returns {boolean} - Returns TRUE if the player's owner is inside the room.
 */
function ChatRoomOwnerInside() {
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber)
			return true;
	return false;
}


/**
 * Updates the temporary drawing arrays for characters, to handle things that are dependent on the drawn chat room
 * characters rather than the ones actually present
 * @returns {void} - Nothing
 */
function ChatRoomUpdateDisplay() {
	// The number of characters to show in the room
	const RenderSingle = Player.GameplaySettings.SensDepChatLog == "SensDepExtreme" && Player.GetBlindLevel() >= 3 && !Player.Effect.includes("VRAvatars");
	ChatRoomCharacterDrawlist = ChatRoomCharacter;
	ChatRoomSenseDepBypass = false;
	if (Player.Effect.includes("VRAvatars")) {
		ChatRoomCharacterDrawlist = [];
		ChatRoomSenseDepBypass = true;
		for (let CC = 0; CC < ChatRoomCharacter.length; CC++) {
			if (ChatRoomCharacter[CC].Effect.includes("VRAvatars")) {
				ChatRoomCharacterDrawlist.push(ChatRoomCharacter[CC]);
			}
		}
	} else if (Player.GetBlindLevel() > 0 && Player.GetBlindLevel() < 3 && Player.ImmersionSettings.BlindAdjacent) {
		// We hide all players except those who are adjacent
		ChatRoomCharacterDrawlist = [];
		ChatRoomSenseDepBypass = true;
		let PlayerIndex = -1;
		// First find the player index
		for (let CC = 0; CC < ChatRoomCharacter.length; CC++) {
			if (ChatRoomCharacter[CC].ID == 0) {
				PlayerIndex = CC;
				break;
			}
		}
		// Then filter the characters
		for (let CC = 0; CC < ChatRoomCharacter.length; CC++) {
			if (Math.abs(CC - PlayerIndex) <= 1) {
				ChatRoomCharacterDrawlist.push(ChatRoomCharacter[CC]);
			}
		}
	}

	ChatRoomCharacterCount = RenderSingle ? 1 : ChatRoomCharacterDrawlist.length;
}

/**
 * Draws the status bubble next to the character
 * @param {Character} C - The status bubble to draw
 * @param {number} X - Screen X position
 * @param {number} Y - Screen Y position
 * @param {number} Zoom - Screen zoom
 * @returns {void} - Nothing.
 */
function DrawStatus(C, X, Y, Zoom) {
	if ((Player.OnlineSettings != null) && (Player.OnlineSettings.ShowStatus != null) && (Player.OnlineSettings.ShowStatus == false)) return;
	if (ChatRoomHideIconState >= 2) return;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.OrgasmTimer != null) && (C.ArousalSettings.OrgasmTimer > 0)) {
		DrawImageResize("Icons/Status/Orgasm" + (Math.floor(CommonTime() / 1000) % 3).toString() + ".png", X + 225 * Zoom, Y + 920 * Zoom, 50 * Zoom, 30 * Zoom);
		return;
	}
	if ((C.StatusTimer != null) && (C.StatusTimer < CommonTime())) {
		C.StatusTimer = null;
		C.Status = null;
		return;
	}
	if ((C.Status == null) || (C.Status == "")) return;
	DrawImageResize("Icons/Status/" + C.Status + (Math.floor(CommonTime() / 1000) % 3).toString() + ".png", X + 225 * Zoom, Y + 920 * Zoom, 50 * Zoom, 30 * Zoom);
}

/**
 * Draws the chatroom characters.
 * @param {boolean} DoClick - Whether or not a click was registered.
 * @returns {void} - Nothing.
 */
function ChatRoomDrawCharacter(DoClick) {

	// Intercepts the online game chat room clicks if we need to
	if (DoClick && OnlineGameClick()) return;

	// The darkness factors varies with blindness level (1 is bright, 0 is pitch black)
	let DarkFactor = CharacterGetDarkFactor(Player);

	// Check if we should use a custom background
	const CustomBG = !DoClick ? DrawGetCustomBackground() : "";
	const Background = CustomBG || ChatRoomData.Background;
	if (CustomBG && (DarkFactor === 0.0 || Player.GameplaySettings.SensDepChatLog == "SensDepLight")) DarkFactor = CharacterGetDarkFactor(Player, true);

	// Determine the horizontal & vertical position and zoom levels to fit all characters evenly in the room
	const Space = ChatRoomCharacterCount >= 2 ? 1000 / Math.min(ChatRoomCharacterCount, 5) : 500;

	// Gradually slide the characters around to make room
	let weight = ChatRoomSlideWeight;
	// Calculate a multiplier based on current framerate to keep the speed of the animation consistent across different framerates
	let frametimeAdjustment = TimerRunInterval / (1000 / 30);
	if (ChatRoomCharacterInitialize || !(Player.GraphicsSettings && Player.GraphicsSettings.SmoothZoom)) {
		ChatRoomCharacterInitialize = false;
		weight = 0;
	}

	const zoomFrameStep = (current) => (current * weight + ((ChatRoomCharacterCount >= 3 ? Space / 400 : 1))) / (weight + 1);
	const slideUpperFrameStep = (current) => (current * weight + 500 - 0.5 * Space * Math.min(ChatRoomCharacterCount, 5))/(weight + 1);
	const slideLowerFrameStep = (current) => (current * weight + 500 - 0.5 * Space * Math.max(1, ChatRoomCharacterCount - 5))/(weight + 1);

	for (let i = 0; i < frametimeAdjustment; i++) {
		const nextZoom = zoomFrameStep(ChatRoomCharacterZoom);
		const nextUpperX = slideUpperFrameStep(ChatRoomCharacterX_Upper);
		const nextLowerX = slideLowerFrameStep(ChatRoomCharacterX_Lower);

		if (weight === 0) {
			// skip unnecessary calculations
			ChatRoomCharacterZoom = nextZoom;
			ChatRoomCharacterX_Upper = nextUpperX;
			ChatRoomCharacterX_Lower = nextLowerX;
			break;
		}

		const frametimeRemainder = frametimeAdjustment - i;
		if (frametimeRemainder >= 1) {
			ChatRoomCharacterZoom = nextZoom;
			ChatRoomCharacterX_Upper = nextUpperX;
			ChatRoomCharacterX_Lower = nextLowerX;
		} else {
			ChatRoomCharacterZoom += (nextZoom - ChatRoomCharacterZoom) * frametimeRemainder;
			ChatRoomCharacterX_Upper += (nextUpperX - ChatRoomCharacterX_Upper) * frametimeRemainder;
			ChatRoomCharacterX_Lower += (nextLowerX - ChatRoomCharacterX_Lower) * frametimeRemainder;
		}
	}

	// The more players, the higher the zoom, also changes the drawing coordinates
	const Zoom = ChatRoomCharacterZoom;
	const X = ChatRoomCharacterCount >= 3 ? (Space - 500 * Zoom) / 2 : 0;
	const Y = ChatRoomCharacterCount <= 5 ? 1000 * (1 - Zoom) / 2 : 0;
	const InvertRoom = Player.GraphicsSettings.InvertRoom && Player.IsInverted();

	// Draw the background
	if (!DoClick) ChatRoomDrawBackground(Background, Y, Zoom, DarkFactor, InvertRoom);

	// Draw the characters (in click mode, we can open the character menu or start whispering to them)
	for (let C = 0; C < ChatRoomCharacterDrawlist.length; C++) {

		// Finds the X and Y position of the character based on it's room position
		let ChatRoomCharacterX = C >= 5 ? ChatRoomCharacterX_Lower : ChatRoomCharacterX_Upper;
		if (!(Player.GraphicsSettings && Player.GraphicsSettings.CenterChatrooms)) ChatRoomCharacterX = 0;
		const CharX = ChatRoomCharacterX + (ChatRoomCharacterCount == 1 ? 0 : X + (C % 5) * Space);
		const CharY = ChatRoomCharacterCount == 1 ? 0 : Y + Math.floor(C / 5) * 500;
		if ((ChatRoomCharacterCount == 1) && ChatRoomCharacterDrawlist[C].ID !== 0) continue;

		// Intercepts the clicks or draw
		if (DoClick) {
			if (MouseIn(CharX, CharY, Space, 1000 * Zoom)) return ChatRoomClickCharacter(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom, (MouseX - CharX) / Zoom, (MouseY - CharY) / Zoom, C);
		} else {

			// Draw the background a second time for characters 6 to 10 (we do it here to correct clipping errors from the first part)
			if (C === 5) ChatRoomDrawBackground(Background, 500, Zoom, DarkFactor, InvertRoom);

			// Draw the character, it's status bubble and it's overlay
			DrawCharacter(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom);
			DrawStatus(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom);
			if (ChatRoomCharacterDrawlist[C].MemberNumber != null) ChatRoomDrawCharacterOverlay(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom, C);

		}

	}
}

/**
 * Draw the background of a chat room
 * @param {string} Background - The name of the background image file
 * @param {number} Y - The starting Y co-ordinate of the image
 * @param {number} Zoom - The zoom factor based on the number of characters
 * @param {number} DarkFactor - The value (0 = fully visible, 1 = black) to tint the background
 * @param {boolean} InvertRoom - Whether the background image should be inverted
 * @returns {void} - Nothing
 */
function ChatRoomDrawBackground(Background, Y, Zoom, DarkFactor, InvertRoom) {
	if (DarkFactor > 0) {
		const BlurLevel = Player.GetBlurLevel();
		if (BlurLevel > 0) {
			MainCanvas.filter = `blur(${BlurLevel}px)`;
		}
		// Draw the zoomed background
		DrawImageZoomCanvas("Backgrounds/" + Background + ".jpg", MainCanvas, 500 * (2 - 1 / Zoom), 0, 1000 / Zoom, 1000, 0, Y, 1000, 1000 * Zoom, InvertRoom);
		MainCanvas.filter = 'none';

		// Draw an overlay if the character is partially blinded
		if (DarkFactor < 1.0) {
			DrawRect(0, Y, 1000, 1000 - Y, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");
		}
	}
	const Tints = Player.GetTints();
	for (const {r, g, b, a} of Tints) {
		DrawRect(0, Y, 1000, 1000 - Y, `rgba(${r},${g},${b},${a})`);
	}
}

/**
 * Draws any overlays on top of character
 * @param {Character} C The target character
 * @param {number} CharX Character's X position on canvas
 * @param {number} CharY Character's Y position on canvas
 * @param {number} Zoom Room zoom
 * @param {number} Pos Index of target character
 */
function ChatRoomDrawCharacterOverlay(C, CharX, CharY, Zoom, Pos) {
	// Draw the ghostlist/friendlist, whitelist/blacklist, admin icons
	if (ChatRoomHideIconState == 0) {
		if (Player.WhiteList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/WhiteList.png", CharX + 75 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		} else if (Player.BlackList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/BlackList.png", CharX + 75 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		if (Array.isArray(ChatRoomData.Admin) && ChatRoomData.Admin.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/Admin.png", CharX + 125 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		if (ChatRoomCarryingBounty(C)) {
			DrawImageResize("Icons/Small/Money.png", CharX + 225 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		// Warning icon when game versions don't match
		if (C.OnlineSharedSettings && C.OnlineSharedSettings.GameVersion !== GameVersion) {
			DrawImageResize("Icons/Small/Warning.png", CharX + 325 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		if (Player.GhostList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/GhostList.png", CharX + 375 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		} else if (Player.FriendList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/FriendList.png", CharX + 375 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
	}

	if (ChatRoomTargetMemberNumber == C.MemberNumber && ChatRoomHideIconState <= 1) {
		DrawImage("Icons/Small/Whisper.png", CharX + 75 * Zoom, CharY + 950 * Zoom);
	}

	if (ChatRoomMoveTarget !== null) {
		const MoveTargetPos = ChatRoomCharacter.findIndex(c => c.MemberNumber === ChatRoomMoveTarget);
		if (MoveTargetPos < 0) {
			ChatRoomMoveTarget = null;
		} else {
			if (ChatRoomMoveTarget === C.MemberNumber) {
				DrawButton(CharX + 200 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
				DrawImageResize("Icons/Remove.png", CharX + 202 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
			} else {
				if (Pos < MoveTargetPos) {
					DrawButton(CharX + 100 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
					DrawImageResize("Icons/Here.png", CharX + 102 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
				}
				DrawButton(CharX + 200 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
				DrawImageResize("Icons/Swap.png", CharX + 202 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
				if (Pos > MoveTargetPos) {
					DrawButton(CharX + 300 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
					DrawImageResize("Icons/Here.png", CharX + 302 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
				}
			}
		}
	}
}

/**
 * Called when character is clicked
 * @param {Character} C The target character
 * @param {number} CharX Character's X position on canvas
 * @param {number} CharY Character's Y position on canvas
 * @param {number} Zoom Room zoom
 * @param {number} ClickX Click X postion relative to character, without zoom
 * @param {number} ClickY Click Y postion relative to character, without zoom
 * @param {number} Pos Index of target character
 */
function ChatRoomClickCharacter(C, CharX, CharY, Zoom, ClickX, ClickY, Pos) {

	// Click on name
	if (ClickY > 900) {

		// Clicking on self or current target removes whisper target
		if (C.ID === 0 || ChatRoomTargetMemberNumber === C.MemberNumber) {
			ChatRoomSetTarget(null);
			return;
		}

		// BlockWhisper rule, if owner is in chatroom
		if (ChatRoomOwnerPresenceRule("BlockWhisper", C)) return;

		// Sensory deprivation setting: Total (no whispers) blocks whispers while blind unless both players are in the virtual realm. Then they can text each other.
		if (Player.GameplaySettings.SensDepChatLog === "SensDepExtreme" && Player.GetBlindLevel() >= 3 && !(Player.Effect.includes("VRAvatars") && C.Effect.includes("VRAvatars"))) return;

		// Sets the target
		ChatRoomSetTarget(C.MemberNumber);
		return;
	}

	// Moving character inside room
	if (ChatRoomMoveTarget !== null) {
		const MoveTargetPos = ChatRoomCharacter.findIndex(c => c.MemberNumber === ChatRoomMoveTarget);
		if (MoveTargetPos < 0) {
			ChatRoomMoveTarget = null;
		} else {
			if (Pos < MoveTargetPos && MouseIn(CharX + 100 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom)) {
				// Move left
				for (let i = 0; i < MoveTargetPos - Pos; i++) {
					ServerSend("ChatRoomAdmin", {
						MemberNumber: ChatRoomMoveTarget,
						Action: "MoveLeft",
						Publish: i === 0
					});
				}
				ChatRoomMoveTarget = null;
			} else if (MouseIn(CharX + 200 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom)) {
				// Swap or cancel
				if (ChatRoomMoveTarget !== C.MemberNumber) {
					ServerSend("ChatRoomAdmin", {
						MemberNumber: Player.ID,
						TargetMemberNumber: ChatRoomMoveTarget,
						DestinationMemberNumber: C.MemberNumber,
						Action: "Swap"
					});
				}
				ChatRoomMoveTarget = null;
			} else if ( Pos > MoveTargetPos && MouseIn(CharX + 300 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom)) {
				// Move right
				for (let i = 0; i < Pos - MoveTargetPos; i++) {
					ServerSend("ChatRoomAdmin", {
						MemberNumber: ChatRoomMoveTarget,
						Action: "MoveRight",
						Publish: i === 0
					});
				}
				ChatRoomMoveTarget = null;
			}
			return;
		}
	}

	// Disable examining when blind setting. If both players are in the virtual realm, then they can examine each other.
	if (Player.GameplaySettings.BlindDisableExamine && !(Player.Effect.includes("VRAvatars") && C.Effect.includes("VRAvatars")) && C.ID !== 0 && Player.GetBlindLevel() >= 3) {
		return;
	}

	// If the arousal meter is shown for that character, we can interact with it
	if (PreferenceArousalAtLeast(C, "Manual")) {
		let MeterShow = C.ID === 0;
		if (C.ID !== 0 && Player.ArousalSettings.ShowOtherMeter && C.ArousalSettings) {
			if (C.ArousalSettings.Visible === "Access") {
				MeterShow = C.AllowItem;
			} else if (C.ArousalSettings.Visible === "All") {
				MeterShow = true;
			}
		}
		if (MeterShow) {
			// The arousal meter can be maximized or minimized by clicking on it
			if (MouseIn(CharX + 60 * Zoom, CharY + 400 * Zoom, 80 * Zoom, 100 * Zoom) && !C.ArousalZoom) { C.ArousalZoom = true; return; }
			if (MouseIn(CharX + 50 * Zoom, CharY + 615 * Zoom, 100 * Zoom, 85 * Zoom) && C.ArousalZoom) { C.ArousalZoom = false; return; }

			// If the player can manually control her arousal, we set the progress manual and change the facial expression, it can trigger an orgasm at 100%
			if (C.ID === 0 && MouseIn(CharX + 50 * Zoom, CharY + 200 * Zoom, 100 * Zoom, 500 * Zoom) && C.ArousalZoom) {
				if (PreferenceArousalAtLeast(Player, "Manual") && !PreferenceArousalAtLeast(Player, "Automatic")) {
					var Arousal = Math.round((CharY + 625 * Zoom - MouseY) / (4 * Zoom));
					ActivitySetArousal(Player, Arousal);
					if (Player.ArousalSettings.AffectExpression) ActivityExpression(Player, Player.ArousalSettings.Progress);
					if (Player.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(Player);
				}
				return;
			}

			// Don't do anything if the thermometer is clicked without access to it
			if (MouseIn(CharX + 50 * Zoom, CharY + 200 * Zoom, 100 * Zoom, 415 * Zoom) && C.ArousalZoom) return;
		}
	}

	// Intercepts the online game character clicks if we need to
	if (OnlineGameClickCharacter(C)) return;

	// Gives focus to the character
	ChatRoomFocusCharacter(C);
}

/**
 * Select the character (open dialog) and clear other chatroom displays.
 * @param {Character} C - The character to focus on. Does nothing if null.
 * @returns {void} - Nothing
 */
function ChatRoomFocusCharacter(C) {
	if (ChatRoomOwnerPresenceRule("BlockAccessSelf", C)) return;
	if (ChatRoomOwnerPresenceRule("BlockAccessOther", C)) return;
	if (C == null) return;
	document.getElementById("InputChat").style.display = "none";
	document.getElementById("TextAreaChatLog").style.display = "none";
	ChatRoomChatHidden = true;
	ChatRoomBackground = ChatRoomData.Background;
	C.AllowItem = C.ID === 0 || ServerChatRoomGetAllowItem(Player, C);
	ChatRoomOwnershipOption = "";
	ChatRoomLovershipOption = "";
	if (C.ID !== 0) ServerSend("ChatRoomAllowItem", { MemberNumber: C.MemberNumber });
	if (C.IsOwnedByPlayer() || C.IsLoverOfPlayer()) ServerSend("ChatRoomChat", { Content: "RuleInfoGet", Type: "Hidden", Target: C.MemberNumber });
	CharacterSetCurrent(C);
}

/**
 * Sends the request to the server to check the current character's relationship status.
 * @returns {void} - Nothing.
 */
function ChatRoomCheckRelationships() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (C.ID != 0) ServerSend("AccountOwnership", { MemberNumber: C.MemberNumber });
	if (C.ID != 0) ServerSend("AccountLovership", { MemberNumber: C.MemberNumber });
}

/**
 * Displays /help content to the player if it's their first visit to a chatroom this session
 * @returns {void} - Nothing.
 */
function ChatRoomFirstTimeHelp() {
	if (!ChatRoomHelpSeen) {
		if (!Player.ChatSettings || Player.ChatSettings.ShowChatHelp)
			ChatRoomMessage({ Content: "ChatRoomHelp", Type: "Action", Sender: Player.MemberNumber });
		ChatRoomHelpSeen = true;
	}
}

/**
 * Sets the current whisper target and flags a target update
 * @param {number} MemberNumber - The target member number to set
 * @returns {void} - Nothing
 */
function ChatRoomSetTarget(MemberNumber) {
	if (MemberNumber !== ChatRoomTargetMemberNumber) {
		ChatRoomTargetMemberNumber = MemberNumber;
		ChatRoomTargetDirty = true;
	}
}

/**
 * Updates the chat input's placeholder text to reflect the current whisper target
 * @returns {void} - Nothing.
 */
function ChatRoomTarget() {
	// If the target member number hasn't changed, do nothing
	if (!ChatRoomTargetDirty) return;

	let TargetName = null;
	if (ChatRoomTargetMemberNumber != null) {
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) {
				TargetName = ChatRoomCharacter[C].Name;
				break;
			}
		if (TargetName == null) ChatRoomSetTarget(null);
	}
	let placeholder;
	if (ChatRoomTargetMemberNumber != null) {
		placeholder = TextGet("WhisperTo");
		placeholder += " " + TargetName;
	} else {
		placeholder = TextGet("PublicChat");
	}
	document.getElementById("InputChat").setAttribute("placeholder", placeholder);
}

/**
 * Updates the account to set the last chat room
 * @param {string} room - room to set it to. "" to reset.
 * @returns {void} - Nothing
 */
function ChatRoomSetLastChatRoom(room) {
	if (room != "") {
		if (!ChatRoomNewRoomToUpdate) {
			if (ChatRoomData && ChatRoomData.Background)
				Player.LastChatRoomBG = ChatRoomData.Background;
			if (ChatRoomData && ChatRoomData.Private != null) // false is valid
				Player.LastChatRoomPrivate = ChatRoomData.Private;
			if (ChatRoomData && ChatRoomData.Limit)
				Player.LastChatRoomSize = ChatRoomData.Limit;
			if (ChatRoomData && ChatRoomData.Language)
				Player.LastChatRoomLanguage = ChatRoomData.Language;
			if (ChatRoomData && ChatRoomData.Description != null) // empty string is valid
				Player.LastChatRoomDesc = ChatRoomData.Description;
			if (ChatRoomData && ChatRoomData.Admin)
				Player.LastChatRoomAdmin = ChatRoomData.Admin;
			if (ChatRoomData && ChatRoomData.Ban)
				Player.LastChatRoomBan = ChatRoomData.Ban;
			if (ChatRoomData && ChatRoomData.BlockCategory)
				Player.LastChatRoomBlockCategory = [...ChatRoomData.BlockCategory];

			ChatRoomLastName = ChatRoomData.Name;
			ChatRoomLastBG = ChatRoomData.Background;
			ChatRoomLastSize = ChatRoomData.Limit;
			ChatRoomLastLanguage = ChatRoomData.Language;
			ChatRoomLastPrivate = ChatRoomData.Private;
			ChatRoomLastDesc = ChatRoomData.Description;
			ChatRoomLastAdmin = ChatRoomData.Admin;
			ChatRoomLastBan = ChatRoomData.Ban;
			ChatRoomLastBlockCategory = [...ChatRoomData.BlockCategory];
		}
	} else {
		Player.LastChatRoomBG = "";
		Player.LastChatRoomPrivate = false;
		ChatRoomLastName = "";
		ChatRoomLastBG = "";
		ChatRoomLastSize = 0;
		ChatRoomLastPrivate = false;
		ChatRoomLastDesc = "";
		ChatRoomLastAdmin = [];
		ChatRoomLastBan = [];
		ChatRoomLastBlockCategory = [];
	}
	Player.LastChatRoom = room;
	var P = {
		LastChatRoom: Player.LastChatRoom,
		LastChatRoomBG: Player.LastChatRoomBG,
		LastChatRoomPrivate: Player.LastChatRoomPrivate,
		LastChatRoomSize: Player.LastChatRoomSize,
		LastChatRoomLanguage: Player.LastChatRoomLanguage,
		LastChatRoomDesc: Player.LastChatRoomDesc,
		LastChatRoomAdmin: Player.LastChatRoomAdmin.toString(),
		LastChatRoomBan: Player.LastChatRoomBan.toString(),
		LastChatRoomBlockCategory: [...Player.LastChatRoomBlockCategory],
	};
	ServerAccountUpdate.QueueData(P);
}

/**
 * Triggers a chat room message for stimulation events.
 *
 * Chance is calculated for worn items can cause stimulation (things like plugs
 * and crotch ropes), then one is randomly selected in the list and if it passes
 * a random chance check, it will send a player-only message.
 *
 * @param {StimulationAction} Action - The action that happened
 * @returns {void} - Nothing.
 */
function ChatRoomStimulationMessage(Action) {
	if (CurrentScreen !== "ChatRoom"
		|| Player.ImmersionSettings && !Player.ImmersionSettings.StimulationEvents
		|| !["Kneel", "Walk", "Struggle", "StruggleFail", "Talk"].includes(Action))
		return;

	const eventData = ChatRoomStimulationEvents[Action];
	if (!eventData) return;

	const arousal = Player.ArousalSettings && Player.ArousalSettings.Progress || 0;
	// Tracking for the PlugBoth event
	let isFilled = false;
	let isPlugged = false;

	// We go through every stimulating item and gather their effects
	const events = [];
	for (let A of Player.Appearance) {
		// First handle single items
		const filled = InventoryItemHasEffect(A, "FillVulva", true);
		const plugged = InventoryItemHasEffect(A, "IsPlugged", true);
		const gagged = InventoryItemHasEffect(A, "GagTotal", true) || InventoryItemHasEffect(A, "GagTotal2", true);
		const wearsCrotchRope = InventoryItemHasEffect(A, "CrotchRope", true);
		const canWiggle = InventoryItemHasEffect(A, "Wiggling");

		// Track modifiers for vibrating and inflated toys
		const inflated = InventoryGetItemProperty(A, "InflateLevel", true) || 0;
		const vibrating = InventoryItemHasEffect(A, "Vibrating", true);
		const vibeIntensity = InventoryGetItemProperty(A, "Intensity", true) || 0;

		if (wearsCrotchRope && eventData.Chance > 0) {
			let chance = eventData.Chance;
			chance += eventData.ArousalScaling * arousal / 100;
			events.push({ chance: chance, arousal: 2, item: A, event: "CrotchRope" });
		}

		if (gagged && eventData.TalkChance > 0) {
			events.push({ chance: eventData.TalkChance, arousal: 12, item: A, event: "Talk" });
		}

		if ((filled || plugged) && eventData.Chance > 0) {
			let name = filled ? "PlugFront" : "PlugBack";
			let chance = eventData.Chance;
			chance += eventData.ArousalScaling * arousal / 100;
			let evtArousal = 1;
			if (vibrating) {
				chance += eventData.VibeScaling * (vibeIntensity + 1);
				evtArousal += (vibeIntensity + 1);
			}
			events.push({ chance: chance, arousal: evtArousal, item: A, event: name });
			isFilled = isFilled || filled;
			isPlugged = isPlugged || plugged;
		}

		if (vibrating && eventData.Chance > 0) {
			let chance = eventData.Chance;
			chance += eventData.VibeScaling * (vibeIntensity + 1);
			chance += eventData.ArousalScaling * arousal / 100;
			events.push({ chance: chance, arousal: (vibeIntensity + 1), item: A, event: "Vibe" });
		}

		if (inflated > 0 && eventData.Chance > 0) {
			let chance = eventData.Chance;
			chance += eventData.InflationScaling * inflated / 4;
			chance += eventData.ArousalScaling * arousal / 100;
			events.push({ chance: chance, arousal: inflated / 2, item: A, event: "Inflated" });
		}

		if (canWiggle && eventData.Chance > 0) {
			let chance = eventData.Chance;
			chance += eventData.ArousalScaling * arousal / 100;
			events.push({ chance: chance, arousal: 1, item: A, event: "Wiggling" });
		}
	}

	// If the player is both plugged and filled, insert a special event for that
	if (isFilled && isPlugged) {
		// Dummy item
		let A = InventoryGet(Player, "ItemVulva");
		let chance = eventData.Chance;
		chance += eventData.ArousalScaling * arousal / 100;
		events.push({ chance: chance, arousal: 2, item: A, event: "PlugBoth" });
	}

	if (!events.length)
		return;

	// Pick a random event, and check it
	const event = CommonRandomItemFromList({}, events);

	const dice = Math.random();
	if (dice > event.chance)
		return;

	// We have a trigger message, send it out!
	if ((Player.ChatSettings != null) && (Player.ChatSettings.ShowActivities != null) && !Player.ChatSettings.ShowActivities) return;

	// Increase player arousal to the zone
	if (!Player.IsEdged() && arousal < 70 - event.arousal && event.event != "Talk")
		ActivityEffectFlat(Player, Player, event.arousal, event.item.Asset.Group.Name, 1);
	const duration = (Math.random() + event.arousal / 2.4) * 500;
	DrawFlashScreen("#FFB0B0", duration, 140);
	CharacterSetFacialExpression(Player, "Blush", "VeryHigh", Math.ceil(duration / 250));

	var index = Math.floor(Math.random() * 3);
	const Dictionary = [
		{ Tag: "AssetGroup", Text: event.item.Asset.Group.Description.toLowerCase() },
		{ Tag: "AssetName", Text: (event.item.Asset.DynamicDescription ? event.item.Asset.DynamicDescription(Player) : event.item.Asset.Description).toLowerCase() },
	];
	ChatRoomMessage({ Content: "ChatRoomStimulationMessage" + event.event + index.toString(), Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary, });
}

/**
 * Called when screen size or position changes or after screen load
 * @param {boolean} load - If the reason for call was load (`true`) or window resize (`false`)
 */
function ChatRoomResize(load) {
	if (
		CharacterGetCurrent() == null
		&& CurrentScreen == "ChatRoom"
		&& document.getElementById("InputChat")
		&& document.getElementById("TextAreaChatLog")
	) {
		ElementPositionFix("TextAreaChatLog", ChatRoomFontSize, 1005, 66, 988, 835);
		ElementPosition("InputChat", 1456, 950, 900, 82);
	}
}

/**
 * Draws arousal screen filter
 * @param {number} y1 - Y to draw filter at.
 * @param {number} h - Height of filter
 * @param {number} Width - Width of filter
 * @param {number} ArousalOverride - Override to the existing arousal value
 * @returns {void} - Nothing.
 */
function ChatRoomDrawArousalScreenFilter(y1, h, Width, ArousalOverride, Color = '255, 100, 176', AlphaBonus = 0) {
	let Progress = (ArousalOverride) ? ArousalOverride : Player.ArousalSettings.Progress;
	let amplitude = 0.24 * Math.min(1, 2 - 1.5 * Progress/100); // Amplitude of the oscillation
	let percent = Progress/100.0;
	let level = Math.min(0.5, percent) + 0.5 * Math.pow(Math.max(0, percent*2 - 1), 4);
	let oscillation = Math.sin(CommonTime() / 1000 % Math.PI);
	let alpha = Math.min(1.0, AlphaBonus + 0.6 * level * (0.99 - amplitude + amplitude * oscillation));

	if (Player.ArousalSettings.VFXFilter == "VFXFilterHeavy") {
		const Grad = MainCanvas.createLinearGradient(0, y1, 0, h);
		let alphamin = Math.max(0, alpha / 2 - 0.05);
		Grad.addColorStop(0, `rgba(${Color}, ${alpha})`);
		Grad.addColorStop(0.1 + 0.2*percent * (1.2 + 0.2 * oscillation), `rgba(${Color}, ${alphamin})`);
		Grad.addColorStop(0.5, `rgba(${Color}, ${alphamin/2})`);
		Grad.addColorStop(0.9 - 0.2*percent * (1.2 + 0.2 * oscillation), `rgba(${Color}, ${alphamin})`);
		Grad.addColorStop(1, `rgba(${Color}, ${alpha})`);
		MainCanvas.fillStyle = Grad;
		MainCanvas.fillRect(0, y1, Width, h);
	} else {
		if (Player.ArousalSettings.VFXFilter != "VFXFilterMedium") {
			alpha = (Progress >= 91) ? 0.25 : 0;
		} else alpha /= 2;
		if (alpha > 0)
			DrawRect(0, y1, Width, h, `rgba(${Color}, ${alpha})`);
	}
}
/**
 * Draws vibration screen filter for the specified player
 * @param {number} y1 - Y to draw filter at.
 * @param {number} h - Height of filter
 * @param {number} Width - Width of filter
 * @param {Character} C - Player to draw it for
 * @returns {void} - Nothing.
 */
function ChatRoomVibrationScreenFilter(y1, h, Width, C) {
	let VibratorLevelLower = 0;
	let VibratorLevelUpper = 0;
	for (let A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A] && C.Appearance[A].Property) {
			let property = C.Appearance[A].Property;
			if (property.Effect && property.Effect.includes("Vibrating") && property.Intensity >= 0) {
				let intensity = property.Intensity + 1;
				let group = (C.Appearance[A].Asset && C.Appearance[A].Asset.Group) ? C.Appearance[A].Asset.Group.Name : "";
				if (group == "ItemVulva" || group == "ItemPelvis" || group == "ItemButt" || group == "ItemVulvaPiercings") {
					VibratorLevelLower += (100 -VibratorLevelLower) * 0.7*Math.min(1, intensity/4);
				} else {
					VibratorLevelUpper += (100 -VibratorLevelUpper) * 0.7*Math.min(1, intensity/4);
				}
			}
		}
	}
	ChatRoomDrawVibrationScreenFilter(y1, h, Width, VibratorLevelLower, VibratorLevelUpper);
}

/**
 * Draws vibration screen filter
 * @param {number} y1 - Y to draw filter at.
 * @param {number} h - Height of filter
 * @param {number} Width - Width of filter
 * @param {number} VibratorLower - 1-100 Strength of the vibrator "Down There"
 * @param {number} VibratorSides - 1-100 Strength of the vibrator at the breasts/nipples
 * @returns {void} - Nothing.
 */
function ChatRoomDrawVibrationScreenFilter(y1, h, Width, VibratorLower, VibratorSides) {
	let amplitude = 0.24; // Amplitude of the oscillation
	let percentLower = VibratorLower/100.0;
	let percentSides = VibratorSides/100.0;
	let level = Math.min(0.5, Math.max(percentLower, percentSides)) + 0.5 * Math.pow(Math.max(0, Math.max(percentLower, percentSides)*2 - 1), 4);
	let oscillation = Math.sin(CommonTime() / 1000 % Math.PI);
	if (Player.ArousalSettings.VFXVibrator != "VFXVibratorAnimated") oscillation = 0;
	let alpha = 0.6 * level * (0.99 - amplitude + amplitude * oscillation);

	if (VibratorLower > 0) {
		const Grad = MainCanvas.createRadialGradient(Width/2, y1, 0, Width/2, y1, h);
		let alphamin = Math.max(0, alpha / 2 - 0.05);
		let modifier = (Player.ArousalSettings.VFXVibrator == "VFXVibratorAnimated") ? Math.random() * 0.01: 0;
		Grad.addColorStop(VibratorLower / 100 * (0.7 + modifier), `rgba(255, 100, 176, 0)`);
		Grad.addColorStop(VibratorLower / 100 * (0.85 - 0.1*percentLower * (0.5 * oscillation)), `rgba(255, 100, 176, ${alphamin})`);
		Grad.addColorStop(1, `rgba(255, 100, 176, ${alpha})`);
		MainCanvas.fillStyle = Grad;
		MainCanvas.fillRect(0, y1, Width, h);
	}
	if (VibratorSides > 0) {
		let Grad = MainCanvas.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(h*h + Width*Width));
		let alphamin = Math.max(0, alpha / 2 - 0.05);
		let modifier = (Player.ArousalSettings.VFXVibrator == "VFXVibratorAnimated") ? Math.random() * 0.01: 0;
		Grad.addColorStop(VibratorSides / 100 * (0.8 + modifier), `rgba(255, 100, 176, 0)`);
		Grad.addColorStop(VibratorSides / 100 * (0.9 - 0.07*percentSides * (0.5 * oscillation)), `rgba(255, 100, 176, ${alphamin})`);
		Grad.addColorStop(1, `rgba(255, 100, 176, ${alpha})`);
		MainCanvas.fillStyle = Grad;
		MainCanvas.fillRect(0, y1, Width, h);

		Grad = MainCanvas.createRadialGradient(Width, 0, 0, Width, 0, Math.sqrt(h*h + Width*Width));
		modifier = (Player.ArousalSettings.VFXVibrator == "VFXVibratorAnimated") ? Math.random() * 0.01: 0;
		Grad.addColorStop(VibratorSides / 100 * (0.8 + modifier), `rgba(255, 100, 176, 0)`);
		Grad.addColorStop(VibratorSides / 100 * (0.9 - 0.07*percentSides * (0.5 * oscillation)), `rgba(255, 100, 176, ${alphamin})`);
		Grad.addColorStop(1, `rgba(255, 100, 176, ${alpha})`);
		MainCanvas.fillStyle = Grad;
		MainCanvas.fillRect(0, y1, Width, h);
	}
}

/**
 * Runs the chatroom online bounty loop.
 * @returns {void} - Nothing.
 */
function ChatRoomUpdateOnlineBounty() {
	if (KidnapLeagueSearchingPlayers.length > 0) {
		let misc = InventoryGet(Player, "ItemMisc");
		if (misc && misc.Asset && (misc.Asset.Name == "BountySuitcase" || misc.Asset.Name == "BountySuitcaseEmpty")) {
			if (KidnapLeagueSearchFinishTime > 0 && CommonTime() > KidnapLeagueSearchFinishTime) {
				for (let C = 0; C < ChatRoomCharacter.length; C++) {
					if (KidnapLeagueSearchingPlayers.includes(ChatRoomCharacter[C].MemberNumber)) {
						ServerSend("ChatRoomChat", { Content: "ReceiveSuitcaseMoney", Type: "Hidden", Target: ChatRoomCharacter[C].MemberNumber });
					}
				}
				if (misc.Asset.Name == "BountySuitcase") {
					InventoryRemove(Player, "ItemMisc");
					InventoryWear(Player, "BountySuitcaseEmpty", "ItemMisc");
					ChatRoomMessage({ Content: "OnlineBountySuitcaseEnd", Type: "Action", Sender: Player.MemberNumber });
					KidnapLeagueSearchFinishTime = 0;
					KidnapLeagueSearchingPlayers = [];
					ChatRoomCharacterItemUpdate(Player, "ItemMisc");
				} else {
					ChatRoomMessage({ Content: "OnlineBountySuitcaseEndOpened", Type: "Action", Sender: Player.MemberNumber });
					KidnapLeagueSearchFinishTime = 0;
					KidnapLeagueSearchingPlayers = [];
					if (!misc.Property) misc.Property = {};
					if (!misc.Property.Iterations) misc.Property.Iterations = 0;
					misc.Property.Iterations = misc.Property.Iterations + 1;
					ChatRoomCharacterItemUpdate(Player, "ItemMisc");
				}

			}
			let KidnapLeagueSearchingPlayersNew = [];
			for (let C = 0; C < ChatRoomCharacter.length; C++) {
				if (ChatRoomCharacter[C].CanInteract() && KidnapLeagueSearchingPlayers.includes(ChatRoomCharacter[C].MemberNumber)) {
					KidnapLeagueSearchingPlayersNew.push(ChatRoomCharacter[C].MemberNumber);
				}
			}
			KidnapLeagueSearchingPlayers = KidnapLeagueSearchingPlayersNew;
		} else {
			KidnapLeagueSearchingPlayers = [];
			KidnapLeagueSearchFinishTime = 0;
		}
	} else {
		if (KidnapLeagueSearchFinishTime > 0) {
			if (InventoryIsWorn(Player, "BountySuitcase", "ItemMisc"))
				ChatRoomPublishCustomAction("OnlineBountySuitcaseEndEarly", true, [
					{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
				]);
			else if (InventoryIsWorn(Player, "BountySuitcaseEmpty", "ItemMisc"))
				ChatRoomPublishCustomAction("OnlineBountySuitcaseEndEarlyOpened", true, [
					{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
				]);
		}

		KidnapLeagueSearchFinishTime = 0;
	}
	if (!Player.CanInteract()) {
		KidnapLeagueOnlineBountyTarget = 0;
	}

}

/**
 * Updates the local view of character status
 * @param {Character} C - The character whose status we're updating
 * @param {string | null} Status - The new status to use
 * @returns {void} - Nothing.
 */
function ChatRoomStatusUpdateLocalCharacter(C, Status) {
	C.Status = ((Status == "") || (Status == "null")) ? null : Status;
	C.StatusTimer = (Status == "Talk") ? CommonTime() + 5000 : null;
}

/**
 * Updates the player status if needed and sends that new status in a chat message
 * @param {string | null} Status - The new status to use
 * @returns {void} - Nothing.
 */
function ChatRoomStatusUpdate(Status) {
	if (Status == Player.Status) return;
	if ((Player.OnlineSettings != null) && (Player.OnlineSettings.SendStatus != null) && (Player.OnlineSettings.SendStatus == false) && (Status != null)) return;
	ChatRoomStatusUpdateLocalCharacter(Player, Status);
	ServerSend("ChatRoomChat", { Content: ((Status == null) ? "null" : Status), Type: "Status" });
}

let ChatRoomStatusDeadKeys = [
	"Shift", "Control", "Alt", "Meta", "Fn", "Escape", "Dead",
	"ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
];

/**
 * Sends the "Talk" status to other players if the player typed in the text box and there's a value in it
 * @param {KeyboardEvent} Key
 * @returns {void} - Nothing.
 */
function ChatRoomStatusUpdateTalk(Key) {
	// Prevent dead keys from doing anything with the status
	if (ChatRoomStatusDeadKeys.includes(Key.key))
		return;

	const text = ElementValue("InputChat");
	let talking = true;
	// Not talking if no chat input
	if (!text) {
		talking = false;
	}
	// Don't send a public update if whispering someone
	else if (ChatRoomTargetMemberNumber != null) {
		talking = false;
	}
	// Not talking if entering a command that does not end up in chat
	else if (text.startsWith("/") && !text.startsWith("//") && !text.startsWith("/me ") && !text.startsWith("/action ")) {
		talking = false;
	}
	// No longer talking if pressed enter
	else if (Key.key == "Enter") {
		talking = false;
	}
	// Not talking if only one character in input: require at least 2 characters to prevent misclicks etc. from triggering unnecessary status updates
	else if (text.length <= 2) {
		talking = false;
	}
	ChatRoomStatusUpdate(talking ? "Talk" : null);
}

/**
 * Checks if status has expired or is otherwise no longer valid and resets status if so
 * @returns {void} - Nothing.
 */
function ChatRoomStatusCheckExpiration() {
	const isCrawling = (Player.Status == "Crawl") && (ChatRoomSlowtimer > 0) && (ChatRoomSlowStop == false) && Player.IsSlow();
	if (Player.StatusTimer) {
		if (Player.StatusTimer < CommonTime()) {
			ChatRoomStatusUpdate(null);
		}
	} else if (!isCrawling) {
		ChatRoomStatusUpdate(null);
	}
}

/**
 * Runs the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomRun() {

	// Handles online GGTS & bounty game
	AsylumGGTSProcess();
	ChatRoomUpdateOnlineBounty();

	// Draws the chat room controls
	ChatRoomStatusCheckExpiration();
	ChatRoomUpdateDisplay();
	ChatRoomCreateElement();
	ChatRoomFirstTimeHelp();
	ChatRoomTarget();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	if (ChatRoomChatHidden) {
		ChatRoomChatHidden = false;
		ChatRoomResize(false);
	}
	DrawButton(1905, 908, 90, 90, "", "White", "Icons/Chat.png");
	if (!ChatRoomCanLeave() && ChatRoomSlowtimer != 0){//Player got interrupted while trying to leave. (Via a bind)
		ServerSend("ChatRoomChat", { Content: "SlowLeaveInterrupt", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber}]});
		ServerSend("ChatRoomChat", { Content: "SlowLeaveInterrupt", Type: "Hidden", Dictionary: [{Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber}]});
		ChatRoomSlowtimer = 0;
		ChatRoomSlowStop = false;
	}

	const PlayerIsSlow = Player.IsSlow();

	// If the player is slow (ex: ball & chains), she can leave the room with a timer and can be blocked by others
	if (PlayerIsSlow && ChatRoomCanLeave() && (ChatRoomSlowStop == false)) {
		if (ChatRoomSlowtimer == 0) DrawButton(1005, 2, 120, 60, "", "#FFFF00", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
		if ((CurrentTime < ChatRoomSlowtimer) && (ChatRoomSlowtimer != 0)) DrawButton(1005, 2, 120, 60, "", "White", "Icons/Rectangle/Cancel.png", TextGet("MenuCancel"));
		if ((CurrentTime > ChatRoomSlowtimer) && (ChatRoomSlowtimer != 0)) {
			ChatRoomSlowtimer = 0;
			ChatRoomSlowStop = false;
			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ChatRoomSetLastChatRoom("");
			ServerSend("ChatRoomLeave", "");
			CommonSetScreen("Online", "ChatSearch");
		}
	}

	if (CurrentTime > ChatRoomGetUpTimer) {
		ChatRoomGetUpTimer = 0;
	}

	// If the player is slow and was stopped from leaving by another player
	if ((ChatRoomSlowStop == true) && PlayerIsSlow) {
		DrawButton(1005, 2, 120, 60, "", "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
		if (CurrentTime > ChatRoomSlowtimer) {
			ChatRoomSlowtimer = 0;
			ChatRoomSlowStop = false;
		}
	}

	// Draws the top buttons in pink if they aren't available
	if (!PlayerIsSlow || (ChatRoomSlowtimer == 0 && !ChatRoomCanLeave())){
		if (ChatRoomSlowtimer != 0) ChatRoomSlowtimer = 0;
		DrawButton(1005, 2, 120, 60, "", (ChatRoomCanLeave()) ? "White" : "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
	}

	// Draw the buttons at the top-right
	ChatRoomMenuDraw();

	// In orgasm mode, we add a pink filter and different controls depending on the stage.  The pink filter shows a little above 90
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Active != "Inactive") && (Player.ArousalSettings.Active != "NoMeter")) {
		if ((Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {
			DrawRect(0, 0, 1003, 1000, "#FFB0B0B0");
			DrawRect(1003, 0, 993, 63, "#FFB0B0B0");
			if (Player.ArousalSettings.OrgasmStage == null) Player.ArousalSettings.OrgasmStage = 0;
			if (Player.ArousalSettings.OrgasmStage == 0) {
				DrawText(TextGet("OrgasmComing"), 500, 410, "White", "Black");
				DrawButton(200, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(550, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (Player.ArousalSettings.OrgasmStage == 1) DrawButton(ActivityOrgasmGameButtonX, ActivityOrgasmGameButtonY, 250, 64, ActivityOrgasmResistLabel, "White");
			if (ActivityOrgasmRuined) ActivityOrgasmControl();
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 500, 500, "White", "Black");
			ActivityOrgasmProgressBar(50, 970);
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 1) && (Player.ArousalSettings.Progress <= 99) && !CommonPhotoMode) {
			let y1 = 0;
			let h = 1000;

			if (ChatRoomCharacterCount == 3) {y1 = 50; h = 900;}
			else if (ChatRoomCharacterCount == 4) {y1 = 150; h = 700;}
			else if (ChatRoomCharacterCount == 5) {y1 = 250; h = 500;}

			ChatRoomDrawArousalScreenFilter(y1, h, 1003, Player.ArousalSettings.Progress);
		}
	}

	if (Player.ArousalSettings.VFXVibrator == "VFXVibratorSolid" || Player.ArousalSettings.VFXVibrator == "VFXVibratorAnimated") {
		let y1 = 0;
		let h = 1000;

		if (ChatRoomCharacterCount == 3) {y1 = 50; h = 900;}
		else if (ChatRoomCharacterCount == 4) {y1 = 150; h = 700;}
		else if (ChatRoomCharacterCount == 5) {y1 = 250; h = 500;}

		ChatRoomVibrationScreenFilter(y1, h, 1003, Player);
	}

	// Runs any needed online game script
	OnlineGameRun();

	// Clear notifications if needed
	ChatRoomNotificationReset();

	// Recreates the chatroom with the stored chatroom data if necessary
	ChatRoomRecreate();
}

/**
 * Draws the chat room menu buttons
 * @returns {void} - Nothing
 */
function ChatRoomMenuDraw() {
	const Space = 870 / (ChatRoomMenuButtons.length - 1);
	let ButtonColor = "White";
	for (let B = 0; B < ChatRoomMenuButtons.length; B++) {
		let Button = ChatRoomMenuButtons[B];
		if (Button === "Exit") continue; // handled in ChatRoomRun()
		const ImageSuffix = Button === "Icons" ? ChatRoomHideIconState.toString() : "";
		if (Button === "Kneel" && !Player.CanKneel()) {
			if (ChatRoomGetUpTimer === 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel())) {
				ButtonColor = "Yellow";
			} else {
				ButtonColor = "Pink";
			}
		} else if (Button === "Dress" && !Player.CanChangeOwnClothes()) {
			ButtonColor = "Pink";
		} else {
			ButtonColor = "White";
		}
		DrawButton(1005 + Space * B, 2, 120, 60, "", ButtonColor, "Icons/Rectangle/" + Button + ImageSuffix + ".png", TextGet("Menu" + Button));
	}
}

/**
 * Handles clicks the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomClick() {

	// In orgasm mode, we do not allow any clicks expect the chat
	if (MouseIn(1905, 910, 90, 90)) ChatRoomSendChat();
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if (MouseIn(200, 532, 250, 68) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if (MouseIn(550, 532, 250, 68) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX) && (MouseX <= ActivityOrgasmGameButtonX + 250) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// When the user chats or clicks on a character
	if (MouseIn(0, 0, 1000, 1000)) ChatRoomDrawCharacter(true);

	// When the user clicks a menu button in the top-right
	if (MouseYIn(0, 62)) ChatRoomMenuClick();
}

/**
 * Process chat room menu button clicks
 * @returns {void} - Nothing
 */
function ChatRoomMenuClick() {
	const Space = 870 / (ChatRoomMenuButtons.length - 1);
	for (let B = 0; B < ChatRoomMenuButtons.length; B++) {
		if (MouseXIn(1005 + Space * B, 120)) {
			switch (ChatRoomMenuButtons[B]) {
				case "Exit": {
					const PlayerIsSlow = Player.IsSlow();
					// When the user leaves
					if (ChatRoomCanLeave() && !PlayerIsSlow) {
						DialogLentLockpicks = false;
						ChatRoomClearAllElements();
						ServerSend("ChatRoomLeave", "");
						ChatRoomSetLastChatRoom("");
						// Clear leash since the player has escaped
						ChatRoomLeashPlayer = null;
						CommonSetScreen("Online", "ChatSearch");
						CharacterDeleteAllOnline();
					}
					// When the player is slow and attempts to leave
					if (ChatRoomCanLeave() && PlayerIsSlow) {
						// If the player clicked to leave, we start a timer based on evasion level and send a chat message
						if ((ChatRoomSlowtimer == 0) && (ChatRoomSlowStop == false)) {
							ServerSend("ChatRoomChat", { Content: "SlowLeaveAttempt", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
							ChatRoomStatusUpdate("Crawl");
							ChatRoomSlowtimer = CurrentTime + (10 * (1000 - (50 * SkillGetLevelReal(Player, "Evasion"))));
						}
						// If the player clicked to cancel leaving, we alert the room and stop the timer
						else if ((ChatRoomSlowtimer != 0) && (ChatRoomSlowStop == false)) {
							ServerSend("ChatRoomChat", { Content: "SlowLeaveCancel", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
							ChatRoomSlowtimer = 0;
						}
					}
					break;
				}
				case "Cut":
					// When the user wants to remove the top part of his chat to speed up the screen, we only keep the last 20 entries
					var L = document.getElementById("TextAreaChatLog");
					while (L.childElementCount > 20)
						L.removeChild(L.childNodes[0]);
					ElementScrollToEnd("TextAreaChatLog");
					break;
				case "GameOption":
					// The cut button can become the game option button if there's an online game going on
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					CommonSetScreen("Online", "Game" + ChatRoomGame);
					break;
				case "Kneel":
					// When the user character kneels
					if (ChatRoomOwnerPresenceRule("BlockChangePose", Player)) return;
					if (Player.CanKneel()) {
						const PlayerIsKneeling = Player.IsKneeling();
						ServerSend("ChatRoomChat", { Content: PlayerIsKneeling ? "StandUp" : "KneelDown", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
						FuturisticTrainingBeltStandUpFlag = Player.IsKneeling();
						CharacterSetActivePose(Player, PlayerIsKneeling ? "BaseLower" : "Kneel");
						ChatRoomStimulationMessage("Kneel");
						ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
					} else if (ChatRoomGetUpTimer == 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel())) { // If the player can theoretically get up, we start a minigame!
						var diff = 0;
						if (Player.IsBlind()) diff += 1;
						if (Player.IsKneeling()) diff += 2;
						if (Player.IsDeaf()) diff += 1;
						if (InventoryGet(Player, "ItemTorso") || InventoryGroupIsBlocked(Player, "ItemTorso")) diff += 1;
						if (InventoryGroupIsBlocked(Player, "ItemHands")) diff += 1;
						if (InventoryGet(Player, "ItemArms")) diff += 1;
						if (InventoryGet(Player, "ItemLegs") || InventoryGroupIsBlocked(Player, "ItemLegs")) diff += 1;
						if (InventoryGet(Player, "ItemFeet") || InventoryGroupIsBlocked(Player, "ItemFeet")) diff += 1;
						if (InventoryGet(Player, "ItemBoots")) diff += 2;

						MiniGameStart("GetUp", diff, "ChatRoomAttemptStandMinigameEnd");
					}
					break;
				case "Icons":
					// When the user toggles icon visibility
					ChatRoomHideIconState += 1;
					if (ChatRoomHideIconState > 3) ChatRoomHideIconState = 0;
					break;
				case "Camera":
					// When the user takes a photo of the room
					ChatRoomPhotoFullRoom();
					break;
				case "Dress":
					// When the user wants to change clothes
					if (Player.CanChangeOwnClothes()) {
						document.getElementById("InputChat").style.display = "none";
						document.getElementById("TextAreaChatLog").style.display = "none";
						CharacterAppearanceReturnRoom = "ChatRoom";
						CharacterAppearanceReturnModule = "Online";
						ChatRoomStatusUpdate("Wardrobe");
						CharacterAppearanceLoadCharacter(Player);
					}
					break;
				case "Profile":
					// When the user checks her profile
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					ChatRoomStatusUpdate("Preference");
					InformationSheetLoadCharacter(Player);
					break;
				case "Admin":
					// When the user enters the room administration screen
					if ((ChatRoomData != null) && ChatRoomData.Private && (ChatSearchReturnToScreen == "AsylumGGTS")) return AsylumGGTSMessage("NoAdminPrivate");
					if ((ChatRoomData != null) && ChatRoomData.Locked && (ChatRoomData.Game == "GGTS")) return AsylumGGTSMessage("NoAdminLocked");
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					ChatRoomStatusUpdate("Preference");
					CommonSetScreen("Online", "ChatAdmin");
					break;
			}
		}
	}
}

function ChatRoomAttemptStandMinigameEnd() {

	if (MiniGameVictory)  {
		if (MiniGameType == "GetUp"){
			ServerSend("ChatRoomChat", { Content: (!Player.IsKneeling()) ? "KneelDownPass" : "StandUpPass", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
			FuturisticTrainingBeltStandUpFlag = Player.IsKneeling();
			CharacterSetActivePose(Player, (!Player.IsKneeling()) ? "Kneel" : null, true);
			ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
		}
	} else {
		if (MiniGameType == "GetUp") {
			ChatRoomGetUpTimer = CurrentTime + 15000;
			ServerSend("ChatRoomChat", { Content: (!Player.IsKneeling()) ? "KneelDownFail" : "StandUpFail", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
			if (!Player.IsKneeling()) {
				CharacterSetFacialExpression(Player, "Eyebrows", "Soft", 15);
				CharacterSetFacialExpression(Player, "Blush", "Medium", 15);
				CharacterSetFacialExpression(Player, "Eyes", "Dizzy", 15);
			}
		}
	}

	CommonSetScreen("Online", "ChatRoom");
}

/**
 * Checks if the player can leave the chatroom.
 * @returns {boolean} - Returns TRUE if the player can leave the current chat room.
 */
function ChatRoomCanLeave() {
	if (ChatRoomLeashPlayer != null) {
		if (ChatRoomCanBeLeashedBy(0, Player)) {
			return false;
		} else ChatRoomLeashPlayer = null;
	}
	if (!Player.CanWalk()) return false; // Cannot leave if cannot walk
	if (ChatRoomData.Locked && (ChatRoomData.Game == "GGTS")) return false; // GGTS game can forbid anyone to leave
	if (!ChatRoomData.Locked || ChatRoomPlayerIsAdmin()) return true; // Can leave if the room isn't locked or is an administrator
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0)
			return false; // Cannot leave if the room is locked and there's an administrator inside
	return true; // Can leave if the room is locked and there's no administrator inside
}

/**
 * Handles keyboard shortcuts in the chatroom screen.
 * @param {KeyboardEvent} event - The event that triggered this
 * @returns {void} - Nothing.
 */
function ChatRoomKeyDown(event) {

	// If the input text is not focused and not on mobile, set the focus to it
	if (document.activeElement.id != "InputChat") ElementFocus("InputChat");

	if (KeyPress == 9 && !event.shiftKey) {
		event.preventDefault();
		event.stopImmediatePropagation();
		CommandAutoComplete(ElementValue("InputChat"));
	}

	// The ENTER key sends the chat.  The "preventDefault" is needed for <textarea>, otherwise it adds a new line after clearing the field
	if (KeyPress == 13 && !event.shiftKey) {
		event.preventDefault();
		ChatRoomSendChat();
	}

	// On page up, we show the previous chat typed
	if (KeyPress == 33) {
		if (ChatRoomLastMessageIndex > 0) ChatRoomLastMessageIndex--;
		ElementValue("InputChat", ChatRoomLastMessage[ChatRoomLastMessageIndex]);
	}

	// On page down, we show the next chat typed
	if (KeyPress == 34) {
		ChatRoomLastMessageIndex++;
		if (ChatRoomLastMessageIndex > ChatRoomLastMessage.length - 1) ChatRoomLastMessageIndex = ChatRoomLastMessage.length - 1;
		ElementValue("InputChat", ChatRoomLastMessage[ChatRoomLastMessageIndex]);
	}

	// On escape, scroll to the bottom of the chat
	if (KeyPress == 27) ElementScrollToEnd("TextAreaChatLog");
}

/**
 * Sends the chat message to the room
 * @returns {void} - Nothing.
 */
function ChatRoomSendChat() {

	// If there's a message to send
	const msg = ElementValue("InputChat").trim();
	if (msg != "") {

		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		ChatRoomLastMessage.push(msg);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;

		CommandParse(msg);
	}
}

/**
 * Sends message to user with HTML tags
 * @param {string} Content - InnerHTML for the message
 * @param {number} [Timeout] - total time to display the message in ms
 * @returns {void} - Nothing
 */
function ChatRoomSendLocal(Content, Timeout) {
	ChatRoomMessage({
		Sender: Player.MemberNumber,
		Type: "LocalMessage",
		Content, Timeout,
	});
}

/**
 * Removes (*) (/me) (/action) then sends message as emote
 * @param {string} msg - Emote message
 * @returns {void} - Nothing
 */
function ChatRoomSendEmote(msg) {
	// Emotes can be prevented with an owner presence rule
	if (ChatRoomOwnerPresenceRule("BlockEmote", null)) return;
	if (Player.ChatSettings.MuStylePoses && msg.startsWith(":")) msg = msg.substring(1);
	else {
		msg = msg.replace(/^\*/, "").replace(/\*$/, "");
		if (msg.startsWith(CommandsKey + "me ")) msg = msg.replace(CommandsKey + "me ", "");
		if (msg.startsWith(CommandsKey + "action ")) msg = msg.replace(CommandsKey + "action ", "*");
	}
	msg = msg.trim();
	if (msg != "" && msg != "*") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });
}

/**
 * Publishes common player actions (add, remove, swap) to the chat.
 * @param {Character} C - Character on which the action is done.
 * @param {Item} StruggleProgressPrevItem - The item that has been removed.
 * @param {Item} StruggleProgressNextItem - The item that has been added.
 * @param {boolean} LeaveDialog - Whether to leave the current dialog after publishing the action.
 * @param {string} [Action] - Action modifier
 * @returns {void} - Nothing.
 */
function ChatRoomPublishAction(C, StruggleProgressPrevItem, StruggleProgressNextItem, LeaveDialog, Action = null) {
	if (CurrentScreen == "ChatRoom") {

		// Prepares the message
		let msg = "";
		var Dictionary = [];
		if (Action == null) {
			if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && (StruggleProgressPrevItem.Asset.Name == StruggleProgressNextItem.Asset.Name) && (StruggleProgressPrevItem.Color != StruggleProgressNextItem.Color)) msg = "ActionChangeColor";
			else if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && !StruggleProgressNextItem.Asset.IsLock) msg = "ActionSwap";
			else if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && StruggleProgressNextItem.Asset.IsLock) msg = "ActionAddLock";
			else if (InventoryItemHasEffect(StruggleProgressNextItem, "Lock", false)) msg = "ActionLock";
			else if ((StruggleProgressNextItem != null) && (!StruggleProgressNextItem.Asset.Wear) && (StruggleProgressNextItem.Asset.DynamicActivity(Player) != null)) msg = "ActionActivity" + StruggleProgressNextItem.Asset.DynamicActivity(Player);
			else if (StruggleProgressNextItem != null) msg = "ActionUse";
			else if (InventoryItemHasEffect(StruggleProgressPrevItem, "Lock")) msg = "ActionUnlockAndRemove";
			else msg = "ActionRemove";
		} else if (Action == "interrupted") {
			if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && !StruggleProgressNextItem.Asset.IsLock) msg = "ActionInterruptedSwap";
			else if (StruggleProgressNextItem != null) msg = "ActionInterruptedAdd";
			else msg = "ActionInterruptedRemove";
			Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber });
		} else msg = Action;

		// Replaces the action tags to build the phrase
		Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber });
		if (StruggleProgressPrevItem != null) Dictionary.push({ Tag: "PrevAsset", AssetName: StruggleProgressPrevItem.Asset.Name });
		if (StruggleProgressNextItem != null) Dictionary.push({ Tag: "NextAsset", AssetName: StruggleProgressNextItem.Asset.Name });
		if (C.FocusGroup != null) Dictionary.push({ Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name });

		// Prepares the item packet to be sent to other players in the chatroom
		ChatRoomCharacterItemUpdate(C);

		// Sends the result to the server and leaves the dialog if we need to
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		if (LeaveDialog && (CurrentCharacter != null)) DialogLeave();

	}
}

/**
 * Updates an item on character for everyone in a chat room - replaces ChatRoomCharacterUpdate to cut on the lag.
 * @param {Character} C - Character to update.
 * @param {string} [Group] - Item group to update.
 * @returns {void} - Nothing.
 */
function ChatRoomCharacterItemUpdate(C, Group) {
	if ((Group == null) && (C.FocusGroup != null)) Group = C.FocusGroup.Name;
	if ((CurrentScreen == "ChatRoom") && (Group != null)) {
		if (ChatRoomData && ChatRoomData.Character) {
			// Single item updates aren't sent back to the source member, so update the ChatRoomData accordingly
			if (ChatRoomData && ChatRoomData.Character) {
				const characterIndex = ChatRoomData.Character.findIndex((char) => char.MemberNumber === C.MemberNumber);
				if (characterIndex !== -1) {
					ChatRoomData.Character[characterIndex] = C;
				}
			}
		}

		const Item = InventoryGet(C, Group);
		const P = {};
		P.Target = C.MemberNumber;
		P.Group = Group;
		P.Name = (Item != null) ? Item.Asset.Name : undefined;
		P.Color = ((Item != null) && (Item.Color != null)) ? Item.Color : "Default";
		P.Difficulty = (Item != null) ? Item.Difficulty - Item.Asset.Difficulty : SkillGetWithRatio("Bondage");
		P.Property = ((Item != null) && (Item.Property != null)) ? Item.Property : undefined;
		P.Craft = ((Item != null) && (Item.Craft != null)) ? Item.Craft : undefined;
		ServerSend("ChatRoomCharacterItemUpdate", P);
	}
}

/**
 * Publishes a custom action to the chat
 * @param {string} msg - Tag of the action to send
 * @param {boolean} LeaveDialog - Whether or not the dialog should be left.
 * @param {ChatMessageDictionary} Dictionary - Dictionary of tags and data to send
 *     to the room.
 * @returns {void} - Nothing.
 */
function ChatRoomPublishCustomAction(msg, LeaveDialog, Dictionary) {
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		const C = CharacterGetCurrent();
		if (C) ChatRoomCharacterItemUpdate(C);
		if (LeaveDialog && (C != null)) DialogLeave();
	}
}

/**
 * Pushes the new character data/appearance to the server.
 * @param {Character} C - Character to update.
 * @returns {void} - Nothing.
 */
function ChatRoomCharacterUpdate(C) {
	if (ChatRoomAllowCharacterUpdate) {
		var data = {
			ID: (C.ID == 0) ? Player.OnlineID : C.AccountName.replace("Online-", ""),
			ActivePose: C.ActivePose,
			Appearance: ServerAppearanceBundle(C.Appearance)
		};
		ServerSend("ChatRoomCharacterUpdate", data);
	}
}
/**
 * Checks if the message contains mentions of the character. Case-insensitive.
 * @param {Character} C - Character to check mentions of
 * @param {string} msg - The message to check for mentions
 * @returns {boolean} - msg contains mention of C
 */
function ChatRoomMessageMentionsCharacter(C, msg) {
	const nameParts = C.Name.toLowerCase().split(/\b/gu);
	const msgParts = msg.toLowerCase().split(/\b/gu);
	for (let i = 0; i < msgParts.length - (nameParts.length - 1); i++) {
		if (msgParts[i] === nameParts[0]) {
			let match = true;
			for (let j = 0; j < nameParts.length; j++) {
				if (msgParts[i + j] !== nameParts[j]) {
					match = false;
					break;
				}
			}
			if (match) return true;
		}
	}
	return false;
}

/**
 * Escapes a given string.
 * @param {string} str - Text to escape.
 * @returns {string} - Escaped string.
 */
function ChatRoomHTMLEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Check is the player is either the sender of a message, or its target.
 *
 * @param {IChatRoomMessage} data - The chat message to check for involvment.
 * @returns {boolean} true if the player is involved, false otherwise.
 */
function ChatRoomMessageInvolvesPlayer(data) {
	return (data.Sender == Player.MemberNumber
		|| Array.isArray(data.Dictionary) && data.Dictionary.some(d => {
			return /^((Target|Destination|Source)Character(Name)?|ItemMemberNumber)$/u.test(d.Tag)
				&& d.MemberNumber === Player.MemberNumber;
		}));
}

/**
 * Handles the reception of a chatroom message. Ghost players' messages are ignored.
 * @param {IChatRoomMessage} data - Message object containing things like the message type, sender, content, etc.
 * @returns {void} - Nothing.
 */
function ChatRoomMessage(data) {

	// Make sure the message is valid (needs a Sender and Content)
	if (typeof data !== "object" || typeof data.Content !== "string" || typeof data.Sender !== "number")
		return;

	if (data.Content == "ServerUpdateRoom") {
		// If we must reset the current game played in the room
		OnlineGameReset();

		// If we must garble the chatroom name (immersion settings.)
		if (Array.isArray(data.Dictionary)) {
			let ChatRoomNameDictTag = data.Dictionary.find(el => el.Tag === "ChatRoomName");
			if (ChatRoomNameDictTag) {
				ChatRoomNameDictTag.Text = ChatSearchMuffle(ChatRoomNameDictTag.Text);
			}
		}
	}

	// Exits right away if the sender is ghosted
	if (Player.GhostList.indexOf(data.Sender) >= 0) return;

	// Make sure the sender is in the room
	let SenderCharacter = ChatRoomCharacter.find(c => c.MemberNumber == data.Sender);

	// Sender is not in room, skip message
	if (!SenderCharacter) return;

	// Keep track of whether the player is involved
	let IsPlayerInvolved = ChatRoomMessageInvolvesPlayer(data);

	// Replace < and > characters to prevent HTML injections
	var msg = ChatRoomHTMLEntities(data.Content);

	// Hidden messages are processed separately, they are used by chat room mini-games / events
	if (data.Type == "Hidden") {
		if (msg == "RuleInfoGet") ChatRoomGetLoadRules(SenderCharacter);
		else if (msg == "RuleInfoSet") ChatRoomSetLoadRules(SenderCharacter, data.Dictionary);
		else if (msg.startsWith("StruggleAssist")) {
			let A = parseInt( msg.substr("StruggleAssist".length));
			if ((A >= 1) && (A <= 7)) {
				ChatRoomStruggleAssistTimer = CurrentTime + 60000;
				ChatRoomStruggleAssistBonus = A;
			}
		}
		else if (msg == "SlowStop") {
			ChatRoomSlowtimer = CurrentTime + 45000;
			ChatRoomSlowStop = true;
		}
		else if (msg.startsWith("MaidDrinkPick")) {
			let A = parseInt(msg.substr("MaidDrinkPick".length));
			if ((A == 0) || (A == 5) || (A == 10)) MaidQuartersOnlineDrinkPick(data.Sender, A);
		}
		else if (msg.startsWith("PayQuest")) ChatRoomPayQuest(data);
		else if (msg.startsWith("OwnerRule")) data = ChatRoomSetRule(data);
		else if (msg.startsWith("LoverRule")) data = ChatRoomSetRule(data);
		else if (msg == "HoldLeash") {
			if (SenderCharacter.MemberNumber != ChatRoomLeashPlayer && ChatRoomLeashPlayer != null) {
				ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: ChatRoomLeashPlayer });
			}
			if (ChatRoomCanBeLeashedBy(SenderCharacter.MemberNumber, Player)) {
				ChatRoomLeashPlayer = SenderCharacter.MemberNumber;
			} else {
				ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: SenderCharacter.MemberNumber });
			}
		}
		else if (msg == "StopHoldLeash") {
			if (SenderCharacter.MemberNumber == ChatRoomLeashPlayer) {
				ChatRoomLeashPlayer = null;
			}
		}
		else if (msg == "PingHoldLeash") {
			// The dom will ping all players on her leash list and ones that no longer have her as their leasher will remove it
			if (SenderCharacter.MemberNumber != ChatRoomLeashPlayer || !ChatRoomCanBeLeashedBy(SenderCharacter.MemberNumber, Player)) {
				ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: SenderCharacter.MemberNumber });
			}
		}
		else if (msg == "RemoveLeash" || msg == "RemoveLeashNotFriend") {
			if (ChatRoomLeashList.indexOf(SenderCharacter.MemberNumber) >= 0) {
				ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(SenderCharacter.MemberNumber), 1);
			}
		}
		else if (msg == "GiveLockpicks") DialogLentLockpicks = true;
		else if (msg == "RequestFullKinkyDungeonData") {
			KinkyDungeonStreamingPlayers.push(SenderCharacter.MemberNumber);
			if (CurrentScreen == "KinkyDungeon")
				KinkyDungeonSendData(KinkyDungeonPackData(true, true, true, true));
		}
		else if (msg == "TakeSuitcase") {
			if (!Player.CanInteract() && ServerChatRoomGetAllowItem(SenderCharacter, Player)) {
				let misc = InventoryGet(Player, "ItemMisc");
				if (KidnapLeagueSearchingPlayers.length == 0) {
					if (misc && misc.Asset && misc.Asset.Name == "BountySuitcase") {
						KidnapLeagueSearchFinishTime = CommonTime() + KidnapLeagueSearchFinishDuration;
						ChatRoomPublishCustomAction("OnlineBountySuitcaseStart", true, [
							{ Tag: "SourceCharacter", Text: CharacterNickname(SenderCharacter), MemberNumber: SenderCharacter.MemberNumber },
							{ Tag: "DestinationCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
						]);
					} else if (misc && misc.Asset && misc.Asset.Name == "BountySuitcaseEmpty") {
						KidnapLeagueSearchFinishTime = CommonTime() + KidnapLeagueSearchFinishDuration;
						ChatRoomPublishCustomAction("OnlineBountySuitcaseStartOpened", true, [
							{ Tag: "SourceCharacter", Text: CharacterNickname(SenderCharacter), MemberNumber: SenderCharacter.MemberNumber },
							{ Tag: "DestinationCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
						]);
					}
				} else {
					ServerSend("ChatRoomGame", {
						OnlineBounty: {
							finishTime: KidnapLeagueSearchFinishTime,
							target: SenderCharacter.MemberNumber,
						}
					});
				}
				if (!KidnapLeagueSearchingPlayers.includes(SenderCharacter.MemberNumber)) {
					KidnapLeagueSearchingPlayers.push(SenderCharacter.MemberNumber);
				}

			}
		}
		else if (msg == "ReceiveSuitcaseMoney") {
			ChatRoomReceiveSuitcaseMoney();
		}

		// Process hidden GGTS messages
		if (msg.substr(0, 4) == "GGTS") AsylumGGTSHiddenMessage(SenderCharacter, msg, data);

		// If the message is still hidden after any modifications, stop processing
		if (data.Type == "Hidden") return;
	}

	// Status messages will update that character status, anything else will cancel the status
	if (data.Type == "Status") {
		ChatRoomStatusUpdateLocalCharacter(SenderCharacter, msg);
		return;
	}

	// Checks if the message is a notification about the user entering or leaving the room
	var MsgEnterLeave = "";
	var MsgNonDialogue = "";
	if ((data.Type == "Action") && (msg.startsWith("ServerEnter") || msg.startsWith("ServerLeave") || msg.startsWith("ServerDisconnect") || msg.startsWith("ServerBan") || msg.startsWith("ServerKick")))
		MsgEnterLeave = " ChatMessageEnterLeave";
	if ((data.Type != "Chat" && data.Type != "Whisper" && data.Type != "Emote"))
		MsgNonDialogue = " ChatMessageNonDialogue";

	if (msg.startsWith("ServerDisconnect") && SenderCharacter.MemberNumber == ChatRoomLeashPlayer) ChatRoomLeashPlayer = null;

	// Replace actions by the content of the dictionary
	if (data.Type && ((data.Type == "Action") || (data.Type == "ServerMessage"))) {
		if (data.Type == "ServerMessage") msg = "ServerMessage" + msg;
		var orig_msg = msg;
		msg = DialogFindPlayer(msg);
		if (data.Dictionary) {
			const dictionary = ChatRoomSortDictionary(data.Dictionary);
			var SourceCharacter = null;
			let TargetCharacter = null;
			let TargetMemberNumber = null;
			let ActivityName = null;
			var GroupName = null;
			let ActivityCounter = 1;
			var Automatic = false;
			var ShockIntensity = -1;
			for (let D = 0; D < dictionary.length; D++) {

				// If there's a member number in the dictionary packet, we use that number to alter the chat message
				if (dictionary[D].MemberNumber) {

					// Alters the message displayed in the chat room log, and stores the source & target in case they're required later
					if ((msg == "SourceCharacter entered.") || (msg == "SourceCharacter left.") || (msg == "SourceCharacter disconnected.")) {
						for (let T = 0; T < ChatRoomCharacter.length; T++)
							if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber) {
								let Nick = CharacterNickname(ChatRoomCharacter[T]);
								if (Nick != ChatRoomCharacter[T].Name) Nick = Nick + " [" + ChatRoomCharacter[T].Name + "]";
								msg = msg.replace(dictionary[D].Tag, Nick);
								break;
							}
					}
					else if ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName")) {
						TargetMemberNumber = dictionary[D].MemberNumber;
						for (let T = 0; T < ChatRoomCharacter.length; T++)
							if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber)
								TargetCharacter = ChatRoomCharacter[T];
						msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "DestinationCharacter")) ? DialogFindPlayer("Her") : (PreferenceIsPlayerInSensDep(ChatRoomSenseDepBypass) && dictionary[D].MemberNumber != Player.MemberNumber && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(TargetCharacter)) ? DialogFindPlayer("Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text) + DialogFindPlayer("'s")));
					}
					else if ((dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName")) {
						TargetMemberNumber = dictionary[D].MemberNumber;
						for (let T = 0; T < ChatRoomCharacter.length; T++)
							if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber)
								TargetCharacter = ChatRoomCharacter[T];
						msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "TargetCharacter")) ? DialogFindPlayer("Herself") : (PreferenceIsPlayerInSensDep(ChatRoomSenseDepBypass) && dictionary[D].MemberNumber != Player.MemberNumber && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(TargetCharacter)) ? DialogFindPlayer("Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text)));
					}
					else if (dictionary[D].Tag == "SourceCharacter") {
						for (let T = 0; T < ChatRoomCharacter.length; T++)
							if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber)
								SourceCharacter = ChatRoomCharacter[T];
						msg = msg.replace(dictionary[D].Tag, (PreferenceIsPlayerInSensDep(ChatRoomSenseDepBypass) && (dictionary[D].MemberNumber != Player.MemberNumber) && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(SourceCharacter))) ? DialogFindPlayer("Someone") : ChatRoomHTMLEntities(dictionary[D].Text));
					}
				}
				else if (dictionary[D].TextToLookUp) msg = msg.replace(dictionary[D].Tag, DialogFindPlayer(ChatRoomHTMLEntities(dictionary[D].TextToLookUp)).toLowerCase());
				else if (dictionary[D].AssetName) {
					for (let A = 0; A < Asset.length; A++)
						if (Asset[A].Name == dictionary[D].AssetName) {
							msg = msg.replace(dictionary[D].Tag, Asset[A].DynamicDescription(SourceCharacter || Player).toLowerCase());
							ActivityName = Asset[A].DynamicActivity(SourceCharacter || Player);
							break;
						}
				}
				else if (dictionary[D].AssetGroupName) {
					const G = AssetGroupGet('Female3DCG', dictionary[D].AssetGroupName);
					if (G) {
						msg = msg.replace(dictionary[D].Tag, G.Description.toLowerCase());
						GroupName = dictionary[D].AssetGroupName;
					}
				}
				else if (dictionary[D].ActivityCounter) ActivityCounter = dictionary[D].ActivityCounter;
				else if (dictionary[D].Automatic) Automatic = true;
				else if (dictionary[D].ShockIntensity != undefined) ShockIntensity = dictionary[D].ShockIntensity;
				else if (msg != null) msg = msg.replace(dictionary[D].Tag, ChatRoomHTMLEntities(dictionary[D].Text));
			}

			// Trigger a shock if the player is a target
			if (ShockIntensity >= 0 && TargetCharacter == Player) {
				const duration = (Math.random() + ShockIntensity) * 500;
				DrawFlashScreen("#FFFFFF", duration, 500);
			}

			// For automatic messages, do not show the message if the player is not involved, depending on their preferences
			if (Automatic && !IsPlayerInvolved && !Player.ChatSettings.ShowAutomaticMessages)
				return;

			// When the player is in total sensory deprivation, hide messages if the player is not involved
			if (Player.ImmersionSettings.SenseDepMessages && !IsPlayerInvolved && PreferenceIsPlayerInSensDep())
				return;

			// Handle stimulation
			if ((orig_msg == "HelpKneelDown" || orig_msg == "HelpStandUp") && ((TargetMemberNumber != null && TargetMemberNumber == Player.MemberNumber) || (SenderCharacter.MemberNumber != null && SenderCharacter.MemberNumber == Player.MemberNumber)))
				ChatRoomStimulationMessage("Kneel");

			// If another player is using an item which applies an activity on the current player, apply the effect here
			AsylumGGTSActivity(SenderCharacter, TargetCharacter, ActivityName, GroupName, ActivityCounter);
			if ((ActivityName != null) && (TargetMemberNumber != null) && (TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber))
				if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
					ActivityEffect(SenderCharacter, Player, ActivityName, GroupName, ActivityCounter);

			// Show the data to the audio system so it can play sound effects
			AudioPlaySoundForChatMessage(data);

			// Raise a notification if required
			if (data.Type === "Action" && IsPlayerInvolved && Player.NotificationSettings.ChatMessage.Activity)
				ChatRoomNotificationRaiseChatMessage(SenderCharacter, msg);

		}
	}

	// Outputs the sexual activities text and runs the activity if the player is targeted
	if (data.Type === "Activity") {

		// Creates the output message using the activity dictionary and tags, keep some values to calculate the activity effects on the player
		msg = ActivityDictionaryText(msg);
		let TargetMemberNumber = null;
		let TargetCharacter = null;
		let ActivityName = null;
		var ActivityGroup = null;
		let ActivityCounter = 1;
		if (data.Dictionary != null)
			for (let D = 0; D < data.Dictionary.length; D++) {
				for (let T = 0; T < ChatRoomCharacter.length; T++)
					if (ChatRoomCharacter[T].MemberNumber == data.Dictionary[D].MemberNumber)
						TargetCharacter = ChatRoomCharacter[T];
				if (data.Dictionary[D].MemberNumber != null) {
					msg = msg.replace(data.Dictionary[D].Tag, (PreferenceIsPlayerInSensDep(ChatRoomSenseDepBypass) && (data.Dictionary[D].MemberNumber != Player.MemberNumber) && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(TargetCharacter))) ? DialogFindPlayer("Someone") : ChatRoomHTMLEntities(data.Dictionary[D].Text));
				}
				if ((data.Dictionary[D].MemberNumber != null) && (data.Dictionary[D].Tag == "TargetCharacter")) TargetMemberNumber = data.Dictionary[D].MemberNumber;
				if (data.Dictionary[D].Tag == "ActivityName") ActivityName = data.Dictionary[D].Text;
				if (data.Dictionary[D].Tag == "ActivityGroup") ActivityGroup = data.Dictionary[D].Text;
				if (data.Dictionary[D].ActivityCounter != null) ActivityCounter = data.Dictionary[D].ActivityCounter;
			}

		// If the player does the activity on herself or an NPC, we calculate the result right away
		AsylumGGTSActivity(SenderCharacter, TargetCharacter, ActivityName, ActivityGroup, ActivityCounter);
		if ((data.Type === "Action") || ((TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber)))
			if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
				ActivityEffect(SenderCharacter, Player, ActivityName, ActivityGroup, ActivityCounter);

		// When the player is in total sensory deprivation, hide messages if the player is not involved
		if (Player.ImmersionSettings.SenseDepMessages && TargetMemberNumber != Player.MemberNumber && SenderCharacter.MemberNumber != Player.MemberNumber && PreferenceIsPlayerInSensDep()) {
			return;
		}

		AudioPlaySoundForChatMessage(data);

		// Exits before outputting the text if the player doesn't want to see the sexual activity messages
		if ((Player.ChatSettings != null) && (Player.ChatSettings.ShowActivities != null) && !Player.ChatSettings.ShowActivities) return;

		// Raise a notification if required
		if (TargetMemberNumber === Player.MemberNumber && Player.NotificationSettings.ChatMessage.Activity)
			ChatRoomNotificationRaiseChatMessage(SenderCharacter, msg);
	}

	// Prepares the HTML tags
	if (data.Type != null) {
		const HideOthersMessages = Player.ImmersionSettings.SenseDepMessages
			&& PreferenceIsPlayerInSensDep()
			&& SenderCharacter.ID !== 0
			&& Player.GetDeafLevel() >= 4
			&& (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(SenderCharacter));

		if (data.Type == "Chat" || data.Type == "Whisper") {
			msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray');
			if (data.Type == "Whisper") msg += '; font-style: italic';
			msg += ';">';

			// Garble names
			let senderName = "";
			if (PreferenceIsPlayerInSensDep(ChatRoomSenseDepBypass) && SenderCharacter.MemberNumber != Player.MemberNumber && data.Type != "Whisper" && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(SenderCharacter))) {
				if ((Player.GetDeafLevel() >= 4))
					senderName = DialogFindPlayer("Someone");
				else
					senderName = SpeechGarble(SenderCharacter, CharacterNickname(SenderCharacter), true);
			}
			else senderName = CharacterNickname(SenderCharacter);
			msg += senderName;
			msg += ':</span> ';

			const chatMsg = ChatRoomHTMLEntities(data.Type === "Whisper" ? data.Content : SpeechGarble(SenderCharacter, data.Content));
			msg += chatMsg;
			ChatRoomChatLog.push({ Chat: SpeechGarble(SenderCharacter, data.Content, true), Garbled: chatMsg, Original: data.Content, SenderName: senderName, SenderMemberNumber: SenderCharacter.MemberNumber, Time: CommonTime() });

			if (ChatRoomChatLog.length > 6) ChatRoomChatLog.splice(0, 1);
			if (HideOthersMessages && data.Type === "Chat") return;

			if ((data.Type === "Chat" && Player.NotificationSettings.ChatMessage.Normal)
				|| (data.Type === "Whisper" && Player.NotificationSettings.ChatMessage.Whisper)
				|| (Player.NotificationSettings.ChatMessage.Mention && ChatRoomMessageMentionsCharacter(Player, chatMsg)))
				ChatRoomNotificationRaiseChatMessage(SenderCharacter, chatMsg);

		}
		else if (data.Type == "Emote") {
			const playerMentioned = ChatRoomMessageMentionsCharacter(Player, msg);
			if (HideOthersMessages && !playerMentioned) return;

			if (msg.indexOf("*") == 0) msg = msg + "*";
			else if ((msg.indexOf("'") == 0) || (msg.indexOf(",") == 0)) msg = "*" + CharacterNickname(SenderCharacter) + msg + "*";
			else if (PreferenceIsPlayerInSensDep(ChatRoomSenseDepBypass) && SenderCharacter.MemberNumber != Player.MemberNumber && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(SenderCharacter))) {
				msg = "*" + DialogFindPlayer("Someone") + " " + msg + "*";
				for (let C = 0; C < ChatRoomCharacter.length; C++)
					if (ChatRoomCharacter[C] && ChatRoomCharacter[C].Name && ChatRoomCharacter[C].ID != 0 && (!ChatRoomSenseDepBypass || !ChatRoomCharacterDrawlist.includes(ChatRoomCharacter[C])))
						msg = msg.replace(ChatRoomCharacter[C].Name.charAt(0).toUpperCase() + ChatRoomCharacter[C].Name.slice(1), DialogFindPlayer("Someone"));
			}
			else msg = "*" + CharacterNickname(SenderCharacter) + " " + msg + "*";

			if (Player.NotificationSettings.ChatMessage.Normal || (Player.NotificationSettings.ChatMessage.Mention && playerMentioned))
				ChatRoomNotificationRaiseChatMessage(SenderCharacter, msg);
		}
		else if (data.Type === "Action" || data.Type === "Activity") msg = "(" + msg + ")";
		else if (data.Type == "ServerMessage") msg = "<b>" + msg + "</b>";

		// Local messages can have HTML embedded in them
		else if (data.Type == "LocalMessage") msg = data.Content;
	}

	// Adds the message and scrolls down unless the user has scrolled up
	var div = document.createElement("div");
	div.setAttribute('class', 'ChatMessage ChatMessage' + data.Type + MsgEnterLeave + MsgNonDialogue);
	div.setAttribute('data-time', ChatRoomCurrentTime());
	div.setAttribute('data-sender', data.Sender);
	if (data.Type == "Emote" || data.Type == "Action" || data.Type == "Activity")
		div.setAttribute('style', 'background-color:' + ChatRoomGetTransparentColor(SenderCharacter.LabelColor) + ';');
	div.innerHTML = msg;

	if (typeof data.Timeout === 'number' && data.Timeout > 0) setTimeout(() => div.remove(), data.Timeout);

	// Returns the focus on the chat box
	var Refocus = document.activeElement.id == "InputChat";
	var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
	if (document.getElementById("TextAreaChatLog") != null) {
		document.getElementById("TextAreaChatLog").appendChild(div);
		if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
		if (Refocus) ElementFocus("InputChat");
	}
}

/**
 * Adds a character into the chat room.
 * @param {Character} newCharacter - The new character to be added to the chat room.
 * @param {object} newRawCharacter - The raw character data of the new character as it was received from the server.
 * @returns {void} - Nothing
 */
function ChatRoomAddCharacterToChatRoom(newCharacter, newRawCharacter)
{
	if (newCharacter == null || newRawCharacter == null) { return; }

	// Update the chat room characters
	let characterIndex = ChatRoomCharacter.findIndex(x => x.MemberNumber == newCharacter.MemberNumber);
	if (characterIndex >= 0) // If we found an existing entry...
	{
		// Update it
		ChatRoomCharacter[characterIndex] = newCharacter;
	}
	else // If we didn't update existing data...
	{
		// Push a new entry
		ChatRoomCharacter.push(newCharacter);
	}

	// Update chat room data backup
	characterIndex = ChatRoomData.Character.findIndex(x => x.MemberNumber == newRawCharacter.MemberNumber);
	if (characterIndex >= 0) // If we found an existing entry...
	{
		// Update it
		ChatRoomData.Character[characterIndex] = newRawCharacter;
	}
	else // If we didn't update existing data...
	{
		// Push a new entry
		ChatRoomData.Character.push(newRawCharacter);
	}

}

/**
 * Handles the reception of the complete room data from the server.
 * @param {IChatRoomSyncMessage} chatRoomProperties - Room object containing the updated chatroom data.
 * @returns {boolean} - Returns true if the passed properties are valid and false if they're invalid.
 */
function ChatRoomValidateProperties(chatRoomProperties)
{
	return chatRoomProperties != null && typeof chatRoomProperties === "object"
		&& chatRoomProperties.Name != null && typeof chatRoomProperties.Name === "string"
		&& chatRoomProperties.Description != null && typeof chatRoomProperties.Description === "string"
		&& Array.isArray(chatRoomProperties.Admin)
		&& Array.isArray(chatRoomProperties.Ban)
		&& chatRoomProperties.Background != null && typeof chatRoomProperties.Background === "string"
		&& chatRoomProperties.Limit != null && typeof chatRoomProperties.Limit === "number"
		&& chatRoomProperties.Locked != null && typeof chatRoomProperties.Locked === "boolean"
		&& chatRoomProperties.Private != null && typeof chatRoomProperties.Private === "boolean"
		&& Array.isArray(chatRoomProperties.BlockCategory);
}

/**
 * Handles the reception of the new room data from the server.
 * @param {IChatRoomSyncMessage} data - Room object containing the updated chatroom data.
 * @returns {void} - Nothing.
 */
function ChatRoomSync(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	if(ChatRoomValidateProperties(data) == false) // If the room data we received is invalid...
	{
		// Instantly leave the chat room again
		DialogLentLockpicks = false;
		ChatRoomClearAllElements();
		ChatRoomSetLastChatRoom("");
		ServerSend("ChatRoomLeave", "");
		ChatSearchMessage = "ErrorInvalidRoomProperties";
		CommonSetScreen("Online", "ChatSearch");
		return;
	}

	// Loads the room
	if ((CurrentScreen != "ChatRoom") && (CurrentScreen != "ChatAdmin") && (CurrentScreen != "Appearance") && (CurrentModule != "Character")) {
		if (ChatRoomPlayerCanJoin) {
			ChatRoomPlayerCanJoin = false;
			CommonSetScreen("Online", "ChatRoom");
		} else return;
	}

	// Treat chatroom updates from ourselves as if the updated characters had sent them
	const trustedUpdate = data.SourceMemberNumber === Player.MemberNumber;

	// Load the characters
	ChatRoomCharacter = [];
	for (let C = 0; C < data.Character.length; C++) {
		const sourceMemberNumber = trustedUpdate ? data.Character[C].MemberNumber : data.SourceMemberNumber;
		const Char = CharacterLoadOnline(data.Character[C], sourceMemberNumber);
		ChatRoomCharacter.push(Char);
	}

	// Keeps a copy of the previous version
	ChatRoomData = data;
	if (ChatRoomData.Game != null) {
		ChatRoomGame = ChatRoomData.Game;
		OnlineGameReset();
	}

	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();

	// Reloads the online game statuses if needed
	OnlineGameLoadStatus();

	// The allowed menu actions may have changed
	ChatRoomMenuBuild();
}


/**
 * Handles the reception of the character data of a single player from the server.
 * @param {object} data - object containing the character's data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncCharacter(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	const newCharacter = CharacterLoadOnline(data.Character, data.SourceMemberNumber);
	ChatRoomAddCharacterToChatRoom(newCharacter, data.Character);

}

/**
 * Handles the reception of the character data of a newly joined player from the server.
 * @param {object} data - object containing the joined character's data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncMemberJoin(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	//Load the character to the chat room
	const newCharacter = CharacterLoadOnline(data.Character, data.SourceMemberNumber);
	ChatRoomAddCharacterToChatRoom(newCharacter, data.Character);

	if (Array.isArray(data.WhiteListedBy)) {
		for (const MemberNumber of data.WhiteListedBy) {
			for (const character of Character) {
				if (character.MemberNumber === MemberNumber && Array.isArray(character.WhiteList) && character.ID != 0) {
					if (!character.WhiteList.includes(newCharacter.MemberNumber)) {
						character.WhiteList.push(newCharacter.MemberNumber);
						character.WhiteList.sort((a, b) => a - b);
					}
				}
			}
		}
	}
	if (Array.isArray(data.BlackListedBy)) {
		for (const MemberNumber of data.BlackListedBy) {
			for (const character of Character) {
				if (character.MemberNumber === MemberNumber && Array.isArray(character.BlackList) && character.ID != 0) {
					if (!character.BlackList.includes(newCharacter.MemberNumber)) {
						character.BlackList.push(newCharacter.MemberNumber);
						character.BlackList.sort((a, b) => a - b);
					}
				}
			}
		}
	}

	// After Join Actions
	if (ChatRoomNotificationRaiseChatJoin(newCharacter)) {
		NotificationRaise(NotificationEventType.CHATJOIN, { characterName: newCharacter.Name });
	}
	if (ChatRoomLeashList.includes(newCharacter.MemberNumber)) {
		// Ping to make sure they are still leashed
		ServerSend("ChatRoomChat", { Content: "PingHoldLeash", Type: "Hidden", Target: newCharacter.MemberNumber });
	}
	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();
	// The allowed menu actions may have changed
	ChatRoomMenuBuild();

}

/**
 * Handles the reception of the leave notification of a player from the server.
 * @param {object} data - Room object containing the leaving character's member number.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncMemberLeave(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	// Remove the character
	ChatRoomCharacter = ChatRoomCharacter.filter(x => x.MemberNumber != data.SourceMemberNumber);
	ChatRoomData.Character = ChatRoomData.Character.filter(x => x.MemberNumber != data.SourceMemberNumber);

	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();

	// The allowed menu actions may have changed
	ChatRoomMenuBuild();

}

/**
 * Handles the reception of the room properties from the server.
 * @param {object} data - Room object containing the updated chatroom properties.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncRoomProperties(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	if(ChatRoomValidateProperties(data) == false) // If the room data we received is invalid...
	{
		// Instantly leave the chat room again
		DialogLentLockpicks = false;
		ChatRoomClearAllElements();
		ChatRoomSetLastChatRoom("");
		ServerSend("ChatRoomLeave", "");
		ChatSearchMessage = "ErrorInvalidRoomProperties";
		CommonSetScreen("Online", "ChatSearch");
		return;
	}

	// Copy the received properties to chat room data
	Object.assign(ChatRoomData, data);

	if (ChatRoomData.Game != null) ChatRoomGame = ChatRoomData.Game;

	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();

	// Reloads the online game statuses if needed
	OnlineGameLoadStatus();

	// The allowed menu actions may have changed
	ChatRoomMenuBuild();

}

/**
 * Handles the swapping of two players by a room administrator.
 * @param {object} data - Object containing the member numbers of the swapped characters.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncSwapPlayers(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	// Update the chat room characters
	let index1 = ChatRoomCharacter.findIndex(x => (x.MemberNumber == data.MemberNumber1));
	let index2 = ChatRoomCharacter.findIndex(x => (x.MemberNumber == data.MemberNumber2));

	if(index1 >= 0 && index2 >= 0) // If we found both characters to swap...
	{
		//Swap them
		let bufferCharacter = ChatRoomCharacter[index1];
		ChatRoomCharacter[index1] = ChatRoomCharacter[index2];
		ChatRoomCharacter[index2] = bufferCharacter;
	}

	// Update the chat room data backup
	index1 = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.MemberNumber1);
	index2 = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.MemberNumber2);

	if(index1 >= 0 && index2 >= 0) // If we found both entries to swap...
	{
		//Swap them
		let bufferCharacter = ChatRoomData.Character[index1];
		ChatRoomData.Character[index1] = ChatRoomData.Character[index2];
		ChatRoomData.Character[index2] = bufferCharacter;
	}

}

/**
 * Handles the moving of a player by a room administrator.
 * @param {object} data - Object containing the member numbers of the swapped characters.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncMovePlayer(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	let moveOffset = 0;
	switch(data.Direction)
	{
		case "Left": moveOffset = -1; break;
		case "Right": moveOffset = 1; break;
		default: moveOffset = 0; break;
	}

	// Update the chat room characters
	let index = ChatRoomCharacter.findIndex(x => x.MemberNumber == data.TargetMemberNumber);
	if(index >= 0 && index < ChatRoomCharacter.length &&
		index+moveOffset >= 0 && index+moveOffset < ChatRoomCharacter.length) // If we found the character to move and the moving is valid...
	{
		//Move it
		let bufferCharacter = ChatRoomCharacter[index];
		ChatRoomCharacter[index] = ChatRoomCharacter[index+moveOffset];
		ChatRoomCharacter[index+moveOffset] = bufferCharacter;
	}

	// Update the chat room data backup
	index = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.TargetMemberNumber);
	if(index >= 0 && index < ChatRoomCharacter.length &&
		index+moveOffset >= 0 && index+moveOffset < ChatRoomCharacter.length) // If we found the entry to move and the moving is valid...
	{
		//Move it
		let bufferCharacter = ChatRoomData.Character[index];
		ChatRoomData.Character[index] = ChatRoomData.Character[index+moveOffset];
		ChatRoomData.Character[index+moveOffset] = bufferCharacter;
	}

}

/**
 * Handles the swapping of two players by a room administrator.
 * @param {object} data - Object containing the member numbers of the swapped characters.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncReorderPlayers(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	let newChatRoomCharacter = [];
	let newChatRoomDataCharacter = [];
	let index = 0;

	for(let i=0; i<data.PlayerOrder.length; i++) // For every player to reorder...
	{
		//Chat Room Characters
		index = ChatRoomCharacter.findIndex(x => x.MemberNumber == data.PlayerOrder[i]);
		newChatRoomCharacter.push(ChatRoomCharacter.splice(index, 1)[0]);

		//Chat Room Data Backup
		index = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.PlayerOrder[i]);
		newChatRoomDataCharacter.push(ChatRoomData.Character.splice(index, 1)[0]);

	}

	if(ChatRoomCharacter.length > 0) // If we forgot about some characters for some reason...
	{
		//Push the missed entries to the end
		Array.prototype.push.apply(newChatRoomCharacter, ChatRoomCharacter);
	}
	if(ChatRoomData.Character.length > 0) // If we forgot about some entries for some reason...
	{
		//Push the missed entries to the end
		Array.prototype.push.apply(newChatRoomDataCharacter, ChatRoomData.Character);
	}

	//Update the origin arrays
	ChatRoomCharacter = newChatRoomCharacter;
	ChatRoomData.Character = newChatRoomDataCharacter;

}

/**
 * Updates a single character in the chatroom
 * @param {object} data - Data object containing the new character data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncSingle(data) {

	// Sets the chat room character data
	if ((data == null) || (typeof data !== "object")) return;
	if ((data.Character == null) || (typeof data.Character !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomCharacter[C] = CharacterLoadOnline(data.Character, data.SourceMemberNumber);

	// Keeps a copy of the previous version
	for (let C = 0; C < ChatRoomData.Character.length; C++)
		if (ChatRoomData.Character[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomData.Character[C] = data.Character;

}

/**
 * Updates a single character's expression in the chatroom.
 * @param {object} data - Data object containing the new character expression data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncExpression(data) {
	if ((data == null) || (typeof data !== "object") || (data.Group == null) || (typeof data.Group !== "string")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Changes the facial expression
			for (let A = 0; A < ChatRoomCharacter[C].Appearance.length; A++)
				if ((ChatRoomCharacter[C].Appearance[A].Asset.Group.Name == data.Group) && (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression))
					if ((data.Name == null) || (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression.indexOf(data.Name) >= 0)) {
						if (!ChatRoomCharacter[C].Appearance[A].Property) ChatRoomCharacter[C].Appearance[A].Property = {};
						if (ChatRoomCharacter[C].Appearance[A].Property.Expression != data.Name) {
							ChatRoomCharacter[C].Appearance[A].Property.Expression = data.Name;
							CharacterRefresh(ChatRoomCharacter[C], false);
						}
					}

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
			return;

		}
}

/**
 * Updates a single character's pose in the chatroom.
 * @param {object} data - Data object containing the new character pose data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncPose(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Sets the active pose
			ChatRoomCharacter[C].ActivePose = data.Pose;
			CharacterRefresh(ChatRoomCharacter[C], false);

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].ActivePose = data.Pose;
			return;

		}
}

/**
 * Updates a single character's arousal progress in the chatroom.
 * @param {object} data - Data object containing the new character arousal data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncArousal(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].MemberNumber == data.MemberNumber) && (ChatRoomCharacter[C].ArousalSettings != null)) {

			// Sets the orgasm count & progress
			ChatRoomCharacter[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
			ChatRoomCharacter[C].ArousalSettings.OrgasmCount = data.OrgasmCount;
			ChatRoomCharacter[C].ArousalSettings.Progress = data.Progress;
			ChatRoomCharacter[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
			if ((ChatRoomCharacter[C].ArousalSettings.AffectExpression == null) || ChatRoomCharacter[C].ArousalSettings.AffectExpression) ActivityExpression(ChatRoomCharacter[C], ChatRoomCharacter[C].ArousalSettings.Progress);

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber) {
					ChatRoomData.Character[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
					ChatRoomData.Character[C].ArousalSettings.OrgasmCount = data.OrgasmCount;
					ChatRoomData.Character[C].ArousalSettings.Progress = data.Progress;
					ChatRoomData.Character[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
				}
			return;

		}
}


/**
 * Updates a single item on a specific character in the chatroom.
 * @param {object} data - Data object containing the data pertaining to the singular item to update.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncItem(data) {
	if ((data == null) || (typeof data !== "object") || (data.Source == null) || (typeof data.Source !== "number") || (data.Item == null) || (typeof data.Item !== "object") || (data.Item.Target == null) || (typeof data.Item.Target !== "number") || (data.Item.Group == null) || (typeof data.Item.Group !== "string")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber === data.Item.Target) {

			const updateParams = ValidationCreateDiffParams(ChatRoomCharacter[C], data.Source);
			const previousItem = InventoryGet(ChatRoomCharacter[C], data.Item.Group);
			const newItem = ServerBundledItemToAppearanceItem(ChatRoomCharacter[C].AssetFamily, data.Item);

			let { item, valid } = ValidationResolveAppearanceDiff(previousItem, newItem, updateParams);

			ChatRoomAllowCharacterUpdate = false;

			if (!item || (previousItem && previousItem.Asset.Name !== item.Asset.Name)) {
				InventoryRemove(ChatRoomCharacter[C], data.Item.Group, false);
			}

			if (item) {

				// Puts the item on the character and apply the craft & property
				CharacterAppearanceSetItem(ChatRoomCharacter[C], data.Item.Group, item.Asset, item.Color, item.Difficulty, null, false);
				if (item.Craft != null)
					for (let Char of ChatRoomCharacter)
						if (Char.MemberNumber === data.Source)
							InventoryCraft(Char, ChatRoomCharacter[C], data.Item.Group, item.Craft, false);
				InventoryGet(ChatRoomCharacter[C], data.Item.Group).Property = item.Property;

				/** @type {AppearanceDiffMap} */
				const diffMap = {};
				for (const appearanceItem of ChatRoomCharacter[C].Appearance) {
					const groupName = appearanceItem.Asset.Group.Name;
					if (groupName === data.Item.Group) {
						diffMap[groupName] = [previousItem, appearanceItem];
					} else {
						diffMap[groupName] = [appearanceItem, appearanceItem];
					}
				}

				const cyclicBlockSanitizationResult = ValidationResolveCyclicBlocks(ChatRoomCharacter[C].Appearance, diffMap);
				ChatRoomCharacter[C].Appearance = cyclicBlockSanitizationResult.appearance;
				valid = valid && cyclicBlockSanitizationResult.valid;
			}

			ChatRoomAllowCharacterUpdate = true;

			// If the update was invalid, send a correction update
			if (ChatRoomCharacter[C].ID === 0 && !valid) {
				console.warn(`Invalid appearance update to group ${data.Item.Group}. Updating with sanitized appearance.`);
				ChatRoomCharacterUpdate(ChatRoomCharacter[C]);
			} else {
				CharacterRefresh(ChatRoomCharacter[C]);
			}

			// Keeps the change in the chat room data and allows the character to be updated again
			for (let R = 0; R < ChatRoomData.Character.length; R++) {
				if (ChatRoomData.Character[R].MemberNumber == data.Item.Target)
					ChatRoomData.Character[R].Appearance = ChatRoomCharacter[C].Appearance;
			}

			return;
		}
}

/**
 * Refreshes the chat log elements for Player
 * @returns {void} - Nothing.
 */
function ChatRoomRefreshChatSettings() {
	if (Player.ChatSettings) {
		for (let property in Player.ChatSettings)
			ElementSetDataAttribute("TextAreaChatLog", property, Player.ChatSettings[property]);
		if (Player.GameplaySettings &&
			(Player.GameplaySettings.SensDepChatLog == "SensDepNames" || Player.GameplaySettings.SensDepChatLog == "SensDepTotal" || Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") &&
			(Player.GetDeafLevel() >= 3) &&
			(Player.GetBlindLevel() >= 3)) {
			ElementSetDataAttribute("TextAreaChatLog", "EnterLeave", "Hidden");
		}
		if (Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepTotal" || Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (Player.GetDeafLevel() >= 3) && (Player.GetBlindLevel() >= 3)) {
			ElementSetDataAttribute("TextAreaChatLog", "DisplayTimestamps", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorNames", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActions", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorEmotes", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActivities", "false");
			ElementSetDataAttribute("TextAreaChatLog", "MemberNumbers", "Never");
		}
	}
}

/**
 * Shows the current character's profile (Information Sheet screen)
 * @returns {void} - Nothing.
 */
function DialogViewProfile() {
	if (CurrentCharacter != null) {
		const C = CurrentCharacter;
		DialogLeave();
		InformationSheetLoadCharacter(C);
	}
}

/**
 * Brings the player into the main hall and starts the maid punishment sequence
 * @returns {void}
 */
function DialogCallMaids() {
	ChatRoomSlowtimer = 0;
	ChatRoomSlowStop = false;
	ChatRoomClearAllElements();
	ChatRoomSetLastChatRoom("");
	ServerSend("ChatRoomLeave", "");
	CommonSetScreen("Room", "MainHall");
	if (!Player.RestrictionSettings || !Player.RestrictionSettings.BypassNPCPunishments) {
		MainHallPunishFromChatroom();
	}
}


/**
 * Triggered when the player assists another player to struggle out, the bonus is evasion / 2 + 1, with penalties if
 * the player is restrained.
 * @returns {void} - Nothing.
 */
function ChatRoomStruggleAssist() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
	var Bonus = SkillGetLevelReal(Player, "Evasion") / 2 + 1;
	if (!Player.CanInteract()) {
		if (InventoryItemHasEffect(InventoryGet(Player, "ItemArms"), "Block", true)) Bonus = Bonus / 1.5;
		if (InventoryItemHasEffect(InventoryGet(Player, "ItemHands"), "Block", true)) Bonus = Bonus / 1.5;
		if (!Player.CanTalk()) Bonus = Bonus / 1.25;
	}
	ServerSend("ChatRoomChat", { Content: "StruggleAssist", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "StruggleAssist" + Math.round(Bonus).toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	DialogLeave();
}

/**

 * Triggered when the player assists another player to by giving lockpicks
 * @returns {void} - Nothing.
 */
function ChatRoomGiveLockpicks() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "GiveLockpicks", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "GiveLockpicks", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	DialogLeave();
}

/*
 * Triggered when the player grabs another player's leash
 * @returns {void} - Nothing.
 */
function ChatRoomHoldLeash() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) < 0)
		ChatRoomLeashList.push(CurrentCharacter.MemberNumber);
	DialogLeave();
}

/**
 * Triggered when the player lets go of another player's leash
 * @returns {void} - Nothing.
 */
function ChatRoomStopHoldLeash() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) >= 0)
		ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber), 1);
	DialogLeave();
}

/**
 * Triggered when a dom enters the room
 * @returns {void} - Nothing.
 */
function ChatRoomPingLeashedPlayers(NoBeep) {
	if (ChatRoomLeashList && ChatRoomLeashList.length > 0) {
		for (let P = 0; P < ChatRoomLeashList.length; P++) {
			ServerSend("ChatRoomChat", { Content: "PingHoldLeash", Type: "Hidden", Target: ChatRoomLeashList[P] });
			ServerSend("AccountBeep", { MemberNumber: ChatRoomLeashList[P], BeepType:"Leash"});
		}
	}
}


/**
 * Triggered when a character makes another character kneel/stand.
 * @returns {void} - Nothing
 */
function ChatRoomKneelStandAssist() {
	ServerSend("ChatRoomChat", { Content: !CurrentCharacter.IsKneeling() ? "HelpKneelDown" : "HelpStandUp", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }, { Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber }] });
	CharacterSetActivePose(CurrentCharacter, !CurrentCharacter.IsKneeling() ? "Kneel" : "BaseLower", false);
	ChatRoomCharacterUpdate(CurrentCharacter);
}

/**
 * Triggered when a character stops another character from leaving.
 * @returns {void} - Nothing
 */
function ChatRoomStopLeave() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "SlowStop", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "SlowStop", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	DialogLeave();
}

/**
 * Sends an administrative command to the server for the chat room from the character dialog.
 * @param {string} ActionType - Type of action performed.
 * @param {boolean | string} [Publish=true] - Whether or not the action should be published.
 * @returns {void} - Nothing
 */
function ChatRoomAdminAction(ActionType, Publish) {
	if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && ChatRoomPlayerIsAdmin()) {
		if (ActionType == "Move") {
			ChatRoomMoveTarget = CurrentCharacter.MemberNumber;
		} else {
			ServerSend("ChatRoomAdmin", { MemberNumber: CurrentCharacter.MemberNumber, Action: ActionType, Publish: (Publish !== false && Publish !== "false") });
		}
		DialogLeave();
	}
}

/**
 * Sends an administrative command to the server from the chat text field.
 * @param {string} ActionType - Type of action performed.
 * @param {string} Argument - Target number of the action.
 * @returns {void} - Nothing
 */
function ChatRoomAdminChatAction(ActionType, Argument) {
	if (ChatRoomPlayerIsAdmin()) {
		var C = parseInt(Argument);
		if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber))
			ServerSend("ChatRoomAdmin", { MemberNumber: C, Action: ActionType });
	}
}

/**
 * Gets the player's current time as a string.
 * @returns {string} - The player's current local time as a string.
 */
function ChatRoomCurrentTime() {
	var D = new Date();
	return ("0" + D.getHours()).substr(-2) + ":" + ("0" + D.getMinutes()).substr(-2);
}

/**
 * Gets a transparent version of the specified hex color.
 * @param {HexColor} Color - Hex color code.
 * @returns {string} - A transparent version of the specified hex color in the rgba format.
 */
function ChatRoomGetTransparentColor(Color) {
	if (!Color) return "rgba(128,128,128,0.1)";
	const R = Color.substring(1, 3);
	const G = Color.substring(3, 5);
	const B = Color.substring(5, 7);
	return "rgba(" + parseInt(R, 16) + "," + parseInt(G, 16) + "," + parseInt(B, 16) + ",0.1)";
}

/**
 * Adds or removes an online member to/from a specific list. (From the dialog menu)
 * @param {"Add" | "Remove"} Operation - Operation to perform.
 * @param {string} ListType - Name of the list to alter. (Whitelist, friendlist, blacklist, ghostlist)
 * @returns {void} - Nothing
 */
function ChatRoomListManage(Operation, ListType) {
	if (CurrentCharacter && CurrentCharacter.MemberNumber && Array.isArray(Player[ListType])) {
		ChatRoomListUpdate(Player[ListType], Operation == "Add", CurrentCharacter.MemberNumber);
	}
}

/**
 * Adds or removes an online member to/from a specific list from a typed message.
 * @param {number[]|null} List - List to add to or remove from.
 * @param {boolean} Adding - If TRUE adding to the list, if FALSE removing from the list.
 * @param {string} Argument - Member number to add/remove.
 * @returns {void} - Nothing
 */
function ChatRoomListManipulation(List, Adding, Argument) {
	var C = parseInt(Argument);
	if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber)) {
		ChatRoomListUpdate(List, Adding, C);
	}
}

/**
 * Updates character lists for the player and saves the change
 * @param {number[]} list - The array of member numbers to update
 * @param {boolean} adding - If TRUE adding to the list, if FALSE removing from the list
 * @param {number} memberNumber - The member number to add/remove
 * @returns {void} - Nothing
 */
function ChatRoomListUpdate(list, adding, memberNumber) {
	if (adding && list.indexOf(memberNumber) < 0) {
		list.push(memberNumber);
	}
	else if (!adding && list.indexOf(memberNumber) >= 0) {
		list.splice(list.indexOf(memberNumber), 1);
	}

	const triggeredOperations = ChatRoomListOperationTriggers().find(w => w.list == list && w.adding == adding);
	if (triggeredOperations) {
		triggeredOperations.triggers.forEach(op => {
			ChatRoomListUpdate(op.list, op.add, memberNumber);
		});
	}

	if (list == Player.GhostList) {
		const C = Character.find(Char => Char.MemberNumber == memberNumber);
		if (C) {
			CharacterRefresh(C, false);
		}
	}

	ServerPlayerRelationsSync();
	setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
}

/**
 * Handles reception of data pertaining to if applying an item is allowed.
 * @param {object} data - Data object containing if the player is allowed to interact with a character.
 * @returns {void} - Nothing
 */
function ChatRoomAllowItem(data) {
	if ((data != null) && (typeof data === "object") && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.AllowItem != null) && (typeof data.AllowItem === "boolean"))
		if (CurrentCharacter != null && CurrentCharacter.MemberNumber == data.MemberNumber && data.AllowItem !== CurrentCharacter.AllowItem) {
			console.warn(`ChatRoomGetAllowItem mismatch trying to access ${CurrentCharacter.Name} (${CurrentCharacter.MemberNumber})`);
			CurrentCharacter.AllowItem = data.AllowItem;
			CharacterSetCurrent(CurrentCharacter);
		}
}

/**
 * Triggered when the player wants to change another player's outfit.
 * @returns {void} - Nothing
 */
function DialogChangeClothes() {
	var C = CurrentCharacter;
	DialogLeave();
	CharacterAppearanceLoadCharacter(C);
}

/**
 * Triggered when the player selects an ownership dialog option. (It can change money and reputation)
 * @param {string} RequestType - Type of request being performed.
 * @returns {void} - Nothing
 */
function ChatRoomSendOwnershipRequest(RequestType) {
	if ((ChatRoomOwnershipOption == "CanOfferEndTrial") && (RequestType == "Propose")) {
		CharacterChangeMoney(Player, -100);
		DialogChangeReputation("Dominant", 10);
	}
	if ((ChatRoomOwnershipOption == "CanEndTrial") && (RequestType == "Accept")) DialogChangeReputation("Dominant", -20);
	ChatRoomOwnershipOption = "";
	ServerSend("AccountOwnership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

/**
 * Triggered when the player selects an lovership dialog option. (It can change money and reputation)
 * @param {string} RequestType - Type of request being performed.
 * @returns {void} - Nothing
 */
function ChatRoomSendLovershipRequest(RequestType) {
	if ((ChatRoomLovershipOption == "CanOfferBeginWedding") && (RequestType == "Propose")) CharacterChangeMoney(Player, -100);
	if ((ChatRoomLovershipOption == "CanBeginWedding") && (RequestType == "Accept")) CharacterChangeMoney(Player, -100);
	ChatRoomLovershipOption = "";
	ServerSend("AccountLovership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

/**
 * Triggered when the player picks a drink from a character's maid tray.
 * @param {string} DrinkType - Drink chosen.
 * @param {number} Money - Cost of the drink.
 * @returns {void} - Nothing
 */
function ChatRoomDrinkPick(DrinkType, Money) {
	if (ChatRoomCanTakeDrink()) {
		var Dictionary = [];
		Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
		Dictionary.push({ Tag: "TargetCharacter", Text: CharacterNickname(CurrentCharacter), MemberNumber: CurrentCharacter.MemberNumber });
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + DrinkType, Type: "Action", Dictionary: Dictionary });
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + Money.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		CharacterChangeMoney(Player, Money * -1);
		DialogLeave();
	}
}

function ChatRoomSendLoverRule(RuleType, Option) { ChatRoomSendRule(RuleType, Option, "Lover"); }
function ChatRoomSendOwnerRule(RuleType, Option) { ChatRoomSendRule(RuleType, Option, "Owner"); }
function ChatRoomAdvancedRule(RuleType) { AdvancedRuleOpen(RuleType); }

/**
 * Sends a rule / restriction / punishment to the player's slave/lover client, it will be handled on the slave/lover's
 * side when received.
 * @param {string} RuleType - The rule selected.
 * @param {"Quest" | "Leave"} Option - If the rule is a quest or we should just leave the dialog.
 * @param {"Owner" | "Lover"} Sender - Type of the sender
 * @returns {void} - Nothing
 */
function ChatRoomSendRule(RuleType, Option, Sender) {
	ServerSend("ChatRoomChat", { Content: Sender + "Rule" + RuleType, Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (Option == "Quest") {
		if (ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber) >= 0) ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber), 1);
		ChatRoomQuestGiven.push(CurrentCharacter.MemberNumber);
	}
	if ((Option == "Leave") || (Option == "Quest")) DialogLeave();
}

function ChatRoomGetLoverRule(RuleType) { return ChatRoomGetRule(RuleType, "Lover"); }
function ChatRoomGetOwnerRule(RuleType) { return ChatRoomGetRule(RuleType, "Owner"); }

/**
 * Gets a rule from the current character
 * @param {string} RuleType - The name of the rule to retrieve.
 * @param {"Owner" | "Lover"} Sender - Type of the sender
 * @returns {boolean} - The owner or lover rule corresponding to the requested rule name
 */
function ChatRoomGetRule(RuleType, Sender) {
	return LogQueryRemote(CurrentCharacter, RuleType, Sender + "Rule");
}


/**
 * Processes a rule sent to the player from her owner or from her lover.
 * @param {object} data - Received rule data object.
 * @returns {object} - Returns the data object, used to continue processing the chat message.
 */
function ChatRoomSetRule(data) {

	// Only works if the sender is the player, and the player is fully collared
	if ((data != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == data.Sender)) {

		// Wardrobe/changing rules
		if (data.Content == "OwnerRuleChangeAllow") LogDelete("BlockChange", "OwnerRule");
		if (data.Content == "OwnerRuleChangeBlock1Hour") LogAdd("BlockChange", "OwnerRule", CurrentTime + 3600000);
		if (data.Content == "OwnerRuleChangeBlock1Day") LogAdd("BlockChange", "OwnerRule", CurrentTime + 86400000);
		if (data.Content == "OwnerRuleChangeBlock1Week") LogAdd("BlockChange", "OwnerRule", CurrentTime + 604800000);
		if (data.Content == "OwnerRuleChangeBlock") LogAdd("BlockChange", "OwnerRule", CurrentTime + 1000000000000);

		// Owner presence rules
		if (data.Content == "OwnerRuleTalkAllow") LogDelete("BlockTalk", "OwnerRule");
		if (data.Content == "OwnerRuleTalkBlock") LogAdd("BlockTalk", "OwnerRule");
		if (data.Content == "OwnerRuleEmoteAllow") LogDelete("BlockEmote", "OwnerRule");
		if (data.Content == "OwnerRuleEmoteBlock") LogAdd("BlockEmote", "OwnerRule");
		if (data.Content == "OwnerRuleWhisperAllow") LogDelete("BlockWhisper", "OwnerRule");
		if (data.Content == "OwnerRuleWhisperBlock") { LogAdd("BlockWhisper", "OwnerRule"); ChatRoomSetTarget(null); }
		if (data.Content == "OwnerRuleChangePoseAllow") LogDelete("BlockChangePose", "OwnerRule");
		if (data.Content == "OwnerRuleChangePoseBlock") LogAdd("BlockChangePose", "OwnerRule");
		if (data.Content == "OwnerRuleAccessSelfAllow") LogDelete("BlockAccessSelf", "OwnerRule");
		if (data.Content == "OwnerRuleAccessSelfBlock") LogAdd("BlockAccessSelf", "OwnerRule");
		if (data.Content == "OwnerRuleAccessOtherAllow") LogDelete("BlockAccessOther", "OwnerRule");
		if (data.Content == "OwnerRuleAccessOtherBlock") LogAdd("BlockAccessOther", "OwnerRule");

		// Key rules
		if (data.Content == "OwnerRuleKeyAllow") LogDelete("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleKeyConfiscate") {InventoryConfiscateKey(); DialogLentLockpicks = false;}
		if (data.Content == "OwnerRuleKeyBlock") LogAdd("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleSelfOwnerLockAllow") LogDelete("BlockOwnerLockSelf", "OwnerRule");
		if (data.Content == "OwnerRuleSelfOwnerLockBlock") LogAdd("BlockOwnerLockSelf", "OwnerRule");

		// Remote rules
		if (data.Content == "OwnerRuleRemoteAllow") LogDelete("BlockRemote", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteAllowSelf") LogDelete("BlockRemoteSelf", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteConfiscate") InventoryConfiscateRemote();
		if (data.Content == "OwnerRuleRemoteBlock") LogAdd("BlockRemote", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteBlockSelf") LogAdd("BlockRemoteSelf", "OwnerRule");

		// Sent to timer cell
		let TimerCell = 0;
		if (data.Content == "OwnerRuleTimerCell5") TimerCell = 5;
		if (data.Content == "OwnerRuleTimerCell15") TimerCell = 15;
		if (data.Content == "OwnerRuleTimerCell30") TimerCell = 30;
		if (data.Content == "OwnerRuleTimerCell60") TimerCell = 60;
		if (TimerCell > 0) {
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedForCell", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CellLock(TimerCell);
		}

		// Sent to GGTS
		let GGTS = 0;
		if (data.Content == "OwnerRuleGGTS5") GGTS = 5;
		if (data.Content == "OwnerRuleGGTS15") GGTS = 15;
		if (data.Content == "OwnerRuleGGTS30") GGTS = 30;
		if (data.Content == "OwnerRuleGGTS60") GGTS = 60;
		if (data.Content == "OwnerRuleGGTS90") GGTS = 90;
		if (data.Content == "OwnerRuleGGTS120") GGTS = 120;
		if (data.Content == "OwnerRuleGGTS180") GGTS = 180;
		if (GGTS > 0) {
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedForGGTS", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			AsylumGGTSLock(GGTS, TextGet("GGTSIntro"));
		}

		// Nickname rules
		if (data.Content == "OwnerRuleNicknameAllow") LogDelete("BlockNickname", "OwnerRule");
		if (data.Content == "OwnerRuleNicknameBlock") LogAdd("BlockNickname", "OwnerRule");

		// Collar Rules
		if (data.Content == "OwnerRuleCollarRelease") {
			if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar")) {
				InventoryRemove(Player, "ItemNeck");
				ChatRoomCharacterItemUpdate(Player, "ItemNeck");
				ServerSend("ChatRoomChat", { Content: "PlayerOwnerCollarRelease", Type: "Action", Dictionary: [{Tag: "DestinationCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber}] });
			}
			LogAdd("ReleasedCollar", "OwnerRule");
		}
		if (data.Content == "OwnerRuleCollarWear") {
			if ((InventoryGet(Player, "ItemNeck") == null) || ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name != "SlaveCollar"))) {
				ServerSend("ChatRoomChat", { Content: "PlayerOwnerCollarWear", Type: "Action", Dictionary: [{Tag: "TargetCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber}] });
			}
			LogDelete("ReleasedCollar", "OwnerRule");
			LoginValidCollar();
		}

		// Forced labor
		if (data.Content == "OwnerRuleLaborMaidDrinks" && Player.CanTalk()) {
			CharacterSetActivePose(Player, null);
			var D = TextGet("ActionGrabbedToServeDrinksIntro");
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedToServeDrinks", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CommonSetScreen("Room", "MaidQuarters");
			CharacterSetCurrent(MaidQuartersMaid);
			MaidQuartersMaid.CurrentDialog = D;
			MaidQuartersMaid.Stage = "205";
			MaidQuartersOnlineDrinkFromOwner = true;
		}

		// Switches it to a server message to announce the new rule to the player
		data.Type = "ServerMessage";

		ChatRoomGetLoadRules(data.Sender);
	}

	// Only works if the sender is the lover of the player
	if ((data != null) && Player.GetLoversNumbers().includes(data.Sender)) {
		if (data.Content == "LoverRuleSelfLoverLockAllow") LogDelete("BlockLoverLockSelf", "LoverRule");
		if (data.Content == "LoverRuleSelfLoverLockBlock") LogAdd("BlockLoverLockSelf", "LoverRule");
		if (data.Content == "LoverRuleOwnerLoverLockAllow") LogDelete("BlockLoverLockOwner", "LoverRule");
		if (data.Content == "LoverRuleOwnerLoverLockBlock") LogAdd("BlockLoverLockOwner", "LoverRule");

		data.Type = "ServerMessage";

		ChatRoomGetLoadRules(data.Sender);
	}

	// Returns the data packet
	return data;

}

/**
 * Sends quest money to the player's owner.
 * @returns {void} - Nothing
 */
function ChatRoomGiveMoneyForOwner() {
	if (ChatRoomCanGiveMoneyForOwner()) {
		ServerSend("ChatRoomChat", { Content: "ActionGiveEnvelopeToOwner", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber }] });
		ServerSend("ChatRoomChat", { Content: "PayQuest" + ChatRoomMoneyForOwner.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		ChatRoomMoneyForOwner = 0;
		DialogLeave();
	}
}

/**
 * Handles the reception of quest data, when payment is received.
 * @param {object} data - Data object containing the payment.
 * @returns {void} - Nothing
 */
function ChatRoomPayQuest(data) {
	if ((data != null) && (data.Sender != null) && (ChatRoomQuestGiven.indexOf(data.Sender) >= 0)) {
		var M = parseInt(data.Content.substring(8));
		if ((M == null) || isNaN(M)) M = 0;
		if (M < 0) M = 0;
		if (M > 30) M = 30;
		CharacterChangeMoney(Player, M);
		ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(data.Sender), 1);
	}
}

/**
 * Triggered when online game data comes in
 * @param {object} data - Game data to process, sent to the current game handler.
 * @returns {void} - Nothing
 */
function ChatRoomOnlineBountyHandleData(data, sender) {
	if (data.finishTime && data.target == Player.MemberNumber) {
		let senderChar = ChatRoomCharacter.find(c => c.MemberNumber == sender);
		const remaining = Math.max(1, Math.ceil((data.finishTime - CommonTime()) / 60000));
		const content = ChatRoomCarryingBountyOpened(senderChar) ? "OnlineBountySuitcaseOngoingOpened" : "OnlineBountySuitcaseOngoing";
		let dict = [];
		dict.push({Tag: "TIMEREMAINING", Text: remaining.toString()});
		dict.push({Tag: "SourceCharacter", Text: CharacterNickname(senderChar), MemberNumber: senderChar.MemberNumber});
		ChatRoomMessage({ Content: content, Type: "Action", Dictionary: dict, Sender: sender });
	}
}

/**
 * Triggered when a game message comes in, we forward it to the current online game being played.
 * @param {IChatRoomGameResponse} data - Game data to process, sent to the current game handler.
 * @returns {void} - Nothing
 */
function ChatRoomGameResponse(data) {
	if (data.Data.KinkyDungeon)
		KinkyDungeonHandleData(data.Data.KinkyDungeon, data.Sender);
	else if (KidnapLeagueOnlineBountyTarget && data.Data.OnlineBounty)
		ChatRoomOnlineBountyHandleData(data.Data.OnlineBounty, data.Sender);
	else if (ChatRoomGame == "LARP") GameLARPProcess(data);
	else if (ChatRoomGame == "MagicBattle") GameMagicBattleProcess(data);
}

/**
 * Triggered when the player uses the /safeword command, we revert the character if safewords are enabled, and display
 * a warning in chat if not.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordChatCommand() {
	if (DialogChatRoomCanSafeword())
		ChatRoomSafewordRevert();
	else if (CurrentScreen == "ChatRoom") {
		/** @type {IChatRoomMessage} */
		var msg = {Sender: Player.MemberNumber, Content: "SafewordDisabled", Type: "Action"};
		ChatRoomMessage(msg);
	}
}

/**
 * Triggered when the player activates her safeword to revert, we swap her appearance to the state when she entered the
 * chat room lobby, minimum permission becomes whitelist and up.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordRevert() {
	if (ChatSearchSafewordAppearance != null) {
		Player.Appearance = ChatSearchSafewordAppearance.slice(0);
		Player.ActivePose = ChatSearchSafewordPose;
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		ServerSend("ChatRoomChat", { Content: "ActionActivateSafewordRevert", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: CharacterNickname(Player) }] });
		if (Player.ItemPermission < 3) {
			Player.ItemPermission = 3;
			ServerAccountUpdate.QueueData({ ItemPermission: Player.ItemPermission }, true);
			setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
		}
	}
}

/**
 * Triggered when the player activates her safeword and wants to be released, we remove all bondage from her and return
 * her to the chat search screen.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordRelease() {
	CharacterReleaseTotal(Player);
	CharacterRefresh(Player);
	ServerSend("ChatRoomChat", { Content: "ActionActivateSafewordRelease", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: CharacterNickname(Player) }] });

	DialogLentLockpicks = false;
	ChatRoomClearAllElements();
	ServerSend("ChatRoomLeave", "");
	CommonSetScreen("Online", "ChatSearch");
}

/**
 * Concatenates the list of users to ban.
 * @param {boolean} IncludesBlackList - Adds the blacklist to the banlist
 * @param {boolean} IncludesGhostList - Adds the ghostlist to the banlist
 * @param {number[]} [ExistingList] - The existing Banlist, if applicable
 * @returns {number[]} Complete array of members to ban
 */
function ChatRoomConcatenateBanList(IncludesBlackList, IncludesGhostList, ExistingList) {
	var BanList = Array.isArray(ExistingList) ? ExistingList : [];
	if (IncludesBlackList) BanList = BanList.concat(Player.BlackList);
	if (IncludesGhostList) BanList = BanList.concat(Player.GhostList);
	return BanList.filter((MemberNumber, Idx, Arr) => Arr.indexOf(MemberNumber) == Idx);
}

/**
 * Concatenates the list of users for Admin list.
 * @param {boolean} IncludesOwner - Adds the owner to the admin list
 * @param {boolean} IncludesLovers - Adds lovers to the admin list
 * @param {number[]} [ExistingList] - The existing Admin list, if applicable
 * @returns {number[]} Complete array of admin members
 */
function ChatRoomConcatenateAdminList(IncludesOwner, IncludesLovers, ExistingList) {
	var AdminList = Array.isArray(ExistingList) ? ExistingList : [];
	if (IncludesOwner && (Player.Ownership != null) && (Player.Ownership.MemberNumber != null)) AdminList = AdminList.concat(Player.Ownership.MemberNumber);
	if (IncludesLovers) CommonArrayConcatDedupe(AdminList, Player.GetLoversNumbers(true));
	return AdminList.filter((MemberNumber, Idx, Arr) => Arr.indexOf(MemberNumber) == Idx);
}

/**
 * Handles a request from another player to read the player's log entries that they are permitted to read. Lovers and
 * owners can read certain entries from the player's log.
 * @param {Character|number} C - A character object representing the requester, or the account number of the requester.
 * @returns {void} - Nothing
 */
function ChatRoomGetLoadRules(C) {
	if (typeof C === "number") {
		C = ChatRoomCharacter.find(CC => CC.MemberNumber == C);
	}
	if (C == null) return;
	if (Player.Ownership && Player.Ownership.MemberNumber != null && Player.Ownership.MemberNumber == C.MemberNumber) {
		ServerSend("ChatRoomChat", {
			Content: "RuleInfoSet",
			Type: "Hidden",
			Target: C.MemberNumber,
			Dictionary: LogGetOwnerReadableRules(C.IsLoverOfPlayer()),
		});
	} else if (C.IsLoverOfPlayer()) {
		ServerSend("ChatRoomChat", {
			Content: "RuleInfoSet",
			Type: "Hidden",
			Target: C.MemberNumber,
			Dictionary: LogGetLoverReadableRules(),
		});
	}
}

/**
 * Handles a response from another player containing the rules that the current player is allowed to read.
 * @param {Character} C - Character to set the rules on
 * @param {LogRecord[]} Rule - An array of rules that the current player can read.
 * @returns {void} - Nothing
 */
function ChatRoomSetLoadRules(C, Rule) {
	if (Array.isArray(Rule)) C.Rule = Rule;
}

/**
 * Take a screenshot of all characters in the chatroom
 * @returns {void} - Nothing
 */
function ChatRoomPhotoFullRoom() {
	// Get the room dimensions
	let Space = ChatRoomCharacterCount >= 2 ? 1000 / Math.min(ChatRoomCharacterCount, 5) : 500;
	let Zoom = ChatRoomCharacterCount >= 3 && ChatRoomCharacterCount < 6 ? Space / 400 : 1;
	let Y = ChatRoomCharacterCount <= 5 ? 1000 * (1 - Zoom) / 2 : 0;
	let X = ChatRoomCharacterCount === 1 ? 250 : 0;
	let Width = ChatRoomCharacterCount === 1 ? 500 : 1000;

	// Take the photo
	ChatRoomPhoto(X, Y, Width, 1000 * Zoom, ChatRoomCharacter);
}

/**
 * Take a screenshot of the player and current character
 * @returns {void} - Nothing
 */
function DialogPhotoCurrentCharacters() {
	ChatRoomPhoto(0, 0, 1000, 1000, [Player, CurrentCharacter]);
}

/**
 * Take a screenshot of the player
 * @returns {void} - Nothing
 */
function DialogPhotoPlayer() {
	ChatRoomPhoto(500, 0, 500, 1000, [Player]);
}

/**
 * Take a screenshot in a chatroom, temporary removing emoticons
 * @param {number} Left - Position of the area to capture from the left of the canvas
 * @param {number} Top - Position of the area to capture from the top of the canvas
 * @param {number} Width - Width of the area to capture
 * @param {number} Height - Height of the area to capture
 * @param {any} Characters - The characters that will be included in the screenshot
 * @returns {void} - Nothing
 */
function ChatRoomPhoto(Left, Top, Width, Height, Characters) {
	// Temporarily remove AFK emoticons
	let CharsToReset = [];
	for (let CR = 0; CR < Characters.length; CR++) {
		let C = Characters[CR];
		let Emoticon = C.Appearance.find(A => A.Asset.Group.Name == "Emoticon");
		if (Emoticon && Emoticon.Property && Emoticon.Property.Expression == "Afk") {
			CharsToReset.push(C);
			Emoticon.Property.Expression = null;
			CharacterRefresh(C, false);
		}
	}

	// Take the photo
	CommonTakePhoto(Left, Top, Width, Height);

	// Revert temporary changes
	for (let CR = 0; CR < CharsToReset.length; CR++) {
		let C = CharsToReset[CR];
		C.Appearance.find(A => A.Asset.Group.Name == "Emoticon").Property.Expression = "Afk";
		CharacterRefresh(C, false);
	}
}

/**
 * Returns whether the most recent chat message is on screen
 * @returns {boolean} - TRUE if the screen has focus and the chat log is scrolled to the bottom
 */
function ChatRoomNotificationNewMessageVisible() {
	return document.hasFocus() && ElementIsScrolledToEnd("TextAreaChatLog");
}

/**
 * Raise a notification for the new chat message if required
 * @param {Character} C - The character that sent the message
 * @param {string} msg - The text of the message
 * @returns {void} - Nothing
 */
function ChatRoomNotificationRaiseChatMessage(C, msg) {
	if (C.ID !== 0
		&& Player.NotificationSettings.ChatMessage.AlertType !== NotificationAlertType.NONE
		&& !ChatRoomNotificationNewMessageVisible())
	{
		NotificationRaise(NotificationEventType.CHATMESSAGE, { body: msg, character: C, useCharAsIcon: true });
	}
}

/**
 * Resets any previously raised Chat Message or Chatroom Join notifications if required
 * @returns {void} - Nothing
 */
function ChatRoomNotificationReset() {
	if (CurrentScreen !== "ChatRoom" || ChatRoomNotificationNewMessageVisible()) {
		NotificationReset(NotificationEventType.CHATMESSAGE);
	}
	if (document.hasFocus()) NotificationReset(NotificationEventType.CHATJOIN);
}

/**
 * Returns whether a notification should be raised for the character entering a chatroom
 * @param {Character} C - The character that entered the room
 * @returns {boolean} - Whether a notification should be raised
 */
function ChatRoomNotificationRaiseChatJoin(C) {
	let raise = false;
	if (!document.hasFocus()) {
		const settings = Player.NotificationSettings.ChatJoin;
		if (settings.AlertType === NotificationAlertType.NONE) raise = false;
		else if (PreferenceIsPlayerInSensDep()) raise = false;
		else if (!settings.Owner && !settings.Lovers && !settings.Friendlist && !settings.Subs) raise = true;
		else if (settings.Owner && Player.IsOwnedByMemberNumber(C.MemberNumber)) raise = true;
		else if (settings.Lovers && C.IsLoverOfPlayer()) raise = true;
		else if (settings.Friendlist && Player.FriendList.includes(C.MemberNumber)) raise = true;
		else if (settings.Subs && C.IsOwnedByPlayer()) raise = true;
	}
	return raise;
}

/**
 * Updates the chatroom with the player's stored chatroom data if needed (happens when entering a recreated chatroom for
 * the first time)
 * @returns {void} - Nothing
 */
function ChatRoomRecreate() {
	if (CurrentTime > ChatRoomNewRoomToUpdateTimer && ChatRoomNewRoomToUpdate && Player.ImmersionSettings && Player.ImmersionSettings.ReturnToChatRoomAdmin &&
		Player.ImmersionSettings.ReturnToChatRoom && Player.LastChatRoomAdmin) {
		// Add the player if they are not an admin
		if (!Player.LastChatRoomAdmin.includes(Player.MemberNumber) && Player.LastChatRoomPrivate) {
			Player.LastChatRoomAdmin.push(Player.MemberNumber);
		}
		var UpdatedRoom = {
			Name: Player.LastChatRoom,
			Description: Player.LastChatRoomDesc,
			Background: Player.LastChatRoomBG,
			Limit: "" + Player.LastChatRoomSize,
			Language: Player.LastChatRoomLanguage,
			Admin: Player.LastChatRoomAdmin,
			Ban: Player.LastChatRoomBan,
			BlockCategory: Player.LastChatRoomBlockCategory,
			Game: ChatRoomData.Game,
			Private: Player.LastChatRoomPrivate,
			Locked: ChatRoomData.Locked,
		};

		ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
		ChatRoomNewRoomToUpdate = null;
	}
}

/**
 * Checks whether or not the player's last chatroom data needs updating
 * @returns {void} - Nothing
 */
function ChatRoomCheckForLastChatRoomUpdates() {
	const Blacklist = Player.BlackList || [];
	// Check whether the chatroom contains at least one "safe" character (a friend, owner, or non-blacklisted player)
	const ContainsSafeCharacters = ChatRoomCharacter.length === 1 || ChatRoomCharacter.some((Char) => {
		return Char.ID !== 0 && (
			Player.FriendList.includes(Char.MemberNumber) ||
			Player.IsOwnedByMemberNumber(Char.MemberNumber) ||
			!Blacklist.includes(Char.MemberNumber)
		);
	});

	if (!ChatRoomData || !ContainsSafeCharacters) {
		// If the room only contains blacklisted characters, do not save the room data
		ChatRoomSetLastChatRoom("");
	} else if (Player.ImmersionSettings && ChatRoomDataChanged()) {
		// Otherwise save the chatroom data if it has changed
		ChatRoomSetLastChatRoom(ChatRoomData.Name);
	}
}

/**
 * Determines whether or not the current chatroom data differs from the locally stroed chatroom data
 * @returns {boolean} - TRUE if the stored chatroom data is different from the current chatroom data, FALSE otherwise
 */
function ChatRoomDataChanged() {
	return ChatRoomLastName != ChatRoomData.Name ||
		ChatRoomLastBG != ChatRoomData.Background ||
		ChatRoomLastSize != ChatRoomData.Limit ||
		ChatRoomLastLanguage != ChatRoomData.Language ||
		ChatRoomLastPrivate != ChatRoomData.Private ||
		ChatRoomLastDesc != ChatRoomData.Description ||
		!CommonArraysEqual(ChatRoomLastAdmin, ChatRoomData.Admin) ||
		!CommonArraysEqual(ChatRoomLastBan, ChatRoomData.Ban) ||
		!CommonArraysEqual(ChatRoomLastBlockCategory, ChatRoomData.BlockCategory);
}

function ChatRoomRefreshFontSize() {
	ChatRoomFontSize = ChatRoomFontSizes[Player.ChatSettings.FontSize || "Medium"];
}

/**
 * Checks if the message can be sent as chat or the player should be warned
 * @param {string} Message - User input
 * @param {Character} WhisperTarget
 * @returns {boolean}
 */
function ChatRoomShouldBlockGaggedOOCMessage(Message, WhisperTarget) {
	if (ChatRoomTargetMemberNumber == null && !(Message.includes("(") || Message.includes("（"))) return false;
	if (Player.ImmersionSettings == null || !Player.ImmersionSettings.BlockGaggedOOC) return false;
	if (Player.CanTalk()) return false;

	if (WhisperTarget && WhisperTarget.Effect.includes("VRAvatars"))
		if (Player.Effect.includes("HideRestraints") && Player.Effect.includes("VRAvatars"))
			return false;

	return true;
}

/**
 * Sorts a chat message dictionary to ensure that tags are handled in the correct order
 * @param {ChatMessageDictionary} dictionary - the dictionary to sort
 * @returns {ChatMessageDictionary} - The sorted dictionary
 */
function ChatRoomSortDictionary(dictionary) {
	if (Array.isArray(dictionary)) {
		return dictionary.sort((e1, e2) => {
			const order1 = ChatRoomDictionarySortOrder.get(e1.Tag) || 0;
			const order2 = ChatRoomDictionarySortOrder.get(e2.Tag) || 0;
			return order1 - order2;
		});
	}
	return [];
}

/**
 * Returns TRUE if the owner presence rule is enforced for the current player
 * @param {string} RuleName - The name of the rule to validate (BlockWhisper, BlockTalk, etc.)
 * @param {Character} Target - The target character
 * @returns {boolean} - TRUE if the rule is enforced
 */
function ChatRoomOwnerPresenceRule(RuleName, Target) {

	if (!LogQuery(RuleName, "OwnerRule")) return false; // FALSE if the rule isn't set
	if ((Player.Ownership == null) || (Player.Ownership.Stage !== 1)) return false; // FALSE if the player isn't fully collared
	if (!ChatRoomOwnerInside()) return false; // FALSE if the owner isn't inside

	// Some rules are only on with specific targets
	let Rule = true;
	if (RuleName == "BlockAccessSelf") Rule = ((Target != null) && (Player.MemberNumber === Target.MemberNumber)); // Block access self only if target is herself
	if (RuleName == "BlockAccessOther") Rule = ((Target != null) && (Player.MemberNumber !== Target.MemberNumber)); // Block access other only if target is another member
	if (RuleName == "BlockWhisper") Rule = ((Target != null) && (Player.Ownership.MemberNumber !== Target.MemberNumber)); // Block whisper doesn't block whispering to the owner

	// Shows a warning message in the chat log if the rule is enforced
	if (Rule) {
		const div = document.createElement("div");
		div.setAttribute('class', 'ChatMessage ChatMessageServerMessage');
		div.setAttribute('data-time', ChatRoomCurrentTime());
		div.setAttribute('data-sender', Player.MemberNumber.toString());
		div.innerHTML = "<b><i>" + TextGet("OwnerPresence" + RuleName) + "</i></b>";
		const Refocus = document.activeElement.id == "InputChat";
		const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
		if (document.getElementById("TextAreaChatLog") != null) {
			document.getElementById("TextAreaChatLog").appendChild(div);
			if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
			if (Refocus) ElementFocus("InputChat");
		}
	}

	// If all validations passed, we enforce the rule
	return Rule;

}
