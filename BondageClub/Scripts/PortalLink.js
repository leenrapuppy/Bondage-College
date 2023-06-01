"use strict";

/**
 * This file contains everything needed to add remote-style functions
 * (a.k.a PortalLink compatibility) to an asset, both as a transmitter
 * or a reciever item.
 * For transmitters, you'll need to call the following {@link ExtendedItemCallbacks}
 * callbacks:
 * - {@link PortalLinkTransmitterInit}
 * - {@link PortalLinkTransmitterLoad}
 * - {@link PortalLinkTransmitterDraw}
 * - {@link PortalLinkTransmitterExit}
 *
 * Recievers have their own set of matching functions:
 * - {@link PortalLinkRecieverInit}
 * - {@link PortalLinkRecieverLoad}
 * - {@link PortalLinkRecieverDraw}
 * - {@link PortalLinkRecieverExit}
 *
 * That should be enough to give your asset the basic "sync code" UI handling,
 * a reciever will only be detected if it supports at least one function (see below).
 *
 * ## PortalLink functions
 *
 * They are handled by a set of attributes, which the reciever needs to add to its
 * {@link AssetDefinition.Attribute} to declare it supports it. The transmitter will
 * detect those (via {@link PortalLinkGetFunctions}) and use them in its UI.
 *
 * Currently supported PortalLink functions (and their required attributes) are:
 *
 * - `PortalLinkFunctionLock` and `PortalLinkFunctionUnlock`:
 * Those two functions are supported when the `PortalLinkLockable` attribute exists
 * on the reciever, and enable remote-locking.
 *
 * - `PortalLinkFunctionCycleChastity`:
 * Enabled when the `PortalLinkChastity${string}` attribute exists the reciever, and
 * allows the reciever's chastity state to be cycled;
 *
 * @note Right now only modular items are supported, and `${string}` in the attribute
 * is used to look up the module name ({@link ModularItemModuleBase.Name}) to cycle
 * on the reciever.
 *
 * - `PortalLinkFunctionActivity${ActivityName}`;
 * Enabled when the `PortalLinkActivity${ActivityName}` attribute exists on the reciever,
 * and allows the transmitter to perform the activity named `${ActivityName}` through
 * the transmitter. By default activities will happen on the group the reciever is in,
 * but you can use the `PortalLinkTarget${AssetGroupItemName}` to change the target.
 *
 * Since attributes are customizable at both the asset and option/module-level, you can
 * get pretty involved combinations working. See the PortalPanties and how cycling the
 * chastity changes the activity target for a good example.
 *
 * ## Low-level details
 *
 * The low-level protocol "exchange" itself is done in the following way:
 * function discovery is made with {@link PortalLinkGetFunctions}, {@link PortalLinkPublishMessage} is
 * called when a button is clicked from the transmitter UI on the senders' side, and its counterpart
 * {@link PortalLinkProcessMessage} is called when a PortalLink message is recieved on the target's side.
 * If you want to add more functions, those are the main three you should look at.
 */

/** Max length of sync codes */
const PortalLinkCodeLength = 8;
/** Regex string for what consitutes a valid sync code */
const PortalLinkCodeText = `[0-9a-f]{${PortalLinkCodeLength}}`;
/** Same thing but in regex form for quick .test and .match */
const PortalLinkCodeRegex = RegExp(PortalLinkCodeText);
/** The DOM ID for the sync code field */
const PortalLinkCodeInputID = "PortalLinkCode";

/**
 * Parameters for the button grid
 * @type {CommonGenerateGridParameters}
 */
const PortalLinkFunctionGrid = {
	x: 1100,
	y: 680,
	width: 875,
	height: 300,
	itemWidth: 200,
	itemHeight: 64,
};

//#region PortalLink reciever

/** @type {ExtendedItemCallbacks.Init} */
function PortalLinkRecieverInit(C, Item, Refresh) {
	const props = {
		PortalLinkCode: "",
	};
	return ExtendedItemInitNoArch(C, Item, props, Refresh);
}

