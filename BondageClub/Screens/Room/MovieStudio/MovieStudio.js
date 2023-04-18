"use strict";
var MovieStudioBackground = "MovieStudio";
/** @type {null | NPCCharacter} */
var MovieStudioDirector = null;
var MovieStudioCurrentMovie = "";
var MovieStudioCurrentScene = "";
var MovieStudioCurrentRole = "";
/** @type {null | NPCCharacter} */
var MovieStudioActor1 = null;
/** @type {null | NPCCharacter} */
var MovieStudioActor2 = null;
/** @type {null | number} */
var MovieStudioTimer = null;
var MovieStudioMeter = 0;
var MovieStudioDecay = 0;
/** @type {string[]} */
var MovieStudioActivity = [];
var MovieStudioMoney = 0;
/** @type {null | Item[]} */
var MovieStudioOriginalClothes = null;
var MovieStudioDailyMovie = "";

/**
 * The player can play in a movie if she doesn't have any locked restraints
 * @returns {boolean} - TRUE if the player can play in a movie
 */
function MovieStudioCanPlayInMovie() { return !InventoryCharacterHasLockedRestraint(Player); }

/**
 * Returns TRUE if the player can receive the camera as payment
 * @returns {boolean} - TRUE if the player can get the item
 */
function MovieStudioCanGetCamera() { return (!InventoryAvailable(Player, "Camera1", "ClothAccessory") && (MovieStudioCurrentRole == "Journalist")); }

/**
 * Returns TRUE if the player can receive the gavel as payment
 * @returns {boolean} - TRUE if the player can get the item
 */
function MovieStudioCanGetGavel() { return (!InventoryAvailable(Player, "Gavel", "ItemHandheld") && (MovieStudioCurrentRole == "Mistress") && (MovieStudioActor1.TrialDone)); }

/**
 * Returns TRUE if the player can receive the long duster as payment
 * @returns {boolean} - TRUE if the player can get the item
 */
function MovieStudioCanGetLongDuster() { return (!InventoryAvailable(Player, "LongDuster", "ItemHandheld") && (MovieStudioCurrentRole == "Maid") && (MovieStudioActor1.CanGetLongDuster)); }

/**
 * Returns TRUE if the player can receive the for sale sign as payment
 * @returns {boolean} - TRUE if the player can get the item
 */
function MovieStudioCanGetForSaleSign() { return (!InventoryAvailable(Player, "ForSaleSign", "ItemHandheld") && MovieStudioActor1.CanGetForSaleSign); }

/**
 * Returns TRUE if the daily movie is of the current type
 * @param {string} Type - The daily movie type
 * @returns {boolean} - TRUE if the daily movie matches
 */
function MovieStudioDailyMovieIs(Type) { return MovieStudioDailyMovie == Type; }

/**
 * When the player fails the movie, we jump back to the director
 * @returns {void} - Nothing
 */
function MovieStudioFail() {
	MovieStudioMeter = -100;
	MovieStudioCurrentMovie = "";
	MovieStudioBackground = "MovieStudio";
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null, true);
	MovieStudioDirector.CurrentDialog = DialogFind(MovieStudioDirector, "FailIntro" + Math.floor(Math.random() * 4).toString());
	MovieStudioDirector.Stage = "Fail";
	CharacterSetCurrent(MovieStudioDirector);
}

/**
 * Change the movie quality meter value, the director stops everything if the meter drops to -100
 * @param {number} Factor - The number to add or substract from the meter
 * @returns {void} - Nothing
 */
function MovieStudioChangeMeter(Factor) {
	MovieStudioMeter = MovieStudioMeter + Factor;
	if (MovieStudioMeter > 100) MovieStudioMeter = 100;
	if (MovieStudioMeter <= -100) MovieStudioFail();
}

/**
 * Process the movie meter decay over time,
 * @returns {void} - Nothing
 */
function MovieStudioProcessDecay() {
	if (MovieStudioDecay < CurrentTime) {
		let Decay = Math.ceil((CurrentTime - MovieStudioDecay) / 3000);
		MovieStudioDecay = CurrentTime + 3000;
		MovieStudioChangeMeter(Decay * -1);
	}
	if (CurrentTime >= MovieStudioTimer) {
		if (MovieStudioMeter < 0) return MovieStudioFail();
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "1")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioProgress(MovieStudioCurrentMovie, "2", "");
			MovieStudioActor1 = null;
			MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Maid");
			MovieStudioActor1.CurrentDialog = TextGet("InterviewMaidIntro" + (InventoryIsWorn(Player, "X-Cross", "ItemDevices") ? "Cross" : "NoCross") + Math.floor(Math.random() * 2).toString());
			MovieStudioActor1.Stage = "0";
			MovieStudioActor1.Friendship = "0";
			CharacterSetCurrent(MovieStudioActor1);
			return;
		}
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && (MovieStudioCurrentRole == "Journalist")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioProgress(MovieStudioCurrentMovie, "3", "");
			MovieStudioActor2 = null;
			MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_Interview_Mistress");
			MovieStudioActor2.CurrentDialog = TextGet("InterviewMistressIntro" + Math.floor(Math.random() * 4).toString());
			MovieStudioActor2.Stage = "0";
			MovieStudioActor1.Stage = "300";
			CharacterSetCurrent(MovieStudioActor2);
			return;
		}
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && (MovieStudioCurrentRole == "Maid")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioProgress(MovieStudioCurrentMovie, "3", "");
			MovieStudioActor1 = null;
			MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Mistress");
			MovieStudioActor1.CurrentDialog = TextGet("InterviewMistressIntro" + Math.floor(Math.random() * 4).toString());
			MovieStudioActor1.Stage = "2000";
			MovieStudioActor2.Stage = (MovieStudioActor2.CanInteract()) ? "1100" : "1000";
			CharacterSetCurrent(MovieStudioActor1);
			return;
		}
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioDirector.Stage = "1030";
			CharacterSetCurrent(MovieStudioDirector);
			MovieStudioDirector.CurrentDialog = TextGet("InterviewDirectorSuccess" + Math.floor(Math.random() * 4).toString());
			MovieStudioCurrentMovie = "";
			MovieStudioCurrentScene = "";
			MovieStudioBackground = "MovieStudio";
			return;
		}
		if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "1")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioProgress(MovieStudioCurrentMovie, "2", "");
			MovieStudioActor2 = null;
			MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_OpenHouse_Client");
			CharacterSetCurrent(MovieStudioActor2);
			if (!Player.IsNaked()) { MovieStudioActor2.CurrentDialog = TextGet("OpenHouseActTwoIntroActor1Naked"); MovieStudioActor2.Stage = "1600"; }
			else if (!MovieStudioActor1.IsNaked()) { MovieStudioActor2.CurrentDialog = TextGet("OpenHouseActTwoIntroPlayerNaked"); MovieStudioActor2.Stage = "1300"; }
			else { MovieStudioActor2.CurrentDialog = TextGet("OpenHouseActTwoIntroBothNaked"); MovieStudioActor2.Stage = "1000"; }
			MovieStudioActor1.Stage = MovieStudioActor2.Stage;
			MovieStudioActor1.MasturbateCount = 0;
			MovieStudioActor2.MasturbateCount = 0;
			return;
		}
		if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "2")) {
			MovieStudioActor1.CanGetForSaleSign = (InventoryIsWorn(Player, "ForSaleSign", "ItemHandheld"));
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioDirector.Stage = "1030";
			CharacterSetCurrent(MovieStudioDirector);
			MovieStudioDirector.CurrentDialog = TextGet("InterviewDirectorSuccess" + Math.floor(Math.random() * 4).toString());
			MovieStudioCurrentMovie = "";
			MovieStudioCurrentScene = "";
			MovieStudioBackground = "MovieStudio";
			return;
		}
	}
}

/**
 * Loads the Movie Studio introduction room screen and saves the player clothes
 * @returns {void} - Nothing
 */
function MovieStudioLoad() {
	let Day = Math.floor(CurrentTime / (24 * 60 * 60 * 1000));
	MovieStudioDailyMovie = (Day % 2 == 0) ? "Interview" : "OpenHouse";
	if (MovieStudioOriginalClothes == null) MovieStudioOriginalClothes = Player.Appearance.slice(0);
	if (MovieStudioDirector == null) {
		MovieStudioDirector = CharacterLoadNPC("NPC_MovieStudio_Director");
		InventoryWear(MovieStudioDirector, "Beret1", "Hat");
		InventoryWear(MovieStudioDirector, "SunGlasses1", "Glasses");
		InventoryWear(MovieStudioDirector, "AdmiralTop", "Cloth");
		InventoryWear(MovieStudioDirector, "AdmiralSkirt", "ClothLower");
		MovieStudioDirector.AllowItem = false;
	}
}

/**
 * Runs and draws the Movie Studio screen
 * @returns {void} - Nothing
 */
