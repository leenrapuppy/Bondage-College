var CheatAllow = false;
var TranslationCheatAllow = false;
var TranslationCacheCounter = 0; // used to bypass browser cache for CSV
var TranslationCurrentText = 0;
var TranslationCurrentStageFileLine = 0;
var TranslationSavedStage;

// Receives cheat keys
function CheatKey() {

	// No cheats until the player has a name
	if (Common_PlayerName != "") {
		// In a fight or a race, the user can press * to win automatically
		if (!FightEnded && (FightTimer > 0)) { if (KeyPress == 42) FightEnd(true); return; }
		if (!DoubleFightEnded && (DoubleFightTimer > 0)) { if (KeyPress == 42) DoubleFightEnd(true); return; }
		if (!RaceEnded && (RaceTimer > 0)) { if (KeyPress == 42) { RaceProgress = RaceGoal; RaceEnd(true); } return; }
		if (!QuizEnded && (QuizTimer > 0) && (QuizBetweenQuestionTimer == 0) && (QuizAnswerText == "")) { if (KeyPress == 42) { QuizAnswerText = QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer1]; QuizAnswerBy = "Left"; QuizProgressLeft++; QuizBetweenQuestionTimer = QuizTimer + QuizOtherQuestionTime; } return; }

		// If we must manipulate time using + and -
		if (KeyPress == 43) CheatTime(900000);
		if (KeyPress == 45) CheatTime(-900000);

		// Specific cheats by functions
		if (CurrentActor != "") CheatActor();
		if ((CurrentChapter == "C012_AfterClass") && (CurrentScreen == "Dorm")) CheatDorm();
		if(TranslationCheatAllow) CheatTranslation(); else CheatSkill(); // skill modifiyng keys 5 - 9 are reused for translation related functions
		CheatInventory();

	}

}

// Cheats the clock by adding or removing time
function CheatTime(TimeChange) {

	// Time must be running to allow cheating it
	if (RunTimer) {

		// Change the main clock
		CurrentTime = CurrentTime + TimeChange;
		if (CurrentTime <= 0) CurrentTime = 1;

		// Change all the timed events in the game log to fit with that change
		for (var L = 0; L < GameLog.length; L++)
			if (GameLog[L][GameLogTimer] > 0) {
				GameLog[L][GameLogTimer] = GameLog[L][GameLogTimer] + TimeChange;
				if (GameLog[L][GameLogTimer] <= 0) GameLog[L][GameLogTimer] = 1;
				if (GameLog[L][GameLogTimer] > 24 * 60 * 60 * 1000) GameLog[L][GameLogTimer] = 24 * 60 * 60 * 1000;
			}

	}

}

// Cheats to change actor love or submission (from 1 to 4)
function CheatActor() {
	if (KeyPress == 49) ActorChangeAttitude(1, 0);
	if (KeyPress == 50) ActorChangeAttitude(-1, 0);
	if (KeyPress == 51) ActorChangeAttitude(0, 1);
	if (KeyPress == 52) ActorChangeAttitude(0, -1);
}

// Cheats to gain a skill (from 5 to 9)
function CheatSkill() {
	if (KeyPress == 53) PlayerAddSkill("Arts", 1);
	if (KeyPress == 54) PlayerAddSkill("Fighting", 1);
	if (KeyPress == 55) PlayerAddSkill("RopeMastery", 1);
	if (KeyPress == 56) PlayerAddSkill("Seduction", 1);
	if (KeyPress == 57) PlayerAddSkill("Sports", 1);
}

