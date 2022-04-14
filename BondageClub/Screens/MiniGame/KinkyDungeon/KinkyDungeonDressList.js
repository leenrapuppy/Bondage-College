"use strict";
/**
 * List off all dresses items
 * @type {Object.<string,KinkyDungeonDress>}
 */
let KinkyDungeonDresses = {
	"Default" : KinkyDungeonDefaultDefaultDress,
	"Prisoner" : [
		{Item: "SleevelessCatsuit", Group: "Suit", Color: "#8A120C", Lost: false},
		{Item: "CatsuitPanties", Group: "SuitLower", Color: "#8A120C", Lost: false},
		{Item: "Heels1", Group: "Shoes", Color: "#8A120C", Lost: false},
		{Item: "Socks4", Group: "Socks", Color: "#222222", Lost: false},
	],
	"GreenLeotard" : [
		{Item: "SleevelessCatsuit", Group: "Suit", Color: "#267237", Lost: false},
		{Item: "CatsuitPanties", Group: "SuitLower", Color: "#267237", Lost: false},
	],
	"Leotard" : [
		{Item: "SleevelessCatsuit", Group: "Suit", Color: "#53428D", Lost: false},
		{Item: "CatsuitPanties", Group: "SuitLower", Color: "#53428D", Lost: false},
	],
	"Bikini" : [
		{Item: "KittyPanties1", Group: "Panties", Color: "#050505", Lost: false},
		{Item: "FullLatexBra", Group: "Bra", Color: "Default", Lost: false},
	],
	"Lingerie" : [
		{Item: "LaceBabydoll", Group: "Cloth", Color: "Default", Lost: false},
		{Item: "Bandeau1", Group: "Bra", Color: "Default", Lost: false},
		{Item: "FloralPanties2", Group: "Panties", Color: ['#303030', '#F0F0F0'], Lost: false},
	],
	"LatexPrisoner" : [
		{Item: "LatexPanties2", Group: "Panties", Color: "Default", Lost: false},
		{Item: "LatexCorset1", Group: "Corset", Color: "Default", Lost: false},
		{Item: "FullLatexBra", Group: "Bra", Color: "Default", Lost: false},
		{Item: "Heels1", Group: "Shoes", Color: "#222222", Lost: false},
		{Item: "LatexSocks1", Group: "Socks", Color: "Default", Lost: false},
	],
	"Dungeon" : [
		{Item: "Bandeau1", Group: "Bra", Color: "Default", Lost: false},
		{Item: "Pantyhose1", Group: "SuitLower", Color: "Default", Lost: false},
		{Item: "Corset5", Group: "Corset", Color: "#777777", Lost: false},
		{Item: "AnkleStrapShoes", Group: "Shoes", Color: "#2D2D2D", Lost: false},
		{Item: "FloralPanties2", Group: "Panties", Color: ['#303030', '#F0F0F0'], Lost: false},
	],
	"Egyptian" : [
		{Item: "Sarashi1", Group: "Bra", Color: "Default", Lost: false},
		{Item: "Panties7", Group: "Panties", Color: "#ffffff", Lost: false},
		{Item: "Sandals", Group: "Shoes", Color: "Default", Lost: false},
		{Item: "FaceVeil", Group: "Mask", Color: "#ffffff", Lost: false},
		{Item: "HaremPants", Group: "ClothLower", Color: "Default", OverridePriority: 28, Lost: false},
	],
	"Dragon" : [
		{Item: "Sarashi1", Group: "Bra", Color: "#444444", Lost: false},
		{Item: "SunstripePanties1", Group: "Panties", Color: "#EC1515", Lost: false},
		{Item: "LatexAnkleShoes", Group: "Shoes", Color: "#AC1818", Lost: false},
		{Item: "Corset4", Group: "Corset", Color: "#AC1818", Lost: false},
		{Item: "LatexTop", Group: "Cloth", Color: "#AC1818", Lost: false},
		{Item: "GarterBelt2", Group: "Garters", Color: "Default", Lost: false},
	],
	"SlimeSuit" : [
		{Item: "SeamlessCatsuit", Group: "Suit", Color: "#7F3C9B", Lost: false},
		{Item: "SeamlessCatsuit", Group: "SuitLower", Color: "#7F3C9B", Lost: false},
		{Item: "Catsuit", Group: "Gloves", Color: "#7F3C9B", Lost: false},
	],
	"BlueSuit" : [
		{Item: "SeamlessCatsuit", Group: "Suit", Color: "#3873C3", Lost: false},
		{Item: "SeamlessCatsuit", Group: "SuitLower", Color: "#3873C3", Lost: false},
		{Item: "Catsuit", Group: "Gloves", Color: "#3873C3", Lost: false},
	],
	"BlueSuitPrison" : [
		{Item: "SeamlessCatsuit", Group: "Suit", Color: "#3873C3", Lost: false},
		{Item: "SeamlessCatsuit", Group: "SuitLower", Color: "#3873C3", Lost: false},
		{Item: "Catsuit", Group: "Gloves", Color: "#3873C3", Lost: false},
		{Item: "FaceVeil", Group: "Mask", Color: "#ffffff", Lost: false},
	],
	"Wolfgirl" : [
		{Item: "PilotSuit", Group: "Suit", Color: ['#828FA2', '#323332', '#223525', '#383838', 'Default'], Lost: false},
		{Item: "PilotPanties", Group: "SuitLower", Color: ['#828FA2', '#323332', '#223525'], Lost: false},
		{Item: "LatexSocks1", Group: "Socks", Color: "#AAAAAA", Lost: false},
	],
	"Maid" : [
		{Item: "SleevelessCatsuit", Group: "Suit", Color: "#aaaaaa", Lost: false},
		{Item: "MaidApron2", Group: "Cloth", Color: "Default", Lost: false},
		{Item: "FullLatexBra2", Group: "Bra", Color: ["#333333", "#aaaaaa"], Lost: false},
		{Item: "Pantyhose2", Group: "SuitLower", Color: "#939393", Lost: false},
		{Item: "LaceBands", Group: "Bracelet", Color: ['Default', '#151515'], Lost: false},
		{Item: "MageSkirt", Group: "ClothLower", Color: ["#676767", "#2E2E2E"], Lost: false},
		{Item: "Corset4", Group: "Corset", Color: "#4B4B4B", Lost: false},
		{Item: "Band1", Group: "Hat", Color: "#767676", Lost: false},
		{Item: "Shoes5", Group: "Shoes", Color: "#575757", Lost: false},
		{Item: "Socks6", Group: "Socks", Color: ['#080808', 'Default'], Lost: false},
	],
	"Elven" : [
		{Item: "Swimsuit1", Group: "Bra", Color: ['#E2E2E2'], Lost: false, NoLose: true},
		{Item: "Corset4", Group: "Corset", Color: ['#FFFFFF'], Lost: false},
		{Item: "Stockings4", Group: "Socks", Color: "#000000", Lost: false},
		{Item: "FaceVeil", Group: "Mask", Color: "Default", Lost: false},
		{Item: "HairFlower1", Group: "HairAccessory3", Color: 'Default', Lost: false},
		{Item: "NecklaceKey", Group: "Necklace", Color: "Default", Lost: false},
		{Item: "MageSkirt", Group: "ClothLower", Color: ['#40824F', '#AF9225'], OverridePriority: 27, Lost: false},
		{Item: "Heels1", Group: "Shoes", Color: "#aaaaaa", Lost: false},
	],
};
