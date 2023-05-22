"use strict";
var DialogText = "";
var DialogTextDefault = "";
var DialogTextDefaultTimer = -1;
/** The duration temporary status message show up for, in ms
 * @type {number}
 */
var DialogTextDefaultDuration = 5000;
/** @type {null | string} */
var DialogExpressionColor = null;
/**
 * The default color to use when applying items.
 * @type {string}
 */
var DialogColorSelect = null;
/**
 * The list of available items for the selected group.
 * @type DialogInventoryItem[]
 */
var DialogInventory = [];
/**
 * The current page offset of the item list. Also used for activities.
 * @type {number}
 */
var DialogInventoryOffset = 0;

/**
 * The grid configuration for most item views (items, permissions, activities)
 * @type {CommonGenerateGridParameters}
 */
const DialogInventoryGrid = {
	x: 1000,
	y: 175,
	width: 975,
	height: 800,
	itemWidth: 230,
	itemHeight: 255,
};

/**
 * The item currently selected in the Dialog and showing its extended screen.
 *
 * Note that in case this is a lock, the item being locked is available in {@link DialogFocusSourceItem}.
 * @type {Item|null}
 */
var DialogFocusItem = null;
/** @type {Item|null} */
var DialogTightenLoosenItem = null;
/**
 * The actual item being locked while the lock asset has its extended screen drawn.
 * @type {Item|null}
 */
var DialogFocusSourceItem = null;
/** @type {null | ReturnType<typeof setTimeout>} */
var DialogFocusItemColorizationRedrawTimer = null;
/**
 * The list of currently visible menu item buttons.
 * @type {string[]}
 */
var DialogMenuButton = [];
/**
 * The dialog's current mode, what is currently shown.
 * @type {DialogMenuMode}
 */
var DialogMenuMode = "dialog";

/** @deprecated Use DialogMenuMode. */
var DialogColor = null;
/** @deprecated Use DialogMenuMode. */
var DialogItemPermissionMode = null;
/**
 * @deprecated Use DialogMenuMode.
 * @type {null | Item}
 * */
var DialogItemToLock = null;
/**
 * @deprecated Use DialogMenuMode.
 */
var DialogActivityMode = false;
/** @deprecated Use DialogMenuMode. */
var DialogLockMenu = false;
/** @deprecated Use DialogMenuMode. */
var DialogCraftingMenu = false;

var DialogAllowBlush = false;
var DialogAllowEyebrows = false;
var DialogAllowFluids = false;
/** @type {ExpressionItem[]} */
var DialogFacialExpressions = [];
/** The maximum number of expressions per page for a given asset group. */
const DialogFacialExpressionsPerPage = 18;
/**
 * The currently selected expression page number for a given asset group.
 * Contains up to {@link DialogFacialExpressionsPerPage} expressions.
 */
let DialogFacialExpressionsSelectedPage = 0;
var DialogFacialExpressionsSelected = -1;
var DialogFacialExpressionsSelectedBlindnessLevel = 2;
/** @type {Character[]} */
var DialogSavedExpressionPreviews = [];
/** @type {Pose[][]} */
var DialogActivePoses = [];
var DialogExtendedMessage = "";
/**
 * The list of available activities for the selected group.
 * @type {ItemActivity[]}
 */
var DialogActivity = [];
/** @type {Record<"Enabled" | "Equipped" | "BothFavoriteUsable" | "TargetFavoriteUsable" | "PlayerFavoriteUsable" | "Usable" | "TargetFavoriteUnusable" | "PlayerFavoriteUnusable" | "Unusable" | "Blocked", DialogSortOrder>} */
var DialogSortOrder = {
	Enabled: 1,
	Equipped: 2,
	BothFavoriteUsable: 3,
	TargetFavoriteUsable: 4,
	PlayerFavoriteUsable: 5,
	Usable: 6,
	TargetFavoriteUnusable: 7,
	PlayerFavoriteUnusable: 8,
	Unusable: 9,
	Blocked: 10
};
/** @type {null | DialogSelfMenuOptionType} */
var DialogSelfMenuSelected = null;
var DialogLeaveDueToItem = false; // This allows dynamic items to call DialogLeave() without crashing the game
var DialogLentLockpicks = false;
var DialogGamingPreviousRoom = "";
/** @type {"" | ModuleType} */
var DialogGamingPreviousModule = "";
var DialogButtonDisabledTester = /Disabled(For\w+)?$/u;
/**
 * The attempted action that's leading the player to struggle.
 * @type {DialogStruggleActionType?}
 */
let DialogStruggleAction = null;
/**
 * The item we're struggling out of, or swapping from.
 * @type {Item}
 */
let DialogStrugglePrevItem = null;
/**
 * The item we're swapping to.
 * @type {Item}
 */
let DialogStruggleNextItem = null;
/** Whether we went through the struggle selection screen or went straight through. */
let DialogStruggleSelectMinigame = false;

/** @type {Map<string, string>} */
var PlayerDialog = new Map();

/** @type {FavoriteState[]} */
var DialogFavoriteStateDetails = [
	{
		TargetFavorite: true,
		PlayerFavorite: true,
		Icon: "FavoriteBoth",
		UsableOrder: DialogSortOrder.BothFavoriteUsable,
		UnusableOrder: DialogSortOrder.TargetFavoriteUnusable
	},
	{
		TargetFavorite: true,
		PlayerFavorite: false,
		Icon: "Favorite",
		UsableOrder: DialogSortOrder.TargetFavoriteUsable,
		UnusableOrder: DialogSortOrder.TargetFavoriteUnusable
	},
	{
		TargetFavorite: false,
		PlayerFavorite: true,
		Icon: "FavoritePlayer",
		UsableOrder: DialogSortOrder.PlayerFavoriteUsable,
		UnusableOrder: DialogSortOrder.PlayerFavoriteUnusable
	},
	{
		TargetFavorite: false,
		PlayerFavorite: false,
		Icon: null,
		UsableOrder: DialogSortOrder.Usable,
		UnusableOrder: DialogSortOrder.Unusable
	},
];

/**
 * The list of menu types available when clicking on yourself
 * @type {readonly DialogSelfMenuOptionType[]}
 */
var DialogSelfMenuOptions = [
	{
		Name: "Expression",
		IsAvailable: () => true,
		Draw: DialogDrawExpressionMenu,
		Click: DialogClickExpressionMenu,
	},
	{
		Name: "Pose",
		IsAvailable: () => (CurrentScreen == "ChatRoom" || CurrentScreen == "Photographic"),
		Load: DialogLoadPoseMenu,
		Draw: DialogDrawPoseMenu,
		Click: DialogClickPoseMenu,
	},
	{
		Name: "SavedExpressions",
		IsAvailable: () => true,
		Draw: DialogDrawSavedExpressionsMenu,
		Click: DialogClickSavedExpressionsMenu,
	},
	{
		Name: "OwnerRules",
		IsAvailable: () => false,
		Draw: DialogDrawOwnerRulesMenu,
		Click: () => { },
	},
];

/**
 * Returns character based on argument
 * @param {Character | string} C - The characer to get; can be `"Player"` to get player or empty to get current
 * @returns {Character} - The actual character
 */
function DialogGetCharacter(C) {
	if (typeof C === "string")
		return (C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter;
	return C;
}

/**
 * Compares the player's reputation with a given value
 * @param {string} RepType - The name of the reputation to check
 * @param {string} Value - The value to compare
 * @returns {boolean} - Returns TRUE if a specific reputation type is less or equal than a given value
 */
function DialogReputationLess(RepType, Value) { return (ReputationGet(RepType) <= parseInt(Value)); }

/**
 * Compares the player's reputation with a given value
 * @param {string} RepType - The name of the reputation to check
 * @param {string} Value - The value to compare
 * @returns {boolean} - Returns TRUE if a specific reputation type is greater or equal than a given value
 */
function DialogReputationGreater(RepType, Value) { return (ReputationGet(RepType) >= parseInt(Value)); }

/**
 * Compares the player's money with a given amount
 * @param {string} Amount - The amount of money that must be met
 * @returns {boolean} - Returns TRUE if the player has enough money
 */
function DialogMoneyGreater(Amount) { return (parseInt(Player.Money) >= parseInt(Amount)); }

/**
 * Changes a given player's account by a given amount
 * @param {string} Amount - The amount that should be charged or added to the player's account
 * @returns {void} - Nothing
 */
function DialogChangeMoney(Amount) { CharacterChangeMoney(Player, parseInt(Amount)); }

/**
 * Alters the current player's reputation by a given amount
 * @param {ReputationType} RepType - The name of the reputation to change
 * @param {number|string} Value - The value, the player's reputation should be altered by
 * @returns {void} - Nothing
 */
function DialogSetReputation(RepType, Value) { ReputationChange(RepType, (parseInt(ReputationGet(RepType)) * -1) + parseInt(Value)); } // Sets a fixed number for the player specific reputation

/**
 * Change the player's reputation progressively through dialog options (a reputation is easier to break than to build)
 * @param {ReputationType} RepType - The name of the reputation to change
 * @param {number|string} Value - The value, the player's reputation should be altered by
 * @returns {void} - Nothing
 */
function DialogChangeReputation(RepType, Value) { ReputationProgress(RepType, Value); }

/**
 * Equips a specific item on the player from dialog
 * @param {string} AssetName - The name of the asset that should be equipped
 * @param {AssetGroupName} AssetGroup - The name of the corresponding asset group
 * @returns {void} - Nothing
 */
function DialogWearItem(AssetName, AssetGroup) { InventoryWear(Player, AssetName, /** @type {AssetGroupName} */(AssetGroup)); }

/**
 * Equips a random item from a given group to the player from dialog
 * @param {AssetGroupName} AssetGroup - The name of the asset group to pick from
 * @returns {void} - Nothing
 */
function DialogWearRandomItem(AssetGroup) { InventoryWearRandom(Player, /** @type {AssetGroupName} */(AssetGroup)); }

/**
 * Removes an item of a specific item group from the player
 * @param {AssetGroupName} AssetGroup - The item to be removed belongs to this asset group
 * @returns {void} - Nothing
 */
function DialogRemoveItem(AssetGroup) { InventoryRemove(Player, /** @type {AssetGroupName} */(AssetGroup)); }

/**
 * Releases a character from restraints
 * @param {string | Character} C - The character to be released.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogRelease(C) { CharacterRelease(DialogGetCharacter(C)); }

/**
 * Strips a character naked and removes the restraints
 * @param {string | Character} C - The character to be stripped and released.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogNaked(C) { CharacterNaked(DialogGetCharacter(C)); }

/**
 * Fully restrain a character with random items
 * @param {string | Character} C - The character to be restrained.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogFullRandomRestrain(C) { CharacterFullRandomRestrain(DialogGetCharacter(C)); }

/**
 * Checks, if a specific log has been registered with the player
 * @template {LogGroupType} T
 * @param {LogNameType[T]} LogType - The name of the log to search for
 * @param {T} LogGroup - The name of the log group
 * @returns {boolean} - Returns true, if a specific log is registered
 */
function DialogLogQuery(LogType, LogGroup) { return LogQuery(LogType, LogGroup); }

/**
 * Sets the AllowItem flag on the current character
 * @param {string} Allow - The flag to set. Either "TRUE" or "FALSE"
 * @returns {boolean} - The boolean version of the flag
 */
function DialogAllowItem(Allow) { return CurrentCharacter.AllowItem = (Allow.toUpperCase().trim() == "TRUE"); }

/**
 * Returns the value of the AllowItem flag of a given character
 * @param {string | Character} C - The character whose flag should be returned.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - The value of the given character's AllowItem flag
 */
function DialogDoAllowItem(C) { return DialogGetCharacter(C).AllowItem; }

/**
 * Determines if the given character is kneeling
 * @param {string | Character} C - The character to check
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is kneeling
 */
function DialogIsKneeling(C) { return DialogGetCharacter(C).IsKneeling(); }

/**
 * Determines if the player is owned by the current character
 * @returns {boolean} - Returns true, if the player is owned by the current character, false otherwise
 */
function DialogIsOwner() { return (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")); }

/**
 * Determines, if the current character is the player's lover
 * @returns {boolean} - Returns true, if the current character is one of the player's lovers
 */
function DialogIsLover() { return (CurrentCharacter.Name == Player.Lover.replace("NPC-", "")); }

/**
 * Determines if the current character is owned by the player
 * @returns {boolean} - Returns true, if the current character is owned by the player, false otherwise
 */
function DialogIsProperty() { return (CurrentCharacter.Owner == Player.Name); }

/**
 * Checks, if a given character is currently restrained
 * @param {string | Character} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is wearing restraints, false otherwise
 */
function DialogIsRestrained(C) { return DialogGetCharacter(C).IsRestrained(); }

/**
 * Checks, if a given character is currently blinded
 * @param {string | Character} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is blinded, false otherwise
 */
function DialogIsBlind(C) { return DialogGetCharacter(C).IsBlind(); }

/**
 * Checks, if a given character is currently wearing a vibrating item
 * @param {string | Character} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is wearing a vibrating item, false otherwise
 */
function DialogIsEgged(C) { return DialogGetCharacter(C).IsEgged(); }

/**
 * Checks, if a given character is able to change her clothes
 * @param {string | Character} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is able to change clothes, false otherwise
 */
function DialogCanInteract(C) { return DialogGetCharacter(C).CanInteract(); }

/**
 * Sets a new pose for the given character
 * @param {string} C - The character whose pose should be altered.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @param {null | AssetPoseName} [NewPose=null] - The new pose, the character should take.
 * Can be omitted to bring the character back to the standing position.
 * @returns {void} - Nothing
 */
function DialogSetPose(C, NewPose) { CharacterSetActivePose((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter, NewPose || null, true); }

/**
 * Checks, whether a given skill of the player is greater or equal a given value
 * @param {SkillType} SkillType - Name of the skill to check
 * @param {string} Value - The value, the given skill must be compared to
 * @returns {boolean} - Returns true if a specific skill is greater or equal than a given value
 */
function DialogSkillGreater(SkillType, Value) { return (parseInt(SkillGetLevel(Player, SkillType)) >= parseInt(Value)); }

/**
 * Checks, if a given item is available in the player's inventory
 * @param {string} InventoryName
 * @param {AssetGroupName} InventoryGroup
 * @returns {boolean} - Returns true, if the item is available, false otherwise
 */
function DialogInventoryAvailable(InventoryName, InventoryGroup) { return InventoryAvailable(Player, InventoryName, InventoryGroup); }

/**
 * Checks, if the player is the administrator of the current chat room
 * @returns {boolean} - Returns true, if the player belogs to the group of administrators for the current char room false otherwise
 */
function DialogChatRoomPlayerIsAdmin() { return (ChatRoomPlayerIsAdmin() && (CurrentScreen == "ChatRoom")); }

/**
 * Checks, if a safe word can be used.
 * @returns {boolean} - Returns true, if the player is currently within a chat room
 */
function DialogChatRoomCanSafeword() { return (CurrentScreen == "ChatRoom" && !AsylumGGTSIsEnabled() && Player.GameplaySettings.EnableSafeword); }

/**
 * Checks if the player is currently owned.
 * @returns {boolean} - Returns true, if the player is currently owned by an online player (not in trial)
 */
function DialogCanViewRules() { return (Player.Ownership != null) && (Player.Ownership.Stage == 1); }

/**
 * Checks if the has enough GGTS minutes to spend on different activities, for GGTS level 6 and up
 * @param {string} Minute - The number of minutes to compare
 * @returns {boolean} - TRUE if the player has enough minutes
 */
function DialogGGTSMinuteGreater(Minute) { return AsylumGGTSHasMinutes(parseInt(Minute)); }

/**
 * Checks if the player can spend GGTS minutes on herself, for GGTS level 6 and up
 * @returns {boolean} - TRUE if the player has enough minutes
 */
function DialogGGTSCanSpendMinutes() { return (AsylumGGTSIsEnabled() && (AsylumGGTSGetLevel(Player) >= 6)); }

/**
 * The player can ask GGTS for specific actions at level 6, requiring minutes as currency
 * @param {string} Action - The action to trigger
 * @param {string} Minute - The number of minutes to spend
 * @returns {void}
 */
function DialogGGTSAction(Action, Minute) {
	AsylumGGTSDialogAction(Action, parseInt(Minute));
}

/**
 * Checks if the player can beg GGTS to unlock the room
 * @returns {boolean} - TRUE if GGTS can unlock
 */
function DialogGGTSCanUnlock() {
	return (ChatRoomPlayerIsAdmin() && (CurrentScreen == "ChatRoom") && AsylumGGTSHasMinutes(30) && (ChatRoomData != null) && ChatRoomData.Locked);
}

/**
 * Checks if the player can get the GGTS helmet, only available from GGTS
 * @returns {boolean} - TRUE if GGTS can unlock
 */
function DialogGGTSCanGetHelmet() {
	return (AsylumGGTSHasMinutes(200) && !InventoryAvailable(Player, "FuturisticHelmet", "ItemHood"));
}

/**
 * Nurses can do special GGTS interactions with other players
 * @returns {boolean} - TRUE if the player is a nurse in a GGTS room
 */
function DialogCanStartGGTSInteractions() {
	return (AsylumGGTSIsEnabled() && (CurrentCharacter != null) && (AsylumGGTSGetLevel(CurrentCharacter) >= 1) && !DialogCanWatchKinkyDungeon() && (ReputationGet("Asylum") > 0));
}

/**
 * Nurses can ask GGTS for specific interactions with other players
 * @param {string} Interaction - The interaction to trigger
 * @returns {void}
 */
function DialogGGTSInteraction(Interaction) {
	AsylumGGTSDialogInteraction(Interaction);
}

/**
 * Checks the prerequisite for a given dialog
 * @param {number} D - Index of the dialog to check
 * @returns {boolean} - Returns true, if the prerequisite is met, false otherwise
 */
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("Player.") == 0)
		return Player[CurrentCharacter.Dialog[D].Prerequisite.substring(7, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!Player.") == 0)
		return !Player[CurrentCharacter.Dialog[D].Prerequisite.substring(8, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("CurrentCharacter.") == 0)
		return CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(17, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!CurrentCharacter.") == 0)
		return !CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(18, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("(") >= 0)
		return CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Prerequisite);
	else if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
		return !!window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.trim()];
	else
		return !window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250).trim()];
}


/**
 * Checks if the player can play VR games
 * @returns {boolean} - Whether or not the player is wearing a VR headset with Gaming type
 */
function DialogHasGamingHeadset() {
	return (!KinkyDungeonReady && Player.Effect.includes("KinkyDungeonParty"));
}

/**
 * Checks if the player can play VR games
 * @returns {boolean} - Whether or not the player is wearing a VR headset with Gaming type
 */
function DialogHasGamingHeadsetReady() {
	return (KinkyDungeonReady && Player.Effect.includes("KinkyDungeonParty"));
}

/**
 * Checks if the player can watch VR games
 * @returns {boolean} - Whether or not the player is wearing a VR headset with Gaming type
 */
function DialogCanWatchKinkyDungeon() {
	if (CurrentCharacter) {
		if (!CurrentCharacter.Effect.includes("KinkyDungeonParty")) return false;

		if (Player.Effect.includes("VR")) return true;
	}
	return false;
}


/**
 * Starts the kinky dungeon game
 * @returns {void}
 */
function DialogStartKinkyDungeon() {
	if (ArcadeKinkyDungeonLoad()) {
		if (CurrentCharacter) {
			if (KinkyDungeonPlayerCharacter != CurrentCharacter) {
				KinkyDungeonGameRunning = false; // Reset the game to prevent carrying over spectator data
			}
			KinkyDungeonPlayerCharacter = CurrentCharacter;
			if (KinkyDungeonPlayerCharacter != Player && CurrentCharacter.MemberNumber) {
				KinkyDungeonGameData = null;
				ServerSend("ChatRoomChat", { Content: "RequestFullKinkyDungeonData", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
			}
		}
		DialogGamingPreviousRoom = CurrentScreen;
		DialogGamingPreviousModule = CurrentModule;
		MiniGameStart("KinkyDungeon", 0, "DialogEndKinkyDungeon");
	}
}


/**
 * Return to previous room
 * @returns {void}
 */
function DialogEndKinkyDungeon() {
	if (DialogGamingPreviousModule) {
		CommonSetScreen(DialogGamingPreviousModule, DialogGamingPreviousRoom);
	}
}

/**
 * Checks whether the player has a key for the item
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item that should be unlocked
 * @returns {boolean} - Returns true, if the player can unlock the given item with a key, false otherwise
 */
function DialogHasKey(C, Item) {
	if (InventoryGetItemProperty(Item, "SelfUnlock") == false && (!Player.CanInteract() || C.ID == 0)) return false;
	if (C.IsOwnedByPlayer() && InventoryAvailable(Player, "OwnerPadlockKey", "ItemMisc") && Item.Asset.Enable) return true;
	const lock = InventoryGetLock(Item);
	if (lock && lock.Asset.FamilyOnly && Item.Asset.Enable && LogQuery("BlockFamilyKey", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage >= 1)) return false;
	if (C.IsLoverOfPlayer() && InventoryAvailable(Player, "LoversPadlockKey", "ItemMisc") && Item.Asset.Enable && Item.Property && Item.Property.LockedBy && !Item.Property.LockedBy.startsWith("Owner")) return true;
	if (lock && lock.Asset.ExclusiveUnlock) {
		// Locks with exclusive access (intricate, high-sec)
		const allowedMembers = CommonConvertStringToArray(Item.Property.MemberNumberListKeys);
		// High-sec, check if we're in the keyholder list
		if (Item.Property.MemberNumberListKeys != null) return allowedMembers.includes(Player.MemberNumber);
		// Intricate, check that we added that lock
		if (Item.Property.LockMemberNumber == Player.MemberNumber) return true;
	}
	if (lock && lock.Asset.FamilyOnly && Item.Asset.Enable && (C.ID != 0) && !C.IsFamilyOfPlayer()) return false;
	let UnlockName = /** @type {EffectName} */("Unlock-" + Item.Asset.Name);
	if ((Item.Property != null) && (Item.Property.LockedBy != null))
		UnlockName = /** @type {EffectName} */("Unlock-" + Item.Property.LockedBy);
	for (let I = 0; I < Player.Inventory.length; I++)
		if (InventoryItemHasEffect(Player.Inventory[I], UnlockName)) {
			if (lock != null) {
				if (lock.Asset.LoverOnly && !C.IsLoverOfPlayer()) return false;
				if (lock.Asset.OwnerOnly && !C.IsOwnedByPlayer()) return false;
				return true;
			} else return true;
		}
	return false;
}

/**
 * Checks whether the player is able to unlock the provided item on the provided character
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item that should be unlocked
 * @returns {boolean} - Returns true, if the player can unlock the given item, false otherwise
 */
function DialogCanUnlock(C, Item) {
	if ((C.ID != 0) && !Player.CanInteract()) return false;
	if ((Item != null) && (Item.Property != null) && (Item.Property.LockedBy === "ExclusivePadlock")) return (C.ID != 0);
	if (LogQuery("KeyDeposit", "Cell")) return false;
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.OwnerOnly == true)) return Item.Asset.Enable && C.IsOwnedByPlayer();
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.LoverOnly == true)) return Item.Asset.Enable && C.IsLoverOfPlayer();
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.FamilyOnly == true)) return Item.Asset.Enable && C.IsFamilyOfPlayer();
	return DialogHasKey(C, Item);
}