/** @type {ExtendedItemCallbacks.Load} */
function PortalLinkRecieverLoad() {
	const item = DialogFocusItem;
	const code = item.Property.PortalLinkCode;
	const input = ElementCreateInput(PortalLinkCodeInputID, "text", code, PortalLinkCodeLength);
	if (input) {
		input.autocomplete = "off";
		input.pattern = PortalLinkCodeText;
		input.addEventListener("input", (event) =>  PortalLinkCodeChanged(Player, item, true));

	}
}

/** @type {ExtendedItemCallbacks.Draw} */
function PortalLinkRecieverDraw() {
	// Draw the header and item
	ExtendedItemDrawHeader(1387, 125);
	DrawText(DialogFindPlayer("PortalLinkScreenLabel"), 1500, 440, "white");

	PortalLinkSyncCodeInputDraw(true);
}

/** @type {ExtendedItemCallbacks.Click} */
function PortalLinkRecieverClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		DialogLeaveFocusItem();
		return;
	}

	PortalLinkSyncCodeInputClick(true);
}

function PortalLinkRecieverExit() {
	const C = CharacterGetCurrent();
	const Item = DialogFocusItem;
	const code = ElementValue(PortalLinkCodeInputID);
	if (code.trim().match(PortalLinkCodeRegex)) {
		Item.Property.PortalLinkCode = code;
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}

	ElementRemove(PortalLinkCodeInputID);
}

//#endregion

//#region PortalLink transmitter

/** @type {PortalLinkStatus} */
let PortalLinkTransmitterStatus = "PortalLinkInvalidCode";
/** @type {number | null} */
let PortalLinkTransmitterLastLinkCheck = null;

/** @type {ExtendedItemCallbacks.Init} */
function PortalLinkTransmitterInit(C, Item, Refresh) {
	const baselineProperties = {
		PortalLinkCode: "",
	};
	return ExtendedItemInitNoArch(C, Item, baselineProperties, Refresh);
}

/** @type {ExtendedItemCallbacks.Load} */
function PortalLinkTransmitterLoad() {
	const item = DialogFocusItem;
	const C = CharacterGetCurrent();

	const code = item.Property.PortalLinkCode;
	const assets = PortalLinkGetItemsWithCode(code);
	// Force-establish if the code matches, otherwise trigger a link refresh
	if (assets.length === 1) {
		PortalLinkTransmitterStatus = "PortalLinkEstablished";
		PortalLinkTransmitterLastLinkCheck = CurrentTime;
	} else {
		PortalLinkTransmitterCheckLinkStatus(C, true);
	}

	const input = ElementCreateInput(PortalLinkCodeInputID, "text", code, PortalLinkCodeLength);
	if (input) {
		input.autocomplete = "off";
		input.pattern = PortalLinkCodeText;
		input.addEventListener("input", (event) =>  PortalLinkCodeChanged(Player, item, false));
	}
}

/** @type {ExtendedItemCallbacks.Draw} */
function PortalLinkTransmitterDraw() {

	const C = CharacterGetCurrent();
	// Check the link status each frame
	PortalLinkTransmitterCheckLinkStatus(C);

	// Draw the header and item
	ExtendedItemDrawHeader(1387, 125);
	DrawText(DialogFindPlayer("PortalLinkScreenLabel"), 1500, 440, "white");

	PortalLinkSyncCodeInputDraw(false);

	// Display buttons only if the link is correct
	if (PortalLinkTransmitterStatus !== "PortalLinkEstablished") return;

	const linked = PortalLinkGetItemsWithCode(PortalLinkGetTransmitterCode(C));
	if (linked.length === 0) return;

	const [target, item] = linked[0];
	if (!target || !item) return;

	const functions = PortalLinkGetFunctions(item);

	if (functions.length <= 0) {
		DrawText(DialogFindPlayer("PortalLinkNoFunctionsLabel"), 1500, 640, "white");
		return;
	}

	DrawText(DialogFindPlayer("PortalLinkAvailableFunctionsLabel"), 1500, 640, "white");

	CommonGenerateGrid(functions, 0, PortalLinkFunctionGrid, (func, x, y, w, h) => {
		const bg = (MouseHovering(x, y, w, h) ? "cyan" : "white");
		const buttonLabel = DialogFindPlayer(func + "Label");
		DrawButton(x, y, w, h, buttonLabel, bg, null);
		return false;
	});
}

