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

/**
 * Helper to generate section labels
 * @param {number} num
 * @returns {string}
 */
function ItemDevicesLuckyWheelLabelForNum(num) {
	return DialogFindPlayer("LuckyWheelSectionDefaultLabel").replace("NUM", num.toString());
}

/**
 * Modular item hook to draw the spin button on every subscreeen
 */
function InventoryItemDevicesLuckyWheelDrawHook(next) {
	if (ModularItemDataLookup.ItemDevicesLuckyWheel.currentModule === "Game")
		DrawButton(1370, 800, 260, 64, DialogFindPlayer("LuckyWheelTrigger"), "white");
	next();
}

/**
 * Modular item hook to handle clicks on the spin button on every subscreeen
 */
function InventoryItemDevicesLuckyWheelClickHook(next) {
	if (ModularItemDataLookup.ItemDevicesLuckyWheel.currentModule === "Game") {
		if (MouseIn(1370, 800, 260, 64)) {
			InventoryItemDevicesLuckyWheelTrigger();
			return;
		}
	}

	next();
}

/*
 *
 * @param {Item} Item
 */
function InventoryItemDevicesLuckyWheelInit(Item) {
	DynamicDrawLoadFont(ItemDevicesLuckyWheelFont);

	if (!Item.Property) Item.Property = {};
	if (typeof Item.Property.TargetAngle !== "number") Item.Property.TargetAngle = 0;
	if (!Array.isArray(Item.Property.Texts)) Item.Property.Texts = [];
	if (Item.Property.Texts.length > ItemDevicesLuckyWheelMaxTexts)
		Item.Property.Texts = Item.Property.Texts.splice(0, ItemDevicesLuckyWheelMaxTexts);
	if (typeof Item.Property.Texts[0] !== "string") Item.Property.Texts[0] = ItemDevicesLuckyWheelLabelForNum(1);
	if (typeof Item.Property.Texts[1] !== "string") Item.Property.Texts[1] = ItemDevicesLuckyWheelLabelForNum(2);
}

/**
 * Lucky Wheel Game subscreen load handler
 */
function InventoryItemDevicesLuckyWheelGame0Load() {
	InventoryItemDevicesLuckyWheelInit(DialogFocusItem);

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

}

function InventoryItemDevicesLuckyWheelGame0Click() {
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemDevicesLuckyWheelGame0Exit();
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

	for (let num = 0; num < ItemDevicesLuckyWheelMaxTexts; num++) {
		if (num < DialogFocusItem.Property.Texts.length) {
			const text = ElementValue(`LuckyWheelText${num}`);
			if (text != DialogFocusItem.Property.Texts[num]) {
				DialogFocusItem.Property.Texts[num] = text;
			}
		}

		ElementRemove(`LuckyWheelText${num}`);
	}

	const C = CharacterGetCurrent();
	ChatRoomCharacterItemUpdate(C);
	CharacterRefresh(C, true, false);

	ExtendedItemSubscreen = null;
}

function InventoryItemDevicesLuckyWheelUpdate() {
	CharacterRefresh(CharacterGetCurrent(), false);
}

function InventoryItemDevicesLuckyWheelTrigger() {
	const randomAngle = Math.round(Math.random() * 360);
	DialogFocusItem.Property.TargetAngle = randomAngle;
	ChatRoomCharacterItemUpdate(CharacterGetCurrent());

	const C = CharacterGetCurrent();
	const Dictionary = new DictionaryBuilder()
		.sourceCharacter(Player)
		.destinationCharacter(C)
		.build();
	ChatRoomPublishCustomAction("LuckyWheelStartTurning", true, Dictionary);
}

function InventoryItemDevicesLuckyWheelStoppedTurning(C, Item, Angle) {
	if (!C.IsPlayer() || Item.Asset.Name !== "LuckyWheel") return;

	let storedTexts = Item.Property.Texts && Array.isArray(Item.Property.Texts) ? Item.Property.Texts.filter(T => typeof T === "string") : [];
	storedTexts = storedTexts.map(T => T.substring(0, ItemDevicesLuckyWheelMaxTextLength));
	const nbTexts = Math.max(Math.min(ItemDevicesLuckyWheelMaxTextLength, storedTexts.length), ItemDevicesLuckyWheelMinTexts);
	const sectorAngleSize = 360 / nbTexts;


	const startingAngle = sectorAngleSize * (Math.floor(nbTexts / 2) - 1);
	const landedIn = (nbTexts - Math.floor((Angle - startingAngle) / sectorAngleSize)) % nbTexts;
	const section = storedTexts[landedIn];

	const Dictionary = new DictionaryBuilder()
		.sourceCharacter(C)
		.text("SectionName", section)
		.build();

	ChatRoomPublishCustomAction("LuckyWheelStoppedTurning", true, Dictionary);
}

