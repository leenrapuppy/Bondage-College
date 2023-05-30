"use strict";

// How to make your item futuristic!

// In the load function, add this before your load function, without changing functions from the
// futuristic panel gag functions. Just make sure your item loads after the panel gag and not before in index.html:
/*
 	if (!FuturisticAccessLoad()) {
		return;
	}
*/

// In the draw function, add:
/*
 	if (!FuturisticAccessDraw()) {
		return;
	}
*/

// In the click function, add:
/*
 	if (!FuturisticAccessClick()) {
		return;
	}
*/

// In the exit function, add:
/*
	FuturisticAccessExit()
*/

// In the validate function, add:
/*
 	return InventoryItemFuturisticValidate(C, Item)
*/

var FuturisticAccessDeniedMessage = "";

var FuturisticAccessCollarGroups = ["ItemNeck", "ItemNeckAccessories", "ItemEars", "ItemHead", "ItemHood", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemDevices"];
var FuturisticAccessArmGroups = ["ItemArms", "ItemHands"];
var FuturisticAccessLegGroups = ["ItemLegs", "ItemFeet", "ItemBoots"];
var FuturisticAccessChastityGroups = ["ItemPelvis", "ItemTorso", "ItemButt", "ItemVulva", "ItemVulvaPiercings", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"];

/**
 * Helper function for the futuristic hook scripts.
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {() => void} DeniedFunction - The function that is called when validation fails.
 * @returns {boolean} - Whether the validation was successful or not.
 */
function FuturisticAccess(OriginalFunction, DeniedFunction) {
	var C = CharacterGetCurrent();
	if (InventoryItemFuturisticValidate(C) !== "") {
		DeniedFunction();
		return false;
	} else {
		if (OriginalFunction != null) {
			OriginalFunction();
		}
		return true;
	}
}

/**
 * Hook script for injecting futuristic features into an archetypical item
 * @param {null | ExtendedItemData<any>} Data - The extended item data (if any)
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @returns {boolean} - Whether the validation was successful or not.
 */
function FuturisticAccessLoad(Data=null, OriginalFunction=null) {
	return FuturisticAccess(OriginalFunction, InventoryItemFuturisticLoadAccessDenied);
}

/**
 * Hook script for injecting futuristic features into an archetypical item
 * @param {null | ExtendedItemData<any>} Data - The extended item data (if any)
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @returns {boolean} - Whether the validation was successful or not.
 */
function FuturisticAccessClick(Data=null, OriginalFunction=null) {
	return FuturisticAccess(OriginalFunction, InventoryItemFuturisticClickAccessDenied);
}

/**
 * Hook script for injecting futuristic features into an archetypical item
 * @param {null | ExtendedItemData<any>} Data - The extended item data (if any)
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @returns {boolean} - Whether the validation was successful or not.
 */
function FuturisticAccessDraw(Data=null, OriginalFunction=null) {
	return FuturisticAccess(OriginalFunction, InventoryItemFuturisticDrawAccessDenied);
}

/**
 * Hook script for injecting futuristic features into an archetypical item
 * @returns {void} - Nothing
 */
function FuturisticAccessExit() {
	ElementRemove("PasswordField");
	FuturisticAccessDeniedMessage = "";
}

/**
 * Hook script for injecting futuristic features into a typed or modular item
 * @type {ExtendedItemScriptHookCallbacks.Validate<ExtendedItemData<any>, any>}
 */
function FuturisticAccessValidate(Data, OriginalFunction, C, Item, Option, CurrentOption) {
	let futureString = InventoryItemFuturisticValidate(C, Item, CurrentOption.ChangeWhenLocked);
	if (futureString) return futureString;
	else return OriginalFunction(C, Item, Option, CurrentOption);
}

// Load the futuristic item ACCESS DENIED screen
function InventoryItemFuturisticLoadAccessDenied() {
	ElementCreateInput("PasswordField", "text", "", "12");
	if (!FuturisticAccessDeniedMessage)
		FuturisticAccessDeniedMessage = "";
}

// Draw the futuristic item ACCESS DENIED screen
function InventoryItemFuturisticDrawAccessDenied() {
	ExtendedItemDrawHeader(1387, 225);

	DrawText(DialogFindPlayer("FuturisticItemLoginScreen"), 1500, 600, "White", "Gray");

	ElementPosition("PasswordField", 1505, 750, 350);
	DrawText(DialogFindPlayer("FuturisticItemPassword"), 1500, 700, "White", "Gray");
	DrawButton(1400, 800, 200, 64, DialogFindPlayer("FuturisticItemLogIn"), "White", "");

	if (FuturisticAccessDeniedMessage && FuturisticAccessDeniedMessage != "") DrawText(FuturisticAccessDeniedMessage, 1500, 963, "Red", "Black");

}

// Click the futuristic item ACCESS DENIED screen
function InventoryItemFuturisticClickAccessDenied() {
	if (MouseIn(1885, 25, 90, 90)) DialogLeaveFocusItem();

	if (MouseIn(1400, 800, 200, 64)) {
		const pw = ElementValue("PasswordField").toUpperCase();
		const C = CharacterGetCurrent();
		if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy == "PasswordPadlock" && pw == DialogFocusItem.Property.Password) {
			CommonPadlockUnlock(C, DialogFocusItem);
			DialogLeaveFocusItem();
		} else if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy == "TimerPasswordPadlock" && pw == DialogFocusItem.Property.Password) {
			CommonPadlockUnlock(C, DialogFocusItem);
			DialogLeaveFocusItem();
		} else if (DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.LockedBy == "CombinationPadlock" && pw == DialogFocusItem.Property.CombinationNumber) {
			CommonPadlockUnlock(C, DialogFocusItem);
			DialogLeaveFocusItem();
		} else {
			FuturisticAccessDeniedMessage = DialogFindPlayer("CantChangeWhileLockedFuturistic");
			AudioPlayInstantSound("Audio/AccessDenied.mp3");
			if (CurrentScreen == "ChatRoom") {
				InventoryItemFuturisticPublishAccessDenied(CharacterGetCurrent());
			}
		}
	}
}

