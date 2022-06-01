"use strict";
var LoginBackground = "Dressing";
var LoginMessage = "";
var LoginCredits = null;
var LoginCreditsPosition = 0;
var LoginThankYou = "";
/* eslint-disable */
var LoginThankYouList = [
	"Aceffect14", "Anna", "ArashiSama", "Aylea", "Bjugh", "BlueWinter", "Brian", "Bryce", 
	"Christian", "Clash", "DarkStar", "Desch", "Dini", "Edwin", "Epona", "Escurse", "Greendragon", 
	"Hayden", "JoeyDubDee", "Kimuriel", "Michal", "Michel", "Mike", "Mike", "Mindtie", 
	"Misa", "Mob", "MrUniver", "Nick", "Nightcore", "Rika", "Riley", "Samuel", "Shadow", "SirRobben", 
	"Tam", "Tarram", "Tommy", "TopHat", "Troubadix", "Xepherio", "Ying", "Yuna", "Znarf"
];

/* eslint-enable */
var LoginThankYouNext = 0;
var LoginSubmitted = false;
var LoginIsRelog = false;
var LoginErrorMessage = "";
var LoginCharacter = null;
let LoginTextCacheUnsubscribeCallback;

/* DEBUG: To measure FPS - uncomment this and change the + 4000 to + 40
var LoginLastCT = 0;
var LoginFrameCount = 0;
var LoginFrameTotalTime = 0;*/

/**
 * Loads the next thank you bubble
 * @returns {void} Nothing
 */
function LoginDoNextThankYou() {
	LoginThankYou = CommonRandomItemFromList(LoginThankYou, LoginThankYouList);
	CharacterRelease(LoginCharacter, false);
	CharacterAppearanceFullRandom(LoginCharacter);
	if (InventoryGet(LoginCharacter, "ItemNeck") != null) InventoryRemove(LoginCharacter, "ItemNeck", false);
	CharacterFullRandomRestrain(LoginCharacter);
	LoginThankYouNext = CommonTime() + 4000;
}

/**
 * Draw the credits
 * @returns {void} Nothing
 */
function LoginDrawCredits() {

	/* DEBUG: To measure FPS - uncomment this and change the + 4000 to + 40
	var CT = CommonTime();
	if (CT - LoginLastCT < 10000) {
		LoginFrameCount++;
		if (LoginFrameCount > 1000)
			LoginFrameTotalTime = LoginFrameTotalTime + CT - LoginLastCT;
	}
	LoginLastCT = CT;
	if (LoginFrameCount > 1000) DrawText("Average FPS: " + (1000 / (LoginFrameTotalTime / (LoginFrameCount - 1000))).toFixed(2).toString(), 1000, 975, "white");
	else DrawText("Calculating Average FPS...", 1000, 975, "white");*/

	// For each credits in the list
	LoginCreditsPosition += (TimerRunInterval * 60) / 1000;
	if (LoginCreditsPosition > LoginCredits.length * 25 || LoginCreditsPosition < 0) LoginCreditsPosition = 0;
	MainCanvas.font = "30px Arial";
	for (let C = 0; C < LoginCredits.length; C++) {

		// Sets the Y position (it scrolls from bottom to top)
		var Y = 800 - Math.floor(LoginCreditsPosition * 2) + (C * 50);

		// Draw the text if it's in drawing range
		if ((Y > 0) && (Y <= 999)) {

			// The "CreditTypeRepeat" starts scrolling again, other credit types are translated
			var Cred = LoginCredits[C][0].trim();
			if (Cred == "CreditTypeRepeat") {
				LoginCreditsPosition = 0;
				return;
			} else {
				if (Cred.substr(0, 10) == "CreditType") DrawText(TextGet(Cred), 320, Y, "white");
				else {
					if (Cred.indexOf("|") == -1) DrawText(Cred, 320, Y, "white");
					else {
						DrawText(Cred.substring(0, Cred.indexOf("|")), 180, Y, "white");
						DrawText(Cred.substring(Cred.indexOf("|") + 1, 1000), 460, Y, "white");
					}
				}
			}

		}

	}

	// Restore the canvas font
	MainCanvas.font = CommonGetFont(36);

}

/**
 * Loads the character login screen
 * @returns {void} Nothing
 */
function LoginLoad() {

	// Resets the player and other characters
	Character = [];
	CharacterNextId = 1;
	CharacterReset(0, "Female3DCG");
	CharacterLoadCSVDialog(Player);
	LoginCharacter = CharacterLoadNPC("NPC_Login");
	LoginDoNextThankYou();
	LoginStatusReset();
	LoginErrorMessage = "";
	if (LoginCredits == null) CommonReadCSV("LoginCredits", CurrentModule, CurrentScreen, "GameCredits");
	ActivityDictionaryLoad();
	OnlneGameDictionaryLoad();
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputPassword", "password", "", "20");
	TextPrefetch("Room", "Mainhall");
	LoginTextCacheUnsubscribeCallback = TextScreenCache.onRebuild(LoginUpdateMessage);

}

