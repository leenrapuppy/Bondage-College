"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsItemNeckAccessoriesCustomCollarTagAfterDrawHook(data, originalFunction, {
	C, A, CA, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
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

		TextItem.Init(data, C, CA, false);
		const text = CA.Property.Text;

		/** @type {DynamicDrawOptions} */
		const drawOptions = {
			fontSize: 13,
			fontFamily: data.font,
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
