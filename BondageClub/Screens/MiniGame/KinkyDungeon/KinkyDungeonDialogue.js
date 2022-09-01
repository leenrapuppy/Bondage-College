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
	if (KinkyDungeonFlags.has("OfferRefused")) value -= 15;
	if (KinkyDungeonFlags.has("OfferRefusedLight")) value -= 15;
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
	DrawImageCanvas(KinkyDungeonRootDirectory + "DialogBackground.png", MainCanvas, 500, 0);
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

function KDIncreaseOfferFatigue(Amount) {
	if (!KDGameData.OfferFatigue) {
		KDGameData.OfferFatigue = 0;
	}
	KDGameData.OfferFatigue = Math.max(0, KDGameData.OfferFatigue + Amount);

	if (Amount > 0) KinkyDungeonSetFlag("OfferRefused", 10);
	if (Amount > 0) KinkyDungeonSetFlag("OfferRefusedLight", 20);
}

function KDEnemyHelpfulness(enemy) {
	if (!enemy.personality) return 1.0;
	if (KDStrictPersonalities.includes(enemy.personality)) return 0.33;
	if (KDLoosePersonalities.includes(enemy.personality)) return 1.75;
}

/**
 *
 * @param {number} Amount
 */
function KDPleaseSpeaker(Amount) {
	let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
	if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
		let faction = KDGetFactionOriginal(enemy);
		if (!KinkyDungeonHiddenFactions.includes(faction))
			KinkyDungeonChangeFactionRep(faction, Amount);
	}
}

function KDAllySpeaker(Turns, Follow) {
	let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
	if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
		if (!(enemy.hostile > 0)) {
			enemy.allied = Turns;
			if (Follow) {
				KinkyDungeonSetEnemyFlag(enemy, "NoFollow", 0);
			}
		}
	}
}

function KDAggroSpeaker(Turns) {
	let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
	if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
		if (!(enemy.hostile > 0)) {
			enemy.hostile = Turns;
		} else enemy.hostile = Math.max(enemy.hostile, Turns);
	}
}


// Success chance for a basic dialogue
function KDBasicDialogueSuccessChance(checkResult) {
	return Math.max(0, Math.min(1.0, checkResult/100));
}

// Success chance for a basic dialogue
function KDAgilityDialogueSuccessChance(checkResult) {
	let evasion = KinkyDungeonPlayerEvasion();
	return Math.max(0, Math.min(1.0, (checkResult/100 - (KDGameData.OfferFatigue ? KDGameData.OfferFatigue /100 : 0) + 0.2 * Math.max(0, 3 - KinkyDungeonSlowLevel)) * evasion));
}

// Success chance for an offensive dialogue
function KDOffensiveDialogueSuccessChance(checkResult) {
	let accuracy = KinkyDungeonGetEvasion();
	return Math.max(0, Math.min(1.0, (checkResult/100 - (KDGameData.OfferFatigue ? KDGameData.OfferFatigue / 100 : 0)
		- 0.15 + 0.3 * Math.max(0, 3 - KinkyDungeonSlowLevel)) * accuracy));
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
	KinkyDungeonDialogueTimer = CommonTime() + 700 + KinkyDungeonSlowMoveTurns * 200;
	KDOptionOffset = 0;
	KinkyDungeonFastMovePath = [];
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

		if (dialogue.shop)
			KinkyDungeonhandleQuickInv(true);

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


/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string} Name
 * @returns {entity}
 */
function DialogueCreateEnemy(x, y, Name) {
	let Enemy = KinkyDungeonGetEnemyByName(Name);
	let e = {summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
		x:x, y:y,
		hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};
	KinkyDungeonEntities.push(e);
	return e;
}

/**
 *
 * @returns {entity}
 */
function KDDialogueEnemy() {
	let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
	if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
		return enemy;
	}
	return null;
}



