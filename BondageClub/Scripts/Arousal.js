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

/** @type {Record<"Normal"|"Selecting"|"Resisting"|"Orgasming", ArousalOrgasmStages>} */
const ArousalOrgasmStage = {
	Normal: 0,
	Selecting: 1,
	Resisting: 2,
	Orgasming: 3,
}

/** Last time we processed arousal updates */
let ArousalTimerPreviousTime = 0;
/** Number of times the arousal timer was processed */
let ArousalTimerProcessCount = 0;
/** Length of tick for the arousal timer, in ms */
const ArousalTimerDuration = 1000;
/** Last time we processed arousal decay */
let ArousalTimerDecayPreviousTime = 0;
/** Length of tick for the arousal decay timer, in ms */
const ArousalTimerDecayDuration = 12000;

/** Number of times a Resist button was clicked */
let ArousalMinigameStep = 0;
/** Maximum number of steps */
let ArousalMinigameDifficulty = 0;
/** A counter keeping track of the Resist successes */
let ArousalMinigameResistCount = 0;
/** The arousal minigame stage duration, for the progress bar length */
let ArousalMinigameStageDuration = 0;
/** The current minigame Resist button values */
const ArousalMinigameButton = { x: 0, y: 0, label: null };

/** Should the next orgasm be ruined right before it happens */
let ArousalOrgasmShouldRuin = false;

/** Duration cutoff for a ruined orgasm */
const ArousalMinigameRuinTimeout = 500;

/** Duration of an orgasm */
const ArousalOrgasmDuration = 5000;

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
 * @returns {ArousalOrgasmStages} - 0 is no orgasm, 1 means player is asked to
 * resist or surrender, 2 means resistance minigame is in progress, 3 means character is orgasming
 */
