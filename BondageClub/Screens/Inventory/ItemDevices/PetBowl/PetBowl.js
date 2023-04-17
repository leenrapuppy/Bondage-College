"use strict";

/**
 * Post-render drawing function. Draws custom text in a slight arc to mimic the
 * curvature of the bowl.
 * @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>}
 */
function AssetsItemDevicesPetBowlAfterDrawHook(data, originalFunction,
	{ C, A, CA, X, Y, L, drawCanvas, drawCanvasBlink, AlphaMasks, Color },
) {
	if (L === "_Text") {
		// Fetch the text property and assert that it matches the character
		// and length requirements
		TextItem.Init(data, C, CA, false);
		const text = CA.Property.Text;

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
			fontFamily: data.font,
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
