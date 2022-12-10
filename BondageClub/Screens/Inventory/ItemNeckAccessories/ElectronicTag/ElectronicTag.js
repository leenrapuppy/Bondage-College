"use strict";

/** @type {ExtendedItemInitCallback} */
function InventoryItemNeckAccessoriesElectronicTagInit(Item, C, Refresh) {
	ExtendedItemInitNoArch(Item, C, { Text: "Tag" }, Refresh);
}

// Loads the item extension properties
function InventoryItemNeckAccessoriesElectronicTagLoad() {
	// Only create the inputs if the item isn't locked
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		PropertyTextLoad();
	}
}

// Draw the extension screen
function InventoryItemNeckAccessoriesElectronicTagDraw() {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		PropertyTextDraw();
	}
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesElectronicTagClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		ExtendedItemExit();
	}
}

// Leaves the extended screen
function InventoryItemNeckAccessoriesElectronicTagExit() {
	PropertyTextExit();
}

/** @type {DynamicAfterDrawCallback} */
function AssetsItemNeckAccessoriesElectronicTagAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L === "_Text") {
		// We set up a canvas
		const Height = 50;
		const Width = 45;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "Tag";
		text = text.substring(0, A.TextMaxLength.Text);

		/** @type {DynamicDrawOptions} */
		const drawOptions = {
			fontSize: 14,
			fontFamily: A.TextFont,
			color: Color,
			textAlign: "center",
			width: Width,
		};

		// We draw the desired info on that canvas
		const ctx = TempCanvas.getContext('2d');
		DynamicDrawText(text, ctx, Width / 2, Width / 2, drawOptions);

		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 228.5, Y + 30, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 228.5, Y + 30, AlphaMasks);
	}
}
