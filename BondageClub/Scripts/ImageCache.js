"use strict";

/**
 * What state is the image in.
 *
 * UNCACHED (initial) -> LOADING
 * LOADING -> LOADED (final)
 * LOADING -> ERRORED (entering retry loop)
 * ERRORED -> LOADING
 * LOADING -> FAILED (final)
 *
 * @enum string
 */
const CachedImageState = {
	/** Image is known, but not yet cached */
	UNCACHED: 'uncached',
	/** Image is currently being loaded */
	LOADING: 'loading',
	/** Image is available in cache */
	LOADED: 'loaded',
	/** Image is being loaded, but experiencing an error and will be retried */
	ERRORED: 'errored',
	/** Image couldn't be cached */
	FAILED: 'failed',
};

/**
 * A callback called when an image is loaded.
 * @typedef {function(CachedImage):void} CachedImageLifetimeCallback
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
	 * @param {object} [options]
	 * @param {CachedImageLifetimeCallback} [options.loadCallback] - The function to call when the image loads
	 * @param {CachedImageLifetimeCallback} [options.unloadCallback] - The function to call when the image unloads
	 */
	constructor(cache, url, {loadCallback = null, unloadCallback = null}) {
		/**
		 * Only used to inform the cache of loading progress
		 * @type {ImageCacheClass}
		 * @private
		 */
		this.cache = cache;
		/** @type {string} */
		this.url = url;
		/** @type {CachedImageState} */
		this.state = CachedImageState.UNCACHED;
		/** @type {number} */
		this.errorCount = 0;
		/** @type {number} */
		this.backoffTimer = null;
		/** @type {CachedImageLifetimeCallback} */
		this.loadCallback = loadCallback;
		/** @type {CachedImageLifetimeCallback} */
		this.unloadCallback = unloadCallback;
		/** @type {HTMLImageElement | HTMLCanvasElement} */
		this.element = null;
		/** @type {object} */
		this.userData = {};
		/** @type {number} */
		this.lastUsed = null;
		/** @type {boolean} */
		this.manual = false;
	}

	/**
	 * Load the cached image if it's not already available
	 */
	load() {
		// Ensure there's only one image load in progress
		if (this.isLoading() || this.isDoneLoading()) return;

		// Get a new image element to perform the loading for us
		this.element = new Image();

		// Set up listeners to keep track of the loading process
		this.element.addEventListener("load", () => {
			this.state = CachedImageState.LOADED;
			this.cache._imageStateDidChange(this);
		});

		this.element.addEventListener("error", () => {
			this.state = CachedImageState.ERRORED;
			this.cache._imageStateDidChange(this);
		});

		// Start loading, reset error count
		this.errorCount = 0;
		this._refresh();
	}

	/**
	 * Unload the image from the cache
	 */
	unload() {
		if (this.state === CachedImageState.UNCACHED) return;

		if (this.unloadCallback)
			this.unloadCallback(this);

		if (this.backoffTimer)
			clearTimeout(this.backoffTimer);

		this.userData = {};
		this.state = CachedImageState.UNCACHED;
	}

	/**
	 * Manually set the cached image to the given element.
	 * @param {HTMLImageElement | HTMLCanvasElement} element - The element to set
	 */
	setElement(element) {
		this.unload();
		this.element = element;
		this.errorCount = 0;
		this.state = CachedImageState.LOADED;
		this.manual = true;
		this.cache._imageStateDidChange(this);
	}

	/**
	 * Refresh the given image.
	 */
	_refresh() {
		if ([CachedImageState.LOADING, CachedImageState.FAILED].includes(this.state)) return;

		this.unload();
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
	 * Is the image currently being loaded?
	 */
	isLoading() { return [CachedImageState.LOADING, CachedImageState.ERRORED].includes(this.state); }

	/**
	 * Is the image loading complete (either succesfully or not)?
	 */
	isDoneLoading() { return [CachedImageState.LOADED, CachedImageState.FAILED].includes(this.state); }

	/**
	 * Is the image experiencing problems loading?
	 */
	isFailing() { return [CachedImageState.FAILED, CachedImageState.ERRORED].includes(this.state); }

	/**
	 * Is the image loaded and ready?
	 */
	isLoaded() { return this.state == CachedImageState.LOADED; }
}

/**
 * The delay between each cache purge event, in milliseconds.
 *
 * When the cache purges, this value is halved, and used to find any assets that
 * haven't been used. Those are the ones that will be removed.
 */
let ImageCachePurgeDelay = 60 * 60 * 1000;

/**
 * The class responsible for loading and caching images
 */
class ImageCacheClass {
	constructor() {
		/** @type {Map<string, CachedImage>} */
		this.cache = new Map();
		this.loadedCount = 0;
		this.missingCount = 0;
		this.lastPurge = 0;
	}

