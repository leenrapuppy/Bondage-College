"use strict";
let CombinationPadlockPlayerIsBlind = false;
let CombinationPadlockBlindCombinationOffset = null;
let CombinationPadlockCombinationLastValue = "";
let CombinationPadlockNewCombinationLastValue = "";
let CombinationPadlockLoaded = false;

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemMiscCombinationPadlockInit(C, Item) {
	return ExtendedItemInitNoArch(C, Item, { CombinationNumber: "0000" }, false);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscCombinationPadlockLoad() {
	CombinationPadlockPlayerIsBlind = Player.IsBlind();
	// Only update on initial load, not update loads
	if (!CombinationPadlockLoaded) {
		CombinationPadlockCombinationLastValue = "";
		CombinationPadlockNewCombinationLastValue = "";
	}
	if (CombinationPadlockPlayerIsBlind) {
		if (CombinationPadlockBlindCombinationOffset == null) {
			CombinationPadlockBlindCombinationOffset = Math.floor(Math.random() * 10);
		}
	} else {
		CombinationPadlockBlindCombinationOffset = null;
	}

	var C = CharacterGetCurrent();

	// Only create the inputs if the zone isn't blocked
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		const combinationInput = ElementCreateInput("CombinationNumber", "text", "", "4");
		const newCombinationInput = ElementCreateInput("NewCombinationNumber", "text", "", "4");
		if (combinationInput) {
			combinationInput.autocomplete = "off";
			combinationInput.pattern = "\\d*";
			combinationInput.type = CombinationPadlockPlayerIsBlind ? "password" : "text";
			combinationInput.addEventListener("input", InventoryItemMiscCombinationPadlockModifyInput);
			// the current code is shown for owners, lovers and the member whose number is on the padlock
			if (
				Player.MemberNumber === DialogFocusSourceItem.Property.LockMemberNumber ||
				C.IsOwnedByPlayer() ||
				C.IsLoverOfPlayer()
			) {
				combinationInput.setAttribute("placeholder", DialogFocusSourceItem.Property.CombinationNumber);
			}
		} else {
			/** @type {HTMLInputElement} */(document.getElementById('CombinationNumber')).type = CombinationPadlockPlayerIsBlind ? "password" : "text";
		}
		if (newCombinationInput) {
			newCombinationInput.autocomplete = "off";
			newCombinationInput.pattern = "\\d*";
			newCombinationInput.type = CombinationPadlockPlayerIsBlind ? "password" : "text";
			newCombinationInput.addEventListener("input", InventoryItemMiscCombinationPadlockModifyInput);
		} else {
			/** @type {HTMLInputElement} */(document.getElementById('NewCombinationNumber')).type = CombinationPadlockPlayerIsBlind ? "password" : "text";
		}
	}
	CombinationPadlockLoaded = true;
}