/**
 * Some specific screens like the movie studio cannot allow the player to use items on herself, return FALSE if it's the case
 * @returns {boolean} - Returns TRUE if we allow using items
 */
function DialogAllowItemScreenException() {
	if ((CurrentScreen == "MovieStudio") && (MovieStudioCurrentMovie != "")) return false;
	return true;
}

/**
 * Returns the current character dialog intro
 * @returns {string} - The name of the current dialog, if such a dialog exists, any empty string otherwise
 */
function DialogIntro() {
	for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D))
			return CurrentCharacter.Dialog[D].Result;
	return "";
}


/**
 * Generic dialog function to leave conversation. De-inititalizes global variables and reverts the
 * FocusGroup of the player and the current character to null
 * @returns {void} - Nothing
 */
function DialogLeave() {
	if (!CurrentCharacter) return;

	DialogLeaveFocusItem();

	// Reset the character's height
	if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber) {
		CharacterAppearanceForceUpCharacter = -1;
		CharacterRefresh(CurrentCharacter, false);
	}

	DialogChangeFocusToGroup(CurrentCharacter, null);

	// Deselect the character, exiting the dialog
	CurrentCharacter = null;

	// Reset the state of the self menu
	DialogSelfMenuSelected = null;
	DialogSavedExpressionPreviews = [];
	DialogFacialExpressionsSelected = -1;
	DialogFacialExpressions = [];

	// Go controller, go!
	ControllerClearAreas();
}

/**
 * Generic dialog function to remove a piece of the conversation that's already done
 * @returns {void} - Nothing
 */
function DialogRemove() {
	var pos = 0;
	for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
			if (MouseIn(1025, 160 + pos * 105, 950, 90)) {
				CurrentCharacter.Dialog.splice(D, 1);
				break;
			}
			pos++;
		}
}

/**
 * Generic dialog function to remove any dialog from a specific group
 * @param {string} GroupName - All dialog options are removed from this group
 * @returns {void} - Nothing
 */
function DialogRemoveGroup(GroupName) {
	const GroupNameUpper = GroupName.trim().toUpperCase();
	for (let D = CurrentCharacter.Dialog.length - 1; D >= 0; D--)
		if ((CurrentCharacter.Dialog[D].Group != null) && (CurrentCharacter.Dialog[D].Group.trim().toUpperCase() == GroupNameUpper)) {
			CurrentCharacter.Dialog.splice(D, 1);
		}
}

/**
 * Generic function that sets timers for expression changes, if the player'S expressions have been altered by the dialog
 * @returns {void} - Nothing
 */
function DialogEndExpression() {
	if (DialogAllowBlush) {
		TimerInventoryRemoveSet(Player, "Blush", 15);
		DialogAllowBlush = false;
	}
	if (DialogAllowEyebrows) {
		TimerInventoryRemoveSet(Player, "Eyebrows", 5);
		DialogAllowEyebrows = false;
	}
	if (DialogAllowFluids) {
		TimerInventoryRemoveSet(Player, "Fluids", 5);
		DialogAllowFluids = false;
	}
}

/**
 * Performs a "Back" action through the menu "stack".
 */
function DialogMenuBack() {
	switch (DialogMenuMode) {
		case "activities":
		case "color":
		case "crafted":
		case "locked":
		case "locking":
			DialogChangeMode("items");
			break;

		case "dialog":
			// That's handled in DialogClick via DialogLeave
			break;

		case "extended":
		case "tighten":
			DialogLeaveFocusItem();
			break;

		case "items":
			DialogLeaveItemMenu();
			break;

		case "permissions":
			DialogChangeMode("items");
			break;

		case "struggle":
			if (StruggleMinigameIsRunning()) {
				StruggleMinigameStop();
				// Move back to the item list only if we automatically started to struggle
				if (DialogStruggleSelectMinigame) {
					DialogStruggleSelectMinigame = false;
					DialogChangeMode("items");
				}
			} else {
				DialogChangeMode("items");
			}
			break;

		default:
			console.trace(`Unknown menu mode "${DialogMenuMode}, resetting`);
			DialogChangeMode("dialog");
			CurrentCharacter = null;
			break;
	}
}

/**
 * Returns whether the current mode shows items.
 */
function DialogModeShowsInventory() {
	return ["items", "activities", "locking", "permissions"].includes(DialogMenuMode);
}

/**
 * Leaves the item menu for both characters.
 *
 * This exits the item-selecting UI and switches back to the current character's dialog options.
 *
 * @returns {void} - Nothing
 */
function DialogLeaveItemMenu() {
	DialogChangeFocusToGroup(CharacterGetCurrent(), null);
}

/**
 * Leaves the item menu of the focused item. Constructs a function name from the
 * item's asset group name and the item's name and tries to call that.
 * @returns {boolean} - Returns true, if an item specific exit function was called, false otherwise
 */
function DialogLeaveFocusItem() {
	if (DialogTightenLoosenItem != null) {
		TightenLoosenItemExit();
		// If we still have a focused item, then we entered tightening through its extended screen
		if (DialogFocusItem)
			DialogChangeMode("extended");
		else
			DialogChangeMode("items");
	} else {
		if (DialogFocusItem != null) {
			const FuncName = ExtendedItemFunctionPrefix() + "Exit";
			ExtendedItemExit();
			DialogChangeMode("items");
			return (typeof window[FuncName] === "function");
		}
	}
	return false;
}

/**
 * Adds the item in the dialog list
 * @param {Character} C - The character the inventory is being built for
 * @param {Item} item - The item to be added to the inventory
 * @param {boolean} isWorn - Should be true, if the item is currently being worn, false otherwise
 * @param {DialogSortOrder} [sortOrder] - Defines where in the inventory list the item is sorted
 * @returns {void} - Nothing
 */
function DialogInventoryAdd(C, item, isWorn, sortOrder) {
	if (DialogMenuMode !== "permissions") {
		const asset = item.Asset;

		if (!isWorn && !asset.Enable)
			return;

		// Make sure we do not add owner/lover/family only items for invalid characters, owner/lover locks can be applied on the player by the player for self-bondage
		if (asset.OwnerOnly && !isWorn && !C.IsOwnedByPlayer())
			if ((C.ID != 0) || ((C.Owner == "") && (C.Ownership == null)) || !asset.IsLock || ((C.ID == 0) && LogQuery("BlockOwnerLockSelf", "OwnerRule")))
				return;
		if (asset.LoverOnly && !isWorn && !C.IsLoverOfPlayer()) {
			if (!asset.IsLock || C.GetLoversNumbers(true).length == 0) return;
			if (C.ID == 0) {
				if (LogQuery("BlockLoverLockSelf", "LoverRule")) return;
			}
			else if (!C.IsOwnedByPlayer() || LogQueryRemote(C, "BlockLoverLockOwner", "LoverRule")) return;
		}
		if (asset.FamilyOnly && asset.IsLock && !isWorn && (C.ID == 0) && LogQuery("BlockOwnerLockSelf", "OwnerRule")) return;
		if (asset.FamilyOnly && (C.ID != 0) && !C.IsFamilyOfPlayer()) return;
		if (asset.FamilyOnly && asset.IsLock && (C.ID != 0) && C.IsOwner()) return;

		// Do not show keys if they are in the deposit
		if (LogQuery("KeyDeposit", "Cell") && InventoryIsKey(item)) return;

		// Don't allow gendered assets in the opposite-gender-only space
		if (!CharacterAppearanceGenderAllowed(asset)) return;

		// Make sure we do not duplicate the item in the list, including crafted items
		for (let I = 0; I < DialogInventory.length; I++)
			if ((DialogInventory[I].Asset.Group.Name == asset.Group.Name) && (DialogInventory[I].Asset.Name == asset.Name)) {
				if ((item.Craft == null) && (DialogInventory[I].Craft != null)) continue;
				if ((item.Craft != null) && (DialogInventory[I].Craft == null)) continue;
				if ((item.Craft != null) && (DialogInventory[I].Craft != null) && (item.Craft.Name != DialogInventory[I].Craft.Name)) continue;
				return;
			}
	}

	// Adds the item to the selection list
	const inventoryItem = DialogInventoryCreateItem(C, item, isWorn, sortOrder);
	if (item.Craft != null) {
		inventoryItem.Craft = item.Craft;
		if (inventoryItem.SortOrder.charAt(0) == DialogSortOrder.Usable.toString()) inventoryItem.SortOrder = DialogSortOrder.PlayerFavoriteUsable.toString() + item.Asset.Description;
		if (inventoryItem.SortOrder.charAt(0) == DialogSortOrder.Unusable.toString()) inventoryItem.SortOrder = DialogSortOrder.PlayerFavoriteUnusable.toString() + item.Asset.Description;
	}
	DialogInventory.push(inventoryItem);

}

/**
 * Creates an individual item for the dialog inventory list
 * @param {Character} C - The character the inventory is being built for
 * @param {Item} item - The item to be added to the inventory
 * @param {boolean} isWorn - Should be true if the item is currently being worn, false otherwise
 * @param {DialogSortOrder} [sortOrder] - Defines where in the inventory list the item is sorted
 * @returns {DialogInventoryItem} - The inventory item
 */
