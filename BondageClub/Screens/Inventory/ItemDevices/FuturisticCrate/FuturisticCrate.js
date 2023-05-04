"use strict";

/**
 * @typedef {FuckMachinePersistentData} FuturisticCratePersistentData
 */

/** @type {ExtendedItemCallbacks.BeforeDraw<FuturisticCratePersistentData>} */
function AssetsItemDevicesFuturisticCrateBeforeDraw({ PersistentData, L, X, Y, Property }) {
	const Data = PersistentData();
	if (typeof Data.DildoState !== "number") Data.DildoState = 0;
	if (typeof Data.Modifier !== "number") Data.Modifier = 1;

	//if (L === "_DevicePleasureHolder") return { Y: Y + Data.DildoState };
	if (L !== "_DevicePleasureHolder") return;

	const Properties = Property || {};
	const Intensity = typeof Properties.Intensity === "number" ? Properties.Intensity : -1;


	const FuckLength = 15;
	const TimeModifier = 0.007;
	const AnimationQualityRatio = (Player.GraphicsSettings ? Math.max(Player.GraphicsSettings.AnimationQuality * 0.6, 30) : 30) / 30;
	Data.Speed = (Intensity + 1) * 2;
	if (Data.DildoState >= 1 && Intensity > -1) {
		Data.Modifier = -1;
	} else if (Data.DildoState <= 0) {
		Data.Modifier = 1;
	} else if (Data.DildoState <= 1 && Intensity === -1) {
		Data.Modifier = 1;
		Data.Speed = 1;
	}

	Data.DildoState += Data.Modifier * Data.Speed * AnimationQualityRatio * TimeModifier;
	if (AnimationQualityRatio > FuckLength) Data.DildoState = Math.random();

	return { Y: Y + FuckLength * (-Math.cos(Data.DildoState * 2 * Math.PI)) };
}

/** @type {ExtendedItemScriptHookCallbacks.ScriptDraw<VibratingItemData, FuturisticCratePersistentData>} */
function AssetsItemDevicesFuturisticCrateScriptDrawHook(data, originalFunction, drawData) {
	originalFunction(drawData);

	const Data = drawData.PersistentData();
	const Properties = drawData.Item.Property || {};
	const FrameTime = Player.GraphicsSettings ? Math.max(30, (Player.GraphicsSettings.AnimationQuality * 0.6)) : 30;
	const Intensity = typeof Properties.Intensity === "number" ? Properties.Intensity : -1;
	const FuckLength = 32;

	if (typeof Data.FuckChangeTime !== "number") Data.FuckChangeTime = CommonTime() + FrameTime;
	if (typeof Data.DildoState !== "number") Data.DildoState = 0;

	if (Data.FuckChangeTime < CommonTime() && !(Intensity === -1 && FuckLength <= Data.DildoState)) {
		Data.FuckChangeTime = CommonTime() + FrameTime;
		AnimationRequestRefreshRate(drawData.C, FrameTime);
		AnimationRequestDraw(drawData.C);
	}
}
