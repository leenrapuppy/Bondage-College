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
	"ItemNipples",
	"ItemTorso",
	"ItemButt",
	"ItemVulva",
	"ItemVulvaPiercings",
	"ItemPelvis",
	"ItemLegs",
	"ItemFeet",
	"ItemBoots",
];
let KinkyDungeonDrawStruggle = 1;
let KinkyDungeonDrawStruggleHover = false;
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
let KinkyDungeonToggleAutoDoor = false;

let KinkyDungeonFastMove = true;
let KinkyDungeonFastMovePath = [];
let KinkyDungeonFastStruggle = false;
let KinkyDungeonFastStruggleType = "";
let KinkyDungeonFastStruggleGroup = "";

function KinkyDungeonDrawInputs() {

	if (ServerURL == "foobar") DrawButton(1880, 82, 100, 50, TextGet("KinkyDungeonRestart"), "white");
	else DrawButton(1750, 20, 100, 50, TextGet("KinkyDungeonRestart"), "White");
	DrawButton(1885, 900, 90, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonFastMove ? "FastMove" : "FastMoveOff") + ".png");
	DrawButton(1785, 900, 90, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonFastStruggle ? "AutoStruggle" : "AutoStruggleOff") + ".png");
	if (KinkyDungeonPlayerWeapon) {
		DrawTextFit(TextGet("StatWeapon") + TextGet("KinkyDungeonInventoryItem" + KinkyDungeonPlayerWeapon), 1875, 830, 190, "white", "black");
	} else if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.name == "Knife") {
		DrawTextFit(TextGet("KinkyDungeonNoWeaponKnife"), 1875, 830, 190, "white", "black");
	} else DrawTextFit(TextGet("KinkyDungeonNoWeapon"), 1875, 830, 190, "white", "black");
	if (KinkyDungeonPlayerDamage) {
		DrawTextFit(TextGet("KinkyDungeonAccuracy") + Math.round(KinkyDungeonGetEvasion() * 100) + "%", 1875, 875, 190,
			(KinkyDungeonGetEvasion() < KinkyDungeonPlayerDamage.chance * 0.99) ? "pink" :
			(KinkyDungeonGetEvasion() > KinkyDungeonPlayerDamage.chance * 1.01) ? "lightgreen" : "white", "black");
	}

	if (KDModalArea) {
		//DrawRect(KDModalArea_x, KDModalArea_y, KDModalArea_width, KDModalArea_height, "rgba(40, 40, 40, 0.3)");
	}

	// Draw the struggle buttons if applicable
	KinkyDungeonDrawStruggleHover = false;
	if (!KinkyDungeonShowInventory && ((KinkyDungeonDrawStruggle > 0 || MouseIn(0, 0, 500, 1000)) && KinkyDungeonStruggleGroups))
		for (let sg of KinkyDungeonStruggleGroups) {
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
				if (sg.lock == "Gold") {color = "#FFFF88"; locktext = TextGet("KinkyGoldLockAbr");}
			} else {
				color = "#cccccc";
				if (sg.lock) {
					locktext = TextGet("KinkyBlindLockAbr");
				}
			}

			let GroupText = sg.name ? ("Restraint" + sg.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.

			DrawTextFit(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0) + 2, y-24+2, 230, "black", "black");
			DrawTextFit(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, 230, color, "black");
			MainCanvas.textAlign = "center";

			let i = 1;
			if (MouseIn(((!sg.left) ? (260) : 0), y-24, 230, (ButtonWidth + 46)) || KinkyDungeonDrawStruggle > 1) {
				if (!KinkyDungeonDrawStruggleHover) {
					KinkyDungeonDrawStruggleHover = true;
				}
				DrawButton(x, y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", "");
				if (sg.curse) {
					DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseInfo.png", ""); i++;
					if (KinkyDungeonCurseAvailable(sg, sg.curse))
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseUnlock.png", ""); i++;
				} else if (!sg.blocked) {
					let toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
					if ((KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0) && !sg.noCut) {
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "",
							((sg.magic) || (KinkyDungeonEnchantedBlades > 0 && KinkyDungeonNormalBlades < 1)) ? "#8394ff" : "White", KinkyDungeonRootDirectory + "Cut.png", "");
						i++;
					}
					DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "") {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;}

				}

				let MY = Math.min(500, MouseY);
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : 0), y, ButtonWidth*i, ButtonWidth)) {
					let item = KinkyDungeonGetRestraintItem(sg.group);
					let lastO = 0;
					if (item && item.dynamicLink) {
						let O = 1;
						MainCanvas.textAlign = "left";
						let drawn = false;
						for (let d of item.dynamicLink) {
							if (KDRestraint(item) && (!KDRestraint(item).UnLink || d != KDRestraint(item).UnLink))
							{
								drawn = true;
								let msg = TextGet("Restraint" + d);
								DrawText(msg, 1 + 530, 1 + MY + O * 50, "black", "black");
								DrawText(msg, 530, MY + O * 50, "white", "black");
								O++;
							}
						}
						lastO = O;
						O = 0;
						if (drawn) {
							DrawText(TextGet("KinkyDungeonItemsUnderneath"), 1 + 530, 1 + MY + O * 50, "black", "black");
							DrawText(TextGet("KinkyDungeonItemsUnderneath"), 530, MY + O * 50, "white", "black");
						}
						O = lastO + 1;
						MainCanvas.textAlign = "center";
					}
					if (lastO) lastO += 1;
					if (item && KDRestraint(item) && KinkyDungeonStrictness(false, KDRestraint(item).Group)) {
						let strictItems = KinkyDungeonGetStrictnessItems(KDRestraint(item).Group);
						let O = lastO + 1;
						MainCanvas.textAlign = "left";
						let drawn = false;
						for (let s of strictItems) {
							drawn = true;
							let msg = TextGet("Restraint" + s);
							DrawText(msg, 1 + 530, 1 + MY + O * 50, "black", "black");
							DrawText(msg, 530, MY + O * 50, "white", "black");
							O++;
						}
						O = lastO;
						if (drawn) {
							DrawText(TextGet("KinkyDungeonItemsStrictness"), 1 + 530, 1 + MY + O * 50, "black", "black");
							DrawText(TextGet("KinkyDungeonItemsStrictness"), 530, MY + O * 50, "white", "black");
						}
						MainCanvas.textAlign = "center";
					}
				}
			}
		}


	if (KinkyDungeonDrawStruggle > 0) DrawButton(510, 925, 120, 60, "", KinkyDungeonStruggleGroups.length > 0 ? "White" : "grey", KinkyDungeonRootDirectory + "Hide" + (KinkyDungeonDrawStruggle > 1 ? "Full" : "True") + ".png", "");
	else DrawButton(510, 925, 120, 60, "", KinkyDungeonStruggleGroups.length > 0 ? "White" : "grey", KinkyDungeonRootDirectory + "HideFalse.png", "");

	DrawButton(510, 825, 60, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonShowInventory ? "BackpackOpen.png" : "Backpack.png"), "");

	if (KinkyDungeonTargetTile) {
		if (KinkyDungeonTargetTile.Type == "Lock" && KinkyDungeonTargetTile.Lock) {
			let action = false;
			if (KinkyDungeonLockpicks > 0) {
				DrawButton(KDModalArea_x + 313, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
				action = true;
				KDModalArea = true;
			}

			if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0)
				|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
				DrawButton(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
				action = true;
				KDModalArea = true;
			}

			if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), KDModalArea_x + 300, KDModalArea_y + 50, "white", "black");

			if (KinkyDungeonTargetTile.Lock.includes("Red"))
				DrawText(TextGet("KinkyRedLock"), KDModalArea_x + 50, KDModalArea_y + 50, "white", "black");
			else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
				DrawText(TextGet("KinkyBlueLock"), KDModalArea_x + 50, KDModalArea_y + 50, "white", "black");
		} else if (KinkyDungeonTargetTile.Type == "Shrine") {
			KinkyDungeonDrawShrine();
		} else if (KinkyDungeonTargetTile.Type == "Ghost") {
			KinkyDungeonDrawGhost();
		} else if (KinkyDungeonTargetTile.Type == "Door") {
			if (KinkyDungeonTargetTile.Lock) {
				let action = false;
				if (KinkyDungeonLockpicks > 0) {
					DrawButton(KDModalArea_x + 313, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
					action = true;
					KDModalArea = true;
				}

				if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
					DrawButton(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
					action = true;
					KDModalArea = true;
				}

				if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), KDModalArea_x + 300, KDModalArea_y + 50, "white", "black");

				if (KinkyDungeonTargetTile.Lock.includes("Red"))
					DrawText(TextGet("KinkyRedLock"), KDModalArea_x + 25, KDModalArea_y + 50, "white", "black");
				else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
					DrawText(TextGet("KinkyBlueLock"), KDModalArea_x + 25, KDModalArea_y + 50, "white", "black");
			} else {
				KDModalArea = true;
				DrawButton(KDModalArea_x + 25, KDModalArea_y + 25, 250, 60, TextGet("KinkyDungeonCloseDoor"), "White");
			}
		}
	} else {
		DrawButton(1120, 935, 165, 50, TextGet("KinkyDungeonAutoDoor" + (KinkyDungeonToggleAutoDoor ? "On" : "Off")), KinkyDungeonToggleAutoDoor ? "white" : "#AAAAAA");
	}

	DrawButton(650, 925, 165, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
	DrawButton(840, 925, 165, 60, TextGet("KinkyDungeonReputation"), "White", "", "");
	DrawButton(1540, 925, 200, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

	for (let i = 0; i < KinkyDungeonSpellChoiceCount; i++) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].passive) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[i]];
			let components = KinkyDungeonGetCompList(spell);
			let comp = "";
			if (spell.components && spell.components.length > 0) comp = " + " + components;

			MainCanvas.textAlign = "right";
			DrawTextFit(TextGet("KinkyDungeonSpell"+ spell.name), 1735, 160 + i*KinkyDungeonSpellChoiceOffset, 235, "white", "black");
			DrawTextFit(KinkyDungeonGetManaCost(spell) + TextGet("KinkyDungeonManaCost") + comp, 1640, 200 + i*KinkyDungeonSpellChoiceOffset, 100, "#ccddFF", "black");
			MainCanvas.textAlign = "center";

			DrawButton(1650, 180 + i*KinkyDungeonSpellChoiceOffset, 90, 60, "", KinkyDungeonSpellChoicesToggle[i] ? "White" : "#aaaaaa", KinkyDungeonRootDirectory + "Spell" + (i+1) + ".png", "");
		}
	}
	KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelayPing);

}

