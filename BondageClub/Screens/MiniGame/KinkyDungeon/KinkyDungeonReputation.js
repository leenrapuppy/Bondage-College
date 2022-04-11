"use strict";

const KDANGER = -19;
const KDRAGE = -31;

/**
 * @type {Record<string, number>}
 */
let KinkyDungeonGoddessRep = {
};

/**
 * @type {Record<string, boolean>}
 */
let KinkyDungeonRescued = {};
/**
 * @type {Record<string, boolean>}
 */
let KinkyDungeonAid = {};

let KDRepSelectionMode = "";

let KDBlessedRewards = {
	"Latex": ["StaffDoll"],
	"Rope": ["StaffBind"],
	"Metal": ["StaffStorm"],
	"Leather": ["Dragonslaver"],
	"Will": ["MagicHammer", "MagicFlail", "MagicSpear"],
	"Elements": ["IceBreaker",],
	"Conjure": ["MagicSword"],
	"Illusion": ["MagicAxe"],
};

function KDPearlRequirement() {
	let has = false;
	for (let rep of Object.entries(KinkyDungeonGoddessRep)) {
		let rewards = KDBlessedRewards[rep[0]];
		if (rewards) {
			let missing = true;
			for (let r of rewards) {
				if (KinkyDungeonInventoryGet(r)) {
					missing = false;
					break;
				}
			}
			if (missing && rep[1] > 45) {
				has = true;
				break;
			}
		}

	}
	return has;
}

function KinkyDungeonInitReputation() {
	KinkyDungeonGoddessRep = {"Ghost" : -50, "Prisoner" : -50};
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		KinkyDungeonGoddessRep[shrine] = KinkyDungeonStatsChoice.get("Cursed") ? -50 : 0;
	}
	if (KinkyDungeonStatsChoice.get("Wanted")) KinkyDungeonChangeRep("Prisoner", 100);
	if (KinkyDungeonStatsChoice.get("Submissive")) KinkyDungeonChangeRep("Ghost", 100);

	if (KinkyDungeonStatsChoice.get("Unchained")) KinkyDungeonChangeRep("Metal", 10);
	if (KinkyDungeonStatsChoice.get("Artist")) KinkyDungeonChangeRep("Rope", 10);
	if (KinkyDungeonStatsChoice.get("Slippery")) KinkyDungeonChangeRep("Latex", 10);
	if (KinkyDungeonStatsChoice.get("Escapee")) KinkyDungeonChangeRep("Leather", 10);

	if (KinkyDungeonStatsChoice.get("Damsel")) KinkyDungeonChangeRep("Metal", -10);
	if (KinkyDungeonStatsChoice.get("Bunny")) KinkyDungeonChangeRep("Rope", -10);
	if (KinkyDungeonStatsChoice.get("Doll")) KinkyDungeonChangeRep("Latex", -10);
	if (KinkyDungeonStatsChoice.get("Dragon")) KinkyDungeonChangeRep("Leather", -10);
}

function KinkyDungeonRepName(Amount) {
	let name = "";

	if (Amount > 10) name = "Thankful";
	if (Amount > 30) name = "Pleased";
	if (Amount > 45) name = "Blessed";
	if (Amount < KDANGER) name = "Angered";
	if (Amount < KDRAGE) name = "Enraged";
	if (Amount < -45) name = "Cursed";

	return TextGet("KinkyDungeonRepName" + name);
}

function KinkyDungeonChangeRep(Rep, Amount) {
	if (KinkyDungeonGoddessRep[Rep] != undefined) {
		let last = KinkyDungeonGoddessRep[Rep];
		let minimum = (Rep == "Ghost" && KinkyDungeonStatsChoice.get("Submissive")) || (Rep == "Prisoner" && KinkyDungeonStatsChoice.get("Wanted")) ? 20: -50;
		let maximum = (KinkyDungeonStatsChoice.get("Cursed") && (Rep != "Ghost" && Rep != "Prisoner")) ? -25: 50;
		//let target = -50;
		//let interval = 0.02;
		let start = KinkyDungeonGoddessRep[Rep];
		//if (Amount >= 0) target = 50;
		/*for (let i = 0; i < Math.abs(Amount); i++) {
			KinkyDungeonGoddessRep[Rep] += (target - KinkyDungeonGoddessRep[Rep]) * interval;
		}*/
		KinkyDungeonGoddessRep[Rep] += Amount;
		KinkyDungeonGoddessRep[Rep] = Math.min(maximum, Math.max(minimum, KinkyDungeonGoddessRep[Rep]));
		if (Math.abs(KinkyDungeonGoddessRep[Rep] - start) > 0.1) {
			let amount = Math.round((KinkyDungeonGoddessRep[Rep] - start)*10)/10;
			KinkyDungeonSendFloater({x: 1100, y: 800 - KDRecentRepIndex * 40}, `${amount > 0 ? '+' : ''}${amount}% ${TextGet("KinkyDungeonShrine" + Rep)} rep`, "white", 5, true);
			KDRecentRepIndex += 1;
		}
		if (KinkyDungeonGoddessRep[Rep] != last) return true;
		return false;
	}
	return false;
}