function DialogInventoryCreateItem(C, item, isWorn, sortOrder) {
	const asset = item.Asset;
	const favoriteStateDetails = DialogGetFavoriteStateDetails(C, asset);

	// Determine the sorting order for the item
	if (DialogMenuMode !== "permissions") {
		if (InventoryBlockedOrLimited(C, item)) {
			sortOrder = DialogSortOrder.Blocked;
		}
		else if (sortOrder == null) {
			if (asset.DialogSortOverride != null) {
				sortOrder = asset.DialogSortOverride;
			} else {
				if (InventoryAllow(C, asset, undefined, false) && InventoryChatRoomAllow(asset.Category)) {
					sortOrder = favoriteStateDetails.UsableOrder;
				} else {
					sortOrder = favoriteStateDetails.UnusableOrder;
				}
			}
		}
	} else if (sortOrder == null) {
		sortOrder = DialogSortOrder.Enabled;
	}

	// Determine the icons to display in the preview image
	/** @type {InventoryIcon[]} */
	let icons = [];
	if (favoriteStateDetails.Icon) icons.push(favoriteStateDetails.Icon);
	icons = icons.concat(DialogGetLockIcon(item, isWorn));
	if (!C.IsPlayer() && InventoryIsAllowedLimited(C, item)) icons.push("AllowedLimited");
	icons = icons.concat(DialogGetAssetIcons(asset));
	icons = icons.concat(DialogGetEffectIcons(item));

	/** @type {DialogInventoryItem} */
	return {
		...item,
		Worn: isWorn,
		Icons: icons,
		SortOrder: sortOrder.toString() + asset.Description,
		Vibrating: isWorn && InventoryItemHasEffect(item, "Vibrating", true),
	};
}

/**
 * Returns settings for an item based on whether the player and target have favorited it, if any
 * @param {Character} C - The targeted character
 * @param {Asset} asset - The asset to check favorite settings for
 * @param {string} [type=null] - The type of the asset to check favorite settings for
 * @returns {FavoriteState} - The details to use for the asset
 */
function DialogGetFavoriteStateDetails(C, asset, type = null) {
	const isTargetFavorite = InventoryIsFavorite(C, asset.Name, asset.Group.Name, type);
	const isPlayerFavorite = C.ID !== 0 && InventoryIsFavorite(Player, asset.Name, asset.Group.Name, type);
	return DialogFavoriteStateDetails.find(F => F.TargetFavorite == isTargetFavorite && F.PlayerFavorite == isPlayerFavorite);
}

/**
 * Return icons representing the asset's current lock state
 * @param {Item} item
 * @param {boolean} isWorn
 */
function DialogGetLockIcon(item, isWorn) {
	/** @type {InventoryIcon[]} */
	const icons = [];
	if (InventoryItemHasEffect(item, "Lock")) {
		if (item.Property && item.Property.LockedBy)
			icons.push(item.Property.LockedBy);
		else
			// One of the default-locked items
			icons.push(isWorn ? "Locked" : "Unlocked");
	} else if (item.Craft && item.Craft.Lock) {
		if (!isWorn || InventoryItemHasEffect(item, "Lock"))
			icons.push(item.Craft.Lock);
	}
	return icons;
}

/**
 * Returns a list of icons associated with the asset
 * @param {Asset} asset - The asset to get icons for
 * @returns {InventoryIcon[]} - A list of icon names
 */
function DialogGetAssetIcons(asset) {
	let icons = [];
	icons = icons.concat(asset.PreviewIcons);
	if (asset.OwnerOnly) icons.push("OwnerOnly");
	if (asset.LoverOnly) icons.push("LoverOnly");
	if (asset.FamilyOnly) icons.push("FamilyOnly");
	if (asset.AllowActivity && asset.AllowActivity.length > 0) icons.push("Handheld");
	return icons;
}

/** @type {Partial<Record<InventoryIcon, EffectName[]>>} */
const DialogEffectIconTable = {
	"GagLight": ["GagVeryLight", "GagLight", "GagEasy"],
	"GagNormal": ["GagNormal", "GagMedium"],
	"GagHeavy": ["GagHeavy", "GagVeryHeavy"],
	"GagTotal": ["GagTotal", "GagTotal2", "GagTotal3", "GagTotal4"],
	"DeafLight": ["DeafLight"],
	"DeafNormal": ["DeafNormal", "DeafHeavy"],
	"DeafHeavy": ["DeafTotal"],
	"BlindLight": ["BlindLight"],
	"BlindNormal": ["BlindNormal", "BlindHeavy"],
	"BlindHeavy": ["BlindTotal"],
};

/**
 * Return icons for each "interesting" effect on the item.
 * @param {Item} item
 * @returns {InventoryIcon[]} - A list of icon names.
 */
function DialogGetEffectIcons(item) {
	/** @type {InventoryIcon[]} */
	let icons = [];
	for (const [icon, effects] of /** @type {[InventoryIcon, EffectName[]][]} */(Object.entries(DialogEffectIconTable))) {
		for (const effect of effects) {
			if (InventoryItemHasEffect(item, effect, true)) {
				icons.push(icon);
				break;
			}
		}
	}
	return icons;
}

/**
 * Some special screens can always allow you to put on new restraints. This function determines, if this is possible
 * @returns {boolean} - Returns trues, if it is possible to put on new restraints.
 */
function DialogAlwaysAllowRestraint() {
	return (CurrentScreen == "Photographic");
}

/**
 * Checks whether the player can use a remote on the given character and item
 * @param {Character} C - the character that the item is equipped on
 * @param {Item} Item - the item to check for remote usage against
 * @return {VibratorRemoteAvailability} - Returns the status of remote availability: Available, NoRemote, NoLoversRemote, RemotesBlocked, CannotInteract, NoAccess, InvalidItem
 */
function DialogCanUseRemoteState(C, Item) {
	// Can't use remotes if there is no item, or if the item doesn't have the needed effects.
	if (!Item || !(InventoryItemHasEffect(Item, "Egged") || InventoryItemHasEffect(Item, "UseRemote"))) return "InvalidItem";
	// Can't use remotes if the player cannot interact with their hands
	if (!Player.CanInteract()) return "CannotInteract";
	// Can't use remotes on self if the player is owned and their remotes have been blocked by an owner rule
	if (C.ID === 0 && Player.Ownership && Player.Ownership.Stage === 1 && LogQuery("BlockRemoteSelf", "OwnerRule")) return "RemotesBlocked";
	if (Item.Asset.LoverOnly) {
		if (!C.IsLoverOfPlayer()) {
			return "NoAccess";
		} else if (!InventoryAvailable(Player, "LoversVibratorRemote", "ItemVulva")) {
			return "NoLoversRemote";
		} else {
			return "Available";
		}
	} else {

		// Otherwise, the player must have a vibrator remote and some items can block remotes
		if (C.Effect.indexOf("BlockRemotes") >= 0) {
			return "RemotesBlocked";
		}
		if (!InventoryAvailable(Player, "VibratorRemote", "ItemVulva")) {
			return "NoRemote";
		}
		if (LogQuery("BlockRemote", "OwnerRule")) {
			return "NoRemoteOwnerRuleActive";
		}
		return "Available";
	}
}

/**
 * Checks whether the player can color the given item on the given character
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item to check the player's ability to color against
 * @returns {boolean} - TRUE if the player is able to color the item, FALSE otherwise
 */
function DialogCanColor(C, Item) {
	const ItemColorable = !Item || (Item && Item.Asset && Item.Asset.ColorableLayerCount > 0);
	const CanUnlock = InventoryItemHasEffect(Item, "Lock", true) ? DialogCanUnlock(C, Item) : true;
	return (Player.CanInteract() && CanUnlock && ItemColorable) || DialogAlwaysAllowRestraint();
}

/**
 * Checks whether a lock can be inspected while blind.
 * @param {AssetLockType} lockName - The lock type
 * @returns {boolean}
 */
function DialogCanInspectLockWhileBlind(lockName) {
	return ["SafewordPadlock", "CombinationPadlock"].includes(lockName);
}

/**
 * Builds the possible dialog activity options based on the character settings
 * @param {Character} C - The character for which to build the activity dialog options
 * @return {void} - Nothing
 */
function DialogBuildActivities(C) {
	if (C.FocusGroup == null) {
		DialogActivity = [];
	} else {
		DialogActivity = ActivityAllowedForGroup(C, C.FocusGroup.Name);
	}
}

/**
 * Build the buttons in the top menu
 * @param {Character} C - The character for whom the dialog is prepared
 * @returns {void} - Nothing
 */
function DialogMenuButtonBuild(C) {

	DialogMenuButton = [];

	// The "Exit" button is always available
	DialogMenuButton = ["Exit"];

	// There's no group focused, hence no menu to draw
	if (C.FocusGroup == null) return;

	/** The item in the current slot */
	const Item = InventoryGet(C, C.FocusGroup.Name);
	const ItemBlockedOrLimited = !!Item && InventoryBlockedOrLimited(C, Item);
	const IsItemLocked = InventoryItemHasEffect(Item, "Lock", true);
	const IsGroupBlocked = InventoryGroupIsBlocked(C);
	const CanAccessLockpicks = Player.CanInteract() || Player.CanWalk(); // If the character can access her tools. Maybe in the future you will be able to hide a lockpick in your panties :>

	if (DialogMenuMode === "color") {
		if (Item == null) {
			DialogMenuButton.push("ColorCancel");
			DialogMenuButton.push("ColorSelect");
		}
	}

	else if (DialogMenuMode === "struggle") {
		// Struggle has no additional buttons
	}

	else if (DialogMenuMode === "locked") {
		// If the item isn't locked, there are no more buttons to add
		const Lock = InventoryGetLock(Item);
		if (!IsItemLocked || !Lock) return;

		const LockBlockedOrLimited = InventoryBlockedOrLimited(C, Lock) || ItemBlockedOrLimited;

		if (!Player.IsBlind() && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract())
			|| ((Item != null) && (C.ID == 0) && !Player.CanInteract() && InventoryItemHasEffect(Item, "Block", true) && DialogCanUnlock(C, Item) && InventoryAllow(
				C, Item.Asset) && !IsGroupBlocked)) {
			DialogMenuButton.push("Unlock");
		}
		if (InventoryAllow(C, Item.Asset) && !IsGroupBlocked && !InventoryGroupIsBlocked(Player, "ItemHands") && InventoryItemIsPickable(Item) && (C.ID == 0 || (C.OnlineSharedSettings && !C.OnlineSharedSettings.DisablePickingLocksOnSelf))) {
			if (DialogLentLockpicks)
				DialogMenuButton.push("PickLock");
			else if (CanAccessLockpicks)
				for (let I = 0; I < Player.Inventory.length; I++)
					if (Player.Inventory[I].Name == "Lockpicks") {
						DialogMenuButton.push("PickLock");
						break;
					}
		}
		if (Lock && (!Player.IsBlind() || DialogCanInspectLockWhileBlind(/** @type {AssetLockType} */ (Lock.Asset.Name)))) {
			DialogMenuButton.push(LockBlockedOrLimited ? "InspectLockDisabled" : "InspectLock");
		}

	}

	else if (DialogMenuMode === "crafted") {
		// No buttons there
	}

	else if (DialogMenuMode === "activities") {
		if (DialogInventory != null && DialogActivity.length > 12 && Player.CanInteract()) {
			DialogMenuButton.push("Next");
			DialogMenuButton.push("Prev");
		}
	}

	else if (DialogMenuMode === "locking") {
		// No buttons there
	}

	// Pushes all valid main buttons, based on if the player is restrained, has a blocked group, has the key, etc.
	else {

		if ((DialogInventory != null) && (DialogInventory.length > 12) && ((Player.CanInteract() && !IsGroupBlocked) || DialogMenuMode === "permissions")) {
			DialogMenuButton.push("Next");
			DialogMenuButton.push("Prev");
		}

		if (IsItemLocked && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract()))
			DialogMenuButton.push("Remove");

		if (!IsItemLocked && !IsGroupBlocked && (Item != null) && (Item.Asset != null) && Item.Asset.AllowTighten && Player.CanInteract() && InventoryAllow(C, Item.Asset))
			DialogMenuButton.push("TightenLoosen");

		if (
			IsItemLocked && Item.Property && Item.Property.LockedBy &&
			(
				(
					!Player.IsBlind() ||
					(Item.Property && DialogCanInspectLockWhileBlind(Item.Property.LockedBy))
				) ||
				(
					InventoryAllow(C, Item.Asset) &&
					!IsGroupBlocked &&
					!InventoryGroupIsBlocked(Player, "ItemHands") &&
					InventoryItemIsPickable(Item)
				) &&
				(
					C.ID == 0 ||
					(C.OnlineSharedSettings && !C.OnlineSharedSettings.DisablePickingLocksOnSelf)
				)
			)
		) {
			DialogMenuButton.push("LockMenu");
		}

		if ((Item != null) && (C.ID == 0) && (!Player.CanInteract() || (IsItemLocked && !DialogCanUnlock(C, Item))) && (DialogMenuButton.indexOf("Unlock") < 0) && InventoryAllow(C, Item.Asset) && !IsGroupBlocked)
			DialogMenuButton.push("Struggle");

		if ((Item != null) && (Item.Craft != null))
			DialogMenuButton.push("Crafting");

		// If the Asylum GGTS controls the item, we show a disabled button and hide the other buttons
		if (AsylumGGTSControlItem(C, Item)) {
			DialogMenuButton.push("GGTSControl");
		} else if (Item != null) {
			// There's an item in the slot

			if (!IsItemLocked && Player.CanInteract() && InventoryAllow(C, Item.Asset) && !IsGroupBlocked) {
				if (InventoryDoesItemAllowLock(Item)) {
					DialogMenuButton.push(ItemBlockedOrLimited ? "LockDisabled" : "Lock");
				}

				if (InventoryItemHasEffect(Item, "Mounted", true))
					DialogMenuButton.push("Dismount");
				else if (InventoryItemHasEffect(Item, "Enclose", true))
					DialogMenuButton.push("Escape");
				else
					DialogMenuButton.push("Remove");
			}

			const canUseRemoteState = DialogCanUseRemoteState(C, Item);
			if (
				Item.Asset.Extended &&
				(Player.CanInteract() || DialogAlwaysAllowRestraint() || Item.Asset.AlwaysInteract) &&
				(!IsGroupBlocked || Item.Asset.AlwaysExtend) &&
				(!Item.Asset.OwnerOnly || (C.IsOwnedByPlayer())) &&
				(!Item.Asset.LoverOnly || (C.IsLoverOfPlayer())) &&
				(!Item.Asset.FamilyOnly || (C.IsFamilyOfPlayer())) &&
				canUseRemoteState === "InvalidItem"
			) {
				DialogMenuButton.push(ItemBlockedOrLimited ? "UseDisabled" : "Use");
			}

			if (!DialogMenuButton.includes("Use") && canUseRemoteState !== "InvalidItem") {
				let button = "";
				switch (canUseRemoteState) {
					case "Available":
						button = ItemBlockedOrLimited ? "RemoteDisabled" : "Remote";
						break;
					default:
						button = `RemoteDisabledFor${canUseRemoteState}`;
						break;
				}
				DialogMenuButton.push(button);
			}
		}

		// Color selection
		if (DialogCanColor(C, Item)) DialogMenuButton.push(ItemBlockedOrLimited ? "ColorPickDisabled" : "ColorPick");

		if (DialogActivity.length > 0) DialogMenuButton.push("Activity");

		// Item permission enter/exit
		if (C.ID == 0) {
			if (DialogMenuMode === "permissions")
				DialogMenuButton.push("DialogNormalMode");
			else
				DialogMenuButton.push("DialogPermissionMode");
		}
	}
}

/**
 * Sort the inventory list by the global variable SortOrder (a fixed number & current language description)
 * @returns {void} - Nothing
 */
function DialogInventorySort() {
	DialogInventory.sort((a, b) => a.SortOrder.localeCompare(b.SortOrder, undefined, { numeric: true, sensitivity: 'base' }));
}

/**
 * Returns TRUE if the crafted item can be used on a character, validates for owners and lovers
 * @param {Character} C - The character whose inventory must be built
 * @param {Object} Craft - The crafting properties of the item
 * @returns {Boolean} - TRUE if we can use it
 */
function DialogCanUseCraftedItem(C, Craft) {
	if (Craft == null) return true;
	for (let A of Asset) {
		if ((A.Name == Craft.Item) && A.OwnerOnly && !C.IsOwnedByPlayer()) return false;
		if ((A.Name == Craft.Item) && A.LoverOnly && !C.IsLoverOfPlayer()) return false;
		if ((A.Name == Craft.Item) && A.FamilyOnly && !C.IsFamilyOfPlayer()) return false;
		if ((Craft.Lock != null) && (A.Name == Craft.Lock) && A.OwnerOnly && !C.IsOwnedByPlayer()) return false;
		if ((Craft.Lock != null) && (A.Name == Craft.Lock) && A.LoverOnly && !C.IsLoverOfPlayer()) return false;
		if ((Craft.Lock != null) && (A.Name == Craft.Lock) && A.FamilyOnly && !C.IsFamilyOfPlayer()) return false;
	}
	return true;
}

