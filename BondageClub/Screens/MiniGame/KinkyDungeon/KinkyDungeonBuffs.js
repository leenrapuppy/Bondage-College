"use strict";

function KinkyDungeonSendBuffEvent(Event, data) {
	for (let buff of Object.values(KinkyDungeonPlayerBuffs)) {
		if (buff && buff.events) {
			for (let e of buff.events) {
				if (e.trigger == Event) {
					KinkyDungeonHandleBuffEvent(Event, e, buff, KinkyDungeonPlayerEntity, data);
				}
			}
		}
	}
	for (let ent of KinkyDungeonEntities) {
		if (ent.buffs) {
			for (let buff of Object.values(ent.buffs)) {
				if (buff && buff.events) {
					for (let e of buff.events) {
						if (e.trigger == Event) {
							KinkyDungeonHandleBuffEvent(Event, e, buff, ent, data);
						}
					}
				}
			}
		}
	}
}

// Decreases time left in buffs and also applies effects
function KinkyDungeonTickBuffs(list, delta, endFloor) {
	for (const [key, value] of Object.entries(list)) {
		if (value) {
			if (value.endFloor && endFloor) KinkyDungeonExpireBuff(list, key);
			else if (value.endSleep && KDGameData.SleepTurns > 1) KinkyDungeonExpireBuff(list, key);
			else if (!value.duration || value.duration < 0) KinkyDungeonExpireBuff(list, key);
			else {
				if (value.type == "restore_mp") KinkyDungeonChangeMana(value.power);
				if (value.type == "restore_sp") KinkyDungeonChangeStamina(value.power);
				if (value.type == "restore_ap") KinkyDungeonChangeDistraction(value.power);

				value.duration -= delta;
			}
		}
	}
}

function KinkyDungeonTickBuffTag(list, tag, Amount) {
	if (list)
		for (const [key, value] of Object.entries(list)) {
			if (value) {
				if (value.maxCount && value.tags.includes(tag)) {
					if (!value.currentCount) value.currentCount = 0;
					value.currentCount += Amount;
					if (value.currentCount >= value.maxCount) KinkyDungeonExpireBuff(list, key);
				}
			}
		}
}

// Updates buffs for all creatures
function KinkyDungeonUpdateBuffs(delta, endFloor) {
	// Tick down buffs the buffs
	KinkyDungeonSendEvent("tickBuffs", {delta: delta});
	KinkyDungeonTickBuffs(KinkyDungeonPlayerBuffs, delta, endFloor);
	for (let enemy of KinkyDungeonEntities) {
		if (!enemy.buffs) enemy.buffs = {};
		KinkyDungeonTickBuffs(enemy.buffs, delta);
	}

	// Apply the buffs
	for (let b of KinkyDungeonBullets) {
		if (b.bullet.spell && b.bullet.spell.buffs) { // Apply the buff
			for (let buff of b.bullet.spell.buffs) {

				if (buff.player && buff.range >= Math.sqrt((KinkyDungeonPlayerEntity.x - b.x) * (KinkyDungeonPlayerEntity.x - b.x) + (KinkyDungeonPlayerEntity.y - b.y) * (KinkyDungeonPlayerEntity.y - b.y))) {
					KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff);
				}
				if (buff.enemies) {
					for (let enemy of KinkyDungeonEntities) {
						if ((KDHostile(enemy) || !buff.noAlly) && (KDAllied(enemy) || !buff.onlyAlly) && buff.range >= Math.sqrt((enemy.x - b.x) * (enemy.x - b.x) + (enemy.y - b.y) * (enemy.y - b.y))) {
							KinkyDungeonApplyBuff(enemy.buffs, buff);
						}
					}

				}
			}
		}
	}
}

function KinkyDungeonGetBuffedStat(list, Stat) {
	let stat = 0;
	if (list)
		for (let buff of Object.values(list)) {
			if (buff && buff.type == Stat) {
				stat += buff.power;
			}
		}
	return stat;
}

function KinkyDungeonExpireBuff(list, key) {
	delete list[key];
}

function KinkyDungeonApplyBuff(list, origbuff) {
	if (!origbuff) return;
	let buff = {};
	Object.assign(buff, origbuff);
	let id = buff.id ? buff.id : buff.name;

	if (list[id] && buff.cancelOnReapply) {
		KinkyDungeonExpireBuff(list, id);
	} else {
		if (!list[id] || (list[id].power && buff.power > list[id].power)) list[id] = buff;
		if ((list[id].power && buff.power == list[id].power && buff.duration > list[id].duration)) list[id].duration = buff.duration;

		if (buff.tags)
			for (let tag of buff.tags) {
				if (tag == "darkness" && list == KinkyDungeonPlayerBuffs) {
					KinkyDungeonBlindLevelBase = Math.max(KinkyDungeonBlindLevelBase, 1);
				} else if (tag == "heavydarkness" && list == KinkyDungeonPlayerBuffs) {
					KinkyDungeonBlindLevelBase = Math.max(KinkyDungeonBlindLevelBase, 2);
				}
			}
	}
}

function KinkyDungeonHasBuff(list, Buff) {
	if (list && list[Buff]) return true;
	else return false;
}
