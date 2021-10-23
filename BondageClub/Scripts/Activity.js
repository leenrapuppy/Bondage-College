"use strict";
var ActivityDictionary = null;

/**
 * Loads the activity dictionary that will be used throughout the game to output messages. Loads from cache first if possible.
 * @return {void} - Nothing
 */
function ActivityDictionaryLoad() {

	// Tries to read it from cache first
	var FullPath = "Screens/Character/Preference/ActivityDictionary.csv";
	var TranslationPath = FullPath.replace(".csv", "_" + TranslationLanguage + ".txt");

	if (CommonCSVCache[FullPath]) {
		ActivityDictionary = JSON.parse(JSON.stringify(CommonCSVCache[FullPath]));
	} else {
		// Opens the file, parse it and returns the result in an object
		CommonGet(FullPath, function () {
			if (this.status == 200) {
				CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
				ActivityDictionary = JSON.parse(JSON.stringify(CommonCSVCache[FullPath]));
			}
		});
	}

	// If a translation file is available, we open the txt file and keep it in cache
	if (TranslationAvailable(TranslationPath))
		CommonGet(TranslationPath, function () {
			if (this.status == 200) {
				TranslationCache[TranslationPath] = TranslationParseTXT(this.responseText);
				ActivityTranslate(TranslationPath);
			}
		});

	ActivityTranslate(TranslationPath);
}

/**
 * Translates the activity dictionary.
 * @param {string} CachePath - Path to the language cache.
 */
function ActivityTranslate(CachePath) {
	if (!Array.isArray(TranslationCache[CachePath])) return;

	for (let T = 0; T < ActivityDictionary.length; T++) {
		if (ActivityDictionary[T][1]) {
			let indexText = TranslationCache[CachePath].indexOf(ActivityDictionary[T][1].trim());
			if (indexText >= 0) {
				ActivityDictionary[T][1] = TranslationCache[CachePath][indexText + 1];
			}
		}
	}
}

/**
 * Searches in the dictionary for a specific keyword's text
 * @param {string} KeyWord - Tag of the activity description to search for
 * @returns {string} - Description associated to the given keyword
 */
function ActivityDictionaryText(KeyWord) {
	for (let D = 0; D < ActivityDictionary.length; D++)
		if (ActivityDictionary[D][0] == KeyWord)
			return ActivityDictionary[D][1].trim();
	return "MISSING ACTIVITY DESCRIPTION FOR KEYWORD " + KeyWord;
}

/**
 * Resolve a group name to the correct group for activities
 * @param {string} family - The asset family for the named group
 * @param {string} groupname - The name of the group to resolve
 * @returns {AssetGroup | null} - The resolved group
 */
function ActivityGetGroupOrMirror(family, groupname) {
	const group = AssetGroupGet(family, groupname);
	if (group && group.MirrorActivitiesFrom != null) {
		const mirror = AssetGroupGet(family, group.MirrorActivitiesFrom);
		if (mirror) {
			return mirror;
		}
	}
	return group;
}

/**
 * Gets all groups that mirror or are mirrored by the given group name for activities. The returned array includes the
 * named group.
 * @param {string} family - The asset family for the named group
 * @param {string} groupName - The name of the group to resolve
 * @returns {AssetGroup[]} - The group and all groups from the same family that mirror or are mirrored by it
 */
function ActivityGetAllMirrorGroups(family, groupName) {
	return AssetActivityMirrorGroups.get(groupName) || [];
}

/**
 * Check if any activities are possible for a character's given group.
 * @param {Character} char - The character on which the check is done
 * @param {string} groupname - The group to check access on
 * @returns {boolean} Whether any activity is possible
 */
function ActivityPossibleOnGroup(char, groupname) {
	const characterNotEnclosedOrSelfActivity = ((!char.IsEnclose() && !Player.IsEnclose()) || char.ID == 0);
	if (!characterNotEnclosedOrSelfActivity || !ChatRoomAllowsArousalActivities() || !CharacterHasArousalEnabled(char))
		return false;

	const group = ActivityGetGroupOrMirror(char.AssetFamily, groupname);
	const zone = char.ArousalSettings.Zone.find(z => z.Name === group.Name);
	return zone && zone.Factor > 0;
}

/**
 * Check whether a given activity can be performed on a group
 * @param {Character} char - The character being targeted
 * @param {Activity} act - The activity to consider
 * @param {AssetGroup} group - The group to check
 * @returns {boolean} whether that activity's target is valid
 */
