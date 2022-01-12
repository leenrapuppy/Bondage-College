"use strict";
let KinkyDungeonStruggleGroups = [];
let KinkyDungeonStruggleGroupsBase = [
	"ItemHead",
	"ItemHood",
	"ItemM",
	"ItemEars",
	"ItemArms",
	"ItemNeck",
	"ItemHands",
	"ItemNeckRestraints",
	"ItemBreast",
	"ItemNipplesPiercings",
	"ItemTorso",
	"ItemButt",
	"ItemVulva",
	"ItemVulvaPiercings",
	"ItemPelvis",
	"ItemLegs",
	"ItemFeet",
	"ItemBoots",
];
let KinkyDungeonDrawStruggle = true;
let KinkyDungeonDrawState = "Game";
let KinkyDungeonSpellValid = false;
let KinkyDungeonCamX = 0;
let KinkyDungeonCamY = 0;
let KinkyDungeonTargetX = 0;
let KinkyDungeonTargetY = 0;
let KinkyDungeonLastDraw = 0;
let KinkyDungeonDrawDelta = 0;

const KinkyDungeonLastChatTimeout = 10000;

let KinkyDungeonStatBarHeight = 100;
let KinkyDungeonToggleAutoDoor = true;

function KinkyDungeonDrawInputs() {

	DrawButton(1880, 120, 100, 40, TextGet("KinkyDungeonRestart"), "White");

	// Draw the struggle buttons if applicable
	if (KinkyDungeonDrawStruggle && KinkyDungeonStruggleGroups)
		for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
			let sg = KinkyDungeonStruggleGroups[S];
			let ButtonWidth = 60;
			let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
			let y = 42 + sg.y * (ButtonWidth + 46);

			if (sg.left) {
				MainCanvas.textAlign = "left";
			} else {
				MainCanvas.textAlign = "right";
			}

			let color = "white";
			let locktext = "";
			if (KinkyDungeonPlayer.IsBlind() < 1) {
				if (sg.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLockAbr");}
				if (sg.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLockAbr");}
			} else color = "#888888";

			let GroupText = sg.name ? ("Restraint" + sg.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.

			DrawText(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, color, "black");
			MainCanvas.textAlign = "center";

			let i = 1;
			DrawButton(x, y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", "");
			if (sg.curse) {
				DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseInfo.png", ""); i++;
				if (KinkyDungeonCurseAvailable(sg, sg.curse))
					DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseUnlock.png", ""); i++;
			} else if (!sg.blocked) {
				let toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
				DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
				if (KinkyDungeonLockpicks > 0 && sg.lock != "") {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;}
				if (KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0) {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Cut.png", ""); i++;}
			}
		}

	if (KinkyDungeonStruggleGroups.length > 0) {
		if (KinkyDungeonDrawStruggle) DrawButton(510, 925, 120, 60, "", "White", KinkyDungeonRootDirectory + "HideTrue.png", "");
		else DrawButton(510, 925, 120, 60, "", "White", KinkyDungeonRootDirectory + "HideFalse.png", "");
	}

	if (KinkyDungeonTargetTile) {
		if (KinkyDungeonTargetTile.Type == "Lock") {
			let action = false;
			if (KinkyDungeonLockpicks > 0) {
				DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
				action = true;
			}

			if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
				DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
				action = true;
			}

			if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 850, "white", "silver");

			if (KinkyDungeonTargetTile.Lock.includes("Red"))
				DrawText(TextGet("KinkyRedLock"), 675, 850, "white", "silver");
			else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
				DrawText(TextGet("KinkyBlueLock"), 675, 850, "white", "silver");
		} else if (KinkyDungeonTargetTile.Type == "Shrine") {
			KinkyDungeonDrawShrine();
		} else if (KinkyDungeonTargetTile.Type == "Ghost") {
			KinkyDungeonDrawGhost();
		} else if (KinkyDungeonTargetTile.Type == "Door") {
			if (KinkyDungeonTargetTile.Lock) {
				let action = false;
				if (KinkyDungeonLockpicks > 0) {
					DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
					action = true;
				}

				if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
					DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
					action = true;
				}

				if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 850, "white", "silver");

				if (KinkyDungeonTargetTile.Lock.includes("Red"))
					DrawText(TextGet("KinkyRedLock"), 675, 850, "white", "silver");
				else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
					DrawText(TextGet("KinkyBlueLock"), 675, 850, "white", "silver");
			} else
				DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonCloseDoor"), "White");
		}
	} else {
		DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonAutoDoor" + (KinkyDungeonToggleAutoDoor ? "On" : "Off")), "#AAAAAA");
	}

	DrawButton(650, 925, 165, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
	DrawButton(840, 925, 165, 60, TextGet("KinkyDungeonReputation"), "White", "", "");
	DrawButton(1030, 925, 165, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[0]].passive) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[0]];
		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1275, 835, "white", "silver");
		DrawText(spell.manacost+ TextGet("KinkyDungeonManaCost"), 1275, 870, "#55AAFF", "silver");
		DrawButton(1230, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell1.png", "");
	}
	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[1]].passive) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[1]];
		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1525, 835, "white", "silver");
		DrawText(spell.manacost+ TextGet("KinkyDungeonManaCost"), 1525, 870, "#55AAFF", "silver");
		DrawButton(1480, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell2.png", "");
	}
	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[2]].passive) {
		let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[2]];
		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1775, 835, "white", "silver");
		DrawText(spell.manacost+ TextGet("KinkyDungeonManaCost"), 1775, 870, "#55AAFF", "silver");
		DrawButton(1730, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell3.png", "");
	}

	KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelayPing);

}

