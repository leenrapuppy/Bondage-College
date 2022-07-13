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

function InventoryItemDevicesLuckyWheelSettings0Load() {
	DynamicDrawLoadFont(ItemDevicesLuckyWheelFont);

	if (!DialogFocusItem.Property) DialogFocusItem.Property = {};
	if (typeof DialogFocusItem.Property.TargetAngle !== "number") DialogFocusItem.Property.TargetAngle = 0;
	if (!Array.isArray(DialogFocusItem.Property.Texts)) DialogFocusItem.Property.Texts = [];
	if (DialogFocusItem.Property.Texts.length > ItemDevicesLuckyWheelMaxTexts)
		DialogFocusItem.Property.Texts = DialogFocusItem.Property.Texts.splice(0, ItemDevicesLuckyWheelMaxTexts);
	if (typeof DialogFocusItem.Property.Texts[0] !== "string") DialogFocusItem.Property.Texts[0] = "Prize 1";
	if (typeof DialogFocusItem.Property.Texts[1] !== "string") DialogFocusItem.Property.Texts[1] = "Prize 2";

	const input1 = ElementCreateInput("LuckyWheelText0", "input", DialogFocusItem.Property.Texts[0], ItemDevicesLuckyWheelMaxTextLength);
	if (input1) input1.pattern = DynamicDrawTextInputPattern;
	const input2 = ElementCreateInput("LuckyWheelText1", "input", DialogFocusItem.Property.Texts[1], ItemDevicesLuckyWheelMaxTextLength);
	if (input2) input2.pattern = DynamicDrawTextInputPattern;
}

function InventoryItemDevicesLuckyWheelSettings0Draw() {
	// Draw the header and item
	DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

	for (let num = 0; num < DialogFocusItem.Property.Texts.length; num++) {
		ElementPosition(`LuckyWheelText${num}`, 1510, 500 + (num * 60), 300);
	}

	DrawButton(1380, 800, 260, 64, DialogFindPlayer("LuckyWheelTrigger"), "white");
}

function InventoryItemDevicesLuckyWheelSettings0Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemDevicesLuckyWheelSettings0Exit();
		return;
	}

	if (MouseIn(1380, 800, 260, 64)) {
		InventoryItemDevicesLuckyWheelTrigger();
		return;
	}
}

function InventoryItemDevicesLuckyWheelSettings0Exit() {
	if (!DialogFocusItem) return;

	let needsUpdate = false;
	for (let num = 0; num < ItemDevicesLuckyWheelMaxTexts; num++) {
		if (num < DialogFocusItem.Property.Texts.length) {
			const text = ElementValue(`LuckyWheelText${num}`)
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

function InventoryItemDevicesLuckyWheelTrigger() {
	const randomAngle = Math.round(Math.random() * 360);
	DialogFocusItem.Property.TargetAngle = randomAngle;

	/** @type {ChatMessageDictionary} */
	let Dictionary = [];
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

function AssetsItemDevicesLuckyWheelAfterDraw({ C, PersistentData, Item, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	if (L === "_Text") {
		const Data = PersistentData();
		const CurrentAngle = Data.AnimationAngleState;
		const Properties = Property || {};

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
		// Draw the background
		DrawImageCanvas("Assets/Female3DCG/ItemDevices/LuckyWheel_" + nbTexts + ".png", ctx, 0, 0, AlphaMasks);

		// Restore the canvas rotation
		ctx.restore();

		// Validate & Draw Texts
		for (let i = 0; i < nbTexts; i++) {
			// Validate
			const validatedText = "    " + (storedTexts[i] && DynamicDrawTextRegex.test(storedTexts[i]) ? storedTexts[i] : "Prize " + 1);

			// Print text at an angle
			const sectorAngleSize = 360 / nbTexts;
			// coordinate of the end of the text being drawn: nth sector + center of current sector + offset from the spinning
			const coordDegree = (sectorAngleSize) * (i) + (sectorAngleSize / 2) + (CurrentAngle);
			const to = [
				height / 2,
				width / 2
			]; // Center of the wheel + constant
			const from = [
				diameter + diameter * Math.cos(degreeToRadians(coordDegree)),
				diameter + diameter * Math.sin(degreeToRadians(coordDegree))
			]; // Appropriate point on the perimeter of a circle
			DynamicDrawTextFromTo(validatedText, ctx, from, to, {
				fontSize: 24,
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