/**
 * Build the inventory listing for the dialog which is what's equipped,
 * the player's inventory and the character's inventory for that group
 * @param {Character} C - The character whose inventory must be built
 * @param {number} [Offset] - The offset to be at, if specified.
 * @param {boolean} [locks=false] - If TRUE we build a list of locks instead.
 * @param {boolean} [redrawPreviews=false] - If TRUE and if building a list of preview character images, redraw the canvases
 * @returns {void} - Nothing
 */
function DialogInventoryBuild(C, Offset, locks = false, redrawPreviews = false) {

	// Make sure there's a focused group
	DialogInventoryOffset = Offset == null ? 0 : Offset;

	const DialogInventoryBefore = DialogInventoryStringified(C);
	DialogInventory = [];
	if (C.FocusGroup == null) return;

	if (locks) {
		for (const item of Player.Inventory) {
			if (item.Asset != null && item.Asset.IsLock) {
				DialogInventoryAdd(C, item, false);
			}
		}
		DialogInventorySort();
		return;
	}

	// First, we add anything that's currently equipped
	const CurItem = C.Appearance.find(A => A.Asset.Group.Name == C.FocusGroup.Name && A.Asset.DynamicAllowInventoryAdd(C));
	if (CurItem)
		DialogInventoryAdd(C, CurItem, true, DialogSortOrder.Enabled);

	// In item permission mode we add all the enable items except the ones already on, unless on Extreme difficulty
	if (DialogMenuMode === "permissions") {
		for (const A of C.FocusGroup.Asset) {
			if (!A.Enable)
				continue;

			if (A.Wear) {
				if ((CurItem == null) || (CurItem.Asset.Name != A.Name) || (CurItem.Asset.Group.Name != A.Group.Name))
					DialogInventoryAdd(Player, { Asset: A }, false, DialogSortOrder.Enabled);
			} else if (A.IsLock) {
				const LockIsWorn = InventoryCharacterIsWearingLock(C, /** @type {AssetLockType} */ (A.Name));
				DialogInventoryAdd(Player, { Asset: A }, LockIsWorn, DialogSortOrder.Enabled);
			}
		}
	} else {

		// Second, we add everything from the victim inventory
		for (const I of C.Inventory)
			if ((I.Asset != null) && (I.Asset.Group.Name == C.FocusGroup.Name) && I.Asset.DynamicAllowInventoryAdd(C))
				DialogInventoryAdd(C, I, false);

		// Third, we add everything from the player inventory if the player isn't the victim
		if (C.ID != 0)
			for (const I of Player.Inventory)
				if ((I.Asset != null) && (I.Asset.Group.Name == C.FocusGroup.Name) && I.Asset.DynamicAllowInventoryAdd(C))
					DialogInventoryAdd(C, I, false);

		// Fourth, we add all free items (especially useful for clothes), or location-specific always available items
		for (const A of Asset)
			if (A.Group.Name === C.FocusGroup.Name && A.DynamicAllowInventoryAdd(C))
				if (A.Value === 0 || (A.AvailableLocations.includes("Asylum") && (CurrentScreen.startsWith("Asylum") || ChatRoomSpace === "Asylum")))
					DialogInventoryAdd(C, { Asset: A }, false);

		// Fifth, we add all crafted items for the player that matches that slot
		if (Player.Crafting != null) {
			for (let Craft of Player.Crafting)
				if ((Craft != null) && (Craft.Item != null)) {
					const group = AssetGroupGet(C.AssetFamily, C.FocusGroup.Name);
					for (let A of group.Asset)
						if (CraftingAppliesToItem(Craft, A) && DialogCanUseCraftedItem(C, Craft))
							DialogInventoryAdd(C, { Asset: A, Craft: Craft }, false);
				}
		}

		// Sixth. we add all crafted items from the character that matches that slot
		if (C.Crafting != null) {
			let Crafting = CraftingDecompressServerData(C.Crafting);
			for (let Craft of Crafting)
				if ((Craft != null) && (Craft.Item != null))
					if ((Craft.Private == null) || (Craft.Private == false)) {
						Craft.MemberName = CharacterNickname(C);
						Craft.MemberNumber = C.MemberNumber;
						const group = AssetGroupGet(C.AssetFamily, C.FocusGroup.Name);
						for (let A of group.Asset)
							if (CraftingAppliesToItem(Craft, A) && DialogCanUseCraftedItem(C, Craft))
								DialogInventoryAdd(C, { Asset: A, Craft: Craft }, false);
					}
		}

	}

	DialogInventorySort();

	// Build the list of preview images
	const DialogInventoryAfter = DialogInventoryStringified(C);
	const redraw = redrawPreviews || (DialogInventoryBefore !== DialogInventoryAfter);
	AppearancePreviewBuild(C, redraw);
}

/**
 * Create a stringified list of the group and the assets currently in the dialog inventory
 * @param {Character} C - The character the dialog inventory has been built for
 * @returns {string} - The list of assets as a string
 */
function DialogInventoryStringified(C) {
	return (C.FocusGroup ? C.FocusGroup.Name : "") + (DialogInventory ? JSON.stringify(DialogInventory.map(I => I.Asset.Name).sort()) : "");
}

/**
 * Build the initial state of the selection available in the facial expressions menu
 * @returns {void} - Nothing
 */
function DialogFacialExpressionsBuild() {
	DialogFacialExpressions = [];
	for (let I = 0; I < Player.Appearance.length; I++) {
		const PA = Player.Appearance[I];
		const ExpressionList = [...(PA.Asset.Group.AllowExpression || [])];
		if (!ExpressionList.length || PA.Asset.Group.Name == "Eyes2") continue;
		if (PA.Asset.ExpressionPrerequisite.length && PA.Asset.ExpressionPrerequisite.some(pre => InventoryPrerequisiteMessage(Player, pre) !== "")) continue;
		if (!ExpressionList.includes(null)) ExpressionList.unshift(null);
		/** @type {ExpressionItem} */
		const Item = {
			Appearance: PA,
			Group: /** @type {ExpressionGroupName} */(PA.Asset.Group.Name),
			CurrentExpression: (PA.Property == null) ? null : PA.Property.Expression,
			ExpressionList: ExpressionList,
		};
		DialogFacialExpressions.push(Item);
	}
	// Temporary (?) solution to make the facial elements appear in a more logical order, as their alphabetical order currently happens to match up
	DialogFacialExpressions = DialogFacialExpressions.sort(function (a, b) {
		return a.Appearance.Asset.Group.Name < b.Appearance.Asset.Group.Name ? -1 : a.Appearance.Asset.Group.Name > b.Appearance.Asset.Group.Name ? 1 : 0;
	});
}

/**
 * Saves the expressions to a slot
 * @param {number} Slot - Index of saved expression (0 to 4)
 */
function DialogFacialExpressionsSave(Slot) {
	Player.SavedExpressions[Slot] = [];
	for (let x = 0; x < DialogFacialExpressions.length; x++) {
		Player.SavedExpressions[Slot].push({ Group: DialogFacialExpressions[x].Group, CurrentExpression: DialogFacialExpressions[x].CurrentExpression });
	}
	if (Player.SavedExpressions[Slot].every(expression => !expression.CurrentExpression))
		Player.SavedExpressions[Slot] = null;
	ServerAccountUpdate.QueueData({ SavedExpressions: Player.SavedExpressions });
	DialogBuildSavedExpressionsMenu();
}

/**
 * Loads expressions from a slot
 * @param {number} Slot - Index of saved expression (0 to 4)
 */
function DialogFacialExpressionsLoad(Slot) {
	const expressions = Player.SavedExpressions && Player.SavedExpressions[Slot];
	if (expressions != null) {
		expressions.forEach(e => CharacterSetFacialExpression(Player, e.Group, e.CurrentExpression));
		DialogFacialExpressionsBuild();
	}
}

/**
 * Builds the savedexpressions menu previews.
 * @returns {void} - Nothing
 */
function DialogBuildSavedExpressionsMenu() {
	const ExcludedGroups = ["Mask"];
	const AppearanceItems = Player.Appearance.filter(A => A.Asset.Group.Category === "Appearance" && !ExcludedGroups.includes(A.Asset.Group.Name));
	const BaseAppearance = AppearanceItems.filter(A => !A.Asset.Group.AllowExpression);
	const ExpressionGroups = AppearanceItems.filter(A => A.Asset.Group.AllowExpression);
	Player.SavedExpressions.forEach((expression, i) => {
		if (expression) {
			const PreviewCharacter = CharacterLoadSimple("SavedExpressionPreview-" + i);
			PreviewCharacter.Appearance = BaseAppearance.slice();
			ExpressionGroups.forEach(I =>
				PreviewCharacter.Appearance.push({
					Asset: I.Asset,
					Color: I.Color,
					Property: I.Property ? { ...I.Property } : undefined,
				})
			);

			for (let x = 0; x < expression.length; x++) {
				CharacterSetFacialExpression(PreviewCharacter, expression[x].Group, expression[x].CurrentExpression);
			}

			DialogSavedExpressionPreviews[i] = PreviewCharacter;
		}
	});
}

/**
 * Draws the savedexpressions menu
 * @returns {void} - Nothing
 */
function DialogDrawSavedExpressionsMenu() {
	DrawText(DialogFindPlayer("SavedExpressions"), 210, 90, "White", "Black");

	if ((!DialogSavedExpressionPreviews || !DialogSavedExpressionPreviews.length) && Player.SavedExpressions.some(expression => expression != null))
		DialogBuildSavedExpressionsMenu();

	for (let x = 0; x < 5; x++) {
		if (Player.SavedExpressions[x] == null) {
			DrawText(DialogFindPlayer("SavedExpressionsEmpty"), 160, 216 + (x * 170), "White", "Black");
		} else {
			const PreviewCanvas = DrawCharacterSegment(DialogSavedExpressionPreviews[x], 100, 30, 300, 220);
			MainCanvas.drawImage(PreviewCanvas, 20, 92 + (x * 175), 260, 190);
		}

		DrawButton(290, 160 + (x * 170), 120, 50, DialogFindPlayer("SavedExpressionsSave"), "White");
		DrawButton(290, 220 + (x * 170), 120, 50, DialogFindPlayer("SavedExpressionsLoad"), "White");
	}
}

/** Handles clicks in the savedexpressions menu
 * @returns {void} - Nothing
 */
function DialogClickSavedExpressionsMenu() {
	if (MouseXIn(290, 120)) {
		for (let x = 0; x < 5; x++) {
			if (MouseYIn(160 + (x * 170), 50)) {
				DialogFacialExpressionsSave(x);
			}
		}
	}
	if (MouseXIn(290, 120)) {
		for (let x = 0; x < 5; x++) {
			if (MouseYIn(220 + (x * 170), 50)) {
				DialogFacialExpressionsLoad(x);
			}
		}
	}
}

/**
 * Build the initial state of the pose menu
 * @returns {void} - Nothing
 */
function DialogLoadPoseMenu() {
	DialogActivePoses = [];

	// Gather all unique categories from poses
	const PoseCategories = PoseFemale3DCG
		.filter(P => (P.AllowMenu || P.AllowMenuTransient && CurrentCharacter.AllowedActivePose.includes(P.Name)))
		.map(P => P.Category)
		.filter((C, I, Categories) => C && Categories.indexOf(C) === I);

	// Add their pose in order so they're grouped together
	PoseCategories.forEach(Category => {
		DialogActivePoses.push(PoseFemale3DCG.filter(P => (P.AllowMenu || P.AllowMenuTransient && CurrentCharacter.AllowedActivePose.includes(P.Name)) && P.Category == Category));
	});
}



/**
 * Handles the Click events in the Dialog Screen
 * @returns {boolean} - Whether a button was clicked
 */
function DialogMenuButtonClick() {

	// Hack because those panes handle their menu icons themselves
	if (["color", "extended", "tighten"].includes(DialogMenuMode)) return false;

	// Gets the current character and item
	/** The focused character */
	const C = CharacterGetCurrent();
	/** The focused item */
	const Item = C.FocusGroup ? InventoryGet(C, C.FocusGroup.Name) : null;

	// Finds the current icon
	for (let I = 0; I < DialogMenuButton.length; I++) {
		if (MouseIn(1885 - I * 110, 15, 90, 90)) {

			// Exit Icon - Go back one level in the menu
			if (DialogMenuButton[I] == "Exit") {
				DialogMenuBack();
				return;
			}

			// Next Icon - Shows the next 12 items
			else if (DialogMenuButton[I] == "Next") {
				let contents = DialogMenuMode === "activities" ? DialogActivity : DialogInventory;
				DialogInventoryOffset = DialogInventoryOffset + 12;
				if (DialogInventoryOffset >= contents.length) DialogInventoryOffset = 0;
				return true;
			}

			// Prev Icon - Shows the previous 12 items
			else if (DialogMenuButton[I] == "Prev") {
				let contents = DialogMenuMode === "activities" ? DialogActivity : DialogInventory;
				DialogInventoryOffset = DialogInventoryOffset - 12;
				if (DialogInventoryOffset < 0) { DialogInventoryOffset = contents.length - ((contents.length % 12) == 0 ? 12 : contents.length % 12); }
				return true;
			}

			// Use Icon - Pops the item extension for the focused item
			else if ((DialogMenuButton[I] == "Use") && (Item != null)) {
				DialogExtendItem(Item);
				return true;
			}

			// Remote Icon - Pops the item extension
			else if ((DialogMenuButton[I] == "Remote") && DialogCanUseRemoteState(C, Item) === "Available") {
				DialogExtendItem(Item);
				return true;
			}

			// Lock Icon - Rebuilds the inventory list with locking items
			else if (DialogMenuButton[I] == "Lock") {
				if (Item && InventoryDoesItemAllowLock(Item)) {
					DialogChangeMode("locking");
				}
				return true;
			}

			// Unlock Icon - If the item is padlocked, we immediately unlock.  If not, we start the struggle progress.
			else if ((DialogMenuButton[I] == "Unlock") && (Item != null)) {
				// Check that this is not one of the sticky-locked items
				const isNotStickyLock = InventoryItemHasEffect(Item, "Lock", true) && !InventoryItemHasEffect(Item, "Lock", false);
				if (C.FocusGroup.IsItem() && isNotStickyLock && (!C.IsPlayer() || C.CanInteract())) {
					InventoryUnlock(C, C.FocusGroup.Name);
					if (ChatRoomPublishAction(C, "ActionUnlock", Item, null)) {
						DialogLeave();
					} else {
						DialogChangeMode("items");
					}
				} else
					DialogStruggleStart(C, "ActionUnlock", Item, null);
				return true;
			}

			// Tighten/Loosen Icon - Opens the sub menu
			else if (((DialogMenuButton[I] == "TightenLoosen")) && (Item != null)) {
				DialogSetTightenLoosenItem(Item);
				return true;
			}

			// Remove/Struggle Icon - Starts the struggling mini-game (can be impossible to complete)
			else if (["Remove", "Struggle", "Dismount", "Escape"].includes(DialogMenuButton[I]) && Item != null) {
				/** @type {DialogStruggleActionType} */
				let action = "ActionRemove";
				if (InventoryItemHasEffect(Item, "Lock"))
					action = "ActionUnlockAndRemove";
				else if (C.IsPlayer())
					action = /** @type {DialogStruggleActionType} */("Action" + DialogMenuButton[I]);
				DialogStruggleStart(C, action, Item, null);
				return true;
			}

			// PickLock Icon - Starts the lockpicking mini-game
			else if (((DialogMenuButton[I] == "PickLock")) && (Item != null)) {
				StruggleMinigameStart(C, "LockPick", Item, null, DialogStruggleStop);
				DialogMenuButtonBuild(C);
				return true;
			}

			// When the player inspects a lock
			else if ((DialogMenuButton[I] == "InspectLock") && (Item != null)) {
				var Lock = InventoryGetLock(Item);
				if (Lock != null) DialogExtendItem(Lock, Item);
				return true;
			}

			// Color picker Icon - Starts the color picking, keeps the original color and shows it at the bottom
			else if (DialogMenuButton[I] == "ColorPick") {
				if (!Item) {
					ElementCreateInput("InputColor", "text", (DialogColorSelect != null) ? DialogColorSelect.toString() : "");
				} else {
					const originalColor = Item.Color;
					ItemColorLoad(C, Item, 1300, 25, 675, 950);
					ItemColorOnExit((save) => {
						DialogChangeMode("items");
						if (save && !CommonColorsEqual(originalColor, Item.Color)) {
							if (C.ID == 0) ServerPlayerAppearanceSync();
							ChatRoomPublishAction(C, "ActionChangeColor", Object.assign({}, Item, { Color: originalColor }), Item);
						}
					});
				}
				DialogChangeMode("color");
				return true;
			}

			// When the user selects a color, applies it to the item
			else if (!Item && (DialogMenuButton[I] == "ColorSelect") && CommonIsColor(ElementValue("InputColor"))) {
				DialogColorSelect = ElementValue("InputColor");
				ElementRemove("InputColor");
				DialogChangeMode("items");
				return true;
			}

			// When the user cancels out of color picking, we recall the original color
			else if (!Item && DialogMenuButton[I] == "ColorCancel") {
				DialogColorSelect = null;
				ElementRemove("InputColor");
				DialogChangeMode("items");
				return true;
			}

			// When the user selects the lock menu, we enter
			else if (Item && DialogMenuButton[I] == "LockMenu") {
				DialogChangeMode("locked");
				return true;
			}

			// When the user selects the lock menu, we enter
			else if (Item && DialogMenuButton[I] == "Crafting") {
				DialogChangeMode("crafted");
				return true;
			}

			// When the user wants to select a sexual activity to perform
			else if (DialogMenuButton[I] == "Activity") {
				DialogChangeMode("activities");
				return true;
			}

			// When we enter item permission mode, we rebuild the inventory to set permissions
			else if (DialogMenuButton[I] == "DialogPermissionMode") {
				DialogChangeMode("permissions");
				return true;
			}

			// When we leave item permission mode, we upload the changes for everyone in the room
			else if (DialogMenuButton[I] == "DialogNormalMode") {
				DialogChangeMode("items");
				return true;
			}
		}
	}

	return false;
}