/**
 * Runs the character login screen
 * @returns {void} Nothing
 */
function LoginRun() {

	// Draw the credits
	if (LoginCredits != null) LoginDrawCredits();

	const CanLogin = ServerIsConnected && !LoginSubmitted;

	// Draw the login controls
	DrawText(TextGet("Welcome"), 1000, 50, "White", "Black");
	DrawText(LoginMessage, 1000, 100, "White", "Black");
	DrawText(TextGet("AccountName"), 1000, 200, "White", "Black");
	ElementPosition("InputName", 1000, 260, 500);
	DrawText(TextGet("Password"), 1000, 350, "White", "Black");
	ElementPosition("InputPassword", 1000, 410, 500);
	DrawButton(775, 500, 200, 60, TextGet("Login"), CanLogin ? "White" : "Grey", "");
	DrawButton(1025, 500, 200, 60, TextGet("Language"), "White", "");
	DrawText(TextGet("CreateNewCharacter"), 1000, 670, "White", "Black");
	DrawButton(825, 740, 350, 60, TextGet("NewCharacter"), CanLogin ? "White" : "Grey", "");
	DrawButton(825, 870, 350, 60, TextGet(CheatAllow ? "Cheats" : "PasswordReset"), CheatAllow || CanLogin ? "White" : "Grey", "");

	// Draw the character and thank you bubble
	DrawCharacter(LoginCharacter, 1400, 100, 0.9);
	if (LoginThankYouNext < CommonTime()) LoginDoNextThankYou();
	DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1400, 16);
	DrawText(TextGet("ThankYou") + " " + LoginThankYou, 1625, 53, "Black", "Gray");

}

/**
 * The list of item fixups to apply on login.
 *
 * @type {{ Old: {Group: string, Name: string}, New: {Group: string, Name: string} }[]}
 */
let LoginInventoryFixups = [
	{ Old: { Group: "ItemLegs", Name: "WoodenHorse" }, New: { Group: "ItemDevices", Name: "WoodenHorse" } },
];

/**
 * Perform the inventory and appearance fixups needed.
 *
 * This is called by the login code, after the player's item lists are set up
 * but before the inventory and appearance are loaded from the server's data,
 * and applies the specified asset fixups by swapping Old with New in the list
 * of owned items, in the various player item lists, and in the appearance.
 *
 * Note that it copies properties verbatim, so its better if the Old and New
 * asset definitions are kept compatible.
 *
 * @param {Record<string, string[]>} Inventory - The server-provided inventory object
 * @param {{Group: string, Name: string}[]} Appearance - The server-provided appearance object
 */
function LoginPerformInventoryFixups(Inventory, Appearance) {
	// Skip fixups on new characters
	if (!Inventory || !Appearance) return;

	let listsUpdated = false;
	LoginInventoryFixups.forEach(fixup => {
		// For every asset fixup to do, update the inventory
		let group;
		let idx;
		if ((group = Inventory[fixup.Old.Group]) && group.indexOf(fixup.Old.Name) != -1) {
			group.splice(idx, 1);
			Inventory[fixup.New.Group].push(fixup.New.Name);
		}

		// Update the player's item lists
		["BlockItems", "LimitedItems", "HiddenItems", "FavoriteItems"].forEach(prop => {
			const idx = Player[prop].findIndex(item => item.Group === fixup.Old.Group && item.Name === fixup.Old.Name);
			if (idx === -1) return;

			Player[prop][idx].Group = fixup.New.Group;
			Player[prop][idx].Name = fixup.New.Name;
			listsUpdated = true;
		});

		idx = Appearance.findIndex(a => a.Group === fixup.Old.Group && a.Name === fixup.Old.Name);
		if (idx != -1) {
			// The item is currently worn, remove it
			let worn = Appearance[idx];
			Appearance.splice(idx, 1);
			// Add the new one, unless there's already something there
			if (!Appearance.find(a => a.Group === fixup.New.Group)) {
				worn.Group = fixup.New.Group;
				worn.Name = fixup.New.Name;
				Appearance.push(worn);
			}
		}
	});
	if (listsUpdated)
		ServerPlayerBlockItemsSync();
}

/**
 * Make sure the slave collar is equipped or unequipped based on the owner
 * @returns {void} Nothing
 */
