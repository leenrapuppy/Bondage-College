"use strict";

function InventoryClothCheerleaderTopLoad() {
	let mustRefresh = false;

	/** @type {ItemProperties} */
	const property = (DialogFocusItem.Property = DialogFocusItem.Property || {});
	if (typeof property.Text !== "string") {
		property.Text = "";
		mustRefresh = true;
	}

	if (mustRefresh) {
		const C = CharacterGetCurrent();
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}

	PropertyTextLoad();
}

function InventoryClothCheerleaderTopDraw() {
	ExtendedItemDrawHeader();
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "#808080");
	DrawText(DialogFindPlayer("ClothCheerleaderTopTextLabel"), 1505, 530, "#fff", "#000");
	PropertyTextDraw();
}

function InventoryClothCheerleaderTopClick() {
	if (MouseIn(1885, 25, 90, 90)) {
		ExtendedItemExit();
	}
}

function InventoryClothCheerleaderTopExit() {
	PropertyTextExit();
}

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

/**
 * @param {DynamicDrawingData} data
 */
function AssetsClothCheerleaderTopAfterDraw({
	CA,
	C,
	A,
	G,
	X,
	Y,
	L,
	Property,
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

	let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text)
		? Property.Text
		: "";
	text = text.substring(0, A.TextMaxLength.Text)
		.replace(/(?:)/g, ' ')
		.trim();

	const sizeData = AssetsClothCheerleaderTopData[G] || AssetsClothCheerleaderTopData._Small;

	const height = 48;
	const width = sizeData.width;
	const flatCanvas = AnimationGenerateTempCanvas(C, A, width, height);
	const ctx = flatCanvas.getContext("2d");

	DynamicDrawTextArc(text, ctx, width / 2, height / 2, {
		fontSize: 48,
		fontFamily: A.TextFont,
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
