"use strict";

/**
 * Sets the character arousal level and validates the value
 * @param {Character} C - The character for which to set the arousal progress of
 * @param {number} Progress - Progress to set for the character (Ranges from 0 to 100)
 * @return {void} - Nothing
 */
function ArousalSetProgress(C, Progress) {
	if ((C.ArousalSettings.Progress == null) || (typeof C.ArousalSettings.Progress !== "number") || isNaN(C.ArousalSettings.Progress)) C.ArousalSettings.Progress = 0;
	if ((Progress == null) || (Progress < 0)) Progress = 0;
	if (Progress > 100) Progress = 100;
	if (Progress == 0) C.ArousalSettings.OrgasmTimer = 0;
	if (C.ArousalSettings.Progress != Progress) {
		C.ArousalSettings.Progress = Progress;
		C.ArousalSettings.ProgressTimer = 0;
		ChatRoomCharacterArousalSync(C);
	}
}

/**
 * Sets an activity progress on a timer, activities are capped at MaxProgress
 * @param {Character} C - The character for which to set the timer for
 * @param {object} Activity - The activity for which the timer is for
 * @param {string} Zone - The target zone of the activity
 * @param {number} Progress - Progress to set
 * @return {void} - Nothing
 */
function ArousalSetTimedProgress(C, Activity, Zone, Progress) {
	// If there's already a progress timer running, we add it's value but divide it by 2 to lessen the impact, the progress must be between -25 and 25
	if ((C.ArousalSettings.ProgressTimer == null) || (typeof C.ArousalSettings.ProgressTimer !== "number") || isNaN(C.ArousalSettings.ProgressTimer)) C.ArousalSettings.ProgressTimer = 0;
	Progress = Math.round((C.ArousalSettings.ProgressTimer / 2) + Progress);
	if (Progress < -25) Progress = -25;
	if (Progress > 25) Progress = 25;

	// Make sure we do not allow orgasms if the activity (MaxProgress) or the zone (AllowOrgasm) doesn't allow it
	var Max = ((Activity == null || Activity.MaxProgress == null) || (Activity.MaxProgress > 100)) ? 100 : Activity.MaxProgress;
	if ((Max > 95) && !PreferenceGetZoneOrgasm(C, Zone)) Max = 95;
	if ((Max > 67) && (Zone == "ActivityOnOther")) Max = 67;
	if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;

	// If we must apply a progress timer change, we publish it
	if ((C.ArousalSettings.ProgressTimer == null) || (C.ArousalSettings.ProgressTimer != Progress)) {
		C.ArousalSettings.ProgressTimer = Progress;
		ChatRoomCharacterArousalSync(C);
	}
}

/**
 * Set the current vibrator level for drawing purposes
 * @param {Character} C - Character for which the timer is progressing
 * @param {number} Level - Level from 0 to 4 (higher = more vibration)
 * @returns {void} - Nothing
 */
function ArousalSetVibratorLevel(C, Level) {
	if (C.ArousalSettings != null) {
		if (Level != C.ArousalSettings.VibratorLevel) {
			C.ArousalSettings.VibratorLevel = Level;
			C.ArousalSettings.ChangeTime = CommonTime();
		}
	}
}

/**
 * Triggers an orgasm for the player or an NPC which lasts from 5 to 15 seconds
 * @param {Character} C - Character for which an orgasm was triggered
 * @param {boolean} [Bypass=false] - If true, this will do a ruined orgasm rather than a real one
 * @returns {void} - Nothing
 */
