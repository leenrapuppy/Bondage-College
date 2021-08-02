"use strict";
var KinkyDungeonStruggleGroups = [];
var KinkyDungeonStruggleGroupsBase = [
	"ItemHead",
	"ItemHood",
	"ItemM",
	"ItemEars",
	"ItemArms",
	"ItemNeck",
	"ItemHands",
	"ItemBreast",
	"ItemNipples",
	"ItemNipplesPiercings",
	"ItemPelvis",
	"ItemTorso",
	"ItemLegs",
	"ItemButt",
	"ItemVulva",
	"ItemVulvaPiercings",
	"ItemFeet",
	"ItemBoots",
];
var KinkyDungeonDrawStruggle = true;
var KinkyDungeonDrawState = "Game";
var KinkyDungeonSpellValid = false;
var KinkyDungeonCamX = 0;
var KinkyDungeonCamY = 0;
var KinkyDungeonTargetX = 0;
var KinkyDungeonTargetY = 0;
var KinkyDungeonLastDraw = 0;
var KinkyDungeonDrawDelta = 0;

function KinkyDungeonGetSprite(code) {
	let sprite = "Floor";
	if (code == "1") sprite = "Wall";
	if (code == "2") sprite = "Brickwork";
	else if (code == "X") sprite = "Doodad";
	else if (code == "C") sprite = "Chest";
	else if (code == "c") sprite = "ChestOpen";
	else if (code == "D") sprite = "Door";
	else if (code == "d") sprite = "DoorOpen";
	else if (code == "R") sprite = "Rubble";
	else if (code == "r") sprite = "RubbleLooted";
	else if (code == "S") sprite = "StairsUp";
	else if (code == "s") sprite = "StairsDown";
	else if (code == "A") sprite = "Shrine";
	else if (code == "a") sprite = "ShrineBroken";
	return sprite;
}

const KinkyDungeonLastChatTimeout = 10000;

