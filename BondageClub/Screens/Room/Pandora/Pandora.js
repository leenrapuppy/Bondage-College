"use strict";
var PandoraBackground = "Pandora/Ground/Entrance";
/** @type {PandoraBaseRoom} */
var PandoraCurrentRoom = null;
/** @type {PandoraBaseRoom} */
var PandoraPreviousRoom = null;
/** @type {PandoraBaseRoom[]} */
var PandoraRoom = [];
/** @type {PandoraFloorDirection[]} */
var PandoraDirectionList = ["South", "North", "East", "West"];
/** @type {PandoraFloorDirection[]} */
var PandoraDirectionListFrom = ["North", "South", "West", "East"];
/** @type {""|"Search"|"Rest"|"Paint"} */
var PandoraMode = "";
var PandoraModeTimer = 0;
var PandoraModeAppearance = null;
var PandoraMessage = null;
/** @type {NPCCharacter[]} */
var PandoraParty = [];
/** @type {null | NPCCharacter} */
var PandoraFightCharacter = null;
var PandoraRandomNPCList = ["MemberNew", "MemberOld", "Cosplay", "Mistress", "Slave", "Maid", "Guard"];
var PandoraMoveDirectionTimer = { Direction: "", Timer: 0 };
/** @type {null | PandoraBaseRoom} */
var PandoraTargetRoom = null;
var PandoraClothes = "Random";
var PandoraWillpower = 20;
var PandoraMaxWillpower = 20;
var PandoraMoney = 0;
var PandoraTimer = 0;
var PandoraChestCount = 0;
var PandoraPaint = false;
var PandoraReverseMaidDone = 0;
var PandoraReverseMaidTotal = 0;

/**
 * NPC Dialog functions
 * @returns {boolean} - TRUE if the dialog option will be available to the player
 */
function PandoraCanStartRecruit() { return (((CurrentCharacter.Recruit == null) || (CurrentCharacter.Recruit == 0)) && !CurrentCharacter.IsNaked()); }
function PandoraCanRecruit() { return (CurrentCharacter.Recruit + (InfiltrationPerksActive("Recruiter") ? 0.25 : 0) >= CurrentCharacter.RecruitOdds); }
function PandoraCharacterCanJoin() { return ((PandoraParty.length == 0) || (PandoraParty[0].Name != CurrentCharacter.Name)); }
function PandoraCharacterCanLeave() { return ((PandoraParty.length == 1) && (PandoraParty[0].Name == CurrentCharacter.Name) && ((PandoraCurrentRoom.Character == null) || (PandoraCurrentRoom.Character.length <= 1))); }
function PandoraOdds75() { return ((CurrentCharacter.RandomOdds == null) || (CurrentCharacter.RandomOdds > 0.25)); }
function PandoraOdds50() { return ((CurrentCharacter.RandomOdds == null) || (CurrentCharacter.RandomOdds > 0.50)); }
function PandoraOdds25() { return ((CurrentCharacter.RandomOdds == null) || (CurrentCharacter.RandomOdds > 0.75)); }
/** @param {string} Costume */
function PandoraCostumeIs(Costume) { return (PandoraClothes == Costume); }
/** @param {number} Number */
function PandoraQuizIs(Number) { return ((CurrentCharacter.QuizLog != null) && (CurrentCharacter.QuizLog[CurrentCharacter.QuizLog.length - 1].toString() == Number.toString())); }
function PandoraCanAskForPaint() { return (!PandoraPaint && (PandoraClothes == "Maid") && (InfiltrationMission == "ReverseMaid")); }

/**
 * Loads the Pandora's Box screen
 * @returns {void} - Nothing
 */
function PandoraLoad() {
}

/**
 * Returns the color of the direction buttons, it can change if the direction was recently navigated to
 * The Cartographer perk can show the returning path in yellow
 * @param {"North" | "South" | "East" | "West"} Direction - The cardinal direction
 * @returns {string} - The color to use
 */
function PandoraDirectionButtonColor(Direction) {
	if ((PandoraMoveDirectionTimer.Timer >= CommonTime()) && (PandoraMoveDirectionTimer.Direction === Direction))
		return PandoraDirectionAvailable(Direction) ? (((Direction == PandoraCurrentRoom.DirectionMap[0]) && InfiltrationPerksActive("Cartographer") && (PandoraCurrentRoom.Background != "Entrance")) ? "#BFFF40" : "#80FF80") : "#408040";
	else
		return PandoraDirectionAvailable(Direction) ? (((Direction == PandoraCurrentRoom.DirectionMap[0]) && InfiltrationPerksActive("Cartographer") && (PandoraCurrentRoom.Background != "Entrance")) ? "#FFFF00" : "White") : "#BF8080";
}

/**
 * Returns whether the player can move in the specified direction
 * @param {"North" | "South" | "East" | "West"} Direction - The cardinal direction to check
 * @returns {boolean} - Whether the direction can be accessed
 */
function PandoraDirectionAvailable(Direction) {
	return (PandoraCurrentRoom.DirectionMap.indexOf(Direction) >= 0);
}

/**
 * Draws the Pandora text data
 * @param {Number} Y - The Y position
 * @returns {boolean} - Whether the direction can be accessed
 */
function PandoraDrawData(Y) {
	if (InfiltrationMission == "CatBurglar") {
		DrawText("$" + PandoraMoney.toString() + (InfiltrationPerksActive("Detector") ? " (" + PandoraChestCount.toString() + ")" : ""), 1887, Y, "White", "Black");
		DrawText(TimerToString(PandoraTimer - CommonTime()), 1887, Y + 55, "White", "Black");
		return;
	}
	if (InfiltrationMission == "ReverseMaid") {
		DrawText("$" + PandoraMoney.toString() + (InfiltrationPerksActive("Detector") ? " (" + PandoraChestCount.toString() + ")" : ""), 1887, Y, "White", "Black");
		DrawText(TextGet("ReverseMaidProgress") + " " + Math.round(PandoraReverseMaidDone / PandoraReverseMaidTotal * 100).toString() + "%", 1887, Y + 55, "White", "Black");
		return;
	}
	DrawText("$" + PandoraMoney.toString() + (InfiltrationPerksActive("Detector") ? " (" + PandoraChestCount.toString() + ")" : ""), 1887, Y + 55, "White", "Black");
}

/**
 * Runs and draws all Pandora's Box screens
 * @returns {void} - Nothing
 */