function KDAllyDialogue(name, requireTags, requireSingleTag, excludeTags, weight) {
	/**
		 * @type {KinkyDialogue}
		 */
	let dialog = {
		response: "Default",
		options: {},
	};
	dialog.options.Leave = {playertext: "Leave", exitDialogue: true,
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoShop", 9999);
			}
			return false;
		},
	};
	dialog.options.Attack = {playertext: name + "Attack", response: "Default",
		options: {
			"Confirm": {playertext: name + "Attack_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						if (!enemy.Enemy.allied) {
							enemy.hostile = 100;
							let faction = KDGetFactionOriginal(enemy);
							if (!KinkyDungeonHiddenFactions.includes(faction)) {
								KinkyDungeonChangeRep("Ghost", -5);
								KinkyDungeonChangeFactionRep(faction, -0.06);
							}
						} else {
							enemy.hp = 0;
						}
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: name + "Attack_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};
	/*dialog.options.LetMePass = {playertext: name + "LetMePass", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KinkyDungeonFlags.has("passthrough");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				if (KinkyDungeonFlags.has("LetMePass")) {
					KinkyDungeonSetEnemyFlag(enemy, "passthrough", 8);
					KDGameData.CurrentDialog = "";
					KDGameData.CurrentDialogStage = "";
					KinkyDungeonSetFlag("LetMePass", 30);
				}
			}
			return false;
		},
		options: {
			"Confirm": {playertext: name + "LetMePass_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						KinkyDungeonSetEnemyFlag(enemy, "passthrough", 8);
						if (KinkyDungeonFlags.has("LetMePass")) {
							KDGameData.CurrentDialog = "";
							KDGameData.CurrentDialogStage = "";
						}
						KinkyDungeonSetFlag("LetMePass", 30);
					}
					return false;
				},
				exitDialogue: true,
			},
			"ConfirmAll": {playertext: name + "LetMePass_ConfirmAll", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						KinkyDungeonSetFlag("Passthrough", 8);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: name + "LetMePass_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};*/
	dialog.options.StopFollowingMe = {playertext: name + "StopFollowingMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return KDAllied(enemy) && !KDEnemyHasFlag(enemy, "NoFollow");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoFollow", 9999);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.FollowMe = {playertext: name + "FollowMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return KDAllied(enemy) && KDEnemyHasFlag(enemy, "NoFollow") && !KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				if (!KDEnemyHasFlag(enemy, "NoStay") && (KDRandom() < (70 - KinkyDungeonGoddessRep.Ghost)/100 * 0.35 * KDEnemyHelpfulness(enemy) || enemy.Enemy.allied)) {
					KinkyDungeonSetEnemyFlag(enemy, "NoFollow", 0);
				} else {
					KDGameData.CurrentDialogMsg = name + "StayHere_Fail";
					KinkyDungeonSetEnemyFlag(enemy, "NoStay", 100);
				}
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.DontStayHere = {playertext: name + "DontStayHere", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && KDEnemyHasFlag(enemy, "StayHere");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "StayHere", 0);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.StayHere = {playertext: name + "StayHere", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && !KDEnemyHasFlag(enemy, "StayHere") && !KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				if (!KDEnemyHasFlag(enemy, "NoStay") && (KDRandom() < (50 - KinkyDungeonGoddessRep.Ghost)/100 * KDEnemyHelpfulness(enemy) * (KDAllied(enemy) ? 4.0 : 0.25) || enemy.Enemy.allied)) {
					KinkyDungeonSetEnemyFlag(enemy, "StayHere", -1);
					enemy.gx = enemy.x;
					enemy.gy = enemy.y;
				} else {
					KDGameData.CurrentDialogMsg = name + "StayHere_Fail";
					KinkyDungeonSetEnemyFlag(enemy, "NoStay", 100);
				}
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.Aggressive = {playertext: name + "Aggressive", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && KDEnemyHasFlag(enemy, "Defensive");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Defensive", 0);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.Defensive = {playertext: name + "Defensive", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && !KDEnemyHasFlag(enemy, "Defensive") && !KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Defensive", -1);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.HelpMe = {playertext: name + "HelpMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && enemy.Enemy.bound && !enemy.Enemy.tags.has("nohelp") && !KDEnemyHasFlag(enemy, "NoHelp") && !KDEnemyHasFlag(enemy, "HelpMe") && KinkyDungeonAllRestraint().length > 0;
			}
			return false;
		},
		options: {
			"Confirm": {playertext: name + "HelpMe_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						if (!KDEnemyHasFlag(enemy, "NoHelp") && KDRandom() < (75 - KinkyDungeonGoddessRep.Ghost)/100 * (KDAllied(enemy) ? 2.0 : 1.0)) {
							KinkyDungeonChangeRep("Ghost", 3);
							KinkyDungeonSetEnemyFlag(enemy, "HelpMe", 20);
						} else {
							KDGameData.CurrentDialogMsg = name + "HelpMe_Fail";
							KinkyDungeonSetEnemyFlag(enemy, "NoHelp", 100);
							KinkyDungeonChangeRep("Ghost", 1);
						}
					}
					return false;
				},
				leadsToStage: "",
				dontTouchText: true,
			},
			"Leave": {playertext: name + "HelpMe_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};
	dialog.options.DontHelpMe = {playertext: name + "DontHelpMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return enemy.Enemy.bound && !enemy.Enemy.tags.has("nohelp") && KDEnemyHasFlag(enemy, "NoHelp") && KDEnemyHasFlag(enemy, "HelpMe") && KinkyDungeonAllRestraint().length > 0;
			}
			return false;
		},
		options: {
			"Confirm": {playertext: name + "DontHelpMe_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						KinkyDungeonSetEnemyFlag(enemy, "HelpMe", 0);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: name + "DontHelpMe_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};
	dialog.options.Shop = {playertext: name + "Shop", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				for (let shop of KDShops) {
					if (KDEnemyHasFlag(enemy, shop.name)) {
						KDStartDialog(shop.name, enemy.Enemy.name, true, enemy.personality, enemy);
						return true;
					}
				}
			}
		},
		exitDialogue: true,
	};
	KDAllyDialog.push({name: name, tags: requireTags, singletag: requireSingleTag, excludeTags: excludeTags, weight: weight});
	return dialog;
}

