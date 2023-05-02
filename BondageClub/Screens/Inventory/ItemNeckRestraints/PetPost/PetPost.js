"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsItemNeckRestraintsPetPostAfterDrawHook(data, originalFunction, {
	C, A, CA, X, Y, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L === "_Text") {
		// Setup a canvas to draw the post's text
		let Height = 100;
		let Width = 90;
		let YOffset = 20;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		TextItem.Init(data, C, CA, false);
		const [text1, text2, text3] = [CA.Property.Text, CA.Property.Text2, CA.Property.Text3];

		/** @type {DynamicDrawOptions} */
		const drawOptions = {
			fontSize: 22,
			fontFamily: data.font,
			color: Color,
			textAlign: "center",
			width: Width,
		};

		// We draw the desired info on that canvas
		const ctx = TempCanvas.getContext('2d');
		DynamicDrawText(text1, ctx, Width / 2, Height / 2, drawOptions);
		DynamicDrawText(text2, ctx, Width / 2, Height / 2 + 24, drawOptions);
		DynamicDrawText(text3, ctx, Width / 2, Height / 2 + 46, drawOptions);

		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 24, Y + YOffset, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 24, Y + YOffset, AlphaMasks);
	}
}
