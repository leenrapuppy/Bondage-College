"use strict";

/** @type {Record<"Inactive"|"NoMeter"|"Manual"|"Hybrid"|"Automatic", ArousalMeterMode>} */
const ArousalMode = {
	Inactive: "Inactive",
	NoMeter: "NoMeter",
	Manual: "Manual",
	Hybrid: "Hybrid",
	Automatic: "Automatic",
};

/** @type {Record<"All"|"Access"|"Self", ArousalAccessMode>} */
const ArousalAccess = {
	All: "All",
	Access: "Access",
	Self: "Self",
};

/** @type {Record<"Inactive"|"Animated"|"AnimatedTemp", ArousalVFXMode>} */
const ArousalVFX = {
	Inactive: "VFXInactive",
	Animated: "VFXAnimated",
	AnimatedTemp: "VFXAnimatedTemp",
};

/** @type {Record<"Light"|"Medium"|"Heavy", ArousalVFXFilterMode>} */
const ArousalVFXFilter = {
	Light: "VFXFilterLight",
	Medium: "VFXFilterMedium",
	Heavy: "VFXFilterHeavy",
};

/** @type {Record<"None"|"Arousal"|"Vibration"|"All", ArousalStutterMode>} */
const ArousalStutter = {
	None: "None",
	Arousal: "Arousal",
	Vibration: "Vibration",
	All: "All"
};

/** Number of times a Resist button was clicked */
let ArousalMinigameStep = 0;
/** Maximum number of steps */
let ArousalMinigameDifficulty = 0;
/** A counter keeping track of the Resist successes */
let ArousalMinigameResistCount = 0;
/** The arousal game time */
let ArousalMinigameTimer = 0;
/** The current minigame Resist button values */
const ArousalMinigameButton = { x: 0, y: 0, label: null };

/** Should the next orgasm be ruined right before it happens */
let ArousalOrgasmShouldRuin = false;

/**
 * Check a player or character's arousal mode against a list.
 * @param {Character|Player} character - The character or player to read arousal from
 * @param {Array<ArousalMeterMode>} modes - The arousal modes
 * @returns {boolean|null}
 */
function ArousalIsInMode(character, modes) {
	if (character.ArousalSettings && character.ArousalSettings.Active)
		return modes.includes(character.ArousalSettings.Active);
	return false;
}

/**
 * Check whether a player or character's can be aroused.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {boolean|null}
 */
function ArousalIsActive(character) {
	return ArousalIsInMode(character, [ArousalMode.Manual, ArousalMode.Hybrid, ArousalMode.Automatic]);
}

/**
 * Returns a player or character's arousal progress value.
 * @param {Character|Player} character - The character to read arousal from
 * @returns {number|null}
 */
function ArousalGetProgress(character) {
	if (!ArousalIsActive(character)) return 0;
	if (character.ArousalSettings && typeof character.ArousalSettings.Progress === "number" && !isNaN(character.ArousalSettings.Progress))
		return character.ArousalSettings.Progress;
	return null;
}

/**
 * Sets the character arousal level and validates the value
 * @param {Character} character - The character for which to set the arousal progress of
 * @param {number} value - Progress to set for the character (Ranges from 0 to 100)
 * @param {boolean} [resetTimer=true] - Force the progress timer to 0, stopping all arousal
 * @return {void} - Nothing
 */
function ArousalSetProgress(character, value, resetTimer = true) {
	if (!ArousalIsActive(character)) return;

	// Clamp arousal values to [0, 100]
	if ((value == null) || (value < 0)) value = 0;
	if (value > 100) value = 100;

	if (value == 0) {
		// Progress hit 0 again, clear the timer
		character.ArousalSettings.OrgasmTimer = 0;

		// Update the recent change time, so that on other player's
		// screens the character's arousal meter will vibrate again
		// when vibes start
		character.ArousalSettings.ChangeTime = CommonTime();
	}

	if (character.ArousalSettings.Progress == value) return;

	character.ArousalSettings.Progress = value;
	if (resetTimer)
		character.ArousalSettings.ProgressTimer = 0;

	ChatRoomCharacterArousalSync(character);
}

