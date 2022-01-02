"use strict";

let KinkyDungeonGoddessRep = {
};

function KinkyDungeonInitReputation() {
	KinkyDungeonGoddessRep = {"Ghost" : -50, "Prisoner" : -50};
	for (let shrine in KinkyDungeonShrineBaseCosts) {
		KinkyDungeonGoddessRep[shrine] = 0;
	}
}

function KinkyDungeonHandleReputation() {

}

function KinkyDungeonChangeRep(Rep, Amount) {
	if (KinkyDungeonGoddessRep[Rep] != undefined) {
		let last = KinkyDungeonGoddessRep[Rep];
		let target = -50;
		let interval = 0.02;
		if (Amount >= 0) target = 50;
		for (let i = 0; i < Math.abs(Amount); i++) {
			KinkyDungeonGoddessRep[Rep] += (target - KinkyDungeonGoddessRep[Rep]) * interval;
		}
		KinkyDungeonGoddessRep[Rep] = Math.min(50, Math.max(-50, KinkyDungeonGoddessRep[Rep]));
		if (KinkyDungeonGoddessRep[Rep] != last) return true;
		return false;
	}
	return false;
}

function KinkyDungeonDrawReputation() {
	let i = 0;
	let maxY = 560;
	let XX = 0;
	let spacing = 60;
	let yPad = 50;
	MainCanvas.textAlign = "left";
	for (let rep in KinkyDungeonGoddessRep) {
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
			DrawText(TextGet("KinkyDungeonShrine" + rep), canvasOffsetX + XX, yPad + canvasOffsetY + spacing * i, "white", "black");
			DrawProgressBar(canvasOffsetX + 275 + XX, yPad + canvasOffsetY + spacing * i - spacing/4, 200, spacing/2, 50 + value, color, "#444444");

			i++;
		}

	}
	MainCanvas.textAlign = "center";
}