"use strict";

/** @type {ExtendedItemCallbacks.BeforeDraw<AutoShockUnitPersistentData>} */
function AssetsItemNeckAutoShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarAutoShockUnitBeforeDraw(data);
}

/** @type {ExtendedItemCallbacks.ScriptDraw<AutoShockUnitPersistentData>} */
function AssetsItemNeckAutoShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarAutoShockUnitScriptDraw(data);
}
