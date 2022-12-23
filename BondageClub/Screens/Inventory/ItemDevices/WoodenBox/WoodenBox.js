"use strict";

const InventoryItemDevicesWoodenBoxMaxLength = 20;
const InventoryItemDevicesWoodenBoxTextInputId = "InventoryItemDevicesWoodenBoxText";
const InventoryItemDevicesWoodenBoxFont = "'Saira Stencil One', 'Arial', sans-serif";

let InventoryItemDevicesWoodenBoxOriginalText = null;

/**
 * Loads the wooden box's extended item properties
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxLoad(OriginalFunction) {
	PropertyOpacityLoad(OriginalFunction);
	DynamicDrawLoadFont(InventoryItemDevicesWoodenBoxFont);

	const C = CharacterGetCurrent();
	const Property = DialogFocusItem.Property;

	if (InventoryItemDevicesWoodenBoxOriginalText == null) {
		InventoryItemDevicesWoodenBoxOriginalText = Property.Text;
	}

	const textInput = ElementCreateInput(
		InventoryItemDevicesWoodenBoxTextInputId,
		"text", Property.Text, InventoryItemDevicesWoodenBoxMaxLength.toString(),
	);
	if (textInput) {
		textInput.pattern = DynamicDrawTextInputPattern;
		textInput.addEventListener("input", (e) => InventoryItemDevicesWoodenBoxTextChange(C, DialogFocusItem, e.target.value));
	}
}

/**
 * Draw handler for the wooden box's extended item screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxDraw(OriginalFunction) {
	PropertyOpacityDraw(OriginalFunction);
	const Data = TypedItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFindPlayer(`${Data.dialog.typePrefix}TextLabel`), 1375, 850, 400, "#fff", "#000");
	ElementPosition(InventoryItemDevicesWoodenBoxTextInputId, 1625, 850, 400);
	MainCanvas.textAlign = "center";
}

/**
 * Exits the wooden box's extended item screen, sends a chatroom message if appropriate, and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxExit() {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;

	// Apply extra opacity-specific effects
	InventoryItemDevicesWoodenBoxSetOpacity();

	const text = InventoryItemDevicesWoodenBoxGetText();
	if (DynamicDrawTextRegex.test(text)) item.Property.Text = text;

	if (CurrentScreen === "ChatRoom" && text !== InventoryItemDevicesWoodenBoxOriginalText) {
		const Data = TypedItemDataLookup[DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name];
		const dictionary = [
			{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: CharacterNickname(C), MemberNumber: C.MemberNumber },
			{ Tag: "NewText", Text: text },
			{ Tag: "AssetName", AssetName: item.Asset.Name },
		];
		const msg = text === "" ? `${Data.dialog.chatPrefix}TextRemove` : `${Data.dialog.chatPrefix}TextChange`;
		ChatRoomPublishCustomAction(msg, false, dictionary);
	}

	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);

	ElementRemove(PropertyGetID("Opacity"));
	ElementRemove(InventoryItemDevicesWoodenBoxTextInputId);
	InventoryItemDevicesWoodenBoxOriginalText = null;
}

/**
 * Sets the opacity of the wooden box based, and applies effects based on its opacity value
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxSetOpacity() {
	PropertyOpacityExit(false);
	const Property = DialogFocusItem.Property;
	const Transparent = Property.Opacity < 0.15;
	const ExtraEffects = ["BlindNormal", "GagLight"];
	if (Transparent) {
		Property.Effect = Property.Effect.filter((e) => !ExtraEffects.includes(e))
	} else {
		Property.Effect = CommonArrayConcatDedupe(Property.Effect, ExtraEffects);
	}
}

/**
 * Handles wooden box text changes. Refreshes the character locally
 * @returns {void} - Nothing
 */
const InventoryItemDevicesWoodenBoxTextChange = CommonLimitFunction((C, item, text) => {
	item = DialogFocusItem || item;
	if (DynamicDrawTextRegex.test(text)) {
		item.Property.Text = text.substring(0, InventoryItemDevicesWoodenBoxMaxLength);
		CharacterLoadCanvas(C);
	}
});

/**
 * Fetches the current text input value, trimmed appropriately
 * @returns {string} - The text in the wooden box's text input element
 */
function InventoryItemDevicesWoodenBoxGetText() {
	return ElementValue(InventoryItemDevicesWoodenBoxTextInputId).substring(0, InventoryItemDevicesWoodenBoxMaxLength);
}

/**
 * Dynamic AfterDraw function. Draws text onto the box.
 * @type {DynamicAfterDrawCallback}
 */
function AssetsItemDevicesWoodenBoxAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	if (L === "_Text") {
		const height = 900;
		const width = 310;
		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, InventoryItemDevicesWoodenBoxMaxLength);

		let from;
		let to;
		if (Property && Property.Type === "NWSE") {
			from = [0, 0];
			to = [width, height];
		} else {
			from = [0, height];
			to = [width, 0];
		}

		const { r, g, b } = DrawHexToRGB(Color);
		DynamicDrawTextFromTo(text, ctx, from, to, {
			fontSize: 96,
			fontFamily: InventoryItemDevicesWoodenBoxFont,
			color: `rgba(${r}, ${g}, ${b}, ${0.7 * Opacity})`,
		});

		// We print the canvas on the character based on the asset position
		drawCanvas(tmpCanvas, X + 90, Y + 300, AlphaMasks);
		drawCanvasBlink(tmpCanvas, X + 90, Y + 300, AlphaMasks);
	}
}
