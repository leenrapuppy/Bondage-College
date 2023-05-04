"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsItemDevicesDollBoxAfterDrawHook(data, originalFunction,
	{C, A, CA, X, Y, L, drawCanvas, drawCanvasBlink, AlphaMasks, Color},
) {
	if (L === "_Text") {
		// We set up a canvas
		const height = 200;
		const width = 400;
		const tempCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tempCanvas.getContext("2d");

		// One line of text will be centered
		TextItem.Init(data, C, CA, false);
		const [text1, text2] = [CA.Property.Text, CA.Property.Text2];
		const isAlone = !text1 || !text2;

		const drawOptions = {
			fontSize: 40,
			fontFamily: data.font,
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
