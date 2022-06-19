"use strict";

let KDEnemiesCache = new Map();

let KinkyDungeonSummonCount = 2;
let KinkyDungeonEnemyAlertRadius = 2;
let KDStealthyMult = 0.75;
let KDConspicuousMult = 1.5;


function KinkyDungeonNearestJailPoint(x, y) {
	let dist = 100000;
	let point = null;
	for (let p of KDGameData.JailPoints) {
		let d = Math.max(Math.abs(x - p.x), Math.abs(y - p.y));
		if (d < dist) {
			dist = d;
			point = p;
		}
	}

	return point;
}

function KinkyDungeonNearestPatrolPoint(x, y) {
	let dist = 100000;
	let point = -1;
	for (let p of KinkyDungeonPatrolPoints) {
		let d = Math.max(Math.abs(x - p.x), Math.abs(y - p.y));
		if (d < dist) {
			dist = d;
			point = KinkyDungeonPatrolPoints.indexOf(p);
		}
	}

	return point;
}

/** @type {Map<string, number>} */
let KinkyDungeonFlags = new Map();

function KinkyDungeonSetFlag(Flag, Duration) {
	if (!KinkyDungeonFlags.get(Flag) || Duration <= 0 || (KinkyDungeonFlags.get(Flag) > 0 && KinkyDungeonFlags.get(Flag) < Duration)) {
		KinkyDungeonFlags.set(Flag, Duration);
		if (Duration == 0) {
			KinkyDungeonFlags.delete(Flag);
		}
	}
}

function KinkyDungeonUpdateFlags(delta) {
	for (let f of KinkyDungeonFlags.keys()) {
		if (KinkyDungeonFlags.get(f) != -1) {
			if (KinkyDungeonFlags.get(f) > 0) KinkyDungeonFlags.set(f, KinkyDungeonFlags.get(f) - delta);
			if (KinkyDungeonFlags.get(f) <= 0 && KinkyDungeonFlags.get(f) != -1) KinkyDungeonFlags.delete(f);
		}
	}
}

function KinkyDungeonGetPatrolPoint(index, radius, Tiles) {
	let p = KinkyDungeonPatrolPoints[index];
	let t = Tiles ? Tiles : KinkyDungeonMovableTilesEnemy;
	if (p) {
		for (let i = 0; i < 8; i++) {
			let XX = p.x + Math.round(KDRandom() * 2 * radius - radius);
			let YY = p.y + Math.round(KDRandom() * 2 * radius - radius);
			if (t.includes(KinkyDungeonMapGet(XX, YY))) {
				return {x: XX, y: YY};
			}
		}
	}
	return p;
}

function KDHelpless(enemy) {
	return (enemy.hp <= enemy.Enemy.maxhp * 0.1 || enemy.boundLevel > 10 * enemy.Enemy.maxhp) && KDBoundEffects(enemy) > 3;
}

function KinkyDungeonNearestPlayer(enemy, requireVision, decoy, visionRadius) {
	if (enemy && enemy.Enemy && !visionRadius) {
		visionRadius = enemy.Enemy.visionRadius;
	}
	if (decoy) {
		let pdist = Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x)*(KinkyDungeonPlayerEntity.x - enemy.x)
			+ (KinkyDungeonPlayerEntity.y - enemy.y)*(KinkyDungeonPlayerEntity.y - enemy.y));
		let nearestVisible = undefined;

		if (enemy.Enemy.focusPlayer && KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, pdist, visionRadius, false, false)) return KinkyDungeonPlayerEntity;

		let nearestDistance = KDHostile(enemy) ? pdist - 0.1 : 100000;

		for (let e of KinkyDungeonEntities) {
			if (e == enemy) continue;
			if (KDHelpless(e)) continue;
			if (enemy.Enemy.noTargetSilenced && e.silence > 0) continue;
			if ((e.Enemy && !e.Enemy.noAttack && KDHostile(enemy, e))) {
				let dist = Math.sqrt((e.x - enemy.x)*(e.x - enemy.x)
					+ (e.y - enemy.y)*(e.y - enemy.y));
				let pdist_enemy = (KDGetFaction(enemy) == "Player" && !KDEnemyHasFlag(enemy, "NoFollow") && !KDEnemyHasFlag(enemy, "StayHere") && (enemy.Enemy.allied || (!KDGameData.PrisonerState || KDGameData.PrisonerState == "chase")))
					? KDistChebyshev(e.x - KinkyDungeonPlayerEntity.x, e.y - KinkyDungeonPlayerEntity.y) :
					-1;
				if (pdist_enemy > 0 && pdist_enemy < 1.5 && KDHostile(e)) KinkyDungeonSetFlag("AIHelpPlayer", 4);
				if (pdist_enemy > 0 && KinkyDungeonFlags.get("AIHelpPlayer") && dist > 2.5) {
					if (pdist_enemy > 2.5) dist += 2;
					else dist = Math.max(1.01 + dist/4, dist/3);
				}
				if (dist <= nearestDistance && (pdist_enemy <= 0 ||
					((KinkyDungeonLightGet(e.x, e.y) > 0 || pdist_enemy < 5) && (pdist_enemy < 8 || enemy.Enemy.followRange > 1))
				)) {
					if (KinkyDungeonCheckLOS(enemy, e, dist, visionRadius, true, true)) {
						if (enemy.rage || !e.Enemy.lowpriority
								|| !KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, pdist, visionRadius, true, true)
								|| !KinkyDungeonCheckPath(enemy.x, enemy.y, e.x, e.y, false, true)) {
							nearestVisible = e;
							nearestDistance = dist;
						}
					}
				}
			}
		}

		if (nearestVisible) return nearestVisible;
	}
	return KinkyDungeonPlayerEntity;
}

function KinkyDungeonInDanger() {
	for (let b of KinkyDungeonBullets) {
		let bdist = 1.5;
		if (b.vx && b.vy) bdist = 2*Math.sqrt(b.vx*b.vx + b.vy*b.vy);
		if (KinkyDungeonLightGet(Math.round(b.x), Math.round(b.y)) > 0 && Math.max(Math.abs(b.x - KinkyDungeonPlayerEntity.x), Math.abs(b.y - KinkyDungeonPlayerEntity.y)) < bdist) {
			return true;
		}
	}
	for (let enemy of KinkyDungeonEntities) {
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				if ((KinkyDungeonAggressive(enemy) || playerDist < 1.5)) {
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						return true;
					}
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						return true;
					}
				}
			}
		}
	}

	return false;
}

let KinkyDungeonFastMoveSuppress = false;
let KinkyDungeonFastStruggleSuppress = false;
function KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	let reenabled = false;
	let reenabled2 = false;
	if (KinkyDungeonFastMoveSuppress) { //&& !CommonIsMobile
		KinkyDungeonFastMove = true;
		KinkyDungeonFastMovePath = [];
		KinkyDungeonFastMoveSuppress = false;
		reenabled = true;
	}
	if (KinkyDungeonFastStruggleSuppress) {
		KinkyDungeonFastStruggle = true;
		KinkyDungeonFastStruggleType = "";
		KinkyDungeonFastStruggleGroup = "";
		KinkyDungeonFastStruggleSuppress = false;
		reenabled2 = true;
	}
	for (let b of KinkyDungeonBullets) {
		let bdist = 1.5;
		if (b.vx && b.vy) bdist = 2*Math.sqrt(b.vx*b.vx + b.vy*b.vy);
		if (KinkyDungeonLightGet(Math.round(b.x), Math.round(b.y)) > 0 && Math.max(Math.abs(b.x - KinkyDungeonPlayerEntity.x), Math.abs(b.y - KinkyDungeonPlayerEntity.y)) < bdist) {
			if (KinkyDungeonFastStruggle) {
				if (KinkyDungeonFastStruggle && !KinkyDungeonFastStruggleSuppress && !reenabled2)
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
				KinkyDungeonFastStruggle = false;
				KinkyDungeonFastStruggleGroup = "";
				KinkyDungeonFastStruggleType = "";
				reenabled2 = false;
				//if (!CommonIsMobile)
				KinkyDungeonFastStruggleSuppress = true;
			}
			if (KinkyDungeonFastMove) {
				if (KinkyDungeonFastMove && !KinkyDungeonFastMoveSuppress && !reenabled)
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
				KinkyDungeonFastMove = false;
				KinkyDungeonFastMovePath = [];
				reenabled = false;
				//if (!CommonIsMobile)
				KinkyDungeonFastMoveSuppress = true;
			}
		}
	}

	for (let enemy of KinkyDungeonEntities) {
		let sprite = enemy.Enemy.name;
		KinkyDungeonUpdateVisualPosition(enemy, KinkyDungeonDrawDelta);
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0 && playerDist > 1.5)) {
				enemy.revealed = true;
				if (((KinkyDungeonAggressive(enemy) && playerDist <= 6.9) || (playerDist < 1.5 && enemy.playWithPlayer))) {
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 && KinkyDungeonFastMove &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						if (KinkyDungeonFastMove && !KinkyDungeonFastMoveSuppress && !reenabled)
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
						KinkyDungeonFastMove = false;
						KinkyDungeonFastMovePath = [];
						reenabled = false;
						if (!CommonIsMobile)
							KinkyDungeonFastMoveSuppress = true;
					}
					if ((KDHostile(enemy) || enemy.rage) && KinkyDungeonLightGet(enemy.x, enemy.y) > 0 && KinkyDungeonFastStruggle &&
					(enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) {
						if (KinkyDungeonFastStruggle && !KinkyDungeonFastStruggleSuppress && !reenabled2)
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
						KinkyDungeonFastStruggle = false;
						KinkyDungeonFastStruggleGroup = "";
						KinkyDungeonFastStruggleType = "";
						reenabled2 = false;
						if (!CommonIsMobile)
							KinkyDungeonFastStruggleSuppress = true;
					}
				}
				if (enemy.buffs)
					for (let b of Object.values(enemy.buffs)) {
						if (b && b.aura) {
							DrawImageCanvasColorize(KinkyDungeonRootDirectory + (b.auraSprite ? b.auraSprite : "Aura") + ".png", KinkyDungeonContext,
								(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
								KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
								b.aura, true, []);
						}
					}
				if (!enemy.Enemy.bound || KDBoundEffects(enemy) < 4)
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				else
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "EnemiesBound/" + enemy.Enemy.bound + ".png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
			}
		}
	}
	if (reenabled && KinkyDungeonFastMove) {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
	} else if (reenabled2 && KinkyDungeonFastStruggle) {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Click.ogg");
	}
}

/**
 *
 * @param {entity} enemy
 * @param {string} flag
 * @returns {boolean}
 */
function KDEnemyHasFlag(enemy, flag) {
	return (enemy.flags && enemy.flags[flag] != undefined);
}

function KinkyDungeonDrawEnemiesStatus(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let enemy of KinkyDungeonEntities) {
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			let bindLevel = KDBoundEffects(enemy);
			if (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				if (enemy.vulnerable) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Vulnerable.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.stun > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Stun.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.silence) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Silence.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.bind > 0 && bindLevel < 4) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Bind.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if ((enemy.slow > 0 || KinkyDungeonGetBuffedStat(enemy.buffs, "MoveSpeed") < 0) && bindLevel < 4) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Slow.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Buff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") < 0 && bindLevel < 4) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Debuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "Armor") < 0 && enemy.Enemy.armor > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ArmorDebuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				} else if (KinkyDungeonGetBuffedStat(enemy.buffs, "Armor") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ArmorBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "Evasion") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/EvasionBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "DamageReduction") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ShieldBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "DamageAmp") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/DamageAmp.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.freeze > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Freeze.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
		}
	}
}

