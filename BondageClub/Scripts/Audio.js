"use strict";
var AudioDialog = new Audio();

/** @type AudioEffect[] */
var AudioList = [
	{ Name: "Bag", File: "Bag" },
	{ Name: "Beep", File: "BeepAlarm" },
	{ Name: "BellMedium", File: "BellMedium" },
	{ Name: "BellSmall", File: "BellSmall" },
	{ Name: "Buckle", File: "Buckle" },
	{ Name: "CageClose", File: "CageClose" },
	{ Name: "CageEquip", File: "CageEquip" },
	{ Name: "CageOpen", File: "CageOpen" },
	{ Name: "CageStruggle", File: "CageStruggle" },
	{ Name: "ChainLong", File: "ChainLong" },
	{ Name: "ClothKnot", File: "ClothKnot" },
	{ Name: "ClothSlip", File: "ClothSlip" },
	{ Name: "SciFiEffect", File: "SciFiEffect" },
	{ Name: "SciFiPump", File: "SciFiPump" },
	{ Name: "SciFiConfigure", File: "SciFiConfigure" },
	{ Name: "SciFiBeeps", File: ["SciFiBeeps1", "SciFiBeeps2", "SciFiBeeps3"] },
	{ Name: "ChainShort", File: "ChainShort" },
	{ Name: "CuffsMetal", File: "CuffsMetal" },
	{ Name: "FuturisticApply", File: "FuturisticApply" },
	{ Name: "HydraulicLock", File: "HydraulicLock" },
	{ Name: "HydraulicUnlock", File: "HydraulicUnlock" },
	{ Name: "Deflation", File: "Deflation" },
	{ Name: "DuctTape", File: "DuctTape18" },
	{ Name: "DuctTapeRoll", File: "DuctTapeRoll" },
	{ Name: "DuctTapeRollShort", File: "DuctTapeRollShort" },
	{ Name: "Inflation", File: "Inflation" },
	{ Name: "MetalCuffs", File: "MetalCuffs" },
	{ Name: "LockLarge", File: "LockLarge" },
	{ Name: "LockSmall", File: "LockSmall" },
	{ Name: "RopeLong", File: ["RopeLong1", "RopeLong2", "RopeLong3"] },
	{ Name: "RopeShort", File: ["RopeShort1", "RopeShort2", "RopeShort3", "RopeShort4", "RopeShort5"] },
	{ Name: "Shocks", File: "Shocks" },
	{ Name: "SmackCrop", File: ["SmackCrop1", "SmackCrop2", "SmackCrop3"] },
	{ Name: "Whip1", File: "SmackWhip1" },
	{ Name: "Whip2", File: "SmackWhip2" },
	{ Name: "Sybian", File: "Sybian" },
	{ Name: "Unlock", File: "UnlockSmall" },
	{ Name: "VibrationLong1", File: "VibrationTone4Long3" },
	{ Name: "VibrationLong2", File: "VibrationTone4Long6" },
	{ Name: "VibrationShort", File: "VibrationTone4ShortLoop" },
	{ Name: "VibrationEdgeLow", File: "Vibrator_Advanced_LowEdge" },
	{ Name: "VibrationEdgeMedium", File: "Vibrator_Advanced_MediumEdge" },
	{ Name: "VibrationEdgeHigh", File: "Vibrator_Advanced_HighEdge" },
	{ Name: "VibrationTeaseLow", File: "Vibrator_Advanced_LowTease" },
	{ Name: "VibrationTeaseMedium", File: "Vibrator_Advanced_MediumTease" },
	{ Name: "VibrationMaximum", File: "Vibrator_Advanced_Strong" },
	{ Name: "VibrationCooldown", File: "Vibrator_Advanced_End" },
	{ Name: "Vibrator", File: "VibratorShort" },
	{ Name: "Wand", File: "Wand" },
	{ Name: "WandBig", File: "WandBig" },
	{ Name: "WoodenCuffs", File: "WoodenCuffs" },
	{ Name: "ZipTie", File: "ZipTie" },
	{ Name: "SpankSkin", File: ["SpankSkin1", "SpankSkin2", "SpankSkin3"] },
	{ Name: "WhipCrack", File: ["WhipCrack"] },
];


/**
 * A list of chat message audio effect "detectors".
 *
 * They get checked in the order they're defined, so be careful where you insert new entries.
 *
 * @type AudioChatAction[]
 */
