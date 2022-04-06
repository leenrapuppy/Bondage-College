"use strict";

// Outfit resource, uncached
let KinkyDungeonOutfitsBase = [
	{name: "OutfitDefault", dress: "Default", shop: false, rarity: 1},
	{name: "JailUniform", dress: "JailUniform", shop: false, rarity: 1},
];
// For cacheing
let KinkyDungeonOutfitCache = new Map();

function KinkyDungeonRefreshOutfitCache() {
	KinkyDungeonOutfitCache = new Map();
	for (let r of KinkyDungeonOutfitsBase) {
		KinkyDungeonOutfitCache.set(r.name, r);
	}
}

// Default dress (witch hat and skirt and corset)
let KinkyDungeonDefaultDefaultDress = [
	{Item: "WitchHat1", Group: "Hat", Color: "Default", Lost: false},
	{Item: "LeatherCorsetTop1", Group: "Cloth", Color: "Default", Lost: false},
	{Item: "LatexSkirt1", Group: "ClothLower", Color: "Default", OverridePriority: 17, Lost: false, Skirt: true},
	{Item: "Socks4", Group: "Socks", Color: "#444444", Lost: false},
	{Item: "Heels3", Group: "Shoes", Color: "#222222", Lost: false},
	{Item: "KittyPanties1", Group: "Panties", Color: "#222222", Lost: false},
	{Item: "FullLatexBra", Group: "Bra", Color: "Default", Lost: false},
	{Item: "LatexElbowGloves", Group: "Gloves", Color: "Default", Lost: false},
	{Item: "Necklace4", Group: "Necklace", Color: "#222222", Lost: false},
];

// This is a flag that checks if the script should check for clothes loss
let KinkyDungeonCheckClothesLoss = false;

// Return all dresses so theres no longer any Lost items
function KinkyDungeonInitializeDresses() {
	KinkyDungeonCheckClothesLoss = true;
	KinkyDungeonUndress = 0;
	if (Object.values(KinkyDungeonDresses).length > 0) {
		for (let d of Object.values(KinkyDungeonDresses)) {
			for (let dd of d) {
				if (dd.Lost) dd.Lost = false;
			}
		}
	}

}

let KinkyDungeonNewDress = false;

// Sets the player's dress to whatever she is wearing
function KinkyDungeonDressSet() {
	if (KinkyDungeonNewDress) {
		KinkyDungeonDresses.Default = [];
		let C = KinkyDungeonPlayer;
		for (let A = 0; A < C.Appearance.length; A++) {
			let save = false;
			if (C.Appearance[A].Asset.Group.BodyCosplay || C.Appearance[A].Asset.BodyCosplay) save = true;
			else if (C.Appearance[A].Asset.Group.Underwear) save = true;
			else if (C.Appearance[A].Asset.Group.Clothing) save = true;
			if (save) {
				KinkyDungeonDresses.Default.push({
					Item: C.Appearance[A].Asset.Name,
					Group: C.Appearance[A].Asset.Group.Name,
					Color: (C.Appearance[A].Color) ? C.Appearance[A].Color : (C.Appearance[A].Asset.DefaultColor ? C.Appearance[A].Asset.DefaultColor : "Default"),
					Lost: false,
				},);
			}
		}
	}
	KinkyDungeonNewDress = false;
}

function KinkyDungeonSetDress(Dress, Outfit) {
	if (Outfit) KDGameData.Outfit = Outfit;
	KinkyDungeonCurrentDress = Dress;
	if (KinkyDungeonDresses) {
		for (let clothes of KinkyDungeonDresses[KinkyDungeonCurrentDress]) {
			clothes.Lost = false;
		}
		KinkyDungeonCheckClothesLoss = true;
		KinkyDungeonDressPlayer();
		KDRefresh = true;
	}
}

let KDNaked = false;
let KDRefresh = false;

