"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<TypedItemData>} */
function InventoryItemTorsoFuturisticHarnessDrawHook(Data, OriginalFunction) {
	if (!FuturisticAccessDraw(Data, OriginalFunction)) {
		return;
	}
	ExtendedItemCustomDraw("FuturisticCollarColor", 1385, 800, false, !InventoryItemTorsoFuturisticHarnessIsColorable());
}

/** @type {ExtendedItemScriptHookCallbacks.Click<TypedItemData>} */
function InventoryItemTorsoFuturisticHarnessClickHook(Data, OriginalFunction) {
	if (!FuturisticAccessClick(Data, OriginalFunction)) {
		return;
	}
	if (MouseIn(1385, 800, 225, 55)) {
		if (ExtendedItemPermissionMode || InventoryItemTorsoFuturisticHarnessIsColorable()) {
			ExtendedItemCustomClick("FuturisticCollarColor", InventoryItemTorsoFuturisticHarnessColor);
		}
	}
}

/** @type {() => boolean} */
function InventoryItemTorsoFuturisticHarnessIsColorable() {
	const C = CharacterGetCurrent();
	const FuturisticCollarItems = InventoryItemNeckFuturisticCollarGetItems(C);
	return (FuturisticCollarItems.length > 0);
}

/** @type {() => void} */
function InventoryItemTorsoFuturisticHarnessColor() {
	const C = CharacterGetCurrent();
	InventoryItemNeckFuturisticCollarColor(C, DialogFocusItem);
}