	/**
	 * Get a cached image from the cache.
	 *
	 * @param {string} url - The URL of the image to lookup
	 * @param {object} [options]
	 * @param {CachedImageLifetimeCallback} [options.loadCallback] - A callback that will be called when the load completes
	 * @param {CachedImageLifetimeCallback} [options.unloadCallback] - A callback that will be called when the image is removed from the cache
	 * @returns {CachedImage} The cached image
	 */
	get(url, options = {}) {
		let image = this.cache.get(url);
		if (!image) {
			image = new CachedImage(this, url, options);
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
	 * @param {object} [options]
	 * @param {CachedImageLifetimeCallback} [options.loadCallback] - A callback that will be called when the load completes
	 * @param {CachedImageLifetimeCallback} [options.unloadCallback] - A callback that will be called when the image is removed from the cache
	 * @returns CachedImage
	 */
	set(url, image, options = {}) {
		let img = new CachedImage(this, url, options);
		this.delete(url);

		this.cache.set(url, img);
		img.setElement(image);
		return img;
	}

	/**
	 * Checks whether a given URL is currently in cache.
	 *
	 * Note that it has nothing to do with the actual state of the image (loaded or not)
	 *
	 * @param {string} url - The URL of the image to check
	 * @returns {boolean} true if the URL is known, false otherwise.
	 */
	has(url) {
		return this.cache.has(url);
	}

	/**
	 * Remove a cached image by its URL.
	 * @param {string} url - The URL of the image to delete
	 */
	delete(url) {
		const known = this.cache.get(url);
		if (!known) return;

		// That's already in the cache, correct our counters depending on the state
		if (known.isLoaded())
			this.loadedCount -= 1;
		else if (known.isFailing())
			this.missingCount -= 1;

		known.unload();
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
		this.cache.forEach(img => {
			img.unload();
		});
		this.cache.clear();

		this.loadedCount = 0;
		this.missingCount = 0;
	}

	/**
	 * Private function called when an image state changes.
	 *
	 * @param {CachedImage} image - The image whose state changed
	 */
	_imageStateDidChange(image) {
		// Ignore images that aren't in the cache, which can happen if they get
		// pruned while their load is still in progress.
		if (!this.cache.has(image.url)) return;

		const RetryTimers = [1000, 10000, 30000, 60000, 120000, 300000];
		if (image.isLoaded()) {
			// That image had some failure before we finally succeeded, meaning
			// it has been considered missing at some point.
			if (image.errorCount > 0) {
				this.missingCount -= 1;
				image.errorCount = 0;
			}

			this.loadedCount += 1;
			if (image.loadCallback)
				image.loadCallback(image);

			if (!image.manual)
				this._refreshCanvas();
		} else if (image.state == CachedImageState.ERRORED) {
			// First reported failure, count it as a missing image
			if (image.errorCount === 0)
				this.missingCount += 1;
			image.errorCount += 1;

			// Attempt to refresh again, waiting increasingly longer in case it's
			// a transient issue.
			if (image.errorCount < RetryTimers.length) {
				let backoff = RetryTimers[image.errorCount - 1];
				if (!image.backoffTimer) {
					console.warn("Error loading image, retrying after " + backoff + "ms: " + image.url);
					image.backoffTimer = setTimeout(() => {
						image.backoffTimer = null;
						image._refresh();
					}, backoff);
				}
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
		if (this.loadedImages() + this.missingImages() == this.totalImages()) {
			CharacterLoadCanvasAll();
		}
	}

	/**
	 * Purge all images errored or not used in the last half-purge delay
	 */
	purge(force = false) {
		// Only perform a purge if the last purge time makes sense, and its delta
		// is greater than the purge delay.
		const delta = (CurrentTime - this.lastPurge);
		if (!force && delta > 0 && delta < ImageCachePurgeDelay)
			return;

		const startingTotal = this.totalImages();
		this.cache.forEach((image, url) => {
			// Clear images experiencing problems, or that were loaded for longer
			// than half a purge delay
			if (image.state == CachedImageState.ERRORED
				|| image.state == CachedImageState.FAILED
				|| (image.lastUsed + (ImageCachePurgeDelay / 2)) < CommonTime()) {
				this.delete(url);
			}
		});
		console.log(`Cache purged, ${startingTotal - this.totalImages()} images removed`);
		this.lastPurge = CurrentTime;
		this.stats();
	}

	/**
	 * Output some stats about the cache and recalculate our counts
	 */
	stats() {
		let stats = { total: this.cache.size, loaded: 0, missing: 0, errored: 0 };
		this.cache.forEach((image) => {
			// Clear errored images
			if (image.state == CachedImageState.ERRORED) {
				stats.missing += 1;
			} else if (image.state == CachedImageState.FAILED) {
				stats.missing += 1;
			} else if (image.state == CachedImageState.LOADED) {
				stats.loaded += 1;
				// Sort loaded images into 5-minute wide "generations"
				const key = `gen${Math.floor((CurrentTime - image.lastUsed) / (5 * 60 * 1000))}`;
				stats[key] = (stats[key] || 0) + 1;
			}
		});

		this.loadedCount = stats.loaded;
		this.missingCount = stats.missing + stats.errored;

		console.log(`Cache stats: ${[...Object.entries(stats)].map(e => e[0] + ": " + e[1]).join(", ")}`);
	}

	/**
	 * Get the count of cached images.
	 */
	totalImages() { return this.cache.size; }

	/**
	 * Get the count of loaded images.
	 */
	loadedImages() { return this.loadedCount; }

	/**
	 * Get the count of missing images (failing or errored).
	 */
	missingImages() { return this.missingCount; }
}

const ImageCache = new ImageCacheClass();
