"use strict";

function KDPersonalitySpread(Min, Avg, Max) {
	return KDStrictPersonalities.includes(KDGameData.CurrentDialogMsgPersonality) ? Max :
		(!KDLoosePersonalities.includes(KDGameData.CurrentDialogMsgPersonality) ? Avg :
		Min);
}

function KinkyDungeonCanPutNewDialogue() {
	return !KDGameData.CurrentDialog && !KinkyDungeonFlags.get("NoDialogue");
}

function KDBasicCheck(PositiveReps, NegativeReps) {
	let value = 0;
	for (let rep of PositiveReps) {
		if (KinkyDungeonGoddessRep[rep] != undefined) value += 50 + KinkyDungeonGoddessRep[rep];
	}
	for (let rep of NegativeReps) {
		if (KinkyDungeonGoddessRep[rep] != undefined) value -= 50 + KinkyDungeonGoddessRep[rep];
	}
	return value;
}

function KDDialogueApplyPersonality(allowed) {
	if (allowed.includes(KDGameData.CurrentDialogMsgPersonality)) KDGameData.CurrentDialogMsg = KDGameData.CurrentDialogMsg + KDGameData.CurrentDialogMsgPersonality;
}

function KDGetDialogue() {
	let dialogue = KDDialogue[KDGameData.CurrentDialog];
	if (KDGameData.CurrentDialogStage && dialogue.options) {
		let stages = KDGameData.CurrentDialogStage.split("_");
		for (let i = 0; i < stages.length; i++) {
			if (dialogue.options[stages[i]])
				dialogue = dialogue.options[stages[i]];
			else {
				// Break the dialogue
				console.log("Error in dialogue " + KDGameData.CurrentDialog + ", stage = " + KDGameData.CurrentDialogStage);
				KDGameData.CurrentDialog = "";
				break;
			}
		}
	}
	return dialogue;
}

let KDMaxDialogue = 7;
let KDOptionOffset = 0;

function KDDrawDialogue() {
	DrawImageCanvas(KinkyDungeonRootDirectory + "DialogBackground.png", MainCanvas, 500, 250);
	if (KDGameData.CurrentDialog && !(KinkyDungeonSlowMoveTurns > 0)) {
		KinkyDungeonDrawState = "Game";
		// Get the current dialogue and traverse down the tree
		let dialogue = KDGetDialogue();
		// Now that we have the dialogue, we check if we have a message
		if (dialogue.response && !KDGameData.CurrentDialogMsg) KDGameData.CurrentDialogMsg = dialogue.response;
		if (KDGameData.CurrentDialogMsg == "Default") KDGameData.CurrentDialogMsg = KDGameData.CurrentDialog + KDGameData.CurrentDialogStage;

		// Type the message
		let text = TextGet("r" + KDGameData.CurrentDialogMsg).split("|");
		for (let i = 0; i < text.length; i++) {
			let tt = text[i];
			if (KDGameData.CurrentDialogMsgData) {
				for (let d of Object.entries(KDGameData.CurrentDialogMsgData)) {
					tt = tt.replace(d[0], d[1]);
				}
			}
			DrawTextFit(tt.replace("SPEAKER", TextGet("Name" + KDGameData.CurrentDialogMsgSpeaker)),
				1000, 300 + 50 * i - 25 * text.length, 900, "white", "black");
		}

		// Draw the options
		if (dialogue.options) {
			let entries = Object.entries(dialogue.options);

			let II = 0;
			let gagged = KDDialogueGagged();
			for (let i = KDOptionOffset; i < entries.length && II < KDMaxDialogue; i++) {
				if ((!entries[i][1].prerequisiteFunction || entries[i][1].prerequisiteFunction(gagged))
					&& (!entries[i][1].gagRequired || gagged)
					&& (!entries[i][1].gagDisabled || !gagged)) {
					let playertext = entries[i][1].playertext;
					if (playertext == "Default") playertext = KDGameData.CurrentDialog + KDGameData.CurrentDialogStage + "_" + entries[i][0];
					if (entries[i][1].gag && KDDialogueGagged()) playertext = playertext + "Gag";

					let tt = TextGet("d" + playertext);
					if (KDGameData.CurrentDialogMsgData) {
						for (let d of Object.entries(KDGameData.CurrentDialogMsgData)) {
							tt = tt.replace(d[0], d[1]);
						}
					}
					DrawButton(700, 450 + II * 60, 600, 50, tt, KinkyDungeonDialogueTimer < CommonTime() ? "white" : "#888888");
					II += 1;
				}
			}
			if (II >= KDMaxDialogue) {
				DrawButton(1350, 450, 90, 40, "", KDOptionOffset > 0 ? "white" : "#888888", KinkyDungeonRootDirectory + "Up.png");
				DrawButton(1350, 450 + (KDMaxDialogue - 1) * 60 + 10, 90, 40, "", KDOptionOffset + KDMaxDialogue < entries.length ? "white" : "#888888", KinkyDungeonRootDirectory + "Down.png");
			}
		}
	} else if (!KDGameData.CurrentDialog) {
		// Clear data
		KDGameData.CurrentDialogMsgData = {};
		KDGameData.CurrentDialogMsgValue = {};
	}
}

