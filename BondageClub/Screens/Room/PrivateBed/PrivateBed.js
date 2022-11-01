"use strict";
var PrivateBedBackground = "Private";
var PrivateBedCharacter = [];
var PrivateBedActivity = "Caress";
var PrivateBedActivityList = [];
var PrivateBedLog = [];
var PrivateBedActivityTimer = 0;

/**
 * Loads the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedLoad() {
	PrivateBedLog = [];
	CharacterSetActivePose(Player, null, true);
	PrivateBedBackground = PrivateBackground;
	PrivateBedCharacter = [];
	PrivateBedCharacter.push(Player);
	Player.PrivateBedLeft = 1100;
	Player.PrivateBedTop = 0;
	if (Player.HeightRatio != null) Player.PrivateBedTop = (1 - Player.HeightRatio) * -1000;
	PrivateBedActivityList = [];
	for (let A of ActivityFemale3DCG)
		if ((A.Name != null) && !A.Name.includes("Item") && !A.Name.includes("Inject") && (A.MaxProgress != null) && (A.MaxProgress > 0))
			if ((A.Prerequisite == null) || !A.Prerequisite.includes("UseTongue") || !Player.IsGagged())
				if ((A.Prerequisite == null) || !A.Prerequisite.includes("UseMouth") || !Player.IsGagged())
					if ((A.Prerequisite == null) || !A.Prerequisite.includes("IsGagged") || Player.IsGagged())
						if ((A.Prerequisite == null) || !A.Prerequisite.includes("IsGagged") || Player.IsGagged())
							PrivateBedActivityList.push(A.Name);
}

/**
 * Draws a private bedroom character.
 * @param {Character} C - The character to draw.
 * @returns {void} - Nothing.
 */
function PrivateBedDrawCharacter(C) {
	if (C.PrivateBedMoveTimer == null) C.PrivateBedMoveTimer = 0;
	if (C.PrivateBedMoveTimer < CommonTime()) {
		CharacterSetActivePose(C, CommonRandomItemFromList("NONE", ["OverTheHead", "Yoked", null]));
		CharacterSetActivePose(C, CommonRandomItemFromList("NONE", ["LegsOpen", "LegsClosed"]));
		C.PrivateBedMoveTimer = CommonTime() + 10000 + Math.round(Math.random() * 20000);
	}
	DrawCharacter(C, C.PrivateBedLeft, C.PrivateBedTop, 1);
}