function LoginValidCollar() {
	if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar") && (Player.Owner == "" || LogQuery("ReleasedCollar", "OwnerRule"))) {
		InventoryRemove(Player, "ItemNeck");
		if (CurrentScreen == "ChatRoom") {
			ChatRoomCharacterItemUpdate(Player, "ItemNeck");
			ChatRoomCharacterItemUpdate(Player, "ItemNeckAccessories");
			ChatRoomCharacterItemUpdate(Player, "ItemNeckRestraints");
		}
	}
	if (!LogQuery("ReleasedCollar", "OwnerRule")) {
		if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name != "SlaveCollar") && (InventoryGet(Player, "ItemNeck").Asset.Name != "ClubSlaveCollar") && (Player.Owner != "")) {
			InventoryRemove(Player, "ItemNeck");
			if (CurrentScreen == "ChatRoom") ChatRoomCharacterItemUpdate(Player, "ItemNeck");
		}
		if ((InventoryGet(Player, "ItemNeck") == null) && (Player.Owner != "")) {
			InventoryWear(Player, "SlaveCollar", "ItemNeck");
			if (CurrentScreen == "ChatRoom") ChatRoomCharacterItemUpdate(Player, "ItemNeck");
		}
	}
	if (LogQuery("ClubSlave", "Management") && !InventoryIsWorn(Player, "ItemNeck", "ClubSlaveCollar"))
		InventoryWear(Player, "ClubSlaveCollar", "ItemNeck");
}

/**
 * Adds or confiscates Club Mistress items from the player. Only players that are club Mistresses can have the Mistress
 * Padlock & Key
 * @returns {void} Nothing
 */
function LoginMistressItems() {
	if (LogQuery("ClubMistress", "Management")) {
		InventoryAdd(Player, "MistressGloves", "Gloves", false);
		InventoryAdd(Player, "MistressBoots", "Shoes", false);
		InventoryAdd(Player, "MistressTop", "Cloth", false);
		InventoryAdd(Player, "MistressBottom", "ClothLower", false);
		InventoryAdd(Player, "MistressPadlock", "ItemMisc", false);
		InventoryAdd(Player, "MistressPadlockKey", "ItemMisc", false);
		InventoryAdd(Player, "MistressTimerPadlock", "ItemMisc", false);
		InventoryAdd(Player, "DeluxeBoots", "Shoes", false);
	} else {
		InventoryDelete(Player, "MistressPadlock", "ItemMisc", false);
		InventoryDelete(Player, "MistressPadlockKey", "ItemMisc", false);
		InventoryDelete(Player, "MistressTimerPadlock", "ItemMisc", false);
		InventoryDelete(Player, "MistressGloves", "Gloves", false);
		InventoryDelete(Player, "MistressBoots", "Shoes", false);
		InventoryDelete(Player, "MistressTop", "Cloth", false);
		InventoryDelete(Player, "MistressBottom", "ClothLower", false);
		InventoryDelete(Player, "DeluxeBoots", "Shoes", false);
	}
}

/**
 * Adds or confiscates pony equipment from the player. Only players that are ponies or trainers can have the pony
 * equipment.
 * @returns {void} Nothing
 */
function LoginStableItems() {
	if (LogQuery("JoinedStable", "PonyExam") || LogQuery("JoinedStable", "TrainerExam")) {
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth", false);
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth2", false);
		InventoryAdd(Player, "HarnessPonyBits", "ItemMouth3", false);
		InventoryAdd(Player, "PonyBoots", "Shoes", false);
		InventoryAdd(Player, "PonyBoots", "ItemBoots", false);
		InventoryAdd(Player, "PonyHood", "ItemHood", false);
		InventoryAdd(Player, "HoofMittens", "ItemHands", false);
	} else {
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth", false);
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth2", false);
		InventoryDelete(Player, "HarnessPonyBits", "ItemMouth3", false);
		InventoryDelete(Player, "PonyBoots", "Shoes", false);
		InventoryDelete(Player, "PonyBoots", "ItemBoots", false);
		InventoryDelete(Player, "PonyHood", "ItemHood", false);
		InventoryDelete(Player, "HoofMittens", "ItemHands", false);
	}
}

/**
 * Adds or confiscates maid items from the player. Only players that have joined the Maid Sorority can have these items.
 * @returns {void} - Nothing
 */
