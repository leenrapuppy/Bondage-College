"use strict";
var WheelFortuneBackground = "Black";
var WheelFortuneEntryModule = "";
var WheelFortuneEntryScreen = "";
/** @type {null | Character} */
var WheelFortuneCharacter = null;
var WheelFortuneRoleplay = false;
var WheelFortuneForced = false;
var WheelFortunePos = 0;
var WheelFortunePosMax = 0;
var WheelFortuneVelocity = 0;
var WheelFortuneVelocityTime = 0;
/** @type {null | number} */
var WheelFortunePosY = null;
var WheelFortuneInitY = 0;
var WheelFortuneInitTime = 0;
var WheelFortuneValue = "";
var WheelFortuneList = "";
var WheelFortuneEncaseList = ["Coffin", "VacBedDeluxe", "CryoCapsule", "DisplayCase", "DollBox", "WoodenBox", "SmallWoodenBox", "Locker", "SmallLocker", "Cage", "LowCage", "TransportWoodenBox", "TheDisplayFrame"];
var WheelFortuneEncaseClosedList = ["Coffin", "CryoCapsule"];
var WheelFortunePasswordChar = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var WheelFortuneDefault = "ABCFGHKLMNPQRSUVWabcfgj$!-()0123456";
var WheelFortuneOption = [
	{
		// Gagged
		ID: "A",
		Color: "Yellow",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 0);
		}
	},
	{
		// Gagged for 5 minutes
		ID: "B",
		Color: "Yellow",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 5);
		}
	},
	{
		// Gagged for 15 minutes
		ID: "C",
		Color: "Yellow",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 15);
		}
	},
	{
		// Gagged for 60 minutes
		ID: "D",
		Color: "Yellow",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 60);
		}
	},
	{
		// Gagged for 4 hours
		ID: "E",
		Color: "Yellow",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 240);
		}
	},
	{
		// Blindfolded
		ID: "F",
		Color: "Purple",
		Script: function() {
			WheelFortuneInventoryWear("ItemHead", 0);
		}
	},
	{
		// Blindfolded for 5 minutes
		ID: "G",
		Color: "Purple",
		Script: function() {
			WheelFortuneInventoryWear("ItemHead", 5);
		}
	},
	{
		// Blindfolded for 15 minutes
		ID: "H",
		Color: "Purple",
		Script: function() {
			WheelFortuneInventoryWear("ItemHead", 15);
		}
	},
	{
		// Blindfolded for 60 minutes
		ID: "I",
		Color: "Purple",
		Script: function() {
			WheelFortuneInventoryWear("ItemHead", 60);
		}
	},
	{
		// Blindfolded for 4 hours
		ID: "J",
		Color: "Purple",
		Script: function() {
			WheelFortuneInventoryWear("ItemHead", 240);
		}
	},
	{
		// Arms bound
		ID: "K",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemArms", 0);
		}
	},
	{
		// Arms bound for 5 minutes
		ID: "L",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemArms", 5);
		}
	},
	{
		// Arms bound for 15 minutes
		ID: "M",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemArms", 15);
		}
	},
	{
		// Arms bound for 60 minutes
		ID: "N",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemArms", 60);
		}
	},
	{
		// Arms bound for 4 hours
		ID: "O",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemArms", 240);
		}
	},
	{
		// Legs bound
		ID: "P",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemFeet", 0);
		}
	},
	{
		// Legs bound for 5 minutes
		ID: "Q",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemFeet", 5);
		}
	},
	{
		// Legs bound for 15 minutes
		ID: "R",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemFeet", 15);
		}
	},
	{
		// Legs bound for 60 minutes
		ID: "S",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemFeet", 60);
		}
	},
	{
		// Legs bound for 4 hours
		ID: "T",
		Color: "Blue",
		Script: function() {
			WheelFortuneInventoryWear("ItemFeet", 240);
		}
	},
	{
		// Full bondage
		ID: "U",
		Color: "Orange",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 0);
			WheelFortuneInventoryWear("ItemHead", 0);
			WheelFortuneInventoryWear("ItemArms", 0);
			WheelFortuneInventoryWear("ItemFeet", 0);
		}
	},
	{
		// Full bondage for 5 minutes
		ID: "V",
		Color: "Orange",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 5);
			WheelFortuneInventoryWear("ItemHead", 5);
			WheelFortuneInventoryWear("ItemArms", 5);
			WheelFortuneInventoryWear("ItemFeet", 5);
		}
	},
	{
		// Full bondage for 15 minutes
		ID: "W",
		Color: "Orange",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 15);
			WheelFortuneInventoryWear("ItemHead", 15);
			WheelFortuneInventoryWear("ItemArms", 15);
			WheelFortuneInventoryWear("ItemFeet", 15);
		}
	},
	{
		// Full bondage for 60 minutes
		ID: "X",
		Color: "Orange",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 60);
			WheelFortuneInventoryWear("ItemHead", 60);
			WheelFortuneInventoryWear("ItemArms", 60);
			WheelFortuneInventoryWear("ItemFeet", 60);
		}
	},
	{
		// Full bondage for 4 hours
		ID: "Y",
		Color: "Orange",
		Script: function() {
			WheelFortuneInventoryWear("ItemMouth", 240);
			WheelFortuneInventoryWear("ItemHead", 240);
			WheelFortuneInventoryWear("ItemArms", 240);
			WheelFortuneInventoryWear("ItemFeet", 240);
		}
	},
	{
		// Encased
		ID: "a",
		Color: "Red",
		Script: function() {
			WheelFortuneInventoryWear("ItemDevices", 0);
		}
	},
	{
		// Encased for 5 minutes
		ID: "b",
		Color: "Red",
		Script: function() {
			WheelFortuneInventoryWear("ItemDevices", 5);
		}
	},
	{
		// Encased for 15 minutes
		ID: "c",
		Color: "Red",
		Script: function() {
			WheelFortuneInventoryWear("ItemDevices", 15);
		}
	},
	{
		// Encased for 60 minutes
		ID: "d",
		Color: "Red",
		Script: function() {
			WheelFortuneInventoryWear("ItemDevices", 60);
		}
	},
	{
		// Encased for 4 hours
		ID: "e",
		Color: "Red",
		Script: function() {
			WheelFortuneInventoryWear("ItemDevices", 240);
		}
	},
	{
		// No wardrobe for 5 minutes
		ID: "f",
		Color: "Gray",
		Script: function() {
			WheelFortuneBlockWardrobe(5);
		}
	},
	{
		// No wardrobe for 15 minutes
		ID: "g",
		Color: "Gray",
		Script: function() {
			WheelFortuneBlockWardrobe(15);
		}
	},
	{
		// No wardrobe for 60 minutes
		ID: "h",
		Color: "Gray",
		Script: function() {
			WheelFortuneBlockWardrobe(60);
		}
	},
	{
		// No wardrobe for 4 hours
		ID: "i",
		Color: "Gray",
		Script: function() {
			WheelFortuneBlockWardrobe(240);
		}
	},
	{
		// Isolation cell for 5 minutes
		ID: "j",
		Color: "Red",
		Script: function() {
			WheelFortuneIsolationCell(5);
		}
	},
	{
		// Isolation cell for 15 minutes
		ID: "k",
		Color: "Red",
		Script: function() {
			WheelFortuneIsolationCell(15);
		}
	},
	{
		// Isolation cell for 30 minutes
		ID: "l",
		Color: "Red",
		Script: function() {
			WheelFortuneIsolationCell(30);
		}
	},
	{
		// Isolation cell for 60 minutes
		ID: "m",
		Color: "Red",
		Script: function() {
			WheelFortuneIsolationCell(60);
		}
	},
	{
		// Hogtie bondage
		ID: "$",
		Color: "Orange",
		Script: function() {
			WheelFortuneHogtie();
		}
	},
	{
		// Shibari bondage
		ID: "!",
		Color: "Orange",
		Script: function() {
			WheelFortuneShibari();
		}
	},
	{
		// Futuristic bondage
		ID: "&",
		Color: "Orange",
		Script: function() {
			WheelFortuneFuturisticBondage();
		}
	},
	{
		// Pet bondage
		ID: "[",
		Color: "Orange",
		Script: function() {
			CharacterNaked(Player);
			InventoryWearRandom(Player, "ItemArms", 8, null, false, true, ["BitchSuit", "HempRope", "Chains", "ArmbinderJacket", "StraitLeotard", "LeatherStraitJacket", "BoxTieArmbinder", "Bolero", "PantyhoseBodyOpen", "SeamlessStraitDress", "SeamlessStraitDressOpen"], true);
			InventoryWearRandom(Player, "HairAccessory1", 8, null, false, true, ["Ears1", "Ears2", "PonyEars1", "BunnyEars1", "BunnyEars2", "PuppyEars1", "FoxEars1", "WolfEars1", "WolfEars2", "FoxEars2", "FoxEars3", "PuppyEars2"], true);
			InventoryWearRandom(Player, "TailStraps", 8, null, false, true, ["FoxTailsStrap", "PuppyTailStrap", "RaccoonStrap", "PuppyTailStrap1", "FoxTailStrap1", "FoxTailStrap2", "WolfTailStrap1", "WolfTailStrap2", "WolfTailStrap3"], true);
			if (InventoryGet(Player, "ItemMouth") == null) InventoryWearRandom(Player, "ItemMouth", 8);
			if (InventoryGet(Player, "ItemNeck") == null) InventoryWearRandom(Player, "ItemNeck", 8);
			if ((InventoryGet(Player, "ItemNeckRestraints") == null) && WheelFortuneCanWear("ChainLeash", "ItemNeckRestraints")) InventoryWear(Player, "ChainLeash", "ItemNeckRestraints", null, 8);
			CharacterSetActivePose(Player, "Kneel", true);
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// Web bondage
		ID: "]",
		Color: "Orange",
		Script: function() {
			if (WheelFortuneCanWear("WebBlindfold", "ItemHead")) {
				InventoryWear(Player, "WebBlindfold", "ItemHead", "Default", 15);
				InventoryRandomExtend(Player, "ItemHead");
			}
			if (WheelFortuneCanWear("WebGag", "ItemMouth")) InventoryWear(Player, "WebGag", "ItemMouth", "Default", 15);
			if (WheelFortuneCanWear("Web", "ItemArms")) {
				InventoryWear(Player, "Web", "ItemArms", "Default", 15);
				InventoryRandomExtend(Player, "ItemArms");
			}
			CharacterRefresh(Player);
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// Maid outfit
		ID: "@",
		Color: "Blue",
		Script: function() {
			MaidQuartersWearMaidUniform();
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// ABDL outfit
		ID: "#",
		Color: "Blue",
		Script: function() {
			CharacterNaked(Player);
			InventoryWear(Player, CommonRandomItemFromList("", ["", "AdultBabyDress1", "AdultBabyDress2", "AdultBabyDress3", "AdultBabyDress4"]), "Cloth");
			InventoryWear(Player, CommonRandomItemFromList("", ["Diapers1", "Diapers2", "Diapers3", "Diapers4", "BulkyDiaper", "PoofyDiaper"]), "Panties");
			if (Math.random() > 0.5) InventoryWear(Player, "Bib", "ClothAccessory");
			if ((Math.random() > 0.5) && (InventoryGet(Player, "ItemMouth") == null)) InventoryWear(Player, CommonRandomItemFromList("", ["PacifierGag", "HarnessPacifierGag", "MilkBottle", "PaciGag"]), "ItemMouth");
			if ((Math.random() > 0.5) && (InventoryGet(Player, "ItemHands") == null)) InventoryWear(Player, CommonRandomItemFromList("", ["PaddedMittens", "PawMittens"]), "ItemHands", "Default", 15);
			if ((Math.random() > 0.5) && (InventoryGet(Player, "ItemMisc") == null)) InventoryWear(Player, CommonRandomItemFromList("", ["TeddyBear"]), "ItemMisc");
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// Slave outfit
		ID: "+",
		Color: "Blue",
		Script: function() {
			CharacterNaked(Player);
			InventoryWear(Player, "SlaveRags", "Cloth");
			if (InventoryGet(Player, "ItemFeet") == null) InventoryWear(Player, CommonRandomItemFromList("", ["BallChain", "AnkleShackles"]), "ItemFeet", "Default", 15);
			if (InventoryGet(Player, "ItemNeck") == null) InventoryWear(Player, CommonRandomItemFromList("", ["DogCollar", "LeatherChoker", "SpikeCollar", "ShinySteelCollar", "SlenderSteelCollar"]), "ItemNeck", "Default", 12);
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// New clothes
		ID: "-",
		Color: "Blue",
		Script: function() {
			CharacterNaked(Player);
			CharacterAppearanceFullRandom(Player);
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// Underwear
		ID: "(",
		Color: "Blue",
		Script: function() {
			if (CharacterIsInUnderwear(Player) || CharacterIsNaked(Player)) {
				CharacterNaked(Player);
				CharacterRandomUnderwear(Player);
			} else {
				CharacterUnderwear(Player, Player.Appearance.slice());
			}
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// Naked
		ID: ")",
		Color: "Blue",
		Script: function() {
			CharacterNaked(Player);
			ChatRoomCharacterUpdate(Player);
		}
	},
	{
		// Everyone should cheer for you
		ID: "0",
		Color: "Green"
	},
	{
		// Everyone should pat your head
		ID: "1",
		Color: "Green"
	},
	{
		// Everyone should hug you
		ID: "2",
		Color: "Green"
	},
	{
		// Everyone should tickle you
		ID: "3",
		Color: "Green"
	},
	{
		// Everyone should kiss you
		ID: "4",
		Color: "Green"
	},
	{
		// Everyone should pinch you
		ID: "5",
		Color: "Green"
	},
	{
		// Everyone should spank you
		ID: "6",
		Color: "Green"
	},
	{
		// Everyone should caress you
		ID: "7",
		Color: "Green"
	},
	{
		// Everyone should grope you
		ID: "8",
		Color: "Green"
	},
	{
		// Everyone should masturbate you
		ID: "9",
		Color: "Green"
	},
	{
		// Spin again twice
		ID: "²",
		Color: "Gold"
	}
];

/**
 * Returns TRUE if the wheel of fortune can add an item on the specified asset slot
 * @param {String} AssetName - The asset name
 * @param {AssetGroupName} GroupName - The asset group to focus
 * @returns {boolean} - TRUE if we can add
 */
function WheelFortuneCanWear(AssetName, GroupName) {
	if (InventoryGroupIsBlocked(Player, GroupName)) return false;
	let Item = InventoryGet(Player, GroupName);
	if ((Item != null) && (InventoryGetLock(Item) != null)) return false;
	if (InventoryIsPermissionBlocked(Player, AssetName, GroupName)) return false;
	return true;
}

/**
 * Puts the player in random futuristic bondage
 * @returns {void} - Nothing
 */
function WheelFortuneFuturisticBondage() {
	CharacterNaked(Player);
	let AssetName = CommonRandomItemFromList("", ["FuturisticArmbinder", "FuturisticStraitjacket"]);
	if (WheelFortuneCanWear(AssetName, "ItemArms")) InventoryWear(Player, AssetName, "ItemArms", "Default", 15);
	if (WheelFortuneCanWear("FuturisticAnkleCuffs", "ItemFeet")) InventoryWear(Player, "FuturisticAnkleCuffs", "ItemFeet", "Default", 15);
	if (WheelFortuneCanWear("FuturisticLegCuffs", "ItemLegs")) InventoryWear(Player, "FuturisticLegCuffs", "ItemLegs", "Default", 15);
	if (WheelFortuneCanWear("FuturisticHeels2", "ItemBoots")) InventoryWear(Player, "FuturisticHeels2", "ItemBoots", "Default", 15);
	if (WheelFortuneCanWear("FuturisticTrainingBelt", "ItemPelvis")) InventoryWear(Player, "FuturisticTrainingBelt", "ItemPelvis", "Default", 15);
	if (WheelFortuneCanWear("FuturisticBra", "ItemBreast")) InventoryWear(Player, "FuturisticBra", "ItemBreast", "Default", 15);
	if (WheelFortuneCanWear("FuturisticHarness", "ItemTorso")) InventoryWear(Player, "FuturisticHarness", "ItemTorso", "Default", 15);
	AssetName = CommonRandomItemFromList("", ["FuturisticPanelGag", "FuturisticHarnessPanelGag", "FuturisticHarnessBallGag"]);
	if (WheelFortuneCanWear(AssetName, "ItemMouth")) InventoryWear(Player, AssetName, "ItemMouth", "Default", 15);
	if (WheelFortuneCanWear("FuturisticMask", "ItemHead")) InventoryWear(Player, "FuturisticMask", "ItemHead", "Default", 15);
	if (WheelFortuneCanWear("FuturisticCollar", "ItemNeck")) InventoryWear(Player, "FuturisticCollar", "ItemNeck", "Default", 15);
	if (WheelFortuneCanWear("FuturisticEarphones", "ItemEars")) InventoryWear(Player, "FuturisticEarphones", "ItemEars", "Default", 15);
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}

/**
 * Puts the player in random hogtie bondage
 * @returns {void} - Nothing
 */
function WheelFortuneHogtie() {
	let ItemName = CommonRandomItemFromList("", ["HempRope", "LeatherCuffs", "OrnateCuffs", "WoodenCuffs", "ThinLeatherStraps"]);
	if (!WheelFortuneCanWear(ItemName, "ItemArms")) return;
	InventoryRemove(Player, "ItemArms");
	let Type = (ItemName == "ThinLeatherStraps") ? "Hogtie" : "Hogtied";
	InventoryWear(Player, ItemName, "ItemArms", "Default", 15);
	InventoryGet(Player, "ItemArms").Property = { Type: Type, SetPose: ["Hogtied"], Difficulty: 0, Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], Effect: ["Block", "Freeze", "Prone"] };
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}

/**
 * Puts the player in random shibari rope bondage
 * @returns {void} - Nothing
 */
function WheelFortuneShibari() {
	if (WheelFortuneCanWear("HempRope", "ItemArms")) InventoryWear(Player, "HempRope", "ItemArms", "Default", 15);
	if (WheelFortuneCanWear("HempRope", "ItemLegs")) InventoryWear(Player, "HempRope", "ItemLegs", "Default", 15);
	if (WheelFortuneCanWear("HempRope", "ItemFeet")) InventoryWear(Player, "HempRope", "ItemFeet", "Default", 15);
	if (WheelFortuneCanWear("HempRopeHarness", "ItemTorso")) {
		InventoryWear(Player, "HempRopeHarness", "ItemTorso", "Default", 15);
		if (Math.random() > 0.66) InventoryGet(Player, "ItemTorso").Property = { Type: "Diamond", Difficulty: 0, Effect: [] };
		else if (Math.random() > 0.5) InventoryGet(Player, "ItemTorso").Property = { Type: "Harness", Difficulty: 0, Effect: [] };
	}
	if (Math.random() >= 0.5) InventoryWear(Player, "BambooGag", "ItemMouth");
	let Level = Math.floor(Math.random() * 3);
	if ((Level == 1) && InventoryIsWorn(Player, "HempRope", "ItemFeet")) InventoryGet(Player, "ItemFeet").Property = { Type: "Suspension", SetPose: ["Suspension", "LegsClosed"], Difficulty: 0, Effect: [] };
	if ((Level == 2) && InventoryIsWorn(Player, "HempRope", "ItemArms")) {
		let SuspensionHogtiedProperty = JSON.parse(JSON.stringify(TypedItemGetOption("ItemArms", "HempRope", "SuspensionHogtied").Property));
		const height = 0.67 * Math.random();
		SuspensionHogtiedProperty.Difficulty = 0;
		SuspensionHogtiedProperty.OverrideHeight.Height = height * Pose.find(p => p.Name == "Hogtied").OverrideHeight.Height;
		SuspensionHogtiedProperty.OverrideHeight.HeightRatioProportion = height;
		InventoryGet(Player, "ItemArms").Property = SuspensionHogtiedProperty;
	}
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}

/**
 * Sends the player to the isolation for a number of minutes
 * @param {number} Minutes - The number of minutes
 * @returns {void} - Nothing
 */
function WheelFortuneIsolationCell(Minutes) {
	ChatRoomLeave();
	LogAdd("Locked", "Cell", CurrentTime + Minutes * 60000);
	CommonSetScreen("Room", "Cell");
}

/**
 * Block the wardrobe for the user for a set time, or add to the current blocked time
 * @param {number} Minutes - The number of minutes
 * @returns {void} - Nothing
 */
function WheelFortuneBlockWardrobe(Minutes) {
	let Time = LogValue("BlockChange", "Rule");
	if (Time == null) Time = 0;
	if (Time > CurrentTime + 240 * 60000) return;
	if (Time < CurrentTime) Time = CurrentTime;
	Time = Time + Minutes * 60000;
	if (Time > CurrentTime + 240 * 60000) Time = CurrentTime + 240 * 60000;
	LogAdd("BlockChange", "Rule", Time);
}

/**
 * Wears an item from the lucky wheel spin
 * @param {AssetGroupName} Group - The asset group to focus
 * @param {number} Minutes - The number of minutes
 * @returns {void} - Nothing
 */
function WheelFortuneInventoryWear(Group, Minutes) {

	// Validates that we can use at item on that group first
	if (InventoryGroupIsBlocked(Player, Group)) return;

	// If the item is already locked with a timer lock, we extend the time and exit
	let Item = InventoryGet(Player, Group);
	if ((Item != null) && (InventoryGetLock(Item) != null)) {
		if ((Item.Property != null) && (Item.Property.LockedBy === "TimerPasswordPadlock")) {
			Item.Property.RemoveTimer = Item.Property.RemoveTimer + Minutes * 60000;
			if (Item.Property.RemoveTimer > CurrentTime + 240 * 60000) Item.Property.RemoveTimer = CurrentTime + 240 * 60000;
			CharacterRefresh(Player);
			ChatRoomCharacterUpdate(Player);
		}
		return;
	}

	// Tries to wear a random item that locks, 30 tries max
	let Try = 0;
	while (((Item == null) || (Item.Asset == null) || (Item.Asset.AllowLock == false)) && (Try <= 30)) {
		InventoryRemove(Player, Group, false);
		if (Group == "ItemDevices")
			InventoryWear(Player, CommonRandomItemFromList("", WheelFortuneEncaseList), "ItemDevices", "Default", 20);
		else
			InventoryWearRandom(Player, Group, null, false);
		Item = InventoryGet(Player, Group);
		if (Group == "ItemDevices") Item.Property = { Type: (WheelFortuneEncaseClosedList.includes(Item.Asset.Name)) ? "Closed" : null, Difficulty: 50, SelfUnlock: false, Effect:  ["Freeze", "Prone", "Enclose"]};
		Try++;
		if (InventoryBlockedOrLimited(Player, Item)) {
			InventoryRemove(Player, Group, false);
			Item = InventoryGet(Player, Group);
		}
	}
	if (Try > 30) {
		CharacterRefresh(Player);
		return;
	}

	// Applies a lock if needed
	Item = InventoryGet(Player, Group);
	if ((Minutes != null) && (Minutes > 0) && Item.Asset.AllowLock) {
		InventoryLock(Player, Item, "TimerPasswordPadlock", null, true);
		if (Item.Property == null) Item.Property = {};
		Item.Property.RemoveTimer = CurrentTime + Minutes * 60000;
		Item.Property.RemoveItem = true;
		Item.Property.LockSet = true;
		Item.Property.Password = CommonRandomItemFromList("", WheelFortunePasswordChar) + CommonRandomItemFromList("", WheelFortunePasswordChar) + CommonRandomItemFromList("", WheelFortunePasswordChar) + CommonRandomItemFromList("", WheelFortunePasswordChar) + CommonRandomItemFromList("", WheelFortunePasswordChar) + CommonRandomItemFromList("", WheelFortunePasswordChar);
	}

	// Refresh the character to the whole chat room
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);

}

/**
 * Loads the lucky wheel mini game and builds the wheel
 * @returns {void} - Nothing
 */
function WheelFortuneLoad() {

	// Resets to the default wheel if the character wheel is incorrect
	WheelFortuneList = "";
	if ((WheelFortuneCharacter.OnlineSharedSettings != null) && (WheelFortuneCharacter.OnlineSharedSettings.WheelFortune != null)) {
		// Validate whether the (shared) selected options actually exist
		const selectedWheelIDs = WheelFortuneCharacter.OnlineSharedSettings.WheelFortune;
		const allWheelIDs = WheelFortuneOption.map(o => o.ID);
		WheelFortuneList = selectedWheelIDs.split("").filter(id => allWheelIDs.includes(id)).join("");
	}
	if ((WheelFortuneList == null) || (typeof WheelFortuneList !== "string") || (WheelFortuneList.length < 2)) WheelFortuneList = WheelFortuneDefault;
	if (Player.GetDifficulty() >= 2) WheelFortuneRoleplay = false;

	// Shuffles the wheel to give a random order
	WheelFortunePos = Math.floor(Math.random() * 80);
	WheelFortuneVelocity = 0;
	WheelFortuneList = CommonStringShuffle(WheelFortuneList);

	// Gets the maximum position after which the wheel resets
	WheelFortunePosMax = WheelFortuneList.length;
	while (WheelFortunePosMax < 12)
		WheelFortunePosMax = WheelFortunePosMax + WheelFortunePosMax;
	WheelFortunePosMax = WheelFortunePosMax * 83;

	// Create events to spin the wheel for mobile or not
	if (!CommonIsMobile) document.getElementById("MainCanvas").addEventListener("mousedown", WheelFortuneMouseDown);
	if (!CommonIsMobile) document.getElementById("MainCanvas").addEventListener("mouseup", WheelFortuneMouseUp);
	if (CommonIsMobile) document.getElementById("MainCanvas").addEventListener("touchstart", WheelFortuneMouseDown);
	if (CommonIsMobile) document.getElementById("MainCanvas").addEventListener("touchend", WheelFortuneMouseUp);

}

/**
 * Draws the full lucky wheel
 * @returns {void} - Nothing
 */
function WheelFortuneDraw(FullWheel, Pos, MaxPos, X, Y, Zoom) {

	// Draw the black background
	DrawRect(X + 2, Y, 496 * Zoom, 1000 * Zoom, "Black");

	// Make sure the wheel has at least wheel count + 50 elements
	let Wheel = FullWheel.split("");
	while (Wheel.length < FullWheel.length + 50)
		Wheel = [].concat(Wheel, FullWheel.split(""));

	// For each elements in the wheel
	for (let W = 0; W < Wheel.length; W++) {

		// If the element would be visible on screen
		let PosY = (Y + 3 + Pos * Zoom + W * 83 * Zoom) - MaxPos;
		if ((PosY > -83) && (PosY < 1000)) {

			// Gets the wheel option image color
			let Color;
			for (let O of WheelFortuneOption)
				if (O.ID == Wheel[W])
					Color = O.Color;
			if ((Color == null) || (Color == "")) Color = "Green";

			// Draw the wheel option image
			let TextColor = "Black";
			if ((PosY >= 417 * Zoom) && (PosY <= 500 * Zoom)) {
				WheelFortuneValue = Wheel[W];
				TextColor = "White";
			}

			// Draw the text
			DrawImageResize("Screens/MiniGame/WheelFortune/" + Color + ".png", X + 3, PosY, 494 * Zoom, 83 * Zoom);
			DrawTextFit(TextGet("Option" + Wheel[W]), X + 250 * Zoom, PosY + 44 * Zoom, 440, TextColor, "Silver");

		}

	}

	// Draw the border and arrow
	DrawEmptyRect(X - 2, Y - 2, 504, 1004 * Zoom, (WheelFortuneVelocity == 0) ? "White" : "Gold", 2);
	DrawImageResize("Screens/MiniGame/WheelFortune/WheelArrowLeft.png", X - 100, Y + 450 * Zoom, 100 * Zoom, 100 * Zoom);
	DrawImageResize("Screens/MiniGame/WheelFortune/WheelArrowRight.png", X + 500, Y + 450 * Zoom, 100 * Zoom, 100 * Zoom);

}

/**
 * Runs the lucky wheel mini game
 * @returns {void} - Nothing
 */
function WheelFortuneRun() {

	// If the mouse position changed to spin the wheel
	if (MouseY < 0) WheelFortuneMouseUp();
	if ((WheelFortunePosY != null) && (WheelFortunePosY != MouseY) && (MouseY != -1) && (WheelFortuneVelocity == 0)) {
		WheelFortunePos = WheelFortunePos - WheelFortunePosY + MouseY;
		WheelFortunePosY = MouseY;
	}

	// In a top to bottom spin
	if (WheelFortuneVelocity > 0) {
		let Diff = CommonTime() - WheelFortuneVelocityTime;
		WheelFortuneVelocityTime = WheelFortuneVelocityTime + Diff;
		Diff = (WheelFortuneVelocity * Diff / 1500) + Diff / 40;
		if (Diff > WheelFortuneVelocity) Diff = WheelFortuneVelocity;
		WheelFortunePos = WheelFortunePos + Diff;
		WheelFortuneVelocity = WheelFortuneVelocity - Diff;
		if (WheelFortuneVelocity <= 0) WheelFortuneResult();
	}

	// In a bottom to top spin
	if (WheelFortuneVelocity < 0) {
		let Diff = CommonTime() - WheelFortuneVelocityTime;
		WheelFortuneVelocityTime = WheelFortuneVelocityTime + Diff;
		Diff = (WheelFortuneVelocity * Diff * -1 / 1500) + Diff / 40;
		if (Diff > WheelFortuneVelocity * -1) Diff = WheelFortuneVelocity * -1;
		WheelFortunePos = WheelFortunePos - Diff;
		WheelFortuneVelocity = WheelFortuneVelocity + Diff;
		if (WheelFortuneVelocity >= 0) WheelFortuneResult();
	}

	// Resets the wheel if max position is reached
	WheelFortunePos = WheelFortunePos % WheelFortunePosMax;

	// Draw the character and buttons
	DrawRect(0, 0, 2000, 1000, "#00000080");
	DrawCharacter(Player, 100, 0, 1, true);
	let BackColor = (WheelFortuneVelocity == 0) ? "White" : "Silver";
	DrawButton(1885, 25, 90, 90, "", (WheelFortuneForced ? "Pink" : BackColor), "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1770, 25, 90, 90, "", BackColor, "Icons/Random.png", TextGet("Random"));
	WheelFortuneDraw(WheelFortuneList, WheelFortunePos, WheelFortunePosMax, 750, 0, 1);
	DrawTextWrap(TextGet((WheelFortuneVelocity == 0) ? (WheelFortuneForced ? "Forced" : "Title") : "Wait"), 1375, 200, 550, 200, "White");
	if (Player.GetDifficulty() <= 1) {
		MainCanvas.textAlign = "left";
		DrawCheckbox(1436, 468, 64, 64, TextGet("Roleplay"), WheelFortuneRoleplay, (WheelFortuneVelocity != 0), "White");
		MainCanvas.textAlign = "center";
	} else DrawTextWrap(TextGet("NoRoleplay"), 1375, 400, 550, 200, "White");
	DrawButton(1400, 800, 440, 80, (WheelFortuneCharacter?.IsPlayer() ? TextGet("Customize") : TextGet("CustomizeView")), BackColor);

}

/**
 * Handles clicks during the mini game
 * @returns {void} - Nothing
 */
function WheelFortuneClick() {

	// No more clicks if the wheel is spinning
	if (WheelFortuneVelocity != 0) return;

	// When the user wishes to exit
	if (MouseIn(1885, 25, 90, 90) && !WheelFortuneForced) WheelFortuneExit();

	// When the user wishes to do a random spin
	if (MouseIn(1770, 25, 90, 90)) {
		WheelFortuneForced = false;
		WheelFortuneVelocity = WheelFortuneVelocity + 3000 + (Math.random() * 3000);
		WheelFortuneVelocityTime = CommonTime();
		let Msg = TextGet("Spin" + (WheelFortuneRoleplay ? "Roleplay" : ""));
		Msg = Msg.replace("CharacterName", CharacterNickname(WheelFortuneCharacter));
		ServerSend("ChatRoomChat", { Content: Msg, Type: "Emote" });
	}

	// When the user wants to customize the wheel
	if (MouseIn(1400, 800, 440, 80)) CommonSetScreen("Online", "WheelFortuneCustomize");

	// Roleplay check box
	if (MouseIn(1436, 468, 64, 64) && (Player.GetDifficulty() <= 1)) WheelFortuneRoleplay = !WheelFortuneRoleplay;

}

/**
 * If the user clicks to spin the wheel, we keep the starting position
 * @returns {void} - Nothing
 */
function WheelFortuneMouseDown() {
	if (MouseIn(750, 0, 500, 1000) && (WheelFortuneVelocity == 0)) {
		WheelFortunePosY = MouseY;
		WheelFortuneInitY = MouseY;
		WheelFortuneInitTime = CommonTime();
		return;
	}
}

/**
 * If the user releases the mouse/finger to spin the wheel
 * @returns {void} - Nothing
 */
function WheelFortuneMouseUp() {
	if ((WheelFortunePosY != null) && (WheelFortuneVelocity == 0)) {
		if ((WheelFortunePosY < 400) && (MouseY == -1)) WheelFortunePosY = -1;
		if ((WheelFortunePosY > 600) && (MouseY == -1)) WheelFortunePosY = 1001;
		if ((WheelFortuneInitTime + 1000 >= CommonTime()) && (Math.abs(WheelFortuneInitY - WheelFortunePosY) > 300)) {
			WheelFortuneForced = false;
			WheelFortuneVelocity = (WheelFortunePosY - WheelFortuneInitY) * 3;
			if (WheelFortuneVelocity > 0) WheelFortuneVelocity = WheelFortuneVelocity + 800 + (Math.random() * 800);
			if (WheelFortuneVelocity < 0) WheelFortuneVelocity = WheelFortuneVelocity - 800 - (Math.random() * 800);
			WheelFortuneVelocityTime = CommonTime();
			let Msg = TextGet("Spin" + (WheelFortuneRoleplay ? "Roleplay" : ""));
			Msg = Msg.replace("CharacterName", CharacterNickname(WheelFortuneCharacter));
			ServerSend("ChatRoomChat", { Content: Msg, Type: "Emote" });
		}
		WheelFortunePosY = null;
	}
}

/**
 * When the wheel result is set, we publish it and return to the chat room
 * @returns {void} - Nothing
 */
function WheelFortuneResult() {
	if (WheelFortuneEntryScreen == "ChatRoom") {
		let Msg = TextGet("Result" + (WheelFortuneRoleplay ? "Roleplay" : "")) + " " + TextGet("Option" + WheelFortuneValue);
		ServerSend("ChatRoomChat", { Content: Msg, Type: "Emote" });
	}
	CommonSetScreen(WheelFortuneEntryModule, WheelFortuneEntryScreen);
	if (!WheelFortuneRoleplay)
		for (let O of WheelFortuneOption)
			if (O.ID == WheelFortuneValue)
				if (O.Script != null)
					O.Script();
}

/**
 * When the mini exits
 * @returns {void} - Nothing
 */
function WheelFortuneExit() {
	if ((WheelFortuneVelocity == 0) && !WheelFortuneForced) CommonSetScreen(WheelFortuneEntryModule, WheelFortuneEntryScreen);
}
