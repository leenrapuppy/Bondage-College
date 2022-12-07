"use strict";

/** @type {DynamicBeforeDrawCallback} */
function AssetsItemNeckAutoShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarAutoShockUnitBeforeDraw(data);
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemNeckAutoShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarAutoShockUnitScriptDraw(data);
}
