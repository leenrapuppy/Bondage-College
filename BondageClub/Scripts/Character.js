"use strict";
/** @type Character[] */
var Character = [];
var CharacterNextId = 1;

/** @type Map<EffectName, number> */
const CharacterBlindLevels = new Map([
	/** Reserve `BlindTotal` for situations where the blindness level should never
	 *  be lowered by crafted properties (e.g. while in VR) */
	["BlindTotal", 99],
	["BlindHeavy", 3],
	["BlindNormal", 2],
	["BlindLight", 1],
]);

/** @type Map<EffectName, number> */
const CharacterDeafLevels = new Map([
	["DeafTotal", 4],
	["DeafHeavy", 3],
	["DeafNormal", 2],
	["DeafLight", 1],
]);

/** @type Map<EffectName, number> */
const CharacterBlurLevels = new Map([
	["BlurTotal", 50],
	["BlurHeavy", 20],
	["BlurNormal", 8],
	["BlurLight", 3],
]);

/**
 * An enum representing the various character archetypes
 * ONLINE: The player, or a character representing another online player
 * NPC: Any NPC
 * SIMPLE: Any simple character, generally used internally and not to represent an actual in-game character
 * @type {Record<"ONLINE"|"NPC"|"SIMPLE", CharacterType>}
 */
var CharacterType = {
	ONLINE: "online",
	NPC: "npc",
	SIMPLE: "simple",
};

/**
 * Loads a character into the buffer, creates it if it does not exist
 * @param {number} CharacterID - ID of the character
 * @param {IAssetFamily} CharacterAssetFamily - Name of the asset family of the character
 * @param {CharacterType} [Type=CharacterType.ONLINE] - The character type
 * @returns {Character} - The newly loaded character
 */
function CharacterReset(CharacterID, CharacterAssetFamily, Type = CharacterType.ONLINE) {
	// Prepares the character sheet
	/** @type {Character} */
	var NewCharacter = {
		ActivePose: [],
		ID: CharacterID,
		Hooks: null,
		Name: "",
		Type,
		AssetFamily: CharacterAssetFamily,
		AccountName: "",
		Owner: "",
		Lover: "",
		Money: 0,
		Inventory: [],
		Appearance: [],
		Stage: "0",
		CurrentDialog: "",
		Dialog: [],
		Reputation: [],
		Skill: [],
		Pose: [],
		DrawPose: [],
		DrawAppearance: [],
		AllowedActivePose: [],
		Effect: [],
		Tints: [],
		Attribute: [],
		FocusGroup: null,
		Canvas: null,
		CanvasBlink: null,
		MustDraw: false,
		BlinkFactor: Math.round(Math.random() * 10) + 10,
		AllowItem: true,
		BlockItems: [],
		LimitedItems: [],
		FavoriteItems: [],
		HiddenItems: [],
		WhiteList: [],
		BlackList: [],
		HeightModifier: 0,
		HeightRatio: 1,
		HasHiddenItems: false,
		SavedColors: GetDefaultSavedColors(),
		CanTalk: function () {
			const GagEffect = SpeechGetTotalGagLevel(this, true);
			return (GagEffect <= 0);
		},
		CanWalk: function () {
			return (
				!this.HasEffect("Freeze") &&
				!this.HasEffect("Tethered") &&
				!this.HasEffect("Mounted") &&
				((this.Pose == null) || !this.Pose.includes("Kneel") || !this.HasEffect("KneelFreeze"))
			);
		},
		CanKneel: function () {
			return CharacterCanKneel(this);
		},
		CanInteract: function () {
			return (this.Effect.indexOf("Block") < 0);
		},
		CanChangeOwnClothes: function () {
			return this.CanChangeClothesOn(this);
		},
		CanChangeClothesOn: function (C) {
			if (this.IsPlayer() && C.IsPlayer()) {
				return (
					!C.IsRestrained() &&
					!ManagementIsClubSlave() &&
					OnlineGameAllowChange() &&
					AsylumGGTSAllowChange(this) &&
					!LogQuery("BlockChange", "Rule") &&
					(!LogQuery("BlockChange", "OwnerRule") || (Player.Ownership == null) || (Player.Ownership.Stage != 1))
				);
			} else {
				return (
					this.CanInteract() &&
					C.MemberNumber != null &&
					C.AllowItem &&
					!C.IsEnclose() &&
					!(InventoryGet(CurrentCharacter, "ItemNeck") !== null &&
						InventoryGet(CurrentCharacter, "ItemNeck").Asset.Name == "ClubSlaveCollar")
				);
			}
		},
		IsProne: function () {
			return (this.Effect.indexOf("Prone") >= 0);
		},
		IsRestrained: function () {
			return (
				(this.Effect.indexOf("Freeze") >= 0) ||
				(this.Effect.indexOf("Block") >= 0) ||
				(this.Effect.indexOf("Prone") >= 0)
			);
		},
		/** Look for blindness effects and return the worst (limited by settings), Light: 1, Normal: 2, Heavy: 3 */
		GetBlindLevel: function (eyesOnly = false) {
			let blindLevel = 0;
			const eyes1 = InventoryGet(this, "Eyes");
			const eyes2 = InventoryGet(this, "Eyes2");
			if (eyes1 && eyes1.Property && eyes1.Property.Expression && eyes2 && eyes2.Property && eyes2.Property.Expression) {
				if ((eyes1.Property.Expression === "Closed") && (eyes2.Property.Expression === "Closed")) {
					blindLevel += DialogFacialExpressionsSelectedBlindnessLevel;
				}
			}
			if (!eyesOnly) {
				const effects = CharacterGetEffects(this, ["ItemHead", "ItemHood", "ItemNeck", "ItemDevices"], true);
				blindLevel += effects.reduce((Start, EffectName) => Start + (CharacterBlindLevels.get(EffectName) || 0), 0);
				blindLevel += InventoryCraftCount(this, "Thick");
				blindLevel -= InventoryCraftCount(this, "Thin");
			}
			// Light sensory deprivation setting limits blindness
			if (this.IsPlayer() && this.GameplaySettings && this.GameplaySettings.SensDepChatLog == "SensDepLight") {
				return Math.max(0, Math.min(2, blindLevel));
			} else {
				return Math.max(0, Math.min(3, blindLevel));
			}
		},
		GetBlurLevel: function() {
			if ((this.IsPlayer() && this.GraphicsSettings && !this.GraphicsSettings.AllowBlur) || CommonPhotoMode) {
				return 0;
			}
			let blurLevel = 0;
			for (const item of this.Appearance) {
				for (const [effect, level] of CharacterBlurLevels.entries()) {
					if (InventoryItemHasEffect(item, effect)) {
						blurLevel += level;
						break; // Only count the highest blur level defined on the item
					}
				}
			}
			return blurLevel;
		},
		IsLocked: function () {
			return this.Effect.indexOf("Lock") > 0;
		},
		IsBlind: function () {
			return this.GetBlindLevel() > 0;
		},
		IsEnclose: function () {
			return (this.Effect.indexOf("Enclose") >= 0 || (this.Effect.indexOf("OneWayEnclose") >= 0 && this.ID == 0));
		},
		IsMounted: function () {
			return (this.Effect.indexOf("Mounted") >= 0);
		},
		IsChaste: function () {
			return ((this.Effect.indexOf("Chaste") >= 0) || (this.Effect.indexOf("BreastChaste") >= 0));
		},
		IsVulvaChaste: function () {
			return (this.Effect.indexOf("Chaste") >= 0);
		},
		IsPlugged: function () {
			return (this.Effect.indexOf("IsPlugged") >= 0);
		},
		IsButtChaste: function () {
			return this.Effect.includes("ButtChaste");
		},
		IsBreastChaste: function () {
			return (this.Effect.indexOf("BreastChaste") >= 0);
		},
		IsShackled: function () {
			return (this.Effect.indexOf("Shackled") >= 0);
		},
		IsSlow: function () {
			return (
				((this.Effect.indexOf("Slow") >= 0) || (this.Pose.indexOf("Kneel") >= 0)) &&
				((this.ID != 0) || !/** @type {PlayerCharacter} */(this).RestrictionSettings.SlowImmunity)
			);
		},
		IsEgged: function () {
			return (this.Effect.indexOf("Egged") >= 0);
		},
		IsMouthBlocked: function () {
			return this.Effect.indexOf("BlockMouth") >= 0;
		},
		IsMouthOpen: function () {
			return this.Effect.indexOf("OpenMouth") >= 0;
		},
		IsVulvaFull: function () {
			return this.Effect.indexOf("FillVulva") >= 0;
		},
		IsAssFull: function () {
			return this.Effect.includes("IsPlugged");
		},
		IsFixedHead: function () {
			return this.Effect.includes("FixedHead");
		},
		IsOwned: function () {
			return ((this.Owner != null) && (this.Owner.trim() != ""));
		},
		IsOwnedByPlayer: function () {
			return (
				(
					(((this.Owner != null) && (this.Owner.trim() == Player.Name)) || (NPCEventGet(this, "EndDomTrial") > 0)) &&
					(this.Ownership == null)
				) ||
				this.IsOwnedByMemberNumber(Player.MemberNumber)
			);
		},
		IsOwnedByMemberNumber: function (memberNumber) {
			return (this.Ownership != null) &&
				(this.Ownership.MemberNumber != null) &&
				(this.Ownership.MemberNumber == memberNumber);
		},
		IsOwner: function () {
			return ((NPCEventGet(this, "EndSubTrial") > 0) || (this.Name == Player.Owner.replace("NPC-", "")));
		},
		IsLoverOfPlayer: function () {
			return this.IsLover(Player);
		},
		IsLover: function (C) {
			return (
				this.IsLoverOfMemberNumber(C.MemberNumber) ||
				(((this.Lover != null) && (this.Lover.trim() == C.Name)) || (NPCEventGet(this, "Girlfriend") > 0))
			);
		},
		IsLoverOfMemberNumber: function (memberNumber) {
			return this.GetLoversNumbers().indexOf(memberNumber) >= 0;
		},
		GetLoversNumbers: function (MembersOnly) {
			return CharacterGetLoversNumbers(this, MembersOnly);
		},
		GetDeafLevel: function () {
			let deafLevel = 0;
			for (const item of this.Appearance) {
				for (const [effect, level] of CharacterDeafLevels.entries()) {
					if (InventoryItemHasEffect(item, effect)) {
						deafLevel += level;
						break; // Only count the highest deafness level defined on the item
					}
				}
			}
			return deafLevel;
		},
		IsLoverPrivate: function () {
			return ((NPCEventGet(this, "Girlfriend") > 0) || (Player.GetLoversNumbers().indexOf("NPC-" + this.Name) >= 0));
		},
		IsKneeling: function () {
			return (this.Pose != null && (this.Pose.includes("Kneel") || this.Pose.includes("KneelingSpread")));
		},
		IsNaked: function () {
			return CharacterIsNaked(this);
		},
		IsDeaf: function () {
			return this.GetDeafLevel() > 0;
		},
		/* Check if one or more gag effects are active (thus bypassing the crafted small/large properties) */
		IsGagged: function () {
			return this.Effect.some(effect => effect in SpeechGagLevelLookup);
		},
		HasNoItem: function () {
			return CharacterHasNoItem(this);
		},
		IsEdged: function () {
			return CharacterIsEdged(this);
		},
		IsPlayer: function () {
			return this.ID === 0;
		},
		IsBirthday: function () {
			if ((this.Creation == null) || (CurrentTime == null)) return false;
			return ((new Date(this.Creation)).getDate() == (new Date(CurrentTime)).getDate()) &&
				   ((new Date(this.Creation)).getMonth() == (new Date(CurrentTime)).getMonth()) &&
				   ((new Date(this.Creation)).getFullYear() != (new Date(CurrentTime)).getFullYear());
		},
		IsFamilyOfPlayer: function () {
			if (this.IsPlayer()) return false;
			if (this.IsOwner() || this.IsOwnedByPlayer()) return true;
			if ((Player.Ownership != null) && (this.MemberNumber === Player.Ownership.MemberNumber)) return true;
			return ((Player.Ownership != null) && (this.Ownership != null) && (Player.Ownership.MemberNumber === this.Ownership.MemberNumber));
		},
		IsInFamilyOfMemberNumber: function(MemberNum) {
			if (ChatRoomCharacter == null) return false;
			if (this.ID == 0)
				for (let Char of ChatRoomCharacter)
					if (Char.MemberNumber == MemberNum)
						return Char.IsFamilyOfPlayer();
			if ((this.ID != 0) && (MemberNum === Player.MemberNumber))
				return this.IsFamilyOfPlayer();
			if ((this.ID != 0) && (MemberNum !== Player.MemberNumber))
				for (let Char of ChatRoomCharacter)
					if (Char.MemberNumber == MemberNum) {
						if ((Char.Ownership != null) && (this.Ownership != null) && (Char.Ownership.MemberNumber === this.Ownership.MemberNumber)) return true;
						if ((Char.Ownership != null) && (Char.Ownership.MemberNumber == this.MemberNumber)) return true;
						if ((this.Ownership != null) && (this.Ownership.MemberNumber == Char.MemberNumber)) return true;
						return false;
					}
			return false;
		},
		IsOnline: function () {
			return this.Type === CharacterType.ONLINE;
		},
		IsNpc: function () {
			return (this.Type !== CharacterType.ONLINE) && (this.Type !== CharacterType.SIMPLE);
		},
		IsSimple: function () {
			return this.Type === CharacterType.SIMPLE;
		},
		GetDifficulty: function () {
			return (
				(this.Difficulty == null) ||
				(this.Difficulty.Level == null) ||
				(typeof this.Difficulty.Level !== "number") ||
				(this.Difficulty.Level < 0) ||
				(this.Difficulty.Level > 3)
			) ? 1 : this.Difficulty.Level;
		},
		IsSuspended: function () {
			return this.Pose.includes("Suspension") || this.Effect.includes("Suspended");
		},
		IsInverted: function () {
			return this.Pose.indexOf("Suspension") >= 0;
		},
		CanChangeToPose: function (Pose) {
			return CharacterCanChangeToPose(this, Pose);
		},
		GetClumsiness: function () {
			return CharacterGetClumsiness(this);
		},
		HasEffect: function(Effect) {
			return this.Effect.includes(Effect);
		},
		HasTints: function() {
			if (this.IsPlayer() && this.ImmersionSettings && !this.ImmersionSettings.AllowTints) {
				return false;
			}
			return !CommonPhotoMode && this.Tints.length > 0;
		},
		GetTints: function() {
			return CharacterGetTints(this);
		},
		HasAttribute: function(attribute) {
			return this.Attribute.includes(attribute);
		},
		GetGenders: function () {
			return this.Appearance.map(asset => asset.Asset.Gender).filter(a => a);
		},
		HasPenis: function () {
			return InventoryIsItemInList(this, "Pussy", ["Penis"]);
		},
		HasVagina: function () {
			return InventoryIsItemInList(this, "Pussy", ["PussyLight1", "PussyLight2", "PussyLight3", "PussyDark1", "PussyDark2", "PussyDark3"]);
		},
		IsFlatChested: function () {
			return InventoryIsItemInList(this, "BodyUpper", ["FlatSmall", "FlatMedium"]);
		},
		// Adds a new hook with a Name (determines when the hook will happen, an Instance ID (used to differentiate between different hooks happening at the same time), and a function that is run when the hook is called)
		RegisterHook: function (hookName, hookInstance, callback) {
			if (!this.Hooks) this.Hooks = new Map();

			let hooks = this.Hooks.get(hookName);
			if (!hooks) {
				hooks = new Map();
				this.Hooks.set(hookName, hooks);
			}

			if (!hooks.has(hookInstance)) {
				hooks.set(hookInstance, callback);
				return true;
			}
			return false;
		},
		// Removes a hook based on hookName and hookInstance
		UnregisterHook: function (hookName, hookInstance) {
			if (!this.Hooks) return false;

			const hooks = this.Hooks.get(hookName);
			if (hooks && hooks.delete(hookInstance)) {
				if (hooks.size == 0) {
					this.Hooks.delete(hookName);
				}
				return true;
			}

			return false;
		},
		RunHooks: function (hookName) {
			if (this.Hooks && typeof this.Hooks.get == "function") {
				let hooks = this.Hooks.get(hookName);
				if (hooks)
					hooks.forEach((hook) => hook()); // If there's a hook, call it
			}
		}
	};

	// If the character doesn't exist, we create it
	var CharacterIndex = Character.findIndex(c => c.ID == CharacterID);
	if (CharacterIndex == -1)
		Character.push(NewCharacter);
	else
		Character[CharacterIndex] = NewCharacter;

	// Creates the inventory and default appearance
	if (CharacterID == 0) {
		Player = /** @type {PlayerCharacter} */ (NewCharacter);
		CharacterAppearanceSetDefault(NewCharacter);
	}

	// Load the character image
	CharacterLoadCanvas(NewCharacter);

	return NewCharacter;
}

