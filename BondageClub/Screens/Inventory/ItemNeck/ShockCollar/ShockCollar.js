"use strict";

/** @type {ExtendedItemCallbacks.BeforeDraw<ShockUnitPersistentData>} */
function AssetsItemNeckShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarShockUnitBeforeDraw(data);
}

/** @type {ExtendedItemCallbacks.ScriptDraw<ShockUnitPersistentData>} */
function AssetsItemNeckShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data);
}