function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let enemy of KinkyDungeonEntities) {
		if (enemy.warningTiles) {
			for (let t of enemy.warningTiles) {
				let tx = enemy.x + t.x;
				let ty = enemy.y + t.y;
				let special = enemy.usingSpecial ? "Special" : "";
				let attackMult = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackSlow");
				let attackPoints = enemy.attackPoints - attackMult + 1.5;
				if (((enemy.usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : enemy.Enemy.attackPoints) > attackPoints) {
					special = special + "Basic";
				}
				//  && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && !(tx == enemy.x && ty == enemy.y)) {
					if (enemy.Enemy.color)
						DrawImageCanvasColorize(KinkyDungeonRootDirectory + "WarningColor" + special + ".png", KinkyDungeonContext,
							(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
							enemy.Enemy.color, true, []);
					else
						DrawImageZoomCanvas(KinkyDungeonRootDirectory + ((KDAllied(enemy)) ? "WarningAlly.png" : "Warning" + special + ".png"),
							KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
		}
		if (enemy.Enemy.spells && (enemy.Enemy.spellRdy && (enemy.Enemy.AI != "ambush" || enemy.ambushtrigger)) && !(enemy.castCooldown > 1)) {
			let tx = enemy.visual_x;
			let ty = enemy.visual_y;
			//  && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))
			if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay
				&& KDCanSeeEnemy(enemy, Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y)))
				&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
				DrawImageCanvasColorize(KinkyDungeonRootDirectory + "SpellReady.png", KinkyDungeonContext,
					(tx - CamX)*KinkyDungeonGridSizeDisplay, (ty - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
					enemy.Enemy.color ? enemy.Enemy.color : "#ffffff", true, []);
			}
		}
	}
}

function KinkyDungeonBar(x, y, w, h, value, foreground = "#66FF66", background = "red") {
	if (value < 0) value = 0;
	if (value > 100) value = 100;
	DrawRect(x + 2, y + 2, Math.floor((w - 4) * value / 100), h - 4, foreground);
	if (background != "none")
		DrawRect(Math.floor(x + 2 + (w - 4) * value / 100), y + 2, Math.floor((w - 4) * (100 - value) / 100), h - 4, background);
}

function KDCanSeeEnemy(enemy, playerDist) {
	return (((enemy.revealed && !enemy.Enemy.noReveal) || !enemy.Enemy.stealth || KinkyDungeonSeeAll || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0));
}

/**
 *
 * @param {entity} enemy
 * @returns {number}
 */
function KDGetEnemyStruggleRate(enemy) {
	let level = KDBoundEffects(enemy);
	let mult = 0.1;

	if (enemy.boundLevel > enemy.Enemy.maxhp * 10) {
		mult = 0;
	} else {
		if (enemy.bind > 0) mult *= 0.4;
		else if (enemy.slow > 0) mult *= 0.7;
		if (level > 3) mult *= 4; // Struggle faster when bound heavily, because they're using all their energy to try to escape
		if (enemy.vulnerable > 0 || enemy.attackPoints > 0) mult *= 0.5;
		if (enemy.boundLevel > 0) {
			mult *= Math.pow(1.5, -enemy.boundLevel / enemy.Enemy.maxhp); // The more you tie, the stricter the bondage gets
		}
		if (KinkyDungeonGetBuffedStat(enemy.buffs, "Lockdown")) mult *= KinkyDungeonGetBuffedStat(enemy.buffs, "Lockdown");
	}
	let amount = mult * Math.pow(Math.max(0.01, enemy.hp), 0.75); // Lower health enemies struggle slower
	return amount;
}

let KDMaxBindingBars = 3;

function KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	let tooltip = false;
	for (let enemy of KinkyDungeonEntities) {
		let playerDist = Math.max(Math.abs(enemy.x - KinkyDungeonPlayerEntity.x), Math.abs(enemy.y - KinkyDungeonPlayerEntity.y));
		if (enemy.x >= CamX && enemy.y >= CamY && enemy.x < CamX + KinkyDungeonGridWidthDisplay && enemy.y < CamY + KinkyDungeonGridHeightDisplay
			&& KinkyDungeonLightGet(enemy.x, enemy.y) > 0) {
			let xx = enemy.visual_x ? enemy.visual_x : enemy.x;
			let yy = enemy.visual_y ? enemy.visual_y : enemy.y;
			// Draw bars
			if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				if ((KDAllied(enemy) || ((enemy.lifetime != undefined || enemy.hp < enemy.Enemy.maxhp || enemy.boundLevel)))) {
					let II = 0;
					// Draw binding bars
					let helpless = KDHelpless(enemy);
					if (enemy.boundLevel != undefined && enemy.boundLevel > 0) {
						if (!helpless) {
							let bindingBars = Math.ceil(enemy.boundLevel / enemy.Enemy.maxhp);
							for (let i = 0; i < bindingBars && i < KDMaxBindingBars; i++) {
								if (i > 0) II++;
								let mod = 0;
								if (i == bindingBars - 1) {
									mod = KDGetEnemyStruggleRate(enemy);
									KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay + 12 - 15 - 12*II,
										KinkyDungeonGridSizeDisplay, 12, Math.min(1, (enemy.boundLevel - i * enemy.Enemy.maxhp) / enemy.Enemy.maxhp) * 100, "#bd6a62", "#52333f");
								}
								KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay + 12 - 15 - 12*II,
									KinkyDungeonGridSizeDisplay, 12, Math.min(1, (Math.max(0, enemy.boundLevel - mod - i * enemy.Enemy.maxhp)) / enemy.Enemy.maxhp) * 100, "#ffae70", i == bindingBars - 1 ? "none" : "#52333f");
							}
						} else {
							// TODO draw a lock or some other icon
						}
					}
					// Draw HP bar
					if (!helpless) {
						KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - 15 - II * 12,
							KinkyDungeonGridSizeDisplay, 12, enemy.hp / enemy.Enemy.maxhp * 100, KDAllied(enemy) ? "#00ff88" : "#ff0000", KDAllied(enemy) ? "#aa0000" : "#000000"); II++;
						if (enemy.lifetime != undefined && enemy.maxlifetime > 0 && enemy.maxlifetime < 999) {
							// Draw lifetime bar
							KinkyDungeonBar(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - 12 - 15 - II * 12,
								KinkyDungeonGridSizeDisplay, 12, enemy.lifetime / enemy.maxlifetime * 100, "#cccccc", "#000000"); II++;
						}
					}
				}
			}


			// Draw status bubbles
			if (KDCanSeeEnemy(enemy, playerDist)) {
				// Draw thought bubbles
				if (enemy.Enemy.specialdialogue || enemy.specialdialogue) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Dialogue.png",
						MainCanvas, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				let bb = false;
				if (enemy.Enemy.bound && KDThoughtBubbles.has(enemy.id)) {
					let bubble = KDThoughtBubbles.get(enemy.id);
					if (bubble.index + bubble.duration >= KinkyDungeonCurrentTick) {
						bb = true;
						let name = CommonTime() % 1000 < 500 ? "Thought" : bubble.name;
						if (name != "Thought" || !((enemy.lifetime != undefined || enemy.hp < enemy.Enemy.maxhp || enemy.boundLevel)))
							DrawImageZoomCanvas(KinkyDungeonRootDirectory + `Conditions/Thought/${name}.png`,
								MainCanvas, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
								canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
								KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					}
				}
				if (!KDHelpless(enemy)) {
					if (!KinkyDungeonAggressive(enemy) && ((!KDAllied(enemy) && !enemy.Enemy.specialdialogue && !bb) || KDEnemyHasFlag(enemy, "Shop")) && !enemy.playWithPlayer && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
						DrawImageZoomCanvas(KinkyDungeonRootDirectory + ((KDEnemyHasFlag(enemy, "Shop")) ? "Conditions/Shop.png" : (KDAllied(enemy) ? "Conditions/Heart.png" : "Conditions/Peace.png")),
							MainCanvas, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
							KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					} else if (!bb && enemy.aware && KDHostile(enemy) && enemy.vp > 0 && enemy.Enemy && !enemy.Enemy.noAlert && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
						DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Aware.png",
							MainCanvas, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
							KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					} else if (!bb && enemy.vp > 0.01 && KDHostile(enemy) && enemy.Enemy && !enemy.Enemy.noAlert && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
						let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
						if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
						if (enemy.vp > sneakThreshold/2)
							DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/vp.png",
								MainCanvas, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
								canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/2,
								KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					}
				}


				if (!tooltip && (enemy.Enemy.AI != "ambush" || enemy.ambushtrigger) && MouseIn(canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay,
					KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay)) {
					let faction = KDGetFaction(enemy);
					let yboost = 0;
					if (faction && !KinkyDungeonHiddenFactions.includes(faction)) {
						let tt = TextGet("KinkyDungeonFaction" + faction);
						DrawTextFit(tt, 1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, 1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/3, 10 + tt.length * 8, "black", "black");
						DrawTextFit(tt, canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/3, 10 + tt.length * 8, "white", "black");
						yboost = -2*KinkyDungeonGridSizeDisplay/7;
					}

					let name = TextGet("Name" + enemy.Enemy.name);
					DrawTextFit(name, 1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, yboost + 1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/3, 10 + name.length * 8, "black", "black");
					DrawTextFit(name, canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2, yboost + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/3, 10 + name.length * 8, "white", "black");


					tooltip = true;

					if (enemy.buffs && enemy.buffs.Analyze) {
						let i = 0;
						let spacing = 25;
						let pad = 70;
						if (enemy.Enemy.dmgType) {
							for (let dt of KinkyDungeonDamageTypes) {
								if (dt.name == enemy.Enemy.dmgType) {
									i += 1;
									let str = TextGet("KinkyDungeonTooltipDealsDamage").replace("DAMAGETYPE", TextGet("KinkyDungeonDamageType" + enemy.Enemy.dmgType));
									DrawTextFit(str,
										1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.bg, dt.bg);
									DrawTextFit(str,
										canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.color, dt.bg);
									break;
								}
							}
						}
						if (enemy.Enemy.armor) {
							i += 1;
							let str = TextGet("KinkyDungeonTooltipArmor").replace("AMOUNT", "" + enemy.Enemy.armor);
							DrawTextFit(str,
								1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "black", "black");
							DrawTextFit(str,
								canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "white", "black");
						}
						if (enemy.Enemy.evasion) {
							i += 1;
							let str = TextGet("KinkyDungeonTooltipEvasion").replace("AMOUNT", "" + Math.round(100 * KinkyDungeonMultiplicativeStat(enemy.Enemy.evasion)));
							DrawTextFit(str,
								1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "black", "black");
							DrawTextFit(str,
								canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
								canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, "white", "black");
						}

						let list = Array.from(enemy.Enemy.tags.keys());
						if (enemy.Enemy.spellResist)
							list.push("magic");
						let magic = false;
						for (let t of list) {
							for (let dt of KinkyDungeonDamageTypes) {
								if ((t == dt.name + "resist" || t == dt.name + "weakness" || t == dt.name + "immune" || t == dt.name + "severeweakness")
									|| (dt.name == "magic" && t.includes("magic") && enemy.Enemy.spellResist)) {
									i += 1;
									let mult = 1.0;
									if (t == dt.name + "resist") mult = 0.5;
									else if (t == dt.name + "weakness") mult = 1.5;
									else if (t == dt.name + "immune") mult = 0;
									else if (t == dt.name + "severeweakness") mult = 2.0;
									if (dt.name == "magic" && !magic && enemy.Enemy.spellResist) {
										magic = true;
										mult *= KinkyDungeonMultiplicativeStat(enemy.Enemy.spellResist);
									}
									let str = TextGet("KinkyDungeonTooltipWeakness").replace("MULTIPLIER", "" + Math.round(mult * 100)/100).replace("DAMAGETYPE", TextGet("KinkyDungeonDamageType"+ dt.name));
									DrawTextFit(str,
										1 + canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										1 + canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.bg, dt.bg);
									DrawTextFit(str,
										canvasOffsetX + (xx - CamX)*KinkyDungeonGridSizeDisplay + KinkyDungeonGridSizeDisplay/2,
										canvasOffsetY + (yy - CamY)*KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay/7 + pad + spacing * i, 10 + str.length * 8, dt.color, dt.bg);

								}
							}
						}
					}
				}
			}
		}
	}
}

let KDChampionMax = 25;

/**
 *
 * @param {entity} enemy
 * @returns {boolean} Whether or not it was a Champion capture
 */
function KinkyDungeonCapture(enemy) {
	let msg = "KinkyDungeonCapture";
	let goddessCapture = false;
	if (enemy.lifetime != undefined && enemy.lifetime < 999) {
		msg = "KinkyDungeonCaptureBasic";
	} else if (KDGameData.Champion) {
		if (KDGameData.ChampionCurrent < KDChampionMax) {
			msg = "KinkyDungeonCaptureGoddess";
			let disapproval = 0;
			goddessCapture = true;
			// Is the player wearing something related to the goddess?
			if (KinkyDungeonStatsChoice.has("BoundCrusader")) {
				let uniform = ["Rope", "Leather", "Metal", "Latex"];
				if (uniform.includes(KDGameData.Champion)) uniform = [KDGameData.Champion];
				let restraints = [];
				for (let u of uniform) {
					for (let r of KinkyDungeonGetRestraintsWithShrine(u, true)) {
						restraints.push(r);
					}
				}
				let minAmount = 1;
				if (KinkyDungeonGoddessRep[KDGameData.Champion] > 10) minAmount = 2;
				if (KinkyDungeonGoddessRep[KDGameData.Champion] > 30) minAmount = 3;
				if (restraints.length < minAmount) {
					msg = "KinkyDungeonCaptureGoddess" + (minAmount == 1 ? "Low" : "None") + (uniform.includes(KDGameData.Champion) ? "Uniform" : "Restraint");
					if (minAmount == 1)
						disapproval = 1;
					else
						disapproval = 2;
				}
			}
			if (disapproval == 0) {
				KinkyDungeonChangeMana(2);
				KinkyDungeonChangeRep(KDGameData.Champion, 1);
				KDGameData.ChampionCurrent += 1;
			} else if (disapproval == 1) {
				KinkyDungeonChangeMana(1);
				KDGameData.ChampionCurrent += 1;
			} else goddessCapture = false;
		} else msg = "KinkyDungeonCaptureMax";
	} else msg = "KinkyDungeonCaptureBasic";

	KinkyDungeonSendEvent("capture", {enemy: enemy});
	KinkyDungeonSendActionMessage(6, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)).replace("GODDESS", TextGet("KinkyDungeonShrine" + KDGameData.Champion)), "lightgreen", 2);
	return goddessCapture;
}

/**
 *
 * @param {entity} enemy
 */
function KDDropStolenItems(enemy) {
	if (enemy.items) {
		for (let name of enemy.items) {
			let item = {x:enemy.x, y:enemy.y, name: name};
			KinkyDungeonGroundItems.push(item);
		}
		enemy.items = [];
	}
}

function KinkyDungeonEnemyCheckHP(enemy, E) {
	if (enemy.hp <= 0) {
		let noRepHit = false;
		KinkyDungeonEntities.splice(E, 1);
		KinkyDungeonSendEvent("kill", {enemy: enemy});
		if (KDBoundEffects(enemy) > 3 && enemy.boundLevel > 0 && KDHostile(enemy) && !enemy.Enemy.tags.has("nocapture") && enemy.playerdmg) {
			KDDropStolenItems(enemy);
			if (!KinkyDungeonCapture(enemy)) noRepHit = true;
		} else {
			KDDropStolenItems(enemy);
			if (enemy == KinkyDungeonKilledEnemy && Math.max(3, enemy.Enemy.maxhp/4) >= KinkyDungeonActionMessagePriority) {
				if (KDistChebyshev(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) < 10)
					KinkyDungeonSendActionMessage(4, TextGet("Kill"+enemy.Enemy.name), "orange", 2, undefined, undefined, enemy);
				KinkyDungeonKilledEnemy = null;
			}
		}


		if (!(enemy.lifetime < 9000)) {
			if (enemy.playerdmg) {
				if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("boss"))
					KinkyDungeonChangeRep("Ghost", -5);
				else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("miniboss"))
					KinkyDungeonChangeRep("Ghost", -2);
				else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("elite") && KDRandom() < 0.33)
					KinkyDungeonChangeRep("Ghost", -1);


				if (enemy.Enemy && enemy.Enemy.rep && !enemy.noRep)
					for (let rep of Object.keys(enemy.Enemy.rep))
						KinkyDungeonChangeRep(rep, enemy.Enemy.rep[rep]);


				if (enemy.Enemy && enemy.Enemy.factionrep && !enemy.noRep)
					for (let rep of Object.keys(enemy.Enemy.factionrep))
						KinkyDungeonChangeFactionRep(rep, enemy.Enemy.factionrep[rep]);

				if (KinkyDungeonStatsChoice.has("Vengeance")) {
					KinkyDungeonChangeDistraction(Math.max(0, Math.ceil(Math.pow(enemy.Enemy.maxhp, 0.7))), false, 0.75);
				}

				let faction = KDGetFaction(enemy);
				let amount = 0;

				if (!KinkyDungeonHiddenFactions.includes(faction)) {
					if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("boss"))
						amount = 0.04;
					else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("miniboss"))
						amount = 0.02;
					else if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("elite"))
						amount = 0.01;
					if (enemy.Enemy && enemy.Enemy.tags && !enemy.Enemy.tags.has("minor"))
						amount = 0.004;
					if (enemy.Enemy && enemy.Enemy.tags && enemy.Enemy.tags.has("minor"))
						amount = KDRandom() < 0.33 ? 0.004 : 0.001;

				}
				if (amount && !noRepHit) {
					KinkyDungeonChangeFactionRep(faction, -amount);

					// For being near a faction
					let boostfactions = [];
					let hurtfactions = [];
					for (let e of KinkyDungeonEntities) {
						let dist = KDistChebyshev(e.x - enemy.x, e.y - enemy.y);
						if (dist < 10) {
							let faction2 = KDGetFaction(e);
							if (!KinkyDungeonHiddenFactions.includes(faction2)) {
								if (KDFactionRelation(faction, faction2) < -0.1 && !boostfactions.includes(faction2)) {
									boostfactions.push(faction2);
									let mult = 1.0;
									if (amount > 0) {
										if (KDFactionRelation("Player", faction2) > 0.5)
											mult *= 0.05;
										else if (KDFactionRelation("Player", faction2) > 0.25)
											mult *= 0.5;
									}
									KinkyDungeonChangeFactionRep(faction2, 0.5 * amount * mult * -KDFactionRelation(faction, faction2));
									// Add a favor
									KDAddFavor(faction2, amount);
								} else
								if (KDFactionRelation(faction, faction2) > 0.1 && !hurtfactions.includes(faction2)) {
									hurtfactions.push(faction2);
									KinkyDungeonChangeFactionRep(faction2, 0.5 * amount * -KDFactionRelation(faction, faction2));
								}
							}
						}
					}
				}
			} else if (!enemy.summoned && !enemy.Enemy.immobile && !enemy.Enemy.tags.has("temporary")) {
				if (!KDGameData.RespawnQueue) KDGameData.RespawnQueue = [];
				KDGameData.RespawnQueue.push({enemy: enemy.Enemy.name, faction: KDGetFaction(enemy)});
			}
		}

		if (enemy.Enemy && enemy.Enemy.ondeath) {
			for (let o of enemy.Enemy.ondeath) {
				if (o.type == "summon") {
					KinkyDungeonSummonEnemy(enemy.x, enemy.y, o.enemy, o.count, o.range, o.strict);
				} else if (o.type == "dialogue") {
					KDStartDialog(o.dialogue, enemy.Enemy.name, o.click, enemy.personality, enemy);
				} else if (o.type == "spellOnSelf") {
					let spell = KinkyDungeonFindSpell(o.spell, true);
					if (spell) KinkyDungeonCastSpell(enemy.x, enemy.y, spell, undefined, undefined, undefined);
				} else if (o.type == "removeQuest") {
					KDRemoveQuest(o.quest);
				} else if (o.type == "addQuest") {
					KDAddQuest(o.quest);
				}
			}
		}
		KDDropItems(enemy);

		return true;
	} else if (KDHelpless(enemy)) {
		KDDropStolenItems(enemy);
		if (!enemy.droppedItems)
			KDDropItems(enemy);
	}
	return false;
}

/**
 *
 * @param {entity} enemy
 */
function KDDropItems(enemy) {
	if (!enemy.noDrop && (enemy.playerdmg || !enemy.summoned) && !enemy.droppedItems) {
		KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable, enemy.summoned);
		enemy.droppedItems = true;
		if (KDEnemyHasFlag(enemy, "Shop")) {
			let dropped = {x:enemy.x, y:enemy.y, name: "Gold", amount: 100};
			KinkyDungeonGroundItems.push(dropped);
		}

	}
}


/**
 *
 * @param {entity} Enemy
 * @returns {boolean} - If the NPC is eligible to use favors
 */
function KDFavorNPC(Enemy) {
	// Only enemies which are not temporarily allied, or summoned by you, or specifically allied (like angels), are eligible to show up in dialogue
	return Enemy && !Enemy.allied && !Enemy.Enemy.allied;
}

/**
 *
 * @param {entity} Enemy
 * @returns {number} - Gets the favor with the enemy
 */
function KDGetFavor(Enemy) {
	if (KDGameData.Favors)
		return KDGameData.Favors[KDGetFactionOriginal(Enemy)] ? KDGameData.Favors[KDGetFactionOriginal(Enemy)] : 0;
	return 0;
}

