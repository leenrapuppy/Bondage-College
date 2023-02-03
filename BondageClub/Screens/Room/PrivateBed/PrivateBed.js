"use strict";
var PrivateBedBackground = "Private";
/** @type {Character[]} */
var PrivateBedCharacter = [];
var PrivateBedActivity = "Caress";
/** @type {string[]} */
var PrivateBedActivityList = [];
/** @type {string[]} */
var PrivateBedLog = [];
var PrivateBedActivityDelay = 4000;
var PrivateBedActivityMustRefresh = true;
var PrivateBedLeaveTime = 0;

/**
 * Returns TRUE if the private bed is available.
 * @returns {boolean} - TRUE if available.
 */
 function PrivateBedActive() {
	return (LogQuery("BedWhite", "PrivateRoom") || LogQuery("BedBlack", "PrivateRoom") || LogQuery("BedPink", "PrivateRoom"));
}

/**
 * Returns the number of girls in the private bedroom.
 * @returns {Number} - The number of girls.
 */
function PrivateBedCount() {
	let Count = 1;
	for (let C of PrivateCharacter)
		if ((C.PrivateBed != null) && (C.PrivateBed == true))
			Count++;
	return Count;
}

/**
 * Loads the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedLoad() {

	// Clears the previous data and adds the player in bed
	PrivateBedActivityMustRefresh = true;
	PrivateBedLog = [];
	CharacterSetActivePose(Player, null, true);
	PrivateBedBackground = PrivateBackground;
	PrivateBedCharacter = [];
	PrivateBedCharacter.push(Player);

	// Adds all NPCs that were supposed to join in bed
	for (let C of PrivateCharacter)
		if ((C.PrivateBed != null) && (C.PrivateBed == true))
			if (PrivateBedCharacter.length <= 4)
				PrivateBedCharacter.push(C);

	// Resets the activity timer
	for (let C of PrivateBedCharacter)
		C.PrivateBedActivityTimer = CommonTime() + ((C.IsPlayer()) ? 0 : PrivateBedActivityDelay + Math.round(Math.random() * PrivateBedActivityDelay));

	// Shuffles the position in the bed
	PrivateBedCharacter.sort( () => Math.random() - 0.5);
	let Left = 1125;
	let Space = 0;
	if (PrivateBedCharacter.length == 2) { Left = 900; Space = 450; }
	if (PrivateBedCharacter.length == 3) { Left = 820; Space = 305; }
	if (PrivateBedCharacter.length == 4) { Left = 750; Space = 250; }
	for (let Pos = 0; Pos < PrivateBedCharacter.length; Pos++) {
		PrivateBedCharacter[Pos].PrivateBedLeft = Left + Pos * Space;
		PrivateBedCharacter[Pos].PrivateBedTop = 0;
		if (PrivateBedCharacter[Pos].HeightRatio != null) PrivateBedCharacter[Pos].PrivateBedTop = (1 - PrivateBedCharacter[Pos].HeightRatio) * -1000;
	}

	// Strips the NPC or put her in lingerie with random odds
	for (let C of PrivateBedCharacter)
		if (C.IsNpc()) {
			C.PrivateBedAppearance = CharacterAppearanceStringify(C);
			if (C.CanInteract()) {
				CharacterNaked(C);
				if (Math.random() > 0.5) InventoryWear(C, CommonRandomItemFromList(null,  ["Bandeau1", "BondageBra1", "HarnessBra1", "CorsetBikini1", "CuteBikini1", "SexyBikini1", "FishnetBikini1", "FrameBra1", "FrameBra2", "FullLatexBra", "HeartTop", "LatexBra1", "LeatherBreastBinder", "LeatherStrapBra1", "HarnessBra2", "SexyBikini2", "SexyBikiniBra1", "OuvertPerl1", "Ribbons", "Bustier1", "SexyBeachBra1", "StarHarnessBra", "Bra10"]), "Bra", "Default");
				if (Math.random() > 0.7) InventoryWear(C, CommonRandomItemFromList(null,  ["Stockings1", "Stockings2", "Pantyhose2", "Stockings4", "Socks6", "LatexSocks1", "Pantyhose1"]), "Socks", "Default");
			}
		}

}

/**
 * Draws a private bedroom character.
 * @param {Character} C - The character to draw.
 * @returns {void} - Nothing.
 */
