"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemPelvisObedienceBelte0Load() {
	PropertyTextLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemPelvisObedienceBelte0Draw() {
	// Draw the header and item
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	PropertyTextDraw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemPelvisObedienceBelte0Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemPelvisObedienceBelte0Exit();
		return;
	}
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemPelvisObedienceBelte0Exit() {
	PropertyTextExit(null, null, true, "ObedienceBeltEngravingUpdated", "ObedienceBeltEngravingErased");
	ExtendedItemSubscreen = null;
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemPelvisObedienceBelts1Load() {
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemPelvisObedienceBelts1Draw() {
	// Draw the header and item
	ExtendedItemDrawHeader(1387, 125);

	MainCanvas.textAlign = "left";
	DrawCheckbox(1100, 590, 64, 64, DialogFindPlayer("ObedienceBeltShowChatMessage"), DialogFocusItem.Property.ShowText, false, "White");
	DrawCheckbox(1100, 660, 64, 64, DialogFindPlayer("ObedienceBeltPunishOrgasm"), DialogFocusItem.Property.PunishOrgasm, false, "White");
	DrawCheckbox(1100, 730, 64, 64, DialogFindPlayer("ObedienceBeltPunishStandup"), DialogFocusItem.Property.PunishStandup, false, "White");

	MainCanvas.textAlign = "center";
	DrawButton(1387, 800, 225, 55, DialogFindPlayer("TriggerShock"), "White");
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemPelvisObedienceBelts1Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemPelvisObedienceBelts1Exit();
		return;
	}

	const C = CharacterGetCurrent();
	if (MouseIn(1100, 590, 64, 64)) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
		return;
	}

	if (MouseIn(1100, 660, 64, 64)) {
		DialogFocusItem.Property.PunishOrgasm = !DialogFocusItem.Property.PunishOrgasm;
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
		return;
	}

	if (MouseIn(1100, 730, 64, 64)) {
		DialogFocusItem.Property.PunishStandup = !DialogFocusItem.Property.PunishStandup;
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
		return;
	}

	if (MouseIn(1387, 800, 225, 55)) {
		PropertyShockPublishAction();
		return;
	}
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemPelvisObedienceBelts1Exit() {
	ExtendedItemSubscreen = null;
}

/**
 * @param {Item} Item
 */
function InventoryObedienceBeltCheckPunish(Item) {
	const { Type, PunishOrgasm, PunishStandup } = Item.Property;
	const wearsShockModule = Type.includes("s1");
	if (Item.Property.NextShockTime - CurrentTime <= 0 && PunishOrgasm && wearsShockModule && Player.ArousalSettings && Player.ArousalSettings.OrgasmStage > 1) {
		// Punish the player if they orgasm
		Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownOrgasm; // Difficult to have two orgasms in 10 seconds
		return "Orgasm";
	} else if (PunishStandup && wearsShockModule && FuturisticTrainingBeltStandUpFlag) {
		// Punish the player if they stand up
		FuturisticTrainingBeltStandUpFlag = false;
		return "StandUp";
	}
	return "";
}

/**
 * @param {DynamicScriptCallbackData<ObedienceBeltPersistentData>} data
 * @param {number} LastTime
 */
function AssetsItemPelvisObedienceBeltUpdate(data, LastTime) {
	let Item = data.Item;
	let C = data.C;

	if (!Item.Property) return;

	let punishment = InventoryObedienceBeltCheckPunish(Item);
	switch (punishment) {
		case "Orgasm":
			PropertyShockPublishAction(C, Item, true);
			break;
		case "StandUp":
			PropertyShockPublishAction(C, Item, true);
			CharacterSetActivePose(Player, "Kneel");
			ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
			break;
	}
}

/**
 * @typedef {{ UpdateTime?: number, LastMessageLen?: number, CheckTime?: number }} ObedienceBeltPersistentData
 */

/** @type {ExtendedItemCallbacks.ScriptDraw<ObedienceBeltPersistentData>} */
function AssetsItemPelvisObedienceBeltScriptDraw(data) {
	const persistentData = data.PersistentData();
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
	if (typeof persistentData.CheckTime !== "number") persistentData.CheckTime = 0;

	if (!data.Item.Property) data.Item.Property = {};
	if (typeof data.Item.Property.NextShockTime !== "number") data.Item.Property.NextShockTime = 0;
	if (typeof data.Item.Property.Type !== "string") data.Item.Property.Type = "";

	// Trigger a check if a new message is detected
	let lastMsgIndex = ChatRoomChatLog.length - 1;
	if (lastMsgIndex >= 0 && ChatRoomChatLog[lastMsgIndex].Time > persistentData.CheckTime)
		persistentData.UpdateTime = Math.min(persistentData.UpdateTime, CommonTime() + 200); // Trigger if the user speaks

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {

		if (CommonTime() > data.Item.Property.NextShockTime) {
			AssetsItemPelvisObedienceBeltUpdate(data, persistentData.CheckTime);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		// Set CheckTime to last processed chat message time
		persistentData.CheckTime = (lastMsgIndex >= 0 ? ChatRoomChatLog[lastMsgIndex].Time : 0);
	}
}

/** @type {ExtendedItemCallbacks.AfterDraw<ObedienceBeltPersistentData>} */
function AssetsItemPelvisObedienceBeltAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L !== "_Text") return;

	// Fetch the text property and assert that it matches the character
	// and length requirements
	let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
	text = text.substring(0, A.TextMaxLength.Text);

	// Prepare a temporary canvas to draw the text to
	const height = 60;
	const width = 130;
	const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
	const ctx = tempCanvas.getContext("2d");

	DynamicDrawTextArc(text, ctx, width / 2, 42, {
		fontSize: 28,
		fontFamily: A.TextFont,
		width,
		color: Color,
		angle: Math.PI,
		direction: DynamicDrawTextDirection.ANTICLOCKWISE,
		textCurve: DynamicDrawTextCurve.SMILEY,
		radius: 300,
	});

	// Draw the temporary canvas onto the main canvas
	drawCanvas(tempCanvas, X + 59, Y + 29, AlphaMasks);
	drawCanvasBlink(tempCanvas, X + 59, Y + 29, AlphaMasks);
}
