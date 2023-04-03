"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemNeckAccessoriesCustomCollarTagTxt0Load() {
	PropertyTextLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemNeckAccessoriesCustomCollarTagTxt0Draw() {
	ExtendedItemDrawHeader(1387, 125);
	PropertyTextDraw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemNeckAccessoriesCustomCollarTagTxt0Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemNeckAccessoriesCustomCollarTagTxt0Exit();
	}
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemNeckAccessoriesCustomCollarTagTxt0Exit() {
	PropertyTextExit();
	ExtendedItemSubscreen = null;
}

/** @type {ExtendedItemCallbacks.AfterDraw} */
function AssetsItemNeckAccessoriesCustomCollarTagAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L === "_Text") {
		// Determine the canvas position and size
		const Properties = Property || {};
		const Type = Properties.Type || "t0";

		// We set up a canvas
		let Height = 50;
		let Width = 45;
		let YOffset = 30;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		if (Type.includes("t1")) {
			YOffset = 45;
		} else if (Type.includes("t3")) {
			YOffset = 32;
		} else if (Type.includes("t4")) {
			YOffset = 31;
		} else if (Type.includes("t5")) {
			YOffset = 31;
		}

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "Tag";
		text = text.substring(0, A.TextMaxLength.Text);

		/** @type {DynamicDrawOptions} */
		const drawOptions = {
			fontSize: 13,
			fontFamily: A.TextFont,
			color: Color,
			textAlign: "center",
			width: Width,
		};

		// We draw the desired info on that canvas
		const ctx = TempCanvas.getContext('2d');
		DynamicDrawText(text, ctx, Width / 2, Width / 2, drawOptions);

		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 227.5, Y + YOffset, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 227.5, Y + YOffset, AlphaMasks);
	}
}