function LoginMaidItems() {
	if (LogQuery("JoinedSorority", "Maid")) {
		InventoryAdd(Player, "MaidOutfit1", "Cloth", false);
		InventoryAdd(Player, "MaidOutfit2", "Cloth", false);
		InventoryAdd(Player, "MaidHairband1", "Cloth", false);
		InventoryAdd(Player, "MaidApron1", "Cloth", false);
		InventoryAdd(Player, "MaidApron2", "Cloth", false);
		InventoryAdd(Player, "FrillyApron", "ClothAccessory", false);
		InventoryAdd(Player, "MaidHairband1", "Hat", false);
		InventoryAdd(Player, "ServingTray", "ItemMisc", false);
	} else {
		InventoryDelete(Player, "MaidOutfit1", "Cloth", false);
		InventoryDelete(Player, "MaidOutfit2", "Cloth", false);
		InventoryDelete(Player, "MaidHairband1", "Cloth", false);
		InventoryDelete(Player, "MaidApron1", "Cloth", false);
		InventoryDelete(Player, "MaidApron2", "Cloth", false);
		InventoryDelete(Player, "FrillyApron", "ClothAccessory", false);
		InventoryDelete(Player, "MaidHairband1", "Hat", false);
		InventoryDelete(Player, "ServingTray", "ItemMisc", false);
	}
}

/**
 * Ensures lover-exclusive items are removed if the player has no lovers.
 * @returns {void} Nothing
 */
function LoginLoversItems() {
	var LoversNumbers = Player.GetLoversNumbers();

	//check to remove love leather collar slave collar if no lover
	if (LoversNumbers.length < 1) {
		var Collar = InventoryGet(Player,"ItemNeck");
		if (Collar && Collar.Property && (Collar.Asset.Name == "SlaveCollar") && (Collar.Property.Type == "LoveLeatherCollar")) {
			Collar.Property = null;
			Collar.Color = "Default";
		}
	}

	// remove any item that was lover locked if the number on the lock does not match any lover
	for (let A = 0; A < Player.Appearance.length; A++) {
		if (Player.Appearance[A].Property && Player.Appearance[A].Property.LockedBy && Player.Appearance[A].Property.LockedBy.startsWith("Lovers")
			&& Player.Appearance[A].Property.MemberNumber && (LoversNumbers.indexOf(Player.Appearance[A].Property.MemberNumber) < 0)) {
			InventoryRemove(Player, Player.Appearance[A].Asset.Group.Name);
			A--;
		}
	}
}

/**
 * Adds or removes Asylum items. Only players that have previously maxed out their patient or nurse reputation are
 * eligible for their own set of Asylum restraints outside the Asylum.
 * @returns {void} - Nothing
 */
function LoginAsylumItems() {
	if (LogQuery("ReputationMaxed", "Asylum")) {
		InventoryAddMany(Player, [
			{Name: "MedicalBedRestraints", Group: "ItemArms"},
			{Name: "MedicalBedRestraints", Group: "ItemLegs"},
			{Name: "MedicalBedRestraints", Group: "ItemFeet"},
		], false);
	} else {
		InventoryDelete(Player, "MedicalBedRestraints", "ItemArms", false);
		InventoryDelete(Player, "MedicalBedRestraints", "ItemLegs", false);
		InventoryDelete(Player, "MedicalBedRestraints", "ItemFeet", false);
	}
}

/**
 * Adds items if specific cheats are enabled
 * @returns {void} - Nothing
 */
function LoginCheatItems() {
	if (CheatFactor("FreeCollegeOutfit", 0) == 0) {
		InventoryAdd(Player, "CollegeOutfit1", "Cloth");
		InventoryAdd(Player, "CollegeSkirt", "ClothLower");
	}
}

/**
 * Checks every owned item to see if its BuyGroup contains an item the player does not have. This allows the player to
 * collect any items that have been added to the game which are in a BuyGroup that they have already purchased.
 * @returns {void} Nothing
 */
function LoginValideBuyGroups() {
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A].BuyGroup != null) && InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name))
			for (let B = 0; B < Asset.length; B++)
				if ((Asset[B] != null) && (Asset[B].BuyGroup != null) && (Asset[B].BuyGroup == Asset[A].BuyGroup) && !InventoryAvailable(Player, Asset[B].Name, Asset[B].Group.Name))
					InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name, false);
}

/**
 * Checks if the player arrays contains any item that does not exists and saves them.
 * @returns {void} Nothing
 */
function LoginValidateArrays() {
	let update = false;
	var CleanBlockItems = AssetCleanArray(Player.BlockItems);
	if (CleanBlockItems.length != Player.BlockItems.length) {
		Player.BlockItems = CleanBlockItems;
		update = true;
	}

	var CleanLimitedItems = AssetCleanArray(Player.LimitedItems);
	if (CleanLimitedItems.length != Player.LimitedItems.length) {
		Player.LimitedItems = CleanLimitedItems;
		update = true;
	}

	var CleanHiddenItems = AssetCleanArray(Player.HiddenItems);
	if (CleanHiddenItems.length != Player.HiddenItems.length) {
		Player.HiddenItems = CleanHiddenItems;
		update = true;
	}


	var CleanFavoriteItems = AssetCleanArray(Player.FavoriteItems);
	if (CleanFavoriteItems.length != Player.FavoriteItems.length) {
		Player.FavoriteItems = CleanFavoriteItems;
		update = true;
	}

	if (update)
		ServerPlayerBlockItemsSync();
}