/** @type {ExtendedItemCallbacks.Click} */
function PortalLinkTransmitterClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		DialogLeaveFocusItem();
		return;
	}

	const C = CharacterGetCurrent();

	PortalLinkSyncCodeInputClick(false);

	// Click buttons only if the link is correct
	if (PortalLinkTransmitterStatus !== "PortalLinkEstablished") return;

	const linked = PortalLinkGetItemsWithCode(PortalLinkGetTransmitterCode(C));
	if (linked.length === 0) return;

	const [target, item] = linked[0];
	if (!target || !item) return;

	const functions = PortalLinkGetFunctions(item);

	if (functions.length <= 0) return;

	CommonGenerateGrid(functions, 0, PortalLinkFunctionGrid, (func, x, y, w, h) => {
		if (MouseIn(x, y, w, h)) {
			PortalLinkPublishMessage(target, item, func);
			return true;
		}
		return false;
	});
}

/** @type {ExtendedItemCallbacks.Exit} */
function PortalLinkTransmitterExit() {
	ElementRemove(PortalLinkCodeInputID);
}

//#endregion

//#region PortalLink helpers

/** @type {RectTuple} */
const PortalLinkRandomCodeButton = [1200, 550, 50, 50];
/** @type {RectTuple} */
const PortalLinkCopyCodeButton = [1258, 550, 50, 50];
/** @type {RectTuple} */
const PortalLinkPasteCodeButton = [1258, 550, 50, 50];

/** @type {Record<PortalLinkStatus, string>} */
const PortalLinkStatusColors = {
	"PortalLinkEstablished": "lime",
	"PortalLinkInvalidCode": "red",
	"PortalLinkClipboardError": "red",
	"PortalLinkValidCode": "lime",
	"PortalLinkTargetNotFound": "orange",
	"PortalLinkDuplicateCode": "orange",
	"PortalLinkSearching0": "yellow",
	"PortalLinkSearching1": "yellow",
	"PortalLinkSearching2": "yellow",
	"PortalLinkSearching3": "yellow",
};

/**
 * Draw the sync code UI depending on the mode.
 * Reciever has Random and Copy to clipboard buttons, transmitter has
 * Copy from clipboard and link status label.
 *
 * @param {boolean} reciever - Whether it's in reciever or transmitter mode
 */
function PortalLinkSyncCodeInputDraw(reciever) {
	MainCanvas.textAlign = "right";
	DrawText(DialogFindPlayer("PortalLinkSyncCodeLabel"), 1330, 520, "white");

	MainCanvas.textAlign = "center";
	ElementPosition(PortalLinkCodeInputID, 1480, 510, 264);

	const code = ElementValue(PortalLinkCodeInputID);

	if (reciever) {
		DrawButton(...PortalLinkRandomCodeButton, "", "white", "", "Generate random code");
		DrawImageEx("Icons/Random.png", PortalLinkRandomCodeButton[0], PortalLinkRandomCodeButton[1], { Width: PortalLinkRandomCodeButton[2], Height: PortalLinkRandomCodeButton[3], });
		DrawButton(...PortalLinkCopyCodeButton, "", "white", "", "Copy code to clipboard", !PortalLinkCodeRegex.test(code));
		DrawImageEx("Icons/Export.png", PortalLinkCopyCodeButton[0], PortalLinkCopyCodeButton[1], { Width: PortalLinkCopyCodeButton[2], Height: PortalLinkCopyCodeButton[3], });

		PortalLinkTransmitterStatus = PortalLinkCodeRegex.test(code) ? "PortalLinkValidCode" : "PortalLinkInvalidCode";

		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(PortalLinkTransmitterStatus), 1342, 580, PortalLinkStatusColors[PortalLinkTransmitterStatus]);

		MainCanvas.textAlign = "center";
	} else {
		DrawButton(...PortalLinkPasteCodeButton, "", "white", "", "Copy code from clipboard");
		DrawImageEx("Icons/Import.png", PortalLinkPasteCodeButton[0], PortalLinkPasteCodeButton[1], { Width: PortalLinkPasteCodeButton[2], Height: PortalLinkPasteCodeButton[3], });

		MainCanvas.textAlign = "left";
		DrawText(DialogFindPlayer(PortalLinkTransmitterStatus), 1342, 580, PortalLinkStatusColors[PortalLinkTransmitterStatus]);

		MainCanvas.textAlign = "center";
	}
}

