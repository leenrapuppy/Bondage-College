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