// ["wolfGear", "wolfRestraints"]
function KDRecruitDialogue(name, faction, outfitName, goddess, restraints, restraintscount, restraintsAngry, restraintscountAngry, requireTags, requireSingleTag, excludeTags, chance) {
	/**
	 * @type {KinkyDialogue}
	 */
	let recruit = {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag(name, 100);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.1);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < restraintscount; i++) {
								let r = KinkyDungeonGetRestraint({tags: restraints}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							let outfit = {name: outfitName, type: Outfit};
							if (!KinkyDungeonInventoryGet(outfitName)) KinkyDungeonInventoryAdd(outfit);
							if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
							KinkyDungeonSetDress(outfitName, outfitName);
							KDChangeFactionRelation("Player", faction, 0.4, true);
							KDChangeFactionRelation("Player", faction, -0.2);
							KinkyDungeonSlowMoveTurns = 3;
							KinkyDungeonSleepTime = CommonTime() + 200;
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = KinkyDungeonStatsChoice.has("Dominant") ? 0 : 35;
							if (KDBasicCheck([goddess], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = name + "ForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck([goddess], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = KinkyDungeonStatsChoice.has("Dominant") ? 0 : 45;
					if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck([goddess], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
					KinkyDungeonSetFlag(name, 100);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.08);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < restraintscount; i++) {
								let r = KinkyDungeonGetRestraint({tags: restraints}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							let outfit = {name: outfitName, type: Outfit};
							if (!KinkyDungeonInventoryGet(outfitName)) KinkyDungeonInventoryAdd(outfit);
							if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
							KinkyDungeonSetDress(outfitName, outfitName);
							KDChangeFactionRelation("Player", faction, 0.4, true);
							KDChangeFactionRelation("Player", faction, -0.2);
							KinkyDungeonSlowMoveTurns = 3;
							KinkyDungeonSleepTime = CommonTime() + 200;
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							KinkyDungeonChangeRep("Ghost", -1);
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = name + "Force_Failure";
								for (let i = 0; i < restraintscountAngry; i++) {
									let r = KinkyDungeonGetRestraint({tags: restraintsAngry}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
									if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
								}
								let outfit = {name: outfitName, type: Outfit};
								if (!KinkyDungeonInventoryGet(outfitName)) KinkyDungeonInventoryAdd(outfit);
								if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
								KinkyDungeonSetDress(outfitName, outfitName);
								KinkyDungeonSlowMoveTurns = 3;
								KinkyDungeonSleepTime = CommonTime() + 200;
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.hostile = 100;
									KinkyDungeonChangeRep(goddess, -2);
								}
							}
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
				},
			},
		}
	};

	KDRecruitDialog.push({name: name, outfit: outfitName, tags: requireTags, singletag: requireSingleTag, excludeTags: excludeTags, chance: chance});
	return recruit;
}

