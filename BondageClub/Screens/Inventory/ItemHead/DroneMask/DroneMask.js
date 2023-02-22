"use strict";

function InventoryItemHeadDroneMaskPattern5Load() {
	PropertyTextLoad();
}

// Draw extension screen image
function InventoryItemHeadDroneMaskPattern5Draw() {
	ExtendedItemDrawHeader(1387, 125);
	PropertyTextDraw();
}

// Click function
function InventoryItemHeadDroneMaskPattern5Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemHeadDroneMaskPattern5Exit();
	}
}

// Revert text changes and exit subscreen
function InventoryItemHeadDroneMaskPattern5Exit() {
	PropertyTextExit();
	ExtendedItemSubscreen = null;
}

/** @type {DynamicAfterDrawCallback} */
function AssetsItemHeadDroneMaskAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color,
}) {
	if (L === "_Text"){
		const Properties = Property || {};
		const Type = Properties.Type || "p0";
		if (!Type.includes("p5")) return;

		// Canvas setup
		let Height = 65;
		let Width = 65;
		let XOffset = 67;
		let YOffset = 89;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, A.TextMaxLength.Text);
		const isAlone = !text;

		const drawOptions = {
			fontSize: 20,
			fontFamily: A.TextFont,
			color: Color,
			width: Width,
		};

		// Draw the text onto the canvas
		let ctx = TempCanvas.getContext('2d');
		DynamicDrawText(text, ctx, Width/2, Height/ (isAlone? 2: 2.5), drawOptions);

		//And print the canvas onto the character based on the above positions
		drawCanvas(TempCanvas, X+ XOffset, Y + YOffset, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + XOffset, Y + YOffset, AlphaMasks);
	}
}
