"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<ModularItemData>} */
function InventoryItemArmsPrisonLockdownSuitDrawHook(Data, OriginalFunction) {
	if (Data.currentModule === "ShockModule") {
		InventoryItemNeckAccessoriesCollarShockUnitDrawHook(Data, OriginalFunction);
	} else {
		OriginalFunction();
	}
}

/** @type {ExtendedItemScriptHookCallbacks.Click<ModularItemData>} */
function InventoryItemArmsPrisonLockdownSuitClickHook(Data, OriginalFunction) {
	if (Data.currentModule === "ShockModule") {
		InventoryItemNeckAccessoriesCollarShockUnitClickHook(Data, OriginalFunction);
	} else {
		OriginalFunction();
	}
}
