"use strict";

var KinkyDungeonDressesList = {};

var KinkyDungeonCheckClothesLoss = false;

function KinkyDungeonInitializeDresses() {
	KinkyDungeonCheckClothesLoss = true;
	KinkyDungeonUndress = 0;
	KinkyDungeonDresses = {
		"Default" : [
			{Item: "WitchHat1", Group: "Hat", Color: "Default", Lost: false},
			{Item: "LeatherCorsetTop1", Group: "Cloth", Color: "Default", Lost: false},
			{Item: "LatexSkirt1", Group: "ClothLower", Color: "Default", OverridePriority: 17, Lost: false, Skirt: true},
			{Item: "Socks4", Group: "Socks", Color: "#444444", Lost: false},
			{Item: "Heels3", Group: "Shoes", Color: "#222222", Lost: false},
			{Item: "KittyPanties1", Group: "Panties", Color: "#222222", Lost: false},
			{Item: "FrameBra2", Group: "Bra", Color: "Default", Lost: false},
			{Item: "LatexElbowGloves", Group: "Gloves", Color: "Default", Lost: false},
			{Item: "Necklace4", Group: "Necklace", Color: "#222222", Lost: false},
		],
		"Prisoner" : [
			{Item: "SleevelessCatsuit", Group: "Suit", Color: "#8A120C", Lost: false},
			{Item: "CatsuitPanties", Group: "SuitLower", Color: "#8A120C", Lost: false},
			{Item: "Heels1", Group: "Shoes", Color: "#8A120C", Lost: false},
			{Item: "Socks4", Group: "Socks", Color: "#222222", Lost: false},
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
			//{Item: "FloralPanties2", Group: "Panties", Color: ['#303030', '#F0F0F0'], Lost: false},
		],
		"Egyptian" : [
			{Item: "Sarashi1", Group: "Bra", Color: "Default", Lost: false},
			{Item: "Panties7", Group: "Panties", Color: "#ffffff", Lost: false},
			{Item: "Sandals", Group: "Shoes", Color: "Default", Lost: false},
			{Item: "FaceVeil", Group: "Mask", Color: "#ffffff", Lost: false},
			{Item: "HaremPants", Group: "ClothLower", Color: "Default", OverridePriority: 28, Lost: false},
		],
	};
}

function KinkyDungeonSetDress(Dress) {
	KinkyDungeonCurrentDress = Dress;
	for (let C = 0; C < KinkyDungeonDresses[KinkyDungeonCurrentDress].length; C++) {
		let clothes = KinkyDungeonDresses[KinkyDungeonCurrentDress][C];
		clothes.lost = false;
	}
}

function KinkyDungeonDressPlayer() {
	if (KinkyDungeonCheckClothesLoss) {
		CharacterNaked(KinkyDungeonPlayer);
		KinkyDungeonUndress = 0;
	}

	for (let C = 0; C < KinkyDungeonDresses[KinkyDungeonCurrentDress].length; C++) {
		let clothes = KinkyDungeonDresses[KinkyDungeonCurrentDress][C];
		let PreviouslyLost = clothes.Lost;

		if (!clothes.Lost && KinkyDungeonCheckClothesLoss) {
			if (clothes.Group == "Necklace" || clothes.Group == "Bra") {
				if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemBreast")) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemArms") && InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemBreast")) clothes.Lost = true;
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

			if (clothes.Lost) KinkyDungeonUndress += 1/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;
		}

		if (clothes.Lost != PreviouslyLost) KinkyDungeonStatArousal += 10/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;

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
	}

	KinkyDungeonCheckClothesLoss = false;

	if (KinkyDungeonStatStamina <= 1.1 || KinkyDungeonSleepTurns > 0) {
		if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && !KinkyDungeonPlayer.IsKneeling()) {
			CharacterSetActivePose(KinkyDungeonPlayer, "Kneel", false);
		}
	} else if (KinkyDungeonSleepTurns < 1) {
		if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && KinkyDungeonPlayer.IsKneeling()) {
			CharacterSetActivePose(KinkyDungeonPlayer, "BaseLower", false);
		}
	}

	let BlushCounter = 0;
	let Blush = "";
	let Eyes = "";
	let Eyes2 = "";
	let Eyebrows = "";

	if (KinkyDungeonStatMana < KinkyDungeonStatManaMax*0.45) Eyes = "Sad";
	if (KinkyDungeonStatStamina <= 12 || KinkyDungeonStatArousal > KinkyDungeonStatArousalMax/2) Eyes = "Dazed";

	if (KinkyDungeonStatArousal > 6 || KinkyDungeonStatMana < KinkyDungeonStatManaMax*0.33) Eyebrows = "Soft";
	if (KinkyDungeonStatArousal > 24 && KinkyDungeonStatStamina > KinkyDungeonStatStaminaMax*0.5) Eyebrows = "Angry";

	if (KinkyDungeonStatArousal >= KinkyDungeonStatArousalMax * 0.8) Eyes = (Eyebrows != "Angry" && KinkyDungeonStatArousal < KinkyDungeonStatArousalMax * 0.99) ? "Lewd" : "Scared";

	if (KinkyDungeonStatArousal >= 0.01 && KinkyDungeonStatArousal <= 3) Eyes2 = "Closed";

	if (KinkyDungeonStatStamina <= 4) {
		Eyes = "Dazed";
		Eyes2 = "";
	}

	if (KinkyDungeonStatArousal > 0.01) BlushCounter += 1;
	if (KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.33) BlushCounter += 1;
	if (KinkyDungeonStatArousal > KinkyDungeonStatArousalMax*0.65) BlushCounter += 1;

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
				CharacterRefresh(KinkyDungeonPlayer);
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyebrows") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Eyebrows) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Eyebrows };
				CharacterRefresh(KinkyDungeonPlayer);
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes" || KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != ((KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2" && Eyes2) ? Eyes2 : Eyes)) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: ((KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2" && Eyes2) ? Eyes2 : Eyes) };
				CharacterRefresh(KinkyDungeonPlayer);
			}
		}

	}

}