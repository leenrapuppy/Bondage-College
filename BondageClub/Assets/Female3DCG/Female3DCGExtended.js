//@ts-check
"use strict";

/**
 * Female3DCGExtended.js
 * ---------------------
 * This file contains definitions and configuration for extended items. Items which are marked as Extended in
 * `Female3DCG.js` and which have an extended item definition here will have their load/draw/click functions
 * _automatically_ created when assets are loaded, saving the need for an individual extended item script.
 *
 * Currently, modular and typed items are supported, and this is likely to expand in the future.
 */

/**
 * An enum encapsulating the available extended item archetypes
 * MODULAR - Indicates that this item is modular, with several independently configurable modules
 * @type {{MODULAR: "modular", TYPED: "typed", VIBRATING: "vibrating", VARIABLEHEIGHT: "variableheight"}}
 * @see {@link ModularItemConfig}
 * @see {@link TypedItemConfig}
 */
const ExtendedArchetype = {
	MODULAR: "modular",
	TYPED: "typed",
	VIBRATING: "vibrating",
	VARIABLEHEIGHT: "variableheight",
};

/**
 * An object containing all extended item configurations.
 * @type {ExtendedItemMainConfig}
 * @const
 */
var AssetFemale3DCGExtended = {
	BodyUpper: {
		// NOTE: Switch to the `MODULAR` archetype if we'd want to allow for the simultaneous use of multiple overlays
		Small: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Default",
						Property: { Type: null, },
					},
				],
			},
		},  // Small
		Normal: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "BodyUpper", AssetName: "Small" },
		},  // Normal
		Large: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "BodyUpper", AssetName: "Small" },
		},  // Large
		XLarge: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "BodyUpper", AssetName: "Small" },
		},  // XLarge
		FlatSmall: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "BodyUpper", AssetName: "Small" },
		},  // FlatSmall
		FlatMedium: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "BodyUpper", AssetName: "Small" },
		},  // FlatMedium
	},
	Hat: {
		Bandana: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Plain",
						Property: { Type: null, },
					},
					{
						Name: "Circles",
						Property: { Type: "Circles", },
					},
					{
						Name: "Flowers",
						Property: { Type: "Flowers", },
					},
					{
						Name: "PolkaDots",
						Property: { Type: "PolkaDots", },
					},
					{
						Name: "Triangles",
						Property: { Type: "Triangles", },
					},
				],
			},
		}, //Bandana
		BallCapBack: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "StrapUnder",
						Property: { Type: "StrapUnder" },
					},
					{
						Name: "StrapOver",
						Property: { Type: "StrapOver", },
					},
				],
			},
		}, //BallCapBack
		BallCapFront: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Blank",
						Property: { Type: null, },
					},
					{
						Name: "BCLogo",
						Property: {
							Type: "BCLogo",
							DefaultColor: "Default",
						},
					},
					{
						Name: "BDSM",
						Property: {
							Type: "BDSM",
							DefaultColor: "Default",
						},
					},
					{
						Name: "BG",
						Property: {
							Type: "BG",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Chain",
						Property: {
							Type: "Chain",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Gag",
						Property: {
							Type: "Gag",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Knot",
						Property: {
							Type: "Knot",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Monogram",
						Property: {
							Type: "Monogram",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Rock",
						Property: {
							Type: "Rock",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Smile",
						Property: {
							Type: "Smile",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Sun",
						Property: {
							Type: "Sun",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Tick",
						Property: {
							Type: "Tick",
							DefaultColor: "Default",
						},
					},
				],
			},
		}, //BallCapFront
		SwimCap: {
			Archetype: ExtendedArchetype.MODULAR,

			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Pattern", Key: "p",
						Options: [{},{},{},{},{},{},] //None, Stripes 1, Stripes 2, Tirangle, Cowprint, Tigerprint
					},
					{
						Name: "Hair", Key: "h",
						Options:[
							{
								Property: {Hide: ["HairFront", "HairBack"]}
							}, // No Hair Openings
							{
								Property: {Hide: ["HairFront",]}
							}, // Hair Openings
						]
					},
				]
			}
		}, // SwimCap
		LatexHabit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loose",
						Property: {Type: "Loose"},
					},
					{
						Name: "Tight",
						Property: {Type: "Tight"},
					},
				]
			}
		},//LatexHabit
	},
	LeftHand: {
		Rings: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Thumb", Key: "t",
						Options: [{}, {}],
					},
					{
						Name: "Index", Key: "i",
						Options: [{}, {}],
					},
					{
						Name: "Middle", Key: "m",
						Options: [{}, {}],
					},
					{
						Name: "Ring", Key: "r",
						Options: [{}, {}, {}],
					},
					{
						Name: "Pinkie", Key: "p",
						Options: [{}, {}, {}],
					},
				],
			},
		},
	},
	RightHand: {
		Rings: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Thumb", Key: "t",
						Options: [{}, {}],
					},
					{
						Name: "Index", Key: "i",
						Options: [{}, {}],
					},
					{
						Name: "Middle", Key: "m",
						Options: [{}, {},],
					},
					{
						Name: "Ring", Key: "r",
						Options: [{}, {}, {}],
					},
					{
						Name: "Pinkie", Key: "p",
						Options: [{}, {}, {}],
					},
				],
			},
		},
	},
	Cloth: {
		TShirt2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Plain",
						Property: { Type: null, },
					},
					{
						Name: "BCLogo",
						Property: {
							Type: "BCLogo",
							DefaultColor: "#FFF0CC",
						},
					},
					{
						Name: "BDSM",
						Property: {
							Type: "BDSM",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Gag",
						Property: {
							Type: "Gag",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Knot",
						Property: {
							Type: "Knot",
							DefaultColor: "#CCC088",
						},
					},
					{
						Name: "Rock",
						Property: {
							Type: "Rock",
							DefaultColor: "#B03030",
						},
					},
					{
						Name: "Smile",
						Property: {
							Type: "Smile",
							DefaultColor: "#BB9911",
						},
					},
					{
						Name: "Tick",
						Property: {
							Type: "Tick",
							DefaultColor: "#119977",
						},
					},
				],
			},
		}, // TShirt2
		ChineseDress2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Red",
						Property: { Type: null },
					},
					{
						Name: "Purple",
						Property: { Type: "Purple" },
					},
					{
						Name: "Pink",
						Property: { Type: "Pink" },
					},
				],
			},
		}, // ChineseDress2
		LatexLacedSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Laced",
						Property: {
							Type: null,
						},
					},
					{
						Name: "NonLaced",
						Property: {
							Type: "NonLaced",
						},
					},
				],
			},
		}, // LatexLacedSuit
		ReverseBunnySuit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Suit", AssetName: "Catsuit" },
		}, // ReverseBunnySuit
		Jacket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Hooded",
						Property: {
							Type: "Hooded",
							Hide: [
								"HairFront", "HairBack",
								"HairAccessory1", "HairAccessory2", "HairAccessory3",
								"Hat",
							],
						},
					},
					{
						Name: "HoodedEarsOut",
						Property: {
							Type: "HoodedEarsOut",
							HideItem: ["HairAccessory2UnicornHorn", "HairAccessory2DildocornHorn"],
							Hide: [
								"HairFront", "HairBack",
								"HairAccessory1", "HairAccessory3",
								"Hat",
							],
						},
					}
				]
			}
		}, // Jacket
		SlaveRags: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Cloth", Key: "c",
						Options: [
							{}, //c0 - Base
							{}, //c1 - BaseStained
							{}, //c2 - Torn1
							{}, //c3 - Torn1Stained
						],
					},
					{
						Name: "Belt", Key: "b",
						Options: [
							{}, //b0
							{}, //b1
							{}, //b2
						],
					},
				],
			},
		}, //SlaveRags
		Hoodie: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Hood", Key: "h",
						Options: [
							{}, //h0 - Down
							{}, //h1 - Up Regular
							{}, //h2 - Up Ears
						],
					},
					{
						Name: "Length", Key: "l", DrawImages: false,
						Options: [
							{}, //l0 - Cropped
							{}, //l1 - Bolero
						//{}, //l2 - Full Length - not yet implemented
						],
					},
					//{
					// Name: "Pouch", Key: "p", // Pouch option not yet implemented
					// Options: [
					// {}, //p0 - Hands Out
					// {}, //p1 - Hands In
					// ],
					//},
				],
			},
		}, //Hoodie
	}, // Cloth
	ClothAccessory: {
		LeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemArms", AssetName: "LeatherArmbinder" },
			Config: {
				Options: [
					{
						Name: "WrapStrap",
						Property: { Type: null, },
					},
					{
						Name: "Strap",
						Property: { Type: "Strap", },
					},
				],
			},
		}, // LeatherStraps
		BunnyCollarCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Both",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Collar",
						Property: {
							Type: "Collar",
						},
					},
					{
						Name: "Cuffs",
						Property: {
							Type: "Cuffs",
						},
					},
				],
			},
		}, // BunnyCollarCuffs
		Bib: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Pattern", Key: "p",
						Options: [{}, {}, {}, {}, {}, {}],
					},
					{
						Name: "Txt", Key: "x",
						Options: [{}, { HasSubscreen: true }],
					},
				],
				BaselineProperty: { Text: "", Text2: "" },
			},
		}, // Bib
		Scarf: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "ShowMouth",
						Property: { Type: null, },
					},
					{
						Name: "Bundled",
						Property: { Type: "Bundled", },
					},
					{
						Name: "HideMouth",
						Property: { Type: "HideMouth", },
					},

				], DrawImages: false,
			},
		}, // Scarf
		Glitter: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options:[
					{
						Name: "Freckles",
						Property: {Type: null,}
					},
					{
						Name: "MidFreckles",
						Property: {Type: "MidFreckles",}
					},
					{
						Name: "SplitFreckles",
						Property: {Type: "SplitFreckles",}
					},
					{
						Name: "FrecklesSmall",
						Property: {Type: "FrecklesSmall",}
					},
					{
						Name: "MidFrecklesSmall",
						Property: {Type: "MidFrecklesSmall",}
					},
					{
						Name: "SplitFrecklesSmall",
						Property: {Type: "SplitFrecklesSmall",}
					},
					{
						Name: "StarsBoth",
						Property: {Type: "StarsBoth",}
					},
					{
						Name: "StarsLeft",
						Property: {Type: "StarsLeft",}
					},
					{
						Name: "StarsRight",
						Property: {Type: "StarsRight",}
					},
					{
						Name: "DotsBoth",
						Property: {Type: "DotsBoth",}
					},
					{
						Name: "DotsLeft",
						Property: {Type: "DotsLeft",}
					},
					{
						Name: "DotsRight",
						Property: {Type: "DotsRight",}
					},
				],
			},
		}, //Glitter
		Kissmark: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Lcheek", Key: "c",
						Options: [{}, {}, ] // n,y
					},
					{
						Name: "Rcheek", Key: "r",
						Options: [{}, {}, ] // y,n
					},
					{
						Name: "Rfhead", Key: "f",
						Options: [{}, {}, ] // n,y
					},
					{
						Name: "Rneck", Key: "n",
						Options: [{}, {}, ] // n,y
					},
					{
						Name: "Lneck", Key: "l",
						Options: [{}, {}, ] // n,y
					},
				]
			}
		}, //KissMark
	}, // ClothAccessory
	ItemBreast: {
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "LightWrap",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "LightWrapBow",
						Property: { Type: "LightWrapBow", Difficulty: 1 },
					},
					{
						Name: "Wrap",
						Property: { Type: "Wrap", Difficulty: 2 },
					},
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
					Option: "RibbonsStyle",
					Chat: "RibbonsSet",
					Npc: "ItemBreastRibbons",
				},
			}
		}, // Ribbons
		FuturisticBra2: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Display", Key: "d",
						Options: [
							{}, // d0 - Display
							{}, // d1 - No Display
						],
					},
					{
						Name: "Shiny", Key: "s",
						Options: [
							{}, // s0 - Shiny
							{}, // s1 - No Shiny
						],
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			}
		}, // FuturisticBra2
		FuturisticBra: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Show",
						Property: { Type: null },
					},
					{
						Name: "Solid",
						Property: { Type: "Solid" },
					},
					{
						Name: "Show2",
						Property: { Type: "Show2" },
					},
					{
						Name: "Solid2",
						Property: { Type: "Solid2" },
					},
				],
				DrawImages: false,
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: InventoryItemBreastFuturisticBraDrawHook,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				},
				BaselineProperty: { HeartRate: 0, HeartIcon: false },
			},
		}, // FuturisticBra
	}, // ItemBreast
	ItemArms: {
		Web: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Dictionary: [
					(dictionary, { newIndex, previousIndex }) => {
						dictionary.text("Action", newIndex > previousIndex ? "tightens" : "loosens");
					},
				],
				Options: [
					{
						Name: "Tangled",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Wrapped",
						BondageLevel: 0,
						SelfBondageLevel: 4,
						Prerequisite: ["NoFeetSpreader"],
						Property: {
							Type: "Wrapped",
							Difficulty: 2,
							SetPose: ["LegsClosed", "BackElbowTouch"],
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
						},
					},
					{
						Name: "Cocooned",
						BondageLevel: 1,
						SelfBondageLevel: 5,
						Prerequisite: ["NoFeetSpreader"],
						Property: {
							Type: "Cocooned",
							Difficulty: 4,
							SetPose: ["LegsClosed", "BackElbowTouch"],
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
						},
						Random: false,
					},
					{
						Name: "Hogtied",
						BondageLevel: 3,
						SelfBondageLevel: 6,
						Prerequisite: ["NotSuspended", "NoFeetSpreader"],
						Property: {
							Type: "Hogtied",
							Difficulty: 4,
							SetPose: ["Hogtied"],
							Effect: ["Block", "Freeze", "Prone"],
							Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace", "Shoes", "Socks"],
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemDevices"],
						},
						Random: false,
					},
					{
						Name: "Suspended",
						BondageLevel: 4,
						SelfBondageLevel: 8,
						Prerequisite: ["NoFeetSpreader", "NotChained"],
						Property: {
							Type: "Suspended",
							Difficulty: 6,
							SetPose: ["LegsClosed", "BackElbowTouch", "Suspension"],
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
						},
						Random: false,
					},
					{
						Name: "KneelingSuspended",
						BondageLevel: 5,
						SelfBondageLevel: 8,
						Prerequisite: ["NoFeetSpreader", "NotChained"],
						Property: {
							Type: "KneelingSuspended",
							Difficulty: 8,
							SetPose: ["LegsClosed", "BackElbowTouch", "Suspension"],
							Effect: ["Block", "Freeze", "Prone"],
							Hide: ["BodyLower", "Cloth", "ClothLower", "Shoes", "SuitLower", "Panties", "Socks", "Pussy", "ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemBoots", "ItemHands", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
						},
						Random: false,
					},
					{
						Name: "SuspensionHogtied",
						BondageLevel: 5,
						SelfBondageLevel: 9,
						Prerequisite: ["NotSuspended", "NoFeetSpreader", "NotChained"],
						Property: {
							Type: "SuspensionHogtied",
							Difficulty: 11,
							SetPose: ["Hogtied"],
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace", "Shoes", "Socks"],
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemDevices"],
							OverrideHeight: { Height: 0, Priority: 51, HeightRatioProportion: 0 },
						},
						Random: false,
					},
				],
				DialogPrefix: {
					Header: "WebBondageSelect",
					Option: "WebBondage",
					Chat: "ArmsWebSet",
					Npc: "ItemArmsWeb",
				},
			}
		}, // Web
		InflatableStraightLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Light",
						Property: {
							Type: null,
							Effect: ["Block", "Prone"],
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							Effect: ["Block", "Prone"],
							Difficulty: 1,
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							Effect: ["Block", "Prone"],
							Difficulty: 2,
						},
					},
					{
						Name: "Max",
						Property: {
							Type: "Max",
							Effect: ["Block", "Prone", "Freeze"],
							Difficulty: 3,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectInflationLevel",
					Option: "InflationAmount",
					Chat: "InflationAmountSet",
					Npc: "ItemArmsInflatableStraightLeotard",
				},
			}
		}, // InflatableStraightLeotard
		MetalCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "InFront",
						Property: {
							Type: "InFront",
							SetPose: ["BaseUpper"],
						}
					},
					{
						Name: "BehindBack",
						Property: {
							Type: null,
							SetPose: ["BackCuffs"],
						}
					}
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "MetalCuffsPose",
					Chat: "MetalCuffsRestrain",
					Npc: "ItemArmsMetalCuffs",
				},
			}
		}, // MetalCuffs
		Chains: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "WristTie",
						Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "BoxTie",
						Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
					}, {
						Name: "ChainCuffs",
						Property: { Type: "ChainCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 29 },
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "WristElbowTie",
						BondageLevel: 2,
						Property: { Type: "WristElbowTie", Effect: ["Block", "Prone", "NotSelfPickable"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "WristElbowHarnessTie",
						BondageLevel: 3,
						Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone", "NotSelfPickable"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "KneelingHogtie",
						BondageLevel: 4,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: { Type: "KneelingHogtie", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3, AllowPose: ["Kneel", "KneelingSpread"], AllowActivePose: ["Kneel", "KneelingSpread"], WhitelistActivePose: ["Kneel", "KneelingSpread"] },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "Hogtied",
						BondageLevel: 4,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "AllFours",
						BondageLevel: 6,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: { Type: "AllFours", Effect: ["ForceKneel", "NotSelfPickable"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],  AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["AllFours"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "SuspensionHogtied",
						BondageLevel: 8,
						Prerequisite: ["NotMounted", "NotChained", "NotSuspended"],
						Property: {
							Type: "SuspensionHogtied",
							Effect: ["Block", "Freeze", "Prone", "NotSelfPickable", "Suspended"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"],
							Difficulty: 6,
							OverrideHeight: { Height: -575, Priority: 51, HeightRatioProportion: 1 } },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
						HasSubscreen: true,
						Archetype: ExtendedArchetype.VARIABLEHEIGHT,
						ArchetypeConfig: {
							MaxHeight: 0,
							MinHeight: -575,
							Slider: {
								Icon: "player",
								Top: 125,
								Height: 675,
							},
							DialogPrefix: {
								Chat: "SuspensionChange",
								Npc: "ChainBondage",
							},
						},
					}
				],
				DialogPrefix: {
					Header: "SelectChainBondage",
					Option: "ChainBondage",
					Chat: "ArmsChainSet",
					Npc: "ChainBondage",
				},
				ChangeWhenLocked: false,
			}
		}, // Chains
		HighSecurityStraitJacket: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Crotch", Key: "c",
						Options: [
							{}, // c0 - No crotch panel
							{ // c1 - Crotch panel
								Property: {
									Difficulty: 1,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulva", "ItemVulvaPiercings", "Pussy"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
						],
					},
					{
						Name: "Arms", Key: "a",
						Options: [
							{}, // a0 - Arms loose
							{ Property: { Difficulty: 2 }, SelfBondageLevel: 8 }, // a1 - Arms in front
							{ Property: { Difficulty: 3 }, SelfBondageLevel: 8 }, // a2 - Arms behind
						],
					},
					{
						Name: "Straps", Key: "s",
						Options: [
							{}, // s0 - No crotch straps
							{ // s1 - One crotch strap
								Property: {
									Difficulty: 1,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulvaPiercings", "Pussy"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
							{ Property: { Difficulty: 2, Block: ["ItemPelvis"], Hide: ["Pussy"], } }, // s2 - Two crotch straps
							{ // s3 - Three crotch straps
								Property: {
									Difficulty: 2,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulvaPiercings", "Pussy"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
						],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // HighSecurityStraitJacket
		LatexButterflyLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Unpolished",
						Property: { Type: null },
					},
					{
						Name: "Polished",
						Property: { Type: "Polished" },
					},
				],
				DialogPrefix: {
					Header: "ItemArmsLatexLeotardSelect",
					Option: "ItemArmsLatexLeotard",
					Chat: "ItemArmsLatexLeotardSet",
				},
			},
		}, // LatexButterflyLeotard
		LatexBoxtieLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LatexButterflyLeotard" },
		},
		LatexSleevelessLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LatexButterflyLeotard" },
		},
		CeilingShackles: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "HeadLevel",
						Property: {
							Type: null,
							SetPose: ["Yoked"]
						},
					},
					{
						Name: "Overhead",
						Property: {
							Type: "Overhead",
							SetPose: ["OverTheHead"]
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Chat: ({ C }) => `ItemArmsCeilingShacklesSet${C.Pose.includes("Suspension") ? "Suspension" : ""}`
				},
			},
		}, // CeilingShackles
		BitchSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Zipped",
						Property: {
							Type: null,
							Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemHands", "ItemHandheld", "ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
							Hide: ["Bra", "Panties", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "Socks", "Suit", "SuitLower"],
						}
					},
					{
						Name: "z1", // Unzipped
						Property: {
							Type: "z1",
							Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemHands", "ItemHandheld"],
						}
					},
					{
						Name: "z2", // Exposed
						Property: {
							Type: "z2",
							Block: ["ItemPelvis", "ItemTorso", "ItemTorso2", "ItemHands", "ItemHandheld"],
						}
					},
				],
				ChangeWhenLocked: false,
			},
		}, // BitchSuit
		LeatherArmbinder: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Strap",
						Property: { Type: "Strap", Difficulty: 3 },
					},
					{
						Name: "WrapStrap",
						Property: { Type: "WrapStrap", Difficulty: 3 },
					},
				],
				DialogPrefix: {
					Header: "ItemArmsLeatherArmbinderSelect",
					Option: "ItemArmsLeatherArmbinder",
					Chat: "ItemArmsLeatherArmbinderSet",
				},
			},
		}, // LeatherArmbinder
		WristShackles: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "InFront",
						Property: {
							Type: null
						},
					},
					{
						Name: "Behind",
						Property: {
							Type: "Behind",
							SetPose: ["BackCuffs"],
							Effect: ["Block", "Prone"],
							Difficulty: 3
						},
					},
					{
						Name: "Overhead",
						Property: {
							Type: "Overhead",
							SetPose: ["OverTheHead"],
							Effect: ["Block", "Prone"],
							Difficulty: 3
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
				}
			},
		}, // WristShackles
		FuturisticCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: [],
							SetPose: [],
							SelfUnlock: true,
						},
					},
					{
						Name: "Wrist",
						Property: {
							Type: "Wrist",
							Difficulty: 2,
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							SelfUnlock: true,
						},
					},
					{
						Name: "Elbow",
						Property: {
							Type: "Elbow",
							Difficulty: 4,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["BackElbowTouch"],
							SelfUnlock: false,
						},
					},
					{
						Name: "Both",
						Property: {
							Type: "Both",
							Difficulty: 6,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["BackElbowTouch"],
							SelfUnlock: false,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemArmsCuffs",
					Chat: "FuturisticCuffsRestrain",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticCuffs
		FuturisticArmbinder: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Tight",
						Property: { Type: "Tight", Difficulty: 7 },
					},
				],
				DialogPrefix: {
					Header: "SelectFuturisticArmbinderType",
					Option: "FuturisticArmbinderType",
					Chat: "FuturisticArmbinderSet",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticArmbinder
		LeatherCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: [],
							SetPose: [],
							SelfUnlock: true,
						},
					},
					{
						Name: "Wrist",
						Property: {
							Type: "Wrist",
							Difficulty: 2,
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							SelfUnlock: true,
						},
					},
					{
						Name: "Elbow",
						Property: {
							Type: "Elbow",
							Difficulty: 4,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["BackElbowTouch"],
							SelfUnlock: false,
						},
					},
					{
						Name: "Both",
						Property: {
							Type: "Both",
							Difficulty: 6,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["BackElbowTouch"],
							SelfUnlock: false,
						},
					},
					{
						Name: "Hogtie",
						Prerequisite: ["CuffedFeet", "NotSuspended", "NotMounted", "NoFeetSpreader"],
						Property: {
							Type: "Hogtie",
							Difficulty: 6,
							Effect: ["Block", "Prone", "Freeze", "NotSelfPickable"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"],
							SelfUnlock: false,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemArmsCuffs",
				},
			},
		}, // LeatherCuffs
		OrnateCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LeatherCuffs" },
		}, // OrnateCuffs
		HighStyleSteelCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SteelCuffs" },
		}, // HighStyleSteelCuffs
		SteelCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LeatherCuffs" },
			Config: {
				Options: [
					{
						Name: "None",
						Property: { Type: null }
					},
					{
						Name: "Wrist",
						Property: {
							Type: "Wrist",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"]
						}
					}
				],
			},
		}, // SteelCuffs
		StraitJacket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Normal",
						Property: {
							Type: "Normal",
							Difficulty: 3,
						},
					},
					{
						Name: "Snug",
						Property: {
							Type: "Snug",
							Difficulty: 6,
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Difficulty: 9,
						},
					},
				],
				DialogPrefix: {
					Header: "ItemArmsStraitJacketSelect",
					Option: "ItemArmsStraitJacket",
				},
			},
		}, // StraitJacket
		LeatherStraitJacket: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "StraitJacket" },
		}, // LeatherStraitJacket
		CollarCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Normal",
						Property: {
							Type: "Normal",
							Difficulty: 3,
						},
					},
					{
						Name: "Snug",
						Property: {
							Type: "Snug",
							Difficulty: 6,
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Difficulty: 9,
						},
					},
				],
				DrawImages: false,
			},
		}, // CollarCuffs
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Arms",
						Property: { Type: null, Difficulty: 1 },
					},
					{
						Name: "Bottom",
						SelfBondageLevel: 4,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Bottom",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemVulvaPiercings"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
							Difficulty: 2,
						},
					},
					{
						Name: "Top",
						SelfBondageLevel: 6,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Top",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemTorso", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"],
							Difficulty: 4,
						},
					},
					{
						Name: "Full",
						SelfBondageLevel: 8,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Full",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
							Difficulty: 6,
						}
					},
					{
						Name: "Complete",
						SelfBondageLevel: 10,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Complete",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
							Difficulty: 7,
						}
					},
					{
						Name: "ExposedComplete",
						SelfBondageLevel: 10,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "ExposedComplete",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemVulvaPiercings", "ItemBreast"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
							Difficulty: 7,
						}
					},
					{
						Name: "PetTape",
						SelfBondageLevel: 10,
						Property: {
							Type: "PetTape",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemHands"],
							HideItem: ["ClothAccessoryPoncho"],
							Difficulty: 7,
						}
					},
				],
				DialogPrefix: {
					Header: "SelectTapeWrapping",
				},
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR, CommonChatTags.DEST_CHAR],
			}
		}, // DuctTape
		Zipties: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "ZipLight",
						Property: {
							Type: null,
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 1
						}
					}, {
						Name: "ZipMedium",
						Property: {
							Type: "ZipMedium",
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 2
						},
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "ZipFull",
						Property: {
							Type: "ZipFull",
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "ZipElbowWrist",
						Property: {
							Type: "ZipElbowWrist",
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 1
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWristLight",
						Property: {
							Type: "ZipWristLight",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWristMedium",
						Property: {
							Type: "ZipWristMedium",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWristFull",
						Property: {
							Type: "ZipWristFull",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWrist",
						Property: {
							Type: "ZipWrist",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 1
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipKneelingHogtie",
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "ZipKneelingHogtie",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "ZipHogtied",
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "ZipHogtied",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"], Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "ZipAllFours",
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "ZipAllFours", Effect: ["ForceKneel"],
							Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["AllFours"], Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					},
				],
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				DialogPrefix: {
					Header: "SelectZipTie",
				}
			},
		}, // Zipties
		ThinLeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Wrist", Property: { Type: "Wrist", SetPose: ["BackBoxTie"] } },
					{ Name: "Boxtie", Property: { Type: null, SetPose: ["BackBoxTie"], Difficulty: 4 } },
					{ Name: "WristElbow", Property: { Type: "WristElbow", SetPose: ["BackElbowTouch"], Difficulty: 3 } },
					{ Name: "WristElbowHarness", Property: { Type: "WristElbowHarness", SetPose: ["BackElbowTouch"], Difficulty: 5 } },
					{
						Name: "Hogtie",
						Property: {
							Type: "Hogtie", SetPose: ["Hogtied"], Effect: ["Block", "Freeze", "Prone"], Difficulty: 6
						},
						Random: false,
					}
				]
			}
		}, //ThinLeatherStraps
		MermaidSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Zipped",
						Property: {
							Type: null,
							Difficulty: 0,
							Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
						},
					},
					{
						Name: "UnZip",
						Property: {
							Type: "UnZip",
							Block: [],
						},
					},
				],
			},
		}, // MermaidSuit
		TightJacket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
							Difficulty: 1,
						},
					},
					{
						Name: "PulledStraps",
						Property: {
							Type: "PulledStraps",
							Difficulty: 1,
						},
					},
					{
						Name: "LiningStraps",
						Property: {
							Type: "LiningStraps",
							Difficulty: 2,
						},
					},
					{
						Name: "ExtraPadding",
						Property: {
							Type: "ExtraPadding",
							Difficulty: 2,
						},
					},
					{
						Name: "PulledLining",
						Property: {
							Type: "PulledLining",
							Difficulty: 3,
						},
					},
					{
						Name: "PulledPadding",
						Property: {
							Type: "PulledPadding",
							Difficulty: 3,
						},
					},
					{
						Name: "PaddedLining",
						Property: {
							Type: "PaddedLining",
							Difficulty: 3,
						},
					},
					{
						Name: "FullJacket",
						Property: {
							Type: "FullJacket",
							Difficulty: 4,
						},
					},
				],
				DialogPrefix: {
					Header: "ItemArmsTightJacketSelect",
					Option: "ItemArmsTightJacket",
					Chat: "ItemArmsTightJacketSet",
				},
			},
		}, // TightJacket
		TightJacketCrotch: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "TightJacket" },
		}, // TightJacketCrotch
		WrappedBlanket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "NormalWrapped",
						Property: { Type: null, },
					},
					{
						Name: "ShouldersWrapped",
						Property: { Type: "ShouldersWrapped", },
					},
					{
						Name: "FeetWrapped",
						Property: { Type: "FeetWrapped", },
					},
					{
						Name: "FullWrapped",
						Property: { Type: "FullWrapped", },
					},
				],
			},
		}, // WrappedBlanket
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Cross",
						Property: { Type: null, Difficulty: 1 },
					},
					{
						Name: "Heavy",
						SelfBondageLevel: 4,
						Property: { Type: "Heavy", Difficulty: 2 }
					},
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
				},
			},
		}, // Ribbons
		SturdyLeatherBelts: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				ChangeWhenLocked: false,
				DialogPrefix: {
					Header: "SturdyLeatherBeltsSelectTightness",
					Option: "SturdyLeatherBeltsPose",
					Chat: "SturdyLeatherBeltsRestrain",
				},
				Options: [
					{
						Name: "One",
						Property: { Type: null, },
					},
					{
						Name: "Two",
						Property: { Type: "Two", Difficulty: 2, },
					},
					{
						Name: "Three",
						Property: { Type: "Three", Difficulty: 4, },
					},
				],
			}
		}, // SturdyLeatherBelts
		StraitLeotard: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [CommonChatTags.DEST_CHAR_NAME, CommonChatTags.ASSET_NAME],
				Modules: [
					{
						Name: "Cloth", Key: "cl",
						Options: [{ Property: { Hide: ["Cloth"] } }, {}],
					},
					{
						Name: "Corset", Key: "co",
						Options: [{ Property: { Hide: ["Corset", "ItemTorso"] } }, {}],
					},
					{
						Name: "NipplesPiercings", Key: "np",
						Options: [{ Property: { Hide: ["ItemNipplesPiercings", "ItemNipples", "ItemBreast"] } }, {}],
					},
					{
						Name: "VulvaPiercings", Key: "vp",
						Options: [{ Property: { Hide: ["ItemVulvaPiercings", "Panties", "ItemPelvis"] } }, {}],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // StraitLeotard
		FuturisticStraitjacket: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Cloth", Key: "cl",
						Options: [{ Property: { Hide: ["Cloth"] } }, {}],
					},
					{
						Name: "Corset", Key: "co",
						Options: [{ Property: { Hide: ["Corset", "ItemTorso"] } }, {}],
					},
					{
						Name: "NipplesPiercings", Key: "np",
						Options: [{ Property: { Hide: ["ItemNipplesPiercings", "ItemNipples", "ItemBreast"] } }, {}],
					},
					{
						Name: "VulvaPiercings", Key: "vp",
						Options: [{ Property: { Hide: ["ItemVulvaPiercings", "Panties", "ItemPelvis"] } }, {}],
					},
					{
						Name: "Arms", Key: "a",
						Options: [
							{}, // a0 - Arms front
							{ // a1 - Arms behind
								Property: {
									Difficulty: 2,
								}
							},
						],
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticStraitjacket
		Tentacles: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "BehindBack",
						Property: {
							Type: null,
							SetPose: ["BackElbowTouch"],
						},
					},
					{
						Name: "OverTheHead",
						Property: {
							Type: "OverTheHead",
							SetPose: ["OverTheHead"],
							HideItem: ["ClothAdmiralTop", "ClothFurCoat", "ClothStudentOutfit2", "ClothSweater1", "ClothTeacherOutfit1"],
						},
					},
				],
			},
		}, // Tentacles
		NylonRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "WristTie",
						Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "BoxTie",
						Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
					}, {
						Name: "WristElbowTie",
						BondageLevel: 2,
						Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "SimpleHogtie",
						BondageLevel: 2,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: { Type: "SimpleHogtie", Effect: ["Block", "Prone"], SetPose: ["Hogtied"], Difficulty: 2 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
						Random: false,
					}, {
						Name: "TightBoxtie",
						BondageLevel: 3,
						Property: { Type: "TightBoxtie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "WristElbowHarnessTie",
						BondageLevel: 3,
						Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "KneelingHogtie",
						BondageLevel: 4,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "KneelingHogtie",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Kneel", "BackElbowTouch"],
							Difficulty: 3,
							AllowPose: ["Kneel", "KneelingSpread"],
							AllowActivePose: ["Kneel", "KneelingSpread"],
							WhitelistActivePose: ["Kneel", "KneelingSpread"],
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "Hogtied",
						BondageLevel: 4,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "Hogtied",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "AllFours",
						BondageLevel: 6,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "AllFours",
							Effect: ["ForceKneel"],
							Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["AllFours"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "BedSpreadEagle",
						BondageLevel: 1,
						Prerequisite: ["OnBed"],
						Property: { Type: "BedSpreadEagle", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemDevices"], SetPose: ["Yoked"], Difficulty: 5 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					},
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Chat: "ArmsRopeSet",
					Npc: "RopeBondage",
				},
			}
		}, // NylonRope
		HempRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "WristTie",
						Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "BoxTie",
						Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
					}, {
						Name: "CrossedBoxtie",
						Property: { Type: "CrossedBoxtie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "RopeCuffs",
						Property: { Type: "RopeCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 29 },
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "WristElbowTie",
						BondageLevel: 2,
						Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "SimpleHogtie",
						BondageLevel: 2,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: { Type: "SimpleHogtie", Effect: ["Block", "Prone"], SetPose: ["Hogtied"], Difficulty: 2 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
						Random: false,
					}, {
						Name: "TightBoxtie",
						BondageLevel: 3,
						Property: { Type: "TightBoxtie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "WristElbowHarnessTie",
						BondageLevel: 3,
						Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "KneelingHogtie",
						BondageLevel: 4,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "KneelingHogtie",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Kneel", "BackElbowTouch"],
							Difficulty: 3,
							AllowPose: ["Kneel", "KneelingSpread"],
							AllowActivePose: ["Kneel", "KneelingSpread"],
							WhitelistActivePose: ["Kneel", "KneelingSpread"],
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "Hogtied",
						BondageLevel: 4,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "Hogtied",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "AllFours",
						BondageLevel: 6,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "AllFours",
							Effect: ["ForceKneel"],
							Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["AllFours"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "BedSpreadEagle",
						BondageLevel: 1,
						Prerequisite: ["OnBed"],
						Property: { Type: "BedSpreadEagle", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemDevices"], SetPose: ["Yoked"], Difficulty: 5 },
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "SuspensionKneelingHogtie",
						BondageLevel: 6,
						Prerequisite: ["NotMounted", "NotChained", "NotSuspended"],
						Property: {
							Type: "SuspensionKneelingHogtie",
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Kneel", "BackElbowTouch"],
							AllowPose: ["Kneel", "KneelingSpread"],
							AllowActivePose: ["Kneel", "KneelingSpread"],
							WhitelistActivePose: ["Kneel", "KneelingSpread"],
							Difficulty: 6,
							OverrideHeight: { Height: -250, Priority: 51, HeightRatioProportion: 1 }
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
						HasSubscreen: true,
						Archetype: ExtendedArchetype.VARIABLEHEIGHT,
						ArchetypeConfig: {
							MaxHeight: 0,
							MinHeight: -250,
							Slider: {
								Icon: "rope",
								Top: 175,
								Height: 400,
							},
							DialogPrefix: {
								Chat: "SuspensionChange",
								Npc: "RopeBondage",
							},
						},
					}, {
						Name: "SuspensionHogtied",
						BondageLevel: 8,
						Prerequisite: ["NotMounted", "NotChained", "NotSuspended"],
						Property: {
							Type: "SuspensionHogtied",
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"],
							Difficulty: 6,
							OverrideHeight: { Height: -575, Priority: 51, HeightRatioProportion: 1 }
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
						HasSubscreen: true,
						Archetype: ExtendedArchetype.VARIABLEHEIGHT,
						ArchetypeConfig: {
							MaxHeight: 0,
							MinHeight: -575,
							Slider: {
								Icon: "rope",
								Top: 125,
								Height: 675,
							},
							DialogPrefix: {
								Chat: "SuspensionChange",
								Npc: "RopeBondage",
							},
						},
					}, {
						Name: "SuspensionAllFours",
						BondageLevel: 8,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "SuspensionAllFours",
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["AllFours"],
							Difficulty: 6,
							OverrideHeight: { Height: -560, Priority: 51, HeightRatioProportion: 1 }
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
						HasSubscreen: true,
						Archetype: ExtendedArchetype.VARIABLEHEIGHT,
						ArchetypeConfig: {
							MaxHeight: 0,
							MinHeight: -560,
							Slider: {
								Icon: "rope",
								Top: 125,
								Height: 675,
							},
							DialogPrefix: {
								Chat: "SuspensionChange",
								Npc: "RopeBondage",
							},
						},
					}, {
						Name: "InvertedSuspensionHogtied",
						BondageLevel: 8,
						Prerequisite: ["NotMounted", "NotChained", "NotSuspended"],
						Property: {
							Type: "InvertedSuspensionHogtied",
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied", "Suspension"],
							Difficulty: 6,
							OverrideHeight: { Height: -600, Priority: 51, HeightRatioProportion: 0 }
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
						HasSubscreen: true,
						Archetype: ExtendedArchetype.VARIABLEHEIGHT,
						ArchetypeConfig: {
							MaxHeight: -50,
							MinHeight: -600,
							Slider: {
								Icon: "rope",
								Top: 100,
								Height: 700,
							},
							DialogPrefix: {
								Chat: "SuspensionChange",
								Npc: "RopeBondage",
							},
						},
					}, {
						Name: "InvertedSuspensionAllFours",
						BondageLevel: 8,
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "InvertedSuspensionAllFours",
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["AllFours", "Suspension"],
							Difficulty: 6,
							OverrideHeight: { Height: -560, Priority: 51, HeightRatioProportion: 0 }
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
						HasSubscreen: true,
						Archetype: ExtendedArchetype.VARIABLEHEIGHT,
						ArchetypeConfig: {
							MaxHeight: 0,
							MinHeight: -560,
							Slider: {
								Icon: "rope",
								Top: 100,
								Height: 700,
							},
							DialogPrefix: {
								Chat: "SuspensionChange",
								Npc: "RopeBondage",
							},
						},
					},
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Chat: "ArmsRopeSet",
					Npc: "RopeBondage",
				},
			}
		},
		Slime: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Position", Key: "p",
						Options: [
							{}, // p0 - Arms behind back
							{ Property: { Difficulty: 2, SetPose: ["Hogtied"] } }, // p1 - Hogtied
						],
					},
					{
						Name: "Type", Key: "t",
						Options: [
							{}, // t0 - Normal slime
							{ Property: { Difficulty: 3 } }, // t1 - Slime girl
						]
					}
				],
				ChatTags: [CommonChatTags.DEST_CHAR, CommonChatTags.TARGET_CHAR],
			}
		},
		WoodenCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "HandsFront",
						Property: {
							Type: "HandsFront",
							Difficulty: 2,
							Effect: ["Block", "Prone"],
							SetPose: ["BaseUpper"],
							SelfUnlock: true,
						},
					},
					{
						Name: "HandsBack",
						Property: {
							Type: "HandsBack",
							Difficulty: 3,
							Effect: ["Block", "Prone"],
							SetPose: ["BackCuffs"],
							SelfUnlock: false,
						},
					},
					{
						Name: "HandsHead",
						Property: {
							Type: "HandsHead",
							Difficulty: 4,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["Yoked"],
							SelfUnlock: false,
						},
					},
					{
						Name: "Hogtied",
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "Hogtied",
							Difficulty: 5,
							Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"],
							SetPose: ["Hogtied"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SelfUnlock: false,
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemArmsWoodenCuffs",
				},
			},
		}, // WoodenCuffs
		FullLatexSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Latex",
						Property: {
							Type: null,
							Block: [
								"ItemBreast",
								"ItemNipples",
								"ItemNipplesPiercings",
								"ItemVulva",
								"ItemVulvaPiercings",
								"ItemButt",
							],
						},
					},
					{
						Name: "UnZip",
						Property: { Type: "UnZip" },
					},
				],
				ScriptHooks: {
					Draw: InventoryItemArmsFullLatexSuitDrawHook,
					Click: InventoryItemArmsFullLatexSuitClickHook,
				},
			},
		}, // FullLatexSuit
		PrisonLockdownSuit: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Restraints", Key: "r",
						Options: [
							{
								Property: {
									Type: "Free",
									Difficulty: 0,
									Effect: ["Block", "Prone", "Slow"],
								},
							}, // r0 - Free
							{
								Property: {
									Type: "Ankles",
									Difficulty: 2,
									Effect: ["Block", "Prone", "Slow"],
								},
							}, // r1 - Ankles
							{
								Property: {
									Type: "Thighs",
									Difficulty: 1,
									Effect: ["Block", "Prone", "Slow"],
								},
							}, // r2 - Thighs
							{
								Property: {
									Type: "Full",
									Difficulty: 3,
									Effect: ["Block", "Prone", "Freeze"],
								},
							}, // r3 - Full
						],
					},
					{
						Name: "ShockModule", Key: "s",
						DrawImages: false,
						Options: [
							{ Property: { ShockLevel: 0 } },
							{ Property: { ShockLevel: 1 } },
							{ Property: { ShockLevel: 2 } },
						],
					},
				],
				BaselineProperty: { TriggerCount: 0, ShowText: true },
				ScriptHooks: {
					Click: InventoryItemArmsPrisonLockdownSuitClickHook,
					Draw: InventoryItemArmsPrisonLockdownSuitDrawHook,
				},
				DrawImages: true,
			},
		}, // PrisonLockdownSuit
		SmoothLeatherArmbinder1: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "BinderPosition", Key: "b",
						Options:  [
							{}, // b0 Left
							{}, // b1 Back
							{} // b2 Right
						]
					},
					{
						Name: "ShoulderStraps", Key: "s",
						Options:[
							{}, // s0 No Straps
							{
								Property: {
									Difficulty: 20
								}
							}, // s1 Basic Shoulder Straps
							{
								Property: {
									Difficulty: 30
								}
							}, // s2 Wrapping Shoulder Straps
							{
								Property: {
									Difficulty: 40
								}
							}, // s3 Harness Shoulder Straps

						],

						AllowSelfSelect: false
					}
				]
			}
		}, // SmoothLeatherArmbinder1
		TransportJacket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
					CommonChatTags.DEST_CHAR_NAME,
					CommonChatTags.ASSET_NAME,
				],
				Options: [
					{
						Name: "NoShorts",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Shorts",
						Property: {
							Type: "Shorts",
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
							Hide: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "Panties", "Corset"],
						},
					},
					{
						Name: "ShortsAndStraps",
						Property: {
							Type: "ShortsAndStraps",
							Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
							Hide: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "Panties", "Corset"],
						},
					},
				],
				BaselineProperty: { Text: "" },
				ChatSetting: TypedItemChatSetting.FROM_TO,
				ScriptHooks: {
					Load: PropertyTextLoad,
					Draw: InventoryItemArmsTransportJacketDrawHook,
					Exit: PropertyTextExit,
				}
			},
		}, // TransportJacket
	}, // ItemArms
	ItemNeck: {
		ShinySteelCollar: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "NoRing", Property: { Type: null } },
					{ Name: "Ring", Property: { Type: "Ring" } }
				],
				DrawImages: false
			}
		}, // ShinySteelCollar
		TechnoCollar: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "CollarType", Key: "c",
						Options: [
							{}, // c0 Slender Collar
							{
								Property: {
									Difficulty: 65,
								},
							}, //c1 Choker Collar
							{
								Property: {
									Difficulty: 70,
								},
							}, //c2 Full Collar
							{
								Property: {
									Difficulty: 75,
								},
							}, //c3 Posture Collar
							{
								Property: {
									Difficulty: 80,
								},
							}, //c4 Strict Posture Collar
						],
					},
					{
						Name: "ShockModule", Key: "s",
						DrawImages: false,
						Options: [
							{ Property: { ShockLevel: 0 } },
							{ Property: { ShockLevel: 1 } },
							{ Property: { ShockLevel: 2 } },
						],
					},
				],
				BaselineProperty: { TriggerCount: 0, ShowText: true },
				ScriptHooks: {
					Click: InventoryItemArmsPrisonLockdownSuitClickHook,
					Draw: InventoryItemArmsPrisonLockdownSuitDrawHook,
				},
				DrawImages: true,
			},
		}, //TechnoCollar
		ComboHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "BallGag", GroupName: "ItemMouth" },
		}, // ComboHarness
		BonedNeckCorset: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "NoRing", Property: { Type: null } },
					{ Name: "Ring", Property: { Type: "Ring" } },
				],
			}
		}, // BonedNeckCorset
		ShockCollar: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarShockUnit" },
			Config: {
				DialogPrefix: {
					Header: "ItemNeckAccessoriesCollarShockUnitSelect",
					Option: "ItemNeckAccessoriesCollarShockUnit",
					Chat: "ItemNeckAccessoriesCollarShockUnitSet",
					Npc: "ItemNeckAccessoriesCollarShockUnit",
				},
			},
		}, // ShockCollar
		AutoShockCollar: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarAutoShockUnit" },
			Config: {
				DialogPrefix: {
					Header: "ItemNeckAccessoriesCollarAutoShockUnitSelect",
					Module: "ItemNeckAccessoriesCollarAutoShockUnitModule",
					Option: "ItemNeckAccessoriesCollarAutoShockUnitOption",
					Chat: "ItemNeckAccessoriesCollarAutoShockUnitSet",
				},
			},
		}, // AutoShockCollar
	}, // ItemNeck
	ItemNeckAccessories: {
		CustomCollarTag: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Tag", Key: "t",
						Options: [{}, {}, {}, {}, {}, {}],
					},
					{
						Name: "Txt", Key: "x",
						Options: [{ HasSubscreen: true }],
					},
				],
				ChangeWhenLocked: false,
				BaselineProperty: { Text: "Tag" },
			},
		}, // CustomCollarTag
		CollarNameTag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Blank", Property: { Type: null } },
					{ Name: "Angel", Property: { Type: "Angel" } },
					{ Name: "BadGirl", Property: { Type: "BadGirl" } },
					{ Name: "BindMe", Property: { Type: "BindMe" } },
					{ Name: "Bitch", Property: { Type: "Bitch" } },
					{ Name: "Boobs", Property: { Type: "Boobs" } },
					{ Name: "Cupcake", Property: { Type: "Cupcake" } },
					{ Name: "Devil", Property: { Type: "Devil" } },
					{ Name: "Dom", Property: { Type: "Dom" } },
					{ Name: "Free", Property: { Type: "Free" } },
					{ Name: "FuckMe", Property: { Type: "FuckMe" } },
					{ Name: "GagMe", Property: { Type: "GagMe" } },
					{ Name: "Goddess", Property: { Type: "Goddess" } },
					{ Name: "GoodGirl", Property: { Type: "GoodGirl" } },
					{ Name: "HoldMe", Property: { Type: "HoldMe" } },
					{ Name: "Jewel", Property: { Type: "Jewel" } },
					{ Name: "Love", Property: { Type: "Love" } },
					{ Name: "Maid", Property: { Type: "Maid" } },
					{ Name: "Meat", Property: { Type: "Meat" } },
					{ Name: "Miss", Property: { Type: "Miss" } },
					{ Name: "Mummy", Property: { Type: "Mummy" } },
					{ Name: "Nice", Property: { Type: "Nice" } },
					{ Name: "Needy", Property: { Type: "Needy" } },
					{ Name: "Owned", Property: { Type: "Owned" } },
					{ Name: "Precious", Property: { Type: "Precious" } },
					{ Name: "Pudding", Property: { Type: "Pudding" } },
					{ Name: "Queen", Property: { Type: "Queen" } },
					{ Name: "Slave", Property: { Type: "Slave" } },
					{ Name: "Slut", Property: { Type: "Slut" } },
					{ Name: "Sub", Property: { Type: "Sub" } },
					{ Name: "Sweetie", Property: { Type: "Sweetie" } },
					{ Name: "Taken", Property: { Type: "Taken" } },
					{ Name: "Toy", Property: { Type: "Toy" } },
					{ Name: "Useless", Property: { Type: "Useless" } },
					{ Name: "UseMe", Property: { Type: "UseMe" } },
					{ Name: "Whore", Property: { Type: "Whore" } },
				],
				ScriptHooks: {
					Draw: InventoryItemNeckAccessoriesCollarNameTagDrawHook,
					Click: InventoryItemNeckAccessoriesCollarNameTagClickHook,
					PublishAction: InventoryItemNeckAccessoriesCollarNameTagPublishActionHook,
				},
				DrawImages: false,
				ChangeWhenLocked: false,
				ChatSetting: TypedItemChatSetting.SILENT,
			},
		}, // CollarNameTag
		CollarNameTagOval: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarNameTag" },
			Config: {
				Options: [
					{ Name: "Blank", Property: { Type: null } },
					{ Name: "AnalSlut", Property: { Type: "AnalSlut" } },
					{ Name: "Babe", Property: { Type: "Babe" } },
					{ Name: "Bandit", Property: { Type: "Bandit" } },
					{ Name: "Bimbo", Property: { Type: "Bimbo" } },
					{ Name: "Bratty", Property: { Type: "Bratty" } },
					{ Name: "ButtSlut", Property: { Type: "ButtSlut" } },
					{ Name: "Chair", Property: { Type: "Chair" } },
					{ Name: "Chaste", Property: { Type: "Chaste" } },
					{ Name: "Crazy", Property: { Type: "Crazy" } },
					{ Name: "Cumslut", Property: { Type: "Cumslut" } },
					{ Name: "Cutie", Property: { Type: "Cutie" } },
					{ Name: "Damsel", Property: { Type: "Damsel" } },
					{ Name: "Doll", Property: { Type: "Doll" } },
					{ Name: "EdgeMe", Property: { Type: "EdgeMe" } },
					{ Name: "Evil", Property: { Type: "Evil" } },
					{ Name: "ForSale", Property: { Type: "ForSale" } },
					{ Name: "Greedy", Property: { Type: "Greedy" } },
					{ Name: "Happy", Property: { Type: "Happy" } },
					{ Name: "Horny", Property: { Type: "Horny" } },
					{ Name: "Kinky", Property: { Type: "Kinky" } },
					{ Name: "Lady", Property: { Type: "Lady" } },
					{ Name: "LockMe", Property: { Type: "LockMe" } },
					{ Name: "Nude", Property: { Type: "Nude" } },
					{ Name: "Nurse", Property: { Type: "Nurse" } },
					{ Name: "Nympho", Property: { Type: "Nympho" } },
					{ Name: "Painslut", Property: { Type: "Painslut" } },
					{ Name: "Pillow", Property: { Type: "Pillow" } },
					{ Name: "Punish", Property: { Type: "Punish" } },
					{ Name: "Robber", Property: { Type: "Robber" } },
					{ Name: "Sad", Property: { Type: "Sad" } },
					{ Name: "Switch", Property: { Type: "Switch" } },
					{ Name: "Table", Property: { Type: "Table" } },
					{ Name: "Ticklish", Property: { Type: "Ticklish" } },
					{ Name: "Undress", Property: { Type: "Undress" } },
					{ Name: "Victim", Property: { Type: "Victim" } },
					{ Name: "Violent", Property: { Type: "Violent" } },
					{ Name: "Worm", Property: { Type: "Worm" } },
				],
			},
		}, // CollarNameTagOval
		CollarNameTagPet: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarNameTag" },
			Config: {
				Options: [
					{ Name: "Blank", Property: { Type: null } },
					{ Name: "Bunny", Property: { Type: "Bunny" } },
					{ Name: "Cat", Property: { Type: "Cat" } },
					{ Name: "Dog", Property: { Type: "Dog" } },
					{ Name: "Foxy", Property: { Type: "Foxy" } },
					{ Name: "Kitten", Property: { Type: "Kitten" } },
					{ Name: "Kitty", Property: { Type: "Kitty" } },
					{ Name: "Mochi", Property: { Type: "Mochi" } },
					{ Name: "Panda", Property: { Type: "Panda" } },
					{ Name: "Pet", Property: { Type: "Pet" } },
					{ Name: "PetMe", Property: { Type: "PetMe" } },
					{ Name: "Pixie", Property: { Type: "Pixie" } },
					{ Name: "Pony", Property: { Type: "Pony" } },
					{ Name: "Puppy", Property: { Type: "Puppy" } },
					{ Name: "Racoon", Property: { Type: "Racoon" } },
					{ Name: "Sloth", Property: { Type: "Sloth" } },
				],
			},
		}, // CollarNameTagPet
		CollarNameTagLover: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarNameTag" },
			Config: {
				Options: [
					{ Name: "Blank", Property: { Type: null } },
					{ Name: "Cookie", Property: { Type: "Cookie" } },
					{ Name: "Feather", Property: { Type: "Feather" } },
					{ Name: "Lover", Property: { Type: "Lover" } },
					{ Name: "Muffin", Property: { Type: "Muffin" } },
				],
			},
		}, // CollarNameTagLover
		CollarNameTagLivestock: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarNameTag" },
			Config: {
				Options: [
					{ Name: "Blank", Property: { Type: null } },
					{ Name: "Animal", Property: { Type: "Animal" } },
					{ Name: "BreedMe", Property: { Type: "BreedMe" } },
					{ Name: "Cow", Property: { Type: "Cow" } },
					{ Name: "Meat", Property: { Type: "Meat" } },
					{ Name: "MilkMe", Property: { Type: "MilkMe" } },
					{ Name: "Pig", Property: { Type: "Pig" } },
				],
			},
		}, // CollarNameTagLivestock
		CollarShockUnit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [
					CommonChatTags.ASSET_NAME,
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
				],
				Options: [
					{ Name: "Low", Property: { Type: null, ShockLevel: 0 } },
					{ Name: "Medium", Property: { Type: "Medium", ShockLevel: 1 } },
					{ Name: "High", Property: { Type: "High", ShockLevel: 2 } },
				],
				ScriptHooks: {
					Draw: InventoryItemNeckAccessoriesCollarShockUnitDrawHook,
					Click: InventoryItemNeckAccessoriesCollarShockUnitClickHook,
				},
				DrawImages: false,
				BaselineProperty: { TriggerCount: 0, ShowText: true, BlinkState: false },
			},
		}, // CollarShockUnit
		CollarAutoShockUnit: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [
					CommonChatTags.ASSET_NAME,
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
				],
				Modules: [
					{
						Name: "ShockLevel", Key: "s",
						DrawImages: false,
						Options: [
							{ Property: { ShockLevel: 0 } }, // s0 - Level 1
							{ Property: { ShockLevel: 1 } }, // s1 - Level 2
							{ Property: { ShockLevel: 2 } }, // s2 - Level 3
						],
					},
					{
						Name: "AutoPunish", Key: "y",
						DrawImages: false,
						Options: [
							{ Property: { AutoPunish: 0 } }, // y0 - Off
							{ Property: { AutoPunish: 1 } }, // y1 - Low
							{ Property: { AutoPunish: 2 } }, // y2 - Medium
							{ Property: { AutoPunish: 3 } }, // y3 - High
						]
					},
				],
				ScriptHooks: {
					Draw: InventoryItemNeckAccessoriesCollarAutoShockUnitDraw,
					Click: InventoryItemNeckAccessoriesCollarAutoShockUnitClick,
				},
				BaselineProperty: { TriggerCount: 0, ShowText: true, BlinkState: false },
			},
		}, // CollarAutoShockUnit
	}, // ItemNeckAccessories
	ItemNeckRestraints: {
		PetPost: {
			Archetype: ExtendedArchetype.MODULAR,
			Config:{
				Modules: [
					{
						Name: "Plaque", Key: "p",
						Options: [
							{}, //p0 - Border
							{}, //p1 - Border
						]
					},
					{
						Name: "Dirt", Key: "d",
						Options: [
							{}, //d0 - Clean
							{}, //d1 - Dirty
						]
					},
					{
						Name: "Leash", Key: "l",
						Options: [
							{}, //l0 - Leash
							{Property: { Difficulty: 5,  },}, //l1 - Rope
							{AllowLock: true, Property: { Difficulty: 6 },}, //l2 - Chain
						]
					},
					{
						Name: "Sticker", Key: "s",
						Options: [
							{}, //s0 - Paw
							{}, //s1 - Triskel
							{}, //s2 - Moon
							{}, //s3 - LGBT
							{}, //s4 - Trans
							{}, //s5 - Bi
							{}, //s6 - NoSwim
							{}, //s7 - None
						]
					},
					{
						Name: "PostIt", Key: "m",
						Options: [
							{}, //m0 - Postit
							{}, //m1 - No PostIt
						]
					},
					{
						Name: "Txt", Key: "x",
						Options: [{ HasSubscreen: true }],
					},
				],
				ChangeWhenLocked: false,
				BaselineProperty: { Text: "Pet", Text2: "Leashing", Text3: "Post" },
			},
		},//PetPost
	},//ItemNeckRestraints
	ItemHood: {
		OldGasMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Lenses", Key: "l",
						Options: [
							{},
							{ Property: { Effect: ["BlindHeavy"] } },
						],
					},
					{
						Name: "Addons", Key: "a",
						Options: [
							{},
							{ Property: { Effect: ["GagEasy"] } },
							{ Property: { Effect: ["GagEasy"] } },
							{ Property: { Effect: ["GagEasy"] } },
						],
					},
				],
				ChangeWhenLocked: false,
			},
		},
		InflatedBallHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Empty",
						Property: {
							Type: null,
							Difficulty: 0,
							InflateLevel: 0,
							Effect: [],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							Difficulty: 2,
							InflateLevel: 1,
							Effect: ["GagLight", "BlockMouth"],
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							Difficulty: 4,
							InflateLevel: 2,
							Effect: ["GagEasy", "BlockMouth"],
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							Difficulty: 6,
							InflateLevel: 3,
							Effect: ["GagMedium", "BlockMouth"],
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							Difficulty: 8,
							InflateLevel: 4,
							Effect: ["GagVeryHeavy", "BlockMouth"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectInflateLevel",
					Option: "InflateLevel",
					Chat: ({ newIndex, previousIndex }) => `InflatedHood${(newIndex > previousIndex) ? "pumps" : "deflates"}To`,
				},
				DrawImages: false,
			}
		}, // InflatedBallHood
		KirugumiMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.TARGET_CHAR],
				Modules: [
					{
						Name: "Eyes", Key: "e",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic
					},
					{
						Name: "Mouth", Key: "m",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic,
					},
					{
						Name: "Blush", Key: "b",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic,
					},
					{
						Name: "Brows", Key: "br",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic,
					},
					{
						Name: "Opacity", Key: "op",
						Options: [
							{},
							{
								Property: {
									Effect: ["BlindLight"],
								},
							},
							{
								Property: {
									Effect: ["BlindHeavy", "Prone"],
								},
							}
						], // Opacity
					},
					{
						Name: "MaskStyle", Key: "ms",
						Options: [
							{
								Property: {
									Effect: ["BlockMouth"],
									Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask", "ItemHead"],
									HideItem: ["ItemHeadSnorkel"],
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose", "ItemEars"]
								}
							},
							{
								Property: {
									OverridePriority: 35,
									Hide: ["Head"],
								}
							},
						],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // KirugumiMask
		GwenHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "HairOutAccOut",
						Property: {
							Type: null,
							Hide: []
						},
					},
					{
						Name: "HairInAccOut",
						Property: {
							Type: "HairInAccOut",
							Hide: ["HairBack"]
						},
					},
					{
						Name: "HairOutAccIn",
						Property: {
							Type: "HairOutAccIn",
							Hide: ["HairAccessory1", "HairAccessory2", "HairAccessory3"]
						},
					},
					{
						Name: "HairInAccIn",
						Property: {
							Type: "HairInAccIn",
							Hide: ["HairAccessory1", "HairAccessory2", "HairAccessory3", "HairBack"]
						},
					},
				],
				DialogPrefix: {
					Header: "GwenHoodSelectStyle",
					Option: "GwenHoodStyle",
					Chat: "GwenHoodChangeStyle",
				},
				DrawImages: false,
			},
		}, // GwenHood
		OpenFaceHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "HideBackHair",
						Property: { Type: "HideBackHair", Hide: ["HairBack"] },
					},
					{
						Name: "ShowBackHair",
						Property: { Type: null },
					},
				],
				DialogPrefix: {
					Header: "SelectOpenFaceHoodStyle",
					Option: "OpenFaceHoodStyle",
				},
				DrawImages: false,
			}
		}, // OpenFaceHood
		TechnoHelmet1: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Visor", Key: "v",
						Options:[
							{
								Property: {
									CustomBlindBackground: "",
									Effect: [],
								}
							}, //v0 No Visor
							{
								Property: {
									CustomBlindBackground: "",
									Effect: [],
									Tint: [{ Color: 0, Strength: 0.1 }],
								}
							}, // v1 Transparent Visor
							{
								Property: {
									CustomBlindBackground: "",
									Effect: ["BlindLight", "Prone"],
									Tint: [{ Color: 0, Strength: 0.2 }],
								},
							}, // v2 Lightly Tinted Visor
							{
								Property: {
									CustomBlindBackground: "",
									Effect: ["BlindNormal", "Prone"],
									Tint: [{ Color: 0, Strength: 0.5 }],
								},
							}, // v3 Heavily Tinted Visor
							{
								Property: {
									CustomBlindBackground: "",
									Effect: ["BlindHeavy", "Prone"],
									Tint: [{ Color: 0, Strength: 1 }],
								},
							}, // v4 Opaque Visor
							{
								Property: {
									CustomBlindBackground: "HypnoSpiral2",
									Effect: ["BlindHeavy", "Prone"]
								},
							}, // v5 Hypnotic Visor
						],

					},
					{
						Name: "DeafeningModule", Key: "d",
						Options: [
							{}, //h0 Disabled
							{
								Property: {
									Effect: ["DeafLight"]
								},
							}, //h1 Light
							{
								Property: {
									Effect: ["DeafHeavy"],
								},
							}, //h2 Heavy
							{
								Property: {
									Effect: ["DeafTotal"]
								},
							}, //h3 Noise-Cancelling
						],
					},
					{
						Name: "ChinStrap", Key: "c",
						Options: [
							{}, //c0 No Chin Strap
							{
								Property: {
									Difficulty: 10
								}
							}, //h1 Chin Strap
						],
					},
				],
				ChangeWhenLocked: false,
			}
		}, // TechnoHelmet1
		ZipperHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "ZippersOpen",
						Property: { Type: null },
					},
					{
						Name: "ZippersClosed",
						Property: { Type: "ZippersClosed", Effect: ["BlindHeavy"] },
					},
					{
						Name: "ZippersClosedEyes",
						Property: { Type: "ZippersClosedEyes", Effect: ["BlindHeavy"] },
					},
					{
						Name: "ZippersClosedMouth",
						Property: {Type: "ZippersClosedMouth"},
					},
				]
			}

		}, // ZipperHood
		HeadboxSeethrough: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Seethrough",
						Property: {
							Type: null,
							Tint: [{Color: 0, Strength: 1}],
						},
					},
					{
						Name: "Opaque",
						Property: {
							Type: "Opaque"
						},
					},
				],
				DrawImages: false,
			},
		}, // HeadboxSeethrough
		KittyHood: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Modules: [
					{
						Name: "Blindfold", Key: "b",
						Options: [
							{}, // b0 - None
							{
								Property: {
									Effect: ["BlindHeavy"],
								}
							}, // b1 - Blindfold
						]
					},
					{
						Name: "Gag", Key: "g",
						Options: [
							{}, // g0 - None
							{
								Property: {
									Effect: ["GagLight"],
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
								}
							}, // g1 - Gag
						]
					},
					{
						Name: "Expression", Key: "e",
						Options: [
							{}, // e0 - Neutral
							{}, // e1 - OwO
							{}, // e2 - UwU
						]
					},
					{
						Name: "Tightness", Key: "t",
						Options: [{},{}], // t0 - Loose, t1 - Tight
					},
				]
			}
		}, //KittyHood
		DroneMask: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemHead", AssetName: "DroneMask" },
			Config: {
				Modules: [
					{
						Name: "Mouth", Key: "m",
						Options:[
							{ // m0 - None
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m1 - Onahole
								Property: { Effect: ["GagMedium","OpenMouth"] }
							},
							{ // m2 - Fleshlight
								Property: { Effect: ["GagMedium","OpenMouth"] }
							},
							{ // m3 - Smile
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m4 - Holes
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m5 - Sculpted
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m6 - Subtle
								Property: { Effect: ["BlockMouth"] }
							},
						]
					},
					{
						Name: "Eyes", Key: "e",
						Options:[
							{ // e0 - None
								Property: { Effect: ["BlindLight"] }
							},
							{ // e1 - Regular
								Property: { Effect: [] }
							},
							{ // e2 - Spiral
								Property: { Effect: [] }
							},
							{ // e3 - Smile
								Property: { Effect: [] }
							},
							{ // e4 - Holes
								Property: { Effect: ["BlindLight"] }
							},
							{ // e5 - Sculpted
								Property: { Effect: [] }
							},
							{ // e6 - Concave
								Property: {Effect: ["BlindLight"] }
							}

						]
					},
					{
						Name: "Pattern", Key: "p",
						Options:[{},{},{},{},{},{HasSubscreen: true},] // Blank, Barcode, Scarab, Hex, Lines, Text
					},
					{
						Name: "Glow", Key: "g",
						Options: [{},{},] // Glow Off, Glow On
					},
					{
						Name: "Sight", Key: "s",
						Options: [
							{ // s0 - Opaque
								Property: { Effect: ["BlindHeavy", "Prone"] }
							},
							{ // s1 - One Way
								Property: { Effect: [""] }
							},
						]
					},
					{
						Name: "Helmet", Key: "h",
						Options: [
							{}, // h0 - Mask
							{
								Property: {
									Hide: ["HairFront", "HairBack",], //"HairAccessory1", "HairAccessory2"],
									HideItem: [
										"HatBonnet1", "HatBonnet2", "HatBunnySuccubus2", "HatCrown1", "HatCrown2", "HatCrown4", "HatCrown5", "HatBand1",
										"HatBand2", "HatPirateBandana1", "HatVeil1","HatVeil2", // Hat items
										"MaskFuturisticVisor", "MaskShinobiMask", // Mask items
										"HairAccessory3Ribbons4", // HairAccessory items
										"HairAccessory1Antennae", "HairAccessory1BunnyEars1", "HairAccessory1BunnyEars2", "HairAccessory1CowHorns", "HairAccessory1ElfEars",
										"HairAccessory1Ears1", "HairAccessory1Ears2", "HairAccessory1FoxEars1", "HairAccessory1FoxEars2", "HairAccessory1FoxEars3",
										"HairAccessory1KittenEars1", "HairAccessory1KittenEars2", "HairAccessory1MouseEars1", "HairAccessory1MouseEars2",
										"HairAccessory1PuppyEars1", "HairAccessory1Ribbons2", "HairAccessory1WolfEars1", "HairAccessory1WolfEars2",
										"HairAccessory1Ribbons4", // Ear items (HA1)
										"HairAccessory2Antennae", "HairAccessory2BunnyEars1", "HairAccessory2BunnyEars2", "HairAccessory2CowHorns", "HairAccessory2ElfEars",
										"HairAccessory2Ears1", "HairAccessory2Ears2", "HairAccessory2FoxEars1", "HairAccessory2FoxEars2", "HairAccessory2FoxEars3",
										"HairAccessory2KittenEars1", "HairAccessory2KittenEars2", "HairAccessory2MouseEars1", "HairAccessory2MouseEars2",
										"HairAccessory2PuppyEars1", "HairAccessory2Ribbons2", "HairAccessory2WolfEars1", "HairAccessory2WolfEars2", // Ear items (HA2)
									], // These items are hidden because they have clear mismatch issues with the hood.
								},
							}, // h1 - Helmet (hood)
							{ // h2 - Helmet ( hood but nothing shows)
								Property: {
									Hide: ["HairFront", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
									HideItem: ["MaskFuturisticVisor", "MaskShinobiMask",],
								},
							},
						]
					},
					{
						Name: "Layering", Key: "j",
						Options: [
							{
								Property:{
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead"],
									Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead"],
								}
							}, // No gags or blindfolds visible
							{
								Property:{
									OverridePriority: 12,
									Block: ["ItemMouth", "ItemMouth2","ItemHead"],
									Hide: ["ItemMouth", "ItemMouth2","ItemHead"],
								}
							}, // Highest layer gag visible
							{
								Property:{
									OverridePriority: 12,
									Block: ["ItemHead"],
									Hide: ["ItemHead"],
								}
							}, // All gags visible
							{
								Property:{
									OverridePriority: 12,
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
									Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
								}
							}, // Blindfold items visible
							{
								Property:{
									OverridePriority: 12,
									Block: ["ItemMouth", "ItemMouth2",],
									Hide: ["ItemMouth", "ItemMouth2",],
								}
							}, // Blindfold and highest layer gag
							{
								Property:{
									OverridePriority: 12,
									Block: [],
									Hide: [],
								}
							}, // Blindfold and all gags

						]

					},
				]
			}
		}, // DroneMask
		CustomLatexHood: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "MPanel", Key: "m",
						Options:[
							{ // m0 - No Mouth
								Property: {
									Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m1 - Hole Only
								Property: {
									Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m2 - Round Mouth
								Property: { Effect: ["OpenMouth"] }
							},
							{ // m3 - Shaped Mouth
								Property: { Effect: ["OpenMouth"] }
							},
							{ // m4 - No Mouth Transparent
								Property: {
									Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m5 - Hole Only Transparent
								Property: {
									Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m6 - Round Mouth Transparent
								Property: { Effect: ["OpenMouth"] }
							},
							{ // m7 - Shaped Mouth Transparent
								Property: { Effect: ["OpenMouth"] }
							},
							{ // m8 - Round Mouth Opaque, filled Opaque
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m9 - Round Mouth Opaque, filled Opaque + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m10 - Round Mouth Opaque, filled Transparent
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m11 - Round Mouth Opaque, filled Transparent + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m12 - Shaped Mouth Opaque, filled Opaque
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m13 - Shaped Mouth Opaque, filled Opaque + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m14 - Shaped Mouth Opaque, filled Transparent
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m15 - Shaped Mouth Opaque, filled Transparent + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m16 - Round Mouth Transparent, filled Opaque
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m17 - Round Mouth Transparent, filled Opaque + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m18 - Round Mouth Transparent, filled Transparent
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m19 - Round Mouth Transparent, filled Transparent + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m20 - Shaped Mouth Transparent, filled Opaque
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m21 - Shaped Mouth Transparent, filled Opaque + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m22 - Shaped Mouth Transparent, filled Transparent
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m23 - Shaped Mouth Transparent, filled Transparent + pinhole
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m24 - Open
								Property: { Effect: []}
							},
							{ // m25 - Fishnet Mouth
								Property: { Effect: ["BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m26 - Circle Mouth
								Property: { Effect: ["OpenMouth"] }
							},
							{ // m27 - Circle Mouth Transparent
								Property: { Effect: ["OpenMouth"] }
							},
							{ // m28 - Circle Mouth Opaque, filled Opaque
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m29 - Circle Mouth Transparent, filled Opaque
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m30 - Circle Mouth Opaque, filled Transparent
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
							{ // m31 - Circle Mouth Transparent, filled Transparent
								Property: { Effect: ["GagEasy","BlockMouth"],
									OverridePriority: {
										"PanelHead": 38, "PanelHeadTransparent": 38, "PanelHeadHighlight": 38, "PanelNoEye": 38, "PanelNoEyeTransparent": 38, "PanelHoleNoEye": 38, "PanelHoleNoEyeTransparent": 38,
										"PanelNoEyeHighlight": 38, "PanelRoundEye": 38, "PanelRoundEyeTransparent": 38, "PanelRoundEyeHighlight": 38, "PanelShapedEye": 38, "PanelShapedEyeTransparent": 38, "PanelShapedEyeHighlight": 38,
										"PanelCircleEye": 38, "PanelCircleEyeTransparent": 38, "PanelCircleEyeHighlight": 38, "FillRoundEye": 38, "FillRoundEyeTransparent": 38, "FillHoleRoundEye": 38, "FillHoleRoundEyeTransparent": 38,
										"FillRoundEyeHighlight": 38, "FillShapedEye": 38, "FillShapedEyeTransparent": 38, "FillHoleShapedEye": 38, "FillHoleShapedEyeTransparent": 38, "FillShapedEyeHighlight": 38, "FillCircleEye": 38,
										"FillCircleEyeTransparent": 38, "PanelNoMouth": 38, "PanelNoMouthTransparent": 38, "PanelHoleNoMouth": 38, "PanelHoleNoMouthTransparent": 38, "PanelNoMouthHighlight": 38, "PanelRoundMouth": 38,
										"PanelRoundMouthTransparent": 38, "PanelRoundMouthHighlight": 38, "PanelShapedMouth": 38, "PanelShapedMouthTransparent": 38, "PanelShapedMouthHighlight": 38, "PanelFishnetMouth": 38,
										"PanelCircleMouth": 38, "PanelCircleMouthTransparent": 38, "PanelCircleMouthHighlight": 38, "FillRoundMouth": 38, "FillRoundMouthTransparent": 38, "FillHoleRoundMouth": 38, "FillHoleRoundMouthTransparent": 38,
										"FillShapedMouth": 38, "FillShapedMouthTransparent": 38, "FillHoleShapedMouth": 38, "FillHoleShapedMouthTransparent": 38, "FillCircleMouth": 38, "FillCircleMouthTransparent": 38, "LiningRoundFace": 38,
										"LiningRoundFaceHighlight": 38, "LiningCrossFace": 38, "LiningCrossFaceHighlight": 38, "LiningRoundEye": 38, "LiningRoundEyeHighlight": 38, "LiningShapedEye": 38, "LiningShapedEyeHighlight": 38,
										"LiningRoundMouth": 38, "LiningShapedMouth": 38, "LiningCircleEye": 38, "LiningCircleEyeHighlight": 38, "LiningCircleMouth": 38,
									},
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"]
								}
							},
						]
					},
					{
						Name: "EPanel", Key: "e",
						Options:[
							{ // e0 - No Eyes
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e1 - Hole Only
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e2 - Round Eyes
								Property: { Effect: []}
							},
							{ // e3 - Shaped Eyes
								Property: { Effect: []}
							},
							{ // e4 - No Eyes Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e5 - Hole Only Transparent
								Property: { Effect: []}
							},
							{ // e6 - Round Eyes Transparent
								Property: { Effect: []}
							},
							{ // e7 - Shaped Eyes Transparent
								Property: { Effect: []}
							},
							{ // e8 - Round Eyes Opaque, filled Opaque
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e9 - Round Eyes Opaque, filled Opaque + pinhole
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e10 - Round Eyes Opaque, filled Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e11 - Round Eyes Opaque, filled Transparent + pinhole
								Property: { Effect: []}
							},
							{ // e12 - Shaped Eyes Opaque, filled Opaque
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e13 - Shaped Eyes Opaque, filled Opaque + pinhole
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e14 - Shaped Eyes Opaque, filled Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e15 - Shaped Eyes Opaque, filled Transparent + pinhole
								Property: { Effect: []}
							},
							{ // e16 - Round Eyes Transparent, filled Opaque
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e17 - Round Eyes Transparent, filled Opaque + pinhole
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e18 - Round Eyes Transparent, filled Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e19 - Round Eyes Transparent, filled Transparent + pinhole
								Property: { Effect: []}
							},
							{ // e20 - Shaped Eyes Transparent, filled Opaque
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e21 - Shaped Eyes Transparent, filled Opaque + pinhole
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e22 - Shaped Eyes Transparent, filled Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e23 - Shaped Eyes Transparent, filled Transparent + pinhole
								Property: { Effect: []}
							},
							{ // e24 - Circle Eyes
								Property: { Effect: []}
							},
							{ // e25 - Circle Eyes Transparent
								Property: { Effect: []}
							},
							{ // e26 - Circle Eyes Opaque, filled Opaque
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e27 - Circle Eyes Opaque, filled Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
							{ // e28 - Circle Eyes Transparent, filled Opaque
								Property: { Effect: ["BlindHeavy"]
								}
							},
							{ // e29 - Circle Eyes Transparent, filled Transparent
								Property: { Effect: ["BlindLight"]
								}
							},
						]
					},
					{
						Name: "HeadT", Key: "x", DrawImages: false,
						Options:[{},{},] // Opaque, Transparent
					},
					{
						Name: "HairShow", Key: "h", DrawImages: false,
						Options: [
							{}, // h0 - Show Hair
							{
								Property: {
									Hide: ["HairFront", "HairBack",],
								},
							},  // h1 - Hide Hair
							{
								Property: {
									Hide: ["HairFront"],
								},
							}, // h2 - Show Back Hair
							{
								Property: {
									Hide: ["HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3"]
								},
							}, // h3 - Hide Hair and Accessories
						]
					},
					{
						Name: "ZHood", Key: "z", DrawImages: false,
						Options: [
							{// z0 - None
								Property: { Effect: [""], }
							},
							{// z1 - Open
								Property: { Effect: [""],
									Hide: ["HairFront"],
									HideItem: ["MaskOpenFaceHood", "MaskFaceVeil", "MaskFoxMask"],
								}
							},
							{// z2 - Closed
								Property: {
									Effect: ["BlindHeavy","GagEasy","BlockMouth"],
									Hide: ["HairFront","Mask"],
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"],
								}
							},
							{// z3 - Open Transparent
								Property: { Effect: [""],
									Hide: ["HairFront"],
									HideItem: ["MaskOpenFaceHood", "MaskFaceVeil", "MaskFoxMask"],
								}
							},
							{// z4 - Closed Transparent
								Property: { Effect: ["BlindLight","GagEasy","BlockMouth"],
									Hide: ["HairFront"],
									HideItem: ["MaskOpenFaceHood", "MaskFaceVeil", "MaskFoxMask"],
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"],
								}
							},
						]
					},
				],
				ChangeWhenLocked: false,
				DrawImages: false,
			}
		}, // CustomLatexHood
		HarnessCatMask: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "NoEars", Property: { Type: null } },
					{ Name: "Ears", Property: { Type: "Ears" } },
				],
				ChangeWhenLocked: false,
			}
		}, // HarnessCatMask
		InflatableGagMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules:[
					{
						Name: "Lenses", Key: "l",
						Options:[
							{
								Property:{ Effect: [] }
							},
							{
								Property:{
									Effect: ["BlindLight"],
									Tint: [{Color: 2, Strength: 0.2}],
								}
							},
							{
								Property:{ Effect: ["BlindHeavy"] }
							},
						]
					},
					{
						Name: "GagLevel", Key: "g",
						Options:[
							{Property: {Effect: ["BlockMouth"] }},
							{Property: {Effect: ["BlockMouth","GagLight"]}},
							{Property: {Effect: ["BlockMouth","GagMedium"]}},
							{Property: {Effect: ["BlockMouth","GagVeryHeavy"]}},
						]
					},
					{
						Name: "Hair", Key: "h",
						Options: [
							{Property: {Hide: ["HairBack"]}},
							{Property: {Hide: []}},
						]
					},
				]
			}
		}, //Inflatable Gag Mask
		OpenMouthPlugHood: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules:[
					{
						Name: "FakeMouth", Key: "m",
						Options: [
							{Property: {Effect: [] }},
							{Property: {Effect: ["BlockMouth"] }},
						], //None, Fake Mouth
					},
					{
						Name: "Thickness", Key: "t",
						Options: [{},{}]
					}, // Thick, Thin
				]
			}
		}, // Open Mouth Plug Hood
		LatexDogHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config:{
				Options: [
					{ Name: "Thick", Property: { Type: "Thick" } },
					{ Name: "Thin", Property: { Type: "Thin" } },
				],
			}
		}, //Latex Dog Hood
		LatexDogMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Muzzle", Key: "m",
						Options:[
							{ // M0 - None
								Property: { Effect: [] }
							},
							{ // M1 - muzzled
								Property: { Effect: ["GagMedium","BlockMouth"] }
							},
						]
					},
					{
						Name: "Lenses", Key: "l",
						Options:[
							{ // l0 - None
								Property: { Effect: [] }
							},
							{ // l1 - Covered
								Property: { Effect: ["BlindLight"] }

							}

						]
					},
					{
						Name: "Collar", Key: "c",
						Options:[
							{ // M0 - None
								Property: { Effect: [] }
							},
							{ // M1 - Collar
								Property: { Effect: [] }

							},
						]
					},
				],
			},
		}, //Latex Dog Mask
		LatexHabit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Hat", AssetName: "LatexHabit" },
		}, // Latex Habit
	}, // ItemHood
	Jewelry: {
		JewelrySet: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Ears1", Key: "e", // Left Ear!
						Options:
						[
							{}, // e0 - none
							{}, // e1 - stud
							{}, // e2 - ring
							{}, // e3 - hoop
							{}, // e4 - indust
							{}, // e5 - bigstud
							{}, // e6 - 2stud
							{}, // e7 - 3stud
							{}, // e8 - 2ring
							{}, // e9 - 3ring
							{}, // e10 - carti
							{}, // e11 - indust mix
						],
					},
					{
						Name: "Ears2", Key: "a", // Right Ear!
						Options:
						[
							{}, // a0 - none
							{}, // a1 - stud
							{}, // a2 - ring
							{}, // a3 - hoop
							{}, // a4 - indust
							{}, // a5 - bigstud
							{}, // a6 - 2stud
							{}, // a7 - 3stud
							{}, // a8 - 2ring
							{}, // a9 - 3ring
							{}, // a10 - carti
							{}, // a11 - indust mix
						],
					},
					{
						Name: "Nose", Key: "n",
						Options:
						[
							{}, // n0 - none
							{}, // n1 - septum ring
							{}, // n2 - stud right
							{}, // n3 - stud left
							{}, // n4 - ring right
							{}, // n5 - ring left
						],
					},
					{
						Name: "Face", Key: "f",
						Options:
						[
							{}, // f0 - none
							{}, // f1 - dermals both
							{}, // f2 - dermals right
							{}, // f3 - dermals left
							{}, // f4 - bridge
							{}, // f5 - monroe right
							{}, // f6 - monroe left
							{}, // f7 - cheeks
							{}, // f8 - combo 1
							{}, // f9 - combo 2
							{}, // f10 - combo 3
							{}, // f11 - combo 4
						],
					},
				],
			},
		}, //JewelrySet
	}, // Jewelry
	Eyebrows: {
		Eyebrows2: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Style", Key: "s",
						Options: [
							{}, // s0 eyebrows2
							{}, // s1 eyebrows3
							{}, // s2 eyebrows4
							{}, // s3 eyebrows5
							{}, // s4 eyebrows6
						]
					},
					{
						Name: "LeftPiercing", Key: "p",
						Options: [
							{
								Property: { Type: null }
							}, // p0 none
							{ PrerequisiteBuyGroup: "JewelrySet" }, // p1 1Bar
							{ PrerequisiteBuyGroup: "JewelrySet" }, // p2 2Bar
							{ PrerequisiteBuyGroup: "JewelrySet" }, // p3 1Ring
							{ PrerequisiteBuyGroup: "JewelrySet" }, // p4 2Ring
						]
					},
					{
						Name: "RightPiercing", Key: "r",
						Options: [
							{
								Property: { Type: null }
							}, // r0 none
							{ PrerequisiteBuyGroup: "JewelrySet" }, // r1 1Bar
							{ PrerequisiteBuyGroup: "JewelrySet" }, // r2 2Bar
							{ PrerequisiteBuyGroup: "JewelrySet" }, // r3 1Ring
							{ PrerequisiteBuyGroup: "JewelrySet" }, // r4 2Ring
						]
					},
				]
			},
		},
	},
	Mouth: {
		Regular: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Lips", Key: "l",
						Options: [
							{}, // l0 - none
							{PrerequisiteBuyGroup: "JewelrySet"}, // l1 - middle
							{PrerequisiteBuyGroup: "JewelrySet"}, // l2 - left
							{PrerequisiteBuyGroup: "JewelrySet"}, // l3 - right
							{PrerequisiteBuyGroup: "JewelrySet"}, // l4 - both sides
							{PrerequisiteBuyGroup: "JewelrySet"}, // l5 - triple
							{PrerequisiteBuyGroup: "JewelrySet"}, // l6 - vertical labret
							{PrerequisiteBuyGroup: "JewelrySet"}, // l7 - vertical labret with rings
						]
					},
					{
						Name: "Tongue", Key: "t",
						Options: [
							{}, // t0 - none
							{PrerequisiteBuyGroup: "JewelrySet"}, // t1 - one stud
							{PrerequisiteBuyGroup: "JewelrySet"}, // t2 - double studs
						]
					},
				]
			},
		},
		Full: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Lips", Key: "l",
						Options: [
							{}, // l0 - none
							{PrerequisiteBuyGroup: "JewelrySet"}, // l1 - middle
							{PrerequisiteBuyGroup: "JewelrySet"}, // l2 - left
							{PrerequisiteBuyGroup: "JewelrySet"}, // l3 - right
							{PrerequisiteBuyGroup: "JewelrySet"}, // l4 - both sides
							{PrerequisiteBuyGroup: "JewelrySet"}, // l5 - triple
							{PrerequisiteBuyGroup: "JewelrySet"}, // l6 - vertical labret
							{PrerequisiteBuyGroup: "JewelrySet"}, // l7 - vertical labret with rings
						]
					},
					{
						Name: "Tongue", Key: "t",
						Options: [
							{}, // t0 - none
							{PrerequisiteBuyGroup: "JewelrySet"}, // t1 - one stud
							{PrerequisiteBuyGroup: "JewelrySet"}, // t2 - double studs
						]
					},
				]
			},
		},
	},
	ItemDevices: {
		FuturisticCrate: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Window", Key: "w",
						Options: [
							{}, // d0 - Open
							{
								Property: {
									Difficulty: 20,
									Effect: ["Prone", "Freeze", "Enclose"]
								},
							}, // d1 - Window
							{
								Property: {
									Difficulty: 22,
									Effect: ["BlindLight", "Prone", "Freeze", "Enclose"]
								},
							}, // d2 - Normal Window
							{
								Property: {
									Difficulty: 22,
									Effect: ["BlindNormal", "Prone", "Freeze", "Enclose"]
								},
							}, // d3 - Small window
							{
								Property: {
									Difficulty: 52,
									Effect: ["BlindHeavy", "GagLight", "Prone", "Freeze", "Enclose"]
								},
							}, // d4 - Closed
						],
					},
					{
						Name: "LegCuffs", Key: "l",
						Options: [
							{}, // l0 - No leg straps
							{ // l1 - Kneel leg restraints
								Prerequisite: ["LegsOpen", "CuffedLegsOrEmpty", "CuffedFeetOrEmpty", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling"],
								Property: {
									Difficulty: 18,
									SetPose: ["Kneel"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
							{ // l2 - Closed leg restraints
								Prerequisite: ["LegsOpen", "CuffedLegsOrEmpty", "CuffedFeetOrEmpty", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling"],
								Property: {
									Difficulty: 22,
									SetPose: ["LegsClosed"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"]
								},
							},
							{ // l3 - Spread leg restraints
								Prerequisite: ["LegsOpen", "CuffedLegsOrEmpty", "CuffedFeetOrEmpty", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling"],
								Property: {
									Difficulty: 22,
									SetPose: ["Spread"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"]
								},
							},
						],
					},
					{
						Name: "ArmCuffs", Key: "a",
						Options: [
							{}, // s0 - No arm cuffs
							{ // s1 - Elbow cuffs
								Prerequisite: ["CuffedArmsOrEmpty"],
								Property: {
									Difficulty: 18,
									SetPose: ["BackElbowTouch"],
									AllowActivePose: ["Spread", "LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
							{ // s2 - Box cuffs
								Prerequisite: ["CuffedArmsOrEmpty"],
								Property: {
									Difficulty: 18,
									SetPose: ["BackBoxTie"],
									AllowActivePose: ["Spread", "LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
							{ // s3 - Overhead restraints
								Prerequisite: ["CuffedArmsOrEmpty"],
								Property: {
									Difficulty: 22,
									SetPose: ["OverTheHead"],
									AllowActivePose: ["Spread", "LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
						],
					},
					{
						Name: "Device", Key: "d",
						Options: [
							{}, // d0 - No devvice
							{ // s1 - Pleasure module
								HasSubscreen: true,
								Prerequisite: ["AccessVulva", "VulvaEmpty", "VulvaNotBlockedByBelt"],
								Property: {
									SetPose: ["BaseLower"],
									AllowActivePose: ["Spread", "LegsClosed", "BaseLower"],
									Effect: ["Egged", "Prone", "Freeze", "BlockKneel"],
									OverrideHeight: { Height: 0, Priority: 60 },
								}
							},
						],
					},
					{
						Name: "Structure", Key: "t",
						Options: [
							{}, // t0 - No harness
							{}, // t1 - X
							{}, // t2 - +
							{}, // t3 - H
						],
					},
					{
						Name: "Harness", Key: "h",
						Options: [
							{}, // h0 - None
							{ // h1 - Minimal
								Property: {
									Difficulty: 12,
									Effect: ["Prone", "Freeze"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
							{ // h2 - Comprehensive
								Property: {
									Difficulty: 18,
									Effect: ["Prone", "Freeze"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
							{ // h3 - Comprehensive (breast)
								Property: {
									Difficulty: 18,
									Effect: ["Prone", "Freeze"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
							{ // h4 - High Security
								Property: {
									Difficulty: 24,
									Effect: ["Prone", "Freeze"],
									OverrideHeight: { Height: 0, Priority: 60 },
								},
							},
						],
					},
				],
				ChangeWhenLocked: false,
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: (data, next, ...args) => {
						return FuturisticAccessValidate(data, next, ...args) || VibratorModeValidate(...args);
					},
				}
			},
		}, // FuturisticCrate

		BondageBench: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "None",
						AllowLock: false,
						Property: {
							Type: null,
							Difficulty: 0,
							SetPose: ["LegsClosed"],
							Effect: ["Mounted"],
						},
					},
					{
						Name: "Light",
						SelfBondageLevel: 2,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Light",
							Difficulty: 2,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
						},
					},
					{
						Name: "Normal",
						SelfBondageLevel: 3,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Normal",
							Difficulty: 3,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
						},
					},
					{
						Name: "Heavy",
						SelfBondageLevel: 6,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Heavy",
							Difficulty: 6,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
						},
					},
					{
						Name: "Full",
						SelfBondageLevel: 9,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Full",
							Difficulty: 9,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
						},
					},
				],
				DialogPrefix: {
					Header: "BondageBenchStrapsSelectTightness",
					Option: "BondageBenchStrapsPose",
					Chat: "BondageBenchStrapsRestrain",
				},
			},
		}, // BondageBench
		Cushion: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Hold",
						Property: {
							Type: null,
							HideItem: ["ItemMiscTeddyBear"],
							AllowActivity: ["SpankItem"],
						},
					},
					{
						Name: "Kneel",
						Prerequisite: ["NotSuspended", "CanKneel"],
						Property: {
							Type: "Kneel",
							OverrideHeight: { Height: -200, Priority: 21 },
							OverridePriority: 1,
							SetPose: ["Kneel"]
						},
					},
				],
				DialogPrefix: {
					Header: "SelectCushionStyle",
					Option: "CushionType",
				},
				ChatSetting: TypedItemChatSetting.SILENT,
			},
		}, // Cushion
		Crib: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Gate", Key: "g",
						Options: [
							{}, // g0 - Gate open
							{ Property: { Difficulty: 15 } }, // g1 - Gate closed
						],
					},
					{
						Name: "Plushies", Key: "p",
						Options: [
							{}, // p0 - No plushies
							{}, // p1 - Plushies
						],
					},
				],
			},
		}, // Crib
		PetBed: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "NoBlanket",
						Property: {
							Type: null
						},
					},
					{
						Name: "Blanket",
						Property: {
							Type: "Blanket",
							SetPose: ["AllFours"],
							Hide: ["ItemArms", "ItemButt", "TailStraps", "Wings"],
							HideItem: ["ItemMiscTeddyBear"],
							HideItemExclude: ["ItemArmsBitchSuit", "ItemArmsBitchSuitExposed"],
							Block: [
								"ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemBoots",
								"ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings",
								"ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"
							]
						},
						Random: false,
					},
				],
			},
		}, // PetBed
		Vacbed: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Normal",
						Property: { Type: null }
					},
					{
						Name: "Nohair",
						Property: {
							Type: "Nohair",
							Hide: ["HairFront", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Hat"],
						},
					},
				],
			},
		}, // Vacbed
		Familiar: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Bat",
						Property: { Type: null },
					},
					{
						Name: "Cat",
						Property: { Type: "Cat" },
					},
					{
						Name: "Skeleton",
						Property: { Type: "Skeleton" },
					},
					{
						Name: "Parrot",
						Property: { Type: "Parrot" },
					},
				],
			},
		}, // Familiar
		LittleMonster: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Black",
						Property: { Type: null },
					},
					{
						Name: "Red",
						Property: { Type: "Red" },
					},
					{
						Name: "Green",
						Property: { Type: "Green" },
					},
					{
						Name: "Blue",
						Property: { Type: "Blue" },
					},
				],
			},
		}, // LitteMonster
		InflatableBodyBag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Light",
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							Difficulty: 3,
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							Difficulty: 6,
						},
					},
					{
						Name: "Max",
						Property: {
							Type: "Max",
							Difficulty: 9,
						},
					},
				],
			},
		}, // InflatableBodyBag
		FurBlanketWrap: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR_NAME],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							Difficulty: 3,
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Difficulty: 5,
						},
					},
					{
						Name: "Belts",
						AllowLock: true,
						Property: {
							Type: "Belts",
							Difficulty: 8,
						},
					},
				],
				DrawImages: false,
				ChangeWhenLocked: false,
			},
		}, // FurBlanketWrap
		Pole: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Untied",
						Property: {
							Type: null,
						}
					},
					{
						Name: "Tied",
						SelfBondageLevel: 2,
						Property: {
							Type: "Tied",
							Difficulty: 8,
							SetPose: ["BackBoxTie"],
							Effect: ["Block", "Freeze", "Prone"],
						}
					},
				],
			},
		}, // Pole
		CryoCapsule: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: ["Freeze"],
							SelfUnlock: true
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							Difficulty: 50,
							Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
							SelfUnlock: false
						}
					}
				],
				ChangeWhenLocked: false,
				DialogPrefix: {
					Header: "SelectCryoCapsuleType",
					Option: "CryoCapsuleType",
					Chat: "CryoCapsuleSet",
				},
			},
		}, // CryoCapsule
		Coffin: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "CryoCapsule" },
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: ["Freeze"],
							SelfUnlock: true
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							Difficulty: 50,
							Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
							SelfUnlock: false
						}
					}
				],
				DialogPrefix: {
					Header: "SelectCoffinType",
					Option: "CoffinType",
					Chat: "CoffinSet",
				},
			},
		}, // Coffin
		Net: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR_NAME],
				Options: [
					{
						Name: "Kneel",
						Property: {
							Type: "Kneel",
							Difficulty: 3,
							Effect: ["Freeze", "Prone", "ForceKneel"],
							SetPose: ["Kneel"],
						},
					},
					{
						Name: "AllFours",
						Property: {
							Type: "AllFours",
							Difficulty: 6,
							Effect: ["Freeze", "Prone"],
							SetPose: ["AllFours"],
						},
					},
					{
						Name: "Suspended",
						Property: {
							Type: "Suspended",
							Difficulty: 7,
							Effect: ["Block", "Freeze", "Prone", "Suspended"],
							SetPose: ["Hogtied"],
							Block: ["ItemArms","ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
							Hide: ["ItemArms","ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
							HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"],
							OverrideHeight: { Height: 25, Priority: 51, HeightRatioProportion: 0 },
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemDevicesNet",
				},
			},
		}, // Net
		WoodenRack: {
			Archetype: ExtendedArchetype.MODULAR,
			Config:{
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.DEST_CHAR_NAME, CommonChatTags.TARGET_CHAR_NAME],
				Modules:[
					{
						Name: "Frame", Key: "f",
						Options: [
							{}, // f0 - Normal
							{}, // f1 - Stained
							{}, // f2 - HalfBack
							{}, // f3 - NoBack
						],
					},
					{
						Name: "TopRestraints", Key: "t",
						Options: [
							{}, // t0 - No
							{
								Prerequisite: ["CuffedArmsOrEmpty"],
								Property: {
									Difficulty: 6,
									SetPose: ["Yoked"],
									AllowActivePose: ["LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],
								},
							}, // t1 - Rope
							{
								Prerequisite: ["CuffedArmsOrEmpty"],
								Property: {
									Difficulty: 6,
									SetPose: ["OverTheHead"],
									AllowActivePose: ["LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],

								},
							}, // t2 - RopeTight
							{
								AllowLock: true,
								Prerequisite: ["CuffedArms"],
								Property: {
									Difficulty: 10,
									SetPose: ["Yoked"],
									AllowActivePose: ["LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],
								},
							}, // t3 - Chains
							{
								AllowLock: true,
								Prerequisite: ["CuffedArms"],
								Property: {
									Difficulty: 10,
									SetPose: ["OverTheHead"],
									AllowActivePose: ["LegsClosed", "BaseLower"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "Block", "BlockKneel", "Mounted"],
								},
							}, // t4 - ChainsTight
							{
								AllowLock: true,
								Property: {
									Difficulty: 12,
									SetPose: ["Yoked"],
									Block: ["ItemArms"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
								},
							}, // t5 - Stocks
						],
					},
					{
						Name: "BotRestraints", Key: "b",
						Options: [
							{}, // b0 - No
							{
								Property: {
									Difficulty: 6,
									SetPose: ["Spread"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"]
								},
							}, // b1 - Rope
							{
								Property: {
									Difficulty: 6,
									SetPose: ["LegsClosed"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"]
								},
							}, // b2 - RopeTight
							{
								AllowLock: true,
								Prerequisite: ["CuffedLegs"],
								Property: {
									Difficulty: 10,
									SetPose: ["Spread"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"]
								},
							}, // b3 - Chains
							{
								AllowLock: true,
								Prerequisite: ["CuffedLegs"],
								Property: {
									Difficulty: 10,
									SetPose: ["LegsClosed"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes"]
								},
							}, // b4 - ChainsTogether
							{
								AllowLock: true,
								Property: {
									Difficulty: 12,
									SetPose: ["BaseLower"],
									Block: ["ItemFeet", "ItemLegs"],
									Effect: ["Prone", "Freeze", "BlockKneel", "Mounted"],
									Hide: ["ItemBoots", "Shoes", "ItemFeet", "ItemLegs"],
								},
							}, // b5 - Stocks
						],
					},
				],
			},
		}, //WoodenRack
		Sybian: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // Sybian
		FuckMachine: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // FuckMachine
		Kennel: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Door", Key: "d",
						Options: [
							{ Property: { Difficulty: -100, Door: false } },
							{ Property: { Difficulty: 10, Effect: ["OneWayEnclose", "Prone", "Freeze"], Door: true } },
						],
					},
					{
						Name: "Padding", Key: "p",
						Options: [
							{ Property: { Padding: false } },
							{ Property: { Padding: true } },
						],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // Kennel
		Locker: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Vents",
						Property: { Type: null },
					},
					{
						Name: "Ventless",
						Property: { Type: "Ventless", Effect: ["GagLight", "BlindHeavy"] },
					},
				],
				BaselineProperty: { Opacity: 0 },
				ScriptHooks: {
					Load: PropertyOpacityLoad,
					Draw: PropertyOpacityDraw,
					Exit: PropertyOpacityExit,
					Validate: PropertyOpacityValidate,
				},
				DialogPrefix: {
					Npc: (C, Option, PreviousOption) => `ItemDevicesLocker${Option.Name}`,
				}
			},
		}, // Locker
		SmallLocker: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemDevices", AssetName: "Locker" },
			Config: {
				DialogPrefix: {
					Header: "ItemDevicesLockerSelect",
					Option: "ItemDevicesLocker",
					Chat: "ItemDevicesLockerSet",
					Npc: (C, Option, PreviousOption) => `ItemDevicesLocker${Option.Name}`,
				},
			},
		}, // SmallLocker
		VacBedDeluxe: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Legs",
						Key: "l",
						Options: [
							{
								Property: { SetPose: ["BaseLower"] },
								Prerequisite: ["LegsOpen"],
							}, // l0 - Legs spread
							{
								Property: { SetPose: ["LegsClosed"] },
							}, // l1 - Legs closed
						],
					},
					{
						Name: "Arms",
						Key: "a",
						Options: [
							{}, // a0 - Arms down
							{ Property: { SetPose: ["Yoked"] } }, // a1 - Arms yoked
						],
					},
				],
				BaselineProperty: { Opacity: 1 },
				ScriptHooks: {
					Load: PropertyOpacityLoad,
					Draw: InventoryItemDevicesVacBedDeluxeDrawHook,
					Exit: PropertyOpacityExit,
					Validate: PropertyOpacityValidate,
				},
			},
		}, // VacBedDeluxe
		WoodenBox: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR_NAME, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "SWNE",
						Property: { Type: null, Effect: ["Prone", "Enclose", "Freeze"] },
					},
					{
						Name: "NWSE",
						Property: { Type: "NWSE", Effect: ["Prone", "Enclose", "Freeze"] },
					},
				],
				BaselineProperty: { Opacity: 0, Text: "" },
				ScriptHooks: {
					Load: InventoryItemDevicesWoodenBoxLoadHook,
					Draw: InventoryItemDevicesWoodenBoxDrawHook,
					Exit: InventoryItemDevicesWoodenBoxExitHook,
				},
			},
		}, // WoodenBox
		TransportWoodenBox: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemDevices", AssetName: "WoodenBox" },
			Config: {
				DialogPrefix: {
					Header: "ItemDevicesWoodenBoxSelect",
					Option: "ItemDevicesWoodenBox",
					Chat: "ItemDevicesWoodenBoxSet",
				},
			},
		}, // TransportWoodenBox
		LuckyWheel: {
			Archetype: ExtendedArchetype.MODULAR,
			Config:{
				Modules: [
					{
						Name: "Game", Key: "g",
						Options: [
							{ HasSubscreen: true },
						],
					},
					{
						Name: "Stand", Key: "s",
						Options: [
							{}, {}, // s0 - WoodenBase, s1 - MetalBase
						],
					},
					{
						Name: "Misc", Key: "m",
						Options: [
							{}, {}, // m0 - MiscOn, m1 - MiscOff
						],
					},
					{
						Name: "Arrow", Key: "a",
						Options: [
							{}, {}, {}, // a0 - DefaultArrow, a1 - AlternateArrow, a2 - PlugArrow
						],
					},
					{
						Name: "Position", Key: "p",
						Options: [
							{}, // p0 - WheelFront
							{ // p1 - WheelBack
								Property: {
									OverridePriority: 0,
								},
							},
						]
					},
				],
				ScriptHooks: {
					Draw: InventoryItemDevicesLuckyWheelDrawHook,
					Click: InventoryItemDevicesLuckyWheelClickHook,
					Init: InventoryItemDevicesLuckyWheelInitHook,
				},
				BaselineProperty: { TargetAngle: 0 },
			},
		}, //LuckyWheel
		FoldingScreen: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR_NAME, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "Opaque",
						Property:
						{
							Type: "Opaque",
							Hide: ["BodyLower", "BodyUpper", "Hands", "HairFront", "HairBack", "Glasses",
								"ItemMouth","ItemMouth2", "ItemMouth3", "FacialHair", "HairAccessory1",
								"HairAccessory2", "HairAccessory3", "Hat", "Mask", "ItemEars", "ItemHead",
								"Cloth", "ClothLower", "ClothAccessory", "Necklace", "Suit", "SuitLower",
								"Bra", "Panties", "Garters", "Socks", "RightAnklet", "LeftAnklet", "Shoes",
								"Gloves", "TailStraps", "Wings", "ItemFeet", "ItemLegs", "ItemVulva",
								"ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2",
								"ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemArms", "ItemHands",
								"ItemHandheld", "ItemBoots", "Pussy", "Corset", "Bracelet", "LeftHand" ,
								"RightHand"
							],
						},
					},
					{
						Name: "Shadow",
						Property: { Type: "Shadow", Hide: [] },
					},
				],
				BaselineProperty: { Opacity: 1 },
			},
		}, // FoldingScreen
	}, // ItemDevices
	ItemBoots: {
		ToeTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Toes",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Full",
						Property: { Type: "Full", Difficulty: 2 },
					},
				],
				DialogPrefix: {
					Header: "SelectTapeWrapping",
					Option: "ToeTapePose",
					Chat: "ToeTapeSet",
					Npc: "",
				},
			},
		}, // ToeTape
		FuturisticHeels: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Shoes",
						Property: { Type: null, HeightModifier: 6 },
					},
					{
						Name: "Heel",
						Property: { Type: "Heel", HeightModifier: 16 },
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticHeels
		FuturisticHeels2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Shiny", Property: { Type: null } },
					{ Name: "Matte", Property: { Type: "Matte" } },
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticHeels2
		MonoHeel: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "Full",
						Property: { Type: null, Difficulty: 1 },
					},
					{
						Name: "Half",
						Property: { Type: "Half", Difficulty: 0 },
					},
				],
			},
		}, // MonoHeel
	}, // ItemBoots
	ItemVulva: {
		ClitSuctionCup: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							SuctionLevel: 0,
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							SuctionLevel: 1,
						},
					},
					{
						Name: "Medium",
						Property: {
							Type: "Medium",
							SuctionLevel: 2,
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							SuctionLevel: 3,
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							SuctionLevel: 4,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectSuctionLevel",
					Option: "SuctionLevel",
					Chat: ({ newIndex, previousIndex }) => `ClitSuc${(newIndex > previousIndex) ? "tightens" : "loosens"}To`,
					Npc: "ItemVulvaClitSuctionCupNPCReaction"
				},
				DrawImages: false,
			},
		}, // ClitSuctionCup
		DoubleEndDildo: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.DEST_CHAR_NAME, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Large",
						Property: {
							Type: "Large",
						},
					},
				],
				DrawImages: false,
			},
		}, // DoubleEndDildo
		VibratingDildo: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibratingDildo
		ClitoralStimulator: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // ClitoralStimulator
		VibratingEgg: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibratingEgg
		VibratingLatexPanties: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibratingLatexPanties
		WandBelt: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // WandBelt
		FullLatexSuitWand: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // FullLatexSuitWand
		HempRopeBelt: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // HempRopeBelt
		WiredEgg: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // WiredEgg
		Stitches: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options:[
					{
						Name: "Straight",
						Property: {Type: "Straight",}
					},
					{
						Name: "ZigZag",
						Property: {Type: "ZigZag",}
					},
					{
						Name: "Skewed",
						Property: {Type: "Skewed",}
					},
					{
						Name: "Cross",
						Property: {Type: "Cross",}
					},
				],
			},
		}, // Stitches
		VibeEggPenisBase: {
			Archetype: ExtendedArchetype.VIBRATING
		}, // VibeEggPenisBase
		InflatableVibeDildo: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemButt", AssetName: "InflVibeButtPlug" },
		}, // InflatableVibeDildo
		ShockDildo: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarShockUnit" },
			Config: {
				DialogPrefix: {
					Header: "ItemNeckAccessoriesCollarShockUnitSelect",
					Option: "ItemNeckAccessoriesCollarShockUnit",
					Chat: "ItemNeckAccessoriesCollarShockUnitSet",
					Npc: "ItemNeckAccessoriesCollarShockUnit",
				},
			},
		}, // ShockDildo
		ClitAndDildoVibratorbelt: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [CommonChatTags.DEST_CHAR_NAME],
				Modules: [
					{
						Name: "DildoIntensity",
						Key: "d",
						DrawImages: false,
						Options: [
							{ Property: { Intensity: -1, Effect: ["Egged"] } }, // d0 - Turn Off
							{ Property: { Intensity: 0, Effect: ["Egged", "Vibrating"] } }, // d1 - Low
							{ Property: { Intensity: 1, Effect: ["Egged", "Vibrating"] } }, // d2 - Medium
							{ Property: { Intensity: 2, Effect: ["Egged", "Vibrating"] } }, // d3 - High
							{ Property: { Intensity: 3, Effect: ["Egged", "Vibrating"] } }, // d4 - Maximum
						],
					},
					{
						Name: "EggIntensity",
						Key: "e",
						DrawImages: false,
						Options: [
							{ Property: { Intensity: -1, Effect: ["Egged"] } }, // e0 - Turn Off
							{ Property: { Intensity: 0, Effect: ["Egged", "Vibrating"] } }, // e1 - Low
							{ Property: { Intensity: 1, Effect: ["Egged", "Vibrating"] } }, // e2 - Medium
							{ Property: { Intensity: 2, Effect: ["Egged", "Vibrating"] } }, // e3 - High
							{ Property: { Intensity: 3, Effect: ["Egged", "Vibrating"] } }, // e4 - Maximum
						],
					},
				],
				ScriptHooks: {
					Draw: InventoryItemVulvaClitAndDildoVibratorbeltDrawHook,
					Exit: InventoryItemVulvaClitAndDildoVibratorbeltExitHook,
				},
				DialogPrefix: {
					Chat: ({previousOption, newOption}) => {
						if (DialogFocusItem == null) {
							return "";
						}
						const Prefix = DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name;
						const Change = Number.parseInt(newOption.Name[1]) - Number.parseInt(previousOption.Name[1]);
						const StateChange = (Change > 0) ? "Increase" : "Decrease";
						return `${Prefix}${StateChange}`;
					},
				},
			},
		}, // ClitAndDildoVibratorbelt
		LoversVibrator: {
			Archetype: ExtendedArchetype.VIBRATING,
			Config: {
				ScriptHooks: {
					Draw: InventoryItemVulvaLoversVibratorDrawHook,
					Click: InventoryItemVulvaLoversVibratorClickHook,
				},
			},
		}, // LoversVibrator
	}, // ItemVulva
	ItemVulvaPiercings: {
		ClitRing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: {
							Type: null,
							Effect: [],
						},
					},
					{
						Name: "Leash",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "Leash",
							Effect: ["Leash", "Wiggling"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectAttachmentState",
					Option: "ClitRingPose",
					Chat: "ClitRingRestrain",
				},
			},
		}, // ClitRing
		RoundClitPiercing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Ring",
						Property: {
							Type: null,
							Effect: [],
						}
					},
					{
						Name: "Weight",
						Property: {
							Type: "Weight",
							Effect: ["Wiggling"],
						}
					},
					{
						Name: "Bell",
						Property: {
							Type: "Bell",
							Effect: ["Wiggling"],
						},
					},
					{
						Name: "Chain",
						Property: {
							Type: "Chain",
							Effect: ["Wiggling"],
							Block: ["ItemNipplesPiercings"],
						},
						Prerequisite: ["NeedsNippleRings"],
					},
					{
						Name: "HaremChain",
						Property: {
							Type: "HaremChain",
							Effect: ["Wiggling"],
							Block: ["ItemNipplesPiercings"],
						},
						Prerequisite: ["NeedsNippleRings"],
					},
				],
			},
		}, // RoundClitPiercings
		VibeHeartClitPiercing: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibeHeartClitPiercing
		TapedClitEgg: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // TapedClitEgg
		VibeEggGlans: {
			Archetype: ExtendedArchetype.VIBRATING
		}, // VibeEggGlans
	}, // ItemVulvaPiercings
	ItemButt: {
		AnalHook: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: {
							Type: null,
							Difficulty: 0,
							Intensity: 0,
							Effect: ["IsPlugged"],
						},
					},
					{
						Name: "Chain",
						Property: {
							Type: "Chain",
							Difficulty: 8,
							Intensity: 1,
							Effect: ["IsPlugged", "Freeze", "Egged"]
						},
						Random: false,
					},
					{
						Name: "Hair",
						Property: {
							Type: "Hair",
							Difficulty: 4,
							Intensity: 1,
							Effect: ["IsPlugged", "Egged"]
						}
					},
				],
				DialogPrefix: {
					Header: "SelectAttachmentState",
					Option: "AnalHookPose",
					Chat: "AnalHookRestrain",
					Npc: "InventoryItemButtAnalHookNPCReaction",
				},
			},
		}, // AnalHook
		ButtPlugLock: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: { Type: null },
					},
					{
						Name: "ChainShort",
						Prerequisite: ["NotSuspended", "CanKneel", "NotMounted"],
						Property: {
							Type: "ChainShort",
							Effect: ["Freeze", "ForceKneel", "IsChained"],
							SetPose: ["Kneel"],
						},
						Random: false,
					},
					{
						Name: "ChainLong",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "ChainLong",
							Effect: ["Tethered", "IsChained"],
						},
						Random: false,
					},
				],
				DialogPrefix: {
					Header: "SelectAttachmentState",
					Option: "ButtPlugLockPose",
					Chat: "ButtPlugLockRestrain",
					Npc: "ButtPlugLockSet",
				},
			},
		}, // ButtPlugLock
		ButtPump: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Empty",
						Property: {
							Type: null,
							InflateLevel: 0,
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							InflateLevel: 1,
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							InflateLevel: 2,
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							InflateLevel: 3,
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							InflateLevel: 4,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectInflateLevel",
					Option: "InflateLevel",
					Chat: ({ newIndex, previousIndex }) => `BPumps${(newIndex > previousIndex) ? "pumps" : "deflates"}To`,
					Npc: "InventoryItemButtButtPumpNPCReaction",
				},
				DrawImages: false,
			},
		}, // ButtPump
		VibratingButtplug: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibratingButtplug
		VibratingDildoPlug: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibratingDildoPlug
		BunnyTailVibePlug: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // BunnyTailVibePlug
		EggVibePlugXXL: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // EggVibePlugXXL
		LockingVibePlug: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // LockingVibePlug
		AnalBeads2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
					CommonChatTags.ASSET_NAME,
				],
				Options: [
					{ Name: "_1in", Property: { Type: null, InsertedBeads: 1 } },
					{ Name: "_2in", Property: { Type: "_2in", InsertedBeads: 2 } },
					{ Name: "_3in", Property: { Type: "_3in", InsertedBeads: 3 } },
					{ Name: "_4in", Property: { Type: "_4in", InsertedBeads: 4 } },
					{ Name: "_5in", Property: { Type: "_5in", InsertedBeads: 5 } },
				],
				DrawImages: false,
				ChatSetting: TypedItemChatSetting.SILENT,
				ScriptHooks: {
					PublishAction: InventoryItemButtAnalBeads2PublishActionHook,
				}
			},
		}, // AnalBeads2
		InflVibeButtPlug: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
					CommonChatTags.DEST_CHAR_NAME,
					CommonChatTags.ASSET_NAME,
				],
				Modules: [
					{
						Name: "InflateLevel",
						Key: "f",
						DrawImages: false,
						Options: [
							{ Property: { InflateLevel: 0 } }, // f0 - Empty
							{ Property: { InflateLevel: 1 } }, // f1 - Light
							{ Property: { InflateLevel: 2 } }, // f2 - Inflated
							{ Property: { InflateLevel: 3 } }, // f3 - Bloated
							{ Property: { InflateLevel: 4 } }, // f4 - Maximum
						],
					},
					{
						Name: "Intensity",
						Key: "i",
						DrawImages: false,
						Options: [
							{ Property: { Intensity: -1, Effect: ["Egged"] } }, // i0 - Turn Off
							{ Property: { Intensity: 0, Effect: ["Egged", "Vibrating"] } }, // i1 - Low
							{ Property: { Intensity: 1, Effect: ["Egged", "Vibrating"] } }, // i2 - Medium
							{ Property: { Intensity: 2, Effect: ["Egged", "Vibrating"] } }, // i3 - High
							{ Property: { Intensity: 3, Effect: ["Egged", "Vibrating"] } }, // i4 - Maximum
						],
					},
				],
				ScriptHooks: {
					Draw: InventoryItemButtInflVibeButtPlugDrawHook,
				},
				DialogPrefix: {
					Header: "ItemButtInflVibeButtPlugSelect",
					Module: "ItemButtInflVibeButtPlugModule",
					Option: "ItemButtInflVibeButtPlugOption",
					Chat: ({previousOption, newOption}) => {
						const Prefix = "ItemButtInflVibeButtPlug";
						const Change = Number.parseInt(newOption.Name[1]) - Number.parseInt(previousOption.Name[1]);
						const StateChange = (Change > 0) ? "Increase" : "Decrease";
						return `${Prefix}${StateChange}To`;
					},
				},
			},
		}, // InflVibeButtPlug
		ShockPlug: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarShockUnit" },
			Config: {
				DialogPrefix: {
					Header: "ItemNeckAccessoriesCollarShockUnitSelect",
					Option: "ItemNeckAccessoriesCollarShockUnit",
					Chat: "ItemNeckAccessoriesCollarShockUnitSet",
					Npc: "ItemNeckAccessoriesCollarShockUnit",
				},
			},
		}, // ShockPlug
	}, // ItemButt
	ItemNipplesPiercings: {
		RoundPiercing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip"],
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Chain",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip", "Collared"],
						Property: {
							Type: "Chain",
							Difficulty: 0,
							Block: ["ItemNeck"],
							AllowActivityOn: ["ItemNeck"]
						},
					},
					{
						Name: "Weighted",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip"],
						Property: {
							Type: "Weighted",
							Difficulty: 0,
							Effect: ["Wiggling"],
						},
					},
					{
						Name: "WeightedChain",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip", "Collared"],
						Property: {
							Type: "WeightedChain",
							Difficulty: 0,
							Block: ["ItemNeck"],
							AllowActivityOn: ["ItemNeck"],
							Effect: ["Wiggling"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectPiercingState",
					Option: "RoundPiercingPose",
					Chat: "RoundPiercingRestrain",
					Npc: "RoundPiercingNPCReaction",
				},
			},
		}, // RoundPiercing
		VibeHeartPiercings: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibeHeartPiercings
	}, // ItemNipplesPiercings
	ItemNipples: {
		ChainClamp: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Chain",
						Property: {
							Type: null
						},
					},
					{
						Name: "Chain2",
						Property: {
							Type: "Chain2"
						},
					}
				],
				DialogPrefix: {
					Header: "SelectChainType",
					Option: "ChainClapNipples",
					Chat: "ChainClampSet",
					Npc: "ItemNipplesChainClamp",
				},
			},
		},  //ChainClamp
		LactationPump: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Off",
						Property: {
							Type: null,
							SuctionLevel: 0,
						},
					},
					{
						Name: "LowSuction",
						Property: {
							Type: "LowSuction",
							SuctionLevel: 1,
						},
					},
					{
						Name: "MediumSuction",
						Property: {
							Type: "MediumSuction",
							SuctionLevel: 2,
						},
					},
					{
						Name: "HighSuction",
						Property: {
							Type: "HighSuction",
							SuctionLevel: 3,
						},
					},
					{
						Name: "MaximumSuction",
						Property: {
							Type: "MaximumSuction",
							SuctionLevel: 4,
						},
					},
				],
				DialogPrefix: {
					Header: "LactationPumpSelectSetting",
					Option: "LactationPump",
					Chat: ({ newIndex, previousIndex }) => `LactationPumpPower${(newIndex > previousIndex) ? "tightens" : "loosens"}To`,
				},
				DrawImages: false,
			},
		}, // LactationPump
		NippleSuctionCups: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							SuctionLevel: 0,
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							SuctionLevel: 1,
						},
					},
					{
						Name: "Medium",
						Property: {
							Type: "Medium",
							SuctionLevel: 2,
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							SuctionLevel: 3,
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							SuctionLevel: 4,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectSuctionLevel",
					Option: "SuctionLevel",
					Chat: ({ newIndex, previousIndex }) => `NipSuc${(newIndex > previousIndex) ? "tightens" : "loosens"}To`,
				},
				DrawImages: false,
			},
		}, // NippleSuctionCups
		PlateClamps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight"
						},
					}
				],
				DialogPrefix: {
					Header: "ItemNipplesPlateClampsSelectTightness",
					Option: "ItemNipplesPlateClampsTightnessLevel",
					Chat: "ItemNipplesPlateClamps",
				},
				DrawImages: false,
			},
		}, // PlateClamps
		VibeNippleClamp: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // VibeNippleClamp
		TapedVibeEggs: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // TapedVibeEggs
		ShockClamps: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemNeckAccessories", AssetName: "CollarShockUnit" },
			Config: {
				DialogPrefix: {
					Header: "ItemNeckAccessoriesCollarShockUnitSelect",
					Option: "ItemNeckAccessoriesCollarShockUnit",
					Chat: "ItemNeckAccessoriesCollarShockUnitSet",
					Npc: "ItemNeckAccessoriesCollarShockUnit",
				},
			},
		}, // ShockClamps
	}, // ItemNipples
	Corset: {
		LatexCorset1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Garter",
						Property: { Type: null },
					},
					{
						Name: "Garterless",
						Property: { Type: "Garterless" },
					},
				],
				DialogPrefix: {
					Header: "LatexCorset1Select",
					Option: "LatexCorset1",
					Chat: "LatexCorset1Set",
				},
			},
		}, // LatexCorset1
	}, // Corset
	ItemTorso: {
		HeavyLatexCorset: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Normal",
						Property: { Type: null },
					},
					{
						Name: "Straps",
						Property: { Type: "Straps" },
					},
				],
				DialogPrefix: {
					Header: "SelectHeavyLatexCorsetType",
					Option: "HeavyLatexCorsetType",
					Chat: "HeavyLatexCorsetSet",
					Npc: "HeavyLatexCorset",
				},
			}
		}, // HeavyLatexCorset
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Basic",
						Property: { Type: null, Difficulty: 1 }
					}, {
						Name: "Harness1",
						BondageLevel: 2,
						Property: { Type: "Harness1" , Difficulty: 3 , Effect: ["CrotchRope"]}
					}, {
						Name: "Harness2",
						BondageLevel: 3,
						Property: { Type: "Harness2" , Difficulty: 4, Effect: ["CrotchRope"] }
					}
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
					Option: "RibbonsTorso",
					Chat: "TorsoRibbonsSet",
					Npc: "ItemTorsoRibbons",
				},
			}
		}, // Ribbons
		HighSecurityHarness: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "LowSec",
						Property: { Type: null }
					}, {
						Name: "h2", // MedSec
						Property: { Type: "h2" , Difficulty: 5 , Effect: ["CrotchRope"]}
					}, {
						Name: "h3", // MedSecBreast
						Property: { Type: "h3" , Difficulty: 5 }
					}, {
						Name: "h4", // MaxSec
						Property: { Type: "h4" , Difficulty: 10, Effect: ["CrotchRope"] }
					}
				],
				DialogPrefix: {
					Header: "HighSecurityHarnessType",
					Option: "HighSecurityHarnessType",
					Chat: "HighSecurityHarnessSet",
				},
			}
		}, // HighSecurityHarness
		LatexCorset1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Corset", AssetName: "LatexCorset1" },
		}, //LatexCorset1
		ThinLeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Crotch", Property: { Type: null } },
					{ Name: "Waist", Property: { Type: "Waist" } },
					{ Name: "Harness", Property: { Type: "Harness" } },
				]
			},
		}, // ThinLeatherStraps
		NylonRopeHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "HempRopeHarness" }
		}, // NylonRopeHarness
		HempRopeHarness: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Crotch",
						Property: { Type: null, Difficulty: 1, Effect: ["CrotchRope"] }
					}, {
						Name: "Waist",
						Property: { Type: "Waist", Difficulty: 1 }
					}, {
						Name: "Harness",
						BondageLevel: 2,
						Property: { Type: "Harness", Difficulty: 1, Effect: ["CrotchRope"] }
					}, {
						Name: "Star",
						BondageLevel: 3,
						Property: { Type: "Star", Difficulty: 2 }
					}, {
						Name: "Diamond",
						BondageLevel: 4,
						Property: { Type: "Diamond", Difficulty: 3, Effect: ["CrotchRope"] }
					},
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Chat: "RopeHarnessSet",
					Npc: "RopeBondage",
				},
			},
		}, // HempRopeHarness
		LockingSwimsuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Shiny",
						Property: {Type: null }
					},
					{
						Name: "Dull",
						Property: {Type: "Dull" }
					}
				],
			},
		}, //LockingSwimsuit
		FuturisticHarness: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Full",
						Property: { Type: null, Difficulty: 2 },
					},
					{
						Name: "Upper",
						Property: { Type: "Upper", Difficulty: 0 },
					},
					{
						Name: "Lower",
						Property: { Type: "Lower", Difficulty: 0 },
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: InventoryItemTorsoFuturisticHarnessClickHook,
					Draw: InventoryItemTorsoFuturisticHarnessDrawHook,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				},
			},
		}, // FuturisticHarness
		NavelBar1: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Jewel",
						Key: "j",
						DrawImages: false,
						Options: [
							{ Property: {} }, // j0 - Detached
							{ Property: {} }, // j1 - Attached
						],
					},
					{
						Name: "Chain",
						Key: "c",
						DrawImages: false,
						Options: [
							{ Property: {} }, // c0 - Detached
							{ Property: {} }, // c1 - Single Chain
							{ Property: {} }, // c2 - Waist Chain
						],
					},
				],
			},
		} // NavelBar1
	}, // ItemTorso
	ItemTorso2: {
		LockingSwimsuit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "LockingSwimsuit" },
		}, // LockingSwimsuit
		NylonRopeHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "HempRopeHarness" },
		}, // NylonRopeHarness
		HempRopeHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "HempRopeHarness" },
		}, // HempRopeHarness
		HighSecurityHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "HighSecurityHarness"},
		}, // HighSecurityHarness
		LatexCorset1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Corset", AssetName: "LatexCorset1" },
		}, // LatexCorset1
		HeavyLatexCorset: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "HeavyLatexCorset" },
		}, // HeavyLatexCorset
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "Ribbons" },
		}, // Ribbons
		ThinLeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "ThinLeatherStraps" },
		}, // ThinLeatherStraps
		FuturisticHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "FuturisticHarness" },
			Config: {
				DialogPrefix: {
					Header: "ItemTorsoFuturisticHarnessSelect",
					Option: "ItemTorsoFuturisticHarness",
					Chat: "ItemTorsoFuturisticHarnessSet",
				},
			}
		}, // FuturisticHarness
		NavelBar1: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemTorso", AssetName: "NavelBar1" },
		}, // NavelBar1
	}, //ItemTorso2
	Shoes: {
		FuturisticHeels2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Shiny", Property: { Type: null } },
					{ Name: "Matte", Property: { Type: "Matte" } },
				]
			},
		}, // FuturisticHeels2
	}, // Shoes
	HairAccessory1: {
		ElfEars: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "InFront",
						Property: { Type: null },
					},
					{
						Name: "Behind",
						Property: { Type: "Behind", OverridePriority: 51 },
					},
				],
				DialogPrefix: {
					Header: "HairAccessory1ElfEarsSelect",
					Option: "HairAccessory1ElfEars",
				},
			}
		}, // ElfEars
		Halo: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.TARGET_CHAR,
					CommonChatTags.ASSET_NAME,
				],
				Options: [
					{
						Name: "Default",
						Property: { Type: null },
					},
					{
						Name: "Broken",
						Property: { Type: "Broken" },
					},
				],
				ScriptHooks: {
					Load: (...args) => PropertyOpacityLoad(...args, "lightbulb"),
					Draw: (...args) => PropertyOpacityDraw(...args, 0, -50, "Brightness"),
					Exit: PropertyOpacityExit,
					Validate: PropertyOpacityValidate,
				},
				BaselineProperty: { Opacity: 0 },
			},
		}, // Halo
	}, // HairAccessory1
	HairAccessory2: {
		ElfEars: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "HairAccessory1", AssetName: "ElfEars" },
		},
	}, // HairAccessory2
	HairAccessory3: {
		Halo: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "HairAccessory1", AssetName: "Halo" },
			Config: {
				DialogPrefix: {
					Header: "HairAccessory1HaloSelect",
					Option: "HairAccessory1Halo",
					Chat: "HairAccessory1HaloSet",
					Npc: "HairAccessory1Halo",
				},
			},
		},
	}, // HairAccessory3
	ItemMouth: {
		ClothGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Small",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "Cleave",
						Property: {
							Type: "Cleave",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "Knotted",
						Property: {
							Type: "Knotted",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "OTM",
						Property: {
							Type: "OTM",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "OTN",
						Property: {
							Type: "OTN",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "ClothGagType",
					Chat: "ClothGagSet",
				},
			},
		}, // ClothGag
		ScarfGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "OTN",
						Property: {
							Type: "OTN",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "ScarfGagType",
					Chat: "ScarfGagSet",
				},
			}
		}, // ScarfGag
		WiffleGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "BallGagMouthType",
					Chat: "BallGagMouthSet",
				},
			},
		}, // WiffleGag
		BallGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Shiny",
						Property: {
							Type: "Shiny",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "BallGagMouthType",
					Chat: "BallGagMouthSet",
				},
			},
		}, // BallGag
		RopeBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "BallGagMouthType",
					Chat: "BallGagMouthSet",
				},
			},
		}, // RopeBallGag
		HarnessBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "BallGag" },
		},
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Small",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "Crossed",
						Property: {
							Type: "Crossed",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "Full",
						Property: {
							Type: "Full",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Double",
						Property: {
							Type: "Double",
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
					{
						Name: "Cover",
						Property: {
							Type: "Cover",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "DuctTapeMouthType",
					Chat: "DuctTapeMouthSet",
				},
			},
		}, // DuctTape
		HarnessBallGag1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "BallGagMouthType",
					Chat: "BallGagMouthSet",
				},
			},
		}, // HarnessBallGag1
		CupholderGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "NoCup",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Tip",
						Property: {
							Type: "Tip",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Cup",
						Property: {
							Type: "Cup",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
				],
				DialogPrefix: {
					Header: "CupholderGagOptions",
					Option: "CupholderGagOptions",
					Chat: "CupholderGagSet",
				},
				DrawImages: false,
			},
		}, // CupholderGag
		PumpGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Empty",
						Property: {
							Type: null,
							InflateLevel: 0,
							Difficulty: 0,
							Effect: ["BlockMouth"],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							InflateLevel: 1,
							Difficulty: 2,
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							InflateLevel: 2,
							Difficulty: 4,
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							InflateLevel: 3,
							Difficulty: 6,
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							InflateLevel: 4,
							Difficulty: 8,
							Effect: ["BlockMouth", "GagVeryHeavy"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectInflateLevel",
					Option: "InflateLevel",
					Chat: ({ previousIndex, newIndex }) =>
						`PumpGag${newIndex > previousIndex ? "pumps" : "deflates"}To`,
				},
				DrawImages: false,
			},
		}, // PumpGag
		PlugGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Plug",
						Property: {
							Type: "Plug",
							Effect: ["BlockMouth", "GagTotal"],
							OverrideAssetEffect: true,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "PlugGagMouthType",
					Chat: "PlugGagMouthSet",
				},
			},
		}, // PlugGag
		DildoPlugGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Plug",
						Property: {
							Type: "Plug",
							Effect: ["BlockMouth", "GagTotal2"],
							OverrideAssetEffect: true,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "PlugGagMouthType",
					Chat: "DildoPlugGagMouthSet",
				},
			},
		}, // DildoPlugGag
		MilkBottle: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Rest",
						Property: { Type: null },
					},
					{
						Name: "Raised",
						Property: { Type: "Raised" },
					},
					{
						Name: "Chug",
						Property: { Type: "Chug" },
					},
				],
				DialogPrefix: {
					Header: "SelectMilkBottleState",
					Option: "MilkBottle",
					Chat: "MilkBottleSet",
				},
			},
		}, // MilkBottle
		FunnelGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Funnel",
						Property: {
							Type: "Funnel",
							Effect: ["BlockMouth", "GagMedium", "ProtrudingMouth"],
							OverrideAssetEffect: true,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "FunnelGagMouthType",
					Chat: "FunnelGagMouthSet",
				},
			},
		}, // FunnelGag
		HarnessPonyBits: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Attached",
						Property: {
							Type: null
						},
					},
					{
						Name: "Detached",
						Property: {
							Type: "Detached",
							Effect: ["OpenMouth"],
							OverrideAssetEffect: true
						},
					},
				],
				DialogPrefix: {
					Header: "ItemMouthHarnessPonyBitsSelect",
					Option: "ItemMouthHarnessPonyBits",
					Chat: "ItemMouthHarnessPonyBitsSet",
					Npc: "ItemMouthHarnessPonyBits",
				}
			},
		}, // PonyBit
		DentalGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							Effect: ["BlockMouth", "GagMedium"],
							OverrideAssetEffect: true
						},
					},
				],
				ChangeWhenLocked: false,
			},
		}, // DentalGag
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "Bow",
						Property: {
							Type: "Bow",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
					Option: "RibbonType",
					Chat: "RibbonsGagSet",
				},
			},
		}, // Ribbons
		FuturisticMuzzle: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Nose", Key: "n",
						Options: [
							{}, // n0 - No nose
							{ // n1 - OTN
								Property: {
									Difficulty: 1,
								},
							},
						],
					},
					{
						Name: "Harness", Key: "h",
						Options: [
							{}, // h0 - No straps
							{ // h1 - Harness straps
								Property: {
									Difficulty: 1,
								},
							},
						],
					},
					{
						Name: "Symbol", Key: "s",
						Options: [
							{}, // s0 - Nothing
							{}, // s1 - Lock symbol
							{}, // s2 - Mute symbol
							{}, // s3 - X symbol
						],
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
				}
			},
		}, // FuturisticMuzzle
		OTNPlugGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Plug",
						Property: {
							Type: "Plug",
							Effect: ["BlockMouth", "GagTotal"],
							OverrideAssetEffect: true,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectGagType",
					Option: "PlugGagMouthType",
					Chat: "PlugGagMouthSet",
				},
			},
		}, // OTNPlugGag
		PonyGag: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR, CommonChatTags.DEST_CHAR],
				Modules:[
					{
						Name: "Gag", Key: "g",
						Options:[
							{ Property: { Effect: ["BlockMouth", "GagLight"] },},  //g0 - Regular BitGag
							{ Property: {},}, //g1 - No Gag
							{ Property: { Effect: ["BlockMouth", "GagMedium"] },}, //g2 - Thick BitGag
							{ Property: { Effect: ["BlockMouth", "GagHeavy"] },}, //g3 - Tongue Depresor
							{ Property: { Effect: ["BlockMouth", "GagMedium"] },}, //g4 - Ballgag
							{ Property: { Effect: ["BlockMouth", "GagVeryHeavy"], Hide: ["Mouth"] },}, //g5 - DildoGag
						],
					},
					{
						Name: "Panel", Key: "p",
						Options:[
							{}, //None
							{}, //p1 - Panel
							{}, //p2 - PanelShield
							{}, //p3 - PanelHex
							{}, //p4 - PanelSun
							{}, //p5 - PanelMoon
							{}, //p6 - PanelHeart
							{}, //p7 - PanelHorse
							{}, //p8 - PanelTriskel
							{}, //p9 - PanelPentacle
						],
					},
					{
						Name: "Reins", Key: "r",
						Options:[
							{}, //r0 - None
							{ Property: { Effect: ["Leash"] },}, //r1 - Reins
							{ Property: { Effect: ["Leash"] },}, //r2 - Rope
							{ Property: { Effect: ["Tethered", "IsChained"], Block: ["ItemAddon", "ItemDevices"] }}, //r3 - Pole
						],
					},
					{
						Name: "Top", Key: "t",
						Options:[
							{}, //t0 - None
							{}, //t1 - Plume
							{Property: { Hide: ["HairFront"]},}, //t2 - Mane Left
							{Property: { Hide: ["HairFront"]},}, //t3 - Mane Right
							{Property: { Hide: ["HairFront"]},}, //t4 - Mohawk
						],
					},
					{
						Name: "Extra", Key: "e",
						Options:[
							{}, //e0 - None
							{ Property: {Difficulty: 7}}, //e1 - ExtraStraps
							{}, //e2 - Flags
						],
					},
					{
						Name: "Horn", Key: "h",
						Options:[
							{}, //h0 - None
							{ Property: { AllowActivity: ["PenetrateItem"]},}, //h1 - Horn
							{ Property: { AllowActivity: ["PenetrateItem"]},}, //h2 - Dildocorn
						],
					},
					{
						Name: "Blinders", Key: "b",
						Options:[
							{}, //b0 - None
							{}, //b1 - Blinders
						],
					},
				],
				ChangeWhenLocked: false,
				DialogPrefix: {
					Header: "ItemMouthPonyGagSelect",
					Module: "ItemMouthPonyGagModule",
					Option: "ItemMouthPonyGagOption",
					Chat: "ItemMouthPonyGagSet",
				},
			},
		}, // PonyGag
		LatexSheathGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Thin",
						Property: { Type: null, Effect: ["OpenMouth",], },
					},
					{
						Name: "Thick",
						Property: { Type: "Thick", Effect: ["OpenMouth", "GagVeryLight"],},
					},
					{
						Name: "VeryThick",
						Property: { Type: "VeryThick", Effect: ["OpenMouth", "GagMedium"],},
					},
				],
				DrawImages: false,
			},
		}, //LatexSheathGag
		FuturisticPanelGag: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.ASSET_NAME,
					CommonChatTags.DEST_CHAR,
					CommonChatTags.DEST_CHAR_NAME,
				],
				Modules: [
					{
						Name: "Gag", Key: "g",
						DrawImages: true,
						Options: [
							{ Property: { OriginalSetting: 0, Effect: ["BlockMouth"] } }, // g0 - Padded
							{ Property: { OriginalSetting: 1, Effect: ["BlockMouth", "GagVeryLight"] } }, // g1 - LightBall
							{ Property: { OriginalSetting: 2, Effect: ["BlockMouth", "GagMedium"] } }, // g2 - Ball
							{ Property: { OriginalSetting: 3, Effect: ["BlockMouth", "GagTotal"] } }, // g3 - Plug
						],
					},
					{
						Name: "AutoPunish", Key: "p",
						DrawImages: false,
						Options: [
							{ Property: { AutoPunish: 0 } }, // p0 - Off
							{ Property: { AutoPunish: 1 } }, // p1 - Low
							{ Property: { AutoPunish: 2 } }, // p2 - Medium
							{ Property: { AutoPunish: 3 } }, // p3 - Maximum
						],
					},
					{
						Name: "DeflationTime", Key: "t",
						DrawImages: false,
						Options: [
							{ Property: { AutoPunishUndoTimeSetting: 120000 } }, // t0 - 2 min
							{ Property: { AutoPunishUndoTimeSetting: 300000 } }, // t1 - 5 min
							{ Property: { AutoPunishUndoTimeSetting: 900000 } }, // t2 - 15 min
							{ Property: { AutoPunishUndoTimeSetting: 3600000 } }, // t3 - 1 hour
							{ Property: { AutoPunishUndoTimeSetting: 72000000 } }, // t4 - 24 hours
						],
					},
				],
				BaselineProperty: { ShowText: true, BlinkState: false, AutoPunishUndoTime: 0 },
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: InventoryItemMouthFuturisticPanelGagClickHook,
					Draw: InventoryItemMouthFuturisticPanelGagDrawHook,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				},
				DialogPrefix: {
					Header: "ItemMouthFuturisticPanelGagSelect",
					Module: "ItemMouthFuturisticPanelGagModule",
					Option: "ItemMouthFuturisticPanelGagOption",
					Chat: "ItemMouthFuturisticPanelGagSet",
				},
			},
		}, // FuturisticPanelGag
		FuturisticHarnessPanelGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticPanelGag" },
		}, // FuturisticHarnessPanelGag
		FuturisticHarnessBallGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticPanelGag" },
			Config: {
				Modules: [
					{
						Name: "Gag", Key: "g",
						DrawImages: true,
						Options: [
							{ Property: { OriginalSetting: 0, Effect: ["BlockMouth", "GagLight"] } }, // g0 - LightBall
							{ Property: { OriginalSetting: 1, Effect: ["BlockMouth", "GagMedium"] } }, // g1 - Ball
							{ Property: { OriginalSetting: 2, Effect: ["BlockMouth", "GagTotal"] } }, // g2 - Plug
						],
					},
					{
						Name: "AutoPunish", Key: "p",
						DrawImages: false,
						Options: [
							{ Property: { AutoPunish: 0 } }, // p0 - Off
							{ Property: { AutoPunish: 1 } }, // p1 - Low
							{ Property: { AutoPunish: 2 } }, // p2 - Medium
							{ Property: { AutoPunish: 3 } }, // p3 - Maximum
						],
					},
					{
						Name: "DeflationTime", Key: "t",
						DrawImages: false,
						Options: [
							{ Property: { AutoPunishUndoTimeSetting: 120000 } }, // t0 - 2 min
							{ Property: { AutoPunishUndoTimeSetting: 300000 } }, // t1 - 5 min
							{ Property: { AutoPunishUndoTimeSetting: 900000 } }, // t2 - 15 min
							{ Property: { AutoPunishUndoTimeSetting: 3600000 } }, // t3 - 1 hour
							{ Property: { AutoPunishUndoTimeSetting: 72000000 } }, // t4 - 24 hours
						],
					},
				],
				DialogPrefix: {
					Header: "ItemMouthFuturisticPanelGagSelect",
					Module: "ItemMouthFuturisticPanelGagModule",
					Option: "ItemMouthFuturisticHarnessBallGagOption",
					Chat: "ItemMouthFuturisticHarnessBallGagSet",
				},
			},
		}, // FuturisticHarnessBallGag
	}, // ItemMouth
	ItemMouth2: {
		ClothGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "ClothGag" },
		},
		ScarfGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "ScarfGag" },
		},
		WiffleGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "WiffleGag" },
		},
		BallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		RopeBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "RopeBallGag" },
		},
		HarnessBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		HarnessPonyBits: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "HarnessPonyBits" },
		},
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "DuctTape" },
		},
		HarnessBallGag1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "HarnessBallGag1" },
		},
		CupholderGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "CupholderGag" },
		},
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "Ribbons" },
		},
		FuturisticMuzzle: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticMuzzle" },
		},
		PonyGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "PonyGag" },
		},
		FuturisticPanelGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticPanelGag" },
		},
		FuturisticHarnessPanelGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticHarnessPanelGag" },
		},
		FuturisticHarnessBallGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticHarnessBallGag" },
		},
	}, // ItemMouth2
	ItemMouth3: {
		ClothGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "ClothGag" },
		},
		ScarfGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "ScarfGag" },
		},
		WiffleGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "WiffleGag" },
		},
		BallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		RopeBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "RopeBallGag" },
		},
		HarnessBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		HarnessPonyBits: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "HarnessPonyBits" },
		},
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "DuctTape" },
		},
		HarnessBallGag1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "HarnessBallGag1" },
		},
		CupholderGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "CupholderGag" },
		},
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "Ribbons" },
		},
		FuturisticMuzzle: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticMuzzle" },
		},
		PonyGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "PonyGag" },
		},
		FuturisticPanelGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticPanelGag" },
		},
		FuturisticHarnessPanelGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticHarnessPanelGag" },
		},
		FuturisticHarnessBallGag: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "FuturisticHarnessBallGag" },
		},
		Stitches: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options:[
					{
						Name: "Straight",
						Property: {Type: "Straight",}
					},
					{
						Name: "ZigZag",
						Property: {Type: "ZigZag",}
					},
					{
						Name: "Skewed",
						Property: {Type: "Skewed",}
					},
					{
						Name: "Cross",
						Property: {Type: "Cross",}
					},
				],
			},
		}, //StitchGag
		LatexRespirator: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Filter", Key: "f",
						Options: [{}, {}, {}, {}, ] // None,Filter,SmallTubes,LargeTubes
					},
					{
						Name: "Glow", Key: "g",
						Options: [ {}, {},] //  Glow off or on
					},
					{
						Name: "Straps", Key: "s",
						Options: [ {}, {},] // No Straps, Straps
					},
					{
						Name: "Mask", Key: "m",
						Options: [
							{Property: {Effect: ["BlockMouth"]}},
							{Property: {Effect: ["BlockMouth", "GagVeryLight"]}},
							{Property: {Effect:[""]}},
						] // Mask, Thick Filters, No Mask
					},
					{
						Name: "Length", Key: "l",
						Options: [{},{}] // Behind Hair, Over Hair
					},
				]
			}
		}, //LatexRespirator
		PaddedFaceMask:{
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Thickness", Key: "t",
						Options:[
							{
								Property: {Effect: ["BlockMouth"]}
							},
							{
								Property: {Effect: ["BlockMouth", "GagLight"]}
							},
						]
					},
					{
						Name: "Pattern", Key: "p",
						Options:[{},{},{}] //None, Lips, Heart
					},
				]
			}
		}, //PaddedFaceMask
	}, // ItemMouth3
	Mask: {
		BunnyMask1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Ears",
						Property: { Type: null },
					},
					{
						Name: "Earless",
						Property: { Type: "Earless", OverridePriority: 51 },
					},
				],
				DialogPrefix: {
					Header: "SelectBunnyMaskStyle",
					Option: "BunnyMaskType",
				},
			}
		}, // BunnyMask1
		OpenFaceHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "HideBackHair",
						Property: { Type: "HideBackHair", Hide: ["HairBack"] },
					},
					{
						Name: "ShowBackHair",
						Property: { Type: null },
					},
				],
				DialogPrefix: {
					Header: "SelectOpenFaceHoodStyle",
					Option: "OpenFaceHoodStyle",
				},
				DrawImages: false,
			}
		}, // OpenFaceHood
		PetNose: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{ Name: "Nose", Key: "n",
						Options: [
							{}, // n0 - Nose
							{}, // n1 - No Nose
						]
					},
					{ Name: "Cheeks", Key: "c",
						Options: [
							{}, // c0 - No Cheeks
							{}, // c1 - Small Cheeks
							{}, // c2 - Big Cheeks
						]
					},
					{ Name: "Whiskers", Key: "w",
						Options: [
							{}, // w0 - No Whiskers
							{}, // w1 - Short Whiskers
							{}, // w2 - Long Whiskers
						]
					},
					{ Name: "Mouth", Key: "m",
						Options: [
							{}, // m0 - Show Mouth
							{ Property: { Hide: ["Mouth"] } }, // m1 - Hide Mouth
						]
					},
				],
			},
		}, //PetNose
		Glitter: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options:[
					{
						Name: "Freckles",
						Property: {Type: null,}
					},
					{
						Name: "MidFreckles",
						Property: {Type: "MidFreckles",}
					},
					{
						Name: "SplitFreckles",
						Property: {Type: "SplitFreckles",}
					},
					{
						Name: "FrecklesSmall",
						Property: {Type: "FrecklesSmall",}
					},
					{
						Name: "MidFrecklesSmall",
						Property: {Type: "MidFrecklesSmall",}
					},
					{
						Name: "SplitFrecklesSmall",
						Property: {Type: "SplitFrecklesSmall",}
					},
					{
						Name: "StarsBoth",
						Property: {Type: "StarsBoth",}
					},
					{
						Name: "StarsLeft",
						Property: {Type: "StarsLeft",}
					},
					{
						Name: "StarsRight",
						Property: {Type: "StarsRight",}
					},
					{
						Name: "DotsBoth",
						Property: {Type: "DotsBoth",}
					},
					{
						Name: "DotsLeft",
						Property: {Type: "DotsLeft",}
					},
					{
						Name: "DotsRight",
						Property: {Type: "DotsRight",}
					},
				],
			},
		}, //Glitter
		HeadHarness: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options:[
					{
						Name: "Simple",
						Property: {Type: null,}
					},
					{
						Name: "Heavy",
						Property: {Type: "Heavy",}

					},
				],
			},
		}, //HeadHarness
		Kissmark: {
			Archetype: ExtendedArchetype.MODULAR,
			            CopyConfig: { GroupName: "ClothAccessory", AssetName: "Kissmark" },
			Config: {
			    DialogPrefix: {
					Header: "ClothAccessoryKissmarkSelect",
					Module: "ClothAccessoryKissmarkModule",
					Option: "ClothAccessoryKissmarkOption",
					Chat: "ClothAccessoryKissmarkSet",
				},
			},
		}, //KissMark
		SwimCap: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "Hat", AssetName: "SwimCap" },
		},
	}, // Mask
	ItemLegs: {
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Legs",
						Property: { Type: null, Difficulty: 0 }
					}, {
						Name: "HalfLegs",
						Prerequisite: ["NoClothLower"],
						Property: { Type: "HalfLegs", Hide: ["ClothLower", "Garters"], Difficulty: 2 }
					}, {
						Name: "MostLegs",
						Prerequisite: ["NoClothLower"],
						Property: { Type: "MostLegs", Hide: ["ClothLower", "Garters"], Difficulty: 4, HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], }
					}, {
						Name: "CompleteLegs",
						Prerequisite: ["NoClothLower"],
						Property: { Type: "CompleteLegs", Hide: ["ClothLower", "Garters"], Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Difficulty: 6, HideItem: ["PantiesPoofyDiaper", "PantiesBulkyDiaper", "ItemPelvisPoofyDiaper", "ItemPelvisBulkyDiaper"], }
					}, {
						Name: "PetLegs",
						Prerequisite: ["NoClothLower", "NotSuspended", "CanKneel"],
						Property: { Type: "PetLegs", Hide: ["ClothLower", "Garters"], SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 6 },
						Random: false,
					}, {
						Name: "CutOut",
						Prerequisite: ["NoClothLower"],
						Property: { Type: "CutOut", Hide: ["ClothLower", "Garters"], Difficulty: 6 }
					}
				],
				DialogPrefix: {
					Header: "SelectTapeWrapping",
					Option: "DuctTapePose",
					Chat: "DuctTapeRestrain",
					Npc: "DuctTapePose",
				},
			},
		}, // DuctTape
		NylonRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Knees",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
						Prerequisite: ["CanCloseLegs"],
					},
					{
						Name: "Thighs",
						Property: { Type: "Thighs", SetPose: ["LegsClosed"], Difficulty: 1 },
						Prerequisite: ["CanCloseLegs"],
					},
					{
						Name: "KneesThighs",
						Property: { Type: "KneesThighs", SetPose: ["LegsClosed"], Difficulty: 2 },
						Prerequisite: ["CanCloseLegs"],
					},
					{
						Name: "Frogtie",
						BondageLevel: 3,
						Property: { Type: "Frogtie", SetPose: ["Kneel"], AllowActivePose: ["Kneel", "KneelingSpread"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
						Prerequisite: ["NotSuspended", "CanKneel"],
						Random: false,
					},
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Chat: "LegRopeSet",
					Npc: "RopeBondage",
				},
			}
		}, // NylonRope
		HempRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
						Prerequisite: ["CanCloseLegs"],
					}, {
						Name: "FullBinding",
						BondageLevel: 2,
						Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 },
						Prerequisite: ["CanCloseLegs"],
					}, {
						Name: "Link",
						BondageLevel: 2,
						Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 },
						Prerequisite: ["CanCloseLegs"],
					}, {
						Name: "Frogtie",
						BondageLevel: 3,
						Property: { Type: "Frogtie", SetPose: ["Kneel"], AllowActivePose: ["Kneel", "KneelingSpread"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
						Prerequisite: ["NotSuspended", "CanKneel"],
						Random: false,
					}, {
						Name: "Crossed",
						BondageLevel: 4,
						Property: { Type: "Crossed", SetPose: ["LegsClosed"], Difficulty: 4 },
						Prerequisite: ["CanCloseLegs"],
					}, {
						Name: "Mermaid",
						BondageLevel: 4,
						Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 },
						Prerequisite: ["CanCloseLegs"],
					}
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Chat: "LegRopeSet",
					Npc: "RopeBondage",
				},
			}
		}, // HempRope
		Chains: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						BondageLevel: 0,
						Property: { Type: null, Difficulty: 0 }
					}, {
						Name: "Strict",
						BondageLevel: 2,
						Property: { Type: "Strict", Difficulty: 2 }
					}
				],
				DialogPrefix: {
					Header: "SelectChainBondage",
					Option: "ChainBondage",
					Chat: "LegChainSet",
					Npc: "ChainBondage",
				},
				ChangeWhenLocked: false,
			}
		}, // Chains
		SturdyLeatherBelts: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemArms", AssetName: "SturdyLeatherBelts" },
			Config: {
				Options: [
					{
						Name: "One",
						Property: { Type: null, },
					},
					{
						Name: "Two",
						Property: { Type: "Two", Difficulty: 2, },
					},
				],
			}
		}, // SturdyLeatherBelts
		FuturisticLegCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "None",
						Property: { Type: null },
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							SetPose: ["LegsClosed"],
							Effect: ["Prone", "KneelFreeze", "Slow"],
							FreezeActivePose: ["BodyLower"],
							Difficulty: 6,
						},
						Prerequisite: ["CanCloseLegs"],
					},
					{
						Name: "Chained",
						Property: {
							Type: "Chained", Effect: ["Slow"],
						},
						Prerequisite: ["NotHorse"],
					}
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemLegsLeatherLegCuffs",
					Chat: "FuturisticLegCuffsRestrain",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			}
		}, // FuturisticLegCuffs
		LeatherLegCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "None",
						Property: { Type: null },
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							SetPose: ["LegsClosed"],
							Effect: ["Prone", "KneelFreeze", "Slow"],
							AllowActivePose: ["Kneel", "LegsClosed"],
							Difficulty: 6,
						},
						Prerequisite: ["CanCloseLegs"],
					},
					{
						Name: "Chained",
						Property: {
							Type: "Chained", Effect: ["Slow"],
						},
						Prerequisite: ["NotHorse"],
					}
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
				}
			}
		}, // LeatherLegCuffs
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Messystyle",
						Property: { Type: null, Difficulty: 3 },
					},
					{
						Name: "MessyWrap",
						Property: { Type: "MessyWrap", Difficulty: 4 },
					},
					{
						Name: "Cross",
						Property: { Type: "Cross", Difficulty: 5 },
					},
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
				}
			}
		}, // Ribbons
		OrnateLegCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LeatherLegCuffs" },
		}, // OrnateLegCuffs
		Zipties: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "ZipLegLight",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
					}, {
						Name: "ZipLegMedium",
						Property: { Type: "ZipLegMedium", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "ZipLegFull",
						Property: { Type: "ZipLegFull", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "ZipFrogtie",
						Property: { Type: "ZipFrogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
						Prerequisite: ["NotSuspended", "CanKneel"],
						Random: false,
					}
				],
				DialogPrefix: {
					Header: "SelectZipTie",
					Option: "ZipBondage",
					Npc: "Zip",
				}
			}
		}, // Zipties
		MermaidTail: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // MermaidTail
	}, // ItemLegs
	ItemFeet: {
		SpreaderMetal: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Narrow",
						Property: {
							Type: null, Effect: ["Prone", "Freeze"], SetPose: ["LegsOpen"],
						}
					},
					{
						Name: "Wide",
						Property: {
							Type: "Wide", Effect: ["Prone", "Freeze"], SetPose: ["Spread"],
						}
					}
				],
				DialogPrefix: {
					Header: "SelectSpreaderType",
					Option: "SpreaderMetalPose",
				},
				ChatSetting: TypedItemChatSetting.SILENT,
			}
		}, // SpreaderMetal
		Chains: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						BondageLevel: 0,
						Property: { Type: null, Difficulty: 0, SetPose: ["LegsClosed"] },
					},
					{
						Name: "Strict",
						BondageLevel: 2,
						Property: { Type: "Strict", Difficulty: 2, SetPose: ["LegsClosed"] },
					},
					{
						Name: "Suspension",
						BondageLevel: 6,
						Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"],
						Property: {
							Type: "Suspension",
							Difficulty: 4,
							SetPose: ["Suspension", "LegsClosed"],
							AllowActivePose: [],
						},
						Random: false,
					},
				],
				DialogPrefix: {
					Header: "SelectChainBondage",
					Option: "ChainBondage",
					Chat: "LegChainSet",
					Npc: "ChainBondage",
				},
				ChangeWhenLocked: false,
			}
		}, // Chains
		FuturisticAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "None",
						Property: {
							Type: null, SetPose: [], Difficulty: 0, Effect: [], FreezeActivePose: [],
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6, FreezeActivePose: ["BodyLower"],
						}
					},
					{
						Name: "Chained",
						Property: {
							Type: "Chained", Effect: ["Slow"],
						}
					}
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemFeetSteelAnkleCuffs",
					Chat: "FuturisticAnkleCuffsRestrain",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			}
		}, // FuturisticAnkleCuffs
		SteelAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "None",
						Property: {
							Type: null, SetPose: [], Difficulty: 0, Effect: [], FreezeActivePose: [],
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6, FreezeActivePose: ["BodyLower"],
						}
					},
					{
						Name: "Chained",
						Property: {
							Type: "Chained", Effect: ["Slow"],
						}
					}
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemFeetSteelAnkleCuffs",
					Chat: "ItemFeetSteelAnkleCuffsSet",
				}
			}
		}, // SteelAnkleCuffs
		SturdyLeatherBelts: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemArms", AssetName: "SturdyLeatherBelts" },
		}, // SturdyLeatherBelts
		LeatherAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SteelAnkleCuffs" },
		}, // LeatherAnkleCuffs
		OrnateAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SteelAnkleCuffs" },
		}, // OrnateAnkleCuffs
		HighStyleSteelAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SteelAnkleCuffs" },
		}, // HighStyleSteelAnkleCuffs
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Feet",
						Property: {
							Type: null,
							Difficulty: 0,
							Hide: [],
							SetPose: ["LegsClosed"],
						},
					},
					{
						Name: "HalfFeet",
						Property: {
							Type: "HalfFeet",
							Difficulty: 2,
							Hide: ["ClothLower", "Shoes"],
							SetPose: ["LegsClosed"],
						},
					},
					{
						Name: "MostFeet",
						Property: {
							Type: "MostFeet",
							Difficulty: 4,
							Hide: ["ClothLower", "Shoes"],
							SetPose: ["LegsClosed"],
						},
					},
					{
						Name: "CompleteFeet",
						Property: {
							Type: "CompleteFeet",
							Difficulty: 6,
							Hide: ["ClothLower", "Shoes"],
							SetPose: ["LegsClosed"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectTapeWrapping",
					Chat: "DuctTapeRestrain",
					Npc: "DuctTapeRestrain",
					Option: "DuctTapePose",
				}
			},
		}, // DuctTape
		Zipties: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "ZipFeetLight",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
					}, {
						Name: "ZipFeetMedium",
						Property: { Type: "ZipFeetMedium", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "ZipFeetFull",
						Property: { Type: "ZipFeetFull", SetPose: ["LegsClosed"], Difficulty: 2 }
					}
				],
				DialogPrefix: {
					Header: "SelectZipTie",
					Chat: "ZipFeetSet",
					Npc: "ZipFeetSet",
					Option: "ZipBondage",
				},
			},
		}, // Zipties
		Tentacles: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Closed",
						Property: {Type: null, SetPose: ["LegsClosed"]},
					},
					{
						Name: "Spread",
						Prerequisite: ["NoItemLegs", "LegsOpen"],
						Property: {
							Type: "Spread",
							OverridePriority: 25,
							SetPose: ["Spread"],
							Effect: ["Freeze", "Prone", "BlockKneel"],
							Block: ["ItemLegs", "ItemBoots", "ItemDevices"],
							OverrideHeight: {Height: 0, Priority: 60},
						},
					},
				],
			},
		}, // Tentacles
		WoodenCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "LegsOpen",
						Property: {
							Type: null,
							Difficulty: 2,
							Effect: ["Freeze", "Prone"],
							SetPose: ["LegsOpen"],
							SelfUnlock: true,
						},
					},
					{
						Name: "Spread2",
						Property: {
							Type: "Spread2",
							Difficulty: 3,
							Effect: ["Freeze", "Prone"],
							SetPose: ["Spread"],
							SelfUnlock: true,
						},
					},
					{
						Name: "Spread3",
						Property: {
							Type: "Spread3",
							Difficulty: 3,
							Effect: ["Freeze", "Prone"],
							SetPose: ["LegsClosed"],
							SelfUnlock: true,
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBondagePosition",
					Option: "ItemFeetWoodenCuffs",
				},
			},
		}, // WoodenCuffs
		NylonRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Ankles",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
					},
					{
						Name: "Knees",
						Property: { Type: "Knees", SetPose: ["LegsClosed"], Difficulty: 1 },
					},
					{
						Name: "AnklesKnees",
						Property: { Type: "AnklesKnees", SetPose: ["LegsClosed"], Difficulty: 2 },
					},
					{
						Name: "BedSpreadEagle",
						BondageLevel: 1,
						Property: {
							Type: "BedSpreadEagle",
							Effect: ["Freeze", "Prone"],
							Block: ["ItemLegs", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemBoots"],
							SetPose: ["Spread"],
							Difficulty: 5
						},
						Prerequisite: ["OnBed", "NoItemLegs", "LegsOpen"],
					}
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Npc: "RopeBondage",
					Chat: "FeetRopeSet",
				},
			},
		}, // NylonRope
		HempRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
					}, {
						Name: "FullBinding",
						BondageLevel: 2,
						Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "Link",
						BondageLevel: 2,
						Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "Diamond",
						BondageLevel: 4,
						Property: { Type: "Diamond", SetPose: ["LegsClosed"], Difficulty: 4 }
					}, {
						Name: "Mermaid",
						BondageLevel: 4,
						Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 }
					}, {
						Name: "Suspension",
						BondageLevel: 6,
						Property: {
							Type: "Suspension",
							SetPose: ["LegsClosed", "Suspension"],
							AllowActivePose: [],
							Difficulty: 6
						},
						Expression: [{ Group: "Blush", Name: "High", Timer: 30 }],
						Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"]
					}, {
						Name: "BedSpreadEagle",
						BondageLevel: 1,
						Property: {
							Type: "BedSpreadEagle",
							Effect: ["Freeze", "Prone"],
							Block: ["ItemLegs", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemBoots"],
							SetPose: ["Spread"],
							Difficulty: 5
						},
						Prerequisite: ["OnBed", "NoItemLegs", "LegsOpen"],
					}
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Npc: "RopeBondage",
					Chat: "LegRopeSet",
				}
			},
		},
		SpreaderVibratingDildoBar: {
			Archetype: ExtendedArchetype.VIBRATING,
		}, // SpreaderVibratingDildoBar
	}, // ItemFeet
	ItemMisc: {
		ServingTray: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Empty", Property: { Type: null } },
					{ Name: "Drinks", Property: { Type: "Drinks" } },
					{ Name: "Cake", Property: { Type: "Cake" } },
					{ Name: "Cookies", Property: { Type: "Cookies" } },
					{ Name: "Toys", Property: { Type: "Toys" } },
				],
			},
		}, // WoodenMaidTray
		TeddyBear: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Bear",
						Property: { Type: null },
					},
					{
						Name: "Fox",
						Property: { Type: "Fox" },
					},
					{
						Name: "Pup",
						Property: { Type: "Pup" },
					},
					{
						Name: "Pony",
						Property: { Type: "Pony" },
					},
					{
						Name: "Kitty",
						Property: { Type: "Kitty" },
					},
					{
						Name: "Bunny",
						Property: { Type: "Bunny" },
					},
				],
			},
		}, // TeddyBear
		PetPost: {
			Archetype: ExtendedArchetype.MODULAR,
			CopyConfig: { GroupName: "ItemNeckRestraints", AssetName: "PetPost" },
			Config:{
				Modules: [
					{
						Name: "Plaque", Key: "p",
						Options: [
							{}, //p0 - Border
							{}, //p1 - Border
						]
					},
					{
						Name: "Dirt", Key: "d",
						Options: [
							{}, //d0 - Clean
							{}, //d1 - Dirty
						]
					},
					{
						Name: "Sticker", Key: "s",
						Options: [
							{}, //s0 - Paw
							{}, //s1 - Triskel
							{}, //s2 - Moon
							{}, //s3 - LGBT
							{}, //s4 - Trans
							{}, //s5 - Bi
							{}, //s6 - NoSwim
							{}, //s7 - None
						]
					},
					{
						Name: "PostIt", Key: "m",
						Options: [
							{}, //m0 - Postit
							{}, //m1 - No PostIt
						]
					},
					{
						Name: "Txt", Key: "x",
						Options: [{ HasSubscreen: true }],
					},
				],
				DialogPrefix: {
					Chat: "ItemNeckRestraintsPetPostSet",
				}
			},
		},//PetPost
	}, // ItemMisc
	ItemPelvis: {
		FuturisticChastityBelt: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Model", Key: "m",
						Options: [
							{},
							{},
							{},
							{},
						],
					},
					{
						Name: "Front", Key: "f",
						Options: [
							{
								Property: {
								},
							},
							{
								Property: {
									Block: ["ItemVulva", "ItemVulvaPiercings"],
									Effect: ["Chaste"],
								},
							},
						],
					},
					{
						Name: "Back", Key: "b",
						Options: [
							{
								Property: {
								},
							},
							{
								Property: {
									Block: ["ItemButt"],
								},
							},
						],
					},
					{
						Name: "Tamper", Key: "t",
						Options: [
							{},
							{},
							{},
						],
					},
					{
						Name: "Orgasm", Key: "o",
						Options: [
							{},
							{},
						],
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
				}
			},
		}, // FuturisticChastityBelt
		MetalChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "OpenBack",
						Property: {
							Type: null,
							Block: [],
						},
					},
					{
						Name: "ClosedBack",
						Property: {
							Type: "ClosedBack",
							Block: ["ItemButt"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectBackShield",
					Option: "Chastity",
					Npc: "Chastity",
					Chat: "ChastityBeltBackShield",
				},
				ChangeWhenLocked: false,
			},
		}, // MetalChastityBelt
		OrnateChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "MetalChastityBelt" },
		}, // OrnateChastityBelt
		StuddedChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "MetalChastityBelt" },
		}, // StuddedChastityBelt
		PolishedChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "MetalChastityBelt" },
		}, // PolishedChastityBelt
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "BowWrap",
						Property: { Type: null, Difficulty: 3, OverridePriority: 21 },
					},
					{
						Name: "CrotchWrapping",
						Property: { Type: "CrotchWrapping", Difficulty: 4 },
					},
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
					Option: "RibbonsBelt",
					Npc: "ItemPelvisRibbons",
					Chat: "PelvisRibbonsSet",
				}
			},
		}, // Ribbons
		HempRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Crotch",
						Property: { Type: null, Difficulty: 1, Effect: ["CrotchRope"] }
					}, {
						Name: "OverPanties",
						Property: { Type: "OverPanties", Difficulty: 1, OverridePriority: 21, Effect: ["CrotchRope"] }
					}, {
						Name: "SwissSeat",
						BondageLevel: 4,
						Property: { Type: "SwissSeat", Difficulty: 4 }
					}, {
						Name: "KikkouHip",
						BondageLevel: 5,
						Property: { Type: "KikkouHip", Difficulty: 5 }
					}
				],
				DialogPrefix: {
					Header: "SelectRopeBondage",
					Option: "RopeBondage",
					Npc: "RopeBondage",
					Chat: "PelvisRopeSet",
				}
			},
		}, // HempRope
		PoofyDiaper: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.DEST_CHAR_NAME],
				Options: [
					{
						Name: "RegularPadding",
						Property: { Type: null, },
					},
					{
						Name: "Poofy",
						Property: { Type: "Poofy", HideItem: ["ClothLowerSkirt3", "ClothLowerTennisSkirt1"] },
					},
				],
			},
		}, // PoofyDiaper
		ObedienceBelt: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				ChangeWhenLocked: false,
				Modules: [
					{
						Name: "CrotchShield", Key: "c",
						Options: [
							{}, // 0 - open
							{ // 1 - close front
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemVulva", "ItemVulvaPiercings"],
								}
							},
							{ // 2 - close back
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemButt"],
								}
							},
							{ // 3 - close both
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
								}
							}
						],
					},
					{
						Name: "ShockModule", Key: "s",
						Options: [
							{}, // 0 - disabled
							{ HasSubscreen: true }, // 1 - enabled
						]
					},
					{
						Name: "Engraving", Key: "e",
						Options: [
							{ HasSubscreen: true },
						],
					}
				],
				BaselineProperty: { Text: "", ShowText: false, PunishOrgasm: false, PunishStandup: false, NextShockTime: 0 },
			},
		},
		SciFiPleasurePanties: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
					CommonChatTags.DEST_CHAR_NAME,
					CommonChatTags.ASSET_NAME,
				],
				Modules: [
					{
						Name: "CrotchShield", Key: "c",
						DrawImages: false,
						Options: [
							{}, // 0 - open
							{ // 1 - close front
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemVulva", "ItemVulvaPiercings"],
								},
							},
							{ // 2 - close back
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemButt"],
								},
							},
							{ // 3 - close both
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
								},
							},
						],
					},
					{
						Name: "Intensity", Key: "i",
						DrawImages: false,
						Options: [
							{ Property: { Intensity: -1, Effect: ["Egged"] } }, // i0 - Turn Off
							{ Property: { Intensity: 0, Effect: ["Egged", "Vibrating"] } }, // i1 - Low
							{ Property: { Intensity: 1, Effect: ["Egged", "Vibrating"] } }, // i2 - Medium
							{ Property: { Intensity: 2, Effect: ["Egged", "Vibrating"] } }, // i3 - High
							{ Property: { Intensity: 3, Effect: ["Egged", "Vibrating"] } }, // i4 - Maximum
						],
					},
					{
						Name: "OrgasmLock", Key: "o",
						DrawImages: false,
						Options: [
							{}, // o0 - Normal
							{ Property: { Effect: ["DenialMode"] } }, // o1 - Edge
							{ Property: { Effect: ["DenialMode", "RuinOrgasms"] } }, // o2 - Deny
						],
					},
					{
						Name: "ShockLevel", Key: "s",
						DrawImages: false,
						Options: [
							{ Property: { ShockLevel: 0 } }, // s0 - Level 1
							{ Property: { ShockLevel: 1 } }, // s1 - Level 2
							{ Property: { ShockLevel: 2 } }, // s2 - Level 3
						],
					},
				],
				BaselineProperty: { ShowText: true },
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: InventoryItemPelvisSciFiPleasurePantiesClickHook,
					Draw: InventoryItemPelvisSciFiPleasurePantiesDrawHook,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				},
				DialogPrefix: {
					Chat: InventoryItemPelvisSciFiPleasurePantiesChatPrefix,
				},
			},
		},
		LoveChastityBelt: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatTags: [
					CommonChatTags.SOURCE_CHAR,
					CommonChatTags.DEST_CHAR,
					CommonChatTags.ASSET_NAME,
				],
				Modules: [
					{
						Name: "FrontShield", Key: "f",
						DrawImages: false,
						Options: [
							{ // 0 - open
								Expression: [{ Name: "Low", Group: "Blush", Timer: 10 }],
							},
							{ // 1 - close front
								Expression: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemVulva", "ItemVulvaPiercings"],
								},
							},
							{ // 2 - close front & vibrator
								Expression: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
								Property: {
									Effect: ["Chaste", "Egged"],
									Block: ["ItemVulva", "ItemVulvaPiercings"],
								},
							},
							{ // 3 - close front & shock unit
								Expression: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemVulva", "ItemVulvaPiercings"],
								},
							},
						],
					},
					{
						Name: "BackShield", Key: "b",
						DrawImages: false,
						Options: [
							{}, // 0 - open
							{ // 1 - closed
								Property: {
									Effect: ["Chaste"],
									Block: ["ItemButt"],
								},
							},
						],
					},
					{
						Name: "Intensity", Key: "i",
						DrawImages: false,
						Options: [
							{ Property: { Intensity: -1 } }, // i0 - Turn Off
							{ Property: { Intensity: 0, Effect: ["Vibrating"] } }, // i1 - Low
							{ Property: { Intensity: 1, Effect: ["Vibrating"] } }, // i2 - Medium
							{ Property: { Intensity: 2, Effect: ["Vibrating"] } }, // i3 - High
							{ Property: { Intensity: 3, Effect: ["Vibrating"] } }, // i4 - Maximum
						],
					},
					{
						Name: "ShockLevel", Key: "s",
						DrawImages: false,
						Options: [
							{ Property: { ShockLevel: 0 } }, // s0 - Level 1
							{ Property: { ShockLevel: 1 } }, // s1 - Level 2
							{ Property: { ShockLevel: 2 } }, // s2 - Level 3
						],
					},
				],
				BaselineProperty: { ShowText: true },
				ScriptHooks: {
					Click: InventoryItemPelvisLoveChastityBeltClick,
					Draw: InventoryItemPelvisLoveChastityBeltDraw,
					Validate: InventoryItemPelvisLoveChastityBeltValidate,
				},
				DialogPrefix: {
					Chat: InventoryItemPelvisSciFiPleasurePantiesChatPrefix,
				},
			},
		}, // LoveChastityBelt
	}, // ItemPelvis
	ItemEars: {
		FuturisticEarphones: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "Off",
						Property: {
							Type: null,
							Effect: [],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							Effect: ["DeafLight"],
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							Effect: ["DeafHeavy"],
						},
					},
					{
						Name: "NoiseCancelling",
						Property: {
							Type: "NoiseCancelling",
							Effect: ["DeafTotal"],
						},
					},
				],
				DialogPrefix: {
					Header: "HeadphoneEarPlugsSelectLoudness",
					Option: "HeadphoneEarPlugsPose",
					Chat: "HeadphoneEarPlugsRestrain",
					Npc: "ItemEarsHeadphonePlugs",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticEarphones
		HeadphoneEarPlugs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "Off",
						Property: {
							Type: null,
							Effect: [],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							Effect: ["DeafLight"],
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							Effect: ["DeafHeavy"],
						},
					},
					{
						Name: "NoiseCancelling",
						Property: {
							Type: "NoiseCancelling",
							Effect: ["DeafTotal"],
						},
					},
				],
				DialogPrefix: {
					Header: "HeadphoneEarPlugsSelectLoudness",
					Option: "HeadphoneEarPlugsPose",
					Chat: "HeadphoneEarPlugsRestrain",
					Npc: "ItemEarsHeadphonePlugs",
				}
			},
		}, // HeadphoneEarPlugs
		Headphones: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "HeadphoneEarPlugs" },
		}, // Headphones
		BluetoothEarbuds: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "HeadphoneEarPlugs" },
		}, // BluetoothEarbuds
	}, // ItemEars
	Bra: {
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Bow",
						Property: {
							Type: "Bow",
						},
					},
					{
						Name: "Wrap",
						Property: {
							Type: "Wrap",
						},
					},
				],
				DialogPrefix: {
					Option: "RibbonBraType",
					Header: "SelectRibbonStyle",
				}
			}
		}, // Ribbons
		SexyBikini1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed"
						},
					},
				],
				DialogPrefix: {
					Option: "BikiniType",
					Header: "SelectBikiniType",
				}
			}
		}, // SexyBikini1
		CuteBikini1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SexyBikini1" },
		}, // CuteBikini1
		Swimsuit1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Shiny",
						Property: { Type: null},
					},
					{
						Name: "Dull",
						Property: { Type: "Dull"},
					},
				],
			},
		}, // ChineseDress2
	}, // Bra
	Panties: {
		Diapers4: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: { Type: null, },
					},
					{
						Name: "StrawBerry",
						Property: { Type: "StrawBerry", },
					},
					{
						Name: "Flower",
						Property: { Type: "Flower", },
					},
					{
						Name: "Butterfly",
						Property: { Type: "Butterfly", },
					},
					{
						Name: "Spots",
						Property: { Type: "Spots", },
					},
				],
			},
		}, // Diapers4
		PoofyDiaper: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.DEST_CHAR_NAME],
				Options: [
					{
						Name: "RegularPadding",
						Property: { Type: null, },
					},
					{
						Name: "Poofy",
						Property: { Type: "Poofy", HideItem: ["ClothLowerSkirt3", "ClothLowerTennisSkirt1"], },
					},
				],
			},
		}, // PoofyDiaper
		MaleCatsuitPanties: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "SuitLower", AssetName: "MaleSeamlessCatsuit" },
		}, // MaleCatsuitPanties - Panties
		Jockstrap: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "String",
						Property: {
							Type: null
						},
					},
					{
						Name: "Sidestraps",
						Property: {
							Type: "Sidestraps"
						},
					},
					{
						Name: "Holemesh",
						Property: {
							Type: "Holemesh"
						},
					},
				],
			},
		}, // Jockstrap
	}, // Panties
	Glasses: {
		EyePatch1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Left",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Right",
						Property: {
							Type: "Right",
						},
					},
				],
				DialogPrefix: {
					Header: "SelectEyePatchType",
					Option: "EyePatchType",
				}
			},
		}, // EyePatch1
		CatGlasses: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Front",
						Property: {
							Type: null,
							OverridePriority: 53
						},
					},
					{
						Name: "Back",
						Property: {
							Type: "Back",
							OverridePriority: 27
						},
					},
				],
				DialogPrefix: {
					Header: "CatGlassesSelectStyle",
					Option: "CatGlassesStyle",
				},
				DrawImages: false,
			},
		}, // CatGlasses
		GradientSunglasses: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "GradUp",
						Property: {
							Type: null,
						},
					},
					{
						Name: "GradDipped",
						Property: {
							Type: "GradDipped",
						},
					},
					{
						Name: "FlatUp",
						Property: {
							Type: "FlatUp",
						},
					},
					{
						Name: "FlatDipped",
						Property: {
							Type: "FlatDipped",
						},
					},
				],
				DialogPrefix: {
					Header: "GradientSunglassesSelectType",
					Option: "GradientSunglassesType",
				},
				DrawImages: false,
			},
		}, // GradientSunglasses
	}, // Glasses
	Bracelet: {
		Band1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Left",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Both",
						Property: {
							Type: "Both",
						},
					},
					{
						Name: "Right",
						Property: {
							Type: "Right",
						},
					},
				],
				DrawImages: false,
			},
		}, // Band1
		SpikeBands: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Both",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Right",
						Property: {
							Type: "Right",
						},
					},
					{
						Name: "Left",
						Property: {
							Type: "Left",
						},
					},
				],
				DialogPrefix: {
					Header: "BraceletSpikeBandsSelect",
					Option: "BraceletSpikeBands",
				}
			},
		}, // SpikeBands
	}, //Bracelet
	Garters: {
		GarterBelt: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Both",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Right",
						Property: {
							Type: "Right",
						},
					},
					{
						Name: "Left",
						Property: {
							Type: "Left",
						},
					},
				],
				DrawImages: false,
			},
		}, // GarterBelt
	}, // Garters
	Necklace: {
		NecklaceKey: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							OverridePriority: 31
						},
					},
					{
						Name: "Tucked",
						Property: {
							Type: "Tucked",
							OverridePriority: 29
						},
					},
				],
				DialogPrefix: {
					Header: "SelectPriorityType",
					Option: "ClothPriorityType",
				}
			},
		}, // NecklaceKey
		NecklaceLock: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "NecklaceKey" },
		}, // NecklaceLock
		NecklaceRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Short",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Long",
						Property: {
							Type: "Long",
						},
					},
				],
			},
		}, //NecklaceRope
		ChokerTattoo: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loops",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Flowers",
						Property: {
							Type: "Flowers",
						},
					},
				],
			},
		}, //ChokerTattoo

	}, // Necklace
	Suit: {
		Catsuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "NoGloves",
						Property: {
							Type: null,
						},
					},
					{
						Name: "OpaqueGloves",
						Property: {
							Type: "OpaqueGloves",
							Hide: ["Hands"],
						},
					},
					{
						Name: "TransparentGloves",
						Property: {
							Type: "TransparentGloves",
						},
					},
				],
				DialogPrefix: {
					Header: "SelectSuitGloves",
					Option: "SuitGloveType",
				},
				DrawImages: false,
			},
		}, // Catsuit
		SeamlessCatsuit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Suit", AssetName: "Catsuit" },
		}, // SeamlessCatsuit
		PilotSuit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Suit", AssetName: "Catsuit" },
		}, // PilotSuit
		SeethroughSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "NoGloves",
						Property: {
							Type: null,
						},
					},
					{
						Name: "TransparentGloves",
						Property: {
							Type: "TransparentGloves",
						},
					},
					{
						Name: "OpaqueGloves",
						Property: {
							Type: "OpaqueGloves",
							Hide: ["Hands"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectSuitGloves",
					Option: "SuitGloveType",
				},
				DrawImages: false,
			},
		}, // SeethroughSuit
		SeethroughSuitZip: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Suit", AssetName: "SeethroughSuit" },
		}, // SeethroughSuitZip
		ReverseBunnySuit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Suit", AssetName: "Catsuit" },
		}, // ReverseBunnySuit
		MaleSeamlessCatsuit: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Suit", AssetName: "Catsuit" },
		}, // MaleSeamlessCatsuit
	}, // Suit
	SuitLower: {
		MaleSeamlessCatsuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Tucked",
						Property: {
							Type: null
						},
					},
					{
						Name: "Bulge",
						Property: {
							Type: "Bulge"
						},
					},
					{
						Name: "SkinTight",
						Property: {
							Type: "SkinTight"
						},
					},
					{
						Name: "Lock",
						Property: {
							Type: "Lock"
						},
					},
				],
			},
		}, // MaleSeamlessCatsuit
		MaleCatsuitPanties: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "SuitLower", AssetName: "MaleSeamlessCatsuit" },
		}, // MaleCatsuitPanties - SuitLower
	}, // SuitLower
	ItemHead: {
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Double",
						Property: {
							Type: null,
							Block: ["ItemNose"],
							Effect: ["BlindNormal", "Prone"],
						},
					},
					{
						Name: "Wrap",
						Property: {
							Type: "Wrap",
							Block: ["ItemNose"],
							Effect: ["BlindNormal", "Prone"],
						},
					},
					{
						Name: "Mummy",
						Property: {
							Type: "Mummy",
							Hide: ["HairFront", "HairBack"],
							Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"],
							Effect: ["GagNormal", "BlindNormal", "Prone", "BlockMouth"],
						},
					},
					{
						Name: "Open",
						Property: {
							Type: "Open",
							Hide: ["HairFront", "HairBack"],
							Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood"],
							Effect: ["GagNormal", "BlockMouth"],
						},
					}
				]
			}
		}, // DuctTape
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
							Effect: ["BlindLight", "Prone"],
						},
					},
					{
						Name: "Wrap",
						Property: {
							Type: "Wrap",
							Effect: ["BlindNormal", "Prone"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectRibbonType",
				},
			},
		}, // Ribbons
		WebBlindfold: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Blindfold",
						Property: {
							Type: null,
							Difficulty: 0,
							Block: ["ItemNose"],
						},
					},
					{
						Name: "Cocoon",
						Property: {
							Type: "Cocoon",
							Difficulty: 30,
							Hide: ["HairFront", "HairBack", "Glasses", "Hat", "ItemMouth", "ItemMouth2", "ItemMouth3"],
							Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"],
							Effect: ["BlindHeavy", "Prone", "GagNormal", "BlockMouth"],
						},
					},
				],
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				DialogPrefix: {
					Header: "WebBondageSelect",
				},
			},
		}, // WebBlindfold
		FuturisticMask: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Transparent",
						Property: {
							Type: null,
							SelfUnlock: true,
							Effect: [],
						},
					},
					{
						Name: "LightTint",
						Property: {
							Type: "LightTint",
							Effect: ["BlindLight", "Prone"],
							Tint: [{Color: 0, Strength: 0.2}],
						},
					},
					{
						Name: "HeavyTint",
						Property: {
							Type: "HeavyTint",
							Effect: ["BlindNormal", "Prone"],
							Tint: [{Color: 0, Strength: 0.5}],
						},
					},
					{
						Name: "Blind",
						Property: {
							Type: "Blind",
							Effect: ["BlindHeavy", "Prone"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectVisorType",
					Option: "ItemHeadInteractiveVisorType",
					Chat: "ItemHeadInteractiveVisorSet",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticMask
		InteractiveVisor: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Transparent",
						Property: {
							Type: null,
							SelfUnlock: true,
							Effect: [],
						},
					},
					{
						Name: "LightTint",
						Property: {
							Type: "LightTint",
							Effect: ["BlindLight", "Prone"],
							Tint: [{ Color: 0, Strength: 0.2 }]
						},
					},
					{
						Name: "HeavyTint",
						Property: {
							Type: "HeavyTint",
							Effect: ["BlindNormal", "Prone"],
							Tint: [{ Color: 0, Strength: 0.5 }]
						},
					},
					{
						Name: "Blind",
						Property: {
							Type: "Blind",
							Effect: ["BlindHeavy", "Prone"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectVisorType",
					Option: "ItemHeadInteractiveVisorType",
					Chat: "ItemHeadInteractiveVisorSet",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // InteractiveVisor
		InteractiveVRHeadset: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Background", Key: "b",
						Options: [
							//CustomBlindBackground: {"None" : "SynthWave", "FreeVR" : "SynthWave", "Gaming" : "Dungeon", "Off" : "", "AR" : ""},
							{ // b0 - Passthrough
								Property: {
									CustomBlindBackground: "",
								}
							},
							{ // b1 - SynthWave
								Property: {
									CustomBlindBackground: "SynthWave",
									Effect: [],
								}
							},
							{ // b2 - Dungeon
								Property: {
									CustomBlindBackground: "Dungeon",
									Effect: [],
								}
							},
							{ // b3 - SciFiCell
								Property: {
									CustomBlindBackground: "SciFiCell",
									Effect: [],
								}
							},
							{ // b4 - AncientRuins
								Property: {
									CustomBlindBackground: "AncientRuins",
									Effect: [],
								}
							},
							{ // b5 - HypnoticSpiral
								Property: {
									CustomBlindBackground: "HypnoticSpiral",
									Effect: [],
								}
							},
						],
					},
					{
						// Use `BlindTotal` for VR avatars to ensure that the `thin` property never reduces the blindness level below `BlindHeavy`,
						// as lowering it any more will result in visual odities related to partial blindness
						Name: "Function", Key: "f",
						Options: [
							{ // f0 - Passthrough
								Property: {
									Effect: [],
								}
							},
							{ // f1 - Off
								Property: {
									Effect: ["BlindHeavy", "Prone"],
								}
							},
							{ // f2 - VR Avatar
								Property: {
									Effect: ["BlindTotal", "Prone", "VRAvatars"],
								}
							},
							{ // f3 - VR Avatar (hide restraints)
								Property: {
									Effect: ["BlindTotal", "VRAvatars", "HideRestraints"],
								}
							},
						],
					},
					{
						Name: "Game", Key: "g",
						Options: [
							{ // g0 - None
								Property: {
									Effect: [],
								}
							},
							{ // f1 - Kinky Dungeon
								Property: {
									Effect: ["KinkyDungeonParty"],
								}
							},
						],
					},
				],
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
				}
			},
		}, // InteractiveVRHeadset
		MedicalPatch: {
			Archetype: ExtendedArchetype.MODULAR,
			Config:{
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules:[
					{
						Name: "Eye", Key: "e",
						Options:[
							{
								Property:{
									Type:null,
									Effect:["BlindNormal","Prone"]
								},
							},
							{
								Property:{
									Type: "Right",
									Effect:[]
								},
							},
							{
								Property:{
									Type: "Left",
									Effect:[]
								},
							},
						],
					},
					{
						Name:"RightSticker", Key: "r",
						Options: [{},{},{},{},{}], //Just blank and cosmetic options
					},
					{
						Name:"LeftSticker", Key: "l",
						Options: [{},{},{},{},{}], //Just blank and cosmetic options
					},
				],
			}
		}, //MedicalPatch
		DroneMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules:[
					{
						Name: "Mouth", Key: "m",
						Options:[
							{ // m0 - None
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m1 - Onahole
								Property: { Effect: ["GagMedium","OpenMouth"] }
							},
							{ // m2 - Fleshlight
								Property: { Effect: ["GagMedium","OpenMouth"] }
							},
							{ // m3 - Smile
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m4 - Holes
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m5 - Sculpted
								Property: { Effect: ["BlockMouth"] }
							},
							{ // m6 - Subtle
								Property: { Effect: ["BlockMouth"] }
							},
						]
					},
					{
						Name: "Eyes", Key: "e",
						Options:[
							{ // e0 - None
								Property: { Effect: ["BlindLight"] }
							},
							{ // e1 - Regular
								Property: { Effect: [] }
							},
							{ // e2 - Spiral
								Property: { Effect: [] }
							},
							{ // e3 - Smile
								Property: { Effect: [] }
							},
							{ // e4 - Holes
								Property: { Effect: ["BlindLight"] }
							},
							{ // e5 - Sculpted
								Property: { Effect: [] }
							},
							{ // e6 - Concave
								Property: {Effect: ["BlindLight"] }
							}

						]
					},
					{
						Name: "Pattern", Key: "p",
						Options:[{},{},{},{},{},{HasSubscreen: true},] // Blank, Barcode, Scarab, Hex, Lines, Text
					},
					{
						Name: "Glow", Key: "g",
						Options: [{},{},] // Glow Off, Glow On
					},
					{
						Name: "Sight", Key: "s",
						Options: [
							{ // s0 - Opaque
								Property: { Effect: ["BlindHeavy", "Prone"] }
							},
							{ // s1 - One Way
								Property: { Effect: [""] }
							},
						]
					},
					{
						Name: "Helmet", Key: "h",
						Options: [
							{}, // h0 - Mask
							{
								Property: {
									Hide: ["HairFront", "HairBack",], //"HairAccessory1", "HairAccessory2"],
									HideItem: [
										"HatBonnet1", "HatBonnet2", "HatBunnySuccubus2", "HatCrown1", "HatCrown2", "HatCrown4", "HatCrown5", "HatBand1",
										"HatBand2", "HatPirateBandana1", "HatVeil1","HatVeil2", // Hat items
										"MaskFuturisticVisor", "MaskShinobiMask", // Mask items
										"HairAccessory3Ribbons4", // HairAccessory items
										"HairAccessory1Antennae", "HairAccessory1BunnyEars1", "HairAccessory1BunnyEars2", "HairAccessory1CowHorns", "HairAccessory1ElfEars",
										"HairAccessory1Ears1", "HairAccessory1Ears2", "HairAccessory1FoxEars1", "HairAccessory1FoxEars2", "HairAccessory1FoxEars3",
										"HairAccessory1KittenEars1", "HairAccessory1KittenEars2", "HairAccessory1MouseEars1", "HairAccessory1MouseEars2",
										"HairAccessory1PuppyEars1", "HairAccessory1Ribbons2", "HairAccessory1WolfEars1", "HairAccessory1WolfEars2",
										"HairAccessory1Ribbons4", // Ear items (HA1)
										"HairAccessory2Antennae", "HairAccessory2BunnyEars1", "HairAccessory2BunnyEars2", "HairAccessory2CowHorns", "HairAccessory2ElfEars",
										"HairAccessory2Ears1", "HairAccessory2Ears2", "HairAccessory2FoxEars1", "HairAccessory2FoxEars2", "HairAccessory2FoxEars3",
										"HairAccessory2KittenEars1", "HairAccessory2KittenEars2", "HairAccessory2MouseEars1", "HairAccessory2MouseEars2",
										"HairAccessory2PuppyEars1", "HairAccessory2Ribbons2", "HairAccessory2WolfEars1", "HairAccessory2WolfEars2", // Ear items (HA2)
									], // These items are hidden because they have clear mismatch issues with the hood.
								},
							}, // h1 - Helmet (hood)
							{ // h2 - Helmet ( hood but nothing shows)
								Property: {
									Hide: ["HairFront", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3"],
									HideItem: ["MaskFuturisticVisor", "MaskShinobiMask",],
								},
							},
						]
					},
					{
						Name: "Layering", Key: "j",
						Options: [
							{
								Property:{
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
									Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3"],
								}
							}, // No gags visible
							{
								Property:{
									OverridePriority: 12,
									Block: ["ItemMouth", "ItemMouth2"],
									Hide: ["ItemMouth", "ItemMouth2"],
								}
							}, // Highest layer gag visible
							{
								Property:{
									OverridePriority: 12,
									Block: [],
									Hide: [],
								}
							}, // All gags visible
						],
					},
				],
				ChangeWhenLocked: false,
				BaselineProperty: { Text: "" },
			}
		}, // DroneMask
		Stitches: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules:[
					{
						Name:"Main", Key: "m",
						Options: [
							{Property: { Hide: ["Eyes"]}, }, // Right Eye
							{Property: { Hide: ["Eyes2"]}, }, // Left Eye
							{Property: { Hide: ["Eyes","Eyes2"], Effect: ["BlindHeavy", "Prone"]},} //Both Eyes
						],
					},
					{
						Name:"Right", Key: "r",
						Options: [
							{}, // Straight
							{}, // ZigZag
							{}, // Skewed
							{}, // Crossed
						],
					},
					{
						Name:"Left", Key: "l",
						Options: [
							{}, // Straight
							{}, // ZigZag
							{}, // Skewed
							{}, // Crossed
						],
					},
				],
			},
		}, // Stitches
	}, // ItemHead
	ItemHands: {
		FuturisticMittens: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Mittens",
						Property: { Type: null, Difficulty: 8, SelfUnlock: false, Effect: ["Block", "Prone", "MergedFingers"], Block: ["ItemHandheld"], Hide: ["ItemHandheld"]},
					},
					{
						Name: "Gloves",
						Property: { Type: "Gloves", Difficulty: 0, SelfUnlock: true, Block: [] },
					},
				],
				DialogPrefix: {
					Header: "SelectFuturisticMittensType",
					Option: "FuturisticMittensType",
					Chat: "FuturisticMittensSet",
				},
				ScriptHooks: {
					Load: FuturisticAccessLoad,
					Click: FuturisticAccessClick,
					Draw: FuturisticAccessDraw,
					Exit: FuturisticAccessExit,
					Validate: FuturisticAccessValidate,
				}
			},
		}, // FuturisticMittens
	}, // ItemHands
	ItemAddon: {
		CeilingChain: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Lowered",
						Property: { Type: null, Difficulty: 6, Effect: []}
					}, {
						Name: "Suspended",
						Property: {
							Type: "Suspended", Difficulty: 7,
							OverrideHeight: { Height: 30, Priority: 51, HeightRatioProportion: 0 },
							Effect: ["Lifted"],
							AllowActivePose: ["BaseLower", "LegsClosed", "Kneel", "KneelingSpread"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectCeilingChainState",
					Option: "CeilingChainBondage",
					Chat: "CeilingChainSet",
					Npc: "CeilingChain",
				},
				ChangeWhenLocked: false,
			}
		}, // CeilingChain
		CeilingRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Lowered",
						Property: { Type: null, Difficulty: 6}
					}, {
						Name: "Suspended",
						Property: {
							Type: "Suspended", Difficulty: 7,
							OverrideHeight: { Height: 30, Priority: 51, HeightRatioProportion: 0 },
							Effect: ["Lifted"],
							AllowActivePose: ["BaseLower", "LegsClosed", "Kneel", "KneelingSpread"],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectCeilingRopeState",
					Option: "CeilingRopeBondage",
					Chat: "CeilingRopeSet",
					Npc: "CeilingRope",
				},
			}
		}, // CeilingRope
	}, // ItemAddon
	ItemNose: {
		NoseRing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: {
							Type: null,
							Effect: [],
							SetPose: [],
						},
					},
					{
						Name: "ChainShort",
						Prerequisite: ["NotSuspended", "CanKneel", "NotMounted"],
						Property: {
							Type: "ChainShort",
							Effect: ["Freeze", "ForceKneel", "IsChained"],
							SetPose: ["Kneel"],
						},
					},
					{
						Name: "ChainLong",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "ChainLong",
							Effect: ["Tethered", "IsChained"],
							SetPose: [],
						},
					},
					{
						Name: "Leash",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "Leash",
							Effect: ["Leash"],
							SetPose: [],
						},
					},
				],
				DialogPrefix: {
					Header: "SelectAttachmentState",
					Option: "NoseRingPose",
					Chat: "NoseRingRestrain",
					Npc: "InventoryItemNoseNoseRingNPCReaction",
				},
			}
		}, // NoseRing
	}, // ItemNose
	Wings: {
		SteampunkWings: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				DrawImages: false,
				Options: [
					{
						Name: "Off",
						Property: {
							Type: null,
						},
					},
					{
						Name: "On",
						Property: {
							Type: "On",
						},
					},
				],
			}
		}, // SteampunkWings
	}, // Wings
};