function ArousalTriggerOrgasm(C, Bypass) {
	if (C.ID == 0)
		ActivityOrgasmRuined = false;

	if (C.Effect.includes("DenialMode")) {
		C.ArousalSettings.Progress = 99;
		if (C.ID == 0 && (Bypass || C.Effect.includes("RuinOrgasms"))) ActivityOrgasmRuined = true;
		else return;
	}

	if (C.IsEdged()) {
		C.ArousalSettings.Progress = 95;
		if (C.ID == 0 && Bypass) ActivityOrgasmRuined = true;
		else return;
	}

	if (C.ID == 0 && ActivityOrgasmRuined) {
		ArousalMinigameGenerate(0); // Resets the game
	}

	if ((C.ID == 0) || C.IsNpc()) {

		// Starts the timer and exits from dialog if necessary
		C.ArousalSettings.OrgasmTimer = (C.ID == 0) ? CurrentTime + 5000 : CurrentTime + (Math.random() * 10000) + 5000;
		C.ArousalSettings.OrgasmStage = (C.ID == 0) ? 0 : 2;
		if (C.ID == 0) ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;
		if ((CurrentCharacter != null) && ((C.ID == 0) || (CurrentCharacter.ID == C.ID))) DialogLeave();
		ChatRoomCharacterArousalSync(C);

		// If an NPC orgasmed, it will raise her love based on the horny trait
		if (C.IsNpc())
			if ((C.Love == null) || (C.Love < 60) || (C.IsOwner()) || (C.IsOwnedByPlayer()) || C.IsLoverPrivate())
				NPCLoveChange(C, Math.floor((NPCTraitGet(C, "Horny") + 100) / 20) + 1);

	}
}

/**
 * With time, we increase or decrease the arousal. Validates the result to keep it within 0 to 100 and triggers an orgasm when it reaches 100
 * @param {Character} C - Character for which the timer is progressing
 * @param {number} Progress - Progress made (from -100 to 100)
 * @returns {void} - Nothing
 */
function ArousalTimerTick(C, Progress) {
	// Changes the current arousal progress value
	C.ArousalSettings.Progress = C.ArousalSettings.Progress + Progress;
	// Decrease the vibratorlevel to 0 if not being aroused, while also updating the change time to reset the vibrator animation
	if (Progress < 0) {
		if (C.ArousalSettings.VibratorLevel != 0) {
			C.ArousalSettings.VibratorLevel = 0;
			C.ArousalSettings.ChangeTime = CommonTime();
		}
	}

	if (C.ArousalSettings.Progress < 0) C.ArousalSettings.Progress = 0;
	if (C.ArousalSettings.Progress > 100) C.ArousalSettings.Progress = 100;

	// Update the recent change time, so that on other player's screens the character's arousal meter will vibrate again when vibes start
	if (C.ArousalSettings.Progress == 0) {
		C.ArousalSettings.ChangeTime = CommonTime();
	}

	// Out of orgasm mode, it can affect facial expressions at every 10 steps
	if ((C.ArousalSettings.OrgasmTimer == null) || (typeof C.ArousalSettings.OrgasmTimer !== "number") || isNaN(C.ArousalSettings.OrgasmTimer) || (C.ArousalSettings.OrgasmTimer < CurrentTime))
		if (((C.ArousalSettings.AffectExpression == null) || C.ArousalSettings.AffectExpression) && ((C.ArousalSettings.Progress + ((Progress < 0) ? 1 : 0)) % 10 == 0))
			ArousalUpdateExpression(C, C.ArousalSettings.Progress);

	// Can trigger an orgasm
	if (C.ArousalSettings.Progress == 100) ArousalTriggerOrgasm(C);
}

/**
 * Sets a character's facial expressions based on their arousal level if their settings allow it.
 * @param {Character} C - Character for which to set the facial expressions
 * @param {number} Progress - Current arousal progress
 * @returns {void} - Nothing
 */
