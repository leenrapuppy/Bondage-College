"use strict";
/* eslint-disable no-redeclare */
/**
 * A list of points that can be interacted in the UI.
 *
 * @type {[X: number, Y: number][]}
 */
var ControllerActiveAreas = [];

/** Number of detected controllers */
var ControllerDetectedCount = 0;

var ControllerButtonsRepeat = true;

var ControllerA = 1;
var ControllerB = 0;
var ControllerX = 3;
var ControllerY = 2;
var ControllerTriggerRight = 6;
var ControllerTriggerLeft = 7;
var ControllerStickUpDown = 1;
var ControllerStickLeftRight = 0;
var ControllerStickRight = 1;
var ControllerStickDown = 1;
var ControllerDPadUp = 4;
var ControllerDPadDown = 5;
var ControllerDPadLeft = 6;
var ControllerDPadRight = 7;

var Calibrating = false;
var ControllerStick = false;
var waitasec = false;
var ControllerSensitivity = 5;
/** @type {number[]} */
var ControllerIgnoreStick = [];
var ControllerDeadZone = 0.01;
/** @type {Record<string, boolean>} */
var ControllerGameActiveButttons = {};

/**
 * Register the gamepad connection/disconnection events.
 */
function ControllerStart() {
	if (!ControllerIsEnabled()) return;

	window.addEventListener('gamepadconnected', (event) => {
		console.log("gamepadconnected", event);
		ControllerDetectedCount++;
	});

	window.addEventListener("gamepaddisconnected", (event) => {
		console.log("gamepaddisconnected", event);
		ControllerDetectedCount--;
		if (ControllerDetectedCount < 0) ControllerDetectedCount = 0;
	});
}

/**
 * Check whether controller support is enabled.
 *
 * Uses the Player's configuration, with a workaround to allow
 * the controller to activate on login.
 */
function ControllerIsEnabled() {
	if (!Player || !Player.ControllerSettings) return true;

	return Player.ControllerSettings.ControllerActive;
}

/**
 * Check whether we have detected a gamepad.
 */
function ControllerIsActive() {
	return ControllerIsEnabled() && ControllerDetectedCount > 0;
}

/**
 * Main gamepad processing.
 *
 * This functions goes over gamepads and collects their inputs.
 */
function ControllerProcess() {
	if (!ControllerIsEnabled() || !ControllerIsActive()) return;

	// Loop through all gamepads, which seems odd but the one I
	// have at hand registers as two controllers and the buttons
	// are literally everywhere.
	// If you need a nice test bed, https://gamepad-tester.com/ has
	// a nice button viewer.
	for (const gamepad of navigator.getGamepads()) {
		if (!gamepad) continue;
		ControllerButton(gamepad.buttons);
		ControllerAxis(gamepad.axes);
	}
}

/**
 * Adds a point to the active points list.
 *
 * @param {number} X - The X coordinate of the point
 * @param {number} Y - The Y coordinate of the point
 */
function ControllerAddActiveArea(X, Y) {
	if (!ControllerIsActive()) return;

	// Skip coordinates out-of-bound from the canvas. Happens because we're
	// piggy-backing on the drawing, and sometimes it does that.
	if (X < 0 || X > 2000 || Y < 0 || Y > 1000) return;

	X += 10;
	Y += 10;
	if (!ControllerActiveAreas.some(([x, y]) => x === X && y === Y)) {
		ControllerActiveAreas.push([X, Y]);
	}
}

/**
 * Removes all active points.
 */
function ControllerClearAreas() {
	ControllerActiveAreas = [];
}

/**
 * handles the sitck input
 * @param {readonly number[]} axes the raw data of all axes of the controller
 */