// Cheats used for text editing a translation
function CheatTranslation(){
	let stageTexts = CurrentStage;
	let texts = CurrentText;
	let screenPath = CurrentChapter + "_" + CurrentScreen;
	let displayedStageNumber;

	switch (KeyPress){
		case 47: // Slash key (/) forces reload of current texts from CSV
			let language = GetWorkingLanguage();
			let fileTypes = ["Intro","Stage","Text"];
			for(var c in fileTypes){
				var cachePath = CurrentChapter + "/" + CurrentScreen + "/" + fileTypes[c] + (language ? ("_" + language) : "") + ".csv"
				if(CSVCache[cachePath]) delete CSVCache[cachePath];
			}
			TranslationCacheCounter++;
			if(CurrentIntro !== null && CurrentStage !== null){
				LoadInteractions();
			} else if(CurrentText !== null){
				LoadText();
			}
			break;
		case 54: // number 6 key loads to OverridenIntroText previous text from Text_LANG file, number 9 loads next text
		case 57:
			if(texts && texts.length > 1){
				if(KeyPress === 57) TranslationCurrentText--; else TranslationCurrentText++;
				TranslationCurrentText = Math.min(texts.length - 1, Math.max(1, TranslationCurrentText));
				let displayText = texts[TranslationCurrentText][TextContent].trim();
				if(displayText !== "") OverridenIntroText = displayText; else OverridenIntroText = "** Text is empty";
			}
			break;
		case 53: // number 5 key loads to OverridenIntroText previous text from Stage_LANG file, number 8 loads next text
		case 56:
			// on first usage on given scene save actual stage
			if (!TranslationSavedStage || TranslationSavedStage.screen !== screenPath) {
				TranslationSavedStage = {
					stage: window[screenPath + "_CurrentStage"],
					screen: screenPath,
					overridenText: OverridenIntroText
				};
				TranslationCurrentStageFileLine = 1;
			}

			if(stageTexts && stageTexts.length > 1){
				if(KeyPress === 56) TranslationCurrentStageFileLine--; else TranslationCurrentStageFileLine++;
				TranslationCurrentStageFileLine = Math.min(stageTexts.length - 1, Math.max(1, TranslationCurrentStageFileLine));
				let displayText = stageTexts[TranslationCurrentStageFileLine][StageInteractionResult].trim();
				displayedStageNumber = stageTexts[TranslationCurrentStageFileLine][StageNumber];
				if(displayText !== "") OverridenIntroText = displayText; else OverridenIntroText = "** Stage has empty interaction result";
				window[screenPath + "_CurrentStage"] = displayedStageNumber;
				console.log("Stage: " + displayedStageNumber + " Line: " + (TranslationCurrentStageFileLine + 1));
			}
			break;
		case 55: // number 7 returns non overriden intro text for given stage (if present)
			OverridenIntroText = "";
			break;
		case 61: // key "=" reverts to last saved state
			if(TranslationSavedStage) {
				window[screenPath + "_CurrentStage"] = TranslationSavedStage.stage
				OverridenIntroText = TranslationSavedStage.overridenText
				TranslationSavedStage = undefined;
			}
			break;
		case 46: // "." flip variables of all prerequisites on displayed stage.
			TranslationCurrentStageFileLine = Math.min(stageTexts.length - 1, Math.max(1, TranslationCurrentStageFileLine));
			displayedStageNumber = stageTexts[TranslationCurrentStageFileLine][StageNumber];
			if(typeof displayedStageNumber !== undefined){
				// find prerequisites for given stage and negate it
				var flipped = {}; // stores which variables were already flipped
				for(var i in stageTexts){
					let prereqVarname = stageTexts[i][StageVarReq].trim();
					if(stageTexts[i][StageNumber] === displayedStageNumber && prereqVarname !== ""){
						let toFlip = "";
						if(prereqVarname.substring(0,1) == "!") prereqVarname = prereqVarname.substring(1);
						if(prereqVarname.substring(0,7) == "Common_"){
							toFlip = prereqVarname;
						}
						else {
							toFlip = screenPath + "_" + prereqVarname;
						}
						if(toFlip && !flipped[toFlip]){
							window[toFlip] = !window[toFlip];
							flipped[toFlip] = true;
							console.log("Flipped " + toFlip);
						}
					}
				}
			}
			break;
	}
}

// Cheats to add inventory (each letter represent an item)
function CheatInventory() {
	if ((KeyPress == 65) || (KeyPress == 97)) PlayerAddInventory("Armbinder", 1);
	if ((KeyPress == 66) || (KeyPress == 98)) PlayerAddInventory("BallGag", 1);
	if ((KeyPress == 67) || (KeyPress == 99)) PlayerAddInventory("Cuffs", 1);
	if ((KeyPress == 70) || (KeyPress == 102)) PlayerAddInventory("ChastityBelt", 1);
	if ((KeyPress == 71) || (KeyPress == 103)) PlayerAddInventory("ClothGag", 1);
	if ((KeyPress == 75) || (KeyPress == 107)) PlayerAddInventory("CuffsKey", 1);
	if ((KeyPress == 76) || (KeyPress == 108)) PlayerAddInventory("Collar", 1);
	if ((KeyPress == 80) || (KeyPress == 112)) PlayerAddInventory("Crop", 1);
	if ((KeyPress == 82) || (KeyPress == 114)) PlayerAddInventory("Rope", 1);
	if ((KeyPress == 83) || (KeyPress == 115)) PlayerAddInventory("SleepingPill", 1);
	if ((KeyPress == 84) || (KeyPress == 116)) PlayerAddInventory("TapeGag", 1);
	if ((KeyPress == 86) || (KeyPress == 118)) PlayerAddInventory("VibratingEgg", 1);
}

// Cheats that are specific to the player's dorm room
function CheatDorm() {

	// If the player isn't grounded, she can be released by using *
	if ((KeyPress == 42) && !GameLogQuery(CurrentChapter, "", "EventGrounded")) {
		PlayerReleaseBondage();
		if (PlayerHasLockedInventory("ChastityBelt")) { PlayerUnlockInventory("ChastityBelt"); PlayerAddInventory("ChastityBelt", 1); }
		if (PlayerHasLockedInventory("VibratingEgg")) { PlayerUnlockInventory("VibratingEgg"); PlayerAddInventory("VibratingEgg", 1); }
	}

}