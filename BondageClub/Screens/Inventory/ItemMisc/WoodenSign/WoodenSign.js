"use strict";

/** @type {ExtendedItemInitCallback} */
function InventoryItemMiscWoodenSignInit(C, Item, Refresh=true) {
	return ExtendedItemInitNoArch(C, Item, { Text: "", Text2: "" }, Refresh);
}

// Loads the item extension properties
function InventoryItemMiscWoodenSignLoad() {
	PropertyTextLoad();
}

// Draw the extension screen
function InventoryItemMiscWoodenSignDraw() {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	PropertyTextDraw();
}

// Catches the item extension clicks
function InventoryItemMiscWoodenSignClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		ExtendedItemExit();
	}
}

// Leaves the extended screen
function InventoryItemMiscWoodenSignExit() {
	PropertyTextExit();
}

/** @type {DynamicAfterDrawCallback} */
function AssetsItemMiscWoodenSignAfterDraw({
	C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color
}) {
	if (L === "_Text") {
		// We set up a canvas
		const height = 200;
		const width = 155;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		// One line of text will be centered
		const MaxText1Length = A.TextMaxLength.Text;
		const MaxText2Length = A.TextMaxLength.Text2;
		const text1 = (Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text.substring(0, MaxText1Length) : "");
		const text2 = (Property && typeof Property.Text2 === "string" && DynamicDrawTextRegex.test(Property.Text2) ? Property.Text2.substring(0, MaxText2Length) : "");
		const isAlone = !text1 || !text2;

		const drawOptions = {
			fontSize: 30,
			fontFamily: A.TextFont,
			color: Color,
			effect: DynamicDrawTextEffect.BURN,
			width,
		};

		// Reposition and orient the text when hanging upside-down
		if (C.IsInverted()) {
			ctx.rotate(Math.PI);
			ctx.translate(-tempCanvas.width, -tempCanvas.height);
			Y -= 168;
		}

		DynamicDrawText(text1, ctx, width / 2, height / (isAlone ? 2 : 2.25), drawOptions);
		DynamicDrawText(text2, ctx, width / 2, height / (isAlone ? 2 : 1.75), drawOptions);

		// We print the canvas on the character based on the asset position
		drawCanvas(tempCanvas, X + 170, Y + 200, AlphaMasks);
		drawCanvasBlink(tempCanvas, X + 170, Y + 200, AlphaMasks);
	}
}