function PandoraRun() {

	// If time is up for catburglar mission
	if ((PandoraTimer < CommonTime()) && (InfiltrationMission == "CatBurglar"))
		return PandoraPunishmentIntro(false, TextGet("CatBurglarPunishment"));

	// Gets the current room & background
	if ((PandoraRoom.length == 0) || (PandoraCurrentRoom == null)) return;
	PandoraBackground = "Pandora/" + PandoraCurrentRoom.Floor + "/" + PandoraCurrentRoom.Background;
	if (PandoraCurrentRoom.Graffiti != null) DrawImage("Screens/Room/Pandora/Graffiti" + PandoraCurrentRoom.Graffiti.toString() + ".png", 0, 0);
	if (InfiltrationMission == "CatBurglar") DrawRect(0, 0, 2000, 1000, "#00000080");

	// The search square are drawn even out of search mode
	if (PandoraCurrentRoom.SearchSquare != null)
		for (let S = 0; S < PandoraCurrentRoom.SearchSquare.length; S++)
			DrawRect(PandoraCurrentRoom.SearchSquare[S].X, PandoraCurrentRoom.SearchSquare[S].Y, PandoraCurrentRoom.SearchSquare[S].W, PandoraCurrentRoom.SearchSquare[S].H, "#00FFFF7F");

	// In search mode, we draw all previous searches done in that area
	if (PandoraMode == "Search") {
		DrawButton(1885, 885, 90, 90, "", "White", "Icons/Search.png", TextGet("SearchStop"));
		return;
	}

	// In paint mode, we offer many graffities for the player to pick
	if (PandoraMode == "Paint") {
		if (PandoraCurrentRoom.Graffiti == null) {
			for (let G = 0; G <= 7; G++)
				DrawButton(1885, 25 + (G * 115), 90, 90, "", "White", "Icons/Paint.png", TextGet("Graffiti" + G.toString()));
		} else DrawButton(1885, 25, 90, 90, "", "White", "Icons/Paint.png", TextGet("AlreadyPainted"));
		return;
	}

	// In rest mode, the timer will tick slowly and heal the player for 1 willpower
	if (PandoraMode == "Rest") {
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Rest.png", TextGet("RestStop"));
		DrawProgressBar(1785, 954, 205, 36, Math.round(PandoraWillpower / PandoraMaxWillpower * 100));
		DrawText(PandoraWillpower.toString(), 1888, 973, "black", "white");
		DrawCharacter(Player, 750, 0, 1);
		if (PandoraModeTimer < CommonTime()) {
			PandoraWillpower = PandoraWillpower + 1;
			if (PandoraWillpower > PandoraMaxWillpower) PandoraWillpower = PandoraMaxWillpower;
			PandoraModeTimer = CommonTime() + ((InfiltrationPerksActive("Recovery")) ? 10000 : 12000);
		}
		return;
	}

	// Draws up to 4 characters in the room, including the player
	let Pos = 690 - (PandoraCurrentRoom.Character.length + PandoraParty.length) * 230;
	DrawCharacter(Player, Pos, 0, 1);
	let AllowMove = true;
	for (let C = 0; C < PandoraParty.length; C++)
		DrawCharacter(PandoraParty[C], Pos + ((C + 1) * 460), 0, 1);
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++) {
		DrawCharacter(PandoraCurrentRoom.Character[C], Pos + ((C + 1 + PandoraParty.length) * 460), 0, 1);
		if ((PandoraCurrentRoom.Character[C].AllowMove != null) && (PandoraCurrentRoom.Character[C].AllowMove == false)) AllowMove = false;
	}

	// If we allow moving, we draw the paths
	PandoraDrawData(AllowMove ? 525 : 860);
	if (AllowMove) {
		for (let P = 0; P < PandoraCurrentRoom.Path.length; P++)
			DrawButton(1885, 25 + P * 115, 90, 90, "", "White", "Icons/" + PandoraCurrentRoom.Direction[P] + ".png", TextGet("Path" + PandoraCurrentRoom.Direction[P]));
		DrawButton(1842, 620, 90, 90, "", PandoraDirectionButtonColor("North"), "Icons/North.png", TextGet("DirectionNorth"), !PandoraDirectionAvailable("North"));
		DrawButton(1785, 735, 90, 90, "", PandoraDirectionButtonColor("West"), "Icons/West.png", TextGet("DirectionWest"), !PandoraDirectionAvailable("West"));
		DrawButton(1842, 850, 90, 90, "", PandoraDirectionButtonColor("South"), "Icons/South.png", TextGet("DirectionSouth"), !PandoraDirectionAvailable("South"));
		DrawButton(1900, 735, 90, 90, "", PandoraDirectionButtonColor("East"), "Icons/East.png", TextGet("DirectionEast"), !PandoraDirectionAvailable("East"));
	}

	// If we must draw a message in the middle of the screen
	if ((PandoraMessage != null) && (PandoraMessage.Timer != null) && (PandoraMessage.Text != null) && (PandoraMessage.Timer >= CommonTime())) {
		DrawRect(450, 465, 1100, 70, "black");
		DrawRect(452, 467, 1096, 66, "white");
		DrawTextWrap(PandoraMessage.Text, 450, 465, 1100, 70, "black");
	}

	// Draw the willpower / max
	DrawProgressBar(1785, 954, 205, 36, Math.round(PandoraWillpower / PandoraMaxWillpower * 100));
	DrawText(PandoraWillpower.toString(), 1888, 973, "black", "white");

}

/**
 * Enters a new mode for the Pandora screen, such as rest or search mode
 * @param {PandoraMode} NewMode
 * @returns {void} - Nothing
 */
function PandoraSetMode(NewMode) {

	// Exit from a previous mode if needed
	if ((PandoraMode == "Rest") && (NewMode == "") && (PandoraModeAppearance != null)) {
		Player.Appearance = PandoraModeAppearance.slice(0);
		PandoraModeAppearance = null;
		CharacterRefresh(Player, true);
	}

	// Enters the need mode
	PandoraMode = NewMode;

	// In rest, the player switch to a towel and heals overtime
	if (NewMode == "Rest") {
		PandoraModeAppearance = Player.Appearance.slice(0);
		CharacterNaked(Player);
		InventoryWear(Player, "BodyTowel1", "Cloth");
		InventoryWear(Player, "HeadTowel1", "Hat");
		PandoraModeTimer = CommonTime() + ((InfiltrationPerksActive("Recovery")) ? 10000 : 12000);
	}

	// Cannot enter search mode if the item is already found
	if ((NewMode == "Search") && (InfiltrationTarget.Found === true)) {
		PandoraMsgBox(TextGet("AlreadyFound").replace("TargetName", InfiltrationTarget.Name));
		PandoraMode = "";
	}

	// Cannot enter paint mode without paint
	if ((NewMode == "Paint") && !PandoraPaint) {
		PandoraMsgBox(TextGet("NoPaint"));
		PandoraMode = "";
	}

	// Cannot enter paint mode if the room isn't empty
	if ((NewMode == "Paint") && (PandoraCurrentRoom.Character.length >= 1)) {
		PandoraMsgBox(TextGet("RoomEmptyToPaint"));
		PandoraMode = "";
	}

}

/**
 * Handles clicks in all Pandora's screen
 * @returns {void} - Nothing
 */