/**
 * Attributes a random name for the character, does not select a name in use
 * @param {Character} C - Character for which to attribute a name
 * @returns {void} - Nothing
 */
function CharacterRandomName(C) {

	// Generates a name from the name bank
	var NewName = CharacterName[Math.floor(Math.random() * CharacterName.length)];
	C.Name = NewName;

	// If the name is already taken, we generate a new one
	for (let CN = 0; CN < Character.length; CN++)
		if ((Character[CN].Name == NewName) && (Character[CN].ID != C.ID)) {
			CharacterRandomName(C);
			return;
		}

	// If the name is already taken by a private room character
	for (let P = 0; P < PrivateCharacter.length; P++)
		if ((PrivateCharacter[P].Name == NewName) && ((PrivateCharacter[P].ID == null) || (PrivateCharacter[P].ID != C.ID))) {
			CharacterRandomName(C);
			return;
		}

}

/**
 * Substitute name and pronoun fields in dialog.
 * @param {Character} C - Character for which to build the dialog
 * @returns {void} - Nothing
 */
function CharacterDialogSubstitution(C){
	/** @type {CommonSubtituteSubstitution[]} */
	let subst = [
		["DialogCharacterName", CharacterNickname(C)],
		["DialogPlayerName", CharacterNickname(Player)],
	];
	subst = subst.concat(ChatRoomPronounSubstitutions(C, "DialogCharacter", false));
	subst = subst.concat(ChatRoomPronounSubstitutions(Player, "DialogPlayer", false));

	C.Dialog.forEach(_=>{
		if(_.Option) _.Option = CommonStringSubstitute(_.Option, subst);
		if(_.Result) _.Result = CommonStringSubstitute(_.Result, subst);
	});
}

/**
 * Builds the dialog objects from the character CSV file
 * @param {Character} C - Character for which to build the dialog
 * @param {readonly string[][]} CSV - Content of the CSV file
 * @returns {void} - Nothing
 */
function CharacterBuildDialog(C, CSV) {

	C.Dialog = [];

	function parseField(fieldContents) {
		if (typeof fieldContents !== "string") return null;
		const str = fieldContents.trim();
		if (str === "") return null;
		return (str !== "" ? str : null);
	}

	// For each lines in the file
	for (const L of CSV) {
		if (typeof L[0] !== "string" || L[0] === "") continue;

		// Creates a dialog object
		/** @type {DialogLine} */
		const D = {
			Stage: parseField(L[0]),
			NextStage: parseField(L[1]),
			Option: parseField(L[2]),
			Result: parseField(L[3]),
			Function: parseField(L[4]),
			Prerequisite: parseField(L[5]),
			Group: parseField(L[6]),
			Trait: parseField(L[7]),
		};

		// Prefix with the current screen unless this is a Dialog function or an online character
		if (D.Function && D.Function !== "")
			D.Function = (D.Function.startsWith("Dialog") ? "" : C.IsOnline() ? "ChatRoom" : CurrentScreen) + D.Function;

		C.Dialog.push(D);
	}

	// Translate the dialog if needed
	TranslationDialog(C);

	if (C === Player) {
		for (const D of C.Dialog) {
			if (typeof D.Result === "string")
				PlayerDialog.set(D.Stage, D.Result);
		}
	}
}

/**
 * Loads the content of a CSV file to build the character dialog. Can override the current screen.
 * @param {Character} C - Character for which to build the dialog objects
 * @param {string} [Override] - Optional: Path to the specific CSV to build the character dialog with
 * @returns {void} - Nothing
 */
function CharacterLoadCSVDialog(C, Override) {

	// Finds the full path of the CSV file to use cache
	var FullPath = ((C.ID == 0) ? "Screens/Character/Player/Dialog_Player" : ((Override == null) ? "Screens/" + CurrentModule + "/" + CurrentScreen + "/Dialog_" + C.AccountName : Override)) + ".csv";
	if (CommonCSVCache[FullPath]) {
		CharacterBuildDialog(C, CommonCSVCache[FullPath]);
		return;
	}

	// Opens the file, parse it and returns the result it to build the dialog
	CommonGet(FullPath, function () {
		if (this.status == 200) {
			CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			CharacterBuildDialog(C, CommonCSVCache[FullPath]);
		}
	});

}

/**
 * Sets the clothes based on a character archetype
 * @param {Character} C - Character to set the clothes for
 * @param {"Maid" | "Mistress" | "Employee"} Archetype - Archetype to determine the clothes to put on
 * @param {string} [ForceColor] - Color to use for the added clothes
 * @returns {void} - Nothing
 */
