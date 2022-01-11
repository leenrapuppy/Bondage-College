"use strict";

window.__vash_utils = (function _() {
	const randomInt = (min, max) =>
		Math.floor(Math.random() * (max  + 1 - min) + min);

	const integrateRoomToWorld = (roomName, props) => {
		Object.entries(props).forEach(([prop, value]) => {
			const key = `${roomName}${prop}`;
			if (window[key] !== undefined) {
				console.warn(`Attempt to override window property "${key}" while integrating room "${roomName}"`);
			} else {
				window[key] = value;
			}
		});
	};

	const setPlayerGameData = (path, value) => {
		const pathChains = path.split('.');
		if (!Player.Game) {
			Player.Game = {};
		}
		let pointer = Player.Game;
		while (pathChains.length > 1) {
			const key = pathChains.shift();
			if (!pointer[key]) pointer[key] = {};
			pointer = pointer[key];
		}
		pointer[pathChains[0]] = value;
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	};

	const readPlayerGameData = (path) => {
		const pathChains = path.split('.');
		if (!Player.Game) {
			Player.Game = {};
		}
		return pathChains.reduce((pointer, key) => pointer && pointer[key], Player.Game);
	};

	const getRandomItem = (array) => {
		const index = randomInt(0, array.length - 1);
		return array[index];
	};

	const sum = list => list.reduce((a, i) => a + i, 0);
	const complement = predicate => (...props) => !predicate(...props);
	const pipe = (...funcs) => argument => funcs.reduce((arg, func) => func(arg), argument);
	const anyPass = (predicates) => (...props) => predicates.some(p => p(...props));

	return {
		integrateRoomToWorld,
		setPlayerGameData,
		readPlayerGameData,
		getRandomItem,
		sum,
		complement,
		pipe,
		anyPass,
	};
})();