function PortalLinkSyncCodeInputClick(reciever) {
	if (reciever) {
		if (MouseIn(...PortalLinkRandomCodeButton)) {
			let newCode = "";
			while (newCode.length < PortalLinkCodeLength) {
				newCode += CommonRandomItemFromList("", "0123456789abcdef".split(""));
			}
			ElementValue(PortalLinkCodeInputID, newCode);

			PortalLinkCodeChanged(Player, DialogFocusItem, reciever);
			return;
		}

		const code = ElementValue(PortalLinkCodeInputID);
		if (MouseIn(...PortalLinkCopyCodeButton) && code.length > 0) {
			navigator.clipboard
				.writeText(ElementValue(PortalLinkCodeInputID))
				.catch(err => {
					PortalLinkTransmitterStatus = "PortalLinkClipboardError";
					console.error("Clipboard write error: " + err);
				});

			return;
		}
	} else {
		if (MouseIn(...PortalLinkPasteCodeButton)) {
			navigator.clipboard.readText()
				.then(txt => {
					ElementValue(PortalLinkCodeInputID, txt);
					PortalLinkCodeChanged(Player, DialogFocusItem, reciever);
				})
				.catch(err => {
					PortalLinkTransmitterStatus = "PortalLinkClipboardError";
					console.error("Clipboard read error: " + err);
				});

			return;
		}
	}
}

/**
 * Input listener for changes to the sync code field
 * @param {Character} C - The character wearing the item
 * @param {Item} Item - The item being changed
 * @param {boolean} reciever - Whether the called is a reciever or not
 */
function PortalLinkCodeChanged(C, Item, reciever) {
	const target = /** @type {HTMLInputElement} */ (document.getElementById(PortalLinkCodeInputID));
	const linkCode = target.value.trim();

	// Save the code and check the link
	if (PortalLinkCodeRegex.test(linkCode)) {
		Item.Property.PortalLinkCode = linkCode;
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	} else {
		// Reset the code, without spamming update messages
		const update = Item.Property.PortalLinkCode !== "";
		Item.Property.PortalLinkCode = "";
		if (update)
			ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);
	}

	if (!reciever)
		PortalLinkTransmitterCheckLinkStatus(C, true);
}

/**
 * Get the transmitter sync code from a character
 * @param {Character} C
 */
function PortalLinkGetTransmitterCode(C) {
	const tablet = InventoryGet(C, "ItemHandheld");
	if (!tablet || tablet.Asset.Name !== "PortalTablet") return;

	return tablet.Property.PortalLinkCode;
}

/**
 * Get the list of all items that match a given sync code in the chatroom.
 * @param {string} linkCode
 * @returns {[Character, Item][]}
 */
function PortalLinkGetItemsWithCode(linkCode) {
	if (!PortalLinkCodeRegex.test(linkCode)) return [];

	/** @type {[Character, Item][]} */
	let assets = [];
	// For each target wearing PortalLink-compatible assets, filter out those assets into a tuple of [character, item]
	for (const char of ChatRoomCharacter) {
		/** @type {[Character, Item][]} */
		const found = char.Appearance.filter(item => {
			const supportsPortalLink = InventoryGetItemProperty(item, "Attribute").some(attr => attr.startsWith("PortalLink"));
			return (supportsPortalLink && InventoryGetItemProperty(item, "PortalLinkCode") === linkCode);
		}).map(item => [char, item]);

		if (found.length <= 0) continue;
		assets = assets.concat(found);
	}

	return assets;
}

/**
 * Checks the transmitter's link status with its reciever.
 * @param {Character} C - The character wearing the transmitter
 * @param {boolean} newLink - Whether it's a new link being setup
 */
