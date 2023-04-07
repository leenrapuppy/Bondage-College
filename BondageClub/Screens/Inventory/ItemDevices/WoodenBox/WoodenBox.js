"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Load<TypedItemData>} */
function InventoryItemDevicesWoodenBoxLoadHook(Data, OriginalFunction) {
	PropertyTextLoad(Data, OriginalFunction);
	PropertyOpacityLoad();
}

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemDevicesWoodenBoxDrawHook(Data, OriginalFunction) {
	PropertyOpacityDraw(Data, OriginalFunction);
	PropertyTextDraw(Data, null, 1505, 850);
}

/** @type {ExtendedItemScriptHookCallbacks.Exit<TypedItemData>} */
function InventoryItemDevicesWoodenBoxExitHook() {
	const C = CharacterGetCurrent();

	PropertyOpacityExit(null, null, false);
	PropertyTextExit(null, null, false);

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

	CharacterRefresh(C, true, false);
	ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);

	ElementRemove(PropertyGetID("Opacity"));
	ElementRemove(PropertyGetID("Text"));
}

/**
 * Dynamic AfterDraw function. Draws text onto the box.
 * @type {ExtendedItemCallbacks.AfterDraw}
 */
function AssetsItemDevicesWoodenBoxAfterDraw({ C, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	if (L === "_Text") {
		const height = 900;
		const width = 310;
		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		let text = Property && typeof Property.Text === "string" && DynamicDrawTextRegex.test(Property.Text) ? Property.Text : "";
		text = text.substring(0, A.TextMaxLength.Text);

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
			fontFamily: A.TextFont,
			color: `rgba(${r}, ${g}, ${b}, ${0.7 * Opacity})`,
		});

		// We print the canvas on the character based on the asset position
		drawCanvas(tmpCanvas, X + 90, Y + 300, AlphaMasks);
		drawCanvasBlink(tmpCanvas, X + 90, Y + 300, AlphaMasks);
	}
}