function CharacterArchetypeClothes(C, Archetype, ForceColor) {

	// Maid archetype
	if (Archetype == "Maid") {
		InventoryAdd(C, "MaidOutfit1", "Cloth", false);
		InventoryWear(C, "MaidOutfit1", "Cloth");
		InventoryAdd(C, "MaidHairband1", "Hat", false);
		InventoryWear(C, "MaidHairband1", "Hat");
		InventoryAdd(C, "MaidOutfit2", "Cloth", false);
		if (InventoryGet(C, "Socks") == null) InventoryWear(C, "Socks4", "Socks", "#AAAAAA");
		if (InventoryGet(C, "Shoes") == null) InventoryWear(C, "Shoes2", "Shoes", "#222222");
		if ((InventoryGet(C, "Gloves") == null) && (Math.random() > 0.5)) InventoryWear(C, "Gloves1", "Gloves", "#AAAAAA");
		InventoryRemove(C, "ClothAccessory");
		InventoryRemove(C, "HairAccessory1");
		InventoryRemove(C, "HairAccessory2");
		InventoryRemove(C, "HairAccessory3");
		InventoryRemove(C, "ClothLower");
		C.AllowItem = (LogQuery("LeadSorority", "Maid"));
	}

	// Mistress archetype
	if (Archetype == "Mistress") {
		var ColorList = ["#333333", "#AA4444", "#AAAAAA"];
		var Color = (ForceColor == null) ? CommonRandomItemFromList("", ColorList) : ForceColor;
		CharacterAppearanceSetItem(C, "Hat", null);
		InventoryAdd(C, "MistressGloves", "Gloves", false);
		InventoryWear(C, "MistressGloves", "Gloves", Color);
		InventoryAdd(C, "MistressBoots", "Shoes", false);
		InventoryWear(C, "MistressBoots", "Shoes", Color);
		InventoryAdd(C, "MistressTop", "Cloth", false);
		InventoryWear(C, "MistressTop", "Cloth", Color);
		InventoryAdd(C, "MistressBottom", "ClothLower", false);
		InventoryWear(C, "MistressBottom", "ClothLower", Color);
		InventoryAdd(C, "MistressPadlock", "ItemMisc", false);
		InventoryAdd(C, "MistressTimerPadlock", "ItemMisc", false);
		InventoryAdd(C, "MistressPadlockKey", "ItemMisc", false);
		InventoryAdd(C, "DeluxeBoots", "Shoes", false);
		InventoryRemove(C, "ClothAccessory");
		InventoryRemove(C, "HairAccessory1");
		InventoryRemove(C, "HairAccessory2");
		InventoryRemove(C, "HairAccessory3");
		InventoryRemove(C, "Socks");
	}

	// Employee archetype
	if (Archetype == "Employee") {
		InventoryAdd(C, "VirginKiller1", "Cloth", false);
		CharacterAppearanceSetItem(C, "Cloth", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Cloth");
		InventoryAdd(C, "Jeans1", "ClothLower", false);
		CharacterAppearanceSetItem(C, "ClothLower", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "ClothLower");
		InventoryAdd(C, "SunGlasses1", "Glasses", false);
		CharacterAppearanceSetItem(C, "Glasses", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Glasses");
	}

}

/**
 * Loads an NPC into the character array. The appearance is randomized, and a type can be provided to dress them in a given style.
 * @param {string} NPCType - Archetype of the NPC
 * @returns {NPCCharacter} - The randomly generated NPC
 */
function CharacterLoadNPC(NPCType) {

	// Checks if the NPC already exists and returns it if it's the case
	const duplicate = Character.find(c => c.AccountName === NPCType);
	if (duplicate) return duplicate;

	// Randomize the new character
	CharacterReset(CharacterNextId++, "Female3DCG", CharacterType.NPC);
	let C = Character[Character.length - 1];
	C.AccountName = NPCType;
	CharacterLoadCSVDialog(C);
	CharacterRandomName(C);
	CharacterAppearanceBuildAssets(C);
	CharacterAppearanceFullRandom(C);

	// Sets archetype clothes
	if (NPCType.indexOf("Maid") >= 0) CharacterArchetypeClothes(C, "Maid");
	if (NPCType.indexOf("Employee") >= 0) CharacterArchetypeClothes(C, "Employee");
	if (NPCType.indexOf("Mistress") >= 0) CharacterArchetypeClothes(C, "Mistress");

	// Returns the new character
	return C;

}

/**
 * Create a minimal character object
 * @param {string} AccName - The account name to give to the character
 * @returns {Character} - The created character
 */
function CharacterLoadSimple(AccName) {
	// Checks if the character already exists and returns it if it's the case
	const duplicate = Character.find(c => c.AccountName === AccName);
	if (duplicate) return duplicate;

	// Create the new character
	const C = CharacterReset(CharacterNextId++, "Female3DCG", CharacterType.SIMPLE);
	C.AccountName = AccName;

	// Returns the new character
	return C;
}

/**
 * Sets up an online character
 * @param {Character} Char - Online character to set up
 * @param {object} data - Character data received
 * @param {number} SourceMemberNumber - Source number of the refresh
 */
function CharacterOnlineRefresh(Char, data, SourceMemberNumber) {
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Title == null))) Char.Title = data.Title;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Nickname == null))) Char.Nickname = data.Nickname;
	Char.ActivePose = Array.isArray(data.ActivePose) ? data.ActivePose.filter(i => typeof i === "string") : [];
	Char.LabelColor = data.LabelColor;
	Char.Creation = data.Creation;
	Char.Description = data.Description;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.ItemPermission == null))) Char.ItemPermission = data.ItemPermission;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.ArousalSettings == null))) Char.ArousalSettings = data.ArousalSettings;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.OnlineSharedSettings == null))) Char.OnlineSharedSettings = data.OnlineSharedSettings;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Game == null))) Char.Game = data.Game;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Crafting == null))) Char.Crafting = data.Crafting;
	Char.Ownership = data.Ownership;
	Char.Lovership = data.Lovership;
	for (let L = Char.Lovership.length - 1; L >= 0; L--) {
		delete Char.Lovership[L].BeginEngagementOfferedByMemberNumber;
		delete Char.Lovership[L].BeginWeddingOfferedByMemberNumber;
		if (Char.Lovership[L].BeginDatingOfferedByMemberNumber) Char.Lovership.splice(L, 1);
	}
	Char.Reputation = (data.Reputation != null) ? data.Reputation : [];
	Char.BlockItems = Array.isArray(data.BlockItems) ? data.BlockItems : [];
	Char.LimitedItems = Array.isArray(data.LimitedItems) ? data.LimitedItems : [];
	Char.FavoriteItems = Array.isArray(data.FavoriteItems) ? data.FavoriteItems : [];
	if (Char.ID != 0 && Array.isArray(data.WhiteList)) Char.WhiteList = data.WhiteList;
	if (Char.ID != 0 && Array.isArray(data.BlackList)) Char.BlackList = data.BlackList;

	const currentAppearance = Char.Appearance;
	ServerAppearanceLoadFromBundle(Char, "Female3DCG", data.Appearance, SourceMemberNumber);
	CharacterAppearanceResolveSync(Char, currentAppearance);

	if (Char.ID == 0) LoginValidCollar();
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Inventory == null) || (Char.Inventory.length == 0))) InventoryLoad(Char, data.Inventory);

	let tmp;
	const oldPronouns = (tmp = currentAppearance.find(item => item.Asset.Group.Name === "Pronouns")) && tmp && tmp.Asset.Name;
	const newPronouns = (tmp = Char.Appearance.find(item => item.Asset.Group.Name === "Pronouns")) && tmp && tmp.Asset.Name;
	if (oldPronouns !== undefined && oldPronouns !== newPronouns) {
		// Reload the dialog so the new gender takes effect
		// Don't reload in initialization (when oldPronouns is undefined), which breaks translation
		CharacterLoadCSVDialog(Char, "Screens/Online/ChatRoom/Dialog_Online");
	}
	CharacterLoadEffect(Char);
	CharacterRefresh(Char);
}

/**
 * Loads an online character and flags it for a refresh if any data was changed
 * @param {object} data - Character data received
 * @param {number} SourceMemberNumber - Source number of the load trigger
 * @returns {Character} - The reloaded character
 */
