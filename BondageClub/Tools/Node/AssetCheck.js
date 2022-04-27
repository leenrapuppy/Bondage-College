"use strict";
const vm = require("vm");
const fs = require("fs");
const dirTree = require("directory-tree");

const BASE_PATH = "../../";
// Files needed to check the Female3DCG assets
const neededFiles = [
	"Scripts/Common.js",
	"Scripts/Dialog.js",
	"Scripts/ModularItem.js",
	"Scripts/TypedItem.js",
	"Screens/Inventory/Futuristic/Futuristic.js",
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
	str = str.trim();

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

const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

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
	const PoseFemale3DCG = JSON.parse(JSON.stringify(context.PoseFemale3DCG));

	if (!Array.isArray(AssetFemale3DCG)) {
		error("AssetFemale3DCG not found");
		return;
	}

	const assetDescriptions = loadCSV("Assets/Female3DCG/Female3DCG.csv", 3);

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
						const Overrides = assetConfig.Config;
						const { GroupName, AssetName } = assetConfig.CopyConfig;
						assetConfig = (AssetFemale3DCGExtended[GroupName || Group.Group] || {} )[AssetName];
						if (!assetConfig) {
							error(`Asset ${Group.Group}:${Asset.Name}: CopyConfig target not found!`);
							assetConfig = groupConfig[Asset.Name];
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
							}
						}
					}
					if (assetConfig.Archetype === "typed" && Asset.AllowType !== undefined) {
						error(`Asset ${Group.Group}:${Asset.Name}: Assets using "typed" archetype should NOT set AllowType`);
					}
					if (!["modular", "typed"].includes(assetConfig.Archetype)) {
						error(`Extended asset archetype for ${Group.Group}:${Asset.Name}: Unknown Archetype ${assetConfig.Archetype}`);
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
			// Ignore SpankingToys, because it's a snowflake
			if (Asset.Name === "SpankingToys" && Group.Group !== "ItemHands") continue;


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

	// Use this to only get some assets looked at
	/** @type {[string, string][]} */
	const AssetFocus = [
	];
	const AssetBasePath = BASE_PATH + "Assets/Female3DCG/";
	const AllAssetFiles = dirTree(AssetBasePath, { extensions: /\.png/ });

	// Build the list of known pose identifiers. BaseUpper gets substitued by ""
	// because it's the default pose
	const KnownPoses = new Set(PoseFemale3DCG.map(p => ["BaseUpper", "BaseLower"].includes(p.Name) ? "" : p.Name));

	let AssetIssues = 0;
	// Check for asset files
	for (const Group of Groups) {
		if (Group.Group === "Height") continue;
		if (AssetFocus.length && !AssetFocus.some(f => Group.Group === f[0])) continue;

		for (const Asset of Assets[Group.Group]) {
			if (Asset.Name.startsWith('SpankingToys')) continue;
			if (AssetFocus.length && !AssetFocus.some(f => Asset.Name === f[1])) continue;
			// console.info(`Processing ${Group.Group}/${Asset.Name}`);

			// Collect supported poses from the asset and group
			let SupportedPoses = new Set();

			// Push the default pose there
			SupportedPoses.add("");

			// If there are no poses, default to the group's
			if (!Asset.AllowPose)
				Group.AllowPose?.forEach(p => SupportedPoses.add(p));
			else
				Asset.AllowPose?.forEach(p => SupportedPoses.add(p));

			// Select all the files that match that asset from the full list
			let GroupName = (Asset.DynamicGroupName || Group.DynamicGroupName || Group.Group);
			const AssetGroupFiles = AllAssetFiles.children?.find(e => e.name === GroupName)?.children;
			if (!AssetGroupFiles) process.exit();

			// console.log("AssetGroupFiles:", GroupName, AssetGroupFiles.length);

			// Build the "master list" of all files for that asset
			/** @type {Map<string, "exists"|"matched"|"missing">} */
			let AssetFiles = new Map();

			const checkAssetPrefix = (Pose, file) => {
				// Make sure we don't accidentally use files that share a prefix
				const isPrefix = Assets[Group.Group].find(a => {
					if (a.Name === Asset.Name) {
						return false;
					}

					if (file.name.startsWith(a.Name)) {
						// Check the lengths too: an asset matching a shorter
						// prefix than ours does not belong there.
						if (a.Name.length < Asset.Name.length && file.name.startsWith(Asset.Name)) {
							return false;
						}
						return true;
					}
				});

				if (isPrefix) {
					return false;
				}

				return true;
			}

			// First handle the default pose files
			AssetGroupFiles
				.filter(e => e.name.startsWith(Asset.Name) && e.name.endsWith(".png"))
				.forEach(e => { if (checkAssetPrefix("", e)) AssetFiles.set(e.name, 'exists') });

			for (const Pose of KnownPoses.values()) {
				if (Pose === "") continue;

				AssetGroupFiles.find(e => e.name === Pose)?.children
					.filter(e => e.name.startsWith(Asset.Name) && e.name.endsWith(".png"))
					.forEach(e => {
						if (checkAssetPrefix(Pose, e)) AssetFiles.set(Pose + "/" + e.name, 'exists')
					});
			}

			/** @type {string[]} */
			let SupportedTypes = [""];
			if (Asset.Extended) {
				// Load extended data and perform config copying
				let ExtendedData = AssetFemale3DCGExtended[Group.Group]?.[Asset.Name];
				if (ExtendedData?.CopyConfig) {
					ExtendedData = AssetFemale3DCGExtended[ExtendedData.CopyConfig.GroupName]?.[ExtendedData.CopyConfig.AssetName];
				}

				// console.log(`${Group.Group}/${Asset.Name} is extended: ${JSON.stringify(ExtendedData, null, " ")}`);
				if (ExtendedData) {
					switch (ExtendedData.Archetype) {
						case "typed":
							SupportedTypes = ExtendedData.Config.Options.map(opts => {
								let Type = opts.Property['Type'];
								return Type ? Type : "";
							});
							break;
						case "modular":
							SupportedTypes = ExtendedData.Config.Modules.map(mods => {
								return mods.Options.map((o, idx) => mods['Key'] + idx);
							});

							SupportedTypes = cartesian(...SupportedTypes).map(t => t.join(''));
							break;
						default:
							error("don\'t know what to do with " + ExtendedData.Archetype);
					}
					// console.log(`built ${ExtendedData.Archetype} types for ${Group.Group}/${Asset.Name}: ${JSON.stringify(SupportedTypes)}`);
				}
			}

			// Create the list of layers
			const IsLayered = !!Asset?.Layer;
			const Layers = Asset?.Layer || [];
			if (!IsLayered) {
				// console.log("non-layered");
			 	Layers.push({ Name: "" });
			}

			// Handle non-layered assets or layered assets with no lock layer
			if (Asset.AllowLock && Asset.DrawLocks == null && !Layers.some(l => l?.LockLayer)) {
				// console.log("lockable without explicit lock layer");
				Layers.push({ Name: "Lock", LockLayer: true, ParentGroup: null });
			}

			let LayerFiles = [];
			for (const Layer of Layers) {
				// console.log(`generating filename for layer ${Layer.Name}`);
				if (!Layer.HasImage && Layer.HasImage !== undefined) {
					// console.log(`no image: ${Group.Group}/${Asset.Name}/${Layer.Name}: ${Layer.HasImage}`);
					continue;
				}

				// Filter poses actually supported by the asset
				let LayerSupportedPoses = new Set([...SupportedPoses]);
				Asset.HideForPose?.forEach(p => LayerSupportedPoses.delete(p));
				Layer.HideForPose?.forEach(p => LayerSupportedPoses.delete(p));

				// Get the list of supported body sizes
				const BodySizes = AssetGetBodySizes(Group, Asset, Layer)
				// No size needed, push an empty string to loop once
				if (!BodySizes.length) {
					BodySizes.push("");
				}
				// console.log(`size info for layer: ${Layer.Name}: ${JSON.stringify(BodySizes)}`);

				// Build the list of supported types and unique it
				const LayerTypeInfo = [];
				SupportedTypes.map(Type => AssetTypeInfoForLayer(Type, Asset, Layer))
					.forEach((t) => {
						if (!LayerTypeInfo.some(i => JSON.stringify(t) === JSON.stringify(i)))
							LayerTypeInfo.push(t);
					});

				// console.log(`type info for layer: ${JSON.stringify(SupportedTypes)}: ${JSON.stringify(LayerTypeInfo)}`);

				// Process that layer's data to build the name
				for (const Pose of LayerSupportedPoses) {
					for (const Size of BodySizes) {
						for (const TypeInfo of LayerTypeInfo) {
							const NameParts = [];

							// Push the asset name first.
							NameParts.push(Asset.Name);

							// We have a real size
							if (Size) {
								NameParts.push(Size);
							}
							if (TypeInfo)
								NameParts[NameParts.length - 1] += TypeInfo.TypeSuffix;

							// It's a layered item, add layer name
							if (TypeInfo?.LayerName)
								NameParts.push(TypeInfo.LayerName);
							else if (IsLayered) {
								NameParts.push(Layer.Name);
							}

							const Name = (Pose ? Pose + "/" : "") + NameParts.join('_') + ".png";
							// console.log("Asset name for layer:", Name);
							LayerFiles.push(Name);

							// Update the master list with the status
							let status = AssetFiles.get(Name);
							if (status && status !== "exists")
								console.log(`already processed ${Name}, ${status}, might be a bug`);

							if (AssetFiles.has(Name))
								AssetFiles.set(Name, "matched");
							else
								AssetFiles.set(Name, "missing");
						}
					}
				}
			}
			// Sort the files so they get grouped together
			LayerFiles = LayerFiles.sort();

			let issues = [...AssetFiles].filter(([k, v]) => ["missing", "exists"].includes(v));
			if (issues.length > 0) {
				error(`${Group.Group}/${Asset.Name}: ${AssetFiles.size} files detected, ${issues.length} issues found:`);
				for (const [file, status] of issues) {
					console.info(`       file ${status}: ${GroupName}/${file}`);
				}

				console.log("Poses: ", SupportedPoses);
				console.log("Layers: ", Asset.Layer?.map(l => l.Name) || "none");
				// console.log("Generated filenames: ", LayerFiles);
				console.log();
				AssetIssues += 1;
			} else {
				// console.log(`No issue with ${Group.Group}/${Asset.Name}`);
			}
		}
	}
	if (AssetIssues > 0) {
		error(`Found ${AssetIssues} assets with issues`);
		process.exit();
	}
})();

