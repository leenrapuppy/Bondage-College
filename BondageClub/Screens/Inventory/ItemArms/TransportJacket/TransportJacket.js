"use strict";


/** @type {ExtendedItemScriptHookCallbacks.Load<TypedItemData>} */
function InventoryItemArmsTransportJacketLoadHook(Data, OriginalFunction) {
	const textData = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TEXT);
	if (textData === null) {
		return;
	}

	OriginalFunction();
	TextItem.Load(textData);
}

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemArmsTransportJacketDrawHook(Data, OriginalFunction) {
	const textData = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TEXT);
	if (textData === null) {
		return;
	}

	OriginalFunction();
	TextItem.Draw(textData);

	MainCanvas.textAlign = "right";
	const Prefix = Data.dialogPrefix.option;
	DrawTextFit(DialogFindPlayer(`${Prefix}TextLabel`), 1475, 860, 400, "#fff", "#000");
	MainCanvas.textAlign = "center";
}

/** @type {ExtendedItemScriptHookCallbacks.PublishAction<TypedItemData, any>} */
function InventoryItemArmsTransportJacketPublishActionHook(data, originalFunction, C, item, newOption, previousOption) {
	switch (newOption.OptionType) {
		case "TextItemOption": {
			const textData = ExtendedItemGetData(item, ExtendedArchetype.TEXT);
			if (textData === null) {
				return;
			}
			TextItem.PublishAction(textData, C, item, newOption, previousOption);
			return;
		}
		case "TypedItemOption":
			originalFunction(C, item, newOption, previousOption);
			return;
	}
}

/** @type {ExtendedItemScriptHookCallbacks.Exit<TypedItemData>} */
function InventoryItemArmsTransportJacketExitHook(Data, OriginalFunction) {
	const textData = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TEXT);
	if (textData !== null) {
		TextItem.Exit(textData);
	}
}

/** @type {ExtendedItemCallbacks.AfterDraw} */
function AssetsItemArmsTransportJacketAfterDraw(
	{ C, A, CA, X, Y, L, drawCanvas, drawCanvasBlink, AlphaMasks, Color },
) {
	const data = ExtendedItemGetData(CA, ExtendedArchetype.TEXT);
	if (data != null && L === "_Text") {
		const width = 150;
		const height = 60;
		const flatCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const flatCtx = flatCanvas.getContext("2d");

		TextItem.Init(data, C, CA, false);
		const text = CA.Property.Text;

		DynamicDrawText(text, flatCtx, width / 2, height / 2, {
			fontSize: 40,
			fontFamily: data.font,
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
