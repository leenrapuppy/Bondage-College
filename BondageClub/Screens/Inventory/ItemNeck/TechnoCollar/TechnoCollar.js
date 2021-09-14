"use strict";

// Loads the item extension properties
function InventoryItemNeckTechnoCollarShockModule1Load() {
	InventoryItemNeckAccessoriesCollarShockUnitLoad();
}

// Draw the item extension screen
function InventoryItemNeckTechnoCollarShockModule1Draw() {
	InventoryItemNeckAccessoriesCollarShockUnitDraw();
}

// Catches the item extension clicks
function InventoryItemNeckTechnoCollarShockModule1Click() {
	InventoryItemNeckAccessoriesCollarShockUnitClick();

	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemNeckTechnoCollarShockModule1Exit();
	}
}

function AssetsItemNeckTechnoCollarShockModule1ScriptDraw(data) {
	AssetsItemNeckAccessoriesCollarShockUnitScriptDraw(data);
}

// Leaves the extended screen
function InventoryItemNeckTechnoCollarShockModule1Exit() {
	ExtendedItemSubscreen = null;
}