function CharacterLoadOnline(data, SourceMemberNumber) {

	// Checks if the character already exists and returns it if it's the case
	var Char = null;
	if (data.ID.toString() == Player.OnlineID)
		Char = Player;
	else
		for (let C = 0; C < Character.length; C++)
			if (Character[C].AccountName == "Online-" + data.ID.toString())
				Char = Character[C];

	// Decompresses data
	if (typeof data.Description === "string" && data.Description.startsWith(ONLINE_PROFILE_DESCRIPTION_COMPRESSION_MAGIC)) {
		data.Description = LZString.decompressFromUTF16(data.Description.substr(1));
	}
	if (data.BlockItems && typeof data.BlockItems === "object" && !Array.isArray(data.BlockItems)) {
		data.BlockItems = CommonUnpackItemArray(data.BlockItems);
	}
	if (data.LimitedItems && typeof data.LimitedItems === "object" && !Array.isArray(data.LimitedItems)) {
		data.LimitedItems = CommonUnpackItemArray(data.LimitedItems);
	}
	if (data.FavoriteItems && typeof data.FavoriteItems === "object" && !Array.isArray(data.FavoriteItems)) {
		data.FavoriteItems = CommonUnpackItemArray(data.FavoriteItems);
	}
	if (Array.isArray(data.WhiteList)) {
		data.WhiteList.sort((a, b) => a - b);
	}
	if (Array.isArray(data.BlackList)) {
		data.BlackList.sort((a, b) => a - b);
	}

	// If the character isn't found
	if (Char == null) {
		// We delete the duplicate character if the person relogged.
		for (let C = 0; C < Character.length; C++)
			if (Character[C].MemberNumber == data.MemberNumber) {
				CharacterDelete(Character[C].AccountName);
				break;
			}

		// Creates the new character from the online template
		CharacterReset(CharacterNextId++, "Female3DCG");
		Char = Character[Character.length - 1];
		Char.Name = data.Name;
		Char.Lover = (data.Lover != null) ? data.Lover : "";
		Char.Owner = (data.Owner != null) ? data.Owner : "";
		Char.Title = data.Title;
		Char.Nickname = data.Nickname;
		Char.AccountName = "Online-" + data.ID.toString();
		Char.MemberNumber = data.MemberNumber;
		Char.Difficulty = data.Difficulty;
		Char.AllowItem = false;
		CharacterLoadCSVDialog(Char, "Screens/Online/ChatRoom/Dialog_Online");
		CharacterOnlineRefresh(Char, data, SourceMemberNumber);

	} else {

		// If we must add a character, we refresh it
		var Refresh = true;
		if (ChatRoomData.Character != null)
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].ID.toString() == data.ID.toString()) {
					Refresh = false;
					break;
				}

		// Flags "refresh" if we need to redraw the character
		if (!Refresh)
			if ((Char.Description != data.Description) || (Char.Title != data.Title) || (Char.Nickname != data.Nickname) || (Char.LabelColor != data.LabelColor) || (ChatRoomData == null) || (ChatRoomData.Character == null))
				Refresh = true;
			else
				for (let C = 0; C < ChatRoomData.Character.length; C++)
					if (ChatRoomData.Character[C].ID == data.ID)
						if (ChatRoomData.Character[C].Appearance.length != data.Appearance.length)
							Refresh = true;
						else
							for (let A = 0; A < data.Appearance.length && !Refresh; A++) {
								const Old = ChatRoomData.Character[C].Appearance[A];
								const New = data.Appearance[A];
								if ((New.Name != Old.Name) || (New.Group != Old.Group) || (New.Color != Old.Color)) Refresh = true;
								else if ((New.Property != null) && (Old.Property != null) && (JSON.stringify(New.Property) != JSON.stringify(Old.Property))) Refresh = true;
								else if (((New.Property != null) && (Old.Property == null)) || ((New.Property == null) && (Old.Property != null))) Refresh = true;
							}

		// Flags "refresh" if the ownership or lovership or inventory or blockitems or limiteditems has changed
		if (!Refresh && (JSON.stringify(Char.ActivePose) !== JSON.stringify(data.ActivePose))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Ownership) !== JSON.stringify(data.Ownership))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Lovership) !== JSON.stringify(data.Lovership))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.ArousalSettings) !== JSON.stringify(data.ArousalSettings))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.OnlineSharedSettings) !== JSON.stringify(data.OnlineSharedSettings))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Game) !== JSON.stringify(data.Game))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Crafting) !== JSON.stringify(data.Crafting))) Refresh = true;
		if (!Refresh && Array.isArray(data.WhiteList) && (JSON.stringify(Char.WhiteList) !== JSON.stringify(data.WhiteList))) Refresh = true;
		if (!Refresh && Array.isArray(data.BlackList) && (JSON.stringify(Char.BlackList) !== JSON.stringify(data.BlackList))) Refresh = true;
		if (!Refresh && (data.BlockItems != null) && (Char.BlockItems.length != data.BlockItems.length)) Refresh = true;
		if (!Refresh && (data.LimitedItems != null) && (Char.LimitedItems.length != data.LimitedItems.length)) Refresh = true;
		if (!Refresh && (data.FavoriteItems != null) && (Char.FavoriteItems.length != data.FavoriteItems.length)) Refresh = true;

		// If we must refresh
		if (Refresh) CharacterOnlineRefresh(Char, data, SourceMemberNumber);

	}

	// Returns the character
	return Char;

}

/**
 * Deletes an NPC from the buffer
 * @param {string} NPCType - Account name of the npc to delete
 * @returns {void} - Nothing
 */
function CharacterDelete(NPCType) {
	for (let C = 0; C < Character.length; C++)
		if (Character[C].AccountName == NPCType) {
			AnimationPurge(Character[C], true);
			Character.splice(C, 1);
			return;
		}
}

/**
 * Deletes all online characters from the character array
 * @returns {void} - Nothing
 */
function CharacterDeleteAllOnline() {
	for (let C = Character.length - 1; C >= 0; C--)
		if (Character[C].AccountName.startsWith("Online-"))
			CharacterDelete(Character[C].AccountName);
}

/**
 * Checks whether the given character can change to the named pose unaided
 * @param {Character} C - The character to check
 * @param {AssetPoseName} poseName - The name of the pose to check for
 * @returns {boolean} - Returns true if the character has no conflicting items and is not prevented from changing to
 * the provided pose
 */
function CharacterCanChangeToPose(C, poseName) {
	const pose = PoseFemale3DCG.find(P => P.Name === poseName);
	if (!pose) return false;
	const poseCategory = pose.Category;
	if (!CharacterItemsHavePoseAvailable(C, poseCategory, pose.Name)) return false;
	return !C.Appearance.some(item => InventoryGetItemProperty(item, "FreezeActivePose").includes(poseCategory));
}

/**
 * Checks if a certain pose is whitelisted and available for the pose menu
 * @param {Character} C - Character to check for the pose
 * @param {AssetPoseCategory|undefined} Type - Pose type to check for within items
 * @param {AssetPoseName} Pose - Pose to check for whitelist
 * @returns {boolean} - TRUE if the character has the pose available
 */
function CharacterItemsHavePoseAvailable(C, Type, Pose) {
	const ConflictingPoses = PoseFemale3DCG.filter(P => P.Name !== Pose && (P.Category == Type || P.Category == "BodyFull")).map(P => P.Name);

	for (let i = 0, Item = null; i < C.Appearance.length; i++) {
		Item = C.Appearance[i];

		if (InventoryGetItemProperty(Item, "WhitelistActivePose", true).includes(Pose)) continue;
		if (InventoryGetItemProperty(Item, "AllowActivePose", true).includes(Pose)) continue;
		if (InventoryGetItemProperty(Item, "SetPose", true).find(P => ConflictingPoses.includes(P))) return false;
	}
	return true;
}

/**
 * Checks if a character has a pose from items (not active pose unless an item lets it through)
 * @param {Character} C - Character to check for the pose
 * @param {AssetPoseName} Pose - Pose to check for within items
 * @param {boolean} [ExcludeClothes=false] - Ignore clothing items in the check
 * @returns {boolean} - TRUE if the character has the pose
 */
function CharacterItemsHavePose(C, Pose, ExcludeClothes = false) {
	if (C.ActivePose != null && C.AllowedActivePose.includes(Pose) && (typeof C.ActivePose == "string" && C.ActivePose == Pose || Array.isArray(C.ActivePose) && C.ActivePose.includes(Pose))) return true;
	return CharacterDoItemsSetPose(C, Pose, ExcludeClothes);
}

/**
 * Checks whether the items on a character set a given pose on the character
 * @param {Character} C - The character to check
 * @param {AssetPoseName} pose - The name of the pose to check for
 * @param {boolean} [excludeClothes=false] - Ignore clothing items in the check
 * @returns {boolean} - Returns true if the character is wearing an item that sets the given pose, false otherwise
 */
function CharacterDoItemsSetPose(C, pose, excludeClothes = false) {
	if (C == null) return false;
	return C.Appearance
		.filter(item => !excludeClothes || !item.Asset.Group.Clothing)
		.some(item => {
			let Value = InventoryGetItemProperty(item, "SetPose", true);
			if (Value == null) return false;
			return Value.includes(pose);
		});
}

/**
 * Checks if a character has a pose type from items (not active pose unless an item lets it through)
 * @param {Character} C - Character to check for the pose type
 * @param {string} Type - Pose type to check for within items
 * @param {boolean} OnlyItems - Whether or not allowed activeposes should be ignored.
 * @returns {boolean} - TRUE if the character has the pose type active
 */
function CharacterItemsHavePoseType(C, Type, OnlyItems) {
	var PossiblePoses = PoseFemale3DCG.filter(P => P.Category == Type || P.Category == "BodyFull").map(P => P.Name);

	for (const item of C.Appearance) {
		if (!OnlyItems && InventoryGetItemProperty(item, "AllowActivePose", true).find(P => PossiblePoses.includes(P) && C.AllowedActivePose.includes(P)))
			return true;
		if (InventoryGetItemProperty(item, "SetPose", true).find(P => PossiblePoses.includes(P)))
			return true;
	}
	return false;
}

/**
 * Refreshes the list of poses for a character. Each pose can only be found once in the pose array
 * @param {Character} C - Character for which to refresh the pose list
 * @returns {void} - Nothing
 */
function CharacterLoadPose(C) {
	C.Pose = [];
	C.AllowedActivePose = [];

	for (let i = 0, Item = null; i < C.Appearance.length; i++) {
		Item = C.Appearance[i];
		C.AllowedActivePose.push(...InventoryGetItemProperty(Item, "AllowActivePose"));
		C.Pose = CommonArrayConcatDedupe(C.Pose, InventoryGetItemProperty(Item, "SetPose", true));
	}

	// Add possible active poses (Bodyfull can only be alone, and cannot have two of upperbody or bodylower)
	var Poses = C.Pose.map(CP => PoseFemale3DCG.find(P => P.Name == CP)).filter(P => P);
	if (C.ActivePose != null && typeof C.ActivePose == "string") C.ActivePose = [C.ActivePose];

	if (C.ActivePose != null && Array.isArray(C.ActivePose)) {
		var ActivePoses = C.ActivePose
			.map(CP => PoseFemale3DCG.find(P => P.Name == CP))
			.filter(P => P);

		for (let P = 0; P < ActivePoses.length; P++) {
			var HasPose = C.Pose.includes(ActivePoses[P].Name);
			var IsAllowed = C.AllowedActivePose.includes(ActivePoses[P].Name) && CharacterItemsHavePoseAvailable(C, ActivePoses[P].Category, ActivePoses[P].Name);
			var MissingGroup = !Poses.find(Pose => Pose.Category == "BodyFull") && !Poses.find(Pose => Pose.Category == ActivePoses[P].Category);
			var IsFullBody = C.Pose.length > 0 && ActivePoses[P].Category == "BodyFull";
			if (!HasPose && (IsAllowed || (MissingGroup && !IsFullBody)))
				C.Pose.push(ActivePoses[P].Name);
		}
	}
}

/**
 * Refreshes the list of effects for a character. Each effect can only be found once in the effect array
 * @param {Character} C - Character for which to refresh the effect list
 * @returns {void} - Nothing
 */
function CharacterLoadEffect(C) {
	C.Effect = CharacterGetEffects(C);
	CharacterLoadTints(C);
	CharacterLoadAttributes(C);
}

/**
 * Refreshes the character's attribute list
 * @param {Character} C
 * @returns {void} - Nothing
 */
function CharacterLoadAttributes(C) {
	/** @type {Set<AssetAttribute>} */
	const attributes = new Set();
	C.Attribute = [];
	for (const item of C.Appearance) {
		if (Array.isArray(item.Asset.Attribute)) {
			for (const attribute of item.Asset.Attribute) {
				attributes.add(attribute);
			}
		}
	}
	C.Attribute = Array.from(attributes);
}