function PandoraClick() {

	// Checks if we clicked on the player
	if (PandoraRoom.length == 0) return;

	// If there's a message running, we do not allow any clicks
	if ((PandoraMessage != null) && (PandoraMessage.Timer != null) && (PandoraMessage.Text != null) && (PandoraMessage.Timer >= CommonTime()))
		return;

	// In search mode, we can click anywhere on the screen
	if (PandoraMode == "Search") {
		if (MouseIn(0, 0, 1850, 1000)) {
			if (PandoraCurrentRoom.SearchSquare == null) PandoraCurrentRoom.SearchSquare = [];
			let Radius = InfiltrationPerksActive("Investigation") ? 250 : 175;
			PandoraCurrentRoom.SearchSquare.push({ X: MouseX - Radius, Y: MouseY - Radius, W: Radius * 2, H: Radius * 2 });
			if ((PandoraCurrentRoom.ItemX != null) && (PandoraCurrentRoom.ItemY != null) && MouseIn(PandoraCurrentRoom.ItemX - Radius, PandoraCurrentRoom.ItemY - Radius, Radius * 2, Radius * 2)) {
				InfiltrationTarget.Found = true;
				PandoraSetMode("");
				PandoraMsgBox(TextGet("FoundItem").replace("TargetName", InfiltrationTarget.Name));
			}
		}
		if (MouseIn(1885, 885, 90, 90)) PandoraSetMode("");
		return;
	}

	// In rest mode, the player can exit it and stop healing
	if (PandoraMode == "Rest") {
		if (MouseIn(1885, 25, 90, 90)) PandoraSetMode("");
		return;
	}

	// In paint mode, the player puts a graffiti on the background
	if (PandoraMode == "Paint") {
		if (PandoraCurrentRoom.Graffiti == null) {
			for (let G = 0; G <= 7; G++)
				if (MouseIn(1885, 25 + (G * 115), 90, 90)) {
					PandoraReverseMaidDone++;
					PandoraCurrentRoom.Graffiti = G;
					break;
				}
		} else if (MouseIn(1885, 25, 90, 90)) PandoraSetMode("");
		return;
	}

	// Checks if we clicked on a character
	let Pos = 690 - (PandoraCurrentRoom.Character.length + PandoraParty.length) * 230;
	if (MouseIn(Pos, 0, 500, 1000)) return CharacterSetCurrent(Player);
	let AllowMove = true;
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++) {
		if (MouseIn(Pos + ((C + 1 + PandoraParty.length) * 460), 0, 500, 1000)) return CharacterSetCurrent(PandoraCurrentRoom.Character[C]);
		if ((PandoraCurrentRoom.Character[C].AllowMove != null) && (PandoraCurrentRoom.Character[C].AllowMove == false)) AllowMove = false;
	}

	// If we allow moving, we can switch room, rooms that start with "Rest" or "Search" have special modes
	if (AllowMove) {
		for (let C = 0; C < PandoraParty.length; C++)
			if (MouseIn(Pos + ((C + 1) * 460), 0, 500, 1000))
				return CharacterSetCurrent(PandoraParty[C]);
		for (let P = 0; P < PandoraCurrentRoom.Path.length; P++)
			if (MouseIn(1900, 25 + P * 115, 90, 90)) {
				const Floor = PandoraCurrentRoom.Path[P].Floor;
				if (Floor == "Exit")
					return CommonSetScreen("Room", "Infiltration");
				if ((Floor == "Search") || (Floor == "Paint") || (Floor == "Rest"))
					return PandoraSetMode(Floor);
				return PandoraEnterRoom(PandoraCurrentRoom.Path[P]);
			}
		if (MouseIn(1842, 620, 90, 90) && (PandoraDirectionAvailable("North"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("North")], "North");
		if (MouseIn(1785, 735, 90, 90) && (PandoraDirectionAvailable("West"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("West")], "West");
		if (MouseIn(1842, 850, 90, 90) && (PandoraDirectionAvailable("South"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("South")], "South");
		if (MouseIn(1900, 735, 90, 90) && (PandoraDirectionAvailable("East"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("East")], "East");
	}

}

/**
 * Handles the key pressed in Pandora's Box, allow WASD to move around
 * @returns {void} - Nothing
 */
function PandoraKeyDown() {
	let AllowMove = true;
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if ((PandoraCurrentRoom.Character[C].AllowMove != null) && (PandoraCurrentRoom.Character[C].AllowMove == false))
			AllowMove = false;
	if (AllowMove && (PandoraMode == "")) {
		if (((KeyPress == 87) || (KeyPress == 119)) && (PandoraDirectionAvailable("North"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("North")], "North");
		if (((KeyPress == 65) || (KeyPress == 97)) && (PandoraDirectionAvailable("West"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("West")], "West");
		if (((KeyPress == 83) || (KeyPress == 115)) && (PandoraDirectionAvailable("South"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("South")], "South");
		if (((KeyPress == 68) || (KeyPress == 100)) && (PandoraDirectionAvailable("East"))) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("East")], "East");
	}
}

/**
 * Prepares a text popup for Pandora's Box
 * @param {string} Text
 * @returns {void} - Nothing
 */
function PandoraMsgBox(Text) {
	PandoraMessage = { Timer: CommonTime() + 3000, Text: Text };
}

/**
 * Generates a random NPC for Pandora's Box missions, clear the cache if it was generated before
 * @param {string} Group - The main group for that NPC (Random, Entrance, Underground)
 * @param {NPCArchetype} Archetype - The NPC function within Pandora's (Guard, Mistress, Slave, Maid, etc.)
 * @param {string} Name - The name to give to that NPC, can be RANDOM for a fully random name
 * @param {boolean} AllowItem - TRUE if we allow using items on her by default
 * @returns {NPCCharacter} - The NPC character to return
 */
function PandoraGenerateNPC(Group, Archetype, Name, AllowItem) {
	CharacterDelete("NPC_Pandora_" + Group + Archetype);
	delete CommonCSVCache["Screens/Room/Pandora/Dialog_NPC_Pandora_" + Group + Archetype + ".csv"];
	let NPC = CharacterLoadNPC("NPC_Pandora_" + Group + Archetype);
	if (Name == "RANDOM") CharacterRandomName(NPC);
	else NPC.Name = Name;
	CharacterRelease(NPC);
	NPC.Archetype = Archetype;
	NPC.Stage = "0";
	NPC.AllowItem = AllowItem;
	NPC.AllowMove = false;
	NPC.Recruit = 0;
	NPC.RecruitOdds = (Archetype === "Slave") ? 1 : 0.75;
	PandoraDress(NPC, NPC.Archetype);
	return NPC;
}

/**
 * Dress a character in the Rival Club fashion
 * @param {NPCCharacter} C
 * @param {string} Type
 * @returns {void} - Nothing
 */
function PandoraDress(C, Type) {

	// The maids have a red outfit
	if (Type == "Maid") {
		InventoryRemove(C, "Gloves");
		InventoryRemove(C, "ClothAccessory");
		InventoryWear(C, "MaidOutfit2", "Cloth", "#804040");
		InventoryWear(C, "MaidHairband1", "Hat", "#804040");
		if (InventoryGet(C, "Socks") == null) InventoryWear(C, "Socks3", "Socks", "#804040");
		else InventoryGet(C, "Socks").Color = "#804040";
		if (InventoryGet(C, "Bra") == null) InventoryWear(C, "Bra1", "Bra", "#222222");
		else InventoryGet(C, "Bra").Color = "#222222";
		if (InventoryGet(C, "Panties") == null) InventoryWear(C, "Panties1", "Panties", "#222222");
		else InventoryGet(C, "Panties").Color = "#222222";
		if (InventoryGet(C, "Shoes") == null) InventoryWear(C, "Shoes1", "Shoes", "#222222");
		else InventoryGet(C, "Shoes").Color = "#222222";
		if (C.ID != 0) InventoryWear(C, "MaidCollar", "ItemNeck", "#804040");
		CharacterRefresh(C, false);
		return;
	}

	// The guards are wearing a police hat and latex
	if (Type == "Guard") {
		InventoryRemove(C, "Gloves");
		InventoryRemove(C, "ClothAccessory");
		InventoryWear(C, "PoliceWomanHat", "Hat", "Default");
		InventoryWear(C, "CorsetShirt", "Cloth", "Default");
		InventoryWear(C, "LatexPants1", "ClothLower", "Default");
		InventoryWear(C, "DeluxeBoots", "Shoes", "#222222");
		InventoryWear(C, "LatexSocks1", "Shoes", "#222222");
		CharacterRefresh(C, false);
		return;
	}

	// The guards are wearing a police hat and latex
	if (Type == "Slave") {
		CharacterNaked(C);
		InventoryWear(C, "StrictPostureCollar", "ItemNeck", "#FFD700");
		InventoryLock(C, "ItemNeck", "PandoraPadlock", -1);
		InventoryWear(C, "MetalChastityBelt", "ItemPelvis", "#FFD700");
		InventoryLock(C, "ItemPelvis", "PandoraPadlock", -1);
		CharacterRefresh(C, false);
		return;
	}

	// The Mistress wear gold uniforms
	if (Type == "Mistress") {
		InventoryRemove(C, "ClothAccessory");
		InventoryWear(C, "MistressGloves", "Gloves", "#FFD700");
		InventoryWear(C, "MistressBoots", "Shoes", "#FFD700");
		InventoryWear(C, "MistressTop", "Cloth", "#FFD700");
		InventoryWear(C, "MistressBottom", "ClothLower", "#FFD700");
		CharacterRefresh(C, false);
		return;
	}

	// Cosplay wear random costumes
	if (Type == "Cosplay") {
		CharacterNaked(C);
		InventoryWearRandom(C, "Bra");
		InventoryWearRandom(C, "Panties");
		if (Math.random() > 0.33) InventoryWearRandom(C, "Wings");
		if (Math.random() > 0.33) InventoryWearRandom(C, "HairAccessory1");
		if (Math.random() > 0.33) InventoryWearRandom(C, "TailStraps");
		if (Math.random() > 0.5) InventoryWearRandom(C, "HairAccessory2");
		if (Math.random() > 0.5) InventoryWearRandom(C, "Corset");
		if (Math.random() > 0.5) InventoryWearRandom(C, "Mask");
		if (Math.random() > 0.666) InventoryWearRandom(C, "Garters");
		if (Math.random() > 0.666) InventoryWearRandom(C, "Socks");
		if (Math.random() > 0.666) InventoryWearRandom(C, "Gloves");
		if (Math.random() > 0.666) InventoryWearRandom(C, "Bracelet");
		return;
	}

	// Since no defined type is found, we fully randomize the clothes and appearance
	CharacterAppearanceFullRandom(C);
	CharacterRefresh(C, false);

}

/**
 * When the players enters a new room, we keep the previous room
 * @param {PandoraBaseRoom} Room - The room to step into
 * @param {PandoraDirection | ""} [Direction] - The direction the player comes from
 * @returns {void} - Nothing
 */
function PandoraEnterRoom(Room, Direction) {

	// Removes 15 seconds from the clock
	PandoraTimer = PandoraTimer - 15000;

	// Shoes the incoming direction for a little while
	if ((Direction != null) && (Direction != "")) PandoraMoveDirectionTimer = { Direction: Direction, Timer: CommonTime() + 1500 };

	// Sets the new room and keep the previous
	PandoraPreviousRoom = PandoraCurrentRoom;
	PandoraCurrentRoom = Room;

	// 33% odds of removing a previous random NPC if she can walk
	if (PandoraCurrentRoom.Character.length >= 1)
		if ((PandoraCurrentRoom.Character[0].AccountName.indexOf("NPC_Pandora_Random") == 0) && (Math.random() > 0.667) && PandoraCurrentRoom.Character[0].CanWalk()) {
			let Char = PandoraCurrentRoom.Character[0];
			PandoraCurrentRoom.Character = [];
			CharacterDelete(Char.AccountName);
			Char = null;
			return;
		}

	// 4% odds of spawning a new random NPC in the room
	if ((PandoraCurrentRoom.Background.indexOf("Entrance") < 0) && (PandoraCurrentRoom.Character.length == 0) && (Math.random() > 0.96) && (InfiltrationMission != "CatBurglar")) {
		let Type = /** @type {NPCArchetype} */ (CommonRandomItemFromList("", PandoraRandomNPCList));
		let Char = PandoraGenerateNPC("Random", Type, "RANDOM", (Type === "Slave"));
		Room.Character.push(Char);
	}

	// 1% odds of spawning a night guard NPC in the room
	if ((PandoraCurrentRoom.Background.indexOf("Entrance") < 0) && (PandoraCurrentRoom.Character.length == 0) && (Math.random() > 0.99) && (InfiltrationMission == "CatBurglar")) {
		let Char = PandoraGenerateNPC("Night", "Guard", "RANDOM", false);
		Room.Character.push(Char);
	}

	// If we enter a room with a maid that's not bound, she can intercept the player if the mission is almost completed
	if ((PandoraCurrentRoom.Character.length == 1) && (PandoraCurrentRoom.Character[0].AccountName.indexOf("Maid") >= 0) && PandoraCurrentRoom.Character[0].CanInteract()) {
		let StartDialog = "";
		if ((InfiltrationMission == "Retrieve") && (InfiltrationTarget.Found)) StartDialog = InfiltrationMission + ((PandoraClothes == "Maid") ? "Maid" : "Random") + "0";
		if ((InfiltrationMission == "Rescue") && (PandoraParty.length == 1) && (PandoraParty[0].Name == InfiltrationTarget.Name)) StartDialog = InfiltrationMission + ((PandoraClothes == "Guard") ? "Guard" : "Random") + "0";
		if ((InfiltrationMission == "Kidnap") && (PandoraParty.length == 1) && (PandoraParty[0].Name == InfiltrationTarget.Name) && PandoraParty[0].CanTalk()) StartDialog = InfiltrationMission + "Random" + "0";
		if ((PandoraCurrentRoom.Character[0].AccountName.indexOf("EntranceMaid") >= 0) && (PandoraParty.length == 1) && (PandoraParty[0].AccountName.indexOf("RandomMistress") >= 0) && (InventoryGet(PandoraCurrentRoom.Character[0], "ItemHood") == null)) StartDialog = "MistressArrest0";
		if (StartDialog != "") {
			CharacterRelease(PandoraCurrentRoom.Character[0]);
			PandoraCurrentRoom.Character[0].RandomOdds = Math.random() + 0.2 - (InfiltrationDifficulty * 0.1);
			PandoraCurrentRoom.Character[0].AllowMove = false;
			PandoraCurrentRoom.Character[0].Stage = StartDialog;
		}
	}

	// If we enter a room with a guard that's not bound, she can intercept the player
	if ((PandoraCurrentRoom.Character.length == 1) && (PandoraCurrentRoom.Character[0].AccountName.indexOf("RandomGuard") >= 0) && PandoraCurrentRoom.Character[0].CanInteract()) {
		let ArrestDialog = "";
		if (!PandoraCurrentRoom.Character[0].AllowMove && (SkillGetLevel(Player, "Infiltration") >= Math.floor(Math.random() * 10))) ArrestDialog = "InfiltrationArrest";
		if ((InfiltrationMission == "Kidnap") && (PandoraParty.length == 1) && (PandoraParty[0].Name == InfiltrationTarget.Name) && PandoraParty[0].CanTalk()) ArrestDialog = "KidnapArrest";
		if ((PandoraParty.length == 1) && (PandoraParty[0].AccountName.indexOf("RandomGuard") >= 0)) ArrestDialog = "GuardArrest";
		if ((PandoraParty.length == 1) && (PandoraParty[0].AccountName.indexOf("RandomMistress") >= 0) && PandoraParty[0].CanTalk()) ArrestDialog = "MistressArrest";
		if (ArrestDialog != "") {
			CharacterRelease(PandoraCurrentRoom.Character[0]);
			PandoraCurrentRoom.Character[0].AllowMove = false;
			PandoraCurrentRoom.Character[0].Stage = ArrestDialog;
		}
	}

	// If we enter a room with a Dominatrix that's not bound, she can intercept and challenge the player
	if ((PandoraCurrentRoom.Character.length == 1) && (PandoraCurrentRoom.Character[0].AccountName.indexOf("RandomMistress") >= 0) && PandoraCurrentRoom.Character[0].CanInteract()) {
		let MistressDialog = "";
		if (!PandoraCurrentRoom.Character[0].AllowMove && (SkillGetLevel(Player, "Infiltration") >= Math.floor(Math.random() * 10))) MistressDialog = "50";
		if (PandoraClothes == "Mistress") MistressDialog = "60";
		if ((PandoraParty.length == 1) && (PandoraParty[0].AccountName.indexOf("RandomMistress") >= 0)) MistressDialog = "70";
		if (MistressDialog != "") {
			CharacterRelease(PandoraCurrentRoom.Character[0]);
			PandoraCurrentRoom.Character[0].RandomOdds = Math.random() - (SkillGetLevel(Player, "Infiltration") / 10);
			PandoraCurrentRoom.Character[0].AllowMove = false;
			PandoraCurrentRoom.Character[0].Stage = MistressDialog;
		}
	}

}

/**
 * Generates a chest randomly in the room cell (35% odds in cat burglar missions, 5% in other missions)
 * @param {object} Room - The room in which the chest could be placed
 * @returns {void} - Nothing
 */
function PandoraCreateChest(Room) {
	if (Room.Background.indexOf("Cell") != 0) return;
	if ((PandoraChestCount == 0) && (Math.random() > ((InfiltrationMission == "CatBurglar") ? 0.50 : 0.1))) return;
	if ((PandoraChestCount >= 1) && (PandoraChestCount <= 3) && (Math.random() > ((InfiltrationMission == "CatBurglar") ? 0.33 : 0.05))) return;
	if ((PandoraChestCount >= 4) && (PandoraChestCount <= 6) && (Math.random() > ((InfiltrationMission == "CatBurglar") ? 0.20 : 0.03))) return;
	if ((PandoraChestCount >= 7) && (PandoraChestCount <= 10) && (Math.random() > ((InfiltrationMission == "CatBurglar") ? 0.13 : 0.02))) return;
	if ((PandoraChestCount >= 11) && (Math.random() > ((InfiltrationMission == "CatBurglar") ? 0.05 : 0.01))) return;
	PandoraChestCount++;
	let Char = PandoraGenerateNPC("Treasure", "Chest", TextGet("Chest"), false);
	Char.FixedImage = "Screens/Room/Pandora/Chest" + Math.floor(Math.random() * 3).toString() + ".png";
	Char.AllowMove = true;
	Room.Character.push(Char);
}

/**
 * Generates random rooms linked on the entry room
 * @param {PandoraBaseRoom} EntryRoom - The room object that's leading to that floor
 * @param {PandoraFloorDirection} DirectionFrom - The entry direction
 * @param {number} RoomLevel - The room level, the higher it goes, the higher the chances it will be a dead-end
 * @param {number} MaxRoom - The max number of rooms to generate.
 * @returns {void} - Nothing
 */
function PandoraGenerateRoom(EntryRoom, DirectionFrom, RoomLevel, MaxRoom) {

	// Over the max number of rooms, the dungeon layout is always invalid
	if (PandoraRoom.length >= MaxRoom) return;

	// The higher the room level, the less paths there will be
	let PathCount = 0;
	if (EntryRoom.Background.indexOf("Entrance") == 0) PathCount = 2 + Math.floor(Math.random() * 3);
	if (EntryRoom.Background.indexOf("Tunnel") == 0) PathCount = 1;
	if (EntryRoom.Background.indexOf("Fork") == 0) PathCount = 1 + Math.floor(Math.random() * 3);

	// Generates all paths
	let Path = [];
	for (let P = 0; P < PathCount; P++) {

		// Generates a valid path that's not already used
		let Continue = false;
		let PathNum;
		while (!Continue) {
			if (EntryRoom.Background.indexOf("Tunnel") == 0) {
				PathNum = PandoraDirectionListFrom.indexOf(DirectionFrom);
				Continue = true;
			}
			else {
				PathNum = Math.floor(Math.random() * 4);
				Continue = ((PandoraDirectionList.indexOf(DirectionFrom) != PathNum) && (Path.indexOf(PathNum) < 0));
			}
		}
		Path.push(PathNum);

		// Generates a background for the room, tries not to repeat it and do not allow the same background as the previous room
		let RoomBack;
		Continue = false;
		while (!Continue) {
			RoomBack = "Cell";
			let DeadEndOdds = (RoomLevel - InfiltrationDifficulty) * 0.25;
			if (RoomLevel <= 2) DeadEndOdds = 0;
			let TunnelOdds = 0.25 + (RoomLevel * 0.1);
			if (TunnelOdds > 0.75) TunnelOdds = 0.75;
			if (Math.random() >= DeadEndOdds) RoomBack = (Math.random() >= TunnelOdds) ? "Fork" : "Tunnel";
			if ((RoomBack == "Cell") && (Math.random() >= 0.9)) RoomBack = "Rest0";
			else RoomBack = RoomBack + Math.floor(Math.random() * 7);
			Continue = (RoomBack !== EntryRoom.Background);
			for (let R = 0; Continue && (R < PandoraRoom.length); R++)
				if ((PandoraRoom[R].Background == RoomBack) && (Math.random() >= 0.25))
					Continue = false;
		}

		// Creates the room
		/** @type {PandoraBaseRoom} */
		let Room = {};
		Room.Character = [];
		Room.Floor = EntryRoom.Floor;
		Room.Background = RoomBack;
		PandoraCreateChest(Room);
		Room.Path = [];
		Room.PathMap = [];
		Room.PathMap.push(EntryRoom);
		Room.Direction = [];
		Room.DirectionMap = [];
		Room.DirectionMap.push(PandoraDirectionList[PathNum]);
		PandoraRoom.push(Room);
		EntryRoom.PathMap.push(Room);
		EntryRoom.DirectionMap.push(PandoraDirectionListFrom[PathNum]);

		// Creates sub-rooms if it's not a dead end room, generate the search and rest icon if needed
		if (RoomBack.indexOf("Cell") == 0) {
			if ((InfiltrationMission == "Retrieve") || (InfiltrationMission == "Steal")) {
				/** @type {PandoraSpecialRoom} */
				let SearchRoom = { Floor: "Search" };
				Room.Path.push(SearchRoom);
				Room.Direction.push("Search");
			}
			if (InfiltrationMission == "ReverseMaid") {
				/** @type {PandoraSpecialRoom} */
				let PaintRoom = { Floor: "Paint" };
				Room.Path.push(PaintRoom);
				Room.Direction.push("Paint");
			}
		} else if (RoomBack.indexOf("Rest") == 0) {
			/** @type {PandoraSpecialRoom} */
			let RestRoom = { Floor: "Rest" };
			Room.Path.push(RestRoom);
			Room.Direction.push("Rest");
		} else PandoraGenerateRoom(Room, PandoraDirectionListFrom[PathNum], RoomLevel + 1, MaxRoom);

	}

}

/**
 * Loads the Pandora's Box screen
 * @param {PandoraFloors} FloorName - The name of the floor in which we must generate rooms
 * @param {PandoraBaseRoom} EntryRoom - The room object that's leading to that floor
 * @param {PandoraFloorDirection} DirectionFrom - The entry direction
 * @param {PandoraFloorDirection} DirectionTo - The opposite direction
 * @param {number} MaxRoom - The maximum limit of rooms to generate.
 * @returns {void} - Nothing
 */
function PandoraGenerateFloor(FloorName, EntryRoom, DirectionFrom, DirectionTo, MaxRoom) {

	// Always create the same entrance room
	/** @type {PandoraBaseRoom} */
	let Room = {};
	Room.Character = [];
	Room.Floor = FloorName;
	Room.Background = "Entrance";
	Room.Path = [];
	Room.Path.push(EntryRoom);
	Room.PathMap = [];
	Room.Direction = [];
	Room.Direction.push(DirectionFrom);
	Room.DirectionMap = [];
	PandoraRoom.push(Room);
	EntryRoom.Path.push(Room);
	EntryRoom.Direction.push(DirectionTo);

	// Starts the room generation
	PandoraGenerateRoom(Room, DirectionFrom, 1, MaxRoom);

}

/**
 * Clears all the rooms and generates the main hall with an introduction maid
 * @returns {void} - Nothing
 */
function PandoraBuildMainHall() {

	// Creates the ground entrance room with a maid
	PandoraParty = [];
	/** @type {PandoraBaseRoom} */
	let Room = {};
	Room.Character = [];
	if (InfiltrationMission != "CatBurglar") {
		let Char = PandoraGenerateNPC("Entrance", "Maid", "RANDOM", false);
		if (InfiltrationMission == "ReverseMaid") Char.Stage = "40";
		else if (SkillGetLevel(Player, "Infiltration") >= 9) Char.Stage = "30";
		else if (SkillGetLevel(Player, "Infiltration") >= 6) Char.Stage = "20";
		else if (SkillGetLevel(Player, "Infiltration") >= 3) Char.Stage = "10";
		Room.Character.push(Char);
	}
	Room.Floor = "Ground";
	Room.Background = "Entrance";
	Room.PathMap = [];
	/** @type {PandoraSpecialRoom} */
	let ExitRoom = { Floor: "Exit" };
	Room.DirectionMap = [];

	// Generates the floors and sets the starting room, there's a min-max number of rooms based on difficulty
	let MinRoom = 25;
	let MaxRoom = 39;
	let MinChest = 0;
	if (InfiltrationMission == "CatBurglar") MinChest = InfiltrationDifficulty + 2;
	if (InfiltrationDifficulty == 1) { MinRoom = 35; MaxRoom = 59; }
	if (InfiltrationDifficulty == 2) { MinRoom = 50; MaxRoom = 79; }
	if (InfiltrationDifficulty == 3) { MinRoom = 70; MaxRoom = 109; }
	if (InfiltrationDifficulty == 4) { MinRoom = 100; MaxRoom = 149; }
	PandoraRoom = [];
	while ((PandoraRoom.length < MinRoom) || (PandoraRoom.length > MaxRoom) || (PandoraChestCount < MinChest)) {
		PandoraChestCount = 0;
		PandoraRoom = [];
		Room.Path = [];
		Room.Path.push(ExitRoom);
		Room.Direction = [];
		Room.Direction.push("Exit");
		PandoraRoom.push(Room);
		PandoraGenerateFloor("Second", Room, "StairsDown", "StairsUp", MaxRoom);
		PandoraGenerateFloor("Underground", Room, "StairsUp", "StairsDown", MaxRoom);
	}
	PandoraCurrentRoom = Room;
	PandoraPreviousRoom = null;
	PandoraTargetRoom = null;

	// In reverse maid mission, we count the number of dead-end cell rooms that can be broken
	if (InfiltrationMission == "ReverseMaid") {
		PandoraReverseMaidDone = 0;
		PandoraReverseMaidTotal = 0;
		for (let R = 0; R < PandoraRoom.length; R++)
			if (PandoraRoom[R].Background.indexOf("Cell") == 0)
				PandoraReverseMaidTotal++;
	}

	// Pick a random cell room for the final target, generates special NPCs if needed
	while (PandoraTargetRoom == null) {
		Room = PandoraRoom[Math.floor(Math.random() * PandoraRoom.length)];
		if (Room.Background.indexOf("Cell") == 0) {
			if ((InfiltrationMission == "Retrieve") || (InfiltrationMission == "Steal")) {
				Room.ItemX = 50 + Math.floor(Math.random() * 1700);
				Room.ItemY = 50 + Math.floor(Math.random() * 900);
			}
			if (InfiltrationMission == "Rescue") {
				let Victim = PandoraGenerateNPC("Rescue", "Victim", InfiltrationTarget.Name, true);
				if ((InfiltrationTarget.PrivateRoom != null) && InfiltrationTarget.PrivateRoom) {
					Victim.Appearance = PrivateRansomCharacter.Appearance.slice(0);
					CharacterRefresh(Victim);
				} else {
					if (Math.random() >= 0.333) CharacterRandomUnderwear(Victim);
					else if (Math.random() >= 0.5) CharacterNaked(Victim);
					CharacterFullRandomRestrain(Victim, "LOT", true);
				}
				Room.Character.push(Victim);
				let Guard = PandoraGenerateNPC("Rescue", "Guard", "RANDOM", false);
				Room.PathMap[0].Character.push(Guard);
			}
			if (InfiltrationMission == "Kidnap") {
				let Target = PandoraGenerateNPC("Kidnap", "Target", InfiltrationTarget.Name, true);
				Room.Character.push(Target);
			}
			PandoraTargetRoom = Room;
		}
	}

}

/**
 * Removes the current character from the room and deletes that NPC from the array
 * @returns {void} - Nothing
 */
function PandoraRemoveCurrentCharacter() {
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if (PandoraCurrentRoom.Character[C].ID == CurrentCharacter.ID) {
			PandoraCurrentRoom.Character.splice(C, 1);
			break;
		}
	CharacterDelete(CurrentCharacter.AccountName);
	DialogLeave();
}

/**
 * Flags the current character to allow moves and exits any dialog with her
 * @returns {void} - Nothing
 */
function PandoraCharacterAllowMove() {
	CurrentCharacter.AllowMove = true;
	DialogLeave();
}

/**
 * When the current character joins the player's party
 * @returns {void} - Nothing
 */
function PandoraCharacterJoin() {
	CurrentCharacter.AllowMove = true;
	if (PandoraParty.length == 1)
		PandoraCurrentRoom.Character.push(PandoraParty[0]);
	PandoraParty = [];
	PandoraParty.push(CurrentCharacter);
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if (PandoraCurrentRoom.Character[C].ID == CurrentCharacter.ID) {
			PandoraCurrentRoom.Character.splice(C, 1);
			break;
		}
}

/**
 * When the current character leaves the player's party
 * @returns {void} - Nothing
 */
function PandoraCharacterLeave() {
	PandoraCurrentRoom.Character.push(CurrentCharacter);
	PandoraParty = [];
}

/**
 * When the current character starts to fight against the player
 * @returns {void} - Nothing
 */
function PandoraCharacterFight() {
	PandoraFightCharacter = CurrentCharacter;
	let Difficulty = (InfiltrationDifficulty * 2) + Math.floor(Math.random() * 3);
	if (CurrentCharacter.AccountName.indexOf("RandomMistress") >= 0) Difficulty = InfiltrationDifficulty + 6;
	KidnapStart(CurrentCharacter, PandoraBackground, Difficulty, "PandoraCharacterFightEnd()");
}

/**
 * Resolves the fight between the player and the current character
 * @returns {void} - Nothing
 */
function PandoraCharacterFightEnd() {
	CharacterSetCurrent(PandoraFightCharacter);
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (CurrentCharacter.KidnapMaxWillpower - CurrentCharacter.KidnapWillpower)));
	PandoraWillpower = Player.KidnapWillpower;
	if (InfiltrationPerksActive("Recovery")) {
		PandoraWillpower = PandoraWillpower + Math.round(PandoraMaxWillpower / 10);
		if (PandoraWillpower > PandoraMaxWillpower) PandoraWillpower = PandoraMaxWillpower;
	}
	CurrentCharacter.Stage = (KidnapVictory) ? "100" : "200";
	CharacterRelease(KidnapVictory ? Player : CurrentCharacter);
	CurrentCharacter.AllowItem = KidnapVictory;
	if (KidnapVictory) CurrentCharacter.AllowMove = true;
	if (KidnapVictory && (PandoraClothes != "Random") && (PandoraClothes != "CatBurglar") && (PandoraClothes != "Cosplay")) PandoraDress(Player, PandoraClothes);
	CommonSetScreen("Room", "Pandora");
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, (KidnapVictory) ? "FightVictory" : "FightDefeat");
}

/**
 * When the mission fails, we go back to the infiltration room
 * @returns {void} - Nothing
 */
function PandoraMissionFail() {
	InfiltrationTarget.Fail = true;
	InfiltrationTarget.Found = false;
	CharacterRelease(Player);
	CommonSetScreen("Room", "Infiltration");
	DialogLeave();
}

/**
 * When the player must walk back to the previous room he entered from
 * @returns {void} - Nothing
 */
function PandoraWalkBack() {
	if (PandoraPreviousRoom == null) return;
	PandoraCurrentRoom = PandoraPreviousRoom;
	PandoraPreviousRoom = null;
	DialogLeave();
}

/**
 * When the player must strips the current character
 * @returns {void} - Nothing
 */
function PandoraCharacterNaked() {
	CharacterNaked(CurrentCharacter);
}

/**
 * When the player changes in the clothes of someone else (type)
 * @param {string} Type - The type of character to dress as (ex: Guard)
 * @returns {void} - Nothing
 */
function PandoraPlayerClothes(Type) {
	PandoraDress(Player, Type);
	PandoraClothes = Type;
}

/**
 * The player can only try once to recruit a random NPC, the odds are set when conversation starts
 * @returns {void} - Nothing
 */
function PandoraStartRecruit() {
	CurrentCharacter.Recruit = Math.random();
}

/**
 * Increases the infiltration skill on some events
 * @param {string|number} Progress - The progression factor
 * @returns {void} - Nothing
 */
function PandoraInfiltrationChange(Progress) {
	let P = parseInt(Progress);
	if (InfiltrationDifficulty == 1) P = Math.round(P * 1.5);
	if (InfiltrationDifficulty == 2) P = Math.round(P * 2.25);
	if (InfiltrationDifficulty == 3) P = Math.round(P * 3);
	if (InfiltrationDifficulty == 4) P = Math.round(P * 4);
	SkillProgress("Infiltration", P);
}

/**
 * Checks if the player can bring the NPC to her private room
 * @returns {boolean} - Returns true if the player can
 */
function PandoraCanJoinPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")); }

/**
 * When a random NPC joins the player private room, we add that character and exits the dialog
 * @returns {void} - Nothing
 */
function PandoraCharacterJoinPrivateRoom() {
	CurrentScreen = "Private";
	let C = PrivateAddCharacter(CurrentCharacter, (CurrentCharacter.Archetype === "Slave") ? "Submissive" : null);
	C.FromPandora = true;
	CurrentScreen = "Pandora";
	PandoraRemoveCurrentCharacter();
}

/**
 * Checks if the mission is the one provided in the parameter
 * @param {string} Type - The mission type
 * @returns {boolean} - Returns TRUE if it's the current mission
 */
function PandoraMissionIs(Type) { return (InfiltrationMission === Type); }

/**
 * Checks if the perk specified is currently selected
 * @param {string} Type - The perk type
 * @returns {boolean} - Returns TRUE if it's selected
 */
function PandoraHasPerk(Type) { return InfiltrationPerksActive(Type); }

/**
 * Prepares an information text based on the bribe amount provided
 * @param {string} Amount - The bribe amount
 * @param {string} Type - The perk type
 * @returns {void} - Nothing
 */
function PandoraBribeInfo(Amount, Type) {
	let Money = parseInt(Amount);
	CharacterChangeMoney(Player, Money * -1);
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "BribeInfo" + InfiltrationMission + Type);
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("LevelName", TextGet("LevelName" + PandoraTargetRoom.Floor));
	let Room = PandoraTargetRoom;
	while (Room.PathMap[0].Background.indexOf("Entrance") != 0)
		Room = Room.PathMap[0];
	let Dir = Room.DirectionMap[0];
	Dir = PandoraDirectionListFrom[PandoraDirectionList.indexOf(Dir)];
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("FirstDirection", TextGet("FirstDirection" + Dir));
}

