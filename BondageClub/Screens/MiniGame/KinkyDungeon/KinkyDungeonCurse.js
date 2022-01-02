"use strict";



function KinkyDungeonCurseInfo(sg, Curse) {
	KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseInfo" + Curse), "White", 2);
}
function KinkyDungeonCurseAvailable(sg, Curse) {
	if (Curse == "5Keys" && KinkyDungeonRedKeys >= 5) {
		return true;
	}
	return false;
}
function KinkyDungeonCurseUnlock(sg, Curse) {
	let unlock = true;
	let keep = false;
	if (Curse == "5Keys") {
		KinkyDungeonRedKeys -= 5;
	}

	if (unlock) {
		KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseUnlock" + Curse), "#99FF99", 2);
		KinkyDungeonRemoveRestraint(sg.group, keep);
	}
}