/**
 * Returns a list of effects for a character from some or all groups
 * @param {Character} C - The character to check
 * @param {readonly AssetGroupName[]} [Groups=null] - Optional: The list of groups to consider. If none defined, check all groups
 * @param {boolean} [AllowDuplicates=false] - Optional: If true, keep duplicates of the same effect provided they're taken from different groups
 * @returns {EffectName[]} - A list of effects
 */
function CharacterGetEffects(C, Groups = null, AllowDuplicates = false) {
	let totalEffects = [];
	C.Appearance
		.filter(A => !Array.isArray(Groups) || Groups.length == 0 || Groups.includes(A.Asset.Group.Name))
		.forEach(item => {
			let itemEffects = [];
			let overrideAsset = false;

			if (item.Property && Array.isArray(item.Property.Effect)) {
				CommonArrayConcatDedupe(itemEffects, item.Property.Effect);
				overrideAsset = !!item.Property.OverrideAssetEffect;
			}
			if (!overrideAsset) {
				if (Array.isArray(item.Asset.Effect)) {
					CommonArrayConcatDedupe(itemEffects, item.Asset.Effect);
				} else if (Array.isArray(item.Asset.Group.Effect)) {
					CommonArrayConcatDedupe(itemEffects, item.Asset.Group.Effect);
				}
			}

			if (AllowDuplicates) {
				totalEffects = totalEffects.concat(itemEffects);
			} else {
				CommonArrayConcatDedupe(totalEffects, itemEffects);
			}
		});
	return totalEffects;
}

/**
 * Loads a character's tints, resolving tint definitions against items from the character's appearance
 * @param {Character} C - Character whose tints should be loaded
 * @returns {void} - Nothing
 */
function CharacterLoadTints(C) {
	// Tints on non-player characters don't have any effect right now, so don't bother loading them
	if (!C.IsPlayer()) {
		return;
	}

	/** @type {ResolvedTintDefinition[]} */
	const tints = [];
	for (const item of C.Appearance) {
		tints.push(...InventoryGetItemProperty(item, "Tint").map(({Color, Strength, DefaultColor}) => ({Color, Strength, DefaultColor, Item: item})));
	}
	C.Tints = tints;
}

/**
 * Loads a character's canvas by sorting its appearance and drawing it.
 * @param {Character} C - Character to load the canvas for
 * @returns {void} - Nothing
 */
function CharacterLoadCanvas(C) {
	// Reset the property that tracks if wearing a hidden item
	C.HasHiddenItems = false;

	// We add a temporary appearance and pose here so that it can be modified by hooks.  We copy the arrays so no hooks can alter the reference accidentally
	C.DrawAppearance = AppearanceItemParse(CharacterAppearanceStringify(C));
	C.DrawPose = C.Pose.slice(); // Deep copy of pose array

	// Run BeforeSortLayers hook
	C.RunHooks("BeforeSortLayers");

	// Generates a layer array from the character's appearance array, sorted by drawing order
	C.AppearanceLayers = CharacterAppearanceSortLayers(C);

	// Run AfterLoadCanvas hooks
	C.RunHooks("AfterLoadCanvas");

	// Sets the total height modifier for that character
	CharacterAppearanceSetHeightModifiers(C);

	// Reload the canvas
	CharacterAppearanceBuildCanvas(C);
}

/**
 * Reloads all character canvases in need of being redrawn.
 * @returns {void} - Nothing
 */
function CharacterLoadCanvasAll() {
	for (let C = 0; C < Character.length; C++)
		if (Character[C].MustDraw) {
			CharacterLoadCanvas(Character[C]);
			Character[C].MustDraw = false;
		}
}

/**
 * Sets the current character to have a dialog with
 * @param {Character} C - Character to have a conversation with
 * @returns {void} - Nothing
 */
function CharacterSetCurrent(C) {
	CurrentCharacter = C;
	DialogMenuMode = "dialog";
	var NewDialog = DialogIntro();
	if (!Player.CanTalk()) NewDialog = DialogFind(CurrentCharacter, "PlayerGagged", "");
	if (NewDialog != "") C.CurrentDialog = NewDialog;
}

/**
 * Changes the character money and sync with the account server, factors in the cheaters version.
 * @param {Character} C - Character for which we are altering the money amount
 * @param {number} Value - Money to subtract/add
 * @returns {void} - Nothing
 */
function CharacterChangeMoney(C, Value) {
	C.Money = parseInt(C.Money) + parseInt(Value) * ((Value > 0) ? CheatFactor("DoubleMoney", 2) : 1);
	ServerPlayerSync();
}

/**
 * Refreshes the character parameters (Effects, poses, canvas, settings, etc.)
 * @param {Character} C - Character to refresh
 * @param {boolean} [Push=true] - Pushes the data to the server if true or null
 * @param {boolean} [RefreshDialog=true] - Refreshes the character dialog
 * @returns {void} - Nothing
 */
function CharacterRefresh(C, Push, RefreshDialog = true) {
	AnimationPurge(C, false);
	CharacterLoadEffect(C);
	CharacterLoadPose(C);
	CharacterLoadCanvas(C);
	// Label often looped through checks:
	C.RunScripts = (!C.AccountName.startsWith('Online-') || !(Player.OnlineSettings && Player.OnlineSettings.DisableAnimations)) && (!Player.GhostList || Player.GhostList.indexOf(C.MemberNumber) == -1);
	C.HasScriptedAssets = !!C.Appearance.find(CA => CA.Asset.DynamicScriptDraw);

	if ((C.ID == 0) && (C.OnlineID != null) && ((Push == null) || (Push == true))) {
		ChatRoomRefreshChatSettings();
		ServerPlayerAppearanceSync();
	}
	// Also refresh the current dialog menu if the refreshed character is the current character.
	var Current = CharacterGetCurrent();
	if (Current && C.ID == Current.ID && RefreshDialog) {
		CharacterRefreshDialog(C);
	}
}

/**
 * Refresh the character's dialog state.
 *
 * This function restore consistency between its state variables and the new character appearance,
 * like making sure the focused items are still present and deselecting them otherwise.
 *
 * @param {Character} C - Character to refresh
 * @returns {void} - Nothing
 */
function CharacterRefreshDialog(C) {
	// Get a reference to the currently focused item
	const focusItem = C && C.FocusGroup ? InventoryGet(C, C.FocusGroup.Name) : null;

	// Skip refreshing anything dialog-related when we're in the wardrobe
	if (DialogIsInWardrobe()) return;

	if (DialogMenuMode === "items" || DialogMenuMode === "activities" || DialogMenuMode === "permissions") {
		// We were looking at some inventory, reload it to update the UI
		DialogChangeMode(DialogMenuMode);
	} else if (DialogMenuMode === "extended" || DialogMenuMode === "tighten") {
		if (!focusItem) {
			// Focused item was removed
			DialogLeaveFocusItem();
			return;
		}

		// We were looking at an extended screen
		const wasLock = DialogFocusItem && DialogFocusItem.Asset.IsLock;
		const sourceItem = wasLock ? DialogFocusSourceItem : DialogFocusItem;
		const previousItem = sourceItem ? InventoryGet(C, sourceItem.Asset.Group.Name) : null;
		if (!previousItem || previousItem.Asset.Name !== focusItem.Asset.Name) {
			// Unable to reload the source item, or it's different now
			DialogLeaveFocusItem();
			return;
		}

		const lock = InventoryGetLock(focusItem);
		if (wasLock && !lock) {
			// The lock on the focused item was removed
			DialogLeaveFocusItem();
			return;
		} else if (!focusItem.Asset.Extended) {
			// Shouldn't happen but we don't want to open an extended screen on that
			DialogChangeMode("items");
			return;
		}

		// Replace the focus items from underneath us so we get the updated data
		if (wasLock) {
			DialogFocusItem = lock;
			DialogFocusSourceItem = focusItem;
		} else {
			DialogFocusItem = focusItem;
		}

		// Reset the cached extended item requirement checks
		if (DialogFocusItem.Asset.Extended) {
			ExtendedItemRequirementCheckMessageMemo.clearCache();
		}
	} else if (DialogMenuMode === "colorItem") {
		const itemRemovedOrDifferent = !focusItem || InventoryGetItemProperty(ItemColorItem, "Name") !== InventoryGetItemProperty(focusItem, "Name");
		if (itemRemovedOrDifferent) {
			ItemColorCancelAndExit();
			DialogChangeMode("items");
			return;
		}
	} else if (DialogMenuMode === "locking" || DialogMenuMode === "locked") {
		if (!focusItem || DialogMenuMode === "locked" && !DialogCanCheckLock(C, focusItem)) {
			// Focused item was removed, or lost its lock
			DialogChangeMode("items");
		} else {
			// Refresh by resetting the mode
			DialogChangeMode(DialogMenuMode);
		}
	} else if (DialogMenuMode === "crafted") {
		// Automatically updates in DialogDraw()
	}
}

/**
 * Checks if a character is wearing items (restraints), the slave collar is ignored.
 * @param {Character} C - Character to inspect the appearance of
 * @returns {boolean} - Returns TRUE if the given character is wearing an item
 */
function CharacterHasNoItem(C) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Category == "Item"))
			if (C.Appearance[A].Asset.Group.Name != "ItemNeck" || (C.Appearance[A].Asset.Group.Name == "ItemNeck" && !InventoryOwnerOnlyItem(C.Appearance[A])))
				return false;
	return true;
}

/**
 * Checks if a character is naked
 * @param {Character} C - Character to inspect the appearance of
 * @returns {boolean} - Returns TRUE if the given character is naked
 */
function CharacterIsNaked(C) {
	for (const A of C.Appearance)
		if (
			(A.Asset != null) &&
			// Ignore items
			(A.Asset.Group.Category == "Appearance") &&
			// Ignore body parts
			A.Asset.Group.AllowNone &&
			// Always ignore all cosplay items
			!A.Asset.BodyCosplay &&
			!A.Asset.Group.BodyCosplay &&
			// Ignore cosplay items if they are considered bodypart (BlockBodyCosplay)
			(
				C.IsNpc() ||
				!(
					A.Asset.Group.BodyCosplay &&
					C.OnlineSharedSettings &&
					C.OnlineSharedSettings.BlockBodyCosplay
				)
			)
		)
			return false;
	return true;
}

/**
 * Checks if a character is in underwear
 * @param {Character} C - Character to inspect the appearance of
 * @returns {boolean} - Returns TRUE if the given character is at most in underwear (can be naked)
 */
function CharacterIsInUnderwear(C) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Category == "Appearance") && C.Appearance[A].Asset.Group.AllowNone && !C.Appearance[A].Asset.BodyCosplay && !C.Appearance[A].Asset.Group.BodyCosplay)
			if (!C.Appearance[A].Asset.Group.Underwear)
				if (C.IsNpc() || !(C.Appearance[A].Asset.Group.BodyCosplay && C.OnlineSharedSettings && C.OnlineSharedSettings.BlockBodyCosplay))
					return false;
	return true;
}

