"use strict";

/**
 * Wheel of Fortune Game loader
 */
function InventoryItemDevicesWheelFortuneLoad() {
	WheelFortuneEntryModule = CurrentModule;
	WheelFortuneEntryScreen = CurrentScreen;
	WheelFortuneBackground = "MainHall";
	if (CurrentScreen == "ChatRoom") WheelFortuneBackground = ChatRoomBackground;
	WheelFortuneCharacter = CurrentCharacter;
	DialogLeave();
	CommonSetScreen("MiniGame", "WheelFortune");
}

/**
 * Wheel of Fortune Game draw engine
 */
 function InventoryItemDevicesWheelFortuneDraw() {
}

/**
 * Wheel of Fortune Game clicks
 */
 function InventoryItemDevicesWheelFortuneClick() {
}

/**
 * Wheel of Fortune Game clicks
 */
 function InventoryItemDevicesWheelFortuneExit() {
}
