"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsItemHeadDroneMaskAfterDrawHook(data, originalFunction, {
	C, A, CA, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color,
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

		TextItem.Init(data, C, CA, false);
		const text = CA.Property.Text;
		const isAlone = !text;

		const drawOptions = {
			fontSize: 20,
			fontFamily: data.font,
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