/**
 * Removes all appearance items from the character
 * @param {Character} C - Character to undress
 * @returns {void} - Nothing
 */
function CharacterNaked(C) {
	CharacterAppearanceNaked(C);
	CharacterRefresh(C);
}

/**
 * Dresses the given character in random underwear
 * @param {Character} C - Character to randomly dress
 * @returns {void} - Nothing
 */
function CharacterRandomUnderwear(C) {

	// Clear the current clothes
	for (let A = C.Appearance.length - 1; A >= 0; A--)
		if ((C.Appearance[A].Asset.Group.Category == "Appearance") && C.Appearance[A].Asset.Group.AllowNone) {
			C.Appearance.splice(A, 1);
		}

	// Generate random undies at a random color
	var Color = "";
	for (const G of AssetGroup)
		if ((G.Category == "Appearance") && G.Underwear && (G.IsDefault || (Math.random() < 0.2))) {
			if (Color == "") Color = CommonRandomItemFromList("", G.ColorSchema);
			const Group = G.Asset
				.filter(A => A.Value == 0 || InventoryAvailable(C, A.Name, G.Name));
			if (Group.length > 0)
				CharacterAppearanceSetItem(C, G.Name, Group[Math.floor(Group.length * Math.random())], Color);
		}

	// Refreshes the character
	CharacterRefresh(C);

}

/**
 * Removes all appearance items from the character except underwear
 * @param {Character} C - Character to undress partially
 * @param {Array.<*>} Appearance - Appearance array to remove clothes from
 * @returns {void} - Nothing
 */
function CharacterUnderwear(C, Appearance) {
	CharacterAppearanceNaked(C);
	for (let A = 0; A < Appearance.length; A++)
		if ((Appearance[A].Asset != null) && Appearance[A].Asset.Group.Underwear && (Appearance[A].Asset.Group.Category == "Appearance"))
			C.Appearance.push(Appearance[A]);
	CharacterRefresh(C);
}

/**
 * Redresses a character based on a given appearance array
 * @param {Character} C - Character to redress
 * @param {Array.<*>} Appearance - Appearance array to redress the character with
 * @returns {void} - Nothing
 */
function CharacterDress(C, Appearance) {
	if ((Appearance != null) && (Appearance.length > 0)) {
		for (let A = 0; A < Appearance.length; A++)
			if ((Appearance[A].Asset != null) && (Appearance[A].Asset.Group.Category == "Appearance"))
				if (InventoryGet(C, Appearance[A].Asset.Group.Name) == null)
					C.Appearance.push(Appearance[A]);
		CharacterRefresh(C);
	}
}

/**
 * Removes all binding items from a given character
 * @param {Character} C - Character to release
 * @param {boolean} [Refresh=false] - do not call CharacterRefresh if false
 * @returns {void} - Nothing
 */
function CharacterRelease(C, Refresh) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (C.Appearance[E].Asset.IsRestraint) {
			C.Appearance.splice(E, 1);
		}
	if (Refresh || Refresh == null) CharacterRefresh(C);
}

/**
 * Releases a character from all locks matching the given lock name
 * @param {Character} C - Character to release from the lock(s)
 * @param {AssetLockType} LockName - Name of the lock to look for
 * @returns {void} - Nothing
 */
function CharacterReleaseFromLock(C, LockName) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.LockedBy == LockName))
			InventoryUnlock(C, C.Appearance[A]);
}

/**
 * Releases a character from all restraints that are not locked
 * @param {Character} C - Character to release
 * @returns {void} - Nothing
 */
function CharacterReleaseNoLock(C) {
	for (let E = C.Appearance.length - 1; E >= 0; E--)
		if (C.Appearance[E].Asset.IsRestraint && ((C.Appearance[E].Property == null) || (C.Appearance[E].Property.LockedBy == null))) {
			C.Appearance.splice(E, 1);
		}
	CharacterRefresh(C);
}

/**
 * Removes all items except for clothing and slave collars from the character
 * @param {Character} C - Character to release
 * @returns {void} - Nothing
 */
function CharacterReleaseTotal(C) {
	for (let E = C.Appearance.length - 1; E >= 0; E--) {
		if (C.Appearance[E].Asset.Group.Category != "Appearance") {
			if (C.IsOwned() && C.Appearance[E].Asset.Name == "SlaveCollar") {
				// Reset slave collar to the default model if it has a gameplay effect (such as gagging the player)
				if (C.Appearance[E].Property && C.Appearance[E].Property.Effect && C.Appearance[E].Property.Effect.length > 0)
					delete C.Appearance[E].Property;
			}
			else {
				C.Appearance.splice(E, 1);
			}
		}
	}
	CharacterRefresh(C);
}

/**
 * Gets the bonus amount of a given type for a given character (Kidnap league)
 * @param {Character} C - Character for which we want to get the bonus amount
 * @param {string} BonusType - Type/name of the bonus to look for
 * @returns {number} - Active bonus amount for the bonus type
 */
function CharacterGetBonus(C, BonusType) {
	var Bonus = 0;
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Asset != null) && (C.Inventory[I].Asset.Bonus != null) && (C.Inventory[I].Asset.Bonus == BonusType))
			Bonus++;
	return Bonus;
}

/**
 * Restrains a character with random restraints. Some restraints are specifically disabled for randomization in their definition.
 * @param {Character} C - The target character to restrain
 * @param {"FEW"|"LOT"|"ALL"} [Ratio] - Amount of restraints to put on the character
 * @param {boolean} [Refresh] - do not call CharacterRefresh if false
 */
function CharacterFullRandomRestrain(C, Ratio, Refresh) {

	// Sets the ratio depending on the parameter
	var RatioRare = 0.75;
	var RatioNormal = 0.25;
	if (Ratio != null) {
		if (Ratio.trim().toUpperCase() == "FEW") { RatioRare = 1; RatioNormal = 0.5; }
		if (Ratio.trim().toUpperCase() == "LOT") { RatioRare = 0.5; RatioNormal = 0; }
		if (Ratio.trim().toUpperCase() == "ALL") { RatioRare = 0; RatioNormal = 0; }
	}

	// Apply each item if needed
	if (InventoryGet(C, "ItemArms") == null) InventoryWearRandom(C, "ItemArms", null, false);
	if ((Math.random() >= RatioRare) && (InventoryGet(C, "ItemHead") == null)) InventoryWearRandom(C, "ItemHead", null, false);
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemMouth") == null)) InventoryWearRandom(C, "ItemMouth", null, false);
	if ((Math.random() >= RatioRare) && (InventoryGet(C, "ItemNeck") == null)) InventoryWearRandom(C, "ItemNeck", null, false);
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemLegs") == null)) InventoryWearRandom(C, "ItemLegs", null, false);
	if ((Math.random() >= RatioNormal) && !C.IsKneeling() && (InventoryGet(C, "ItemFeet") == null)) InventoryWearRandom(C, "ItemFeet", null, false);

	if (Refresh || Refresh == null) CharacterRefresh(C);

}

/**
 * Sets a new pose for the character
 * @param {Character} C - Character for which to set the pose
 * @param {null | AssetPoseName} NewPose - Name of the pose to set as active or `null` to return to the default pose
 * @param {boolean} [ForceChange=false] - TRUE if the set pose(s) should overwrite current active pose(s)
 * @returns {void} - Nothing
 */
function CharacterSetActivePose(C, NewPose, ForceChange = false) {
	if (NewPose == null || ForceChange || C.ActivePose == null) {
		C.ActivePose = (NewPose == null) ? [] : [NewPose];
		CharacterRefresh(C, false);
		return;
	}

	if (C.ActivePose == null) C.ActivePose = [];
	if (typeof C.ActivePose == "string") C.ActivePose = [C.ActivePose];

	const PreviousPoses = C.ActivePose.map(AP => PoseFemale3DCG.find(P => P.Name == AP)).filter(AP => typeof AP == "object");
	const Pose = PoseFemale3DCG.find(P => P.Name == NewPose);

	// We only allow poses of different categories to be matched together
	if (Pose && Pose.Category) {
		C.ActivePose = PreviousPoses
			.filter(PP => PP.AllowMenu && Pose.Category !== "BodyFull" && PP.Category !== "BodyFull" && PP.Category !== Pose.Category)
			.map(AP => AP.Name);
		C.ActivePose.push(Pose.Name);
	}

	// If we reset to base, we remove the poses
	if (C.ActivePose.filter(P => P !== "BaseUpper" && P !== "BaseLower").length == 0) C.ActivePose = [];

	CharacterRefresh(C, false);
}

/**
 * Sets a specific facial expression on the character's specified AssetGroup.
 *
 * If there's a timer, the expression will expire after it. Note that a timed expression cannot override another one.
 *
 * Be careful that "Eyes" for this function means both eyes. Use Eyes1/Eyes2 to target the left or right one only.
 *
 * @param {Character} C - Character for which to set the expression of
 * @param {AssetGroupBodyName | "Eyes1"} AssetGroup - Asset group for the expression
 * @param {ExpressionName} Expression - Name of the expression to use
 * @param {number} [Timer] - Optional: time the expression will last
 * @param {string|string[]} [Color] - Optional: color of the expression to set
 * @returns {void} - Nothing
 */
function CharacterSetFacialExpression(C, AssetGroup, Expression, Timer, Color) {
	// A normal eye expression is triggered for both eyes
	if (AssetGroup == "Eyes") CharacterSetFacialExpression(C, "Eyes2", Expression, Timer, Color);
	if (AssetGroup == "Eyes1") AssetGroup = "Eyes";

	var Ex = InventoryGet(C, AssetGroup);
	if ((Timer != null) && (Ex != null) && (Ex.Property != null) && (Ex.Property.Expression != null)) return;
	for (let A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Asset.Group.Name == AssetGroup) && (C.Appearance[A].Asset.Group.AllowExpression)) {
			if ((Expression == null) || (C.Appearance[A].Asset.Group.AllowExpression.indexOf(Expression) >= 0)) {
				if (!C.Appearance[A].Property) C.Appearance[A].Property = {};
				// Delete any existing removal timer
				delete C.Appearance[A].Property.RemoveTimer;
				if (C.Appearance[A].Property.Expression != Expression) {
					C.Appearance[A].Property.Expression = Expression;
					if (Color && CommonColorIsValid(Color)) C.Appearance[A].Color = Color;
					CharacterRefresh(C);
					if (CurrentScreen == "ChatRoom") {
						if (C.ID == 0) ChatRoomCharacterItemUpdate(C, AssetGroup);
						else ChatRoomCharacterUpdate(C);
					}
				}
				if (Timer != null) TimerInventoryRemoveSet(C, AssetGroup, Timer);
				return;
			}
		}
	}
}

