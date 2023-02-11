"use strict";
const vm = require("vm");
const fs = require("fs");

const BASE_PATH = "../../";
// Files needed to check the Female3DCG assets
const neededFiles = [
	"Scripts/Common.js",
	"Scripts/Dialog.js",
	"Scripts/Asset.js",
	"Scripts/ModularItem.js",
	"Scripts/TypedItem.js",
	"Scripts/VariableHeight.js",
	"Scripts/Property.js",
	"Screens/Inventory/Futuristic/Futuristic.js",
	"Screens/Inventory/ItemTorso/FuturisticHarness/FuturisticHarness.js",
	"Screens/Inventory/ItemNeckAccessories/CollarNameTag/CollarNameTag.js",
	"Screens/Inventory/ItemArms/FullLatexSuit/FullLatexSuit.js",
	"Screens/Inventory/ItemButt/InflVibeButtPlug/InflVibeButtPlug.js",
	"Screens/Inventory/ItemDevices/VacBedDeluxe/VacBedDeluxe.js",
	"Screens/Inventory/ItemDevices/WoodenBox/WoodenBox.js",
	"Screens/Inventory/ItemDevices/TransportWoodenBox/TransportWoodenBox.js",
	"Screens/Inventory/ItemPelvis/SciFiPleasurePanties/SciFiPleasurePanties.js",
	"Screens/Inventory/ItemNeckAccessories/CollarShockUnit/CollarShockUnit.js",
	"Screens/Inventory/ItemVulva/ClitAndDildoVibratorbelt/ClitAndDildoVibratorbelt.js",
	"Screens/Inventory/ItemBreast/FuturisticBra/FuturisticBra.js",
	"Screens/Inventory/ItemArms/TransportJacket/TransportJacket.js",
	"Screens/Inventory/ItemMouth/FuturisticPanelGag/FuturisticPanelGag.js",
	"Screens/Inventory/ItemNeckAccessories/CollarAutoShockUnit/CollarAutoShockUnit.js",
	"Screens/Inventory/ItemArms/PrisonLockdownSuit/PrisonLockdownSuit.js",
	"Screens/Inventory/ItemPelvis/LoveChastityBelt/LoveChastityBelt.js",
	"Screens/Inventory/ItemVulva/LoversVibrator/LoversVibrator.js",
	"Assets/Female3DCG/Female3DCG.js",
	"Assets/Female3DCG/Female3DCGExtended.js"
];

let localError = false;
let globalError = false;
/**
 * Logs the error to console and sets erroneous exit code
 * @param {string} text The error
 */
function error(text) {
	console.log("ERROR:", text);
	process.exitCode = 1;
	localError = true;
	globalError = true;
}

/**
 * Parse a CSV file content into an array
 * @param {string} str - Content of the CSV
 * @returns {string[][]} Array representing each line of the parsed content, each line itself is split by commands and stored within an array.
 */
function CommonParseCSV(str) {
	/** @type {string[][]} */
	let arr = [];
	let quote = false; // true means we're inside a quoted field
	let c;
	let col;
	// We remove whitespace on start and end
	str = str.trim() + "\n";

	// iterate over each character, keep track of current row and column (of the returned array)
	for (let row = (col = c = 0); c < str.length; c++) {
		var cc = str[c],
			nc = str[c + 1]; // current character, next character
		arr[row] = arr[row] || []; // create a new row if necessary
		arr[row][col] = arr[row][col] || ""; // create a new column (start with empty string) if necessary

		// If the current character is a quotation mark, and we're inside a
		// quoted field, and the next character is also a quotation mark,
		// add a quotation mark to the current column and skip the next character
		if (cc == '"' && quote && nc == '"') {
			arr[row][col] += cc;
			++c;
			continue;
		}

		// If it's just one quotation mark, begin/end quoted field
		if (cc == '"') {
			quote = !quote;
			continue;
		}

		// If it's a comma and we're not in a quoted field, move on to the next column
		if (cc == "," && !quote) {
			++col;
			continue;
		}

		// If it's a newline and we're not in a quoted field, move on to the next
		// row and move to column 0 of that new row
		if (cc == "\n" && !quote) {
			++row;
			col = 0;
			continue;
		}

		// Otherwise, append the current character to the current column
		arr[row][col] += cc;
	}
	return arr;
}

/**
 * Loads a CSV file and verifies correct column widths
 * @param {string} path Path to file, relative to BondageClub directory
 * @param {number} expectedWidth Expected number of columns
 */
function loadCSV(path, expectedWidth) {
	const data = CommonParseCSV(fs.readFileSync(BASE_PATH + path, { encoding: "utf-8" }));
	for (let line = 0; line < data.length; line++) {
		if (data[line].length !== expectedWidth) {
			error(`Bad width of line ${line + 1} (${data[line].length} vs ${expectedWidth}) in ${path}`);
		}
	}
	return data;
}