/**
 * Some dialog activities can boost the recruitment odds
 * @returns {void} - Nothing
 */
function PandoraRecruitBoost() {
	if (CurrentCharacter.RecruitOdds >= 0.75)
		CurrentCharacter.RecruitOdds = CurrentCharacter.RecruitOdds - 0.05;
}

/**
 * Starts the player punishment process and jumps to the punishment Dominatrix
 * @param {Boolean} FromKidnapper
 * @param {string} [FixIntro]
 * @returns {void} - Nothing
 */
function PandoraPunishmentIntro(FromKidnapper, FixIntro) {
	let IntroText = FixIntro;
	if (FixIntro == null) {
		if (SkillGetLevel(Player, "Infiltration") >= 8) IntroText = DialogFind(CurrentCharacter, "Punishment8");
		else if (SkillGetLevel(Player, "Infiltration") >= 5) IntroText = DialogFind(CurrentCharacter, "Punishment5");
		else if (SkillGetLevel(Player, "Infiltration") >= 2) IntroText = DialogFind(CurrentCharacter, "Punishment2");
		else IntroText = DialogFind(CurrentCharacter, "Punishment0");
	}
	PandoraBackground = "Pandora/Underground/Cell" + Math.floor(Math.random() * 7).toString();
	let Dominatrix = PandoraGenerateNPC("Punishment", "Mistress", "RANDOM", false);
	if (SkillGetLevel(Player, "Infiltration") >= 2) Dominatrix.Stage = "20";
	if (SkillGetLevel(Player, "Infiltration") >= 5) Dominatrix.Stage = "50";
	if (SkillGetLevel(Player, "Infiltration") >= 8) Dominatrix.Stage = "80";
	if ((FromKidnapper != null) && FromKidnapper) Dominatrix.Stage = "200";
	CharacterSetCurrent(Dominatrix);
	CurrentCharacter.CurrentDialog = IntroText;
	InfiltrationTarget.Fail = true;
	InfiltrationTarget.Found = false;
}

