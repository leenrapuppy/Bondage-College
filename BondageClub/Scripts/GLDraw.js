"use strict";

/** @type {Map<string, HTMLImageElement>} */
var GLDrawImageCache = new Map();

var GLDrawCacheLoadedImages = 0;
var GLDrawCacheTotalImages = 0;

/** @type {"webgl2"|"webgl"|"No WebGL"} */
var GLVersion;

/** @type {HTMLCanvasElement} */
var GLDrawCanvas;

/**
 * How many seconds to wait before forcefully resetting the canvas after a
 * context loss
 */
const GLDrawContextResetSeconds = 10;
/**
 * The cooldown in seconds after resetting the canvas. If another context loss
 * happens in this cooldown, we'll revert to canvas2d rendering
 */
const GLDrawRevertToDraw2DSeconds = 50;

/** @type {ReturnType<typeof setTimeout>} */
let GLDrawContextLostTimeout;
let GLDrawRecoveryMode = false;
/** @type {ReturnType<typeof setTimeout>} */
let GLDrawCrashTimeout;

var GLDrawAlphaThreshold = 0.01;
var GLDrawHalfAlphaLow = 0.8 / 256.0;
var GLDrawHalfAlphaHigh = 1.2 / 256.0;

window.addEventListener('load', GLDrawLoad);

/**
 * Setup WebGL rendering
 *
 * This will create a drawing canvas and try to initialize it for GL rendering.
 * In case of failure, or if the fallback is required, it will disable GL
 * rendering entirely, switching back to the normal canvas-based rendering
 * (see Drawing.js).
 *
 * @param {Event} _evt - Unused DOM event
 * @param {boolean} [force2d] - Whether to force a fallback to 2d mode
 * @returns {void} - Nothing
 */
function GLDrawLoad(_evt, force2d = false) {
	GLDrawCanvas = document.createElement("canvas");
	GLDrawCanvas.width = 1000;
	GLDrawCanvas.height = CanvasDrawHeight;

	// Find a GL version that works
	const glOpts = GLDrawGetOptions();
	let gl = null;
	for (const glVersion of ["webgl2", "webgl"]) {
		gl = GLDrawCanvas.getContext(glVersion, glOpts);
		if (gl) {
			// Found, save the version
			/* @ts-ignore */
			GLVersion = glVersion;
			break;
		}
	}
	if (!gl || force2d) {
		if (force2d) {
			console.error('WebGL: forcing fallback to 2D renderer');
		} else {
			console.error('WebGL: failed to initialize canvas');
		}
		GLVersion = "No WebGL";
		GLDrawCanvas.remove();
		GLDrawCanvas = null;
		return;
	}
	console.info(`WebGL: initialized as ${GLVersion}`);
	/* @ts-ignore */
	GLDrawCanvas.GL = gl;
	GLDrawMakeGLProgram(GLDrawCanvas.GL);
	GLDrawClearRect(GLDrawCanvas.GL, 0, 0, 1000, CanvasDrawHeight, 0);

	// Attach context listeners
	GLDrawCanvas.addEventListener("webglcontextlost", GLDrawOnContextLost, false);
	GLDrawCanvas.addEventListener("webglcontextrestored", GLDrawOnContextRestored, false);
}

/**
 * Loads the graphical options from localSstorage.
 * @returns {WebGLContextAttributes} - WebGL context attributes based on saved settings
 */
function GLDrawGetOptions() {
	let antialias = true;
	/** @type {WebGLPowerPreference} */
	let powerPreference = "default";

	if (localStorage.getItem("GLDraw-antialiasOff")) antialias = false;
	let savedPowerMode = localStorage.getItem("GLDraw-powerPreference");
	if (savedPowerMode && (savedPowerMode == "high-performance" || savedPowerMode == "low-power")) {
		powerPreference = savedPowerMode;
	}

	return { antialias, powerPreference };
}


/**
 * Saves the graphical options in localStorage.
 * @param {WebGLContextAttributes} options - WebGL context attributes based on saved settings
 */
