"use strict";

/**
 * A lookup mapping the gag effect names to their corresponding gag level numbers.
 * @type {Object.<string,number>}
 * @constant
 */
var SpeechGagLevelLookup = {
	GagTotal4: 20,
	GagTotal3: 16,
	GagTotal2: 12,
	GagTotal: 8,
	GagVeryHeavy: 7,
	GagHeavy: 6,
	GagMedium: 5,
	GagNormal: 4,
	GagEasy: 3,
	GagLight: 2,
	GagVeryLight: 1,
};

/**
 * Analyzes a phrase to determine if it is a full emote. A full emote is a phrase wrapped in "()"
 * @param {string} D - A phrase
 * @returns {boolean} - Returns TRUE if the current speech phrase is a full emote (all between parentheses)
 */
function SpeechFullEmote(D) {
	return ((D.indexOf("(") == 0) && (D.indexOf(")") == D.length - 1));
}

/**
 * Returns the gag level corresponding to the given effect array, or 0 if the effect array contains no gag effects
 * @param {string[]} Effect - The effect to lookup the gag level for
 * @return {number} - The gag level corresponding to the given effects
 */
function SpeechGetEffectGagLevel(Effect) {
	return Effect.reduce((Modifier, EffectName) => Modifier + (SpeechGagLevelLookup[EffectName] || 0), 0);
}

/**
 * Gets the cumulative gag level of an asset group. Each gagging effect has a specific numeric value. The following
 * Effect arrays are used for the calculation:
 *     - Item.Property.Effect
 *     - Item.Asset.Effect
 *     - Item.Asset.Group.Effect
 * @param {Character} C - The character, whose assets are used for the check
 * @param {string[]} AssetGroups - The name of the asset groups to look through
 * @returns {number} - Returns the total gag effect of the character's assets
 */
function SpeechGetGagLevel(C, AssetGroups) {
	const effects = CharacterGetEffects(C, AssetGroups, true);
	return SpeechGetEffectGagLevel(effects);
}

/**
 * Gets the cumulative gag level of a character
 * @param {Character} C - The character, whose assets are used for the check
 * @param {boolean} [NoDeaf=false] - Whether or not deafness affects the dialogue
 * @returns {number} - Returns the total gag effect of the character's assets
 */