/**
 * Publishes the item action to the local chat room or the dialog screen
 * @param {Character} C - The character who is the actor in this action
 * @param {string} Action - The action performed
 * @param {Item} ClickItem - The item that is used
 * @returns {void} - Nothing
 */
function DialogPublishAction(C, Action, ClickItem) {
	// Publishes the item result
	if ((CurrentScreen == "ChatRoom") && !InventoryItemHasEffect(ClickItem)) {
		if (ChatRoomPublishAction(C, Action, null, ClickItem))
			DialogLeave();
	}
	else if (C.IsNpc()) {
		let Line = ClickItem.Asset.Group.Name + ClickItem.Asset.DynamicName(Player);
		let D = DialogFind(C, Line, null, false);
		if (D != "") {
			C.CurrentDialog = D;
			DialogLeaveItemMenu();
		}
	}

}

/**
 * Returns TRUE if the clicked item can be processed, make sure it's not the same item as the one already used
 * @param {Object} CurrentItem - The item currently equiped
 * @param {Object} ClickItem - The clicked item
 * @returns {boolean} - TRUE when we can process
 */
function DialogAllowItemClick(CurrentItem, ClickItem) {
	if (CurrentItem == null) return true;
	if (CurrentItem.Asset.Name != ClickItem.Asset.Name) return true;
	if ((CurrentItem.Craft == null) && (ClickItem.Craft != null)) return true;
	if ((CurrentItem.Craft != null) && (ClickItem.Craft == null)) return true;
	if ((CurrentItem.Craft != null) && (ClickItem.Craft != null) && (CurrentItem.Craft.Name != ClickItem.Craft.Name)) return true;
	return false;
}

/**
 * Handles clicks on an item
 * @param {DialogInventoryItem} ClickItem - The item that is clicked
 * @returns {void} - Nothing
 */
function DialogItemClick(ClickItem) {

	// Gets the current character and item
	var C = CharacterGetCurrent();
	var CurrentItem = InventoryGet(C, C.FocusGroup.Name);
	if (AsylumGGTSControlItem(C, CurrentItem)) return;

	// In permission mode, the player can allow or block items for herself
	if ((C.ID == 0) && DialogMenuMode === "permissions") {
		const worn = (ClickItem.Worn || (CurrentItem && (CurrentItem.Asset.Name == ClickItem.Asset.Name)));
		DialogInventoryTogglePermission(ClickItem, worn);
		return;
	}

	// If the item is blocked or limited for that character, we do not use it
	if (InventoryBlockedOrLimited(C, ClickItem)) return;

	// If we must apply a lock to an item (can trigger a daily job)
	if (DialogMenuMode === "locking") {
		if (CurrentItem && InventoryDoesItemAllowLock(CurrentItem)) {
			InventoryLock(C, CurrentItem, ClickItem, Player.MemberNumber);
			IntroductionJobProgress("DomLock", ClickItem.Asset.Name, true);
			DialogChangeMode("items");
			if (ChatRoomPublishAction(C, "ActionAddLock", CurrentItem, ClickItem))
				DialogLeave();
		}
		return;
	}

	// Cannot change item if the previous one is locked or blocked by another group
	if ((CurrentItem == null) || !InventoryItemHasEffect(CurrentItem, "Lock", true)) {
		if (!InventoryGroupIsBlocked(C, null, true) && (!InventoryGroupIsBlocked(C) || !ClickItem.Worn))
			if (InventoryAllow(C, ClickItem.Asset)) {

				// If the room allows the item
				if (!InventoryChatRoomAllow(ClickItem.Asset.Category)) {
					DialogSetStatus(DialogFindPlayer("BlockedByRoom"), DialogTextDefaultDuration);
					return;
				}

				// Make sure we do not use the same item
				if (DialogAllowItemClick(CurrentItem, ClickItem)) {
					if (ClickItem.Asset.Wear) {

						// Check if selfbondage is allowed for the item if used on self
						if ((ClickItem.Asset.SelfBondage <= 0) || (SkillGetLevel(Player, "SelfBondage") >= ClickItem.Asset.SelfBondage) || (C.ID != 0) || DialogAlwaysAllowRestraint()) {
							/** @type {DialogStruggleActionType} */
							let action;
							if (CurrentItem && ClickItem) {
								action = "ActionSwap";
							} else if (ClickItem) {
								action = "ActionUse";
							} else {
								action = "ActionRemove";
							}
							DialogStruggleStart(C, action, CurrentItem, ClickItem);
						} else if (ClickItem.Asset.SelfBondage <= 10)
							DialogSetStatus(DialogFindPlayer("RequireSelfBondage" + ClickItem.Asset.SelfBondage), DialogTextDefaultDuration);
						else
							DialogSetStatus(DialogFindPlayer("CannotUseOnSelf"), DialogTextDefaultDuration);

					} else {

						// The vibrating egg remote can open the vibrating egg's extended dialog
						if ((ClickItem.Asset.Name === "VibratorRemote" || ClickItem.Asset.Name === "LoversVibratorRemote")
							&& DialogCanUseRemoteState(C, CurrentItem) === "Available") {
							DialogExtendItem(InventoryGet(C, C.FocusGroup.Name));
						}

						// Runs the activity arousal process if activated, & publishes the item action text to the chatroom
						DialogPublishAction(C, "ActionUse", ClickItem);
						ActivityArousalItem(Player, C, ClickItem.Asset);

					}
				}
				else if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
					DialogExtendItem(CurrentItem);

			}
		return;
	}

	// If the item can unlock another item or simply show dialog text (not wearable)
	if (InventoryAllow(C, ClickItem.Asset))
		if (InventoryItemHasEffect(ClickItem, /** @type {EffectName} */("Unlock-" + CurrentItem.Asset.Name)))
			DialogStruggleStart(C, "ActionUnlock", CurrentItem, null);
		else if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
			DialogExtendItem(CurrentItem);
		else if (!ClickItem.Asset.Wear) {
			DialogPublishAction(C, "ActionUse", ClickItem);
		}

}

/**
 * Toggle permission of an item in the dialog inventory list
 * @param {DialogInventoryItem} item
 * @param {boolean} worn - True if the player is changing permissions for an item they're wearing
 */
function DialogInventoryTogglePermission(item, worn) {
	InventoryTogglePermission(item, null, worn);

	// Refresh the inventory item
	const itemIndex = DialogInventory.findIndex(i => i.Asset.Name == item.Asset.Name && i.Asset.Group.Name == item.Asset.Group.Name);
	const sortOrder = /** @type {DialogSortOrder} */ (parseInt(item.SortOrder.replace(/[^0-9].+/gm, '') || DialogSortOrder.Usable)); // only keep the number at the start
	DialogInventory[itemIndex] = DialogInventoryCreateItem(Player, item, item.Worn, sortOrder);
}

/**
 * Changes the dialog mode and perform the initial setup.
 *
 * @param {DialogMenuMode} mode The new mode for the dialog.
 */
function DialogChangeMode(mode) {
	// In permission-mode, send a character update so that others
	// catch up on our (maybe) updated item permissions
	if (DialogMenuMode == "permissions" && CurrentScreen == "ChatRoom") {
		ChatRoomCharacterUpdate(Player);
	}

	const C = CharacterGetCurrent();
	DialogMenuMode = mode;

	// Clear status so that messages don't bleed through from one group to another
	DialogStatusClear();

	switch (DialogMenuMode) {
		case "activities":
		case "color":
		case "permissions":
		case "items":
		case "locked":
			DialogInventoryBuild(C, null);
			DialogMenuButtonBuild(C);
			DialogBuildActivities(C);
			// Ensure we don't leave that set, that's only for "locking" mode
			DialogFocusSourceItem = null;
			break;

		case "locking":
			DialogInventoryBuild(C, null, true);
			DialogMenuButtonBuild(C);
			DialogBuildActivities(C);
			break;

		case "dialog":
			DialogInventory = [];
			DialogMenuButton = [];
			break;

		case "extended":
		case "tighten":
		case "crafted":
		case "struggle":
			DialogMenuButtonBuild(C);
			break;

		default:
			console.warn(`Asked to change to mode ${DialogMenuMode}, but setup missing`);
			break;
	}

	// Set the status message
	if (DialogMenuMode === "items") {
		DialogSetStatus(DialogFindPlayer("SelectItemGroup").replace("GroupName", DialogActualNameForGroup(C, C.FocusGroup).toLowerCase()));
	} else if (DialogMenuMode === "permissions") {
		DialogSetStatus(DialogFind(Player, "DialogPermissionMode"));
	} else if (DialogMenuMode === "activities") {
		if (DialogActivity.length > 0)
			DialogSetStatus(DialogFindPlayer("SelectActivityGroup").replace("GroupName", DialogActualNameForGroup(C, C.FocusGroup).toLowerCase().toLowerCase()));
		else
			DialogSetStatus(DialogFindPlayer("SelectActivityNone").replace("GroupName", DialogActualNameForGroup(C, C.FocusGroup).toLowerCase().toLowerCase()));
	} else if (DialogMenuMode === "locking") {
		DialogSetStatus(DialogFindPlayer("SelectLock").replace("GroupName", DialogActualNameForGroup(C, C.FocusGroup).toLowerCase()));
	} else {
		DialogSetStatus("");
	}
}

/**
 * Change the given character's focused group.
 * @param {Character} C - The character to change the focus of.
 * @param {AssetItemGroup|string} Group - The group that should gain focus.
 */
function DialogChangeFocusToGroup(C, Group) {
	let G = null;
	if (typeof Group === "string") {
		G = AssetGroupGet(C.AssetFamily, /** @type {AssetGroupName} */ (Group));
		if (!Group) return;
	} else {
		G = Group;
	}

	// Deselect any extended screen and color picking in progress
	// It's done without calling DialogLeaveFocusItem() so it
	// acts as cancelling out of a in-progress edit.
	DialogFocusItem = null;
	DialogTightenLoosenItem = null;
	ItemColorCancelAndExit();

	// Stop sounds & expressions from struggling/swapping items
	AudioDialogStop();
	DialogEndExpression();

	// If we're in the two-character dialog, clear their focused group
	if (!CurrentCharacter.IsPlayer()) {
		Player.FocusGroup = null;
		CurrentCharacter.FocusGroup = null;
	}

	// Now set the selected group and refresh
	C.FocusGroup = /** @type {AssetItemGroup} */ (G);
	if (C.FocusGroup) {
		// If we're changing permissions on ourself, don't change to the item list
		// Same for activities, keep us in that mode if the focus moves around
		if (!(DialogMenuMode === "permissions" && C.IsPlayer() || DialogMenuMode === "activities")) {
			DialogChangeMode("items");
		}
		// Set the mode back to itself to trigger a refresh of the state variables.
		DialogChangeMode(DialogMenuMode);
	} else {
		// We don't have a focused group anymore. Switch to dialog mode.
		DialogChangeMode("dialog");
	}
}

/**
 * Handles the click in the dialog screen
 * @returns {void} - Nothing
 */