function KinkyDungeonHandleReputation() {
	let i = 0;
	let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let yPad = 50;
	for (let rep in KinkyDungeonGoddessRep) {
		let value = KinkyDungeonGoddessRep[rep];

		if (rep) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			if (KinkyDungeonShrineBaseCosts[rep]) {
				if (KDRepSelectionMode == "" && KinkyDungeonInJail() && MouseIn(600, 800, 250, 50)) {
					KDRepSelectionMode = "Rescue";
					return true;
				} else if (KDRepSelectionMode == "" && MouseIn(1200, 800, 250, 50)) {
					KDRepSelectionMode = "Penance";
					return true;
				} else if (KDRepSelectionMode == "" && MouseIn(900, 800, 250, 50)) {
					KDRepSelectionMode = "Aid";
					return true;
				} else if (KDRepSelectionMode == "" && MouseIn(1500, 800, 250, 50)) {
					KDRepSelectionMode = "Champion";
					return true;
				}


				if (KDRepSelectionMode == "Aid" && MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40) && KinkyDungeonCanAidMana(rep, value)) {
					// Aid
					KinkyDungeonChangeMana(KinkyDungeonAidManaAmount(rep, value));
					KinkyDungeonChangeRep(rep, -KinkyDungeonAidManaCost(rep));
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAidManaMe"), "purple", 2);
					KinkyDungeonDrawState = "Game";
					KDRepSelectionMode = "";
				} else if (KDRepSelectionMode == "Rescue" && MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40) && KinkyDungeonCanRescue(rep, value)) {
					// Rescue
					KinkyDungeonRescued[rep] = true;

					if (KDRandom() < 0.5 + value/100) {
						KinkyDungeonChangeRep(rep, -10);
						let allies = KinkyDungeonGetAllies();
						KinkyDungeonEntities = allies;
						KinkyDungeonJailTransgressed = false;
						KDGameData.KinkyDungeonJailGuard = 0;
						KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonRescueMe"), "purple", 10);
						for (let T of KinkyDungeonTiles.values()) {
							if (T.Lock) T.Lock = undefined;
							if (T.Type == "Trap") T.Type = undefined;
						}
						KinkyDungeonDrawState = "Game";
						KDGameData.RescueFlag = true;
					} else {
						KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonNoRescue"), "purple", 10);
						KinkyDungeonDrawState = "Game";
					}
					KDRepSelectionMode = "";
					return true;
				} else if (KDRepSelectionMode == "Penance" && MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40) && KinkyDungeonCanPenance(rep, value)) {
					// Penance
					KDGameData.KinkyDungeonPenance = true;
					KDGameData.KDPenanceMode = "";
					KDGameData.KDPenanceStage = 0;
					KDGameData.KDPenanceStageEnd = 0;
					KDGameData.AngelCurrentRep = rep;
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonPenanceHappen"), "purple", 4);
					KDGameData.KinkyDungeonPenanceCostCurrent = KinkyDungeonPenanceCosts[rep] ? KinkyDungeonPenanceCosts[rep] : KinkyDungeonPenanceCostDefault;
					if (KinkyDungeonGold >= KDGameData.KinkyDungeonPenanceCostCurrent) {
						if (KinkyDungeonPenanceCosts[rep]) KinkyDungeonPenanceCosts[rep] += KinkyDungeonPenanceCostGrowth;
						else KinkyDungeonPenanceCosts[rep] = KinkyDungeonPenanceCostDefault + KinkyDungeonPenanceCostGrowth;
					}
					KDRepSelectionMode = "";
					KinkyDungeonDrawState = "Game";
					return true;
				} else if (KDRepSelectionMode == "Champion" && MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40)) {
					// Penance
					KDGameData.Champion = rep;
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonBecomeChampion").replace("GODDESS", TextGet("KinkyDungeonShrine" + rep)), "yellow", 1);
					return true;
				}
			}

			i++;
		}

	}
	//if (!noReturn)
	KDRepSelectionMode = "";
	return true;
}