let KinkyDungeonDialogueTimer = 0;

/**
 *
 * @param {string} Dialogue
 * @param {string} [Speaker]
 * @param {boolean} [Click]
 * @param {string} [Personality]
 * @param {entity} [enemy]
 */
function KDStartDialog(Dialogue, Speaker, Click, Personality, enemy) {
	KinkyDungeonInterruptSleep();
	KinkyDungeonAutoWait = false;
	KinkyDungeonDialogueTimer = CommonTime() + 1000 + KinkyDungeonSlowMoveTurns * 200;
	KDOptionOffset = 0;
	KinkyDungeonDrawState = "Game";
	KDSendInput("dialogue", {dialogue: Dialogue, dialogueStage: "", click: Click, speaker: Speaker, personality: Personality, enemy: enemy ? enemy.id : undefined});
}

function KDDialogueGagged() {
	let dialogue = KDGetDialogue();
	let threshold = dialogue.gagThreshold ? dialogue.gagThreshold : 0.01;
	if (KinkyDungeonGagTotal() >= threshold) return true;
	return false;
}

function KDHandleDialogue() {
	if (KDGameData.CurrentDialog && KinkyDungeonDialogueTimer < CommonTime()) {
		KinkyDungeonInterruptSleep();
		// Get the current dialogue and traverse down the tree
		let dialogue = KDGetDialogue();

		// Handle the options
		if (dialogue.options) {
			let entries = Object.entries(dialogue.options);
			let II = 0;
			let gagged = KDDialogueGagged();
			for (let i = KDOptionOffset; i < entries.length && II < KDMaxDialogue; i++) {
				if ((!entries[i][1].prerequisiteFunction || entries[i][1].prerequisiteFunction(gagged))
					&& (!entries[i][1].gagRequired || gagged)
					&& (!entries[i][1].gagDisabled || !gagged)) {
					if (MouseIn(700, 450 + II * 60, 600, 50)) {
						KDOptionOffset = 0;
						KDSendInput("dialogue", {dialogue: KDGameData.CurrentDialog, dialogueStage: KDGameData.CurrentDialogStage + ((KDGameData.CurrentDialogStage) ? "_" : "") + entries[i][0], click: true});
						return true;
					}
					II += 1;
				}
			}
			if (II >= KDMaxDialogue) {
				if (MouseIn(1350, 450, 90, 40) && KDOptionOffset > 0) {
					KDOptionOffset -= 1;
					return true;
				} else if (MouseIn(1350, 450 + (KDMaxDialogue - 1) * 60 + 10, 90, 40) && KDOptionOffset + KDMaxDialogue < entries.length) {
					KDOptionOffset += 1;
					return true;
				}
			}
		}
	}

	return false;
}