function PortalLinkTransmitterCheckLinkStatus(C, newLink=false) {
	if (!C.IsPlayer()) return;

	const linkCode = PortalLinkGetTransmitterCode(C);
	if (!PortalLinkCodeRegex.test(linkCode)) {
		PortalLinkTransmitterStatus = "PortalLinkInvalidCode";
		return;
	}

	if (newLink || PortalLinkTransmitterLastLinkCheck === null) {
		// Start a random 1-5s delay for fake-searching
		PortalLinkTransmitterLastLinkCheck = CurrentTime + (Math.random() * 4000) + 1000;
		PortalLinkTransmitterStatus = `PortalLinkSearching0`;
		return;
	} else if (PortalLinkTransmitterStatus === "PortalLinkEstablished") {
		// We have established a link, bail out
		return;
	} else if (Math.abs(CurrentTime - PortalLinkTransmitterLastLinkCheck) > 8000) {
		// Force us out of a rogue timer. That will trigger a new search.
		PortalLinkTransmitterLastLinkCheck = null;
		return;
	} else if (CurrentTime <= PortalLinkTransmitterLastLinkCheck) {
		// Wait until the delay expires, animating the status
		let lastIdx = parseInt(PortalLinkTransmitterStatus.substring("PortalLinkSearching".length + 1));
		if (!CommonIsNumeric(lastIdx)) lastIdx = 0;
		const interval = Math.floor((PortalLinkTransmitterLastLinkCheck - CurrentTime) / 100);
		lastIdx = 3 - ((lastIdx + interval) % 4);

		PortalLinkTransmitterStatus = `PortalLinkSearching${lastIdx}`;
		return;
	}

	const assets = PortalLinkGetItemsWithCode(linkCode);

	if (assets.length === 0 && linkCode) {
		PortalLinkTransmitterStatus = "PortalLinkTargetNotFound";
		return;
	} else if (assets.length === 0) {
		PortalLinkTransmitterStatus = "PortalLinkInvalidCode";
		return;
	} else if (assets.length > 1) {
		PortalLinkTransmitterStatus = "PortalLinkDuplicateCode";
		return;
	}

	PortalLinkTransmitterStatus = "PortalLinkEstablished";
}

/**
 * Gathers the list of available functions for a given asset.
 * @param {Item} item
 */
function PortalLinkGetFunctions(item) {
	if (!item) return [];
	const attrs = InventoryGetItemProperty(item, "Attribute").filter(a => a.startsWith("PortalLink"));
	/** @type {PortalLinkFunction[]} */
	const features = [];
	for (const attr of attrs) {
		const locked = InventoryGetItemProperty(item, "Effect").includes("Lock");
		if (attr === "PortalLinkLockable") {
			features.push(locked ? "PortalLinkFunctionUnlock" : "PortalLinkFunctionLock");
		} else if (attr.startsWith("PortalLinkChastity")) {
			features.push("PortalLinkFunctionCycleChastity");
		} else if (attr.startsWith("PortalLinkActivity")) {
			const act = /** @type {ActivityName} */ (attr.substring("PortalLinkActivity".length));
			let attrTarget = attrs.find(a => a.startsWith("PortalLinkTarget"));
			if (!attrTarget) {
				console.warn("No target specified for PortalLinkActivity. Add PortalLinkTarget${groupName} to your assets' attributes");
				continue;
			}
			features.push(`PortalLinkFunctionActivity${act}`);
		}
	}
	return features;
}

/**
 * Broadcast an hidden ProcessLink message to the chatroom
 * @param {Character} target
 * @param {Item} item
 * @param {PortalLinkFunction} func
 */
function PortalLinkPublishMessage(target, item, func) {
	if (!target || !item || !func) return;

	const Dictionary = new DictionaryBuilder()
		.sourceCharacter(Player)
		.targetCharacterName(target)
		.asset(item.Asset)
		.build();

	ServerSend("ChatRoomChat", { Content: func, Type: "Hidden", Dictionary });

	DialogLeave();
}

/**
 *
 * @param {Item} item
 */