/**
 *
 * @param {entity} Enemy
 * @param {number} Amount
 */
function KDChangeFavor(Enemy, Amount) {
	KDModFavor(KDGetFactionOriginal(Enemy), Amount);
}

function KDAddFavor(Faction, Amount) {
	KDModFavor(Faction, Math.abs(Amount));
}
function KDModFavor(Faction, Amount) {
	if (!KDGameData.Favors) KDGameData.Favors = {};
	if (!KDGameData.Favors[Faction]) KDGameData.Favors[Faction] = 0;
	KDGameData.Favors[Faction] = Math.max(KDGameData.Favors[Faction] + Amount, 0);
}

function KinkyDungeonCheckLOS(enemy, player, distance, maxdistance, allowBlind, allowBars) {
	let bs = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (KinkyDungeonStatsChoice.get("KillSquad")) bs += 20;
	if (player.player && enemy.Enemy && enemy.Enemy.playerBlindSight) bs = enemy.Enemy.playerBlindSight;
	return distance <= maxdistance && ((allowBlind && bs >= distance) || KinkyDungeonCheckPath(enemy.x, enemy.y, player.x, player.y, allowBars));
}

function KinkyDungeonTrackSneak(enemy, delta, player) {
	if (!enemy.vp) enemy.vp = 0;
	if (!player.player) return true;
	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	let deltaMult = 1/Math.max(1, (1 + KinkyDungeonSubmissiveMult));
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowDetection")) deltaMult *= KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowDetection"));
	if (KDGameData.Outfit) {
		let outfit = KinkyDungeonGetOutfit(KDGameData.Outfit);
		if (outfit && outfit.visibility)
			deltaMult *= outfit.visibility;
	}
	if (KinkyDungeonStatsChoice.get("Conspicuous")) deltaMult *= KDConspicuousMult;
	else if (KinkyDungeonStatsChoice.get("Stealthy")) deltaMult *= KDStealthyMult;
	enemy.vp = Math.min(sneakThreshold * 2, enemy.vp + delta*deltaMult);
	return (enemy.vp > sneakThreshold);
}

function KinkyDungeonMultiplicativeStat(Stat) {
	if (Stat > 0) {
		return 1 / (1 + Stat);
	}
	if (Stat < 0) {
		return 1 - Stat;
	}

	return 1;
}

function KDNearbyEnemies(x, y, dist) {
	let list = [];
	for (let e of KinkyDungeonEntities) {
		if (KDistEuclidean(x - e.x, y - e.y) <= dist) list.push(e);
	}
	return list;
}

function KinkyDungeonGetRandomEnemyPoint(avoidPlayer, onlyPlayer, Enemy) {
	let tries = 0;

	while (tries < 100) {
		let points = Array.from(KinkyDungeonRandomPathablePoints, ([name, value]) => (value));
		let point = points[Math.floor(points.length * KDRandom())];
		if (point) {
			let X = point.x;//1 + Math.floor(KDRandom()*(KinkyDungeonGridWidth - 1));
			let Y = point.y;//1 + Math.floor(KDRandom()*(KinkyDungeonGridHeight - 1));
			let playerDist = 6;
			let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y});

			if (((!avoidPlayer || Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist)
				&& (!onlyPlayer || Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) <= playerDist))
				&& (!KinkyDungeonPointInCell(X, Y)) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))
				&& KinkyDungeonNoEnemyExceptSub(X, Y, true, Enemy) && (!KinkyDungeonTiles.get(X + "," + Y) || !KinkyDungeonTiles.get(X + "," + Y).OffLimits)) {
				return {x: X, y:Y};
			}
		}
		tries += 1;
	}

	return undefined;
}

function KinkyDungeonGetNearbyPoint(x, y, allowNearPlayer=false, Enemy, Adjacent) {
	let slots = [];
	for (let X = -Math.ceil(1); X <= Math.ceil(1); X++)
		for (let Y = -Math.ceil(1); Y <= Math.ceil(1); Y++) {
			if ((X != 0 || Y != 0) && KinkyDungeonTransparentObjects.includes(KinkyDungeonMapGet(x + X, y + Y))) {
				// We add the slot and those around it
				slots.push({x:x + X, y:y + Y});
				slots.push({x:x + X, y:y + Y});
				slots.push({x:x + X, y:y + Y});
				if (!Adjacent)
					for (let XX = -Math.ceil(1); XX <= Math.ceil(1); XX++)
						for (let YY = -Math.ceil(1); YY <= Math.ceil(1); YY++) {
							if ((Math.abs(X + XX) > 1 || Math.abs(Y + YY) > 1) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x + XX + X, y + YY + Y))) {
								slots.push({x:x + XX + X, y:y + YY + Y});
								slots.push({x:x + XX + X, y:y + YY + Y});
								for (let XXX = -Math.ceil(1); XXX <= Math.ceil(1); XXX++)
									for (let YYY = -Math.ceil(1); YYY <= Math.ceil(1); YYY++) {
										if ((Math.abs(X + XX + XXX) > 2 || Math.abs(Y + YY + YYY) > 2) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x + XX + XXX + X, y + YYY + YY + Y))) {
											slots.push({x:x + XXX + XX + X, y:y + YYY + YY + Y});
										}
									}
							}
						}
			}
		}

	let foundslot = undefined;
	for (let C = 0; C < 100; C++) {
		let slot = slots[Math.floor(KDRandom() * slots.length)];
		if (slot && KinkyDungeonNoEnemyExceptSub(slot.x, slot.y, false, Enemy)
			&& (allowNearPlayer || Math.max(Math.abs(KinkyDungeonPlayerEntity.x - slot.x), Math.abs(KinkyDungeonPlayerEntity.y - slot.y)) > 1.5)
			&& KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(slot.x, slot.y))) {
			foundslot = {x: slot.x, y: slot.y};

			C = 100;
		} else slots.splice(C, 1);
	}
	return foundslot;
}

function KinkyDungeonSetEnemyFlag(enemy, flag, duration) {
	if (!enemy.flags) enemy.flags = {};
	if (enemy.flags[flag]) {
		if (duration == 0) {
			delete enemy.flags[flag];// = undefined;
			return;
		}
		if (enemy.flags[flag] == -1) return;
		if (enemy.flags[flag] < duration) enemy.flags[flag] = duration;
	} else if (duration) enemy.flags[flag] = duration;
}

/**
 *
 * @param {entity} enemy
 * @param {number} delta
 */
function KinkyDungeonTickFlagsEnemy(enemy, delta) {
	if (enemy.flags) {
		for (let f of Object.entries(enemy.flags)) {
			if (f[1] == -1) continue;
			if (f[1] > 0) enemy.flags[f[0]] = f[1] - delta;
			if (f[1] <= 0) delete enemy.flags[f[0]];
		}
	}
}

let KinkyDungeonDamageTaken = false;
let KinkyDungeonTorsoGrabCD = 0;
let KinkyDungeonHuntDownPlayer = false;

/**
 *
 * @param {entity} enemy
 * @returns {boolean}
 */
function KinkyDungeonHasStatus(enemy) {
	return enemy && (enemy.bind > 0 || enemy.slow > 0 || enemy.stun > 0 || enemy.freeze > 0 || enemy.silence > 0 || enemy.slow > 0 || KDBoundEffects(enemy) > 0);
}


/**
 *
 * @param {entity} enemy
 * @returns {boolean}
 */
function KinkyDungeonIsDisabled(enemy) {
	return enemy && (enemy.stun > 0 || enemy.freeze > 0 || KDBoundEffects(enemy) > 3);
}


/**
 *
 * @param {entity} enemy
 * @returns {boolean}
 */
function KinkyDungeonCanCastSpells(enemy) {
	return enemy && (KinkyDungeonIsDisabled(enemy) || enemy.silence > 0);
}

function KDBoundEffects(enemy) {
	if (!enemy.Enemy.bound) return 0;
	if (!enemy.boundLevel) return 0;
	let boundLevel = enemy.boundLevel ? enemy.boundLevel : 0;
	if (KinkyDungeonStatsChoice.get("Rigger") && KDHostile(enemy)) boundLevel *= KDRiggerBindBoost;
	if (boundLevel > enemy.Enemy.maxhp || (enemy.hp <= 0.1*enemy.Enemy.maxhp && boundLevel > enemy.hp)) return 4; // Totally tied
	if (boundLevel > enemy.Enemy.maxhp*0.75) return 3;
	if (boundLevel > enemy.Enemy.maxhp*0.5) return 2;
	if (boundLevel > enemy.Enemy.maxhp*0.25) return 1;
	return 0;
}


function KinkyDungeonUpdateEnemies(delta, Allied) {
	let tickAlertTimer = false;
	let tickAlertTimerFactions = [];
	let visionMod = 1.0;
	let defeat = false;

	if (KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]]) {
		if (KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].brightness) {
			visionMod = Math.min(1.0, Math.max(0.5, KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]].brightness / 8));
		}
	}

	if (Allied) {
		let KinkyDungeonSummons = 0;
		for (let i = KinkyDungeonEntities.length-1; i >= 0; i--) {
			let enemy = KinkyDungeonEntities[i];
			if (KDAllied(enemy) && enemy.summoned && enemy.Enemy.allied && !enemy.Enemy.noCountLimit && (!enemy.lifetime || enemy.lifetime > 999)) {
				KinkyDungeonSummons += 1;
				if (KinkyDungeonSummons > KinkyDungeonSummonCount) {
					enemy.hp -= Math.max(0.1 * enemy.hp) + 1;
				}
			}
		}
	} else {
		if (KinkyDungeonTorsoGrabCD > 0) KinkyDungeonTorsoGrabCD -= 1;

		if (KDGameData.KinkyDungeonLeashedPlayer > 0) {
			KDGameData.KinkyDungeonLeashedPlayer -= 1;

			let nearestJail = KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
			if (nearestJail) {
				let xx = nearestJail.x;
				let yy = nearestJail.y;
				let jaildoor = KDGetJailDoor(xx, yy).tile;
				if (jaildoor && jaildoor.Type == "Door") {
					jaildoor.Lock = undefined;
				}
			}

		}
		KinkyDungeonUpdateFlags(delta);
	}

	// Loop 1
	for (let enemy of KinkyDungeonEntities) {
		if ((Allied && KDAllied(enemy)) || (!Allied && !KDAllied(enemy))) {
			let master = KinkyDungeonFindMaster(enemy).master;
			if (master && enemy.aware) master.aware = true;
			if (master && master.aware) enemy.aware = true;
			if (enemy.Enemy.master && enemy.Enemy.master.dependent && !master) enemy.hp = -10000;

			if (!enemy.castCooldown) enemy.castCooldown = 0;
			if (enemy.castCooldown > 0) {
				enemy.castCooldown = Math.max(0, enemy.castCooldown-delta);
				if (enemy.castCooldown <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "specialCD"});
			}
			if (!enemy.castCooldownSpecial) enemy.castCooldownSpecial = 0;
			if (enemy.castCooldownSpecial > 0) {
				enemy.castCooldownSpecial = Math.max(0, enemy.castCooldownSpecial-delta);
				if (enemy.castCooldownSpecial <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "castCooldownSpecial"});
			}

			if (enemy.Enemy.specialCharges && enemy.specialCharges <= 0) enemy.specialCD = 999;
			KinkyDungeonTickFlagsEnemy(enemy, delta);
			if (enemy.specialCD > 0) {
				enemy.specialCD -= delta;
				if (enemy.specialCD <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "specialCD"});
			}
			if (enemy.slow > 0) {
				enemy.slow -= delta;
				if (enemy.slow <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "slow"});
			}
			if (enemy.boundLevel > 0 && !(enemy.stun > 0 || enemy.freeze > 0) && (enemy.hp > enemy.Enemy.maxhp * 0.1)) {
				let SR = KDGetEnemyStruggleRate(enemy);
				enemy.boundLevel = Math.max(0, enemy.boundLevel - delta * SR);

				if (SR <= 0) {
					KDAddThought(enemy.id, "GiveUp", 5, 4);
				} else {
					KDAddThought(enemy.id, "Struggle", 1, 6);
				}


				if (enemy.boundLevel <= 0) {
					KDAddThought(enemy.id, "Annoyed", 5, 1);
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "boundLevel"});
				}
			}
			if (enemy.Enemy.rage) enemy.rage = 9999;
			if (enemy.bind > 0) {
				enemy.bind -= delta;
				if (enemy.bind <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "bind"});
			}
			if (enemy.rage > 0) {
				enemy.rage -= delta;
				if (enemy.rage <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "rage"});
			}
			if (enemy.hostile > 0) {
				enemy.hostile -= delta;
				if (enemy.hostile <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "hostile"});
			}
			if (enemy.allied > 0 && enemy.allied < 9000) {
				enemy.allied -= delta;
				if (enemy.allied <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "allied"});
			}
			if (enemy.ceasefire > 0 && enemy.ceasefire < 9000) {
				enemy.ceasefire -= delta;
				if (enemy.ceasefire <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "ceasefire"});
			}
			if (enemy.blind > 0) {
				enemy.blind -= delta;
				if (enemy.blind <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "blind"});
			}
			if (enemy.playWithPlayer > 0) {
				enemy.playWithPlayer -= delta;
				if (enemy.playWithPlayer <= 0) {
					KDAddThought(enemy.id, "Happy", 5, 1);
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "playWithPlayer"});
				}
			}
			if (enemy.playWithPlayerCD > 0) {
				enemy.playWithPlayerCD -= delta;
				if (enemy.playWithPlayerCD <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "playWithPlayerCD"});
			}
			if (enemy.silence > 0) {
				enemy.silence -= delta;
				if (enemy.silence <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "silence"});
			}
			if (enemy.disarmflag > 0 && enemy.Enemy.disarm && KinkyDungeonLastAction != "Attack") {
				enemy.disarmflag = Math.max(0, enemy.disarmflag - enemy.Enemy.disarm);
				if (enemy.disarmflag <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "disarmflag"});
			}
			if (enemy.stun > 0 || enemy.freeze > 0) {
				enemy.warningTiles = [];
				enemy.disarmflag = 0;
				if (enemy.stun > 0 && enemy.stun <= delta)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "stun"});
				if (enemy.freeze > 0 && enemy.freeze <= delta)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "freeze"});
				if (enemy.stun > 0) enemy.stun -= delta;
				if (enemy.freeze > 0) enemy.freeze -= delta;
			} else if (enemy.channel > 0) {
				enemy.warningTiles = [];
				if (enemy.channel > 0) enemy.channel -= delta;

				if (enemy.channel <= 0)
					KinkyDungeonSendEvent("enemyStatusEnd", {enemy: enemy, status: "channel"});
			}
		}
	}
	// Loop 2
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		if ((Allied && KDAllied(enemy)) || (!Allied && !KDAllied(enemy))) {
			if (enemy.aware && (enemy.lifetime == undefined || enemy.lifetime > 9000) && !enemy.Enemy.tags.has("temporary") && !enemy.Enemy.tags.has("peaceful")) {
				if (enemy.hostile > 0 && enemy.hostile < 9000 && (KDGameData.PrisonerState == 'parole' || KDGameData.PrisonerState == 'jail')) {
					tickAlertTimer = true;
					if (KDistChebyshev(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y) < 9 && !tickAlertTimerFactions.includes(KDGetFaction(enemy))) {
						tickAlertTimerFactions.push(KDGetFaction(enemy));
					}
				} else if (KinkyDungeonAggressive(enemy)) {
					tickAlertTimer = true;
					if (KDistChebyshev(KinkyDungeonPlayerEntity.x - enemy.x, KinkyDungeonPlayerEntity.y - enemy.y) < 9 && !tickAlertTimerFactions.includes(KDGetFaction(enemy))) {
						tickAlertTimerFactions.push(KDGetFaction(enemy));
					}
				}
			}
			if (enemy.vulnerable > 0) enemy.vulnerable -= delta;
			else enemy.vulnerable = 0;
			if (!(KDGameData.KinkyDungeonPenance && KinkyDungeonAngel()) || enemy == KinkyDungeonAngel()) {
				// Delete the enemy
				if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1; continue;}

				let player = (!KinkyDungeonAngel()) ? KinkyDungeonNearestPlayer(enemy, false, true, enemy.Enemy.visionRadius ? (enemy.Enemy.visionRadius + ((enemy.lifetime > 0 && enemy.Enemy.visionSummoned) ? enemy.Enemy.visionSummoned : 0)) : 0) : KinkyDungeonPlayerEntity;


				if (enemy.Enemy.convertTiles) {
					let tile = KinkyDungeonMapGet(enemy.x, enemy.y);
					for (let c of enemy.Enemy.convertTiles) {
						if (c.from == tile && c.to) {
							KinkyDungeonMapSet(enemy.x, enemy.y, c.to);
						}
					}
				}
				if (enemy.Enemy.triggersTraps) {
					KinkyDungeonHandleTraps(enemy.x, enemy.y);
				}

				let idle = true;
				let bindLevel = KDBoundEffects(enemy);

				if (!(
					enemy.stun > 0
					|| enemy.freeze > 0
					|| bindLevel > 3
					|| enemy.channel > 0
				)) {
					let start = performance.now();

					let playerItems = [];
					for (let inv of KinkyDungeonAllWeapon()) {
						if (inv.name != "Unarmed")
							playerItems.push(inv);
					}
					for (let inv of KinkyDungeonAllConsumable()) {
						playerItems.push(inv);
					}
					let ret = KinkyDungeonEnemyLoop(enemy, player, delta, visionMod, playerItems);
					idle = ret.idle;
					if (ret.defeat) {
						defeat = true;
					}
					if (enemy.items) {
						let light = KinkyDungeonLightGet(enemy.x, enemy.y);
						if (light == 0 && !enemy.aware && KDRandom() < 0.2) {
							for (let item of enemy.items) {
								if (KinkyDungeonFindWeapon(item)) {
									KinkyDungeonAddLostItems([{name: item, type: Weapon}], false);
								} else if (KinkyDungeonFindConsumable(item)) {
									KinkyDungeonAddLostItems([{name: item, type: Consumable, quantity: 1}], false);
								}
							}
							enemy.items = undefined;
						}
					}
					let end = performance.now();
					if (KDDebug)
						console.log(`Took ${end - start} milliseconds to run loop for enemy ${enemy.Enemy.name}`);
				} else {
					// These happen when an enemy is disabled
					enemy.disarmflag = 0;
				}

				if (idle) {
					// These happen when an enemy is disabled or not doing anything
					enemy.movePoints = 0;
					enemy.attackPoints = 0;
					enemy.warningTiles = [];
				}

				if (enemy.vp > 0 && (!enemy.path || enemy.path.length < 4)) {
					let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
					if (enemy.vp > sneakThreshold * 2 && !enemy.aware) {
						let sneak = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
						if (sneak > 0)
							enemy.vp = Math.max(sneakThreshold + 1, Math.max(Math.min(enemy.vp, sneakThreshold), enemy.vp * 0.7 - 0.1));
					}
					enemy.vp = Math.max(0, enemy.vp - 0.1);
				}

				// Delete the enemy
				if (KinkyDungeonEnemyCheckHP(enemy, E)) { E -= 1;}
				if (enemy.Enemy.regen) enemy.hp = Math.min(enemy.Enemy.maxhp, enemy.hp + enemy.Enemy.regen * delta);
				if (enemy.Enemy.lifespan || enemy.lifetime != undefined) {
					if (enemy.lifetime == undefined) enemy.lifetime = enemy.Enemy.lifespan;
					if (enemy.lifetime <= 9000)
						enemy.lifetime -= delta;
					if (enemy.lifetime <= 0) enemy.hp = -10000;
				}
			}
		}
	}


	if (!Allied) {
		// vulnerability calc
		for (let i = KinkyDungeonEntities.length-1; i >= 0; i--) {
			let enemy = KinkyDungeonEntities[i];
			if (KDHostile(enemy)) {
				if (enemy.fx && enemy.fy) {
					if (enemy.x * 2 - enemy.fx == KinkyDungeonPlayerEntity.x && enemy.y * 2 - enemy.fy == KinkyDungeonPlayerEntity.y) {
						KDAddThought(enemy.id, "Annoyed", 4, 1);
						enemy.vulnerable = Math.max(enemy.vulnerable, 1);
					}
				}
			}
			// Alert enemies if youve aggroed one
			if (!KDAllied(enemy) && !(enemy.ceasefire > 0)) {
				if (!(enemy.hostile > 0) && tickAlertTimer && !KinkyDungeonAggressive(enemy) && !enemy.Enemy.tags.has("peaceful") && (enemy.vp > 0.5 || enemy.lifetime < 900 || (!KDHostile(enemy) && KDistChebyshev(enemy.x - KinkyDungeonPlayerEntity.x, enemy.y - KinkyDungeonPlayerEntity.y) < 7))) {
					for (let f of tickAlertTimerFactions) {
						if ((KDGetFaction(enemy) != "Player") && (
							(KDFactionAllied(f, enemy) && KDFactionRelation("Player", enemy) <= 0.9)
							|| (KDFactionRelation(f, enemy) >= 0.51 && KDFactionRelation("Player", enemy) <= 0.4)
							|| (KDFactionRelation(f, enemy) >= 0.39 && KDFactionRelation("Player", enemy) <= 0.25)
							|| (KDFactionRelation(f, enemy) >= 0.25 && KDFactionRelation("Player", enemy) <= -0.1)
							|| (KDFactionRelation(f, enemy) >= 0.1 && KDFactionRelation("Player", enemy) <= -0.25))) {
							enemy.hostile = KDMaxAlertTimer;
						}
					}
				}
			}
		}

		let alertingFaction = false;
		for (let f of tickAlertTimerFactions) {
			if (KDFactionRelation("Jail", f) > -0.01) {
				alertingFaction = true;
			}
		}
		if (tickAlertTimer && (KDGameData.PrisonerState == 'parole' || KDGameData.PrisonerState == 'jail') && alertingFaction) {
			if (KDGameData.AlertTimer < 3*KDMaxAlertTimer) KDGameData.AlertTimer += delta;
		} else if (KDGameData.AlertTimer > 0) {
			KDGameData.AlertTimer -= delta * 3;
		}
		if (KDGameData.AlertTimer >= KDMaxAlertTimer) {
			KinkyDungeonStartChase(undefined, "Alert");
		}

		KinkyDungeonHandleJailSpawns(delta);
		KinkyDungeonHandleWanderingSpawns(delta);
		KinkyDungeonAlert = 0;
	}

	if (defeat) {
		KinkyDungeonDefeat(KinkyDungeonFlags.has("LeashToPrison"));
	}

}

