"use strict";

/** @type {ExtendedItemCallbacks.BeforeDraw} */
function AssetsItemNipplesLactationPumpBeforeDraw(data) {
	// If suspended off the ground, use the normal pose image
	if (data.C.IsSuspended() && data.C.HeightRatioProportion < 1) {
		return { Pose: null };
	}

	return null;
}
