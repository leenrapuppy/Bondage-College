"use strict";

// Loads the item extension properties
function InventoryClothAccessoryBibTxt1Load() {
	PropertyTextLoad();
}

// Draw the extension screen
function InventoryClothAccessoryBibTxt1Draw() {
	ExtendedItemDrawHeader(1387, 125);
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");
	PropertyTextDraw();
}

function InventoryClothAccessoryBibTxt1Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryClothAccessoryBibTxt1Exit();
	}
}

// Draw the extension screen
function InventoryClothAccessoryBibTxt1Exit() {
	PropertyTextExit();
	ExtendedItemSubscreen = null;
}

/** @type {DynamicAfterDrawCallback} */
function AssetsClothAccessoryBibAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L === "_Text") {
		const Properties = Property || {};
		const Type = Properties.Type || "x0";
		if (!Type.includes("x1")) return;

		// We set up a canvas
		let Height = 65;
		let Width = 120;
		let XOffset = 10;
		let YOffset = 40;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		const MaxText1Length = A.TextMaxLength.Text;
		const MaxText2Length = A.TextMaxLength.Text2;
		const text1 = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text.substring(0, MaxText1Length) : "";
		const text2 = Property && typeof Property.Text2 === "string" && DynamicDrawTextRegex.test(Property.Text2) ? Property.Text2.substring(0, MaxText2Length) : "";
		const isAlone = !text1 || !text2;

		const drawOptions = {
			fontSize: 20,
			fontFamily: A.TextFont,
			color: Color,
			width: Width,
		};

		// We draw the desired info on that canvas
		let ctx = TempCanvas.getContext('2d');
		DynamicDrawText(text1, ctx, Width / 2, Height / (isAlone ? 2 : 2.5), drawOptions);
		DynamicDrawText(text2, ctx, Width / 2, Height / (isAlone ? 2 : 1.5), drawOptions);


		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + XOffset, Y + YOffset, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + XOffset, Y + YOffset, AlphaMasks);
	}
}
