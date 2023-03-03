"use strict";

/** @type {ExtendedItemInitCallback} */
function InventoryItemDevicesPetBowlInit(Item, C, Refresh) {
	ExtendedItemInitNoArch(Item, C, { Text: "" }, Refresh);
}

/**
 * Loads the extended item properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPetBowlLoad() {
	PropertyTextLoad();
}

/**
 * Draw handler for the extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPetBowlDraw() {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	PropertyTextDraw();
}

/**
 * Click handler for the extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPetBowlClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		return ExtendedItemExit();
	}
}

/**
 * Exits the extended item screen and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemDevicesPetBowlExit() {
	PropertyTextExit();
}

/**
 * Post-render drawing function. Draws custom text in a slight arc to mimic the
 * curvature of the bowl.
 * @type {DynamicAfterDrawCallback}
 */
function AssetsItemDevicesPetBowlAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color }) {
	if (L === "_Text") {
		// Fetch the text property and assert that it matches the character
		// and length requirements
		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, A.TextMaxLength.Text);

		// Prepare a temporary canvas to draw the text to
		const height = 60;
		const width = 130;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		// Reposition and orient the text when hanging upside-down
		if (C.IsInverted()) {
			ctx.rotate(Math.PI);
			ctx.translate(-tempCanvas.width, -tempCanvas.height);
			Y -= 60;
			X -= 300;
		}

		DynamicDrawTextArc(text, ctx, width / 2, 42, {
			fontSize: 36,
			fontFamily: A.TextFont,
			width,
			color: Color,
			angle: Math.PI,
			direction: DynamicDrawTextDirection.ANTICLOCKWISE,
			textCurve: DynamicDrawTextCurve.SMILEY,
			radius: 350,
		});

		// Draw the temporary canvas onto the main canvas
		drawCanvas(tempCanvas, X, Y, AlphaMasks);
		drawCanvasBlink(tempCanvas, X, Y, AlphaMasks);
	}
}