let KDMaxSellItems = 6;
function KDShopDialogue(name, items, requireTags, requireSingleTag, chance) {
	/**
	 * @type {KinkyDialogue}
	 */
	let shop = {
		shop: true,
		response: "Default",
		clickFunction: (gagged) => {
			/*let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Shop", 0);
			}*/
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (KinkyDungeonGetRestraintByName(item)) {
					KDGameData.CurrentDialogMsgData["Item"+i] = TextGet("Restraint" + item);
					let power = KinkyDungeonGetRestraintByName(item).power;
					if (!power || power < 1) power = 1;
					KDGameData.CurrentDialogMsgValue["ItemCost"+i] = 5 * Math.round((10 + 2 * Math.pow(power, 1.5))/5);
					KDGameData.CurrentDialogMsgData["ItemCost"+i] = "" + KDGameData.CurrentDialogMsgValue["ItemCost"+i];
				} else {
					KDGameData.CurrentDialogMsgData["Item"+i] = TextGet("KinkyDungeonInventoryItem" + item);
					KDGameData.CurrentDialogMsgValue["ItemCost"+i] = Math.round(KinkyDungeonItemCost(KinkyDungeonFindConsumable(item) ? KinkyDungeonFindConsumable(item) : KinkyDungeonFindWeapon(item), true, true) * 0.75);
					KDGameData.CurrentDialogMsgData["ItemCost"+i] = "" + KDGameData.CurrentDialogMsgValue["ItemCost"+i];
				}
			}
			return false;
		},
		options: {},
	};
	shop.options.Leave = {playertext: "Leave", exitDialogue: true,
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoShop", 9999);
				KinkyDungeonSetEnemyFlag(enemy, "NoTalk", 8);
			}
			return false;
		},
	};
	shop.options.Attack = {gag: true, playertext: "ItemShopAttack", response: "Default",
		options: {
			"Confirm": {playertext: "ItemShopAttack_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						enemy.hostile = 100;
						KinkyDungeonChangeRep("Ghost", -5);
						if (!KinkyDungeonHiddenFactions.includes(KDGetFactionOriginal(enemy)))
							KinkyDungeonChangeFactionRep(KDGetFactionOriginal(enemy), -0.06);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: "ItemShopAttack_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		shop.options["Item" + i] = {playertext: "ItemShop" + i, response: name + item,
			prerequisiteFunction: (gagged) => {
				return KinkyDungeonInventoryGet(item) != undefined;
			},
			clickFunction: (gagged) => {
				let itemInv = KinkyDungeonInventoryGet(item);
				if (itemInv.type == Consumable)
					KinkyDungeonChangeConsumable(KDConsumable(itemInv), -1);
				else KinkyDungeonInventoryRemove(itemInv);
				let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
				if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
					let faction = KDGetFactionOriginal(enemy);
					if (!KinkyDungeonHiddenFactions.includes(faction)) {
						KinkyDungeonChangeFactionRep(faction, Math.max(0.0001, KDGameData.CurrentDialogMsgValue["ItemCost"+i] * 0.00005));
					}
				}
				KinkyDungeonAddGold(KDGameData.CurrentDialogMsgValue["ItemCost"+i]);
				return false;
			},
			leadsToStage: "", dontTouchText: true,
		};
	}
	KDShops.push({name: name, tags: requireTags, singletag: requireSingleTag, chance: chance});
	return shop;
}

