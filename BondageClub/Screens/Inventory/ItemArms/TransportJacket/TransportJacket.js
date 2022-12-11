"use strict";

/** @type {null | string} */
let InventoryItemArmsTransportJacketOriginalText = null;
const InventoryItemArmsTransportJacketInputId = "InventoryItemArmsTransportJacketTextField";
const InventoryItemArmsTransportJacketMaxLength = 14;
const InventoryItemArmsTransportJacketFont = "'Saira Stencil One', 'Arial', sans-serif";

/**
 * Loads the item's extended item properties
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @param {string} ID - The ID of the text input field; see {@link InventoryItemArmsTransportJacketInputId}
 * @returns {void} - Nothing
 */
function InventoryItemArmsTransportJacketLoad(OriginalFunction, ID=InventoryItemArmsTransportJacketInputId) {
	OriginalFunction();

	if (InventoryItemArmsTransportJacketOriginalText === null) {
		InventoryItemArmsTransportJacketOriginalText = DialogFocusItem.Property.Text;
	}

	const input = ElementCreateInput(
		ID, "text", DialogFocusItem.Property.Text,
		InventoryItemArmsTransportJacketMaxLength.toString(),
	);

	if (input) {
		const C = CharacterGetCurrent();
		input.pattern = DynamicDrawTextInputPattern;
		input.addEventListener("input", (e) => InventoryItemArmsTransportJacketTextChange(C, DialogFocusItem, e.target.value));
	}
}

/**
 * Draw handler for the item's extended item screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @param {string} ID - The ID of the text input field; see {@link InventoryItemArmsTransportJacketInputId}
 * @returns {void} - Nothing
 */
function InventoryItemArmsTransportJacketDraw(OriginalFunction, ID=InventoryItemArmsTransportJacketInputId) {
	OriginalFunction();
	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TYPED);
	if (Data == null) {
		return;
	}
	const Prefix = Data.dialog.typePrefix;

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFindPlayer(`${Prefix}TextLabel`), 1475, 860, 400, "#fff", "#000");
	ElementPosition(ID, 1725, 860, 400);
	MainCanvas.textAlign = "center";
}

/**
 * Throttled callback for text input field changes
 * @param {Character} C - The character being modified
 * @param {Item} item - The item being modified
 * @param {string} Text - The custom text
 * @returns {void} - Nothing
 */
const InventoryItemArmsTransportJacketTextChange = CommonLimitFunction((C, item, text) => {
	if (DynamicDrawTextRegex.test(text)) {
		item.Property.Text = text.substring(0, InventoryItemArmsTransportJacketMaxLength);
		CharacterLoadCanvas(C);
	}
});

/**
 * Exit handler for the item's extended item screen
 * @param {string} ID - The ID of the text input field; see {@link InventoryItemArmsTransportJacketInputId}
 * @returns {void} - Nothing
 */
function InventoryItemArmsTransportJacketExit(ID=InventoryItemArmsTransportJacketInputId) {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;
	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TYPED);
	const Prefix = (Data == null) ? "" : TypedItemCustomChatPrefix("Text", Data);

	// Check if the text has changed and whether it's a valid string or not
	const text = ElementValue(ID).substring(0, InventoryItemArmsTransportJacketMaxLength);
	if (!DynamicDrawTextRegex.test(text) || text === InventoryItemArmsTransportJacketOriginalText) {
		item.Property.Text = InventoryItemArmsTransportJacketOriginalText || "";
		ElementRemove(ID);
		InventoryItemArmsTransportJacketOriginalText = null;
		return;
	}

	// Publish an action for the changed text
	const dictionary = [
		{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacterName", Text: CharacterNickname(C), MemberNumber: C.MemberNumber },
		{ Tag: "NewText", Text: text },
		{ Tag: "AssetName", AssetName: item.Asset.Name },
	];
	const ActionTag = text === "" ? `${Prefix}TextRemove` : `${Prefix}TextChange`;
	ChatRoomPublishCustomAction(ActionTag, false, dictionary);

	// Refresh the character/item and remove the text input field
	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);
	ElementRemove(ID);
	InventoryItemArmsTransportJacketOriginalText = null;
}

/** @type {DynamicAfterDrawCallback} */
function AssetsItemArmsTransportJacketAfterDraw({ C, A, X, Y, L, Pose, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color }) {
	if (L === "_Text") {
		const width = 150;
		const height = 60;
		const flatCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const flatCtx = flatCanvas.getContext("2d");

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, InventoryItemArmsTransportJacketMaxLength);

		DynamicDrawText(text, flatCtx, width / 2, height / 2, {
			fontSize: 40,
			fontFamily: InventoryItemArmsTransportJacketFont,
			color: Color,
			width,
		});

		const interpolatedCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const interpolatedCtx = interpolatedCanvas.getContext("2d");

		const xTop = width * 0.15;
		for (let i = 0; i < height; i++) {
			const xStart = xTop - (xTop * i) / height;
			interpolatedCtx.drawImage(flatCanvas, 0, i, width, 1, xStart, i, width - xStart * 2, 1);
		}

		const drawX = X + (300 - width) / 2;
		const drawY = Y + 75;
		drawCanvas(interpolatedCanvas, drawX, drawY, AlphaMasks);
		drawCanvasBlink(interpolatedCanvas, drawX, drawY, AlphaMasks);
	}
}