/**
 * @param {AssetGroupDefinition} Group
 * @param {AssetDefinition} Asset
 * @param {AssetLayerDefinition} [Layer]
 */
function AssetGetBodySizes(Group, Asset, Layer) {
	// console.info(Asset.Name, Asset.ParentGroup, Group.ParentGroup, Group.ParentSize);
	let ParentGroupName = Layer?.ParentGroup;
	if (typeof ParentGroupName === "undefined") ParentGroupName = Asset?.ParentGroup;
	if (typeof ParentGroupName === "undefined") ParentGroupName = Group?.ParentGroup;

	if (!ParentGroupName)
		return [];

	return ["Small", "Normal", "Large", "XLarge"];
}

/**
 * @param {string} Type
 * @param {AssetDefinition} Asset
 * @param {AssetLayerDefinition} Layer
 */
function AssetTypeInfoForLayer(Type, Asset, Layer) {
	// console.log(`AssetTypeInfoForLayer(${Type}, ${JSON.stringify(Layer)})`);
	let LayerName = "";
	let TypeSuffix = Type;

	if (Layer.Name) LayerName = Layer.Name;
	// Defaults to true when not set
	if (Layer.HasType === false || Layer.HasType === undefined && Asset.HasType === false) {
		TypeSuffix = "";
	}
	// If this is a lock layer, check that this type needs it
	if (Layer.LockLayer && Asset.AllowLockType && !Asset.AllowLockType.includes(Type)) {
		return null;
	}

	if (Layer.ModuleType) {
		const parsedTypes = Type.split(/([0-9]+)/);
		TypeSuffix = Layer.ModuleType.map(key => {
			if (!Type) return key + "0";
			const keyIndex = parsedTypes.indexOf(key);
			const moduleOption = keyIndex === -1 ? "0" : parsedTypes[keyIndex + 1];
			return Layer.ModuleType + moduleOption;
		}).join("");
	}

	// console.log(`AssetTypeInfoForLayer => ["${LayerName}", "${TypeSuffix}"]`);
	return { LayerName: LayerName, TypeSuffix: TypeSuffix };
}