/**
 * Puts the player in lots of random restraints
 * @returns {void} - Nothing
 */
function PandoraRestrainPlayer() {
	CharacterFullRandomRestrain(Player, "LOT", true);
}

/**
 * When the player purchases a drink from the maid, she can heal by the money value
 * @param {number} Money
 * @returns {void} - Nothing
 */
function PandoraBuyMaidDrink(Money) {
	Money = parseInt(Money);
	CharacterChangeMoney(Player, Money * -1);
	if (CurrentCharacter.DrinkValue == null) CurrentCharacter.DrinkValue = 0;
	if (Money > CurrentCharacter.DrinkValue) {
		PandoraWillpower = PandoraWillpower + Money - CurrentCharacter.DrinkValue;
		if (PandoraWillpower > PandoraMaxWillpower) PandoraWillpower = PandoraMaxWillpower;
		CurrentCharacter.DrinkValue = Money;
	}
}

/**
 * Generates new random odds for a character, based on Pandora's difficulty
 * @returns {void} - Nothing
 */
function PandoraCharacterGenerateRandomOdds() {
	CurrentCharacter.RandomOdds = Math.random() + 0.2 - (InfiltrationDifficulty * 0.1);
}

/**
 * Starts the guard quiz, the player needs 5 good answers to be let go
 * @returns {void} - Nothing
 */