function ArousalUpdateExpression(C, Progress) {

	// Floors the progress to the nearest 10 to pick the expression
	Progress = Math.floor(Progress / 10) * 10;

	// The blushes goes to red progressively
	var Blush = null;
	if ((Progress == 10) || (Progress == 30) || (Progress == 50) || (Progress == 70)) Blush = "Low";
	if ((Progress == 60) || (Progress == 80) || (Progress == 90)) Blush = "Medium";
	if (Progress == 100) Blush = "High";

	// The eyebrows position changes
	var Eyebrows = null;
	if ((Progress == 20) || (Progress == 30)) Eyebrows = "Raised";
	if ((Progress == 50) || (Progress == 60)) Eyebrows = "Lowered";
	if ((Progress == 80) || (Progress == 90)) Eyebrows = "Soft";

	// Drool can activate at a few stages
	var Fluids = null;
	if ((Progress == 40) || (C.ArousalSettings.Progress == 70)) Fluids = "DroolLow";
	if (Progress == 100) Fluids = "DroolMedium";

	// Eyes can activate at a few stages
	var Eyes = null;
	if (Progress == 20) Eyes = "Dazed";
	if (Progress == 70) Eyes = "Horny";
	if (Progress == 90) Eyes = "Surprised";
	if (Progress == 100) Eyes = "Closed";

	// Find the expression in the character appearance and alters it
	for (let A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.Group.Name == "Blush") C.Appearance[A].Property = { Expression: Blush };
		if (C.Appearance[A].Asset.Group.Name == "Eyebrows") C.Appearance[A].Property = { Expression: Eyebrows };
		if (C.Appearance[A].Asset.Group.Name == "Fluids") C.Appearance[A].Property = { Expression: Fluids };
		if (C.Appearance[A].Asset.Group.Name == "Eyes") C.Appearance[A].Property = { Expression: Eyes };
		if (C.Appearance[A].Asset.Group.Name == "Eyes2") C.Appearance[A].Property = { Expression: Eyes };
	}

	// Refreshes the character
	CharacterRefresh(C, false);
}

/** Arousal Minigame */

/**
 * Ends the orgasm early if progress is close or progress is sufficient
 * @return {void} - Nothing
 */
function ArousalMinigameControl() {
	if ((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < Player.ArousalSettings.OrgasmTimer)) {
		// Ruin the orgasm
		if (ActivityOrgasmGameProgress >= ActivityOrgasmGameDifficulty - 1 || CurrentTime > Player.ArousalSettings.OrgasmTimer - 500) {
			if (CurrentScreen == "ChatRoom") {
				if (CurrentTime > Player.ArousalSettings.OrgasmTimer - 500) {
					if (Player.ArousalSettings.OrgasmStage == 0) {
						if ((CurrentScreen == "ChatRoom"))
							ChatRoomMessage({ Content: "OrgasmFailPassive" + (Math.floor(Math.random() * 3)).toString(), Type: "Action", Sender: Player.MemberNumber });
					} else {
						if ((CurrentScreen == "ChatRoom")) {
							let Dictionary = [];
							Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
							ServerSend("ChatRoomChat", { Content: "OrgasmFailTimeout" + (Math.floor(Math.random() * 3)).toString(), Type: "Activity", Dictionary: Dictionary });
							ChatRoomCharacterArousalSync(Player);
						}
					}
				} else {
					if ((CurrentScreen == "ChatRoom")) {
						let Dictionary = [];
						Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
						ServerSend("ChatRoomChat", { Content: ("OrgasmFailResist" + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: Dictionary });
						ChatRoomCharacterArousalSync(Player);
					}
				}
			}
			ActivityOrgasmGameResistCount++;
			ArousalMinigameStopOrgasm(Player, 65 + Math.ceil(Math.random()*20));
		}
	}
}

/**
 * Generates an orgasm button and progresses in the orgasm mini-game. Handles the resets and success/failures
 * @param {number} Progress - Progress of the currently running mini-game
 * @returns {void} - Nothing
 */
function ArousalMinigameGenerate(Progress) {

	// If we must reset the mini-game
	if (Progress == 0) {
		Player.ArousalSettings.OrgasmStage = 1;
		Player.ArousalSettings.OrgasmTimer = CurrentTime + 5000 + (SkillGetLevel(Player, "Willpower") * 1000);
		ActivityOrgasmGameTimer = Player.ArousalSettings.OrgasmTimer - CurrentTime;
		ActivityOrgasmGameDifficulty = (6 + (ActivityOrgasmGameResistCount * 2)) * (CommonIsMobile ? 1.5 : 1);
	}

	// Runs the game or finish it if the threshold is reached, it can trigger a chatroom message for everyone to see
	if (Progress >= ActivityOrgasmGameDifficulty) {
		if (CurrentScreen == "ChatRoom") {
			var Dictionary = [];
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
			ServerSend("ChatRoomChat", { Content: "OrgasmResist" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary });
		}
		ActivityOrgasmGameResistCount++;
		ArousalMinigameStopOrgasm(Player, 70);
	} else {
		ActivityOrgasmResistLabel = TextGet("OrgasmResist") + " (" + (ActivityOrgasmGameDifficulty - Progress).toString() + ")";
		ActivityOrgasmGameProgress = Progress;
		ActivityOrgasmGameButtonX = 50 + Math.floor(Math.random() * 650);
		ActivityOrgasmGameButtonY = 50 + Math.floor(Math.random() * 836);
	}
 }

/**
 * Starts an orgasm for a given character, lasts between 5 to 15 seconds and can be displayed in a chatroom.
 * @param {Character} C - Character for which an orgasm is starting
 * @returns {void} - Nothing
 */

function ArousalMinigameStartOrgasm(C) {
	if ((C.ID == 0) || C.IsNpc()) {
		if (C.ID == 0 && !ActivityOrgasmRuined) ActivityOrgasmGameResistCount = 0;
		AsylumGGTSTOrgasm(C);
		ArousalMinigameWillpowerProgress(C);

		if (!ActivityOrgasmRuined) {

			C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
			C.ArousalSettings.OrgasmStage = 2;
			C.ArousalSettings.OrgasmCount = (C.ArousalSettings.OrgasmCount == null) ? 1 : C.ArousalSettings.OrgasmCount + 1;
			ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;

			if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
				let Dictionary = [];
				Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary });
				ChatRoomCharacterArousalSync(C);
			}
		} else {
			ArousalMinigameStopOrgasm(Player, 65 + Math.ceil(Math.random()*20));

			if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
				let Dictionary = [];
				let ChatModifier = C.ArousalSettings.OrgasmStage == 1 ? "Timeout" : "Surrender";
				Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: ("OrgasmFail" + ChatModifier + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: Dictionary });
				ChatRoomCharacterArousalSync(C);
			}
		}
	}
}

