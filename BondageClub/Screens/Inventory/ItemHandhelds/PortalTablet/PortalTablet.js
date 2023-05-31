"use strict";

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemHandheldPortalTabletInit(C, Item, Refresh) {
	return PortalLinkTransmitterInit(C, Item, Refresh);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemHandheldPortalTabletLoad() {
	PortalLinkTransmitterLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemHandheldPortalTabletDraw() {
	PortalLinkTransmitterDraw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemHandheldPortalTabletClick() {
	PortalLinkTransmitterClick();
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemHandheldPortalTabletExit() {
	PortalLinkTransmitterExit();
}
