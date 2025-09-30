//TODO: generic-file
/**
 * Loads assets (images/audio) from a key-path map into a Phaser scene.
 * Supports base64 data URLs and file extensions for type detection.
 * @param {Phaser.Scene} scene - The Phaser scene to load assets into (usually 'this' in preload)
 * @param {Record<string, string>} assets - Map of asset keys to paths (URL or base64)
 */

export const phaserHelpers = {
    loadAssetsToPhaser,
};

function loadAssetsToPhaser(
    scene: Phaser.Scene,
    assets: Record<string, string>
) {
    Object.entries(assets).forEach(([key, path]) => {
        if (typeof path !== "string") return;
        // Skip atlas files (they'll be loaded separately)
        if (key.includes("-atlas")) {
            return;
        }

        // For base64 data URLs, we need to specify the type
        if (path.includes("image")) {
            scene.load.image(key, path);
        } else if (path.includes("audio")) {
            scene.load.audio(key, path);
        }
    });
}