function KinkyDungeonDrawReputation() {
	let i = 0;
	let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let yPad = 50;
	for (let rep in KinkyDungeonGoddessRep) {
		MainCanvas.textAlign = "left";
		let value = KinkyDungeonGoddessRep[rep];

		if (rep) {
			if (spacing * i > maxY) {
				if (XX == 0) i = 0;
				XX = 600;
			}
			let color = "#ffff00";
			if (value < -10) {
				if (value < -30) color = "#ff0000";
				else color = "#ff8800";
			} else if (value > 10) {
				if (value > 30) color = "#00ff00";
				else color = "#88ff00";
			}
			let suff = "";
			if (rep != "Ghost" && rep != "Prisoner") suff = "" + KinkyDungeonRepName(value);
			DrawText(TextGet("KinkyDungeonShrine" + rep), canvasOffsetX_ui + XX, yPad + canvasOffsetY_ui + spacing * i, "white", "black");
			if (suff) {
				DrawTextFit(suff, 1+canvasOffsetX_ui + 275 + XX + 250, 1+yPad + canvasOffsetY_ui + spacing * i, 100, "black", "black");
				DrawTextFit(suff, canvasOffsetX_ui + 275 + XX + 250, yPad + canvasOffsetY_ui + spacing * i, 100, "white", "black");
			}
			DrawProgressBar(canvasOffsetX_ui + 275 + XX, yPad + canvasOffsetY_ui + spacing * i - spacing/4, 200, spacing/2, 50 + value, color, "#444444");

			MainCanvas.textAlign = "center";
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX_ui + 275 + XX + 100+1,  1+yPad + canvasOffsetY_ui + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX_ui + 275 + XX + 100-1,  1+yPad + canvasOffsetY_ui + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX_ui + 275 + XX + 100+1,  3+yPad + canvasOffsetY_ui + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX_ui + 275 + XX + 100-1,  3+yPad + canvasOffsetY_ui + spacing * i, "black", "black");
			DrawText(" " + (Math.round(value)+50) + " ", canvasOffsetX_ui + 275 + XX + 100,  2+yPad + canvasOffsetY_ui + spacing * i, "white", "black");

			if (KDRepSelectionMode == "") {
				DrawButton(600, 800, 250, 50, TextGet("KinkyDungeonAskRescue"), KinkyDungeonInJail() ? "white" : "#999999");
				DrawButton(1200, 800, 250, 50, TextGet("KinkyDungeonAskPenance"), "white");
				DrawButton(900, 800, 250, 50, TextGet("KinkyDungeonAskAid"), "white");
				DrawButton(1500, 800, 250, 50, TextGet("KinkyDungeonAskChampion"), "white");
			} else {
				DrawButton(900, 800, 250, 50, TextGet("KinkyDungeonBack"), "white");
			}

			if (KinkyDungeonShrineBaseCosts[rep]) {
				MainCanvas.textAlign = "center";
				//DrawButton(canvasOffsetX_ui + 275 + XX + 400, yPad + canvasOffsetY_ui + spacing * i - 20, 100, 40, TextGet("KinkyDungeonAid"), value > 10 ? "white" : "pink");
				if (KDRepSelectionMode == "Rescue") {
					DrawButton(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40, TextGet("KinkyDungeonRescue"), (KinkyDungeonCanRescue(rep, value)) ? "white" : (KinkyDungeonInJail() && !KinkyDungeonRescued[rep] ? "pink" : "#999999"));
					if (MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40)) {
						DrawTextFit(TextGet("KinkyDungeonRescueDesc"), 1100+1, 850+1, 1250, "black", "black");
						DrawTextFit(TextGet("KinkyDungeonRescueDesc"), 1100, 850, 1250, "white", "black");
						// Rescue
					}
				}
				if (KDRepSelectionMode == "Penance") {
					DrawButton(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40, TextGet("KinkyDungeonPenance"), (KinkyDungeonCanPenance(rep, value)) ? "white" : (KDGameData.KinkyDungeonPenance ? "purple" : "#999999"));
					if (MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40)) {
						DrawTextFit(TextGet("KinkyDungeonPenanceDesc").replace("AMOUNT", "" + KinkyDungeonPenanceCost(rep)), 1100+1, 900+1, 1250, "black", "black");
						DrawTextFit(TextGet("KinkyDungeonPenanceDesc").replace("AMOUNT", "" + KinkyDungeonPenanceCost(rep)), 1100, 900, 1250, "white", "black");
						// Rescue
					}
				}
				if (KDRepSelectionMode == "Aid") {
					DrawButton(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40, TextGet("KinkyDungeonAidMana"), (KinkyDungeonCanAidMana(rep, value)) ? "white" : "#999999");
					if (MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40)) {
						DrawTextFit(TextGet("KinkyDungeonAidManaDesc").replace("AMOUNT", "" + KinkyDungeonAidManaCost(rep)).replace("MANALEVEL", "" + KinkyDungeonAidManaAmount(rep, value)), 1100+1, 900+1, 1250, "black", "black");
						DrawTextFit(TextGet("KinkyDungeonAidManaDesc").replace("AMOUNT", "" + KinkyDungeonAidManaCost(rep)).replace("MANALEVEL", "" + KinkyDungeonAidManaAmount(rep, value)), 1100, 900, 1250, "white", "black");
						// Rescue
					}
				}
				if (KDRepSelectionMode == "Champion") {
					let isChampion = KDGameData.Champion == rep;
					DrawButton(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40, TextGet(isChampion ? "KinkyDungeonChampionCurrent" : "KinkyDungeonChampionSwitch"),
						(isChampion) ? "white" : "#999999");
					if (MouseIn(canvasOffsetX_ui + 275 + XX + 520, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40)) {
						DrawTextFit(TextGet("KinkyDungeonChampionDesc"), 1100+1, 900+1, 1250, "black", "black");
						DrawTextFit(TextGet("KinkyDungeonChampionDesc"), 1100, 900, 1250, "white", "black");
						// Rescue
					}
				}

				//DrawButton(canvasOffsetX_ui + 275 + XX + 690, yPad + canvasOffsetY_ui + spacing * i - 20, 150, 40, TextGet("KinkyDungeonPenance"), "white");
			}

			i++;
		}

	}
	MainCanvas.textAlign = "center";
}

