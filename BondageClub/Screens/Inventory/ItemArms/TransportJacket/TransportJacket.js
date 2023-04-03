"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemArmsTransportJacketDrawHook(Data, OriginalFunction) {
	OriginalFunction();
	const Prefix = Data.dialogPrefix.option;

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFindPlayer(`${Prefix}TextLabel`), 1475, 860, 400, "#fff", "#000");
	PropertyTextDraw(Data, null, 1725, 860);
	MainCanvas.textAlign = "center";
}

/** @type {ExtendedItemCallbacks.AfterDraw} */
function AssetsItemArmsTransportJacketAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color }) {
	if (L === "_Text") {
		const width = 150;
		const height = 60;
		const flatCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const flatCtx = flatCanvas.getContext("2d");

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, A.TextMaxLength.Text);

		DynamicDrawText(text, flatCtx, width / 2, height / 2, {
			fontSize: 40,
			fontFamily: A.TextFont,
			color: Color,
			width,
		});

		const shearedCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		DrawImageTrapezify(flatCanvas, shearedCanvas, 0.7);

		const drawX = X + (300 - width) / 2;
		const drawY = Y + 75;
		drawCanvas(shearedCanvas, drawX, drawY, AlphaMasks);
		drawCanvasBlink(shearedCanvas, drawX, drawY, AlphaMasks);
	}
}