/**
 * Makes sure the difficulty restrictions are applied to the player
 * @param {boolean} applyDefaults - If changing to the difficulty, set this to True to set LimitedItems to the default settings
 * @returns {void} Nothing
 */
function LoginDifficulty(applyDefaults) {

	// If Extreme mode, the player cannot control her blocked items
	if (Player.GetDifficulty() >= 3) {
		LoginExtremeItemSettings(applyDefaults);
		ServerPlayerBlockItemsSync();
	}
}

/**
 * Set the item permissions for the Extreme difficulty
 * @param {boolean} applyDefaults - When initially changing to extreme/whitelist, TRUE sets strong locks to limited permissions. When enforcing
 * settings, FALSE allows them to remain as they are since the player could have changed them to fully open.
 * @returns {void} Nothing
 */
function LoginExtremeItemSettings(applyDefaults) {
	Player.BlockItems = [];
	if (applyDefaults) {
		// If the item permissions are 3 = "Owner/Lover/Whitelist" don't limit the locks, since that just blocks whitelisted players
		Player.LimitedItems = Player.ItemPermission == 3 ? [] : MainHallStrongLocks.map(L => { return { Name: L, Group: "ItemMisc", Type: null }; });
	} else {
		Player.LimitedItems = Player.LimitedItems.filter(item => MainHallStrongLocks.includes(item.Name));
	}
	Player.HiddenItems = [];
}

/**
 * Handles server response, when login has been queued
 * @param {number} Pos The position in queue
 */
function LoginQueue(Pos) {
	if (typeof Pos !== "number") return;

	LoginMessage = TextGet("LoginQueueWait").replace("QUEUE_POS", `${Pos}`);
}

/**
 * Handles player login response data
 * @param {object | string} C - The Login response data - this will either be the player's character data if the
 * login was successful, or a string error message if the login failed.
 * @returns {void} Nothing
 */