/**
 * Resets the character's facial expression to the default
 * @param {Character} C - Character for which to reset the expression of
 * @returns {void} - Nothing
 */
function CharacterResetFacialExpression(C) {
	for (const item of C.Appearance) {
		const group = item.Asset.Group;
		if (group.IsAppearance() && group.AllowExpression) {
			CharacterSetFacialExpression(C, group.Name, null);
		}
	}
}

/**
 * Checks if a given expression is allowed on a character
 * @param {Character} C
 * @param {Item} Item
 * @param {ExpressionName} Expression
 */
function CharacterIsExpressionAllowed(C, Item, Expression) {
	if (!C || !Item) return false;

	const allowedExpr = InventoryGetItemProperty(Item, "AllowExpression", true);
	const exprPres = InventoryGetItemProperty(Item, "ExpressionPrerequisite", true);
	const exprPre = exprPres[allowedExpr.indexOf(Expression)];

	return ((Expression == null || allowedExpr.includes(Expression)) && (!exprPre || InventoryPrerequisiteMessage(C, exprPre) === ""));
}

/**
 * Gets the currently selected character
 * @returns {Character|null} - Currently selected character
 */
function CharacterGetCurrent() {
	if (CurrentScreen == "Appearance" && CharacterAppearanceSelection) {
		return CharacterAppearanceSelection;
	} else if (CurrentScreen == "Crafting") {
		return CraftingPreview;
	} else {
		return (Player.FocusGroup != null) ? Player : CurrentCharacter;
	}
}

/**
 * Compresses a character wardrobe from an array to a LZ string to use less storage space
 * @param {Array.<Array.<*>>} Wardrobe - Uncompressed wardrobe
 * @returns {string} - The compressed wardrobe
 */
function CharacterCompressWardrobe(Wardrobe) {
	if (Array.isArray(Wardrobe) && (Wardrobe.length > 0)) {
		var CompressedWardrobe = [];
		for (let W = 0; W < Wardrobe.length; W++) {
			var Arr = [];
			if (Wardrobe[W] != null)
				for (let A = 0; A < Wardrobe[W].length; A++)
					Arr.push([Wardrobe[W][A].Name, Wardrobe[W][A].Group, Wardrobe[W][A].Color, Wardrobe[W][A].Property]);
			CompressedWardrobe.push(Arr);
		}
		return LZString.compressToUTF16(JSON.stringify(CompressedWardrobe));
	} else return "";
}

/**
 * Decompresses a character wardrobe from a LZ String to an array if it was previously compressed (For backward compatibility with old
 * wardrobes)
 * @param {Array.<Array.<*>> | string} Wardrobe - The current wardrobe
 * @returns {Array.<Array.<*>>} - The array of wardrobe items decompressed
 */
function CharacterDecompressWardrobe(Wardrobe) {
	if (typeof Wardrobe === "string") {
		var CompressedWardrobe = JSON.parse(LZString.decompressFromUTF16(Wardrobe));
		var DecompressedWardrobe = [];
		if (CompressedWardrobe != null) {
			for (let W = 0; W < CompressedWardrobe.length; W++) {
				var Arr = [];
				for (let A = 0; A < CompressedWardrobe[W].length; A++)
					Arr.push({ Name: CompressedWardrobe[W][A][0], Group: CompressedWardrobe[W][A][1], Color: CompressedWardrobe[W][A][2], Property: CompressedWardrobe[W][A][3] });
				DecompressedWardrobe.push(Arr);
			}
		}
		return DecompressedWardrobe;
	}
	return Wardrobe;
}

/**
 * Checks if the character is wearing an item that has a specific attribute
 * @param {Character} C - The character to test for
 * @param {AssetAttribute} Attribute - The name of the attribute that must be allowed
 * @returns {boolean} - TRUE if at least one item has that attribute
 */
function CharacterHasItemWithAttribute(C, Attribute) {
	return C.Appearance.some(item => {
		return InventoryGetItemProperty(item, "Attribute").includes(Attribute);
	});
}

/**
 * Checks if the character is wearing an item that allows for a specific activity
 * @param {Character} C - The character to test for
 * @param {string} Activity - The name of the activity that must be allowed
 * @returns {Item[]} - A list of items allowing that activity
 */
function CharacterItemsForActivity(C, Activity) {
	return C.Appearance.filter(item => {
		return InventoryGetItemProperty(item, "AllowActivity").includes(Activity);
	});
}

/**
 * Checks if the character is wearing an item that allows for a specific activity
 * @param {Character} C - The character to test for
 * @param {String} Activity - The name of the activity that must be allowed
 * @returns {boolean} - TRUE if at least one item allows that activity
 */
function CharacterHasItemForActivity(C, Activity) {
	return CharacterItemsForActivity(C, Activity).length > 0;
}

/**
 * Checks if the character is edged or not. The character is edged if every equipped vibrating item on an orgasm zone has the "Edged" effect
 * @param {Character} C - The character to check
 * @returns {boolean} - TRUE if the character is edged, FALSE otherwise
 */
function CharacterIsEdged(C) {
	if (C.ID !== 0 || !C.Effect.includes("Edged")) {
		return false;
	}

	// Get all zones that allow an orgasm
	let OrgasmZones = C.ArousalSettings.Zone
		.filter(Zone => Zone.Orgasm)
		.map(Zone => Zone.Name);

	// Get every vibrating item acting on an orgasm zone
	const VibratingItems = C.Appearance
		.filter(A => OrgasmZones.indexOf(A.Asset.ArousalZone) >= 0)
		.filter(Item => Item
			&& Item.Property
			&& Array.isArray(Item.Property.Effect)
			&& Item.Property.Effect.includes("Vibrating")
			&& typeof Item.Property.Intensity === "number"
			&& Item.Property.Intensity >= 0
		);

	// Return true if every vibrating item on an orgasm zone has the "Edged" effect
	return !!VibratingItems.length && VibratingItems.every(Item => Item.Property.Effect && Item.Property.Effect.includes("Edged"));
}

/**
 * Checks if the character is wearing an item flagged as a category in a blocked list
 * @param {Character} C - The character to validate
 * @param {Array} BlockList - An array of strings to validate
 * @returns {boolean} - TRUE if the character is wearing a blocked item, FALSE otherwise
 */
function CharacterHasBlockedItem(C, BlockList) {
	if ((BlockList == null) || !Array.isArray(BlockList) || (BlockList.length == 0)) return false;
	for (let B = 0; B < BlockList.length; B++)
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Category != null) && (C.Appearance[A].Asset.Category.indexOf(BlockList[B]) >= 0))
				return true;
	return false;
}

/**
 * Retrieves the member numbers of the given character
 * @param {Character} C - The character to retrieve the lovers numbers from
 * @param {Boolean} [MembersOnly] - Whether to omit NPC lovers - defaults to false (NPCs will be included by default)
 * @returns {Array<String | Number>} - A list of member numbers or NPC account names representing the lovers of the
 * given character
 */
function CharacterGetLoversNumbers(C, MembersOnly) {
	var LoversNumbers = [];
	if (typeof C.Lovership == "undefined") return [];
	for (let L = 0; L < C.Lovership.length; L++) {
		if (C.Lovership[L].MemberNumber) { LoversNumbers.push(C.Lovership[L].MemberNumber); }
		else if (C.Lovership[L].Name && (MembersOnly == null || MembersOnly == false)) { LoversNumbers.push(C.Lovership[L].Name); }
	}
	return LoversNumbers;
}

/**
 * Returns whether the character appears upside-down on the screen which may depend on the player's own inverted status
 * @param {Character} C - The character to check
 * @returns {boolean} - If TRUE, the character appears upside-down
 */
function CharacterAppearsInverted(C) {
	return Player.GraphicsSettings && Player.GraphicsSettings.InvertRoom ? Player.IsInverted() != C.IsInverted() : C.IsInverted();
}

/**
 * Checks whether the given character can kneel unaided
 * @param {Character} C - The character to check
 * @returns {boolean} - Returns true if the character is capable of kneeling unaided, false otherwise
 */
function CharacterCanKneel(C) {
	if (C.Effect.includes("Freeze") || C.Effect.includes("ForceKneel")) return false;
	if (C.Pose == null) return true;
	if (C.Pose.includes("Suspension") || C.Pose.includes("Hogtied")) return false;
	return C.CanChangeToPose("Kneel");
}

/**
 * Determines how much the character's view should be darkened based on their blind level. 1 is fully visible, 0 is pitch black.
 * @param {Character} C - The character to check
 * @param {boolean} [eyesOnly=false] - If TRUE only check whether the character has eyes closed, and ignore item effects
 * @returns {number} - The number between 0 (dark) and 1 (bright) that determines screen darkness
 */
function CharacterGetDarkFactor(C, eyesOnly = false) {
	let DarkFactor = 1.0;
	const blindLevel = C.GetBlindLevel(eyesOnly);
	if (blindLevel >= 3) DarkFactor = 0.0;
	else if (CommonPhotoMode) DarkFactor = 1.0;
	else if (blindLevel === 2) DarkFactor = 0.15;
	else if (blindLevel === 1) DarkFactor = 0.3;
	return DarkFactor;
}

/**
 * Gets the array of color tints that should be applied for a character in RGBA format.
 * @param {Character} C - The character
 * @returns {RGBAColor[]} - A list of RGBA tints that are currently affecting the character
 */
function CharacterGetTints(C) {
	if (!C.HasTints()) {
		return [];
	}
	/** @type {RGBAColor[]} */
	const tints = C.Tints.map(({Color, Strength, DefaultColor, Item}) => {
		let colorIndex = 0;
		if (typeof Color === "number") {
			colorIndex = Color;
			if (typeof Item.Color === "string") {
				Color = Item.Color;
			} else if (Array.isArray(Item.Color)) {
				Color = Item.Color[Color] || "Default";
			} else {
				Color = "Default";
			}
		}
		if (Color === "Default") {
			if (!Item.Asset.DefaultColor.every(i => i === "Default")) {
				Color = Item.Asset.DefaultColor[colorIndex];
			} else if (typeof DefaultColor === "string") {
				Color = DefaultColor;
			} else if (typeof Item.Asset.DefaultTint === "string") {
				Color = Item.Asset.DefaultTint;
			}
		}
		const {r, g, b} = DrawHexToRGB(Color);
		return {r, g, b, a: Math.max(0, Math.min(Strength, 1))};
	});
	return tints.filter(({a}) => a > 0);
}

/**
 * Gets the clumsiness level of a character. This represents dexterity when interacting with locks etc. and can have a
 * maximum value of 5.
 * @param {Character} C - The character to check
 * @returns {number} - The clumsiness rating of the player, a number between 0 and 5 inclusive.
 */
