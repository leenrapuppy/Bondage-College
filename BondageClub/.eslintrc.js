"use strict";
module.exports = {
	extends: ["eslint:recommended", "plugin:compat/recommended"],
	env: {
		browser: true,
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	root: true,
	plugins: [
		'sort-keys-custom',
		'compat'
	],
	ignorePatterns: [
		"Scripts/lib/**/*.js",
		"*.min.js",
		"Screens/MiniGame/KinkyDungeon/*.js"
	],
	settings: {
		polyfills: [
			// Notification is not supported in iOS Safari 14.5-14.8
			"Notification",
		],
	},
	rules: {
		"dot-notation": "error",
		"no-unused-expressions": "error",
		"no-caller": "error",
		"no-eval": "error",
		"no-new-wrappers": "error",
		"no-throw-literal": "error",
		"no-shadow": ["warn", { "hoist": "all" }],
		"strict": ["error", "global"],
		"no-constant-condition": ["error", { "checkLoops": false }],
		"no-unused-vars": ["warn", { "vars": "local", "args": "none" }],
		"no-trailing-spaces": "warn",
		"semi": "warn",
		"indent": ["warn", "tab", { "SwitchCase": 1, "ignoredNodes": ["ConditionalExpression"] }],
		"unicode-bom": ["error", "never"],
		"eol-last": "error",
		"no-tabs": ["warn", { "allowIndentationTabs": true }],
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		// Until globals are properly documented
		"no-undef": "off",
		"no-var": "off"
	},
	overrides: [
		{
			files: ['Female3DCG.js'],
			rules: {
				'sort-keys-custom/sort-keys-custom': [
					'off', [
						// Object key sort order for assets and asset groups
						'Name', // Assets
						'Group', // Asset Groups
						'ParentGroup', // Asset Groups
						'ParentSize', // Asset Groups
						'ParentColor', // Asset Groups
						'Category', // Asset Groups
						'Priority', // Both
						'Value', // Assets
						'Difficulty', // Assets
						'SelfBondage', // Assets
						'Time', // Assets
						'RemoveTime', // Assets
						'Enable', // Assets
						'Visible', // Assets
						'Default', // Asset Groups
						'Clothing', // Asset Groups
						'Underwear', // Asset Groups
						'Random', // Both
						'Wear', // Assets
						'IsRestraint', // Both
						'AllowLock', // Assets
						'OwnerOnly', // Assets
						'LoverOnly', // Assets
						'Blink', // Asset Groups
						'Left', // Both
						'Top', // Both
						'DefaultColor', // Assets
						'BuyGroup', // Assets
						'Prerequisite', // Assets
						'Hide', // Assets
						'HideItem', // Assets
						'FullAlpha', // Asset Groups
						'AllowNone', // Asset Groups
						'AllowColorize', // Asset Groups
						'AllowCustomize', // Asset Groups
						'AllowPose', // Both
						'SetPose', // Both
						'Effect', // Both
						'Zone', // Asset Groups
						'Activity', // Both
					], 'asc',
				],
			},
		},
	],
};
