"use strict";

/**
 * Loads the canvas hood's extended item properties
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodLoad() {
	const C = CharacterGetCurrent();
	let MustRefresh = false;

	/** @type {ItemProperties} */
	const Property = DialogFocusItem.Property = DialogFocusItem.Property || {};
	if (typeof Property.Text !== "string") {
		Property.Text = "";
		MustRefresh = true;
	}

	if (MustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}

	PropertyTextLoad();
}

/**
 * Draw handler for the canvas hood's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodDraw() {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	PropertyTextDraw();
}

/**
 * Click handler for the canvas hood's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		ExtendedItemExit();
	}
}

/**
 * Exits the canvas hood's extended item screen and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemHoodCanvasHoodExit() {
	PropertyTextExit();
}

/**
 * Post-render drawing function. Draws custom text in a slight arc to mimic the
 * curvature of the character's head.
 * @type {DynamicAfterDrawCallback}
 */
function AssetsItemHoodCanvasHoodAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color }) {
	if (L === "_Text") {
		// Fetch the text property and assert that it matches the character
		// and length requirements
		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, A.TextMaxLength.Text);

		// Prepare a temporary canvas to draw the text to
		const height = 50;
		const width = 120;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		DynamicDrawTextArc(text, ctx, width / 2, height / 2, {
			fontSize: 36,
			fontFamily: A.TextFont,
			width,
			color: Color,
		});

		const drawX = X + (200 - width) / 2;
		const drawY = Y + 80;

		// Draw the temporary canvas onto the main canvas
		drawCanvas(tempCanvas, drawX, drawY, AlphaMasks);
		drawCanvasBlink(tempCanvas, drawX, drawY, AlphaMasks);
	}
}