/**
 * Checks for {@link AssetDefinition.DynamicGroupName}
 * @param {readonly AssetGroupDefinition[]} groupDefinitions
 */
function testDynamicGroupName(groupDefinitions) {
	/** @type {[AssetGroupDefinition, AssetDefinition][]} */
	const assetsList = [];
	for (const groupDef of groupDefinitions) {
		for (const asset of groupDef.Asset) {
			if (typeof asset !== "string") {
				assetsList.push([groupDef, asset]);
			}
		}
	}

	// If `DynamicGroupName` is set, check whether the dynamically referenced item actually exists
	for (const [groupDef, assetDef] of assetsList) {
		const DynamicGroupName = (assetDef.DynamicGroupName !== undefined) ? assetDef.DynamicGroupName : groupDef.DynamicGroupName;
		if (
			DynamicGroupName !== undefined
			&& DynamicGroupName !== groupDef.Group
			&& !assetsList.some(([g, a]) => a.Name === assetDef.Name && g.Group === DynamicGroupName)
		) {
			error(`${groupDef.Group}:${assetDef.Name}: Missing DynamicGroupName-referenced item: ${DynamicGroupName}:${assetDef.Name}`);
		}
	}
}

/**
 * Checks for the option names of typed items
 * @param {any} extendedItemConfig
 */
function testTypedOptionName(extendedItemConfig) {
	for (const [groupName, groupConfig] of Object.entries(extendedItemConfig)) {
		for (const [assetName, assetConfig] of Object.entries(groupConfig)) {
			if (
				assetConfig.Archetype !== "typed"
				|| (assetConfig.Config === undefined)
				|| (assetConfig.Config.Options === undefined)
			) {
				continue;
			}
			const invalidOptions = assetConfig.Config.Options.filter(o => {
				const type = o?.Property?.Type;
				return !(o.Name === type || type === null);
			});
			if (invalidOptions.length !== 0) {
				const n = invalidOptions.length;
				const invalidNames = invalidOptions.map(o => `${o.Name}:${o.Property.Type}`);
				error(`${groupName}:${assetName}: Found ${n} typed item option name/type mismatches: ${invalidNames}`);
			}
		}
	}
}