/**
 *
 * @param {(firstRefused) => boolean} setupFunction - firstRefused is if the player said no first. Happens after the user clicks
 * @param {(firstRefused) => boolean} yesFunction - firstRefused is if the player said no then yes. Happens whenever the user submits
 * @param {(firstRefused) => boolean} noFunction - firstRefused is if the player said no then no. Happens whenever the user successfully avoids
 * @param {(firstRefused) => boolean} domFunction - firstRefused is if the player said no then no. Happens when the user clicks the Dominant response
 * @returns {KinkyDialogue}
 */
function KDYesNoTemplate(setupFunction, yesFunction, noFunction, domFunction) {
	/**
	 * @type {KinkyDialogue}
	 */
	let dialogue = {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer", 5);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					return setupFunction(false);
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return yesFunction(false);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return noFunction(false);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							return domFunction(false);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					return setupFunction(true);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return yesFunction(true);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return noFunction(true);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							return domFunction(true);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
		}
	};


	return dialogue;
}

/**
 *
 * @param {string} name
 * @param {string[]} goddess
 * @param {string[]} antigoddess
 * @param {string[]} restraint
 * @param {number[]} diffSpread
 * @param {number[]} OffdiffSpread
 * @returns {KinkyDialogue}
 */
function KDYesNoSingle(name, goddess, antigoddess, restraint, diffSpread, OffdiffSpread) {
	return KDYesNoTemplate(
		(refused) => { // Setup function. This is run when you click Yes or No in the start of the dialogue
			// This is the restraint that the dialogue offers to add. It's selected from a set of tags. You can change the tags to change the restraint
			let r = KinkyDungeonGetRestraint({tags: restraint}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (r) {
				KDGameData.CurrentDialogMsgData = {
					"Data_r": r.name,
					"RESTRAINT": TextGet("Restraint" + r.name),
				};

				// Percent chance your dominant action ("Why don't you wear it instead?") succeeds
				// Based on a difficulty that is the sum of four lines
				// Dominant perk should help with this
				KDGameData.CurrentDialogMsgValue.PercentOff =
					KDOffensiveDialogueSuccessChance(KDBasicCheck(goddess, [])
					- (KDDialogueGagged() ? 60 : 40)
					- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
					- KDPersonalitySpread(OffdiffSpread[0], OffdiffSpread[1], KinkyDungeonStatsChoice.has("Dominant") ? OffdiffSpread[3] : OffdiffSpread[2]));
				// Set the string to replace in the UI
				KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
			}

			// If the player hits No first, this happens
			if (refused) {
				// Set up the difficulty of the check
				// This check basically determines if we switch to the Force stage where the speaker tries to force you
				let diff = KinkyDungeonStatsChoice.has("Dominant") ? diffSpread[1] : diffSpread[0];
				// Failure condition
				if (KDBasicCheck(goddess, antigoddess) <= diff) {
					KDGameData.CurrentDialogStage = "Force";
					KDGameData.CurrentDialogMsg = name + "ForceYes"; // This is different from OfferLatexForce_Yes, it's a more reluctant dialogue...
					// Set up percentage chance to resist
					KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(goddess, antigoddess));
					KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
				}
				KinkyDungeonChangeRep(antigoddess[0], -1); // Reduce submission because of refusal
			}
			return false;
		},(refused) => { // Yes function. This happens if the user submits willingly
			KinkyDungeonChangeRep(goddess[0], 1);
			KDPleaseSpeaker(refused ? 0.004 : 0.005); // Less reputation if you refused
			KinkyDungeonChangeRep(antigoddess[0], refused ? 1 : 2); // Less submission if you refused
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
			return false;
		},(refused) => { // No function. This happens when the user refuses.
			// The first half is basically the same as the setup function, but only if the user did not refuse the first yes/no
			if (!refused) {
				// This check basically determines if we switch to the Force stage where the speaker tries to force you
				let diff = KinkyDungeonStatsChoice.has("Dominant") ? diffSpread[3] : diffSpread[2]; // Slightly harder because we refused
				// Failure condition
				if (KDBasicCheck(goddess, antigoddess) <= diff) {
					KDGameData.CurrentDialogStage = "Force";
					KDGameData.CurrentDialogMsg = "";
					// Set up percentage chance to resist
					KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(goddess, antigoddess));
					KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
				}
				KinkyDungeonChangeRep(antigoddess[0], -1);
			} else { // If the user refuses we use the already generated success chance and calculate the result
				let percent = KDGameData.CurrentDialogMsgValue.Percent;
				if (KDRandom() > percent) { // We failed! You get tied tight
					KDIncreaseOfferFatigue(-20);
					KDGameData.CurrentDialogMsg = name + "Force_Failure";
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
				} else {
					KDIncreaseOfferFatigue(10);
				}
			}
			return false;
		},(refused) => { // Dom function. This is what happens when you try the dominant option
			// We use the already generated percent chance
			let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
			if (KDRandom() > percent) {
				// If we fail, we aggro the enemy
				KDIncreaseOfferFatigue(-20);
				KDGameData.CurrentDialogMsg = "OfferDominantFailure";
				KDAggroSpeaker(10);
			} else {
				// If we succeed, we get the speaker enemy and bind them
				KDIncreaseOfferFatigue(10);
				let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
				if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
					enemy.playWithPlayer = 0;
					enemy.playWithPlayerCD = 999;
					let amount = 10;
					if (!enemy.boundLevel) enemy.boundLevel = amount;
					else enemy.boundLevel += amount;
				}
				KinkyDungeonChangeRep(antigoddess[0], -4); // Reduce submission because dom
			}
			return false;
		});
}