function GLDrawSetOptions(options) {
	if (options.antialias) {
		localStorage.removeItem("GLDraw-antialiasOff");
	} else {
		localStorage.setItem("GLDraw-antialiasOff", "true");
	}
	if (["default", "high-performance", "low-power"].includes(options.powerPreference))
		localStorage.setItem("GLDraw-powerPreference", options.powerPreference);
}

/**
 * Handler for WebGL context lost events
 * @param {WebGLContextEvent} event
 * @returns {void} - Nothing
 */
function GLDrawOnContextLost(event) {
	event.preventDefault();
	console.log("WebGL Drawing disabled: Context Lost. If the context does not restore itself, refresh your page.");

	if (GLDrawRecoveryMode) {
		// If the context has been lost again whilst in crash cooldown, revert to canvas2d drawing
		return GLDrawRevertToCanvas2D();
	}

	GLDrawContextLostTimeout = setTimeout(() => {
		// If the context has not been automatically restored after
		console.log(`Context not restored after ${GLDrawContextResetSeconds} seconds... resetting canvas.`);
		GLDrawResetCanvas();

		// After forcefully resetting the canvas, we're in crash cooldown mode
		GLDrawRecoveryMode = true;
		GLDrawCrashTimeout = setTimeout(() => GLDrawRecoveryMode = false, GLDrawRevertToDraw2DSeconds * 1000);
	}, GLDrawContextResetSeconds * 1000);
}

/**
 * Disables GLDraw rendering, and cleans up any resources.
 * @returns {void} - Nothing
 */
function GLDrawRevertToCanvas2D() {
	const seconds = GLDrawContextResetSeconds + GLDrawRevertToDraw2DSeconds;
	console.log(`WebGL context lost twice within ${seconds} seconds - reverting to canvas2D rendering`);
	clearTimeout(GLDrawCrashTimeout);
	GLDrawResetCanvas(true);
}

/**
 * Handler for WebGL context restored events
 * @returns {void} - Nothing
 */
function GLDrawOnContextRestored() {
	console.log("WebGL: Context restored.");
	clearTimeout(GLDrawContextLostTimeout);
	GLDrawResetCanvas();
}

/**
 * Resets the GLDraw renderer
 *
 * This function removes the current canvas, removes cached textures from the
 * image cache, and reloads a fresh canvas unless prevented.
 * @returns {void} - Nothing
 */
function GLDrawResetCanvas(force2d = false) {
	console.info("WebGL: resetting canvas");
	// Cleanup resources and canvas
	GLDrawCanvas.remove();
	GLDrawImageCache.clear();
	GLDrawCanvas = null;

	// Reload canvas, possibly falling back to 2d mode
	GLDrawLoad(null, force2d);
	GLDrawRebuildCharacters();
}

/**
 * Rebuilds the canvas for any characters that are currently on screen.
 * @returns {void} - Nothing
 */
function GLDrawRebuildCharacters() {
	for (const C of DrawLastCharacters) {
		CharacterAppearanceBuildCanvas(C);
	}
}

/**
 * Makes all programs and shaders on the GL context
 * @param {WebGL2RenderingContext} gl - The WebGL context of the canvas
 * @returns {void} - Nothing
 */
function GLDrawMakeGLProgram(gl) {
	const vertexShader = GLDrawCreateShader(gl, GLDrawVertexShaderSource, gl.VERTEX_SHADER);
	const fragmentShader = GLDrawCreateShader(gl, GLDrawFragmentShaderSource, gl.FRAGMENT_SHADER);
	const fragmentShaderFullAlpha = GLDrawCreateShader(gl, GLDrawFragmentShaderSourceFullAlpha, gl.FRAGMENT_SHADER);
	const fragmentShaderHalfAlpha = GLDrawCreateShader(gl, GLDrawFragmentShaderSourceHalfAlpha, gl.FRAGMENT_SHADER);
	const fragmentShaderTexMask = GLDrawCreateShader(gl, GLDrawFragmentShaderSourceTexMask, gl.FRAGMENT_SHADER);

	gl.program = GLDrawCreateProgram(gl, vertexShader, fragmentShader);
	gl.programFull = GLDrawCreateProgram(gl, vertexShader, fragmentShaderFullAlpha);
	gl.programHalf = GLDrawCreateProgram(gl, vertexShader, fragmentShaderHalfAlpha);
	gl.programTexMask = GLDrawCreateProgram(gl, vertexShader, fragmentShaderTexMask);

	gl.program.u_alpha = gl.getUniformLocation(gl.program, "u_alpha");
	gl.programFull.u_color = gl.getUniformLocation(gl.programFull, "u_color");
	gl.programHalf.u_color = gl.getUniformLocation(gl.programHalf, "u_color");

	gl.textureCache = new Map();
	gl.maskCache = new Map();
}

