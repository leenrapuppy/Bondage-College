"use strict";

/** @type {ExtendedItemCallbacks.BeforeDraw} */
function AssetsItemArmsNylonRopeBeforeDraw(data) {
	if (data.LayerType === "BedSpreadEagle") {
		return {
			X: data.X - 50,
			Y: data.Y - 150,
		};
	}

	return null;
}
