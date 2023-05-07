"use strict";

/** BC's version */
var GameVersion = "R91";

const GameVersionFormat = /^R([0-9]+)(?:(Alpha|Beta)([0-9]+)?)?$/;

var CommonVersionUpdated = false;

/** @type {TouchList | null} */
var CommonTouchList = null;

function GameStart() {
	ServerURL = CommonGetServer();
	//CheatImport();
	console.log("Version: " + GameVersion + ", Server: " + ServerURL);
	if (!GameVersionFormat.test(GameVersion)) console.error("GameVersion is not valid!");

	CurrentTime = CommonTime();

	CommonIsMobile = CommonDetectMobile();
	TranslationLoad();
	DrawLoad();
	AssetLoadAll();
	CommandsLoad();
	ControllerStart();
	CommonSetScreen("Character", "Login");
	ServerInit();

	document.addEventListener("keydown", DocumentKeyDown);

	const canvas = document.getElementById("MainCanvas");
	canvas.tabIndex = 1000;

	canvas.addEventListener("keypress", GameKeyDown);

	canvas.addEventListener("click", MouseClick);
	canvas.addEventListener("mousemove", MouseMove);
	canvas.addEventListener("mouseleave", MouseLeave);

	canvas.addEventListener("touchstart", TouchStart);
	canvas.addEventListener("touchmove", TouchMove);
	canvas.addEventListener("touchend", TouchEnd);

	requestAnimationFrame(GameRun);
}

// When the code is loaded, we start the game engine
window.addEventListener("load", GameStart);

/**
 * Main game running state, runs the drawing
 * @param {number} Timestamp
 */
function GameRun(Timestamp) {

	// Increments the time from the last frame
	TimerRunInterval = Timestamp - TimerLastTime;
	TimerLastTime = Timestamp;
	CurrentTime = CurrentTime + TimerRunInterval;

	DrawProcess(Timestamp);
	TimerProcess();

	requestAnimationFrame(MainRun);
}

/**
 * When the user presses a key, we send the KeyDown event to the current screen if it can accept it
 * @param {KeyboardEvent} event
 */
function GameKeyDown(event) {
	if (event.repeat) return;
	KeyPress = event.keyCode || event.which;
	CommonKeyDown(event);
}

/**
 * Handler for document-wide keydown event
 * @param {KeyboardEvent} event
 */
function DocumentKeyDown(event) {
	if (event.repeat) return;
	if (event.key == "Escape") {
		if (CurrentScreenFunctions.Exit) {
			CurrentScreenFunctions.Exit();
		} else if ((CurrentCharacter != null) && Array.isArray(DialogMenuButton) && (DialogMenuButton.indexOf("Exit") >= 0)) {
			if (!DialogLeaveFocusItem())
				DialogLeaveItemMenu();
		} else if ((CurrentCharacter != null) && (CurrentScreen == "ChatRoom")) {
			DialogLeave();
		} else if ((CurrentCharacter == null) && (CurrentScreen == "ChatRoom") && (document.getElementById("TextAreaChatLog") != null)) {
			ElementScrollToEnd("TextAreaChatLog");
		}
	} else if (event.key == "Tab") {
		GameKeyDown(event);
	}
}

/**
 * When mouse move, we keep the mouse position for other scripts
 * @param {MouseEvent} event
 */
function MouseMove(event) {
	MouseX = Math.round(event.offsetX * 2000 / MainCanvas.canvas.clientWidth);
	MouseY = Math.round(event.offsetY * 1000 / MainCanvas.canvas.clientHeight);
}

/**
 * When the user clicks, we fire the click event for other screens
 * @param {MouseEvent} event
 */
function MouseClick(event) {
	if (!CommonIsMobile) {
		MouseMove(event);
		CommonClick(event);
	}
}

/**
 * When the user touches the screen (mobile only), we fire the click event for other screens
 * @param {TouchEvent} event
 */
function TouchStart(event) {
	if (!CommonIsMobile) return;
	TouchMove(event);
	CommonClick(event);
	CommonTouchList = event.touches;
}

/**
 * When the user touches the screen (mobile only), we fire the click event for other screens
 * @param {TouchEvent} event
 */
function TouchEnd(event) {
	if (!CommonIsMobile) return;
	CommonTouchList = event.touches;
}

/**
 * When touch moves, we keep it's position for other scripts
 * @param {TouchEvent} event
 */
function TouchMove(event) {
	if (!CommonIsMobile) return;
	const touch = event.changedTouches[0];
	MouseX = Math.round((touch.clientX - MainCanvas.canvas.offsetLeft) * 2000 / MainCanvas.canvas.clientWidth);
	MouseY = Math.round((touch.clientY - MainCanvas.canvas.offsetTop) * 1000 / MainCanvas.canvas.clientHeight);
}

/**
 * When the mouse is away from the control, we stop keeping the coordinates,
 * we also check for false positives with "relatedTarget"
 * @param {MouseEvent} event
 */
function MouseLeave(event) {
	if (event.relatedTarget) {
		MouseX = -1;
		MouseY = -1;
	}
}

/** @deprecated */
function KeyDown(event) { GameKeyDown(event); }
/** @deprecated */
function MainRun(Timestamp) { GameRun(Timestamp); }
/** @deprecated */
function Click(event) { MouseClick(event); }
/** @deprecated */
function LoseFocus(event) { MouseLeave(event); }