function LoginResponse(C) {

	// If the return package contains a name and a account name
	if (typeof C === "object") {

		// In relog mode, we jump back to the previous screen, keeping the current game flow
		if (RelogData != null) {
			LoginUpdateMessage();
			ElementRemove("InputPassword");
			Player.OnlineID = C.ID.toString();
			CurrentCharacter = RelogData.Character;
			CommonSetScreen(RelogData.Module, RelogData.Screen);
			var Elements = document.getElementsByClassName("HideOnDisconnect");
			for (let E = 0; E < Elements.length; E++)
				Elements[E].style.display = "";
			if ((ChatRoomData != null) && (ChatRoomData.Name != null) && (ChatRoomData.Name != "") && (RelogChatLog != null)) {
				CommonSetScreen("Online", "ChatSearch");
				ChatRoomPlayerCanJoin = true;
				ServerSend("ChatRoomJoin", { Name: ChatRoomData.Name });
			}
			return;
		}

		// In regular mode, we set the account properties for a new club session
		if ((C.Name != null) && (C.AccountName != null)) {

			// Make sure we have values
			if (C.Appearance == null) C.Appearance = [];
			if (C.AssetFamily == null) C.AssetFamily = "Female3DCG";

			// Sets the player character info
			Player.Name = C.Name;
			Player.AccountName = C.AccountName;
			Player.AssetFamily = C.AssetFamily;
			Player.Title = C.Title;
			Player.Nickname = (C.Nickname == null) ? "" : C.Nickname;
			if (CommonIsNumeric(C.Money)) Player.Money = C.Money;
			Player.Owner = ((C.Owner == null) || (C.Owner == "undefined")) ? "" : C.Owner;
			Player.Game = C.Game;
			if (typeof C.Description === "string" && C.Description.startsWith("╬")) {
				C.Description = LZString.decompressFromUTF16(C.Description.substr(1));
			}
			Player.Description = (C.Description == null) ? "" : C.Description.substr(0, 10000);
			Player.Creation = C.Creation;
			Player.Wardrobe = CharacterDecompressWardrobe(C.Wardrobe);
			WardrobeFixLength();
			Player.OnlineID = C.ID.toString();
			Player.MemberNumber = C.MemberNumber;
			Player.BlockItems = Array.isArray(C.BlockItems) ? C.BlockItems : typeof C.BlockItems === "object" && C.BlockItems ? CommonUnpackItemArray(C.BlockItems) : [];
			Player.LimitedItems = Array.isArray(C.LimitedItems) ? C.LimitedItems : typeof C.LimitedItems === "object" && C.LimitedItems ? CommonUnpackItemArray(C.LimitedItems) : [];
			Player.FavoriteItems = Array.isArray(C.FavoriteItems) ? C.FavoriteItems : typeof C.FavoriteItems === "object" && C.FavoriteItems ? CommonUnpackItemArray(C.FavoriteItems) : [];
			Player.HiddenItems = ((C.HiddenItems == null) || !Array.isArray(C.HiddenItems)) ? [] : C.HiddenItems;
			if (Array.isArray(C.BlockItems) || Array.isArray(C.LimitedItems)) ServerPlayerBlockItemsSync();
			Player.ChatSearchFilterTerms = C.ChatSearchFilterTerms || "";

			Player.Difficulty = C.Difficulty;
			Player.WardrobeCharacterNames = C.WardrobeCharacterNames;
			WardrobeCharacter = [];

			// Sets the default language when creating or searching for chat rooms
			ChatCreateLanguage = C.RoomCreateLanguage;
			if (ChatCreateLanguage == null) ChatCreateLanguage = ChatCreateLanguageList[0];
			if (ChatCreateLanguageList.indexOf(ChatCreateLanguage) < 0) ChatCreateLanguage = ChatCreateLanguageList[0];
			ChatSearchLanguage = C.RoomSearchLanguage;
			if (ChatSearchLanguage == null) ChatSearchLanguage = "";
			if (ChatCreateLanguageList.indexOf(ChatSearchLanguage) < 0) ChatSearchLanguage = "";

			// Load the last chat room
			Player.LastChatRoom = C.LastChatRoom;
			Player.LastChatRoomBG = C.LastChatRoomBG;
			Player.LastChatRoomPrivate = C.LastChatRoomPrivate;
			Player.LastChatRoomSize = C.LastChatRoomSize;
			Player.LastChatRoomLanguage = C.LastChatRoomLanguage;
			Player.LastChatRoomDesc = C.LastChatRoomDesc;
			Player.LastChatRoomTimer = C.LastChatRoomTimer;
			if (typeof C.LastChatRoomAdmin == "string")
				Player.LastChatRoomAdmin = CommonConvertStringToArray(C.LastChatRoomAdmin);
			if (typeof C.LastChatRoomBan == "string")
				Player.LastChatRoomBan = CommonConvertStringToArray(C.LastChatRoomBan);
			Player.LastChatRoomBlockCategory = C.LastChatRoomBlockCategory;

			// Loads the ownership data
			Player.Ownership = C.Ownership;
			if ((Player.Ownership != null) && (Player.Ownership.Name != null))
				Player.Owner = (Player.Ownership.Stage == 1) ? Player.Ownership.Name : "";

			// Ensures lovership data is compatible and converts lovers to lovership
			Player.Lovership = Array.isArray(C.Lovership) ? C.Lovership : C.Lovership != undefined ? [C.Lovership] : [];
			if ((C.Lover != null) && (C.Lover != "undefined") && C.Lover.startsWith("NPC-")) {
				Player.Lover = C.Lover;
				ServerPlayerSync();
			}

			// Gets the online preferences
			Player.LabelColor = C.LabelColor;
			Player.ItemPermission = C.ItemPermission;
			Player.KinkyDungeonExploredLore = C.KinkyDungeonExploredLore;
			Player.ArousalSettings = C.ArousalSettings;
			Player.ChatSettings = C.ChatSettings;
			Player.VisualSettings = C.VisualSettings;
			Player.AudioSettings = C.AudioSettings;
			Player.ControllerSettings = C.ControllerSettings;
			Player.GameplaySettings = C.GameplaySettings;
			Player.ImmersionSettings = C.ImmersionSettings;
			Player.RestrictionSettings = C.RestrictionSettings;
			Player.OnlineSettings = C.OnlineSettings;
			Player.OnlineSharedSettings = C.OnlineSharedSettings;
			Player.GraphicsSettings = C.GraphicsSettings;
			Player.NotificationSettings = C.NotificationSettings;
			Player.SavedExpressions = C.SavedExpressions;
			if (!Array.isArray(Player.SavedExpressions)) {
				Player.SavedExpressions = [];
			}
			if (Player.SavedExpressions.length < 5) {
				for (let x = Player.SavedExpressions.length; x < 5; x++) {
					Player.SavedExpressions.push(null);
				}
			}

			// Load Favorited Colors
			Player.SavedColors = C.SavedColors;
			if (!Array.isArray(Player.SavedColors)) {
				Player.SavedColors = [];
			}
			for (let i = 0; i < ColorPickerNumSaved; i++) {
				if (typeof Player.SavedColors[i] != "object" || isNaN(Player.SavedColors[i].H) || isNaN(Player.SavedColors[i].S) || isNaN(Player.SavedColors[i].V)) {
					Player.SavedColors[i] = GetDefaultSavedColors()[i];
				}
			}
			Player.SavedColors.length = ColorPickerNumSaved;

			// Loads the online lists
			Player.WhiteList = ((C.WhiteList == null) || !Array.isArray(C.WhiteList)) ? [] : C.WhiteList;
			Player.BlackList = ((C.BlackList == null) || !Array.isArray(C.BlackList)) ? [] : C.BlackList;
			Player.FriendList = ((C.FriendList == null) || !Array.isArray(C.FriendList)) ? [] : C.FriendList;

			// Attempt to parse friend names
			if (typeof C.FriendNames === "string") {
				try {
					Player.FriendNames = new Map(JSON.parse(LZString.decompressFromUTF16(C.FriendNames)));
				} catch(err) {
					console.warn("An error occured while parsing friendnames, entries have been reset.");
				}
			}
			if (Player.FriendNames == null) {
				Player.FriendNames = new Map();
			}
			Player.SubmissivesList = typeof C.SubmissivesList === "string" ? new Set(JSON.parse(LZString.decompressFromUTF16(C.SubmissivesList))) : new Set();
			Player.GhostList = ((C.GhostList == null) || !Array.isArray(C.GhostList)) ? [] : C.GhostList;
			Player.Infiltration = C.Infiltration;
			LoginDifficulty(false);

			// Loads the player character model and data
			LoginPerformInventoryFixups(C.Inventory, C.Appearance);
			ServerAppearanceLoadFromBundle(Player, C.AssetFamily, C.Appearance, C.MemberNumber);
			InventoryLoad(Player, C.Inventory);
			LogLoad(C.Log);
			ReputationLoad(C.Reputation);
			SkillLoad(C.Skill);
			CraftingLoadServer(C.Crafting);

			// Calls the preference init to make sure the preferences are loaded correctly
			PreferenceInitPlayer();
			if (Player.VisualSettings) {
				if (Player.VisualSettings.PrivateRoomBackground) PrivateBackground = Player.VisualSettings.PrivateRoomBackground;
				if (Player.VisualSettings.MainHallBackground) MainHallBackground = Player.VisualSettings.MainHallBackground;
			}
			ActivitySetArousal(Player, 0);
			ActivityTimerProgress(Player, 0);
			NotificationLoad();

			// Loads the dialog and removes the login controls
			CharacterLoadCSVDialog(Player);
			PrivateCharacterMax = 4 + (LogQuery("Expansion", "PrivateRoom") ? 4 : 0) + (LogQuery("SecondExpansion", "PrivateRoom") ? 4 : 0);
			CharacterRefresh(Player, false);
			ElementRemove("InputName");
			ElementRemove("InputPassword");
			CharacterDelete(LoginCharacter);
			if (ManagementIsClubSlave()) CharacterNaked(Player);

			// Starts the game in the main hall while loading characters in the private room
			PrivateCharacter = [];
			PrivateCharacter.push(Player);
			if (C.PrivateCharacter != null)
				for (let P = 0; P < C.PrivateCharacter.length; P++)
					PrivateCharacter.push(C.PrivateCharacter[P]);
			SarahSetStatus();

			// Fixes a few items
			var InventoryBeforeFixes = InventoryStringify(Player);
			LoginValidCollar();
			LoginMistressItems();
			LoginStableItems();
			LoginMaidItems();
			LoginLoversItems();
			LoginAsylumItems();
			LoginCheatItems();
			LoginValideBuyGroups();
			LoginValidateArrays();
			if (InventoryBeforeFixes != InventoryStringify(Player)) ServerPlayerInventorySync();
			CharacterAppearanceValidate(Player);
			AsylumGGTSSAddItems();

			// If the player must log back in the cell
			if (LogQuery("Locked", "Cell")) {
				CommonSetScreen("Room", "Cell");
			} else {

				// If the player must log back in Pandora's Box prison
				if ((Player.Infiltration != null) && (Player.Infiltration.Punishment != null) && (Player.Infiltration.Punishment.Timer != null) && (Player.Infiltration.Punishment.Timer > CurrentTime)) {
					PandoraWillpower = 0;
					InfiltrationDifficulty = Player.Infiltration.Punishment.Difficulty;
					CommonSetScreen("Room", "PandoraPrison");
				} else {

					// If the player must log back in the asylum
					if (LogQuery("Committed", "Asylum") || LogQuery("Isolated", "Asylum") || (AsylumGGTSGetLevel(Player) >= 6)) {
						if (AsylumGGTSGetLevel(Player) <= 5)
							AsylumEntranceWearPatientClothes(Player, true);
						else
							AsylumGGTSDroneDress(Player);
						CommonSetScreen("Room", "AsylumBedroom");
					} else {

						// If the owner is forcing the player to do GGTS
						if (LogValue("ForceGGTS", "Asylum") > 0) {
							CommonSetScreen("Room", "AsylumEntrance");
						} else {

							// If the player must start in her room, in her cage
							if (LogQuery("SleepCage", "Rule") && (Player.Owner != "") && PrivateOwnerInRoom()) {
								InventoryRemove(Player, "ItemFeet");
								InventoryRemove(Player, "ItemLegs");
								Player.Cage = true;
								CharacterSetActivePose(Player, "Kneel", true);
								CommonSetScreen("Room", "Private");
							} else {
								CommonSetScreen("Room", "MainHall");
								MainHallMaidIntroduction();
							}

						}

					}

				}

			}

		} else {
			LoginStatusReset("ErrorLoadingCharacterData");
		}
	} else LoginStatusReset(C);
	LoginUpdateMessage();
}