function ControllerAxis(axes) {

	// Bondage Brawls handles it's own controls
	if ((CurrentScreen == "Platform") || (CurrentScreen == "PlatformDialog")) return;

	//if a value is over 1, it is from a d-pad (some d-pads register as buttons, some d-pads register like this)
	var g = 0;
	while (g < axes.length) {
		if (Math.abs(axes[g]) > 1 && ControllerIgnoreStick.includes(g) == false) {
			ControllerIgnoreStick.push(g);
		}
		g += 1;
	}
	if (Calibrating == false) {
		var g = 0;
		while (g < axes.length && ControllerStick == false) {
			if (Math.abs(axes[g]) > 0.1 && ControllerIgnoreStick.includes(g) == false) {
				ControllerStick = true;
			}
			g += 1;
		}
		if (ControllerStick == true) {
			if (Math.abs(axes[ControllerStickUpDown]) > ControllerDeadZone) {
				MouseY += axes[ControllerStickUpDown] * ControllerStickDown * ControllerSensitivity;
			}
			if (Math.abs(axes[ControllerStickLeftRight]) > ControllerDeadZone) {
				MouseX += axes[ControllerStickLeftRight] * ControllerStickRight * ControllerSensitivity;
			}
			if (MouseX < 0) {
				MouseX = 0;
			}
			if (MouseX > 2000) {
				MouseX = 2000;
			}
			if (MouseY < 0) {
				MouseY = 0;
			}
			if (MouseY > 1000) {
				MouseY = 1000;
			}

		}
	}
	if (Calibrating == true) {
		if (PreferenceCalibrationStage == 101) {
			var g = 0;
			var f = false;
			while (g < axes.length && f == false) {
				if (Math.abs(axes[g]) > 0.8 && ControllerIgnoreStick.includes(g) == false) {
					ControllerStickUpDown = g;
					Player.ControllerSettings.ControllerStickUpDown = g;
					if (axes[g] > 0) {
						ControllerStickDown = -1;
						Player.ControllerSettings.ControllerStickDown = -1;
					}
					if (axes[g] < 0) {
						ControllerStickDown = 1;
						Player.ControllerSettings.ControllerStickDown = 1;
					}
					waitasec = true;
					PreferenceCalibrationStage = 102;
					f = true;
				}
				g += 1;
			}
		}
		if (PreferenceCalibrationStage == 102) {
			if (waitasec == true) {
				var g = 0;
				var f = false;
				while (g < axes.length) {
					if (Math.abs(axes[g]) > 0.1 && ControllerIgnoreStick.includes(g) == false) {
						f = true;
					}
					g += 1;
				}
				if (f == false) {
					waitasec = false;
				}
			}
			if (waitasec == false) {
				var g = 0;
				var f = false;
				while (g < axes.length && f == false) {
					if (Math.abs(axes[g]) > 0.8 && ControllerIgnoreStick.includes(g) == false) {
						ControllerStickLeftRight = g;
						Player.ControllerSettings.ControllerStickLeftRight = g;
						if (axes[g] > 0) {
							ControllerStickRight = 1;
							Player.ControllerSettings.ControllerStickRight = 1;
						}
						if (axes[g] < 0) {
							ControllerStickRight = -1;
							Player.ControllerSettings.ControllerStickRight = -1;
						}
						PreferenceCalibrationStage = 0;
						Calibrating = false;
						f = true;
					}
					g += 1;
				}
			}
		}
	}
}

/**
 * Returns TRUE if current screen is a game that handles the controller, sends the input to that screen
 * @param {any} Buttons - The raw button data
 * @return {boolean}
 */
function ControllerManagedByGame(Buttons) {

	// Make sure the active buttons are valid
	if (ControllerGameActiveButttons.A == null) ControllerGameActiveButttons.A = false;
	if (ControllerGameActiveButttons.B == null) ControllerGameActiveButttons.B = false;
	if (ControllerGameActiveButttons.X == null) ControllerGameActiveButttons.X = false;
	if (ControllerGameActiveButttons.Y == null) ControllerGameActiveButttons.Y = false;
	if (ControllerGameActiveButttons.DOWN == null) ControllerGameActiveButttons.DOWN = false;
	if (ControllerGameActiveButttons.UP == null) ControllerGameActiveButttons.UP = false;
	if (ControllerGameActiveButttons.LEFT == null) ControllerGameActiveButttons.LEFT = false;
	if (ControllerGameActiveButttons.RIGHT == null) ControllerGameActiveButttons.RIGHT = false;

	// If the screen manages the controller, we call it
	let Managed = false;
	if (CurrentScreen == "PlatformDialog") Managed = PlatformDialogController(Buttons);
	if (CurrentScreen == "Platform") Managed = PlatformController(Buttons);

	// If managed, we flag the active buttons not to repeat them
	if (Managed == true) {
		ControllerGameActiveButttons.A = Buttons[ControllerA].pressed;
		ControllerGameActiveButttons.B = Buttons[ControllerB].pressed;
		ControllerGameActiveButttons.X = Buttons[ControllerX].pressed;
		ControllerGameActiveButttons.Y = Buttons[ControllerY].pressed;
		ControllerGameActiveButttons.TLEFT = Buttons[ControllerTriggerLeft].pressed;
		ControllerGameActiveButttons.TRIGHT = Buttons[ControllerTriggerRight].pressed;
		ControllerGameActiveButttons.DOWN = Buttons[ControllerDPadDown].pressed;
		ControllerGameActiveButttons.UP = Buttons[ControllerDPadUp].pressed;
		ControllerGameActiveButttons.LEFT = Buttons[ControllerDPadLeft].pressed;
		ControllerGameActiveButttons.RIGHT = Buttons[ControllerDPadRight].pressed;
	}

	// TRUE if the screen managed the controller
	return Managed;

}