/**
 * Runs the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedRun() {

	// Draws the bed & characters
	if (LogQuery("BedBlack", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/Black.png", 0, 0);
	if (LogQuery("BedWhite", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/White.png", 0, 0);
	for (let C of PrivateBedCharacter)
		PrivateBedDrawCharacter(C);

	// In orgasm mode, we add a pink filter and different controls depending on the stage
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Active != "Inactive") && (Player.ArousalSettings.Active != "NoMeter")) {
		if ((Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {
			DrawRect(0, 0, 2000, 1000, "#FFB0B0B0");
			if (Player.ArousalSettings.OrgasmStage == null) Player.ArousalSettings.OrgasmStage = 0;
			if (Player.ArousalSettings.OrgasmStage == 0) {
				DrawText(TextGet("OrgasmComing"), 1000, 410, "White", "Black");
				DrawButton(700, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(1050, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (Player.ArousalSettings.OrgasmStage == 1) DrawButton(ActivityOrgasmGameButtonX + 500, ActivityOrgasmGameButtonY, 250, 64, ActivityOrgasmResistLabel, "White");
			if (ActivityOrgasmRuined) ActivityOrgasmControl();
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 1000, 500, "White", "Black");
			ActivityOrgasmProgressBar(550, 970);
			return;
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 1) && (Player.ArousalSettings.Progress <= 99)) ChatRoomDrawArousalScreenFilter(0, 1000, 2000, Player.ArousalSettings.Progress);
	}

	// Draws all the buttons
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (Player.CanChangeOwnClothes()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Dress.png", TextGet("Dress"));
	DrawButton(1885, 265, 90, 90, "", "White", "Icons/Character.png", TextGet("Character"));
	if (PrivateBedActivityTimer > CommonTime()) {
		DrawText(ActivityDictionaryText("Activity" + PrivateBedActivity), 430, 120, "White", "Black");
		let Progress = 100 - (PrivateBedActivityTimer - CommonTime()) / 50;
		DrawProgressBar(20, 180, 820, 80, Progress);
	} else {
		for (let A = PrivateBedActivityList.length - 1; A >= 0; A--) {
			let X = 20 + ((A % 9) * 91);
			let Y = 20 + Math.floor(A / 9) * 91;
			DrawRect(X, Y, 90, 90, (MouseIn(X, Y, 90, 90) && !CommonIsMobile) ? "Cyan" : ((PrivateBedActivityList[A] == PrivateBedActivity) ? "#AAFFAA" : "White"));
			DrawEmptyRect(X, Y, 91, 91, "Black", 2);
			DrawImageResize("Assets/Female3DCG/Activity/" + PrivateBedActivityList[A] + ".png", X + 2, Y + 2, 87, 87);
			if (MouseIn(X, Y, 90, 90)) DrawButtonHover(X, Y, 90, 90, ActivityDictionaryText("Activity" + PrivateBedActivityList[A]));
		}
	}
	DrawRect(20, 400, 820, 580, "#000000B0");
	DrawEmptyRect(20, 400, 820, 580, "#FFFFFF", 2);
	for (let L = PrivateBedLog.length - 1; L >= 0; L--)
		DrawTextFit(PrivateBedLog[L], 430, (L * 55) + 445, 800, "#FFFFFF", "#000000");

	// If we move the mouse over a character or a zone, we highlight it
	if (!CommonIsMobile)
		for (let C of PrivateBedCharacter) {
			if ((MouseX >= C.PrivateBedLeft + 60) && (MouseX <= C.PrivateBedLeft + 140) && (MouseY >= C.PrivateBedTop + 400) && (MouseY <= C.PrivateBedTop + 500) && !C.ArousalZoom) { DrawEmptyRect(C.PrivateBedLeft + 60, C.PrivateBedTop + 400, 80, 100, "Cyan", 3); break; }
			if ((MouseX >= C.PrivateBedLeft + 50) && (MouseX <= C.PrivateBedLeft + 150) && (MouseY >= C.PrivateBedTop + 615) && (MouseY <= C.PrivateBedTop + 715) && C.ArousalZoom) { DrawEmptyRect(C.PrivateBedLeft + 50, C.PrivateBedTop + 615, 100, 100, "Cyan", 3); break; }
			if (MouseIn(C.PrivateBedLeft, C.PrivateBedTop, 500, C.HeightRatio * 1000))
				for (let A = 0; A < AssetGroup.length; A++)
					if ((AssetGroup[A].Zone != null) && !AssetGroup[A].MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", AssetGroup[A].Name).length)
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							DrawEmptyRect(AssetGroup[A].Zone[Z][0] + C.PrivateBedLeft, AssetGroup[A].Zone[Z][1] + C.PrivateBedTop, AssetGroup[A].Zone[Z][2], AssetGroup[A].Zone[Z][3], (MouseIn(AssetGroup[A].Zone[Z][0] + C.PrivateBedLeft, AssetGroup[A].Zone[Z][1] + C.PrivateBedTop, AssetGroup[A].Zone[Z][2], AssetGroup[A].Zone[Z][3])) ? "Cyan" : "#00000040", 3);
		}

}

/**
 * Starts an arousal action on a character.
 * @param {Character} Source - The source character.
 * @param {Character} Target - The target character.
 * @param {AssetGroup} Group - The zone / group to target.
 * @param {String} Activity - The activity to do.
 * @returns {void} - Nothing.
 */
