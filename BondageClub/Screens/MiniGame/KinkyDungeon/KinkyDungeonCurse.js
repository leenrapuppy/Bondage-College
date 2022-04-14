"use strict";



function KinkyDungeonCurseInfo(sg, Curse) {
	if (Curse == "MistressKey" && KinkyDungeonItemCount("MistressKey")) {
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseInfoMistressKeyHave").replace("KeyAmount", "" + KinkyDungeonItemCount("MistressKey")), "White", 2);
	} else {
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseInfo" + Curse), "White", 2);
	}
}

function KinkyDungeonCurseStruggle(sg, Curse) {
	if (Curse == "MistressKey") {
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseStruggle" + Curse + KinkyDungeonGetRestraintItem(sg.group).name), "White", 2);
	} else KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseStruggle" + Curse), "White", 2);

}

function KinkyDungeonCurseAvailable(sg, Curse) {
	if (Curse == "5Keys" && KinkyDungeonRedKeys >= 5) {
		return true;
	} else if (Curse == "MistressKey" && KinkyDungeonItemCount("MistressKey") > 0) {
		return true;
	}
	return false;
}
function KinkyDungeonCurseUnlock(sg, Curse) {
	let unlock = true;
	let keep = false;
	if (Curse == "5Keys") {
		KinkyDungeonRedKeys -= 5;
	} else if (Curse == "MistressKey") {
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables.MistressKey, -1);
	}

	if (unlock) {
		KDSendStatus('escape', KinkyDungeonGetRestraintItem(sg.group).name, "Curse");
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseUnlock" + Curse), "#99FF99", 2);
		KinkyDungeonRemoveRestraint(sg.group, keep);
	}
}