/**
 * handles button input
 * @param {readonly GamepadButton[]} buttons raw buttons data
 */
function ControllerButton(buttons) {
	//makes sure that no value is undefined
	if (buttons[ControllerA] == undefined) {
		ControllerA = 1;
	}
	if (buttons[ControllerB] == undefined) {
		ControllerB = 0;
	}
	if (buttons[ControllerX] == undefined) {
		ControllerX = 3;
	}
	if (buttons[ControllerY] == undefined) {
		ControllerY = 2;
	}
	if (buttons[ControllerStickUpDown] == undefined) {
		ControllerStickUpDown = 1;
	}
	if (buttons[ControllerStickLeftRight] == undefined) {
		ControllerStickLeftRight = 0;
	}
	if (buttons[ControllerStickRight] == undefined) {
		ControllerStickRight = 1;
	}
	if (buttons[ControllerStickDown] == undefined) {
		ControllerStickDown = 1;
	}
	if (buttons[ControllerDPadUp] == undefined) {
		ControllerDPadUp = 4;
	}
	if (buttons[ControllerDPadDown] == undefined) {
		ControllerDPadDown = 5;
	}
	if (buttons[ControllerDPadLeft] == undefined) {
		ControllerDPadLeft = 6;
	}
	if (buttons[ControllerDPadRight] == undefined) {
		ControllerDPadRight = 7;
	}

	// If a game intercepts the controller inputs
	if (ControllerManagedByGame(buttons)) return;

	if (ControllerButtonsRepeat == false) {
		if (Calibrating == false) {
			if (buttons[ControllerA].pressed == true) {
				ControllerClick();
				ControllerButtonsRepeat = true;
			}

			if (buttons[ControllerB].pressed == true) {
				if (CurrentScreenFunctions.Exit) {
					CurrentScreenFunctions.Exit();
				} else if (CurrentCharacter != null) {
					DialogMenuBack();
				} else if ((CurrentCharacter == null) && (CurrentScreen == "ChatRoom") && (document.getElementById("TextAreaChatLog") != null)) {
					ElementScrollToEnd("TextAreaChatLog");
				}
				ControllerButtonsRepeat = true;
			}

			if (buttons[ControllerX].pressed == true) {
				KeyPress = 65;
				StruggleKeyDown();
				ControllerButtonsRepeat = true;
			}

			if (buttons[ControllerY].pressed == true) {
				KeyPress = 97;
				StruggleKeyDown();
				ControllerButtonsRepeat = true;
			}

			if (buttons[ControllerDPadUp].pressed == true) {
				ControllerStick = true;
				ControllerMoveToActiveZone("Up");
				ControllerButtonsRepeat = true;
			}
			if (buttons[ControllerDPadDown].pressed == true) {
				ControllerStick = true;
				ControllerMoveToActiveZone("Down");
				ControllerButtonsRepeat = true;
			}
			if (buttons[ControllerDPadLeft].pressed == true) {
				ControllerStick = true;
				ControllerMoveToActiveZone("Left");
				ControllerButtonsRepeat = true;
			}
			if (buttons[ControllerDPadRight].pressed == true) {
				ControllerStick = true;
				ControllerMoveToActiveZone("Right");
				ControllerButtonsRepeat = true;
			}
		}
		if (ControllerButtonsRepeat == false) {
			if (Calibrating == true) {
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 1) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerA = g;
								Player.ControllerSettings.ControllerA = g;
								h = true;
								PreferenceCalibrationStage = 2;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}

				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 2) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerB = g;
								Player.ControllerSettings.ControllerB = g;
								h = true;
								PreferenceCalibrationStage = 3;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 3) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerX = g;
								Player.ControllerSettings.ControllerX = g;
								h = true;
								PreferenceCalibrationStage = 4;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 4) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerY = g;
								Player.ControllerSettings.ControllerY = g;
								h = true;
								PreferenceCalibrationStage = 5;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 5) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerDPadUp = g;
								Player.ControllerSettings.ControllerDPadUp = g;
								h = true;
								PreferenceCalibrationStage = 6;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 6) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerDPadDown = g;
								Player.ControllerSettings.ControllerDPadDown = g;
								h = true;
								PreferenceCalibrationStage = 7;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 7) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerDPadLeft = g;
								Player.ControllerSettings.ControllerDPadLeft = g;
								h = true;
								PreferenceCalibrationStage = 8;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
				if (ControllerButtonsRepeat == false) {
					if (PreferenceCalibrationStage == 8) {
						var g = 0;
						var h = false;
						while (g < buttons.length && h == false) {
							if (buttons[g].pressed == true) {
								ControllerDPadRight = g;
								Player.ControllerSettings.ControllerDPadRight = g;
								h = true;
								PreferenceCalibrationStage = 0;
								Calibrating = false;
								ControllerButtonsRepeat = true;
							}
							g += 1;
						}
					}
				}
			}
		}
	}


	if (ControllerButtonsRepeat == true) {
		var g = 0;
		var h = false;
		while (g < buttons.length && h == false) {
			if (buttons[g].pressed == true) {
				h = true;
			}
			g += 1;
		}
		if (h == false) {
			ControllerButtonsRepeat = false;
		}
	}
}