function CharacterGetClumsiness(C) {
	let clumsiness = 0;
	if (!C.CanInteract()) clumsiness += 1;
	const armItem = InventoryGet(C, "ItemArms");
	if (armItem && armItem.Asset.IsRestraint && InventoryItemHasEffect(armItem, "Block")) clumsiness += 2;
	const handItem = InventoryGet(C, "ItemHands");
	if (handItem && handItem.Asset.IsRestraint && InventoryItemHasEffect(handItem, "Block")) clumsiness += 3;
	return Math.min(clumsiness, 5);
}

/**
 * Applies hooks to a character based on conditions
 * Future hooks go here
 * @param {Character} C - The character to check
 * @param {boolean} IgnoreHooks - Whether to remove some hooks from the player (such as during character dialog).
 * @returns {boolean} - If a hook was applied or removed
 */
function CharacterCheckHooks(C, IgnoreHooks) {
	var refresh = false;
	if (C && C.DrawAppearance) {
		if (!IgnoreHooks && Player.Effect.includes("VRAvatars") && C.Effect.includes("HideRestraints")) {
			// Then when that character enters the virtual world, register a hook to strip out restraint layers (if needed):
			const hideRestraintsHook = () => {
				C.DrawAppearance = C.DrawAppearance.filter((Layer) => !(Layer.Asset && Layer.Asset.IsRestraint));
				C.DrawPose = C.DrawPose.filter((Pose) => (Pose != "TapedHands"));
			};

			if (C.RegisterHook("BeforeSortLayers", "HideRestraints", hideRestraintsHook))
				refresh = true;

		} else if (C.UnregisterHook("BeforeSortLayers", "HideRestraints"))
			refresh = true;


		if (C.DrawAppearance.some(a => a.Asset && a.Asset.NotVisibleOnScreen && a.Asset.NotVisibleOnScreen.length > 0))
			refresh = true;

		// Hook for layer visibility
		// Visibility is a string individual layers have. If an item has any layers with visibility, it should have the LayerVisibility: true property
		// We basically check the player's items and see if any are visible that have the LayerVisibility property.
		let LayerVisibility = C.DrawAppearance.some(a => a.Asset && a.Asset.LayerVisibility);

		if (LayerVisibility) {
			// Fancy logic is to use a different hook for when the character is focused
			const layerVisibilityHook = () => {
				const inDialog = (CurrentCharacter != null);
				C.AppearanceLayers = C.AppearanceLayers.filter((Layer) => (
					!Layer.Visibility ||
					(Layer.Visibility == "Player" && C.IsPlayer()) ||
					(Layer.Visibility == "AllExceptPlayerDialog" && !(inDialog && C.IsPlayer())) ||
					(Layer.Visibility == "Others" && !C.IsPlayer()) ||
					(Layer.Visibility == "OthersExceptDialog" && !(inDialog && !C.IsPlayer())) ||
					(Layer.Visibility == "Owner" && C.IsOwnedByPlayer()) ||
					(Layer.Visibility == "Lovers" && C.IsLoverOfPlayer()) ||
					(Layer.Visibility == "Mistresses" && LogQuery("ClubMistress", "Management"))
				));
			};

			if (C.RegisterHook("AfterLoadCanvas", "LayerVisibilityDialog", layerVisibilityHook)) {
				refresh = true;
			}
		} else if (C.UnregisterHook("AfterLoadCanvas", "LayerVisibility")) {
			refresh = true;
		}
	}

	if (refresh)
		CharacterLoadCanvas(C);

	return refresh;
}

/**
 * Transfers an item from one character to another
 * @param {Character} FromC - The character from which to pick the item
 * @param {Character} ToC - The character on which we must put the item
 * @param {AssetGroupName} Group - The item group to transfer (Cloth, Hat, etc.)
 * @returns {void} - Nothing
 */
function CharacterTransferItem(FromC, ToC, Group, Refresh) {
	let Item = InventoryGet(FromC, Group);
	if (Item == null) return;
	InventoryWear(ToC, Item.Asset.Name, Group, Item.Color, Item.Difficulty);
	if (Refresh) CharacterRefresh(ToC);
}

/**
 * Check if the given character can be aroused at all.
 * @param {Character} C - The character to test
 * @returns {boolean} That character can be aroused
 */
function CharacterHasArousalEnabled(C) {
	return (C.ArousalSettings != null)
		&& (C.ArousalSettings.Zone != null)
		&& (C.ArousalSettings.Active != null)
		&& (C.ArousalSettings.Active != "Inactive");
}

/**
 * Removes all ownership and owner-only data
 * @param {Character} C - The character breaking from their owner
 * @returns {void} - Nothing.
 */
function CharacterClearOwnership(C) {
	C.Owner = "";
	C.Ownership = null;
	if (C.ID == 0) {
		LoginValidCollar();
		LogDeleteGroup("OwnerRule");
	}

	C.Appearance = C.Appearance.filter(item => !item.Asset.OwnerOnly);
	C.Appearance.forEach(item => ValidationSanitizeProperties(C, item));
	CharacterRefresh(C);
}

/**
 * Returns the nickname of a character, or the name if the nickname isn't valid
 * Also validates if the character is a GGTS drone to alter her name
 * @param {Character} C - The character breaking from their owner
 * @returns {string} - The nickname to return
 */
function CharacterNickname(C) {
	let Nick = C.Nickname;
	if (Nick == null) Nick = "";
	Nick = Nick.trim().substring(0, 20);
	if ((Nick == "") || !ServerCharacterNicknameRegex.test(Nick)) Nick = C.Name;
	return AsylumGGTSCharacterName(C, Nick);
}

/**
 * Returns dialog text for a character based on their chosen pronouns. Default to She/Her entries
 * @param {Character} C - The character to fetch dialog for
 * @param {string} DialogKey - The type of dialog entry to look for
 * @param {boolean} HideIdentity - Whether to use generic they/them pronouns
 * @returns {string} - The text to use
 */
function CharacterPronoun(C, DialogKey, HideIdentity) {
	let pronounName;
	if (HideIdentity && ChatRoomSpace == ChatRoomSpaceType.MIXED || C == null) {
		pronounName = "TheyThem";
	} else {
		const pronounItem = C.Appearance.find(A => A.Asset.Group.Name == "Pronouns");
		pronounName = pronounItem ? pronounItem.Asset.Name : "SheHer";
	}
	return DialogFindPlayer("Pronoun" + DialogKey + pronounName);
}

/**
 * Returns the description text for the character's chosen pronouns. Default to She/Her
 * @param {Character} C - The character to fetch text for
 * @returns {string} - The text to use
 */
function CharacterPronounDescription(C) {
	const pronounItem = C.Appearance.find(A => A.Asset.Group.Name == "Pronouns");
	const pronounAsset = pronounItem ? pronounItem.Asset : AssetGet(C.AssetFamily, "Pronouns", "SheHer");
	return pronounAsset.Description;
}

/* Update the given character's nickname.
 *
 * Note that changing any nickname but yours (ie. Player) is not supported.
 *
 * @param {Character} C - The character to change the nickname of.
 * @param {string} Nick - The name to use as the new nickname. An empty string uses the character's real name.
 * @return {string} null if the nickname was valid, or an explanation for why the nickname was rejected.
 */
function CharacterSetNickname(C, Nick) {
	if (!C.IsPlayer()) return null;

	Nick = Nick.trim();
	if (Nick.length > 20) return "NicknameTooLong";

	if (Nick.length > 0 && !ServerCharacterNicknameRegex.test(Nick)) return "NicknameInvalidChars";

	if (C.Nickname != Nick) {
		const oldNick = C.Nickname || C.Name;
		C.Nickname = Nick;
		if (C.IsPlayer()) {
			ServerAccountUpdate.QueueData({ Nickname: Nick });
		}

		if (ServerPlayerIsInChatRoom()) {
			// When in a chatroom, send a notification that the player updated their nick
			const Dictionary = new DictionaryBuilder()
				.sourceCharacter(C)
				.destinationCharacter(C)
				.text("OldNick", oldNick)
				.text("NewNick", CharacterNickname(C))
				.build();

			ServerSend("ChatRoomChat", { Content: "CharacterNicknameUpdated", Type: "Action", Dictionary: Dictionary });
		}
	}

	return null;
}

/**
 * Updates the leash state on a character
 *
 * @param {Character} C
 */
function CharacterRefreshLeash(C) {
	if (!C.IsPlayer()) return;

	const leashes = Player.Appearance.filter(i => InventoryItemHasEffect(i, "Leash", true));

	// We aren't wearing a leash anymore, break the link
	// This can happen if someone removed the leash while in the process of being leashed away
	if (leashes.length === 0) {
		if (ChatRoomLeashPlayer !== null) {
			ChatRoomLeashPlayer = null;
		}
		return;
	}

	// Make sure our current leasher can still leash us, since binding us to the room, or
	// marking it as leash-blocking should break the leash.
	if (ChatRoomLeashPlayer !== null && !ChatRoomCanBeLeashedBy(ChatRoomLeashPlayer, Player)) {
		ChatRoomLeashPlayer = null;
	}

	// Check for a dynamic leash and update its state
	const dynamicLeash = leashes.find(i => i.Asset.AllowEffect && i.Asset.AllowEffect.includes("IsLeashed"));
	if (dynamicLeash) {
		if (!dynamicLeash.Property) dynamicLeash.Property = {};
		if (!Array.isArray(dynamicLeash.Property.Effect)) dynamicLeash.Property.Effect = [];

		if (ChatRoomLeashPlayer !== null) {
			dynamicLeash.Property.Effect.push("IsLeashed");
		} else if (ChatRoomLeashPlayer === null) {
			dynamicLeash.Property.Effect = dynamicLeash.Property.Effect.filter(e => e !== "IsLeashed");
		}

		ChatRoomCharacterUpdate(Player);
	}
}

/**
 * Create and return a character's script item, if appropriate
 * @param {Character} C
 * @returns {Item}
 */
function CharacterScriptGet(C) {
	let script = InventoryGet(C, "ItemScript");
	if (!script) {
		InventoryWear(C, "Script", "ItemScript");
		script = InventoryGet(C, "ItemScript");
	}

	script.Property = script.Property || {};
	// Propagate change and try to reload the item. If the script permissions
	// on the target were wrong, then it'll be null
	CharacterScriptRefresh(C);

	script = InventoryGet(C, "ItemScript");
	return script;
}

/**
 * Refresh the character's script
 * @param {Character} C
 */
function CharacterScriptRefresh(C) {
	ChatRoomCharacterUpdate(C);
}

/**
 * Remove a character's script item
 * @param {Character} C
 */
function CharacterScriptRemove(C) {
	InventoryRemove(C, "ItemScript", true);
}