function SpeechGetTotalGagLevel(C, NoDeaf=false) {
	let GagEffect = SpeechGetGagLevel(C, ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemHood", "ItemNeck", "ItemDevices"]);

	if (C.ID != 0 && !NoDeaf) {
		if (Player.GetDeafLevel() >= 7) GagEffect = Math.max(GagEffect, 20);
		else if (Player.GetDeafLevel() >= 6) GagEffect = Math.max(GagEffect, 16);
		else if (Player.GetDeafLevel() >= 5) GagEffect = Math.max(GagEffect, 12);
		else if (Player.GetDeafLevel() >= 4) GagEffect = Math.max(GagEffect, 8);
		else if (Player.GetDeafLevel() >= 3) GagEffect = Math.max(GagEffect, 6);
		else if (Player.GetDeafLevel() >= 2) GagEffect = Math.max(GagEffect, 4);
		else if (Player.GetDeafLevel() >= 1) GagEffect = Math.max(GagEffect, 2);
	}
	return GagEffect;
}

/**
 * Processes the character's speech, anything between parentheses isn't touched. Effects alter the speech differently according to a character's language. Effects that can be applied are the following: gag talk, baby talk and stuttering.
 * @param {Character} C - The character, whose dialog might need to be altered
 * @param {string} CD - The character's dialog to alter
 * @param {boolean} [NoDeaf=false] - Whether or not deafness affects the dialogue
 * @returns {string} - Returns the dialog after speech effects were processed (Garbling, Stuttering, Baby talk)
 */
function SpeechGarble(C, CD, NoDeaf=false) {
	let NS = CD;

	let GagEffect = SpeechGetTotalGagLevel(C, NoDeaf);


	if (GagEffect > 0) NS = SpeechGarbleByGagLevel(GagEffect, CD);

	// No gag effect, we return the regular text
	NS = SpeechStutter(C, NS);
	NS = SpeechBabyTalk(C, NS);

	return NS;
}

/**
 * A helper method to check if the character parsed in is one of the following: ' .?!~-'
 * @param {string} character - The character needs to be checked.
 * @returns {boolean} - true if containing one of the following: ' .?!~-', otherwise false.
 */
function isStandardPunctuationOrSpace(character) {
	return ' .?!~-'.includes(character);
}

/**
 * Helper method to strip diacritics from characters.
 * @param {string} character - character that needs to be stripped.
 * @param {Number} gagEffect - The current gag effect level.
 * @returns {string} - character that being stripped after garbling.
 */
function stripDiacriticsFromCharacter(character, gagEffect) {
	switch (character) {
		case 'á':
		case 'à':
		case 'ã':
		case 'â':
			return 'a';
		case 'é':
		case 'ê':
		case 'è':
		case 'ë':
			return 'e';
		case 'í':
		case 'î':
		case 'ì':
		case 'ï':
			return 'i';
		case 'ó':
		case 'ô':
		case 'ò':
		case 'õ':
			return 'o';
		case 'ú':
		case 'û':
		case 'ù':
		case 'ü':
			return 'u';
		case 'ñ':
			return gagEffect >= 5 ? 'm' : 'n';
		case 'ç':
			return gagEffect >= 5 ? 'h' : 's';
	}

	// if not any of the above, return itself.
	return character;
}

/**
 * check if the character is one of the following: áàãâéèêíìîõóòôúùûñç
 * @param {string} character - The character needs to be checked.
 * @returns {boolean} - true if is one of the above, otherwise false.
 */
function isAccentedOrLatinCharacter(character) {
	return 'áàãâéèêíìîõóòôúùûñç'.includes(character);
}


/**
 * The core of the speech garble function, usable without being tied to a specific character
 * @param {number} GagEffect - The gag level of the speech
 * @param {string} CD - The character's dialog to alter
 * @return {string} - Garbled text
 */
function SpeechGarbleByGagLevel(GagEffect, CD, IgnoreOOC) {

	// Variables to build the new string and check if we are in a parentheses
	var NS = "";
	var Par = false;
	if (CD == null) CD = "";
	if (GagEffect === 0) return CD;

	// GagTotal4 always returns mmmmm and muffles some frequent letters entirely, 75% least frequent letters
	for (let L = 0; L < CD.length; L++) {
		const H = CD.charAt(L).toLowerCase();
		if (H == "(" && !IgnoreOOC) Par = true;
		if (H == ")") Par = false;
		if (GagEffect >= 20) {
			if (Par) NS += CD.charAt(L);
			else {
				if (isStandardPunctuationOrSpace(H)) NS += H;
				else if ('zqjxkvbywgpfucdlhr'.includes(H)) NS += ' ';
				else NS += 'm';
			}
		}
	
		// GagTotal3 always returns mmmmm and muffles some relatively frequent letters entirely, 50% least frequent letters
		else if (GagEffect >= 16) {
			if (Par) NS += CD.charAt(L);
			else {
				if (isStandardPunctuationOrSpace(H)) NS += H;
				else if ('zqjxkvbywgpf'.includes(H)) NS += ' ';
				else NS += 'm';
			}
		}
	
		// GagTotal2 always returns mmmmm and muffles some less frequent letters entirely; 25% least frequent letters
		else if (GagEffect >= 12) {
			if (Par) NS += CD.charAt(L);
			else {
				if (isStandardPunctuationOrSpace(H)) NS += H;
				else if ('zqjxkv'.includes(H)) NS += ' ';
				else NS += 'm';
			}
		}
	
		// Total gags always returns mmmmm
		else if (GagEffect >= 8) {
			if (Par) NS += CD.charAt(L);
			else {
				if (isStandardPunctuationOrSpace(H)) NS += H;
				else NS += 'm';
			}
		}
	
		// VeryHeavy garble - Close to no letter stays the same
		else if (GagEffect >= 7) {
			if (!Par) {
				// Regular characters
				if ('aeiouy'.includes(H)) NS += 'e';
				if ('jklr'.includes(H)) NS += 'a';
				if ('szh'.includes(H)) NS += 'h';
				if ('dfgnmwtcqxpv'.includes(H)) NS += 'm';
				if (isStandardPunctuationOrSpace(H) || H == 'b') NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect);

				// Cyrillic characters
				if ('иоуюля'.includes(H)) NS += 'e';
				if ('йх'.includes(H)) NS += 'к';
				if ('жклру'.includes(H)) NS += 'a';
				if ('зсгй'.includes(H)) NS += 'г';
				if ('брвы'.includes(H)) NS += 'ф';
				if ('дфгнм'.includes(H)) NS += 'м';

			} else NS += CD.charAt(L);
		}
	
		// Heavy garble - Almost no letter stays the same
		else if (GagEffect >= 6) {
			if (!Par) {
				// Regular characters
				if ('aeiouyt'.includes(H)) NS += 'e';
				if ('cqx'.includes(H)) NS += 'k';
				if ('jklrw'.includes(H)) NS += 'a';
				if ('szh'.includes(H)) NS += 'h';
				if ('bpv'.includes(H)) NS += 'f';
				if ('dfgnm'.includes(H)) NS += 'm';
				if (isStandardPunctuationOrSpace(H)) NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect);

				// Cyrillic characters
				if ('иоюля'.includes(H)) NS += 'e';
				if ('cйх'.includes(H)) NS += 'к';
				if ('жклр'.includes(H)) NS += 'a';
				if ('зсгй'.includes(H)) NS += 'г';
				if ('брвы'.includes(H)) NS += 'ф';
				if ('дфгнм'.includes(H)) NS += 'м';

			} else NS += CD.charAt(L);
		}
	
		// Medium garble - Some letters stays the same
		else if (GagEffect >= 5) {
			if (!Par) {
				// Regular characters
				if ('eiouyt'.includes(H)) NS += 'e';
				if ('cqxk'.includes(H)) NS += 'k';
				if ('jlrwa'.includes(H)) NS += 'a';
				if ('szh'.includes(H)) NS += 'h';
				if ('bpv'.includes(H)) NS += 'f';
				if ('dfgm'.includes(H)) NS += 'm';
				if (isStandardPunctuationOrSpace(H) || H == 'n') NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect);

				// Cyrillic characters
				if ('aиоуюля'.includes(H)) NS += 'e';
				if ('cйх'.includes(H)) NS += 'к';
				if ('жклр'.includes(H)) NS += 'a';
				if ('зсгй'.includes(H)) NS += 'г';
				if ('брвы'.includes(H)) NS += 'ф';
				if ('дфгнм'.includes(H)) NS += 'м';

			} else NS += CD.charAt(L);
		}
	
		// Normal garble, keep vowels and a few letters the same
		else if (GagEffect >= 4) {
			if (!Par) {
				// Regular characters
				if ('vbct'.includes(H)) NS += 'e';
				if ('qkx'.includes(H)) NS += 'k';
				if ('wyjlr'.includes(H)) NS += 'a';
				if ('sz'.includes(H)) NS += 'h';
				if ('df'.includes(H)) NS += 'm';
				if (H == "p") NS += 'f';
				if (H == "g") NS += 'n';
				if (isStandardPunctuationOrSpace(H) || 'aeioumnh'.includes(H)) NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect);

				// Cyrillic characters
				if ('вфбп'.includes(H)) NS += 'фы';
				if ('гкх'.includes(H)) NS += 'к';
				if ('вужлр'.includes(H)) NS += 'а';
				if ('ся'.includes(H)) NS += 'х';
				if ('дф'.includes(H)) NS += 'м';
				if (H == "р") NS += 'ф';
				if (H == "г") NS += 'н';

			} else NS += CD.charAt(L);
		}
	
		// Easy garble, keep vowels and a some letters the same
		else if (GagEffect >= 3) {
			if (!Par) {
				// Regular characters
				if ('vbct'.includes(H)) NS += 'e';
				if ('qkx'.includes(H)) NS += 'k';
				if ('wyjlr'.includes(H)) NS += 'a';
				if ('sz'.includes(H)) NS += 's';
				if (H == "d") NS += 'm';
				if (H == "p") NS += 'f';
				if (H == "g") NS += 'h';
				if (isStandardPunctuationOrSpace(H) || 'aeioumnhf'.includes(H)) NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect);

				// Cyrillic characters
				if ('вфбп'.includes(H)) NS += 'фы';
				if ('гкх'.includes(H)) NS += 'к';
				if ('вужлр'.includes(H)) NS += 'а';
				if ('ся'.includes(H)) NS += 'х';
				if ('дф'.includes(H)) NS += 'м';
				if (H == "р") NS += 'ф';
				if (H == "г") NS += 'н';

			} else NS += CD.charAt(L);
		}
	
		// Light garble, half of the letters stay the same
		else if (GagEffect >= 2) {
			if (!Par) {
				// Regular characters
				if ('ct'.includes(H)) NS += 'e';
				if ('qkx'.includes(H)) NS += 'k';
				if (H == "p") NS += 'f';
				if (H == "g") NS += 'n';
				if (H == "s") NS += 'z';
				if (H == "z") NS += 's';
				if (H == "f") NS += 'h';
				if ('dmg'.includes(H)) NS += 'm';
				if ('bhnvwp'.includes(H) || isStandardPunctuationOrSpace(H) || 'aeiouy'.includes(H)) NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect); 

				// Cyrillic characters
				if ('чц'.includes(H)) NS += 'e';
				if ('йфв'.includes(H)) NS += 'к';
				if ('длщя'.includes(H)) NS += 'a';
				if (H == "з") NS += 'c';
				if (H == "с") NS += 'з';
				if ('дфмг'.includes(H)) NS += 'м';
				if ('апрокенмит'.includes(H)) NS += H;

			} else NS += CD.charAt(L);
		}
	
		// Very Light garble, most of the letters stay the same
		else if (GagEffect >= 1) {
			if (!Par) {
				// Regular characters
				if (H == "t") NS += 'e';
				if ('cqkx'.includes(H)) NS += 'k';
				if ('jlr'.includes(H)) NS += 'a';
				if ('dmg'.includes(H)) NS += 'm';
				if ('bhnvwp'.includes(H) || isStandardPunctuationOrSpace(H) || 'aeiouyfsz'.includes(H)) NS += H;

				// Accents/Latin characters
				if (isAccentedOrLatinCharacter(H)) NS += stripDiacriticsFromCharacter(H, GagEffect);

				// Cyrillic characters
				if ('чц'.includes(H)) NS += 'e';
				if ('йфв'.includes(H)) NS += 'к';
				if ('длщя'.includes(H)) NS += 'a';
				if (H == "з") NS += 'c';
				if (H == "с") NS += 'з';
				if ('дфмг'.includes(H)) NS += 'м';
				if ('апрокенмит'.includes(H)) NS += H;

			} else NS += CD.charAt(L);
		}
	}

	return NS;
}

