"use strict";

const AssetsClothCheerleaderTopData = {
	_Small: {
		shearFactor: 0.78,
		width: 100,
		yOffset: 70,
	},
	_Normal: {
		shearFactor: 0.76,
		width: 110,
		yOffset: 78,
	},
	_Large: {
		shearFactor: 0.74,
		width: 120,
		yOffset: 84,
	},
	_XLarge: {
		shearFactor: 0.72,
		width: 130,
		yOffset: 84,
	}
};

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsClothCheerleaderTopAfterDrawHook(data, originalFunction, {
	CA,
	C,
	A,
	G,
	X,
	Y,
	L,
	drawCanvas,
	drawCanvasBlink,
	AlphaMasks,
	Color
}) {
	if (L !== "_TextStroke") {
		return;
	}

	let fillColor = Color;
	let strokeColor = Color;
	if (Array.isArray(CA.Color)) {
		if (CommonIsColor(CA.Color[3])) {
			fillColor = CA.Color[3];
		}
		if (CommonIsColor(CA.Color[4])) {
			strokeColor = CA.Color[4];
		}
	}

	TextItem.Init(data, C, CA, false);
	const text = CA.Property.Text;

	const sizeData = AssetsClothCheerleaderTopData[G] || AssetsClothCheerleaderTopData._Small;

	const height = 48;
	const width = sizeData.width;
	const flatCanvas = AnimationGenerateTempCanvas(C, A, width, height);
	const ctx = flatCanvas.getContext("2d");

	DynamicDrawTextArc(text, ctx, width / 2, height / 2, {
		fontSize: 48,
		fontFamily: data.font,
		width,
		color: fillColor,
		strokeColor,
		strokeWidth: text.length > 7 ? 1 : 2,
		radius: 240,
	});

	const shearedCanvas = AnimationGenerateTempCanvas(C, A, width, height);

	DrawImageTrapezify(flatCanvas, shearedCanvas, sizeData.shearFactor);

	const drawX = X + (180 - width) / 2;
	const drawY = Y + sizeData.yOffset;

	drawCanvas(shearedCanvas, drawX, drawY, AlphaMasks);
	drawCanvasBlink(shearedCanvas, drawX, drawY, AlphaMasks);
}