function DialogClick() {
	// Check that there's actually a character selected
	if (!CurrentCharacter) return;

	// Gets the current character
	let C = CharacterGetCurrent();

	// Check if the user clicked on one of the top menu icons
	if (DialogMenuButtonClick()) return;

	// User clicked on the interacted character or herself, check if we need to update the menu
	if (MouseIn(0, 0, 1000, 1000) && (CurrentCharacter.AllowItem || (MouseX < 500)) && ((CurrentCharacter.ID != 0) || (MouseX > 500)) && (DialogIntro() != "") && DialogAllowItemScreenException()) {
		C = (MouseX < 500) ? Player : CurrentCharacter;
		let X = MouseX < 500 ? 0 : 500;
		for (const Group of AssetGroup) {
			if (!Group.IsItem()) continue;
			const Zone = Group.Zone.find(Z => DialogClickedInZone(C, Z, 1, X, 0, C.HeightRatio));
			if (Zone) {
				DialogChangeFocusToGroup(C, Group);
				break;
			}
		}
	}

	// If the user clicked in the facial expression menu
	if (MouseXIn(0, 500) && CurrentCharacter != null && CurrentCharacter.IsPlayer()) {
		if (MouseIn(420, 50, 90, 90) && DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1)
			DialogFindNextSubMenu();
		if (!DialogSelfMenuSelected)
			DialogClickExpressionMenu();
		else
			DialogSelfMenuSelected.Click();
	}

	if (DialogMenuMode === "dialog") {
		// If we need to leave the dialog (only allowed when there's an entry point to the dialog, not in the middle of a conversation)
		if (MouseIn(1885, 25, 90, 90) && DialogIntro() != "" && DialogIntro() != "NOEXIT")
			DialogLeave();

		// If the user clicked on a text dialog option, we trigger it
		if (MouseIn(1025, 100, 950, 890) && CurrentCharacter != null) {
			let optionID = 0;
			for (let D = 0; D < CurrentCharacter.Dialog.length; D++) {
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if (MouseIn(1025, 160 + optionID * 105, 950, 90)) {
						// If the player is gagged, the answer will always be the same
						if (!Player.CanTalk()) CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerGagged");
						else CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;

						// A dialog option can change the conversation stage, show text or launch a custom function
						if ((Player.CanTalk() && CurrentCharacter.CanTalk()) || SpeechFullEmote(CurrentCharacter.Dialog[D].Option)) {
							CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
							if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
							if (CurrentCharacter.Dialog[D].Function != null) CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Function);
						} else if ((CurrentCharacter.Dialog[D].Function != null) && (CurrentCharacter.Dialog[D].Function.trim() == "DialogLeave()"))
							DialogLeave();
						break;
					}
					optionID++;
				}
			}
		}
		return;
	}

	// Block out clicking on anything else if we're not supposed to interact with the selected character
	if (C.FocusGroup === null || !CurrentCharacter.AllowItem || DialogIntro() === "") return;

	/** The item currently sitting in the focused group */
	const FocusItem = InventoryGet(C, C.FocusGroup.Name);

	// If the user clicked the Up button, move the character up to the top of the screen
	if ((CurrentCharacter.HeightModifier < -90 || CurrentCharacter.HeightModifier > 30) && (CurrentCharacter.FocusGroup != null) && MouseIn(510, 50, 90, 90)) {
		CharacterAppearanceForceUpCharacter = CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber ? -1 : CurrentCharacter.MemberNumber;
		return;
	}

	// If the user clicked anywhere outside the current character item zones, ensure the position is corrected
	if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber && ((MouseX < 500) || (MouseX > 1000) || (CurrentCharacter.FocusGroup == null))) {
		CharacterAppearanceForceUpCharacter = -1;
		CharacterRefresh(CurrentCharacter, false, false);
	}

	// If the user wants to speed up the add / swap / remove progress
	if (MouseIn(1000, 200, 1000, 800) && DialogMenuMode === "struggle") {
		if (StruggleMinigameIsRunning()) {
			StruggleMinigameClick();
		} else {
			for (const [idx, [game, data]] of StruggleGetMinigames().entries()) {
				if (MouseIn(1387 + 300 * (idx - 1), 600, 225, 275) && data.DisablingCraftedProperty && !InventoryCraftPropertyIs(DialogStrugglePrevItem, data.DisablingCraftedProperty)) {
					StruggleMinigameStart(Player, game, DialogStrugglePrevItem, DialogStruggleNextItem, DialogStruggleStop);
					DialogMenuButtonBuild(C);
				}
			}
		}
		return;
	}

	if (DialogMenuMode === "extended") {
		if (DialogFocusItem != null)
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Click()");
		return;
	} else if (DialogMenuMode === "tighten") {
		if (DialogTightenLoosenItem != null)
			TightenLoosenItemClick();
		return;
	} else if (DialogMenuMode === "color") {
		if (MouseIn(1300, 25, 675, 950) && FocusItem) {
			ItemColorClick(C, C.FocusGroup.Name, 1200, 25, 775, 950, true);
		}
		return;
	} else if (DialogMenuMode === "crafted") {
		// Nothing to click here
		return;
	}

	// In activity mode, we check if the user clicked on an activity box
	if (MouseIn(DialogInventoryGrid.x, DialogInventoryGrid.y, DialogInventoryGrid.width, DialogInventoryGrid.height) && DialogMenuMode === "activities") {

		// For each activities in the list
		CommonGenerateGrid(DialogActivity, DialogInventoryOffset, DialogInventoryGrid, (item, x, y, width, height) => {
			// If this specific activity is clicked, we run it
			if (!MouseIn(x, y, width, height)) return false;
			const type = (item.Item && item.Item.Property ? item.Item.Property.Type : null);
			if (!item.Blocked || item.Blocked === "limited" && InventoryCheckLimitedPermission(C, item.Item, type)) {
				if (C.IsNpc() && item.Item) {
					let Line = C.FocusGroup.Name + item.Item.Asset.DynamicName(Player);
					let D = DialogFind(C, Line, null, false);
					if (D != "") {
						C.CurrentDialog = D;
					}
				}
				IntroductionJobProgress("SubActivity", item.Activity.MaxProgress.toString(), true);
				if (item.Item && item.Item.Asset.Name === "ShockRemote") {
					let targetItem = InventoryGet(C, C.FocusGroup.Name);
					if (targetItem && targetItem.Property && typeof targetItem.Property.TriggerCount === "number") {
						targetItem.Property.TriggerCount++;
						ChatRoomCharacterItemUpdate(C, C.FocusGroup.Name);
					}
				}
				ActivityRun(C, item);
				return true;
			}
		});
		return;
	}

	// If the user clicks on one of the items
	if (MouseIn(DialogInventoryGrid.x, DialogInventoryGrid.y, DialogInventoryGrid.width, DialogInventoryGrid.height) && DialogModeShowsInventory() && (DialogMenuMode === "permissions" || (Player.CanInteract() && !InventoryGroupIsBlocked(C, null, true)))) {
		// For each items in the player inventory
		CommonGenerateGrid(DialogInventory, DialogInventoryOffset, DialogInventoryGrid, (item, x, y, width, height) => {
			// If the item is clicked
			if (!MouseIn(x, y, width, height)) return false;
			if (item.Asset.Enable || (item.Asset.Extended && item.Asset.OwnerOnly && CurrentCharacter.IsOwnedByPlayer())) {
				DialogItemClick(item);
				return true;
			}
		});
	}
}

/**
 * Returns whether the clicked co-ordinates are inside the asset zone
 * @param {Character} C - The character the click is on
 * @param {readonly [number, number, number, number]} Zone - The 4 part array of the rectangular asset zone on the character's body: [X, Y, Width, Height]
 * @param {number} Zoom - The amount the character has been zoomed
 * @param {number} X - The X co-ordinate of the click
 * @param {number} Y - The Y co-ordinate of the click
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @returns {boolean} - If TRUE the click is inside the zone
 */
function DialogClickedInZone(C, Zone, Zoom, X, Y, HeightRatio) {
	let CZ = DialogGetCharacterZone(C, Zone, X, Y, Zoom, HeightRatio);
	return MouseIn(CZ[0], CZ[1], CZ[2], CZ[3]);
}

/**
 * Return the co-ordinates and dimensions of the asset group zone as it appears on screen
 * @param {Character} C - The character the zone is calculated for
 * @param {readonly [number, number, number, number]} Zone - The 4 part array of the rectangular asset zone: [X, Y, Width, Height]
 * @param {number} X - The starting X co-ordinate of the character's position
 * @param {number} Y - The starting Y co-ordinate of the character's position
 * @param {number} Zoom - The amount the character has been zoomed
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @returns {[number, number, number, number]} - The 4 part array of the displayed rectangular asset zone: [X, Y, Width, Height]
 */
function DialogGetCharacterZone(C, Zone, X, Y, Zoom, HeightRatio) {
	X += CharacterAppearanceXOffset(C, HeightRatio) * Zoom;
	Y += CharacterAppearanceYOffset(C, HeightRatio) * Zoom;
	Zoom *= HeightRatio;

	let Left = X + Zone[0] * Zoom;
	let Top = CharacterAppearsInverted(C) ? 1000 - (Y + (Zone[1] + Zone[3]) * Zoom) : Y + Zone[1] * Zoom;
	let Width = Zone[2] * Zoom;
	let Height = Zone[3] * Zoom;
	return [Left, Top, Width, Height];
}

/**
 * Finds and sets the next available character sub menu.
 * @returns {void} - Nothing
 */
function DialogFindNextSubMenu() {
	var CurrentIndex = DialogSelfMenuOptions.indexOf(DialogSelfMenuSelected);
	if (CurrentIndex == -1) CurrentIndex = 0;

	var NextIndex = CurrentIndex + 1 == DialogSelfMenuOptions.length ? 0 : CurrentIndex + 1;

	for (let SM = NextIndex; SM < DialogSelfMenuOptions.length; SM++) {
		if (DialogSelfMenuOptions[SM].IsAvailable()) {
			if (DialogSelfMenuOptions[SM].Load)
				DialogSelfMenuOptions[SM].Load();
			DialogSelfMenuSelected = DialogSelfMenuOptions[SM];
			return;
		}
		if (SM + 1 == DialogSelfMenuOptions.length) SM = -1;
	}
}

/**
 * Finds and set an available character sub menu.
 * @param {string} MenuName - The name of the sub menu, see DialogSelfMenuOptions.
 * @param {boolean} force - Whether to check availability of the menu first.
 * @returns {boolean} - True, when the sub menu is found and available and was switched to. False otherwise and nothing happened.
 */
function DialogFindSubMenu(MenuName, force=false) {
	for (let MenuIndex = 0; MenuIndex < DialogSelfMenuOptions.length; MenuIndex++) {
		let MenuOption = DialogSelfMenuOptions[MenuIndex];
		if (MenuOption.Name == MenuName) {
			if (force || MenuOption.IsAvailable()) {
				if (MenuOption.Load)
					MenuOption.Load();
				DialogSelfMenuSelected = MenuOption;
				return true;
			}
			return false;
		}
	}
	return false;
}

/**
 * Finds and sets a facial expression group. The expression sub menu has to be already opened.
 * @param {string} ExpressionGroup - The name of the expression group, see XXX.
 * @returns {boolean} True, when the expression group was found and opened. False otherwise and nothing happens.
 */
function DialogFindFacialExpressionMenuGroup(ExpressionGroup) {
	if (DialogSelfMenuSelected.Name != "Expression") return false;
	if (!DialogFacialExpressions || !DialogFacialExpressions.length) DialogFacialExpressionsBuild();
	let I = DialogFacialExpressions.findIndex(expr => expr.Group == ExpressionGroup);
	if (I != -1) {
		DialogFacialExpressionsSelected = I;
		if (DialogExpressionColor != null) ItemColorSaveAndExit();
		return true;
	}
	return false;
}

/**
 * Displays the given text for 5 seconds
 * @param {string} status - The text to be displayed
 * @param {number} timer - the number of milliseconds to display the message for
 * @returns {void} - Nothing
 */
function DialogSetStatus(status, timer = 0) {
	if (timer > 0) {
		DialogTextDefaultTimer = CommonTime() + timer;
		DialogText = status;
	} else {
		// We let the timer for the non-default message expire normally
		DialogTextDefault = status;
	}
}

/**
 * Clears the current status message.
 *
 * @param {boolean} clearDefault Whether to also clear the default status.
 */
function DialogStatusClear(clearDefault = false) {
	if (clearDefault || DialogText === "")
		DialogTextDefault = "";
	DialogTextDefaultTimer = -1;
	DialogText = "";
}

/**
 * Draws the current dialog status
 *
 */
function DialogStatusDraw(C) {
	let status = "";
	if (CommonTime() <= DialogTextDefaultTimer) {
		status = DialogText;
	} else {
		status = DialogTextDefault;
		DialogStatusClear();
	}

	// Only draw status if we can interact
	if (!Player.CanInteract() || InventoryGroupIsBlocked(C)) return;

	if (["extended", "tighten", "color", "struggle", "crafted"].includes(DialogMenuMode)) return;

	DrawTextWrap(status, 1000, 113, 975, 60, "White", null, 1);
}

/**
 * Shows the extended item menu for a given item, if possible.
 * Therefore a dynamic function name is created and then called.
 * @param {Item} Item - The item the extended menu should be shown for
 * @param {Item} [SourceItem] - The source of the extended menu
 * @returns {void} - Nothing
 */
function DialogExtendItem(Item, SourceItem) {
	const C = CharacterGetCurrent();
	if (AsylumGGTSControlItem(C, Item)) return;
	if (InventoryBlockedOrLimited(C, Item)) return;
	DialogChangeMode("extended");
	DialogFocusItem = Item;
	DialogFocusSourceItem = SourceItem;
	CommonDynamicFunction("Inventory" + Item.Asset.Group.Name + Item.Asset.Name + "Load()");
}

/**
 * Shows the tigthen/loosen item menu for a given item, if possible.
 * @param {Item} Item - The item to open the menu for
 * @returns {void} - Nothing
 */
function DialogSetTightenLoosenItem(Item) {
	const C = CharacterGetCurrent();
	if (AsylumGGTSControlItem(C, Item)) return;
	if (InventoryBlockedOrLimited(C, Item)) return;
	DialogChangeMode("tighten");
	DialogTightenLoosenItem = Item;
	TightenLoosenItemLoad();
}

/**
 * Validates that the player is allowed to change the item color and swaps it on the fly
 * @param {Character} C - The player who wants to change the color
 * @param {string} Color - The new color in the format "#rrggbb"
 * @returns {void} - Nothing
 */
function DialogChangeItemColor(C, Color) {

	// Validates that the player isn't blind and can interact with the item
	if (!Player.CanInteract() || Player.IsBlind() || !C.FocusGroup) return;

	// If the item is locked, make sure the player could unlock it before swapping colors
	var Item = InventoryGet(C, C.FocusGroup.Name);
	if (Item == null) return;
	if (InventoryItemHasEffect(Item, "Lock", true) && !DialogCanUnlock(C, Item)) return;

	// Make sure the item is allowed, the group isn't blocked and it's not an enclosing item
	if (!InventoryAllow(C, Item.Asset) || InventoryGroupIsBlocked(C)) return;
	if (InventoryItemHasEffect(Item, "Enclose", true) && (C.ID == 0)) return;

	// Apply the color & redraw the character after 100ms.  Prevent unnecessary redraws to reduce performance impact
	Item.Color = Color;
	clearTimeout(DialogFocusItemColorizationRedrawTimer);
	DialogFocusItemColorizationRedrawTimer = setTimeout(function () { CharacterAppearanceBuildCanvas(C); }, 100);

}

/**
 * Draw the list of activities
 *
 * @param {Character} C - The character currently focused in the dialog.
 * @returns {void} - Nothing
 */
function DialogDrawActivityMenu(C) {

	// Draw a grid with all activities
	CommonGenerateGrid(DialogActivity, DialogInventoryOffset, DialogInventoryGrid, (item, x, y, width, height) => {
		const Act = item.Activity;
		let group = ActivityGetGroupOrMirror(CharacterGetCurrent().AssetFamily, CharacterGetCurrent().FocusGroup.Name);
		let label = ActivityBuildChatTag(CharacterGetCurrent(), group, Act, true);
		let image = "Assets/" + C.AssetFamily + "/Activity/" + Act.Name + ".png";
		/** @type {InventoryIcon[]} */
		let icons = [];
		if (item.Blocked === "limited") {
			icons.push("AllowedLimited");
		}

		if (item.Item) {
			image = `${AssetGetPreviewPath(item.Item.Asset)}/${item.Item.Asset.Name}.png`;
			icons.push("Handheld");
		}

		const colors = {
			"blocked": "red",
			"unavail": "grey",
		};
		const background = colors[item.Blocked] || "white";

		DrawPreviewBox(x, y, image, ActivityDictionaryText(label), { Hover: true, Icons: icons, Background: background, Width: width, Height: height });
		return false;
	});
}

/**
 * Returns the button image name for a dialog menu button based on the button name.
 * @param {string} ButtonName - The menu button name
 * @param {Item} FocusItem - The focused item
 * @returns {string} - The button image name
 */
function DialogGetMenuButtonImage(ButtonName, FocusItem) {
	if (ButtonName === "ColorPick" || ButtonName === "ColorPickDisabled") {
		return ItemColorIsSimple(FocusItem) ? "ColorPick" : "MultiColorPick";
	} else if (DialogIsMenuButtonDisabled(ButtonName)) {
		return ButtonName.replace(DialogButtonDisabledTester, "");
	} else {
		return ButtonName;
	}
}

/**
 * Returns the background color of a dialog menu button based on the button name.
 * @param {string} ButtonName - The menu button name
 * @returns {string} - The background color that the menu button should use
 */
function DialogGetMenuButtonColor(ButtonName) {
	if (DialogIsMenuButtonDisabled(ButtonName)) {
		return "#808080";
	} else if (ButtonName === "ColorPick") {
		return DialogColorSelect || "#fff";
	} else {
		return "#fff";
	}
}

/**
 * Determines whether or not a given dialog menu button should be disabled based on the button name.
 * @param {string} ButtonName - The menu button name
 * @returns {boolean} - TRUE if the menu button should be disabled, FALSE otherwise
 */
function DialogIsMenuButtonDisabled(ButtonName) {
	return DialogButtonDisabledTester.test(ButtonName);
}

/**
 * Draw the item menu dialog
 * @param {Character} C - The character on which the item is used
 * @param {Item} Item - The item that was used
 * @returns {void} - Nothing
 */
function DialogDrawCrafting(C, Item) {
	if ((C == null) || (Item == null) || (Item.Craft == null)) return;
	DrawTextWrap(DialogFind(Player, "CraftedItemProperties"), 1000, 0, 975 - DialogMenuButton.length * 110, 125, "White", null, 3);
	if (Item.Craft.Name != null)
		DrawTextWrap(DialogFind(Player, "CraftingName").replace("CraftName", Item.Craft.Name), 1050, 200, 900, 125, "White", null, 3);
	if ((Item.Craft.MemberName != null) && (Item.Craft.MemberNumber != null))
		DrawTextWrap(DialogFind(Player, "CraftingMember").replace("MemberName", Item.Craft.MemberName).replace("MemberNumber", Item.Craft.MemberNumber.toString()), 1050, 400, 900, 125, "White", null, 3);
	if (Item.Craft.Property != null)
		DrawTextWrap(DialogFind(Player, "CraftingProperty").replace("CraftProperty", Item.Craft.Property), 1050, 600, 900, 125, "White", null, 3);
	if (Item.Craft.Description != null)
		DrawTextWrap(DialogFind(Player, "CraftingDescription").replace("CraftDescription", Item.Craft.Description), 1050, 800, 900, 125, "White", null, 3);
}

/**
 * Draw the list of items
 *
 * @param {Character} C - The character currently focused in the dialog.
 * @returns {void} - Nothing
 */