/** @type {DynamicScriptDrawCallback} */
function AssetsItemDevicesLuckyWheelScriptDraw({ C, PersistentData, Item }) {
	const Data = PersistentData();
	const Properties = Item.Property || {};
	const TargetAngle = Math.min(Math.max(Properties.TargetAngle || 0, 0), 360);
	const FrameTime = ItemDevicesLuckyWheelAnimationFrameTime;

	InventoryItemDevicesLuckyWheelInit(Item);

	// Initialized to a non-spinning value (aka target value), to avoid "misfires" on asset load
	if (typeof Data.AnimationAngleState !== "number") Data.AnimationAngleState = TargetAngle;
	if (typeof Data.AnimationSpeed !== "number" || Data.AnimationAngleState == TargetAngle) Data.AnimationSpeed = ItemDevicesLuckyWheelAnimationMaxSpeed;
	if (typeof Data.ChangeTime !== "number") Data.ChangeTime = CommonTime() + FrameTime;
	if (typeof Data.LightStep !== "number" || isNaN(Data.LightStep)) Data.LightStep = 0;

	if (Data.AnimationAngleState != TargetAngle && Data.ChangeTime < CommonTime()) {
		Data.AnimationSpeed = Math.max(Data.AnimationSpeed - ItemDevicesLuckyWheelAnimationSpeedStep, ItemDevicesLuckyWheelAnimationMinSpeed);
		Data.AnimationAngleState = (Data.AnimationAngleState + Data.AnimationSpeed) % 360;

		// Stop detected
		if (Data.AnimationSpeed == ItemDevicesLuckyWheelAnimationMinSpeed && Math.abs(Data.AnimationAngleState - TargetAngle) <= ItemDevicesLuckyWheelAnimationMinSpeed) {
			Data.AnimationAngleState = TargetAngle;
			InventoryItemDevicesLuckyWheelStoppedTurning(C, Item, TargetAngle);
		}

		Data.ChangeTime = CommonTime() + FrameTime;
		AnimationRequestRefreshRate(C, FrameTime);
		AnimationRequestDraw(C);
	}
}

/** @type {DynamicAfterDrawCallback} */
function AssetsItemDevicesLuckyWheelAfterDraw({ C, PersistentData, A, X, Y, L, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	const height = 500;
	const width = 500;

	if (L === "_BlinkingLights") {
		const Data = PersistentData();
		const CurrentAngle = Data.AnimationAngleState;
		const Properties = Property || {};

		/** Only draw lights when spinning */
		if (!Properties.TargetAngle || Properties.TargetAngle === CurrentAngle)
			return;

		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		if (C.IsInverted()) {
			ctx.rotate(Math.PI);
			ctx.translate(-tmpCanvas.width, -tmpCanvas.height);
			Y -= 500;
		}

		if (Data.AnimationSpeed < 2 * ItemDevicesLuckyWheelAnimationMinSpeed) {
			// Start blinking
			Data.LightStep = (++Data.LightStep) % 2;

			if (Data.LightStep === 0)
				return;

			const image = "Assets/Female3DCG/ItemDevices/LuckyWheel_BlinkingLights_All.png";
			DrawImageCanvas(image, ctx, 0, 0, AlphaMasks);
		} else {
			// Light trace
			Data.LightStep = (++Data.LightStep) % 3;

			const image = "Assets/Female3DCG/ItemDevices/LuckyWheel_BlinkingLights_" + (Data.LightStep + 1) + ".png";
			DrawImageCanvas(image, ctx, 0, 0, AlphaMasks);
		}

		drawCanvas(tmpCanvas, X, Y, AlphaMasks);
		drawCanvasBlink(tmpCanvas, X, Y, AlphaMasks);
	}

	if (L === "_Text") {
		const Data = PersistentData();
		const CurrentAngle = Data.AnimationAngleState;
		const Properties = Property || {};
		const Item = InventoryGet(C, A.Group.Name);

		DynamicDrawLoadFont(ItemDevicesLuckyWheelFont);

		// Determine Color Layer/Text Status
		let storedTexts = Properties.Texts && Array.isArray(Properties.Texts) ? Properties.Texts.filter(T => typeof T === "string") : [];
		storedTexts = storedTexts.map(T => T.substring(0, ItemDevicesLuckyWheelMaxTextLength));
		const nbTexts = Math.max(Math.min(ItemDevicesLuckyWheelMaxTextLength, storedTexts.length), ItemDevicesLuckyWheelMinTexts);

		// Draw
		const diameter = height / 2;
		const degreeToRadians = (degrees) => degrees * Math.PI / 180;
		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		if (C.IsInverted()) {
			ctx.rotate(Math.PI);
			ctx.translate(-tmpCanvas.width, -tmpCanvas.height);
			Y -= 500;
		}

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
			const validatedText = (storedTexts[i] && DynamicDrawTextRegex.test(storedTexts[i]) ? storedTexts[i] : ItemDevicesLuckyWheelLabelForNum(i + 1));

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
