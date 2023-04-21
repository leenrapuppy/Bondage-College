"use strict";
const vm = require("vm");
const fs = require("fs");

const BASE_PATH = "../../";
// Files needed to check the Female3DCG assets
const NEEDED_FILES = [
	"Scripts/Common.js",
	"Scripts/Dialog.js",
	"Scripts/Asset.js",
	"Scripts/ExtendedItem.js",
	"Scripts/ModularItem.js",
	"Scripts/TypedItem.js",
	"Scripts/VariableHeight.js",
	"Scripts/VibratorMode.js",
	"Scripts/Property.js",
	"Scripts/TextItem.js",
	"Screens/Inventory/Futuristic/Futuristic.js",
	"Screens/Inventory/ItemTorso/FuturisticHarness/FuturisticHarness.js",
	"Screens/Inventory/ItemNeckAccessories/CollarNameTag/CollarNameTag.js",
	"Screens/Inventory/ItemArms/FullLatexSuit/FullLatexSuit.js",
	"Screens/Inventory/ItemButt/InflVibeButtPlug/InflVibeButtPlug.js",
	"Screens/Inventory/ItemDevices/VacBedDeluxe/VacBedDeluxe.js",
	"Screens/Inventory/ItemDevices/WoodenBox/WoodenBox.js",
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
	"Screens/Inventory/ItemButt/AnalBeads2/AnalBeads2.js",
	"Screens/Inventory/ItemDevices/LuckyWheel/LuckyWheel.js",
	"Screens/Inventory/ItemDevices/FuturisticCrate/FuturisticCrate.js",
	"Screens/Inventory/Cloth/CheerleaderTop/CheerleaderTop.js",
	"Screens/Inventory/ClothAccessory/Bib/Bib.js",
	"Screens/Inventory/ItemDevices/DollBox/DollBox.js",
	"Screens/Inventory/ItemDevices/PetBowl/PetBowl.js",
	"Screens/Inventory/ItemHead/DroneMask/DroneMask.js",
	"Screens/Inventory/ItemMisc/WoodenSign/WoodenSign.js",
	"Screens/Inventory/ItemHood/CanvasHood/CanvasHood.js",
	"Screens/Inventory/ItemPelvis/ObedienceBelt/ObedienceBelt.js",
	"Screens/Inventory/ItemNeckAccessories/CustomCollarTag/CustomCollarTag.js",
	"Screens/Inventory/ItemNeckAccessories/ElectronicTag/ElectronicTag.js",
	"Screens/Inventory/ItemNeckRestraints/PetPost/PetPost.js",
	"Screens/Inventory/ItemVulva/FuturisticVibrator/FuturisticVibrator.js",
	"Screens/Inventory/ItemPelvis/FuturisticTrainingBelt/FuturisticTrainingBelt.js",
	"Assets/Female3DCG/Female3DCG.js",
	"Assets/Female3DCG/Female3DCGExtended.js",
	"Scripts/Translation.js",
	"Scripts/Text.js",
	"Screens/Character/ItemColor/ItemColor.js",
	"Scripts/Testing.js",
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
 * Flatten and yield all combined Asset/Group configs and names
 * @param {ExtendedItemMainConfig} extendedItemConfig
 */
function* flattenExtendedConfig(extendedItemConfig) {
	for (const [groupName, groupConfig] of Object.entries(extendedItemConfig)) {
		for (const [assetName, assetConfig] of Object.entries(groupConfig)) {
			yield { groupName, assetName, groupConfig, assetConfig };
		}
	}
}

/**
 * Checks for the option names of typed items
 * @param {ExtendedItemMainConfig} extendedItemConfig
 * @param {string[][]} dialogArray
 */
function testExtendedItemDialog(extendedItemConfig, dialogArray) {
	const dialogSet = new Set(dialogArray.map(i => i[0]));
	for (const { groupName, assetName, assetConfig } of flattenExtendedConfig(extendedItemConfig)) {
		// Skip if dialog keys if they are set via CopyConfig;
		// they will be checked when validating the parent item
		if (assetConfig.CopyConfig && !assetConfig?.DialogPrefix) {
			continue;
		}

		/** @type {Set<string>} */
		let missingDialog = new Set();
		switch (assetConfig.Archetype) {
			case "typed":
				missingDialog = testTypedItemDialog(groupName, assetName, assetConfig, dialogSet);
				break;
			case "modular":
				missingDialog = testModularItemDialog(groupName, assetName, assetConfig, dialogSet);
				break;
		}

		if (missingDialog.size !== 0) {
			const missingString = Array.from(missingDialog).sort();
			error(`${groupName}:${assetName}: found ${missingDialog.size} missing dialog keys: ${missingString}`);
		}
	}
}

/**
 * Construct all prefix/suffix combinations and add them to `diffSet` if they are not part of `referenceSet`.
 * Performs an inplace update of `diffSet`.
 * @param {readonly (undefined | string)[]} prefixIter
 * @param {readonly (undefined | string)[]} suffixIter
 * @param {Readonly<Set<string>>} referenceSet
 * @param {Set<string>} diffSet
 */
function gatherDifference(prefixIter, suffixIter, referenceSet, diffSet) {
	for (const prefix of prefixIter) {
		if (prefix === undefined) {
			continue;
		}
		for (const suffix of suffixIter) {
			if (suffix === undefined) {
				continue;
			}
			const key =`${prefix}${suffix}`;
			if (!referenceSet.has(key)) {
				diffSet.add(key);
			}
		}
	}
}

/**
 * Version of {@link gatherDifference} designed for handling the `fromTo` typed item chat setting.
 * @param {readonly (undefined | string)[]} prefixIter
 * @param {readonly (undefined | string)[]} suffixIter
 * @param {Readonly<Set<string>>} referenceSet
 * @param {Set<string>} diffSet
 */
function gatherDifferenceFromTo(prefixIter, suffixIter, referenceSet, diffSet) {
	for (const prefix of prefixIter) {
		if (prefix === undefined) {
			continue;
		}
		for (const suffix1 of suffixIter) {
			for (const suffix2 of suffixIter) {
				if (suffix1 === suffix2 || suffix1 === undefined || suffix2 === undefined) {
					continue;
				}
				const key =`${prefix}${suffix1}To${suffix2}`;
				if (!referenceSet.has(key)) {
					diffSet.add(key);
				}
			}
		}
	}
}

/**
 * Return a set of all expected typed item dialog keys that are absent for a given iten.
 * Helper function for {@link testExtendedItemDialog}.
 * @param {string} groupName
 * @param {string} assetName
 * @param {TypedItemConfig} config
 * @param {Readonly<Set<string>>} dialogSet
 * @returns {Set<string>}
 */
function testTypedItemDialog(groupName, assetName, config, dialogSet) {
	const chatSetting = config.ChatSetting ?? "toOnly";
	/** @type {Partial<TypedItemConfig["DialogPrefix"]>} */
	const dialogConfig = {
		Header: `${groupName}${assetName}Select`,
		Option: `${groupName}${assetName}`,
		Chat: `${groupName}${assetName}Set`,
		...(config.DialogPrefix ?? {}),
	};
	if (
		typeof dialogConfig.Chat === "function"  // Can't validate callables via the CI
		|| chatSetting === "silent"  // No dialog when silent
		|| !groupName.includes("Item")  // Type changes of clothing based items never have a chat message
	) {
		dialogConfig.Chat = undefined;
	}

	/** @type {Set<string>} */
	const ret = new Set();
	const optionNames = config.Options?.map(o => !o.HasSubscreen ? o.Name : undefined) ?? [];
	gatherDifference([dialogConfig.Option], optionNames, dialogSet, ret);
	gatherDifference([dialogConfig.Header], [""], dialogSet, ret);
	if (chatSetting === "toOnly") {
		gatherDifference([dialogConfig.Chat], optionNames, dialogSet, ret);
	} else if (chatSetting === "fromTo") {
		gatherDifferenceFromTo([dialogConfig.Chat], optionNames, dialogSet, ret);
	}
	return ret;
}

/**
 * Return a set of all expected modular item dialog keys that are absent for a given iten.
 * Helper function for {@link testExtendedItemDialog}.
 * @param {string} groupName
 * @param {string} assetName
 * @param {ModularItemConfig} config
 * @param {Readonly<Set<string>>} dialogSet
 * @returns {Set<string>}
 */
function testModularItemDialog(groupName, assetName, config, dialogSet) {
	const chatSetting = config.ChatSetting ?? "perOption";
	/** @type {Partial<ModularItemConfig["DialogPrefix"]>} */
	const dialogConfig = {
		Header: `${groupName}${assetName}Select`,
		Module: `${groupName}${assetName}Module`,
		Option: `${groupName}${assetName}Option`,
		Chat: `${groupName}${assetName}Set`,
		...(config.DialogPrefix ?? {}),
	};
	if (typeof dialogConfig.Chat === "function" || !groupName.includes("Item")) {
		dialogConfig.Chat = undefined;
	}

	const modulesNames = config.Modules?.map(m => m.Name) ?? [];
	/** @type {(string | undefined)[]} */
	const optionNames = [];
	for (const module of config.Modules ?? []) {
		optionNames.push(...(module.Options.map((o, i) => !o.HasSubscreen ? `${module.Key}${i}` : undefined) ?? []));
	}

	/** @type {Set<string>} */
	const ret = new Set();
	gatherDifference([dialogConfig.Header, dialogConfig.Module], modulesNames, dialogSet, ret);
	gatherDifference([dialogConfig.Option], optionNames, dialogSet, ret);
	if (chatSetting === "perOption") {
		gatherDifference([dialogConfig.Chat], optionNames, dialogSet, ret);
	} else if (chatSetting === "perModule") {
		// Ignore a module if every single one of its options links to a subscreen
		const modulesNamesNoSubscreen = config.Modules?.map(m => m.Options.every(o => o.HasSubscreen) ? undefined : m.Name) ?? [];
		gatherDifference([dialogConfig.Chat], modulesNamesNoSubscreen, dialogSet, ret);
	}
	return ret;
}

/**
 * Check that all expected color-group entries are present in the .csv file
 * @param {TestingStruct<string>[]} missingGroups A list of all missing color groups
 */
function testColorGroups(missingGroups) {
	if (!Array.isArray(missingGroups)) {
		error("MISSING_COLOR_GROUPS not found");
	}
	for (const { Group, Name, Invalid } of missingGroups) {
		error(`${Group}:${Name}: Missing color group "${Invalid}"`);
	}
}

/**
 * Check that all expected color-layer entries are present in the .csv file
 * @param {TestingStruct<string>[]} missingLayers A list of all missing color layers
 */
function testColorLayers(missingLayers) {
	if (!Array.isArray(missingLayers)) {
		error("MISSING_COLOR_LAYERS not found");
		return;
	}
	for (const { Group, Name, Invalid } of missingLayers) {
		error(`${Group}:${Name}: Missing color layer "${Invalid}"`);
	}
}

/**
 * Test whether all asset default colors are valid.
 * @param {TestingStruct<string[]>[]} invalidDefaults A list of all missing color layers
 */
function testDefaultColor(invalidDefaults) {
	if (!Array.isArray(invalidDefaults)) {
		error("TestingInvalidDefaultColor not found");
		return;
	}
	for (const { Group, Name, Invalid } of invalidDefaults) {
		error(`${Group}:${Name}: ${Invalid.length} invalid color defaults "${Invalid}"`);
	}
}

/**
 * Gather all duplicate module/option names from the passed module/option list
 * @param {readonly { Name: string }[]} options
 * @returns {string[]}
 */
function gatherDuplicateOptionNames(options) {
	/** @type {Record<string, number>} */
	const nameCount = {};
	for (const option of options) {
		if (option.Name in nameCount) {
			nameCount[option.Name] += 1;
		} else {
			nameCount[option.Name] = 1;
		}
	}

	/** @type {string[]} */
	const duplicates = [];
	for (const [name, count] of Object.entries(nameCount)) {
		if (count > 1) {
			duplicates.push(name);
		}
	}
	return duplicates;
}

/**
 * Check whether all extended item options and modules are (at least) of length 1.
 * @param {ExtendedItemMainConfig} config
 */
function testModuleOptionLength(config) {
	for (const { groupName, assetName, assetConfig } of flattenExtendedConfig(config)) {
		switch (assetConfig.Archetype) {
			case "typed": {
				testModuleOptionLengthTyped(groupName, assetName, assetConfig);
				break;
			}
			case "modular": {
				testModuleOptionLengthModular(groupName, assetName, assetConfig);
				break;
			}
		}
	}
}

/**
 * @param {string} groupName
 * @param {string} assetName
 * @param {TypedItemConfig} config
 */
function testModuleOptionLengthTyped(groupName, assetName, config) {
	if (config.CopyConfig && !config?.Options) {
		return;
	}

	const options = config.Options ?? [];
	if (options.length === 0) {
		error(`${groupName}:${assetName}: typed item require at least one option`);
	}

	const duplicateNames = gatherDuplicateOptionNames(options);
	if (duplicateNames.length) {
		error(`${groupName}:${assetName}: found ${duplicateNames.length} typed item options with a duplicate Name: ${duplicateNames}`);
	}
}

/**
 * @param {string} groupName
 * @param {string} assetName
 * @param {ModularItemConfig} config
 */
function testModuleOptionLengthModular(groupName, assetName, config) {
	if (config.CopyConfig && !config?.Modules) {
		return;
	}

	const modules = config.Modules ?? [];
	if (modules.length === 0) {
		error(`${groupName}:${assetName}: modular item requires at least one option`);
	}

	for (const mod of modules) {
		if (mod.Options.length === 0) {
			error(`${groupName}:${assetName}: modular item module "${mod}" requires at least one option`);
		}
	}

	const duplicateNames = gatherDuplicateOptionNames(modules);
	if (duplicateNames.length) {
		error(`${groupName}:${assetName}: found ${duplicateNames.length} modular item modules with a duplicate Name: ${duplicateNames}`);
	}
}

/**
 * Strigify and parse the passed object to get the correct Array and Object prototypes, because VM uses different ones.
 * This unfortunately results in Functions being lost and replaced with a dummy function
 * @param {any} input The to-be sanitized input
 * @returns {any} The sanitized output
 */
function sanitizeVMOutput(input) {
	return JSON.parse(
		JSON.stringify(
			input,
			(key, value) => typeof value === "function" ? "__FUNCTION__" : value,
		),
		(key, value) => value === "__FUNCTION__" ? () => { return; } : value,
	);
}

(function () {
	const [commonFile, ...neededFiles] = NEEDED_FILES;
	const context = vm.createContext({
		OuterArray: Array,
		Object: Object,
		TestingColorLayers: new Set(loadCSV("Assets/Female3DCG/LayerNames.csv", 2).map(i => i[0])),
		TestingColorGroups: new Set(loadCSV("Assets/Female3DCG/ColorGroups.csv", 2).map(i => i[0])),
	});
	vm.runInContext(fs.readFileSync(BASE_PATH + commonFile, { encoding: "utf-8" }), context, {
		filename: commonFile,
	});

	// Only patch `CommonGet` after loading `Common`, lest our monkey patch will be overriden again
	context.CommonGet = (file, callback) => {
		const data = fs.readFileSync(`../../${file}`, "utf8");
		const obj = {
			status: 200,
			responseText: data,
		};
		callback.bind(obj)(obj);
	};
	for (const file of neededFiles) {
		vm.runInContext(fs.readFileSync(BASE_PATH + file, { encoding: "utf-8" }), context, {
			filename: file,
		});
	}

	/** @type {AssetGroupDefinition[]} */
	const AssetFemale3DCG = sanitizeVMOutput(context.AssetFemale3DCG);
	/** @type {ExtendedItemMainConfig} */
	const AssetFemale3DCGExtended = sanitizeVMOutput(context.AssetFemale3DCGExtended);
	/** @type {TestingStruct<string>[]} */
	const missingColorLayers = sanitizeVMOutput(context.TestingMisingColorLayers);
	/** @type {TestingStruct<string>[]} */
	const missingColorGroups = sanitizeVMOutput(context.TestingMisingColorGroups);
	/** @type {TestingStruct<string[]>[]} */
	const invalidColorDefaults = sanitizeVMOutput(context.TestingInvalidDefaultColor);

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
				const assetConfig = groupConfig[Asset.Name];
				if (assetConfig) {
					const archetype = assetConfig.Archetype;
					if (archetype === "typed") {
						const HasSubscreen = !localError && assetConfig.Options?.some(option => !!option.HasSubscreen);
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
					if (archetype === "typed" && Asset.AllowType !== undefined) {
						error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowType`);
					}
				}
			}

			if (Array.isArray(Asset.Layer)) {
				if (Asset.Layer.length === 0) {
					error(`${Group.Group}:${Asset.Name}: Asset must contain at least one layer when explicitly specified`);
				}
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

	testDynamicGroupName(AssetFemale3DCG);
	testExtendedItemDialog(AssetFemale3DCGExtended, dialogArray);
	testColorGroups(missingColorGroups);
	testColorLayers(missingColorLayers);
	testModuleOptionLength(AssetFemale3DCGExtended);
	testDefaultColor(invalidColorDefaults);
})();