/**
 * Returns a player or character's arousal access mode.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {ArousalAccessMode|null}
 */
function ArousalGetAccessMode(character) {
	if (character.ArousalSettings && character.ArousalSettings.Visible)
		return character.ArousalSettings.Visible;
	return null;
}

/**
 * Returns a player or character's arousal progress value.
 * @param {Character|Player} character - The character or player to read arousal from
 * @param {number|null} lower - The lower bound, excluded
 * @param {number|null} upper - The upper bound, excluded
 * @returns {boolean}
 */
function ArousalIsArousalBetween(character, lower, upper) {
	const arousal = ArousalGetProgress(character);
	return (
		arousal !== null &&
		(lower === null || arousal > lower) &&
		(upper === null || arousal < upper)
	);
}

/**
 * Returns a player or character's auto-stuttering setting.
 * @param {Character|Player} character
 * @returns {ArousalStutterMode}
 */
function ArousalGetStutterSetting(character) {
	if (character.ArousalSettings && character.ArousalSettings.AffectStutter)
		return character.ArousalSettings.AffectStutter;
	return ArousalStutter.All;
}

/**
 * Returns a player or character's orgasm stage value.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {number} - 0 is no orgasm, 1 means minigame is in progress, 2 means is orgasming
 */
function ArousalGetOrgasmStage(character) {
	if (character.ArousalSettings && character.ArousalSettings.OrgasmStage)
		return character.ArousalSettings.OrgasmStage;
	return 0;
}

/**
 * Returns a player or character's orgasm timer value.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {number}
 */
function ArousalGetOrgasmTimer(character) {
	if (character.ArousalSettings && character.ArousalSettings.OrgasmTimer)
		return character.ArousalSettings.OrgasmTimer;
	return 0;
}

/**
 * Returns a player or character's orgasm count.
 * @param {Character|Player} character
 * @returns {number}
 */
function ArousalGetOrgasmCount(character) {
	if (character.ArousalSettings && typeof character.ArousalSettings.OrgasmCount === "number")
		return character.ArousalSettings.OrgasmCount;
	return 0;
}

/**
 * Returns whether a player or character's arousal affects its expression.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {boolean}
 */
function ArousalAffectsExpression(character) {
	if (character.ArousalSettings && character.ArousalSettings.AffectExpression)
		return !!character.ArousalSettings.AffectExpression;
	return false;
}

/**
 * Returns whether a player or character's can see others' arousal meters.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {boolean}
 */
function ArousalShowsMeter(character) {
	if (character.ArousalSettings && character.ArousalSettings.ShowOtherMeter)
		return !!character.ArousalSettings.ShowOtherMeter;
	return false;
}

/**
 * Returns whether a player or character's can see others' arousal meters.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {boolean}
 */
function ArousalCanChangeMeter(character) {
	const access = ArousalGetAccessMode(character);
	return (access === ArousalAccess.Access && character.AllowItem) || access === ArousalAccess.All;
}

/**
 * Does the character allow advanced vibrating modes on itself?
 * @param {Character|Player} character
 */
function ArousalHasAdvancedVibesDisabled(character) {
	if (character.ArousalSettings && typeof character.ArousalSettings.DisableAdvancedVibes === "boolean")
		return character.ArousalSettings.DisableAdvancedVibes;
	return false;
}

/**
 * Returns the current timed progress for a character.
 * @param {Character|Player} character - The character or player to read arousal from
 * @returns {number}
 */
function ArousalGetTimedProgress(character) {
	if (character.ArousalSettings)
		return character.ArousalSettings.ProgressTimer;
	return 0;
}

