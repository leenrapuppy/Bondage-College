"use strict";

/**
 * What state is the image in.
 * @enum string
 */
const CachedImageState = {
	UNCACHED: 'uncached',
	LOADING: 'loading',
	LOADED: 'loaded',
	ERRORED: 'errored',
	FAILED: 'failed',
};

/**
 * A callback called when an image is loaded.
 * @typedef {function(CachedImage):void} ImageLoadCallback
 */

/**
 * Cached image data
 */
class CachedImage {
	/**
	 * Create a new cached image.
	 *
	 * @param {ImageCacheClass} cache - The cache holding the image
	 * @param {string} url - The URL for the image to cache
	 * @param {ImageLoadCallback} [loadCallback] - The function to call when the image loads
	 */
	constructor(cache, url, loadCallback = null) {
		/**
		 * Only used to inform the cache of loading progress
		 * @type ImageCacheClass
		 * @private
		 */
		this.cache = cache;
		/** @type string */
		this.url = url;
		/** @type CachedImageState */
		this.state = CachedImageState.UNCACHED;
		/** @type number */
		this.errorCount = 0;
		/** @type {function(CachedImage):void} */
		this.loadCallback = loadCallback;
		/** @type HTMLImageElement | HTMLCanvasElement */
		this.element = null;
		/** @type object */
		this.userData = {};
		/** @type number */
		this.lastUsed = null;
		/** @type boolean */
		this.manual = false;
	}

	/**
	 * Load the cached image if it's not already available
	 */
	load() {
		if ((this.state == CachedImageState.LOADING) || (this.state == CachedImageState.LOADED))
			return;

		// Get a new image element to perform the loading for us
		this.element = new Image();

		// Set up listeners to keep track of the loading process
		this.element.addEventListener("load", () => {
			this.errorCount = 0;
			this.state = CachedImageState.LOADED;
			this.cache._imageStateDidChange(this);
		});

		this.element.addEventListener("error", () => {
			this.errorCount += 1;
			this.state = CachedImageState.ERRORED;
			this.cache._imageStateDidChange(this);
		});

		// Start loading, reset error count
		this.errorCount = 0;
		this._refresh();
	}

	/**
	 * Manually set the cached image to the given element.
	 * @param {HTMLImageElement | HTMLCanvasElement} element - The element to set
	 */
	setElement(element) {
		this.element = element;
		this.errorCount = 0;
		this.userData = {};
		this.state = CachedImageState.LOADED;
		this.manual = true;
		this.cache._imageStateDidChange(this);
	}

	/**
	 * Refresh the given image.
	 */
	_refresh() {
		this.userData = {};
		if (this.element instanceof HTMLImageElement) {
			this.state = CachedImageState.LOADING;
			this.element.src = this.url;
		} else {
			// Canvas element, mark it as failed so the purge yanks it,
			// or it gets manually set by the drawing system.
			this.state = CachedImageState.FAILED;
			this.cache._imageStateDidChange(this);
		}
	}

	/**
	 * Is the image an asset image?
	 * @returns boolean
	 */
	isAsset() { return (this.url.indexOf("Assets") >= 0); }

	/**
	 * Is the image loaded?
	 */
	isLoaded() { return this.state == CachedImageState.LOADED; }
}

const ImageCachePurgeDelay = 20 * 60 * 1000; /* 30 minutes */

/**
 * The class responsible for loading and caching images
 */
class ImageCacheClass {
	constructor() {
		/** @type {Map<string, CachedImage>} */
		this.cache = new Map();
		this.loadedCount = 0;
		this.purgeTimer = setInterval(() => this.purge(), ImageCachePurgeDelay);
	}

	/**
	 * Get a cached image from the cache.
	 *
	 * @param {string} url - The URL of the image to lookup
	 * @param {function(CachedImage):void} loadCallback - A callback that will be called when the load completes
	 * @returns {CachedImage} The cached image
	 */
	get(url, loadCallback = null) {
		let image = this.cache.get(url);
		if (!image) {
			image = new CachedImage(this, url, loadCallback);
			this.cache.set(url, image);
		}

		image.lastUsed = CommonTime();

		// start loading the image
		image.load();

		// returns the final image
		return image;
	}

	/**
	 * Add a cached image to the cache.
	 * @param {string} url - The URL of the image to store
	 * @param {HTMLImageElement|HTMLCanvasElement} image - The element to use as the image
	 * @returns CachedImage
	 */
	set(url, image) {
		let img = new CachedImage(this, url);
		// Subtract one because we're replacing something.
		if (this.cache.get(url))
			this.loadedCount -= 1;
		this.cache.set(url, img);
		img.setElement(image);
		return img;
	}

	/**
	 * Remove a cached image by its URL.
	 * @param {string} url - The URL of the image to delete
	 */
	delete(url) {
		this.cache.delete(url);
	}

	/**
	 * Iterate over all cached images
	 * @param {any} callback - The callback to call on each (URL, image) pair
	 */
	forEach(callback) {
		this.cache.forEach(callback);
	}

	/**
	 * Clear all cached images
	 */
	clear() {
		this.cache.clear();
		this.loadedCount = 0;
	}

	/**
	 * Private function called when an image state changes.
	 *
	 * @param {CachedImage} image - The image whose state changed
	 */
	_imageStateDidChange(image) {
		const RetryTimers = [1000, 10000, 30000, 60000, 120000, 300000];
		if (image.state == CachedImageState.LOADED) {
			this.loadedCount += 1;
			if (image.loadCallback)
				image.loadCallback(image);

			if (!image.manual)
				this._refreshCanvas();
		} else if (image.state == CachedImageState.ERRORED) {
			if (image.errorCount < RetryTimers.length) {
				let backoff = RetryTimers[image.errorCount - 1];
				console.warn("Error loading image, retrying after " + backoff + "ms: " + image.url);
				setTimeout(() => {
					image._refresh();
				}, backoff);
			} else {
				// Load failed. Display the error in the console and mark it as failed.
				console.error("Failed to load image " + image.url);
				image.state = CachedImageState.FAILED;

				if (!image.manual)
					this._refreshCanvas();
			}
		}
	}

	/**
	 * Conditionally refreshes character canvas when an image's state changes.
	 * @private
	 */
	_refreshCanvas() {
		if (this.loadedImages() == this.totalImages()) {
			CharacterLoadCanvasAll();
		}
	}

	/**
	 * Purge all images errored or not used in the last half-purge delay
	 */
	purge() {
		let stats = { errored: 0, unused: 0, loaded: 0 };
		console.log(`Purging ${this.totalImages()} cached images`);
		this.cache.forEach((image, url) => {
			// Clear errored images
			if (image.state == CachedImageState.ERRORED) {
				stats.errored += 1;
				this.cache.delete(url);
			} else if ((image.lastUsed + (ImageCachePurgeDelay / 2)) < CommonTime()) {
				stats.unused += 1;
				this.cache.delete(url);
			} else if (image.state == CachedImageState.LOADED) {
				stats.loaded += 1;
			}
		});
		console.log(`Cache purged, ${stats.errored} errored, ${stats.unused} unused, ${stats.loaded} loaded`);
		this.loadedCount = stats.loaded;
	}

	/**
	 * Get the count of cached images.
	 */
	totalImages() { return this.cache.size; }

	/**
	 * Get the count of loaded images.
	 */
	loadedImages() { return this.loadedCount; }
}

const ImageCache = new ImageCacheClass();
