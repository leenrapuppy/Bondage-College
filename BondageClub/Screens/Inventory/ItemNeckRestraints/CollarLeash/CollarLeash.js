"use strict";

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemNeckRestraintsCollarLeashBeforeDraw(data) {
	if (data.L === "_Handle" || data.L === "_Leash") {
		return { LayerType: data.C.HasEffect("IsLeashed") ? "Held" : ""};
	}
}

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemNeckRestraintsChainLeashBeforeDraw(data) {
	return AssetsItemNeckRestraintsCollarLeashBeforeDraw(data);
}