/**
 * Makes the character stutter if she has a vibrating item and/or is aroused. Stuttering based on arousal is toggled in the character's settings.
 * @param {Character} C - The character, whose dialog might need to be altered
 * @param {string} CD - The character's dialog to alter
 * @returns {string} - Returns the dialog after the stuttering factor was applied
 */
function SpeechStutter(C, CD) {

	// Validate nulls
	if (CD == null) CD = "";

	// Validates that the preferences allow stuttering
	if ((C.ArousalSettings == null) || (C.ArousalSettings.AffectStutter !== "None")) {

		// Gets the factor from current arousal
		var Factor = 0;
		if ((C.ArousalSettings == null) || (C.ArousalSettings.AffectStutter == null) || (C.ArousalSettings.AffectStutter == "Arousal") || (C.ArousalSettings.AffectStutter == "All"))
			if ((C.ArousalSettings != null) && (C.ArousalSettings.Progress != null) && (typeof C.ArousalSettings.Progress === "number") && !isNaN(C.ArousalSettings.Progress))
				Factor = Math.floor(C.ArousalSettings.Progress / 20);

		// Checks all items that "eggs" with an intensity, and replaces the factor if it's higher
		if (C.IsEgged() && ((C.ArousalSettings == null) || (C.ArousalSettings.AffectStutter == null) || (C.ArousalSettings.AffectStutter == "Vibration") || (C.ArousalSettings.AffectStutter == "All")))
			for (let A = 0; A < C.Appearance.length; A++) {
				var Item = C.Appearance[A];
				if (InventoryItemHasEffect(Item, "Egged", true) && Item.Property && Item.Property.Intensity && (typeof Item.Property.Intensity === "number") && !isNaN(Item.Property.Intensity) && (Item.Property.Intensity > Factor))
					Factor = Item.Property.Intensity;
			}

		// If the intensity factor is lower than 1, no stuttering occurs and we return the regular text
		if (Factor <= 0) return CD;

		// Loops in all letters to create a stuttering effect
		var Par = false;
		var CS = 1;
		var Seed = CD.length;
		for (let L = 0; L < CD.length; L++) {

			// Do not stutter the letters between parentheses
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;

			// If we are not between brackets and at the start of a word, there's a chance to stutter that word
			if (!Par && CS >= 0 && (H.match(/[[a-zа-яё]/i))) {

				// Generate a pseudo-random number using a seed, so that the same text always stutters the same way
				var R = Math.sin(Seed++) * 10000;
				R = R - Math.floor(R);
				R = Math.floor(R * 10) + Factor;
				if (CS == 1 || R >= 10) {
					CD = CD.substring(0, L) + CD.charAt(L) + "-" + CD.substring(L, CD.length);
					L += 2;
				}
				CS = -1;
			}
			
			if (H == " ") CS = 0;
		}
		return CD;

	}

	// No stutter effect, we return the regular text
	return CD;

}

/**
 * Makes the character talk like a Baby when she has drunk regression milk
 * @param {Character} C - The character, whose dialog needs to be altered
 * @param {string} CD - The character's dialog to alter
 * @returns {string} - Returns the dialog after baby talk was applied
 */
function SpeechBabyTalk(C, CD) {
	if (CD == null) CD = "";

	var Par = false;
	var NS = "";

	if (C.Effect.indexOf("RegressedTalk") >= 0) {
		for (let L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if ('kl'.includes(H)) NS += 'w';
				if (H == "s") NS = NS += 'sh';
				if (H == "t") NS = NS += 'st';
				if (H.match('[a-z ?!.,]')) NS += H;
			} else NS += CD.charAt(L);
			
		}
		return NS;
	}

	// Not drunk the milk, we return the regular text
	return CD;
}
