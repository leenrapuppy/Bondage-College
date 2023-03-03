"use strict";

/**
 * A module with helper utilities for testing.
 * Note that this file and its content therein should only be executed when running
 * the `AssetCheck` test suit, and should therefore *not* be added to `index.html`.
 *
 * NOTE: Make sure to declare module-level objects as `var` if they should appear in
 * the VM context output.
 */

/** @type {Set<string>} */
var TestingColorLayers;
/** @type {Set<string>} */
var TestingColorGroups;

/**
 * Gather all color-layers and -groups absent from their respective .csv files
 * @returns {[colorLayers: TestingMissingStruct[], colorGroups: TestingMissingStruct[]]}
 */
function TestingGetMissingColorLayersGroups() {
	if (typeof TestingColorLayers === "undefined" || typeof TestingColorGroups === "undefined") {
		throw new Error("Cannot run function outside of the test suite");
	}

	/** @type {TestingMissingStruct[]} */
	const missingLayers = [];
	/** @type {TestingMissingStruct[]} */
	const missingGroups = [];

	if (Asset.length === 0) {
		AssetLoadAll();
	}
	for (const a of Asset) {
		const item = { Asset: a };
		const Group = a.Group.Name;
		const Name = a.Name;
		const colorableLayers = ItemColorGetColorableLayers(item);
		const simpleMode = colorableLayers.length === 1;
		const colorGroups = ItemColorGetGroups(item, colorableLayers);

		for (const colorGroup of colorGroups) {
			if (colorGroup.name === null || simpleMode) {
				continue;
			}

			// Gather all missing groups
			const groupStruct = { Group, Name, Missing: `${Group}${Name}${colorGroup.name}` };
			if (colorGroup.layers.length !== 1 && !TestingColorGroups.has(groupStruct.Missing)) {
				missingGroups.push(groupStruct);
			}

			// Gather all missing layers
			for (const colorLayer of colorGroup.layers) {
				const layerStruct = { Group, Name, Missing: `${Group}${Name}${colorLayer.Name || ""}` };
				const struct = (colorGroup.layers.length === 1) ? groupStruct : layerStruct;
				if (!TestingColorLayers.has(struct.Missing)) {
					missingLayers.push(struct);
				}
			}
		}
	}
	return [missingLayers, missingGroups];
}

var [TestingMisingColorLayers, TestingMisingColorGroups] = TestingGetMissingColorLayersGroups();