/**
 * Handles player click events on the character login screen
 * @returns {void} Nothing
 */
function LoginClick() {

	// Opens the cheat panel
	if (CheatAllow && MouseIn(825, 870, 350, 60)) {
		ElementRemove("InputName");
		ElementRemove("InputPassword");
		CommonSetScreen("Character", "Cheat");
	}

	// Opens the password reset screen
	if (!CheatAllow && ServerIsConnected && MouseIn(825, 870, 350, 60)) {
		ElementRemove("InputName");
		ElementRemove("InputPassword");
		CommonSetScreen("Character", "PasswordReset");
	}

	// If we must create a new character
	if (ServerIsConnected && MouseIn(825, 740, 350, 60)) {
		ElementRemove("InputName");
		ElementRemove("InputPassword");
		CommonSetScreen("Character", "Disclaimer");
	}

	// Try to login
	if (MouseIn(775, 500, 200, 60)) LoginDoLogin();

	// If we must change the language
	if (MouseIn(1025, 500, 200, 60)) {
		TranslationNextLanguage();
		TextLoad();
		ActivityDictionaryLoad();
		AssetLoadDescription("Female3DCG");
	}

}

/**
 * Handles player keyboard events on the character login screen, "enter" will login
 * @returns {void} Nothing
 */
function LoginKeyDown() {
	if (KeyPress == 13) LoginDoLogin();
}