function MovieStudioRun() {

	// If there's no movie going on, the player can chat with the director.
	if (MovieStudioCurrentMovie == "") {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(MovieStudioDirector, 1000, 0, 1);
		if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
		DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
		return;
	}

	// In the interview first & second scene, the player can check a drawer and a X Cross
	if ((MovieStudioCurrentMovie == "Interview") && ((MovieStudioCurrentScene == "1") || (MovieStudioCurrentScene == "2"))) {
		DrawCharacter(MovieStudioActor1, 250, 0, 1);
		if (InventoryIsWorn(Player, "X-Cross", "ItemDevices")) {
			DrawCharacter(Player, 1250, 0, 1);
		} else {
			DrawCharacter(Player, 750, 0, 1);
			DrawCharacter(MovieStudioActor2, 1250, 0, 1);
		}
	}

	// In the interview third scene, all three characters are available
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3")) {
		DrawCharacter(MovieStudioActor1, 250, 0, 1);
		DrawCharacter(Player, 750, 0, 1);
		DrawCharacter(MovieStudioActor2, 1250, 0, 1);
	}

	// In the open house first scene, we draw both the wife and new girlfriend
	if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "1")) {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(MovieStudioActor1, 1000, 0, 1);
	}

	// In the open house second scene, we draw both the wife and new girlfriend
	if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "2")) {
		DrawCharacter(Player, 250, 0, 1);
		DrawCharacter(MovieStudioActor1, 750, 0, 1);
		DrawCharacter(MovieStudioActor2, 1250, 0, 1);
	}

	// If there's a movie, we draw the progress meter on the right and the wait button
	if (MovieStudioCurrentMovie != "") {
		MovieStudioProcessDecay();
		DrawRect(1873, 198, 54, 604, "White");
		DrawRect(1875, 200, 50, 300, "Green");
		DrawRect(1875, 500, 50, 300, "Red");
		DrawRect(1875, 499 + MovieStudioMeter * -3, 50, 3, "White");
		DrawButton(1855, 25, 90, 90, "", "White", "Icons/Wait.png", TextGet("Wait"));
		DrawText(TextGet("Scene" + MovieStudioCurrentScene.toString()), 1900, 900, "White", "Black");
		DrawText(TimermsToTime(MovieStudioTimer - CurrentTime), 1900, 960, "White", "Black");
	}

}

/**
 * Handles clicks in the Movie Studio screen
 * @returns {void} - Nothing
 */
function MovieStudioClick() {
	if ((MovieStudioCurrentMovie == "") && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((MovieStudioCurrentMovie == "") && MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MovieStudioDirector);
	if ((MovieStudioCurrentMovie == "") && MouseIn(1885, 25, 90, 90) && Player.CanWalk()) { MovieStudioOriginalClothes = null; CommonSetScreen("Room", "MainHall"); }
	if ((MovieStudioCurrentMovie == "") && MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "1") && MouseIn(250, 0, 500, 1000) && !InventoryIsWorn(Player, "X-Cross", "ItemDevices")) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "1") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && (MovieStudioCurrentRole == "Journalist") && InventoryIsWorn(Player, "DusterGag", "ItemMouth") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && (MovieStudioCurrentRole == "Maid") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3") && MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "1") && MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "2") && MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "OpenHouse") && (MovieStudioCurrentScene == "2") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie != "") && MouseIn(1855, 25, 90, 90)) { MovieStudioChangeMeter(-20); MovieStudioTimer = MovieStudioTimer - 60000; }
}

/**
 * When the player needs to dress back in her original clothes after the play
 * @returns {void} - Nothing
 */
function MovieStudioPlayerDressBack() {
	Player.Appearance = MovieStudioOriginalClothes.slice(0);
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null, true);
}

/**
 * When the player needs to change clothes for a role in the movie
 * @param {string} Cloth - The clothes to wear
 * @returns {void} - Nothing
 */
function MovieStudioChange(Cloth, C) {
	if (C == null) C = Player;
	if (Cloth == "Journalist") {
		CharacterNaked(C);
		InventoryWear(C, "Camera1", "ClothAccessory", "Default");
		InventoryWear(C, "TeacherOutfit1", "Cloth", "Default");
		InventoryWear(C, "Glasses1", "Glasses", "#333333");
		InventoryWear(C, "Socks5", "Socks", "#444458");
		InventoryWear(C, "Shoes2", "Shoes", "#111111");
	}
	if (Cloth == "Mistress") CharacterArchetypeClothes(C, "Mistress");
	if ((Cloth == "Maid") || (Cloth == "MaidSkimpy")) {
		CharacterNaked(C);
		if (Cloth == "MaidSkimpy") InventoryWear(C, "MaidOutfit2", "Cloth", "Default");
		else InventoryWear(C, "MaidOutfit1", "Cloth", "Default");
		InventoryWear(C, "MaidHairband1", "Hat", "Default");
		InventoryWear(C, "Socks3", "Socks", "#DDDDDD");
		InventoryWear(C, "Shoes2", "Shoes", "Default");
	}
	if (Cloth == "Random") {
		CharacterNaked(C);
		CharacterAppearanceFullRandom(C, true);
	}
	InventoryRemove(C, "ItemMouth");
	InventoryRemove(C, "ItemHead");
	InventoryRemove(C, "ItemArms");
	InventoryRemove(C, "ItemHands");
	InventoryRemove(C, "ItemHandheld");
	InventoryRemove(C, "ItemLegs");
	InventoryRemove(C, "ItemFeet");
	InventoryRemove(C, "ItemBoots");
	InventoryRemove(C, "ItemBoots");
	InventoryRemove(C, "ItemDevices");
	InventoryRemove(C, "Emoticon");
	if (Cloth == "HouseVendor") {
		CharacterNaked(C);
		InventoryWear(C, "TeacherOutfit1", "Cloth", "#B36868");
		InventoryWear(C, "Socks5", "Socks", "#C07070");
		InventoryWear(C, "Shoes2", "Shoes", "#C07070");
		InventoryWear(C, "ForSaleSign", "ItemHandheld");
	}
}

/**
 * When the movie scene progresses, we assign the new values
 * @param {string} Movie - The movie type
 * @param {string} Scene - The scene in the movie
 * @param {string} Role - Optional - The role the player is taking
 * @returns {void} - Nothing
 */
