"use strict";
var InventoryItemNeckRestraintsPetPostAllowedChars = /^[a-zA-Z0-9 ~!]*$/;
// Loads the item extension properties
function InventoryItemNeckRestraintsPetPostTxt0Load() {
	ElementCreateInput("SignText", "text", DialogFocusItem.Property.Text || "", "9");
}

// Draw the extension screen
function InventoryItemNeckRestraintsPetPostTxt0Draw() {
	// Draw the header and item
	DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

	// Tag data
	ElementPosition("SignText", 1375, 680, 250);
	DrawButton(1500, 651, 350, 64, DialogFindPlayer("CustomSignText"), ElementValue("SignText").match(InventoryItemNeckRestraintsPetPostAllowedChars) ? "White" : "#888", "");
}

// Catches the item extension clicks
function InventoryItemNeckRestraintsPetPostTxt0Click() {
	if (
		MouseIn(1500, 651, 350, 64) &&
		DialogFocusItem.Property.Text !== ElementValue("SignText") &&
		ElementValue("SignText").match(InventoryItemNeckRestraintsPetPostAllowedChars)
	) {
		DialogFocusItem.Property.Text = ElementValue("SignText");
		InventoryItemNeckRestraintsPetPostChange();
	}

	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemNeckRestraintsPetPostExit();
	}
}

// Leaves the extended screen
function InventoryItemNeckRestraintsPetPostExit() {
	ElementRemove("SignText");
	ExtendedItemSubscreen = null;
}

// When the tag is changed
function InventoryItemNeckRestraintsPetPostChange() {
	var C = CharacterGetCurrent();
	CharacterRefresh(C);
	if (CurrentScreen == "ChatRoom") {
		var Dictionary = [];
		Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber });
		ChatRoomPublishCustomAction("ChangeCustomTag", false, Dictionary);
	}
	InventoryItemNeckRestraintsPetPostExit();
}

// Drawing function for the text on the tag
function AssetsItemNeckRestraintsPetPostAfterDraw({
	C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) {
	if (L === "_Text") {
		// Determine the canvas position and size
		const Properties = Property || {};
		const Type = Properties.Type || "t0";

		// We set up a canvas
		let Height = 70;
		let Width = 82;
		let YOffset = 30;
		const FontName = "sans-serif";
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);
		const text = Property && typeof Property.Text === "string" && InventoryItemNeckRestraintsPetPostAllowedChars.test(Property.Text) ? Property.Text : "Tag";

		// We draw the desired info on that canvas
		let context = TempCanvas.getContext('2d');
		context.font = "13px " + FontName;
		context.fillStyle = Color;
		context.textAlign = "center";
		context.fillText(text, Width / 2, Width / 2, Width);

		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 227.5, Y + YOffset, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 227.5, Y + YOffset, AlphaMasks);
	}
}
