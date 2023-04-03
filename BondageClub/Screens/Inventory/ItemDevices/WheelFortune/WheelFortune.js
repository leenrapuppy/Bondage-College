"use strict";

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemDevicesWheelFortuneInit(C, item, refresh) {
	return ExtendedItemInitNoArch(C, item, {}, refresh);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemDevicesWheelFortuneLoad() {
	WheelFortuneEntryModule = CurrentModule;
	WheelFortuneEntryScreen = CurrentScreen;
	WheelFortuneBackground = "MainHall";
	if (CurrentScreen == "ChatRoom") WheelFortuneBackground = ChatRoomBackground;
	WheelFortuneCharacter = CurrentCharacter;
	DialogLeave();
	CommonSetScreen("MiniGame", "WheelFortune");
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemDevicesWheelFortuneDraw() {
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemDevicesWheelFortuneClick() {
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemDevicesWheelFortuneExit() {
}