/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option
 * @param {Item} Item - The equipped item
 * @param {boolean} changeWhenLocked - See {@link ExtendedItemOption.ChangeWhenLocked}
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemFuturisticValidate(C, Item = DialogFocusItem, changeWhenLocked=false) {
	var Allowed = "";

	if (Item && Item.Property && Item.Property.LockedBy && !DialogCanUnlock(C, Item) && !changeWhenLocked) {
		var collar = InventoryGet(C, "ItemNeck");
		if (!collar || (!collar.Property ||
			(FuturisticAccessCollarGroups.includes(Item.Asset.Group.Name) && collar.Property.OpenPermission != true) ||
			(FuturisticAccessArmGroups.includes(Item.Asset.Group.Name) && collar.Property.OpenPermissionArm != true) ||
			(FuturisticAccessLegGroups.includes(Item.Asset.Group.Name) && collar.Property.OpenPermissionLeg != true) ||
			(FuturisticAccessChastityGroups.includes(Item.Asset.Group.Name) && collar.Property.OpenPermissionChastity != true))) {
			Allowed = DialogExtendedMessage = DialogFindPlayer("CantChangeWhileLockedFuturistic");
		}
	}

	return Allowed;
}

/**
 * Publish a chat message for denied access.
 *
 * @param {Character} C - The character that got denied access.
 */
function InventoryItemFuturisticPublishAccessDenied(C) {
	const Dictionary = new DictionaryBuilder()
		.sourceCharacter(Player)
		.destinationCharacter(C)
		.focusGroup(C.FocusGroup.Name)
		.build();
	ChatRoomPublishCustomAction("FuturisticItemLoginLoginAttempt", true, Dictionary);
}