var AudioActions = [
	{
		IsAction: (data) => data.Content === "ActionAddLock",
		GetSoundEffect: () => "LockSmall"
	},
	{
		IsAction: (data) => data.Content === "TimerRelease",
		GetSoundEffect: () => "Unlock"
	},
	{
		IsAction: (data) => data.Content === "ActionUnlock",
		GetSoundEffect: () => "Unlock"
	},
	{
		IsAction: (data) => data.Content === "ActionPick",
		GetSoundEffect: () => "Unlock"
	},
	{
		IsAction: (data) => data.Content === "ActionUnlockAndRemove",
		GetSoundEffect: () => "Unlock"
	},
	{
		IsAction: (data) => ["FuturisticCollarTriggerLockdown", "PortalLinkFunctionLock"].some(A => data.Content === A),
		GetSoundEffect: () => "HydraulicLock"
	},
	{
		IsAction: (data) => ["FuturisticCollarTriggerUnlock", "PortalLinkFunctionUnlock"].some(A => data.Content === A),
		GetSoundEffect: () => "HydraulicUnlock"
	},
	{
		IsAction: (data) => data.Content === "ActionLock",
		GetSoundEffect: AudioGetSoundFromChatMessage
	},
	{
		IsAction: (data) => ["ActionUse", "ActionSwap"].includes(data.Content) && data.Sender !== Player.MemberNumber,
		GetSoundEffect: AudioGetSoundFromChatMessage,
	},
	{
		IsAction: (data) => ["ItemDevicesKennelSetd1"].some(A => data.Content === A),
		GetSoundEffect: () => "CageClose"
	},
	{
		IsAction: (data) => ["ItemDevicesKennelSetd0"].some(A => data.Content === A),
		GetSoundEffect: () => "CageOpen"
	},
	{
		IsAction: (data) => [
			"pumps",
			"Suctightens",
			"InflatableBodyBagSet",
			"ItemButtInflVibeButtPlugIncreaseTof",
			"InflatableVibratingPantiesIncreaseTof"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "Inflation"
	},
	{
		IsAction: (data) => [
			"deflates",
			"Sucloosens",
			"ItemButtInflVibeButtPlugDecreaseTof",
			"InflatableVibratingPantiesDecreaseTof"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "Deflation"
	},
	{
		IsAction: (data) => [
			"ItemMouthFuturisticPanelGagSetPumpInflateg",
			"ItemMouthFuturisticHarnessGagSetPumpInflateg",
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "Inflation"
	},
	{
		IsAction: (data) => [
			"ItemMouthFuturisticPanelGagSetPumpDeflateg",
			"ItemMouthFuturisticHarnessGagSetPumpDeflateg",
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "Deflation"
	},
	{
		IsAction: (data) => [
			"ItemMouthFuturisticPanelGagSetg",
			"ItemMouthFuturisticHarnessBallGagSetg",
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "SciFiPump"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateNoneOff"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "FuturisticApply"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateLowPriorityEdgeLow",
			"FuturisticTrainingBeltSetStateLowPriorityEdgeLowSelf",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeLow",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeLowSelf"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationEdgeLow"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateLowPriorityTeaseLow",
			"FuturisticTrainingBeltSetStateLowPriorityLowLow"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationTeaseLow"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateCooldownOff"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationCooldown"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateLowPriorityEdgeMedium",
			"FuturisticTrainingBeltSetStateLowPriorityEdgeMediumSelf",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeMedium",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeMediumSelf"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationEdgeMedium"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateLowPriorityTeaseMedium",
			"FuturisticTrainingBeltSetStateLowPriorityMedium"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationTeaseMedium"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateLowPriorityEdgeHigh",
			"FuturisticTrainingBeltSetStateLowPriorityEdgeHighSelf",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeHigh",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeHighSelf"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationEdgeHigh"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetStateLowPriorityEdgeMaximum",
			"FuturisticTrainingBeltSetStateLowPriorityEdgeMaximumSelf",
			"FuturisticTrainingBeltSetStateLowPriorityTeaseMaximum",
			"FuturisticTrainingBeltSetStateLowPriorityTeaseHigh",
			"FuturisticTrainingBeltSetStateHighPriorityMax",
			"FuturisticTrainingBeltSetStateLowPriorityMax",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeMaximum",
			"FuturisticTrainingBeltSetStateHighPriorityEdgeMaximumSelf"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "VibrationMaximum"
	},
	{
		IsAction: (data) => [
			"InteractiveVisorSet"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "SciFiEffect"
	},
	{
		IsAction: (data) => [
			"ChainSet",
			"CeilingShacklesSet"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "ChainLong"
	},
	{
		IsAction: (data) => [
			"RopeSet"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "RopeShort"
	},
	{
		IsAction: (data) => [
			"ShacklesRestrain",
			"Ornate",
			"HighStyleSteel"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "CuffsMetal"
	},
	{
		IsAction: (data) => [
			"FuturisticChastityBeltShock",
			"ObedienceBeltShock"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "Shocks"
	},
	{
		IsAction: (data) => [
			"FuturisticChastityBeltSetClosed",
			"FuturisticChastityBeltSetOpen",
			"ItemBreastFuturisticBraSet",
			"FuturisticHeelsSet",
			"FuturisticArmbinderSet",
			"FuturisticCuffsRestrain",
			"FuturisticLegCuffsRestrain",
			"FuturisticAnkleCuffsRestrain",
			"ItemPelvisSciFiPleasurePantiesSetc",
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "SciFiConfigure"
	},
	{
		IsAction: (data) => [
			"FuturisticTrainingBeltSetGeneric",
			"ItemMouthFuturisticPanelGagSetp",
			"ItemMouthFuturisticPanelGagSett",
			"ItemPelvisSciFiPleasurePantiesSeto",
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "SciFiBeeps"
	},
	{
		IsAction: (data) => [
			"FuturisticCrateSet"
		].some(A => data.Content.includes(A)),
		GetSoundEffect: () => "SciFiConfigure"
	},
	{
		IsAction: (data) => [
			"TriggerShock",
		].some(A => data.Content.includes(A)),
		GetSoundEffect: (data) => AudioShockSounds(data)
	},
	{
		IsAction: (data) => [
			"Decrease",
			"Increase"
		].some(A => data.Content.includes(A)) && !data.Content.endsWith("-1"),
		GetSoundEffect: AudioVibratorSounds
	},
	{
		IsAction: (data) =>
			data.Type == "Activity" && (data.Content.endsWith('-Slap') || data.Content.endsWith('-Spank')),
		GetSoundEffect: () => "SpankSkin"
	},
	{
		IsAction: (data) =>
			data.Type === "Action" && data.Content === "ItemVulvaPiercingsRoundClitPiercingSetBell",
		GetSoundEffect: () => "BellSmall",
	},
	{
		IsAction: (data) => data.Type === "Activity",
		GetSoundEffect: AudioGetSoundFromChatMessage
	},
];

/**
 * Plays a sound at a given volume
 * @param {string} src - Source of the audio file to play
 * @param {number} [volume] - Volume of the audio in percentage (ranges from 0 to 1)
 * @returns {void} - Nothing
 */
function AudioPlayInstantSound(src, volume) {
	const vol = volume != null ? volume : Player.AudioSettings.Volume;
	if (vol > 0) {
		var audio = new Audio();
		audio.src = src;
		audio.volume = Math.min(vol, 1);
		audio.play();
	}
}

/**
 * Begins to play a sound when applying/removing an item
 * @param {string} SourceFile - Source of the audio file to play
 * @returns {void} - Nothing
 */
function AudioDialogStart(SourceFile) {
	if (AudioShouldSilenceSound()) return;
	AudioDialog.pause();
	AudioDialog.currentTime = 0;
	AudioDialog.src = SourceFile;
	AudioDialog.volume = Player.AudioSettings.Volume;
	AudioDialog.play();
}

/**
 * Stops playing the sound when done applying/removing an item
 * @returns {void} - Nothing
 */
function AudioDialogStop() {
	AudioDialog.pause();
	AudioDialog.currentTime = 0;
}

/** The "normal" volume for a game sound, a.k.a a sound with modifier 0 */
let AudioVolumeNormalLevel = 0.5;
/** Number of available modifier steps */
let AudioVolumeModifierSteps = 4;

/**
 * Returns the actual volume given a volume modifier.
 *
 * @param {number} modifier - The volume modifier to use, from -4 to 4
 * @returns {number} The volume level, from 0.0 to 1.0
 */
function AudioVolumeFromModifier(modifier) {
	modifier = Math.max(-AudioVolumeModifierSteps, Math.min(AudioVolumeModifierSteps, modifier));
	let volumeMod = (2 * (1 - AudioVolumeNormalLevel) * modifier / (2 * AudioVolumeModifierSteps));
	return Player.AudioSettings.Volume * AudioVolumeNormalLevel + (isNaN(volumeMod) ? 0 : volumeMod);
}

/**
 * Is sound allowed to play.
 *
 * @param {boolean} IsPlayerInvolved - Whether the player was involved in what caused the sound to play.
 * @returns {boolean} True if the player has item sound enabled, and a non-muted volume, false otherwise.
 */
function AudioShouldSilenceSound(IsPlayerInvolved = false) {
	if (!Player.AudioSettings || !Player.AudioSettings.Volume || (Player.AudioSettings.Volume == 0))
		return true;

	if (!Player.AudioSettings.PlayItem && ServerPlayerIsInChatRoom())
		return true;

	if (Player.AudioSettings.PlayItemPlayerOnly && !IsPlayerInvolved)
		return true;

	return false;
}

/**
 * Takes the received data dictionary content and identifies the audio to be played
 * @param {IChatRoomMessage} data - Data received
 * @param {Character} sender
 * @param {string} msg
 * @param {any} metadata
 * @returns {boolean}
 */
function AudioPlaySoundForChatMessage(data, sender, msg, metadata) {
	if (!data || !sender || !metadata || !["Activity", "Action", "ServerMessage"].includes(data.Type))
		return false;

	if (AudioShouldSilenceSound(ChatRoomMessageInvolvesPlayer(data))) return;

	// Instant actions can trigger a sound depending on the action.
	let Action = AudioActions.find(CA => CA.IsAction && CA.IsAction(data));
	/** @type AudioSoundEffect */
	let soundEffect = null;
	if (Action) {
		let snd = Action.GetSoundEffect(data, metadata);
		if (typeof snd === "string")
			soundEffect = [snd, 0];
		else
			soundEffect = snd;
	}

	const Target = metadata.TargetCharacter;
	if (!soundEffect || !Target) return false;

	// Update noise level depending on who the interaction took place between.  Sensory isolation increases volume for self, decreases for others.
	if (Target.MemberNumber == Player.MemberNumber) soundEffect[1] += 3;
	else if (data.Sender != Player.MemberNumber) soundEffect[1] -= 3;

	AudioPlaySoundEffect(soundEffect);

	return false;
}

/**
 * Low-level function to play a sound effect.
 * @param {AudioSoundEffect|string} soundEffect
 * @param {number} [volumeModifier]
 * @returns {boolean} if a sound was played or not.
 */
function AudioPlaySoundEffect(soundEffect, volumeModifier) {
	if (!soundEffect) return false;
	if (!volumeModifier) volumeModifier = 0;

	let soundEffectName = null;
	if (Array.isArray(soundEffect)) {
		soundEffectName = soundEffect[0];
		volumeModifier += soundEffect[1];
	} else if (typeof soundEffect === "string") {
		soundEffectName = soundEffect;
	} else {
		console.error('Invalid sound effect');
		return false;
	}
	let fileName = AudioGetFileName(soundEffectName);
	if (!fileName) return false;

	const blindLevel = Player.GetBlindLevel();
	if (blindLevel >= 3) volumeModifier += 4;
	else if (blindLevel == 2) volumeModifier += 2;
	else if (blindLevel == 1) volumeModifier += 1;

	volumeModifier -= Player.GetDeafLevel();


	// Sends the audio file to be played
	AudioPlayInstantSound("Audio/" + fileName + ".mp3", AudioVolumeFromModifier(volumeModifier));
	return true;
}

/**
 * Plays a given asset sound effect.
 * @param {Character} character
 * @param {Asset} asset
 * @returns {boolean} Whether a sound was played.
 */
function AudioPlaySoundForAsset(character, asset) {
	if (AudioShouldSilenceSound()) return;

	let sound = AudioGetSoundFromAsset(character, asset.Group.Name, asset.Name);
	return AudioPlaySoundEffect(sound, 0);
}

/**
 * Get the sound effect for a given asset.
 *
 * @param {Character} character
 * @param {AssetGroupName} groupName
 * @param {string} assetName
 * @returns {AudioSoundEffect?}
 */
function AudioGetSoundFromAsset(character, groupName, assetName) {
	let asset = AssetGet(character.AssetFamily, groupName, assetName);
	if (!asset) return null;

	let sound = asset.Audio;
	if (asset.DynamicAudio) {
		sound = asset.DynamicAudio(character);
	}

	return [sound, 0];
}

/**
 * Get a file name for a given sound effect.
 * @param {string} sound - The sound effect to load a file from.
 * @returns {string?}
 */
function AudioGetFileName(sound) {
	let audioEffect = AudioList.find(A => A.Name == sound);
	if (!audioEffect) return null;
	if (Array.isArray(audioEffect.File)) {
		return CommonRandomItemFromList("", audioEffect.File);
	} else {
		return audioEffect.File;
	}
}

/**
 * Processes which sound should be played for items
 * @param {IChatRoomMessage} data - Data content triggering the potential sound
 * @param {IChatRoomMessageMetadata} metadata - The chat message metadata
 * @returns {AudioSoundEffect | undefined} - The name of the sound to play, followed by the noise modifier
 */
function AudioGetSoundFromChatMessage(data, metadata) {
	const sender = metadata.SourceCharacter;
	if (!data || !sender) return null;

	if (data.Type === "Activity" && metadata.ActivityAsset) {
		let item = InventoryGet(sender, metadata.ActivityAsset.Group.Name);
		if (!item || item.Asset.Name !== metadata.ActivityAsset.Name) return;

		// Workaround for the shock remote; select the item on the target instead
		if (item.Asset.Name === "ShockRemote" && metadata.FocusGroup) {
			item = InventoryGet(metadata.TargetCharacter, metadata.FocusGroup.Name);
		}

		if (!item || !item.Asset.ActivityAudio) return;

		const idx = item.Asset.AllowActivity.findIndex(a => a === metadata.ActivityName);
		const soundEffect = item.Asset.ActivityAudio[idx];

		if (!soundEffect) return;

		return [soundEffect, 0];
	} else if (data.Type === "Action") {
		const NextAsset = metadata.Assets && metadata.Assets.NextAsset;
		if (!NextAsset) return;

		return AudioGetSoundFromAsset(sender, NextAsset.Group.Name, NextAsset.Name);
	}
}

/**
 * Processes the sound for vibrators
 * @param {IChatRoomMessage} data - Represents the chat message received
 * @param {IChatRoomMessageMetadata} metadata - The metadata from the recieved message
 * @returns {[string, number]} - The name of the sound to play, followed by the noise modifier
 */
function AudioVibratorSounds(data, metadata) {
	var Sound = "";

	var Level = parseInt(data.Content.substr(data.Content.length - 1));
	if (isNaN(Level)) Level = 0;

	// FIXME: what is going on in here? Assets not an array, and AssetName being an Asset and not a string?
	if (!metadata || !metadata.Assets || !metadata.Assets.AssetName)
		return null;

	const AssetName = metadata.Assets.AssetName.Name;
	// FIXME: that should be moved into a vibrating-item-specific extended property instead of an hardcoded list
	switch (AssetName) {
		/* Silent */
		case 'FuckMachine':
			break;

		default:
			Sound = "VibrationShort";
			break;

		case "WandBelt":
		case "LoveChastityBelt":
		case "SciFiPleasurePanties":
		case "VibratingLatexPanties":
		case "InflVibeButtPlug":
			Sound = "VibrationLong1";
			break;

		/*
		 * FIXME: commented out 'cause it's supposed to apply this sound to the plug part,
		 * but there's no way to detect that
		 */
		// case "InflVibeButtPlug":
		case 'BunnyTailVibePlug':
		case 'EggVibePlugXXL':
		case 'HempRopeBelt':
		case 'SpreaderVibratingDildoBar':
		case 'VibratingButtplug':
			Sound = "VibrationLong2";
			break;

		case "Sybian":
			Sound = "Sybian";
			break;
	}

	return [Sound, Level];
}

/**
 * Processes the sound for shocks
 * @param {IChatRoomMessage} data - Represents the chat message received
 * @returns {[string, number]} - The name of the sound to play, followed by the noise modifier
 */
function AudioShockSounds(data) {
	let Modifier = parseInt(data.Content.slice(-1));
	if (isNaN(Modifier)) Modifier = 0;
	return ["Shocks", Modifier];
}
