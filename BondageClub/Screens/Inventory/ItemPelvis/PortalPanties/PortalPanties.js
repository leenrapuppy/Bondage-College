"use strict";

/** @type {ExtendedItemCallbacks.Init} */
function InventoryItemPelvisPortalPantieso0Init(C, Item, Refresh) {
	return PortalLinkRecieverInit(C, Item, Refresh);
}

/** @type {ExtendedItemCallbacks.Load} */
function InventoryItemPelvisPortalPantieso0Load() {
	PortalLinkRecieverLoad();
}

/** @type {ExtendedItemCallbacks.Draw} */
function InventoryItemPelvisPortalPantieso0Draw() {
	PortalLinkRecieverDraw();
}

/** @type {ExtendedItemCallbacks.Click} */
function InventoryItemPelvisPortalPantieso0Click() {
	PortalLinkRecieverClick();
}

/** @type {ExtendedItemCallbacks.Exit} */
function InventoryItemPelvisPortalPantieso0Exit() {
	PortalLinkRecieverExit();
}