function DialogDrawItemMenu(C) {
	// Safe-guard against the item list not being set
	if (DialogInventory == null) DialogInventoryBuild(C, 0, DialogMenuMode === "locking");

	CommonGenerateGrid(DialogInventory, DialogInventoryOffset, DialogInventoryGrid, (item, x, y, width, height) => {
		const Hover = MouseIn(x, y, width, height) && !CommonIsMobile;
		const Background = AppearanceGetPreviewImageColor(C, item, Hover);

		DrawItemPreview(item, Player, x, y, { Background, Width: width, Height: height });
		return false;
	});
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it, error otherwise
 * @param {string} KeyWord - The key word to search for
 * @returns {string}
 */
function DialogFindPlayer(KeyWord) {
	const res = PlayerDialog.get(KeyWord);
	return res !== undefined ? res : `MISSING PLAYER DIALOG: ${KeyWord}`;
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it
 * @param {Character} C - The character whose dialog optio*
 * @param {string} KeyWord1 - The key word to search for
 * @param {string} [KeyWord2] - An optionally given second key word. is only looked for, if specified and the first
 * keyword was not found.
 * @param {boolean} [ReturnPrevious=true] - If specified, returns the previous dialog, if neither of the the two key words were found
 ns should be searched
 * @returns {string} - The name of a dialog. That can either be the one with the keyword or the previous dialog.
 * An empty string is returned, if neither keyword was found and no previous dialog was given.
 */
function DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious = true) {
	for (let D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord1)
			return C.Dialog[D].Result.trim();
	if (KeyWord2 != null)
		for (let D = 0; D < C.Dialog.length; D++)
			if (C.Dialog[D].Stage == KeyWord2)
				return C.Dialog[D].Result.trim();
	return ((ReturnPrevious == null) || ReturnPrevious) ? C.CurrentDialog : "";
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it and replace the names
 * @param {Character} C - The character whose dialog options should be searched
 * @param {string} KeyWord1 - The key word to search for
 * @param {string} [KeyWord2] - An optionally given second key word. is only looked for, if specified and the first
 * keyword was not found.
 * @param {boolean} [ReturnPrevious] - If specified, returns the previous dialog, if neither of the the two key words were found
 * @returns {string} - The name of a dialog. That can either be the one with the keyword or the previous dialog.
 * An empty string is returned, if neither keyword was found and no previous dialog was given. 'SourceCharacter'
 * is replaced with the player's name and 'DestinationCharacter' with the current character's name.
 */
function DialogFindAutoReplace(C, KeyWord1, KeyWord2, ReturnPrevious) {
	return DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious)
		.replace("SourceCharacter", CharacterNickname(Player))
		.replace("DestinationCharacter", CharacterNickname(CharacterGetCurrent()));
}

/**
 * Draw the up/down arrow to bump a character up and down if they're hidden.
 */
function DialogDrawRepositionButton() {
	if (!CurrentCharacter.HeightModifier == null || !CurrentCharacter.FocusGroup) return;

	let drawButton = "";
	if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber) {
		drawButton = "Icons/Remove.png";
	} else if (CurrentCharacter.HeightModifier < -90) {
		drawButton = CurrentCharacter.IsInverted() ? "Icons/Down.png" : "Icons/Up.png";
	} else if (CurrentCharacter.HeightModifier > 30) {
		drawButton = CurrentCharacter.IsInverted() ? "Icons/Up.png" : "Icons/Down.png";
	}
	if (drawButton)
		DrawButton(510, 50, 90, 90, "", "White", drawButton, DialogFindPlayer("ShowAllZones"));
}

/**
 * Draws the top menu buttons of the current dialog.
 *
 * @param {Character} C The character currently focused.
 */
function DialogDrawTopMenu(C) {
	const FocusItem = InventoryGet(C, C.FocusGroup.Name);

	// Draw the status message if possible
	DialogStatusDraw(C);

	for (let I = DialogMenuButton.length - 1; I >= 0; I--) {
		const ButtonColor = DialogGetMenuButtonColor(DialogMenuButton[I]);
		const ButtonImage = DialogGetMenuButtonImage(DialogMenuButton[I], FocusItem);
		const ButtonHoverText = (DialogMenuMode !== "color") ? DialogFindPlayer(DialogMenuButton[I]) : null;
		const ButtonDisabled = DialogIsMenuButtonDisabled(DialogMenuButton[I]);
		DrawButton(1885 - I * 110, 15, 90, 90, "", ButtonColor, "Icons/" + ButtonImage + ".png", ButtonHoverText, ButtonDisabled);
	}
}

/**
 * Draws the initial Dialog screen.
 *
 * This is the main handler for drawing the Dialog UI, which activates
 * when the player clicks on herself or another player.
 *
 * @returns {void} - Nothing
 */
function DialogDraw() {
	// Check that there's actually a character selected
	if (!CurrentCharacter) return;
	if (ControllerIsActive()) {
		ControllerClearAreas();
	}

	// Draw both the player and the interaction character
	if (!CurrentCharacter.IsPlayer())
		DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);

	const C = CharacterGetCurrent();
	CharacterCheckHooks(C, true);

	// Draw the menu for facial expressions if the player clicked on herself
	if (CurrentCharacter.IsPlayer()) {
		if (DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1 && !CommonPhotoMode)
			DrawButton(420, 50, 90, 90, "", "White", "Icons/Next.png", DialogFindPlayer("NextPage"));

		if (!DialogSelfMenuSelected)
			DialogDrawExpressionMenu();
		else
			DialogSelfMenuSelected.Draw();
	}

	if (DialogMenuMode === "dialog") {
		// Draws the intro text or dialog result
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT")) {
			DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 840, 165, "white", null, 3);
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 950, 165, "white", null, 3);

		// Draws the possible answers
		let pos = 0;
		for (let D = 0; D < CurrentCharacter.Dialog.length; D++) {
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
				DrawTextWrap(SpeechGarble(Player, CurrentCharacter.Dialog[D].Option), 1025, 160 + 105 * pos, 950, 90, "black", (MouseIn(1025, 160 + pos * 105, 950, 90) && !CommonIsMobile) ? "cyan" : "white", 2);
				pos++;
			}
		}

		// The more time you spend with an NPC, the more the love will rise
		NPCInteraction();
		return;
	}

	// Block out drawing anything else if we're not supposed to interact with the selected character
	if (C.FocusGroup === null || !CurrentCharacter.AllowItem || DialogIntro() === "") return;

	// Reset the status text to the default after 5 seconds
	if (DialogTextDefaultTimer < CommonTime())
		DialogText = DialogTextDefault;

	/** The item currently sitting in the focused group */
	const FocusItem = InventoryGet(C, C.FocusGroup.Name);

	// Draws the top menu text & icons
	if (!["extended", "tighten", "color"].includes(DialogMenuMode))
		DialogDrawTopMenu(C);

	// If the player is struggling or lockpicking
	if (DialogMenuMode === "struggle") {
		if (StruggleMinigameDraw(C)) {
			// Minigame running and drawn
		} else {
			// Draw previews for the assets we're swapping/struggling
			if (DialogStrugglePrevItem && DialogStruggleNextItem) {
				DrawItemPreview(DialogStrugglePrevItem, C, 1200, 150);
				DrawItemPreview(DialogStruggleNextItem, C, 1200, 150);
			} else if (DialogStrugglePrevItem || DialogStruggleNextItem) {
				const item = DialogStrugglePrevItem || DialogStruggleNextItem;
				DrawItemPreview(item, C, 1387, 150);
			}

			// Draw UI to select struggling minigame
			DrawText(DialogFindPlayer("ChooseStruggleMethod"), 1500, 550, "White", "Black");

			for (const [idx, [game, data]] of StruggleGetMinigames().entries()) {
				const offset = 300 * idx;
				const hover = MouseIn(1087 + offset, 600, 225, 275);
				const disabled = data.DisablingCraftedProperty ? InventoryCraftPropertyIs(DialogStrugglePrevItem, data.DisablingCraftedProperty) : false;
				const bgColor = disabled ? "Gray" : (hover ? "aqua" : "white");
				DrawRect(1087 + offset, 600, 225, 275, bgColor);
				DrawImageResize("Icons/Struggle/" + game + ".png", 1089 + offset, 602, 221, 221);
				DrawTextFit(DialogFindPlayer(game), 1200 + offset, 850, 221, "black");
			}
		}
		return;
	}

	if (DialogMenuMode === "extended") {
		if (DialogFocusItem) {
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Draw()");
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
			return;
		} else {
			DialogChangeMode("items");
		}
	} else if (DialogMenuMode === "tighten") {
		if (DialogTightenLoosenItem) {
			TightenLoosenItemDraw();
			return;
		} else {
			DialogChangeMode("items");
		}
	} else if (DialogMenuMode === "color") {
		if (FocusItem) {
			ItemColorDraw(C, C.FocusGroup.Name, 1200, 25, 775, 950, true);
		} else {
			ElementPosition("InputColor", 1450, 65, 300);
			ColorPickerDraw(1300, 145, 675, 830,
				/** @type {HTMLInputElement} */(document.getElementById("InputColor")),
				function (Color) { DialogChangeItemColor(C, Color); });
		}
		return;
	} else if (DialogMenuMode === "crafted") {
		if (FocusItem && FocusItem.Craft) {
			DialogDrawCrafting(C, FocusItem);
			return;
		} else {
			DialogChangeMode("items");
		}
	}

	// Draw a repositioning button if some zones are offscreen
	DialogDrawRepositionButton();

	if (DialogMenuMode === "activities") {
		// Draw the list of activities available
		DialogDrawActivityMenu(C);
	} else if (DialogMenuMode === "permissions") {
		if (C.IsPlayer())
			DialogDrawItemMenu(C);
	} else if (DialogMenuMode === "locking") {
		DialogDrawItemMenu(C);
	} else {
		if (!["items", "locked"].includes(DialogMenuMode)) {
			console.warn("Unexpected mode in final fall-through");
		}

		if (InventoryGroupIsBlockedByOwnerRule(C))
			DialogDrawItemMessage(C, DialogFindPlayer("ZoneBlockedOwner"), FocusItem);
		else if (InventoryGroupIsBlocked(C))
			DialogDrawItemMessage(C, DialogFindPlayer("ZoneBlocked"), FocusItem);
		else if (!Player.CanInteract())
			DialogDrawItemMessage(C, DialogFindPlayer("AccessBlocked"), FocusItem);
		else if (DialogInventory.length === 0)
			DialogDrawItemMessage(C, DialogFindPlayer("NoItems"), FocusItem);
		else
			DialogDrawItemMenu(C);
	}
}

/**
 * Draw a single line of text with an optional item preview icon.
 *
 * This function is used when the character's group is somehow unavailable.
 *
 * @param {Character} C - The character currently being interacted with
 * @param {Item} [item] - The (optional) item in the currently selected group
 * @param {string} msg - The explanation message to draw
 */
function DialogDrawItemMessage(C, msg, item) {
	if (item !== null && !C.CanInteract()) {
		DrawItemPreview(item, C, 1387, 250);
	}
	DrawText(msg, 1500, 700, "White", "Black");
}

/**
 * Draw the menu for changing facial expressions
 * @returns {void} - Nothing
 */