/**
 * Attempt to log the user in based on their input username and password
 * @returns {void} Nothing
 */
function LoginDoLogin() {

	// Ensure the login request is not sent twice
	if (!LoginSubmitted && ServerIsConnected) {
		var Name = ElementValue("InputName");
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
			LoginSetSubmitted();
			ServerSend("AccountLogin", { AccountName: Name, Password: Password });
		} else LoginStatusReset("InvalidNamePassword");
	}
	LoginUpdateMessage();

}

/**
 * Sets the state of the login page to the submitted state
 * @returns {void} Nothing
 */
function LoginSetSubmitted() {
	LoginSubmitted = true;
	if (ServerIsConnected) LoginErrorMessage = "";
}

/**
 * Resets the login submission state
 * @param {string} [ErrorMessage] - the login error message to set if the login is invalid - if not specified, will clear the login error message
 * @param {boolean} [IsRelog=false] - whether or not we're on the relog screen
 * @returns {void} Nothing
 */
function LoginStatusReset(ErrorMessage, IsRelog) {
	LoginSubmitted = false;
	LoginIsRelog = !!IsRelog;
	if (ErrorMessage) LoginErrorMessage = ErrorMessage;
}

/**
 * Updates the message on the login page
 * @returns {void} Nothing
 */
function LoginUpdateMessage() {
	LoginMessage = TextGet(LoginGetMessageKey());
}

/**
 * Retrieves the correct message key based on the current state of the login page
 * @returns {string} The key of the message to display
 */
function LoginGetMessageKey() {
	if (LoginErrorMessage) return LoginErrorMessage;
	else if (!ServerIsConnected) return "ConnectingToServer";
	else if (LoginSubmitted) return "ValidatingNamePassword";
	else return LoginIsRelog ? "EnterPassword" : "EnterNamePassword";
}

/**
 * Exit function - called when leaving the login page
 * @returns {void} - Nothing
 */
function LoginExit() {
	if (LoginTextCacheUnsubscribeCallback) {
		LoginTextCacheUnsubscribeCallback();
	}
}
