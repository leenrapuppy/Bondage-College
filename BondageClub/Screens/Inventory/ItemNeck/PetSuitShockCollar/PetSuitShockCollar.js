"use strict";

/** @type {ExtendedItemCallbacks.BeforeDraw<AutoShockUnitPersistentData>} */
function AssetsItemNeckPetSuitShockCollarBeforeDraw(data) {
	return AssetsItemNeckAccessoriesCollarAutoShockUnitBeforeDraw(data);
}

/** @type {ExtendedItemCallbacks.ScriptDraw<AutoShockUnitPersistentData>} */
function AssetsItemNeckPetSuitShockCollarScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarAutoShockUnitScriptDraw(data);
}