function PandoraQuizStart() {
	CurrentCharacter.QuizLog = [];
	CurrentCharacter.QuizFail = 0;
	PandoraQuizNext();
}

/**
 * Generates questions that guards will challenge the player with
 * @returns {void} - Nothing
 */
function PandoraQuizNext() {
	let Question = Math.floor(Math.random() * 11);
	while (CurrentCharacter.QuizLog.indexOf(Question) >= 0)
		Question = Math.floor(Math.random() * 11);
	CurrentCharacter.QuizLog.push(Question);
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "QuizQuestion" + Question.toString());
}

/**
 * When the player gives an answer to the guard quiz, the guard will give a visual hint if the answer is incorrect
 * @param {string} Answer
 * @returns {void} - Nothing
 */
function PandoraQuizAnswer(Answer) {
	if (Answer != "1") {
		CurrentCharacter.QuizFail++;
		CharacterSetFacialExpression(CurrentCharacter, "Blush", "Low", 3);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes", "Angry", 3);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes2", "Angry", 3);
	}
	if (CurrentCharacter.QuizLog.length >= 5) {
		CurrentCharacter.Stage = (CurrentCharacter.QuizFail >= 2) ? "Arrest" : "30";
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, (CurrentCharacter.QuizFail >= 2) ? "QuizFail" : "QuizSuccess");
	} else PandoraQuizNext();
}