/**
 * Current costs multipliers for shrines
 * @type {Record<string, number>}
 */
let KinkyDungeonPenanceCosts = {};
let KinkyDungeonPenanceRepBonus = 5;
let KinkyDungeonPenanceRepBonusFail = 1;
let KinkyDungeonPenanceCostGrowth = 50;
let KinkyDungeonPenanceCostDefault = 200;

function KinkyDungeonPenanceCost(rep) {
	if (KinkyDungeonGoddessRep[rep]) {
		if (KinkyDungeonPenanceCosts[rep]) {
			return KinkyDungeonPenanceCosts[rep];
		}
	}
	return KinkyDungeonPenanceCostDefault;
}

function KinkyDungeonCanPenance(rep, value) {
	return value < 40 && !KDGameData.KinkyDungeonPenance && KinkyDungeonBullets.length < 1;
}

function KinkyDungeonAidManaCost(rep) {
	return 3;
}

function KinkyDungeonAidManaAmount(rep, value) {
	return 1 + Math.floor(19 * (value + 50) / 100);
}

function KinkyDungeonCanAidMana(rep, value) {
	return value > -30 && KinkyDungeonStatMana < KinkyDungeonStatManaMax;
}

function KinkyDungeonCanRescue(rep, value) {
	return (KinkyDungeonEntities.length > 0 || KinkyDungeonJailTransgressed == true) && value > KDRAGE && !KinkyDungeonRescued[rep] && KinkyDungeonInJail();
}


