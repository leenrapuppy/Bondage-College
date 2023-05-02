"use strict";

/**
 * Post-render drawing function. Draws custom text in a slight arc to mimic the
 * curvature of the character's head.
 * @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>}
 */
function AssetsItemHoodCanvasHoodAfterDrawHook(data, originalFunction,
	{ C, A, CA, X, Y, L, drawCanvas, drawCanvasBlink, AlphaMasks, Color },
) {
	if (L === "_Text") {
		// Fetch the text property and assert that it matches the character
		// and length requirements
		TextItem.Init(data, C, CA, false);
		const text = CA.Property.Text;

		// Prepare a temporary canvas to draw the text to
		const height = 50;
		const width = 120;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		DynamicDrawTextArc(text, ctx, width / 2, height / 2, {
			fontSize: 36,
			fontFamily: data.font,
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
