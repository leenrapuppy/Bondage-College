"use strict";
let KinkyDungeonStruggleGroups = [];
let KinkyDungeonStruggleGroupsBase = [
	"ItemH",
	"ItemDevices",
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
let KinkyDungeonToggleAutoPass = false;
let KinkyDungeonToggleAutoSprint = false;

let KinkyDungeonFastMove = true;
let KinkyDungeonFastMovePath = [];
let KinkyDungeonFastStruggle = false;
let KinkyDungeonFastStruggleType = "";
let KinkyDungeonFastStruggleGroup = "";

/**
 *
 * @param {item} item
 * @param {boolean} [includeItem]
 * @returns {item[]}
 */
function KDDynamicLinkList(item, includeItem) {
	let ret = [];
	if (includeItem) ret.push(item);
	if (item && item.dynamicLink) {
		let link = item.dynamicLink;
		while (link) {
			ret.push(link);
			link = link.dynamicLink;
		}
	}
	return ret;
}

/**
 * Returns a list of items on the 'surface' of a dynamic link, i.e items that can be accessed
 * @param {item} item
 * @returns {item[]}
 */
function KDDynamicLinkListSurface(item) {
	// First we get the whole stack
	let stack = [];
	if (item && item.dynamicLink) {
		let last = item;
		let link = item.dynamicLink;
		while (link) {
			stack.push({item: link, host: last});
			link = link.dynamicLink;
			last = link;
		}
	}
	let ret = [item];
	// Now that we have the stack we sum things up
	for (let tuple of stack) {
		let inv = tuple.item;
		let host = tuple.host;
		if (
			(!KDRestraint(host).inaccessible)
			&& ((KDRestraint(host).accessible) || (KDRestraint(inv).renderWhenLinked && KDRestraint(item).shrine && KDRestraint(inv).renderWhenLinked.some((link) => {return KDRestraint(item).shrine.includes(link);})))
		) {
			ret.push(inv);
		}
	}
	return ret;
}

/**
 *
 * @param {restraint} restraint
 * @returns {number}
 */
function KDLinkSize(restraint) {
	return restraint.linkSize ? restraint.linkSize : 1;
}

/**
 *
 * @param {item} item
 * @param {string} linkCategory
 * @returns {number}
 */
function KDLinkCategorySize(item, linkCategory) {
	let total = 0;
	// First we get the whole stack
	let stack = [item];
	if (item && item.dynamicLink) {
		let link = item.dynamicLink;
		while (link) {
			stack.push(link);
			link = link.dynamicLink;
		}
	}
	// Now that we have the stack we sum things up
	for (let inv of stack) {
		if (KDRestraint(inv).linkCategory == linkCategory) {
			total += KDLinkSize(KDRestraint(inv));
		}
	}
	return total;
}

function KinkyDungeonDrawInputs() {

	if (ServerURL == "foobar") DrawButton(1880, 82, 100, 50, TextGet("KinkyDungeonRestart"), "white");
	else DrawButton(1750, 20, 100, 50, TextGet("KinkyDungeonRestart"), "White");
	DrawButton(1915, 925, 60, 60, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonFastMove ? "FastMove" : "FastMoveOff") + ".png");
	DrawButton(1845, 925, 60, 60, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonFastStruggle ? "AutoStruggle" : "AutoStruggleOff") + ".png");
	if (KinkyDungeonPlayerWeapon) {
		DrawTextFit(TextGet("StatWeapon") + TextGet("KinkyDungeonInventoryItem" + KinkyDungeonPlayerWeapon), 1875, 830, 190, "white", "gray");
	} else DrawTextFit(TextGet("KinkyDungeonNoWeapon"), 1875, 830, 190, "white", "gray");
	if (KinkyDungeonPlayerDamage) {
		DrawTextFit(TextGet("KinkyDungeonAccuracy") + Math.round(KinkyDungeonGetEvasion() * 100) + "%", 1875, 875, 190,
			(KinkyDungeonGetEvasion() < KinkyDungeonPlayerDamage.chance * 0.99) ? "pink" :
			(KinkyDungeonGetEvasion() > KinkyDungeonPlayerDamage.chance * 1.01) ? "lightgreen" : "white", "gray");
	}
	let i = 0;
	if (!KDCanEscape()) {
		DrawTextFit(TextGet("KinkyDungeonPlayerNoKeys"), 1640, 900 - i * 35, 200, "white", "gray"); i++;
	} else if (KDGameData.KeysNeeded) {
		DrawTextFit(TextGet("KinkyDungeonPlayerYesKeys"), 1640, 900 - i * 35, 200, "white", "gray"); i++;
	}
	if (KDGameData.PrisonerState == 'jail') {
		DrawTextFit(TextGet("KinkyDungeonPlayerJail"), 1640, 900 - i * 35, 200, "orange", "gray"); i++;
	} else if (KDGameData.PrisonerState == 'parole') {
		DrawTextFit(TextGet("KinkyDungeonPlayerParole"), 1640, 900 - i * 35, 200, "yellow", "gray"); i++;
	} else if (KDGameData.PrisonerState == 'chase') {
		DrawTextFit(TextGet("KinkyDungeonPlayerChase"), 1640, 900 - i * 35, 200, "red", "gray"); i++;
	}
	let evasion = KinkyDungeonPlayerEvasion();
	if (evasion != 1.0) {
		DrawTextFit(TextGet("KinkyDungeonPlayerEvasion") + Math.round(Math.min(100, (1 - evasion) * 100)) + "%", 1640, 900 - i * 35, 200, "white", "gray"); i++;
	}
	let sneak = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	if (sneak > 2.5) {
		DrawTextFit(TextGet("KinkyDungeonPlayerSneak"), 1640, 900 - i * 35, 200, "#ceaaed", "gray"); i++;
	} else {
		let visibility = KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowDetection"));
		if (visibility != 1.0) {
			DrawTextFit(TextGet("KinkyDungeonPlayerVisibility") + Math.round(visibility * 100) + "%", 1640, 900 - i * 35, 200, "#ceaaed", "gray"); i++;
		}
	}
	let help = KinkyDungeonHasAllyHelp() || KinkyDungeonHasGhostHelp();
	let hook = KinkyDungeonGetAffinity(false, "Edge");
	if (help) {
		DrawTextFit(TextGet("KinkyDungeonPlayerHelp"), 1640, 900 - i * 35, 200, "white", "gray"); i++;

	} else if (hook) {
		DrawTextFit(TextGet("KinkyDungeonPlayerHook"), 1640, 900 - i * 35, 200, "white", "gray"); i++;
	}
	if (KinkyDungeonFlags.has("Quickness")) {
		DrawTextFit(TextGet("KinkyDungeonPlayerQuickness"), 1640, 900 - i * 35, 200, "#ffff00", "gray"); i++;
	} else {
		if (KinkyDungeonSlowLevel >= 9) {
			DrawTextFit(TextGet("KinkyDungeonPlayerImmobile"), 1640, 900 - i * 35, 200, "#e27285", "gray"); i++;
		} else if (KinkyDungeonMovePoints < 0) {
			DrawTextFit(TextGet("KinkyDungeonPlayerSlow"), 1640, 900 - i * 35, 200, "#e27285", "gray"); i++;
		} else if (KinkyDungeonSlowLevel >= 4) {
			DrawTextFit(TextGet("KinkyDungeonPlayerSlow4"), 1640, 900 - i * 35, 200, "#e27285", "gray"); i++;
		} else if (KinkyDungeonSlowLevel == 3) {
			DrawTextFit(TextGet("KinkyDungeonPlayerSlow3"), 1640, 900 - i * 35, 200, "#e27285", "gray"); i++;
		} else if (KinkyDungeonSlowLevel == 2) {
			DrawTextFit(TextGet("KinkyDungeonPlayerSlow2"), 1640, 900 - i * 35, 200, "#e27285", "gray"); i++;
		}
	}
	i = 0;

	let armor = Math.max(0, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Armor"));
	if (armor > 0) {
		DrawTextFit(TextGet("KinkyDungeonPlayerArmor") + Math.round(armor*10)/10, 1440, 900 - i * 25, 200, "#fca570", "gray"); i++; i++;
	}
	let damageReduction = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "DamageReduction");
	if (damageReduction > 0) {
		DrawTextFit(TextGet("KinkyDungeonPlayerReduction") + Math.round(damageReduction*10)/10, 1440, 900 - i * 25, 150, "#73efe8", "gray"); i++; i++;
	}
	for (let dt of KinkyDungeonDamageTypes) {
		let color = dt.color;
		let type = dt.name;
		let resist = KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, type + "DamageResist"));

		if (resist != 1.0) {
			DrawTextFit(TextGet("KinkyDungeonPlayerDamageResist").replace("DAMAGETYPE", TextGet("KinkyDungeonDamageType" + type)) + Math.round(resist * 100) + "%", 1440, 900 - i * 25, 150, color, "gray"); i++;
		}
	}

	if (!KDModalArea) {
		i = 0;
		if (KinkyDungeonPlugCount > 0) {
			DrawTextFit(TextGet("KinkyDungeonPlayerPlugged"), 1090, 900 - i * 35, 350, "#ff8888", "gray"); i++;
			if (KinkyDungeonPlugCount > 1) {
				DrawTextFit(TextGet("KinkyDungeonPlayerPluggedExtreme"), 1090, 900 - i * 35, 350, "#ff8888", "gray"); i++;
			}
		}
		if (KinkyDungeonVibeLevel > 0) {
			let locations = KDSumVibeLocations();
			let suff = "";
			if (locations.length == 1 && locations[0] == "ItemVulva") {
				suff = "";
			} else {
				let sum = "";
				if (locations.length > 3)
					sum = TextGet("KinkyDungeonPlayerVibratedLocationMultiple");
				else for (let l of locations) {
					if (sum) sum = sum + ", ";
					sum = sum + TextGet("KinkyDungeonPlayerVibratedLocation" + l);
				}
				suff = ` (${sum})`;
			}
			DrawTextFit(TextGet("KinkyDungeonPlayerVibrated" + Math.max(0, Math.min(Math.floor(KinkyDungeonVibeLevel), 5))) + suff, 1090, 900 - i * 35, 350, "#ff8888", "gray"); i++;
		}
		if (KDGameData.OrgasmTurns > KinkyDungeonOrgasmTurnsCrave) {
			DrawTextFit(TextGet("KinkyDungeonPlayerEdged"), 1090, 900 - i * 35, 350, "red", "gray"); i++;
		} else if (KDGameData.OrgasmStamina > 0) {
			DrawTextFit(TextGet("KinkyDungeonPlayerStatisfied"), 1090, 900 - i * 35, 350, "#ff8888", "gray"); i++;
		}
		if (KDGameData.CurrentVibration  && KDGameData.CurrentVibration.denyTimeLeft > 0) {
			DrawTextFit(TextGet("KinkyDungeonPlayerDenied"), 1090, 900 - i * 35, 350, "#ff8888", "gray"); i++;
		}

		i = 0;
		for (let b of Object.values(KinkyDungeonPlayerBuffs)) {
			if (b.aura || b.labelcolor) {
				let count = b.maxCount ? b.maxCount - (b.currentCount ? b.currentCount : 0) : 0;
				DrawTextFit(TextGet("KinkyDungeonBuff" + b.id) + (count ? `[${count}/${b.maxCount}]` : "") + ((b.duration && b.duration < 9000) ? `(${b.duration})` : ""), 790, 900 - i * 35, 275, b.aura ? b.aura : b.labelcolor, "gray"); i++;
			}

		}
	}

	// Draw the struggle buttons if applicable
	KinkyDungeonDrawStruggleHover = false;
	if (!KinkyDungeonShowInventory && ((KinkyDungeonDrawStruggle > 0 || MouseIn(0, 0, 500, 1000)) && KinkyDungeonStruggleGroups))
		for (let sg of KinkyDungeonStruggleGroups) {
			let ButtonWidth = 60;
			let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
			let y = 42 + sg.y * (ButtonWidth + 46);

			let item = KinkyDungeonGetRestraintItem(sg.group);
			let drawLayers = 0;

			let MY = Math.min(500, MouseY);
			let surfaceItems = [];
			let dynamicList = [];
			let noRefreshlists = false;
			if (KDStruggleGroupLinkIndex[sg.group] && item && item.dynamicLink) {
				surfaceItems = KDDynamicLinkListSurface(item);
				dynamicList = KDDynamicLinkList(item, true);
				noRefreshlists = true;
				if (!KDStruggleGroupLinkIndex[sg.group] || KDStruggleGroupLinkIndex[sg.group] >= surfaceItems.length) {
					KDStruggleGroupLinkIndex[sg.group] = 0;
				}
				item = surfaceItems[KDStruggleGroupLinkIndex[sg.group]];
			}
			if (MouseIn(((!sg.left) ? (260) : 0), y-48, 230, (ButtonWidth + 70))) {
				let lastO = 0;
				// 0 = no draw
				// 1 = grey
				// 2 = white
				if (dynamicList.length > 0 || (item && item.dynamicLink)) {
					if (!noRefreshlists) {
						surfaceItems = KDDynamicLinkListSurface(item);
						dynamicList = KDDynamicLinkList(item, true);
					}
					if (surfaceItems.length <= 1) {
						// Delete if there are no additional surface items
						delete KDStruggleGroupLinkIndex[sg.group];
						drawLayers = 1;
					} else {
						if (!KDStruggleGroupLinkIndex[sg.group] || KDStruggleGroupLinkIndex[sg.group] >= surfaceItems.length) {
							KDStruggleGroupLinkIndex[sg.group] = 0;
						}
						item = surfaceItems[KDStruggleGroupLinkIndex[sg.group]];

						drawLayers = 2;
					}

					let O = 1;
					MainCanvas.textAlign = "left";
					let drawn = false;
					for (let d of dynamicList) {
						if (d.name != item.name)//KDRestraint(item) && (!KDRestraint(item).UnLink || d.name != KDRestraint(item).UnLink))
						{
							drawn = true;
							let msg = TextGet("Restraint" + d.name);
							DrawText(msg, 1 + 530, 1 + MY + O * 50, "gray", "gray");
							DrawText(msg, 530, MY + O * 50, "white", "gray");
							O++;
						}
					}
					lastO = O;
					O = 0;
					if (drawn) {
						DrawText(TextGet("KinkyDungeonItemsUnderneath"), 1 + 530, 1 + MY + O * 50, "gray", "gray");
						DrawText(TextGet("KinkyDungeonItemsUnderneath"), 530, MY + O * 50, "white", "gray");
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
						DrawText(msg, 1 + 530, 1 + MY + O * 50, "gray", "gray");
						DrawText(msg, 530, MY + O * 50, "white", "gray");
						O++;
					}
					O = lastO;
					if (drawn) {
						DrawText(TextGet("KinkyDungeonItemsStrictness"), 1 + 530, 1 + MY + O * 50, "gray", "gray");
						DrawText(TextGet("KinkyDungeonItemsStrictness"), 530, MY + O * 50, "white", "gray");
					}
					MainCanvas.textAlign = "center";
				}
			}

			if (sg.left) {
				MainCanvas.textAlign = "left";
			} else {
				MainCanvas.textAlign = "right";
			}

			let color = "white";
			let locktext = "";
			if (KinkyDungeonBlindLevel != 999) {
				if (item.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLockAbr");}
				if (item.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLockAbr");}
				if (item.lock == "Gold") {color = "#FFFF88"; locktext = TextGet("KinkyGoldLockAbr");}
				if (item.lock == "Purple") {color = "#cc2f7b"; locktext = TextGet("KinkyPurpleLockAbr");}
			} else {
				color = "#cccccc";
				if (item.lock) {
					locktext = TextGet("KinkyBlindLockAbr");
				}
			}

			let GroupText = sg.name ? ("Restraint" + item.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.

			DrawTextFit(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth - (drawLayers ? ButtonWidth : 0) : 0) + 2, y-24+2, 240 - (drawLayers ? ButtonWidth : 0), "gray", "gray");
			DrawTextFit(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth - (drawLayers ? ButtonWidth : 0) : 0), y-24, 240 - (drawLayers ? ButtonWidth : 0), color, "gray");
			MainCanvas.textAlign = "center";

			if (drawLayers) {
				DrawButtonKD("surfaceItems"+sg.group, drawLayers == 2, x + (sg.left ? 240 - ButtonWidth : 12), y - ButtonWidth/2 - 20, 48, 48, "", drawLayers == 2 ? "White" : "#888888", KinkyDungeonRootDirectory + "Layers.png", "");
			}

			i = 0;
			if (MouseIn(((!sg.left) ? (260) : 0), y-48, 230, (ButtonWidth + 70)) || KinkyDungeonDrawStruggle > 1) {
				let r = KDRestraint(item);

				if (!KinkyDungeonDrawStruggleHover) {
					KinkyDungeonDrawStruggleHover = true;
				}

				let buttons = ["Struggle", "CurseInfo", "CurseUnlock", "Cut", "Remove", "Pick"];

				for (let button_index = 0; button_index < buttons.length; button_index++) {
					let btn = buttons[sg.left ? button_index : (buttons.length - 1 - button_index)];
					if (btn == "Struggle") {
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", ""); i++;
					} else if (r.curse && btn == "CurseInfo") {
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseInfo.png", ""); i++;
					} else if (r.curse && btn == "CurseUnlock" && KinkyDungeonCurseAvailable(item, r.curse)) {
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseUnlock.png", ""); i++;
					} else if (!r.curse && !sg.blocked && btn == "Remove") {
						let toolSprite = (item.lock != "") ? ((item.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
					} else if (!r.curse && !sg.blocked && btn == "Cut" && (KinkyDungeonAllWeapon().some((inv) => {return KDWeapon(inv).light && KDWeapon(inv).cutBonus != undefined;})) && !sg.noCut) {
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "",
								(sg.magic) ? "#8394ff" : "White", KinkyDungeonRootDirectory + "Cut.png", "");
						i++;
					} else if (!r.curse && !sg.blocked && btn == "Pick" && KinkyDungeonLockpicks > 0 && item.lock != "") {
						DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;
					}
				}
			}
		}


	if (KinkyDungeonDrawStruggle > 0) DrawButton(510, 925, 120, 60, "", KinkyDungeonStruggleGroups.length > 0 ? "White" : "grey", KinkyDungeonRootDirectory + "Hide" + (KinkyDungeonDrawStruggle > 1 ? "Full" : "True") + ".png", "");
	else DrawButton(510, 925, 120, 60, "", KinkyDungeonStruggleGroups.length > 0 ? "White" : "grey", KinkyDungeonRootDirectory + "HideFalse.png", "");

	DrawButton(510, 825, 60, 90, "", "White", KinkyDungeonRootDirectory + (KinkyDungeonShowInventory ? "BackpackOpen.png" : "Backpack.png"), "");
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.special) {
		if (MouseIn(580, 825, 50, 90)) DrawTextFit(TextGet("KinkyDungeonSpecial" + KinkyDungeonPlayerDamage.name), MouseX, MouseY - 150, 750, "white", "gray");
		DrawButton(580, 825, 50, 90, "", "White", KinkyDungeonRootDirectory + "Ranged.png", "");
	}


	if (KinkyDungeonTargetTile) {
		if (KinkyDungeonTargetTile.Type == "Lock" && KinkyDungeonTargetTile.Lock) {
			let action = false;
			if (KinkyDungeonLockpicks > 0 && (KinkyDungeonTargetTile.Lock.includes("Red") || KinkyDungeonTargetTile.Lock.includes("Blue"))) {
				DrawButton(KDModalArea_x + 313, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
				action = true;
				KDModalArea = true;
			}

			if (KinkyDungeonTargetTile.Lock.includes("Red") || KinkyDungeonTargetTile.Lock.includes("Blue")) {
				DrawButton(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonUnlockDoor"),
				(KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0)
				|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) ? "White" : "#ff0000", "", "");
				action = true;
				KDModalArea = true;
			}
			if ((KinkyDungeonTargetTile.Lock.includes("Purple"))) {
				let spell = KinkyDungeonFindSpell("CommandWord", true);
				DrawButton(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonUnlockDoorPurple"),
				(KinkyDungeonStatMana >= KinkyDungeonGetManaCost(spell)) ? "White" : "#ff0000",
				"", "");
				action = true;
				KDModalArea = true;
			}

			if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), KDModalArea_x + 300, KDModalArea_y + 50, "white", "gray");

			if (KinkyDungeonTargetTile.Lock.includes("Red"))
				DrawText(TextGet("KinkyRedLock"), KDModalArea_x + 50, KDModalArea_y + 50, "white", "gray");
			else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
				DrawText(TextGet("KinkyBlueLock"), KDModalArea_x + 50, KDModalArea_y + 50, "white", "gray");
			else if (KinkyDungeonTargetTile.Lock.includes("Purple"))
				DrawText(TextGet("KinkyPurpleLock"), KDModalArea_x + 50, KDModalArea_y + 50, "white", "gray");
		} else if (KinkyDungeonTargetTile.Type == "Shrine") {
			KinkyDungeonDrawShrine();
		} else if (KDObjectDraw[KinkyDungeonTargetTile.Type]) {
			KDObjectDraw[KinkyDungeonTargetTile.Type]();
		} else if (KinkyDungeonTargetTile.Type == "Door") {
			if (KinkyDungeonTargetTile.Lock) {
				let action = false;
				if (KinkyDungeonLockpicks > 0 && (KinkyDungeonTargetTile.Lock.includes("Red") || KinkyDungeonTargetTile.Lock.includes("Blue"))) {
					DrawButton(KDModalArea_x + 313, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
					action = true;
					KDModalArea = true;
				}

				if (KinkyDungeonTargetTile.Lock.includes("Red") || KinkyDungeonTargetTile.Lock.includes("Blue")) {
					DrawButton(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonUnlockDoor"),
					(KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) ? "White" : "#ff0000", "", "");
					action = true;
					KDModalArea = true;
				}

				if ((KinkyDungeonTargetTile.Lock.includes("Purple"))) {
					let spell = KinkyDungeonFindSpell("CommandWord", true);
					DrawButton(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60, TextGet("KinkyDungeonUnlockDoorPurple"),
					(KinkyDungeonStatMana >= KinkyDungeonGetManaCost(spell)) ? "White" : "#ff0000",
					"", "");
					action = true;
					KDModalArea = true;
				}

				if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), KDModalArea_x + 300, KDModalArea_y + 50, "white", "gray");

				if (KinkyDungeonTargetTile.Lock.includes("Red"))
					DrawText(TextGet("KinkyRedLock"), KDModalArea_x + 25, KDModalArea_y + 50, "white", "gray");
				else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
					DrawText(TextGet("KinkyBlueLock"), KDModalArea_x + 25, KDModalArea_y + 50, "white", "gray");
				else if (KinkyDungeonTargetTile.Lock.includes("Purple"))
					DrawText(TextGet("KinkyPurpleLock"), KDModalArea_x + 50, KDModalArea_y + 50, "white", "gray");
			} else {
				KDModalArea = true;
				DrawButton(KDModalArea_x + 25, KDModalArea_y + 25, 250, 60, TextGet("KinkyDungeonCloseDoor"), "White");
			}
		}
	}


	DrawButton(650, 925, 165, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
	DrawButton(820, 925, 165, 60, TextGet("KinkyDungeonReputation"), "White", "", "");
	DrawButton(1630, 925, 200, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

	let logtxt = KinkyDungeonNewLoreList.length > 0 ? TextGet("KinkyDungeonLogbookN").replace("N", KinkyDungeonNewLoreList.length): TextGet("KinkyDungeonLogbook");
	DrawButton(990, 935, 165, 50, logtxt, "white");
	DrawButton(1160, 935, 145, 50, TextGet("KinkyDungeonAutoDoor" + (KinkyDungeonToggleAutoDoor ? "On" : "Off")), KinkyDungeonToggleAutoDoor ? "white" : "#AAAAAA");
	DrawButton(1310, 935, 145, 50, TextGet("KinkyDungeonAutoPass" + (KinkyDungeonToggleAutoPass ? "On" : "Off")), KinkyDungeonToggleAutoPass ? "white" : "#AAAAAA");
	//DrawButtonKDEx("toggleSprint", () => {KinkyDungeonToggleAutoSprint = !KinkyDungeonToggleAutoSprint; return true;}, true,
	//1460, 925, 1630 - 1460 - 5, 60, TextGet("KinkyDungeonAutoSprint" + (KinkyDungeonToggleAutoSprint ? "On" : "Off")), KinkyDungeonToggleAutoSprint ? "white" : "#AAAAAA");

	for (i = 0; i < KinkyDungeonSpellChoiceCount; i++) {
		let buttonWidth = 40;
		let buttonPad = 80;
		DrawButton(1650 + (90 - buttonWidth), 140 + i*KinkyDungeonSpellChoiceOffset, buttonWidth, buttonWidth, "", "#ffffff", KinkyDungeonRootDirectory + "ChangeSpell.png");

		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[i]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[i]].passive) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[i]];
			let components = KinkyDungeonGetCompList(spell);
			let comp = "";

			let buttonDim = {
				x: 1700 - buttonPad,
				y: 140 + i*KinkyDungeonSpellChoiceOffset,
				w: 76,
				h: 76
			};

			if (spell.components && spell.components.length > 0) comp = components;
			// Render MP cost
			let cost = KinkyDungeonGetManaCost(spell) + "m";
			DrawTextFit(cost, 1650 + (89 - buttonWidth/2), 140 + i*KinkyDungeonSpellChoiceOffset + buttonWidth*1.4, buttonWidth * 0.35 * Math.min(3, cost.length), "#ccddFF", "gray");

			MainCanvas.textAlign = "center";

			if (spell.type == "passive" && KinkyDungeonSpellChoicesToggle[i]) {
				DrawRect(1700 - buttonPad - 4, 140 - 4 + i*KinkyDungeonSpellChoiceOffset, 84, 84, "White");
			}
			DrawButtonKD("SpellCast" + i, true, buttonDim.x, buttonDim.y, buttonDim.w, buttonDim.h, "", "rgba(0, 0, 0, 0)", KinkyDungeonRootDirectory + "Spells/" + spell.name + ".png", "");
			if ((KinkyDungeoCheckComponents(spell).length > 0 || (spell.components.includes("Verbal") && KinkyDungeonGagTotal() > 0 && !spell.noMiscast))) {
				let sp = "SpellFail";
				if (spell.components.includes("Verbal") && KinkyDungeonGagTotal() < 1) {
					sp = "SpellFailPartial";
				}
				DrawImage(KinkyDungeonRootDirectory + "Spells/" + sp + ".png", buttonDim.x + 2, buttonDim.y + 2);
			}

			if (MouseIn(buttonDim.x, buttonDim.y, buttonDim.w, buttonDim.h)) {
				MainCanvas.textAlign = "right";
				DrawTextFit(TextGet("KinkyDungeonSpell"+ spell.name), 1700 - buttonPad - 30, 140 + buttonPad/2 + i*KinkyDungeonSpellChoiceOffset, 300, "white", "gray");
				MainCanvas.textAlign = "center";
				DrawTextFit(comp, 1700 - 2 + 1 - buttonPad / 2, 200 + 1 + i*KinkyDungeonSpellChoiceOffset, Math.min(10 + comp.length * 8, buttonPad), "#000000", "black");
				DrawTextFit(comp, 1700 - 2 - 1 - buttonPad / 2, 200 + 1 + i*KinkyDungeonSpellChoiceOffset, Math.min(10 + comp.length * 8, buttonPad), "#000000", "black");
				DrawTextFit(comp, 1700 - 2 + 1 - buttonPad / 2, 200 - 1 + i*KinkyDungeonSpellChoiceOffset, Math.min(10 + comp.length * 8, buttonPad), "#000000", "black");
				DrawTextFit(comp, 1700 - 2 - 1 - buttonPad / 2, 200 - 1 + i*KinkyDungeonSpellChoiceOffset, Math.min(10 + comp.length * 8, buttonPad), "#000000", "black");
				DrawTextFit(comp, 1700 - 2 - buttonPad / 2, 200 + i*KinkyDungeonSpellChoiceOffset, Math.min(10 + comp.length * 8, buttonPad), "#ffffff", "black");
			}
			// Render number
			DrawTextFit((i+1) + "", buttonDim.x + 11, buttonDim.y + 14, 10, "#000000", "black");
			DrawTextFit((i+1) + "", buttonDim.x + 9, buttonDim.y + 14, 10, "#000000", "black");
			DrawTextFit((i+1) + "", buttonDim.x + 10, buttonDim.y + 13, 10, "#ffffff", "black");


			//let cost = KinkyDungeonGetManaCost(spell) + TextGet("KinkyDungeonManaCost") + comp;
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

