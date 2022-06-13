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
		/** @type {ImageLoadCallback} */
		this.loadCallback = loadCallback;
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
		if ([CachedImageState.LOADING, CachedImageState.FAILED].includes(this.state)) return;

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

let ImageCachePurgeDelay = 30 * 60 * 1000; /* minutes */

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
	 * @param {ImageLoadCallback} loadCallback - A callback that will be called when the load completes
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
		this.missingCount = 0;
	}

	/**
	 * Private function called when an image state changes.
	 *
	 * @param {CachedImage} image - The image whose state changed
	 */
	_imageStateDidChange(image) {
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

		let stats = { errored: 0, unused: 0, missing: 0, loaded: 0 };
		console.log(`Purging ${this.totalImages()} cached images`);
		this.cache.forEach((image, url) => {
			// Clear errored images
			if (image.state == CachedImageState.ERRORED) {
				stats.errored += 1;
				stats.missing += 1;
				this.cache.delete(url);
			} else if (image.state == CachedImageState.FAILED) {
				stats.missing += 1;
			} else if ((image.lastUsed + (ImageCachePurgeDelay / 2)) < CommonTime()) {
				stats.unused += 1;
				this.cache.delete(url);
			} else if (image.state == CachedImageState.LOADED) {
				stats.loaded += 1;
			}
		});
		console.log(`Cache purged, ${stats.errored} errored, ${stats.unused} unused, ${stats.missing} missing, ${stats.loaded} loaded`);
		this.loadedCount = stats.loaded;
		this.missingCount = stats.missing;
		this.lastPurge = CurrentTime;
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