/**
 *
 * @param {entity} enemy
 * @returns {string}
 */
function KDGetAI(enemy) {
	if (enemy.AI) return enemy.AI;
	else return enemy.Enemy.AI;
}

/**
 * @type {Map<number, {name: string, priority: number, duration: number, index: number}>}
 */
let KDThoughtBubbles = new Map();

function KDAddThought(id, name, priority, duration) {
	let pri = -1;
	let n = "";
	let i = 0;
	let d = 1;
	if (KDThoughtBubbles.has(id)) {
		pri = KDThoughtBubbles.get(id).priority;
		n = KDThoughtBubbles.get(id).name;
		d = KDThoughtBubbles.get(id).duration;
		i = KDThoughtBubbles.get(id).index;
	}
	// Different name means the bubble is refreshed
	if (priority > pri || (n != name && KinkyDungeonCurrentTick > d + i) || (n != name && priority >= pri)) {
		KDThoughtBubbles.set(id, {
			name: name,
			priority: priority,
			duration: duration,
			index: KinkyDungeonCurrentTick,
		});
	}
}

/**
 *
 * @param {entity} enemy
 * @param {*} player
 * @param {number} delta
 * @param {number} visionMod
 * @param {item[]} playerItems
 * @returns {{idle: boolean, defeat: boolean}}
 */