function PrivateBedDrawCharacter(C) {
	if (C.PrivateBedMoveTimer == null) C.PrivateBedMoveTimer = 0;
	if (C.PrivateBedMoveTimer < CommonTime()) {
		CharacterSetActivePose(C, CommonRandomItemFromList("NONE", ["OverTheHead", "Yoked", "BackBoxTie", null, null, null]));
		CharacterSetActivePose(C, CommonRandomItemFromList("NONE", ["LegsOpen", "LegsClosed"]));
		C.PrivateBedMoveTimer = CommonTime() + 10000 + Math.round(Math.random() * 20000);
	}
	if (C.IsNpc() && (C.PrivateBedActivityTimer < CommonTime())) PrivateBedNPCActivity(C);
	DrawCharacter(C, C.PrivateBedLeft, C.PrivateBedTop, 1);
}

/**
 * Runs the private bedroom screen.
 * @returns {void} - Nothing.
 */
function PrivateBedRun() {

	// Draws the bed & characters
	if (LogQuery("BedBlack", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/Black.png", 0, 0);
	if (LogQuery("BedWhite", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/White.png", 0, 0);
	if (LogQuery("BedPink", "PrivateRoom")) DrawImage("Screens/Room/PrivateBed/Pink.png", 0, 0);
	for (let C of PrivateBedCharacter)
		PrivateBedDrawCharacter(C);

	// In orgasm mode, we add a pink filter and different controls depending on the stage
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Active != "Inactive") && (Player.ArousalSettings.Active != "NoMeter")) {
		if ((Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {
			DrawRect(0, 0, 2000, 1000, "#FFB0B0B0");
			if (Player.ArousalSettings.OrgasmStage == null) Player.ArousalSettings.OrgasmStage = 0;
			if (Player.ArousalSettings.OrgasmStage == 0) {
				DrawText(TextGet("OrgasmComing"), 1000, 410, "White", "Black");
				DrawButton(700, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(1050, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (Player.ArousalSettings.OrgasmStage == 1) DrawButton(ActivityOrgasmGameButtonX + 500, ActivityOrgasmGameButtonY, 250, 64, ActivityOrgasmResistLabel, "White");
			if (ActivityOrgasmRuined) ActivityOrgasmControl();
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 1000, 500, "White", "Black");
			ActivityOrgasmProgressBar(550, 970);
			return;
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 1) && (Player.ArousalSettings.Progress <= 99)) ChatRoomDrawArousalScreenFilter(0, 1000, 2000, Player.ArousalSettings.Progress);
	}

	// Draws all the buttons
	DrawButton(1890, 20, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (Player.CanChangeOwnClothes()) DrawButton(1890, 130, 90, 90, "", "White", "Icons/Dress.png", TextGet("Dress"));
	DrawButton(1890, 240, 90, 90, "", "White", "Icons/Character.png", TextGet("Character"));
	if (Player.PrivateBedActivityTimer > CommonTime()) {
		DrawText(ActivityDictionaryText("Activity" + PrivateBedActivity), 430, 120, "White", "Black");
		let Progress = 100 - (Player.PrivateBedActivityTimer - CommonTime()) / (PrivateBedActivityDelay / 100);
		DrawProgressBar(20, 180, 820, 80, Progress);
	} else {

		// Prepares the list of all activities for the player
		if (PrivateBedActivityMustRefresh) {
			PrivateBedActivityMustRefresh = false;
			PrivateBedActivityList = [];
			for (let A of ActivityFemale3DCG)
				if ((A.Name != null) && !A.Name.includes("Item") && !A.Name.includes("Reverse") && !A.Name.includes("Inject") && !A.Name.includes("Penetrate") && !A.Name.includes("Penis") && !A.Name.includes("Pussy") && (A.MaxProgress != null) && (A.MaxProgress > 0))
					if ((A.Prerequisite == null) || !A.Prerequisite.includes("UseTongue") || !Player.IsGagged())
						if ((A.Prerequisite == null) || !A.Prerequisite.includes("UseMouth") || !Player.IsGagged())
							if ((A.Prerequisite == null) || !A.Prerequisite.includes("IsGagged") || Player.IsGagged())
								if ((A.Prerequisite == null) || !A.Prerequisite.includes("IsGagged") || Player.IsGagged())
									PrivateBedActivityList.push(A.Name);
		}

		// For each possible activities
		for (let A = PrivateBedActivityList.length - 1; A >= 0; A--) {
			let X = 20 + ((A % 9) * 91);
			let Y = 20 + Math.floor(A / 9) * 91;
			DrawRect(X, Y, 90, 90, (MouseIn(X, Y, 90, 90) && !CommonIsMobile) ? "Cyan" : ((PrivateBedActivityList[A] == PrivateBedActivity) ? "#AAFFAA" : "White"));
			DrawEmptyRect(X, Y, 91, 91, "Black", 2);
			DrawImageResize("Assets/Female3DCG/Activity/" + PrivateBedActivityList[A] + ".png", X + 2, Y + 2, 87, 87);
			if (MouseIn(X, Y, 90, 90)) DrawButtonHover(X, Y, 90, 90, ActivityDictionaryText("Activity" + PrivateBedActivityList[A]));
		}

	}
	DrawRect(20, 400, 820, 580, "#000000B0");
	DrawEmptyRect(20, 400, 820, 580, "#FFFFFF", 2);
	for (let L = PrivateBedLog.length - 1; L >= 0; L--)
		DrawTextFit(PrivateBedLog[L], 430, (L * 55) + 445, 800, "#FFFFFF", "#000000");

	// If we move the mouse over a character or a zone, we highlight it
	if (!CommonIsMobile)
		for (let C of PrivateBedCharacter) {
			if ((MouseX >= C.PrivateBedLeft + 60) && (MouseX <= C.PrivateBedLeft + 140) && (MouseY >= C.PrivateBedTop + 400) && (MouseY <= C.PrivateBedTop + 500) && !C.ArousalZoom) { DrawEmptyRect(C.PrivateBedLeft + 60, C.PrivateBedTop + 400, 80, 100, "Cyan", 3); break; }
			if ((MouseX >= C.PrivateBedLeft + 50) && (MouseX <= C.PrivateBedLeft + 150) && (MouseY >= C.PrivateBedTop + 615) && (MouseY <= C.PrivateBedTop + 715) && C.ArousalZoom) { DrawEmptyRect(C.PrivateBedLeft + 50, C.PrivateBedTop + 615, 100, 100, "Cyan", 3); break; }
			if (MouseIn(C.PrivateBedLeft + 100, C.PrivateBedTop, 300, C.HeightRatio * 1000)) {
				for (let A = 0; A < AssetGroup.length; A++)
					if ((AssetGroup[A].Zone != null) && AssetActivitiesForGroup("Female3DCG", AssetGroup[A].Name).length)
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if ((AssetGroup[A].Zone[Z][0] >= 100) && (AssetGroup[A].Zone[Z][0] < 400)) {
								let Color = "#FF000040";
								if (ActivityCanBeDone(C, PrivateBedActivity, AssetGroup[A].Name) && !InventoryGroupIsBlocked(C, AssetGroup[A].Name, true)) Color = "#00FF0040";
								if (MouseIn(AssetGroup[A].Zone[Z][0] + C.PrivateBedLeft, AssetGroup[A].Zone[Z][1] + C.PrivateBedTop, AssetGroup[A].Zone[Z][2], AssetGroup[A].Zone[Z][3])) Color = (Color == "#FF000040") ? "Red" : "Cyan";
								DrawEmptyRect(AssetGroup[A].Zone[Z][0] + C.PrivateBedLeft, AssetGroup[A].Zone[Z][1] + C.PrivateBedTop, AssetGroup[A].Zone[Z][2], AssetGroup[A].Zone[Z][3], Color, 3);
							}
				break;
			}
		}

}

/**
 * Starts an arousal action on a character.
 * @param {Character} Source - The source character.
 * @param {Character} Target - The target character.
 * @param {AssetGroup} Group - The zone / group to target.
 * @param {String} Activity - The activity to do.
 * @returns {boolean} - TRUE if the activity could start.
 */
function PrivateBedActivityStart(Source, Target, Group, Activity) {

	// If there's no text linked to it, the activity is rejected
	let GroupName = Group.Name.toString();
	if (Target.HasPenis() && (GroupName == "ItemVulva")) GroupName = "ItemPenis";
	if (Target.HasPenis() && (GroupName == "ItemVulvaPiercings")) GroupName = "ItemGlans";
	let Text = ActivityDictionaryText(((Source.ID == Target.ID) ? "ChatSelf" : "ChatOther") + "-" + GroupName + "-" + Activity);
	if (Text.startsWith("MISSING ACTIVITY DESCRIPTION FOR")) return false;

	// Sets the next timer and effect
	Source.PrivateBedActivityTimer = CommonTime() + PrivateBedActivityDelay + ((Source.IsPlayer()) ? 0 : Math.round(Math.random() * PrivateBedActivityDelay));
	ActivityEffect(Source, Target, Activity, GroupName, 1);

	// Publishes in the log
	if (PrivateBedLog.length >= 10) PrivateBedLog.splice(0, 1);
	Text = Text.replace("SourceCharacter", CharacterNickname(Source));
	Text = Text.replace("TargetCharacter", CharacterNickname(Target));
	const subs = ChatRoomPronounSubstitutions(Source, "Pronoun", false);
	Text = CommonStringSubstitute(Text, subs);
	PrivateBedLog.push(Text);

	// If the player uses that activity on an NPC, it can raise the love between them
	if (Source.IsPlayer() && Target.IsNpc() && (Target.Love <= Math.random() * 100))
		if ((Target.Love < 60) || (Target.IsOwner()) || (Target.IsOwnedByPlayer()) || Target.IsLoverPrivate())
			NPCLoveChange(Target, 1);

	// Flag the activity as done
	return true;

}

/**
 * Checks if the activity if valid for the group/zone on the target character.
 * @param {Character} Source - The source character.
 * @param {Character} Target - The target character.
 * @param {AssetGroup} Group - The zone / group to target.
 * @param {Activity} Activity - The activity to do.
 * @returns {boolean} - TRUE if the activity is valid for the group
 */
function PrivateBedGroupActivityIsValid(Source, Target, Group, Activity) {
	if (Group.Name == "ItemNose") return false; // Skip the noses activities
	if (Group.Zone == null) return false; // Skip groupes that cannot be clicked
	if (Group.MirrorActivitiesFrom) return false; // No mirror zones
	if (!AssetActivitiesForGroup("Female3DCG", Group.Name).length) return false; // Make sure the activity is valid for that group
	if (!ActivityHasValidTarget(Target, Activity, Group)) return false; // Make sure the target is valid
	if (!ActivityCheckPrerequisites(Activity, Source, Target, Group)) return false; // Check if the source/target has the proper prerequisites
	if (!ActivityCheckPermissions(Activity, Source, true) || !ActivityCheckPermissions(Activity, Target, false)) return false; // Check for permissions
	if (InventoryGroupIsBlocked(Target, Group.Name, true)) return false; // Check if the group is blocked
	return true;
}

/**
 * Starts a random activity for a source NPC
 * @param {Character} Source - The source character.
 * @returns {void} - Nothing.
 */
function PrivateBedNPCActivity(Source) {

	// Selects a random target in the room
	let Target = CommonRandomItemFromList(null, PrivateBedCharacter);

	// Selects a random activity (high max progress activities like masturbation will occur more often when arousal progress is high)
	let ActivityList = [];
	let MinMaxProgress = ((Target.ArousalSettings != null) && (Target.ArousalSettings.Progress != null) && (Target.ArousalSettings.Progress >= Math.random() * 120)) ? Target.ArousalSettings.Progress : 0;
	for (let A of ActivityFemale3DCG)
		if ((A.MaxProgress != null) && (A.MaxProgress >= MinMaxProgress) && !A.Name.includes("Item") && !A.Name.includes("Reverse") && !A.Name.includes("Inject") && !A.Name.includes("Penetrate") && !A.Name.includes("Penis") && !A.Name.includes("Pussy")) {
			if ((A.Name.includes("Gag")) && !Source.IsGagged()) continue; // No gagged activities if ungagged
			if ((A.Name == "MasturbateFist") && (NPCTraitGet(Source, "Violent") <= 50)) continue; // Only violent NPCs will fist
			if ((A.Name == "MasturbateFist") && (NPCTraitGet(Source, "Horny") <= 0)) continue; // Only horny NPCs will fist
			if ((A.Name == "MoanGagGiggle") && (NPCTraitGet(Source, "Playful") <= 0)) continue; // Only playful NPCs will giggle
			if ((A.Name == "MoanGagWhimper") && (NPCTraitGet(Source, "Submissive") <= 0)) continue; // Only submissive NPCs will whimper
			if ((A.Name == "MoanGagGroan") && (NPCTraitGet(Source, "Peaceful") <= 0)) continue; // Only peaceful NPCs will groan
			if ((A.Name == "MoanGagAngry") && (NPCTraitGet(Source, "Dominant") <= 0)) continue; // Only dominant NPCs will get angry
			if ((A.Name == "Nibble") && (NPCTraitGet(Source, "Submissive") <= 0)) continue; // Only submissive NPCs will nibble
			if ((A.Name == "GagKiss") && (Source.Love < 25)) continue; // Gag kisses will only happen if love is positive
			if ((A.Name == "Kiss") && (Source.Love < 25)) continue; // Gag kisses will only happen if love is positive
			if ((A.Name == "Suck") && (Source.Love < 50)) continue; // Sucks will only happen if love is positive
			if ((A.Name == "FrenchKiss") && (Source.Love < 75)) continue; // French kisses will only happen if love is positive
			if ((A.Name == "FrenchKiss") && !Source.IsLover(Target)) continue; // French kisses will only happen if source and target are lovers
			if ((A.Name == "PoliteKiss") && (Source.Love < 0)) continue; // Polite kisses will only happen if love is positive
			if ((A.Name == "PoliteKiss") && (NPCTraitGet(Source, "Polite") <= 0)) continue; // Only polite NPCs will do polite kisses
			if ((A.Name == "Lick") && (NPCTraitGet(Source, "Horny") <= 0)) continue; // Only horny NPCs will lick
			if ((A.Name == "Bite") && (NPCTraitGet(Source, "Violent") <= 0)) continue; // Only violent NPCs will bite
			if ((A.Name == "TakeCare") && (NPCTraitGet(Source, "Wise") <= 0)) continue; // Only wise NPCs will take care
			if ((A.Name == "Pet") && (NPCTraitGet(Source, "Peaceful") < 0)) continue; // Only peaceful NPCs will groan
			if ((A.Name == "Tickle") && (NPCTraitGet(Source, "Playful") < 0)) continue; // Only playful NPCs will tickle
			if ((A.Name == "Pinch") && (NPCTraitGet(Source, "Violent") < 0)) continue; // Only violent NPCs will pinch
			if ((A.Name == "Spank") && (NPCTraitGet(Source, "Violent") < 20)) continue; // Only violent NPCs will spank
			if ((A.Name == "Pull") && (NPCTraitGet(Source, "Violent") < 40)) continue; // Only violent NPCs will pull
			if ((A.Name == "Slap") && (NPCTraitGet(Source, "Violent") < 60)) continue; // Only violent NPCs will slap
			if ((A.Name == "Choke") && (NPCTraitGet(Source, "Violent") < 80)) continue; // Only violent NPCs will chore
			if ((A.Name == "Step") && (NPCTraitGet(Source, "Dominant") <= 0)) continue; // Only dominant NPCs will step
			if ((A.Name == "Step") && !Source.IsOwned()) continue; // Only unowned NPCs will step
			if ((A.Name == "Sit") && (NPCTraitGet(Source, "Dominant") <= 0)) continue; // Only dominant NPCs will sit
			if ((A.Name == "Sit") && !Source.IsOwned()) continue; // Only unowned NPCs will sit
			if ((A.Name == "StruggleArms") && (NPCTraitGet(Source, "Submissive") < 0)) continue; // Only submissives will struggle
			if ((A.Name == "StruggleLegs") && (NPCTraitGet(Source, "Submissive") < 0)) continue; // Only submissives will struggle
			if ((A.Name == "Nod") && (NPCTraitGet(Source, "Dump") <= 0)) continue; // Only dumb NPCs will nod
			if ((A.Name == "Wiggle") && (NPCTraitGet(Source, "Playful") < 0)) continue; // Only playful NPCs will wiggle
			ActivityList.push(A.Name);
		}
	let Activity = AssetGetActivity(Target.AssetFamily, CommonRandomItemFromList(null, ActivityList));
	let ActivityPussy = AssetGetActivity(Target.AssetFamily, Activity.Name + "Pussy");
	let ActivityPenis = AssetGetActivity(Target.AssetFamily, Activity.Name + "Penis");

	// Selects a random location on the body from available locations
	let GroupList = [];
	for (let Group of AssetGroup) {
		if (PrivateBedGroupActivityIsValid(Source, Target, Group, Activity))
			GroupList.push(Group);
		else if ((ActivityPussy != null) && !Target.HasPenis() && PrivateBedGroupActivityIsValid(Source, Target, Group, ActivityPussy))
			GroupList.push(Group);
		else if ((ActivityPenis != null) && Target.HasPenis() && PrivateBedGroupActivityIsValid(Source, Target, Group, ActivityPenis))
			GroupList.push(Group);
	}
	if (GroupList.length == 0) return;
	let Group = CommonRandomItemFromList(null, GroupList);

	// Launches the activity
	if (!PrivateBedActivityStart(Source, Target, Group, Activity.Name)) {
		if ((ActivityPussy != null) && !Target.HasPenis()) PrivateBedActivityStart(Source, Target, Group, ActivityPussy.Name);
		if ((ActivityPenis != null) && Target.HasPenis()) PrivateBedActivityStart(Source, Target, Group, ActivityPenis.Name);
	}

}

/**
 * Handles clicks in the private bedroom.
 * @returns {void|boolean} - Nothing.
 */
function PrivateBedClick() {

	// If an orgasm is going on, we do not process any other clicks
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if ((MouseX >= 700) && (MouseX <= 950) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if ((MouseX >= 1050) && (MouseX <= 1300) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX + 500) && (MouseX <= ActivityOrgasmGameButtonX + 700) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// Bedroom buttons on the right side
	if (MouseIn(1890, 20, 90, 90)) PrivateBedExit();
	if (MouseIn(1890, 130, 90, 90) && Player.CanChangeOwnClothes()) CharacterAppearanceLoadCharacter(Player);
	if (MouseIn(1890, 240, 90, 90)) { PrivateBedActivityMustRefresh = true; CharacterSetCurrent(Player); }

	// Cannot do more than 1 action each X seconds
	if (Player.PrivateBedActivityTimer > CommonTime()) return;

	// Activity buttons on the left side
	for (let A = PrivateBedActivityList.length - 1; A >= 0; A--) {
		let X = 20 + ((A % 9) * 91);
		let Y = 20 + Math.floor(A / 9) * 91;
		if (MouseIn(X, Y, 90, 90)) PrivateBedActivity = PrivateBedActivityList[A];
	}

	// If a character is clicked
	for (let C of PrivateBedCharacter) {

		// The arousal meter can be maximized or minimized by clicking on it
		if ((MouseX >= C.PrivateBedLeft + 60) && (MouseX <= C.PrivateBedLeft + 140) && (MouseY >= C.PrivateBedTop + 400) && (MouseY <= C.PrivateBedTop + 500) && !C.ArousalZoom) { C.ArousalZoom = true; return; }
		if ((MouseX >= C.PrivateBedLeft + 50) && (MouseX <= C.PrivateBedLeft + 150) && (MouseY >= C.PrivateBedTop + 615) && (MouseY <= C.PrivateBedTop + 715) && C.ArousalZoom) { C.ArousalZoom = false; return; }

		// If we click in an arousal zone, we can trigger that activity
		if (MouseIn(C.PrivateBedLeft, C.PrivateBedTop, 500, C.HeightRatio * 1000))
			for (let A = 0; A < AssetGroup.length; A++)
				if ((AssetGroup[A].Zone != null) && AssetActivitiesForGroup("Female3DCG", AssetGroup[A].Name).length)
					if (ActivityCanBeDone(C, PrivateBedActivity, AssetGroup[A].Name) && !InventoryGroupIsBlocked(C, AssetGroup[A].Name, true))
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if ((AssetGroup[A].Zone[Z][0] >= 100) && (AssetGroup[A].Zone[Z][0] < 400))
								if (MouseIn(AssetGroup[A].Zone[Z][0] + C.PrivateBedLeft, AssetGroup[A].Zone[Z][1] + C.PrivateBedTop, AssetGroup[A].Zone[Z][2], AssetGroup[A].Zone[Z][3]))
									return PrivateBedActivityStart(Player, C, AssetGroup[A], PrivateBedActivity);

	}

}

/**
 * When the player exits the private bedroom.  The next sex scene will wait from 5 to 20 depending on luck and the frigid/honry trait.
 * @returns {void} - Nothing.
 */
function PrivateBedExit(Type) {

	// Cannot leave if the owner doesn't permit it
	if (PrivateBedLeaveTime > CommonTime()) {
		if (PrivateBedLog.length >= 10) PrivateBedLog.splice(0, 1);
		PrivateBedLog.push(TextGet("CannotLeave"));
		return;
	}

	// Refreshes the characters in the private room
	for (let C of PrivateBedCharacter) {
		CharacterSetActivePose(C, null);
		if (C.IsNpc()) {
			NPCEventAdd(C, "NextBed", CurrentTime + 300000 + Math.round(Math.random() * 300000) + NPCTraitGet(C, "Frigid") * 3000);
			CharacterAppearanceRestore(C, C.PrivateBedAppearance);
			CharacterRefresh(C);
		}
	}
	CommonSetScreen("Room", "Private");

}

/**
 * When a character gets an orgasm
 * @param {Character} C - The character getting the orgasm.
 * @returns {void} - Nothing.
 */
function PrivateBedOrgasm(C) {
	if (CurrentScreen != "PrivateBed") return;
	if (PrivateBedLog.length >= 10) PrivateBedLog.splice(0, 1);
	let Text = ActivityDictionaryText("Orgasm" + Math.floor(Math.random() * 10));
	Text = Text.replace("SourceCharacter", CharacterNickname(C));
	const subs = ChatRoomPronounSubstitutions(C, "Pronoun", false);
	Text = CommonStringSubstitute(Text, subs);
	PrivateBedLog.push(Text);
	if (C.IsNpc()) C.PrivateBedActivityTimer = CommonTime() + 15000 + Math.round(Math.random() * 15000);
}
