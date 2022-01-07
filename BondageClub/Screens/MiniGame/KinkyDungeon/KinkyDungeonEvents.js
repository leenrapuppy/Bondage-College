"use strict";

let KinkyDungeonSlimeLevel = 0;
let KinkyDungeonSlimeLevelStart = 0;
let KinkyDungeonSlimeParts = [
	{group: "ItemHead", restraint: "SlimeHead"},
	{group: "ItemArms", restraint: "SlimeArms"},
	{group: "ItemHands", restraint: "SlimeHands"},
	{group: "ItemLegs", restraint: "SlimeLegs"},
	{group: "ItemFeet", restraint: "SlimeFeet"},
	{group: "ItemBoots", restraint: "SlimeBoots"},
];

function KinkyDungeonResetEventVariables() {
	KinkyDungeonSlimeLevel = 0;
}
function KinkyDungeonResetEventVariablesTick() {
	if (KinkyDungeonSlimeLevel < 0)
		KinkyDungeonSlimeLevel = 0;
	KinkyDungeonSlimeLevelStart = KinkyDungeonSlimeLevel;
}

function KinkyDungeonHandleInventoryEvent(Event, item, data) {
	if (Event == "tick") {
		for (let e of item.events) {



			if (e.type == "slimeSpread") {
				KinkyDungeonSlimeLevel = Math.max(KinkyDungeonSlimeLevel, KinkyDungeonSlimeLevelStart + e.power);
				if (KinkyDungeonSlimeLevel >= 0.99999) {
					KinkyDungeonSlimeLevel = 0;
					KinkyDungeonSlimeLevelStart = -100;
					let slimedParts = [];
					let potentialSlimeParts = [];
					for (let inv of KinkyDungeonRestraintList()) {
						if (inv.restraint && inv.restraint.slimeLevel > 0) {
							slimedParts.push({group: inv.restraint.Group, level: inv.restraint.slimeLevel});
						}
					}
					for (let slime of slimedParts) {
						let index = -1;
						for (let i = 0; i < KinkyDungeonSlimeParts.length; i++) if (KinkyDungeonSlimeParts[i].group == slime.group) {index = i; break;}
						if (index >= 0) {
							let slime2 = undefined;
							let slime3 = undefined;
							if (index > 0) {
								for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index-1].group && !s.level > slime.level) {slime2 = s; break;}
								if (!slime2) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index-1].group, restraint: KinkyDungeonSlimeParts[index-1].restraint, level: slime.level});
							}
							if (index < KinkyDungeonSlimeParts.length - 1) {
								for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index+1].group && !s.level > slime.level) {slime3 = s; break;}
								if (!slime3) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index+1].group, restraint: KinkyDungeonSlimeParts[index+1].restraint, level: slime.level});
							}
						}
					}
					if (potentialSlimeParts.length == 0) {
						KinkyDungeonSlimeLevel = Math.min(KinkyDungeonSlimeLevel, 0.5);
						KinkyDungeonSlimeLevelStart = Math.min(KinkyDungeonSlimeLevelStart, 0.5);
					} else while (potentialSlimeParts.length > 0) {
						let newSlime = potentialSlimeParts[Math.floor(Math.random() * potentialSlimeParts.length)];
						if (newSlime) {
							let added = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(newSlime.restraint), 0, true);
							if (added) {
								KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
								potentialSlimeParts = [];
								KinkyDungeonSlimeLevel = -100;
							}
						}
						potentialSlimeParts.splice(potentialSlimeParts.indexOf(newSlime), 1);
					}
				}
			}



		}
	}
}

function KinkyDungeonHandleBuffEvent(Event, buff, entity, data) {

}