function KinkyDungeonEnemyLoop(enemy, player, delta, visionMod, playerItems) {
	let defeat = false;
	let idle = true;
	let moved = false;
	let ignore = false;
	let followRange = enemy.Enemy.followRange;
	let visionRadius = enemy.Enemy.visionRadius ? (enemy.Enemy.visionRadius + ((enemy.lifetime > 0 && enemy.Enemy.visionSummoned) ? enemy.Enemy.visionSummoned : 0)) : 0;
	let AI = enemy.AI ? enemy.AI : enemy.Enemy.AI;
	if ((AI == "guard" || AI == "looseguard") && !enemy.aware) {
		visionMod *= 0.7;
	}
	if (visionMod && visionRadius > 1.5) visionRadius = Math.max(1.5, visionRadius * visionMod);
	let chaseRadius = 8 + (Math.max(followRange * 2, 0)) + 2*Math.max(visionRadius ? visionRadius : 0, enemy.Enemy.blindSight ? enemy.Enemy.blindSight : 0);
	let blindSight = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (KinkyDungeonStatsChoice.get("KillSquad")) {
		visionRadius *= 2;
		chaseRadius *= 2;
		blindSight += 20;
		if (blindSight > visionRadius) {
			visionRadius = blindSight;
		}
		if (blindSight > chaseRadius) {
			chaseRadius = blindSight;
		}
	}
	let ignoreLocks = enemy.Enemy.keys;
	let harmless = (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonCanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1;

	let playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));

	let leashing = enemy.Enemy.tags.has("leashing") && KDFactionRelation(KDGetFaction(enemy), "Jail") > -0.1;
	// Check if the enemy ignores the player
	if (player.player && !KDAllied(enemy)) {
		if (playerDist < 1.5 && KinkyDungeonAllRestraint().some((r) => {return KDRestraint(r).ignoreNear;})) ignore = true;
		if (!leashing && !KinkyDungeonHasStamina(1.1) && KinkyDungeonAllRestraint().some((r) => {return KDRestraint(r).ignoreIfNotLeash;})) ignore = true;

		if (enemy.Enemy.tags.has("ignorenoSP") && !KinkyDungeonHasStamina(1.1)) ignore = true;
		if ((KDGetFaction(enemy) == "Ambush" || enemy.Enemy.tags.has("ignoreharmless")) && (!enemy.warningTiles || enemy.warningTiles.length == 0)
			&& harmless && (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoretiedup") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && enemy.lifetime == undefined
			&& !KinkyDungeonPlayer.CanInteract() && !KinkyDungeonCanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonSlowLevel > 1
			&& (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoregagged") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && enemy.lifetime == undefined
			&& !KinkyDungeonCanTalk()
			&& (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.tags.has("ignoreboundhands") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && enemy.lifetime == undefined
			&& (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanInteract()
			&& (!enemy.Enemy.ignorechance || KDRandom() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1))) ignore = true;
		if (enemy.Enemy.ignoreflag) {
			for (let f of enemy.Enemy.ignoreflag) {
				if (KinkyDungeonFlags.get(f)) ignore = true;
			}
		}
		// Instead of leashing we ignore
		if (enemy.Enemy.tags.has("leashing") && !leashing && !KinkyDungeonHasStamina(1.1) && !KinkyDungeonPlayer.CanInteract()) {
			ignore = true;
		}
		if (!KinkyDungeonAggressive(enemy) && !(enemy.rage > 0) && !enemy.Enemy.alwaysHostile && (!enemy.playWithPlayer || !player.player)) ignore = true;
	}

	let MovableTiles = KinkyDungeonMovableTilesEnemy;
	let AvoidTiles = "g";
	if (enemy.Enemy.tags && enemy.Enemy.tags.has("opendoors")) MovableTiles = KinkyDungeonMovableTilesSmartEnemy;
	if (enemy.Enemy.ethereal) {
		AvoidTiles = "";
		MovableTiles = MovableTiles + "1X";
	} else if (enemy.Enemy.squeeze && KDGameData.KinkyDungeonLeashingEnemy != enemy.id) {
		MovableTiles = MovableTiles + 'b';
		AvoidTiles = "";
	}

	let attack = enemy.Enemy.attack;
	let range = enemy.Enemy.attackRange;
	let width = enemy.Enemy.attackWidth;
	let accuracy = enemy.Enemy.accuracy ? enemy.Enemy.accuracy : 1.0;
	let vibe = false;
	let damage = enemy.Enemy.dmgType;
	let power = enemy.Enemy.power;

	let targetRestraintLevel = 0.3 + (enemy.aggro ? enemy.aggro : 0);
	if (enemy.aggro > 0 && delta > 0) enemy.aggro = enemy.aggro * 0.95;
	if (KinkyDungeonStatsChoice.has("NoWayOut") || KinkyDungeonCanPlay(enemy) || enemy.hp < enemy.Enemy.maxhp * 0.5) targetRestraintLevel = 999;
	let addLeash = leashing && KinkyDungeonSubmissiveMult >= targetRestraintLevel && (!KinkyDungeonGetRestraintItem("ItemNeck") || !KinkyDungeonGetRestraintItem("ItemNeckRestraints"));

	if (enemy.Enemy.tags && leashing && (!KinkyDungeonHasStamina(1.1) || addLeash)) {
		followRange = 1;
		if (!attack.includes("Bind")) attack = "Bind" + attack;
	}

	let refreshWarningTiles = false;

	let hitsfx = (enemy.Enemy && enemy.Enemy.hitsfx) ? enemy.Enemy.hitsfx : "";
	if (KinkyDungeonAlert && playerDist < KinkyDungeonAlert) {
		if (!enemy.aware && KinkyDungeonAggressive(enemy)) KDAddThought(enemy.id, "Aware", 3, 3);
		enemy.aware = true;
		if (!enemy.aggro) enemy.aggro = 0;
		enemy.aggro += 0.1;
	}
	if (enemy.Enemy.specialAttack && (!enemy.specialCD || enemy.specialCD <= 0) && (!enemy.Enemy.specialMinrange || playerDist > enemy.Enemy.specialMinrange)) {
		attack = attack + enemy.Enemy.specialAttack;
		refreshWarningTiles = !enemy.usingSpecial;
		enemy.usingSpecial = true;
		if (enemy.Enemy && enemy.Enemy.hitsfxSpecial) hitsfx = enemy.Enemy.hitsfxSpecial;

		if (enemy.Enemy.specialRemove) attack = attack.replace(enemy.Enemy.specialRemove, "");
		if (enemy.Enemy.specialRange && enemy.usingSpecial) {
			range = enemy.Enemy.specialRange;
		}
		if (enemy.Enemy.specialWidth && enemy.usingSpecial) {
			width = enemy.Enemy.specialWidth;
		}
		if (enemy.Enemy.specialPower && enemy.usingSpecial) {
			power = enemy.Enemy.specialPower;
		}
		if (enemy.Enemy.specialDamage && enemy.usingSpecial) {
			damage = enemy.Enemy.specialDamage;
		}
	}

	let addMoreRestraints = KinkyDungeonStatsChoice.has("NoWayOut") || !leashing || (attack.includes("Bind") && (KinkyDungeonSubmissiveMult < targetRestraintLevel || !(KinkyDungeonIsArmsBound() || KinkyDungeonIsHandsBound())));

	if (!enemy.Enemy.attackWhileMoving && range > followRange) {
		followRange = range;
	}
	if (player.player && enemy.Enemy && enemy.Enemy.playerFollowRange) followRange = enemy.Enemy.playerFollowRange;

	if (!enemy.warningTiles) enemy.warningTiles = [];
	let canSensePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, true, true);
	let canSeePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, false, false);
	let canSeePlayerChase = enemy.aware ? KinkyDungeonCheckLOS(enemy, player, playerDist, chaseRadius, false, false) : false;
	let canSeePlayerMedium = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius/1.4, false, true);
	let canSeePlayerClose = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius/2, false, true);
	let canSeePlayerVeryClose = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius/3, false, true);
	let canShootPlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, false, true);

	if (KinkyDungeonLastTurnAction && canSeePlayer) {
		if (!enemy.aggro) enemy.aggro = 0;
		enemy.aggro += KinkyDungeonLastTurnAction == "Struggle" ? 0.1 :
			(KinkyDungeonLastTurnAction == "Spell" ? 0.3 :
				(KinkyDungeonAlert ? 0.1 :
					0.01));
	}

	if (enemy.Enemy.projectileAttack && (!canShootPlayer || !KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y))) followRange = 1;

	if (!KinkyDungeonAggressive(enemy) && !enemy.Enemy.alwaysHostile && !(enemy.rage > 0) && canSeePlayer && player.player && !KDAllied(enemy)
		&& (!KinkyDungeonJailGuard() || (KinkyDungeonJailGuard().CurrentAction !== "jailLeashTour" && (!KinkyDungeonPlayerInCell() || KinkyDungeonLastTurnAction == "Struggle" || KinkyDungeonLastAction == "Struggle")))) {
		if (enemy.Enemy.tags.has("jailer") || enemy.Enemy.tags.has("jail")) {
			if (KinkyDungeonPlayer.CanInteract() && !KDEnemyHasFlag(enemy, "Shop")) KinkyDungeonAggroAction('unrestrained', {enemy: enemy});
			else if ((KinkyDungeonLastTurnAction == "Struggle" || KinkyDungeonLastAction == "Struggle")) KinkyDungeonAggroAction('struggle', {enemy: enemy});
			else if (!KinkyDungeonPlayerInCell() && KDGameData.PrisonerState == 'jail') KinkyDungeonAggroAction('jailbreak', {enemy: enemy});
		}
		ignore = !KinkyDungeonAggressive(enemy) && (!enemy.playWithPlayer || !player.player);
	}

	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak")) sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");

	let playAllowed = false;
	let startedDialogue = false;
	let chance = 0.05;
	if (KDGameData.JailKey) chance += 0.2;
	if (playerDist < 1.5) chance += 0.1;
	if (enemy.aware) chance += 0.1;
	if (KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.unarmed) {
		chance += 0.25;
	}
	if (playerItems || KinkyDungeonRedKeys > 0) {
		chance += 0.2;
		if (playerItems.length > 6) {
			chance += 0.5;
		}
	}
	if (!enemy.personality) enemy.personality = KDGetPersonality(enemy);

	if (playerDist < enemy.Enemy.visionRadius / 2) chance += 0.1;
	if (KDEnemyHasFlag(enemy, "Shop")) chance = KDStrictPersonalities.includes(enemy.personality) ?  0.01 : 0;
	if (KinkyDungeonCanPlay(enemy) && !KinkyDungeonFlags.get("NPCCombat") && !enemy.Enemy.alwaysHostile && !(enemy.rage > 0) && !(enemy.hostile > 0) && player.player && canSeePlayer && (enemy.vp > sneakThreshold || enemy.aware || (!KDHostile(enemy) && !KDAllied(enemy))) && (enemy.Enemy.tags.has("jailer") || enemy.Enemy.tags.has("jail") || enemy.Enemy.playLine) && !KinkyDungeonInJail()) {
		playAllowed = true;
		if (!(enemy.playWithPlayerCD > 0) && !(enemy.playWithPlayer > 0) && KDRandom() < chance && !KDAllied(enemy)) {
			enemy.playWithPlayer = 8 + Math.floor(KDRandom() * (5 * Math.min(5, Math.max(enemy.Enemy.attackPoints, enemy.Enemy.movePoints))));
			enemy.playWithPlayerCD = enemy.playWithPlayer * 2.5;
			KDAddThought(enemy.id, "Play", 4, enemy.playWithPlayer);
			let index = Math.floor(Math.random() * 3);
			let suff = enemy.Enemy.playLine ? enemy.Enemy.playLine : "";
			KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonRemindJailPlay" + suff + index).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 4);
		}
	}

	if (KinkyDungeonCanPutNewDialogue() && playerDist <= KinkyDungeonMaxDialogueTriggerDist && player.player) {
		let WeightTotal = 0;
		let Weights = [];
		for (let e of Object.entries(KDDialogueTriggers)) {
			let trigger = e[1];
			let weight = 0;
			if ((!trigger.blockDuringPlaytime || enemy.playWithPlayer < 1 || !enemy.playWithPlayer)
				&& (!trigger.noAlly || !KDAllied(enemy))
				&& (!trigger.playRequired || playAllowed)
				&& (!trigger.noCombat || !KinkyDungeonFlags.get("NPCCombat"))
				&& (!trigger.nonHostile || !KinkyDungeonAggressive(enemy))
				&& (!trigger.allowedPrisonStates || trigger.allowedPrisonStates.includes(KDGameData.PrisonerState))
				&& (!trigger.allowedPersonalities || trigger.allowedPersonalities.includes(enemy.personality))) {
				let end = false;
				if (trigger.excludeTags) {
					for (let tt of trigger.excludeTags) {
						if (enemy.Enemy.tags.has(tt)) {
							end = true;
							break;
						}
					}
				}
				if (!end && trigger.requireTags) {
					for (let tt of trigger.requireTags) {
						if (!enemy.Enemy.tags.has(tt)) {
							end = true;
							break;
						}
					}
				}
				let hastag = !trigger.requireTagsSingle;
				if (!end && trigger.requireTagsSingle) {
					for (let tt of trigger.requireTagsSingle) {
						if (enemy.Enemy.tags.has(tt)) {
							hastag = true;
							break;
						}
					}
				}
				if (!hastag) end = true;
				if (!end && (!trigger.prerequisite || trigger.prerequisite(enemy, playerDist))) {
					weight =  trigger.weight(enemy, playerDist);
				}
			}
			if (weight > 0) {
				Weights.push({t: trigger, weight: WeightTotal});
				WeightTotal += weight;
			}
		}

		let selection = KDRandom() * WeightTotal;

		for (let L = Weights.length - 1; L >= 0; L--) {
			if (selection > Weights[L].weight) {
				KDStartDialog(Weights[L].t.dialogue,enemy.Enemy.name, true, enemy.personality, enemy);
				startedDialogue = true;
			}
		}
	}

	if (!KinkyDungeonAggressive(enemy) && player.player && enemy.playWithPlayer) ignore = false;

	let sneakMult = 0.25;
	if (canSeePlayerMedium) sneakMult += 0.45;
	if (canSeePlayerClose) sneakMult += 0.25;
	if (canSeePlayerVeryClose) sneakMult += 0.5;
	if (KinkyDungeonAlert > 0) sneakMult += 1;
	if ((canSensePlayer || canSeePlayer || canShootPlayer || canSeePlayerChase) && KinkyDungeonTrackSneak(enemy, delta * (sneakMult), player)) {
		if (!KDEnemyHasFlag(enemy, "StayHere")) {
			if (KDEnemyHasFlag(enemy, "Defensive")) {
				enemy.gx = KinkyDungeonPlayerEntity.x;
				enemy.gy = KinkyDungeonPlayerEntity.y;
			} else if (!ignore && (KinkyDungeonAggressive(enemy) || enemy.playWithPlayer || !KDEnemyHasFlag(enemy, "NoFollow"))) {
				enemy.gx = player.x;
				enemy.gy = player.y;
			}
		}
		if (canSensePlayer || canSeePlayer || canShootPlayer) {
			if (!enemy.aware && KinkyDungeonAggressive(enemy)) KDAddThought(enemy.id, "Aware", 3, 3);
			enemy.aware = true;
			if (KDHostile(enemy) && !enemy.rage && !enemy.Enemy.tags.has("minor")) {
				for (let e of KinkyDungeonEntities) {
					if (KDHostile(e) && !enemy.rage && e != enemy && KDistChebyshev(e.x - enemy.x, e.y - enemy.y) <= KinkyDungeonEnemyAlertRadius) {
						if (!e.aware) KDAddThought(e.id, "Confused", 3, 3);
						e.aware = true;
					}
				}
			}
		}
	}

	let ignoreRanged = canShootPlayer && KinkyDungeonAllRestraint().some((r) => {return KDRestraint(r).ignoreSpells;});
	if (ignoreRanged && leashing) followRange = 1;

	let kite = false;
	let kiteChance = enemy.Enemy.kiteChance ? enemy.Enemy.kiteChance : 0.75;
	if (canSeePlayer && (!player.player || KinkyDungeonAggressive(enemy)) && enemy.Enemy && enemy.Enemy.kite && !enemy.usingSpecial && (!player.player || KinkyDungeonHasStamina(1.1)) && (enemy.attackPoints <= 0 || enemy.Enemy.attackWhileMoving) && playerDist <= enemy.Enemy.kite && (KDHostile(enemy) || !player.player)) {
		if (!enemy.Enemy.kiteOnlyWhenDisabled || !(KinkyDungeonStatBlind < 0 || KinkyDungeonStatBind > 0 || KinkyDungeonStatFreeze > 0 || KinkyDungeonSlowMoveTurns > 0 || KDGameData.SleepTurns > 0))
			if (!enemy.Enemy.noKiteWhenHarmless || !harmless)
				if (kiteChance >= 1 || KDRandom() < kiteChance)
					if (!ignoreRanged)
						kite = true;
	}

	if (!KinkyDungeonAggressive(enemy) && player.player && (enemy.playWithPlayer || KDAllied(enemy))) followRange = 1;

	if ((AI == "guard" || AI == "looseguard") && (!enemy.gxx || !enemy.gyy)) {
		enemy.gxx = enemy.gx;
		enemy.gyy = enemy.gy;
	}
	// Movement loop
	if (!startedDialogue) {
		if ((AI == "ambush" && enemy.Enemy.wanderTillSees && !enemy.aware && !enemy.ambushtrigger)) {
			idle = true;
			if (ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, enemy.attackPoints < 1 || !enemy.Enemy.projectileAttack, false) || kite)
				for (let T = 0; T < 8; T++) { // try 8 times
					let dir = KinkyDungeonGetDirection(10*(KDRandom()-0.5), 10*(KDRandom()-0.5));
					if (MovableTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && (T > 5 || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)))
						&& KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
						if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
						idle = false;
						break;
					}
				}
		} else if (
			(AI == "guard" || AI == "looseguard" || AI == "patrol" || AI == "wander" || AI == "hunt" || (AI == "ambush" && enemy.ambushtrigger))
			&& (
				(enemy.Enemy.attackWhileMoving && enemy != KinkyDungeonLeashingEnemy())
				|| ignore
				|| !(KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, enemy.attackPoints < 1 || !enemy.Enemy.projectileAttack, false) && enemy.aware)
				|| kite
			)
		) {
			if (!enemy.gx) enemy.gx = enemy.x;
			if (!enemy.gy) enemy.gy = enemy.y;

			idle = true;
			let patrolChange = false;
			let followPlayer = false;
			let dontFollow = false;
			if (KDAllied(enemy) && player.player) {
				if (!KDEnemyHasFlag(enemy, "NoFollow") && !KDEnemyHasFlag(enemy, "StayHere")) {
					followPlayer = true;
				} else {
					dontFollow = true;
					if (enemy.gx == player.x && enemy.gy == player.y && !KDEnemyHasFlag(enemy, "StayHere")) {
						//enemy.gx = undefined;
						//enemy.gy = undefined;
					}
				}
			} else {
				if (KDEnemyHasFlag(enemy, "Defensive") && !KDEnemyHasFlag(enemy, "StayHere")) {
					enemy.gx = KinkyDungeonPlayerEntity.x;
					enemy.gy = KinkyDungeonPlayerEntity.y;
				}
				if (KDEnemyHasFlag(enemy, "StayHere") || KDEnemyHasFlag(enemy, "Defensive")) dontFollow = true;
				if (KDHostile(enemy)) {
					KinkyDungeonSetEnemyFlag(enemy, "StayHere", 0);
					KinkyDungeonSetEnemyFlag(enemy, "Defensive", 0);
				} else if (!KDAllied(enemy)) {
					KinkyDungeonSetEnemyFlag(enemy, "Defensive", 0);
				}
			}

			// try 12 times to find a moveable tile, with some random variance
			if (
				AI != "wander"
				&& !ignore
				&& !dontFollow
				&& (enemy.aware || followPlayer)
				&& playerDist <= chaseRadius
				&& (AI != "ambush" || enemy.ambushtrigger || enemy.gx != enemy.x || enemy.gy != enemy.y)) {
				//enemy.aware = true;

				for (let T = 0; T < 12; T++) {
					let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
					let splice = false;
					if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
					if (T >= 8 || (enemy.path && !canSeePlayer) || (!canSeePlayer && !(enemy.Enemy.stopToCast && canShootPlayer))) {
						if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer)) {
							if (!canSeePlayer) {
								if (canShootPlayer) {
									KDAddThought(enemy.id, "Shoot", 4, 2);
								} else if (canSensePlayer) {
									KDAddThought(enemy.id, "Sense", 2, 6);
								} else {
									KDAddThought(enemy.id, "Search", 2, 6);
								}
							}
							enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, false, false, ignoreLocks, MovableTiles); // Give up and pathfind
						} if (enemy.path && enemy.path.length > 0 && Math.max(Math.abs(enemy.path[0].x - enemy.x),Math.abs(enemy.path[0].y - enemy.y)) < 1.5) {
							dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: KDistChebyshev(enemy.path[0].x - enemy.x, enemy.path[0].y - enemy.y)};
							if (!KinkyDungeonNoEnemyExceptSub(enemy.x + dir.x, enemy.y + dir.y, false, enemy)) enemy.path = undefined;
							splice = true;
						} else {
							enemy.path = undefined;
							if (!canSensePlayer) {
								if (enemy.aware) KDAddThought(enemy.id, "Lose", 1, 4);
								enemy.aware = false;
							}

							//dir = KinkyDungeonGetDirectionRandom(0, 0); // Random...
						}
					}
					if (dir.delta > 1.5) {enemy.path = undefined;}
					else if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
						if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
						if (moved && splice && enemy.path) enemy.path.splice(0, 1);
						idle = false;
						break;
					}
				}
			} else if (Math.abs(enemy.x - enemy.gx) > 0 || Math.abs(enemy.y - enemy.gy) > 0)  {
				if (enemy.aware) enemy.path = undefined;
				enemy.aware = false;
				for (let T = 0; T < 8; T++) {
					let dir = KinkyDungeonGetDirectionRandom(enemy.gx - enemy.x, enemy.gy - enemy.y);
					let splice = false;
					if (T > 2 && T < 8) dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10); // Fan out a bit
					if (T >= 8 || enemy.path || !KinkyDungeonCheckPath(enemy.x, enemy.y, enemy.gx, enemy.gy)) {
						if (!enemy.path) enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, enemy.gx, enemy.gy, playerDist > chaseRadius, KDRandom() < 0.5 ? ignore : false, ignoreLocks, MovableTiles); // Give up and pathfind
						if (enemy.path && enemy.path.length > 0) {
							dir = {x: enemy.path[0].x - enemy.x, y: enemy.path[0].y - enemy.y, delta: KDistChebyshev(enemy.path[0].x - enemy.x, enemy.path[0].y - enemy.y)};
							if (!KinkyDungeonNoEnemyExceptSub(enemy.x + dir.x, enemy.y + dir.y, false, enemy)) enemy.path = undefined;
							splice = true;
						} else {
							enemy.path = undefined;
						}
					}
					if (dir.delta > 1.5) {enemy.path = undefined;}
					else if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
						if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y)) moved = true;
						if (moved && splice && enemy.path) enemy.path.splice(0, 1);
						idle = false;
						break;
					} else if (KinkyDungeonPlayerEntity.x == enemy.x + dir.x && KinkyDungeonPlayerEntity.y == enemy.y + dir.y) enemy.path = undefined;
				}
			} else if (Math.abs(enemy.x - enemy.gx) < 2 || Math.abs(enemy.y - enemy.gy) < 2) patrolChange = true;

			if (AI == "patrol" && !followPlayer && !KDEnemyHasFlag(enemy, "StayHere")) {
				let patrolChance = patrolChange ? 0.13 : 0.02;
				if (!enemy.patrolIndex) enemy.patrolIndex = KinkyDungeonNearestPatrolPoint(enemy.x, enemy.y);
				if (KinkyDungeonPatrolPoints[enemy.patrolIndex] && KDRandom() < patrolChance) {

					if (enemy.patrolIndex < KinkyDungeonPatrolPoints.length - 1) enemy.patrolIndex += 1;
					else enemy.patrolIndex = 0;

					let newPoint = KinkyDungeonGetPatrolPoint(enemy.patrolIndex, 1.4, MovableTiles);
					enemy.gx = newPoint.x;
					enemy.gy = newPoint.y;
				}

			}
			if ((AI == "guard" || AI == "looseguard") && !followPlayer && Math.max(Math.abs(enemy.x - enemy.gx), Math.abs(enemy.y - enemy.gy)) < 1.5 && enemy.gxx && enemy.gyy) {
				enemy.gx = enemy.gxx;
				enemy.gy = enemy.gyy;
			}
			if ((AI == "wander" || AI == "hunt" || AI == "looseguard") && !followPlayer && (!enemy.Enemy.allied && !KDEnemyHasFlag(enemy, "StayHere")) && !KDEnemyHasFlag(enemy, "StayHere") && enemy.movePoints < 1 && (!enemy.aware || !KinkyDungeonAggressive(enemy))) {
				if (Math.max(Math.abs(enemy.x - enemy.gx), Math.abs(enemy.y - enemy.gy)) < 1.5 || (!(enemy.vp > 0.05) && (!enemy.path || KDRandom() < 0.1))) {
					let master = KinkyDungeonFindMaster(enemy).master;
					if (KDRandom() < 0.1 && !master && AI != "looseguard") {
						// long distance hunt
						let newPoint = KinkyDungeonGetRandomEnemyPoint(false, enemy.tracking && KinkyDungeonHuntDownPlayer);
						if (newPoint) {
							enemy.gx = newPoint.x;
							enemy.gy = newPoint.y;
						}
					} else {
						if (KinkyDungeonAlert && playerDist < Math.max(4, visionRadius)) {
							enemy.gx = KinkyDungeonPlayerEntity.x;
							enemy.gy = KinkyDungeonPlayerEntity.y;
						} else {
							// Short distance
							let ex = enemy.x;
							let ey = enemy.y;
							let cohesion = enemy.Enemy.cohesion ? enemy.Enemy.cohesion : 0.5;
							let masterCloseness = enemy.Enemy.cohesion ? enemy.Enemy.cohesion : 0.7;
							if (master && KDRandom() < masterCloseness) {
								ex = master.x;
								ey = master.y;
							} else if (KDRandom() < cohesion) {
								let minDist = enemy.Enemy.cohesionRange ? enemy.Enemy.cohesionRange : visionRadius;
								for (let e of KinkyDungeonEntities) {
									if (e == enemy) continue;
									if (['guard', 'ambush'].includes(KDGetAI(enemy))) continue;
									if (enemy.Enemy.clusterWith && !e.Enemy.tags.has(enemy.Enemy.clusterWith)) continue;
									let dist = KDistEuclidean(e.x - enemy.x, e.y - enemy.y);
									if (dist < minDist) {
										minDist = dist;
										let ePoint = KinkyDungeonGetNearbyPoint(ex, ey, false);
										if (ePoint) {
											ex = ePoint.x;
											ey = ePoint.y;
										}
									}
								}
							}
							let newPoint = KinkyDungeonGetNearbyPoint(ex, ey, false);
							if (newPoint && (KDGetFaction(enemy) != "Player" || !KinkyDungeonPointInCell(newPoint.x, newPoint.y))) {
								if (AI != "looseguard" || KinkyDungeonCheckPath(enemy.x, enemy.y, newPoint.x, newPoint.y)) {
									enemy.gx = newPoint.x;
									enemy.gy = newPoint.y;
								}
							}
						}
					}
				}
			}
		}
	}

	if (enemy.usingSpecial && !enemy.specialCD) enemy.specialCD = 0;

	// Attack loop
	playerDist = Math.sqrt((enemy.x - player.x)*(enemy.x - player.x) + (enemy.y - player.y)*(enemy.y - player.y));
	if ((!enemy.Enemy.followLeashedOnly || KDGameData.KinkyDungeonLeashedPlayer < 1 || KDGameData.KinkyDungeonLeashingEnemy == enemy.id)
		&& ((KDHostile(enemy) || (enemy.playWithPlayer && player.player)) || (!player.player && (!player.Enemy || KDHostile(player) || enemy.rage)))
		&& (((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || (playerDist < Math.max(1.5, blindSight) && enemy.vp >= sneakThreshold*0.7)) || (!KDAllied(enemy) && !KDHostile(enemy)))
		&& (AI != "ambush" || enemy.ambushtrigger) && !ignore && (!moved || enemy.Enemy.attackWhileMoving)
		&& (attack.includes("Melee") || (enemy.Enemy.tags && leashing && !KinkyDungeonHasStamina(1.1)))
		&& (!ignoreRanged || playerDist < 1.5)
		&& KinkyDungeonCheckLOS(enemy, player, playerDist, range + 0.5, !enemy.Enemy.projectileAttack, !enemy.Enemy.projectileAttack)) {//Player is adjacent
		idle = false;
		enemy.revealed = true;

		let dir = KinkyDungeonGetDirection(player.x - enemy.x, player.y - enemy.y);

		let moveMult = KDBoundEffects(enemy);
		let attackMult = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackSlow");
		let attackTiles = enemy.warningTiles ? enemy.warningTiles : [dir];
		let ap = (KinkyDungeonMovePoints < 0 && !KinkyDungeonHasStamina(1.1) && KDGameData.KinkyDungeonLeashingEnemy == enemy.id) ? enemy.Enemy.movePoints+moveMult+1 : enemy.Enemy.attackPoints + attackMult;
		if (!KinkyDungeonEnemyTryAttack(enemy, player, attackTiles, delta, enemy.x + dir.x, enemy.y + dir.y, (enemy.usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : ap, undefined, undefined, enemy.usingSpecial, refreshWarningTiles, attack, MovableTiles)) {
			if (enemy.warningTiles.length == 0 || (refreshWarningTiles && enemy.usingSpecial)) {
				let minrange = enemy.Enemy.tilesMinRange ? enemy.Enemy.tilesMinRange : 1;
				if (enemy.usingSpecial && enemy.Enemy.tilesMinRangeSpecial) minrange = enemy.Enemy.tilesMinRangeSpecial;
				if ((!enemy.usingSpecial && enemy.attackPoints > 0) || enemy.specialCD < 1) {
					enemy.fx = undefined;
					enemy.fy = undefined;
					enemy.warningTiles = KinkyDungeonGetWarningTiles(player.x - enemy.x, player.y - enemy.y, range, width, minrange);
					let playerIn = false;
					for (let tile of enemy.warningTiles) {
						if (KinkyDungeonPlayerEntity.x == enemy.x + tile.x && KinkyDungeonPlayerEntity.y == enemy.y + tile.y) {playerIn = true; break;}
					}
					if (!playerIn) {
						enemy.fx = player.x;
						enemy.fy = player.y;
					}
				}
				if (refreshWarningTiles && enemy.usingSpecial) enemy.attackPoints = Math.min(enemy.attackPoints, delta);
			} else {
				let playerIn = false;
				for (let tile of enemy.warningTiles) {
					if (player.x == enemy.x + tile.x && player.y == enemy.y + tile.y) {playerIn = true; break;}
				}
				if (!playerIn) {
					if (enemy.Enemy.specialRange && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
						enemy.specialCD = enemy.Enemy.specialCD;
						if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
						if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
							KDDash(enemy, player, MovableTiles);
						}
					}
					if (enemy.Enemy.specialWidth && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
						enemy.specialCD = enemy.Enemy.specialCD;
						if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
						if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
							KDDash(enemy, player, MovableTiles);
						}
					}
				}
			}

			let playerEvasion = (player.player) ? KinkyDungeonPlayerEvasion()
				: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
			if (playerDist < 1.5 && player.player && attack.includes("Bind") && enemy.Enemy.bound && KDRandom() * accuracy <= playerEvasion && KinkyDungeonMovePoints > -1 && KinkyDungeonTorsoGrabCD < 1 && KinkyDungeonLastAction == "Move") {
				let caught = false;
				for (let tile of enemy.warningTiles) {
					if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
						caught = true;
						break;
					}
				}
				if (caught) {
					let harnessChance = 0;
					let harnessRestraintName = "";
					let list = KinkyDungeonAllRestraint();
					let list2 = [];
					for (let restraint of list) {
						if (KDRestraint(restraint) && KDRestraint(restraint).harness) {
							harnessChance += 1;
							list2.push(KDRestraint(restraint).name);
						}
					}
					let rest = list2[Math.floor(KDRandom() * list2.length)];
					if (rest) harnessRestraintName = rest;

					if (harnessChance > 0) {
						let roll = KDRandom();
						for (let T = 0; T < harnessChance; T++) {
							roll = Math.min(roll, KDRandom());
						}
						if (roll < KinkyDungeonTorsoGrabChance) {
							KinkyDungeonMovePoints = -1;
							let msg = TextGet("KinkyDungeonTorsoGrab").replace("RestraintName", TextGet("Restraint" + harnessRestraintName)).replace("EnemyName", TextGet("Name" + enemy.Enemy.name));

							if (!KinkyDungeonSendTextMessage(5, msg, "yellow", 1))
								KinkyDungeonSendActionMessage(5, msg, "yellow", 1);

							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Grab.ogg", enemy);
							KinkyDungeonTorsoGrabCD = 2;
						}
					}
				}
			}
		} else { // Attack lands!
			enemy.revealed = true;
			let hit = ((enemy.usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : ap) <= 1;
			for (let tile of enemy.warningTiles) {
				if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
					hit = true;
					break;
				}
			}

			let playerEvasion = (player.player) ? KinkyDungeonPlayerEvasion()
				: KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));

			if (hit) {
				if (player.player)
					KinkyDungeonTickBuffTag(KinkyDungeonPlayerBuffs, "incomingHit", 1);
				else
					KinkyDungeonTickBuffTag(player.buffs, "incomingHit", 1);
			}

			let missed = KDRandom() > playerEvasion;
			let preData = {
				attack: attack,
				enemy: enemy,
				damagetype: damage,
				attacker: enemy,
				target: player,
				missed: missed,
				hit: hit,
			};
			KinkyDungeonSendEvent("beforeAttack", preData);

			if (hit && missed) {
				if (player.player) {
					KinkyDungeonSendEvent("miss", {enemy: enemy});
					KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonAttackMiss").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "lightgreen", 1);

				}
				KDAddThought(enemy.id, "Annoyed", 4, 1);
				enemy.vulnerable = Math.max(enemy.vulnerable, 1);
				hit = false;
			}
			if (hit) {
				let replace = [];
				let restraintAdd = [];
				let willpowerDamage = 0;
				let msgColor = "yellow";
				let Locked = false;
				let Stun = false;
				let Blind = false;
				let priorityBonus = 0;
				let addedRestraint = false;

				let happened = 0;
				let bound = 0;

				if (player.player) {
					if (attack.includes("Lock") && KinkyDungeonPlayerGetLockableRestraints().length > 0) {
						let Lockable = KinkyDungeonPlayerGetLockableRestraints();
						let Lstart = 0;
						let Lmax = Lockable.length-1;
						if (!enemy.Enemy.attack.includes("LockAll")) {
							Lstart = Math.floor(Lmax*KDRandom()); // Lock one at random
						}
						for (let L = Lstart; L <= Lmax; L++) {
							KinkyDungeonLock(Lockable[L], KinkyDungeonGenerateLock(true)); // Lock it!
							priorityBonus += KDRestraint(Lockable[L]).power;
						}
						Locked = true;
						happened += 1;
						if (enemy.usingSpecial && Locked && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Lock")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
					} else if (attack.includes("Bind")
						&& (addMoreRestraints || addLeash)
						&& ((!enemy.usingSpecial && !enemy.Enemy.bindOnKneel) || (enemy.usingSpecial && !enemy.Enemy.bindOnKneelSpecial) || KinkyDungeonPlayer.Pose.includes("Kneel") || KinkyDungeonPlayer.Pose.includes("Hogtie"))) {
						let numTimes = 1;
						if (enemy.Enemy.multiBind) numTimes = enemy.Enemy.multiBind;
						for (let times = 0; times < numTimes; times++) {
							// Note that higher power enemies get a bonus to the floor restraints appear on
							let rest = KinkyDungeonGetRestraint(
								enemy.Enemy, MiniGameKinkyDungeonLevel,
								KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint],
								enemy.Enemy.bypass,
								enemy.Enemy.useLock ? enemy.Enemy.useLock : "",
								!enemy.Enemy.ignoreStaminaForBinds && !attack.includes("Suicide"),
								!addMoreRestraints && addLeash,
								KinkyDungeonStatsChoice.has("TightRestraints") || enemy.Enemy.tags.has("miniboss") || enemy.Enemy.tags.has("boss"));
							if (rest) {
								replace.push({keyword:"RestraintAdded", value: TextGet("Restraint" + rest.name)});
								restraintAdd.push(rest);
								addedRestraint = true;
							}
						}
						if (enemy.usingSpecial && addedRestraint && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Bind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						if (!addedRestraint && enemy.Enemy.fullBoundBonus) {
							willpowerDamage += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
						}
					}
				}
				if (attack.includes("Bind") && KDGameData.KinkyDungeonLeashedPlayer < 1 && !enemy.Enemy.nopickpocket && player.player && enemy.Enemy.bound && !KDGameData.JailKey && KDCanPickpocket(enemy)) {
					let item = playerItems.length > 0 ? playerItems[Math.floor(KDRandom() * playerItems.length)] : undefined;
					if (item && playerItems.length > 0
						&& KinkyDungeonIsArmsBound() && ((!KinkyDungeonPlayerDamage || item.name != KinkyDungeonPlayerDamage.name) || KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax * 0.05) && KDRandom() < 0.5) {
						if (item.type == Weapon) {
							KinkyDungeonInventoryRemove(item);
							//KinkyDungeonAddLostItems([item], false);
							if (!enemy.items) enemy.items = [item.name];
							enemy.items.push(item.name);
						} else if (item.type == Consumable) {
							KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.name], -1);
							/** @type {item} */
							let item2 = Object.assign({}, item);
							//KinkyDungeonAddLostItems([item2], false);
							item2.quantity = 1;
							if (!enemy.items) enemy.items = [item.name];
							enemy.items.push(item.name);
						}
						if (item) {
							KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonStealItem").replace("ITEMSTOLEN", TextGet("KinkyDungeonInventoryItem" + item.name)), "yellow", 2);
						}
					} else if (KinkyDungeonLockpicks > 0 && KDRandom() < 0.5) {
						KinkyDungeonLockpicks -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealPick"), "yellow", 2);
						if (!enemy.items) enemy.items = ["Pick"];
						enemy.items.push("Pick");
					} else if (KinkyDungeonRedKeys > 0) {
						KinkyDungeonRedKeys -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealRedKey"), "yellow", 2);
						if (!enemy.items) enemy.items = ["RedKey"];
						enemy.items.push("RedKey");
					} else if (KinkyDungeonBlueKeys > 0) {
						KinkyDungeonBlueKeys -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealBlueKey"), "yellow", 2);
						if (!enemy.items) enemy.items = ["BlueKey"];
						enemy.items.push("BlueKey");
					}
					/*else if (KinkyDungeonEnchantedBlades > 0 && KDRandom() < 0.5) {
						KinkyDungeonEnchantedBlades -= 1;
						KinkyDungeonSendActionMessage(8, TextGet("KinkyDungeonStealEnchKnife"), "yellow", 2);
						if (!enemy.items) enemy.items = ["EnchKnife"];
						enemy.items.push("knife");
					}*/
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg", enemy);
				}

				if (attack.includes("Suicide")) {
					if ((!enemy.Enemy.suicideOnAdd && !enemy.Enemy.suicideOnLock)
						|| (enemy.Enemy.suicideOnAdd && addedRestraint) || (enemy.Enemy.suicideOnLock && Locked) || (!player.player && attack.includes("Bind") && enemy.Enemy.suicideOnAdd)) {
						enemy.hp = 0;
					} else if (!KinkyDungeonHasStamina(1.1) && enemy.Enemy.failAttackflag) {
						for (let f of enemy.Enemy.failAttackflag) {
							KinkyDungeonSetFlag(f, 12);
						}
					}
				}
				if (attack.includes("Vibe")) {
					vibe = true;
				}
				if (player.player && playerDist < range + 0.5 && (KinkyDungeonAggressive(enemy) || attack.includes("Pull")) && (((!enemy.Enemy.noLeashUnlessExhausted || !KinkyDungeonHasStamina(1.1)) && enemy.Enemy.tags && leashing && KDGetFaction(enemy) != "Ambush") || attack.includes("Pull")) && (KDGameData.KinkyDungeonLeashedPlayer < 1 || KDGameData.KinkyDungeonLeashingEnemy == enemy.id)) {
					let wearingLeash = false;
					if (!wearingLeash && !attack.includes("Pull"))
						wearingLeash = KinkyDungeonIsWearingLeash();
					let leashToExit = leashing && !KinkyDungeonHasStamina(1.1) && playerDist < 1.5;
					let leashed = wearingLeash || attack.includes("Pull");
					if (leashed) {
						let nearestJail = KinkyDungeonNearestJailPoint(enemy.x, enemy.y);
						if (KinkyDungeonFlags.has("LeashToPrison")) nearestJail = KinkyDungeonStartPosition;
						let leashPos = nearestJail;
						let findMaster = undefined;
						if (!leashToExit && enemy.Enemy.pullTowardSelf && (Math.abs(player.x - enemy.x) > 1.5 || Math.abs(player.y - enemy.y) > 1.5)) {
							findMaster = enemy;
							if (findMaster) leashPos = {x: findMaster.x, y: findMaster.y};
						} else {
							if (attack.includes("Pull") && enemy.Enemy.master) {
								/*let masterDist = 1000;
								for (let e of KinkyDungeonEntities) {
									let dist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
									if ((!enemy.Enemy.master.maxDist || dist < enemy.Enemy.master.maxDist)
										&& dist < masterDist
										&& (!enemy.Enemy.master.loose || KinkyDungeonCheckLOS(enemy, e, dist, 100, false))) {
										masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
										findMaster = e;
									}
								}*/
								let fm = KinkyDungeonFindMaster(enemy);
								findMaster = fm.master;
								if (findMaster) leashPos = {x: findMaster.x, y: findMaster.y};
							}
						}
						if (nearestJail && leashPos == nearestJail && !KinkyDungeonHasStamina(1.1) && Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) <= 1 && Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) <= 1) {
							defeat = true;
							KDGameData.KinkyDungeonLeashedPlayer = 3 + ap * 2;
							KDGameData.KinkyDungeonLeashingEnemy = enemy.id;
						}
						else if (leashPos && (Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) > 1.5 || Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) > 1.5)) {
							if (!KinkyDungeonHasStamina(1.1)) KinkyDungeonMovePoints = -2;
							// Leash pullback
							if (playerDist < 1.5) {
								let path = KinkyDungeonFindPath(enemy.x, enemy.y, leashPos.x, leashPos.y, false, false, true, KinkyDungeonMovableTilesSmartEnemy);
								if (path && path.length > 0) {
									let leashPoint = path[0];
									let enemySwap = KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y);
									if ((!enemySwap || !enemySwap.Enemy.noDisplace) && Math.max(Math.abs(leashPoint.x - enemy.x), Math.abs(leashPoint.y - enemy.y)) <= 1.5) {
										KDGameData.KinkyDungeonLeashedPlayer = 3 + ap * 2;
										KDGameData.KinkyDungeonLeashingEnemy = enemy.id;
										if (enemySwap) {
											enemySwap.x = KinkyDungeonPlayerEntity.x;
											enemySwap.y = KinkyDungeonPlayerEntity.y;
											enemySwap.warningTiles = [];
										}

										KDMovePlayer(enemy.x, enemy.y, false);
										KinkyDungeonTargetTile = null;
										KinkyDungeonTargetTileLocation = "";
										KDMoveEntity(enemy, leashPoint.x, leashPoint.y, true);
										hitsfx = "Struggle";
										for (let inv of KinkyDungeonAllRestraint()) {
											if (KDRestraint(inv).removeOnLeash) {
												KinkyDungeonRemoveRestraint(KDRestraint(inv).Group, false);
											}
										}
										if (!KinkyDungeonHasStamina(1.1)) {
											KinkyDungeonSlowMoveTurns = enemy.Enemy.movePoints + moveMult - (KDRandom() < 0.25 ? 1 : 0);
											KinkyDungeonSleepTime = CommonTime() + 200;
										}
										if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Pull")) {
											enemy.specialCD = enemy.Enemy.specialCD;
										}
										if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'D')  {
											KinkyDungeonMapSet(enemy.x, enemy.y, 'd');
											if (KinkyDungeonTiles.get(enemy.x + ',' +enemy.y) && KinkyDungeonTiles.get(enemy.x + ',' +enemy.y).Type == "Door")
												KinkyDungeonTiles.get(enemy.x + ',' +enemy.y).Lock = undefined;
										}
										if (!KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
											KinkyDungeonSendActionMessage(1, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
									}
								}
							} else {
								// Simple pull
								let path = KinkyDungeonFindPath(player.x, player.y, leashPos.x, leashPos.y, true, false, false, KinkyDungeonMovableTilesEnemy);
								let pullDist = enemy.Enemy.pullDist ? enemy.Enemy.pullDist : 1;
								if (path && path.length > 0) {
									let leashPoint = path[Math.min(Math.max(0,path.length-2), Math.floor(Math.max(0, pullDist-1)))];
									if (!KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y)
										&& Math.sqrt((leashPoint.x - enemy.x) * (leashPoint.x - enemy.x) + (leashPoint.y - enemy.y) * (leashPoint.y - enemy.y)) < playerDist
										&& Math.sqrt((leashPoint.x - player.x) * (leashPoint.x - player.x) + (leashPoint.y - player.y) * (leashPoint.y - player.y)) <= pullDist * 1.45) {
										if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Pull")) {
											enemy.specialCD = enemy.Enemy.specialCD;
										}
										KDGameData.KinkyDungeonLeashedPlayer = 2;
										KDGameData.KinkyDungeonLeashingEnemy = enemy.id;
										player.x = leashPoint.x;
										player.y = leashPoint.y;
										let msg = "KinkyDungeonLeashGrab";
										if (enemy.Enemy.pullMsg) msg = "Attack" + enemy.Enemy.name + "Pull";
										if (!KinkyDungeonSendTextMessage(8, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1))
											KinkyDungeonSendActionMessage(3, TextGet(msg).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
									}
								}
							}
						}
					}
				}
				let Dash = false;
				let data = {};
				if (attack.includes("Dash") && (enemy.Enemy.dashThruWalls || canSeePlayer)) {
					let d = KDDash(enemy, player, MovableTiles);
					Dash = d.Dash;
					happened += d.happened;
				}
				if (attack.includes("Will") || willpowerDamage > 0) {
					if (willpowerDamage == 0)
						willpowerDamage += power;
					let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
					if (buffdmg) willpowerDamage = Math.max(0, willpowerDamage + buffdmg);
					msgColor = "#ff8888";
					if (enemy.usingSpecial && willpowerDamage > 0 && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Will")) {
						enemy.specialCD = enemy.Enemy.specialCD;
					}
				}
				if (player.player) {
					KinkyDungeonTickBuffTag(enemy.buffs, "hit", 1);
					for (let r of restraintAdd) {
						let bb =  KinkyDungeonAddRestraintIfWeaker(r, power, enemy.Enemy.bypass, enemy.Enemy.useLock ? enemy.Enemy.useLock : undefined, undefined, undefined, undefined, KDGetFaction(enemy)) * 2;
						if (bb) {
							KDSendStatus('bound', r.name, "enemy_" + enemy.Enemy.name);
						}
						bound += bb;
					}
					if (attack.includes("Slow")) {
						KinkyDungeonMovePoints = Math.max(KinkyDungeonMovePoints - 2, -1);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Effect") && enemy.Enemy.effect) {
						let affected = KinkyDungeonPlayerEffect(enemy.Enemy.effect.damage, enemy.Enemy.effect.effect, enemy.Enemy.effect.spell, KDGetFaction(enemy));
						if (affected && enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Effect")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Stun")) {
						let time = enemy.Enemy.stunTime ? enemy.Enemy.stunTime : 1;
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, time);
						KinkyDungeonMovePoints = Math.max(Math.min(-1, -time+1), KinkyDungeonMovePoints-time); // This is to prevent stunlock while slowed heavily
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Stun")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
						priorityBonus += 3*time;
						Stun = true;
					}
					if (attack.includes("Blind")) {
						let time = enemy.Enemy.blindTime ? enemy.Enemy.blindTime : 1;
						KinkyDungeonStatBlind = Math.max(KinkyDungeonStatBlind, time);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Blind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
						priorityBonus += 3*time;
						Blind = true;
					}
					happened += bound;

					data = {
						attack: attack,
						enemy: enemy,
						bound: bound,
						damage: willpowerDamage,
						damagetype: damage,
						restraintsAdded: restraintAdd,
						attacker: enemy,
					};
					KinkyDungeonSendEvent("beforeDamage", data);
					happened += KinkyDungeonDealDamage({damage: data.damage, type: data.damagetype});
					KinkyDungeonSetFlag("NPCCombat",  3);

					replace.push({keyword:"DamageTaken", value: data.damage});
				} else { // if (KDRandom() <= playerEvasion)
					if (attack.includes("Slow")) {
						if (player.movePoints)
							player.movePoints = Math.max(player.movePoints - 1, 0);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Stun")) {
						let time = enemy.Enemy.stunTime ? enemy.Enemy.stunTime : 1;
						if (!player.stun) player.stun = time;
						else player.stun = Math.max(time, player.stun);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Stun")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Blind")) {
						let time = enemy.Enemy.blindTime ? enemy.Enemy.blindTime : 1;
						if (!player.blind) player.blind = time;
						else player.blind = Math.max(time, player.blind);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Blind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}
					if (attack.includes("Silence")) {
						let time = enemy.Enemy.silenceTime ? enemy.Enemy.silenceTime : 1;
						if (!player.silence) player.silence = time;
						else player.silence = Math.max(time, player.silence);
						if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Blind")) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						happened += 1;
					}


					let dmg = power;
					let buffdmg = KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
					if (buffdmg) dmg = Math.max(0, dmg + buffdmg);
					if (enemy.Enemy.fullBoundBonus) {
						dmg += enemy.Enemy.fullBoundBonus; // Some enemies deal bonus damage if they cannot put a binding on you
					}
					happened += KinkyDungeonDamageEnemy(player, {type: enemy.Enemy.dmgType, damage: dmg}, false, true, undefined, undefined, enemy);
					KinkyDungeonSetFlag("NPCCombat",  3);
					KinkyDungeonTickBuffTag(enemy.buffs, "hit", 1);
					if (happened > 0) {
						let sfx = (hitsfx) ? hitsfx : "DealDamage";
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg", enemy);
					}
				}

				if (enemy.usingSpecial && enemy.specialCD > 0 && enemy.Enemy.specialCharges) {
					if (enemy.specialCharges == undefined) enemy.specialCharges = enemy.Enemy.specialCharges-1;
					else enemy.specialCharges -= 1;
				}

				if (happened > 0 && player.player) {
					let suffix = "";
					if (Stun) suffix = "Stun";
					else if (Blind) suffix = "Blind";
					else if (Locked) suffix = "Lock";
					else if (bound > 0) suffix = "Bind";
					if (Dash) suffix = "Dash";

					let sfx = (hitsfx) ? hitsfx : (data.damage > 1 ? "Damage" : "DamageWeak");
					if (enemy.usingSpecial && enemy.Enemy.specialsfx) sfx = enemy.Enemy.specialsfx;
					KinkyDungeonSendEvent("hit", data);
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg", enemy);
					let text = TextGet("Attack"+enemy.Enemy.name + suffix);
					if (replace)
						for (let R = 0; R < replace.length; R++)
							text = text.replace(replace[R].keyword, "" + replace[R].value);
					KinkyDungeonSendTextMessage(happened+priorityBonus, text, msgColor, 1);
					if (!enemy.Enemy.tags.has("temporary") && attack.includes("Bind") && KDCanPickpocket(enemy))
						KinkyDungeonLoseJailKeys(true, undefined, enemy);
				}
			} else {
				let sfx = (enemy.Enemy && enemy.Enemy.misssfx) ? enemy.Enemy.misssfx : "Miss";
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg", enemy);
				enemy.vulnerable = Math.max(enemy.vulnerable, 1);
				if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
					KDDash(enemy, player, MovableTiles);
				}
			}

			KinkyDungeonTickBuffTag(enemy.buffs, "damage", 1);

			enemy.warningTiles = [];
			if (enemy.usingSpecial) enemy.usingSpecial = false;
		}
	} else {
		enemy.warningTiles = [];
		enemy.attackPoints = 0;
	}

	enemy.moved = (moved || enemy.movePoints > 0);
	enemy.idle = idle && !(moved || enemy.attackPoints > 0);

	if (!ignore && AI == "ambush" && playerDist <= enemy.Enemy.ambushRadius) {
		enemy.ambushtrigger = true;
	} else if (AI == "ambush" && ignore) enemy.ambushtrigger = false;


	// Spell loop
	if ((!enemy.Enemy.enemyCountSpellLimit || KinkyDungeonEntities.length < enemy.Enemy.enemyCountSpellLimit)
		&& ((!player.player || (KinkyDungeonAggressive(enemy) || (KDGameData.PrisonerState == 'parole' && enemy.Enemy.spellWhileParole)))) && (!enemy.silence || enemy.silence < 1)
		&& (!enemy.Enemy.noSpellDuringAttack || enemy.attackPoints < 1)
		&& (!enemy.Enemy.noSpellsWhenHarmless || !harmless)
		&& (!enemy.Enemy.noSpellsLowSP || KinkyDungeonHasStamina(1.1))
		&& (!enemy.Enemy.noSpellLeashing || KDGameData.KinkyDungeonLeashingEnemy != enemy.id || KDGameData.KinkyDungeonLeashedPlayer < 1)
		&& (!enemy.Enemy.followLeashedOnly || (KDGameData.KinkyDungeonLeashedPlayer < 1 || KDGameData.KinkyDungeonLeashingEnemy == enemy.id) || !addMoreRestraints)
		&& (KDHostile(enemy) || (!player.player && (KDHostile(player) || enemy.rage)))
		&& ((enemy.aware && (KinkyDungeonTrackSneak(enemy, 0, player) || playerDist < Math.max(1.5, blindSight))) || (!KDAllied(enemy) && !KDHostile(enemy)))
		&& !ignore && (!moved || enemy.Enemy.castWhileMoving) && enemy.Enemy.attack.includes("Spell")
		&& !ignoreRanged
		&& KinkyDungeonCheckLOS(enemy, player, playerDist, visionRadius, false, true) && enemy.castCooldown <= 0) {
		idle = false;
		let spellchoice = null;
		let spell = null;
		let spelltarget = undefined;

		for (let tries = 0; tries < 6; tries++) {
			spelltarget = null;
			spellchoice = enemy.Enemy.spells[Math.floor(KDRandom()*enemy.Enemy.spells.length)];
			spell = KinkyDungeonFindSpell(spellchoice, true);
			if ((!spell.castRange && playerDist > spell.range) || (spell.castRange && playerDist > spell.castRange)) spell = null;
			if (spell && spell.specialCD && enemy.castCooldownSpecial > 0) spell = null;
			if (spell && spell.noFirstChoice && tries <= 2) spell = null;
			if (spell && spell.projectileTargeting && !KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y)) spell = null;
			if (spell && spell.buff) {
				if (enemy.Enemy.buffallies) {
					// Select a random nearby ally of the enemy
					let nearAllies = [];
					for (let e of KinkyDungeonEntities) {
						if ((e != enemy) && (!spell.heal || e.hp < e.Enemy.maxhp - spell.power*0.5)
							&& e.aware && !KinkyDungeonHasBuff(e.buffs, spell.name)
							&& !e.rage
							&& ((KDAllied(enemy) && KDAllied(e)) || (KDHostile(enemy) && KDHostile(e) || KDFactionRelation(KDGetFaction(e), KDGetFaction(enemy)) >= 0.1))
							&& Math.sqrt((enemy.x - e.x)*(enemy.x - e.x) + (enemy.y - e.y)*(enemy.y - e.y)) < spell.range) {
							let allow = !spell.filterTags;
							if (spell.filterTags) {
								for (let t of spell.filterTags) {
									if (e.Enemy.tags && e.Enemy.tags.get(t)) {
										allow = true;
										break;
									}
								}
							}
							if (allow)
								nearAllies.push(e);
						}
					}
					if (nearAllies.length > 0) {
						let e = nearAllies[Math.floor(KDRandom() * nearAllies.length)];
						if (e) {
							spelltarget = e;
							KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2);
							break;
						}
					} else spell = null;
				} else {
					spelltarget = enemy;
				}
			}
			let minSpellRange = (spell && spell.minRange != undefined) ? spell.minRange : ((spell && (spell.selfcast || spell.buff || (spell.range && spell.range < 1.6))) ? 0 : 1.5);
			if (spell && spell.heal && spelltarget.hp >= spelltarget.Enemy.maxhp) spell = null;
			if (spell && !(!minSpellRange || (playerDist > minSpellRange))) spell = null;
			if (spell && !(!spell.minRange || (playerDist > spell.minRange))) spell = null;
			if (spell) break;
		}

		if (spell) {
			if (spell.channel && !enemy.Enemy.noChannel) enemy.channel = spell.channel;
			enemy.castCooldown = spell.manacost*enemy.Enemy.spellCooldownMult + enemy.Enemy.spellCooldownMod + 1;
			if (spell.specialCD)
				enemy.castCooldownSpecial = spell.specialCD;
			let xx = player.x;
			let yy = player.y;
			if (spelltarget) {
				xx = spelltarget.x;
				yy = spelltarget.y;
			}
			if (spell && spell.selfcast) {
				xx = enemy.x;
				yy = enemy.y;
				if (!spell.noCastMsg)
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2, undefined, undefined, enemy);
			} else if (spell && spell.msg) {
				if (!spell.noCastMsg)
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonSpellCast" + spell.name).replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "white", 2, undefined, undefined, enemy);
			}

			if (spell && KinkyDungeonCastSpell(xx, yy, spell, enemy, player) == "Cast" && spell.sfx) {
				if (enemy.Enemy.suicideOnSpell) enemy.hp = 0;
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + spell.sfx + ".ogg", enemy);
			}

			//console.log("casted "+ spell.name);
		}
	}
	if (vibe || (enemy.Enemy.remote && playerDist < enemy.Enemy.remote)) {
		KinkyDungeonSendEvent("remoteVibe", {enemy: enemy.Enemy.name, power: enemy.Enemy.remoteAmount ? enemy.Enemy.remoteAmount : 5, overcharge: vibe, noSound: vibe});
	}
	if (enemy.usingSpecial && (idle || (moved && !enemy.Enemy.attackWhileMoving)) && enemy.Enemy.specialCDonAttack) {
		enemy.specialCD = enemy.Enemy.specialCD;
	}
	if (enemy.specialCD > 0) enemy.usingSpecial = false;

	if (idle) KDAddThought(enemy.id, "Idle", 1, 3);
	return {idle: idle, defeat: defeat};
}