//uncomment to test it with keyboard
/**
 * handles keyboard inputs in controller mode
 * @returns {void} Nothing
 */
function ControllerSupportKeyDown() {
	/*i*///    if (KeyPress == 105) ControllerMoveToActiveZone("Up");
	/*k*///    if (KeyPress == 107) ControllerMoveToActiveZone("Down");
	/*j*///    if (KeyPress == 106) ControllerMoveToActiveZone("Left");
	/*l*///    if (KeyPress == 108) ControllerMoveToActiveZone("Right");
	/*space*///if (KeyPress == 32) ControllerClick();
}

/**
 * A -> Click
 */
function ControllerClick() {
	if (!ControllerIsActive() || !ControllerStick) return;

	// Trigger a fake click event
	CommonClick(null);
}

/**
 * Finds the closest point in a list, favoring the given direction.
 *
 * Used to navigate the active zones with a controller.
 *
 * @param {[X: number, Y: number]} point
 * @param {[X: number, Y: number][]} points
 * @param {"Up"|"Down"|"Left"|"Right"} direction
 */
function ControllerFindClosestPoint(point, points, direction) {
	console.log("finding point: ", point, "closest to", ...points.map(([x, y]) => `(${x}, ${y})`));
	const [X, Y] = point;

	// Filter points in the opposite direction we're searching, then map the remainder in 2d-space using good old Pythagoras
	points = points.filter(([x, y]) => direction === "Up" && y < Y || direction === "Down" && y > Y || direction === "Left" && x < X || direction === "Right" && x > X);
	console.log("filtered: ", ...points.map(([x, y]) => `(${x}, ${y})`));

	let candidates = points.map(([x, y]) => [x, y, Math.sqrt((x - X) ** 2 + (y - Y) ** 2)]); // XXX: not enough. Might need a bit of trig too to find the closest, most in-line point
	console.log("candidates: ", ...candidates.map(([x, y, dist]) => `(${x}, ${y}, ${dist})`));

	candidates = candidates.sort(([ax, ay, adist], [bx, by, bdist]) => adist - bdist);
	console.log("sorted: ", ...candidates.map(([x, y, dist]) => `(${x}, ${y}, ${dist})`));

	if (!candidates[0]) return null;

	return [candidates[0][0], candidates[0][1]];
}

/**
 * Moves the pointer throught the active zones in the direction wanted.
 *
 * @param {"Up"|"Down"|"Left"|"Right"} direction
 */
function ControllerMoveToActiveZone(direction) {
	// No active points right now, bail as there's nothing to navigate
	if (ControllerActiveAreas.length === 0) return;

	// Filter out our current location so we don't jump to it
	const points = ControllerActiveAreas.filter(([x, y]) => !(x === MouseX && y === MouseY));
	console.log("filtered areas: ", points.map(([x, y]) => `(${x}, ${y})`).join(", "));

	const dest = ControllerFindClosestPoint([MouseX, MouseY], points, direction);
	if (!dest) return;

	MouseX = dest[0];
	MouseY = dest[1];
}
