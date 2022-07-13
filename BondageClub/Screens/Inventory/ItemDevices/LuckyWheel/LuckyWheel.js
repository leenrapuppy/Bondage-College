"use strict";
var ItemDevicesLuckyWheelMinTexts = 2;
var ItemDevicesLuckyWheelMaxTexts = 8;
var ItemDevicesLuckyWheelMaxTextLength = 12;
var ItemDevicesLuckyWheelFont = "'Nanum Pen Script', 'Arial', sans-serif";
// Speed are calculated "Steps" aka degrees out of 360, so  360/speed * frametime is the time for one rotation
var ItemDevicesLuckyWheelAnimationMaxSpeed = 80;
var ItemDevicesLuckyWheelAnimationMinSpeed = 4;
var ItemDevicesLuckyWheelAnimationSpeedStep = 1;
var ItemDevicesLuckyWheelAnimationFrameTime = 80;

function ItemDevicesLuckyWheelLabelForNum(num) {
	return DialogFindPlayer("LuckyWheelSectionDefaultLabel").replace("NUM", num.toString());
}

function InventoryItemDevicesLuckyWheelGame0Load() {
	DynamicDrawLoadFont(ItemDevicesLuckyWheelFont);

	if (!DialogFocusItem.Property) DialogFocusItem.Property = {};
	if (typeof DialogFocusItem.Property.TargetAngle !== "number") DialogFocusItem.Property.TargetAngle = 0;
	if (!Array.isArray(DialogFocusItem.Property.Texts)) DialogFocusItem.Property.Texts = [];
	if (DialogFocusItem.Property.Texts.length > ItemDevicesLuckyWheelMaxTexts)
		DialogFocusItem.Property.Texts = DialogFocusItem.Property.Texts.splice(0, ItemDevicesLuckyWheelMaxTexts);
	if (typeof DialogFocusItem.Property.Texts[0] !== "string") DialogFocusItem.Property.Texts[0] = ItemDevicesLuckyWheelLabelForNum(1);
	if (typeof DialogFocusItem.Property.Texts[1] !== "string") DialogFocusItem.Property.Texts[1] = ItemDevicesLuckyWheelLabelForNum(2);

	for (let num = 0; num < DialogFocusItem.Property.Texts.length; num++) {
		const input = ElementCreateInput(`LuckyWheelText${num}`, "input", DialogFocusItem.Property.Texts[num] || "", ItemDevicesLuckyWheelMaxTextLength);
		if (input) {
			input.pattern = DynamicDrawTextInputPattern;
			input.addEventListener("change", InventoryItemDevicesLuckyWheelUpdate);
		}
	}
	InventoryItemDevicesLuckyWheelUpdate();
}

var ItemDevicesLuckyWheelRowTop = 500;
var ItemDevicesLuckyWheelRowLeft = 1380;
var ItemDevicesLuckyWheelRowHeight = 60;
var ItemDevicesLuckyWheelRowLength = 350;

function InventoryItemDevicesLuckyWheelGame0Draw() {
	// Draw the header and item
	DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

	// Section labels & remove buttons grid
	let top = ItemDevicesLuckyWheelRowTop;
	let left = ItemDevicesLuckyWheelRowLeft;
	for (let num = 0; num < DialogFocusItem.Property.Texts.length; num++) {
		let topRow = (num % (ItemDevicesLuckyWheelMaxTexts / 2) * ItemDevicesLuckyWheelRowHeight);
		let leftCol = Math.floor(num / (ItemDevicesLuckyWheelMaxTexts / 2)) * ItemDevicesLuckyWheelRowLength;
		ElementPosition(`LuckyWheelText${num}`, left + leftCol, top + topRow, 300);
	}

	const disabledAdd = DialogFocusItem.Property.Texts.length >= ItemDevicesLuckyWheelMaxTexts;
	DrawButton(1360, 720, 120, 48, DialogFindPlayer("LuckyWheelAddSection"), disabledAdd ? "#888" : "white", null, null, disabledAdd);

	const disabledRemove = DialogFocusItem.Property.Texts.length <= ItemDevicesLuckyWheelMinTexts;
	DrawButton(1530, 720, 120, 48, DialogFindPlayer("LuckyWheelRemoveSection"), disabledRemove ? "#888" : "white", null, null, disabledRemove);

	DrawButton(1380, 800, 260, 64, DialogFindPlayer("LuckyWheelTrigger"), "white");
}