function PortalLinkCycleChastityModule(item) {
	const attr = InventoryGetItemProperty(item, "Attribute").find(a => a.startsWith("PortalLinkChastity"));
	if (!attr) return;
	const chastityTarget = attr.substring("PortalLinkChastity".length);
	if (!chastityTarget) {
		console.debug(`${item.Asset.Group.Name}:${item.Asset.Name}: missing target for PortalLinkChastity attribute`);
		return;
	}

	if (item.Asset.Archetype === "modular") {
		// FIXME: Bleh. I want a better ModularItemSetOptionByName~
		const modularData = ModularItemDataLookup[`${item.Asset.Group.Name}${item.Asset.Name}`];
		if (!modularData) return;

		const shield = modularData.modules.find(m => m.Name === chastityTarget);
		if (!shield) return;

		const shieldType = ModularItemDeconstructType(item.Property.Type).find(t => t.startsWith(shield.Key));
		if (!shieldType) return;

		const shieldIndex = parseInt(shieldType.substring(shield.Key.length));
		if (isNaN(shieldIndex)) return;

		const idx = (shieldIndex + 1) % shield.Options.length;

		ModularItemSetOptionByName(Player, item, ModularItemConstructType(modularData.modules, [0, idx]), true);
		ModularItemPublishAction(modularData, Player, item, shield.Options[idx], shield.Options[shieldIndex]);
	}
}

/**
 * The handler for processing the hidden PortalLink messages
 * @param {Character} sender
 * @param {IChatRoomMessage} data
 */
function PortalLinkProcessMessage(sender, data) {
	if (!CommonIsObject(sender) || !CommonIsObject(data)) return;

	const senderCode = PortalLinkGetTransmitterCode(sender);
	const tablet = InventoryGet(sender, "ItemHandheld");
	if (!tablet || tablet.Asset.Name !== "PortalTablet") return;

	const assetRef = /** @type {AssetReferenceDictionaryEntry} */ (data.Dictionary.find(e => IsAssetReferenceDictionaryEntry(e)));
	if (!assetRef) return;

	// Only proceed if our current item matches what was sent and its link code matches with the senders'
	const item = InventoryGet(Player, assetRef.GroupName);
	if (!item || item.Asset.Name !== assetRef.AssetName || item.Property.PortalLinkCode !== senderCode) return;

	// Use a special name reference because none of (Target|Destination)Character(Name)? cuts it, somehow
	const playerNameRef = sender.MemberNumber === Player.MemberNumber ? CharacterPronoun(Player, "Possessive", false) : `${CharacterNickname(Player)}${DialogFindPlayer("'s")}`;
	const builder = new DictionaryBuilder()
		.sourceCharacter(sender)
		.targetCharacter(Player)
		.text("RecieverCharacter", playerNameRef)
		.asset(item.Asset);

	const func = /** @type {PortalLinkFunction} */ (data.Content);
	if (func.startsWith("PortalLinkFunctionActivity")) {
		const actName = func.substring("PortalLinkFunctionActivity".length);
		const act = AssetGetActivity("Female3DCG", actName);
		if (!act) return;

		const attrTarget = InventoryGetItemProperty(item, "Attribute").find(attr => attr.startsWith("PortalLinkTarget"));
		if (!attrTarget) {
			console.warn("No target specified for PortalLinkActivity. Add PortalLinkTarget${groupName} to your assets' attributes");
			return;
		}
		const group = AssetGroupGet("Female3DCG", /** @type {AssetGroupName} */ (attrTarget.substring("PortalLinkTarget".length)));
		if (!group) return;
		ActivityRun(sender, Player, group, { Activity: act, Item: tablet }, false);

		builder.focusGroup(group.Name);
	} else {
		switch (func) {
			case "PortalLinkFunctionLock": {
				InventoryLock(Player, item, "PortalLinkPadlock", sender.MemberNumber);
			}
				break;

			case "PortalLinkFunctionUnlock": {
				InventoryUnlock(Player, item);
			}
				break;

			case "PortalLinkFunctionCycleChastity":
				PortalLinkCycleChastityModule(item);
				// We handled updating the appearance and sending the chat message, bail out.
				return;

			default:
				console.debug(`Unhandled ${func}, ignoring`);
				return;
		}
	}

	// If we get here then we successfully reacted to the requested function
	ChatRoomCharacterItemUpdate(Player, item.Asset.Group.Name);
	CharacterRefresh(Player, true);

	ChatRoomPublishCustomAction(data.Content, false, builder.build());
}

//#endregion