function PrivateBedActivityStart(Source, Target, Group, Activity) {
	if (Source.IsPlayer()) PrivateBedActivityTimer = CommonTime() + 5000;
	ActivityEffect(Source, Target, Activity, Group.Name, 1);
	if (PrivateBedLog.length >= 10) PrivateBedLog.splice(0, 1);
	let Text = ActivityDictionaryText(ActivityBuildChatTag(Target, Group, AssetGetActivity(Source.AssetFamily, Activity), false));
	Text = Text.replace("SourceCharacter", CharacterNickname(Source));
	Text = Text.replace("TargetCharacter", CharacterNickname(Target));
	PrivateBedLog.push(Text);
}

/**
 * Handles clicks in the private bedroom.
 * @returns {void} - Nothing.
 */
function PrivateBedClick() {

	// If an orgasm is going on, we do not process any other clicks
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if ((MouseX >= 700) && (MouseX <= 950) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if ((MouseX >= 1050) && (MouseX <= 1300) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX + 500) && (MouseX <= ActivityOrgasmGameButtonX + 700) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// Bedroom buttons on the right side
	if (MouseIn(1885, 25, 90, 90)) PrivateBedExit();
	if (MouseIn(1885, 145, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90)) CharacterSetCurrent(Player);

	// Cannot do more than 1 action each 5 seconds
	if (PrivateBedActivityTimer > CommonTime()) return;

	// Activity buttons on the left side
	for (let A = PrivateBedActivityList.length - 1; A >= 0; A--) {
		let X = 20 + ((A % 9) * 91);
		let Y = 20 + Math.floor(A / 9) * 91;
		if (MouseIn(X, Y, 90, 90)) PrivateBedActivity = PrivateBedActivityList[A];
	}

	// If a character is clicked
	for (let C of PrivateBedCharacter) {

		// The arousal meter can be maximized or minimized by clicking on it
		if ((MouseX >= C.PrivateBedLeft + 60) && (MouseX <= C.PrivateBedLeft + 140) && (MouseY >= C.PrivateBedTop + 400) && (MouseY <= C.PrivateBedTop + 500) && !C.ArousalZoom) { C.ArousalZoom = true; return; }
		if ((MouseX >= C.PrivateBedLeft + 50) && (MouseX <= C.PrivateBedLeft + 150) && (MouseY >= C.PrivateBedTop + 615) && (MouseY <= C.PrivateBedTop + 715) && C.ArousalZoom) { C.ArousalZoom = false; return; }

		// If we click in an arousal zone, we can trigger that activity
		if (MouseIn(C.PrivateBedLeft, C.PrivateBedTop, 500, C.HeightRatio * 1000))
			for (let A = 0; A < AssetGroup.length; A++)
				if ((AssetGroup[A].Zone != null) && !AssetGroup[A].MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", AssetGroup[A].Name).length)
					if (ActivityCanBeDone(C, PrivateBedActivity, AssetGroup[A].Name) && !InventoryGroupIsBlocked(C, AssetGroup[A].Name, true))
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if (DialogClickedInZone(C, AssetGroup[A].Zone[Z], 1, C.PrivateBedLeft, C.PrivateBedTop, C.HeightRatio))
								return PrivateBedActivityStart(Player, C, AssetGroup[A], PrivateBedActivity);

	}

}

/**
 * When the player exits the private bedroom.
 * @returns {void} - Nothing.
 */
function PrivateBedExit(Type) {
	for (let C of PrivateBedCharacter) {
		CharacterSetActivePose(C, null);
		CharacterSetActivePose(C, "LegsOpen");
	}
	CommonSetScreen("Room", "Private");
}

/**
 * When a character gets an orgasm
 * @param {Character} C - The character getting the orgasm.
 * @returns {void} - Nothing.
 */
function PrivateBedOrgasm(C) {
	if (CurrentScreen != "PrivateBed") return;
	if (PrivateBedLog.length >= 10) PrivateBedLog.splice(0, 1);
	let Text = ActivityDictionaryText("Orgasm" + Math.floor(Math.random() * 10));
	Text = Text.replace("SourceCharacter", CharacterNickname(C));
	PrivateBedLog.push(Text);
}