function InventoryItemDevicesLuckyWheelGame0Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemDevicesLuckyWheelGame0Exit();
		return;
	}

	if (MouseIn(1380, 800, 260, 64)) {
		InventoryItemDevicesLuckyWheelTrigger();
		return;
	}

	if (MouseIn(1360, 720, 120, 48)) {
		if (DialogFocusItem.Property.Texts.length >= ItemDevicesLuckyWheelMaxTexts) return;

		let last = DialogFocusItem.Property.Texts.length;
		const label = ItemDevicesLuckyWheelLabelForNum(last + 1);
		const input = ElementCreateInput(`LuckyWheelText${last}`, "input", label, ItemDevicesLuckyWheelMaxTextLength);
		if (input) {
			input.pattern = DynamicDrawTextInputPattern;
			input.addEventListener("change", InventoryItemDevicesLuckyWheelUpdate);
		}
		DialogFocusItem.Property.Texts.push(label);
		InventoryItemDevicesLuckyWheelUpdate();
		return;
	}

	if (MouseIn(1530, 720, 120, 48)) {
		if (DialogFocusItem.Property.Texts.length <= ItemDevicesLuckyWheelMinTexts) return;

		const num = DialogFocusItem.Property.Texts.length - 1;
		DialogFocusItem.Property.Texts.splice(num, 1);
		ElementRemove(`LuckyWheelText${num}`);
		InventoryItemDevicesLuckyWheelUpdate();
		return;
	}
}

function InventoryItemDevicesLuckyWheelGame0Exit() {
	if (!DialogFocusItem) return;

	let needsUpdate = false;
	for (let num = 0; num < ItemDevicesLuckyWheelMaxTexts; num++) {
		if (num < DialogFocusItem.Property.Texts.length) {
			const text = ElementValue(`LuckyWheelText${num}`);
			if (text != DialogFocusItem.Property.Texts[num]) {
				DialogFocusItem.Property.Texts[num] = text;
				needsUpdate = true;
			}
		}

		ElementRemove(`LuckyWheelText${num}`);
	}

	if (needsUpdate) {
		CharacterRefresh(CharacterGetCurrent(), false);
		ChatRoomCharacterItemUpdate(CharacterGetCurrent());
	}

	ExtendedItemSubscreen = null;
}

function InventoryItemDevicesLuckyWheelUpdate() {
	CharacterRefresh(CharacterGetCurrent(), false);
}

