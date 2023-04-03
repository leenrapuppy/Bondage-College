"use strict";

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemNeckRestraintsPetPostTxt0Load() {
	PropertyTextLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemNeckRestraintsPetPostTxt0Draw() {
	DrawAssetPreview(1387, 125, DialogFocusItem.Asset);
	PropertyTextDraw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemNeckRestraintsPetPostTxt0Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemNeckRestraintsPetPostTxt0Exit();
	}
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemNeckRestraintsPetPostTxt0Exit() {
	PropertyTextExit();
	ExtendedItemSubscreen = null;
}

/** @type {ExtendedItemCallbacks.AfterDraw} */
function AssetsItemNeckRestraintsPetPostAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L === "_Text") {
		// Setup a canvas to draw the post's text
		let Height = 100;
		let Width = 90;
		let YOffset = 20;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		const MaxText1Length = A.TextMaxLength.Text;
		const MaxText2Length = A.TextMaxLength.Text2;
		const MaxText3Length = A.TextMaxLength.Text3;
		let text1 = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text.substring(0, MaxText1Length) : "Pet";
		let text2 = Property && typeof Property.Text2 === "string" && DynamicDrawTextRegex.test(Property.Text2) ? Property.Text2.substring(0, MaxText2Length) : "Leashing";
		let text3 = Property && typeof Property.Text3 === "string" && DynamicDrawTextRegex.test(Property.Text2) ? Property.Text3.substring(0, MaxText3Length) : "Post";

		/** @type {DynamicDrawOptions} */
		const drawOptions = {
			fontSize: 22,
			fontFamily: A.TextFont,
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

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemMiscPetPostTxt0Load() {
	InventoryItemNeckRestraintsPetPostTxt0Load();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemMiscPetPostTxt0Draw() {
	InventoryItemNeckRestraintsPetPostTxt0Draw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemMiscPetPostTxt0Click() {
	InventoryItemNeckRestraintsPetPostTxt0Click();
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemMiscPetPostTxt0Exit() {
	InventoryItemNeckRestraintsPetPostTxt0Exit();
}

/** @type {ExtendedItemCallbacks.AfterDraw} */
function AssetsItemMiscPetPostAfterDraw(data) {
	AssetsItemNeckRestraintsPetPostAfterDraw(data);
}