// Draw function for the game portion
function KinkyDungeonDrawGame() {

	KinkyDungeonListenKeyMove();

	KinkyDungeonCapStats();

	if (ChatRoomChatLog.length > 0) {
		let LastChatObject = ChatRoomChatLog[ChatRoomChatLog.length - 1];
		let LastChat = LastChatObject.Garbled;
		let LastChatTime = LastChatObject.Time;
		let LastChatSender = (LastChatObject.SenderName) ? LastChatObject.SenderName + ": " : ">";
		let LastChatMaxLength = 60;

		if (LastChat)  {
			LastChat = (LastChatSender + LastChat).substr(0, LastChatMaxLength);
			if (LastChat.length == LastChatMaxLength) LastChat = LastChat + "...";
			if (LastChatTime && CommonTime() < LastChatTime + KinkyDungeonLastChatTimeout)
				if (!KinkyDungeonSendTextMessage(0, LastChat, "white", 1) && LastChat != KinkyDungeonActionMessage)
					if (!KinkyDungeonSendActionMessage(0, LastChat, "white", 1) && LastChat != KinkyDungeonTextMessage)
						KinkyDungeonSendTextMessage(1, LastChat, "white", 1);
		}
	}


	KinkyDungeonDrawDelta = CommonTime() - KinkyDungeonLastDraw;
	KinkyDungeonLastDraw = CommonTime();



	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 750, 42, "white", "silver");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 42, "white", "silver");

	if (KinkyDungeonTextMessageTime > 0)
		DrawText(KinkyDungeonTextMessage, 1150, 82, KinkyDungeonTextMessageColor, "silver");
	if (KinkyDungeonActionMessageTime > 0)
		DrawText(KinkyDungeonActionMessage, 1150, 132, KinkyDungeonActionMessageColor, "silver");

	// Draw the stats
	KinkyDungeonDrawStats(canvasOffsetX + KinkyDungeonCanvas.width+10, canvasOffsetY, 1975 - (canvasOffsetX + KinkyDungeonCanvas.width+5), 100);

	if (KinkyDungeonDrawState == "Game") {
		if ((KinkyDungeonIsPlayer() || (KinkyDungeonGameData && CommonTime() < KinkyDungeonNextDataLastTimeReceived + KinkyDungeonNextDataLastTimeReceivedTimeout))) {


			KinkyDungeonUpdateVisualPosition(KinkyDungeonPlayerEntity, KinkyDungeonDrawDelta);

			let CamX = Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.x - Math.floor(KinkyDungeonGridWidthDisplay/2)));
			let CamY = Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.y - Math.floor(KinkyDungeonGridHeightDisplay/2)));
			let CamX_offset = Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.visual_x - Math.floor(KinkyDungeonGridWidthDisplay/2))) - CamX;
			let CamY_offset = Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.visual_y - Math.floor(KinkyDungeonGridHeightDisplay/2))) - CamY;

			KinkyDungeonCamX = CamX;
			KinkyDungeonCamY = CamY;

			KinkyDungeonSetMoveDirection();

			if (KinkyDungeonCanvas) {
				KinkyDungeonContext.fillStyle = "rgba(20,20,20.0,1.0)";
				KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
				KinkyDungeonContext.fill();
				// Draw the grid and tiles
				let rows = KinkyDungeonGrid.split('\n');
				for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {
						let RY = Math.max(0, Math.min(R+CamY, KinkyDungeonGridHeight));
						let RX = Math.max(0, Math.min(X+CamX, KinkyDungeonGridWidth));
						let sprite = KinkyDungeonGetSprite(rows[RY][RX]);

						DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Floor" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + "/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					}
				}

				// Get lighting grid
				if (KinkyDungeonUpdateLightGrid) {
					KinkyDungeonUpdateLightGrid = false;
					KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonGetVisionRadius() }]);
				}



				KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonContext.drawImage(KinkyDungeonCanvasPlayer,  (KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay, (KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay);
				KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);

				// Draw fog of war
				rows = KinkyDungeonLightGrid.split('\n');
				for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {

						let RY = Math.max(0, Math.min(R+CamY, KinkyDungeonGridHeight));
						let RX = Math.max(0, Math.min(X+CamX, KinkyDungeonGridWidth));

						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.fillStyle = "rgba(0,0,0," + Math.max(0, 1-Number(rows[RY][RX])/3) + ")";

						KinkyDungeonContext.fillRect((-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset + R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.fill();
					}
				}

				// Draw targeting reticule
				if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height) && KinkyDungeonIsPlayer()) {
					if (KinkyDungeonTargetingSpell) {
						KinkyDungeonSetTargetLocation();

						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.rect((KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.lineWidth = 3;
						KinkyDungeonContext.strokeStyle = "#88AAFF";
						KinkyDungeonContext.stroke();

						KinkyDungeonSpellValid = (KinkyDungeonTargetingSpell.projectile || KinkyDungeonTargetingSpell.range >= Math.sqrt((KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) *(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) + (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y) * (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y))) &&
							(KinkyDungeonTargetingSpell.projectile || KinkyDungeonTargetingSpell.CastInWalls || KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY))) &&
							(!KinkyDungeonTargetingSpell.WallsOnly || !KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY)));

						if (KinkyDungeonSpellValid)
							if (KinkyDungeonTargetingSpell.projectile)
								DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
									KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
									(KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
							else
								DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
									KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
									(KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					} else if ((KinkyDungeonMoveDirection.x != 0 || KinkyDungeonMoveDirection.y != 0)) {
						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.rect((KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.lineWidth = 3;
						KinkyDungeonContext.strokeStyle = "#ff4444";
						KinkyDungeonContext.stroke();
					}
				}
				MainCanvas.drawImage(KinkyDungeonCanvas, canvasOffsetX, canvasOffsetY);
			}

			CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);

			// Draw the player no matter what
			KinkyDungeonContextPlayer.clearRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
			DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSizeDisplay/2, 0, KinkyDungeonGridSizeDisplay/250, false, KinkyDungeonContextPlayer);

			if (KinkyDungeonIsPlayer()) {
				// Draw the struggle buttons if applicable
				if (KinkyDungeonDrawStruggle && KinkyDungeonStruggleGroups)
					for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
						let sg = KinkyDungeonStruggleGroups[S];
						let ButtonWidth = 60;
						let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
						let y = 42 + sg.y * (ButtonWidth + 46);

						if (sg.left) {
							MainCanvas.textAlign = "left";
						} else {
							MainCanvas.textAlign = "right";
						}

						let color = "white";
						let locktext = "";
						if (KinkyDungeonPlayer.IsBlind() < 1) {
							if (sg.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLockAbr");}
							if (sg.lock == "Yellow") {color = "#ffff88"; locktext = TextGet("KinkyYellowLockAbr");}
							if (sg.lock == "Green") {color = "#88FF88"; locktext = TextGet("KinkyGreenLockAbr");}
							if (sg.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLockAbr");}
						}

						let GroupText = sg.name ? ("Restraint" + sg.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.

						DrawText(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, color, "black");
						MainCanvas.textAlign = "center";

						let i = 1;
						DrawButton(x, y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", "");
						if (!sg.blocked) {
							let toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
							DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
							if (KinkyDungeonLockpicks > 0 && sg.lock != "") {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;}
							if (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0) {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Cut.png", ""); i++;}
						}
					}

				if (KinkyDungeonStruggleGroups.length > 0) {
					if (KinkyDungeonDrawStruggle) DrawButton(510, 925, 120, 60, "", "White", KinkyDungeonRootDirectory + "HideTrue.png", "");
					else DrawButton(510, 925, 120, 60, "", "White", KinkyDungeonRootDirectory + "HideFalse.png", "");
				}

				if (KinkyDungeonTargetTile) {
					if (KinkyDungeonTargetTile.Type == "Lock") {
						let action = false;
						if (KinkyDungeonLockpicks > 0) {
							DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
							action = true;
						}

						if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Yellow") && (KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0)
							|| (KinkyDungeonTargetTile.Lock.includes("Green") && KinkyDungeonGreenKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) ) ) {
							DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
							action = true;
						}

						if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 850, "white", "silver");

						if (KinkyDungeonTargetTile.Lock.includes("Red"))
							DrawText(TextGet("KinkyRedLock"), 675, 850, "white", "silver");
						else if (KinkyDungeonTargetTile.Lock.includes("Yellow"))
							DrawText(TextGet("KinkyYellowLock"), 675, 850, "white", "silver");
						else if (KinkyDungeonTargetTile.Lock.includes("Green"))
							DrawText(TextGet("KinkyGreenLock"), 675, 850, "white", "silver");
						else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
							DrawText(TextGet("KinkyBlueLock"), 675, 850, "white", "silver");
					} else if (KinkyDungeonTargetTile.Type == "Shrine") {
						KinkyDungeonDrawShrine();
					} else if (KinkyDungeonTargetTile.Type == "Door") {
						DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonCloseDoor"), "White");
					}
				}

				DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
				DrawButton(925, 925, 250, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

				if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]]) {
					let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[0]];
					DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1275, 835, "white", "silver");
					DrawText("" + Math.ceil(KinkyDungeonGetCost(spell.level)) + "", 1225, 870, "#77FF77", "silver");
					DrawText(spell.manacost+ "M", 1325, 870, "#55AAFF", "silver");
					DrawButton(1230, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell1.png", "");
				}
				if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]]) {
					let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[1]];
					DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1525, 835, "white", "silver");
					DrawText("" + Math.ceil(KinkyDungeonGetCost(spell.level)) + "", 1475, 870, "#77FF77", "silver");
					DrawText(spell.manacost+ "M", 1575, 870, "#55AAFF", "silver");
					DrawButton(1480, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell2.png", "");
				}
				if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]]) {
					let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[2]];
					DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1775, 835, "white", "silver");
					DrawText("" + Math.ceil(KinkyDungeonGetCost(spell.level)) + "", 1725, 870, "#77FF77", "silver");
					DrawText(spell.manacost+ "M", 1825, 870, "#55AAFF", "silver");
					DrawButton(1730, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell3.png", "");
				}

				KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelayPing);
			}
		} else {
			DrawText(TextGet("KinkyDungeonLoading"), 1100, 500, "white", "silver");
			if (CommonTime() > KinkyDungeonGameDataNullTimerTime + KinkyDungeonGameDataNullTimer) {
				ServerSend("ChatRoomChat", { Content: "RequestFullKinkyDungeonData", Type: "Hidden", Target: KinkyDungeonPlayerCharacter.MemberNumber });
				KinkyDungeonGameDataNullTimerTime = CommonTime();
			}
		}
	} else if (KinkyDungeonDrawState == "Magic") {
		DrawButton(925, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagic();
	} else if (KinkyDungeonDrawState == "Inventory") {
		DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawInventory();
	} else if (KinkyDungeonDrawState == "Lore") {
		DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawLore();
	}

	if (KinkyDungeonStatArousal > 0)
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, KinkyDungeonStatArousal);


}