/**
 * Source used for the Vertex Shader
 * @constant
 * @type {string}
 */
var GLDrawVertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  uniform mat4 u_matrix;

  varying vec2 v_texcoord;

  void main() {
     gl_Position = u_matrix * a_position;
     v_texcoord = a_texcoord;
  }
`;

/**
 * Source used for the Fragment Shader
 * @constant
 * @type {string}
 */
var GLDrawFragmentShaderSource = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;
  uniform sampler2D u_alpha_texture;
  uniform float u_alpha;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    vec4 alphaColor = texture2D(u_alpha_texture, v_texcoord);
    if (texColor.w < ` + GLDrawAlphaThreshold + `) discard;
    if (alphaColor.w < ` + GLDrawAlphaThreshold + `) discard;
    gl_FragColor = texColor;
    gl_FragColor.a *= u_alpha;
  }
`;

/**
 * Source used for the Texture Mask Fragment Shader
 * @constant
 * @type {string}
 */
var GLDrawFragmentShaderSourceTexMask = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    gl_FragColor = texColor;
  }
`;

/**
 * Source used for the Full Alpha Shader
 * @constant
 * @type {string}
 */
var GLDrawFragmentShaderSourceFullAlpha = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;
  uniform sampler2D u_alpha_texture;
  uniform vec4 u_color;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    vec4 alphaColor = texture2D(u_alpha_texture, v_texcoord);
    if (texColor.w < ` + GLDrawAlphaThreshold + `) discard;
    if (alphaColor.w < ` + GLDrawAlphaThreshold + `) discard;
    float t = (texColor.x + texColor.y + texColor.z) / 383.0;
    gl_FragColor = u_color * vec4(t, t, t, texColor.w);
  }
`;

/**
 * Source used for the Half Alpha Shader
 * @constant
 * @type {string}
 */
var GLDrawFragmentShaderSourceHalfAlpha = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;
  uniform sampler2D u_alpha_texture;
  uniform vec4 u_color;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    vec4 alphaColor = texture2D(u_alpha_texture, v_texcoord);
    if (texColor.w < ` + GLDrawAlphaThreshold + `) discard;
    if (alphaColor.w < ` + GLDrawAlphaThreshold + `) discard;
    float t = (texColor.x + texColor.y + texColor.z) / 383.0;
    if (t < ` + GLDrawHalfAlphaLow + ` || t > ` + GLDrawHalfAlphaHigh + `) {
      gl_FragColor = texColor;
    } else {
      gl_FragColor = u_color * vec4(t, t, t, texColor.w);
    }
  }
