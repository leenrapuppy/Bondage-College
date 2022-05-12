"use strict";

/**
 * @type {{type: string, data: any}[]}
 */
let KinkyDungeonInputQueue = [];

/**
 * @returns {string}
 * Delegate to KDProcessInputs */
function KDProcessInput(type, data) {
	let Result = null;
	let loose = null;
	let msg = "";
	let success = 0;
	let tile = null;
	switch (type) {
		case "move":
			KinkyDungeonToggleAutoDoor = data.AutoDoor;
			KinkyDungeonMove(data.dir, data.delta, data.AllowInteract);
			break;
		case "setMoveDirection":
			KinkyDungeonMoveDirection = data.dir;
			break;
		case "tick":
			KinkyDungeonAdvanceTime(data.delta, data.NoUpdate, data.NoMsgTick);
			break;
		case "tryCastSpell":
			Result = KinkyDungeonCastSpell(data.tx, data.ty, data.spell ? data.spell : KinkyDungeonFindSpell(data.spellname, true), data.enemy, data.player, data.bullet);
			if (Result == "Cast" && KinkyDungeonTargetingSpell.sfx) {
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonTargetingSpell.sfx + ".ogg");
			}
			if (Result != "Fail")
				KinkyDungeonAdvanceTime(1);
			KinkyDungeonInterruptSleep();
			return Result;
		case "struggle":
			return KinkyDungeonStruggle(data.group, data.type);
		case "struggleCurse":
			KinkyDungeonCurseStruggle(data.group, data.curse);
			break;
		case "curseUnlock":
			KinkyDungeonCurseUnlock(data.group, data.curse);
			break;
		case "toggleSpell":
			KinkyDungeonSpellChoicesToggle[data.i] = !KinkyDungeonSpellChoicesToggle[data.i];
			if (KinkyDungeonSpellChoicesToggle[data.i] && KinkyDungeonSpells[KinkyDungeonSpellChoices[data.i]].costOnToggle) {
				if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[data.i]]))) {
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[data.i]]));
				} else KinkyDungeonSpellChoicesToggle[data.i] = false;
			}
			break;
		case "consumable":
			KinkyDungeonAttemptConsumable(data.item, data.quantity);
			break;
		case "switchWeapon":
			KDSetWeapon(data.weapon);
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			if (KinkyDungeonStatsChoice.has("Disorganized")) {
				KinkyDungeonAdvanceTime(1);
				KinkyDungeonSlowMoveTurns = 2;
			} else if (!KinkyDungeonStatsChoice.has("QuickDraw"))
				KinkyDungeonAdvanceTime(1);
			KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + data.weapon)), "white", 5);
			break;
		case "unequipWeapon":
			KDSetWeapon(null);
			KinkyDungeonGetPlayerWeaponDamage(KinkyDungeonCanUseWeapon());
			KinkyDungeonSendActionMessage(7, TextGet("KinkyDungeonUnEquipWeapon").replace("WEAPONNAME", TextGet("KinkyDungeonInventoryItem" + data.weapon)), "white", 5);
			break;
		case "dress":
			KinkyDungeonSetDress(data.dress, data.outfit);
			KinkyDungeonSlowMoveTurns = 3;
			KinkyDungeonSleepTime = CommonTime() + 200;
			break;
		case "equip":
			success = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonRestraintsCache.get(data.name), 0, true, "", KinkyDungeonGetRestraintItem(data.Group) && !KinkyDungeonLinkableAndStricter(KinkyDungeonRestraintsCache.get(data.currentItem), KinkyDungeonRestraintsCache.get(data.name)), false, data.events);
			if (success) {
				KDSendStatus('bound', data.name, "self");
				loose = KinkyDungeonInventoryGetLoose(data.name);
				msg = "KinkyDungeonSelfBondage";
				if (KDRestraint(loose).Group == "ItemVulvaPiercings" || KDRestraint(loose).Group == "ItemVulva" || KDRestraint(loose).Group == "ItemButt") {
					if (KinkyDungeonIsChaste(false)) {
						msg = "KinkyDungeonSelfBondagePlug";
					}
				} else if (KDRestraint(loose).Group == "Item") {
					if (KinkyDungeonIsChaste(true)) {
						msg = "KinkyDungeonSelfBondageNipple";
					}
				} else if (KDRestraint(loose).enchanted) {
					msg = "KinkyDungeonSelfBondageEnchanted";
				}
				KinkyDungeonSendTextMessage(10, TextGet(msg).replace("RestraintName", TextGet("Restraint" + KDRestraint(loose).name)), "yellow", 1);
				KinkyDungeonInventoryRemove(loose);
				return msg;
			}
			break;
		case "tryOrgasm":
			KinkyDungeonDoTryOrgasm();
			break;
		case "tryPlay":
			KinkyDungeonDoPlayWithSelf();
			break;
		case "sleep":
			KDGameData.SleepTurns = KinkyDungeonSleepTurnsMax;
			break;
		case "pick":
			tile = KinkyDungeonTiles.get(data.targetTile);
			KinkyDungeonTargetTile = tile;
			KinkyDungeonTargetTileLocation = data.targetTile;
			KinkyDungeonAdvanceTime(1, true);
			if (KinkyDungeonPickAttempt()) {
				KinkyDungeonTargetTile.Lock = undefined;
				if (KinkyDungeonTargetTile.Type == "Lock") delete KinkyDungeonTargetTile.Type;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			break;
		case "unlock":
			tile = KinkyDungeonTiles.get(data.targetTile);
			KinkyDungeonTargetTile = tile;
			KinkyDungeonTargetTileLocation = data.targetTile;
			KinkyDungeonAdvanceTime(1, true);
			if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
				KinkyDungeonTargetTile.Lock = undefined;
				if (KinkyDungeonTargetTile.Type == "Lock") delete KinkyDungeonTargetTile.Type;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			break;
		case "closeDoor":
			tile = KinkyDungeonTiles.get(data.targetTile);
			KinkyDungeonTargetTileLocation = data.targetTile;
			KinkyDungeonTargetTile = null;
			KinkyDungeonMapSet(parseInt(KinkyDungeonTargetTileLocation.split(',')[0]), parseInt(KinkyDungeonTargetTileLocation.split(',')[1]), "D");
			KinkyDungeonTargetTileLocation = "";
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/DoorClose.ogg");
			KinkyDungeonToggleAutoDoor = false;
			KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 2);
			KinkyDungeonAdvanceTime(1, true);
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			break;
		case "shrineBuy":
			KinkyDungeonShopIndex = data.shopIndex;
			KinkyDungeonPayShrine(data.type);
			KinkyDungeonAggroAction('shrine', {});
			if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			break;
		case "shrineUse":
			tile = KinkyDungeonTiles.get(data.targetTile);
			//KinkyDungeonTargetTile = tile;
			//KinkyDungeonTargetTileLocation = data.targetTile;
			KinkyDungeonAdvanceTime(1, true);
			//KinkyDungeonTargetTile = null;
			if (KinkyDungeonGold >= data.cost) {
				KinkyDungeonPayShrine(data.type);
				KinkyDungeonTiles.delete(KinkyDungeonTargetTileLocation);
				let x =  data.targetTile.split(',')[0];
				let y =  data.targetTile.split(',')[1];
				KinkyDungeonMapSet(parseInt(x), parseInt(y), "a");
				//KinkyDungeonTargetTileLocation = "";
				KinkyDungeonAggroAction('shrine', {x: parseInt(x), y:parseInt(y)});
				KDGameData.AlreadyOpened.push({x: parseInt(x), y: parseInt(y)});
				KinkyDungeonUpdateStats(0);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			} else {
				KinkyDungeonSendActionMessage(1, TextGet("KinkyDungeonPayShrineFail"), "red", 1);
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
			}
			KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
			break;
		case "shrineDrink": {
			let chance = 0 + KinkyDungeonShrinePoolChancePerUse * KDGameData.PoolUses;

			KinkyDungeonAdvanceTime(1, true);

			if ((KDRandom() > chance || KDGameData.PoolUsesGrace > 0) && (!KinkyDungeonGoddessRep[data.type] || KinkyDungeonGoddessRep[data.type] > -49.9 || KinkyDungeonStatsChoice.get("Blessed"))) {
				let slimed = 0;
				for (let inv of KinkyDungeonAllRestraint()) {
					if (KDRestraint(inv).slimeLevel) {
						slimed += 1;
						KinkyDungeonRemoveRestraint(KDRestraint(inv).Group, false);
					}
				}
				if (slimed) KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonPoolDrinkSlime"), "#FF00FF", 2);
				else KinkyDungeonSendActionMessage(9, TextGet("KinkyDungeonPoolDrink" + Math.min(2, KDGameData.PoolUses)), "#AAFFFF", 2);
				KinkyDungeonStatMana = KinkyDungeonStatManaMax;
				if (chance > 0) KDGameData.PoolUsesGrace -= 1;
				KinkyDungeonChangeRep(data.type, -2 - slimed * 2);
				KDSendStatus('goddess', data.type, 'shrineDrink');
				KinkyDungeonAggroAction('shrine', {});
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			} else {
				// You have angered the gods!
				KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + data.type)), "#AA0000", 3);
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + data.type)), "#AA0000", 3);

				KinkyDungeonShrineAngerGods(data.type);
				KDGameData.PoolUses = 10000;
				if (KinkyDungeonSound) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
				KDSendStatus('goddess', data.type, 'shrineEnrage');
			}

			KDGameData.PoolUses += 1;
			break;
		}
		case "defeat":
			KinkyDungeonDefeat();
			KinkyDungeonChangeRep("Ghost", 4);
			break;
		case "lose":
			KinkyDungeonState = "Lose";
			MiniGameKinkyDungeonLevel = -1;
			break;
		case "orb":
			if (KinkyDungeonMapGet(data.x, data.y) == 'O') {
				if (KinkyDungeonGoddessRep[data.shrine] < -45) {
					KinkyDungeonSummonEnemy(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, "OrbGuardian", 3 + Math.floor(Math.sqrt(1 + MiniGameKinkyDungeonLevel)), 10, false, 30);
				}
				KinkyDungeonChangeRep(data.shrine, data.Amount * -10);

				KDSendStatus('goddess', data.shrine, 'takeOrb');
				if (KinkyDungeonDifficultyMode == 2 || KinkyDungeonDifficultyMode == 3) {
					let spell = null;
					let spellList = [];
					let maxSpellLevel = 4;
					for (let sp of KinkyDungeonSpellList.Conjure) {
						if (sp.level <= KinkyDungeonSpellLevel.Conjure && sp.school == "Conjure" && !sp.secret) {
							for (let iii = 0; iii < maxSpellLevel - sp.level; iii++)
								spellList.push(sp);
						}
					}
					for (let sp of KinkyDungeonSpellList.Elements) {
						if (sp.level <= KinkyDungeonSpellLevel.Elements && sp.school == "Elements" && !sp.secret) {
							for (let iii = 0; iii < maxSpellLevel - sp.level; iii++)
								spellList.push(sp);
						}
					}
					for (let sp of KinkyDungeonSpellList.Illusion) {
						if (sp.level <= KinkyDungeonSpellLevel.Illusion && sp.school == "Illusion" && !sp.secret) {
							for (let iii = 0; iii < maxSpellLevel - sp.level; iii++)
								spellList.push(sp);
						}
					}

					for (let sp of KinkyDungeonSpells) {
						for (let S = 0; S < spellList.length; S++) {
							if (sp.name == spellList[S].name) {
								spellList.splice(S, 1);
								S--;
							}
						}
					}

					spell = spellList[Math.floor(KDRandom() * spellList.length)];

					if (spell) {
						KinkyDungeonSpells.push(spell);
						KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonOrbSpell").replace("SPELL", TextGet("KinkyDungeonSpell" + spell.name)), "lightblue", 2);
					}
				} else {
					KinkyDungeonSpellPoints += data.Amount;
				}
				KinkyDungeonMapSet(data.x, data.y, 'o');
				KinkyDungeonAggroAction('orb', {});
			}
			break;
		case "heart":
			if (data.type == "AP") {
				if (KinkyDungeonStatDistractionMax < 40) KinkyDungeonSpells.push(KinkyDungeonFindSpell("APUp1"));
				else if (KinkyDungeonStatDistractionMax < 50) KinkyDungeonSpells.push(KinkyDungeonFindSpell("APUp2"));
				else KinkyDungeonSpells.push(KinkyDungeonFindSpell("APUp3"));
				KinkyDungeonUpdateStats(0);
			}else if (data.type == "SP") {
				if (KinkyDungeonStatStaminaMax < 70) KinkyDungeonSpells.push(KinkyDungeonFindSpell("SPUp1"));
				KinkyDungeonUpdateStats(0);
			} else if (data.type == "MP") {
				if (KinkyDungeonStatManaMax < 40) KinkyDungeonSpells.push(KinkyDungeonFindSpell("MPUp1"));
				else if (KinkyDungeonStatManaMax < 50) KinkyDungeonSpells.push(KinkyDungeonFindSpell("MPUp2"));
				else KinkyDungeonSpells.push(KinkyDungeonFindSpell("MPUp3"));
				KinkyDungeonUpdateStats(0);
			}
			break;
		case "champion":
			KDGameData.Champion = data.rep;
			KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonBecomeChampion").replace("GODDESS", TextGet("KinkyDungeonShrine" + data.rep)), "yellow", 1);
			KDSendStatus('goddess', data.rep, 'helpChampion');
			break;
		case "aid":
			KinkyDungeonChangeMana(KinkyDungeonAidManaAmount(data.rep, data.value));
			KinkyDungeonChangeRep(data.rep, -KinkyDungeonAidManaCost(data.rep));
			KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonAidManaMe"), "purple", 2);
			KDSendStatus('goddess', data.rep, 'helpMana');
			break;
		case "rescue":
			KinkyDungeonRescued[data.rep] = true;

			if (KDRandom() < 0.5 + data.value/100) {
				/*let allies = KinkyDungeonGetAllies();
				// Tie up all non-allies
				for (let e of KinkyDungeonEntities) {
					if (e.Enemy.bound && !e.Enemy.tags.has("angel")) {
						allies.push(e);
						if (!e.boundLevel) e.boundLevel = e.Enemy.maxhp;
						else e.boundLevel += e.Enemy.maxhp;
						e.hp = 0.1;
						e.rescue = true;
					}
				}
				KinkyDungeonEntities = allies;
				KDGameData.PrisonerState = '';
				KDGameData.KinkyDungeonJailGuard = 0;
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonRescueMe"), "purple", 10);
				for (let T of KinkyDungeonTiles.values()) {
					if (T.Lock) T.Lock = undefined;
					if (T.Type == "Lock") T.Type = undefined;
					if (T.Type == "Trap") T.Type = undefined;
				}*/
				let tiles = KinkyDungeonRescueTiles();
				if (tiles.length > 0) {
					KDSendStatus('goddess', data.rep, 'helpRescue');
					KinkyDungeonChangeRep(data.rep, -10);
					tile = tiles[Math.floor(tiles.length * KDRandom())];
					if (tile) {
						KinkyDungeonMapSet(tile.x, tile.y, "$");
						KinkyDungeonTiles.set(tile.x + "," + tile.y, {Type: "Angel"});
						KDStartDialog("AngelHelp","Angel", true, "");
					}
					KDGameData.RescueFlag = true;
				}
			} else {
				KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonNoRescue"), "purple", 10);
				KDSendStatus('goddess', data.rep, 'helpNoRescue');
			}
			break;
		case "penance":
			KDGameData.KinkyDungeonPenance = true;
			KDGameData.KDPenanceMode = "";
			KDGameData.KDPenanceStage = 0;
			KDGameData.KDPenanceStageEnd = 0;
			KDGameData.AngelCurrentRep = data.rep;
			KinkyDungeonSendTextMessage(10, TextGet("KinkyDungeonPenanceHappen"), "purple", 4);
			KDGameData.KinkyDungeonPenanceCostCurrent = KinkyDungeonPenanceCosts[data.rep] ? KinkyDungeonPenanceCosts[data.rep] : KinkyDungeonPenanceCostDefault;
			if (KinkyDungeonGold >= KDGameData.KinkyDungeonPenanceCostCurrent) {
				if (KinkyDungeonPenanceCosts[data.rep]) KinkyDungeonPenanceCosts[data.rep] += KinkyDungeonPenanceCostGrowth;
				else KinkyDungeonPenanceCosts[data.rep] = KinkyDungeonPenanceCostDefault + KinkyDungeonPenanceCostGrowth;
			}
			KDSendStatus('goddess', data.rep, 'helpPenance');
			break;
		case "spellChoice":
			KinkyDungeonSpellChoices[data.I] = data.CurrentSpell;
			KinkyDungeonSpellChoicesToggle[data.I] = !KinkyDungeonSpells[KinkyDungeonSpellChoices[data.I]].defaultOff;
			if (KinkyDungeonSpellChoicesToggle[data.I] && KinkyDungeonSpells[KinkyDungeonSpellChoices[data.I]].costOnToggle) {
				if (KinkyDungeonHasMana(KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[data.I]]))) {
					KinkyDungeonChangeMana(-KinkyDungeonGetManaCost(KinkyDungeonSpells[KinkyDungeonSpellChoices[data.I]]));
				} else KinkyDungeonSpellChoicesToggle[data.I] = false;
			}
			if (KinkyDungeonStatsChoice.has("Disorganized")) {
				KinkyDungeonAdvanceTime(1);
				KinkyDungeonSlowMoveTurns = 2;
			} else if (!KinkyDungeonStatsChoice.has("QuickScribe"))
				KinkyDungeonAdvanceTime(1);
			break;
		case "spellRemove":
			KinkyDungeonSpellChoices[data.I] = -1;
			KinkyDungeonSpellChoicesToggle[data.I] = true;
			break;
		case "spellCastFromBook": {
			let spell = KinkyDungeonHandleSpellCast(KinkyDungeonSpells[data.CurrentSpell]);
			if (spell && !(KinkyDungeonSpells[data.CurrentSpell].type == "passive") && !KinkyDungeonSpells[data.CurrentSpell].passive) {
				if (KinkyDungeonStatsChoice.has("Disorganized")) {
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSlowMoveTurns = 2;
				} else if (!KinkyDungeonStatsChoice.has("QuickScribe"))
					KinkyDungeonAdvanceTime(1);
				KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellTarget" + spell.name).replace("SpellArea", "" + Math.floor(spell.aoe)), "white", 0.1, true);
			}
			break;
		}
		case "spellLearn": {
			let spell = KinkyDungeonFindSpell(data.SpellName, true);
			let cost = KinkyDungeonGetCost(spell);
			if (KinkyDungeonCheckSpellSchool(spell)) {
				if (KinkyDungeonSpellPoints >= cost) {
					KinkyDungeonSpellPoints -= cost;
					KinkyDungeonSpells.push(spell);
					KDSendStatus('learnspell', spell.name);
					KinkyDungeonSetMaxStats();
					if (KinkyDungeonSound && KinkyDungeonIsPlayer()) AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
					KinkyDungeonCurrentPage = KinkyDungeonSpellIndex(spell.name);
					if (KinkyDungeonStatsChoice.has("Disorganized")) {
						KinkyDungeonAdvanceTime(1);
						KinkyDungeonSlowMoveTurns = 2;
					} else if (!KinkyDungeonStatsChoice.has("QuickScribe"))
						KinkyDungeonAdvanceTime(1);
					if (KinkyDungeonIsPlayer()) {
						KinkyDungeonPreviewSpell = undefined;
						if (KinkyDungeonTextMessageTime > 0)
							KinkyDungeonDrawState = "Game";
					}
				} else if (KinkyDungeonIsPlayer()) KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellsNotEnoughPoints"), "orange", 1);
			} else if (KinkyDungeonIsPlayer()) KinkyDungeonSendActionMessage(5, TextGet("KinkyDungeonSpellsNotEnoughLevels").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + spell.school)), "orange", 1);
			break;
		}
		case "chargerInteract":
			if (data.action == "charge") {
				if (KinkyDungeonInventoryGet("AncientPowerSourceSpent") && KinkyDungeonGold >= KDRechargeCost) {
					KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
					KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSourceSpent, -1);
					KinkyDungeonAddGold(-KDRechargeCost);
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChargerChargeSuccess").replace("VALUE", "" + KDRechargeCost), "yellow", 1);
					let x = parseInt(data.targetTile.split(',')[0]);
					let y = parseInt(data.targetTile.split(',')[1]);
					if (x && y) {
						KinkyDungeonTiles.delete(data.targetTile);
						KinkyDungeonMapSet(x, y, '-');
					}
					return "Pass";
				} else {
					KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChargerChargeFailure"), "orange", 1);
					return "Fail";
				}
			} else if (data.action == "place") {
				tile = KinkyDungeonTiles.get(data.targetTile);
				if (tile && tile.Type == "Charger" && KinkyDungeonInventoryGet("AncientPowerSource")) {
					KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, -1);
					tile.Light = KDChargerLight;
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChargerPlace"), "yellow", 1);
					let x = parseInt(data.targetTile.split(',')[0]);
					let y = parseInt(data.targetTile.split(',')[1]);
					if (x && y) {
						KinkyDungeonMapSet(x, y, '=');
					}
				}
			} else if (data.action == "remove") {
				tile = KinkyDungeonTiles.get(data.targetTile);
				if (tile && tile.Type == "Charger" && tile.Light > 0) {
					KinkyDungeonChangeConsumable(KinkyDungeonConsumables.AncientPowerSource, 1);
					tile.Light = undefined;
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonSendActionMessage(10, TextGet("KinkyDungeonChargerRemove"), "yellow", 1);
					let x = parseInt(data.targetTile.split(',')[0]);
					let y = parseInt(data.targetTile.split(',')[1]);
					if (x && y) {
						KinkyDungeonMapSet(x, y, '+');
					}
				}
			}
			break;
		case "dialogue": {
			if (!KDGameData.CurrentDialogMsgData) KDGameData.CurrentDialogMsgData = {};
			if (!KDGameData.CurrentDialogMsgValue) KDGameData.CurrentDialogMsgValue = {};

			KDGameData.CurrentDialog = data.dialogue;
			KDGameData.CurrentDialogStage = data.dialogueStage;
			if (data.speaker) {
				let oldSpeaker = KDGameData.CurrentDialogMsgSpeaker;
				KDGameData.CurrentDialogMsgSpeaker = data.speaker;
				if (KDGameData.CurrentDialogMsgSpeaker != oldSpeaker)
					KDGameData.CurrentDialogMsgPersonality = ""; // Reset when speaker changes
			}
			if (data.enemy) {
				KDGameData.CurrentDialogMsgID = data.enemy;
			}
			if (data.personality)
				KDGameData.CurrentDialogMsgPersonality = data.personality;

			let dialogue = KDGetDialogue();
			if (dialogue.data) KDGameData.CurrentDialogMsgData = dialogue.data;
			if (dialogue.response) KDGameData.CurrentDialogMsg = dialogue.response;
			if (dialogue.response == "Default") dialogue.response = KDGameData.CurrentDialog + KDGameData.CurrentDialogStage;
			if (dialogue.personalities) {
				KDDialogueApplyPersonality(dialogue.personalities);
			}
			if (data.click) {
				let gagged = KDDialogueGagged();
				if (dialogue.gagFunction && gagged) {
					dialogue.gagFunction();
				} else if (dialogue.clickFunction) {
					dialogue.clickFunction(gagged);
				}
			}
			if (dialogue.exitDialogue) {
				KDGameData.CurrentDialog = "";
				KDGameData.CurrentDialogStage = "";
			} else {
				let modded = false;
				if (dialogue.leadsTo != undefined) {
					KDGameData.CurrentDialog = dialogue.leadsTo;
					KDGameData.CurrentDialogStage = "";
					modded = true;
				}
				if (dialogue.leadsToStage != undefined) {
					KDGameData.CurrentDialogStage = dialogue.leadsToStage;
					modded = true;
				}
				if (modded && !dialogue.dontTouchText) {
					dialogue = KDGetDialogue();
					if (dialogue.response) KDGameData.CurrentDialogMsg = dialogue.response;
					if (dialogue.response == "Default") dialogue.response = KDGameData.CurrentDialog + KDGameData.CurrentDialogStage;
				}
			}
			break;
		}
	}
	return "";
}

/**
 *
 * @param {string} type
 * @param {any} data
 * @returns {string}
 */
function KDSendInput(type, data) {
	KinkyDungeonInputQueue.push({type: type, data: data});
	return KDProcessInputs(true);
}

/**
 * Handles inputs once per frame
 * @returns {string}
 */
function KDProcessInputs(ReturnResult) {
	if (KinkyDungeonInputQueue.length > 0) {
		let input = KinkyDungeonInputQueue.splice(0, 1)[0];
		if (input) {
			let res = KDProcessInput(input.type, input.data);
			if (ReturnResult) return res;
		}


	}
	return "";
}