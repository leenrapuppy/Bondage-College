"use strict";

/** @type {Record<string, KinkyDialogue>} */
let KDDialogue = {
	"WeaponFound": {
		response: "WeaponFound",
		personalities: ["Robot"],
		options: {
			"Accept": {gag: true, playertext: "WeaponFoundAccept", response: "GoodGirl", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: (gagged) => {
					KinkyDungeonSendTextMessage(10, TextGet("KDWeaponConfiscated"), "red", 2);
					let weapon = KinkyDungeonPlayerDamage.name;
					if (weapon && weapon != "Knife") {
						KinkyDungeonChangeRep("Ghost", 3);
						let item = KinkyDungeonInventoryGetWeapon(weapon);
						KDSetWeapon(null);
						KinkyDungeonAddLostItems([item], false);
						KinkyDungeonInventoryRemove(item);
					}
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Bluff": {playertext: "", response: "",
				prerequisiteFunction: (gagged) => {return false;},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Deny": {gag: true, playertext: "WeaponFoundDeny", response: "Punishment", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: (gagged) => {KinkyDungeonStartChase(undefined, "Refusal");},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Illusion": {gagDisabled: true, playertext: "WeaponFoundIllusion", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Illusion >= 51;},
				clickFunction: (gagged) => {
					if (KDGameData.CurrentDialogMsgSpeaker == "MaidforceHead") {
						KDGameData.CurrentDialogStage = "Deny";
						KDGameData.CurrentDialogMsg = "HeadMaidExcuseMe";
						KinkyDungeonStartChase(undefined, "Refusal");
					} else {
						let diff = KDPersonalitySpread(40, 60, 80);
						if (KDBasicCheck(["Illusion", "Ghost"], ["Prisoner"]) > diff) {
							KDGameData.CurrentDialogStage = "Bluff";
							KDGameData.CurrentDialogMsg = "Bluffed";
							KinkyDungeonChangeRep("Ghost", -2);
						}
						KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
					}
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Conjure": {gagDisabled: true, playertext: "WeaponFoundConjure", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Conjure >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Conjure", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Elements": {gagDisabled: true, playertext: "WeaponFoundElements", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Elements >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Elements", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Rope": {gagDisabled: true, playertext: "WeaponFoundRope", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Rope >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Rope", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Leather": {gagDisabled: true, playertext: "WeaponFoundLeather", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Leather >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Leather", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
		}
	},
	"PrisonIntro": {
		response: "Default",
		options: {
			"NewLife": {playertext: "Default", response: "Default",
				options: {
					"Pout": {playertext: "Default", response: "Default", options: {"Continue" : {playertext: "Continue", leadsToStage: "Rules"}}},
					"Brat": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", -10);
							KinkyDungeonChangeRep("Prisoner", 10);
						},
						options: {"Continue" : {playertext: "Continue", leadsToStage: "Rules"}}},
					"Sub": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", 10);
						},
						options: {"Continue" : {playertext: "Continue", leadsToStage: "Rules"}}},
				}
			},
			"Rules": {playertext: "Default", response: "Default",
				options: {
					"Pout": {playertext: "Default", response: "Default", options: {"Continue" : {playertext: "Continue", exitDialogue: true}}},
					"Brat": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", -10);
							KinkyDungeonChangeRep("Prisoner", 10);
						},
						options: {"Continue" : {playertext: "Continue", exitDialogue: true}}},
					"Sub": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", 10);
						},
						options: {"Continue" : {playertext: "Continue", exitDialogue: true}}},
				}
			},
		}
	},
	"PrisonRepeat": {
		response: "Default",
		options: {
			"Smile": {playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return !(KinkyDungeonGetRestraintItem("ItemVulva"));},
				clickFunction: (gagged) => {
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), 0, true);
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug2"), 0, true);
					KinkyDungeonChangeRep("Ghost", 3);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Smile2": {playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return KinkyDungeonGetRestraintItem("ItemVulva") != undefined;},
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", 5);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Struggle": {playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return KinkyDungeonGetRestraintItem("ItemArms") != undefined;},
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Prisoner", 3);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Pout": {playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", -3);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
		}
	},
	"OfferLatex": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer",  5);
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Latex", 1);
					let r = KinkyDungeonGetRestraint({tags: ["latexRestraints", "latexRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r)
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
						};
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.005);
							KinkyDungeonChangeRep("Ghost", 2);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KDBasicCheck(["Latex"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferLatexForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Latex"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					let r = KinkyDungeonGetRestraint({tags: ["latexRestraints", "latexRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r)
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
						};
					if (KDBasicCheck(["Latex"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Latex"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.004);
							KinkyDungeonChangeRep("Ghost", 1);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							if (KDRandom() > percent) {
								// Fail
								KDGameData.CurrentDialogMsg = "OfferLatexForce_Failure";
								KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
				},
			},
		}
	},
	"OfferChastity": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer",  5);
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Metal", 1);
					let r = KinkyDungeonGetRestraint({tags: ["genericChastity"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r)
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
							"ChastityLock": MiniGameKinkyDungeonLevel + KDRandom()*3 > 3 ? (MiniGameKinkyDungeonLevel + KDRandom()*6 > 9 ? "Gold" : "Blue") : "Red",
						};
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDAllySpeaker(9999);
							KinkyDungeonChangeRep("Ghost", 2);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, KDGameData.CurrentDialogMsgData.ChastityLock);
						},
						options: {
							"Leave": {playertext: "Leave", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock == "Red";}, exitDialogue: true},
							"Observe": {playertext: "OfferChastityObserve", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock != "Red";}, leadsToStage: "Glow"},
						},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferChastityForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Metal"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					let r = KinkyDungeonGetRestraint({tags: ["genericChastity"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r)
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
							"ChastityLock": MiniGameKinkyDungeonLevel + KDRandom()*3 > 3 ? (MiniGameKinkyDungeonLevel + KDRandom()*6 > 9 ? "Gold" : "Blue") : "Red",
						};
					if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Metal"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDAllySpeaker(9999);
							KinkyDungeonChangeRep("Ghost", 1);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, KDGameData.CurrentDialogMsgData.ChastityLock);
						},
						options: {
							"Leave": {playertext: "Leave", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock == "Red";}, exitDialogue: true},
							"Observe": {playertext: "OfferChastityObserve", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock != "Red";}, leadsToStage: "Glow"},
						},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDAllySpeaker(30);
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							if (KDRandom() > percent) {
								// Fail
								KDGameData.CurrentDialogMsg = "OfferChastityForce_Failure";
								KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, KDGameData.CurrentDialogMsgData.ChastityLock);
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"Glow": {playertext: "Default", response: "OfferChastityGlow",
				prerequisiteFunction: (gagged) => {return false;},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
		}
	},
	"OfferLeather": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer",  5);
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Leather", 1);
					let r = KinkyDungeonGetRestraint({tags: ["leatherRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r)
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
						};
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.005);
							KinkyDungeonChangeRep("Ghost", 2);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KDBasicCheck(["Leather"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferLeatherForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Leather"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					let r = KinkyDungeonGetRestraint({tags: ["leatherRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r)
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
						};
					if (KDBasicCheck(["Leather"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Leather"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.004);
							KinkyDungeonChangeRep("Ghost", 1);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							if (KDRandom() > percent) {
								// Fail
								KDGameData.CurrentDialogMsg = "OfferLeatherForce_Failure";
								KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
				},
			},
		}
	},
	"OfferRopes": {
		response: "Default",
		clickFunction: (gagged) => {
			if (KinkyDungeonGetRestraintsWithShrine("Rope").length > 0) {
				KDGameData.CurrentDialogMsg = "OfferRopesExtra";
			}
			KinkyDungeonSetFlag("BondageOffer",  5);
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Rope", 1);
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.005);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < 3; i++) {
								let r = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KDBasicCheck(["Rope"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferRopesForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Rope"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					if (KDBasicCheck(["Rope"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Rope"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.004);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < 3; i++) {
								let r = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							KinkyDungeonChangeRep("Ghost", -1);
							if (KDRandom() > percent) {
								// Fail
								KDGameData.CurrentDialogMsg = "OfferRopesForce_Failure";
								for (let i = 0; i < 5; i++) {
									let r = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
									if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
								}
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
				},
			},
		}
	},
	"OfferWolfgirl": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("WolfgirlOffer", 100);
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.1);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < 3; i++) {
								let r = KinkyDungeonGetRestraint({tags: ["wolfGear"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							let outfit = {name: "Wolfgirl", type: Outfit};
							if (!KinkyDungeonInventoryGet("Wolfgirl")) KinkyDungeonInventoryAdd(outfit);
							if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
							KinkyDungeonSetDress("Wolfgirl", "Wolfgirl");
							KinkyDungeonSlowMoveTurns = 3;
							KinkyDungeonSleepTime = CommonTime() + 200;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 35;
							if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferRopesForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Metal"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 45;
					if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Metal"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
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
							for (let i = 0; i < 3; i++) {
								let r = KinkyDungeonGetRestraint({tags: ["wolfGear"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							let outfit = {name: "Wolfgirl", type: Outfit};
							if (!KinkyDungeonInventoryGet("Wolfgirl")) KinkyDungeonInventoryAdd(outfit);
							if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
							KinkyDungeonSetDress("Wolfgirl", "Wolfgirl");
							KinkyDungeonSlowMoveTurns = 3;
							KinkyDungeonSleepTime = CommonTime() + 200;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							KinkyDungeonChangeRep("Ghost", -1);
							if (KDRandom() > percent) {
								// Fail
								KDGameData.CurrentDialogMsg = "OfferRopesForce_Failure";
								for (let i = 0; i < 8; i++) {
									let r = KinkyDungeonGetRestraint({tags: ["wolfGear", "wolfRestraints"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
									if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
								}
								let outfit = {name: "Wolfgirl", type: Outfit};
								if (!KinkyDungeonInventoryGet("Wolfgirl")) KinkyDungeonInventoryAdd(outfit);
								if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
								KinkyDungeonSetDress("Wolfgirl", "Wolfgirl");
								KinkyDungeonSlowMoveTurns = 3;
								KinkyDungeonSleepTime = CommonTime() + 200;
							} else {
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.hostile = 100;
									KinkyDungeonChangeRep("Metal", -2);
								}
							}
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
				},
			},
		}
	},
	// TODO magic book dialogue in which you can read forward and there are traps
};

// Success chance for a basic dialogue
function KDBasicDialogueSuccessChance(checkResult) {
	return Math.max(0, Math.min(1.0, checkResult/100));
}

// Success chance for a basic dialogue
function KDAgilityDialogueSuccessChance(checkResult) {
	let evasion = KinkyDungeonPlayerEvasion();
	return Math.max(0, Math.min(1.0, (checkResult/100 + 0.2 * Math.max(0, 3 - KinkyDungeonSlowLevel)) * evasion));
}

/**
 *
 * @param {number} Amount
 */
function KDPleaseSpeaker(Amount) {
	let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
	if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
		let faction = KDGetFaction(enemy);
		if (!KinkyDungeonHiddenFactions.includes(faction))
			KinkyDungeonChangeFactionRep(faction, Amount);
	}
}

function KDAllySpeaker(Turns) {
	let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
	if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
		if (!(enemy.hostile > 0)) {
			enemy.allied = Turns;
		}
	}
}

/*

					"Leave": {playertext: "Leave", exitDialogue: true}
				clickFunction: (gagged) => {KinkyDungeonStartChase(undefined, "Refusal");},

clickFunction: (gagged) => {
	KinkyDungeonChangeRep("Ghost", 3);
},*/