/**
 * Sets an activity progress on a timer, activities are capped at MaxProgress
 * @param {Character} character - The character for which to set the timer for
 * @param {Activity} activity - The activity for which the timer is for
 * @param {string} zone - The target zone of the activity
 * @param {number} progressDelta - Progress to set
 * @return {void} - Nothing
 */
function ArousalSetTimedProgress(character, activity, zone, progressDelta) {
	// The progress delta must be between -25 and 25
	if (progressDelta < -25) progressDelta = -25;
	if (progressDelta > 25) progressDelta = 25;

	// Maximum arousal value
	let maxProgress = 100;
	// If the activity has a MaxProgress value set, account for it
	if (activity && activity.MaxProgress != null) {
		maxProgress = Math.max(Math.min(100, activity.MaxProgress), 0);
	}

	// Do not allow orgasms if the zone doesn't allow it
	if ((maxProgress > 95) && !PreferenceGetZoneOrgasm(character, zone)) {
		maxProgress = 95;
	}

	// This is a specific marker for activities done on yourself
	if (maxProgress > 67 && zone == "ActivityOnOther") {
		maxProgress = 67;
	}

	// If progress is positive, clamp its value so it doesn't
	// go over the calculated maximum.
	const charProgress = ArousalGetProgress(character);
	if (progressDelta > 0 && (charProgress + progressDelta) > maxProgress) {
		const remaining = maxProgress - charProgress;
		progressDelta = (remaining >= 0 ? remaining : 0);
	}

	// Update the progress timer
	let progressTimer = ArousalGetTimedProgress(character);

	// If there's already a progress timer running, divide it by 2 to lessen the impact
	if (progressTimer != 0)
		progressTimer = Math.round(progressTimer / 2);

	// If we must apply a progress timer change, we publish it
	if ((progressTimer + progressDelta) != progressTimer) {
		character.ArousalSettings.ProgressTimer = progressTimer + progressDelta;
		ChatRoomCharacterArousalSync(character);
	}
}

/**
 * Get the character current vibration level.
 * @param {Character} character
 * @return {number}
 */
function ArousalGetVibratorLevel(character) {
	if (character.ArousalSettings && typeof character.ArousalSettings.VibratorLevel === "number" && !isNaN(character.ArousalSettings.VibratorLevel))
		return character.ArousalSettings.VibratorLevel;
	return 0;
}

/**
 * Set the current vibrator level for drawing purposes
 * @param {Character} character - Character for which the timer is progressing
 * @param {number} level - Level from 0 to 4 (higher = more vibration)
 * @returns {void} - Nothing
 */
function ArousalSetVibratorLevel(character, level) {
	if (character.ArousalSettings != null) {
		if (level != character.ArousalSettings.VibratorLevel) {
			character.ArousalSettings.VibratorLevel = level;
			// Update the change time to reset the vibrator animation
			character.ArousalSettings.ChangeTime = CommonTime();
		}
	}
}

/**
 * Get the characters' arousal effect visual setting.
 * @param {Character} character
 * @return {ArousalVFXMode}
 */
function ArousalGetVFXSetting(character) {
	if (character.ArousalSettings && character.ArousalSettings.VFX)
		return character.ArousalSettings.VFX;
	return ArousalVFX.Inactive;
}

/**
 * Has the character arousal effect enabled?
 * @param {Character} character
 * @return {boolean}
 */
function ArousalVFXActive(character) {
	return ArousalGetVFXSetting(character) !== ArousalVFX.Inactive;
}

/**
 * Get the characters' arousal effect visual filter.
 * @param {Character} character
 * @return {ArousalVFXFilterMode}
 */
function ArousalGetVFXFilterSetting(character) {
	if (character.ArousalSettings && character.ArousalSettings.VFXFilter)
		return character.ArousalSettings.VFXFilter;
	return ArousalVFXFilter.Light;
}