`;

/**
 * Creates a shader for the current WebGL context from a given source
 * @param {WebGL2RenderingContext} gl - WebGL context
 * @param {string} source - Source of the shader to create
 * @param {GLenum} type - The type of the shader to create
 * @returns {WebGLShader} - The created WebGL shader
 */
function GLDrawCreateShader(gl, source, type) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error('Could not compile WebGL program. \n\n' + gl.getShaderInfoLog(shader));
	}
	return shader;
}

/**
 * Creates the WebGL program from the vertex and fragment shaders
 * @param {WebGL2RenderingContext} gl - WebGL context
 * @param {WebGLShader} vertexShader - The vertex shader to create the program with
 * @param {WebGLShader} fragmentShader - The fragment shader to create the program with
 * @returns {WebGLProgram} - The created WebGL program
 */
function GLDrawCreateProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error('Could not compile WebGL program. \n\n' + gl.getProgramInfoLog(program));
	}

	program.a_position = gl.getAttribLocation(program, "a_position");
	program.a_texcoord = gl.getAttribLocation(program, "a_texcoord");

	program.u_matrix = gl.getUniformLocation(program, "u_matrix");
	program.u_texture = gl.getUniformLocation(program, "u_texture");
	program.u_alpha_texture = gl.getUniformLocation(program, "u_alpha_texture");

	program.position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, program.position_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,]), gl.STATIC_DRAW);

	program.texcoord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, program.texcoord_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,]), gl.STATIC_DRAW);

	return program;
}

/**
 * Draws an image from a given url to a WebGLRenderingContext
 * @param {string} url - URL of the image to render
 * @param {WebGL2RenderingContext} gl - WebGL context
 * @param {number} dstX - Position of the image on the X axis
 * @param {number} dstY - Position of the image on the Y axis
 * @param {number} offsetX - Additional offset to add to the X axis (for blinking)
 * @param {string} color - Color of the image to draw
 * @param {boolean} fullAlpha - Whether or not the full alpha should be rendered
 * @param {RectTuple[]} alphaMasks - A list of alpha masks to apply to the asset
 * @param {number} [opacity=1] - The opacity at which to draw the image
 * @param {boolean} [rotate=false] - If the image should be rotated by 180 degrees
 * @param {GlobalCompositeOperation} [blendingMode="source-over"] - blending mode for drawing the image
 * @returns {void} - Nothing
 */
function GLDrawImage(url, gl, dstX, dstY, offsetX, color, fullAlpha, alphaMasks, opacity, rotate = false, blendingMode = "source-over") {
	offsetX = offsetX || 0;
	opacity = typeof opacity === "number" ? opacity : 1;
	const tex = GLDrawLoadImage(gl, url);
	const mask = GLDrawLoadMask(gl, tex.width, tex.height, dstX, dstY, alphaMasks);
	if (rotate) dstX = 500 - dstX;
	const sign = rotate ? -1 : 1;

	const program = GLChooseProgram(gl, color, fullAlpha, blendingMode);

	gl.useProgram(program);

	gl.enable(gl.BLEND);
	switch (blendingMode) {
		case "source-atop":
			gl.blendFuncSeparate(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
			break;
		case "destination-over":
			gl.blendFuncSeparate(gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			break;
		case "destination-in":
			gl.blendFuncSeparate(gl.ZERO, gl.SRC_ALPHA, gl.DST_ALPHA, gl.SRC_ALPHA);
			break;
		default:
			gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			break;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, program.position_buffer);
	gl.enableVertexAttribArray(program.a_position);
	gl.vertexAttribPointer(program.a_position, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, program.texcoord_buffer);
	gl.enableVertexAttribArray(program.a_texcoord);
	gl.vertexAttribPointer(program.a_texcoord, 2, gl.FLOAT, false, 0, 0);

	let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
	matrix = m4.translate(matrix, dstX + offsetX, dstY, 0);
	matrix = m4.scale(matrix, sign * tex.width, sign * tex.height, 1);

	gl.uniformMatrix4fv(program.u_matrix, false, matrix);
	gl.uniform1i(program.u_texture, 0);
	gl.uniform1i(program.u_alpha_texture, 1);
	if (program.u_alpha != null) gl.uniform1f(program.u_alpha, opacity);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex.texture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, mask);

	if (program.u_color != null) gl.uniform4fv(program.u_color, GLDrawHexToRGBA(color, opacity));

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/**
 * Chooses right program using input parameters
 * @param {WebGL2RenderingContext} gl - WebGL context
 * @param {string} color - Color of the image to draw
 * @param {boolean} fullAlpha - Whether or not the full alpha should be rendered
 * @param {GlobalCompositeOperation} blendingMode - blending mode for drawing the image
 * @returns {WebGLProgram} - The chosen WebGL program
 */
function GLChooseProgram(gl, color, fullAlpha, blendingMode) {
	if (blendingMode == 'destination-in') {
		return gl.programTexMask;
	}
	if (color == null) {
		return gl.program;
	}

	if (fullAlpha) {
		return gl.programFull;
	} else {
		return gl.programHalf;
	}
}

/**
 * Draws a canvas on the WebGL canvas
 * @param {WebGL2RenderingContext} gl - WebGL context
 * @param {HTMLImageElement | HTMLCanvasElement} Img - Canvas to get the data of
 * @param {number} X - Position of the image on the X axis
 * @param {number} Y - Position of the image on the Y axis
 * @param {number} blinkOffset - Offset for the blink canvas
 * @param {RectTuple[]} alphaMasks - A list of alpha masks to apply to the asset
 */
function GLDraw2DCanvas(gl, Img, X, Y, blinkOffset, alphaMasks) {
	const TempCanvasName = Img.getAttribute("name");
	gl.textureCache.delete(TempCanvasName);
	GLDrawImageCache.set(TempCanvasName, /** @type {HTMLImageElement} */(Img));
	GLDrawImage(TempCanvasName, gl, X, Y, blinkOffset, null, null, alphaMasks);
}

/**
 * Sets texture info from image data
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {HTMLImageElement} Img - Image to get the data of
 * @param {{ width: number; height: number; texture: WebGLTexture; }} textureInfo - Texture information
 * @returns {void} - Nothing
 */
function GLDrawBingImageToTextureInfo(gl, Img, textureInfo) {
	textureInfo.width = Img.width;
	textureInfo.height = Img.height;
	gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Img);
}

/**
 * Loads image texture data
 * @param {WebGL2RenderingContext} gl - WebGL context
 * @param {string} url - URL of the image
 * @returns {{ width: number; height: number; texture: WebGLTexture; }} - The texture info of a given image
 */
function GLDrawLoadImage(gl, url) {

	let textureInfo = gl.textureCache.get(url);

	if (!textureInfo) {
		const tex = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, tex);
		/** @type { { width: number; height: number; texture: WebGLTexture; } } */
		textureInfo = { width: 1, height: 1, texture: tex, };
		gl.textureCache.set(url, textureInfo);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		let Img = GLDrawImageCache.get(url);

		if (Img) {
			GLDrawBingImageToTextureInfo(gl, Img, textureInfo);
		} else {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
			Img = new Image();
			GLDrawImageCache.set(url, Img);

			++GLDrawCacheTotalImages;
			Img.addEventListener('load', function () {
				GLDrawBingImageToTextureInfo(gl, Img, textureInfo);
				++GLDrawCacheLoadedImages;
				if (GLDrawCacheLoadedImages == GLDrawCacheTotalImages) { Player.MustDraw = true; CharacterLoadCanvasAll(); }
			});
			Img.addEventListener('error', function () {
				if (Img.errorcount == null) Img.errorcount = 0;
				Img.errorcount += 1;
				if (Img.errorcount < 3) {
					// eslint-disable-next-line no-self-assign
					Img.src = Img.src;
				} else {
					console.log("Error loading image " + Img.src);
					++GLDrawCacheLoadedImages;
					if (GLDrawCacheLoadedImages == GLDrawCacheTotalImages) CharacterLoadCanvasAll();
				}
			});
			Img.src = url;
		}
	}
	return textureInfo;
}

/**
 * Loads alpha mask data
 * @param {WebGL2RenderingContext} gl - The WebGL context
 * @param {number} texWidth - The width of the texture to mask
 * @param {number} texHeight - The height of the texture to mask
 * @param {number} offsetX - The X offset at which the texture is to be drawn on the target canvas
 * @param {number} offsetY - The Y offset at which the texture is to be drawn on the target canvas
 * @param {RectTuple[]} alphaMasks - A list of alpha masks to apply to the asset
 * @return {WebGLTexture} - The WebGL texture corresponding to the mask
 */
function GLDrawLoadMask(gl, texWidth, texHeight, offsetX, offsetY, alphaMasks) {
	alphaMasks = alphaMasks || [];
	const key = alphaMasks.length ? JSON.stringify([texWidth, texHeight, offsetX, offsetY, alphaMasks]) : null;
	let mask = gl.maskCache.get(key);

	if (!mask) {
		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = texWidth;
		tmpCanvas.height = texHeight;
		const ctx = tmpCanvas.getContext("2d");
		ctx.fillRect(0, 0, texWidth, texHeight);
		alphaMasks.forEach(([x, y, w, h]) => ctx.clearRect(x - offsetX, y - offsetY, w, h));

		mask = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, mask);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tmpCanvas);

		gl.maskCache.set(key, mask);
	}
	return mask;
}

/**
 * Clears a rectangle on WebGLRenderingContext
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} x - Position of the image on the X axis
 * @param {number} y - Position of the image on the Y axis
 * @param {number} width - Width of the rectangle to clear
 * @param {number} height - Height of the rectangle to clear
 * @param {number} blinkOffset - Offset in case of a blink draw
 * @returns {void} - Nothing
 */
function GLDrawClearRect(gl, x, y, width, height, blinkOffset) {
	gl.enable(gl.SCISSOR_TEST);
	gl.scissor(x + blinkOffset, y, width, height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.disable(gl.SCISSOR_TEST);
}

/**
 * Converts a hex color to a RGBA color
 * @param {string} color - Hex color code to convert to RGBA
 * @param {number} alpha - The alpha value to use for the resulting RGBA
 * @return {number[]} - Converted color code
 */
function GLDrawHexToRGBA(color, alpha = 1) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	color = color.replace(shorthandRegex, function (m, r, g, b) { return r + r + g + g + b + b; });
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha] : [0, 0, 0, alpha];
}

/**
 * Creates the given character canvas with WebGL
 * @param {Character} C - Character to build the canvas for
 * @returns {void} - Nothing
 */
function GLDrawAppearanceBuild(C) {
	const blinkOffset = 500;
	GLDrawClearRect(GLDrawCanvas.GL, 0, 0, 1000, CanvasDrawHeight, 0);
	CommonDrawCanvasPrepare(C);
	CommonDrawAppearanceBuild(C, {
		clearRect: (x, y, w, h) => GLDrawClearRect(GLDrawCanvas.GL, x, CanvasDrawHeight - y - h, w, h, 0),
		clearRectBlink: (x, y, w, h) => GLDrawClearRect(GLDrawCanvas.GL, x, CanvasDrawHeight - y - h, w, h, blinkOffset),
		drawImage: (src, x, y, alphaMasks, opacity, rotate, blendingMode) => GLDrawImage(src, GLDrawCanvas.GL, x, y, 0, null, null, alphaMasks, opacity, rotate, blendingMode),
		drawImageBlink: (src, x, y, alphaMasks, opacity, rotate, blendingMode) => GLDrawImage(src, GLDrawCanvas.GL, x, y, blinkOffset, null, null, alphaMasks, opacity, rotate, blendingMode),
		drawImageColorize: (src, x, y, color, fullAlpha, alphaMasks, opacity, rotate, blendingMode) => GLDrawImage(src, GLDrawCanvas.GL, x, y, 0, color, fullAlpha, alphaMasks, opacity, rotate, blendingMode),
		drawImageColorizeBlink: (src, x, y, color, fullAlpha, alphaMasks, opacity, rotate, blendingMode) => GLDrawImage(src, GLDrawCanvas.GL, x, y, blinkOffset, color, fullAlpha, alphaMasks, opacity, rotate, blendingMode),
		drawCanvas: (Img, x, y, alphaMasks) => GLDraw2DCanvas(GLDrawCanvas.GL, Img, x, y, 0, alphaMasks),
		drawCanvasBlink: (Img, x, y, alphaMasks) => GLDraw2DCanvas(GLDrawCanvas.GL, Img, x, y, blinkOffset, alphaMasks),
	});
	C.Canvas.getContext("2d").drawImage(GLDrawCanvas, 0, 0);
	C.CanvasBlink.getContext("2d").drawImage(GLDrawCanvas, -blinkOffset, 0);
}