/**
 * Triggered when an orgasm needs to be stopped
 * @param {Character} C - Character for which to stop the orgasm
 * @param {number} Progress - Arousal level to set the character at once the orgasm ends
 * @returns {void} - Nothing
 */
function ArousalMinigameStopOrgasm(C, Progress) {
	if ((C.ID == 0) || C.IsNpc()) {
		ArousalMinigameWillpowerProgress(C);
		C.ArousalSettings.OrgasmTimer = 0;
		C.ArousalSettings.OrgasmStage = 0;
		ArousalSetProgress(C, Progress);
		ArousalTimerTick(C, 0);
		ChatRoomCharacterArousalSync(C);
	}
}

/**
 * Increases the player's willpower when resisting an orgasm.
 * @param {Character} C - The character currently resisting
 * @return {void} - Nothing
 */
function ArousalMinigameWillpowerProgress(C) {
	if ((C.ID == 0) && (ActivityOrgasmGameProgress > 0)) {
		SkillProgress("Willpower", ActivityOrgasmGameProgress);
		ActivityOrgasmGameProgress = 0;
	}
}

/**
 * Draws the arousal progress bar at the given coordinates for every orgasm timer.
 * @param {number} X - Position on the X axis
 * @param {number} Y - Position on the Y axis
 * @return {void} - Nothing
 */
function ArousalMinigameProgressBarDraw(X, Y) {
	var Pos = 0;
	if ((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < Player.ArousalSettings.OrgasmTimer))
		Pos = ((Player.ArousalSettings.OrgasmTimer - CurrentTime) / ActivityOrgasmGameTimer) * 100;
	if (Pos < 0) Pos = 0;
	if (Pos > 100) Pos = 100;
	DrawProgressBar(X, Y, 900, 25, Pos);
}