function KinkyDungeonUpdateVisualPosition(Entity, amount) {
	if (amount < 0 || !Entity.visual_x || !Entity.visual_y) {
		Entity.visual_x = Entity.x;
		Entity.visual_y = Entity.y;
	} else {

		let value = amount/100;// How many ms to complete a move
		// xx is the true position of a bullet
		let tx = (Entity.xx) ? Entity.xx : Entity.x;
		let ty = (Entity.yy) ? Entity.yy : Entity.y;
		let dist = Math.sqrt((Entity.visual_x - tx) * (Entity.visual_x - tx) + (Entity.visual_y - ty) * (Entity.visual_y - ty));
		if (dist == 0) return;
		// Increment
		let weightx = Math.abs(Entity.visual_x - tx)/(dist);
		let weighty = Math.abs(Entity.visual_y - ty)/(dist);
		//if (weightx != 0 && weightx != 1 && Math.abs(weightx - weighty) > 0.01)
		//console.log(weightx + ", " + weighty + ", " + (Entity.visual_x - tx) + ", " + (Entity.visual_y - ty) + ", dist = " + dist, "x = " + Entity.visual_x + ", y = " + Entity.visual_y)

		if (Entity.visual_x > tx) Entity.visual_x = Math.max(Entity.visual_x - value*weightx, tx);
		else Entity.visual_x = Math.min(Entity.visual_x + value*weightx, tx);

		if (Entity.visual_y > ty) Entity.visual_y = Math.max(Entity.visual_y - value*weighty, ty);
		else Entity.visual_y = Math.min(Entity.visual_y + value*weighty, ty);

		//console.log("x = " + Entity.visual_x + ", y = " + Entity.visual_y + ", tx = " + tx + ", ty = " + ty)
	}
}