function KinkyDungeonDrawProgress(x, y, amount, totalIcons, maxWidth, sprite) {
	let iconCount = 6;
	let scale = maxWidth / (72 * iconCount);
	let interval = 1/iconCount;
	let numIcons = amount / interval;
	let xOffset = (6 - totalIcons) * maxWidth / 6 / 2;
	for (let icon = 0; icon < totalIcons; icon += 1) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Icons/" + sprite +"Empty.png", MainCanvas, 0, 0, 72, 72, xOffset + x + 72 * scale * icon, y, 72*scale, 72*scale, false);
	}
	for (let icon = 0; icon < numIcons && numIcons > 0; icon += 1) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Icons/" + sprite + ((icon + 0.5 <= numIcons) ? "Full.png" : "Half.png"), MainCanvas, 0, 0, 72, 72, xOffset + x + 72 * scale * icon, y, 72*scale, 72*scale, false);
	}
}

function KinkyDungeonDrawStats(x, y, width, heightPerBar) {
	// Draw labels
	let buttonWidth = 48;
	let suff = (!KinkyDungeonCanDrink()) ? "Unavailable" : "";
	if (suff == "Unavailable") {
		let energyCost = KinkyDungeonPotionCollar();
		if (energyCost && KDGameData.AncientEnergyLevel > energyCost)
			suff = "Inject";
	}
	//if (KinkyDungeonStatDistraction > 0) {
	//DrawTextFit(TextGet("StatDistraction").replace("MAX", KinkyDungeonStatDistractionMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatDistraction) + ""), x+width/2 + buttonWidth, y + 25, width - 2*buttonWidth, (KinkyDungeonStatDistraction < 100) ? "white" : "pink", "black");
	// TextGet("StatMiscastChance").replace("Percent", Math.round(100 * Math.max(0, KinkyDungeonMiscastChance)) + "%")

	DrawTextFit(TextGet("StatDistraction").replace("MAX", KinkyDungeonStatDistractionMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatDistraction) + ""), x+width/2 + buttonWidth, y + 25, width - 2*buttonWidth, (KinkyDungeonStatDistraction > 0) ? "white" : "pink", "black");
	DrawButton(x, y, buttonWidth, buttonWidth, "", (KinkyDungeonStatDistraction > 0 && KinkyDungeonItemCount("PotionFrigid")) ? "Pink" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionFrigid"), x + buttonWidth, y+buttonWidth/2, buttonWidth/2, "white", "black");
	MainCanvas.textAlign = "center";
	//}
	DrawTextFit(TextGet("StatStamina").replace("MAX", KinkyDungeonStatStaminaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatStamina) + ""), x+width/2 + buttonWidth, y + 25 + heightPerBar, width - 2*buttonWidth, (KinkyDungeonStatStamina > 0.5) ? "white" : "pink", "black");
	DrawButton(x, y+heightPerBar, buttonWidth, buttonWidth, "", (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax && KinkyDungeonItemCount("PotionStamina")) ? "#AAFFAA" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionStamina"), x + buttonWidth, y+1*heightPerBar+buttonWidth/2, buttonWidth/2, "white", "black");
	MainCanvas.textAlign = "center";DrawTextFit(TextGet("StatMana").replace("MAX", KinkyDungeonStatManaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatMana) + ""), x+width/2 + buttonWidth, y + 25 + heightPerBar * 2, width - 2*buttonWidth, (KinkyDungeonStatMana > 0.5) ? "white" : "pink", "black");
	DrawButton(x, y+2*heightPerBar, buttonWidth, buttonWidth, "", (KinkyDungeonStatMana < KinkyDungeonStatManaMax && KinkyDungeonItemCount("PotionMana")) ? "#AAAAFF" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionMana"), x + buttonWidth, y+2*heightPerBar+buttonWidth/2, buttonWidth/2, "white", "black");
	MainCanvas.textAlign = "center";
	let maxVisual = KinkyDungeonStatMaxMax;
	// Draw distraction
	//if (KinkyDungeonStatDistraction > 0)
	KinkyDungeonDrawProgress(x, y + heightPerBar*0.5, KinkyDungeonStatDistraction/maxVisual, Math.floor(KinkyDungeonStatDistractionMax/12), width, "Heart");

	// Draw Stamina/Mana
	KinkyDungeonDrawProgress(x, y + heightPerBar*1.5, KinkyDungeonStatStamina/maxVisual, Math.floor(KinkyDungeonStatStaminaMax/12), width, "Stamina");
	KinkyDungeonDrawProgress(x, y + heightPerBar*2.5, KinkyDungeonStatMana/maxVisual, Math.floor(KinkyDungeonStatManaMax/12), width, "Mana");

	let sleepColor = "#444444";

	if (KinkyDungeonCanTryOrgasm()) {
		sleepColor = "#FF5BE9";
	} else if (KinkyDungeonCanPlayWithSelf()) {
		if (KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * KinkyDungeonDistractionSleepDeprivationThreshold) sleepColor = "#FFD8F9";
		else if (KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * 0.5) sleepColor = "#FFB5F5";
		else if (KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * 0.75) sleepColor = "#FF87EF";
		else sleepColor = "#FF5BE9";
	} else {
		if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.25) sleepColor = "#ffffff";
		else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.5) sleepColor = "#bbbbbb";
		else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.75) sleepColor = "#999999";
		else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) sleepColor = "#777777";
	}
	DrawButton(x, y+3*heightPerBar, 240, 50, KinkyDungeonCanTryOrgasm() ? TextGet("KinkyDungeonTryOrgasm") : (KinkyDungeonCanPlayWithSelf() ? TextGet("KinkyDungeonPlayWithSelf") : TextGet("KinkyDungeonSleep")), sleepColor);

	let i = 3.5;
	MainCanvas.textAlign = "left";
	DrawImageEx(KinkyDungeonRootDirectory + "Items/Gold.png", x + width/4 - 40, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText(TextGet("CurrentGold") + KinkyDungeonGold, x + width/4 + 40, y + 40 + i * heightPerBar, "white", "black"); i+= 0.75;

	MainCanvas.textAlign = "right";

	DrawRect(x, y + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 80, y + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 160, y + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x, y + 80 + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 160, y + 80 + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 80, y + 80 + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");

	DrawImageEx(KinkyDungeonRootDirectory + "Items/Pick.png", x, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText("" + KinkyDungeonLockpicks, x+80, y + 25 + i * heightPerBar, "white", "black");
	if (MouseIn(x, y + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemLockpick"), MouseX - 10, MouseY, "white", "black");

	DrawImageEx(KinkyDungeonRootDirectory + "Items/RedKey.png", x+80, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText("" + KinkyDungeonRedKeys, x+80+80, y + 25 + i * heightPerBar, "white", "black");
	if (MouseIn(x+80, y + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemRedKey"), MouseX - 10, MouseY, "white", "black");

	DrawImageEx(KinkyDungeonRootDirectory + "Items/Knife.png", x+160, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText("" + KinkyDungeonNormalBlades, x+80+160, y + 25 + i * heightPerBar, "white", "black");
	if (MouseIn(x+160, y + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemKnife"), MouseX - 10, MouseY, "white", "black");

	if (KinkyDungeonItemCount("MistressKey") > 0) {
		DrawImageEx(KinkyDungeonRootDirectory + "Items/MistressKey.png", x, y + 80 + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
		DrawText("" + KinkyDungeonItemCount("MistressKey"), x+80, y + 80 + 25 + i * heightPerBar, "white", "black");
		if (MouseIn(x, y + 80 + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemMistressKey"), MouseX - 10, MouseY, "white", "black");
	}

	if (KinkyDungeonBlueKeys > 0) {
		DrawImageEx(KinkyDungeonRootDirectory + "Items/BlueKey.png", x+80, y + 80 + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
		DrawText("" + KinkyDungeonBlueKeys, x+80+80, y + 80 + 25 + i * heightPerBar, "white", "black");
		if (MouseIn(x+80, y + 80 + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemMagicKey"), MouseX - 10, MouseY, "white", "black");
	}

	if (KinkyDungeonEnchantedBlades) {
		DrawImageEx(KinkyDungeonRootDirectory + "Items/EnchKnife.png", x+160, y + 80 + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
		DrawText("" + KinkyDungeonEnchantedBlades, x+80+160, y + 80 + 25 + i * heightPerBar, "white", "black");
		if (MouseIn(x+160, y + 80 + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemMagicKnife"), MouseX - 10, MouseY, "white", "black");
	}


	MainCanvas.textAlign = "center";

	DrawTextFit(TextGet("StatMiscastChance").replace("Percent", Math.round(100 * Math.max(0, KinkyDungeonMiscastChance)) + "%"), x+width/2 + 15, y + 160 + 25 + i * heightPerBar, width - 15, (KinkyDungeonStatDistraction > 0) ? "white" : "pink", "black");


	/*
	DrawText(TextGet("CurrentLockpicks") + KinkyDungeonLockpicks, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;
	DrawText(TextGet("CurrentKnife") + KinkyDungeonNormalBlades, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;

	if (KinkyDungeonEnchantedBlades > 0) {DrawText(TextGet("CurrentKnifeMagic") + KinkyDungeonEnchantedBlades, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;}
	if (KinkyDungeonRedKeys > 0) {DrawText(TextGet("CurrentKeyRed") + KinkyDungeonRedKeys, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;}
	if (KinkyDungeonBlueKeys > 0) {DrawText(TextGet("CurrentKeyBlue") + KinkyDungeonBlueKeys, x+width/2, y + 25 + i * heightPerBar, "white", "black"); i+= 0.5;}*/
}

let KDModalArea_x = 600;
let KDModalArea_y = 700;
let KDModalArea_width = 800;
let KDModalArea_height = 100;
let KDModalArea = true;

function KinkyDungeonHandleHUD() {
	let buttonWidth = 48;
	if (KinkyDungeonDrawState == "Game") {
		if (KinkyDungeonShowInventory) {
			KinkyDungeonhandleQuickInv();
			return true;
		}
		if (MouseIn(1750, 82, 100, 50)) {
			KinkyDungeonMessageToggle = !KinkyDungeonMessageToggle;
			return true;
		} else if (MouseIn(1885, 900, 90, 90)) {
			if (!KinkyDungeonFastMoveSuppress)
				KinkyDungeonFastMove = !KinkyDungeonFastMove;
			KinkyDungeonFastMoveSuppress = false;
			KinkyDungeonFastMovePath = [];
			return true;
		}
		if (MouseIn(1785, 900, 90, 90)) {
			if (!KinkyDungeonFastStruggleSuppress)
				KinkyDungeonFastStruggle = !KinkyDungeonFastStruggle;
			KinkyDungeonFastStruggleSuppress = false;
			KinkyDungeonFastStruggleGroup = "";
			KinkyDungeonFastStruggleType = "";
			return true;
		}


		if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();

		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Inventory"; return true;}
		else
		if (MouseIn(840, 925, 165, 60)) { KinkyDungeonDrawState = "Reputation"; return true;}
		else
		if (MouseIn(1540, 925, 200, 60)) {
			//KinkyDungeonDrawState = "Magic";
			KinkyDungeonDrawState = "MagicSpells";
			return true;}
		else if (MouseIn(510, 925, 120, 60)) {
			KinkyDungeonDrawStruggle += 1;
			if (KinkyDungeonDrawStruggle > 2) KinkyDungeonDrawStruggle = 0;
			return true;
		} else if (MouseIn(510, 825, 60, 90)) {
			KinkyDungeonShowInventory = !KinkyDungeonShowInventory;
			return true;
		}

		if ((ServerURL == "foobar" && MouseIn(1880, 82, 100, 50)) || (ServerURL != "foobar" && MouseIn(1750, 20, 100, 50))) {
			KinkyDungeonDrawState = "Restart";
			return true;
		}

		if (!KinkyDungeonTargetingSpell) {
			KinkyDungeonSpellPress = 0;
			if (KinkyDungeonHandleSpell()) return true;
		} else {
			KinkyDungeonSpellPress = 0;
		}

		if (KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type &&
				((KinkyDungeonTargetTile.Type == "Lock" && KinkyDungeonTargetTile.Lock) || (KinkyDungeonTargetTile.Type == "Door" && KinkyDungeonTargetTile.Lock))) {
				if (KinkyDungeonLockpicks > 0 && MouseIn(KDModalArea_x + 313, KDModalArea_y + 25, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonPickAttempt()) {
						KinkyDungeonTargetTile.Lock = undefined;
						if (KinkyDungeonTargetTile.Type == "Lock") delete KinkyDungeonTargetTile.Type;
						KinkyDungeonTargetTile = null;
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}

				if (((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) && MouseIn(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
						KinkyDungeonTargetTile.Lock = undefined;
						if (KinkyDungeonTargetTile.Type == "Lock") delete KinkyDungeonTargetTile.Type;
						KinkyDungeonTargetTile = null;
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				if (KinkyDungeonHandleShrine()) {
					// if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
				}
			} else if (KinkyDungeonTargetTile.Type == "Door") {
				if (MouseIn(KDModalArea_x + 25, KDModalArea_y + 25, 350, 60)) {
					KinkyDungeonTargetTile = null;
					let x = KinkyDungeonTargetTileLocation.split(',')[0];
					let y = KinkyDungeonTargetTileLocation.split(',')[1];
					KinkyDungeonMapSet(parseInt(x), parseInt(y), "D");
					if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorClose.ogg");
					KinkyDungeonToggleAutoDoor = false;
					KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 2);
					KinkyDungeonAdvanceTime(1, true);
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			}
		} else {
			if (MouseIn(1120, 935, 165, 50)) {
				KinkyDungeonToggleAutoDoor = !KinkyDungeonToggleAutoDoor;
				return true;
			}
		}

		if (KinkyDungeonStruggleGroups && KinkyDungeonDrawStruggleHover)
			for (let sg of KinkyDungeonStruggleGroups) {
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				let i = 0;
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
					if (sg.curse) KinkyDungeonCurseStruggle(sg, sg.curse);
					else {
						if (KinkyDungeonFastStruggle) {
							KinkyDungeonFastStruggleGroup = sg;
							KinkyDungeonFastStruggleType = "Struggle";
						} else
							KinkyDungeonStruggle(sg, "Struggle");
					} return true;
				} i++;
				if (sg.curse) {
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonCurseInfo(sg, sg.curse); return true;} i++;
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && KinkyDungeonCurseAvailable(sg, sg.curse)) {KinkyDungeonCurseUnlock(sg, sg.curse); return true;} i++;
				} else if (!sg.blocked) {
					if ((KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0) && !sg.noCut)
					{
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
							if (KinkyDungeonFastStruggle) {
								KinkyDungeonFastStruggleGroup = sg;
								KinkyDungeonFastStruggleType = "Cut";
							} else
								KinkyDungeonStruggle(sg, "Cut");
							return true;
						} i++;
					}
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && sg.lock != "Jammed") {
						if (KinkyDungeonFastStruggle) {
							KinkyDungeonFastStruggleGroup = sg;
							KinkyDungeonFastStruggleType = (sg.lock != "") ? "Unlock" : "Remove";
						} else
							KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove");
						return true;
					} i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "")
					{
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
							if (KinkyDungeonFastStruggle) {
								KinkyDungeonFastStruggleGroup = sg;
								KinkyDungeonFastStruggleType = "Pick";
							} else
								KinkyDungeonStruggle(sg, "Pick");
							return true;
						} i++;
					}
				}
			}

		let xxx = 1750;
		let yyy = 164;
		if (MouseIn(xxx, yyy + 0 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionFrigid") && KinkyDungeonStatDistraction > 0) {
			if (KinkyDungeonCanTalk(true) || KinkyDungeonPotionCollar())
				KinkyDungeonAttemptConsumable("PotionFrigid", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
			return true;
		} else if (MouseIn(xxx, yyy + 1 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionStamina") && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
			if (KinkyDungeonCanTalk(true) || KinkyDungeonPotionCollar())
				KinkyDungeonAttemptConsumable("PotionStamina", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
			return true;
		} else if (MouseIn(xxx, yyy + 2 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionMana") && KinkyDungeonStatMana < KinkyDungeonStatManaMax) {
			if (KinkyDungeonCanTalk(true) || KinkyDungeonPotionCollar())
				KinkyDungeonAttemptConsumable("PotionMana", 1);
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
			return true;
		} else if (MouseIn(xxx, yyy + 0 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth)) return true;
		else if (MouseIn(xxx, yyy + 1 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth)) return true;
		else if (MouseIn(xxx, yyy + 2 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth)) return true;
		else if (MouseIn(xxx, yyy + 3 * KinkyDungeonStatBarHeight, 240, 50) && KDGameData.PlaySelfTurns < 1 && KDGameData.SleepTurns < 1) {
			if (KinkyDungeonCanTryOrgasm()) {
				KinkyDungeonDoTryOrgasm();
				KinkyDungeonAlert = 7; // Alerts nearby enemies because of your moaning~
			} else if (KinkyDungeonCanPlayWithSelf()) {
				KinkyDungeonDoPlayWithSelf();
				KinkyDungeonAlert = 3; // Alerts nearby enemies because of your moaning~
			} else {
				KDGameData.SleepTurns = KinkyDungeonSleepTurnsMax;
				KinkyDungeonAlert = 4; // Alerts nearby enemies; enemies are searching while you sleep
			}
			return true;
		}
	} else if (KinkyDungeonDrawState == "Orb") {
		return KinkyDungeonHandleOrb();
	} else if (KinkyDungeonDrawState == "Heart") {
		return KinkyDungeonHandleHeart();
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(1540, 925, 200, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		if (MouseIn(1540, 925, 200, 60)) { KinkyDungeonDrawState = "Game"; return true;}
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
	} else if (KinkyDungeonDrawState == "Perks2") {
		if (MouseIn(1650, 900, 300, 64)) {
			KinkyDungeonDrawState = "Restart";
			return true;
		}
	} else if (KinkyDungeonDrawState == "Restart") {

		if (MouseIn(1650, 900, 300, 64)) {
			KinkyDungeonDrawState = "Perks2";
			return true;
		}


		if (MouseIn(600, 100, 64, 64)) {
			KinkyDungeonSound = !KinkyDungeonSound;
			localStorage.setItem("KinkyDungeonSound", KinkyDungeonSound ? "True" : "False");
			return true;
		}
		if (MouseIn(600, 260, 64, 64)) {
			KinkyDungeonFullscreen = !KinkyDungeonFullscreen;
			localStorage.setItem("KinkyDungeonFullscreen", KinkyDungeonFullscreen ? "True" : "False");
			return true;
		}
		if (MouseIn(600, 180, 64, 64)) {
			KinkyDungeonDrool = !KinkyDungeonDrool;
			localStorage.setItem("KinkyDungeonDrool", KinkyDungeonDrool ? "True" : "False");
			return true;
		}
		if (MouseIn(600, 340, 64, 64) && (ServerURL == "foobar")) {
			KinkyDungeonGraphicsQuality = !KinkyDungeonGraphicsQuality;
			localStorage.setItem("KinkyDungeonDrool", KinkyDungeonGraphicsQuality ? "True" : "False");
			if (KinkyDungeonGraphicsQuality) {
				// @ts-ignore
				if (!Player.GraphicsSettings) Player.GraphicsSettings = {};
				Player.GraphicsSettings.AnimationQuality = 0;
			} else {
				// @ts-ignore
				if (!Player.GraphicsSettings) Player.GraphicsSettings = {};
				Player.GraphicsSettings.AnimationQuality = 10000;
			}
			return true;
		}
		if (MouseIn(600, 650, 64, 64)) {
			KinkyDungeonFastWait = !KinkyDungeonFastWait;
			return true;
		}
		if (MouseIn(975, 750, 550, 64) && KDGameData.PrisonerState != 'jail') {
			KinkyDungeonDefeat();
			KinkyDungeonChangeRep("Ghost", 4);
			KinkyDungeonDrawState = "Game";
			return true;
		}
		if (MouseIn(1075, 450, 350, 64)) {
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
					Spell4: 52,
					Spell5: 53,
					Up: 119,
					UpLeft: 113,
					UpRight: 101,
					Wait: 120,
					Skip: 13,
				};
			else {
				KinkyDungeonKeybindingsTemp = {};
				Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			}
			return true;
		}
		if (MouseIn(975, 850, 550, 64)) {
			KinkyDungeonState = "Lose";
			//Player.KinkyDungeonSave = {};
			//ServerAccountUpdate.QueueData({KinkyDungeonSave : Player.KinkyDungeonSave});
			localStorage.setItem('KinkyDungeonSave', "");
			MiniGameKinkyDungeonLevel = -1;
			return true;
		} else if (MouseIn(975, 550, 550, 64)) {
			KinkyDungeonDrawState = "Game";
			return true;
		} else if (MouseIn(975, 650, 550, 64)) {
			KinkyDungeonDrawState = "Game";
			KinkyDungeonAutoWait = true;
			KinkyDungeonAutoWaitSuppress = true;
			KinkyDungeonSleepTime = CommonTime() + 500;
			return true;
		}
		return true;
	}

	if (KDModalArea && MouseIn(KDModalArea_x, KDModalArea_y, KDModalArea_width, KDModalArea_height)) return true;
	if (MouseIn(0, 0, 500, 1000)) return true;
	if (MouseIn(1650, 0, 350, 1000)) return true;
	KDModalArea = false;
	return false;
}


function KinkyDungeonUpdateStruggleGroups() {
	let struggleGroups = KinkyDungeonStruggleGroupsBase;
	KinkyDungeonStruggleGroups = [];

	KinkyDungeonCheckClothesLoss = true;

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
					name:(KDRestraint(restraint)) ? KDRestraint(restraint).name : "",
					lock:restraint.lock,
					magic:KDRestraint(restraint) ? KDRestraint(restraint).magic : undefined,
					noCut:KDRestraint(restraint) && KDRestraint(restraint).escapeChance && !KDRestraint(restraint).escapeChance.Cut,
					curse:KDRestraint(restraint)? KDRestraint(restraint).curse : undefined,
					blocked: InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, Group)});
		}
	}
}
