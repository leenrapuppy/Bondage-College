"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsClothAccessoryBibAfterDrawHook(data, originalFunction, {
	C, A, CA, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
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

		TextItem.Init(data, C, CA, false);
		const [text1, text2] = [CA.Property.Text, CA.Property.Text2];
		const isAlone = !text1 || !text2;

		const drawOptions = {
			fontSize: 20,
			fontFamily: data.font,
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