(function () {
	const context = vm.createContext({ OuterArray: Array, Object: Object });
	for (const file of neededFiles) {
		vm.runInContext(fs.readFileSync(BASE_PATH + file, { encoding: "utf-8" }), context, {
			filename: file,
			timeout: 1000
		});
	}

	// We need to strigify and parse the asset array to have correct Array and Object prototypes, because VM uses different ones
	// This unfortunately results in Functions being lost and replaced with undefined
	/** @type {AssetGroupDefinition[]} */
	const AssetFemale3DCG = JSON.parse(JSON.stringify(context.AssetFemale3DCG));
	const AssetFemale3DCGExtended = JSON.parse(JSON.stringify(context.AssetFemale3DCGExtended));

	if (!Array.isArray(AssetFemale3DCG)) {
		error("AssetFemale3DCG not found");
		return;
	}

	const assetDescriptions = loadCSV("Assets/Female3DCG/Female3DCG.csv", 3);
	const dialogArray = loadCSV("Screens/Character/Player/Dialog_Player.csv", 6);

	// No further checks if initial data load failed
	if (localError) {
		return;
	}

	// Arrays of type-validated groups and assets
	/** @type {AssetGroupDefinition[]} */
	const Groups = [];
	/** @type {Record<string, AssetDefinition[]>} */
	const Assets = {};

	// Check all groups
	for (const Group of AssetFemale3DCG) {
		localError = false;

		Groups.push(Group);
		/** @type {AssetDefinition[]} */
		const GroupAssets = (Assets[Group.Group] = []);

		// Check all assets in groups
		for (const Asset of Group.Asset) {
			if (typeof Asset === "string") {
				GroupAssets.push({
					Name: Asset
				});
				continue;
			}
			localError = false;

			// Check any extended item config
			if (Asset.Extended) {
				const groupConfig = AssetFemale3DCGExtended[Group.Group] || {};
				let assetConfig = groupConfig[Asset.Name];
				if (assetConfig) {
					if (assetConfig && assetConfig.CopyConfig) {
						const { Config: Overrides, Archetype } = assetConfig;
						const { GroupName, AssetName } = assetConfig.CopyConfig;
						assetConfig = (AssetFemale3DCGExtended[GroupName || Group.Group] || {} )[AssetName];
						if (!assetConfig) {
							error(`Asset ${Group.Group}:${Asset.Name}: CopyConfig target not found!`);
							assetConfig = groupConfig[Asset.Name];
						} else if (assetConfig.Archetype !== groupConfig[Asset.Name].Archetype) {
							error(`Asset for ${Group.Group}:${Asset.Name}: Mismatch in archetypes after CopyConfig`);
						} else if (Overrides) {
							const MergedConfig = Object.assign({}, assetConfig.Config, Overrides);
							assetConfig = Object.assign({}, assetConfig, {Config: MergedConfig});
						}
					}
					if (assetConfig.Config) {
						if (assetConfig.Archetype === "typed") {
							const HasSubscreen = !localError && assetConfig.Config.Options.some(option => !!option.HasSubscreen);
							if (!HasSubscreen) {
								if (Asset.AllowEffect !== undefined) {
									error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowEffect (unless they use subscreens)`);
								}
								if (Asset.AllowBlock !== undefined) {
									error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowBlock (unless they use subscreens)`);
								}
								if (Asset.AllowHide !== undefined) {
									error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowHide (unless they use subscreens)`);
								}
								if (Asset.AllowHideItem !== undefined) {
									error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowHideItem (unless they use subscreens)`);
								}
							}
						}
					}
					if (assetConfig.Archetype === "typed" && Asset.AllowType !== undefined) {
						error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowType`);
					}
					if (!["modular", "typed", "vibrating"].includes(assetConfig.Archetype)) {
						error(`Extended asset archetype for ${Group.Group}:${Asset.Name}: Unknown Archetype ${assetConfig.Archetype}`);
					}
				}
			}

			if (Array.isArray(Asset.Layer)) {
				for (const layerDef of Asset.Layer) {
					// Check for conflicting layer properties
					if (Array.isArray(layerDef.HideForAttribute) && Array.isArray(layerDef.ShowForAttribute)) {
						for (const attribute of layerDef.HideForAttribute) {
							if (layerDef.ShowForAttribute.includes(attribute)) {
								error(`Layer ${Group.Group}:${Asset.Name}:${layerDef.Name}: Attribute "${attribute}" should NOT appear in both HideForAttribute and ShowForAttribute`);
							}
						}
					}
				}
			}

			if (!localError) {
				GroupAssets.push(Asset);
			}

			if (Asset.TextFont != null && Asset.DynamicAfterDraw !== true) {
				error(`Asset ${Group.Group}:${Asset.Name}: Assets should only define "TextFont" if "DynamicAfterDraw" is set to true`);
			}
		}
	}

	if (globalError) {
		console.log("WARNING: Type errors detected, skipping other checks");
		return;
	}

	// Validate description order
	{
		let group = "";
		for (let line = 0; line < assetDescriptions.length; line++) {
			if (assetDescriptions[line][1] === "") {
				group = assetDescriptions[line][0];
			} else if (assetDescriptions[line][0] !== group) {
				error(
					`Asset descriptions line ${line + 1} not under it's matching group! ` +
						`(${assetDescriptions[line][0]}:${assetDescriptions[line][1]} is in ${group} group)`
				);
			}
		}
	}

	// Check all type-valid groups for specific data
	for (const Group of Groups) {
		// Description name
		const descriptionIndex = assetDescriptions.findIndex(d => d[0] === Group.Group && d[1] === "");
		if (descriptionIndex < 0) {
			error(`No description for group "${Group.Group}"`);
		} else {
			assetDescriptions.splice(descriptionIndex, 1);
		}

		// Check all type-valid assets for specific data
		for (const Asset of Assets[Group.Group]) {
			// Description name
			const descriptionIndexAsset = assetDescriptions.findIndex(d => d[0] === Group.Group && d[1] === Asset.Name);
			if (descriptionIndexAsset < 0) {
				error(`No description for asset "${Group.Group}:${Asset.Name}"`);
			} else {
				assetDescriptions.splice(descriptionIndexAsset, 1);
			}
		}
	}

	// Check for extra descriptions
	for (const desc of assetDescriptions) {
		error(`Unused Asset/Group description: ${desc.join(",")}`);
	}

	// Check player dialog in AssetFemale3DCGExtended
	Object.values(AssetFemale3DCGExtended).forEach((category) => {
		Object.values(Object(category)).forEach((asset) => {
			const dialog = asset.Config && asset.Config.Dialog;
			const options = asset.Config && asset.Config.Options;
			if (!dialog || !options) {
				return;
			}

			options.forEach((option) => {
				if (option.ArchetypeConfig && option.ArchetypeConfig.Dialog) {
					const optionDialog = option.ArchetypeConfig.Dialog;
					if (!dialogArray.find(e => e[0] === optionDialog.ChatPrefix)) {
						error(`Missing Dialog: '${optionDialog.ChatPrefix}'`);
					}
					return;
				}

				[dialog.ChatPrefix, dialog.TypePrefix].forEach((prefix) => {
					if (prefix && !dialogArray.find(e => e[0] === prefix + option.Name)) {
						error(`Missing Dialog: '${prefix + option.Name}'`);
					}
				});
			});
		});
	});

	testDynamicGroupName(AssetFemale3DCG);
	testTypedOptionName(AssetFemale3DCGExtended);
})();