function ActivityHasValidTarget(char, act, group) {
	let targets = [];
	// If the player is targeting herself
	if (char.ID == 0) {
		if (act.TargetSelf || act.Prerequisite.includes("OnlySelf"))
			return act.TargetSelf.includes(group.Name);
	} else {
		targets = group.Activity;
	}
	return targets.includes(act.Name);
}

/**
 * Check that an activity is permitted by an actor's settings.
 * @param {Activity} activity - The activity to consider
 * @param {Character|PlayerCharacter} character - The character to check with
 * @param {boolean} onOther - Whether we look at doing to or being done on
 * @returns {boolean} whether the activity is permitted
 */
function ActivityCheckPermissions(activity, character, onOther) {
	if (character.ArousalSettings == null || character.ArousalSettings.Activity == null)
		return true;

	const activitySettings = character.ArousalSettings.Activity.find(a => a.Name === activity.Name);
	if (!activitySettings
		|| (onOther && activitySettings.Other != null && activitySettings.Other > 0)
		|| (!onOther && activitySettings.Self != null && activitySettings.Self > 0))
		return true;

	return false;
}

/**
 * Check that that a given prerequisite is met.
 * @param {string} prereq - The prerequisite to consider
 * @param {Character|PlayerCharacter} acting - The character performing the activity
 * @param {Character|PlayerCharacter} acted - The character being acted on
 * @param {AssetGroup} group - The group being acted on
 * @returns {boolean} whether the given activity's prerequisite are satisfied
 */
function ActivityCheckPrerequisite(prereq, acting, acted, group) {
	switch (prereq) {
		case "UseMouth":
			return !acting.IsMouthBlocked() && acting.CanTalk();
		case "UseTongue":
			return !acting.IsMouthBlocked();
		case "TargetMouthBlocked":
			return acted.IsMouthBlocked();
		case "IsGagged":
			return !acting.CanTalk();
		case "SelfOnly":
			return acting.IsPlayer() ? acted.IsPlayer()
				: acting.IsOnline() ? acting.MemberNumber === acted.MemberNumber
				: acting.AccountName === acted.AccountName;
		case "TargetKneeling":
			return acted.IsKneeling();
		case "UseHands":
			return acting.CanInteract();
		case "UseArms":
			return acting.CanInteract() || (!InventoryGet(acting, "ItemArms") && !InventoryGroupIsBlocked(acting, "ItemArms"));
		case "UseFeet":
			return acting.CanWalk();
		case "CantUseArms":
			return !acting.CanInteract() && (InventoryGet(Player, "ItemArms") || InventoryGroupIsBlocked(Player, "ItemArms"));
		case "CantUseFeet":
			return !acting.CanWalk();
		case "TargetCanUseTongue":
			return !acted.IsMouthBlocked();
		case "TargetMouthOpen":
			if (group.Name === "ItemMouth")
				return !InventoryGet(acted, "ItemMouth") || acted.IsMouthOpen();
			break;
		case "VulvaEmpty":
			if (group.Name === "ItemVulva")
				return !acted.IsVulvaFull();
			break;
		case "MoveHead":
			if (group.Name === "ItemHead")
				return !acted.IsFixedHead();
			break;
		case "ZoneAccessible":
			return ActivityGetAllMirrorGroups(acted.AssetFamily, group.Name).some((g) => !InventoryGroupIsBlocked(acted, g.Name, true));
		case "WearingPenetrationItem":
			return CharacterHasItemForActivity(acting, "Penetrate") && !acting.IsEnclose();
		case "ZoneNaked":
			if (group.Name === "ItemButt")
				return InventoryPrerequisiteMessage(acted, "AccessButt") === "" && !acted.IsPlugged();
			else if (group.Name === "ItemVulva")
				return (InventoryPrerequisiteMessage(acted, "AccessVulva") === "") && !acted.IsVulvaChaste();
			else if (group.Name === "ItemBreast" || group.Name === "ItemNipples")
				return (InventoryPrerequisiteMessage(acted, "AccessBreast") === "") && !acted.IsBreastChaste();
			else if (group.Name === "ItemBoots")
				return InventoryPrerequisiteMessage(acted, "NakedFeet") === "";
			else if (group.Name === "ItemHands")
				return InventoryPrerequisiteMessage(acted, "NakedHands") === "";
			break;
	}
	return true;
}

/**
 * Check that an activity's prerequisites are met.
 * @param {Activity} activity - The activity to consider
 * @param {Character|PlayerCharacter} acting - The character performing the activity
 * @param {Character|PlayerCharacter} acted - The character being acted on
 * @param {AssetGroup} group - The group being acted on
 * @returns {boolean} whether the given activity's prerequisite are satisfied
 */
