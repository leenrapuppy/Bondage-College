"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsItemMiscWoodenSignAfterDrawHook(data, originalFunction, {
	C, A, CA, X, Y, L, drawCanvas, drawCanvasBlink, AlphaMasks, Color
}) {
	if (L === "_Text") {
		// We set up a canvas
		const height = 200;
		const width = 155;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		// One line of text will be centered
		TextItem.Init(data, C, CA, false);
		const [text1, text2] = [CA.Property.Text, CA.Property.Text2];
		const isAlone = !text1 || !text2;

		const drawOptions = {
			fontSize: 30,
			fontFamily: data.font,
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