function InventoryItemMiscCombinationPadlockModifyInput(e) {
	const clumsiness = Player.GetClumsiness();

	// If the player is either blind or impaired by restraints, modify the input accordingly
	if (CombinationPadlockPlayerIsBlind || clumsiness > 0) {
		const previousValue = CombinationPadlockCombinationLastValue;
		const newValue = e.target.value;
		let prefix = "";
		let suffix = "";
		for (let i = 0; i < previousValue.length && previousValue[i] === newValue[i]; i++) {
			prefix += newValue[i];
		}
		const previousAppendReverse = previousValue.substring(prefix.length).split("").reverse().join("");
		const newAppendReverse = newValue.substring(prefix.length).split("").reverse().join("");
		for (let i = 0; i < previousAppendReverse.length && previousAppendReverse[i] === newAppendReverse[i]; i++) {
			suffix = newAppendReverse[i] + suffix;
		}
		let inserted = newValue.substring(prefix.length, newValue.length - suffix.length);

		inserted = inserted.replace(/\d/g, (digit) => {
			let offset = CombinationPadlockBlindCombinationOffset || 0;
			if (clumsiness > 0) offset += (Math.floor(Math.random() * 2 * clumsiness) - clumsiness);
			if (offset < 0) offset += 10;
			return String((Number(digit) + offset) % 10);
		});

		e.target.value = prefix + inserted + suffix;
	}

	CombinationPadlockCombinationLastValue = e.target.value;
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscCombinationPadlockDraw() {
	var C = CharacterGetCurrent();
	DrawAssetPreview(1387, 25, DialogFocusItem.Asset);

	const playerBlind = Player.IsBlind();
	if (playerBlind !== CombinationPadlockPlayerIsBlind) {
		InventoryItemMiscCombinationPadlockLoad();
	}

	DrawText(
		DialogFindPlayer(DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Intro"), 1500, 400, "white",
		"gray",
	);
	const Property = DialogFocusSourceItem && DialogFocusSourceItem.Property;
	let LockMemberNumber;
	if (playerBlind) LockMemberNumber = "?";
	else LockMemberNumber = Property && Property.LockMemberNumber && Property.LockMemberNumber.toString();
	if (LockMemberNumber != null) {
		DrawText(DialogFindPlayer("LockMemberNumber") + " " + LockMemberNumber, 1500, 500, "white", "gray");
	}

	const additionalInfo = [];
	if (playerBlind) additionalInfo.push("ControlsBlind");
	if (Player.GetClumsiness() > 0) additionalInfo.push("ControlsClumsy");

	additionalInfo.forEach((text, i) => {
		DrawTextWrap(DialogFindPlayer("CombinationPadlock" + text), 1000, 550 + i * 100, 1000, 100, "white");
	});

	if (InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		// If the zone is blocked, just display some text informing the player that they can't access the lock
		DrawText(DialogFindPlayer("LockZoneBlocked"), 1500, 800, "white", "gray");
	} else {
		// Otherwise, draw the combination inputs
		MainCanvas.textAlign = "right";
		DrawText(DialogFindPlayer("CombinationOld"), 1400, 803, "white", "gray");
		DrawText(DialogFindPlayer("CombinationNew"), 1400, 883, "white", "gray");
		MainCanvas.textAlign = "center";
		ElementPosition("CombinationNumber", 1500, 800, 125);
		ElementPosition("NewCombinationNumber", 1500, 880, 125);
		DrawButton(1600, 771, 350, 64, DialogFindPlayer("CombinationEnter"), "White", "");
		DrawButton(1600, 851, 350, 64, DialogFindPlayer("CombinationChange"), "White", "");
		if (DialogExtendedMessage != "") DrawText(DialogFindPlayer(DialogExtendedMessage), 1500, 963, "Red", "Black");
	}
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscCombinationPadlockClick() {
	var C = CharacterGetCurrent();

	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		DialogLeaveFocusItem();
	}

	// If the zone is blocked, cannot interact with the lock
	if (InventoryGroupIsBlocked(C, C.FocusGroup.Name)) return;

	// Opens the padlock
	if (MouseIn(1600, 771, 350, 64)) {
		if (ElementValue("CombinationNumber") == DialogFocusSourceItem.Property.CombinationNumber) {
			CommonPadlockUnlock(C, DialogFocusSourceItem);
			DialogLeaveFocusItem();
		}

		// Send fail message if online
		else if (CurrentScreen == "ChatRoom") {
			const Dictionary = new DictionaryBuilder()
				.sourceCharacter(Player)
				.destinationCharacter(C)
				.focusGroup(C.FocusGroup.Name)
				.text("CombinationNumber", ElementValue("CombinationNumber"))
				.build();
			ChatRoomPublishCustomAction("CombinationFail", true, Dictionary);
		} else { DialogExtendedMessage = "CombinationError"; }
	}
	// Changes the code
	else if (MouseIn(1600, 871, 350, 64)) {
		// Succeeds to change
		if (ElementValue("CombinationNumber") == DialogFocusSourceItem.Property.CombinationNumber) {
			var NewCode = ElementValue("NewCombinationNumber");
			// We only accept code made of digits and of 4 numbers
			if (ValidationCombinationNumberRegex.test(NewCode)) {
				DialogFocusSourceItem.Property.CombinationNumber = NewCode;
				for (let A = 0; A < C.Appearance.length; A++) {
					if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
						C.Appearance[A] = DialogFocusSourceItem;
				}
				if (CurrentScreen == "ChatRoom") {
					const Dictionary = new DictionaryBuilder()
						.sourceCharacter(Player)
						.destinationCharacter(C)
						.focusGroup(C.FocusGroup.Name)
						.build();
					ChatRoomPublishCustomAction("CombinationChangeSuccess", true, Dictionary);
				} else {
					DialogLeaveFocusItem();
				}
			} else { DialogExtendedMessage = "CombinationErrorInput"; }
		}
		// Fails to change
		else if (CurrentScreen == "ChatRoom") {
			const Dictionary = new DictionaryBuilder()
				.sourceCharacter(Player)
				.destinationCharacter(C)
				.focusGroup(C.FocusGroup.Name)
				.build();

			ChatRoomPublishCustomAction("CombinationChangeFail", true, Dictionary);
		} else { DialogExtendedMessage = "CombinationError"; }
	}
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemMiscCombinationPadlockExit() {
	CombinationPadlockLoaded = false;
	ElementRemove("CombinationNumber");
	ElementRemove("NewCombinationNumber");
}