// Unique ID for enemies, to prevent bullets from hitting them
// Dont want to pass object handles around in case we ever allow saving a room
function KinkyDungeonGetEnemyID() {
	if (KinkyDungeonEnemyID > 100000000) KinkyDungeonEnemyID = 0;
	return KinkyDungeonEnemyID++;
}

let KinkyDungeonEnemyID = 1;

function KinkyDungeonAttachTetherToLeasher(dist) {
	let inv = KinkyDungeonGetRestraintItem("ItemNeckRestraints");
	if (inv && KDRestraint(inv).tether) {
		inv.tetherToLeasher = true;
		if (dist) inv.tetherLength = dist;
	}
}

function KinkyDungeonNoEnemy(x, y, Player) {

	if (KinkyDungeonEnemyAt(x, y)) return false;
	if (Player)
		for (let player of KinkyDungeonPlayers)
			if ((player.x == x && player.y == y)) return false;
	return true;
}

// e = potential sub
// Enemy = leader
/**
 *
 * @param {entity} e
 * @param {entity} Enemy
 * @returns
 */
function KinkyDungeonCanSwapWith(e, Enemy) {
	if (e.Enemy && e.Enemy.immobile) return false; // Definition of noSwap
	if (e && KDEnemyHasFlag(e, "noswap")) return false; // Definition of noSwap
	if (Enemy && Enemy.Enemy && Enemy.Enemy.ethereal && e && e.Enemy && !e.Enemy.ethereal) return false; // Ethereal enemies NEVER have seniority, this can teleport other enemies into walls
	if (Enemy && Enemy.Enemy && Enemy.Enemy.squeeze && e && e.Enemy && !e.Enemy.squeeze) return false; // Squeeze enemies NEVER have seniority, this can teleport other enemies into walls
	if (Enemy == KinkyDungeonLeashingEnemy()) return true;
	if (KDBoundEffects(e) > 3) return true;
	if (!e.Enemy.tags || (e.Enemy.tags.has("minor") && !Enemy.Enemy.tags.has("minor")))
		return true;
	else if (Enemy && Enemy.Enemy && Enemy.Enemy.tags && Enemy.Enemy.tags.has("elite")) {
		if (!e.Enemy.tags || (!e.Enemy.tags.has("elite") && !e.Enemy.tags.has("miniboss") && !e.Enemy.tags.has("boss")))
			return true;
	} else if (Enemy && Enemy.Enemy && Enemy.Enemy.tags && Enemy.Enemy.tags.has("miniboss")) {
		if (!e.Enemy.tags || (!e.Enemy.tags.has("miniboss") && !e.Enemy.tags.has("boss")))
			return true;
	} else if (Enemy && Enemy.Enemy && Enemy.Enemy.tags && Enemy.Enemy.tags.has("boss")) {
		if (!e.Enemy.tags || (!e.Enemy.tags.has("boss")))
			return true;
	}
	return false;
}