function ActivityCheckPrerequisites(activity, acting, acted, group) {
	if (!activity.Prerequisite)
		return true;

	return activity.Prerequisite.every((pre) => ActivityCheckPrerequisite(pre, acting, acted, group));
}

/**
 * Builds the allowed activities on a group given the character's settings.
 * @param {Character} character - The character for which to build the activity dialog options
 * @param {string} groupname - The group to check
 * @return {Array} - The list of allowed activities
 */
function ActivityAllowedForGroup(character, groupname) {
	// Get the group and all possible activities
	let activities = AssetAllActivities(character.AssetFamily);
	let group = ActivityGetGroupOrMirror(character.AssetFamily, groupname);
	if (!activities || !group) return [];

	let allowed = activities.filter(activity => {
		// Item-related activity, skip
		if (activity.Name.indexOf("Item") >= 0)
			return false;

		// Validate that this activity can be done
		if (!ActivityHasValidTarget(character, activity, group))
			return false;

		// Make sure all the prerequisites are met
		if (!ActivityCheckPrerequisites(activity, Player, character, group))
			return false;

		// Ensure this activity is permitted for both actors
		if (!ActivityCheckPermissions(activity, Player, true)
			|| !ActivityCheckPermissions(activity, character, false))
			return false;

		// All checks complete, this activity is allowed
		return true;
	});

	// Sort allowed activities by their group declaration order
	return allowed.sort((a, b) => Math.sign(group.Activity.indexOf(a.Name) - group.Activity.indexOf(b.Name)));
}

/**
 * Calculates the effect of an activity performed on a zone
 * @param {Character} S - The character performing the activity
 * @param {Character} C - The character on which the activity is performed
 * @param {string|Activity} A - The activity performed
 * @param {string} Z - The group/zone name where the activity was performed
 * @param {number} [Count=1] - If the activity is done repeatedly, this defines the number of times, the activity is done.
 * If you don't want an activity to modify arousal, set this parameter to '0'
 * @return {void} - Nothing
 */
function ActivityEffect(S, C, A, Z, Count) {

	// Converts from activity name to the activity object
	if (typeof A === "string") A = AssetGetActivity(C.AssetFamily, A);
	if ((A == null) || (typeof A === "string")) return;
	if ((Count == null) || (Count == undefined) || (Count == 0)) Count = 1;

	// Calculates the next progress factor
	var Factor = (PreferenceGetActivityFactor(C, A.Name, (C.ID == 0)) * 5) - 10; // Check how much the character likes the activity, from -10 to +10
	Factor = Factor + (PreferenceGetZoneFactor(C, Z) * 5) - 10; // The zone used also adds from -10 to +10
	Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
	if ((C.ID != S.ID) && (((C.ID != 0) && C.IsLoverOfPlayer()) || ((C.ID == 0) && S.IsLoverOfPlayer()))) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
	Factor = Factor + ActivityFetishFactor(C) * 2; // Adds a fetish factor based on the character preferences
	Factor = Factor + Math.round(Factor * (Count - 1) / 3); // if the action is done repeatedly, we apply a multiplication factor based on the count
	ArousalSetTimedProgress(C, A, Z, Factor);

}

/**
 * Used for arousal events that are not activities, such as stimulation events
 * @param {Character} S - The character performing the activity
 * @param {Character} C - The character on which the activity is performed
 * @param {number} Amount - The base amount of arousal to add
 * @param {string} Z - The group/zone name where the activity was performed
 * @param {number} [Count=1] - If the activity is done repeatedly, this defines the number of times, the activity is done.
 * If you don't want an activity to modify arousal, set this parameter to '0'
 * @return {void} - Nothing
 */
function ActivityEffectFlat(S, C, Amount, Z, Count) {

	// Converts from activity name to the activity object
	if ((Amount == null) || (typeof Amount != "number")) return;
	if ((Count == null) || (Count == undefined) || (Count == 0)) Count = 1;

	// Calculates the next progress factor
	var Factor = Amount; // Check how much the character likes the activity, from -10 to +10
	Factor = Factor + (PreferenceGetZoneFactor(C, Z) * 5) - 10; // The zone used also adds from -10 to +10
	Factor = Factor + ActivityFetishFactor(C) * 2; // Adds a fetish factor based on the character preferences
	Factor = Factor + Math.round(Factor * (Count - 1) / 3); // if the action is done repeatedly, we apply a multiplication factor based on the count
	ArousalSetTimedProgress(C, null, Z, Factor);

}


/**
 * Calculates the progress one character does on another right away
 * @param {Character} Source - The character who performed the activity
 * @param {Character} Target - The character on which the activity was performed
 * @param {object} Activity - The activity performed
 * @returns {void} - Nothing
 */