function ArousalGetOrgasmStage(character) {
	if (character.ArousalSettings && character.ArousalSettings.OrgasmStage)
		return character.ArousalSettings.OrgasmStage;
	return ArousalOrgasmStage.Normal;
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
 * Sets a player or character orgasm state.
 * @param {Character|Player} character - The character or player to read arousal from
 * @param {ArousalOrgasmStages} stage - The stage of orgasm
 * @returns {void}
 */
function ArousalSetOrgasmStage(character, stage) {
	// Decide on the length of the stage
	let duration = 0;
	switch (stage) {
		case ArousalOrgasmStage.Selecting:
			duration = ArousalOrgasmDuration;
			break;
		case ArousalOrgasmStage.Resisting:
			duration = ArousalOrgasmDuration + (SkillGetLevel(character, "Willpower") * 1000);
			break;
		case ArousalOrgasmStage.Orgasming:
			duration = ArousalOrgasmDuration + (Math.random() * 10000);
			// Increase the orgasm counter as well
			character.ArousalSettings.OrgasmCount++;
			break;
		case ArousalOrgasmStage.Normal:
		default:
			// Just to reset out-of-bound values
			stage = ArousalOrgasmStage.Normal;
			duration = 0;
			break;
	}
	character.ArousalSettings.OrgasmStage = stage;
	character.ArousalSettings.OrgasmTimer = CurrentTime + duration;
	ArousalMinigameStageDuration = duration;
	ChatRoomCharacterArousalSync(character);
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

	// If the character is being denied, or kept on edge
	if (character.IsDenied() || character.IsEdged()) {
		const maxProgress = character.IsDenied() ? 99 : 95;
		ArousalSetProgress(character, maxProgress);
		if (character.ID == 0 && (shouldRuin || character.Effect.includes("RuinOrgasms")))
			ArousalOrgasmShouldRuin = true;
		else
			return;
	}

	if (character.ID == 0 && ArousalOrgasmShouldRuin) {
		ArousalMinigameGenerate(0); // Resets the game
	}

	if ((character.ID == 0) || character.IsNpc()) {
		// Starts the timer depending on the character type (player or NPC)
		if (character.ID == 0) {
			ArousalSetOrgasmStage(character, ArousalOrgasmStage.Selecting);
		} else {
			ArousalSetOrgasmStage(character, ArousalOrgasmStage.Orgasming);
		}

		// Exits from dialog if necessary
		if (CurrentCharacter != null && CurrentCharacter.ID == character.ID)
			DialogLeave();

		// If an NPC orgasmed, it will raise her love based on the horny trait
		if (character.IsNpc()) {
			if ((character.Love == null) || (character.Love < 60) || (character.IsOwner()) || (character.IsOwnedByPlayer()) || character.IsLoverPrivate())
				NPCLoveChange(character, Math.floor((NPCTraitGet(character, "Horny") + 100) / 20) + 1);
		}
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
 * Main timer runloop for arousal.
 */
function ArousalTimerProcess() {
	// Arousal/Activity events only occur in allowed rooms
	if (!ChatRoomAllowsArousalActivities()) return;

	// Arousal can change every second, based on ProgressTimer
	if ((ArousalTimerPreviousTime + ArousalTimerDuration < CurrentTime) || (ArousalTimerPreviousTime - ArousalTimerDuration > CurrentTime)) {
		ArousalTimerPreviousTime = CurrentTime;
		ArousalTimerProcessCount++;

		for (const character of Character) {
			// If the character is having an orgasm and the timer ran out,
			// we move to the next orgasm stage
			const orgasmTimer = ArousalGetOrgasmTimer(character);
			if (orgasmTimer > 0 && orgasmTimer < CurrentTime) {
				if (ArousalGetOrgasmStage(character) <= 1) {
					ArousalMinigameStartOrgasm(character);
				} else {
					ArousalMinigameStopOrgasm(character, 20);
				}
			} else {

				// Depending on the character settings, we progress the arousal meter
				if (ArousalIsInMode(character, ["Automatic", "Hybrid"])) {
					// Activity impacts the progress slowly over time.
					// If there's an activity running, vibrations are ignored
					const progressTimer = ArousalGetTimedProgress(character);
					if (progressTimer != 0) {
						if (progressTimer < 0) {
							character.ArousalSettings.ProgressTimer++;
							ArousalTimerTick(character, -1);
							ArousalSetVibratorLevel(character, 0);
						}
						else {
							character.ArousalSettings.ProgressTimer--;
							ArousalTimerTick(character, 1);
							ArousalSetVibratorLevel(character, 4);
						}
					} else if (character.IsEgged()) {
						// If the character is egged, we find the highest intensity
						// factor and affect the progress, low and medium vibrations
						// have a cap
						let factor = -1;
						for (const item of character.Appearance) {
							let zoneFactor = PreferenceGetZoneFactor(character, item.Asset.ArousalZone) - 2;
							if (InventoryItemHasEffect(item, "Egged", true) && (item.Property != null) && (item.Property.Intensity != null) && (typeof item.Property.Intensity === "number") && !isNaN(item.Property.Intensity) && (item.Property.Intensity >= 0) && (zoneFactor >= 0) && (item.Property.Intensity + zoneFactor > factor)){
								if (ArousalIsArousalBetween(character, null, 95) || PreferenceGetZoneOrgasm(character, item.Asset.ArousalZone))
									factor = item.Property.Intensity + zoneFactor;
							}
						}

						// Adds the fetish value to the factor
						if (factor >= 0) {
							const fetish = ActivityFetishFactor(character);
							if (fetish > 0)
								factor = factor + Math.ceil(fetish / 3);
							if (fetish < 0)
								factor = factor + Math.floor(fetish / 3);
						}

						// Kicks the arousal timer faster from personal arousal
						let progress = ArousalGetProgress(character);
						if (factor >= 4) {
							ArousalSetVibratorLevel(character, 4);
							if (ArousalTimerProcessCount % 2 == 0)
								ArousalTimerTick(character, 1);
						}
						if (factor == 3) {
							ArousalSetVibratorLevel(character, 3);
							if (ArousalTimerProcessCount % 3 == 0)
								ArousalTimerTick(character, 1);
						}
						if (factor == 2) {
							ArousalSetVibratorLevel(character, 2);
							if (progress <= 95 && ArousalTimerProcessCount % 4 == 0)
								ArousalTimerTick(character, 1);
						}
						if (factor == 1) {
							ArousalSetVibratorLevel(character, 1);
							if (progress <= 65 && ArousalTimerProcessCount % 6 == 0)
								ArousalTimerTick(character, 1);
						}
						if (factor == 0) {
							ArousalSetVibratorLevel(character, 1);
							if (progress <= 35 && ArousalTimerProcessCount % 8 == 0)
								ArousalTimerTick(character, 1);
						}
						if (factor == -1) {
							ArousalSetVibratorLevel(character, 0);
						}
					}
				} else {
					ArousalSetVibratorLevel(character, 0);
				}
			}
		}
	}

	// Arousal decays by 1 naturally every 12 seconds, unless there's already a natural progression from an activity
	if ((ArousalTimerDecayPreviousTime + ArousalTimerDecayDuration < CurrentTime) || (ArousalTimerDecayPreviousTime - ArousalTimerDecayDuration > CurrentTime)) {
		ArousalTimerDecayPreviousTime = CurrentTime;
		for (const character of Character) {
			if (ArousalIsInMode(character, ["Automatic", "Hybrid"]) && ArousalGetProgress(character) > 0 && ArousalGetTimedProgress(character) == 0) {
				// If the character is egged, we find the highest intensity factor
				let factor = -1;
				for (const item of character.Appearance) {
					const zoneFactor = PreferenceGetZoneFactor(character, item.Asset.ArousalZone) - 2;
					if (InventoryItemHasEffect(item, "Egged", true) && (item.Property != null) && (item.Property.Intensity != null) && (typeof item.Property.Intensity === "number") && !isNaN(item.Property.Intensity) && (item.Property.Intensity >= 0) && (zoneFactor >= 0) && (item.Property.Intensity + zoneFactor > factor))
					if (ArousalGetProgress(character) < 95 || PreferenceGetZoneOrgasm(character, item.Asset.ArousalZone))
					factor = item.Property.Intensity + zoneFactor;
				}

				// No decay if there's a vibrating item running
				if (factor < 0)
					ArousalTimerTick(character, -1);
			}
		}
	}
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
			if (stage == ArousalOrgasmStage.Selecting) {
				DrawText(TextGet("OrgasmComing"), 500 + offset, 410, "White", "Black");
				DrawButton(200 + offset, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(550 + offset, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (stage == ArousalOrgasmStage.Resisting) DrawButton(ArousalMinigameButton.x + offset, ArousalMinigameButton.y, 250, 64, ArousalMinigameButton.label, "White");
			if (ArousalOrgasmShouldRuin) ArousalMinigameControl();
			if (stage == ArousalOrgasmStage.Orgasming) DrawText(TextGet("OrgasmRecovering"), 500 + offset, 500, "White", "Black");

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
		if (stage == ArousalOrgasmStage.Selecting) {
			if (MouseIn(200 + offset, 532, 250, 68)) {
				ArousalMinigameGenerate(0);
				return true;
			}
			if (MouseIn(550 + offset, 532, 250, 68)) {
				ArousalMinigameStartOrgasm(Player);
				return true;
			}
		} else if (stage == ArousalOrgasmStage.Resisting) {
			// The player plays a mini-game to fight her orgasm
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
	const orgasmTimer = ArousalGetOrgasmTimer(Player);
	if (orgasmTimer > 0 && CurrentTime < orgasmTimer) {
		if (ArousalMinigameStep >= ArousalMinigameDifficulty - 1) {
			// Game completed, player managed to resist
			if (CurrentScreen == "ChatRoom") {
				const dictionary = [];
				dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: ("OrgasmFailResist" + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: dictionary });
			}
		} else if (CurrentTime > orgasmTimer - ArousalMinigameRuinTimeout && CurrentScreen === "ChatRoom") {
			// Ruin the orgasm
			if (Player.ArousalSettings.OrgasmStage == ArousalOrgasmStage.Selecting) {
				ChatRoomMessage({ Content: "OrgasmFailPassive" + (Math.floor(Math.random() * 3)).toString(), Type: "Action", Sender: Player.MemberNumber });
			} else {
				const dictionary = [];
				dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: "OrgasmFailTimeout" + (Math.floor(Math.random() * 3)).toString(), Type: "Activity", Dictionary: dictionary });
				ChatRoomCharacterArousalSync(Player);
			}
		}
		ArousalMinigameResistCount++;
		ArousalMinigameStopOrgasm(Player, 65 + Math.ceil(Math.random()*20));
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
		ArousalSetOrgasmStage(Player, ArousalOrgasmStage.Resisting);
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
			ArousalSetOrgasmStage(character, ArousalOrgasmStage.Orgasming);

			if ((character.ID == 0) && (CurrentScreen == "ChatRoom")) {
				const dictionary = [];
				dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: dictionary });
				ChatRoomCharacterArousalSync(character);
			}
		} else {
			if ((character.ID == 0) && (CurrentScreen == "ChatRoom")) {
				const dictionary = [];
				const chatModifier = ArousalGetOrgasmStage(character) == ArousalOrgasmStage.Resisting ? "Timeout" : "Surrender";
				dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
				ServerSend("ChatRoomChat", { Content: ("OrgasmFail" + chatModifier + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: dictionary });
				ChatRoomCharacterArousalSync(character);
			}

			ArousalMinigameStopOrgasm(Player, 65 + Math.ceil(Math.random()*20));
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
		ArousalSetOrgasmStage(character, ArousalOrgasmStage.Normal);
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
	let orgasmTimer = ArousalGetOrgasmTimer(Player);
	if (orgasmTimer > 0 && CurrentTime < orgasmTimer)
		value = ((orgasmTimer - CurrentTime) / ArousalMinigameStageDuration) * 100;
	if (value < 0) value = 0;
	if (value > 100) value = 100;
	DrawProgressBar(x, y, 900, 25, value);
}