function KinkyDungeonNoEnemyExceptSub(x, y, Player, Enemy) {
	let e = KinkyDungeonEnemyAt(x, y);
	if (e && e.Enemy) {
		if (e.Enemy.master && Enemy && Enemy.Enemy && e.Enemy.master.type == Enemy.Enemy.name) return true;
		let seniority = Enemy ? KinkyDungeonCanSwapWith(e, Enemy) : false;
		return seniority;
	}
	if (Player)
		for (let pp of KinkyDungeonPlayers)
			if ((pp.x == x && pp.y == y)) return false;
	return true;
}

function KinkyDungeonEnemyAt(x, y) {
	for (let enemy of KinkyDungeonEntities) {
		if (enemy.x == x && enemy.y == y)
			return enemy;
	}
	return null;
}

function KinkyDungeonEnemyTryMove(enemy, Direction, delta, x, y) {
	let speedMult = KinkyDungeonGetBuffedStat(enemy.buffs, "MoveSpeed") ? KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(enemy.buffs, "MoveSpeed")) : 1;
	if (enemy.bind > 0) enemy.movePoints += speedMult * delta/10;
	else if (enemy.slow > 0) enemy.movePoints += speedMult * delta/2;
	else enemy.movePoints += KDGameData.SleepTurns > 0 ? 4*delta * speedMult : delta * speedMult;

	let moveMult = KDBoundEffects(enemy);

	if (enemy.movePoints >= enemy.Enemy.movePoints + moveMult) {
		enemy.movePoints = 0;
		let dist = Math.abs(x - KinkyDungeonPlayerEntity.x) + Math.abs(y - KinkyDungeonPlayerEntity.y);

		let ee = KinkyDungeonEnemyAt(enemy.x + Direction.x, enemy.y + Direction.y);

		if (!ee && KinkyDungeonMapGet(enemy.x, enemy.y) == 'd' && enemy.Enemy && enemy.Enemy.tags.has("closedoors")
			&& ((KDRandom() < 0.8 && dist > 5) ||
				(KinkyDungeonTiles.get(enemy.x + "," + enemy.y) && KDHostile(enemy) && (KinkyDungeonTiles.get(enemy.x + "," + enemy.y).Jail || KinkyDungeonTiles.get(enemy.x + "," + enemy.y).ReLock) && (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")))) {
			KinkyDungeonMapSet(enemy.x, enemy.y, 'D');
			if (KDGameData.PrisonerState == 'jail' && KinkyDungeonTiles.get(enemy.x + "," + enemy.y) && KDHostile(enemy) && (KinkyDungeonTiles.get(enemy.x + "," + enemy.y).Jail || KinkyDungeonTiles.get(enemy.x + "," + enemy.y).ReLock)
				&& (!KinkyDungeonJailGuard() || KinkyDungeonJailGuard().CurrentAction != "jailLeashTour")) {
				KinkyDungeonTiles.get(enemy.x + "," + enemy.y).Lock = "Red";
			}
			if (dist < 10) {
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorCloseNear"), "#dddddd", 4);
			} else if (dist < 20)
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHearDoorCloseFar"), "#999999", 4);
		}

		if (ee && KinkyDungeonCanSwapWith(ee, enemy)) {
			ee.x = enemy.x;
			ee.y = enemy.y;
			ee.warningTiles = [];
			ee.movePoints = 0;
			ee.stun = 1;
		}
		enemy.x += Direction.x;
		enemy.y += Direction.y;

		if (KinkyDungeonMapGet(x, y) == 'D' && enemy.Enemy && enemy.Enemy.tags.has("opendoors")) {
			KinkyDungeonMapSet(x, y, 'd');
			if (KinkyDungeonTiles.get(x + ',' +y) && KinkyDungeonTiles.get(x + ',' +y).Type == "Door")
				KinkyDungeonTiles.get(x + ',' +y).Lock = undefined;
			if (dist < 5) {
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonHearDoorOpenNear"), "#dddddd", 4);
			} else if (dist < 15)
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonHearDoorOpenFar"), "#999999", 4);
		}

		return true;
	}
	return false;
}

function KinkyDungeonEnemyTryAttack(enemy, player, Tiles, delta, x, y, points, replace, msgColor, usingSpecial, refreshWarningTiles, attack, MovableTiles) {
	if (!enemy.Enemy.noCancelAttack && !refreshWarningTiles && points > 1) {
		let playerIn = false;
		for (let T = 0; T < Tiles.length; T++) {
			let ax = enemy.x + Tiles[T].x;
			let ay = enemy.y + Tiles[T].y;

			if (player.x == ax && player.y == ay && (!enemy.Enemy.strictAttackLOS || KinkyDungeonCheckProjectileClearance(enemy.x, enemy.y, player.x, player.y))) {
				playerIn = true;
				break;
			}
		}

		if (!playerIn && Tiles.length > 0) {
			if (enemy.Enemy.specialRange && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
				enemy.specialCD = enemy.Enemy.specialCD;
				enemy.attackPoints = 0;
				enemy.warningTiles = [];
				enemy.usingSpecial = false;
				if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
				if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
					KDDash(enemy, player, MovableTiles);
				}
				return false;
			}
			if (enemy.Enemy.specialWidth && enemy.usingSpecial && enemy.Enemy.specialCDonAttack) {
				enemy.specialCD = enemy.Enemy.specialCD;
				enemy.attackPoints = 0;
				enemy.warningTiles = [];
				enemy.usingSpecial = false;
				if (enemy.Enemy.stunOnSpecialCD) enemy.stun = enemy.Enemy.stunOnSpecialCD;
				if (attack.includes("Dash") && enemy.Enemy.dashOnMiss) {
					KDDash(enemy, player, MovableTiles);
				}
				return false;
			}
		}
	}

	enemy.attackPoints += delta;
	KinkyDungeonSetFlag("NPCCombat",  3);

	if (enemy.attackPoints >= points) {
		enemy.attackPoints = 0;
		return true;
	}
	return false;
}

function KinkyDungeonGetWarningTilesAdj() {
	let arr = [];

	arr.push({x:1, y:1});
	arr.push({x:0, y:1});
	arr.push({x:1, y:0});
	arr.push({x:-1, y:-1});
	arr.push({x:-1, y:1});
	arr.push({x:1, y:-1});
	arr.push({x:-1, y:0});
	arr.push({x:0, y:-1});

	return arr;
}

function KDCanPickpocket(enemy) {
	for (let inv of KinkyDungeonAllRestraint()) {
		if (KDRestraint(inv).enclose) return false;
	}
	return KDHostile(enemy);
}


function KinkyDungeonGetWarningTiles(dx, dy, range, width, forwardOffset = 1) {
	if (range == 1 && width == 8) return KinkyDungeonGetWarningTilesAdj();

	let arr = [];
	/*
	let cone = 0.78539816 * (width-0.9)/2;
	let angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((KDRandom() > 0.5) ? -0.39269908 : 39269908) : 0);
	if (angle_player > Math.PI) angle_player -= Math.PI;
	if (angle_player < -Math.PI) angle_player += Math.PI;

	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			let angle = Math.atan2(X, Y);

			let angleDiff = angle - angle_player;
			angleDiff += (angleDiff>Math.PI) ? -2*Math.PI : (angleDiff<-Math.PI) ? 2*Math.PI : 0;

			if (Math.abs(angleDiff) < cone + 0.22/Math.max(Math.abs(X), Math.abs(Y)) && Math.sqrt(X*X + Y*Y) < range + 0.5) arr.push({x:X, y:Y});
		}
	*/
	let dist = Math.sqrt(dx*dx + dy*dy);
	let radius = Math.ceil(width/2);
	if (dist > 0) {
		let x_step = dx/dist;
		let y_step = dy/dist;

		for (let d = forwardOffset; d <= range; d++) {
			let xx = x_step * d;
			let yy = y_step * d;
			for (let X = Math.floor(xx-radius); X <= Math.ceil(xx+radius); X++)
				for (let Y = Math.floor(yy-radius); Y <= Math.ceil(yy+radius); Y++) {
					let dd = Math.sqrt((X - xx)*(X - xx) + (Y - yy)*(Y - yy));
					let dd2 = Math.sqrt(X*X+Y*Y);
					if (dd < width*0.49 && dd2 < range + 0.5) {
						let dupe = false;
						for (let a of arr) {
							if (a.x == X && a.y == Y) {dupe = true; break;}
						}
						if (!dupe) arr.push({x:X, y:Y});
					}
				}
		}
	}

	return arr;
}

function KinkyDungeonFindMaster(enemy) {
	let findMaster = undefined;
	let masterDist = 1000;
	if (enemy.Enemy.master) {
		for (let e of KinkyDungeonEntities) {
			if (e.Enemy.name == enemy.Enemy.master.type) {
				let dist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
				if ((!enemy.Enemy.master.maxDist || dist < enemy.Enemy.master.maxDist)
					&& dist < masterDist
					&& (!enemy.Enemy.master.loose || KinkyDungeonCheckLOS(enemy, e, dist, 100, false, false))) {
					masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y)*(e.y - enemy.y));
					findMaster = e;
				}
			}
		}
	}
	return {master: findMaster, dist: masterDist};
}

function KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, Tries) {
	let master = enemy.Enemy.master;
	let xx = enemy.x + dir.x;
	let yy = enemy.y + dir.y;
	if (master && (!enemy.Enemy.master.aggressive || !enemy.aware)) {
		let fm = KinkyDungeonFindMaster(enemy);
		let findMaster = fm.master;
		let masterDist = fm.dist;
		if (findMaster) {
			if (Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > master.range
				&& Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > masterDist) return false;
		}
	}
	return MovableTiles.includes(KinkyDungeonMapGet(xx, yy)) && ((Tries && Tries > 5) || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)))
		&& (ignoreLocks || !KinkyDungeonTiles.get((xx) + "," + (yy)) || !KinkyDungeonTiles.get((xx) + "," + (yy)).Lock)
		&& KinkyDungeonNoEnemyExceptSub(xx, yy, true, enemy);
}

function KinkyDungeonFindID(id) {
	for (let e of KinkyDungeonEntities) {
		if (e.id == id) return e;
	}
	return null;
}

function KDDash(enemy, player, MovableTiles) {
	let happened = 0;
	let Dash = false;
	// Check player neighbor tiles
	let tiles = [];
	for (let X = player.x-1; X <= player.x+1; X++)
		for (let Y = player.y-1; Y <= player.y+1; Y++) {
			let tile = KinkyDungeonMapGet(X, Y);
			if ((X != 0 || Y != 0) && !(!KinkyDungeonNoEnemy(X, Y, true) || !MovableTiles.includes(tile) || (tile == 'D' && !enemy.Enemy.ethereal))) {
				tiles.push({x:X, y:Y});
			}
		}
	if (tiles.length > 0) {
		let tile = tiles[Math.floor(KDRandom()*tiles.length)];
		if (enemy.Enemy.dashThrough) {
			let tiled = 0;
			for (let t of tiles) {
				let dist = Math.sqrt((enemy.x - t.x)*(enemy.x - t.x) + (enemy.y - t.y)*(enemy.y - t.y));
				if (dist > tiled) {
					tile = t;
					tiled = dist;
				}
			}
		} else {
			let tiled = Math.sqrt((enemy.x - tile.x)*(enemy.x - tile.x) + (enemy.y - tile.y)*(enemy.y - tile.y));
			for (let t of tiles) {
				let dist = Math.sqrt((enemy.x - t.x)*(enemy.x - t.x) + (enemy.y - t.y)*(enemy.y - t.y));
				if (dist < tiled) {
					tile = t;
					tiled = dist;
				}
			}
		}
		if (tile && (tile.x != player.x || tile.y != player.y) && (tile.x != KinkyDungeonPlayerEntity.x || tile.y != KinkyDungeonPlayerEntity.y) && MovableTiles.includes(KinkyDungeonMapGet(tile.x, tile.y))) {
			Dash = true;
			KDMoveEntity(enemy, tile.x, tile.y, true);
			enemy.path = undefined;
			happened += 1;
			if (enemy.usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Dash")) {
				enemy.specialCD = enemy.Enemy.specialCD;
			}
		}
	}
	return {happened: happened, Dash: Dash};
}

function KinkyDungeonSendEnemyEvent(Event, data) {
	for (let enemy of KinkyDungeonEntities) {
		if (enemy.Enemy.events) {
			for (let e of enemy.Enemy.events) {
				if (e.trigger === Event) {
					KinkyDungeonHandleEnemyEvent(Event, e, enemy, data);
				}
			}
		}
	}
}

/**
 * Moves an entity
 * @param {entity} enemy
 * @param {number} x
 * @param {number} y
 * @param {boolean} willing
 */
function KDMoveEntity(enemy, x, y, willing) {
	enemy.lastx = enemy.x;
	enemy.lasty = enemy.y;
	enemy.x = x;
	enemy.y = y;
}