function DialogDrawExpressionMenu() {

	// Draw the expression groups
	DrawText(DialogFindPlayer("FacialExpression"), 165, 25, "White", "Black");
	if (typeof DialogFacialExpressionsSelected === 'number' && DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length && DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.AllowColorize && DialogFacialExpressions[DialogFacialExpressionsSelected].Group !== "Eyes") {
		DrawButton(320, 50, 90, 90, "", "White", "Icons/ColorPick.png", DialogFindPlayer("ColorChange"));
	}
	DrawButton(220, 50, 90, 90, "", "White", "Icons/BlindToggle" + DialogFacialExpressionsSelectedBlindnessLevel + ".png", DialogFindPlayer("BlindToggleFacialExpressions"));
	const Expression = WardrobeGetExpression(Player);
	const Eye1Closed = Expression.Eyes === "Closed";
	const Eye2Closed = Expression.Eyes2 === "Closed";
	let WinkIcon = "WinkNone";
	if (Eye1Closed && Eye2Closed) WinkIcon = "WinkBoth";
	else if (Eye1Closed) WinkIcon = "WinkR";
	else if (Eye2Closed) WinkIcon = "WinkL";
	DrawButton(120, 50, 90, 90, "", "White", `Icons/${WinkIcon}.png`, DialogFindPlayer("WinkFacialExpressions"));
	DrawButton(20, 50, 90, 90, "", "White", "Icons/Reset.png", DialogFindPlayer("ClearFacialExpressions"));
	if (!DialogFacialExpressions || !DialogFacialExpressions.length) DialogFacialExpressionsBuild();

	DialogFacialExpressions.forEach((FE, i) => {
		const OffsetY = 185 + 100 * i;
		DrawButton(20, OffsetY, 90, 90, "", i == DialogFacialExpressionsSelected ? "Cyan" : "White", "Assets/Female3DCG/" + FE.Group + (FE.CurrentExpression ? "/" + FE.CurrentExpression : "") + "/Icon.png");

		// Draw the table with expressions
		if (i == DialogFacialExpressionsSelected) {
			const nPages = Math.ceil(FE.ExpressionList.length / DialogFacialExpressionsPerPage);
			DrawButton(155, 785, 90, 90, "", nPages > 1 ? "White" : "Gray", `Icons/Prev.png`, DialogFindPlayer("PrevExpressions"), nPages <= 1);
			DrawButton(255, 785, 90, 90, "", nPages > 1 ? "White" : "Gray", `Icons/Next.png`, DialogFindPlayer("NextExpressions"), nPages <= 1);
			const expressionSubset = FE.ExpressionList.slice(
				DialogFacialExpressionsSelectedPage * DialogFacialExpressionsPerPage,
				DialogFacialExpressionsSelectedPage * DialogFacialExpressionsPerPage + DialogFacialExpressionsPerPage,
			);
			expressionSubset.forEach((expression, j) => {
				const EOffsetX = 155 + 100 * (j % 3);
				const EOffsetY = 185 + 100 * Math.floor(j / 3);
				DrawButton(EOffsetX, EOffsetY, 90, 90, "", (expression == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Group + (expression ? "/" + expression : "") + "/Icon.png");
			});
		}
	});
}

/**
 * Return the page number of the expression item's current expression.
 * @param {ExpressionItem} item - The expression item
 * @returns {number} The page number of the item's current expression
 */
function DialogGetCurrentExpressionPage(item) {
	const index = item.ExpressionList.findIndex(name => item.CurrentExpression === name);
	return index === -1 ? 0 : Math.floor(index / DialogFacialExpressionsPerPage);
}

/**
 * Handles clicks in the dialog expression menu.
 * @returns {void} - Nothing
 */
function DialogClickExpressionMenu() {
	if (MouseIn(20, 50, 90, 90)) {
		DialogFacialExpressions.forEach(FE => {
			let Color = null;
			if (FE.Appearance.Asset.Group.AllowColorize && FE.Group !== "Eyes" && FE.Group !== "Mouth") Color = "Default";
			CharacterSetFacialExpression(Player, FE.Group, null, null, Color);
			FE.CurrentExpression = null;
		});
		if (DialogExpressionColor != null) ItemColorSaveAndExit();
	} else if (MouseIn(120, 50, 90, 90)) {
		const CurrentExpression = DialogFacialExpressions.find(FE => FE.Group == "Eyes").CurrentExpression;
		const EyesExpression = WardrobeGetExpression(Player);
		const LeftEyeClosed = EyesExpression.Eyes2 === "Closed";
		const RightEyeClosed = EyesExpression.Eyes === "Closed";
		if (!LeftEyeClosed && !RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes2", "Closed", null);
		else if (LeftEyeClosed && !RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes", "Closed", null);
		else if (LeftEyeClosed && RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes2", CurrentExpression !== "Closed" ? CurrentExpression : null, null);
		else CharacterSetFacialExpression(Player, "Eyes", CurrentExpression !== "Closed" ? CurrentExpression : null, null);
	} else if (MouseIn(220, 50, 90, 90)) {
		DialogFacialExpressionsSelectedBlindnessLevel += 1;
		if (DialogFacialExpressionsSelectedBlindnessLevel > 3)
			DialogFacialExpressionsSelectedBlindnessLevel = 1;
	} else if (MouseIn(320, 50, 90, 90)) {
		if (typeof DialogFacialExpressionsSelected === 'number' && DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length && DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.AllowColorize && DialogFacialExpressions[DialogFacialExpressionsSelected].Group !== "Eyes") {
			const GroupName = DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.Name;
			const Item = InventoryGet(Player, GroupName);
			const originalColor = Item.Color;
			Player.FocusGroup = /** @type {AssetItemGroup} */ (AssetGroupGet(Player.AssetFamily, GroupName));
			DialogChangeMode("color");
			DialogExpressionColor = "";
			ItemColorLoad(Player, Item, 1200, 25, 775, 950, true);
			ItemColorOnExit((save) => {
				DialogChangeMode("items");
				DialogExpressionColor = null;
				Player.FocusGroup = null;
				if (save && !CommonColorsEqual(originalColor, Item.Color)) {
					ServerPlayerAppearanceSync();
					ChatRoomCharacterItemUpdate(Player, GroupName);
				}
			});
		}
	} else {
		// Expression category buttons
		for (let I = 0; I < DialogFacialExpressions.length; I++) {
			if (MouseIn(20, 185 + 100 * I, 90, 90)) {
				if (DialogFacialExpressionsSelected !== I) {
					DialogFacialExpressionsSelected = I;
					DialogFacialExpressionsSelectedPage = DialogGetCurrentExpressionPage(DialogFacialExpressions[I]);
				}
				if (DialogExpressionColor != null) ItemColorSaveAndExit();
			}
		}

		// Expression table
		if (DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length) {
			const FE = DialogFacialExpressions[DialogFacialExpressionsSelected];

			// Switch pages
			const nPages = Math.ceil(FE.ExpressionList.length / DialogFacialExpressionsPerPage);
			if (MouseIn(155, 785, 90, 90) && nPages > 1) {
				DialogFacialExpressionsSelectedPage = (DialogFacialExpressionsSelectedPage + nPages - 1) % nPages;
				return;
			} else if (MouseIn(255, 785, 90, 90) && nPages > 1) {
				DialogFacialExpressionsSelectedPage = (DialogFacialExpressionsSelectedPage + 1) % nPages;
				return;
			}

			const expressionSubset = FE.ExpressionList.slice(
				DialogFacialExpressionsSelectedPage * DialogFacialExpressionsPerPage,
				DialogFacialExpressionsSelectedPage * DialogFacialExpressionsPerPage + DialogFacialExpressionsPerPage,
			);
			expressionSubset.forEach((expression, j) => {
				const EOffsetX = 155 + 100 * (j % 3);
				const EOffsetY = 185 + 100 * Math.floor(j / 3);
				if (MouseIn(EOffsetX, EOffsetY, 90, 90)) {
					CharacterSetFacialExpression(Player, FE.Group, expression);
					FE.CurrentExpression = expression;
				}
			});
		}
	}
}

/**
 * Draws the pose sub menu
 * @returns {void} - Nothing
 */
function DialogDrawPoseMenu() {
	// Draw the pose groups
	DrawText(DialogFindPlayer("PoseMenu"), 250, 100, "White", "Black");

	for (let I = 0; I < DialogActivePoses.length; I++) {
		var OffsetX = 140 + 140 * I;
		var PoseGroup = DialogActivePoses[I];

		for (let P = 0; P < PoseGroup.length; P++) {
			var OffsetY = 180 + 100 * P;
			var IsActive = false;

			if (typeof Player.ActivePose == "string" && Player.ActivePose == PoseGroup[P].Name)
				IsActive = true;
			else if (Array.isArray(Player.ActivePose)) {
				if (Player.ActivePose.includes(PoseGroup[P].Name))
					IsActive = true;
				else if (PoseGroup[P].Name == "BaseUpper" && !Player.ActivePose.map(Pose => PoseFemale3DCG.find(PP => PP.Name == Pose)).filter(Pose => Pose).find(Pose => Pose.Category == "BodyUpper" || Pose.Category == "BodyFull"))
					IsActive = true;
				else if (PoseGroup[P].Name == "BaseLower" && !Player.ActivePose.map(Pose => PoseFemale3DCG.find(PP => PP.Name == Pose)).filter(Pose => Pose).find(Pose => Pose.Category == "BodyLower" || Pose.Category == "BodyFull"))
					IsActive = true;
			}
			else if ((PoseGroup[P].Name == "BaseUpper" || PoseGroup[P].Name == "BaseLower") && Player.ActivePose == null)
				IsActive = true;
			DrawButton(OffsetX, OffsetY, 90, 90, "", !Player.CanChangeToPose(PoseGroup[P].Name) ? "#888" : IsActive ? "Pink" : "White", "Icons/Poses/" + PoseGroup[P].Name + ".png");
		}
	}
}

/**
 * Handles clicks in the pose sub menu
 * @returns {void} - Nothing
 */
function DialogClickPoseMenu() {
	for (let I = 0; I < DialogActivePoses.length; I++) {
		var OffsetX = 140 + 140 * I;
		var PoseGroup = DialogActivePoses[I];
		for (let P = 0; P < PoseGroup.length; P++) {
			var OffsetY = 180 + 100 * P;
			var IsActive = false;

			if (typeof Player.ActivePose == "string" && Player.ActivePose == PoseGroup[P].Name)
				IsActive = true;
			if (Array.isArray(Player.ActivePose) && Player.ActivePose.includes(PoseGroup[P].Name))
				IsActive = true;

			if (MouseIn(OffsetX, OffsetY, 90, 90) && !IsActive && Player.CanChangeToPose(PoseGroup[P].Name)) {
				if (ChatRoomOwnerPresenceRule("BlockChangePose", Player)) {
					DialogLeave();
					return;
				}
				CharacterSetActivePose(Player, PoseGroup[P].Name);
				if (CurrentScreen == "ChatRoom") ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
			}
		}
	}
}


/**
 * Sets the current character sub menu to the owner rules
 * @returns {void} - Nothing
 */
function DialogViewOwnerRules() {
	DialogFindSubMenu("OwnerRules", true);
}

/**
 * Draws the rules sub menu
 * @returns {void} - Nothing
 */
function DialogDrawOwnerRulesMenu() {
	// Draw the pose groups
	DrawText(DialogFindPlayer("RulesMenu"), 230, 100, "White", "Black");

	/** @type {{Tag: string, Value?: number}[]} */
	const ToDisplay = [];

	if (LogQuery("BlockOwnerLockSelf", "OwnerRule")) ToDisplay.push({ Tag: "BlockOwnerLockSelf" });
	if (LogQuery("BlockChange", "OwnerRule")) ToDisplay.push({ Tag: "BlockChange", Value: LogValue("BlockChange", "OwnerRule") });
	if (LogQuery("BlockWhisper", "OwnerRule")) ToDisplay.push({ Tag: "BlockWhisper" });
	if (LogQuery("BlockKey", "OwnerRule")) ToDisplay.push({ Tag: "BlockKey" });
	if (LogQuery("BlockFamilyKey", "OwnerRule")) ToDisplay.push({ Tag: "BlockFamilyKey" });
	if (LogQuery("BlockRemote", "OwnerRule")) ToDisplay.push({ Tag: "BlockRemote" });
	if (LogQuery("BlockRemoteSelf", "OwnerRule")) ToDisplay.push({ Tag: "BlockRemoteSelf" });
	if (LogQuery("ReleasedCollar", "OwnerRule")) ToDisplay.push({ Tag: "ReleasedCollar" });
	if (LogQuery("BlockNickname", "OwnerRule")) ToDisplay.push({ Tag: "BlockNickname" });
	if (LogQuery("BlockLoverLockSelf", "LoverRule")) ToDisplay.push({ Tag: "BlockLoverLockSelf" });
	if (LogQuery("BlockLoverLockOwner", "LoverRule")) ToDisplay.push({ Tag: "BlockLoverLockOwner" });
	if (ToDisplay.length == 0) ToDisplay.push({ Tag: "Empty" });

	for (const [i, { Tag, Value }] of ToDisplay.entries()) {
		const Y = 180 + 110 * i;
		const TextToDraw = DialogFindPlayer(`RulesMenu${Tag}`) + (Value ? ` ${TimerToString(Value - CurrentTime)}` : "");
		DrawTextWrap(TextToDraw, 25, Y, 485, 95, "#fff", undefined, 2);
	}
}

/**
 * Sets the skill ratio for the player, will be a % of effectiveness applied to the skill when using it.
 * This way a player can use only a part of her bondage or evasion skill.
 * @param {SkillType} SkillType - The name of the skill to influence
 * @param {string} NewRatio - The ration of this skill that should be used
 * @returns {void} - Nothing
 */
function DialogSetSkillRatio(SkillType, NewRatio) {
	SkillSetRatio(SkillType, parseInt(NewRatio) / 100);
}

/**
 * Sends an room administrative command to the server for the chat room from the player dialog
 * @param {string} ActionType - The name of the administrative command to use
 * @param {string} Publish - Determines whether the action should be published to the ChatRoom. As this is a string, use "true" to do so
 * @returns {void} - Nothing
 */
function DialogChatRoomAdminAction(ActionType, Publish) {
	ChatRoomAdminAction(ActionType, Publish);
}

/**
 * Leave the dialog and revert back to a safe state, when the player uses her safe word
 * @returns {void} - Nothing
 */
function DialogChatRoomSafewordRevert() {
	DialogLeave();
	ChatRoomSafewordRevert();
}

/**
 * Leave the dialog and release the player of all restraints before returning them to the Main Lobby
 * @returns {void} - Nothing
 */
function DialogChatRoomSafewordRelease() {
	DialogLeave();
	ChatRoomSafewordRelease();
}

/**
 * Close the dialog and switch to the crafting screen.
 * @returns {void} - Nothing
 */
function DialogOpenCraftingScreen() {
	const FromChatRoom = (CurrentScreen === "ChatRoom");
	DialogLeave();
	CraftingShowScreen(FromChatRoom);
}

/**
 * Check whether it's possible to access the crafting interface.
 * @returns {boolean}
 */
function DialogCanCraft() {
	if ((CurrentModule != "Online") || (CurrentScreen != "ChatRoom")) return false;
	return !Player.IsRestrained() || !Player.IsBlind();
}

/**
 * Provides a group's real name for male characters
 *
 * @param {Character} C
 * @param {AssetGroup} G
 */
function DialogActualNameForGroup(C, G) {
	let repl = G.Description;
	if (C && C.HasPenis() && ["ItemVulva", "ItemVulvaPiercings"].includes(G.Name)) {
		repl = G.Name === "ItemVulva" ? DialogFindPlayer("ItemPenis") : DialogFindPlayer("ItemGlans");
	}
	return repl;
}

/**
 * Propose one of the struggle minigames or start one automatically.
 *
 * This function checks the difficulty of the current struggle attempt and
 * either use the Strength minigame by default or setup the menu state to show
 * the selection screen.
 *
 * @param {Character} C
 * @param {DialogStruggleActionType} Action
 * @param {Item} PrevItem
 * @param {Item} NextItem
 */
function DialogStruggleStart(C, Action, PrevItem, NextItem) {
	ChatRoomStatusUpdate("Struggle");

	// If it's not the player struggling, or we're applying a new item, or the
	// existing item is locked with a key the character has, or the player can
	// interact with it and it's not a mountable item, or the item's difficulty
	// is low enough to progress by itself, we're currently trying to swap items
	// on someone.
	const autoStruggle = (C != Player || PrevItem == null || ((PrevItem != null)
		&& (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem))
		&& ((Player.CanInteract() && !InventoryItemHasEffect(PrevItem, "Mounted", true))
			|| StruggleStrengthGetDifficulty(C, PrevItem, NextItem).auto >= 0)));
	if (autoStruggle) {
		DialogStruggleAction = Action;
		DialogStruggleSelectMinigame = false;
		StruggleMinigameStart(C, "Strength", PrevItem, NextItem, DialogStruggleStop);
	} else {
		DialogStruggleAction = Action;
		DialogStrugglePrevItem = PrevItem;
		DialogStruggleNextItem = NextItem;
		DialogStruggleSelectMinigame = true;
	}
	DialogChangeMode("struggle");
	// Refresh menu buttons
	DialogMenuButtonBuild(C);

}

/**
 * Handle the struggle minigame completing, either as a failure, an interruption, or a success.
 *
 * @type {StruggleCompletionCallback}
 */
function DialogStruggleStop(C, Game, { Progress, PrevItem, NextItem, Skill, Attempts, Interrupted, Auto }) {
	const Success = Progress >= 100;
	if (Interrupted) {
		// Handle the minigame having been interrupted by showing a message in chat
		let action;
		if (PrevItem != null && NextItem != null && !NextItem.Asset.IsLock)
			action = "ActionInterruptedSwap";
		else if (StruggleProgressNextItem != null)
			action = "ActionInterruptedAdd";
		else
			action = "ActionInterruptedRemove";

		ChatRoomPublishAction(C, action, PrevItem, NextItem);

		DialogLeave();
		return;
	} else if (Game === "LockPick") {
		if (Success) {
			if (C.FocusGroup && C) {
				const item = InventoryGet(C, C.FocusGroup.Name);
				if (item) {
					InventoryUnlock(C, item);
					ChatRoomPublishAction(C, "ActionPick", item, null);
				}
			}
			SkillProgress("LockPicking", Skill);
		}

		// For an NPC we move out to their reaction, for other characters we return to the item list
		if (C.IsNpc()) {
			DialogLeaveItemMenu();
		} else {
			DialogChangeMode("items");
		}
		return;
	} else if (Game === "Dexterity" || Game === "Flexibility" || Game === "Strength") {

		if (!Success) {
			// Send a stimulation event for that
			if (Attempts >= 10 && !Auto && Progress >= 0 && Progress < 100) {
				ChatRoomStimulationMessage("StruggleFail");
			}
			return;
		}

		// Removes the item & associated items if needed, then wears the new one
		InventoryRemove(C, C.FocusGroup.Name);
		if (NextItem != null) {
			let Color = (DialogColorSelect == null) ? "Default" : DialogColorSelect;
			if ((NextItem.Craft != null) && CommonIsColor(NextItem.Craft.Color))
				Color = NextItem.Craft.Color;

			const isCraft = (NextItem.Craft != null);
			InventoryWear(C, NextItem.Asset.Name, NextItem.Asset.Group.Name, Color, SkillGetWithRatio("Bondage"), Player.MemberNumber, NextItem.Craft, !isCraft);
			if (isCraft) {
				InventoryCraft(Player, C, /** @type {AssetGroupItemName} */(NextItem.Asset.Group.Name), NextItem.Craft, true);
			}

			// Refresh the item by getting it back
			NextItem = InventoryGet(C, NextItem.Asset.Group.Name);
		}

		// Handle skills
		if (C.IsPlayer()) {
			if (NextItem === null) {
				// We successfully removed one of our items
				SkillProgress("Evasion", Skill);
			} else if (PrevItem === null) {
				// We successfully added an item
				SkillProgress("SelfBondage", Skill);
			}
		} else if (NextItem !== null) {
			// We successfully added an item on someone
			SkillProgress("Bondage", Skill);
		}

		// Reset the the character's position
		if (CharacterAppearanceForceUpCharacter == C.MemberNumber) {
			CharacterAppearanceForceUpCharacter = -1;
			CharacterRefresh(C, false);
		}

		// Update the dialog state
		if (C.IsNpc()) {
			// For NPCs, we need to show their reaction and never leave the dialog abruptly
			C.CurrentDialog = DialogFind(C, (NextItem == null ? "Remove" + PrevItem.Asset.Name : NextItem.Asset.Name), (NextItem == null ? "Remove" : "") + C.FocusGroup.Name);
			DialogLeaveItemMenu();
		} else if (NextItem === null) {
			// Removing an item, we move back to the menu
			ChatRoomPublishAction(C, DialogStruggleAction, PrevItem, NextItem);
			DialogChangeMode("items");
		} else if (
			NextItem !== null
			&& NextItem.Asset.Extended
			&& (NextItem.Craft == null || (NextItem.Craft && NextItem.Craft.Type == null))
		) {
			// Applying an extended, non-crafted/typeless crafted item, refresh the inventory and open the extended UI
			ChatRoomPublishAction(C, DialogStruggleAction, PrevItem, NextItem);
			DialogExtendItem(NextItem);
		} else {
			// Applying a non-extended or crafted-with-preset-type item, just exit the dialog altogether
			ChatRoomPublishAction(C, DialogStruggleAction, PrevItem, NextItem);
			DialogEndExpression();
			DialogLeave();
		}
	}
}