/**
 * Triggers an orgasm for the player or an NPC which lasts from 5 to 15 seconds
 * @param {Character} character - Character for which an orgasm was triggered
 * @param {boolean} [shouldRuin=false] - If true, this will do a ruined orgasm rather than a real one
 * @returns {void} - Nothing
 */
function ArousalTriggerOrgasm(character, shouldRuin) {
	if (character.ID == 0)
		ArousalOrgasmShouldRuin = false;

	if (character.Effect.includes("DenialMode")) {
		character.ArousalSettings.Progress = 99;
		if (character.ID == 0 && (shouldRuin || character.Effect.includes("RuinOrgasms"))) ArousalOrgasmShouldRuin = true;
		else return;
	}

	if (character.IsEdged()) {
		character.ArousalSettings.Progress = 95;
		if (character.ID == 0 && shouldRuin) ArousalOrgasmShouldRuin = true;
		else return;
	}

	if (character.ID == 0 && ArousalOrgasmShouldRuin) {
		ArousalMinigameGenerate(0); // Resets the game
	}

	if ((character.ID == 0) || character.IsNpc()) {

		// Starts the timer and exits from dialog if necessary
		character.ArousalSettings.OrgasmTimer = (character.ID == 0) ? CurrentTime + 5000 : CurrentTime + (Math.random() * 10000) + 5000;
		character.ArousalSettings.OrgasmStage = (character.ID == 0) ? 0 : 2;
		if (character.ID == 0) ArousalMinigameTimer = character.ArousalSettings.OrgasmTimer - CurrentTime;
		if ((CurrentCharacter != null) && ((character.ID == 0) || (CurrentCharacter.ID == character.ID))) DialogLeave();
		ChatRoomCharacterArousalSync(character);

		// If an NPC orgasmed, it will raise her love based on the horny trait
		if (character.IsNpc())
			if ((character.Love == null) || (character.Love < 60) || (character.IsOwner()) || (character.IsOwnedByPlayer()) || character.IsLoverPrivate())
				NPCLoveChange(character, Math.floor((NPCTraitGet(character, "Horny") + 100) / 20) + 1);

	}
}

/**
 * With time, we increase or decrease the arousal. Validates the result to keep it within 0 to 100 and triggers an orgasm when it reaches 100
 * @param {Character} character - Character for which the timer is progressing
 * @param {number} progressDelta - Progress made (from -100 to 100)
 * @returns {void} - Nothing
 */
function ArousalTimerTick(character, progressDelta) {

	// Decrease the vibrator level to 0 if delta is a decrease
	if (progressDelta < 0) {
		ArousalSetVibratorLevel(character, 0);
	}

	// Changes the current arousal progress value
	const newProgress = ArousalGetProgress(character) + progressDelta;
	ArousalSetProgress(character, newProgress, false);

	// Out of orgasm mode, it can affect facial expressions at every 10 steps
	if (ArousalGetOrgasmTimer(character) < CurrentTime && (newProgress % 10 == 0))
		ArousalUpdateExpression(character);

	// Can trigger an orgasm
	if (character.ArousalSettings.Progress == 100) ArousalTriggerOrgasm(character);
}

/**
 * Sets a character's facial expressions based on their arousal level if their settings allow it.
 * @param {Character} character - Character for which to set the facial expressions
 * @returns {void} - Nothing
 */
