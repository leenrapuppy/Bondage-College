"use strict";

/**
 * @param {Character} C
 * @returns {{bpm: number, breathing: "Low" | "Med" | "High" | "Action", temp: number}}
 */
function InventoryItemBreastFuturisticBraUpdate(C) {
	/** @type {"Low" | "Med" | "High" | "Action"} */
	let current_breathing = "Low";
	let current_bpm = 65;
	let current_temp = 37;

	if (C.MemberNumber) {
		current_bpm += C.MemberNumber % 20; // 'Pseudo random baseline'
	}

	if (C.ArousalSettings && C.ArousalSettings.Progress > 0) {
		const Progress = C.ArousalSettings.Progress;
		current_bpm += Math.floor(Progress * 0.60);
		current_temp += Math.floor(Progress * 0.1) / 10;
		if ((C.ArousalSettings.OrgasmStage && C.ArousalSettings.OrgasmStage > 0) || (C.ArousalSettings.ProgressTimer && C.ArousalSettings.ProgressTimer > 1)) {
			current_breathing = "Action";
			current_bpm += 10;
			current_temp += 0.5;
		} else if (C.ArousalSettings.Progress > 10) {
			if (C.ArousalSettings.Progress > 90) {
				current_breathing = "High";
			} else {
				current_breathing = "Med";
			}
		}
	}
	return { bpm: current_bpm, breathing: current_breathing, temp: current_temp };
}

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemBreastFuturisticBraDrawHook(Data, OriginalFunction) {
	if (!FuturisticAccessDraw(Data, OriginalFunction)) {
		return;
	}

	const Prefix = Data.dialogPrefix.option;
	const C = CharacterGetCurrent();
	const {bpm, breathing, temp} = InventoryItemBreastFuturisticBraUpdate(C);

	DrawText(`${DialogFindPlayer(`${Prefix}Desc`)} ${C.MemberNumber}`, 1500, 625, "White", "Gray");

	MainCanvas.textAlign = "right";
	DrawText(DialogFindPlayer(`${Prefix}HeartRate`), 1500, 700, "White", "Gray");
	DrawText(DialogFindPlayer(`${Prefix}Temp`), 1500, 750, "White", "Gray");
	DrawText(DialogFindPlayer(`${Prefix}Breathing`), 1500, 800, "White", "Gray");
	DrawText(DialogFindPlayer(`${Prefix}Tracking`), 1500, 850, "White", "Gray");
	MainCanvas.textAlign = "left";
	DrawText(`${bpm} ${DialogFindPlayer(`${Prefix}HeartRateBPM`)}`, 1510, 700, "White", "Gray");
	DrawText(`${temp} ${DialogFindPlayer(`${Prefix}TempC`)}`, 1510, 750, "White", "Gray");
	DrawText(DialogFindPlayer(`${Prefix}Breathing${breathing}`), 1510, 800, "White", "Gray");
	DrawText(DialogFindPlayer(`${Prefix}TrackingGood`), 1510, 850, "White", "Gray");
	MainCanvas.textAlign = "center";
}

/**
 * @typedef {{ UpdateTime?: number, ShowHeart?: boolean }} FuturisticBraPersistentData
 */

/** @type {ExtendedItemCallbacks.BeforeDraw<FuturisticBraPersistentData>} */
function AssetsItemBreastFuturisticBraBeforeDraw(data) {
	if (data.L === "_Text") {
		const ShowHeart = data.PersistentData().ShowHeart;
		return { Opacity: ShowHeart ? 1 : 0 };
	}
}

/** @type {ExtendedItemCallbacks.AfterDraw<FuturisticBraPersistentData>} */
function AssetsItemBreastFuturisticBraAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, G, Color
}) {
	if (L === "_Text" && Property && (Property.Type != "Solid" && Property.Type != "Solid2")) {

		let offset = 0;
		if (G == "_Large") offset = 4;
		if (G == "_XLarge") offset = 7;
		if (G == "_Small") offset = -5;

		// We set up a canvas
		const Height = 50;
		const Width = 55;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		// We draw the desired info on that canvas
		let context = TempCanvas.getContext('2d');
		context.font = "bold 14px sansserif";
		context.fillStyle = "Black";
		context.textAlign = "center";
		const rate = (Property && Property.HeartRate) ? Property.HeartRate.toString() : "--";
		context.fillText(rate, Width / 2 + 1, Width / 2 - 1, Width);
		context.fillText(rate, Width / 2 - 1, Width / 2 + 1, Width);
		context.fillText(rate, Width / 2 + 1, Width / 2 + 1, Width);
		context.fillText(rate, Width / 2 - 1, Width / 2 - 1, Width);

		context.font = "bold 14px sansserif";
		context.fillStyle = Color;
		context.textAlign = "center";
		context.fillText(rate, Width / 2, Width / 2, Width);

		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 47, Y + 103.5 + offset, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 47, Y + 103.5 + offset, AlphaMasks);
	}
}

/** @type {ExtendedItemCallbacks.ScriptDraw<FuturisticBraPersistentData>} */
function AssetsItemBreastFuturisticBraScriptDraw(data) {
	/** @type {{UpdateTime?: number, ShowHeart?: boolean}} */
	const persistentData = data.PersistentData();
	/** @type {ItemProperties} */
	const property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.ShowHeart !== "boolean") persistentData.ShowHeart = false;

	if (persistentData.UpdateTime < CommonTime()) {
		const {bpm, breathing} = InventoryItemBreastFuturisticBraUpdate(data.C);
		property.HeartRate = bpm;
		if (property.Type === "Solid" || property.Type === "Solid2") {
			persistentData.ShowHeart = false;
		} else {
			persistentData.ShowHeart = (breathing === "Action" || breathing ===  "High");
		}

		const timeToNextRefresh = 1100;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