function KinkyDungeonSetTargetLocation() {
	KinkyDungeonTargetX = Math.round((MouseX - KinkyDungeonGridSizeDisplay/2 - canvasOffsetX)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamX;
	KinkyDungeonTargetY = Math.round((MouseY - KinkyDungeonGridSizeDisplay/2 - canvasOffsetY)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamY;
}

function KinkyDungeonSetMoveDirection() {
	KinkyDungeonMoveDirection = KinkyDungeonGetDirection(
		(MouseX - ((KinkyDungeonPlayerEntity.x - KinkyDungeonCamX)*KinkyDungeonGridSizeDisplay + canvasOffsetX + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay,
		(MouseY - ((KinkyDungeonPlayerEntity.y - KinkyDungeonCamY)*KinkyDungeonGridSizeDisplay + canvasOffsetY + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay);
}

function KinkyDungeonHandleHUD() {
	if (KinkyDungeonDrawState == "Game") {
		if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();

		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Inventory"; return true;}
		else
		if (MouseIn(925, 925, 250, 60)) { KinkyDungeonDrawState = "Magic"; return true;}
		else if (MouseIn(510, 925, 120, 60)) { KinkyDungeonDrawStruggle = !KinkyDungeonDrawStruggle; return true;}

		if (!KinkyDungeonTargetingSpell) {
			if (KinkyDungeonHandleSpell()) return true;
			KinkyDungeonSpellPress = 0;
		} else {
			KinkyDungeonSpellPress = 0;
		}

		if (KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type && KinkyDungeonTargetTile.Type == "Lock") {
				if (KinkyDungeonLockpicks > 0 && MouseIn(963, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonPickAttempt()) {
						KinkyDungeonTargetTile = null;
						delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}

				if (((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Yellow") && (KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Green") && KinkyDungeonGreenKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) )) && MouseIn(825, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
						KinkyDungeonTargetTile = null;
						delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
					}
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				KinkyDungeonHandleShrine();

			} else if (KinkyDungeonTargetTile.Type == "Door") {
				if (MouseIn(675, 825, 350, 60)) {
					KinkyDungeonAdvanceTime(1, true);
					KinkyDungeonTargetTile = null;
					let x = KinkyDungeonTargetTileLocation.split(',')[0];
					let y = KinkyDungeonTargetTileLocation.split(',')[1];
					KinkyDungeonMapSet(parseInt(x), parseInt(y), "D");
					KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 1);
					KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
					return true;
				}
			}
		}

		if (KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				let sg = KinkyDungeonStruggleGroups[S];
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				let i = 0;
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Struggle"); return true;} i++;
				if (!sg.blocked) {
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && sg.lock != "Jammed") {KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove"); return true;} i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "")
					{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Pick"); return true;} i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0)
					{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Cut"); return true;} i++;}
				}
			}
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(925, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "Inventory") {
		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleInventory();
	} else if (KinkyDungeonDrawState == "Lore") {
		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleLore();
	}

	return false;
}

function KinkyDungeonUpdateStruggleGroups() {
	let struggleGroups = KinkyDungeonStruggleGroupsBase;
	KinkyDungeonStruggleGroups = [];

	for (let S = 0; S < struggleGroups.length; S++) {
		let sg = struggleGroups[S];
		let Group = sg;
		if (sg == "ItemM") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) Group = "ItemMouth3";
			else if (InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) Group = "ItemMouth2";
			else Group = "ItemMouth";
		}

		let restraint = KinkyDungeonGetRestraintItem(Group);

		if (restraint) {
			KinkyDungeonStruggleGroups.push({group:Group, left: S % 2 == 0, y: Math.floor(S/2), icon:sg, name:(restraint.restraint) ? restraint.restraint.name : "", lock:restraint.lock, blocked: InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, Group)});
		}
	}
}