function ArousalUpdateExpression(character) {
	if (!ArousalAffectsExpression(character)) return;

	// Floors the progress to the nearest 10 to pick the expression
	const progress = Math.floor(ArousalGetProgress(character) / 10) * 10;

	// The blushes goes to red progressively
	let blush = null;
	if ((progress == 10) || (progress == 30) || (progress == 50) || (progress == 70)) blush = "Low";
	if ((progress == 60) || (progress == 80) || (progress == 90)) blush = "Medium";
	if (progress == 100) blush = "High";

	// The eyebrows position changes
	let eyebrows = null;
	if ((progress == 20) || (progress == 30)) eyebrows = "Raised";
	if ((progress == 50) || (progress == 60)) eyebrows = "Lowered";
	if ((progress == 80) || (progress == 90)) eyebrows = "Soft";

	// Drool can activate at a few stages
	let fluids = null;
	if ((progress == 40) || (character.ArousalSettings.Progress == 70)) fluids = "DroolLow";
	if (progress == 100) fluids = "DroolMedium";

	// Eyes can activate at a few stages
	let eyes = null;
	if (progress == 20) eyes = "Dazed";
	if (progress == 70) eyes = "Horny";
	if (progress == 90) eyes = "Surprised";
	if (progress == 100) eyes = "Closed";

	// Find the expression in the character appearance and alters it
	for (const appearance of character.Appearance) {
		if (appearance.Asset.Group.Name == "Blush") appearance.Property = { Expression: blush };
		if (appearance.Asset.Group.Name == "Eyebrows") appearance.Property = { Expression: eyebrows };
		if (appearance.Asset.Group.Name == "Fluids") appearance.Property = { Expression: fluids };
		if (appearance.Asset.Group.Name == "Eyes") appearance.Property = { Expression: eyes };
		if (appearance.Asset.Group.Name == "Eyes2") appearance.Property = { Expression: eyes };
	}

	// Refreshes the character
	CharacterRefresh(character, false);
}

/** Arousal Minigame */

/**
 * Main loop for the orgasm minigame
 * @returns {void}
 */