/**
 * When the player gets ungagged by an NPC, we remove everything on the head
 * @returns {void} - Nothing
 */
function PandoraPlayerUngag() {
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemNose");
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
}

/**
 * Sets the punishment sentence in minutes
 * @param {string|number} Minutes
 * @returns {void} - Nothing
 */
function PandoraPunishmentSentence(Minutes) {
	Player.Infiltration.Punishment = {
		Minutes: parseInt(Minutes),
		Background: PandoraBackground,
		Difficulty: InfiltrationDifficulty,
	};
}

/**
 * Starts the punishment
 * @returns {void} - Nothing
 */
function PandoraPunishmentStart() {
	PandoraWillpower = 0;
	Player.Infiltration.Punishment.Timer = CurrentTime + (Player.Infiltration.Punishment.Minutes * 60000);
	ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	DialogLeave();
	CommonSetScreen("Room", "PandoraPrison");
}

/**
 * When an NPC pays the player for a service
 * @param {string} Amount - The paid amount
 * @returns {void} - Nothing
 */
function PandoraPlayerPay(Amount) {
	CharacterChangeMoney(Player, parseInt(Amount));
}

/**
 * When the player pays an NPC to wear her clothes
 * @returns {void} - Nothing
 */
function PandoraBuyRandomClothes() {
	CharacterChangeMoney(Player, -10);
	CharacterNaked(Player);
	CharacterTransferItem(CurrentCharacter, Player, "Cloth");
	CharacterTransferItem(CurrentCharacter, Player, "ClothLower");
	CharacterTransferItem(CurrentCharacter, Player, "Bra");
	CharacterTransferItem(CurrentCharacter, Player, "Panties");
	CharacterTransferItem(CurrentCharacter, Player, "Socks");
	CharacterTransferItem(CurrentCharacter, Player, "Shoes");
	CharacterNaked(CurrentCharacter);
	PandoraClothes = "Random";
}

