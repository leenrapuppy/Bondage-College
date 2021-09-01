"use strict";

function InventoryItemHeadFuturisticMaskLoad() {
	InventoryItemHeadInteractiveVisorLoad();
}

function InventoryItemHeadFuturisticMaskDraw() {
	InventoryItemHeadInteractiveVisorDraw();
}

function InventoryItemHeadFuturisticMaskClick() {
	InventoryItemHeadInteractiveVisorClick();
}

function InventoryItemHeadFuturisticMaskPublishAction(C, Option) {
	InventoryItemHeadInteractiveVisorPublishAction(C, Option);
}


function InventoryItemHeadFuturisticMaskExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemHeadFuturisticMaskValidate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item); // All futuristic items refer to the gag
}

function InventoryItemHeadFuturisticMaskNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadInteractiveVisor" + Option.Name, "ItemHead");
}