function InventoryItemDevicesLuckyWheelTrigger() {
	const randomAngle = Math.round(Math.random() * 360);
	DialogFocusItem.Property.TargetAngle = randomAngle;

	const C = CharacterGetCurrent();
	/** @type {ChatMessageDictionary} */
	let Dictionary = [
		{ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: CharacterNickname(C), MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction("LuckyWheelStartTurning", true, Dictionary);
}

function AssetsItemDevicesLuckyWheelScriptDraw({ C, PersistentData, Item }) {
	const Data = PersistentData();
	const Properties = Item.Property || {};
	const TargetAngle = Math.min(Math.max(Properties.TargetAngle || 0, 0), 360);
	const FrameTime = ItemDevicesLuckyWheelAnimationFrameTime;

	// Initialized to a non-spinning value (aka target value), to avoid "misfires" on asset load
	if (typeof Data.AnimationAngleState !== "number") Data.AnimationAngleState = TargetAngle;
	if (typeof Data.AnimationSpeed !== "number" || Data.AnimationAngleState == TargetAngle) Data.AnimationSpeed = ItemDevicesLuckyWheelAnimationMaxSpeed;
	if (typeof Data.ChangeTime !== "number") Data.ChangeTime = CommonTime() + FrameTime;

	if (Data.AnimationAngleState != TargetAngle && Data.ChangeTime < CommonTime()) {
		Data.AnimationSpeed = Math.max(Data.AnimationSpeed - ItemDevicesLuckyWheelAnimationSpeedStep, ItemDevicesLuckyWheelAnimationMinSpeed);
		Data.AnimationAngleState = (Data.AnimationAngleState + Data.AnimationSpeed) % 360;

		// Stop detected
		if (Data.AnimationSpeed == ItemDevicesLuckyWheelAnimationMinSpeed && Math.abs(Data.AnimationAngleState - TargetAngle) <= ItemDevicesLuckyWheelAnimationMinSpeed) {
			Data.AnimationAngleState = TargetAngle;
		}

		Data.ChangeTime = CommonTime() + FrameTime;
		AnimationRequestRefreshRate(C, FrameTime);
		AnimationRequestDraw(C);
	}
}

function AssetsItemDevicesLuckyWheelAfterDraw({ C, PersistentData, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	if (L === "_Text") {
		const Data = PersistentData();
		const CurrentAngle = Data.AnimationAngleState;
		const Properties = Property || {};
		const Item = InventoryGet(C, A.Group.Name);

		// Determine Color Layer/Text Status
		let storedTexts = Properties.Texts && Array.isArray(Properties.Texts) ? Properties.Texts.filter(T => typeof T === "string") : [];
		storedTexts = storedTexts.map(T => T.substring(0, ItemDevicesLuckyWheelMaxTextLength));
		const nbTexts = Math.max(Math.min(ItemDevicesLuckyWheelMaxTextLength, storedTexts.length), ItemDevicesLuckyWheelMinTexts);

		// Draw
		const height = 500;
		const width = 500;
		const diameter = height / 2;
		const degreeToRadians = (degrees) => degrees * Math.PI / 180;
		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		// Draw Background Colors
		// Save the canvas state and rotate by the calculated angle about the center point
		ctx.save();
		ctx.translate(diameter, diameter);
		ctx.rotate(degreeToRadians(CurrentAngle));
		ctx.translate(-diameter, -diameter);

		const SectionsPerNumTexts = {
			2: 2,
			3: 3,
			4: 2,
			5: 3,
			6: 3,
			7: 3,
			8: 2,
		};

		// Draw the background
		const colorLayerID = 10;
		for (let sectionID = 0; sectionID < SectionsPerNumTexts[nbTexts]; sectionID++) {
			const image = "Assets/Female3DCG/ItemDevices/LuckyWheel_" + nbTexts + "_" + (sectionID + 1) + ".png";
			const color = Item.Color[colorLayerID + sectionID] || "#888";
			// DrawImageCanvas(image, ctx, 0, 0, AlphaMasks);
			DrawImageCanvasColorize(image, ctx, 0, 0, 1, color, false, AlphaMasks);
		}


		// Restore the canvas rotation
		ctx.restore();

		// Validate & Draw Texts
		for (let i = 0; i < nbTexts; i++) {
			// Validate
			const validatedText = (storedTexts[i] && DynamicDrawTextRegex.test(storedTexts[i]) ? storedTexts[i] : "Prize " + 1);

			// Print text at an angle
			const sectorAngleSize = 360 / nbTexts;
			// coordinate of the end of the text being drawn: nth sector + center of current sector + offset from the spinning
			const coordDegree = (sectorAngleSize) * (i) + (sectorAngleSize / 2) + (CurrentAngle);
			const to = [
				height / 2,
				width / 2
			]; // Center of the wheel + constant
			const from = [
				diameter + diameter * Math.cos(degreeToRadians(coordDegree + 90 + (nbTexts % 2 !== 0 ? sectorAngleSize / 2 : 0))),
				diameter + diameter * Math.sin(degreeToRadians(coordDegree + 90 + (nbTexts % 2 !== 0 ? sectorAngleSize / 2 : 0)))
			]; // Appropriate point on the perimeter of a circle
			DynamicDrawTextFromTo(validatedText, ctx, from, to, {
				fontSize: 32,
				fontFamily: ItemDevicesLuckyWheelFont,
				color: Color,
				width: diameter - 40
			});
		}

		// We print the canvas on the character based on the asset position
		drawCanvas(tmpCanvas, X, Y, AlphaMasks);
		drawCanvasBlink(tmpCanvas, X, Y, AlphaMasks);
	}
}