/**
 * Starts the chest lockpicking mini-game
 * @returns {void} - Nothing
 */
function PandoraChestLockpickStart() {
	ChestLockpickChestImage = ((CurrentCharacter == null) || (CurrentCharacter.FixedImage == null)) ? "Screens/Room/Pandora/Chest" + Math.floor(Math.random() * 3).toString() + ".png" : CurrentCharacter.FixedImage;
	ChestLockpickBackground = PandoraBackground;
	DialogLeave();
	MiniGameStart("ChestLockpick", InfiltrationDifficulty, "PandoraChestLockEnd");
}

/**
 * When the picklock mini-game ends, adds 30 seconds to the timer
 * @returns {void} - Nothing
 */
function PandoraChestLockEnd() {
	PandoraTimer = PandoraTimer - 30000;
	PandoraCurrentRoom.Character[0].Stage = (MiniGameVictory) ? "100" : "0";
	CharacterSetCurrent(PandoraCurrentRoom.Character[0]);
	CommonSetScreen("Room", "Pandora");
}

/**
 * When the player loots the chest, we add some money and the chest disappear
 * @returns {void} - Nothing
 */
function PandoraChestLoot() {
	DialogLeave();
	PandoraMoney = PandoraMoney + Math.floor((5 + Math.random() * 5) * (InfiltrationDifficulty + 2) * 0.5);
	PandoraChestCount--;
	PandoraCurrentRoom.Character.splice(0, 1);
}

/**
 * When the player gets the paint cans from a cosplay girl
 * @returns {void} - Nothing
 */
function PandoraGetPaint() {
	PandoraPaint = true;
}
