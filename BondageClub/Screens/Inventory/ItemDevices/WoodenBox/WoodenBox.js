"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Load<TypedItemData>} */
function InventoryItemDevicesWoodenBoxLoadHook(Data, OriginalFunction) {
	const textData = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TEXT);
	if (textData === null) {
		return;
	}

	TextItem.Load(textData);
	PropertyOpacityLoad();
}

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemDevicesWoodenBoxDrawHook(Data, OriginalFunction) {
	const textData = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TEXT);
	if (textData === null) {
		return;
	}

	TextItem.Draw(textData);
	PropertyOpacityDraw(Data, OriginalFunction);
}

/** @type {ExtendedItemScriptHookCallbacks.Exit<TypedItemData>} */
function InventoryItemDevicesWoodenBoxExitHook() {
	const textData = ExtendedItemGetData(DialogFocusItem, ExtendedArchetype.TEXT);
	if (textData === null) {
		return;
	}

	TextItem.Exit(textData);
	PropertyOpacityExit(null, null, false);

	// Apply extra opacity-specific effects
	const Property = DialogFocusItem.Property;
	const Transparent = Property.Opacity < 0.15;
	/** @type {EffectName[]} */
	const ExtraEffects = ["BlindNormal", "GagLight"];
	if (Transparent) {
		Property.Effect = Property.Effect.filter((e) => !ExtraEffects.includes(e));
	} else {
		Property.Effect = CommonArrayConcatDedupe(Property.Effect, ExtraEffects);
	}

	const C = CharacterGetCurrent();
	CharacterRefresh(C, true, false);
	ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
}

/** @type {ExtendedItemScriptHookCallbacks.PublishAction<TypedItemData, any>} */
function InventoryItemDevicesWoodenBoxPublishActionHook(data, originalFunction, C, item, newOption, previousOption) {
	switch (newOption.OptionType) {
		case "TypedItemOption":
			originalFunction(C, item, newOption, previousOption);
			return;
		case "TextItemOption": {
			const textData = ExtendedItemGetData(item, ExtendedArchetype.TEXT);
			if (textData === null) {
				return;
			}
			TextItem.PublishAction(textData, C, item, newOption, previousOption);
			return;
		}
	}
}

/**
 * Dynamic AfterDraw function. Draws text onto the box.
 * @type {ExtendedItemScriptHookCallbacks.AfterDraw<TypedItemData>}
 */
function AssetsItemDevicesWoodenBoxAfterDrawHook(
	_,
	originalFunction,
	{ C, A, CA, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }
) {
	const data = ExtendedItemGetData(CA, ExtendedArchetype.TEXT);
	if (data != null && L === "_Text") {
		const height = 900;
		const width = 310;
		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		TextItem.Init(data, C, CA, false);
		const text = CA.Property.Text;

		let from;
		let to;
		if (Property && Property.Type === "NWSE") {
			from = [0, 0];
			to = [width, height];
		} else {
			from = [0, height];
			to = [width, 0];
		}

		const { r, g, b } = DrawHexToRGB(Color);
		DynamicDrawTextFromTo(text, ctx, from, to, {
			fontSize: 96,
			fontFamily: data.font,
			color: `rgba(${r}, ${g}, ${b}, ${0.7 * Opacity})`,
		});

		// We print the canvas on the character based on the asset position
		drawCanvas(tmpCanvas, X + 90, Y + 300, AlphaMasks);
		drawCanvasBlink(tmpCanvas, X + 90, Y + 300, AlphaMasks);
	}
}