function ArousalOrgasmMinigameRun() {
	let offset = 0;
	const screenFilter = {y: 0, h: 0, w: 0};
	if (CurrentScreen == "Private") {
		offset = 500;
		screenFilter.y = 0;
		screenFilter.h = 1000;
		screenFilter.w = 2000;
	} else {
		screenFilter.y = 0;
		if (ChatRoomCharacterCount <= 5) {
			screenFilter.y = 1000 * (1 - ChatRoomCharacterZoom) / 2;
		}
		screenFilter.h = 1000 - 2 * screenFilter.y;
		screenFilter.w = 1003;
	}

	// In orgasm mode, we add a pink filter and different controls
	// depending on the stage.  The pink filter shows a little above 90.
	if (ArousalIsActive(Player)) {
		if (ArousalGetOrgasmTimer(Player) > 0) {
			const stage = ArousalGetOrgasmStage(Player);
			// Gradient over the main area
			DrawRect(0, screenFilter.y, screenFilter.w, screenFilter.h, "#FFB0B0B0");
			if (CurrentScreen == "ChatRoom") {
				// Gradient over the menu items
				DrawRect(1003, 0, 993, 63, "#FFB0B0B0");
			}
			if (stage == 0) {
				DrawText(TextGet("OrgasmComing"), 500 + offset, 410, "White", "Black");
				DrawButton(200 + offset, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(550 + offset, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (stage == 1) DrawButton(ArousalMinigameButton.x + offset, ArousalMinigameButton.y, 250, 64, ArousalMinigameButton.label, "White");
			if (ArousalOrgasmShouldRuin) ArousalMinigameControl();
			if (stage == 2) DrawText(TextGet("OrgasmRecovering"), 500 + offset, 500, "White", "Black");
			ArousalMinigameProgressBarDraw(50 + offset, 970);
		} else if (ArousalIsArousalBetween(Player, 0, 100) && !CommonPhotoMode) {
			ChatRoomDrawArousalScreenFilter(screenFilter.y, screenFilter.h, screenFilter.w);
		}
	}

	if (Player.ArousalSettings.VFXVibrator == "VFXVibratorSolid" || Player.ArousalSettings.VFXVibrator == "VFXVibratorAnimated") {
		ChatRoomVibrationScreenFilter(screenFilter.y, screenFilter.h, screenFilter.w, Player);
	}
}

/**
 * Click handler for the arousal minigame
 * @returns {boolean} - Whether the click was handled
 */
function ArousalOrgasmMinigameClick() {
	if (ArousalGetOrgasmTimer(Player) > 0) {
		const stage = ArousalGetOrgasmStage(Player);
		// X offset for the private room
		const offset = (CurrentScreen == "Private" ? 500 : 0);
		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if (stage == 0) {
			if (MouseIn(200 + offset, 532, 250, 68)) {
				ArousalMinigameGenerate(0);
				return true;
			}
			if (MouseIn(550 + offset, 532, 250, 68)) {
				ArousalMinigameStartOrgasm(Player);
				return true;
			}
		} else if (stage == 1) {
			if (MouseIn(ArousalMinigameButton.x + offset, ArousalMinigameButton.y, 250, 64)) {
				ArousalMinigameGenerate(ArousalMinigameStep + 1);
				return true;
			}
		}
	}
	return false;
}

/**
 * Ends the orgasm early if progress is close or progress is sufficient
 * @return {void} - Nothing
 */
function ArousalMinigameControl() {
	if ((ArousalMinigameTimer != null) && (ArousalMinigameTimer > 0) && (CurrentTime < Player.ArousalSettings.OrgasmTimer)) {
		// Ruin the orgasm
		if (ArousalMinigameStep >= ArousalMinigameDifficulty - 1 || CurrentTime > Player.ArousalSettings.OrgasmTimer - 500) {
			if (CurrentScreen == "ChatRoom") {
				if (CurrentTime > Player.ArousalSettings.OrgasmTimer - 500) {
					if (Player.ArousalSettings.OrgasmStage == 0) {
						if ((CurrentScreen == "ChatRoom"))
							ChatRoomMessage({ Content: "OrgasmFailPassive" + (Math.floor(Math.random() * 3)).toString(), Type: "Action", Sender: Player.MemberNumber });
					} else {
						if ((CurrentScreen == "ChatRoom")) {
							const dictionary = [];
							dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
							ServerSend("ChatRoomChat", { Content: "OrgasmFailTimeout" + (Math.floor(Math.random() * 3)).toString(), Type: "Activity", Dictionary: dictionary });
							ChatRoomCharacterArousalSync(Player);
						}
					}
				} else {
					if ((CurrentScreen == "ChatRoom")) {
						const dictionary = [];
						dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
						ServerSend("ChatRoomChat", { Content: ("OrgasmFailResist" + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: dictionary });
						ChatRoomCharacterArousalSync(Player);
					}
				}
			}
			ArousalMinigameResistCount++;
			ArousalMinigameStopOrgasm(Player, 65 + Math.ceil(Math.random()*20));
		}
	}
}

/**
 * Generates an orgasm button and progresses in the orgasm mini-game. Handles the resets and success/failures
 * @param {number} step - Progress of the currently running mini-game
 * @returns {void} - Nothing
 */
function ArousalMinigameGenerate(step) {

	// If we must reset the mini-game
	if (step == 0) {
		Player.ArousalSettings.OrgasmStage = 1;
		Player.ArousalSettings.OrgasmTimer = CurrentTime + 5000 + (SkillGetLevel(Player, "Willpower") * 1000);
		ArousalMinigameTimer = Player.ArousalSettings.OrgasmTimer - CurrentTime;
		ArousalMinigameDifficulty = (6 + (ArousalMinigameResistCount * 2)) * (CommonIsMobile ? 1.5 : 1);
	}

	// Runs the game or finish it if the threshold is reached, it can trigger a chatroom message for everyone to see
	if (step >= ArousalMinigameDifficulty) {
		if (CurrentScreen == "ChatRoom") {
			const dictionary = [];
			dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
			ServerSend("ChatRoomChat", { Content: "OrgasmResist" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: dictionary });
		}
		ArousalMinigameResistCount++;
		ArousalMinigameStopOrgasm(Player, 70);
	} else {
		ArousalMinigameStep = step;
		ArousalMinigameButton.x = 50 + Math.floor(Math.random() * 650);
		ArousalMinigameButton.y = 50 + Math.floor(Math.random() * 836);
		ArousalMinigameButton.label = TextGet("OrgasmResist") + " (" + (ArousalMinigameDifficulty - step).toString() + ")";
	}
}

/**
 * Starts an orgasm for a given character, lasts between 5 to 15 seconds and can be displayed in a chatroom.
 * @param {Character} character - Character for which an orgasm is starting
 * @returns {void} - Nothing
 */
function ArousalMinigameStartOrgasm(character) {
	if ((character.ID == 0) || character.IsNpc()) {
		if (character.ID == 0 && !ArousalOrgasmShouldRuin) ArousalMinigameResistCount = 0;
		AsylumGGTSTOrgasm(character);
		ArousalMinigameWillpowerProgress(character);

		if (!ArousalOrgasmShouldRuin) {

			character.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
			character.ArousalSettings.OrgasmStage = 2;
			character.ArousalSettings.OrgasmCount = (character.ArousalSettings.OrgasmCount == null) ? 1 : character.ArousalSettings.OrgasmCount + 1;
			ArousalMinigameTimer = character.ArousalSettings.OrgasmTimer - CurrentTime;

			if ((character.ID == 0) && (CurrentScreen == "ChatRoom")) {
				const dictionary = [];
				dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: dictionary });
				ChatRoomCharacterArousalSync(character);
			}
		} else {
			ArousalMinigameStopOrgasm(Player, 65 + Math.ceil(Math.random()*20));

			if ((character.ID == 0) && (CurrentScreen == "ChatRoom")) {
				const dictionary = [];
				const chatModifier = character.ArousalSettings.OrgasmStage == 1 ? "Timeout" : "Surrender";
				dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: ("OrgasmFail" + chatModifier + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: dictionary });
				ChatRoomCharacterArousalSync(character);
			}
		}
	}
}

/**
 * Triggered when an orgasm needs to be stopped
 * @param {Character} character - Character for which to stop the orgasm
 * @param {number} finalProgress - Arousal level to set the character at once the orgasm ends
 * @returns {void} - Nothing
 */
function ArousalMinigameStopOrgasm(character, finalProgress) {
	if ((character.ID == 0) || character.IsNpc()) {
		ArousalMinigameWillpowerProgress(character);
		character.ArousalSettings.OrgasmTimer = 0;
		character.ArousalSettings.OrgasmStage = 0;
		ArousalSetProgress(character, finalProgress);
		ArousalTimerTick(character, 0);
		ChatRoomCharacterArousalSync(character);
	}
}

/**
 * Increases the player's willpower when resisting an orgasm.
 * @param {Character} character - The character currently resisting
 * @return {void} - Nothing
 */
function ArousalMinigameWillpowerProgress(character) {
	if ((character.ID == 0) && (ArousalMinigameStep > 0)) {
		SkillProgress("Willpower", ArousalMinigameStep);
		ArousalMinigameStep = 0;
	}
}

/**
 * Draws the arousal progress bar at the given coordinates for every orgasm timer.
 * @param {number} x - Position on the X axis
 * @param {number} y - Position on the Y axis
 * @return {void} - Nothing
 */
function ArousalMinigameProgressBarDraw(x, y) {
	let value = 0;
	if ((ArousalMinigameTimer != null) && (ArousalMinigameTimer > 0) && (CurrentTime < Player.ArousalSettings.OrgasmTimer))
		value = ((Player.ArousalSettings.OrgasmTimer - CurrentTime) / ArousalMinigameTimer) * 100;
	if (value < 0) value = 0;
	if (value > 100) value = 100;
	DrawProgressBar(x, y, 900, 25, value);
}
