"use strict";

/**
 * @type {Record<string, consumable>}
 */
let KinkyDungeonConsumables = {
	"PotionMana" : {name: "PotionMana", potion: true, rarity: 0, shop: true, type: "restore", mp_instant: 36, mp_gradual: 0, scaleWithMaxMP: true, duration: 0, sfx: "PotionDrink"},
	"PotionStamina" : {name: "PotionStamina", potion: true, rarity: 1, shop: true, type: "restore", sp_instant: 12, sp_gradual: 24, scaleWithMaxSP: true, duration: 12, sfx: "PotionDrink"},
	"PotionFrigid" : {name: "PotionFrigid", potion: true, rarity: 1, shop: true, type: "restore", ap_instant: -72, ap_gradual: 0, duration: 0, sfx: "PotionDrink"},
	"SmokeBomb" : {name: "SmokeBomb", noHands: true, rarity: 2, costMod: -1, shop: true, type: "spell", spell: "Shroud", sfx: "FireSpell"},
	"PotionInvisibility" : {name: "PotionInvisibility", potion: true, rarity: 3, costMod: -1, shop: true, type: "spell", spell: "Invisibility", sfx: "PotionDrink"},
	"EarthRune" : {name: "EarthRune", rarity: 2, costMod: -1, shop: false, type: "spell", spell: "Earthrune", sfx: "HeavySwing"},
	"WaterRune" : {name: "WaterRune", rarity: 2, costMod: -1, shop: false, type: "spell", spell: "Waterrune", sfx: "HeavySwing"},
	"Bola" : {name: "Bola", rarity: 0, costMod: -1, shop: false, useQuantity: 1, noConsumeOnUse: true, type: "targetspell", spell: "PlayerBola"},
	"IceRune" : {name: "IceRune", rarity: 2, costMod: -1, shop: false, type: "spell", spell: "Icerune", sfx: "Freeze"},
	"Bomb" : {name: "Bomb", rarity: 1, costMod: -1, shop: false, type: "spell", spell: "Bomb", sfx: "MagicSlash"},
	"ElfCrystal" : {name: "ElfCrystal", noHands: true, rarity: 3, costMod: -1, shop: false, type: "spell", spell: "Slippery", sfx: "MagicSlash"},
	"EnchantedGrinder" : {name: "EnchantedGrinder", noHands: true, rarity: 4, shop: true, type: "spell", spell: "Cutting", sfx: "Laser"},
	"MistressKey" : {name: "MistressKey", rarity: 10, shop: false, type: "unusuable"},
	"AncientPowerSource" : {name: "AncientPowerSource", noHands: true, rarity: 4, shop: true, type: "charge", amount: 0.251},
	"AncientPowerSourceSpent" : {name: "AncientPowerSourceSpent", noHands: true, rarity: 4, shop: false, type: "recharge"},
	"ScrollArms" : {name: "ScrollArms", noHands: true, rarity: 2, shop: true, type: "buff", buff: "NoArmsComp", duration: 12, power: 1, aura: "#aaffaa", sfx: "FireSpell"},
	"ScrollVerbal" : {name: "ScrollVerbal", noHands: true, rarity: 2, shop: true, type: "buff", buff: "NoVerbalComp", duration: 12, power: 1, aura: "#aaaaff", sfx: "FireSpell"},
	"ScrollLegs" : {name: "ScrollLegs", noHands: true, rarity: 2, shop: true, type: "buff", buff: "NoLegsComp", duration: 12, power: 1, aura: "#ffaaaa", sfx: "FireSpell"},
	"ScrollPurity" : {name: "ScrollPurity", noHands: true, rarity: 4, costMod: -1, shop: true, type: "shrineRemove", shrine: "Vibes", sfx: "FireSpell"},
};

let KDRechargeCost = 100;

let KinkyDungneonBasic = {
	"RedKey" : {name: "RedKey", rarity: 0, shop: true},
	"BlueKey" : {name: "BlueKey", rarity: 2, costMod: 2, shop: true},
	"Lockpick" : {name: "Lockpick", rarity: 0, shop: true},
	//"4Lockpick" : {name: "4Lockpick", rarity: 1, shop: true},
	"Knife" : {name: "Knife", rarity: 0, shop: true},
	"3Bola" : {name: "3Bola", consumable: "Bola", quantity: 3, rarity: 0, shop: true},
	"3Bomb" : {name: "3Bomb", consumable: "Bomb", quantity: 3, rarity: 1, shop: true},
	"MagicKnife" : {name: "MagicKnife", rarity: 4, shop: true},
	//"PotionCollar" : {name: "PotionCollar", rarity: 2, shop: true},
};

let KinkyDungneonShopRestraints = {
	"SlimeWalkers" : {name: "SlimeWalkers", rarity: 2, shop: true},
	"PotionCollar" : {name: "PotionCollar", rarity: 2, shop: true},
};