function ActivityRunSelf(Source, Target, Activity) {
	if (ArousalIsInMode(Player, ["Hybrid", "Automatic"]) && (Source.ID == 0) && (Target.ID != 0)) {
		var Factor = (PreferenceGetActivityFactor(Player, Activity.Name, false) * 5) - 10; // Check how much the player likes the activity, from -10 to +10
		Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
		if (Target.IsLoverOfPlayer()) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
		ArousalSetTimedProgress(Player, Activity, "ActivityOnOther", Factor); // For activities on other, it cannot go over 2/3
	}
}

/**
 * Launches a sexual activity for a character and sends the chatroom message if applicable.
 * @param {Character} character - Character on which the activity was triggered
 * @param {Activity} activity - Activity performed
 * @param {string} groupname - Where is the activity performed
 * @returns {void} - Nothing
 */
function ActivityRun(character, activity, groupname) {
	let group = ActivityGetGroupOrMirror(character.AssetFamily, groupname);
	// If the player does the activity on herself or an NPC, we calculate the result right away
	if (ArousalIsInMode(character, ["Hybrid", "Automatic"]) && ((character.ID == 0) || character.IsNpc()))
			ActivityEffect(Player, character, activity, group.Name);

	if (character.ID == 0) {
		if (activity.MakeSound) {
			AutoPunishGagActionFlag = true;
			AutoShockGagActionFlag = true;
		}
	}

	// If the player does the activity on someone else, we calculate the progress for the player right away
	ActivityRunSelf(Player, character, activity);

	// The text result can be outputted in the chatroom or in the NPC dialog
	if (CurrentScreen == "ChatRoom") {

		// Publishes the activity to the chatroom
		var Dictionary = [];
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "TargetCharacter", Text: character.Name, MemberNumber: character.MemberNumber });
		Dictionary.push({ Tag: "ActivityGroup", Text: group.Name });
		Dictionary.push({ Tag: "ActivityName", Text: activity.Name });
		ServerSend("ChatRoomChat", { Content: ((character.ID == 0) ? "ChatSelf-" : "ChatOther-") + group.Name + "-" + activity.Name, Type: "Activity", Dictionary: Dictionary });

		if (character.ID == 0 && activity.Name.indexOf("Struggle") >= 0)

			ChatRoomStimulationMessage("StruggleAction");

		// Exits from dialog to see the result
		DialogLeave();

	}

}

/**
 * Checks if a used asset should trigger an activity/arousal progress on the target character
 * @param {Character} Source - The character who used the item
 * @param {Character} Target - The character on which the item was used
 * @param {object} Asset - Asset used
 * @return {void} - Nothing
 */
function ActivityArousalItem(Source, Target, Asset) {
	var AssetActivity = Asset.DynamicActivity(Source);
	if (AssetActivity != null) {
		var Activity = AssetGetActivity(Target.AssetFamily, AssetActivity);
		if ((Source.ID == 0) && (Target.ID != 0)) ActivityRunSelf(Source, Target, Activity);
		if (ArousalIsInMode(Target, ["Hybrid", "Automatic"]) && ((Target.ID == 0) || (Target.IsNpc())))
			ActivityEffect(Source, Target, AssetActivity, Asset.Group.Name);
	}
}

/**
 * Checks if the character is wearing an item tagged with the fetish type name and returns the love factor for it
 * @param {Character} C - The character to validate
 * @param {string} Type - The fetish type name
 * @return {number} - From -2 (hate it) to 2 (adore it) based on the player preferences
 */
function ActivityFetishItemFactor(C, Type) {
	var Factor = (PreferenceGetFetishFactor(C, Type) - 2);
	if (Factor != 0)
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Fetish != null))
				if (C.Appearance[A].Asset.Fetish.indexOf(Type) >= 0)
					return Factor;
	return 0;
}

/**
 * Loops in all fetishes for a character and calculates the total fetish factor
 * @param {Character} C - The character to validate
 * @return {number} - The negative/positive number will have negative/positive impact on arousal
 */
function ActivityFetishFactor(C) {
	var Factor = 0;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Fetish != null))
		for (let A = 0; A < C.ArousalSettings.Fetish.length; A++)
			if (C.ArousalSettings.Fetish[A].Factor != 2)
				for (let F = 0; F < FetishFemale3DCG.length; F++)
					if (FetishFemale3DCG[F].Name == C.ArousalSettings.Fetish[A].Name)
						Factor = Factor + FetishFemale3DCG[F].GetFactor(C);
	return Factor;
}
