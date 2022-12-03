"use strict";

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemNeckShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarShockUnitBeforeDraw(data);
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemNeckShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data);
}
