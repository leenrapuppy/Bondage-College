"use strict";

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemDevicesDollBoxInit(C, Item, Refresh) {
	return ExtendedItemInitNoArch(C, Item, { Text: "", Text2: "" }, Refresh);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemDevicesDollBoxLoad() {
	PropertyTextLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemDevicesDollBoxDraw() {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	PropertyTextDraw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemDevicesDollBoxClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		ExtendedItemExit();
	}
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemDevicesDollBoxExit() {
	PropertyTextExit();
}

/** @type {ExtendedItemCallbacks.AfterDraw} */
function AssetsItemDevicesDollBoxAfterDraw({C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color}) {
	if (L === "_Text") {
		// We set up a canvas
		const height = 200;
		const width = 400;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		// One line of text will be centered
		const MaxText1Length = A.TextMaxLength.Text;
		const MaxText2Length = A.TextMaxLength.Text2;
		const text1 = (Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text.substring(0, MaxText1Length) : "");
		const text2 = (Property && typeof Property.Text2 === "string" && DynamicDrawTextRegex.test(Property.Text2) ? Property.Text2.substring(0, MaxText2Length) : "");
		const isAlone = !text1 || !text2;

		const drawOptions = {
			fontSize: 40,
			fontFamily: A.TextFont,
			color: Color,
			effect: DynamicDrawTextEffect.BURN,
			width,
		};

		DynamicDrawText(text1, ctx, width / 2, height / (isAlone ? 2.4 : 3.5), drawOptions);
		DynamicDrawText(text2, ctx, width / 2, height / (isAlone ? 2.4 : 1.85), drawOptions);

		// We print the canvas on the character based on the asset position
		drawCanvas(tempCanvas, X + 55, Y + 847, AlphaMasks);
		drawCanvasBlink(tempCanvas, X + 55, Y + 847, AlphaMasks);
	}
}