function KinkyDungeonCanSleep() {
	if (KDGameData.CurrentVibration) return false;
	else return true;
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
	//DrawTextFit(TextGet("StatDistraction").replace("MAX", KinkyDungeonStatDistractionMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatDistraction) + ""), x+width/2 + buttonWidth, y + 25, width - 2*buttonWidth, (KinkyDungeonStatDistraction < 100) ? "white" : "pink", "gray");
	// TextGet("StatMiscastChance").replace("Percent", Math.round(100 * Math.max(0, KinkyDungeonMiscastChance)) + "%")
	MainCanvas.textAlign = "right";
	DrawTextFit(TextGet("StatDistraction").replace("MAX", KinkyDungeonStatDistractionMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatDistraction) + ""), x+width, y + 25, width - 2*buttonWidth, (KinkyDungeonStatDistraction > 0) ? "white" : "pink", "gray");
	DrawButton(x, y, buttonWidth, buttonWidth, "", (KinkyDungeonStatDistraction > 0 && KinkyDungeonItemCount("PotionFrigid")) ? "Pink" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionFrigid"), x + buttonWidth, y+buttonWidth/2, buttonWidth/2, "white", "gray");
	MainCanvas.textAlign = "right";
	//}
	DrawTextFit(TextGet("StatStamina").replace("MAX", KinkyDungeonStatStaminaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatStamina) + ""), x+width, y + 25 + heightPerBar, width - 2*buttonWidth, (KinkyDungeonStatStamina > 0.5) ? "white" : "pink", "gray");
	DrawButton(x, y+heightPerBar, buttonWidth, buttonWidth, "", (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax && KinkyDungeonItemCount("PotionStamina")) ? "#AAFFAA" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionStamina"), x + buttonWidth, y+1*heightPerBar+buttonWidth/2, buttonWidth/2, "white", "gray");
	MainCanvas.textAlign = "right";
	DrawTextFit(TextGet("StatMana").replace("MAX", KinkyDungeonStatManaMax + "").replace("CURRENT", Math.floor(KinkyDungeonStatMana) + ""), x+width, y + 25 + heightPerBar * 2, width - 2*buttonWidth, (KinkyDungeonStatMana > 0.5) ? "white" : "pink", "gray");
	DrawButton(x, y+2*heightPerBar, buttonWidth, buttonWidth, "", (KinkyDungeonStatMana < KinkyDungeonStatManaMax && KinkyDungeonItemCount("PotionMana")) ? "#AAAAFF" : "#444444", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	MainCanvas.textAlign = "left";
	DrawTextFit("x" + KinkyDungeonItemCount("PotionMana"), x + buttonWidth, y+2*heightPerBar+buttonWidth/2, buttonWidth/2, "white", "gray");
	MainCanvas.textAlign = "center";
	let maxVisual = KinkyDungeonStatMaxMax;
	// Draw distraction
	//if (KinkyDungeonStatDistraction > 0)
	KinkyDungeonDrawProgress(x, y + heightPerBar*0.5, KinkyDungeonStatDistraction/maxVisual, Math.floor(KinkyDungeonStatDistractionMax/12), width, "Heart");

	// Draw Stamina/Mana
	KinkyDungeonDrawProgress(x, y + heightPerBar*1.5, KinkyDungeonStatStamina/maxVisual, Math.floor(KinkyDungeonStatStaminaMax/12), width, "Stamina");
	KinkyDungeonDrawProgress(x, y + heightPerBar*2.5, KinkyDungeonStatMana/maxVisual, Math.floor(KinkyDungeonStatManaMax/12), width, "Mana");

	let sleepColor = "#444444";
	let playColor = "#444444";

	if (KinkyDungeonCanTryOrgasm()) {
		playColor = "#FF5BE9";
	} else if (KinkyDungeonCanPlayWithSelf()) {
		if (KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * KinkyDungeonDistractionSleepDeprivationThreshold) playColor = "#FFD8F9";
		else if (KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * 0.5) playColor = "#FFB5F5";
		else if (KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * 0.75) playColor = "#FF87EF";
		else playColor = "#FF5BE9";
	} else playColor = "#777777";
	if (KinkyDungeonCanSleep()) {
		if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.25) sleepColor = "#ffffff";
		else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.5) sleepColor = "#bbbbbb";
		else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.75) sleepColor = "#999999";
		else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) sleepColor = "#777777";
	}
	DrawButtonKDEx("PlayButton", (bdata) => {
		if (KinkyDungeonCanTryOrgasm()) {
			// Done, converted to input
			KDSendInput("tryOrgasm", {});
		} else if (KinkyDungeonCanPlayWithSelf()) {
			// Done, converted to input
			KDSendInput("tryPlay", {});
		} else {
			KinkyDungeonSendActionMessage(10, TextGet("KDNotFeeling"), "red", 1);
		}
		return true;
	}, true, x, y+3*heightPerBar, 240, 50, KinkyDungeonCanTryOrgasm() ? TextGet("KinkyDungeonTryOrgasm") : TextGet("KinkyDungeonPlayWithSelf"), playColor);
	DrawButtonKDEx("SleepButton", (bdata) => {
		if (KinkyDungeonCanSleep()) {
			KDSendInput("sleep", {});
		} else {
			KinkyDungeonSendActionMessage(10, TextGet("KDCantSleep"), "red", 1);
		}
		return true;
	}, true, x, y+3.7*heightPerBar, 240, 50, TextGet("KinkyDungeonSleep"), sleepColor);

	let i = 4.2;
	MainCanvas.textAlign = "left";
	DrawImageEx(KinkyDungeonRootDirectory + "Items/Gold.png", x + width/4 - 40, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText(TextGet("CurrentGold") + KinkyDungeonGold, x + width/4 + 40, y + 40 + i * heightPerBar, "white", "gray"); i+= 0.75;

	MainCanvas.textAlign = "right";

	DrawRect(x, y + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 80, y + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 160, y + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x, y + 80 + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 160, y + 80 + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");
	DrawRect(x + 80, y + 80 + 40 - 40 + i * heightPerBar, 80, 80, "rgba(0, 0, 0, 0.2)");

	DrawImageEx(KinkyDungeonRootDirectory + "Items/Pick.png", x, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText("" + KinkyDungeonLockpicks, x+80, y + 25 + i * heightPerBar, "white", "gray");
	if (MouseIn(x, y + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemLockpick"), MouseX - 10, MouseY, "white", "gray");

	DrawImageEx(KinkyDungeonRootDirectory + "Items/RedKey.png", x+80, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
	DrawText("" + KinkyDungeonRedKeys, x+80+80, y + 25 + i * heightPerBar, "white", "gray");
	if (MouseIn(x+80, y + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemRedKey"), MouseX - 10, MouseY, "white", "gray");

	if (KinkyDungeonBlueKeys > 0) {
		DrawImageEx(KinkyDungeonRootDirectory + "Items/BlueKey.png", x+160, y + 40 - 40 + i * heightPerBar, {Width: 80, Height: 80});
		DrawText("" + KinkyDungeonBlueKeys, x+80+160, y + 25 + i * heightPerBar, "white", "gray");
		if (MouseIn(x+160, y + 40 - 40 + i * heightPerBar, 80, 80)) DrawText(TextGet("KinkyDungeonInventoryItemMagicKey"), MouseX - 10, MouseY, "white", "gray");
	}

	MainCanvas.textAlign = "center";

	DrawTextFit(TextGet("StatMiscastChance").replace("Percent", Math.round(100 * Math.max(0, KinkyDungeonMiscastChance)) + "%"), x+width/2 + 15, y + 80 + 25 + i * heightPerBar, width - 15, (KinkyDungeonStatDistraction > 0) ? "white" : "pink", "gray");
}

function KinkyDungeonActivateWeaponSpell(instant) {
	if (KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.special) {
		let energyCost = KinkyDungeonPlayerDamage.special.energyCost;
		if (KDGameData.AncientEnergyLevel < energyCost) {
			KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonInsufficientEnergy"), "red", 1);
			return false;
		}
		if (KinkyDungeonPlayerDamage.special.selfCast) {
			KDStartSpellcast(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, KinkyDungeonFindSpell(KinkyDungeonPlayerDamage.special.spell, true), undefined, undefined, undefined);
			//KinkyDungeonCastSpell(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, , undefined, undefined, undefined);
		} else if (!instant) {
			KinkyDungeonTargetingSpell = KinkyDungeonFindSpell(KinkyDungeonPlayerDamage.special.spell, true);
			KinkyDungeonTargetingSpellWeapon = KinkyDungeonPlayerDamage;
		} else {
			KDStartSpellcast(KinkyDungeonTargetX, KinkyDungeonTargetY, KinkyDungeonFindSpell(KinkyDungeonPlayerDamage.special.spell, true), undefined, KinkyDungeonPlayerEntity, undefined);
			//KinkyDungeonCastSpell(KinkyDungeonTargetX, KinkyDungeonTargetY, KinkyDungeonFindSpell(KinkyDungeonPlayerDamage.special.spell, true), undefined, KinkyDungeonPlayerEntity, undefined);
			KinkyDungeonTargetingSpellWeapon = KinkyDungeonPlayerDamage;
		}
		return true;
	}
	return false;
}

function KinkyDungeonRangedAttack() {
	if (!KinkyDungeonPlayerDamage.special) return;
	if (KinkyDungeonPlayerDamage.special.type == "spell" || KinkyDungeonPlayerDamage.special.type == "hitorspell") {
		if (KinkyDungeonPlayerDamage.special.type == "hitorspell") {
			KinkyDungeonTargetingSpell = {name: "WeaponAttack", components: [], level:1, type:"special", special: "weaponAttackOrSpell", noMiscast: true,
				onhit:"", time:25, power: 0, range: KinkyDungeonPlayerDamage.special.range ? KinkyDungeonPlayerDamage.special.range : 1.5, size: 1, damage: ""};
			KinkyDungeonTargetingSpellWeapon = KinkyDungeonPlayerDamage;
			return true;
		} /*else if (KinkyDungeonPlayerDamage.special.type == "attack") {
			KinkyDungeonTargetingSpell = {name: "WeaponAttack", components: [], level:1, type:"special", special: "weaponAttack", noMiscast: true,
				onhit:"", time:25, power: 0, range: KinkyDungeonPlayerDamage.special.range ? KinkyDungeonPlayerDamage.special.range : 1.5, size: 1, damage: ""};
			KinkyDungeonTargetingSpellWeapon = KinkyDungeonPlayerDamage;
			return true;
		}*/ else {
			return KinkyDungeonActivateWeaponSpell();
		}

	}
	return false;
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
			// Done, converted to input
			KinkyDungeonhandleQuickInv();
			return true;
		}
		if (MouseIn(1750, 82, 100, 50)) {
			KinkyDungeonMessageToggle = !KinkyDungeonMessageToggle;
			KDLogIndex = 0;
			return true;
		} else if (KinkyDungeonMessageToggle) {
			if (KinkyDungeonMessageLog.length > KDMaxLog) {
				if (MouseIn(500 + 1250/2 - 200, KDLogTopPad + KDLogHeight + 50, 90, 40)) {
					if (KDLogIndex > 0)
						KDLogIndex = Math.max(0, KDLogIndex - KDLogIndexInc);
					return true;
				} else if (MouseIn(500 + 1250/2 + 100, KDLogTopPad + KDLogHeight + 50, 90, 40)) {
					if (KDLogIndex < KinkyDungeonMessageLog.length - KDMaxLog)
						KDLogIndex = Math.min(Math.max(0, KinkyDungeonMessageLog.length - KDMaxLog), KDLogIndex + KDLogIndexInc);
					return true;
				}
			}
			if (MouseIn(500, KDLogTopPad, 1250, KDLogHeight + 175)) {
				return true;
			}
		}
		if (KinkyDungeonIsPlayer() && MouseIn(1915, 925, 60, 60)) {
			if (!KinkyDungeonFastMoveSuppress)
				KinkyDungeonFastMove = !KinkyDungeonFastMove;
			KinkyDungeonFastMoveSuppress = false;
			KinkyDungeonFastMovePath = [];
			return true;
		} else if (KinkyDungeonIsPlayer() && MouseIn(1845, 925, 60, 60)) {
			if (!KinkyDungeonFastStruggleSuppress)
				KinkyDungeonFastStruggle = !KinkyDungeonFastStruggle;
			KinkyDungeonFastStruggleSuppress = false;
			KinkyDungeonFastStruggleGroup = "";
			KinkyDungeonFastStruggleType = "";
			return true;
		}

		if (KinkyDungeonIsPlayer() && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();

		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Inventory"; return true;}
		else if (MouseIn(990, 935, 165, 50)) {
			KinkyDungeonDrawState = "Logbook";
			KinkyDungeonUpdateLore(localStorage.getItem("kinkydungeonexploredlore") ? JSON.parse(localStorage.getItem("kinkydungeonexploredlore")) : []);
			return true;}
		else if (MouseIn(820, 925, 165, 60)) { KinkyDungeonDrawState = "Reputation"; return true;}
		else
		if (MouseIn(1630, 925, 200, 60)) {
			KinkyDungeonDrawState = "MagicSpells";
			return true;}
		else if (MouseIn(510, 925, 120, 60)) {
			KinkyDungeonDrawStruggle += 1;
			if (KinkyDungeonDrawStruggle > 2) KinkyDungeonDrawStruggle = 0;
			return true;
		} else if (MouseIn(510, 825, 60, 90)) {
			KinkyDungeonShowInventory = !KinkyDungeonShowInventory;
			return true;
		} else if (KinkyDungeonIsPlayer() && MouseIn(580, 825, 50, 90) && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.special) {
			// Done, converted to input
			return KinkyDungeonRangedAttack();
		}

		if ((ServerURL == "foobar" && MouseIn(1880, 82, 100, 50)) || (ServerURL != "foobar" && MouseIn(1750, 20, 100, 50))) {
			KinkyDungeonDrawState = "Restart";
			if (KDDebugMode) {
				ElementCreateTextArea("DebugEnemy");
				ElementValue("DebugEnemy", "Maidforce");
				ElementCreateTextArea("DebugItem");
				ElementValue("DebugItem", "TrapArmbinder");
			}
			return true;
		}

		// Done, converted to input
		if (!KinkyDungeonTargetingSpell) {
			KinkyDungeonSpellPress = "";
			if (KinkyDungeonHandleSpell()) return true;
		} else {
			KinkyDungeonSpellPress = "";
		}

		if (KinkyDungeonIsPlayer() && KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type &&
				((KinkyDungeonTargetTile.Type == "Lock" && KinkyDungeonTargetTile.Lock) || (KinkyDungeonTargetTile.Type == "Door" && KinkyDungeonTargetTile.Lock))) {
				if (KinkyDungeonLockpicks > 0 && (KinkyDungeonTargetTile.Lock.includes("Red") || KinkyDungeonTargetTile.Lock.includes("Blue")) && MouseIn(KDModalArea_x + 313, KDModalArea_y + 25, 112, 60)) {
					// Done, converted to input
					KDSendInput("pick", {targetTile: KinkyDungeonTargetTileLocation});
					return true;
				}

				if (((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) && MouseIn(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60)) {
					// Done, converted to input
					KDSendInput("unlock", {targetTile: KinkyDungeonTargetTileLocation});
					return true;
				}
				if (((KinkyDungeonTargetTile.Lock.includes("Purple") && KinkyDungeonStatMana > KinkyDungeonGetManaCost(KinkyDungeonFindSpell("CommandWord", true)))) && MouseIn(KDModalArea_x + 175, KDModalArea_y + 25, 112, 60)) {
					// Done, converted to input
					KDSendInput("commandunlock", {targetTile: KinkyDungeonTargetTileLocation});
					return true;
				}
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				// Done, converted to input
				if (KinkyDungeonHandleShrine()) {
					return true;
					// if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
				}
			} else if (KDObjectHandle[KinkyDungeonTargetTile.Type]) {
				return KDObjectHandle[KinkyDungeonTargetTile.Type]();
			} else if (KinkyDungeonTargetTile.Type == "Door") {
				if (MouseIn(KDModalArea_x + 25, KDModalArea_y + 25, 350, 60)) {
					// Done, converted to input
					KDSendInput("closeDoor", {targetTile: KinkyDungeonTargetTileLocation});
					return true;
				}
			}
		} else {
			if (MouseIn(1160, 935, 145, 50)) {
				KinkyDungeonToggleAutoDoor = !KinkyDungeonToggleAutoDoor;
				return true;
			} else if (MouseIn(1310, 935, 145, 50)) {
				KinkyDungeonToggleAutoPass = !KinkyDungeonToggleAutoPass;
				return true;
			}
		}

		// Done, converted to input
		if (KinkyDungeonStruggleGroups && KinkyDungeonDrawStruggleHover)
			for (let sg of KinkyDungeonStruggleGroups) {
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				let i = 0;
				let buttons = ["Struggle", "CurseInfo", "CurseUnlock", "Cut", "Remove", "Pick"];

				let item = KinkyDungeonGetRestraintItem(sg.group);
				let surfaceItems = KDDynamicLinkListSurface(item);

				if (surfaceItems.length > 1 && MouseInKD("surfaceItems"+sg.group)) {
					if (!KDStruggleGroupLinkIndex[sg.group]) KDStruggleGroupLinkIndex[sg.group] = 1;
					else KDStruggleGroupLinkIndex[sg.group] = KDStruggleGroupLinkIndex[sg.group] + 1;
				}
				if (KDStruggleGroupLinkIndex[sg.group]) {
					if (!KDStruggleGroupLinkIndex[sg.group] || KDStruggleGroupLinkIndex[sg.group] >= surfaceItems.length) {
						KDStruggleGroupLinkIndex[sg.group] = 0;
					}
					item = surfaceItems[KDStruggleGroupLinkIndex[sg.group]];
				}
				let r = KDRestraint(item);

				for (let button_index = 0; button_index < buttons.length; button_index++) {
					let btn = buttons[sg.left ? button_index : (buttons.length - 1 - button_index)];
					if (btn == "Struggle") {
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
							if (r.curse) KDSendInput("struggleCurse", {group: sg.group, index: KDStruggleGroupLinkIndex[sg.group], curse: r.curse});
							else {
								if (KinkyDungeonFastStruggle) {
									KinkyDungeonFastStruggleGroup = sg.group;
									KinkyDungeonFastStruggleType = "Struggle";
								} else
									KDSendInput("struggle", {group: sg.group, index: KDStruggleGroupLinkIndex[sg.group], type: "Struggle"});
									//KinkyDungeonStruggle(sg, "Struggle");
							} return true;
						} i++;
					} else if (r.curse && btn == "CurseInfo") {
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonCurseInfo(item, r.curse); return true;} i++;
					} else if (r.curse && btn == "CurseUnlock" && KinkyDungeonCurseAvailable(sg, r.curse)) {
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && KinkyDungeonCurseAvailable(item, r.curse)) {
							KDSendInput("curseUnlock", {group: sg.group, index: KDStruggleGroupLinkIndex[sg.group], curse: r.curse});
							return true;} i++;
					} else if (!r.curse && !sg.blocked && btn == "Remove") {
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && item.lock != "Jammed") {
							if (KinkyDungeonFastStruggle) {
								KinkyDungeonFastStruggleGroup = sg.group;
								KinkyDungeonFastStruggleType = (item.lock != "") ? "Unlock" : "Remove";
							} else
								KDSendInput("struggle", {group: sg.group, index: KDStruggleGroupLinkIndex[sg.group], type: (item.lock != "") ? "Unlock" : "Remove"});
								//KinkyDungeonStruggle(sg, (item.lock != "") ? "Unlock" : "Remove");
							return true;
						} i++;
					} else if (!r.curse && !sg.blocked && btn == "Cut" && (KinkyDungeonAllWeapon().some((inv) => {return KDWeapon(inv).light && KDWeapon(inv).cutBonus != undefined;})) && !sg.noCut) {
						if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
							if (KinkyDungeonFastStruggle) {
								KinkyDungeonFastStruggleGroup = sg.group;
								KinkyDungeonFastStruggleType = "Cut";
							} else
								KDSendInput("struggle", {group: sg.group, index: KDStruggleGroupLinkIndex[sg.group], type: "Cut"});
								//KinkyDungeonStruggle(sg, "Cut");
							return true;
						} i++;
					} else if (!r.curse && !sg.blocked && btn == "Pick" && KinkyDungeonLockpicks > 0 && item.lock != "") {
						if (KinkyDungeonLockpicks > 0 && item.lock != "") {
							if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {
								if (KinkyDungeonFastStruggle) {
									KinkyDungeonFastStruggleGroup = sg.group;
									KinkyDungeonFastStruggleType = "Pick";
								} else
									KDSendInput("struggle", {group: sg.group, index: KDStruggleGroupLinkIndex[sg.group], type: "Pick"});
									//KinkyDungeonStruggle(sg, "Pick");
								return true;
							} i++;
						}
					}
				}
			}

		let xxx = 1750;
		let yyy = 164;
		if (MouseIn(xxx, yyy + 0 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionFrigid") && KinkyDungeonStatDistraction > 0) {
			if (KinkyDungeonCanTalk(true) || KinkyDungeonPotionCollar())
				// Done, converted to input
				KDSendInput("consumable", {item: "PotionFrigid", quantity: 1});
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
			return true;
		} else if (MouseIn(xxx, yyy + 1 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionStamina") && KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
			if (KinkyDungeonCanTalk(true) || KinkyDungeonPotionCollar())
				// Done, converted to input
				KDSendInput("consumable", {item: "PotionStamina", quantity: 1});
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
			return true;
		} else if (MouseIn(xxx, yyy + 2 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth) && KinkyDungeonItemCount("PotionMana") && KinkyDungeonStatMana < KinkyDungeonStatManaMax) {
			if (KinkyDungeonCanTalk(true) || KinkyDungeonPotionCollar())
				// Done, converted to input
				KDSendInput("consumable", {item: "PotionMana", quantity: 1});
			else KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonPotionGagged"), "orange", 1);
			return true;
		} else if (MouseIn(xxx, yyy + 0 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth)) return true;
		else if (MouseIn(xxx, yyy + 1 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth)) return true;
		else if (MouseIn(xxx, yyy + 2 * KinkyDungeonStatBarHeight, buttonWidth, buttonWidth)) return true;
	} else if (KinkyDungeonDrawState == "Orb") {
		// Done, converted to input
		return KinkyDungeonHandleOrb();
	} else if (KinkyDungeonDrawState == "Heart") {
		// Done, converted to input
		return KinkyDungeonHandleHeart();
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(1540, 925, 200, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		// Done, converted to input
		else return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		if (MouseIn(1540, 925, 200, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		// Nothing to convert
		else return KinkyDungeonHandleMagicSpells();
	} else if (KinkyDungeonDrawState == "Inventory") {
		if (MouseIn(650, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		// Done, converted to input
		else return KinkyDungeonHandleInventory();
	} else if (KinkyDungeonDrawState == "Logbook") {
		if (MouseIn(650, 925, 565, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		// Done, converted to input
		else return KinkyDungeonHandleLore();
	} else if (KinkyDungeonDrawState == "Reputation") {
		if (MouseIn(820, 925, 165, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		// Done, converted to input
		else return KinkyDungeonHandleReputation();
	} else if (KinkyDungeonDrawState == "Lore") {
		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		// Done, converted to input
		else return KinkyDungeonHandleLore();
	} else if (KinkyDungeonDrawState == "Perks2") {
		if (KDDebugPerks) {
			let X = KDPerksXStart;
			let Y = KDPerksYStart;
			let Y_alt = KDPerksYStart;

			for (let c of KDCategories) {

				Y = Math.max(Y, Y_alt);
				let height = KDPerksYPad + KDPerksButtonHeight*Math.max(c.buffs.length, c.debuffs.length);
				if (Y + height > KDPerksMaxY) {
					X += (KDPerksButtonWidth + KDPerksButtonWidthPad)*2 + KDPerksXPad;
					Y = KDPerksYStart;
				}

				Y += KDPerksYPad;
				Y_alt = Y;
				for (let stat of c.buffs.concat(c.debuffs)) {
					if (!stat[1].locked || KDUnlockedPerks.includes(stat[0])) {
						let YY = stat[1].cost < 0 ? Y_alt : Y;
						let XX = stat[1].cost < 0 ? X + KDPerksButtonWidth + KDPerksButtonWidthPad : X;

						if (MouseIn(XX, YY, KDPerksButtonWidth, KDPerksButtonHeight)) {
							if (!KinkyDungeonStatsChoice.get(stat[0]) && KinkyDungeonCanPickStat(stat[0])) {
								KinkyDungeonStatsChoice.set(stat[0], true);
								localStorage.setItem('KinkyDungeonStatsChoice' + KinkyDungeonPerksConfig, JSON.stringify(Array.from(KinkyDungeonStatsChoice.keys())));
							} else if (KinkyDungeonStatsChoice.get(stat[0])) {
								KinkyDungeonStatsChoice.delete(stat[0]);
								localStorage.setItem('KinkyDungeonStatsChoice' + KinkyDungeonPerksConfig, JSON.stringify(Array.from(KinkyDungeonStatsChoice.keys())));
							}
						}
						if (stat[1].cost < 0) Y_alt += KDPerksButtonHeight + KDPerksButtonHeightPad;
						else Y += KDPerksButtonHeight + KDPerksButtonHeightPad;
					}
				}
			}
		}


		if (MouseIn(1650, 920, 300, 64)) {
			KinkyDungeonDrawState = "Restart";
			if (KDDebugMode) {
				ElementCreateTextArea("DebugEnemy");
				ElementValue("DebugEnemy", "Maidforce");
				ElementCreateTextArea("DebugItem");
				ElementValue("DebugItem", "TrapArmbinder");
			}
			return true;
		}
	} else if (KinkyDungeonDrawState == "Restart") {
		if (MouseIn(600, 20, 64, 64)) {
			// Check URL to see if indev branch
			const params = new URLSearchParams(window.location.search);
			let branch = params.has('branch') ? params.get('branch') : "";
			if (branch || ServerURL == 'https://bc-server-test.herokuapp.com/') {
				KDDebugMode = !KDDebugMode;
				ElementCreateTextArea("DebugEnemy");
				ElementValue("DebugEnemy", "Maidforce");
				ElementCreateTextArea("DebugItem");
				ElementValue("DebugItem", "TrapArmbinder");
				return true;
			}
		}
		if (KDDebugMode) {
			if (MouseIn(1100, 20, 64, 64)) {
				KDDebug = !KDDebug;
				return true;
			} else
			if (MouseIn(1100, 100, 64, 64)) {
				KDDebugPerks = !KDDebugPerks;
				return true;
			} else
			if (MouseIn(1100, 180, 64, 64)) {
				if (KDDebugGold) {
					KDDebugGold = false;
					KinkyDungeonGold = 0;
				} else {
					KDDebugGold = true;
					KinkyDungeonGold = 100000;
				}
				return true;
			} else
			if (MouseIn(1500, 100, 100, 64)) {
				let enemy = KinkyDungeonEnemies.find((element) => {return element.name.toLowerCase() == ElementValue("DebugEnemy").toLowerCase();});
				if (enemy) {
					KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, enemy.name, 1, 1.5);
				}
				return true;
			}else
			if (MouseIn(1600, 100, 100, 64)) {
				let enemy = KinkyDungeonEnemies.find((element) => {return element.name.toLowerCase() == ElementValue("DebugEnemy").toLowerCase();});
				if (enemy) {
					let e = DialogueCreateEnemy(KinkyDungeonPlayerEntity.x -1, KinkyDungeonPlayerEntity.y, enemy.name);
					e.allied = 9999;
				}
				return true;
			}else
			if (MouseIn(1700, 100, 100, 64)) {
				let enemy = KinkyDungeonEnemies.find((element) => {return element.name.toLowerCase() == ElementValue("DebugEnemy").toLowerCase();});
				if (enemy) {
					let e = DialogueCreateEnemy(KinkyDungeonPlayerEntity.x -1, KinkyDungeonPlayerEntity.y, enemy.name);
					e.ceasefire = 1000;
					let shop = KinkyDungeonGetShopForEnemy(e, true);
					if (shop) {
						KinkyDungeonSetEnemyFlag(e, "Shop", -1);
						KinkyDungeonSetEnemyFlag(e, shop, -1);
					}
				}
				return true;
			} else
			if (MouseIn(1500, 260, 300, 64)) {
				let item = null;
				if (KinkyDungeonConsumables[ElementValue("DebugItem")]) KinkyDungeonChangeConsumable(KinkyDungeonConsumables[ElementValue("DebugItem")], 10);
				else if (KinkyDungeonWeapons[ElementValue("DebugItem")]) KinkyDungeonInventoryAddWeapon(ElementValue("DebugItem"));
				else if (KinkyDungeonGetRestraintByName(ElementValue("DebugItem"))) {
					let restraint = KinkyDungeonGetRestraintByName(ElementValue("DebugItem"));
					KinkyDungeonInventoryAdd({name: ElementValue("DebugItem"), type: LooseRestraint, events: restraint.events, quantity: 10});
				} else if (KinkyDungeonOutfitsBase.filter((outfit) => {return outfit.name == ElementValue("DebugItem");}).length > 0) {
					KinkyDungeonInventoryAdd({name: KinkyDungeonOutfitsBase.filter((outfit) => {return outfit.name == ElementValue("DebugItem");})[0].name, type: Outfit});
				}

				if (item)
					KinkyDungeonInventoryAdd(item);
				return true;
			}
			if (MouseIn(1500, 320, 300, 64)) {
				let saveData = KinkyDungeonSaveGame(true);
				KinkyDungeonState = "Save";
				ElementCreateTextArea("saveDataField");
				ElementValue("saveDataField", saveData);
				return true;
			}
			if (MouseIn(1100, 260, 300, 64)) {

				KDMovePlayer(KinkyDungeonEndPosition.x, KinkyDungeonEndPosition.y, false);
				KDGameData.JailKey = true;
				KinkyDungeonUpdateLightGrid = true;
				return true;
			} else
			if (MouseIn(1100, 320, 300, 64)) {
				KDGameData.PrisonerState = 'parole';
				return true;
			}
		}

		if (MouseIn(600, 420, 350, 64)) {
			if (MouseX <= 600 + 350/2) KDVibeVolumeListIndex = (KDVibeVolumeList.length + KDVibeVolumeListIndex - 1) % KDVibeVolumeList.length;
			else KDVibeVolumeListIndex = (KDVibeVolumeListIndex + 1) % KDVibeVolumeList.length;
			KDVibeVolume = KDVibeVolumeList[KDVibeVolumeListIndex];
			localStorage.setItem("KDVibeVolume", "" + KDVibeVolumeListIndex);
		}

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
		// Done, converted to input
		if (KinkyDungeonIsPlayer() && MouseIn(975, 750, 550, 64) && KDGameData.PrisonerState != 'jail' && KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y)) {
			KDSendInput("defeat", {});
			KinkyDungeonDrawState = "Game";
			return true;
		}
		if (MouseIn(1075, 450, 350, 64)) {
			KinkyDungeonState = "Keybindings";
			if (!KinkyDungeonKeybindings)
				KDSetDefaultKeybindings();
			else {
				KinkyDungeonKeybindingsTemp = {};
				Object.assign(KinkyDungeonKeybindingsTemp, KinkyDungeonKeybindings);
			}
			return true;
		}
		// Done, converted to input
		if (KinkyDungeonIsPlayer() && MouseIn(975, 850, 550, 64)) {
			KDSendInput("lose", {});
			//Player.KinkyDungeonSave = {};
			//ServerAccountUpdate.QueueData({KinkyDungeonSave : Player.KinkyDungeonSave});
			localStorage.setItem('KinkyDungeonSave', "");
			return true;
		} else if (MouseIn(975, 550, 550, 64)) {
			KinkyDungeonDrawState = "Game";
			return true;
		} else if (KinkyDungeonIsPlayer() && MouseIn(975, 650, 550, 64)) {
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

let KDStruggleGroupLinkIndex = {};

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
		if (sg == "ItemH") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemHood")) Group = "ItemHood";
			else Group = "ItemHead";
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
					blocked: !KDRestraint(restraint).alwaysStruggleable && KDGroupBlocked(Group)});
		}
	}
}
