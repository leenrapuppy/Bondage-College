"use strict";

// Loads the item extension properties
function InventoryItemArmsPrisonLockdownSuitShockModule1Load() {
	InventoryItemNeckAccessoriesCollarShockUnitLoad();
}

// Draw the item extension screen
function InventoryItemArmsPrisonLockdownSuitShockModule1Draw() {
	if (DialogFocusItem && DialogFocusItem.Property) {
		if (DialogFocusItem.Property.ShockLevel == null) DialogFocusItem.Property.ShockLevel = 0;
		if (DialogFocusItem.Property.TriggerCount == null) DialogFocusItem.Property.TriggerCount = 0;
	}
	InventoryItemNeckAccessoriesCollarShockUnitDraw();
}

// Catches the item extension clicks
function InventoryItemArmsPrisonLockdownSuitShockModule1Click() {
	InventoryItemNeckAccessoriesCollarShockUnitClick();

	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemArmsPrisonLockdownSuitShockModule1Exit();
	}
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemNeckTechnoCollarShockModule1ScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data);
}

// Leaves the extended screen
function InventoryItemArmsPrisonLockdownSuitShockModule1Exit() {
	ExtendedItemSubscreen = null;
}