/**
 * A shop where the seller sells items
 * @returns {KinkyDialogue}
 */
function KDSaleShop(name, items, requireTags, requireSingleTag, chance, markup) {
	if (!markup) markup = 1.0;
	let shop = {
		shop: true,
		response: "Default",
		clickFunction: (gagged) => {
			/*let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Shop", 0);
			}*/
			if (KDDialogueEnemy()) {
				let enemy = KDDialogueEnemy();
				if (!enemy.items)
					enemy.items = items;
			}
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (KinkyDungeonGetRestraintByName(item)) {
					KDGameData.CurrentDialogMsgData["Item"+i] = TextGet("Restraint" + item);
					let power = KinkyDungeonGetRestraintByName(item).power;
					if (!power || power < 1) power = 1;
					KDGameData.CurrentDialogMsgValue["ItemCost"+i] = 5 * Math.round((10 + 2 * Math.pow(power, 1.5))/5);
					KDGameData.CurrentDialogMsgData["ItemCost"+i] = "" + KDGameData.CurrentDialogMsgValue["ItemCost"+i];
				} else {
					KDGameData.CurrentDialogMsgData["Item"+i] = TextGet("KinkyDungeonInventoryItem" + item);
					KDGameData.CurrentDialogMsgValue["ItemCost"+i] = Math.round(KinkyDungeonItemCost(KinkyDungeonFindConsumableOrBasic(item) ? KinkyDungeonFindConsumableOrBasic(item) : KinkyDungeonFindWeapon(item), true, true) * markup);
					KDGameData.CurrentDialogMsgData["ItemCost"+i] = "" + KDGameData.CurrentDialogMsgValue["ItemCost"+i];
				}
			}
			return false;
		},
		options: {},
	};
	shop.options.Leave = {playertext: "Leave", exitDialogue: true,
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoShop", 9999);
				KinkyDungeonSetEnemyFlag(enemy, "NoTalk", 8);
			}
			return false;
		},
	};
	shop.options.Attack = {gag: true, playertext: "ItemShopAttack", response: "Default",
		options: {
			"Confirm": {playertext: "ItemShopAttack_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						enemy.hostile = 100;
						KinkyDungeonChangeRep("Ghost", -5);
						if (!KinkyDungeonHiddenFactions.includes(KDGetFactionOriginal(enemy)))
							KinkyDungeonChangeFactionRep(KDGetFactionOriginal(enemy), -0.06);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: "ItemShopAttack_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		shop.options["Item" + i] = {playertext: "ItemShopBuy" + i, response: name + item,
			prerequisiteFunction: (gagged) => {
				return true;//KinkyDungeonInventoryGet(item) != undefined;
			},
			clickFunction: (gagged) => {
				let buy = false;
				if (KinkyDungeonGold >= KDGameData.CurrentDialogMsgValue["ItemCost"+i]) {
					buy = true;
					if (KinkyDungeonGetRestraintByName(item)) {
						// Sell the player a restraint
						let rest = KinkyDungeonGetRestraintByName(item);
						if (!KinkyDungeonInventoryGetLoose(rest.name)) {
							KinkyDungeonInventoryAdd({name: rest.name, type: LooseRestraint, events:rest.events, quantity: 1});
						} else {
							if (!KinkyDungeonInventoryGetLoose(rest.name).quantity) KinkyDungeonInventoryGetLoose(rest.name).quantity = 0;
							KinkyDungeonInventoryGetLoose(rest.name).quantity += 1;
						}
					} else if (KinkyDungeonFindBasic(item)) {
						KDAddBasic(KinkyDungeonFindBasic(item));
					} else if (KinkyDungeonFindConsumable(item)) {
						KinkyDungeonChangeConsumable(KinkyDungeonFindConsumable(item), 1);
					} else if (KinkyDungeonFindWeapon(item)) {
						if (!KinkyDungeonInventoryGetWeapon(item)) {
							KinkyDungeonInventoryAddWeapon(item);
						} else {
							KDGameData.CurrentDialogMsg = name + "_AlreadyHave";
							buy = false;
						}
					}
				} else {
					KDGameData.CurrentDialogMsg = name + "_NoMoney";
				}

				if (buy) {
					KinkyDungeonAddGold(-KDGameData.CurrentDialogMsgValue["ItemCost"+i]);
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						let faction = KDGetFactionOriginal(enemy);
						if (!KinkyDungeonHiddenFactions.includes(faction)) {
							KinkyDungeonChangeFactionRep(faction, Math.max(0.0001, KDGameData.CurrentDialogMsgValue["ItemCost"+i] * 0.0001));
						}
					}
				}
				return false;
			},
			leadsToStage: "", dontTouchText: true,
		};
	}
	KDShops.push({name: name, tags: requireTags, singletag: requireSingleTag, chance: chance});
	return shop;
}

/*

					"Leave": {playertext: "Leave", exitDialogue: true}
				clickFunction: (gagged) => {KinkyDungeonStartChase(undefined, "Refusal");},

clickFunction: (gagged) => {
	KinkyDungeonChangeRep("Ghost", 3);
},*/

/** Yoinks a nearby enemy and brings them next to x */
function DialogueBringNearbyEnemy(x, y, radius) {
	for (let e of KinkyDungeonEntities) {
		if (KDistChebyshev(x - e.x, y - e.y) <= radius && KinkyDungeonAggressive(e)) {
			let point = KinkyDungeonGetNearbyPoint(x, y, true);
			if (point) {
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonDiscovered"), "red", 1);
				KDMoveEntity(e, point.x, point.y, true);
				break;
			}

		}
	}
}