function KinkyDungeonDrawProgress(x, y, amount, maxWidth, sprite) {
	let iconCount = 6;
	let scale = maxWidth / (72 * iconCount);
	let interval = 1/iconCount;
	let numIcons = amount / interval;
	for (let icon = 0; icon < numIcons && numIcons > 0; icon += 1) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Icons/" + sprite + ((icon + 0.5 <= numIcons) ? "Full.png" : "Half.png"), MainCanvas, 0, 0, 72, 72, x + 72 * scale * icon, y, 72*scale, 72*scale, false);
	}
}

function KinkyDungeonDrawStats(x, y, width, heightPerBar) {
	// Draw labels
	let buttonWidth = 48;
	let suff = (!KinkyDungeonPlayer.CanTalk()) ? "Unavailable" : "";
	if (KinkyDungeonStatArousal > 0) {
		DrawText(TextGet("StatArousal").replace("MAX", KinkyDungeonStatArousalMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatArousal) + ""), x+width/2 + buttonWidth, y + 25, (KinkyDungeonStatArousal < 100) ? "white" : "pink", "silver");
		if (KinkyDungeonItemCount("PotionFrigid")) {
			DrawButton(x, y, buttonWidth, buttonWidth, "", "Pink", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
		}
	}
	DrawText(TextGet("StatStamina").replace("MAX", KinkyDungeonStatStaminaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatStamina) + ""), x+width/2 + buttonWidth, y + 25 + heightPerBar, (KinkyDungeonStatStamina > 0.5) ? "white" : "pink", "silver");
	if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax && KinkyDungeonItemCount("PotionStamina"))
		DrawButton(x, y+heightPerBar, buttonWidth, buttonWidth, "", "#AAFFAA", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	DrawText(TextGet("StatMana").replace("MAX", KinkyDungeonStatManaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatMana) + ""), x+width/2 + buttonWidth, y + 25 + heightPerBar * 2, (KinkyDungeonStatMana > 0.5) ? "white" : "pink", "silver");
	if (KinkyDungeonStatMana < KinkyDungeonStatManaMax && KinkyDungeonItemCount("PotionMana"))
		DrawButton(x, y+2*heightPerBar, buttonWidth, buttonWidth, "", "#AAAAFF", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");

	let maxVisual = KinkyDungeonStatMaxMax;
	// Draw arousal
	if (KinkyDungeonStatArousal > 0)
		KinkyDungeonDrawProgress(x, y + heightPerBar*0.5, KinkyDungeonStatArousal/maxVisual, width, "Heart");

	// Draw Stamina/Mana
	KinkyDungeonDrawProgress(x, y + heightPerBar*1.5, KinkyDungeonStatStamina/maxVisual, width, "Stamina");
	KinkyDungeonDrawProgress(x, y + heightPerBar*2.5, KinkyDungeonStatMana/maxVisual, width, "Mana");

	DrawButton(x, y+3*heightPerBar, 250, 50, TextGet("KinkyDungeonSleep"), "White");

	let i = 3.5;
	DrawText(TextGet("CurrentGold") + KinkyDungeonGold, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;
	DrawText(TextGet("CurrentLockpicks") + KinkyDungeonLockpicks, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;
	DrawText(TextGet("CurrentKnife") + KinkyDungeonNormalBlades, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;

	if (KinkyDungeonEnchantedBlades > 0) {DrawText(TextGet("CurrentKnifeMagic") + KinkyDungeonEnchantedBlades, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonRedKeys > 0) {DrawText(TextGet("CurrentKeyRed") + KinkyDungeonRedKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
	if (KinkyDungeonBlueKeys > 0) {DrawText(TextGet("CurrentKeyBlue") + KinkyDungeonBlueKeys, x+width/2, y + 25 + i * heightPerBar, "white", "silver"); i+= 0.5;}
}

function KinkyDungeonHandleHUD() {
	let buttonWidth = 48;
	if (KinkyDungeonDrawState == "Game") {

		if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();

		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Inventory"; return true;}
		else
		if (MouseIn(840, 925, 165, 60)) { KinkyDungeonDrawState = "Reputation"; return true;}
		else
		if (MouseIn(1030, 925, 165, 60)) { KinkyDungeonDrawState = "Magic"; return true;}
		else if (MouseIn(510, 925, 120, 60)) { KinkyDungeonDrawStruggle = !KinkyDungeonDrawStruggle; return true;}

		if (MouseIn(1880, 120, 100, 40)) {
			KinkyDungeonDrawState = "Restart";
			return true;
		}

		if (!KinkyDungeonTargetingSpell) {
			if (KinkyDungeonHandleSpell()) return true;
			KinkyDungeonSpellPress = 0;
		} else {
			KinkyDungeonSpellPress = 0;
		}

		if (KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type &&
				((KinkyDungeonTargetTile.Type == "Lock") || (KinkyDungeonTargetTile.Type == "Door" && KinkyDungeonTargetTile.Lock))) {
				if (KinkyDungeonLockpicks > 0 && MouseIn(963, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonPickAttempt()) {
						if (KinkyDungeonTargetTile.Type == "Door") KinkyDungeonTargetTile.Lock = undefined;
						else delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
						KinkyDungeonTargetTile = null;
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}

				if (((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Yellow") && (KinkyDungeonRedKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) )) && MouseIn(825, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
						if (KinkyDungeonTargetTile.Type == "Door") KinkyDungeonTargetTile.Lock = undefined;
						else delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
						KinkyDungeonTargetTile = null;
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				KinkyDungeonHandleShrine();

			} else if (KinkyDungeonTargetTile.Type == "Door") {
				if (MouseIn(675, 825, 350, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					KinkyDungeonTargetTile = null;
					let x = KinkyDungeonTargetTileLocation.split(',')[0];
					let y = KinkyDungeonTargetTileLocation.split(',')[1];
					KinkyDungeonMapSet(parseInt(x), parseInt(y), "D");
					KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 1);
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			}
		} else {
			if (MouseIn(675, 825, 350, 60)) {
				KinkyDungeonToggleAutoDoor = !KinkyDungeonToggleAutoDoor;
				if (!KinkyDungeonToggleAutoDoor) KinkyDungeonDoorCloseTimer = 0;
				return true;
			}
		}

		if (KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				let sg = KinkyDungeonStruggleGroups[S];
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				let i = 0;
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
					if (sg.curse) KinkyDungeonSendActionMessage(4, TextGet("KinkyDungeonCurseStruggle" + sg.curse), "White", 2);
					else KinkyDungeonStruggle(sg, "Struggle"); return true;
				} i++;
				if (sg.curse) {
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonCurseInfo(sg, sg.curse); return true;} i++;
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && KinkyDungeonCurseAvailable(sg, sg.curse)) {KinkyDungeonCurseUnlock(sg, sg.curse); return true;} i++;
				} else if (!sg.blocked) {
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && sg.lock != "Jammed") {KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove"); return true;} i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "")
					{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Pick"); return true;} i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0)
					{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Cut"); return true;} i++;}
				}
			}

		let xxx = canvasOffsetX + KinkyDungeonCanvas.width+10;
		let yyy = canvasOffsetY;
		if (MouseIn(xxx, yyy + 0 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionFrigid") && KinkyDungeonStatArousal > 0) {
			if (KinkyDungeonPlayer.CanTalk())
				KinkyDungeonAttemptConsumable("PotionFrigid", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
		} else if (MouseIn(xxx, yyy + 1 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionStamina") && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
			if (KinkyDungeonPlayer.CanTalk())
				KinkyDungeonAttemptConsumable("PotionStamina", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
		} else if (MouseIn(xxx, yyy + 2 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionMana") && KinkyDungeonStatMana < KinkyDungeonStatManaMax) {
			if (KinkyDungeonPlayer.CanTalk())
				KinkyDungeonAttemptConsumable("PotionMana", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
		} else if (MouseIn(xxx, yyy + 3 * KinkyDungeonStatBarHeight, 250, 50)) {
			KinkyDungeonSleepTurns = 20;
			KinkyDungeonAlert = 4; // Alerts nearby enemies; intent is that the enemies are searching while you sleep;
		}
	} else if (KinkyDungeonDrawState == "Orb") {
		return KinkyDungeonHandleOrb();
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(1030, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		if (MouseIn(1030, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagicSpells();
	} else if (KinkyDungeonDrawState == "Inventory") {
		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleInventory();
	} else if (KinkyDungeonDrawState == "Reputation") {
		if (MouseIn(840, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleReputation();
	} else if (KinkyDungeonDrawState == "Lore") {
		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleLore();
	} else if (KinkyDungeonDrawState == "Restart") {
		if (MouseIn(975, 850, 550, 64)) {
			KinkyDungeonDefeat();
			KinkyDungeonDrawState = "Game";
			return true;
		}
		if (MouseIn(1075, 650, 350, 64)) {
			KinkyDungeonState = "Keybindings";
			if (!KinkyDungeonKeybindings)
				KinkyDungeonKeybindingsTemp = {
					Down: 115,
					DownLeft: 122,
					DownRight: 99,
					Left: 97,
					Right: 100,
					Spell1: 49,
					Spell2: 50,
					Spell3: 51,
					Up: 119,
					UpLeft: 113,
					UpRight: 101,
					Wait: 120,
				};
			else {
				KinkyDungeonKeybindingsTemp = {};
				Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			}
			return true;
		}
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonState = "Lose";
			//Player.KinkyDungeonSave = {};
			//ServerAccountUpdate.QueueData({KinkyDungeonSave : Player.KinkyDungeonSave});
			localStorage.setItem('KinkyDungeonSave', "");
			MiniGameKinkyDungeonLevel = -1;
			return true;
		} else if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonDrawState = "Game";
			return true;
		}
	}

	return false;
}


function KinkyDungeonUpdateStruggleGroups() {
	let struggleGroups = KinkyDungeonStruggleGroupsBase;
	KinkyDungeonStruggleGroups = [];

	for (let S = 0; S < struggleGroups.length; S++) {
		let sg = struggleGroups[S];
		let Group = sg;
		if (sg == "ItemM") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) Group = "ItemMouth3";
			else if (InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) Group = "ItemMouth2";
			else Group = "ItemMouth";
		}

		let restraint = KinkyDungeonGetRestraintItem(Group);

		if (restraint) {
			KinkyDungeonStruggleGroups.push(
				{
					group:Group,
					left: S % 2 == 0,
					y: Math.floor(S/2),
					icon:sg,
					name:(restraint.restraint) ? restraint.restraint.name : "",
					lock:restraint.lock,
					curse:restraint.restraint? restraint.restraint.curse : undefined,
					blocked: InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, Group)});
		}
	}
}