function KinkyDungeonDressPlayer() {
	let _CharacterRefresh = CharacterRefresh;
	let _CharacterAppearanceBuildCanvas = CharacterAppearanceBuildCanvas;
	// @ts-ignore
	CharacterRefresh = () => {KDRefresh = true;};
	// @ts-ignore
	CharacterAppearanceBuildCanvas = () => {};

	if (KinkyDungeonCheckClothesLoss) {
		KinkyDungeonPlayer.OnlineSharedSettings = {BlockBodyCosplay: true};
		if (!KDNaked)
			CharacterNaked(KinkyDungeonPlayer);
		KDNaked = true;
		KinkyDungeonUndress = 0;
	}

	for (let clothes of KinkyDungeonDresses[KinkyDungeonCurrentDress]) {

		if (!clothes.Lost && KinkyDungeonCheckClothesLoss) {
			if (clothes.Group == "Necklace") {
				if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemArms") && InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemBreast")) clothes.Lost = true;
			}
			//if (clothes.Group == "Bra" && !clothes.NoLose) {
			//if (KinkyDungeonGetRestraintItem("ItemBreast")) clothes.Lost = true;
			//}
			if (clothes.Group == "Panties" && !clothes.NoLose) {
				if (KinkyDungeonGetRestraintItem("ItemPelvis") && KinkyDungeonGetRestraintItem("ItemPelvis") && KinkyDungeonGetRestraintItem("ItemPelvis").restraint.chastity) clothes.Lost = true;
			}
			if (clothes.Group == "ClothLower" && clothes.Skirt) {
				//if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemPelvis")) clothes.Lost = true;
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemLegs")) clothes.Lost = true;
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ClothLower")) clothes.Lost = true;
			}
			if (clothes.Group == "Shoes") {
				if (KinkyDungeonGetRestraintItem("ItemBoots")) clothes.Lost = true;
			}
			for (let inv of KinkyDungeonAllRestraint()) {
				if (inv.restraint && inv.restraint.remove) {
					for (let remove of inv.restraint.remove) {
						if (remove == clothes.Group) clothes.Lost = true;
					}
				}
			}

			if (clothes.Lost) KinkyDungeonUndress += 1/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;
		}

		if (!clothes.Lost) {
			if (KinkyDungeonCheckClothesLoss) {
				InventoryWear(KinkyDungeonPlayer, clothes.Item, clothes.Group);
				if (clothes.OverridePriority) {
					let item = InventoryGet(KinkyDungeonPlayer, clothes.Group);
					if (item) {
						if (!item.Property) item.Property = {OverridePriority: clothes.OverridePriority};
						else item.Property.OverridePriority = clothes.OverridePriority;
					}
				}
				CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, clothes.Color, clothes.Group);
			}
		}

		if (clothes.Group == "Panties" && !KinkyDungeonGetRestraintItem("ItemPelvis")) clothes.Lost = false; // A girl's best friend never leaves her
		if (clothes.Group == "Bra" && !KinkyDungeonGetRestraintItem("ItemBreast")) clothes.Lost = false; // A girl's best friend never leaves her
	}

	for (let inv of KinkyDungeonAllRestraint()) {
		if (KinkyDungeonCheckClothesLoss)
			if (inv.restraint && inv.restraint.AssetGroup) {
				InventoryWear(KinkyDungeonPlayer, inv.restraint.Asset, inv.restraint.AssetGroup, inv.restraint.Color);
			}
		/*if (inv.restraint && inv.restraint.forceUpperPose) {
			if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyUpper", inv.restraint.forceUpperPose)) {
				CharacterSetActivePose(KinkyDungeonPlayer, inv.restraint.forceUpperPose, false);
			}
		}
		if (inv.restraint && inv.restraint.forceLowerPose) {
			if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", inv.restraint.forceLowerPose)) {
				CharacterSetActivePose(KinkyDungeonPlayer, inv.restraint.forceUpperPose, false);
			}
		}*/
	}
	if (KinkyDungeonCheckClothesLoss)
		KinkyDungeonWearForcedClothes();

	KinkyDungeonCheckClothesLoss = false;

	if (KinkyDungeonStatStamina <= 1.1 || KDGameData.SleepTurns > 0) {
		if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && !KinkyDungeonPlayer.IsKneeling()) {
			CharacterSetActivePose(KinkyDungeonPlayer, "Kneel", false);
		}
	} else if (KDGameData.SleepTurns < 1) {
		if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && KinkyDungeonPlayer.IsKneeling()) {
			CharacterSetActivePose(KinkyDungeonPlayer, "BaseLower", false);
		}
	}

	let BlushCounter = 0;
	let Blush = "";
	let Eyes = "";
	let Eyes2 = "";
	let Eyebrows = "";
	let Mouth = "";
	let Fluids = "";

	if (KinkyDungeonDrool && !KinkyDungeonCanTalk()) {
		if (SpeechGetTotalGagLevel(KinkyDungeonPlayer) > 8) Fluids = "DroolMessy";
		else if (SpeechGetTotalGagLevel(KinkyDungeonPlayer) > 4) Fluids = "DroolMedium";
		else Fluids = "DroolLow";
	}
	if (KinkyDungeonDrool && KDGameData.KinkyDungeonLeashedPlayer > 0) {
		if (Fluids.includes("Drool")) Fluids = Fluids.replace("Drool", "DroolTears");
		else Fluids = "TearsHigh";
	}

	if (KinkyDungeonSleepiness) {
		Eyes = "Dazed";
	}

	if (KinkyDungeonStatMana < KinkyDungeonStatManaMax*0.45) Eyes = "Sad";
	if (KinkyDungeonStatStamina <= 12 || KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax/2) Eyes = "Dazed";

	if (KinkyDungeonStatDistraction > 6 || KinkyDungeonStatMana < KinkyDungeonStatManaMax*0.33) Eyebrows = "Soft";

	let chastityMult = KinkyDungeonChastityMult();
	if (KinkyDungeonStatDistraction > 24 && KinkyDungeonStatStamina > KinkyDungeonStatStaminaMax*0.5 && chastityMult > 0.9) Eyebrows = "Angry";

	if (KinkyDungeonStatDistraction >= KinkyDungeonStatDistractionMax * 0.8) Eyes = (Eyebrows != "Angry" && KinkyDungeonStatDistraction < KinkyDungeonStatDistractionMax * 0.99) ? "Lewd" : "Scared";

	if (KinkyDungeonStatDistraction >= 0.01 && KinkyDungeonStatDistraction <= 3) Eyes2 = "Closed";

	if (KDGameData.OrgasmTurns > 0) {
		Eyebrows = "Soft";
		Eyes2 = "";
		Eyes = "LewdHeart";
	} else if (KDGameData.OrgasmStamina > 0) {
		Eyebrows = "Soft";
	} else if (KDGameData.OrgasmStage > 5 && Math.random() < 0.33) {
		Eyebrows = "Angry";
	} else if (KDGameData.OrgasmStage > 3 && Math.random() < 0.33) {
		Eyebrows = "Angry";
	}

	if (KinkyDungeonStatStamina <= 4) {
		Eyes = "Dazed";
		Eyes2 = "";
	}

	if (KinkyDungeonStatDistraction > 0.01) BlushCounter += 1;
	if (KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.33) BlushCounter += 1;
	if (KinkyDungeonStatDistraction > KinkyDungeonStatDistractionMax*0.65) BlushCounter += 1;

	if (KinkyDungeonUndress > 0.4) BlushCounter += 1;
	if (KinkyDungeonUndress > 0.8) BlushCounter += 1;

	if (BlushCounter == 1) Blush = "Low";
	else if (BlushCounter == 2) Blush = "Medium";
	else if (BlushCounter == 3) Blush = "High";
	else if (BlushCounter == 4) Blush = "VeryHigh";
	else if (BlushCounter == 5) Blush = "Extreme";


	for (let A = 0; A < KinkyDungeonPlayer.Appearance.length; A++) {
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Blush") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Blush) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Blush };
				KDRefresh = true;
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyebrows") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Eyebrows) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Eyebrows };
				KDRefresh = true;
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Mouth") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Mouth) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Mouth };
				KDRefresh = true;
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Fluids") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Fluids) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Fluids };
				KDRefresh = true;
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes" || KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != ((KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2" && Eyes2) ? Eyes2 : Eyes)) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: ((KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2" && Eyes2) ? Eyes2 : Eyes) };
				KDRefresh = true;
			}
		}


	}
	// @ts-ignore
	CharacterRefresh = _CharacterRefresh;
	// @ts-ignore
	CharacterAppearanceBuildCanvas = _CharacterAppearanceBuildCanvas;
}

function KinkyDungeonWearForcedClothes() {
	for (let inv of KinkyDungeonAllRestraint()) {
		if (inv.restraint && inv.restraint.alwaysDress) {
			for (let dress of inv.restraint.alwaysDress) {
				if (dress.override || !dress.Group.includes("Item") || !InventoryGet(KinkyDungeonPlayer, dress.Group)) {
					InventoryWear(KinkyDungeonPlayer, dress.Item, dress.Group);
					if (dress.OverridePriority) {
						let item = InventoryGet(KinkyDungeonPlayer, dress.Group);
						if (item) {
							if (!item.Property) item.Property = {OverridePriority: dress.OverridePriority};
							else item.Property.OverridePriority = dress.OverridePriority;
						}
					}
					CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, dress.Color, dress.Group);
				}
			}
		}
	}
}

function KinkyDungeonGetOutfit(Name) {
	if (KinkyDungeonOutfitCache && KinkyDungeonOutfitCache.get(Name)) {
		let outfit = {};
		Object.assign(outfit, KinkyDungeonOutfitCache.get(Name));
		return outfit;
	}
	return null;
}