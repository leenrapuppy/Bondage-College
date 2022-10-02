"use strict";

/**
 * @type {Record<string,() => void>}
 */
let KDObjectMessages = {
	"Ghost": () => KinkyDungeonGhostMessage(),
	"Angel": () => KinkyDungeonAngelMessage(),
};
/**
 * @type {Record<string,() => boolean>}
 */
let KDObjectHandle = {
	"Charger": () => KinkyDungeonHandleCharger(),
};
/**
 * @type {Record<string,() => void>}
 */
let KDObjectDraw = {
	"Ghost": () => KinkyDungeonDrawGhost(),
	"Angel": () => KinkyDungeonDrawAngel(),
	"Charger": () => KinkyDungeonDrawCharger(),
};

function KinkyDungeonDrawGhost() {
	if (KDGameData.CurrentDialog) return;
	if (KinkyDungeonTargetTile.GhostDecision == 0) DrawText(TextGet("KinkyDungeonDrawGhostHelpful"), KDModalArea_x + 200, KDModalArea_y + 50, "white", "silver");
	else DrawText(TextGet("KinkyDungeonDrawGhostUnhelpful"), KDModalArea_x + 200, KDModalArea_y + 50, "white", "silver");
}
function KinkyDungeonDrawAngel() {
	DrawText(TextGet("KinkyDungeonDrawAngelHelpful"), KDModalArea_x + 200, KDModalArea_y + 50, "white", "silver");
}

function KinkyDungeonGhostMessage() {

	if (KinkyDungeonTargetTile.Dialogue) {
		KDStartDialog(KinkyDungeonTargetTile.Dialogue, "Ghost", true, "", undefined);
		if (KinkyDungeonTargetTile.Msg && KDGameData.CurrentDialog) {
			KDGameData.CurrentDialogMsg = KinkyDungeonTargetTile.Msg;
		}
		return;
	} else if (KinkyDungeonTargetTile.Msg) {
		KDStartDialog("GhostInfo", "Ghost", true, "", undefined);
		if (KDGameData.CurrentDialog) {
			KDGameData.CurrentDialogMsg = KinkyDungeonTargetTile.Msg;
		}
		return;
	}
	let restraints = KinkyDungeonAllRestraint();
	let msg = "";
	if (restraints.length == 0) {
		msg = TextGet("KinkyDungeonGhostGreet" + KinkyDungeonTargetTile.GhostDecision);
	} else {
		if (KinkyDungeonTargetTile.GhostDecision <= 1) {
			msg = TextGet("KinkyDungeonGhostHelpful" + KinkyDungeonTargetTile.GhostDecision);
		} else {
			let BoundType = "Generic";
			if (!KinkyDungeonCanTalk() && Math.random() < 0.33) BoundType = "Gag";
			if (!KinkyDungeonPlayer.CanInteract() && Math.random() < 0.33) BoundType = "Arms";
			if (!KinkyDungeonPlayer.CanWalk() && Math.random() < 0.33) BoundType = "Feet";
			if (KinkyDungeonPlayer.IsChaste() && Math.random() < 0.33) BoundType = "Chaste";

			msg = TextGet("KinkyDungeonGhostUnhelpful" + BoundType + KinkyDungeonTargetTile.GhostDecision);
		}
	}
	if (msg) {
		KinkyDungeonSendActionMessage(3, msg, "white", 3);
	}
}

function KinkyDungeonAngelMessage() {
	let restraints = KinkyDungeonAllRestraint();
	let msg = "";
	if (restraints.length == 0) {
		msg = TextGet("KinkyDungeonAngelGreet");
	} else {
		msg = TextGet("KinkyDungeonAngelHelpful");
	}
	if (msg) {
		KinkyDungeonSendActionMessage(3, msg, "white", 3);
	}
}

function KinkyDungeonMakeGhostDecision() {
	for (let tile of KinkyDungeonTiles.values()) {
		if (tile.Type == "Ghost") {
			tile.GhostDecision = 0;

			let rep = KinkyDungeonGoddessRep.Ghost;

			if (rep > 0) tile.GhostDecision += 1;
			if (rep != undefined) {
				let mult = KinkyDungeonStatsChoice.get("Oppression") ? 1.5 : (KinkyDungeonStatsChoice.has("Dominant") ? 0.5 : 1.0);
				if (KDRandom() * 100 * mult > -rep + 75) tile.GhostDecision += 1;
				if (KDRandom() * 100 * mult > -rep + 85) tile.GhostDecision += 1;
				if (KDRandom() * 100 * mult > -rep + 95) tile.GhostDecision += 1;
			}
		}
	}
}

function KinkyDungeonDrawCharger() {
	KDModalArea = true;
	//DrawText(TextGet("KinkyDungeonCharger"), KDModalArea_x + 200, KDModalArea_y + 50, "white", "silver");
	if (KinkyDungeonTargetTile && KinkyDungeonTargetTile.Light == KDChargerLight) {
		DrawButton(KDModalArea_x + 25, KDModalArea_y + 25, 400, 60, TextGet("KinkyDungeonChargerRemoveCrystal"), "#white", "", "");
	} else {
		DrawButton(KDModalArea_x + 250, KDModalArea_y + 25, 200, 60, TextGet("KinkyDungeonChargerCharge"), KinkyDungeonInventoryGet("AncientPowerSourceSpent") ? "white" : "#888888", "", "");
		DrawButton(KDModalArea_x + 25, KDModalArea_y + 25, 200, 60, TextGet("KinkyDungeonChargerPlaceCrystal"), KinkyDungeonInventoryGet("AncientPowerSource") ? "white" : "#888888", "", "");
	}


}

let KDChargerLight = 4;

function KinkyDungeonHandleCharger() {
	if (KinkyDungeonTargetTile && KinkyDungeonTargetTile.Light == KDChargerLight) {
		if (MouseIn(KDModalArea_x + 25, KDModalArea_y + 25, 400, 60) && KinkyDungeonTargetTile) {
			KDSendInput("chargerInteract", {action: "remove", targetTile: KinkyDungeonTargetTileLocation});
			return true;
		}
	} else {
		if (MouseIn(KDModalArea_x + 250, KDModalArea_y + 25, 200, 60)) {
			if (KDSendInput("chargerInteract", {action: "charge", targetTile: KinkyDungeonTargetTileLocation})) {
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
			}
			return true;
		} else if (MouseIn(KDModalArea_x + 25, KDModalArea_y + 25, 200, 60) && KinkyDungeonTargetTile) {
			KDSendInput("chargerInteract", {action: "place", targetTile: KinkyDungeonTargetTileLocation});
			return true;
		}
	}

	return false;
}

