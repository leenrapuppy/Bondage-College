"use strict";

/**
 * Draw handler for the item's extended item screen
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point.
 * @returns {void} - Nothing
 */
function InventoryItemArmsTransportJacketDraw(OriginalFunction) {
	OriginalFunction();
	const Data = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TYPED);
	if (Data == null) {
		return;
	}
	const Prefix = Data.dialog.typePrefix;

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFindPlayer(`${Prefix}TextLabel`), 1475, 860, 400, "#fff", "#000");
	PropertyTextDraw(null, 1725, 860);
	MainCanvas.textAlign = "center";
}

/** @type {DynamicAfterDrawCallback} */
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

		const interpolatedCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const interpolatedCtx = interpolatedCanvas.getContext("2d");

		const xTop = width * 0.15;
		for (let i = 0; i < height; i++) {
			const xStart = xTop - (xTop * i) / height;
			interpolatedCtx.drawImage(flatCanvas, 0, i, width, 1, xStart, i, width - xStart * 2, 1);
		}

		const drawX = X + (300 - width) / 2;
		const drawY = Y + 75;
		drawCanvas(interpolatedCanvas, drawX, drawY, AlphaMasks);
		drawCanvasBlink(interpolatedCanvas, drawX, drawY, AlphaMasks);
	}
}