function MovieStudioProgress(Movie, Scene, Role) {
	if (Role == "Maid") MovieStudioMoney = 10;
	MovieStudioTimer = CurrentTime + 600000;
	MovieStudioMeter = 0;
	MovieStudioDecay = CurrentTime + 5000;
	MovieStudioActivity = [];
	MovieStudioCurrentMovie = Movie;
	MovieStudioCurrentScene = Scene;
	if (Role != "") MovieStudioCurrentRole = Role;
	if ((Movie == "Interview") && (Scene == "1")) {
		MovieStudioMoney = 15;
		MovieStudioBackground = CommonRandomItemFromList("", ["BDSMRoomRed", "BDSMRoomBlue", "BDSMRoomPurple"]);
		MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Drawer");
		MovieStudioActor1.FixedImage = "Screens/Room/MovieStudio/Drawer.png";
		MovieStudioActor1.Stage = "0";
		MovieStudioActor1.AllowItem = false;
		CharacterRelease(MovieStudioActor1);
		CharacterSetActivePose(MovieStudioActor1, null, true);
		MovieStudioActor2 = null;
		MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_Interview_XCross");
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/XCross.png";
		MovieStudioActor2.Stage = "0";
		MovieStudioActor2.AllowItem = false;
		CharacterRelease(MovieStudioActor2);
		CharacterSetActivePose(MovieStudioActor2, null, true);
	}
	if ((Movie == "Interview") && (Scene == "2") && (Role == "Maid")) {
		MovieStudioMoney = 10;
		MovieStudioBackground = CommonRandomItemFromList("", ["BDSMRoomRed", "BDSMRoomBlue", "BDSMRoomPurple"]);
		MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Drawer");
		MovieStudioActor1.FixedImage = "Screens/Room/MovieStudio/Drawer.png";
		MovieStudioActor1.Stage = "1000";
		MovieStudioActor1.AllowItem = false;
		CharacterRelease(MovieStudioActor1);
		CharacterSetActivePose(MovieStudioActor1, null, true);
		MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_Interview_Journalist");
		MovieStudioActor2.Stage = "0";
		MovieStudioActor2.AllowItem = false;
		CharacterRelease(MovieStudioActor2);
		CharacterSetActivePose(MovieStudioActor2, null, true);
		CharacterNaked(MovieStudioActor2);
		if (Math.random() >= 0.5) { InventoryWear(MovieStudioActor2, "OuvertPerl1", "Bra", "#DD7777"); InventoryWear(MovieStudioActor2, "LatexSocks1", "Socks", "#FF8888"); }
		else { InventoryWear(MovieStudioActor2, "CorsetBikini1", "Bra", "#202020"); InventoryWear(MovieStudioActor2, "Stockings1", "Socks"); }
		InventoryWear(MovieStudioActor2, "Glasses1", "Glasses", "#333333");
		InventoryWear(MovieStudioActor2, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor2, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(MovieStudioActor2, "LeatherAnkleCuffs", "ItemFeet");
		InventoryWear(MovieStudioActor2, "X-Cross", "ItemDevices");
	}
	if ((Movie == "Interview") && (Scene == "3") && (Role == "Mistress")) {
		let Maid = (Math.random() >= 0.5);
		MovieStudioMoney = 5;
		MovieStudioBackground = CommonRandomItemFromList("", ["BDSMRoomRed", "BDSMRoomBlue", "BDSMRoomPurple"]);
		MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Maid");
		MovieStudioActor1.Stage = "2000";
		MovieStudioActor1.AllowItem = false;
		CharacterRelease(MovieStudioActor1);
		CharacterSetActivePose(MovieStudioActor1, null, true);
		MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_Interview_Journalist");
		MovieStudioActor2.Stage = "2000";
		MovieStudioActor2.AllowItem = false;
		CharacterRelease(MovieStudioActor2);
		CharacterSetActivePose(MovieStudioActor2, null, true);
		CharacterNaked(MovieStudioActor2);
		if (Math.random() >= 0.5) { InventoryWear(MovieStudioActor2, "Catsuit", "Suit", "#202020"); InventoryWear(MovieStudioActor2, "Catsuit", "SuitLower", "#202020"); }
		else { InventoryWear(MovieStudioActor2, "CorsetBikini1", "Bra", "#202020"); InventoryWear(MovieStudioActor2, "Stockings1", "Socks"); }
		InventoryWear(MovieStudioActor2, "Glasses1", "Glasses", "#333333");
		InventoryWear((Maid ? MovieStudioActor1 : MovieStudioActor2), "LeatherCuffs", "ItemArms");
		InventoryWear((Maid ? MovieStudioActor1 : MovieStudioActor2), "LeatherLegCuffs", "ItemLegs");
		InventoryWear((Maid ? MovieStudioActor1 : MovieStudioActor2), "LeatherAnkleCuffs", "ItemFeet");
		if (Math.random() >= 0.5) InventoryWear((Maid ? MovieStudioActor1 : MovieStudioActor2), "X-Cross", "ItemDevices");
		else {
			var Cuffs = InventoryGet((Maid ? MovieStudioActor1 : MovieStudioActor2), "ItemArms");
			Cuffs.Property = {};
			Cuffs.Property.Type = "Wrist";
			Cuffs.Property.SetPose = ["BackBoxTie"];
			Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
			CharacterSetActivePose((Maid ? MovieStudioActor1 : MovieStudioActor2), "Kneel", true);
		}
	}
	if ((Movie == "OpenHouse") && (Scene == "1")) {
		MovieStudioMoney = 15;
		MovieStudioBackground = CommonRandomItemFromList("", ["HouseInterior1", "HouseInterior2", "HouseInterior3"]);
		MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_OpenHouse_" + ((Role == "Wife") ? "Girlfriend" : "Wife"));
		MovieStudioActor1.Stage = "0";
		MovieStudioActor1.AllowItem = false;
		MovieStudioActor1.Affection = 0;
		MovieStudioActor1.Domination = 0;
		MovieStudioActor1.ClothesTaken = false;
		CharacterRelease(MovieStudioActor1);
		CharacterSetActivePose(MovieStudioActor1, null, true);
		MovieStudioChange("HouseVendor", MovieStudioActor1);
	}
	if (CurrentCharacter != null) DialogLeave();
}

/**
 * When an activity is done
 * @param {string} Activity - The activity name
 * @returns {void} - Nothing
 */
function MovieStudioDoActivity(Activity) {

	// Each activity takes 30 seconds, we check the number of times it was done and if it was done on the last time
	MovieStudioTimer = MovieStudioTimer - 30000;
	let Count = 0;
	let LastCount = false;
	for (let A = 0; A < MovieStudioActivity.length; A++) {
		if (MovieStudioActivity[A] == Activity) Count++;
		LastCount = (MovieStudioActivity[A] == Activity);
	}

	// It raises the meter the first time and second time as long as it's not a direct repeat.  Over 3 times it decreases the meter.
	if (Count == 0) MovieStudioChangeMeter(20);
	if ((Count == 1) && !LastCount) MovieStudioChangeMeter(10);
	if (Count <= 1) CharacterSetFacialExpression(Player, "Blush", "Low", 5);
	if (Count >= 3) MovieStudioChangeMeter(-10);
	if (Count >= 4) CurrentCharacter.CurrentDialog = TextGet("OtherActivity" + Math.floor(Math.random() * 4).toString());
	MovieStudioActivity.push(Activity);

	// Some activities will dress/restrain the player or another actor
	if (Activity == "DressCatsuit") { CharacterNaked(Player); InventoryWear(Player, "Catsuit", "Suit", "#202020"); InventoryWear(Player, "Catsuit", "SuitLower", "#202020"); InventoryWear(Player, "Glasses1", "Glasses", "#333333"); }
	if (Activity == "DressLingerie") { CharacterNaked(Player); InventoryWear(Player, "CorsetBikini1", "Bra", "#202020"); InventoryWear(Player, "Stockings1", "Socks"); InventoryWear(Player, "Glasses1", "Glasses", "#333333"); }
	if (Activity == "DressNaked") { CharacterNaked(Player); InventoryWear(Player, "Glasses1", "Glasses", "#333333"); }
	if (Activity == "InterviewWearCorset") InventoryWear(Player, "LatexCorset1", "Corset");
	if (Activity == "InterviewWearBoots") InventoryWear(Player, "BalletHeels", "ItemBoots");
	if (Activity == "InterviewWearCuffs") { InventoryWear(Player, "LeatherCuffs", "ItemArms"); InventoryWear(Player, "LeatherLegCuffs", "ItemLegs"); InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet"); }
	if (Activity == "InterviewWearCollar") InventoryWear(Player, "BordelleCollar", "ItemNeck");
	if (Activity == "InterviewCrossRestrain") { InventoryWear(Player, "X-Cross", "ItemDevices"); MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/Empty.png"; }
	if (Activity == "InterviewRestrainMaid") {
		InventoryWear(Player, "LeatherCuffs", "ItemArms");
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "DusterGag", "ItemMouth");
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "ItemDevices");
		let Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterRefresh(Player);
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/XCross.png";
		MovieStudioActor2.Stage = "20";
	}
	if (Activity == "InterviewDustOutfit") { InventoryWear(MovieStudioActor1, "MaidOutfit2", "Cloth"); InventoryRemove(MovieStudioActor1, "Bra"); }
	if (Activity == "InterviewMaidStrip") { CharacterNaked(MovieStudioActor1); InventoryWear(MovieStudioActor1, "MaidHairband1", "Hat"); }
	if (Activity == "InterviewRestrainForOral") {
		InventoryWear(Player, "LeatherCuffs", "ItemArms");
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet");
		InventoryRemove(Player, "ItemDevices");
		let Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterSetActivePose(Player, "Kneel", true);
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/XCross.png";
	}
	if (Activity == "InterviewMaidCuffPlayer") {
		InventoryWear(Player, "LeatherCuffs", "ItemArms");
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet");
		InventoryRemove(Player, "ItemDevices");
		let Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterRefresh(Player);
	}
	if (Activity == "InterviewMaidTighten") {
		let Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property.Type = "Elbow";
		Cuffs.Property.SetPose = ["BackElbowTouch"];
		CharacterRefresh(Player);
	}
	if ((Activity == "InterviewMaidOral1") || (Activity == "InterviewMaidOral2") || (Activity == "InterviewMaidOral3") || (Activity == "InterviewMaidOral4") || (Activity == "InterviewMaidOral5")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Horny", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Horny", 10);
	}
	if (Activity == "InterviewMaidKneel") {
		CharacterSetActivePose(MovieStudioActor1, "Kneel", true);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Low", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if (Activity == "InterviewMaidDusterGag") InventoryWear(MovieStudioActor1, "DusterGag", "ItemMouth");
	if (Activity == "InterviewMaidCuffs") {
		InventoryWear(MovieStudioActor1, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor1, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(MovieStudioActor1, "LeatherAnkleCuffs", "ItemFeet");
		let Cuffs = InventoryGet(MovieStudioActor1, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterRefresh(MovieStudioActor1);
	}
	if (Activity == "InterviewMaidBreast") { InventoryWear(MovieStudioActor1, "MaidOutfit2", "Cloth"); InventoryRemove(MovieStudioActor1, "Bra"); }
	if (Activity == "InterviewMaidCross") {
		CharacterSetActivePose(MovieStudioActor1, null, true);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Low", 10);
		InventoryRemove(MovieStudioActor1, "ItemArms");
		InventoryWear(MovieStudioActor1, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor1, "X-Cross", "ItemDevices");
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/Empty.png";
	}
	if (Activity == "InterviewMistressUngagPlayer") InventoryRemove(Player, "ItemMouth");
	if (Activity == "InterviewMistressReleasePlayer") { CharacterRelease(Player); CharacterSetActivePose(Player, null, true); }
	if (Activity == "InterviewMistressChangePlayerBack") MovieStudioChange("Journalist");
	if (Activity == "InterviewMistressTakePicture") {
		InventoryWear(Player, "Camera1", "ClothAccessory", "Default");
		CharacterRelease(MovieStudioActor1);
		CharacterFullRandomRestrain(MovieStudioActor1, "ALL");
		MovieStudioActor1.Stage = "310";
	}
	if (Activity == "InterviewMistressPrepareDungeon") MovieStudioActor1.Stage = "320";
	if (Activity == "InterviewMaidRestainedNew") { CharacterRelease(MovieStudioActor1); CharacterFullRandomRestrain(MovieStudioActor1, "ALL"); }
	if (Activity == "InterviewMistressFinalRestrainPlayer") { CharacterRelease(Player); CharacterFullRandomRestrain(Player, "ALL"); MovieStudioActor1.Stage = "330"; }
	if (Activity == "InterviewMistressFinalPlayerNew") { CharacterRelease(Player); CharacterFullRandomRestrain(Player, "ALL"); }
	if (Activity == "InterviewMistressStripBoth") {
		CharacterSetActivePose(Player, null, true);
		CharacterRelease(Player);
		CharacterNaked(Player);
		InventoryRemove(Player, "ItemBoots");
		CharacterSetActivePose(MovieStudioActor1, null, true);
		CharacterRelease(MovieStudioActor1);
		CharacterNaked(MovieStudioActor1);
		InventoryWear(MovieStudioActor1, "MaidHairband1", "Hat");
		MovieStudioActor1.Stage = "400";
	}
	if (Activity == "InterviewMaidRestainedHug") {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Horny", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Horny", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Horny", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Horny", 5);
	}
	if (Activity == "InterviewMaidRestainedSpank") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 10);
	}
	if (Activity == "InterviewMistressSpankPlayer") { CharacterSetFacialExpression(Player, "Eyes", "Closed", 5); CharacterSetFacialExpression(Player, "Eyes2", "Closed", 5); }
	if (Activity == "InterviewMistressMasturbatePlayer") {
		CharacterSetFacialExpression(Player, "Blush", "High", 10);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 10);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 10);
	}
	if (Activity == "InterviewMistressPunishPlayer") {
		let Punishment = "ClubSlave";
		MovieStudioActor2.Stage = "Punishment" + Punishment;
		MovieStudioActor2.CurrentDialog = DialogFind(MovieStudioActor2, "PunishmentIntro" + Punishment);
	}
	if (Activity == "InterviewMistressGagBoth") { InventoryWearRandom(Player, "ItemMouth"); InventoryWearRandom(MovieStudioActor1, "ItemMouth"); MovieStudioActor1.Stage = "410"; }
	if (Activity == "InterviewMistressGetCamera") InventoryWear(MovieStudioActor2, "Camera1", "ClothAccessory", "Default");
	if (Activity == "InterviewMistressHood") { InventoryWear(Player, "LeatherHood", "ItemHood"); InventoryWear(Player, "Camera1", "ClothAccessory", "Default"); }
	if (Activity == "InterviewMistressOnCross") {
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Angry", 60);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Angry", 60);
		InventoryWear(MovieStudioActor2, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor2, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(MovieStudioActor2, "LeatherAnkleCuffs", "ItemFeet");
		InventoryWear(MovieStudioActor2, "X-Cross", "ItemDevices");
		MovieStudioActor2.Stage = "500";
		DialogLeave();
	}
	if (Activity == "InterviewMaidNoWeapon") { InventoryRemove(Player, "ItemHandheld"); InventoryRemove(MovieStudioActor1, "ItemHandheld"); DialogLeave(); }
	if (Activity == "InterviewMaidGetCrop") {
		InventoryWear(Player, "Crop", "ItemHandheld");
		CharacterRefresh(Player);
		InventoryWear(MovieStudioActor1, "Crop", "ItemHandheld");
		CharacterRefresh(MovieStudioActor1);
		DialogLeave();
	}
	if (Activity == "InterviewMaidGetWhip") {
		InventoryWear(Player, "Whip", "ItemHandheld");
		CharacterRefresh(Player);
		InventoryWear(MovieStudioActor1, "Whip", "ItemHandheld");
		CharacterRefresh(MovieStudioActor1);
		DialogLeave();
	}
	if (Activity == "InterviewMaidGetProd") {
		InventoryWear(Player, "CattleProd", "ItemHandheld");
		CharacterRefresh(Player);
		InventoryWear(MovieStudioActor1, "CattleProd", "ItemHandheld");
		CharacterRefresh(MovieStudioActor1);
		DialogLeave();
	}
	if ((Activity == "InterviewMaidTurnTablesKiss") || (Activity == "InterviewMistressMasturbate") || (Activity == "InterviewMistressMakeOut") || (Activity == "InterviewMistressTease")) {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 5);
	}
	if (Activity == "InterviewMistressGag") InventoryWearRandom(MovieStudioActor2, "ItemMouth");
	if (Activity == "InterviewMistressUngag") InventoryRemove(MovieStudioActor2, "ItemMouth");
	if ((Activity == "InterviewMistressSpank") || (Activity == "InterviewMistressCrop") || (Activity == "InterviewMistressWhip") || (Activity == "InterviewMistressProd")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if (Activity == "InterviewMistressPinchCheek") {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Angry", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Angry", 5);
	}
	if ((Activity == "InterviewMistressSpankLazyMaid") || (Activity == "InterviewMistressCourtSpankMaid") || (Activity == "InterviewMistressMaidCleanSpank")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if (Activity == "InterviewMistressStartTrial") {
		MovieStudioActor1.TrialDone = true;
		MovieStudioActor1.Stage = "2100";
		MovieStudioActor2.Stage = "2100";
		InventoryWear(Player, "Gavel", "ItemHandheld");
		CharacterRefresh(Player);
		DialogLeave();
	}
	if (Activity == "InterviewMistressSkipTrial") {
		MovieStudioActor1.TrialDone = false;
		MovieStudioActor1.Stage = "2200";
		MovieStudioActor2.Stage = "2200";
	}
	if (Activity == "InterviewMistressMaidStrapToClean") {
		CharacterSetActivePose(MovieStudioActor1, null, true);
		CharacterRelease(MovieStudioActor1);
		InventoryWearRandom(MovieStudioActor1, "ItemLegs");
		InventoryWearRandom(MovieStudioActor1, "ItemArms");
		InventoryWear(MovieStudioActor1, "DusterGag", "ItemMouth");
	}
	if (Activity == "InterviewMistressMaidCleanGrope") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Horny", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Horny", 8);
	}
	if (Activity == "InterviewMistressCourtMasturbate") {
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Horny", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Horny", 8);
	}
	if (Activity == "InterviewMistressCourtRestrainMaid") {
		CharacterSetActivePose(MovieStudioActor1, null, true);
		CharacterRelease(MovieStudioActor1);
		InventoryWearRandom(MovieStudioActor1, "ItemFeet");
		InventoryWearRandom(MovieStudioActor1, "ItemLegs");
		InventoryWearRandom(MovieStudioActor1, "ItemArms");
	}
	if ((Activity == "InterviewMistressInterviewRestrainJournalist") || (Activity == "InterviewMistressCourtRestrainJournalist") || (Activity == "InterviewMistressPunishRestrain")) {
		CharacterSetActivePose(CurrentCharacter, null, true);
		CharacterRelease(CurrentCharacter);
		InventoryWearRandom(CurrentCharacter, "ItemFeet");
		InventoryWearRandom(CurrentCharacter, "ItemLegs");
		InventoryWearRandom(CurrentCharacter, "ItemArms");
	}
	if ((Activity == "InterviewMistressInterviewReleaseJournalist") || (Activity == "InterviewMistressPunishRelease")) {
		CharacterSetActivePose(CurrentCharacter, null, true);
		CharacterRelease(CurrentCharacter);
		if (!MovieStudioActor1.IsRestrained() && !MovieStudioActor2.IsRestrained() && !MovieStudioActor1.TrialDone) {
			CharacterRelease(MovieStudioActor1);
			CharacterRelease(MovieStudioActor2);
			MovieStudioActor1.Stage = "2300";
			MovieStudioActor2.Stage = "2250";
			CharacterSetCurrent(MovieStudioActor2);
			CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
			CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Angry", 8);
			CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Angry", 8);
			CharacterSetFacialExpression(Player, "Eyes", "Closed", 8);
			CharacterSetFacialExpression(Player, "Eyes2", "Closed", 8);
			MovieStudioActor2.CurrentDialog = TextGet("InterviewMistressTurnTablesOnPlayer");
		}
	}
	if ((Activity == "InterviewMistressInterviewFlirt") || (Activity == "InterviewMistressPunishSlap")) {
		CharacterSetFacialExpression(CurrentCharacter, "Blush", "Medium", 8);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes2", "Dazed", 8);
	}
	if (Activity == "InterviewMistressPunishGag") InventoryWearRandom(CurrentCharacter, "ItemMouth");
	if (Activity == "InterviewMistressPunishCross") {
		InventoryWear(CurrentCharacter, "LeatherCuffs", "ItemArms");
		InventoryWear(CurrentCharacter, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(CurrentCharacter, "LeatherAnkleCuffs", "ItemFeet");
		InventoryWear(CurrentCharacter, "X-Cross", "ItemDevices");
	}
	if ((Activity == "InterviewMistressPunishSpank") || (Activity == "InterviewMistressPunishGavel")) {
		CharacterSetFacialExpression(CurrentCharacter, "Blush", "Medium", 8);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes2", "Angry", 8);
	}
	if (Activity == "InterviewMistressTurnTablesArms") InventoryWearRandom(Player, "ItemArms");
	if (Activity == "InterviewMistressTurnTablesLegs") { InventoryWearRandom(Player, "ItemFeet"); InventoryWearRandom(Player, "ItemLegs"); }
	if (Activity == "InterviewMistressTurnTablesEndTrial") {
		MovieStudioActor1.Stage = "2350";
		MovieStudioActor2.Stage = "2350";
		CharacterSetFacialExpression(Player, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Angry", 8);
	}
	if (Activity == "InterviewMistressTurnTablesSentenceMaid") {
		InventoryWear(Player, "DusterGag", "ItemMouth");
		InventoryWear(Player, "MaidHairband1", "Hat");
		CharacterSetFacialExpression(Player, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Dazed", 8);
	}
	if (Activity == "InterviewMistressTurnTablesSentenceJournalist") {
		CharacterRelease(Player);
		CharacterNaked(Player);
		InventoryWearRandom(Player, "ItemFeet");
		InventoryWearRandom(Player, "ItemLegs");
		InventoryWearRandom(Player, "ItemArms");
		CharacterNaked(MovieStudioActor2);
		InventoryWear(MovieStudioActor2, "Camera1", "ClothAccessory", "Default");
		InventoryWear(MovieStudioActor2, "TeacherOutfit1", "Cloth", "Default");
		InventoryWear(MovieStudioActor2, "Glasses1", "Glasses", "#333333");
		InventoryWear(MovieStudioActor2, "Socks5", "Socks", "#444458");
		InventoryWear(MovieStudioActor2, "Shoes2", "Shoes", "#111111");
		CharacterSetFacialExpression(Player, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Dazed", 8);
	}
	if (Activity == "InterviewWearDusterGag") { InventoryWear(Player, "DusterGag", "ItemMouth"); MovieStudioChangeMeter(-10); }
	if (Activity == "InterviewRemoveGag") { InventoryRemove(Player, "ItemMouth"); MovieStudioChangeMeter(-10); }
	if (Activity == "InterviewLeaveHandItem") { InventoryRemove(Player, "ItemHandheld"); MovieStudioChangeMeter(-10); }
	if ((Activity == "InterviewTakeFeatherDuster") || (Activity == "InterviewTakeLongDuster") || (Activity == "InterviewTakeElectricToothbrush") || (Activity == "InterviewTakeVibratingWand")) {
		InventoryWear(Player, Activity.replace("InterviewTake", ""), "ItemHandheld");
		CharacterRefresh(Player);
		MovieStudioChangeMeter(-10);
	}
	if ((Activity == "InterviewMaidTickleJournalist") || (Activity == "InterviewMaidCaressJournalist") || (Activity == "InterviewMaidSpankJournalist") || (Activity == "InterviewMaidMasturbateJournalist") || (Activity == "InterviewMaidDusterGagJournalist") || (Activity == "InterviewMaidFeatherDusterJournalist") || (Activity == "InterviewMaidLongDusterJournalist") || (Activity == "InterviewMaidToothbrushJournalist") || (Activity == "InterviewMaidWandOrgasmJournalist")) {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 10);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 5);
	}
	if ((Activity == "InterviewMaidAllowOrgasmJournalist") || (Activity == "InterviewMaidWandRepeatOrgasmJournalist")) {
		MovieStudioActor2.OweFavor = true;
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "High", 10);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Dazed", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Dazed", 5);
	}
	if (Activity == "InterviewMaidReleaseJournalist") {
		CharacterRelease(MovieStudioActor2);
		CharacterNaked(MovieStudioActor2);
		InventoryWear(MovieStudioActor2, "Camera1", "ClothAccessory", "Default");
		InventoryWear(MovieStudioActor2, "TeacherOutfit1", "Cloth", "Default");
		InventoryWear(MovieStudioActor2, "Glasses1", "Glasses", "#333333");
		InventoryWear(MovieStudioActor2, "Socks5", "Socks", "#444458");
		InventoryWear(MovieStudioActor2, "Shoes2", "Shoes", "#111111");
		DialogLeave();
	}
	if (Activity == "InterviewCuffPlayer") {
		InventoryWear(Player, "LeatherCuffs", "ItemArms");
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet");
	}
	if (Activity == "InterviewCuffElbowPlayer") { InventoryGet(Player, "ItemArms").Property = { Type: "Elbow", Effect: ["Block"], SetPose: ["BackElbowTouch"] }; CharacterRefresh(Player); }
	if (Activity == "InterviewCuffBoxTiePlayer") { InventoryGet(Player, "ItemArms").Property = { Type: "Wrist", Effect: ["Block"], SetPose: ["BackBoxTie"] }; CharacterRefresh(Player); }
	if (Activity == "InterviewCuffLegsPlayer") { InventoryGet(Player, "ItemLegs").Property = { SetPose: ["LegsClosed"] }; CharacterRefresh(Player); }
	if (Activity == "InterviewMaidGagFromMistress") { InventoryWear(Player, "DusterGag", "ItemMouth"); CharacterSetFacialExpression(Player, "Eyes", "Closed", 8); CharacterSetFacialExpression(Player, "Eyes2", "Closed", 8); }
	if (Activity == "InterviewMaidCleanForMistress") { Player.InterviewCleanCount = (Player.InterviewCleanCount == null) ? 1 : Player.InterviewCleanCount + 1; CharacterSetFacialExpression(Player, "Eyes", "Angry", 8); CharacterSetFacialExpression(Player, "Eyes", "Angry", 8); }
	if (Activity == "InterviewMaidStripByMistress") {
		InventoryRemove(Player, "ItemHandheld");
		CharacterRelease(Player);
		CharacterNaked(Player);
		InventoryWear(Player, "MaidHairband1", "Hat", "Default");
	}
	if (Activity == "InterviewMaidChainByMistress1") InventoryWear(Player, "Chains", "ItemFeet");
	if (Activity == "InterviewMaidChainByMistress2") InventoryWear(Player, "Chains", "ItemLegs");
	if (Activity == "InterviewMaidChainByMistress3") InventoryWear(Player, "Chains", "ItemArms");
	if (Activity == "InterviewMaidChainByMistress4") { InventoryGet(Player, "ItemArms").Property = { Type: "AllFours", Effect: ["Block"], SetPose: ["AllFours"] }; CharacterRefresh(Player); }
	if (Activity == "InterviewMaidMistressPrepareRoom") {
		CharacterRelease(MovieStudioActor2);
		CharacterNaked(MovieStudioActor2);
		InventoryWear(MovieStudioActor2, "Camera1", "ClothAccessory", "Default");
		InventoryWear(MovieStudioActor2, "TeacherOutfit1", "Cloth", "Default");
		InventoryWear(MovieStudioActor2, "Glasses1", "Glasses", "#333333");
		InventoryWear(MovieStudioActor2, "Socks5", "Socks", "#444458");
		InventoryWear(MovieStudioActor2, "Shoes2", "Shoes", "#111111");
		MovieStudioActor2.Stage = "1200";
	}
	if ((Activity == "InterviewMaidTickleByJournalist") || (Activity == "InterviewMaidCaressByJournalist")) { CharacterSetFacialExpression(Player, "Eyes", "Dazed", 8); CharacterSetFacialExpression(Player, "Eyes2", "Dazed", 8); }
	if (Activity == "InterviewMaidReturnFavorByJournalist") { CharacterSetFacialExpression(Player, "Eyes", "Dazed", 8); CharacterSetFacialExpression(Player, "Eyes2", "Dazed", 8); MovieStudioActor2.OweFavor = false; }
	if (Activity == "InterviewMaidReturnFavorOrgasmByJournalist") { CharacterSetFacialExpression(Player, "Eyes", "Horny", 10); CharacterSetFacialExpression(Player, "Eyes2", "Horny", 10); }
	if (Activity == "InterviewMaidGaggedByMistress") InventoryWearRandom(Player, "ItemMouth");
	if (Activity == "InterviewMaidPrepareDrinks") {
		MovieStudioTimer = MovieStudioTimer - 120000;
		CharacterRelease(Player);
		InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");
		CharacterRelease(MovieStudioActor2);
		CharacterNaked(MovieStudioActor2);
		InventoryWearRandom(MovieStudioActor2, "ItemFeet");
		InventoryWearRandom(MovieStudioActor2, "ItemLegs");
		InventoryWearRandom(MovieStudioActor2, "ItemArms");
		MovieStudioActor2.Stage = "1300";
		MovieStudioActor1.CanGetLongDuster = (InventoryIsWorn(Player, "LongDuster", "ItemHandheld"));
	}
	if ((Activity == "InterviewMaidHelpDrink") || (Activity == "InterviewMaidHelpDust") || (Activity == "InterviewMaidHelpTickle") || (Activity == "InterviewMaidHelpSpank") || (Activity == "InterviewMaidHelpCaress")) {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Closed", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 8);
	}
	if ((Activity == "OpenHouseShoveActor1") || (Activity == "OpenHouseShoveTie") || (Activity == "OpenHouseStealKiss") || (Activity == "OpenHouseStripActor1") || (Activity == "OpenHouseStripBoth")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if ((Activity == "OpenHouseShovePlayer") || (Activity == "OpenHouseShoveTie") || (Activity == "OpenHouseStealKiss") || (Activity == "OpenHouseStripPlayer") || (Activity == "OpenHouseStripBoth")) {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Closed", 5);
	}
	if ((Activity == "OpenHouseStripPlayer") || (Activity == "OpenHouseStripBoth")) CharacterNaked(Player);
	if ((Activity == "OpenHouseStripActor1") || (Activity == "OpenHouseStripBoth")) { CharacterNaked(MovieStudioActor1); InventoryRemove(MovieStudioActor1, "ItemHandheld"); }
	if (Activity == "OpenHouseWrestlePlayer") {
		CharacterNaked(Player);
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Closed", 5);
		CharacterSetActivePose(Player, "Kneel", true);
	}
	if (Activity == "OpenHouseWrestleActor1") {
		CharacterNaked(MovieStudioActor1);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
		CharacterSetActivePose(MovieStudioActor1, "Kneel", true);
	}
	if (Activity == "OpenHouseWearVendorClothes") {
		MovieStudioChange("HouseVendor");
		MovieStudioActor1.ClothesTaken = true;
	}
	if (Activity == "OpenHouseRestrainActor1") InventoryWearRandom(MovieStudioActor1, "ItemArms");
	if (Activity == "OpenHouseReleaseActor1") InventoryRemove(MovieStudioActor1, "ItemArms");
	if (Activity == "OpenHouseGagActor1") InventoryWearRandom(MovieStudioActor1, "ItemMouth3");
	if (Activity == "OpenHouseUngagActor1") InventoryRemove(MovieStudioActor1, "ItemMouth3");
	if ((Activity == "OpenHouseRestrainActor1") || (Activity == "OpenHouseReleaseActor1") || (Activity == "OpenHouseGagActor1") || (Activity == "OpenHouseUngagActor1")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Low", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Sad", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Sad", 5);
	}
	if (Activity == "OpenHouseKissActor1") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Dazed", 8);
		if (MovieStudioActor1.KissCount == null) MovieStudioActor1.KissCount = 0;
		MovieStudioActor1.KissCount++;
		if (MovieStudioActor1.KissCount <= 2) MovieStudioAlterParameter("Actor1", "Affection", "1");
	}
	if (Activity == "OpenHouseMasturbateActor1") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 8);
		if (MovieStudioActor1.MasturbateCount == null) MovieStudioActor1.MasturbateCount = 0;
		MovieStudioActor1.MasturbateCount++;
		if (MovieStudioActor1.MasturbateCount <= 2) MovieStudioAlterParameter("Actor1", "Affection", "1");
		if (MovieStudioActor1.MasturbateCount == 3) {
			MovieStudioActor1.Stage = "240";
			MovieStudioActor1.CurrentDialog = DialogFind(MovieStudioActor1, "OrgasmAct1");
			MovieStudioChangeMeter(25);
		}
	}
	if (Activity == "OpenHouseSpankActor1") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Low", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Angry", 8);
		MovieStudioAlterParameter("Actor1", "Affection", "-1");
	}
	if (Activity == "OpenHousePaddleActor1") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Surprised", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Surprised", 8);
		MovieStudioAlterParameter("Actor1", "Affection", "-1");
	}
	if (Activity == "OpenHouseSlapActor1") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
		MovieStudioAlterParameter("Actor1", "Affection", "-1");
	}
	if (Activity == "OpenHouseWearDogCollar") {
		CharacterSetFacialExpression(Player, "Blush", "Low", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Sad", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Sad", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Mouth", "Smirk", 8);
		InventoryWear(Player, "LeatherCollar", "ItemNeck");
	}
	if (Activity == "OpenHouseWearDogLeash") {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Sad", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Sad", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Mouth", "Smirk", 8);
		InventoryWear(Player, "ChainLeash", "ItemNeckRestraints");
	}
	if (Activity == "OpenHouseWearDogCrawler") {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Angry", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Mouth", "Smirk", 8);
		InventoryWear(Player, "PetCrawler", "ItemArms");
	}
	if (Activity == "OpenHouseWearDogMuzzle") {
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Angry", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Mouth", "Smirk", 8);
		InventoryWear(Player, "MuzzleGag", "ItemMouth3");
	}
	if (Activity == "OpenHouseDogMasturbate") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 8);
		if (MovieStudioActor1.MasturbateCount == null) MovieStudioActor1.MasturbateCount = 0;
		MovieStudioActor1.MasturbateCount++;
		if (MovieStudioActor1.MasturbateCount <= 2) MovieStudioAlterParameter("Actor1", "Affection", "1");
		if (MovieStudioActor1.MasturbateCount == 3) {
			MovieStudioActor1.Stage = "410";
			MovieStudioActor1.CurrentDialog = DialogFind(MovieStudioActor1, "OrgasmPuppyAct1");
			MovieStudioChangeMeter(25);
		}
	}
	if ((Activity == "OpenHouseDogGrumble") || (Activity == "OpenHouseDogPresentButt") || (Activity == "OpenHouseDogWalk")) {
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Angry", 8);
	}
	if ((Activity == "OpenHouseDogSniff") || (Activity == "OpenHouseDogRoll") || (Activity == "OpenHouseDogWhimper") || (Activity == "OpenHouseDogStand")) {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Sad", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Sad", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Mouth", "Smirk", 8);
	}
	if (Activity == "OpenHouseReWearVendorClothes") MovieStudioChange("HouseVendor", MovieStudioActor1);
	if (Activity == "OpenHouseUngagPlayer") {
		InventoryRemove(Player, "ItemMouth3");
		CharacterSetFacialExpression(Player, "Blush", "Low", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Sad", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Sad", 5);
	}
	if ((Activity == "OpenHousePrepareActor1Bondage") || (Activity == "OpenHousePreparePlayerBondage")) {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Low", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Dazed", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Dazed", 5);
		MovieStudioActor1.Stage = MovieStudioActor2.Stage;
	}
	if (Activity == "OpenHouseActor1FullBondage") {
		CharacterRelease(MovieStudioActor1);
		InventoryWearRandom(MovieStudioActor1, "ItemArms");
		InventoryWearRandom(MovieStudioActor1, "ItemMouth3");
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 12);
		MovieStudioActor1.Stage = "1070";
	}
	if (Activity == "OpenHousePlayerFullBondage") {
		CharacterRelease(Player);
		InventoryWearRandom(Player, "ItemArms");
		InventoryWearRandom(Player, "ItemMouth3");
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		MovieStudioActor1.Stage = "1100";
	}
	if (Activity == "OpenHouseEnterBasement") {
		MovieStudioBackground = CommonRandomItemFromList("", ["HouseBasement1", "HouseBasement2", "HouseBasement3"]);
		MovieStudioActor1.Stage = MovieStudioActor2.Stage;
	}
	if (Activity == "OpenHouseBondageLaugh") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Angry", 8);
		MovieStudioAlterParameter("Actor1", "Affection", "-2");
	}
	if (Activity == "OpenHouseBondageHug") {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 8);
		MovieStudioAlterParameter("Actor1", "Affection", "2");
	}
	if (Activity == "OpenHouseBasementChains") {
		if (InventoryGet(Player, "ItemNeck") == null) InventoryWear(Player, "LeatherCollar", "ItemNeck");
		InventoryWear(Player, "CeilingChain", "ItemAddon");
		if (InventoryGet(MovieStudioActor1, "ItemNeck") == null) InventoryWear(MovieStudioActor1, "LeatherCollar", "ItemNeck");
		InventoryWear(MovieStudioActor1, "CeilingChain", "ItemAddon");
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Dazed", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 12);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Dazed", 12);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Dazed", 12);
	}
	if (Activity == "OpenHouseActor2Wand") {
		InventoryWear(MovieStudioActor2, "VibratingWand", "ItemHandheld");
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 4);
		MovieStudioActor1.Stage = MovieStudioActor2.Stage;
	}
	if ((Activity == "OpenHouseActor2Moan") || (Activity == "OpenHouseActor2Stare") || (Activity == "OpenHouseActor2Wiggle") || (Activity == "OpenHouseActor2Hips")) {
		MovieStudioActor1.Stage = MovieStudioActor2.Stage;
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 8);
		if (MovieStudioActor2.MasturbateCount == null) MovieStudioActor2.MasturbateCount = 0;
		MovieStudioActor2.MasturbateCount++;
		if ((MovieStudioActor2.MasturbateCount == 4) && !Player.IsChaste()) {
			MovieStudioActor2.Stage = "1210";
			MovieStudioActor2.CurrentDialog = DialogFind(MovieStudioActor2, "OrgasmWandAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if ((Activity == "OpenHouseActor1Look") || (Activity == "OpenHouseActor1Moan") || (Activity == "OpenHouseActor1Whimper") || (Activity == "OpenHouseActor1Closer")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 8);
		if (MovieStudioActor1.MasturbateCount == null) MovieStudioActor1.MasturbateCount = 0;
		MovieStudioActor1.MasturbateCount++;
		if (MovieStudioActor1.MasturbateCount == 4) {
			MovieStudioActor1.Stage = "1210";
			MovieStudioActor1.CurrentDialog = DialogFind(MovieStudioActor1, "OrgasmWandAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if (Activity == "OpenHouseStartGirlfriendNaked") {
		MovieStudioActor1.Stage = "1340";
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 4);
	}
	if (Activity == "OpenHouseConvinceNaked") {
		MovieStudioActor2.Stage = "1350";
		CharacterNaked(MovieStudioActor1);
		InventoryRemove(MovieStudioActor1, "ItemHandheld");
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if (Activity == "OpenHousePlayerNakedForClient") {
		MovieStudioActor2.Stage = "1350";
		CharacterNaked(Player);
		InventoryRemove(Player, "ItemHandheld");
		CharacterSetFacialExpression(Player, "Blush", "Medium", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Closed", 5);
	}
	if (Activity == "OpenHouseClientNaked") {
		MovieStudioActor1.Stage = "1720";
		CharacterNaked(MovieStudioActor2);
		InventoryRemove(MovieStudioActor2, "ItemHandheld");
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 5);
	}
	if (Activity == "OpenHouseDoubleRestrainBeforeBasement") {
		CharacterRelease(MovieStudioActor1);
		InventoryWearRandom(MovieStudioActor1, "ItemArms");
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Dazed", 8);
		CharacterRelease(MovieStudioActor2);
		InventoryWearRandom(MovieStudioActor2, "ItemArms");
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Dazed", 8);
	}
	if (Activity == "OpenHouseBadScene") {
		MovieStudioChangeMeter(-50);
		CharacterSetFacialExpression(Player, "Blush", "ShortBreath", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Dizzy", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Dizzy", 5);
	}
	if (Activity == "OpenHouseSlideEggClient") {
		MovieStudioActor1.Stage = MovieStudioActor2.Stage;
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Lewd", 8);
	}
	if (Activity == "OpenHouseSlideEggGirlfriend") {
		MovieStudioActor2.Stage = MovieStudioActor1.Stage;
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 8);
	}
	if (Activity == "OpenHouseGirlfriendInKennel") {
		InventoryWear(MovieStudioActor1, "Kennel", "ItemDevices");
		InventoryGet(MovieStudioActor1, "ItemDevices").Property.Type = "d1p0";
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "ShortBreath", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Angry", 8);
	}
	if (Activity == "OpenHouseGirlfriendOutKennel") InventoryRemove(MovieStudioActor1, "ItemDevices");
	if (Activity == "OpenHouseClientInKennel") {
		InventoryWear(MovieStudioActor2, "Kennel", "ItemDevices");
		InventoryGet(MovieStudioActor2, "ItemDevices").Property.Type = "d1p0";
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "ShortBreath", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Angry", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Angry", 8);
	}
	if (Activity == "OpenHouseClientOutKennel") InventoryRemove(MovieStudioActor2, "ItemDevices");
	if (Activity == "OpenHouseGirlfriendGag") InventoryWearRandom(MovieStudioActor1, "ItemMouth3");
	if (Activity == "OpenHouseGirlfriendUngag") InventoryRemove(MovieStudioActor1, "ItemMouth3");
	if (Activity == "OpenHouseClientGag") InventoryWearRandom(MovieStudioActor2, "ItemMouth3");
	if (Activity == "OpenHouseClientUngag") InventoryRemove(MovieStudioActor2, "ItemMouth3");
	if ((Activity == "OpenHouseGirlfriendEggSlow") || (Activity == "OpenHouseGirlfriendEggFast") || (Activity == "OpenHouseGirlfriendEggMax")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Horny", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Horny", 8);
		if (Activity == "OpenHouseGirlfriendEggSlow") MovieStudioActor1.MasturbateCount = MovieStudioActor1.MasturbateCount + 1;
		if (Activity == "OpenHouseGirlfriendEggFast") MovieStudioActor1.MasturbateCount = MovieStudioActor1.MasturbateCount + 2;
		if (Activity == "OpenHouseGirlfriendEggMax") MovieStudioActor1.MasturbateCount = MovieStudioActor1.MasturbateCount + 3;
		if (((Activity == "OpenHouseGirlfriendEggFast") || (Activity == "OpenHouseGirlfriendEggMax")) && (MovieStudioActor1.MasturbateCount >= 6) && (MovieStudioActor1.MasturbateCount < 100)) {
			MovieStudioAlterParameter("Actor1", "Affection", "2");
			MovieStudioActor1.MasturbateCount = 100;
			MovieStudioActor1.Stage = "1910";
			MovieStudioActor1.CurrentDialog = DialogFind(MovieStudioActor1, "OrgasmEggAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if ((Activity == "OpenHouseClientEggSlow") || (Activity == "OpenHouseClientEggFast") || (Activity == "OpenHouseClientEggMax")) {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Horny", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Horny", 8);
		if (Activity == "OpenHouseClientEggSlow") MovieStudioActor2.MasturbateCount = MovieStudioActor2.MasturbateCount + 1;
		if (Activity == "OpenHouseClientEggFast") MovieStudioActor2.MasturbateCount = MovieStudioActor2.MasturbateCount + 2;
		if (Activity == "OpenHouseClientEggMax") MovieStudioActor2.MasturbateCount = MovieStudioActor2.MasturbateCount + 3;
		if (((Activity == "OpenHouseClientEggFast") || (Activity == "OpenHouseClientEggMax")) && (MovieStudioActor2.MasturbateCount >= 6) && (MovieStudioActor2.MasturbateCount < 100)) {
			MovieStudioActor2.MasturbateCount = 100;
			MovieStudioActor2.Stage = "1910";
			MovieStudioActor2.CurrentDialog = DialogFind(MovieStudioActor2, "OrgasmEggAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if (Activity == "OpenHouseGirlfriendStartLoveEnding") {
		MovieStudioChangeMeter(50);
		CharacterRelease(Player);
		CharacterRelease(MovieStudioActor1);
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "LewdHeartPink", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "LewdHeartPink", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "LewdHeartPink", 8);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "LewdHeartPink", 8);
	}
	if (Activity == "OpenHouseClientChangeMistress") {
		MovieStudioChangeMeter(50);
		CharacterNaked(Player);
		InventoryRemove(Player, "ItemHandheld");
		MovieStudioChange("Mistress", Player);
	}
	if (Activity == "OpenHouseClientCollar") {
		InventoryWear(MovieStudioActor2, "LeatherCollar", "ItemNeck");
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Closed", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 8);
	}	
	if (Activity == "OpenHouseSpecialEnding") MovieStudioTimer = CurrentTime;
	if (Activity == "OpenHouseClientNakedSub") {
		MovieStudioActor1.Stage = "1430";
		CharacterNaked(MovieStudioActor2);
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Closed", 5);
	}
	if (Activity == "OpenHouseEnterBasementSub") {
		MovieStudioBackground = CommonRandomItemFromList("", ["HouseBasement1", "HouseBasement2", "HouseBasement3"]);
		MovieStudioActor2.Stage = MovieStudioActor1.Stage;
	}
	if (Activity == "OpenHouseGirlfriendUnpack") {
		MovieStudioActor2.Stage = "1470";
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if (Activity == "OpenHouseGirlfriendWearStrapon") {
		MovieStudioActor2.Stage = "1500";
		CharacterNaked(MovieStudioActor1);
		InventoryRemove(MovieStudioActor1, "ItemHandheld");
		InventoryWear(MovieStudioActor1, "LatexCorset1", "Corset");
		InventoryWear(MovieStudioActor1, "StrapOnSmooth", "ItemDevices");
		InventoryWearRandom(Player, "ItemArms");
		InventoryWearRandom(MovieStudioActor2, "ItemArms");
	}
	if (Activity == "OpenHouseGirlfriendStartSubEnding") {
		MovieStudioChangeMeter(50);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Dazed", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Dazed", 8);
	}
	if (Activity == "OpenHousePlayerGag") InventoryWearRandom(Player, "ItemMouth3");
	if (Activity == "OpenHousePlayerUngag") InventoryRemove(Player, "ItemMouth3");
	if (Activity == "OpenHousePlayerStraponSuck") {
		CharacterSetFacialExpression(Player, "Blush", "ShortBreath", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 8);
	}
	if (Activity == "OpenHousePlayerStraponPussy") {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Horny", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Horny", 8);
		MovieStudioActor1.MasturbateCount++;
		if (MovieStudioActor1.MasturbateCount == 3) {
			MovieStudioActor1.Stage = "1510";
			MovieStudioActor1.CurrentDialog = DialogFind(MovieStudioActor1, "OrgasmStraponAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if (Activity == "OpenHousePlayerStraponButt") {
		CharacterSetFacialExpression(Player, "Blush", "High", 8);
		CharacterSetFacialExpression(Player, "Eyes", "Surprised", 8);
		CharacterSetFacialExpression(Player, "Eyes2", "Surprised", 8);
		MovieStudioActor1.MasturbateCount++;
		if (MovieStudioActor1.MasturbateCount == 3) {
			MovieStudioActor1.Stage = "1510";
			MovieStudioActor1.CurrentDialog = DialogFind(MovieStudioActor1, "OrgasmStraponAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if (Activity == "OpenHouseClientStraponKiss") {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "LewdHeartPink", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "LewdHeartPink", 8);
	}
	if (Activity == "OpenHouseClientStraponSuck") {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "ShortBreath", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Lewd", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Lewd", 8);
	}
	if (Activity == "OpenHouseClientStraponPussy") {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "Medium", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Horny", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Horny", 8);
		MovieStudioActor2.MasturbateCount++;
		if (MovieStudioActor2.MasturbateCount == 3) {
			MovieStudioActor2.Stage = "1510";
			MovieStudioActor2.CurrentDialog = DialogFind(MovieStudioActor2, "OrgasmStraponAct2");
			MovieStudioChangeMeter(25);
		}
	}
	if (Activity == "OpenHouseClientStraponButt") {
		CharacterSetFacialExpression(MovieStudioActor2, "Blush", "High", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Surprised", 8);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Surprised", 8);
		MovieStudioActor2.MasturbateCount++;
		if (MovieStudioActor2.MasturbateCount == 3) {
			MovieStudioActor2.Stage = "1510";
			MovieStudioActor2.CurrentDialog = DialogFind(MovieStudioActor2, "OrgasmStraponAct2");
			MovieStudioChangeMeter(25);
		}
	}
	
	// Check for decay
	MovieStudioProcessDecay();

}

/**
 * Changes a parameter for an actor
 * @param {string} Name - The name of the actor
 * @param {string} Param - The parameter to change
 * @param {string} Value - The value to alter
 * @returns {void} - Nothing
 */
function MovieStudioChangeParameter(Name, Param, Value) {
	let Actor = null;
	if (Name == "Actor1") Actor = MovieStudioActor1;
	if (Name == "Actor2") Actor = MovieStudioActor2;
	if (Actor == null) return;
	if (Param == "Friendship") Actor.Friendship = Value;
}

/**
 * Add a parameter for an actor
 * @param {string} Name - The name of the actor
 * @param {string} Param - The parameter to change
 * @param {string} Value - The value to alter
 * @returns {void} - Nothing
 */
function MovieStudioAlterParameter(Name, Param, Value) {
	let Actor = null;
	if (Name == "Actor1") Actor = MovieStudioActor1;
	if (Name == "Actor2") Actor = MovieStudioActor2;
	if (Actor == null) return;
	if ((Param == "Domination") && (Actor.Domination == null)) Actor.Domination = 0;
	if (Param == "Domination") Actor.Domination = Actor.Domination + parseInt(Value);
	if ((Param == "Affection") && (Actor.Affection == null)) Actor.Affection = 0;
	if (Param == "Affection") Actor.Affection = Actor.Affection + parseInt(Value);
}

/**
 * Returns TRUE if a parameter value for an actor is between a from and a to value
 * @param {string} Name - The name of the actor
 * @param {string} Param - The parameter to get
 * @param {string} FromValue - From that value
 * @param {string} ToValue - To that value
 * @returns {Boolean} - TRUE if between
 */
function MovieStudioParameterValueBetween(Name, Param, FromValue, ToValue) {
	let Actor = null;
	if (Name == "Actor1") Actor = MovieStudioActor1;
	if (Name == "Actor2") Actor = MovieStudioActor2;
	let Value = 0;
	if ((Param == "Domination") && (Actor != null) && (Actor.Domination != null)) Value = Actor.Domination;
	if ((Param == "Affection") && (Actor != null) && (Actor.Affection != null)) Value = Actor.Affection;
	return ((parseInt(Value) >= parseInt(FromValue)) && (parseInt(Value) <= parseInt(ToValue)));
}

/**
 * Tests if an activity can be done
 * @param {string} Activity - The activity to test
 * @returns {boolean} - Returns TRUE if the activity can be done
 */
function MovieStudioCanDoActivity(Activity) {
	if (Activity == "InterviewTakePicture") return InventoryIsWorn(Player, "Camera1", "ClothAccessory");
	if (Activity == "InterviewOpenFirstDrawer") return (InventoryGet(Player, "Cloth") != null);
	if (Activity == "InterviewOpenSecondDrawer") return (InventoryGet(Player, "Cloth") == null);
	if (Activity == "InterviewWearCorset") return !InventoryIsWorn(Player, "LatexCorset1", "Corset");
	if (Activity == "InterviewWearBoots") return !InventoryIsWorn(Player, "BalletHeels", "ItemBoots");
	if (Activity == "InterviewWearCuffs") return (InventoryGet(Player, "ItemArms") == null);
	if (Activity == "InterviewWearCollar") return (InventoryGet(Player, "ItemNeck") == null);
	if (Activity == "InterviewCrossRestrain") return InventoryIsWorn(Player, "LeatherCuffs", "ItemArms");
	if (Activity == "InterviewMaidCuffPlayer") return !InventoryIsWorn(Player, "LeatherCuffs", "ItemArms");
	if (Activity == "InterviewMaidDusterGag") return !InventoryIsWorn(MovieStudioActor1, "DusterGag", "ItemMouth");
	if (Activity == "InterviewMaidCuffs") return !InventoryIsWorn(MovieStudioActor1, "LeatherCuffs", "ItemArms");
	if (Activity == "InterviewMaidBreast") return InventoryIsWorn(MovieStudioActor1, "MaidOutfit1", "Cloth");
	if (Activity == "InterviewMaidFriendship0") return (MovieStudioActor1.Friendship == "0");
	if (Activity == "InterviewMaidFriendship1") return (MovieStudioActor1.Friendship == "1");
	if (Activity == "InterviewMaidFriendship2") return (MovieStudioActor1.Friendship == "2");
	if (Activity == "InterviewMaidFriendshipRestrained3") return ((MovieStudioActor1.Friendship == "3") && Player.IsRestrained());
	if (Activity == "InterviewMaidFriendshipUnrestrained3") return ((MovieStudioActor1.Friendship == "3") && !Player.IsRestrained());
	if (Activity == "InterviewMaidFriendship4") return (MovieStudioActor1.Friendship == "4");
	if (Activity == "InterviewMaidNoWeapon") return (InventoryGet(Player, "ItemHandheld") != null);
	if (Activity == "InterviewMaidGetCrop") return (!InventoryIsWorn(Player, "Crop", "ItemHandheld"));
	if (Activity == "InterviewMaidGetWhip") return (!InventoryIsWorn(Player, "Whip", "ItemHandheld"));
	if (Activity == "InterviewMaidGetProd") return (!InventoryIsWorn(Player, "CattleProd", "ItemHandheld"));
	if (Activity == "InterviewMistressGag") return (InventoryGet(MovieStudioActor2, "ItemMouth") == null);
	if (Activity == "InterviewMistressCrop") return (!InventoryIsWorn(Player, "Crop", "ItemHandheld"));
	if (Activity == "InterviewMistressWhip") return (!InventoryIsWorn(Player, "Whip", "ItemHandheld"));
	if (Activity == "InterviewMistressProd") return (!InventoryIsWorn(Player, "CattleProd", "ItemHandheld"));
	if (Activity == "InterviewMistressPunishCross") return !InventoryIsWorn(CurrentCharacter, "X-Cross", "ItemDevices");
	if (Activity == "InterviewMistressPunishGavel") return !InventoryIsWorn(Player, "Gavel", "ItemHandheld");
	if (Activity == "InterviewWearDusterGag") return (InventoryGet(Player, "ItemMouth") == null);
	if (Activity == "InterviewLeaveHandItem") return !(InventoryGet(Player, "ItemHandheld") == null);
	if (Activity == "InterviewMaidFeatherDusterJournalist") return (InventoryIsWorn(Player, "FeatherDuster", "ItemHandheld"));
	if (Activity == "InterviewMaidLongDusterJournalist") return (InventoryIsWorn(Player, "LongDuster", "ItemHandheld"));
	if (Activity == "InterviewMaidToothbrushJournalist") return (InventoryIsWorn(Player, "ElectricToothbrush", "ItemHandheld"));
	if (Activity == "InterviewMaidWandOrgasmJournalist") return (InventoryIsWorn(Player, "VibratingWand", "ItemHandheld") && (MovieStudioActor2.OweFavor == null));
	if (Activity == "InterviewMaidWandRepeatOrgasmJournalist") return (InventoryIsWorn(Player, "VibratingWand", "ItemHandheld") && (MovieStudioActor2.OweFavor != null));
	if (Activity == "InterviewMaidCleanForMistress") return (InventoryIsWorn(Player, "FeatherDuster", "ItemHandheld") || InventoryIsWorn(Player, "LongDuster", "ItemHandheld") || InventoryIsWorn(Player, "DusterGag", "ItemMouth"));
	if (Activity == "InterviewMaidCleanForMistressPerfect") return ((Player.InterviewCleanCount != null) && (Player.InterviewCleanCount >= 3));
	if (Activity == "InterviewMaidReleaseJournalist") return (!MovieStudioActor2.CanInteract());
	if (Activity == "InterviewMaidReturnFavor") return (MovieStudioActor2.OweFavor);
	if (Activity == "OpenHouseWearVendorClothes") return (!MovieStudioActor1.ClothesTaken);
	if (Activity == "OpenHouseWearDogCollar") return (InventoryGet(Player, "ItemNeck") == null);
	if (Activity == "OpenHouseClientRestrainActor1") return ((InventoryGet(MovieStudioActor1, "ItemArms") == null) || (InventoryGet(MovieStudioActor1, "ItemMouth3") == null));
	if (Activity == "OpenHouseGirlfriendInKennel") return (InventoryGet(MovieStudioActor1, "ItemDevices") == null);
	if (Activity == "OpenHouseClientInKennel") return (InventoryGet(MovieStudioActor2, "ItemDevices") == null);
	if (Activity == "OpenHouseGirlfriendStartLove") return (MovieStudioParameterValueBetween("Actor1", "Affection", "10", "100") && MovieStudioActor1.CanTalk());
	if (Activity == "OpenHouseBothStartSlave") return (MovieStudioParameterValueBetween("Actor1", "Domination", "10", "100") && MovieStudioActor2.CanTalk());
	if (Activity == "OpenHouseGirlfriendStartOwner") return (MovieStudioParameterValueBetween("Actor1", "Domination", "-100", "-10") && Player.CanTalk());
	return false;
}

/**
 * Adds the camera to the player inventory
 * @returns {void} - Nothing
 */
function MovieStudioGetCamera() {
	InventoryAdd(Player, "Camera1", "ClothAccessory");
	InventoryWear(Player, "Camera1", "ClothAccessory", "Default");
}

/**
 * Adds the gavel to the player inventory
 * @returns {void} - Nothing
 */
function MovieStudioGetGavel() {
	InventoryAdd(Player, "Gavel", "ItemHandheld");
	InventoryWear(Player, "Gavel", "ItemHandheld");
	CharacterRefresh(Player);
}

/**
 * Adds the long duster to the player inventory
 * @returns {void} - Nothing
 */
function MovieStudioGetLongDuster() {
	InventoryAdd(Player, "LongDuster", "ItemHandheld");
	InventoryWear(Player, "LongDuster", "ItemHandheld");
	CharacterRefresh(Player);
}

/**
 * Adds the for sale sign to the player inventory
 * @returns {void} - Nothing
 */
function MovieStudioGetForSaleSign() {
	InventoryAdd(Player, "ForSaleSign", "ItemHandheld");
	InventoryWear(Player, "ForSaleSign", "ItemHandheld");
	CharacterRefresh(Player);
}

/**
 * Adds the movie salary to the player
 * @returns {void} - Nothing
 */
function MovieStudioGetMoney() {
	CharacterChangeMoney(Player, MovieStudioMoney);
	MovieStudioDirector.CurrentDialog = DialogFind(MovieStudioDirector, "MovieSalary").replace("SALARYAMOUNT", (MovieStudioMoney).toString());
}
