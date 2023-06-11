"use strict";

/** @type {ExtendedItemScriptHookCallbacks.Draw<VibratingItemData>} */
function InventoryItemVulvaLoversVibratorDrawHook(Data, OriginalFunction) {
	OriginalFunction();
	const { Asset, Property } = DialogFocusItem;
	const ItemMemberNumber = DialogFindPlayer("ItemMemberNumber").replace("Item", Asset.Description);
	DrawText(ItemMemberNumber + " " + Property.ItemMemberNumber, 1500, 450, "white", "gray");
}
