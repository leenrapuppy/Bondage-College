//@ts-check
"use strict";
// *** Item value guidelines ***
// First, check if there's a similar item and use that price.  If there isn't, use the real price in US dollars
// If it's an item that can only used once in real life (duct tape), raise the price a lot (you buy a great quantity of it)
// If it's an item with extended capabilities, raise the price
// If it's an item with multiple image layers, raise the price a little
// If it's a restraint that's impossible to remove, raise the price a little
// If the item doesn't have any image (butt plug), lower the price
// Bondage items should not go over 250$ - The love belt is that item right now
// Regular clothes should not go over 100$ - Dress2 is that item right now
// Empty value is a free item that everyone has from the start
// -1 value items cannot be bought, they must be acquired in-game in some other ways

// *** Sort order of asset & asset group properties ***
// Name, Priority, Value, Difficulty, SelfBondage, Time, RemoveTime, Enable, Visible, Random, Wear, IsRestraint, AllowLock, OwnerOnly, LoverOnly, Left, Top, DefaultColor, BuyGroup, Prerequisite, Hide, HideItem, everything else
// Group, ParentGroup, ParentSize, ParentColor, Category, Priority, Default, Clothing, Underwear, Random, IsRestraint, Blink, Left, Top, Color, FullAlpha, AllowNone, AllowColorize, AllowCustomize, AllowPose, SetPose, Effect, Zone, Activity

// *** Item addition & modification guidelines ***
// Don't include images, sounds or names that are obviously copyrighted
// Don't create anything that could be viewed by lots of players as racist, sexist, anti-LGBT, pedophilic, religious or political
// If you change an item or a piece of code made by someone else, make sure to get their approval first


// Alpha mask regions based on Appearance.js CanvasUpperOverflow and CanvasLowerOverflow values
/** @type {[number, number, number, number]} */
const AssetUpperOverflowAlpha = [0, -700, 500, 700];
/** @type {[number, number, number, number]} */
const AssetLowerOverflowAlpha = [0, 1000, 500, 1000 + 150];

/**
 * 3D Custom Girl based assets
 * @type {AssetGroupDefinition[]}
 */
var AssetFemale3DCG = [

	// Appearance specific
	{
		Group: "Cloth",
		ParentGroup: "BodyUpper",
		Priority: 30,
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead"],
		PreviewZone: [0, 150, 500, 500],
		Asset: [
			//Breast Compatible Clothing
			{
				Name: "CollegeOutfit1", Gender: "F", Prerequisite: ["HasBreasts"], Value: -1, DefaultColor: ["Default", "#202020"], BuyGroup: "CollegeOutfit", Hide: ["ItemNeck"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho"], Layer: [
					{ Name: "Shirt" },
					{ Name: "Tie" },
				]
			},
			{ Name: "MaidOutfit1", Gender: "F", Fetish: ["Lingerie"], Prerequisite: ["HasBreasts"], Value: -1, BuyGroup: "Maid", Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 560]] }], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "ClothLowerTutu"], DefaultColor: ["#212121", "Default", "Default"], Layer: [
				{ Name: "Dress" },
				{ Name: "Frills" },
				{ Name: "Apron" },
			] },
			{ Name: "MaidOutfit2", Gender: "F", Fetish: ["Lingerie"], Prerequisite: ["HasBreasts"], Value: -1, BuyGroup: "Maid", Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 560]] }], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "ClothLowerTutu"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"], DefaultColor: ["#212121", "Default", "Default"], Layer: [
				{ Name: "Dress" },
				{ Name: "Frills" },
				{ Name: "Apron" },
			] },
			{ Name: "StudentOutfit1", Gender: "F", Prerequisite: ["HasBreasts"], Alpha: [{ Group: ["Panties", "ItemPelvis"],  Masks: [[0, 0, 500, 560]] }], Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "ClothLowerTutu", "ClothAccessoryPoncho", "NecklaceCatsuitCollar"], Layer: [
				{ Name: "Dress" },
				{ Name: "Shirt" },
				{ Name: "Buckle", HideForPose: ["", "AllFours", "Hogtied"] },
				{ Name: "Bow" },
			],
			},
			{ Name: "StudentOutfit2", Gender: "F", Prerequisite: ["HasBreasts"], Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 560]] }], Hide: ["ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "ClothLowerTutu", "ClothAccessoryPoncho"] },
			{
				Name: "StudentOutfit3", Gender: "F", Prerequisite: ["HasBreasts"], Hide: ["ItemHidden"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho"], Layer: [
					{ Name: "White" },
					{ Name: "Color" }
				],
				Require: ["ClothLower", "ClothAccessory"]
			},
			{ Name: "BabydollDress1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["ABDL"], Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 560]] }], HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "ClothLowerTutu"], Layer: [
				{ Name: "Dress"},
				{ Name: "Trim"}
			] },
			{ Name: "TeacherOutfit1", Gender: "F", Prerequisite: ["HasBreasts"], Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothAccessoryPoncho", "NecklaceCatsuitCollar", "ItemArmsBondageBra"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead", "KneelingSpread"] },
			{ Name: "ChineseDress1", Gender: "F", Prerequisite: ["HasBreasts"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu"] },
			{ Name: "ChineseDress2", Gender: "F", Prerequisite: ["HasBreasts"], Value: 60, DefaultColor: ["Default", "#858585"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"], Extended: true,
				Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Edges", AllowColorize: true, HasType: false},
				]
			},
			{ Name: "TShirt1", Gender: "F", Prerequisite: ["HasBreasts"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"], Require: ["ClothLower"] },
			{
				Name: "TShirt2", Gender: "F", Prerequisite: ["HasBreasts"], Value: 25, DefaultColor: ["#333", "Default"], Hide: ["Bra"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemBreastRibbons", "ItemArmsBondageBra"], Require: ["ClothLower"], Extended: true,
				Layer: [
					{ Name: "Shirt", AllowColorize: true, HasType: false },
					{ Name: "Print", AllowTypes: ["BCLogo","BDSM","Gag","Knot","Rock","Smile","Tick"], AllowColorize: true, ParentGroup: null },
				]
			},
			{ Name: "TennisShirt1", Gender: "F", Prerequisite: ["HasBreasts"], Hide: ["ItemHidden"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho", "NecklaceCatsuitCollar"], Require: ["ClothLower"] },
			{ Name: "Sweater1", Gender: "F", Prerequisite: ["HasBreasts"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu", "ClothAccessoryPoncho", "NecklaceCatsuitCollar"], Require: ["ClothLower"] },
			{ Name: "MistressTop", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: -1, Bonus: "KidnapDomination", Hide: ["Bra"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump"], Require: ["ClothLower"] },
			{ Name: "AdultBabyDress1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["ABDL"], Value: 60, Hide: ["ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerTutu", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "ClothAccessoryPoncho"], Layer: [
				{ Name: "Dress"},
				{ Name: "Sash"},
				{ Name: "Trim"}
			] },
			{
				Name: "AdultBabyDress2", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["ABDL"], Value: 80, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "ClothLowerTutu", "ClothAccessoryPoncho"], Layer: [
					{ Name: "Dress" },
					{ Name: "Lace" },
					{ Name: "Bow" },
				]
			},
			{
				Name: "AdultBabyDress3", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["ABDL"], Value: 40, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "ClothLowerTutu"], Layer: [
					{ Name: "Dress" },
					{ Name: "Belt" },
					{ Name: "Collar" },
				]
			},
			{ Name: "AdultBabyDress4", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["ABDL"], Value: 80, Left: 100, Top: 190, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "ClothLowerTutu", "ClothAccessoryPoncho"] },
			{ Name: "NurseUniform", Gender: "F", Prerequisite: ["HasBreasts"], Value: -1, Bonus: "KidnapDomination", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu", "ClothAccessoryPoncho", "ItemArmsBondageBra"] },
			{ Name: "Robe1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, Hide: ["ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu", "ClothAccessoryPoncho"] },
			{ Name: "SuspenderTop1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 25, Value: 50, Hide: ["Panties", "ItemVulva", "ItemVulvaPiercings"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "LeatherCorsetTop1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], DynamicGroupName: "Corset", BuyGroup: "LeatherCorsetTop1", Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump"], AllowPose: ["Hogtied", "AllFours"] },
			{
				Name: "FlowerDress", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerTutu", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"],
				AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead", "Suspension"],
				Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Flower", AllowColorize: false }
				]
			},
			{ Name: "Dress2", Gender: "F",  Prerequisite: ["HasBreasts"], Value: 100, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"] },
			{ Name: "LaceBabydoll", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 40, HideItem: ["ItemNipplesLactationPump"] },
			{ Name: "SleevelessTop", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 20, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump"] },
			{
				Name: "DressFur", Gender: "F", Prerequisite: ["HasBreasts"], Value: 70, HideItem: ["ClothLowerTutu", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{ Name: "BodyTowel1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerTutu", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"] },
			{ Name: "Yukata1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerTutu", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"] },
			{ Name: "SteampunkCorsetTop1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], DynamicGroupName: "Corset", BuyGroup: "SteampunkCorsetTop1", Priority: 25, Value: 70, Hide: ["ItemHidden"], HideItem: ["ClothLowerTennisSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho", "NecklaceCatsuitCollar", "NecklaceBodyChainNecklace"], AllowPose: ["Hogtied", "AllFours", "OverTheHead"] },
			{ Name: "BondageDress1", Gender: "F", Prerequisite: ["HasBreasts"], BuyGroup: "BondageDress1", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"] },
			{ Name: "BondageDress2", Gender: "F", Prerequisite: ["HasBreasts"], BuyGroup: "BondageDress2", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"] },
			{ Name: "ShoulderlessTop", Gender: "F", Prerequisite: ["HasBreasts"], Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho"] },
			{ Name: "Dress3", Gender: "F", Prerequisite: ["HasBreasts"], Value: 80, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"] },
			{ Name: "ComfyTop", Gender: "F", Prerequisite: ["HasBreasts"], Value: 60, Hide: ["ItemNipples", "ItemNipplesPiercings"], HideItem: ["ClothAccessoryPoncho", "ItemArmsBondageBra"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "WeddingDress1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 22, Value: 150, Hide: ["ClothLower", "Garters", "BodyLower", "Panties", "Shoes", "ItemBoots", "RightAnklet", "LeftAnklet", "ItemNipples"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemLegsLeatherLegCuffs", "ItemLegsFuturisticLegCuffs", "ItemDevicesWoodenHorse", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "ItemLegsOrnateLegCuffs", "ItemFeetOrnateAnkleCuffs", "ItemDevicesSaddleStand", "ItemVulvaWandBelt", "ItemFeetAnkleShackles", "ItemFeetIrish8Cuffs", "ItemFeetBallChain", "ItemPelvisDiaperHarness"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "LegsClosed", "Kneel", "KneelingSpread", "AllFours","OverTheHead"] },
			{ Name: "WeddingDress2", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 22, Value: 150, Hide: ["ClothLower", "Garters", "BodyLower", "Panties", "Shoes", "ItemBoots", "RightAnklet", "LeftAnklet", "ItemNipples"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemLegsFuturisticLegCuffs", "ItemLegsLeatherLegCuffs", "ItemDevicesWoodenHorse", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "ItemLegsOrnateLegCuffs", "ItemFeetOrnateAnkleCuffs", "ItemDevicesSaddleStand", "ItemVulvaWandBelt", "ItemFeetAnkleShackles", "ItemFeetIrish8Cuffs", "ItemFeetBallChain", "ItemPelvisDiaperHarness"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead", "LegsClosed", "Kneel", "KneelingSpread", "AllFours"] },
			{ Name: "BridesmaidDress1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 100, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ItemLegsSlime"] },
			{ Name: "Gown1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 70, Random: false, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ClothLowerTutu"] },
			{ Name: "Gown2Top", Gender: "F", Prerequisite: ["HasBreasts"], Value: 90, Random: false, Left: 125, Top: 220, BuyGroup: "Gown2", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Require: ["ClothLower"] },
			{ Name: "Gown3", Gender: "F", Prerequisite: ["HasBreasts"], Value: 70, Random: false, Left: 99, Top: 194, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesLactationPump", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu", "ClothAccessoryPoncho"] },
			{ Name: "MaidApron1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 32, Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ClothLowerTutu"] },
			{ Name: "MaidApron2", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 32, Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ClothLowerTutu"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{
				Name: "AdmiralTop", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ClothAccessoryPoncho", "NecklaceCatsuitCollar", "ItemArmsBondageBra"],
				Layer: [
					{ Name: "Jacket" },
					{ Name: "Trim" },
					{ Name: "Shirt" }
				]
			},
			{ Name: "VirginKiller1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu", "NecklaceCatsuitCollar"] },
			{
				Name: "ReverseBunnySuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Nylon", "Pet"], DynamicGroupName: "Suit", Value: 100, BuyGroup: "ReverseBunnySuit", Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso", "ItemTorso2",], HasType: false, Extended: true,
				Layer: [
					{ Name: "Suit", AllowColorize: true },
					{ Name: "Gloves", AllowColorize: true, Priority: 28, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 28, AllowTypes: ["AltGloves"] },
				]
			},
			{ Name: "LeatherCropTop", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: 60, Hide: ["ItemNipples", "ItemNipplesPiercings"], HideItem: ["NecklaceBodyChainNecklace", "ItemArmsBondageBra"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "CorsetShirt", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 25, Value: 60,
				HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho", "NecklaceBodyChainNecklace"],
				Layer: [
					{ Name: "Shirt" },
					{ Name: "Corset" }
				]
			},
			{ Name: "BondageBustier1", Gender: "F", Prerequisite: ["HasBreasts"], BuyGroup: "BondageDress1", Value: -1, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"] },
			{ Name: "BondageBustier2", Gender: "F", Prerequisite: ["HasBreasts"], BuyGroup: "BondageDress2", Value: -1, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"] },
			{ Name: "LeatherBolero", Gender: "F", Prerequisite: ["HasBreasts"], Fetish:["Leather"], Value: 60, Alpha: [{ Group: ["ItemNeck"], Masks: [[185, 215, 130, 65]] }], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso", "ItemTorso2",], HideItem: ["ItemNeckLeatherCollar", "ItemNeckLeatherCollarBell", "ItemNeckLeatherCollarBow", "ItemNeckSlaveCollar", "ItemNeckClubSlaveCollar", "ItemNeckShockCollar", "ItemNeckShockCollarRemote", "ItemNeckBatCollar", "ItemNeckPostureCollar", "ItemNeckSteelPostureCollar", "ItemNeckDogCollar", "ItemNeckSpikeCollar", "ItemNeckHighCollar", "ItemNeckLeatherChoker", "ItemNeckPetCollar", "ItemNeckMaidCollar", "ItemNeckBordelleCollar", "ItemNeckLoveLeatherCollar", "ItemNeckNobleCorsetCollar", "ItemNeckHeartCollar", "ItemNeckHighSecurityCollar", "ItemNeckOrnateCollar", "ItemNeckSlenderSteelCollar", "ItemNeckHeartLinkChoker", "ItemNeckNeckRope", "ItemNipplesStretchClovers"] },
			{
				Name: "Bodice1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 90, Top: 213,
				HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump"],
				HideForPose: ["Hogtied", "AllFours"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Trim" },
					{ Name: "Pattern" }
				]
			},
			{
				Name: "SummerDress", Gender: "F", Prerequisite: ["HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], HideItem: [ "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Layer4" },
					{ Name: "Layer2" },
					{ Name: "Layer3" },
					{ Name: "Layer1" }
				]
			},
			{
				Name: "GrandMage", Gender: "F", Prerequisite: ["HasBreasts"], Value: 90, DefaultColor: ["#720DBB", "#3C0C5E", "#DFDFEC", "#682E0F", "#858482"], HideForPose: ["AllFours"],
				HideItem: ["ClothAccessoryPoncho"],
				Alpha: [
					{ Group: ["ClothAccessory"], Masks: [[0, 500, 500, 500]] },
					{ Group: ["ClothLower"], Masks: [[0, 0, 220, 500], [290, 0, 210, 500]] },
				],
				Layer: [
					{ Name: "Base" },
					{ Name: "BackSkirt", ParentGroup: null,  Priority: 3, HideForPose: ["Hogtied"] },
					{ Name: "Trim" },
					{ Name: "Belt", HideForPose: ["Hogtied"] },
					{ Name: "Buckle", HideForPose: ["Hogtied"] }
				]
			},
			{
				Name: "Blouse1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 20, Top: 1, BuyGroup: "Blouse1",
				Alpha: [{ Group: ["Panties", "ItemPelvis", "Bra", "Corset", "Suit"], Masks: [[0, 0, 230, 448], [268, 0, 232, 448]] },],
				HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemArmsBondageBra", "NecklaceBodyChainNecklace"],
			},
			{ Name: "LatexTop", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, Hide: ["ItemNipples"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain"]},
			{ Name: "LatexLacedSuit", Gender: "F", Prerequisite: ["HasBreasts"], Priority: 22, Value: 35, Hide: ["Corset", "ItemNipples"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump"], Extended: true},
			{
				Name: "FurCoat", Gender: "F",  Prerequisite: ["HasBreasts"], Value: 90, Hide: ["Corset", "ClothLower", "Bracelet"], HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothAccessoryPoncho", "ItemLegsSlime"], ParentGroup: null, Priority: 32,
				Layer: [
					{ Name: "Upper", Top: 0, Left: 0, AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead", "AllFours"] },
					{ Name: "Lower", Top: 462, Left: 0, CopyLayerColor:"Upper", AllowPose: ["Spread", "KneelingSpread", "LegsClosed", "Kneel"], HideForPose: ["Hogtied", "AllFours"] },
				]
			},
			{
				Name: "FuzzyDress", Gender: "F", Prerequisite: ["HasBreasts"], Value: 70, Priority: 32, Top: 0, Left: 0, DefaultColor: ["#cf2828", "#666"],
				HideItemAttribute: ["Skirt"],
				HideItem: ["ClothLowerPajama1", "ClothLowerHaremPants", "ClothAccessoryPoncho"],
				HideForPose: ["Hogtied", "AllFours", "KneelingSpread", "OverTheHead"],
				Layer: [
					{ Name: "Dress", AllowPose: [], Priority: 26 },
					{ Name: "TopFur", AllowPose: ["Yoked"] },
					{ Name: "BottomFur", CopyLayerColor: "TopFur", AllowPose: [] },
				],
				Alpha: [
					{ Group: ["ClothLower"], Masks: [[0, 320, 500, 300]] },
				],
			},
			{
				Name: "CropTop", Gender: "F", Prerequisite: ["HasBreasts"], Value: 40, AllowPose: ["Hogtied"], HideForPose: ["AllFours"],
				Hide: ["ItemNipplesPiercings"],
				HideItem: ["ItemNipplesLactationPump"],
				Layer: [
					{ Name: "Blouse" },
					{ Name: "Design" },
				],
			},
			{
				Name: "Laurel", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, Priority: 25, AllowPose: ["Hogtied", "OverTheHead"], HideForPose: ["AllFours"],
				HideItem: ["ItemNipplesLactationPump"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Design" },
					{ Name: "Lace" },
				],
			},
			{
				Name: "SeethroughTop", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, Priority: 25, AllowPose: ["Hogtied"], HideForPose: ["AllFours"],
				HideItem: ["ItemNipplesLactationPump"],
				Layer: [
					{ Name: "Lace" },
					{ Name: "Design" },
				],
			},
			{
				Name: "Jacket", Gender: "F", Prerequisite: ["HasBreasts"], Value: 40, Priority: 30, ParentGroup: null, Extended: true,
				HideItem: ["ClothAccessoryPoncho", "ClothAccessoryCape"],
				Layer: [
					{ Name: "Base", HasType: false, },
					{ Name: "Hood", HasType: false, Priority: 54, AllowTypes: ["Hooded", "HoodedEarsOut"], AllowPose: [], CopyLayerColor: "Base", },
				],
			},
			{
				Name: "SlaveRags", Gender: "F", Prerequisite: ["HasBreasts"], Value: 5, BuyGroup: "SlaveRags", Extended: true, AllowPose: ["AllFours", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead", "Suspension"], DefaultColor: ["#886D5D", "#886D58", "#8B6945", "Default"],
				Layer: [
				{Name: "Base", HasType: false, AllowModuleTypes: ["c0", "c1"]},
				{Name: "BaseStains", HasType: false, AllowModuleTypes: ["c1"]},
				{Name: "Torn1", HasType: false, AllowModuleTypes: ["c2", "c3"], CopyLayerColor: "Base"},
				{Name: "Torn1Stains", HasType: false, AllowModuleTypes:["c3"], CopyLayerColor: "BaseStains"},
				{Name: "Rope", HasType: false, AllowModuleTypes: ["b1"]},
				{Name: "Chains", HasType: false, AllowModuleTypes: ["b2"]},
				],
			},
			// Flat Chest Compatible Clothing
			{
				Name: "MaleTankTop1", Gender: "M", Prerequisite: ["HasFlatChest"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"]
			},
			{
				Name: "ButtonShirt", Gender: "M", Prerequisite: ["HasFlatChest"], Value: 30, DefaultColor: ["#b4b4b4", "#3858aa", "#8c8c8c"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "BraRibbons", "ItemBreastRibbons"],
				Layer: [
					{ Name: "Bottom", AllowColorize: true },
					{ Name: "Top", AllowColorize: true },
					{ Name: "Buttons", AllowColorize: true },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ClothAccessory",
		Priority: 32,
		Default: false,
		Random: false,
		Clothing: true,
		PreviewZone: [0, 200, 500, 500],
		Asset: [
			// Breast Compatible Clothing
			{ Name: "StudentOutfit3Scarf", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow1", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow2", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow3", Priority: 34, Left: 200, Top: 250 },
			{
				Name: "Bouquet", Priority: 41, Value: 40, Left: 175, Top: 350, BuyGroup: "Bouquet", AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"], Hide: ["Bracelet"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Flowers" }
				]
			},
			{ Name: "FrillyApron", Fetish: ["Lingerie"], ParentGroup: "BodyUpper", Value: -1, Left: 135, Top: 179, BuyGroup: "Maid", AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"] },
			{ Name: "BunnyCollarCuffs", Fetish: ["Pet"], ParentGroup: "BodyUpper", Value: 10, AllowPose: ["AllFours", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"], Extended: true,
				Layer: [
					{ Name: "Collar"},
					{ Name: "Bow"},
					{ Name: "Cuffs"}
				]
			},
			{ Name: "Camera1", Priority: 41, Value: -1, Left: 175, Top: 225, Bonus: "KidnapSneakiness", AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"] },
			{
				Name: "Cape", Priority: 41, Value: 40, AllowPose: ["AllFours", "Hogtied", "Kneel"],
				Layer: [
					{ Name: "Back",  Priority: 6 },
					{ Name: "Front",  Priority: 41 }
				]
			},
			{ Name: "LeatherStraps", Fetish: ["Leather"], ParentGroup: "BodyUpper", Value: 25, AllowPose: ["AllFours"], Extended: true },
			{ Name: "FurBolero", Priority: 34, Value: 25, AllowPose: ["AllFours", "BackElbowTouch", "OverTheHead", "Hogtied", "Yoked", "BackCuffs"], },
			{ Name: "FacePaint", Value: 10, Left: 150, Top: 20, Priority: 7, BuyGroup: "FacePaint", DefaultColor: ["#9A7F76"], Hide: ["Head"] },
			{
				Name: "Bib", Fetish: ["ABDL"], Priority: 34, Value: 5, Left: 179, Top: 220, Extended: true,
				DynamicAfterDraw: true, TextMaxLength: { Text: 24, Text2: 24 }, TextFont: "Pacifico",
				Layer: [
					{Name: "Base", HasType: false},
					{Name: "Trim", HasType: false},
					{Name: "Pacis", Left: 194, Top: 232, HasType: false, AllowModuleTypes: ["p1"] },
					{Name: "Strawberries", Left: 195, Top: 229, HasType: false, CopyLayerColor: "Pacis", AllowModuleTypes: ["p2"] },
					{Name: "PawPrints", Left: 193, Top: 229, HasType: false, CopyLayerColor: "Pacis", AllowModuleTypes: ["p3"] },
					{Name: "Cows", Left: 191, Top: 228, HasType: false, CopyLayerColor: "Pacis", AllowModuleTypes: ["p4"] },
					{Name: "Hearts", Left: 194, Top: 228, HasType: false, CopyLayerColor: "Pacis", AllowModuleTypes: ["p5"] },
					{Name: "Text", HasImage: false}
				]
			},
			{ Name: "Scarf", Priority: 41, Value: 7, DefaultColor: ["#B1B1B1"], Extended: true },
			{
				Name: "Glitter", Value: 10, Priority: 8, BuyGroup: "Glitter", Left: 150, Top: 20, DefaultColor:["#DCA07C","#DCA07C"], Extended: true, BodyCosplay: true,
				Layer:[
					{Name: "Freckles", HasType: false, AllowTypes:[""]},
					{Name: "Freckles2", HasType: false, AllowTypes:[""]},
					{Name: "MidFreckles", HasType: false, AllowTypes:["MidFreckles"], CopyLayerColor: "Freckles"},
					{Name: "SplitFreckles", HasType: false, AllowTypes:["SplitFreckles"], CopyLayerColor: "Freckles"},
					{Name: "SplitFreckles2", HasType: false, AllowTypes:["SplitFreckles"], CopyLayerColor: "Freckles2"},
					{Name: "FrecklesSmall", HasType: false, AllowTypes:["FrecklesSmall"], CopyLayerColor: "Freckles"},
					{Name: "Freckles2Small", HasType: false, AllowTypes:["FrecklesSmall"], CopyLayerColor: "Freckles2"},
					{Name: "MidFrecklesSmall", HasType: false, AllowTypes:["MidFrecklesSmall"], CopyLayerColor: "Freckles"},
					{Name: "SplitFrecklesSmall", HasType: false, AllowTypes:["SplitFrecklesSmall"], CopyLayerColor: "Freckles"},
					{Name: "SplitFreckles2Small", HasType: false, AllowTypes:["SplitFrecklesSmall"], CopyLayerColor: "Freckles2"},
					{Name: "StarsLeft", HasType: false, AllowTypes:["StarsBoth", "StarsLeft"], CopyLayerColor: "Freckles2"},
					{Name: "StarsLeft2", HasType: false, AllowTypes:["StarsBoth", "StarsLeft"], CopyLayerColor: "Freckles"},
					{Name: "StarsRight", HasType: false, AllowTypes:["StarsBoth", "StarsRight"], CopyLayerColor: "Freckles2"},
					{Name: "StarsRight2", HasType: false, AllowTypes:["StarsBoth", "StarsRight"], CopyLayerColor: "Freckles"},
					{Name: "DotsLeft", HasType: false, AllowTypes:["DotsBoth", "DotsLeft"], CopyLayerColor: "Freckles"},
					{Name: "DotsLeft2", HasType: false, AllowTypes:["DotsBoth", "DotsLeft"], CopyLayerColor: "Freckles2"},
					{Name: "DotsRight", HasType: false, AllowTypes:["DotsBoth", "DotsRight"], CopyLayerColor: "Freckles"},
					{Name: "DotsRight2", HasType: false, AllowTypes:["DotsBoth", "DotsRight"], CopyLayerColor: "Freckles2"},
				]
			},
			{ Name: "CatsuitCollar", Priority: 15, Value: -1, BuyGroup: "Catsuit"},
			{
				Name: "Poncho", Value: 20, ParentGroup: "BodyUpper", DefaultColor: "#25d",
				AllowPose: ["Yoked", "OverTheHead", "BackElbowTouch"],
				HideForPose: ["AllFours"],
				Layer: [
					{ Name: "Back", Priority: 6, HideForPose: ["Hogtied"] },
					{ Name: "Front", Priority: 34, CopyLayerColor: "Back" },
				]
			}
			// Flat Chest Compatible Clothing
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Necklace",
		ParentGroup: "BodyUpper",
		Priority: 31,
		Default: false,
		Clothing: true,
		PreviewZone: [165, 170, 170, 170],
		Asset: [
			{ Name: "Necklace1", Value: 40, Left: 148, Top: 70, ParentGroup: null },
			{ Name: "Necklace2", Left: 147, Top: 90, ParentGroup: null },
			{ Name: "Necklace3", Left: 147, Top: 110, ParentGroup: null },
			{ Name: "Necklace4", Value: 30, Left: 147, Top: 110, ParentGroup: null },
			{
				Name: "NecklaceLock", Fetish: ["Metal"], Value: 40, Left: 155, Top: 152, ParentGroup: null, Extended: true,
				Layer: [
					{ Name: "Chain", HasType: false },
					{ Name: "Lock", HasType: false },
				]
			},
			{
				Name: "NecklaceKey", Fetish: ["Metal"], Value: 40, Left: 153, Top: 152, ParentGroup: null, Extended: true,
				Layer: [
					{ Name: "Chain", HasType: false },
					{ Name: "Key", HasType: false },
				]
			},
			{
				Name: "IDCard", Value: 10, Left: 145, Top: 180, ParentGroup: null,
				Layer: [
					{ Name: "String" },
					{ Name: "Card" }
				]

			},
			{ Name: "BlackHeart", Value: 40, Left: 148, Top: 70, ParentGroup: null },
			{
				Name: "NecklaceBallGag", Value: -1, Priority: 43, DefaultColor: "#BC3030", BuyGroup: "BallGag", Left: 150, Top: 10, ParentGroup: null, Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{ Name: "FurScarf", BuyGroup: "FurScarf", Priority: 35, Value: 40, Left: 0, Top: 0, ParentGroup: null },
			{ Name: "ElegantHeartNecklace", Value: 30, Left:155, Top: 152, ParentGroup: null,
				Layer: [
					{ Name: "Necklace", AllowColorize: true },
					{ Name: "Jewels", AllowColorize: true },
				]
			},
			{ Name: "Bandana", Value: 15, Left: 148, Top: 97, BuyGroup: "ScarfGag", ParentGroup: null},
			{
				Name: "FlowerGarland", Value: 10, Left: 0, Top: -18, DefaultColor: ["#AC5B9D", "#E4E988"], ParentGroup: null, Layer: [
					{ Name: "Petals" },
					{ Name: "Center" },
				]
			},
			{ Name: "NecklaceRope", Priority: 29, Value: -1, Left: 220, Top: 200, DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", ParentGroup: null, Extended: true },
			{ Name: "ChokerTattoo", Priority: 29, Value: 5, Left: 230, Top: 200, DefaultColor: "#444444", ParentGroup: null, Extended: true },
			{ Name: "CatsuitCollar", Priority: 31, Value: -1, Left: 148, Top: 97, BuyGroup: "Catsuit", ParentGroup: null},
			// Breast Compatible Clothing
			{
				Name: "BodyChainNecklace", Prerequisite: ["HasBreasts"], Priority: 29, Value: 50, DefaultColor: ["#d1951f", "#d1951f"], HideForPose: ["AllFours"],
				PoseMapping: { Hogtied: "BackElbowTouch" },
				Layer: [
					{ Name: "Chains", AllowPose: ["Hogtied", "OverTheHead", "Yoked", "BackElbowTouch", "BackCuffs"] },
					{ Name: "Choker", ParentGroup: null },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Suit",
		ParentGroup: "BodyUpper",
		Priority: 14,
		Default: false,
		Random: false,
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"],
		PreviewZone: [75, 150, 350, 350],
		Asset: [
			// Breast Compatible Clothing
			{
				Name: "Catsuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 100, BuyGroup: "Catsuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HasType: false, Extended: true,
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},
			{
				Name: "SeamlessCatsuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HasType: false, Extended: true,
				Layer: [
					{ Name: "Suit", AllowColorize: true },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},
			{
				Name: "SleevelessCatsuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HasType: false, AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"],
			},
			{
				Name: "PilotSuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 150, BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696", "#2B408B", "#2B408B"], HideItem: ["ItemNipplesChopStickNippleClamps"], HasType: false, Extended: true,
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
					{ Name: "Layer4", AllowColorize: true },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},
			{
				Name: "SeethroughSuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 100, BuyGroup: "SeethroughSuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HasType: false, Extended: true,
				Layer: [
					{ Name: "Suit", AllowColorize: true },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},
			{
				Name: "SeethroughSuitZip", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HasType: false, Extended: true,
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},
			{
				Name: "ReverseBunnySuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex", "Pet"], Value: 100, BuyGroup: "ReverseBunnySuit", Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso", "ItemTorso2",], HasType: false, Extended: true,
				Layer: [
					{ Name: "Suit", AllowColorize: true },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},
			{
				Name: "Blouse1", Gender: "F", Prerequisite: ["HasBreasts"],  Value: -1, Top: 1, Priority: 29, BuyGroup: "Blouse1", DynamicGroupName: "Cloth",
				Alpha: [{ Group: ["Panties", "ItemPelvis", "Bra", "Corset"], Masks: [[0, 0, 230, 448], [268, 0, 232, 448]] },],
				HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ItemArmsBondageBra", "NecklaceBodyChainNecklace"],
			},
			{
				Name: "SleevelessSlimLatexLeotard", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, Top: 0, Left: 0, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"], HideItemExclude: ["ItemVulvaWiredEgg"],
				PoseMapping: { Yoked: "", BackBoxTie: "", BackCuffs: "", BackElbowTouch: "", OverTheHead: "", TapedHands: "" },
				Layer: [
					{ Name: "Latex" },
					{ Name: "Shine", AllowColorize: false },
					{ Name: "BreastShade", AllowColorize: false }
				]
			},
			// Flat Chest Compatible Clothing
			{
				Name: "MaleSeamlessCatsuit", Gender: "M", Prerequisite: ["HasFlatChest"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HasType: false, Extended: true,
				Layer: [
					{ Name: "Base", AllowColorize: true },
					{ Name: "Gloves", AllowColorize: true, Priority: 27, AllowTypes: ["Gloves"] },
					{ Name: "AltGloves", CopyLayerColor: "Gloves", Priority: 27, AllowTypes: ["AltGloves"] },
				]
			},

		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ClothLower",
		ParentGroup: "BodyLower",
		ParentColor: "Cloth",
		Priority: 26,
		Default: false,
		Clothing: true,
		Left: 105,
		Top: 380,
		AllowPose: ["LegsClosed", "Kneel", "KneelingSpread", "Spread"],
		PreviewZone: [0, 380, 500, 500],
		Asset: [
			// Vagina Compatible Clothing
			{ Name: "Skirt1", Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 560]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{
				Name: "Skirt2", Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 560]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Layer: [
					{ Name: "Color" },
					{ Name: "Stripe" }
				],
				ParentItem: "StudentOutfit3"
			},
			{
				Name: "Skirt3", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesBulkyDiaper", "ItemPelvisBulkyDiaper"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Layer: [
					{ Name: "Color" },
					{ Name: "Stripe" }
				],
				ParentItem: "StudentOutfit3"
			},
			{
				Name: "TennisSkirt1", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesBulkyDiaper", "ItemPelvisBulkyDiaper"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Layer: [
					{ Name: "Color" },
					{ Name: "Stripe" },
				],
				ParentItem: "TennisShirt1" },
			{ Name: "Jeans1", Priority: 23, Hide: ["ItemVulvaPiercings", "Garters", "Pussy", "ItemVulva", "Panties"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks6", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "PantiesPoofyDiaper", "PantiesBulkyDiaper"] },
			{ Name: "Shorts1", Hide: ["ItemVulvaPiercings", "Pussy", "ItemVulva", "Panties"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "PantiesPoofyDiaper", "PantiesBulkyDiaper"] },
			{
				Name: "Pajama1", Priority: 25, Random: false, Hide: ["Garters"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "PantiesPoofyDiaper", "PantiesBulkyDiaper"], Layer: [
					{ Name: "Cloth" },
					{ Name: "Stripe" },
				],
			},
			{ Name: "MistressBottom", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: -1, Hide: ["Panties"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Waspie1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 60, HideForPose: ["KneelingSpread"], Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 165, 600], [335, 0, 165, 600], [0, 0, 500, 480]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{ Name: "Waspie2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 80, HideForPose: ["KneelingSpread"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{ Name: "Waspie3", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 40, HideForPose: ["KneelingSpread"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{ Name: "LatexPants1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Priority: 21, Value: 60, Hide: ["ItemVulvaPiercings", "Garters"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksStockings2", "SocksStockings3", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "PantiesPoofyDiaper", "PantiesBulkyDiaper"] },
			{ Name: "LatexSkirt1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: 40, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 540]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{ Name: "LatexSkirt2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: 60, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 580]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{
				Name: "Tutu", Value: 30, Top: 370, Left: 40, DefaultColor: ["#845e9e", "#c385d0", "#e4d1fc", "#927D99", "#811790"], AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"], HideForPose: ["KneelingSpread"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"],
				PoseMapping: { Yoked: "OverTheHead", BackElbowTouch: "OverTheHead", BackCuffs: "OverTheHead", BackBoxTie: "OverTheHead" },
				Layer: [
					{ Name: "Layer1", ParentGroup: "BodyUpper", ColorGroup: "Tutu" },
					{ Name: "Layer2", ParentGroup: "BodyUpper", ColorGroup: "Tutu" },
					{ Name: "Layer3", ParentGroup: "BodyUpper", ColorGroup: "Tutu" },
					{ Name: "Layer4", ParentGroup: "BodyUpper", ColorGroup: "Tutu" },
					{ Name: "Belt", ParentGroup: null, AllowPose: [] },
					{ Name: "Shine", ParentGroup: null, AllowColorize: false, AllowPose: [] },
				]
			},
			{ Name: "ClothSkirt1", Gender: "F", Prerequisite: ["HasVagina"], Value: 40, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 580]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{ Name: "Jeans2", Priority: 23, Value: 20, Hide: ["ItemVulvaPiercings", "Garters", "ItemVulva", "Pussy"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks6", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "PantiesPoofyDiaper", "PantiesBulkyDiaper"] },
			{ Name: "ChineseSkirt1", Gender: "F", Prerequisite: ["HasVagina"], Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{
				Name: "Gown2Skirt", Value: -1, Random: false, Left: 50, Top: 462, BuyGroup: "Gown2", Hide: ["ItemFeet", "Garters", "ItemLegs", "Pussy"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"], ParentItem: "Gown2Top", Attribute: ["Skirt"],
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemBootsThighHighLatexHeels, ItemBootsHighThighBoots", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ItemBootsSlime"],
				HideItemExclude: ["ItemLegsHobbleSkirt", "ItemLegsLegBinder", "ItemLegsPlasticWrap", "ItemLegsRibbons"]
			},
			{
				Name: "AdmiralSkirt", Value: 30, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 580]] }], AllowPose: ["KneelingSpread"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Layer: [
					{ Name: "Cloth" },
					{ Name: "Stripe" },
				],
			},
			{
				Name: "HulaSkirt", Value: 30, Top: 350, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 455]] }], DefaultColor: ["#40B90B", "#C46E9A", "#F5DC34"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], AllowPose: ["KneelingSpread"], ParentGroup: null, Layer: [
					{ Name: "BackLeaves", Priority: 3 },
					{ Name: "FrontLeaves", CopyLayerColor: "BackLeaves" },
					{ Name: "Flowers" },
					{ Name: "Pollen" },
				]
			},
			{ Name: "JeanSkirt", Value: 30, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 580]] }], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Attribute: ["Skirt"], },
			{ Name: "PencilSkirt", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 60, Left: 105, Top: 380, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemLegsNylonRope", "ItemLegsHempRope", "ItemLegsLeatherBelt", "ItemLegsSturdyLeatherBelts", "ItemLegsDuctTape", "ItemLegsLeatherLegCuffs", "ItemLegsOrnateLegCuffs", "ItemLegsFuturisticLegCuffs", "ItemLegsZipties", "ItemLegsChains", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "GartersTentacles", "ItemLegsTentacles"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"], HideForPose: ["KneelingSpread"], Attribute: ["Skirt"], },
			{ Name: "JeansShorts", Gender: "F", Prerequisite: ["HasVagina"], Value: 20, Priority: 22, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "PantiesPoofyDiaper", "PantiesBulkyDiaper"] },
			{
				Name: "Leggings1", Gender: "F", Prerequisite: ["HasVagina"], Value: 15, Priority: 21, DefaultColor: "#4499c4", Hide: ["ItemVulvaPiercings", "Panties"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks4", "SocksSocks5", "SocksSocks6", "ItemVulvaVibratingLatexPanties", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaTapeStrips", "ItemVulvaBenWaBalls", "ItemVulvaHeavyWeightClamp", "ItemVulvaShockDildo"], Layer: [
					{ Name: "Cloth" },
					{ Name: "Stripe" }
				]
			},
			{
				Name: "Leggings2", Gender: "F", Prerequisite: ["HasVagina"], Value: 20, Priority: 21, DefaultColor: "#4499c4", Hide: ["ItemVulvaPiercings", "Panties"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "ItemVulvaVibratingLatexPanties", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaTapeStrips", "ItemVulvaBenWaBalls", "ItemVulvaHeavyWeightClamp", "ItemVulvaShockDildo"], Layer: [
					{ Name: "Cloth" },
					{ Name: "Stripe" }
				]
			},
			{
				Name: "PleatedSkirt", Gender: "F", Prerequisite: ["HasVagina"], Value: 35, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 570]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Attribute: ["Skirt"], Layer: [
					{ Name: "Dress" },
					{ Name: "Stripe" }
				]
			},
			{
				Name: "MageSkirt", Gender: "F", Prerequisite: ["HasVagina"], Value: 35, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 570]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Attribute: ["Skirt"], Layer: [
					{ Name: "Skirt", ParentGroup: null, AllowColorize: true },
					{ Name: "Waist", ParentGroup: null, AllowColorize: true },
				], PoseMapping: { 'LegsClosed':'', 'Kneel':'', 'Spread': '' }
			},
			{
				Name: "LongSkirt1", Gender: "F", Prerequisite: ["HasVagina"], Value: 40, Left: 69, ParentGroup: null,
				Attribute: ["Skirt"],
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
				Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				AllowPose: ["Kneel"],
				HideForPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Back" },
					{ Name: "Front", CopyLayerColor: "Back", Priority: 29 },
				],
			},
			{ Name: "ShortPencilSkirt", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 50, Left: 105, Top: 380, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 180, 600], [320, 0, 180, 600], [0, 0, 500, 480]] }], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"], HideForPose: ["KneelingSpread"], Attribute: ["Skirt"], },
			{
				Name: "HaremPants", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 20, BuyGroup: "HaremPants", Hide: ["Panties"], AllowPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Panty", Priority: 15 },
					{ Name: "Veil" },
					{ Name: "Pantyline" },
				],
			},
			{
				Name: "HaremPants2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 20, BuyGroup: "HaremPants", Hide: ["Panties"], Layer: [
					{ Name: "Panty", Priority: 15 },
					{ Name: "Fabric" },
					{ Name: "PantyLine" },
					{ Name: "Veil" },
					{ Name: "Buttons" },
				],
			},
			{ Name: "ShortPlaidSkirt", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], },
			{
				Name: "CollegeSkirt", Value: -1, BuyGroup: "CollegeOutfit", ParentItem: "CollegeOutfit1",
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"],
				AllowPose: ["KneelingSpread"],
				Attribute: ["Skirt"],
			},
			{
				Name: "BondageSkirt", Value: 90, Priority: 28, Left: 0, Top: 0, Attribute: ["Skirt"], DefaultColor: ["Default", "#25d", "#25d"],
				SetPose: ["LegsClosed"],
				AllowActivePose: ["Kneel"],
				WhitelistActivePose: ["BaseLower", "Kneel"],
				HideForPose: ["Spread", "KneelingSpread"],
				Effect: ["Slow"],
				FreezeActivePose: ["BodyLower"],
				Hide: ["Pussy"],
				HideItem: ["ItemFeetSlime"],
				Layer: [
					{ Name: "Skirt" },
					{ Name: "Frill" },
					{ Name: "Straps", AllowPose: [] },
				],
				Alpha: [
					{ Group: ["ItemBoots", "Shoes"], Masks: [[75, 0, 350, 800]] }
				]
			},
			{
				Name: "AsymmetricSkirt", Value: 80, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Left: 0,
				Hide: ["ItemFeet"],
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
				HideItemExclude: ["ItemFeetLeatherAnkleCuffs", "ItemFeetSteelAnkleCuffs", "ItemFeetFuturisticAnkleCuffs", "ItemFeetOrnateAnkleCuffs", "ItemFeetWoodenCuffs", ""],
				AllowPose: ["Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "Back", ParentGroup: null, Priority: 6 },
					{ Name: "Front", CopyLayerColor: "Back" },
				],
			},
			{
				Name: "ElegantSkirt", Value: 80, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Left: 0,
				Hide: ["ItemFeet"],
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
				AllowPose: ["Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "Skirt" },
					{ Name: "Design" },
				],
				Alpha: [
					{ Pose: ["KneelingSpread"], Group: ["BodyLower", "Socks", "Shoes", "SuitLower", "Garters"], Masks: [[0, 462, 500, 538]] }
				]
			},
			{
				Name: "RuffledSkirt", Value: 80, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Left: 0,
				Hide: ["ItemFeet"],
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
				AllowPose: ["Kneel", "KneelingSpread"],
				Alpha: [
					{ Pose: ["KneelingSpread"], Group: ["BodyLower", "Socks", "Shoes", "SuitLower", "Garters"], Masks: [[0, 462, 500, 538]] }
				]
			},
			{
				Name: "CrossSkirt", Value: 60, Alpha: [{ Group: ["Panties", "ItemPelvis"], Masks: [[0, 0, 500, 580]] }], AllowPose: ["KneelingSpread"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Attribute: ["Skirt"], Layer: [
					{ Name: "Base" },
					{ Name: "Belt" },
					{ Name: "Cross" },
					{ Name: "Metal" },
				],
			},
			// Penis Compatible Clothing
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "SuitLower",
		ParentGroup: "BodyLower",
		Priority: 14,
		Default: false,
		Clothing: true,
		Random: false,
		Left: 95,
		Top: 380,
		AllowPose: ["LegsClosed", "Kneel", "KneelingSpread", "Spread", "Hogtied"],
		PreviewZone: [0, 450, 500, 500],
		Asset: [
			// Vagina Compatible Clothing
			{
				Name: "Catsuit", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings", "BodyLower"], HideItem: ["SocksPantyhose1"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" }
				]
			},
			{ Name: "SeamlessCatsuit", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings", "BodyLower"], HideItem: ["SocksPantyhose1"] },
			{ Name: "CatsuitPanties", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings"], AllowPose: ["Hogtied"] },
			{ Name: "PilotSuit", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696", "#282828"], Hide: ["ItemVulvaPiercings", "BodyLower"], HideItem: ["SocksPantyhose1"],
				HideForPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
					{ Name: "Layer4", AllowColorize: true }
				]
			},
			{ Name: "PilotPanties", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696", "#282828"], Hide: ["ItemVulvaPiercings"], DynamicGroupName: "Panties", AllowPose: [],
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
				]
			},
			{ Name: "SeethroughSuit", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["SocksPantyhose1"] },
			{
				Name: "SeethroughSuitZip", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex"], Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["SocksPantyhose1"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" }
				]
			},
			{ Name: "ReverseBunnySuit", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Latex", "Pet"], Value: -1, BuyGroup: "ReverseBunnySuit" },
			{ Name: "Pantyhose1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], BuyGroup: "Pantyhose", Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], DynamicGroupName: "Socks" },
			{ Name: "Pantyhose2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, BuyGroup: "Pantyhose2", DynamicGroupName: "Socks" },
			{ Name: "Stockings1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Left: 125, Top: 400, BuyGroup: "Stockings1", DynamicGroupName: "Socks" },
			{ Name: "Stockings2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Left: 125, Top: 400, BuyGroup: "Stockings2", DynamicGroupName: "Socks" },
			{ Name: "Stockings3", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, BuyGroup: "Stockings3", DynamicGroupName: "Socks" },
			{ Name: "Stockings4", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, BuyGroup: "Stockings4", DynamicGroupName: "Socks" },
			// Penis Compatible Clothing
			{
				Name: "MaleSeamlessCatsuit", Gender: "M", Prerequisite: ["HasPenis"], DefaultColor: ["Default", "#000000"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings", "BodyLower", "Pussy", "ItemVulva"], HideItem: ["SocksPantyhose1"],
				Layer: [
					{ Name: "Base", HasType: false },
					{ Name: "Bulge", CopyLayerColor: "Base", HasType: false, AllowTypes: ["Bulge", "Lock"] },
					{ Name: "Penis", CopyLayerColor: "Base", HasType: false, AllowTypes: ["SkinTight"] },
					{ Name: "Lock", HasType: false, AllowTypes: ["Lock"] },
				]
			},
			{
				Name: "MaleCatsuitPanties", Gender: "M", Prerequisite: ["HasPenis"], DefaultColor: ["Default", "#000000"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings", "Pussy", "ItemVulva"], HideItem: ["SocksPantyhose1"],
				Layer: [
					{ Name: "Base", HasType: false },
					{ Name: "Bulge", CopyLayerColor: "Base", HasType: false, AllowTypes: ["Bulge", "Lock"] },
					{ Name: "Penis", CopyLayerColor: "Base", HasType: false, AllowTypes: ["SkinTight"] },
					{ Name: "Lock", HasType: false, AllowTypes: ["Lock"] },
				]
			}
		],

		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Bra",
		ParentGroup: "BodyUpper",
		Priority: 21,
		Clothing: true,
		Underwear: true,
		Left: 150,
		Top: 200,
		AllowPose: ["Yoked", "Hogtied"],
		PreviewZone: [75, 190, 350, 350],
		Asset: [
			// Breast Compatible Clothing
			{ Name: "Bra1", Gender: "F", Prerequisite: ["HasBreasts"], Hide: ["ItemNipples"], },
			{ Name: "Bra2", Gender: "F", Prerequisite: ["HasBreasts"], Hide: ["ItemNipples"] },
			{ Name: "Bra7", Gender: "F", Prerequisite: ["HasBreasts"], Priority: 20, Hide: ["ItemNipples"] },
			{ Name: "Bra8", Gender: "F", Prerequisite: ["HasBreasts"], Value: 15, Hide: ["ItemNipples"] },
			{ Name: "Bra9", Gender: "F", Prerequisite: ["HasBreasts"], Value: 10, Hide: ["ItemNipples"] },
			{ Name: "Bandeau1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 20, Value: 25, Hide: ["ItemNipples"] },
			{ Name: "MaidBra1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: -1, BuyGroup: "Maid", Hide: ["ItemNipples"],
				DefaultColor: ["#212121", "Default"],
				Layer:[
					{ Name: "Bra" },
					{ Name: "Frills" },
				]
			},
			{ Name: "Bustier1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 30, Hide: ["ItemNipples"] },
			{
				Name: "Bikini1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 25, Hide: ["ItemNipples"],
				PoseMapping: { Hogtied: "", Yoked: "" }
			},
			{ Name: "SexyBikini1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, Hide: ["ItemNipples"], Extended: true,
				Layer:[
					{ Name: "Main", AllowColorize: true},
					{ Name: "Sides", AllowColorize: true}
				]
			},
			{ Name: "SexyBikini2", Gender: "F", Prerequisite: ["HasBreasts"], Value: 40, Hide: ["ItemNipples"] },
			{ Name: "SexyBikini3", Gender: "F", Prerequisite: ["HasBreasts"], Value: 45, Hide: ["ItemNipples"] },
			{ Name: "Swimsuit1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 15, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"], Extended: true },
			{ Name: "Swimsuit2", Gender: "F", Prerequisite: ["HasBreasts"], Value: 25, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "BunnySuit", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Nylon", "Pet"], Value: 30, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"] },
			{
				Name: "LatexBunnySuit", Gender: "F", Prerequisite: ["HasBreasts"], Top: 0, Left: 0, Fetish: ["Latex", "Pet"], AllowPose: ["Hogtied"], DefaultColor: "#6C33AE", Value: 30, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"],
				Layer: [
					{ Name: "Bottom", AllowColorize: true, HideForPose: ["Hogtied"] },
					{ Name: "BottomShine", AllowColorize: false, HideForPose: ["Hogtied"] },
					{ Name: "Navel", CopyLayerColor: "Bottom", AllowColorize: true, ParentGroup: null , HideForPose: ["Hogtied"] },
					{ Name: "Breasts", CopyLayerColor: "Bottom", AllowPose: [], AllowColorize: true },
					{ Name: "BreastsShine", AllowPose: [], AllowColorize: false }
				]
			},
			{ Name: "FrameBra1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 20, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "FrameBra2", Gender: "F", Prerequisite: ["HasBreasts"], Value: 15, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "BondageBra1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LatexBra1", Gender: "F",Prerequisite: ["HasBreasts"], Fetish: ["Lingerie", "Latex"], Value: 30, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 20, Value: 30, BuyGroup: "HarnessBra1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra2", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 20, Value: 40, BuyGroup: "HarnessBra2", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CuteBikini1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], Extended: true,
				Layer:[
					{ Name: "Main", AllowColorize: true},
					{ Name: "Sides", AllowColorize: true}
				]
			},
			{ Name: "CorsetBikini1", Gender: "F", Prerequisite: ["HasBreasts"],Fetish: ["Lingerie"], Priority: 20, Value: 40, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "OuvertPerl1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 20, Value: 40, HideItem: ["ItemNipplesLactationPump"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Sarashi1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 25, Hide: ["ItemNipples"] },
			{ Name: "KittyBra1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Pet"], Value: 30, Hide: ["ItemNipples"] },
			{ Name: "FishnetBikini1", Gender: "F", Prerequisite: ["HasBreasts"], Priority: 20, Value: 45, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "SexyBeachBra1", Gender: "F",Prerequisite: ["HasBreasts"], Value: 25, Hide: ["ItemNipples"] },
			{ Name: "SexyBikiniBra1", Gender: "F", Prerequisite: ["HasBreasts"], Value: 25, Hide: ["ItemNipples"] },
			{ Name: "StarHarnessBra", Gender: "F",Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HeartTop", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 20, Value: 35, Hide: ["ItemNipples"] },
			{ Name: "ChineseBra1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 35, Hide: ["ItemNipples"] },
			{ Name: "LeatherStrapBra1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: 15, BuyGroup: "LeatherStrapBra1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], AllowPose: [] },
			{ Name: "Swimsuit3", Gender: "F", Prerequisite: ["HasBreasts"], Value: 35, DefaultColor: "#E53771", Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "ClamShell", Gender: "F", Prerequisite: ["HasBreasts"], Value: 20, Left: 0, Top: 0, DefaultColor: "#E53771", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "CowPrintedBra", Gender: "F", Prerequisite: ["HasBreasts"], Value: 15, Hide: ["ItemNipples"] },
			{
				Name: "StuddedHarness", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie", "Leather"], Priority: 20, Value: -1, DefaultColor:"#343131", BuyGroup: "StuddedHarness", Expose:["ItemBreast"], Hide: ["ItemNipples","ItemNipplesPiercings"], HideItem: ["PantiesDiapers1","PantiesDiapers2","PantiesDiapers3", "PantiesDiapers4"],
				Layer:[
					{ Name: "Harness", AllowColorize: true},
					{ Name: "Metal", AllowColorize: false}
				]
			},
			{ Name: "Camisole", Gender: "F", Prerequisite: ["HasBreasts"], Priority: 22, DefaultColor: "#908867", Value: 5, Hide: ["ItemNipples"] },
			{ Name: "Ribbons", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 30, BuyGroup: "Ribbon", Extended: true, Hide:["ItemNipples"] },
			{ Name: "LeatherBreastBinder", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: 30, BuyGroup: "BreastBinder", AllowPose: [], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "FullLatexBra", Gender: "F", Prerequisite: ["HasBreasts"], BuyGroup: "FullLatexBra", Fetish: ["Lingerie", "Latex"], Value: 45, Hide: ["ItemNipples"] },
			{ Name: "FullLatexBra2", Gender: "F", Prerequisite: ["HasBreasts"], BuyGroup: "FullLatexBra", Fetish: ["Lingerie", "Latex"], Value: -1, Hide: ["ItemNipples"],
				Layer:[
					{ Name: "Bra", AllowColorize: true},
					{ Name: "Shine", AllowColorize: true}
				]
			},
			{
				Name: "HaremBra", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 25, Left: 0, Top: 0, Hide: ["ItemNipples"], Layer:[
					{ Name: "Fabric" },
					{ Name: "Straps" },
					{ Name: "Jewel" }
				]
			},
			{ Name: "FlowerBra", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 15, Hide: ["ItemNipples"],
				Layer: [
					{ Name: "Bra", AllowColorize: true },
					{ Name: "Flowers", AllowColorize: true },
				]
			},
			{ Name: "Bra10", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, Hide: ["ItemNipples"] },
			{ Name: "CoconutBra", Gender: "F", Prerequisite: ["HasBreasts"], Value: 15, Hide: ["ItemNipples"], AllowPose: [], DefaultColor: "#83440B" },
			{
				Name: "SleevelessSlimLatexLeotard", Gender: "F", Prerequisite: ["HasBreasts"], Value: 50, Top: 0, Left: 0, Hide: ["Panties", "ItemNipples", "ItemVulvaPiercings", "ItemVulva"], HideItemExclude: ["ItemVulvaWiredEgg"],
				PoseMapping: { Yoked: "" },
				Layer: [
					{ Name: "Latex" },
					{ Name: "Shine", AllowColorize: false },
					{ Name: "BreastShade", AllowColorize: false }
				]
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Corset",
		ParentGroup: "BodyUpper",
		Priority: 22,
		Clothing: true,
		Default: false,
		Underwear: true,
		Left: 150,
		Top: 200,
		AllowPose: ["Hogtied"],
		PreviewZone: [75, 250, 350, 350],
		Asset: [
			// Breast Compatible Clothing
			{ Name: "Corset1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 22, Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"] },
			{ Name: "Corset2", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 22, Value: 30, BuyGroup: "Corset2", Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"] },
			{ Name: "Corset3", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 22, Value: 25, BuyGroup: "Corset3", Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"] },
			{ Name: "Corset4", Fetish: ["Lingerie"], Priority: 22, Value: 15, BuyGroup: "Corset4", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["AllFours"] },
			{ Name: "Corset5", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Priority: 22, Value: 20, BuyGroup: "Corset5", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["AllFours"] },
			{
				Name: "LatexCorset1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie", "Latex"], Priority: 21, Value: 40, BuyGroup: "LatexCorset1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["AllFours"], Extended: true, HasType: false,
				Layer:[
					{ Name: "Base", HasType: false },
					{ Name: "Garter", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				],
			},
			{
				Name: "LeatherCorsetTop1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Left: 0, Top: 0, BuyGroup: "LeatherCorsetTop1", Priority: 25, Value: 60,
				HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump"],
				AllowPose: ["Hogtied", "AllFours"]
			},
			{
				Name: "Corset6", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Lingerie"], Value: 40, DefaultColor: ["#435331", "#363535", "#A08759"], Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"],
				Layer:[
					{ Name: "Cloth", AllowColorize: true},
					{ Name: "Leather", AllowColorize: true},
					{ Name: "Buttons", AllowColorize: true}
				]
			},
			{
				Name: "SteampunkCorsetTop1", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Left: 0, Top: 0, BuyGroup: "SteampunkCorsetTop1", Priority: 25, Value: 70, Hide: ["ItemHidden"],
				HideItem: ["ClothLowerTennisSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsNecklacePiercingChain", "ItemNipplesLactationPump", "ClothAccessoryPoncho", "NecklaceBodyChainNecklace"],
				AllowPose: ["Hogtied", "AllFours", "OverTheHead"]
			},
			// Flat Chest Compatible Clothing
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Panties",
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Priority: 19,
		Clothing: true,
		Underwear: true,
		Left: 150,
		Top: 395,
		PreviewZone: [125, 350, 250, 250],
		Asset: [
			// Vagina Compatible Clothing
			{ Name: "Panties1", Gender: "F", Prerequisite: ["HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties7", Gender: "F", Prerequisite: ["HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties8", Gender: "F", Prerequisite: ["HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties11", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties12", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties13", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties14", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties15", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Bikini1", Gender: "F", Prerequisite: ["HasVagina"], Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Diapers1", Gender: "F", Prerequisite: ["HasVagina"], Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Random: false, Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{
				Name: "Diapers2", Gender: "F", Prerequisite: ["HasVagina"], Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Random: false,Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Layer: [
					{ Name: "Diaper" },
					{ Name: "Cover" }
				]
			},
			{ Name: "Diapers3", Gender: "F", Prerequisite: ["HasVagina"], Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Random: false,Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{
				Name: "Diapers4", Gender: "F", Prerequisite: ["HasVagina"], Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Random: false,Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Extended: true,
				Layer: [
					{ Name: "Diaper", HasType: false },
					{ Name: "Tape", HasType: false },
					{ Name: "Pattern", AllowTypes: ["StrawBerry", "Spots", "Butterfly", "Flower"] },
				]
			},
			{
				Name: "BulkyDiaper", BuyGroup: "BulkyDiapers", Priority: 25, Category: ["ABDL"], Fetish: ["ABDL"], Random: false, Value: 30, DefaultColor:["#688599", "#808080", "#8c7384", "#BF3F97"], AllowPose: ["LegsClosed", "Kneel"], HideForPose: ["KneelingSpread", "Hogtied", "AllFours"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Left: 49, Top: 360, SetPose: ["LegsOpen"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"],
				Layer: [
					{ Name: "Base" },
					{ Name: "CrotchPiece" },
					{ Name: "WaistBand" },
					{ Name: "Tape", ParentGroup: null },
					{ Name: "Back", CopyLayerColor: "Base", ParentGroup: null, Priority: 6 },
				]
			},
			{
				Name: "PoofyDiaper", BuyGroup: "PoofyDiapers", Priority: 25, Category: ["ABDL"], Fetish: ["ABDL"], Random: false, Value: 30, DefaultColor:["#9763A6", "#658AA6", "#997391", "#a916cc"], AllowPose: ["LegsClosed", "Kneel"], HideForPose: ["KneelingSpread", "Hogtied", "AllFours"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], HideItemExclude: ["ClothLowerHaremPants", "ClothLowerPleatedSkirt", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerLeggings1", "ClothLowerLeggings2"], Left: 49, Top: 360, SetPose: ["LegsOpen"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"], Extended: true,
				Layer: [
					{ Name: "Base", HasType: false, AllowTypes: [""] },
					{ Name: "PoofyBase", CopyLayerColor: "Base", HasType: false, AllowTypes: ["Poofy"] },
					{ Name: "CrotchPatch", HasType: false },
					{ Name: "Frills", HasType: false },
					{ Name: "Tape", HasType: false, ParentGroup: null },
					{ Name: "Back", CopyLayerColor: "Base", HasType: false, ParentGroup: null, Priority: 6 },
				]
			},
			{ Name: "Panties16", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "MaidPanties1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "MaidPanties2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: -1, BuyGroup: "Maid", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				DefaultColor: ["#212121", "Default"],
				Layer: [
					{ Name: "Panties" },
					{ Name: "Frills" },
				]
			},
			{ Name: "LatexPanties1", Gender: "F", Prerequisite: ["HasVagina"], BuyGroup: "LatexPanties", Fetish: ["Latex"], Value: -1, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "WrapPanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 25, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "CrotchPanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 30, AllowPose: ["KneelingSpread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexCrotchlessPanties", Gender: "F", Prerequisite: ["HasVagina"], Top: 462, Left: 0, Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "RedBowPanties", Gender: "F", Prerequisite: ["HasVagina"], Top: 435, Left: 0, Value: 30, DefaultColor: ["Default", "#E70505"],
				Layer: [
					{ Name: "Panties", ParentGroup: null},
					{ Name: "Bow", ParentGroup: null},
				]
			},
			{ Name: "StringPanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "StringPasty1", Gender: "F", Prerequisite: ["HasVagina"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "ZipPanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "HarnessPanties1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 35, Left: 110, Top: 395, DynamicGroupName: "ItemPelvis", BuyGroup: "HarnessPanties1", AllowPose: ["LegsClosed", "Kneel", "KneelingSpread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "HarnessPanties2", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 40, Left: 85, Top: 395, DynamicGroupName: "ItemPelvis", BuyGroup: "HarnessPanties2", AllowPose: ["LegsClosed", "Kneel", "KneelingSpread", "Spread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "KittyPanties1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Pet"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "PearlPanties1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 20, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "SunstripePanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "SexyBeachPanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "ChinesePanties1", Gender: "F", Prerequisite: ["HasVagina"], Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "LeatherStrapPanties1", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Leather"], Value: 20, BuyGroup: "LeatherStrapPanties1", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "CowPrintedPanties", Gender: "F", Prerequisite: ["HasVagina"], Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "LatexPanties2", Gender: "F", Prerequisite: ["HasVagina"], BuyGroup: "LatexPanties", Fetish: ["Latex"], Value: 30,  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "PilotPanties", Gender: "F", Prerequisite: ["HasVagina"], BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696"], Left: 95, Top: 380, Fetish: ["Latex"], Value: -1,
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
				]
			},
			{ Name: "CatsuitPanties", Gender: "F", Prerequisite: ["HasVagina"], BuyGroup: "Catsuit", Left: 95, Top: 380, Fetish: ["Latex"], Value: -1, DynamicGroupName: "SuitLower",
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
			},
			{ Name: "FlowerPanties", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Lingerie"], Value: 15,  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Layer: [
					{ Name: "Panties", AllowColorize: true },
					{ Name: "Flowers", AllowColorize: true },
				]
			},
			{Name: "FloralPanties2", Gender: "F", Prerequisite: ["HasVagina"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Flowers" },
				]
			},
			{Name: "Thong", Gender: "F", Prerequisite: ["HasVagina"], Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{Name: "StringThong", Gender: "F", Prerequisite: ["HasVagina"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{Name: "MicroThong", Gender: "F", Prerequisite: ["HasVagina"], Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			// Penis Compatible Clothing
			{
				Name: "BoxerShorts", Gender: "M", Prerequisite: ["HasPenis"], Hide: ["Pussy", "ItemVulva", "ItemVulvaPiercings"], AllowExpression: ["Hard"],
				DefaultColor: ["#FFFFFF", "Default"],
				Top: 370, Left: 118,
				Layer: [
					{ Name: "Shorts", AllowPose: ["KneelingSpread", "LegsClosed", "Spread", "Kneel"], MirrorExpression: "Pussy" },
					{ Name: "Waistband", AllowPose: ["KneelingSpread"]}
				]
			},
			{
				Name: "MaleCatsuitPanties", Gender: "M", Prerequisite: ["HasPenis"], DefaultColor: ["Default", "#000000"], Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Left: 95, Top: 380, DynamicGroupName: "SuitLower", Hide: ["ItemVulvaPiercings", "Pussy", "ItemVulva"], HideItem: ["SocksPantyhose1"],
				Layer: [
					{ Name: "Base", HasType: false },
					{ Name: "Bulge", CopyLayerColor: "Base", HasType: false, AllowTypes: ["Bulge", "Lock"] },
					{ Name: "Penis", CopyLayerColor: "Base", HasType: false, AllowTypes: ["SkinTight"] },
					{ Name: "Lock", HasType: false, AllowTypes: ["Lock"] },
				]
			}
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Socks",
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Priority: 20,
		Clothing: true,
		Underwear: true,
		Left: 125,
		Top: 400,
		AllowPose: ["LegsClosed", "Kneel", "Spread", "Hogtied", "KneelingSpread"],
		PreviewZone: [0, 450, 500, 500],
		Asset: [
			{ Name: "Socks0", HideForPose: ["KneelingSpread"] },
			{ Name: "Socks1", HideForPose: ["KneelingSpread"] },
			{ Name: "Socks2", HideForPose: ["KneelingSpread"] },
			{ Name: "Socks3" },
			{ Name: "Socks4" },
			{ Name: "Socks5" },
			{ Name: "Stockings1", Fetish: ["Nylon"], BuyGroup: "Stockings1"},
			{ Name: "Stockings2", Fetish: ["Nylon"], BuyGroup: "Stockings2"},
			{ Name: "Stockings3", Fetish: ["Nylon"], Value: 10, BuyGroup: "Stockings3"},
			{ Name: "Stockings4", Fetish: ["Nylon"], Value: 10, BuyGroup: "Stockings4"},
			{ Name: "Pantyhose1", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], BuyGroup: "Pantyhose", Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "Socks6", Fetish: ["Nylon"], Value: 25,
				Layer: [
					{ Name: "Sock" },
					{ Name: "Frill" }
				]
			},
			{
				Name: "SocksFur", Fetish: ["Nylon"], Value: 40, DefaultColor: ["#8c2331", "Default"], HideForPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{
				Name: "SocksStriped1", Value: 10, HideForPose: ["KneelingSpread"], Layer: [
					{ Name: "Light" },
					{ Name: "Dark" },
				]
			},
			{ Name: "LatexSocks1", Fetish: ["Latex"], Value: 30 },
			{ Name: "FootlessSocks1", Value: 15 },
			{ Name: "ReverseBunnySuit", Fetish: ["Nylon", "Pet"], Left: 95, Top: 380, Value: 100, DynamicGroupName: "SuitLower", BuyGroup: "ReverseBunnySuit" },
			{ Name: "LeatherSocks1", Fetish: ["Leather"], Value: 20, HideForPose: ["KneelingSpread"] },
			{ Name: "Pantyhose2", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 10, BuyGroup: "Pantyhose2" },
			{ Name: "GradientPantyhose", Gender: "F", Prerequisite: ["HasVagina"], Fetish: ["Nylon"], Value: 49, DefaultColor: ['#8D7B7B', '#433BA3'],
				Layer:[
					{ Name: "Upper", HideForPose: ["Hogtied"]},
					{ Name: "Lower", HideForPose: ["Kneel", "KneelingSpread"] }
				]
			},
			{ Name: "CowPrintedSocks", Fetish: ["Nylon"], Value: 15 },
			{
				Name: "HaremStockings", Fetish: ["Nylon"], Value: 25,
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Bands" }
				]
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "RightAnklet",
		ParentGroup: "BodyLower",
		Priority: 22,
		Clothing: true,
		Default: false,
		Left: 115,
		Top: 500,
		AllowPose: ["LegsClosed", "Spread"],
		PreviewZone: [100, 700, 300, 300],
		Asset: [
			{ Name: "BandAnklet", BuyGroup: "BandAnklet"},
			{ Name: "Ribbon", Fetish: ["Lingerie"], Value: 30, BuyGroup: "Ribbon" },
			{ Name: "Ribbon1", Fetish: ["Lingerie"], Value: 30, BuyGroup: "Ribbon" }
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "LeftAnklet",
		ParentGroup: "BodyLower",
		Priority: 22,
		Clothing: true,
		Default: false,
		Left: 115,
		Top: 500,
		AllowPose: ["LegsClosed", "Spread"],
		PreviewZone: [100, 700, 300, 300],
		Asset: [
			{ Name: "BandAnklet", BuyGroup: "BandAnklet"},
			{ Name: "Ribbon", Fetish: ["Lingerie"], Value: 30, BuyGroup: "Ribbon" },
			{ Name: "Ribbon1", Fetish: ["Lingerie"], Value: 30, BuyGroup: "Ribbon" }
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "Garters",
		ParentGroup: "BodyLower",
		Priority: 22,
		Clothing: true,
		Default: false,
		Top: 462,
		AllowPose: ["LegsClosed", "Spread", "Kneel", "KneelingSpread"],
		PreviewZone: [100, 450, 300, 300],
		Asset: [
			{
				Name: "GarterBelt", Value: 10, Extended: true,
				Layer: [
					{ Name: "Left", HasType: false, AllowTypes: ["", "Left"] },
					{ Name: "Right", HasType: false, AllowTypes: ["", "Right"] },
				]
			},
			{ Name: "GarterBelt2", Value: 10 },
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Left: 0, Value: 250, DefaultColor: "#9221ba",
				Layer: [
					{ Name: "Tentacle" },
					{ Name: "Shine", AllowColorize: false },
				],
			},
			{
				Name: "DropBag", Value: 20, HideForPose: ["Hogtied", "AllFours"],
				Layer: [
					{ Name: "Bag", Priority: 22 },
					{ Name: "LegStrap", Priority: 21, CopyLayerColor: "Bag", HideForPose: ["KneelingSpread"] }

				],
			}
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "Shoes",
		ParentGroup: "BodyLower",
		Priority: 23,
		Clothing: true,
		Left: 115,
		Top: 500,
		AllowPose: ["LegsClosed", "Kneel", "Spread", "Hogtied", "KneelingSpread"],
		PreviewZone: [100, 700, 300, 300],
		Asset: [
			{ Name: "Shoes1", Height: 6, HideForPose: ["Kneel", "KneelingSpread"] },
			{ Name: "Shoes2", Height: 6, HideForPose: ["Kneel", "KneelingSpread"] },
			{ Name: "Shoes4", Height: 6, HideForPose: ["Kneel", "KneelingSpread"] },
			{ Name: "Sneakers1", Height: 3, HideForPose: ["Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "Main", AllowColorize: true},
					{ Name: "Front", AllowColorize: true, HideForPose: ["Hogtied"]},
					{ Name: "Laces", AllowColorize: true, HideForPose: ["Hogtied"]}
				]
			},
			{ Name: "Sneakers2", Height: 3, HideForPose: ["Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "Shoes", AllowColorize: true},
					{ Name: "Laces", AllowColorize: true, HideForPose: ["Hogtied"]}
				]
			},
			{ Name: "Heels1", Height: 15, HideForPose: ["Kneel", "KneelingSpread"], },
			{ Name: "Heels2", Height: 15, HideForPose: ["Kneel", "KneelingSpread"], },
			{ Name: "Boots1", Height: 9, HideForPose: ["Kneel", "KneelingSpread"], HideItem: ["LeftAnkletRibbon1", "RightAnkletRibbon1"],
				Layer: [
					{ Name: "Shoes", AllowColorize: true},
					{ Name: "Sides", AllowColorize: true},
					{ Name: "Laces", AllowColorize: true}
				]
			},
			{ Name: "MistressBoots", Fetish: ["Leather"], Value: -1, HideItem: ["SocksSocks4", "SocksSocks5", "LeftAnkletRibbon1", "RightAnkletRibbon1"], Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 875, 350, 200]] }], Height: 35, HideForPose: ["KneelingSpread"] },
			{ Name: "PonyBoots", Fetish: ["Pony"], Value: -1, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 875, 350, 200]] }], Height: 35, HideForPose: ["KneelingSpread"] },
			{ Name: "Sandals", Priority: 22, Value: 30, HideItem: ["SocksSocks0", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksSocksFur"], Height: 3, HideForPose: ["Kneel", "KneelingSpread"] },
			{ Name: "SandalsRS", Priority: 22, Value: 30, DefaultColor:["#AA9977", "#999999"], HideItem: ["SocksSocks0", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksSocksFur"], Height: 1, Alpha: [{ Group: ["BodyUpper"], Pose: ["Hogtied"], Masks: [[0, 0, 500, 70]] }], HideForPose: ["Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "Soles",  Priority: 6 },
					{ Name: "Top",  Priority: 22 }
				]
			},
			{ Name: "PawBoots", Fetish: ["Pet"], Value: 45, HideItem: ["LeftAnkletRibbon1", "RightAnkletRibbon1"], Height: 3, HideForPose: ["Kneel", "KneelingSpread"] },
			{ Name: "WoollyBootsTall", Fetish: ["Pet"], Value: 60, HideItem: ["LeftAnkletRibbon1", "RightAnkletRibbon1"], Height: 9, HideForPose: ["KneelingSpread"] },
			{ Name: "ThighHighLatexHeels", Fetish: ["Latex"], Value: 80, HideItem: ["LeftAnkletRibbon1", "RightAnkletRibbon1"], BuyGroup: "ThighHighLatexHeels",
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 680, 350, 320]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 650, 350, 350]] },
				], Height: 30, HideForPose: ["KneelingSpread"]
			},
			{ Name: "Heels3", Height: 15, Value: 30, HideForPose: ["Kneel", "KneelingSpread"], },
			{ Name: "BarefootSandals1", Hide: ["Socks"], Value: 10, HideForPose: ["Kneel", "KneelingSpread"], },
			{ Name: "LatexAnkleShoes", Fetish: ["Latex"], Value: 60, HideForPose: ["Kneel", "KneelingSpread"], DefaultColor: ["#373636"], },
			{ Name: "Flippers", Height: 40, Value: 25, HideForPose: ["Kneel", "KneelingSpread"], HideItem: ["LeftAnkletRibbon1", "RightAnkletRibbon1"], Left: 84, Random: false,
				Layer: [
					{ Name: "Fins",  AllowColorize: true },
					{ Name: "Shoes",  AllowColorize: false }
				]
			},
			{ Name: "DeluxeBoots", Fetish: ["Leather"], Value: -1, HideItem: ["LeftAnkletRibbon1", "RightAnkletRibbon1"], Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[180, 900, 50, 100], [280, 900, 50, 100]] }], DefaultColor: ["#9F0D0D", "#700A0A", "#700A0A", "#9F0D0D"], Height: 35, HideForPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Boots", AllowColorize: true},
					{ Name: "Laces", AllowColorize: true},
					{ Name: "Heels", AllowColorize: true},
					{ Name: "Straps", AllowColorize: true},
					{ Name: "Buckles", AllowColorize: false},
				]
			},
			{ Name: "AnkleStrapShoes", Priority: 22, Value: 30, HideForPose: ["Kneel", "KneelingSpread"], Alpha: [{ Group: ["Socks"], Masks: [[130, 925, 270, 130]] }], Height: 4 },
			{ Name: "Shoes5", Value: 30, HideForPose: ["Kneel", "KneelingSpread"], Alpha: [{ Group: ["Socks"], Masks: [[130, 925, 270, 130]] }], Height: 4 },
			{ Name: "FuturisticHeels2", Value: 50, Difficulty: 7, Time: 10, RemoveTime: 20,
				Left: 75, DefaultColor: ["Default", "#50913C", "Default", "Default", "Default", "#aaaaaa", "Default"], Random: false, AllowLock: false,
				DrawLocks: false, Audio: "FuturisticApply", BuyGroup: "FuturisticHeels", DynamicGroupName: "ItemBoots", Extended: true, FuturisticRecolor: true, Effect: [],
				AllowPose: ["LegsClosed", "Kneel", "Hogtied", "Spread"],
				HideForPose: ["Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "Mesh", ParentGroup: null, HasType: false },
					{ Name: "Shine", ParentGroup: null, HasType: false, AllowTypes:[""]},
					{ Name: "Cuffs", ParentGroup: null, HasType: false },
					{ Name: "Trim", ParentGroup: null, HasType: false },
					{ Name: "Soles", ParentGroup: null, HasType: false },
				], Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 860, 350, 120]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 870, 350, 150]] },
				], Height: 30
			},
			{
				Name: "FuzzyBoots", Value: 60, Top: 462, Left: 0, DefaultColor: ["#444", "#941a1a", "#666"],
				HideForPose: ["Kneel", "Hogtied", "KneelingSpread"],
				Hide: ["LeftAnklet", "RightAnklet"],
				Layer: [
					{ Name: "Heels", ParentGroup: null },
					{ Name: "Boots" },
					{ Name: "Fur" },
				],
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[0, 805, 500, 195]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[0, 795, 500, 205]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["Spread"], Masks: [[0, 790, 500, 210]] },
				],
			},
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Hat",
		Priority: 55,
		Default: false,
		Clothing: true,
		Left: 125,
		Top: 0,
		PreviewZone: [140, 0, 220, 220],
		Asset: [
			{ Name: "Band1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 25 },
				]
			},
			{ Name: "Band2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 25 },
				]
			},
			{ Name: "Beret1", HideForPose: ["Suspension"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 10 },
				]
			},
			{ Name: "MaidHairband1", Fetish: ["Lingerie"], Value: -1, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 30 },
				]
			},
			{ Name: "NurseCap", Value: -1, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 20 },
				]
			},
			{
				Name: "Santa1", Value: 20, HideForPose: ["Suspension"],
				Layer: [
					{ Name: "Fabric", HideForAttribute: ["ShortHair"] },
					{ Name: "Fur", HideForAttribute: ["ShortHair"] },
					{ Name: "FabricShort", CopyLayerColor: "Fabric", ShowForAttribute: ["ShortHair"] },
					{ Name: "FurShort", CopyLayerColor: "Fur", ShowForAttribute: ["ShortHair"] },
					{ Name: "BackShort", CopyLayerColor: "Fur", Priority: 6, ShowForAttribute: ["ShortHair"] }
				]
			},
			{
				Name: "CaptainHat1", Value: 25, HideForPose: ["Suspension"], Layer: [
					{ Name: "Top", HideForAttribute: ["ShortHair"] },
					{ Name: "Insignia", HideForAttribute: ["ShortHair"] },
					{ Name: "Rope", HideForAttribute: ["ShortHair"] },
					{ Name: "Brim", HideForAttribute: ["ShortHair"] },
					{ Name: "TopShort", CopyLayerColor: "Top", ShowForAttribute: ["ShortHair"], Top: 20 },
					{ Name: "InsigniaShort", CopyLayerColor: "Insignia", ShowForAttribute: ["ShortHair"], Top: 20 },
					{ Name: "RopeShort", CopyLayerColor: "Rope", ShowForAttribute: ["ShortHair"], Top: 20 },
					{ Name: "BrimShort", CopyLayerColor: "Brim", ShowForAttribute: ["ShortHair"], Top: 20 },
				]
			},
			{ Name: "BunnySuccubus2", Fetish: ["Pet"], Value: 35, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" },
				]
			},
			{
				Name: "WitchHat1", Value: 40, HideForPose: ["Suspension"],
				Layer: [
					{ Name: "Hat", HideForAttribute: ["ShortHair"] },
					{ Name: "Band", HideForAttribute: ["ShortHair"] },
					{ Name: "HatShort", CopyLayerColor: "Hat", ShowForAttribute: ["ShortHair"], Top: 10 },
					{ Name: "BandShort", CopyLayerColor: "Band", ShowForAttribute: ["ShortHair"], Top: 10 },
				]
			},
			{
				Name: "PirateBandana1", Value: 15, Layer: [
					{ Name: "Bandana", HideForAttribute: ["ShortHair"] },
					{ Name: "Skull", HideForAttribute: ["ShortHair"] },
					{ Name: "Dots", HideForAttribute: ["ShortHair"] },
					{ Name: "BandanaShort", CopyLayerColor: "Bandana", ShowForAttribute: ["ShortHair"], Top: 10 },
					{ Name: "SkullShort", CopyLayerColor: "Skull", ShowForAttribute: ["ShortHair"], Top: 10 },
					{ Name: "DotsShort", CopyLayerColor: "Dots", ShowForAttribute: ["ShortHair"], Top: 10 },
					{ Name: "BandanaBackShort", CopyLayerColor: "Bandana", Priority: 6, ShowForAttribute: ["ShortHair"], Top: 10 },
				]
			},
			{
				Name: "Bandana", Value: 20, Left: 76, Top: -20, DefaultColor: ["#DC3434", "#FFFFFF"], AllowPose: [], Extended: true, Layer: [
					{ Name: "Band", HasType: false, CopyLayerColor: "Bow", HideForAttribute: ["ShortHair"] },
					{ Name: "Bow", Priority: 6, HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "BandPattern", CopyLayerColor: "BowPattern", AllowTypes: ["Circles", "Flowers", "PolkaDots", "Triangles"], HideForAttribute: ["ShortHair"] },
					{ Name: "BowPattern", Priority: 6, AllowTypes: ["Circles", "Flowers", "PolkaDots", "Triangles"], HideForAttribute: ["ShortHair"] },
					{ Name: "BandShort", CopyLayerColor: "Bow", HasType: false, ShowForAttribute: ["ShortHair"], Top: -5 },
					{ Name: "BowShort", CopyLayerColor: "Bow", Priority: 6, HasType: false, ShowForAttribute: ["ShortHair"] },
					{ Name: "BandPatternShort", CopyLayerColor: "BowPattern", AllowTypes: ["Circles", "Flowers", "PolkaDots", "Triangles"], ShowForAttribute: ["ShortHair"], Top: -5 },
					{ Name: "BowPatternShort", CopyLayerColor: "BowPattern", Priority: 6, AllowTypes: ["Circles", "Flowers", "PolkaDots", "Triangles"], ShowForAttribute: ["ShortHair"] },
				]
			},
			{
				Name: "PoliceWomanHat", Value: 40, AllowPose: [], Layer: [
					{ Name: "Badge", HideForAttribute: ["ShortHair"] },
					{ Name: "Hat", HideForAttribute: ["ShortHair"] },
					{ Name: "BadgeShort", CopyLayerColor: "Badge", ShowForAttribute: ["ShortHair"], Top: 15 },
					{ Name: "HatShort", CopyLayerColor: "Hat", ShowForAttribute: ["ShortHair"], Top: 15 }
				]
			},
			{ Name: "HeadTowel1", Value: 15, Hide: ["HairFront", "HairBack"] },
			{ Name: "CollegeDunce", Value: -1, HideForPose: ["Suspension"] },
			{ Name: "Tiara1", Value: 40 },
			{
				Name: "Bonnet1", Value: 20,
				Layer: [
					{ Name: "Base", HideForAttribute: ["ShortHair"] },
					{ Name: "Lace", HideForAttribute: ["ShortHair"] },
					{ Name: "BaseShort", CopyLayerColor: "Base", ShowForAttribute: ["ShortHair"], Top: 25 },
					{ Name: "LaceShort", CopyLayerColor: "Lace", ShowForAttribute: ["ShortHair"], Top: 25 }
				]
			},
			{ Name: "Bonnet2", Value: 20, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 25 },
				]
			},
			{ Name: "Crown1", Value: 20, HideForPose: ["Suspension"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 25 },
				]
			},
			{
				Name: "Crown2", Value: 20, HideForPose: ["Suspension"], Layer: [
					{ Name: "Crown", HideForAttribute: ["ShortHair"] },
					{ Name: "Jewels", HideForAttribute: ["ShortHair"] },
					{ Name: "CrownShort", CopyLayerColor: "Crown", ShowForAttribute: ["ShortHair"], Top: 25 },
					{ Name: "JewelsShort", CopyLayerColor: "Jewels", ShowForAttribute: ["ShortHair"], Top: 25 }
				]
			},
			{
				Name: "Crown3", Value: 20, HideForPose: ["Suspension"], Layer: [
					{ Name: "Crown", HideForAttribute: ["ShortHair"] },
					{ Name: "Jewels", HideForAttribute: ["ShortHair"] },
					{ Name: "CrownShort", CopyLayerColor: "Crown", ShowForAttribute: ["ShortHair"], Top: 25 },
					{ Name: "JewelsShort", CopyLayerColor: "Jewels", ShowForAttribute: ["ShortHair"], Top: 25 }
				]
			},
			{ Name: "Crown4", Value: 20, HideForPose: ["Suspension"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 25 },
				]
			},
			{ Name: "Crown5", Value: 20, HideForPose: ["Suspension"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 25 },
				]
			},
			{ Name: "SmallHat1", Value: 30, HideForPose: ["Suspension"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 20 },
				]
			},
			{ Name: "Veil1", Fetish: ["Lingerie"], Value: 40, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 20 },
				]
			},
			{ Name: "Veil2", Fetish: ["Lingerie"], Value: 40, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 20 },
				]
			},
			{ Name: "BakerBoyHat", Value: 40, HideForPose: ["Suspension"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], Top: 35 },
				]
			},
			{ Name: "ReindeerBand", Value: 10, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long", Top: 10 },
				]
			},
			{ Name: "FurHeadband", Value: 5},
			{ Name: "FacePaint", Value: 10, Left: 150, Top: 20, Priority: 7, BuyGroup: "FacePaint", DefaultColor: ["#9A7F76"], Hide: ["Head"] },
			{
				Name: "RoseCrown", Value: 20, DefaultColor: ["#1B7E1B", "#BE2B2B"], Layer: [
					{ Name: "Leaves" },
					{ Name: "Roses" }
				]
			},
			{
				Name: "FlowerCrown", Value: 20, DefaultColor: ["#AA7386", "#B25576"], Layer: [
					{ Name: "MainFlowers" },
					{ Name: "Petals" }
				]
			},
			{
				Name: "PoppyCrown", Value: 20, DefaultColor: ["#F7B405", "#D816DA", "#2635C4", "#54BF28", "#F7B405"], Layer: [
					{ Name: "EndFlowers" },
					{ Name: "MainFlower" },
					{ Name: "SideFlowers" },
					{ Name: "Leaves" },
					{ Name: "Center" }
				]
			},
			{
				Name: "LatexHabit", Fetish: ["Latex"], BuyGroup: "LatexHabit", Top: 23, Left: 85, Value: 30, HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3",], Block: ["ItemEars"], DynamicGroupName:"ItemHood",
				Layer:[
					{Name: "Cape"},
					{Name: "Collar"},
					{Name: "Base"},
					{Name: "Cowl"},
					{Name: "Back", Priority: 5, CopyLayerColor: "Base"}
				],
			},
			{
				Name: "BallCapBack", Value: -1, Left: 150, Top: 45, BuyGroup: "BallCap", DefaultColor: ["#3B3B3B", "#CCCC32", "#424242", "#3B3B3B"], Extended: true, Layer: [
					{ Name: "PanelLeft", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "PanelRight", CopyLayerColor: "PanelLeft", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "Button", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "SideLeft", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "SideRight", CopyLayerColor: "SideLeft", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "Strap", Priority: 55, AllowTypes: ["StrapOver"], HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "StrapUnder", CopyLayerColor: "Strap", Priority: 50, HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "PanelLeftShort", CopyLayerColor: "PanelLeft", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60, },
					{ Name: "PanelRightShort", CopyLayerColor: "PanelLeft", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "ButtonShort", CopyLayerColor: "Button", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "SideLeftShort", CopyLayerColor: "SideLeft", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "SideRightShort", CopyLayerColor: "SideLeft", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "StrapShort", CopyLayerColor: "Strap", Priority: 55, AllowTypes: ["StrapOver"], HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "StrapUnderShort", CopyLayerColor: "Strap", Priority: 50, HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 }
				],
			},
			{
				Name: "BallCapFront", Value: 30, Left: 150, Top: 45, BuyGroup: "BallCap", DefaultColor: ["#3B3B3B", "#3B3B3B", "#3B3B3B", "#CCCC32", "#424242", "Default"], Extended: true, Layer: [
					{ Name: "Panel", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "PanelLeft", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "PanelRight", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "Button", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "Visor", HasType: false, HideForAttribute: ["ShortHair"] },
					{ Name: "Print", AllowTypes: ["BCLogo", "BDSM", "BG", "Chain", "Gag", "Knot", "Monogram", "Rock", "Smile", "Sun", "Tick"], AllowColorize: true, ParentGroup: null, HideForAttribute: ["ShortHair"] },
					{ Name: "PanelShort", CopyLayerColor: "Panel", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "PanelLeftShort", CopyLayerColor: "PanelLeft", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "PanelRightShort", CopyLayerColor: "PanelRight", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "ButtonShort", CopyLayerColor: "Button", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "VisorShort", CopyLayerColor: "Visor", HasType: false, ShowForAttribute: ["ShortHair"], Top: 60 },
					{ Name: "PrintShort", CopyLayerColor: "Print", AllowTypes: ["BCLogo", "BDSM", "BG", "Chain", "Gag", "Knot", "Monogram", "Rock", "Smile", "Sun", "Tick"], AllowColorize: true, ParentGroup: null, ShowForAttribute: ["ShortHair"], Top: 60 },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	// Hair accessory 1: Ears & Accessories
	// Hair accessory 2: Ears only
	// Hair accessory 3: Accessories only
	{
		Group: "HairAccessory3",
		Priority: 56,
		Default: false,
		Clothing: true,
		Left: 90,
		Top: 0,
		PreviewZone: [125, 0, 250, 250],
		DynamicGroupName: "HairAccessory1",
		Asset: [
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1"},
			{ Name: "Ribbons2", Priority: 4, Value: -1, BuyGroup: "Ribbons2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Ribbons3", BuyGroup: "Ribbons3", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Ribbons4", BuyGroup: "Ribbons4", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 88}
				]
			},
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "HairFlower1", Value: -1, BuyGroup: "HairFlower1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 0, Left: 94}
				]
			},
			{ Name: "WeddingVeil1", Priority: 4, Value: -1, BuyGroup: "WeddingVeil1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "HairFeathers1", Value: -1, BuyGroup: "HairFeathers1" },
			{
				Name: "Halo", Value: -1, BuyGroup: "Halo", Top: -100, Left: 0,
				DefaultColor: ["#fff4a0", "#ffee66", "#fffdee"], Extended: true, MinOpacity: 0, Opacity: 0,
				Layer: [
					{ Name: "Glow", Opacity: 0 },
					{ Name: "Base", MinOpacity: 1 },
					{ Name: "Core", Opacity: 0, }
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "HairAccessory1",
		Priority: 54,
		Default: false,
		Clothing: true,
		Random: false,
		Left: 90,
		Top: 0,
		PreviewZone: [125, 0, 250, 250],
		Asset: [
			{ Name: "Ears1", Fetish: ["Pet"], BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 30, Left: 90}
				]
			},
			{ Name: "Ears2", Fetish: ["Pet"], BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 23, Left: 102}
				]
			},
			{ Name: "PonyEars1", Fetish: ["Pony"], BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "Ribbons2", Priority: 4, Value: -1, BuyGroup: "Ribbons2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Ribbons3", BuyGroup: "Ribbons3", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Ribbons4", BuyGroup: "Ribbons4", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 88}
				]
			},
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "BunnyEars1", Fetish: ["Pet"], Value: 10, BuyGroup: "BunnyEars1", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], Priority: 12, CopyLayerColor: "Long" , Top: 30, Left: 95}
				]
			},
			{
				Name: "BunnyEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "BunnyEars2", BodyCosplay: true, Layer: [
					{ Name: "Outer", HideForAttribute: ["ShortHair"] },
					{ Name: "Inner", HideForAttribute: ["ShortHair"] },
					{ Name: "OuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Outer" , Top: 23, Left: 90},
					{ Name: "InnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Inner" , Top: 23, Left: 90}
				]
			},
			{ Name: "PuppyEars1", Fetish: ["Pet"], Priority: 6, Value: 20, BuyGroup: "PuppyEars1", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 88}
				]
			},
			{ Name: "SuccubusHorns", Fetish: ["Pet"], Value: 15, BuyGroup: "SuccubusHorns", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Horns", Fetish: ["Pet"], Value: 20, BuyGroup: "Horns", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Horns2", Fetish: ["Pet"], Value: 15, BuyGroup: "Horns2", BodyCosplay: true },
			{ Name: "Horns3", Fetish: ["Pet"], Value: 15, BuyGroup: "Horns3", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 93}
				]
			},
			{ Name: "HairFlower1", Value: 10, BuyGroup: "HairFlower1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 0, Left: 94}
				]
			},
			{ Name: "FoxEars1", Fetish: ["Pet"], Value: 15, BuyGroup: "FoxEars1", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 21, Left: 91}
				]
			},
			{ Name: "BatWings", Fetish: ["Pet"], Value: 20, BuyGroup: "BatWings", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 89}
				]
			},
			{ Name: "KittenEars1", Fetish: ["Pet"], Value: 20, BuyGroup: "KittenEars1", BodyCosplay: true,
				Layer: [
					{ Name: "Outer", HideForAttribute: ["ShortHair"] },
					{ Name: "Inner", HideForAttribute: ["ShortHair"] },
					{ Name: "OuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Outer" , Top: 30, Left: 115},
					{ Name: "InnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Inner" , Top: 30, Left: 115}
				]
			},
			{ Name: "KittenEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "KittenEars2", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 28, Left: 90}
				]
			},
			{ Name: "WolfEars1", Fetish: ["Pet"], Value: 20, BuyGroup: "WolfEars1", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 25, Left: 94}
				]
			},
			{ Name: "WolfEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "WolfEars2", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 90}
				]
			},
			{ Name: "FoxEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "FoxEars2", BodyCosplay: true,
				Layer: [
					{ Name: "Outer", HideForAttribute: ["ShortHair"] },
					{ Name: "Inner", HideForAttribute: ["ShortHair"] },
					{ Name: "OuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Outer" , Top: 17, Left: 91},
					{ Name: "InnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Inner" , Top: 17, Left: 91}
				]
			},
			{ Name: "FoxEars3", Fetish: ["Pet"], Value: 20, BuyGroup: "FoxEars3", BodyCosplay: true, Layer:[
				{ Name: "EarOuter", HideForAttribute: ["ShortHair"] },
				{ Name: "EarInner", HideForAttribute: ["ShortHair"] },
				{ Name: "Strap", HideForAttribute: ["ShortHair"] },
				{ Name: "Bell", HideForAttribute: ["ShortHair"] },
				{ Name: "EarOuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "EarOuter" , Top: 22, Left: 92},
				{ Name: "EarInnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "EarInner" , Top: 22, Left: 92},
				{ Name: "StrapShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Strap" , Top: 22, Left: 92},
				{ Name: "BellShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Bell" , Top: 22, Left: 92}
			]},
			{ Name: "PuppyEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "PuppyEars2", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 90}
				]
			},
			{ Name: "RaccoonEars1", Fetish: ["Pet"], Value: 15, BuyGroup: "RaccoonEars1", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 94}
				]
			},
			{ Name: "WeddingVeil1", Priority: 4, Value: 30, BuyGroup: "WeddingVeil1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "HairFeathers1", Value: 10, BuyGroup: "HairFeathers1" },
			{ Name: "MouseEars1", Fetish: ["Pet"], Value: 20, BuyGroup: "MouseEars1", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 12, Left: 85}
				]
			},
			{ Name: "MouseEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "MouseEars2", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 17, Left: 93}
				]
			},
			{ Name: "ElfEars", Value: 20, BuyGroup: "ElfEars", BodyCosplay: true, InheritColor: "BodyUpper", Extended: true, HasType: false },
			{ Name: "CowHorns", Fetish: ["Pet"], Value: 15, BuyGroup: "CowHorns", BodyCosplay: true, Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 89}
				]
			},
			{
				Name: "Halo", Value: 20, BuyGroup: "Halo", Top: -100, Left: 0,
				DefaultColor: ["#fe6", "#fe6", "#fff"], Extended: true, MinOpacity: 0, Opacity: 0,
				Layer: [
					{ Name: "Glow", Opacity: 0 },
					{ Name: "Base", MinOpacity: 1 },
					{ Name: "Core", Opacity: 0, }
				],
			},
			{ Name: "Antennae", Value: 10, BuyGroup: "Antennae", BodyCosplay: true, DefaultColor: "#151A1F", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 21, Left: 89}
				]
			},
			{ Name: "UnicornHorn", Value: 50, DefaultColor: "#EBAACB", BuyGroup: "UnicornHorn", BodyCosplay: true, AllowActivity: ["PenetrateItem"], Top: -30,
				Layer: [
					{ Name: "Base"},
					{ Name: "Shine", AllowColorize: false}
				]
			},
			{ Name: "DildocornHorn", Value: -1, DefaultColor: "Default", BuyGroup: "UnicornHorn", BodyCosplay: true, AllowActivity: ["PenetrateItem"], Top: -30,
				Layer: [
					{ Name: "Base"},
					{ Name: "Shine", AllowColorize: false}
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "HairAccessory2",
		Priority: 53,
		Default: false,
		Clothing: true,
		Random: false,
		BodyCosplay: true,
		Left: 90,
		Top: 0,
		PreviewZone: [125, 0, 250, 250],
		DynamicGroupName: "HairAccessory1",
		Asset: [
			{ Name: "Ears1", Fetish: ["Pet"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 30, Left: 90}
				]
			},
			{ Name: "Ears2", Fetish: ["Pet"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 23, Left: 102}
				]
			},
			{ Name: "PonyEars1", Fetish: ["Pony"], Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "BunnyEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "BunnyEars1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], Priority: 12, CopyLayerColor: "Long" , Top: 30, Left: 95}
				]
			},
			{
				Name: "BunnyEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "BunnyEars2", Layer: [
					{ Name: "Outer", HideForAttribute: ["ShortHair"] },
					{ Name: "Inner", HideForAttribute: ["ShortHair"] },
					{ Name: "OuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Outer" , Top: 23, Left: 90},
					{ Name: "InnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Inner" , Top: 23, Left: 90}
				]
			},
			{ Name: "PuppyEars1", Fetish: ["Pet"], Priority: 29, Value: -1, BuyGroup: "PuppyEars1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 88}
				]
			},
			{ Name: "SuccubusHorns", Fetish: ["Pet"], Value: -1, BuyGroup: "SuccubusHorns", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Horns", Fetish: ["Pet"], Value: -1, BuyGroup: "Horns", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 90}
				]
			},
			{ Name: "Horns2", Fetish: ["Pet"], Value: -1, BuyGroup: "Horns2" },
			{ Name: "Horns3", Fetish: ["Pet"], Value: -1, BuyGroup: "Horns3", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 93}
				]
			},
			{ Name: "FoxEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "FoxEars1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 21, Left: 91}
				]
			},
			{ Name: "BatWings", Fetish: ["Pet"], Value: -1, BuyGroup: "BatWings", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 20, Left: 89}
				]
			},
			{ Name: "KittenEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "KittenEars1",
				Layer: [
					{ Name: "Outer", HideForAttribute: ["ShortHair"] },
					{ Name: "Inner", HideForAttribute: ["ShortHair"] },
					{ Name: "OuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Outer" , Top: 30, Left: 115},
					{ Name: "InnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Inner" , Top: 30, Left: 115}
				],
			},
			{ Name: "KittenEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "KittenEars2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 28, Left: 90}
				]
			},
			{ Name: "WolfEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "WolfEars1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 25, Left: 94}
				]
			},
			{ Name: "WolfEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "WolfEars2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 90}
				]
			},
			{ Name: "FoxEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "FoxEars2",
				Layer: [
					{ Name: "Outer", HideForAttribute: ["ShortHair"] },
					{ Name: "Inner", HideForAttribute: ["ShortHair"] },
					{ Name: "OuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Outer" , Top: 17, Left: 91},
					{ Name: "InnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Inner" , Top: 17, Left: 91}
				]
			},
			{ Name: "FoxEars3", Fetish: ["Pet"], Value: -1, BuyGroup: "FoxEars3", Layer:[
					{ Name: "EarOuter", HideForAttribute: ["ShortHair"] },
					{ Name: "EarInner", HideForAttribute: ["ShortHair"] },
					{ Name: "Strap", HideForAttribute: ["ShortHair"] },
					{ Name: "Bell", HideForAttribute: ["ShortHair"] },
					{ Name: "EarOuterShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "EarOuter" , Top: 22, Left: 92},
					{ Name: "EarInnerShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "EarInner" , Top: 22, Left: 92},
					{ Name: "StrapShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Strap" , Top: 22, Left: 92},
					{ Name: "BellShort", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Bell" , Top: 22, Left: 92}
				]
			},
			{ Name: "PuppyEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "PuppyEars2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 90}
				]
			},
			{ Name: "RaccoonEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "RaccoonEars1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 94}
				]
			},
			{ Name: "MouseEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "MouseEars1", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 12, Left: 85}
				]
			},
			{ Name: "MouseEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "MouseEars2", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 17, Left: 93}
				]
			},
			{ Name: "ElfEars", Value: -1, BuyGroup: "ElfEars", InheritColor: "BodyUpper", Extended: true, HasType: false },
			{ Name: "CowHorns", Fetish: ["Pet"], Value: -1, BuyGroup: "CowHorns", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 15, Left: 89}
				]
			},
			{ Name: "Antennae", Value: -1, BuyGroup: "Antennae", BodyCosplay: true, DefaultColor: "#151A1F", Layer: [
					{ Name: "Long", HideForAttribute: ["ShortHair"] },
					{ Name: "Short", ShowForAttribute: ["ShortHair"], CopyLayerColor: "Long" , Top: 21, Left: 89}
				]
			},
			{ Name: "UnicornHorn", Value: -1, DefaultColor: ["#EBAACB"], BuyGroup: "UnicornHorn", BodyCosplay: true,
				Layer: [
					{ Name: "Base"},
					{ Name: "Shine", AllowColorize: false}
				]
			},
			{ Name: "DildocornHorn", Value: -1, DefaultColor: "Default", BuyGroup: "UnicornHorn", BodyCosplay: true, AllowActivity: ["PenetrateItem"], Top: -30,
				Layer: [
					{ Name: "Base"},
					{ Name: "Shine", AllowColorize: false}
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Gloves",
		ParentGroup: "BodyUpper",
		ParentColor: "Bra",
		Priority: 28,
		Default: false,
		Clothing: true,
		Underwear: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "AllFours", "OverTheHead"],
		PreviewZone: [125, 265, 250, 250],
		Asset: [
			// Breast Compatible Clothing
			{ Name: "Gloves1", HideForPose: ["BackElbowTouch"] },
			{ Name: "Gloves2", Gender: "F", Prerequisite: ["HasBreasts"], Alpha: [{ Group: ["BodyUpper"], Pose: ["OverTheHead"], Masks: [[90, 125, 30, 70], [370, 125, 30, 70]] }], HideForPose: ["BackElbowTouch"] },
			{ Name: "Gloves3", Gender: "F", Prerequisite: ["HasBreasts"], Value: 15, Left: 60, Top: 109, HideForPose: ["BackElbowTouch"] },
			{ Name: "MistressGloves", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: -1, HideForPose: ["BackElbowTouch"] },
			{ Name: "FingerlessGloves", Value: 20, HideForPose: ["BackElbowTouch"] },
			{
				Name: "GlovesFur", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, DefaultColor: ["#8c2331", "Default"], HideForPose: ["BackElbowTouch"],
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{ Name: "Catsuit", Hide: ["Hands"], Fetish: ["Nylon"], Value: -1, BuyGroup: "Catsuit", HideForPose: ["BackElbowTouch"] },
			{ Name: "SeethroughSuit", Fetish: ["Nylon"], Value: -1, BuyGroup: "SeethroughSuit", HideForPose: ["BackElbowTouch"] },
			{ Name: "CowPrintedGloves", Value: 15, Alpha: [{ Group: ["BodyUpper"], Pose: ["OverTheHead"],  Masks: [[90, 125, 30, 70], [370, 125, 30, 70]] }], HideForPose: ["BackElbowTouch"] },
			{ Name: "LatexElbowGloves", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 75, HideForPose: ["BackElbowTouch"] },
			{ Name: "FishnetGloves", Gender: "F", Prerequisite: ["HasBreasts"], Value: 10, DefaultColor: ["#151515"], HideForPose: ["BackElbowTouch"] },
			{
				Name: "HaremGlove", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Nylon"], Value: 25,
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Bands" }
				]
			},
			{
				Name: "BikerGloves", Gender: "F", Value: 15, ParentGroup: null, DefaultColor: ["#65696E", "#2A2A2A"], HideForPose: ["BackElbowTouch", "BackBoxTie", "TapedHands"],
				Layer: [
					{ Name: "Hands" },
					{ Name: "Straps" },
					{ Name: "Buckles", AllowColorize: false, HideForPose: ["AllFours", "BackCuffs", "OverTheHead", "Yoked"] },
				]
			},
			// Flat Chest Compatible Clothing
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "LeftHand",
		Priority: 28,
		Default: false,
		Clothing: true,
		Underwear: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "AllFours", "OverTheHead"],
		PreviewZone: [183, 360, 135, 135],
		Asset: [
			{
				/*
				To allow rings to have more diversity, they have been built as a modular item.
				If you wish to add more rings, add the corresponding layers to the left and right hand groups and
				also add the corresponding modules to the extended menu.
				*/
				Name: "Rings", Value: 0, DefaultColor: ["Default", "Default", "Default", "Default", "#A48537", "Default", "#707070", "#00D307"], HideForPose: ["BackElbowTouch", "TapedHands", "BackBoxTie"], Extended: true, AlwaysExtend: true,
				Layer: [
					//Thumb
					{ Name: "ThumbSteel", HasType: false, AllowModuleTypes: ["t1"] },
					//Index
					{ Name: "IndexSteel", HasType: false, AllowModuleTypes: ["i1"] },
					//Middle
					{ Name: "MiddleSteel", HasType: false, AllowModuleTypes: ["m1"] },
					//Ring
					{ Name: "RingSteel", HasType: false, AllowModuleTypes: ["r1"] },
					{ Name: "Wedding", HasType: false, AllowModuleTypes: ["r2"] },
					//Pinkie
					{ Name: "PinkieSteel", HasType: false, AllowModuleTypes: ["p1"] },
					{ Name: "HonorBase", HasType: false, AllowModuleTypes: ["p2"] },
					{ Name: "HonorJewels", HasType: false, AllowModuleTypes: ["p2"] },

				],
			},

		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "RightHand",
		Priority: 28,
		Default: false,
		Clothing: true,
		Underwear: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackElbowTouch", "Yoked", "AllFours", "OverTheHead"],
		PreviewZone: [183, 360, 135, 135],
		Asset: [
			{
				/*
				To allow rings to have more diversity, they have been built as a modular item.
				If you wish to add more rings, add the corresponding layers to the left and right hand groups and
				also add the corresponding modules to the extended menu.
				*/
				Name: "Rings", Value: 0, DefaultColor: ["Default", "Default", "Default", "Default", "#A48537", "Default", "#707070", "#00D307"], HideForPose: ["TapedHands", "BackBoxTie", "BackElbowTouch", "BackCuffs"], Extended: true, AlwaysExtend: true,
				Layer: [
					//Thumb
					{ Name: "ThumbSteel", HasType: false, AllowModuleTypes: ["t1"] },
					//Index
					{ Name: "IndexSteel", HasType: false, AllowModuleTypes: ["i1"] },
					//Middle
					{ Name: "MiddleSteel", HasType: false, AllowModuleTypes: ["m1"] },
					//Ring
					{ Name: "RingSteel", HasType: false, AllowModuleTypes: ["r1"] },
					{ Name: "Wedding", HasType: false, AllowModuleTypes: ["r2"]},
					//Pinkie
					{ Name: "PinkieSteel", HasType: false, AllowModuleTypes: ["p1"] },
					{ Name: "HonorBase", HasType: false, AllowModuleTypes: ["p2"] },
					{ Name: "HonorJewels", HasType: false, AllowModuleTypes: ["p2"] },

				],
			},

		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "Bracelet",
		ParentGroup: "BodyUpper",
		Priority: 46,
		Default: false,
		Clothing: true,
		AllowPose: ["Yoked", "OverTheHead", "BackCuffs", "BackBoxTie" ],
		PreviewZone: [125, 265, 250, 250],
		Asset: [
			// Breast Compatible Clothing
			{ Name: "BowBand", Value: 20, HideForPose: ["BackCuffs", "BackBoxTie"]},
			{ Name: "KinkBracelet", Value: 25, HideForPose: ["BackCuffs", "BackBoxTie"]},
			{ Name: "LesBand", Value: 30, HideForPose: ["BackCuffs", "BackBoxTie"]},
			{ Name: "SpikeBands", Value: 15, DefaultColor: ["#232323", "#666666"], HideForPose: ["BackBoxTie"], Extended: true, Layer: [
				{ Name: "Bands" },
				{ Name: "Spikes" },
			]
			},
			{ Name: "Band1", Value: 25, HideForPose: ["BackCuffs", "BackBoxTie"], Extended: true},
			{ Name: "LaceBands", Value: 20, Priority: 29, DefaultColor: ["Default", "#151515"], Layer: [
				{ Name: "Lace" },
				{ Name: "Bands" },
			]
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Glasses",
		Priority: 27,
		Default: false,
		Clothing: true,
		Underwear: true,
		Left: 180,
		Top: 125,
		PreviewZone: [140, 40, 220, 220],
		Asset: [
			"Glasses1", "Glasses2", "Glasses3", "Glasses4", "Glasses5", "Glasses6",
			{ Name: "SunGlasses1", Value: 15 },
			{ Name: "SunGlasses2", Value: 15 },
			{ Name: "SunGlassesClear", Value: 15 },
			{ Name: "EyePatch1", Value: 10, Priority: 29, Extended: true },
			{ Name: "CatGlasses", Value: 15, Priority: 53, Left: 182, Extended: true},
			{
				Name: "VGlasses", Value: 20, DefaultColor: ["#93861F", "#7F0202"],
				Layer: [
					{ Name: "Frame" },
					{ Name: "Glass" }
				]
			},
			{
				Name: "GradientSunglasses", Value: 20, DefaultColor: ["#303030", "#303030"], Extended: true,
				Layer: [
					{ Name: "Frame" },
					{ Name: "Glass" }
				],
			},
		],
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},

	{
		Group: "Mask",
		Priority: 53,
		Default: false,
		Clothing: true,
		Random: false,
		Underwear: true,
		Left: 180,
		Top: 125,
		PreviewZone: [140, 25, 220, 220],
		Asset: [
			{ Name: "VenetianMask", Priority: 49, Fetish: ["Lingerie"], HideItem: ["ItemNoseNoseRing"] },
			{ Name: "DominoMask", Priority: 49, Fetish: ["Lingerie"], HideItem: ["ItemNoseNoseRing"] },
			{ Name: "ButterflyMask", Fetish: ["Lingerie"], Priority: 49, Value: 30, HideItem: ["ItemNoseNoseRing"] },
			{ Name: "ShinobiMask", Fetish: ["Nylon"], Value: 30, Left: 199, Top: 88, Priority: 49, HideItem: ["ItemNoseNoseRing", "ItemMouthCaneGag", "ItemMouthCropGag"] },
			{
				Name: "FoxMask", Fetish: ["Pet"], Priority: 49, Value: 30, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing"], Layer: [
					{ Name: "Upper" },
					{ Name: "Lower" },
				]
			},
			{
				Name: "BunnyMask1", Fetish: ["Pet"], Value: 40, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HairAccessory1Ears1", "HairAccessory2Ears1", "HairAccessory1PonyEars1", "HairAccessory2PonyEars1", "HairAccessory1FoxEars1", "HairAccessory2FoxEars1", "HairAccessory1FoxEars3", "HairAccessory2FoxEars3", "HairAccessory1RaccoonEars1", "HairAccessory2RaccoonEars1", "HatVeil1", "HatVeil2", "HatCaptainHat1", "HatPoliceWomanHat"], Hide: ["Glasses"], Extended: true, HasType: false,
				Layer: [
					{ Name: "Base", HasType: false },
					{ Name: "Ears", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				],
			},
			{ Name: "BunnyMask2", Fetish: ["Pet"], Value: 40, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HairAccessory1Ears1", "HairAccessory2Ears1", "HairAccessory1PonyEars1", "HairAccessory2PonyEars1", "HairAccessory1FoxEars1", "HairAccessory2FoxEars1", "HairAccessory1FoxEars3", "HairAccessory2FoxEars3", "HairAccessory1RaccoonEars1", "HairAccessory2RaccoonEars1", "HatVeil1", "HatVeil2", "HatCaptainHat1", "HatPoliceWomanHat"], Hide: ["Glasses"] },
			{ Name: "BunnyMask3", Fetish: ["Pet"], Value: 40, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HairAccessory1Ears1", "HairAccessory2Ears1", "HairAccessory1PonyEars1", "HairAccessory2PonyEars1", "HairAccessory1FoxEars1", "HairAccessory2FoxEars1", "HairAccessory1FoxEars3", "HairAccessory2FoxEars3", "HairAccessory1RaccoonEars1", "HairAccessory2RaccoonEars1", "HatVeil1", "HatVeil2", "HatCaptainHat1", "HatPoliceWomanHat"], Hide: ["Glasses"] },
			{ Name: "KittyMask1", Fetish: ["Pet"], Value: 30, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{ Name: "KittyMask2", Fetish: ["Pet"], Value: 30, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{
				Name: "KittyMask3", Fetish: ["Pet"], Value: 25, Left: 140, Top: 50, Hide: ["HairFront", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3"], Layer: [
					{ Name: "Highlights" },
					{ Name: "Mask" },
				]
			},
			{ Name: "LaceMask1", Fetish: ["Lingerie"], Value: 25, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{ Name: "LaceMask2", Fetish: ["Lingerie"], Value: 25, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{ Name: "FuturisticVisor", Category: ["SciFi"], BuyGroup: "FuturisticVisor", Value: 35, Priority: 27, Random: false, HideItem: ["ItemNoseNoseRing"] },
			{ Name: "OpenFaceHood", Fetish: ["Latex"], Value: -1, Priority: 40, Left: 150, Top: 20, DefaultColor: "#404040", BuyGroup: "OpenFace", Hide: ["HairFront"] , Extended: true, HasType: false },
			{
				Name: "FaceVeil", Fetish: ["Lingerie"], Value: 20, Priority: 51, Left: 150, Top: 20, Layer: [
					{ Name: "Fabric" },
					{ Name: "String" },
				]
			},
			{ Name: "FacePaint", Value: 10, Left: 150, Top: 20, Priority: 7, BuyGroup: "FacePaint", DefaultColor: ["#9A7F76"], Hide: ["Head"] },
			{
				Name: "PetNose", Fetish: ["Pet"], Value: 50, Left: 185, Top: 167, Priority: 24, Extended: true, HasType: false,
				DefaultColor: ["#D19D55","#2F2E2E","#BEBEBE","#111111"],
				BodyCosplay: true, Layer: [
					{ Name: "CheeksNone", ColorGroup: "Cheeks", AllowModuleTypes: ["c0"], },
					{ Name: "CheeksSmall", CopyLayerColor: "CheeksNone", AllowModuleTypes: ["c1"], },
					{ Name: "CheeksBig", CopyLayerColor: "CheeksNone", AllowModuleTypes: ["c2"], },
					{ Name: "Nose", ColorGroup: "Nose", AllowModuleTypes: ["n0"], },
					{ Name: "NoseNone", CopyLayerColor: "Nose", AllowModuleTypes: ["n1"], },
					{ Name: "Gloss", ColorGroup: "Gloss", AllowModuleTypes: ["n0"], }, // Show only with nose
					{ Name: "WhiskersNone", ColorGroup: "Whiskers", AllowModuleTypes: ["w0"], },
					{ Name: "WhiskersShort", CopyLayerColor: "WhiskersNone", AllowModuleTypes: ["w1"], },
					{ Name: "WhiskersLong", CopyLayerColor: "WhiskersNone", AllowModuleTypes: ["w2"], },
				],
			}, //PetNose
			{
				Name: "Glitter", Value: 10, Priority: 8, BuyGroup: "Glitter", Left: 150, Top: 20, DefaultColor:["#DCA07C","#DCA07C"], Extended: true, BodyCosplay: true,
				Layer:[
					{Name: "Freckles", HasType: false, AllowTypes:[""]},
					{Name: "Freckles2", HasType: false, AllowTypes:[""]},
					{Name: "MidFreckles", HasType: false, AllowTypes:["MidFreckles"], CopyLayerColor: "Freckles"},
					{Name: "SplitFreckles", HasType: false, AllowTypes:["SplitFreckles"], CopyLayerColor: "Freckles"},
					{Name: "SplitFreckles2", HasType: false, AllowTypes:["SplitFreckles"], CopyLayerColor: "Freckles2"},
					{Name: "FrecklesSmall", HasType: false, AllowTypes:["FrecklesSmall"], CopyLayerColor: "Freckles"},
					{Name: "Freckles2Small", HasType: false, AllowTypes:["FrecklesSmall"], CopyLayerColor: "Freckles2"},
					{Name: "MidFrecklesSmall", HasType: false, AllowTypes:["MidFrecklesSmall"], CopyLayerColor: "Freckles"},
					{Name: "SplitFrecklesSmall", HasType: false, AllowTypes:["SplitFrecklesSmall"], CopyLayerColor: "Freckles"},
					{Name: "SplitFreckles2Small", HasType: false, AllowTypes:["SplitFrecklesSmall"], CopyLayerColor: "Freckles2"},
					{Name: "StarsLeft", HasType: false, AllowTypes:["StarsBoth", "StarsLeft"], CopyLayerColor: "Freckles2"},
					{Name: "StarsLeft2", HasType: false, AllowTypes:["StarsBoth", "StarsLeft"], CopyLayerColor: "Freckles"},
					{Name: "StarsRight", HasType: false, AllowTypes:["StarsBoth", "StarsRight"], CopyLayerColor: "Freckles2"},
					{Name: "StarsRight2", HasType: false, AllowTypes:["StarsBoth", "StarsRight"], CopyLayerColor: "Freckles"},
					{Name: "DotsLeft", HasType: false, AllowTypes:["DotsBoth", "DotsLeft"], CopyLayerColor: "Freckles"},
					{Name: "DotsLeft2", HasType: false, AllowTypes:["DotsBoth", "DotsLeft"], CopyLayerColor: "Freckles2"},
					{Name: "DotsRight", HasType: false, AllowTypes:["DotsBoth", "DotsRight"], CopyLayerColor: "Freckles"},
					{Name: "DotsRight2", HasType: false, AllowTypes:["DotsBoth", "DotsRight"], CopyLayerColor: "Freckles2"},
				]
			},
			{
				Name: "HeadHarness", Priority: 51, Value: 20, BuyGroup: "Headharness", Left: 150, Top: 22, DefaultColor: ["#383838"], Extended:true,
				Layer:[
					{Name: "BaseMetal", HasType: false, AllowTypes:["","Heavy"], AllowColorize: false},
					{Name: "Base", HasType: false, AllowTypes:["","Heavy"]},
					{Name: "HeavyMetal", HasType: false, AllowTypes:["Heavy"], AllowColorize: false},
					{Name: "Heavy", HasType: false, AllowTypes:["Heavy"], CopyLayerColor: "Base"},
				],
			}, //HeadHarness
		],
		Color: ["Default", "#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},

	{
		Group: "TailStraps",
		Priority: 4,
		Default: false,
		Clothing: true,
		Random: false,
		Underwear: true,
		BodyCosplay: true,
		Left: 0,
		Top: 150,
		PreviewZone: [0, 200, 500, 500],
		Asset: [
			{ Name: "TailStrap", Fetish: ["Pet"], Value: 30, Top: 180, Layer: [
				{ Name: "Tail"},
				{ Name: "Ribbon"},
				{ Name: "Bell"},
			] },
			{ Name: "HorseTailStrap", Fetish: ["Pony"], Value: 20, Top: 110, AllowPose: ["AllFours"] },
			{ Name: "HorseTailStrap1", Fetish: ["Pony"], Value: 30, Top: 110, AllowPose: ["AllFours"] },
			{ Name: "FoxTailsStrap", Fetish: ["Pet"], Priority: 2, Value: 50, Top: 120, Layer: [
				{ Name: "Tips"},
				{ Name: "Bases"}
			] },
			{ Name: "PuppyTailStrap", Fetish: ["Pet"], Value: 15, Top: 130, AllowPose: ["AllFours"] },
			{ Name: "SuccubusTailStrap", Fetish: ["Pet"], Value: 10, AllowPose: ["AllFours"] },
			{ Name: "SuccubusHeartTailStrap", Fetish: ["Pet"], Value: 15, Layer: [
				{ Name: "Heart"},
				{ Name: "Tail"}
			]},
			{ Name: "RaccoonStrap", Fetish: ["Pet"], Value: 25 },
			{ Name: "RaccoonTailStrap", Fetish: ["Pet"], Priority: 2, Value: 35 },
			{ Name: "PuppyTailStrap1", Fetish: ["Pet"], Value: 20, AllowPose: ["AllFours"] },
			{ Name: "KittenTailStrap1", Fetish: ["Pet"], Value: 20, Top: 100 },
			{ Name: "KittenTailStrap2", Fetish: ["Pet"], Value: 20, AllowPose: ["AllFours"] },
			{ Name: "FoxTailStrap1", Fetish: ["Pet"], Value: 20, Top: 170, Layer: [
				{ Name: "Tip"},
				{ Name: "Base"}
			] },
			{ Name: "FoxTailStrap2", Fetish: ["Pet"], Value: 20, Top: 200, Layer: [
				{ Name: "Tip"},
				{ Name: "Base"}
			]},
			{ Name: "WolfTailStrap1", Fetish: ["Pet"], Value: 20 },
			{ Name: "WolfTailStrap2", Fetish: ["Pet"], Value: 20, AllowPose: ["AllFours"] },
			{ Name: "WolfTailStrap3", Fetish: ["Pet"], Value: 20, Top: 140, AllowPose: ["AllFours"] },
			{ Name: "DemonPlug", Fetish: ["Pet"], Value: 30, AllowPose: ["AllFours"] },
			{ Name: "MouseTailStrap1", Fetish: ["Pet"], Value: 20, Top: 120 },
			{ Name: "MouseTailStrap2", Fetish: ["Pet"], Value: 20 },
			{ Name: "CowtailStrap", Fetish: ["Pet"], BuyGroup: "CowTails", Value: 20, AllowPose: ["AllFours"] },
			{ Name: "BunnyTailStrap", Fetish: ["Pet"], Value: 1, Visible: false, },
			{ Name: "DragonTailStrap1", Fetish: ["Pet"], Value: 20,
				Layer: [
					{ Name: "Primary" },
					{ Name: "Secondary" }
				]
			},
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Top: 0,
				DefaultColor: ["#c43ba4", "#b832b6", "#9221ba"],
				AllowActivity: ["PenetrateItem"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Sucker" },
					{ Name: "InnerShine", AllowColorize: false },
					{ Name: "Outer" },
					{ Name: "OuterShine", AllowColorize: false },
				],
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Wings",
		Priority: 3,
		Default: false,
		Random: false,
		Clothing: true,
		Underwear: true,
		BodyCosplay: true,
		PreviewZone: [0, 50, 500, 500],
		Asset: [
			{ Name: "SuccubusFeather", Value: 35 },
			{ Name: "SuccubusWings", Value: 35 },
			{ Name: "AngelFeather", Value: 50 },
			{ Name: "DevilWings", Value: 25 },
			{ Name: "FallenAngelWings", Value: 50 },
			{ Name: "AngelWings", Value: 50 },
			{ Name: "BatWings", Value: 20 },
			{ Name: "FairyWings", Value: 50, Gender: "F", Prerequisite: ["HasBreasts", "HasVagina"]},
			{
				Name: "SteampunkWings", Value: 90, DefaultColor: ["#707070", "#707070", "#2F2DCC", "#707070"], HasType: false, Extended: true, DynamicBeforeDraw: true, DynamicScriptDraw: true, Layer: [
					{ Name: "Base" },
					{ Name: "Gears" },
					{ Name: "Wings" },
					{ Name: "WingFrames" }
				]
			},
			{
				Name: "BeeWings", Value: 50, DefaultColor: ["#4896c3", "#ccd44f"],
				Layer: [
					{ Name: "Wings" },
					{ Name: "Veins", AllowColorize: false },
					{ Name: "Bone" },
				],
			},
			{
				Name: "CyberWings", Value: 60, DefaultColor: ["#2ab4c5", "#b21fd8", "#25dce6"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Shade" },
					{ Name: "Highlights" },
				],
			},
			{
				Name: "PixieWings", Value: 50, DefaultColor: ["#0e70b4", "#086cb2"],
				Layer: [
					{ Name: "Wings" },
					{ Name: "Veins" },
				],
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Height",
		AllowNone: false,
		AllowColorize: false,
		Asset: [
			{ Name: "H0950", Visible: false, Zoom: 0.950 },
			{ Name: "H0960", Visible: false, Zoom: 0.960 },
			{ Name: "H0970", Visible: false, Zoom: 0.970 },
			{ Name: "H0980", Visible: false, Zoom: 0.980 },
			{ Name: "H0990", Visible: false, Zoom: 0.990 },
			{ Name: "H1000", Visible: false, Zoom: 1.000 },
			{ Name: "H0900", Visible: false, Zoom: 0.900 },
			{ Name: "H0910", Visible: false, Zoom: 0.910 },
			{ Name: "H0920", Visible: false, Zoom: 0.920 },
			{ Name: "H0930", Visible: false, Zoom: 0.930 },
			{ Name: "H0940", Visible: false, Zoom: 0.940 }
		]
	},

	{
		Group: "BodyUpper",
		Priority: 7,
		AllowNone: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead"],
		PreviewZone: [0, 150, 500, 500],
		Asset: [
			{
				Name: "Small",
				Extended: true,
				Gender: "F",
				Layer: [
					{ Name: "", ParentGroup: null, HasType: false },
				],
			},
			{
				Name: "Normal",
				Extended: true,
				Gender: "F",
				Layer: [
					{ Name: "", ParentGroup: null, HasType: false },
				],
			},
			{
				Name: "Large",
				Extended: true,
				Gender: "F",
				Layer: [
					{ Name: "", ParentGroup: null, HasType: false },
				],
			},
			{
				Name: "XLarge",
				Extended: true,
				Gender: "F",
				Layer: [
					{ Name: "", ParentGroup: null, HasType: false },
				],
			},
			{
				Name: "FlatSmall",
				Extended: true,
				Random: false,
				Gender: "M",
				Layer: [
					{ Name: "", ParentGroup: null, HasType: false },
				],
			},
			{
				Name: "FlatMedium",
				Extended: true,
				Random: false,
				Gender: "M",
				Layer: [
					{ Name: "", ParentGroup: null, HasType: false },
				],
			}
		],
		Color: ["White", "Asian", "Black"],
		ColorSuffix: { "HEX_COLOR": "White" },
	},

	{
		Group: "BodyLower",
		ParentSize: "BodyUpper",
		ParentColor: "BodyUpper",
		Priority: 9,
		Top: 462,
		AllowNone: false,
		AllowPose: ["LegsClosed", "Kneel", "KneelingSpread", "Spread"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
		Color: ["Default", "White", "Asian", "Black"],
		ColorSuffix: { "HEX_COLOR": "White" },
		InheritColor: "BodyUpper"

	},

	{
		Group: "HairFront",
		Priority: 52,
		Left: 150,
		Top: 50,
		AllowNone: false,
		PreviewZone: [140, 40, 220, 220],
		Asset: ["HairFront1", "HairFront1b", "HairFront2", "HairFront2b", "HairFront3", "HairFront3b", "HairFront4",
			"HairFront4b", "HairFront5", "HairFront5b", "HairFront6", "HairFront6b", "HairFront7", "HairFront7b",
			"HairFront8", "HairFront8b", "HairFront9", "HairFront9b", "HairFront10", "HairFront10b", "HairFront11",
			"HairFront11b", "HairFront12", "HairFront12b", "HairFront13", "HairFront13b", "HairFront14", "HairFront14b",
			"HairFront15", "HairFront16", "HairFront17", "HairFront17b", "HairFront18", "HairFront19", "HairFront20",
			"HairFront21",
			{ Name: "HairFront22", Top: 6, Left: 134,
				Layer: [
					{ Name: "Base", Priority: 51 },
					{ Name: "Fluff" },
					{ Name: "Tip" },
					{ Name: "FrontFluff", Priority: 54, CopyLayerColor: "Fluff" }
				],
			}, //HairFront22
			{ Name: "HairFront22b", Top: 6, Left: 134,
				Layer: [
					{ Name: "Base",Priority: 51 },
					{ Name: "Fluff" },
					{ Name: "Tip" },
					{ Name: "FrontFluff", Priority: 54, CopyLayerColor: "Fluff"},
					{ Name: "FrontTip", Priority: 54.5, CopyLayerColor: "Tip" },
				],
			}, //HairFront22b
			{ Name: "HairFront23", Top: 6, Left: 134,
				Layer: [
					{ Name: "Base",Priority: 51 },
					{ Name: "Fluff" },
					{ Name: "Tip" },
					{ Name: "FrontFluff", Priority: 54, CopyLayerColor: "Fluff" },
				],
			}, //HairFront23
			{ Name: "HairFront23b", Top: 6, Left: 134,
				Layer: [
					{ Name: "Base", Priority: 51 },
					{ Name: "Fluff" },
					{ Name: "Tip" },
					{ Name: "FrontFluff", Priority: 54, CopyLayerColor: "Fluff" },
					{ Name: "FrontTip", Priority: 54.5, CopyLayerColor: "Tip" },
				],
			}, //HairFront23b
			{ Name: "HairFront24" },
			{ Name: "HairFront25" },
			{ Name: "HairFront26" },
			{ Name: "HairFront27", AllowPose: ["Suspension"],
			Layer: [
				{ Name: "Base" },
				{ Name: "Bangs", Priority: 54, CopyLayerColor: "Base" },
				{ Name: "BangsTip", Priority: 54},
			],
			Top: -200, Left: 0 },
			{ Name: "HairFront28",
				Layer: [
					{ Name: "Base" },
					{ Name: "Bangs" },
					{ Name: "Tips", Priority: 54 },
				],
			}, //HairFront28
			{ Name: "HairFront29",
				Layer: [
					{ Name: "Left", Priority: 53 },
					{ Name: "Right" },
				],
			},//HairFront29
			{ Name: "HairFront30" },
			{ Name: "HairFront31" },
			{ Name: "HairFront32" },
			{ Name: "HairFront33", Random: false, Top: 33, Attribute: ["ShortHair"], Left: 150 },
			{ Name: "HairFront34", Random: false, Priority: 8, Attribute: ["ShortHair"], Top: 33, Left: 150 },
			{ Name: "HairFront35", Random: false, Priority: 8, Attribute: ["ShortHair"], Top: 33, Left: 150 },
			{ Name: "HairFront36", Random: false, Priority: 8, Attribute: ["ShortHair"], Top: 33, Left: 150 },
			{ Name: "HairFront37", Layer: [
					{ Name: "Base" },
					{ Name: "Front", Priority: 55 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront37
			{ Name: "HairFront38",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront38
			{ Name: "HairFront39", Random: false, Attribute: ["ShortHair"], Top: 33, Left: 100 },
			{ Name: "HairFront40",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 100
			},//HairFront40
			{ Name: "HairFront41", Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150 },
			{ Name: "HairFront42",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront42
			{ Name: "HairFront43",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront43
			{ Name: "HairFront44",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront44
			{ Name: "HairFront45",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
					{ Name: "Tint", Priority: 54 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront45
			{ Name: "HairFront46",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront46
			{ Name: "HairFront47",
			Layer: [
					{ Name: "Main" },
					{ Name: "Fade", Priority: 8 },
				], Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150
			},//HairFront47
			{ Name: "HairFront48", Priority: 8, Random: false, Attribute: ["ShortHair"], Top: 33, Left: 150 },
		],
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"]
	},

	{
		Group: "FacialHair",
		Priority: 34,
		Default: false,
		ParentColor: "HairFront",
		Left: 150,
		Top: 35,
		Asset: [
			{ Name: "Goatee", Random: false,},
			{ Name: "BigBeard", Random: false, },
			{ Name: "MediumBeard", Random: false, },
			{ Name: "Moustache", Random: false, },
			{ Name: "MoustacheBeard", Random: false,  },
			{ Name: "ChinstrapBeard", Random: false,  },
		],
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"]
	},

	{
		Group: "HairBack",
		ParentColor: "HairFront",
		Priority: 5,
		Left: 50,
		Top: 0,
		AllowNone: false,
		PreviewZone: [55, 0, 390, 390],
		Asset: [
			{ Name: "HairNone", Visible: false },
			{ Name: "HairBack1", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack1b" },
			{ Name: "HairBack2", AllowPose: ["Suspension"] },
			{ Name: "HairBack2b" },
			{ Name: "HairBack4", AllowPose: ["Hogtied"], HideForPose: ["Suspension", "AllFours"] },
			{ Name: "HairBack4b" },
			{ Name: "HairBack10", AllowPose: ["Suspension"] },
			{ Name: "HairBack10b" },
			{ Name: "HairBack14", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack15", AllowPose: ["Suspension"] },
			{ Name: "HairBack15b" },
			{ Name: "HairBack16", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack17", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack18", HideForPose: ["Hogtied"] },
			{ Name: "HairBack18b" },
			{ Name: "HairBack19", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack19b" },
			{ Name: "HairBack20", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack20b" },
			{ Name: "HairBack5", AllowPose: ["Suspension"] },
			{ Name: "HairBack5b" },
			{ Name: "HairBack8", AllowPose: ["Suspension", "AllFours"], HideForPose: ["Hogtied"] },
			{ Name: "HairBack11", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack6" },
			{ Name: "HairBack6b" },
			{ Name: "HairBack21", HideForPose: ["Suspension"] },
			{ Name: "HairBack22", HideForPose: ["Suspension"] },
			{ Name: "HairBack23", AllowPose: ["Suspension", "AllFours"], Priority: 48 },
			{ Name: "HairBack24", AllowPose: ["Suspension", "AllFours"], Priority: 48 },
			{ Name: "HairBack25", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack26", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack27", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack28", AllowPose: ["Hogtied"] },
			{ Name: "HairBack29", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack30", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack31", AllowPose: ["Suspension"] },
			{ Name: "HairBack32", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack33", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack34", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack35", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack36", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack37", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack38", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack39", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack40", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack41", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack42", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack43", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack44", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack45", AllowPose: ["Suspension", "Hogtied"] },
			{ Name: "HairBack46" },
			{ Name: "HairBack47" },
			{ Name: "HairBack48", AllowPose: ["Hogtied"] },
			{ Name: "HairBack49" },
			{ Name: "HairBack50", AllowPose: ["Suspension", "Hogtied", "AllFours"] },
			{ Name: "HairBack51" },
			{ Name: "HairBack52" },
			{
				Name: "HairBack53",
				Layer:[
					{ Name: "Base" },
					{ Name: "Tip"  },
				],
				Top: -5, Left: 0
			},
			{
				Name: "HairBack54", AllowPose: ["Suspension"],
				Layer: [
					{ Name: "Left" },
					{ Name: "Right" },
				]
			},
			{ Name: "HairBack55" },
			{ Name: "HairBack56", Left: 50 }
		],
		Color: ["Default", "#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		InheritColor: "HairFront"
	},

	{
		Group: "Eyebrows",
		Priority: 9,
		Left: 200,
		Top: 120,
		AllowNone: false,
		InheritColor: "HairFront",
		AllowExpression: ["Raised", "Lowered", "OneRaised", "Harsh", "Angry", "Soft"],
		Asset: ["Eyebrows1", "Eyebrows2", "Eyebrows3", "Eyebrows4","Eyebrows5","Eyebrows6","Eyebrows7","Eyebrows8",]
	},

	{
		Group: "Eyes",
		Priority: 9,
		Left: 200,
		Top: 145,
		Blink: true,
		FullAlpha: false,
		AllowNone: false,
		AllowExpression: ["Closed", "Dazed", "Shy", "Sad", "Horny", "Lewd", "VeryLewd", "Heart", "HeartPink", "LewdHeart", "LewdHeartPink", "Dizzy", "Daydream", "ShylyHappy", "Angry", "Surprised", "Scared"],
		MirrorGroup: "Eyes2",
		PreviewZone: [190, 100, 120, 120],
		Asset: ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11", "Eyes12", "Eyes13"],
		Color: ["Default", "#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"]
	},

	{
		Group: "Eyes2",
		Priority: 9,
		Left: 250,
		Top: 145,
		Blink: true,
		FullAlpha: false,
		AllowNone: false,
		AllowExpression: ["Closed", "Dazed", "Shy", "Sad", "Horny", "Lewd", "VeryLewd", "Heart", "HeartPink", "LewdHeart", "LewdHeartPink", "Dizzy", "Daydream", "ShylyHappy", "Angry", "Surprised", "Scared"],
		MirrorGroup: "Eyes",
		PreviewZone: [190, 100, 120, 120],
		Asset: [{ Name: "Eyes1", ParentItem: "Eyes1" }, { Name: "Eyes2", ParentItem: "Eyes2" }, { Name: "Eyes3", ParentItem: "Eyes3" }, { Name: "Eyes4", ParentItem: "Eyes4" }, { Name: "Eyes5", ParentItem: "Eyes5" }, { Name: "Eyes6", ParentItem: "Eyes6" }, { Name: "Eyes7", ParentItem: "Eyes7" }, { Name: "Eyes8", ParentItem: "Eyes8" }, { Name: "Eyes9", ParentItem: "Eyes9" }, { Name: "Eyes10", ParentItem: "Eyes10" }, { Name: "Eyes11", ParentItem: "Eyes11" }, { Name: "Eyes12", ParentItem: "Eyes12" }, { Name: "Eyes13", ParentItem: "Eyes13" }],
		Color: ["Default", "#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"]
	},

	{
		Group: "Mouth",
		Priority: 10,
		Left: 235,
		Top: 180,
		AllowNone: false,
		AllowExpression: ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy", "Devious", "Laughing", "Grin", "Smirk", "Pout"],
		PreviewZone: [190, 100, 120, 120],
		Asset: [
			{
				Name: "Regular",
				Layer: [
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Inner", AllowColorize: false }
				]
			},
			{ Name: "Discreet" },
			{
				Name: "Full",
				Layer: [
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Inner", AllowColorize: false }
				]
			}
		],
		Color: ["Default", "#803d26", "#aa5555", "#cc3333", "#55aa55", "#5555aa", "#55aaaa", "#aa55aa", "#aaaa55"],
	},

	{
		Group: "Nipples",
		ParentGroup: "BodyUpper",
		Priority: 11,
		Left: 175,
		Top: 285,
		AllowNone: false,
		Asset: [
		{ Name: "Nipples1"  },
		{ Name: "Nipples2", Prerequisite: ["HasBreasts"] },
		{ Name: "Nipples3", Prerequisite: ["HasBreasts"] },
	],
		Color: ["Default", "#a6665b", "#803d26", "#d68777", "#9b4a2e", "#bb6655"],
		ColorSuffix: { "White": "Default", "Asian": "Default", "Black": "Default" },
		InheritColor: "BodyUpper",
	},

	{
		Group: "Pussy",
		Priority: 12,
		Left: 225,
		Top: 500,
		AllowNone: false,
		AllowExpression: ["Hard"],
		ExpressionPrerequisite: ["HasPenis"],
		Asset: [
			{ Name: "PussyLight1", Gender: "F" },
			{ Name: "PussyLight2", Gender: "F" },
			{ Name: "PussyLight3", Gender: "F" },
			{ Name: "PussyDark1", Gender: "F" },
			{ Name: "PussyDark2", Gender: "F" },
			{ Name: "PussyDark3", Gender: "F" },
			{ Name: "Penis", Random: false, Left: 200, Top: 410, Gender: "M", InheritColor: "BodyUpper", AllowActivity: ["PenetrateItem"]}
		],
		Color: ["Default", "#6a3628", "#443330", "#222222"],
		ColorSuffix: { "White": "Default", "Asian": "Default", "Black": "Default" },
		InheritColor: "BodyUpper",
	},

	{
		Group: "Pronouns",
		AllowNone: false,
		Asset: [
			{ Name: "SheHer", Visible: false, Random: false, Gender: "F" },
			{ Name: "HeHim", Visible: false, Random: false, Gender: "M" }
		]
	},

	// Facial Expression specific
	{
		Group: "Blush",
		Priority: 8,
		Left: 190,
		Top: 100,
		AllowNone: false,
		AllowColorize: true,
		AllowCustomize: false,
		AllowExpression: ["Low", "Medium", "High", "VeryHigh", "Extreme", "ShortBreath"],
		Asset: ["Blush"]
	},

	{
		Group: "Fluids",
		Priority: 12,
		Left: 200,
		Top: 145,
		AllowNone: false,
		AllowColorize: true,
		AllowCustomize: false,
		AllowExpression: ["DroolLow", "DroolMedium", "DroolHigh", "DroolSides", "DroolMessy", "DroolTearsLow", "DroolTearsMedium", "DroolTearsHigh", "DroolTearsMessy", "DroolTearsSides", "TearsHigh", "TearsMedium", "TearsLow"],
		Asset: ["Fluids"]
	},

	{
		Group: "Emoticon",
		Priority: 60,
		Left: 250,
		Top: 0,
		AllowNone: false,
		AllowColorize: true,
		AllowCustomize: false,
		AllowExpression: ["Afk", "Whisper", "Sleep", "Hearts", "Tear", "Hearing", "Confusion", "Exclamation", "Annoyed", "Read", "RaisedHand", "Spectator", "ThumbsDown", "ThumbsUp", "LoveRope", "LoveGag", "LoveLock", "Wardrobe", "Gaming"],
		Asset: ["Emoticon"],
	},
	// Uncolorable body parts


	{
		Group: "Hands",
		ParentColor: "BodyUpper",
		Priority: 27,
		AllowNone: false,
		AllowCustomize: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "AllFours"],
		Asset: [{ Name: "Default", HideForPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"] }],
		ColorSuffix: { "HEX_COLOR": "White" },
		InheritColor: "BodyUpper",
		Color: ["Default"],
	},

	{
		Group: "Head",
		ParentColor: "BodyUpper",
		Priority: 7,
		AllowNone: false,
		AllowCustomize: false,
		Asset: ["Default"],
		ColorSuffix: { "HEX_COLOR": "White" },
		InheritColor: "BodyUpper"
	},

	// Item specific
	{
		Group: "ItemFeet",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 27,
		Default: false,
		IsRestraint: true,
		Left: 125,
		Top: 725,
		Effect: ["Freeze", "Prone"],
		FreezeActivePose: ["BodyLower"],
		Zone: [[100, 750, 300, 120]],
		Asset: [
			{ Name: "NylonRope", Fetish: ["Rope", "Nylon"], Value: 30, Time: 15, BuyGroup: "NylonRope", SetPose: ["LegsClosed"], Audio: "RopeShort", Extended: true, AllowActivePose: ["Kneel"], DynamicBeforeDraw: true,
				DefaultColor: ["#CCCCCC","#CCCCCC", "#CCCCCC"],
				Layer: [
					{ Name: "UpperRope", HasType: false, AllowTypes: ["Knees", "AnklesKnees"] },
					{ Name: "LowerRope", HasType: false, AllowTypes: ["", "AnklesKnees"] },
					{ Name: "BedSpreadEagleRope", HasType: false, AllowTypes: ["BedSpreadEagle"] },
					{ Name: "UpperShine", AllowColorize: false, HasType: false, AllowTypes: ["Knees", "AnklesKnees"] },
					{ Name: "LowerShine", AllowColorize: false, HasType: false, AllowTypes: ["", "AnklesKnees"] },
					{ Name: "BedSpreadEagleShine", AllowColorize: false, HasType: false, AllowTypes: ["BedSpreadEagle"] },
				]
			},
			{ Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", HideItem: ["ItemMiscTeddyBear", "ItemDevicesLittleMonster", "ItemDevicesFamiliar"], SetPose: ["LegsClosed"], Audio: "RopeShort", Extended: true, AllowActivePose: ["Kneel"], DynamicBeforeDraw: true },
			{ Name: "LeatherBelt", Fetish: ["Leather"], Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"] },
			{ Name: "SturdyLeatherBelts", Fetish: ["Leather"], Value: 50, Time: 10, RemoveTime: 5, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["LegsClosed"], Extended: true, AllowActivePose: ["Kneel"], Audio: "Buckle",
				DefaultColor: ["#11161B", "#403E40", "#11161B", "#403E40", "#11161B", "#403E40"],
				Layer: [
					{ Name: "LowerBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["", "Two", "Three"] },
					{ Name: "LowerMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["", "Two", "Three"] },
					{ Name: "UpperBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["Two", "Three"] },
					{ Name: "UpperMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["Two", "Three"] },
					{ Name: "FeetBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["Three"] },
					{ Name: "FeetMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["Three"] },
				],
			},
			{ Name: "Irish8Cuffs", Fetish: ["Metal"], Value: 25, Difficulty: 5, Time: 10, RemoveTime: 5, AllowLock: true, Audio: "CuffsMetal", SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"] },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTapeRoll", HideItem: ["ItemBootsThighHighLatexHeels", "ItemBootsHighThighBoots"], SetPose: ["LegsClosed"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "LeatherAnkleCuffs", Fetish: ["Leather"], Priority: 24, Value: 30, Difficulty: 2, Time: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed", "Spread", "KneelingSpread"], Effect: ["CuffedFeet"], Extended: true, AllowActivePose: ["Kneel", "KneelingSpread"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				DefaultColor: ["Default", "#2E2E2E", "Default"],
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Cuffs" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "FloorShackles", Fetish: ["Metal"], Priority: 24, Left: 0, Value: 20, Difficulty: 6, Time: 10, AllowLock: true, Prerequisite: ["NoItemLegs", "LegsOpen"], SetPose: ["Spread"], Effect: ["Freeze", "Prone", "BlockKneel"], Block: ["ItemLegs", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemLegs", "ItemBoots"],
				Layer: [
					{ Name: "Chain", Priority: 6 },
					{ Name: "Cuffs" }
				]
			},
			{ Name: "SteelAnkleCuffs", Fetish: ["Metal"], Priority: 24, Value: 30, Difficulty: 6, Time: 10, Random: false, AllowLock: true, DrawLocks: false, AllowPose: ["LegsClosed", "Spread"], HideForPose: ["Kneel"], Effect: ["CuffedFeet"], Extended: true, AllowActivePose: ["Kneel"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Cuffs" }
				]
			},
			{ Name: "FuturisticAnkleCuffs", Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["Default", "#40812C", "#707070"], Audio: "FuturisticApply", Priority: 24, Value: 45, Difficulty: 4, Time: 10, Random: false, AllowLock: true, DrawLocks: false,
				AllowPose: ["LegsClosed", "Spread"], FuturisticRecolor: true, Effect: [ "CuffedFeet"], Extended: true, AllowActivePose: ["Kneel"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Display", ParentGroup: null},
					{ Name: "Cuffs" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "OrnateAnkleCuffs", Fetish: ["Metal"], Priority: 24, Value: 90, Difficulty: 3, Time: 10, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["LegsClosed", "Spread"], Effect: ["CuffedFeet"], Extended: true, AllowActivePose: ["Kneel"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Cuffs" },
					{ Name: "Gems" },
				]
			},
			{ Name: "SpreaderMetal", Fetish: ["Metal"], Value: 50, Difficulty: 3, Time: 10, Random: false, AllowLock: true, Prerequisite: ["NotKneeling", "LegsOpen"], Block: ["ItemLegs"], AllowActivityOn: ["ItemLegs"], Extended: true, RemoveAtLogin: true, SetPose: ["LegsOpen"] },
			{ Name: "BallChain", Fetish: ["Metal"], Value: 40, Difficulty: 5, Time: 10, RemoveTime: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: ["Slow"], FreezeActivePose: [] },
			{ Name: "AnkleShackles", Fetish: ["Metal"], Value: 30, Difficulty: 6, Time: 10, RemoveTime: 5, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["LegsClosed"], Effect: ["Prone","Slow"], FreezeActivePose: [] },
			{ Name: "PlasticWrap", Value: 100, Difficulty: 7, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", SetPose: ["LegsClosed"]},
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", SetPose: ["LegsClosed"], Audio: "ZipTie", Extended: true, AllowActivePose: ["LegsClosed", "Kneel"], FreezeActivePose: [] },
			{ Name: "Chains", Fetish: ["Metal"], Value: 90, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "Chains", Audio: "ChainLong", SetPose: ["LegsClosed"], Extended: true, AllowActivePose: ["Kneel"] },
			{
				Name: "SpreaderDildoBar", Fetish: ["Metal", "Leather"], Gender: "F", Priority: 25, Value: 60, Difficulty: 5, Time: 10, Random: false, AllowLock: true, Top: 400, Prerequisite: ["AccessVulva", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste", "VulvaEmpty", "HasVagina"], SetPose: ["LegsOpen"], Effect: ["FillVulva", "Freeze", "Prone", "BlockKneel"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva"], AllowActivityOn: ["ItemPelvis", "ItemLegs"],
				Layer: [
					{ Name: "DildoBar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				], RemoveAtLogin: true
			},
			{
				Name: "SpreaderVibratingDildoBar", Fetish: ["Metal", "Leather"], Gender: "F", Priority: 25, Value: 70, Difficulty: 5, Time: 10, Random: false, AllowLock: true, Top: 400, Prerequisite: ["AccessVulva", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste", "VulvaEmpty", "HasVagina"], SetPose: ["LegsOpen"], Effect: ["FillVulva", "Egged", "Freeze", "Prone", "BlockKneel"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva"], AllowActivityOn: ["ItemPelvis", "ItemLegs"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "DildoBar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				], RemoveAtLogin: true, ArousalZone: "ItemVulva"
			},
			{
				Name: "WoodenCuffs", Priority: 24, Value: 30, Difficulty: 2, Time: 5, Random: false, Left: 74, AllowLock: true, Audio: "WoodenCuffs", BuyGroup: "WoodenCuffs", Prerequisite: ["LegsOpen", "NotKneeling"], AllowPose: ["Spread", "LegsClosed"], Effect: ["Freeze", "Prone"], Block: ["ItemLegs"], AllowActivityOn: ["ItemLegs"], RemoveAtLogin: false, Extended: true, HasType: false
			},
			{
				Name: "MedicalBedRestraints", Value: -1, Difficulty: 5, Time: 5, Random: false, RemoveTime: 5, DefaultColor: "#ccc", AllowLock: true, BuyGroup: "MedicalBedRestraints", Left: 0, Top: 0,
				Prerequisite: ["OnBed", "LegsOpen"], SetPose: ["LegsOpen"], Effect: ["Prone", "BlockKneel"], Block: ["ItemDevices"], AvailableLocations: ["Asylum"],
				HideItem: ["ClothLowerGown2Skirt", "ClothLowerPajama1"],
				Layer: [
					{ Name: "Base", Priority: 1, ParentGroup: null },
					{ Name: "Straps"}
				],
			},
			{
				Name: "SuspensionCuffs", Fetish: ["Leather"], Value: 70, Difficulty: 10, SelfBondage: 3, Time: 30, AllowLock: true, Random: false, SetPose: ["LegsOpen", "Suspension"], Effect: ["Block", "Prone", "Freeze"], Block: ["ItemLegs", "ItemBoots"], Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied", "LegsOpen"], Hide: ["Shoes"], OverrideHeight: { Height: -100, Priority: 41 },
			},
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Difficulty: 6, Time: 15, RemoveTime: 15, Top: 465, Left: 0, Extended: true,
				AllowPose: ["Spread"],
				SetPose: ["LegsClosed"],
				HideItem: ["ShoesBoots1", "ShoesFlippers", "ShoesFuzzyBoots", "ShoesThighHighLatexHeels", "ShoesWoollyBootsTall", "ItemBootsHighThighBoots", "ItemBootsThighHighLatexHeels", "ClothLowerPajama1"],
				DefaultColor: ["#c43ba4", "#b832b6", "#9221ba"],
				Layer: [
					{ Name: "Inner", HasType: false },
					{ Name: "Sucker", AllowTypes: [""] },
					{ Name: "SuckerSpread", CopyLayerColor: "Sucker", AllowTypes: ["Spread"], ParentGroup: null, HasType: false },
					{ Name: "Outer", HasType: false },
					{ Name: "Shine", AllowColorize: false, AllowTypes: [""] },
					{ Name: "ShineSpread", AllowColorize: false, AllowTypes: ["Spread"], ParentGroup: null, HasType: false },
				],
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e", "#57ab5e"], Random: false, Value: 200, Difficulty: 5, Time: 25, RemoveTime: 40, Top: 650, ParentGroup: null, Prerequisite: ["CanCloseLegs"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], Effect: ["Freeze"],
				HideForPose: ["Kneel", "Spread", "KneelingSpread"],
				Layer: [
					{ Name: "One" },
					{ Name: "Two" },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemLegs",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 25,
		Default: false,
		IsRestraint: true,
		Left: 125,
		Top: 400,
		AllowPose: ["Kneel"],
		Effect: ["Prone", "KneelFreeze", "Slow"],
		FreezeActivePose: ["BodyLower"],
		Zone: [[100, 580, 300, 170]],
		Asset: [
			{ Name: "NylonRope", Fetish: ["Rope", "Nylon"], Value: 30, Time: 10, BuyGroup: "NylonRope", Audio: "RopeShort", SetPose: ["LegsClosed"], AllowPose: ["Kneel", "KneelingSpread"], AllowActivePose: ["Kneel", "LegsClosed"], FreezeActivePose: [], Extended: true,
				DefaultColor: ["#CCCCCC","#CCCCCC", "#CCCCCC"],
				Layer: [
					{ Name: "UpperRope", HasType: false, AllowTypes: ["Thighs", "KneesThighs"] },
					{ Name: "LowerRope", HasType: false, AllowTypes: ["", "KneesThighs"] },
					{ Name: "FrogtieRope", HasType: false, AllowTypes: ["Frogtie"] },
					{ Name: "UpperShine", AllowColorize: false, HasType: false, AllowTypes: ["Thighs", "KneesThighs"] },
					{ Name: "LowerShine", AllowColorize: false, HasType: false, AllowTypes: ["", "KneesThighs"] },
					{ Name: "FrogtieShine", AllowColorize: false, HasType: false, AllowTypes: ["Frogtie"] },
				]
			},
			{ Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 10, RemoveTime: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", SetPose: ["LegsClosed"], Extended: true, Audio: "RopeShort", AllowPose: ["Kneel", "KneelingSpread"], AllowActivePose: ["Kneel", "LegsClosed"], FreezeActivePose: [] },
			{ Name: "LeatherBelt", Fetish: ["Leather"], Value: 25, Difficulty: 2, Time: 5, AllowLock: true, SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], Prerequisite: ["CanCloseLegs"] },
			{ Name: "SturdyLeatherBelts", Fetish: ["Leather"], Value: 50, Time: 5, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["LegsClosed"], Extended: true, AllowActivePose: ["Kneel"], Prerequisite: ["CanCloseLegs"], Audio: "Buckle",
				DefaultColor: ["#11161B", "#403E40", "#11161B", "#403E40"],
				Layer: [
					{ Name: "LowerBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["", "Two"] },
					{ Name: "LowerMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["", "Two"] },
					{ Name: "UpperBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["Two"] },
					{ Name: "UpperMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["Two"] },
				], },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTapeRoll", HideItem: ["ItemBootsThighHighLatexHeels", "ShoesThighHighLatexHeels", "ItemBootsHighThighBoots"], SetPose: ["LegsClosed"], Extended: true, AllowActivePose: ["Kneel"], Prerequisite: ["CanCloseLegs"] },
			{ Name: "LeatherLegCuffs", Fetish: ["Leather"], Priority: 24, Value: 45, Difficulty: 3, Time: 10, Random: false, AllowLock: true, AllowPose: ["Kneel", "LegsClosed", "KneelingSpread"], Effect: ["CuffedLegs"], Extended: true, AllowActivePose: ["Kneel", "KneelingSpread"], FreezeActivePose: [], HasType: false,
				DefaultColor: ["Default", "#2E2E2E", "Default"],
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Cuffs" },
					{ Name: "Rings" },
				]
			},
			{ Name: "FuturisticLegCuffs",  Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["Default", "#40812C", "#707070"], Audio: "FuturisticApply", Priority: 24, Value: 30, Difficulty: 3, Time: 10, Random: false, AllowLock: true, DrawLocks: false,
				AllowPose: ["Kneel", "LegsClosed", "KneelingSpread"], FuturisticRecolor: true, Effect: ["CuffedLegs"], Extended: true, AllowActivePose: ["Kneel", "KneelingSpread"], FreezeActivePose: [], HasType: false, HideForPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Display", ParentGroup: null},
					{ Name: "Cuffs" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null},
				]
			},
			{
				Name: "OrnateLegCuffs", Fetish: ["Metal"], Priority: 24, Value: 90, Difficulty: 3, Time: 10, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["Kneel", "LegsClosed", "KneelingSpread"], Effect: ["CuffedLegs"], Extended: true, AllowActivePose: ["Kneel", "KneelingSpread"], FreezeActivePose: [], HasType: false,
				Layer: [
					{ Name: "Chain", ParentGroup: null, AllowTypes: ["Chained"]},
					{ Name: "Cuffs" },
					{ Name: "Gems" },
				]
			},
			{
				Name: "LegBinder", Fetish: ["Latex"], Value: 80, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: ["#222", "Default"], Prerequisite: ["NotSuspended", "NotHogtied", "CanCloseLegs"], Hide: ["Shoes", "Socks", "ClothLower", "Garters"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels", "ItemBootsHighThighBoots", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemFeet"], AllowActivePose: ["Kneel"],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" },
				]
			},
			{
				Name: "HobbleSkirt", Fetish: ["Latex"], Value: 125, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: ["#222", "Default"], Prerequisite: ["NotSuspended", "NotHogtied", "CanCloseLegs"], Hide: ["Shoes", "Socks", "ClothLower", "Garters"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels", "ItemBootsHighThighBoots", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"], AllowActivePose: ["Kneel"],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" }
				]
			},
			{ Name: "SeamlessLegBinder", Value: 80, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotSuspended", "NotHogtied", "CanCloseLegs"], Hide: ["Shoes", "Garters"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels", "ClothLowerPajama1", "SocksSocks6", "SocksSocksFur", "ItemBootsHighThighBoots", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemFeet"], AllowActivePose: ["Kneel"] },
			{ Name: "SeamlessHobbleSkirt", Value: 125, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotSuspended", "NotHogtied", "CanCloseLegs"], Hide: ["Shoes", "Garters"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels", "ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerLatexPants1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ClothLowerMistressBottom", "ClothLowerPencilSkirt", "SocksSocks6", "SocksSocksFur", "ItemBootsHighThighBoots", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"], AllowActivePose: ["Kneel"] },
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", Audio: "ZipTie", SetPose: ["LegsClosed"], Extended: true, Prerequisite: ["CanCloseLegs"],},
			{ Name: "Chains", Fetish: ["Metal"], Value: 90, Difficulty: 5, Time: 20, RemoveTime: 15, AllowLock: true, BuyGroup: "Chains", Audio: "ChainLong", SetPose: ["LegsClosed"], Extended: true, AllowActivePose: ["Kneel"], Prerequisite: ["CanCloseLegs"] },
			{ Name: "PlasticWrap", Value: 100, Difficulty: 7, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", SetPose: ["LegsClosed"], Hide: ["ClothLower", "Garters"], AllowActivePose: ["Kneel"], Prerequisite: ["CanCloseLegs"] },
			{ Name: "FrogtieStraps", Fetish: ["Leather"], Value: 25, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: ["NotSuspended", "CanKneel"], SetPose: ["Kneel"], AllowPose: ["Kneel", "KneelingSpread"], AllowActivePose: ["Kneel", "KneelingSpread"], FreezeActivePose: [], Effect: ["ForceKneel", "Slow"] },
			{
				Name: "MermaidTail",
				Value: 120, Left: 0, Top: 380, Difficulty: 5, Time: 30, RemoveTime: 20, Random: false, AllowLock: true, DefaultColor: "#0D7800", ArousalZone: "ItemVulva",
				Fetish: ["Latex", "Pet"],
				Prerequisite: ["NotSuspended", "NotHogtied", "AccessVulva", "NotKneeling", "NoOuterClothes", "NotChaste", "CanCloseLegs"],
				Hide: ["Shoes", "Socks", "BodyLower", "ClothLower", "ItemFeet", "ItemBoots", "Garters"],
				SetPose: ["LegsClosed"],
				Effect: ["Prone", "Freeze", "FillVulva", "Egged","BlockKneel"],
				AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands", "Yoked", "OverTheHead"],
				Block: ["ItemFeet", "ItemBoots", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
			},
			{
				Name: "MedicalBedRestraints", Value: -1, Difficulty: 5, Time: 5, RemoveTime: 5, Random: false, DefaultColor: "#ccc", AllowLock: true, BuyGroup: "MedicalBedRestraints", Left: 0, Top: 0, AllowPose: [],
				Prerequisite: ["OnBed", "LegsOpen"], SetPose: ["LegsOpen"], Effect: ["Prone", "BlockKneel"], Block: ["ItemDevices"], AvailableLocations: ["Asylum"],
				HideItem: ["ClothBondageDress1", "ClothBondageDress2", "ClothBridesmaidDress1", "ClothDress3", "ClothGown3", "ClothWeddingDress1", "ClothWeddingDress2", "ClothLowerWaspie1", "ClothLowerGown2Skirt", "ClothLowerPajama1", "ClothLowerClothSkirt1", "ClothLowerPencilSkirt", "ClothLowerWaspie2", "ClothLowerWaspie3"],
				Layer: [
					{ Name: "Base", Priority: 1, ParentGroup: null },
					{ Name: "Straps", Priority: 26 },
				],
			},
			{ Name: "Ribbons", Fetish: ["Lingerie"], Value: 30, Difficulty: 3, Time: 10, RemoveTime: 5, Hide: ["ClothLower"], BuyGroup: "Ribbon", Extended: true, SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], Prerequisite: ["CanCloseLegs"] },
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Difficulty: 6, Time: 15, RemoveTime: 15, Left: 142, Top: 560,
				SetPose: ["LegsClosed"],
				DefaultColor: ["#c43ba4", "#b832b6", "#9221ba"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Sucker" },
					{ Name: "Outer" },
					{ Name: "Shine", AllowColorize: false },
				],
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e", "#57ab5e"], Random: false, Value: 200, Difficulty: 5, Time: 25, RemoveTime: 40, ParentGroup: null, Prerequisite: ["CanCloseLegs"], SetPose: ["LegsClosed"],
				AllowPose: [],
				AllowActivePose: ["Kneel"],
				HideForPose: ["Spread", "KneelingSpread"],
				Effect: ["Slow"],
				Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis"],
				HideItemAttribute: ["Skirt"],
				HideItemExclude: ["ClothLowerGown2Skirt"],
				HideItem: ["ClothBabydollDress1", "ClothBondageDress1", "ClothBondageDress2", "ClothChineseDress1", "ClothDressFur", "ClothFlowerDress", "ClothFuzzyDress", "ClothGrandMage", "ClothDress3", "ClothNurseUniform", "ClothRobe1", "ClothGown3", "ClothStudentOutfit1", "ClothStudentOutfit2", "ClothSummerDress", "ClothTeacherOutfit1", "ClothBodyTowel1", "ClothSweater1", "ClothVirginKiller1", "ClothYukata1", "PantiesBulkyDiaper", "PantiesPoofyDiaper", "ItemPelvisBulkyDiaper", "ItemPelvisPoofyDiaper"],
				Layer: [
					{ Name: "One" },
					{ Name: "Two" },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemVulva",
		Category: "Item",
		Priority: 15,
		Default: false,
		Left: 125,
		Top: 400,
		AllowPose: ["Kneel"],
		Zone: [[100, 500, 100, 80]],
		Asset: [
			// Vagina Compatible Items
			{ Name: "VibratingEgg", Gender: "F", Value: 25, Time: 5, Visible: false, Prerequisite: ["AccessVulva","HasVagina"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "VibratorRemote", Gender: "F", Value: 50, Visible: false, Wear: false, BuyGroup: "VibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "VibratingLatexPanties", Gender: "F", Fetish: ["Latex"], Value: 50, Time: 10, AllowLock: true, DefaultColor: "#60A0AF", Prerequisite: ["AccessVulva", "CannotHaveWand", "HasVagina"], Effect: ["Chaste"], Block: ["ItemButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{
				Name: "WandBelt", Gender: "F", Priority: 24, Value: 80, Time: 15, AllowLock: true, DefaultColor: ["#baa", "Default"], Prerequisite: ["CannotHaveWand","HasVagina"], HideItem: ["ClothLowerPajama1", "ClothLowerMistressBottom"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Belt" },
					{ Name: "Wand" }
				]
			},
			{
				Name: "PenisDildo", Gender: "F", Priority: 11, Value: 20, Time: 10, BuyGroup: "PenisDildo", Prerequisite: ["AccessVulva", "HasVagina"], Effect: ["FillVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "ShockDildo", Gender: "F", Fetish: ["Masochism"], Priority: 11, Value: 70, Time: 10,
				Extended: true, AlwaysExtend: true, Prerequisite: ["AccessVulva", "HasVagina"],
				Effect: ["FillVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				HasType: false,
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false },
				],
			},
			{
				Name: "VibratingDildo", Gender: "F", Priority: 11, DefaultColor: "#ED4BEE", BuyGroup: "VibratingDildo", Value: 60, Time: 10, Prerequisite: ["AccessVulva", "HasVagina"], Effect: ["FillVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "End", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "FuturisticVibrator", Gender: "F",  DefaultColor: ["#3C724C", "Default"], Value: 70,
				Difficulty: 3, AllowLock: true, DrawLocks: false, Time: 10, Prerequisite: ["AccessVulva", "HasVagina"],
				FuturisticRecolor: true, Effect: [ "Egged", "FillVulva"], AllowEffect: ["Egged", "Vibrating", "FillVulva", "Edged"],
				ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				AllowType: ["Off", "Low", "Medium", "High", "Maximum", "Random", "Escalate", "Tease", "Deny", "Edge"],
				DynamicScriptDraw: true,
				Extended: true,
				Layer: [
					{ Name: "Display", AllowColorize: true },
					{ Name: "Band", AllowColorize: true },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "InflatableVibeDildo", Gender: "F", Priority: 11, Value: 100, Time: 10, Prerequisite: ["AccessVulva", "HasVagina"], Effect: ["Egged", "FillVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Extended: true,
				Layer: [
					{ Name: "Dildo", AllowColorize: true, HasType: false },
					{ Name: "Pussy", AllowColorize: false, HasType: false }
				]
			},
			{
				Name: "ClitoralStimulator", Gender: "F", Priority: 11, Value: 70, Time: 10, DefaultColor: "#8a00d1", Prerequisite: ["AccessVulva","HasVagina"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Stimulator", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{ Name: "ClitSuctionCup", Gender: "F", Priority: 11, Value: 25, Time: 10, Prerequisite: ["AccessVulva", "HasVagina"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true, HasType: false },
			{ Name: "TapeStrips", Gender: "F", Fetish: ["Tape"], Value: 10, Time: 5, Prerequisite: ["AccessVulva", "HasVagina"], CraftGroup: "DuctTape", ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "BenWaBalls", Gender: "F", Fetish: ["Metal"], Value: 30, Time: 5, Visible: false, Prerequisite: ["AccessVulva", "HasVagina"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HeavyWeightClamp", Gender: "F", Fetish: ["Metal", "Masochism"], Value: 30, Time: 5, Prerequisite: ["AccessVulva", "HasVagina"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "FullLatexSuitWand", Gender: "F", Fetish: ["Latex"], Priority: 34, Value: -1, Difficulty: 12, Time: 5, IsRestraint: true, AllowLock: true, Block: ["ItemVulvaPiercings"] },
			{
				Name: "ClitAndDildoVibratorbelt", Gender: "F", Fetish: ["Leather"], Priority: 11, Value: 100, Time: 10, AllowLock: true,
				Prerequisite: ["AccessVulva", "HasVagina"], Hide: ["Panties"], Effect: ["Egged", "FillVulva"], Block: ["ItemPelvis"],
				ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Extended: true,
				Layer: [
					{ Name: "Belt", AllowColorize: true, HasType: false },
					{ Name: "Crotch", AllowColorize: false, HasType: false }
				]
			},
			{
				Name: "HempRopeBelt", Gender: "F", Fetish: ["Rope"], Value: 60, Time: 24, DefaultColor: ["#956B1C", "Default"], BuyGroup: "HempRope", Audio: "RopeShort", Prerequisite: ["CannotHaveWand", "HasVagina"], HideItem: ["ClothLowerPajama1", "ClothLowerMistressBottom"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Rope" },
					{ Name: "Wand" }
				]
			},
			{
				Name: "WiredEgg", Gender: "F", ParentGroup: "BodyLower", Value: 30, Time: 5, Prerequisite: ["AccessVulva", "HasVagina"], AllowPose: ["Kneel", "KneelingSpread", "LegsClosed"],
				Layer: [
					{ Name: "Remote" },
					{ Name: "Strap" }
				]
			},
			{
				Name: "LoversVibrator", Gender: "F", Value: 75, Time: 5, LoverOnly: true, DefaultColor: "#790c0c", Prerequisite: ["AccessVulva", "HasVagina"],
				Extended: true,
				Effect: ["Egged", "FillVulva"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				AllowRemoveExclusive: true, CharacterRestricted: true, DynamicScriptDraw: true},

			{ Name: "LoversVibratorRemote", Gender: "F", Value: 75, Wear: false, LoverOnly: true, Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "DoubleEndDildo", Gender: "F", Value: 15, Time: 10, DefaultColor: ["#624662"], Effect: ["FillVulva"], Prerequisite: ["AccessVulva", "HasVagina"], AllowPose: [], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 20 }], AllowActivity: ["PenetrateItem"], HasType: true, Extended: true, },
			{
				Name: "Stitches", Gender: "F", Category: ["Medical", "Extreme"], Priority: 13, BuyGroup: "Suture", Random: false, Value: -1, Difficulty: 8, Time: 5, RemoveTime: 5, Prerequisite: ["AccessVulva", "HasVagina"], Effect: ["Chaste"], DefaultColor: ["#3f3c3a"], AllowPose: ["Spread"], Extended: true, AlwaysExtend: true,
				Layer: [
					{ Name: "Straight", HasType: false, AllowTypes: ["Straight"] },
					{ Name: "ZigZag", HasType: false, CopyLayerColor: "Straight", AllowTypes: ["ZigZag"] },
					{ Name: "Skewed", HasType: false, CopyLayerColor: "Straight", AllowTypes: ["Skewed"] },
					{ Name: "Cross", HasType: false, CopyLayerColor: "Straight", AllowTypes: ["Cross"] },
				],
			},
			// Penis Compatible Items
			{ Name: "BasicCockring", Gender: "M", Value: 10, Left: 200, Top: 410, Prerequisite: ["AccessVulva", "HasPenis"], AllowExpression: ["Hard"],
			AllowPose: [],
				Layer: [
					{ Name: "CockRing", MirrorExpression: "Pussy" },
				]
			},
			{
				Name: "PlasticChastityCage1", Gender: "M", Prerequisite: ["AccessVulva", "HasPenis"], Difficulty: 50, Value: 20, Effect: ["Chaste"], Hide: ["Pussy"],
				AllowPose: [],
				AllowLock: true, DrawLocks: false,
				DefaultColor: ["Default", "Default", "Default", "#8D8D8D"],
				Left: 200, Top: 410,
				Layer: [
					{ Name: "Penis", InheritColor: "Pussy", HideColoring: true },
					{ Name: "Ring" },
					{ Name: "Cage" },
					{ Name: "Lock", LockLayer: true}
				],
			},
			{
				Name: "VibeEggPenisBase", Gender: "M", Prerequisite: ["AccessVulva", "HasPenis"], Value: 20, Hide: ["Pussy"], AllowExpression: ["Hard"],
				Left: 200, Top: 410,
				DefaultColor: ["Default", "#323232", "#EFB0F4" ],
				AllowPose: [],
				Layer: [
					{ Name: "Penis", HideColoring: true, MirrorExpression: "Pussy", InheritColor: "Pussy" },
					{ Name: "Strap", MirrorExpression: "Pussy" },
					{ Name: "Egg", MirrorExpression: "Pussy" }
				]
			},
			{
				Name: "PlasticChastityCage2", Gender: "M", Prerequisite: ["AccessVulva", "HasPenis"], Value: 20, Difficulty: 50, Effect: ["Chaste"], Hide: ["Pussy"],
				AllowPose: [],
				AllowLock: true, DrawLocks: false,
				DefaultColor: ["Default", "#404040", "#404040", "#FFBC00"],
				Left: 200, Top: 410,
				Layer: [
					{ Name: "Penis", InheritColor: "Pussy", HideColoring: true },
					{ Name: "Ring" },
					{ Name: "Cage" },
					{ Name: "Lock", LockLayer: true}
				],
			},
			{
				Name: "TechnoChastityCage", Gender: "M", Prerequisite: ["AccessVulva", "HasPenis"], Category: ["SciFi"], Value: 50, Difficulty: 50, Effect: ["Chaste"], Hide: ["Pussy"],
				AllowPose: [],
				AllowLock: true, DrawLocks: false,
				DefaultColor: ["Default", "#555555", "#555555", "#FF0000"],
				Left: 200, Top: 410,
				Layer: [
					{ Name: "Penis", InheritColor: "Pussy", HideColoring: true },
					{ Name: "Ring" },
					{ Name: "Cage" },
					{ Name: "Lock", LockLayer: true}
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemVulvaPiercings",
		Category: "Item",
		Priority: 13,
		Default: false,
		Left: 125,
		Top: 400,
		Zone: [[200, 500, 100, 80]],
		Asset: [
			{ Name: "StraightClitPiercing", Gender: "F", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{
				Name: "RoundClitPiercing", Gender: "F", Fetish: ["Metal"], Value: 25, Difficulty: 10, Time: 5, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }],
				Extended: true, HasType: false,
				Layer: [
					{ Name: "Ring", AllowTypes: ["", "Weight", "Bell"], },
					{ Name: "PulledRing", AllowTypes: ["Chain", "HaremChain"], CopyLayerColor: "Ring", },
					{ Name: "Weight", AllowTypes: ["Weight"], ColorGroup: "Addons", },
					{ Name: "Bell", AllowTypes: ["Bell"], ColorGroup: "Addons", },
					{ Name: "Chain", AllowTypes: ["Chain"], ColorGroup: "Addons", Top: 263, },
					{ Name: "HaremVeil", AllowTypes: ["HaremChain"], ColorGroup: "Addons", Top: 263, },
					{ Name: "HaremChain", AllowTypes: ["HaremChain"], CopyLayerColor: "Chain", Top: 263, },
				]
			},
			{ Name: "BarbellClitPiercing", Gender: "F", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 5, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"],  ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChastityClitPiercing", Gender: "F", Fetish: ["Metal"], Value: 50, Difficulty: 50, Time: 20, RemoveTime: 20, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"],  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChastityClitShield", Gender: "F", Fetish: ["Metal"], Value: 70, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"],  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HighSecurityVulvaShield", Gender: "F", Fetish: ["Metal"], Value: 100, Difficulty: 99, Time: 60, RemoveTime: 200, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"],  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "JewelClitPiercing", Gender: "F", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 5, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"],  ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "AdornedClitPiercing", Gender: "F",Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 5, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"],  ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{
				Name: "VibeHeartClitPiercing", Gender: "F", Value: 35, Difficulty: 10, Time: 5, AllowLock: true, DrawLocks: false, BuyGroup: "VibeHeart", Prerequisite: ["AccessVulva", "HasVagina"], Effect: ["Egged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Heart" },
					{ Name: "Ring" }
				]
			},
			{
				Name: "ClitRing", Gender: "F", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 15, Random: false, AllowLock: true, DrawLocks: false, Left: 50, AllowPose: ["Kneel"], Prerequisite: ["AccessVulva", "HasVagina"], Extended: true,
				Layer: [
					{ Name: "Ring", HasType: false, AllowTypes: ["", "Leash"] },
					{ Name: "Leash", HasType: false, AllowTypes: ["Leash"] }
				]
			},
			{ Name: "TapedClitEgg", Gender: "F", Fetish: ["Tape"], Value: 25, Time: 5, Prerequisite: ["AccessVulva", "HasVagina"], Effect: ["Egged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Egg" },
					{ Name: "Tape" }
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemButt",
		Category: "Item",
		Priority: 4,
		Default: false,
		Left: 0,
		Top: 0,
		Effect: ["IsPlugged"],
		Zone: [[300, 500, 100, 80]],
		Asset: [
			{ Name: "BlackButtPlug", Value: 15, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PenisPlug", Value: 20, Time: 10, Visible: false, BuyGroup: "PenisDildo", Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{
				Name: "TailButtPlug", Fetish: ["Pet"], Value: 40, Time: 10, Top: 100, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Layer: [
					{ Name: "Tail" },
					{ Name: "Ribbon" },
					{ Name: "Bell" },
				]
			},
			{ Name: "HorsetailPlug", Fetish: ["Pony"], Value: 30, Time: 10, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HorsetailPlug1", Fetish: ["Pony"], Value: 40, Time: 10, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PuppyTailPlug", Fetish: ["Pet"], Value: 25, Time: 10, Top: 20, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PuppyTailPlug1", Fetish: ["Pet"], Value: 30, Time: 10, Top: 30, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "SuccubusButtPlug", Fetish: ["Pet"], Value: 15, Time: 10, Top: 65, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "SuccubusHeartButtPlug", Fetish: ["Pet"], Value: 25, Time: 10, Top: 60, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Tail" },
					{ Name: "Heart" },
				]
			},
			{
				Name: "FoxTails", Fetish: ["Pet"], Priority: 2, Value: 60, Time: 10, Top: 20, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Layer: [
					{ Name: "Tips" },
					{ Name: "Bases" }
				]
			},
			{ Name: "RaccoonButtPlug", Fetish: ["Pet"], Value: 40, Time: 10, Top: 20, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "RaccoonTailPlug", Fetish: ["Pet"], Priority: 2, Value: 50, Time: 10, Top: 30, Effect: ["IsPlugged"], Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalBeads", Value: 20, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalBeads2", Fetish: ["Metal"],  Value: 70, Time: 14, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Extended: true, Activity: "MasturbateItem" },
			{ Name: "ButtPump", Value: 35, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "VibratingButtplug", Value: 60, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged", "Egged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }] },
			{ Name: "InflVibeButtPlug", Value: 90, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged", "Egged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "AnalHook", Fetish: ["Metal"], Value: 20, Time: 10, IsRestraint: true, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "ButtPlugLock", Fetish: ["Metal"], Value: 75, Difficulty: 50, Time: 30, RemoveTime: 50, IsRestraint: true, AllowLock: true, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "KittenTail1", Fetish: ["Pet"], Value: 30, Time: 10, Top: 100, Prerequisite: ["AccessButt"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "KittenTail2", Fetish: ["Pet"], Value: 30, Time: 10, Top: 30, Prerequisite: ["AccessButt"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "FoxTail1", Fetish: ["Pet"], Value: 50, Time: 10, Top: 80, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Tip" },
				]
			},
			{ Name: "FoxTail2", Fetish: ["Pet"], Value: 50, Time: 10, Top: 100, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Tip" },
				]
			},
			{ Name: "WolfTail1", Fetish: ["Pet"], Value: 35, Time: 10, Top: 50, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail2", Fetish: ["Pet"], Value: 35, Time: 10, Top: 60, Prerequisite: ["AccessButt"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail3", Fetish: ["Pet"], Value: 35, Time: 10, Top: 40, Prerequisite: ["AccessButt"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "DemonPlug", Fetish: ["Pet"], Value: 35, Time: 10, Top: 70, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "MouseTail1", Fetish: ["Pet"], Value: 35, Time: 10, Top: 150, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "MouseTail2", Fetish: ["Pet"], Value: 35, Time: 10, Top: 180, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "VibratingDildoPlug", Value: 60, Time: 10, Visible: false, BuyGroup: "VibratingDildo", Prerequisite: ["AccessButt"], Effect: ["IsPlugged", "Egged"] },
			{ Name: "BunnyTailPlug1", Fetish: ["Pet"], Value: 1, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "BunnyTailPlug2", Fetish: ["Pet"], Value: 1, Time: 10, Visible: false, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "BunnyTailVibePlug", Fetish: ["Pet"], Effect: ["IsPlugged", "Egged"], Value: 75, Prerequisite: ["AccessButt"], Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], Visible: false },
			{ Name: "EggVibePlugXXL", Effect: ["IsPlugged", "Egged"], Value: 90, Prerequisite: ["AccessButt"], Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }], Visible: false },
			{ Name: "LockingVibePlug", Effect: ["IsPlugged", "Egged"], Value: 80, Difficulty: 30, Time: 30, RemoveTime: 50, IsRestraint: true, AllowLock: true, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }], Visible: false },
			{ Name: "ShockPlug", Fetish: ["Masochism"], Value: 60, Time: 10, Visible: false, Extended: true, AlwaysExtend: true, Prerequisite: ["AccessButt"], Effect: ["IsPlugged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "Cowtail", Fetish: ["Pet"], BuyGroup: "CowTails", Value: 20, Time: 10, Top: 80, Prerequisite: ["AccessButt"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HollowButtPlug", Value: 15, Time: 10, Visible: false, Prerequisite: ["AccessButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Time: 10, Prerequisite: ["AccessVulva"], DynamicGroupName: "TailStraps",
				DefaultColor: ["#c43ba4", "#b832b6", "#9221ba"],
				AllowActivity: ["PenetrateItem"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Sucker" },
					{ Name: "InnerShine", AllowColorize: false },
					{ Name: "Outer" },
					{ Name: "OuterShine", AllowColorize: false },
				],
			},
			{ Name: "Stitches", Category: ["Medical", "Extreme",], Priority: 10, Visible: false, BuyGroup: "Suture", Random:  false, Value: -1, Difficulty: 8, Time: 5, RemoveTime: 5, Prerequisite: ["AccessButt"] },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemPelvis",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 16,
		Default: false,
		Left: 125,
		Top: 375,
		Zone: [[100, 420, 300, 80]],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		Asset: [
			{ Name: "StraponPanties", Gender: "F", Fetish: ["Latex"], Value: -1, Time: 15, DefaultColor: "#505050", Prerequisite: ["AccessVulva", "HasVagina"], AllowActivity: ["PenetrateItem"], Bonus: "KidnapBruteForce", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"] },
			{ Name: "LeatherChastityBelt", Gender: "F", Fetish: ["Leather"], ParentGroup: null, Value: 30, Difficulty: 8, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessVulva", "HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Layer: [
				{ Name: "Belt" },
				{ Name: "Studs" },
				{ Name: "Locks", LockLayer: true }
			] },
			{ Name: "SleekLeatherChastityBelt", Gender: "F", Fetish: ["Leather"], Value: 45, Difficulty: 11, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessVulva", "HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "StuddedChastityBelt", Gender: "F", Fetish: ["Leather", "Metal"], Value: 60, Difficulty: 14, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessVulva", "HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{ Name: "MetalChastityBelt", Fetish: ["Metal"], ParentGroup: null, Value: 100, Difficulty: 20, Time: 20, RemoveTime: 10, DrawLocks: false, AllowLock: true, Audio: "CuffsMetal", Prerequisite: ["AccessVulva"], Hide: ["ItemVulva", "Pussy"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false, Layer: [
				{ Name: "Belt" },
				{ Name: "Keyhole", CopyLayerColor: "Lock"},
				{ Name: "Lock", LockLayer: true },
			]},
			{ Name: "PolishedChastityBelt", Gender: "F", Fetish: ["Metal"], Value: 150, Difficulty: 30, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", Prerequisite: ["AccessVulva", "HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{ Name: "FuturisticChastityBelt", Gender: "F", Category: ["SciFi"], Fetish: ["Metal"], Value: 170, BuyGroup: "FuturisticChastityBelt",
				Difficulty: 50, Time: 20, RemoveTime: 10, Random: false, AllowLock: true, DrawLocks: false,
				DefaultColor: ["#93C48C", "#3B7F2C", "Default", "Default", "Default", "Default", "#222222", "Default"], FuturisticRecolor: true,
				Audio: "FuturisticApply", Prerequisite: ["AccessVulva", "HasVagina"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Effect: [ "UseRemote"],
				AllowBlock: ["ItemVulvaPiercings", "ItemButt", "ItemVulva"],
				AllowType: ["ClosedBack1","OpenBoth1", "OpenBack2", "ClosedBack2","OpenBoth2", "OpenBack3", "ClosedBack3","OpenBoth3", "ChatMessage", "PunishOrgasm", "PunishStruggle", "PunishStrugleOther"],
				Block: [],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Extended: true, DynamicScriptDraw: true,
				Layer: [
					{ Name: "Mesh", AllowColorize: true, HasType: false, AllowModuleTypes: ["m0"]}, // ModuleType: ["m"],
					{ Name: "Screen", AllowColorize: true , ParentGroup: null, HasType: false, AllowModuleTypes: ["m0"]},
					{ Name: "Belt", AllowColorize: true, HasType: false, AllowModuleTypes: ["m0"]},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null,  AllowModuleTypes: ["m0"]},
					{ Name: "Mesh_2", AllowColorize: true, CopyLayerColor: "Mesh", HasType: false, AllowModuleTypes: ["m1"]},
					{ Name: "Screen_2", AllowColorize: true, CopyLayerColor: "Screen" , ParentGroup: null, HasType: false, AllowModuleTypes: ["m1"]},
					{ Name: "Band_2", AllowColorize: true, HasType: false, AllowModuleTypes: ["m1"]},
					{ Name: "Belt_2", AllowColorize: true, CopyLayerColor: "Belt", HasType: false, AllowModuleTypes: ["m1"]},
					{ Name: "Lock_2", LockLayer: true,AllowColorize: true, CopyLayerColor: "Lock", HasType: false, ParentGroup: null, AllowModuleTypes: ["m1"]},
					{ Name: "Display_3", AllowColorize: true, CopyLayerColor: "Screen", ParentGroup: null, HasType: false, AllowModuleTypes: ["m2"]},
					{ Name: "Mesh_3", AllowColorize: true, CopyLayerColor: "Mesh", HasType: false, AllowModuleTypes: ["m2"]},
					{ Name: "Mesh2_3", AllowColorize: true, HasType: false, AllowModuleTypes: ["m2"]},
					{ Name: "Band_3", AllowColorize: true, CopyLayerColor: "Band_2", HasType: false, AllowModuleTypes: ["m2"]},
					{ Name: "Belt_3", AllowColorize: true, ParentGroup: null, CopyLayerColor: "Belt", HasType: false, AllowModuleTypes: ["m2"]},
					{ Name: "Lock_3", LockLayer: true, AllowColorize: true, CopyLayerColor: "Lock", HasType: false, ParentGroup: null, AllowModuleTypes: ["m2"]},
					{ Name: "Display_4", AllowColorize: true, CopyLayerColor: "Screen", ParentGroup: null, HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "Mesh_4", AllowColorize: true, CopyLayerColor: "Mesh", HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "Belt_4", AllowColorize: true, ParentGroup: null, CopyLayerColor: "Belt", HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "Band_4", AllowColorize: true, CopyLayerColor: "Band_2", HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "Plug_4", AllowColorize: true, ParentGroup: null, HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "PlugCap", AllowColorize: true, HasType: true, ModuleType: ["m"], AllowModuleTypes: ["f1"]},
					{ Name: "Strap_4", AllowColorize: true, ParentGroup: null, HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "Mesh2_4", AllowColorize: true, CopyLayerColor: "Mesh2_3", HasType: false, AllowModuleTypes: ["m3"]},
					{ Name: "Lock_4", LockLayer: true, AllowColorize: true, CopyLayerColor: "Lock", HasType: false, ParentGroup: null, AllowModuleTypes: ["m3"]},
					{ Name: "TLock", AllowColorize: true, CopyLayerColor: "Lock", HasType: true, ParentGroup: null, ModuleType: ["m"], AllowModuleTypes: ["t1", "t2"]},
					{ Name: "OLock", AllowColorize: true, CopyLayerColor: "Lock", HasType: true, ParentGroup: null, ModuleType: ["m"], AllowModuleTypes: ["o1"]},
				]
			},
			{
				Name: "FuturisticTrainingBelt", Gender: "F", Category: ["SciFi"], Fetish: ["Metal"], ArousalZone: "ItemVulva",
				Value: -1, Difficulty: 100, Time: 30, RemoveTime: 30, BuyGroup: "FuturisticChastityBelt", Random: false,
				AllowLock: true, DrawLocks: false, DefaultColor: ["#3B7F2C", "#93C48C", "#93C48C", "Default", "Default", "Default"],
				Audio: "FuturisticApply", Prerequisite: ["AccessVulva", "VulvaEmpty", "ClitEmpty", "ButtEmpty", "HasVagina"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				FuturisticRecolor: true, Effect: ["FillVulva", "UseRemote", "Egged", "Chaste", "Edged"], AllowEffect: ["Vibrating", "DenialMode", "RuinOrgasms"],
				Block: ["ItemVulvaPiercings", "ItemButt", "ItemVulva"], AllowType: [], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Extended: true, HasType: false, DynamicScriptDraw: true,
				Layer: [
					{ Name: "Display", AllowColorize: true , ParentGroup: null},
					{ Name: "Mesh", AllowColorize: true},
					{ Name: "Mesh2", AllowColorize: true},
					{ Name: "Band", AllowColorize: true},
					{ Name: "Belt", AllowColorize: true , ParentGroup: null},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "SciFiPleasurePanties", Gender: "F", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 50,
				Time: 15, RemoveTime: 12, BuyGroup: "FuturisticChastityBelt", Random: false, AllowLock: true, DrawLocks: false,
				DefaultColor: ["#592599", "#202020", "#592599", "#202020", "#7631cc", "#7631cc"], Audio: "FuturisticApply", Prerequisite: ["AccessVulva", "HasVagina"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				FuturisticRecolor: true, Effect: [ "Chaste", "UseRemote", "Egged"], ArousalZone: "ItemVulva", Block: [],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false,
				Layer: [
					{ Name: "Screen", AllowColorize: true, ParentGroup: null},
					{ Name: "Mesh2", AllowColorize: true},
					{ Name: "Mesh1", AllowColorize: true},
					{ Name: "Band", AllowColorize: true, ParentGroup: null},
					{ Name: "Plug2", AllowColorize: true, ParentGroup: null},
					{ Name: "Plug1", AllowColorize: true, ParentGroup: null},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "OrnateChastityBelt", Fetish: ["Metal"], Value: 200, Difficulty: 50, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", Prerequisite: ["AccessVulva"], Hide: ["ItemVulva", "Pussy"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false,
				Layer: [
					{ Name: "Belt" },
					{ Name: "Gems" }
				]
			},
			{ Name: "SteelChastityPanties", Gender: "F", Fetish: ["Metal"], Value: 150, Difficulty: 50, Time: 50, RemoveTime: 60, AllowLock: true, Audio: "CuffsMetal", Prerequisite: ["AccessVulva", "HasVagina"], Hide: ["ItemVulva", "ItemVulvaPiercings"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "HarnessPanties1", Gender: "F", Fetish: ["Leather"], Priority: 19, Value: 35, Difficulty: 8, Time: 10, RemoveTime: 15, AllowLock: true, Left: 110, Top: 395, BuyGroup: "HarnessPanties1", Prerequisite: ["AccessVulva", "HasVagina"], AllowPose: ["LegsClosed", "Kneel", "KneelingSpread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "HarnessPanties2", Gender: "F", Fetish: ["Leather"], Priority: 19, Value: 40, Difficulty: 9, Time: 10, RemoveTime: 15, AllowLock: true, Left: 85, Top: 395, BuyGroup: "HarnessPanties2", Prerequisite: ["AccessVulva", "HasVagina"], AllowPose: ["LegsClosed", "Kneel", "KneelingSpread", "Spread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], DrawLocks: false },
			{ Name: "LeatherStrapPanties1", Gender: "F", Fetish: ["Leather"], Value: 20, Difficulty: 5, Time: 20, RemoveTime: 10, AllowLock: true, Left: 150, Top: 395, BuyGroup: "LeatherStrapPanties1", Prerequisite: ["AccessVulva", "HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "LoveChastityBelt", Gender: "F", Fetish: ["Metal"], Value: 250, Difficulty: 50,
				Time: 20, RemoveTime: 10, OwnerOnly: true, Prerequisite: ["AccessVulva", "HasVagina"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo"],
				Effect: ["Lock"], ArousalZone: "ItemVulva",
				Audio: "CuffsMetal",
				Extended: true,
				HasType: false,
				Layer: [
					{ Name: "Open", AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["f0"] },
					{ Name: "Closed", AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["f1", "f2", "f3"], CopyLayerColor: "Open" },
					{ Name: "Vibe", AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["f2"] },
					{ Name: "Shock", AllowColorize: false, ParentGroup: null, AllowModuleTypes: ["f3"], CopyLayerColor: "Vibe" },
					{ Name: "Lock", AllowColorize: true, ParentGroup: null },
					{ Name: "ShieldLock", AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["f1", "f2", "f3"], CopyLayerColor: "Lock" },
				]
			},
			{ Name: "HempRope", Gender: "F", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", Audio: "RopeShort", Prerequisite: ["AccessTorso", "HasVagina"], AllowPose: ["LegsClosed", "Kneel", "KneelingSpread"], Extended: true },
			{ Name: "DiaperHarness", Gender: "F", Category: ["ABDL"], Prerequisite: ["HasVagina"], Fetish: ["Leather", "ABDL"], Priority: 24, Value: 65, Difficulty: 50, Time: 25, RemoveTime: 30, AllowLock: true, Left: 150, Top: 395, Hide: ["ItemVulva", "ItemVulvaPiercings"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "PelvisChainLeash", Gender: "F", Prerequisite: ["HasVagina"], Priority: 27, Fetish: ["Metal"], Value: 40, Difficulty: 5, Time: 20, RemoveTime: 25, AllowLock: true, Effect: ["Leash"] },
			{ Name: "Ribbons", Gender: "F", Fetish: ["Lingerie"], Value: 30, Difficulty: 3, Time: 10, RemoveTime: 5, BuyGroup: "Ribbon", Prerequisite: ["AccessVulva","HasVagina"], Extended: true },
			{
				Name: "BulkyDiaper", BuyGroup: "BulkyDiapers", Priority: 25, Category: ["ABDL"], Fetish: ["ABDL"], Random: false, Value: 30, Difficulty: 50, Time: 5, RemoveTime: 5, AllowLock: true, DrawLocks: false, Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], DefaultColor:["#688599", "#808080", "#8c7384", "#BF3F97"], AllowPose: ["LegsClosed", "Kneel"], HideForPose: ["KneelingSpread", "Hogtied", "AllFours"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ClothMistressBottom", "ClothShorts1"], Left: 49, Top: 360, SetPose: ["LegsOpen"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"],
				Layer: [
					{ Name: "Base" },
					{ Name: "CrotchPiece" },
					{ Name: "WaistBand" },
					{ Name: "Tape", ParentGroup: null },
					{ Name: "Back", CopyLayerColor: "Base", ParentGroup: null, Priority: 6 },
				]
			},
			{
				Name: "PoofyDiaper", BuyGroup: "PoofyDiapers", Priority: 25, Category: ["ABDL"], Fetish: ["ABDL"], Random: false, Value: 30, Difficulty: 50, Time: 5, RemoveTime: 5, AllowLock: true, DrawLocks: false, Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], DefaultColor:["#9763A6", "#658AA6", "#997391", "#a916cc"], AllowPose: ["LegsClosed", "Kneel"], HideForPose: ["KneelingSpread", "Hogtied", "AllFours"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ClothMistressBottom", "ClothShorts1"], Left: 49, Top: 360, SetPose: ["LegsOpen"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"], Extended: true,
				Layer: [
					{ Name: "Base", HasType: false, AllowTypes: [""] },
					{ Name: "PoofyBase", CopyLayerColor: "Base", HasType: false, AllowTypes: ["Poofy"] },
					{ Name: "CrotchPatch", HasType: false },
					{ Name: "Frills", HasType: false },
					{ Name: "Tape", HasType: false, ParentGroup: null },
					{ Name: "Back", CopyLayerColor: "Base", HasType: false, ParentGroup: null, Priority: 6 },
				]
			},
			{ Name: "HybridChastityBelt", Gender: "F", Fetish: ["Leather", "Metal"], ParentGroup: null, Value: 120, Difficulty: 8, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessVulva", "HasVagina"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Layer: [
				{ Name: "Belt" },
				{ Name: "CrotchPlate" },
				{ Name: "Rivets" },
				{ Name: "Lock", LockLayer: true }
			] },
			{
				Name: "ObedienceBelt", Gender: "F", Fetish: ["Metal", "Chastity"], ParentGroup: null, Value: 150,
				Difficulty: 8, Time: 15, RemoveTime: 20,
				Extended: true, DynamicScriptDraw: true, DynamicAfterDraw: true, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessVulva", "HasVagina"], AllowEffect: ["Chaste"],
				DefaultColor: ['Default', 'Default', "Default", "Default", "#FF0000", "#004A7F"],
				AllowBlock: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				TextMaxLength: { Text: 13 },
				TextFont: "Arial, sans-serif",
				Layer: [
					{ Name: "Base", HasType: false, ColorGroup: "Metal", },
					{ Name: "Trim", HasType: false, ColorGroup: "Metal", },
					{ Name: "Text", HasType: false, HasImage: false, },
					{ Name: "CrotchShield", HasType: false, ColorGroup: "Metal", AllowModuleTypes: ["c1", "c3"], },
					{ Name: "WireOutline", HasType: false, AllowColorize: false, AllowModuleTypes: ["s1"], },
					{ Name: "PositiveWire", HasType: false, AllowModuleTypes: ["s1"], },
					{ Name: "NegativeWire", HasType: false, AllowModuleTypes: ["s1"], },
					{ Name: "CrotchLock", HasType: false, LockLayer: true, AllowColorize: false, AllowModuleTypes: ["c1", "c3"], },
					{ Name: "Locks", HasType: false, LockLayer: true, AllowColorize: false, },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemTorso",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 17,
		Default: false,
		Left: 125,
		Top: 200,
		AllowPose: ["Hogtied", "AllFours"],
		Zone: [[100, 340, 150, 80]],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		Asset: [
			{ Name: "NylonRopeHarness", Gender: "F", Fetish: ["Rope", "Nylon"], Value: 30, Time: 20, BuyGroup: "NylonRope", CraftGroup: "NylonRope", Audio: "RopeShort", Prerequisite: ["AccessTorso", "HasBreasts"], Extended: true,
				DefaultColor: ["#CCCCCC"],
				Layer: [
					{ Name: "Rope" },
					{ Name: "Shine", AllowColorize: false },
				] },
				{ Name: "HempRopeHarness", Gender: "F", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Audio: "RopeShort", Prerequisite: ["AccessTorso", "HasBreasts"], Extended: true },
				{ Name: "LeatherHarness", Gender: "F", Fetish: ["Leather"], BuyGroup: "LeatherHarness", Value: 60, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso" },
				{ Name: "LeatherStrapHarness", Gender: "F", Fetish: ["Leather"], BuyGroup: "LeatherStrapHarness", Value: 50, Difficulty: 50, Time: 15, RemoveTime: 10, DefaultColor: "#101010", AllowLock: true, Prerequisite: "AccessTorso" },
				{ Name: "AdultBabyHarness", Category: ["ABDL"], Fetish: ["Leather", "ABDL"], BuyGroup: "AdultBabyHarness", Priority: 33, Value: 50, Difficulty: 3, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, DefaultColor: "#aaaaaa", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], DrawLocks: false, Attribute: ["CanAttachMittens"] },
				{ Name: "HarnessBra1", Gender: "F", Fetish: ["Leather"], Priority: 20, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, BuyGroup: "HarnessBra1", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], DrawLocks: false },
				{ Name: "HarnessBra2", Gender: "F", Fetish: ["Leather"], Priority: 20, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, BuyGroup: "HarnessBra2", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
				{ Name: "Corset2", Gender: "F", Fetish: ["Lingerie"], Priority: 22, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset2", Prerequisite: ["AccessTorso", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"], DynamicGroupName: "Corset" },
				{ Name: "FuturisticHarness", Gender: "F", Fetish: ["Metal"], Category: ["SciFi"], BuyGroup: "FuturisticHarness", Value: 30, Difficulty: 20, Time: 17, RemoveTime: 12, Audio: "FuturisticApply", DefaultColor: ["#50913C", "Default", "#889FA7"], FuturisticRecolor: true, Effect: [], AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], HideForPose: ["AllFours"], Extended: true,
					Layer:[
						{ Name: "Display", AllowColorize: true, ParentGroup: null, Priority: 15, AllowTypes: ["", "Lower"], HasType: false},
						{ Name: "Band", AllowColorize: true, Priority: 15 , AllowTypes: ["", "Lower"], HasType: false},
						{ Name: "Mesh", AllowColorize: true, ParentGroup: null, Priority: 15, AllowTypes: ["", "Lower"], HasType: false},
						{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null, AllowTypes: ["", "Lower"], HasType: false},
						{ Name: "Display2", AllowColorize: true, CopyLayerColor: "Display", ParentGroup: null, AllowTypes: ["", "Upper"], HasType: false},
						{ Name: "Band2", AllowColorize: true, CopyLayerColor: "Band", AllowTypes: ["", "Upper"], HasType: false},
						{ Name: "Lock2", LockLayer: true, CopyLayerColor: "Lock", ParentGroup: null, AllowTypes: ["", "Upper"], HasType: false},
					]
				},
			{ Name: "HighSecurityHarness", Gender: "F", Fetish: ["Metal"], BuyGroup: "HighSecurityHarness", Value: 50, Difficulty: 50, Time: 20, RemoveTime: 15, DefaultColor: ["#444444", "Default"], Effect: [], AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], HideForPose: ["AllFours"], Extended: true,
				Layer:[
					{ Name: "StrapsHarness", AllowColorize: true, ParentGroup: null, Priority: 15 , HasType: true},
					{ Name: "ClampsHarness", AllowColorize: true, ParentGroup: null, Priority: 15, HasType: true},
				]
			},
			{ Name: "Corset3", Gender: "F", Fetish: ["Lingerie"], Priority: 22, Value: 25, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset3", Prerequisite: ["AccessTorso", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"], DynamicGroupName: "Corset" },
			{ Name: "Corset4", Fetish: ["Lingerie"], Priority: 22, Value: 15, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset4", Prerequisite: ["AccessTorso"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset" },
			{ Name: "Corset5", Gender: "F", Fetish: ["Lingerie"], Priority: 22, Value: 20, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset5", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset" },
			{ Name: "LeatherBreastBinder", Gender: "F", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 15, BuyGroup: "BreastBinder", RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"] },
			{
				Name: "LatexCorset1", Gender: "F", Fetish: ["Lingerie", "Latex"], Priority: 21, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "LatexCorset1", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset", Extended: true, HasType: false,
				Layer:[
					{ Name: "Base", HasType: false },
					{ Name: "Garter", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				]
			},
			{ Name: "LeatherStrapBra1", Gender: "F", Fetish: ["Leather"], Value: 15, Difficulty: 5, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, Top: 200, BuyGroup: "LeatherStrapBra1", Prerequisite: ["AccessTorso", "HasBreasts"], DrawLocks: false, PoseMapping: { Hogtied: "" } },
			{ Name: "CrotchChain", Gender: "F", Fetish: ["Metal"], Value: 40, Difficulty: 50, Time: 15, BuyGroup: "Chains", RemoveTime: 10, AllowLock: true, Audio: "ChainLong", Effect: ["CrotchRope"], Prerequisite: ["AccessTorso", "HasBreasts"], HideForPose: ["AllFours", "Hogtied"] },
			{
				Name: "StuddedHarness", Gender: "F", Fetish: ["Lingerie", "Leather"], Priority: 20, Value: 100, DefaultColor:"#343131", Difficulty: 30, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"] ,BuyGroup: "StuddedHarness", Expose:["ItemBreast"], Hide: ["ItemNipples","ItemNipplesPiercings"], HideItem: ["PantiesDiapers1","PantiesDiapers2","PantiesDiapers3", "PantiesDiapers4"], AllowPose: ["Hogtied", "AllFours", "Yoked"],
				Layer:[
					{ Name: "Harness", AllowColorize: true},
					{ Name: "Metal", AllowColorize: false}
				],
			},
			{ Name: "HeavyLatexCorset", Gender: "F", Fetish: ["Lingerie", "Latex"], Priority: 22, Value: 60, Difficulty: 10, Time: 20, RemoveTime: 15, BuyGroup: "HeavyLatexCorset", AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], AllowPose: ["OverTheHead"], HideForPose: ["AllFours", "Hogtied"], Extended: true},
			{ Name: "Ribbons", Gender: "F", Fetish: ["Lingerie"], Value: 30, Difficulty: 3, Time: 10, RemoveTime: 5, BuyGroup: "Ribbon", Prerequisite: ["AccessTorso", "HasBreasts"], AllowPose: ["AllFours", "Hogtied"], Extended: true },
			{ Name: "ThinLeatherStraps", Gender: "F", Fetish: ["Leather"], Value: 70, Difficulty: 2, Time: 20, RemoveTime: 20, BuyGroup: "ThinLeatherStraps", Prerequisite: ["AccessTorso", "HasBreasts"], Random: false, AllowLock: true, DrawLocks: false, Extended: true,
				Layer: [
					{ Name: "Strap" },
					{ Name: "Buckle" },
					{ Name: "Locks", LockLayer: true }
				]
			},
			{ Name: "LockingSwimsuit", Gender: "F", Left: 150, Top: 200, Difficulty: 4, BuyGroup: "LockingSwimsuit", Value: 60, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], Extended: true },
			{ Name: "LockingSwimsuit2", Gender: "F", Left: 150, Top: 200, Difficulty: 4, BuyGroup: "LockingSwimsuit2", Value: 70, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"] },
			//Flat Chest Compatible Items
			{ Name: "LeatherChestHarness1", Gender: "M", Prerequisite: ["AccessTorso", "HasFlatChest"], BuyGroup: "LeatherChestHarness1", Value: 30, AllowLock: true, DrawLocks: false,
				Layer: [
					{ Name: "Ring" },
					{ Name: "Straps" }

				]
			},		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemTorso2",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 18,
		Default: false,
		Left: 125,
		Top: 200,
		AllowPose: ["Hogtied", "AllFours"],
		Zone: [[250, 340, 150, 80]],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		DynamicGroupName: "ItemTorso",
		MirrorActivitiesFrom: "ItemTorso",
		Asset: [
			{ Name: "LockingSwimsuit", Gender: "F", Left: 150, Top: 200, Difficulty: 4, BuyGroup: "LockingSwimsuit", Value: 60, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], Extended: true },
			{ Name: "LeatherStrapHarness", Gender: "F", Fetish: ["Leather"], BuyGroup: "LeatherStrapHarness", Value: 50, Difficulty: 50, Time: 15, RemoveTime: 10, DefaultColor: "#101010", AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"], },
			{ Name: "LeatherHarness", Gender: "F", Fetish: ["Leather"], BuyGroup: "LeatherHarness", Value: 60, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"], },
			{ Name: "NylonRopeHarness", Gender: "F", Fetish: ["Rope", "Nylon"], Value: 30, Time: 20, BuyGroup: "NylonRope", CraftGroup: "NylonRope", Audio: "RopeShort", Prerequisite: ["AccessTorso", "HasBreasts"], Extended: true,
				DefaultColor: ["#CCCCCC"],
				Layer: [
					{ Name: "Rope" },
					{ Name: "Shine", AllowColorize: false },
				]
			},
			{ Name: "HempRopeHarness", Gender: "F", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Audio: "RopeShort", Prerequisite: ["AccessTorso", "HasBreasts"], Extended: true },
			{ Name: "AdultBabyHarness", Category: ["ABDL"], Fetish: ["Leather", "ABDL"], BuyGroup: "AdultBabyHarness", Priority: 33, Value: 50, Difficulty: 3, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, DefaultColor: "#aaaaaa", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], DrawLocks: false, Attribute: ["CanAttachMittens"] },
			{ Name: "HarnessBra1", Gender: "F", Fetish: ["Leather"], Priority: 20, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, BuyGroup: "HarnessBra1", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], DrawLocks: false },
			{ Name: "HarnessBra2", Gender: "F", Fetish: ["Leather"], Priority: 20, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, BuyGroup: "HarnessBra2", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset2", Gender: "F", Fetish: ["Lingerie"], Priority: 22, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset2", Prerequisite: ["AccessTorso", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"], DynamicGroupName: "Corset" },
			{ Name: "FuturisticHarness", Gender: "F", Fetish: ["Metal"], Category: ["SciFi"], BuyGroup: "FuturisticHarness", Value: 30, Difficulty: 20, Time: 17, RemoveTime: 12, Audio: "FuturisticApply", DefaultColor: ["#50913C", "Default", "#889FA7"], FuturisticRecolor: true, Effect: [], AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], HideForPose: ["AllFours"], Extended: true,
				Layer:[
					{ Name: "Display", AllowColorize: true, ParentGroup: null, Priority: 15, AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Band", AllowColorize: true, Priority: 15 , AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Mesh", AllowColorize: true, ParentGroup: null, Priority: 15, AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null, AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Display2", AllowColorize: true, CopyLayerColor: "Display", ParentGroup: null, AllowTypes: ["", "Upper"], HasType: false},
					{ Name: "Band2", AllowColorize: true, CopyLayerColor: "Band", AllowTypes: ["", "Upper"], HasType: false},
					{ Name: "Lock2", LockLayer: true, CopyLayerColor: "Lock", ParentGroup: null, AllowTypes: ["", "Upper"], HasType: false},
				]
			},
			{ Name: "HighSecurityHarness", Gender: "F", Fetish: ["Metal"], BuyGroup: "HighSecurityHarness", Value: 50, Difficulty: 50, Time: 20, RemoveTime: 15, DefaultColor: ["#444444", "Default"], Effect: [], AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], HideForPose: ["AllFours"], Extended: true,
				Layer:[
					{ Name: "StrapsHarness", AllowColorize: true, ParentGroup: null, Priority: 15 , HasType: true},
					{ Name: "ClampsHarness", AllowColorize: true, ParentGroup: null, Priority: 15, HasType: true},
				]
			},
			{ Name: "Corset3", Gender: "F", Fetish: ["Lingerie"], Priority: 22, Value: 25, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset3", Prerequisite: ["AccessTorso", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"], DynamicGroupName: "Corset" },
			{ Name: "Corset4", Fetish: ["Lingerie"], Priority: 22, Value: 15, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset4", Prerequisite: ["AccessTorso"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset" },
			{ Name: "Corset5", Gender: "F", Fetish: ["Lingerie"], Priority: 22, Value: 20, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Left: 150, BuyGroup: "Corset5", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset" },
			{
				Name: "LatexCorset1", Gender: "F", Fetish: ["Lingerie", "Latex"], Priority: 21, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "LatexCorset1", Prerequisite: ["AccessTorso", "HasBreasts"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset", Extended: true, HasType: false,
				Layer:[
					{ Name: "Base", HasType: false },
					{ Name: "Garter", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				]
			},
			{ Name: "LeatherBreastBinder", Gender: "F", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 15, BuyGroup: "BreastBinder", RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"] },
			{ Name: "LeatherStrapBra1", Gender: "F", Fetish: ["Leather"], Value: 15, Difficulty: 5, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, Top: 200, BuyGroup: "LeatherStrapBra1", Prerequisite: ["AccessTorso", "HasBreasts"], DrawLocks: false, PoseMapping: { Hogtied: "" } },
			{ Name: "CrotchChain", Gender: "F", Fetish: ["Metal"], Value: 40, Difficulty: 50, Time: 15, BuyGroup: "Chains", RemoveTime: 10, AllowLock: true, Audio: "ChainLong", Effect: ["CrotchRope"], Prerequisite: ["AccessTorso", "HasBreasts"], HideForPose: ["AllFours", "Hogtied"] },
			{
				Name: "StuddedHarness", Gender: "F", Fetish: ["Lingerie", "Leather"], Priority: 20, Value: 100, DefaultColor:"#343131", Difficulty: 30, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"],BuyGroup: "StuddedHarness", Expose:["ItemBreast"], Hide: ["ItemNipples","ItemNipplesPiercings"], HideItem: ["PantiesDiapers1","PantiesDiapers2","PantiesDiapers3", "PantiesDiapers4"], AllowPose: ["Hogtied", "AllFours", "Yoked"],
				Layer:[
					{ Name: "Harness", AllowColorize: true},
					{ Name: "Metal", AllowColorize: false}
				],
			},
			{ Name: "HeavyLatexCorset", Gender: "F", Fetish: ["Lingerie", "Latex"], Priority: 22, Value: 60, Difficulty: 10, Time: 20, RemoveTime: 15, BuyGroup: "HeavyLatexCorset", AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"], AllowPose: ["OverTheHead"], HideForPose: ["AllFours", "Hogtied"], Extended: true },
			{ Name: "Ribbons", Gender: "F", Fetish: ["Lingerie"], Value: 30, Difficulty: 3, Time: 10, RemoveTime: 5, BuyGroup: "Ribbon", Prerequisite: ["AccessTorso", "HasBreasts"], AllowPose: ["AllFours", "Hogtied"], Extended: true },
			{ Name: "ThinLeatherStraps", Gender: "F", Fetish: ["Leather"], Value: 70, Difficulty: 2, Time: 20, RemoveTime: 20, BuyGroup: "ThinLeatherStraps", Prerequisite: ["AccessTorso", "HasBreasts"], Random: false, AllowLock: true, DrawLocks: false, Extended: true,
				Layer: [
					{ Name: "Strap" },
					{ Name: "Buckle" },
					{ Name: "Locks", LockLayer: true }
				]
			},
			{ Name: "LockingSwimsuit2", Gender: "F", Left: 150, Top: 200, Difficulty: 4, BuyGroup: "LockingSwimsuit2", Value: 70, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessTorso", "HasBreasts"] },
			{ Name: "LeatherChestHarness1", Gender: "M", Prerequisite: ["AccessTorso", "HasFlatChest"], BuyGroup: "LeatherChestHarness1", Value: -1, AllowLock: true, DrawLocks: false,
				Layer: [
					{ Name: "Ring" },
					{ Name: "Straps" }

				]
			},
		]
	},

	{
		Group: "ItemNipples",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 22,
		Default: false,
		Left: 150,
		Top: 200,
		AllowPose: ["AllFours"],
		Zone: [[100, 270, 100, 70]],
		Asset: [
			{ Name: "NippleClamp", Fetish: ["Metal", "Masochism"], Value: 25, Time: 10, Prerequisite: ["AccessBreast"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "VibeNippleClamp", Fetish: ["Metal", "Masochism"], Value: 40, Time: 10,Prerequisite: ["AccessBreast"], Effect: ["Egged", "Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "VibratorRemote", Value: 50, Wear: false, BuyGroup: "VibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "ChainClamp", Fetish: ["Metal", "Masochism"], Value: 25, Time: 10, Prerequisite: ["AccessBreast"], Effect: ["Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }], Extended: true,
				Layer: [
					{ Name: "Chain", AllowColorize: true , HasType: false, AllowTypes: [""]},
					{ Name: "Metal", AllowColorize: true , HasType: false},
					{ Name: "Clamp", AllowColorize: true , HasType: false},
					{ Name: "Chain2", CopyLayerColor: "Chain", HasType: false, AllowTypes: ["Chain2"]}
				]
			},
			{ Name: "ScrewClamps", Fetish: ["Metal", "Masochism"], Value: 35, Time: 10, Prerequisite: ["AccessBreast"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChainTassles", Value: 45, Time: 10, Prerequisite: ["AccessBreast"], Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HeartPasties", Value: 20, Time: 10, DefaultColor: "#800000", Prerequisite: ["AccessBreast"], Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "TapedVibeEggs",  Fetish: ["Tape"], Value: 30, Time: 5, Prerequisite: ["AccessBreast"], Effect: ["Egged"], Layer: [
				{ Name: "Egg1", ColorGroup: "Eggs" },
				{ Name: "Egg2", ColorGroup: "Eggs" },
				{ Name: "Tape1", ColorGroup: "Tape" },
				{ Name: "Tape2", ColorGroup: "Tape" }

			] },
			{ Name: "NippleSuctionCups",  Value: 25, Time: 10, Prerequisite: ["AccessBreast"], Hide: ["ItemNipplesPiercings"], Effect: ["Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true, HasType: false },
			{ Name: "NippleTape", Fetish: ["Tape"], Value: 10, Time: 5, CraftGroup: "DuctTape", Prerequisite: ["AccessBreast"], Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChopStickNippleClamps", Fetish: ["Rope", "Masochism"], Value: 25, Time: 10, Prerequisite: ["AccessBreast"], Effect: ["Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "KittyPasties", Value: 20, Time: 10, DefaultColor: "#444444", Prerequisite: ["AccessBreast"], Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "Clothespins", Fetish: ["Masochism"], Value: 15, Time: 10, Prerequisite: ["AccessBreast"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "NippleWeightClamps", Fetish: ["Metal", "Masochism"], Value: 35, Time: 10, Prerequisite: ["AccessBreast"], Effect: ["Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "BellClamps", Fetish: ["Metal", "Masochism"], Value: 20, Time: 10, Prerequisite: ["AccessBreast"], Audio: "BellSmall", Effect: ["Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "LactationPump", Fetish: ["Pet"], Value: 130, Top: 0, Priority: 38, Left: 0, Time: 10, Extended: true, AlwaysExtend: true, HasType: false, DynamicBeforeDraw: true,
				Prerequisite: ["AccessBreast", "CannotBeSuited"],
				AllowPose: ["AllFours", "Kneel", "Hogtied", "KneelingSpread"],
				Block: ["ItemNipplesPiercings", "ItemBreast"],
				Hide: ["ItemNipplesPiercings"],
				ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }],
			},
			{ Name: "ShockClamps", Fetish: ["Metal", "Masochism"], Value: 60, Time: 10, Extended: true, AlwaysExtend: true, Prerequisite: ["AccessBreast"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }], },
			{Name: "PlateClamps", Fetish: ["Metal", "Masochism"], Value: 20, Time: 15, Extended: true, Prerequisite: ["AccessBreast"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }]},
			{
				Name: "StretchClovers", Fetish: ["Metal", "Masochism"], Top: 0, Left: 0, Value: 35, Time: 17, Prerequisite: ["AccessBreast"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], HideForPose: ["AllFours"], Layer: [
					{ Name: "Frame" },
					{ Name: "Clamps" }
				],
			},
			{
				Name: "NippleClamps2", Gender: "M", Prerequisite: ["AccessBreasts", "HasFlatChest"], Fetish: ["Metal", "Masochism"], Value: 20, ParentGroup: null,
				DefaultColor: ["#707070", "#000000"],
				Layer: [
					{ Name: "Metal" },
					{ Name: "RubberTips" }
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNipplesPiercings",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 13,
		Default: false,
		Left: 150,
		Top: 200,
		AllowPose: ["AllFours"],
		Zone: [[200, 270, 100, 70]],
		Asset: [
			{ Name: "StraightPiercing", Fetish: ["Metal"], Value: 10, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "RoundPiercing", Fetish: ["Metal"], Value: 40, Difficulty: 10, Time: 15, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true,
				Layer: [
					{ Name: "Piercings", HasType: false, AllowTypes: ["", "Weighted"] },
					{ Name: "PiercingsChained", HasType: false, AllowTypes: ["Chain", "WeightedChain"], CopyLayerColor: "Piercings" },
					{ Name: "Chain", HasType: false, AllowTypes: ["Chain", "WeightedChain"] },
					{ Name: "Weights", HasType: false, AllowTypes: ["Weighted"] },
					{ Name: "WeightsChained", HasType: false, AllowTypes: ["WeightedChain"], CopyLayerColor: "Weights" }
				]
			},
			{
				Name: "NecklacePiercingChain", Value: 80, Difficulty: 3, Time: 20, AllowLock: true, DrawLocks: false, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], HideForPose: ["AllFours"],
				Layer: [
					{ Name: "Chain" },
					{ Name: "Heart" },
					{ Name: "Piercing" }
				]
			},
			{ Name: "NippleAccessory1", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "NippleAccessory2", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "NippleAccessory3", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "BarbellPiercing", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "NippleChastityPiercing1", Fetish: ["Metal"], Value: 50, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["BreastChaste"], Block: ["ItemNipples"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "NippleChastityPiercing2", Fetish: ["Metal"], Value: 50, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["BreastChaste"], Block: ["ItemNipples"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "VibeHeartPiercings", Gender: "F", Value: 40, Difficulty: 10, Time: 10, AllowLock: true, BuyGroup: "VibeHeart", Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["Egged", "Wiggling"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }],
				Layer: [
					{ Name: "Heart" },
					{ Name: "Ring" }
				]
			},
			{ Name: "BellPiercing", Fetish: ["Metal"], Value: 30, Difficulty: 10, Time: 15, AllowLock: true, Audio: "BellSmall", Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "CrossedStraightPiercing", Fetish: ["Metal"], Value: 10, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemBreast",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 16,
		Default: false,
		Left: 150,
		Top: 200,
		AllowPose: ["AllFours"],
		Zone: [[300, 270, 100, 70]],
		Asset: [
			{ Name: "MetalChastityBra", Gender: "F", Fetish: ["Metal"], Value: 60, Difficulty: 50, Time: 15, AllowLock: true, Audio: "CuffsMetal", Prerequisite: ["AccessBreast", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "PolishedChastityBra", Gender: "F", Fetish: ["Metal"], Value: 100, Difficulty: 50, Time: 15, AllowLock: true, Audio: "CuffsMetal", Prerequisite: ["AccessBreast", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "FuturisticBra", Gender: "F", Category: ["SciFi"], Fetish: ["Metal"], Value: 120,
				BuyGroup: "FuturisticBra", HideForPose: ["AllFours"], Difficulty: 50, Time: 10, Random: false,
				AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "#FFFFFF", "#889FA7", "Default"],
				Audio: "FuturisticApply", Prerequisite: ["AccessBreast", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"],
				FuturisticRecolor: true, Effect: [ "BreastChaste", "UseRemote"], Block: ["ItemNipples", "ItemNipplesPiercings"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				DynamicAfterDraw: true,  DynamicScriptDraw: true, DynamicBeforeDraw: true,
				Layer: [
					{ Name: "Display", AllowColorize: true, HasType: false},
					{ Name: "Lock", LockLayer: true, AllowColorize: true, HasType: false, ParentGroup: null},
					{ Name: "Text" , AllowColorize: true, HasType: false, AllowTypes: ["", "Show2"]},
					{ Name: "Mesh" , AllowColorize: true, HasType: false, AllowTypes: ["", "Solid"]},
					{ Name: "Mesh2", CopyLayerColor: "Mesh", HasType: false, AllowTypes: ["Show2", "Solid2"]},
					{ Name: "Bra" , AllowColorize: true },
				]
			},
			{ Name: "FuturisticBra2", Gender: "F", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, BuyGroup: "FuturisticBra", Difficulty: 50, Time: 10, Random: false, AllowLock: true, DrawLocks: false, HideForPose: ["AllFours"], DefaultColor: ["#50913C", "Default", "#889FA7","Default",  "#404040"],
				Audio: "FuturisticApply", Prerequisite: ["AccessBreast", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], FuturisticRecolor: true, Effect: ["BreastChaste", "UseRemote"], Block: ["ItemNipples", "ItemNipplesPiercings"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				Layer: [
					{ Name: "Display", AllowColorize: true , HasType: false, AllowModuleTypes: ["d0"], ParentGroup: null},
					{ Name: "Bra" , AllowColorize: true, HasType: false},
					{ Name: "Mesh" , AllowColorize: true , HasType: false},
					{ Name: "Shine" , AllowColorize: true, HasType: false, AllowModuleTypes: ["s0"]},
					{ Name: "Straps" , AllowColorize: true , HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null, HasType: false, AllowModuleTypes: ["d0"]},
				]
			},
			{
				Name: "OrnateChastityBra", Gender: "F", Audio: "CuffsMetal", Fetish: ["Metal"], Value: 150, Difficulty: 50, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "HasBreasts"], Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Bra" },
					{ Name: "Gems" }
				]
			},
			{ Name: "Ribbons", Gender: "F", Fetish: ["Lingerie"], Value: 30, Difficulty: 3, Time: 10, RemoveTime: 5, BuyGroup: "Ribbon", Prerequisite: ["AccessBreast", "HasBreasts"], Extended: true },
			{ Name: "LeatherBreastBinder", Gender: "F", Fetish: ["Leather"], Value: 30, Difficulty: 5, Time: 15, BuyGroup: "BreastBinder", RemoveTime: 10, AllowLock: true, Prerequisite: ["AccessTorso", "HasBreasts"] },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemArms",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 31,
		Default: false,
		IsRestraint: true,
		Left: 50,
		Top: 200,
		Zone: [[10, 200, 90, 200], [400, 200, 90, 200]],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		Asset: [
			// Breast Only
			{ Name: "NylonRope", Fetish: ["Rope", "Nylon"], Value: 30, SelfBondage: 2, Time: 15, BuyGroup: "NylonRope", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Audio: "RopeShort", Extended: true, DynamicBeforeDraw: true,
				DefaultColor: "#CCCCCC",
				Layer: [
					{ Name: "Rope" },
					{ Name: "Shine", AllowColorize: false }
				]
			},
			{
				Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, SelfBondage: 2, Time: 20, DefaultColor: "#956B1C", BuyGroup: "HempRope", Audio: "RopeShort", Extended: true, DynamicBeforeDraw: true,
				SetPose: ["BackBoxTie"],
				Effect: ["Block", "Prone"],
				Layer: [
					{ Name: "" },
					{ Name: "Suspension", Top: -687, HasType: false, Priority: 31, ParentGroup: "", AllowTypes: ["SuspensionHogtied", "SuspensionAllFours", "SuspensionKneelingHogtie"] },
					{ Name: "InvertedSuspension", Top: 346, HasType: false, Priority: 6, ParentGroup: "", AllowTypes: ["InvertedSuspensionHogtied", "InvertedSuspensionAllFours"] },
				]
			},
			{
				Name: "MetalCuffs", Fetish: ["Metal"], Priority: 29, Value: 40, Difficulty: 5, Time: 5, Audio: "MetalCuffs", Extended: true, HasType: false,
				SetPose: ["BackCuffs"],
				Effect: ["Lock", "Block", "Prone"],
				AllowPose: ["BackCuffs"],
			},
			{
				Name: "SturdyLeatherBelts", Fetish: ["Leather"], Value: 50, Difficulty: 5, SelfBondage: 4, Time: 20, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone", "NotSelfPickable"], Extended: true, SelfUnlock: false, Audio: "Buckle",
				HideItem: ["ClothBabydollDress1", "ClothAdultBabyDress1", "ClothAdultBabyDress2", "ClothAdultBabyDress3", "ClothAdultBabyDress4", "ClothFlowerDress", "ClothMaidOutfit1", "ClothMaidOutfit2", "ClothRobe1", "ClothGown3", "ClothStudentOutfit1", "ClothStudentOutfit2", "ClothStudentOutfit3", "ClothTeacherOutfit1", ],
				DefaultColor: ["#11161B", "#403E40", "#11161B", "#403E40", "#11161B", "#403E40"],
				Layer: [
					{ Name: "WaistBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["", "Two", "Three"] },
					{ Name: "WaistMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["", "Two", "Three"] },
					{ Name: "UpperTorsoBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["Two", "Three"] },
					{ Name: "UpperTorsoMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["Two", "Three"] },
					{ Name: "LowerTorsoBelt", ColorGroup: "Belts", HasType: false, AllowTypes: ["Three"] },
					{ Name: "LowerTorsoMetal", ColorGroup: "Metal", HasType: false, AllowTypes: ["Three"] },
				],
			},
			{
				Name: "LeatherArmbinder", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 6, Value: 80, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, DefaultColor: "#404040", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands", "ItemHandheld"], Extended: true, SelfUnlock: false, DrawLocks: false,
				Layer: [
					{ Name: "Binder", HasType: false, ParentGroup: null },
					{ Name: "Strap", HasType: false, Priority: 31, ParentGroup: null, AllowTypes: ["Strap"], HideAs: { Group: "ItemHidden", Asset: "LeatherArmbinderStrap" } },
					{ Name: "WrapStrap", CopyLayerColor: "Strap", HasType: false, Priority: 31, ParentGroup: null, AllowTypes: ["WrapStrap"], HideAs: { Group: "ItemHidden", Asset: "LeatherArmbinderWrapStrap" } },
					{ Name: "Lock", LockLayer: true, HasType: false, Priority: 6, ParentGroup: null, AllowColorize: false }
				]
			},
			{
				Name: "ArmbinderJacket", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 33, Value: 100, Difficulty: 12, SelfBondage: 8, DefaultColor: ["#B23E46", "#0A0A0A", "Default"], Time: 35, RemoveTime: 25, AllowLock: true, Hide: ["Cloth", "LeftHand", "RightHand"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"],  HideItem: ["ClothAccessoryStudentOutfit3Scarf", "ClothAccessoryStudentOutfit3Bow1", "ClothAccessoryStudentOutfit3Bow2", "ClothAccessoryStudentOutfit3Bow3", "ClothAccessoryBunnyCollarCuffs"], Block: ["ItemHands", "ItemHandheld"], SelfUnlock: false,
				Alpha: [{Group: ["Cloth", "Necklace", "Suit"], Masks: [[0, 200, 500, 40], [0, 240, 135, 20], [365, 240, 135, 20]]}],
				Layer: [
					{ Name: "Jacket" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{ Name: "LeatherCuffs", Fetish: ["Leather"], Priority: 29, Value: 100, Left: 0, Top: 0, Difficulty: 3, Time: 20, Random: false, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "OverTheHead", "BackCuffs", "Yoked", "Hogtied"], Effect: ["CuffedArms"], Extended: true, HasType: false, Hide: ["Bracelet"], RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }],
				DefaultColor: ["#2E2E2E", "Default"],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Rings" }
				]
			},
			{ Name: "CeilingShackles", Fetish: ["Metal"], Value: 100, Left: 0, Top: 0, Difficulty: 6, Audio: "ChainLong", Time: 20, Random: false, AllowLock: true, AllowPose: ["Suspension"], Effect: ["Block", "Prone", "Freeze", "NotSelfPickable"], SetPose: ["Yoked"], Hide: ["Bracelet"], Extended: true,
				Layer: [
					{ Name: "Chain", Top: -388, Priority: 6 },
					{ Name: "Cuffs" }
				]
			},
			{ Name: "SteelCuffs", Fetish: ["Metal"], Value: 50, Left: 0, Top: 0, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DrawLocks: false, AllowPose: ["OverTheHead", "BackCuffs", "Yoked"], HideForPose: ["BackBoxTie", "BackElbowTouch"], Effect: ["CuffedArms"], Extended: true, HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }] },
			{ Name: "FuturisticCuffs", Gender: "F", Prerequisite: ["HasBreasts"], Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["#40812C", "#707070"], Audio: "FuturisticApply",  Priority: 29, Value: 100, Left: 0, Top: 0, Difficulty: 5, Time: 20, Random: false, AllowLock: true, DrawLocks: false,
				AllowPose: ["BackBoxTie", "BackElbowTouch", "OverTheHead", "BackCuffs", "Yoked"], FuturisticRecolor: true, Effect: [ "CuffedArms"], Extended: true, HasType: false, Hide: ["Bracelet"], RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }],
				Layer: [
					{ Name: "Display", ParentGroup: null },
					{ Name: "Cuffs" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				],
			},
			{
				Name: "OrnateCuffs", Fetish: ["Metal"], Priority: 29, Value: 200, Left: 0, Top: 0, Difficulty: 4, Time: 20, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["BackBoxTie", "BackElbowTouch", "OverTheHead", "BackCuffs", "Yoked", "Hogtied"], Effect: ["CuffedArms"], Extended: true, HasType: false, Hide: ["Bracelet"], RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Gems" },
				],
			},
			{ Name: "MittenChain1", Fetish: ["Metal"], Priority: 33, Value: -1, Difficulty: 5, SelfBondage: 5, Time: 15, Random: false, AllowLock: true, Block: ["ItemHands", "ItemHandheld", "ItemTorso", "ItemTorso2",], SetPose: ["BaseUpper"] },
			{ Name: "FourLimbsShackles", Fetish: ["Metal"], Value: -1, Time: 30, Enable: false, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Lock"], RemoveAtLogin: true},
			{ Name: "Manacles", Fetish: ["Metal"], Value: 120, Difficulty: 16, Audio: "CuffsMetal", SelfBondage: 1, Time: 30, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NotMounted", "NotSuspended", "NotHogtied", "NotKneelingSpread"], SetPose: ["BackBoxTie", "Kneel"], Effect: ["Block", "Freeze", "Prone", "ForceKneel"], Block: ["ItemFeet"], AllowActivityOn: ["ItemFeet"]},
			{ Name: "FullBodyShackles", Fetish: ["Metal"], Value: 150, Difficulty: 18, Random: false, AllowLock: true, Audio: "ChainLong", Prerequisite: ["NoItemFeet", "NotMounted", "NotSuspended", "NotHogtied", "NotKneelingSpread"], AllowPose: ["LegsClosed", "Kneel"], Effect: ["Prone", "Shackled"], Block: ["ItemFeet"], AllowActivityOn: ["ItemFeet"], SetPose: ["BaseUpper"] },
			{
				Name: "WristShackles", Fetish: ["Metal"], Top: 0, Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Audio: "CuffsMetal", Extended: true, ParentGroup: null, HasType: false,
				AllowPose: ["BackCuffs", "OverTheHead"],
				Effect: ["Prone"],
				SetPose: ["BaseUpper"],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Chain" },
				]
			},
			{
				Name: "StraitLeotard", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 120, Priority: 15, Difficulty: 13, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, HasType: false, DefaultColor: "#70C0C0", Hide: ["LeftHand", "RightHand"], HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemNipplesLactationPump"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", ], SelfUnlock: false, Extended: true,
				Layer: [
					{ Name: "Lower" },
					{ Name: "Gloves", Priority: 31 },
					{ Name: "Upper" },
				]
			},
			{
				Name: "FuturisticStraitjacket", Gender: "F", Prerequisite: ["HasBreasts"], Category: ["SciFi"], Fetish: ["Latex"], Value: 100, Priority: 15, Difficulty: 13, SelfBondage: 4, Time: 35, RemoveTime: 15, Audio: "FuturisticApply", AllowLock: true, DrawLocks: false, DefaultColor: ["#528FD1", "#8EADC4", "#A4A4A4", "#93C48C", "Default"],
				Hide: ["ItemVulva"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemHands", "ItemHandheld"],
				HideItem: ["ItemButtAnalBeads2"],
				SetPose: ["BackElbowTouch"], FuturisticRecolor: true, Effect: [ "Block", "Prone"], SelfUnlock: false, Extended: true,
				Layer: [
					{ Name: "Lower", AllowColorize: true , HasType: false},
					{ Name: "Mesh", AllowColorize: true , HasType: false},
					{ Name: "Sides", AllowColorize: true, HasType: false},
					{ Name: "Display", AllowColorize: true, HasType: false, ParentGroup: null},
					{ Name: "Band", AllowColorize: true, HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
					{ Name: "GlovesBack", CopyLayerColor: "Lower", HasType: false, Priority: 14, AllowModuleTypes: ["a1"]},
					{ Name: "Gloves", CopyLayerColor: "Lower", HasType: false, Priority: 31, AllowModuleTypes: ["a0"]},
				]
			},
			{ Name: "StraitJacket", Gender: "F", Prerequisite: ["HasBreasts"], Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#A0A0A0", Hide: ["Cloth", "ItemNipplesPiercings"], HideItemAttribute: ["Skirt"], HideItem: ["ItemNipplesLactationPump"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"], Extended: true, SelfUnlock: false, HasType: false },
			{ Name: "CollarCuffs", Fetish: ["Leather"], Value: 60, Difficulty: 6, SelfBondage: 3, Time: 35, RemoveTime: 20, Visible: false, Random: false, AllowLock: true, Prerequisite: ["Collared"], SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Block: ["ItemHands", "ItemNeck"], Extended: true, SelfUnlock: false },
			{ Name: "LeatherStraitJacket", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: 200, Difficulty: 7, SelfBondage: 8, Time: 45, RemoveTime: 30, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItemAttribute: ["Skirt"], HideItem: ["ItemNipplesLactationPump", "ClothAccessoryPoncho"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"], Extended: true, SelfUnlock: false },
			{ Name: "FurStraitJacket", Value: 150, Difficulty: 6, SelfBondage: 7, Time: 45, RemoveTime: 30, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItemAttribute: ["Skirt"], HideItem: ["ItemNipplesLactationPump", "ClothAccessoryPoncho"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"], DrawLocks: false, SelfUnlock: false, ParentGroup: null },
			{
				Name: "Bolero", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Priority: 33, Value: 100, Difficulty: 11, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: ["#E080A0", "Default"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], HideItem: ["ClothAccessoryStudentOutfit3Scarf", "ClothAccessoryStudentOutfit3Bow1", "ClothAccessoryStudentOutfit3Bow2", "ClothAccessoryStudentOutfit3Bow3", "ClothAccessoryBunnyCollarCuffs"], Block: ["ItemHands", "ItemHandheld"],
				Alpha: [{ Group: ["Cloth", "Necklace", "Suit"], Masks: [[270, 190, 480, 60], [230, 190, -480, 60], [0, 250, 182, 100], [318, 250, 182, 100]] }],
				Layer: [
					{ Name: "Leather" },
					{ Name: "Belts" }
				],
				SelfUnlock: false
			},
			{ Name: "DuctTape", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Tape"], Value: 50, Difficulty: 5, SelfBondage: 4, Time: 20, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTapeRoll", HideItem: ["ItemNipplesLactationPump"], AllowPose: ["KneelingSpread"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Extended: true },
			{
				Name: "BitchSuit", Gender: "F", Fetish: ["Latex", "Pet"], Priority: 21, Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, Top: 150,
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel", "HasBreasts"],
				AllowPose: ["BackElbowTouch", "Kneel", "AllFours"],
				AllowActivePose: ["BackElbowTouch", "Kneel", "AllFours"],
				SetPose: ["BackElbowTouch", "Kneel"],
				Effect: ["Block", "Prone", "ForceKneel", "Slow"],
				Hide: ["Cloth", "ClothLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "Corset", "Gloves", "Hands", "LeftHand", "RightHand", "ItemHandheld", "ItemHands", "Garters"],
				HideItem: ["ItemNipplesLactationPump", "ClothAccessoryPoncho", "NecklaceBodyChainNecklace", "SuitBlouse1", "BraLatexBunnySuit", "BraHeartTop", "BraCamisole", "BraStuddedHarness", "PantiesBikini1", "PantiesHarnessPanties2", "SocksSocks6", "SocksSocksFur"],
				HideItemExclude: ["GartersDropBag"],
				AllowActivityOn: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"],
				Extended: true,
				DrawLocks: false,
				Alpha: [{Group: ["BodyLower"], Pose: ["Kneel"], Masks: [[140, 462, 75, 238], [285, 462, 75, 238], [215 ,545, 70, 155]]}],
				HasType: false,
				DefaultColor: ["#888888", "Default", "Default", "#9F7316", "Default"],
				Layer: [
					{ Name: "Latex", },
					{ Name: "Latex_Closed", AllowTypes: [""], CopyLayerColor: "Latex", },
					{ Name: "Zips", AllowTypes: [""], },
					{ Name: "Latex_Open", AllowTypes: ["z1"], CopyLayerColor: "Latex", },
					{ Name: "Zips_Open", AllowTypes: ["z1"], CopyLayerColor: "Zips", },
					{ Name: "Straps", },
					{ Name: "Buckles", },
					{ Name: "Lock", ParentGroup: null, LockLayer: true },
				],
				SelfUnlock: false
			},
			{
				Name: "StraitDress", Gender: "F", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "StraitDress", DefaultColor: ["#4040C0", "Default"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "HasBreasts"],
				Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit", "SuitLower", "Garters"],
				HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemNipplesLactationPump", "ItemFeetChains", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "NecklaceBodyChainNecklace"],
				AllowPose: ["Kneel"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Slow"],
				Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"],
				AllowActivePose: ["Kneel"],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" }
				],
				SelfUnlock: false
			},
			{
				Name: "StraitDressOpen", Gender: "F", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "StraitDress", DefaultColor: ["#400000", "Default"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "HasBreasts"],
				Hide: ["Cloth", "Shoes", "Socks", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "Suit", "LeftAnklet", "RightAnklet", "Garters"],
				HideItem: ["NecklaceBodyChainNecklace"],
				AllowPose: ["Kneel"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Slow"],
				Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"],
				AllowActivePose: ["Kneel"],
				Alpha: [
					{
						Group: ["BodyLower", "ClothLower", "ItemLegs", "ItemFeet", "SuitLower", "Bra", "Panties", "Corset", "ItemTorso", "ItemTorso2",],
						Masks: [[0, 220, 500, 242], [0, 462, 210, 120], [290, 462, 210, 120], [0, 582, 500, 418]]
					}
				],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" }
				],
				SelfUnlock: false
			},
			{ Name: "SeamlessStraitDress", Gender: "F", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "SeamlessStraitDress", DefaultColor: "#4040C0", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "HasBreasts"], Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit", "SuitLower", "Corset", "Garters"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "NecklaceBodyChainNecklace"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"], Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], AllowActivePose: ["Kneel"], SelfUnlock: false },
			{ Name: "SeamlessStraitDressOpen", Gender: "F", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "SeamlessStraitDress", DefaultColor: "#400000",
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "HasBreasts"],
				Hide: ["Cloth", "Shoes", "Socks", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "Suit", "LeftAnklet", "RightAnklet", "Garters"],
				HideItem: ["NecklaceBodyChainNecklace"],
				AllowPose: ["Kneel"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Slow"],
				Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"],
				AllowActivePose: ["Kneel"], SelfUnlock: false,
				Alpha: [
					{
						Group: ["BodyLower", "ClothLower", "ItemLegs", "ItemFeet", "SuitLower", "Bra", "Panties", "Corset", "ItemTorso", "ItemTorso2",],
						Masks: [[0, 220, 500, 242], [0, 462, 210, 120], [290, 462, 210, 120], [0, 582, 500, 418]]
					}
				],
			},
			{
				Name: "Yoke", Fetish: ["Metal", "Leather"], Priority: 39, Value: 80, Difficulty: 10, SelfBondage: 6, Time: 20, AllowLock: true, HideItem: ["BraceletSpikeBands"], ParentGroup: null,
				SetPose: ["Yoked"],
				Effect: ["Block", "Prone", "NotSelfPickable"],
				Layer: [
					{ Name: "Straps" },
					{ Name: "Bars" },
				]
			},
			{
				Name: "Pillory", Gender: "F", Fetish: ["Metal"], Priority: 46, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 20, Random: false, AllowLock: true, ParentGroup: null, Bonus: "KidnapDomination",
				Prerequisite: ["NotMasked", "HasBreasts"],
				SetPose: ["Yoked"],
				Effect: ["Block", "Prone", "NotSelfPickable"],
				Layer: [
					{ Name: "Wood" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "FullLatexSuit", Gender: "F", Fetish: ["Leather", "Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888",
				Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "CannotBeSuited", "HasBreasts"],
				Hide: ["Socks", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "Suit", "SuitLower", "Corset", "Panties", "Garters"],
				HideItem: ["ItemNipplesLactationPump"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Freeze", "BlockKneel", "Slow"],
				Block: ["ItemBoots", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemHands", "ItemHandheld", "ItemLegs", "ItemFeet"],
				Extended: true,
				Layer: [
					{
						Name: "Latex", AllowTypes: ["", "Base"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
					{
						Name: "UnZip", CopyLayerColor: "Latex", AllowTypes: ["UnZip", "Base"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
					{ Name: "Base", AllowTypes: ["", "Base", "UnZip", "Latex"], HasType: false }
				],
				RemoveItemOnRemove: [{ Name: "FullLatexSuitWand", Group: "ItemVulva" }],
			},
			{ Name: "Zipties", Gender: "F", Prerequisite: ["HasBreasts"], Value: 20, Difficulty: 6, SelfBondage: 1, RemoveTime: 6, BuyGroup: "Zipties", Audio: "ZipTie", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Extended: true },
			{
				Name: "BoxTieArmbinder", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], DefaultColor: ["#222222", "#ffffff"], Value: 140, Difficulty: 11, SelfBondage: 7, Time: 40, RemoveTime: 30, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], HideItem: ["ClothAccessoryStudentOutfit3Scarf", "ClothAccessoryStudentOutfit3Bow1", "ClothAccessoryStudentOutfit3Bow2", "ClothAccessoryStudentOutfit3Bow3", "ClothAccessoryBunnyCollarCuffs", "ClothAccessoryPoncho"], Block: ["ItemHands", "ItemHandheld"], SelfUnlock: false,
				Alpha: [{Group: ["Cloth", "Necklace", "Suit"], Masks: [[0, 190, 500, 60], [0, 250, 175, 90], [325, 250, 175, 90]]},],
				Layer: [
					{ Name: "Base" },
					{ Name: "Shine" }
				]
			},
			{
				Name: "BondageBouquet", Fetish: ["Metal"], Priority: 47, Value: 40, Difficulty: 3, Time: 15, Random: false, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "Bouquet", Effect: ["Prone"], SetPose: ["BaseUpper"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Flowers" }
				]
			},
			{
				Name: "Chains", Fetish: ["Metal"], Value: 90, Difficulty: 5, SelfBondage: 3, Time: 30, AllowLock: true, BuyGroup: "Chains", Audio: "ChainLong", Extended: true,
				SetPose: ["BackBoxTie"],
				Effect: ["Block", "Prone"],
				Layer: [
					{ Name: "" },
					{ Name: "Suspension", Top: -687, Left: 0, HasType: false, Priority: 31, ParentGroup: "", AllowTypes: ["SuspensionHogtied"], AllowPose: [] },
				]
			},
			{
				Name: "PetCrawler", Gender: "F", Priority: 36, Value: 80, Difficulty: 10, SelfBondage: 7, Time: 20, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NoItemLegs", "LegsOpen", "NotMounted", "NotHorse", "NotSuspended", "NotYoked", "NotKneelingSpread", "NoFeetSpreader", "HasBreasts"], Hide: ["ItemBoots", "Suit", "Panties", "Bra"],
				HideItem: ["ItemButtRaccoonTailPlug", "TailStrapsRaccoonTailStrap", "ItemButtKittenTail1", "ItemNipplesPiercingsNippleChastityPiercing2", "ItemTorsoAdultBabyHarness", "ItemTorsoCorset2", "ItemTorsoCorset3", "ItemNipplesPiercingsNippleChastityPiercing1", "ItemNipplesChainTassles", "ItemNipplesHeartPasties", "ItemNipplesNippleTape", "ItemNipplesKittyPasties", "LeftHandRings", "RightHandRings"],
				SetPose: ["AllFours"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemLegs", "ItemFeet", "ItemDevices"],
				AllowActivityOn: ["ItemLegs", "ItemFeet"]
			},
			{
				Name: "MermaidSuit", Gender: "F", Fetish: ["Latex", "Pet"], Value: 200, Difficulty: 15, SelfBondage: 6, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#400000", Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "CannotBeSuited", "HasBreasts"],
				Hide: ["Socks", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemLegs", "Suit", "SuitLower", "ItemPelvis", "ItemFeet", "Panties", "Corset", "Garters"],
				HideItem: ["ItemNipplesLactationPump", "ClothAccessoryPoncho"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Freeze", "BlockKneel"],
				Block: ["ItemBoots", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemHands", "ItemHandheld", "ItemLegs", "ItemFeet"],
				Extended: true,
				Layer: [
					{
						Name: "Latex", AllowTypes: [""], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
					{
						Name: "UnZip", CopyLayerColor: "Latex", AllowTypes: ["UnZip"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
				],
			},
			{
				Name: "Web", Gender: "F", Category: ["Fantasy"], Fetish: ["Tape"], Priority: 35, Value: 150, Difficulty: 4, SelfBondage: 2, Time: 20, RemoveTime: 30, Random: false, Left: 0, Top: 0,
				Prerequisite: ["NotKneelingSpread", "NotMounted", "HasBreasts"],
				Hide: ["Cloth", "ClothLower", "Shoes"],
				HideItem: ["ItemNipplesLactationPump", "ClothAccessoryPoncho"],
				AllowPose: ["Kneel", "Hogtied", "Suspension"],
				SetPose: ["LegsOpen", "BackElbowTouch"],
				Effect: ["Block", "Freeze", "Prone"],
				Block: ["ItemTorso", "ItemTorso2", "ItemHands", "ItemHandheld", "ItemLegs", "ItemFeet", "ItemBoots"],
				Extended: true,
			},
			{
				Name: "LatexArmbinder", Fetish: ["Latex"], Priority: 6, Value: 60, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands", "ItemHandheld"], SelfUnlock: false,
				Layer: [
					{ Name: "Latex" },
					{ Name: "Strap1", ColorGroup: "BottomStrap" },
					{ Name: "Strap2", ColorGroup: "TopStrap" },
					{ Name: "Hole2", ColorGroup: "TopStrap" },
					{ Name: "Buckle2", ColorGroup: "TopStrap" },
					{ Name: "Buckle1" ,ColorGroup: "BottomStrap" },
					{ Name: "Hole1", ColorGroup: "BottomStrap" },
					{ Name: "Laces"}
				]
			},
			{
				Name: "FuturisticArmbinder", Gender: "F", Prerequisite: ["HasBreasts"], Category: ["SciFi"], Fetish: ["Metal"], Random: false, Priority: 31, Value: 80, Difficulty: 10, Left: 0, Top: 0, SelfBondage: 6, Time: 20, RemoveTime: 15, Audio: "FuturisticApply", AllowLock: true, DrawLocks: false,
				DefaultColor: ["#40812C", "#555555", "#777777", "Default",], SetPose: ["BackElbowTouch"], FuturisticRecolor: true,
				Effect: [ "Block", "Prone"], Block: ["ItemHands", "ItemHandheld"], SelfUnlock: false, Extended: true,
				Layer: [
					{ Name: "Display" , ParentGroup: null, HasType: false, Priority: 31, Left: 0, Top: 0 },
					{ Name: "Binder" , ParentGroup: null, AllowTypes: [""], Priority: 6, Left: 50, Top: 200 },
					{ Name: "Band" , ParentGroup: null, AllowTypes: [""], Priority: 6, Left: 50, Top: 200 },
					{ Name: "Straps", Priority: 31, HasType: false,  Left: 0, Top: 0,  },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, Priority: 31, ParentGroup: null},
				]
			},
			{ Name: "SeamlessLatexArmbinder", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Priority: 6, Value: 60, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false },
			{
				Name: "FullBodyLeatherHarness", Gender: "F", Fetish: ["Leather"], Priority: 29, Value: 60, Difficulty: 14, SelfBondage: 6, Time: 20, RemoveTime: 15, AllowLock: true, SetPose: ["BackElbowTouch", "LegsClosed"], AllowPose: ["Kneel"], Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "HasBreasts"], Effect: ["Block", "Prone", "Slow"], SelfUnlock: false,
				HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerGown2Skirt", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt", "ClothLowerPajama1", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu"], AllowActivePose: ["Kneel"]
			},
			{ Name: "UnderBedBondageCuffs", Gender: "F", Fetish: ["Leather"], Value: -1, Difficulty: 9, SelfBondage: 3, Random: false, IsRestraint: true, SetPose: ["Yoked", "LegsOpen"], Prerequisite: ["OnBed", "LegsOpen", "HasBreasts"], Effect: ["Block", "Prone", "Freeze", "BlockKneel"], Block: ["ItemDevices", "ItemLegs", "ItemFeet", "ItemBoots"], AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"], AllowLock: true, BuyGroup: "Bed", Left: 0, Top: -250 },
			{
				Name: "TightJacket", Gender: "F", Fetish: ["Leather"], DefaultColor: "#FFFFFF", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, BuyGroup: "TightJacket", SelfUnlock: false, Extended: true,
				Hide: ["Cloth", "ItemNipplesPiercings"],
				Prerequisite: ["HasBreasts"],
				HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothLowerTutu", "ClothAccessoryPoncho"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"],
			},
			{ Name: "LatexSleevelessLeotard", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 120, Priority: 23, Difficulty: 14, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#d986a2", BuyGroup: "LatexSleevelessLeotard", Extended: true, SelfUnlock: false,
				Hide: ["Cloth", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"],
				HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ClothAccessoryPoncho", "NecklaceBodyChainNecklace"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"],
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Polished"], HasType: false },
					{ Name: "Highlights", AllowColorize: false, AllowTypes: ["", "Polished"] }
				]
			},
			{
				Name: "LatexBoxtieLeotard", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 120, Priority: 23, Difficulty: 14, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#185d97", BuyGroup: "LatexSleevelessLeotard", Extended: true, SelfUnlock: false,
				Hide: ["Cloth", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"],
				HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ClothAccessoryPoncho", "NecklaceBodyChainNecklace"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"],
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Polished"], HasType: false },
					{ Name: "Highlights", AllowColorize: false, AllowTypes: ["", "Polished"] }
				]
			},
			{
				Name: "LatexButterflyLeotard", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Latex"], Value: 150, Priority: 23, Difficulty: 14, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#580505", Extended: true, SelfUnlock: false,
				Hide: ["Cloth", "Bra", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"],
				HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"],
				HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "NecklaceBodyChainNecklace"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"],
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Polished"], HasType: false },
					{ Name: "Highlights", AllowColorize: false, AllowTypes: ["", "Polished"] }
				]
			},
			{
				Name: "PrisonLockdownSuit", Gender: "F", Value: 125, Difficulty: 7, SelfBondage: 7, Time: 50, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "PrisonLockdownSuit", DefaultColor: ["#ab5207", "Default"],
				Hide: ["BodyUpper", "BodyLower", "Cloth", "ClothLower", "Shoes", "Socks", "ItemLegs", "ItemFeet", "ItemPelvis", "ItemBoots", "SuitLower", "Panties", "ItemVulva", "ItemVulvaPiercings", "Garters"],
				HideItem: ["ItemButtAnalBeads2", "ClothAccessoryPoncho"], SetPose: ["LegsClosed", "BackElbowTouch"], Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "HasBreasts"],
				Effect: ["Block", "Prone", "Slow", "BlockKneel"], Block: ["ItemBreast", "ItemNipplesPiercings", "ItemNipples", "ItemTorso", "ItemTorso2", "ItemPelvis", "ItemHands", "ItemHandheld", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemLegs", "ItemFeet", "ItemBoots"], Extended: true, SelfUnlock: false,
				Layer: [
					// Suits
					{ Name: "Suit", AllowModuleTypes: ["r0"], HasType: false },
					{ Name: "Ankles_Suit", AllowModuleTypes: ["r1"], CopyLayerColor: "Suit", HasType: false },
					{ Name: "Thighs_Suit", AllowModuleTypes: ["r2"], CopyLayerColor: "Suit", HasType: false },
					{ Name: "Full_Suit", AllowModuleTypes: ["r3"], CopyLayerColor: "Suit", HasType: false },
					// Belts
					{ Name: "Belts", AllowModuleTypes: ["r0"], HasType: false },
					{ Name: "Ankles_Belts", AllowModuleTypes: ["r1"], CopyLayerColor: "Belts", HasType: false },
					{ Name: "Thighs_Belts", AllowModuleTypes: ["r2"], CopyLayerColor: "Belts", HasType: false },
					{ Name: "Full_Belts", AllowModuleTypes: ["r3"], CopyLayerColor: "Belts", HasType: false },
				],
				Alpha: [{ Group: ["ItemNeck"], Masks: [[0, 213, 500, 60]] }]
			},
			{ Name: "LeatherArmSplints", Gender: "F", Prerequisite: ["HasBreasts"], Value: 65, Fetish: ["Leather"], Difficulty: 7, SelfBondage: 7, Time: 15, RemoveTime: 10, Visible: false, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false },
			{
				Name: "TightJacketCrotch", Gender: "F", Prerequisite: ["HasBreasts"],  Fetish: ["Leather"], DefaultColor: "#FFFFFF", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, BuyGroup: "TightJacket", SelfUnlock: false, Extended: true,
				Hide: ["Cloth", "ItemNipplesPiercings"],
				HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerTutu", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt", "ClothAccessoryPoncho"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemVulva", "ItemButt", "ItemVulvaPiercings"],
			},
			{ Name: "HighSecurityStraitJacket", Gender: "F", Prerequisite: ["HasBreasts"], Value: 220, Priority: 25, Difficulty: 4, SelfBondage: 2, Time: 45, RemoveTime: 30, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#333", "#333", "#3e3e3e", "#3e3e3e"],
				Hide: ["Cloth", "ItemNipplesPiercings"],
				HideItem: ["NecklaceBodyChainNecklace"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld"],
				Extended: true,
				Layer: [
					{ Name: "Crotch", ColorGroup: "Canvas", ParentGroup: null, AllowModuleTypes: ["c1"], HasType: false },
					{ Name: "JacketLoose", ColorGroup: "Canvas", ParentGroup: null, AllowModuleTypes: ["a0"], HasType: false},
					{ Name: "JacketFront", CopyLayerColor: "JacketLoose", AllowModuleTypes: ["a1"], HasType: false },
					{ Name: "JacketBack", CopyLayerColor: "JacketLoose", AllowModuleTypes: ["a2"], HasType: false },
					{ Name: "StrapsLoose", ColorGroup: "Straps", AllowModuleTypes: ["a0"], HasType: false},
					{ Name: "StrapsFront", CopyLayerColor: "StrapsLoose", AllowModuleTypes: ["a1"], HasType: false },
					{ Name: "StrapsBack", CopyLayerColor: "StrapsLoose", AllowModuleTypes: ["a2"], HasType: false },
					{ Name: "CrotchStrapsSingle", ColorGroup: "Straps", ParentGroup: null, AllowModuleTypes: ["s1"], HasType: false },
					{ Name: "CrotchStrapsDouble", CopyLayerColor: "CrotchStrapsSingle", ParentGroup: null, AllowModuleTypes: ["s2"], HasType: false },
					{ Name: "CrotchStrapsTriple", CopyLayerColor: "CrotchStrapsSingle", ParentGroup: null, AllowModuleTypes: ["s3"], HasType: false },
					{ Name: "Lock", AllowColorize: false, ParentGroup: null, AllowModuleTypes: ["s1", "s2", "s3", "a2"], LockLayer: true }
				],
				SelfUnlock: false
			},
			{ Name: "PantyhoseBody", Gender: "F", Fetish: ["Nylon"], Value: 75, Priority: 15, Difficulty: 3, SelfBondage: 4, Time: 30, RemoveTime: 20, Random: false, BuyGroup: "PantyhoseBody", AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"],
				Prerequisite: ["NotHogtied", "NotMounted", "NoFeetSpreader", "HasBreasts"], Hide: ["Cloth", "ClothLower", "Suit", "SuitLower", "Garters"],
				Block: ["ItemHands", "ItemHandheld", "ItemVulva", "ItemButt", "ItemVulvaPiercings", "ItemNipplesPiercings"], AllowActivePose: ["Kneel"], Audio: "ClothSlip" },
			{ Name: "PantyhoseBodyOpen", Gender: "F", Fetish: ["Nylon"], Value: 75, Priority: 15, Difficulty: 3, SelfBondage: 4, Time: 30, RemoveTime: 20, Random: false, BuyGroup: "PantyhoseBody", AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"],
				Prerequisite: ["NotHogtied", "NotMounted", "NoFeetSpreader", "HasBreasts"], Hide: ["Cloth", "ClothLower", "Suit", "SuitLower", "Garters"], Block: ["ItemHands", "ItemHandheld",  "ItemNipplesPiercings"], AllowActivePose: ["Kneel"], Audio: "ClothSlip" },
			{
				Name: "WoodenCuffs", Gender: "F", Prerequisite: ["HasBreasts"], Value: 30, Top: 0 ,Left: 0, Difficulty: 2, Time: 5, Random: false, AllowLock: true, Audio: "WoodenCuffs", BuyGroup: "WoodenCuffs", Effect: ["Block", "Prone"], AllowPose: ["Yoked", "BackCuffs","Hogtied"], HideItem: ["ClothFurCoat"], Extended: true, HasType: false,
				Layer:[
					{ Name: "Main", Priority: 50, HasType: false, AllowColorize: true },
					{ Name: "Bgnd", Priority: 1, HasType: false, CopyLayerColor: "Main", AllowTypes: ["Hogtied"] },
				]
			},
			{
				Name: "InflatableStraightLeotard", Gender: "F", ParentGroup: null, Fetish: ["Latex"], Value: 150, Top: 137 ,Left: 3, Difficulty: 10, SelfBondage: 6, Time: 30, RemoveTime: 50, AllowLock: true, Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "HasBreasts"],
				Hide: ["Cloth", "Suit", "ClothLower", "ClothAccessory", "ItemButt", "TailStraps", "Wings", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2",],
				HideItem: ["ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemBreast", "ItemButt", "ItemHands", "ItemHandheld", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"], SelfUnlock: false, Extended:true
			},
			{ Name: "StrictLeatherPetCrawler", Gender: "F", ParentGroup: null, Fetish: ["Leather", "Pet"], Value: 150, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DrawLocks: false,
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NoFeetSpreader", "CanKneel", "HasBreasts"],
				Hide: ["Cloth", "ClothLower","Shoes", "ItemBoots", "ItemLegs", "ItemFeet"],
				HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "GartersTentacles", "ClothAccessoryPoncho"],
				AllowPose: ["BackElbowTouch", "Kneel", "KneelingSpread", "AllFours"],
				AllowActivePose: ["BackElbowTouch", "Kneel", "KneelingSpread", "AllFours"],
				SetPose: ["BackElbowTouch", "Kneel"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemHands", "ItemHandheld"],
				SelfUnlock: false,
				DefaultColor: ["#888888", "Default"],
				Layer:[
					{ Name: "Arms", AllowPose: ["BackElbowTouch", "AllFours"], AllowColorize: true, ParentGroup: "BodyUpper", },
					{ Name: "Legs", AllowPose: ["Kneel", "KneelingSpread"], HideForPose: ["AllFours"], CopyLayerColor: "Arms", ParentGroup: "BodyLower", },
					{ Name: "ArmsLock", AllowPose: ["BackElbowTouch", "AllFours"], AllowColorize: true, HideColoring: true, LockLayer: true, },
					{ Name: "LegsLock", AllowPose: ["Kneel", "KneelingSpread"], HideForPose: ["AllFours"], CopyLayerColor: "ArmsLock", LockLayer: true, ParentGroup: null, }
				]
			},
			{
				Name: "MedicalBedRestraints", Gender: "F", Value: -1, Priority: 39, Difficulty: 5, Time: 5, RemoveTime: 5, Random: false, DefaultColor: "#ccc", AllowLock: true, Left: 0, BuyGroup: "MedicalBedRestraints",
				Prerequisite: ["OnBed", "HasBreasts"], SetPose: ["Yoked"], Effect: ["Block", "Prone"], Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemDevices"], AvailableLocations: ["Asylum"], Hide: ["Cloth", "ClothLower", "ItemVulva", "ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2"],
				HideItemExclude: ["ClothBondageBustier1", "ClothBondageBustier2", "ClothLowerLatexSkirt1", "ClothCorsetShirt", "ClothGown2Top", "ClothLeatherBolero", "ClothLeatherCorsetTop1", "CorsetLeatherCorsetTop1", "ClothLeatherCropTop", "ClothMistressTop", "ClothReverseBunnySuit", "ClothShoulderlessTop", "ClothComfyTop", "ClothSleevelessTop", "ClothStudentOutfit3", "ClothSuspenderTop1", "ClothSweater1", "ClothTShirt1", "ClothTennisShirt1", "ClothBodyTowel1", "ClothVirginKiller1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ClothLowerMistressBottom", "ItemVulvaLoversVibrator", "ItemVulvaFuturisticVibrator", "ItemVulvaTapeStrips", "ItemVulvaVibratingLatexPanties"],
				Layer: [
					{ Name: "Base", Priority: 2, ParentGroup: null },
					{ Name: "Straps"}
				],
			},
			{
				Name: "TransportJacket", Gender: "F", Value: 100, Difficulty: 7, Time: 25, RemoveTime: 15,
				AllowLock: true, DrawLocks: false, Left: 100, AllowPose: ["Kneel", "LegsClosed", "KneelingSpread", "Spread"],
				SetPose: ["BackElbowTouch"], Extended: true, DynamicAfterDraw: true,
				DefaultColor: ["#888", "#801612", "#888", "#eee", "#801612", "#888"],
				Prerequisite: ["HasBreasts"],
				Effect: ["Block", "Prone"],
				Hide: ["Cloth", "ClothLower", "ItemNipplesPiercings"],
				HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothAccessoryPoncho"],
				HideItemExclude: ["ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerJeansShorts", "ClothLowerLatexPants1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ClothLowerMistressBottom"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemPelvis"],
				TextMaxLength: { Text: 14 },
				TextFont: "'Saira Stencil One', 'Arial', sans-serif",
				Layer: [
					{ Name: "Shorts", ColorGroup: "Canvas", ParentGroup: "BodyLower", AllowTypes: ["Shorts", "ShortsAndStraps"], HasType: false, HideForPose: ["KneelingSpread", "Spread"] },
					{ Name: "StripesLegs", ColorGroup: "Stripes", ParentGroup: null, AllowTypes: ["Shorts", "ShortsAndStraps"], HasType: false, HideForPose: ["KneelingSpread", "Spread"] },
					{ Name: "Jacket", ColorGroup: "Canvas", ParentGroup: null, HasType: false, AllowPose: [] },
					{ Name: "Text", HasImage: false },
					{ Name: "Stripes", ColorGroup: "Stripes", ParentGroup: null, HasType: false, AllowPose: [] },
					{ Name: "CrotchStraps", CopyLayerColor: "Straps", ParentGroup: null, HasType: false, AllowPose: ["KneelingSpread", "Spread"], HideForPose: ["KneelingSpread", "Spread"] },
					{ Name: "Straps", ParentGroup: null, HasType: false, AllowPose: [] },
					{ Name: "StrapsLegs", CopyLayerColor: "Straps", ParentGroup: "BodyLower", AllowTypes: ["ShortsAndStraps"], HasType: false, HideForPose: ["KneelingSpread", "Spread"] },
				],
			},
			{ Name: "PlasticWrap", Gender: "F", Prerequisite: ["HasBreasts"], Value: 100, Difficulty: 7, SelfBondage: 3, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", SetPose: ["BackElbowTouch", "LegsClosed"], Block:["ItemBreast","ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2",], Hide: ["Cloth", "ClothAccessory"], HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], Effect: ["Block", "Prone"]},
			{ Name: "WrappedBlanket", Gender: "F", Extended: true, Value: -1, Difficulty: 15, SelfBondage: 3, Time: 40, RemoveTime: 30, Random: false, BuyGroup: "Bed", Prerequisite: ["NotSuspended", "NotHogtied", "NotKneelingSpread", "NoFeetSpreader", "HasBreasts"], Hide: ["Shoes", "Socks", "Cloth", "ClothLower", "Bra", "ItemNipplesPiercings", "ItemLegs", "Garters"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetLeatherAnkleCuffs", "ItemNipplesLactationPump", "PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone"], Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemHands", "ItemHandheld", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], },
			{ Name: "Ribbons", Gender: "F", Prerequisite: ["HasBreasts"], Priority: 29, Fetish: ["Lingerie"], Value: 30, Difficulty: 2, SelfBondage: 2, Time: 20, RemoveTime: 20, BuyGroup: "Ribbon", Random: false, SetPose: ["BackBoxTie"], Extended: true, Effect: ["Block", "Prone"] },
			{ Name: "ThinLeatherStraps", Fetish: ["Leather"], Value: 70, Difficulty: 2, SelfBondage: 2, Time: 20, RemoveTime: 20, BuyGroup: "ThinLeatherStraps", SetPose: ["BackBoxTie"], AllowLock: true, DrawLocks: false, Extended: true, Effect: ["Block", "Prone"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Buckle" },
					{ Name: "Locks", LockLayer: true, HideForPose: ["Hogtied"] }
				]
			},
			{
				Name: "Tentacles", Gender: "F", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Difficulty: 8, Time: 25, RemoveTime: 25, Top: -135, Left: 0, Extended: true,
				SetPose: ["BackElbowTouch"],
				Prerequisite: ["HasBreasts"],
				AllowPose: ["OverTheHead"],
				HideForPose: ["Hogtied", "AllFours"],
				Effect: ["Block", "Prone"],
				DefaultColor: ["#c43ba4", "#b832b6", "#9221ba"],
				Layer: [
					{ Name: "Inner", HasType: false },
					{ Name: "Sucker", ParentGroup: null, HasType: false },
					{ Name: "Outer", HasType: false },
					{ Name: "Shine", ParentGroup: null, AllowColorize: false, HasType: false },
				],
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e", "#57ab5e", "#57ab5e"], Random: false, Value: 200, Difficulty: 6, Time: 30, RemoveTime: 50, ParentGroup: null, Extended: true,
				SetPose: ["BackElbowTouch"],
				AllowPose : ["Hogtied"],
				Effect: ["Block", "Prone"],
				Block: ["ItemHands", "ItemHandheld", "ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2",],
				Layer: [
					{ Name: "BaseOne", AllowModuleTypes: ["p0"], HasType: false },
					{ Name: "BaseTwo", AllowModuleTypes: ["p0"], HasType: false },
					{ Name: "BaseOneHogtied", CopyLayerColor: "BaseOne", AllowModuleTypes: ["p1"], HasType: false, Priority: 46, Top: 0 },
					{ Name: "BaseTwoHogtied", CopyLayerColor: "BaseTwo", AllowModuleTypes: ["p1"], HasType: false, Priority: 46, Top: 0 },
					{ Name: "GirlBack", AllowModuleTypes: ["p0t1"], HasType: false, Priority: 4, Top: 0 },
					{ Name: "GirlFront", CopyLayerColor: "GirlBack", AllowModuleTypes: ["p0t1"], HasType: false, Priority: 50, Top: 0 },
					{ Name: "GirlFrontHogtied", CopyLayerColor: "GirlBack", AllowModuleTypes: ["p1t1"], HasType: false, Priority: 55, Top: -150 },
					{ Name: "GirlFeatures", AllowModuleTypes: ["p0t1"], AllowColorize: false, HasType: false, Priority: 50, Top: 0 },
					{ Name: "GirlFeaturesHogtied", AllowModuleTypes: ["p1t1"], AllowColorize: false, HasType: false, Priority: 55, Top: -150 },
				],
				HideItem: ["ClothFuzzyDress", "ClothAdultBabyDress1", "ClothAdultBabyDress4", "ClothGown3", "ClothTeacherOutfit1"]
			},
			{
				Name: "BondageBra", Gender: "F", Fetish: ["Lingerie"], Priority: 20, Value: 40, Time: 20, RemoveTime: 10, Difficulty: 2, SelfBondage: 1, Left: 150,
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"],
				Block: ["ItemHands", "ItemHandheld"],
				Prerequisite: ["HasBreasts"],
			},
			{ Name: "SleepSac", Gender: "F", Fetish: ["Latex"], Value: 150, Difficulty: 10, SelfBondage: 6, Time: 30, RemoveTime: 40, Left: 0, Top: 0, AllowLock: true, DrawLocks: false, Random: false,
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Slow"],
				Prerequisite: ["NotHogtied", "NotMounted", "NoFeetSpreader", "HasBreasts"],
				Hide: ["Cloth", "Suit", "ClothLower", "SuitLower", "Shoes", "BodyLower", "Socks", "Panties", "ItemPelvis", "Garters", "LeftHand", "RightHand", "ItemBoots", "ItemLegs", "ItemFeet", "ItemButt", "TailStraps", "Wings"],
				HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper", "ClothAccessoryPoncho"],
				SelfUnlock: false,
				Block: ["ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"],
				Layer: [
					{ Name: "", AllowColorize: true },
					{ Name: "Lock", LockLayer: true, AllowColorize: false },
				],
			},
			// Flat Chest Compatible Items
			{
				Name: "SmoothLeatherArmbinder1", Fetish: ["Leather"], Priority: 6, Value: 70, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false,
				Extended: true,
				AlwaysInteract: true,
				ParentGroup: null,
				DefaultColor: ["#323232", "#565656", "#323232", "#252525", "#252525"],
				Layer: [
					// Binder
					{ Name: "BinderLeft", AllowModuleTypes: ["b0"], HasType: false, },
					{ Name: "BinderBack", CopyLayerColor: "BinderLeft", AllowModuleTypes: ["b1"], HasImage: false, HasType: false },
					{ Name: "BinderRight", CopyLayerColor: "BinderLeft", AllowModuleTypes: ["b2"], HasType: false },

					// Seams
					{ Name: "SeamsLeft", AllowModuleTypes: ["b0"], HasType: false },
					{ Name: "SeamsBack", CopyLayerColor: "SeamsLeft", AllowModuleTypes: ["b1"], HasImage: false, HasType: false },
					{ Name: "SeamsRight", CopyLayerColor: "SeamsLeft", AllowModuleTypes: ["b2"], HasType: false },

					// Laces
					{ Name: "LacesLeft", AllowModuleTypes: ["b0"], HasType: false },
					{ Name: "LacesBack", CopyLayerColor: "LacesLeft", AllowModuleTypes: ["b1"], HasImage: false, HasType: false },
					{ Name: "LacesRight", CopyLayerColor: "LacesLeft", AllowModuleTypes: ["b2"], HasType: false },

					// Binder Straps
					{ Name: "BinderStrapsLeft", AllowModuleTypes: ["b0"], HasType: false },
					{ Name: "BinderStrapsBack", CopyLayerColor: "BinderStrapsLeft", AllowModuleTypes: ["b1"], HasImage: false, HasType: false },
					{ Name: "BinderStrapsRight", CopyLayerColor: "BinderStrapsLeft", AllowModuleTypes: ["b2"], HasType: false },

					// Shoulder Straps
					{ Name: "BasicShoulderStraps", Priority: 31 , AllowModuleTypes: ["s1"], HasType: false },
					{ Name: "WrappingShoulderStraps", Priority: 31, CopyLayerColor: "BasicShoulderStraps", AllowModuleTypes:  ["s2"], HasType: false },
					{ Name: "HarnessShoulderStraps", Priority: 31, CopyLayerColor: "BasicShoulderStraps", AllowModuleTypes:  ["s3"], HasType: false}

				]
			},
			{
				Name: "CanvasStraitjacket1", Gender: "M", Prerequisite: ["HasFlatChest"], SetPose: ["BackElbowTouch"], Value: 80, AllowLock: true, DrawLocks: false, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20,
				DefaultColor: "#FFFFFF",
				Effect: ["Block", "Prone"],
				Hide: ["Cloth", "ItemNipplesPiercings"],
				Layer: [
					{ Name: "Straps", Priority: 11, ParentGroup: null },
					{ Name: "Jacket" },
					{ Name: "ArmStraps", ParentGroup: null}
				]
			}
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},

	{
		Group: "ItemHands",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 35,
		Default: false,
		IsRestraint: true,
		Zone: [[10, 400, 90, 100], [400, 400, 90, 100]],
		Block: ["ItemHandheld"],
		Asset: [
			{ Name: "PaddedMittens", Fetish: ["ABDL"], Value: 40, Difficulty: 4, SelfBondage: 2, Time: 15, AllowLock: true, DefaultColor: "#bbbbbb", AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone", "MergedFingers"], Hide: ["LeftHand", "RightHand", "ItemHandheld"], HideItem: ["BraceletSpikeBands"], Extended: true,
				Layer: [
					{ Name: "Gloves", AllowColorize: true},
					{ Name: "Straps", AllowColorize: true},
					{ Name: "Buckles", AllowColorize: true},
				]
			},
			{ Name: "PawMittens", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["ABDL", "Pet"], Value: 50, Difficulty: 4, SelfBondage: 1, Time: 15, AllowLock: true, DefaultColor: ["#bbbbbb","#bbbbbb","#bbbbbb","#B38295"], AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone", "MergedFingers"], Hide: ["LeftHand", "RightHand", "ItemHandheld"], HideItem: ["BraceletSpikeBands"], Extended: true,
				Layer: [
					{ Name: "Gloves", AllowColorize: true},
					{ Name: "Straps", AllowColorize: true},
					{ Name: "Buckles", AllowColorize: true},
					{ Name: "Paws", AllowColorize: true},
				]
			},
			{ Name: "LeatherMittens", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: 60, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone", "MergedFingers"], Hide: ["ItemHandheld"] },
			{ Name: "FuturisticMittens", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Metal"], Category: ["SciFi"], Value: 70, Difficulty: 5, SelfBondage: 0, Time: 5, RemoveTime: 5, Audio: "FuturisticApply", Random: false, AllowLock: true, DrawLocks: false,
				DefaultColor: ["#93C48C", "#3B7F2C", "Default"], AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], FuturisticRecolor: true,
				Effect: ["UseRemote"], SelfUnlock: false, Extended: true, Block: [],
				Layer: [
					{ Name: "Mesh", ParentGroup: null},
					{ Name: "Display", ParentGroup: null},
					{ Name: "Body", ParentGroup: null},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},

				]
			},
			{ Name: "PaddedLeatherMittens", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Leather"], Value: 70, Difficulty: 6, SelfBondage: 5, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone", "MergedFingers"], Hide: ["ItemHandheld"] },
			{ Name: "PolishedMittens", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Metal"], Value: 80, Difficulty: 8, SelfBondage: 6, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone", "MergedFingers"], Hide: ["ItemHandheld"] },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Difficulty: 5, SelfBondage: 3, Time: 20, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTapeRollShort", Hide: ["Gloves", "LeftHand", "RightHand", "ItemHandheld"], AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone", "MergedFingers"], },
			{ Name: "HoofMittens", Gender: "F", Prerequisite: ["HasBreasts"], Fetish: ["Pony"], Value: -1, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 5, AllowLock: true, DrawLocks: false, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours", "OverTheHead"], SetPose: ["TapedHands"], Effect: ["Block", "Prone", "MergedFingers"], HideForPose: ["BackBoxTie", "BackElbowTouch"], Hide: ["ItemHandheld"], },
			{ Name: "SmoothLeatherMittens1", Gender: "M", Prerequisite: ["HasFlatChest"], Fetish: ["Leather"], Value: 20, Difficulty: 3, SelfBondage: 3, Time: 10, RemoveTime: 2, AllowLock: true, DrawLocks: false, SetPose: ["TapedHands"], HideForPose: ["BackBoxTie", "BackElbowTouch"], AllowPose: ["Yoked", "OverTheHead", "BackCuffs", "AllFours"],  Hide: ["Gloves", "LeftHand", "RightHand", "ItemHandheld"],
				Effect: ["Block", "Prone", "MergedFingers"],
				DefaultColor: ["#323232", "#252525", "Default", "Default"],
				ParentGroup: null,
				Layer: [
					{ Name: "Mittens" },
					{ Name: "Straps" },
					{ Name: "Buckles", HideForPose: ["OverTheHead", "Yoked", "BackCuffs", "AllFours" ] },
					{ Name: "Locks", LockLayer: true, HideForPose: ["OverTheHead", "Yoked", "BackCuffs", "AllFours"] }

				],
			},
		],
	},
	{
		Group: "ItemHandheld",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 34,
		Default: false,
		Zone: [[10, 500, 90, 100], [400, 500, 90, 100]],
		MirrorActivitiesFrom: "ItemHands",
		AllowPose: ["AllFours", "BackBoxTie", "BackCuffs", "BackElbowTouch", "OverTheHead", "Yoked"],
		Asset: [
			{ Name: "KeyProp", ParentGroup: null, Value: 10, Priority: 46, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], },
			{ Name: "MedicalInjector", ParentGroup: null, Category: ["SciFi"], Value: 75, Priority: 46, Time: 8, IsRestraint: false, AllowActivity: ["InjectItem"], AllowPose: ["Yoked"], HideForPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "AllFours"], },
			{
				Name: "Crop", ParentGroup: null, Priority: 46, Value: 20, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem", "RubItem"], ActivityAudio: ["SmackCrop"], BuyGroup: "Crop",
			},
			{
				Name: "Flogger", ParentGroup: null, Priority: 46, Value: 40, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"], ActivityAudio: ["SmackCrop"],
			},
			{
				Name: "Cane", ParentGroup: null, Priority: 46, Value: 15, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem", "RubItem"], ActivityAudio: ["SmackCrop"], BuyGroup: "Cane",
				ActivityExpression: {
					"SpankItem": [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }],
				}
			},
			{
				Name: "HeartCrop", ParentGroup: null, Priority: 46, Value: 30, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem", "RubItem"], ActivityAudio: ["SmackCrop"],
			},
			{
				Name: "Paddle", ParentGroup: null, Priority: 46, Value: 35, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem", "RubItem"], ActivityAudio: ["SmackCrop"],
				ActivityExpression: {
					"SpankItem": [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }],
				}
			},
			{
				Name: "WhipPaddle", ParentGroup: null, Priority: 46, Value: 25, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem", "RubItem"], ActivityAudio: ["SmackCrop"],
				ActivityExpression: {
					"SpankItem": [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }],
				}
			},
			{
				Name: "Whip", ParentGroup: null, Priority: 46, Value: 50, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"], ActivityAudio: ["WhipCrack"],
				ActivityExpression: {
					"SpankItem": [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }],
				}
			},
			{
				Name: "CattleProd", ParentGroup: null, Priority: 46, Value: 45, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["ShockItem"], ActivityAudio: ["Shocks"],
			},
			{
				Name: "TennisRacket", ParentGroup: null, Priority: 46, Value: -1, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"], Bonus: "KidnapBruteForce",
			},
			{
				Name: "RainbowWand", ParentGroup: null, Priority: 46, Value: -1, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
				ActivityExpression: { "SpankItem": [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] }
			},
			{
				Name: "Gavel", ParentGroup: null, Priority: 46, Value: -1, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"], Bonus: "KidnapDomination",
				ActivityExpression: {
					"SpankItem": [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }]
				}
			},
			{
				Name: "Feather", ParentGroup: null, Priority: 46, Value: 2, Random: false,
				AllowActivity: ["TickleItem"],
				ActivityExpression: { "TickleItem": [{ Group: "Blush", Name: "Medium", Timer: 10 }, {Group: "Eyes", Name: "Closed", Timer: 10}, { Group: "Mouth", Name: "Grin", Timer: 10}, { Group: "Eyebrows", Name: "Soft", Timer: 10}], }
			},
			{
				Name: "FeatherDuster", ParentGroup: null, Priority: 46, Value: 4, Random: false,
				AllowActivity: ["TickleItem"],
			},
			{
				Name: "LongDuster", ParentGroup: null, Priority: 46, Value: -1, Random: false,
				AllowActivity: ["TickleItem"], Bonus: "KidnapSneakiness",
			},
			{
				Name: "IceCube", ParentGroup: null, Priority: 46, Value: 3, Random: false,
				AllowActivity: ["RubItem"],
				ActivityExpression: { "RubItem": [{ Group: "Blush", Name: "Medium", Timer: 10}, { Group: "Mouth", Name: "Angry", Timer: 10}, { Group: "Eyes", Name: "Daydream", Timer: 10}, { Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			},
			{
				Name: "WartenbergWheel", ParentGroup: null, Priority: 46, Value: 10, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["RollItem"],
				ActivityExpression: { "RollItem": [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Mouth", Name: "Frown", Timer: 10}, { Group: "Eyes", Name: "Daydream", Timer: 10}] }
			},
			{
				Name: "VibratingWand", ParentGroup: null, Priority: 46, Value: 40, Random: false,
				AllowActivity: ["MasturbateItem", "RubItem"], ActivityAudio: ["Wand"],
				ActivityExpression: { "MasturbateItem": [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyes", Name: "VeryLewd", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 10}, { Group: "Mouth", Name: "Open", Timer: 10}], }
			},
			{
				Name: "SmallVibratingWand", ParentGroup: null, Priority: 46, Value: 20, Random: false,
				AllowActivity: ["MasturbateItem", "RubItem"], ActivityAudio: ["Wand"],
			},
			{
				Name: "CandleWax", ParentGroup: null, Priority: 46, Value: 10, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["PourItem"],
				ActivityExpression: { "PourItem": [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Surprised", Timer: 10}, { Group: "Mouth", Name: "Frown", Timer: 10}] }
			},
			{
				Name: "LargeDildo", ParentGroup: null, Priority: 46, Value: 30, Random: false,
				AllowActivity: ["MasturbateItem", "RubItem", "PenetrateItem"],
			},
			{
				Name: "PetToy", ParentGroup: null, Priority: 46, Value: 5, Random: false,
				AllowActivity: ["TickleItem", "SpankItem"],
			},
			{
				Name: "Vibrator", ParentGroup: null, Priority: 46, Value: 45, Random: false,
				AllowActivity: ["MasturbateItem", "RubItem"], ActivityAudio: ["Wand"],
				ActivityExpression: { "MasturbateItem": [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyes", Name: "VeryLewd", Timer: 10 }, { Group: "Mouth", Name: "Open", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10}], }
			},
			{
				Name: "Belt", ParentGroup: null, Priority: 46, Value: 10, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
				ActivityExpression: { "SpankItem": [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Mouth", Name: "Frown", Timer: 10}], }
			},
			{
				Name: "Hairbrush", ParentGroup: null, Priority: 46, Value: 5, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
				ActivityExpression: { "SpankItem": [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Mouth", Name: "Frown", Timer: 10}], }
			},
			{
				Name: "SmallDildo", ParentGroup: null, Priority: 46, Value: 20, Random: false,
				AllowActivity: ["MasturbateItem", "RubItem", "PenetrateItem"],
			},
			{
				Name: "ElectricToothbrush", ParentGroup: null, Priority: 46, Value: 20, Random: false,
				AllowActivity: ["TickleItem", "MasturbateItem"],
			},
			{
				Name: "Toothbrush", ParentGroup: null, Priority: 46, Value: 10, Random: false,
				AllowActivity: ["TickleItem"],
				ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, {Group: "Eyes", Name: "Closed", Timer: 10}, { Group: "Mouth", Name: "Grin", Timer: 10}, { Group: "Eyebrows", Name: "Soft", Timer: 10}]
			},
			{
				Name: "ShockWand", ParentGroup: null, Priority: 46, Value: 50, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["ShockItem"], ActivityAudio: ["Shocks"],
			},
			{
				Name: "Lotion", ParentGroup: null, Priority: 46, Value: 10, Random: false,
				AllowActivity: ["RubItem"],
			},
			{
				Name: "Ruler", ParentGroup: null, Priority: 46, Value: 3, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
			},
			{
				Name: "Sword", ParentGroup: null, Priority: 46, Value: 5, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
				ActivityExpression: { "SpankItem": [{ Group: "Blush", Name: "Low", Timer: 5 }, { Group: "Eyebrows", Name: "Harsh", Timer: 5 }], }
			},
			{
				Name: "VibeRemote", ParentGroup: null, Priority: 46, Value: 50, Random: false,
				AllowActivity: ["RubItem"], BuyGroup: "VibratorRemote",
			},
			{
				Name: "ShockRemote", ParentGroup: null, Priority: 46, Value: 50, Random: false,
				AllowActivity: ["RubItem"], BuyGroup: "ShockCollar", Effect: ["TriggerShock"],
			},
			{
				Name: "Towel", ParentGroup: null, Priority: 46, Value: 10, Random: false, AllowActivity: ["RubItem"],
			},
			{
				Name: "RopeCoilLong", ParentGroup: null, Priority: 46, Value: 60, Random: false, Fetish: ["Rope"],
				AllowActivity: ["RubItem"], BuyGroup: "HempRope",
			},
			{
				Name: "RopeCoilShort", ParentGroup: null, Priority: 46, Value: 60, Random: false, Fetish: ["Rope"],
				AllowActivity: ["RubItem"], BuyGroup: "HempRope",
			},
			{
				Name: "Ballgag", ParentGroup: null, Priority: 46, Value: 40, Random: false,  Fetish: ["Gagged"],
				AllowActivity: ["RubItem"],
			},
			{
				Name: "LongSock", ParentGroup: null, Priority: 46, Value: 40, Random: false,  Fetish: ["Lingerie"],
				AllowActivity: ["RubItem"],
			},
			{
				Name: "Baguette", ParentGroup: null, Priority: 46, Value: -1, Random: false,  Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
			},
			{
				Name: "Panties", ParentGroup: null, Priority: 46, Value: 10, Random: false,  Fetish: ["Lingerie"],
				AllowActivity: ["RubItem"],
			},
			{
				Name: "TapeRoll", ParentGroup: null, Priority: 46, Value: 50, Random: false, Fetish: ["Tape"],
				AllowActivity: ["RubItem"],
			},
			{
				Name: "Spatula", ParentGroup: null, Priority: 46, Value: 5, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
			},
			{
				Name: "Broom", ParentGroup: null, Priority: 46, Value: 15, Random: false, Fetish: ["Sadism"],
				AllowActivity: ["SpankItem"],
			},
			{
				Name: "Phone1", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina"], ParentGroup: null, Priority: 46,  Value: 100, Random: false,
				AllowActivity: ["RubItem"],
			},
			{
				Name: "Phone2", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina"], ParentGroup: null, Priority: 46, Value: 140, Random: false,
				AllowActivity: ["RubItem"],
			},
			{
				Name: "Scissors", ParentGroup: null, Priority: 46, Value: 15, Random: false,
			},
			{
				Name: "PlasticWrap", ParentGroup: null, Priority: 46, Value: 100, BuyGroup: "PlasticWrap", Random: false,
			},
			{
				Name: "GlassEmpty", ParentGroup: null, Priority: 46, Value: 10, Random: false,
				BuyGroup: "DrinkingGlass"
			},
			{
				Name: "GlassFilled", ParentGroup: null, Priority: 46, Value: 20, Random: false,
				AllowActivity: ["RubItem"], BuyGroup: "DrinkingGlass",
				ActivityExpression: { "RubItem": [{ Group: "Blush", Name: "Low", Timer: 5}, { Group: "Mouth", Name: "LipBite", Timer: 5}, { Group: "Eyes", Name: "Lewd", Timer: 5}, { Group: "Eyebrows", Name: "Raised", Timer: 5}], },
			},
			{
				Name: "PotionBottle", ParentGroup: null, Value: 40, Random: false,
				AllowActivity: ["RubItem"],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNeck",
		Category: "Item",
		Priority: 34,
		Default: false,
		Left: 185,
		Top: 160,
		Zone: [[200, 200, 100, 70]],
		RemoveItemOnRemove: [
			{ Group: "ItemNeckAccessories", Name: ""},
			{ Group: "ItemNeckRestraints", Name: ""},
			{ Group: "ItemArms", Name: "CollarCuffs"},
			{ Group: "ItemNipplesPiercings", Name: "RoundPiercing", Type: "Chain"},
			{ Group: "ItemNipplesPiercings", Name: "RoundPiercing", Type: "WeightedChain"},
		],
		Asset: [
			{ Name: "LeatherCollar", Fetish: ["Leather"], DefaultColor: ["#000000", "Default"], Value: 20, Difficulty: 50, Time: 5, AllowLock: true, Layer: [
				{ Name: "Collar"},
				{ Name: "Ring"}
			] },
			{ Name: "LeatherCollarBell", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LeatherCollarBow", Fetish: ["Leather"], Value: 25, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "SlaveCollar", Value: -1, Difficulty: 50, Time: 5, Enable: false, Random: false, OwnerOnly: true, Effect: ["Lock"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3"], AllowEffect: ["GagNormal", "FixedHead"], AllowType: ["SteelPosture", "LeatherPosture", "PetCollar", "HighCollar", "LeatherCollarBell", "LeatherCollarBow", "MaidCollar", "BatCollar", "HighSecurityCollar", "SpikeCollar", "BordelleCollar", "LeatherCorsetCollar", "StrictPostureCollar", "LatexPostureCollar", "HeartCollar", "NobleCorsetCollar", "OrnateCollar", "LoveLeatherCollar", "SlenderSteelCollar", "ShinySteelCollar", "HeartLinkChoker", "NeckRope"], Extended: true },
			{ Name: "ClubSlaveCollar", Value: -1, Difficulty: 50, Time: 5, Enable: false, Random: false, Effect: ["Lock"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{
				Name: "ShockCollar", Fetish: ["Leather", "Masochism"], Value: 80, Difficulty: 50, Time: 15,
				Random: false, AllowLock: true, BuyGroup: "ShockCollar", Effect: ["ReceiveShock", "UseRemote"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				AlwaysExtend: true, HasType: false,
				Layer: [
					{ Name: "Collar" },
					{ Name: "Light", HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{
				Name: "AutoShockCollar", Fetish: ["Leather", "Masochism"], Value: -1, Difficulty: 50, Time: 15,
				Random: false, AllowLock: true, BuyGroup: "ShockCollar", Effect: ["ReceiveShock", "UseRemote"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				AlwaysExtend: true, HasType: false,
				Layer: [
					{ Name: "Collar" },
					{ Name: "Light", HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{ Name: "BatCollar", Fetish: ["Leather"], Value: 25, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "PostureCollar", Fetish: ["Leather"], Effect: ["FixedHead"], DefaultColor: ["#000000", "Default", "Default", "Default"], Value: 40, Difficulty: 50, Time: 5, AllowLock: true, Layer: [
				{ Name: "Collar" },
				{ Name: "Ring1", ColorGroup: "Rings"},
				{ Name: "Ring2", ColorGroup: "Rings"},
				{ Name: "Ring3", ColorGroup: "Rings"}

			] },
			{ Name: "SteelPostureCollar", Fetish: ["Metal"], Effect: ["FixedHead"], Value: 60, Difficulty: 50, Time: 5, AllowLock: true, Audio: "CuffsMetal" },
			{ Name: "DogCollar", Fetish: ["Leather", "Pet"], Value: 20, Difficulty: 50, Time: 5, Random: false, AllowLock: true },
			{ Name: "SpikeCollar", Fetish: ["Leather", "Metal", "Pet"], Value: 40, Difficulty: 50, Time: 5, AllowLock: true },
			{
				Name: "HighCollar", Fetish: ["Leather", "Metal"], Value: 50, Difficulty: 50, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Leather" },
					{ Name: "Rings" }
				]
			},
			{
				Name: "FuturisticCollar", Category: ["SciFi"], Fetish: ["Metal"], Value: 100, Difficulty: 50, Time: 12, Audio: "FuturisticApply", Random: false,
				DefaultColor: ["#40812C", "Default", "Default"], AllowLock: true, DrawLocks: false, Extended: true,
				AllowEffect:["BlockRemotes", "OpenPermission", "OpenPermissionArm", "OpenPermissionLeg", "OpenPermissionChastity"],
				Layer: [
					{ Name: "Display" },
					{ Name: "Band" },
					{ Name: "Mesh",  HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{ Name: "LeatherChoker", Fetish: ["Leather"], DefaultColor: ["Default", "#000000"], Value: 10, Difficulty: 50, Time: 5, AllowLock: true, Layer: [
				{ Name: "Metal" },
				{ Name: "Leather" }
			] },
			{ Name: "PetCollar", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "MaidCollar", Fetish: ["Lingerie"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true, DefaultColor: ["#DCDCDC", "#2C2C2C"], Layer: [
				{ Name: "Frills" },
				{ Name: "Collar" },
				{ Name: "Brooch" },
			] },
			{ Name: "BordelleCollar", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LoveLeatherCollar", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 5, Random: false, AllowLock: true, LoverOnly: false },
			{ Name: "NobleCorsetCollar", Fetish: ["Leather"], Value: 45, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "StrictPostureCollar", Effect: ["FixedHead"], Fetish: ["Leather"], Priority: 38, Value: 60, Difficulty: 50, Time: 30, RemoveTime: 40, AllowLock: true },
			{ Name: "HeartCollar", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Priority: 38, Value: 75, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, IsRestraint: true, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Effect: ["GagNormal"], },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Priority: 38, Value: 80, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, IsRestraint: true, AllowLock: true, BuyGroup: "LatexPostureCollar", Effect: ["GagNormal", "FixedHead"], },
			{ Name: "HighSecurityCollar", Fetish: ["Metal"], Value: 70, Difficulty: 50, Time: 5, AllowLock: true, Audio: "LockLarge" },
			{
				Name: "OrnateCollar", Fetish: ["Metal"], Value: 80, Difficulty: 50, Time: 5, AllowLock: true, Audio: "CuffsMetal",
				Layer: [
					{ Name: "Collar" },
					{ Name: "Gem" }
				]
			},
			{ Name: "SlenderSteelCollar", Fetish: ["Metal"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true, Audio: "CuffsMetal" },
			{
				Name: "ShinySteelCollar", Fetish: ["Metal"], Value: 35, Difficulty: 50, Time: 5, AllowLock: true, DrawLocks: false, Audio: "CuffsMetal", HasType: false, Extended: true,
				Layer: [
					{ Name: "Collar" },
					{ Name: "Ring", AllowTypes: ["Ring"] }
				]
			},
			{ Name: "HeartLinkChoker", Fetish: ["Leather"], Value: 15, Difficulty: 50, Time: 5, AllowLock: true,
				DefaultColor: ["#979797", "#3D3D3D"],
				Layer: [
					{ Name: "HeartLink"},
					{ Name: "LeatherStrap"}
				]
			},
			{ Name: "NeckRope", Fetish: ["Rope"], Value: 60, Difficulty: 50, Time: 5, AllowLock: false, BuyGroup: "HempRope", CraftGroup: "HempRope", Audio: "RopeShort", DefaultColor: "#956B1C", ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 3 }, { Name: "Soft", Group: "Eyebrows", Timer: 3 }] },
			{ Name: "NylonCollar", Value: 45, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "GothicCollar",Priority: 29, Value: 85, Difficulty: 50, Time: 5, AllowLock: true, DefaultColor:["Default","#202020",],
				Layer: [
					{ Name: "Ornaments"},
					{ Name: "Collar"},
					{ Name: "Jewels"},
					{ Name: "Metal"},
					{ Name: "Flowers"}
				]
			},
			{ Name: "LatexCollar1", Fetish: ["Latex"], Value: 40, Difficulty: 50, Time: 5, Effect: ["FixedHead"]},
			{ Name: "LatexCollar2", Fetish: ["Latex"], Value: 40, Difficulty: 50, Time: 5, AllowLock: true},
			{ Name: "TechnoCollar", Category: ["SciFi"], Fetish: ["Metal"], Value: 70, DefaultColor: ["#959595","#3976AE"], Difficulty: 60, Time: 4, AllowLock: true, DrawLocks: false, Extended: true,
				Layer: [
					{ Name: "SlenderCollarBase", HasType: false, AllowModuleTypes: ["c0"] },
					{ Name: "ChokerCollarBase", HasType: false, CopyLayerColor: "SlenderCollarBase", AllowModuleTypes: ["c1"] },
					{ Name: "FullCollarBase", HasType: false, CopyLayerColor: "SlenderCollarBase", AllowModuleTypes: ["c2"] },
					{ Name: "PostureCollarBase", HasType: false, CopyLayerColor: "SlenderCollarBase", AllowModuleTypes: ["c3"] },
					{ Name: "StrictPostureCollarBase", HasType: false, CopyLayerColor: "SlenderCollarBase", AllowModuleTypes: ["c4"] },
					{ Name: "SlenderCollarSides", HasType: false, AllowModuleTypes: ["c0"] },
					{ Name: "ChokerCollarSides", HasType: false, CopyLayerColor: "SlenderCollarSides", AllowModuleTypes: ["c1"] },
					{ Name: "FullCollarSides", HasType: false, CopyLayerColor: "SlenderCollarSides", AllowModuleTypes: ["c2"] },
					{ Name: "PostureCollarSides", HasType: false, CopyLayerColor: "SlenderCollarSides", AllowModuleTypes: ["c3"] },
					{ Name: "StrictPostureCollarSides", HasType: false, CopyLayerColor: "SlenderCollarSides", AllowModuleTypes: ["c4"] },
					{ Name: "SlenderCollarShine", HasType: false, AllowColorize: false, AllowModuleTypes: ["c0"] },
					{ Name: "ChokerCollarShine", HasType: false, AllowColorize: false, AllowModuleTypes: ["c1"] },
					{ Name: "FullCollarShine", HasType: false, AllowColorize: false, AllowModuleTypes: ["c2"] },
					{ Name: "PostureCollarShine", HasType: false, AllowColorize: false, AllowModuleTypes: ["c3"] },
					{ Name: "StrictPostureCollarShine", HasType: false, AllowColorize: false, AllowModuleTypes: ["c4"] },
				]
			},
			{ Name: "ComboHarness", Top: 0, Left:150,  DefaultColor: ['#4D4848', 'Default', '#7E7B77', '#FFFFFF', '#ACA1A1'], Effect: ["BlockMouth", "GagMedium", "BlindNormal", "Prone"], Prerequisite: ["AccessMouth", "EyesEmpty", "HoodEmpty", "GagUnique"], Block: ["ItemHood", "ItemHead", "ItemMouth"], AllowActivityOn: ["ItemHead"], Value: 100, Difficulty: 30, Time: 18, AllowLock: true, Extended: true, Random: false, IsRestraint: true, Layer: [
				{ Name: "Harness", HasType: false },
				{ Name: "Buckles", HasType: false },
				{ Name: "Ball"},
				{ Name: "Studs", HasType: false },
				{ Name: "Ring", HasType: false }
			] },
			{
				Name: "BonedNeckCorset", Fetish: ["Latex"], Time: 7, Value: 50, Difficulty: 40, AllowLock: true, DrawLocks: false, DefaultColor: ["#222222","#888888", "#AA2121", "#AA2121", "#888888"], Effect: ["FixedHead"], Extended: true,
				Layer:[
					{ Name: "Base", HasType: false,},
					{ Name: "Shine", HasType: false,},
					{ Name: "Stripes", HasType: false,},
					{ Name: "StripesShine", HasType: false,},
					{ Name: "Bump", HasType: false, AllowTypes: ["Ring"], CopyLayerColor: "Base",},
					{ Name: "RingShadow", HasType: false, AllowTypes: ["Ring"], AllowColorize: false,},
					{ Name: "Ring", HasType: false, AllowTypes: ["Ring"],},
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNeckAccessories",
		Category: "Item",
		Priority: 41,
		Default: false,
		Left: 0,
		Top: 190,
		Zone: [[100, 200, 100, 70]],
		MirrorActivitiesFrom: "ItemNeck",
		Asset: [
			{
				Name: "CustomCollarTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false,
				AllowLock: true, DefaultColor: ["#aaa366", "#000000"], Prerequisite: "Collared", DynamicAfterDraw: true,
				Extended: true, DrawLocks: false, TextMaxLength: { Text: 9 }, TextFont: "sans-serif",
				Layer: [
					{ Name: "Tag", ModuleType: ["t"], AllowModuleTypes: ["t0", "t1", "t2", "t3", "t4", "t5"] },
					{ Name: "Text", HasImage: false },
					{ Name: "Lock", AllowColorize: false, LockLayer: true, HasType: false },
				]
			},
			{
				Name: "ElectronicTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false,
				AllowLock: true, DrawLocks: false, DefaultColor: ["#40812C", "Default", "#000000"], Prerequisite: "Collared",
				DynamicAfterDraw: true, Extended: true, FuturisticRecolor: true, TextMaxLength: { Text: 9 },
				TextFont: "sansserif",
				Layer: [
					{ Name: "Display" },
					{ Name: "Tag" },
					{ Name: "Text" }
				]
			},
			{ Name: "CollarBell", Fetish: ["Metal", "Pet"], Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", Audio: "BellMedium" },
			{ Name: "CollarBow", Fetish: ["Lingerie"], Value: 5, Difficulty: 1, Time: 5, Random: false, Prerequisite: "Collared" },
			{
				Name: "CollarShockUnit", Fetish: ["Masochism"], Value: 80, Difficulty: 6, Time: 5, Random: false,
				AllowLock: true, BuyGroup: "ShockCollar", Prerequisite: "Collared", Effect: ["ReceiveShock", "UseRemote"],
				ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }], Extended: true, AlwaysExtend: true,
				HasType: false,
				Layer: [
					{ Name: "Unit" },
					{ Name: "Light", HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{
				Name: "CollarAutoShockUnit", Fetish: ["Masochism"], Value: -1, Difficulty: 6, Time: 5,
				Random: false, AllowLock: true, BuyGroup: "ShockCollar", Prerequisite: "Collared", HasType: false,
				Effect: ["ReceiveShock", "UseRemote"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }],
				Extended: true, AlwaysExtend: true,
				Layer: [
					{ Name: "Unit" },
					{ Name: "Light", HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{ Name: "Key", Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared"},
			{ Name: "CollarNameTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", Extended: true },
			{ Name: "CollarNameTagOval", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", Extended: true },
			{ Name: "CollarNameTagPet", Fetish: ["Pet"], Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", Extended: true },
			{ Name: "CollarNameTagLover", Value: -1, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", Extended: true },
			{ Name: "CollarNameTagLivestock", Fetish: ["Pet"], Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, Prerequisite: "Collared", Extended: true },
			{ Name: "CollarMoon", Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarSun", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared" },
			{ Name: "CollarLapis", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared" },
			{ Name: "CollarPentagram", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared" },
			{ Name: "CollarFlower", Value: 5, Difficulty: 1, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared" },
			{ Name: "CollarRose", Value: 5, Difficulty: 1, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared" },
			{ Name: "CollarCowBell", Fetish: ["Pet"], Value: 15, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarPupBone", Fetish: ["Pet"], Value: 25, Difficulty: 3, Time: 5, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: "Collared" },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNeckRestraints",
		Category: "Item",
		Priority: 40,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: 190,
		Zone: [[300, 200, 100, 70]],
		MirrorActivitiesFrom: "ItemNeck",
		Asset: [
			{ Name: "CollarChainLong", Fetish: ["Metal"], Value: 30, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Audio: "ChainLong", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["Kneel", "KneelingSpread", "AllFours", "Hogtied"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarChainShort", Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Audio: "ChainLong", Prerequisite: ["Collared", "AllFours", "NotSuspended", "NotMounted", "CanKneel"], AllowPose: ["AllFours", "Hogtied"], SetPose: ["Kneel"], AllowActivePose: ["Kneel", "KneelingSpread"], Effect: ["Freeze", "ForceKneel", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "Post", Fetish: ["Metal"], Value: 130, Difficulty: 9, Time: 5, Random: false, AllowLock: true, Audio: "ChainShort", Prerequisite: ["Collared", "AllFours", "NotSuspended", "NotMounted", "CanKneel"], AllowPose: ["AllFours", "Hogtied"], SetPose: ["Kneel"], AllowActivePose: ["Kneel", "KneelingSpread"], Effect: ["Freeze", "ForceKneel", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }],
				Layer: [
					{ Name: "Chain", Priority: 40 },
					{ Name: "Base", Priority: 54 },
					{ Name: "Post", Priority: 54 },
					{ Name: "Head", Priority: 54 },
				]
			},
			{ Name: "CollarLeash", Fetish: ["Leather"], Value: 20, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Audio: "LockSmall", Prerequisite: "Collared", Effect: ["Leash"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "ChainLeash", Fetish: ["Leather"], Value: 25, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", Audio: "LockSmall", AllowPose: ["AllFours"], Effect: ["Leash"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarChainMedium", Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Audio: "ChainLong", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Kneel", "KneelingSpread", "Hogtied"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{
				Name: "CollarRopeLong", Fetish: ["Rope"], Value: 30, Difficulty: 5, Time: 5, Random: false, DefaultColor: "#956B1C", BuyGroup: "CollarRope", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Kneel", "KneelingSpread", "Hogtied"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }], DrawLocks: false,
				Layer: [
					{ Name: "Rope", },
					{ Name: "Plate", AllowColorize: false, },
				],
			},
			{
				Name: "CollarRopeShort", Fetish: ["Rope"], Value: -1, Difficulty: 5, Time: 5, Random: false, DefaultColor: "#956B1C", BuyGroup: "CollarRope", Prerequisite: ["Collared", "AllFours", "NotSuspended", "NotMounted", "CanKneel", "Hogtied"], AllowPose: ["AllFours", "Hogtied"], SetPose: ["Kneel"], AllowActivePose: ["Kneel", "KneelingSpread"], Effect: ["Freeze", "ForceKneel", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 },],  DrawLocks: false,
				Layer: [
					{ Name: "Rope", },
					{ Name: "Plate", AllowColorize: false, },
				],
			},
			{
				Name: "CollarRopeMedium", Fetish: ["Rope"], Value: -1, Difficulty: 6, Time: 5, Random: false, DefaultColor: "#956B1C", BuyGroup: "CollarRope", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Kneel", "KneelingSpread", "Hogtied"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }], DrawLocks: false,
				Layer: [
					{ Name: "Rope", },
					{ Name: "Plate", AllowColorize: false, },
				],
			},
			{
				Name: "PetPost", Fetish: ["Metal", "Pet"], Value: 150, Difficulty: 4, Time: 5, Random: false,
				DefaultColor: ["Default", "#845343", "#A1794A", "Default", "#237D22", "#F3F3F3", "#F3F3F3", "#FFF483", "#FFBCD6", "Default"],
				BuyGroup:"PetPost", DrawLocks: false, Prerequisite: ["Collared", "NotSuspended", "NotMounted"],
				AllowPose: [], Effect: ["IsChained", "Tethered"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }],
				DynamicAfterDraw: true, Extended: true, AlwaysExtend: true, Top: 352, Left: 310,
				FixedPosition: true,
				TextMaxLength: { Text: 14, Text2: 14, Text3: 14 },
				TextFont: "sans-serif",
				Layer: [
					//Pole Base
					{ Name: "PoleShade", Priority: 10, AllowColorize: false, HasType: false},
					{ Name: "Pole", Priority: 54, AllowModuleTypes: ["d1"], HasType: false, },
					{ Name: "PoleClean", Priority: 54, CopyLayerColor: "Pole", AllowModuleTypes: ["d0"], HasType: false},
					//Leashes
					{ Name: "Leash", Priority: 55, AllowModuleTypes: ["l0"], AllowPose: ["AllFours", "Kneel", "KneelingSpread", "Hogtied"], HasType: false, Top: 212, Left: 239 },
					{ Name: "Rope", Priority: 55, AllowModuleTypes: ["l1"], AllowPose: ["AllFours", "Kneel", "KneelingSpread", "Hogtied"], HasType: false, Top: 212, Left: 239 },
					{ Name: "Chain", Priority: 55, AllowModuleTypes: ["l2"], AllowPose: ["AllFours", "Kneel", "KneelingSpread", "Hogtied"], HasType: false, Top: 212, Left: 239 },
					//Plaque
					{ Name: "Plaque", Priority: 54, AllowModuleTypes: ["d1"], HasType: false },
					{ Name: "PlaqueClean", Priority: 54, CopyLayerColor: "Plaque",AllowModuleTypes: ["d0"], HasType: false },
					{ Name: "PlaqueBorder", Priority: 54, AllowModuleTypes: ["p1d1"], HasType: false },
					{ Name: "PlaqueBorderClean", Priority: 54, CopyLayerColor: "PlaqueBorder", AllowModuleTypes: ["p1d0"], HasType: false },
					{ Name: "PlaqueBolts", Priority: 54, HasType: false },
					//Details
					{ Name: "Postit", Priority: 54, HasType: false, AllowModuleTypes: ["m0"] },
					{ Name: "Text", HasImage: false, Priority: 55 },
					{ Name: "Paw", Priority: 54, HasType: false, AllowModuleTypes: ["s0"] },
					{ Name: "Triskel", Priority: 54, HasType: false, CopyLayerColor: "Paw", AllowModuleTypes: ["s1"] },
					{ Name: "Moon", Priority: 54, HasType: false, CopyLayerColor: "Paw", AllowModuleTypes: ["s2"] },
					{ Name: "LGBT", Priority: 54, HasType: false, AllowColorize: false, AllowModuleTypes: ["s3"] },
					{ Name: "Trans", Priority: 54, HasType: false, AllowColorize: false, AllowModuleTypes: ["s4"] },
					{ Name: "Bi", Priority: 54, HasType: false, AllowColorize: false, AllowModuleTypes: ["s5"] },
					{ Name: "NoSwim", Priority: 54, HasType: false, CopyLayerColor: "Paw", AllowModuleTypes: ["s6"] },
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMouth",
		Category: "Item",
		Priority: 35,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 0,
		Effect: ["BlockMouth", "GagNormal"],
		Zone: [[100, 130, 100, 70]],
		Asset: [
			{ Name: "ClothGag", Value: 15, Difficulty: -4, Time: 10, DefaultColor: "#E0E0E0", BuyGroup: "ClothGag", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Audio: "ClothKnot", Extended: true },
			{
				Name: "WiffleGag", Fetish: ["Leather"], Value: 30, Difficulty: 1, Time: 10, AllowLock: true, BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#FF6060"],
				Extended: true,
				Layer: [
					{ Name: "Strap" , HasType: false},
					{ Name: "Ball" },
				]
			},
			{
				Name: "HarnessBallGag", Fetish: ["Leather"], Value: 60, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["#FF6060", "Default"], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Harness", HasType: false},
				]
			},
			{
				Name: "Ball", Fetish: ["Pet"], Value: 5, Difficulty: -50, Time: 5, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 20 }],
				DefaultColor: ["#E1D31C", "Default"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Stripes", HasType: false},
				]
			},
			{
				Name: "HarnessPanelGag", Fetish: ["Leather"], Value: 80, Difficulty: 6, Time: 20, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "RingGag", Fetish: ["Leather", "Metal"], Value: 30, Difficulty: 2, Time: 5, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Difficulty: -2, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", Audio: "DuctTape", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Extended: true },
			{ Name: "PacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: 10, Difficulty: -50, Time: 2, Random: false, Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{
				Name: "HarnessPacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: 50, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Harness" },
					{ Name: "Metal" },
					{ Name: "PacifierOuter" },
					{ Name: "PacifierInner" },
				]
			},
			{
				Name: "DusterGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Bonus: "KidnapBruteForce", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth2", "ItemMouth3"],
				AllowActivity: ["TickleItem"],
				Layer: [
					{ Name: "Duster" },
					{ Name: "Panel" },
				]
			},
			{
				Name: "CupholderGag", Fetish: ["Leather"], Priority: 42, Value: 30, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "CupholderGag", Hide: ["Mouth"], Extended: true, AlwaysExtend: true, AlwaysInteract: true, Effect: ["BlockMouth", "GagEasy", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Gag", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Holder", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Cup", HasType: false, AllowTypes: ["Cup"] }
				]
			},
			{
				Name: "HarnessPonyBits", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique", Extended: true, AlwaysExtend: true, Effect: ["BlockMouth", "GagLight"], Bonus: "KidnapBruteForce",
				Layer: [
					{ Name: "Metal"},
					{ Name: "Straps", HasType: false },
					{ Name: "Bobble", HasType: false },
				]
			},
			{Name: "PumpGag", Fetish: ["Leather"], Value: 100, Difficulty: 2, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{
				Name: "KittyGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Pet"], Value: 20, Difficulty: -4, Time: 10, Random: false, BuyGroup: "KittyGag", DefaultColor: ["#FFFFFF", "#000000", "#E496E7"], Hide: ["Mouth"], Effect: ["BlockMouth"], Layer: [
					{ Name: "Base", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "KittyHarnessPanelGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], BuyGroup: "KittyHarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "KittyMuzzleGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], BuyGroup: "KittyMuzzleGag", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "CarrotGag", Fetish: ["Leather", "Pony"], Value: 40, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Carrot" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "MuzzleGag", Fetish: ["Leather"], Value: 70, Difficulty: 6, Time: 20, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "FuturisticPanelGag", Category: ["SciFi"], Fetish: ["Metal"], Value: 100, Difficulty: 4, Time: 15, Random: false, AllowLock: true,
				DrawLocks: false, DefaultColor: ["#50913C", "Default"], BuyGroup: "FuturisticPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"],
				FuturisticRecolor: true, Effect: [ "BlockMouth", "UseRemote"], HideItem: ["ItemNoseNoseRing"], Extended: true, DynamicScriptDraw: true,
				DynamicBeforeDraw: true, Audio: "FuturisticApply", HasType: false,
				Layer: [
					{ Name: "Ball", AllowColorize: true },
					{ Name: "Mask" , AllowColorize: true },
					{ Name: "Light" , AllowColorize: true },
					{ Name: "Lock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g0"] },
					{ Name: "LightBallLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g1"], CopyLayerColor: "Lock" },
					{ Name: "BallLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g2"], CopyLayerColor: "Lock" },
					{ Name: "PlugLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g3"], CopyLayerColor: "Lock" },
				]
			},
			{
				Name: "FuturisticHarnessPanelGag", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 15, Random: false,
				AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "Default"], BuyGroup: "FuturisticPanelGag", Prerequisite: "GagFlat",
				Hide: ["Mouth"], FuturisticRecolor: true, Effect: [ "BlockMouth", "UseRemote"], HideItem: ["ItemNoseNoseRing"], Extended: true,
				DynamicScriptDraw: true, DynamicBeforeDraw: true, Audio: "FuturisticApply", HasType: false,
				Layer: [
					{ Name: "Ball", AllowColorize: true },
					{ Name: "Straps" , AllowColorize: true },
					{ Name: "Mask" , AllowColorize: true },
					{ Name: "Light" , AllowColorize: true },
					{ Name: "Lock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g0"] },
					{ Name: "LightBallLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g1"], CopyLayerColor: "Lock" },
					{ Name: "BallLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g2"], CopyLayerColor: "Lock" },
					{ Name: "PlugLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g3"], CopyLayerColor: "Lock" },
				]
			},
			{
				Name: "FuturisticHarnessBallGag", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 15, Random: false,
				AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "Default", "Default", "Default"], BuyGroup: "FuturisticPanelGag",
				Prerequisite: "GagFlat", Hide: ["Mouth"], FuturisticRecolor: true, Effect: [ "BlockMouth", "GagLight", "UseRemote"],
				Extended: true, DynamicScriptDraw: true, DynamicBeforeDraw: true, Audio: "FuturisticApply", HasType: false,
				Layer: [
					{ Name: "Ball", AllowColorize: true },
					{ Name: "Mask" , AllowColorize: true },
					{ Name: "Straps" , AllowColorize: true },
					{ Name: "Light" , AllowColorize: true },
					{ Name: "BallHighlights", AllowColorize: false },
					{ Name: "Lock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g0"] },
					{ Name: "BallLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g1"], CopyLayerColor: "Lock" },
					{ Name: "PlugLock", LockLayer: true, AllowColorize: true, ParentGroup: null, AllowModuleTypes: ["g2"], CopyLayerColor: "Lock" },
				]
			},
			{ Name: "RegularSleepingPill", Value: -1, Enable: false, Wear: false, Bonus: "KidnapSneakiness" },
			{
				Name: "PantiesMask", Fetish: ["Lingerie"], Value: 20, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], HideItem: ["ItemNoseNoseRing"], Layer: [
					{ Name: "DarkStripes" },
					{ Name: "LightStripes" },
				]
			},
			{
				Name: "PlugGag", Fetish: ["Leather"], Value: 100, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "PlugGag", Prerequisite: "GagFlat", Extended: true,
				Hide: ["Mouth"],
				Effect: ["GagMedium", "OpenMouth"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Strap", AllowColorize: true, HasType: false },
					{ Name: "Tongue", AllowColorize: false, HasType: false },
					{ Name: "Close", CopyLayerColor: "Strap", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{
				Name: "DildoGag", Fetish: ["Leather"], Priority: 42, Value: 60, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoGag", Prerequisite: "GagUnique", AllowActivity: ["PenetrateItem"], Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"],
				DefaultColor: ["Default", "#404040"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Dildo" },
				]
			},
			{
				Name: "BoneGag", Fetish: ["Leather"], Value: 50, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "ChopstickGag", Fetish: ["Rope"], Value: 15, Difficulty: 2, Time: 10, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagNormal", "ProtrudingMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Chopsticks", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false }
				]
			},
			{
				Name: "BambooGag", Fetish: ["Rope"], Value: 30, Difficulty: 6, Time: 10, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal", "ProtrudingMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#A07858"],
				Layer: [
					{ Name: "Rod" },
					{ Name: "Rope" },
				]
			},
			{
				Name: "HarnessBallGag1", Fetish: ["Leather"], Value: 75, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false },
					{ Name: "Metal", HasType: false },
				]
			},
			{
				Name: "PumpkinGag", Fetish: ["Leather"], Value: 40, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Pumpkin" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "LipGag", Fetish: ["Leather"], Value: 40, Difficulty: 2, Time: 5, DefaultColor: ["#cc3333", "Default", "Default"], AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagLight", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Straps", AllowColorize: true },
					{ Name: "Rings", AllowColorize: true },
				]
			},
			{
				Name: "SpiderGag", Fetish: ["Leather", "Metal"], Value: 45, Difficulty: 4, Time: 5, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "ClothStuffing", Value: 10, Difficulty: -20, Time: 5, Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Cheeks", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{
				Name: "PantyStuffing", Fetish: ["Lingerie"], Value: 10, Difficulty: -20, Time: 5, DefaultColor: "#900000", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Lips", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{
				Name: "LargeDildo", Value: 20, Difficulty: -20, Time: 5, DefaultColor: "#333333", BuyGroup: "PenisDildo", Hide: ["Mouth"], ExpressionTrigger: [{ Name: "Raised", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Lips", AllowColorize: false }
				]
			},
			{ Name: "ChloroformCloth", Value: 40, Time: 2, Random: false, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: 15, Time: 10, BuyGroup: "ScarfGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], Audio: "ClothKnot", Extended: true },
			{ Name: "LewdGag", Value: 70, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "DeepthroatGag", Fetish: ["Leather"], Value: 55, Difficulty: 5, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "Raised", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Value: 75, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck"] },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Effect: ["FixedHead","BlockMouth","GagNormal"], Value: 80, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck"] },
			{
				Name: "BitGag", Fetish: ["Leather", "Pony"], Value: 40, Difficulty: 4, Time: 20, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bit" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "XLBoneGag", Fetish: ["Leather", "Pet"], Value: 60, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{ Name: "DogMuzzleExposed", Fetish: ["Leather", "Pet"], Value: 50, Difficulty: 7, Time: 10, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Block: ["ItemMouth2", "ItemMouth3"], Effect: ["BlockMouth", "GagNormal", "ProtrudingMouth"]},
			{
				Name: "FoxyHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: 40, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagEasy"], BuyGroup: "FoxyHarnessPanelGag",
				Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "BallGag", Fetish: ["Leather"], Value: 40, Difficulty: 4, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false},
				]
			},
			{
				Name: "TongueStrapGag", Fetish: ["Leather", "Metal"], Value: 35, Difficulty: 4, Time: 15, AllowLock: true, Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth", "ProtrudingMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "BallGagMask", Fetish: ["Leather"], Value: 90, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{
				Name: "HookGagMask", Fetish: ["Leather"], Value: 70, Difficulty: 6, Time: 30, AllowLock: true, Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "DildoPlugGag", Fetish: ["Leather"], Value: 100, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "PlugGag", Prerequisite: "GagUnique", Extended: true,
				Hide: ["Mouth"],
				Effect: ["GagEasy", "OpenMouth"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Strap", AllowColorize: true, HasType: false, },
					{ Name: "Tongue", AllowColorize: false, HasType: false },
					{ Name: "Close", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{ Name: "SteelMuzzleGag", Fetish: ["Metal"], Value: 80, Difficulty: 8, Time: 30, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"] },
			{ Name: "StitchedMuzzleGag", Fetish: ["Leather"], Value: 60, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Fetish: ["Latex"], Value: 65, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"] },
			{
				Name: "SockStuffing", Value: 10, Difficulty: -20, Time: 5, DefaultColor: "#FFFFFF", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Lips", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{ Name: "GasMaskGag", Fetish: ["Leather"], Priority: 53, Value: 40, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing", "ItemNosePigNose"], Effect: ["BlockMouth"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Mask"},
					{ Name: "Sides"},
					{ Name: "Highlights"},
				]
			},
			{ Name: "WebGag", Category: ["Fantasy"], Fetish: ["Tape"], Value: 30, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", CraftGroup: "Web", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "RopeGag", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 10, BuyGroup: "HempRope", CraftGroup: "HempRope", Audio: "RopeShort", Prerequisite: "GagUnique", DefaultColor: "#956B1C", Effect: ["BlockMouth", "GagLight"] },
			{ Name: "RopeBallGag", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 10, BuyGroup: "HempRope", CraftGroup: "HempRope", Audio: "RopeShort", Prerequisite: "GagUnique", Hide: ["Mouth"], DefaultColor: "#956B1C", Effect: ["BlockMouth", "GagNormal"], Extended: true },
			{ Name: "MilkBottle", Category: ["ABDL"], Fetish: ["ABDL"], Priority: 42, Value: 30, Difficulty: -50, Time: 1, Random: false, AllowLock: false, Left: 199, Top: 0, Prerequisite: "GagUnique", Effect: ["GagVeryLight", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], ParentGroup: null, Extended: true },
			{
				Name: "MedicalMask", Value: 25, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Outer" },
				]
			},
			{ Name: "RegressedMilk", Category: ["ABDL"], Fetish: ["ABDL"], Value: -1, Time: 10, IsRestraint: false,Random: false, Visible: false, BuyGroup: "RegressedMilk", Block: [], Effect: ["RegressedTalk"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }]},
			{
				Name: "PrisonLockdownGag", Value: -1, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "PrisonLockdownSuit", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"],
				DefaultColor: ["#8c4309", "Default"],
				Layer: [
					{ Name: "Mask" },
					{ Name: "Straps" },
					{ Name: "Belts" },
				]
			},
			{
				Name: "ShoeGag", Fetish: ["Leather"], Priority: 42, Value: 30, Difficulty: 4, Time: 20, DefaultColor: ["Default", "#000000" ], Random: false, BuyGroup: "ShoeGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 25 }, { Name: "Daydream", Group: "Eyes", Timer: 10 }], Layer: [
					{ Name: "Shoe" },
					{ Name: "Strap" },
				]
			},
			{
				Name: "FunnelGag", Value: 50, Difficulty: 4, Time: 20, Random: false, Prerequisite: "GagUnique", Extended: true,
				Hide: ["Mouth"],
				Effect: ["OpenMouth", "GagMedium", "ProtrudingMouth"],
				Block: ["ItemMouth2", "ItemMouth3", "ItemHood"],
				Layer: [
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Base", AllowColorize: false, HasType: false },
					{ Name: "Funnel", Priority: 55, AllowColorize: false, AllowTypes: ["Funnel"] }
				]
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 4, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", Effect: ["BlockMouth", "GagLight"]},
			{ Name: "FuturisticMuzzle", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 8, Time: 30, BuyGroup: "FuturisticPanelGag", Random: false, AllowLock: true, Audio: "FuturisticApply", FuturisticRecolor: true,
				Effect: [ "BlockMouth"], Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Extended: true, DrawLocks: false,
				Layer: [
					{ Name: "Straps", HasType: false, AllowModuleTypes: ["h1"]},
					{ Name: "Nose", HasType: false, AllowModuleTypes: ["n1"]},
					{ Name: "Mask", HasType: false,},
					{ Name: "IconLock", HasType: false, AllowModuleTypes: ["s1"]},
					{ Name: "IconMute", CopyLayerColor: "IconLock", HasType: false, AllowModuleTypes: ["s2"]},
					{ Name: "IconX", CopyLayerColor: "IconLock", HasType: false, AllowModuleTypes: ["s3"]},
				]
			},
			{
				Name: "CageMuzzle", Fetish: ["Pet", "Metal"], Value: 30, Difficulty: 4, Time: 20, BuyGroup: "CageMuzzle", Random: false, AllowLock: true, Effect: ["BlockMouth", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Muzzle" },
				]
			},
			{
				Name: "DentalGag", Fetish: ["Metal"], Value: 50, Difficulty: 5, Time: 30, Random: false, AllowLock: true, Block: ["ItemMouth2", "ItemMouth3"], Effect: ["OpenMouth", "GagLight"], Extended: true,
				Layer: [
					{ Name: "Mouth", AllowColorize: false, },
					{ Name: "Gag", AllowColorize: false, },
				],
			},
			{ Name: "Ribbons", Value: 30, Difficulty: 3, Time: 10, BuyGroup: "Ribbon", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }, { Name: "HalfOpen", Group: "Mouth", Timer: 60 }], Extended: true },
			{
				Name: "CropGag", Value: -1, Priority: 41, Difficulty: -100, Time: 2, Random: false, BuyGroup: "Crop", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Crop", AllowColorize: true, Left: 100 },
					{ Name: "Mouth", AllowColorize: false },
				]
			},
			{
				Name: "CaneGag", Value: -1, Priority: 41, Difficulty: -100, Time: 2, Random: false, BuyGroup: "Cane", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight", "ProtrudingMouth"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Cane", AllowColorize: true, Left: 80 },
					{ Name: "Mouth", AllowColorize: false },
				]
			},
			{
				Name: "PaciGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: 50, Difficulty: 4, Time: 10, Random: false, BuyGroup: "Pacigag", AllowLock: true, DrawLocks: false, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Difficulty: 6, Time: 5, RemoveTime: 5, DefaultColor: "#9221ba", Prerequisite: ["AccessMouth", "GagUnique"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Shine", AllowColorize: false },
				],
			},
			{
				Name: "OTNPlugGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Value: 120, Difficulty: 4, Time: 20, Random: false, AllowLock: true, Extended: true,
				DefaultColor: ["#665D5D", "#514D57", "#979595"],
				Hide: ["Mouth"],
				Effect: ["GagMedium", "OpenMouth"],
				ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Base", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Metal", AllowColorize: false, HasType: false },
					{ Name: "Tongue", AllowColorize: false, AllowTypes: ["", "Open"]},
					{ Name: "Plug", AllowColorize: true, AllowTypes: ["Plug"] },
				]
			},
			{
				Name: "PonyGag", Category: ["Pony"], Fetish: ["Leather", "Pony", "Pet"], Value: 150, Difficulty: 5, Time: 8, Random: false, AllowLock: true, DrawLocks: false, BuyGroup: "PonyGag", Prerequisite: "GagUnique", DefaultColor: ["Default", "Default", "#383838", "Default", "Default", "#B24031", "Default", "Default", "#B24031", "#EAEAEA","Default", "#FF95DB", "#383838", "Default", "#383838", "#956B1C", "#8A7055", "#8A7055"], Effect: [], Extended: true, AlwaysExtend: true, Bonus: "KidnapBruteForce", Top: -57, Left: 133,
				Layer: [
					// Layers: Metal, Straps, Plume, Horn, Panel
					{ Name: "BaseMetal", HasType: false},
					{ Name: "ManeB", HasType: false, AllowModuleTypes: ["t2", "t3", "t4"], InheritColor: "HairFront" },
					{ Name: "BaseStraps", HasType: false, ColorGroup: "Straps" },

					// All Gags
					{ Name: "Bit", HasType: false, AllowModuleTypes: ["g0"], CopyLayerColor: "BaseMetal" },
					{ Name: "BitLarge", HasType: false, AllowModuleTypes: ["g2"], ColorGroup: "Gag" },
					{ Name: "BitDepressor", HasType: false, AllowModuleTypes: ["g3"], CopyLayerColor: "BaseMetal" },
					{ Name: "BallLips", HasType: false, AllowModuleTypes: ["g4"], InheritColor: "Mouth", AllowColorize: true, HideColoring: true },
					{ Name: "BallStraps", HasType: false, AllowModuleTypes: ["g4"], CopyLayerColor: "BaseStraps" },
					{ Name: "Ballgag", HasType: false, AllowModuleTypes: ["g4"], ColorGroup: "Gag" },
					{ Name: "DildoLips", HasType: false, AllowModuleTypes: ["g5"], InheritColor: "Mouth", AllowColorize: true, HideColoring: true },
					{ Name: "Dildo", HasType: false, AllowModuleTypes: ["g5"], ColorGroup: "Gag" },
					{ Name: "DildoMetal", HasType: false, AllowModuleTypes: ["g5"], CopyLayerColor: "BaseMetal" },

					//ExtraStraps
					{ Name: "ExtraMetal", HasType: false, AllowModuleTypes: ["e1", "e2", "b1", "p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8"], CopyLayerColor: "BaseMetal", Priority: 55 },
					{ Name: "ExtraStraps", HasType: false, AllowModuleTypes: ["e1", "e2","b1","p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8"], CopyLayerColor: "BaseStraps", Priority: 55  },
					{ Name: "Flags", HasType: false, AllowModuleTypes: ["e2"], Priority: 55 },
					{ Name: "FlagPoles", HasType: false, AllowModuleTypes: ["e2"], AllowColorize: false, Priority: 55 },

					// All Top Pieces
					{ Name: "Plume", HasType: false, AllowModuleTypes: ["t1"] },
					{ Name: "PlumeBase", HasType: false, AllowModuleTypes: ["t1"], CopyLayerColor: "BaseMetal"},
					{ Name: "ManeL", HasType: false, AllowModuleTypes: ["t2"], InheritColor: "HairFront", HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeLFront", HasType: false, AllowModuleTypes: ["t2"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59, HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeR", HasType: false, AllowModuleTypes: ["t3"], InheritColor: "HairFront", CopyLayerColor: "ManeL", HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeRFront", HasType: false, AllowModuleTypes: ["t3"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59, HideAs: { Group: "HairAccessory1" } },
					{ Name: "Mohawk", HasType: false, AllowModuleTypes:["t4"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59 },
					{ Name: "MohawkBase", HasType: false, AllowModuleTypes:["t4"], CopyLayerColor: "BaseStraps", Priority: 59},

					//Horns
					{ Name: "Horn", HasType: false, AllowModuleTypes: ["h1"], Priority: 58 },
					{ Name: "HornShine", HasType: false, AllowModuleTypes: ["h1"],  AllowColorize: false, Priority: 58 },
					{ Name: "Horn2", HasType: false, AllowModuleTypes: ["h2"], CopyLayerColor: "Horn", Priority: 58 },
					{ Name: "Horn2Shine", HasType: false, AllowModuleTypes: ["h2"], AllowColorize: false, Priority: 58 },

					// All Panels
					{ Name: "PanelBase", HasType: false, AllowModuleTypes: ["p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8", "p9"], ColorGroup: "Straps", Priority: 55  },
					{ Name: "PanelStuds", HasType: false, AllowModuleTypes: ["p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8", "p9"], CopyLayerColor: "BaseMetal", Priority: 55 },
					{ Name: "PanelHex", HasType: false, AllowModuleTypes: ["p2"],Priority: 55 },
					{ Name: "PanelShield", HasType: false, AllowModuleTypes: ["p3"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelMoon", HasType: false, AllowModuleTypes: ["p4"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelSun", HasType: false, AllowModuleTypes: ["p5"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelHeart", HasType: false, AllowModuleTypes: ["p6"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelHorse", HasType: false, AllowModuleTypes: ["p7"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelTriskel", HasType: false, AllowModuleTypes: ["p8"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelPentacle", HasType: false, AllowModuleTypes: ["p9"], CopyLayerColor: "PanelHex", Priority: 55 },

					//Reins
					{ Name: "Reins", HasType: false, AllowModuleTypes: ["r1"], ColorGroup: "Straps" },
					{ Name: "Rope", HasType: false, AllowModuleTypes: ["r2"] },
					{ Name: "PostReins", HasType: false, AllowModuleTypes: ["r3"], CopyLayerColor: "Reins", HideAs: { Group: "ItemDevices" }, Priority: 55  },
					{ Name: "Post", HasType: false, AllowModuleTypes: ["r3"], FixedPosition: true , HideAs: { Group: "ItemDevices" }, Priority: 60 },
					{ Name: "PostReinsDetail", HasType: false, AllowModuleTypes: ["r3"], CopyLayerColor: "Reins", HideAs: { Group: "ItemDevices" } , Priority: 60 },


					//Blinders
					{ Name: "Blinders", HasType: false, AllowModuleTypes: ["b1"], ColorGroup: "Straps", Priority: 55 },
				]
			}, //PonyGag
			{
				Name: "LatexSheathGag", Fetish: ["Latex"], Value: 10, Priority: 11, Difficulty: 0, DefaultColor: ["#CC2222","#CC2222",], Top: 22, Time: 2, RemoveTime: 2, Effect: ["OpenMouth"], Extended: true, AllowExpression: ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy", "Devious", "Laughing", "Grin", "Smirk", "Pout"],
				Layer: [
					{ Name: "Base", HasType: false, MirrorExpression: "Mouth",},
					{ Name: "Shine", HasType: false, MirrorExpression: "Mouth",},
				],
			}, // LatexSheathGag
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e"], Random: false, Value: 200, Difficulty: 4, Time: 15, RemoveTime: 25, Left: 200, Top: 170, Effect: ["BlockMouth", "GagMedium"],
			},
			{ Name: "FurScarf",  Value: 40, Top: 0, Left: 0, Difficulty: 3, BuyGroup: "FurScarf", Effect: ["BlockMouth", "GagLight"] },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMouth2",
		Category: "Item",
		Priority: 36,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 0,
		Block: ["ItemMouth"],
		Effect: ["BlockMouth", "GagNormal"],
		Zone: [[200, 130, 100, 70]],
		DynamicGroupName: "ItemMouth",
		MirrorActivitiesFrom: "ItemMouth",
		Asset: [
			{ Name: "ClothGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#E0E0E0", BuyGroup: "ClothGag", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Audio: "ClothKnot", Extended: true },
			{
				Name: "WiffleGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#FF6060"],
				Extended: true,
				Layer: [
					{ Name: "Strap" , HasType: false},
					{ Name: "Ball" },
				]
			},
			{
				Name: "HarnessBallGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["#FF6060", "Default"],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Harness", HasType: false},
				]
			},
			{
				Name: "HarnessPanelGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "RingGag", Value: -1, Difficulty: 2, Time: 5, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: -1, Difficulty: -2, Time: 10, RemoveTime: 5, Random: false, BuyGroup: "DuctTape", Audio: "DuctTape", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Extended: true },
			{
				Name: "HarnessPacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Harness" },
					{ Name: "Metal" },
					{ Name: "PacifierOuter" },
					{ Name: "PacifierInner" },
				]
			},
			{
				Name: "DusterGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth", "ItemMouth3"],
				AllowActivity: ["TickleItem"],
				Layer: [
					{ Name: "Duster" },
					{ Name: "Panel" },
				]
			},
			{
				Name: "CupholderGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "CupholderGag", Hide: ["Mouth"], Extended: true, AlwaysExtend: true, AlwaysInteract: true, Effect: ["BlockMouth", "GagEasy", "ProtrudingMouth"], Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Gag", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Holder", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Cup", HasType: false, AllowTypes: ["Cup"] }
				]
			},
			{
				Name: "HarnessPonyBits", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Effect: ["BlockMouth", "GagLight"], Prerequisite: "GagUnique", Extended: true,
				Layer: [
					{ Name: "Metal" },
					{ Name: "Straps", HasType: false },
					{ Name: "Bobble", HasType: false },
				]
			},
			{
				Name: "KittyGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Pet"], Value: 20, Difficulty: -4, Time: 10, Random: false, BuyGroup: "KittyGag", DefaultColor: ["#FFFFFF", "#000000", "#E496E7"], Hide: ["Mouth"], Effect: ["BlockMouth"], Layer: [
					{ Name: "Base", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "KittyHarnessPanelGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], BuyGroup: "KittyHarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "KittyMuzzleGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], BuyGroup: "KittyMuzzleGag", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "CarrotGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Carrot" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "MuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "PantiesMask", Fetish: ["Lingerie"], Value: -1, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], Layer: [
					{ Name: "DarkStripes" },
					{ Name: "LightStripes" },
				]
			},
			{
				Name: "DildoGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoGag", Prerequisite: "GagFlat", AllowActivity: ["PenetrateItem"], Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"], Block: ["ItemMouth", "ItemMouth3"],
				DefaultColor: ["Default", "#404040"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Dildo" },
				]
			},
			{
				Name: "BoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "HarnessBallGag1", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false },
				]
			},
			{
				Name: "PumpkinGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Pumpkin" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "LipGag", Fetish: ["Leather"], Value: -1, Difficulty: 2, Time: 5, DefaultColor: ["#cc3333", "Default", "Default"], Random: false, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagLight", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Straps", AllowColorize: true },
					{ Name: "Rings", AllowColorize: true },
				]
			},
			{
				Name: "SpiderGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 4, Time: 5, Random: false, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: -1, Time: 2, Random: false, BuyGroup: "ChloroformCloth", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: -1, Time: 10, Random: false, BuyGroup: "ScarfGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], Audio: "ClothKnot", Extended: true },
			{ Name: "LewdGag", Value: -1, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth"], },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Effect: ["FixedHead", "BlockMouth", "GagNormal"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth"], },
			{
				Name: "BitGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bit" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "XLBoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "FoxyHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: 40, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagEasy"], BuyGroup: "FoxyHarnessPanelGag",
				Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "BallGag", Fetish: ["Leather"], Value: -1, Difficulty: 4, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false},
				]
			},
			{
				Name: "BallGagMask", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{ Name: "SteelMuzzleGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 8, Time: 30, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], },
			{ Name: "StitchedMuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], },
			{ Name: "LatexBallMuzzleGag", Fetish: ["Latex"], Value: -1, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], },
			{ Name: "GasMaskGag", Fetish: ["Leather"], Priority: 53, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing", "ItemNosePigNose"], Effect: ["BlockMouth"], Prerequisite: "GagFlat", Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Mask"},
					{ Name: "Sides"},
					{ Name: "Highlights"},
				]
			},
			{ Name: "WebGag", Category: ["Fantasy"], Fetish: ["Tape"], Value: -1, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", CraftGroup: "Web", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], },
			{ Name: "RopeGag", Fetish: ["Rope"], Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Audio: "RopeShort", Prerequisite: "GagUnique", DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Effect: ["BlockMouth", "GagLight"], },
			{ Name: "RopeBallGag", Fetish: ["Rope"], Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Audio: "RopeShort", Prerequisite: "GagUnique", Hide: ["Mouth"], DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Effect: ["BlockMouth", "GagNormal"], Extended: true },
			{
				Name: "MedicalMask", Value: -1, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Outer" },
				]
			},
			{ Name: "RegressedMilk", Category: ["ABDL"], Fetish: ["ABDL"], Value: -1, Time: 10, IsRestraint: false,Random: false, Visible: false, BuyGroup: "RegressedMilk", Block: [], Effect: ["RegressedTalk"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }]},
			{
				Name: "PrisonLockdownGag", Value: -1, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "PrisonLockdownSuit", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"],
				DefaultColor: ["#8c4309", "Default"],
				Layer: [
					{ Name: "Mask" },
					{ Name: "Straps" },
					{ Name: "Belts" },
				]
			},
			{
				Name: "ShoeGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, DefaultColor: ["Default", "#000000"], Random: false, BuyGroup: "ShoeGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"], Block: ["ItemMouth", "ItemMouth3"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 25 }, { Name: "Daydream", Group: "Eyes", Timer: 10 }], Layer: [
					{ Name: "Shoe" },
					{ Name: "Strap" },
				]
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 4, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", Effect: ["BlockMouth", "GagLight"]},
			{ Name: "FuturisticMuzzle", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 8, Time: 30, BuyGroup: "FuturisticPanelGag", Random: false, AllowLock: true, Audio: "FuturisticApply", FuturisticRecolor: true,
				Effect: [ "BlockMouth"], Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Block: ["ItemMouth"], Extended: true, DrawLocks: false,
				Layer: [
					{ Name: "Straps", HasType: false, AllowModuleTypes: ["h1"]},
					{ Name: "Nose", HasType: false, AllowModuleTypes: ["n1"]},
					{ Name: "Mask", HasType: false,},
					{ Name: "IconLock", HasType: false, AllowModuleTypes: ["s1"]},
					{ Name: "IconMute", CopyLayerColor: "IconLock", HasType: false, AllowModuleTypes: ["s2"]},
					{ Name: "IconX", CopyLayerColor: "IconLock", HasType: false, AllowModuleTypes: ["s3"]},
				]
			},
			{
				Name: "CageMuzzle", Fetish: ["Pet", "Metal"], Value: 30, Difficulty: 4, Time: 20, BuyGroup: "CageMuzzle", Random: false, AllowLock: true, Effect: ["BlockMouth", "ProtrudingMouth"], Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Muzzle" },
				]
			},
			{ Name: "Ribbons", Value: 30, Difficulty: 3, Time: 10, BuyGroup: "Ribbon", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }, { Name: "HalfOpen", Group: "Mouth", Timer: 60 }], Extended: true },
			{
				Name: "PaciGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: -1, Difficulty: 4, Time: 10, Random: false, BuyGroup: "Pacigag", AllowLock: true, DrawLocks: false, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: -1, Difficulty: 6, Time: 5, RemoveTime: 5, DefaultColor: "#9221ba", Prerequisite: ["AccessMouth", "GagUnique"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Shine", AllowColorize: false },
				],
			},
{
				Name: "PonyGag", Category: ["Pony"], Fetish: ["Leather", "Pony", "Pet"], Value: 150, Difficulty: 5, Time: 8, Random: false, AllowLock: true, DrawLocks: false, BuyGroup: "PonyGag", Prerequisite: "GagUnique", DefaultColor: ["Default", "Default", "#383838", "Default", "Default", "#B24031", "Default", "Default", "#B24031", "#EAEAEA","Default", "#FF95DB", "#383838", "Default", "#383838", "#956B1C", "#8A7055", "#8A7055"], Effect: [], Extended: true, AlwaysExtend: true, Bonus: "KidnapBruteForce", Top: -57, Left: 133,
				Layer: [
					// Layers: Metal, Straps, Plume, Horn, Panel
					{ Name: "BaseMetal", HasType: false},
					{ Name: "ManeB", HasType: false, AllowModuleTypes: ["t2", "t3", "t4"], InheritColor: "HairFront" },
					{ Name: "BaseStraps", HasType: false, ColorGroup: "Straps" },

					// All Gags
					{ Name: "Bit", HasType: false, AllowModuleTypes: ["g0"], CopyLayerColor: "BaseMetal" },
					{ Name: "BitLarge", HasType: false, AllowModuleTypes: ["g2"], ColorGroup: "Gag" },
					{ Name: "BitDepressor", HasType: false, AllowModuleTypes: ["g3"], CopyLayerColor: "BaseMetal" },
					{ Name: "BallLips", HasType: false, AllowModuleTypes: ["g4"], InheritColor: "Mouth", AllowColorize: true, HideColoring: true },
					{ Name: "BallStraps", HasType: false, AllowModuleTypes: ["g4"], CopyLayerColor: "BaseStraps" },
					{ Name: "Ballgag", HasType: false, AllowModuleTypes: ["g4"], ColorGroup: "Gag" },
					{ Name: "DildoLips", HasType: false, AllowModuleTypes: ["g5"], InheritColor: "Mouth", AllowColorize: true, HideColoring: true },
					{ Name: "Dildo", HasType: false, AllowModuleTypes: ["g5"], ColorGroup: "Gag" },


					//ExtraStraps
					{ Name: "ExtraMetal", HasType: false, AllowModuleTypes: ["e1", "e2", "b1", "p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8"], CopyLayerColor: "BaseMetal", Priority: 55 },
					{ Name: "ExtraStraps", HasType: false, AllowModuleTypes: ["e1", "e2","b1","p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8"], CopyLayerColor: "BaseStraps", Priority: 55  },
					{ Name: "Flags", HasType: false, AllowModuleTypes: ["e2"], Priority: 55 },
					{ Name: "FlagPoles", HasType: false, AllowModuleTypes: ["e2"], AllowColorize: false, Priority: 55 },

					// All Top Pieces
					{ Name: "Plume", HasType: false, AllowModuleTypes: ["t1"] },
					{ Name: "PlumeBase", HasType: false, AllowModuleTypes: ["t1"], CopyLayerColor: "BaseMetal"},
					{ Name: "ManeL", HasType: false, AllowModuleTypes: ["t2"], InheritColor: "HairFront", HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeLFront", HasType: false, AllowModuleTypes: ["t2"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59, HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeR", HasType: false, AllowModuleTypes: ["t3"], InheritColor: "HairFront", CopyLayerColor: "ManeL", HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeRFront", HasType: false, AllowModuleTypes: ["t3"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59, HideAs: { Group: "HairAccessory1" } },
					{ Name: "Mohawk", HasType: false, AllowModuleTypes:["t4"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59 },
					{ Name: "MohawkBase", HasType: false, AllowModuleTypes:["t4"], CopyLayerColor: "BaseStraps", Priority: 59},

					//Horns
					{ Name: "Horn", HasType: false, AllowModuleTypes: ["h1"], Priority: 58 },
					{ Name: "HornShine", HasType: false, AllowModuleTypes: ["h1"],  AllowColorize: false, Priority: 58 },
					{ Name: "Horn2", HasType: false, AllowModuleTypes: ["h2"], CopyLayerColor: "Horn", Priority: 58 },
					{ Name: "Horn2Shine", HasType: false, AllowModuleTypes: ["h2"], AllowColorize: false, Priority: 58 },

					// All Panels
					{ Name: "PanelBase", HasType: false, AllowModuleTypes: ["p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8", "p9"], ColorGroup: "Straps", Priority: 55  },
					{ Name: "PanelStuds", HasType: false, AllowModuleTypes: ["p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8", "p9"], CopyLayerColor: "BaseMetal", Priority: 55 },
					{ Name: "PanelHex", HasType: false, AllowModuleTypes: ["p2"],Priority: 55 },
					{ Name: "PanelShield", HasType: false, AllowModuleTypes: ["p3"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelMoon", HasType: false, AllowModuleTypes: ["p4"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelSun", HasType: false, AllowModuleTypes: ["p5"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelHeart", HasType: false, AllowModuleTypes: ["p6"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelHorse", HasType: false, AllowModuleTypes: ["p7"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelTriskel", HasType: false, AllowModuleTypes: ["p8"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelPentacle", HasType: false, AllowModuleTypes: ["p9"], CopyLayerColor: "PanelHex", Priority: 55 },

					//Reins
					{ Name: "Reins", HasType: false, AllowModuleTypes: ["r1"], ColorGroup: "Straps" },
					{ Name: "Rope", HasType: false, AllowModuleTypes: ["r2"] },
					{ Name: "PostReins", HasType: false, AllowModuleTypes: ["r3"], CopyLayerColor: "Reins", HideAs: { Group: "ItemDevices" }, Priority: 55  },
					{ Name: "Post", HasType: false, AllowModuleTypes: ["r3"], FixedPosition: true , HideAs: { Group: "ItemDevices" }, Priority: 60 },
					{ Name: "PostReinsDetail", HasType: false, AllowModuleTypes: ["r3"], CopyLayerColor: "Reins", HideAs: { Group: "ItemDevices" } , Priority: 60 },


					//Blinders
					{ Name: "Blinders", HasType: false, AllowModuleTypes: ["b1"], ColorGroup: "Straps", Priority: 55 },
				]
			}, //PonyGag
			{
				Name: "MouthFeatureGag", Fetish: ["Latex"], Value: 40, Difficulty: 5, Prerequisite: "GagUnique", DefaultColor: ["#222222", "#444444", "#CC2222", "#CC2222",], Top: 22 , Time: 5, RemoveTime: 7, HideItem: ["ItemMouthLatexSheathGag"], Effect: ["GagVeryLight","OpenMouth"], Extended: false, AllowExpression: ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy", "Devious", "Laughing", "Grin", "Smirk", "Pout"],
				Layer: [
					{ Name: "Panel", HasType: false,},
					{ Name: "PanelShine", HasType: false,},
					{ Name: "Base", HasType: false, MirrorExpression: "Mouth",},
					{ Name: "Shine", HasType: false, MirrorExpression: "Mouth",},
					{ Name: "Lip", HasType: false, CopyLayerColor: "Panel", MirrorExpression: "Mouth",},
					{ Name: "LipShine", HasType: false, CopyLayerColor: "PanelShine", MirrorExpression: "Mouth",},
				],
			}, // MouthFeatureGag
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e"], Random: false, Value: 200, Difficulty: 4, Time: 15, RemoveTime: 25, Left: 200, Top: 170, Effect: ["BlockMouth", "GagMedium"],
			},
			{ Name: "FurScarf",  Value: 40, Top: 0, Left: 0, Difficulty: 3, BuyGroup: "FurScarf", Effect: ["BlockMouth", "GagLight"] },

		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMouth3",
		Category: "Item",
		Priority: 37,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 0,
		Block: ["ItemMouth", "ItemMouth2"],
		Effect: ["BlockMouth", "GagNormal"],
		Zone: [[300, 130, 100, 70]],
		DynamicGroupName: "ItemMouth",
		MirrorActivitiesFrom: "ItemMouth",
		Asset: [
			{ Name: "ClothGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#E0E0E0", BuyGroup: "ClothGag", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Audio: "ClothKnot", Extended: true },
			{
				Name: "WiffleGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#FF6060"],
				Extended: true,
				Layer: [
					{ Name: "Strap" , HasType: false},
					{ Name: "Ball" },
				]
			},
			{
				Name: "HarnessBallGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["#FF6060", "Default"], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Harness", HasType: false},
				]
			},
			{
				Name: "HarnessPanelGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "RingGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 2, Time: 5, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: -1, Difficulty: -2, Time: 10, RemoveTime: 5, Random: false, BuyGroup: "DuctTape", Audio: "DuctTape", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Extended: true },
			{
				Name: "HarnessPacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Harness" },
					{ Name: "Metal" },
					{ Name: "PacifierOuter" },
					{ Name: "PacifierInner" },
				]
			},
			{
				Name: "DusterGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"],
				AllowActivity: ["TickleItem"],
				Layer: [
					{ Name: "Duster" },
					{ Name: "Panel" },
				]
			},
			{
				Name: "CupholderGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "CupholderGag", Hide: ["Mouth"], Extended: true, AlwaysExtend: true, AlwaysInteract: true, Effect: ["BlockMouth", "GagEasy", "ProtrudingMouth"],
				Layer: [
					{ Name: "Gag", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Holder", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Cup", HasType: false, AllowTypes: ["Cup"] }
				]
			},
			{
				Name: "HarnessPonyBits", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Effect: ["BlockMouth", "GagLight"], Prerequisite: "GagUnique", Extended: true,
				Layer: [
					{ Name: "Metal" },
					{ Name: "Straps", HasType: false },
					{ Name: "Bobble", HasType: false },
				]
			},
			{
				Name: "KittyGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Pet"], Value: 20, Difficulty: -4, Time: 10, Random: false, BuyGroup: "KittyGag", DefaultColor: ["#FFFFFF", "#000000", "#E496E7"], Hide: ["Mouth"], Effect: ["BlockMouth"], Layer: [
					{ Name: "Base", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "KittyHarnessPanelGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], BuyGroup: "KittyHarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "KittyMuzzleGag", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina", "GagFlat"], Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: ["#FFFFFF", "#FFFFFF", "#000000", "#E496E7"], BuyGroup: "KittyMuzzleGag", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle", AllowColorize: true, HasType: false },
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Lines", AllowColorize: true, HasType: false },
					{ Name: "Mouth", AllowColorize: true, HasType: false },
				]
			},
			{
				Name: "CarrotGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Carrot" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "MuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "PantiesMask", Fetish: ["Lingerie"], Value: -1, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], Layer: [
					{ Name: "DarkStripes" },
					{ Name: "LightStripes" },
				]
			},
			{
				Name: "DildoGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoGag", Prerequisite: "GagFlat", AllowActivity: ["PenetrateItem"], Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"],
				DefaultColor: ["Default", "#404040"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Dildo" },
				]
			},
			{
				Name: "BoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "HarnessBallGag1", Value: -1, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false },
				]
			},
			{
				Name: "PumpkinGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Pumpkin" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "LipGag", Fetish: ["Leather"], Value: -1, Difficulty: 2, Time: 5, DefaultColor: ["#cc3333", "Default", "Default"], Random: false, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagLight", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Straps", AllowColorize: true },
					{ Name: "Rings", AllowColorize: true },
				]
			},
			{
				Name: "SpiderGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 4, Time: 5, Random: false, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: -1, Time: 2, Random: false, BuyGroup: "ChloroformCloth", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }], },
			{ Name: "ScarfGag", Value: -1, Time: 10, Random: false, BuyGroup: "ScarfGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], Audio: "ClothKnot", Extended: true },
			{ Name: "LewdGag", Value: -1, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth", "ItemMouth2"], },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Effect: ["FixedHead", "BlockMouth", "GagNormal"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth", "ItemMouth2"], },
			{
				Name: "BitGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bit" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "XLBoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "FoxyHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: 40, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagEasy"], BuyGroup: "FoxyHarnessPanelGag",
				Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "BallGag", Fetish: ["Leather"], Value: -1, Difficulty: 4, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false},
				]
			},
			{
				Name: "BallGagMask", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{ Name: "SteelMuzzleGag", Fetish: ["Metal"], Value: -1, Difficulty: 8, Time: 30, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"] },
			{ Name: "StitchedMuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Fetish: ["Latex"], Value: -1, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"] },
			{ Name: "GasMaskGag", Fetish: ["Leather"], Priority: 53, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing", "ItemNosePigNose"], Effect: ["BlockMouth"], Prerequisite: "GagFlat", Block: ["ItemMouth", "ItemMouth2"],
				Layer: [
					{ Name: "Mask"},
					{ Name: "Sides"},
					{ Name: "Highlights"},
				]
			},
			{ Name: "WebGag", Category: ["Fantasy"], Fetish: ["Tape"], Value: -1, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", CraftGroup: "Web", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "RopeGag", Fetish: ["Rope"], Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Audio: "RopeShort", Prerequisite: "GagUnique", DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Effect: ["BlockMouth", "GagLight"] },
			{ Name: "RopeBallGag", Fetish: ["Rope"], Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Audio: "RopeShort", Prerequisite: "GagUnique", Hide: ["Mouth"], DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Effect: ["BlockMouth", "GagNormal"], Extended: true },
			{
				Name: "MedicalMask", Value: -1, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Outer" },
				]
			},
			{ Name: "RegressedMilk", Category: ["ABDL"], Fetish: ["ABDL"], Value: -1, Time: 10, IsRestraint: false,Random: false, Visible: false, BuyGroup: "RegressedMilk", Block: [], Effect: ["RegressedTalk"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "PrisonLockdownGag", Value: -1, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "PrisonLockdownSuit", Prerequisite: "GagFlat", DefaultColor: ["#8c4309", "Default"], Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Mask" },
					{ Name: "Straps" },
					{ Name: "Belts" },
				]
			},
			{
				Name: "ShoeGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, DefaultColor: ["Default", "#000000"], Random: false, BuyGroup: "ShoeGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 25 }, { Name: "Daydream", Group: "Eyes", Timer: 10 }], Layer: [
					{ Name: "Shoe" },
					{ Name: "Strap" },
				]
			},
			{ Name: "FuturisticMuzzle", Category: ["SciFi"], Fetish: ["Metal"], Priority: 42, Value: -1, Difficulty: 8, Time: 30, BuyGroup: "FuturisticPanelGag", Random: false, AllowLock: true, Audio: "FuturisticApply", FuturisticRecolor: true,
				Effect: [ "BlockMouth"], Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Block: ["ItemMouth", "ItemMouth2"], Extended: true, DrawLocks: false,
				Layer: [
					{ Name: "Straps", HasType: false, AllowModuleTypes: ["h1"]},
					{ Name: "Nose", HasType: false, AllowModuleTypes: ["n1"]},
					{ Name: "Mask", HasType: false,},
					{ Name: "IconLock", HasType: false, AllowModuleTypes: ["s1"]},
					{ Name: "IconMute", CopyLayerColor: "IconLock", HasType: false, AllowModuleTypes: ["s2"]},
					{ Name: "IconX", CopyLayerColor: "IconLock", HasType: false, AllowModuleTypes: ["s3"]},
				]
			},
			{
				Name: "CageMuzzle", Fetish: ["Pet", "Metal"], Value: 30, Difficulty: 4, Time: 20, BuyGroup: "CageMuzzle", Random: false, AllowLock: true, Effect: ["BlockMouth", "ProtrudingMouth"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Muzzle" },
				]
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 4, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", Effect: ["BlockMouth", "GagLight"]},
			{ Name: "Ribbons", Value: 30, Difficulty: 3, Time: 10, BuyGroup: "Ribbon", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }, { Name: "HalfOpen", Group: "Mouth", Timer: 60 }], Extended: true },
			{
				Name: "PaciGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: -1, Difficulty: 4, Time: 10, Random: false, BuyGroup: "Pacigag", AllowLock: true, DrawLocks: false,Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: -1, Difficulty: 6, Time: 5, RemoveTime: 5, DefaultColor: "#9221ba", Prerequisite: ["AccessMouth", "GagUnique"], Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Shine", AllowColorize: false },
				],
			},
			{
				Name: "PonyGag", Category: ["Pony"], Fetish: ["Leather", "Pony", "Pet"], Value: 150, Difficulty: 5, Time: 8, Random: false, AllowLock: true, DrawLocks: false, BuyGroup: "PonyGag", Prerequisite: "GagUnique", DefaultColor: ["Default", "Default", "#383838", "Default", "Default", "#B24031", "Default", "Default", "#B24031", "#EAEAEA","Default", "#FF95DB", "#383838", "Default", "#383838", "#956B1C", "#8A7055", "#8A7055"], Effect: [], Extended: true, AlwaysExtend: true, Bonus: "KidnapBruteForce", Top: -57, Left: 133,
				Layer: [
					// Layers: Metal, Straps, Plume, Horn, Panel
					{ Name: "BaseMetal", HasType: false},
					{ Name: "ManeB", HasType: false, AllowModuleTypes: ["t2", "t3", "t4"], InheritColor: "HairFront" },
					{ Name: "BaseStraps", HasType: false, ColorGroup: "Straps" },

					// All Gags
						{ Name: "Bit", HasType: false, AllowModuleTypes: ["g0"], CopyLayerColor: "BaseMetal" },
					{ Name: "BitLarge", HasType: false, AllowModuleTypes: ["g2"], ColorGroup: "Gag" },
					{ Name: "BitDepressor", HasType: false, AllowModuleTypes: ["g3"], CopyLayerColor: "BaseMetal" },
					{ Name: "BallLips", HasType: false, AllowModuleTypes: ["g4"], InheritColor: "Mouth", AllowColorize: true, HideColoring: true },
					{ Name: "BallStraps", HasType: false, AllowModuleTypes: ["g4"], CopyLayerColor: "BaseStraps" },
					{ Name: "Ballgag", HasType: false, AllowModuleTypes: ["g4"], ColorGroup: "Gag" },
					{ Name: "DildoLips", HasType: false, AllowModuleTypes: ["g5"], InheritColor: "Mouth", AllowColorize: true, HideColoring: true },
					{ Name: "Dildo", HasType: false, AllowModuleTypes: ["g5"], ColorGroup: "Gag" },


					//ExtraStraps
					{ Name: "ExtraMetal", HasType: false, AllowModuleTypes: ["e1", "e2", "b1", "p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8"], CopyLayerColor: "BaseMetal", Priority: 55 },
					{ Name: "ExtraStraps", HasType: false, AllowModuleTypes: ["e1", "e2","b1","p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8"], CopyLayerColor: "BaseStraps", Priority: 55  },
					{ Name: "Flags", HasType: false, AllowModuleTypes: ["e2"], Priority: 55 },
					{ Name: "FlagPoles", HasType: false, AllowModuleTypes: ["e2"], AllowColorize: false, Priority: 55 },

					// All Top Pieces
					{ Name: "Plume", HasType: false, AllowModuleTypes: ["t1"] },
					{ Name: "PlumeBase", HasType: false, AllowModuleTypes: ["t1"], CopyLayerColor: "BaseMetal"},
					{ Name: "ManeL", HasType: false, AllowModuleTypes: ["t2"], InheritColor: "HairFront", HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeLFront", HasType: false, AllowModuleTypes: ["t2"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59, HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeR", HasType: false, AllowModuleTypes: ["t3"], InheritColor: "HairFront", CopyLayerColor: "ManeL", HideAs: { Group: "HairAccessory1" } },
					{ Name: "ManeRFront", HasType: false, AllowModuleTypes: ["t3"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59, HideAs: { Group: "HairAccessory1" } },
					{ Name: "Mohawk", HasType: false, AllowModuleTypes:["t4"], InheritColor: "HairFront", CopyLayerColor: "ManeL", Priority: 59 },
					{ Name: "MohawkBase", HasType: false, AllowModuleTypes:["t4"], CopyLayerColor: "BaseStraps", Priority: 59},

					//Horns
					{ Name: "Horn", HasType: false, AllowModuleTypes: ["h1"], Priority: 58 },
					{ Name: "HornShine", HasType: false, AllowModuleTypes: ["h1"],  AllowColorize: false, Priority: 58 },
					{ Name: "Horn2", HasType: false, AllowModuleTypes: ["h2"], CopyLayerColor: "Horn", Priority: 58 },
					{ Name: "Horn2Shine", HasType: false, AllowModuleTypes: ["h2"], AllowColorize: false, Priority: 58 },

					// All Panels
					{ Name: "PanelBase", HasType: false, AllowModuleTypes: ["p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8", "p9"], ColorGroup: "Straps", Priority: 55  },
					{ Name: "PanelStuds", HasType: false, AllowModuleTypes: ["p1", "p2","p3" ,"p4" ,"p5" ,"p6" ,"p7" ,"p8", "p9"], CopyLayerColor: "BaseMetal", Priority: 55 },
					{ Name: "PanelHex", HasType: false, AllowModuleTypes: ["p2"],Priority: 55 },
					{ Name: "PanelShield", HasType: false, AllowModuleTypes: ["p3"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelMoon", HasType: false, AllowModuleTypes: ["p4"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelSun", HasType: false, AllowModuleTypes: ["p5"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelHeart", HasType: false, AllowModuleTypes: ["p6"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelHorse", HasType: false, AllowModuleTypes: ["p7"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelTriskel", HasType: false, AllowModuleTypes: ["p8"], CopyLayerColor: "PanelHex", Priority: 55 },
					{ Name: "PanelPentacle", HasType: false, AllowModuleTypes: ["p9"], CopyLayerColor: "PanelHex", Priority: 55 },

					//Reins
					{ Name: "Reins", HasType: false, AllowModuleTypes: ["r1"], ColorGroup: "Straps" },
					{ Name: "Rope", HasType: false, AllowModuleTypes: ["r2"] },
					{ Name: "PostReins", HasType: false, AllowModuleTypes: ["r3"], CopyLayerColor: "Reins", HideAs: { Group: "ItemDevices" }, Priority: 55  },
					{ Name: "Post", HasType: false, AllowModuleTypes: ["r3"], FixedPosition: true , HideAs: { Group: "ItemDevices" }, Priority: 60 },
					{ Name: "PostReinsDetail", HasType: false, AllowModuleTypes: ["r3"], CopyLayerColor: "Reins", HideAs: { Group: "ItemDevices" } , Priority: 60 },


					//Blinders
					{ Name: "Blinders", HasType: false, AllowModuleTypes: ["b1"], ColorGroup: "Straps", Priority: 55 },
				]
			}, //PonyGag 3
			{
				Name: "Stitches", Category: ["Medical", "Extreme"], Priority: 10, BuyGroup: "Suture", Random: false, Value: 20, Difficulty: 8, Time: 5, RemoveTime: 5, Left: 235, Top: 180, DefaultColor: ["Default", "#3f3c3a"], Hide: ["Mouth"], Prerequisite: ["GagUnique"], Effect: ["GagHeavy"], Extended: true, AlwaysExtend: true,
				AllowExpression: ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy", "Devious", "Laughing", "Grin", "Smirk", "Pout"],
				Layer: [
					{ Name: "FakeMouth", HasType: false, InheritColor: "Mouth", AllowTypes: ["Straight", "ZigZag", "Skewed", "Cross"], MirrorExpression: "Mouth"},
					{ Name: "Straight", HasType: false, AllowTypes: ["Straight"], MirrorExpression: "Mouth"},
					{ Name: "ZigZag", HasType: false, CopyLayerColor: "Straight", AllowTypes: ["ZigZag"], MirrorExpression: "Mouth"},
					{ Name: "Skewed", HasType: false, CopyLayerColor: "Straight", AllowTypes: ["Skewed"], MirrorExpression: "Mouth"},
					{ Name: "Cross", HasType: false, CopyLayerColor: "Straight", AllowTypes: ["Cross"], MirrorExpression: "Mouth" },
				],
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e"], Random: false, Value: 200, Difficulty: 4, Time: 15, RemoveTime: 25, Left: 200, Top: 170, Effect: ["BlockMouth", "GagMedium"],
			},
			{ Name: "FurScarf",  Value: 40, Top: 0, Left: 0, Difficulty: 3, BuyGroup: "FurScarf", Effect: ["BlockMouth", "GagLight"] },
			{
				Name: "LatexRespirator", Value: 50, Difficulty: 2, Time: 10, DefaultColor: ["#333333","#222222","#CCCCCC","#222222","#CCCCCC","#37E21D"], Extended: true, Priority: 47, Top: 20,
				Block: ["ItemNose", "ItemMouth", "ItemMouth2"],
				Effect: [],
				Layer: [ // Color Layers -- Straps, Base, RoundedShine, Filter, FilterFixing

					{ Name: "Straps", HasType: false, AllowModuleTypes:["s1"],},
					{ Name: "StrapShade", HasType: false, AllowModuleTypes:["s1"],AllowColorize: false,},

					{ Name: "Base", HasType: false, AllowModuleTypes:["m0","m1"], },
					{ Name: "Shade", HasType: false, AllowColorize: false, AllowModuleTypes:["m0","m1"],},
					{ Name: "RoundedShine", HasType: false, AllowModuleTypes:["m0","m1"],},

					{ Name: "Filter", HasType: false, AllowModuleTypes: ["f1l0"]},
					{ Name: "FilterFixing", HasType: false, AllowModuleTypes: ["f1l0"]},
					{ Name: "FilterGlow", HasType: false, AllowModuleTypes: ["f1g1l0"]},
					{ Name: "Filter", HasType: false, AllowModuleTypes: ["f1l1"], Priority: 55},
					{ Name: "FilterFixing", HasType: false, AllowModuleTypes: ["f1l1"], Priority: 55},
					{ Name: "FilterGlow", HasType: false, AllowModuleTypes: ["f1g1l1"],Priority: 55},

					{ Name: "SmallTubeFixing", HasType: false, AllowModuleTypes: ["f2"], CopyLayerColor: "FilterFixing"},
					{ Name: "SmallTube", HasType: false, AllowModuleTypes: ["f2l0"], CopyLayerColor: "Filter"},
					{ Name: "SmallTube", HasType: false, AllowModuleTypes: ["f2l1"], CopyLayerColor: "Filter", Priority: 55},
					{ Name: "SmallTubeBack", HasType: false, AllowModuleTypes: ["f2"], CopyLayerColor: "Filter", Priority: 6},
					{ Name: "SmallTubeGlow", HasType: false, AllowModuleTypes: ["f2g1l0"], CopyLayerColor: "FilterGlow"},
					{ Name: "SmallTubeGlow", HasType: false, AllowModuleTypes: ["f2g1l1"], CopyLayerColor: "FilterGlow", Priority: 55},

					{ Name: "TubeFixing", HasType: false, AllowModuleTypes: ["f3"], CopyLayerColor: "FilterFixing"},
					{ Name: "Tube", HasType: false, AllowModuleTypes: ["f3l0"], CopyLayerColor: "Filter"},
					{ Name: "Tube", HasType: false, AllowModuleTypes: ["f3l1"], CopyLayerColor: "Filter", Priority: 55},
					{ Name: "TubeBack", HasType: false, AllowModuleTypes: ["f3"], CopyLayerColor: "Filter", Priority: 6},
					{ Name: "TubeGlow", HasType: false, AllowModuleTypes: ["f3g1l0"], CopyLayerColor: "FilterGlow"},
					{ Name: "TubeGlow", HasType: false, AllowModuleTypes: ["f3g1l1"], CopyLayerColor: "FilterGlow", Priority: 55 },
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemHead",
		Category: "Item",
		Priority: 44,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 20,
		Zone: [[175, 0, 150, 65]],
		Asset: [
			{ Name: "ClothBlindfold", Value: 15, Time: 10, RemoveTime: 5, DefaultColor: "#A0A0A0", Hide: ["Glasses"], Effect: ["BlindLight", "Prone", "BlurLight"], Audio: "ClothKnot", Tint: [{Color: 0, Strength: 0.25}]},
			{ Name: "ScarfBlindfold", Value: 15, Time: 15, DefaultColor: "Default", BuyGroup: "ScarfGag", Audio: "ClothKnot", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "LeatherBlindfold", Fetish: ["Leather"], Value: 30, Time: 5, AllowLock: true, DefaultColor: "#404040", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "PaddedBlindfold", Fetish: ["Leather"], Value: 35, Time: 5, AllowLock: true, DefaultColor: ["#545454", "#808080"], Hide: ["Glasses"], Effect: ["BlindHeavy", "Prone"],
				Layer: [
					{ Name: "Trim", HasType: false},
					{ Name: "Base", HasType: false},
				]
			},
			{ Name: "InteractiveVisor", Category: ["SciFi"], Fetish: ["Metal"], Priority: 34, BuyGroup: "FuturisticVisor", Difficulty: 6, Value: 50, Time: 6, Random: false, AllowLock: true, FuturisticRecolor: true, Extended: true,  Audio: "FuturisticApply",
				HideItem: ["ItemNoseNoseRing", "MaskFuturisticVisor"],
				Effect: ["UseRemote"],
				Tint: [{ Color: 0, Strength: 0.1 }],
				DefaultTint: "#2d58bc"
			},
			{ Name: "FuturisticMask", Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["#4040CB", "#FFFFFF", "#FFFFFF"], Priority: 41, BuyGroup: "FuturisticVisor", Difficulty: 7, Value: -1, Time: 7, Random: false, AllowLock: true, DrawLocks: false, HideItem: ["ItemNoseNoseRing", "MaskFuturisticVisor"], FuturisticRecolor: true, FuturisticRecolorDisplay: true,
				Effect: ["UseRemote", "BlockMouth"], Extended: true,  Audio: "FuturisticApply",
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose"] ,
				Layer: [
					{ Name: "Display", HasType: true},
					{ Name: "Text", HasType: true, AllowTypes: ["LightTint", "Blind", "HeavyTint"]},
					{ Name: "Lock", HasType: false, LockLayer: true, AllowTypes: ["LightTint", "", "HeavyTint"]},
				],
				Tint: [{Color: 0, Strength: 0.1}],
			},
			{ Name: "InteractiveVRHeadset", Difficulty: 6, Value: 80, Time: 3, DefaultColor: ["Default", "Default"], Random: false, AllowLock: true, DrawLocks: false, Hide: ["Mask", "Glasses"], HideItem: ["ItemNoseNoseRing"], FuturisticRecolor: true,
				Effect: ["VR"], AllowEffect: ["BlindHeavy", "BlindTotal", "Prone", "VRAvatars", "HideRestraints", "KinkyDungeonParty"], Extended: true, AlwaysExtend: true, Audio: "FuturisticApply",
				Layer: [
					{ Name: "Body", HasType: false},
					{ Name: "Display", HasType: false},
				]
			},
			{ Name: "LeatherSlimMask", Fetish: ["Leather"], Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3"], Effect: ["BlindHeavy", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose"] },
			{ Name: "LeatherSlimMaskOpenMouth", Fetish: ["Leather"], Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["Glasses"], HideItem: ["ItemNosePigNose"], Effect: ["BlindHeavy", "Prone"], Block: ["ItemEars", "ItemNose"] },
			{ Name: "LeatherSlimMaskOpenEyes", Fetish: ["Leather"], Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3"], Effect: ["GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose"] },
			{ Name: "StuddedBlindfold", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 2, Time: 5, AllowLock: true, DefaultColor: "#FF4040", Bonus: "KidnapSneakiness", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "KittyBlindfold", Gender: "F", Prerequisite: ["HasBreasts", "HasVagina"], Fetish: ["Pet"], Value: 40, Time: 5, AllowLock: true, DefaultColor: ["#FFFFFF","#000000","#E48FE9"], Hide: ["Glasses"], Effect: ["BlindLight", "Prone"], Audio: "ClothSlip",
				Layer: [
					{ Name: "Base", AllowColorize: true, HasType: false },
					{ Name: "Eyes", AllowColorize: true, HasType: false },
					{ Name: "Ears", AllowColorize: true, HasType: false },
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", Audio: "DuctTapeRollShort", Hide: ["Glasses"], Extended: true, Alpha: [{ Group: ["ItemMouth", "ItemMouth2", "ItemMouth3"], Masks: [[0, 220, 500, 500]], Type: ["Mummy", "Open"] }] },
			{ Name: "SmallBlindfold", Fetish: ["Leather"], Value: 40, Time: 5, AllowLock: true, DefaultColor: "#404040", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "FullBlindfold", Fetish: ["Latex"], Priority: 30, Value: 40, Difficulty: 6, Time: 5, AllowLock: true, DefaultColor: "#353535", Hide: ["Glasses"], Effect: ["BlindHeavy", "Prone"] },
			{ Name: "LewdBlindfold", Priority: 30, Value: 45, Time: 5, Random: false, AllowLock: true, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], Audio: "ClothSlip",  ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "LatexBlindfold", Fetish: ["Latex"], Value: 35, Time: 5, AllowLock: true, Hide: ["Glasses", "Mask"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "FrilledSleepMask", Fetish: ["Lingerie"], Value: 5, Time: 5, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], Audio: "ClothSlip",
				Layer: [
					{ Name: "Frills" },
					{ Name: "Mask" },
				]
			},
			{ Name: "BlackoutLenses", Priority: 9, Value: 60, Difficulty: 10, Random: false, DefaultColor: "#333333", OverrideBlinking: true, Hide: ["Eyes", "Eyes2"], Block: [], Effect: ["BlindHeavy", "Prone"], AllowExpression: ["Closed"],
				Layer: [
					{ Name: "Left", MirrorExpression: "Eyes" },
					{ Name: "Right", MirrorExpression: "Eyes2" },
				]
			},
			{ Name: "WebBlindfold", Category: ["Fantasy"], Fetish: ["Tape"], Value: 50, Difficulty: 5, Time: 10, RemoveTime: 20, Random: false, CraftGroup: "Web", Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], Extended: true },
			{ Name: "RopeBlindfold", Fetish: ["Rope"], Value: 60, Time: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", CraftGroup: "HempRope", Audio: "RopeShort", Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			{ Name: "SleepMask", Value: 5, Time: 5, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], Audio: "ClothSlip" },
			{ Name: "PrisonLockdownBlindfold", Priority: 34, Value: -1, Time: 5, BuyGroup: "PrisonLockdownSuit", DefaultColor: "#77511f", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "Pantyhose", Value: 10, Time: 5, Hide: ["Glasses", "Mask", "HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3"], BuyGroup: "Pantyhose", Effect: ["BlindLight", "Prone"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNose"], Audio: "ClothSlip", Tint: [{Color: 0, Strength: 0.2}], DefaultTint: "#765d4e" },
			{
				Name: "Snorkel", Priority: 55, Value: 30, Top: 30, Difficulty: 5, Time: 15, Random: false, AllowLock: true, Block: [],
				Layer: [
					{ Name: "Mask", AllowColorize: false },
					{ Name: "Tube", Priority: 56, AllowColorize: true },
				]
			},
			{ Name: "Ribbons", Fetish: ["Lingerie"], Value: 30, Difficulty: 5, Time: 10, RemoveTime: 5, BuyGroup: "Ribbon", Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], Extended: true },
			{
				Name: "Tentacles", Category: ["Fantasy"], BuyGroup: "Tentacles", Random: false, Value: 250, Difficulty: 6, Time: 5, RemoveTime: 5, DefaultColor: "#9221ba", Hide: ["Glasses", "Mask"], Effect: ["BlindNormal", "Prone"],
				Layer: [
					{ Name: "Tentacles" },
					{ Name: "Shine", AllowColorize: false },
				],
			},
			{
				Name: "MedicalPatch", Value: 20, Difficulty: 1, Priority: 25, Time: 3, RemoveTime: 5, DefaultColor: ["#ECC7A1","#ECC7A1","#B459A6","#B459A6",], Extended: true,
				Layer: [
					{ Name: "Right" , HasType: false, AllowModuleTypes: ["e0","e1"] },
					{ Name: "Left" , HasType: false, AllowModuleTypes: ["e0","e2"] },
					{ Name: "RightHeart", HasType: false, AllowModuleTypes: ["e0r1","e1r1"] },
					{ Name: "LeftHeart", HasType: false, AllowModuleTypes: ["e0l1","e2l1"] },
					{ Name: "RightStripes", HasType: false, AllowModuleTypes: ["e0r2","e1r2"], CopyLayerColor: "RightHeart" },
					{ Name: "LeftStripes", HasType: false, AllowModuleTypes: ["e0l2","e2l2"], CopyLayerColor: "LeftHeart" },
					{ Name: "RightX", HasType: false, AllowModuleTypes: ["e0r3","e1r3"], CopyLayerColor: "RightHeart" },
					{ Name: "LeftX", HasType: false, AllowModuleTypes: ["e0l3","e2l3"], CopyLayerColor: "LeftHeart" },
					{ Name: "RightTeddy", HasType: false, AllowModuleTypes: ["e0r4","e1r4"], CopyLayerColor: "RightHeart" },
					{ Name: "LeftTeddy", HasType: false, AllowModuleTypes: ["e0l4","e2l4"], CopyLayerColor: "LeftHeart" },
				],
			},
			{
				Name: "DroneMask", Category: ["SciFi"], Fetish: ["Latex"], Value: 90, Difficulty: 5, DefaultColor: ["#222222", "#CCCCCC", "#7F7F7F", "#00F4FD", "#E700CA", ], Time: 10, AllowLock: true, DrawLocks: false, Extended: true, DynamicAfterDraw: true,
				BuyGroup: "DroneMask",
				Block:["ItemNose"],
				Hide: ["Glasses", "Blush"],
				HideItem: ["HatFacePaint", "MaskFacePaint", "ClothAccessoryFacePaint"],
				TextMaxLength: { Text: 16 },
				TextFont: "Impact",
				Layer: [ // Colors layer references: Base, Shine, EyeRegular, MouthOnahole, Barcode
					{ Name: "Base", HasType: false, AllowModuleTypes: ["h0"] },
					{ Name: "Shine", HasType: false, AllowModuleTypes: ["h0"] },
					{ Name: "BaseHelm", HasType: false, AllowModuleTypes: ["h1","h2"], CopyLayerColor: "Base", Alpha: [{ Masks: [[0, 0, 500, 200]], Group: ["Head"] }], },
					{ Name: "ShineHelm", HasType: false, AllowModuleTypes: ["h1","h2"], CopyLayerColor: "Shine" },

					// All Non-part-reliant Patterns
					{ Name: "Barcode", HasType: false, AllowModuleTypes: ["p1"]},
					{ Name: "Scarab", HasType: false, AllowModuleTypes: ["p2"], CopyLayerColor: "Barcode"},
					{ Name: "Hexagon", HasType: false, AllowModuleTypes: ["p3"], CopyLayerColor: "Barcode"},
					{ Name: "TwoLines", HasType: false, AllowModuleTypes: ["p4"], CopyLayerColor: "Barcode"},
					{ Name: "Text", HasImage: false, CopyLayerColor: "Barcode"},

					// All Eyes
					{ Name: "EyeRegularShine", HasType: false, AllowModuleTypes: ["e1"], CopyLayerColor: "Shine" },
					{ Name: "EyeRegular", HasType: false, AllowModuleTypes: ["e1"], },
					{ Name: "EyeRegularGlow", HasType: false, AllowModuleTypes: ["e1g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeSpiralShine", HasType: false, AllowModuleTypes: ["e2"], CopyLayerColor: "Shine" },
					{ Name: "EyeSpiral", HasType: false, AllowModuleTypes: ["e2"], CopyLayerColor: "EyeRegular" },
					{ Name: "EyeSpiralGlow", HasType: false, AllowModuleTypes: ["e2g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeSmileShine", HasType: false, AllowModuleTypes: ["e3"], CopyLayerColor: "Shine" },
					{ Name: "EyeSmile", HasType: false, AllowModuleTypes: ["e3"], CopyLayerColor: "EyeRegular" },
					{ Name: "EyeSmileGlow", HasType: false, AllowModuleTypes: ["e3g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeHolesShine", HasType: false, AllowModuleTypes: ["e4"], CopyLayerColor: "Shine" },
					{ Name: "EyeHoles", HasType: false, AllowModuleTypes: ["e4"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeSculpted", HasType: false, AllowModuleTypes: ["e5"], CopyLayerColor: "EyeRegular" },
					{ Name: "EyeSculptedShine", HasType: false, AllowModuleTypes: ["e5"], CopyLayerColor: "Shine" },
					{ Name: "EyeSculptedGlow", HasType: false, AllowModuleTypes: ["e5g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeConcave", HasType: false, AllowModuleTypes: ["e6"], CopyLayerColor: "Base"},
					{ Name: "EyeConcaveShine", HasType: false, AllowModuleTypes: ["e6"], CopyLayerColor: "Shine"},

					// All Mouths
					{ Name: "MouthOnahole", HasType: false, AllowModuleTypes: ["m1"]},

					{ Name: "MouthFleshlightShine", HasType: false, AllowModuleTypes: ["m2"], CopyLayerColor: "Shine" },
					{ Name: "MouthFleshlight", HasType: false, AllowModuleTypes: ["m2"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthSmileShine", HasType: false, AllowModuleTypes: ["m3"], CopyLayerColor: "Shine" },
					{ Name: "MouthSmile", HasType: false, AllowModuleTypes: ["m3"], CopyLayerColor: "MouthOnahole" },
					{ Name: "MouthSmileGlow", HasType: false, AllowModuleTypes: ["m3g1"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthHolesShine", HasType: false, AllowModuleTypes: ["m4"], CopyLayerColor: "Shine" },
					{ Name: "MouthHoles", HasType: false, AllowModuleTypes: ["m4"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthSculpted", HasType: false, AllowModuleTypes: ["m5"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthSubtle", HasType: false, AllowModuleTypes: ["m6"], CopyLayerColor: "MouthOnahole" },
				],
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e"], Random: false, Value: 200, Difficulty: 4, Time: 15, RemoveTime: 25, Effect: ["BlindLight", "Prone", "BlurNormal"], Tint: [{Color: 0, Strength: 0.4}]
			},
			{ Name: "FurScarf", BuyGroup: "FurScarf", Value: 40, Difficulty: 3, Effect: ["BlindLight", "Prone"] },
			{
				Name: "Stitches", Category: ["Medical", "Extreme"], Priority: 8.5, BuyGroup: "Suture", Random: false, Value: -1, Difficulty: 8, Time: 5, RemoveTime: 5, DefaultColor: ["#3f3c3a", "#3f3c3a"], Effect: [], Top:145, Extended: true, AlwaysExtend: true,
				AllowExpression: ["Angry", "Closed", "Daydream", "Dazed", "Dizzy", "Heart", "HeartPink", "Horny", "Lewd", "LewdHeart", "LewdHeartPink", "Sad", "Scared", "Scared", "Shy", "ShylyHappy", "Surprised", "VeryLewd"],
				Layer: [
					{ Name: "FakeEye", HasType: false, AllowColorize: false, AllowModuleTypes: ["m0r0l0", "m0r0l1", "m0r0l2", "m0r0l3", "m0r1l0","m0r1l1","m0r1l2","m0r1l3", "m0r2l0","m0r2l1","m0r2l2","m0r2l3", "m0r3l0", "m0r3l1", "m0r3l2", "m0r3l3", "m2r0l0", "m2r0l1", "m2r0l2", "m2r0l3", "m2r1l0","m2r1l1","m2r1l2","m2r1l3", "m2r2l0","m2r2l1","m2r2l2","m2r2l3", "m2r3l0", "m2r3l1", "m2r3l2", "m2r3l3"], MirrorExpression: "Eyes", Left: 200},
					{ Name: "FakeEye2", HasType: false, AllowColorize: false, AllowModuleTypes: ["m1r0l0", "m1r0l1", "m1r0l2", "m1r0l3", "m1r1l0","m1r1l1","m1r1l2","m1r1l3", "m1r2l0","m1r2l1","m1r2l2","m1r2l3", "m1r3l0", "m1r3l1", "m1r3l2", "m1r3l3", "m2r0l0", "m2r0l1", "m2r0l2", "m2r0l3", "m2r1l0","m2r1l1","m2r1l2","m2r1l3", "m2r2l0","m2r2l1","m2r2l2","m2r2l3", "m2r3l0", "m2r3l1", "m2r3l2", "m2r3l3"], MirrorExpression: "Eyes2", Left: 250},
					{ Name: "Straight", HasType: false, AllowTypes: ["m0r0l0", "m0r0l1", "m0r0l2", "m0r0l3", "m2r0l0", "m2r0l1", "m2r0l2", "m2r0l3" ], MirrorExpression: "Eyes", Left: 200},
					{ Name: "ZigZag", HasType: false, CopyLayerColor: "Straight", AllowModuleTypes: ["m0r1l0", "m0r1l1", "m0r1l2", "m0r1l3", "m2r1l0", "m2r1l1", "m2r1l2", "m2r1l3" ], MirrorExpression: "Eyes", Left: 200},
					{ Name: "Skewed", HasType: false, CopyLayerColor: "Straight", AllowModuleTypes: ["m0r2l0", "m0r2l1", "m0r2l2", "m0r2l3", "m2r2l0", "m2r2l1", "m2r2l2", "m2r2l3"], MirrorExpression: "Eyes", Left: 200},
					{ Name: "Cross", HasType: false, CopyLayerColor: "Straight", AllowModuleTypes: ["m0r3l0", "m0r3l1", "m0r3l2", "m0r3l3", "m2r3l0", "m2r3l1", "m2r3l2", "m2r3l3"], MirrorExpression: "Eyes", Left: 200},
					{ Name: "Straight2", HasType: false, AllowTypes: ["m1r0l0", "m1r1l0", "m1r2l0", "m1r3l0", "m2r0l0", "m2r1l0", "m2r2l0", "m2r3l0"], MirrorExpression: "Eyes2", Left: 250},
					{ Name: "ZigZag2", HasType: false, CopyLayerColor: "Straight2", AllowModuleTypes: ["m1r0l1", "m1r1l1", "m1r2l1", "m1r3l1", "m2r0l1", "m2r1l1", "m2r2l1", "m2r3l1"], MirrorExpression: "Eyes2", Left: 250},
					{ Name: "Skewed2", HasType: false, CopyLayerColor: "Straight2", AllowModuleTypes:["m1r0l2", "m1r1l2", "m1r2l2", "m1r3l2", "m2r0l2", "m2r1l2", "m2r2l2", "m2r3l2"], MirrorExpression: "Eyes2", Left: 250},
					{ Name: "Cross2", HasType: false, CopyLayerColor: "Straight2", AllowModuleTypes: ["m1r0l3", "m1r1l3", "m1r2l3", "m1r3l3", "m2r0l3", "m2r1l3", "m2r2l3", "m2r3l3"], MirrorExpression: "Eyes2", Left: 250},
				],
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNose",
		Category: "Item",
		Priority: 33,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 20,
		Zone: [[175, 65, 150, 65]],
		Asset: [
			{
				Name: "NoseHook", Fetish: ["Metal"], Priority: 26, Value: 25, Difficulty: 20, Time: 15, Random: false, AllowLock: true, BuyGroup: "Nosehook", Layer: [
					{ Name: "Band" },
					{ Name: "Hook" },
				]
			},
			{
				Name: "PigNose", Fetish: ["Pet"], Top: 18, Left: 151, DefaultColor: "#D976D2", Priority: 43, Value: 25, Difficulty: 10, Time: 15, Random: false, AllowLock: true, DrawLocks: false, Layer: [
					{ Name: "Nose" },
					{ Name: "Strap" },
				]
			},
			{ Name: "NoseRing", Priority: 43, Fetish: ["Metal"], Value: 25, Difficulty: 10, Time: 15, Random: false, AllowLock: true, Left: 50, AllowPose: ["Kneel"], Extended: true },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, BuyGroup: "DuctTape", Audio: "DuctTape", Difficulty: 2, Time: 10, RemoveTime: 5},
			{ Name: "NosePlugs", Value: 20, Difficulty: 3, Time: 5, RemoveTime: 5},
			{ Name: "BarbelPiercing", Left: 124, Top: 50, Value: 20, Difficulty: 3, Time: 5, RemoveTime: 5},
			{
				Name: "PigNoseHook", Fetish: ["Metal"], Priority: 26, Value: -1, Difficulty: 30, Time: 15, Random: false, AllowLock: true, DrawLocks: false, BuyGroup: "Nosehook", Layer: [
					{ Name: "Band" },
					{ Name: "Hook" },
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemHood",
		Category: "Item",
		Priority: 45,
		Default: false,
		IsRestraint: true,
		Block: ["ItemHead", "ItemNose", "ItemEars"],
		Left: 150,
		Top: 20,
		Zone: [[325, 0, 75, 130]],
		Asset: [
			{ Name: "LeatherHoodSealed", Fetish: ["Leather"], Value: 70, Difficulty: 5, Time: 15, AllowLock: true, DefaultColor: "#555555", HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["Head", "HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemHead"], Effect: ["BlindHeavy", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"], Prerequisite: ["NotProtrudingFromMouth"] },
			{ Name: "BlanketHood", Value: 50, Difficulty: 3, Time: 5, HideItem: ["ItemEarsFuturisticEarphones",], Hide: ["Head", "HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemHead"], Effect: ["BlindNormal", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"], Prerequisite: ["NotProtrudingFromMouth"] },
			{ Name: "PolishedSteelHood", Fetish: ["Metal"], Value: 85, Difficulty: 8, Time: 15, AllowLock: true, Audio: "LockLarge", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead"], HideItem: ["HatBand1", "HatBand2", "HatTiara1"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagHeavy", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"] },
			{
				Name: "InflatedBallHood", Fetish: ["Latex"], Value: 65, Difficulty: 5, Time: 15, AllowLock: true, Prerequisite: ["NotProtrudingFromMouth"], Extended: true, HasType: false,
				Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Hat", "Mask", "ItemEars", "ItemHead"],
				Effect: ["BlindHeavy", "DeafLight", "Prone", "BlockMouth"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"],
			},
			{
				Name: "OldGasMask", Fetish: ["Leather"], Value: 85, Difficulty: 25, Time: 10, Random: false, AllowLock: true, DrawLocks: false, Prerequisite: ["GasMask", "NotProtrudingFromMouth"], DefaultColor: "#313131", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones","HatFurHeadband"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"], Extended: true, Layer: [
					{ Name: "Mask", AllowColorize: true, HasType: false },
					{ Name: "Light", AllowColorize: false, HasType: false },
					{ Name: "Lenses", AllowColorize: true, ColorGroup: "Attachments", HasType: false, AllowModuleTypes: ["l1"], Left: 0, Top: -250 },
					{ Name: "TubeA", AllowColorize: true, ColorGroup: "Attachments", HasType: false, AllowModuleTypes: ["a1"], Left: 0, Top: -250 },
					{ Name: "TubeB", AllowColorize: true, CopyLayerColor: "TubeA", HasType: false, AllowModuleTypes: ["a2"], Left: 0, Top: -250 },
					{ Name: "Rebreather", AllowColorize: true, CopyLayerColor: "TubeA", HasType: false, AllowModuleTypes: ["a3"], Left: 0, Top: -250 },
					{ Name: "Lock", LockLayer: true, HasType: false, AllowColorize: false },
				],
				Alpha: [{Group: ["ItemHead"], Masks: [[0, 0, 200, 175], [300, 0, 200, 175]]}],
			},
			{
				Name: "KirugumiMask", Fetish: ["Latex"], Value: 50, Priority: 51, Difficulty: 15, Time: 10,
				Random: false, AllowLock: true, DrawLocks: false, Prerequisite: ["GasMask", "NotProtrudingFromMouth"], DefaultColor: ["#9A7F76", "Default"],
				AllowEffect: ["BlindLight", "BlindHeavy", "Prone"],
				Block: [],
				Layer: [
					{ Name: "Mask", AllowColorize: true, HasType: false },
					{ Name: "Blush1", AllowColorize: true, HasType: false, Left: 190, Top: 100, AllowModuleTypes:["b0"]},
					{ Name: "Blush2", AllowColorize: true, HasType: false, CopyLayerColor: "Blush1", Left: 190, Top: 100, AllowModuleTypes:["b1"]},
					{ Name: "Blush3", AllowColorize: true, HasType: false, CopyLayerColor: "Blush1", Left: 190, Top: 100, AllowModuleTypes:["b2"]},
					{ Name: "Blush4", AllowColorize: true, HasType: false, CopyLayerColor: "Blush1", Left: 190, Top: 100, AllowModuleTypes:["b3"]},
					{ Name: "Eyes1", AllowColorize: true, HasType: false, Left: 200, Top: 145, AllowModuleTypes:["e0"]},
					{ Name: "Eyes2", AllowColorize: true, HasType: false, CopyLayerColor: "Eyes1", Left: 200, Top: 145, AllowModuleTypes:["e1"]},
					{ Name: "Eyes3", AllowColorize: true, HasType: false, CopyLayerColor: "Eyes1", Left: 200, Top: 145, AllowModuleTypes:["e2"]},
					{ Name: "Eyes4", AllowColorize: true, HasType: false, CopyLayerColor: "Eyes1", Left: 200, Top: 145, AllowModuleTypes:["e3"]},
					// CopyLayerColor: "Back"
					{ Name: "Mouth1", AllowColorize: true, HasType: false, Left: 235, Top: 180, AllowModuleTypes:["m0"]},
					{ Name: "Mouth2", AllowColorize: true, HasType: false, CopyLayerColor: "Mouth1", Left: 235, Top: 180, AllowModuleTypes:["m1"]},
					{ Name: "Mouth3", AllowColorize: true, HasType: false, CopyLayerColor: "Mouth1", Left: 235, Top: 180, AllowModuleTypes:["m2"]},
					{ Name: "Mouth4", AllowColorize: true, HasType: false, CopyLayerColor: "Mouth1", Left: 235, Top: 180, AllowModuleTypes:["m3"]},

					{ Name: "Brows1", AllowColorize: false, HasType: false, Left: 200, Top: 120, AllowModuleTypes:["br0"]},
					{ Name: "Brows2", AllowColorize: false, HasType: false, CopyLayerColor: "Brows1", Left: 200, Top: 120, AllowModuleTypes:["br1"]},
					{ Name: "Brows3", AllowColorize: false, HasType: false, CopyLayerColor: "Brows1", Left: 200, Top: 120, AllowModuleTypes:["br2"]},
					{ Name: "Brows4", AllowColorize: false, HasType: false, CopyLayerColor: "Brows1", Left: 200, Top: 120, AllowModuleTypes:["br3"]},
				],
				Extended: true
			},
			{
				Name: "PumpkinHead", Priority: 54, Value: 40, Difficulty: 2, Time: 10, Random: false, AllowLock: false,  Hide: ["HairBack"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones","HatFurHeadband"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"],
				Alpha: [{ Masks: [[150, 0, 200, 80]] }],
				Layer: [
					{ Name: "Front", AllowColorize: true, Priority:54},
					{ Name: "Back", AllowColorize: true, Priority: 1 }
				]
			},
			{ Name: "SackHood", Fetish: ["Rope"], Value: 20, Difficulty: 3, Time: 5, Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Hat", "Mask", "ItemEars", "ItemHead"], Effect: ["Prone", "BlindHeavy", "BlockMouth"], Block: ["ItemEars", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"] },
			{ Name: "LeatherHoodSensDep", Fetish: ["Leather"], Value: 100, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["Head", "HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemHead"], Effect: ["BlindHeavy", "DeafHeavy", "Prone", "GagHeavy", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"], Prerequisite: ["NotProtrudingFromMouth"] },
			{
				Name: "LatexHoodOpenHair", Fetish: ["Latex"], Value: 45, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: ["Default", "#555555"], HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["HairFront", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"],
				Alpha: [
					{ Group: ["Head"], Masks: [[150, 50, 200, 87]] },
					{ Group: ["BodyUpper"], Pose: ["AllFours"], Masks: [[150, 50, 200, 87]] },
					{ Group: ["ItemHead"], Masks: [[0, 0, 195, 250], [300, 0, 200, 250]]},
				],
				Block: ["ItemEars", "ItemHead", "ItemNose"],
				Layer: [
					{ Name: "Hair", InheritColor: "HairFront" },
					{ Name: "Hood" },
				]
			},
			{
				Name: "LeatherHood", Fetish: ["Leather"], Value: 60, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: ["#404040", "#404040", "#888"], Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead"], HideItem: ["HatFurHeadband"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagNormal", "BlockMouth"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"],
				Prerequisite: ["NotProtrudingFromMouth"],
				Layer: [
					{ Name: "Hood", AllowColorize: true },
					{ Name: "Collar", AllowColorize: true },
					{ Name: "Snaps", AllowColorize: false },
				]
			},
			{
				Name: "LeatherHoodOpenEyes", Fetish: ["Leather"], Value: 40, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040",
				HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones","HatFurHeadband"],
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3"], Effect: ["GagLight", "BlockMouth"],
				Block: ["ItemHead", "ItemNose", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"],
				Prerequisite: ["NotProtrudingFromMouth"],
				Alpha: [{Group: ["ItemHead"], Masks: [[0, 0, 210, 250], [295, 0, 205, 250]]}],
			},
			{ Name: "GasMask", Fetish: ["Leather"], Value: 50, Difficulty: 25, Time: 10, Random: false, AllowLock: true, DefaultColor: "#585858", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead"], HideItem: ["HatFurHeadband"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"], Prerequisite: ["NotProtrudingFromMouth"]},
			{
				Name: "DogHood", Fetish: ["Leather", "Pet"], Value: 60, Difficulty: 50, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040",
				HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones","HatFurHeadband"],
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"],
				Effect: ["GagNormal", "BlockMouth"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHead", "ItemNose"],
				Alpha: [{Group: ["ItemHead"], Masks: [[0, 0, 210, 250], [295, 0, 205, 250]]}],
			},
			{
				Name: "FoxyMask", Fetish: ["Pet"], Value: 50, Difficulty: 2, Time: 15, Random: false, AllowLock: true, Effect: ["GagLight", "BlockMouth"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"],
				Layer: [
					{ Name: "Upper" },
					{ Name: "Lower" },
				],
				Alpha: [{Group: ["ItemHead"], Masks: [[0, 0, 198, 250], [300, 0, 200, 250]]}],
			},
			{ Name: "PonyHood", Fetish: ["Pony"], Value: -1, Difficulty: 50, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead"], HideItem: ["ItemHeadSnorkel","HatFurHeadband"], Effect: ["BlindLight", "GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"] },
			{
				Name: "LeatherHoodOpenMouth", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], HideItem: ["ItemHeadSnorkel", "ItemNosePigNose", "ItemEarsFuturisticEarphones", "HatFurHeadband"], Effect: ["Prone", "BlindHeavy"], Block: ["ItemEars", "ItemHead", "ItemNose"],
				Alpha: [{ Group: ["ItemHead"], Masks: [[0, 0, 217, 250], [282, 0, 218, 250]] }],
			},
			{
				Name: "CanvasHood", Value: 50, Difficulty: 20, Time: 15, AllowLock: true, DefaultColor: ["#a5a095", "#ce7210"],
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead"],
				HideItem: ["HatFurHeadband"], Effect: ["Prone", "BlindHeavy", "GagHeavy", "BlockMouth", "DeafLight"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose", "ItemHead"], Extended: true,
				DynamicAfterDraw: true,
				Prerequisite: ["NotProtrudingFromMouth"],
				TextMaxLength: { Text: 12 },
				TextFont: "'Saira Stencil One', 'Arial', sans-serif",
				Layer: [
					{ Name: "Hood" },
					{ Name: "Text" },
				]
			},
			{
				Name: "Pantyhose", Value: 10, Time: 5, BuyGroup: "Pantyhose",
				Hide: ["Glasses", "Mask", "HairFront", "FacialHair", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
				HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones","HatFurHeadband"],
				Effect: ["BlindLight", "Prone"],
				Prerequisite: ["NotProtrudingFromMouth"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNose", "ItemHead"],
				Alpha: [{ Group: ["ItemHead"], Masks: [[0, 0, 208, 250], [290, 0, 210, 250]] }],
				Audio: "ClothSlip",
				Tint: [{Color: 0, Strength: 0.2}],
				DefaultTint: "#765d4e",
			},
			{
				Name: "GP9GasMask", Priority: 54, Value: 75, Difficulty: 25, Time: 10, HideItem: ["ItemHeadSnorkel", "ItemMouthCaneGag", "ItemMouthCropGag", "ItemEarsFuturisticEarphones", "HatFurHeadband"], Random: false, Alpha: [{ Group: ["HairFront"], Masks: [[206, 115, 88, 70]] }], AllowLock: true, Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"],
				Prerequisite: ["NotProtrudingFromMouth"],
				Layer: [
					{ Name: "Mouth", AllowColorize: true },
					{ Name: "Lens", AllowColorize: true },
					{ Name: "Mask", AllowColorize: true },
					{ Name: "Edges", AllowColorize: true },
				],
				Tint: [{Color: 1, Strength: 0.1}],
				DefaultTint: "#ccc",
			},
			{ Name: "OpenFaceHood", Fetish: ["Latex"], Value: 35, Priority: 40, Difficulty: 5, Time: 15, AllowLock: false, DefaultColor: "#404040", BuyGroup: "OpenFace", Block: ["ItemEars"], Hide: ["HairFront"], HideItem: ["HatFurHeadband"] , Extended: true, HasType: false },
			{
				Name: "GwenHood", Fetish: ["Leather"], Value: 35, Difficulty: 5, Time: 15, AllowLock: true, DefaultColor: "#404040", Extended: true, HasType: false,
				Prerequisite: ["NotProtrudingFromMouth"],
				Hide: ["HairFront", "FacialHair", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"],
				Alpha: [
					// Mask over the neck area
					{ Group: ["ItemMouth", "ItemMouth2", "ItemMouth3"], Masks: [[200, 190, 100, 70]] },
					{ Group: ["ItemHead"], Masks: [[0, 0, 203, 250], [295, 0, 205, 250]] },
				],
				HideItem: ["HatFurHeadband"],
			},
			{
				Name: "TechnoHelmet1", Category: ["SciFi"], Fetish: ["Metal"], Value: 100, Difficulty: 7, DefaultColor: ["#1E7484", "Default", "#2F2F2F", "#999999", "#246489"], RemoveTime: 10, AllowLock: true, DrawLocks: false, Effect: [], Extended: true,
				Hide: ["HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3", "ItemEars", "Glasses"],
				Layer: [
					{ Name: "TransparentVisor", HasType: false, AllowModuleTypes: ["v1"] },
					{ Name: "LightlyTintedVisor", HasType: false, CopyLayerColor: "TransparentVisor", AllowModuleTypes: ["v2"] },
					{ Name: "HeavilyTintedVisor", HasType: false, CopyLayerColor: "TransparentVisor", AllowModuleTypes: ["v3"] },
					{ Name: "OpaqueVisor", HasType: false, CopyLayerColor: "TransparentVisor", AllowModuleTypes: ["v4", "v5"] },
					{ Name: "HypnoSpiral", HasType: false, AllowModuleTypes: ["v5"] },
					{ Name: "Shine", HasType: false, AllowColorize: false, AllowModuleTypes: ["v1", "v2", "v3", "v4", "v5"] },
					{ Name: "ChinStrap", HasType: false, AllowModuleTypes: ["c1"] },
					{ Name: "HelmetMain", HasType: false, },
					{ Name: "HelmetSecondary", HasType: false, },
				],
				Alpha: [{ Group: ["ItemHead"], Masks: [[0, 0, 500, 1000], [0, 0, 203, 250], [295, 0, 205, 250]] }],
			},
			{
				Name: "FuturisticHelmet", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 10, RemoveTime: 10, AllowLock: true, DrawLocks: false, Effect: [],
				Hide: ["HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Glasses"],
				Alpha: [{ Group: ["ItemHead"], Masks: [[0, 0, 203, 250], [295, 0, 205, 250]] }]
			},
			{
				Name: "LampHeadHood", Fetish: ["Forniphilia"], Value: 40, Difficulty: 3, Time: 8, RemoveTime: 5, Top: 25, Left: 135, Priority: 57, DefaultColor: ["Default", "#a13f75", "#ad4c81"],
				Effect: ["BlindLight"],
				Block: ["ItemHead"],
				Hide: ["Hat"],
				HideItem: ["HairAccessory1HairFeathers1", "HairAccessory1HairFlower1", "HairAccessory3HairFeathers1", "HairAccessory3HairFlower1"],
				HideItemExclude: ["HatBandana", "HatBunnySuccubus2", "HatCrown1", "HatCrown2", "HatFacePaint", "HatFurHeadband"],
				Alpha: [{Group: ["HairFront", "Mask", "ItemHead", "ItemEars"], Masks: [[0, 0, 500, 165]]}],
				Layer: [
					{ Name: "Inside", Priority: 1 },
					{ Name: "Cord", AllowColorize: false, HideForPose: ["Suspension"] },
					{ Name: "Switch", HideForPose: ["Suspension"] },
					{ Name: "Lamp" },
				],
			},
			{ Name: "AccentHood", Fetish: ["Latex"], Top: 25, Left: 149, Value: 30, Time: 15, AllowLock: true, HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["HairFront", "FacialHair", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"] },
			{
				Name: "CollarHood", Fetish: ["Latex"], Top: 23, Left: 150, Value: 50, AllowLock: true, Time: 17, HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["HairFront", "FacialHair", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], Layer: [
					{ Name: "Hood" },
					{ Name: "Collar" }
				]
			},
			{
				Name: "ZipperHood", Fetish: ["Latex"], Value: 20, DrawLocks: false, AllowLock: true, Time: 15, Extended: true, HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["HairFront", "FacialHair", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"],
				Layer:[
					{ Name: ""},
					{ Name: "Lock", LockLayer: true, HasType: false, AllowColorize: false},
				],
			},
			{
				Name: "LatexHabit", Fetish: ["Latex"], BuyGroup: "LatexHabit", Top: 23, Left: 85, Value: 30, Time: 5, AllowLock: true, HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["HairFront","FacialHair", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3",], Block: ["ItemEars"],
				Layer:[
					{ Name: "Cape"},
					{ Name: "Collar"},
					{ Name: "Base"},
					{ Name: "Cowl"},
					{ Name: "Back", Priority: 5, CopyLayerColor: "Base"}
				],
			},
			{
				Name: "CowHood", Fetish: ["Pet", "Latex"], Value: 30, Difficulty: 5, Time: 15, Top: 25,Left: 124, Random: false, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead"], HideItem: ["ItemHeadSnorkel","HatFurHeadband"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"],
				Layer:[
					{Name: "Base"},
					{Name: "Spots"},
				],
			},
			{
				Name: "HeadboxSeethrough", Value: 80, Priority: 54, Difficulty: 10, Time: 19, AllowLock: true, Extended: true, Top: 0,
				Block: ["ItemHead", "ItemNose", "ItemEars", "ItemMouth", "ItemMouth2", "ItemMouth3"],
				Hide: ["HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
				Alpha: [{ Group: ["HairFront", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask", "ItemNose", "ItemHead", "Glasses", "ItemEars"],
					Masks: [[0, 0, 500, 65], [0, 220, 500, 780], [0, 0, 180, 1000], [320, 0, 180, 1000]] }],
				Effect: ["BlindHeavy"],
				Layer: [
					{ Name: "GlassInside", HasType: false },
					{ Name: "LEDs", HasType: false, CopyLayerColor: "GlassInside" },
					{ Name: "Frame", HasType: false },
					{ Name: "Glass", AllowColorize: false },
				],
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e", "#57ab5e"], Random: false, Value: 200, Difficulty: 4, Time: 15, RemoveTime: 25,
				Effect: ["BlindLight", "Prone", "DeafHeavy", "BlockMouth", "GagHeavy", "BlurHeavy"],
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars", "ItemHead", "Hat"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"],
				Layer: [
					{ Name: "One" },
					{ Name: "Two" },
				],
				Tint: [{Color: 1, Strength: 0.4}],
			},
			{
				Name: "KittyHood", Fetish: ["Pet"], Random: false, Value: 40, Difficulty: 2, Top: 33, Left: 142,
				AllowLock: true, Extended: true, DrawLocks: false,
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
				DefaultColor: ["Default", "Default", "Default", "#2D8736", "Default", "Default", "#000000"],
				Layer: [
					{ Name: "Base", HasType: false, },
					{ Name: "Linings", HasType: false, },
					{ Name: "Panel", HasType: false, },
					{ Name: "Display", HasType: false, },
					{ Name: "Openings", HasType: false, },
					{ Name: "Blindfold", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["b1"], AllowColorize: false, },
					{ Name: "BlindfoldNeutral", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["b1e0"], CopyLayerColor: "Drawings", },
					{ Name: "BlindfoldOwO", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["b1e1"], CopyLayerColor: "Drawings", },
					{ Name: "BlindfoldUwU", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["b1e2"], CopyLayerColor: "Drawings", },
					{ Name: "Gag", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["g1"], AllowColorize: false, },
					{ Name: "GagNeutral", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["g1e0"], CopyLayerColor: "Drawings", },
					{ Name: "GagOwO", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["g1e1"], CopyLayerColor: "Drawings", },
					{ Name: "GagUwU", Top: 80, Left: 164, HasType: false, AllowModuleTypes: ["g1e2"], CopyLayerColor: "Drawings", },
					{ Name: "Drawings", HasImage: false, },
					{ Name: "Lock", Top: 113, Left: 233, HasType: false, LockLayer: true, AllowColorize: true, }
				],
			},
			{
				Name: "LatexDogHood", Fetish: ["Latex", "Pet"], Random: false, Value: 20, Difficulty: 1, Top: -5, Left: 113,
				AllowLock: true,
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
			},
			{
				Name: "OpenMouthPlugHood", Fetish: ["Latex"], Random: false, Value: 40, Difficulty: 3, Top: 0,
				DrawLocks: false,
				AllowLock: true,
				Hide: ["HairFront", "FacialHair", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "FakeMouth", AllowColorize: false },
					{ Name: "Lenses" },
					{ Name: "Hood" },
					{ Name: "Plug" }
				]

			},
			{
				Name: "DroneMask", Category: ["SciFi"], Fetish: ["Latex"], Value: -1, Difficulty: 5, DefaultColor: ["#222222", "#CCCCCC", "#7F7F7F", "#00F4FD", "#E700CA", ], Time: 10, AllowLock: true, DrawLocks: false, Extended: true, DynamicAfterDraw: true,
				DynamicGroupName: "ItemHead",
				BuyGroup: "DroneMask",
				Block:["ItemNose"],
				Hide: ["Glasses", "Blush"],
				HideItem: ["HatFacePaint", "MaskFacePaint", "ClothAccessoryFacePaint"],
				TextMaxLength: { Text: 16 },
				TextFont: "Impact",
				Layer: [ // Colors layer references: Base, Shine, EyeRegular, MouthOnahole, Barcode
					{ Name: "Base", HasType: false, AllowModuleTypes: ["h0"] },
					{ Name: "Shine", HasType: false, AllowModuleTypes: ["h0"] },
					{ Name: "BaseHelm", HasType: false, AllowModuleTypes: ["h1","h2"], CopyLayerColor: "Base", Alpha: [{ Masks: [[0, 0, 500, 200]], Group: ["Head"] }], },
					{ Name: "ShineHelm", HasType: false, AllowModuleTypes: ["h1","h2"], CopyLayerColor: "Shine" },

					// All Non-part-reliant Patterns
					{ Name: "Barcode", HasType: false, AllowModuleTypes: ["p1"]},
					{ Name: "Scarab", HasType: false, AllowModuleTypes: ["p2"], CopyLayerColor: "Barcode"},
					{ Name: "Hexagon", HasType: false, AllowModuleTypes: ["p3"], CopyLayerColor: "Barcode"},
					{ Name: "TwoLines", HasType: false, AllowModuleTypes: ["p4"], CopyLayerColor: "Barcode"},
					{ Name: "Text", HasImage: false, CopyLayerColor: "Barcode"},

					// All Eyes
					{ Name: "EyeRegularShine", HasType: false, AllowModuleTypes: ["e1"], CopyLayerColor: "Shine" },
					{ Name: "EyeRegular", HasType: false, AllowModuleTypes: ["e1"], },
					{ Name: "EyeRegularGlow", HasType: false, AllowModuleTypes: ["e1g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeSpiralShine", HasType: false, AllowModuleTypes: ["e2"], CopyLayerColor: "Shine" },
					{ Name: "EyeSpiral", HasType: false, AllowModuleTypes: ["e2"], CopyLayerColor: "EyeRegular" },
					{ Name: "EyeSpiralGlow", HasType: false, AllowModuleTypes: ["e2g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeSmileShine", HasType: false, AllowModuleTypes: ["e3"], CopyLayerColor: "Shine" },
					{ Name: "EyeSmile", HasType: false, AllowModuleTypes: ["e3"], CopyLayerColor: "EyeRegular" },
					{ Name: "EyeSmileGlow", HasType: false, AllowModuleTypes: ["e3g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeHolesShine", HasType: false, AllowModuleTypes: ["e4"], CopyLayerColor: "Shine" },
					{ Name: "EyeHoles", HasType: false, AllowModuleTypes: ["e4"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeSculpted", HasType: false, AllowModuleTypes: ["e5"], CopyLayerColor: "EyeRegular" },
					{ Name: "EyeSculptedShine", HasType: false, AllowModuleTypes: ["e5"], CopyLayerColor: "Shine" },
					{ Name: "EyeSculptedGlow", HasType: false, AllowModuleTypes: ["e5g1"], CopyLayerColor: "EyeRegular" },

					{ Name: "EyeConcave", HasType: false, AllowModuleTypes: ["e6"], CopyLayerColor: "Base"},
					{ Name: "EyeConcaveShine", HasType: false, AllowModuleTypes: ["e6"], CopyLayerColor: "Shine"},

					// All Mouths
					{ Name: "MouthOnahole", HasType: false, AllowModuleTypes: ["m1"]},

					{ Name: "MouthFleshlightShine", HasType: false, AllowModuleTypes: ["m2"], CopyLayerColor: "Shine" },
					{ Name: "MouthFleshlight", HasType: false, AllowModuleTypes: ["m2"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthSmileShine", HasType: false, AllowModuleTypes: ["m3"], CopyLayerColor: "Shine" },
					{ Name: "MouthSmile", HasType: false, AllowModuleTypes: ["m3"], CopyLayerColor: "MouthOnahole" },
					{ Name: "MouthSmileGlow", HasType: false, AllowModuleTypes: ["m3g1"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthHolesShine", HasType: false, AllowModuleTypes: ["m4"], CopyLayerColor: "Shine" },
					{ Name: "MouthHoles", HasType: false, AllowModuleTypes: ["m4"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthSculpted", HasType: false, AllowModuleTypes: ["m5"], CopyLayerColor: "MouthOnahole" },

					{ Name: "MouthSubtle", HasType: false, AllowModuleTypes: ["m6"], CopyLayerColor: "MouthOnahole" },
				],
			},
			{
				Name: "CustomLatexHood", Fetish: ["Latex"], Value: 100, Difficulty: 5, Priority: 20,
				DefaultColor: ["Default", "#1C1C1C", "#888888", "#B7B7B7", "#B7B7B7", "#B7B7B7", "#1C1C1C", "#B7B7B7", "#1C1C1C", "#B7B7B7", "#1C1C1C", "#B7B7B7"], Time: 10,
				AllowLock: true, DrawLocks: false, Extended: true, AllowColorizeAll: false,
				Attribute: ["ShortHair"],
				Top: 31, Left: 166.5,
				HideItem: ["HatFacePaint", "MaskFacePaint", "ClothAccessoryFacePaint"],
				Block: ["ItemEars"],
				Layer: [
					// Head Panel Parts
					{ Name: "HairUnder", Priority: 8, HasType: false, AllowModuleTypes: ["x1h1","x1h2","z1","z2","z3","z4"], InheritColor: "HairFront",HideColoring: true, Top: 32 },
					{ Name: "PanelHead", HasType: false, AllowModuleTypes: ["x0"] },
					{ Name: "PanelHeadTransparent", HasType: false, AllowModuleTypes: ["x1"], CopyLayerColor: "PanelHead" },
					{ Name: "PanelHeadHighlight", HasType: false, HideColoring: true }, // master colour for highlighting

					// Linings
					{ Name: "LiningRoundFace", HasType: false }, // master colour for face lining
					{ Name: "LiningRoundFaceHighlight", HasType: false, CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "LiningCrossFace", HasType: false, CopyLayerColor: "LiningRoundFace" },
					{ Name: "LiningCrossFaceHighlight", HasType: false, CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "LiningRoundEye", HasType: false, AllowModuleTypes: ["e2","e6"] }, // master colour for eye lining
					{ Name: "LiningRoundEyeHighlight", HasType: false, AllowModuleTypes: ["e2","e6"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "LiningShapedEye", HasType: false, AllowModuleTypes: ["e3","e7"], CopyLayerColor: "LiningRoundEye" },
					{ Name: "LiningShapedEyeHighlight", HasType: false, AllowModuleTypes: ["e3","e7"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "LiningRoundMouth", HasType: false, AllowModuleTypes: ["m2","m6"] }, // master colour for mouth lining
					{ Name: "LiningRoundMouthHighlight", HasType: false, AllowModuleTypes: ["m2","m6"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "LiningShapedMouth", HasType: false, AllowModuleTypes: ["m3","m7"], CopyLayerColor: "LiningRoundMouth" },
					{ Name: "LiningShapedMouthHighlight", HasType: false, AllowModuleTypes: ["m3","m7"], CopyLayerColor: "PanelHeadHighlight" },

					// Eye Panel Parts
					{ Name: "PanelNoEye", HasType: false, AllowModuleTypes: ["e0"] }, // master colour for eye panel
					{ Name: "PanelNoEyeTransparent", HasType: false, AllowModuleTypes: ["e4"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelHoleNoEye", HasType: false, AllowModuleTypes: ["e1"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelHoleNoEyeTransparent", HasType: false, AllowModuleTypes: ["e5"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelNoEyeHighlight", HasType: false, AllowModuleTypes: ["e0","e1","e4","e5"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "PanelRoundEye", HasType: false, AllowModuleTypes: ["e2"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelRoundEyeTransparent", HasType: false, AllowModuleTypes: ["e6"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelRoundEyeHighlight", HasType: false, AllowModuleTypes: ["e2","e6"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "PanelShapedEye", HasType: false, AllowModuleTypes: ["e3"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelShapedEyeTransparent", HasType: false, AllowModuleTypes: ["e7"], CopyLayerColor: "PanelNoEye" },
					{ Name: "PanelShapedEyeHighlight", HasType: false, AllowModuleTypes: ["e3","e7"], CopyLayerColor: "PanelHeadHighlight" },

					// Eye Panel Fills
					{ Name: "FillRoundEye", HasType: false, AllowModuleTypes: ["e2s1","e6s1"] }, // master colour for eye panel fills
					{ Name: "FillRoundEyeTransparent", HasType: false, AllowModuleTypes: ["e2s2","e6s2"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillHoleRoundEye", HasType: false, AllowModuleTypes: ["e2s3","e6s3"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillHoleRoundEyeTransparent", HasType: false, AllowModuleTypes: ["e2s4","e6s4"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillRoundEyeHighlight", HasType: false, AllowModuleTypes: ["e2s1","e6s1","e2s2","e6s2","e2s3","e6s3","e2s4","e6s4"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "FillShapedEye", HasType: false, AllowModuleTypes: ["e3s1","e7s1"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillShapedEyeTransparent", HasType: false, AllowModuleTypes: ["e3s2","e7s2"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillHoleShapedEye", HasType: false, AllowModuleTypes: ["e3s3","e7s3"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillHoleShapedEyeTransparent", HasType: false, AllowModuleTypes: ["e3s4","e7s4"], CopyLayerColor: "FillRoundEye" },
					{ Name: "FillShapedEyeHighlight", HasType: false, AllowModuleTypes: ["e3s1","e7s1","e3s2","e7s2","e3s3","e7s3","e3s4","e7s4"], CopyLayerColor: "PanelHeadHighlight" },

					// Mouth Panel Parts
					{ Name: "PanelNoMouth", HasType: false, AllowModuleTypes: ["m0"] }, // master colour for mouth panel
					{ Name: "PanelNoMouthTransparent", HasType: false, AllowModuleTypes: ["m4"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelHoleNoMouth", HasType: false, AllowModuleTypes: ["m1"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelHoleNoMouthTransparent", HasType: false, AllowModuleTypes: ["m5"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelNoMouthHighlight", HasType: false, AllowModuleTypes: ["m0","m1","m4","m5"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "PanelRoundMouth", HasType: false, AllowModuleTypes: ["m2"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelRoundMouthTransparent", HasType: false, AllowModuleTypes: ["m6"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelRoundMouthHighlight", HasType: false, AllowModuleTypes: ["m2","m6"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "PanelShapedMouth", HasType: false, AllowModuleTypes: ["m3"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelShapedMouthTransparent", HasType: false, AllowModuleTypes: ["m7"], CopyLayerColor: "PanelNoMouth" },
					{ Name: "PanelShapedMouthHighlight", HasType: false, AllowModuleTypes: ["m3","m7"], CopyLayerColor: "PanelHeadHighlight" },

					// Mouth Panel Fill
					{ Name: "FillRoundMouth", HasType: false, AllowModuleTypes: ["m2f1","m6f1"] }, // master colour for mouth panel fill
					{ Name: "FillRoundMouthTransparent", HasType: false, AllowModuleTypes: ["m2f2","m6f2"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillHoleRoundMouth", HasType: false, AllowModuleTypes: ["m2f3","m6f3"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillHoleRoundMouthTransparent", HasType: false, AllowModuleTypes: ["m2f4","m6f4"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillRoundMouthHighlight", HasType: false, AllowModuleTypes: ["m2f1","m6f1","m2f2","m6f2","m2f3","m6f3","m2f4","m6f4"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "FillShapedMouth", HasType: false, AllowModuleTypes: ["m3f1","m7f1"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillShapedMouthTransparent", HasType: false, AllowModuleTypes: ["m3f2","m7f2"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillHoleShapedMouth", HasType: false, AllowModuleTypes: ["m3f3","m7f3"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillHoleShapedMouthTransparent", HasType: false, AllowModuleTypes: ["m3f4","m7f4"], CopyLayerColor: "FillRoundMouth" },
					{ Name: "FillShapedMouthHighlight", HasType: false, AllowModuleTypes: ["m3f1","m7f1","m3f2","m7f2","m3f3","m7f3","m3f4","m7f4"], CopyLayerColor: "PanelHeadHighlight" },

					// Hood Cover
					{ Name: "ZipperHoodOpen", Priority: 50, HasType: false, AllowModuleTypes: ["z1"] }, // master colour for hood cover
					{ Name: "ZipperHoodClosed", Priority: 50, HasType: false, AllowModuleTypes: ["z2"], CopyLayerColor: "ZipperHoodOpen" },
					{ Name: "ZipperHoodOpenTransparent", Priority: 50, HasType: false, AllowModuleTypes: ["z3"], CopyLayerColor: "ZipperHoodOpen" },
					{ Name: "ZipperHoodClosedTransparent", Priority: 50, HasType: false, AllowModuleTypes: ["z4"], CopyLayerColor: "ZipperHoodOpen" },
					{ Name: "ZipperHoodOpenHighlight", Priority: 50, HasType: false, AllowModuleTypes: ["z1","z3"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "ZipperHoodClosedHighlight", Priority: 50, HasType: false, AllowModuleTypes: ["z2","z4"], CopyLayerColor: "PanelHeadHighlight" },
					{ Name: "ZipperHoodOpenZipper", Priority: 50, HasType: false, AllowModuleTypes: ["z1","z3"] }, // master colour for hood cover zipper
					{ Name: "ZipperHoodClosedZipper", Priority: 50, HasType: false, AllowModuleTypes: ["z2","z4"], CopyLayerColor: "ZipperHoodOpenZipper" },
				],
			},
			{
				Name: "HarnessCatMask", Fetish: ["Pet"], Random: false, Value: 50, Difficulty: 3, Top: 32, Left: 166.5, DefaultColor: ["#202020","#202020","#ADADAD"], Priority: 34, Time: 5,
				DrawLocks: true,
				AllowLock: true,
				Hide: [],
				Block: [],
				Layer: [
					{ Name: "Base", HasType: false, },
					{ Name: "EarsUnder", HasType: false, AllowTypes: ["Ear"], },
					{ Name: "EarsOver", HasType: false, AllowTypes: ["Ear"], Priority: 53, CopyLayerColor: "EarsUnder" },
					{ Name: "Metal", HasType: false, },
					{ Name: "Lock", LockLayer: true, HasType: false, AllowColorize: false }
				]

			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemEars",
		Category: "Item",
		Priority: 1,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 50,
		Zone: [[100, 0, 75, 130]],
		Asset: [
			{ Name: "LightDutyEarPlugs", Value: 15, Difficulty: 50, Time: 5, Visible: false, Effect: ["DeafLight"] },
			{ Name: "HeavyDutyEarPlugs", Value: 30, Difficulty: 50, Time: 5, Visible: false, Effect: ["DeafHeavy"] },
			{ Name: "HeadphoneEarPlugs", Value: 50, Difficulty: 50, Time: 5, Visible: false, Extended: true },
			{ Name: "BluetoothEarbuds", Value: 50, Difficulty: 50, Time: 5, Visible: false, Extended: true, AlwaysExtend: true },
			{ Name: "FuturisticEarphones", Priority: 54, Category: ["SciFi"], Value: 60, Difficulty: 50, Top: 20, Time: 12, DefaultColor: ["Default", "#50913C"], AllowLock: true, DrawLocks: false, Random: false, FuturisticRecolor: true, Effect: ["UseRemote"], Extended: true, HasType: false,
				Layer: [
					{ Name: "Band" },
					{ Name: "Display" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "Headphones", Priority: 54, Value: 50, Time: 5, Random: false, Top: 20, Extended: true, AlwaysExtend: true, HasType: false,
				Layer: [
					{ Name: "Light" },
					{ Name: "Dark" },
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMisc",
		Category: "Item",
		Priority: 48,
		Default: false,
		Top: -250,
		Zone: [[10, 0, 90, 200]],
		Asset: [
			{ Name: "MetalPadlock", Value: 15, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "IntricatePadlock", Value: 50, Time: 30, Wear: false, Effect: [], IsLock: true, PickDifficulty: 7, ExclusiveUnlock: true, AllowType: ["LockPickSeed"], Extended: true},
			{ Name: "HighSecurityPadlock", Value: 60, Time: 10, Wear: false, Effect: [], IsLock: true, PickDifficulty: 10, ExclusiveUnlock: true, AllowType: ["LockPickSeed"], Extended: true},
			{ Name: "TimerPadlock", Value: 80, Wear: false, Effect: [], IsLock: true, MaxTimer: 300, RemoveTimer: 300 },
			{ Name: "CombinationPadlock", Value: 100, Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["CombinationNumber"], Extended: true},
			{ Name: "PasswordPadlock", Value: 100, BuyGroup: "PasswordPadlock", Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["Password", "Hint", "LockSet"], Extended: true},
			{ Name: "TimerPasswordPadlock", Value: -1, BuyGroup: "PasswordPadlock", Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["Password", "Hint", "LockSet"], MaxTimer: 14400, RemoveTimer: 300, Extended: true},
			{ Name: "OwnerPadlock", Value: 60, Time: 10, Wear: false, OwnerOnly: true, Effect: [], IsLock: true },
			{ Name: "OwnerTimerPadlock", Value: 100, Wear: false, OwnerOnly: true, Effect: [], IsLock: true, MaxTimer: 604800, RemoveTimer: 300 },
			{ Name: "LoversPadlock", Value: 60, Time: 10, Wear: false, LoverOnly: true, Effect: [], IsLock: true},
			{ Name: "LoversTimerPadlock", Value: 100, Wear: false, LoverOnly: true, Effect: [], IsLock: true, MaxTimer: 604800, RemoveTimer: 300 },
			{ Name: "MistressPadlock", Value: -1, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "MistressTimerPadlock", Value: -1, Wear: false, Effect: [], IsLock: true, MaxTimer: 14400, RemoveTimer: 300 },
			{ Name: "PandoraPadlock", Value: -1, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "ExclusivePadlock", Value: 50, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "SafewordPadlock", Value: 40, Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["Password", "Hint", "LockSet"], Extended: true},
			{ Name: "MetalPadlockKey", Value: 10, Wear: false, Effect: ["Unlock-MetalPadlock"] },
			{ Name: "OwnerPadlockKey", Value: 60, Wear: false, OwnerOnly: true, Effect: ["Unlock-OwnerPadlock", "Unlock-OwnerTimerPadlock"] },
			{ Name: "LoversPadlockKey", Value: 40, Wear: false, LoverOnly: true, Effect: ["Unlock-LoversPadlock", "Unlock-LoversTimerPadlock"] },
			{ Name: "MistressPadlockKey", Value: -1, Wear: false, Effect: ["Unlock-MistressPadlock", "Unlock-MistressTimerPadlock"] },
			{ Name: "PandoraPadlockKey", Value: -1, Wear: false, Effect: ["Unlock-PandoraPadlock"] },
			{ Name: "MetalCuffsKey", Value: 20, Time: 5, Wear: false, Effect: ["Unlock-MetalCuffs"] },
			{ Name: "Lockpicks", Value: 25, Time: 5, Wear: false, Effect: ["Unlock-"] },
			{ Name: "WoodenMaidTray", Value: -1, Enable: false, RemoveAtLogin: true, },
			{ Name: "WoodenMaidTrayFull", Value: -1, Enable: false, RemoveAtLogin: true, },
			{ Name: "BountySuitcase", Value: -1, Enable: false },
			{ Name: "BountySuitcaseEmpty", Value: -1, Enable: false },
			{ Name: "WoodenPaddle", Value: -1, Enable: false, RemoveAtLogin: true, },
			{
				Name: "WoodenSign", Value: 90, Top: 0, Left: 0, Priority: 57, Difficulty: 1, Time: 5,
				Random: false, Prerequisite: ["NoMaidTray"], Hide: ["ItemNipples", "ItemNipplesPiercings"],
				AllowPose: ["Suspension"], Extended: true, DynamicAfterDraw: true,
				TextMaxLength: { Text: 12, Text2: 12 },
				TextFont: "'Calligraffitti', cursive",
				Layer: [
					{ Name: "Sign" },
					{ Name: "Rope" },
					{ Name: "Text" },
				]
			},
			{ Name: "ServingTray", Value: -1, Time: 5, Extended: true,
				Layer: [
					{ Name: "Tray", AllowColorize: false },
					{ Name: "Objects", AllowTypes: ["Drinks", "Cake", "Cookies", "Toys"] },
					{ Name: "Details", AllowTypes: ["Drinks", "Cake", "Toys"] },
				]
			},
			{ Name: "TeddyBear", Fetish: ["ABDL"], Priority: 34, Value: 50, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"], Effect: [], Extended: true, RemoveAtLogin: true },
			{
				Name: "PetPost", Fetish: ["Metal", "Pet"], Value: 150, Difficulty: 4, Time: 5, Random: false,
				DefaultColor: ["Default", "#237D22", "#F3F3F3", "#F3F3F3", "#FFF483", "#FFBCD6", "Default"],
				BuyGroup:"PetPost", DrawLocks: false, Prerequisite: ["Collared", "NotSuspended", "NotMounted"],
				AllowPose: [], Effect: ["IsChained", "Tethered"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }],
				DynamicAfterDraw: true, Extended: true, AlwaysExtend: true, Top: 352, Left: 310,
				FixedPosition: true, TextMaxLength: { Text: 14, Text2: 14, Text3: 14 },
				Layer: [
					//Pole Base
					{ Name: "PoleShade", Priority: 10, AllowColorize: false, HasType: false},
					{ Name: "Pole", Priority: 54, AllowModuleTypes: ["d1"], HasType: false, },
					{ Name: "PoleClean", Priority: 54, CopyLayerColor: "Pole", AllowModuleTypes: ["d0"], HasType: false},
					//Plaque
					{ Name: "Plaque", Priority: 54, AllowModuleTypes: ["d1"], HasType: false },
					{ Name: "PlaqueClean", Priority: 54, CopyLayerColor: "Plaque",AllowModuleTypes: ["d0"], HasType: false },
					{ Name: "PlaqueBorder", Priority: 54, AllowModuleTypes: ["p1d1"], HasType: false },
					{ Name: "PlaqueBorderClean", Priority: 54, CopyLayerColor: "PlaqueBorder", AllowModuleTypes: ["p1d0"], HasType: false },
					{ Name: "PlaqueBolts", Priority: 54, HasType: false },
					//Details
					{ Name: "Postit", Priority: 54, HasType: false, AllowModuleTypes: ["m0"] },
					{ Name: "Text", HasImage: false, Priority: 55 },
					{ Name: "Paw", Priority: 54, HasType: false, AllowModuleTypes: ["s0"] },
					{ Name: "Triskel", Priority: 54, HasType: false, CopyLayerColor: "Paw", AllowModuleTypes: ["s1"] },
					{ Name: "Moon", Priority: 54, HasType: false, CopyLayerColor: "Paw", AllowModuleTypes: ["s2"] },
					{ Name: "LGBT", Priority: 54, HasType: false, AllowColorize: false, AllowModuleTypes: ["s3"] },
					{ Name: "Trans", Priority: 54, HasType: false, AllowColorize: false, AllowModuleTypes: ["s4"] },
					{ Name: "Bi", Priority: 54, HasType: false, AllowColorize: false, AllowModuleTypes: ["s5"] },
					{ Name: "NoSwim", Priority: 54, HasType: false, CopyLayerColor: "Paw", AllowModuleTypes: ["s6"] },
				]
			},
		],
		Color: ["Default"]
	},

	{
		Group: "ItemDevices",
		Category: "Item",
		Priority: 56,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[10, 600, 90, 400], [400, 600, 90, 400]],
		Asset: [
			{
				Name: "WoodenBox", Priority: 58, Value: 60, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", RemoveAtLogin: true,
				DefaultColor: ["Default", "#600"], SetPose: ["BaseLower"], Extended: true, DynamicAfterDraw: true, MinOpacity: 0, Opacity: 0, FixedPosition: true,
				Block: ["ItemAddon"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotHorse", "NotLifted"],
				Effect: ["Prone", "Enclose", "Freeze"],
				TextMaxLength: { Text: 20 },
				TextFont: "'Saira Stencil One', 'Arial', sans-serif",
				Layer: [
					{ Name: "Back", Priority: 1, MinOpacity: 1, HasType: false },
					{ Name: "Panel", CopyLayerColor: "Back", HasType: false },
					{ Name: "Text", HasImage: false, HasType: false },
					{
						Name: "Frame", CopyLayerColor: "Back", MinOpacity: 1, HasType: false,
						Alpha: [{ Masks: [[0, -50, 500, 80], [0, 10, 45, 980], [445, 10, 55, 980], [0, 990, 500, 110], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }],
					},
				],
			},
			{ Name: "SmallWoodenBox", Priority: 58, Value: 40, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel", "NotLifted"], SetPose: ["Kneel"], Block: ["ItemAddon"], Effect: ["ForceKneel", "Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }], RemoveAtLogin: true },
			{ Name: "MilkCan", Priority: 58, Fetish: ["Metal"], Value: -1, Difficulty: 1, Time: 15, RemoveTime: 10, SetPose: ["Kneel"], Effect: ["BlindHeavy", "Prone", "Enclose", "GagHeavy", "Freeze"], HideItem: ["ShoesFlippers"], RemoveAtLogin: true },
			{
				Name: "WaterCell", Priority: 58, Fetish: ["Metal"], Value: -1, Difficulty: 1, Time: 15, RemoveTime: 15, SetPose: ["Suspension", "LegsClosed"], Effect: ["Prone", "Enclose", "GagMedium", "Freeze"], HideItem: ["ShoesFlippers"], Block: ["ItemFeet"], RemoveAtLogin: true,
				Alpha: [{ Masks: [[0, 145, 81, 910], [419, 145, 81, 910]] }],
				OverrideHeight: { Height: -150, Priority: 41, HeightRatioProportion: 0 },
			},
			{
				Name: "Cage", Priority: 58, Fetish: ["Metal"], Value: 120, Difficulty: 4, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", RemoveAtLogin: true,
				Prerequisite: ["NotKneeling", "NotSuspended", "NotLifted"],
				Effect: ["Prone", "Enclose", "Freeze"],
				HideItem: ["ShoesFlippers"],
				Block: ["ItemAddon"],
				Alpha: [{ Masks: [[1, 80, 105, 900], [410, 80, 105, 900]] }],
				SetPose: ["BaseLower"],
				Layer: [
					{ Name: "Frame", ColorGroup: "Cage" },
					{ Name: "Mesh", ColorGroup: "Cage" },
					{ Name: "Tint" },
				]
			},
			{ Name: "LowCage", Priority: 58, Fetish: ["Metal"], Value: 80, Difficulty: 4, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Block: ["ItemAddon"], Prerequisite: ["NotLifted", "NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 80, 75, 900], [400, 80, 100, 900]] }], RemoveAtLogin: true },
			{ Name: "SaddleStand", Fetish: ["Metal"], Priority: 39, Value: 100, Difficulty: -2, Time: 10, AllowLock: true, Prerequisite: ["LegsOpen", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotKneelingSpread", "NotShackled"], SetPose: ["LegsOpen"], Effect: ["Prone", "Freeze", "Mounted"], Block: ["ItemPelvis", "ItemLegs", "ItemFeet"], AllowActivityOn: ["ItemPelvis", "ItemLegs", "ItemFeet"], Height: 30, RemoveAtLogin: true },
			{ Name: "BurlapSack", Priority: 39, Value: 35, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 6, Audio: "Bag", Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "ClothLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemHidden", "ItemNipplesPiercings", "ItemTorso", "ItemTorso2", "Panties", "Garters", "LeftHand", "RightHand"], SetPose: ["Kneel", "BackElbowTouch"], Effect: ["ForceKneel", "Block", "Prone", "Freeze"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"] },
			{ Name: "InflatableBodyBag", Fetish: ["Latex"], Priority: 31, Value: 225, Difficulty: 1, SelfBondage: 6, Time: 30, RemoveTime: 50, AllowLock: true, Audio: "Bag", Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "Suit", "ClothLower", "SuitLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemNipplesPiercings", "Panties", "ItemPelvis", "Garters", "LeftHand", "RightHand"], HideItem: ["ItemVulvaFullLatexSuitWand", "ItemNipplesLactationPump", "ClothAccessoryPoncho"], AllowPose: ["Kneel"], SetPose: ["LegsClosed", "BackElbowTouch"], Effect: ["Block", "Prone", "Freeze"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"], Extended: true, SelfUnlock: false, AllowActivePose: ["Kneel"] },
			{
				Name: "FurBlanketWrap", Priority: 31, Value: 225, Difficulty: 1, Top: 0, SelfBondage: 5, Time: 30, RemoveTime: 50,
				Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"],
				Hide: ["ItemLegs", "ClothLower", "Cloth", "Suit", "Shoes", "ItemArms", "ItemButt", "TailStraps", "Wings", "ItemNipplesPiercings", "Panties", "ItemPelvis", "Garters"],
				HideItem: ["ItemVulvaFullLatexSuitWand", "ItemNipplesLactationPump", "ClothAccessoryPoncho"],
				AllowPose: ["Kneel"], SetPose: ["LegsClosed", "BackElbowTouch"],
				Effect: ["Block", "Prone", "Freeze"],
				Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
				Alpha: [{ Masks: [[0, 0, 500, 900]], Group: ["SuitLower", "Shoes", "ItemBoots", "ItemFeet", "BodyLower", "Socks"] }],
				Extended: true, SelfUnlock: false, DrawLocks: false, AllowActivePose: ["Kneel"], Layer: [
					{ Name: "Blanket" },
					{ Name: "Belts", AllowTypes: ["Belts"] }
				]
			},
			{
				Name: "BondageBench", Fetish: ["Leather"], Priority: 1, Value: 250, SelfBondage: 0, Time: 10, RemoveTime: 10, Extended: true, RemoveAtLogin: true,
				Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader"],
				SetPose: ["LegsClosed"],
				Effect: ["Mounted"],
				AllowLock: true,
				Layer: [
					{ Name: "Bench", AllowColorize: true, Priority: 1, HasType: false },
					{ Name: "Straps", AllowColorize: true, Priority: 53, HasType: true },
				],
			},

			{ Name: "BBQ", Priority: 1, Value: 30, Difficulty: -10, Time: 5, IsRestraint: false, Effect: [], RemoveAtLogin: true, FixedPosition: true },
			{ Name: "WetFloor", Priority: 70, Value: 30, Difficulty: -10, Time: 5, IsRestraint: false, Effect: [], RemoveAtLogin: true, FixedPosition: true, DefaultColor: ["#fdc800", "#000000"],
				Layer: [
					{ Name: "Sign" },
					{ Name: "Text" }
				]
			},
			{ Name: "LittleMonster", Priority: 34, Value: 40, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"], Effect: [], Extended: true, RemoveAtLogin: true },
			{ Name: "Familiar", Priority: 6, Value: 200, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"], Effect: [], Extended: true, RemoveAtLogin: true, HideItem: ["ItemMiscTeddyBear"] },
			{ Name: "Coffin", Priority:70, Value: 240,  Top: -150, Left:10, Difficulty: -20, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotLifted", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NoFeetSpreader"], Block: ["ItemAddon"], SetPose: ["LegsClosed"], HideItem: ["ShoesFlippers"],
				Layer: [
					{Name:"Inside", Priority:1, HasType: false},
					{Name:"Frame", Priority:57, ColorGroup: "Main", HasType: false, Alpha: [{ Masks: [
						[0, 0, 500, 20],  //Above
						[0, 950, 500, 50],  //Below
						[0, 0, 160, 1000], //Left side is covered by lid
						[360, 0, 135, 200], //Triangle approx of right side
						[370, 200, 135, 1000],
						[355, 500, 15, 500],
						[350, 600, 5, 400],
						[345, 700, 5, 300],
						[340, 800, 5, 200]
					]}]},
					{Name:"Open", Priority:58, ColorGroup:"Main", AllowTypes:[""]},
					{Name:"Closed", Priority:59, ColorGroup:"Main", AllowTypes:["Closed"]}
				],
				Extended:true, RemoveAtLogin: true
			},
			{ Name: "CryoCapsule", Category: ["SciFi"], Priority:70, Value: 240,  Top: 0, Left:10, Difficulty: -20, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotLifted", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NoFeetSpreader"], Block: ["ItemAddon"], SetPose: ["LegsClosed"], HideItem: ["ShoesFlippers"],
				Layer: [
					{Name:"Inside", Priority:1, HasType: false},
					{Name:"Frame", Priority:57, ColorGroup: "Main", HasType: false, Alpha: [{ Masks: [
						[0, 0, 500, 50],  //Above
						[0, 970, 500, 30],  //Below
						[0, 0, 160, 1000], //Left side is covered by lid
						[360, 0, 135, 200], //Triangle approx of right side
						[370, 200, 135, 1000],
						[365, 500, 15, 500],
						[355, 600, 5, 400],
						[355, 700, 5, 300],
						[350, 800, 5, 200]
					]}]},
					{Name:"Open", Priority:58, ColorGroup:"Main", AllowTypes:[""]},
					{Name:"Closed", Priority:59, ColorGroup:"Main", AllowTypes:["Closed"]}
				],
				Extended:true, RemoveAtLogin: true
			},
			{
				Name: "OneBarPrison", Gender: "F", Fetish: ["Metal"], Priority: 16, Value: 75, Difficulty: 8, SelfBondage: 2, Time: 20, AllowLock: true, Prerequisite: ["AccessVulva", "AllFours", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste", "HasVagina"], SetPose: ["LegsOpen"], Effect: ["FillVulva", "Prone", "Freeze", "Mounted"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva", "ItemFeet"], AllowActivityOn: ["ItemPelvis", "ItemLegs", "ItemFeet"], Layer: [
					{ Name: "Bar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				],
				RemoveAtLogin: true
			},
			{ Name: "TheDisplayFrame", Fetish: ["Metal"], Value: 100, Difficulty: 50, SelfBondage: 5, Time: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["DisplayFrame", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotMasked"], SetPose: ["LegsClosed", "BackElbowTouch"], Effect: ["Prone", "Freeze", "Block", "Mounted"], HideItem: ["ShoesFlippers"],  Block: ["ItemArms", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNeckAccessories"], RemoveAtLogin: true },
			{ Name: "Sybian", Priority: 22, Value: 80, Difficulty: 1, Time: 10, IsRestraint: false, Prerequisite: ["AccessVulva", "AllFours", "LegsOpen", "NotSuspended", "NotHogtied", "NotShackled", "NotChaste", "NotHorse"], Hide: ["Shoes", "ItemBoots", "ItemLegs", "ItemVulva"], SetPose: ["KneelingSpread"], Effect: ["FillVulva", "Egged", "Freeze", "Mounted"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemPelvis", "ItemButt", "ItemVulva"], AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemPelvis"], RemoveAtLogin: true, ArousalZone: "ItemVulva", DynamicScriptDraw: true },
			{ Name: "StrapOnSmooth", Fetish: ["Leather"], Priority: 34, Value: 25, Difficulty: 1, Time: 10, IsRestraint: false, AllowActivity: ["PenetrateItem"] },
			{ Name: "StrapOnStuds", Fetish: ["Leather"], Priority: 34, Value: 25, Difficulty: 1, Time: 10, IsRestraint: false, AllowActivity: ["PenetrateItem"] },
			{ Name: "DisplayCase", Priority: 58, Fetish: ["Metal"], Value: 60, Difficulty: -2, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotLifted"], Effect: ["Prone", "Enclose", "DeafLight", "GagLight", "Freeze"], Block: ["ItemAddon"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }], RemoveAtLogin: true, SetPose: ["BaseLower"] },
			{ Name: "SmallDisplayCase", Priority: 58, Fetish: ["Metal"], Value: 40, Difficulty: -2, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotLifted"], Block: ["ItemAddon"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "DeafLight", "GagLight", "Freeze"], HideItem: ["ShoesFlippers"],  Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }], RemoveAtLogin: true },
			{ Name: "FuturisticCrate", Priority: 58, Category: ["SciFi"], Fetish: ["Metal"], Value: 70, FixedPosition: true, Difficulty: -6, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, DrawLocks: false, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotLifted"], LayerVisibility: true,
				Effect: ["Tethered"],
				AllowEffect: ["GagLight", "Freeze", "Prone", "BlindLight", "Enclose", "BlindNormal", "BlindHeavy", "Block", "Egged", "Vibrating", "FillVulva", "Edged", "BlockKneel", "Mounted"],
				HideItem: ["ShoesFlippers"],
				Block: ["ItemAddon"],
				ArousalZone: "ItemVulva",
				RemoveAtLogin: true, Extended: true, DynamicScriptDraw: true, DynamicBeforeDraw: true,
				DefaultColor: ["#222222", "Default", "#444444", "Default", "Default", "#FF1199", "Default", "#444444", "#555555", "#3B7F2C","Default", "Default", "#BBBBFF", "Default", ],
				Layer: [
					{ Name: "Body", ColorGroup: "Padding", Priority: 1, HasType: false},
					{ Name: "StrapsArms", ColorGroup: "Structure", Priority: 40, HasType: false, AllowModuleTypes:["a3"]},
					{ Name: "StrapsHarness", ColorGroup: "Harness", Priority: 25, HasType: false, ModuleType: ["h"], AllowModuleTypes:["h1", "h2", "h3", "h4"]},
					{ Name: "ClampsHarness", ColorGroup: "Harness", Priority: 25, HasType: false, ModuleType: ["h"], AllowModuleTypes:["h1", "h2", "h3", "h4"]},
					{ Name: "DevicePleasure", ColorGroup: "Pleasure", Priority: 25, HasType: false, AllowModuleTypes:["d1"]},
					{ Name: "DevicePleasurePlug", ColorGroup: "Pleasure", Priority: 25, HasType: false, AllowModuleTypes:["d1"]},
					{ Name: "DevicePleasureHolder", ColorGroup: "Pleasure", Priority: 25, HasType: false, AllowModuleTypes:["d1"]},
					{ Name: "DevicePleasureStructure", ColorGroup: "Structure", Priority: 2, HasType: false, ModuleType: ["t"], AllowModuleTypes:["t1", "t2", "t3", "d1", "l1", "a1", "a2"]},
					{ Name: "StrapsArmsMesh", ColorGroup: "Padding", Priority: 2, HasType: false, AllowModuleTypes:["a3"]},
					{ Name: "Display", Priority: 58, HasType: false, },
					{ Name: "Lock", Priority: 58, HasType: false, LockLayer: true },
					{ Name: "Frame", ColorGroup: "Structure", Priority: 58, HasType: false, Alpha: [{ Masks: [[0, 0, 55, 1000], [420, 0, 80, 1000], [0, 995, 500, 5], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }], },
					{ Name: "Glass", Priority: 57, HasType: false, ModuleType: ["w"], AllowModuleTypes: ["w1", "w2", "w3"], Visibility: "AllExceptPlayerDialog" },
					{ Name: "Lid", ColorGroup: "Structure", Priority: 57, HasType: false, AllowModuleTypes: ["w4"], Visibility: "Others" },
					{ Name: "Lid_Window", Priority: 57, CopyLayerColor: "Lid", HasType: false, ModuleType:["w"], AllowModuleTypes: ["w2", "w3"], Visibility: "AllExceptPlayerDialog" },
					{ Name: "StrapsLegs", CopyLayerColor: "StrapsArms", Priority: 56, HasType: false, AllowModuleTypes:["l3"]},
					{ Name: "StrapsLegsClosed", CopyLayerColor: "StrapsArms", Priority: 56, HasType: false, AllowModuleTypes:["l2"]},
					{ Name: "StrapsLegsMesh", Priority: 2, CopyLayerColor: "StrapsArmsMesh", HasType: false, AllowModuleTypes:["l3"]},
				],
			},
			{
				Name: "DollBox", Priority: 58, Value: 20, Difficulty: -2, SelfBondage: 1, Time: 1, RemoveTime: 1, Left: -8, Top: -20, AllowLock: true, DrawLocks: false, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotLifted"], Effect: ["Freeze", "Prone", "Enclose"], HideItem: ["ShoesFlippers"],
				Block: ["ItemAddon"], DynamicAfterDraw: true, HasType: false,
				RemoveAtLogin: true, Extended: true, SetPose: ["BaseLower"],
				DefaultColor: ["#530E50", "#DD2BD5","#A0A0A0", "#D8D8D8","#854DA5", "#9EDDFA"],
				TextMaxLength: { Text: 22, Text2: 22 },
				TextFont: "'Satisfy', cursive",
				Layer: [
					{ Name: "Back", Priority: 1, ColorGroup: "Box" },
					{ Name: "Cover", Priority: 58, ColorGroup: "Box", Alpha: [{ Masks: [[0, 0, 100, 1000], [410, 0, 90, 1000], [0, 880, 500, 140], [0, 0, 500, 70], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }] },
					{ Name: "DollText", Priority: 58, ColorGroup: "Text" },
					{ Name: "Text", Priority: 58, ColorGroup: "Text", HasImage: false },
					{ Name: "Heart", Priority: 58 },
					{ Name: "Glass", Priority: 57 },
				],
			},
			{ Name: "WoodenBoxOpenHead", Value: 60, Difficulty: -2, SelfBondage: 3, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotYoked", "NotLifted"], Hide: ["Wings"], Effect: ["Prone", "Freeze", "Block"],  HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 220, 70, 999], [420, 220, 80, 999], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }], Block: ["ItemAddon", "ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings", "ItemBoots", "ItemHands", "ItemHandheld"], RemoveAtLogin: true, SetPose: ["BaseLower"] },
			{ Name: "SmallWoodenBoxOpenHead", Value: 40, Difficulty: -2, SelfBondage: 3, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel", "NotYoked", "NotLifted"], Hide: ["Wings"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Freeze", "Block"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 220, 70, 999], [420, 220, 80, 999], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }], Block: ["ItemArms", "ItemAddon", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings", "ItemBoots", "ItemHands", "ItemHandheld"], RemoveAtLogin: true },
			{ Name: "WoodenStocks", Value: 150, Difficulty: 50, SelfBondage: 4, Time: 10, AllowLock: true, Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen"], SetPose: ["Yoked", "LegsOpen"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Block: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"], AllowActivityOn: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"],RemoveAtLogin: true, HideItem: ["ItemMiscTeddyBear"], },
			{
				Name: "Vacbed", Gender: "F", Fetish: ["Latex"], ParentGroup: "BodyUpper", Value: 200, Difficulty: 50, BuyGroup: "Vac", Priority: 36, SelfBondage: 3, Time: 10, Extended: true,
				Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen", "NoItemHands", "NoItemLegs", "NoHorse", "NoItemFeet", "HasBreasts"],
				Hide: ["ItemNeckAccessories", "ItemNeckRestraints", "HairBack", "ClothAccessory", "Bracelet", "Garters"],
				SetPose: ["Yoked", "BaseLower"],
				Effect: ["Prone", "Freeze", "Block", "Mounted", "Chaste", "ButtChaste"],
				HideItem: ["ShoesFlippers"],
				Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999]] }],
				Block: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemAddon", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraints", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
				AllowActivityOn: ["ItemNeck", "ItemArms", "ItemHands", "ItemHandheld", "ItemBreast", "ItemNipples", "ItemPelvis", "ItemLegs", "ItemFeet", "ItemBoots", "ItemButt", "ItemVulva", "ItemVulvaPiercings"],
				RemoveAtLogin: true
			},
			{
				Name: "VacBedDeluxe", Gender: "F", Fetish: ["Latex"], Priority: 36, Value: 250, Difficulty: 50, SelfBondage: 3, Time: 10, RemoveTime: 10, AllowLock: true, RemoveAtLogin: true, DefaultColor: ["#808080", "#808080", "#808080"], Extended: true, MinOpacity: 0.25, MaxOpacity: 1, Opacity: 1,
				Hide: ["Hands", "HairBack", "Cloth", "ClothLower", "ClothAccessory", "Necklace", "Suit", "SuitLower", "Bra", "Panties", "Socks", "RightAnklet", "LeftAnklet", "Shoes", "Gloves", "TailStraps", "Wings", "ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemArms", "ItemHands", "ItemHandheld", "ItemBoots", "Pussy", "Corset", "Bracelet", "Garters", "LeftHand" ,"RightHand"],
				HideItem: ["ItemMiscTeddyBear"],
				Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "NoItemHands", "NoItemLegs", "NoHorse", "NoItemFeet", "HasBreasts"],
				Block: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraints", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
				AllowActivityOn: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"],
				SetPose: ["BaseUpper", "BaseLower"],
				Effect: ["Prone", "Freeze", "Block", "Mounted"],
				FreezeActivePose: ["BodyUpper", "BodyLower"],
				DrawLocks: false,
				Layer: [
					{ Name: "SheetBack", ColorGroup:"Sheet", Priority: 1, HasType: false },
					{ Name: "SheetFront", ColorGroup:"Sheet", Priority: 2, HasType: false },
					{ Name: "ArmsDown", ColorGroup:"Body", ParentGroup: "BodyUpper", HasType: false, AllowModuleTypes: ["a0"] },
					{ Name: "ArmsYoked", ColorGroup:"Body", ParentGroup: "BodyUpper", HasType: false, AllowModuleTypes: ["a1"], CopyLayerColor: "ArmsDown" },
					{ Name: "LegsSpread", ColorGroup:"Body", ParentGroup: "BodyLower", HasType: false, AllowModuleTypes: ["l0"] },
					{ Name: "LegsClosed", ColorGroup:"Body", ParentGroup: "BodyLower", HasType: false, AllowModuleTypes: ["l1"], CopyLayerColor: "LegsSpread" },
					{ Name: "Frame", MinOpacity: 1, Priority: 3, HasType: false }
				]
			},
			{
				Name: "VacbedClear", Gender: "F", Fetish: ["Latex"], ParentGroup: "BodyUpper", Value: -1, Difficulty: 50, BuyGroup: "Vac", Priority: 36, SelfBondage: 3, Time: 10,
				Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen", "NoItemHands", "NoItemLegs", "NoHorse", "NoItemFeet", "HasBreasts"],
				Hide: ["ItemNeckAccessories", "ItemNeckRestraints", "ClothAccessory", "Shoes"],
				HideItem: ["ItemMiscTeddyBear"],
				SetPose: ["Yoked", "BaseLower"],
				Effect: ["Prone", "Freeze", "Block", "Mounted", "Chaste", "ButtChaste"],
				Alpha: [{ Masks: [[1, 1, 60, 999], [440, 1, 60, 999]] }],
				Block: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemAddon", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraints", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
				AllowActivityOn: ["ItemNeck", "ItemArms", "ItemHands", "ItemHandheld", "ItemBreast", "ItemNipples", "ItemPelvis", "ItemLegs", "ItemFeet", "ItemBoots", "ItemButt", "ItemVulva", "ItemVulvaPiercings"],
				RemoveAtLogin: true
			},
			{
				Name: "Crib", Category: ["ABDL"], Fetish: ["ABDL"], Priority: 1, Value: 100,
				Difficulty: 0, SelfBondage: 1, Time: 15, RemoveTime: 10, IsRestraint: true, AllowLock: true, Left: -30, Top: -235,
				Effect: ["Freeze", "Leash"], HideItem: ["ShoesFlippers"], RemoveAtLogin: true, Prerequisite: ["AllFours", "NotSuspended", "NotHogtied"], Extended: true, SetPose: ["BaseLower"],
				Layer: [
					{ Name: "GateClosed", CopyLayerColor: "Frame", AllowModuleTypes: ["g1"], HasType: false },
					{ Name: "GateOpen", CopyLayerColor: "Frame", AllowModuleTypes: ["g0"], HasType: false },
					{ Name: "Frame", ParentGroup: null, HasType: false },
					{ Name: "Mattress", ParentGroup: null, HasType: false },
					{ Name: "Pillow", ParentGroup: null, HasType: false },
					{ Name: "PillowTrim", ParentGroup: null, HasType: false },
					{ Name: "Plushies", Priority: 54, ParentGroup: null, AllowModuleTypes: ["p1"], HasType: false }
				],
			},
			{
				Name: "Bed", Value: 100, Priority: 1, Difficulty: -20, SelfBondage: 0, Time: 5, RemoveTime: 5, RemoveAtLogin: true, DefaultColor: ["#523629", "#888990", "#808284"], BuyGroup: "Bed",
				OverrideHeight: { Height: 0, HeightRatioProportion: 1, Priority: 21 },
				RemoveItemOnRemove: [
					{ Group: "ItemAddon", Name: "Covers" },
					{ Group: "ItemAddon", Name: "BedRopes" },
					{ Group: "ItemAddon", Name: "BedStraps" },
					{ Group: "ItemAddon", Name: "BedTape" },
					{ Group: "ItemAddon", Name: "BedChains" },
					{ Group: "ItemArms", Name: "UnderBedBondageCuffs" },
					{ Group: "ItemArms", Name: "MedicalBedRestraints" },
					{ Group: "ItemArms", Name: "HempRope", Type: "BedSpreadEagle" },
					{ Group: "ItemLegs", Name: "MedicalBedRestraints" },
					{ Group: "ItemFeet", Name: "HempRope", Type: "BedSpreadEagle" },
					{ Group: "ItemFeet", Name: "MedicalBedRestraints" },
				],
				Effect: ["Freeze", "Mounted", "OnBed"],
				Prerequisite: ["AllFours", "NotSuspended", "NotHogtied"],
				SetPose: ["BaseLower"],
				AllowActivePose: ["BaseLower", "LegsClosed", "Kneel", "KneelingSpread"],
				Layer: [
					{ Name: "BedFrame" },
					{ Name: "Mattress" },
					{ Name: "Pillow" }
				]
			},
			{
				Name: "X-Cross", Priority: 1, Value: 200, Left: 0, Top: -50, Difficulty: 9, SelfBondage: 1, Time: 15, AllowLock: true, RemoveAtLogin: true, Prerequisite: ["CuffedArms", "CuffedFeet", "AllFours", "NotSuspended", "NotHogtied", "LegsOpen", "NotKneeling"], SetPose: ["OverTheHead", "Spread"], HideItem: ["ShoesMistressBoots", "ShoesPonyBoots", "ShoesThighHighLatexHeels"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Block: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"], AllowActivityOn: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"],
				OverrideHeight: { Height: -25, Priority: 10 },
				Layer: [
					{ Name: "Cross" },
					{ Name: "Padding" }
				]
			},
			{
				Name: "ChangingTable", Category: ["ABDL"], Fetish: ["ABDL"], Priority: 1, Value: 100, Difficulty: 0, SelfBondage: 1, Time: 15, RemoveTime: 10, IsRestraint: true, AllowLock: false, Left: -30, Top: -235, Effect: ["Freeze"], RemoveAtLogin: true, Prerequisite: ["NotSuspended", "NotHogtied"], SetPose: ["BaseLower"], Layer: [
					{ Name: "Frame" },
					{ Name: "Table" }
				]
			},
			{
				Name: "Locker", Priority: 58, Value: 50, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, Top: 0, AllowLock: true, Extended: true, RemoveAtLogin: true, MinOpacity: 0, Opacity: 0, FixedPosition: true,
				Block: ["ItemAddon"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotLifted"],
				Effect: ["Prone", "Enclose", "BlindLight", "Freeze"],
				Layer: [
					{ Name: "Back", Priority: 1, MinOpacity: 1, HasType: false },
					{ Name: "Door", CopyLayerColor: "Back", HasType: false },
					{ Name: "VentCovers", CopyLayerColor: "Back", AllowTypes: ["Ventless"] },
					{ Name: "Handle", AllowColorize: false, HasType: false },
					{
						Name: "Frame", CopyLayerColor: "Back", MinOpacity: 1, HasType: false,
						Alpha: [{ Masks: [[0, 0, 135, 1000], [350, 0, 150, 1000], [135, 0, 215, 25], [135, 995, 215, 5], AssetUpperOverflowAlpha] }],
					},
				],
			},
			{
				Name: "SmallLocker", Priority: 58, Value: 40, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, Top: 0, AllowLock: true, Extended: true, RemoveAtLogin: true, MinOpacity: 0, Opacity: 0,
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel", "NotLifted"],
				SetPose: ["Kneel"],
				Block: ["ItemAddon"],
				Effect: ["ForceKneel", "Prone", "Enclose", "BlindLight", "Freeze"],
				Layer: [
					{ Name: "Back", Priority: 1, MinOpacity: 1, HasType: false },
					{ Name: "Door", CopyLayerColor: "Back", HasType: false },
					{ Name: "VentCovers", CopyLayerColor: "Back", AllowTypes: ["Ventless"] },
					{ Name: "Handle", AllowColorize: false, HasType: false },
					{
						Name: "Frame", CopyLayerColor: "Back", MinOpacity: 1, HasType: false,
						Alpha: [{ Masks: [[0, 0, 135, 750], [350, 0, 150, 750], [135, 0, 215, 25], [135, 725, 215, 25], AssetUpperOverflowAlpha ] }],
					},
				],
			},
			{
				Name: "ConcealingCloak", Value: 75, Difficulty: 0, Top: 0, SelfBondage: 5, Time: 7, AllowLock: true,
				Prerequisite: ["NotSuspended", "AllFours", "Notkneeling", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread"],
				Hide: [ "Suit", "ItemArms", "ItemButt", "TailStraps", "Wings", "ItemNipplesPiercings"],
				HideItem: ["ItemVulvaFullLatexSuitWand", "ClothLowerTutu", "ClothJacket"], Effect: ["Prone"],
				Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemHands", "ItemHandheld", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
				SetPose: ["BaseUpper"],
				Layer: [
					{ Name: "Front", Priority: 48 },
					{ Name: "Back", Priority: 3, CopyLayerColor: "Front" },
					{ Name: "Strap", Priority: 52 }
				]
			},
			{
				Name: "Kennel", Fetish: ["Metal", "Pet"], Top: 0, Value: 150, Time: 15, RemoveTime: 10, AllowLock: true, AlwaysExtend: true, RemoveAtLogin: true, Extended: true, FixedPosition: true, DynamicBeforeDraw: true, DynamicScriptDraw: true,
				DynamicAudio: (C) => InventoryItemDevicesKennelGetAudio(C),
				DefaultColor: ["#2E2E29", "#780E0E", "#2E2E29", "#2E2E29"],
				Prerequisite: ["NotLifted", "NotSuspended", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"],
				SetPose: ["Kneel"],
				Block: ["ItemAddon"],
				Effect: ["ForceKneel", "Tethered"],
				Layer: [
					{ Name: "Kennel", Priority: 1, HasType: false },
					{ Name: "Padding", Priority: 1, AllowTypes: ["d0p1", "d1p1"], HasType: false },
					{
						Name: "Frame", HasType: false, Priority: 58,
						Alpha: [{
							Masks: [[0, 0, 500, 270], [0, 1000, 500, 250], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha]
						}]
					},
					{ Name: "Door", Priority: 58 },
				]
			},
			{
				Name: "PetBed", Fetish: ["Pet"], Value: 50, Difficulty: -25, SelfBondage: 0, Time: 5, RemoveTime: 5, Effect: ["Tethered"], RemoveAtLogin: true, SetPose: ["Kneel"], FixedPosition: true, Extended: true, HasType: false,
				Layer: [
					{ Name: "Lining", Priority: 1, AllowColorize: false},
					{ Name: "Bed", AllowColorize: true, Alpha: [{ Masks: [[0, 800, 500, 900]] }] },
					{ Name: "Blanket", Priority: 4, AllowColorize: true, AllowTypes: ["Blanket"] },
					{ Name: "Inner", Priority: 2, AllowColorize: true, AllowTypes: ["Blanket"]},
				],
			},
			{
				Name: "TransportWoodenBox", Priority: 58, Value: 60, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge",
				DefaultColor: ["Default", "Default", "Default", "#600"], Extended: true, RemoveAtLogin: true, SetPose: ["BaseLower"], MinOpacity: 0, Opacity: 0, DynamicAfterDraw: true, FixedPosition: true,
				Block: ["ItemAddon"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotLifted"],
				Effect: ["Prone", "Enclose", "Freeze", "Leash"],
				TextMaxLength: { Text: 20 },
				TextFont: "'Saira Stencil One', 'Arial', sans-serif",
				Layer: [
					{ Name: "Back", Priority: 1, MinOpacity: 1, HasType: false },
					{ Name: "Panel", CopyLayerColor: "Back", HasType: false },
					{
						Name: "Frame", CopyLayerColor: "Back", MinOpacity: 1, HasType: false,
						Alpha: [{ Masks: [[0, -50, 500, 80], [0, 10, 45, 980], [445, 10, 55, 980], [0, 990, 500, 110], AssetUpperOverflowAlpha, AssetLowerOverflowAlpha] }],
					},
					{ Name: "Wheelholders", MinOpacity: 1, HasType: false },
					{ Name: "Wheels", MinOpacity: 1, HasType: false },
					{ Name: "Text", HasImage: false, HasType: false },
				],
			},
			{
				Name: "VacCube", Gender: "F", Fetish: ["Latex"], Value: 250, Difficulty: 50, Priority: 36, Top: -70, Left: 0, SelfBondage: 4, Time: 20, RemoveAtLogin: true, DefaultColor: "#480000",
				Prerequisite: ["NoItemArms", "NoItemLegs", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NotYoked", "LegsOpen", "NoHorse", "NoItemFeet", "HasBreasts"],
				Hide: ["BodyLower", "Hands", "HairBack", "Cloth", "ClothLower", "ClothAccessory", "Necklace", "Suit", "SuitLower", "Bra", "Panties", "Socks", "RightAnklet", "LeftAnklet", "Shoes", "Gloves", "TailStraps", "Wings", "ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemArms", "ItemHands", "ItemHandheld", "ItemBoots", "Pussy", "Corset", "Bracelet", "LeftHand" ,"RightHand"],
				HideItem: ["ItemMiscTeddyBear"],
				SetPose: ["BaseUpper", "BaseLower"],
				Effect: ["Prone", "Freeze", "Block"],
				Block: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemHandheld", "ItemLegs", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings", "ItemAddon"],
				AllowActivityOn: ["ItemArms", "ItemBoots", "ItemBreast", "ItemFeet", "ItemLegs", "ItemNipples", "ItemPelvis", "ItemTorso", "ItemTorso2",],
				OverrideHeight: { Height: -570, Priority: 60, HeightRatioProportion: 0.95 },
				Alpha: [{Group: ["BodyUpper"], Masks: [[0, 225, 500, 775]]}],
				Layer: [
					{ Name: "Latex", ParentGroup: "BodyUpper" },
					{ Name: "Highlights", ParentGroup: null, AllowColorize: false },
				]
			},
			{
				Name: "PetBowl", Value: 20, Time: 5, IsRestraint: false, DefaultColor: ["Default", "#000000"],
				FixedPosition: true, Extended: true, DynamicAfterDraw: true, TextMaxLength: { Text: 12 },
				TextFont: "'Saira Stencil One', 'Arial', sans-serif",
				Layer: [
					{ Name: "Bowl", Top: 885, Left: 300 },
					{ Name: "Text", HasImage: false, Top: 905, Left: 335 },
				]
			},
			{ Name: "Pole", Value: 40, Top: -150, Priority: 1, Difficulty: -5, RemoveTime: 10, HasType: false, RemoveAtLogin: true, Extended: true, FixedPosition: true },
			{ Name: "Cushion", Priority: 34, Value: 4, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"], Extended: true },
			{
				Name: "FuckMachine", Gender: "F", Value: 200, Difficulty: -100, RemoveTime: 15, SetPose: ["BaseLower"], Left: 1, Top: 465, Priority: 6, RemoveAtLogin: true,
				AllowActivePose: ["BaseLower", "LegsClosed"],
				Prerequisite: ["AccessVulva", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste", "VulvaEmpty", "HasVagina"],
				Effect: ["Mounted", "Freeze", "Egged", "BlockKneel"],
				Block: ["ItemVulva", "ItemPelvis", "ItemVulvaPiercings", "ItemLegs", "ItemFeet"],
				DynamicBeforeDraw: true, DynamicScriptDraw: true,
				AllowActivityOn: ["ItemFeet", "ItemLegs", "ItemBoots"],
				ArousalZone: "ItemVulva",
				Alpha: [{ Group: ["Pussy"], Masks: [[0, 524, 500, 40]] }],
				Layer: [
					{ Name: "Pole", Top: 492 },
					{ Name: "Metal", ColorGroup: "Machine" },
					{ Name: "Plastic", ColorGroup: "Machine" },
					{ Name: "Caps", ColorGroup: "Machine" },
					{ Name: "Dildo", Top: 492 },
					{ Name: "Pussy", AllowColorize: false, Top: 408, Left: 125, Priority: 11 },
				],
			},
			{
				Name: "Net", Value: 50, Difficulty: 20, Random: false, Top: 0, AllowLock: false,
				Prerequisite: ["NotSuspended", "NotMounted", "NoFeetSpreader", "CanKneel",],
				AllowPose: ["Kneel","AllFours","Yoked","Hogtied"],
				SetPose: ["Kneel"],
				Effect: ["Freeze","Block", "Prone", "ForceKneel",],
				Extended: true,
				Layer: [
					{ Name: "Front"},
					{ Name: "Back", Priority: 3, CopyLayerColor: "Front"},
					{ Name: "WeightsFront", HideForPose:["Hogtied"]},
					{ Name: "WeightsBack", Priority: 3, CopyLayerColor:"WeightsFront", HideForPose:["Hogtied"]},
				]
			},
			{
				Name: "Snowman", Value: 60, Difficulty: 4, SelfBondage: 2, Random: false, Top: 0, Height: -40, Time: 15, RemoveTime: 25, DefaultColor: ["#666", "#974338"],
				Prerequisite: ["NotSuspended", "NotHogtied", "AllFours"],
				SetPose: ["BackBoxTie", "BaseLower"],
				Effect: ["Freeze", "Block", "Prone", "KneelFreeze"],
				Hide: ["BodyLower", "Hands", "Cloth", "ClothLower", "SuitLower", "Bra", "Corset", "Panties", "Socks", "RightAnklet", "LeftAnklet", "Garters", "Shoes", "Gloves", "Bracelet", "TailStraps", "ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemArms", "ItemHands", "ItemHandheld", "ItemBoots", "LeftHand", "RightHand"],
				Block: ["ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemArms", "ItemHands", "ItemHandheld", "ItemBoots"],
				Layer: [
					{ Name: "Snow", AllowColorize: false },
					{ Name: "Buttons" },
					{ Name: "StickHands" },
				],
			},
			{
				Name: "MedicalBed", Value: -1, Priority: 1, Difficulty: -20, SelfBondage: 0, Time: 5, RemoveTime: 5, RemoveAtLogin: true, DefaultColor: ["#909090", "#75B2C8", "#808284"], BuyGroup: "Bed",
				OverrideHeight: { Height: 0, HeightRatioProportion: 1, Priority: 21 },
				RemoveItemOnRemove: [
					{ Group: "ItemAddon", Name: "Covers" },
					{ Group: "ItemAddon", Name: "BedRopes" },
					{ Group: "ItemAddon", Name: "BedStraps" },
					{ Group: "ItemAddon", Name: "BedTape" },
					{ Group: "ItemAddon", Name: "BedChains" },
					{ Group: "ItemArms", Name: "UnderBedBondageCuffs" },
					{ Group: "ItemArms", Name: "MedicalBedRestraints" },
					{ Group: "ItemArms", Name: "HempRope", Type: "BedSpreadEagle" },
					{ Group: "ItemLegs", Name: "MedicalBedRestraints" },
					{ Group: "ItemFeet", Name: "HempRope", Type: "BedSpreadEagle" },
					{ Group: "ItemFeet", Name: "MedicalBedRestraints" },
				],
				Effect: ["Freeze", "Mounted", "OnBed", "Leash"],
				AvailableLocations: ["Asylum"],
				Prerequisite: ["AllFours", "NotSuspended", "NotHogtied"],
				SetPose: ["BaseLower"],
				Layer: [
					{ Name: "BedFrame" },
					{ Name: "Mattress" },
					{ Name: "Pillow" }
				]
			},
			{
				Name: "WoodenRack", Value: 180, Priority: 1, Difficulty: 0, RemoveTime: 5, Time: 5, SelfBondage: 0, Random: false, RemoveAtLogin: true, DefaultColor: ["#866949", "#875D37", "#63605F", "#372D24", "#BB895D", "Default", "#875D37", "#875D37"], Extended: true, AlwaysExtend: true, BuyGroup: "WoodenRack",
				OverrideHeight: { Height: 0, HeightRatioProportion: 1, Priority: 21 },
				Effect: ["Freeze", "Mounted", "OnBed"],
				Prerequisite: ["AllFours", "NotSuspended", "NotHogtied"],
				SetPose: ["BaseLower"],
				Block: ["ItemAddon"],
				Layer: [
					{ Name: "Back", HasType: false, ColorGroup: "Wood", AllowModuleTypes: ["f0", "f1"] },
					{ Name: "HalfBack", HasType: false, CopyLayerColor: "Back", AllowModuleTypes: ["f2"] },
					{ Name: "NoBack", HasType: false, AllowColorize: false, AllowModuleTypes: ["f3"], HasImage: false },
					{ Name: "FrameWood", HasType: false, ColorGroup: "Wood" },
					{ Name: "FrameMetal", HasType: false, AllowColorize: true },
					{ Name: "FrameStains", HasType: false, AllowModuleTypes: ["f1"] },
					{ Name: "TopRopes", HasType: false, AllowModuleTypes: ["t1"], Priority: 50 },
					{ Name: "TopRopesTight", HasType: false, CopyLayerColor: "TopRopes", AllowModuleTypes: ["t2"], Priority: 50 },
					{ Name: "TopChains", HasType: false, AllowModuleTypes: ["t3"],Priority: 30 },
					{ Name: "TopChainsTight", HasType: false, CopyLayerColor: "TopChains",AllowModuleTypes: ["t4"], Priority: 30 },
					{ Name: "TopStocksBack", HasType: false, ColorGroup: "Wood", AllowModuleTypes: ["t5"] },
					{ Name: "TopStocks", HasType: false, CopyLayerColor: "TopStocksBack", AllowModuleTypes: ["t5"], Priority: 50 },
					{ Name: "BotRings", HasType: false, CopyLayerColor: "TopChains",AllowModuleTypes: ["b1", "b2"]},
					{ Name: "BotRopes", HasType: false, CopyLayerColor: "TopRopes",AllowModuleTypes: ["b1"], Priority: 50 },
					{ Name: "BotRopesTogether", HasType: false, CopyLayerColor: "TopRopes",AllowModuleTypes: ["b2"], Priority: 50 },
					{ Name: "BotChains", HasType: false, CopyLayerColor: "TopChains", AllowModuleTypes: ["b3"]},
					{ Name: "BotChainsTogether", HasType: false, CopyLayerColor: "TopChains", AllowModuleTypes: ["b4"]},
					{ Name: "BotStocksBack", HasType: false, ColorGroup: "Wood", AllowModuleTypes: ["b5"] },
					{ Name: "BotStocks", HasType: false, CopyLayerColor: "BotStocksBack", AllowModuleTypes: ["b5"], Priority: 50 },
				]
			},
			{
				Name: "WoodenHorse", Priority: 34, Value: 200, Difficulty: 2, Time: 10, Top: 488, Left: 137, Random: false,
				Prerequisite: ["NotKneeling", "LegsOpen", "NotSuspended", "NotHogtied", "NotShackled"],
				Hide: ["Shoes", "ItemBoots"], HideItem: ["ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerGown2Skirt", "ItemMiscTeddyBear", "ItemDevicesLittleMonster", "ItemDevicesFamiliar"],
				SetPose: ["KneelingSpread"], Effect: ["Prone", "Freeze", "Mounted"],
				OverrideHeight: { Height: -75, Priority: 21 },
				Alpha: [{ Masks: [[160, 720, 200, 240]] }], Block: ["ItemFeet", "ItemBoots"],
				AllowActivityOn: ["ItemFeet", "ItemBoots"],
				ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Frame" },
					{ Name: "Wood" }
				]
			},
			{
				Name: "LuckyWheel", Priority: 62, Top: 0, Value: 100, Difficulty: -10, Time: 5, IsRestraint: false, Effect: [],
				FixedPosition: true, Extended: true, DynamicAfterDraw: true, DynamicScriptDraw: true,
				DefaultColor: ["#7F4141", "#881818", "#FFA8DD", "#2C2C2C", "Default", "#7B3D9E", "#FF3F3F", "#343434", "#F2F2F2", "#D43434", "#C2B556", "#81DA88", "#E18DC3"],
				HasType: false,
				Layer: [
					{ Name: "Base", AllowModuleTypes: ["s0"], ColorGroup: "Stand", },
					{ Name: "Base2", AllowModuleTypes: ["s1"], ColorGroup: "Stand", },
					{ Name: "Base2Text", AllowModuleTypes: ["s1"], },
					{ Name: "Base2Metal", AllowModuleTypes: ["s1"], ColorGroup: "Stand", },
					{ Name: "Misc", AllowModuleTypes: ["m0"], ColorGroup: "Misc", },
					{ Name: "MiscFlogger", AllowModuleTypes: ["m0"], ColorGroup: "Misc", },
					{ Name: "MiscGag", AllowModuleTypes: ["m0"], ColorGroup: "Misc", },
					{ Name: "Back", Top: 190, },
					{ Name: "LightsBase", Top: 190, AllowColorize: false, },
					{ Name: "BlinkingLights", Top: 190, HasImage: false, AllowColorize: false, },
					{ Name: "Text", Top: 190, HasImage: false, },
					{ Name: "Arrow", AllowModuleTypes: ["a0"], },
					{ Name: "Arrow2", CopyLayerColor: "Arrow", AllowModuleTypes: ["a1"], },
					{ Name: "Arrow3", CopyLayerColor: "Arrow", AllowModuleTypes: ["a2"], },
					{ Name: "Section1", HasImage: false, ColorGroup: "Section", },
					{ Name: "Section2", HasImage: false, ColorGroup: "Section", },
					{ Name: "Section3", HasImage: false, ColorGroup: "Section", },
				]
			},
			{
				Name: "WheelFortune", Priority: 62, Top: 0, Left: 350, Value: 100, Difficulty: -10, Time: 5, IsRestraint: false, Effect: [],
				FixedPosition: true, Extended: true,
				DefaultColor: ["Default", "#7F4141", "#881818", "#FFA8DD", "#2C2C2C", "Default", "#7B3D9E", "#FF3F3F", "#343434", "#F2F2F2", "#D43434", "#C2B556", "#81DA88", "#E18DC3"],
				HasType: false
			}
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemAddon",
		Category: "Item",
		Priority: 51,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[400, 0, 90, 200]],
		Asset: [
			{
				Name: "Covers", Value: -1, Difficulty: 1, SelfBondage: 0, DefaultColor: ["#99A2AB", "Default"], Prerequisite: "OnBed", BuyGroup: "Bed",
				Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				]
			},
			{ Name: "BedRopes", Fetish: ["Rope"], Value: -1, Difficulty: 6, SelfBondage: 3, DefaultColor: "#956B1C", Audio: "RopeShort", Block: ["ItemDevices"], Hide: ["TailStraps"], Prerequisite: "OnBed", BuyGroup: "Bed", CraftGroup: "HempRope", },
			{ Name: "BedStraps",Fetish: ["Leather"], Value: -1, Difficulty: 6, SelfBondage: 2, Block: ["ItemDevices"], Hide: ["TailStraps"], AllowLock: true, Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedTape", Fetish: ["Tape"], Value: -1, Difficulty: 6, SelfBondage: 2, Block: ["ItemDevices"], Hide: ["TailStraps"], Prerequisite: "OnBed", BuyGroup: "Bed", CraftGroup: "DuctTape", },
			{ Name: "BedChains", Fetish: ["Metal"], Value: -1, Difficulty: 6, SelfBondage: 4, Block: ["ItemDevices"], Hide: ["TailStraps"], AllowLock: true, Audio: "ChainLong", Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "CeilingRope", Top: -700, Random: false, Priority: 1, Fetish: ["Rope"], Value: 60, Prerequisite: ["CanBeCeilingTethered"], BuyGroup: "HempRope", CraftGroup: "HempRope", Difficulty: 6, Audio: "RopeLong", SelfBondage: 0, Extended: true, HasType: false, DefaultColor: "#956B1C", Effect: ["Freeze"], SetPose: ["BaseLower"], WhitelistActivePose: ["BaseLower", "LegsClosed"], AllowActivePose: ["LegsClosed"],
				Layer: [
					{ Name: "Ring", AllowColorize: false },
					{ Name: "Ropes" },
				]
			},
			{ Name: "CeilingChain", Top: -700, Random: false, Priority: 1, Fetish: ["Metal"], Prerequisite: ["CanBeCeilingTethered"], Value: 90, BuyGroup: "Chains", Difficulty: 6, Audio: "ChainLong", SelfBondage: 0, AllowLock: true, DrawLocks: false, Extended: true, HasType: false, Effect: ["Freeze"], SetPose: ["BaseLower"], WhitelistActivePose: ["BaseLower", "LegsClosed"], AllowActivePose: ["LegsClosed"] }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemBoots",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 23,
		Default: false,
		IsRestraint: true,
		Left: 125,
		Top: 500,
		Hide: ["Shoes"],
		AllowPose: ["LegsClosed", "Kneel", "Hogtied", "KneelingSpread"],
		Zone: [[100, 870, 300, 130]],
		Asset: [
			{ Name: "PonyBoots", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 875, 350, 200]] }], Height: 35, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "BalletHeels", Fetish: ["Leather"], Value: 75, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 825, 350, 200]] }], Height: 35, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "BalletWedges", Fetish: ["Leather"], Value: 50, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 825, 350, 200]] }], Height: 35, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "ToeCuffs", Fetish: ["Metal"], Value: 35, Difficulty: 4, Time: 10, RemoveTime: 5, AllowLock: true, Prerequisite: ["CanCloseLegs"], Audio: "LockSmall", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], FreezeActivePose: ["BodyLower"], HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "LeatherToeCuffs", Fetish: ["Leather"], Value: 50, Difficulty: 3, Time: 10, RemoveTime: 5, AllowLock: true, Prerequisite: ["CanCloseLegs"], SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], FreezeActivePose: ["BodyLower"], HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "ToeTie", Fetish: ["Rope"], Value: 15, Difficulty: 2, Time: 10, RemoveTime: 5, DefaultColor: "#956B1C", CraftGroup: "HempRope", Prerequisite: ["CanCloseLegs"], Audio: "RopeShort", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], FreezeActivePose: ["BodyLower"], HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "ThighHighLatexHeels", Fetish: ["Latex"], Value: -1, Time: 10, RemoveTime: 15, AllowLock: true, BuyGroup: "ThighHighLatexHeels",
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 680, 350, 320]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 650, 350, 350]] },
				], Height: 30, HideForPose: ["Spread"]
			},
			{ Name: "LockingHeels", Value: 20, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Height: 15, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "LockingHeels2", Value: 25, Difficulty: 7, Time: 10, RemoveTime: 15, AllowLock: true, Height: 15, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "LockingShoes1", Value: 15, Difficulty: 3, Time: 5, RemoveTime: 8, AllowLock: true, Height: 6, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "LockingShoes2", Value: 20, Difficulty: 4, Time: 5, RemoveTime: 8, AllowLock: true, Height: 6, HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "FuturisticHeels", Category: ["SciFi"], Value: 50, Difficulty: 7, Time: 10, RemoveTime: 20, DefaultColor: ["#50913C", "Default"], Random: false, AllowLock: true, DrawLocks: false, Height: 6, FuturisticRecolor: true, Effect: [],
				Extended: true, Audio: "FuturisticApply", BuyGroup: "FuturisticHeels",
				Layer: [
					{ Name: "Display", HasType: false },
					{ Name: "Shoes", AllowTypes:["", "Heel"] },
					{ Name: "Lock", LockLayer: true, AllowColorize: true, AllowTypes:["", "Heel"], ParentGroup: null},
				], HideForPose: ["Spread", "KneelingSpread"]
			},
			{ Name: "FuturisticHeels2", Value: 50, Difficulty: 7, Time: 10, RemoveTime: 20,
				Left: 75, DefaultColor: ["Default", "#50913C", "Default", "Default", "Default", "#aaaaaa", "Default"], Random: false, AllowLock: true, DrawLocks: false, Audio: "FuturisticApply", BuyGroup: "FuturisticHeels", Extended: true, FuturisticRecolor: true, Effect: [],
				AllowPose: ["LegsClosed", "Kneel", "Hogtied", "Spread"],
				HideForPose: ["KneelingSpread"],
				Layer: [
					{ Name: "Mesh", ParentGroup: null, HasType: false },
					{ Name: "Display", ParentGroup: null, HasType: false },
					{ Name: "Shine", ParentGroup: null, HasType: false, AllowTypes:[""]},
					{ Name: "Cuffs", ParentGroup: null, HasType: false },
					{ Name: "Trim", ParentGroup: null, HasType: false },
					{ Name: "Soles", ParentGroup: null, HasType: false },
					{ Name: "Lock", LockLayer: true, HasType: false ,AllowColorize: true, ParentGroup: null},
				],Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 860, 350, 120]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 870, 350, 150]] },
				], Height: 30
			},
			{
				Name: "LockingBoots1", Value: 30, Difficulty: 6, Time: 7, RemoveTime: 14, AllowLock: true, Height: 9, HideForPose: ["Spread", "KneelingSpread"],
				Layer: [
					{ Name: "Boots" },
					{ Name: "Straps" }
				]
			},
			{
				Name: "LeatherFootMitts1", Fetish: ["Leather"], Value: 35, Difficulty: 4, Time: 6, RemoveTime: 7, AllowLock: true, Hide: ["Shoes", "Socks"], HideForPose: ["Spread", "KneelingSpread"],
				Layer: [
					{ Name: "Mitts" },
					{ Name: "Straps" }
				]
			},
			{ Name: "ToeTape", Fetish: ["Tape"], Extended: true, Value: 50, BuyGroup: "DuctTape", CraftGroup: "DuctTape", Audio: "DuctTape", Difficulty: 2, Time: 10, RemoveTime: 5, Prerequisite: ["CanCloseLegs"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", Audio: "ZipTie", Prerequisite: ["CanCloseLegs"], SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], HideForPose: ["Spread", "KneelingSpread"] },
			{ Name: "HighThighBoots", Value: 100, Time: 10, RemoveTime: 10, AllowLock: true, Hide: ["ItemFeet", "Shoes"], AllowPose: ["LegsClosed", "Kneel", "Hogtied", "Spread", "KneelingSpread"],
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 680, 350, 320]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 650, 350, 350]] },
				], Height: 30
			},
			{
				Name: "Slime", Category: ["Fantasy"], BuyGroup: "Slime", DefaultColor: ["#57ab5e", "#57ab5e"], Priority: 28, Random: false, Value: 200, Difficulty: 5, Time: 25, RemoveTime: 40, Left: 100, Top: 800, ParentGroup: null, Prerequisite: ["CanCloseLegs"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], Effect: ["Freeze"],
				HideForPose: ["Kneel", "Spread", "KneelingSpread", "Hogtied"],
				Layer: [
					{ Name: "One" },
					{ Name: "Two" },
				],
			},
			{
				Name: "MonoHeel", Value: 60, Difficulty: 5, Time: 15, RemoveTime: 10, DefaultColor: ["#2c2c2c", "#666", "#999"], AllowLock: true, Extended: true, Height: 25, DrawLocks: false,
				Prerequisite: ["CanCloseLegs"],
				SetPose: ["LegsClosed"],
				AllowActivePose: ["Kneel"],
				FreezeActivePose: ["BodyLower"],
				HideForPose: ["Spread", "KneelingSpread", "Kneel"],
				Effect: ["Freeze", "Prone"],
				Hide: ["Shoes", "ItemFeet"],
				HideItem: ["ClothLowerPajama1", "ItemLegsHempRope", "ItemLegsNylonRope"],
				HideItemExclude: ["ItemFeetChains", "ItemFeetDuctTape", "ItemFeetLeatherBelt", "ItemFeetPlasticWrap", "ItemFeetSlime", "ItemFeetSturdyLeatherBelts", "ItemFeetTentacles", "ItemFeetZipties"],
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[175, 835, 150, 165]] },
				],
				Layer: [
					{ Name: "Binder" },
					{ Name: "Vamp", HasType: false },
					{ Name: "Trim", HasType: false },
					{ Name: "Shine", AllowColorize: false },
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemScript",
		Category: 'Script',
		Priority: 0,
		AllowColorize: false,
		Asset: [{Name: "Script", Visible: false}],
	},
];

/** 3D Custom Girl based pose
 * @type {Pose[]}
 */
var PoseFemale3DCG = [
	{
		Name: "BaseUpper",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "BaseLower",
		Category: "BodyLower",
		AllowMenu: true,
	},
	{
		Name: "Kneel",
		Category: "BodyLower",
		AllowMenu: true,
		OverrideHeight: { Height: -250, Priority: 20 },
		Hide: ["ItemFeet", "LeftAnklet", "RightAnklet"]
	},
	{
		Name: "KneelingSpread",
		Category: "BodyLower",
		OverrideHeight: { Height: -250, Priority: 20 },
		AllowMenu: true,
		Hide: ["ItemFeet", "LeftAnklet", "RightAnklet"],
		MovePosition: [
			{ Group: "ClothLower", X: -90, Y: 0},
			{ Group: "ItemLegs", X: -60, Y: 0},
			{ Group: "Socks", X: -30, Y: 0 },
			{ Group: "Shoes", X: -20, Y: -100 },
			{ Group: "ItemBoots", X: -65, Y: -35 },
		]
	},
	{
		Name: "Yoked",
		Category: "BodyUpper",
		AllowMenu: true,
		Hide: ["Hands"]
	},
	{
		Name: "OverTheHead",
		Category: "BodyUpper",
		AllowMenu: true,
		Hide: ["Hands"],
	},
	{
		Name: "Hogtied",
		Category: "BodyFull",
		OverrideHeight: { Height: -575, Priority: 50 },
		Hide: ["BodyLower", "Hands", "ClothLower", "Wings", "Gloves", "Panties", "Pussy", "ItemHands", "ItemHandheld", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemFeet", "LeftAnklet", "RightAnklet", "Garters", "Bracelet", "LeftHand", "RightHand"],
		MovePosition: [{ Group: "Socks", X: 0, Y: -400 }, { Group: "Shoes", X: 0, Y: -500 }, { Group: "ItemBoots", X: 0, Y: -500 }, { Group: "SuitLower", X: 0, Y: -380 }, { Group: "TailStraps", X: 0, Y: -300 }, { Group: "ItemButt", X: 0, Y: -300 }]
	},
	{
		Name: "Suspension",
		OverrideHeight: { Height: -150, Priority: 40 },
		Hide: []
	},
	{
		Name: "AllFours",
		Category: "BodyFull",
		OverrideHeight: { Height: -560, Priority: 50 },
		Hide: ["ItemFeet", "ClothLower", "SuitLower", "Nipples", "Pussy", "BodyLower", "Wings", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemBoots", "Suit", "Panties", "Bra", "Socks", "Shoes", "LeftAnklet", "RightAnklet", "Garters", "Bracelet"],
		MovePosition: [{ Group: "TailStraps", X: 0, Y: -300 }, { Group: "ItemButt", X: 0, Y: -300 }, {Group: "Head", X: 0, Y: 1}],
		AllowMenuTransient: true,
	},
	{
		Name: "BackBoxTie",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "LegsClosed",
		Category: "BodyLower",
		AllowMenu: true,
	},
	{
		Name: "Spread",
		Category: "BodyLower",
		MovePosition: [{ Group: "Pussy", X: 0, Y: -5 }, { Group: "ItemVulva", X: 0, Y: -5 }, { Group: "ItemButt", X: 0, Y: -5 }, { Group: "TailStraps", X: 0, Y: -5 }, { Group: "ItemVulvaPiercings", X: 0, Y: -5 }]
	},
	{
		Name: "BackElbowTouch",
		Category: "BodyUpper",
		AllowMenu: true,
		Hide: ["Bracelet"],
	},
	{
		Name: "BackCuffs",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "TapedHands",
	},
	{
		Name: "LegsOpen",
		Category: "BodyLower",
	},
];

/**
 * List of all available pose names in the game
 * @constant {string[]}
 */
var PoseFemale3DCGNames = PoseFemale3DCG.map(pose => pose.Name);

/**
 * 3D Custom Girl based activities
 *
 * The ordering is supposed to match what body part they use, in order:
 * mouth, hand, feet, whole-body, head, then the item-related ones.
 * Inside that, they get sorted by softest to harshest, when that makes sense.
 *
 * @type {Activity[]}
 */
 var ActivityFemale3DCG = [
	/* Mouth activities */
	{
		Name: "Whisper",
		MaxProgress: 20,
		Prerequisite: ["UseMouth"],
		Target: ["ItemEars"],
	},
	{
		Name: "MoanGag",
		MaxProgress: 60,
		Prerequisite: ["IsGagged"],
		Target: [],
		TargetSelf: ["ItemMouth"],
		MakeSound: true,
		StimulationAction: "Talk",
	},
	{
		Name: "MoanGagTalk",
		MaxProgress: 10,
		Prerequisite: ["IsGagged"],
		Target: [],
		TargetSelf: ["ItemMouth"],
		MakeSound: true,
		StimulationAction: "Talk",
	},
	{
		Name: "MoanGagWhimper",
		MaxProgress: 40,
		Prerequisite: ["IsGagged"],
		Target: [],
		TargetSelf: ["ItemMouth"],
		MakeSound: true,
		StimulationAction: "Talk",
	},
	{
		Name: "MoanGagGroan",
		MaxProgress: 30,
		Prerequisite: ["IsGagged"],
		Target: [],
		TargetSelf: ["ItemMouth"],
		MakeSound: true,
		StimulationAction: "Talk",
	},
	{
		Name: "MoanGagAngry",
		MaxProgress: 10,
		Prerequisite: ["IsGagged"],
		Target: [],
		TargetSelf: ["ItemMouth"],
		MakeSound: true,
		StimulationAction: "Talk",
	},
	{
		Name: "MoanGagGiggle",
		MaxProgress: 20,
		Prerequisite: ["IsGagged"],
		Target: [],
		TargetSelf: ["ItemMouth"],
		MakeSound: true,
		StimulationAction: "Talk",
	},
	{
		Name: "GagKiss",
		MaxProgress: 55,
		Prerequisite: ["ZoneAccessible", "UseMouth", "TargetMouthBlocked"],
		Target: ["ItemMouth"],
	},
	{
		Name: "Nibble",
		MaxProgress: 40,
		Prerequisite: ["ZoneAccessible", "UseMouth", "ZoneNaked"],
		Target: ["ItemArms", "ItemBoots", "ItemEars", "ItemFeet", "ItemHands", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: ["ItemArms", "ItemBoots", "ItemHands", "ItemMouth", "ItemNipples"],
	},
	{
		Name: "Lick",
		MaxProgress: 80,
		Prerequisite: ["ZoneAccessible", "UseTongue", "ZoneNaked"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemEars", "ItemFeet", "ItemHands", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: ["ItemArms", "ItemBoots", "ItemBreast", "ItemHands", "ItemMouth", "ItemNipples"],
	},
	{
		Name: "PoliteKiss",
		MaxProgress: 30,
		Prerequisite: ["UseMouth"],
		Target: ["ItemBoots", "ItemHands", "ItemMouth"],
		TargetSelf: ["ItemBoots", "ItemHands"],
	},
	{
		Name: "Kiss",
		MaxProgress: 50,
		Prerequisite: ["ZoneAccessible", "UseMouth"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHands", "ItemHead", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: ["ItemArms", "ItemBoots", "ItemBreast", "ItemHands", "ItemNipples"],
	},
	{
		Name: "GaggedKiss",
		MaxProgress: 40,
		Prerequisite: ["IsGagged"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHands", "ItemHead", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
	},
	{
		Name: "FrenchKiss",
		MaxProgress: 70,
		Prerequisite: ["ZoneAccessible", "UseTongue", "ZoneNaked", "TargetCanUseTongue"],
		Target: ["ItemMouth"],
	},
	{
		Name: "Suck",
		MaxProgress: 60,
		Prerequisite: ["ZoneAccessible", "UseMouth", "ZoneNaked"],
		Target: ["ItemBoots", "ItemHands", "ItemNipples"],
		TargetSelf: true,
	},
	{
		Name: "MasturbateTongue",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "UseTongue", "ZoneNaked"],
		Target: ["ItemButt", "ItemVulva", "ItemVulvaPiercings"],
	},
	{
		Name: "Bite",
		MaxProgress: 40,
		Prerequisite: ["ZoneAccessible", "UseMouth", "ZoneNaked"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHands", "ItemHead", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemTorso", "ItemTorso2",],
		TargetSelf: ["ItemArms", "ItemBoots", "ItemFeet", "ItemHands", "ItemLegs", "ItemMouth"],
	},
	/* Hand activities */
	{
		Name: "Caress",
		MaxProgress: 80,
		Prerequisite: ["ZoneAccessible", "UseHands"],
		Target: ["ItemArms", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHands", "ItemHead", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
	},
	{
		Name: "MassageHands",
		MaxProgress: 60,
		Prerequisite: ["ZoneAccessible", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemFeet", "ItemLegs", "ItemNeck", "ItemPelvis", "ItemTorso", "ItemTorso2",],
		TargetSelf: true,
	},
	{
		Name: "TakeCare",
		MaxProgress: 10,
		Prerequisite: ["ZoneAccessible", "UseHands", "ZoneNaked"],
		Target: ["ItemBoots", "ItemHands", "ItemHead"],
		TargetSelf: true,
	},
	{
		Name: "Tickle",
		MaxProgress: 50,
		Prerequisite: ["ZoneAccessible", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemFeet", "ItemLegs", "ItemNeck", "ItemPelvis", "ItemTorso", "ItemTorso2",],
		TargetSelf: true,
	},
	{
		Name: "Pet",
		MaxProgress: 20,
		Prerequisite: ["UseArms"],
		Target: ["ItemHead", "ItemNose"],
		TargetSelf: true,
	},
	{
		Name: "Grope",
		MaxProgress: 50,
		Prerequisite: ["UseHands"],
		Target: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemPelvis"],
		TargetSelf: ["ItemBreast", "ItemButt"],
	},
	{
		Name: "Pinch",
		MaxProgress: 20,
		Prerequisite: ["ZoneAccessible", "UseHands"],
		Target: ["ItemArms", "ItemEars", "ItemNipples", "ItemNose", "ItemPelvis"],
		TargetSelf: true,
	},
	{
		Name: "HandGag",
		MaxProgress: 40,
		Prerequisite: ["UseHands"],
		Target: ["ItemMouth"],
		TargetSelf: true,
	},
	{
		Name: "Slap",
		MaxProgress: 30,
		Prerequisite: ["UseHands"],
		Target: ["ItemBreast", "ItemHead", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
	},
	{
		Name: "Spank",
		MaxProgress: 40,
		Prerequisite: ["UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemPelvis", "ItemTorso", "ItemTorso2",],
		TargetSelf: true,
	},
	{
		Name: "Pull",
		MaxProgress: 30,
		Prerequisite: ["ZoneAccessible", "UseHands"],
		Target: ["ItemHead", "ItemNipples", "ItemNose"],
		TargetSelf: true,
	},
	{
		Name: "Choke",
		MaxProgress: 50,
		Prerequisite: ["ZoneAccessible", "UseHands"],
		Target: ["ItemNeck", "ItemNose"],
		TargetSelf: true,
	},
	{
		Name: "MasturbateHand",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "UseHands", "ZoneNaked"],
		Target: ["ItemBreast", "ItemButt", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
	},
	{
		Name: "MasturbateFist",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "VulvaEmpty", "UseHands", "ZoneNaked", "HasVagina"],
		Target: ["ItemButt", "ItemVulva"],
		TargetSelf: true,
	},
	/* Feet activities */
	{
		Name: "MassageFeet",
		MaxProgress: 40,
		Prerequisite: ["ZoneAccessible", "UseFeet"],
		Target: ["ItemBoots", "ItemTorso", "ItemTorso2",],
	},
	{
		Name: "MasturbateFoot",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "UseFeet", "ZoneNaked"],
		Target: ["ItemVulva", "ItemVulvaPiercings"],
	},
	{
		Name: "Step",
		MaxProgress: 25,
		Prerequisite: ["UseFeet", "TargetKneeling"],
		Target: ["ItemBreast", "ItemButt", "ItemHead", "ItemNeck", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2",],
	},
	{
		Name: "Kick",
		MaxProgress: 25,
		Prerequisite: ["UseFeet"],
		Target: ["ItemButt", "ItemLegs", "ItemBoots", "ItemFeet", "ItemVulva", "ItemVulvaPiercings"],
	},
	/* Body activities */
	{
		Name: "Cuddle",
		MaxProgress: 30,
		Prerequisite: [],
		Target: ["ItemArms", "ItemNose"],
	},
	{
		Name: "Rub",
		MaxProgress: 60,
		Prerequisite: [],
		Target: ["ItemHead", "ItemNose", "ItemTorso", "ItemTorso2",],
		TargetSelf: ["ItemNose"],
	},
	{
		Name: "StruggleArms",
		MaxProgress: 10,
		Prerequisite: ["CantUseArms"],
		Target: [],
		TargetSelf: ["ItemArms"],
		StimulationAction: "Struggle",
	},
	{
		Name: "StruggleLegs",
		MaxProgress: 10,
		Prerequisite: ["CantUseFeet"],
		Target: [],
		TargetSelf: ["ItemLegs"],
	},
	{
		Name: "Sit",
		MaxProgress: 25,
		Prerequisite: ["UseFeet", "TargetKneeling"],
		Target: ["ItemLegs"],
	},
	{
		Name: "RestHead",
		MaxProgress: 25,
		Prerequisite: ["TargetKneeling"],
		Target: ["ItemBreast", "ItemLegs"],
	},
	/* Head activities */
	{
		Name: "Nod",
		MaxProgress: 0,
		Prerequisite: ["MoveHead"],
		Target: [],
		TargetSelf: ["ItemHead"],
	},
	{
		Name: "Wiggle",
		MaxProgress: 10,
		Prerequisite: ["MoveHead"],
		Target: [],
		TargetSelf: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHands", "ItemHead", "ItemLegs", "ItemNose", "ItemPelvis", "ItemTorso", "ItemTorso2",],
		StimulationAction: "Struggle",
	},
	/* Item activities */
	{
		Name: "SpankItem",
		MaxProgress: 70,
		Prerequisite: ["Needs-SpankItem", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemNipples", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
		ActivityExpression: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Daydream", Timer: 10 }],
	},
	{
		Name: "TickleItem",
		MaxProgress: 50,
		Prerequisite: ["Needs-TickleItem"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHood", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
		ActivityExpression: [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 10}, { Group: "Mouth", Name: "Laughing", Timer: 10}, { Group: "Eyebrows", Name: "Soft", Timer: 10}],
	},
	{
		Name: "RubItem",
		MaxProgress: 60,
		Prerequisite: ["Needs-RubItem", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemHood", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemNose", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
		ActivityExpression: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Mouth", Name: "LipBite", Timer: 10 }],
	},
	{
		Name: "RollItem",
		MaxProgress: 30,
		Prerequisite: ["Needs-RollItem", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemEars", "ItemFeet", "ItemLegs", "ItemMouth", "ItemNeck", "ItemNipples", "ItemPelvis", "ItemTorso"],
		TargetSelf: true,
	},
	{
		Name: "MasturbateItem",
		MaxProgress: 100,
		Prerequisite: ["ZoneNaked", "Needs-MasturbateItem", "UseHands"],
		Target: ["ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemNipples", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings"],
		TargetSelf: true,
		ActivityExpression: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyes", Name: "Dazed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 10}, { Group: "Mouth", Name: "HalfOpen", Timer: 10}],
	},
	{
		Name: "PourItem",
		MaxProgress: 40,
		Prerequisite: ["Needs-PourItem", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemNipples", "ItemPelvis", "ItemTorso"],
		TargetSelf: true,
	},
	{
		Name: "ShockItem",
		MaxProgress: 50,
		Prerequisite: ["Needs-ShockItem", "UseHands"],
		Target: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemNipples", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemNeck", "ItemNeckAccessories"],
		TargetSelf: true,
		ActivityExpression: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }],
	},
	{
		Name: "Inject",
		MaxProgress: 20,
		Prerequisite: ["ZoneAccessible", "UseHands", "Needs-InjectItem"],
		Target: ["ItemNeck", "ItemBreast", "ItemArms", "ItemButt", "ItemVulvaPiercings", "ItemLegs", "ItemFeet"],
		TargetSelf: true,
	},
	{
		Name: "PenetrateSlow",
		MaxProgress: 80,
		Prerequisite: ["ZoneAccessible", "TargetMouthOpen", "VulvaEmpty", "AssEmpty", "Needs-PenetrateItem", "ZoneNaked", "CanUsePenis"],
		Target: ["ItemButt", "ItemMouth", "ItemVulva"],
	},
	{
		Name: "PenetrateFast",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "TargetMouthOpen", "VulvaEmpty", "AssEmpty", "Needs-PenetrateItem", "ZoneNaked", "CanUsePenis"],
		Target: ["ItemButt", "ItemMouth", "ItemVulva"],
	},
];


/**
 * Display order for activities.
 * @type string[]
 */
let ActivityFemale3DCGOrdering = ActivityFemale3DCG.map(a => a.Name);

/**
 * 3D Custom Girl based fetishes
 * @type {{Name: string; GetFactor(C: Character): number; }[]}
 */
var FetishFemale3DCG = [
	{
		Name: "Bondage",
		GetFactor: function (C) { return C.IsRestrained() ? (PreferenceGetFetishFactor(C, "Bondage") - 2) : 0; }
	},
	{
		Name: "Gagged",
		GetFactor: function (C) { return !C.CanTalk() ? (PreferenceGetFetishFactor(C, "Gagged") - 2) : 0; }
	},
	{
		Name: "Blindness",
		GetFactor: function (C) { return C.IsBlind() ? (PreferenceGetFetishFactor(C, "Blindness") - 2) : 0; }
	},
	{
		Name: "Deafness",
		GetFactor: function (C) { return C.IsDeaf() ? (PreferenceGetFetishFactor(C, "Deafness") - 2) : 0; }
	},
	{
		Name: "Chastity",
		GetFactor: function (C) { return C.IsChaste() ? (PreferenceGetFetishFactor(C, "Chastity") - 2) : 0; }
	},
	{
		Name: "Exhibitionist",
		GetFactor: function (C) { return C.IsNaked() ? (PreferenceGetFetishFactor(C, "Exhibitionist") - 2) : 0; }
	},
	{
		Name: "Masochism",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Masochism"); }
	},
	{
		Name: "Sadism",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Sadism"); }
	},
	{
		Name: "Rope",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Rope"); }
	},
	{
		Name: "Latex",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Latex"); }
	},
	{
		Name: "Leather",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Leather"); }
	},
	{
		Name: "Metal",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Metal"); }
	},
	{
		Name: "Tape",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Tape"); }
	},
	{
		Name: "Nylon",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Nylon"); }
	},
	{
		Name: "Lingerie",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Lingerie"); }
	},
	{
		Name: "Pet",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Pet"); }
	},
	{
		Name: "Pony",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Pony"); }
	},
	{
		Name: "ABDL",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "ABDL"); }
	},
	{
		Name: "Forniphilia",
		GetFactor: function (C) {return ActivityFetishItemFactor(C, "Forniphilia"); }
	},
];