function KinkyDungeonUpdatePenance(delta) {
	if (KDGameData.KinkyDungeonPenance) {
		if (!KinkyDungeonAngel()) {
			KinkyDungeonCreateAngel(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
		}
		if (KinkyDungeonAngel()) {
			KinkyDungeonAngel().gx = KinkyDungeonPlayerEntity.x;
			KinkyDungeonAngel().gy = KinkyDungeonPlayerEntity.y;
			if (KDGameData.KDPenanceMode == "") {
				KinkyDungeonBullets = [];
				if (KDGameData.KDPenanceStage == 0) {
					let divineRestraints = [];
					for (let inv of KinkyDungeonAllRestraint()) {
						if (inv.restraint && inv.restraint.divine) {
							divineRestraints.push(inv);
						}
					}
					if (divineRestraints.length > 0) {
						KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngelUnlock"), "yellow", 3);
						for (let r of divineRestraints) {
							KinkyDungeonRemoveRestraint(r.restraint.Group, false, false, true, true);
						}
					} else KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngelIntro"), "yellow", 2);

				}
				if (KDGameData.KDPenanceStage > 1 && (KDistChebyshev(KinkyDungeonAngel().x - KinkyDungeonPlayerEntity.x, KinkyDungeonAngel().y - KinkyDungeonPlayerEntity.y) < 1.5 || KDGameData.KDPenanceStage > 3)) {
					if (KinkyDungeonGold >= KDGameData.KinkyDungeonPenanceCostCurrent) {
						KDGameData.KDPenanceMode = "Success";
						KDGameData.KDPenanceStage = -delta;
					} else {
						KDGameData.KDPenanceMode = "Anger";
						KDGameData.KDPenanceStage = -delta;
					}
				} if (KDGameData.KDPenanceStage > 1) {
					if (KDGameData.KDPenanceStage == 1)
						KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngelWarn"), "yellow", 2);
					//KinkyDungeonSlowMoveTurns = 1;
				}
				KDGameData.KDPenanceStage += delta;
			} else if (KDGameData.KDPenanceMode == "Success") {
				if (KDGameData.KDPenanceStage < 2)
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngel" + KDGameData.KDPenanceMode + KDGameData.KDPenanceStage), "yellow", 2);
				KDGameData.KDPenanceStage += delta;
				if (KinkyDungeonGold >= KDGameData.KinkyDungeonPenanceCostCurrent) {
					if (KDGameData.KDPenanceStage >= 2) {
						KinkyDungeonAddGold(-KDGameData.KinkyDungeonPenanceCostCurrent);
						KinkyDungeonChangeRep(KDGameData.AngelCurrentRep, KinkyDungeonPenanceRepBonus);
						KDGameData.KinkyDungeonPenance = false;
					}
				} else {
					KDGameData.KDPenanceMode = "Anger";
					KDGameData.KDPenanceStage = 0;
					KDGameData.KDPenanceStageEnd = 0;
				}
			} else if (KDGameData.KDPenanceMode == "Anger") {
				if (KDGameData.KDPenanceStage < 4)
					KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAngel" + KDGameData.KDPenanceMode + ("" + (KDGameData.KDPenanceStage))), "yellow", 2);
				else {
					KinkyDungeonAggro(KinkyDungeonAngel());
				}
				KDGameData.KDPenanceStage += delta;
			}
		}
	}
	if (!KDGameData.KinkyDungeonPenance || (!KinkyDungeonHasStamina(1.1) && KinkyDungeonAngel())) {
		if (KDGameData.KinkyDungeonAngel) {
			KDGameData.KDPenanceStageEnd += delta;
			if (!KinkyDungeonEntities.includes(KinkyDungeonAngel())) {
				KDGameData.KinkyDungeonAngel = 0;
			} else if ((KinkyDungeonAngel().Enemy.allied || !KinkyDungeonHasStamina(1.1)) && KinkyDungeonAngel() && (!KDGameData.KinkyDungeonPenance || !KinkyDungeonAngel().Enemy.allied) && (KDGameData.KDPenanceStageEnd > 10 && KDRandom() < 0.2)) {
				KinkyDungeonEntities.splice(KinkyDungeonEntities.indexOf(KinkyDungeonAngel()), 1);
				//if (!KinkyDungeonAngel().Enemy.allied && KDGameData.KDPenanceMode != "Success")
				//KinkyDungeonChangeRep(KDGameData.AngelCurrentRep, KinkyDungeonPenanceRepBonusFail);
				KDGameData.KinkyDungeonAngel = 0;
				KDGameData.KinkyDungeonPenance = false;
			}
		}
	}

}

function KinkyDungeonCreateAngel(x, y) {
	let point = KinkyDungeonGetNearbyPoint(x, y, true, undefined, true);
	if (point) {
		let Enemy = KinkyDungeonEnemies.find(element => element.name == "Angel");
		let angel = {summoned: true, Enemy: Enemy, id: KinkyDungeonGetEnemyID(),
			x:point.x, y:point.y, gx: point.x, gy: point.y,
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0};
		KDGameData.KinkyDungeonAngel = angel.id;
		KinkyDungeonEntities.push(angel);
	}
}
